import React, { useEffect, useRef, useState } from 'react'
import { Grid } from '@mui/material'

import { IDRef } from '../Types/common'
import { ClosePoFormData, ClosePoFormProps, Field, enumClosePOFields } from './types'
import { COL4, areObjectsSame, getFormFieldsMap, isFieldDisabled, isFieldRequired, isRequired, validateField } from './util'
import { ObjectSelector, TextArea } from '../Inputs'
import { ObjectSelectorConfig, ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { objectValidator } from '../CustomFormDefinition/View/validator.service'

import styles from './changepo-form-styles.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import Actions from '../controls/actions'

export const poObjectConfig: ObjectSelectorConfig = {
  type: ObjectType.po
}

export enum POType {
    closePO = 'closePO',
    openPO = 'openPo'
}

export function ClosePoForm (props: ClosePoFormProps) {
  const [type, setType] = useState<string>()
  const [poRef, setPORef] = useState<IDRef>()
  const [reason, setReason] = useState<string>('')

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.formData) {
      setType(props.formData.subType)
      setReason(props.formData.reason || '')
      setPORef(props.formData.poRef)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumClosePOFields.poRef, enumClosePOFields.reason]
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
    }
  }, [props.fields])

  function getFormData (): ClosePoFormData {
    return {
      purchaseOrder: props.formData?.purchaseOrder,
      poRef: poRef || undefined,
      subType: !props.isOpenPO ? POType.closePO : POType.openPO,
      reason
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: IDRef | string): ClosePoFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as ClosePoFormData

    switch (fieldName) {
      case enumClosePOFields.poRef:
        formData.poRef = newValue as IDRef
        break
      case enumClosePOFields.reason:
        formData.reason = reason as string
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    newValue?: IDRef | string,
    oldValue?: IDRef | string
  ) {
    if (props.onValueChange) {
      if (!areObjectsSame(newValue as IDRef, oldValue as IDRef)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {

      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
            case enumClosePOFields.reason:
              invalidFieldId = 'reason-field'
              return !reason
            case enumClosePOFields.poRef:
              invalidFieldId = 'po-field'
              return !poRef
        }
      }
    })

    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

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

  function fetchData (skipValidation?: boolean): ClosePoFormData {
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
  }, [props.fields, type, reason, poRef, props.isOpenPO])

  function handlePOSelect (value: IDRef) {
    setPORef(value)
    handleFieldValueChange(enumClosePOFields.poRef, value)
  }

  return (
    <div className={styles.changePoForm}>
      <Grid container spacing={2}>
        <Grid item xs={COL4}>
            <div data-testid="po-field" ref={(node) => { storeRef(enumClosePOFields.poRef, node) }}>
              <ObjectSelector
                value={poRef}
                type={ObjectType.po}
                objectSelectorConfig={poObjectConfig}
                disabled={false}
                required={isFieldRequired(fieldMap, enumClosePOFields.poRef)}
                description={poRef?.id ? t('--poSelectorSelectedTitle--', 'Purchase Order (PO)') : t('--poSelectorTitle--', 'Select Purchase Order (PO)')}
                forceValidate={forceValidate}
                departmentOptions={props.departmentOptions}
                searchObjects={props.searchObjects}
                getPO={props.getPO}
                validator={(value) => objectValidator(value)}
                onChange={value => { handlePOSelect(value) }}
              />
            </div>
        </Grid>
        <Grid item xs={COL4}>
            <div data-testid="reason-field" ref={(node) => storeRef(enumClosePOFields.reason, node)}>
              <TextArea
                label={!props.isOpenPO ? t('--closingReason--', 'Reason for closing') : t('--openingReason--', 'Reason for opening')}
                placeholder=""
                value={reason}
                disabled={isFieldDisabled(fieldMap, enumClosePOFields.reason)}
                required={isFieldRequired(fieldMap, enumClosePOFields.reason)}
                forceValidate={forceValidate}
                validator={(value) => validateField(!props.isOpenPO ? t('--closingReason--') : t('--openingReason--'), value)}
                onChange={value => { setReason(value) }}
              />
            </div>
        </Grid>
      </Grid>
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </div>
  )
}
