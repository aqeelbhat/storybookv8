import { Option, User, Address, IDRef, Contact, Attachment, Supplier, IntermediaryBankInfo, BankKey, EncryptedData, Money, UserId, SupplierUser, LegalEntity, Document, ContractStatus, NormalizedVendorRef, VendorRef, Note, NormalizedVendor, SegmentationDetail, QuestionnaireId } from '../Types'
import { ProcessStep } from '../ProcessStep/types'
import { ProcessVariables } from '../Types'
import { getEmptyAddress } from './util'
import { BankAccountType, ContactDesignation, ContractDetail, FormButtonAction, FormDiff, IbanSupport, Image, ObjectSearchVariables, ObjectValue, PurchaseOrder, SeonEmailVerificationResponse } from '../Types/common'
import { ItemListConfig, ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { IDocument } from '@cyntler/react-doc-viewer'
import { LegalDocumenListNewProps } from '../controls/legalDocumentsNew.component'
import { DataFetchers, Events } from '../CustomFormDefinition/NewView/FormView.component'
import { LocalLabels } from '../CustomFormDefinition'

export enum enumSupplierFields {
    supplierName = 'supplierName',
    website = 'website',
    contact = 'contact',
    email = 'email',
    phoneNumber = 'phoneNumber',
    role = 'role',
    duns = 'duns',
    language = 'langCode',
    country = 'jurisdictionCountryCode',
    inDirectTax = 'indirectTax',
    tax = 'tax',
    notSureNote = 'notSureNote',
    notSureWhichSupplierFlag = 'notSureWhichSupplierFlag'
}

export interface Cost {
    currency: string
    amount: string
}

export interface DateRangeObject {
  startDate: string
  endDate: string
}

export interface OptionWithJustification {
  option: Option
  justification: string
}

export interface SupplierInputForm {
    name: string
    website?: string
    address?: Address
    note?: string
    contactName?: string
    role?: string
    email?: string
    phone?: string
    companyPhone?: string
    companyEmail?: string
    companyName?: string
    duns?: string
    refId?: string
    designation?: ContactDesignation
    langCode?: Option
    jurisdictionCountryCode?: Option
    tax?: SupplierTaxKeyField
    indirectTax?: SupplierTaxKeyField
    newSupplier?: boolean
}

export interface MasterDataRoleObject {
    code: string
    name: string
    description: string
}

export interface TrackedAttributes {
    values?: Option[]
    trackedAttributes?: any
    updatedBy?: any
    updated?: string
    diffs?: any
  }

export interface SupplierFormProps {
    processVariables?: ProcessVariables | null
    formData?: SupplierInputForm
    processType?: string
    countryOptions?: Option[]
    languageOptions?: Option[]
    supplierFormConfigurationFields?: Field[]
    seonEmailVerificationResponse?: SeonEmailVerificationResponse // need to add usage of this prop
    supplierRoles?: Array<MasterDataRoleObject>
    readonly?: boolean
    disabled?: boolean
    taxCodeFormatError?: boolean
    indirectTaxCodeFormatError?: boolean
    taxKeys?: EnumsDataObject[]
    isGptView?: boolean
    validateTaxFormat? (taxKey: string, alpha2CountryCode: string, data: EncryptedData, taxCode: string)
    onFormSubmit?: (data: SupplierInputForm) => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierInputForm | null) => void
    onPlaceSelect?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
    onValueChange?: (fieldName: string, updatedForm: SupplierInputForm) => void
    onClose?: () => void
}

export interface Field {
    fieldName: string
    modifiable: boolean
    requirement: string
    booleanValue: boolean
    type: string
    displayType: string
    configOnly: boolean
    title: string
    instruction: string
    order: number
    sectionTitle: string
    stringValue: string
    intValue: number
    itemConfig: ItemListConfig
    questionnaireId?: QuestionnaireId
    customLabel?: string
}

export interface ProjectFormData {
    marketingProgram?: Option
    activityName?: string
    allocadiaId?: string
    startDate?: string
    endDate?: string
    region?: Option
    service?: Option[]
    estimatedCost?: Cost
    currency?: string
    currencyChanged?: boolean
    subsidiary?: Option
    accountCode?: Option
    user?: string
    department?: Option
    summary?: string
}

export interface ProjectFormProps {
    formData?: ProjectFormData
    fields?: Field[]
    programOptions?: Option[]
    subsidiaryOptions?: Option[]
    accountCodeOptions?: Option[]
    departmentOptions?: Option[]
    categoryOptions?: Option[]
    regionOptions?: Option[]
    currencyOptions?: Option[]
    defaultCurrency?: string
    submitLabel?: string
    cancelLabel?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onSubmit?: (formData: ProjectFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ProjectFormData) => void
    onValueChange?: (fieldName: string, updatedForm: ProjectFormData) => void
}

export interface Contract {
    id?: string
    contractId?: string
    name: string
    description: string
    startDate?: string
    endDate?: string
    value?: Cost
    recurringSpend?: Cost
    status?: ContractStatus
    attachments?: Array<Attachment | File>
}

export type PurchaseType = 'new' | 'renew' | 'additional' | 'extension'

export interface SoftwareFormData {
    typeOfPurchase?: Option

    softwares?: Product[]
    description?: string
    replacingExisting?: boolean
    existingSoftware?: Product
    knowContract?: boolean
    existingContracts?: Contract[]
    additionalLicensesCount?: string
}

export interface SoftwareFormProps {
    formData?: SoftwareFormData
    fields?: Field[]
    typeOfPurchaseOptions?: Option[]
    currencyOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    onSearchSoftwares?: (keyword?: string) => Promise<Product[]>
    onSearchManufacturers?: (keyword?: string) => Promise<LegalEntity[]>
    onSearchContracts?: (keyword?: string) => Promise<Contract[]>
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string>
    onSubmit?: (formData: SoftwareFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SoftwareFormData) => void
    onValueChange?: (fieldName: string, updatedForm: SoftwareFormData, newFieldIndex?: number) => void
}

export interface SoftwareFormDataV2 {
    softwareSelection?: Option
    selectedSoftwares?: Product[]
    replacingExisting?: boolean
    existingSoftware?: Product
    existingContract?: Contract
    typeOfPurchase?: Option
    businessNeed?: string
    attachments?: Attachment[]
}

export interface SoftwareFormV2Props {
    formData?: SoftwareFormDataV2
    fields?: Field[]
    softwareSelectionOptions?: Option[]
    typeOfPurchaseOptions?: Option[]
    currencyOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    onSearchSoftwares?: (keyword?: string) => Promise<Product[]>
    onSearchSimilarSoftwares?: (keyword?: string) => Promise<Product[]>
    onSearchContracts?: (keyword?: string) => Promise<Contract[]>
    onSearchManufacturers?: (keyword?: string) => Promise<LegalEntity[]>
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string>
    onSubmit?: (formData: SoftwareFormDataV2) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SoftwareFormDataV2) => void
    onValueChange?: (fieldName: string, updatedForm: SoftwareFormDataV2, newFieldIndex?: number) => void
}

export const emptyEcncryptedData: EncryptedData = {
    version: '',
    data: '',
    iv: '',
    unencryptedValue: '',
    maskedValue: ''
}

export const emptyBankSuggestion: BankSuggestion = {
    name: 'string',
    address: getEmptyAddress(),
    code: '',
    type: ''
}

export const emptybankInformations: BankInformationsUpdateFormData = {
    bankInformations: [{bankName: '',
    bankAddress: getEmptyAddress(),
    accountHolder: '',
    accountHolderAddress: getEmptyAddress(),
    accountNumber: emptyEcncryptedData,
    omitAccountNumber: false,
    encryptedBankCode: emptyEcncryptedData,
    key: '' as BankKey,
    bankCode: '',
    bankCodeEncrypted: false,
    bankCodeError: false,
    bankSuggestion: emptyBankSuggestion,
    bankCountry: '',
    currencyCode: null}]
}

export interface FormBankInfo {
    currencyCode: Option
    bankName: string
    bankAddress?: Address
    accountHolder: string
    accountHolderAddress: Address
    accountNumber: EncryptedData
    omitAccountNumber?: boolean
    encryptedBankCode?: EncryptedData

    key: BankKey
    bankCode: string
    bankCodeEncrypted?: boolean
    bankCodeError?: boolean
    bankAccountType?: BankAccountType

    internationalKey: BankKey
    internationalCode: string
    internationalCodeError?: boolean
    omitInternalAccountNUmber?: boolean
    encryptedInternationalBankCode?: EncryptedData
    internationalCodeEncrypted?: boolean
}

export interface FormBankInfoUpdate {
    currencyCode: IDRef | null
    bankName: string
    bankAddress: Address
    accountHolder: string
    accountHolderAddress: Address
    accountNumber: EncryptedData
    omitAccountNumber?: boolean
    encryptedBankCode?: EncryptedData

    key: BankKey
    bankCode: string
    bankCodeEncrypted?: boolean
    bankCodeError?: boolean
    bankSuggestion?: BankSuggestion
    bankCountry: string
}

