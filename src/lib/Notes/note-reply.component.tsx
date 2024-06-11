import React, { useState } from 'react'
import style from './note.module.scss'
import fileExtension from 'file-extension'
import { getUserProfileInitialsForUser } from './note-detail.component'
import { getCreatedDateTime, isSignedInUserReplyTaskOwner } from './note.service'
import { NoteActionMenu } from './notes-action-menu.component'
import { IDRef, Note } from '../Types'
import { OROFileIcon } from '../RequestIcon'
import { FilePreview } from '../FilePreview'
import { ConfirmationDialog } from '../Modals'
import { Translation } from '../Translation'
import { Mention, MentionsInput } from 'react-mentions'
import { readonlyCss } from './mentions-input-style'
import defaultMentionStyle from './mentions-popup-style'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../i18n'

export interface PrivateNoteReplyProps {
    reply: Note
    isLastReply: boolean
    canShowTranslation?: boolean
    loadReplyAttachment?: (id: string) => Promise<Blob>
    onPrivateNoteReplyDeleted?: (replyId: string, parentNoteId?: string) => void
    onPrivateNoteReplyEdit?: (reply: Note) => void
}

export function NoteReplyComponentInternal (props: PrivateNoteReplyProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.NOTES)
  const [fileForPreview, setFileForPreview] = useState<Blob | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [replyDeleteModal, setReplyDeleteModal] = useState(false)

  function toggleReplyDeleteModal () {
    setReplyDeleteModal(!replyDeleteModal)
  }

  async function deleteReplyNote () {
    if (props.onPrivateNoteReplyDeleted && props.reply.id) {
        props.onPrivateNoteReplyDeleted(props.reply.id)
        setReplyDeleteModal(false)
    }
  }

  function handleOnPreview (doc: IDRef) {
    setDocName(doc.name)
    setMediaType(fileExtension(doc.name))
    if (doc.id && props.loadReplyAttachment) {
      props.loadReplyAttachment(doc.id)
        .then(resp => {
          setFileForPreview(resp)
          setIsPreviewOpen(true)
        })
        .catch(err => { console.log(err) })
    }
  }

  function onEditNote () {
    if (props.onPrivateNoteReplyEdit) {
      props.onPrivateNoteReplyEdit(props.reply)
    }
  }

  return <>
    <div className={style.notesListsItem} >
        <div className={style.notesListsItemProfile}>
            {props.reply.owner && <img src={getUserProfileInitialsForUser(props.reply.owner)} alt=""/>}
        </div>
        <div className={style.notesListsItemDetails}>
            <div className={style.notesListsItemDetailsContainer}>
                <h3 className={style.notesListsItemDetailsName}>{props.reply.owner?.name || ''}</h3>
                {isSignedInUserReplyTaskOwner(props.reply) && <NoteActionMenu hideEditAction isReplyAction onEdit={onEditNote} onDelete={() => setReplyDeleteModal(true)}></NoteActionMenu>}
            </div>
            <div className={style.notesListsItemDetailsDate}>{getCreatedDateTime(props.reply.created)}</div>
            {(props.reply?.commentMeta || props.reply?.comment) &&
              <div className={`${style.notesListsItemDetailsMessage} ${props.isLastReply ? style.notesListsItemDetailsMessageNew : ''} ${props.reply?.documents && props.reply?.documents?.length > 0 ? style.notesListsItemDetailsMessageHasDoc : ''}`} id={props.reply.id}>
                <Translation canShowTranslation={props.canShowTranslation}>
                  <MentionsInput
                    value={props.reply?.commentMeta || props.reply?.comment}
                    onChange={() => {}}
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
            }
            {props.reply?.documents && props.reply?.documents?.length > 0 && <div className={style.notesListsItemDetailsDocuments}>
                {
                props.reply.documents.map((document, index) => {
                    return (
                    <div key={index} className={style.notesListsItemDetailsDocumentsName} onClick={() => handleOnPreview(document)}>
                        <div className={style.notesListsItemDetailsDocumentsNameIcon}>
                        <OROFileIcon fileType={fileExtension(document.name)}></OROFileIcon>
                        </div>
                        <div className={style.notesListsItemDetailsDocumentsNameText}>
                        {document.name}
                        </div>
                    </div>
                    )
                })
                }
            </div>}
        </div>
    </div>
    {
      fileForPreview && isPreviewOpen &&
      <FilePreview
        fileBlob={fileForPreview}
        filename={docName}
        mediatype={mediaType}
        onClose={(e) => { setIsPreviewOpen(false); e.stopPropagation() }}
      />
    }
    {replyDeleteModal && <ConfirmationDialog
        actionType="danger"
        title={t("--deleteReply--")}
        description={t("--areYouSureYouWantToDeleteReply--")}
        primaryButton={t("--delete--")}
        secondaryButton={t("--cancel--")}
        isOpen={replyDeleteModal}
        width = {460}
        theme="coco"
        toggleModal={toggleReplyDeleteModal}
        onPrimaryButtonClick={deleteReplyNote}
        onSecondaryButtonClick={toggleReplyDeleteModal}
    />}
  </>
}

export function NoteReplyComponent (props: PrivateNoteReplyProps) {
  return <I18Suspense><NoteReplyComponentInternal {...props}></NoteReplyComponentInternal></I18Suspense>
}
