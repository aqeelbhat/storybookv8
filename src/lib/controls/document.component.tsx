import React, { useEffect, useState } from 'react'
import { Download } from 'react-feather'

import { CustomFormField } from '../CustomFormDefinition/types/CustomFormModel'
import { DocumentField } from '../Types'
import { downloadFile, getDocumentHref } from '../util'
import { DocViewerComponent, FilePreview } from '../FilePreview'

import styles from './style.module.scss'
import { IDocument } from '@cyntler/react-doc-viewer'
import { getI18Text as getI18ControlText } from '../i18n'

interface DocumentProps {
  field?: CustomFormField
  value?: DocumentField
  mediatype?: string
  placeholder?: string
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>
}

export function DocumentControl (props: DocumentProps) {
  const [fileBlob, setFileBlob] = useState<Blob | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [IDocument, setIDocument] = useState<IDocument | null>(null)

  useEffect(() => {
    if (props.value && props.loadCustomerDocument && typeof props.loadCustomerDocument === 'function') {
      props.loadCustomerDocument(props.value.path, props.value.mediatype)
      .then(resp => {
        const blob = new Blob([resp], { type: props.value.mediatype });
        const fileURL = URL.createObjectURL(blob)
        setFileBlob(blob)
        setIDocument({
          uri: fileURL,
          fileName: props.value?.filename,
          fileType: props.value.mediatype
        })
      })
      .catch(err => console.log())
    }
  }, [props.value])

  function downloadDoc () {
    if (fileBlob && props.value.mediatype) {
        downloadFile(fileBlob, props.value.mediatype, props.value.filename || 'Document')
    }
  }

  return (
    <>
     { !props.field?.displayDocument && <div className={styles.document}>
       {IDocument &&
         <>
           <div className={styles.actions}>
             <div className={styles.previewText} onClick={() => { setIsPreviewOpen(true) }}>{getI18ControlText('--fieldTypes--.--document--.--preview--')}</div>
             <div className={styles.actionsDownload} onClick={downloadDoc}>
               <div className={styles.previewText}>{getI18ControlText('--fieldTypes--.--document--.--download--')}</div>
               <Download size={18} color={'var(--warm-stat-berry-regular)'} />
             </div>
           </div>
         </>
       }
     </div> }

     { props.field?.displayDocument && <div className={styles.documentWithDisplay}>
      {IDocument &&
        <>
          <DocViewerComponent
            IDocument={IDocument}
          />
          <div className={styles.downloadBtnWrapper} onClick={downloadDoc}>
            <Download size={18} color={'var(--panel-font-color)'}/>
          </div>
        </>
      }
    </div> }
    { fileBlob && isPreviewOpen && <FilePreview
      fileBlob={fileBlob}
      filename={props.value.filename}
      mediatype={props.value.mediatype || ''}
      key={IDocument.uri}
      onClose={(event) => { setIsPreviewOpen(false); event.stopPropagation() }}
    /> }
    </>
  )
}

interface DocumentPropsNew {
  value?: DocumentField
  placeholder?: string
  config: {
    displayDocument?: boolean
  }
  dataFetchers: {
    getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  }
}

interface InstructionImagePropsNew {
  value: DocumentField
  config: {
    displayDocument?: boolean
    showDocInInstruction?: boolean
  }
  dataFetchers: {
    getDocumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  }
}

export function DocumentControlNew (props: DocumentPropsNew) {
  const [fileBlob, setFileBlob] = useState<Blob | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [IDocument, setIDocument] = useState<IDocument | null>(null)

  useEffect(() => {
    if (props.value && props.dataFetchers.getDoucumentByPath && typeof props.dataFetchers.getDoucumentByPath === 'function') {
      props.dataFetchers.getDoucumentByPath(props.value.path, props.value.mediatype)
        .then(resp => {
          const blob = new Blob([resp], { type: props.value.mediatype });
          const fileURL = URL.createObjectURL(blob)
          setFileBlob(blob)
          setIDocument({
            uri: fileURL,
            fileName: props.value?.filename,
            fileType: props.value.mediatype
          })
        })
        .catch(err => console.log())
    }
  }, [props.value])

  function downloadDoc (): string {
    if (fileBlob && props.value.mediatype) {
      return getDocumentHref(fileBlob, props.value.mediatype, props.value.filename || 'Document')
    } else {
      return ''
    }
  }

  return (
    <>
     { !props.config.displayDocument && <div className={styles.document}>
       {IDocument &&
         <>
           <div className={styles.actions}>
             <div className={styles.previewText} onClick={() => { setIsPreviewOpen(true) }}>{getI18ControlText('--fieldTypes--.--document--.--preview--')}</div>
             <a className={styles.actionsDownload} href={downloadDoc()} download={props.value.filename || 'Document'}>
               <div className={styles.previewText}>{getI18ControlText('--fieldTypes--.--document--.--download--')}</div>
               <Download size={18} color={'var(--warm-stat-berry-regular)'} />
             </a>
           </div>
         </>
       }
     </div> }

     { props.config.displayDocument && <div className={styles.documentWithDisplay}>
      { IDocument &&
        <>
          <DocViewerComponent
            IDocument={IDocument}
          />
          <a className={styles.downloadBtnWrapper} href={downloadDoc()} download={props.value.filename || 'Document'}>
            <Download size={18} color={'var(--panel-font-color)'}/>
          </a>
        </>
      }
    </div> }
    { fileBlob && isPreviewOpen &&
      <FilePreview
        fileBlob={fileBlob}
        filename={props.value.filename}
        mediatype={props.value.mediatype}
        key={IDocument.uri}
        onClose={(event) => { setIsPreviewOpen(false); event.stopPropagation() }}
      />}
    </>
  )
}

export function InstructionImageControl (props: InstructionImagePropsNew) {
  const [IDocument, setIDocument] = useState<IDocument | null>(null)
  const [imageSource, setImageSource] = useState<string>('')

  useEffect(() => {
    if (props.value && props.dataFetchers.getDocumentByPath && typeof props.dataFetchers.getDocumentByPath === 'function') {
      props.dataFetchers.getDocumentByPath(props.value.path, props.value.mediatype)
        .then(resp => {
          const blob = new Blob([resp], { type: props.value.mediatype });
          const fileURL = URL.createObjectURL(blob)
          setImageSource(fileURL)
          setIDocument({
            uri: fileURL,
            fileName: props.value?.filename,
            fileType: props.value.mediatype
          })
        })
        .catch(err => console.log())
    }
  }, [props.value])

  return (
    <>
     { (props.config.displayDocument || props.config.showDocInInstruction) && <div className={styles.instructionImageDisplay}>
      {/* { IDocument &&
        <>
          <DocViewerComponent
            IDocument={IDocument}
            isUsedInInstruction={true}
          />
        </>
      } */}
      {imageSource && <img src={imageSource} alt="" width="100%" height="100%"/>}
    </div> }
    </>
  )
}
