import React from 'react'
import { CustomFieldCondition, CustomFieldType, CustomFieldValue, CustomFormData, CustomFormField } from '../types/CustomFormModel'
import { CustomFormDefinition, CustomFormType } from '../types/CustomFormDefinition'
import { AttachmentEmailValue, DateValue, DateRangeValue, mapCustomFieldValue, MasterdataValue, MultipleMasterdataValue, AddressValue, AddressesValue, CertificatesValue, UserIdValue, PhoneValue, UserIdListValue, LegalDocumentsEmailValue, ContactsValue, ContactsEmailValue, SingleContactValue, SingleContactEmailValue, MoneyValue, RiskValue, SingleSelectionValue, MultipleSelectionValue, ObjectEmailValue, SplitAccountingValue, URLReadOnlyControl, SingleSelectionWithJustificationValue, SingleSelectionWithJustificationEmailValue, DateTimeValue, LegalDocumentsValueNew, SplitAccountingEmailValue, AssessmentSubTypeValue, AssessmentExpirationValue } from './ReadOnlyValues'
import {
  AttachmentsControl, AttachmentControl, DocumentControl, DropdownControl, NumberControl, TextControl, YesNoRadioControl, CheckboxControl, UploadCertificates, TextAreaControl, RichTextControl, MultipleAddressControl, SingleAddressControl, MoneyControl,
  TextControlNew,
  TextAreaControlNew,
  RichTextControlNew,
  NumberControlNew,
  MoneyControlNew,
  YesNoRadioControlNew,
  DateControlNew,
  CheckboxNew,
  DropdownControlNew,
  DateRangeControlNew,
  UserIdControlNew,
  SingleAddressControlNew,
  MultipleAddressControlNew,
  DocumentControlNew,
  AttachmentControlNew,
  AttachmentsControlNew,
  UploadCertificatesNew,
  ContactControl,
  SingleContactControl,
  RiskControl,
  EmailControl,
  ObjectSelectorControl,
  SplitAccountingControl,
  DateTimeControlNew
} from '../../controls'
import { mapChoiceWithJustificationToOption, mapOptionsToChoices, mapOptionToChoice, mapOptionWithJustificationToChoice, mapSelectedChoicesToOptions, mapSelectedChoiceToOption } from './mapper'
import { OROPhoneInput, OROPhoneInputNew, Radio, RadioNew } from '../../Inputs'
import type { CustomFieldView, Grid, Section } from '../types/CustomFormView'
import { mapMasterDataOptionToIDRef, mapOptionsToIDRefs, mapMasterDataIDRefToOption, mapPhoneToString, mapSitesToOption, mapStringToPhone } from '../../Form/util'
import { ItemDetailsControlNew, ItemDetailsControlNewEmailValue } from '../../controls/itemDetailsControl.component'
import {
  addressListValidator, addressValidator, attachmentListValidator, attachmentValidator, booleanValidator, certificatesValidator, dateRangeValidator, dateValidator,
  itemListValidator, costValidator, multipleSelectValidator, numberValidator, phoneValidator, singleSelectValidator, stringValidator, userValidator, contactListValidator, contactValidator, riskValidator, emailValidator, userListValidator, objectValidator, splitListValidator, formDataListValidator, urlValidator, singleSelectWithJustificationValidator, richTextValidator, signedLegalDocumentsValidatorNew, dateTimeValidator, draftLegalDocumentsValidatorNew, assessmentSubtypeValidator, itemListValidatorV2, assessmentExpirationValidator
} from './validator.service'

import style from './FormDefinitionView.module.scss'
import queStyle from '../NewView/QuestionnaireView.module.scss'
import { arrayEqualityChecker, assessmentExpirationEqualityChecker, itemListEqualityChecker, literalEqualityChecker, objectEqualityChecker, riskEqualityChecker } from './equalityChecker.service'
import { Document, PurchaseOrder, SignatureStatus } from '../../Types'
import { LocalChoices, LocalLabels } from '../types/localization'
import { InstructionImageControl } from '../../controls/document.component'
import { FieldOptions } from '../NewView/FormView.component'
import { DraftLegalDocumentNew, SignedLegalDocumentNew } from '../../controls/legalDocumentsNew.component'
import { RadioWithJustification } from '../../Inputs/toggle.component'
import { AssessmentSubTypeControl } from '../../controls/assessment-subType.component'
import { AssessmentExpirationComponent } from '../../controls/assessment-Expiration.component'

