import { IDRef, mapAttachment, mapIDRef, mapQuestionnaireId, ObjectValue, Option, PurchaseOrder } from './../../Types'
import { ChoiceModel, ChoiceView, ConditionConfiguration, CustomFieldCondition, CustomFormField, CustomCertificate, CustomFormFieldReference, CustomFormModel, CustomDocument, MasterDataConfiguration, MultiConfig, Layout, ItemListConfig, ItemDetailsFields, DefaultValue, ContactConfig, NumberConfig, MasterDataFilter, ObjectSelectorConfig, ObjectType, MatchRule, SplitAccountingConfig, SplitType, DateConfig, FormDataConfig, LinkButtonConfig, AssessmentSubtypeConfig } from "../types/CustomFormModel"
import { CustomFieldView, CustomFormView, Grid, Section } from '../types/CustomFormView'
import { CustomFormDefinition, CustomFormType, ValidationApi } from '../types/CustomFormDefinition'
import { getDafaultMultiConfig, getDefaultContactConfig, getDefaultItemListConfig, getDefaultObjectSelectorConfig, getDefaultSplitAccountingConfig } from '../../Form/util'
import { LocalChoices } from '../types/localization'
import { mapAssignment } from '../../Tasks/types'
import { ContractDetail, ValueWithJustification } from '../../Types/common'
import { OptionWithJustification } from '../../Form/types'

export function mapOptionToChoice (option: Option): string {
  return option.path
}

export function mapOptionWithJustificationToChoice (value: OptionWithJustification): ValueWithJustification {
  return {
    stringValue: value?.option?.path,
    justification: value?.justification
  }
}

export function mapOptionsToChoices (options?: Option[]): string[] {
  let choices: string[] = []

  if (Array.isArray(options)) {
    choices = options.map(mapOptionToChoice)
  }

  return choices
}

export function mapSelectedChoiceToOption (choice: string, localChoices?: LocalChoices): Option {
  return {
    id: choice,
    path: choice,
    displayName: localChoices?.[choice] || choice,
    selectable: true
  }
}

export function mapChoiceWithJustificationToOption (choice: ValueWithJustification, localChoices?: LocalChoices): OptionWithJustification {
  return {
    option: choice.stringValue
      ? {
          id: choice.stringValue,
          path: choice.stringValue,
          displayName: localChoices?.[choice.stringValue] || choice.stringValue,
          selectable: true
        }
      : undefined,
    justification: choice?.justification
  }
}

export function mapSelectedChoicesToOptions (choices?: string[], localChoices?: LocalChoices): Option[] {
  let options: Option[] = []

  if (Array.isArray(choices)) {
    options = choices.map(choice => mapSelectedChoiceToOption(choice, localChoices))
  }

  return options
}

export function mapChoiceToOption (choice: ChoiceModel, localDisplayName?: string): Option {
  return {
    id: choice?.value,
    path: choice?.value,
    displayName: localDisplayName || choice?.value,
    selectable: true
  }
}

export function mapChoicesToOptions (choices?: ChoiceModel[], localChoices?: LocalChoices): Option[] {
  let options: Option[] = []

  if (Array.isArray(choices)) {
    options = choices.map(choice => mapChoiceToOption(choice, localChoices?.[choice?.value]))
  }

  return options
}

function mapChoice (data: any): ChoiceModel {
  return {
    value: data?.value || ''
  }
}

function mapChoices (data: any): ChoiceView {
  const choices = data?.choices?.length > 0 ? data?.choices.map(mapChoice) : []
  const defaultValues = data?.defaultValues?.length > 0 ? data?.defaultValues.map(mapChoice) : []
  return {
    defaultValue: data?.defaultValue ? mapChoice(data?.defaultValue) : null,
    choices,
    defaultValues
  }
}

