import { Assignment, Cost } from '../..';
import type { Attachment, IDRef, Money, QuestionnaireId } from '../../Types'

/* eslint-disable */
export enum FormTypeEnum {
  decimal = 'decimal',
  email = 'email',
  time = 'time',
  dateTimeUTC = 'dateTimeUTC',
  date = 'date',
  money = 'money',
  uri = 'uri',
  bool = 'bool',
  array = 'array',
  attachs = 'attachs',
  attachments = 'attachments',
  string = 'string',
  address = 'address',
  addresses = 'addresses',
  object = 'object',
  masterData= 'masterdata',
}


export enum CustomFieldType {
  bool = 'bool',
  string = 'string',
  email = 'email',
  attachment = 'attachment',
  attachments = 'attachments',
  document = 'document',
  certificate = 'certificates',
  number = 'number',
  single_selection = 'single_selection',
  single_selection_with_justification = 'singleSelectionWithJustification',
  multiple_selection = 'multiple_selection',
  multiple_choice = 'multiple_choice',
  date = 'date',
  dateTimeUTC = 'dateTimeUTC',
  dateRange = 'dateRange',
  money = 'money',
  masterdata = "masterdata",
  masterdata_multiselect = 'masterdata_multiselect',
  instruction = 'instruction',
  address = 'address',
  addresses = 'addresses',
  textArea = 'textArea',
  richText = 'richText',
  userid = 'userid',
  phone = 'phone',
  itemList= 'itemList',
  userIdList= 'userIdList',
  signedLegalDocumentList = 'signedLegalDocumentList',
  draftLegalDocumentList = 'draftLegalDocumentList',
  contacts = 'contacts',
  contact = 'contact',
  assessmentRisk = 'assessmentRisk',
  trackedAttributes = 'trackedAttributes',
  objectSelector = 'objectSelector',
  splitAccounting = 'splitAccounting',
  formDataList = 'formDataList',
  url = 'url',
  errorInstruction = 'errorInstruction',
  item= 'item',
  assessmentSubtype = 'assessmentSubtype',
  assessmentExpiration = 'assessmentExpiration'
}

export enum ItemDetailsFields {
  name = 'name',
  categories = 'categories',
  price = 'price',
  quantity = 'quantity',
  totalPrice = 'totalPrice',
  description = 'description',
  number = 'number',
  itemIds = 'itemIds',
  erpItemId = 'erpItemId',
  type = 'type',
  materialId = 'materialId',
  unitForQuantity = 'unitForQuantity',
  images = 'images',
  supplierPartId = 'supplierPartId',
  manufacturerPartId = 'manufacturerPartId',
  accountCode = 'accountCode',
  url = 'url',
  specifications = 'specifications',
  customAttributes = 'customAttributes',
  startDate = 'startDate',
  endDate = 'endDate',
  tax = 'tax',
  qtyReceived = 'qtyReceived',
  invoicedQty = 'invoicedQty',
  vendor = 'vendor',
  departments = 'departments',
  lineOfBusiness = 'lineOfBusiness',
  trackCode = 'trackCode',
  location = 'location',
  projectCode = 'projectCode',
  expenseCategory = 'expenseCategory',
  costCenter = 'costCenter'
  // nonInventoryPurchaseItem = 'nonInventoryPurchaseItem'
}

export enum ContactFields {
  fullName = 'Name',
  title = 'Title',
  email = 'Email',
  phone = 'Phone',
  url = 'Url',
  address = 'Address',
  note = 'Note',
  attachments = 'Attachment',
  role = 'Role',
  rate = 'Rate',
  uom = 'Unit',
  startDate = 'Start Date',
  endDate = 'End Date',
  backgroundCheck = 'Requires Background check',
  percentageOfShare = 'Percentage of ownership / shares in %',
  country = 'Country',
  service = 'service',
  countryOfOperation = 'Country of Operation'
}

export enum ConditionType {
  response = 'response'
}

export enum ConditionOperatorType {
  equal = 'equal'
}

export enum Layout {
  singleColumn = 'singleColumn',
  twoColumn = 'twoColumn'
}

export interface CustomFormFieldReference {
  id: string
  name: string
  fieldName: string
}

export interface ConditionConfiguration {
  field: CustomFormFieldReference
  value: string
  operator: ConditionOperatorType
}

export interface CustomFieldCondition {
  conditionType: ConditionType
  customFieldConditions: Array<ConditionConfiguration> | null
  jsScript?: string
  val?: boolean
}

export interface ChoiceModel {
  value: string
}

export interface ChoiceView {
  choices: Array<ChoiceModel>
  defaultValue: ChoiceModel | null
  defaultValues: Array<ChoiceModel>
}

export interface DefaultValue{
  idRefVal: IDRef ;
  booleanVal?: boolean;
 }

