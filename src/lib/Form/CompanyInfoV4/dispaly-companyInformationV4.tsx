import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { AlertCircle, Edit3, Eye, EyeOff } from 'react-feather'
import { CompanyInfoV4FormData, Field, SupplierTaxFormKeyField, convertAddressToString, getFormFieldConfig, isDisabled } from '..'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { Attachment } from '../../Types'
import { Grid } from '@mui/material'
import { getEmptyAddress, getFormFieldsMap, getTaxFormNameForKey, getTaxKeyNameForKey, isAddressInvalid, isFieldDisabled, isFieldRequired, isOmitted } from '../util'
import { AttachmentReadOnly } from '../components/attachment-read-only.component'
import { OroButton } from '../../controls'
import { COMPANY_NAME, LEGAL_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, TAX_ADDRESS, FOREIGN_TAX, TAX, US_TAX_FORM, INDIRECT_TAX, ENCRYPTED_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY, ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, INSTRUCTION, FAX, US_COMPANY_ENTITY, MULTI_LANG, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099 } from './utils'
import { Trans } from 'react-i18next'
import { useMediaQueryHook } from '../../CustomHooks/custom-hooks'
import { mapAlpha2codeToDisplayName } from '../../util'

interface DispalyCompanyInfoFormV4Props {
    formData?: CompanyInfoV4FormData
    forceValidate?: boolean
    fields?: Field[]
    taxKeys?: any[]
    taxFormKeys?: any[]
    hideEdit?: boolean
    loadDocument?: (fieldName: string, attachment: Attachment) => Promise<Blob>
    onEdit?: () => void
}

const WANTED_FIELDS = [COMPANY_NAME, LEGAL_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, TAX_ADDRESS, FOREIGN_TAX, TAX,
    INDIRECT_TAX, ENCRYPTED_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY, US_TAX_FORM,
    ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, INSTRUCTION, FAX, US_COMPANY_ENTITY,
    MULTI_LANG, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099]