export interface BankInfoFormData {
    businessEmail?: string
    companyEntityCountryCode: string
    bankInformation: FormBankInfo
    intermediaryBankRequired: boolean
    intermediaryBankInformation: IntermediaryBankInfo | null
    instruction: string
    selectedExistingBankInfo?:boolean
    bankAccountTypeRequired?: boolean
    existingSelectedBankIndex?: number
    existingBankInfo?: Array<FormBankInfo>
}


export interface BankInformationsUpdateFormData {
    bankInformations: FormBankInfoUpdate[]
}

export type EnumsDataObject = {
    code: string
    name: string
    description?: string
    linkText?: string
    link?: string
    encrypted?: boolean
    omitAccountNumber?: boolean
}

export type BankSuggestion = {
    name: string,
    address: Address,
    code: string,
    type: string,
}

export interface BankAccountDetail {
    country: IDRef
    currencyCode: string
    omitBankCode: boolean
}

export type BankSuggestionAddress = {
    line1:string,
    city:string,
    province:string,
    alpha2CountryCode:string,
    postal:string,
}

export interface BankKeyLookupEntry {
    bankKey: BankKey | null
    bankCodeEncrypted: boolean
    omitAccountNumber: boolean
}

export interface BankInfoFormProps {
    formData?: BankInfoFormData
    fields?: Field[]
    submitLabel?: string
    cancelLabel?: string
    countryOptions?: Option[]
    currencyOptions?: Option[]
    bankKeys?: EnumsDataObject[]
    isCrossBorder?: boolean
    domesticKeyOptions?: BankKeyLookupEntry[] | null
    bankCodeError?: boolean
    internationalCodeError?: boolean
    intermediaryCodeError?: boolean
    isInPortal?: boolean
    isExistingBankSelected?: boolean
    existingBankInfo?: Array<FormBankInfo>
    onSubmit?: (formData: BankInfoFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => BankInfoFormData) => void
    onValueChange?: (fieldName: string, updatedForm: BankInfoFormData) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
}

export interface CountryBankKey {
    iso2: string | null
    domestic: BankKey | null
    international: BankKey | null
    domesticEncrypted: boolean
    omitDomesticAccountNumber: boolean
    internationEncrypted: boolean
    omitInternationalAccountNumber: boolean
    domesticMapping: string
    domesticKeyLookup: { [countryCode: string]: Array<BankKeyLookupEntry> | null } | null

    accountTypes: string[] | null
    domesticList: BankKey[] | null
    domesticIbanMandatory: IbanSupport | null
    internationalIbanMandatory: IbanSupport | null
  }

export interface BankInfoUpdateFormProps {
    indexPos?: number
    formData: FormBankInfoUpdate
    fields?: Field[]
    submitLabel?: string
    cancelLabel?: string
    countryOptions?: Option[]
    currencyOptions?: Option[]
    bankKeys?: EnumsDataObject[]
    bankSuggestions?: BankSuggestion[] | null
    domesticKeyOptions?: BankKeyLookupEntry[] | null
    countryCode?: string
    forceValidate?: boolean
    showDeleteIcon?: boolean
    expanded?: string | false
    onBankAccountChange?: (accountNumber: string) => Promise<BankAccountDetail | null>
    onBankKeySearch?: (bankCode: string) => Promise<Array<BankSuggestion>>
    onBankKeySuggest?: (countryCode: string, bankCode: string) => Promise<string>
    onBankKeyUpdate?: (key: string) => Promise<CountryBankKey>
    onSubmit?: (formData: FormBankInfoUpdate) => void
    onCancel?: () => void
    onChange?: (fieldName: string, data: FormBankInfoUpdate) => void
    onAccordionChange?: (event: React.SyntheticEvent, expanded: boolean) => void
    onReady?: (fetchData: (skipValidation?: boolean) => FormBankInfoUpdate) => void
    onValueChange?: (fieldName: string, updatedForm: FormBankInfoUpdate) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
    onDelete?: () => void
}

export interface BankInformationsUpdateFormProps {
    formData?: BankInformationsUpdateFormData
    fields?: Field[]
    currencyOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    countryOptions?: Option[]
    bankKeys?: EnumsDataObject[]
    bankSuggestions?: BankSuggestion[] | null
    domesticKeyOptions?: BankKeyLookupEntry[] | null
    countryCode?: string
    forceValidate?: boolean
    onBankAccountChange?: (accountNumber: string) => Promise<BankAccountDetail | null>
    onBankKeySearch?: (bankCode: string) => Promise<Array<BankSuggestion>>
    onBankKeySuggest?: (countryCode: string, bankCode: string) => Promise<string>
    onBankKeyUpdate?: (key: string) => Promise<CountryBankKey>
    onSubmit?: (formData: BankInformationsUpdateFormData) => void
    onCancel?: () => void
    onChange?: (data: BankInformationsUpdateFormData) => void
    onReady?: (fetchData: (skipValidation?: boolean) => BankInformationsUpdateFormData) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
}

export interface TaxInfoFormData {
    taxId: string
}

export interface TaxInfoFormProps {
    formData?: TaxInfoFormData
    fields?: Field[]
    submitLabel?: string
    cancelLabel?: string
    onSubmit?: (formData: TaxInfoFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => TaxInfoFormData) => void
    onValueChange?: (fieldName: string, updatedForm: TaxInfoFormData) => void
}

export type TaxKey = 'ein' | 'vies' | 'utr' | 'ecn' | 'pan' | 'abn' | 'uen' | 'tin' | 'gst_hst'
export type TaxFormKey = 'w_8bene' | 'w_8imy' | 'w_9' | 'certificateIncorporation'

export interface CompanyInfoFormData {
    companyName: string
    legalName: string
    useCompanyName: boolean
    website: string
    address: Address
    primary: Contact
    paymentContactEmail: string
    taxAddress: Address
    useCompanyAddress: boolean
    companyEntityCountryCode: string
    usCompanyEntityType: Option | null

    taxKey: TaxKey | null
    encryptedTaxCode: EncryptedData
    taxCodeError: boolean

    taxFormKey: TaxFormKey | null
    taxForm: Attachment | File | null

    foreignTaxClassification: Option | null

    usForeignTaxFormKey: TaxFormKey | null
    usForeignTaxForm: Attachment | File | null

    specialTaxStatus: boolean
    specialTaxNote: string
    specialTaxAttachment: Attachment | File | null

    foreignTaxKey: TaxKey | null
    encryptedForeignTaxCode: EncryptedData
    foreignTaxCodeError: boolean

    foreignTaxFormKey: TaxFormKey | null
    foreignTaxForm: Attachment | File | null

    registryQuestion: string
    inRegistry: boolean
}

export interface CompanyInfoV2FormData {
    companyName: string
    legalName: string
    useCompanyName: boolean
    website: string
    duns: string
    email: string
    phone: string
    address: Address
    primary: Contact
    paymentContactEmail: string
    taxAddress: Address
    useCompanyAddress: boolean
    companyEntityCountryCode: string
    usCompanyEntityType: Option | null

    taxFormKey: TaxFormKey | null
    taxForm: Attachment | File | null
    taxFormKeysList: Array<Option>

    foreignTaxClassification: Option | null

    usForeignTaxFormKey: TaxFormKey | null
    usForeignTaxForm: Attachment | File | null

    specialTaxStatus: boolean
    specialTaxNote: string
    specialTaxAttachment: Attachment | File | null

    foreignTaxKey: TaxKey | null
    encryptedForeignTaxCode: EncryptedData
    foreignTaxCodeError: boolean

    foreignTaxFormKey: TaxFormKey | null
    foreignTaxForm: Attachment | File | null

    registryQuestion: string
    inRegistry: boolean

    taxKey: TaxKey | null
    taxKeysList: Array<Option>
    encryptedTaxCode: EncryptedData
    taxCodeError: boolean
    indirectTaxCodeError: boolean,
    exemptionTaxCodeError: boolean

    indirectTaxKey: TaxKey | null
    indirectTaxKeysList: Array<Option>
    encryptedIndirectTaxCode: EncryptedData
    
    usTaxDeclarationFormKey: TaxFormKey | null
    usTaxDeclarationFormsList: Array<Option>
    usTaxDeclarationForm: Attachment | File | null

    exemptionTaxKey: TaxKey | null
    exemptionTaxKeysList: Array<Option>
    encryptedExemptionTaxCode: EncryptedData

    tax1099Required: boolean
    tax1099: Option | null

    taxCodeValidationTimeout: boolean
    indirectTaxCodeValidationTimeout: boolean
    exemptionTaxCodeValidationTimeout: boolean

    instruction: string
}

export interface TaxFormOCRCompanyInfo {
    name: string
    address: Address | null
    ein: string
    ssn: EncryptedData | null
    taxId: string
    companyEntityType: string
    fTin: string
    giin: string
    entityReceivingPayment: string
}

export interface OCRInfo {
    taxFormKey: string
    ocrFailed: boolean
    ocred: boolean
    companyInfo: TaxFormOCRCompanyInfo | null
}

export interface SupplierTaxKeyField {
    taxKeysList: Array<string>
    taxKey: string
    encryptedTaxCode: EncryptedData | null
    taxCodeError: boolean
    taxCodeValidationTimeout: boolean
}
  
