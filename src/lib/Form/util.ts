import moment from 'moment'
import { ActivationStatus, Address, Attachment, IDRef, LegalEntity, Option, ProcessTask, ProcessVariables, SupplierCapabilities, TaskStatus, User, VendorRef } from './../Types'
import { BankKeyLookupEntry, ContractTypeDefinitionField, CostDetail, EnumsDataObject, Field, ProductLine, ExistingContract, ContractFieldSection, ContractTypeDefinition, ContractFields, Cost, CompanyInfoV3FormData, ContractFieldConfig, ContractRevision, ContractYearlySplit, ContractFormData, DocumentRef } from "./types";
import STATE_CODE_DISPLAYNAMES from '../GooglePlaceSearch/state-code-displaynames'
import { csvFileAcceptType, docFileAcceptType, emlFileAcceptTypes, imageFileAcceptType, msgFileAcceptTypes, pdfFileAcceptType, xlsFileAcceptType } from '../Inputs'
import { BankKey, Contact, ContractDetail, ContractRuntimeStatus, Document, EncryptedData, ImageMetadata, Money, POStatus, Phone, PurchaseOrder, SupplierUser, TaxItem, TaxObject, UserId } from '../Types/common';
import { SignedUser } from '../SigninService';
import { ContactConfig, ItemDetailsFields, ItemListConfig, MultiConfig, ObjectSelectorConfig, ObjectType, SplitAccountingConfig, SplitType } from '../CustomFormDefinition/types/CustomFormModel';
import { DEFAULT_CURRENCY, isNumber, mapCurrencyToSymbol } from '../util';
import { parsePhoneNumber } from 'react-phone-number-input';
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames';
import { getI18Text as getI18ControlText, getI18Text } from '../i18n'
import { BlockStatuses, NormalizedVendorRef, SegmentationDetail, SupplierDimension, SupplierScope, SupplierSegmentation } from '../Types/vendor';
import { DATE_DISPLAY_FORMAT } from '../Inputs/utils.service';
import { getSessionLocale } from '../sessionStorage';

export const EMAIL_ICON_RESOURCES_URL = process.env.REACT_APP_EMAIL_ICON_RESOURCES
const ORO_ASSETS_BASE = process.env.REACT_APP_ORO_ASSETS_BASE

export const DATE_FIELD_INPUT_FORMAT = 'MMM dd, yyyy'
export const COL4 = 12
export const COL3 = 9
export const COL2 = 6
export const COL1 = 3

export function getEmptyAddress(): Address {
  return {
    alpha2CountryCode: '',
    city: '',
    line1: '',
    line2: '',
    line3: '',
    postal: '',
    province: '',
    streetNumber: '',
    unitNumber: ''
  }
}

export function getEmptyTaxItem(defaultCurrency?: string): TaxItem[] {
  return [
    {
      amount: {amount: 0, currency: defaultCurrency || DEFAULT_CURRENCY},
      percentage: 0,
      taxableAmount: {amount: 0, currency: defaultCurrency || DEFAULT_CURRENCY},
      taxCode: {
        erpId: '',
        id: '',
        name: '',
        refId: ''
      }
    }
  ]
}

export function getEmptyTax(defaultCurrency?: string): TaxObject {
  return {
    amount: {amount: 0, currency: defaultCurrency || DEFAULT_CURRENCY},
    items: getEmptyTaxItem(defaultCurrency)
  }
}

export const OROFORMIDS = {
  OroSupplierDetailForm: 'OroSupplierDetailForm',
  OroSupplierFinalizationForm: 'OroSupplierFinalizationForm',
  OroPartnerDetailForm: 'OroPartnerDetailForm',
  OroProjectDetails: 'OroProjectDetails',
  OroSupplierRequestForm: 'OroSupplierRequestForm',
  OroPartnerRequest: 'OroPartnerRequestForm',
  OroQuotes: 'OroQuotes',
  OroFormReview: 'OroFormReview',
  OroCompanyInfo: 'OroSupplierCompanyInformation',
  OroBankInfo: 'OroSupplierBankInformation',
  OroBankInfoUpdate: 'OroSupplierBankUpdate',
  OroTaxinfo: 'OroSupplierTaxInformation',
  OroAPReview: 'OroAPReview',
  OroDataPrivacy: 'OroDataPrivacy',
  OroIntellectualProperty: 'OroIntellectualProperty',
  OroITDataSecurity: 'OroITDataSecurity',
  OroITSecurity: 'OroITSecurity',
  OroFinancialRisk: 'OroFinancialRisk',
  OroSoftwareDataPurchaseForm: 'OroSoftwareDataPurchaseForm',
  OroRiskScoreForm: 'OroRiskScoreForm',
  OroDocumentUpload: 'OroDocumentUpload',
  OroSupplierInformationUpdateForm: 'OroSupplierInformationUpdateForm',
  OroSupplierCallbackForm: 'OroSupplierCallbackForm',
  OroSanctionListForm: 'OroSanctionListForm',
  OroSupplierSelectionForm: 'OroSupplierSelectionForm',
  OroSoftwareRequestForm: 'OroSoftwareRequestForm',
  OroContractNegotiationForm: 'OroContractNegotiationForm',
  OroContractorDetailForm: 'OroContractorDetailForm',
  OroContractorFinalizationForm: 'OroContractorFinalizationForm',
  OroDomainRiskScoreForm: 'OroDomainRiskScoreForm',
  OroSupplierRequest: 'OroSupplierRequest',
  OroSupplierStatusUpdate: 'OroSupplierStatusUpdate',
  OroCompanyInfoV2: 'OroSupplierCompanyInformationV2',
  OroCompanyIndividualV2: 'OroSupplierIndividualInformationV2',
  OroContractFinalisationForm: 'OroContractFinalisationForm',
  OroContractCommercialForm: 'OroContractCommercialForm',
  OroChangeOrderForm: 'OroChangeOrderForm',
  OroSupplierSelectForm: 'OroSupplierSelectForm',
  OroIndividualBankInformation: 'OroIndividualBankInformation',
  OroContractUpdateSummaryForm: 'OroContractUpdateSummaryForm',
  OroWorkstreamRequestAccessForm: 'OroWorkstreamRequestAccessForm'
}

export const DEFAULT_REVISION: ContractRevision = {
  proposalDescription: '',
  duration: null,
  poDuration: null,
  fixedSpend: null,
  variableSpend: null,
  recurringSpend: null,
  totalRecurringSpend: null,
  oneTimeCost: null,
  totalValue: null,
  negotiatedSavings: null,
  averageVariableSpend: null,
  totalEstimatedSpend: null,
  yearlySplits: [],
  contractType: null,
  currency: null,
  startDate: '',
  endDate: '',
  serviceStartDate: '',
  serviceEndDate: '',
  autoRenew: false,
  autoRenewNoticePeriod: null,
  includesCancellation: false,
  cancellationDeadline: '',
  includesPriceCap: false,
  priceCapIncrease: null,
  includesOptOut: false,
  optOutDeadline: '',
  renewalAnnualValue: null,
  paymentTerms: null,
  billingCycle: '',
  billingCycleRef: null,
  includesLateFees: false,
  lateFeesPercentage: null,
  lateFeeDays: null,
  terminationOfConvenience: false,
  terminationOfConvenienceDays: null,
  liabilityLimitation: false,
  liabilityLimitationMultiplier: null,
  liabilityLimitationCap: null,
  tenantLiabilityLimitationCap: null,
  confidentialityClause: false,
  tenantFixedSpend: null,
  tenantVariableSpend: null,
  tenantRecurringSpend: null,
  tenantOneTimeCost: null,
  tenantTotalValue: null,
  tenantRenewalAnnualValue: null,
  tenantNegotiatedSavings: null,
  tenantAverageVariableSpend: null,
  tenantTotalEstimatedSpend: null,
  tenantTotalRecurringSpend: null
}

