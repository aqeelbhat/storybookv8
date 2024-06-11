import { ContractRevision, ContractYearlySplit, Cost, SanctionEntityDetails } from "../Form/types"
import { DelegateUser, Engagement } from "."
import { EngagementReference, NormalizedVendorRef, SupplierDimension, VendorRef } from "./vendor"
import { CustomFieldValue, CustomFormData } from "../CustomFormDefinition"
import { AddressDetails } from "./legalEntity"

export type OroMasterDataType = 'Region' | 'Category' | 'ProjectType' | 'CompanyEntity' | 'Program' | 'Site' | 'CostCenter' | 'Department' | 'PaymentTerm' |
  'Currency' | 'Country' | 'USCompanyEntityType' | 'IndustryCode' | 'USForeignTaxClassification' | 'Billing' | 'VendorClassification' | 'CallbackTo' |
  'CallbackSource' | 'AssessmentType' | 'SoftwarePurchaseType' | 'SpendType' | 'Product' | 'ProductStage' | 'SupplierSegmentation' | 'UnitOfMeasure' |
  'DiversityOwnershipType' | 'BusinessUnit' | 'Item' | 'Location' | 'Project' | 'ExpenseCategory' | 'NonInventoryPurchaseItem' | 'TrackCode' | 'SupplierSearchDataSource' |
  'contractTypes' | 'FinancialImpactType' | 'WorkArea' | 'ImpactCategory' | 'DocumentTypeDefinition' | 'Segment' | 'BusinessRegion' | 'KPIType' | 'KPIBreakDown' |
  'OtherKPITag' | 'ContactSource'

export const TNC_NOTICE_TYPE = 't&c'

export interface Notice {
  // For form notice (e.g. T&C)
  formName?: string
  version?: string
  consentNeeded?: boolean
  supplierFacing?: boolean
  buyerFacing?: boolean
  oroDefined?: boolean

  // For banner notice (e.g. Downtime reminder)
  headingByLocale?: { [locale: string]: string }
  messageBylocale?: { [locale: string]: string }

  // For determining date-range in which to show the notice
  from?: string
  to?: string
}

export interface NoticeSettings {
  supplierConsentNeeded?: boolean
  buyerConsentNeeded?: boolean
  noticeByTypeAndCountryCode?: {
    [noticeType: string]: {
      [country: string]: Notice
    }
  }
}

export interface UserNotices {
  [noticeType: string]: Notice
}

export interface User {
  confirmedStatus?: string
  dateCreated?: string
  externalUser?: boolean
  email: string
  name: string
  firstName: string
  groupIds?: Array<string>
  lastLoginAttempt?: string
  lastLoginSuccessful?: boolean
  lastName: string
  locale: string
  loginFailureCount?: number
  phone?: string
  picture?: string
  roles?: Array<string>
  userLockedOut?: boolean
  userName: string
  userType?: string
  tenantId?: string
  delegatedUsers?: Array<DelegateUser>
  costCenter?: string
  costCenterErpId?: string
  businessUnit?: string
  businessUnitErpId?: string
  departmentName?: string
  defaultCompanyEntity?: string
  defaultCurrencyCode?: string
  userNameCasePreserved?: string
  notices?: UserNotices
  employeeId?: string
  active?: boolean
}

export interface UserId {
  api?: boolean
  groupIds?: Array<string>
  name: string
  tenantId?: string
  userName: string
  selected?: boolean
  department?: string
  picture?: string
  firstName?: string
  lastName?: string
  email?: string
  isOtp?: boolean
  userNameCP?: string
}

export interface GroupId {
  tenantId?: string
  groupId: string
  groupName: string
  selected?: boolean
}

export interface Group {
  tenantId: string
  id: string
  name: string
  roles: Array<string>
  permissions: Array<string>
  description: string
  externalGroup?: boolean
  systemGroup?: boolean
}

export interface Address {
  line1: string
  line2: string
  line3: string
  streetNumber: string
  unitNumber: string
  city: string
  province: string
  alpha2CountryCode: string
  postal: string
  language?: string
}

export interface Money {
  amount: number
  currency: string
}

export interface IDRef {
  id: string
  name: string
  erpId: string
  refId?: string
  version?: string
  systemId?: string
}

export interface ValueWithJustification {
  stringValue: string
  justification: string
}

export interface Phone {
  isoCountryCode: string
  dialCode: string
  number: string
}

export interface AssessmentSubtype {
  assessment: string
  subType: IDRef
}

