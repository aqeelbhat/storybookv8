import React, { useState } from 'react'
import { Trash2 } from 'react-feather'
import { FilePreview } from '../../FilePreview'
import { ConfirmationDialog } from '../../Modals'
import { Attachment } from '../../Types'

import styles from './items-styles.module.scss'

interface AttachmentItemProps {
  type: string
  file: Attachment | File
  note?: string
  onDelete: () => void
  onPreview?: () => Promise<Blob>
}

export function AttachmentItem (props: AttachmentItemProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)

  function previewFile () {
    if (!fileForPreview) {
      props.onPreview && props.onPreview()
        .then(resp => {
          setFileForPreview(resp)
          setIsPreviewOpen(true)
        })
        .catch(err => console.log())
    } else {
      setIsPreviewOpen(true)
    }
  }

  return (
    <div className={styles.attachmentItem}>
      <div className={styles.inputs}>
        <div className={styles.type}>
          {props.type}
        </div>

        <div className={styles.file} onClick={previewFile}>
          {(props.file as Attachment)?.filename || props.file.name || ''}
        </div>

        {fileForPreview && isPreviewOpen &&
          <FilePreview
            fileBlob={fileForPreview}
            filename={(props.file as Attachment)?.name || (props.file as Attachment)?.filename || ''}
            mediatype={(props.file as Attachment)?.mediatype || ''}
            onClose={() => setIsPreviewOpen(false)}
          />}

        <div className={styles.note}>
          {props.note || (props.file as Attachment)?.note || ''}
        </div>

        <div className={styles.delete}>
          <Trash2 onClick={() => setShowDeleteConfirmation(true)} size={20} color="#ABABAB" />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title={`Delete ${props.type}`}
        description={`You are deleting the attached ${props.type}`}
        primaryButton="Delete"
        secondaryButton="Cancel"
        actionType="danger"
        onPrimaryButtonClick={props.onDelete}
        onSecondaryButtonClick={() => setShowDeleteConfirmation(false)}
      />
    </div>
  )
}