const INLINE_FIELD_TYPES: Array<CustomFieldType> = [CustomFieldType.bool]
// const CONDITIONAL_INLINE_FIELD_TYPES: Array<CustomFieldType> = [CustomFieldType.single_selection, CustomFieldType.multiple_selection]
const TWOLINE_FIELD_TYPES: Array<CustomFieldType> = [CustomFieldType.attachment, CustomFieldType.document]
const SHORT_FIELD_TYPES: Array<CustomFieldType> = [CustomFieldType.number, CustomFieldType.date]
const CONDITIONAL_SHORT_FIELD_TYPES: Array<CustomFieldType> = [CustomFieldType.single_selection, CustomFieldType.single_selection_with_justification, CustomFieldType.multiple_selection]
const AUTO_SCROLLABLE_FIELD_TYPES: Array<CustomFieldType> = [CustomFieldType.bool, CustomFieldType.attachment, CustomFieldType.single_selection, CustomFieldType.single_selection_with_justification]
const MAX_INLINE_CHOICES = 8
export const DEFAULT_LEGAL_DOCUMENT_ID_PREFIX = 'legal_temp_'

export const ControlWidthMap = new Map<CustomFieldType, any>([
  [CustomFieldType.attachment, style.col4],
  [CustomFieldType.document, style.col4],
  [CustomFieldType.date, style.col1],
  [CustomFieldType.dateTimeUTC, style.col1],
  [CustomFieldType.string, style.col3],
  [CustomFieldType.email, style.col3],
  [CustomFieldType.bool, style.col2],
  [CustomFieldType.number, style.col1],
  [CustomFieldType.single_selection, style.col3],
  [CustomFieldType.single_selection_with_justification, style.col3],
  [CustomFieldType.multiple_selection, style.col3],
  [CustomFieldType.money, style.col2],
  [CustomFieldType.certificate, style.col3],
  [CustomFieldType.masterdata, style.col2],
  [CustomFieldType.masterdata_multiselect, style.col2],
  [CustomFieldType.assessmentSubtype, style.col2],
  [CustomFieldType.assessmentExpiration, style.col2],
  [CustomFieldType.dateRange, style.col2],
  [CustomFieldType.address, style.col3],
  [CustomFieldType.addresses, style.col3],
  [CustomFieldType.textArea, style.col3],
  [CustomFieldType.richText, style.col3],
  [CustomFieldType.userid, style.col2],
  [CustomFieldType.userIdList, style.col2],
  [CustomFieldType.phone, style.col2],
  [CustomFieldType.itemList, style.col4],
  [CustomFieldType.draftLegalDocumentList, style.col3],
  [CustomFieldType.signedLegalDocumentList, style.col3],
  [CustomFieldType.contacts, style.col3],
  [CustomFieldType.contact, style.col3],
  [CustomFieldType.assessmentRisk, style.col2],
  [CustomFieldType.objectSelector, style.col3],
  [CustomFieldType.splitAccounting, style.col3],
  [CustomFieldType.url, style.col3],
  [CustomFieldType.errorInstruction, style.col3],
  [CustomFieldType.item, style.col4]
])
export const QuestionWidthMap = new Map<CustomFieldType, any>([
  [CustomFieldType.attachment, queStyle.subcol4],
  [CustomFieldType.document, queStyle.subcol4],
  [CustomFieldType.date, queStyle.subcol2],
  [CustomFieldType.dateTimeUTC, queStyle.subcol2],
  [CustomFieldType.string, queStyle.subcol4],
  [CustomFieldType.email, queStyle.subcol4],
  [CustomFieldType.bool, queStyle.subcol3],
  [CustomFieldType.number, queStyle.subcol2],
  [CustomFieldType.single_selection, queStyle.subcol4],
  [CustomFieldType.single_selection_with_justification, queStyle.subcol4],
  [CustomFieldType.multiple_selection, queStyle.subcol4],
  [CustomFieldType.money, queStyle.subcol3],
  [CustomFieldType.certificate, queStyle.subcol3],
  [CustomFieldType.masterdata, queStyle.subcol3],
  [CustomFieldType.masterdata_multiselect, queStyle.subcol3],
  [CustomFieldType.assessmentSubtype, queStyle.subcol3],
  [CustomFieldType.assessmentExpiration, queStyle.subcol3],
  [CustomFieldType.dateRange, queStyle.subcol3],
  [CustomFieldType.address, queStyle.subcol4],
  [CustomFieldType.addresses, queStyle.subcol4],
  [CustomFieldType.textArea, queStyle.subcol4],
  [CustomFieldType.richText, queStyle.subcol4],
  [CustomFieldType.userid, queStyle.subcol3],
  [CustomFieldType.userIdList, queStyle.subcol3],
  [CustomFieldType.phone, queStyle.subcol3],
  [CustomFieldType.itemList, queStyle.subcol4],
  [CustomFieldType.draftLegalDocumentList, queStyle.subcol3],
  [CustomFieldType.signedLegalDocumentList, queStyle.subcol3],
  [CustomFieldType.contacts, queStyle.subcol4],
  [CustomFieldType.contact, queStyle.subcol4],
  [CustomFieldType.assessmentRisk, queStyle.subcol3],
  [CustomFieldType.objectSelector, queStyle.subcol4],
  [CustomFieldType.splitAccounting, style.col4],
  [CustomFieldType.url, queStyle.subcol4],
  [CustomFieldType.errorInstruction, queStyle.subcol4],
  [CustomFieldType.item, queStyle.subcol4]
])

