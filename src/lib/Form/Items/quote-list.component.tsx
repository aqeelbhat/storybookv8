import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'react-feather'

import { InputWrapper } from '../../Inputs/input.component'

import styles from './items-styles.module.scss'
import { OROFileUpload } from '../../OROQuotesUploadPopup/oro-quotes-upload-popup.component'
import { AttachmentItem } from './attachment-item.component'
import { Attachment } from '../../Types'

interface QuotePOListProps {
  quote: Attachment
  orderForm: Attachment
  label: string
  description?: string
  required?: boolean
  onFileUpload?: (file: File, fieldName: string, fileName: string) => void
  deleteFile?: (fieldName: string) => void
  onPreview?: (fieldName: string, type: string, fileName: string) => Promise<Blob>
}

export function QuotePOList (props: QuotePOListProps) {
  const [quote, setQuote] = useState<Attachment | File | null>(null)
  const [quoteNote, setQuoteNote] = useState<string>('')
  const [orderForm, setOrderForm] = useState<Attachment | File | null>(null)
  const [purchaseOrderNote, setPurchaseOrderNote] = useState<string>('')

  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState<boolean>(false)
  const [fieldName, setFieldName] = useState('')
  const [popupTitle, setPopupTitle] = useState('')

  useEffect(() => {
    setQuote(props.quote || null)
  }, [props.quote])

  useEffect(() => {
    setOrderForm(props.orderForm || null)
  }, [props.orderForm])

  function toggleAttachmentMenu () {
    setShowAttachmentMenu(!showAttachmentMenu)
  }

  function showPopup (fieldName: string, title: string) {
    setPopupTitle(title)
    setFieldName(fieldName)
    setShowUploadPopup(true)
  }

  function uploadFile (file: File, fieldName: string, fileName: string, note?: string) {
    if (fieldName.includes('orderForm')) {
      setOrderForm(file)
      setPurchaseOrderNote(note || '')
    } else if (fieldName.includes('quote')) {
      setQuote(file)
      setQuoteNote(note || '')
    }
    if (props.onFileUpload) {
      props.onFileUpload(file, fieldName, fileName)
    }
  }

  function deleteFile (fieldName: string) {
    if (fieldName.includes('orderForm')) {
      setOrderForm(null)
      setPurchaseOrderNote('')
    } else if (fieldName.includes('quote')) {
      setQuote(null)
      setQuoteNote('')
    }
    if (props.deleteFile) {
      props.deleteFile(fieldName)
    }
  }

  function onPreview (type: string): Promise<Blob> {
    let attachment: Attachment
    switch (type) {
      case 'orderForm':
        attachment = orderForm
        break
      case 'quote':
        attachment = quote
    }

    if (attachment && props.onPreview) {
      return props.onPreview(type, attachment.mediatype, attachment.filename)
    } else {
      throw new Error()
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.quoteList}
    >
      <>
        { props.description &&
          <div className={styles.description}>{props.description}</div>}

        { (quote || orderForm) &&
          <div className={styles.header}>
            <div className={styles.type}>Type</div>
            <div className={styles.file}>File</div>
            <div className={styles.note}>Note</div>
            <div className={styles.delete}></div>
          </div>}

        { orderForm &&
          <AttachmentItem type="Order form" file={orderForm} note={purchaseOrderNote} onDelete={() => deleteFile('orderForm')} onPreview={() => onPreview('orderForm')} />}
        { quote &&
          <AttachmentItem type="Quote" file={quote} note={quoteNote} onDelete={() => deleteFile('quote')} onPreview={() => onPreview('quote')} />}

        { (!quote || !orderForm) &&
          <div className={styles.add} onClick={toggleAttachmentMenu}>
            <div className={styles.icon}><PlusCircle size={28} color="#D6D6D6" /></div>
            <div className={styles.label}>Add</div>
          </div>}
        
        { showAttachmentMenu &&
          <>
            <div className={styles.attachmentMenu}>
              { !orderForm &&
                <div className={styles.menuItem} onClick={() => showPopup('orderForm', 'Add order form')}>Order form</div>}
              { !quote &&
                <div className={styles.menuItem} onClick={() => showPopup('quote', 'Add quote')}>Quote</div>}
            </div>
            <div className={styles.backdrop} onClick={(e) => { setShowAttachmentMenu(false); e.stopPropagation() }}></div>
          </>}

        { showUploadPopup &&
          <div className={styles.fileUploadPopupContainer}>
            <OROFileUpload
              title={popupTitle}
              fieldName={fieldName}
              onClose={() => { setShowUploadPopup(false); setShowAttachmentMenu(false) }}
              onFileSelected={uploadFile}
            />
          </div>}
      </>
    </InputWrapper>
  )
}