export interface PORef {
  id: string | null
  poNumber: string
  cost: number
  currencyCode: string
  syncFrom?: IDRef
}

export interface ImageMetadata {
  path: string
  height: number
  width: number
}

export interface Image {
  metadata: Array<ImageMetadata>
  backgroundColor?: string
}

export interface SeonEmailVerificationResponse {
  email: string
  verified: boolean
  verificationFailureReason: string
  isFreeDomain: boolean
  emailNotDeliverable: boolean
  domainNotExist: boolean
}

export interface Contact {
  id?: string
  firstName?: string
  lastName?: string
  fullName: string
  email: string
  title?: string
  role: string
  phone: string
  address?: Address
  imageUrl?: string
  emailVerified?: boolean
  phoneVerified?: boolean
  emailVerification?: SeonEmailVerificationResponse
  sharePercentage?: number
  note?: string
  requireBackgroundCheck?: boolean
  operationLocation?: Address
  service?: string
  sanctionList?: SanctionEntityDetails[]
  designation?: ContactDesignation | null
  primary?: boolean
}

export interface ContactDesignation {
  role: ContactRole | null
}

export enum ContactRole {
  primary = 'primary'
}

export interface SupplierUser extends Contact {
  tenantId?: string
  vendorId?: string
}

export interface Tax {
  id: string
  issuer: string
  taxNumber: string
  type: string
  encryptedTaxNumber: EncryptedData
  address?: AddressDetails
}

export interface EncryptedData {
  version: string
  data: string
  iv: string
  unencryptedValue: string
  maskedValue: string
}

export type BankKey = 'abaRoutingNumber' | 'canadaBankCode' | 'bsbNumber' | 'iban' | 'swift' | 'bankgiro' | ''
export type IbanSupport = 'mandatory' | 'notSupported' | 'recommended'

export type AttachmentContent = 'CustomerData' | 'CustomerPrivate' | 'Masterdata' | 'Assets' | ''

// export type BankAccountType = 'checking' | 'saving'
export interface Attachment {
  filename?: string
  mediatype?: string
  size?: number
  path?: string
  reference?: string
  date?: string
  expiration?: string
  name?: string
  note?: string
  contentKind?: AttachmentContent
  asyncGetUrl?: string
  asyncPutUrl?: string
  sourceUrl?: string
  created?: string
}

export interface Certificate {
  name?: IDRef
  attachment?: Attachment
  expiryDate?: string
  issueDate?: string
}

export interface PurchaseOrderHistory {
  created: Engagement | null
  updated: Engagement[]
}
enum EBillingCycle {
  Semiannual = 'Semiannual',
  Monthly = 'Monthly',
  Annual = 'Annual',
  Quarterly = 'Quarterly'
}
export enum POStatus {
  active = 'active',
  cancelled = 'cancelled',
  closed = 'closed',
  partiallyReceived = 'partiallyReceived',
  draft = 'draft',
  inApproval = 'inApproval',
  approved = 'approved',
  pendingReceipt = 'pendingReceipt',
  pendingBill = 'pendingBill',
  partiallyBilled = 'partiallyBilled',
  fullyBilled = 'fullyBilled'
}

