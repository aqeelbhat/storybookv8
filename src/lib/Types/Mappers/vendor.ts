import { Address, BankInfo, Contact, IDRef, Tax, UserId } from "../common"
import { FormGlobalVal, NumberSource, SupplierUserId } from "../supplier"
import { NormalizedVendorRef, VendorRef, Location, Vendor, Classification, NormalizedVendor, OroTeamMember, SupplierDimension, SegmentationDetail, SupplierSegmentation, DiversityCertificate, CertificateType, Diversity, ServiceScore, ProviderScore, EngagementReference, VendorCompanyInfo, BlockStatuses, BaseQuestionnaireId, VendorPurchaseOrgInfo, AdditionalInfo, Partner, VendorIdentificationNumber, SpendDetails, TotalSpendRange, NVType, VendorAdditionalDetails, VendorProcureToPayStatus } from "../vendor"
import { mapAddress, mapAttachment, mapBankInfo, mapContact, mapIDRef, mapImage, mapSanctionMatchedEntity, mapTax, mapUserId } from "./common"
import { mapRiskScore } from "./request"
import { mapFormGlobalVal, mapSupplierUserId } from "./supplier"

export function mapVendorRef (vendorRef: any): VendorRef {
  const vendorRefObj: VendorRef = {
    id: vendorRef?.id || null,
    vendorId: vendorRef?.vendorId || '',
    enabled: vendorRef?.enabled || false,
    paymentTerm: mapIDRef(vendorRef?.paymentTerm),
    name: vendorRef?.name || '',
    additionalCompanyEntities: vendorRef?.additionalCompanyEntities?.length > 0 ? vendorRef.additionalCompanyEntities.map(mapIDRef) : [],
    companyEntityRef: mapIDRef(vendorRef?.companyEntityRef),
    currencies: vendorRef?.currencies && vendorRef?.currencies?.length > 0 ? vendorRef.currencies : [],
    enabledSystems: vendorRef?.enabledSystems?.length > 0 ? vendorRef.enabledSystems.map(mapIDRef) : [],
    purchasingEntities: vendorRef?.purchasingEntities?.length > 0 ? vendorRef.purchasingEntities.map(mapIDRef) : []
  }

  return vendorRefObj
}

export function mapNormalizedVendorRef (normalizedVendorRef: any): NormalizedVendorRef {
  const normalizedVendorRefObj = {
    id: normalizedVendorRef ? normalizedVendorRef.id : '',
    vendorRecordId: normalizedVendorRef ? normalizedVendorRef.vendorRecordId : '',
    name: normalizedVendorRef ? normalizedVendorRef.name : '',
    countryCode: normalizedVendorRef ? normalizedVendorRef.countryCode : '',
    legalEntityId: normalizedVendorRef ? normalizedVendorRef.legalEntityId : '',
    legalEntityLogo: normalizedVendorRef ? mapImage(normalizedVendorRef.legalEntityLogo) : mapImage(null),
    contact: normalizedVendorRef?.contact ? mapContact(normalizedVendorRef?.contact) : undefined,
    activationStatus: normalizedVendorRef?.activationStatus || null,
    invoicingEnabled: normalizedVendorRef?.invoicingEnabled,
    purchasingEnabled: normalizedVendorRef?.purchasingEnabled,
    selectedVendorRecord: normalizedVendorRef?.selectedVendorRecord ? mapVendorRef(normalizedVendorRef?.selectedVendorRecord) : undefined,
    vendorRecords: normalizedVendorRef?.vendorRecords ? normalizedVendorRef.vendorRecords.map(mapVendorRef) : [],
    isIndividual: normalizedVendorRef?.isIndividual || false,
    shareHolders: Array.isArray(normalizedVendorRef?.shareHolders) && normalizedVendorRef?.shareHolders?.length > 0 ? normalizedVendorRef?.shareHolders.map(mapContact) : [],
    subsidiaries: Array.isArray(normalizedVendorRef?.subsidiaries) && normalizedVendorRef?.subsidiaries?.length > 0 ? normalizedVendorRef?.subsidiaries.map(mapContact) : [],
    subcontractors: Array.isArray(normalizedVendorRef?.subcontractors) && normalizedVendorRef?.subcontractors?.length > 0 ? normalizedVendorRef?.subcontractors.map(mapContact) : [],
    boardOfDirectors: Array.isArray(normalizedVendorRef?.boardOfDirectors) && normalizedVendorRef?.boardOfDirectors?.length > 0 ? normalizedVendorRef?.boardOfDirectors.map(mapContact) : [],
    sanctionList: Array.isArray(normalizedVendorRef?.sanctionList) && normalizedVendorRef?.sanctionList?.length > 0 ? normalizedVendorRef?.sanctionList.map(mapSanctionMatchedEntity) : [],
    members: Array.isArray(normalizedVendorRef?.members) && normalizedVendorRef?.members?.length > 0 ? normalizedVendorRef?.members.map(mapContact) : [],
    ein: normalizedVendorRef?.ein || '',
    tin: normalizedVendorRef?.tin || '',
    vat: normalizedVendorRef?.vat || '',
    tinCountryCode: normalizedVendorRef?.tinCountryCode || '',
    vatCountryCode: normalizedVendorRef?.vatCountryCode || '',
    refId: normalizedVendorRef?.refId || '',
    vendorProcureToPayStatus: normalizedVendorRef?.vendorProcureToPayStatus ? mapVendorProcureToPayStatus(normalizedVendorRef?.vendorProcureToPayStatus) : undefined
  }

  return normalizedVendorRefObj
}

