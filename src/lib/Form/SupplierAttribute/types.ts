import { Attachment, Field, Option } from "../.."
import { SpendDetails } from "../../Types/vendor"

export interface SupplierAttributeFormProps {
    formData?: SupplierAttributeFormData
    fields?: Field[]
    classificationOption?: Option[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    isReadOnly?: boolean
    onValueChange?: (fieldName: string, formData: SupplierAttributeFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: SupplierAttributeFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierAttributeFormData) => void
    getDocumentByUrl?: (asyncUrl: string) => Promise<Blob>
    loadDocument?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob>
}

export interface SupplierAttributeFormData {
    normalizedVendorId: string
    isSensitive?: boolean
    supplierStatus?: string
    statusComment?: string
    hasNda?: boolean
    hasMsa?: boolean
    hasCda?: boolean
    hasDpa?: boolean
    nda?: Attachment
    msa?: Attachment
    cda?: Attachment
    dpa?: Attachment
    ndaExpiration?: string
    msaExpiration?: string
    cdaExpiration?: string
    dpaExpiration?: string
    spendDetails?: SpendDetails
}

export enum enumSupplierAttributeFields {
    supplierSegmentation = 'supplierSegmentation',
    segmentationDetails = 'segmentationDetails',
    isSensitive = 'isSensitive',
    hasCda = 'hasCda',
    hasMsa = 'hasMsa',
    hasDpa = 'hasDpa',
    hasNda = 'hasNda',
    msa = 'msa',
    dpa = 'dpa',
    nda = 'nda',
    cda = 'cda',
    spendDetails= 'spendDetails',
    providerScores = 'providerScores',
    note = 'note',
    legal = 'legal',
    spendType = 'spendType',
    poCount = 'poCount',
    invoiceCount = 'invoiceCount'
}

export enum enumAttributeSection {
    segmentationDetails = 'segmentationDetails',
    isSensitive = 'isSensitive',
    diversities = 'diversities',
    legal = 'legal',
    hasCda = 'hasCda',
    hasMsa = 'hasMsa',
    hasDpa = 'hasDpa',
    hasNda = 'hasNda',
    spendDetails= 'spendDetails',
    providerScores = 'providerScores'
}

export enum enumLegalDocs {
    nda = 'nda',
    msa = 'msa',
    cda = 'cda',
    dpa = 'dpa'
}