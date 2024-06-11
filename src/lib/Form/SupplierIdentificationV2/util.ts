import { Contact, Image, LegalEntity, NormalizedVendor, Option, SupplierDetail, SupplierInputForm, SupplierSearchSummary, Vendor, VendorPurchaseOrgInfo, VendorRef, mapAddress, mapAlpha2codeToDisplayName, mapImageMetadata, mapStringToOption, mapVendor } from "../.."
import { ActivationStatus, Address, LegalEntityRef, ProcessVariables, Supplier, mapNormalizedVendor } from "../../Types"
import { VendorProcureToPayStatus } from "../../Types/vendor"
import { EnumsDataObject } from "../types"
import { getTaxKeyNameForKey } from "../util"

export function getSupplierActivationStatus(vendor: Supplier, processVariables?: ProcessVariables): ActivationStatus {
  const partner = processVariables?.partners.find(partner => partner.id === vendor.vendorId || partner.refId === vendor.refId)
  return partner ? partner.activationStatus : ActivationStatus.newSupplier
}

export function getVendorProcureToPayStatus(vendor: Supplier, processVariables?: ProcessVariables): VendorProcureToPayStatus {
  const partner = processVariables?.partners.find(partner => partner.id === vendor.vendorId || partner.refId === vendor.refId)
  return partner ? partner.vendorProcureToPayStatus : undefined
}

export function mapSupplierSearchSummary(params: any): SupplierSearchSummary {
  const vendors: Array<Vendor> = params?.vendors ? params?.vendors.map(mapVendor) : []
  const normalizedVendors: Array<NormalizedVendor> = params?.normalizedVendors ? params?.normalizedVendors.map(mapNormalizedVendor) : []
  const logo: Image = {
    metadata: params?.logo?.metadata ? params.logo.metadata.map(mapImageMetadata) : []
  }
  return {
    vendors,
    normalizedVendors,
    legalEntityId: params.legalEntityId || '',
    logo,
    website: params?.website || '',
    commonName: params?.commonName || '',
    address: params.address ? mapAddress(params.address) : undefined,
    id: params?.id || null
  }
}

export function mapSupplierSearchSummaries(params: any): Array<SupplierSearchSummary> {
  return params && Array.isArray(params) ? params.map(mapSupplierSearchSummary) : []
}

export function parseVendorToVendorRef(vendor: Vendor): VendorRef {
  return {
    additionalCompanyEntities: vendor?.additionalCompanyEntities,
    companyEntityRef: vendor?.companyEntityRef,
    enabled: vendor?.enabled,
    id: vendor?.id,
    name: vendor?.name,
    paymentTerm: vendor?.terms?.paymentTermRef,
    vendorId: vendor?.vendorId,
    currencies: vendor?.currencies || [],
    enabledSystems: vendor?.enabledSystems || [],
    purchasingEntities: vendor?.vendorPurchaseOrgInfo && vendor.vendorPurchaseOrgInfo?.length > 0 ? vendor.vendorPurchaseOrgInfo.map(org => org.purchaseOrg) : []
  }
}

export function parseNVToSupplierV2(
  vendor: NormalizedVendor | null,
  duplicateSuppliers?: SupplierSearchSummary[],
  ignoreDuplicates?: boolean,
  primaryContact?: Contact,
  processVariables?: ProcessVariables,
  isParent?: boolean
): Supplier {
  return {
    supplierName: vendor?.commonName || '',
    // address: vendor?.address ? vendor.address : null,
    address: processVariables?.purchaseOrgs && processVariables?.purchaseOrgs.length > 0 ? null : vendor?.address ? vendor.address : null,
    email: vendor?.email ? vendor.email : '',
    phoneNumber: vendor?.phone ? vendor.phone : '',
    website: vendor?.website ? vendor?.website : '',
    duns: vendor?.duns ? vendor?.duns : '',
    vendorId: vendor?.id || null,
    isParent,
    legalEntity: null,
    nda: vendor?.nda || null,
    msa: vendor?.msa || null,
    msaInFile: !!vendor?.msa,
    ndaInFile: !!vendor?.nda,
    supplierStatus: vendor?.supplierStatus || undefined,
    selectedVendorRecord: vendor?.vendorRecordRefs && vendor?.vendorRecordRefs?.length === 1 ? vendor?.vendorRecordRefs[0] : undefined,
    activationStatus: vendor?.activationStatus || ActivationStatus.newSupplier,
    isIndividual: vendor?.individual,
    companyName: vendor?.companyName,
    potentialMatchesSupplierSummary: duplicateSuppliers || [],
    potentialMatches: null,
    potentialMatchIgnore: ignoreDuplicates || null,
    ein: vendor?.ein || undefined,
    tin: vendor?.tin || undefined,
    vat: vendor?.vat || undefined,
    tinCountryCode: vendor?.tinCountryCode || undefined,
    vatCountryCode: vendor?.vatCountryCode || undefined,
    contact: primaryContact || undefined,
    vendorRecords: vendor?.vendorRecordRefs && vendor?.vendorRecordRefs?.length > 0 ? vendor?.vendorRecordRefs : []
  }
}

