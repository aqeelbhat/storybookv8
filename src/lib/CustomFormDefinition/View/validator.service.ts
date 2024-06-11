import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { Cost, DateRangeObject, OptionWithJustification } from '../../Form/types'
import { isAddressInvalid, mapPhoneToString, validateDateOrdering, convertDateToString, validateEmail, mapIDRefToOption, mapCost, getDateObject, validateWebsite, isNullable } from '../../Form/util'
import { Address, AssessmentSubtype, Attachment, Certificate, ContactData, ContactFields, Document, IDRef, ItemDetails, Money, PurchaseOrder, SignatureStatus, SplitAccounting, TaxItem, TaxObject, User } from '../../Types/common'
import { Option } from '../../Types/input'
import { CustomFormDefinition } from '../types/CustomFormDefinition'
import { AssessmentExpiration, AssessmentRisk } from '../../Types/supplier'
import { ContactConfig, CustomFieldType, CustomFormData, FormDataConfig, ItemDetailsFields, ItemListConfig, MultiConfig, NumberConfig, ObjectSelectorConfig, SplitAccountingConfig, SplitType } from '../types/CustomFormModel'
import { LocalLabels } from '../types/localization'
import { getLineItemsTotalPrice, isDateOrderingValid, isRichTextEmpty, isNumberEqual } from '../../util'
import { deleteInvisibleFieldValues, getControlValueByType, isCustomFieldVisible, validator } from './FormDefinitionView.service'
import { FieldOptions } from '../NewView/FormView.component'
import { CustomFieldView, Section } from '../types/CustomFormView'
import { getI18Text as getI18ControlText } from '../../i18n'
import { getSessionUseItemDetailsV2 } from '../../sessionStorage'

// A validator function should accept a value, and
// 1. return error message if value is invalid
// 2. return empty string if value is valid

function doesStringMatchRegex(inputValue: string, regex: string): boolean {
  let regExpString = regex
  if (regExpString.startsWith('/') && regExpString.endsWith('/')) {
    regExpString = regExpString.slice(1,-1)
  }
  const regexExp = new RegExp(regExpString)
  return !!inputValue.match(regexExp)
}

export function stringValidator (value?: string | null, config?: { stringRegex?: string }): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (config?.stringRegex && value) {
    return doesStringMatchRegex(value, config?.stringRegex) ? '' : getI18ControlText('--validationMessages--.--fieldInvalid--')
  } else {
    return ''
  }
}

export function richTextValidator (value?: string | null): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (isRichTextEmpty(value)) {
    return getI18ControlText('--validationMessages--.--fieldInvalid--')
  } else {
    return ''
  }
}

