import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, ChevronsDown, Download, EyeOff, Globe, Plus, Trash2, X } from 'react-feather'
import { ClickAwayListener, LinearProgress, debounce, linearProgressClasses, styled } from '@mui/material'
import { IDocument } from '@cyntler/react-doc-viewer'
import { DispalyCompanyInfoFormV4 } from './dispaly-companyInformationV4'
import { CountrySelectionCompanyInfoV4 } from './country-selection-companyInformationV4'
import { LegalInfoCompanyInfoFormV4 } from './legal-info-companyInformationV4'
import { OtherCompanyInfoFormV4 } from './other-info-companyInformationV4'
import { CompanyInfoV4FormData, CompanyInfoV4FormProps, Field, MultiLingualAddress } from '../types'
import { GoogleMultilinePlaceSearch, Option, TextArea, TextBox } from '../../Inputs'
import { Address, Attachment, Contact, EncryptedData } from '../../Types'
import { areArraysSame, areObjectsSame, getFormFieldConfig, getFormFieldsMap, isAddressInvalid, isDisabled, isEmpty, isOmitted, isRequired, validateDUNSNumber, validateEmail } from '../util'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { mapAlpha2codeToDisplayName } from '../../util'
import { OroButton } from '../../controls'
import { SnackbarComponent } from '../../Snackbar'
import { OROFileIcon } from '../../RequestIcon'
import { DocViewerComponent } from '../../FilePreview'
import {
    COMPANY_NAME, LEGAL_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, TAX_ADDRESS, FOREIGN_TAX, TAX, INDIRECT_TAX, ENCRYPTED_TAX_CODE,
    ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY, ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, INSTRUCTION,
    FAX, US_COMPANY_ENTITY, MULTI_LANG, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099, JURISDICTION_COUNTRY, formDataWithUpdatedValue, getEmptyComapnyInfoV4, COMMON_FILE_NAME, EXCLUDE_ADDRESS_SUGGESTION
} from './utils'
import { Trans } from 'react-i18next'
import { useMediaQueryHook } from '../../CustomHooks/custom-hooks'

const US_COUNTRY_CODE = 'US'
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 4,
    borderRadius: 100,
    [`& .${linearProgressClasses.barColorPrimary}`]: {
        borderRadius: 100,
        backgroundColor: 'var(--warm-neutral-shade-500)'
    },
    [`&.${linearProgressClasses.colorPrimary}`]: {
        borderRadius: 100,
        backgroundColor: 'var(--warm-neutral-mid-400)'
    },
}))

const WANTED_FIELDS = [COMPANY_NAME, LEGAL_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, TAX_ADDRESS, FOREIGN_TAX, TAX,
    INDIRECT_TAX, ENCRYPTED_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY,
    ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, INSTRUCTION, FAX, US_COMPANY_ENTITY,
    MULTI_LANG, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099]

function DocView(props: { idoc: IDocument | null }) {
    return <>{props.idoc && <DocViewerComponent IDocument={props.idoc} />}</>
}

