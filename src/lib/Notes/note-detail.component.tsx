import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Search, UserPlus, UserX, X } from 'react-feather'
import style from './note.module.scss'
import { Popover, tooltipClasses } from '@mui/material'
import { getCreatedDateTime, isSignedInUserParticipant, isSignedInUserTaskOwner } from './note.service'
import { Mention, MentionsInput } from 'react-mentions'
import { readonlyCss } from './mentions-input-style'
import defaultMentionStyle from './mentions-popup-style'
import { NoteReplyComponent } from './note-reply.component'
import lock from './assets/lock_filled.svg'
import { NoteActionMenu } from './notes-action-menu.component'
import { Attachment, Contact, MeasureTask, MessageType, NormalizedVendorRef, Note, Option, QuestionnaireId, RoleForms, TaskStatus, User, UserId } from '../Types'
import { createImageFromInitials, debounce } from '../util'
import { getSignedUser } from '../SigninService'
import { OROSpinner } from '../Loaders'
import { SnackbarComponent } from '../Snackbar'
import { getUserDisplayName } from '../Form'
import { OROFileIcon } from '../RequestIcon'
import { MeasureTaskType, NoteInput, Participant } from './types'
import { Translation } from '../Translation'
import { NoteReplyInput } from './note-reply-input.component'
import { OroTooltip } from '../Tooltip/tooltip.component'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { Trans } from 'react-i18next'
export interface PrivateNoteProps {
  issueTask: MeasureTask
  isCurrentUserAdmin?: boolean
  limitedAccess?: boolean
  supplierRoleForms?: Array<RoleForms>
  hideCloseButton?: boolean
  canShowTranslation?: boolean
  isExternalView?: boolean
  isPrivateNoteEnabled?: boolean
  messageIdToBringIntoView?: string
  onCloseIssuePanel?: () => void
  onConversationResolved?: (privateNote: MeasureTask) => void
  onFormViewDetails?: (questionnaireId: QuestionnaireId, participants: Array<Participant>, owner: UserId | null, isIssueResolved?: boolean) => void
  getUserSuggestions?: (query: string) => Promise<User[]>
  onEditNote?: (privateNote: MeasureTask) => void
  onUpdatePrivateNote?: (privateNote: MeasureTask) => void
  onPrivateNoteReplyAdded?: (task: MeasureTask, note: NoteInput, file: Array<File> | undefined) => void
  onPrivateNoteReplyUpdated?: (task: MeasureTask, note: NoteInput, file: Array<File> | undefined) => void
  onPrivateNoteDeleted?: (noteId: string) => void
  onPrivateNoteReplyDeleted?: (measureTaskId: string, replyId: string, parentNoteId?: string) => Promise<MeasureTask>
  onPreviewAttachment?: (noteId: string, attachment: Attachment) => void
  onDeleteReplyAttachment?: (noteId: string, replyNoteId: string, docId: string) => void
  loadReplyAttachment?: (id: string) => Promise<Blob>
}

interface ParticipantsPicReelProps {
  issueTask: MeasureTask
  participants: Array<Participant>
  isCurrentUserAdmin?: boolean
  maxReelItems?: number
  isExternalView?: boolean
  onParticipantAdded?: (participant: Participant) => void
  onParticipantRemoved?: (userName: string) => void
  onAsyncUserSearch?: (keyword: string) => Promise<Option[]>
}

export function getUserProfileInitialsForUser(user: Participant | UserId) {
  const [firstName, lastName] = user?.name ? user.name.split(' ') : ['', '']
  return user?.picture || createImageFromInitials(firstName || (user as UserId)?.firstName || '', lastName || (user as UserId)?.lastName || '')
}