export function mapVendorProcureToPayStatus (data: any): VendorProcureToPayStatus {
  return {
    purchasingEntityMatchStatus: data?.purchasingEntityMatchStatus || null,
    companyEntityMatchStatus: data?.companyEntityMatchStatus || null,
    matchedCompanyEntities: Array.isArray(data?.matchedCompanyEntities) && data?.matchedCompanyEntities?.length > 0 ? data?.matchedCompanyEntities.map(mapIDRef) : [],
    unmatchedCompanyEntities: Array.isArray(data?.unmatchedCompanyEntities) && data?.unmatchedCompanyEntities?.length > 0 ? data?.unmatchedCompanyEntities.map(mapIDRef) : [],
    matchedPurchasingEntities: Array.isArray(data?.matchedPurchasingEntities) && data?.matchedPurchasingEntities?.length > 0 ? data?.matchedPurchasingEntities.map(mapIDRef) : [],
    unmatchedPurchasingEntities: Array.isArray(data?.unmatchedPurchasingEntities) && data?.unmatchedPurchasingEntities?.length > 0 ? data?.unmatchedPurchasingEntities.map(mapIDRef) : [],
    blockedCompanyEntities: Array.isArray(data?.blockedCompanyEntities) && data?.blockedCompanyEntities?.length > 0 ? data?.blockedCompanyEntities.map(mapIDRef) : [],
    blockedPurchasingEntities: Array.isArray(data?.blockedPurchasingEntities) && data?.blockedPurchasingEntities?.length > 0 ? data?.blockedPurchasingEntities.map(mapIDRef) : []
  }
}

export function mapLocation (data: any): Location {
  const banks: Array<BankInfo> = data?.banks ? data?.banks.map(mapBankInfo) : []
  const contacts: Array<Contact> = data?.contacts ? data?.contacts.map(mapContact) : []
  const taxes: Array<Tax> = data?.taxes ? data?.taxes.map(mapTax) : []
  return {
    id: data?.id || '',
    address: data?.address ? mapAddress(data?.address) : mapAddress(''),
    banks,
    contacts,
    taxes,
    billing: data?.billing || false,
    billingDefault: data?.billingDefault || false,
    shipping: data?.shipping || false,
    shippingDefault: data?.shippingDefault || false,
    externalId: data?.externalId || ''
  }
}

export function mapBaseQuestionnaireId (data: any): BaseQuestionnaireId {
  return {
    name: data?.name || '',
    id: data?.id || '',
    formId: data?.formId || '',
    custom: data?.custom || false
  }
}

export function mapPartners (data: any): Partner {
  return {
    function: mapIDRef(data?.function),
    ref: data?.ref ? mapVendorRef(data?.ref) : null
  }
}

