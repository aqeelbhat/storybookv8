import React, { useEffect, useState } from "react";
import { getFormFieldConfig, isDisabled, isRequired } from ".";
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";
import { Attachment, Option, OroMasterDataType } from "../Types";
import { SupplierSegmentation } from "../Types/vendor";
import { Field } from "./types";
import { areObjectsSame, isEmpty } from "./util";

import styles from './updateSupplierStatus-form-styles.module.scss'
import classnames from "classnames";
import { TextArea, TypeAhead } from "../Inputs";
import { OroButton } from "../controls";

export interface UpdateSupplierStatusFormData {
    supplierStatus: SupplierSegmentation | undefined
    statusComment: string
}

export interface UpdateSupplierStatusProps {
    formData?: UpdateSupplierStatusFormData
    fields?: Field[]
    classificationOption?: Array<Option>
    submitLabel?: string
    cancelLabel?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onValueChange?: (fieldName: string, formData: UpdateSupplierStatusFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: UpdateSupplierStatusFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => UpdateSupplierStatusFormData) => void
}

export function UpdateSupplierStatusForm (props: UpdateSupplierStatusProps) {
    const [selectedClassification, setSelectedClassification] = useState<Option>()
    const [classification, setClassification] = useState<Option[]>([])
    const [comment, setComment] = useState<string>('')
    const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
    const [forceValidate, setForceValidate] = useState<boolean>(false)

    const { t } = useTranslationHook([NAMESPACES_ENUM.UPDATESUPPLIERSTATUS])

    useEffect(() => {
        if (props.formData) {
          setComment(props.formData.statusComment)
          const classification = props.classificationOption?.find(option => option.path === props.formData.supplierStatus)
          if (classification) {
            setSelectedClassification(classification)
          }
        }
    }, [props.formData, props.classificationOption])

    useEffect(() => {
        props.classificationOption && setClassification(props.classificationOption)
    }, [props.classificationOption])

    useEffect(() => {
        if (props.fields) {
          setFieldMap({
            supplierStatus: getFormFieldConfig('supplierStatus', props.fields),
            statusComment: getFormFieldConfig('statusComment', props.fields)
          })
        }
    }, [props.fields])

    function getFormData (): UpdateSupplierStatusFormData {
        return {
          supplierStatus: SupplierSegmentation[selectedClassification?.path] || '',
          statusComment: comment || '',
        }
    }

    function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option ): UpdateSupplierStatusFormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as UpdateSupplierStatusFormData
    
        switch (fieldName) {
          case 'supplierStatus':
            formData.supplierStatus = SupplierSegmentation[newValue as string]
            break
          case 'statusComment':
            formData.statusComment = newValue as string
            break
        }

        return formData
    }

    function validateField (fieldName: string, label: string, value: string | string[] | number): string {
      if (fieldMap) {
        const field = fieldMap[fieldName]
        return isRequired(field) && isEmpty(value) ? `${label} is a required field.` : ''
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
              case 'supplierStatus':
                invalidFieldId = 'classification-field'
                return !(selectedClassification && selectedClassification.id)
              case 'statusComment':
                invalidFieldId = 'comment-field'
                return !comment
            }
          }
        })
        return isInvalid ? invalidFieldId : ''
    }

    function triggerValidations (invalidFieldId?: string) {
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

    function fetchData (skipValidation?: boolean): UpdateSupplierStatusFormData {
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

    function handleFieldValueChange(fieldName: string, oldValue: string | Option, newValue: string | Option) {
      if (props.onValueChange) {
        if (typeof newValue === 'string' && oldValue !== newValue) {
            props.onValueChange(fieldName, getFormDataWithUpdatedValue(fieldName, newValue))
        } else if (!areObjectsSame(oldValue, newValue)) {
            props.onValueChange(fieldName, getFormDataWithUpdatedValue(fieldName, newValue))
        }
      }
    }

    useEffect(() => {
        if (props.onReady) {
          props.onReady(fetchData)
        }
    }, [selectedClassification, comment])

    function fetchChildren (masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
      if (props.fetchChildren) {
        return props.fetchChildren(parent, childrenLevel, masterDataType)
      } else {
        return Promise.reject('fetchChildren API not available')
      }
    }

    function searchMasterdataOptions (keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
      if (props.searchOptions) {
        return props.searchOptions(keyword, masterDataType)
      } else {
        return Promise.reject('searchOptions API not available')
      }
    }

    return (
        <div className={styles.supplierStatusForm}>
          <div className={styles.section}>
            <div className={styles.row} >
              <div className={classnames(styles.item, styles.col3)} id="classification-field">
                <TypeAhead
                    label={t("Classification")}
                    placeholder={t("Choose classification")}
                    value={selectedClassification}
                    options={classification}
                    disabled={isFieldDisabled('supplierStatus')}
                    required={isFieldRequired('supplierStatus')}
                    forceValidate={forceValidate}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('SupplierSegmentation', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'SupplierSegmentation')}
                    validator={(value) => validateField('supplierStatus', t('Classification'), value)}
                    onChange={value => { setSelectedClassification(value); handleFieldValueChange('supplierStatus', selectedClassification?.path, value?.path || '') }}
                />
              </div>
            </div>

            <div className={styles.row} >
              <div className={classnames(styles.item, styles.col3)} id="comment-field">
                <TextArea
                  label={t("Comment")}
                  value={comment}
                  disabled={isFieldDisabled('statusComment')}
                  required={isFieldRequired('statusComment')}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('statusComment', t('Comment'), value)}
                  onChange={value => { setComment(value); handleFieldValueChange('statusComment', comment, value) }}
                />
              </div>
            </div>
          </div>
          <div className={styles.section}>
            {(props.submitLabel || props.cancelLabel) &&
            <div className={classnames(styles.row, styles.actionBar)} >
                <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
                <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
                { props.cancelLabel &&
                    <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
                { props.submitLabel &&
                    <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
                </div>
            </div>}
          </div>
        </div>
    )

}