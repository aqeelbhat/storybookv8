import { CompanyInfoV4FormData, MultiLingualAddress, SupplierTaxFormKeyField, SupplierTaxKeyField } from ".."
import { Option } from "../../Inputs"
import { Address, Attachment, Contact, EncryptedData, IDRef } from "../../Types"
import { emptyEcncryptedData } from "../types"
import { mapOptionToIDRef } from "../util"

export const COMMON_FILE_NAME = 'document'
export const COMPANY_NAME = 'companyName'
export const LEGAL_NAME = 'legalName'
export const WEBSITE = 'website'
export const DUNS = 'duns'
export const ADDRESS = 'address'
export const EMAIL = 'email'
export const PHONE = 'phone'
export const TAX_ADDRESS = 'taxAddress'
export const FOREIGN_TAX = 'foreignTaxForm'
export const TAX = 'tax'
export const INDIRECT_TAX = 'indirectTax'
export const ENCRYPTED_TAX_CODE = 'encryptedTaxCode'
export const ENCRYPTED_INDIRECT_TAX_CODE = 'encryptedIndirectTaxCode'
export const US_TAX_FORM_KEY = 'usTaxDeclarationFormKey'
export const EXEMPTION_TAX_KEY = 'exemptionTaxKey'
export const ENCRYPTED_EXEMPTION_TAX_CODE = 'encryptedExemptionTaxCode'
export const TAX_FORM = 'taxForm'
export const INDIRECT_TAX_FORM = 'indirectTaxForm'
export const INSTRUCTION = 'instruction'
export const FAX = 'fax'
export const US_COMPANY_ENTITY = 'usCompanyEntityType'
export const MULTI_LANG = 'multiLingualAddresses'
export const SPECIAL_TAX_NOTE = 'specialTaxNote'
export const SPECIAL_TAX_STATUS = 'specialTaxStatus'
export const TAX_1099 = 'tax1099'
export const USE_COMPANY_NAME = 'useCompanyName'
export const PRIMARY_NAME = 'primaryName'
export const PRIMARY_EMAIL = 'primaryEmail'
export const PAYMENT_CONATCT_EMAIL = 'paymentContactEmail'
export const USE_COMPANY_ADDRESS = 'useCompanyAddress'
export const FOREIGN_TAX_CLASSIFICATION = 'foreignTaxClassification'
export const SPECIAL_TAX_ATTACHMENT = 'specialTaxAttachment'
export const INDIRECT_TAX_KEY = 'indirectTaxKey'
export const TAX_KEY = 'taxKey'
export const US_TAX_FORM = 'usTaxDeclarationForm'
export const TAX_FORM_KEY = 'taxFormKey'
export const INDIRECT_TAX_FORM_KEY = 'indirectTaxFormKey'
export const JURISDICTION_COUNTRY = 'jurisdictionCountry'
export const EXCLUDE_ADDRESS_SUGGESTION = 'excludeAddressSuggestion'