export function attachmentValidator (value?: Attachment | File | null ): string {
  return !value ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function attachmentListValidator (value?: Attachment[] | File[] | null): string {
  return (!value || value.length === 0 || value.some(file => !file)) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function dateValidator (value: Date | null): string {
  return !value ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function dateTimeValidator (value?: string): string {
  return !value ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function dateRangeValidator (value?: DateRangeObject | null): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (!value.startDate) {
    return getI18ControlText('--validationMessages--.--startDateRequired--')
  } else if (!value.endDate) {
    return getI18ControlText('--validationMessages--.--endDateRequired--')
  } else if (!isDateOrderingValid(value.startDate, value.endDate)) {
    return getI18ControlText('--validationMessages--.--dateRangeInvalid--')
  }
  return ''
}

export function addressValidator (value?: Address | null): string {
  return isAddressInvalid(value) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''
}

export function addressListValidator (value?: Address[] | null, config?: { multiConfig?: MultiConfig }): string {
  const minCount = isNaN(config.multiConfig?.minCount) ? 1 : config.multiConfig.minCount
  if (!value || value.length === 0 || value.some(address => isAddressInvalid(address))) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  if (value.length < minCount) {
    return getI18ControlText('--validationMessages--.--atLeastMinimumRequired--', { min: minCount })
  }
  return ''
}

export function booleanValidator (value?: boolean | null): string {
  return (value === undefined || value === null) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

function getNumberConfigErrorMsg (numberConfig: NumberConfig): string {
  if (numberConfig && numberConfig.min && numberConfig.max) {
    return getI18ControlText('--validationMessages--.--valuesShouldBeBetweenLimits--', { min: numberConfig?.min, max: numberConfig?.max })
  } else if (numberConfig && numberConfig?.min) {
    return getI18ControlText('--validationMessages--.--valueShouldBeMore--', {  min: numberConfig?.min })
  } else if (numberConfig && numberConfig?.max) {
    getI18ControlText('--validationMessages--.--valueShouldBeLess--', { max: numberConfig?.max })
  } else {
    return ''
  }
}

export function numberValidator (value?: number | null, config?: { numberConfig?: NumberConfig }, allowZero?: boolean): string {
  if (config?.numberConfig && value !== undefined && value !== null) {
    if ((config?.numberConfig?.min && Number(value) < config?.numberConfig?.min) || (config?.numberConfig?.max && Number(value) > config?.numberConfig?.max)) {
      return getNumberConfigErrorMsg(config?.numberConfig)
    }
  } else {
    if(allowZero){
      return (isNullable(value) || isNaN(value)) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
    }else {
      return (!value || isNaN(value) || value === 0) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
    }
  }
}

export function singleSelectValidator (value?: Option | null): string {
  return (!value || !value.path) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function singleSelectWithJustificationValidator (value?: OptionWithJustification | null): string {
  return (!value?.option?.path || richTextValidator(value?.justification)) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function multipleSelectValidator (value?: Option[] | null): string {
  return (!value || value.length === 0 || value.some(option => !option?.path)) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function certificatesValidator (value?: Certificate[] | null, config?: { multiConfig?: MultiConfig }): string {
  return (!value || value.length === 0 || value.length < config?.multiConfig?.minCount || value.some(certificate => !certificate)) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function costValidator (value?: Cost | null): string {
  if (!value || !value.amount) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (!value.currency) {
    return getI18ControlText('--validationMessages--.--currencyRequired--')
  }
  return ''
}

export function userValidator (value?: User | null): string {
  const isValidUser = value?.userName || value?.email || value?.firstName || value?.lastName
  return (!value || !isValidUser ) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function userListValidator (value?: User[] | null): string {
  return (!value || value.length < 1 || value.some(user => userValidator(user))) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function phoneValidator (value?: string | null): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (!isPossiblePhoneNumber(value)) {
    return getI18ControlText('--validationMessages--.--phoneNumberInvalid--')
  }
  return ''
}

export function emailValidator (value?: string | null): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else {
    const listOfEmails = value ? value.split(';') : []
    let error = ''
    const foundError = listOfEmails.some(email => {
      const validationMsg = validateEmail('email', email, false)
      error = validationMsg
      return !!validationMsg
    })
    return error
  }
}

export function urlValidator (value?: string | null): string {
  return validateWebsite('url', value)
}

export function taxItemValidator (value?: TaxItem): string {
  if (!value || (value && (!value.taxCode || !value.percentage || !value.taxableAmount))) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  return ''
}

export function taxValidator (value?: TaxObject | null): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else if (value && value.items && Array.isArray(value.items) && value.items.length > 0) {
    return (value.items.some((value) => taxItemValidator(value))) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
  }
  return ''
}

function isItemFieldVisible (fieldName: ItemDetailsFields, config?: ItemListConfig) {
  if (config) {
    const field = Object.keys(ItemDetailsFields)[Object.values(ItemDetailsFields).indexOf(fieldName)]
    return config?.visibleFields?.find(e => e === field)
  }
}
function isItemFieldRequired (fieldName: ItemDetailsFields, config?: ItemListConfig) {
  if (config) {
    const field = Object.keys(ItemDetailsFields)[Object.values(ItemDetailsFields).indexOf(fieldName)]
    return config?.mandatoryFields?.find(e => e === field)
  }
}
function isItemFieldApplicable (fieldName: ItemDetailsFields, config?: ItemListConfig) {
  return isItemFieldVisible(fieldName, config) && isItemFieldRequired(fieldName, config)
}

export function lineItemValidatorV2 (
  value?: ItemDetails,
  config?: {
    itemListConfig: ItemListConfig,
    formDefinition: CustomFormDefinition,
    fieldName: string,
    options: FieldOptions,
    areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean},
    localLabels?: LocalLabels,
    isNested?: boolean,
    lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  }
): IValidationV2Response {
  let extensionFormData = value?.data
  if (config?.itemListConfig?.questionnaireId?.formId && config?.lineItemExtensionFormFetchData) {
    const fetchData = config.lineItemExtensionFormFetchData[config.fieldName]
    extensionFormData = fetchData()
  }
  const result = { hasError: false, errorMessage: '', itemId: '', parentIds: []}

  if (!value) {
    result.errorMessage = getI18ControlText('--validationMessages--.--fieldRequired--')
  }

  if (isItemFieldApplicable(ItemDetailsFields.type, config?.itemListConfig) && stringValidator(value?.type)) {
    result.errorMessage = stringValidator(value?.type)

  } else if (stringValidator(value?.name)) {
    result.errorMessage = stringValidator(value?.name)

  } else if (isItemFieldApplicable(ItemDetailsFields.categories, config?.itemListConfig) && multipleSelectValidator(value?.categories?.map(mapIDRefToOption))) {
    result.errorMessage = multipleSelectValidator(value?.categories?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.departments, config?.itemListConfig) && multipleSelectValidator(value?.departments?.map(mapIDRefToOption))) {
    result.errorMessage = multipleSelectValidator(value?.departments?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.description, config?.itemListConfig) && stringValidator(value?.description)) {
    result.errorMessage = stringValidator(value?.description)

  } else if (isItemFieldApplicable(ItemDetailsFields.quantity, config?.itemListConfig) && numberValidator(value?.quantity)) {
    result.errorMessage = numberValidator(value?.quantity, {}, true)

  } else if (isItemFieldApplicable(ItemDetailsFields.unitForQuantity, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.unitForQuantity))) {
    result.errorMessage = singleSelectValidator(mapIDRefToOption(value?.unitForQuantity))

  } else if (isItemFieldApplicable(ItemDetailsFields.price, config?.itemListConfig) && costValidator(mapCost(value?.price))) {
    result.errorMessage = costValidator(mapCost(value?.price))

  } else if (isItemFieldApplicable(ItemDetailsFields.tax, config?.itemListConfig) && taxValidator(value?.tax)) {
    result.errorMessage = taxValidator(value?.tax)

  } else if (isItemFieldApplicable(ItemDetailsFields.totalPrice, config?.itemListConfig) && costValidator(mapCost(value?.totalPrice))) {
    result.errorMessage = costValidator(mapCost(value?.totalPrice))

  } else if (isItemFieldApplicable(ItemDetailsFields.startDate, config?.itemListConfig) && dateValidator(getDateObject(value?.startDate))) {
    result.errorMessage = dateValidator(getDateObject(value?.startDate))

  } else if (isItemFieldApplicable(ItemDetailsFields.endDate, config?.itemListConfig) && dateValidator(getDateObject(value?.endDate))) {
    result.errorMessage = dateValidator(getDateObject(value?.endDate))

  } else if (value?.startDate && value?.endDate && validateDateOrdering(value?.startDate, value?.endDate)) {
    result.errorMessage = validateDateOrdering(value?.startDate, value?.endDate)

  } else if (isItemFieldApplicable(ItemDetailsFields.accountCode, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.accountCodeIdRef))) {
    result.errorMessage = singleSelectValidator(mapIDRefToOption(value?.accountCodeIdRef))

  } else if (isItemFieldApplicable(ItemDetailsFields.materialId, config?.itemListConfig) && stringValidator(value?.materialId)) {
    result.errorMessage = stringValidator(value?.materialId)

  } else if (isItemFieldApplicable(ItemDetailsFields.itemIds, config?.itemListConfig) && multipleSelectValidator(value?.itemIds?.map(mapIDRefToOption))) {
    result.errorMessage = multipleSelectValidator(value?.itemIds?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.lineOfBusiness, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.lineOfBusiness))) {
    result.errorMessage = singleSelectValidator(mapIDRefToOption(value?.lineOfBusiness))

  } else if (isItemFieldApplicable(ItemDetailsFields.location, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.location))) {
    result.errorMessage = singleSelectValidator(mapIDRefToOption(value?.location))

  } else if (isItemFieldApplicable(ItemDetailsFields.projectCode, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.projectCode))) {
    result.errorMessage = singleSelectValidator(mapIDRefToOption(value?.projectCode))

  } else if (isItemFieldApplicable(ItemDetailsFields.supplierPartId, config?.itemListConfig) && stringValidator(value?.supplierPartId)) {
    result.errorMessage = stringValidator(value?.supplierPartId)

  } else if (isItemFieldApplicable(ItemDetailsFields.manufacturerPartId, config?.itemListConfig) && stringValidator(value?.manufacturerPartId)) {
    result.errorMessage = stringValidator(value?.manufacturerPartId)

  } else if (isItemFieldApplicable(ItemDetailsFields.expenseCategory, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.expenseCategory))) {
    result.errorMessage = singleSelectValidator(mapIDRefToOption(value?.expenseCategory))

  } else if (isItemFieldApplicable(ItemDetailsFields.trackCode, config?.itemListConfig) && multipleSelectValidator(value?.trackCode?.map(mapIDRefToOption))) {
    result.errorMessage = multipleSelectValidator(value?.trackCode?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.url, config?.itemListConfig) && stringValidator(value?.url)) {
    result.errorMessage = stringValidator(value?.url)

  } else if (isItemFieldApplicable(ItemDetailsFields.images, config?.itemListConfig) && attachmentListValidator(value?.images)) {
    result.errorMessage = attachmentListValidator(value?.images)

  } else if (isItemFieldApplicable(ItemDetailsFields.specifications, config?.itemListConfig) && attachmentListValidator(value?.specifications)) {
    result.errorMessage = attachmentListValidator(value?.specifications)

  } else if (config?.itemListConfig?.questionnaireId?.formId && isFormInvalid(config?.formDefinition, extensionFormData, config?.options, config?.areOptionsAvailableForMasterDataField, config?.localLabels)) {
    result.errorMessage = isFormInvalid(config?.formDefinition, extensionFormData, config?.options, config?.areOptionsAvailableForMasterDataField, config?.localLabels)
  }
  // if error found
  if(result.errorMessage ){
    result.itemId = value?.id
    result.hasError = true
    return result;
  }

  // if nested children available
  if(config.isNested && value.children){
    const _child = value.children.find((item)=>{
      const error = lineItemValidatorV2(item, config)
      if(error.hasError) {
        result.hasError = true
        result.errorMessage = error.errorMessage
        result.itemId = error.itemId
        result.parentIds = [value.id, ...error.parentIds]
        return true;
      }
      return false
    })
  }

  return result
}
export function lineItemValidator (
  value?: ItemDetails,
  config?: {
    itemListConfig: ItemListConfig,
    formDefinition: CustomFormDefinition,
    options: FieldOptions,
    areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean},
    localLabels?: LocalLabels,
    isNested?: boolean
  }
): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }

  if (isItemFieldApplicable(ItemDetailsFields.type, config?.itemListConfig) && stringValidator(value?.type)) {
    return stringValidator(value?.type)

  } else if (stringValidator(value?.name)) {
    return stringValidator(value?.name)

  } else if (isItemFieldApplicable(ItemDetailsFields.categories, config?.itemListConfig) && multipleSelectValidator(value?.categories?.map(mapIDRefToOption))) {
    return multipleSelectValidator(value?.categories?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.departments, config?.itemListConfig) && multipleSelectValidator(value?.departments?.map(mapIDRefToOption))) {
    return multipleSelectValidator(value?.departments?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.description, config?.itemListConfig) && stringValidator(value?.description)) {
    return stringValidator(value?.description)

  } else if (isItemFieldApplicable(ItemDetailsFields.quantity, config?.itemListConfig) && numberValidator(value?.quantity)) {
    return numberValidator(value?.quantity, {}, true)

  } else if (isItemFieldApplicable(ItemDetailsFields.unitForQuantity, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.unitForQuantity))) {
    return singleSelectValidator(mapIDRefToOption(value?.unitForQuantity))

  } else if (isItemFieldApplicable(ItemDetailsFields.price, config?.itemListConfig) && costValidator(mapCost(value?.price))) {
    return costValidator(mapCost(value?.price))

  } else if (isItemFieldApplicable(ItemDetailsFields.tax, config?.itemListConfig) && taxValidator(value?.tax)) {
    return taxValidator(value?.tax)

  } else if (isItemFieldApplicable(ItemDetailsFields.totalPrice, config?.itemListConfig) && costValidator(mapCost(value?.totalPrice))) {
    return costValidator(mapCost(value?.totalPrice))

  } else if (isItemFieldApplicable(ItemDetailsFields.startDate, config?.itemListConfig) && dateValidator(getDateObject(value?.startDate))) {
    return dateValidator(getDateObject(value?.startDate))

  } else if (isItemFieldApplicable(ItemDetailsFields.endDate, config?.itemListConfig) && dateValidator(getDateObject(value?.endDate))) {
    return dateValidator(getDateObject(value?.endDate))

  } else if (value?.startDate && value?.endDate && validateDateOrdering(value?.startDate, value?.endDate)) {
    return validateDateOrdering(value?.startDate, value?.endDate)

  } else if (isItemFieldApplicable(ItemDetailsFields.accountCode, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.accountCodeIdRef))) {
    return singleSelectValidator(mapIDRefToOption(value?.accountCodeIdRef))

  } else if (isItemFieldApplicable(ItemDetailsFields.materialId, config?.itemListConfig) && stringValidator(value?.materialId)) {
    return stringValidator(value?.materialId)

  } else if (isItemFieldApplicable(ItemDetailsFields.itemIds, config?.itemListConfig) && multipleSelectValidator(value?.itemIds?.map(mapIDRefToOption))) {
    return multipleSelectValidator(value?.itemIds?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.lineOfBusiness, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.lineOfBusiness))) {
    return singleSelectValidator(mapIDRefToOption(value?.lineOfBusiness))

  } else if (isItemFieldApplicable(ItemDetailsFields.location, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.location))) {
    return singleSelectValidator(mapIDRefToOption(value?.location))

  } else if (isItemFieldApplicable(ItemDetailsFields.projectCode, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.projectCode))) {
    return singleSelectValidator(mapIDRefToOption(value?.projectCode))

  } else if (isItemFieldApplicable(ItemDetailsFields.supplierPartId, config?.itemListConfig) && stringValidator(value?.supplierPartId)) {
    return stringValidator(value?.supplierPartId)

  } else if (isItemFieldApplicable(ItemDetailsFields.manufacturerPartId, config?.itemListConfig) && stringValidator(value?.manufacturerPartId)) {
    return stringValidator(value?.manufacturerPartId)

  } else if (isItemFieldApplicable(ItemDetailsFields.expenseCategory, config?.itemListConfig) && singleSelectValidator(mapIDRefToOption(value?.expenseCategory))) {
    return singleSelectValidator(mapIDRefToOption(value?.expenseCategory))

  } else if (isItemFieldApplicable(ItemDetailsFields.trackCode, config?.itemListConfig) && multipleSelectValidator(value?.trackCode?.map(mapIDRefToOption))) {
    return multipleSelectValidator(value?.trackCode?.map(mapIDRefToOption))

  } else if (isItemFieldApplicable(ItemDetailsFields.url, config?.itemListConfig) && stringValidator(value?.url)) {
    return stringValidator(value?.url)

  } else if (isItemFieldApplicable(ItemDetailsFields.images, config?.itemListConfig) && attachmentListValidator(value?.images)) {
    return attachmentListValidator(value?.images)

  } else if (isItemFieldApplicable(ItemDetailsFields.specifications, config?.itemListConfig) && attachmentListValidator(value?.specifications)) {
    return attachmentListValidator(value?.specifications)

  } else if (config?.itemListConfig?.questionnaireId?.formId && isFormInvalid(config?.formDefinition, value?.data, config?.options, config?.areOptionsAvailableForMasterDataField, config?.localLabels)) {
    return isFormInvalid(config?.formDefinition, value?.data, config?.options, config?.areOptionsAvailableForMasterDataField, config?.localLabels)
  }
  // if nested
  if(config.isNested && value.children && value.children.some((item)=>lineItemValidator(item, config))){
    return getI18ControlText('--validationMessages--.--fieldMissing--')
  }

  return ''
}