export function parseVendorToSupplier(
  vendor: Vendor | null,
  duplicateSuppliers?: SupplierSearchSummary[],
  ignoreDuplicates?: boolean,
  primaryContact?: Contact,
  processVariables?: ProcessVariables
): Supplier {
  return {
    supplierName: vendor?.name || '',
    // address: vendor?.locations && vendor?.locations.length > 0 ? vendor?.locations[0]?.address : null,
    address: processVariables?.purchaseOrgs && processVariables?.purchaseOrgs.length > 0 ? null : vendor?.locations && vendor?.locations.length > 0 ? vendor?.locations[0]?.address : null,
    email: vendor?.email,
    phoneNumber: vendor?.phone,
    website: vendor?.website,
    duns: vendor?.duns,
    vendorId: null,
    selectedVendorRecord: vendor ? parseVendorToVendorRef(vendor) : null,
    companyName: vendor?.companyName,
    potentialMatchesSupplierSummary: duplicateSuppliers || [],
    potentialMatches: null,
    potentialMatchIgnore: ignoreDuplicates || null,
    contact: primaryContact || undefined,
    vendorRecords: vendor.vendorRecords && vendor.vendorRecords.length > 0 ? vendor.vendorRecords.map(parseVendorToVendorRef) : []
  }
}

export function parseSearchSummaryToSupplierV2 (data: SupplierSearchSummary, isParent?: boolean): Supplier {
  return {
    supplierName: data?.commonName || '',
    vendorId: data?.id || null,
    address: data?.address ? data?.address : null,
    website: data?.website || '',
    potentialMatches: null,
    potentialMatchIgnore: null,
    isParent
  }
}

export function getConvertedAddresForDisplay(address: Address) {
  return [address.city || '', mapAlpha2codeToDisplayName(address.alpha2CountryCode) || ''].filter(Boolean).join(', ')
}

export function parseSupplierToSupplierInputForm(supplier: Supplier): SupplierInputForm {
  return {
    newSupplier: supplier?.newSupplier,
    name: supplier?.supplierName,
    website: supplier?.website,
    address: supplier?.address,
    contactName: supplier?.contact?.fullName,
    role: supplier?.contact?.role,
    email: supplier?.contact?.email,
    phone: supplier?.contact?.phone,
    duns: supplier?.duns,
    refId: supplier?.refId,
    designation: supplier?.contact?.designation,
    langCode: supplier?.langCode ? mapStringToOption(supplier?.langCode) : undefined,
    jurisdictionCountryCode: supplier?.jurisdictionCountryCode ? mapStringToOption(supplier?.jurisdictionCountryCode) : undefined,
    tax: supplier?.tax,
    indirectTax: supplier?.indirectTax
  }
}

function checkProperties (obj): boolean {
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== '') { return false }
  }
  return true
}

function setContact (data: Contact): Contact | null {
  if (!checkProperties(data)) {
    return {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      designation: data.designation
    }
  } else {
    return null
  }
}

