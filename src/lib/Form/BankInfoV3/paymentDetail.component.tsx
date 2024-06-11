import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Grid, Tooltip } from '@mui/material'
import { Check, ChevronDown, ChevronRight, Info, X } from 'react-feather'

import { BankKeyLookupEntry, Field, emptyEcncryptedData } from '../types'
import { Option } from '../../Types/input'
import { Address, Attachment, BankKey, EncryptedData, IntermediaryBankInfo, OroMasterDataType } from '../../Types/common'
import { COL2, COL3, COL4, areArraysSame, areObjectsSame, excludeOptions, getEmptyAddress, getFormFieldsMap, isAddressInvalid, isEmpty, isFieldDisabled, isFieldOmitted, isFieldRequired, isOmitted, isRequired, mapBankAddress, mapBankKeyToOption, mapBankKeysToOption, mapKeyLookupEntryToOption, mapStringToOption, mergeOptions } from '../util'
import { debounce } from '../../util'
import { AttachmentBox, GoogleMultilinePlaceSearch, MultiSelect, TextBox, ToggleSwitch, TypeAhead, imageFileAcceptType, pdfFileAcceptType } from '../../Inputs'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import { BankDocumentType, BankInfo, PaymentDetail, PaymentDetailFormProps, PaymentMode, PaymentModeType } from './types'
import Separator from '../../controls/atoms/Separator'
import { EncryptedDataBox } from '../../Inputs/text.component'
import { PaymentModeList } from './paymentModes.component'

import styles from './style.module.scss'
import { getSignedUser, isValidSession } from '../../SigninService/signin.service'
import classnames from 'classnames'

export const BANK_ADDRESS = 'bankAddress'
export const COMPANY_ENTITIES = 'companyEntities'
export const PAYMENT_MODES = 'paymentModes'
export const BANK_NAME = 'bankName'
export const ACCOUNT_HOLDER = 'accountHolder'
export const ACCOUNT_HOLDER_ADDR = 'accountHolderAddress'
export const REMITTANCE_ADDR = 'remittanceAddress'
export const ACCOUNT_NUMBER = 'accountNumber'
const KEY = 'key'
export const BANK_CODE = 'bankCode'
export const ENCRYPTED_BANK_CODE = 'encryptedBankCode'
const BANK_CODE_ERROR = 'bankCodeError'
const KEY_2 = 'key2'
export const BANK_CODE_2 = 'bankCode2'
export const ENCRYPTED_BANK_CODE_2 = 'encryptedBankCode2'
const BANK_CODE_2_ERROR = 'bankCode2Error'
const INTERNATIONAL_KEY = 'internationalKey'
export const INTERNATIONAL_CODE = 'internationalCode'
export const ENCRYPTED_INTERNATIONAL_CODE = 'encryptedInternationalBankCode'
const INTERNATIONAL_CODE_ERROR = 'internationalCodeError'
export const SWIFT_CODE = 'swiftCode'
const SWIFT_CODE_ERROR = 'swiftCodeError'
export const BANK_DOUCUMENT = 'bankDocument'
export const DOCUMENT_TYPE = 'documentType'
export const ATTACHMENT = 'attachment'
export const INTREMEDIARY_REQUIRED = 'intermediaryBankRequired'
export const INTREMEDIARY_NAME = 'intermediaryBankName'
export const INTREMEDIARY_ADDRESS = 'intermediaryBankAddress'
const INTREMEDIARY_KEY = 'intermediaryKey'
export const INTREMEDIARY_CODE = 'intermediaryBankCode'
const INTREMEDIARY_CODE_ERROR = 'intermediaryCodeError'
export const CHECK_DELIVERY_ADDRESS = 'checkDeliveryAddress'
const IS_DEMESTIC = 'isDomestic'
const IS_DEMESTIC_2 = 'isDomestic2'
const IS_INTERNATIONAL = 'isInternational'

const configurableFields = [SWIFT_CODE, BANK_DOUCUMENT, REMITTANCE_ADDR]

function mergePaymentModes (list1: PaymentMode[], list2: PaymentMode[]): PaymentMode[] {
  const modes = {}
  list1.forEach(mode => {
    modes[mode.companyEntityCountry] = mode
  })
  list2.forEach(mode => {
    modes[mode.companyEntityCountry] = mode
  })

  return Object.values(modes)
}

function excludePaymentModes (excludeModes: PaymentMode[], fromModes: PaymentMode[]): PaymentMode[] {
  const modes = {}
  fromModes.forEach(mode => {
    modes[mode.companyEntityCountry] = mode
  })
  excludeModes.forEach(mode => {
    delete modes[mode.companyEntityCountry]
  })

  return Object.values(modes)
}

export function canShowDomesticBankCode (paymentDetail?: PaymentDetail): boolean {
  const domesticPaymentMode = paymentDetail?.paymentModes?.find(mode => mode.companyEntityCountry === paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode)
  return domesticPaymentMode?.type && domesticPaymentMode.type !== 'check'
}

export function canShowInternationalBankCode (paymentDetail?: PaymentDetail): boolean {
  const internationalPaymentModes = paymentDetail?.paymentModes?.filter(mode => mode.companyEntityCountry !== paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode) || []
  return internationalPaymentModes.some(mode => mode.type !== 'check')
}

export function canShowInternationalCode (paymentDetail?: PaymentDetail): boolean {
  return !canShowDomesticBankCode(paymentDetail) || ((paymentDetail?.bankInformation?.internationalKey !== paymentDetail?.bankInformation?.key) && (paymentDetail?.bankInformation?.internationalKey !== paymentDetail?.bankInformation?.key2))
}

export function canShowSwiftCode (paymentDetail?: PaymentDetail): boolean {
  return (
    (!canShowDomesticBankCode(paymentDetail) || ((paymentDetail?.bankInformation?.key !== 'swift') && (paymentDetail?.bankInformation?.key2 !== 'swift'))) &&
    (!canShowInternationalBankCode(paymentDetail) || (paymentDetail?.bankInformation?.internationalKey !== 'swift'))
  )
}

export function canShowAccountDetails (paymentModes: PaymentMode[]): boolean {
  return paymentModes?.some(mode => ['ach' , 'wire', 'online', 'invoice'].indexOf(mode.type) > -1)
}

export function canShowCheckDetails (paymentModes: PaymentMode[]): boolean {
  return paymentModes?.some(mode => mode.type === 'check')
}

function isRequiredFieldsInvalid (paymentDetail: PaymentDetail, fieldMap: { [key: string]: Field }): string {
  let invalidFieldId = ''

  if (!isFieldOmitted(fieldMap, BANK_DOUCUMENT) && isFieldRequired(fieldMap, BANK_DOUCUMENT) && canShowAccountDetails(paymentDetail?.paymentModes) && (!paymentDetail?.documentType || !paymentDetail?.attachment)) {
    invalidFieldId = 'attachment-field'
  }
  if (!isFieldOmitted(fieldMap, SWIFT_CODE) && isFieldRequired(fieldMap, SWIFT_CODE) && canShowSwiftCode(paymentDetail) && (!paymentDetail?.bankInformation?.swiftCode || paymentDetail?.bankInformation?.swiftCodeError)) {
    invalidFieldId = 'swift-code-field'
  }

  if (!isFieldOmitted(fieldMap, REMITTANCE_ADDR) && isFieldRequired(fieldMap, REMITTANCE_ADDR) && canShowAccountDetails(paymentDetail?.paymentModes) && (!paymentDetail?.bankInformation?.accountHolderAddress || isAddressInvalid(paymentDetail?.bankInformation?.accountHolderAddress))) {
    invalidFieldId = 'account-holder-address-field'
  }

  return invalidFieldId
}

