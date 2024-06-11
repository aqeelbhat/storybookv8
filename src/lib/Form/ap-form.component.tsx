import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { APFormData, APFormProps, Field, VENDOR_CREATION_METHOD_MANUAL, VENDOR_CREATION_METHOD_SYSTEM } from './types'
import { Option, OroMasterDataType } from './../Types'
import { areOptionsSame, getFormFieldConfig, isDisabled, isEmpty, isOmitted, isRequired } from './util'
import { MultiSelect, Radio, TextBox, ToggleSwitch, TypeAhead } from '../Inputs'
import { OroButton } from '../controls'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import styles from './ap-form-styles.module.scss'
import { OptionTreeData } from '../MultiLevelSelect/types'

 function APInfoFormComponent (props: APFormProps) {
  const [companyEntityOptions, setCompanyEntityOptions] = useState<Option[]>([])
  const [additionalCompanyEntitiesOptions, setAdditionalCompanyEntitiesOptions] = useState<Option[]>([])
  const [paymentTermOptions, setPaymentTermOptions] = useState<Option[]>([])
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const [expenseAccountOptions, setExpenseAccountOptions] = useState<Option[]>([])
  const [methodOptions, setMethodOptions] = useState<Option[]>([])
  const [classificationOptions, setClassificationOptions] = useState<Option[]>([])

  const [method, setMethod] = useState<Option>()
  const [companyEntity, setCompanyEntity] = useState<Option>()
  const [additionalCompanyEntities, setAdditionalCompanyEntities] = useState<Option[]>([])
  const [eligible1099, setEligible1099] = useState<boolean>(false)
  const [syncToProcurement, setSyncToProcurement] = useState<boolean>(false)
  const [paymentTerms, setPaymentTerms] = useState<Option>()
  const [currency, setCurrency] = useState<Option>()
  const [expenseAccount, setExpenseAccount] = useState<Option>()
  const [vendorId, setVendorId] = useState<string>('')
  const [classification, setClassification] = useState<Option>()

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [supressVendorError, setSupressVendorError] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.APFORM])

  useEffect(() => {
    props.methodOptions && setMethodOptions(props.methodOptions)
  }, [props.methodOptions])

  useEffect(() => {
    props.subsidiaryOptions && setCompanyEntityOptions(props.subsidiaryOptions)
  }, [props.subsidiaryOptions])

  useEffect(() => {
    props.additionalSubsidiaryOptions && setAdditionalCompanyEntitiesOptions(props.additionalSubsidiaryOptions)
  }, [props.additionalSubsidiaryOptions])

  useEffect(() => {
    props.paymentTermOptions && setPaymentTermOptions(props.paymentTermOptions)
  }, [props.paymentTermOptions])

  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  useEffect(() => {
    props.expenseAccountOptions && setExpenseAccountOptions(props.expenseAccountOptions)
  }, [props.expenseAccountOptions])

  useEffect(() => {
    props.classificationOptions && setClassificationOptions(props.classificationOptions)
  }, [props.classificationOptions])

  useEffect(() => {
    if (props.formData) {
      setMethod(props.formData.method)
      setCompanyEntity(props.formData.companyEntity)
      setAdditionalCompanyEntities(props.formData.additionalCompanyEntities)
      setEligible1099(props.formData.eligible1099)
      setSyncToProcurement(props.formData.syncToProcurement)
      setPaymentTerms(props.formData.paymentTerms)
      setCurrency(props.formData.currency)
      setExpenseAccount(props.formData.expenseAccount)
      setVendorId(props.formData.vendorId)
      setClassification(props.formData.classification)

      // Reset error suppression flags
      setSupressVendorError(false)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        method: getFormFieldConfig('method', props.fields),
        companyEntity: getFormFieldConfig('companyEntity', props.fields),
        additionalCompanyEntities: getFormFieldConfig('additionalCompanyEntities', props.fields),
        eligible1099: getFormFieldConfig('eligible1099', props.fields),
        syncToProcurement: getFormFieldConfig('syncToProcurement', props.fields),
        paymentTerms: getFormFieldConfig('paymentTerms', props.fields),
        currency: getFormFieldConfig('currency', props.fields),
        expenseAccount: getFormFieldConfig('expenseAccount', props.fields),
        vendorId: getFormFieldConfig('vendorId', props.fields),
        classification: getFormFieldConfig('classification', props.fields)
      })
    }
  }, [props.fields])

  function getFormData (): APFormData {
    return {
      method,
      companyEntity,
      additionalCompanyEntities,
      eligible1099,
      syncToProcurement,
      paymentTerms,
      currency,
      expenseAccount,
      vendorId,
      classification
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | boolean | Option | Option[]): APFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as APFormData

    switch (fieldName) {
      case 'method':
        formData.method = newValue as Option
        break
      case 'companyEntity':
        formData.companyEntity = newValue as Option
        break
      case 'additionalCompanyEntities':
        formData.additionalCompanyEntities = newValue as Option[]
        break
      case 'eligible1099':
        formData.eligible1099 = newValue as boolean
        break
      case 'syncToProcurement':
        formData.syncToProcurement = newValue as boolean
        break
      case 'paymentTerms':
        formData.paymentTerms = newValue as Option
        break
      case 'currency':
        formData.currency = newValue as Option
        break
      case 'expenseAccount':
        formData.expenseAccount = newValue as Option
        break
      case 'vendorId':
        formData.vendorId = newValue as string
        break
      case 'classification':
        formData.classification = newValue as Option
        break
    }

    return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: string | boolean | Option | Option[], newValue: string | boolean | Option | Option[]) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
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
      return isRequired(field) && isEmpty(value) ? t('--requiredField--',{name:label}) : ''
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

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    const isInvalid = props.fields && props.fields.some(field => {
      if (!isOmitted(field) && isRequired(field) && method?.path === VENDOR_CREATION_METHOD_SYSTEM) {
        switch (field.fieldName) {
          case 'companyEntity':
            invalidFieldId = 'subsidiary-field'
            return !companyEntity || !companyEntity.id
          case 'additionalCompanyEntities':
            invalidFieldId = 'additional-subsidiary-field'
            return !additionalCompanyEntities || additionalCompanyEntities.length === 0
          case 'eligible1099':
            invalidFieldId = 'eligible-field'
            return eligible1099 === undefined
          case 'syncToProcurement':
            invalidFieldId = 'sync-field'
            return syncToProcurement === undefined
          case 'paymentTerms':
            invalidFieldId = 'payment-term-field'
            return !paymentTerms || !paymentTerms.id
          case 'currency':
            invalidFieldId = 'currency-field'
            return !currency || !currency.id
          case 'expenseAccount':
            invalidFieldId = 'expense-account-field'
            return !expenseAccount || !expenseAccount.id
          case 'classification':
            invalidFieldId = 'classification-field'
            return !classification || !classification.id
        }
      } else if (isRequired(field) && method?.path === VENDOR_CREATION_METHOD_MANUAL) {
        switch (field.fieldName) {
          case 'vendorId':
            invalidFieldId = 'vendor-id-field'
            return !vendorId
        }
      } else if (!method || !method.id) {
        invalidFieldId = 'method-field'
        return !method || !method.id
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

  function fetchData (skipValidation?: boolean): APFormData {
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
    method, companyEntity, additionalCompanyEntities, eligible1099, syncToProcurement,
    paymentTerms, currency, expenseAccount, vendorId, classification
  ])

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
  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields)?.customLabel || ''
  }

  return (
    <div className={styles.apForm}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col5)} id='method-field'>
            <Radio
              name='ap-vendor-method'
              label={getFieldLabelFromConfig('method') || t('--howToCreateVendorRecord--')}
              value={method}
              options={methodOptions}
              disabled={isFieldDisabled('method')}
              required={isFieldRequired('method')}
              forceValidate={forceValidate}
              validator={(value) => validateField('method', 'Vendor creation method', value)}
              onChange={value => {setMethod(value); handleFieldValueChange('method', method, value)}}
            />
          </div>
        </div>
      </div>

      {method && <div className={styles.section}>
        <div className={styles.title}>{t('--vendorRecordInfo--')}</div>

        {method?.path === VENDOR_CREATION_METHOD_SYSTEM &&
          <>
            <div className={`${styles.row} ${props.isInPortal ? styles.portalRow : ''}`}>
              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='subsidiary-field'>
                <TypeAhead
                  label={getFieldLabelFromConfig('companyEntity') || t('--primaryBusinessEntity--')}
                  placeholder={t('--choose--')}
                  type={OptionTreeData.entity}
                  value={companyEntity}
                  options={companyEntityOptions}
                  showTree={true}
                  disabled={isFieldDisabled('companyEntity')}
                  required={isFieldRequired('companyEntity')}
                  forceValidate={forceValidate}
                  expandLeft={props.isInPortal}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                  validator={(value) => validateField('companyEntity', 'Primary business entity', value)}
                  onChange={value => {setCompanyEntity(value); handleFieldValueChange('companyEntity', companyEntity, value)}}
                />
              </div>

              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='additional-subsidiary-field'>
                <MultiSelect
                  label={getFieldLabelFromConfig('additionalCompanyEntities') || t('--additionalBusinessEntity--')}
                  placeholder={t('--choose--')}
                  type={OptionTreeData.entity}
                  value={additionalCompanyEntities}
                  options={additionalCompanyEntitiesOptions}
                  showTree={true}
                  disabled={isFieldDisabled('additionalCompanyEntities')}
                  required={isFieldRequired('additionalCompanyEntities')}
                  forceValidate={forceValidate}
                  expandLeft={props.isInPortal}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                  validator={(value) => validateField('additionalCompanyEntities', 'Additional business entity', value)}
                  onChange={value => {setAdditionalCompanyEntities(value); handleFieldValueChange('additionalCompanyEntities', additionalCompanyEntities, value)}}
                />
              </div>
            </div>

            <div className={`${styles.row} ${props.isInPortal ? styles.portalRow : ''}`}>
              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='eligible-field'>
                <ToggleSwitch
                  label={getFieldLabelFromConfig('eligible1099') || t('--eligible--')}
                  value={eligible1099}
                  disabled={isFieldDisabled('eligible1099')}
                  required={isFieldRequired('eligible1099')}
                  falsyLabel={t('--no--')}
                  truthyLabel={t('--yes--')}
                  forceValidate={forceValidate}
                  onChange={value => {setEligible1099(value); handleFieldValueChange('eligible1099', eligible1099, value)}}
                />
              </div>

              { !isFieldOmitted('syncToProcurement') &&
                <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='sync-field'>
                  <ToggleSwitch
                    label={getFieldLabelFromConfig('syncToProcurement') || t('--syncToProcurify--')}
                    value={syncToProcurement}
                    disabled={isFieldDisabled('syncToProcurement')}
                    required={isFieldRequired('syncToProcurement')}
                    falsyLabel={t('--no--')}
                    truthyLabel={t('--yes--')}
                    forceValidate={forceValidate}
                    onChange={value => {setSyncToProcurement(value); handleFieldValueChange('syncToProcurement', syncToProcurement, value)}}
                  />
                </div>}
            </div>

            <div className={`${styles.row} ${props.isInPortal ? styles.portalRow : ''}`}>
              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='payment-term-field'>
                <TypeAhead
                  label={getFieldLabelFromConfig('paymentTerms') || t('--paymentTerms--')}
                  placeholder={t('--choose--')}
                  value={paymentTerms}
                  options={paymentTermOptions}
                  disabled={isFieldDisabled('paymentTerms')}
                  required={isFieldRequired('paymentTerms')}
                  forceValidate={forceValidate}
                  expandLeft={props.isInPortal}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('PaymentTerm', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'PaymentTerm')}
                  validator={(value) => validateField('paymentTerms', 'Payment terms', value)}
                  onChange={value => {setPaymentTerms(value); handleFieldValueChange('paymentTerms', paymentTerms, value)}}
                />
              </div>

              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='currency-field'>
                <TypeAhead
                  label={getFieldLabelFromConfig('currency') || t('--primaryCurrency--')}
                  placeholder={t('--choose--')}
                  value={currency}
                  options={currencyOptions}
                  disabled={isFieldDisabled('currency')}
                  required={isFieldRequired('currency')}
                  forceValidate={forceValidate}
                  expandLeft={props.isInPortal}
                  validator={(value) => validateField('currency', 'Primary currency', value)}
                  onChange={value => {setCurrency(value); handleFieldValueChange('currency', currency, value)}}
                />
              </div>
            </div>

            <div className={`${styles.row} ${props.isInPortal ? styles.portalRow : ''}`}>
              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='expense-account-field'>
                <TypeAhead
                  label={getFieldLabelFromConfig('expenseAccount') || t('--defaultExpenseAccount--')}
                  placeholder={t('--choose--')}
                  value={expenseAccount}
                  options={expenseAccountOptions}
                  disabled={isFieldDisabled('expenseAccount')}
                  required={isFieldRequired('expenseAccount')}
                  forceValidate={forceValidate}
                  expandLeft={props.isInPortal}
                  validator={(value) => validateField('expenseAccount', 'Default expense account', value)}
                  onChange={value => {setExpenseAccount(value); handleFieldValueChange('expenseAccount', expenseAccount, value)}}
                />
              </div>

              <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='classification-field'>
                <TypeAhead
                  label={getFieldLabelFromConfig('classification') || t('--supplierClassification--')}
                  placeholder={t('--choose--')}
                  value={classification}
                  options={classificationOptions}
                  disabled={isFieldDisabled('classification')}
                  required={isFieldRequired('classification')}
                  forceValidate={forceValidate}
                  expandLeft={props.isInPortal}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('VendorClassification', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'VendorClassification')}
                  validator={(value) => validateField('classification', 'Supplier classification', value)}
                  onChange={value => {setClassification(value); handleFieldValueChange('classification', classification, value)}}
                />
              </div>
            </div>
          </>}

        {method?.path === VENDOR_CREATION_METHOD_MANUAL &&
          <div className={styles.row}>
            <div className={classnames(styles.item, !props.isInPortal ? styles.col2 : styles.singleCol)} id='vendor-id-field'>
              <TextBox
                label={getFieldLabelFromConfig('vendorId') || t('--vendorID--')}
                placeholder=''
                value={vendorId}
                disabled={isFieldDisabled('vendorId')}
                required={isFieldRequired('vendorId')}
                forceValidate={(!supressVendorError && !!props.formData?.vendorError) || forceValidate}
                validator={(value) => (!supressVendorError && props.formData?.vendorError) ? props.formData?.vendorError : validateField('vendorId', 'Vendor ID', value)}
                onChange={value => {setVendorId(value); handleFieldValueChange('vendorId', vendorId, value); setSupressVendorError(true)}}
              />
            </div>
          </div>}

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type='link' fontWeight='semibold' onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>}
    </div>
  )
}
export function APInfoForm (props: APFormProps) {
  return <I18Suspense><APInfoFormComponent  {...props} /></I18Suspense>
}