/**
 * @deprecated use ControlTypeMapNew
 */
const ControlTypeMap = new Map<CustomFieldType, any>([
  [CustomFieldType.attachment, AttachmentControl],
  [CustomFieldType.attachments, AttachmentsControl],
  [CustomFieldType.document, DocumentControl],
  // [CustomFieldType.date, DateControl],
  // [CustomFieldType.dateRange, DateRangeControl],
  [CustomFieldType.address, SingleAddressControl],
  [CustomFieldType.addresses, MultipleAddressControl],
  [CustomFieldType.string, TextControl],
  [CustomFieldType.email, EmailControl],
  [CustomFieldType.bool, YesNoRadioControl],
  [CustomFieldType.number, NumberControl],
  [CustomFieldType.single_selection, Radio],
  [CustomFieldType.multiple_selection, CheckboxControl],
  [CustomFieldType.certificate, UploadCertificates],
  [CustomFieldType.money, MoneyControl],
  [CustomFieldType.masterdata, DropdownControl],
  [CustomFieldType.assessmentSubtype, DropdownControl],
  [CustomFieldType.masterdata_multiselect, DropdownControl],
  [CustomFieldType.textArea, TextAreaControl],
  [CustomFieldType.richText, RichTextControl],
  [CustomFieldType.phone, OROPhoneInput],
  [CustomFieldType.itemList, ItemDetailsControlNew]
])
const ControlTypeMapNew = new Map<CustomFieldType, any>([
  [CustomFieldType.attachment, AttachmentControlNew],
  [CustomFieldType.attachments, AttachmentsControlNew],
  [CustomFieldType.document, DocumentControlNew],
  [CustomFieldType.date, DateControlNew],
  [CustomFieldType.dateTimeUTC, DateTimeControlNew],
  [CustomFieldType.dateRange, DateRangeControlNew],
  [CustomFieldType.address, SingleAddressControlNew],
  [CustomFieldType.addresses, MultipleAddressControlNew],
  [CustomFieldType.string, TextControlNew],
  [CustomFieldType.email, EmailControl],
  [CustomFieldType.bool, YesNoRadioControlNew],
  [CustomFieldType.number, NumberControlNew],
  [CustomFieldType.single_selection, RadioNew],
  [CustomFieldType.single_selection_with_justification, RadioWithJustification],
  [CustomFieldType.multiple_selection, CheckboxNew],
  [CustomFieldType.certificate, UploadCertificatesNew],
  [CustomFieldType.money, MoneyControlNew],
  [CustomFieldType.masterdata, DropdownControlNew],
  [CustomFieldType.assessmentSubtype, AssessmentSubTypeControl],
  [CustomFieldType.masterdata_multiselect, DropdownControlNew],
  [CustomFieldType.textArea, TextAreaControlNew],
  [CustomFieldType.richText, RichTextControlNew],
  [CustomFieldType.userid, UserIdControlNew],
  [CustomFieldType.userIdList, UserIdControlNew],
  [CustomFieldType.phone, OROPhoneInputNew],
  [CustomFieldType.itemList, ItemDetailsControlNew],
  [CustomFieldType.item, ItemDetailsControlNew],
  [CustomFieldType.draftLegalDocumentList, DraftLegalDocumentNew],
  [CustomFieldType.signedLegalDocumentList, SignedLegalDocumentNew],
  [CustomFieldType.contacts, ContactControl],
  [CustomFieldType.contact, SingleContactControl],
  [CustomFieldType.assessmentRisk, RiskControl],
  [CustomFieldType.objectSelector, ObjectSelectorControl],
  [CustomFieldType.splitAccounting, SplitAccountingControl],
  [CustomFieldType.url, TextControlNew],
  [CustomFieldType.assessmentExpiration, AssessmentExpirationComponent]
])

// Functions that convert control input to payload type
export const DataMapperFunctionMap = new Map<CustomFieldType, Function>([
  [CustomFieldType.single_selection, mapOptionToChoice],
  [CustomFieldType.single_selection_with_justification, mapOptionWithJustificationToChoice],
  [CustomFieldType.multiple_selection, mapOptionsToChoices],
  [CustomFieldType.masterdata, mapMasterDataOptionToIDRef],
  [CustomFieldType.masterdata_multiselect, mapOptionsToIDRefs],
  [CustomFieldType.phone, mapStringToPhone]
])

