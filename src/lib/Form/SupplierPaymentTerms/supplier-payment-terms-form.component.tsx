import React, { useEffect, useRef, useState } from "react"
import Grid from '@mui/material/Grid'
import { SupplierEditPaymentTermFormData, SupplierEditPaymentTermProps, enumSupplierEditPaymentFields } from "./types"
import { Option } from "../../Inputs"
import { Field, TypeAhead, isRequired } from "../.."
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n"
import { getFormFieldsMap, isFieldDisabled, isFieldRequired, isOmitted, validateFieldV2 } from "../util"
import Actions from "../../controls/actions"
import { getCustomLabelFromConfig } from "../SupplierEditOption/util"
import styles from './styles.module.scss'

export function SupplierEditPaymentTermForm (props: SupplierEditPaymentTermProps) {
    const [paymentTerm, setPaymentTerm] = useState<Option>()
    const [paymentTermOption, setPaymentTermOption] = useState<Array<Option>>([])
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERPAYMENTTERM])

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (fieldName: string, node: HTMLDivElement) {
      fieldRefMap.current[fieldName] = node
    }

    function getFormData (): SupplierEditPaymentTermFormData {
        return {
          paymentTerm,
          companyEntityRef: props.formData?.companyEntityRef,
          vendorRef: props.formData?.vendorRef
        }
    }

    function isFormInvalid (): string {
        let invalidFieldId = ''
        const invalidFound = Object.keys(fieldMap).some(fieldName => {
          if (!isOmitted(fieldMap[fieldName]) && isRequired(fieldMap[fieldName])) {
              switch (fieldName) {
              case enumSupplierEditPaymentFields.paymentTerm:
                invalidFieldId = fieldName
                return !(paymentTerm && paymentTerm.id)
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

    function fetchData (skipValidation?: boolean): SupplierEditPaymentTermFormData {
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

    function getFormDataWithUpdatedValue (fieldName: string, newValue: Option): SupplierEditPaymentTermFormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as SupplierEditPaymentTermFormData

        switch (fieldName) {
          case enumSupplierEditPaymentFields.paymentTerm:
            formData.paymentTerm = newValue as Option
            break
        }

        return formData
    }

    function handleFieldValueChange(fieldName: string, oldValue: Option, newValue: Option) {
        if (props.onValueChange) {
          if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
            props.onValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          }
        }
      }

    useEffect(() => {
        if (props.formData) {
          setPaymentTerm(props.formData.paymentTerm)
        }
    }, [props.formData])

    useEffect(() => {
        if (props.fields) {
          const fieldList = [enumSupplierEditPaymentFields.paymentTerm]
          const _fieldMap = getFormFieldsMap(props.fields, fieldList)
          setFieldMap(_fieldMap)
        }
    }, [props.fields])

    useEffect(() => {
      if (props.paymentTermOption) {
        setPaymentTermOption(props.paymentTermOption)
      }
    }, [props.paymentTermOption])

    useEffect(() => {
        if (props.onReady) {
          props.onReady(fetchData)
        }
    }, [props.fields, paymentTerm])

    return (
        <>
          <Grid container spacing={2} mb={2}>
            <Grid spacing={1} item xs={12} md={6} data-testid="edit-option-field" ref={(node) => { storeRef(enumSupplierEditPaymentFields.paymentTerm, node) }} >
            <div className={styles.label}>{getCustomLabelFromConfig(enumSupplierEditPaymentFields.paymentTerm, props.fields) || t('--paymentTerms--')}</div>
              <TypeAhead
                placeholder={t('--select--')}
                value={paymentTerm}
                options={paymentTermOption}
                disabled={isFieldDisabled(fieldMap, enumSupplierEditPaymentFields.paymentTerm)}
                required={isFieldRequired(fieldMap, enumSupplierEditPaymentFields.paymentTerm)}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                validator={(value) => validateFieldV2(fieldMap, enumSupplierEditPaymentFields.paymentTerm, getCustomLabelFromConfig(enumSupplierEditPaymentFields.paymentTerm, props.fields) || t('--paymentTerms--'), value)}
                onChange={value => {setPaymentTerm(value); handleFieldValueChange(enumSupplierEditPaymentFields.paymentTerm, paymentTerm, value)}}
              />
            </Grid>
          </Grid>
          <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
            cancelLabel={props.cancelLabel}
            submitLabel={props.submitLabel}
          />
        </>
    )

}