export function mapVendorCompanyInfo (data: any): VendorCompanyInfo {
  const companyCode: IDRef = mapIDRef(data?.companyCode)
  const bankAccounts: Array<BankInfo> = data?.bankAccounts ? data?.bankAccounts.map(mapBankInfo) : []
  const taxes: Array<Tax> = data?.taxes ? data?.taxes.map(mapTax) : []
  const currencies: Array<string> = data?.currencies && data?.currencies?.length > 0 ? data?.currencies : []
  const paymentTerm: IDRef = mapIDRef(data?.paymentTerm)
  const blockStatuses: Array<BlockStatuses> = data?.blockStatuses && data?.blockStatuses?.length > 0 ? data.blockStatuses : []
  const questionnaireId: BaseQuestionnaireId = mapBaseQuestionnaireId(data?.questionnaireId)
  const formGlobalVals: FormGlobalVal = mapFormGlobalVal(data?.formGlobalVals)
  const accountCode: IDRef = mapIDRef(data?.accountCode)
  const alternatePayees: Array<VendorRef> = data?.alternatePayees && data?.alternatePayees?.length ? data.alternatePayees.map(mapVendorRef) : []
  return {
    companyCode,
    bankAccounts,
    taxes,
    currencies,
    paymentTerm,
    blockStatuses,
    questionnaireId,
    formGlobalVals,
    accountCode,
    alternatePayees
  }
}

export function mapVendorPurchaseOrgInfo (data: any): VendorPurchaseOrgInfo {
  const purchaseOrg: IDRef = mapIDRef(data?.purchaseOrg)
  const bankAccounts: Array<BankInfo> = data?.bankAccounts ? data?.bankAccounts.map(mapBankInfo) : []
  const taxes: Array<Tax> = data?.taxes ? data?.taxes.map(mapTax) : []
  const currencies: Array<string> = data?.currencies && data?.currencies?.length > 0 ? data?.currencies : []
  const paymentTerm: IDRef = mapIDRef(data?.paymentTerm)
  const blockStatuses: Array<BlockStatuses> = data?.blockStatuses && data?.blockStatuses?.length > 0 ? data.blockStatuses : []
  const questionnaireId: BaseQuestionnaireId = mapBaseQuestionnaireId(data?.questionnaireId)
  const formGlobalVals: FormGlobalVal = mapFormGlobalVal(data?.formGlobalVals)
  const incoTerms: Array<IDRef> = data?.incoTerms && data?.incoTerms?.length > 0 ? data.incoTerms.map(mapIDRef) : []
  const partners: Array<Partner> = data?.partners && data?.partners?.length > 0 ? data.partners.map(mapPartners) : []
  return {
    purchaseOrg,
    bankAccounts,
    taxes,
    currencies,
    paymentTerm,
    blockStatuses,
    questionnaireId,
    formGlobalVals,
    incoTerms,
    partners
  }
}

export function mapVendorIdentificationNumbers (data: any): VendorIdentificationNumber {
  return {
    identificationType: mapIDRef(data?.identificationType),
    identificationNumber: data?.identificationNumber || '',
    description: data?.description || '',
    validityStartDate: data?.validityStartDate || '',
    validityEndDate: data?.validityEndDate || '',
    country: mapIDRef(data?.country),
    region: mapIDRef(data?.region),
  }
}

