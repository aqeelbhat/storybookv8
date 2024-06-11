import { add } from "date-fns"
import { CallbackOutcome } from "../../Form"
import { IDRef } from "../common"
import { AssessmentScope, ChangePO, ProcessVariables, PublishedRequestDefintion, RequestDefintion, RiskScore, Selection } from "../request"
import { NormalizedVendorRef } from "../vendor"
import { mapEncryptedData, mapIDRef, mapItemListType, mapMoney, mapPORef, mapUserId} from "./common"
import { mapAssessmentRisk, mapFormGlobalVal } from "./supplier"
import { mapNormalizedVendorRef } from "./vendor"

export function mapOutCome (outcome: any): CallbackOutcome {
  return {
    index: outcome?.index || 0,
    accountNumber: mapEncryptedData(outcome?.accountNumber),
    code: outcome?.code || '',
    codeRef: mapIDRef(outcome?.codeRef)
  }
}

export function mapRiskScore (score: RiskScore): RiskScore {
  return {
    level: score?.level || '',
    score: score?.score || 0,
    rating: score?.rating || '',
    reasons: Array.isArray(score?.reasons) ? score.reasons : []
  }
}

export function mapChangePO (changePO: any): ChangePO {
  return {
    additionalAmountMoney: mapMoney(changePO?.additionalAmountMoney),
    endDate: changePO?.endDate || '',
    method: changePO?.method || '',
    originalAmountMoney: mapMoney(changePO?.originalAmountMoney),
    originalLineSubtotalMoney: mapMoney(changePO?.originalLineSubtotalMoney),
    reason: changePO?.reason || '',
    startDate: changePO?.startDate || '',
    originalItems: mapItemListType(changePO?.originalItems),
    originalExpenseItems: mapItemListType(changePO?.originalExpenseItems)
  }
}

export function mapAssessmentScope (data: any): AssessmentScope {
  return {
    assessment: data?.assessment || '',
    assessmentId: data?.assessmentId || '',
    assessmentNumber: data?.assessmentNumber || '',
    assessmentType: mapIDRef(data?.assessmentType),
    expiration: data?.expiration || '',
    completed: data?.completed || '',
    risk: mapAssessmentRisk(data?.risk),
    assessmentAttributes: Array.isArray(data?.assessmentAttributes) ? data.assessmentAttributes.map(mapFormGlobalVal) : [],
    resultAttributes: Array.isArray(data?.resultAttributes) ? data.resultAttributes.map(mapFormGlobalVal) : [],
    status: data?.status || '',
  }
}

