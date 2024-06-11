import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Paperclip, Trash2 } from 'react-feather'
import style from './note.module.scss'
import fileExtension from 'file-extension'
import { getUserFromList, getUserListForNoteReply, getUsersListForPayload } from './note.service'
import { Mention, MentionsInput, SuggestionDataItem, MentionItem } from 'react-mentions'
import { editorCss } from './mentions-input-style'
import defaultMentionStyle from './mentions-popup-style'
import { MeasureTask, Note, User, UserId } from '../Types'
import { debounce } from '../util'
import { OROSpinner } from '../Loaders'
import { checkFileForS3Upload, inputFileAcceptType } from '../Inputs'
import { OROFileIcon } from '../RequestIcon'
import { OroButton } from '../controls'
import { NoteInput } from './types'
import { ClickAwayListener } from '@mui/material'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../i18n'

export interface NoteReplyInputProps {
    issueTask: MeasureTask
    replyNoteForEdit?: Note
    focused?: boolean
    onCancelClick?: () => void
    onClickOutside?: () => void
    getUserSuggestions?: (query: string) => Promise<User[]>
    onPrivateNoteReplyAdded?: (task: MeasureTask, note: NoteInput, file: Array<File> | undefined) => void
    onDeleteReplyAttachment?: (noteId: string, replyNoteId: string, docId: string) => void
    onPrivateNoteReplyUpdated?: (task: MeasureTask, note: NoteInput, file: Array<File> | undefined) => void
}

