import { MasterDataRoleObject } from "../.."
import { Supplier, Option, NormalizedVendor, VendorSuggestionRequest, Contact } from "../../../Types"
import { SupplierDetail, SupplierSearchSummary } from "../../SupplierIdentificationV2"
import { PreferredSuppliers } from "../types"

interface CommonProps {
  suggestedSuppliers?: Supplier[]
  companyName: string
  isNudging?: boolean
  defaultCurrency?: string
  preferredSuppliersDetail?: PreferredSuppliers[]
  industryCodes?: Option[]
  supplierRoles?: Array<MasterDataRoleObject>
  countryOption?: Option[]
  languageOption?: Option[]
  onAdvanceSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<SupplierSearchSummary>>
  onTypeaheadSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<NormalizedVendor>>
  fetchNVChildrensUsingParentID?: (selectedVendor: NormalizedVendor) => Promise<Array<SupplierSearchSummary>>
  fetchNVDetailsForDuplicateSupplier?: (vendor: NormalizedVendor) => Promise<NormalizedVendor>
  fetchExistingContactList?: (vendorId: string) => Promise<Contact[]>
  fetchNVVendorByLegalEntityId?: (supplier: Supplier) => Promise<NormalizedVendor[]>
  onSelect: (supplier: Supplier) => void
  onShowMore: () => void
  onSkipSupplier: () => void
  reset: boolean
}
export interface SupplierSuggestionProps extends CommonProps {
  selectedSupplier: Supplier
  isNudging?: boolean
  onSearchSuppliers?: (search: string) => Promise<Supplier[]>
  isSkipped: boolean
  getVendorDetails?: (vendorId: string) => Promise<NormalizedVendor>
  onVendorSelect?: (selectedVendor: NormalizedVendor) => Promise<Supplier | undefined>
  onParentSelect?: (vendor: SupplierSearchSummary) => Promise<Supplier | undefined>
  onNotSureSupplierProceed?: (data: SupplierDetail) => Promise<Supplier | undefined>
}

export interface RecommendationFlowProps extends CommonProps {
  isSearchON: boolean
  onViewRecommendClick: () => void
  onSearchEnable: () => void
}