export function itemListValidator (
  value?: { items: Array<ItemDetails> } | null,
  config?: {
    itemListConfig: ItemListConfig,
    formDefinition: CustomFormDefinition,
    options: FieldOptions,
    areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean},
    localLabels?: LocalLabels,
    totalMoneyConfig?: {
      totalMoney: Money,
      errorMsg: string
    },
    isNested?: boolean,
    lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  }
): string {
  if (!value?.items || value.items.length < 1) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  if (value.items.some(item => lineItemValidator(item, config))) {
    return getI18ControlText('--validationMessages--.--fieldMissing--')
  }
  // Minimum items
  if (config && config?.itemListConfig?.minimumSize && (value.items.length < config?.itemListConfig?.minimumSize)) {
    return getI18ControlText('--validationMessages--.--atLeastMinimumRequired--', { min: config?.itemListConfig?.minimumSize || 0 })
  }
  // Maximum items
  if (config && config?.itemListConfig?.maximumSize && (value.items.length > config?.itemListConfig?.maximumSize)) {
    return getI18ControlText('--validationMessages--.--atMostMaximumAllowed--', { max: config?.itemListConfig?.maximumSize || 0 })
  }
  // Total amount match with Config Total
  if (config && config.totalMoneyConfig && config.totalMoneyConfig.totalMoney && config.totalMoneyConfig.errorMsg) {
    const TotalAmount = config.totalMoneyConfig.totalMoney.amount || 0
    const calculateAmount = getLineItemsTotalPrice(value.items, config?.isNested)

    if (!isNumberEqual(calculateAmount.amount, TotalAmount)) {
      return config.totalMoneyConfig.errorMsg
    }
  }
  return ''
}
export type IValidationV2Response = {
  hasError: boolean
  errorMessage?: string
  itemId?: string
  parentIds: string[]
}
export function itemListValidatorV2 (
  value?: { items: Array<ItemDetails> } | null,
  config?: {
    itemListConfig: ItemListConfig,
    formDefinition: CustomFormDefinition,
    fieldName: string,
    options: FieldOptions,
    areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean},
    localLabels?: LocalLabels,
    totalMoneyConfig?: {
      totalMoney: Money,
      errorMsg: string
    },
    isNested?: boolean,
    lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  }
): IValidationV2Response {
  const result = {hasError: true, errorMessage : '', itemId: '', parentIds: [] }

  if (!value?.items || value.items.length < 1) {
    result.errorMessage = getI18ControlText('--validationMessages--.--fieldRequired--')
    return result
  }
  const childValidate = value.items.find(item => {
    const validate = lineItemValidatorV2(item, config)
    if(validate.hasError) {
      result.hasError = true
      result.errorMessage = getI18ControlText('--validationMessages--.--fieldMissing--')
      result.itemId = validate.itemId
      result.parentIds= validate.parentIds
      return true
    }
    return false
  })
  if(childValidate) {
    return result
  }
  // Minimum items
  if (config && config?.itemListConfig?.minimumSize && (value.items.length < config?.itemListConfig?.minimumSize)) {
    result.errorMessage = getI18ControlText('--validationMessages--.--atLeastMinimumRequired--', { min: config?.itemListConfig?.minimumSize || 0 })
    return result
  }
  // Maximum items
  if (config && config?.itemListConfig?.maximumSize && (value.items.length > config?.itemListConfig?.maximumSize)) {
    result.errorMessage = getI18ControlText('--validationMessages--.--atMostMaximumAllowed--', { max: config?.itemListConfig?.maximumSize || 0 })
    return result
  }
  // Total amount match with Config Total
  if (config && config.totalMoneyConfig && config.totalMoneyConfig.totalMoney && config.totalMoneyConfig.errorMsg) {
    const TotalAmount = config.totalMoneyConfig.totalMoney.amount || 0
    const calculateAmount = getLineItemsTotalPrice(value.items, config?.isNested)

    if (!isNumberEqual(calculateAmount.amount, TotalAmount)) {
      result.errorMessage = config.totalMoneyConfig.errorMsg
      return result
    }
  }
  result.hasError = false
  return result
}

