import React, { useState } from 'react'
import { FilePreview } from '../../FilePreview'
import { OROFileIcon } from '../../RequestIcon'
import { Attachment } from '../../Types'
import { getLocalDateString } from '../util'

import styles from './attachment-read-only.module.scss'

export function AttachmentReadOnly (props: {
  attachment: Attachment
  hideFileicon?: boolean
  onPreview?: () => Promise<Blob>
  onPreviewByURL?: () => Promise<string | Blob>
  onClose?: (event?) => void
}) {
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [fileURL, setFileURL] = useState<string>('')

  function previewFile (e) {
    e.stopPropagation()
    if (!fileForPreview) {
        if (!props.onPreviewByURL) {
          props.onPreview && props.onPreview()
            .then(resp => {
              setFileForPreview(resp)
              setIsPreviewOpen(true)
            })
            .catch(err => console.log(err))
        } else {
          props.onPreviewByURL && props.onPreviewByURL()
          .then(resp => {
            setFileForPreview(resp)
            if (typeof resp === 'string') {
              setFileURL(resp as string)
            }
            setIsPreviewOpen(true)
          })
          .catch(err => console.log(err))
        }
    } else {
      setIsPreviewOpen(true)
    }
  }

  function onClose () {
    setIsPreviewOpen(false)
    setFileForPreview(null)
    if(props.onClose) {
      props.onClose()
    }
  }

  return (
    <>
      {props.attachment && <div className={styles.attachmentSection} onClick={(e) => previewFile(e)}>
        {
          !props.hideFileicon &&
          <div className={styles.fileIcon}>
            <OROFileIcon fileType={props.attachment?.mediatype}></OROFileIcon>
          </div>
        }
        <div className={styles.attachmentSectionInfo}>
            <div className={styles.attachmentSectionInfoName}>
                <h3 className={styles.handleOverride}>{props.attachment?.name || props.attachment?.filename}</h3>
                <span>{props.attachment?.note || ''}</span>
            </div>

            <div className={styles.attachmentSectionInfoDate}>
                {props.attachment?.expiration ? `Expires on ${getLocalDateString(props.attachment?.expiration)}` : ''}
            </div>
        </div>
      </div>}
      {!props.attachment && <div className={styles.emptyAttachment}>-</div>}
      {fileForPreview && isPreviewOpen &&
        <FilePreview
          fileBlob={fileForPreview}
          fileURL={fileURL}
          filename={props.attachment?.name || props.attachment?.filename || ''}
          mediatype={props.attachment?.mediatype || fileForPreview?.type || ''}
          onClose={() => onClose()}
        />}
    </>
  )
}