export function mapProcessVariables (processVariables: any) : ProcessVariables {
  let categories: Array<IDRef> = []
  let regions: Array<IDRef> = []
  let businessRegions: Array<IDRef> = []
  let businessUnit: Array<IDRef> = []
  let departments: Array<IDRef> = []
  let companyEntities: Array<IDRef> = []
  let projectTypes: Array<IDRef> = []
  let sites: Array<IDRef> = []
  let partners: Array<NormalizedVendorRef> = []
  let callbackOutcomes: Array<CallbackOutcome> = []
  let segments: Array<IDRef> = []
  let contracts: Array<IDRef> = []
  let assessmentScope: Array<AssessmentScope> = []
  let invoices: Array<IDRef> = []
  let financialImpactTypes: Array<IDRef> = []
  let locations: Array<IDRef> = []
  let additionalCompanyEntities: Array<IDRef> = []
  let purchaseOrgs: Array<IDRef> = []

  if (processVariables && processVariables.contracts && processVariables.contracts.length) {
    contracts = processVariables.contracts.map(mapIDRef)
  }

  if (processVariables && processVariables.invoices && processVariables.invoices.length) {
    invoices = processVariables.invoices.map(mapIDRef)
  }

  if (processVariables && processVariables.financialImpactTypes && processVariables.financialImpactTypes.length) {
    financialImpactTypes = processVariables.financialImpactTypes.map(mapIDRef)
  }

  if (processVariables && processVariables.categories && processVariables.categories.length) {
    categories = processVariables.categories.map(mapIDRef)
  }

  if (processVariables && processVariables.sites && processVariables.sites.length) {
    sites = processVariables.sites.map(mapIDRef)
  }

  if (processVariables && processVariables.regions && processVariables.regions.length) {
    regions = processVariables.regions.map(mapIDRef)
  }

  if (processVariables && processVariables.additionalCompanyEntities && processVariables.additionalCompanyEntities.length) {
    additionalCompanyEntities = processVariables.additionalCompanyEntities.map(mapIDRef)
  }

  if (processVariables && processVariables.businessRegions && processVariables.businessRegions.length) {
    businessRegions = processVariables.businessRegions.map(mapIDRef)
  }

  if (processVariables && processVariables.businessUnit && processVariables.businessUnit.length) {
    businessUnit = processVariables.businessUnit.map(mapIDRef)
  }

  if (processVariables && processVariables.departments && processVariables.departments.length) {
    departments = processVariables.departments.map(mapIDRef)
  }

  if (processVariables && processVariables.companyEntities && processVariables.companyEntities.length) {
    companyEntities = processVariables.companyEntities.map(mapIDRef)
  }

  if (processVariables && processVariables.projectTypes && processVariables.projectTypes.length) {
    projectTypes = processVariables.projectTypes.map(mapIDRef)
  }

  if (processVariables && processVariables.partners && processVariables.partners.length) {
    partners = processVariables.partners.map(mapNormalizedVendorRef)
  }

  if (processVariables && processVariables.callbackOutcomes && processVariables.callbackOutcomes.length) {
    callbackOutcomes = processVariables.callbackOutcomes.map(mapOutCome)
  }

  if (processVariables && processVariables.segments && processVariables.segments.length) {
    segments = processVariables.segments.map(mapIDRef)
  }

  if (processVariables && processVariables.assesssmentScopes && processVariables.assesssmentScopes.length) {
    assessmentScope = processVariables.assesssmentScopes.map(mapAssessmentScope)
  }

  if (processVariables && processVariables.locations && processVariables.locations.length) {
    locations = processVariables.locations.map(mapIDRef)
  }

  if (processVariables && processVariables.purchaseOrgs && processVariables.purchaseOrgs.length) {
    purchaseOrgs = processVariables.purchaseOrgs.map(mapIDRef)
  }

  const processVariablesObj: ProcessVariables = {
    categories,
    sites,
    regions,
    businessRegions,
    businessUnit,
    departments,
    companyEntities,
    projectTypes,
    partners,
    partnerSelected: processVariables?.partnerSelected || false,
    impact: mapIDRef(processVariables?.impact),
    segment: mapIDRef(processVariables?.segment),
    segments,
    vendorClassification: mapIDRef(processVariables?.vendorClassification),
    processName: processVariables?.processName || '',
    startingSubprocessName: processVariables?.startingSubprocessName || '',
    projectAmountMoney: processVariables ? mapMoney(processVariables.projectAmountMoney) : mapMoney(null),
    projectAmountMoneyInTenantCurrency: processVariables ? mapMoney(processVariables.projectAmountMoneyInTenantCurrency) : mapMoney(null),
    contractAmountMoney: processVariables ? mapMoney(processVariables.contractAmountMoney) : mapMoney(null),
    activityName: processVariables ? processVariables.activityName : '',
    activityId: processVariables ? processVariables.activityId : '',
    activitySystem: processVariables ? processVariables.activitySystem : '',
    summary: processVariables ? processVariables.summary : '',
    companyEntityCountryCodes: processVariables?.companyEntityCountryCodes || [],
    po: mapPORef(processVariables?.po),
    paymentMethod: processVariables?.paymentMethod || '',
    engagementId: processVariables?.engagementId || '',
    requestId: processVariables?.requestId || '',
    callbackOutcomes,
    overallScore: processVariables?.overallScore ? mapRiskScore(processVariables?.overallScore) : null,
    priority: processVariables?.priority || '',
    priorityRank: processVariables?.priorityRank ? mapIDRef(processVariables?.priorityRank) : null,
    changePO: processVariables?.changePO ? mapChangePO(processVariables?.changePO) : undefined,
    contracts,
    assesssmentScopes: assessmentScope,
    companyEntityCurrencyCode: processVariables?.companyEntityCurrencyCode || '',
    accountCode: mapIDRef(processVariables?.accountCode),
    requestType: processVariables?.requestType || '',
    budgetAmountMoney: processVariables?.budgetAmountMoney ? mapMoney(processVariables.projectAmountMoney) : mapMoney(null),
    defaultVendorCountry: processVariables?.defaultVendorCountry ? mapIDRef(processVariables?.defaultVendorCountry) : null,
    invoices,
    financialImpactTypes,
    locations,
    additionalCompanyEntities,
    assessOwnership: processVariables?.assessOwnership,
    assessSubcontractors: processVariables?.assessSubcontractors,
    assessSubsidiary: processVariables?.assessSubsidiary,
    assessBoardOfDirectors: processVariables?.assessBoardOfDirectors,
    emailTo: processVariables?.emailTo,
    emailFrom: processVariables?.emailFrom,
    releaseVersion: processVariables?.releaseVersion || '',
    purchaseOrgs,
    vendorPurchasingCheck: processVariables?.vendorPurchasingCheck || false,
    vendorInvoicingCheck: processVariables?.vendorInvoicingCheck || false
  }

  return processVariablesObj
}

export function parseSelection (data: any): Selection {
  return {
    brands: (data?.brands || []) as string[],
    businessUnits: data?.businessUnits || [],
    categories: data?.categories || [],
    isNewPartner: data?.isNewPartner || false,
    partnerLevels: data?.partnerLevels || [],
    partnerRegions: data?.partnerRegions || [],
    projectLevels: data?.projectLevels || [],
    regions: data?.regions || [],
    requester: mapUserId(data?.requester),
    spendBucket: data?.spendBucket || 0
  }
}

export function mapRequestDefintion (data: any) : RequestDefintion {
  return {
    tenantId: data?.tenantId || '',
    name: data?.name || '',
    type: data?.type || '',
    shortDescription: data?.shortDescription || '',
    icon: data?.icon || '',
    requestName: data?.requestName || ''
  }
}

export function mapPublishedRequestDefinition (data: any): PublishedRequestDefintion {
  return {
    requestDefinition: mapRequestDefintion(data?.requestDefinition)
  }
}

export function mapRequestDefinationsList (requestList: Array<PublishedRequestDefintion>) : Array<PublishedRequestDefintion> {
  return Array.isArray(requestList) ? requestList.map(mapPublishedRequestDefinition) : []
}
