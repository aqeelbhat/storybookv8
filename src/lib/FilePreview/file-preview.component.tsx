import React, { useEffect, useState } from 'react'
import { Download, X } from 'react-feather'
import { Typography, Modal } from '@mui/material'

import { getDocumentHref } from '../util'
import { IDocument } from '@cyntler/react-doc-viewer'
import styles from './styles.module.scss'
import { DocViewerComponent } from './DocViewer'
import { jsonFileAcceptType } from '../Inputs'
import { Attachment } from '../Types'

export function FilePreview (props: {
  fileBlob?: Blob
  fileURL?: string
  filename?: string
  mediatype?: string
  isAsyncUrl?: boolean
  onAsyncFileDownload?: () => Promise<Blob>
  onClose: (event?) => void
}) {
  const [IDocument, setIDocument] = useState<IDocument | null>(null)
  const [link, setLink] = useState<string>('')
  function convertBlobForJSONFileType (resp: Blob): Blob {
    return new Blob([jsonFileAcceptType.includes(props.mediatype) ? JSON.stringify(resp) : resp], { type: props.mediatype });
  }
  function getMediaTypeAsPerBlobTypeForDownload (): string {
    return jsonFileAcceptType.includes(props.mediatype) ? 'application/json' : props.mediatype
  }

  function generateFileLink () {
    if (props.fileBlob && props.mediatype && !props.isAsyncUrl) {
      setLink(getDocumentHref(props.fileBlob, getMediaTypeAsPerBlobTypeForDownload(), props.filename || 'Document'))
    } else if (props.isAsyncUrl) {
      if (props.onAsyncFileDownload) {
        props.onAsyncFileDownload()
          .then(resp => {
            setLink(getDocumentHref(resp, getMediaTypeAsPerBlobTypeForDownload(), props.filename || 'Document'))
          })
          .catch(err => {
            console.warn('error in download url', err)
            setLink('')
          })
      }
    } else {
      setLink('')
    }
  }

  useEffect(() => {
    if (!props.fileURL) {
      const blob = convertBlobForJSONFileType(props.fileBlob)
      const fileURL = URL.createObjectURL(blob)
      setIDocument({
        uri: fileURL,
        fileName: props.filename,
        fileType: props.mediatype
      })
    } else {
      setIDocument({
        uri: props.fileURL,
        fileName: props.filename,
        fileType: props.mediatype
      })
    }
    if (props.fileURL || props.fileBlob) {
      generateFileLink()
    }
  }, [props.fileBlob, props.fileURL])

  return (
    <Modal
        open={!!IDocument}
        onClose={(e) => {props.onClose(e); setIDocument(null)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.filePreviewContainer}>
          <div className={styles.filePreviewHeader}>
              <div className={styles.fileName}>
                  <Typography noWrap={true} variant="body1">{props.filename || ''}</Typography>
              </div>
              <>
              <div className={styles.fileDownload}>
                {(props.fileBlob || props.isAsyncUrl) && <a style={{marginRight: '12px'}} target='_blank' rel='noopener noreferrer' href={link} download={props.filename}><Download color="#FFFFFF"  size={28}></Download></a>}
                <span><X color="#FFFFFF" size={28} onClick={(e) => {props.onClose(e); setIDocument(null)}}/></span>
              </div>
              </>
          </div>
          <div className={styles.fileContent}>
              {IDocument && 
                <DocViewerComponent
                  IDocument={IDocument}
              />}
          </div>
      </div>
    </Modal>
  )
}

export function OroImage (props: {
  file?: Attachment
  onLoad?: () => Promise<Blob>
}) {
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if (props.file && props.onLoad) {
      props.onLoad()
        .then(response => {
          const urlCreator = window.URL || window.webkitURL
          setImageUrl(urlCreator?.createObjectURL(response) || '')
        })
        .catch(err => {
          setImageUrl('')
          console.log(err)
        })
    } else {
      setImageUrl('')
    }
  }, [])

  return (<img src={imageUrl} alt={props.file?.filename || props.file?.name || 'image'} title={props.file?.filename || props.file?.name || 'image'} />)
}
