/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { EncryptedData, IbanSupport } from '../../Types/common'
import { CountryBankKey, Field } from '../types'
import { isAddressInvalid, isFieldOmitted, isFieldRequired } from '../util'
import { PaymentDetail, PaymentMode, PaymentModeConfig, PaymentModeType } from '../BankInfoV3/types'

export const BUSSINESS_EMAIL = 'businessEmail'
export const ACCEPT_MULTIPLE_PAYMENT = 'acceptMultiplePayment'
export const ALLOW_PAYMENT_SELECTION = 'allowPaymentModeSelection'
export const ALLOW_BANK_PAYOUT_CURRNECY_REQUEST = 'allowBankPayoutCurrencyRequest'
export const PAYMENT_DETAILS = 'paymentDetails'
export const EXISTING_PAYMENT_DETAILS = 'existingPaymentDetails'
export const INSTRUCTION = 'instruction'
export const ACCOUNT_SECTION_SEPAROTOR = 'ACCOUNT_SECTION_SEPAROTOR'
export const BANK_ADDRESS = 'bankAddress'
export const COMPANY_ENTITIES = 'companyEntities'
export const PAYMENT_MODES = 'paymentModes'
export const BANK_NAME = 'bankName'
export const ACCOUNT_HOLDER = 'accountHolder'
export const ACCOUNT_HOLDER_ADDR = 'accountHolderAddress'
export const REMITTANCE_ADDR = 'remittanceAddress'
export const ACCOUNT_TYPE = 'accountType'
export const ACCOUNT_NUMBER = 'accountNumber'
export const PAYMENT_ADDRESS = 'paymentAddress'
export const KEY = 'key'
export const BANK_CODE = 'bankCode'
export const ENCRYPTED_BANK_CODE = 'encryptedBankCode'
export const BANK_CODE_ERROR = 'bankCodeError'
export const INTERNATIONAL_KEY = 'internationalKey'
export const INTERNATIONAL_CODE = 'internationalCode'
export const ENCRYPTED_INTERNATIONAL_CODE = 'encryptedInternationalBankCode'
export const INTERNATIONAL_CODE_ERROR = 'internationalCodeError'
export const SWIFT_CODE = 'swiftCode'
export const SWIFT_CODE_ERROR = 'swiftCodeError'
export const BANK_DOUCUMENT = 'bankDocument'
export const DOCUMENT_TYPE = 'documentType'
export const ATTACHMENT = 'attachment'
export const INTREMEDIARY_REQUIRED = 'intermediaryBankRequired'
export const INTREMEDIARY_NAME = 'intermediaryBankName'
export const INTREMEDIARY_ADDRESS = 'intermediaryBankAddress'
export const INTREMEDIARY_KEY = 'intermediaryKey'
export const INTREMEDIARY_CODE = 'intermediaryBankCode'
export const INTREMEDIARY_CODE_ERROR = 'intermediaryCodeError'
export const CHECK_DELIVERY_ADDRESS = 'checkDeliveryAddress'
export const IS_DEMESTIC = 'isDomestic'
export const IS_INTERNATIONAL = 'isInternational'
export const IS_IBAN_AVAILABLE = 'isIbanAvailable'
export const SELECTED = 'selectedExistingBankInfo'
export const NO_DETAILS_NEEDED = 'NO_DETAILS_NEEDED'
export const BANK_KEYS = 'bankKeys'

