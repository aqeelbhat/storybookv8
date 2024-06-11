import { Address, Money, Image, IDRef, Contact } from './common'
import { ActivationStatus } from './supplier';
import { EngagementReference, SegmentationDetail, SupplierDimension, VendorRef } from './vendor';

export interface Name {
  name: string
  language: string
  type: string
  active: boolean
  source: string | null
}

export interface Employees {
  value: number
}

export interface Revenue {
  money: Money
}

export enum Source {
  lei = 'lei',
  sam = 'sam',
  sba = 'sba',
  forbes = 'forbes',
  fortune = 'fortune',
  registry = 'registry'
}

export enum AddressType {
  legal,
  alternative_lang_legal,
  ascii_transliterated_legal,
  hq,
  alternative_lang_hq,
  ascii_transliterated_hq,
  factory
}

export interface AddressDetails {
  types: AddressType[]
  address: Array<Address>
  email: string[]
  phone: string[]
  fax: string[]
  source: Source
}

export interface EmphasizedDetails {
  vendorId: string
  commonName: string
  legalName: string
  aliases: string
}

export interface LegalEntity {
  id: string
  active: boolean
  legalEntityName: string
  name?: Name
  otherNames?: Array<Name>
  numSubsidiaries: number
  parent: boolean
  ultimateParent: boolean
  forbesGlobal: boolean
  fortune500: boolean
  logo: Image
  commonName?: Name
  legalName?: Name
  description: string
  shortDescription?: string
  numEmployees?: Employees
  duns: string
  regId: string
  regAuthorityCode: string
  ein: string
  tin: string
  vat: string
  tinCountryCode: string
  vatCountryCode: string
  revenue?: Revenue
  website?: string
  address?: AddressDetails
  addresses?: AddressDetails[]
  vendorId?: string
  industryCode?: string
  vendorRecordRefs?: Array<VendorRef>
  supplierSegmentation: string
  supplierStatus: string
  supplierDimensions?: Array<SupplierDimension>
  segmentationDetails?: Array<SegmentationDetail>
  engagementReferences?: Array<EngagementReference>
  individual?: boolean
  highlighters?: EmphasizedDetails
  activeErpRecord?: boolean
  ultimateParentName?: string
  parentName?: string
  ultimateParentRef?: IDRef
  parentRef?: IDRef
  parentVendorRef?: IDRef
  otherIds?: Identity
  activationStatus?: ActivationStatus
  shareHolders?: Contact[]
  subsidiaries?: Contact[]
  subcontractors?: Contact[]
  boardOfDirectors?: Contact[]
}

export interface Identity {
  id: string
  idType?: string
  idCategory?: string
  issuer?: string
}

export interface LegalEntityRef {
  id: string
  vendorId: string
  name: string
  legalName: string
  commonName: string
  description: string
  logo: Image
  website: string
  suppierStatus: string,
  address?: AddressDetails
}

export enum SupplierSuggestionSearchMode {
  leOnly = 'leOnly',
  nvOnly = 'nvOnly'
}
