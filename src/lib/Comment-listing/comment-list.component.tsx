import classnames from 'classnames'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { Paperclip, File, Trash2, ChevronDown, ChevronUp } from 'react-feather'
import fileExtension from 'file-extension'
import { TextareaAutosize } from '@mui/material';

import styles from './styles.module.scss'
import defaultUserPic from './assets/default-user-pic.png'
import { Attachment, IDRef, Note, UserId } from '../Types'
import { createImageFromInitials } from '../util'
import { OroButton } from '../controls'
import { checkFileForS3Upload, inputFileAcceptType } from '../Inputs'
import { TaskStatus, getActionDisplayNames } from '../Types/engagement'
import { FilePreview } from '../FilePreview'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { MenuOption } from '../MilestoneWidget/components/menu/menu-action'

interface CommentProps {
  data: Note
  showAttachmentsInsteadOfDocs?: boolean
  first?: boolean
  type?: 'measure' | 'action'
  onAttachmentPreview?: (document: IDRef) => void
  onUpdate?: (note: { noteId: string, comment: string }) => void
  onPreview?: (docId: string, noteId?: string) => Promise<Blob>
}

function CommentItem (props: CommentProps) {
  const [fileForPreview, setFileForPreview] = useState<Blob | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [documents, setDocuments] = useState<Array<IDRef>>([])
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    if (props.data && props.showAttachmentsInsteadOfDocs && Array.isArray(props.data.attachments)) {
      const documents: Array<IDRef> = props.data.attachments.map((attachment: Attachment) => {
        const doc: IDRef = {
          id: attachment.path || '',
          name: attachment.filename || '',
          erpId: ''
        }
        return doc
      })
      setDocuments(documents)
    } else if (props.data && Array.isArray(props.data.documents)) {
      setDocuments(props.data.documents)
    }
  }, [props.data])

  function previewFile (e, doc: IDRef) {
    if (typeof props.onPreview === 'function') {
      setDocName(doc.name)
      setMediaType(fileExtension(doc.name))
      e.stopPropagation()
      if (!fileForPreview) {
        props.onPreview(doc.id, props.data.id)
          .then(resp => {
            setFileForPreview(resp)
            setIsPreviewOpen(true)
          })
          .catch(err => { console.log(err) })
      } else {
        setIsPreviewOpen(true)
      }
    }
  }

  function getDateString (dateString: string | null | undefined): string | null {
    if (!dateString) {
      return ''
    }
    const dueDate = moment(dateString)
    const today = moment()
    const tomorrow = today.add(1, 'days')
    const yesterday = today.add(-1, 'days')
    if (dueDate.isSame(today, 'day') || dueDate.isSame(tomorrow, 'day') || dueDate.isSame(yesterday, 'day')) {
      const _dueDate = dueDate.calendar().split(' ')[0]
      return _dueDate + t("--at--") + dueDate.format('h:mm a')
    }
    return dueDate.format('MMM DD, YYYY')
  }

  function getProfilePic (owner: UserId | null | undefined): string {
    const [firstName, lastName] = owner?.name ? owner.name.split(' ') : ['', '']
    return owner ? owner?.picture || createImageFromInitials(firstName, lastName) : defaultUserPic
}
  const measureTaskStatusOptions: Array<MenuOption> = [
    { id: 'milestoneStatus', label: t('--milestone--.--milestoneStatus--'), disabled: true},
    { id: TaskStatus.pending, label: t('--measureNames--.--onTarget--') },
    { id: TaskStatus.notStarted, label: t('--measureNames--.--notStarted--') },
    { id: TaskStatus.late, label: t('--measureNames--.--offTargetNotCritical--') },
    { id: TaskStatus.stuck, label: t('--measureNames--.--offTargetSupportNeeded--') },
    { id: TaskStatus.done, label: t('--measureNames--.--completed--') }
  ]
  function getMeasureTaskStatus (id:string):string | React.ReactElement{
    const updateStatus = measureTaskStatusOptions.find(option => option.id === id)
    return updateStatus?.label || id
  }

  function getActionStatusDisplayName (status: string): string {
    const displayName: string = getActionDisplayNames(status) || status
    return displayName
  }

  return (
      <div className={`${styles.commentListRow} commentListRow`}>
        <div className={`${styles.commentListRowPic} commentListRowPic`}>
          <img src={getProfilePic(props.data.owner)} alt="" />
        </div>
        <div className={`${styles.commentListRowDetail} commentListRowDetail`}>
          <div className={`${styles.commentListRowDetailUser} commentListRowDetailUser`}>
            <h3 className={`${styles.commentListRowDetailUserName} commentListRowDetailUserName`}>{ props.data.owner?.name ? props.data.owner.name : '' }</h3>
            <div className={`${styles.commentListRowDetailUserDate} commentListRowDetailUserDate`}>
              { getDateString(props.data.updated ? props.data.updated : props.data.created) }
            </div>
          </div>
          <div className={`${styles.commentListRowDetailMessage} commentListRowDetailMessage`}>
            { props.data.taskStatus &&
              <div className={`${styles.commentListRowDetailMessageStatus} commentListRowDetailMessageStatus`}>{t("--updatedTheStatusTo--")}
                <div className={`${styles.commentListRowDetailMessageStatusType} commentListRowDetailMessageStatusType`}>
                  { props.type && props.type === 'action' ? getActionStatusDisplayName(props.data.taskStatus) : getMeasureTaskStatus(props.data.taskStatus)}
                </div>
              </div>
            }
            { props.data.comment && <pre className={`${styles.commentListRowDetailMessageText} commentListRowDetailMessageText`}>{props.data.comment }</pre>}
          </div>
          {documents?.length > 0 && <div className={`${styles.commentListRowDetailDoc} commentListRowDetailDoc`}>
            {
              documents.map((doc, key) => {
                return (
                  <div key={key}  className={`${styles.commentListRowDetailDocItem} commentListRowDetailDocItem`} onClick={(e) => previewFile(e, doc)}>
                    <File size={18} color='var(--coco-neutral-shade-500)'/>{doc.name}
                  </div>
                )
              })
            }
          </div>}
        </div>
        {
          fileForPreview && isPreviewOpen &&
          <FilePreview
            fileBlob={fileForPreview}
            filename={docName}
            mediatype={mediaType}
            onClose={(e) => {setIsPreviewOpen(false); e.stopPropagation()}}
          />
        }
      </div>
  )
}
interface CommentListProps {
  comments: Array<Note>
  showAttachmentsInsteadOfDocs?: boolean
  showLatest?: boolean
  hideAttachmentClip?: boolean
  type?: 'measure' | 'action'
  onAddComment?: (note: { noteId: string, comment: string }, file?: File) => void
  onUpdateComment?: (note: { noteId: string, comment: string }) => void
  onPreview?: (docId: string, noteId?: string) => Promise<Blob>
}

