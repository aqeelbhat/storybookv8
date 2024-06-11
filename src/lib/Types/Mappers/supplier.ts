import { mapSupplierSearchSummary } from "../..";
import { DocumentCount, DocumentSummary, LegalDocumentSummary, Summary, Supplier, SupplierUserId, Assessment, AssessmentPartyType, FormDefinitionId, AssessmentRisk, FormGlobalVal, SupplierRecommendation, AssessmentRef } from "../supplier";
import { mapAddress, mapAttachment, mapContact, mapIDRef, parseDocument, mapMoney, mapUserId, mapNote } from "./common";
import { mapLegalEntity, mapLegalEntityRef } from "./legalEntity";
import { mapRiskScore } from "./request";
import { mapDimension, mapNormalizedVendor, mapVendorRef } from "./vendor";

export function mapSupplierUserId (data: any): SupplierUserId {
  return {
    id: data?.id || '',
    name: data?.name || '',
    vendorId: data?.vendorId || ''
  }
}

export function mapSupplier (data: any): Supplier {
  return {
    supplierName: data?.supplierName || '',
    contactName: data?.contactName || '',
    contactNote: data?.contactNote || '',
    email: data?.email || '',
    phoneNumber: data?.phoneNumber,
    vendorId: data?.vendorId || '',
    website: data?.website || '',
    duns: data?.duns || '',
    isParent: data?.isParent || false,
    legalEntity: mapLegalEntity(data?.legalEntity),
    address: mapAddress(data?.address),
    contract: mapAttachment(data?.contract),
    msa: data?.msa ? mapAttachment(data?.msa) : null,
    nda: data?.nda ? mapAttachment(data?.nda) : null,
    msaInFile: data?.msaInFile || false,
    ndaInFile: data?.ndaInFile || false,
    selectedVendorRecord: data?.selectedVendorRecord ? mapVendorRef(data?.selectedVendorRecord) : null,
    vendorRecords: Array.isArray(data?.vendorRecords) && data?.vendorRecords?.length > 0 ? data?.vendorRecords.map(mapVendorRef) : [],
    proposal: mapAttachment(data?.proposal),
    contact: data?.contact ? mapContact(data?.contact) : null,
    activationStatus: data?.activationStatus || '',
    newSupplier: data?.newSupplier || false,
    newSupplierMessage: data?.newSupplierMessage || '',
    // crmID: data?.crmID || '',
    allowMultiple: data?.allowMultiple || false,
    requireSelection: data?.requireSelection || false,
    supplierStatus: data?.supplierStatus || '',
    isIndividual: data?.isIndividual || false,
    companyName: data?.companyName || '',
    createNewVendor: data?.createNewVendor || false,
    potentialMatches: Array.isArray(data?.potentialMatches) && data?.potentialMatches?.length > 0 ? data?.potentialMatches.map(mapLegalEntityRef) : [],
    potentialMatchIgnore: data?.potentialMatchIgnore || false,
    shareHolders: Array.isArray(data?.shareHolders) && data?.shareHolders?.length > 0 ? data?.shareHolders.map(mapContact) : [],
    subsidiaries: Array.isArray(data?.subsidiaries) && data?.subsidiaries?.length > 0 ? data?.subsidiaries.map(mapContact) : [],
    subcontractors: Array.isArray(data?.subcontractors) && data?.subcontractors?.length > 0 ? data?.subcontractors.map(mapContact) : [],
    boardOfDirectors: Array.isArray(data?.boardOfDirectors) && data?.boardOfDirectors?.length > 0 ? data?.boardOfDirectors.map(mapContact) : [],
    refId: data?.refId || '',
    ein: data?.ein || '',
    tin: data?.tin || '',
    vat: data?.vat || '',
    tinCountryCode: data?.tinCountryCode || '',
    vatCountryCode: data?.vatCountryCode || '',
    supplierSelectionText: data?.supplierSelectionText || '',
    potentialMatchesSupplierSummary: Array.isArray(data?.potentialMatchesSupplierSummary) && data?.potentialMatchesSupplierSummary?.length > 0 ? data?.potentialMatchesSupplierSummary.map(mapSupplierSearchSummary) : []
  }
}

export function mapSupplierRecommedations (data: SupplierRecommendation): SupplierRecommendation {
  return {
    count: data?.count || 0,
    suggestions: data.suggestions ? data.suggestions.map(mapNormalizedVendor) : [],
    leSuggestions: data.leSuggestions ? data.leSuggestions.map(mapLegalEntity) : []
  }
}

export function mapSummary (data: any): Summary {
  return {
    count: data.count || 0,
    firsDocumentSummary: data.firsDocumentSummary ? parseDocument(data.firsDocumentSummary): null
  }
}

export function mapLegalSummary (data: any): LegalDocumentSummary {
  return {
    nda: data.nda ? mapSummary(data.nda) : null,
    dpa: data.dpa ? mapSummary(data.dpa) : null,
    msa: data.msa ? mapSummary(data.msa) : null,
    contract: data.contract ? mapSummary(data.contract) : null,
  }
}

