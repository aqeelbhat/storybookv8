import React, { useEffect, useMemo, useState } from 'react'
import { BankInfoFormData, BankInfoFormProps, BankKeyLookupEntry, emptyEcncryptedData, Field, FormBankInfo } from './types';
import { Address, BankKey, EncryptedData, Option } from './../Types'
import styles from './bankInfo-form-styles.module.scss'
import { OROEmailInput, TextBox, ToggleSwitch, TypeAhead } from '../Inputs';
import { areObjectsSame, getEmptyAddress, getFormFieldConfig, isAddressInvalid, isDisabled, isEmpty, isRequired, isStateNeeded, mapBankAddress, mapBankCountryToOption, mapBankKeysToOption, mapBankKeyToOption, mapKeyLookupEntryToOption, mapStringToOption } from './util';
import { DropdownControl, OroButton } from '../controls';
import classnames from 'classnames';
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch';
import { EncryptedDataBox, TextArea } from '../Inputs/text.component';
import { debounce } from '../util';
import { Info } from 'react-feather';
import { Tooltip } from '@mui/material';
import { ExistingBankListing } from '../ExistingBankDetailsListing/existing-bank-listing.component';
import { NAMESPACES_ENUM, useTranslationHook, getI18Text } from "../i18n";

export function NewBankInfoForm(props: BankInfoFormProps) {
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])

  const [businessEmail, setBusinessEmail] = useState<string>('')

  // Primary Bank Info
  const [currencyCode, setCurrencyCode] = useState<Option>()
  const [bankName, setBankName] = useState<string>('')
  const [bankCountry, setBankCountry] = useState<Option>()
  const [bankAddress, setBankAddress] = useState<Address>(getEmptyAddress())
  const [accountHolder, setAccountHolder] = useState<string>('')
  const [accountHolderAddress, setAccountHolderAddress] = useState<Address>(getEmptyAddress())

  const [key, setKey] = useState<BankKey>('')
  const [bankCode, setBankCode] = useState<string>('')
  const [bankCodeEncrypted, setBankCodeEncrypted] = useState(false)
  const [encryptedBankCode, setEncryptedBankCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [internationalKey, setInternationalKey] = useState<BankKey>('')
  const [internationalCode, setInternationalCode] = useState<string>('')
  const [internationalCodeEncrypted, setInternationalCodeEncrypted] = useState(false)
  const [encryptedInternationalBankCode, setEncryptedInternationalBankCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [omitAccountNumber, setOmitAccountNumber] = useState(false)
  const [accountNumber, setAccountNumber] = useState<EncryptedData>(emptyEcncryptedData)
  const [omitInternalAccountNUmber, setOmitInternalAccountNUmber] = useState(false)

  // Intermediary Bank Info
  const [intermediaryBankRequired, setIntermediaryBankRequired] = useState<boolean>(false)
  const [intermediaryBankName, setIntermediaryBankName] = useState<string>('')
  const [intermediaryBankAddress, setIntermediaryBankAddress] = useState<Address>(getEmptyAddress())
  const [intermediaryKey, setIntermediaryKey] = useState<BankKey>('')
  const [intermediaryBankCode, setIntermediaryBankCode] = useState<string>('')
  const [instruction, setInstruction] = useState<string>('')

  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  const [selectedInternationalkeyOption, setSelectedInternationalkeyOption] = useState<Option>()
  const [internationalkeyOptions, setInternationalKeyOptions] = useState<Array<Option>>([])

  const [showBankDetailForm, setShowBankDetailForm] = useState<boolean>(false)
  const [selectedExistingBankInfo, setSelectedExistingBankInfo] = useState<boolean>(false)
  const [existingBankList, setExistingBankList] = useState<Array<FormBankInfo>>([])
  const [selectedBankDetailIndex, setSelectedBankDetailIndex] = useState<number>(-1)
  const [showBankSelectionMethodOption, setShowBankSelectionMethodOption] = useState<boolean>(false)

  const [editingExistingForm, setEditingExistingForm] = useState<boolean>(false)

  const [previousBankCode, setPreviousBankCode] = useState<string>()
  const [previousBankAddress, setPreviousBankAddress] = useState<Address>()
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  // const [bankCodeFormatError, setBankCodeFormatError] = useState(false)
  // const [interBankCodeFormatError, setInterBankCodeFormatError] = useState(false)

  useEffect(() => {
    if (props.formData) {
      setBusinessEmail(props.formData.businessEmail)
      setOmitInternalAccountNUmber(props.formData.bankInformation.omitInternalAccountNUmber)
      setEncryptedBankCode(props.formData.bankInformation.encryptedBankCode)
      setEncryptedInternationalBankCode(props.formData.bankInformation.encryptedInternationalBankCode)
      setInternationalCodeEncrypted(props.formData.bankInformation.internationalCodeEncrypted)
      setCurrencyCode(props.formData.bankInformation.currencyCode)
      setBankName(props.formData.bankInformation.bankName)
      setAccountHolder(props.formData.bankInformation.accountHolder)
      setInstruction(props.formData.instruction)
      setBankAddress(props.formData.bankInformation.bankAddress)
      setAccountHolderAddress(props.formData.bankInformation.accountHolderAddress)
      setAccountNumber(props.formData.bankInformation.accountNumber)
      setSelectedBankDetailIndex(props.formData.existingSelectedBankIndex)
      if (props.formData.intermediaryBankInformation) {
        setIntermediaryBankName(props.formData.intermediaryBankInformation.bankName)
        setIntermediaryBankAddress(props.formData.intermediaryBankInformation.bankAddress)
        setIntermediaryKey(props.formData.intermediaryBankInformation.key)
        setIntermediaryBankCode(props.formData.intermediaryBankInformation.bankCode)
        setIntermediaryBankRequired(props.formData.intermediaryBankRequired)
      }
      if (props.formData.bankInformation.internationalKey === "iban") {
        setOmitInternalAccountNUmber(true)
        setPreviousBankCode(props.formData.bankInformation.internationalKey)
        setPreviousBankAddress(props.formData.bankInformation.bankAddress)
        const keyOptions: Array<BankKey> = [props.formData.bankInformation.internationalKey, "swift"]
        const internationalKeys: Array<Option> = keyOptions.map(key => {
          const searchedkey = props.bankKeys?.find(enumVal => enumVal.code === key)
          if (searchedkey) {
            return mapBankKeysToOption(searchedkey)
          }
        }
        ).filter(option => !!option);
        setInternationalKeyOptions(internationalKeys)
      } else if (bankAddress?.alpha2CountryCode !== props.formData?.bankInformation?.bankAddress?.alpha2CountryCode) {
        setPreviousBankCode(props.formData.bankInformation.internationalKey)
        setPreviousBankAddress(props.formData.bankInformation.bankAddress)
      }
      setSelectedInternationalkeyOption(mapStringToOption(props.formData.bankInformation.internationalKey))
    }
  }, [props.formData])

  function getSelectedBankDetails() {
    if (props.formData?.bankInformation) {
      const isSelectedFromExistingbank = props.existingBankInfo.findIndex((item, index) => item.accountNumber.data === props.formData.bankInformation?.accountNumber.data)
      return isSelectedFromExistingbank
    }
  }

  useEffect(() => {
    if (showBankDetailForm) {
      setSelectedBankDetailIndex(-1)
    }
  }, [showBankDetailForm])

  // useEffect(() => {
  //   setBankCodeFormatError(props.bankCodeError)
  // }, [props.bankCodeError])

  // useEffect(() => {
  //   setInterBankCodeFormatError(props.internationalCodeError)
  // }, [props.internationalCodeError])

  useEffect(() => {
    if (props.isCrossBorder && props.formData?.bankInformation?.internationalKey) {
      setKey("")
      setBankCode("")
      setInternationalKey(props.formData.bankInformation.internationalKey)
      setInternationalCode(props.formData.bankInformation.internationalCode)
      if (props.formData.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.formData.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) {
        setInternationalCodeEncrypted(true)
        if (!props.formData.bankInformation.internationalCode) {
          setInternationalCode(props.formData.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)
        }
      }
    } else if (!props.isCrossBorder && props.formData?.bankInformation?.key) {
      setKey(props.formData.bankInformation.key)
      setBankCode(props.formData.bankInformation.bankCode)
      setInternationalKey("")
      setInternationalCode("")
      if (props.formData?.bankInformation?.encryptedBankCode?.maskedValue) {
        setBankCodeEncrypted(true)
      }
    }
  }, [props.isCrossBorder, props.formData])

  useEffect(() => {
    if (props.countryOptions && props.formData) {
      if (props.formData.bankInformation.bankAddress?.alpha2CountryCode) {
        const country = mapBankAddress(props.formData.bankInformation.bankAddress)?.alpha2CountryCode
        const matchingEntry = props.countryOptions?.find(entry => entry.path === country)
        setBankCountry(matchingEntry)
        setBankAddress(mapBankAddress(props.formData.bankInformation.bankAddress))
      }
      //  else if (props.formData.bankInformation.accountHolderAddress && !bankAddress?.alpha2CountryCode) {
      //   const country = mapBankAddress(props.formData.bankInformation.accountHolderAddress)?.alpha2CountryCode
      //   const matchingEntry = props.countryOptions?.find(entry => entry.path === country)
      //   const address = {...getEmptyAddress(), alpha2CountryCode: country}
      //   setBankCountry(matchingEntry)
      //   setBankAddress(address)
      // }
    }
  }, [props.countryOptions, props.formData])

  function checkBankCodeExist(): boolean {
    return (props.formData?.bankInformation?.bankCode || props.formData?.bankInformation?.internationalCode || props.formData?.bankInformation?.encryptedBankCode?.unencryptedValue || props.formData.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) ? true : false
  }

  useEffect(() => {
    if (props.existingBankInfo?.length > 0) {
      if (props.formData) {
        const index = getSelectedBankDetails()
        setSelectedBankDetailIndex(index)

        if (!props.formData?.selectedExistingBankInfo && index < 0 && (checkBankCodeExist() || editingExistingForm)) {
          setShowBankDetailForm(true)
        } else {
          setShowBankDetailForm(false)
        }
      }
      setShowBankSelectionMethodOption(true)
      setExistingBankList(props.existingBankInfo)
    } else {
      setShowBankDetailForm(true)
      setShowBankSelectionMethodOption(false)
    }
  }, [props.existingBankInfo, props.formData])

  useEffect(() => {
    // use from lookup flags if available
    if (props.formData) {
      // let omit = props.formData.bankInformation.omitAccountNumber
      // if (props.domesticKeyOptions && props.bankKeys && props.domesticKeyOptions.length > 0) {
      //   omit = !!(mapBankKeyToOption(props.formData.bankInformation.key, props.domesticKeyOptions, props.bankKeys)?.customData?.omitAccountNumber)
      // }
      if (props.formData.bankInformation.key === "iban") {
        setOmitAccountNumber(true)
      } else {
        setOmitAccountNumber(false)
      }


      let encrypt = props.formData.bankInformation.bankCodeEncrypted
      if (props.domesticKeyOptions && props.bankKeys && props.domesticKeyOptions.length > 0) {
        encrypt = !!(mapBankKeyToOption(props.formData.bankInformation.key, props.domesticKeyOptions, props.bankKeys)?.customData?.bankCodeEncrypted)
      }
      setBankCodeEncrypted(encrypt)
    }
  }, [props.formData, props.domesticKeyOptions, props.bankKeys])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        businessEmail: getFormFieldConfig('businessEmail', props.fields)
      })
    }
  }, [props.fields])

  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  function getFormData(): BankInfoFormData {
    return {
      businessEmail,
      companyEntityCountryCode: props.formData?.companyEntityCountryCode,
      bankInformation: {
        currencyCode,
        bankName,
        bankAddress,
        accountHolder,
        accountHolderAddress,
        accountNumber,
        key: !props.isCrossBorder ? key : '',
        bankCode: (!props.isCrossBorder && !bankCodeEncrypted) ? bankCode : '',
        encryptedBankCode: (!props.isCrossBorder && bankCodeEncrypted) ? encryptedBankCode : undefined,
        internationalKey: props.isCrossBorder && internationalKey !== "iban" ? internationalKey : selectedInternationalkeyOption ? selectedInternationalkeyOption?.path as BankKey : '',
        internationalCode: props.isCrossBorder ? internationalCode : '',
        encryptedInternationalBankCode: props.isCrossBorder ? encryptedInternationalBankCode : emptyEcncryptedData,
      },
      intermediaryBankRequired,
      intermediaryBankInformation: (props.isCrossBorder && intermediaryBankRequired)
        ? {
          bankName: intermediaryBankName,
          bankAddress: intermediaryBankAddress,
          key: intermediaryKey,
          bankCode: intermediaryBankCode
        }
        : null,
      selectedExistingBankInfo: selectedExistingBankInfo,
      existingSelectedBankIndex: selectedBankDetailIndex,
      instruction
    }
  }

  function getFormDataWithUpdatedValue(fieldName: string, newValue: string | Option | Address | EncryptedData | boolean): BankInfoFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as BankInfoFormData

    switch (fieldName) {
      case 'businessEmail':
        formData.businessEmail = newValue as string
        break

      case 'currencyCode':
        formData.bankInformation.currencyCode = newValue as Option
        break
      case 'bankName':
        formData.bankInformation.bankName = newValue as string
        break
      case 'accountHolder':
        formData.bankInformation.accountHolder = newValue as string
        break
      case 'accountHolderAddress':
        formData.bankInformation.accountHolderAddress = newValue as Address
        break
      case 'bankAddress':
        formData.bankInformation.bankAddress = newValue as Address
        break
      case 'accountNumber':
        formData.bankInformation.accountNumber = newValue as EncryptedData
        break
      case 'key':
        formData.bankInformation.key = newValue as BankKey
        formData.bankInformation.internationalKey = ""
        break
      case 'bankCode':
        formData.bankInformation.bankCode = newValue as string
        formData.bankInformation.internationalKey = ""
        break
      case 'encryptedBankCode':
        formData.bankInformation.encryptedBankCode = newValue as EncryptedData
        formData.bankInformation.internationalKey = ""
        break
      case 'internationalKey':
        formData.bankInformation.internationalKey = newValue as BankKey
        formData.bankInformation.key = ""
        break
      case 'internationalCode':
        formData.bankInformation.internationalCode = newValue as string
        formData.bankInformation.key = ""
        break
      case 'encryptedInternationalBankCode':
        const encryptData = newValue as EncryptedData
        formData.bankInformation.encryptedInternationalBankCode = newValue as EncryptedData
        formData.bankInformation.internationalCode = encryptData?.unencryptedValue
        formData.bankInformation.key = ""
        break
      case 'intermediaryBankRequired':
        formData.intermediaryBankRequired = newValue as boolean
        break
      case 'intermediaryBankName':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankName = newValue as string
        }
        break
      case 'intermediaryBankAddress':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankAddress = newValue as Address
        }
        break
      case 'intermediaryKey':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.key = newValue as BankKey
        }
        break
      case 'intermediaryBankCode':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankCode = newValue as string
        }
        break
    }

    return formData
  }

  function dispatchOnValueChange(fieldName: string, formData: BankInfoFormData) {
    if (props.onValueChange) {
      props.onValueChange(
        fieldName,
        formData
      )
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedOnValueChange = useMemo(() => debounce(dispatchOnValueChange), [])

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Option | Address | EncryptedData | boolean,
    newValue: string | Option | Address | EncryptedData | boolean,
    useDebounce?: boolean
  ) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        if (useDebounce) {
          debouncedOnValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        }
      } else if (!areObjectsSame(oldValue, newValue)) {
        if (useDebounce) {
          debouncedOnValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        }
      }
    }
  }

  function handleKeyLookupEntrySelection(selectedOption?: Option) {
    const selectedEntry = selectedOption?.customData as BankKeyLookupEntry

    if (selectedEntry) {
      setKey(selectedEntry.bankKey)

      // Clear the values
      setBankCode(null)
      setEncryptedBankCode(null)

      setBankCodeEncrypted(selectedEntry.bankCodeEncrypted)

      setOmitAccountNumber(selectedEntry.omitAccountNumber)
      if (selectedOption?.path === "iban") {
        setOmitAccountNumber(true)
        setInternationalCodeEncrypted(true)
      } else {
        setInternationalCodeEncrypted(false)
        setOmitAccountNumber(false)
      }

      handleFieldValueChange('key', key, selectedEntry.bankKey)
    }
  }

  function validateField(fieldName: string, label: string, value: string | string[]): string {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? getI18Text("is required field", { label }) : ''
    } else {
      return ''
    }
  }

  function validateAddressField(label: string, value: Address): string {
    if (!value) {
      return getI18Text("is required field", { label })
    } else if (isAddressInvalid(value)) {
      return getI18Text("is invalid", { label })
    } else {
      return ''
    }
  }

  function isFieldDisabled(fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field)
    } else {
      return false
    }
  }

  function isFieldRequired(fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
    }
  }

  function isRequiredFieldsInvalid(): string {
    let invalidFieldId = ''
    const isInvalid = props.fields && props.fields.some(field => {
      if (isRequired(field)) {
        switch (field.fieldName) {
          case 'businessEmail':
            invalidFieldId = 'business-email-field'
            return !businessEmail
        }
      }
    })
    return isInvalid ? invalidFieldId : ''
  }

  function isFormInvalid(): string {
    let invalidFieldId = isRequiredFieldsInvalid()
    let isInvalid = invalidFieldId.length > 0 ? true : false

    if (!isInvalid) {
      if (!currencyCode || !currencyCode.id) {
        isInvalid = true
        invalidFieldId = 'currency-field'
      } else if (!bankName) {
        isInvalid = true
        invalidFieldId = 'bank-name-field'
      } else if (!bankCountry) {
        isInvalid = true
        invalidFieldId = 'bank-Country-field'
      } else if (props.isCrossBorder && (!bankAddress || isAddressInvalid(bankAddress))) {
        isInvalid = true
        invalidFieldId = 'bank-address-field'
      } else if (!props.isCrossBorder && !key) {
        isInvalid = true
        invalidFieldId = 'bank-key-field'
      } else if (props.isCrossBorder && !selectedInternationalkeyOption) {
        isInvalid = true
        invalidFieldId = 'bank-key-options-field'
      } else if (!accountHolder) {
        isInvalid = true
        invalidFieldId = 'account-holder-field'
      } else if (!accountHolderAddress || isAddressInvalid(accountHolderAddress)) {
        isInvalid = true
        invalidFieldId = 'account-holder-address-field'
      } else if (((!omitAccountNumber && !props.isCrossBorder) || (props.isCrossBorder && !omitInternalAccountNUmber)) && (!accountNumber || (!accountNumber.maskedValue && !accountNumber.unencryptedValue))) {
        isInvalid = true
        invalidFieldId = 'account-number-field'
      } else if (!props.isCrossBorder && (!(bankCode || (encryptedBankCode?.maskedValue || encryptedBankCode?.unencryptedValue)) || props.bankCodeError)) {
        isInvalid = true
        invalidFieldId = 'bank-code-field'
      } else if (props.isCrossBorder && (!internationalCode || props.internationalCodeError) && !internationalCodeEncrypted) {
        isInvalid = true
        invalidFieldId = 'int-bank-code-field'
      } else if (props.isCrossBorder && intermediaryBankRequired && !intermediaryBankName) {
        isInvalid = true
        invalidFieldId = 'intermediary-bank-name-field'
      } else if (props.isCrossBorder && intermediaryBankRequired
        && (!intermediaryBankAddress || isAddressInvalid(intermediaryBankAddress))) {
        isInvalid = true
        invalidFieldId = 'intermediary-bank-address-field'
      } else if (props.isCrossBorder && intermediaryBankRequired && (!intermediaryBankCode || props.intermediaryCodeError)) {
        isInvalid = true
        invalidFieldId = 'intermediary-bank-code-field'
      }
    }

    return isInvalid ? invalidFieldId : ''
  }

  function triggerValidations(invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function handleFormSubmit() {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit && selectedBankDetailIndex < 0) {
      props.onSubmit({ ...getFormData(), ...{ selectedExistingBankInfo: false } })
    } else if (selectedBankDetailIndex > -1 || getSelectedBankDetails() > -1) {
      const bankInfo = { ...getFormData().bankInformation, ...existingBankList[selectedBankDetailIndex], ...{ currencyCode: currencyCode, businessEmail: businessEmail } }
      const formData = { ...getFormData(), ...{ bankInformation: bankInfo }, ...{ selectedExistingBankInfo: true } }
      props.onSubmit(formData)
    }
  }

  function handleFormCancel() {
    setShowBankDetailForm(!showBankDetailForm)
    setEditingExistingForm(false)
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function handleInterBankKeyEntrySelection(selectedOption?: Option) {
    if (selectedOption) {
      setSelectedInternationalkeyOption(selectedOption)
      if (selectedOption?.path === "iban") {
        setOmitInternalAccountNUmber(true)
        setInternationalCodeEncrypted(true)
      } else {
        setOmitInternalAccountNUmber(false)
        setInternationalCodeEncrypted(false)
      }
    }
  }

  function fetchData(skipValidation?: boolean): BankInfoFormData {
    if (skipValidation) {
      return getFormData()
    } else if (selectedBankDetailIndex > -1 || getSelectedBankDetails() > -1) {
      const invalidFieldId = isRequiredFieldsInvalid()
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }
      const bankInfo = { ...getFormData().bankInformation, ...existingBankList[selectedBankDetailIndex], ...{ currencyCode: currencyCode, businessEmail: businessEmail } }
      const formData = { ...getFormData(), ...{ bankInformation: bankInfo, ...{ selectedExistingBankInfo: true } } }
      return invalidFieldId ? null : formData
    } else {
      const invalidFieldId = isFormInvalid()
      const formData = { ...getFormData(), ...{ selectedExistingBankInfo: false } }
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : formData
    }
  }


  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function onBankCountryChanged(value?: Option) {
    setEditingExistingForm(true)
    if (value && value?.path !== bankCountry?.path) {
      setBankCountry(value)
      const address = { ...getEmptyAddress(), alpha2CountryCode: (value as Option)?.path }
      handleFieldValueChange('bankAddress', bankAddress, address)
    } else if (!value) {
      const address = getEmptyAddress()
      setBankCountry(null)
      setBankAddress(null)
      handleFieldValueChange('bankAddress', bankAddress, address)
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields, props.formData, props.bankCodeError, props.internationalCodeError, props.intermediaryCodeError,
    businessEmail, currencyCode, bankName, accountHolder, accountHolderAddress, accountNumber, bankAddress, bankCountry,
    key, bankCode, encryptedBankCode, internationalKey, internationalCode, encryptedInternationalBankCode,
    intermediaryBankRequired, intermediaryBankName, intermediaryKey, intermediaryBankCode, instruction, selectedBankDetailIndex
  ])

  function handleAddNewBank(showBankForm: boolean) {
    setShowBankDetailForm(showBankForm)
    setSelectedExistingBankInfo(false)
  }

  function handleBankSelection(index: number) {
    setSelectedExistingBankInfo(true)
    setSelectedBankDetailIndex(index)
  }

  return (
    <div className={styles.supplierBankInfoForm}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="business-email-field">
            <OROEmailInput
              label={t("Accounts receivable email")}
              value={businessEmail}
              disabled={isFieldDisabled('businessEmail')}
              required={isFieldRequired('businessEmail')}
              forceValidate={forceValidate}
              validator={(value) => validateField('businessEmail', t("Email"), value)}
              onChange={value => { setBusinessEmail(value); handleFieldValueChange('businessEmail', businessEmail, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col2)} id="currency-field">
            <TypeAhead
              label={t("Payment/Remittance currency")}
              value={currencyCode}
              options={currencyOptions}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              expandLeft={props.isInPortal}
              validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Currency code") }) : ''}
              onChange={value => { setCurrencyCode(value); handleFieldValueChange('currencyCode', currencyCode, value) }}
            />
          </div>
        </div>
      </div>

      {showBankSelectionMethodOption &&
        <div className={classnames(styles.section, styles.existingBankListSection, showBankDetailForm ? styles.noBorder : '', showBankDetailForm ? styles.noMargin : '')}>
          <ExistingBankListing
            selectedIndex={selectedBankDetailIndex}
            onSelectAddNewBank={handleAddNewBank}
            supplierBankList={existingBankList}
            bankKeys={props.bankKeys}
            showBankDetailForm={showBankDetailForm}
            onSelectionOfExistingBank={handleBankSelection}
          />
        </div>}

      {showBankDetailForm && <>
        <div className={classnames(styles.section, (!bankAddress?.alpha2CountryCode) ? styles.noBorder : '')}>
          <div className={styles.title}>{t("Bank details")}</div>

          <div className={styles.row}>
            <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="bank-name-field">
              <TextBox
                label={t("Bank name")}
                value={bankName}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Bank name") }) : ''}
                onChange={value => { setBankName(value); handleFieldValueChange('bankName', bankName, value) }}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col2)} id="bank-Country-field">
              <TypeAhead
                label={t("Bank country")}
                placeholder={t("Select bank country")}
                value={(bankCountry) ? bankCountry : mapBankCountryToOption(mapBankAddress(bankAddress)?.alpha2CountryCode, props.countryOptions)}
                options={props.countryOptions}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Bank country") }) : ''}
                onChange={value => { onBankCountryChanged(value) }}
              />
            </div>
          </div>

          {props.isCrossBorder && <div className={styles.row}>
            <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="bank-address-field">
              <GoogleMultilinePlaceSearch
                id="bank-address"
                label={t("Bank address for payments")}
                value={bankAddress}
                countryOptions={props.countryOptions}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => validateAddressField(t("Bank address for payments"), value)}
                onChange={(value, countryChanged) => { setBankAddress(value); setEditingExistingForm(true); handleFieldValueChange('bankAddress', bankAddress, value) }}
                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
              />
            </div>
          </div>}
        </div>

        <div className={styles.section}>
          {bankAddress?.alpha2CountryCode &&
            <>
              <div className={styles.title}>{t("Account details")}</div>

              {!props.isCrossBorder && props.domesticKeyOptions && props.domesticKeyOptions.length > 0 && <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="bank-key-field">
                  {props.domesticKeyOptions && props.domesticKeyOptions.length > 0 && <div className={styles.customItem}>
                    <label className={styles.label}>{t("Select bank key")} <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === key)?.description} ><Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" /></Tooltip></label>
                    <DropdownControl
                      value={mapBankKeyToOption(key, props.domesticKeyOptions, props.bankKeys)}
                      options={props.domesticKeyOptions.map((option) => mapKeyLookupEntryToOption(option, props.bankKeys))}
                      classname={styles.bankKeyDropdown}
                      disableTypeahead={true}
                      onChange={handleKeyLookupEntrySelection}
                    />
                  </div>}
                </div>
              </div>}

              {!props.isCrossBorder &&
                <div className={styles.row}>
                  <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="bank-code-field">
                    {<label className={styles.label}>
                      {props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code")}
                      <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === key)?.description} ><Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" /></Tooltip>
                    </label>}
                    {!bankCodeEncrypted &&
                      <div className={styles.customItem}>
                        <TextBox
                          // label={
                          //   `${(props.domesticKeyOptions && props.domesticKeyOptions.length > 0)
                          //     ? (props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || 'Bank code')
                          //     : undefined} Number`
                          // }
                          value={bankCode}
                          disabled={false}
                          required={true}
                          forceValidate={props.bankCodeError || forceValidate}
                          validator={(value) => props.bankCodeError ?
                            getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code") })
                            : isEmpty(value) ? getI18Text("is required field", { label: t("Bank code") }) : ''}
                          onChange={value => { setBankCode(value); handleFieldValueChange('bankCode', bankCode, value, true) }}
                        />
                      </div>}
                    {bankCodeEncrypted &&
                      <EncryptedDataBox
                        // label={props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || 'Bank code'}
                        value={encryptedBankCode}
                        disabled={false}
                        required={true}
                        forceValidate={props.bankCodeError || forceValidate}
                        validator={(value) => props.bankCodeError ?
                          getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code") })
                          : isEmpty(value) ? getI18Text("is required field", { label: t("Bank code") }) : ''}
                        onChange={value => { setEncryptedBankCode(value); handleFieldValueChange('encryptedBankCode', encryptedBankCode, value, true) }}
                      />}
                  </div>
                </div>}

              {props.isCrossBorder && (internationalKey === "iban" || (previousBankCode === "iban" && bankAddress?.alpha2CountryCode === previousBankAddress?.alpha2CountryCode)) &&
                <div className={styles.row}>
                  <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="bank-key-options-field">
                    <label className={styles.label}>{t("Select bank key")}
                      <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === "iban")?.description} ><Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" /></Tooltip>
                    </label>
                    <DropdownControl
                      value={selectedInternationalkeyOption || mapStringToOption(internationalKey)}
                      options={internationalkeyOptions}
                      classname={styles.bankKeyDropdown}
                      disableTypeahead={true}
                      onChange={handleInterBankKeyEntrySelection}
                    />
                  </div>
                </div>}

              {props.isCrossBorder &&
                <div className={styles.row}>
                  <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="int-bank-code-field">
                    {(internationalKey !== "iban" && previousBankCode !== "iban") && <label className={styles.label}>
                      {props.bankKeys?.find(enumVal => enumVal.code === internationalKey)?.name || internationalKey || t("Swift")}
                      <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === internationalKey)?.description} ><Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" /></Tooltip>
                    </label>}
                    {(internationalKey === "iban" || (previousBankCode === "iban" && bankAddress?.alpha2CountryCode === previousBankAddress?.alpha2CountryCode)) && <label className={styles.label}>
                      {(props.bankKeys?.find(enumVal => enumVal.code === selectedInternationalkeyOption?.path)?.name || internationalKey || t("International bank code"))}
                      <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === selectedInternationalkeyOption?.path)?.description} ><Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" /></Tooltip>
                    </label>}
                    {!internationalCodeEncrypted &&
                      <TextBox
                        value={internationalCode}
                        disabled={false}
                        required={true}
                        forceValidate={props.internationalCodeError || forceValidate}
                        validator={(value) => props.internationalCodeError ?
                          getI18Text("is invalid", { label: (props.bankKeys?.find(enumVal => enumVal.code === selectedInternationalkeyOption?.path)?.name || internationalKey || t("International bank code")) })
                          : (isEmpty(value)) ? getI18Text("is required field", { label: t("International bank code") }) : ''}
                        onChange={value => { setInternationalCode(value); handleFieldValueChange('internationalCode', internationalCode, value, true) }}
                      />}
                    {internationalCodeEncrypted &&
                      <EncryptedDataBox
                        value={encryptedInternationalBankCode}
                        disabled={false}
                        required={true}
                        forceValidate={props.internationalCodeError || forceValidate}
                        validator={(value) => props.internationalCodeError ? `${(props.bankKeys?.find(enumVal => enumVal.code === selectedInternationalkeyOption?.path)?.name || internationalKey || 'International bank code')} is invalid.` : isEmpty(value) ? 'International bank code is a required field.' : ''}
                        onChange={value => { setEncryptedInternationalBankCode(value); if (selectedInternationalkeyOption?.path !== "iban") setInternationalCode(value?.unencryptedValue); handleFieldValueChange('encryptedInternationalBankCode', encryptedInternationalBankCode, value, true) }}
                      />}
                  </div>
                </div>}

              {((!omitAccountNumber && !props.isCrossBorder) || (props.isCrossBorder && !omitInternalAccountNUmber)) &&
                <div className={styles.row}>
                  <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="account-number-field">
                    <EncryptedDataBox
                      label={t("Account number")}
                      value={accountNumber}
                      disabled={false}
                      required={true}
                      forceValidate={forceValidate}
                      validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Bank account number") }) : ''}
                      onChange={value => { setAccountNumber(value); handleFieldValueChange('accountNumber', accountNumber, value) }}
                    />
                  </div>
                </div>}

              <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="account-holder-field">
                  <TextBox
                    label={t("Beneficiary name")}
                    value={accountHolder}
                    disabled={false}
                    required={true}
                    forceValidate={forceValidate}
                    validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Account name") }) : ''}
                    onChange={value => { setAccountHolder(value); handleFieldValueChange('accountHolder', accountHolder, value) }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="account-holder-address-field">
                  <GoogleMultilinePlaceSearch
                    id="account-holder-address"
                    label={t("Remittance address")}
                    value={accountHolderAddress}
                    countryOptions={props.countryOptions}
                    required={true}
                    forceValidate={forceValidate}
                    validator={(value) => validateAddressField('Remittance address', value)}
                    onChange={(value, countryChanged) => { setAccountHolderAddress(value); countryChanged && handleFieldValueChange('accountHolderAddress', accountHolderAddress, value) }}
                    parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)}>
                  <TextArea
                    label={t("Instructions")}
                    value={instruction}
                    onChange={value => { setInstruction(value); handleFieldValueChange('instruction', instruction, value) }}
                  />
                </div>
              </div>

              {!props.isCrossBorder &&
                <div className={classnames(styles.row, styles.actionBar)} >
                  <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3, styles.flex)}></div>
                  <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col1, styles.flex, styles.action)}>
                    {props.cancelLabel &&
                      <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
                    {props.submitLabel &&
                      <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
                  </div>
                </div>}
            </>}
        </div>

        {props.isCrossBorder &&
          <div className={styles.section}>
            <div className={styles.row}>
              <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id='sync-field'>
                <ToggleSwitch
                  label={t("FFC banking info")}
                  value={intermediaryBankRequired}
                  falsyLabel={getI18Text("No")}
                  truthyLabel={getI18Text("Yes")}
                  onChange={(value) => { setIntermediaryBankRequired(value); handleFieldValueChange('intermediaryBankRequired', intermediaryBankRequired, value) }}
                />
              </div>
            </div>

            {intermediaryBankRequired &&
              <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="intermediary-bank-name-field">
                  <TextBox
                    label={t("Intermediary bank name")}
                    value={intermediaryBankName}
                    disabled={false}
                    required={true}
                    forceValidate={forceValidate}
                    validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Intermediary bank name") }) : ''}
                    onChange={value => { setIntermediaryBankName(value); handleFieldValueChange('intermediaryBankName', intermediaryBankName, value) }}
                  />
                </div>
              </div>}

            {intermediaryBankRequired &&
              <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="intermediary-bank-address-field">
                  <GoogleMultilinePlaceSearch
                    id="intermediary-bank-address"
                    label={t("Intermediary bank address")}
                    value={intermediaryBankAddress}
                    countryOptions={props.countryOptions}
                    required={true}
                    forceValidate={forceValidate}
                    validator={(value) => validateAddressField(t("Intermediary bank address"), value)}
                    onChange={(value, countryChanged) => { setIntermediaryBankAddress(value); countryChanged && handleFieldValueChange('intermediaryBankAddress', intermediaryBankAddress, value) }}
                    parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                  />
                </div>
              </div>}

            {intermediaryBankRequired &&
              <div className={styles.row}>
                <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3)} id="intermediary-bank-code-field">
                  <TextBox
                    label={props.bankKeys?.find(enumVal => enumVal.code === intermediaryKey)?.name || intermediaryKey || t("Intermediary bank code")}
                    value={intermediaryBankCode}
                    disabled={false}
                    required={true}
                    forceValidate={props.intermediaryCodeError || forceValidate}
                    validator={(value) => props.intermediaryCodeError ?
                      getI18Text("is invalid", { label: t("Intermediary bank code") }) : isEmpty(value) ? getI18Text("is required field", { label: t("Intermediary bank code") }) : ''}
                    onChange={value => { setIntermediaryBankCode(value); handleFieldValueChange('intermediaryBankCode', intermediaryBankCode, value, true) }}
                  />
                </div>
              </div>}

            <div className={classnames(styles.row, styles.actionBar)} >
              <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col3, styles.flex)}></div>
              <div className={classnames(styles.item, props.isInPortal ? styles.col4 : styles.col1, styles.flex, styles.action)}>
                {props.cancelLabel &&
                  <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
                {props.submitLabel &&
                  <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
              </div>
            </div>
          </div>}
      </>}
    </div>
  )
}
