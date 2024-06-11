import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, Tooltip } from '@mui/material'

import { BankDocumentType, BankInfo, BankProofConfig, PaymentDetail, PaymentMode, PaymentModeConfig, PaymentModeType } from '../BankInfoV3'
import {
  COL2, COL3, COL4, areObjectsSame, getEmptyAddress, getFormFieldsMap, isAddressInvalid, isEmpty,
  isFieldDisabled, isFieldOmitted, isFieldRequired, mapBankAddress, mapStringToOption
} from '../util'
import { PaymentModeCard } from './paymentModeCard.component'
import { Address, Attachment, BankKey, EncryptedData, IntermediaryBankInfo, Option } from './../../Types'

import styles from '../BankInfoV3/style.module.scss'
import {
  ACCOUNT_HOLDER, ACCOUNT_HOLDER_ADDR, ACCOUNT_NUMBER, ACCOUNT_TYPE, ATTACHMENT, BANK_ADDRESS, BANK_CODE, BANK_DOUCUMENT,
  BANK_NAME, CHECK_DELIVERY_ADDRESS, COMPANY_ENTITIES, DOCUMENT_TYPE, INTERNATIONAL_CODE, INTREMEDIARY_ADDRESS, INTREMEDIARY_CODE,
  INTREMEDIARY_NAME, INTREMEDIARY_REQUIRED, IS_IBAN_AVAILABLE, NO_DETAILS_NEEDED, PAYMENT_ADDRESS, PAYMENT_MODES, REMITTANCE_ADDR,
  SWIFT_CODE, areAccountNamesSame, canDirectDebitMessage, canShowAccountHolderAddress, canShowAccountHolderName, canShowAccountNumber, canShowAccountType,
  canShowBankCode, canShowBankDocuments, canShowBankName, canShowCheckAddress, canShowIbanToggle, canShowIntermediaryBank,
  canShowInternationalCode, canShowPaymentAddress, canShowSwiftCode, canRespectSwiftCodeConfig, getInvalidPaymentField, mapToCountrySpecificModeType,
  mapToInternalModeType
} from './utils'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import { CountryBankKey, EnumsDataObject, Field, emptyEcncryptedData } from '../types'
import {
  EncryptedDataBox, GoogleMultilinePlaceSearch, Radio, TextBox,
  ToggleSwitch, TypeAhead, imageFileAcceptType, pdfFileAcceptType
} from '../../Inputs'
import { AlertCircle, Info } from 'react-feather'
import { Separator } from '../../controls/atoms'
import { getSignedUser, isValidSession } from '../../SigninService'
import { debounce } from '../../util'
import { BankDetails, getAccountTypeDisplayName } from './types'
import { AttachmentControlNew } from '../../controls'

export const configurableFields = [SWIFT_CODE, BANK_DOUCUMENT, REMITTANCE_ADDR]

interface AccountDetailsProps {
  mode: PaymentModeType
  paymentModeConfig: PaymentModeConfig[]
  bankCountry: Option
  data?: PaymentDetail
  companyEntityOptions: Option[]
  countryOptions: Option[]
  fields: Field[]
  partnerName: string
  partnerCurrency?: string
  bankKeys: EnumsDataObject[]
  bankProofConfig: BankProofConfig[]
  allowBankPayoutCurrencyRequest?: boolean
  bankCountryOptions?: Option[]
  getBankDetails: (bankCode: string, bankKey: BankKey, bankCountryCode?: string) => Promise<BankDetails[]>
  onReady: (fetchData: () => PaymentDetail) => void
  onPlaceSelectParseAddress: (data: google.maps.places.PlaceResult) => Promise<Address>
  loadDocument: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
  getCountryBankKeys: (bankCountry: string, currency?: string) => Promise<CountryBankKey>
  validateBankInfo: (bankInfo: BankInfo | IntermediaryBankInfo, validateInternational: boolean) => Promise<boolean>
  onCountryChange: () => void
  onValueChange: (fieldName: string, updatedForm: PaymentDetail, isAttachment?: boolean) => void
}

