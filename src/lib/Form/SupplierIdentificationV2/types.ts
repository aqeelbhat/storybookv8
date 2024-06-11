import { Attachment, Field, IDRef, Image, Option, VendorSuggestionRequest, Address, EncryptedData, SupplierInputForm, Supplier, ProcessVariables, NormalizedVendor, Contact, Vendor, SupplierRecommendation } from "../.."
import { EnumsDataObject, FormAction, MasterDataRoleObject } from "../types";
export interface SupplierIdentificationV2FormData {
    selectedSuppliers: Array<Supplier>
    processVariables?: ProcessVariables
    companyEntities?: Array<IDRef>
    vendorCurrency?: IDRef
    notSureNote?: string
    supplierSelected?: boolean
    notSureWhichSupplierFlag?: boolean
    isPurchasing?: boolean
    isInvoicing?: boolean
}

export enum enumSupplierIdentificationFields {
    supplierSearch = 'supplierSearch',
    orderingAddress = 'orderingAddress',
    disallowFreeEmailDomain = 'disallowFreeEmailDomain',
    noSupplierSelected = 'noSupplierSelected',
    contact = 'contact',
    tax = 'tax',
    inDirectTax = 'inDirectTax',
    country = 'jurisdictionCountryCode',
    language = 'langCode'
}

export enum ConfigurationFieldsSupplierIdentificationV2 {
    disallowFreeEmailDomain = 'disallowFreeEmailDomain',
    disableEmailCheck = 'disableEmailCheck',
    notSureSupplierConfig = 'notSureSupplierConfig',
    showCountyCodeInCountryListing = 'showCountyCodeInCountryListing',
    disableNewSupplierOption = 'disableNewSupplierOption',
    orderingAddressEnabled = 'orderingAddressEnabled',
    orderingAddressMandatory = 'orderingAddressMandatory',
    minNumberOfSuppliers = 'minNumberOfSuppliers',
    maxNumberOfSuppliers= 'maxNumberOfSuppliers',
    allowParentSupplierSelection = 'allowParentSupplierSelection',
    supplierFinalizationCheck = "supplierFinalization",
    isPurchasing = 'isPurchasing',
    isInvoicing = 'isInvoicing',
    allowMultipleCompanyEntities = 'allowMultipleCompanyEntities',
    contact = 'contact',
    email = 'email',
    tax = 'tax',
    indirectTax = 'indirectTax',
    supplierRecommendationEnabled = 'supplierRecommendationEnabled'
}

export interface SupplierSearchSummary {
    vendors: Array<Vendor>
    id: string | null
    normalizedVendors: Array<NormalizedVendor>
    logo?: Image
    legalEntityId?: string;
    website?: string
    commonName?: string
    address?: Address
}

export interface SupplierIdentificationV2Props {
    formData?: SupplierIdentificationV2FormData
    fields?: Field[]
    supplierRecommendations?: SupplierRecommendation
    supplierRoles?: Array<MasterDataRoleObject>
    countryOption?: Option[]
    companyEntity?: Option[]
    languageOption?: Option[]
    submitLabel?: string
    cancelLabel?: string
    isReadonly?: boolean
    taxKeys?: EnumsDataObject[]
    taxCodeFormatError?: boolean
    indirectTaxCodeFormatError?: boolean
    supplierWithContactError?: Supplier | null
    isInPortal?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onTypeaheadSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<NormalizedVendor>>
    onSupplierFinalize?: (selected: boolean, suppliers: Array<Supplier>) => void
    updateSupplierList?: (supplier: Supplier[], action?: FormAction) => void
    fetchExistingContactList?: (vendorId: string) => Promise<Contact[]>
    fetchNVVendorByLegalEntityId?: (supplier: Supplier) => Promise<NormalizedVendor[]>
    onValueChange?: (fieldName: string, formData: SupplierIdentificationV2FormData, file?: File | Attachment, fileName?: string) => void
    onNewSupplierAddValueChange?: (fieldName: string, formData: SupplierInputForm) => Promise<Supplier>
    onVendorSelect?: (selectedVendor: NormalizedVendor) => void
    fetchNVChildrensUsingParentID?: (selectedVendor: NormalizedVendor) => Promise<Array<SupplierSearchSummary>>
    onSubmit?: (formData: SupplierIdentificationV2FormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierIdentificationV2FormData) => void
    onSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<SupplierSearchSummary>>
    validateTaxFormat?: (taxKey: string, alpha2CountryCode: string, data: EncryptedData, taxCode: string) => void
    onAddNewSupplier?: (data: SupplierInputForm, ignoreMatches?: boolean, duplicateMatches?: SupplierSearchSummary[], action?: FormAction) => void
    checkForDuplicateSuppliers?: (searchPayload: VendorSuggestionRequest) => Promise<Array<SupplierSearchSummary>>
    onSupplierRemove?: (supplier: Supplier[], selected?: boolean) => void
    fetchNVDetailsForDuplicateSupplier?: (vendor: NormalizedVendor) => Promise<NormalizedVendor>
    onNotSureSupplierProceed?: (data: SupplierDetail) => void
    fetchVendorById?: (vendorId: string) => Promise<Vendor>
    onParentSelect?: (vendor: SupplierSearchSummary) => void
    fetchNVDetailsForParentVendor?: (vendor: SupplierSearchSummary) => Promise<NormalizedVendor>
    fetchVendorsForOrderingAddress?: (vendorId: string, purchasingEntities: string[], partnerFunctionType: string) => Promise<Array<Vendor>>
}

