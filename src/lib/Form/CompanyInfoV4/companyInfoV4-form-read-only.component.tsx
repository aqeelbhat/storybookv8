import React, { useEffect, useState } from 'react'
import { CompanyInfoV4FormData, EnumsDataObject, Field, TaxType, TrackedAttributes } from '../types'
import { convertAddressToString, getFormFieldsMap, getOcredAddressUtil, getOcredBusinessEntityUtil, getOcredLegalNameUtil, getOcredTaxKeyValueUtil, getTaxFormNameForKey, getTaxKeyNameForKey, isFieldRequired, isOmitted, mapIDRefToOption } from '../util'
import { AlertCircle, Circle, Eye, EyeOff, Info } from 'react-feather'
import Tooltip from '@mui/material/Tooltip'
import '../oro-form-read-only.css'
import { Option } from '../../Inputs'
import { Attachment, AttachmentReadOnly, CustomFieldType, EncryptedData, getFormFieldConfig, isDisabled } from '../..'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { mapCustomFieldValue } from '../../CustomFormDefinition/View/ReadOnlyValues'
import ALPHA2CODES_DISPLAYNAMES from '../../util/alpha2codes-displaynames'
import { ADDRESS, COMPANY_NAME, DUNS, EMAIL, ENCRYPTED_EXEMPTION_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, ENCRYPTED_TAX_CODE, EXEMPTION_TAX_KEY, FAX, FOREIGN_TAX, INDIRECT_TAX, INDIRECT_TAX_FORM, INSTRUCTION, JURISDICTION_COUNTRY, LEGAL_NAME, MULTI_LANG, PHONE, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX, TAX_1099, TAX_ADDRESS, TAX_FORM, US_COMPANY_ENTITY, US_TAX_FORM, US_TAX_FORM_KEY, WEBSITE } from './utils'

const WANTED_FIELDS = [COMPANY_NAME, LEGAL_NAME, WEBSITE, DUNS, ADDRESS, EMAIL, PHONE, TAX_ADDRESS, FOREIGN_TAX, TAX,
  INDIRECT_TAX, ENCRYPTED_TAX_CODE, ENCRYPTED_INDIRECT_TAX_CODE, US_TAX_FORM_KEY, EXEMPTION_TAX_KEY, US_TAX_FORM,
  ENCRYPTED_EXEMPTION_TAX_CODE, TAX_FORM, INDIRECT_TAX_FORM, INSTRUCTION, FAX, US_COMPANY_ENTITY,
  MULTI_LANG, SPECIAL_TAX_NOTE, SPECIAL_TAX_STATUS, TAX_1099]

interface CompanyInfoV4FormReadOnlyProps {
  data: CompanyInfoV4FormData
  taxKeys?: EnumsDataObject[]
  taxFormKeys?: EnumsDataObject[]
  isSingleColumnLayout?: boolean
  isValidationSupported?: boolean
  trackedAttributes?: TrackedAttributes
  usCompanyEntityTypeOptions?: Option[]
  isOcrEnabled?: boolean
  onValidateTax?: (name: string, data: EncryptedData, countryCode: string, taxCode: string, tax: string) => void
  loadDocument?: (fieldName: string, type: string, fileName: string) => Promise<Blob>
  fields?: Field[]
}