export function mapDocumentCount (data: any): DocumentCount {
  return {
    type: data.type ? mapIDRef(data.type) : null,
    count: data.count ? data.count : 0
  }
}

export function mapDocumentSummary (data: any): DocumentSummary {
 return {
    documentCounts: data.documentCounts ? data.documentCounts.map(mapDocumentCount) : [],
    all: data.all || 0
 }
}

export function mapFormDefinationId (data: any): FormDefinitionId {
  return {
    app: data?.app || '',
    form: data?.form || '',
    formVersion: data?.formVersion || 0
  }
}

export function mapFormGlobalVal (data: any): FormGlobalVal {
  return {
    id: data?.id || '',
    name: data?.name || '',
    reportName: data?.reportName || '',
    fieldId: data?.fieldId || 0,
    formDefinitionId: mapFormDefinationId(data?.formDefinitionId),
    booleanVal: data?.booleanVal || false,
    numberVal: data?.numberVal || 0,
    dateVal: data?.dateVal || '',
    moneyVal: mapMoney(data?.moneyVal),
    stringVal: data?.stringVal || '',
    idRef: mapIDRef(data?.idRef),
    addressVal: mapAddress(data?.addressVal),
    userVal: mapUserId(data?.userVal),
    contactVal: mapContact(data?.contactVal),
    displayValue: data?.displayValue || '',
    stringValues: data?.stringValues || '',
    idRefs: Array.isArray(data?.idRefs) ? data?.idRefs.map(mapIDRef) : [],
    userVals: Array.isArray(data?.userVals) ? data?.userVals.map(mapUserId) : [],
    fieldGrouping: mapIDRef(data?.fieldGrouping),
    assessmentRisk: mapAssessmentRisk(data?.assessmentRisk)
  }
}

export function mapAssessmentRisk (data: any): AssessmentRisk {
  return {
    riskType: mapIDRef(data?.riskType),
    riskScore: mapRiskScore(data?.riskScore),
    assessment: data?.assessment || ''
  }
}

export function mapAssessmentRef (data: any ): AssessmentRef {
  return {
    ref: mapIDRef(data?.ref),
    engagementRef: mapIDRef(data?.engagementRef),
    expiration: data?.expiration || '',
    completed: data?.completed || ''
  }
}

export function mapAssessmentRefList (data: any ): Array<AssessmentRef> {
  return Array.isArray(data) && data?.map(mapAssessmentRef)
}

export function mapAssessment (data: any): Assessment {
  return {
    id: data?.id || '',
    assessmentId: data?.assessmentId || '',
    name: data?.name || '',
    type: data?.type ? mapIDRef(data.type): null,
    requester: data?.requester ? mapUserId(data.requester) : null,
    expiration: data?.expiration || '',
    created: data?.created || '',
    completed: data?.completed || '',
    dimension : data?.dimension ? mapDimension(data?.dimension) : null,
    partyType: data?.partyType ? AssessmentPartyType[data.partyType] : null,
    tenantId: data?.tenantId || '',
    normalizedVendor: mapIDRef(data?.normalizedVendor),
    engagementRef: mapIDRef(data?.engagementRef),
    souceURL: data?.souceURL || '',
    attachment: data.attachment ? mapAttachment(data.attachment) : null,
    assessors: Array.isArray(data?.assessors) ? data.assessors.map(mapUserId) : [],
    status: data?.status || '',
    scopeForm: data?.scopeForm ? mapFormDefinationId(data.scopeForm) : null,
    resultForm: data?.resultForm ? mapFormDefinationId(data.resultForm) : null,
    risk: data?.risk ? mapAssessmentRisk(data.risk) : null,
    assessmentAttributes: Array.isArray(data?.assessmentAttributes) ? data.assessmentAttributes.map(mapFormGlobalVal) : [],
    resultAttributes: Array.isArray(data?.resultAttributes) ? data.resultAttributes.map(mapFormGlobalVal) : [],
    resultFormId: data?.resultFormId || '',
    scopeFormId: data?.scopeFormId || '',
    departments: Array.isArray(data?.departments) ? data?.departments.map(mapIDRef) : [],
    companyEntities: Array.isArray(data?.companyEntities) ? data?.companyEntities.map(mapIDRef) : [],
    noteObjects: Array.isArray(data?.noteObjects) ? data?.noteObjects.map(mapNote) : [],
    engagementSummary: data?.engagementSummary || '',
    previous: data?.previous ? mapAssessmentRef(data?.previous) : null,
    renewals: data?.renewals?.length > 0 ? mapAssessmentRefList(data?.renewals) : [],
    runtimeStatus: data?.runtimeStatus || '',
    runtimeRenewalStatus: data?.runtimeRenewalStatus || '',
    renewedAssessment: data?.renewedAssessment ? mapAssessmentRef(data?.renewedAssessment) : null,
    renewalPendingAssessment: data?.renewalPendingAssessment ? mapAssessmentRef(data?.renewalPendingAssessment) : null,
  }
}