export function mapToInternalModeType (mode: PaymentModeType): PaymentModeType {
  // Treat ach, wire and online as 'Bank transfer'
  if (mode === 'ach' || mode === 'wire' || mode === 'online') {
    return 'banktransfer'
  }
  return mode
}
export function mapToServerSideModeTypes (mode: PaymentModeType): PaymentModeType[] {
  // Convert 'Bank transfer' to ach, wire or online
  if (mode === 'banktransfer') {
    return ['ach', 'wire', 'online']
  }
  return [mode]
}
export function mapToCountrySpecificModeType (mode: PaymentModeType, bankCountry: string, entityCountry: string, paymentModeConfig: PaymentModeConfig[]): PaymentModeType {
  // Convert 'Bank transfer' to ach, wire or online, depending on countries
  if (mode === 'banktransfer') {
    const bankCountryConfig: PaymentModeConfig = paymentModeConfig.find(config => config.alpha2Code === bankCountry)
    const domestic = bankCountryConfig?.domestic || []
    const international = bankCountryConfig?.international || []
    const applicableModes = bankCountry
      ? (bankCountry === entityCountry) ? domestic : international
      : [...domestic, ...international]

    return applicableModes.find(mode => {
      return mode === 'ach' || mode === 'wire' || mode === 'online'
    })
  }
  return mode
}

function getDomesticPaymentMode (paymentDetail: PaymentDetail): PaymentMode {
  return paymentDetail.paymentModes?.find(mode => mode.companyEntityCountry === paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode)
}

function getInternationalPaymentModes (paymentDetail: PaymentDetail): PaymentMode[] {
  return paymentDetail.paymentModes?.filter(mode => mode.companyEntityCountry !== paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode) || []
}

function isBankAccountNeeded (modes: PaymentMode[]): boolean {
  return modes.some(mode => (mode?.type === 'ach' || mode?.type === 'online' || mode?.type === 'wire' || mode?.type === 'banktransfer'))
}
function isPaymentAddressNeeded (modes: PaymentMode[]): boolean {
  return modes.some(mode => (mode?.type === 'bankgirot'))
}
function isCheckAddressNeeded (modes: PaymentMode[]): boolean {
  return modes.some(mode => (mode?.type === 'check'))
}
function isDirectDebitOnly (modes: PaymentMode[]): boolean {
  const methodOtherThanDirectDebitFound = modes.some(mode => (mode?.type !== 'directDebit'))
  return !methodOtherThanDirectDebitFound
}

function isIbanNA (ibanSupport: IbanSupport): boolean {
  return ibanSupport === 'notSupported'
}
function isIbanMandatory (ibanSupport: IbanSupport): boolean {
  return ibanSupport === 'mandatory'
}
function isIbanOptional (ibanSupport: IbanSupport): boolean {
  return !ibanSupport || ibanSupport === 'recommended'
}

function isDomesticIbanNA (bankKeys: CountryBankKey): boolean {
  return isIbanNA(bankKeys?.domesticIbanMandatory)
}
function isDomesticIbanMandatory (bankKeys: CountryBankKey): boolean {
  return isIbanMandatory(bankKeys?.domesticIbanMandatory)
}
function isDomesticIbanOptional (bankKeys: CountryBankKey): boolean {
  return isIbanOptional(bankKeys?.domesticIbanMandatory)
}

function isInternationalIbanNA (bankKeys: CountryBankKey): boolean {
  return isIbanNA(bankKeys?.internationalIbanMandatory)
}
function isInternationalIbanMandatory (bankKeys: CountryBankKey): boolean {
  return isIbanMandatory(bankKeys?.internationalIbanMandatory)
}
function isInternationalIbanOptional (bankKeys: CountryBankKey): boolean {
  return isIbanOptional(bankKeys?.internationalIbanMandatory)
}

// FIELD VISIBILITY CONDITIONS :-------

export function canShowIbanToggle (paymentDetail: PaymentDetail): boolean {
  // bankCode is shown for
  // 1. IBAN-optional Domestic
  // 2. IBAN-optional Intertnationals

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false
  const isDomesticIbanNeeded = isDomesticAccNeeded && isDomesticIbanMandatory(paymentDetail.bankKeys)

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)
  const isIntIbanNeeded = isIntAccNeeded && isInternationalIbanMandatory(paymentDetail.bankKeys)

  return (isDomesticAccNeeded && (isDomesticIbanOptional(paymentDetail.bankKeys) && !isIntIbanNeeded)) ||
    (isIntAccNeeded && (isInternationalIbanOptional(paymentDetail.bankKeys) && !isDomesticIbanNeeded))
}