export function CompanyInfoV4FormReadOnly(props: CompanyInfoV4FormReadOnlyProps) {
  const [isTaxCodeVisible, setIsTaxCodeVisible] = useState<boolean>(false)
  const [isIndirectTaxCodeVisible, setIsIndirectTaxCodeVisible] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMPANYINFOFORM)

  function loadFile(fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, WANTED_FIELDS))
    }
  }, [props.fields])

  function getVerificationTitle(taxCodeError: boolean, isTimeout: boolean): React.ReactNode {
    if (taxCodeError && !isTimeout) {
      return (
        <>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-chilli-regular)' color='var(--warm-stat-chilli-regular)' />{t("Tax ID is unregistered")}</div>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-mint-mid)' color='var(--warm-stat-mint-mid)' />{t("Confirmed by the supplier as valid")}</div>
        </>
      )
    } else if (taxCodeError && isTimeout) {
      return (
        <>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-chilli-regular)' color='var(--warm-stat-chilli-regular)' />{t("Tax ID verification timed out")}</div>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-mint-mid)' color='var(--warm-stat-mint-mid)' />{t("Confirmed by the supplier as valid")}</div>
        </>
      )
    } else {
      return (
        <div className="sentence">{t("Tax ID is registered")}</div>
      )
    }
  }

  function handleTaxValidation(name: string, data: EncryptedData, countryCode: string, taxCode: string, tax: string) {
    if (props.onValidateTax && name && data && countryCode) {
      props.onValidateTax(name, data, countryCode, taxCode, tax)
    }
  }

  function getOcredAddress(): string {
    return getOcredAddressUtil(props.data, props.data?.taxAddress)
  }

  function getOcredBusinessEntity(): string {
    return getOcredBusinessEntityUtil(props.data, props.usCompanyEntityTypeOptions, mapIDRefToOption(props.data?.usCompanyEntityType))
  }

  function getOcredTaxKeyValue(): string {
    return getOcredTaxKeyValueUtil(props.data, props.data?.tax?.encryptedTaxCode)
  }

  function getOcredLegalName(): string {
    return getOcredLegalNameUtil(props.data, props.data?.legalName)
  }

  function getAdditionalTaxFormForKey(key: string): Attachment | File | undefined {
    const taxForm = props.data?.additionalDocuments.find(item => item.taxFormKey === key)
    return taxForm?.taxForm || undefined
  }

  function findAdditionalDocIndexForPriview(item: string): number {
    const docIndex = props.data?.additionalDocuments.findIndex(doc => doc.taxFormKey === item)
    return docIndex
  }

  function getFieldLabelFromConfig(fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
  }

  function isFieldDisabled(fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field) || isOmitted(field)
    } else {
      return false
    }
  }

  function canShowOtherInformationSection(): boolean {
    return (!isFieldDisabled(ADDRESS) || !isFieldDisabled(WEBSITE) || !isFieldDisabled(DUNS) || !isFieldDisabled(EMAIL) || !isFieldDisabled(PHONE) || !isFieldDisabled(FAX))
  }

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <div className="sectionTitle">{t("--legalInformation--")}</div>
      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("--jurisdictionCountry--")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.jurisdictionCountryCode ? ALPHA2CODES_DISPLAYNAMES[props.data?.jurisdictionCountryCode] : '-', fieldName: JURISDICTION_COUNTRY, trackedAttributes: {val: props.trackedAttributes?.diffs?.fieldDiffs?.jurisdictionCountryCode?.original ? ALPHA2CODES_DISPLAYNAMES[props.trackedAttributes?.diffs?.fieldDiffs?.jurisdictionCountryCode?.original] : ''}, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>
        {props.data?.tax?.taxKey && props.data?.taxForm?.taxForm && !isFieldDisabled(TAX_FORM) && <div className="keyValuePair">
          <div className="label">{getTaxFormNameForKey(props.data?.taxForm?.taxFormKey, props.taxFormKeys) || t("Tax Form")}</div>
          <div className="value">
            <AttachmentReadOnly
              attachment={props.data.taxForm.taxForm as Attachment}
              onPreview={() => loadFile('taxForm.taxForm', (props.data.taxForm.taxForm as Attachment)?.mediatype, (props.data?.taxForm?.taxForm as Attachment)?.filename)}
            />
          </div>
        </div>}
        {props.data?.indirectTax?.taxKey && props.data?.indirectTaxForm?.taxForm && !isFieldDisabled(INDIRECT_TAX_FORM) &&
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.indirectTaxForm?.taxFormKey, props.taxFormKeys) || getFieldLabelFromConfig(INDIRECT_TAX) || t("--indirectTaxForm--")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.indirectTaxForm?.taxForm as Attachment}
                onPreview={() => loadFile('indirectTaxForm.taxForm', (props.data?.indirectTaxForm?.taxForm as Attachment)?.mediatype, (props.data?.indirectTaxForm?.taxForm as Attachment)?.filename)}
              />
            </div>
          </div>}
        {props.data?.usTaxDeclarationFormKey && props.data?.usTaxDeclarationForm && !isFieldDisabled(US_TAX_FORM_KEY) &&
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.usTaxDeclarationFormKey, props.taxFormKeys) || t("--usTaxDeclarationForm--")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data?.usTaxDeclarationForm as Attachment}
                onPreview={() => loadFile('usTaxDeclarationForm', (props.data?.usTaxDeclarationForm as Attachment)?.mediatype, (props.data?.usTaxDeclarationForm as Attachment)?.filename)}
              />
            </div>
          </div>}
        {props.data?.additionalDocsList && props.data?.additionalDocsList.length > 0 &&
          props.data?.additionalDocsList.map((item, index) => {
            return (
              <div className="keyValuePair" key={index}>
                <div className="label">{getTaxFormNameForKey(item, props.taxFormKeys) || t("Tax Form")}</div>
                <div className="value">
                  <AttachmentReadOnly
                    attachment={getAdditionalTaxFormForKey(item) as Attachment}
                    onPreview={() => loadFile(`additionalDocuments[${findAdditionalDocIndexForPriview(item)}].taxForm`, (getAdditionalTaxFormForKey(item) as Attachment)?.mediatype, (getAdditionalTaxFormForKey(item) as Attachment)?.filename)}
                  />
                </div>
              </div>
            )
          })}
        {!isFieldDisabled(LEGAL_NAME) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(LEGAL_NAME) || t("Legal name")} &#40;{t('--asShownInTaxForm--')}&#41;</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.legalName, fieldName: LEGAL_NAME, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}
          </div>
        </div>}
        {getOcredLegalName() && !isFieldDisabled(LEGAL_NAME) && <div className="keyValuePair">
          <div className="label"></div>
          <div className="value">
            <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle> {t('--extractedFromTaxForm--')}: <strong>{getOcredLegalName()}</strong></div>
          </div>
        </div>}
        {!isFieldDisabled(TAX_ADDRESS) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(TAX_ADDRESS) || t("Address")} &#40;{t('--asShownInTaxForm--')}&#41;</div>
          <div className="value">{convertAddressToString(props.data?.taxAddress) || '-'}</div>
        </div>}
        {getOcredAddress() && !isFieldDisabled(TAX_ADDRESS) && <div className="keyValuePair">
          <div className="label"></div>
          <div className="value">
            <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle><div>{t('--extractedFromTaxForm--')}: <strong>{getOcredAddress()}</strong></div></div>
          </div>
        </div>}
        {props.data?.tax?.taxKey && !isFieldDisabled(TAX) &&
          <>
            <div className="keyValuePair">
              <div className="label">{getTaxKeyNameForKey(props.data?.tax?.taxKey, props.taxKeys) || t("Tax Code")}</div>
              <div className="value">
                {(props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                  (!isTaxCodeVisible ? props.data.tax?.encryptedTaxCode?.maskedValue || '*****' : props.data.tax?.encryptedTaxCode?.unencryptedValue)
                }
                {props.data.tax?.encryptedTaxCode?.unencryptedValue &&
                  isTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(false)} />
                }
                {props.data.tax?.encryptedTaxCode?.unencryptedValue &&
                  !isTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(true)} />
                }
                {
                  !(props.data.tax?.encryptedTaxCode?.maskedValue && props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                  <div>-</div>
                }
                {
                  props.isValidationSupported && !props.data?.tax?.taxCodeValidationTimeout && props.data?.tax?.taxCodeError && (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                  <div className="validation">
                    <Tooltip title={getVerificationTitle(props.data?.tax?.taxCodeError, props.data?.tax?.taxCodeValidationTimeout)} arrow placement='right'>
                      <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)' /> {t("Verification failed")}</div>
                    </Tooltip>
                  </div>
                }
                {
                  props.isValidationSupported && !props.data?.tax?.taxCodeValidationTimeout && !props.data?.tax?.taxCodeError && (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                  <div className="validation">
                    <Tooltip title={getVerificationTitle(props.data?.tax?.taxCodeError, props.data?.tax?.taxCodeValidationTimeout)} arrow placement='right'>
                      <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)' />{t("Verified")}</div>
                    </Tooltip>
                  </div>
                }
                {
                  props.isValidationSupported && props.data?.tax?.taxCodeValidationTimeout && (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                  <div className="validation">
                    <Tooltip title={getVerificationTitle(props.data?.tax?.taxCodeError, props.data?.tax?.taxCodeValidationTimeout)} arrow placement='right'>
                      <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)' />{t("Unverified")}</div>
                    </Tooltip>
                  </div>
                }
                {
                  props.isValidationSupported && props.data?.tax?.taxCodeValidationTimeout && props.data?.tax?.taxCodeError && (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                  <div className="reverify" onClick={() => handleTaxValidation(props.data?.companyName, props.data.tax?.encryptedTaxCode, props.data?.taxAddress?.alpha2CountryCode?.toLowerCase(), getTaxKeyNameForKey(props.data?.tax?.taxKey, props.taxKeys) || 'Tax code', TaxType.direct)}>{t("Reverify")}</div>
                }
              </div>
            </div>
            {getOcredTaxKeyValue() && <div className="keyValuePair">
              <div className="label"></div>
              <div className="value">
                <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle> {t('--extractedFromTaxForm--')}: <strong>{getOcredTaxKeyValue()}</strong></div>
              </div>
            </div>}
          </>}

        {props.data?.indirectTax?.taxKey && !isFieldDisabled(INDIRECT_TAX) &&
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.indirectTax?.taxKey, props.taxKeys) || t("--indirectTaxCode--")}</div>
            <div className="value">
              {(props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                (!isIndirectTaxCodeVisible ? props.data.indirectTax?.encryptedTaxCode?.maskedValue || '*****' : props.data.indirectTax?.encryptedTaxCode?.unencryptedValue)}
              {props.data.indirectTax?.encryptedTaxCode?.unencryptedValue &&
                isIndirectTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsIndirectTaxCodeVisible(false)} />}
              {props.data.indirectTax?.encryptedTaxCode?.unencryptedValue &&
                !isIndirectTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsIndirectTaxCodeVisible(true)} />}
              {
                !(props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div>-</div>
              }
              {
                props.isValidationSupported && !props.data?.indirectTax?.taxCodeValidationTimeout && props.data?.indirectTax?.taxCodeError && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTax?.taxCodeError, props.data?.indirectTax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)' /> {t("Verification failed")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && !props.data?.indirectTax?.taxCodeValidationTimeout && !props.data?.indirectTax?.taxCodeError && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTax?.taxCodeError, props.data?.indirectTax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)' />{t("Verified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.indirectTax?.taxCodeValidationTimeout && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTax?.taxCodeError, props.data?.indirectTax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)' />{t("Unverified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.indirectTax?.taxCodeValidationTimeout && props.data?.indirectTax?.taxCodeError && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="reverify" onClick={() => handleTaxValidation(props.data?.companyName, props.data.indirectTax?.encryptedTaxCode, props.data?.taxAddress?.alpha2CountryCode?.toLowerCase(), getTaxKeyNameForKey(props.data?.indirectTax?.taxKey, props.taxKeys) || 'Tax Code', TaxType.indirect)}>{t("Reverify")}</div>
              }
            </div>
          </div>}
        {props.data?.tax1099Required && !isFieldDisabled(TAX_1099) && <div className="keyValuePair">
          <div className="label">{t("Are you eligible for 1099?")}</div>
          <div className="value">{props.data?.tax1099 !== undefined && props.data?.tax1099 !== null ? (props.data?.tax1099 ? t("Yes") : t("No")) : '-'}</div>
        </div>}
        {!isFieldDisabled(SPECIAL_TAX_STATUS) && <div className="keyValuePair">
          <div className="label">{t("Any legal tax status")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.specialTaxStatus ? t("Yes") : t("No"), fieldName: SPECIAL_TAX_STATUS, trackedAttributes: {val: props.trackedAttributes?.diffs?.fieldDiffs?.specialTaxStatus?.original ? true ? t("Yes") : t("No") : ''}, fieldType: CustomFieldType.string }) || '-'}
          </div>
        </div>}
        {props.data?.specialTaxStatus && !isFieldDisabled(SPECIAL_TAX_STATUS) && !isFieldDisabled(SPECIAL_TAX_NOTE) && <div className="keyValuePair">
          <div className="label">{t("Note")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.specialTaxNote || '-', fieldName: SPECIAL_TAX_NOTE, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
        {props.data?.specialTaxStatus && props.data?.specialTaxAttachments?.length > 0 && !isFieldDisabled(SPECIAL_TAX_STATUS) &&
          <div className="keyValuePair">
            <div className="label">{t("Special legal tax attachments")}</div>
            <div className="value multiline">
              {
                props.data?.specialTaxAttachments.map((item, index) => {
                  return (
                    <AttachmentReadOnly
                      key={index}
                      attachment={item as Attachment}
                      onPreview={() => loadFile(`specialTaxAttachments[${index}]`, (item as Attachment)?.mediatype, (item as Attachment)?.filename)}
                    />
                  )
                })
              }
            </div>
          </div>}
        {props.data?.usCompanyEntityType && !isFieldDisabled(US_COMPANY_ENTITY) &&
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig(US_COMPANY_ENTITY) || t("Business entity type")}</div>
            <div className="value">{props.data?.usCompanyEntityType?.name || '-'}</div>
          </div>}
        {getOcredBusinessEntity() && !isFieldDisabled(US_COMPANY_ENTITY) && <div className="keyValuePair">
          <div className="label"></div>
          <div className="value">
            <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle> {t('--extractedFromTaxForm--')}: <strong>{getOcredBusinessEntity()}</strong></div>
          </div>
        </div>}
      </div>
      {canShowOtherInformationSection() && <div className="sectionTitle">{t('--otherInformation--')}</div>}
      {canShowOtherInformationSection() && <div className="formFields">
        {!isFieldDisabled(COMPANY_NAME) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(COMPANY_NAME) || t("Company Name")} &#40;{t('--alsoKnownAs--')}&#41;</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.companyName, fieldName: COMPANY_NAME, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
        {!isFieldDisabled(ADDRESS) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(ADDRESS) || t("--hqAddress--")} {isFieldRequired(fieldMap, ADDRESS) ? '' : <>&#40;{t('--ifDifferentFromLegalAddress--')}&#41;</>}</div>
          <div className="value">{convertAddressToString(props.data?.address) || '-'}</div>
        </div>}
        {!isFieldDisabled(WEBSITE) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(WEBSITE) || t("Website")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.website, fieldName: WEBSITE, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
        {!isFieldDisabled(EMAIL) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(EMAIL) || t("Email")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.email, fieldName: EMAIL, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
        {!isFieldDisabled(PHONE) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(PHONE) || t("Phone number")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.phone, fieldName: PHONE, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
        {!isFieldDisabled(FAX) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(FAX) || t("--faxNumber--")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.fax, fieldName: FAX, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
        {!isFieldDisabled(DUNS) && <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig(DUNS) || t("DUNS number")}</div>
          <div className="value">{mapCustomFieldValue({ value: props.data?.duns, fieldName: DUNS, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
        </div>}
      </div>}
      {!isFieldDisabled(INSTRUCTION) && <>
        <div className="sectionTitle"></div>
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig(INSTRUCTION) || t("--additionalComments--")}</div>
            <div className="value">{mapCustomFieldValue({ value: props.data?.instruction, fieldName: INSTRUCTION, trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string }) || '-'}</div>
          </div>
        </div>
      </>}
    </div>
  )
}