export enum ContractRuntimeStatus {
  draft = 'draft',
  inNegotiation = 'inNegotiation',
  inApproval = 'inApproval',
  approved = 'approved',
  signed = 'signed',
  invalid = 'invalid',
  cancelled = 'cancelled',
  voided = 'voided',
  deleted = 'deleted',
  expired = 'expired',
  sent = 'sent',
  delivered = 'delivered',
  active = 'active',
  recentlySigned = 'recentlySigned',
  renewalDue = 'renewalDue',
  cancellationDue = 'cancellationDue',
  expiringSoon = 'expiringSoon',
  closed = 'closed',
  inRenewal = 'inRenewal',
  inCancellation = 'inCancellation',
  inUpdate = 'inUpdate',
  renewed = 'renewed'
}
export interface ContractDetail {
  id: string
  contractId: string
  name: string
  description: string
  title: string
  requester: UserId
  businessOwners: UserId[]
  negotiators: UserId[]
  status: string
  runtimeStatus: string
  contractType: IDRef
  quantity: string
  parentContract: IDRef
  normalizedVendor: NormalizedVendorRef
  vendor: VendorRef
  selectedProduct: IDRef
  products: IDRef[]
  engagement: IDRef
  spendCategory: IDRef
  startDate: string
  endDate: string
  duration: number
  poDuration: number
  negotiationStarted: string
  negotiationCompleted: string
  approved: string
  signed: string
  currency: IDRef
  recurringSpend: Money | null
  fixedSpend: Money | null
  variableSpend: Money | null
  oneTimeCost: Money | null
  totalValue: Money | null
  totalRecurringSpend: Money | null
  averageVariableSpend: Money | null
  totalEstimatedSpend: Money | null
  negotiatedSavings: Money | null
  savingsLink: string
  yearlySplits: ContractYearlySplit[]
  revisions: ContractRevision[]
  sensitive: boolean
  autoRenew: boolean
  autoRenewNoticePeriod: number
  autoRenewDate: string
  includesCancellation: boolean
  cancellationDeadline: string
  paymentTerms: IDRef
  departments: IDRef[]
  companyEntities: IDRef[]
  created: string
  updated: string
  signatories: UserId[]
  billingCycle: string
  relatedContracts: IDRef[]
  includesPriceCap: boolean
  priceCapIncrease: number
  includesOptOut: boolean
  optOutDeadline: string
  renewalAnnualValue: Money | null,
  includesLateFees: boolean
  lateFeesPercentage: number | null
  lateFeeDays: number | null
  terminationOfConvenience: boolean
  terminationOfConvenienceDays: number | null
  liabilityLimitation: boolean
  liabilityLimitationMultiplier: number | null
  liabilityLimitationCap: Money | null
  tenantLiabilityLimitationCap: Money | null
  confidentialityClause: boolean
  tenantRecurringSpend: Money | null
  tenantFixedSpend: Money | null
  tenantVariableSpend: Money | null
  tenantOneTimeCost: Money | null
  tenantTotalValue: Money | null
  tenantNegotiatedSavings: Money | null
  tenantAverageVariableSpend: Money | null
  tenantTotalEstimatedSpend: Money | null
  tenantTotalRecurringSpend: Money | null
  accountCodes: IDRef[]
  updateEngagements?: IDRef[]
  documents?: Document[]
}

export interface PurchaseOrder {
  externalId?: string
  vendorId?: string
  vendorExternalId?: string
  program?: string
  poNumber?: string
  companyEntityRef?: IDRef
  departmentRef?: IDRef
  accountRef?: IDRef
  paymentTermsRef?: IDRef
  projectTypeId?: string
  status?: string
  runtimeStatus?: string
  activityName?: string
  activityDescription?: string
  cost?: number
  currencyCode?: string
  services?: string[]
  itemList?: ItemListType
  expenseItemList?: ItemListType
  formData?: any
  start?: string
  end?: string
  id?: string
  requestorName?: string
  requestorUsername?: string
  memo?: string
  engagementRefs?: IDRef[]
  created?: string
  normalizedVendorRef?: NormalizedVendorRef
  contractType?: IDRef
  contract?: IDRef
  noteObjects?: Note[]
  erpCreatedDate?: string
  erpUpdatedDate?: string
  costObjectInTenantCurrency?: Money
  data?: CustomFormData
  dataJson?: string
  billedAmountMoney?: Money;
  tenantBilledAmountMoney?: Money;
  pendingClose?: EngagementReference[]
  pendingAmendments?: EngagementReference[]
  accumulator?: Accumulator
  // tenantId: string
  // version: number
  // customFieldList: []
  // customFieldMap: []
  // notes
  // emailRecipientForPO
  // oroRequestUrl
  // filename
  // fileContents
  // lineItems
  // customFields
  // activitySystem
  // activityId
  // engagementId
}

export interface PurchaseOrderFilter {
  keywords?: string
  departments?: string[]
  companyEntity?: string[]
  account?: string[]
  normalizedVendors?: string[]
  sortKey?: string
}

export interface PurchaseOrderSearchVariables {
  filter: PurchaseOrderFilter,
  page: number,
  size: number,
  isIncludeCompletedStatus?: boolean // used to fetch completed contract (signed, expired, closed, cancelled)
}

// TODO: ISSUE - value is being used for display purpose, which is ideally wrong.
// should fix consumers first, and replace 'Goods' with 'goods, and 'Service'with 'service'
export enum ItemType {
  goods = 'goods',
  service = 'service'
}
export interface ItemListType {
  items: Array<ItemDetails>
  searchResultUrl?: string
  startPageUrl?: string
}

export interface TaxObject {
  amount: Money
  items: Array<TaxItem>
}

export interface TaxItem {
  taxCode?: IDRef
  percentage?: number
  taxableAmount: Money
  amount?: Money
}

export interface Accumulator {
  quantityReceived?: number
  quantityBilled?: number
}