export interface SupplierTaxFormKeyField {
    taxFormKeysList: Array<string>
    taxFormKey: string
    taxForm: Attachment | null
    ocrInfo?: OCRInfo | null
}

export interface  MultiLingualAddress {
    language: string
    legalName: string
    address: Address | null
}

export interface CompanyInfoV4FormData {
    companyName: string
    email: string
    phone: string
    fax: string
    useCompanyName: boolean
    jurisdictionCountryCode: string
    legalName: string
    website: string
    address: Address | null
    duns: string
    primary: Contact | null
    paymentContactEmail: string
    useCompanyAddress: boolean
    taxAddress: Address | null
    companyEntityCountryCodes: Array<string>
    companyEntities?: Array<IDRef>
    usCompanyEntityType: IDRef | null
    tax: SupplierTaxKeyField
    taxForm: SupplierTaxFormKeyField
    indirectTax: SupplierTaxKeyField
    indirectTaxForm: SupplierTaxFormKeyField
    usTaxDeclarationFormKey: string
    usTaxDeclarationForm: Attachment | null
    foreignTaxClassification: IDRef | null
    tax1099Required: boolean
    tax1099: boolean | undefined | null
    specialTaxStatus: boolean | undefined | null
    specialTaxNote: string
    specialTaxAttachments: Array<Attachment>
    instruction: string
    additionalDocsList: Array<string>
    additionalDocuments: Array<SupplierTaxFormKeyField>
    usTaxDeclarationFormOcrInfo?: OCRInfo | null
    multiLingualAddresses?: Array<MultiLingualAddress>
    formApplicableForExtension?: boolean
    newSupplierSelected?: boolean
    showExistingOrExtensionSelection?: boolean
    allowSubsidiaryEntitySelection?: boolean
}

export interface CompanyInfoV3FormData {
    companyName: string
    email: string
    phone: string
    fax: string
    useCompanyName: boolean
    jurisdictionCountryCode: string
    legalName: string
    website: string
    address: Address | null
    duns: string
    primary: Contact | null
    paymentContactEmail: string
    useCompanyAddress: boolean
    taxAddress: Address | null
    companyEntityCountryCodes: Array<string>
    usCompanyEntityType: IDRef | null
    tax: SupplierTaxKeyField
    taxForm: SupplierTaxFormKeyField
    indirectTax: SupplierTaxKeyField
    indirectTaxForm: SupplierTaxFormKeyField
    usTaxDeclarationFormKey: string
    usTaxDeclarationForm: Attachment | null
    foreignTaxClassification: IDRef | null
    tax1099Required: boolean
    tax1099: boolean | undefined | null
    specialTaxStatus: boolean | undefined | null
    specialTaxNote: string
    specialTaxAttachments: Array<Attachment>
    instruction: string
    additionalDocsList: Array<string>
    additionalDocuments: Array<SupplierTaxFormKeyField>
    usTaxDeclarationFormOcrInfo?: OCRInfo | null
    multiLingualAddresses?: Array<MultiLingualAddress>
}

export interface CompanyIndividualInfoV2FormData {
    firstName: string
    middleName: string
    lastName: string
    companyName: string
    email: string
    phone: string
    address: Address
    usCompanyEntityType: Option | null
    companyEntityCountryCode: string

    foreignTaxClassification: Option | null

    taxFormKeysList: Array<Option>
    taxFormKey: TaxFormKey | null
    taxForm: Attachment | File | null

    specialTaxStatus: boolean
    specialTaxNote: string
    specialTaxAttachment: Attachment | File | null

    taxKey: TaxKey | null
    taxKeysList: Array<Option>
    encryptedTaxCode: EncryptedData

    indirectTaxKey: TaxKey | null
    indirectTaxKeysList: Array<Option>
    encryptedIndirectTaxCode: EncryptedData
    
    usTaxDeclarationFormKey: TaxFormKey | null
    usTaxDeclarationFormsList: Array<Option>
    usTaxDeclarationForm: Attachment | File | null

    exemptionTaxKey: TaxKey | null
    exemptionTaxKeysList: Array<Option>
    encryptedExemptionTaxCode: EncryptedData
    tax1099Required: boolean
    tax1099: Option | null

    taxCodeError: boolean
    exemptionTaxCodeError: boolean
    taxCodeValidationTimeout: boolean
    exemptionTaxCodeValidationTimeout: boolean
    instruction: string
}