export function canShowBankCode (paymentDetail: PaymentDetail): boolean {
  // bankCode is shown for
  // 1. non-IBAN Domestic
  // 2. IBAN-optional Domestic where iban not used
  // 3. non-IBAN Intertnationals
  // 4. IBAN-optional Intertnationals where iban not used

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false
  const isDomesticNonIban = isDomesticIbanNA(paymentDetail.bankKeys)
  const isDomesticIbanNotUsed = isDomesticIbanOptional(paymentDetail.bankKeys) && (paymentDetail?.bankInformation?.isIbanAvailable === false)

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)
  const isIntNonIban = isInternationalIbanNA(paymentDetail.bankKeys)
  const isIntIbanNotUsed = isInternationalIbanOptional(paymentDetail.bankKeys) && (paymentDetail?.bankInformation?.isIbanAvailable === false)

  return (isDomesticAccNeeded && isDomesticNonIban) || (isDomesticAccNeeded && isDomesticIbanNotUsed) ||
    (isIntAccNeeded && isIntNonIban) || (isIntAccNeeded && isIntIbanNotUsed)
}

export function canShowInternationalCode (paymentDetail: PaymentDetail): boolean {
  // internationalCode (iban) is shown for
  // 1. IBAN Domestic
  // 4. IBAN-optional Domestic where iban used
  // 3. IBAN Intertnationals
  // 4. IBAN-optional Intertnationals where iban used

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false
  const isDomesticIbanNeeded = isDomesticIbanMandatory(paymentDetail.bankKeys)
  const isDomesticIbanUsed = isDomesticIbanOptional(paymentDetail.bankKeys) && paymentDetail?.bankInformation?.isIbanAvailable

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)
  const isIntIbanNeeded = isInternationalIbanMandatory(paymentDetail.bankKeys)
  const isIntIbanUsed = isInternationalIbanOptional(paymentDetail.bankKeys) && paymentDetail?.bankInformation?.isIbanAvailable

  return (isDomesticAccNeeded && isDomesticIbanNeeded) || (isDomesticAccNeeded && isDomesticIbanUsed) ||
    (isIntAccNeeded && isIntIbanNeeded) || (isIntAccNeeded && isIntIbanUsed)
}

export function canShowAccountType (paymentDetail: PaymentDetail): boolean {
  // account type is shown with account details,
  // if there are accountTypes available

  const accountTypes = paymentDetail.bankKeys?.accountTypes || []
  return canShowBankCode(paymentDetail) && accountTypes.length > 0
}

export function canShowAccountNumber (paymentDetail: PaymentDetail): boolean {
  // account number is shown with account details
  return canShowBankCode(paymentDetail)
}

export function canShowPaymentAddress (paymentDetail: PaymentDetail): boolean {
  // payment address is shown for
  // 1. Domestic VPA
  // 2. Intertnationals VPA

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticVPANeeded = domesticPaymentMode ? isPaymentAddressNeeded([domesticPaymentMode]) : false

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntVPANeeded = isPaymentAddressNeeded(internationalPaymentModes)
  
  return isDomesticVPANeeded || isIntVPANeeded
}

export function canShowAccountHolderName (paymentDetail: PaymentDetail): boolean {
  // account name is shown for
  // 1. Domestic bank
  // 2. Domestic VPA
  // 3. Domestic/International Check
  // 3. Intertnationals
  // Hide if IBAN-optional unanswered

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false
  const isDomesticVPANeeded = domesticPaymentMode ? isPaymentAddressNeeded([domesticPaymentMode]) : false
  const isDomesticCheckAddrNeeded = domesticPaymentMode ? isCheckAddressNeeded([domesticPaymentMode]) : false
  const isDomesticIbanUnanswered = isDomesticIbanOptional(paymentDetail.bankKeys) && paymentDetail?.bankInformation?.isIbanAvailable === undefined

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)
  const isInternationalCheckAddrNeeded = isCheckAddressNeeded(internationalPaymentModes)
  const isIntIbanUnanswered = isInternationalIbanOptional(paymentDetail.bankKeys) && paymentDetail?.bankInformation?.isIbanAvailable === undefined

  return ((isDomesticAccNeeded && !isDomesticIbanUnanswered) || isDomesticVPANeeded || isDomesticCheckAddrNeeded) || ((isIntAccNeeded && !isIntIbanUnanswered) || isInternationalCheckAddrNeeded)
}