export interface ItemDetails {
  children?: ItemDetails[]
  section?: boolean
  id: string,
  name?: string,
  categories?: Array<IDRef>,
  price?: Money,
  quantity?: number,
  totalPrice?: Money,
  accumulator?: Accumulator
  description?: string,
  lineNumber?: number,
  erpItemId?: IDRef,
  type?: ItemType,
  url?: string,
  materialId?: string,
  manufacturerPartId?: string,
  supplierPartId?: string,
  accountCodeIdRef?: IDRef | null,
  unitForQuantity?: IDRef,
  images?: Array<Attachment>,
  specifications?: Array<Attachment>,
  startDate?: string,
  endDate?: string,
  tax?: TaxObject,
  normalizedVendorRef?: NormalizedVendorRef,
  departments?: Array<IDRef>,
  itemIds?: Array<IDRef>,
  lineOfBusiness?: IDRef,
  trackCode?: Array<IDRef>,
  location?: IDRef,
  projectCode?: IDRef,
  expenseCategory?: IDRef
  data?: CustomFormData,
  costCenter?: IDRef
  existing?: boolean
  // nonInventoryPurchaseItem?: IDRef
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
  level = 'Level',
  rate = 'Rate',
  uom = 'Unit',
  startDate = 'Start Date',
  endDate = 'End Date',
  backgroundCheck = 'Required Background check',
  percentageOfShare = 'Percentage of ownership / shares in %',
  country = 'Country',
  locations = 'Locations',
  service = 'service',
  countryOfOperation = 'Country of Operation'
}

export interface ContactData {
  fullName: string,
  title?: string,
  email: string,
  phoneObject?: Phone | string,
  url?: string,
  address?: Address,
  note?: string,
  attachments?: Array<Attachment>,
  role?: string,
  level?: string,
  rate?: Cost,
  uom?: IDRef,
  startDate?: Date,
  endDate?: Date,
  requireBackgroundCheck?: boolean
  // used in share holder form
  country?: string
  sharePercentage?: number
  service?: string
  locations?: Array<IDRef>
  operationLocation?: Address
}

export function getEmptyContact (): ContactData {
  return {
    fullName: '',
    title: '',
    email: '',
    phoneObject: '',
    url: '',
    note: ''
  }
}

export interface DocumentField {
  filename: string
  path: string
  mediatype: string
}

export interface VendorSuggestionRequestFilters {
  oroIgnore?: boolean
  unresolved?: boolean
  country?: Array<string>
  companyEntities?: Array<string>
}

export interface VendorSuggestionRequest {
  keyword?: string
  from?: number
  size?: number
  debugMode?: boolean
  duplicateCheck?: boolean
  duns?: string;
  parentId?: string
  website?: string;
  alpha2CountryCode?: string;
  companyEntityId?: string;
  filters?: VendorSuggestionRequestFilters
}

export interface SuggestionRequest {
  keyword?: string
  appName?: any
  regions?: Array<string>
  from?: number
  size?: number
  debugMode?: boolean
  boostCodes?: Array<string>
  filters?: SuggestionRequestFilters
  programCode?: string
}

export interface SuggestionRequestFilters {
  industryCodes?: Array<string>
  regions?: Array<string>
  subsidiaries?: Array<string>
  departments?: Array<string>
  products?: Array<string>
  productStages?: Array<string>
}

export interface BankInfo {
  currencyCode: IDRef | null
  bankName: string | null
  accountHolder: string | null
  accountHolderAddress: Address | null
  accountNumber: EncryptedData | null

  key: BankKey | null
  bankCode: string | null
  bankCodeError?: string | null
  bankAddress: Address | null

  internationalKey: BankKey | null
  internationalCode: string | null
  internationalCodeError?: string | null

  created?: string | null
}

export interface IntermediaryBankInfo {
  bankName: string | null
  bankAddress: Address | null

  key: BankKey | null
  bankCode: string | null
  bankCodeError?: boolean | null
}

export enum DocumentStatus {
  Active = 'Active',
  Expiring = 'Expiring',
  Expired = 'Expired'
}

export interface Label {
  id: string
  text: string
}

export interface Note {
  id?: string
  owner?: UserId | null
  taskStatus?: string
  comment?: string
  documents?: Array<IDRef>
  attachments?: Array<Attachment>
  created?: string
  updated?: string
  parentId?: string
  replies?: Array<Note>
  commentMeta?: string
  users?: Array<UserId>
}