export interface SupplierSearchResultModalProps {
    searchString: string
    vendors: SupplierSearchSummary[]
    processVariables?: ProcessVariables
    countryOption?: Option[]
    companyEntity?: Option[]
    isViewRecord?: boolean
    disableNewSupplierOption?: boolean
    allowParentRecordSelection?: boolean
    isInPortal?: boolean
    supplierFinalizationCheck?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onAdvanceSearch?: (searchPayload: VendorSuggestionRequest) => void
    onSelect?: (selectedVendor: NormalizedVendor) => void
    onClose?: () => void
    onAddNewSupplierClicked?: () => void
    onProceedNotSureSupplier?: (details: SupplierDetail) => void
    onParentRecordSelect?: (vendor: SupplierSearchSummary) => void
}

export interface SupplierSearchResultParentProps {
    vendor: SupplierSearchSummary
    duplicateSupplierView?: boolean
    isViewRecord?: boolean
    supplierFinalizationCheck?: boolean
    allowParentRecordSelection?: boolean
    autoExpandIfSingleVendor?: boolean
    onVendorSelect?: (vendor: NormalizedVendor) => void
    notSureWhichSupplier?: () => void
    onParentRecordSelect?: (vendor: SupplierSearchSummary) => void
}

export interface SupplierDetail {
    supplier: SupplierSearchSummary
    comment?: string
    contactName?: string
    contactEmail?: string
 }
 
export interface NotSureSupplierModalProps {
    isOpen: boolean
    searchRecord: SupplierSearchSummary
    onClose?: () => void
    onProceed?: (_details: SupplierDetail) => void
}

export interface DuplicateSupplierPopupProps {
    open: boolean
    vendors: SupplierSearchSummary[]
    loading?: boolean
    newSupplier?: SupplierInputForm | null
    readOnly?: boolean
    isReviewer?: boolean
    supplierFinalizationCheck?: boolean
    allowParentRecordSelection?: boolean
    onSelect?: (selectedVendor: NormalizedVendor) => void
    onIgnoreMatch?: () => void
    onClose?: () => void
    handleDuplicateMatchNotSure?: () => void
    onParentRecordSelect?: (vendor: SupplierSearchSummary) => void
}

export enum PartnerFunction {
    OA = 'OA', // Ordering Addres
    PI = 'PI' // Invoicing Party
}

export const emptySupplierInputForm: SupplierInputForm = {
    contactName: '',
    email: '',
    name: '',
    note: '',
    phone: '',
    role: '',
    website: '',
    address: {
      line1: '',
      line2: '',
      line3: '',
      streetNumber: '',
      unitNumber: '',
      city: '',
      province: '',
      alpha2CountryCode: '',
      postal: ''
    },
    companyEmail: '',
    companyPhone: ''
}