export function AccountDetails(props: AccountDetailsProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef(fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [forceValidateBankCode, setForceValidateBankCode] = useState<boolean>(false)
  const [forceValidateInternationalCode, setForceValidateInternationalCode] = useState<boolean>(false)
  const [forceValidateSwiftCode, setForceValidateSwiftCode] = useState<boolean>(false)
  const [forceValidateIntermediaryCode, setForceValidateIntermediaryCode] = useState<boolean>(false)
  const IS_IBAN_AVAILABLE_OPTIONS: Option[] = [
    { id: 'true', path: 'true', displayName: t('--iHaveIban--'), selectable: true },
    { id: 'false', path: 'false', displayName: t('--noIban--'), selectable: true }
  ]
  const BankProofDisplayNames = {
    bankletter: getI18Text('--bankletter--'),
    estatement: getI18Text('--estatement--'),
    letterhead: getI18Text('--letterhead--'),
    invoicewithbank: getI18Text('--invoicewithbank--'),
    voidcheck: getI18Text('--voidcheck--'),
    quotation: getI18Text('--quotation--'),
    contract: getI18Text('--contract--'),
    proformainvoice: getI18Text('--proformainvoice--'),
    blankinvoice: getI18Text('--blankinvoice--'),
    debitform: getI18Text('--debitform--'),
    banklettermex: getI18Text('--banklettermex--'),
    estatementmex: getI18Text('--estatementmex--'),
    iban: getI18Text('--iban--'),
    rib: getI18Text('--rib--'),
    bankpermitchina: getI18Text('--bankpermitchina--'),
    supplierbankletterchina: getI18Text('--supplierbankletterchina--'),
    bankconfirmation: getI18Text('--bankconfirmation--'),
    bankpassbook: getI18Text('--bankpassbook--')
  }

  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([])
  const [bankAddress, setBankAddress] = useState<Address>()
  const [companyEntities, setCompanyEntities] = useState<Option[]>([])

  const [isIbanAvailable, setIsIbanAvailable] = useState<boolean | undefined>()
  const [bankKeys, setBankKeys] = useState<CountryBankKey>()
  const [intermediaryBankRequired, setIntermediaryBankRequired] = useState<boolean>(false)
  const [documentTypeOptions, setDocumentTypeOptions] = useState<Option[]>([])

  const [bankName, setBankName] = useState<string>()
  const [bankNameAutoGenerated, setBankNameAutoGenerated] = useState<boolean>(false)
  const [accountHolder, setAccountHolder] = useState<string>()
  const [accountHolderAddress, setAccountHolderAddress] = useState<Address>(getEmptyAddress())
  const [paymentAddress, setPaymentAddress] = useState<EncryptedData>(emptyEcncryptedData)
  const [accountTypeOptions, setAccountTypeOptions] = useState<Option[]>([])
  const [accountTypeOption, setAccountTypeOption] = useState<Option>()
  const [accountNumber, setAccountNumber] = useState<EncryptedData>(emptyEcncryptedData)
  const [accountNumberAutoGenerated, setAccountNumberAutoGenerated] = useState<boolean>(false)
  const [keyOptions, setKeyOptions] = useState<Option[]>([])
  const [keyOption, setKeyOption] = useState<Option>()
  const [bankCode, setBankCode] = useState<string>('')
  const [bankCodeEncrypted, setBankCodeEncrypted] = useState<boolean>(false)
  const [encryptedBankCode, setEncryptedBankCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [bankCodeAutoGenerated, setBankCodeAutoGenerated] = useState<boolean>(false)
  const [bankCodeError, setBankCodeError] = useState<boolean>(false)
  const [internationalCode, setInternationalCode] = useState<string>('')
  const [internationalCodeEncrypted, setInternationalCodeEncrypted] = useState<boolean>(true) // It stores IBAN; always encrypted
  const [encryptedInternationalBankCode, setEncryptedInternationalBankCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [internationalCodeError, setInternationalCodeError] = useState<boolean>(false)
  const [swiftCode, setSwiftCode] = useState<string>('')
  const [swiftCodeAutoGenerated, setSwiftCodeAutoGenerated] = useState<boolean>(false)
  const [swiftCodeError, setSwiftCodeError] = useState<boolean>(false)
  const [checkDeliveryAddress, setCheckDeliveryAddress] = useState<Address>(getEmptyAddress())
  const [documentType, setDocumentType] = useState<Option>()
  const [attachment, setAttachment] = useState<Attachment>()
  const [intermediaryBankName, setIntermediaryBankName] = useState<string>('')
  const [intermediaryBankAddress, setIntermediaryBankAddress] = useState<Address>(getEmptyAddress())
  const [intermediaryKey, setIntermediaryKey] = useState<BankKey>('')
  const [intermediaryBankCode, setIntermediaryBankCode] = useState<string>('')
  const [intermediaryCodeError, setIntermediaryCodeError] = useState<boolean>(false)

  // Sync state from parent
  useEffect(() => {
    if (props.data) {
      if (props.data.bankInformation?.bankAddress?.alpha2CountryCode) {
        setBankAddress(mapBankAddress(props.data.bankInformation?.bankAddress))
      }
      setCompanyEntities(props.data.companyEntities || [])

      setBankName(props.data.bankInformation?.bankName || '')
      setBankNameAutoGenerated(props.data.bankInformation?.bankNameAutoGenerated || false)
      setAccountHolder(props.data.bankInformation?.accountHolder || props.partnerName || '')
      setAccountHolderAddress(props.data.bankInformation?.accountHolderAddress || getEmptyAddress())
      setPaymentAddress(props.data.bankInformation?.paymentAddress || emptyEcncryptedData)
      setAccountTypeOption(props.data.bankInformation?.accountType ? mapStringToOption(props.data.bankInformation.accountType) : undefined)
      setAccountNumber(props.data.bankInformation?.accountNumber || emptyEcncryptedData)
      setAccountNumberAutoGenerated(props.data.bankInformation?.accountNumberAutoGenerated || false)

      setKeyOption(props.data.bankInformation?.key ? mapStringToOption(props.data.bankInformation.key) : undefined)
      setBankCode(props.data.bankInformation?.bankCode || '')
      setEncryptedBankCode(props.data.bankInformation?.encryptedBankCode || emptyEcncryptedData)
      if (props.data.bankInformation?.encryptedBankCode?.maskedValue) {
        setBankCodeEncrypted(true)
      }
      setBankCodeAutoGenerated(props.data.bankInformation?.bankCodeAutoGenerated)
      setBankCodeError(props.data.bankInformation?.bankCodeError)

      setInternationalCode(props.data.bankInformation?.internationalCode || '')
      if (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) {
        setInternationalCodeEncrypted(true)
        if (!props.data.bankInformation?.internationalCode) {
          setInternationalCode(props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)
        }
      }
      setEncryptedInternationalBankCode(props.data.bankInformation?.encryptedInternationalBankCode)
      setInternationalCodeError(props.data.bankInformation?.internationalCodeError)

      setSwiftCode(props.data?.bankInformation?.swiftCode || '')
      setSwiftCodeAutoGenerated(props.data.bankInformation?.swiftCodeAutoGenerated || false)
      setSwiftCodeError(props.data?.bankInformation?.swiftCodeError)

      setCheckDeliveryAddress(props.data.bankInformation?.checkDeliveryAddress || getEmptyAddress())

      setIsIbanAvailable(props.data?.bankInformation?.isIbanAvailable)

      setDocumentType(props.data.documentType ? mapStringToOption(props.data.documentType) : undefined)
      setAttachment(props.data.attachment)

      setIntermediaryBankRequired(props.data.intermediaryBankRequired || false)
      if (props.data.intermediaryBankInformation) {
        setIntermediaryBankName(props.data.intermediaryBankInformation.bankName)
        setIntermediaryBankAddress(props.data.intermediaryBankInformation.bankAddress)
        setIntermediaryKey(props.data.intermediaryBankInformation.key)
        setIntermediaryBankCode(props.data.intermediaryBankInformation.bankCode)
        setIntermediaryCodeError(props.data.intermediaryBankInformation.bankCodeError)
      }
    }
  }, [props.data])

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, configurableFields))
    }
  }, [props.fields])

  // generate applicable payment modes
  useEffect(() => {
    if (props.mode && props.paymentModeConfig && (props.paymentModeConfig.length > 0) && props.bankCountry && (companyEntities.length > 0)) {
      // Available payment types
      const _paymentModeConfig: { [country: string]: { domestic: PaymentModeType[], international: PaymentModeType[] } } = {}
      if (props.paymentModeConfig) {
        props.paymentModeConfig.forEach(config => {
          const domesticModes = (config.domestic || []).map(mapToInternalModeType)
          const internationalModes = (config.international || []).map(mapToInternalModeType)

          _paymentModeConfig[config.alpha2Code] = {
            domestic: domesticModes,
            international: internationalModes,
          }
        })
      }

      const parsedCountries = {}
      const _paymentModes: PaymentMode[] = []
      companyEntities.filter(entity => {
        return props.companyEntityOptions?.some(option => option.path === entity.path)
      }).forEach(entity => {
        const entityOption = props.companyEntityOptions?.find(option => option.path === entity.path)
        const entityCountry = entityOption.customData?.other?.countryCode
        const entityCurrency = entityOption.customData?.other?.currencyCode

        const configForEntity = _paymentModeConfig[entityCountry] || _paymentModeConfig['default'] || { domestic: [], international: [] }
        const isEntityDomestic = entityCountry === bankAddress?.alpha2CountryCode
        const availableModeOptions = isEntityDomestic ? configForEntity.domestic : configForEntity.international

        const existingCurrencySelection = props.data?.paymentModes?.find(mode => mode.companyEntityCountry === entityCountry)?.currencyCode
        const existingModeTypeSelection = props.data?.paymentModes?.find(mode => mode.companyEntityCountry === entityCountry)?.type
        const isExistingModeTypeSelectionAvailable = availableModeOptions.some(option => option === existingModeTypeSelection)
        const existingAdditionalCurrency = props.data?.paymentModes?.find(mode => mode.companyEntityCountry === entityCountry)?.additionalCurrencyRequested

        if (!parsedCountries[entityCountry]) {
          _paymentModes.push({
            companyEntityCountry: entityCountry,
            type: (isExistingModeTypeSelectionAvailable && existingModeTypeSelection && mapToInternalModeType(existingModeTypeSelection)) || props.mode,
            currencyCode: existingCurrencySelection || props.partnerCurrency || entityCurrency,
            additionalCurrencyRequested: existingAdditionalCurrency || ''
          })
          parsedCountries[entityCountry] = true
        }
      })

      setPaymentModes(_paymentModes)
    } else {
      setPaymentModes([])
    }
  }, [props.data, props.paymentModeConfig, props.mode, props.bankCountry, props.partnerCurrency, companyEntities])

  useEffect(() => {
    const address = { ...getEmptyAddress(), alpha2CountryCode: (props.bankCountry as Option)?.path }
    setBankAddress(address)
  }, [props.bankCountry])

  useEffect(() => {
    setCompanyEntities(props.companyEntityOptions)
  }, [props.companyEntityOptions])

  // Update key options
  useEffect(() => {
    if (props.bankCountry?.path && props.getCountryBankKeys) {
      props.getCountryBankKeys(props.bankCountry?.path)
        .then(res => {
          setBankKeys(res)

          const _accTypeOptions = res.accountTypes?.map(type => {
            return {
              id: type,
              path: type,
              displayName: getAccountTypeDisplayName(type),
              selectable: true
            }
          }) || []
          setAccountTypeOptions(_accTypeOptions)
          if (!accountTypeOption && (_accTypeOptions.length > 0)) {
            setAccountTypeOption(_accTypeOptions[0])
          }

          if (res.domesticList && res.domesticList.length === 1) {
            const key = res.domesticList[0]
            setKeyOption({
              id: key,
              path: key,
              displayName: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code"),
              selectable: true
            })
          }
          const _keyOptions = res.domesticList?.map(key => {
            return {
              id: key,
              path: key,
              displayName: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code"),
              selectable: true
            }
          }) || []
          setKeyOptions(_keyOptions)
          if (!keyOption && (_keyOptions.length > 0)) {
            setKeyOption(_keyOptions[0])
          }
        })
        .catch(err => {
          console.warn('Error fetching bank keys. ', err)
        })
    }
  }, [props.bankCountry])

  // Update intermediary bank key
  useEffect(() => {
    if (intermediaryBankAddress?.alpha2CountryCode && props.getCountryBankKeys) {
      props.getCountryBankKeys(intermediaryBankAddress?.alpha2CountryCode)
        .then(res => {
          setIntermediaryKey(res.domestic)
        })
        .catch(err => {
          console.warn('Error fetching intermediary bank key. ', err)
        })
    }
  }, [intermediaryBankAddress])

  // update bank proof options
  useEffect(() => {
    let _docTypeOptions: Option[] = []
    if (isValidSession() && (getSignedUser()?.tenantId === 'ping_identity' || getSignedUser()?.tenantId === 'ping_identity_sandbox')) {
      const defaultDocumentOption = {
        id: 'bankletter',
        path: 'bankletter',
        displayName: BankProofDisplayNames.bankletter,
        selectable: true
      }
      _docTypeOptions = [defaultDocumentOption]
    } else if (props.bankProofConfig && (props.bankProofConfig.length > 0) && props.bankCountry) {
      const applicableDocuments = props.bankProofConfig.find(config => config.alpha2Code === props.bankCountry?.path)?.documents || []
      _docTypeOptions = applicableDocuments.map(doc => {
        return {
          id: doc as string,
          path: doc as string,
          displayName: BankProofDisplayNames[doc],
          selectable: true
        }
      })
    }
    setDocumentTypeOptions(_docTypeOptions)

    if (_docTypeOptions.length === 1) {
      setDocumentType(_docTypeOptions[0])
    }
  }, [props.bankProofConfig, props.bankCountry])

  function dispatchValidateBankInfo(bankInfo: BankInfo | IntermediaryBankInfo, validateInternational: boolean, callback: Function) {
    if (props.validateBankInfo) {
      props.validateBankInfo(bankInfo, validateInternational)
        .then(isValid => {
          callback(null, isValid)
        })
        .catch(err => {
          callback(err)
        })
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedValidateBankInfo = useMemo(() => debounce(dispatchValidateBankInfo, 1500), [])

  // Validate bank codes
  useEffect(() => {
    if (props.validateBankInfo) {
      debouncedValidateBankInfo(getFormData().bankInformation, false, function (err, res?) {
        if (err) {
          console.warn('Error validating domestic bank info. ', err)
          return
        }
        setBankCodeError(!res)
      })
    }
  }, [bankCode, encryptedBankCode])
  useEffect(() => {
    if (props.validateBankInfo) {
      debouncedValidateBankInfo(getFormData().bankInformation, true, function (err, res?) {
        if (err) {
          console.warn('Error validating international bank info. ', err)
          return
        }
        setInternationalCodeError(!res)
      })
    }
  }, [internationalCode, encryptedInternationalBankCode])
  useEffect(() => {
    if (props.validateBankInfo) {
      const bankInfo: BankInfo = getFormData().bankInformation || {}
      const bankInformationCopy: BankInfo = {
        ...bankInfo,
        internationalKey: 'swift',
        internationalCode: bankInfo.swiftCode,
        encryptedInternationalBankCode: undefined
      }
      debouncedValidateBankInfo(bankInformationCopy, true, function (err, res?) {
        if (err) {
          console.warn('Error validating swift code info. ', err)
          return
        }
        setSwiftCodeError(!res)
      })
    }
  }, [swiftCode])
  useEffect(() => {
    if (props.validateBankInfo) {
      debouncedValidateBankInfo(getFormData().intermediaryBankInformation, false, function (err, res?) {
        if (err) {
          console.warn('Error validating intermediary bank info. ', err)
          return
        }
        setIntermediaryCodeError(!res)
      })
    }
  }, [intermediaryBankCode])

  function getBankDetails(code: string, key: BankKey, bankCountryCode: string) {
    props.getBankDetails(code, key, bankCountryCode)
      .then((res: BankDetails[]) => {
        if (res && res.length > 0) {
          const bankDetail = res[0]
          if (
            bankDetail?.code && (!bankCode || bankCodeAutoGenerated)
            // && canShowBankCode({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys })
          ) {
            setBankCode(bankDetail.code)
            setBankCodeAutoGenerated(true)
          }
          if (
            bankDetail?.name && (!bankName || bankNameAutoGenerated)
            // && canShowBankName({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys })
          ) {
            setBankName(bankDetail.name)
            setBankNameAutoGenerated(true)
          }
          if (
            bankDetail?.accountNumber && (!(accountNumber?.maskedValue || accountNumber?.unencryptedValue) || accountNumberAutoGenerated)
            // && canShowAccountNumber({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys })
          ) {
            setAccountNumber({ ...emptyEcncryptedData, unencryptedValue: bankDetail.accountNumber, maskedValue: '' })
            setAccountNumberAutoGenerated(true)
          }
          if (
            bankDetail?.swift && (!swiftCode || swiftCodeAutoGenerated)
            // && (canShowSwiftCode({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) ||
            //     (canRespectSwiftCodeConfig({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) && !isFieldOmitted(fieldMap, SWIFT_CODE)))
          ) {
            setSwiftCode(bankDetail.swift)
            setSwiftCodeAutoGenerated(true)
          }
        }
      })
      .catch(err => {
        console.log('getBankDetails: Could not fetch bank details: ', err)
      })
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedGetBankDetails = useMemo(
    () => debounce(getBankDetails),
    [
      bankCode, encryptedBankCode, bankCodeAutoGenerated, bankName, bankNameAutoGenerated, accountNumber, accountNumberAutoGenerated, swiftCode, swiftCodeAutoGenerated,
      paymentModes, bankAddress, isIbanAvailable, bankKeys
    ]
  )

  useEffect(() => {
    if (bankCode && keyOption?.path && bankAddress?.alpha2CountryCode) {
      debouncedGetBankDetails(bankCode, keyOption.path as BankKey, bankAddress.alpha2CountryCode)
    }
  }, [bankCode, keyOption, bankAddress])
  useEffect(() => {
    if (encryptedInternationalBankCode?.unencryptedValue) {
      debouncedGetBankDetails(encryptedInternationalBankCode?.unencryptedValue, 'iban', bankAddress.alpha2CountryCode)
    }
  }, [encryptedInternationalBankCode, bankAddress])

  function triggerValidations(invalidFieldId?: string) {
    setForceValidate(true)
    // TODO: scroll to invalidFieldId
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }
  function triggerBankCodeValidations() {
    setForceValidateBankCode(true)
    setTimeout(() => {
      setForceValidateBankCode(false)
    }, 1000)
  }
  function triggerInternationalCodeValidations() {
    setForceValidateInternationalCode(true)
    setTimeout(() => {
      setForceValidateInternationalCode(false)
    }, 1000)
  }
  function triggerSwiftCodeValidations() {
    setForceValidateSwiftCode(true)
    setTimeout(() => {
      setForceValidateSwiftCode(false)
    }, 1000)
  }
  function triggerIntermediaryCodeValidations() {
    setForceValidateInternationalCode(true)
    setTimeout(() => {
      setForceValidateInternationalCode(false)
    }, 1000)
  }

  useEffect(() => {
    if (bankCodeError || bankCode || encryptedBankCode?.maskedValue || encryptedBankCode?.unencryptedValue) {
      triggerBankCodeValidations()
    }
  }, [bankCodeError])
  useEffect(() => {
    if (internationalCodeError || internationalCode || encryptedInternationalBankCode?.maskedValue || encryptedInternationalBankCode?.unencryptedValue) {
      triggerInternationalCodeValidations()
    }
  }, [internationalCodeError])
  useEffect(() => {
    if (swiftCodeError || swiftCode) {
      triggerSwiftCodeValidations()
    }
  }, [swiftCodeError])
  useEffect(() => {
    if (intermediaryCodeError || intermediaryBankCode) {
      triggerIntermediaryCodeValidations()
    }
  }, [intermediaryCodeError])

  function getBankCurrency(): string | undefined {
    const bankCountryCode = props.bankCountry?.path || bankAddress?.alpha2CountryCode
    const bankCountryOption = props.countryOptions?.find(countryOption => countryOption.path === bankCountryCode)
    return bankCountryOption?.customData?.other?.currencyCode
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
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
  function validateCheckAddress (value: Address): string {
    const invalidAddressError = validateAddressField(t("--checkDeliveryAddress--"), value)

    if (invalidAddressError) {
      return invalidAddressError
    }

    if (value?.alpha2CountryCode !== bankAddress?.alpha2CountryCode) {
      return t('--addressCannotBeDifferentFromBankCountry--')
    }

    return ''
  }

  function loadFile(fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function handleCurrencyRequest(currency?: string) {
    setPaymentModes(paymentModes.map(mode => {
      return {
        ...mode,
        additionalCurrencyRequested: currency
      }
    }))
  }
  
  function getPaymentModes (): PaymentMode[] {
    return paymentModes.map(mode => {
      return {
        ...mode,
        type: mapToCountrySpecificModeType(mode.type, bankAddress?.alpha2CountryCode, mode.companyEntityCountry, props.paymentModeConfig)
      }
    })
  }

  function getFormData(): PaymentDetail {
    return {
      id: props.data?.id,
      companyEntities,
      paymentModes: getPaymentModes(),
      bankInformation: {
        bankAddress,
        bankName,
        bankNameAutoGenerated,
        accountHolder,
        accountHolderAddress,
        accountType: accountTypeOption?.path,
        accountNumber,
        accountNumberAutoGenerated,
        paymentAddress,
        key: (keyOption) ? keyOption.path as BankKey : '',
        bankCode: (!bankCodeEncrypted) ? bankCode : '',
        encryptedBankCode: (bankCodeEncrypted) ? encryptedBankCode : undefined,
        bankCodeAutoGenerated,
        bankCodeError,
        internationalKey: 'iban',
        internationalCode: (!internationalCodeEncrypted) ? internationalCode : '',
        encryptedInternationalBankCode: (internationalCodeEncrypted) ? encryptedInternationalBankCode : emptyEcncryptedData,
        internationalCodeError,
        swiftCode: swiftCode,
        swiftCodeAutoGenerated,
        swiftCodeError,
        checkDeliveryAddress,
        isIbanAvailable
      },
      intermediaryBankRequired,
      intermediaryBankInformation: (intermediaryBankRequired) ? {
        bankName: intermediaryBankName,
        bankAddress: intermediaryBankAddress,
        key: intermediaryKey,
        bankCode: intermediaryBankCode,
        bankCodeError: intermediaryCodeError
          }
        : null,
      documentType: (documentType?.path as BankDocumentType) || undefined,
      attachment,
      bankKeys
    }
  }

  function getFormDataWithUpdatedValue(fieldName: string, newValue: File): PaymentDetail {
    const formData = JSON.parse(JSON.stringify(getFormData())) as PaymentDetail

    switch (fieldName) {
      case ATTACHMENT:
        formData.attachment = newValue as File
        break
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: Attachment,
    newValue: File
  ) {
    if (props.onValueChange) {
      if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          true
        )
      }
    }
  }

  const applicableFields = {
    [BANK_ADDRESS]: true,
    [COMPANY_ENTITIES]: props.companyEntityOptions && props.companyEntityOptions.length > 1,
    [PAYMENT_MODES]: companyEntities && companyEntities.length > 0,

    separator1: true,
    [IS_IBAN_AVAILABLE]: canShowIbanToggle({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [BANK_CODE]: canShowBankCode({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [INTERNATIONAL_CODE]: canShowInternationalCode({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [ACCOUNT_TYPE]: canShowAccountType({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [ACCOUNT_NUMBER]: canShowAccountNumber({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [PAYMENT_ADDRESS]: canShowPaymentAddress({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [ACCOUNT_HOLDER]: canShowAccountHolderName({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [ACCOUNT_HOLDER_ADDR]: !isFieldOmitted(fieldMap, REMITTANCE_ADDR) &&
      canShowAccountHolderAddress({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [BANK_NAME]: canShowBankName({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [CHECK_DELIVERY_ADDRESS]: canShowCheckAddress({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [SWIFT_CODE]: canShowSwiftCode({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) ||
      (canRespectSwiftCodeConfig({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) && !isFieldOmitted(fieldMap, SWIFT_CODE)),

    separator2: !isFieldOmitted(fieldMap, BANK_DOUCUMENT) &&
      canShowBankDocuments({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [DOCUMENT_TYPE]: !isFieldOmitted(fieldMap, BANK_DOUCUMENT) &&
      documentTypeOptions && (documentTypeOptions.length > 1) && canShowBankDocuments({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [ATTACHMENT]: !isFieldOmitted(fieldMap, BANK_DOUCUMENT) &&
      canShowBankDocuments({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),

    separator3: canShowIntermediaryBank({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [INTREMEDIARY_REQUIRED]: canShowIntermediaryBank({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }),
    [INTREMEDIARY_NAME]: canShowIntermediaryBank({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) && intermediaryBankRequired,
    [INTREMEDIARY_ADDRESS]: canShowIntermediaryBank({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) && intermediaryBankRequired,
    [INTREMEDIARY_CODE]: canShowIntermediaryBank({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) && intermediaryBankRequired,

    [NO_DETAILS_NEEDED]: canDirectDebitMessage({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys })
  }

  function getBankNameComponent() {
    return (<>
      {applicableFields[BANK_NAME] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="bank-name-field" ref={(node) => storeRef(BANK_NAME, node)}>
            <TextBox
              label={t("Bank name")}
              value={bankName}
              disabled={false}
              required={true}
              forceValidate={forceValidate || bankNameAutoGenerated}
              validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Bank name") }) : ''}
              onChange={value => { setBankName(value); setBankNameAutoGenerated(false) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getAccHolderComponent() {
    return (<>
      {applicableFields[ACCOUNT_HOLDER] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="account-holder-field" ref={(node) => storeRef(ACCOUNT_HOLDER, node)}>
            <TextBox
              label={t("--nameOnTheAccount--")}
              value={accountHolder}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              warning={accountHolder && (accountHolder !== props.partnerName)}
              validator={(value) => isEmpty(value)
                ? getI18Text("is required field", { label: t("--nameOnTheAccount--") })
                : (props.partnerName && !areAccountNamesSame(value, props.partnerName) ? t('--doesNotMatchCompanyName--', { company: props.partnerName }) : '')}
              onChange={value => { setAccountHolder(value) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getAccHolderAddressComponent() {
    return (<>
      {applicableFields[ACCOUNT_HOLDER_ADDR] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="account-holder-address-field" ref={(node) => storeRef(ACCOUNT_HOLDER_ADDR, node)}>
            <GoogleMultilinePlaceSearch
              id={`${ACCOUNT_HOLDER_ADDR}-new`}
              label={t("--addressOnAccount--")}
              value={accountHolderAddress}
              countryOptions={props.countryOptions}
              required={isFieldRequired(fieldMap, REMITTANCE_ADDR)}
              forceValidate={forceValidate}
              absolutePosition
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
              validator={(value) => isFieldRequired(fieldMap, REMITTANCE_ADDR) ? validateAddressField(t("--addressOnAccount--"), value) : ''}
              onChange={(value, countryChanged) => { setAccountHolderAddress(value) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getAccNumberComponent() {
    return (<>
      {applicableFields[ACCOUNT_NUMBER] &&
        <>
          {(accountTypeOptions.length > 1)
            ? <>
              <Grid item md={COL2} xs={COL4}>
                <TypeAhead
                  label={t("--accountType--")}
                  value={accountTypeOption}
                  options={accountTypeOptions}
                  required={true}
                  forceValidate={forceValidate}
                  absolutePosition
                  validator={(value) => (isEmpty(value)) ? getI18Text("is required field", { label: t("--accountType--") }) : ''}
                  onChange={value => { setAccountTypeOption(value) }}
                />
              </Grid>
              <Grid item md={COL2} xs={COL4}>
                <div data-testid="account-number-field" ref={(node) => storeRef(ACCOUNT_NUMBER, node)}>
                  <EncryptedDataBox
                    label={t("Account number")}
                    value={accountNumber}
                    disabled={false}
                    required={true}
                    forceValidate={forceValidate || accountNumberAutoGenerated}
                    validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Account number") }) : ''}
                    onChange={value => { setAccountNumber(value); setAccountNumberAutoGenerated(false) }}
                  />
                </div>
              </Grid>
            </>
            : <>
              <Grid item md={COL4} xs={COL4}>
                <div data-testid="account-number-field" ref={(node) => storeRef(ACCOUNT_NUMBER, node)}>
                  <EncryptedDataBox
                    label={t("Account number")}
                    value={accountNumber}
                    disabled={false}
                    required={true}
                    forceValidate={forceValidate || accountNumberAutoGenerated}
                    validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Account number") }) : ''}
                    onChange={value => { setAccountNumber(value); setAccountNumberAutoGenerated(false) }}
                  />
                </div>
              </Grid>
            </>}
        </>}
    </>)
  }

  function getPaymentAddressComponent() {
    return (<>
      {applicableFields[PAYMENT_ADDRESS] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="payment-address-field" ref={(node) => storeRef(PAYMENT_ADDRESS, node)}>
            <EncryptedDataBox
              label={"Bankgiro"} // Use country specific names
              value={paymentAddress}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: "Bankgiro" }) : ''}
              onChange={value => { setPaymentAddress(value) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getIsIbanAvailableComponent() {
    return (<>
      {applicableFields[IS_IBAN_AVAILABLE] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="is-iban-available-field" ref={(node) => storeRef(IS_IBAN_AVAILABLE, node)}>
            <Radio
              name='is-iban-available'
              id='is-iban-available'
              label={t("--doYouWishToProvideIban--")}
              value={isIbanAvailable !== undefined ? mapStringToOption(isIbanAvailable.toString()) : undefined}
              options={IS_IBAN_AVAILABLE_OPTIONS}
              forceValidate={forceValidate}
              required={true}
              showHorizontal={true}
              validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: 'This' }) : ''}
              onChange={value => setIsIbanAvailable(value?.path ? (value.path === 'true') : undefined)}
            />
          </div>
        </Grid>}
    </>)
  }

  function getBankCodeComponent() {
    return (<>
      {applicableFields[BANK_CODE] &&
        <>
          {(keyOptions.length > 1)
            ? <>
              <Grid item md={COL2} xs={COL4}>
                <TypeAhead
                  label={t("Bank code")}
                  value={keyOption}
                  options={keyOptions}
                  required={true}
                  forceValidate={forceValidate}
                  absolutePosition
                  validator={(value) => (isEmpty(value)) ? getI18Text("is required field", { label: t("Bank code") }) : ''}
                  onChange={value => { setKeyOption(value) }}
                />
              </Grid>
              <Grid item md={COL2} xs={COL4}>
                <div data-testid="bank-code-field" ref={(node) => storeRef(BANK_CODE, node)}>
                  <label className={styles.label}>
                    {props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code")}
                    {props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.description &&
                      <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.description}>
                        <Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" />
                      </Tooltip>}
                  </label>
                  {!bankCodeEncrypted &&
                    <TextBox
                      value={bankCode}
                      disabled={false}
                      required={true}
                      forceValidate={forceValidate || forceValidateBankCode || bankCodeAutoGenerated}
                      validator={(value) => bankCodeError
                        ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") })
                        : (isEmpty(value) ? getI18Text("is required field", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") }) : '')}
                      onChange={value => { setBankCode(value); setBankCodeAutoGenerated(false) }}
                    />}
                  {bankCodeEncrypted &&
                    <EncryptedDataBox
                      value={encryptedBankCode}
                      disabled={false}
                      required={true}
                      forceValidate={forceValidate || forceValidateBankCode || bankCodeAutoGenerated}
                      validator={(value) => bankCodeError
                        ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") })
                        : (isEmpty(value) ? getI18Text("is required field", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") }) : '')}
                      onChange={value => { setEncryptedBankCode(value); setBankCodeAutoGenerated(false) }}
                    />}
                </div>
              </Grid>
            </>
            : <>
              <Grid item md={COL4} xs={COL4}>
                <div data-testid="bank-code-field" ref={(node) => storeRef(BANK_CODE, node)}>
                  <label className={styles.label}>
                    {props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code")}
                    {props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.description &&
                      <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.description}>
                        <Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" />
                      </Tooltip>}
                  </label>
                  {!bankCodeEncrypted &&
                    <TextBox
                      value={bankCode}
                      disabled={false}
                      required={true}
                      forceValidate={forceValidate || forceValidateBankCode}
                      validator={(value) => bankCodeError
                        ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") })
                        : (isEmpty(value) ? getI18Text("is required field", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") }) : '')}
                      onChange={value => { setBankCode(value) }}
                    />}
                  {bankCodeEncrypted &&
                    <EncryptedDataBox
                      value={encryptedBankCode}
                      disabled={false}
                      required={true}
                      forceValidate={forceValidate || forceValidateBankCode}
                      validator={(value) => bankCodeError
                        ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") })
                        : (isEmpty(value) ? getI18Text("is required field", { label: props.bankKeys?.find(enumVal => enumVal.code === keyOption?.path)?.name || keyOption?.path || t("Bank code") }) : '')}
                      onChange={value => { setEncryptedBankCode(value) }}
                    />}
                </div>
              </Grid>
            </>}
        </>}
    </>)
  }

  function getInternationalCodeComponent() {
    return (<>
      {applicableFields[INTERNATIONAL_CODE] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="int-bank-code-field" ref={(node) => storeRef(INTERNATIONAL_CODE, node)}>
            <label className={styles.label}>
              {(props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.name || 'IBAN')}
              {props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.description &&
                <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.description} >
                  <Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)" />
                </Tooltip>}
            </label>
            {!internationalCodeEncrypted &&
              <TextBox
                value={internationalCode}
                disabled={false}
                required={true}
                forceValidate={forceValidate || forceValidateInternationalCode}
                validator={(value) => internationalCodeError
                  ? getI18Text("is invalid", { label: (props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.name || 'IBAN') })
                  : (isEmpty(value)) ? getI18Text("is required field", { label: props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.name || 'IBAN' }) : ''}
                onChange={value => { setInternationalCode(value) }}
              />}
            {internationalCodeEncrypted &&
              <EncryptedDataBox
                value={encryptedInternationalBankCode}
                disabled={false}
                required={true}
                forceValidate={forceValidate || forceValidateInternationalCode}
                validator={(value) => internationalCodeError
                  ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.name || 'IBAN' })
                  : (isEmpty(value) ? getI18Text("is required field", { label: props.bankKeys?.find(enumVal => enumVal.code === 'iban')?.name || 'IBAN' }) : '')}
                onChange={value => { setEncryptedInternationalBankCode(value) }}
              />}
          </div>
        </Grid>}
    </>)
  }

  function getSwiftCodeComponent() {
    return (<>
      {applicableFields[SWIFT_CODE] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="swift-code-field" ref={(node) => storeRef(SWIFT_CODE, node)}>
            <TextBox
              label={props.bankKeys?.find(enumVal => enumVal.code === 'swift')?.name || 'SWIFT'}
              value={swiftCode}
              required={!canRespectSwiftCodeConfig({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) || isFieldRequired(fieldMap, SWIFT_CODE)}
              forceValidate={forceValidate || swiftCodeAutoGenerated || forceValidateSwiftCode}
              validator={(value) => (canRespectSwiftCodeConfig({ paymentModes, bankInformation: { bankAddress, isIbanAvailable }, bankKeys }) && !isFieldRequired(fieldMap, SWIFT_CODE))
                ? ''
                : (swiftCodeError
                  ? getI18Text("is invalid", { label: 'SWIFT' })
                  : isEmpty(value) ? getI18Text("is required field", { label: 'SWIFT' }) : '')}
              onChange={value => { setSwiftCode(value); setSwiftCodeAutoGenerated(false) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getCheckAddressComponent() {
    return (<>
      {applicableFields[CHECK_DELIVERY_ADDRESS] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="check-delivery-address-field" ref={(node) => storeRef(CHECK_DELIVERY_ADDRESS, node)}>
            <GoogleMultilinePlaceSearch
              id={`${CHECK_DELIVERY_ADDRESS}-new`}
              label={t("--checkDeliveryAddress--")}
              value={checkDeliveryAddress}
              countryOptions={props.countryOptions}
              required={true}
              forceValidate={forceValidate}
              absolutePosition
              validator={validateCheckAddress}
              onChange={(value, countryChanged) => { setCheckDeliveryAddress(value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </Grid>}
    </>)
  }

  function getDocumentComponent() {
    return (<>
      {applicableFields['separator2'] && <>
        <Grid item xs={COL4}>
          <Separator secondary />
        </Grid>

        <Grid item xs={COL4}>
          <div className={styles.title}>
            {t("--bankDoucumentForValidation--")}
          </div>
        </Grid>
      </>}

      {/* For existing, SHOW if documentType not available */}
      {applicableFields[DOCUMENT_TYPE] &&
        <Grid item md={COL3} xs={COL4}>
          <div data-testid="ducument-type-field" ref={(node) => storeRef(DOCUMENT_TYPE, node)}>
            <TypeAhead
              label={t("--selectProofOfDucumentForBank--")}
              value={documentType}
              options={documentTypeOptions}
              disabled={false}
              required={isFieldRequired(fieldMap, BANK_DOUCUMENT)}
              forceValidate={forceValidate}
              absolutePosition
              validator={(value) => (isFieldRequired(fieldMap, BANK_DOUCUMENT) && isEmpty(value)) ? getI18Text("is required field", { label: t("--documentType--") }) : ''}
              onChange={value => { setDocumentType(value) }}
            />
          </div>
        </Grid>}

      {/* For existing, SHOW if attachment not available */}
      {applicableFields[ATTACHMENT] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="attachment-field" ref={(node) => storeRef(ATTACHMENT, node)}>
            <AttachmentControlNew
              value={attachment}
              config={{
                fieldName: ATTACHMENT,
                optional: !isFieldRequired(fieldMap, BANK_DOUCUMENT),
                fileTypes: [pdfFileAcceptType, imageFileAcceptType],
                forceValidate: forceValidate,
              }}
              dataFetchers={{
                getDocumentByName: loadFile
              }}
              validator={(value) => (isFieldRequired(fieldMap, BANK_DOUCUMENT) && isEmpty(value)) ? getI18Text("is required field", { label: t("--attachment--") }) : ''}
              onChange={(value, file, fieldname) => { setAttachment(file); handleFieldValueChange(fieldname, attachment, file as File) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getIntermediaryCodeComponent() {
    return (<>
      {applicableFields['separator3'] &&
        <Grid item xs={COL4}>
          <Separator secondary />
        </Grid>}

      {applicableFields[INTREMEDIARY_REQUIRED] &&
        <Grid item xs={COL4}>
          <div data-testid="intermediary-required-field" ref={(node) => storeRef(INTREMEDIARY_REQUIRED, node)}>
            <ToggleSwitch
              label={t("FFC banking info")}
              value={intermediaryBankRequired}
              falsyLabel={getI18Text("No")}
              truthyLabel={getI18Text("Yes")}
              onChange={(value) => { setIntermediaryBankRequired(value) }}
            />
          </div>
        </Grid>}

      {applicableFields[INTREMEDIARY_NAME] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="intermediary-bank-name-field" ref={(node) => storeRef(INTREMEDIARY_NAME, node)}>
            <TextBox
              label={t("Intermediary bank name")}
              value={intermediaryBankName}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Intermediary bank name") }) : ''}
              onChange={value => { setIntermediaryBankName(value) }}
            />
          </div>
        </Grid>}

      {applicableFields[INTREMEDIARY_ADDRESS] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="intermediary-bank-address-field" ref={(node) => storeRef(INTREMEDIARY_ADDRESS, node)}>
            <GoogleMultilinePlaceSearch
              id={`${INTREMEDIARY_ADDRESS}-new`}
              label={t("Intermediary bank address")}
              value={intermediaryBankAddress}
              countryOptions={props.countryOptions}
              forceValidate={forceValidate}
              absolutePosition
              onChange={(value, countryChanged) => { setIntermediaryBankAddress(value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </Grid>}

      {applicableFields[INTREMEDIARY_CODE] &&
        <Grid item md={COL4} xs={COL4}>
          <div data-testid="intermediary-bank-code-field" ref={(node) => storeRef(INTREMEDIARY_CODE, node)}>
            <TextBox
              label={props.bankKeys?.find(enumVal => enumVal.code === intermediaryKey)?.name || intermediaryKey || t("Intermediary bank code")}
              value={intermediaryBankCode}
              disabled={false}
              required={true}
              forceValidate={forceValidate || forceValidateIntermediaryCode}
              validator={(value) => intermediaryCodeError ?
                getI18Text("is invalid", { label: t("Intermediary bank code") }) : isEmpty(value) ? getI18Text("is required field", { label: t("Intermediary bank code") }) : ''}
              onChange={value => { setIntermediaryBankCode(value) }}
            />
          </div>
        </Grid>}
    </>)
  }

  function getAccountSectionSeparator() {
    return (<>
      {applicableFields['separator1'] && <>
        <Grid item xs={COL4}>
          <Separator secondary />
        </Grid>

        <Grid item xs={COL4}>
          <div className={styles.title}>
            {t("Account details")}
          </div>
        </Grid>
      </>}
    </>)
  }

  function getNoDetailsNeededComponent() {
    return (<>
      {applicableFields[NO_DETAILS_NEEDED] && <>
        <Grid item xs={COL4}>
          <div className={styles.noDetailsNeeded}>
            <AlertCircle color='var(--warm-neutral-shade-200)' size={18} />
            {t('--directDebitDoesNotRequireAnyAccountDetails--')}
          </div>
        </Grid>
      </>}
    </>)
  }

  const fieldComponentMap = {
    [IS_IBAN_AVAILABLE]: getIsIbanAvailableComponent,
    [BANK_NAME]: getBankNameComponent,
    [ACCOUNT_HOLDER]: getAccHolderComponent,
    [ACCOUNT_HOLDER_ADDR]: getAccHolderAddressComponent,
    [ACCOUNT_NUMBER]: getAccNumberComponent,
    [PAYMENT_ADDRESS]: getPaymentAddressComponent,
    [BANK_CODE]: getBankCodeComponent,
    [INTERNATIONAL_CODE]: getInternationalCodeComponent,
    [SWIFT_CODE]: getSwiftCodeComponent,
    [CHECK_DELIVERY_ADDRESS]: getCheckAddressComponent,
    [ATTACHMENT]: getDocumentComponent,
    [INTREMEDIARY_CODE]: getIntermediaryCodeComponent,
    [NO_DETAILS_NEEDED]: getNoDetailsNeededComponent
  }
  const fieldOrder = [
    PAYMENT_ADDRESS, IS_IBAN_AVAILABLE, INTERNATIONAL_CODE, BANK_CODE,
    ACCOUNT_NUMBER, ACCOUNT_HOLDER, ACCOUNT_HOLDER_ADDR, BANK_NAME,
    SWIFT_CODE, CHECK_DELIVERY_ADDRESS,
    ATTACHMENT, INTREMEDIARY_CODE,
    NO_DETAILS_NEEDED
  ]

  function fetchData(skipValidation?: boolean): PaymentDetail | null {
    const formData = getFormData()

    if (skipValidation) {
      return formData
    } else {
      const invalidFieldId = getInvalidPaymentField(formData, fieldMap)
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : formData
    }
  }

  // Sync state to parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.data?.id,
    companyEntities, paymentModes,
    bankAddress, bankName, accountHolder, accountHolderAddress, accountTypeOption, accountNumber, paymentAddress,
    keyOption, bankCode, bankCodeEncrypted, encryptedBankCode, bankCodeError,
    internationalCode, internationalCodeEncrypted, encryptedInternationalBankCode, internationalCodeError,
    checkDeliveryAddress, swiftCode, swiftCodeError,
    intermediaryBankRequired, intermediaryBankName, intermediaryBankAddress, intermediaryKey, intermediaryBankCode, intermediaryCodeError,
    documentType, attachment,
    isIbanAvailable, bankKeys, bankCodeAutoGenerated, bankNameAutoGenerated, accountNumberAutoGenerated, swiftCodeAutoGenerated
  ])

  return (
    <Grid container spacing={2.5} pb={2} pr={2} className={styles.paymentOption} >
      <Grid item xs={COL4}>
        <div data-testid="payment-modes-field" ref={(node) => storeRef(PAYMENT_MODES, node)}>
          <PaymentModeCard
            data={paymentModes}
            bankCountry={props.bankCountry.displayName}
            bankCurrency={getBankCurrency()}
            readOnly={!props.bankCountryOptions || (props.bankCountryOptions.length < 2)}
            canShowEntities={false} // applicableFields[COMPANY_ENTITIES]
            companyEntities={companyEntities}
            companyEntityOptions={props.companyEntityOptions}
            allowBankPayoutCurrencyRequest={props.allowBankPayoutCurrencyRequest}
            onRequestCurrency={handleCurrencyRequest}
            onCountryChange={props.onCountryChange}
            onEntityChange={setCompanyEntities}
          />
        </div>
      </Grid>

      {paymentModes.length > 0 && fieldOrder.map((field, i) => <Fragment key={i}>{fieldComponentMap[field]()}</Fragment>)}
    </Grid>
  )
}
