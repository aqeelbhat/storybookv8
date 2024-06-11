import React, { useEffect, useState } from 'react'

import { Address, Attachment, Contact, EncryptedData, Option, OroMasterDataType } from '../Types'
import { CompanyInfoV2FormProps, emptyEcncryptedData, Field, CompanyInfoV2FormData, TaxKey, TaxFormKey } from './types';
import { AttachmentBox, imageFileAcceptType, OROEmailInput, OROPhoneInput, OROWebsiteInput, pdfFileAcceptType, Radio, TextBox, ToggleSwitch, TypeAhead } from '../Inputs';
import { areObjectsSame, convertAddressToString, getEmptyAddress, getFormFieldConfig, isAddressInvalid, isDisabled, isEmpty, isRequired, validateDUNSNumber, validateEmail, validatePhoneNumber } from './util';
import { OroButton } from '../controls';
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch';

import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames';
import { EncryptedDataBox, TextArea } from '../Inputs/text.component';
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { EXCLUDE_ADDRESS_SUGGESTION } from './CompanyInfoV4/utils';
import { OptionTreeData } from '../MultiLevelSelect/types';

export function CompanyInfoFormV2 (props: CompanyInfoV2FormProps) {
  const [usCompanyEntityTypeOptions, setCompanyEntityTypeOptions] = useState<Option[]>([])
  const [usForeignTaxClassificationOptions, setUsForeignTaxClassificationOptions] = useState<Option[]>([])

  const [companyName, setCompanyName] = useState<string>('')
  const [isLegalNameSameAsCompanyName, setIsLegalNameSameAsCompanyName] = useState<boolean>(false)
  const [legalName, setLegalName] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [duns, setDuns] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<Address>(getEmptyAddress())
  const [primaryName, setPrimaryName] = useState<string>('')
  const [primaryEmail, setPrimaryEmail] = useState<string>('')
  const [paymentContactEmail, setPaymentContactEmail] = useState<string>('')
  const [taxAddress, setTaxAddress] = useState<Address>(getEmptyAddress())
  const [isTaxAddressSameAsCompanyAddress, setIsTaxAddressSameAsCompanyAddress] = useState<boolean>(false)
  const [usCompanyEntityType, setUsCompanyEntityType] = useState<Option>()
  const [excludeAddressSuggestion, setExcludeAddressSuggestion] = useState(false)
  const [encryptedTaxCode, setEncryptedTaxCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [taxForm, setTaxForm] = useState<Attachment>()

  const [foreignTaxClassification, setForeignTaxClassification] = useState<Option | null>()

  const [usForeignTaxForm, setUsForeignTaxForm] = useState<Attachment>()

  const [specialTaxStatus, setSpecialTaxStatus] = useState<boolean>(false)
  const [specialTaxNote, setSpecialTaxNote] = useState<string>('')
  const [specialTaxAttachment, setSpecialTaxAttachment] = useState<Attachment>()
  const [usTaxDeclarationForm, setUsTaxDeclarationForm] = useState<Attachment>()

  const [encryptedForeignTaxCode, setEncryptedForeignTaxCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [foreignTaxForm, setforeignTaxForm] = useState<Attachment>()

  const [inRegistry, setInRegistry] = useState<boolean>(false)

  
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  // suppress the server-side errors till next server trip
  const [supressTaxCodeError, setSupressTaxCodeError] = useState<boolean>(false)
  const [supressIndirectTaxCodeError, setSupressIndirectTaxCodeError] = useState<boolean>(false)
  const [supressForeignTaxCodeError, setSupressForeignTaxCodeError] = useState<boolean>(false)
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
  const [indirectTaxCodeFormatError, setIndirectTaxCodeFormatError] = useState(false)
  const [exemptionCodeFormatError, setExemptionTaxCodeFormatError] = useState(false)
  const [nameMismatch, setNameMismatch] = useState<{mismatch: boolean, name: string}>({mismatch: false, name: ''})
  const [instruction, setInstruction] = useState<string>('')

  const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])
  
  useEffect(() => {
    setTaxCodeFormatError(props.taxCodeFormatError)
  }, [props.taxCodeFormatError])

  useEffect(() => {
    setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
  }, [props.indirectTaxCodeFormatError])

  useEffect(() => {
    setExemptionTaxCodeFormatError(props.exemptionTaxCodeFormatError)
  }, [props.exemptionTaxCodeFormatError])

  useEffect(() => {
    setNameMismatch(props?.nameMismatch)
  }, [props?.nameMismatch?.mismatch])

  const tax1099Options: Array<Option> = [
    {
      id: 'yes',
      displayName: t('Yes'),
      path: 'yes'
    },
    {
      id: 'no',
      displayName: t('No'),
      path: 'no'
    },
  ]

  useEffect(() => {
    if (props.formData) {
      setCompanyName(props.formData.companyName)
      setLegalName(props.formData.legalName)
      setIsLegalNameSameAsCompanyName(props.formData.useCompanyName)
      setWebsite(props.formData.website)
      setDuns(props.formData.duns)
      setEmail(props.formData.email)
      setPhone(props.formData?.phone)
      setAddress(props.formData.address)
      setPrimaryName(props.formData.primary.fullName)
      setPrimaryEmail(props.formData.primary.email)
      setPaymentContactEmail(props.formData.paymentContactEmail)
      setTaxAddress(props.formData.taxAddress)
      setIsTaxAddressSameAsCompanyAddress(props.formData.useCompanyAddress)
      setUsCompanyEntityType(props.formData.usCompanyEntityType)
      setEncryptedTaxCode(props.formData.encryptedTaxCode)
      setTaxForm(props.formData.taxForm)
      setForeignTaxClassification(props.formData.foreignTaxClassification)
      setUsForeignTaxForm(props.formData.usForeignTaxForm)
      setSpecialTaxStatus(props.formData.specialTaxStatus)
      setSpecialTaxNote(props.formData.specialTaxNote)
      setSpecialTaxAttachment(props.formData.specialTaxAttachment)
      setEncryptedForeignTaxCode(props.formData.encryptedForeignTaxCode)
      setforeignTaxForm(props.formData.foreignTaxForm)
      setInRegistry(props.formData.inRegistry)
      setUsTaxDeclarationForm(props.formData.usTaxDeclarationForm)
      setEncryptedIndirectTaxCode(props.formData.encryptedIndirectTaxCode)
      setEncryptedExemptionTaxCode(props.formData.encryptedExemptionTaxCode)
      setUsTaxDeclarationFormKey(props.formData?.usTaxDeclarationFormKey)
      setInstruction(props.formData?.instruction)

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
      setSupressIndirectTaxCodeError(false)
      setSupressForeignTaxCodeError(false)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields && props.fields.length > 0) {
      setFieldMap({
        companyName: getFormFieldConfig('companyName', props.fields),
        legalName: getFormFieldConfig('legalName', props.fields),
        website: getFormFieldConfig('website', props.fields),
        duns: getFormFieldConfig('duns', props.fields),
        address: getFormFieldConfig('address', props.fields),
        email: getFormFieldConfig('email', props.fields),
        phone: getFormFieldConfig('phone', props.fields),
        taxAddress: getFormFieldConfig('taxAddress', props.fields),
        foreignTaxForm: getFormFieldConfig('foreignTaxForm', props.fields),
        taxKey: getFormFieldConfig('taxKey', props.fields),
        indirectTaxKey: getFormFieldConfig('indirectTaxKey', props.fields),
        encryptedTaxCode: getFormFieldConfig('encryptedTaxCode', props.fields),
        encryptedIndirectTaxCode: getFormFieldConfig('encryptedIndirectTaxCode', props.fields),
        usTaxDeclarationFormKey: getFormFieldConfig('usTaxDeclarationFormKey', props.fields),
        exemptionTaxKey: getFormFieldConfig('exemptionTaxKey', props.fields),
        encryptedExemptionTaxCode: getFormFieldConfig('encryptedExemptionTaxCode', props.fields),
        taxFormKey: getFormFieldConfig('taxFormKey', props.fields),
        instruction: getFormFieldConfig('instruction', props.fields)
      })
      const _excludeAddressSuggestionField = props.fields.find(field => field.fieldName === EXCLUDE_ADDRESS_SUGGESTION)
      setExcludeAddressSuggestion(_excludeAddressSuggestionField?.booleanValue || false)
    }
  }, [props.fields])

  useEffect(() => {
    props.usCompanyEntityTypeOptions && setCompanyEntityTypeOptions(props.usCompanyEntityTypeOptions)
  }, [props.usCompanyEntityTypeOptions])

  useEffect(() => {
    props.usForeignTaxClassificationOptions && setUsForeignTaxClassificationOptions(props.usForeignTaxClassificationOptions)
  }, [props.usForeignTaxClassificationOptions])

  function getFormData (): CompanyInfoV2FormData {
    return {
      companyName,
      legalName: isLegalNameSameAsCompanyName ? companyName : legalName,
      useCompanyName: isLegalNameSameAsCompanyName,
      website,
      duns,
      email,
      phone,
      address,
      taxAddress: isTaxAddressSameAsCompanyAddress ? address : taxAddress,
      useCompanyAddress: isTaxAddressSameAsCompanyAddress,
      primary: { fullName: primaryName, email: primaryEmail, role: props.formData?.primary?.role || '', phone: props.formData?.primary?.phone || '' },
      paymentContactEmail,
      companyEntityCountryCode: props.formData?.companyEntityCountryCode,
      usCompanyEntityType,
      taxKey,
      encryptedTaxCode,
      taxCodeError: props.formData?.taxKey ? props.formData.taxCodeError : null,
      taxFormKey,
      taxForm: taxFormKey ? taxForm : null,
      foreignTaxClassification,
      usForeignTaxFormKey: props.formData?.usForeignTaxFormKey,
      usForeignTaxForm: props.formData?.usForeignTaxFormKey ? usForeignTaxForm : null,
      specialTaxStatus,
      specialTaxNote: specialTaxStatus ? specialTaxNote : null,
      specialTaxAttachment: specialTaxStatus ? specialTaxAttachment : null,
      foreignTaxKey: props.formData?.foreignTaxKey,
      encryptedForeignTaxCode: props.formData?.foreignTaxKey ? encryptedForeignTaxCode : null,
      foreignTaxCodeError: props.formData?.foreignTaxKey ? props.formData.foreignTaxCodeError : null,
      foreignTaxFormKey: props.formData?.foreignTaxFormKey,
      foreignTaxForm: props.formData?.foreignTaxFormKey ? foreignTaxForm : null,
      registryQuestion: props.formData?.registryQuestion,
      inRegistry: props.formData?.registryQuestion ? inRegistry : null,
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
      indirectTaxCodeError: props.formData?.indirectTaxCodeError,
      exemptionTaxCodeError: props.formData?.exemptionTaxCodeError,
      tax1099Required: props.formData?.tax1099Required,
      tax1099: tax1099,
      taxCodeValidationTimeout: props.formData?.taxCodeValidationTimeout,
      indirectTaxCodeValidationTimeout: props.formData?.indirectTaxCodeValidationTimeout,
      exemptionTaxCodeValidationTimeout: props.formData?.exemptionTaxCodeValidationTimeout,
      instruction: instruction
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean | TaxKey): CompanyInfoV2FormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as CompanyInfoV2FormData

    switch (fieldName) {
      case 'companyName':
        formData.companyName = newValue as string
        break
      case 'legalName':
        formData.legalName = newValue as string
        break
      case 'useCompanyName':
        formData.useCompanyName = newValue as boolean
        break
      case 'website':
        formData.website = newValue as string
        break
      case 'duns':
        formData.duns = newValue as string
        break
      case 'email':
        formData.email = newValue as string
        break
      case 'phone':
        formData.phone = newValue as string
        break
      case 'address':
        formData.address = newValue as Address
        isTaxAddressSameAsCompanyAddress
          ? formData.taxAddress = newValue as Address
          : formData.taxAddress = taxAddress
        if (address.alpha2CountryCode !== (newValue as Address)?.alpha2CountryCode && isTaxAddressSameAsCompanyAddress) {
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
          setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
          setExemptionTaxCodeFormatError(props.exemptionTaxCodeFormatError)
        }
        break
      case 'primaryName':
        formData.primary.fullName = newValue as string
        break
      case 'primaryEmail':
        formData.primary.email = newValue as string
        break
      case 'paymentContactEmail':
        formData.paymentContactEmail = newValue as string
        break
      case 'taxAddress':
        if (taxAddress.alpha2CountryCode !== (newValue as Address)?.alpha2CountryCode) {
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
          setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
          setExemptionTaxCodeFormatError(props.exemptionTaxCodeFormatError)
        }
        formData.taxAddress = newValue as Address
        break
      case 'useCompanyAddress':
        formData.useCompanyAddress = newValue as boolean
        if (newValue && formData.taxAddress.alpha2CountryCode !== formData.address.alpha2CountryCode) {
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
          setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
          setExemptionTaxCodeFormatError(props.exemptionTaxCodeFormatError)
        }
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
      case 'usForeignTaxForm':
        formData.usForeignTaxForm = newValue as Attachment
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
      case 'encryptedForeignTaxCode':
        formData.encryptedForeignTaxCode = newValue as EncryptedData
        break
      case 'foreignTaxForm':
        formData.foreignTaxForm = newValue as Attachment
        break
      case 'inRegistry':
        formData.inRegistry = newValue as boolean
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
      return isRequired(field) && isEmpty(value) ? t("is required field", {label}) : ''
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
          case 'companyName':
            invalidFieldId = 'company-name-field'
            return !companyName
          case 'legalName':
            invalidFieldId = 'legal-name-field'
            return !isLegalNameSameAsCompanyName && !legalName
          case 'website':
            invalidFieldId = 'website-field'
            return !website
          case 'duns':
            invalidFieldId = 'duns-field'
            return !duns
          case 'email':
            invalidFieldId = 'email-field'
            return !email
          case 'phone':
            invalidFieldId = 'phone-field'
            return !phone
          case 'address':
            invalidFieldId = 'address-field'
            return !address || isAddressInvalid(address)
          case 'taxAddress':
            invalidFieldId = 'tax-address-field'
            return !isTaxAddressSameAsCompanyAddress && (!taxAddress || isAddressInvalid(taxAddress))
          case 'foreignTaxForm':
            invalidFieldId = 'foreignTaxForm-field'
            return props.formData?.foreignTaxFormKey && !foreignTaxForm
          case 'taxKey':
            invalidFieldId = 'taxKey-field'
            return props.formData?.taxKeysList?.length > 0 && !taxKey
          case 'encryptedTaxCode':
            invalidFieldId = 'taxCode-field'
            return taxKey && !(encryptedTaxCode.maskedValue || encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
          case 'indirectTaxKey':
            invalidFieldId = 'indirectTaxKey-field'
            return props.formData?.indirectTaxKeysList?.length > 0 && !indirectTaxKey
          case 'encryptedIndirectTaxCode':
            invalidFieldId = 'encryptedIndirectTaxCode-field'
            return indirectTaxKey && !(encryptedIndirectTaxCode.maskedValue || encryptedIndirectTaxCode.unencryptedValue) && !props.indirectTaxCodeFormatError
          case 'usTaxDeclarationForm':
            invalidFieldId = 'usTaxDeclarationForm-field'
            return usTaxDeclarationFormKey && !usTaxDeclarationForm
          case 'exemptionTaxKey':
            invalidFieldId = 'exemptionTaxKey-field'
            return specialTaxStatus && props.formData?.exemptionTaxKeysList?.length > 0 && !exemptionTaxKey
          case 'encryptedExemptionTaxCode':
            invalidFieldId = 'encryptedExemptionTaxCode'
            return specialTaxStatus && exemptionTaxKey && !(encryptedExemptionTaxCode.maskedValue || encryptedExemptionTaxCode.unencryptedValue) && !props.exemptionTaxCodeFormatError
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
      } else {
        if (field.fieldName === 'email') {
          invalidFieldId = email && !!validateEmail('Email', email, true) ? 'email-field' : ''
          return invalidFieldId ? true : false
        } else if (field.fieldName === 'duns') {
          invalidFieldId = duns && !!validateDUNSNumber('Duns', duns, true) ? 'duns-field' : ''
          return invalidFieldId ? true : false
        }
      }
    })

    if (!isInvalid) {
      if (specialTaxStatus && !specialTaxAttachment) {
        isInvalid = true
        invalidFieldId = 'specialTaxAttachment-field'
      } else if (email) {
        invalidFieldId = validateEmail('Email', email, true) ? 'email-field' : ''
        isInvalid = invalidFieldId ? true : false
      }
    }

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

  function fetchData (skipValidation?: boolean): CompanyInfoV2FormData {
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
    props.formData?.taxFormKey,
    props.formData?.usForeignTaxFormKey, props.formData?.foreignTaxKey, props.formData?.foreignTaxFormKey,
    props.formData?.registryQuestion,
    companyName, legalName, website, duns, email, phone, address, primaryName, primaryEmail, paymentContactEmail,
    usCompanyEntityType, taxAddress, taxForm, foreignTaxClassification, usForeignTaxForm, encryptedTaxCode,
    specialTaxStatus, specialTaxNote, specialTaxAttachment, foreignTaxForm, inRegistry, encryptedForeignTaxCode,
    taxKey, indirectTaxKey, encryptedIndirectTaxCode, usTaxDeclarationFormKey, usTaxDeclarationForm,
    exemptionTaxKey, encryptedExemptionTaxCode, instruction
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

  function getIndirectTaxKeysList (): Array<Option> {
    const indirecttTaxKeysList = props.formData?.indirectTaxKeysList.map(taxKey => {
      return { ...taxKey, displayName: getTaxKeyNameForKey(taxKey.path) ? getTaxKeyNameForKey(taxKey.path) : taxKey.path }
    })
    return indirecttTaxKeysList
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
        props.onValidateTINFormat(taxKey, taxAddress.alpha2CountryCode, encryptedTaxCode, taxCode)
      }
    }
  }
  function renderForeignTax(){
    const foreignTaxLabel = t('Foreign Tax Code');

    return (<div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="foreignTaxCode-field">
              <EncryptedDataBox
                label={getTaxKeyNameForKey(props.formData?.foreignTaxKey) || foreignTaxLabel}
                value={encryptedForeignTaxCode}
                description={getTaxKeyDescriptionForKey(props.formData?.foreignTaxKey)}
                disabled={false}
                required={true}
                forceValidate={(isValidatedOnce && !supressForeignTaxCodeError && props.formData?.foreignTaxCodeError) || forceValidate}
                validator={(value) => (!supressForeignTaxCodeError && props.formData?.foreignTaxCodeError)
                  ? t('Tax Code is invalid',{taxCode:getTaxKeyNameForKey(props.formData?.foreignTaxKey) || foreignTaxLabel})
                  : props.formData?.foreignTaxKey && isEmpty(value) ? t('Tax Code is a required field',{taxCode:getTaxKeyNameForKey(props.formData?.foreignTaxKey) || foreignTaxLabel}) : ''}
                onChange={value => { setEncryptedForeignTaxCode(value); handleFieldValueChange('foreignTaxCode', encryptedForeignTaxCode, value); setSupressForeignTaxCodeError(true) }}
              />
            </div>
          </div>)
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
    <div className={styles.companyInfoForm}>
      <div className={styles.section}>
        <div className={styles.title}>{t('Business information')}</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="company-name-field">
            <TextBox
              label={t("Company Name")}
              value={companyName}
              disabled={isFieldDisabled('companyName')}
              required={isFieldRequired('companyName')}
              warning={nameMismatch?.mismatch}
              forceValidate={forceValidate || nameMismatch?.mismatch}
              validator={nameMismatch?.mismatch ? () => t('Does not match with the Tax ID name.') : (value) => validateField('companyName', t('Company name'), value)}
              onChange={value => { setCompanyName(value); handleFieldValueChange('companyName', companyName, value); setNameMismatch({mismatch: false, name: ''}) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="legal-name-field">
            <TextBox
              label={t("Legal Company Name")}
              value={legalName}
              enableSameAs={true}
              sameAsLabel="Company Name"
              isSameAs={isLegalNameSameAsCompanyName}
              disabled={isFieldDisabled('legalName')}
              required={isFieldRequired('legalName')}
              forceValidate={forceValidate}
              validator={(value) => !isLegalNameSameAsCompanyName ? validateField('legalName', t('Legal company name'), value) : '' }
              onChange={value => { setLegalName(value); handleFieldValueChange('legalName', legalName, value) }}
              onSameAsChange={(value) => { setIsLegalNameSameAsCompanyName(value); handleFieldValueChange('useCompanyName', isLegalNameSameAsCompanyName, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="website-field">
            <OROWebsiteInput
              label={t("Website")}
              value={website}
              disabled={isFieldDisabled('website')}
              required={isFieldRequired('website')}
              forceValidate={forceValidate}
              validator={(value) => validateField('website', t("Website"), value)}
              onChange={value => { setWebsite(value); handleFieldValueChange('website', website, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="duns-field">
            <TextBox
              label={t("DUNS Number")}
              value={duns}
              disabled={isFieldDisabled('duns')}
              required={isFieldRequired('duns')}
              forceValidate={forceValidate}
              validator={(value) => validateDUNSNumber(t("DUNS Number"), value, !isFieldRequired('duns'))}
              onChange={value => { setDuns(value); handleFieldValueChange('duns', duns, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="email-field">
            <OROEmailInput
              label={t('Email')}
              placeholder={t('Enter email address')}
              value={email}
              disabled={isFieldDisabled('email')}
              required={isFieldRequired('email')}
              forceValidate={forceValidate}
              validator={(value) => validateEmail(t('Email'), value, !isFieldRequired('email'))}
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
          <div className={classnames(styles.item, styles.col3)} id="address-field">
            <GoogleMultilinePlaceSearch
              id="address"
              label={t("Company Address")}
              excludeAddressSuggestion={excludeAddressSuggestion}
              value={address}
              countryOptions={props.countryOptions}
              required={isFieldRequired('address')}
              forceValidate={forceValidate}
              validator={(value) => validateAddressField('address', t('Company Address'), value)}
              onChange={(value, countryChanged) => { setAddress(value); isTaxAddressSameAsCompanyAddress && setTaxAddress(value); countryChanged && handleFieldValueChange('address', address, value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>{t("Tax information")}</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="tax-address-field">
            <GoogleMultilinePlaceSearch
              id="taxAddress"
              label={t("Address of tax residency")}
              excludeAddressSuggestion={excludeAddressSuggestion}
              value={taxAddress}
              enableSameAs={true}
              sameAsLabel={t("Company Address")}
              isSameAs={isTaxAddressSameAsCompanyAddress}
              countryOptions={props.countryOptions}
              required={isFieldRequired('taxAddress')}
              forceValidate={forceValidate}
              validator={(value) => !isTaxAddressSameAsCompanyAddress ? validateAddressField('taxAddress', t('Address of tax residency'), value) : ''}
              onChange={(value, countryChanged) => { setTaxAddress(value); countryChanged && handleFieldValueChange('taxAddress', taxAddress, value) }}
              onSameAsChange={(value) => { setIsTaxAddressSameAsCompanyAddress(value);handleFieldValueChange('useCompanyAddress', isTaxAddressSameAsCompanyAddress, value) }}
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
                validator={(value) => validateField('taxKey', t('Tax ID type'), value)}
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
                validator={taxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('encryptedTaxCode', getTaxKeyNameForKey(taxKey), value)}
                onBlur={value => handleValidateTinFormat(taxKey, value, 'encryptedTaxCode')}
                onChange={value => { setEncryptedTaxCode(value); handleFieldValueChange('encryptedTaxCode', encryptedTaxCode, value); setTaxCodeFormatError(false) }}
              />
            </div>
          </div>
        }

        { 
          props.formData?.indirectTaxKeysList?.length > 1 &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="indirectTaxKey-field">
              <TypeAhead
                label={t("Indirect tax ID type")}
                placeholder={t("Choose indirect tax ID type")}
                value={convertTaxKeyToOption(indirectTaxKey)}
                options={getIndirectTaxKeysList()}
                disabled={isFieldDisabled('indirectTaxKey')}
                required={isFieldRequired('indirectTaxKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('indirectTaxKey', t('Indirect tax ID type'), value)}
                onChange={value => { setIndirectTaxKey(getTaxKeyFromOption(value) as TaxKey); value?.id !== indirectTaxKey && setEncryptedIndirectTaxCode(emptyEcncryptedData); handleFieldValueChange('indirectTaxKey', indirectTaxKey, value?.path || '') }}
              />
            </div>
          </div>
        }

        {
          indirectTaxKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="encryptedIndirectTaxCode-field">
              <EncryptedDataBox
                key={`${convertAddressToString(address)}${indirectTaxKey}`}
                label={getTaxKeyNameForKey(indirectTaxKey)}
                value={encryptedIndirectTaxCode}
                description={getTaxKeyDescriptionForKey(indirectTaxKey)}
                disabled={isFieldDisabled('encryptedIndirectTaxCode')}
                required={isFieldRequired('encryptedIndirectTaxCode')}
                forceValidate={forceValidate || indirectTaxCodeFormatError}
                warning={indirectTaxCodeFormatError}
                validator={indirectTaxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('encryptedIndirectTaxCode', getTaxKeyNameForKey(indirectTaxKey), value)}
                onBlur={value => handleValidateTinFormat(indirectTaxKey, value, 'encryptedIndirectTaxCode')}
                onChange={value => { setEncryptedIndirectTaxCode(value); handleFieldValueChange('encryptedIndirectTaxCode', encryptedIndirectTaxCode, value); setIndirectTaxCodeFormatError(false) }}
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
                validator={(value) => isEmpty(value) ? t('1099 is a required field') : ''}
                onChange={value => {setTax1099(value); handleFieldValueChange('tax1099', tax1099, value)}}
              />
            </div>
          </div>}

        { props.formData?.usCompanyEntityType &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="usCompanyEntityType-field">
              <TypeAhead
                label={t("Business entity type")}
                placeholder={t("Choose")}
                type={OptionTreeData.entity}
                value={usCompanyEntityType}
                options={usCompanyEntityTypeOptions}
                showTree={true}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('USCompanyEntityType', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'USCompanyEntityType')}
                validator={(value) => props.formData?.companyEntityCountryCode === 'US' && isEmpty(value) ? t('Business entity type is a required field.') : ''}
                onChange={value => {setUsCompanyEntityType(value); handleFieldValueChange('usCompanyEntityType', usCompanyEntityType, value)}}
              />
            </div>
          </div>}

        { foreignTaxClassification &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="foreignTaxClassification-field">
              <Radio
                name='company-foreign-tax-classification'
                label={t("US Federal Tax Classification")}
                value={foreignTaxClassification}
                options={usForeignTaxClassificationOptions}
                disabled={isFieldDisabled('foreignTaxClassification')}
                required={isFieldRequired('foreignTaxClassification')}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? t('US Federal Tax Classification is a required field.') : ''}
                onChange={value => {setForeignTaxClassification(value); handleFieldValueChange('foreignTaxClassification', foreignTaxClassification, value)}}
              />
            </div>
          </div>}

        {
          usTaxDeclarationFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="usTaxDeclarationForm-field">
              <AttachmentBox
                label={t('Attach Signed Tax form', {'formName': getTaxFormNameForKey(usTaxDeclarationFormKey) })}
                value={usTaxDeclarationForm}
                description={getTaxFormDescriptionForKey(props.formData?.usTaxDeclarationFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.usTaxDeclarationFormKey)}
                link={getTaxFormLinkForKey(props.formData?.usTaxDeclarationFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={isFieldDisabled('usTaxDeclarationFormKey')}
                required={isFieldRequired('usTaxDeclarationFormKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('usTaxDeclarationFormKey', `${getTaxFormNameForKey(usTaxDeclarationFormKey) || t('Tax Form')}`, (value?.name || value?.filename))}
                onChange={(file) => handleFileChange('usTaxDeclarationForm', file)}
                onPreview={() => loadFile('usTaxDeclarationForm', usTaxDeclarationForm.mediatype, usTaxDeclarationForm.filename)}
              />
            </div>
          </div>
        }

        { props.formData?.foreignTaxKey && renderForeignTax()}

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
                label={getTaxFormNameForKey(taxFormKey) || t('Tax Form')}
                value={taxForm}
                description={getTaxFormDescriptionForKey(taxFormKey)}
                linkText={getTaxFormLinkTextForKey(taxFormKey)}
                link={getTaxFormLinkForKey(taxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={isFieldDisabled('taxFormKey')}
                required={isFieldRequired('taxFormKey')}
                forceValidate={forceValidate}
                validator={(value) => validateField('taxFormKey', `${getTaxFormNameForKey(taxFormKey) || t('Tax Form')}`, (value?.name || value?.filename))}
                onChange={(file) => handleFileChange('taxForm', file)}
                onPreview={() => loadFile('taxForm', taxForm.mediatype, taxForm.filename)}
              />
            </div>
          </div>}

        { props.formData?.usForeignTaxFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="usForeignTaxForm-field">
              <AttachmentBox
                label={getTaxFormNameForKey(props.formData?.usForeignTaxFormKey) || t('Foreign Tax Form')}
                value={usForeignTaxForm}
                description={getTaxFormDescriptionForKey(props.formData?.usForeignTaxFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.usForeignTaxFormKey)}
                link={getTaxFormLinkForKey(props.formData?.usForeignTaxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value?.name || value?.filename) ? t("is required field", {label: (getTaxFormNameForKey(props.formData?.usForeignTaxFormKey)|| t('Foreign Tax Form'))}) : ''}
                onChange={(file) => handleFileChange('usForeignTaxForm', file)}
                onPreview={() => loadFile('usForeignTaxForm', usForeignTaxForm.mediatype, usForeignTaxForm.filename)}
              />
            </div>
          </div>}

          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxStatus-field">
              <ToggleSwitch
                label={t('Legal tax status or exemption?')}
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
                validator={(value) => validateField('exemptionTaxKey', t('Exemption tax ID type'), value)}
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
                required={specialTaxStatus && isFieldRequired('encryptedExemptionTaxCode')}
                forceValidate={forceValidate || exemptionCodeFormatError}
                warning={exemptionCodeFormatError}
                validator={exemptionCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('encryptedExemptionTaxCode', getTaxKeyNameForKey(exemptionTaxKey), value)}
                onBlur={value => handleValidateTinFormat(exemptionTaxKey, value, 'encryptedExemptionTaxCode')}
                onChange={value => { setEncryptedExemptionTaxCode(value); handleFieldValueChange('encryptedExemptionTaxCode', encryptedExemptionTaxCode, value); setExemptionTaxCodeFormatError(false) }}
              />
            </div>
          </div>
        }

        { specialTaxStatus &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxNote-field">
              <TextBox
                label={t("Note")}
                value={specialTaxNote}
                disabled={isFieldDisabled('specialTaxNote')}
                required={isFieldRequired('specialTaxNote')}
                forceValidate={forceValidate}
                validator={(value) => specialTaxStatus && isFieldRequired('specialTaxNote') && isEmpty(value) ? t('Special tax status details is a required field') : ''}
                onChange={value => { setSpecialTaxNote(value); handleFieldValueChange('specialTaxNote', specialTaxNote, value) }}
              />
            </div>
          </div>}

        { specialTaxStatus &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="specialTaxAttachment-field">
              <AttachmentBox
                label={t("Attachment")}
                value={specialTaxAttachment}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => specialTaxStatus && isEmpty(value?.name || value?.filename) ? t('Special tax status file is a required field') : ''}
                onChange={(file) => handleFileChange('specialTaxAttachment', file)}
                onPreview={() => loadFile('specialTaxAttachment', specialTaxAttachment.mediatype, specialTaxAttachment.filename)}
              />
            </div>
          </div>}

        { props.formData?.foreignTaxFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="foreignTaxForm-field">
              <AttachmentBox
                label={getTaxFormNameForKey(props.formData?.foreignTaxFormKey) || t('Foreign Tax Form')}
                value={foreignTaxForm}
                description={getTaxFormDescriptionForKey(props.formData?.foreignTaxFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.foreignTaxFormKey)}
                link={getTaxFormLinkForKey(props.formData?.foreignTaxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={isFieldDisabled('foreignTaxForm')}
                required={isFieldRequired('foreignTaxForm')}
                forceValidate={forceValidate}
                validator={(value) => validateField('foreignTaxForm', getTaxFormNameForKey(props.formData?.foreignTaxFormKey) || t('Foreign Tax Form'), value?.name || value?.filename)}
                onChange={(file) => handleFileChange('foreignTaxForm', file)}
                onPreview={() => loadFile('foreignTaxForm', foreignTaxForm.mediatype, foreignTaxForm.filename)}
              />
            </div>
          </div>}

        { props.formData?.registryQuestion &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="registryQuestion-field">
              <ToggleSwitch
                label={props.formData?.registryQuestion}
                value={inRegistry}
                required={true}
                falsyLabel={t("No")}
                truthyLabel={t("Yes")}
                onChange={setInRegistry}
              />
            </div>
          </div>}
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
              validator={(value) => isFieldRequired('instruction') && isEmpty(value) ? t('Instruction is a required field') : ''}
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
