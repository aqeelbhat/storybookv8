
import { Address, Attachment, CustomFormData, CustomFormDefinition, Field, Option, VendorExtensionFormResponse } from "../.."
import { DataFetchers, Events, FieldOptions } from "../../CustomFormDefinition/NewView/FormView.component"
import { BaseQuestionnaireId, Location, VendorCompanyInfo, VendorIdentificationNumber, VendorPurchaseOrgInfo } from "../../Types/vendor"

export enum enumSupplierEditERPFields {
    vendorHeaderLevelPurchasingBlocked = 'vendorHeaderLevelPurchasingBlocked',
    vendorHeaderLevelPaymentBlocked = 'vendorHeaderLevelPaymentBlocked',
    vendorHeaderLevelPostingBlocked = 'vendorHeaderLevelPostingBlocked',
    vendorCompanyInfo = 'vendorCompanyInfo',
    vendorPurchaseOrgInfo = 'vendorPurchaseOrgInfo',
    vendorIdentificationNumbers = 'vendorIdentificationNumbers',
    location = 'location',
    extensionForm = 'extensionForm',
    vendorName = 'vendorName'
}

export enum enumSupplierERPSection {
    vendorHeader = 'vendorHeader',
    vendorCompanyInfo = 'vendorCompanyInfo',
    vendorPurchaseOrg = 'vendorPurchaseOrg',
    vendorIdentifiers = 'vendorIdentifiers',
    vendorExtensionForm = 'vendorExtensionForm'
}

export const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '920px',
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 30px 0px rgba(6, 3, 34, 0.15)',
    p: 4,
    outline: 'none',
    padding: '24px',
    borderRadius: '8px'
}

export const CheckboxLabelStyle = {
    '& .MuiCheckbox-root' : {
        color: 'var(--warm-neutral-shade-100)',
        padding: '0 8px'
    },
    '& .MuiFormControlLabel-label': {
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--warm-neutral-shade-500)'
    },
    '& .Mui-checked': {
        'color': 'var(--warm-stat-mint-mid) !important'
    }
}

export interface ERPDetailsField {
    fieldName: string
    isRequired: boolean
}

export interface SupplierERPDetailsFormData {
    id: string
    vendorId?: string
    vendorName?: string
    vendorHeaderLevelPostingBlocked: boolean
    vendorHeaderLevelPurchasingBlocked: boolean
    vendorHeaderLevelPaymentBlocked: boolean
    vendorCompanyInfo: Array<VendorCompanyInfo>
    vendorPurchaseOrgInfo: Array<VendorPurchaseOrgInfo>
    vendorIdentificationNumbers: Array<VendorIdentificationNumber>
    location?: Location
    data?: CustomFormData
    vendorHeaderQuestionnaireId?: BaseQuestionnaireId
}

export interface VendorHeader {
    vendorName: string
    location: Location
    isPurchasingBlocked: boolean
    isPaymentBlocked: boolean
    isPostingBlocked: boolean 
}

export interface SupplierERPDetailsProps {
    formData?: SupplierERPDetailsFormData
    fields?: Field[]
    paymentTermOption?: Option[]
    countryOptions?: Option[]
    incoTermOption?: Option[]
    submitLabel?: string
    cancelLabel?: string
    /* START custom form related props */
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    getDocumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    onItemIdFilterApply?: (filter: Map<string, string[]>) => Promise<Option[]>
    /* END */
    onValueChange?: (fieldName: string, formData: SupplierERPDetailsFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: SupplierERPDetailsFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierERPDetailsFormData) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    fetchVendorExtensionCustomFormDefinition?: (formId: string) => Promise<CustomFormDefinition>
    fetchVendorExtensionCustomFormData?: (vendorId: string, formId?: string) => Promise<VendorExtensionFormResponse>
}

export interface SupplierERPDetailsReadOnlyProps {
    formData?: SupplierERPDetailsFormData
    fields?: Field[]
    paymentTermOption?: Option[]
    countryOptions?: Option[]
    incoTermOption?: Option[]
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    getDocumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    loadDocument?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob>
    fetchVendorExtensionCustomFormDefinition?: (formId: string) => Promise<CustomFormDefinition>
    fetchVendorExtensionCustomFormData?: (vendorId: string, formId?: string) => Promise<VendorExtensionFormResponse>
}