// Functions that convert payload value to control input type
export const ValueMapperFunctionMap = new Map<CustomFieldType, Function>([
  [CustomFieldType.single_selection, mapSelectedChoiceToOption],
  [CustomFieldType.single_selection_with_justification, mapChoiceWithJustificationToOption],
  [CustomFieldType.multiple_selection, mapSelectedChoicesToOptions],
  [CustomFieldType.masterdata, mapMasterDataIDRefToOption],
  [CustomFieldType.masterdata_multiselect, mapSitesToOption],
  [CustomFieldType.phone, mapPhoneToString]
])

export const ReadOnlyValMapperFunctionMap = new Map<CustomFieldType, any>([
  [CustomFieldType.single_selection, SingleSelectionValue],
  [CustomFieldType.single_selection_with_justification, SingleSelectionWithJustificationValue],
  [CustomFieldType.multiple_selection, MultipleSelectionValue],
  [CustomFieldType.attachment, AttachmentControl],
  [CustomFieldType.attachments, AttachmentsControl],
  [CustomFieldType.certificate, CertificatesValue],
  [CustomFieldType.document, DocumentControl],
  [CustomFieldType.date, DateValue],
  [CustomFieldType.dateTimeUTC, DateTimeValue],
  [CustomFieldType.assessmentExpiration, AssessmentExpirationValue],
  [CustomFieldType.dateRange, DateRangeValue],
  [CustomFieldType.address, AddressValue],
  [CustomFieldType.addresses, AddressesValue],
  [CustomFieldType.masterdata, MasterdataValue],
  [CustomFieldType.assessmentSubtype, AssessmentSubTypeValue],
  [CustomFieldType.masterdata_multiselect, MultipleMasterdataValue],
  [CustomFieldType.userid, UserIdValue],
  [CustomFieldType.userIdList, UserIdListValue],
  [CustomFieldType.phone, PhoneValue],
  [CustomFieldType.itemList, ItemDetailsControlNew],
  [CustomFieldType.draftLegalDocumentList, LegalDocumentsValueNew],
  [CustomFieldType.signedLegalDocumentList, LegalDocumentsValueNew],
  [CustomFieldType.contacts, ContactsValue],
  [CustomFieldType.contact, SingleContactValue],
  [CustomFieldType.money, MoneyValue],
  [CustomFieldType.assessmentRisk, RiskValue],
  [CustomFieldType.objectSelector, ObjectSelectorControl],
  [CustomFieldType.splitAccounting, SplitAccountingValue],
  [CustomFieldType.url, URLReadOnlyControl],
  [CustomFieldType.item, ItemDetailsControlNew]
])

export const EmailValMapperFunctionMap = new Map<CustomFieldType, any>([
  [CustomFieldType.single_selection_with_justification, SingleSelectionWithJustificationEmailValue],
  [CustomFieldType.attachment, AttachmentEmailValue],
  [CustomFieldType.document, AttachmentEmailValue],
  [CustomFieldType.date, DateValue],
  [CustomFieldType.dateTimeUTC, DateTimeValue],
  [CustomFieldType.assessmentExpiration, AssessmentExpirationComponent],
  [CustomFieldType.dateRange, DateRangeValue],
  [CustomFieldType.address, AddressValue],
  [CustomFieldType.addresses, AddressesValue],
  [CustomFieldType.masterdata, MasterdataValue],
  [CustomFieldType.assessmentSubtype, MasterdataValue],
  [CustomFieldType.masterdata_multiselect, MultipleMasterdataValue],
  [CustomFieldType.userid, UserIdValue],
  [CustomFieldType.userIdList, UserIdListValue],
  [CustomFieldType.phone, PhoneValue],
  [CustomFieldType.draftLegalDocumentList, LegalDocumentsEmailValue],
  [CustomFieldType.signedLegalDocumentList, LegalDocumentsEmailValue],
  [CustomFieldType.itemList, ItemDetailsControlNewEmailValue],
  [CustomFieldType.contacts, ContactsEmailValue],
  [CustomFieldType.contact, SingleContactEmailValue],
  [CustomFieldType.assessmentRisk, RiskValue],
  [CustomFieldType.objectSelector, ObjectEmailValue],
  [CustomFieldType.splitAccounting, SplitAccountingEmailValue],
  [CustomFieldType.item, ItemDetailsControlNewEmailValue]
])

