import { Attachment, Field, IDRef, Option, VendorRef } from "../.."

export enum enumSupplierEditPaymentFields {
    updateVendorRecordOnProcessComplete = "updateVendorRecordOnProcessComplete",
    paymentTerm = "paymentTerm"
}

export interface SupplierEditPaymentTermFormData {
    paymentTerm?: Option
    companyEntityRef?: IDRef
    vendorRef?: VendorRef
}

export interface SupplierEditPaymentTermProps {
    formData?: SupplierEditPaymentTermFormData
    fields?: Field[]
    paymentTermOption?: Option[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    onValueChange?: (fieldName: string, formData: SupplierEditPaymentTermFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: SupplierEditPaymentTermFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierEditPaymentTermFormData) => void
}

export interface SupplierEditPaymentTermReadOnlyProps {
    formData?: SupplierEditPaymentTermFormData
    fields?: Field[]
    paymentTermOption?: Option[]
}