function CommentListProps (props: CommentListProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null)
  // const noteInputDivRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [newComment, setNewComment] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [expanded, setExpanded] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  function handleAttachmentClick () {
    if (attachmentInputRef.current) {
      attachmentInputRef.current.click()
      if (attachmentInputRef.current.value) {
        attachmentInputRef.current.value = ''
      }
    }
  }

  function submitComment () {
    const commentWithNoWhiteSpaces = newComment.replace(/&nbsp;/g, ' ').trim();
    if (commentWithNoWhiteSpaces && props.onAddComment) {
      props.onAddComment({ noteId: '', comment: commentWithNoWhiteSpaces }, selectedFile ? selectedFile : undefined)
      setTimeout(() => {
        setNewComment('')
        setSelectedFile(null)
      }, 100)
    }
  }

  const handleFileSelection = (event) => {
    event.preventDefault()
    const file = checkFileForS3Upload(event.target.files[0])
    setSelectedFile(file)
  }

  function handleFileDelete () {
    setSelectedFile(null)
  }

  function toggleCommentList (e) {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <div className={styles.commentList} data-test-id="comment-list">
      {props.comments?.length > 0 && <div className={styles.commentListItems}>
        {(props.showLatest && props.comments?.length > 2) &&
          <div className={styles.expandBtn} onClick={(e) => toggleCommentList(e)}>
            {expanded
              ? <span>{t("--hidePreviousComments--")} <ChevronUp size={18} color={'var(--warm-prime-azure)'} /></span>
              : <span>{t("--viewPreviousComments--")} <ChevronDown size={18} color={'var(--warm-prime-azure)'} /></span>}
          </div>}
        { (props.showLatest && props.comments?.length > 2 && !expanded)
          ? props.comments.slice(-2).map((comment, i) =>
              <CommentItem
                data={comment}
                showAttachmentsInsteadOfDocs={props.showAttachmentsInsteadOfDocs}
                first={i === 0}
                type={props.type}
                onUpdate={props.onUpdateComment}
                onPreview={props.onPreview}
                key={i}
              />)
          : props.comments?.map((comment, i) =>
              <CommentItem
                data={comment}
                showAttachmentsInsteadOfDocs={props.showAttachmentsInsteadOfDocs}
                first={i === 0}
                type={props.type}
                onUpdate={props.onUpdateComment}
                onPreview={props.onPreview}
                key={i}
              />)}
        </div>}

      <div className={`${styles.commentListInput} commentListInput`}>
        <TextareaAutosize
          data-test-id="comment-list-input"
          className={`${styles.commentListInputTextarea} commentListInputTextarea`}
          value={newComment}
          placeholder={t("--addComment--")}
          minRows={1}
          maxRows={100}
          onKeyPress={e => {
            if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
              submitComment()
            }
          }}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className={`${styles.commentListInputAction} commentListInputAction`}>
          <div className={`${styles.commentListInputActionAttachment} commentListInputActionAttachment`}>
            {!props.hideAttachmentClip && <Paperclip  className={`${styles.commentListInputActionAttachmentIcon} commentListInputActionAttachmentIcon`} size={18} color='var(--coco-neutral-shade-500)' onClick={handleAttachmentClick} />}
            {!props.hideAttachmentClip && <input
              ref={attachmentInputRef}
              name="file"
              className={`${styles.commentListInputActionAttachmentFileInput} commentListInputActionAttachmentFileInput`}
              type="file"
              title=""
              accept={inputFileAcceptType}
              onClick={(event) => {(event.target as HTMLInputElement).value = '' }}
              onChange={(e) => handleFileSelection(e)}
            />}
          </div>
          <OroButton data-test-id="comment-list-button" label={t("--add--")} type="primary" size="small"  className={`${styles.commentListInputActionButton} commentListInputActionButton`} onClick={() => submitComment()} />
        </div>
      </div>
      {
        selectedFile &&
        <div className={`${styles.commentListSelectedFile} commentListSelectedFile`}>
          <File size={18}  color='var(--warm-prime-azure)'/>
          {selectedFile.name}
          <Trash2 className={`${styles.commentListSelectedFileDelete} commentListSelectedFileDelete`} size={18} color='var(--coco-neutral-shade-500)' onClick={handleFileDelete}/>
        </div>
      }
    </div>
  )
}
export function CommentList (props: CommentListProps){
  return <I18Suspense><CommentListProps {...props} /></I18Suspense>
}