function mapCertificate (data: any): CustomCertificate{
  return {
    allowOtherCertificateName: data?.allowOtherCertificateName || false,
    expiryDateRequired: data?.expiryDateRequired || false,
    issueDateRequired: data?.issueDateRequired || false,
    validCertificateNames: data?.validCertificateNames ? data?.validCertificateNames : [],
    issueDateLeadTime: data?.issueDateLeadTime || undefined,
    expiryDateLeadTime: data?.expiryDateLeadTime || undefined,
    allowOthers: data?.allowOthers || false
  }
}

function mapPoToIDRef (po?: PurchaseOrder): IDRef {
  return {
    id: po?.id || po?.poNumber,
    name: po?.poNumber,
    erpId: po?.normalizedVendorRef?.name || po?.normalizedVendorRef?.selectedVendorRecord?.name
  }
}
function mapContractToIDRef (contract?: ContractDetail): IDRef {
  return {
    id: contract?.id || contract?.contractId,
    name: contract?.contractId,
    erpId: contract?.normalizedVendor?.name || contract?.normalizedVendor?.selectedVendorRecord?.name
  }
}
export function mapObjectToIDRef (value: ObjectValue, type: ObjectType): IDRef | undefined {
  if (!value) {
    return undefined
  }

  switch (type) {
    case ObjectType.po:
      return mapPoToIDRef(value)
    case ObjectType.contract:
      return mapContractToIDRef(value as ContractDetail)
  }
}

function mapCustomFormFieldReference (data: any): CustomFormFieldReference {
  return {
    id: data?.data || '',
    name: data?.name || '',
    fieldName: data?.fieldName || ''
  }
}

function mapCustomFieldCondition (data: any): ConditionConfiguration {
  return {
    field: mapCustomFormFieldReference(data?.field),
    value: data?.value,
    operator: data?.operator
  }
}

function mapVisible (data: any): CustomFieldCondition {
  return {
    conditionType: data?.conditionType,
    customFieldConditions: Array.isArray(data?.customFieldConditions) ? data.customFieldConditions.map(mapCustomFieldCondition) : null,
    jsScript: data?.jsScript
  }
}

function mapMasterDataFilter (data: any): MasterDataFilter {
  return {
    field: mapCustomFormFieldReference(data?.field),
    masterdataField: data?.masterdataField || ''
  }
}

function mapMasterDataConfig (data: any): MasterDataConfiguration {
  return {
    codePath: data?.codePath|| '',
    tag: Array.isArray(data?.tag) ? data.tag : [],
    maxLevel: data?.maxLevel || 0,
    minLevel: data?.minLevel || 0,
    filters: Array.isArray(data?.filters) ? data.filters.map(mapMasterDataFilter) : [],
    leafOnly: data?.leafOnly || false,
    showNameWithCode: data?.showNameWithCode || false,
    sortByCode: data?.sortByCode || false,
    matchRule: data?.matchRule ? MatchRule[data.matchRule] : undefined,
    showFlatList: data?.showFlatList || false
  }
}

function mapLinkButtonConfig (data?: any): LinkButtonConfig {
  return {
    href: data?.href || '',
    isButton: data?.isButton || false,
    isPrimary: data?.isPrimary || false
  }
}

function mapMultiConfig (data: any): MultiConfig {
  return {
    minCount: data?.minCount|| 1,
    labelPrefix: data?.labelPrefix || 'Address',
    isButton: data?.isButton || false
  }
}

function mapItemListConfig (data: any) : ItemListConfig {
  return {
    visibleFields: data?.visibleFields || [ItemDetailsFields.name],
    mandatoryFields: data?.mandatoryFields || [ItemDetailsFields.name],
    readonlyFields: data?.readonlyFields || [],
    listItemPrefix: data?.listItemPrefix || undefined,
    minimumSize: data?.minimumSize || 1,
    maximumSize: data?.maximumSize || undefined,
    displayFields: data?.displayFields || [],
    enableAccountCodeFilter: data?.enableAccountCodeFilter || undefined,
    questionnaireId: data?.questionnaireId ? mapQuestionnaireId(data?.questionnaireId) : undefined,
    enableAddSubItems: data?.enableAddSubItems || false,
    enableComparison: data?.enableComparison || false,
    disableAdd: data?.disableAdd || false,
    disableDelete: data?.disableDelete || false
  }
}