const ValidatorFunctionMap = new Map<CustomFieldType, any>([
  [CustomFieldType.attachment, attachmentValidator],
  [CustomFieldType.attachments, attachmentListValidator],
  [CustomFieldType.date, dateValidator],
  [CustomFieldType.dateTimeUTC, dateTimeValidator],
  [CustomFieldType.assessmentExpiration, assessmentExpirationValidator],
  [CustomFieldType.dateRange, dateRangeValidator],
  [CustomFieldType.address, addressValidator],
  [CustomFieldType.addresses, addressListValidator],
  [CustomFieldType.string, stringValidator],
  [CustomFieldType.bool, booleanValidator],
  [CustomFieldType.number, numberValidator],
  [CustomFieldType.single_selection, singleSelectValidator],
  [CustomFieldType.single_selection_with_justification, singleSelectWithJustificationValidator],
  [CustomFieldType.multiple_selection, multipleSelectValidator],
  [CustomFieldType.certificate, certificatesValidator],
  [CustomFieldType.money, costValidator],
  [CustomFieldType.masterdata, singleSelectValidator],
  [CustomFieldType.assessmentSubtype, assessmentSubtypeValidator],
  [CustomFieldType.masterdata_multiselect, multipleSelectValidator],
  [CustomFieldType.textArea, stringValidator],
  [CustomFieldType.email, emailValidator],
  [CustomFieldType.richText, richTextValidator],
  [CustomFieldType.userid, userValidator],
  [CustomFieldType.userIdList, userListValidator],
  [CustomFieldType.phone, phoneValidator],
  [CustomFieldType.itemList, itemListValidator],
  [CustomFieldType.draftLegalDocumentList, draftLegalDocumentsValidatorNew],
  [CustomFieldType.signedLegalDocumentList, signedLegalDocumentsValidatorNew],
  [CustomFieldType.contacts, contactListValidator],
  [CustomFieldType.contact, contactValidator],
  [CustomFieldType.assessmentRisk, riskValidator],
  [CustomFieldType.objectSelector, objectValidator],
  [CustomFieldType.splitAccounting, splitListValidator],
  [CustomFieldType.formDataList, formDataListValidator],
  [CustomFieldType.url, urlValidator],
  [CustomFieldType.item, itemListValidator]
])

export const EqualityCheckerFunctionMap = new Map<CustomFieldType, any>([
  [CustomFieldType.attachment, objectEqualityChecker],
  [CustomFieldType.attachments, arrayEqualityChecker],
  [CustomFieldType.date, objectEqualityChecker],
  [CustomFieldType.dateTimeUTC, literalEqualityChecker],
  [CustomFieldType.assessmentExpiration, assessmentExpirationEqualityChecker],
  [CustomFieldType.dateRange, objectEqualityChecker],
  [CustomFieldType.address, objectEqualityChecker],
  [CustomFieldType.addresses, arrayEqualityChecker],
  [CustomFieldType.string, literalEqualityChecker],
  [CustomFieldType.bool, literalEqualityChecker],
  [CustomFieldType.number, literalEqualityChecker],
  [CustomFieldType.single_selection, objectEqualityChecker],
  [CustomFieldType.single_selection_with_justification, objectEqualityChecker],
  [CustomFieldType.multiple_selection, arrayEqualityChecker],
  [CustomFieldType.certificate, arrayEqualityChecker],
  [CustomFieldType.money, objectEqualityChecker],
  [CustomFieldType.masterdata, objectEqualityChecker],
  [CustomFieldType.assessmentSubtype, objectEqualityChecker],
  [CustomFieldType.masterdata_multiselect, arrayEqualityChecker],
  [CustomFieldType.textArea, literalEqualityChecker],
  [CustomFieldType.richText, literalEqualityChecker],
  [CustomFieldType.userid, objectEqualityChecker],
  [CustomFieldType.phone, literalEqualityChecker],
  [CustomFieldType.itemList, itemListEqualityChecker],
  [CustomFieldType.assessmentRisk, riskEqualityChecker],
  [CustomFieldType.item, itemListEqualityChecker]
])

export function isFieldTypeInline (fieldType: CustomFieldType, choicesCount?: number) {
  return INLINE_FIELD_TYPES.includes(fieldType) // || (CONDITIONAL_INLINE_FIELD_TYPES.includes(fieldType) && choicesCount && choicesCount <= MAX_INLINE_CHOICES)
}

export function isFieldTwoLine (fieldType: CustomFieldType) {
  return TWOLINE_FIELD_TYPES.includes(fieldType)
}

export function fieldWidth (field: CustomFormField, choicesCount?: number) {
  if ((field.customFieldType === CustomFieldType.multiple_selection || field.customFieldType === CustomFieldType.single_selection || field.customFieldType === CustomFieldType.single_selection_with_justification) && (!field.showRadioBtnControlForChoices && (choicesCount && choicesCount > MAX_INLINE_CHOICES))) {
    return style.col2
  } else {
    return ControlWidthMap.get(field.customFieldType)
  }
}
export function questionWidth (field: CustomFormField, choicesCount?: number) {
  if ((field.customFieldType === CustomFieldType.multiple_selection || field.customFieldType === CustomFieldType.single_selection || field.customFieldType === CustomFieldType.single_selection_with_justification) && (!field.showRadioBtnControlForChoices && (choicesCount && choicesCount > MAX_INLINE_CHOICES))) {
    return queStyle.subcol3
  } else {
    return QuestionWidthMap.get(field.customFieldType)
  }
}