export interface CompanyInfoFormProps {
    formData?: CompanyInfoFormData
    fields?: Field[]
    countryOptions?: Option[]
    usCompanyEntityTypeOptions?: Option[]
    usForeignTaxClassificationOptions?: Option[]
    taxKeys?: EnumsDataObject[]
    taxFormKeys?: EnumsDataObject[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onFileUpload?: (file: File, fieldName: string) => void
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    onSubmit?: (formData: CompanyInfoFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => CompanyInfoFormData) => void
    onValueChange?: (fieldName: string, updatedForm: CompanyInfoFormData) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
}

export interface CompanyInfoV2FormProps {
    formData?: CompanyInfoV2FormData
    fields?: Field[]
    countryOptions?: Option[]
    usCompanyEntityTypeOptions?: Option[]
    usForeignTaxClassificationOptions?: Option[]
    taxKeys?: EnumsDataObject[]
    taxFormKeys?: EnumsDataObject[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    taxCodeFormatError: boolean
    indirectTaxCodeFormatError: boolean
    exemptionTaxCodeFormatError: boolean
    nameMismatch: {mismatch: boolean, name: string}
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onValidateTINFormat?: (taxKey: string, alpha2CountryCode: string, encryptedTaxCode: EncryptedData, taxCode: string) => void
    onFileUpload?: (file: File, fieldName: string) => void
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    onSubmit?: (formData: CompanyInfoV2FormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => CompanyInfoV2FormData) => void
    onValueChange?: (fieldName: string, updatedForm: CompanyInfoV2FormData) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
}

export interface CompanyInfoV3FormProps {
    formData?: CompanyInfoV3FormData
    companyEntityCountryCodes?: Array<string>
    companyEntities?: Array<IDRef>
    fields?: Field[]
    ocredDoc?: IDocument
    countryOptions?: Option[]
    languageOptions?: Option[]
    isOcrEnabled?: boolean
    usCompanyEntityTypeOptions?: Option[]
    usForeignTaxClassificationOptions?: Option[]
    taxKeys?: EnumsDataObject[]
    taxFormKeys?: EnumsDataObject[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    taxCodeFormatError: boolean
    indirectTaxCodeFormatError: boolean
    nameMismatch: {
        mismatch: boolean
        name: string
    };
    newTaxFormUploaded?: { fieldName: string, taxFormKey: string }
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    resetNewTaxFormUploaded?:() => void
    onValidateTINFormat?: (taxKey: string, alpha2CountryCode: string, encryptedTaxCode: EncryptedData, taxCode: string) => void
    onFileUpload?: (file: File, fieldName: string) => void
    onFileDelete?: (fieldName: string) => void
    onSpecialTaxFileUpload?: (file: File, fieldName: string, newForm: CompanyInfoV3FormData) => void
    onSpecialTaxFileDelete?: (fieldName: string, newForm: CompanyInfoV3FormData) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    loadOcredDocument?: (fieldName: string, type?: string, fileName?: string) => void
    onSubmit?: (formData: CompanyInfoV3FormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => CompanyInfoV3FormData | null) => void
    onValueChange?: (fieldName: string, updatedForm: CompanyInfoV3FormData) => void
    onPlaceSelectParseAddress?: (data: any) => Promise<Address>
}

export interface CompanyInfoV4FormProps {
    formData?: CompanyInfoV4FormData
    companyEntityCountryCodes?: Array<string>
    companyEntities?: Array<IDRef>
    fields?: Field[]
    ocredDoc?: IDocument
    countryOptions?: Option[]
    languageOptions?: Option[]
    isOcrEnabled?: boolean
    usCompanyEntityTypeOptions?: Option[]
    usForeignTaxClassificationOptions?: Option[]
    taxKeys?: EnumsDataObject[]
    taxFormKeys?: EnumsDataObject[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    taxCodeFormatError: boolean
    indirectTaxCodeFormatError: boolean
    nameMismatch: {
        mismatch: boolean
        name: string
    };
    hideEdit?: boolean
    existingCompanyInfo?: CompanyInfoV4FormData
    newTaxFormUploaded?: { fieldName: string, taxFormKey: string }
    handleFormReady?: (fetchData: (skipValidation?: boolean) => CompanyInfoV4FormData | null) => void
    loadFile?: (fieldName: string, attachment: Attachment) => void
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    resetNewTaxFormUploaded?:() => void
    onValidateTINFormat?: (taxKey: string, alpha2CountryCode: string, encryptedTaxCode: EncryptedData, taxCode: string) => void
    onFileUpload?: (file: File, fieldName: string) => void
    onFileDelete?: (fieldName: string, attachment: Attachment) => void
    onSpecialTaxFileUpload?: (file: File, fieldName: string, newForm: CompanyInfoV4FormData) => void
    onSpecialTaxFileDelete?: (fieldName: string, newForm: CompanyInfoV4FormData, attachment: Attachment) => void
    loadDocument?: (fieldName: string, attachment: Attachment) => Promise<Blob>
    loadOcredDocument?: (fieldName: string, attachment: Attachment) => void
    onSubmit?: (formData: CompanyInfoV4FormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => CompanyInfoV4FormData | null) => void
    onValueChange?: (fieldName: string, updatedForm: CompanyInfoV4FormData) => Promise<boolean>
    onPlaceSelectParseAddress?: (data: any) => Promise<Address>
}

export interface CompanyIndividualInfoV2FormProps {
    formData?: CompanyIndividualInfoV2FormData
    fields?: Field[]
    countryOptions?: Option[]
    usCompanyEntityTypeOptions?: Option[]
    usForeignTaxClassificationIndividualOptions?: Option[]
    taxKeys?: EnumsDataObject[]
    taxFormKeys?: EnumsDataObject[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    taxCodeFormatError: boolean
    exemptionTaxCodeFormatError: boolean
    onFileUpload?: (file: File, fieldName: string) => void
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    onSubmit?: (formData: CompanyIndividualInfoV2FormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => CompanyIndividualInfoV2FormData) => void
    onValueChange?: (fieldName: string, updatedForm: CompanyIndividualInfoV2FormData) => void
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
    onValidateTINFormat?: (taxKey: string, alpha2CountryCode: string, encryptedTaxCode: EncryptedData, taxCode: string) => void
}

export interface ReviewFormProps {
    // contact?: Contact
    // comment?: string
    // processDefinition: ProcessDefinition
    readOnly?: boolean
    steps: Array<ProcessStep>
    fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
    // onCommentChange?: (comment: string) => void
}

export interface QuotesDetailProps {
    proposals: Array<Attachment>
    additionalDocs: Array<Attachment>
    readonly?: boolean
    onFileUpload?: (file: File, fieldName: string, fileName: string) => Promise<boolean>
    deleteFile?: (fieldName: string) => void
}

export interface QuotesDetailReadonlyProps {
    proposals?: Array<Attachment>
    additionalDocs?: Array<Attachment>
    paymentTerm?: IDRef
    askForLegalReview?: boolean
}

export interface UseFormData {
    title?: string
    region?: Option
    service?: Option[]
    subsidiary?: Option
    additionalSubsidiary?: Option[]
    user?: string
    department?: Option
    comment?: string
}

export interface PartnerUseFormData {
    title?: string
    region?: Option
    service?: Option[]
    subsidiary?: Option
    additionalSubsidiary?: Option[]
    user?: string
    department?: Option
    comment?: string
}

export interface UseFormProps {
    formData?: UseFormData
    fields?: Field[]
    subsidiaryOptions?: Option[]
    additionalSubsidiaryOptions?: Option[]
    departmentOptions?: Option[]
    categoryOptions?: Option[]
    regionOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onSubmit?: (formData: UseFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => UseFormData) => void
    onValueChange?: (fieldName: string, updatedForm: UseFormData) => void
}

export interface PartnerUseFormProps {
    formData?: PartnerUseFormData
    fields?: Field[]
    subsidiaryOptions?: Option[]
    additionalSubsidiaryOptions?: Option[]
    crmID?: string
    departmentOptions?: Option[]
    categoryOptions?: Option[]
    regionOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onSubmit?: (formData: PartnerUseFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => PartnerUseFormData) => void
    onValueChange?: (fieldName: string, updatedForm: PartnerUseFormData) => void
}

export const VENDOR_CREATION_METHOD_SYSTEM = 'system'
export const VENDOR_CREATION_METHOD_MANUAL = 'manual'

export interface APFormData {
    method?: Option
    companyEntity?: Option
    additionalCompanyEntities?: Option[]
    eligible1099?: boolean
    syncToProcurement?: boolean
    paymentTerms?: Option
    currency?: Option
    expenseAccount?: Option
    vendorId?: string
    vendorError?: string
    vendorErrorId?: string // TODO: use this to show Supplier Profile page link
    classification?: Option
}

export interface APFormProps {
    formData?: APFormData
    fields?: Field[]
    methodOptions?: Option[]
    subsidiaryOptions?: Option[]
    additionalSubsidiaryOptions?: Option[]
    paymentTermOptions?: Option[]
    currencyOptions?: Option[]
    expenseAccountOptions?: Option[]
    classificationOptions?: Option[]
    isInPortal?: boolean
    submitLabel?: string
    cancelLabel?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onSubmit?: (formData: APFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => APFormData) => void
    onValueChange?: (fieldName: string, updatedForm: APFormData) => void
}

export interface SupplierDetailReadonlyProps {
    selectedSuppliers?: Array<Supplier>
    processVariables?: ProcessVariables | null
    onDownloadAttachment?: (fieldName: string, type: string, fileName: string) => void
    onDownloadInFileAttachment?: (vendorId: string | null | undefined, fileType: string, fileName: string | undefined) => void
    trackedAttributes?: TrackedAttributes
}

export interface DataPrivacyFormData {
    personalIdentifiableInf: boolean | null
    localRegulatoryEU: boolean | null
    localRegulatoryCalifornia: boolean | null
}

export interface ItSecurityFormData {
    employeeLogin: boolean | null
    externalUserCheck: boolean | null
}

export interface ItDataSecurityFormData {
    companySensitiveData: boolean | null
    systemAccessCheck: boolean | null
}

export interface FinancialRiskFormData {
    companyLiability: boolean | null
    supplierLiability: boolean | null
}

export interface IntellectualPropertyFormData {
    companyRights: boolean | null
    accessToCompanyIP: boolean | null
    confidentiality: boolean | null
}

export interface DataPrivacyFormProps {
    isLocalizationEnabled?: boolean
    formData?: DataPrivacyFormData
    submitLabel?: string
    cancelLabel?: string
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => DataPrivacyFormData) => void
    onSubmit?: (formData: DataPrivacyFormData) => void
}

export interface ItSecurityFormProps {
    formData?: ItSecurityFormData
    submitLabel?: string
    cancelLabel?: string
    companyName?: string
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ItSecurityFormData) => void
    onSubmit?: (formData: ItSecurityFormData) => void
}

export interface ItDataSecurityFormProps {
    formData?: ItDataSecurityFormData
    submitLabel?: string
    cancelLabel?: string
    companyName?: string
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ItDataSecurityFormData) => void
    onSubmit?: (formData: ItDataSecurityFormData) => void
}

export interface FinancialRiskFormProps {
    formData?: FinancialRiskFormData
    submitLabel?: string
    cancelLabel?: string
    companyName?: string
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => FinancialRiskFormData) => void
    onSubmit?: (formData: FinancialRiskFormData) => void
}

export interface IntellectualPropertyFormProps {
    formData?: IntellectualPropertyFormData
    submitLabel?: string
    cancelLabel?: string
    companyName?: string
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => IntellectualPropertyFormData) => void
    onSubmit?: (formData: IntellectualPropertyFormData) => void
}

export interface Product {
    id?: string
    name: string
    companyName?: string
    description?: string
    image?: string
    plans?: string[]
    shortDescription?: string
    website?: string
    categoryCode?: string[]
    categoryNames?: string[]
    companyOroId?: string
    isPreferred?: boolean
    isContractActive?: boolean
    hasSimilar?: boolean // temp
    owner?: User
}

export interface ProductLine {
    id: string
    product?: Product
    plan?: string
    unit?: string
    term?: string
    quantity?: string
    description?: string
    totalPrice?: Cost
    billing?: Option
}

export function getEmptyProductLine(): ProductLine {
    return {
        id: 'temp_' + Math.random(),
        product: undefined,
        quantity: '',
        description: '',
        totalPrice: undefined
    }
}

export interface PurchaseFormData {
    purchaseType?: string
    requestType?: Option
    products?: ProductLine[]
    additionalServices?: ProductLine[]
    contractStart?: string
    contractEnd?: string
    currency?: string
    currencyChanged?: boolean
    orderForm?: Attachment | File
    quote?: Attachment | File
    user?: string
    department?: Option
    companyEntity?: Option
    accountCode?: Option
    estimatedTotal?: Cost
    paymentMethod?: string
    summary?: string
}

export interface PurchaseFormProps {
    formData?: PurchaseFormData
    fields?: Field[]
    requestTypeOptions?: Option[]
    departmentOptions?: Option[]
    companyEntityOptions?: Option[]
    accountCodeOptions?: Option[]
    currencyOptions?: Option[]
    billingOptions?: Option[]
    defaultCurrency?: string
    submitLabel?: string
    cancelLabel?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onProductSearch?: (query: string) => Promise<Array<Product>>
    onValueChange?: (fieldName: string, updatedForm: PurchaseFormData) => void
    onFileUpload?: (file: File, fieldName: string, fileName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => PurchaseFormData) => void
    onSubmit?: (formData: PurchaseFormData) => void
}

export type TeamRole = 'Member' | 'Owner' | 'CoOwner'

export interface TeamMember extends User {
    teamRole?: TeamRole
    note?: string
}

export interface TeamFormData {
    users: Array<TeamMember>
    supplierContacts: Array<SupplierUser> | null
}