export function mapVendor (data: any): Vendor {
  const bankAccounts: Array<BankInfo> = data?.bankAccounts ? data?.bankAccounts.map(mapBankInfo) : []
  const contacts: Array<Contact> = data?.contacts ? data?.contacts.map(mapContact) : []
  const taxes: Array<Tax> = data?.taxes ? data?.taxes.map(mapTax) : []
  const locations: Array<Location> = data?.locations ? data?.locations.map(mapLocation) : []
  const blockStatuses: Array<BlockStatuses> = data?.blockStatuses && data?.blockStatuses?.length > 0 ? data.blockStatuses : []
  return {
    approved: data?.approved || false,
    id: data?.id || '',
    legalEntityId: data?.legalEntityId || '',
    name: data?.name || '',
    name2: data?.name2 || '',
    tenantId: data?.tenantId || '',
    website: data?.website || '',
    email: data?.email || '',
    phone: data?.phone || '',
    fax: data?.fax || '',
    tax1099: data?.tax1099 || false,
    bankAccounts,
    contacts,
    location: data?.location ? mapLocation(data.location) : mapLocation(''),
    locations,
    sites: data?.sites,
    taxes,
    hasNda: data?.hasNda,
    hasMsa: data?.hasMsa,
    vendorRecords: data?.vendorRecords?.map(mapVendor) || [],
    companyEntityRef: mapIDRef(data?.companyEntityRef),
    currencyRefs: data?.currencyRefs?.length > 0 ? data?.currencyRefs?.map(mapIDRef) : [],
    additionalCompanyEntities: data?.additionalCompanyEntities?.map(mapIDRef) || [],
    enabled: data?.enabled || false,
    commonName: data?.commonName || '',
    duns: data?.duns || '',
    terms: {
      id: data?.terms?.id || '',
      invoiceTermRef: mapIDRef(data?.terms?.invoiceTermsRef),
      paymentTermRef: mapIDRef(data?.terms?.paymentTermsRef)
    },
    vendorId: data?.vendorId || '',
    vendorType: data?.vendorType || '',
    currencies: data?.currencies && data?.currencies?.length > 0 ? data?.currencies : [],
    vendorCompanyInfos: data?.vendorCompanyInfos ? data?.vendorCompanyInfos?.map(mapVendorCompanyInfo) : [],
    vendorPurchaseOrgInfo: data?.vendorPurchaseOrgInfo ? data?.vendorPurchaseOrgInfo?.map(mapVendorPurchaseOrgInfo) : [],
    vendorIdentificationNumbers: data?.vendorIdentificationNumbers?.length > 0 ? data?.vendorIdentificationNumbers?.map(mapVendorIdentificationNumbers) : [],
    expenseAccount: mapIDRef(data?.expenseAccount),
    payableAccount: mapIDRef(data?.payableAccount),
    note: data?.note || '',
    enabledSystems: data?.enabledSystems?.length > 0 ? data?.enabledSystems?.map(mapIDRef) : [],
    questionnaireId: data?.questionnaireId ? mapBaseQuestionnaireId(data?.questionnaireId) : undefined,
    formGlobalVals: data?.formGlobalVals?.length > 0 ? data?.formGlobalVals?.map(mapFormGlobalVal) : [],
    classificationRef: mapIDRef(data?.classificationRef),
    highlighters: data?.highlighters ? data?.highlighters : undefined,
    companyName: data?.companyName || '',
    normalizedId: data?.normalizedId || '',
    legalEntityLogo: data?.legalEntityLogo ? mapImage(data.legalEntityLogo) : undefined,
    blockStatuses
  }
}

export function mapClassification (data: any): Classification {
  const internalContacts: Array<UserId> = data?.internalContacts ? data?.internalContacts.map(mapUserId) : []
  const contacts: Array<SupplierUserId> = data?.contacts ? data?.contacts.map(mapSupplierUserId) : []
  return {
    category: data?.category || '',
    preferredStatus: data?.preferredStatus || '',
    description: data?.description || '',
    internalContacts,
    contacts
  }
}

export function mapTeam (data: any): OroTeamMember {
  return {
      user: data.user,
      role: data.role
  }
}

export function mapDimension (data: any): SupplierDimension {
  return {
    programs: data?.programs && Array.isArray(data.programs) ? data.programs.map(mapIDRef) : [],
    regions: data?.regions && Array.isArray(data.regions) ? data.regions.map(mapIDRef) : [],
    categories: data?.categories && Array.isArray(data.categories) ? data.categories.map(mapIDRef) : [],
    products: data?.products && Array.isArray(data.products) ? data.products.map(mapIDRef) : [],
    productStages: data?.productStages && Array.isArray(data.productStages) ? data.productStages.map(mapIDRef) : [],
    sites: data?.sites && Array.isArray(data.sites) ? data.sites.map(mapIDRef) : [],
    departments: data?.departments && Array.isArray(data.departments) ? data.departments.map(mapIDRef) : [],
    companyEntities: data?.companyEntities && Array.isArray(data.companyEntities) ? data.companyEntities.map(mapIDRef) : []
  }
}

export function mapSegmentation (data: any): SegmentationDetail {
  return {
    id: data.id ? data.id : null,
    name: data.name ? data.name : '',
    dimension : data.dimension ? mapDimension(data.dimension) : null,
    segmentation: data.segmentation ? SupplierSegmentation[data.segmentation] : null,
    description: data.description ? data.description : '',
    latestUse: data?.latestUse ? mapEngagementReference(data?.latestUse) : null
  }
}

export function mapEngagementReference (data: any): EngagementReference {
  return {
    categories: data?.categories && data.categories.length > 0 ? data.categories?.map(mapIDRef) : [],
    engagementReference: data?.engagementReference ? mapIDRef(data?.engagementReference) : null,
    engagementTime: data?.engagementTime || '',
    requester: data?.requester ? mapUserId(data?.requester) : null,
    processId: data?.processId || '',
    engagementStatus: data?.engagementStatus || null,
    infos: data?.infos ? mapAdditionalInfo(data?.infos) : null
  }
}