function mapContactConfig (data: any): ContactConfig {
  return {
    visibleFields: data?.visibleFields || [],
    mandatoryFields: data?.mandatoryFields || [],
    readonlyFields: data?.readonlyFields || [],
    disableAdd: data?.disableAdd || false,
    disableDelete: data?.disableDelete || false,
    listItemPrefix: data?.listItemPrefix || '',
    miniumSize: data?.miniumSize || 1,
    minOwnershipPercentage: data?.minOwnershipPercentage || undefined
  }
}

function mapObjectSelectorConfig (data?: any): ObjectSelectorConfig {
  return {
    type: data?.type || undefined,
    includeCompleted: data?.includeCompleted || undefined
  }
}

function mapSplitAccountingConfig (data?: any): SplitAccountingConfig {
  return {
    masterdataType: data?.masterdataType || undefined,
    type: data?.type || SplitType.percentage
  }
}

function mapDateConfig (data?: any): DateConfig {
    return {
      leadTime: data?.leadTime,
      issueDateLeadTime: data?.issueDateLeadTime,
      duration: data?.duration,
      allowBypassing: data?.allowBypassing
    }
  }

function mapFormDataConfig (data?: any): FormDataConfig {
  return {
    questionnaireId: data?.questionnaireId ? mapQuestionnaireId(data?.questionnaireId) : null,
    canAdd: data?.canAdd || false,
    canRemove: data?.canRemove || false
  }
}

function mapCustomDocument (data: any): CustomDocument {
  return {
    lang: data?.lang || '',
    copied: data?.copied || false,
    document: data?.document ? mapAttachment(data.document) : null,
    version: data?.version || ''
  }
}

function mapFieldDefaultValue (data: any): DefaultValue {
  return {
    idRefVal: mapIDRef(data?.idRefVal) || undefined,
    booleanVal: data?.booleanVal
  }
}

export function mapNumberConfig (data: any): NumberConfig {
  return {
    min: data?.min || 0,
    max: data?.max || 0
  }
}

export function mapAssessmentSubTypeConfig (data: any): AssessmentSubtypeConfig {
  return {
    assessment: data?.assessment || ''
  }
}

function mapCustomFormField (data: any): CustomFormField {
  return {
    description: data?.description || '',
    helpText: data?.helpText || '',
    displayIndex: data?.displayIndex || '',
    level: data?.level || 0,
    fieldName: data?.fieldName || '',
    fieldDefaultValue: mapFieldDefaultValue(data?.fieldDefaultValue) || null,
    id: data?.id || '',
    name: data?.name || '',
    type: data?.type,
    visible: data?.visible ? mapVisible(data.visible) : null,
    required: null,
    customFieldType: data?.customFieldType,
    choices: data?.choices ? mapChoices(data.choices) : null,
    certificateConfig: data?.certificateConfig ? mapCertificate(data.certificateConfig) : null,
    documents: data?.documents ? data.documents.map(mapCustomDocument) : [],
    optional: data?.optional ? data.optional : false,
    isReadOnly: data?.isReadOnly ? data.isReadOnly : false,
    isHidden: data?.isHidden ? data.isHidden : false,
    hiddenForReadOnly: data?.hiddenForReadOnly ? data.hiddenForReadOnly : false,
    clearOnHide: data?.clearOnHide ? data.clearOnHide : false,
    masterDataType: data?.masterDataType ? data.masterDataType : '',
    masterdataConfig: data?.masterdataConfig ? mapMasterDataConfig(data.masterdataConfig) : null,
    displayDocument: data?.displayDocument ? data.displayDocument : false,
    multiConfig: data?.multiConfig ? mapMultiConfig(data.multiConfig) : getDafaultMultiConfig(),
    itemListConfig: data?.itemListConfig ? mapItemListConfig(data.itemListConfig) : getDefaultItemListConfig(),
    contactConfig: data?.contactConfig ? mapContactConfig(data.contactConfig) : getDefaultContactConfig(),
    showRadioBtnControlForChoices: data?.showRadioBtnControlForChoices || false,
    displayInTenantCurrency: data?.displayInTenantCurrency || false,
    numberConfig: data?.numberConfig ? mapNumberConfig(data?.numberConfig) : null,
    userListingConfig: data?.userListingConfig ? mapAssignment(data?.userListingConfig) : null,
    stringRegex: data?.stringRegex || '',
    placeHolderText: data?.placeHolderText || '',
    objectSelectorConfig: data?.objectSelectorConfig ? mapObjectSelectorConfig(data.objectSelectorConfig) : getDefaultObjectSelectorConfig(),
    submitOnChange: data?.submitOnChange || false,
    splitAccountingConfig: data?.splitAccountingConfig ? mapSplitAccountingConfig(data.splitAccountingConfig) : getDefaultSplitAccountingConfig(),
    dateConfig: data?.dateConfig ? mapDateConfig(data.dateConfig) : null,
    formDataConfig: data?.formDataConfig ? mapFormDataConfig(data?.formDataConfig) : null,
    linkButtonConfig: data?.linkButtonConfig ? mapLinkButtonConfig(data.linkButtonConfig) : null,
    fileTypes: Array.isArray(data?.fileTypes) ? data?.fileTypes : null,
    assessmentSubtypeConfig: mapAssessmentSubTypeConfig(data?.assessmentSubtypeConfig) || null
  }
}

