import { DEFAULT_CURRENCY } from "../../util";
import { Address, Image } from "../common";
import { AddressDetails, EmphasizedDetails, Employees, Identity, LegalEntity, LegalEntityRef, Name, Revenue } from "../legalEntity";
import { SupplierDimension } from "../vendor";
import { mapAddress, mapContact, mapIDRef, mapImageMetadata } from "./common";
import { mapDimension, mapEngagementReference, mapSegmentation, mapVendorRef } from "./vendor";

export function mapName (data: any): Name {
  return {
    active: data?.active || false,
    language: data?.language || null,
    name: data?.name || null,
    source: data?.source || null,
    type: data?.type || null
  }
}

export function mapAddressDetails (data: any): AddressDetails {
  const address: Array<Address> = data?.address ? data?.address.map(mapAddress) : []
  return {
    email: data?.email || [],
    fax: data?.fax || [],
    phone: data?.phone || [],
    address,
    source: data?.source,
    types: data?.types
  }
}

export function mapLegalEntityToLegalEntityRef (le?: LegalEntity): LegalEntityRef {
  return {
    id: le?.id || '',
    vendorId: le?.vendorId || '',
    name: le?.name?.name || '',
    legalName: le?.legalName?.name || '',
    commonName: le?.commonName?.name || '',
    description: le?.description || '',
    logo: { metadata: le?.logo?.metadata || [] },
    website: le?.website || '',
    suppierStatus: '',
    address: le?.address
  }
}

export function mapLegalEntityRef (data?: any): LegalEntityRef {
  return {
    id: data?.id || '',
    vendorId: data?.vendorId || '',
    name: data?.name || '',
    legalName: data?.legalName || '',
    commonName: data?.commonName || '',
    description: data?.description || '',
    logo: { metadata: data?.logo?.metadata || [] },
    website: data?.website || '',
    suppierStatus: data?.suppierStatus || ''
  }
}

export function mapEmphasizedDetails (data: any): EmphasizedDetails {
  return {
    vendorId: data?.['vendorId.match'] || '',
    legalName: data?.['legalName.match'] || '',
    commonName: data?.['commonName.match'] || '',
    aliases: data?.['aliases.match'] || ''
  }
}

export function mapOtherId (data: any): Identity {
  return {
    id: data?.id || '',
    idType: data?.idType || undefined,
    idCategory: data?.idCategory || undefined,
    issuer: data?.issuer || undefined
  }
}

export function mapLegalEntity (data: any): LegalEntity {
  const otherNames: Array<Name> = data?.otherNames ? data?.otherNames.map(mapName) : []
  const supplierDimensions: Array<SupplierDimension> = data?.supplierDimensions ? data?.supplierDimensions.map(mapDimension) : []
  const logo: Image = {
    metadata: data?.logo?.metadata ? data.logo.metadata.map(mapImageMetadata) : []
  }
  const commonName: Name = mapName(data?.commonName)
  const legalName: Name = mapName(data?.legalName)
  const numEmployees: Employees = { value: data?.numEmployees?.value || 0 }
  const revenue: Revenue = {
    money: {
      amount: data?.revenue?.money?.amount || 0,
      currency: data?.revenue?.money?.currency || DEFAULT_CURRENCY // if currency is not there the default should be USD
    }
  }

  const highlighters: EmphasizedDetails = mapEmphasizedDetails(data?.highlighters)

  return {
    active: data?.active || false,
    forbesGlobal: data?.forbesGlobal || false,
    fortune500: data?.fortune500 || false,
    legalEntityName: data?.commonName && data.commonName?.name ? data.commonName?.name : data?.legalName ? data.legalName?.name : '',
    id: data?.id || null,
    numSubsidiaries: data?.numSubsidiaries || 0,
    otherNames,
    name: mapName(data?.name),
    parent: data?.parent || false,
    ultimateParent: data?.ultimateParent || false,
    logo,
    commonName,
    legalName,
    description: data?.description || '',
    numEmployees,
    duns: data?.duns || '',
    regId: data?.regId || '',
    regAuthorityCode: data?.regAuthorityCode || '',
    ein: data?.ein || '',
    tin: data?.tin || '',
    vat: data?.vat || '',
    tinCountryCode: data?.tinCountryCode || '',
    vatCountryCode: data?.vatCountryCode || '',
    revenue,
    highlighters,
    address: mapAddressDetails(data?.address),
    addresses: data?.addresses?.map(mapAddressDetails) || [],
    website: data?.website || '',
    shortDescription: data?.shortDescription || '',
    vendorId: data?.vendorId || '',
    industryCode: data?.industryCode || '',
    vendorRecordRefs: data?.vendorRecordRefs && data?.vendorRecordRefs.length > 0 ? data?.vendorRecordRefs.map(mapVendorRef) : [],
    supplierSegmentation: data?.supplierSegmentation || '',
    supplierDimensions,
    supplierStatus: data?.supplierStatus || '',
    segmentationDetails: data?.segmentationDetails && data?.segmentationDetails?.length > 0 ? data.segmentationDetails.map(mapSegmentation) : [],
    engagementReferences: data?.engagementReferences && data?.engagementReferences?.length > 0 ? data.engagementReferences.map(mapEngagementReference) : [],
    individual: data?.individual || false,
    activeErpRecord: data?.activeErpRecord || false,
    parentName: data?.parentName || '',
    ultimateParentName: data?.ultimateParentName || '',
    parentRef: mapIDRef(data?.parentRef),
    ultimateParentRef: mapIDRef(data?.ultimateParentRef),
    parentVendorRef: mapIDRef(data?.parentVendorRef),
    otherIds: data?.otherIds && data?.otherIds?.length > 0 ? data.otherIds.map(mapOtherId) : [],
    activationStatus: data?.activationStatus || '',
    shareHolders: Array.isArray(data?.shareHolders) && data?.shareHolders?.length > 0 ? data?.shareHolders.map(mapContact) : [],
    subsidiaries: Array.isArray(data?.subsidiaries) && data?.subsidiaries?.length > 0 ? data?.subsidiaries.map(mapContact) : [],
    subcontractors: Array.isArray(data?.subcontractors) && data?.subcontractors?.length > 0 ? data?.subcontractors.map(mapContact) : [],
    boardOfDirectors: Array.isArray(data?.boardOfDirectors) && data?.boardOfDirectors?.length > 0 ? data?.boardOfDirectors.map(mapContact) : []
  }
}
