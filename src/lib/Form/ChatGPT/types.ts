
import { Option } from "../../Inputs"
import { Attachment, IDRef, Money, NormalizedVendorRef, QuestionnaireId, Supplier, User } from "../../Types"
import { Field } from "../types"
import { DataFetchers, Events, FieldOptions } from "../../CustomFormDefinition/NewView/FormView.component"
import { ContractExtractionResponse } from "../ChatGPTV2/types"

export enum enumChapGPTRequestBotFields {
    categories = 'categories',
    intents = 'intents',
    regions = 'regions',
    departments = 'departments',
    upperAmount = 'upperAmount',
    lowerAmount = 'lowerAmount',
    suppliers = 'suppliers',
    estimatedSpend = 'estimatedSpend',
    instructionForm = 'buyingChannelInstructionForm',
    amount = 'amount',
    product = 'product'
}

export enum Intent {
    createContract = 'Create contract',
    createPO = 'Create Purchase Order (PO)'
}

export interface RequestBotTab {
    id: string
    name: string
    value?: string
    isSkip?: boolean
}

export interface ChatGPTSuggestion {
    intent?: string
    productName?: string
    commodityList?: string[]
    commodityCodeList?: string[]
    countryCode?: string
    totalBudget?: string
    companyName?: string
    otherSuppliers?: OtherSuppliers[] | null
    preferredSuppliers?: PreferredSuppliers[] | null
}

export interface GptResponse {
    gptSuggestion: ChatGPTSuggestion
    suggestedCategories: Option[]
    contractExtractionDetails?: ContractExtractionResponse | null
}

export interface OtherSuppliers {
    erpVendorId?: string
    materialGroundId?: string
    materialGroupName?: string
    supplierStatus?: string
    vendorName?: string
    countryCode?: string
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
}

export interface BotQuestionProps {
    formData: ChatGPTFormData
    fieldMap?: { [key: string]: Field }
    tabs?: RequestBotTab[]
    suggestedSuppliers?: Supplier[]
    gptResponse?: ChatGPTSuggestion
    isQuestionSkip?: boolean
    defaultCurrency?: string
    categoryOptions?: Option[]
    regionOptions?: Option[]
    industryCodeOptions?: Option[]
    currenciesOptions?: Option[]
    upperSpendAmount?: number
    lowerSpendAmount?: number
    onChange?: (formData: ChatGPTFormData, isSkip?: boolean) => void
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    onSearch?: (keyword?: string) => Promise<Option[]>
}


export interface ChatGPTFormData {
    buyingChannelInstructionForm?: QuestionnaireId
    categories?: Option[]
    intents?: Option[]
    regions?: Option[]
    departments?: Option[]
    amount?: Money
    upperAmount?: number
    lowerAmount?: number
    selectedSuppliers?: Supplier[]
    userIntent?: string
    proposal?: Attachment | File | null
}

export interface ChatGPTFormProps {
    formData?: ChatGPTFormData
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
    defaultAccountCode?: IDRef
    defaultDepartments?: IDRef[]
    defaultLocations?: IDRef[]
    isInPortal?: boolean
    submitLabel?: string
    cancelLabel?: string
    options?: FieldOptions
    events?: Events
    dataFetchers?: DataFetchers
    getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    onItemIdFilterApply?: (filter: Map<string, string[]>) => Promise<Option[]>
    onSubmit?: (formData: ChatGPTFormData, onUploadProgress?: (progressEvent: any) => void) => Promise<boolean>
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ChatGPTFormData) => void
    onValueChange?: (fieldName: string, updatedForm: ChatGPTFormData) => void
    getAISuggestions?: (searchQuery: string, onUploadProgress?: (progressEvent: any) => void) => Promise<GptResponse>
    getBuyingChannel?: (normalizedVendorId?: string, onUploadProgress?: (progressEvent: any) => void) => Promise<IDRef[]>
    getNormalizedVendors?: (vendorIds: string[], name?: string, regions?: string[], onUploadProgress?: (progressEvent: any) => void) => Promise<Supplier[]>
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    onSearch?: (keyword?: string) => Promise<Option[]>
}

export interface ChatGPTReadOnlyFormProps {
    formData?: ChatGPTFormData
    fields?: Field[]
    signedInUserDetails?: User
    searchQuery?: string
}