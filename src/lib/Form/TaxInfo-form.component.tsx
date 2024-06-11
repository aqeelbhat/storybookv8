import React, { useEffect, useState } from 'react'
import { TaxInfoFormData, TaxInfoFormProps, Field } from './types';
import styles from './bankInfo-form-styles.module.scss'
import { TextBox } from '../Inputs';
import { getFormFieldConfig, isDisabled, isEmpty, isRequired } from './util';
import { OroButton } from '../controls';
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function TaxInfoFormComponent (props: TaxInfoFormProps) {
  const [taxId, setTaxid] = useState<string>('')

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    if (props.formData) {
      setTaxid(props.formData.taxId)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        taxId: getFormFieldConfig('taxId', props.fields),
      })
    }
  }, [props.fields])

  function getFormData (): TaxInfoFormData {
    return {
      taxId
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string): TaxInfoFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as TaxInfoFormData

    switch (fieldName) {
      case 'taxId':
        formData.taxId = newValue as string
        break
    }

    return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: string , newValue: string) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function validateField (fieldName: string, label: string, value: string | string[]): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t('--taxInfo--.--requiredField--',{field:label}) : ''
    } else {
      return ''
    }
  }

  function isFieldDisabled (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field)
    } else {
      return false
    }
  }

  function isFieldRequired (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    const isInvalid = props.fields && props.fields.some(field => {
      if (isRequired(field)) {
        switch (field.fieldName) {
          case 'taxId':
            invalidFieldId = 'tax-id-field'
            return !taxId
        }
      }
    })

    return isInvalid ? invalidFieldId : ''
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

  function fetchData (skipValidation?: boolean): TaxInfoFormData {
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
    taxId
  ])

  return (
    <div className={styles.bankInfoForm}>
      <div className={styles.bankInfoFormInputFields} id='tax-id-field'>
        <TextBox
          label={t('--taxInfo--.--taxId--')}
          value={taxId}
          disabled={isFieldDisabled('taxId')}
          required={isFieldRequired('taxId')}
          forceValidate={forceValidate}
          validator={(value) => validateField('taxId', t('--taxInfo--.--taxId--'), value)}
          onChange={value => { setTaxid(value); handleFieldValueChange('taxId', taxId, value) }}
        />
      </div>

      {
        (props.submitLabel || props.cancelLabel) &&
          <div className={styles.bankInfoFormBtnBox}>
            { props.cancelLabel &&
              <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
            { props.submitLabel &&
              <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
          </div>
        }
    </div>
  )

}
export function TaxInfoForm (props: TaxInfoFormProps) {
  return <I18Suspense><TaxInfoFormComponent  {...props} /></I18Suspense>
}