export function mapAdditionalInfo (data: any): AdditionalInfo {
  return {
    type: data?.type || '',
    refs: data?.refs && data.refs.length > 0 ? data.refs?.map(mapIDRef) : [],
    countryCodes: data?.countryCodes || []
  }
}

function mapCompanySize(data: any): NumberSource {
  return {
    value: Number(data.numEmployees) || 0,
    source: data.source || null
  }
}

export function mapDiversity (data: any): Diversity {
  return {
    ownershipType: data?.ownership || '',
    alpha2CountryCode: data?.alpha2CountryCode || '',
    authority: data?.authority || '',
    type: data?.type || '',
    code: data?.code || ''
  }
}

export function mapDiversityCertificate(data: any): DiversityCertificate {
  return {
    expiration: data?.expiration || '',
    certificateType: data?.certificateType ? CertificateType[data.certificateType] : null,
    diversity: mapDiversity(data?.diversity),
    references: data?.references || []
  }
}

export function mapProviderScore(data: any): ProviderScore {
  return {
    issuer: data?.issuer || '',
    subjectName: data?.subjectName || '',
    scores: data?.scores && data?.scores.length > 0 ? data.scores.map(mapServiceScore) : []
  }
}

export function mapServiceScore(data: any): ServiceScore {
  return {
    serviceName: data?.serviceName || '',
    minScore: data?.minScore || 0,
    maxScore: data?.maxScore || 0,
    displayName: data?.displayName || '',
    riskScore: mapRiskScore(data?.riskScore)
  }
}

export function mapSpendDetails (data: any): SpendDetails {
  return {
    poCount: data?.poCount || 0,
    invoiceCount: data?.invoiceCount || 0,
    spendRange: data?.spendRange ? TotalSpendRange[data.spendRange] : null
  }
}

function mapVendorAdditionalDetails(params: VendorAdditionalDetails): VendorAdditionalDetails {
  const taxes: Array<Tax> = params?.taxes ? params?.taxes.map(mapTax) : []
  const vendorAddresses: Array<Address> = params?.vendorAddresses ? params?.vendorAddresses.map(mapAddress) : []
  return {
    taxes,
    vendorAddresses,
    blockStatuses: params?.blockStatuses && params?.blockStatuses?.length > 0 ? params.blockStatuses : []
  }
}

