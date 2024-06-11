import React, { useEffect, useMemo, useState } from 'react'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { MasterDataRoleObject, enumSupplierFields, SupplierFormProps, SupplierInputForm, SupplierTaxKeyField, emptyEcncryptedData } from '../../types'
import { areOptionsSame, getFormFieldConfig, isEmpty, isOmitted, validateDUNSNumber, validateEmail, validateField, validateWebsite } from '../../util'

import { OROWebsiteInput, TextBox, OROEmailInput, TypeAhead, Option } from '../../../Inputs'
import { Grid } from '@mui/material'
import styles from './add-new-supplier-styles.module.scss'
import { Check, ChevronDown, ChevronUp, Repeat, X } from 'react-feather'
import '../../custom-material-UI.scss'
import classNames from 'classnames'

import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../../../i18n'
import { getLangugePart } from '../../../util'
import { ContactRole, EncryptedData, EncryptedDataBox, debounce, isRequired, mapStringToOption } from '../../..'
import { ConfigurationFieldsSupplierIdentificationV2 } from '../types'

function AddNewSupplierContent (props: SupplierFormProps) {
  const [showHideNameRole, setShowHideNameRole] = useState(false)
  const [name, setName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [duns, setDuns] = useState('')
  const [roles, setRoles] = useState<Array<MasterDataRoleObject>>([])
  const [website, setWebsite] = useState('')
  const [role, setRole] = useState('')
  const [jurisdictionCountryCode, setJurisdictionCountryCode] = useState<Option>()
  const [langCode, setLangCode] = useState<Option>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [showContactDetails, setShowContactDetails] = useState(true)
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false)
  const [showTaxDetails, setShowTaxDetails] = useState(false)
  const [showTaxIdTypeList, setShowTaxIdTypeList] = useState(false)
  const [countryOptions, setCountryOptions] = useState<Option[]>([])
  const [languageOptions, setLangiageOptions] = useState<Option[]>([])
  const [tax, setTax] = useState<SupplierTaxKeyField>()
  const [indirectTax, setIndirectTax] = useState<SupplierTaxKeyField>()
  const [selectedTaxType, setSelectedTaxType] = useState('')
  const [refId, setRefId] = useState('')
  const [selectedTaxTypeValue, setSelectedTaxTypeValue] = useState<EncryptedData>(emptyEcncryptedData)
  const [indirectTaxTypeValue, setIndirectTaxTypeValue] = useState<EncryptedData>(emptyEcncryptedData)
  const [contactDetailsRequired, setContactDetailsRequired] = useState<boolean>(false)
  const [indirectTaxTypeName, setIndirectTaxTypeName] = useState<string>('')
  const [taxTypeName, setTaxTypeName] = useState<string>('')
  const [taxCodeFormatError, setTaxCodeFormatError] = useState(false)
  const [indirectTaxCodeFormatError, setIndirectTaxCodeFormatError] = useState(false)
  const [showRoleError, setShowRoleError] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

  useEffect(() => {
    if (props.formData) {
      if (props.formData?.name) {
        setName(props.formData.name)
      } else {
        setName('')
      }
      setContactName(props.formData.contactName || '')
      setEmail(props.formData.email || '')
      if (props.formData?.refId) {
        setRefId(props.formData.refId)
      }
      setTax(props.formData.tax)
      if (props.formData.tax?.encryptedTaxCode) {
        setSelectedTaxTypeValue(props.formData.tax?.encryptedTaxCode)
      } else {
        setSelectedTaxTypeValue(emptyEcncryptedData)
      }

      if (props.formData.tax?.taxKeysList && props.formData.tax?.taxKeysList?.length > 0) {
        setSelectedTaxType(props.formData.tax?.taxKeysList[0])
      } else {
        setSelectedTaxType('')
      }
      if (props.formData.tax?.taxKey) {
        setTaxTypeName(getTaxKeyNameForKey(props.formData.tax?.taxKey))
      } else {
        setTaxTypeName(getTaxKeyNameForKey(props.formData.tax?.taxKeysList[0]))
      }

      setIndirectTax(props.formData.indirectTax)
      if (props.formData.indirectTax?.taxKeysList) {
        setIndirectTaxTypeName(getTaxKeyNameForKey(props.formData.indirectTax?.taxKeysList[0]))
      } else {
        setIndirectTaxTypeName('')
      }

      if (props.formData.indirectTax?.encryptedTaxCode) {
        setIndirectTaxTypeValue(props.formData.indirectTax?.encryptedTaxCode)
      } else {
        setIndirectTaxTypeValue(emptyEcncryptedData)
      }

      if (props.formData.jurisdictionCountryCode && props.countryOptions) {
        const selectedCountry  = props.countryOptions.find(item => item?.customData?.code === props.formData?.jurisdictionCountryCode.path)
        if (selectedCountry) {
          setJurisdictionCountryCode(selectedCountry)
        }
      } else {
        setJurisdictionCountryCode(mapStringToOption(''))
      }

      if (props.formData.langCode && props.languageOptions) {
        setLangCode(props.formData.langCode)
      } else {
        setLangCode(undefined)
      }
    }
  }, [props.formData])

  useEffect(() => {
    if (jurisdictionCountryCode?.path && props.languageOptions) {
      const languagesForCountry = jurisdictionCountryCode?.customData?.other?.languages.split(',') || []
      const defaultLanguages = languagesForCountry.map(code => {
          return props.languageOptions.find(language => getLangugePart(code) === language?.path)
      }).filter(item => item)

      setLangCode(defaultLanguages[0] || props.languageOptions[0])
    }
  }, [jurisdictionCountryCode])

  useEffect(() => {
    if (props.taxCodeFormatError) {
      setTaxCodeFormatError(props.taxCodeFormatError)
    } else {
      setTaxCodeFormatError(false)
    }

  }, [props.taxCodeFormatError])

  useEffect(() => {
    setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
  }, [props.indirectTaxCodeFormatError])

  useEffect(() => {
    if (props.supplierRoles && props.supplierRoles.length > 0) {
      setRoles(props.supplierRoles)
    }
  }, [props.supplierRoles])

  function isShowCountyCodeEnable (): boolean {
    if (props.supplierFormConfigurationFields) {
      const field = getFormFieldConfig(ConfigurationFieldsSupplierIdentificationV2.showCountyCodeInCountryListing, props.supplierFormConfigurationFields)
      return field?.booleanValue
    }
    return false
  }

  useEffect(() => {
    if (props.countryOptions && isShowCountyCodeEnable()) {
        const options = props.countryOptions.map (item => {
          return({id: item.path,
          displayName: `${item.displayName} (${item.path})`,
          path: item.path,
          customData: item.customData,
          selected: item.selected,
          selectable: item.selectable
        })
      })
      setCountryOptions(options)
    } else if (props.countryOptions) {
      setCountryOptions(props.countryOptions)
    }
  }, [props.countryOptions, props.supplierFormConfigurationFields])

  useEffect(() => {
    props.languageOptions && setLangiageOptions(props.languageOptions)
  }, [props.languageOptions])

  function submitForm () {
    if (props.onFormSubmit && !props.readonly && contactName && email) {
      setForceValidate(false)
      props.onFormSubmit({ ...props.formData, name, website, contactName, email, phone, role, duns, refId, designation: { role: ContactRole.primary }, langCode, jurisdictionCountryCode, tax, indirectTax })
    } else if (props.onFormSubmit && !props.readonly && contactName && !email) {
      setForceValidate(false)
      props.onFormSubmit({ ...props.formData, name, website, contactName, phone, role, duns, refId, langCode, jurisdictionCountryCode, tax, indirectTax })
    } else if (props.onFormSubmit && !props.readonly && !contactName && email) {
      setForceValidate(false)
      props.onFormSubmit({ ...props.formData, name, website, email, phone, role, duns, refId, designation: { role: ContactRole.primary }, langCode, jurisdictionCountryCode, tax, indirectTax })
    } else if (props.onFormSubmit && !props.readonly && !contactName && !email) {
      setForceValidate(false)
      props.onFormSubmit({ ...props.formData, name, website, duns, refId, langCode, jurisdictionCountryCode, tax, indirectTax })
    }
  }

  function isFieldRequired (fieldName: string): boolean {
    if (props.supplierFormConfigurationFields) {
      const field = getFormFieldConfig(fieldName, props.supplierFormConfigurationFields)
      return isRequired(field)
    }
    return false
  }

  function checkAnyAdditionalDetailsRequired () {
    if ((!website && isFieldRequired(enumSupplierFields.website)) || (!duns && isFieldRequired(enumSupplierFields.duns)) || (!selectedTaxTypeValue?.unencryptedValue && isFieldRequired(enumSupplierFields.tax)) || (!indirectTaxTypeValue?.unencryptedValue && isFieldRequired(enumSupplierFields.inDirectTax))) {
      setShowAdditionalDetails(true)
    }
  }

  function checkAllFields (): boolean {
    checkAnyAdditionalDetailsRequired()
    return (
      !name || (!jurisdictionCountryCode?.path && isFieldRequired(enumSupplierFields.country)) ||
      (!langCode && isFieldRequired(enumSupplierFields.language)) ||
      ((!website && isFieldRequired(enumSupplierFields.website)) || (!!website && !!validateWebsite(t("--companyWebsite--"), website))) ||
      (!duns && isFieldRequired(enumSupplierFields.duns)) || (!!validateDUNSNumber(t("--dunsNumber--"), duns) && !!duns) ||
      (!email && isFieldRequired(enumSupplierFields.email)) || (validateEmail(t("--email--"), email) && !!email) ||
      (!contactName && isFieldRequired(enumSupplierFields.contact)) ||
      (!selectedTaxTypeValue?.unencryptedValue && isFieldRequired(enumSupplierFields.tax)) ||
      (!indirectTaxTypeValue?.unencryptedValue && isFieldRequired(enumSupplierFields.inDirectTax))
    )
  }

  function handleRoleValidation (value: string) {
    if (!value && isFieldRequired(enumSupplierFields.role)) {
      setShowRoleError(true)
    } else {
      setShowRoleError(false)
    }
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }

  function handleWebsiteValidation (value: string): string {
    if (!value && !isFieldRequired(enumSupplierFields.website)) {
      return ''
    } else {
      return validateWebsite(getFormFieldConfig(enumSupplierFields.website, props.supplierFormConfigurationFields)?.customLabel || t("--companyWebsite--"), value)
    }
  }
  function handleDUNSNumberValidation (value: string): string {
    if (!value && !isFieldRequired(enumSupplierFields.duns)) {
      return ''
    } else {
      return validateDUNSNumber(getFormFieldConfig(enumSupplierFields.duns, props.supplierFormConfigurationFields)?.customLabel || t("--dunsNumber--"), value)
    }
  }
  function getFormData (): SupplierInputForm {
    if (!contactName && !email) {
      return { ...props.formData, name, website, contactName, email, phone, role, duns, refId, langCode, jurisdictionCountryCode }
    }
    return { ...props.formData, name, website, contactName, email, phone, role, duns, refId, designation: { role: ContactRole.primary }, langCode, jurisdictionCountryCode, tax, indirectTax }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Option[] | SupplierTaxKeyField): SupplierInputForm {
    const formData = JSON.parse(JSON.stringify(getFormData())) as SupplierInputForm

    switch (fieldName) {
      case enumSupplierFields.supplierName:
        formData.name = newValue as string
        break
      case enumSupplierFields.website:
        formData.website = newValue as string
        break
      case enumSupplierFields.contact:
        formData.contactName = newValue as string
        break
      case enumSupplierFields.email:
        formData.email = newValue as string
        break
      case enumSupplierFields.phoneNumber:
        formData.phone = newValue as string
        break
      case enumSupplierFields.role:
        formData.role = newValue as string
        break
      case enumSupplierFields.duns:
        formData.duns = newValue as string
        break
      case enumSupplierFields.language:
        formData.langCode = newValue as Option
        break
      case enumSupplierFields.country:
        formData.jurisdictionCountryCode = newValue as Option
        break
      case enumSupplierFields.inDirectTax:
        formData.indirectTax = newValue as SupplierTaxKeyField
        break
      case enumSupplierFields.tax:
        formData.tax = newValue as SupplierTaxKeyField
        break
    }

    return formData
  }

  function isFieldOmitted (fieldName: string): boolean {
    if (props.supplierFormConfigurationFields) {
      const field = getFormFieldConfig(fieldName, props.supplierFormConfigurationFields)
      return isOmitted(field)
    }
    return false
  }

  function handleTaxValueChange (taxValue: EncryptedData, fieldType: string ) {
    if (fieldType === enumSupplierFields.tax && tax && selectedTaxType && selectedTaxType) {
      setTax({ ...tax, encryptedTaxCode: taxValue, taxKey: selectedTaxType })
      setSelectedTaxTypeValue(taxValue)
    } else if (fieldType === enumSupplierFields.inDirectTax && indirectTax && indirectTax?.taxKeysList?.length > 0) {
      setIndirectTax({ ...indirectTax, encryptedTaxCode: taxValue, taxKey: indirectTax?.taxKeysList[0] })
      // handleOnValidateTINFormat(value, SupplierDetailsFields.inDirectTax)
      setIndirectTaxTypeValue(taxValue)
    }
  }

  function handleIndirectTaxValueChange (taxValue: string, fieldType: string ) {
    const value = {
      version: '',
      data: '',
      iv: '',
      unencryptedValue: taxValue,
      maskedValue: ''
    }
    if (fieldType === enumSupplierFields.inDirectTax && indirectTax && indirectTax?.taxKeysList?.length > 0) {
      setIndirectTax({ ...indirectTax, encryptedTaxCode: value, taxKey: indirectTax?.taxKeysList[0] })
      setIndirectTaxTypeValue(value)
    }
  }

  function triggerValidations () {
    // handleRoleValidation(role)
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }
  function fetchData (skipValidation?: boolean): SupplierInputForm | null {
    if (checkAllFields()) {
      triggerValidations()
    }

    return checkAllFields() ? null : getFormData()
  }

  function checkAllFieldsValidated () {
    if (checkAllFields()) {
      if (!showTaxDetails && ((!selectedTaxTypeValue?.unencryptedValue && isFieldRequired(enumSupplierFields.tax)) ||
        (!indirectTaxTypeValue?.unencryptedValue && isFieldRequired(enumSupplierFields.inDirectTax)))) {
        setShowTaxDetails(true)
      }
      triggerValidations()
    } else {
      submitForm()
    }
  }

  function dispatchOnValueChange (fieldName: string, formData: SupplierInputForm) {
    if (props.onValueChange) {
      props.onValueChange(
        fieldName,
        formData
      )
    }
  }
    // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedOnValueChange = useMemo(() => debounce(dispatchOnValueChange), [])

  function handleFieldValueChange(fieldName: string, oldValue: string | Option | Option[], newValue: string | Option | Option[]) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        debouncedOnValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
        debouncedOnValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
        debouncedOnValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
  }

  function handleOnValidateTINFormat (fieldType: string) {
    let taxCode: string
    let taxValue

    if (fieldType === enumSupplierFields.tax) {
      taxCode = 'encryptedTaxCode'
      taxValue = tax
    }

    if (fieldType === enumSupplierFields.inDirectTax) {
      taxCode = 'encryptedIndirectTaxCode'
      taxValue = indirectTaxTypeValue
    }

    if (props.validateTaxFormat && selectedTaxType && jurisdictionCountryCode) {
      props.validateTaxFormat(selectedTaxType, jurisdictionCountryCode?.path, taxValue?.encryptedTaxCode, taxCode)
    }
  }

  function toggleModal () {
    setShowTaxIdTypeList(!showTaxIdTypeList)
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [name, email, phone, contactName, role, website, showHideNameRole, duns])

  function getTaxKeyNameForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.name || ''
  }

  function handleSelectTaxType (taxCode: string) {
    setSelectedTaxType(taxCode)
    setTaxTypeName(getTaxKeyNameForKey(taxCode))
    setShowTaxIdTypeList(!showTaxIdTypeList)
  }

  function handleShowTaxIdTypes () {
    setShowTaxIdTypeList(true)
  }

  return (
    <div className={styles.supplierIdForm}>
      <div className={styles.supplierIdFormRow}>
        <h2 className={styles.supplierIdFormHeading}>{t("--addNewSupplier--")}</h2>
        <X size={24} color="var(--warm-neutral-shade-200)" onClick={props.onClose}/>
      </div>
      <div className={styles.supplierDetailContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classNames(styles.fwrapper)}>
              <TextBox
                label={`${getFormFieldConfig(enumSupplierFields.supplierName, props.supplierFormConfigurationFields)?.customLabel || t("--companyName--")} ${!isFieldRequired(enumSupplierFields.supplierName) ? `(${t("--optional--")})` : ''}`}
                disabled={props.disabled}
                validator={(value) => validateField(getFormFieldConfig(enumSupplierFields.supplierName, props.supplierFormConfigurationFields)?.customLabel || t("--companyName--"), value)}
                required={true}
                placeholder={t("--enterName--")}
                value={name}
                onChange={setName}
              />
            </div>
          </Grid>
          {!isFieldOmitted(enumSupplierFields.contact) && <Grid item xs={6}>
            <div className={classNames(styles.fwrapper)}>
              <label className={styles.roleLabel}>{getFormFieldConfig(enumSupplierFields.contact, props.supplierFormConfigurationFields)?.customLabel || t("--contactName--")}</label>
              <TextBox
                disabled={props.disabled}
                required={isFieldRequired(enumSupplierFields.contact)}
                forceValidate={forceValidate}
                validator={(value) => validateField(getFormFieldConfig(enumSupplierFields.contact, props.supplierFormConfigurationFields)?.customLabel || t("--contactName--"), value)}
                placeholder={t("--enterName--")}
                value={contactName}
                onChange={setContactName}
              />
            </div>
          </Grid>}
          {!isFieldOmitted(enumSupplierFields.email) && <Grid item xs={6}>
            <div className={classNames(styles.fwrapper)}>
              <label className={styles.roleLabel}>{getFormFieldConfig(enumSupplierFields.email, props.supplierFormConfigurationFields)?.customLabel || t("--email--")}</label>
              <OROEmailInput
                disabled={props.disabled}
                required={isFieldRequired(enumSupplierFields.email)}
                forceValidate={forceValidate}
                validator={(value) => validateEmail(getFormFieldConfig(enumSupplierFields.email, props.supplierFormConfigurationFields)?.customLabel || t("--email--"), value, !isFieldRequired(enumSupplierFields.email))}
                placeholder={t("--enterEmail--")}
                value={email}
                onChange={setEmail}
              />
            </div>
          </Grid>}
          {!isFieldOmitted(enumSupplierFields.country) && <Grid item xs={6}>
            <div className={classNames(styles.fwrapper)}>
              <TypeAhead
                label={`${getFormFieldConfig(enumSupplierFields.country, props.supplierFormConfigurationFields)?.customLabel || t("--country--")}`}
                placeholder={t("--chooseCountry--")}
                value={jurisdictionCountryCode}
                options={countryOptions}
                required={isFieldRequired(enumSupplierFields.country)}
                forceValidate={forceValidate}
                validator={(value) => validateField(getFormFieldConfig(enumSupplierFields.country, props.supplierFormConfigurationFields)?.customLabel || t("--country--"), value)}
                onChange={value => { setJurisdictionCountryCode(value); handleFieldValueChange(enumSupplierFields.country, jurisdictionCountryCode, value) }}
              />
            </div>
          </Grid>}
          {!isFieldOmitted(enumSupplierFields.language) && <Grid item xs={6}>
            <div className={classNames(styles.fwrapper)}>
            <label className={styles.roleLabel}>{getFormFieldConfig(enumSupplierFields.language, props.supplierFormConfigurationFields)?.customLabel || t("--language--")} {!isFieldRequired(enumSupplierFields.language) ? `(${t("--optional--")})` : ''}</label>
              <TypeAhead
                placeholder={t("--chooseLanguage--")}
                value={langCode}
                options={languageOptions}
                required={isFieldRequired(enumSupplierFields.language)}
                forceValidate={forceValidate}
                validator={(value) => validateField(getFormFieldConfig(enumSupplierFields.language, props.supplierFormConfigurationFields)?.customLabel || t("--language--"), value)}
                onChange={value => { setLangCode(value); handleFieldValueChange(enumSupplierFields.language, langCode, value) }}
              />
              {/* <Tooltip title={t('--languageInfo--')} className={styles.toolTip} arrow={true} placement="top-end">
                <Info color="var(--warm-neutral-shade-200)" size={16}/>
              </Tooltip> */}
            </div>
          </Grid>}
        </Grid>
        {
          !props.isGptView &&
          <div className={styles.supplierContact}>
            <div className={styles.titlewrapper} onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}>
              <label className={styles.labelOnboarding}>{t("--additionalDetails--")}</label>
              {!showAdditionalDetails && <ChevronDown size={18} color='var(--warm-neutral-shade-200)'/>}
              {showAdditionalDetails && <ChevronUp size={18} color='var(--warm-neutral-shade-200)'/>}  
            </div>
            {showAdditionalDetails && <Grid container spacing={2}>
              <Grid item xs={6}>
                  <div className={classNames(styles.fwrapper)}>
                    <OROWebsiteInput
                      label={`${getFormFieldConfig(enumSupplierFields.website, props.supplierFormConfigurationFields)?.customLabel || t("--companyWebsite--")}`}
                      disabled={props.disabled}
                      forceValidate={forceValidate}
                      validator={handleWebsiteValidation}
                      required={isFieldRequired(enumSupplierFields.website)}
                      placeholder="http://"
                      value={website}
                      onChange={setWebsite}
                    />
                  </div>
              </Grid>

              {(!isFieldOmitted(enumSupplierFields.tax) || !isFieldOmitted(enumSupplierFields.inDirectTax)) && jurisdictionCountryCode?.id && ((tax && selectedTaxType) || (indirectTax?.taxKeysList?.length > 0)) &&
                <Grid item xs={12}>
                  <div className={styles.supplierContact}>
                      <div className={styles.titlewrapper}>
                          <label className={styles.labelOnboarding}>{t("--taxDetails--")}</label>
                      </div>
                      {tax && selectedTaxType && <Grid container spacing={2}>
                          {!isFieldOmitted(enumSupplierFields.tax) && <Grid item xs={6}>
                              <div className={classNames(styles.fwrapper)}>
                                  <div className={styles.taxDetailsLabel}>
                                  <span>{selectedTaxType && getTaxKeyNameForKey(selectedTaxType)}</span>
                                  <div className={styles.changeBtn} onClick={handleShowTaxIdTypes}>
                                      <Repeat size={18} color='var(--warm-prime-azure)'/>
                                      <span>{t("--change--")}</span>
                                  </div>
                                  { showTaxIdTypeList && (tax?.taxKeysList?.length > 0) &&
                                      <>
                                      <div className={styles.popUp} onClick={(e) => {e.stopPropagation();}}>
                                          {/* <span className={styles.title}>{t("--selectTaxType--")}</span> */}
                                          <div className={styles.popupHeader}>
                                          <div className={styles.group}>{t("--selectTaxType--")}</div>
                                          <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
                                          </div>

                                          <div className={styles.popupBody}>
                                          {tax?.taxKeysList?.map((key, index) => {
                                              return <div key={index} className={classNames(styles.taxTypeContainer, selectedTaxType === key ? styles.selectedTaxType : '')} onClick={() => handleSelectTaxType(key)}>
                                              <span>{getTaxKeyNameForKey(key)}</span>
                                              {selectedTaxType === key && <Check size={16} color='var(--warm-neutral-shade-400'/>}
                                              </div>
                                          })}
                                          </div>
                                      </div>
                                      <div className={styles.backdrop} onClick={(e) => {e.stopPropagation(); setShowTaxIdTypeList(false) }}></div>
                                      </>
                                  }
                                  </div>

                                  <EncryptedDataBox
                                    value={selectedTaxTypeValue}
                                    disabled={false}
                                    forceValidate={taxCodeFormatError || (isFieldRequired(enumSupplierFields.tax) && forceValidate)}
                                    onBlur={() => handleOnValidateTINFormat(enumSupplierFields.tax)}
                                    required={isFieldRequired(enumSupplierFields.tax)}
                                    warning={taxCodeFormatError}
                                    validator={(value) => taxCodeFormatError ? t('--incorrectFormat--') : isEmpty(value) ? validateField(taxTypeName || '', value) : ''}
                                    onChange={value => handleTaxValueChange(value, enumSupplierFields.tax)}
                                  />
                              </div>
                          </Grid>}
                          {!isFieldOmitted(enumSupplierFields.inDirectTax) && indirectTax?.taxKeysList?.length > 0 &&
                            <Grid item xs={6}>
                              <div className={classNames(styles.fwrapper)}>
                                  <div className={styles.taxDetailsLabel}>
                                    <span>{indirectTaxTypeName}</span>
                                  </div>
                                  <TextBox
                                    disabled={props.disabled}
                                    validator={(value) => props.indirectTaxCodeFormatError ? t('--incorrectFormat--') : isEmpty(value) ? validateField(indirectTaxTypeName || '', value) : ''}
                                    required={isFieldRequired(enumSupplierFields.inDirectTax)}
                                    forceValidate={isFieldRequired(enumSupplierFields.inDirectTax) && forceValidate}
                                    value={indirectTaxTypeValue?.unencryptedValue}
                                    onChange={value => handleIndirectTaxValueChange(value, enumSupplierFields.inDirectTax)}
                                  />
                              </div>
                            </Grid>}
                          </Grid>}
                  </div>
                </Grid>
              }

              {!isFieldOmitted(enumSupplierFields.duns) && <Grid item xs={6}>
                  <div className={classNames(styles.fwrapper)}>
                  <TextBox
                      label={getFormFieldConfig(enumSupplierFields.duns, props.supplierFormConfigurationFields)?.customLabel || t("--dunsNumber--", "DUNS Number")}
                      disabled={props.disabled}
                      forceValidate={forceValidate}
                      validator={handleDUNSNumberValidation}
                      required={isFieldRequired(enumSupplierFields.duns)}
                      placeholder={t("--enterDuns--")}
                      value={duns}
                      onChange={setDuns}
                  />
                  </div>
              </Grid>}

              {/* {!isFieldOmitted(enumSupplierFields.contact) && <Grid item xs={6}>
                  <div className={classNames(styles.fwrapper)}>
                    <label className={styles.roleLabel}>{getFormFieldConfig(enumSupplierFields.contact, props.supplierFormConfigurationFields)?.customLabel || t("--contactName--")}</label>
                    <TextBox
                      disabled={props.disabled}
                      placeholder={t("--fullName--")}
                      required={isFieldRequired(enumSupplierFields.contact)}
                      forceValidate={isFieldRequired(enumSupplierFields.contact) && forceValidate}
                      validator={(value) => validateField(t("--contactName--"), value)}
                      value={contactName}
                      onChange={setContactName}
                    />
                  </div>
              </Grid>} */}
              
              {/* {!isFieldOmitted(enumSupplierFields.phoneNumber) && <Grid item xs={6}>
                  <div className={classNames(styles.fwrapper)}>
                    <label className={styles.roleLabel}>{getFormFieldConfig(enumSupplierFields.phoneNumber, props.supplierFormConfigurationFields)?.customLabel || t("--phoneNumber--")}</label>
                    <OROPhoneInputNew
                      // label={getFormFieldConfig(enumSupplierFields.phoneNumber, props.fields)?.customLabel || t("--phoneNumber--")}
                      value={phone}
                      config={{
                        optional: !isFieldRequired(enumSupplierFields.phoneNumber),
                        forceValidate: forceValidate
                      }}
                      validator={(value) => validatePhoneNumber(value, t("--phoneNumber--"), isFieldRequired(enumSupplierFields.phoneNumber))}
                      onChange={setPhone}
                    />
                  </div>
              </Grid>} */}
              {/* {!isFieldOmitted(enumSupplierFields.role) && <Grid item xs={6}>
                  <div className={classNames(styles.fwrapper)} id="materialUIAutocomplete">
                    <label className={styles.roleLabel}>{getFormFieldConfig(enumSupplierFields.role, props.supplierFormConfigurationFields)?.customLabel || t("--role--")} {!isFieldRequired(enumSupplierFields.role) ? `(${t("--optional--")})` : ''}</label>
                    <Autocomplete
                      id={styles.freeSolo}
                      freeSolo
                      popupIcon={<ChevronDown size={16} color="var(--warm-neutral-shade-300)"></ChevronDown>}
                      forcePopupIcon
                      disabled={props.disabled}
                      disableClearable={false}
                      value={role}
                      options={roles}
                      sx={{
                        '& .css-1d3z3hw-MuiOutlinedInput-notchedOutline' : {
                          border: showRoleError ? '1px solid var(--warm-stat-chilli-regular)' : ''
                        },
                        '&:hover .css-1d3z3hw-MuiOutlinedInput-notchedOutline' : {
                          border: showRoleError ? '1px solid var(--warm-stat-chilli-regular)' : ''
                        }
                      }}
                      limitTags={isFieldRequired(enumSupplierFields.role) ? 1 : null }
                      clearOnEscape={true}
                      clearIcon={<X color="var(--warm-neutral-shade-300)" size={16} className="clearText"></X>}
                      getOptionLabel={option => (option as MasterDataRoleObject).name || role}
                      renderInput={(params) => (
                        <TextField
                          className="oro-text-input widget-level"
                          placeholder={t("--enterOrSelectRole--")}
                          disabled={props.disabled}
                          {...params}
                          required={isFieldRequired(enumSupplierFields.role)}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleRoleValidation(e.target.value)
                            handleChange(e)
                          }}
                        />
                      )}
                    />
                    {(showRoleError) && <div className={styles.error}><AlertCircle size={16} color='var(--warm-stat-chilli-regular)'/> {validateField(getFormFieldConfig(enumSupplierFields.role, props.supplierFormConfigurationFields)?.customLabel || t("--role--"), role)}</div>}
                </div>
              </Grid>} */}
            </Grid>
            }
          </div>
        }
        <div className={styles.supplierContact}>
          <div className={styles.action}>
            <button onClick={checkAllFieldsValidated} className={styles.addSupplier}>{t("--addSupplier--")}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AddNewSupplier (props: SupplierFormProps) {
  return <I18Suspense><AddNewSupplierContent {...props}></AddNewSupplierContent></I18Suspense>
}
