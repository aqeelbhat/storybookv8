import React, { useEffect, useRef, useState } from 'react'
import { Field } from '../types'
import { getFormFieldsMap, isFieldDisabled, isFieldOmitted, isFieldRequired, isRequired, validateFieldV2 } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import Grid from '@mui/material/Grid';
import Actions from '../../controls/actions';
import { Label, Value } from '../../controls/atoms';
import { EmailFormComponentData, EmailFormComponentProps, enumEmailFields } from './types';
import { Attachment } from '../../Types';
import { AttachmentReadOnly } from '../components/attachment-read-only.component';
import styles from './styles.module.scss'
import { TextArea, TextBox } from '../../Inputs';

export function EmailFormComponent (props: EmailFormComponentProps) {
  const [from, setFrom] = useState<string | null>(null)
  const [subject, setSubject] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[] | []>([])

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})

  const { t } = useTranslationHook()

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): EmailFormComponentData {
    return {
      from,
      subject,
      body,
      attachments
    }
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {

      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumEmailFields.from:
            invalidFieldId = fieldName
            return !from
          case enumEmailFields.subject:
            invalidFieldId = fieldName
            return !subject
          case enumEmailFields.body:
            invalidFieldId = fieldName
            return !body
        }
      }
    })
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
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
  function fetchData (skipValidation?: boolean): EmailFormComponentData {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }

  // to fill field values
  useEffect(() => {
    if (props.formData) {
      setFrom(props.formData.from || '')
      setSubject(props.formData.subject || '')
      setBody(props.formData.body || '')
      setAttachments(props.formData.attachments || [])
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumEmailFields.from,
      enumEmailFields.subject,
      enumEmailFields.body,
      enumEmailFields.attachments
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
    fieldMap, from, subject, body, attachments
  ])

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadFile && fieldName) {
      return props.loadFile(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function renderReadOnly () {
    return <Grid container spacing={2} mb={2}>
      {!isFieldOmitted(fieldMap, enumEmailFields.from) &&
        <>
          <Grid item xs={4}>
            <Label>{t('--senderEmail--')}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>{from || '-'}</Value>
          </Grid>
        </>
      }
      {!isFieldOmitted(fieldMap, enumEmailFields.subject) &&
        <>
          <Grid item xs={4}>
            <Label>{t('--emailSubject--')}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>{subject || '-'}</Value>
          </Grid>
        </>
      }
      {!isFieldOmitted(fieldMap, enumEmailFields.body) &&
        <>
          <Grid item xs={4}>
            <Label>{t('--emailBody--')}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>{body || '-'}</Value>
          </Grid>
        </>
      }
      {!isFieldOmitted(fieldMap, enumEmailFields.attachments) &&
        <>
          <Grid item xs={4}>
            <Label>{t('--attachments--')}</Label>
          </Grid>
          <Grid item xs={8}><div className={styles.files}>
            {attachments.length === 0 && '-'}
            {attachments.map((file: Attachment, i) => {
              return <AttachmentReadOnly
                attachment={file}
                key={i}
                onPreviewByURL={() => loadFile(`attachments[${i}]`, file.mediatype, file.name)}
              />
            })}</div>
          </Grid>
        </>
      }
    </Grid>
  }

  function renderEditMode () {
    return <Grid container spacing={2} mb={2}>

      {!isFieldOmitted(fieldMap, enumEmailFields.from) &&
        <Grid item xs={7}>
          <div data-testid="from-field" ref={(node) => { storeRef(enumEmailFields.from, node) }} >
            <TextBox
              label={t('--senderEmail--')}
              placeholder={t('--senderEmailPlaceholder--')}
              value={from}
              disabled={isFieldDisabled(fieldMap, enumEmailFields.from)}
              required={isFieldRequired(fieldMap, enumEmailFields.from)}
              forceValidate={forceValidate}
              validator={(value) => validateFieldV2(fieldMap, enumEmailFields.from, t('--senderEmail--'), value)}
              onChange={value => { setFrom(value) }}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumEmailFields.subject) &&
        <Grid item xs={7}>
          <div data-testid="to-field" ref={(node) => { storeRef(enumEmailFields.subject, node) }} >
            <TextBox
              label={t('--emailSubject--')}
              placeholder={t('--emailSubjectPlaceholder--')}
              value={subject}
              disabled={isFieldDisabled(fieldMap, enumEmailFields.subject)}
              required={isFieldRequired(fieldMap, enumEmailFields.subject)}
              forceValidate={forceValidate}
              validator={(value) => validateFieldV2(fieldMap, enumEmailFields.subject, t('--emailSubject--'), value)}
              onChange={value => { setSubject(value) }}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumEmailFields.body) &&
        <Grid item xs={12}>
          <div data-testid="body-field" ref={(node) => { storeRef(enumEmailFields.body, node) }} >
            <TextArea
              label={t('--emailBody--')}
              placeholder={t('--emailBodyPlaceholder--')}
              value={body}
              disabled={isFieldDisabled(fieldMap, enumEmailFields.body)}
              required={isFieldRequired(fieldMap, enumEmailFields.body)}
              forceValidate={forceValidate}
              validator={(value) => validateFieldV2(fieldMap, enumEmailFields.body, t('--emailBody--'), value)}
              onChange={value => { setBody(value) }}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumEmailFields.attachments) &&
        <>
          <Grid item xs={4}>
            <Label>{t('--attachments--')}</Label>
          </Grid>
          <Grid item xs={8}><div className={styles.files}>
            {attachments.length === 0 && '-'}
            {attachments.map((file: Attachment, i) => {
              return <AttachmentReadOnly key={i}
                attachment={file}
                onPreviewByURL={() => loadFile(`attachments[${i}]`, file.mediatype, file.name)}
              />
            })}</div>
          </Grid>
        </>
      }
    </Grid>
  }

  return (
    <>
      {props.isReadOnly && renderReadOnly()}
      {!props.isReadOnly && renderEditMode()}
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}