export function canShowAccountHolderAddress (paymentDetail: PaymentDetail): boolean {
  // account address is shown with account details
  return canShowBankCode(paymentDetail)
}

export function canShowBankName (paymentDetail: PaymentDetail): boolean {
  // bank name is shown for
  // 1. Domestic account
  // 2. Intertnational account
  // Hide if IBAN-optional unanswered

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false
  const isDomesticIbanUnanswered = isDomesticIbanOptional(paymentDetail.bankKeys) && paymentDetail?.bankInformation?.isIbanAvailable === undefined

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)
  const isIntIbanUnanswered = isInternationalIbanOptional(paymentDetail.bankKeys) && paymentDetail?.bankInformation?.isIbanAvailable === undefined

  return (isDomesticAccNeeded && !isDomesticIbanUnanswered) || (isIntAccNeeded && !isIntIbanUnanswered)
}

export function canShowCheckAddress (paymentDetail: PaymentDetail): boolean {
  // check address is shown for Domestic/International check
  
  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticCheckAddrNeeded = domesticPaymentMode ? isCheckAddressNeeded([domesticPaymentMode]) : false

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isInternationalCheckAddrNeeded = isCheckAddressNeeded(internationalPaymentModes)

  return isDomesticCheckAddrNeeded || isInternationalCheckAddrNeeded
}

export function canShowSwiftCode (paymentDetail: PaymentDetail): boolean {
  // swift code is shown for
  // 1. non-IBAN Intertnationals
  // 2. IBAN-optional Intertnationals where iban not used

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)
  const isIntNonIban = isInternationalIbanNA(paymentDetail.bankKeys)
  const isIntIbanNotUsed = isInternationalIbanOptional(paymentDetail.bankKeys) && (paymentDetail?.bankInformation?.isIbanAvailable === false)

  return (isIntAccNeeded && isIntNonIban) || (isIntAccNeeded && isIntIbanNotUsed)
}

export function canRespectSwiftCodeConfig (paymentDetail: PaymentDetail): boolean {
  // follow swift code config is for
  // 1. non-IBAN Domestic
  // 2. IBAN-optional Domestic where iban not used

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false
  const isDomesticNonIban = isDomesticIbanNA(paymentDetail.bankKeys)
  const isDomesticIbanNotUsed = isDomesticIbanOptional(paymentDetail.bankKeys) && (paymentDetail?.bankInformation?.isIbanAvailable === false)

  return (isDomesticAccNeeded && isDomesticNonIban) || (isDomesticAccNeeded && isDomesticIbanNotUsed)
}

export function canShowBankDocuments (paymentDetail: PaymentDetail): boolean {
  // bank document is shown for
  // 1. Domestic account
  // 2. Intertnational account

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isDomesticAccNeeded = domesticPaymentMode ? isBankAccountNeeded([domesticPaymentMode]) : false

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isIntAccNeeded = isBankAccountNeeded(internationalPaymentModes)

  return isDomesticAccNeeded || isIntAccNeeded
}

export function canShowIntermediaryBank (paymentDetail: PaymentDetail): boolean {
  return canShowInternationalCode(paymentDetail) || canShowSwiftCode(paymentDetail)
}