function isContactFieldVisible (fieldName: ContactFields, config?: ContactConfig) {
  if (config) {
    const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName)]
    return config?.visibleFields?.find(e => e === field)
  }
}
function isContactFieldRequired (fieldName: ContactFields, config?: ContactConfig) {
  if (config) {
    const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName)]
    return config?.mandatoryFields?.find(e => e === field)
  }
}
export function contactValidator (value?: ContactData, config?: { contactConfig?: ContactConfig }): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  if (stringValidator(value?.fullName)) {
    return stringValidator(value?.fullName)
  } else if (isContactFieldVisible(ContactFields.title, config?.contactConfig) && isContactFieldRequired(ContactFields.title, config?.contactConfig) && stringValidator(value?.title)) {
    return stringValidator(value?.title)
  } else if (isContactFieldVisible(ContactFields.email, config?.contactConfig) && isContactFieldRequired(ContactFields.email, config?.contactConfig) && emailValidator(value?.email)) {
    return emailValidator(value?.email)
  } else if (isContactFieldVisible(ContactFields.phone, config?.contactConfig) && isContactFieldRequired(ContactFields.phone, config?.contactConfig) && phoneValidator(mapPhoneToString(value?.phoneObject))) {
    return phoneValidator(mapPhoneToString(value?.phoneObject))
  } else if (isContactFieldVisible(ContactFields.url, config?.contactConfig) && isContactFieldRequired(ContactFields.url, config?.contactConfig) && stringValidator(value?.url)) {
    return stringValidator(value?.url)
  } else if (isContactFieldVisible(ContactFields.address, config?.contactConfig) && isContactFieldRequired(ContactFields.address, config?.contactConfig) && addressValidator(value?.address)) {
    return addressValidator(value?.address)
  } else if (isContactFieldVisible(ContactFields.note, config?.contactConfig) && isContactFieldRequired(ContactFields.note, config?.contactConfig) && stringValidator(value?.note)) {
    return stringValidator(value?.note)
  }else if (isContactFieldVisible(ContactFields.attachments, config?.contactConfig) && isContactFieldRequired(ContactFields.attachments, config?.contactConfig) && attachmentListValidator(value?.attachments)) {
    return attachmentListValidator(value?.attachments)
  } else if (isContactFieldVisible(ContactFields.role, config?.contactConfig) && isContactFieldRequired(ContactFields.role, config?.contactConfig) && stringValidator(value?.role)) {
    return stringValidator(value?.role)
  } else if (isContactFieldVisible(ContactFields.rate, config?.contactConfig) && isContactFieldRequired(ContactFields.rate, config?.contactConfig) && costValidator(value?.rate)) {
    return costValidator(value?.rate)
  } else if (isContactFieldVisible(ContactFields.startDate, config?.contactConfig) && isContactFieldRequired(ContactFields.startDate, config?.contactConfig) && dateValidator(value?.startDate)) {
    return dateValidator(value?.startDate)
  } else if (isContactFieldVisible(ContactFields.endDate, config?.contactConfig) && isContactFieldRequired(ContactFields.endDate, config?.contactConfig) && dateValidator(value?.endDate)) {
    return dateValidator(value?.endDate)
  } else if (value?.startDate && value?.endDate && validateDateOrdering(convertDateToString(value?.startDate), convertDateToString(value?.endDate))) {
    return validateDateOrdering(convertDateToString(value?.startDate), convertDateToString(value?.endDate))
  } else if (isContactFieldVisible(ContactFields.backgroundCheck, config?.contactConfig) && isContactFieldRequired(ContactFields.backgroundCheck, config?.contactConfig) && booleanValidator(value?.requireBackgroundCheck)) {
    return booleanValidator(value?.requireBackgroundCheck)
  } else if (isContactFieldVisible(ContactFields.percentageOfShare, config?.contactConfig) && isContactFieldRequired(ContactFields.percentageOfShare, config?.contactConfig) && numberValidator(value?.sharePercentage, {...config, numberConfig: {min: config?.contactConfig?.minOwnershipPercentage, max: 0}})) {
    return numberValidator(value?.sharePercentage, {...config, numberConfig: {min: config?.contactConfig?.minOwnershipPercentage, max: 0}})
  } else if (isContactFieldVisible(ContactFields.uom, config?.contactConfig) && isContactFieldRequired(ContactFields.uom, config?.contactConfig) && stringValidator(value?.uom?.id || '')) {
    return stringValidator(value?.uom?.id)
  } else if (isContactFieldVisible(ContactFields.country, config?.contactConfig) && isContactFieldRequired(ContactFields.country, config?.contactConfig) && stringValidator(value?.address?.alpha2CountryCode || '')) {
    return stringValidator(value?.address?.alpha2CountryCode)
  } else if (isContactFieldVisible(ContactFields.service, config?.contactConfig) && isContactFieldRequired(ContactFields.service, config?.contactConfig) && stringValidator(value?.service || '')) {
    return stringValidator(value?.service)
  } else if (isContactFieldVisible(ContactFields.countryOfOperation, config?.contactConfig) && isContactFieldRequired(ContactFields.countryOfOperation, config?.contactConfig) && stringValidator(value?.operationLocation?.alpha2CountryCode || '')) {
    return stringValidator(value?.operationLocation?.alpha2CountryCode)
  }else {
    return ''
  }
}