export function getEmptyPhone(): Phone {
  return {
    dialCode: '',
    isoCountryCode: '',
    number: ''
  }
}

export function getDafaultMultiConfig(): MultiConfig {
  return {
    labelPrefix: 'Address',
    minCount: 1,
    isButton: false
  }
}

export function getDefaultItemListConfig(): ItemListConfig {
  return {
    visibleFields: [ItemDetailsFields.name],
    mandatoryFields: [ItemDetailsFields.name]
  }
}

export function getDefaultContactConfig (): ContactConfig {
  return {
    visibleFields: [],
    mandatoryFields: [],
    readonlyFields: [],
    disableAdd: false,
    disableDelete: false,
    listItemPrefix: 'Contact',
    miniumSize: 1
  }
}
export function getDefaultObjectSelectorConfig(): ObjectSelectorConfig {
  return {
    type: ObjectType.po,
    includeCompleted: false
  }
}

export function getDefaultSplitAccountingConfig(): SplitAccountingConfig {
  return {
    masterdataType: '',
    type: SplitType.percentage
  }
}

export function parseAddressToFIll(place: google.maps.places.PlaceResult): Address {
  const filledAddress: Address = getEmptyAddress()

  for (const component of place?.address_components as google.maps.GeocoderAddressComponent[]) {
    const componentType = component.types[0]

    switch (componentType) {
      case "street_number":
        filledAddress.streetNumber = component.long_name
        break
      case "route":
        filledAddress.unitNumber = component.long_name
        break
      case 'premise':
      case 'neighborhood':
        filledAddress.line1 = filledAddress.line1 ? `${filledAddress.line1}, ${component.long_name}` : component.long_name
        break
      case "sublocality_level_5":
      case "sublocality_level_4":
      case "sublocality_level_3":
      case "sublocality_level_2":
        if (filledAddress.line1) {
          filledAddress.line2 = filledAddress.line2 ? `${filledAddress.line2}, ${component.long_name}` : component.long_name
        } else {
          filledAddress.line1 = component.long_name
        }
        break

      case "sublocality_level_1":
      case 'sublocality':
        if (filledAddress.streetNumber || filledAddress.unitNumber || filledAddress.line1) {
          if (filledAddress.line2) {
            filledAddress.line3 = filledAddress.line3 ? `${filledAddress.line3}, ${component.long_name}` : component.long_name
          } else {
            filledAddress.line2 = component.long_name
          }
        } else {
          filledAddress.line1 = component.long_name
        }
        break
      case "locality":
      case "postal_town":
        filledAddress.city = component.long_name
        break
      case "administrative_area_level_1":
        filledAddress.province = component.short_name
        break
      case "country":
        filledAddress.alpha2CountryCode = component.short_name
        break
      case "postal_code":
        filledAddress.postal = component.long_name
        break
      case "postal_code_suffix":
        filledAddress.postal = filledAddress.postal ? `${filledAddress.postal}-${component.long_name}` : ''
        break
      case "postal_code_prefix":
        filledAddress.postal = filledAddress.postal ? `${component.long_name}-${filledAddress.postal}` : ''
        break
    }
  }

  const provinceCode = filledAddress.province && filledAddress.alpha2CountryCode ? `${filledAddress.alpha2CountryCode}_${filledAddress.province}` : filledAddress.province
  return { ...filledAddress, province: provinceCode }
}

const COUNTRIES_NOT_REQUIRING_STATE_IN_ADDRESS = ['US', 'CA', 'IN', 'BR', 'CN', 'CN', 'RU', 'AU']

export function isStateNeeded(state: Address): boolean {
  return COUNTRIES_NOT_REQUIRING_STATE_IN_ADDRESS.includes(state.alpha2CountryCode)
}

export function getDateObject(dateString?: string): Date {
  return dateString ? moment(dateString).toDate() : null
}

export function convertDateToString(date?: Date): string {
  return date ? moment(date).format('YYYY-MM-DD') : ''
}

export function getParsedDateForSubmit (date: string): string {
  return date ? moment(date).format('YYYY-MM-DD') : ''
}

export function formatDate (date: string, format?: string): string {
  return date ? moment(date).format(format || 'MMM DD, YYYY') : ''
}

export function getLocalDateString(utcDate?: string | number, locale: string= getSessionLocale(), format: string = DATE_DISPLAY_FORMAT): string {
  const date = moment(utcDate)
  if (locale) {
    date.locale(locale)
  }
  return utcDate ? date.format(format) : ''
}

export function getDateString(date: string): string {
  return formatDate(date)
}

export function getFormFieldConfig(fieldName: string, orderedFields: Field[]): Field {
  return orderedFields?.find(currentField => currentField.fieldName === fieldName)
}

export function isEnabled(field: Field): boolean {
  return field && !!field.requirement
}

export function isRequired(field: Field): boolean {
  return field && field.requirement === 'required'
}

export function isDisabled(field: Field): boolean {
  return field && field.requirement === 'disabled'
}

export function isOmitted(field: Field): boolean {
  return field && field.requirement === 'omitted'
}

export function isNullable (value?: string | number | null) {
  return ((value === undefined) || (value === null))
}
export function isNullableOrEmpty (value?: string | number | null) {
  return isNullable(value) || value === ""
}

export function isEmpty(value?: string | string[] | number | null) {
  if (typeof value === 'string') {
    return !value
  } if (typeof value === 'number') {
    return value === 0 || isNaN(value)
  } else if (Array.isArray(value)) {
    return value.length < 1
  } else {
    return !value
  }
}

export function validateDateOrdering(startDate: string, endDate: string): string {
  const start = getDateObject(startDate)
  const end = getDateObject(endDate)
  return (start && end && start.getTime() > end.getTime()) ? getI18ControlText('--validationMessages--.--dateRangeInvalid--') : ''
}

export function validatePhoneNumber(value: string, label: string, skipRequiredValidation?: boolean) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  if (value) {
    return value.match(regex) ? '' : getI18Text("Enter valid phone number")
  } else if (!skipRequiredValidation) {
    return getI18Text("is required field",{label})
  } else {
    return ''
  }
}

export function validateField(label: string, value: string | string[]): string {
  if (!value) {
    // return `${label} is a required field.`
    return getI18Text("is required field", { label })
  } else {
    return ''
  }
}

export function checkObjectProperties (obj: Object): boolean {
  const fields: Array<string> = []
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== '' && obj[key] !== undefined) { fields.push(obj[key]) }
  }
  return !!fields.length
}

export function validateAddressField(label: string, value: any, address: Address): string {
  if (!checkObjectProperties(address)) {
    return `${label} is a required field.`
  } else {
    return ''
  }
}

export function validateWebsite(label: string, value: string): string {
  const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi

  if (!value) {
    return getI18Text("is required field", { label })
  } else if (value) {
    return value.match(regex) ? '' : getI18Text("Enter valid URL")
  } else {
    return ''
  }
}

export function validateDUNSNumber(label: string, value: string, skipRequiredValidation?: boolean): string {
  const regex = /\d\d-?\s?\d\d\d-?\d\d\d\d/gi

  if (!value && !skipRequiredValidation) {
    return getI18Text("is required field", { label })
  } else if (value) {
    return value.match(regex) ? '' : getI18Text("Enter valid DUNS")
  } else {
    return ''
  }
}

