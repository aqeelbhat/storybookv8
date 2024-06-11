import { Address, Contact, IDRef, Tax, Attachment, Image, BankInfo, User, UserId, Money } from "./common";
import { RiskScore } from "./request";
import { ActivationStatus, FormGlobalVal, NumberSource, SupplierUserId } from "./supplier";
import { SanctionEntityDetails } from "../Form/types";

export interface VendorRef {
  id: string
  name: string
  enabled: boolean
  companyEntityRef: IDRef
  additionalCompanyEntities: IDRef[]
  paymentTerm: IDRef
  vendorId: string
  currencies?: Array<string>
  enabledSystems?: IDRef[]
  purchasingEntities?: IDRef[]
}

export interface NormalizedVendorRef {
  id: string
  refId?: string
  vendorRecordId: string
  name: string
  countryCode: string
  legalEntityId: string
  legalEntityLogo: Image
  contact: Contact
  activationStatus: ActivationStatus
  invoicingEnabled?: boolean
  purchasingEnabled?: boolean
  selectedVendorRecord?: VendorRef
  vendorRecords?: Array<VendorRef>
  isIndividual?: boolean
  shareHolders?: Contact[]
  subsidiaries?: Contact[]
  subcontractors?: Contact[]
  boardOfDirectors?: Contact[]
  sanctionList?: SanctionEntityDetails[]
  members?: Contact[]
  ein?: string
  tin?: string
  vat?: string
  tinCountryCode?: string
  vatCountryCode?: string
  vendorProcureToPayStatus?: VendorProcureToPayStatus
}

export interface VendorProcureToPayStatus {
  purchasingEntityMatchStatus?: ActivationStatus
  companyEntityMatchStatus?: ActivationStatus
  matchedCompanyEntities?: IDRef[]
  unmatchedCompanyEntities?: IDRef[]
  matchedPurchasingEntities?: IDRef[]
  unmatchedPurchasingEntities?: IDRef[]
  blockedCompanyEntities?: IDRef[]
  blockedPurchasingEntities?: IDRef[]
}

export interface Location {
  id: string
  address: Address
  banks: Array<BankInfo>
  taxes: Array<Tax>
  contacts: Array<Contact>
  shipping?: boolean
  shippingDefault?: boolean
  billing?: boolean
  billingDefault?: boolean
  externalId?: string
}

export interface SiteRelation {
  id: string
  businessUnitId: string
}

export interface Site {
  id: string
  locationIdRef: string
  location: Location
  banksRef: Array<string>
  banks: Array<BankInfo>
  contactsRef: Array<string>
  contacts: Array<Contact>
  relations: Array<SiteRelation>
}

export interface BaseQuestionnaireId {
  name: string
  id: string
  formId: string
  custom: boolean
}

export enum BlockStatuses {
  blocked = 'blocked',
  paymentBlocked = 'paymentBlocked',
  purchasingBlocked = 'purchasingBlocked',
  postingBlocked = 'postingBlocked'
}

export enum VendorType {
  supplier = 'supplier',
  partner = 'partner'
}

export interface VendorCompanyInfo {
  companyCode: IDRef
  bankAccounts: BankInfo[]
  taxes: Tax[]
  currencies: Array<string>
  paymentTerm: IDRef
  blockStatuses: Array<BlockStatuses>
  questionnaireId: BaseQuestionnaireId
  formGlobalVals: FormGlobalVal
  accountCode: IDRef
  alternatePayees: Array<VendorRef>
}

export interface VendorPurchaseOrgInfo {
  purchaseOrg: IDRef
  bankAccounts: BankInfo[]
  taxes: Tax[]
  currencies: Array<string>
  paymentTerm: IDRef
  questionnaireId: BaseQuestionnaireId
  formGlobalVals: FormGlobalVal
  blockStatuses: Array<BlockStatuses>
  incoTerms: Array<IDRef>
  partners: Array<Partner>
}

export interface VendorIdentificationNumber {
  identificationType: IDRef
  identificationNumber: string
  description: string
  validityStartDate: string
  validityEndDate: string
  country: IDRef
  region: IDRef
}

export interface Partner {
  function: IDRef
  ref: VendorRef | null
}

export interface VendorPayload {
  tenantId?: string
  name: string
  legalEntityId?: string
  approved?: boolean
  hasNda?: string
  hasMsa?: string
  location: Location
  sites: Site[]
  locations: Location[]
  bankAccounts: BankInfo[]
  taxes: Tax[]
  contacts: Contact[]
  website: string
  vendorType: VendorType
  vendorCompanyInfos: VendorCompanyInfo[]
  vendorPurchaseOrgInfo: VendorPurchaseOrgInfo[]
}

