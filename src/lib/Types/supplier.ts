import { RiskScore, SupplierSearchSummary, SupplierTaxKeyField } from "..";
import { PreferredSuppliers } from "../Form/ChatGPT/types";
import { Address, Attachment, Certificate, Contact, Document, IDRef, Money, Note, User, UserId } from "./common";
import { Option } from "./input";
import { LegalEntity, LegalEntityRef } from "./legalEntity";
import { NormalizedVendor, SegmentationDetail, SupplierDimension, VendorRef } from "./vendor";

/* eslint-disable */
export enum ActivationStatus {
  newSupplier = 'newSupplier',
  duplicate = 'duplicate',
  requiresActivation = 'requiresActivation',
  active = 'active',
  purchasingEntitiesMatched = 'purchasingEntitiesMatched',
  purchasingEntitiesMatchedPartially = 'purchasingEntitiesMatchedPartially',
  companyEntitiesMatched = 'companyEntitiesMatched',
  companyEntitiesMatchedPartially = 'companyEntitiesMatchedPartially'
}

export interface SupplierUserId {
  id: string
  name: string
  vendorId: string
}

export interface Supplier {
  activationStatus?: ActivationStatus
  supplierName: string
  contact?: Contact | null
  address?: Address | null
  website?: string
  duns?: string
  contactName?: string
  email?: string
  phoneNumber?: string
  contactNote?: string
  legalEntity?: LegalEntity | null
  vendorId?: string | null
  nda?: Attachment | null
  msa?: Attachment | null
  ndaInFile?: boolean
  msaInFile?: boolean
  proposal?: Attachment
  isParent?: boolean
  contract?: Attachment
  selectedVendorRecord?: VendorRef | null
  vendorRecords?: VendorRef[]
  newSupplier?: boolean
  newSupplierMessage?: string
  requireSelection?: boolean
  allowMultiple?: boolean
  supplierStatus?: string
  isIndividual?: boolean
  companyName?: string;
  createNewVendor?: boolean
  potentialMatches: LegalEntityRef[] | null, // duplicateSuppliers
  potentialMatchIgnore: boolean | null // ignoreDuplicates
  shareHolders?: Contact[]
  subsidiaries?: Contact[]
  subcontractors?: Contact[]
  boardOfDirectors?: Contact[]
  refId?: string
  ein?: string
  tin?: string
  vat?: string
  tinCountryCode?: string
  vatCountryCode?: string
  segmentationDetails?: Array<SegmentationDetail>
  supplierTransactionDetails?: PreferredSuppliers[] // used in GPT Flow,
  jurisdictionCountryCode?: string
  langCode?: string
  name?: string
  type?: string
  logoURL?: string
  addressDetails?: Address | null
  description?: string
  supplierDimensions?: Array<SupplierDimension>
  tax?: SupplierTaxKeyField | null
  indirectTax?: SupplierTaxKeyField | null
  supplierSelectionText?: string
  potentialMatchesSupplierSummary?: Array<SupplierSearchSummary>
}

export interface SupplierRecommendation {
  count: number
  suggestions: Array<NormalizedVendor>
  leSuggestions: Array<LegalEntity>
}

export interface DetailParameter {
  parameterName: string
  value: string
}

export enum Source {
  lei,
  sam,
  open_corporate,
  saas_worthy,
  sba,
  forbes,
  fortune,
  registry,
  manual,
  linkedin
}

export interface NumberSource {
  value: number
  source: Source
}

export interface SupplierDetails {
  id: string
  commonName?: string
  type?: string
  industryCode?: string
  address?: Address
  website?: string
  regId?: string
  description?: string
  numEmployees?: string
  companySize?: NumberSource
  annualRevenue?: Money
  attachment?: Attachment | File | null
  logoURL?: string
  details?: DetailParameter[]
}

export interface SupplierCapabilities {
  categories: Option[]
  regions: Option[]
  sites: Option[]
  products: Option[]
  productStages: Option[]
  restrictions: Option[]
  preferredStatus: Option | null
  description?: string
  id: number | null
  name: string
}

export interface Summary {
  count: number
  firsDocumentSummary: Document | null
}

export interface LegalDocumentSummary {
  nda: Summary | null
  dpa: Summary | null
  msa: Summary | null
  contract: Summary | null
}

export interface DocumentCount {
  type: IDRef | null
  count: number
}

export interface DocumentSummary {
  documentCounts: Array<DocumentCount>
  all: number
}

export interface SupplierAssessment {
  id: string
  name: string
  type: Option
  expiration: string
  created: string
  requester: User
  restrictions: Option[]
  attachment: Attachment
  sourceURL: string
  selectedFile?: File
}

export enum AssessmentPartyType {
  supplier = 'supplier',
  hcp = 'hcp'
}

export interface FormDefinitionId {
  app?: string
  form: string
  formVersion?: number
}

export interface FormGlobalVal {
  id: number
  name: string
  reportName: string
  fieldId: number
  formDefinitionId: FormDefinitionId
  booleanVal?: boolean
  numberVal?: number
  dateVal?: string
  moneyVal?: Money
  stringVal?: string
  idRef?: IDRef
  addressVal?: Address
  userVal?: UserId
  contactVal?: Contact
  certificateVal?: Certificate
  displayValue?: string
  stringValues?: string
  idRefs?: Array<IDRef>
  userVals?: Array<UserId>
  certificateVals?: Array<Certificate>
  fieldGrouping?: IDRef
  assessmentRisk?: AssessmentRisk
  customFieldType?: string
}

export enum AssessmentStatus {
  pending = 'pending',
  cancelled = 'cancelled',
  rejected = 'rejected',
  done = 'done',
  notNeeded = 'notNeeded'
}

export interface AssessmentRisk {
  riskType?: IDRef
  riskScore: RiskScore
  assessment?: string
}

export interface AssessmentExpiration {
  expiration: string
  assessment?: string
}

export interface  AssessmentRef {
  ref: IDRef
  engagementRef: IDRef
  expiration: string
  completed: string
}

export interface Assessment {
  id: string
  assessmentId?: string
  name: string
  type: IDRef | null
  requester: UserId | null
  expiration: string
  created: string
  dimension: SupplierDimension | null
  tenantId?: string
  normalizedVendor?: IDRef
  engagementRef?: IDRef
  engagementSummary?: string
  partyType?: AssessmentPartyType | null,
  souceURL: string
  attachment: Attachment
  assessors?: Array<UserId> | null
  status?: AssessmentStatus | null
  scopeForm?: FormDefinitionId | null
  resultForm?: FormDefinitionId | null
  risk?: AssessmentRisk | null
  assessmentAttributes?: Array<FormGlobalVal> | null
  resultAttributes?: Array<FormGlobalVal> | null
  resultFormId?: string | null
  scopeFormId?: string | null
  departments?: Array<IDRef> | null
  companyEntities?: Array<IDRef> | null
  noteObjects?: Array<Note> | null
  completed?: string
  previous?: AssessmentRef | null
  renewals?: Array<AssessmentRef>
  runtimeStatus?: string
  runtimeRenewalStatus?: string
  renewedAssessment?: AssessmentRef | null
  renewalPendingAssessment?: AssessmentRef | null
}

