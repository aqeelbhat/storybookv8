import { IDRef, NormalizedVendorRef, Option, ProcessVariables, Supplier } from "../../Types"
import { EnumsDataObject } from "../types"

export interface DuplicateEntry {
    matchedSupplier: Supplier |  null
    normalizedVendorRef: NormalizedVendorRef | null
    normalizedVendorId?: string
    matchedDuns?: string
    matchedTaxId?: string
}
export interface DuplicateVendorCheckResult {
    duplicateEntries: DuplicateEntry[]
}
export interface SupplierDuplicateCheck {
    duplicateCheckResult: DuplicateVendorCheckResult
    originallySelectedPartner: NormalizedVendorRef | null
    originallySelectedSupplier: Supplier | null
    selectedPartner: NormalizedVendorRef | null
    selectedSupplier: Supplier | null
    reasonForSelectingDuplicate?: IDRef
    commentForSelectingDuplicate?: string
}
export interface SupplierDuplicateCheckFormProps {
    formData?: SupplierDuplicateCheck
    taxKeys?: EnumsDataObject[]
    processVariables?: ProcessVariables
    duplicateSupplierReasonOptions?: Option[]
    onSubmitSupplier?: (formData: SupplierDuplicateCheck) => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierDuplicateCheck) => void
}