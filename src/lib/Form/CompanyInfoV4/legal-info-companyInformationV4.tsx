import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ArrowUpRight, ChevronDown, Edit3, Globe, HelpCircle, Trash2, Upload } from 'react-feather'
import { tooltipClasses, debounce, Popover } from '@mui/material'
import { CompanyInfoV4FormData, CompanyInfoV4FormProps, EnumsDataObject, Field, MultiLingualAddress, SupplierTaxFormKeyField, emptyEcncryptedData } from '../types'
import { Address, Attachment, Contact, EncryptedData, Option, OroMasterDataType, mapAttachment } from '../../Types'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import { EncryptedDataBox, GoogleMultilinePlaceSearch, Radio, TextArea, TextBox, TypeAhead, checkFileForS3Upload, imageFileAcceptType, pdfFileAcceptType } from '../../Inputs'
import { areArraysSame, areObjectsSame, getEmptyAddress, getFormFieldConfig, getFormFieldsMap, getOcredAddressUtil, getOcredBusinessEntityUtil, getOcredLegalNameUtil, getOcredTaxKeyValueUtil, getTaxFormDescriptionForKey, getTaxFormLinkForKey, getTaxFormLinkTextForKey, getTaxFormNameForKey, getTaxKeyDescriptionForKey, getTaxKeyNameForKey, isAddressInvalid, isDisabled, isEmpty, isOmitted, isRequired, mapIDRefToOption, mapOptionToIDRef } from '../util'
import { OroTooltip } from '../../Tooltip/tooltip.component'
import { OROFileIcon } from '../../RequestIcon'
import { mapAlpha2codeToDisplayName } from '../../util'
import { AttachmentsControlNew } from '../../controls'
import { LEGAL_NAME, US_TAX_FORM, TAX_ADDRESS, FOREIGN_TAX, TAX, INDIRECT_TAX, ENCRYPTED_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY, ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, US_COMPANY_ENTITY, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099, formDataWithUpdatedValue } from './utils'
import { Trans } from 'react-i18next'
import { OptionTreeData } from '../../MultiLevelSelect/types'
import { ConfirmationDialog } from '../../Modals'
import { getI18Text as getI18ControlText } from '../../i18n'

interface TaxFormFileUploaderProps {
    taxFormKey: string
    taxFormKeys?: Array<string>
    taxKeysList?: EnumsDataObject[]
    taxFormKeysList?: EnumsDataObject[]
    forceValidate: boolean
    required?: boolean
    disabled?: boolean
    inputFileAcceptTypes?: string
    taxForm?: Attachment | File | undefined
    isOCRSupported?: boolean
    isUsTaxDeclarationFormKey?: boolean
    foreignTaxClassification?: Option
    usForeignTaxClassificationOptions?: Array<Option>
    isAdditionalDocs?: boolean
    onTaxFormKeyChanged?: (taxFormKey: string) => void
    onUsForeignTaxClassificationChanged?: (classification: Option) => void
    onTaxFormChange?: ((value?: any) => void) | undefined
    validator?: (value?) => string | null
    onPreview?: () => Promise<Blob>
    onOcredFilePreview?: () => void
}

interface LegalInfoCompanyInfoFormV4Props extends CompanyInfoV4FormProps {
    onJurisdictionCountryCodeEdit?: () => void
    excludeAddressSuggestion?: boolean
}

const W8FORMS = [
    {
        "code": "foreignCompany",
        "name": "W-8BENE Tax form",
        "description": "You are a foreign business entity that receives income from the sources in U.S",
        "linkText": "You can find the W-8BENE Tax form and the instructions on the IRS website.",
        "link": "https://www.irs.gov/forms-pubs/about-form-w-8-ben-e"
    },
    {
        "code": "foreignPartnership",
        "name": "W-8IMY Tax form",
        "description": "You are a business intermediary that receives income from sources in the U.S on behalf of a foreigner.",
        "linkText": "You can find the W-8IMY Tax form and instructions on the IRS website.",
        "link": "https://www.irs.gov/forms-pubs/about-form-w-8-imy"
    },
    {
        "code": "foreignGoverment",
        "name": "W-8EXP Tax form",
        "description": 'You are a foreign government or a foundation or a tax-exempt organization that receives income from the sources in U.S',
        "linkText": "You can find the W-8EXP Tax form and instructions on the IRS website.",
        "link": "https://www.irs.gov/forms-pubs/about-form-w-8-exp"
    }
]

export const US_COUNTRY_CODE = 'US'

const WANTED_FIELDS = [LEGAL_NAME, TAX_ADDRESS, FOREIGN_TAX, TAX,
    INDIRECT_TAX, ENCRYPTED_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY,
    ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, US_COMPANY_ENTITY, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099, US_TAX_FORM]


