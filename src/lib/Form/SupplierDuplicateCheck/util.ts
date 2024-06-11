import { mapIDRef, mapNormalizedVendorRef, mapSupplier } from "../../Types";
import { DuplicateEntry, DuplicateVendorCheckResult, SupplierDuplicateCheck } from "./types";

export function mapDuplicateEntry (params: DuplicateEntry): DuplicateEntry {
    return {
        matchedSupplier: params.matchedSupplier ? mapSupplier(params.matchedSupplier) : null,
        normalizedVendorRef: params.normalizedVendorRef ? mapNormalizedVendorRef(params.normalizedVendorRef) : null,
        normalizedVendorId: params.normalizedVendorId || '',
        matchedDuns: params.matchedDuns || '',
        matchedTaxId: params.matchedTaxId || ''
    }
}

export function mapDuplicateVendorCheckResult (params: DuplicateVendorCheckResult): DuplicateVendorCheckResult {
    return {
        duplicateEntries: params.duplicateEntries && params.duplicateEntries?.length > 0 ? params.duplicateEntries.map(mapDuplicateEntry) : []
    }
}

export function mapSupplierDuplicateCheck (params: SupplierDuplicateCheck): SupplierDuplicateCheck {
    return {
        duplicateCheckResult: params.duplicateCheckResult,
        originallySelectedPartner: params.originallySelectedPartner ? mapNormalizedVendorRef(params.originallySelectedPartner) : null,
        originallySelectedSupplier: params.originallySelectedSupplier ? mapSupplier(params.originallySelectedSupplier) : null,
        selectedPartner: params.selectedPartner ? mapNormalizedVendorRef(params.selectedPartner) : null,
        selectedSupplier: params.selectedSupplier ? mapSupplier(params.selectedSupplier) : null,
        reasonForSelectingDuplicate: params.reasonForSelectingDuplicate ? mapIDRef(params.reasonForSelectingDuplicate) : undefined,
        commentForSelectingDuplicate: params.commentForSelectingDuplicate || ''
    }
}