export interface ObjectNote {
  id: string
  objectId: string
  subject: string
  note: Note | null
  owners: Array<UserId>
  canModify: boolean
}

export enum AppType {
  marketing = 'marketing',
  direct = 'direct',
  system = 'system',
  hcp = 'hcp',
  indirect = 'indirect',
  // BASF, supplier development
  development = 'development',
  all = 'all'
}

export interface ACL {
  users: Array<UserId>
  groups: Array<GroupId>
  workstream: Array<IDRef>
  programs: Array<IDRef>
}

export enum SignatureStatus {
  draft = 'draft',
  signed = 'signed',
  finalised = 'finalised'
}

export interface Document {
  id?: string | null
  normalizedVendorId?: string | null
  engagementRef?: IDRef | null
  name: string | null
  type: IDRef | null // Points to a DocumentTypeDefinition masterdata
  status?: DocumentStatus | null
  created?: string | null
  updated?: string | null
  attachment: Attachment | null
  sourceUrlAttachment: Attachment | null
  owners?: Array<UserId>
  acl?: ACL

  startDate?: string | null
  endDate?: string | null
  dateSigned?: string | null
  dateIssued?: string | null
  renewalPeriodStart?: string | null
  renewalPeriodEnd?: string | null
  expirationDate?: string | null
  amount?: Money | null
  autoRenew?: boolean
  terminationNoticePeriod?: number
  documentNumber?: string
  pastVersions?: Array<Attachment>

  services?: Array<IDRef> | null // Points to Category masterdata
  notes?: Array<Note> | null
  sourceUrl?: string | null
  engagementOnly?: boolean // If true, will NOT be visible in the supplier's profile
  sensitive?: boolean
  dimension?: SupplierDimension
  editableByUser?: boolean
  signatureStatus?: SignatureStatus

  uploadInProgress?: boolean // used to check if async upload in progress or not
  accessToken?: string
}

export interface ProductRef {
  id?: string
  name: string
  companyName?: string
  description?: string
  image?: string
  plans?: string[]
  shortDescription?: string
  website?: string
  categoryCode?: string
  companyOroId?: string
  logo?: string
  productUrl?: string
}

export type ContractStatus = 'draft' | 'inNegotiation' | 'inApproval' | 'approved' | 'signed' | 'invalid' | 'cancelled' | 'voided' | 'deleted' | 'sent' | 'delivered'
export interface ContractRef {
  id?: string
  contractId?: string
  name: string
  description?: string
  totalValue?: Money
  recurringSpend?: Money
  startDate?: string
  endDate?: string
  status?: ContractStatus
  attachments?: Document[]
}

export interface UserProgram {
  id: string
  name: string
  erpId: string
}

export interface TeamMembers {
  role: string
  user: User
}

export interface TeamDetails {
  name: string
  code: string
  description: string
  engagementPrefix: string
  status: string
  tenantId: string
  programCode: string
  numberOfMembers: number
  ownerIdList: string[]
  ownerIds: string
  programRef: UserProgram
  owners: User[]
  members: User[]
  teamMembers: TeamMembers[]
}

export enum FormButtonAction {
  save = 'save',
  complete = 'complete'
}

export enum BankAccountType {
  checking = 'checking',
  saving = 'saving'
}

export interface FormDiff {
  fieldDiffs?: any
  listDiffs?: any
}

export type ObjectValue = PurchaseOrder | ContractDetail

export type ObjectSearchVariables = PurchaseOrderSearchVariables

export interface SplitAccounting {
  amount?: Money
  percentage?: number
  id?: IDRef
}



/**
 * @description Enumeration cases for Keyboard string values
 * @documentation https://www.w3.org/TR/uievents-key/#named-key-attribute-values
 * @package ORO UI Toolkit
 * @path src/lib/Types/common.ts
 */

export enum Keyboard {
  Up = 'ArrowUp',
  Down = 'ArrowDown',
  Enter = 'Enter',
  Return = 'Return',
  Escape = 'Escape',
  Esc = 'Esc',
  Space = 'Space',
  Spacebar = ' ',
  Right = 'ArrowRight',
  Left = 'ArrowLeft',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
  Tab = 'Tab',
  Meta = 'Meta'
}


export interface Diff {
  changed: boolean
  original: CustomFieldValue
}
export interface ListDiff {
  // the list itself is different
  listDifferent: boolean
  // diffs for individual item
  itemDiffs: Array<Diff>
}

export interface FieldDiffs {
  fieldDiffs?: {[key: string]: Diff}
  listDiffs?: {[key: string]: ListDiff}
}
