import { Attachment, Field, NormalizedVendorRef, Option } from "../.."

export enum enumSupplierEditFields {
    allowAddOrUpdatePaymentDetails = "allowAddOrUpdatePaymentDetails",
    allowAddPaymentTerms = "allowAddPaymentTerms",
    allowEditOtherDetails = "allowEditOtherDetails",
    vendorIdRef = "vendorIdRef",
    otherDetailsToUpdate = "otherDetailsToUpdate",
    reasonForUpdate = "reasonForUpdate",
    attachments = "attachments",
    editMethods = "editMethods"
}

export enum enumSupplierEditMethods {
    addOrUpdatePaymentDetails = 'addOrUpdatePaymentDetails',
    addPaymentTerms = 'addPaymentTerms',
    editOtherDetails = 'editOtherDetails',
    editERPDetails = 'editERPDetails'
}

export interface SupplierEditOptionFormData {
    vendorId: string
    editMethods: Option[]
    otherDetailsToUpdate?: string
    reasonForUpdate?: string
    attachments?: Attachment[]
}

export interface SupplierEditOptionProps {
    formData?: SupplierEditOptionFormData
    fields?: Field[]
    supplierEditOption?: Option[]
    normalizedVendors?: NormalizedVendorRef[]
    submitLabel?: string
    cancelLabel?: string
    onValueChange?: (fieldName: string, formData: SupplierEditOptionFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: SupplierEditOptionFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierEditOptionFormData) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
}

export interface SupplierEditOptionReadOnlyProps {
    formData?: SupplierEditOptionFormData
    fields?: Field[]
    supplierEditOption?: Option[]
    loadDocument?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob>
}