export function getInvalidPaymentField (paymentDetail: PaymentDetail, fieldMap: { [key: string]: Field }) {
  let invalidFieldId = isRequiredFieldsInvalid(paymentDetail, fieldMap)
  let isInvalid = !!invalidFieldId

  if (!isInvalid) {
    if (!paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode) {
      isInvalid = true
      invalidFieldId = 'bank-country-field'
    } else if (!paymentDetail?.companyEntities || paymentDetail?.companyEntities.length < 1) {
      isInvalid = true
      invalidFieldId = 'company-entities-field'
    } else if (!paymentDetail?.paymentModes || paymentDetail?.paymentModes.length < 1) {
      isInvalid = true
      invalidFieldId = 'payment-modes-field'
    } else if (canShowAccountDetails(paymentDetail?.paymentModes) && !paymentDetail?.bankInformation?.bankName) {
      isInvalid = true
      invalidFieldId = 'bank-name-field'
    } else if ((canShowAccountDetails(paymentDetail?.paymentModes) || canShowCheckDetails(paymentDetail?.paymentModes)) && !paymentDetail?.bankInformation?.accountHolder) {
      isInvalid = true
      invalidFieldId = 'account-holder-field'
    } else if (canShowAccountDetails(paymentDetail?.paymentModes) && (!paymentDetail?.bankInformation?.accountNumber || !(paymentDetail?.bankInformation?.accountNumber.maskedValue || paymentDetail?.bankInformation?.accountNumber.unencryptedValue))) {
      isInvalid = true
      invalidFieldId = 'account-number-field'
    } else if (canShowDomesticBankCode(paymentDetail) && paymentDetail?.isDomestic && (!(paymentDetail?.bankInformation?.bankCode || (paymentDetail?.bankInformation?.encryptedBankCode?.maskedValue || paymentDetail?.bankInformation?.encryptedBankCode?.unencryptedValue)) || paymentDetail?.bankInformation?.bankCodeError)) {
      isInvalid = true
      invalidFieldId = 'bank-code-field'
    } else if (canShowDomesticBankCode(paymentDetail) && paymentDetail?.isDomestic2 && (!(paymentDetail?.bankInformation?.bankCode2 || (paymentDetail?.bankInformation?.encryptedBankCode2?.maskedValue || paymentDetail?.bankInformation?.encryptedBankCode2?.unencryptedValue)) || paymentDetail?.bankInformation?.bankCode2Error)) {
      isInvalid = true
      invalidFieldId = 'bank-code-2-field'
    } else if (canShowInternationalCode(paymentDetail) && paymentDetail?.isInternational && (!paymentDetail?.bankInformation?.internationalCode || (paymentDetail?.bankInformation?.encryptedInternationalBankCode?.maskedValue || paymentDetail?.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)) || paymentDetail?.bankInformation?.internationalCodeError) {
      isInvalid = true
      invalidFieldId = 'int-bank-code-field'
    } else if (canShowCheckDetails(paymentDetail?.paymentModes) && (!paymentDetail?.bankInformation?.checkDeliveryAddress || isAddressInvalid(paymentDetail?.bankInformation?.checkDeliveryAddress))) {
      isInvalid = true
      invalidFieldId = 'check-delivery-address-field'
    } else if (paymentDetail?.isInternational && paymentDetail?.intermediaryBankRequired && !paymentDetail?.intermediaryBankInformation?.bankName) {
      isInvalid = true
      invalidFieldId = 'intermediary-bank-name-field'
    } else if (paymentDetail?.isInternational && paymentDetail?.intermediaryBankRequired && (!paymentDetail?.intermediaryBankInformation?.bankCode || paymentDetail?.intermediaryBankInformation?.bankCodeError)) {
      isInvalid = true
      invalidFieldId = 'intermediary-bank-code-field'
    }
  }

  return isInvalid ? invalidFieldId : ''
}