export function isFieldTypeShort (field: CustomFormField, choicesCount?: number) {
  return SHORT_FIELD_TYPES.includes(field.customFieldType) || (CONDITIONAL_SHORT_FIELD_TYPES.includes(field.customFieldType) && (!field.showRadioBtnControlForChoices && (choicesCount && choicesCount > MAX_INLINE_CHOICES)))
}

export function isFieldTypeAutoScrollable (fieldType: CustomFieldType) {
  return AUTO_SCROLLABLE_FIELD_TYPES.includes(fieldType)
}

export function fieldBlock (fieldType: CustomFieldType, props: Object, choicesCount?: number) {
  let fieldComponentDefinition
  if (fieldType === CustomFieldType.single_selection) {
    fieldComponentDefinition = (choicesCount && choicesCount <= MAX_INLINE_CHOICES) ? Radio : DropdownControlNew
  }
  else if (fieldType === CustomFieldType.multiple_selection) {
    fieldComponentDefinition = (choicesCount && choicesCount <= MAX_INLINE_CHOICES) ? CheckboxControl : DropdownControlNew
  } else {
    fieldComponentDefinition = ControlTypeMap.get(fieldType)
  }

  if (fieldComponentDefinition) {
    return React.createElement(fieldComponentDefinition, props)
  }

  return React.createElement(
    'span',
    props,
    `'${fieldType}' field type not supported yet.`
  )
}

export function fieldControl (field: CustomFormField, props: Object, choicesCount?: number) {
  let fieldComponentDefinition

  if ((field.customFieldType === CustomFieldType.multiple_selection || field.customFieldType === CustomFieldType.single_selection || field.customFieldType === CustomFieldType.single_selection_with_justification) &&
  (!field.showRadioBtnControlForChoices && (choicesCount && choicesCount > MAX_INLINE_CHOICES))) {
    fieldComponentDefinition = DropdownControlNew
  } else if (field.customFieldType === CustomFieldType.instruction && field?.documents?.length > 0) {
    fieldComponentDefinition = InstructionImageControl
  } else {
    fieldComponentDefinition = ControlTypeMapNew.get(field.customFieldType)
  }

  if (fieldComponentDefinition) {
    return React.createElement(fieldComponentDefinition, props)
  }

  return React.createElement(
    'span',
    props,
    `'${field.customFieldType}' field type not supported yet.`
  )
}

export function getMappedDataByType (value?: any, fieldType?: CustomFieldType) {
  if (fieldType && (value !== undefined && value !== null)) {
    const mapperFunction = DataMapperFunctionMap.get(fieldType)

    if (mapperFunction) {
      return mapperFunction(value)
    }

    return value
  }

  return value
}

export function getMappedValueByType (fieldType?: CustomFieldType, formData?: CustomFormData, field?: CustomFormField, index?: number, localChoices?: LocalChoices) {
  let value
  if (field?.customFieldType === CustomFieldType.document) {
    value = field?.documents?.[0]?.document
  } else if ((field?.customFieldType === CustomFieldType.attachments) && index) {
    value = formData?.[field.fieldName]?.[index]
  } else if ((field?.customFieldType === CustomFieldType.certificate) && index) {
    value = formData?.[field.fieldName]?.[index].attachment
  } else {
    value = formData?.[field.fieldName]
  }
  if (fieldType && (value !== undefined && value !== null)) {
    const mapperFunction = ValueMapperFunctionMap.get(fieldType)
    if (mapperFunction) {
      return mapperFunction(value, localChoices)
    }
    return value
  }

  return value
}

export function getControlValueByType (value?: CustomFieldValue, field?: CustomFormField) {
  if (field?.customFieldType === CustomFieldType.document) {
    return field?.documents?.[0]?.document
  }

  if (field?.customFieldType && (value !== undefined && value !== null)) {
    const mapperFunction = ValueMapperFunctionMap.get(field.customFieldType)
    if (mapperFunction) {
      return mapperFunction(value)
    }
    return value
  }

  return value
}