export function canDirectDebitMessage (paymentDetail: PaymentDetail): boolean {
  // direct debit message is shown
  // if direct debit is the only method selected

  const domesticPaymentMode = getDomesticPaymentMode(paymentDetail)
  const isNoDomesticDetailsNeeded = domesticPaymentMode ? isDirectDebitOnly([domesticPaymentMode]) : true

  const internationalPaymentModes = getInternationalPaymentModes(paymentDetail)
  const isNoIntDetailsNeeded = isDirectDebitOnly(internationalPaymentModes)

  return paymentDetail.paymentModes && paymentDetail.paymentModes.length > 0 && isNoDomesticDetailsNeeded && isNoIntDetailsNeeded
}

export function mergePaymentModes (list1: PaymentMode[], list2: PaymentMode[]): PaymentMode[] {
  const modes = {}
  list1.forEach(mode => {
    modes[mode.companyEntityCountry] = mode
  })
  list2.forEach(mode => {
    modes[mode.companyEntityCountry] = mode
  })

  return Object.values(modes)
}

export function excludePaymentModes (excludeModes: PaymentMode[], fromModes: PaymentMode[]): PaymentMode[] {
  const modes = {}
  fromModes.forEach(mode => {
    modes[mode.companyEntityCountry] = mode
  })
  excludeModes.forEach(mode => {
    delete modes[mode.companyEntityCountry]
  })

  return Object.values(modes)
}

// FIELD VALIDATIONS :-------

function isEncryptedValueInvalid (value?: EncryptedData): boolean {
  return !value?.maskedValue && !value?.unencryptedValue
}

function isRequiredFieldsInvalid (paymentDetail: PaymentDetail, fieldMap: { [key: string]: Field }): string {
  let invalidFieldId = ''

  if (
    !isFieldOmitted(fieldMap, BANK_DOUCUMENT) && isFieldRequired(fieldMap, BANK_DOUCUMENT) &&
    canShowBankDocuments(paymentDetail) &&
    (!paymentDetail?.documentType || !paymentDetail?.attachment)
  ) {
    invalidFieldId = 'attachment-field'
  } else if (
    (canShowSwiftCode(paymentDetail) || (
      canRespectSwiftCodeConfig(paymentDetail) &&
      !isFieldOmitted(fieldMap, SWIFT_CODE) &&
      isFieldRequired(fieldMap, SWIFT_CODE)
    )) &&
    (!paymentDetail?.bankInformation?.swiftCode || paymentDetail?.bankInformation?.swiftCodeError)
  ) {
    invalidFieldId = 'swift-code-field'
  } else if (
    !isFieldOmitted(fieldMap, REMITTANCE_ADDR) && isFieldRequired(fieldMap, REMITTANCE_ADDR) &&
    canShowAccountHolderAddress(paymentDetail) &&
    (!paymentDetail?.bankInformation?.accountHolderAddress || isAddressInvalid(paymentDetail?.bankInformation?.accountHolderAddress))
  ) {
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
    } else if (canShowPaymentAddress(paymentDetail) &&
      (!paymentDetail?.bankInformation?.paymentAddress && isEncryptedValueInvalid(paymentDetail?.bankInformation?.paymentAddress))
    ) {
      isInvalid = true
      invalidFieldId = 'payment-address-field'
    } else if (canShowIbanToggle(paymentDetail) && (paymentDetail?.bankInformation?.isIbanAvailable === undefined)) {
      isInvalid = true
      invalidFieldId = 'is-iban-available-field'
    } else if (canShowInternationalCode(paymentDetail) && paymentDetail?.isInternational && (
      (!paymentDetail?.bankInformation?.internationalCode && isEncryptedValueInvalid(paymentDetail?.bankInformation?.encryptedInternationalBankCode)) ||
      paymentDetail?.bankInformation?.internationalCodeError)
    ) {
      isInvalid = true
      invalidFieldId = 'int-bank-code-field'
    } else if (canShowBankCode(paymentDetail) && paymentDetail?.isDomestic && (
      (!paymentDetail?.bankInformation?.bankCode && isEncryptedValueInvalid(paymentDetail?.bankInformation?.encryptedBankCode)) ||
      paymentDetail?.bankInformation?.bankCodeError)
    ) {
      isInvalid = true
      invalidFieldId = 'bank-code-field'
    } else if (canShowAccountType(paymentDetail) && (!paymentDetail?.bankInformation?.accountType)) {
      isInvalid = true
      invalidFieldId = 'account-type-field'
    } else if (canShowAccountNumber(paymentDetail) && isEncryptedValueInvalid(paymentDetail?.bankInformation?.accountNumber)) {
      isInvalid = true
      invalidFieldId = 'account-number-field'
    } else if (canShowAccountHolderName(paymentDetail) && !paymentDetail?.bankInformation?.accountHolder) {
      isInvalid = true
      invalidFieldId = 'account-holder-field'
    } else if (canShowBankName(paymentDetail) && !paymentDetail?.bankInformation?.bankName) {
      isInvalid = true
      invalidFieldId = 'bank-name-field'
    } else if (canShowCheckAddress(paymentDetail) && (
      !paymentDetail?.bankInformation?.checkDeliveryAddress ||
      isAddressInvalid(paymentDetail?.bankInformation?.checkDeliveryAddress) ||
      (paymentDetail?.bankInformation?.checkDeliveryAddress?.alpha2CountryCode !== paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode)
    )) {
      isInvalid = true
      invalidFieldId = 'check-delivery-address-field'
    } else if (paymentDetail?.isInternational && paymentDetail?.intermediaryBankRequired && !paymentDetail?.intermediaryBankInformation?.bankName) {
      isInvalid = true
      invalidFieldId = 'intermediary-bank-name-field'
    } else if (paymentDetail?.isInternational && paymentDetail?.intermediaryBankRequired &&
      (!paymentDetail?.intermediaryBankInformation?.bankCode || paymentDetail?.intermediaryBankInformation?.bankCodeError)
    ) {
      isInvalid = true
      invalidFieldId = 'intermediary-bank-code-field'
    }
  }

  return isInvalid ? invalidFieldId : ''
}