export function PaymentDetailForm (props: PaymentDetailFormProps) {
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

  // State
  const [bankCountry, setBankCountry] = useState<Option>()
  const [bankAddress, setBankAddress] = useState<Address>(getEmptyAddress())
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([])
  const [companyEntities, setCompanyEntities] = useState<Option[]>([])

  const [bankName, setBankName] = useState<string>()
  const [accountHolder, setAccountHolder] = useState<string>()
  const [accountHolderAddress, setAccountHolderAddress] = useState<Address>(getEmptyAddress())
  const [accountNumber, setAccountNumber] = useState<EncryptedData>(emptyEcncryptedData)
  
  const [key, setKey] = useState<BankKey>('')
  const [bankCode, setBankCode] = useState<string>('')
  const [bankCodeEncrypted, setBankCodeEncrypted] = useState<boolean>(false)
  const [encryptedBankCode, setEncryptedBankCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [bankCodeError, setBankCodeError] = useState<boolean>(false)

  const [key2, setKey2] = useState<BankKey>('')
  const [bankCode2, setBankCode2] = useState<string>('')
  const [bankCode2Encrypted, setBankCode2Encrypted] = useState<boolean>(false)
  const [encryptedBankCode2, setEncryptedBankCode2] = useState<EncryptedData>(emptyEcncryptedData)
  const [bankCode2Error, setBankCode2Error] = useState<boolean>(false)

  const [internationalKeyOption, setInternationalKeyOption] = useState<Option>()
  const [internationalCode, setInternationalCode] = useState<string>('')
  const [internationalCodeEncrypted, setInternationalCodeEncrypted] = useState<boolean>(false)
  const [encryptedInternationalBankCode, setEncryptedInternationalBankCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [internationalCodeError, setInternationalCodeError] = useState<boolean>(false)

  const [swiftCode, setSwiftCode] = useState<string>('')
  const [swiftCodeError, setSwiftCodeError] = useState<boolean>(false)

  const [checkDeliveryAddress, setCheckDeliveryAddress] = useState<Address>(getEmptyAddress())

  const [documentType, setDocumentType] = useState<Option>()
  const [attachment, setAttachment] = useState<Attachment>()

  const [intermediaryBankRequired, setIntermediaryBankRequired] = useState<boolean>(false)
  const [intermediaryBankName, setIntermediaryBankName] = useState<string>('')
  const [intermediaryBankAddress, setIntermediaryBankAddress] = useState<Address>(getEmptyAddress())
  const [intermediaryKey, setIntermediaryKey] = useState<BankKey>('')
  const [intermediaryBankCode, setIntermediaryBankCode] = useState<string>('')
  const [intermediaryCodeError, setIntermediaryCodeError] = useState<boolean>(false)

  const [isDomestic, setIsDomestic] = useState(false)
  const [isDomestic2, setIsDomestic2] = useState(false)
  const [isInternational, setIsInternational] = useState(false)

  const [paymentModeOptions, setPaymentModeOptions] = useState<{ [country: string]: PaymentModeType[] }>({})
  const [documentTypeOptions, setDocumentTypeOptions] = useState<Option[]>([])

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }
  const [expanded, setExpanded] = useState<boolean>(true)
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  function triggerValidations() {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }

  // useEffect(() => {
  //   setSelected(props.selected)
  // }, [props.selected])

  useEffect(() => {
    triggerValidations()
  }, [bankCodeError, bankCode2Error, internationalCodeError, swiftCodeError, intermediaryCodeError])
  
  // Sync state from parent
  useEffect(() => {
    if (props.data) {
      if (props.data.bankInformation?.bankAddress?.alpha2CountryCode) {
        setBankAddress(mapBankAddress(props.data.bankInformation?.bankAddress))
      }
      setCompanyEntities(props.data.companyEntities || [])

      setBankName(props.data.bankInformation?.bankName || '')
      setAccountHolder(props.data.bankInformation?.accountHolder || '')
      setAccountHolderAddress(props.data.bankInformation?.accountHolderAddress || getEmptyAddress())
      setAccountNumber(props.data.bankInformation?.accountNumber || emptyEcncryptedData)

      setKey(props.data.bankInformation?.key)
      setBankCode(props.data.bankInformation?.bankCode || '')
      setEncryptedBankCode(props.data.bankInformation?.encryptedBankCode || emptyEcncryptedData)
      if (props.data.bankInformation?.encryptedBankCode?.maskedValue){
        setBankCodeEncrypted(true)
      }
      setBankCodeError(props.data.bankInformation?.bankCodeError)
      setIsDomestic(!!props.data.bankInformation?.bankCode || !!props.data.bankInformation?.encryptedBankCode?.maskedValue || !!props.data.bankInformation?.encryptedBankCode?.unencryptedValue)

      setKey2(props.data.bankInformation?.key2)
      setBankCode2(props.data.bankInformation?.bankCode2 || '')
      setEncryptedBankCode2(props.data.bankInformation?.encryptedBankCode2 || emptyEcncryptedData)
      if (props.data.bankInformation?.encryptedBankCode2?.maskedValue){
        setBankCode2Encrypted(true)
      }
      setBankCode2Error(props.data.bankInformation?.bankCode2Error)
      setIsDomestic2(!!props.data.bankInformation?.bankCode2 || !!props.data.bankInformation?.encryptedBankCode2?.maskedValue || !!props.data.bankInformation?.encryptedBankCode2?.unencryptedValue)

      setInternationalKeyOption(props.data.bankInformation?.internationalKey ? mapStringToOption(props.data.bankInformation?.internationalKey) : undefined)
      setInternationalCode(props.data.bankInformation?.internationalCode || '')
      if (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) {
        setInternationalCodeEncrypted(true)
        if (!props.data.bankInformation?.internationalCode) {
          setInternationalCode(props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)
        }
      }
      setEncryptedInternationalBankCode(props.data.bankInformation?.encryptedInternationalBankCode)
      setInternationalCodeError(props.data.bankInformation?.internationalCodeError)
      setIsInternational(!!props.data.bankInformation?.internationalCode || !!props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || !!props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)

      setSwiftCode(props.data?.bankInformation?.swiftCode || '')
      setSwiftCodeError(props.data?.bankInformation?.swiftCodeError)

      setCheckDeliveryAddress(props.data.bankInformation?.checkDeliveryAddress || getEmptyAddress())

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
    const country = mapBankAddress(props.data?.bankInformation?.bankAddress)?.alpha2CountryCode
    const matchingEntry = props.countryOptions?.find(entry => entry.path === country)
    if (!areObjectsSame(bankCountry, matchingEntry)) {
      setBankCountry(matchingEntry)
    }
  }, [props.data, props.countryOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, configurableFields))
    }
  }, [props.fields])

  // Component functionality

  function getFormData (): PaymentDetail {
    return {
      id: props.data.id,
      companyEntities,
      paymentModes,
      bankInformation : {
        bankAddress,
        bankName,
        accountHolder,
        accountHolderAddress,
        accountNumber,
        key: isDomestic ? key : '',
        bankCode: (isDomestic && !bankCodeEncrypted) ? bankCode : '',
        encryptedBankCode: (isDomestic && bankCodeEncrypted) ? encryptedBankCode : undefined,
        bankCodeError,
        key2: isDomestic2 ? key2 : '',
        bankCode2: (isDomestic2 && !bankCode2Encrypted) ? bankCode2 : '',
        encryptedBankCode2: (isDomestic2 && bankCode2Encrypted) ? encryptedBankCode2 : undefined,
        bankCode2Error,
        internationalKey: isInternational && internationalKeyOption ? internationalKeyOption?.path as BankKey : '',
        internationalCode: (isInternational && !internationalCodeEncrypted) ? internationalCode : '',
        encryptedInternationalBankCode: (isInternational && internationalCodeEncrypted) ? encryptedInternationalBankCode : emptyEcncryptedData,
        internationalCodeError,
        swiftCode: (isInternational && internationalKeyOption?.path === "swift") ? internationalCode : swiftCode,
        swiftCodeError,
        checkDeliveryAddress
      },
      intermediaryBankRequired,
      intermediaryBankInformation: (isInternational && intermediaryBankRequired) ? {
        bankName: intermediaryBankName,
        bankAddress: intermediaryBankAddress,
        key: intermediaryKey,
        bankCode: intermediaryBankCode,
        bankCodeError: intermediaryCodeError
      } : null,
      documentType: (documentType?.path as BankDocumentType) || undefined,
      attachment,
      selectedExistingBankInfo: props.existing,

      isDomestic,
      isDomestic2,
      isInternational
    }
  }

  // Sync state to parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(getFormData)
    }
  }, [
    companyEntities, paymentModes,
    bankAddress, bankName, accountHolder, accountHolderAddress, accountNumber,
    key, bankCode, bankCodeEncrypted, encryptedBankCode, bankCodeError,
    key2, bankCode2, bankCode2Encrypted, encryptedBankCode2, bankCode2Error,
    internationalKeyOption, internationalCode, internationalCodeEncrypted, encryptedInternationalBankCode, internationalCodeError,
    swiftCode, swiftCodeError, checkDeliveryAddress,
    intermediaryBankRequired, intermediaryBankName, intermediaryBankAddress, intermediaryKey, intermediaryBankCode, intermediaryCodeError,
    documentType, attachment,
    isDomestic, isDomestic2, isInternational,
  ])

  function useDefaultCrossBorderStatuses () {
    let _isDomestic = false
    let _isInternational = false
    companyEntities.filter(entity => {
      return props.companyEntityOptions?.some(option => option.path === entity.path)
    }).forEach(entity => {
      if (entity.customData?.other?.countryCode) {
        if (entity.customData?.other?.countryCode === bankCountry.path) {
          _isDomestic = true
        } else {
          _isInternational = true
        }
      }
    })

    setIsDomestic(_isDomestic)
    setIsInternational(_isInternational)
  }

  // generate applicable payment modes
  useEffect(() => {
    if (props.paymentModeConfig && (props.paymentModeConfig.length > 0) && bankCountry && (companyEntities.length > 0)) {
      // Detect crossBorder statuses
      if (props.getCrossBorderStatuses) {
        const entityCountries = companyEntities.filter(entity => {
          return props.companyEntityOptions?.some(option => option.path === entity.path)
        }).map(entity => {
          const entityOption = props.companyEntityOptions?.find(option => option.path === entity.path)
          return entityOption?.customData?.other?.countryCode
        })
        props.getCrossBorderStatuses(bankCountry.path, entityCountries)
          .then(statusMap => {
            let _isDomestic = false
            let _isInternational = false
            for (const [country, isCrossBorder] of Object.entries(statusMap)) {
              if (isCrossBorder) {
                _isInternational = true
              }
              if (!isCrossBorder) {
                _isDomestic = true
              }
            }

            setIsDomestic(_isDomestic)
            setIsInternational(_isInternational)
          })
          .catch(err => {
            console.warn('Error fetching cross border statuses. ', err)
            useDefaultCrossBorderStatuses()
          })
      } else {
        useDefaultCrossBorderStatuses()
      }

      // Available payment types
      const _paymentModeConfig: { [country: string]: { domestic: PaymentModeType[], international: PaymentModeType[] } } = {}
      if (props.paymentModeConfig) {
        props.paymentModeConfig.forEach(config => {
          _paymentModeConfig[config.alpha2Code] = {
            domestic: config.domestic || [],
            international: config.international || [],
          }
        })
      }

      // Update paymentModes
      const _paymentModeOptions: { [country: string]: PaymentModeType[] } = {}
      const _paymentModes: PaymentMode[] = []
      const parsedCountries = {}
      companyEntities.filter(entity => {
        return props.companyEntityOptions?.some(option => option.path === entity.path)
      }).forEach(entity => {
        const entityOption = props.companyEntityOptions?.find(option => option.path === entity.path)
        const entityCountry = entityOption.customData?.other?.countryCode
        const entityCurrency = entityOption.customData?.other?.currencyCode

        const configForEntity = _paymentModeConfig[entityCountry] || _paymentModeConfig['default'] || { domestic: [], international: [] }
        const isEntityDomestic = entityCountry === bankCountry.path
        const availableModeOptions = isEntityDomestic ? configForEntity.domestic : configForEntity.international
        _paymentModeOptions[entityCountry] = availableModeOptions
        
        const entityPaymentModeType = availableModeOptions[0]

        const existingCurrencySelection = props.data?.paymentModes?.find(mode => mode.companyEntityCountry === entityCountry)?.currencyCode
        const existingModeTypeSelection = props.data?.paymentModes?.find(mode => mode.companyEntityCountry === entityCountry)?.type
        const isexistingModeTypeSelectionAvailable = availableModeOptions.some(option => option === existingModeTypeSelection)

        if (!parsedCountries[entityCountry]) {
          _paymentModes.push({
            companyEntityCountry: entityCountry,
            type: (isexistingModeTypeSelectionAvailable && existingModeTypeSelection) || entityPaymentModeType,
            currencyCode: existingCurrencySelection || entityCurrency
          })
          parsedCountries[entityCountry] = true
        }
      })

      setPaymentModeOptions(_paymentModeOptions) // { 'US': ['check', 'wire', 'ach'], 'MX': ['wire', 'ach'] }
      // Sort such that domestic is first
      _paymentModes.sort(function(x,y){ return x?.companyEntityCountry === bankCountry?.path ? -1 : y?.companyEntityCountry === bankCountry?.path ? 1 : 0 })
      setPaymentModes(_paymentModes)
      setTimeout(() => {
        handleFieldValueChange(PAYMENT_MODES, paymentModes, _paymentModes)
      }, 100)
    } else {
      setPaymentModeOptions({})
      setPaymentModes([])
      setTimeout(() => {
        handleFieldValueChange(PAYMENT_MODES, paymentModes, [])
      }, 100)
    }
  }, [props.paymentModeConfig, bankCountry, companyEntities])

  // Update key options
  useEffect(() => {
    if (bankCountry?.path && props.getCountryBankKeys) {
      props.getCountryBankKeys(bankCountry?.path)
        .then(res => {
          setKey(res.domestic)
          setInternationalKeyOption(res.international ? mapStringToOption(res.international) : undefined)

          if (res.domesticKeyLookup) {
            const bankCurrency = Object.keys(res.domesticKeyLookup)?.[0]
            const domesticKeyLookup: BankKeyLookupEntry[] = res.domesticKeyLookup[bankCurrency] || []

            const keyEntry: BankKeyLookupEntry = domesticKeyLookup.find(entry => entry.bankKey === res.domestic)
            setBankCodeEncrypted(keyEntry?.bankCodeEncrypted)

            const key2Entry: BankKeyLookupEntry = domesticKeyLookup.find(entry => entry.bankKey !== res.domestic)
            setKey2(key2Entry?.bankKey)
            setBankCode2Encrypted(key2Entry?.bankCodeEncrypted)
            setIsDomestic2(!!key2Entry?.bankKey)
          } else {
            setIsDomestic2(false)
          }
        })
        .catch(err => {
          console.warn('Error fetching bank keys. ', err)
        })
    }
  }, [bankCountry])

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
    } else if (props.bankProofConfig && (props.bankProofConfig.length > 0) && bankCountry) {
      const applicableDocuments = props.bankProofConfig.find(config => config.alpha2Code === bankCountry?.path)?.documents || []
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
  }, [props.bankProofConfig, bankCountry])

  function dispatchValidateBankInfo (bankInfo: BankInfo | IntermediaryBankInfo, validateInternational: boolean, callback: Function) {
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
  const debouncedValidateBankInfo = useMemo(() => debounce(dispatchValidateBankInfo), [])

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
      const bankInfo: BankInfo = getFormData().bankInformation || {}
      const bankInformationCopy: BankInfo = {
        ...bankInfo,
        key: bankInfo.key2,
        bankCode: bankInfo.bankCode2,
        encryptedBankCode: bankInfo.encryptedBankCode2,
      }
      debouncedValidateBankInfo(bankInformationCopy, false, function (err, res?) {
        if (err) {
          console.warn('Error validating domestic bank 2 info. ', err)
          return
        }
        setBankCode2Error(!res)
      })
    }
  }, [bankCode2, encryptedBankCode2])
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

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Option[] | Address | EncryptedData | boolean | PaymentMode[] | Attachment): PaymentDetail {
    const formData = JSON.parse(JSON.stringify(getFormData())) as PaymentDetail

    switch (fieldName) {
      case COMPANY_ENTITIES:
        formData.companyEntities = newValue as Option[]
        break
      case BANK_ADDRESS:
        formData.bankInformation.bankAddress = newValue as Address
        break
      case PAYMENT_MODES:
        formData.paymentModes = newValue as PaymentMode[]
        break
      case BANK_NAME:
        formData.bankInformation.bankName = newValue as string
        break
      case ACCOUNT_HOLDER:
        formData.bankInformation.accountHolder = newValue as string
        break
      case ACCOUNT_HOLDER_ADDR:
        formData.bankInformation.accountHolderAddress = newValue as Address
        break
      case ACCOUNT_NUMBER:
        formData.bankInformation.accountNumber = newValue as EncryptedData
        break
      case KEY:
        formData.bankInformation.key = newValue as BankKey
        break
      case BANK_CODE:
        formData.bankInformation.bankCode = newValue as string
        break
      case ENCRYPTED_BANK_CODE:
        formData.bankInformation.encryptedBankCode = newValue as EncryptedData
        break
      case BANK_CODE_ERROR:
        formData.bankInformation.bankCodeError = newValue as boolean
        break
      case KEY_2:
        formData.bankInformation.key2 = newValue as BankKey
        break
      case BANK_CODE_2:
        formData.bankInformation.bankCode2 = newValue as string
        break
      case ENCRYPTED_BANK_CODE_2:
        formData.bankInformation.encryptedBankCode2 = newValue as EncryptedData
        break
      case BANK_CODE_2_ERROR:
        formData.bankInformation.bankCode2Error = newValue as boolean
        break
      case INTERNATIONAL_KEY:
        formData.bankInformation.internationalKey = newValue as BankKey
        break
      case INTERNATIONAL_CODE:
        formData.bankInformation.internationalCode = newValue as string
        break
      case ENCRYPTED_INTERNATIONAL_CODE:
        const encryptData = newValue as EncryptedData
        formData.bankInformation.encryptedInternationalBankCode = newValue as EncryptedData
        formData.bankInformation.internationalCode = encryptData?.unencryptedValue
        break
      case INTERNATIONAL_CODE_ERROR:
        formData.bankInformation.internationalCodeError = newValue as boolean
        break
      case SWIFT_CODE:
        formData.bankInformation.swiftCode = newValue as string
        break
      case SWIFT_CODE_ERROR:
        formData.bankInformation.swiftCodeError = newValue as boolean
        break
      case CHECK_DELIVERY_ADDRESS:
        formData.bankInformation.checkDeliveryAddress = newValue as Address
        break
      case DOCUMENT_TYPE:
        formData.documentType = (newValue as Option)?.path as BankDocumentType
        break
      case ATTACHMENT:
        formData.attachment = newValue as Attachment
        break
      case INTREMEDIARY_REQUIRED:
        formData.intermediaryBankRequired = newValue as boolean
        break
      case INTREMEDIARY_NAME:
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankName = newValue as string
        }
        break
      case INTREMEDIARY_ADDRESS:
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankAddress = newValue as Address
        }
        break
      case INTREMEDIARY_KEY:
        formData.intermediaryBankInformation.key = newValue as BankKey
        break
      case INTREMEDIARY_CODE:
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankCode = newValue as string
        }
        break
      case INTREMEDIARY_CODE_ERROR:
        formData.intermediaryBankInformation.bankCodeError = newValue as boolean
        break
      case IS_DEMESTIC:
        formData.isDomestic = newValue as boolean
        break
      case IS_DEMESTIC_2:
        formData.isDomestic2 = newValue as boolean
        break
      case IS_INTERNATIONAL:
        formData.isInternational = newValue as boolean
        break
    }

    return formData
  }

  function validateAddressField (label: string, value: Address): string {
    if (!value) {
      return getI18Text("is required field",{label})
    } else if (isAddressInvalid(value)) {
      return getI18Text("is invalid",{label})
    } else {
      return ''
    }
  }

  function dispatchOnValueChange (fieldName: string, formData: PaymentDetail, isAttachment?: boolean) {
    if (props.onValueChange && (!props.existing || props.selected)) {
      props.onValueChange(
        fieldName,
        formData,
        isAttachment
      )
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedOnValueChange = useMemo(() => debounce(dispatchOnValueChange), [props.existing, props.selected])

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Option | Option[] | Address | EncryptedData | boolean | PaymentMode[] | Attachment,
    newValue: string | Option | Option[] | Address | EncryptedData | boolean | PaymentMode[] | Attachment,
    useDebounce?: boolean,
    isAttachment?: boolean
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' || typeof newValue === 'boolean') {
        if (oldValue !== newValue) {
          if (useDebounce) {
            debouncedOnValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue),
              isAttachment
            )
          } else {
            dispatchOnValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue),
              isAttachment
            )
          }
        }
      } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (!areArraysSame(oldValue, newValue)) {
          if (useDebounce) {
            debouncedOnValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue),
              isAttachment
            )
          } else {
            dispatchOnValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue),
              isAttachment
            )
          }
        }
      } else if (!areObjectsSame(oldValue, newValue)) {
        if (useDebounce) {
          debouncedOnValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue),
            isAttachment
          )
        } else {
          dispatchOnValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue),
            isAttachment
          )
        }
      }
    }
  }

  function onBankCountryChanged (value?: Option) {
    if (value && value?.path !== bankCountry?.path) {
      setBankCountry(value)
      const address = {...getEmptyAddress(), alpha2CountryCode: (value as Option)?.path}
      setBankAddress(address)
      handleFieldValueChange(BANK_ADDRESS, bankAddress, address)
    } else if (!value) {
      setBankCountry(null)
      const address = getEmptyAddress()
      setBankAddress(address)
      handleFieldValueChange(BANK_ADDRESS, bankAddress, address)
    }
  }

  function handleDeleteClick (e) {
    e.stopPropagation()
    if (props.onDeleteClick) {
      props.onDeleteClick()
    }
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function getBankCurrency (): string | undefined {
    const bankCountryCode = bankCountry?.path || bankAddress?.alpha2CountryCode
    const bankCountryOption = props.countryOptions?.find(countryOption => countryOption.path === bankCountryCode)
    return bankCountryOption?.customData?.other?.currencyCode
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

  function toggleSelection () {
    const _selected = !props.selected
    // setSelected(_selected)

    if (_selected) {
      setCompanyEntities(mergeOptions(props.data.companyEntities || [], props.companyEntityOptions || []))
    } else {
      setCompanyEntities(props.data.companyEntities || [])
    }
  
    if (props.onToggleSelection) {
      props.onToggleSelection(_selected)
    }
  }

  function isAnyEntityMissingInExistinEntities () {
    const foundEntityWhichIsNotInExisting = props.companyEntityOptions.some(entity => {
      const foundEntityInExisting = props.existingData?.companyEntities.some(existingEntity => {
        return existingEntity.path === entity.path
      })
      return !foundEntityInExisting
    })

    return foundEntityWhichIsNotInExisting
  }

  function isAnyModeIsMissingInExistingPaymentModes () {
    const foundModeWhichIsNotInExisting = paymentModes.some(paymentMode => {
      const foundModeInExisting = props.existingData?.paymentModes.some(existingPaymentMode => {
        return existingPaymentMode.companyEntityCountry === paymentMode.companyEntityCountry
      })
      return !foundModeInExisting
    })

    return foundModeWhichIsNotInExisting
  }

  const applicableFields = {
    [BANK_ADDRESS]: true,
    [COMPANY_ENTITIES]: !props.hideCompanyEntitySelector && bankCountry && props.companyEntityOptions && props.companyEntityOptions.length > 0,
    [PAYMENT_MODES]: bankCountry && companyEntities && companyEntities.length > 0,

    separator1: canShowAccountDetails(paymentModes) || canShowCheckDetails(paymentModes),
    // <---------
    [BANK_NAME]: canShowAccountDetails(paymentModes),
    [ACCOUNT_HOLDER]: canShowAccountDetails(paymentModes) || canShowCheckDetails(paymentModes),

    [ACCOUNT_HOLDER_ADDR]: canShowAccountDetails(paymentModes) && !isFieldOmitted(fieldMap, REMITTANCE_ADDR),
    [ACCOUNT_NUMBER]: canShowAccountDetails(paymentModes),
    [BANK_CODE]: canShowAccountDetails(paymentModes) && canShowDomesticBankCode({ paymentModes, bankInformation: { bankAddress } }) && isDomestic,
    [BANK_CODE_2]: canShowAccountDetails(paymentModes) && canShowDomesticBankCode({ paymentModes, bankInformation: { bankAddress } }) && isDomestic2 && key2,
    [INTERNATIONAL_CODE]: canShowAccountDetails(paymentModes) && isInternational && canShowInternationalCode({ paymentModes, bankInformation: { bankAddress, key, key2, internationalKey: internationalKeyOption?.path as BankKey } }),
    [SWIFT_CODE]: canShowAccountDetails(paymentModes) && !isFieldOmitted(fieldMap, SWIFT_CODE) && canShowSwiftCode({ paymentModes, bankInformation: { bankAddress, key, key2, internationalKey: internationalKeyOption?.path as BankKey } }),

    [CHECK_DELIVERY_ADDRESS]: canShowCheckDetails(paymentModes),
    // --------->

    separator2: !isFieldOmitted(fieldMap, BANK_DOUCUMENT) && canShowAccountDetails(paymentModes),
    // <---------
    [DOCUMENT_TYPE]: !isFieldOmitted(fieldMap, BANK_DOUCUMENT) && canShowAccountDetails(paymentModes) && documentTypeOptions && (documentTypeOptions.length > 1),
    [ATTACHMENT]: !isFieldOmitted(fieldMap, BANK_DOUCUMENT) && canShowAccountDetails(paymentModes),
    // --------->

    separator3: isInternational,
    // <---------
    [INTREMEDIARY_REQUIRED]: isInternational,
    [INTREMEDIARY_NAME]: isInternational && intermediaryBankRequired,
    [INTREMEDIARY_ADDRESS]: isInternational && intermediaryBankRequired,
    [INTREMEDIARY_CODE]: isInternational && intermediaryBankRequired
    // --------->
  }

  const _isAnyEntityMissingInExistinEntities = isAnyEntityMissingInExistinEntities()
  const _isAnyModeIsMissingInExistingPaymentModes = isAnyModeIsMissingInExistingPaymentModes()
  const existingData = {
    [BANK_ADDRESS]: true,
    [COMPANY_ENTITIES]: !_isAnyEntityMissingInExistinEntities,
    [PAYMENT_MODES]: !_isAnyModeIsMissingInExistingPaymentModes,

    separator1: props.existingData?.bankInformation?.accountNumber?.maskedValue || props.existingData?.bankInformation?.accountNumber?.unencryptedValue || props.existingData?.bankInformation?.checkDeliveryAddress?.alpha2CountryCode,
    // <---------
    [BANK_NAME]: props.existingData?.bankInformation?.bankName,
    [ACCOUNT_HOLDER]: props.existingData?.bankInformation?.accountHolder,

    [ACCOUNT_HOLDER_ADDR]: props.existingData?.bankInformation?.accountHolderAddress?.alpha2CountryCode,
    [ACCOUNT_NUMBER]: props.existingData?.bankInformation?.accountNumber?.maskedValue || props.existingData?.bankInformation?.accountNumber?.unencryptedValue,
    [BANK_CODE]: props.existingData?.bankInformation?.bankCode || props.existingData?.bankInformation?.encryptedBankCode?.maskedValue || props.existingData?.bankInformation?.encryptedBankCode?.unencryptedValue,
    [BANK_CODE_2]: props.existingData?.bankInformation?.bankCode2 || props.existingData?.bankInformation?.encryptedBankCode2?.maskedValue || props.existingData?.bankInformation?.encryptedBankCode2?.unencryptedValue,
    [INTERNATIONAL_CODE]: props.existingData?.bankInformation?.internationalCode || props.existingData?.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.existingData?.bankInformation?.encryptedInternationalBankCode?.unencryptedValue,
    [SWIFT_CODE]: props.existingData?.bankInformation?.swiftCode,

    [CHECK_DELIVERY_ADDRESS]: props.existingData?.bankInformation?.checkDeliveryAddress?.alpha2CountryCode,
    // --------->

    separator2: props.existingData?.attachment,
    // <---------
    [DOCUMENT_TYPE]: props.existingData?.documentType,
    [ATTACHMENT]: props.existingData?.attachment,
    // --------->

    separator3: props.existingData?.intermediaryBankInformation?.bankName && props.existingData?.intermediaryBankInformation?.bankAddress?.alpha2CountryCode && props.existingData?.intermediaryBankInformation?.bankCode,
    // <---------
    [INTREMEDIARY_REQUIRED]: props.existingData?.intermediaryBankInformation?.bankName && props.existingData?.intermediaryBankInformation?.bankAddress?.alpha2CountryCode && props.existingData?.intermediaryBankInformation?.bankCode,
    [INTREMEDIARY_NAME]: props.existingData?.intermediaryBankInformation?.bankName,
    [INTREMEDIARY_ADDRESS]: props.existingData?.intermediaryBankInformation?.bankAddress?.alpha2CountryCode,
    [INTREMEDIARY_CODE]: props.existingData?.intermediaryBankInformation?.bankCode
    // --------->
  }

  const cardBankName = props.existing
    ? (props.existingData?.bankInformation?.bankName || props.existingData?.bankInformation?.accountHolder)
    : (bankName || accountHolder)
  const cardBankCountry = props.existing ? props.existingData?.bankInformation?.bankAddress?.alpha2CountryCode : bankCountry?.displayName
  const cardAccountNumber = props.existing ? props.existingData?.bankInformation?.accountNumber?.maskedValue : accountNumber?.maskedValue
  const cardKey = props.existing ? props.existingData?.bankInformation?.key : key
  const cardBankCode = props.existing ? props.existingData?.bankInformation?.bankCode : bankCode
  const cardEncryptedBankCode = props.existing ? props.existingData?.bankInformation?.encryptedBankCode?.maskedValue : encryptedBankCode.maskedValue
  const caerCompanyEntities = props.existing ? props.existingData?.companyEntities : companyEntities

  return (
    <Grid container spacing={2.5} pb={2} pr={2} className={styles.paymentOption} >
      {props.title &&
        <Grid item xs={COL4}>
          <div className={styles.title}>
            {props.existing &&
              <div className={classnames(styles.selectButton, {[styles.selected]: props.selected})} onClick={toggleSelection}>
                {props.selected && <Check size={14} strokeWidth={'3px'} color='var(--warm-prime-chalk)' />}
              </div>}
            {!props.existing && (expanded
              ? <ChevronDown size={20} color={'var(--warm-neutral-shade-300)'} cursor="pointer" onClick={() => setExpanded(false)} />
              : <ChevronRight size={20} color={'var(--warm-neutral-shade-300)'} cursor="pointer" onClick={() => setExpanded(true)} />)}
            {props.title}
            <div className={styles.spread} />
            {!props.existing && <X size={20} color={'var(--warm-neutral-shade-300)'} cursor="pointer" onClick={handleDeleteClick} />}
          </div>
        </Grid>}

      {/* Card */}
      {(props.existing || !expanded) &&
        <Grid item xs={COL4}>
          <div className={styles.card}>
            <div className={styles.primaryInfo}>
              {cardBankName && <span>{cardBankName}</span>}
              {cardBankCountry && <span>{cardBankName && ', '}{cardBankCountry}</span>}
              {cardAccountNumber && <span>{(cardBankName || cardBankCountry) && ' '}({cardAccountNumber})</span>}
            </div>

            {(cardBankCode || cardEncryptedBankCode) &&
              <div className={styles.secondaryInfo}>
                {props.bankKeys?.find(enumVal => enumVal.code === cardKey)?.name || cardKey || t("Bank code")}: <span className={styles.value}>{cardBankCode || cardEncryptedBankCode}</span>
              </div>}

            <div className={styles.secondaryInfo}>
              {t("--companyEntities--")}: {caerCompanyEntities.map((entity, i) => {
                let entityCountry = entity?.customData?.other?.countryCode
                if (!entityCountry) {
                  const entityOption = props.companyEntityOptions?.find(option => option.path === entity.path)
                  entityCountry = entityOption?.customData?.other?.countryCode
                }
                return (<span key={i}>
                  <span className={styles.value}>{entity.displayName}</span>{entityCountry && ` (${entityCountry})`}{(i < (caerCompanyEntities.length - 1)) && ', '}
                </span>)
              })}
            </div>
          </div>
        </Grid>}

      {props.existing && props.selected && (_isAnyEntityMissingInExistinEntities || _isAnyModeIsMissingInExistingPaymentModes) &&
        <Grid item xs={COL4}>
          <Separator secondary />
        </Grid>}

      {(props.existing ? props.selected : expanded) && <>
        {applicableFields[BANK_ADDRESS] && (!props.existing || !existingData[BANK_ADDRESS]) &&
          <Grid item md={COL2} xs={COL4}>
            <div data-testid="bank-country-field" ref={(node) => storeRef(BANK_ADDRESS, node)}>
              <TypeAhead
                label={t("Bank country")}
                placeholder={t("Select bank country")}
                value={bankCountry}
                options={props.countryOptions}
                disabled={false}
                required={true}
                forceValidate={props.forceValidate}
                validator={(value) => isEmpty(value) ? getI18Text("is required field",{ label: t("Bank country") }) : ''}
                onChange={value => onBankCountryChanged(value)}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if companyEntities does not include any of companyEntityOptions */}
        {applicableFields[COMPANY_ENTITIES] && (!props.existing || !existingData[COMPANY_ENTITIES]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="company-entities-field" ref={(node) => storeRef(COMPANY_ENTITIES, node)}>
              {/* Exclude existing entities while displaying */}
              <MultiSelect
                label={t("--entitiesThatCanMakePayments--")}
                value={excludeOptions(props.existingData?.companyEntities || [], companyEntities)}
                options={excludeOptions(props.existingData?.companyEntities || [], props.companyEntityOptions)}
                required={true}
                forceValidate={props.forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                validator={(value) => isEmpty(value) ? getI18Text("is required field",{ label: t("--companyEntities--") }) : ''}
                onChange={value => {setCompanyEntities(mergeOptions(value, props.existingData?.companyEntities || [])); handleFieldValueChange(COMPANY_ENTITIES, companyEntities, mergeOptions(value, props.existingData?.companyEntities || []))}}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if existing paymentModes does not include any of evaluated paymentModes */}
        {applicableFields[PAYMENT_MODES] && (!props.existing || !existingData[PAYMENT_MODES]) &&
          <Grid item xs={COL4}>
            <div data-testid="payment-modes-field" ref={(node) => storeRef(PAYMENT_MODES, node)}>
              {/* Exclude existing modes while displaying */}
              <PaymentModeList
                data={excludePaymentModes(props.existingData?.paymentModes || [], paymentModes)}
                bankCountry={bankCountry?.path || bankAddress?.alpha2CountryCode}
                bankCurrency={getBankCurrency()}
                paymentModeOptions={paymentModeOptions}
                currencyOptions={props.currencyOptions}
                onChange={value => { setPaymentModes(mergePaymentModes(value, props.existingData?.paymentModes || [])); handleFieldValueChange(PAYMENT_MODES, paymentModes, mergePaymentModes(value, props.existingData?.paymentModes || []))}}
              />
            </div>
          </Grid>}

        {applicableFields['separator1'] && (!props.existing || !existingData['separator1']) && <>
          <Grid item xs={COL4}>
            <Separator secondary />
          </Grid>

          <Grid item xs={COL4}>
            <div className={styles.title}>
              {t("Account details")}
            </div>
          </Grid>
        </>}

        {/* For existing, SHOW if bankName not available */}
        {applicableFields[BANK_NAME] && (!props.existing || !existingData[BANK_NAME]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="bank-name-field" ref={(node) => storeRef(BANK_NAME, node)}>
              <TextBox
                label={t("Bank name")}
                value={bankName}
                disabled={false}
                required={true}
                forceValidate={props.forceValidate}
                validator={(value) => isEmpty(value) ? getI18Text("is required field",{label:t("Bank name")}) : ''}
                onChange={value => { setBankName(value); handleFieldValueChange(BANK_NAME, bankName, value) }}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if accountHolder not available */}
        {applicableFields[ACCOUNT_HOLDER] && (!props.existing || !existingData[ACCOUNT_HOLDER]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="account-holder-field" ref={(node) => storeRef(ACCOUNT_HOLDER, node)}>
              <TextBox
                label={t("Beneficiary name")}
                value={accountHolder}
                disabled={false}
                required={true}
                forceValidate={props.forceValidate}
                warning={accountHolder && (accountHolder !== props.partnerName)}
                validator={(value) => isEmpty(value)
                  ? getI18Text("is required field",{label:t("Beneficiary name")})
                  : (props.partnerName && (value !== props.partnerName) ? t('--doesNotMatchCompanyName--', {company: props.partnerName}) : '')}
                onChange={value => { setAccountHolder(value); handleFieldValueChange(ACCOUNT_HOLDER, accountHolder, value) }}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if accountHolderAddress not available */}
        {applicableFields[ACCOUNT_HOLDER_ADDR] && (!props.existing || !existingData[ACCOUNT_HOLDER_ADDR]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="account-holder-address-field" ref={(node) => storeRef(ACCOUNT_HOLDER_ADDR, node)}>
              <GoogleMultilinePlaceSearch
                id={`${ACCOUNT_HOLDER_ADDR}-${props.index}`}
                label={t("Remittance address")}
                value={accountHolderAddress}
                countryOptions={props.countryOptions}
                required={isFieldRequired(fieldMap, REMITTANCE_ADDR)}
                forceValidate={props.forceValidate}
                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                validator={(value) => isFieldRequired(fieldMap, REMITTANCE_ADDR) ? validateAddressField(t("Remittance address"), value) : ''}
                onChange={(value, countryChanged) => { setAccountHolderAddress(value); handleFieldValueChange(ACCOUNT_HOLDER_ADDR, accountHolderAddress, value) }}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if accountNumber not available */}
        {applicableFields[ACCOUNT_NUMBER] && (!props.existing || !existingData[ACCOUNT_NUMBER]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="account-number-field" ref={(node) => storeRef(ACCOUNT_NUMBER, node)}>
              <EncryptedDataBox
                label={bankCountry?.path === 'SE' ? "Ban()kgiro" : t("Account number")}
                value={accountNumber}
                disabled={false}
                required={true}
                forceValidate={props.forceValidate}
                validator={(value) => isEmpty(value) ? getI18Text("is required field",{label: bankCountry?.path === 'SE' ? "Bankgiro" : t("Account number")}) : ''}
                onChange={value => { setAccountNumber(value); handleFieldValueChange(ACCOUNT_NUMBER, accountNumber, value) }}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if none of bankCode or encryptedBankCode available */}
        {applicableFields[BANK_CODE] && (!props.existing || !existingData[BANK_CODE]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="bank-code-field" ref={(node) => storeRef(BANK_CODE, node)}>
              <label className={styles.label}>
                {props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code")}
                {props.bankKeys?.find(enumVal => enumVal.code === key)?.description &&
                  <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === key)?.description}>
                    <Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)"/>
                  </Tooltip>}
              </label>
              {!bankCodeEncrypted &&
                <TextBox
                  value={bankCode}
                  disabled={false}  
                  required={true}
                  forceValidate={forceValidate || props.forceValidate}
                  validator={(value) => bankCodeError
                    ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code")}) 
                    : (isEmpty(value) ? getI18Text("is required field",{label: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code")}): '')}
                  onChange={value => { setBankCode(value); handleFieldValueChange(BANK_CODE, bankCode, value, true) }}
                />}
              {bankCodeEncrypted && 
                <EncryptedDataBox
                  value={encryptedBankCode}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate || props.forceValidate}
                  validator={(value) => bankCodeError
                    ? getI18Text("is invalid",{ label: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code")}) 
                    : (isEmpty(value) ? getI18Text("is required field",{label: props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || t("Bank code")}): '')}
                  onChange={value => { setEncryptedBankCode(value); handleFieldValueChange(ENCRYPTED_BANK_CODE, encryptedBankCode, value, true) }}
                />}
            </div>
          </Grid>}

        {/* For existing, SHOW if none of bankCode2 or encryptedBankCode2 available */}
        {applicableFields[BANK_CODE_2] && (!props.existing || !existingData[BANK_CODE_2]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="bank-code-2-field" ref={(node) => storeRef(BANK_CODE_2, node)}>
              <label className={styles.label}>
                {props.bankKeys?.find(enumVal => enumVal.code === key2)?.name || key2 || t("Bank code")}
                {props.bankKeys?.find(enumVal => enumVal.code === key2)?.description &&
                  <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === key2)?.description}>
                    <Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)"/>
                  </Tooltip>}
              </label>
              {!bankCode2Encrypted &&
                <TextBox
                  value={bankCode2}
                  disabled={false}  
                  required={true}
                  forceValidate={forceValidate || props.forceValidate}
                  validator={(value) => bankCode2Error
                    ? getI18Text("is invalid", { label: props.bankKeys?.find(enumVal => enumVal.code === key2)?.name || key2 || t("Bank code")}) 
                    : (isEmpty(value) ? getI18Text("is required field",{label: props.bankKeys?.find(enumVal => enumVal.code === key2)?.name || key2 || t("Bank code")}): '')}
                  onChange={value => { setBankCode2(value); handleFieldValueChange(BANK_CODE_2, bankCode2, value, true) }}
                />}
              {bankCode2Encrypted && 
                <EncryptedDataBox
                  value={encryptedBankCode2}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate || props.forceValidate}
                  validator={(value) => bankCode2Error
                    ? getI18Text("is invalid",{ label: props.bankKeys?.find(enumVal => enumVal.code === key2)?.name || key2 || t("Bank code")}) 
                    : (isEmpty(value) ? getI18Text("is required field",{label: props.bankKeys?.find(enumVal => enumVal.code === key2)?.name || key2 || t("Bank code")}): '')}
                  onChange={value => { setEncryptedBankCode(value); handleFieldValueChange(ENCRYPTED_BANK_CODE_2, encryptedBankCode2, value, true) }}
                />}
            </div>
          </Grid>}
        
        {/* For existing, SHOW if none of internationalCode or encryptedInternationalBankCode available */}
        {applicableFields[INTERNATIONAL_CODE] && (!props.existing || !existingData[INTERNATIONAL_CODE]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="int-bank-code-field" ref={(node) => storeRef(INTERNATIONAL_CODE, node)}>
              <label className={styles.label}>
                {(props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.name || internationalKeyOption?.path || t("International bank code"))}
                {props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.description &&
                  <Tooltip title={props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.description} >
                    <Info size={16} cursor="pointer" color="var(--warm-neutral-shade-300)"/>
                  </Tooltip>}
              </label>
              {!internationalCodeEncrypted &&
                <TextBox
                  value={internationalCode}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate || props.forceValidate}
                  validator={(value) => internationalCodeError
                    ? getI18Text("is invalid",{label:(props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.name || internationalKeyOption?.path || t("International bank code"))})
                    : (isEmpty(value)) ? getI18Text("is required field",{label: props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.name || internationalKeyOption?.path ||t("International bank code")}) : ''}
                  onChange={value => { setInternationalCode(value); handleFieldValueChange(INTERNATIONAL_CODE, internationalCode, value, true) }}
                />}
              {internationalCodeEncrypted &&
                <EncryptedDataBox
                  value={encryptedInternationalBankCode}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate || props.forceValidate}
                  validator={(value) => internationalCodeError
                    ? getI18Text("is invalid",{label: props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.name || internationalKeyOption?.path || t("International bank code")})
                    : (isEmpty(value) ? getI18Text("is required field",{label: props.bankKeys?.find(enumVal => enumVal.code === internationalKeyOption?.path)?.name || internationalKeyOption?.path || t("International bank code")}) : '')}
                  onChange={value => { setEncryptedInternationalBankCode(value); handleFieldValueChange(ENCRYPTED_INTERNATIONAL_CODE, encryptedInternationalBankCode, value, true) }}
                />}
            </div>
          </Grid>}

        {/* For existing, SHOW if swiftCode not available */}
        {applicableFields[SWIFT_CODE] && (!props.existing || !existingData[SWIFT_CODE]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="swift-code-field" ref={(node) => storeRef(SWIFT_CODE, node)}>
              <TextBox
                label={props.bankKeys?.find(enumVal => enumVal.code === 'swift')?.name || 'SWIFT'}
                value={swiftCode}
                disabled={isFieldDisabled(fieldMap, SWIFT_CODE)}
                required={isFieldRequired(fieldMap, SWIFT_CODE)}
                forceValidate={forceValidate || props.forceValidate}
                validator={(value) => !isFieldRequired(fieldMap, SWIFT_CODE)
                  ? ''
                  : (swiftCodeError
                    ? getI18Text("is invalid", { label: 'SWIFT' })
                    : isEmpty(value) ? getI18Text("is required field", { label: 'SWIFT' }) : '')}
                onChange={value => { setSwiftCode(value); handleFieldValueChange(SWIFT_CODE, swiftCode, value, true) }}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if checkDeliveryAddress not available */}
        {applicableFields[CHECK_DELIVERY_ADDRESS] && (!props.existing || !existingData[CHECK_DELIVERY_ADDRESS]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="check-delivery-address-field" ref={(node) => storeRef(CHECK_DELIVERY_ADDRESS, node)}>
              <GoogleMultilinePlaceSearch
                id={`${CHECK_DELIVERY_ADDRESS}-${props.index}`}
                label={t("--checkDeliveryAddress--")}
                value={checkDeliveryAddress}
                countryOptions={props.countryOptions}
                required={true}
                forceValidate={props.forceValidate}
                validator={(value) => validateAddressField(t("--checkDeliveryAddress--"), value)}
                onChange={(value, countryChanged) => { setCheckDeliveryAddress(value); handleFieldValueChange(CHECK_DELIVERY_ADDRESS, checkDeliveryAddress, value) }}
                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if attachment not available */}
        {applicableFields['separator2'] && (!props.existing || !existingData['separator2']) && <>
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
        {applicableFields[DOCUMENT_TYPE] && (!props.existing || !existingData[DOCUMENT_TYPE]) &&
          <Grid item md={COL2} xs={COL4}>
            <div data-testid="ducument-type-field" ref={(node) => storeRef(DOCUMENT_TYPE, node)}>
              <TypeAhead
                label={t("--selectProofOfDucumentForBank--")}
                value={documentType}
                options={documentTypeOptions}
                disabled={false}
                required={isFieldRequired(fieldMap, BANK_DOUCUMENT)}
                forceValidate={props.forceValidate}
                validator={(value) => (isFieldRequired(fieldMap, BANK_DOUCUMENT) && isEmpty(value)) ? getI18Text("is required field",{ label: t("--documentType--") }) : ''}
                onChange={value =>  { setDocumentType(value); handleFieldValueChange(DOCUMENT_TYPE, documentType, value) }}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if attachment not available */}
        {applicableFields[ATTACHMENT] && (!props.existing || !existingData[ATTACHMENT]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="attachment-field" ref={(node) => storeRef(ATTACHMENT, node)}>
              <AttachmentBox
                label={(documentTypeOptions && documentTypeOptions.length === 1) ? documentType?.displayName : t("--attachBankReferenceOrStatement--")}
                value={attachment}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={false}
                required={isFieldRequired(fieldMap, BANK_DOUCUMENT)}
                forceValidate={props.forceValidate}
                validator={(value) => (isFieldRequired(fieldMap, BANK_DOUCUMENT) && isEmpty(value)) ? getI18Text("is required field",{ label: t("--attachment--") }) : ''}
                onChange={(file) => { setDocumentType(file); handleFieldValueChange(ATTACHMENT, attachment, file, false, true) }}
                onPreview={() => loadFile(ATTACHMENT, attachment.mediatype, attachment.filename)}
              />
            </div>
          </Grid>}

        {/* For existing, SHOW if intermediaryBankCode not available */}
        {applicableFields['separator3'] && (!props.existing || !existingData['separator3']) &&
          <Grid item xs={COL4}>
            <Separator secondary />
          </Grid>}

        {/* For existing, SHOW if intermediaryBankCode not available */}
        {applicableFields[INTREMEDIARY_REQUIRED] && (!props.existing || !existingData[INTREMEDIARY_REQUIRED]) &&
          <Grid item xs={COL4}>
            <div data-testid="intermediary-required-field" ref={(node) => storeRef(INTREMEDIARY_REQUIRED, node)}>
              <ToggleSwitch
                label={t("FFC banking info")}
                value={intermediaryBankRequired}
                falsyLabel={getI18Text("No")}
                truthyLabel={getI18Text("Yes")}
                onChange={(value) => { setIntermediaryBankRequired(value); handleFieldValueChange(INTREMEDIARY_REQUIRED, intermediaryBankRequired, value) }}
              />
            </div>
          </Grid>}

        {applicableFields[INTREMEDIARY_NAME] && (!props.existing || !existingData[INTREMEDIARY_NAME]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="intermediary-bank-name-field" ref={(node) => storeRef(INTREMEDIARY_NAME, node)}>
              <TextBox
                label={t("Intermediary bank name")}
                value={intermediaryBankName}
                disabled={false}
                required={true}
                forceValidate={props.forceValidate}
                validator={(value) => isEmpty(value) ? getI18Text("is required field", { label: t("Intermediary bank name") }) : ''}
                onChange={value => { setIntermediaryBankName(value); handleFieldValueChange(INTREMEDIARY_NAME, intermediaryBankName, value) }}
              />
            </div>
          </Grid>}

        {applicableFields[INTREMEDIARY_ADDRESS] && (!props.existing || !existingData[INTREMEDIARY_ADDRESS]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="intermediary-bank-address-field" ref={(node) => storeRef(INTREMEDIARY_ADDRESS, node)}>
              <GoogleMultilinePlaceSearch
                id={`${INTREMEDIARY_ADDRESS}-${props.index}`}
                label={t("Intermediary bank address")}
                value={intermediaryBankAddress}
                countryOptions={props.countryOptions}
                forceValidate={props.forceValidate}
                onChange={(value, countryChanged) => { setIntermediaryBankAddress(value); countryChanged && handleFieldValueChange(INTREMEDIARY_ADDRESS, intermediaryBankAddress, value) }}
                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
              />
            </div>
          </Grid>}

        {applicableFields[INTREMEDIARY_CODE] && (!props.existing || !existingData[INTREMEDIARY_CODE]) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="intermediary-bank-code-field" ref={(node) => storeRef(INTREMEDIARY_CODE, node)}>
              <TextBox
                label={props.bankKeys?.find(enumVal => enumVal.code === intermediaryKey)?.name || intermediaryKey || t("Intermediary bank code")}
                value={intermediaryBankCode}
                disabled={false}
                required={true}
                forceValidate={forceValidate || props.forceValidate}
                validator={(value) => intermediaryCodeError ?
                  getI18Text("is invalid", { label: t("Intermediary bank code") }) : isEmpty(value) ? getI18Text("is required field", { label: t("Intermediary bank code") }) : ''}
                onChange={value => { setIntermediaryBankCode(value); handleFieldValueChange(INTREMEDIARY_CODE, intermediaryBankCode, value, true) }}
              />
            </div>
          </Grid>}
      </>}
    </Grid>
  )
}