export enum TeamFormAction {
    addedMembers = 'addedMembers',
    deletedMembers = 'deletedMembers',
    updatedMember = 'updatedMember'
}

export interface TeamFormProps {
    formData?: TeamFormData,
    isSupplier?: boolean
    isRunnerApp?: boolean
    existingSupplierContacts?: Array<SupplierUser>
    supplierRoleOptions?: Array<MasterDataRoleObject>
    submitLabel?: string
    cancelLabel?: string
    hasEditPermission?: boolean
    isSensitive?: boolean
    isUserNotExistInPgm?: string
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => TeamFormData) => void
    onUserSearch?: (query: string) => Promise<Array<User>>
    onUserChanges?: (users: Array<TeamMember>) => void
    onRoleChange?: () => void
    onCreateSupplierContact?: (newContact: SupplierUser, image?: File) => Promise<boolean>
    onValueChange?: (fieldName: string, updatedForm: TeamFormData, action?: TeamFormAction, userRole?: TeamRole) => void
    onSubmit?: (formData: TeamFormData) => void
}

export enum TimeUnit {
    day = 'day',
    month = 'month',
    quarter = 'quarter',
    year = 'year',
    week = 'week'
}

export interface TimeData {
    id?: string;
    start?: string;
    end?: string;
    timeUnit?: TimeUnit;
    moneyAmount: Money
    numberAmount?: number
    index?: string
    approved?: boolean
    approvalStatus?: string
    value?: string
}

export enum KPIUnit {
    money = 'money',
    number = 'number'
}

export interface KPIType {
    unit: KPIUnit;
    title: string;
}

export interface KPI {
    timeUnit?: TimeUnit
    title?: string
    engagementId?: string
    type?: KPIType
    estimate?: TimeData
    actualTotal?: TimeData
    unit?: KPIUnit
    start?: string
    duration?: number
    projections?: Array<TimeData>
    actuals?: Array<TimeData>
    captureActual?: boolean
    projectionLocked?: boolean
}

export interface OroEbitDetail {
    kpi: KPI
}

export interface MeasureDate {
    start: string
    name: string
    index: number
    displayName: string
}

export interface OroMeasureMilestone {
    start: string | null
    end: string | null
    measuerDates?: Array<MeasureDate>
}

export interface MeasureDetailsFormData {
    name: string | null
    type: Option | null
    estimate: Cost | null
    businessSegments?: Array<Option> | null
    owner: Option | null
    sensitive: boolean
    workstream: Option | null
    id: string | null
    locations?: Array<Option> | null

    situation?: string | null
    action?: string | null
    benefit?: string | null
    other?: string | null
    additionalDocs?: Array<Attachment | File>
    docUrls?: string | null

    supplier?: Option
    impactCategory?: Option
    workArea?: Option
    priority?: StandardPriority
    relatedMeasures?: Option[]
    businessRegion?: Option
    financialImpactType?: Option
    ebitLabel?: string
}

export interface MeasureMilestoneProps {
    formData: OroMeasureMilestone
    skipTitle?: boolean
    hideILName?: boolean
    isHorizontal?: boolean
    activeIndex?: number
    isLoading?: boolean
    readonly?: boolean
    onReady?: (fetchData: (skipValidation?: boolean) => OroMeasureMilestone) => void
    onSubmit?: (formData: OroMeasureMilestone) => void
    onValueChange?: (formData: OroMeasureMilestone) => void
    getLocalProcessLabels?: (processName: string) => Promise<LocalLabels | undefined>
}

export interface MeasureMilestoneReadonlyProps {
    formData: OroMeasureMilestone
}

export interface EBITDetailProps {
    formData: OroEbitDetail
    ebitLabel?: string
    errorMessage?: string
    skipTitle?: boolean
    onReady?: (fetchData: (skipValidation?: boolean) => OroEbitDetail) => void
    onSubmit?: (formData: OroEbitDetail) => void
    onValueChange?: (formData: OroEbitDetail) => void
}

export interface EBITDetailReadonlyProps {
    formData: OroEbitDetail,
    ebitLabel?: string
}

export interface MeasureDetailProps {
    formData: MeasureDetailsFormData
    fields?: Field[]
    isEbitRequest?: boolean
    currency?: string
    businessSegmentOptions?: Option[]
    workstreamOptions?: Option[]
    locationOptions?: Option[]
    impactCategoryOptions?: Option[]
    workAreas?: Option[]
    financialImpactTypeOptions?: Option[]
    businessRegionOptions?: Option[]
    canMakeSensitive?: boolean
    canSetFinancialImpact?: boolean
    skipTitle?: boolean
    submitLabel?: string
    cancelLabel?: string
    isEditInline?: boolean
    isInPortal?: boolean
    disableSupplier?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onUserSearch?: (keyword: string) => Promise<Option[]>
    onSupplierSearch?: (keyword: string) => Promise<Option[]>
    onMeasuresSearch?: (keyword: string) => Promise<Option[]>
    onFileUpload?: (file: File, fieldName: string) => void
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string>
    onReady?: (fetchData: (skipValidation?: boolean) => MeasureDetailsFormData) => void
    onValueChange?: (fieldName: string, formData: MeasureDetailsFormData, fieldIndex?: number) => void
    onCancel?: () => void
    onSubmit?: (formData: MeasureDetailsFormData) => void
}

export interface MeasureDetailReadonlyProps {
    formData: MeasureDetailsFormData
    fields?: Field[]
    isEbitRequest?: boolean
    linkedEngagements?: Array<IDRef>
    currency?: string
    disableSupplier?: boolean
    trackedAttributes?: TrackedAttributes
    loadDocument?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob | string>
    onMeasureClick?: (measure: Option) => void
}

export interface CostDetail {
    costDetails: string
    costDate: string
    moneyAmount: Money
}

export interface CostDetailsItemProps {
    costDetail: CostDetail
    forceValidate?: boolean
    onDelete?: () => void
    onChange?: (data: CostDetail) => void
}

export interface CostFormData {
    costs: CostDetail[]
}

export interface CostDetailsFormProps {
    formData: CostFormData
    skipTitle?: boolean
    submitLabel?: string
    cancelLabel?: string
    onChange?: (value: CostDetail[]) => void
    onReady?: (fetchData: (skipValidation?: boolean) => CostFormData | null) => void
    onCancel?: () => void
    onSubmit?: (formData: CostFormData) => void
}

export interface CostFormReadOnlyProps {
    formData: CostFormData
}

export interface DocumentFormData {
    type: Option | null
    name: string
    startDate: string
    endDate: string
    attachment: Attachment | File | null
    owner: Option | null
    notes: string
}

export interface DocumentFormProps {
    formData: DocumentFormData
    fields?: Field[]
    documentTypeOptions?: Option[]
    ownerOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    onCancel?: () => void
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    onReady?: (fetchData: (skipValidation?: boolean) => DocumentFormData) => void
    onUserSearch?: (query: string) => Promise<Array<User>>
    onValueChange?: (fieldName: string, updatedForm: DocumentFormData) => void
    onSubmit?: (formData: DocumentFormData) => void
}

export interface OtherKpiFormData {
    otherKpi: string[]
}

export interface OtherKpiFormProps {
    formData: OtherKpiFormData
    skipTitle?: boolean
    submitLabel?: string
    cancelLabel?: string
    onChange?: (value: string[]) => void
    onReady?: (fetchData: (skipValidation?: boolean) => OtherKpiFormData) => void
    onCancel?: () => void
    onSubmit?: (formData: OtherKpiFormData) => void
}

export interface OtherKpiItemProps {
    kpi: string
    forceValidate?: boolean
    onChange?: (kpi: string) => void
    onDelete?: () => void
}

export interface OtherKpiReadOnlyFormProps {
    formData: OtherKpiFormData
}

export enum RiskLevel {
    low = 'low',
    high = 'high',
    medium = 'medium'
}

export enum enumRiskFormFields {
    level = "level",
    notes = "notes"
}

export interface RiskValidationFormData {
    oroRiskScore?: OroRiskScore | null
    manualScore?: OroRiskScore | null
    noteAttachments?: Attachment[] | null
}

export interface AdditionalRiskIdentifiers {
    currencyCode?: string | null
}

export interface OroRiskScore {
    overallScore?: number | null
    overallLevel?: string | null
    score?: number | null
    level?: string | null
    notes?: string[] | null
    noteAttachments?: Attachment[] | null
    accountNumber?: EncryptedData
    manualRiskScore?: RiskScoreDetails | null
    customRiskScore?: RiskScoreDetails | null
    manualRiskScoreHistory?: Array<RiskScoreDetails> | null
    emailRiskScore?: Array<RiskScoreDetails> | null
    domainRiskScore?: Array<RiskScoreDetails> | null
    assessmentRiskScore?: Array<RiskScoreDetails> | null
    bankAccountRiskScore?: Array<RiskScoreDetails> | null
    sanctionRiskScore?: Array<RiskScoreDetails> | null
    sustainabilityScore?: Array<RiskScoreDetails> | null
    oroRiskScore?: RiskScoreDetails | null
}