export function validateEmail(label: string, value: string, skipRequiredValidation?: boolean): string {
  const EMAIL_REGEX = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  const regex = new RegExp(`^(${EMAIL_REGEX.source}(;\\s?${EMAIL_REGEX.source})*)$`)
  if (!value && !skipRequiredValidation) {
    return label ? getI18Text("is required field", {label}) : getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (value) {
    return value.match(regex) ? '' : getI18ControlText('--validationMessages--.--emailInvalid--')
  } else {
    return ''
  }
}

export function areOptionsSame(oldValues: Option[], newValues: Option[]): boolean {
  if (oldValues.length === newValues.length) {
    if (newValues.length === 0) {
      return true
    } else {
      // find all paths in oldValues
      const oldPaths = {}
      oldValues.forEach(value => {
        oldPaths[value.path] = true
      })

      // check if there is a path in newValues, which was not in oldValues
      const difference = newValues.some(value => {
        return !(oldPaths[value.path])
      })

      return !difference
    }
  } else {
    return false
  }
}

export function mergeOptions (list1: Option[], list2: Option[]): Option[] {
  const entities = {}
  list1.forEach(option => {
    entities[option.path] = option
  })
  list2.forEach(option => {
    entities[option.path] = option
  })

  return Object.values(entities)
}

export function excludeOptions (excludeOptions: Option[], fromOptions: Option[]): Option[] {
  const entities = {}
  fromOptions.forEach(option => {
    entities[option.path] = option
  })
  excludeOptions.forEach(option => {
    delete entities[option.path]
  })

  return Object.values(entities)
}

export function isValidOption (value: any): boolean {
  return value && value.id && value.path && value.displayName
}

export function isArrayOfOptions (value: any): boolean {
  return Array.isArray(value) && (value.length === 0 || isValidOption(value[0]))
}

export function areProductLinesSame(oldValues: ProductLine[], newValues: ProductLine[]): boolean {
  if (oldValues.length === newValues.length) {
    if (newValues.length === 0) {
      return true
    } else {
      // find all product names in oldValues
      const oldPaths = {}
      oldValues.forEach(value => {
        oldPaths[value.product?.name] = true
      })

      // check if there is a product name in newValues, which was not in oldValues
      const difference = oldValues.some(value => {
        return !(oldPaths[value.product?.name])
      })

      return !difference
    }
  } else {
    return false
  }
}

export function areUsersSame (oldValue: User, newValue: User): boolean {
  if (oldValue && newValue) {
    // both are non-empty
    const foundDifference = (
      oldValue.email !== newValue.email ||
      oldValue.userName !== newValue.userName ||
      oldValue.name !== newValue.name ||
      getUserDisplayName(oldValue) !== getUserDisplayName(newValue)
    )
    return !foundDifference
  } else if (oldValue || newValue) {
    // one non-empty (one is not)
    return false
  } else {
    // both are empty
    return true
  }
}

export function areUserLinesSame(oldValues: User[] | Contact[], newValues: User[] | Contact[]): boolean {
  if (oldValues.length === newValues.length) {
    if (newValues.length === 0) {
      return true
    } else {
      // find all user emails in oldValues
      const oldPaths = {}
      oldValues.forEach(value => {
        oldPaths[getUserDisplayName(value)] = true
      })

      // check if there is a user display name in newValues, which was not in oldValues
      const difference = oldValues.some(value => {
        return !(oldPaths[getUserDisplayName(value)])
      })

      return !difference
    }
  } else {
    return false
  }
}

export function areFilesSame(oldValues: Attachment[], newValues: Attachment[] | File[]): boolean {
  if (oldValues.length === newValues.length) {
    if (newValues.length === 0) {
      return true
    } else {
      // find all names in oldValues
      const oldPaths = {}
      oldValues.forEach(value => {
        oldPaths[value.name] = true
      })

      // check if there is a name in newValues, which was not in oldValues
      const difference = oldValues.some(value => {
        return !(oldPaths[value.name])
      })

      return !difference
    }
  } else {
    return false
  }
}

export function areObjectsSame(oldValue: any, newValues: any): boolean {
  if (oldValue && newValues) {
    // both are valid
    if (Object.keys(oldValue).length !== Object.keys(newValues).length) {
      // both have different number of keys
      return false
    } else {
      // both have same number of keys

      if (Object.keys(oldValue).length === 0) {
        // both are empty
        return true
      } else {
        // both are non-empty
        const foundDifference: boolean = Object.keys(oldValue).some(key => {
          // return oldValue[key] !== newValues[key]

          if (typeof oldValue[key] === 'string' || typeof oldValue[key] === 'boolean' || typeof oldValue[key] === 'number') {
            return oldValue[key] !== newValues[key]
          }
          if (Array.isArray(oldValue[key])) {
            return !areArraysSame(oldValue[key], newValues[key])
          }
          return !areObjectsSame(oldValue[key], newValues[key])
        })

        return !foundDifference
      }
    }
  } else if (oldValue || newValues) {
    // one invalid (one is not)
    return false
  } else {
    // both are invalid
    return true
  }
}

export function areArraysSame(oldValue: any[], newValues: any[]): boolean {
  if (oldValue && newValues) {
    if (oldValue.length === newValues.length) {
      const differentValueFound = oldValue.some((val, index) => {
        if (typeof val === 'string') {
          return val !== newValues[index]
        }
        if (Array.isArray(val)) {
          return !areArraysSame(val, newValues[index])
        }
        return !areObjectsSame(val, newValues[index])
      })
      return !differentValueFound
    } else {
      return false
    }
  } else {
    return oldValue === newValues
  }
}

function hasOnlyCountryCode (addressData: Address): boolean {
  return addressData?.alpha2CountryCode && !(addressData.line1 || addressData.line2 || addressData.line3 || addressData.city || addressData.province || addressData.postal)
}

export function getStateMasterdataId (code?: string): string | undefined {
  if (!code) {
    return
  }
  return code.replaceAll('-', '_')
}
export function getStateCode (id?: string): string | undefined {
  if (!id) {
    return
  }
  return id.replaceAll('_', '-')
}

export function convertAddressToString(addressData?: Address, emptyIfInvalid?: boolean): string {
  if (emptyIfInvalid && addressData && hasOnlyCountryCode(addressData)) {
    return ''
  }

  const address = [
    addressData?.line1,
    addressData?.line2,
    addressData?.line3,
    addressData?.city,
    (STATE_CODE_DISPLAYNAMES[getStateCode(addressData?.province)] || addressData?.province),
    addressData?.postal,
    ALPHA2CODES_DISPLAYNAMES[addressData?.alpha2CountryCode] || addressData?.alpha2CountryCode
  ].filter(Boolean).join(', ')

  return address || ''
}

export function convertAddressesToString(addressData?: Address[]): string {
  const address: string[] = [];
  addressData.map(addressItem => {
    address.push(convertAddressToString(addressItem))
  })

  return address.filter(Boolean).join('\n') || ''
}

export function getLengthOfSubsidiary(processVariables: ProcessVariables | undefined, vendorRecords: Array<VendorRef> | undefined): number {
  const listOfSubsidiaries: Array<IDRef> = []
  if (processVariables && vendorRecords && vendorRecords.length > 0) {
    vendorRecords.forEach(record => {
      record.additionalCompanyEntities.forEach(entities => {
        processVariables.companyEntities.forEach(companyEntity => {
          if (companyEntity.name === entities.name) {
            listOfSubsidiaries.push(companyEntity)
          }
        })
      })
    })
    return listOfSubsidiaries && listOfSubsidiaries.length > 0 ? listOfSubsidiaries.length : 0
  }
  return 0
}

export function getSupplierActivationStatus(vendorId: string, processVariables?: ProcessVariables): ActivationStatus {
  const partner = processVariables?.partners.find(partner => partner.id === vendorId)

  return partner ? partner.activationStatus : ActivationStatus.newSupplier
}

export function findLargelogo(logos: ImageMetadata[]): string {
  const logo = logos.length > 0 ? logos.find(logo => logo?.path?.includes('large')) || logos[0] : null
  return logo?.path ? `${ORO_ASSETS_BASE}/${logo?.path}` : ''
}

export function findSmallLogo(logos: ImageMetadata[]): string {
  const logo = logos.length > 0 ? logos.find(logo => logo?.path?.includes('small')) || logos[0] : null
  return logo?.path ? `${ORO_ASSETS_BASE}/${logo?.path}` : ''
}

export function getSupplierLogoUrl(entity: LegalEntity): string {
  return findLargelogo(entity?.logo?.metadata || [])
}

export function getPOLogoUrl(vendorRef: NormalizedVendorRef): string {
  return findSmallLogo(vendorRef?.legalEntityLogo?.metadata || [])
}

export function areProductsValid(productLines: ProductLine[]): boolean {
  const invalidProductLineFound = productLines.some(line => !(line.product && line.product.name)) // || !line.unit
  return !invalidProductLineFound
}

export function areServicesValid(productLines: ProductLine[]): boolean {
  const invalidProductLineFound = productLines.some(line => !(line.product && line.product.name))
  return !invalidProductLineFound
}

export function areCostDetailsValid(costDetailsLines: CostDetail[]): boolean {
  const invalidCostDetailLineFound = costDetailsLines.some(costDetails => !(costDetails && costDetails.costDetails && costDetails.moneyAmount && costDetails.costDate)) // || !line.unit
  return !invalidCostDetailLineFound
}

export function areKpiValid(kpiLines: string[]): boolean {
  const invalidKpiLineFound = kpiLines.some(kpi => !(kpi)) // || !line.unit
  return !invalidKpiLineFound
}

export function getUserDisplayName(user: User | UserId | SupplierUser | SignedUser): string {
  const _firstName = (user as User).firstName || (user as SignedUser).givenName
  const _lastName = (user as User).lastName || (user as SignedUser).familyName

  if (_firstName || _lastName) {
    return (_firstName && _lastName) ?`${_firstName} ${_lastName}` : (_firstName) ? _firstName : _lastName
  } else {
    return (user as UserId).name || (user as UserId).userName || (user as SupplierUser).fullName || (user as User).email
  }
}

export function mapIDRefToOption (idRef?: IDRef | null): Option {
  return {
    id: idRef?.id || '',
    path: idRef?.id || '',
    displayName: idRef?.name || '',
    customData: { erpId: idRef?.erpId || '', refId: idRef?.refId || '' }
  }
}

export function mapMasterDataIDRefToOption (idRef?: IDRef | null): Option | undefined {
  if (idRef && idRef?.id) {
    return {
      id: idRef?.id || '',
      path: idRef?.id || '',
      displayName: idRef?.name || '',
      customData: { erpId: idRef?.erpId || '', refId: idRef?.refId || '' }
    }
  }

  return undefined
}

export function mapStringToOption (value?: string): Option {
  return {
    id: value || '',
    path: value || '',
    displayName: value || '',
    customData: { erpId: value || '' },
    selectable: true,
    selected: false
  }
}

export function mapOptionToIDRef (option?: Option): IDRef {
  return {
    id: option?.path || '',
    name: option?.displayName || '',
    erpId: option?.customData?.erpId || '',
    refId: option?.customData?.refId || ''
  }
}

export function mapMasterDataOptionToIDRef (option?: Option): IDRef | undefined {
  if (option && (option?.id || option?.path)) {
    return {
      id: option?.path || '',
      name: option?.displayName || '',
      erpId: option?.customData?.erpId || '',
      refId: option?.customData?.refId || ''
    }
  }

  return undefined
}

export function mapOptionsToIDRefs (options?: Option[]): Array<IDRef> {
  let choices: Array<IDRef> = []

  if (Array.isArray(options)) {
    choices = options.map(mapOptionToIDRef)
  }

  return choices
}

export function mapSitesToOption (data: Array<IDRef>): Array<Option> {
  const convertToOption: Array<Option> = data && data.length > 0 && data.some(item => item.id || item.name) ? data.map(mapIDRefToOption) : []
  return convertToOption
}

export function formatCurrency (money: number): string {
  return money ? Intl.NumberFormat(getSessionLocale()).format(money) : ''
}

export function mapUserIdToOption (user?: UserId | null): Option {
  return {
    id: user ? getUserDisplayName(user) : '',
    displayName: user ? getUserDisplayName(user) : '',
    path: user ? (user?.userName || getUserDisplayName(user)) : '',
    customData: user
  }
}

export function mapOptionToUserID (option?: Option): UserId {
  return {
    userName: (option?.customData as UserId)?.userName || (option?.customData as User)?.email || option.path,
    name: option?.customData ? getUserDisplayName(option.customData as UserId) : (option.displayName || ''),
    userNameCP: (option?.customData as UserId)?.userNameCP,
  }
}

export function mapPhoneToString (data: Phone | string): string {
  const phoneString: string = (data && (data as Phone)?.number) ? (data as Phone)?.number : data as string;
  return phoneString
}

export function mapStringToPhone (value: string): Phone | undefined {
  const parseNumber = value && parsePhoneNumber(value)
  if (parseNumber && parseNumber?.number) {
    return {dialCode: '+' + parseNumber?.countryCallingCode , isoCountryCode: parseNumber?.country, number: parseNumber?.number};
  } else {
    return undefined
  }
}

export function mapBankKeyToOption (bankKey: BankKey, entries: BankKeyLookupEntry[], keys: EnumsDataObject[]): Option {
  const matchingEntry = entries?.find(entry => entry.bankKey === bankKey)
  return {
        id: matchingEntry?.bankKey || '',
        path: matchingEntry?.bankKey || '',
        displayName: keys?.find(enumVal => enumVal.code === matchingEntry?.bankKey)?.name || matchingEntry?.bankKey || 'Bank code',
        customData: matchingEntry
      }
}

export function mapKeyLookupEntryToOption (entry: BankKeyLookupEntry, keys: EnumsDataObject[]): Option {
  return {
    id: entry.bankKey,
    path: entry.bankKey,
    displayName: keys?.find(enumVal => enumVal.code === entry.bankKey)?.name || entry.bankKey || 'Bank code',
    customData: entry
  }
}



export function mapBankCountryToOption (country: string, entries: Option[]): Option {
  const matchingEntry = entries?.find(entry => entry.path === country)
  return  {
        id: matchingEntry?.id || '',
        path: matchingEntry?.path || '',
        displayName: matchingEntry?.displayName || 'Bank Country',
        customData: matchingEntry
      }
}


export function mapBankKeysToOption (key: EnumsDataObject): Option {
  return {
    id: key.code,
    path: key.code,
    displayName: key?.name || 'Bank code',
    customData: key
  }
}

export function mapBankKeyToOptionValue (bankKey: BankKey, keys: EnumsDataObject[]): Option {
  const matchingEntry = keys?.find(key => key.code === bankKey)
  return {
        id: matchingEntry?.code || '',
        path: matchingEntry?.code || '',
        displayName: matchingEntry?.name || 'Bank code',
        customData: matchingEntry
      }
}

export function convertNumberToKM(num: number, decimalAfterDot?: number): string {
  if (num > 999 && num < 1000000) {
    // convert to K for number from > 1000 < 1 million
    const dividedNumber = num / 1000
    if (dividedNumber % 1 !== 0) {
      if (decimalAfterDot > -1) {
        return dividedNumber.toFixed(decimalAfterDot) + 'K'
      } else {
        return dividedNumber.toFixed(1) + 'K'
      }
    } else {
      return dividedNumber + 'K'
    }
  } else if (num >= 1000000) {
    // convert to M for number from > 1 million
    const dividedNumber = num / 1000000
    if (dividedNumber % 1 !== 0) {
      if (decimalAfterDot > -1) {
        return dividedNumber.toFixed(decimalAfterDot) + 'M'
      } else {
        return dividedNumber.toFixed(1) + 'M'
      }
    } else {
      return dividedNumber + 'M'
    }
  } else {
    // if value < 1000, nothing to do
    if (num % 1 !== 0) {
      if (decimalAfterDot > -1) {
        return num.toFixed(decimalAfterDot).toString()
      } else {
        return num.toFixed(1).toString()
      }
    } else {
      return num.toString()
    }
  }
}

export function convertNumberToThousands(num: number, decimalAfterDot: number = 0, forYAxis?: boolean): string {
  const dividedNumber = num / 1000
  if (num > 500 && num < 1000) {
    return forYAxis && decimalAfterDot > -1 ? `${parseFloat(dividedNumber.toFixed(decimalAfterDot))}` : '1'
  } else if (num < 500) {
    return forYAxis && decimalAfterDot > -1 ? `${parseFloat(dividedNumber.toFixed(decimalAfterDot))}` : '0'
  } else {
    return `${parseFloat(dividedNumber.toFixed(decimalAfterDot))}`
  }
}

export function getFileType (type: string): string {
  if (docFileAcceptType.includes(type)) {
      return 'docx'
  } else if (xlsFileAcceptType.includes(type)) {
      return 'xlsx'
  } else if (pdfFileAcceptType.includes(type)) {
      return 'pdf'
  } else if (csvFileAcceptType.includes(type)) {
      return 'csv'
  } else if (imageFileAcceptType.includes(type)) {
      return 'png'
  } else if (emlFileAcceptTypes.includes(type)) {
    return 'eml'
  } else if (msgFileAcceptTypes.includes(type)) {
    return 'msg'
  } else {
      return 'csv'
  }
}

export function currencyAmountFormatter (amount: number): string {
  if (amount > 999 && amount < 1000000) {
    return (amount / 1000).toFixed(1) + 'K'
  } else if (amount > 1000000 && amount < 1000000000) {
    return (amount / 1000000).toFixed(1) + 'Million'
  } else if (amount > 1000000000) {
    return (amount / 1000000000).toFixed(1) + 'Billion'
  } else {
    return amount.toString()
  }
}

export function isLate (lateDate: string): boolean {
  return lateDate ? Date.now() > new Date(lateDate).getTime() : false
}

export function checkStuckStatus (processTasks: Array<ProcessTask>): boolean {
  if (processTasks?.length > 0) {
    const task = processTasks[0]
    const stuckStatus = task.taskStatus === TaskStatus.pending || task.taskStatus === TaskStatus.inProgress || task.taskStatus === TaskStatus.notStarted
    return stuckStatus && isLate(task?.lateTime)
  } else {
    return false
  }
}

export function isAddressInvalid (value: Address) : boolean {
  return (!value) || !value["line1"] || !value["city"] || (isStateNeeded(value as Address) && !value["province"]) || !value["alpha2CountryCode"] || !value["postal"]
}

export function isFileSizeValid (file: File) {
  /** Determine whether the file size is equal to or less then 1Mb i.e 1048576.
   * As with HTTP requests, the maximum content size is 1Mb. */
  const validFileSize = 10485760

  if (file.size < validFileSize) {
    return true
  } else {
    return false
  }
}

export function getFlattenChildren (fields: ContractTypeDefinitionField[], skipFieldId?: string) {
  let children = [];
  const filteredField = skipFieldId ? fields.filter(field => field.id !== skipFieldId) : fields

  const flattenMembers = filteredField.map(field => {
    if (field.children && field.children.length) {
      children = [...children, ...field.children];
    }
    return field;
  });

  return flattenMembers.concat(children.length ? getFlattenChildren(children) : children);
}

function getFlatFieldDefinition (fields: ContractTypeDefinitionField[], section: ContractFieldSection) {
  let fieldConfig: ContractTypeDefinitionField[] = []
  const sectionFields: ContractTypeDefinitionField = fields && fields.length > 0 ? fields.find(field => field.id === section) : null
  if (sectionFields && sectionFields.children && sectionFields?.children?.length > 0) {
    fieldConfig = getFlattenChildren(sectionFields.children)
  }
  return fieldConfig
}

export function isFieldExists (id: string, fields: ContractTypeDefinitionField[], section: ContractFieldSection, checkIfRequired?: boolean) {
  let isFound = false
  const fieldDefinition = getFlatFieldDefinition(fields, section)
  if (fieldDefinition && fieldDefinition.length > 0) {
    fieldDefinition.forEach(field => {
      if (field.id === id && field.visible) {
        isFound = checkIfRequired ? field.required : true
      }
    })
  }
  return isFound
}

export function isChildFieldExists (id: string, fields: ContractFieldConfig[], formId: string) {
  let isFound = false
  if (fields && fields.length > 0) {
    fields.forEach(field => {
      if (field.id === id && field.visible) {
        const formConfig = field?.formConfigs?.find(config => config.formId === formId)
        isFound = formConfig ? formConfig.required : field.required
      }
    })
  }
  return isFound
}

export function getFieldDisplayName (id: string, fields: ContractTypeDefinitionField[], section: ContractFieldSection) {
  let displayName: string = ''
  const fieldDefinition = getFlatFieldDefinition(fields, section)
  if (fieldDefinition && fieldDefinition.length > 0) {
    fieldDefinition.forEach(field => {
      if (field.id === id) {
        displayName = field.name
      }
    })
  }
  return displayName
}

export function getSectionFields (type: string, contractTypeFieldDefinition: ContractTypeDefinition[], section: ContractFieldSection): ContractTypeDefinitionField {
  const fieldConfig = contractTypeFieldDefinition.find(fieldType => fieldType.type === type)?.fields
  const sectionFields = fieldConfig ? fieldConfig.find(field => field.id === section) : null
  return sectionFields
}

export function isSectionExists (typeDefinition: ContractTypeDefinition[], contractType: string, sectionId: ContractFieldSection) {
  if(typeDefinition && typeDefinition.length > 0) {
    const typeDef = typeDefinition.find(type => type.code === contractType)
    return typeDef ? typeDef.fields.some(field => field.id === sectionId) : false
  } else {
    return false
  }
}

export function getSectionDisplayName (typeDefinition: ContractTypeDefinition[], contractType: string, sectionId: ContractFieldSection) {
  if(typeDefinition && typeDefinition.length > 0) {
    const typeDef = typeDefinition.find(type => type.code === contractType)
    const matchedField = typeDef ? typeDef.fields.find(field => field.id === sectionId) : null
    return matchedField ? matchedField.name : ''
  } else {
    return ''
  }
}

export function calculateFieldValue (fields: ContractFieldConfig[], formData: ContractRevision | ContractYearlySplit, currentCurrency: string, fieldId?: string): ContractRevision | ContractYearlySplit {
  const updatedFormData = fieldId === ContractFields.yearlySplits ? {...formData} as ContractYearlySplit : {...formData} as ContractRevision
  const fieldDefinition = fieldId !== ContractFields.yearlySplits ? fields?.filter(field => field.id !== ContractFields.yearlySplits) : fields

  if (fieldDefinition && fieldDefinition.length > 0 && updatedFormData) {
    fieldDefinition.forEach(field => {
      if (field.formula && field.visible) {
        const calculatedVal = eval(field.formula)
        if (!isNaN(calculatedVal)) {
          updatedFormData[field.id] = field.type === 'money' ? { amount: calculatedVal, currency: currentCurrency } as Money : calculatedVal
        }
      }
    })
  }

  return fieldId === ContractFields.yearlySplits ? updatedFormData as ContractYearlySplit : updatedFormData as ContractRevision
}

export function validateContractFields (fields: ContractTypeDefinitionField[], data: ContractFormData) {
  let allFields = []
  let isInvalid = false
  if (fields?.length > 0) {
    fields.forEach(field => {
      allFields = allFields.concat(getFlattenChildren(field.children, field.id === ContractFieldSection.contractValues ? ContractFields.yearlySplits : ''))
    })

    isInvalid = allFields?.some(field => {
      if (field.id !== ContractFields.contractPeriod && field.required && field.visible) {
        switch (field.id) {
          case ContractFields.annualSpend:
          case ContractFields.fixedSpend:
          case ContractFields.totalValue:
          case ContractFields.variableSpend:
          case ContractFields.recurringSpend:
          case ContractFields.averageVariableSpend:
          case ContractFields.oneTimeCost:
          case ContractFields.totalRecurringSpend:
          case ContractFields.totalEstimatedSpend:
          case ContractFields.renewalAnnualValue:
          case ContractFields.negotiatedSavings:
            return isEmpty(data[field.id]?.amount === 0 ? '0' : data[field.id]?.amount)
          case ContractFields.proposalDescription:
          case ContractFields.startDate:
          case ContractFields.endDate:
          case ContractFields.billingCycle:
            return !data[field.id]
          case ContractFields.paymentTerms:
            return !data[field.id]?.id
        }
      }
    })
  }
  return isInvalid
}

export function validateSplitFields (fields: ContractTypeDefinitionField[], splitData: ContractYearlySplit[]) {
  let invalidFieldId = ''
  const fieldDefinition = getFlatFieldDefinition(fields, ContractFieldSection.contractValues)
  const splitFields = fieldDefinition?.find(field => field.id === ContractFields.yearlySplits)?.children
  const isInvalid = splitFields?.some(field => {
    if (field.visible && field.required) {
      switch (field.id) {
        case ContractFields.year:
          invalidFieldId = `${ContractFields.yearlySplits}_${field.id}`
          return splitData.some(val => !val.year)
        case ContractFields.annualSpend:
        case ContractFields.fixedSpend:
        case ContractFields.variableSpend:
        case ContractFields.recurringSpend:
        case ContractFields.totalRecurringSpend:
        case ContractFields.averageVariableSpend:
        case ContractFields.oneTimeCost:
        case ContractFields.totalValue:
        case ContractFields.totalEstimatedSpend:
        case ContractFields.renewalAnnualValue:
        case ContractFields.negotiatedSavings:
          invalidFieldId = `${ContractFields.yearlySplits}_${field.id}`
          return splitData.some(val => isEmpty(val[field.id]?.amount === 0 ? '0' : val[field.id]?.amount))
      }
    }
  })
  return isInvalid ? invalidFieldId : ''
}

export function validateTermsField (fields: ContractTypeDefinitionField[], data: ContractRevision) {
  let invalidFieldId = ''
  let isInvalid = false
  const fieldDefinition = getFlatFieldDefinition(fields, ContractFieldSection.terms)

  if (fieldDefinition?.length > 0) {
    isInvalid = fieldDefinition?.some(field => {
      if (field.visible) {
        switch (field.id) {
          case ContractFields.autoRenew:
          case ContractFields.includesPriceCap:
          case ContractFields.includesCancellation:
          case ContractFields.includesOptOut:
          case ContractFields.includesLateFees:
          case ContractFields.terminationOfConvenience:
          case ContractFields.liabilityLimitation:
          case ContractFields.confidentialityClause:
          case ContractFields.billingCycle:
            if (field.required && !data[field.id]) {
              invalidFieldId = field.id
              return true
            }
          break
          case ContractFields.autoRenewNoticePeriod:
            if (data.autoRenew) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.priceCapIncrease:
            if (data.includesPriceCap) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.cancellationDeadline:
            if (data.includesCancellation) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.optOutDeadline:
            if (data.includesOptOut) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.lateFeeDays:
          case ContractFields.lateFeesPercentage:
            if (data.includesLateFees) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.terminationOfConvenienceDays:
            if (data.terminationOfConvenience) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.liabilityLimitationMultiplier:
            if (data.liabilityLimitation) {
              invalidFieldId = field.id
              return data[field.id] === null
            }
          break
          case ContractFields.liabilityLimitationCap:
            if (data.liabilityLimitation) {
              invalidFieldId = field.id
              return isEmpty(data[field.id]?.amount === 0 ? '0' : data[field.id]?.amount)
            }
          break
          case ContractFields.paymentTerms:
            if (field.required && !data[field.id]?.id) {
              invalidFieldId = field.id
              return true
            }
          break
        }
      }
    })
  }
  return isInvalid ? invalidFieldId : ''
}

export function getDateDisplayString (dateString: string | null | undefined, locale: string= getSessionLocale()): string | null {
  if(!dateString) {
    return ''
  }

  const dueDate = moment(dateString)
  const today = moment()
  const tomorrow = today.add(1, 'days')
  const yesterday = today.add(-1, 'days')

  if (dueDate.isSame(today, 'day') || dueDate.isSame(tomorrow, 'day') || dueDate.isSame(yesterday,'day')) {
    return dueDate.calendar().split(' ')[0]
  }
  const date = moment(dateString)
  if (locale) {
    date.locale(locale)
  }
  return date.format('MMM DD, YYYY')
}

export function getTaxDisplayString (taxObj: TaxObject | null | undefined): string | null {
  if (taxObj && taxObj.items && Array.isArray(taxObj.items) && taxObj.items.length > 0) {
    return mapCurrencyToSymbol(taxObj.items[0].taxableAmount.currency) + Number(taxObj.items[0].taxableAmount.amount).toLocaleString(getSessionLocale())
  }
}

export function getDateRangeDisplayString (startDate: string, endDate: string) {
  if (startDate && endDate) {
     return `${moment(startDate).format('MMM DD[,] YYYY')} - ${moment(endDate).format('MMM DD[,] YYYY')}`
  }
  return '-'
}

export function getFormattedAmountValue (value: Money, skipCurrencyDisplay?: boolean, locale: string = getSessionLocale()) {
  if (value && isNumber(value.amount)) {
    const _locale = locale || getSessionLocale()
    const amount = (value.amount).toLocaleString(_locale)
    const currency = mapCurrencyToSymbol(value.currency || DEFAULT_CURRENCY)
    return currency + amount + ` ${!skipCurrencyDisplay ? value.currency || DEFAULT_CURRENCY : ''}`
  }
  return '-'
}

export function canShowTenantCurrency(currenctValue: Money, tenantValue: Money): boolean {
  if (currenctValue && tenantValue) {
    return tenantValue.amount > 0 && tenantValue.currency !== currenctValue.currency
  }
  return false
}

export function canShowDiffValue (field: {changed: boolean, original: any}) {
  return field && field.changed && field.original !== null
}

export function mapContractToIDRef (value?: ExistingContract): IDRef {
  return {
    id: value?.contractId || '',
    name: value?.name || '',
    erpId: ''
  }
}

export function mapBankAddress(data: Address) {
  return {
    alpha2CountryCode: data?.alpha2CountryCode || '',
    city: data?.city || '',
    language: data?.language || '',
    line1: data?.line1 || '',
    line2: data?.line2 || '',
    line3: data?.line3 || '',
    postal: data?.postal || '',
    province: data?.province || '',
    streetNumber: data?.streetNumber || '',
    unitNumber: data?.unitNumber || ''
  }
}

export function mapIDRefToAddress (data: IDRef): Address {
  return {
    alpha2CountryCode: data?.id || '',
    city: data?.name || '',
    line1: '',
    line2: '',
    line3: '',
    streetNumber: '',
    province: '',
    postal: '',
    unitNumber: ''
  }
}

export function mapAddressToIDRef (data: Address): IDRef {
  return {
    id: data?.alpha2CountryCode || '',
    name: data?.city || '',
    erpId: data?.alpha2CountryCode || ''
  }
}

export function getSupplierSegmentationName (segmentation: string | undefined | null) {
  if (SupplierSegmentation.critical === segmentation) {
    return 'Critical'
  }

  if (SupplierSegmentation.singleSource === segmentation) {
    return 'Single source'
  }

  if (SupplierSegmentation.strategic === segmentation) {
    return 'Strategic'
  }

  if (SupplierSegmentation.preferred === segmentation) {
    return 'Preferred'
  }

  if (SupplierSegmentation.approved === segmentation) {
    return 'Approved'
  }

  if (SupplierSegmentation.prospect === segmentation) {
    return 'Prospect'
  }

  if (SupplierSegmentation.dontUse === segmentation) {
    return 'Blocked'
  }

  return ''
}

export function buildSupplierDimension (details: SupplierCapabilities): SupplierDimension {
  const dimesion: SupplierDimension = {
    programs: details.restrictions.filter(restriction => restriction.hierarchy?.includes(SupplierScope.program)).map(mapOptionToIDRef),
    regions: details.regions ? details.regions.map(mapOptionToIDRef) : [],
    sites: details.sites ? details.sites.map(mapOptionToIDRef) : [],
    departments: details.restrictions.filter(restriction => restriction.hierarchy?.includes(SupplierScope.department)).map(mapOptionToIDRef),
    companyEntities: details.restrictions.filter(restriction => restriction.hierarchy?.includes(SupplierScope.entity)).map(mapOptionToIDRef),
    products: details.products ? details.products.map(mapOptionToIDRef) : [],
    productStages: details.productStages ? details.productStages.map(mapOptionToIDRef) : [],
    categories: details.categories ? details.categories.map(mapOptionToIDRef) : []
  }

  return dimesion
}

export function buildCapabilityScope (details: SupplierCapabilities, currentScope: SegmentationDetail): SegmentationDetail {
  const capabilityDetails: SegmentationDetail = {
    id: details.id,
    name: details.name,
    dimension: buildSupplierDimension(details),
    segmentation: details.preferredStatus ? SupplierSegmentation[details.preferredStatus.path] : null,
    description: details.description ? details.description : '',
    latestUse: currentScope?.latestUse ? currentScope?.latestUse : null
  }

  return capabilityDetails
}

export function mapRestrictionsToOption (dimension: SupplierDimension | null) {
  const restrictions: Option[] = []
  if (dimension?.programs && dimension.programs.length > 0) {
    dimension.programs.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }
  if (dimension?.regions && dimension.regions.length > 0) {
    dimension.regions.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }
  if (dimension?.sites && dimension.sites.length > 0) {
    dimension.sites.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }
  if (dimension?.departments && dimension.departments.length > 0) {
    dimension.departments.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }
  if (dimension?.companyEntities && dimension.companyEntities.length > 0) {
    dimension.companyEntities.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }
  if (dimension?.categories && dimension.categories.length > 0) {
    dimension.categories.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }

  if (dimension?.products && dimension.products.length > 0) {
    dimension.products.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }

  if (dimension?.productStages && dimension.productStages.length > 0) {
    dimension.productStages.forEach(ref => {
      restrictions.push(mapIDRefToOption(ref))
    })
  }
  return restrictions
}

export function getPreferredStatusOption (segmentation: SupplierSegmentation | null, preferredStatusOptions: Option[]) {
  const option = preferredStatusOptions.find(status => status.path === segmentation)
  return option || null
}

export function mapSegmentationToCapabilities (scope: SegmentationDetail, preferredStatusOptions: Option[]): SupplierCapabilities {
  const capability: SupplierCapabilities = {
    id: scope.id ? scope.id : null,
    name: scope.name || '',
    description: scope.description || '',
    preferredStatus: getPreferredStatusOption(scope.segmentation, preferredStatusOptions),
    categories: scope.dimension?.categories.map(mapIDRefToOption) || [],
    products: scope.dimension?.products ? scope.dimension?.products.map(mapIDRefToOption) : [],
    productStages: scope.dimension?.productStages ? scope.dimension?.productStages.map(mapIDRefToOption) : [],
    regions: scope.dimension?.regions.map(mapIDRefToOption) || [],
    sites: scope.dimension?.sites.map(mapIDRefToOption) || [],
    restrictions: mapRestrictionsToOption(scope.dimension)
  }

  return capability
}

export function resetSelectedOption (selectedOption: Option[]): Option[] {
  return selectedOption.map((option) => {
      if (option.selected) {
          option = {...option, selected: false}
      } else if (option.children && option.children.length > 0) {
          option.children = resetSelectedOption(option.children)
      }
      return option
  })
}

export function getFormFieldsMap(orderedFields: Field[] = [], wantedFields: string[] = []): Record<string, Field> {
  return orderedFields.reduce((reduce, field) => {
    if (wantedFields.includes(field.fieldName)) {
      reduce[field.fieldName] = field
    }
    return reduce;
  }
    , {})
}

export function recursiveDeepCopy(source) {
  let newSource, i;

  if (typeof source !== 'object') {
    return source;
  }
  if (!source) {
    return source;
  }

  if ('[object Array]' === Object.prototype.toString.apply(source)) {
    newSource = [];
    for (i = 0; i < source.length; i += 1) {
      newSource[i] = recursiveDeepCopy(source[i]);
    }
    return newSource;
  }

  newSource = {};
  for (i in source) {
    if (source.hasOwnProperty(i)) {
      newSource[i] = recursiveDeepCopy(source[i]);
    }
  }
  return newSource;
}

export function validateFieldV2(fieldMap:{ [key: string]: Field }, fieldName: string, label: string, value: string | string[]): string {
  if (fieldMap) {
    const field = fieldMap[fieldName]
    return isRequired(field) && isEmpty(value) ? getI18Text("is required field", { label }) : ''
  } else {
    return ''
  }
}
export function isFieldDisabled(fieldMap:{ [key: string]: Field }, fieldName: string): boolean {
  if (fieldMap && fieldMap[fieldName]) {
    const field = fieldMap[fieldName]
    return isDisabled(field)
  } else {
    return false
  }
}
export function isFieldRequired(fieldMap:{ [key: string]: Field }, fieldName: string): boolean {
  if (fieldMap && fieldMap[fieldName]) {
    const field = fieldMap[fieldName]
    return isRequired(field)
  } else {
    return false
  }
}
export function isFieldOmitted(fieldMap:{ [key: string]: Field }, fieldName: string): boolean {
  if (fieldMap && fieldMap[fieldName]) {
    const field = fieldMap[fieldName]
    return isOmitted(field)
  } else {
    return false
  }
}
export function getFieldConfigValue(fieldMap:{ [key: string]: Field }, fieldName: string): boolean {
  if (fieldMap && fieldMap[fieldName]) {
    const field = fieldMap[fieldName]
    return field && field.booleanValue
  } else {
    return false
  }
}
export function getFieldStringValue(fieldMap:{ [key: string]: Field }, fieldName: string): string {
  if (fieldMap && fieldMap[fieldName]) {
    const field = fieldMap[fieldName]
    return field && field.stringValue
  } else {
    return ''
  }
}

export function mapCost (money?: Money | null, currency?: string): Cost {
  return {
    currency: money?.currency || currency || DEFAULT_CURRENCY,
    amount: money?.amount ? money.amount.toString() : ''
  }
}

export function getTaxKeyNameForKey (taxKey: string, taxKeys: EnumsDataObject[]) {
  return taxKeys?.find(key => key.code === taxKey)?.name || taxKey
}
export function getTaxKeyDescriptionForKey (taxKey: string, taxKeys: EnumsDataObject[]) {
  return taxKeys?.find(key => key.code === taxKey)?.description || ''
}

export function findTaxFormByKey (taxFormKey: string, taxFormKeys: EnumsDataObject[]) {
  return taxFormKeys?.find(key => key.code === taxFormKey)
}
export function getTaxFormNameForKey (taxFormKey: string, taxFormKeys: EnumsDataObject[]) {
  return findTaxFormByKey(taxFormKey, taxFormKeys)?.name || taxFormKey
}
export function getTaxFormLinkTextForKey (taxFormKey: string, taxFormKeys: EnumsDataObject[]) {
  return findTaxFormByKey(taxFormKey, taxFormKeys)?.linkText || ''
}
export function getTaxFormLinkForKey (taxFormKey: string, taxFormKeys: EnumsDataObject[]) {
  return findTaxFormByKey(taxFormKey, taxFormKeys)?.link || ''
}
export function getTaxFormDescriptionForKey (taxFormKey: string, taxFormKeys: EnumsDataObject[]) {
  return findTaxFormByKey(taxFormKey, taxFormKeys)?.description || ''
}

export function getOcredAddressUtil (formData: CompanyInfoV3FormData, taxAddress: Address): string {
  if((formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.address?.alpha2CountryCode !== taxAddress?.alpha2CountryCode
    || formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.address?.city !== taxAddress?.city ||
    formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.address?.province !== taxAddress?.province) &&
    (formData?.taxForm?.ocrInfo?.companyInfo?.address?.alpha2CountryCode !== taxAddress?.alpha2CountryCode
      || formData?.taxForm?.ocrInfo?.companyInfo?.address?.city !== taxAddress?.city ||
      formData?.taxForm?.ocrInfo?.companyInfo?.address?.province !== taxAddress?.province)) {
        return convertAddressToString(formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.address) || convertAddressToString(formData?.taxForm?.ocrInfo?.companyInfo?.address) || ''
  }
  return ''
}

export function getOcredBusinessEntityUtil (formData: CompanyInfoV3FormData, usCompanyEntityTypeOptions: Option[], usCompanyEntityType: Option): string {
  if (formData?.usTaxDeclarationFormOcrInfo) {
    const entity = formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.companyEntityType || ''
    const findEntityInList = usCompanyEntityTypeOptions?.find(item => item.path === entity)
    return findEntityInList && findEntityInList?.path !== usCompanyEntityType?.path ? findEntityInList.displayName : entity ? entity : ''
  }
  return ''
}

export function getOcredTaxKeyValueUtil (formData: CompanyInfoV3FormData, encryptedTaxCode: EncryptedData): string {
  if (formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.ein !== encryptedTaxCode?.unencryptedValue && formData?.taxForm?.ocrInfo?.companyInfo?.ein !== encryptedTaxCode?.unencryptedValue) {
    return formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.ein || formData?.taxForm?.ocrInfo?.companyInfo?.ein || ''
  }
  return ''
}

export function getOcredLegalNameUtil (formData: CompanyInfoV3FormData, legalName: string): string {
  if (formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.name?.toLocaleLowerCase().trim() !== legalName.toLocaleLowerCase().trim() && formData?.taxForm?.ocrInfo?.companyInfo?.name?.toLocaleLowerCase().trim() !== legalName.toLocaleLowerCase().trim()) {
    return formData?.usTaxDeclarationFormOcrInfo?.companyInfo?.name || formData?.taxForm?.ocrInfo?.companyInfo?.name || ''
  }
  return ''
}

export function convertDocumentToDocumentRef (document: Document): DocumentRef {
  return {
    id: document?.id || null,
    name: document?.name || '',
    type: document?.type || null,
    attachment: document?.attachment || null,
    sourceUrl: document?.sourceUrl || '',
    sourceUrlAttachment: document?.sourceUrlAttachment || null,
    pastVersions: document?.pastVersions || [],
    created: document?.created || ''
  }
}

export function isValueAvailableInOptions (value?: Option[], options?: Option[]): boolean {
  let isValueAvailable = false
  isValueAvailable = options && options.some(option => {
    const isValueAvailableAtCurrent = value?.some(val => val?.path === option.path)
    isValueAvailable = isValueAvailableAtCurrent
    if ((option?.children && option.children?.length > 0) && !isValueAvailableAtCurrent) {
      isValueAvailable = isValueAvailableInOptions(value, option.children)
    }
    return isValueAvailable
  })
  return isValueAvailable
}

export function copyObject (item: any, options: {newName: string, excludeKeys: string[], ignoreUniqueId?: boolean}) {
  const {newName, excludeKeys = [], ignoreUniqueId} = options

  const _copy = JSON.parse(JSON.stringify(item));

  if (newName) {
    _copy.name = newName
  }

  if (!ignoreUniqueId) {
    _copy.id = Math.random()
  }

  excludeKeys.forEach((key)=> {
    // if nested. works upto 2 levels only
    if(key.includes('.')) {
      const keys = key.split('.')
      if(_copy.hasOwnProperty(keys[0])) {
        delete _copy[keys[0]][keys[1]]
      }
    } else {
      if(_copy.hasOwnProperty(key)) {
        delete _copy[key]
      }
    }
  })
  return _copy;
}

export function getContractStatus (contract: ContractDetail, t: (key: string) => string): string {
  const status = contract.runtimeStatus

  switch (status) {
    case ContractRuntimeStatus.inNegotiation:
      return t('--contractDetail--.--inNegotiation--')
    case ContractRuntimeStatus.inApproval:
      return t('--contractDetail--.--inApproval--')
    case ContractRuntimeStatus.approved:
      return t('--contractDetail--.--approved--')
    case ContractRuntimeStatus.cancelled:
      return t('--contractDetail--.--cancelled--')
    case ContractRuntimeStatus.expired:
      return t('--contractDetail--.--expired--')
    case ContractRuntimeStatus.renewalDue:
      return t('--contractDetail--.--renewalDue--')
    case ContractRuntimeStatus.closed:
      return t('--contractDetail--.--closed--')
    case ContractRuntimeStatus.inRenewal:
      return t('--contractDetail--.--inRenewal--')
    case ContractRuntimeStatus.inCancellation:
      return t('--contractDetail--.--inCancellation--')
    case ContractRuntimeStatus.deleted:
      return t('--contractDetail--.--deleted--')
    case ContractRuntimeStatus.inUpdate:
      return t('--contractDetail--.--inUpdate--')
    case ContractRuntimeStatus.renewed:
      return t('--contractDetail--.--renewed--')
    default:
      return t('--contractDetail--.--active--')
  }
}

export function getPOStatus (po: PurchaseOrder, t: (key: string) => string): string {
  const status = po?.runtimeStatus || po?.status

  switch (status) {
    case POStatus.active:
      return t("--poDetails--.--active--")
    case POStatus.approved:
      return t('--poDetails--.--approved--')
    case POStatus.cancelled:
      return t('--poDetails--.--cancelled--')
    case POStatus.closed:
      return t('--poDetails--.--closed--')
    case POStatus.draft:
      return t('--poDetails--.--draft--')
    case POStatus.fullyBilled:
      return t('--poDetails--.--billed--')
    case POStatus.inApproval:
      return t('--poDetails--.--inApproval--')
    case POStatus.partiallyBilled:
      return t('--poDetails--.--partiallyBilled--')
    case POStatus.partiallyReceived:
      return t('--poDetails--.--partiallyReceived--')
    case POStatus.pendingBill:
      return t('--poDetails--.--pendingBill--')
    case POStatus.pendingReceipt:
      return t('--poDetails--.--pendingReceipt--')
  }
}

export function getCustomLabelForField (field: Field) {
  return field?.customLabel || ''
}

export function getBlockedERPStatuses (status: string, t: (key: string) => string): string {
  switch (status) {
      case BlockStatuses.blocked:
        return t('--erpDetails--.--blocked--')
      case BlockStatuses.paymentBlocked:
        return t('--erpDetails--.--paymentBlocked--')
      case BlockStatuses.purchasingBlocked:
        return t('--erpDetails--.--purchasingBlocked--')
      case BlockStatuses.postingBlocked:
        return t('--erpDetails--.--postingBlocked--')
      default:
        return t('--erpDetails--.--blocked--')
  }
}

export function getIncoTermDisplayName (data: IDRef[], options: Option[]): string {
  const displayNames = data.map(item => {
    const _incoTerms = options?.find(option => option.path === (item.id || item.erpId))
    return _incoTerms?.displayName
  }).filter(data => data)

  return displayNames && displayNames.length > 0 ? displayNames.join(', ') : '-'
}