export function getReadOnlyElementByType (props: any, fieldType?: CustomFieldType, canShowTranslation?: boolean, isInstructionWithImage?: boolean) {
  let readOnlyElem = React.createElement(
    'span',
    { value: props.value },
    '-'
  )
  if (fieldType && ((props.value !== undefined && props.value !== null) || (fieldType === CustomFieldType.url && props.config?.linkButtonConfig?.isButton && props.config?.linkButtonConfig?.href))) {
    const fieldComponentDefinition = ReadOnlyValMapperFunctionMap.get(fieldType)

    if (fieldComponentDefinition) {
      readOnlyElem = React.createElement(fieldComponentDefinition, {...props, canShowTranslation })
    } else if (isInstructionWithImage) {
      readOnlyElem = React.createElement(InstructionImageControl, props)
    } else {
      readOnlyElem = React.createElement(mapCustomFieldValue, {...props, fieldType, canShowTranslation})
    }
  }

  return readOnlyElem
}

export function getEmailElementByType (value?: any, field?: CustomFormField, labelPrefix?: string, getPO?: (id: string) => Promise<PurchaseOrder>) {
  let readOnlyElem = React.createElement(
    'span',
    { value },
    '-'
  )

  if (field?.customFieldType && (value !== undefined && value !== null)) {
    const fieldComponentDefinition = EmailValMapperFunctionMap.get(field.customFieldType)

    if (fieldComponentDefinition) {
      readOnlyElem = React.createElement(fieldComponentDefinition, { value, labelPrefix, field, getPO })
    } else {
      readOnlyElem = React.createElement(mapCustomFieldValue, { value })
    }
  }

  return readOnlyElem
}

export function getTextValueByType (value?: any, fieldType?: CustomFieldType) {
  if (fieldType && (value !== undefined && value !== null)) {
    const fieldComponentDefinition = ReadOnlyValMapperFunctionMap.get(fieldType)

    if (fieldComponentDefinition) {
      return fieldComponentDefinition({ value })
    }

    return '-'
  }

  return '-'
}

export function deleteInvisibleFieldValues (
    formData: CustomFormData,
    formDefinition: CustomFormDefinition,
    manualTrigger?: boolean
  ): CustomFormData {
  const formDataCopy = { ...formData }

  // Delete all the field values which are not visible; do this in loop to handle condition chain
  // Assuming there won't be circular conditions, the condition chain can be max 'fieldCount' levels deep
  // We can limit the loop only that may times
  const fieldCount = formDefinition.model.fields.length
  let loopCount = 1

  while (loopCount < fieldCount) {
    let fieldValueDeleted: boolean = false

    formDefinition.view.sections.forEach(section => {
      const isSectionVisible = section.visible? isCustomFieldVisible(section.visible, formDataCopy) : true

      section.grids.forEach(grid => {
        grid.fields.forEach(field => {
          const isFieldVisible = field.field.visible ? isCustomFieldVisible(field.field.visible, formDataCopy) : true

          // If a section is invisible, or if field is invisibile, and if it has a valid value, delete its value
          const isFieldHidden = !isSectionVisible || !isFieldVisible
          const hasFieldValue = formDataCopy[field.field.fieldName] !== undefined
          if (isFieldHidden && hasFieldValue) {
            if (manualTrigger && field.field.clearOnHide) {
              // set null if field is hidden by user interaction
              // this will prompt back-end to clear its value in mapped global variable
              formDataCopy[field.field.fieldName] = null
            } else {
              // otherwise remove it from payload
              // this will prompt back-end to ignore it
              delete formDataCopy[field.field.fieldName]
            }
            fieldValueDeleted = true
          }
        })
      })
    })

    // If no field value deleted in current loop,
    // it means the dependency chain has ended; we can exit the loop
    if (!fieldValueDeleted) {
      break
    }

    loopCount++
  }

  return formDataCopy
}

// Excutes js expression in customFieldCondition.jsScript
// Needs formData to be present in 'form' in current context/scope (hence the 2nd parameter)
export function isCustomFieldVisible (customFieldCondition: CustomFieldCondition, form: CustomFormData): boolean {
  if (customFieldCondition?.jsScript && form) {
    try {
      // eslint-disable-next-line no-eval
      return !!(eval(customFieldCondition.jsScript))
    } catch (err) {
      console.log(err)
      return true
    }
  }

  return true
}

export function extractFieldViewsFromFormDefinition (formDefinition: CustomFormDefinition): Array<CustomFormField> {
  const fields: Array<CustomFormField> = []
  formDefinition.view.sections.forEach((section: Section) =>
    section.grids.forEach((grid: Grid) =>
      grid.fields.forEach((field: CustomFieldView) => fields.push(field.field))
    )
  )

  return fields
}

export function findFieldById (id: number, fields: Array<CustomFormField>): CustomFormField {
  return fields.find(field => field.id === id)
}