export function TaxFormFileUploader(props: TaxFormFileUploaderProps) {
    const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)
    const taxFormInputRef = useRef<any>(null)
    const [error, setError] = useState<string | null>()
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
    function uploadFile(file: Array<File>) {
        if (props.onTaxFormChange && file.length > 0) {
            props.onTaxFormChange(file[0] as File)
            setError('')
        }
    }
    const handleFiles = (files: Array<File>) => {
        const _file: Array<File> = []
        for (let i = 0; i < files.length; i++) {
            const file = checkFileForS3Upload(files[i])
            _file.push(file)
        }
        uploadFile(_file)
    }
    const filesSelected = (event) => {
        if (!props.disabled) {
            if (event.target.files.length > 0) {
                handleFiles(event.target.files)
            }
        }
    }
    function openFileInput(event: any) {
        event.stopPropagation()
        if (taxFormInputRef && taxFormInputRef.current && props.taxFormKey) {
            taxFormInputRef.current.click()
        }
    }
    function onDeleteFile() {
        setAnchorEl(null)
        setShowDeleteConfirmation(false)
        if (!props.disabled && props.onTaxFormChange) {
            props.onTaxFormChange()
        }
    }
    function handleAttachmentDelete(event) {
        event.stopPropagation()
        setShowDeleteConfirmation(true)
        setAnchorEl(null)
    }
    function previewFile() {
        if (props.onOcredFilePreview) {
            props.onOcredFilePreview()
        }
    }
    const handleClosePopover = () => {
        setAnchorEl(null);
    }
    function onTaxFormKeyChanged(taxFormKey: string) {
        if (props.onTaxFormKeyChanged) {
            props.onTaxFormKeyChanged(taxFormKey)
            handleClosePopover()
        }
    }
    function onUsForeignTaxClassificationChanged(classification: Option) {
        if (props.onUsForeignTaxClassificationChanged) {
            props.onUsForeignTaxClassificationChanged(classification)
            handleClosePopover()
        }
    }
    useEffect(() => {
        if (props.forceValidate && props.validator) {
            const err = props.validator(props.taxForm)
            setError(err)
        }
    }, [props.forceValidate])
    const openPopover = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    }

    return (
        <>
            {((props.taxFormKeys && props.taxFormKeys?.length > 0) || props.isUsTaxDeclarationFormKey) && <div>
                <div className={`${styles.fileUploader} ${anchorEl ? styles.fileUploaderActive : ''} ${error ? styles.fileUploaderError : ''}`}>
                    <div className={styles.fileUploaderContainer}>
                        {props.taxFormKeys?.length === 1 && <div className={styles.fileUploaderContainerKey}>
                            <div className={styles.fileUploaderContainerKeyName}>
                                {getTaxFormNameForKey(props.taxFormKey, props.taxFormKeysList || [])}
                                {getTaxFormDescriptionForKey(props.taxFormKey, props.taxFormKeysList || []) && <OroTooltip sx={{
                                    [`& .${tooltipClasses.tooltip}`]: {
                                        maxWidth: '420px',
                                        backgroundColor: 'var(--warm-neutral-shade-600)',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '20px'
                                    }
                                }} arrow title={getTaxFormDescriptionForKey(props.taxFormKey, props.taxFormKeysList || [])}>
                                    <HelpCircle size={16} color='var(--warm-prime-azure)' />
                                </OroTooltip>}
                                {props.isAdditionalDocs && <span>{`${props.isAdditionalDocs ? `(${getI18Text('--ifApplicable--')})` : ''}`}</span>}
                            </div>
                        </div>}
                        {props.taxFormKeys && props.taxFormKeys?.length > 1 && <div className={styles.fileUploaderContainerKey} onClick={openPopover}>
                            <div className={styles.fileUploaderContainerKeyName}>
                                {getTaxFormNameForKey(props.taxFormKey, props.taxFormKeysList || []) || t('--selectTaxForm--')} <ChevronDown size={18} color='var(--warm-neutral-shade-500)'></ChevronDown>
                            </div>
                            <Popover open={open} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                                <div className={styles.fileUploaderContainerKeyDropdown}>
                                    <div className={styles.fileUploaderContainerKeyDropdownHeader}>{getI18Text('--chooseAnOption--')}</div>
                                    {
                                        props.taxFormKeys.map((item, index) => {
                                            return (
                                                <div key={index} className={`${styles.fileUploaderContainerKeyDropdownItem} ${item === props.taxFormKey ? styles.fileUploaderContainerKeyDropdownItemActive : ''}`} onClick={() => onTaxFormKeyChanged(item)}>
                                                    <div className={styles.fileUploaderContainerKeyDropdownItemName}>{getTaxFormNameForKey(item, props.taxFormKeysList || [])}</div>
                                                    <div className={styles.fileUploaderContainerKeyDropdownItemDesc}>{getTaxFormDescriptionForKey(item, props.taxFormKeysList || [])}</div>
                                                    {getTaxFormLinkForKey(item, props.taxFormKeysList || []) && <a className={styles.fileUploaderContainerKeyDropdownItemLink} href={getTaxFormLinkForKey(item, props.taxFormKeysList || [])} target="_blank" rel="noopener noreferrer">{getTaxFormLinkTextForKey(item, props.taxFormKeysList || []) || 'Reference'} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Popover>
                        </div>}
                        {props.isUsTaxDeclarationFormKey && <div className={styles.fileUploaderContainerKey}>
                            <div className={styles.fileUploaderContainerKeyName} onClick={openPopover}>
                                {getTaxFormNameForKey(props.foreignTaxClassification?.path || '', W8FORMS) || t('--selectTaxForm--')} <ChevronDown size={18} color='var(--warm-neutral-shade-500)'></ChevronDown>
                            </div>
                            <Popover open={open} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                                <div className={styles.fileUploaderContainerKeyDropdown}>
                                    <div className={styles.fileUploaderContainerKeyDropdownHeader}>{getI18Text('--chooseAnOption--')}</div>
                                    {
                                        props.usForeignTaxClassificationOptions && props.usForeignTaxClassificationOptions.map((item, index) => {
                                            return (
                                                <div key={index} className={`${styles.fileUploaderContainerKeyDropdownItem} ${item.path === props.foreignTaxClassification?.path ? styles.fileUploaderContainerKeyDropdownItemActive : ''}`} onClick={() => onUsForeignTaxClassificationChanged(item)}>
                                                    <div className={styles.fileUploaderContainerKeyDropdownItemName}>{getTaxFormNameForKey(item.path, W8FORMS)}</div>
                                                    <div className={styles.fileUploaderContainerKeyDropdownItemDesc}>{getTaxFormDescriptionForKey(item.path, W8FORMS)}</div>
                                                    {getTaxFormLinkForKey(item.path, W8FORMS) && <a className={styles.fileUploaderContainerKeyDropdownItemLink} href={getTaxFormLinkForKey(item.path, W8FORMS)} target="_blank" rel="noopener noreferrer">{getTaxFormLinkTextForKey(item.path, W8FORMS) || 'Reference'} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Popover>
                        </div>}
                        <div className={`${styles.fileUploaderContainerUpload} ${props.taxFormKey ? '' : styles.fileUploaderContainerUploadDisabled}`} onClick={openFileInput}>
                            <Trans t={t} i18nKey="--uploadButton--">
                                <Upload size={16} color={props.taxFormKey ? 'var(--warm-prime-azure)' : 'var(--warm-neutral-shade-200)'}></Upload> Upload
                            </Trans>
                        </div>
                        
                        <input
                            ref={taxFormInputRef}
                            name="file"
                            className={styles.fileUploaderContainerUploadInput}
                            type="file"
                            title=""
                            accept={props.inputFileAcceptTypes || `${imageFileAcceptType},${pdfFileAcceptType}`}
                            disabled={props.disabled}
                            onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
                            onChange={(e) => filesSelected(e)}
                        />
                    </div>
                    {props.taxForm && <div className={styles.fileUploaded} onClick={previewFile}>
                        <div className={styles.fileUploadedName}>
                            <OROFileIcon fileType={(props.taxForm as Attachment).mediatype || ''}></OROFileIcon>
                            {(props.taxForm as Attachment).filename || (props.taxForm as File).name || ''}
                        </div>
                        <div className={styles.fileUploadedAction}><Trash2 onClick={handleAttachmentDelete} size={18} cursor='pointer' color="var(--warm-neutral-shade-200)" /></div>
                    </div>}
                </div>
                {error &&
                    <div className={styles.fileUploaderErrorMsg}>
                        <AlertCircle size={16} color={'var(--warm-stat-chilli-regular)'} />{error}
                    </div>}
                {getTaxFormLinkForKey(props.taxFormKey, props.taxFormKeysList || []) && props.taxFormKeys?.length === 1 && <a className={styles.taxFormLink} href={getTaxFormLinkForKey(props.taxFormKey, props.taxFormKeysList || [])} target="_blank" rel="noopener noreferrer">{getTaxFormLinkTextForKey(props.taxFormKey, props.taxFormKeysList || []) || 'Reference'} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>}
            </div>}
            <ConfirmationDialog
                actionType="danger"
                title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteConfirmation--')}
                description={getI18ControlText('--fieldTypes--.--legalDocs--.--thisCannotBeUndone--')}
                primaryButton={getI18ControlText('--fieldTypes--.--legalDocs--.--delete--')}
                secondaryButton={getI18ControlText('--fieldTypes--.--legalDocs--.--cancel--')}
                isOpen={showDeleteConfirmation}
                width = {460}
                theme="coco"
                toggleModal={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
                onPrimaryButtonClick={onDeleteFile}
                onSecondaryButtonClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
            />
        </>
    )
}

export function LegalInfoCompanyInfoFormV4(props: LegalInfoCompanyInfoFormV4Props) {
    const [usCompanyEntityTypeOptions, setCompanyEntityTypeOptions] = useState<Option[]>([])
    const [usForeignTaxClassificationOptions, setUsForeignTaxClassificationOptions] = useState<Option[]>([])
    const [legalName, setLegalName] = useState<string>('')
    const [taxAddress, setTaxAddress] = useState<Address>(getEmptyAddress())
    const [usCompanyEntityType, setUsCompanyEntityType] = useState<Option | null>(null)
    const [encryptedTaxCode, setEncryptedTaxCode] = useState<EncryptedData>(emptyEcncryptedData)
    const [taxForm, setTaxForm] = useState<Attachment>()
    const [indirectTaxForm, setIndirectTaxForm] = useState<Attachment>()
    const [foreignTaxClassification, setForeignTaxClassification] = useState<Option | null>(null)
    const [specialTaxStatus, setSpecialTaxStatus] = useState<boolean | undefined | null>(undefined)
    const [specialTaxNote, setSpecialTaxNote] = useState<string>('')
    const [specialTaxAttachments, setSpecialTaxAttachments] = useState<Array<Attachment>>([])
    const [usTaxDeclarationForm, setUsTaxDeclarationForm] = useState<Attachment>()
    const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [indirectTaxKey, setIndirectTaxKey] = useState('')
    const [taxKey, setTaxKey] = useState('')
    const [encryptedIndirectTaxCode, setEncryptedIndirectTaxCode] = useState<EncryptedData>(emptyEcncryptedData)
    const [usTaxDeclarationFormKey, setUsTaxDeclarationFormKey] = useState('')
    const [taxFormKey, setTaxFormKey] = useState('')
    const [indirectTaxFormKey, setIndirectTaxFormKey] = useState('')
    const [tax1099, setTax1099] = useState<Option | null>()
    const [taxCodeFormatError, setTaxCodeFormatError] = useState(false)
    const [indirectTaxCodeFormatError, setIndirectTaxCodeFormatError] = useState(false)
    const [additionalDocumets, setAdditionalDocumets] = useState<Array<SupplierTaxFormKeyField>>([])
    const [jurisdictionCountryCode, setJurisdictionCountryCode] = useState<string>('')
    const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])

    useEffect(() => {
        setTaxCodeFormatError(props.taxCodeFormatError)
    }, [props.taxCodeFormatError])

    useEffect(() => {
        setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
    }, [props.indirectTaxCodeFormatError])

    const tax1099Options: Array<Option> = [
        {
            id: 'yes',
            displayName: t('Yes'),
            path: 'yes'
        },
        {
            id: 'no',
            displayName: t('No'),
            path: 'no'
        },
    ]

    useEffect(() => {
        if (props.formData) {
            setLegalName(props.formData?.legalName)
            setTaxAddress(props.formData?.taxAddress || { ...getEmptyAddress(), alpha2CountryCode: props.formData?.jurisdictionCountryCode })
            setUsCompanyEntityType(props.formData?.usCompanyEntityType?.id ? mapIDRefToOption(props.formData.usCompanyEntityType) : null)
            setEncryptedTaxCode(props.formData?.tax?.encryptedTaxCode || emptyEcncryptedData)
            setTaxForm(props.formData?.taxForm?.taxForm || undefined)
            setIndirectTaxForm(props.formData?.indirectTaxForm?.taxForm || undefined)
            setForeignTaxClassification(props.formData?.foreignTaxClassification?.id ? mapIDRefToOption(props.formData.foreignTaxClassification) : null)
            setSpecialTaxStatus(props.formData?.specialTaxStatus)
            setSpecialTaxNote(props.formData?.specialTaxNote)
            setSpecialTaxAttachments(props.formData?.specialTaxAttachments || [])
            setUsTaxDeclarationForm(props.formData?.usTaxDeclarationForm || undefined)
            setEncryptedIndirectTaxCode(props.formData?.indirectTax?.encryptedTaxCode || emptyEcncryptedData)
            setUsTaxDeclarationFormKey(props.formData?.usTaxDeclarationFormKey)
            setAdditionalDocumets(props.formData?.additionalDocuments || [])
            setJurisdictionCountryCode(props.formData?.jurisdictionCountryCode || '')

            if (props.formData?.tax?.taxKey) {
                setTaxKey(props.formData?.tax?.taxKey)
            } else if (props.formData?.tax?.taxKeysList?.length >= 1) {
                setTaxKey(props.formData?.tax?.taxKeysList?.[0])
            } else {
                setTaxKey('')
            }

            if (props.formData?.indirectTax?.taxKey) {
                setIndirectTaxKey(props.formData?.indirectTax?.taxKey)
            } else if (props.formData?.indirectTax?.taxKeysList?.length >= 1) {
                setIndirectTaxKey(props.formData?.indirectTax?.taxKeysList?.[0])
            } else {
                setIndirectTaxKey('')
            }

            if (props.formData?.taxForm?.taxFormKey) {
                setTaxFormKey(props.formData?.taxForm?.taxFormKey)
            } else if (props.formData?.taxForm?.taxFormKeysList?.length === 1) {
                setTaxFormKey(props.formData?.taxForm?.taxFormKeysList?.[0])
            } else {
                setTaxFormKey('')
            }

            if (props.formData?.indirectTaxForm?.taxFormKey) {
                setIndirectTaxFormKey(props.formData?.indirectTaxForm?.taxFormKey)
            } else if (props.formData?.indirectTaxForm?.taxFormKeysList?.length === 1) {
                setIndirectTaxFormKey(props.formData?.indirectTaxForm?.taxFormKeysList?.[0])
            } else {
                setIndirectTaxFormKey('')
            }

            if (props.formData?.tax1099Required && props.formData?.tax1099 !== undefined && props.formData?.tax1099 !== null) {
                if (props.formData?.tax1099) {
                    setTax1099(tax1099Options[0])
                } else {
                    setTax1099(tax1099Options[1])
                }
            }
        }
    }, [props.formData])

    useEffect(() => {
        if (props.fields) {
            setFieldMap(getFormFieldsMap(props.fields, WANTED_FIELDS))
        }
    }, [props.fields])

    useEffect(() => {
        props.usCompanyEntityTypeOptions && setCompanyEntityTypeOptions(props.usCompanyEntityTypeOptions)
    }, [props.usCompanyEntityTypeOptions])

    useEffect(() => {
        props.usForeignTaxClassificationOptions && setUsForeignTaxClassificationOptions(props.usForeignTaxClassificationOptions)
    }, [props.usForeignTaxClassificationOptions])

    function getFormData(): CompanyInfoV4FormData {
        return {
            companyName: props.formData?.companyName || '',
            legalName,
            jurisdictionCountryCode,
            useCompanyName: false,
            website: props.formData?.website || '',
            duns: props.formData?.duns || '',
            email: props.formData?.email || '',
            phone: props.formData?.phone || '',
            address: props.formData?.address || null,
            formApplicableForExtension: props.formData?.formApplicableForExtension,
            newSupplierSelected: props.formData?.newSupplierSelected,
            usTaxDeclarationFormOcrInfo: props.formData?.usTaxDeclarationFormOcrInfo,
            companyEntities: props.formData?.companyEntities,
            showExistingOrExtensionSelection: props.formData?.showExistingOrExtensionSelection,
            taxAddress: taxAddress || null,
            useCompanyAddress: false,
            primary: { fullName: props.formData?.primary?.fullName || '', email: props.formData?.primary?.email || '', role: props.formData?.primary?.role || '', phone: props.formData?.primary?.phone || '' },
            paymentContactEmail: props.formData?.paymentContactEmail || '',
            companyEntityCountryCodes: props.formData?.companyEntityCountryCodes || [],
            usCompanyEntityType: usCompanyEntityType?.path ? mapOptionToIDRef(usCompanyEntityType) : null,
            indirectTax: {
                encryptedTaxCode: indirectTaxKey ? encryptedIndirectTaxCode : null,
                taxCodeError: props.formData?.indirectTax?.taxCodeError || false,
                taxCodeValidationTimeout: props.formData?.indirectTax?.taxCodeValidationTimeout || false,
                taxKey: indirectTaxKey,
                taxKeysList: props.formData?.indirectTax?.taxKeysList || []
            },
            tax: {
                encryptedTaxCode,
                taxCodeError: props.formData?.tax?.taxCodeError || false,
                taxCodeValidationTimeout: props.formData?.tax?.taxCodeValidationTimeout || false,
                taxKey,
                taxKeysList: props.formData?.tax?.taxKeysList || []
            },
            taxForm: {
                taxForm: taxFormKey && taxForm ? taxForm : null,
                taxFormKey,
                taxFormKeysList: props.formData?.taxForm?.taxFormKeysList || []
            },
            indirectTaxForm: {
                taxForm: indirectTaxFormKey && indirectTaxForm ? indirectTaxForm : null,
                taxFormKey: indirectTaxFormKey,
                taxFormKeysList: props.formData?.indirectTaxForm?.taxFormKeysList || []
            },
            foreignTaxClassification: foreignTaxClassification?.path ? mapOptionToIDRef(foreignTaxClassification) : null,
            specialTaxStatus,
            specialTaxNote: specialTaxStatus ? specialTaxNote : '',
            specialTaxAttachments: specialTaxStatus && specialTaxAttachments.length > 0 ? specialTaxAttachments : [],
            usTaxDeclarationFormKey,
            usTaxDeclarationForm: usTaxDeclarationFormKey && usTaxDeclarationForm ? usTaxDeclarationForm : null,
            tax1099Required: props.formData?.tax1099Required || false,
            tax1099: tax1099?.path ? tax1099?.path === 'yes' : undefined,
            instruction: props.formData?.instruction || '',
            fax: props.formData?.fax || '',
            additionalDocsList: props.formData?.additionalDocsList || [],
            additionalDocuments: additionalDocumets,
            multiLingualAddresses: props.formData?.multiLingualAddresses
        }
    }

    function getFormDataWithUpdatedValue(fieldName: string, newValue: string | Address | Contact | Array<MultiLingualAddress> | Option | EncryptedData | Attachment | File | boolean | undefined | null): CompanyInfoV4FormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as CompanyInfoV4FormData

        switch (fieldName) {
            case TAX_FORM:
                if (!newValue) {
                    setTaxForm(undefined)
                }
                break
            case INDIRECT_TAX_FORM:
                if (!newValue) {
                    setIndirectTaxForm(undefined)
                }
                break
            case US_TAX_FORM:
                if (!newValue) {
                    setUsTaxDeclarationForm(undefined)
                }
                break
        }

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

    function validateField(fieldName: string, label: string, value: string | string[]): string {
        if (fieldName === 'jurisdictionCountry') {
            return isEmpty(value) ? t("is required field", { label }) : ''
        } else if (fieldMap) {
            const field = fieldMap[fieldName]
            return isRequired(field) && isEmpty(value) ? t("is required field", { label }) : ''
        } else {
            return ''
        }
    }

    function validateAddressField(fieldName: string, label: string, value: Address): string {
        if (taxAddress?.alpha2CountryCode && jurisdictionCountryCode !== taxAddress?.alpha2CountryCode && fieldName === TAX_ADDRESS) {
            return t("--countryDifferentFromJurisdictionCountry--")
        } else if (fieldMap) {
            const field = fieldMap[fieldName]
            if (isRequired(field)) {
                if (!value) {
                    return t("is required field", { label })
                }
                // else if (isAddressInvalid(value)) {
                //    return t("is invalid", { label })
                // }
                else {
                    return ''
                }
            } else {
                return ''
            }
        } else {
            return ''
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
                    case LEGAL_NAME:
                        invalidFieldId = 'legal-name-field'
                        return !legalName
                    case TAX_ADDRESS:
                        invalidFieldId = 'tax-address-field'
                        return isAddressInvalid(taxAddress)
                    case TAX:
                        if (props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 0 && !taxKey) {
                            invalidFieldId = 'taxKey-field'
                            return props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 0 && !taxKey
                        } else {
                            invalidFieldId = 'taxCode-field'
                            return taxKey && !(encryptedTaxCode.maskedValue || encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
                        }
                    case ENCRYPTED_TAX_CODE:
                        invalidFieldId = 'taxCode-field'
                        return taxKey && !(encryptedTaxCode.maskedValue || encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
                    case INDIRECT_TAX:
                        if (props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 0 && !indirectTaxKey) {
                            invalidFieldId = 'indirectTaxKey-field'
                            return props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 0 && !indirectTaxKey
                        } else {
                            invalidFieldId = 'encryptedIndirectTaxCode-field'
                            return indirectTaxKey && !(encryptedIndirectTaxCode.maskedValue || encryptedIndirectTaxCode.unencryptedValue) && !props.indirectTaxCodeFormatError
                        }
                    case ENCRYPTED_INDIRECT_TAX_CODE:
                        invalidFieldId = 'encryptedIndirectTaxCode-field'
                        return indirectTaxKey && !(encryptedIndirectTaxCode.maskedValue || encryptedIndirectTaxCode.unencryptedValue) && !props.indirectTaxCodeFormatError
                    case US_TAX_FORM_KEY:
                        invalidFieldId = 'usTaxDeclarationForm-field'
                        return foreignTaxClassification && ((usTaxDeclarationFormKey && !usTaxDeclarationForm) || (!usTaxDeclarationFormKey))
                    case TAX_FORM:
                        invalidFieldId = 'taxFormKey-field'
                        return props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0 && ((taxFormKey && !taxForm) || (!taxFormKey))
                    case INDIRECT_TAX_FORM:
                        invalidFieldId = 'taxFormKey-field'
                        return props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0 && ((indirectTaxFormKey && !indirectTaxForm) || (!indirectTaxFormKey))
                    case SPECIAL_TAX_STATUS:
                        invalidFieldId = 'specialTaxStatus-field'
                        return specialTaxStatus === undefined && props.formData?.tax1099Required
                    case SPECIAL_TAX_NOTE:
                        invalidFieldId = 'specialTaxNote-field'
                        return specialTaxStatus && !specialTaxNote
                    case US_COMPANY_ENTITY:
                        invalidFieldId = 'usCompanyEntityType-field'
                        return !usCompanyEntityType?.path && props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && jurisdictionCountryCode === US_COUNTRY_CODE && usCompanyEntityTypeOptions?.length > 0
                    case TAX_1099:
                        invalidFieldId = 'tax1099-field'
                        return !tax1099?.path && props.formData?.tax1099Required
                }
            }
        })

        // if (jurisdictionCountryCode !== taxAddress?.alpha2CountryCode && isFieldRequired('taxAddress')) {
        //     invalidFieldId = 'tax-address-field'
        //     isInvalid = true
        // }

        if (!isInvalid) {
            if (specialTaxStatus && specialTaxAttachments?.length === 0) {
                isInvalid = true
                invalidFieldId = 'specialTaxAttachment-field'
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
                input?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
                (input.parentNode as HTMLElement).scrollTop = input.offsetTop;
            }
        }
    }

    function fetchData(skipValidation?: boolean): CompanyInfoV4FormData | null {
        if (skipValidation) {
            return getFormData()
        } else {
            // setErrorInCountryCode(false)
            const invalidFieldId = isFormInvalid()
            if (invalidFieldId) {
                triggerValidations(invalidFieldId)
                console.warn('triggerValidations: Could not find element - ', invalidFieldId)
            }

            return invalidFieldId ? null : getFormData()
        }
    }

    useEffect(() => {
        if (props.handleFormReady) {
            props.handleFormReady(fetchData)
        }
    }, [
        legalName, props.formData,
        usCompanyEntityType, taxAddress, taxForm, foreignTaxClassification, encryptedTaxCode,
        specialTaxStatus, specialTaxNote, specialTaxAttachments, taxFormKey, tax1099, jurisdictionCountryCode,
        taxKey, indirectTaxKey, encryptedIndirectTaxCode, usTaxDeclarationFormKey, usTaxDeclarationForm, indirectTaxForm, indirectTaxFormKey
    ])

    function handleFileChange(fieldName: string, file?: File, attachment?: Attachment) {
        if (file) {
            if (props.onFileUpload) {
                props.onFileUpload(file, fieldName)
            }
            handleFieldValueChange(fieldName, 'file', file)
        } else {
            if (props.onFileDelete && attachment) {
                props.onFileDelete(fieldName, attachment)
            }
            handleFieldValueChange(fieldName, 'file', file as unknown as File)
        }
    }

    function handleAdditionalDocChange(item: string, file?: File, attachment?: Attachment) {
        const docIndex = additionalDocumets.findIndex(doc => doc.taxFormKey === item)
        if (file) {
            const newValue = additionalDocumets
            if (docIndex !== -1) {
                newValue[docIndex] = {
                    taxForm: mapAttachment(file),
                    taxFormKey: item,
                    taxFormKeysList: []
                }
            } else {
                newValue.push({
                    taxForm: mapAttachment(file),
                    taxFormKey: item,
                    taxFormKeysList: []
                })
            }
            if (props.onSpecialTaxFileUpload) {
                props.onSpecialTaxFileUpload(file, `additionalDocuments[${docIndex !== -1 ? docIndex : newValue.length - 1}].taxForm`, { ...getFormData(), additionalDocuments: newValue || additionalDocumets })
            }
        } else {
            if (props.onSpecialTaxFileDelete && attachment) {
                const newValue = [...additionalDocumets]
                newValue.splice(docIndex, 1)
                props.onSpecialTaxFileDelete(`additionalDocuments[${docIndex}].taxForm`, { ...getFormData() }, attachment)
            }
        }
    }

    function handleSpecialAttachmentsFileChange(fieldName: string, file?: File, files?: Array<Attachment>, attachment?: Attachment) {
        if (file) {
            if (props.onSpecialTaxFileUpload) {
                props.onSpecialTaxFileUpload(file, fieldName, { ...getFormData(), specialTaxAttachments: files || specialTaxAttachments })
            }
        } else {
            if (props.onSpecialTaxFileDelete && attachment) {
                props.onSpecialTaxFileDelete(fieldName, { ...getFormData() }, attachment)
            }
        }
    }

    function loadFileOcerdFiles(fieldName: string, attachment: Attachment) {
        if (fieldName && props.loadFile) {
            props.loadFile(fieldName, attachment)
        }
    }

    function onPlaceSelectParseAddress(place: any): Promise<Address> {
        if (props.onPlaceSelectParseAddress) {
            return props.onPlaceSelectParseAddress(place)
        } else {
            return Promise.reject()
        }
    }

    function convertTaxKeyToOption(taxKey: string): Option | null {
        if (taxKey) {
            return {
                id: taxKey,
                displayName: getTaxKeyNameForKey(taxKey, props.taxKeys || []),
                path: taxKey,
                selectable: true
            }
        } else {
            return null
        }
    }

    function convertStringArrayToOptions(taxKey: Array<string>): Array<Option> {
        const convertedOptions: Array<Option> = []
        taxKey.forEach(item => {
            convertedOptions.push({
                id: item,
                displayName: getTaxKeyNameForKey(item, props.taxKeys || []),
                path: item,
                selectable: true
            })
        })
        return convertedOptions
    }

    function getTaxKeyFromOption(value: Option): string | null {
        if (value) {
            return value.path
        } else {
            return null
        }
    }

    function getTaxKeysList(): Array<Option> {
        return convertStringArrayToOptions(props.formData?.tax?.taxKeysList || [])
    }

    function getIndirectTaxKeysList(): Array<Option> {
        return convertStringArrayToOptions(props.formData?.indirectTax?.taxKeysList || [])
    }

    function handleValidateTinFormat(taxKey: string, encryptedTaxCode: EncryptedData, taxCode: string) {
        if (props.onValidateTINFormat) {
            if (encryptedTaxCode.unencryptedValue || encryptedTaxCode.maskedValue) {
                props.onValidateTINFormat(taxKey, taxAddress.alpha2CountryCode, encryptedTaxCode, taxCode)
            }
        }
    }

    function getAdditionalTaxFormForKey(key: string): Attachment | File | undefined {
        const taxForm = props.formData?.additionalDocuments.find(item => item.taxFormKey === key)
        return taxForm?.taxForm || undefined
    }

    function findAdditionalDocIndexForPriview(item: string): number {
        const docIndex = additionalDocumets.findIndex(doc => doc.taxFormKey === item)
        return docIndex
    }


    function getOcredAddress(): string {
        return getOcredAddressUtil(props.formData, taxAddress)
    }

    function getOcredBusinessEntity(): string {
        return getOcredBusinessEntityUtil(props.formData, props.usCompanyEntityTypeOptions || [], usCompanyEntityType || undefined)
    }

    function getOcredTaxKeyValue(): string {
        return getOcredTaxKeyValueUtil(props.formData, encryptedTaxCode)
    }

    function getOcredLegalName(): string {
        return getOcredLegalNameUtil(props.formData, legalName)
    }

    function fetchChildren(masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
        if (props.fetchChildren) {
            return props.fetchChildren(parent, childrenLevel, masterDataType)
        } else {
            return Promise.reject('fetchChildren API not available')
        }
    }

    function searchMasterdataOptions(keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
        if (props.searchOptions) {
            return props.searchOptions(keyword, masterDataType)
        } else {
            return Promise.reject('searchOptions API not available')
        }
    }

    function getFieldLabelFromConfig(fieldName: string): string {
        return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
    }

    function loadDocument(fieldName: string, attachment: Attachment): Promise<Blob> {
        if (props.loadDocument && fieldName) {
            return props.loadDocument(fieldName, attachment)
        } else {
            return Promise.reject('fieldName not found')
        }
    }

    function onJurisdictionCountryCodeEdit () {
        if (props.onJurisdictionCountryCodeEdit) {
            props.onJurisdictionCountryCodeEdit()
        }
    }

    return (
        <div className={styles.companyInfoFormPopupContentsContainer}>
            <div className={styles.section}>
                <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="legal-name-field">
                        <div className={styles.companyInfoFormPopupContentsHeaderProgressInfo}>
                            <div className={styles.companyInfoFormPopupContentsHeaderProgressInfoCountry}>
                                <Globe size={16} color='var(--warm-neutral-shade-400)'></Globe>{t('--jurisdictionCountry--')}
                                <OroTooltip sx={{
                                    [`& .${tooltipClasses.tooltip}`]: {
                                        maxWidth: '236px',
                                        padding: '6px 10px'
                                    }
                                }} title={t('--representsCountryWhereCompanyRegistered--')}><HelpCircle size={16} color='var(--warm-neutral-shade-400)'></HelpCircle></OroTooltip>:
                                <span className={styles.companyInfoFormPopupContentsHeaderProgressInfoCountryName}>{mapAlpha2codeToDisplayName(jurisdictionCountryCode)}</span>
                            </div>
                            {props.formData?.newSupplierSelected && <div className={styles.companyInfoFormPopupContentsHeaderProgressInfoEdit} onClick={onJurisdictionCountryCodeEdit}>
                                <Trans t={t} i18nKey="--edit--">
                                    <Edit3 size={16} color='var(--warm-prime-azure)'></Edit3>Edit
                                </Trans>
                            </div>}
                        </div>
                    </div>
                </div>
                {jurisdictionCountryCode && <>
                    {((props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0) ||
                        (props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0) || foreignTaxClassification ||
                        (props.formData?.additionalDocsList && props.formData?.additionalDocsList?.length > 0)) &&
                        <div className={styles.attachments}>
                            <div className={styles.attachmentsBoxes}>
                                {((props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0) ||
                                    (props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0)) &&
                                    <div className={styles.attachmentsBox} id='taxFormKey-field'>
                                        {jurisdictionCountryCode && <div className={styles.attachmentsBoxTitle}>{t('--taxDocument--', { countryName: mapAlpha2codeToDisplayName(jurisdictionCountryCode) })}</div>}
                                        {props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0 && !isFieldDisabled('taxForm') && <TaxFormFileUploader
                                            taxFormKey={taxFormKey}
                                            taxFormKeys={props.formData?.taxForm?.taxFormKeysList}
                                            taxForm={taxForm}
                                            onTaxFormKeyChanged={setTaxFormKey}
                                            taxFormKeysList={props.taxFormKeys}
                                            taxKeysList={props.taxKeys}
                                            inputFileAcceptTypes={`${imageFileAcceptType},${pdfFileAcceptType}`}
                                            disabled={isFieldDisabled('taxForm')}
                                            required={isFieldRequired('taxForm')}
                                            forceValidate={forceValidate}
                                            onOcredFilePreview={() => loadFileOcerdFiles('taxForm.taxForm', taxForm)}
                                            onTaxFormChange={(file) => handleFileChange('taxForm', file, taxForm)}
                                            validator={(value) => validateField('taxForm', `${getTaxFormNameForKey(taxFormKey, props.taxFormKeys || []) || t('Tax Form')}`, (value?.name || value?.filename || ''))}
                                        />}
                                        {props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0 && !isFieldDisabled('indirectTaxForm') && <TaxFormFileUploader
                                            taxFormKey={indirectTaxFormKey}
                                            taxFormKeys={props.formData?.indirectTaxForm?.taxFormKeysList}
                                            taxForm={indirectTaxForm}
                                            onTaxFormKeyChanged={setIndirectTaxFormKey}
                                            taxFormKeysList={props.taxFormKeys}
                                            taxKeysList={props.taxKeys}
                                            inputFileAcceptTypes={`${imageFileAcceptType},${pdfFileAcceptType}`}
                                            disabled={isFieldDisabled('indirectTaxForm')}
                                            required={isFieldRequired('indirectTaxForm')}
                                            forceValidate={forceValidate}
                                            validator={(value) => validateField('indirectTaxForm', `${getTaxFormNameForKey(indirectTaxFormKey, props.taxFormKeys || []) || t('--indirectTaxForm--')}`, (value?.name || value?.filename || ''))}
                                            onTaxFormChange={(file) => handleFileChange('indirectTaxForm', file, indirectTaxForm)}
                                            onOcredFilePreview={() => loadFileOcerdFiles('indirectTaxForm.taxForm', indirectTaxForm)}
                                        />}
                                    </div>}
                                {props.formData?.additionalDocsList && props.formData?.additionalDocsList?.length > 0 && <div className={styles.attachmentsBox}>
                                    <div className={styles.attachmentsBoxTitle}>
                                        {t('--doingBusiness--', { countryName: "India" })}
                                    </div>
                                    {
                                        props.formData?.additionalDocsList.map((item, index) => {
                                            return (
                                                <TaxFormFileUploader
                                                    key={index}
                                                    taxFormKey={item}
                                                    taxFormKeys={[item]}
                                                    taxForm={getAdditionalTaxFormForKey(item)}
                                                    isAdditionalDocs
                                                    taxFormKeysList={props.taxFormKeys}
                                                    taxKeysList={props.taxKeys}
                                                    inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                                                    required={false}
                                                    forceValidate={false}
                                                    onOcredFilePreview={() => loadFileOcerdFiles(`additionalDocuments[${findAdditionalDocIndexForPriview(item)}].taxForm`, (getAdditionalTaxFormForKey(item) as Attachment))}
                                                    onTaxFormChange={(file) => handleAdditionalDocChange(item, file, getAdditionalTaxFormForKey(item) as Attachment)}
                                                />
                                            )
                                        })
                                    }
                                </div>}
                                {foreignTaxClassification && !isFieldDisabled('usTaxDeclarationFormKey') && <div className={styles.attachmentsBox} id='usTaxDeclarationForm-field'>
                                    <div className={styles.attachmentsBoxTitle}>{t('--doingBusiness--', { countryName: "United States" })}</div>
                                    <TaxFormFileUploader
                                        taxFormKey={usTaxDeclarationFormKey}
                                        taxFormKeys={[]}
                                        foreignTaxClassification={foreignTaxClassification}
                                        isUsTaxDeclarationFormKey
                                        usForeignTaxClassificationOptions={usForeignTaxClassificationOptions || []}
                                        taxForm={usTaxDeclarationForm}
                                        onTaxFormKeyChanged={setIndirectTaxFormKey}
                                        taxFormKeysList={props.taxFormKeys}
                                        taxKeysList={props.taxKeys}
                                        inputFileAcceptTypes={`${imageFileAcceptType},${pdfFileAcceptType}`}
                                        disabled={isFieldDisabled('usTaxDeclarationFormKey')}
                                        required={isFieldRequired('usTaxDeclarationFormKey')}
                                        forceValidate={forceValidate}
                                        validator={(value) => validateField('usTaxDeclarationFormKey', `${getTaxFormNameForKey(usTaxDeclarationFormKey, props.taxFormKeys || []) || t('--usTaxDeclarationForm--')}`, (value?.name || value?.filename || ''))}
                                        onTaxFormChange={(file) => handleFileChange('usTaxDeclarationForm', file, usTaxDeclarationForm)}
                                        onOcredFilePreview={() => loadFileOcerdFiles('usTaxDeclarationForm', usTaxDeclarationForm)}
                                        onUsForeignTaxClassificationChanged={value => { setForeignTaxClassification(value); handleFieldValueChange('foreignTaxClassification', foreignTaxClassification, value) }}
                                    />
                                </div>}
                            </div>
                        </div>}

                    {!isFieldDisabled('legalName') && <div className={styles.row}>
                        <div className={classnames(styles.item, styles.col4)} id="legal-name-field">
                            <TextBox
                                label={getFieldLabelFromConfig('Legal Company Name') || t("Legal Company Name")}
                                value={legalName}
                                infoText={t('--asShownInTaxForm--') || ''}
                                disabled={isFieldDisabled('legalName')}
                                required={isFieldRequired('legalName')}
                                forceValidate={forceValidate}
                                validator={(value) => validateField('legalName', t('Legal Company Name'), value)}
                                onChange={value => { setLegalName(value); handleFieldValueChange('legalName', legalName, value) }}
                            />
                            {getOcredLegalName() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span> {t('--extractedValueShows--')} <strong>&#39;{getOcredLegalName()}&#39;</strong></div>}
                        </div>
                    </div>}
                    {!isFieldDisabled('taxAddress') && <div className={styles.row}>
                        <div className={classnames(styles.item, styles.col4)} id="tax-address-field">
                            <GoogleMultilinePlaceSearch
                                id="taxAddress"
                                label={getFieldLabelFromConfig('taxAddress') || t("Address")}
                                value={taxAddress}
                                excludeAddressSuggestion={props.excludeAddressSuggestion}
                                countryOptions={props.countryOptions}
                                required={isFieldRequired('taxAddress')}
                                disabled={isFieldDisabled('taxAddress')}
                                infoText={t('--asShownInTaxForm--') || ''}
                                forceValidate={forceValidate}
                                absolutePosition
                                warning={taxAddress?.alpha2CountryCode && jurisdictionCountryCode !== taxAddress?.alpha2CountryCode}
                                validator={(value) => validateAddressField('taxAddress', t('Address'), value)}
                                onChange={(value) => { setTaxAddress(value); handleFieldValueChange('taxAddress', taxAddress, value) }}
                                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                            />
                            {getOcredAddress() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>&#39;{getOcredAddress()}&#39;</strong></div>}
                        </div>
                    </div>}
                    {usCompanyEntityTypeOptions?.length > 0 && props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && jurisdictionCountryCode === US_COUNTRY_CODE && !isFieldDisabled('usCompanyEntityType') &&
                        <div className={styles.row}>
                            <div className={classnames(styles.item, styles.col4)} id="usCompanyEntityType-field">
                                <TypeAhead
                                    label={getFieldLabelFromConfig('usCompanyEntityType') || t("Business entity type")}
                                    placeholder={getI18Text("Choose") || ''}
                                    type={OptionTreeData.entity}
                                    value={usCompanyEntityType || undefined}
                                    options={usCompanyEntityTypeOptions}
                                    showTree={true}
                                    disabled={isFieldDisabled('usCompanyEntityType')}
                                    required={isFieldRequired('usCompanyEntityType')}
                                    forceValidate={forceValidate}
                                    expandLeft={props.isInPortal}
                                    fetchChildren={(parent, childrenLevel) => fetchChildren('USCompanyEntityType', parent, childrenLevel)}
                                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'USCompanyEntityType')}
                                    validator={(value) => props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && isEmpty(value) ? t('Business entity type is a required field.') : ''}
                                    onChange={value => { setUsCompanyEntityType(value); handleFieldValueChange('usCompanyEntityType', usCompanyEntityType!, value) }}
                                />
                                {getOcredBusinessEntity() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>&#39;{getOcredBusinessEntity()}&#39;</strong></div>}
                            </div>
                        </div>}
                    {props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 1 && !isFieldDisabled('tax') && <div className={styles.row}>
                        <div className={classnames(styles.item, styles.col4)} id="taxKey-field">
                            <TypeAhead
                                label={getFieldLabelFromConfig('tax') || t("Tax ID type")}
                                placeholder={t("Choose tax ID type") || ''}
                                value={convertTaxKeyToOption(taxKey) || undefined}
                                options={getTaxKeysList()}
                                disabled={isFieldDisabled('tax') || (!props.formData?.newSupplierSelected && !!taxKey)}
                                required={isFieldRequired('tax')}
                                forceValidate={forceValidate}
                                validator={(value) => validateField('tax', t('Tax ID type'), value)}
                                onChange={value => { setTaxKey(getTaxKeyFromOption(value) as string); value?.id !== taxKey && setEncryptedTaxCode(emptyEcncryptedData); handleFieldValueChange('taxKey', taxKey, value?.path || '') }}
                            />
                        </div>
                    </div>}
                    {taxKey && !isFieldDisabled('tax') && <div className={styles.row}>
                        <div className={classnames(styles.item, styles.col4)} id="taxCode-field">
                            <EncryptedDataBox
                                label={getFieldLabelFromConfig('tax') || getTaxKeyNameForKey(taxKey, props.taxKeys || [])}
                                value={encryptedTaxCode}
                                description={getTaxKeyDescriptionForKey(taxKey, props.taxKeys || [])}
                                disabled={isFieldDisabled('tax') || (!props.formData?.newSupplierSelected && (!!props.formData?.tax?.encryptedTaxCode?.maskedValue || !!props.formData?.tax?.encryptedTaxCode?.version))}
                                required={isFieldRequired('tax')}
                                placeholder='value'
                                forceValidate={forceValidate || taxCodeFormatError}
                                warning={taxCodeFormatError}
                                validator={taxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('tax', getTaxKeyNameForKey(taxKey, props.taxKeys || []), value)}
                                onBlur={value => handleValidateTinFormat(taxKey, value, 'encryptedTaxCode')}
                                onChange={value => { setEncryptedTaxCode(value); handleFieldValueChange('encryptedTaxCode', encryptedTaxCode, value); setTaxCodeFormatError(false) }}
                            />
                            {getOcredTaxKeyValue() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>&#39;{getOcredTaxKeyValue()}&#39;</strong></div>}
                        </div>
                    </div>}
                    {props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 1 && !isFieldDisabled('indirectTax') && <div className={styles.row} >
                        <div className={classnames(styles.item, styles.col4)} id="indirectTaxKey-field">
                            <TypeAhead
                                label={getFieldLabelFromConfig('indirectTax') || t("Indirect tax ID type")}
                                placeholder={t("Choose indirect tax ID type") || ''}
                                value={convertTaxKeyToOption(indirectTaxKey) || undefined}
                                options={getIndirectTaxKeysList()}
                                disabled={isFieldDisabled('indirectTax') || (!props.formData?.newSupplierSelected && !!indirectTaxKey)}
                                required={isFieldRequired('indirectTax')}
                                forceValidate={forceValidate}
                                validator={(value) => validateField('indirectTax', t('Indirect tax ID type'), value)}
                                onChange={value => { setIndirectTaxKey(getTaxKeyFromOption(value) as string); value?.id !== indirectTaxKey && setEncryptedIndirectTaxCode(emptyEcncryptedData); handleFieldValueChange('indirectTaxKey', indirectTaxKey, value?.path || '') }}
                            />
                        </div>
                    </div>}
                    {indirectTaxKey && !isFieldDisabled('indirectTax') && <div className={styles.row} >
                        <div className={classnames(styles.item, styles.col4)} id="encryptedIndirectTaxCode-field">
                            <EncryptedDataBox
                                label={getFieldLabelFromConfig('indirectTax') || getTaxKeyNameForKey(indirectTaxKey, props.taxKeys || [])}
                                value={encryptedIndirectTaxCode}
                                description={getTaxKeyDescriptionForKey(indirectTaxKey, props.taxKeys || []) || ''}
                                disabled={isFieldDisabled('indirectTax') || (!props.formData?.newSupplierSelected && (!!props.formData?.indirectTax?.encryptedTaxCode?.maskedValue || !!props.formData?.indirectTax?.encryptedTaxCode?.version))}
                                required={isFieldRequired('indirectTax')}
                                placeholder='value'
                                forceValidate={forceValidate || indirectTaxCodeFormatError}
                                warning={indirectTaxCodeFormatError}
                                validator={indirectTaxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('indirectTax', getTaxKeyNameForKey(indirectTaxKey, props.taxKeys || []), value)}
                                onBlur={value => handleValidateTinFormat(indirectTaxKey, value, 'encryptedIndirectTaxCode')}
                                onChange={value => { setEncryptedIndirectTaxCode(value); handleFieldValueChange('encryptedIndirectTaxCode', encryptedIndirectTaxCode, value); setIndirectTaxCodeFormatError(false) }}
                            />
                        </div>
                    </div>}
                </>}
            </div>
            {jurisdictionCountryCode && <div className={styles.section}>
                {props.formData?.tax1099Required && !isFieldDisabled('tax1099') &&
                    <div className={styles.row}>
                        <div className={classnames(styles.item, styles.col4)} id="tax1099-field">
                            <Radio
                                name='tax1099'
                                id='tax1099'
                                label={t("Are you eligible for 1099?") || ''}
                                value={tax1099 || undefined}
                                options={tax1099Options}
                                showHorizontal
                                disabled={isFieldDisabled('tax1099')}
                                required={isFieldRequired('tax1099')}
                                forceValidate={forceValidate}
                                validator={(value) => isEmpty(value) ? t('1099 is a required field') : ''}
                                onChange={value => { setTax1099(value); handleFieldValueChange('tax1099', tax1099!, value) }}
                            />
                        </div>
                    </div>}
                {!isFieldDisabled('specialTaxStatus') && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="specialTaxStatus-field">
                        <Radio
                            name='legalTax'
                            id='legalTax'
                            label={getFieldLabelFromConfig('specialTaxStatus') || t("Legal tax status or exemption?")}
                            value={specialTaxStatus !== undefined && specialTaxStatus !== null ? specialTaxStatus ? tax1099Options[0] : tax1099Options[1] : undefined}
                            options={tax1099Options}
                            showHorizontal
                            disabled={isFieldDisabled('specialTaxStatus')}
                            required={isFieldRequired('specialTaxStatus')}
                            forceValidate={forceValidate}
                            validator={(value) => isEmpty(value) ? t('Legal tax status or exemption?') : ''}
                            onChange={value => { setSpecialTaxStatus(value?.path === 'yes' ? true : false); handleFieldValueChange('specialTaxStatus', specialTaxStatus, value?.path === 'yes' ? true : false) }}
                        />
                    </div>
                </div>}
                {specialTaxStatus && !isFieldDisabled('specialTaxNote') &&
                    <div className={styles.row}>
                        <div className={classnames(styles.item, styles.col4)} id="specialTaxNote-field">
                            <TextArea
                                label={getFieldLabelFromConfig('specialTaxNote') || t("Note")}
                                value={specialTaxNote}
                                disabled={isFieldDisabled('specialTaxNote')}
                                required={isFieldRequired('specialTaxNote')}
                                forceValidate={forceValidate}
                                validator={(value) => specialTaxStatus && isFieldRequired('specialTaxNote') && isEmpty(value) ? t('Special tax status details is a required field') : ''}
                                onChange={value => { setSpecialTaxNote(value); handleFieldValueChange('specialTaxNote', specialTaxNote, value) }}
                            />
                        </div>
                    </div>}
                {specialTaxStatus &&
                    <div className={styles.specialTaxAttachment} id="specialTaxAttachment-field">
                        <div className={styles.specialTaxAttachmentLabel}>{t('--specialTaxAttach--')}</div>
                        <AttachmentsControlNew
                            value={specialTaxAttachments}
                            disabled={false}
                            onChange={(value?: File[] | Attachment[], file?: Attachment | File, fileName?: string, attachmentToDelete?: Attachment) => handleSpecialAttachmentsFileChange(fileName || `specialTaxAttachments${[specialTaxAttachments.length]}`, file as File | undefined, value as Array<Attachment>, attachmentToDelete)}
                            config={{
                                forceValidate: forceValidate,
                                fieldName: 'specialTaxAttachments'
                            }}
                            dataFetchers={{
                                getDocumentByName: (fieldName: string, mediatype: string, fileName: string, attachment?: Attachment) => loadDocument(fieldName, attachment)
                            }}
                            validator={(value) => specialTaxStatus && (value as Array<Attachment>).length === 0 ? t('Special tax status file is a required field') : ''}
                        />
                    </div>
                }
            </div>}
        </div>
    )
}