export function ParticipantsPicReelComponent(props: ParticipantsPicReelProps) {
  const MAX_REEL_ITEMS = 4
  const { t } = useTranslationHook(NAMESPACES_ENUM.NOTES)
  const [reelParticipants, setReelParticipants] = useState<Array<Participant>>([])
  const [allParticipants, setAllParticipants] = useState<Array<Participant>>([])
  const [users, setUsers] = useState<Array<Option>>([])
  const [searchKeyWord, setSearchKeyWord] = useState('')
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const reelPopoverRef = useRef<any>(null)
  const [anchorEl, setAnchorEl] = React.useState<any | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(reelPopoverRef.current);
  }

  const handleClose = () => {
    setSearchKeyWord('')
    setUsers([])
    setAnchorEl(null)
  }

  useEffect(() => {
    if (props.participants.length > (props.maxReelItems || MAX_REEL_ITEMS)) {
      setReelParticipants(props.participants.slice(0, (props.maxReelItems || MAX_REEL_ITEMS) - 1))
    } else {
      setReelParticipants(props.participants.slice(0, (props.maxReelItems || MAX_REEL_ITEMS)))
    }

    setAllParticipants(props.participants)
  }, [props.participants])

  function onParticipantAdded(options: Array<Option>) {
    if (typeof props.onParticipantAdded === 'function' && options.length > 0) {
      const participant: Participant = {
        tenantId: options[0].customData.tenantId,
        userName: options[0].customData.userName,
        name: `${options[0].customData.firstName} ${options[0].customData.lastName}`.trim(),
        isUser: true,
        isSupplier: false
      }
      props.onParticipantAdded(participant)
      setUsers([])
      setSearchKeyWord('')
      handleClose()
    }
  }

  function onParticipantRemoved(participant: Participant) {
    if (typeof props.onParticipantRemoved === 'function' && (participant.userName !== getSignedUser()?.userName || props.isCurrentUserAdmin || props.issueTask.owner?.userName === getSignedUser()?.userName)) {
      props.onParticipantRemoved(participant.userName)
    } else {
      setIsSnackbarOpen(true)
    }
  }

  function getRemainingParticipantsCount(): number {
    if (allParticipants.length > (props.maxReelItems || MAX_REEL_ITEMS)) {
      return allParticipants.length - ((props.maxReelItems || MAX_REEL_ITEMS) - 1)
    } else {
      return allParticipants.length - (props.maxReelItems || MAX_REEL_ITEMS)
    }
  }

  function isVisibleUserSearch() {
    return (props.isCurrentUserAdmin || isSignedInUserParticipant(props.issueTask) || props.issueTask.owner?.userName === getSignedUser()?.userName)
  }

  function searchusers(keyword: string) {
    if (props.onAsyncUserSearch && keyword) {
      setUsersLoading(true)
      setSearchKeyWord(keyword)
      props.onAsyncUserSearch(keyword)
        .then(resp => {
          setUsersLoading(false)
          setUsers(resp)
        })
        .catch(err => {
          setUsersLoading(false)
          console.log(err)
        })
    } else {
      setUsersLoading(false)
      setUsers([])
      setSearchKeyWord(keyword)
    }
  }

  const delayedSearch = useCallback(debounce((keyword: string) => searchusers(keyword), 500), [])

  const clearInput = (event) => {
    setSearchKeyWord('')
    delayedSearch('')
  }

  const handleInputChange = (event) => {
    setSearchKeyWord(event.target.value)
    delayedSearch(event.target.value)
  }

  function getDisplayName(displayName: string) {
    if (searchKeyWord && displayName && displayName.toLowerCase().includes(searchKeyWord.toLowerCase())) {
      const indexOfMatch = displayName.toLowerCase().indexOf(searchKeyWord.toLowerCase())

      const originalString = displayName.split('')
      const matchedSubstring = displayName.substring(indexOfMatch, indexOfMatch + searchKeyWord.length)
      originalString.splice(indexOfMatch, matchedSubstring.length, `<strong style="font-weight:500;">${matchedSubstring}</strong>`)
      return `<span>${originalString.join('')}</span>`
    } else {
      return displayName
    }
  }

  return <div className={style.ppReelContainer}>
    <div className={style.ppReelItemContainer} ref={reelPopoverRef}>
      {reelParticipants.map((participant: Participant, index: number) =>
        <div className={`${style.ppReelItem} ${props.isExternalView ? style.ppReelExternalView : ''}`} key={index} onClick={handleClick}>
          <img className={style.ppReelPic} src={getUserProfileInitialsForUser(participant)} alt="" />
        </div>
      )}
      {getRemainingParticipantsCount() > 0 && <button className={style.ppReelActionItem} onClick={handleClick}>
        <span className={style.ppReelActionItemText}>+{getRemainingParticipantsCount()}</span>
      </button>}
      <div className={style.ppReelActionContainer}>
        {!props.isExternalView && isVisibleUserSearch() && <div className={`${style.ppReelActionContainerAddUser} ${reelParticipants.length > 0 ? style.ppReelActionContainerAddUserShift : ''}`} onClick={handleClick}><button className={style.ppReelActionItem}><UserPlus size={12} color='var(--warm-neutral-shade-300)' /></button>{t("--share--")}</div>}
        <Popover PaperProps={{ className: style.ppReelActionContainerAddUserPopup }} id={id} open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <div className={style.ppReelPopoverContainer}>
            {allParticipants.length > 0 && <div className={style.ppReelPopoverSelected}>
              <div className={style.ppReelPopoverSelectedRow}>
                {isVisibleUserSearch() && <span className={style.ppReelPopoverSelectedText}>{t("--selectedParticipants--")}</span>}
              </div>
              <div className={style.ppReelPopoverSelectedRow}>
                {allParticipants.map((participant: Participant, index: number) => <div className={style.ppReelPopoverSelectedChip} key={index}>
                  <img className={style.ppReelPopoverSelectedChipProfilePic} src={getUserProfileInitialsForUser(participant)} alt="" />
                  <div className={style.ppReelPopoverSelectedChipTextWrap}>
                    <span className={style.ppReelPopoverSelectedChipTextName}>{participant.name}</span>
                    {participant.isSupplier && <span className={style.ppReelPopoverSelectedChipTextType}> {`(${t("--supplier--")})`}</span>}
                  </div>
                  {isVisibleUserSearch() && !participant.isSupplier && !participant.isMentionUser && <X size={16} cursor={'pointer'} color='var(--warm-neutral-shade-200)' onClick={() => { onParticipantRemoved(participant) }} />}
                </div>)}
              </div>
            </div>}
            {isVisibleUserSearch() && <div className={`${style.ppReelPopoverSearch}`}>
              <div className={`${style.ppReelPopoverSearchHeader}`}>{t("--shareWithParticipants--")}</div>
              <div className={style.ppReelPopoverSearchBox}>
                <Search size={20} color={'var(--warm-neutral-shade-300)'} className={style.ppReelPopoverSearchBoxIcon} />
                <input autoFocus className={`${style.ppReelPopoverSearchBoxInput} ${searchKeyWord ? style.ppReelPopoverSearchBoxInputFilled : ''}`} type="text" value={searchKeyWord} placeholder={t("--searchByName--")} onChange={handleInputChange} />
                {searchKeyWord && <X className={style.ppReelPopoverSearchBoxInputClear} size={20} color="var(--warm-neutral-shade-300)" onClick={clearInput} />}
              </div>
            </div>}
            {usersLoading && <div className={style.ppReelPopoverSearchInfo}>
              <OROSpinner borderWidth={2} height={16} width={16}></OROSpinner>
              {t("--searchingForUsers--")}
            </div>}
            {!usersLoading && searchKeyWord && users.length === 0 && <div className={style.ppReelPopoverSearchInfo}>
              <UserX color='var(--warm-neutral-shade-200)' size={16}></UserX>
              {t("--noUsersFound--")}
            </div>}
            {!usersLoading && searchKeyWord && users.length > 0 && <div className={style.ppReelPopoverSearchResult}>
              {users.map((user, index) => {
                return (
                  <div key={index} className={style.ppReelPopoverSearchResultItem} onClick={() => onParticipantAdded([user])}>
                    <img className={style.ppReelPopoverSearchResultItemPic} src={user?.customData?.picture} alt="" />
                    <div className={style.ppReelPopoverSearchResultItemDetails}>
                      <div className={style.ppReelPopoverSearchResultItemName} dangerouslySetInnerHTML={{ __html: getDisplayName(user.displayName) }}></div>
                      {user?.customData?.email && <div className={style.ppReelPopoverSearchResultItemEmail}>{user?.customData?.email}</div>}
                    </div>
                  </div>
                )
              })}
            </div>}
          </div>
        </Popover>
        <SnackbarComponent message={t("--unableToRemoveParticipant--")} open={isSnackbarOpen} autoHideDuration={2000} onClose={() => setIsSnackbarOpen(false)} />
      </div>
    </div>
  </div>
}

