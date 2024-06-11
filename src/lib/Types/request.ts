import { CallbackOutcome } from "../Form";
import { IconName } from "../RequestIcon";
import { IDRef, PORef, Money, UserId, ItemListType } from "./common";
import { AssessmentRisk, FormGlobalVal } from "./supplier";
import { NormalizedVendorRef } from "./vendor";

export interface RiskScore {
  score?: number
  level: string
  rating?: string
  reasons?: string[]
}

export interface ChangePO {
  method: string
  originalAmountMoney: Money
  originalLineSubtotalMoney: Money
  originalItems: ItemListType
  originalExpenseItems: ItemListType
  startDate: string
  endDate: string
  additionalAmountMoney: Money
  reason: string
}
export interface ProcessVariables {
  categories: Array<IDRef>
  regions: Array<IDRef>
  businessRegions: Array<IDRef>
  businessUnit: Array<IDRef>
  departments: Array<IDRef>
  companyEntities: Array<IDRef>
  additionalCompanyEntities?: Array<IDRef>
  sites: Array<IDRef>
  projectTypes: Array<IDRef>
  companyEntityCountryCodes: Array<string>
  startingSubprocessName?: string
  processName?: string
  segment: IDRef
  segments: Array<IDRef>
  impact: IDRef
  engagementId: string
  vendorClassification: IDRef

  // list of suppliers
  partnerSelected?: boolean
  partners: Array<NormalizedVendorRef>
  projectAmountMoney: Money
  budgetAmountMoney: Money
  projectAmountMoneyInTenantCurrency: Money
  activityName: string
  activityId: string
  activitySystem: string
  summary: string
  po?: PORef
  changePO?: ChangePO
  contracts?: IDRef[]
  paymentMethod?: string
  requestId?: string
  overallScore?: RiskScore | null
  callbackOutcomes?: Array<CallbackOutcome>
  spendType?: string
  priority?: string
  priorityRank?: IDRef
  contractAmountMoney: Money
  assesssmentScopes?: Array<AssessmentScope>
  companyEntityCurrencyCode?: string
  accountCode?: IDRef
  requestType?: string
  defaultVendorCountry: IDRef | null
  invoices?: IDRef[]
  financialImpactTypes?: IDRef[]
  locations?: IDRef[]
  assessOwnership?: boolean
  assessSubcontractors?: boolean
  assessSubsidiary?: boolean
  assessBoardOfDirectors?: boolean
  emailTo?: boolean
  emailFrom?: boolean
  releaseVersion?: string
  purchaseOrgs?: IDRef[]
  vendorPurchasingCheck?: boolean
  vendorInvoicingCheck?: boolean
}

export interface AssessmentScope {
  assessment: string
  assessmentId: string
  assessmentNumber: string
  assessmentType: IDRef
  expiration: string
  completed: string
  risk: AssessmentRisk
  assessmentAttributes: Array<FormGlobalVal>
  resultAttributes: Array<FormGlobalVal>
  status: String
}

export interface RequestQuestionnaireId {
  id: string
  name: string
  formId: string
  custom: boolean
}

export interface RequestStep {
  index: number
  title: string
  visited: boolean
  completed: boolean
  forms?: Array<RequestQuestionnaireId>
  hasConditions?: boolean
}

export interface RequestMeta {
  steps: Array<RequestStep>
}

export interface Selection {
  regions: Array<string>
  categories: Array<string>
  partnerLevels: Array<string>
  projectLevels: Array<string>
  partnerRegions: Array<string>
  businessUnits: Array<string>
  isNewPartner: boolean
  brands: Array<string>
  requester: UserId
  spendBucket: number
}

export interface RequestDefinitionReference {
  processName: string
}

export interface ProcessRequest {
  tenantId: string
  id: string
  requestId: string
  isNewPartner: boolean
  processType: string
  requestMeta: RequestMeta
  selection: Selection
  definitionReference: RequestDefinitionReference
  started: string
  engagementId: string
  processing: boolean
  status: string
}

export interface RequestDefintion {
  tenantId: string
  name: string
  type: string
  shortDescription: string
  icon: IconName
  requestName: string
}

export interface PublishedRequestDefintion {
  requestDefinition: RequestDefintion
}
