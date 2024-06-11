import { Attachment, BankInfo, CustomFormData, CustomFormDefinition, DocumentRef, Location, Option, Vendor } from "../.."
import { DataFetchers, Events, FieldOptions } from "../../CustomFormDefinition/NewView/FormView.component"
import { EnumsDataObject } from "../../Form/types"
import { BaseQuestionnaireId } from "../../Types/vendor"

export interface SupplierVendorDetailsProps {
    vendorRecords: Array<Vendor>
    bankKeys?: EnumsDataObject[]
    taxKeys?: EnumsDataObject[]
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    viewOnMap: (location: Location) => void
    fetchVendorExtensionCustomFormDefinition?: (formId: string) => Promise<CustomFormDefinition>
    fetchVendorExtensionCustomFormData?: (vendorId: string, formId?: string) => Promise<VendorExtensionFormResponse>
}

export interface VendorExtensionProps {
    vendor?: Vendor
    vendorId?: string
    questionnaireId?: BaseQuestionnaireId
    isERPEditView?: boolean
    data?: CustomFormData
    /* START extension form related props */
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    getDocumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    /* END */
    t?: (key: string) => string
    onSave?: (data: CustomFormData) => void 
    fetchVendorExtensionCustomFormDefinition?: (formId: string) => Promise<CustomFormDefinition>
    fetchVendorExtensionCustomFormData?: (vendorId: string, formId?: string) => Promise<VendorExtensionFormResponse>
    onValueChange?: (formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) => void
}

export interface SupplierVendorSapDetailsProps {
    vendorRecords: Array<Vendor>
    formDefinition?: CustomFormDefinition | null
    formData?: CustomFormData | null
    bankKeys?: EnumsDataObject[]
    taxKeys?: EnumsDataObject[]
    incoTermOption?: Option[]
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    viewOnMap: (location: Location) => void
    fetchForm?: (id: string, companyEntityId?: string, purchaseOrgId?: string) => void
    fetchVendorExtensionCustomFormDefinition?: (formId: string) => Promise<CustomFormDefinition>
    fetchVendorExtensionCustomFormData?: (vendorId: string, formId?: string) => Promise<VendorExtensionFormResponse>
}

export interface BankInformationProps {
    bankAccounts: Array<BankInfo>
    bankKeys?: EnumsDataObject[]
    t?: (key: string) => string
}

export interface PurchaseLocationDetailsProps {
    locations: Array<Location>
    showOtherLocations?: boolean
    viewMap?: (location: Location) => void
    t?: (key: string) => string
}

export interface VendorExtensionFormResponse {
    formData: CustomFormData | null
    formId: string
}