export function contactListValidator (value?: Array<ContactData>, config?: { contactConfig?: ContactConfig }): string {
  return (!value || value.length < config?.contactConfig?.miniumSize || value.some(item => contactValidator(item, config))) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function draftLegalDocumentsValidator (value?: Array<Document> | null): string {
  return (!value || value.length === 0 || value.some(file => !file)) ? (getI18ControlText('--validationMessages--.--fieldRequired--')) : ''
}

export function signedLegalDocumentsValidator (value?: {
  signedDocuments: Array<Document>,
  draftDocuments: Array<Document>,
  finalisedDocuments: Array<Document>,
  signatureStatus: SignatureStatus
} | null): string {
  const currentDraftDocuments = value?.finalisedDocuments && value?.finalisedDocuments?.length > 0 ? value.finalisedDocuments : value.draftDocuments
  const allCurrentDraftDocumentsTypes = currentDraftDocuments.map(item => item.type.id)
  const signedDocumentsTypes = value?.signedDocuments?.map(doc => doc.type.id)
  const checkEveryTypeInSignedDocument = allCurrentDraftDocumentsTypes.every(type => signedDocumentsTypes.includes(type))

  return checkEveryTypeInSignedDocument && value?.signedDocuments?.length >= currentDraftDocuments.length  ? '' : getI18ControlText('--validationMessages--.--documentsRequired--')
}

export function draftLegalDocumentsValidatorNew (value?: Array<Document> | null, config?: { optional?: boolean }): string {
  if (value && value?.length > 0) {
    const checkIsThereAnyEmptyDocument = value?.some(doc => !doc?.attachment && !doc?.sourceUrlAttachment)
    if (checkIsThereAnyEmptyDocument) {
      return getI18ControlText('--validationMessages--.--emptyDocuments--')
    }
    return ''
  } else {
    if (config?.optional) return ''
    if (value?.length === 0) {
      return getI18ControlText('--validationMessages--.--documentsRequired--')
    }
  }
  return ''
}

export function signedLegalDocumentsValidatorNew (value?: {
  signedDocuments: Array<Document>,
  draftDocuments: Array<Document>,
  finalisedDocuments: Array<Document>,
  signatureStatus: SignatureStatus
} | null, config?: { optional?: boolean }): string {
  if (value?.signedDocuments?.length > 0) {
    const checkIsThereAnyEmptyDocument = value?.signedDocuments?.some(doc => !doc?.attachment && !doc?.sourceUrlAttachment)
    if (checkIsThereAnyEmptyDocument) {
      return getI18ControlText('--validationMessages--.--emptyDocuments--')
    }
    return ''
  } else {
    if (config?.optional) return ''
    if (value?.signedDocuments?.length === 0) {
      return getI18ControlText('--validationMessages--.--documentsRequired--')
    }
  }
  return ''
}

export function riskValidator (value?: AssessmentRisk): string {
  if (!value || !value.riskScore || !value.riskScore.level) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  return ''
}

export function assessmentSubtypeValidator (value?: AssessmentSubtype): string {
  if (!value || !value.subType || !value.subType.id) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  return ''
}

export function assessmentExpirationValidator (value?: AssessmentExpiration): string {
  return dateTimeValidator(value?.expiration)
}

function poValidator (value?: PurchaseOrder): string {
  if (!value || !value.poNumber) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  return ''
}

export function objectValidator (value?: IDRef, config?: { objectConfig?: ObjectSelectorConfig }): string {
  if (!value || (!value.id && !value.refId)) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }

  return ''
}

