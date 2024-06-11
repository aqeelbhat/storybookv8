import { Option } from "../../Inputs"
import { IDRef, ItemListType, Money, RequestQuestionnaireId, SegmentationDetail, Supplier, Attachment, User, NormalizedVendor, VendorSuggestionRequest, Contact, PurchaseOrder } from "../../Types"
import { DataFetchers, Events, FieldOptions } from "../../CustomFormDefinition/NewView/FormView.component"
import { Field, MasterDataRoleObject } from "../types"
import { CustomFormData } from "../../CustomFormDefinition"
import { ProcessDurationResult, ProcessStep, ProcessStepInfo } from "../../ProcessStep/types"
import { SupplierDetail, SupplierSearchSummary } from "../SupplierIdentificationV2"

export interface GptV2Response {
    gptSuggestion: ChatGPTApiSuggestion
    suggestedCategories: Option[]
    contractExtractionDetails?: ContractExtractionResponse | null
}
export interface IBuyingChannelResponse {
    ref?: IDRef
    instruction?: string
    helpVideo?: string
    formId?: string
    url?: string
    paymentVendorId?: string
    requestProcessName?: string
    basisPoint?: number
    description?: string
    imageUrl?: string
}

interface ChatGPTFormProps {
    formData?: ChatGPTV2FormData
    fields?: Field[]
    categoryOptions?: Option[]
    regionOptions?: Option[]
    intentsOptions?: Option[]
    departmentOptions?: Option[]
    industryCodes?: Option[]
    defaultCurrency?: string
    currencyOptions?: Option[]
    accountCodeOptions?: Option[]
    costCenterOptions?: Option[]
    unitPerQtyOptions?: Option[]
    itemIdOptions?: Option[]
    trackCodeOptions?: Option[]
    lineOfBusinessOptions?: Option[]
    locationOptions?: Option[]
    projectOptions?: Option[]
    expenseCategoryOptions?: Option[]
    purchaseItemOptions?: Option[]
    supplierRoles?: Array<MasterDataRoleObject>
    countryOption?: Option[]
    languageOption?: Option[]
    defaultAccountCode?: IDRef
    defaultDepartments?: IDRef[]
    defaultLocations?: IDRef[]
    isInPortal?: boolean
    submitLabel?: string
    cancelLabel?: string
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    onAdvanceSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<SupplierSearchSummary>>
    onTypeaheadSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<NormalizedVendor>>
    fetchNVChildrensUsingParentID?: (selectedVendor: NormalizedVendor) => Promise<Array<SupplierSearchSummary>>
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    onItemIdFilterApply?: (filter: Map<string, string[]>) => Promise<Option[]>
    onSubmit?: (formData: ChatGPTV2FormData) => Promise<boolean>
    onClearProposal?: (formData: ChatGPTV2FormData) => Promise<boolean>
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ChatGPTV2FormData) => void
    getAISuggestions?: (searchQuery: string, onUploadProgress?: (progressEvent: any) => void) => Promise<GptV2Response>
    onQuestionAnswered?: (intentRequest: GPTV2IntentUserQuery) => Promise<GptV2Response>
    getBuyingChannel: () => Promise<IBuyingChannelResponse[]>
    getFallbackBuyingChannel: () => Promise<IBuyingChannelResponse[]>
    getNormalizedVendors?: (vendorIds: string[], name?: string, regions?: string[], onUploadProgress?: (progressEvent: any) => void) => Promise<Supplier[]>
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    onSearch?: (keyword?: string) => Promise<Option[]>
    refetchSuppliers?: () => Promise<Supplier[]>
}
export type ChatGPTFormV2Props = ChatGPTFormProps & {
    title?: string
    fetchCategory?: (categoryId: string) => Promise<Option | null>
    complianceForm?: RequestQuestionnaireId
    isComplianceFormVisible?: (id: string) => Promise<boolean>
    submitComplianceForm?: (customFormData: CustomFormData, formId: string, isNew: boolean, complianceId: string) => Promise<{ customFormData?: CustomFormData, id: string }>
    getComplianceFormData?: (complianceId: string) => Promise<CustomFormData | undefined>
    onSearchSuppliers?: (search: string) => Promise<Supplier[]>
    fetchProcessSteps?: (processName: string) => Promise<ProcessStepInfo>
    fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
    fetchProcessDuration?: (processName: string) => Promise<ProcessDurationResult>
    createRequest?: (requestProcessName: string, ref: IDRef) => void
    fetchCatalog?: (productName: string) => Promise<ItemListType>
    getVendorDetails?: (vendorId: string) => Promise<NormalizedVendor>
    onVendorSelect?: (selectedVendor: NormalizedVendor) => Promise<Supplier | undefined>
    onParentSelect?: (vendor: SupplierSearchSummary) => Promise<Supplier | undefined>
    onNotSureSupplierProceed?: (data: SupplierDetail) => Promise<Supplier | undefined>
    fetchNVDetailsForDuplicateSupplier?: (vendor: NormalizedVendor) => Promise<NormalizedVendor>
    fetchExistingContactList?: (vendorId: string) => Promise<Contact[]>
    fetchNVVendorByLegalEntityId?: (supplier: Supplier) => Promise<NormalizedVendor[]>
    fetchPOList: (poNumberOrId: string, supplierIds: string[]) => Promise<{ objs: PurchaseOrder[], total: number}>
}

