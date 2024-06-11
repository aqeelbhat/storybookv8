import React, { useEffect, useRef, useState } from 'react'
import { InvoiceDuplicateFormProps, InvoiceDuplicateFields, InvoiceDuplicateFormData } from './types';
import { Field } from '../types';
import { IDRef } from '../../Types'
import { areObjectsSame, getFormFieldsMap, isFieldDisabled, isFieldRequired, isRequired, recursiveDeepCopy, validateFieldV2 } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import Grid from '@mui/material/Grid';
import Actions from '../../controls/actions';
import styles from './styles.module.scss'
import { OroButton, TextAreaControlNew } from '../../controls';
import { AlertCircle, XCircle } from 'react-feather';
import classNames from 'classnames';

import Check from './../assets/check-circle-shallow.svg'
export function InvoiceDuplicateForm (props: InvoiceDuplicateFormProps) {
  const [comment, setComment] = useState('')
  const [duplicateInvoice, setDuplicateInvoice] = useState<IDRef | null>(null)

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})

  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])
  function getI18 (key: string) {
    return t('--duplicate--.' + key)
  }

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): InvoiceDuplicateFormData {
    return {
      [InvoiceDuplicateFields.duplicateInvoice]: duplicateInvoice,
      [InvoiceDuplicateFields.comment]: comment
    }
  }

  // For Deep Copy share with parent
  function getFormDataWithUpdatedValue (fieldName: string, newValue: IDRef | string): InvoiceDuplicateFormData {
    const formData = recursiveDeepCopy(getFormData()) as InvoiceDuplicateFormData

    switch (fieldName) {
      case InvoiceDuplicateFields.comment:
        formData[fieldName] = newValue as string
        break
      case InvoiceDuplicateFields.duplicateInvoice:
        formData[fieldName] = newValue as IDRef
        break
    }
    return formData
  }

  // on Each Field Change
  function handleFieldValueChange (
    fieldName: string,
    oldValue: string | IDRef,
    newValue: string | IDRef
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
      else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const _hasDuplicate = duplicateInvoice?.id ? true : false
    const invalidFound = Object.keys(fieldMap).some(fieldName => {
      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case InvoiceDuplicateFields.comment:
            invalidFieldId = fieldName
            return !comment && _hasDuplicate
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
  function fetchData (skipValidation?: boolean): InvoiceDuplicateFormData {
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
    const data = props.formData
    if (data) {
      setDuplicateInvoice(data.duplicateInvoice || null)
      setComment(data.comment)
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [
        InvoiceDuplicateFields.duplicateInvoice,
        InvoiceDuplicateFields.comment
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
    duplicateInvoice, comment
  ])

  const _noData = !duplicateInvoice
  const _duplicateFound = duplicateInvoice?.id ? true : false

  return (_noData ? null :
    <>
      <Grid container spacing={4} mb={2}>
        {_duplicateFound && <Grid item xs={12}>
          <div className={styles.duplicate}>
            <AlertCircle size={23} />

            {getI18('--duplicateFound--')}</div>
          <div>{props.children}</div>
        </Grid>}
        {!_duplicateFound && <Grid item xs={12}>
          <div className={styles.noDuplicate}>
            <img src={Check} width={55} height={55} />
            <div>
              <div>{getI18('--noDuplicateFound--')}</div>
              <div className={styles.youCan}>{getI18('--youCanProceed--')}</div>
            </div>
          </div>
        </Grid>}
        <Grid container item xs={12} spacing={2}>
          {_duplicateFound &&
            <Grid item xs={12}>
              <div className={classNames(styles.sentenceFont, styles.continue)}>
                {getI18('--wouldYouProceed--')} </div>
            </Grid>}
          {_duplicateFound && <Grid item xs={12} data-testid="comment-field" ref={(node) => storeRef(InvoiceDuplicateFields.comment, node)}>
            {props.isReadOnly && <>
              <div className={styles.commentReadOnly}>{getI18('--commentByRequestor--')}</div>
              <div className={styles.userComment}>{comment || ''}</div>
            </>}
            {!props.isReadOnly && <>
              <div className={styles.comment}>{getI18('--pleaseComment--')}</div>
              <TextAreaControlNew
                value={comment || ''}
                placeholder={getI18('--startTyping--')}
                config={{
                  optional: !isFieldRequired(fieldMap, InvoiceDuplicateFields.comment),
                  forceValidate: forceValidate
                }}
                disabled={isFieldDisabled(fieldMap, InvoiceDuplicateFields.comment)}
                onChange={(value) => {
                  setComment(value || '')
                  handleFieldValueChange(InvoiceDuplicateFields.comment, comment, value)
                }}
                validator={value => validateFieldV2(fieldMap, InvoiceDuplicateFields.comment, getI18('--comment--'), value)}
              ></TextAreaControlNew>
            </>}
          </Grid>}
        </Grid>
        {_duplicateFound && !props.isReadOnly && <Grid item xs={12}>
          <div className={classNames(styles.sentenceFont, styles.discard)}>
            {getI18('--cancelRequestIfYouDontWant--')}
            <div className={styles.sep}></div>
            <OroButton onClick={props.onCancelRequest} type="link" label={getI18('--cancelRequest--')}
              icon={<XCircle size={20} />} iconOrientation='left' />
          </div>
        </Grid>}
      </Grid>
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}
