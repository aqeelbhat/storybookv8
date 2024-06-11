/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
  import { FileUploadButton } from 'react-file-utils'
  import React, { useCallback, useEffect, useRef, useState } from 'react'
  import { useReactMediaRecorder } from 'react-media-recorder'
  import { Mic, Paperclip, X } from 'react-feather'
  import lock from './assets/lock_filled.svg'
  import { MentionsInput, Mention, SuggestionDataItem, MentionItem } from 'react-mentions'
  import defaultMentionStyle from './mentions-popup-style'
  import { editorCss } from './mentions-input-style'
  import { StreamMessageType } from './types'
  import { Attachment, MeasureTask, User, UserId, mapMeasureTask } from '../Types'
  import { debounce } from '../util'
  import { OROSpinner } from '../Loaders'
  import { OROFileIcon } from '../RequestIcon'
  import { inputFileAcceptType } from '../Inputs'
  import { OroButton } from '../controls'
  import style from './note.module.scss'
  import fileExtension from 'file-extension'
  import { getUserFromList, getUsersListForPayload } from './note.service'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../i18n'

interface MessageInputProps {
  submitButtonLabel?: string,
  selectedMessagetype?: StreamMessageType,
  newCreatedPrivateNote?: MeasureTask | null
  isCurrentUserAdmin?: boolean
  isExistingNoteEditing?: boolean
  isNewNote?: boolean
  getUserSuggestions?: (query: string) => Promise<User[]>
  onUpdatePrivateNote?: (note: MeasureTask) => void
  handleChange?: (newValue: MeasureTask) => void
  onDeletePrivateNoteAttachment?: (noteId: string, attachment: Attachment) => void
  onPreviewPrivateNoteAttachment?: (noteId: string, attachment: Attachment) => void
  onNewNoteAdded?: (note: MeasureTask, files?: Array<File>) => void
  onUploadPrivateNoteAttachment?: (noteId: string, file: File) => void
  onClickOutside?: (text: string) => void,
  onCancel?: () => void
}
  
  export const MessageInputComponent = (props: MessageInputProps) => {
    const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ audio: true, blobPropertyBag: { type: 'audio/mp3' } })
    const [startedRecording, setStartedRecording] = useState(false)
    const [newNote, setNewNote] = useState<string>('')
    const [newNotePlainText, setNewNotePlainText] = useState<string>('')
    const [attachments, setAttachments] = useState<Array<Attachment>>([])
    const [usersList, setUsersList] = useState<Array<UserId>>([])
    const [selectedUsersList, setSelectedUsersList] = useState<Array<UserId>>([])
    const [isCustomTriggerActivated, setIsCustomTriggerActivated] = useState(false)
    const [usersLoading, setUsersLoading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<Array<File>>([])
    const inputEl = useRef<any>(null)
    const { t } = useTranslationHook(NAMESPACES_ENUM.NOTES)
  
    useEffect(() => {
      if (props.newCreatedPrivateNote) {
        if (Array.isArray(props.newCreatedPrivateNote?.attachments)) {
          setAttachments(props.newCreatedPrivateNote.attachments)
        }
        if (!newNote && (props.newCreatedPrivateNote?.descriptionMeta || props.newCreatedPrivateNote?.description)) {
          setNewNote(props.newCreatedPrivateNote.descriptionMeta || props.newCreatedPrivateNote.description)
        }
        if (props.newCreatedPrivateNote?.users) {
          setSelectedUsersList(props.newCreatedPrivateNote.users)
        }
      }
    }, [props.newCreatedPrivateNote])

    useEffect(() => {
      if (inputEl && inputEl?.current) {
        inputEl.current.focus()
      }
    }, [inputEl.current])
  
    function submitPrivateNote () {
      const commentWithNoWhiteSpaces = newNote.replace(/&nbsp;/g, ' ').trim()
      if (commentWithNoWhiteSpaces && props.onNewNoteAdded && props.newCreatedPrivateNote) {
        props.onNewNoteAdded({ ...props.newCreatedPrivateNote, descriptionMeta: commentWithNoWhiteSpaces, users: selectedUsersList, publicNote: props.selectedMessagetype === StreamMessageType.public })
      } else if (commentWithNoWhiteSpaces && props.onNewNoteAdded) {
        props.onNewNoteAdded(mapMeasureTask({ description: newNotePlainText, descriptionMeta: commentWithNoWhiteSpaces, users: selectedUsersList, publicNote: props.selectedMessagetype === StreamMessageType.public }), selectedFiles)
      }
    }
  
    useEffect(() => {
      if (mediaBlobUrl) {
        fetch(mediaBlobUrl)
          .then((res) => res.blob())
          .then((myBlob) => {
            const myFile = new File([myBlob], `audio-recording-${new Date()}`, {
              type: myBlob.type
            })
            if (props.newCreatedPrivateNote?.id && props.onUploadPrivateNoteAttachment) {
              props.onUploadPrivateNoteAttachment(props.newCreatedPrivateNote.id, myFile)
            } else {
              setSelectedFiles([...selectedFiles, myFile])
            }
            clearBlobUrl()
          })
      }
    }, [mediaBlobUrl])
  
    function startRecordingInternal () {
      setStartedRecording(true)
      startRecording()
    }
  
    function stopRecordingInternal () {
      stopRecording()
      setStartedRecording(false)
    }
  
    function submitMessage (e: React.BaseSyntheticEvent) {
      stopRecordingInternal()
      submitPrivateNote()
    }
  
    function onCancelClick () {
      if (props.onCancel) {
        props.onCancel()
      }
    }
  
    function handleUploadAttachment (files: FileList | File[]) {
      if (files && files.length && props.newCreatedPrivateNote?.id && props.onUploadPrivateNoteAttachment) {
        props.onUploadPrivateNoteAttachment(props.newCreatedPrivateNote.id, files[0])
      } else {
        setSelectedFiles([...selectedFiles, files[0]])
      }
    }
  
    function onDeletePrivateNoteAttachment (e: React.MouseEvent, attachment: Attachment): void {
      e.stopPropagation()
      if (typeof props.onDeletePrivateNoteAttachment === 'function' && props.newCreatedPrivateNote) {
        props.onDeletePrivateNoteAttachment(props.newCreatedPrivateNote.id, attachment)
      }
    }
  
    function onPreviewPrivateNoteAttachment (attachment: Attachment): void {
      if (typeof props.onPreviewPrivateNoteAttachment === 'function' && props.newCreatedPrivateNote) {
        props.onPreviewPrivateNoteAttachment(props.newCreatedPrivateNote.id, attachment)
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
  
    const delayedUserSearch = useCallback(debounce((query: string, callback: (data: SuggestionDataItem[]) => void) => searchUsers(query, callback), 500), [newNote, attachments, props.newCreatedPrivateNote, selectedFiles, newNotePlainText, selectedUsersList, usersList, props.getUserSuggestions])
  
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
  
    function customSuggestionsContainer (children: React.ReactNode): React.ReactNode {
      return <div className={style.mentionsContainer}>
        {isCustomTriggerActivated && <div className={style.mentionsContainerDefaultText}>{t("--typeAUserNameToSearch--")}</div>}
        {usersLoading && <div className={style.mentionsContainerDefaultText}><OROSpinner height={16} width={16} borderWidth={2}></OROSpinner> {t("--searchingForUsers--")}</div>}
        {!isCustomTriggerActivated && !usersLoading && <>
          {children}
        </>}
      </div>
    }
  
    function onInputChange (event: { target: { value: string } }, newValue: string, newPlainTextValue: string, mentions: MentionItem[]) {
      const _usersList: Array<UserId> = props.isNewNote ? [] : selectedUsersList
      if (mentions.length > 0) {
        for (let i = 0; i < mentions.length; i++) {
          const user = getUserFromList(mentions[i], usersList, selectedUsersList)
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
      if (props.handleChange && props.newCreatedPrivateNote?.id) {
        props.handleChange({...props.newCreatedPrivateNote, description: newPlainTextValue, descriptionMeta: newValue, users: uniqueUsers})
      }
      setNewNote(newValue)
      setNewNotePlainText(newPlainTextValue)
      setSelectedUsersList(uniqueUsers)
    }

    function getPlaceholderTextAsPerMessageType (type: StreamMessageType): string {
      if (type === StreamMessageType.private) {
        return t("--jotDownNotesOrMentionToSpeakPrivately--")
      }
      return t("--startNewConversationMentionToNotifyThem--")
    }
  
    return (
      <>
        <div className={style.oroChatInputContainer} role="presentation" tabIndex={0}>
          <div className={style.oroChatInputContainerContent}>
            <div className={style.oroChatInputContainerContentWrapper}>
              {props.selectedMessagetype === StreamMessageType.private && <div className={style.oroChatInputContainerContentWrapperInfo}><img src={lock} alt='' /> {t("--thisIsPrivateConversation--")}</div>}
              <div className={style.oroChatInputContainerContentWrapperTextarea}>
                <div className={style.mentions}>
                  <MentionsInput
                    value={newNote}
                    onChange={onInputChange}
                    style={editorCss}
                    inputRef={inputEl}
                    customSuggestionsContainer={customSuggestionsContainer}
                    allowSuggestionsAboveCursor
                    allowSpaceInQuery
                    placeholder={getPlaceholderTextAsPerMessageType(props.selectedMessagetype || StreamMessageType.public)}
                    a11ySuggestionsListLabel={t("--suggestedMentions--")}
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
              { attachments.length > 0 && <div className={style.attachment}>
                  <ul className={style.attachmentList}>
                    { attachments.map((attachment: Attachment, index: number) => <li className={style.attachmentListItem} onClick={() => onPreviewPrivateNoteAttachment(attachment) } key={index}>
                        <div className={style.attachmentListItemIcon}>
                          <OROFileIcon fileType={attachment?.mediatype || ''}></OROFileIcon>
                        </div>
                        <span className={style.attachmentListItemName}>{ attachment.filename }</span>
                        <X size={18} color='var(--warm-neutral-shade-200)' cursor={'pointer'} onClick={(e) => { onDeletePrivateNoteAttachment(e, attachment) }} />
                    </li>) }
                  </ul>
                </div> }
              { !props.newCreatedPrivateNote && selectedFiles.length > 0 && <div className={style.attachment}>
                  <ul className={style.attachmentList}>
                    { selectedFiles.map((attachment: File, index: number) => <li className={style.attachmentListItem} onClick={() => onPreviewPrivateNoteAttachment(attachment) } key={index}>
                        <div className={style.attachmentListItemIcon}>
                          <OROFileIcon fileType={fileExtension(attachment.name)}></OROFileIcon>
                        </div>
                        <span className={style.attachmentListItemName}>{ attachment.name }</span>
                        <X size={18} color='var(--warm-neutral-shade-200)' cursor={'pointer'} onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} />
                    </li>) }
                  </ul>
                </div> }
              <div className={style.customInputActions}>
                <div className={style.customInputActionsContainer}>
                  <div className={style.customInputActionsContainerContent}>
                      <FileUploadButton handleFiles={handleUploadAttachment} accepts={inputFileAcceptType} multiple={false}>
                        <Paperclip className={style.customInputActionsContainerContentIcon} size={16} color='var(--warm-neutral-shade-200)'></Paperclip>
                      </FileUploadButton>
                      <div className={style.customInputActionsContainerContentRecorder}>
                        {!startedRecording && <span onClick={startRecordingInternal}><Mic className={style.customInputActionsContainerContentIcon} size={16} color='var(--warm-neutral-shade-200)'></Mic></span>}
                        {startedRecording && <span onClick={stopRecordingInternal}><Mic opacity={1} size={16} color='var(--warm-stat-chilli-burnt)'></Mic></span>}
                      </div>
                  </div>
                  <div className={style.customInputActionsButtons}>
                    <OroButton label={t("--cancel--")} radiusCurvature='medium' type='secondary' onClick={onCancelClick} />
                    <OroButton type='primary' radiusCurvature='medium' onClick={submitMessage} label={props.submitButtonLabel ? props.submitButtonLabel : t("--submit--")}></OroButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  export function MessageInput (props: MessageInputProps) {
    return <I18Suspense><MessageInputComponent {...props}></MessageInputComponent></I18Suspense>
  }
  