export interface RiskScoreDetails {
    score: number | null
    level: string | null
    notes?: string[] | null
    serviceName: string | null
    userId?: UserId | null
    creationTime?: string | null
    accountNumber?: EncryptedData | null
    riskScore?: boolean | null
    identifier?: string | null
    additionalIdentifiers?: AdditionalRiskIdentifiers | null
    minScore?: number
    maxScore?: number
    error?: string | null
    url?: string | null
    details?: SanctionListDetails | null
    noteAttachments?: Attachment[] | null
    type?: IDRef | null
}

export interface RiskDataValidationFormProps {
    formData?: RiskValidationFormData
    fields?: Field[]
    submitLabel?: string
    cancelLabel?: string
    riskLevelOptions?: Option[]
    readOnly?: boolean
    isInPortal?: boolean
    formId?: string
    onSubmit?: (formData: RiskValidationFormData) => Promise<boolean>
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => RiskValidationFormData) => void
    onValueChange?: (fieldName: string, updatedForm: RiskValidationFormData) => void
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string, path?: string) => Promise<Blob>
}

export interface IcebergChartProps {
    formData: Array<IcebergChartData>
    timeunit?: IcebergTimeUnit
    waterlineIndex?: number
}

export interface IcebergChartData {
    date: string
    ils?: Array<ILSummary>
    measures?: string
    amount?: number
    milestone?: string
    negative?: boolean
    name?: string
    netAmount?: number
}

export interface ILSummary {
    measures: string
    amount: number
    milestone: string
    negative: boolean
    name?: string
    date?: string
}

export enum IcebergTimeUnit {
    monthly = 'monthly',
    weekly = 'weekly',
    forecast = 'forecast'
}

export interface OroSupplierInformationUpdateForm {
    companyName: string
    guid: string
    vendorId: string
    vendorType: IDRef | null
    vendorCountry: string
    compantyEntity: IDRef | null
    spend: Money | null
    hasSupplierEmail: boolean
    supplierContactEmail?: string
    isNewSupplier: boolean | null
    taxRegistrationID: string
    companyDomain: string
}

export interface OroSupplierInformationUpdateFormProps {
    data: OroSupplierInformationUpdateForm
    fields?: Field[]
    skipTitle?: boolean
    companyEntities: Array<Option>
    vendorTypes: Array<Option>
    countries: Array<Option>
    currencies: Array<Option>
    defaultCurrency?: string
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onReady?: (fetchData: (skipValidation?: boolean) => OroSupplierInformationUpdateForm) => void
    onSubmit?: (formData: OroSupplierInformationUpdateForm) => void
    onValueChange?: (formData: OroSupplierInformationUpdateForm) => void
}

export type TabGroups = 'callbackdetails' | 'callbackhistory'

export enum CallBackCommunicationMode {
    phone = 'phone',
    email = 'email'
}

export interface BankCallbackFormData {
    callbackTime: string
    callbackTo?: string
    nameOfContact?: string
    titleAndDesignation?: string
    method?: string
    contactSource?: string
    contactSources?: Option[]
    phoneNumber?: string
    email?: string
    note?: string
    invoiceAmountValidated?: boolean
    outcomes?: Array<CallbackOutcome>
    callbackHistory?: CallbackHistory[]
    callbackEvents?: CallbackEvents[]
    noteAttachments?: Attachment[]
}

export interface CallbackOutcome {
    index: number
    accountNumber: EncryptedData
    code: string
    codeRef?: IDRef
}

export interface CallbackHistory {
    callback?: string
    email?: string
    phone?: string
    notes?: string
    userId?: UserId
    creationTime?: string
}

export interface CallbackEvents {
    requester: UserId
    callbackTime: string
    method: CallBackCommunicationMode  
    callbackTo: string  
    contactSource: string
    contactSources: IDRef[]
    phoneNumber: string
    email: string
    note: string
    noteAttachments?: Attachment[]
}

export interface ContractUpdateSummaryFormData {
    supplier: Supplier | null
    startDate: string
    endDate: string
    totalAmount: Money | null
    annualRecurring: Money | null
    renewalDate: string
    department: IDRef | null
    companyEntity: IDRef | null
    requester: UserId | null
    businessOwners: Array<UserId>
    documents: Array<Document>
    contractType: IDRef | null
    selectedProduct: IDRef | null
    contractId: string
    id: string
}

export interface BankCallbackFormProps {
    formData?: BankCallbackFormData
    trackedAttributes?: TrackedAttributes
    fields?: Field[]
    submitLabel?: string
    cancelLabel?: string
    callBackToOptions?: Option[]
    callBackOptions?: Option[]
    outcomeOptions?: Option[]
    isInPortal?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onSubmit?: (formData: BankCallbackFormData) => Promise<boolean>
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => BankCallbackFormData) => void
    onValueChange?: (fieldName: string, updatedForm: BankCallbackFormData) => void
    onTabSelect?: (tab: TabGroups) => void
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string, path?: string) => Promise<Blob>
}

export interface ContractUpdateSummaryFormProps {
    formData?: ContractUpdateSummaryFormData
    fields?: Field[]
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    contractDetail?: ContractDetail
    dataFetchers?: DataFetchers
    events?: Events
    documentTypeOption?: Option[]
    onSubmit?: (formData: ContractUpdateSummaryFormData) => Promise<boolean>
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ContractUpdateSummaryFormData) => void
    onValueChange?: (fieldName: string, updatedForm: ContractUpdateSummaryFormData) => void
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onFileDelete?: (fieldName: string) => void
    loadDocument?: (fieldName: string, type?: string, fileName?: string, path?: string) => Promise<Blob>
}

export interface ContractFormProps extends LegalDocumenListNewProps {
  formData?: ContractFormData
  trackedAttributes?: TrackedAttributes
  submitLabel?: string
  cancelLabel?: string
  isInPortal?: boolean;
  currencies?: Array<Option>
  paymentTermOptions?: Array<Option>
  documentTypeOptions?: Array<Option>
  contractTypeOptions?: Array<Option>
  entities?: Array<Option>
  billingOptions?: Array<Option>
  contractFields?: Array<ContractTypeDefinitionField>
  contractTypeDefinition?: Array<ContractTypeDefinition>
  existingContracts?: Array<ExistingContract>
  formId?: string
  fields?: Field[]
  isContractOverView?: boolean
  fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
  searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onSubmit?: (formData: ContractFormData, skipValidation?: boolean, action?: FormAction) => Promise<boolean>
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => ContractFormData) => void
  onValueChange?: (fieldName: string, updatedForm: ContractFormData) => void
  onFileUpload?: (file: File, fieldName: string) => Promise<ContractFormData>
  onFileDelete?: (fieldName: string) => Promise<ContractFormData>
  loadDocument?: (fieldName: string, type?: string, fileName?: string, path?: string) => Promise<Blob | string>
  onShowFormPrimaryButton?: (action: FormButtonAction, hideAction: boolean) => void
  onUserSearch?: (keyword: string) => Promise<User[]>
  onViewRelatedContract?: (id: string) => void
}

export const ANNUAL_CONTRACT = 'annual'
export const MONTHLY_CONTRACT = 'monthly'
export const FIXED_CONTRACT = 'fixed'
export const ANNUAL_SUBSCRIPTION_CONTRACT = 'annualSubscription'
export const MONTHLY_SUBSCRIPTION_CONTRACT = 'monthlySubscription'

export enum enumContractConfigFields {
    basicInfoVisible = 'basicInfoVisible',
    documentsRequired = 'documentsRequired',
    documentsVisible = 'documentsVisible',
    allowDecimal = 'allowDecimal'
}

export enum ContractUpdateMethod {
    renewal = 'renewal',
    update = 'update',
    cancel = 'cancel'
}

export interface ContractFormData {
    supplierName: string
    companyEntity: Option
    currency: Option
    businessOwners: UserId[]
    contractType: IDRef
    relatedContracts: IDRef[]
    quantity?: string
    updateMethod?: ContractUpdateMethod

    proposalDescription: string
    duration: number | null
    poDuration: number | null
    fixedSpend: Money | null
    variableSpend: Money | null
    recurringSpend: Money | null
    totalRecurringSpend: Money | null
    oneTimeCost: Money | null
    totalValue: Money | null
    averageVariableSpend?: Money | null
    totalEstimatedSpend?: Money | null
    yearlySplits: Array<ContractYearlySplit>

    tenantFixedSpend: Money | null
    tenantVariableSpend: Money | null
    tenantRecurringSpend: Money | null
    tenantOneTimeCost: Money | null
    tenantTotalValue: Money | null
    tenantRenewalAnnualValue: Money | null
    tenantNegotiatedSavings: Money | null
    tenantAverageVariableSpend: Money | null
    tenantTotalEstimatedSpend: Money | null
    tenantTotalRecurringSpend: Money | null