export function DispalyCompanyInfoFormV4(props: DispalyCompanyInfoFormV4Props) {
    const [isTaxCodeVisible, setIsTaxCodeVisible] = useState<boolean>(false)
    const screen = useMediaQueryHook()
    const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
    const [isIndirectTaxCodeVisible, setIsIndirectTaxCodeVisible] = useState<boolean>(false)
    const [additionalDocumets, setAdditionalDocumets] = useState<Array<SupplierTaxFormKeyField>>([])
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])
    const flexDirection = screen.isBigScreen ? 'row' : 'column'
    const gap = screen.isBigScreen ? '16px' : '4px'
    const labelColumn = screen.isBigScreen ? 4 : 12
    const valueColumn = screen.isBigScreen ? 7 : 12

    useEffect(() => {
        if (props.forceValidate) setForceValidate(props.forceValidate)
    }, [props.forceValidate])

    useEffect(() => {
        if (props.formData) {
            setAdditionalDocumets(props.formData?.additionalDocuments || [])
        }
    }, [props.formData])

    useEffect(() => {
        if (props.fields) {
            setFieldMap(getFormFieldsMap(props.fields, WANTED_FIELDS))
        }
    }, [props.fields])

    function loadFile(fieldName: string, attachment: Attachment): Promise<Blob> {
        if (props.loadDocument && fieldName) {
            return props.loadDocument(fieldName, attachment)
        } else {
            return Promise.reject()
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

    function getAdditionalTaxFormForKey(key: string): Attachment | File | undefined {
        const taxForm = props.formData?.additionalDocuments.find(item => item.taxFormKey === key)
        return taxForm?.taxForm || undefined
    }

    function findAdditionalDocIndexForPriview(item: string): number {
        const docIndex = additionalDocumets.findIndex(doc => doc.taxFormKey === item)
        return docIndex
    }

    function getFieldLabelFromConfig(fieldName: string): string {
        return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
    }

    function onEdit() {
        props.onEdit && props.onEdit()
    }

    function canShowOtherInformationSection(): boolean {
        return (!isFieldDisabled(ADDRESS) || !isFieldDisabled(WEBSITE) || !isFieldDisabled(DUNS) || !isFieldDisabled(EMAIL) || !isFieldDisabled(PHONE) || !isFieldDisabled(FAX))
    }

    return (
        <>
            <div className={styles.section}>
                <div className={classnames(styles.companyInfoFormDetails)}>
                    <div className={styles.companyInfoFormDetailsName}>
                        <div className={styles.companyInfoFormDetailsNameText}>
                            {props.formData?.companyName || props.formData?.legalName || '-'}
                            {props.formData?.tax?.encryptedTaxCode?.maskedValue && <div className={styles.companyInfoFormDetailsNameTextTax}>&#40;{props.formData?.tax?.encryptedTaxCode?.maskedValue}&#41;</div>}
                        </div>
                        {!props.hideEdit && <OroButton label='Edit' icon={<Edit3 size={18} color='var(--warm-neutral-shade-300)'></Edit3>} radiusCurvature='medium' onClick={onEdit}></OroButton>}
                    </div>
                    <div className={styles.companyInfoFormDetailsLegal}>
                        <div className={styles.companyInfoFormDetailsLegalHeader}>{t('--legalInformation--')}</div>
                        <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'}>
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel)}>{t("--jurisdictionCountry--")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>{props.formData?.jurisdictionCountryCode ? mapAlpha2codeToDisplayName(props.formData?.jurisdictionCountryCode) : '-'}</div>
                            </Grid>
                        </Grid>
                        {props.formData?.taxForm?.taxFormKey && !isFieldDisabled(TAX_FORM) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id='taxFormKey-field'>
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, TAX_FORM) && !props.formData?.taxForm?.taxForm })}>{getTaxFormNameForKey(props.formData?.taxForm?.taxFormKey || '', props.taxFormKeys || []) || t("Tax Form")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, TAX_FORM) && !props.formData?.taxForm?.taxForm ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <AttachmentReadOnly
                                                attachment={props.formData?.taxForm?.taxForm as Attachment}
                                                onPreview={() => loadFile('taxForm.taxForm', (props.formData?.taxForm?.taxForm as Attachment))}
                                            />
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.indirectTaxForm?.taxFormKey && !isFieldDisabled(INDIRECT_TAX_FORM) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'}>
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, INDIRECT_TAX_FORM) && !props.formData?.indirectTaxForm?.taxForm })}>{getTaxFormNameForKey(props.formData?.indirectTaxForm?.taxFormKey || '', props.taxFormKeys || []) || t("--indirectTaxForm--")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, INDIRECT_TAX_FORM) && !props.formData?.indirectTaxForm?.taxForm ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <AttachmentReadOnly
                                            attachment={props.formData?.indirectTaxForm?.taxForm as Attachment}
                                            onPreview={() => loadFile('indirectTaxForm.taxForm', (props.formData?.indirectTaxForm?.taxForm as Attachment))}
                                        />
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {(props.formData?.foreignTaxClassification || props.formData?.usTaxDeclarationFormKey) && !isFieldDisabled(US_TAX_FORM_KEY) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id='usTaxDeclarationForm-field'>
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, US_TAX_FORM_KEY) && !props.formData?.usTaxDeclarationForm })}>{getTaxFormNameForKey(props.formData?.usTaxDeclarationFormKey || '', props.taxFormKeys || []) || t("--usTaxDeclarationForm--")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, US_TAX_FORM_KEY) && !props.formData?.usTaxDeclarationForm ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <AttachmentReadOnly
                                            attachment={props.formData?.usTaxDeclarationForm as Attachment}
                                            onPreview={() => loadFile('usTaxDeclarationForm', (props.formData?.usTaxDeclarationForm as Attachment))}
                                        />
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.additionalDocsList && props.formData?.additionalDocsList.length > 0 &&
                            props.formData?.additionalDocsList.map((item, index) => {
                                return (
                                    <Grid container item xs={12} key={index} gap={gap} direction={flexDirection} alignItems={'flex-start'}>
                                        <Grid container item xs={labelColumn}>
                                            <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel)}>{getTaxFormNameForKey(item, props.taxFormKeys || []) || t("Tax Form")}</div>
                                        </Grid>
                                        <Grid container item xs={valueColumn}>
                                            <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                                <AttachmentReadOnly
                                                    attachment={getAdditionalTaxFormForKey(item) as Attachment}
                                                    onPreview={() => loadFile(`additionalDocuments[${findAdditionalDocIndexForPriview(item)}].taxForm`, (getAdditionalTaxFormForKey(item) as Attachment))}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        {!isFieldDisabled(LEGAL_NAME) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="legal-name-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, LEGAL_NAME) && !props.formData?.legalName })}>{getFieldLabelFromConfig(LEGAL_NAME) || t("Legal name")} &#40;{t('--asShownInTaxForm--')}&#41;</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, LEGAL_NAME) && !props.formData?.legalName ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>{props.formData?.legalName || '-'}</>

                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(TAX_ADDRESS) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="tax-address-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, TAX_ADDRESS) && !props.formData?.taxAddress })}>{getFieldLabelFromConfig(TAX_ADDRESS) || t("Address")} &#40;{t('--asShownInTaxForm--')}&#41;</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, TAX_ADDRESS) && !props.formData?.taxAddress ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>{convertAddressToString(props.formData?.taxAddress || getEmptyAddress()) || '-'}</>

                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.tax?.taxKey && !isFieldDisabled(TAX) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="taxKey-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, TAX) && !props.formData?.tax?.taxKey })}>{t("Tax ID type")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, TAX) && !props.formData?.tax?.taxKey ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>{getTaxKeyNameForKey(props.formData?.tax?.taxKey || '', props.taxKeys || []) || t("Tax Code")}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.tax?.taxKey && !isFieldDisabled(TAX) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="taxCode-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, TAX) && !props.formData?.tax?.encryptedTaxCode })}>{getTaxKeyNameForKey(props.formData?.tax?.taxKey || '', props.taxKeys || []) || t("Tax Code")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, TAX) && !props.formData?.tax?.encryptedTaxCode ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>
                                            {(props.formData?.tax?.encryptedTaxCode?.maskedValue || props.formData?.tax?.encryptedTaxCode?.unencryptedValue) &&
                                                (!isTaxCodeVisible ? props.formData?.tax?.encryptedTaxCode?.maskedValue || '*****' : props.formData?.tax?.encryptedTaxCode?.unencryptedValue)
                                            }
                                            {(!props.formData?.tax?.encryptedTaxCode?.maskedValue && !props.formData?.tax?.encryptedTaxCode?.unencryptedValue) &&
                                                <>-</>
                                            }
                                            {props.formData?.tax?.encryptedTaxCode?.unencryptedValue &&
                                                isTaxCodeVisible && <Eye className="showHide" size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => setIsTaxCodeVisible(false)} />
                                            }
                                            {props.formData?.tax?.encryptedTaxCode?.unencryptedValue &&
                                                !isTaxCodeVisible && <EyeOff className="showHide" size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => setIsTaxCodeVisible(true)} />
                                            }
                                        </>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.indirectTax?.taxKey && !isFieldDisabled(INDIRECT_TAX) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="indirectTaxKey-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, INDIRECT_TAX) && !props.formData?.indirectTax?.taxKey })}>{t("Indirect tax ID type")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, INDIRECT_TAX) && !props.formData?.indirectTax?.taxKey ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>{getTaxKeyNameForKey(props.formData?.indirectTax?.taxKey || '', props.taxKeys || []) || t("--indirectTaxCode--")}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.indirectTax?.taxKey && !isFieldDisabled(INDIRECT_TAX) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="encryptedIndirectTaxCode-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, INDIRECT_TAX) && !props.formData?.indirectTax?.encryptedTaxCode })}>{getTaxKeyNameForKey(props.formData?.indirectTax?.taxKey || '', props.taxKeys || []) || t("Tax Code")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, INDIRECT_TAX) && !props.formData?.indirectTax?.encryptedTaxCode ?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>
                                            {(props.formData?.indirectTax?.encryptedTaxCode?.maskedValue || props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                                                (!isIndirectTaxCodeVisible ? props.formData?.indirectTax?.encryptedTaxCode?.maskedValue || '*****' : props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue)
                                            }
                                            {(!props.formData?.indirectTax?.encryptedTaxCode?.maskedValue && !props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                                                <>-</>
                                            }
                                            {props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue &&
                                                isIndirectTaxCodeVisible && <Eye className="showHide" size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => setIsIndirectTaxCodeVisible(false)} />
                                            }
                                            {props.formData?.indirectTax?.encryptedTaxCode?.unencryptedValue &&
                                                !isIndirectTaxCodeVisible && <EyeOff className="showHide" size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => setIsIndirectTaxCodeVisible(true)} />
                                            }
                                        </>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.tax1099Required && !isFieldDisabled(TAX_1099) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="tax1099-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, TAX_1099) && (props.formData?.tax1099 === undefined || props.formData?.tax1099 === null) })}>{t("Are you eligible for 1099?")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {forceValidate && isFieldRequired(fieldMap, TAX_1099) && (props.formData?.tax1099 === undefined || props.formData?.tax1099 === null)?
                                        <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                            <Trans t={t} i18nKey="--requiredField--">
                                                <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                {"Required field"}
                                            </Trans>
                                        </div>
                                        : <>{props.formData?.tax1099 !== undefined && props.formData?.tax1099 !== null ? (props.formData?.tax1099 ? t("Yes") : t("No")) : '-'}</>}
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(SPECIAL_TAX_STATUS) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="specialTaxStatus-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, SPECIAL_TAX_STATUS) && props.formData?.specialTaxStatus === undefined })}>{t("Any legal tax status")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, SPECIAL_TAX_STATUS) && props.formData?.specialTaxStatus === undefined ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.specialTaxStatus ? t("Yes") : t("No")}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.specialTaxStatus && !isFieldDisabled(SPECIAL_TAX_STATUS) && !isFieldDisabled(SPECIAL_TAX_NOTE) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="specialTaxNote-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, SPECIAL_TAX_NOTE) && !props.formData?.specialTaxNote })}>{t("Note")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, SPECIAL_TAX_NOTE) && !props.formData?.specialTaxNote ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.specialTaxNote || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.specialTaxStatus && !isFieldDisabled(SPECIAL_TAX_STATUS) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="specialTaxAttachment-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: props.formData?.specialTaxStatus && props.formData?.specialTaxAttachments?.length === 0 })}>{t("--specialTaxAttach--")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        props.formData?.specialTaxStatus && props.formData?.specialTaxAttachments?.length === 0 ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>
                                                {
                                                    props.formData?.specialTaxAttachments.map((item, index) => {
                                                        return (
                                                            <AttachmentReadOnly
                                                                key={index}
                                                                attachment={item as Attachment}
                                                                onPreview={() => loadFile(`specialTaxAttachments[${index}]`, (item as Attachment))}
                                                            />
                                                        )
                                                    })
                                                }</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {props.formData?.usCompanyEntityType && !isFieldDisabled(US_COMPANY_ENTITY) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="usCompanyEntityType-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, US_COMPANY_ENTITY) && !props.formData?.usCompanyEntityType?.id })}>{getFieldLabelFromConfig(US_COMPANY_ENTITY) || t("Business entity type")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, US_COMPANY_ENTITY) && !props.formData?.usCompanyEntityType?.id ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.usCompanyEntityType?.name || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                    </div>
                    {canShowOtherInformationSection() && <div className={styles.companyInfoFormDetailsLegalSeparator}></div>}
                    {canShowOtherInformationSection() && <div className={styles.companyInfoFormDetailsLegal}>
                        <div className={styles.companyInfoFormDetailsLegalHeader}>{t('--otherInformation--')}</div>
                        {!isFieldDisabled(COMPANY_NAME) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="company-name-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, COMPANY_NAME) && !props.formData?.companyName })}>{getFieldLabelFromConfig(COMPANY_NAME) || t("Company Name")} &#40;{t('--alsoKnownAs--')}&#41;</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, COMPANY_NAME) && !props.formData?.companyName ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.companyName || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(ADDRESS) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="address-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, ADDRESS) && !props.formData?.address })}>{getFieldLabelFromConfig(ADDRESS) || t("--hqAddress--")} {isFieldRequired(fieldMap, ADDRESS) ? '' : <>&#40;{t('--ifDifferentFromLegalAddress--')}&#41;</>}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, ADDRESS) && !props.formData?.address ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{convertAddressToString(props.formData?.address || getEmptyAddress()) || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(WEBSITE) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="website-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, WEBSITE) && !props.formData?.website })}>{getFieldLabelFromConfig(WEBSITE) || t("Website")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, WEBSITE) && !props.formData?.website ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.website || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(EMAIL) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="email-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, EMAIL) && !props.formData?.email })}>{getFieldLabelFromConfig(EMAIL) || t("Email")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, EMAIL) && !props.formData?.email ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.email || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(PHONE) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="phone-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, PHONE) && !props.formData?.phone })}>{getFieldLabelFromConfig(PHONE) || t("Phone number")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, PHONE) && !props.formData?.phone ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.phone || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(FAX) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="fax-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, FAX) && !props.formData?.fax })}>{getFieldLabelFromConfig(FAX) || t("--faxNumber--")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, FAX) && !props.formData?.fax ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.fax || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                        {!isFieldDisabled(DUNS) && <Grid container item xs={12} gap={gap} direction={flexDirection} alignItems={'flex-start'} id="duns-field">
                            <Grid container item xs={labelColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoLabel, { [styles.companyInfoFormDetailsLegalInfoLabelError]: forceValidate && isFieldRequired(fieldMap, DUNS) && !props.formData?.duns })}>{getFieldLabelFromConfig(DUNS) || t("DUNS number")}</div>
                            </Grid>
                            <Grid container item xs={valueColumn}>
                                <div className={classnames(styles.companyInfoFormDetailsLegalInfoValue)}>
                                    {
                                        forceValidate && isFieldRequired(fieldMap, DUNS) && !props.formData?.duns ?
                                            <div className={styles.companyInfoFormDetailsLegalInfoValuError}>
                                                <Trans t={t} i18nKey="--requiredField--">
                                                    <AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle>
                                                    {"Required field"}
                                                </Trans>
                                            </div>
                                            : <>{props.formData?.duns || '-'}</>
                                    }
                                </div>
                            </Grid>
                        </Grid>}
                    </div>}
                </div>
            </div>
        </>
    )
}