export function CompanyInfoFormV4Content(props: CompanyInfoV4FormProps) {
    const [jurisdictionCountryCode, setJurisdictionCountryCode] = useState<string>('')
    const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
    const screen = useMediaQueryHook()
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [instruction, setInstruction] = useState<string>('')
    const [IDocument, setIDocument] = useState<IDocument | null>(null)
    const [previewedAttachment, setPreviewedAttachment] = useState<Attachment | null>(null)
    const [multiLingualAddresses, setMultiLingualAddresses] = useState<Array<MultiLingualAddress>>([])
    const [showCountryOption, setShowCountryOption] = useState(false)
    const [countryOptionsForLanguage, setCountryOptionsForLanguage] = useState<Array<Option>>([])
    const [fetchChildData, setFetchChildData] = useState<(skipValidation?: boolean) => CompanyInfoV4FormData | null>()
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [errorInform, setErrorInform] = useState(false)
    const [errorInformMessage, setErrorInformMessage] = useState('')
    const [excludeAddressSuggestion, setExcludeAddressSuggestion] = useState(false)
    const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])

    function generateIdocumentForFilePreview(params: Blob, attachment: Attachment) {
        const blob = new Blob([params], { type: attachment.mediatype })
        const fileURL = URL.createObjectURL(blob)
        setIDocument({
            uri: fileURL,
            fileName: attachment?.filename || attachment?.name || COMMON_FILE_NAME,
            fileType: attachment?.mediatype
        })
        setPreviewedAttachment(attachment)
    }

    function loadSpecialDocFile(fieldName: string, attachment: Attachment): Promise<Blob> {
        if (props.loadDocument && fieldName) {
            props.loadDocument(fieldName, attachment)
                .then(resp => {
                    generateIdocumentForFilePreview(resp, attachment)
                })
                .catch(err => console.log(err))
            return Promise.reject()
        } else {
            return Promise.reject()
        }
    }

    function loadFile(fieldName: string, attachment: Attachment): Promise<Blob> {
        if (props.loadDocument && fieldName) {
            return props.loadDocument(fieldName, attachment)
        } else {
            return Promise.reject()
        }
    }

    useEffect(() => {
        if (props.newTaxFormUploaded && props.newTaxFormUploaded.taxFormKey && (props.newTaxFormUploaded.taxFormKey === props.formData?.taxForm?.taxFormKey || props.newTaxFormUploaded.taxFormKey === props.formData?.indirectTaxForm?.taxFormKey || props.newTaxFormUploaded.taxFormKey === props.formData?.usTaxDeclarationFormKey)) {
            if (props.newTaxFormUploaded.taxFormKey === props.formData?.taxForm?.taxFormKey) {
                loadFile('taxForm.taxForm', props.formData?.taxForm?.taxForm)
                    .then(resp => {
                        generateIdocumentForFilePreview(resp, props.formData?.taxForm?.taxForm)
                    })
                    .catch(err => console.log(err))
            }
            if (props.newTaxFormUploaded.taxFormKey === props.formData?.usTaxDeclarationFormKey) {
                loadFile('usTaxDeclarationForm', props.formData?.usTaxDeclarationForm)
                    .then(resp => {
                        generateIdocumentForFilePreview(resp, props.formData?.usTaxDeclarationForm)
                    })
                    .catch(err => console.log(err))
            }
            if (props.newTaxFormUploaded.taxFormKey === props.formData?.indirectTaxForm?.taxFormKey) {
                loadFile('indirectTaxForm.taxForm', props.formData?.indirectTaxForm?.taxForm)
                    .then(resp => {
                        generateIdocumentForFilePreview(resp, props.formData?.indirectTaxForm?.taxForm)
                    })
                    .catch(err => console.log(err))
            }
        }
    }, [props.newTaxFormUploaded])

    useEffect(() => {
        if (props.formData) {
            setMultiLingualAddresses(props.formData?.multiLingualAddresses || [])
            setInstruction(props.formData?.instruction)
            setJurisdictionCountryCode(props.formData?.jurisdictionCountryCode || '')
        }
    }, [props.formData])

    useEffect(() => {
        if (props.fields && props.fields.length > 0) {
            setFieldMap(getFormFieldsMap(props.fields, WANTED_FIELDS))
            const _excludeAddressSuggestionField = props.fields.find(field => field.fieldName === EXCLUDE_ADDRESS_SUGGESTION)
            setExcludeAddressSuggestion(_excludeAddressSuggestionField?.booleanValue || false)
        }
    }, [props.fields])

    function getFormData(): CompanyInfoV4FormData {
        return {
            ...props.formData || getEmptyComapnyInfoV4(),
            instruction,
            multiLingualAddresses
        }
    }

    function getFormDataWithUpdatedValue(fieldName: string, newValue: string | Address | Contact | Array<MultiLingualAddress> | Option | EncryptedData | Attachment | File | boolean | undefined | null): CompanyInfoV4FormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as CompanyInfoV4FormData
        return formDataWithUpdatedValue(fieldName, newValue, formData)
    }

    function dispatchOnValueChange(fieldName: string, formData: CompanyInfoV4FormData) {
        if (props.onValueChange) {
            props.onValueChange(
                fieldName,
                formData
            )
        }
    }
    // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
    const debouncedOnValueChange = useMemo(() => debounce(dispatchOnValueChange, 300), [])

    function handleFieldValueChange(
        fieldName: string,
        oldValue: string | Address | Contact | Option | EncryptedData | Attachment | boolean | Array<MultiLingualAddress>,
        newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean | Array<MultiLingualAddress>,
        useDebounce?: boolean
    ) {
        if (props.onValueChange) {
            if (typeof newValue === 'string' || typeof newValue === 'boolean') {
                if (oldValue !== newValue) {
                    if (useDebounce) {
                        debouncedOnValueChange(
                            fieldName,
                            getFormDataWithUpdatedValue(fieldName, newValue)
                        )
                    } else {
                        props.onValueChange(
                            fieldName,
                            getFormDataWithUpdatedValue(fieldName, newValue)
                        )
                    }
                }
            } else if (typeof newValue === 'boolean' && !!oldValue !== !!newValue) {
                if (useDebounce) {
                    debouncedOnValueChange(
                        fieldName,
                        getFormDataWithUpdatedValue(fieldName, newValue)
                    )
                } else {
                    props.onValueChange(
                        fieldName,
                        getFormDataWithUpdatedValue(fieldName, newValue)
                    )
                }
            } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                if (!areArraysSame(oldValue, newValue)) {
                    if (useDebounce) {
                        debouncedOnValueChange(
                            fieldName,
                            getFormDataWithUpdatedValue(fieldName, newValue)
                        )
                    } else {
                        props.onValueChange(
                            fieldName,
                            getFormDataWithUpdatedValue(fieldName, newValue)
                        )
                    }
                }
            } else if (!areObjectsSame(oldValue, newValue)) {
                if (useDebounce) {
                    debouncedOnValueChange(
                        fieldName,
                        getFormDataWithUpdatedValue(fieldName, newValue)
                    )
                } else {
                    props.onValueChange(
                        fieldName,
                        getFormDataWithUpdatedValue(fieldName, newValue)
                    )
                }
            }
        }
    }


    function isFieldDisabled(fieldName: string): boolean {
        if (fieldMap && fieldMap[fieldName]) {
            const field = fieldMap[fieldName]
            return isDisabled(field) || isOmitted(field)
        } else {
            return false
        }
    }

    function isFieldRequired(fieldName: string): boolean {
        if (fieldMap && fieldMap[fieldName]) {
            const field = fieldMap[fieldName]
            return isRequired(field)
        } else {
            return false
        }
    }

    function isFormInvalid(): string {
        let invalidFieldId = ''
        let isInvalid = props.fields && props.fields.some(field => {
            if (isRequired(field)) {
                switch (field.fieldName) {
                    case COMPANY_NAME:
                        invalidFieldId = 'company-name-field'
                        return !props.formData?.companyName
                    case LEGAL_NAME:
                        invalidFieldId = 'legal-name-field'
                        return !props.formData?.legalName
                    case FAX:
                        invalidFieldId = 'fax-field'
                        return !props.formData?.fax
                    case WEBSITE:
                        invalidFieldId = 'website-field'
                        return !props.formData?.website
                    case DUNS:
                        invalidFieldId = 'duns-field'
                        return !props.formData?.duns
                    case EMAIL:
                        invalidFieldId = 'email-field'
                        return !props.formData?.email
                    case PHONE:
                        invalidFieldId = 'phone-field'
                        return !props.formData?.phone
                    case ADDRESS:
                        invalidFieldId = 'address-field'
                        return isAddressInvalid(props.formData?.address)
                    case TAX_ADDRESS:
                        invalidFieldId = 'tax-address-field'
                        return isAddressInvalid(props.formData?.taxAddress)
                    case TAX:
                        if (props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 0 && !props.formData?.tax?.taxKey) {
                            invalidFieldId = 'taxKey-field'
                            return props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 0 && !props.formData?.tax?.taxKey
                        } else {
                            invalidFieldId = 'taxCode-field'
                            return props.formData?.tax?.taxKey && !(props.formData?.tax?.encryptedTaxCode.maskedValue || props.formData?.tax?.encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
                        }
                    case ENCRYPTED_TAX_CODE:
                        invalidFieldId = 'taxCode-field'
                        return props.formData?.tax?.taxKey && !(props.formData?.tax?.encryptedTaxCode.maskedValue || props.formData?.tax?.encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
                    case INDIRECT_TAX:
                        if (props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 0 && !props.formData?.indirectTax?.taxKey) {
                            invalidFieldId = 'indirectTaxKey-field'
                            return props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 0 && !props.formData?.indirectTax?.taxKey
                        } else {
                            invalidFieldId = 'encryptedIndirectTaxCode-field'
                            return props.formData?.indirectTax?.taxKey && !(props.formData?.indirectTax?.encryptedTaxCode?.maskedValue || props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue) && !props.indirectTaxCodeFormatError
                        }
                    case ENCRYPTED_INDIRECT_TAX_CODE:
                        invalidFieldId = 'encryptedIndirectTaxCode-field'
                        return props.formData?.indirectTax?.taxKey && !(props.formData?.indirectTax?.encryptedTaxCode?.maskedValue || props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue) && !props.indirectTaxCodeFormatError
                    case US_TAX_FORM_KEY:
                        invalidFieldId = 'usTaxDeclarationForm-field'
                        return props.formData?.foreignTaxClassification && ((props.formData?.usTaxDeclarationFormKey && !props.formData?.usTaxDeclarationForm) || (!props.formData?.usTaxDeclarationFormKey))
                    case TAX_FORM:
                        invalidFieldId = 'taxFormKey-field'
                        return props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0 && ((props.formData?.taxForm?.taxFormKey && !props.formData?.taxForm) || (!props.formData?.taxForm?.taxFormKey))
                    case INDIRECT_TAX_FORM:
                        invalidFieldId = 'taxFormKey-field'
                        return props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0 && ((props.formData?.indirectTaxForm?.taxFormKey && !props.formData?.indirectTaxForm) || (!props.formData?.indirectTaxForm?.taxFormKey))
                    case INSTRUCTION:
                        invalidFieldId = 'instruction-field'
                        return !instruction
                    case SPECIAL_TAX_STATUS:
                        invalidFieldId = 'specialTaxStatus-field'
                        return props.formData?.tax1099Required && (props.formData?.specialTaxStatus === undefined || props.formData?.specialTaxStatus === null)
                    case SPECIAL_TAX_NOTE:
                        invalidFieldId = 'specialTaxNote-field'
                        return props.formData?.specialTaxStatus && !props.formData?.specialTaxNote
                    case US_COMPANY_ENTITY:
                        invalidFieldId = 'usCompanyEntityType-field'
                        return !props.formData?.usCompanyEntityType?.id && props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && jurisdictionCountryCode === US_COUNTRY_CODE && props.usCompanyEntityTypeOptions?.length > 0
                    case TAX_1099:
                        invalidFieldId = 'tax1099-field'
                        return (props.formData?.tax1099 === undefined || props.formData?.tax1099 === null) && props.formData?.tax1099Required
                }
            }
        })

        // Keeping this commented until we are clear on, multiLingualAddresses field is mandatory or not.
        // if (multiLingualAddresses.length > 0) {
        //   const findLangWithNoAddress = multiLingualAddresses.find(item => isAddressInvalid(item?.address || getEmptyAddress()))
        //   if (findLangWithNoAddress) {
        //     isInvalid = true
        //     invalidFieldId = `lingual_company_address_${findLangWithNoAddress.language}`
        //   }
        // }

        if (!jurisdictionCountryCode) {
            invalidFieldId = 'jurisdictionCountry-field'
            isInvalid = true
        }

        // if (!props.formData?.companyName) {
        //     invalidFieldId = 'company-name-field'
        //     isInvalid = true
        // }

        // if (jurisdictionCountryCode !== props.formData?.taxAddress?.alpha2CountryCode && isFieldRequired(TAX_ADDRESS)) {
        //     invalidFieldId = 'tax-address-field'
        //     isInvalid = true
        // }

        if (!isInvalid) {
            if (props.formData?.duns) {
                invalidFieldId = props.formData?.duns && !!validateDUNSNumber('Duns', props.formData?.duns, true) ? 'duns-field' : ''
                isInvalid = invalidFieldId ? true : false
            }

            if (props.formData?.specialTaxStatus && props.formData?.specialTaxAttachments?.length === 0) {
                isInvalid = true
                invalidFieldId = 'specialTaxAttachment-field'
            }
            if (props.formData?.email) {
                invalidFieldId = validateEmail('Email', props.formData?.email, true) ? 'email-field' : ''
                isInvalid = invalidFieldId ? true : false
            }
        }

        return isInvalid ? invalidFieldId : ''
    }

    function triggerValidations(invalidFieldId?: string) {
        setForceValidate(true)
        setTimeout(() => {
            setForceValidate(false)
        }, 1000)
        if (invalidFieldId) {
            const input = document.getElementById(invalidFieldId)
            if (input?.scrollIntoView) {
                input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
            }
        }
    }

    function handleFormSubmit() {
        const invalidFieldId = isFormInvalid()
        setErrorInform(!!invalidFieldId)
        setErrorInformMessage(t('--thereAreSomeErrorsInForm--'))
        if (invalidFieldId) {
            triggerValidations(invalidFieldId)
            console.warn('triggerValidations: Could not find element - ', invalidFieldId)
        } else if (props.onSubmit) {
            props.onSubmit(getFormData())
        }
    }

    function handleFormCancel() {
        if (props.onCancel) {
            props.onCancel()
        }
    }

    function triggerSubmit(skipValidation?: boolean): CompanyInfoV4FormData | null {
        if (skipValidation) {
            return getFormData()
        } else {
            // setErrorInCountryCode(false)
            const invalidFieldId = isFormInvalid()
            setErrorInform(!!invalidFieldId)
            setErrorInformMessage(t('--thereAreSomeErrorsInForm--'))
            if (invalidFieldId) {
                triggerValidations(invalidFieldId)
                console.warn('triggerValidations: Could not find element - ', invalidFieldId)
            }

            return invalidFieldId ? null : getFormData()
        }
    }

    useEffect(() => {
        if (props.onReady) {
            props.onReady(triggerSubmit)
        }
    }, [
        props.fields, open,
        props.formData, IDocument, multiLingualAddresses, instruction, jurisdictionCountryCode
    ])
    useEffect(() => {
        if (multiLingualAddresses.length > 0 && props.languageOptions && props.languageOptions.length > 0) {
            const allSelectedCountries = multiLingualAddresses.map(item => item.language)
            setCountryOptionsForLanguage(props.languageOptions?.filter(item => !allSelectedCountries.includes(item.path)))
        } else {
            setCountryOptionsForLanguage(props.languageOptions || [])
        }
    }, [multiLingualAddresses, props.languageOptions])

    function loadFileOcerdFiles(fieldName: string, attachment: Attachment) {
        if (fieldName) {
            loadFile(fieldName, attachment)
                .then(resp => {
                    generateIdocumentForFilePreview(resp, attachment)
                })
                .catch(err => console.log(err))
        }
    }

    function onPlaceSelectParseAddress(place: any): Promise<Address> {
        if (props.onPlaceSelectParseAddress) {
            return props.onPlaceSelectParseAddress(place)
        } else {
            return Promise.reject()
        }
    }

    function onLanguageSelect(country: Option) {
        const _multiLingualAddresses: Array<MultiLingualAddress> = []
        _multiLingualAddresses.push({
            language: country.path,
            address: null,
            legalName: ''
        })
        handleFieldValueChange(MULTI_LANG, multiLingualAddresses, multiLingualAddresses.concat(_multiLingualAddresses) as Array<MultiLingualAddress>)
        setShowCountryOption(false)
    }

    function onLanguageDelete(country: string) {
        handleFieldValueChange(MULTI_LANG, multiLingualAddresses, multiLingualAddresses.filter(item => item.language !== country) as Array<MultiLingualAddress>)
        setShowCountryOption(false)
    }

    function addNewLingualAddress(value: Address, langCountryCode: string) {
        const _multiLingualAddresses = multiLingualAddresses.map(item => {
            if (item.language === langCountryCode) {
                item.address = value
            }
            return item
        })
        setMultiLingualAddresses(_multiLingualAddresses)
    }

    function addNewLingualLegalName(value: string, langCountryCode: string) {
        const _multiLingualAddresses = multiLingualAddresses.map(item => {
            if (item.language === langCountryCode) {
                item.legalName = value
            }
            return item
        })
        setMultiLingualAddresses(_multiLingualAddresses)
    }

    function getFieldLabelFromConfig(fieldName: string): string {
        return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
    }

    function getLanguageName(code: string) {
        const language = props.languageOptions?.find(item => item.path === code)
        return language?.displayName || code
    }

    function closePreview() {
        setIDocument(null)
        setPreviewedAttachment(null)
        if (props.resetNewTaxFormUploaded) {
            props.resetNewTaxFormUploaded()
        }
    }

    function closePopup() {
        setOpen(false)
        setActiveIndex(-1)
        closePreview()
        document.body.style.overflow = ''
    }

    function onSaveChanges() {
        if (props.onSubmit) {
            props.onSubmit(getFormData())
            closePopup()
        }
    }

    function onContinueClick() {
        if (activeIndex === 0) {
            if (props.onValueChange && props.formData?.jurisdictionCountryCode !== jurisdictionCountryCode) {
                props.onValueChange(
                    JURISDICTION_COUNTRY,
                    getFormDataWithUpdatedValue(JURISDICTION_COUNTRY, jurisdictionCountryCode)
                )
                    .then(resp => {
                        setActiveIndex(1)
                        setIDocument(null)
                        setPreviewedAttachment(null)
                    })
                    .catch(err => console.log(err))
            } else if (jurisdictionCountryCode && props.formData?.jurisdictionCountryCode === jurisdictionCountryCode) {
                setActiveIndex(1)
            } else {
                setErrorInform(true)
                setErrorInformMessage(t('--selectACountry--'))
            }
        } else if (activeIndex === 1) {
            const data = fetchChildData()
            if (data) {
                setActiveIndex(2)
            }

        } else if (activeIndex === 2) {
            const data = fetchChildData()
            if (data) {
                onSaveChanges()
            }
        }
    }

    function onChangeJurisdiction(value: Option) {
        if (activeIndex === 0) {
            if (props.onValueChange && props.formData?.jurisdictionCountryCode !== value.path) {
                props.onValueChange(
                    JURISDICTION_COUNTRY,
                    getFormDataWithUpdatedValue(JURISDICTION_COUNTRY, value.path)
                )
                    .then(() => {
                        setJurisdictionCountryCode(value?.path || '')
                        setActiveIndex(1)
                        setIDocument(null)
                        setPreviewedAttachment(null)
                    })
                    .catch(err => console.log(err))
            } else if (props.formData?.jurisdictionCountryCode === value.path) {
                setActiveIndex(1)
            } else {
                setErrorInform(true)
                setErrorInformMessage(t('--selectACountry--'))
            }
        }
    }

    function handleFormReady(fetchFormFunction) {
        if (fetchFormFunction) {
            setFetchChildData(() => fetchFormFunction)
        }
    }

    const InternalDocViewer = useMemo(() => DocView({ idoc: IDocument }), [IDocument])

    function resetDocument(attachment: Attachment) {
        if (attachment.path === previewedAttachment?.path) {
            setIDocument(null)
            setPreviewedAttachment(null)
        }
    }

    function onFileDelete(fieldName: string, attachment: Attachment) {
        resetDocument(attachment)
        if (props.onFileDelete) {
            props.onFileDelete(fieldName, attachment)
        }
    }

    function onSpecialTaxFileDelete(fieldName: string, newForm: CompanyInfoV4FormData, attachment: Attachment) {
        resetDocument(attachment)
        if (props.onSpecialTaxFileDelete) {
            props.onSpecialTaxFileDelete(fieldName, newForm, attachment)
        }
    }

    function onJurisdictionCountryCodeEdit () {
        setActiveIndex(0)
        closePreview()
    }

    function headerInfoForWeb() {
        return (
            <div className={styles.companyInfoFormPopupContentsHeader}>
                <div className={styles.companyInfoFormPopupContentsHeaderInfo}>
                    <div className={styles.companyInfoFormPopupContentsHeaderInfoLeft}>
                        {activeIndex === 0 && <div className={styles.companyInfoFormPopupContentsHeaderText}>
                            {t('--letsStartWithTheCountryOfIncorporation--')}
                        </div>}
                        {activeIndex === 1 && <div className={styles.companyInfoFormPopupContentsHeaderText}>
                            {t('--legalInformation--')}
                        </div>}
                        {activeIndex === 2 && <div className={styles.companyInfoFormPopupContentsHeaderText}>
                            {t('--otherInformation--')}
                        </div>}
                    </div>
                    <X onClick={closePopup} cursor={'pointer'} size={20} color='var(--warm-neutral-shade-500)'></X>
                </div>
                <div className={styles.companyInfoFormPopupContentsHeaderProgress}>
                    <BorderLinearProgress variant="determinate" value={(activeIndex * 35) + 10} />
                </div>
            </div>
        )
    }

    function headerInfoForMobile() {
        return (
            <div className={styles.companyInfoFormPopupContentsHeader}>
                <div className={styles.companyInfoFormPopupContentsHeaderInfo}>
                    <div className={styles.companyInfoFormPopupContentsHeaderInfoLeft}>
                        {activeIndex > 0 && !props.existingCompanyInfo && <ChevronLeft cursor={'pointer'} size={20} color='var(--warm-neutral-shade-500)' onClick={() => setActiveIndex(activeIndex - 1)}></ChevronLeft>}
                        {activeIndex > 1 && props.existingCompanyInfo && <ChevronLeft cursor={'pointer'} size={20} color='var(--warm-neutral-shade-500)' onClick={() => setActiveIndex(activeIndex - 1)}></ChevronLeft>}
                        <div className={styles.companyInfoFormPopupContentsHeaderTellUs}>
                            {activeIndex === 0 && <div className={styles.companyInfoFormPopupContentsHeaderText}>
                                {t('--letsStartWithTheCountryOfIncorporation--')}
                            </div>}
                            {activeIndex === 1 && <div className={styles.companyInfoFormPopupContentsHeaderText}>
                                {t('--legalInformation--')}
                            </div>}
                            {activeIndex === 2 && <div className={styles.companyInfoFormPopupContentsHeaderText}>
                                {t('--otherInformation--')}
                            </div>}
                        </div>
                        <X onClick={closePopup} cursor={'pointer'} size={20} color='var(--warm-neutral-shade-500)'></X>
                    </div>
                </div>
                <div className={styles.companyInfoFormPopupContentsHeaderProgress}>
                    <BorderLinearProgress variant="determinate" value={(activeIndex * 35) + 10} />
                </div>
            </div>
        )
    }

    function headerInfoForMobileDocConfirm() {
        return (
            <div className={styles.companyInfoFormPopupContentsHeader}>
                <div className={styles.companyInfoFormPopupContentsHeaderTextConfirm}>
                    {t('--confirmUpload--')}
                </div>
            </div>
        )
    }

    function headerForUpdateScenario() {
        return (
            <div className={styles.companyInfoFormUpdateHeader}>
                <div className={styles.companyInfoFormUpdateHeaderInfo}>
                    {t('--pleaseConfirmInformationUpToDate--')}
                </div>
                <div className={styles.companyInfoFormUpdateHeaderSubText}>
                    {t('--youCanProceedWithExistingInformation--')}
                </div>
            </div>
        )
    }

    function onEdit() {
        if (props.existingCompanyInfo && !props.formData?.formApplicableForExtension) {
            setActiveIndex(1)
        } else {
            if (jurisdictionCountryCode) {
                setActiveIndex(1)
            } else {
                setActiveIndex(0)
            }
        }
        setOpen(true)
        document.body.style.overflow = 'hidden'
    }

    function onEnterDetails() {
        setOpen(true)
        setActiveIndex(0)
        document.body.style.overflow = 'hidden'
    }

    return (
        <div className={styles.companyInfoForm}>
            {props.existingCompanyInfo && !props.formData?.formApplicableForExtension && headerForUpdateScenario()}
            {!jurisdictionCountryCode && <div className={styles.section}>
                <div className={styles.row}>
                    <div className={styles.emptyFormMessage}>
                        <div className={styles.emptyFormMessageContent}>
                            <div className={styles.emptyFormMessageInfo}>{t('--tellUsAboutYourCompany--')}</div>
                            <div className={styles.emptyFormMessageHelpText}>{t('--shareDetailsForSeamlessOnboardingExperience--')}</div>
                        </div>
                        <button className={styles.emptyFormMessageAction} onClick={onEnterDetails}>
                            <Trans t={t} i18nKey="--enterDetails--">
                                Enter details <ChevronRight color='var(--warm-prime-azure)' size={16}></ChevronRight>
                            </Trans>
                        </button>
                    </div>
                </div>
            </div>}

            {jurisdictionCountryCode && props.formData && <DispalyCompanyInfoFormV4 hideEdit={props.hideEdit} forceValidate={forceValidate} formData={props.formData} fields={props.fields} loadDocument={loadFile} taxFormKeys={props.taxFormKeys} taxKeys={props.taxKeys} onEdit={onEdit} />}

            {props.countryOptions && props.countryOptions.length > 0 && !isFieldDisabled(MULTI_LANG) && !props.hideEdit && <div className={styles.section}>
                <div className={styles.title}>
                    {t('--intlNameAddr--')}
                    {multiLingualAddresses.length === 0 && <div className={`${styles.additionalLang} ${styles.col2}`}>
                        <div className={styles.additionalLangIcon}><Globe size={18} color='var(--warm-neutral-shade-500)'></Globe></div>
                        <div className={styles.additionalLangInfo}>
                            <div className={styles.additionalLangInfoText}>{t('--addrOtherLang--')}</div>
                            <div className={styles.additionalLangInfoHelp}>{t('--helpUsersOtherLang--')}</div>
                        </div>
                    </div>}
                </div>
                {multiLingualAddresses.length > 0 && multiLingualAddresses.map((item, index) => {
                    return (
                        <div className={styles.row} key={index} id={`lingual_company_address_${item.language}`}>
                            <div className={classnames(styles.item, styles.col2)}>
                                <div className={styles.additionalLangItem}>
                                    <div className={styles.additionalLangItemName}>
                                        {getLanguageName(item.language) || mapAlpha2codeToDisplayName(item.language)}
                                        <Trash2 size={18} color='var(--warm-neutral-shade-200)' cursor={'pointer'} onClick={() => onLanguageDelete(item.language)}></Trash2>
                                    </div>
                                    <div className={styles.additionalLangItemAddress}>
                                        <TextBox
                                            label={t("Legal Company Name") || ''}
                                            value={item.legalName}
                                            required
                                            forceValidate={forceValidate}
                                            onChange={value => addNewLingualLegalName(value, item.language)}
                                        />
                                    </div>
                                    <div className={styles.additionalLangItemAddress}>
                                        <GoogleMultilinePlaceSearch
                                            id={`lingual_company_address${index}`}
                                            label={t("Company Address") || ''}
                                            value={item?.address || undefined}
                                            required
                                            excludeAddressSuggestion={excludeAddressSuggestion}
                                            forceValidate={forceValidate}
                                            countryOptions={props.countryOptions}
                                            onChange={(value, countryChanged) => addNewLingualAddress(value, item.language)}
                                            parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col2)} id='multiLingualAddresses-field'>
                        <div className={styles.additionalLangSelector} onClick={() => setShowCountryOption(!showCountryOption)}>
                            <Plus size={18} color='var(--warm-neutral-shade-200)'></Plus> {props.formData?.multiLingualAddresses && props.formData?.multiLingualAddresses?.length > 0 ? t('--moreLang--') : t('--selectLang--')}
                            {showCountryOption && <ClickAwayListener onClickAway={(e) => setShowCountryOption(false)}>
                                <div className={styles.additionalLangSelectorOption}>
                                    {countryOptionsForLanguage.map((item, index) => {
                                        return (
                                            <div className={styles.additionalLangSelectorOptionItem} key={index} onClick={() => onLanguageSelect(item)}>{item.displayName}</div>
                                        )
                                    })}
                                </div>
                            </ClickAwayListener>}
                        </div>
                    </div>
                </div>
            </div>}
            {!isFieldDisabled(INSTRUCTION) && !props.hideEdit && <div className={styles.section}>
                <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col2)} id="instruction-field">
                        <TextArea
                            label={getFieldLabelFromConfig(INSTRUCTION) || t("--additionalComments--")}
                            value={instruction}
                            disabled={isFieldDisabled(INSTRUCTION)}
                            required={isFieldRequired(INSTRUCTION)}
                            forceValidate={forceValidate}
                            validator={(value) => isFieldRequired(INSTRUCTION) && isEmpty(value) ? getFieldLabelFromConfig(INSTRUCTION) ? `${getFieldLabelFromConfig(INSTRUCTION)} is a required field` : t('Instruction is a required field') : ''}
                            onChange={value => { setInstruction(value); handleFieldValueChange(INSTRUCTION, instruction, value) }}
                        />
                    </div>
                </div>
            </div>}
            {(props.submitLabel || props.cancelLabel) && <div className={styles.section}>
                <div className={classnames(styles.row, styles.actionBar)} >
                    <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
                    <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
                        {props.cancelLabel &&
                            <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
                        {props.submitLabel &&
                            <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
                    </div>
                </div>
            </div>}
            <SnackbarComponent message={errorInformMessage} onClose={() => { setErrorInform(false) }} open={errorInform} autoHideDuration={20000}></SnackbarComponent>
            {open && <div className={styles.companyInfoFormFixedPopup}>
                <div className={styles.companyInfoFormPopup}>
                    <div className={`${styles.companyInfoFormPopupWrapper} ${activeIndex > 0 && IDocument ? styles.companyInfoFormPopupWrapperExpand : ''}`}>
                        {screen?.isSmallScreen && IDocument && headerInfoForMobileDocConfirm()}
                        <div className={styles.companyInfoFormPopupWrapperContents}>
                            {((IDocument && activeIndex > 0 && screen?.isBigScreen) || (IDocument && screen?.isSmallScreen)) && <div className={styles.companyInfoFormPopupWrapperExpandContainer}>
                                {screen?.isBigScreen && <div className={styles.companyInfoFormPopupWrapperExpandContainerHeader}>
                                    <div className={styles.companyInfoFormPopupWrapperExpandContainerHeaderName}>
                                        <OROFileIcon fileType={IDocument?.fileType || ''}></OROFileIcon>
                                        {IDocument?.fileName || 'Document'}
                                    </div>
                                    <div className={styles.companyInfoFormPopupWrapperExpandContainerHeaderActionItems}>
                                        <a target='_blank' rel='noopener noreferrer' href={IDocument.uri} download={IDocument?.fileName} className={styles.companyInfoFormPopupWrapperExpandContainerHeaderActionItemsDownload}>
                                            <Download size={16} color='var(--warm-prime-azure)' cursor={'pointer'}></Download>
                                        </a>
                                        <div className={styles.companyInfoFormPopupWrapperExpandContainerHeaderAction} onClick={() => { setIDocument(null); setPreviewedAttachment(null) }}>
                                            <Trans t={t} i18nKey="--hidePreview--">
                                                <EyeOff size={16} color='var(--warm-prime-azure)'></EyeOff>
                                                {'Hide preview'}
                                            </Trans>
                                        </div>
                                    </div>
                                </div>}
                                <div className={styles.companyInfoFormPopupWrapperContentsPreview}>
                                    <div className={styles.companyInfoFormPopupWrapperContentsPreviewContainer}>
                                        {InternalDocViewer}
                                    </div>
                                </div>
                            </div>}
                            {((screen?.isBigScreen) || (!IDocument && screen?.isSmallScreen)) && <div className={`${styles.companyInfoFormPopupContents} ${IDocument && screen?.isBigScreen ? styles.companyInfoFormPopupContentsShrinked : ''}`}>
                                {screen?.isBigScreen && headerInfoForWeb()}
                                {screen?.isSmallScreen && !IDocument && headerInfoForMobile()}
                                {activeIndex === 0 && <div className={styles.companyInfoFormPopupContentsCountrySelector}><CountrySelectionCompanyInfoV4 onCountrySelect={onChangeJurisdiction} countryOptions={props.countryOptions || []}></CountrySelectionCompanyInfoV4></div>}
                                {activeIndex === 1 && <LegalInfoCompanyInfoFormV4
                                    loadFile={loadFileOcerdFiles}
                                    indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                                    nameMismatch={props.nameMismatch}
                                    taxCodeFormatError={props.taxCodeFormatError}
                                    companyEntities={props.companyEntities}
                                    companyEntityCountryCodes={props.companyEntityCountryCodes}
                                    countryOptions={props.countryOptions}
                                    fetchChildren={props.fetchChildren}
                                    fields={props.fields}
                                    formData={props.formData}
                                    onJurisdictionCountryCodeEdit={onJurisdictionCountryCodeEdit}
                                    isOcrEnabled={props.isOcrEnabled}
                                    isInPortal={props.isInPortal}
                                    languageOptions={props.languageOptions}
                                    loadDocument={loadSpecialDocFile}
                                    loadOcredDocument={loadFileOcerdFiles}
                                    newTaxFormUploaded={props.newTaxFormUploaded}
                                    ocredDoc={props.ocredDoc}
                                    excludeAddressSuggestion={excludeAddressSuggestion}
                                    onFileDelete={onFileDelete}
                                    onFileUpload={props.onFileUpload}
                                    onPlaceSelectParseAddress={onPlaceSelectParseAddress}
                                    onSpecialTaxFileDelete={onSpecialTaxFileDelete}
                                    onSpecialTaxFileUpload={props.onSpecialTaxFileUpload}
                                    onSubmit={props.onSubmit}
                                    onValueChange={props.onValueChange}
                                    onValidateTINFormat={props.onValidateTINFormat}
                                    resetNewTaxFormUploaded={props.resetNewTaxFormUploaded}
                                    searchOptions={props.searchOptions}
                                    handleFormReady={handleFormReady}
                                    taxFormKeys={props.taxFormKeys}
                                    taxKeys={props.taxKeys}
                                    usCompanyEntityTypeOptions={props.usCompanyEntityTypeOptions}
                                    usForeignTaxClassificationOptions={props.usForeignTaxClassificationOptions}
                                    onCancel={props.onCancel}
                                    submitLabel={props.submitLabel}
                                    cancelLabel={props.cancelLabel}
                                />}
                                {activeIndex === 2 && <OtherCompanyInfoFormV4
                                    loadFile={loadFileOcerdFiles}
                                    indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                                    nameMismatch={props.nameMismatch}
                                    taxCodeFormatError={props.taxCodeFormatError}
                                    companyEntities={props.companyEntities}
                                    companyEntityCountryCodes={props.companyEntityCountryCodes}
                                    countryOptions={props.countryOptions}
                                    fetchChildren={props.fetchChildren}
                                    fields={props.fields}
                                    formData={props.formData}
                                    excludeAddressSuggestion={excludeAddressSuggestion}
                                    isOcrEnabled={props.isOcrEnabled}
                                    isInPortal={props.isInPortal}
                                    languageOptions={props.languageOptions}
                                    loadDocument={loadSpecialDocFile}
                                    loadOcredDocument={loadFileOcerdFiles}
                                    newTaxFormUploaded={props.newTaxFormUploaded}
                                    ocredDoc={props.ocredDoc}
                                    onFileDelete={onFileDelete}
                                    onFileUpload={props.onFileUpload}
                                    onPlaceSelectParseAddress={onPlaceSelectParseAddress}
                                    onSpecialTaxFileDelete={onSpecialTaxFileDelete}
                                    onSpecialTaxFileUpload={props.onSpecialTaxFileUpload}
                                    onSubmit={props.onSubmit}
                                    onValueChange={props.onValueChange}
                                    onValidateTINFormat={props.onValidateTINFormat}
                                    resetNewTaxFormUploaded={props.resetNewTaxFormUploaded}
                                    searchOptions={props.searchOptions}
                                    handleFormReady={handleFormReady}
                                    taxFormKeys={props.taxFormKeys}
                                    taxKeys={props.taxKeys}
                                    usCompanyEntityTypeOptions={props.usCompanyEntityTypeOptions}
                                    usForeignTaxClassificationOptions={props.usForeignTaxClassificationOptions}
                                    onCancel={props.onCancel}
                                    submitLabel={props.submitLabel}
                                    cancelLabel={props.cancelLabel}
                                />}
                                {screen?.isBigScreen && activeIndex > 0 && <div className={styles.companyInfoFormPopupContentsActions}>
                                    <div className={styles.companyInfoFormPopupContentsActionsSave}>
                                        <OroButton label={t('--saveChanges--')} type='default' radiusCurvature='medium' onClick={onSaveChanges}></OroButton>
                                    </div>
                                    {activeIndex > 1 && <OroButton label={t('--back--')} type='default' radiusCurvature='medium' onClick={() => setActiveIndex(activeIndex - 1)}></OroButton>}
                                    <OroButton label={activeIndex === 2 ? t('--submit--') : t('--continue--')} type='primary' radiusCurvature='medium' onClick={onContinueClick}></OroButton>
                                </div>}
                            </div>}
                        </div>
                        {screen?.isSmallScreen && activeIndex > 0 && <div className={styles.companyInfoFormPopupContentsActions}>
                            {!IDocument && activeIndex > 0 && <>
                                <OroButton width='fillAvailable' label={t('--saveChanges--')} type='default' radiusCurvature='medium' onClick={onSaveChanges}></OroButton>
                                <OroButton width='fillAvailable' label={activeIndex === 2 ? t('--submit--') : t('--continue--')} type='primary' radiusCurvature='medium' onClick={onContinueClick}></OroButton>
                            </>}
                            {IDocument && <>
                                <OroButton width='fillAvailable' label={t('--cancel--')} type='default' radiusCurvature='medium' onClick={() => { setIDocument(null); setPreviewedAttachment(null) }}></OroButton>
                                <OroButton width='fillAvailable' label={t('--confirm--')} type='primary' radiusCurvature='medium' onClick={() => { setIDocument(null); setPreviewedAttachment(null) }}></OroButton>
                            </>}
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    )
}

export function CompanyInfoFormV4(props: CompanyInfoV4FormProps) {
    const [formData, setFormData] = useState<CompanyInfoV4FormData>()
    const [selectedOption, setSelectedOption] = useState(-1)
    const [expandDetails, setExpandDetails] = useState(false)
    const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])
    function onOptionChange(index: number) {
        setSelectedOption(index)
        if (index === 0) {
            if (props.formData) {
                setFormData({ ...props.formData, showExistingOrExtensionSelection: true })
            }
        }
        if (index === 1) {
            setFormData({ ...getEmptyComapnyInfoV4(), showExistingOrExtensionSelection: false })
        }
    }
    useEffect(() => {
        setFormData(props.formData)
        if (props.formData?.showExistingOrExtensionSelection) {
            setSelectedOption(0)
        }
    }, [props.formData])
    return (
        <>
            {(props.formData?.newSupplierSelected || (!props.formData?.formApplicableForExtension && props.existingCompanyInfo)) &&
                <CompanyInfoFormV4Content
                    formData={props.formData}
                    companyEntities={props?.companyEntities}
                    companyEntityCountryCodes={props.companyEntityCountryCodes}
                    fields={props.fields}
                    countryOptions={props.countryOptions}
                    languageOptions={props.languageOptions}
                    isOcrEnabled={props.isOcrEnabled}
                    usCompanyEntityTypeOptions={props.usCompanyEntityTypeOptions}
                    usForeignTaxClassificationOptions={props.usForeignTaxClassificationOptions}
                    taxKeys={props.taxKeys}
                    taxFormKeys={props.taxFormKeys}
                    submitLabel={props.submitLabel}
                    cancelLabel={props.cancelLabel}
                    taxCodeFormatError={props.taxCodeFormatError}
                    fetchChildren={props.fetchChildren}
                    searchOptions={props.searchOptions}
                    onSpecialTaxFileUpload={props.onSpecialTaxFileUpload}
                    onSpecialTaxFileDelete={props.onSpecialTaxFileDelete}
                    indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                    nameMismatch={props.nameMismatch}
                    resetNewTaxFormUploaded={props.resetNewTaxFormUploaded}
                    newTaxFormUploaded={props.newTaxFormUploaded}
                    onSubmit={props.onSubmit}
                    onCancel={props.onCancel}
                    onReady={props.onReady}
                    onValueChange={props.onValueChange}
                    loadDocument={props.loadDocument}
                    onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                    onValidateTINFormat={props.onValidateTINFormat}
                    loadFile={props.loadFile}
                    isInPortal={props.isInPortal}
                    loadOcredDocument={props.loadOcredDocument}
                    ocredDoc={props.ocredDoc}
                    onFileDelete={props.onFileDelete}
                    onFileUpload={props.onFileUpload}
                />
            }
            {
                props.formData?.formApplicableForExtension && !props.formData?.newSupplierSelected &&
                <div className={styles.companyExtension}>
                    <div className={styles.companyExtensionHeader}>
                        <div className={styles.companyExtensionHeaderInfo}>{t('--wishesToExtendMoreCompanies--', { entity: props.companyEntities?.map(item => item.name).join(', ') || '' })}</div>
                        <div className={styles.companyExtensionHeaderSubText}>{t('--pleaseSelectRelevantOptionToProceed--')}</div>
                    </div>
                    <div className={styles.companyExtensionOptions}>
                        {props.formData?.allowSubsidiaryEntitySelection && <>
                            {selectedOption !== 0 && <div className={styles.companyExtensionOptionsNotChecked} onClick={() => onOptionChange(0)}></div>}
                            {selectedOption === 0 && <div className={styles.companyExtensionOptionsChecked}><Check size={14} strokeWidth={3} color='var(--warm-prime-chalk)'></Check></div>}
                        </>}
                        <div className={styles.companyExtensionOptionsItem}>
                            {props.formData?.allowSubsidiaryEntitySelection && <div className={styles.companyExtensionOptionsItemHeader}>{t('--useExistingCompanyInformationShownBelow--')}</div>}
                            <div className={styles.companyExtensionOptionsItemForm}>
                                <div className={!expandDetails && props.formData?.allowSubsidiaryEntitySelection ? styles.companyExtensionOptionsItemFormContent : styles.companyExtensionOptionsItemFormContentExpanded}>
                                    <CompanyInfoFormV4Content
                                        formData={props.formData}
                                        companyEntities={props?.companyEntities}
                                        companyEntityCountryCodes={props.companyEntityCountryCodes}
                                        fields={props.fields}
                                        countryOptions={props.countryOptions}
                                        languageOptions={props.languageOptions}
                                        isOcrEnabled={props.isOcrEnabled}
                                        usCompanyEntityTypeOptions={props.usCompanyEntityTypeOptions}
                                        usForeignTaxClassificationOptions={props.usForeignTaxClassificationOptions}
                                        taxKeys={props.taxKeys}
                                        taxFormKeys={props.taxFormKeys}
                                        submitLabel={props.submitLabel}
                                        cancelLabel={props.cancelLabel}
                                        taxCodeFormatError={props.taxCodeFormatError}
                                        fetchChildren={props.fetchChildren}
                                        searchOptions={props.searchOptions}
                                        onSpecialTaxFileUpload={props.onSpecialTaxFileUpload}
                                        onSpecialTaxFileDelete={props.onSpecialTaxFileDelete}
                                        indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                                        nameMismatch={props.nameMismatch}
                                        resetNewTaxFormUploaded={props.resetNewTaxFormUploaded}
                                        newTaxFormUploaded={props.newTaxFormUploaded}
                                        onSubmit={props.onSubmit}
                                        onCancel={props.onCancel}
                                        onReady={props.onReady}
                                        onValueChange={props.onValueChange}
                                        loadDocument={props.loadDocument}
                                        onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                                        onValidateTINFormat={props.onValidateTINFormat}
                                        loadFile={props.loadFile}
                                        isInPortal={props.isInPortal}
                                        loadOcredDocument={props.loadOcredDocument}
                                        ocredDoc={props.ocredDoc}
                                        onFileDelete={props.onFileDelete}
                                        onFileUpload={props.onFileUpload}
                                        hideEdit={selectedOption !== 0 && props.formData?.allowSubsidiaryEntitySelection}
                                        existingCompanyInfo={props.existingCompanyInfo}
                                    />
                                </div>
                                {props.formData?.allowSubsidiaryEntitySelection && <>
                                    {!expandDetails && <div className={styles.companyExtensionOptionsItemFormShadow}></div>}
                                    <div className={styles.companyExtensionOptionsItemFormExpand}>
                                        <div className={styles.companyExtensionOptionsItemFormExpandBorder}></div>
                                        {!expandDetails && <div className={styles.companyExtensionOptionsItemFormExpandText} onClick={() => setExpandDetails(true)}>
                                            <Trans t={t} i18nKey="--expandDetails--">
                                                {'Expand details'} <ChevronsDown size={18} color='var(--warm-prime-azure)' />
                                            </Trans>
                                        </div>}
                                        {expandDetails && <div className={styles.companyExtensionOptionsItemFormExpandText} onClick={() => setExpandDetails(false)}>
                                            <Trans t={t} i18nKey="--hideDetails--">
                                                {'Hide details'} <ChevronsDown size={18} color='var(--warm-prime-azure)' />
                                            </Trans>
                                        </div>}
                                        <div className={styles.companyExtensionOptionsItemFormExpandBorder}></div>
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                    {props.formData?.allowSubsidiaryEntitySelection && <>
                        <div className={styles.companyExtensionOptionsSeperator}></div>
                        <div className={styles.companyExtensionOptions}>
                            {selectedOption !== 1 && <div className={styles.companyExtensionOptionsNotChecked} onClick={() => onOptionChange(1)}></div>}
                            {selectedOption === 1 && <div className={styles.companyExtensionOptionsChecked}><Check size={14} strokeWidth={3} color='var(--warm-prime-chalk)'></Check></div>}
                            <div className={styles.companyExtensionOptionsItem}>
                                <div className={styles.companyExtensionOptionsItemHeader}>{t('--iWouldLikeToAddSubsidiary--')}</div>
                                <div className={styles.companyExtensionOptionsItemHeaderSubText}>{t('--selectThisToAddDifferentSubsidiary--')}</div>
                                {selectedOption === 1 && <div className={styles.companyExtensionOptionsItemForm}>
                                    <div className={styles.companyExtensionOptionsItemFormContentExpanded}>
                                        <CompanyInfoFormV4Content
                                            formData={formData}
                                            companyEntities={props?.companyEntities}
                                            companyEntityCountryCodes={props.companyEntityCountryCodes}
                                            fields={props.fields}
                                            countryOptions={props.countryOptions}
                                            languageOptions={props.languageOptions}
                                            isOcrEnabled={props.isOcrEnabled}
                                            usCompanyEntityTypeOptions={props.usCompanyEntityTypeOptions}
                                            usForeignTaxClassificationOptions={props.usForeignTaxClassificationOptions}
                                            taxKeys={props.taxKeys}
                                            taxFormKeys={props.taxFormKeys}
                                            submitLabel={props.submitLabel}
                                            cancelLabel={props.cancelLabel}
                                            taxCodeFormatError={props.taxCodeFormatError}
                                            fetchChildren={props.fetchChildren}
                                            searchOptions={props.searchOptions}
                                            onSpecialTaxFileUpload={props.onSpecialTaxFileUpload}
                                            onSpecialTaxFileDelete={props.onSpecialTaxFileDelete}
                                            indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                                            nameMismatch={props.nameMismatch}
                                            existingCompanyInfo={undefined}
                                            resetNewTaxFormUploaded={props.resetNewTaxFormUploaded}
                                            newTaxFormUploaded={props.newTaxFormUploaded}
                                            onSubmit={props.onSubmit}
                                            onCancel={props.onCancel}
                                            onReady={props.onReady}
                                            onValueChange={props.onValueChange}
                                            loadDocument={props.loadDocument}
                                            onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                                            onValidateTINFormat={props.onValidateTINFormat}
                                            loadFile={props.loadFile}
                                            isInPortal={props.isInPortal}
                                            loadOcredDocument={props.loadOcredDocument}
                                            ocredDoc={props.ocredDoc}
                                            onFileDelete={props.onFileDelete}
                                            onFileUpload={props.onFileUpload}
                                        />
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </>}
                </div>
            }
        </>
    )
}