    pricingDetails?: string
    autoRenew: boolean
    autoRenewNoticePeriod: number | null
    includesCancellation: boolean
    cancellationDeadline: string
    includesPriceCap: boolean
    priceCapIncrease: number | null
    includesOptOut: boolean
    optOutDeadline: string
    renewalAnnualValue: Money | null
    savings: Money | null
    negotiatedSavings: Money | null
    savingsLink: string
    startDate: string;
    endDate: string;
    paymentTerms: Option
    billingCycleRef: Option
    billingCycle: string
    serviceStartDate: string
    serviceEndDate: string
    includesLateFees?: boolean
    lateFeesPercentage?: number | null
    lateFeeDays?: number | null
    terminationOfConvenience?: boolean
    terminationOfConvenienceDays?: number | null
    liabilityLimitation?: boolean
    liabilityLimitationMultiplier?: number | null
    liabilityLimitationCap?: Money | null
    tenantLiabilityLimitationCap?: Money | null
    confidentialityClause?: boolean
    revisions: Array<ContractRevision>

    msaAttachment?: Attachment | null
    msaDocument?: DocumentRef | null
    dpaAttachment?: Attachment | null
    dpaDocument?: DocumentRef | null
    slaAttachment?: Attachment | null
    slaDocument?: DocumentRef | null
    orderFormAttachment?: Attachment | null
    orderFormDocument?: DocumentRef | null
    sowAttachment?: Attachment | null
    sowDocument?: DocumentRef | null
    ndaAttachment?: Attachment | null
    ndaDocument?: DocumentRef | null
    contracts?: Array<IDRef>
    otherAttachments?: Array<Attachment>
    otherDocuments?: Array<DocumentRef>
    contractDescription?: string
    selectedRevisionIndex?: number | null
    deletedRevisionIndex?: number | null
}

export interface ContractRevision {
    contractType: IDRef
    currency: IDRef
    proposalDescription: string
    contractDescription?: string
    duration: number | null
    poDuration: number | null
    fixedSpend: Money | null
    variableSpend: Money | null
    recurringSpend: Money | null
    totalRecurringSpend: Money | null
    oneTimeCost: Money | null
    totalValue: Money | null
    negotiatedSavings: Money | null
    averageVariableSpend: Money | null
    totalEstimatedSpend: Money | null
    tenantTotalRecurringSpend: Money | null
    startDate: string;
    endDate: string;
    autoRenew: boolean
    autoRenewNoticePeriod: number | null
    includesCancellation: boolean
    cancellationDeadline: string
    includesPriceCap: boolean
    priceCapIncrease: number
    includesOptOut: boolean
    optOutDeadline: string
    renewalAnnualValue: Money | null
    paymentTerms: IDRef
    billingCycle: string
    billingCycleRef: IDRef
    serviceStartDate: string
    serviceEndDate: string
    yearlySplits: Array<ContractYearlySplit>
    includesLateFees?: boolean
    lateFeesPercentage?: number
    lateFeeDays?: number | null
    terminationOfConvenience?: boolean
    terminationOfConvenienceDays?: number | null
    liabilityLimitation?: boolean
    liabilityLimitationMultiplier?: number
    liabilityLimitationCap?: Money | null
    tenantLiabilityLimitationCap?: Money | null
    confidentialityClause?: boolean

    tenantFixedSpend: Money | null
    tenantVariableSpend: Money | null
    tenantRecurringSpend: Money | null
    tenantOneTimeCost: Money | null
    tenantTotalValue: Money | null
    tenantRenewalAnnualValue: Money | null
    tenantNegotiatedSavings: Money | null
    tenantAverageVariableSpend: Money | null
    tenantTotalEstimatedSpend: Money | null
}

export interface ContractYearlySplit {
    year?: number | null
    quantity?: string | null

    fixedSpend?: Money | null
    variableSpend?: Money | null
    annualSpend?: Money | null
    recurringSpend?: Money | null;
    totalRecurringSpend?: Money | null
    averageVariableSpend: Money | null
    oneTimeCost?: Money | null
    totalValue?: Money | null
    totalEstimatedSpend?: Money | null
    renewalAnnualValue?: Money | null
    negotiatedSavings?: Money | null

    tenantFixedSpend?: Money | null
    tenantVariableSpend?: Money | null
    tenantAnnualSpend?: Money | null
    tenantRecurringSpend?: Money | null
    tenantTotalRecurringSpend?: Money | null
    tenantAverageVariableSpend?: Money | null
    tenantOneTimeCost?: Money | null
    tenantTotalValue?: Money | null
    tenantTotalEstimatedSpend?: Money | null
    tenantRenewalAnnualValue?: Money | null
    tenantNegotiatedSavings?: Money | null
}

export interface DocumentRef {
    id: string | null
    name: string
    type: IDRef | null
    attachment: Attachment | null
    sourceUrl: string
    sourceUrlAttachment?: Attachment | null
    pastVersions?: Array<Attachment>
    created?: string | null
}

export interface ContractDocuments {
    id: string
    displayName: string
    attachment?: Attachment
    document?: DocumentRef
    attachmentIndex?: number
}

export enum ContractDocumentType {
    nda = 'nda',
    msa = 'msa',
    dpa = 'dpa',
    sla = 'sla',
    contract = 'contract',
    sow = 'sow',
    orderForm = 'orderForm',
    other = 'other'
}

export enum ContractDocumentTypeName {
    nda = 'Non-disclosure Agreement (NDA)',
    msa = 'Master Service Agreement (MSA)',
    dpa = 'Data Processing Agreement (DPA)',
    sla = 'Service Level Agreement (SLA)',
    sow = 'Statement of Work (SOW)',
    orderForm = 'Order form',
    other = 'Other',
    contract = 'contract'
}

export interface ContractDetailsColumnProps {
  revision?: ContractRevision
  yearlySplits?: ContractYearlySplit
  isYearlySplit?: boolean
  year?: number
  disabled: boolean
  twoColumn?: boolean
  onChange?: (fieldName: string, oldValue: any, newValue: any) => void
  validate?: (isValidValue: boolean) => void
}

export interface ContractDetailsTableProps {
  label: string
  selectedRevision: Option
  revisionOptions: Option[]
  revisions?: ContractRevision[]
  yearlySplits?: ContractYearlySplit[]
  currentRevision?: ContractRevision
  twoColumn?: boolean
  isYearlySplit?: boolean
  year?: number
  disabled: boolean
  index?: number
  onChange?: (fieldName: string, oldValue: any, newValue: any) => void
  validate?: (isValidValue: boolean) => void
  onRevisionChange?: (value: Option) => void
}

export enum MeasureDetailBasicFields {
    measureName = 'measureName',
    workstream = 'workstream',
    processName = 'processName',
    estimate = 'estimate',
    owner = 'owner',
    situation = 'situation',
    action = 'action',
    benefit = 'benefit',
    other = 'other',
    priority = 'priority',
    enableSensitiveMeasures = 'enableSensitiveMeasures',
    enableHighPriorityMeasures = 'enableHighPriorityMeasures'
}

export enum ContractFields {
    proposalDescription = 'proposalDescription',
    duration = 'duration',
    fixedSpend = 'fixedSpend',
    variableSpend = 'variableSpend',
    recurringSpend = 'recurringSpend',
    totalRecurringSpend = 'totalRecurringSpend',
    oneTimeCost = 'oneTimeCost',
    totalValue = 'totalValue',
    averageVariableSpend = 'averageVariableSpend',
    totalEstimatedSpend = 'totalEstimatedSpend',
    negotiatedSavings = 'negotiatedSavings',
    poDuration = 'poDuration',
    savingsLink = 'savingsLink',
    year = 'year',
    annualSpend = 'annualSpend',
    splitVariableSpend = 'splitVariableSpend',
    splitFixedSpend = 'splitFixedSpend',
    yearlySplits = 'yearlySplits',

    contractPeriod = 'contractPeriod',
    startDate = 'startDate',
    endDate = 'endDate',
    paymentTerms = 'paymentTerms',
    renewalAnnualValue = 'renewalAnnualValue',
    autoRenew = 'autoRenew',
    includesPriceCap = 'includesPriceCap',
    includesCancellation = 'includesCancellation',
    includesOptOut = 'includesOptOut',
    billingCycle = 'billingCycle',
    autoRenewNoticePeriod = 'autoRenewNoticePeriod',
    priceCapIncrease = 'priceCapIncrease',
    cancellationDeadline = 'cancellationDeadline',
    optOutDeadline = 'optOutDeadline',
    includesLateFees = 'includesLateFees',
    lateFeesPercentage = 'lateFeesPercentage',
    lateFeeDays = 'lateFeeDays',
    terminationOfConvenience = 'terminationOfConvenience',
    terminationOfConvenienceDays = 'terminationOfConvenienceDays',
    liabilityLimitation = 'liabilityLimitation',
    liabilityLimitationMultiplier = 'liabilityLimitationMultiplier',
    liabilityLimitationCap = 'liabilityLimitationCap',
    tenantLiabilityLimitationCap = 'tenantLiabilityLimitationCap',
    confidentialityClause = 'confidentialityClause'
}

export enum ContractFieldSection {
    contractValues = 'contractValues',
    terms = 'terms'  
}

export enum ContractType {
    annual = 'annual',
    monthly = 'monthly',
    fixed = 'fixed'
}

export enum TaxType {
    direct = 'direct',
    indirect = 'indirect',
    exemption = 'exemption'
}

export interface ContractTypeDefinition {
    code: string
    type: ContractType
    name: string
    desc: string
    fields: Array<ContractTypeDefinitionField>
}

