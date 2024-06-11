import React, { useEffect, useRef, useState } from 'react'
import { IEmailAttachmentFormProps, enumFields, InvoiceEmailAttachmentsFormData, BlobDetails } from './types'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import Grid from '@mui/material/Grid'
import { Attachment } from '../../Types'
import { Field } from '../types'
import { getFormFieldsMap, isRequired } from '../util'
import Actions from '../../controls/actions'
import styles from './styles.module.scss'

import Check from './../../Form/assets/filled-check-green-circle.svg'
import classNames from 'classnames'
import Preview from './Preview'
import { OROFileIcon } from '../../RequestIcon'

export function InvoiceEmailAttachmentsForm (props: IEmailAttachmentFormProps) {
  const [selectedAttachmentIndex, setAttachmentIndex] = useState<number>(-1)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [blobDetails, setBlobDetails] = useState<BlobDetails | null>(null)
  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): InvoiceEmailAttachmentsFormData {
    const newData = {
      selectedAttachmentIndex,
      attachments
    }
    return newData
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {
      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumFields.selectedAttachmentIndex:
            invalidFieldId = fieldName
            return selectedAttachmentIndex < 0
          case enumFields.attachments:
            invalidFieldId = fieldName
            return attachments.length === 0
        }
      }
      return false
    })
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId: string) {
    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()

    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // To get latest form fields data
  function fetchData (skipValidation?: boolean): InvoiceEmailAttachmentsFormData | null {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()
      const hasInvalid = !!invalidFieldId

      if (hasInvalid) {
        triggerValidations(invalidFieldId)
      }

      return hasInvalid ? null : getFormData()
    }
  }
  function handleSelect (index: number, attachmentList: Attachment[] = attachments) {
    if (index !== selectedAttachmentIndex) {
      setAttachmentIndex(index)
      const { mediatype = 'application/pdf', filename = 'attachment' } = attachmentList[index] || {}
      if (props.loadInvoice) {
        setBlobDetails(null)
        props.loadInvoice(`attachments[${index}]`, mediatype, filename)
          .then(resp => {
            setBlobDetails({ blob: resp, name: filename, type: mediatype })
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }

  // to fill field values
  useEffect(() => {
    const data = props.formData
    const attachmentAlreadyFilled = attachments.length > 0
    const hasAttachments = data?.attachments.length > 0
    // fill only first time,, so we don't keep loading file again n again
    if (hasAttachments && !attachmentAlreadyFilled) {
      setAttachments(data.attachments)
      handleSelect(data.selectedAttachmentIndex, data.attachments)
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [
        enumFields.attachments,
        enumFields.selectedAttachmentIndex
      ]
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
    }
  }, [props.fields])

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    fieldMap,
    selectedAttachmentIndex, attachments
  ])

  function renderReadOnly () {
    if (blobDetails && attachments[selectedAttachmentIndex]) {
      return <Grid item xs={12} >
        <div className={styles.readOnlyPreview}>
          <Preview blobDetails={blobDetails}></Preview></div>
      </Grid>
    }
    return null
  }

  return (
    <>
      <Grid container spacing={2} mb={2} data-testid="attachments-field" ref={(node) => { node && storeRef(enumFields.attachments, node) }}>
        {!props.isReadOnly && <Grid item xs={12} >
          <div className={styles.heading}>{t('--selectInvoiceAttachment--')}</div>
          <div className={styles.message}>{t('--invoiceAttachmentMessage--')}</div>
        </Grid>}
        {!props.isReadOnly && attachments.map((attachment, i) => {
          const _selected = (selectedAttachmentIndex === i)
          return <Grid item xs={12} key={i} data-testid="attachment" >
            <div className={classNames(styles.item, { [styles.selected]: _selected })}
              onClick={() => handleSelect(i)}>
              <div className={classNames(styles.header, { [styles.headerSelect]: _selected })}>
                <span className={styles.fileIcon}>
                  <OROFileIcon fileType={attachment.mediatype}></OROFileIcon>
                </span><span className={styles.fileName}>
                  {attachment.filename}</span>
                {!_selected && <span className={styles.selectLink} >{t('--select--')}</span>}
                {_selected && <span className={styles.selectedLink}>
                  <img src={Check} sizes='18' />{t('--selected--')}</span>}
              </div>
              <div className={classNames(styles.preview, { [styles.previewSelected]: _selected })}>
                {blobDetails && _selected && <Preview blobDetails={blobDetails}></Preview>}
              </div>
            </div>
          </Grid>
        })}
        {props.isReadOnly && renderReadOnly()}
      </Grid>
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}