export function formDataWithUpdatedValue(fieldName: string, newValue: string | Address | Contact | Array<MultiLingualAddress> | Option | EncryptedData | Attachment | File | boolean | undefined | null, formData: CompanyInfoV4FormData): CompanyInfoV4FormData {
    switch (fieldName) {
        case JURISDICTION_COUNTRY:
            formData.jurisdictionCountryCode = newValue as string
            formData.tax.taxKey = ''
            formData.indirectTax.taxKey = ''
            formData.tax.encryptedTaxCode = null
            formData.indirectTax.encryptedTaxCode = null
            formData.usTaxDeclarationFormKey = ''
            formData.usTaxDeclarationForm = null
            formData.taxForm.taxFormKey = ''
            formData.taxForm.taxForm = null
            formData.indirectTaxForm.taxFormKey = ''
            formData.indirectTaxForm.taxForm = null
            break
        case COMPANY_NAME:
            if (!formData.legalName) {
                formData.legalName = newValue as string
            }
            formData.companyName = newValue as string
            break
        case LEGAL_NAME:
            formData.legalName = newValue as string
            break
        case USE_COMPANY_NAME:
            formData.useCompanyName = newValue as boolean
            break
        case WEBSITE:
            formData.website = newValue as string
            break
        case DUNS:
            formData.duns = newValue as string
            break
        case MULTI_LANG:
            formData.multiLingualAddresses = newValue as Array<MultiLingualAddress>
            break
        case EMAIL:
            formData.email = newValue as string
            break
        case PHONE:
            formData.phone = newValue as string
            break
        case ADDRESS:
            formData.address = newValue as Address
            break
        case PRIMARY_NAME:
            formData.primary!.fullName = newValue as string
            break
        case PRIMARY_EMAIL:
            formData.primary!.email = newValue as string
            break
        case PAYMENT_CONATCT_EMAIL:
            formData.paymentContactEmail = newValue as string
            break
        case TAX_ADDRESS:
            formData.taxAddress = newValue as Address
            break
        case USE_COMPANY_ADDRESS:
            formData.useCompanyAddress = newValue as boolean
            break
        case US_COMPANY_ENTITY:
            formData.usCompanyEntityType = mapOptionToIDRef(newValue as Option) as IDRef
            break
        case ENCRYPTED_TAX_CODE:
            formData.tax.encryptedTaxCode = newValue ? newValue as EncryptedData : null
            break
        case TAX_FORM:
            if (newValue) {
                formData.taxForm.taxForm = newValue as Attachment | File
            } else {
                formData.taxForm.taxForm = null
            }
            break
        case INDIRECT_TAX_FORM:
            if (newValue) {
                formData.indirectTaxForm.taxForm = newValue as Attachment | File
            } else {
                formData.indirectTaxForm.taxForm = null
            }
            break
        case FOREIGN_TAX_CLASSIFICATION:
            formData.foreignTaxClassification = mapOptionToIDRef(newValue as Option) as IDRef
            break
        case SPECIAL_TAX_STATUS:
            formData.specialTaxStatus = newValue as boolean
            break
        case SPECIAL_TAX_NOTE:
            formData.specialTaxNote = newValue as string
            break
        case SPECIAL_TAX_ATTACHMENT:
            formData.specialTaxAttachments = newValue as Array<Attachment>
            break
        case INDIRECT_TAX_KEY:
            formData.indirectTax.taxKey = newValue as string
            break
        case TAX_KEY:
                formData.tax.taxKey = newValue as string
                break
        case ENCRYPTED_INDIRECT_TAX_CODE:
            formData.indirectTax.encryptedTaxCode = newValue ? newValue as EncryptedData : null
            break
        case US_TAX_FORM_KEY:
            formData.usTaxDeclarationFormKey = newValue as string
            break
        case US_TAX_FORM:
            if (newValue) {
                formData.usTaxDeclarationForm = newValue as Attachment | File
            } else {
                formData.usTaxDeclarationForm = null
            }
            break
        case TAX_FORM_KEY:
            formData.taxForm.taxFormKey = newValue as string
            break
        case INDIRECT_TAX_FORM_KEY:
            formData.indirectTaxForm.taxFormKey = newValue as string
            break
        case TAX_1099:
            formData.tax1099 = (newValue as Option)?.path ? (newValue as Option)?.path === 'yes' : undefined
            break
        case INSTRUCTION:
            formData.instruction = newValue as string
            break

        case FAX:
            formData.fax = newValue as string
            break
    }

    return formData
}

export function getEmptySupplierTaxKeyField (): SupplierTaxKeyField {
    return {
      encryptedTaxCode: emptyEcncryptedData,
      taxCodeError: false,
      taxCodeValidationTimeout: false,
      taxKey: '',
      taxKeysList: []
    }
}

export function getEmptySupplierTaxFormKeyField (): SupplierTaxFormKeyField {
    return {
      taxForm: null,
      taxFormKey: '',
      taxFormKeysList: []
    }
}

export function getEmptyComapnyInfoV4 (): CompanyInfoV4FormData {
    return {
      companyName: '',
      email: '',
      phone: '',
      fax: '',
      useCompanyName: true,
      legalName: '',
      website: '',
      address: null,
      duns: '',
      primary: null,
      paymentContactEmail: '',
      useCompanyAddress: true,
      taxAddress: null,
      companyEntityCountryCodes: [],
      usCompanyEntityType: null,
      tax: getEmptySupplierTaxKeyField(),
      taxForm: getEmptySupplierTaxFormKeyField(),
      indirectTax: getEmptySupplierTaxKeyField(),
      indirectTaxForm: getEmptySupplierTaxFormKeyField(),
      usTaxDeclarationFormKey: '',
      usTaxDeclarationForm: null,
      foreignTaxClassification: null,
      tax1099Required: false,
      tax1099: false,
      specialTaxStatus: false,
      specialTaxNote: '',
      specialTaxAttachments: [],
      instruction: '',
      additionalDocsList: [],
      additionalDocuments: [],
      jurisdictionCountryCode: ''
    }
  }