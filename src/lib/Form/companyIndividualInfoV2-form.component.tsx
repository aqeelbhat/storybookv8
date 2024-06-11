import React, { useEffect, useState } from 'react'

import { Address, Attachment, Contact, EncryptedData, Option } from '../Types'
import { emptyEcncryptedData, Field, CompanyIndividualInfoV2FormData, TaxKey, TaxFormKey, CompanyIndividualInfoV2FormProps } from './types';
import { AttachmentBox, imageFileAcceptType, OROEmailInput, OROPhoneInput, pdfFileAcceptType, Radio, TextBox, ToggleSwitch, TypeAhead } from '../Inputs';
import { areObjectsSame, convertAddressToString, getEmptyAddress, getFormFieldConfig, isAddressInvalid, isDisabled, isEmpty, isRequired, validateEmail, validatePhoneNumber } from './util';
import { OroButton } from '../controls';
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch';
import { useTranslationHook, NAMESPACES_ENUM } from '../i18n';
import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames';
import { EncryptedDataBox, TextArea } from '../Inputs/text.component';

export function CompanyIndividualInfoFormV2 (props: CompanyIndividualInfoV2FormProps) {
  const [firstName, setFirstName] = useState<string>('')
  const [middleName, setMiddleName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [usForeignTaxClassificationIndividualOptions, setUsForeignTaxClassificationIndividualOptions] = useState<Option[]>([])

  const [companyName, setCompanyName] = useState<string>('')
  const [address, setAddress] = useState<Address>(getEmptyAddress())
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [business, setBusiness] = useState<Option>()

  const [foreignTaxClassification, setForeignTaxClassification] = useState<Option | null>()

  const [encryptedTaxCode, setEncryptedTaxCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [taxForm, setTaxForm] = useState<Attachment>()

  const [specialTaxStatus, setSpecialTaxStatus] = useState<boolean>(false)
  const [specialTaxNote, setSpecialTaxNote] = useState<string>('')
  const [specialTaxAttachment, setSpecialTaxAttachment] = useState<Attachment>()
  const [usTaxDeclarationForm, setUsTaxDeclarationForm] = useState<Attachment>()

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  // suppress the server-side errors till next server trip
  const [supressTaxCodeError, setSupressTaxCodeError] = useState<boolean>(false)
  // suppress the very first server-side error
  const [isValidatedOnce, setIsValidatedOnce] = useState<boolean>(false)
  const [indirectTaxKey, setIndirectTaxKey] = useState<TaxKey | null>(null)
  const [taxKey, setTaxKey] = useState<TaxKey | null>(null)
  const [encryptedIndirectTaxCode, setEncryptedIndirectTaxCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [usTaxDeclarationFormKey, setUsTaxDeclarationFormKey] = useState<TaxFormKey | null>(null)
  const [taxFormKey, setTaxFormKey] = useState<TaxFormKey | null>(null)
  const [exemptionTaxKey, setExemptionTaxKey] = useState<TaxKey | null>(null)
  const [encryptedExemptionTaxCode, setEncryptedExemptionTaxCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [tax1099, setTax1099] = useState<Option | null>()

  const [taxCodeFormatError, setTaxCodeFormatError] = useState(false)
  const [exemptionCodeFormatError, setExemptionTaxCodeFormatError] = useState(false)
  const [instruction, setInstruction] = useState<string>('')

  const { t } = useTranslationHook( NAMESPACES_ENUM.COMPANYINDINFO)

  const BUSINESS_OPTIONS: Array<Option> = [
    {
      id: 'individual',
      displayName: t("Individual"),
      path: 'individual'
    },
    {
      id: 'company',
      displayName: t("Company (DBA/Disregarded entity)"),
      path: 'company'
    }
  ]
  const tax1099Options: Array<Option> = [
    {
      id: 'yes',
      displayName: t("Yes"),
      path: 'yes'
    },
    {
      id: 'no',
      displayName: t("No"),
      path: 'no'
    },
  ]

  useEffect(() => {
    setTaxCodeFormatError(props.taxCodeFormatError)
  }, [props.taxCodeFormatError])

  useEffect(() => {
    setExemptionTaxCodeFormatError(props.exemptionTaxCodeFormatError)
  }, [props.exemptionTaxCodeFormatError])

  useEffect(() => {
    if (props.formData) {
      setFirstName(props.formData?.firstName)
      setMiddleName(props.formData?.middleName)
      setLastName(props.formData?.lastName)
      setCompanyName(props.formData.companyName)
      setAddress(props.formData.address)
      setEmail(props.formData.email)
      setPhone(props.formData?.phone)
      setEncryptedTaxCode(props.formData.encryptedTaxCode)
      setTaxForm(props.formData.taxForm)
      setSpecialTaxStatus(props.formData.specialTaxStatus)
      setSpecialTaxNote(props.formData.specialTaxNote)
      setSpecialTaxAttachment(props.formData.specialTaxAttachment)
      setUsTaxDeclarationForm(props.formData.usTaxDeclarationForm)
      setEncryptedIndirectTaxCode(props.formData.encryptedIndirectTaxCode)
      setEncryptedExemptionTaxCode(props.formData.encryptedExemptionTaxCode)
      setForeignTaxClassification(props.formData.foreignTaxClassification)
      setUsTaxDeclarationFormKey(props.formData?.usTaxDeclarationFormKey)
      setInstruction(props.formData?.instruction)
      if (props.formData?.companyName) {
        setBusiness(BUSINESS_OPTIONS[1])
      } else {
        setBusiness(BUSINESS_OPTIONS[0])
      }

      if (props.formData?.taxKey) {
        setTaxKey(props.formData?.taxKey)
      } else if (props.formData?.taxKeysList?.length > 1 || props.formData?.taxKeysList?.length === 1) {
        setTaxKey(props.formData?.taxKeysList?.[0].path as TaxKey)
      } else {
        setTaxKey(null)
      }

      if (props.formData?.indirectTaxKey) {
        setIndirectTaxKey(props.formData?.indirectTaxKey)
      } else if (props.formData?.indirectTaxKeysList?.length > 1 || props.formData?.indirectTaxKeysList?.length === 1) {
        setIndirectTaxKey(props.formData?.indirectTaxKeysList?.[0].path as TaxKey)
      } else {
        setIndirectTaxKey(null)
      }

      if (props.formData?.exemptionTaxKey) {
        setExemptionTaxKey(props.formData?.exemptionTaxKey)
      } else if (props.formData?.exemptionTaxKeysList?.length > 1 || props.formData?.exemptionTaxKeysList?.length === 1) {
        setExemptionTaxKey(props.formData?.exemptionTaxKeysList?.[0].path as TaxKey)
      } else {
        setExemptionTaxKey(null)
      }

      if (props.formData?.taxFormKey) {
        setTaxFormKey(props.formData?.taxFormKey)
      } else if (props.formData?.taxFormKeysList?.length > 1 || props.formData?.taxFormKeysList?.length === 1) {
        setTaxFormKey(props.formData?.taxFormKeysList?.[0].path as TaxFormKey)
      } else {
        setTaxFormKey(null)
      }

      if (props.formData?.tax1099Required && props.formData?.tax1099) {
        if (props.formData?.tax1099?.id === 'yes') {
          setTax1099(tax1099Options[0])
        } else {
          setTax1099(tax1099Options[1])
        }
      }

      // Reset error suppression flags
      setSupressTaxCodeError(false)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        firstName: getFormFieldConfig('firstName', props.fields),
        middleName: getFormFieldConfig('middleName', props.fields),
        lastName: getFormFieldConfig('lastName', props.fields),
        email: getFormFieldConfig('email', props.fields),
        phone: getFormFieldConfig('phone', props.fields),
        companyName: getFormFieldConfig('companyName', props.fields),
        address: getFormFieldConfig('address', props.fields),
        foreignTaxForm: getFormFieldConfig('foreignTaxForm', props.fields),
        taxKey: getFormFieldConfig('taxKey', props.fields),
        encryptedTaxCode: getFormFieldConfig('encryptedTaxCode', props.fields),
        usTaxDeclarationFormKey: getFormFieldConfig('usTaxDeclarationFormKey', props.fields),
        exemptionTaxKey: getFormFieldConfig('exemptionTaxKey', props.fields),
        encryptedExemptionTaxCode: getFormFieldConfig('encryptedExemptionTaxCode', props.fields),
        taxFormKey: getFormFieldConfig('taxFormKey', props.fields),
        instruction: getFormFieldConfig('instruction', props.fields)
      })
    }
  }, [props.fields])

  useEffect(() => {
    props.usForeignTaxClassificationIndividualOptions && setUsForeignTaxClassificationIndividualOptions(props.usForeignTaxClassificationIndividualOptions)
  }, [props.usForeignTaxClassificationIndividualOptions])

  function getFormData (): CompanyIndividualInfoV2FormData {
    return {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      companyName: business?.id === BUSINESS_OPTIONS[0]?.id ? '' : companyName,
      address,
      companyEntityCountryCode: props.formData?.companyEntityCountryCode,
      usCompanyEntityType: props.formData.usCompanyEntityType,
      foreignTaxClassification,
      taxKey,
      encryptedTaxCode,
      taxFormKey,
      taxForm: taxFormKey ? taxForm : null,
      specialTaxStatus,
      specialTaxNote: specialTaxStatus ? specialTaxNote : null,
      specialTaxAttachment: specialTaxStatus ? specialTaxAttachment : null,
      taxKeysList: props.formData?.taxKeysList,
      indirectTaxKey,
      indirectTaxKeysList: props.formData?.indirectTaxKeysList,
      encryptedIndirectTaxCode: indirectTaxKey ? encryptedIndirectTaxCode : null,
      taxFormKeysList: props.formData?.taxFormKeysList,
      usTaxDeclarationFormKey,
      usTaxDeclarationFormsList: props.formData?.usTaxDeclarationFormsList,
      usTaxDeclarationForm: usTaxDeclarationFormKey ? usTaxDeclarationForm : null,
      exemptionTaxKey: specialTaxStatus && exemptionTaxKey ? exemptionTaxKey : null,
      encryptedExemptionTaxCode: specialTaxStatus && exemptionTaxKey ? encryptedExemptionTaxCode : null,
      exemptionTaxKeysList: props.formData?.exemptionTaxKeysList,
      tax1099Required: props.formData?.tax1099Required,
      tax1099: tax1099,
      taxCodeError: props.formData?.taxCodeError,
      exemptionTaxCodeError: props.formData?.exemptionTaxCodeError,
      taxCodeValidationTimeout: props.formData?.taxCodeValidationTimeout,
      exemptionTaxCodeValidationTimeout: props.formData?.exemptionTaxCodeValidationTimeout,
      instruction: instruction
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean | TaxKey): CompanyIndividualInfoV2FormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as CompanyIndividualInfoV2FormData

    switch (fieldName) {
      case 'firstName':
        formData.firstName = newValue as string
      case 'middleName':
        formData.middleName = newValue as string
      case 'lastName':
        formData.lastName = newValue as string
      case 'email':
        formData.email = newValue as string
        break
      case 'phone':
        formData.phone = newValue as string
        break
      case 'companyName':
        formData.companyName = newValue as string
        break
      case 'address':
        formData.address = newValue as Address
        formData.taxKey = null
        formData.indirectTaxKey = null
        formData.encryptedTaxCode = null
        formData.encryptedIndirectTaxCode = null
        formData.usTaxDeclarationFormKey = null
        formData.usTaxDeclarationForm = null
        formData.exemptionTaxKey = null
        formData.encryptedExemptionTaxCode = null
        formData.taxFormKey = null
        formData.taxForm = null
        setTaxCodeFormatError(props.taxCodeFormatError)
        setExemptionTaxCodeFormatError(props.exemptionTaxCodeFormatError)
        break
      case 'usCompanyEntityType':
        formData.usCompanyEntityType = newValue as Option
        break
      case 'encryptedTaxCode':
        formData.encryptedTaxCode = newValue ? newValue as EncryptedData : null
        break
      case 'taxForm':
        formData.taxForm = newValue as Attachment | File
        break
      case 'foreignTaxClassification':
        formData.foreignTaxClassification = newValue as Option
        break
      case 'specialTaxStatus':
        formData.specialTaxStatus = newValue as boolean
        break
      case 'specialTaxNote':
        formData.specialTaxNote = newValue as string
        break
      case 'specialTaxAttachment':
        formData.specialTaxAttachment = newValue as Attachment
        break
      case 'indirectTaxKey':
        formData.indirectTaxKey = newValue as TaxKey
        break
      case 'encryptedIndirectTaxCode':
        formData.encryptedIndirectTaxCode = newValue ? newValue as EncryptedData : null
        break
      case 'usTaxDeclarationFormKey':
        formData.usTaxDeclarationFormKey = newValue as TaxFormKey
        break
      case 'usTaxDeclarationForm':
        formData.usTaxDeclarationForm = newValue as Attachment
        break
      case 'exemptionTaxKey':
        formData.exemptionTaxKey = newValue as TaxKey
        break
      case 'encryptedExemptionTaxCode':
        formData.encryptedExemptionTaxCode = newValue ? newValue as EncryptedData : null
        break
      case 'taxFormKey':
        formData.taxFormKey = newValue as TaxFormKey
        break
      case 'tax1099':
        formData.tax1099 = newValue as Option
        break
      case 'instruction':
        formData.instruction = newValue as string
        break
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Address | Contact | Option | EncryptedData | Attachment | boolean,
    newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (typeof newValue === 'boolean' && !!oldValue !== !!newValue) {
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

  function validateField (fieldName: string, label: string, value: string | string[]): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t("is required field",{label}) : ''
    } else {
      return ''
    }
  }

  function validateAddressField (fieldName: string, label: string, value: Address): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      if (isRequired(field)) {
        if (!value) {
          return t("is required field",{label})
        } else if (isAddressInvalid(value)) {
          return t("is invalid",{label})
        } else {
          return ''
        }
      } else {
        return ''
      }
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
    if (!isValidatedOnce) {
      setIsValidatedOnce(true)
    }

    let invalidFieldId = ''
    let isInvalid = props.fields && props.fields.some(field => {
      if (isRequired(field)) {
        switch (field.fieldName) {
          case 'firstName':
            invalidFieldId = 'firstName-field'
            return !firstName
          case 'middleName':
            invalidFieldId = 'middleName-field'
            return !middleName
          case 'lastName':
            invalidFieldId = 'lastName-field'
            return !lastName
          case 'email':
            invalidFieldId = 'email-field'
            return !email
          case 'phone':
            invalidFieldId = 'phone-field'
            return !phone
          case 'companyName':
            invalidFieldId = 'company-name-field'
            return business?.id === BUSINESS_OPTIONS[0]?.id ? false : !companyName
          case 'address':
            invalidFieldId = 'address-field'
            return !address || isAddressInvalid(address)
          case 'taxKey':
            invalidFieldId = 'taxKey-field'
            return props.formData?.taxKeysList?.length > 0 && !taxKey
          case 'encryptedTaxCode':
            invalidFieldId = 'taxCode-field'
            return taxKey && !(encryptedTaxCode.maskedValue || encryptedTaxCode.unencryptedValue)
          case 'usTaxDeclarationForm':
            invalidFieldId = 'usTaxDeclarationForm-field'
            return usTaxDeclarationFormKey && !usTaxDeclarationForm
          case 'exemptionTaxKey':
            invalidFieldId = 'exemptionTaxKey-field'
            return specialTaxStatus && props.formData?.exemptionTaxKeysList?.length > 0 && !exemptionTaxKey
          case 'encryptedExemptionTaxCode':
            invalidFieldId = 'encryptedExemptionTaxCode'
            return specialTaxStatus && exemptionTaxKey && !(encryptedExemptionTaxCode.maskedValue || encryptedExemptionTaxCode.unencryptedValue)
          case 'taxFormKey':
            invalidFieldId = 'taxFormKey-field'
            return props.formData?.taxFormKeysList?.length > 0 && !taxFormKey
          case 'taxForm':
            invalidFieldId = 'taxForm-field'
            return taxFormKey && !taxForm
          case 'instruction':
            invalidFieldId = 'instruction-field'
            return !instruction
        }
      }
    })

    if (!isInvalid) {
      if (specialTaxStatus && !specialTaxAttachment) {
        isInvalid = true
        invalidFieldId = 'specialTaxAttachment-field'
      } else if (email) {
        invalidFieldId = validateEmail(t("Email"), email, true) ? 'email-field' : ''
        isInvalid = invalidFieldId ? true : false
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

  function fetchData (skipValidation?: boolean): CompanyIndividualInfoV2FormData {
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
    props.fields, props.formData?.companyEntityCountryCode,
    props.formData?.taxFormKey, business,
    firstName, middleName, lastName, companyName, address, email, phone,
    taxForm, foreignTaxClassification, encryptedTaxCode,
    specialTaxStatus, specialTaxNote, specialTaxAttachment,
    taxKey, indirectTaxKey, encryptedIndirectTaxCode, usTaxDeclarationFormKey, usTaxDeclarationForm,
    exemptionTaxKey, encryptedExemptionTaxCode, taxCodeFormatError, exemptionCodeFormatError, instruction
  ])

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

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function getTaxKeyNameForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.name || ''
  }
  function getTaxKeyDescriptionForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.description || ''
  }

  function findTaxFormByKey (taxFormKey?: string) {
    return props.taxFormKeys?.find(key => key.code === taxFormKey)
  }
  function getTaxFormNameForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.name || ''
  }
  function getTaxFormLinkTextForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.linkText || ''
  }
  function getTaxFormLinkForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.link || ''
  }
  function getTaxFormDescriptionForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.description || ''
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function convertTaxKeyToOption (taxKey: TaxKey | TaxFormKey): Option | null {
    if (taxKey) {
      return {
        id: taxKey,
        displayName: taxKey,
        path: taxKey
      }
    } else {
      return null
    }
  }

  function getTaxKeyFromOption (value: Option): string | null {
    if (value) {
      return value.path
    } else {
      return null
    }
  }

  function getTaxKeysList (): Array<Option> {
    const taxKeysList = props.formData?.taxKeysList.map(taxKey => {
      return { ...taxKey, displayName: getTaxKeyNameForKey(taxKey.path) ? getTaxKeyNameForKey(taxKey.path) : taxKey.path }
    })
    return taxKeysList
  }

  function getExemptionTaxKeysList (): Array<Option> {
    const exemptionTaxKeysList = props.formData?.exemptionTaxKeysList.map(taxKey => {
      return { ...taxKey, displayName: getTaxKeyNameForKey(taxKey.path) ? getTaxKeyNameForKey(taxKey.path) : taxKey.path }
    })
    return exemptionTaxKeysList
  }

  function handleValidateTinFormat (taxKey: string, encryptedTaxCode: EncryptedData, taxCode: string) {
    if (props.onValidateTINFormat) {
      if (encryptedTaxCode.unencryptedValue || encryptedTaxCode.maskedValue) {
        props.onValidateTINFormat(taxKey, address.alpha2CountryCode, encryptedTaxCode, taxCode)
      }
    }
  }

  return (
    <div className={styles.companyInfoForm}>
      <div className={styles.section}>
        <div className={styles.title}>{t("Individual Details")}</div>

        <span className={styles.label}>{t("Full name")}</span>
        <div className={styles.fullName}>
          <div className={classnames(styles.item, styles.col3)} id="firstName-field">
            <TextBox
              placeholder={t("First name")}
              value={firstName}
              disabled={isFieldDisabled('firstName')}
              required={isFieldRequired('firstName')}
              forceValidate={forceValidate}
              validator={(value) => validateField('firstName', t("First name"), value)}
              onChange={value => { setFirstName(value); handleFieldValueChange('firstName', firstName, value) }}
            />
          </div>

          <div className={classnames(styles.item, styles.col3)} id="middleName-field">
            <TextBox
              placeholder={t("Middle name")}
              value={middleName}
              disabled={isFieldDisabled('middleName')}
              required={isFieldRequired('middleName')}
              forceValidate={forceValidate}
              validator={(value) => validateField('middleName', t("Middle name"), value)}
              onChange={value => { setMiddleName(value); handleFieldValueChange('middleName', middleName, value) }}
            />
          </div>

          <div className={classnames(styles.item, styles.col3)} id="lastName-field">
            <TextBox
              placeholder={t("Last name")}
              value={lastName}
              disabled={isFieldDisabled('lastName')}
              required={isFieldRequired('lastName')}
              forceValidate={forceValidate}
              validator={(value) => validateField('lastName', t("Last name"), value)}
              onChange={value => { setLastName(value); handleFieldValueChange('lastName', lastName, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="email-field">
            <OROEmailInput
              label={t("Email")}
              placeholder={t("Enter email address")}
              value={email}
              disabled={isFieldDisabled('email')}
              required={isFieldRequired('email')}
              forceValidate={forceValidate}
              validator={(value) => validateEmail(t("Email"), value, !isFieldRequired('email'))}
              onChange={value => { setEmail(value); handleFieldValueChange('email', email, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="phone-field">
            <OROPhoneInput
              label={t("Phone number")}
              placeholder="+1 ___-___-____"
              value={phone}
              disabled={isFieldDisabled('phone')}
              required={isFieldRequired('phone')}
              forceValidate={forceValidate}
              optional={!isFieldRequired('phone')}
              validator={(value) => validatePhoneNumber(value, t("Phone number"), isFieldRequired('phone'))}
              onChange={(value) => { setPhone(value); handleFieldValueChange('phone', phone, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="business-field">
            <Radio
              name='business'
              id='business'
              label={t("Doing business as")}
              value={business}
              options={BUSINESS_OPTIONS}
              disabled={false}
              required={true}
              showHorizontal={true}
              onChange={value => setBusiness(value)}
            />
          </div>
        </div>

        {
          business?.id === BUSINESS_OPTIONS[1].id &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="company-name-field">
              <TextBox
                label={t("Company name (DBA name)")}
                value={companyName}
                disabled={isFieldDisabled('companyName')}
                required={isFieldRequired('companyName')}
                forceValidate={forceValidate}
                validator={(value) => validateField('companyName', t("Company name (DBA name)"), value)}
                onChange={value => { setCompanyName(value); handleFieldValueChange('companyName', companyName, value) }}
              />
            </div>
          </div>
        }
      </div>

      <div className={styles.section}>
        <div className={styles.title}>{t("Tax information")}</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="address-field">
            <GoogleMultilinePlaceSearch
              id="address"
              label={t("Address of tax residency")}
              value={address}
              countryOptions={props.countryOptions}
              disabled={isFieldDisabled('address')}
              required={isFieldRequired('address')}
              forceValidate={forceValidate}
              validator={(value) => validateAddressField('address', t("Address of tax residency"), value)}
              onChange={(value, countryChanged) => { setAddress(value); countryChanged && handleFieldValueChange('address', address, value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </div>

        {
          props.formData?.taxKeysList?.length > 1 &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="taxKey-field">
              <TypeAhead
                label={t("Tax ID type")}
                placeholder={t("Choose tax ID type")}
                value={convertTaxKeyToOption(taxKey)}
                options={getTaxKeysList()}
                disabled={isFieldDisabled('taxKey')}
                required={isFieldRequired('taxKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('taxKey', t("Tax ID type"), value)}
                onChange={value => { setTaxKey(getTaxKeyFromOption(value) as TaxKey); value?.id !== taxKey && setEncryptedTaxCode(emptyEcncryptedData); handleFieldValueChange('taxKey', taxKey, value?.path || '') }}
              />
            </div>
          </div>
        }

        {
          taxKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="taxCode-field">
              <EncryptedDataBox
                key={`${convertAddressToString(address)}${taxKey}`}
                label={getTaxKeyNameForKey(taxKey)}
                value={encryptedTaxCode}
                description={getTaxKeyDescriptionForKey(taxKey)}
                disabled={isFieldDisabled('encryptedTaxCode')}
                required={isFieldRequired('encryptedTaxCode')}
                forceValidate={forceValidate || taxCodeFormatError}
                warning={taxCodeFormatError}
                validator={taxCodeFormatError ? () => t("Format is incorrect") : (value) => validateField('encryptedTaxCode', getTaxKeyNameForKey(taxKey), value)}
                onBlur={value => handleValidateTinFormat(taxKey, value, 'encryptedTaxCode')}
                onChange={value => { setEncryptedTaxCode(value); handleFieldValueChange('encryptedTaxCode', encryptedTaxCode, value); setSupressTaxCodeError(true); setTaxCodeFormatError(false) }}
              />
            </div>
          </div>
        }

        { props.formData?.tax1099Required &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="tax1099-field">
              <Radio
                name='tax1099'
                label={t("Are you eligible for 1099?")}
                value={tax1099}
                options={tax1099Options}
                showHorizontal
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? t("1099 is a required field.") : ''}
                onChange={value => {setTax1099(value); handleFieldValueChange('tax1099', tax1099, value)}}
              />
            </div>
          </div>}

        { foreignTaxClassification &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="foreignTaxClassification-field">
              <Radio
                id='company-foreign-tax-classification'
                name='company-foreign-tax-classification'
                label={t("US Federal Tax Classification")}
                value={foreignTaxClassification}
                options={usForeignTaxClassificationIndividualOptions}
                disabled={isFieldDisabled('foreignTaxClassification')}
                required={isFieldRequired('foreignTaxClassification')}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? t("is required field",{label:t("US Federal Tax Classification")}) : ''}
                onChange={value => {setForeignTaxClassification(value); handleFieldValueChange('foreignTaxClassification', foreignTaxClassification, value)}}
              />
            </div>
          </div>}

        {
          usTaxDeclarationFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="usTaxDeclarationForm-field">
              <AttachmentBox
                label= {t("Attach Tax form",{label:getTaxFormNameForKey(usTaxDeclarationFormKey)})}
                value={usTaxDeclarationForm}
                description={getTaxFormDescriptionForKey(props.formData?.usTaxDeclarationFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.usTaxDeclarationFormKey)}
                link={getTaxFormLinkForKey(props.formData?.usTaxDeclarationFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={isFieldDisabled('usTaxDeclarationFormKey')}
                required={isFieldRequired('usTaxDeclarationFormKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('usTaxDeclarationFormKey', `${getTaxFormNameForKey(usTaxDeclarationFormKey) || t("Tax Form")}`, (value?.name || value?.filename))}
                onChange={(file) => handleFileChange('usTaxDeclarationForm', file)}
                onPreview={() => loadFile('usTaxDeclarationForm', usTaxDeclarationForm.mediatype, usTaxDeclarationForm.filename)}
              />
            </div>
          </div>
        }

        {
          props.formData?.taxFormKeysList?.length > 1 &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="taxFormKey-field">
              <TypeAhead
                label={t("Tax form type")}
                placeholder={t("Choose Tax form type")}
                value={convertTaxKeyToOption(taxFormKey)}
                options={props.formData?.taxFormKeysList}
                disabled={isFieldDisabled('taxFormKey')}
                required={isFieldRequired('taxFormKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('taxFormKey', t("Tax form type"), value)}
                onChange={value => { setTaxFormKey(getTaxKeyFromOption(value) as TaxFormKey); handleFieldValueChange('taxFormKey', usTaxDeclarationFormKey, value?.path || '') }}
              />
            </div>
          </div>
        }

        { taxFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="taxForm-field">
              <AttachmentBox
                label={getTaxFormNameForKey(taxFormKey) || t("Tax Form")}
                value={taxForm}
                description={getTaxFormDescriptionForKey(taxFormKey)}
                linkText={getTaxFormLinkTextForKey(taxFormKey)}
                link={getTaxFormLinkForKey(taxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={isFieldDisabled('taxFormKey')}
                required={isFieldRequired('taxFormKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('taxFormKey', `${getTaxFormNameForKey(taxFormKey) || t("Tax Form")}`, (value?.name || value?.filename))}
                onChange={(file) => handleFileChange('taxForm', file)}
                onPreview={() => loadFile('taxForm', taxForm.mediatype, taxForm.filename)}
              />
            </div>
          </div>}
      </div>

      <div className={styles.section}>
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxStatus-field">
              <ToggleSwitch
                label={t("Do you have any legal tax status?")}
                value={specialTaxStatus}
                required={true}
                falsyLabel={t("No")}
                truthyLabel={t("Yes")}
                onChange={setSpecialTaxStatus}
              />
            </div>
          </div>

          {
            specialTaxStatus && props.formData?.exemptionTaxKeysList?.length > 1 &&
            <div className={styles.row} >
              <div className={classnames(styles.item, styles.col3)} id="exemptionTaxKey-field">
                <TypeAhead
                  label={t("Exemption tax ID type")}
                  placeholder={t("Choose exemption tax ID type")}
                  value={convertTaxKeyToOption(exemptionTaxKey)}
                  options={getExemptionTaxKeysList()}
                  disabled={isFieldDisabled('exemptionTaxKey')}
                  required={isFieldRequired('exemptionTaxKey')}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('exemptionTaxKey', t("Exemption tax ID type"), value)}
                  onChange={value => { setExemptionTaxKey(getTaxKeyFromOption(value) as TaxKey); value?.id !== exemptionTaxKey && setEncryptedExemptionTaxCode(emptyEcncryptedData); handleFieldValueChange('exemptionTaxKey', exemptionTaxKey, value?.path || '') }}
                />
              </div>
            </div>
          }

          {
            specialTaxStatus && exemptionTaxKey &&
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col3)} id="encryptedExemptionTaxCode-field">
                <EncryptedDataBox
                  key={`${convertAddressToString(address)}${exemptionTaxKey}`}
                  label={getTaxKeyNameForKey(exemptionTaxKey)}
                  value={encryptedExemptionTaxCode}
                  description={getTaxKeyDescriptionForKey(exemptionTaxKey)}
                  disabled={isFieldDisabled('encryptedExemptionTaxCode')}
                  required={isFieldRequired('encryptedExemptionTaxCode')}
                  forceValidate={forceValidate || exemptionCodeFormatError}
                  warning={exemptionCodeFormatError}
                  validator={exemptionCodeFormatError ? () => t("Format is incorrect") : (value) => validateField('encryptedExemptionTaxCode', getTaxKeyNameForKey(exemptionTaxKey), value)}
                  onBlur={value => handleValidateTinFormat(exemptionTaxKey, value, 'encryptedExemptionTaxCode')}
                  onChange={value => { setEncryptedExemptionTaxCode(value); handleFieldValueChange('encryptedExemptionTaxCode', encryptedExemptionTaxCode, value); setExemptionTaxCodeFormatError(false) }}
                />
              </div>
            </div>
          }

          {
            specialTaxStatus &&
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col3)} id="specialTaxNote-field">
                <TextBox
                  label={t("Note")}
                  value={specialTaxNote}
                  disabled={isFieldDisabled('specialTaxNote')}
                  required={isFieldRequired('specialTaxNote')}
                  forceValidate={forceValidate}
                  validator={(value) => specialTaxStatus && isFieldRequired('specialTaxNote') && isEmpty(value) ? t("Special tax status details is a required field") : ''}
                  onChange={value => { setSpecialTaxNote(value); handleFieldValueChange('specialTaxNote', specialTaxNote, value) }}
                />
              </div>
            </div>
          }

          {
            specialTaxStatus &&
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col4)} id="specialTaxAttachment-field">
                <AttachmentBox
                  label={t("Attachment")}
                  value={specialTaxAttachment}
                  inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate}
                  validator={(value) => isEmpty(value?.name || value?.filename) ? t("Special tax status details is a required field")  : ''}
                  onChange={(file) => handleFileChange('specialTaxAttachment', file)}
                  onPreview={() => loadFile('specialTaxAttachment', specialTaxAttachment.mediatype, specialTaxAttachment.filename)}
                />
              </div>
            </div>
          }
        </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="instruction-field">
            <TextArea
              label={t("Instruction")}
              value={instruction}
              disabled={isFieldDisabled('instruction')}
              required={isFieldRequired('instruction')}
              forceValidate={forceValidate}
              validator={(value) => isFieldRequired('instruction') && isEmpty(value) ? t("is required field",{label: t("Instruction")}) : ''}
              onChange={value => { setInstruction(value); handleFieldValueChange('instruction', instruction, value) }}
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