export function NoteReplyInputComponent (props: NoteReplyInputProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.NOTES)
  const [newCommentMeta, setNewCommentMeta] = useState<string>('')
  const [newComment, setNewComment] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([])
  const [replyNoteForEdit, setReplyNoteForEdit] = useState<Note | null>(null)
  const inputReplyEl = useRef<any>(null)
  const [selectedUsersList, setSelectedUsersList] = useState<Array<UserId>>([])
  const [usersList, setUsersList] = useState<Array<UserId>>([])
  const [isCustomTriggerActivated, setIsCustomTriggerActivated] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => {
    if (inputReplyEl && inputReplyEl?.current) {
      inputReplyEl.current.focus()
    }
  }, [inputReplyEl, inputReplyEl.current, props.focused])

  function onInputChange (event: { target: { value: string } }, newValue: string, newPlainTextValue: string, mentions: MentionItem[]) {
    const _usersList: Array<UserId> = []
    if (mentions.length > 0) {
      for (let i = 0; i < mentions.length; i++) {
        const user = getUserListForNoteReply(mentions[i])
        if (user) _usersList.push(user)
      }
    }
    if (newValue) {
      const lastCharacter = newValue.slice(-1)
      if (lastCharacter === '@') {
        setIsCustomTriggerActivated(true)
      } else {
        setIsCustomTriggerActivated(false)
      }
    } else {
      setUsersLoading(false)
      setIsCustomTriggerActivated(false)
    }
    const uniqueUsers = _usersList.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.userName === value.userName
      ))
    )
    setSelectedUsersList(uniqueUsers)
    setNewCommentMeta(newValue)
    setNewComment(newPlainTextValue)
  }

  function customSuggestionsContainer (children: React.ReactNode): React.ReactNode {
    return <div className={style.mentionsContainer}>
      {isCustomTriggerActivated && <div className={style.mentionsContainerDefaultText}>{t("--typeAUserNameToSearch--")}</div>}
      {usersLoading && <div className={style.mentionsContainerDefaultText}><OROSpinner height={16} width={16} borderWidth={2}></OROSpinner> {t("--searchingForUsers--")}</div>}
      {!isCustomTriggerActivated && !usersLoading && <>
        {children}
      </>}
    </div>
  }

  function renderSuggestion (suggestion: SuggestionDataItem, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) {
    return <div className={style.mentionsInfo}>
      <div className={style.mentionsInfoPic}>
        <img src={getUserFromList(suggestion, usersList, selectedUsersList)?.picture} alt="" />
      </div>
      <div className={style.mentionsInfoDetails}>
        <div className={style.mentionsInfoText}>{highlightedDisplay}</div>
        <div className={style.mentionsInfoEmail}>{getUserFromList(suggestion, usersList, selectedUsersList)?.email}</div>
      </div>
    </div>
  }

  function onDeleteUploadedReplyNoteAttachment () {
    if (props.onDeleteReplyAttachment && replyNoteForEdit?.id && replyNoteForEdit?.documents && replyNoteForEdit.documents?.length > 0) {
      props.onDeleteReplyAttachment(props.issueTask.id, replyNoteForEdit.id, replyNoteForEdit?.documents[0].id)
    }
  }

  function searchUsers (query: string, callback: (data: SuggestionDataItem[]) => void) {
    if (!query) {
      setUsersLoading(false)
      return
    }
    setUsersLoading(true)
    setIsCustomTriggerActivated(false)
    if (props.getUserSuggestions) {
      props.getUserSuggestions(query)
        .then(users => {
          setUsersList(getUsersListForPayload(users))
          return users.map(user => ({ display: `${user.firstName} ${user.lastName}`, id: user.userName }))
        })
        .then(data => {
          setUsersLoading(false)
          return callback(data)
        })
        .catch(err => {
          setUsersLoading(false)
          console.log(err)
        })
    }
  }
  const handleFileSelection = (event) => {
    event.preventDefault()
    const files: Array<File> = []
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(checkFileForS3Upload(event.target.files[i]))
    }
    setSelectedFiles([...selectedFiles, ...files])
  }

  const delayedUserSearch = useCallback(debounce((query: string, callback: (data: SuggestionDataItem[]) => void) => searchUsers(query, callback), 500), [newComment, newCommentMeta, selectedUsersList, usersList, props.getUserSuggestions])

  function resetAllActions () {
    setSelectedFiles([])
    setReplyNoteForEdit(null)
    if (props.onCancelClick) {
        props.onCancelClick()
      }
  }

  function submitComment () {
    const commentWithNoWhiteSpaces = newComment.trim()
    if (commentWithNoWhiteSpaces && props.onPrivateNoteReplyAdded && !replyNoteForEdit) {
      props.onPrivateNoteReplyAdded(props.issueTask, { noteId: '', comment: commentWithNoWhiteSpaces, commentMeta: newCommentMeta, users: selectedUsersList }, selectedFiles || undefined)
    } else if (commentWithNoWhiteSpaces && props.onPrivateNoteReplyUpdated && replyNoteForEdit?.id) {
      props.onPrivateNoteReplyUpdated(props.issueTask, { noteId: replyNoteForEdit?.id, comment: commentWithNoWhiteSpaces, commentMeta: newCommentMeta, users: selectedUsersList  }, selectedFiles || undefined)
    }
    setNewComment('')
    setNewCommentMeta('')
    setSelectedFiles([])
    setReplyNoteForEdit(null)
  }

  function onClickOutside () {
    if (!newComment && selectedFiles?.length === 0 && !replyNoteForEdit && props.onClickOutside) {
      props.onClickOutside()
    }
  }

  return <>
    <ClickAwayListener onClickAway={onClickOutside}>
            <div className={style.notesListsReplyBox}>
                <div className={style.notesListsReplyBoxInput}>
                <div className={style.mentions}>
                    <MentionsInput
                    value={newCommentMeta || replyNoteForEdit?.commentMeta || replyNoteForEdit?.comment || ''}
                    onChange={onInputChange}
                    style={editorCss}
                    inputRef={inputReplyEl}
                    customSuggestionsContainer={customSuggestionsContainer}
                    allowSuggestionsAboveCursor
                    allowSpaceInQuery
                    placeholder={t("--replying--")}
                    a11ySuggestionsListLabel={t("--suggestedReplyMentions--")}
                    >
                    <Mention
                        displayTransform={(id: string, display: string) => `@${display}`}
                        trigger="@"
                        isLoading={isCustomTriggerActivated || usersLoading}
                        appendSpaceOnAdd
                        renderSuggestion={renderSuggestion}
                        data={delayedUserSearch}
                        style={defaultMentionStyle}
                    />
                    </MentionsInput>
                </div>
                </div>
                {
                ((selectedFiles.length > 0 && !replyNoteForEdit) || (selectedFiles.length > 0 && replyNoteForEdit?.documents?.length === 0)) &&
                <div className={style.notesListsAttachmentContainer}>
                    <div className={style.notesListsAttachmentContainerWrapper}>
                      {
                        selectedFiles.map((file, index) => {
                          return <div className={style.notesListsSelectedAttachment} key={index}>
                              <div className={style.notesListsSelectedAttachmentContainer}>
                                <div className={style.notesListsSelectedAttachmentIcon}>
                                  <OROFileIcon fileType={fileExtension(file.name)}></OROFileIcon>
                                </div>
                                <div className={style.notesListsSelectedAttachmentContainerName}>{file.name}</div>
                              </div>
                              <Trash2 cursor={'pointer'} size={16} color='var(--warm-neutral-shade-200)' onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}/>
                            </div>
                        })
                      }
                    </div>
                </div>
                }
                {
                replyNoteForEdit?.documents && replyNoteForEdit?.documents?.length > 0 &&
                <div className={style.notesListsAttachmentContainer}>
                    <div className={style.notesListsAttachmentContainerWrapper}>
                    <div className={style.notesListsSelectedAttachment}>
                        <div className={style.notesListsSelectedAttachmentContainer}>
                        <div className={style.notesListsSelectedAttachmentIcon}>
                            <OROFileIcon fileType={fileExtension(replyNoteForEdit?.documents[0].name)}></OROFileIcon>
                        </div>
                        <div className={style.notesListsSelectedAttachmentContainerName}>{replyNoteForEdit?.documents[0].name}</div>
                        </div>
                        <Trash2 cursor={'pointer'} size={16} color='var(--warm-neutral-shade-200)' onClick={onDeleteUploadedReplyNoteAttachment}/>
                    </div>
                    </div>
                </div>
                }
                <div className={style.notesListsReplyBoxActions}>
                <div className={style.notesListsReplyBoxActionsAttachment}>
                    <><Paperclip className={style.notesListsReplyBoxActionsAttachmentIcon} size={16} color='var(--warm-neutral-shade-200)' />
                    <input
                    name="file"
                    className={style.notesListsReplyBoxActionsAttachmentInput}
                    type="file"
                    title=""
                    multiple
                    accept={inputFileAcceptType}
                    onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
                    onChange={(e) => handleFileSelection(e)}
                    /></>
                </div>
                <div className={style.notesListsReplyBoxActionsButtons}>
                    <OroButton label={t("--cancel--")} radiusCurvature='medium' type='secondary' onClick={resetAllActions} />
                    <button className={style.notesListsReplyBoxActionsSubmit} onMouseDown={submitComment}>{replyNoteForEdit ? t("--update--") : t("--reply--")}</button>
                </div>
                </div>
            </div>
        </ClickAwayListener>
    </>
}

export function NoteReplyInput (props: NoteReplyInputProps) {
  return <I18Suspense><NoteReplyInputComponent {...props}></NoteReplyInputComponent></I18Suspense>
}
