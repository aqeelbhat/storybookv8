import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { debounce } from '@mui/material'
import { CompanyInfoV4FormData, CompanyInfoV4FormProps, Field, MultiLingualAddress, getFormFieldConfig, isDisabled, isRequired, validateEmail } from '..'
import { areArraysSame, areObjectsSame, getEmptyAddress, getFormFieldsMap, isAddressInvalid, isEmpty, isOmitted, validateDUNSNumber, validatePhoneNumber } from '../util'
import { Address, Attachment, Contact, EncryptedData } from '../../Types'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { GoogleMultilinePlaceSearch } from '../../GooglePlaceSearch'
import { TextBox, OROWebsiteInput, OROEmailInput, OROPhoneInput, Option } from '../../Inputs'
import { COMPANY_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, FAX, formDataWithUpdatedValue } from './utils'

const WANTED_FIELDS = [COMPANY_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, FAX]

interface OtherCompanyInfoFormV4Props extends CompanyInfoV4FormProps {
    excludeAddressSuggestion?: boolean
}

export function OtherCompanyInfoFormV4(props: OtherCompanyInfoFormV4Props) {
    const [companyName, setCompanyName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [duns, setDuns] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [address, setAddress] = useState<Address>(getEmptyAddress())
    const [primaryName, setPrimaryName] = useState<string>('')
    const [primaryEmail, setPrimaryEmail] = useState<string>('')
    const [paymentContactEmail, setPaymentContactEmail] = useState<string>('')
    const [fax, setFax] = useState('')
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>()
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [nameMismatch, setNameMismatch] = useState<{ mismatch: boolean, name: string }>({ mismatch: false, name: '' })
    const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])

    useEffect(() => {
        setNameMismatch(props?.nameMismatch)
    }, [props?.nameMismatch?.mismatch])

    useEffect(() => {
        if (props.formData) {
            setCompanyName(props.formData?.companyName)
            setWebsite(props.formData?.website)
            setDuns(props.formData?.duns)
            setFax(props.formData?.fax)
            setEmail(props.formData?.email)
            setPhone(props.formData?.phone)
            setAddress(props.formData?.address || getEmptyAddress())
            setPrimaryName(props.formData?.primary?.fullName || '')
            setPrimaryEmail(props.formData?.primary?.email || '')
            setPaymentContactEmail(props.formData?.paymentContactEmail)
        }
    }, [props.formData])

    useEffect(() => {
        if (props.fields) {
          setFieldMap(getFormFieldsMap(props.fields, WANTED_FIELDS))
        }
    }, [props.fields])

    function getFormData(): CompanyInfoV4FormData {
        return {
            companyName,
            legalName: props.formData?.legalName || '',
            jurisdictionCountryCode: props.formData?.jurisdictionCountryCode || '',
            useCompanyName: false,
            website,
            duns,
            email,
            phone,
            address,
            formApplicableForExtension: props.formData?.formApplicableForExtension,
            newSupplierSelected: props.formData?.newSupplierSelected,
            usTaxDeclarationFormOcrInfo: props.formData?.usTaxDeclarationFormOcrInfo,
            companyEntities: props.formData?.companyEntities,
            showExistingOrExtensionSelection: props.formData?.showExistingOrExtensionSelection,
            taxAddress: props.formData?.taxAddress || null,
            useCompanyAddress: false,
            primary: { fullName: primaryName, email: primaryEmail, role: props.formData?.primary?.role || '', phone: props.formData?.primary?.phone || '' },
            paymentContactEmail,
            companyEntityCountryCodes: props.formData?.companyEntityCountryCodes || [],
            usCompanyEntityType: props.formData?.usCompanyEntityType || null,
            indirectTax: {
                encryptedTaxCode: props.formData?.indirectTax?.encryptedTaxCode || null,
                taxCodeError: props.formData?.indirectTax?.taxCodeError || false,
                taxCodeValidationTimeout: props.formData?.indirectTax?.taxCodeValidationTimeout || false,
                taxKey: props.formData?.indirectTax?.taxKey || '',
                taxKeysList: props.formData?.indirectTax?.taxKeysList || [],
            },
            tax: {
                encryptedTaxCode: props.formData?.tax?.encryptedTaxCode || null,
                taxCodeError: props.formData?.tax?.taxCodeError || false,
                taxCodeValidationTimeout: props.formData?.tax?.taxCodeValidationTimeout || false,
                taxKey: props.formData?.tax?.taxKey || '',
                taxKeysList: props.formData?.tax?.taxKeysList || [],
            },
            taxForm: {
                taxFormKey: props.formData?.taxForm?.taxFormKey || '',
                taxForm: props.formData?.taxForm?.taxForm || null,
                taxFormKeysList: props.formData?.taxForm?.taxFormKeysList || [],
                ocrInfo: props.formData?.taxForm?.ocrInfo || undefined
            },
            indirectTaxForm: {
                taxFormKey: props.formData?.indirectTaxForm?.taxFormKey || '',
                taxForm: props.formData?.indirectTaxForm?.taxForm || null,
                taxFormKeysList: props.formData?.indirectTaxForm?.taxFormKeysList || [],
                ocrInfo: props.formData?.indirectTaxForm?.ocrInfo || undefined
            },
            foreignTaxClassification: props.formData?.foreignTaxClassification || null,
            specialTaxStatus: props.formData?.specialTaxStatus || false,
            specialTaxNote: props.formData?.specialTaxNote || '',
            specialTaxAttachments: props.formData?.specialTaxAttachments || [],
            usTaxDeclarationFormKey: props.formData?.usTaxDeclarationFormKey || '',
            usTaxDeclarationForm: props.formData?.usTaxDeclarationForm || null,
            tax1099Required: props.formData?.tax1099Required || false,
            tax1099: props.formData?.tax1099,
            instruction: props.formData?.instruction || '',
            fax,
            additionalDocsList: props.formData?.additionalDocsList || [],
            additionalDocuments: props.formData?.additionalDocuments || [],
            multiLingualAddresses: props.formData?.multiLingualAddresses || []
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
        if (fieldMap) {
            const field = fieldMap[fieldName]
            if (isRequired(field)) {
                if (!value) {
                    return t("is required field", { label })
                } else if (isAddressInvalid(value)) {
                    return t("is invalid", { label })
                } else {
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
                    case COMPANY_NAME:
                        invalidFieldId = 'company-name-field'
                        return !companyName
                    case WEBSITE:
                        invalidFieldId = 'website-field'
                        return !website
                    case DUNS:
                        invalidFieldId = 'duns-field'
                        return !duns
                    case EMAIL:
                        invalidFieldId = 'email-field'
                        return !email
                    case PHONE:
                        invalidFieldId = 'phone-field'
                        return !phone
                    case ADDRESS:
                        invalidFieldId = 'address-field'
                        return isAddressInvalid(address)
                    case FAX:
                        invalidFieldId = 'fax-field'
                        return !props.formData?.fax
                }
            }
        })

        if (!isInvalid) {
            if (duns) {
                invalidFieldId = duns && !!validateDUNSNumber('Duns', duns, true) ? 'duns-field' : ''
                isInvalid = invalidFieldId ? true : false
            }
            if (email) {
                invalidFieldId = validateEmail('Email', email, true) ? 'email-field' : ''
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
                input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
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
        props.fields,
        props.formData,
        companyName, website, duns, email, phone, address, primaryName, primaryEmail, paymentContactEmail
    ])

    function onPlaceSelectParseAddress(place: any): Promise<Address> {
        if (props.onPlaceSelectParseAddress) {
            return props.onPlaceSelectParseAddress(place)
        } else {
            return Promise.reject()
        }
    }

    function canShowOtherInformationSection(): boolean {
        return (!isFieldDisabled(ADDRESS) || !isFieldDisabled(WEBSITE) || !isFieldDisabled(DUNS) || !isFieldDisabled(EMAIL) || !isFieldDisabled(PHONE) || !isFieldDisabled(FAX))
    }

    function getFieldLabelFromConfig(fieldName: string): string {
        return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
    }


    return (
        <div className={styles.companyInfoFormPopupContentsContainer}>
            {canShowOtherInformationSection() && <div className={styles.section}>
                {/* <div className={styles.title}>{t('--otherInformation--')}</div> */}
                <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="company-name-field">
                        <TextBox
                            label={getFieldLabelFromConfig('companyName') || t("Company Name")}
                            value={companyName}
                            infoText={t('--alsoKnownAs--')}
                            // disabled={isFieldDisabled('companyName')}
                            required
                            warning={nameMismatch?.mismatch}
                            forceValidate={forceValidate || nameMismatch?.mismatch}
                            validator={nameMismatch?.mismatch ? () => t('Does not match with the Tax ID name.') : (value) => validateField('companyName', getFieldLabelFromConfig('companyName') || t('Company Name'), value)}
                            onChange={value => { setCompanyName(value); handleFieldValueChange('companyName', companyName, value); setNameMismatch({ mismatch: false, name: '' }) }}
                        />
                    </div>
                </div>
                {!isFieldDisabled('address') && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="address-field">
                        <GoogleMultilinePlaceSearch
                            id="address"
                            label={getFieldLabelFromConfig('address') || t("--hqAddress--")}
                            value={address}
                            excludeAddressSuggestion={props.excludeAddressSuggestion}
                            disabled={isFieldDisabled('address')}
                            infoText={isFieldRequired('address') ? '' : t('--ifDifferentFromLegalAddress--')}
                            countryOptions={props.countryOptions}
                            required={isFieldRequired('address')}
                            forceValidate={forceValidate}
                            validator={(value) => validateAddressField('address', getFieldLabelFromConfig('address') || t('--hqAddress--'), value)}
                            onChange={(value, countryChanged) => { setAddress(value); handleFieldValueChange('address', address, value) }}
                            parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                        />
                    </div>
                </div>}
                {!isFieldDisabled('website') && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="website-field">
                        <OROWebsiteInput
                            label={getFieldLabelFromConfig('website') || t("Website")}
                            value={website}
                            disabled={isFieldDisabled('website')}
                            required={isFieldRequired('website')}
                            forceValidate={forceValidate}
                            validator={(value) => validateField('website', getFieldLabelFromConfig('website') || t("Website"), value)}
                            onChange={value => { setWebsite(value); handleFieldValueChange('website', website, value) }}
                        />
                    </div>
                </div>}
                {!isFieldDisabled('duns') && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="duns-field">
                        <TextBox
                            label={getFieldLabelFromConfig('duns') || t("DUNS Number")}
                            value={duns}
                            disabled={isFieldDisabled('duns')}
                            required={isFieldRequired('duns')}
                            forceValidate={forceValidate}
                            validator={(value) => validateDUNSNumber(getFieldLabelFromConfig('duns') || t("DUNS Number"), value, !isFieldRequired('duns'))}
                            onChange={value => { setDuns(value); handleFieldValueChange('duns', duns, value) }}
                        />
                    </div>
                </div>}
                {!isFieldDisabled('email') && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="email-field">
                        <OROEmailInput
                            label={getFieldLabelFromConfig('email') || t('Email')}
                            placeholder={t('Enter email address') || ''}
                            value={email}
                            disabled={isFieldDisabled('email')}
                            required={isFieldRequired('email')}
                            forceValidate={forceValidate}
                            validator={(value) => validateEmail(getFieldLabelFromConfig('email') || t('Email'), value, !isFieldRequired('email'))}
                            onChange={value => { setEmail(value); handleFieldValueChange('email', email, value) }}
                        />
                    </div>
                </div>}

                {(!isFieldDisabled('phone')) && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="phone-field">
                        <OROPhoneInput
                            label={getFieldLabelFromConfig('phone') || t("Phone number")}
                            placeholder="+1 ___-___-____"
                            value={phone}
                            disabled={isFieldDisabled('phone')}
                            required={isFieldRequired('phone')}
                            forceValidate={forceValidate}
                            optional={!isFieldRequired('phone')}
                            validator={(value) => validatePhoneNumber(value, getFieldLabelFromConfig('phone') || t("Phone number"), isFieldRequired('phone'))}
                            onChange={(value) => { setPhone(value); handleFieldValueChange('phone', phone, value) }}
                        />
                    </div>
                </div>}
                {!isFieldDisabled('fax') && <div className={styles.row}>
                    <div className={classnames(styles.item, styles.col4)} id="fax-field">
                        <TextBox
                            label={getFieldLabelFromConfig('fax') || t("--faxNumber--")}
                            value={fax}
                            disabled={isFieldDisabled('fax')}
                            required={isFieldRequired('fax')}
                            forceValidate={forceValidate}
                            onChange={value => { setFax(value); handleFieldValueChange('fax', fax, value) }}
                        />
                    </div>
                </div>}
            </div>}
            {!canShowOtherInformationSection() && <div className={styles.allDisabled}>{t("--allFieldsInThisSectionsAreDisabled--")}</div>}
        </div>
    )
}