function mapCustomFieldView (data: any): CustomFieldView {
  return {
    id: data?.id || '',
    size: data?.size || 12,
    field: mapCustomFormField(data?.field)
  }
}

function mapGrid (data: any): Grid {
  const fields = data?.fields?.length > 0 ? data.fields.map(mapCustomFieldView) : []
  return {
    displayIndex: data?.displayIndex || '',
    id: data?.id || '',
    fields
  }
}

function mapCustomFormSection (data: any): Section {
  const grids = data?.grids?.length > 0 ? data.grids.map(mapGrid) : []
  return {
    displayIndex: data?.displayIndex || '',
    id: data?.id || '',
    title: data?.title || '',
    grids,
    visible: data?.visible || null,
    layout: data?.layout || Layout.twoColumn,
    description: data?.description || ''
  }
}

function mapModel (data: any): CustomFormModel {
  const fields = data?.fields?.length > 0 ? data?.fields.map(mapCustomFormField) : []
  return {
    fields
  }
}

function mapView (data: any): CustomFormView {
  const sections = data.sections?.length > 0 ? data.sections.map(mapCustomFormSection) : []
  return {
    sections
  }
}

function mapValidationApi (data: any): ValidationApi {
  return {
    apiType: data?.apiType || '',
    recipeName: data?.recipeName || '',
    message: data?.message || '',
    autoClose: data?.autoClose || false
  }
}

export function mapCustomFormDefinition (data: any): CustomFormDefinition {
  // let _visibility: Option[] = []
  // await mapConditionsToOptions(data?.visibility)
  //   .then(resp => { _visibility = resp })
  //   .catch(err => console.log(err))

  return {
    description: data?.description || '',
    formType: data?.formType || CustomFormType.onboarding,
    name: data?.name || '',
    status: data?.status || '',
    tenantId: data?.tenantId || '',
    title: data?.title || '',
    // acl: data?.acl ? mapAcl(data?.acl) : null,
    // creator: data?.creator ? mapUser(data?.creator) : null,
    // visibility: _visibility,
    model: mapModel(data?.model),
    view: mapView(data?.view),
    validationApis: data?.validationApis ? data?.validationApis?.map(mapValidationApi) : []
  }
}

export function mapFilterFieldValues (value: Option | Option [] | string): string[] {
  if (typeof value === 'string') {
    return [value as string]
  }
  if (Array.isArray(value)) {
    return value.map(val => val.id) as string[]
  }
  if (value?.id) {
    return [value.id as string]
  }
}
