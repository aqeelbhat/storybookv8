/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useRef, useState } from 'react'
import { Eye } from 'react-feather'
import { ClickAwayListener } from '@mui/material'
import lock from './assets/lock_filled.svg'
import streamMessageEmptyState from './assets/message-empty.svg'
import { Attachment, MeasureTask } from '../Types'
import { MessageInput } from './note-input.component'
import style from './note.module.scss'
import { NoteInput, StreamMessageType } from './types'
import { NoteComponent } from './note-detail.component'

interface OROChatProps {
  additionalSendMessageProp?: Object,
  isTaskOwner?: boolean
  filterValue?: StreamMessageType
  newCreatedPrivateNote?: MeasureTask | null
  allPrivateNote?: Array<MeasureTask>
  isPrivateNoteEnabled?: boolean
  isCurrentUserAdmin?: boolean
  removeNewCreatedTaskAfterSubmit?: () => void
  onPrivateNoteReplyUpdated?: (task: MeasureTask, note: NoteInput, file: File | undefined) => void
  onDeleteReplyAttachment?: (noteId: string, replyNoteId: string, docId: string) => void
  handleChange?: (newValue: MeasureTask) => void
  onPrivateNoteReplyDeleted?: (measureTaskId: string, replyId: string, parentNoteId?: string) => void
  onDeletePrivateNoteAttachment?: (noteId: string, attachment: Attachment) => void
  onPreviewPrivateNoteAttachment?: (noteId: string, attachment: Attachment) => void
  onNewNoteAdded?: (note: MeasureTask) => Promise<boolean>
  onUpdatePrivateNote?: (note: MeasureTask) => void
  onUploadPrivateNoteAttachment?: (noteId: string, file: File) => void
  onCreatePrivateNote?: () => Promise<boolean>
  onDeletePrivateNote?: (id: string) => void
  onMessagesLength?: (length: number) => void
  onConversationResolved?: () => void
  onPrivateNoteReplyAdded?: (task: MeasureTask, note: NoteInput, file: File | undefined) => void
}