export interface MasterDataConfiguration {
  minLevel: number
  maxLevel: number
  tag: string[]
  codePath: string
  filters?: MasterDataFilter[]
  leafOnly: boolean
  showNameWithCode: boolean
  sortByCode?: boolean
  otherFields?: Map<string, string[]>
  matchRule?: MatchRule,
  showFlatList?: boolean
}

export enum MatchRule {
  hiearchy = 'hiearchy',
  exact = 'exact'
}

export interface MasterDataFilter {
  field: CustomFormFieldReference
  masterdataField: string
}

export interface CustomDocument {
  lang: string
  copied: boolean
  document: Attachment | null
  version: string
}

export interface CustomCertificate {
  expiryDateRequired?: boolean
  issueDateRequired?: boolean
  validCertificateNames: Array<IDRef>
  allowOtherCertificateName?: boolean
  issueDateLeadTime?: number
  expiryDateLeadTime?: number
  allowOthers?: boolean
}
export interface MultiConfig {
  minCount?: number
  labelPrefix: string
  isButton: boolean
}

export interface ItemListConfig {
  visibleFields?: Array<ItemDetailsFields>
  mandatoryFields?: Array<ItemDetailsFields>
  readonlyFields?: Array<ItemDetailsFields>
  displayFields?: Array<ItemDetailsFields>
  disableAdd?: boolean
  disableDelete?: boolean,
  listItemPrefix?: string,
  minimumSize?: number,
  maximumSize?: number,
  enableAccountCodeFilter?: boolean
  questionnaireId?: QuestionnaireId
  enableAddSubItems?: boolean
  enableComparison?: boolean
}

export interface LinkButtonConfig {
  href: string
  isButton: boolean
  isPrimary: boolean
}

export interface ContactConfig {
  visibleFields?: Array<ContactFields>
  mandatoryFields: Array<ContactFields>
  readonlyFields?: Array<ContactFields>
  disableAdd?: boolean
  disableDelete?: boolean
  listItemPrefix: string
  miniumSize: number
  minOwnershipPercentage?: number
}

export interface NumberConfig {
  min: number
  max: number
}

export enum ObjectType {
  po = 'po',
  contract = 'contract'
}

export interface ObjectSelectorConfig {
  type: ObjectType
  includeCompleted?: boolean
}

export enum SplitType {
  percentage = 'percentage',
  amount = 'amount'
}

export interface SplitAccountingConfig {
  masterdataType: string
  type: SplitType
}

export interface DateConfig {
  leadTime?: number
  issueDateLeadTime?: number
  duration?: number
  allowBypassing?: boolean
}

export interface FormDataConfig {
  questionnaireId: QuestionnaireId | null
  canAdd: boolean
  canRemove: boolean
}

export interface AssessmentSubtypeConfig {
  assessment: string
}

export interface CustomFormField {
  id: number
  name: string
  description: string
  helpText: string
  fieldName: string
  type: FormTypeEnum
  fieldDefaultValue: DefaultValue
  customFieldType: CustomFieldType
  displayIndex: string
  level: number
  visible: CustomFieldCondition | null
  required: CustomFieldCondition | null
  documents: Array<CustomDocument>
  choices: ChoiceView | null
  optional: boolean
  isReadOnly: boolean
  isHidden: boolean
  hiddenForReadOnly: boolean
  clearOnHide: boolean
  masterDataType: string
  masterdataConfig: MasterDataConfiguration
  certificateConfig?: CustomCertificate
  multiConfig?: MultiConfig
  validCertificateNames?: Array<string>
  displayDocument: boolean
  itemListConfig?: ItemListConfig
  contactConfig: ContactConfig
  showRadioBtnControlForChoices?: boolean
  displayInTenantCurrency?: boolean
  numberConfig: NumberConfig | null
  userListingConfig: Assignment | null
  stringRegex: string
  placeHolderText: string
  objectSelectorConfig: ObjectSelectorConfig
  submitOnChange: boolean
  splitAccountingConfig: SplitAccountingConfig
  dateConfig: DateConfig | null
  formDataConfig: FormDataConfig | null
  linkButtonConfig: LinkButtonConfig | null
  fileTypes: Array<string> | null
  assessmentSubtypeConfig: AssessmentSubtypeConfig
}

export interface CustomFormModel {
  fields: Array<CustomFormField>
}

export type CustomFieldValueType = boolean | number | bigint | string | null | undefined | Object | Cost |
Array<boolean | number | bigint | string | null | undefined | Object>

export interface CustomFormFieldValue extends CustomFormField {
  value: CustomFieldValueType
  isDirty: boolean
  certificateCode?: string
  file?: File
}

export interface CustomFormModelValue {
  [fieldName: string]: CustomFormFieldValue | undefined
}

export type CustomFieldValue = boolean | number | bigint | string | null | undefined | Object |
  Array<boolean | number | bigint | string | null | undefined | Object>

export interface CustomFormData {
  [fieldName: string]: CustomFieldValue
}