export interface ContractTypeDefinitionField {
    id: string
    name: string
    required: boolean
    section: boolean
    order: number
    visible: boolean
    formula: string
    formConfigs?: ContractTypeFormConfig[]
    children: ContractTypeDefinitionField[]
}

export interface ContractTypeFormConfig {
    formId: string
    name: string
    required: boolean
    visible: boolean
}

export interface ContractFieldConfig {
    id: string
    name: string
    required: boolean
    section: boolean
    type: string
    visible: boolean
    isExpanded?: boolean
    isViewMore?: boolean
    isEditMode?: boolean
    children: ContractFieldConfig[]
    formula?: string
    formConfigs?: ContractTypeFormConfig[]
}

export interface ContractDocumentProps {
    documents?: Array<Document>
    documentTypeOptions: Array<Option>
    attachments: Array<DocumentRef>
}

export enum ContractFormView {
    basicInfo = 'basicInfo',
    proposals = 'proposals',
    finalProposal = 'finalProposal',
    documents = 'documents',
    finalProposalReadOnly = 'finalProposalReadOnly'
}

export interface ExistingContract {
    id: string
    contractId: string
    name: string
    description: string
    title: string
    requester: UserId
    businessOwners: UserId[]
    negotiators: UserId[]
    status: string
    runtimeStatus: string
    contractType: IDRef
    quantity: string
    parentContract: IDRef
    normalizedVendor: NormalizedVendorRef
    vendor: VendorRef
    selectedProduct: IDRef
    products: IDRef[]
    engagement: IDRef
    spendCategory: IDRef
    startDate: string
    endDate: string
    duration: number
    negotiationStarted: string
    negotiationCompleted: string
    approved: string
    signed: string
    currency: IDRef
    recurringSpendMoney: Money | null
    fixedSpendMoney: Money | null
    variableSpendMoney: Money | null
    oneTimeCostMoney: Money | null
    totalValueMoney: Money | null
    negotiatedSavingsMoney: Money | null
    savingsLink: string
    yearlySplits: ContractYearlySplit[]
    revisions: ContractRevision[]
    sensitive: boolean
    autoRenew: boolean
    autoRenewNoticePeriod: number
    autoRenewDate: string
    includesCancellation: boolean
    cancellationDeadline: string
    paymentTerms: IDRef
    departments: IDRef[]
    companyEntities: IDRef[]
    notes: Note[]
    created: string
    updated: string
    signatories: UserId[]
    billingCycle: string
    relatedContracts: IDRef[]
    includesLateFees: boolean
    lateFeesPercentage: number | null
    lateFeeDays: number | null
    terminationOfConvenience: boolean
    terminationOfConvenienceDays: number | null
    liabilityLimitation: boolean
    liabilityLimitationMultiplier: number | null
    liabilityLimitationCapMoney: Money | null
    tenantLiabilityLimitationCapMoney: Money | null
    confidentialityClause: boolean
}

export interface SanctionListFormProps {
    formData?: SanctionListFormData
    allSanctionLists?: Option[]
    roleOptions?: Option[]
    readOnly?: boolean
    isAdverseMedia?: boolean
    onSubmit?: (formData: SanctionListFormData) => void
    onReady?: (fetchData: () => SanctionListFormData) => void
}

export interface SanctionListFormData {
    sanctionRiskScores?: RiskScoreDetails[] | null
    selectedSupplier?: NormalizedVendorRef | null
}

export interface SanctionListDetails {
    errorMessage?: string
    entities?: SanctionEntityDetails[]
}

export interface SanctionEntityDetails {
    entityNumber?: string,
    fullName?: string,
    nameForProcessing?: string,
    entityType?: string,
    country?: string,
    listType?: string,
    guid?: string,
    score?: string,
    program?: string,
    remarks?: string,
    sdnType?: string,
    title?: string,
    dob?: string,
    passport?: string,
    callSign?: string,
    additionalAddress?: SanctionAdditionalAddress[],
    additionalAlias?: SanctionAdditionalAlias[]
}

export interface SanctionAdditionalAddress {
    address?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string,
    addrRemarks?: string
}

export interface SanctionAdditionalAlias {
    fullName?: string
    entType?: string
    remarks?:  string
}

export interface UpdateSupplierCompanyFormData {
    commonName: string
    description: string
    website: string
    email: string
    phone: string
    address: Address
    parentCompany: Supplier | null
    industryCode: IDRef | null
    newLogo: Attachment | File
    currentLogo: Image
}
  
export interface UpdateSupplierCompanyProps {
    formData?: UpdateSupplierCompanyFormData
    fields?: Field[]
    industryCodes?: Array<Option>
    countryOptions?: Option[]
    supplierRoles?: Array<MasterDataRoleObject>
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onValueChange?: (fieldName: string, formData: UpdateSupplierCompanyFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: UpdateSupplierCompanyFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => UpdateSupplierCompanyFormData) => void
    onFileUpload?: (file: File, fieldName: string) => Promise<boolean>
    onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
    onSearchSuppliers?: (searchText: string) => Promise<Array<LegalEntity>>
    getSupplierDetailByVendorId?: (vendorId: string) => Promise<NormalizedVendor>
    getSupplierDetailByLegalEntityId?: (id: string) => Promise<NormalizedVendor>
    getVendorUsers?: (id: string) => Promise<SupplierUser[]>
}

export interface UpdateSupplierScopeFormData {
    segmentations?: SegmentationDetail[]
    added?: SegmentationDetail[]
    updated?: SegmentationDetail[]
    deleted?: SegmentationDetail[]
}
  
export interface UpdateSupplierScopeOfUseProps {
    formData?: UpdateSupplierScopeFormData
    fields?: Field[]
    goodServicesOptions: Option[]
    regionOptions: Option[]
    siteOptions: Option[]
    productOptions: Option[]
    productStageOptions: Option[]
    preferredStatusOptions: Option[]
    restrictionOptions: Option[]
    hasSupplierUpdatePermission?: boolean
    submitLabel?: string
    cancelLabel?: string
    isInPortal?: boolean
    onValueChange?: (fieldName: string, formData: UpdateSupplierScopeFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: UpdateSupplierScopeFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => UpdateSupplierScopeFormData) => void
}

export interface UpdateSupplierScopeOfUseReadOnlyProps {
    formData?: UpdateSupplierScopeFormData
    diffs?: FormDiff
}

export enum ApplicationMode {
    runner = 'runner',
    supplier = 'supplier'
}
  
export enum RibbonView {
    supplierProfile = 'supplierProfile',
    engagementList = 'engagementList',
    engagementDetails = 'engagementDetails',
    taskListMobile = 'taskListMobile'
}

export enum CurrentRequestType {
    onboarding = 'Onboarding',
    marketingProject = 'Marketing Project',
    softwareDataPurchase = 'Software Data Purchase',
    supplierUpdate = 'Bank Callback',
    development = 'Development'
}

export enum StandardPriority {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export enum DocumentType {
    nda = 'nda',
    msa = 'msa',
    dpa = 'dpa',
    contract = 'contract',
    sow = 'sow',
    w9 = 'w9',
    w8ben = 'w8ben',
    w8ben_e = 'w8ben_e',
    cert_diversity = 'cert_diversity',
    cert_incorporation = 'cert_incorporation',
    cert_insurance = 'cert_insurance',
    security = 'security',
    soc2 = 'soc2',
    pentest = 'pentest',
    pci = 'pci',
    tax = 'tax',
    other = 'other',
    all = 'all'
}

export enum FormAction {
    callBackLater = 'callbackLater',
    saveRevision = 'saveRevision',
    selectRevision = 'selectRevision',
    deleteRevision = 'deleteRevision',
    emailValidation = 'emailValidation',
    documentUpdate = 'documentUpdate'
}

export type SubType = 'closePO' | 'openPo'

export enum enumClosePOFields {
    poRef = 'poRef',
    reason = 'reason'
}

export interface ClosePoFormData {
    purchaseOrder?: PurchaseOrder
    poRef?: IDRef
    subType?: SubType
    reason?: string
}
  
export interface ClosePoFormProps {
    formData?: ClosePoFormData
    isOpenPO?: boolean
    fields?: Field[]
    departmentOptions?: Option[]
    submitLabel?: string
    cancelLabel?: string
    onValueChange?: (fieldName: string, formData: ClosePoFormData, file?: File | Attachment, fileName?: string) => void
    onSubmit?: (formData: ClosePoFormData) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => ClosePoFormData) => void
    searchObjects?: (type: ObjectType, searchVariables: ObjectSearchVariables) => Promise<{ objs: ObjectValue[], total: number}>
    getPO?: (id: string) => Promise<PurchaseOrder>
}

export interface ClosePoFormReadOnlyProps {
    data?: ClosePoFormData
    isOpenPO?: boolean
    fields?: Field[]
    departmentOptions?: Option[]
    isSingleColumnLayout?: boolean
    getPO?: (id: string) => Promise<PurchaseOrder>
}

export enum InternalUserRoles {
    owner = 'Owner',
    coOwner = 'CoOwner',
    member = 'Member'
}