function splitValidator (value?: SplitAccounting, config?: {splitConfig: SplitAccountingConfig}): string {
  if (!value) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  if (singleSelectValidator(mapIDRefToOption(value?.id))) {
    return singleSelectValidator(mapIDRefToOption(value?.id))
  }
  if (config?.splitConfig?.type === SplitType.amount && costValidator(mapCost(value.amount))) {
    return costValidator(mapCost(value.amount))
  }
  if (config?.splitConfig?.type !== SplitType.amount && value?.percentage !== 0 && numberValidator(value.percentage)) {
    return numberValidator(value.percentage)
  }
}

export function splitListValidator (value?: SplitAccounting[], config?: {splitConfig: SplitAccountingConfig}): string {
  if (!value || value.length < 1) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  }
  if (value.some(split => splitValidator(split, config))) {
    return getI18ControlText('--validationMessages--.--fieldMissing--')
  }
  if (config?.splitConfig?.type !== SplitType.amount && value.reduce((totalPercentage, split) => (totalPercentage + split.percentage), 0) !== 100) {
    return getI18ControlText('--validationMessages--.--splitPercentagesShouldAddUpTo100--')
  }
  return ''
}

export function validateFile (file: File, fileTypes?: string): string {
  // Only validated for Custom Form
  if (fileTypes?.length > 0 && fileTypes.includes(file.type)) {
    return 'File type not accepted'
  }
  return ''
}

