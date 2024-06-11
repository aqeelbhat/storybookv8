/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useState } from 'react'
import { Field, OroSupplierInformationUpdateForm } from '.';
import { Currency, Option, TextBox, TypeAhead } from '../Inputs';
import { IDRef, Money, OroMasterDataType } from '../Types';
import styles from './supplier-information-update-form.module.scss'
import { OroSupplierInformationUpdateFormProps } from './types'
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Circle } from "react-feather";
import radioFilledGreenIcon from './assets/radio-filled-green.png'
import { isEmpty, isRequired, isDisabled, isValidOption, areObjectsSame, areOptionsSame, mapOptionToIDRef, mapIDRefToOption, getFormFieldConfig, mapStringToOption, isOmitted } from './util';
import { getValueFromAmount } from '../Inputs/utils.service';
import classNames from 'classnames';
import { DEFAULT_CURRENCY } from '../util';
import { getSessionLocale } from '../sessionStorage';
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { OptionTreeData } from '../MultiLevelSelect/types';

export function SupplierInformationUpdateFormComponent (props: OroSupplierInformationUpdateFormProps) {
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  const [companyName, setCompanyName] = useState('')
  const [guid, setGuid] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [vendorType, setVendorType] = useState<IDRef>()
  const [vendorCountry, setVendorCountry] = useState('')
  const [compantyEntity, setCompantyEntity] = useState<IDRef>()
  const [spend, setSpend] = useState<Money>()
  const [hasSupplierEmail, setHasSupplierEmail] = useState(false)
  const [supplierContactEmail, setSupplierContactEmail] = useState('')
  const [isNewSupplier, setIsNewSupplier] = useState<boolean | null>(null)
  const [companyDomain, setCompanyDomain] = useState('')
  const [taxRegistrationID, setTaxRegistrationID] = useState('')

  const [companyEntitiesOptions, setCompanyEntitiesOptions] = useState<Option[]>([])
  const [vendorTypesOptions, setVendorTypesOptions] = useState<Option[]>([])
  const [countriesOptions, setCountriesOptions] = useState<Option[]>([])
  const [currenciesOptions, setCurrenciesOptions] = useState<Option[]>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERINFORMATIONUPDATEFORM])

  useEffect(() => {
    if (props.data) {
        setCompanyName(props.data.companyName || '')
        setGuid(props.data?.guid)
        setVendorId(props.data?.vendorId)
        setVendorType(props.data?.vendorType)
        setVendorCountry(props.data?.vendorCountry)
        setCompantyEntity(props.data?.compantyEntity)
        setSpend({
            currency: props.data.spend?.currency || props.defaultCurrency || DEFAULT_CURRENCY,
            amount: props.data.spend?.amount
          })
        setHasSupplierEmail(props.data.hasSupplierEmail || false)
        setSupplierContactEmail(props.data.supplierContactEmail || '')
        setIsNewSupplier(props.data.isNewSupplier)
        setCompanyDomain(props.data.companyDomain || '')
        setTaxRegistrationID(props.data.taxRegistrationID || '')
    }
  }, [props.data])

  useEffect(() => {
    props.currencies && setCurrenciesOptions(props.currencies)
  }, [props.currencies])

  useEffect(() => {
    props.vendorTypes && setVendorTypesOptions(props.vendorTypes)
  }, [props.vendorTypes])

  useEffect(() => {
    props.countries && setCountriesOptions(props.countries)
  }, [props.countries])

  useEffect(() => {
    props.companyEntities && setCompanyEntitiesOptions(props.companyEntities)
  }, [props.companyEntities])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        companyName: getFormFieldConfig('companyName', props.fields),
        guid: getFormFieldConfig('guid', props.fields),
        vendorId: getFormFieldConfig('vendorId', props.fields),
        vendorType: getFormFieldConfig('vendorType', props.fields),
        vendorCountry: getFormFieldConfig('vendorCountry', props.fields),
        compantyEntity: getFormFieldConfig('compantyEntity', props.fields),
        spend: getFormFieldConfig('spend', props.fields),
        hasSupplierEmail: getFormFieldConfig('hasSupplierEmail', props.fields),
        supplierContactEmail: getFormFieldConfig('supplierContactEmail', props.fields),
        isNewSupplier: getFormFieldConfig('isNewSupplier', props.fields),
        companyDomain: getFormFieldConfig('companyDomain', props.fields),
        taxRegistrationID: getFormFieldConfig('taxRegistrationID', props.fields)
      })
    }
  }, [props.fields])


  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t('--requiredField--',{field:label}) : ''
    } else {
      return ''
    }
  }

  function isArrayOfOptions (value: any): boolean {
    return Array.isArray(value) && (value.length === 0 || isValidOption(value[0]))
  }

  function getFormData (): OroSupplierInformationUpdateForm {
    return {
      companyName,
      guid,
      vendorId,
      vendorType,
      vendorCountry,
      compantyEntity,
      spend,
      hasSupplierEmail,
      supplierContactEmail,
      isNewSupplier,
      companyDomain,
      taxRegistrationID
    }
  }
  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Option[] | boolean | Money): OroSupplierInformationUpdateForm {
    const formData = JSON.parse(JSON.stringify(getFormData())) as OroSupplierInformationUpdateForm

    switch (fieldName) {
      case 'companyName':
        formData.companyName = newValue as string
        break
      case 'guid':
        formData.guid = newValue as string
        break
      case 'vendorId':
        formData.vendorId = newValue as string
        break
      case 'vendorType':
        formData.vendorType = mapOptionToIDRef(newValue as Option) as IDRef
        break
      case 'vendorCountry':
        formData.vendorCountry = (newValue as Option).path as string
        break
      case 'compantyEntity':
        formData.compantyEntity = mapOptionToIDRef(newValue as Option) as IDRef
        break
      case 'spend':
        formData.spend = newValue as Money
        break
      case 'hasSupplierEmail':
        formData.hasSupplierEmail = newValue === 'true'
        break
      case 'supplierContactEmail':
        formData.supplierContactEmail = newValue as string
        break
      case 'isNewSupplier':
          formData.isNewSupplier =  newValue === 'true'
          break
      case 'companyDomain':
          formData.companyDomain =  newValue as string
          break
      case 'taxRegistrationID':
          formData.taxRegistrationID =  newValue as string
          break
    }

    return formData
  }
  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Option | Option[] | boolean | Money,
    newValue: string | Option | Option[] | boolean | Money,
  ) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        // string/boolean
        props.onValueChange(
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (isArrayOfOptions(oldValue) && isArrayOfOptions(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
        // Option[]
        props.onValueChange(
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        // Option/Cost
        props.onValueChange(
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = props.fields?.some(field => {
      if (!isOmitted(field) && isRequired(field)) {
        switch (field.fieldName) {
          case 'companyName':
            invalidFieldId = 'companyName-field'
            return !companyName
          case 'guid':
            invalidFieldId = 'guid-field'
            return !guid
          case 'vendorId':
            invalidFieldId = 'vendorId-field'
            return !isNewSupplier && !vendorId
          case 'vendorType':
            invalidFieldId = 'vendorType-field'
            return !vendorType || !vendorType.id
          case 'vendorCountry':
            invalidFieldId = 'vendorCountry-field'
            return !vendorCountry
          case 'spend':
            invalidFieldId = 'spend-field'
            return (!(spend?.currency) || isEmpty(spend.currency) || !(spend?.amount) || isEmpty(spend.amount))
          case 'compantyEntity':
            invalidFieldId = 'compantyEntity-field'
            return !compantyEntity || !compantyEntity.id
          case 'supplierContactEmail':
            invalidFieldId = 'supplierContactEmail-field'
            return hasSupplierEmail && !supplierContactEmail
          case 'companyDomain':
            invalidFieldId = 'companyDomain-field'
            return !companyDomain
          case 'taxRegistrationID':
            invalidFieldId = 'taxRegistrationID-field'
            return !taxRegistrationID
        }
      }
    })

    if (!isInvalid) {
      if (hasSupplierEmail && !supplierContactEmail) {
        invalidFieldId = 'supplierContactEmail-field'
        isInvalid = true
      }
    }

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

  function fetchData (skipValidation?: boolean): OroSupplierInformationUpdateForm {
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

  function isFieldRequired (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
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

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    companyName, guid, vendorId, vendorCountry, compantyEntity, vendorType, spend, hasSupplierEmail, supplierContactEmail, isNewSupplier,
    companyDomain, taxRegistrationID
  ])

  function onVendorSelectionChange (e) {
    if (e.target.value === 'true') {
      setVendorId('')
    }
    setIsNewSupplier(e.target.value === 'true')
    handleFieldValueChange('isNewSupplier', isNewSupplier, e.target.value)
  }

  function onHasEmailChange (e) {
    if (e.target.value === 'false') {
      setSupplierContactEmail('')
    }
    setHasSupplierEmail(e.target.value === 'true')
    handleFieldValueChange('hasSupplierEmail', hasSupplierEmail, e.target.value)
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

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
    <div className={styles.si}>
        <h2 className={styles.siSecHeader}>{t('--vendorDetails--')}</h2>
        <div className={styles.siContainer}>
          <div className={classNames(styles.siContainerItem, styles.col2)} id="isNewSupplier-field">
                <RadioGroup
                    className={styles.siContainerItemRadio}
                    aria-label="newSupplier" name="newSupplier1" value={`${isNewSupplier}`}
                    onChange={onVendorSelectionChange}
                >
                    <FormControlLabel
                        value={'true'}
                        control={<Radio
                            checkedIcon={<img src={radioFilledGreenIcon} alt="" />}
                            icon={<Circle color="#d9d9d9" size={20}></Circle>} />
                        }
                        label={t('--newVendor--')}
                    />
                    <FormControlLabel
                        value={'false'}
                        control={<Radio
                            checkedIcon={<img src={radioFilledGreenIcon} alt="" />}
                            icon={<Circle color="#d9d9d9" size={20}></Circle>} />
                        }
                        label={t('--existingVendor--')}
                    />
                </RadioGroup>
            </div>

          {!isFieldOmitted('guid') &&
            <div className={classNames(styles.siContainerItem, styles.col2)} id="vendorId-field">
                  <TextBox
                      label={t('--guid--')}
                      placeholder={t('--enterGuid--')}
                      value={guid}
                      disabled={isFieldDisabled('guid')}
                      required={isFieldRequired('guid')}
                      forceValidate={forceValidate}
                      validator={(value) => validateField('guid', 'GUID', value)}
                      onChange={value => { setGuid(value); handleFieldValueChange('guid', guid, value) }}
                  />
              </div>}

          {!isNewSupplier && <div className={classNames(styles.siContainerItem, styles.col2)} id="vendorId-field">
                <TextBox
                    label={t('--sapErpVendorId--')}
                    placeholder={t('--enterSapErpVendorId--')}
                    value={vendorId}
                    disabled={isFieldDisabled('vendorId')}
                    required={isFieldRequired('vendorId')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('vendorId', 'SAP/ERP Vendor ID', value)}
                    onChange={value => { setVendorId(value); handleFieldValueChange('vendorId', vendorId, value) }}
                />
            </div>}
            <div className={classNames(styles.siContainerItem, styles.col2)} id="companyName-field">
                <TextBox
                    label={t('--vendorName--')}
                    placeholder={t('--enterVendorName--')}
                    value={companyName}
                    disabled={isFieldDisabled('companyName')}
                    required={isFieldRequired('companyName')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('companyName', 'Vendor Name', value)}
                    onChange={value => { setCompanyName(value); handleFieldValueChange('companyName', companyName, value) }}
                />
            </div>
            <div className={classNames(styles.siContainerItem, styles.col2)} id="vendorCountry-field">
                <TypeAhead
                    label={t('--vendorCountry--')}
                    placeholder={t('--selectVendorCountry--')}
                    value={mapStringToOption(vendorCountry)}
                    options={countriesOptions}
                    disabled={isFieldDisabled('vendorCountry')}
                    required={isFieldRequired('vendorCountry')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('vendorCountry', 'Vendor Country', value)}
                    onChange={value => { setVendorCountry((value as Option).path); handleFieldValueChange('vendorCountry', vendorCountry, value) }}
                />
            </div>
            <div className={classNames(styles.siContainerItem, styles.col2)} id="vendorType-field">
                <TypeAhead
                    label={t('--vendorType--')}
                    placeholder={t('--selectVendorType--')}
                    value={mapIDRefToOption(vendorType)}
                    options={vendorTypesOptions}
                    disabled={isFieldDisabled('vendorType')}
                    required={isFieldRequired('vendorType')}
                    forceValidate={forceValidate}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('VendorClassification', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'VendorClassification')}
                    validator={(value) => validateField('vendorType', 'Vendor Type', value)}
                    onChange={value => { setVendorType(mapOptionToIDRef(value)); handleFieldValueChange('vendorType', mapIDRefToOption(vendorType), value) }}
                />
            </div>

            {!isFieldOmitted('compantyEntity') &&
              <div className={classNames(styles.siContainerItem, styles.col2)} id="compantyEntity-field">
                  <TypeAhead
                      label={t('--companyCode--')}
                      placeholder={t('--selectCommpanyEntity--')}
                      type={OptionTreeData.entity}
                      value={mapIDRefToOption(compantyEntity)}
                      options={companyEntitiesOptions}
                      showTree={true}
                      disabled={isFieldDisabled('compantyEntity')}
                      required={isFieldRequired('compantyEntity')}
                      forceValidate={forceValidate}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                      validator={(value) => validateField('compantyEntity', 'Companty Entity', value)}
                      onChange={value => { setCompantyEntity(mapOptionToIDRef(value)); handleFieldValueChange('compantyEntity', mapIDRefToOption(compantyEntity), value) }}
                  />
              </div>}

            {!isFieldOmitted('spend') &&
              <div className={classNames(styles.siContainerItem, styles.col2)} id="spend-field">
                  <Currency
                      locale={getSessionLocale()}
                      label={t('--annualSpendContractValue--')}
                      unit={spend?.currency}
                      value={spend?.amount ? spend.amount.toLocaleString(getSessionLocale()) : ''}
                      unitOptions={currenciesOptions}
                      disabled={isFieldDisabled('spend')}
                      required={isFieldRequired('spend')}
                      forceValidate={forceValidate}
                      validator={(value) => validateField('spend', 'Annual Spend/Contract Value', Number(value))}
                      onChange={value => { setSpend({amount: Number(getValueFromAmount(value)), currency: spend?.currency}); handleFieldValueChange('spend', spend, {amount: Number(getValueFromAmount(value)), currency: spend.currency}) }}
                      onUnitChange={value => { setSpend({amount: spend.amount, currency: value || DEFAULT_CURRENCY}); handleFieldValueChange('spend', spend, {amount: spend.amount, currency: value || DEFAULT_CURRENCY}) }}
                  />
              </div>}

            {!isFieldOmitted('companyDomain') &&
              <div className={classNames(styles.siContainerItem, styles.col2)} id="companyDomain-field">
                  <TextBox
                      label={t('--companyDomain--')}
                      placeholder={t('--enterCompanyDomain--')}
                      value={companyDomain}
                      disabled={isFieldDisabled('companyDomain')}
                      required={isFieldRequired('companyDomain')}
                      forceValidate={forceValidate}
                      validator={(value) => validateField('companyDomain', 'Company domain', value)}
                      onChange={value => { setCompanyDomain(value); handleFieldValueChange('companyDomain', companyDomain, value) }}
                  />
              </div>}
            {!isFieldOmitted('taxRegistrationID') &&
              <div className={classNames(styles.siContainerItem, styles.col2)} id="taxRegistrationID-field">
                  <TextBox
                      label={t('--taxRegistrationId--')}
                      placeholder={t('--enterTaxRegistrationId--')}
                      value={taxRegistrationID}
                      disabled={isFieldDisabled('taxRegistrationID')}
                      required={isFieldRequired('taxRegistrationID')}
                      forceValidate={forceValidate}
                      validator={(value) => validateField('taxRegistrationID', 'Tax/Registration ID', value)}
                      onChange={value => { setTaxRegistrationID(value); handleFieldValueChange('taxRegistrationID', taxRegistrationID, value) }}
                  />
              </div>}
        </div>
        <h2 className={styles.siSecHeader}>{t('--contactDetails--')}</h2>
        <div className={styles.siContainer}>
            {/* <div className={styles.siContainerLabel}>Contact Details</div> */}
            <div className={classNames(styles.siContainerItem, styles.col2)} id="hasSupplierEmail-field">
                <RadioGroup
                    className={styles.siContainerItemRadio}
                    aria-label="email" name="email1" value={`${hasSupplierEmail}`}
                    onChange={onHasEmailChange}
                >
                    <FormControlLabel
                        value={'true'}
                        control={<Radio
                            checkedIcon={<img src={radioFilledGreenIcon} alt="" />}
                            icon={<Circle color="#d9d9d9" size={20}></Circle>} />
                        }
                        label={t('--iHaveAnEmail--')}
                    />
                    <FormControlLabel
                        value={'false'}
                        control={<Radio
                            checkedIcon={<img src={radioFilledGreenIcon} alt="" />}
                            icon={<Circle color="#d9d9d9" size={20}></Circle>} />
                        }
                        label={t('--iDontHaveAnEmail--')}
                    />
                </RadioGroup>
            </div>
            {hasSupplierEmail && <div className={classNames(styles.siContainerItem, styles.col2)} id="supplierContactEmail-field">
                <TextBox
                    label=""
                    placeholder={t('--enterEmail--')}
                    value={supplierContactEmail}
                    disabled={isFieldDisabled('supplierContactEmail')}
                    required={isFieldRequired('supplierContactEmail')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('supplierContactEmail', 'Supplier Contact Email', value)}
                    onChange={value => { setSupplierContactEmail(value); handleFieldValueChange('supplierContactEmail', supplierContactEmail, value) }}
                />
            </div>}
        </div>

        {/* <OroButton label="Submit" type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} /> */}
    </div>
  )
}
export function  SupplierInformationUpdateForm (props: OroSupplierInformationUpdateFormProps) {
  return <I18Suspense><SupplierInformationUpdateFormComponent  {...props} /></I18Suspense>
}