export function OROMessaging (props: OROChatProps) {
  const [showInputBox, setShowInputBox] = useState(false)
  const [showMessageTypes, setShowMessageTypes] = useState(false)
  const messageTypeSelectorRef = useRef<any>(null)
  const [selectedMessagetype, setSelectedMessagetype] = useState<StreamMessageType>(StreamMessageType.public)
  const [bottom, setBottom] = useState(0)
  const [messageLength, setMessageLength] = useState(0)
  const [noteForEdit, setNoteForEdit] = useState<MeasureTask | null>(null)

  function resetMessageTypeSelections () {
    setShowInputBox(false)
    setShowMessageTypes(false)
    setSelectedMessagetype(StreamMessageType.public)
    setNoteForEdit(null)
    if (props.removeNewCreatedTaskAfterSubmit) {
      props.removeNewCreatedTaskAfterSubmit()
    }
  }

  const setPopupPosition = () => {
    if (messageTypeSelectorRef && messageTypeSelectorRef.current) {
      const elem = messageTypeSelectorRef.current as HTMLDivElement
      const bounding = elem.getBoundingClientRect()
      const spaceAbove = bounding.top
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const spaceBelow = viewportHeight - (bounding.top + bounding.height)
      if ((spaceBelow < 264) && (spaceAbove > spaceBelow)) {
        setBottom(bounding.height + 4)
      } else {
        setBottom(-170)
      }
    }
  }

  useEffect(() => {
    setPopupPosition()
    window.addEventListener('resize', setPopupPosition)
    return () => {
      window.removeEventListener('resize', setPopupPosition)
    }
  }, [messageTypeSelectorRef.current])

  function onCancelCreatingNote () {
    if ((selectedMessagetype === StreamMessageType.private || selectedMessagetype === StreamMessageType.public) && !noteForEdit && props.onDeletePrivateNote && props.newCreatedPrivateNote) {
      props.onDeletePrivateNote(props.newCreatedPrivateNote.id)
    }
    resetMessageTypeSelections()
  }

  async function submitPrivateMessage (note: MeasureTask) {
    if (props.onNewNoteAdded) {
      props.onNewNoteAdded(note)
        .then(resp => {
          resetMessageTypeSelections()
        })
        .catch(err => {
          console.warn('error in updating note')
          console.log(err)
        })

      if (props.removeNewCreatedTaskAfterSubmit) {
        props.removeNewCreatedTaskAfterSubmit()
      }
    }
  }

  async function updatePrivateMessage (note: MeasureTask) {
    if (props.onUpdatePrivateNote) {
      props.onUpdatePrivateNote(note)
      resetMessageTypeSelections()
    }
  }

  function onMessagetypeOptionClick (type: StreamMessageType) {
    if ((type === StreamMessageType.private || type === StreamMessageType.public) && props.onCreatePrivateNote) {
      props.onCreatePrivateNote()
      .then(resp => {
        if (resp) {
          setShowInputBox(true)
          setShowMessageTypes(false)
          setSelectedMessagetype(type)
        }
      })
      .catch(err => {
        console.warn('error creating private note')
      })
    }
  }

  useEffect(() => {
    /*
     * Get the actual rendered window height to set the container size properly.
     * In some browsers (like Safari) the nav bar can override the app.
     */
    const setAppHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }

    setAppHeight()

    window.addEventListener('resize', setAppHeight)
    return () => {
      window.removeEventListener('resize', setAppHeight)
    }
  }, [])

  function onMessagesLengthChange (count: number) {
    if (props.onMessagesLength) {
      props.onMessagesLength(count)
    }
    setMessageLength(count)
  }

  function openMessageTypeSelector () {
    if (props.isPrivateNoteEnabled) {
      setShowMessageTypes(true)
      setPopupPosition()
    } else {
      onMessagetypeOptionClick(StreamMessageType.public)
    }
  }

  function onEditNote (note: MeasureTask) {
    if (props.onDeletePrivateNote && props.newCreatedPrivateNote) {
      props.onDeletePrivateNote(props.newCreatedPrivateNote.id)
    }
    setShowInputBox(false)
    setShowMessageTypes(false)
    setSelectedMessagetype(StreamMessageType.public)
    setNoteForEdit(note)
  }

  return (
    <>
      <div className={style.oroChat} style={{width: '500px'}}>
        {/* this needs to be updated after stream chat data migration */}
        {/* <div className='str-chat__main-panel-inner'>
          <CustomMessage
            allPrivateNote={props.allPrivateNote}
            filterValue={props.filterValue}
            isCurrentUserAdmin={props.isCurrentUserAdmin}
            onPrivateNoteReplyUpdated={props.onPrivateNoteReplyUpdated}
            onDeleteReplyAttachment={props.onDeleteReplyAttachment}
            onEditNote={onEditNote}
            isPrivateNoteEnabled={props.isPrivateNoteEnabled}
            onPrivateNoteReplyDeleted={props.onPrivateNoteReplyDeleted}
            onUpdatePrivateNote={props.onUpdatePrivateNote}
            onDeletePrivateNote={props.onDeletePrivateNote}
            onMessagesLength={onMessagesLengthChange}
            isTaskOwner={props.isTaskOwner}
            onConversationResolved={props.onConversationResolved}
            onPrivateNoteReplyAdded={props.onPrivateNoteReplyAdded}
            onPreviewAttachment={props.onPreviewPrivateNoteAttachment}
          />
        </div> */}
        <NoteComponent issueTask={props.allPrivateNote[0]} onEditNote={onEditNote}></NoteComponent>
        <div className={`${messageLength > 0 ? style.oroChatInnerInput : style.oroChatInnerInputEmpty}`}>
          {showInputBox && !noteForEdit && (selectedMessagetype === StreamMessageType.private || selectedMessagetype === StreamMessageType.public) && <MessageInput
            handleChange={props.handleChange}
            onUpdatePrivateNote={props.onUpdatePrivateNote}
            isCurrentUserAdmin={props.isCurrentUserAdmin}
            onDeletePrivateNoteAttachment={props.onDeletePrivateNoteAttachment}
            onPreviewPrivateNoteAttachment={props.onPreviewPrivateNoteAttachment}
            onNewNoteAdded={submitPrivateMessage}
            onUploadPrivateNoteAttachment={props.onUploadPrivateNoteAttachment}
            newCreatedPrivateNote={props.newCreatedPrivateNote}
            onCancel={onCancelCreatingNote}
            submitButtonLabel="Send"
            selectedMessagetype={selectedMessagetype}
          />}
          {noteForEdit && <MessageInput
            handleChange={props.handleChange}
            onUpdatePrivateNote={props.onUpdatePrivateNote}
            isCurrentUserAdmin={props.isCurrentUserAdmin}
            onDeletePrivateNoteAttachment={props.onDeletePrivateNoteAttachment}
            onPreviewPrivateNoteAttachment={props.onPreviewPrivateNoteAttachment}
            onNewNoteAdded={updatePrivateMessage}
            onUploadPrivateNoteAttachment={props.onUploadPrivateNoteAttachment}
            newCreatedPrivateNote={props.newCreatedPrivateNote || noteForEdit}
            isExistingNoteEditing
            onCancel={resetMessageTypeSelections}
            submitButtonLabel="Update"
            selectedMessagetype={noteForEdit.publicNote ? StreamMessageType.public : StreamMessageType.private}
          />}
          {!showInputBox && !noteForEdit && <div className={style.oroChatMainInputBoxSlector} ref={messageTypeSelectorRef}>
            <div className={`${style.oroChatMainInputBoxSlectorText} ${showMessageTypes ? style.oroChatMainInputBoxSlectorOpen : ''}`} onClick={openMessageTypeSelector}>Start a conversation</div>
            {showMessageTypes && <ClickAwayListener onClickAway={() => setShowMessageTypes(false)}>
              <div className={style.oroChatMainInputBoxSlectorType} style={{ bottom: bottom}}>
                <div className={style.oroChatMainInputBoxSlectorTypeHeader}>choose an option</div>
                <div className={style.oroChatMainInputBoxSlectorTypeItem} onClick={() => onMessagetypeOptionClick(StreamMessageType.public)}>
                  <div className={style.oroChatMainInputBoxSlectorTypeItemIcon}><Eye size={16} color='var(--warm-neutral-shade-200)'></Eye></div>
                  <div className={style.oroChatMainInputBoxSlectorTypeItemType}>
                    <div className={style.oroChatMainInputBoxSlectorTypeItemTypeName}>Public</div>
                    <div className={style.oroChatMainInputBoxSlectorTypeItemTypeInfo}>Conversation visible to <strong>everyone</strong></div>
                  </div>
                </div>
                <div className={style.oroChatMainInputBoxSlectorTypeItem} onClick={() => onMessagetypeOptionClick(StreamMessageType.private)}>
                  <div className={style.oroChatMainInputBoxSlectorTypeItemIcon}><img src={lock} alt='' /></div>
                  <div className={style.oroChatMainInputBoxSlectorTypeItemType}>
                    <div className={style.oroChatMainInputBoxSlectorTypeItemTypeName}>Private</div>
                    <div className={style.oroChatMainInputBoxSlectorTypeItemTypeInfo}>Conversation visible <strong>only to you and participants</strong></div>
                  </div>
                </div>
              </div>
            </ClickAwayListener>}
          </div>}
        </div>
        {messageLength === 0 && <div className={style.oroChatEmpty}>
          <img src={streamMessageEmptyState} alt='' />
          <div className={style.oroChatEmptyText}>No new messages</div>
          <div className={style.oroChatEmptyInfo}>Start a conversation and @mention to notify them</div>
        </div>}
      </div>
    </>
  )
}