export function formDataListValidator (value?: CustomFormData | CustomFormData[] | null,
  config?: {
    formDataConfig: FormDataConfig,
    formDefinition: CustomFormDefinition,
    options: FieldOptions,
    areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean},
    localLabels?: LocalLabels
  }) {
    if (Array.isArray(value)) {
      let invalidField = ''
      value.forEach(data => {
        invalidField = isFormInvalid(config?.formDefinition, data, config?.options, config?.areOptionsAvailableForMasterDataField, config?.localLabels)
      })
      return invalidField
    } else {
      return isFormInvalid(config?.formDefinition, value, config?.options, config?.areOptionsAvailableForMasterDataField, config?.localLabels)
    }
}

export function isFormInvalid (formDefinition: CustomFormDefinition, formData: CustomFormData, options: FieldOptions, areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}, localLabels?: LocalLabels, extensionCustomFormDefinition?: {[fieldName: string]: CustomFormDefinition}): string {
  function isSectionVisible (section: Section): boolean {
    if (section.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(formData, formDefinition)
      return isCustomFieldVisible(section.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function isFieldVisible (field: CustomFieldView): boolean {
    if (field.field.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(formData, formDefinition)
      return isCustomFieldVisible(field.field.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function isFieldNotHidden (field: CustomFieldView): boolean {
    return !field.field.isHidden
  }

  function isFieldEditable (field: CustomFieldView): boolean {
    return !field.field.isReadOnly
  }

  function isFieldRequired (field: CustomFieldView): boolean {
    return !field.field.optional
  }

  function isMasterdataAvailable (field: CustomFieldView): boolean {
    if (field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect && areOptionsAvailableForMasterDataField) {
      return areOptionsAvailableForMasterDataField?.[field.field.fieldName]
    } else {
      return true
    }
  }

  // validate each field (if it's visible and required and mastersata available)
  let invalidFieldId = ''

  formDefinition?.view?.sections?.filter(isSectionVisible)
    .forEach(section => {
      section?.grids?.forEach(grid => {
        grid?.fields?.forEach(field => {
          if (isFieldVisible(field)) {
            if (field.field.customFieldType === CustomFieldType.errorInstruction) {
              // If 'errorInstruction' field is visible, treat it as invalid form
              if (!invalidFieldId) {
                invalidFieldId = `${field.field.id}`
              }
            } else if (isFieldNotHidden(field) && isFieldRequired(field) && isFieldEditable(field) && isMasterdataAvailable(field)) {
              // Validate field value
              const inputControlValue = getControlValueByType(formData?.[field.field.fieldName], field.field)
              const validationError = validator(
                {
                  fieldValue: inputControlValue,
                  signedDocuments: options?.signedDocuments || [],
                  draftDocuments: options?.draftDocuments || [],
                  finalisedDocuments: options?.finalisedDocuments || []
                },
                field.field.customFieldType,
                field.field,
                getSessionUseItemDetailsV2(),
                {
                  definitionsForExtensionCustomForms: extensionCustomFormDefinition,
                  options: options,
                  areOptionsAvailableForMasterDataField: areOptionsAvailableForMasterDataField,
                  localLabels: localLabels
                }
              )

              if (validationError) {
                if (!invalidFieldId) {
                  invalidFieldId = `${field.field.id}`
                }
              }
            }
          }
        })
      })
    })

  return invalidFieldId
}