export function parseSupplierInputFormToSupplier (
  supplierInputForm: SupplierInputForm,
  vendor?: NormalizedVendor | null,
  duplicateSuppliers?: LegalEntityRef[],
  ignoreDuplicates?: boolean,
  potentialMatchesSupplierSummary?: Array<SupplierSearchSummary>
): Supplier {
  const jurisdictionCountryCode = supplierInputForm?.jurisdictionCountryCode?.customData?.code
  return {
    activationStatus: ActivationStatus.newSupplier,
    supplierName: supplierInputForm?.name,
    address: supplierInputForm?.address || mapAddress({ alpha2CountryCode: jurisdictionCountryCode }),
    website: supplierInputForm?.website,
    duns: supplierInputForm?.duns,
    contactNote: supplierInputForm.note || undefined,
    vendorId: vendor?.id || null,
    phoneNumber: supplierInputForm?.companyPhone || undefined,
    email: supplierInputForm?.companyEmail || undefined,
    contact: setContact({ fullName: supplierInputForm.contactName || '', email: supplierInputForm.email || '', phone: supplierInputForm.phone || '', role: supplierInputForm.role || '', designation: supplierInputForm.designation || null }),
    companyName: supplierInputForm?.companyName || undefined,
    potentialMatches: duplicateSuppliers || null,
    potentialMatchIgnore: ignoreDuplicates || null,
    ein: vendor?.ein || undefined,
    tin: vendor?.tin || undefined,
    vat: vendor?.vat || undefined,
    newSupplier: supplierInputForm?.newSupplier || false,
    tinCountryCode: vendor?.tinCountryCode || undefined,
    vatCountryCode: vendor?.vatCountryCode || undefined,
    langCode: supplierInputForm?.langCode?.path || '',
    jurisdictionCountryCode: supplierInputForm?.jurisdictionCountryCode?.path || supplierInputForm?.address?.alpha2CountryCode || '',
    refId: supplierInputForm?.refId || '',
    tax: supplierInputForm?.tax || null,
    indirectTax: supplierInputForm?.indirectTax || null,
    potentialMatchesSupplierSummary
  }
}

export function parseSupplierToSupplierSearchSummary(supplier: Supplier, normalizedVendors: Array<NormalizedVendor>): SupplierSearchSummary {
  return {
    legalEntityId: supplier?.legalEntity?.id || '',
    commonName: supplier?.supplierName || supplier?.companyName || supplier?.legalEntity?.legalEntityName || '',
    website: supplier?.website || '',
    address: supplier?.address || undefined,
    normalizedVendors,
    vendors: [],
    id: supplier?.vendorId || null
  }
}

function buildSupplierContact (_data: SupplierDetail): Contact {
  return {
    fullName: _data?.contactName || '',
    email: _data?.contactEmail || '',
    role: '',
    phone: ''
  }
}

export function parseNotSureSupplierToSupplierV2 (
  data: SupplierDetail,
  legalEntity: LegalEntity
): Supplier {
  return {
    supplierName: data?.supplier?.commonName || '',
    vendorId: data?.supplier?.id || null,
    address: data?.supplier?.address ? data?.supplier?.address : null,
    email: data?.contactEmail || '',
    legalEntity,
    supplierSelectionText: data?.comment || '',
    potentialMatches: null,
    potentialMatchIgnore: null,
    contact: buildSupplierContact(data)
  }
}

export function changeDataIndexInArray (arr: Array<any>, oldIndex: number, newIndex: number): Array<any> {
  while (oldIndex < 0) {
    oldIndex += arr.length
  }
  while (newIndex < 0) {
    newIndex += arr.length
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}

export function checkIfContactNotAvailable (contact: Contact, isNameEnabled: boolean, isNameRequired: boolean, isEmailEnabled: boolean, isEmailRequired: boolean): boolean {
  if (isNameEnabled && isNameRequired) {
    return !(contact && contact.fullName)
  } else if (isEmailEnabled && isEmailRequired) {
    return !(contact && contact.email)
  } else {
    return false
  }
}

export function covertTaxKeyNameToOption (taxKeys: EnumsDataObject[], taxKey: string): Option {
  return {
    id: taxKey,
    displayName: getTaxKeyNameForKey(taxKey, taxKeys),
    path: taxKey
  }
}

export function convertTaxKeyListToOptions (taxKeys: EnumsDataObject[], taxKeyList: Array<string>): Array<Option> {
  return taxKeyList?.map((item) => covertTaxKeyNameToOption(taxKeys, item))
}

export function filterNVWithSuppliers(vendors: NormalizedVendor[], selectedVendors: Supplier[]): NormalizedVendor[] {
  const allSelectedVendorIds = selectedVendors.map(vendor => vendor.vendorId)
  return vendors.filter(vendor => !allSelectedVendorIds.includes(vendor.id))
}

export function filterSupplierSearchSummaryWithSuppliers (vendors: SupplierSearchSummary[], selectedVendors: Supplier[]): SupplierSearchSummary[] {
  const allSelectedVendorIds = selectedVendors.map(vendor => vendor.vendorId)
  const filterVendors = vendors.filter(vendor => {
    if (allSelectedVendorIds.includes(vendor.id)) {
      return null
    } else {
      if (vendor.normalizedVendors && vendor.normalizedVendors.length > 0) {
        vendor.normalizedVendors = filterNVWithSuppliers(vendor.normalizedVendors, selectedVendors)
      }
      return vendor
    }
  })
  return filterVendors
}