export const enum GPTV2Intent {
    createContract = 'Create contract',
    createPO = 'Create Purchase Order (PO)',
    payment = 'Payment',
    unknown = 'Unknown',
    findSupplier = 'Find supplier',
    // Finder Intents
    requestStatus = 'Get the status of a request',
    contractStatus = 'Get the status of a contract',
    invoiceStatus = 'Get the status of an invoice',
    supplierStatus = 'the status of a supplier/vendor',
    poStatus = 'Get the status of a PO',
    extendContract = 'Extend/Update contract',
    renewContract = 'Renew contract',
    cancelContract = 'Cancel contract',
    amendPO = 'Amend Purchase Order (PO)'
}

export interface OtherSuppliers {
    erpVendorId?: string
    materialGroundId?: string
    materialGroupName?: string
    supplierStatus?: string
    vendorName?: string
    countryCode?: string
}
export type PreferredSupplierAPI = {
    commodity_id?: string
    erp_supplier?: string
    erp_supplier_id?: string
    supplier_status?: string
    requisition_title?: string
    requester_user_id?: string
    company_code?: string
    created?: string
    'sum(PO Spend)'?: number
}
export type OtherSupplierAPI = {
    'ERP Vendor ID'?: string
    'Material Group ID'?: string
    'Material Group Name'?: string
    'Supplier Status'?: string
    'Vendor Name'?: string
    'country_code'?: string
}
export interface ChatGPTSuggestion {
    intent?: GPTV2Intent
    productName?: string
    commodityList?: string[]
    commodityCodeList?: string[]
    countryCode?: string
    totalBudget?: string
    companyName?: string
    otherSuppliers?: OtherSuppliers[] | null
    preferredSuppliers?: PreferredSuppliers[] | null
    disableProductSearch?: boolean
    poNumberOrId?: string
}


export interface ChatGPTApiSuggestion {
    "Other suppliers": Array<OtherSupplierAPI>
    "Intent": string
    "PR Suppliers": Array<PreferredSupplierAPI>
    budget: string
    commodity_code_list: Array<string>
    commodity_list: Array<string>
    company_names: string
    conversation_state: string
    currency: string
    error: string
    next_question: string
    product_names: string
    status_code: string
    total_budget: string
    country_code: string
    disable_product_search: boolean
    PO_number_or_id: string
}

export interface ChatGPTV2FormData {
    categories?: Option[]
    regions?: Option[]
    amount?: Money
    selectedSuppliers?: Supplier[]
    proposal?: Attachment | File | null
    intentStrings?: string[]
    selectedSupplierSegmentations?: SegmentationDetail[]
    // user Intent is the search query by client
    userIntent?: string
}

export enum enumChapGPTRequestBotFields {
    categories = 'categories',
    regions = 'regions',
    amount = 'amount',
    userIntent = 'userIntent',
    selectedSuppliers = 'selectedSuppliers',
    catalog = 'catalogBuyingChannel',
    proposal = 'proposal',
    categoryLeafOnly = 'categoryLeafOnly'
}


export interface PreferredSuppliers {
    commodityId?: string
    erpSupplier?: string
    erpSupplierId?: string
    supplierStatus?: string
    title?: string
    userId?: string
    companyCode?: string
    totalSpend?: number | null
    created?: string
}

export interface ChatGPTReadOnlyFormProps {
    formData?: ChatGPTV2FormData
    fields?: Field[]
    signedInUserDetails?: User
    searchQuery?: string
}
export interface ContractExtractionResponse {
    fileid: string
    auto_renewal: boolean | null
    cancellation: boolean | null
    agreement_type: string
    auto_renewal_max: string
    auto_renewal_notify: string
    auto_renewal_period: string
    commercial: string
    duration_term: string
    duration_type: string
    expiry_date: string
    government: string
    incoterm: string
    incoterm_location: string
    sca: string
    signer: string
    summary_paragraph: string
    summary_sentence: string
    top: string
    currency: string
    end_date: string
    payment: string
    start_date: string
    supplier: string
    value: number | null
}

export interface IQuestion {
    question: string
    answer: string
    conversationState?: string
}

export interface GPTV2IntentUserQuery {
    query: string
    conversation_state: string | null
    query_intent: boolean
    analyze_proposal: boolean
}

export enum QuestionNumber {
    proposal = 'proposal',
    one = 'one',
    two = 'two',
    three = 'three'
}
