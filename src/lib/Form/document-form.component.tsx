import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { OroButton } from '../controls'
import { AttachmentBox, DateRange, imageFileAcceptType, pdfFileAcceptType, TextArea, TextBox, TypeAhead } from '../Inputs'
import { Attachment, Option } from './../Types'

import styles from './document-form-styles.module.scss'
import { DocumentFormData, DocumentFormProps } from './types'
import { areObjectsSame, getDateObject, isEmpty, validateDateOrdering } from './util'
import { getSessionLocale } from '../sessionStorage'

export function DocumentForm (props: DocumentFormProps) {
  const [documentTypeOptions, setDocumentTypeOptions] = useState<Option[]>([])
  const [ownerOptions, setOwnerOptions] = useState<Option[]>([])

  const [type, setType] = useState<Option>()
  const [name, setName] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [attachment, setAttachment] = useState<Attachment | File>()
  const [owner, setOwner] = useState<Option>()
  const [notes, setNotes] = useState<string>('')


  const [forceValidate, setForceValidate] = useState<boolean>(false)

  useEffect(() => {
    if (props.formData) {
      setType(props.formData.type)
      setName(props.formData.name)
      setStartDate(props.formData.startDate)
      setEndDate(props.formData.endDate)
      setAttachment(props.formData.attachment)
      setOwner(props.formData.owner)
      setNotes(props.formData.notes)
    }
  }, [props.formData])

  useEffect(() => {
    props.documentTypeOptions && setDocumentTypeOptions(props.documentTypeOptions)
  }, [props.documentTypeOptions])

  useEffect(() => {
    props.ownerOptions && setOwnerOptions(props.ownerOptions)
  }, [props.ownerOptions])

  function getFormData (): DocumentFormData {
    return {
      type,
      name,
      startDate,
      endDate,
      attachment,
      owner,
      notes
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Attachment | File): DocumentFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as DocumentFormData

    switch (fieldName) {
      case 'type':
        formData.type = newValue as Option
        break
      case 'name':
        formData.name = newValue as string
        break
      case 'startDate':
        formData.startDate = newValue as string
        break
      case 'endDate':
        formData.endDate = newValue as string
        break
      case 'attachment':
        formData.attachment = newValue as Attachment
        break
      case 'owner':
        formData.owner = newValue as Option
        break
      case 'notes':
        formData.notes = newValue as string
        break
    }

    return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: string | Option | Attachment | File, newValue: string | Option | Attachment | File) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function handleDateRangeChange (start: string, end: string) {
    setStartDate(start)
    setEndDate(end)

    handleFieldValueChange('start', startDate, start)
    handleFieldValueChange('end', endDate, end)
  }

  function handleFileChange (fieldName: string, file?: File) {
    if (file) {
      if (props.onFileUpload) {
        props.onFileUpload(file, fieldName)
      }
      handleFieldValueChange(fieldName, null, file)
    } else {
      if (props.onFileDelete) {
        props.onFileDelete(fieldName)
      }
      handleFieldValueChange(fieldName, 'file', file)
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = false

    if (!type || !type.id) {
      invalidFieldId = 'type-field'
      isInvalid = true
    } else if (!name) {
      invalidFieldId = 'name-field'
      isInvalid = true
    } else if (!startDate) {
      invalidFieldId = 'startDate-field'
      isInvalid = true
    } else if (!attachment) {
      invalidFieldId = 'attachment-field'
      isInvalid = true
    } else if (!owner || !owner.id) {
      invalidFieldId = 'owner-field'
      isInvalid = true
    }

    return isInvalid ? invalidFieldId : ''
  }

  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
    return isEmpty(value) ? `${label} is a required field.` : ''
  }

  function validateDateRange (dateRange: {startDate: string, endDate: string}): string {
    return validateField('startDate', 'Start date', dateRange.startDate) ||
      (dateRange.startDate !== null && dateRange.endDate !== null ? validateDateOrdering(dateRange.startDate, dateRange.endDate) : '')
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
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

  function fetchData (skipValidation?: boolean): DocumentFormData {
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

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    type, name, startDate, endDate, owner, notes
  ])

  return (
    <div className={styles.documentForm}>
      <div className={styles.section} >
        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id='type-field'>
            <TypeAhead
              label="Type"
              placeholder="Search"
              value={type}
              options={documentTypeOptions}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('type', 'Document type', value)}
              onChange={value => {setType(value); handleFieldValueChange('type', type, value)}}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id='name-field'>
            <TextBox
              label="Document name"
              value={name}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('name', 'Document name', value)}
              onChange={value => { setName(value); handleFieldValueChange('name', name, value) }}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id='startDate-field'>
            <DateRange
              locale={getSessionLocale()}
              label="Timeline"
              startDate={getDateObject(startDate)}
              endDate={getDateObject(endDate)}
              required={true}
              forceValidate={forceValidate}
              validator={validateDateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id='attachment-field'>
            <AttachmentBox
              label={'Upload File'}
              value={attachment}
              inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => isEmpty(value?.name || value?.filename) ? 'File is required.' : ''}
              onChange={(file) => handleFileChange(`attachment`, file)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section} >
        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id='owner-field'>
            <TypeAhead
              label="Owner"
              placeholder="Search"
              value={owner}
              options={ownerOptions}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('owner', 'Owner', value)}
              onChange={value => {setOwner(value); handleFieldValueChange('owner', owner, value)}}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id='notes-field'>
            <TextArea
              label="Add note"
              placeholder="Enter text"
              value={notes}
              required={false}
              forceValidate={forceValidate}
              onChange={value => { setNotes(value); handleFieldValueChange('notes', notes, value) }}
            />
          </div>
        </div>

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col4, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>
    </div>
  )
}