export interface Vendor extends VendorPayload {
  id: string
  vendorRecords: Vendor[]
  companyEntityRef: IDRef
  additionalCompanyEntities: IDRef[]
  enabled: boolean
  legalEntityLogo?: Image
  companyName?: string
  normalizedId?: string
  terms: Terms
  commonName?: string
  duns?: string
  vendorId: string
  currencyRefs?: IDRef[]
  isExpanded?: boolean
  currencies: Array<string>
  email: string
  phone: string
  fax: string
  expenseAccount: IDRef
  payableAccount: IDRef
  tax1099: boolean
  note: string
  enabledSystems?: IDRef[]
  questionnaireId: BaseQuestionnaireId
  formGlobalVals: FormGlobalVal[]
  name2: string
  vendorIdentificationNumbers: VendorIdentificationNumber[]
  classificationRef?: IDRef
  highlighters?: Map<string, string>
  blockStatuses?: Array<BlockStatuses>
}

export interface Terms {
  id: string
  paymentTermRef: IDRef
  invoiceTermRef: IDRef
}

export interface Classification {
  category: string
  preferredStatus: string
  description: string
  internalContacts: UserId[]
  contacts: SupplierUserId[]
}

export interface OroTeamMember {
  user: User
  role: string
}

export enum NVType {
  child = 'child',
  parent = 'parent'
}

export interface VendorAdditionalDetails {
  vendorAddresses: Array<Address>
  taxes: Array<Tax>
  blockStatuses: Array<BlockStatuses>
}

export interface NormalizedVendor {
  activationStatus?: ActivationStatus
  vendorAdditionalDetails?: VendorAdditionalDetails
  id: string
  legalEntityId: string
  orgId?: string
  commonName: string
  legalName: string
  email: string
  phone: string
  description: string
  guidelines?: string
  website: string
  address: Address | null
  duns?: string
  regId: string
  ein?: string
  tin?: string
  vat: string
  isParent?: boolean
  tinCountryCode?: string
  vatCountryCode?: string
  vatIssuer?: string
  hasNda: boolean
  hasMsa: boolean
  type?: NVType
  hasDpa?: boolean
  hasCda?: boolean
  ndaExpiration?: string
  msaExpiration?: string
  dpaExpiration?: string
  cdaExpiration?: string
  nda: Attachment | null
  msa: Attachment | null
  cda: Attachment | null
  dpa: Attachment | null
  isSensitive?: boolean
  categories?: Classification[]
  products?: Classification[]
  services?: Classification[]
  vendorRecords: Vendor[]
  logo: Image,
  members: OroTeamMember[]
  segmentations: SegmentationDetail[]
  annualRevenue?: Money
  companySize?: NumberSource
  industryCode?: string
  vendorRecordRefs?: Array<VendorRef>
  supplierStatus?: string
  statusComment?: string
  individual?: boolean
  companyName?: string
  diversities?: DiversityCertificate[]
  providerScores?: ProviderScore[]
  parent?: IDRef
  highlighters?: Map<string, string>
  shareHolders?: Contact[]
  subsidiaries?: Contact[]
  subcontractors?: Contact[]
  boardOfDirectors?: Contact[]
  spendDetails: SpendDetails
  taxes?: Array<Tax>
}

export interface SpendDetails {
  poCount: number
  invoiceCount: number
  spendRange: TotalSpendRange
}

export interface ProviderScore {
  issuer: string;
  subjectName: string;
  scores: ServiceScore[]
}

export interface DiversityCertificate {
  expiration: string
  certificateType: CertificateType
  diversity: Diversity
  references: string[]
}

export interface Diversity {
  ownershipType: string
  alpha2CountryCode: string
  authority: string
  type: string
  code: string
}

export interface ServiceScore {
  serviceName: string
  minScore: number
  maxScore: number
  riskScore: RiskScore
  displayName: string
}

export enum TotalSpendRange {
  lessThan50K = 'lessThan50K',
  between50K_to_150K = 'between50K_to_150K',
  between150K_to_500K = 'between150K_to_500K',
  between500K_to_1M = 'between500K_to_1M',
  moreThan1M = 'moreThan1M'
}

export enum CertificateType {
  diversity = 'diversity'
}

export enum SupplierSegmentation {
  critical = 'critical',
  singleSource = 'singleSource',
  strategic = 'strategic',
  preferred = 'preferred',
  approved = 'approved',
  prospect = 'prospect',
  dontUse = 'dontUse'
}

export enum SupplierScope {
  program = 'Program',
  region = 'Region',
  site = 'Site',
  department = 'Department',
  entity = 'Entity',
  category = 'Category',
  product = 'Product',
  productStage = 'ProductStage'
}

export interface SupplierDimension {
  programs: Array<IDRef>
  regions: Array<IDRef>
  categories: Array<IDRef>
  products?: Array<IDRef>
  sites: Array<IDRef>
  departments: Array<IDRef>
  companyEntities: Array<IDRef>
  productStages?: Array<IDRef>
}

export interface SegmentationDetail {
  id: number | null
  name: string
  dimension: SupplierDimension | null
  segmentation: SupplierSegmentation | null
  description?: string | null
  latestUse: EngagementReference | null
}

export interface EngagementReference {
  categories: Array<IDRef>
  engagementReference: IDRef | null
  engagementTime: string
  requester: UserId | null
  processId: string
  engagementStatus: string | null
  infos?: AdditionalInfo | null
}

export interface AdditionalInfo {
  type: string
  refs: IDRef[]
  countryCodes: string[]
}