export function mapNormalizedVendor (data: any): NormalizedVendor {
  const categories: Array<Classification> = data?.categories ? data?.categories.map(mapClassification) : []
  const products: Array<Classification> = data?.categories ? data?.categories.map(mapClassification) : []
  const services: Array<Classification> = data?.categories ? data?.categories.map(mapClassification) : []
  const members: Array<OroTeamMember> = data?.members ? data?.members.map(mapTeam) : []
  const taxes: Array<Tax> = data?.taxes ? data?.taxes.map(mapTax) : []
  return {
    id: data?.id || '',
    legalEntityId: data?.legalEntityId || '',
    vendorAdditionalDetails: mapVendorAdditionalDetails(data?.vendorAdditionalDetails),
    commonName: data?.commonName || '',
    website: data?.website || '',
    hasNda: data?.hasNda || false,
    hasMsa: data?.hasMsa || false,
    hasDpa: data?.hasDpa || false,
    hasCda: data?.hasCda || false,
    highlighters: data?.highlighters ? data?.highlighters : undefined,
    ndaExpiration: data?.ndaExpiration || '',
    msaExpiration: data?.msaExpiration || '',
    dpaExpiration: data?.dpaExpiration || '',
    cdaExpiration: data?.cdaExpiration || '',
    vendorRecords: data?.vendorRecords?.map(mapVendor) || [],
    address: data?.address ? mapAddress(data?.address) : null,
    description: data?.description || '',
    duns: data?.duns || '',
    ein: data?.ein || '',
    email: data?.email || '',
    guidelines: data?.guidelines || '',
    legalName: data?.legalName || '',
    msa: data?.msa ? mapAttachment(data?.msa) : null,
    nda: data?.nda ? mapAttachment(data?.nda) : null,
    cda: data?.cda ? mapAttachment(data?.cda) : null,
    dpa: data?.dpa ? mapAttachment(data?.dpa) : null,
    isSensitive: data?.isSensitive || false,
    orgId: data?.orgId || '',
    isParent: data?.isParent || false,
    type: data?.type ? NVType[data.type] : undefined,
    phone: data?.phone || '',
    regId: data?.regId || '',
    tin: data?.tin || '',
    vat: data?.vat || '',
    tinCountryCode: data?.tinCountryCode || '',
    vatCountryCode: data?.vatCountryCode || '',
    vatIssuer: data?.vatIssuer || '',
    categories,
    products,
    services,
    activationStatus: data?.activationStatus || '',
    logo: data?.logo ? mapImage(data.logo) : mapImage(null),
    members,
    segmentations: data?.segmentations ? data.segmentations.map(mapSegmentation) : [],
    industryCode: data.industryCode || '',
    companySize: data.companySize ? data.companySize : null,
    annualRevenue: data.annualRevenue ? data.annualRevenue : null,
    vendorRecordRefs: data?.vendorRecordRefs ? data?.vendorRecordRefs.map(mapVendorRef) : [],
    supplierStatus: data?.suppierStatus ? SupplierSegmentation[data?.suppierStatus] : '',
    statusComment: data?.statusComment || '',
    individual: data?.individual || false,
    companyName: data?.companyName || '',
    diversities: data?.diversities && data.diversities?.length > 0 ? data?.diversities.map(mapDiversityCertificate) : [],
    providerScores: data?.providerScores && data?.providerScores.length > 0 ? data?.providerScores.map(mapProviderScore) : [],
    parent: mapIDRef(data?.parent),
    shareHolders: Array.isArray(data?.shareHolders) && data?.shareHolders?.length > 0 ? data?.shareHolders.map(mapContact) : [],
    subsidiaries: Array.isArray(data?.subsidiaries) && data?.subsidiaries?.length > 0 ? data?.subsidiaries.map(mapContact) : [],
    subcontractors: Array.isArray(data?.subcontractors) && data?.subcontractors?.length > 0 ? data?.subcontractors.map(mapContact) : [],
    boardOfDirectors: Array.isArray(data?.boardOfDirectors) && data?.boardOfDirectors?.length > 0 ? data?.boardOfDirectors.map(mapContact) : [],
    spendDetails: data?.spendDetails ? mapSpendDetails(data?.spendDetails) : null,
    taxes
  }
}

export function mapSupplierToNormalizedVendor (data: any): NormalizedVendor {
  const members: Array<OroTeamMember> = data?.members ? data?.members.map(mapTeam) : []
  return {
    id: data?.id || '',
    legalEntityId: data?.legalEntityId || '',
    commonName: data?.commonName || '',
    website: data?.website || '',
    hasNda: data?.hasNda || false,
    hasMsa: data?.hasMsa || false,
    vendorRecords: data?.vendorRecords?.map(mapVendor) || [],
    address: data?.address ? mapAddress(data?.address) : null,
    description: data?.description || '',
    email: data?.email || '',
    legalName: data?.legalName || '',
    msa: data?.msa ? mapAttachment(data?.msa) : null,
    nda: data?.nda ? mapAttachment(data?.nda) : null,
    cda: data?.cda ? mapAttachment(data?.cda) : null,
    dpa: data?.dpa ? mapAttachment(data?.dpa) : null,
    phone: data?.phone || '',
    regId: data?.regId || '',
    ein: data?.ein || '',
    vat: data?.vat || '',
    tin: data?.tin || '',
    tinCountryCode: data?.tinCountryCode || '',
    vatCountryCode: data?.vatCountryCode || '',
    logo: data?.logo ? mapImage(data.logo) : mapImage(null),
    members,
    segmentations: data?.segmentations ? data.segmentations.map(mapSegmentation) : [],
    industryCode: data.industryCode || '',
    companySize: data.numEmployees ? mapCompanySize(data) : null,
    annualRevenue: data.annualRevenue ? data.annualRevenue : null,
    hasDpa: data?.hasDpa || false,
    hasCda: data?.hasCda || false,
    ndaExpiration: data?.ndaExpiration || '',
    msaExpiration: data?.msaExpiration || '',
    dpaExpiration: data?.dpaExpiration || '',
    cdaExpiration: data?.cdaExpiration || '',
    diversities: data?.diversities && data.diversities?.length > 0 ? data?.diversities.map(mapDiversityCertificate) : [],
    providerScores: data?.providerScores && data?.providerScores.length > 0 ? data?.providerScores.map(mapProviderScore) : [],
    spendDetails: data?.spendDetails ? mapSpendDetails(data?.spendDetails) : null
  }
}