export function validator (
  value: { fieldValue: CustomFieldValue, signedDocuments?: Array<Document>, draftDocuments?: Array<Document>, finalisedDocuments?: Array<Document> },
  fieldType: CustomFieldType,
  field: CustomFormField,
  useItemListV2: boolean,
  extensionFormConfig?: {
    definitionsForExtensionCustomForms: {[formId: string]: CustomFormDefinition},
    options: FieldOptions,
    areOptionsAvailableForMasterDataField: {[fieldName: string]: boolean},
    localLabels?: LocalLabels
    lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  }
): boolean {
  const validatorFunction = ValidatorFunctionMap.get(fieldType)

  if (fieldType === CustomFieldType.string) {
    return validatorFunction ? validatorFunction(value.fieldValue, { stringRegex: field?.stringRegex }) : false
  }
  if (fieldType === CustomFieldType.draftLegalDocumentList) {
    return validatorFunction ? validatorFunction(value.draftDocuments, { optional: field.optional }) : false
  }
  if (fieldType === CustomFieldType.signedLegalDocumentList) {
    return validatorFunction ? validatorFunction({ ...value, signatureStatus: SignatureStatus.signed }, { optional: field.optional }) : false
  }
  if (fieldType === CustomFieldType.contacts || fieldType === CustomFieldType.contact) {
    return validatorFunction ? validatorFunction(value.fieldValue, { contactConfig: field?.contactConfig }) : false
  }
  if (fieldType === CustomFieldType.itemList || fieldType === CustomFieldType.item) {
    if (!validatorFunction) {
      return false
    }
    if (useItemListV2) {
      const _validatorV2 = itemListValidatorV2 as any
      const result = _validatorV2(value.fieldValue, {
        itemListConfig: field?.itemListConfig,
        formDefinition: extensionFormConfig?.definitionsForExtensionCustomForms?.[field?.itemListConfig?.questionnaireId?.formId],
        fieldName: field?.fieldName,
        options: extensionFormConfig?.options,
        areOptionsAvailableForMasterDataField: extensionFormConfig?.areOptionsAvailableForMasterDataField,
        localLabels: extensionFormConfig?.localLabels,
        totalMoneyConfig: undefined,
        isNested: undefined,
        lineItemExtensionFormFetchData: extensionFormConfig.lineItemExtensionFormFetchData
      })
      return result?.hasError || false
    }
    return validatorFunction(value.fieldValue, {
      itemListConfig: field?.itemListConfig,
      formDefinition: extensionFormConfig?.definitionsForExtensionCustomForms?.[field?.itemListConfig?.questionnaireId?.formId],
      options: extensionFormConfig?.options,
      areOptionsAvailableForMasterDataField: extensionFormConfig?.areOptionsAvailableForMasterDataField,
      localLabels: extensionFormConfig?.localLabels
    })
  }
  if (fieldType === CustomFieldType.number) {
    return validatorFunction ? validatorFunction(value.fieldValue, { numberConfig: field?.numberConfig }) : false
  }
  if (fieldType === CustomFieldType.objectSelector) {
    return validatorFunction ? validatorFunction(value.fieldValue, { objectConfig: field?.objectSelectorConfig }) : false
  }
  if (fieldType === CustomFieldType.splitAccounting) {
    return validatorFunction ? validatorFunction(value.fieldValue, { splitConfig: field?.splitAccountingConfig }) : false
  }
  if (fieldType === CustomFieldType.formDataList) {
    return validatorFunction ? validatorFunction(value.fieldValue, {
      formDataConfig: field?.formDataConfig,
      formDefinition: extensionFormConfig?.definitionsForExtensionCustomForms?.[field?.formDataConfig?.questionnaireId?.formId],
      areOptionsAvailableForMasterDataField: extensionFormConfig?.areOptionsAvailableForMasterDataField,
      options: extensionFormConfig?.options,
      localLabels: extensionFormConfig?.localLabels
    }) : false
  }
  if (fieldType === CustomFieldType.addresses || fieldType === CustomFieldType.attachments || fieldType === CustomFieldType.certificate) {
    return validatorFunction ? validatorFunction(value.fieldValue, { multiConfig: field?.multiConfig }) : false
  }
  return validatorFunction ? validatorFunction(value.fieldValue, {}) : false
}

export function areValuesSame (fieldType: CustomFieldType, oldValue: CustomFieldValue, newValue: CustomFieldValue): boolean {
  const equalityCheckerFunction = EqualityCheckerFunctionMap.get(fieldType)
  return equalityCheckerFunction ? equalityCheckerFunction(oldValue, newValue) : false
}

export function getValidFieldName(fieldName: string, fieldID: number): string {
  // Questions with long text appending q+fieldID+_ to fieldName, so, removing that (q+fieldID+_) from fieldName   to get proper fieldName.
  return fieldName ? fieldName.replace(`'q'+${fieldID}+'_'`,'') : fieldName
}

export function generateTemporaryIdForLegalDocument (): string {
  return DEFAULT_LEGAL_DOCUMENT_ID_PREFIX + Math.floor(Math.random() * 10000)
}