export function ParticipantsPicReel(props: ParticipantsPicReelProps) {
  return <I18Suspense><ParticipantsPicReelComponent {...props}></ParticipantsPicReelComponent></I18Suspense>
}

export function NoteComponentInternal(props: PrivateNoteProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.NOTES)
  const [owner, setOwner] = useState<UserId | null>(null)
  const [description, setDescription] = useState<string>('')
  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const [selectedForms, setSelectedForms] = useState<Array<QuestionnaireId>>([])
  const [issueParticipants, setIssueParticipants] = useState<Array<Participant>>([])
  const [isCommentsExpanded, setIsCommentsExpanded] = useState<boolean>(false)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyNoteForEdit, setReplyNoteForEdit] = useState<Note | null>(null)
  const [noteReplyCount, setNoteReplyCount] = useState<number>(0)
  const [messageIdToBringIntoView, setMessageIdToBringIntoView] = useState<string | null>(null)

  useEffect(() => {
    if (props.messageIdToBringIntoView && props.issueTask && props.issueTask.id === props.messageIdToBringIntoView) {
      setIsCommentsExpanded(true)
      setShowReplyBox(true)
      setMessageIdToBringIntoView(props.messageIdToBringIntoView)
      setTimeout(() => {
        document.getElementById(props.messageIdToBringIntoView)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }, 500)
    }
  }, [props.messageIdToBringIntoView, props.issueTask])

  useEffect(() => {
    setNoteReplyCount(props.issueTask?.notes?.length || 0)
    setIssueParticipants([])
    const participants: Array<Participant> = []
    const suppliers: Array<NormalizedVendorRef> = props.issueTask.partners
    if (suppliers && Array.isArray(suppliers) && suppliers.length > 0) {
      const supplierContact: Contact = suppliers[0].contact

      if (supplierContact) {
        participants.push({
          tenantId: '',
          userName: supplierContact.email,
          name: supplierContact.fullName,
          picture: supplierContact.imageUrl,
          isUser: false,
          isSupplier: true
        })
      }
    }

    if (props.issueTask.owner) {
      setOwner(props.issueTask.owner)
    }

    props.issueTask.users.forEach((user: UserId) => {
      participants.push({
        tenantId: user.tenantId,
        userName: user.userName,
        name: user.name,
        picture: user.picture,
        isUser: true,
        isSupplier: false
      })
    })

    if (props.issueTask.forms.length > 0) {
      if (props.limitedAccess && props.supplierRoleForms && props.supplierRoleForms?.length > 0) {
        const _selectedForm: Array<QuestionnaireId> = []
        props.issueTask.forms.forEach(form => {
          props.supplierRoleForms?.forEach(_form => {
            const checkItExistsInSupplierForm = _form.questionnaireIds.find(item => item.id === form.id)
            if (checkItExistsInSupplierForm) {
              _selectedForm.push(checkItExistsInSupplierForm)
            }
          })
        })
        setSelectedForms(_selectedForm)
      } else {
        setSelectedForms(props.issueTask.forms)
      }
    } else {
      setSelectedForms([])
    }

    if (props.issueTask.attachments.length > 0) {
      setAttachments(props.issueTask.attachments)
    } else {
      setAttachments([])
    }

    setDescription(props.issueTask?.descriptionMeta || props.issueTask?.description || '')

    const uniqueParticipants = participants.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.userName === value.userName
      ))
    )

    setIssueParticipants(uniqueParticipants)
  }, [props.issueTask, props.supplierRoleForms, props.limitedAccess])

  function onToggleCommentExpand() {
    setIsCommentsExpanded(!isCommentsExpanded)
    setShowReplyBox(false)
  }

  function onReplyExpand() {
    setShowReplyBox(true)
    setIsCommentsExpanded(true)
  }

  function onReplyClose() {
    setShowReplyBox(false)
  }

  function onUpdatePrivateNote(issue: MeasureTask) {
    if (typeof props.onUpdatePrivateNote === 'function') {
      props.onUpdatePrivateNote(issue)
    }
  }

  function onResolveIssue() {
    const updatedIssue = { ...props.issueTask, taskStatus: TaskStatus.done }
    onUpdatePrivateNote(updatedIssue)
    if (props.onConversationResolved) {
      props.onConversationResolved({ ...props.issueTask, taskStatus: TaskStatus.done })
    }
  }

  function onParticipantAdded(participant: Participant) {
    const addedUser: UserId = {
      tenantId: participant.tenantId,
      userName: participant.userName,
      name: participant.name
    }

    const updatedIssue = { ...props.issueTask, users: [...props.issueTask.users, addedUser] }
    onUpdatePrivateNote(updatedIssue)
  }

  function onParticipantRemoved(userName: string) {
    const users: Array<UserId> = props.issueTask.users.filter((user: UserId) => user.userName !== userName)

    const updatedIssue: MeasureTask = { ...props.issueTask, users }
    onUpdatePrivateNote(updatedIssue)
  }

  function onPreviewAttachment(attachment: Attachment) {
    if (typeof props.onPreviewAttachment === 'function') {
      props.onPreviewAttachment(props.issueTask.id, attachment)
    }
  }

  function resetAllActions() {
    setShowReplyBox(false)
    setReplyNoteForEdit(null)
    if (props.issueTask?.notes?.length === 0) {
      setIsCommentsExpanded(false)
    }
  }

  async function onAsyncUserSearch(keyword: string): Promise<Array<Option>> {
    if (keyword && props.getUserSuggestions) {
      return props.getUserSuggestions(keyword).then(users => {
        const userOptions: Array<Option> = users.map(user => ({
          id: user.userName,
          displayName: getUserDisplayName(user),
          path: user.userName,
          customData: user
        }))
        return userOptions
      })
        .catch(err => {
          console.log(err)
          return []
        })
    } else {
      return Promise.resolve([])
    }
  }

  function deletPrivateNote() {
    if (props.onPrivateNoteDeleted) {
      props.onPrivateNoteDeleted(props.issueTask.id)
    }
  }

  function onPrivateNoteReplyDeleted(replyId: string, parentNoteId?: string) {
    if (props.onPrivateNoteReplyDeleted) {
      props.onPrivateNoteReplyDeleted(props.issueTask.id, replyId, parentNoteId)
        .then(resp => {
          if (resp.notes?.length === 0) {
            setIsCommentsExpanded(false)
          }
        })
        .catch(err => console.log(err))
    }
  }

  function onEditNote() {
    if (props.onEditNote) {
      props.onEditNote(props.issueTask)
    }
  }

  function onEditReplyNote(reply: Note) {
    setShowReplyBox(true)
    setIsCommentsExpanded(true)
    setReplyNoteForEdit(reply)
  }

  function isIssueResolved() {
    return props.issueTask.taskStatus === TaskStatus.done
  }

  function onFormViewDetails(questionnaireId: QuestionnaireId) {
    if (typeof props.onFormViewDetails === 'function') {
      props.onFormViewDetails(questionnaireId, issueParticipants, owner, isIssueResolved())
    }
  }

  function showResolveActions() {
    return !props.limitedAccess && !isIssueResolved() && (props.isCurrentUserAdmin || isSignedInUserTaskOwner(props.issueTask))
  }

  function onCloseIssuePanel() {
    if (typeof props.onCloseIssuePanel === 'function') {
      props.onCloseIssuePanel()
    }
  }

  function getNoteVisibility(): boolean {
    if (props.issueTask.type === MeasureTaskType.privateNote && props.isPrivateNoteEnabled) {
      return props.issueTask.publicNote
    } else {
      return !props.issueTask.isRestricted
    }
  }

  function onChangingVisibility(visibility: boolean) {
    if (props.issueTask.type === MeasureTaskType.privateNote) {
      const updatedIssue = { ...props.issueTask, publicNote: !visibility }
      onUpdatePrivateNote(updatedIssue)
    } else {
      const updatedIssue = { ...props.issueTask, isRestricted: visibility }
      onUpdatePrivateNote(updatedIssue)
    }
  }

  /**
   * @description Unscrew this code
   *
   * @param {MessageType} messageType
   * @returns {React.ReactNode}
   */

  function getStatementAsPerStep(messageType: MessageType): React.ReactNode {
    switch (messageType) {
      case MessageType.approval:
        return <Trans t={t} i18nKey="--approvedRequestIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'approved request in'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.cancelRequest:
        return <Trans t={t} i18nKey="--cancelledRequest--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'cancelled request'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.deny:
        return <Trans t={t} i18nKey="--deniedRequestIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'denied request in'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.editRequest:
        return <Trans t={t} i18nKey="--edittedRequest--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'editted request'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.moreInfo:
        return <Trans t={t} i18nKey="--requestedMoreInfoIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'requested more info in'}
          <strong> {props.issueTask?.stepName || '' } </strong>
        </Trans>

      case MessageType.moreInfoResponse:
        return <Trans t={t} i18nKey="--respondedIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'responded in'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.reassign:
        return <Trans t={t} i18nKey="--reassignedTaskIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'reassigned task in'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.redo:
        return <Trans t={t} i18nKey="--requestedRedoIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'requested redo in'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.skipped:
        return <Trans t={t} i18nKey="--skipped--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'skipped'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.review:
        return <Trans t={t} i18nKey="--reviewedRequestIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'reviewed request in'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.todo:
        return <Trans t={t} i18nKey="--complete--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)}</strong>
          {'complete'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      case MessageType.shareForms:
        return <Trans t={t} i18nKey="--sharedForms--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.stepName }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)} </strong>
          {'shared forms'}
          <strong> {props.issueTask?.stepName || ''} </strong>
        </Trans>

      default:
        return <strong>{getUserDisplayName(props.issueTask?.owner)}</strong>
    }
  }

  function getStatementAsPerIssue(messageType: MessageType): React.ReactNode {
    switch (messageType) {
      case MessageType.requestMoreInfo:
        return <Trans t={t} i18nKey="--requestedMoreInfo--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.taskName && !props.limitedAccess && !props.isExternalView ? props.issueTask.taskName : '' }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)}</strong>
          {'requested more info'}
          <strong>{props.issueTask?.taskName && !props.limitedAccess && !props.isExternalView ? props.issueTask.taskName : '' }</strong>
        </Trans>

      case MessageType.moreInfo:
        return <Trans t={t} i18nKey="--requestedMoreInfoIn--" values={{ owner: getUserDisplayName(props.issueTask?.owner), stepName: props.issueTask?.taskName && !props.limitedAccess && !props.isExternalView ? props.issueTask.taskName : '' }}>
          <strong>{getUserDisplayName(props.issueTask?.owner)}</strong>
          {'requested more info in'}
          <strong>{props.issueTask?.taskName && !props.limitedAccess && !props.isExternalView ? props.issueTask.taskName : ''}</strong>
        </Trans>
      default:
        return <strong>{getUserDisplayName(props.issueTask?.owner)}</strong>
    }
  }

  function onPrivateNoteReplyAdded(task: MeasureTask, note: NoteInput, files: Array<File> | undefined) {
    if (props.onPrivateNoteReplyAdded) {
      props.onPrivateNoteReplyAdded(task, note, files)
      setShowReplyBox(false)
      setReplyNoteForEdit(null)
    }
  }

  function getPrivateNoteHelpText(): string {
    if ((!props.isExternalView && (isSignedInUserTaskOwner(props.issueTask) || props.isCurrentUserAdmin))) {
      return t("--visibleOnlyToParticipantsAndAdminsClickOnMoreToRemove--")
    }
    return t("--visibleOnlyToParticipantsAndAdmins--")
  }

  return <div className={`${style.container}`} id={props.issueTask.id}>
    <div className={style.containerOwner}>
      {owner && <img className={style.containerOwnerPic} src={getUserProfileInitialsForUser(owner)} />}
      {isCommentsExpanded && <div className={style.containerOwnerVertical}>
        <div className={style.containerOwnerVerticalLine}></div>
        <div className={style.containerOwnerVerticalDot}></div>
      </div>}
    </div>
    <div className={style.containerRight}>
      <div className={style.containerRightSubject}>
        <div className={style.containerRightSubjectText}>
          {props.issueTask.type === MeasureTaskType.issue && getStatementAsPerIssue(props.issueTask?.taskName && !props.limitedAccess && !props.isExternalView ? MessageType.moreInfo : MessageType.requestMoreInfo)}
          {props.issueTask.type !== MeasureTaskType.issue && getStatementAsPerStep(props.issueTask?.messageType)}
        </div>
        <div className={style.containerRightSubjectWrapper}>
          {props.issueTask.type === MeasureTaskType.issue && <div className={style.containerRightSubjectAction}>
            {isIssueResolved() && <div className={style.containerRightSubjectActionResolved}>{t("--resolved--")}</div>}
            {!isIssueResolved() && showResolveActions() && <div className={style.containerRightSubjectActionUnresolved} onClick={onResolveIssue}>
              <Check size={16} color='var(--warm-prime-azure)' />{t("--resolve--")}
            </div>}
          </div>}
          {(!props.isExternalView && (isSignedInUserTaskOwner(props.issueTask) || props.isCurrentUserAdmin)) && <NoteActionMenu isPrivateNoteEnabled={props.isPrivateNoteEnabled || props.issueTask?.type === MeasureTaskType.issue} isNoteVisible={getNoteVisibility()} onChangingVisibility={onChangingVisibility} hideDeleteAction={props.issueTask.type === MeasureTaskType.issue} hideEditAction={props.issueTask.type === MeasureTaskType.issue} onDelete={deletPrivateNote} onEdit={onEditNote}></NoteActionMenu>}
          {!props.limitedAccess && !props.hideCloseButton && <div className={style.containerRightSubjectActionClose}><X size={20} color='var(--warm-neutral-shade-200)' cursor='pointer' onClick={() => onCloseIssuePanel()}></X></div>}
        </div>
      </div>
      <div className={style.containerRightDate}>
        <div className={style.containerRightDateDetail}>
          {getCreatedDateTime(props.issueTask.created)}
        </div>
        {!getNoteVisibility() && <div className={style.containerRightDateLock}>
          <div className={style.containerRightDateLockBtn}>
            <OroTooltip sx={{
              [`& .${tooltipClasses.tooltip}`]: {
                width: '260px',
                color: 'var(--warm-prime-chalk)'
              }
            }} arrow title={getPrivateNoteHelpText()}>
              <div className={style.containerRightDateLockBtn}>
                <img src={lock} alt='' /> {t("--private--")}
              </div>
            </OroTooltip>
          </div>
        </div>}
      </div>
      <div className={`${style.containerRightContent} ${props.issueTask.type === MeasureTaskType.issue && isIssueResolved() ? style.containerRightContentGreyBG : ''}`}>
        <div className={style.containerRightContentDescContainer}>
          <Translation canShowTranslation={props.canShowTranslation}>
            <MentionsInput
              value={description}
              onChange={() => { }}
              style={readonlyCss}
              placeholder=""
              disabled
            >
              <Mention
                displayTransform={(id: string, display: string) => `@${display}`}
                trigger="@"
                appendSpaceOnAdd
                data={[]}
                style={defaultMentionStyle}
              />
            </MentionsInput>
          </Translation>
        </div>
        {selectedForms.length > 0 && props.issueTask.type === MeasureTaskType.issue && <div className={style.containerRightContentForms}>
          <div className={style.containerRightContentFormsLabel}>{t("--formsIncluded--")}</div>
          <ul className={style.containerRightContentFormsList}>
            {selectedForms.map((form: QuestionnaireId, index: number) => <li className={style.containerRightContentFormsListItem} key={index}>
              <span className={style.containerRightContentFormsListItemText} title={form.name || form.formId}>{index + 1 + '.'} {form.name || form.formId}</span>
              <span className={style.containerRightContentFormsListItemLink} onClick={() => onFormViewDetails(form)}>{t("--viewDetails--")}</span>
            </li>)}
          </ul>
        </div>}
        {attachments.length > 0 && <div className={style.containerRightContentAttachments}>
          <ul className={style.containerRightContentAttachmentsList}>
            {props.issueTask.type === MeasureTaskType.issue && <div className={style.containerRightContentAttachmentsLabel}>{t("--attachments--")}</div>}
            {attachments.map((attachment: Attachment, index: number) => <li className={style.containerRightContentAttachmentsListItem} onClick={() => onPreviewAttachment(attachment)} key={index}>
              <div className={style.containerRightContentAttachmentsListItemContent}>
                <div className={style.containerRightContentAttachmentsListItemContentIcon}><OROFileIcon fileType={attachment?.mediatype || ''}></OROFileIcon></div>
                <div className={style.containerRightContentAttachmentsListItemContentText} title={attachment.filename}>{attachment.filename}</div>
              </div>
            </li>)}
          </ul>
        </div>}
        {props.issueTask && <div className={style.containerRightContentParticipants}>
          <ParticipantsPicReel
            issueTask={props.issueTask}
            participants={issueParticipants}
            isCurrentUserAdmin={props.isCurrentUserAdmin}
            isExternalView={props.isExternalView}
            onParticipantAdded={onParticipantAdded}
            onParticipantRemoved={onParticipantRemoved}
            onAsyncUserSearch={onAsyncUserSearch}
          />
        </div>}
      </div>
      <div className={style.notes}>
        <div className={style.notesHeader}>
          {noteReplyCount > 0 && <div className={style.notesHeaderCount} onClick={onToggleCommentExpand}>
            {noteReplyCount === 1 ? t('--seeReply--', { count: noteReplyCount }) : t('--seeReplies--', { count: noteReplyCount })}
            {isCommentsExpanded ? <ChevronDown size={16} color="var(--warm-neutral-shade-400)" /> : <ChevronRight size={16} color="var(--warm-neutral-shade-400)" />}
          </div>}
          {showReplyBox && <div className={style.notesHeaderLabel} onClick={onReplyClose}>{t("--replying--")}</div>}
          {!showReplyBox && <div className={style.notesHeaderLabel} onClick={onReplyExpand}>{t("--reply--")}</div>}
        </div>
        {isCommentsExpanded && <div className={style.notesLists}>
          {props.issueTask.notes && props.issueTask.notes.length > 0 &&
            props.issueTask.notes.map((reply, index) => {
              return (
                <NoteReplyComponent canShowTranslation={props.canShowTranslation} loadReplyAttachment={props.loadReplyAttachment} onPrivateNoteReplyEdit={onEditReplyNote} reply={reply} onPrivateNoteReplyDeleted={onPrivateNoteReplyDeleted} isLastReply={index === ((props.issueTask.notes.length as number) - 1)} key={index}></NoteReplyComponent>
              )
            })
          }
          {
            props.issueTask?.notes?.length > 0 && !showReplyBox && <div className={style.notesListsInputPlaceholder} onClick={() => setShowReplyBox(true)}>{t("--replyHere--")}</div>
          }
          {showReplyBox &&
            <NoteReplyInput
              replyNoteForEdit={replyNoteForEdit}
              focused={!!messageIdToBringIntoView}
              issueTask={props.issueTask}
              onClickOutside={resetAllActions}
              onCancelClick={resetAllActions}
              getUserSuggestions={props.getUserSuggestions}
              onDeleteReplyAttachment={props.onDeleteReplyAttachment}
              onPrivateNoteReplyAdded={onPrivateNoteReplyAdded}
              onPrivateNoteReplyUpdated={props.onPrivateNoteReplyUpdated}
            />
          }
        </div>}
      </div>
    </div>
  </div>
}

export function NoteComponent(props: PrivateNoteProps) {
  return <I18Suspense><NoteComponentInternal {...props}></NoteComponentInternal></I18Suspense>
}