export function arePaymentDetailsSame (payment1: PaymentDetail, payment2: PaymentDetail): boolean {
  const areAccountNumbersSame =
    (payment1?.bankInformation?.accountNumber?.maskedValue === payment2?.bankInformation?.accountNumber?.maskedValue) ||
    (payment1?.bankInformation?.accountNumber?.unencryptedValue === payment2?.bankInformation?.accountNumber?.unencryptedValue)
  const areIbansSame =
    (payment1?.bankInformation?.encryptedInternationalBankCode?.maskedValue === payment2?.bankInformation?.accountNumber?.maskedValue) ||
    (payment1?.bankInformation?.encryptedInternationalBankCode?.unencryptedValue === payment2?.bankInformation?.accountNumber?.unencryptedValue)
  const areCheckDetailsSame =
    (payment1?.bankInformation?.accountHolder === payment2?.bankInformation?.accountHolder) &&
    (payment1?.bankInformation?.checkDeliveryAddress?.alpha2CountryCode === payment2?.bankInformation?.checkDeliveryAddress?.alpha2CountryCode) &&
    (payment1?.bankInformation?.checkDeliveryAddress?.line1 === payment2?.bankInformation?.checkDeliveryAddress?.line1) &&
    (payment1?.bankInformation?.checkDeliveryAddress?.city === payment2?.bankInformation?.checkDeliveryAddress?.city)
  const arePaymentAddressSame =
    (payment1?.bankInformation?.paymentAddress === payment2?.bankInformation?.paymentAddress)

  return areAccountNumbersSame || areIbansSame || areCheckDetailsSame || arePaymentAddressSame
}

export function areAccountNamesSame (name1?: string, name2?: string): boolean {
  if (name1 && name2) {
    const normalizedName1 = name1.trim().toLowerCase()
    const normalizedName2 = name2.trim().toLowerCase()

    return normalizedName1 === normalizedName2
  }

  return true
}
