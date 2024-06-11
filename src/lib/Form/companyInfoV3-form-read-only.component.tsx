import React, { useState} from 'react'
import { CompanyInfoV3FormData, EnumsDataObject, Field, TaxType, TrackedAttributes } from './types'
import { convertAddressToString, getOcredAddressUtil, getOcredBusinessEntityUtil, getOcredLegalNameUtil, getOcredTaxKeyValueUtil, getTaxFormNameForKey, getTaxKeyNameForKey, mapIDRefToOption } from './util'

import './oro-form-read-only.css'
import { Attachment, EncryptedData, Option } from '../Types'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { AlertCircle, Circle, Eye, EyeOff, Info } from 'react-feather'
import Tooltip from '@mui/material/Tooltip'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'
import { getFormFieldConfig } from './util'

interface CompanyInfoV3FormReadOnlyProps {
  data: CompanyInfoV3FormData
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

export function CompanyInfoV3FormReadOnly (props: CompanyInfoV3FormReadOnlyProps) {
  const [isTaxCodeVisible, setIsTaxCodeVisible] = useState<boolean>(false)
  const [isIndirectTaxCodeVisible, setIsIndirectTaxCodeVisible] = useState<boolean>(false)
  const { t }  = useTranslationHook(NAMESPACES_ENUM.COMPANYINFOFORM)

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function getVerificationTitle (taxCodeError: boolean, isTimeout: boolean): React.ReactNode {
    if (taxCodeError && !isTimeout) {
      return (
        <>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-chilli-regular)' color='var(--warm-stat-chilli-regular)'/>{t("Tax ID is unregistered")}</div>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-mint-mid)' color='var(--warm-stat-mint-mid)'/>{t("Confirmed by the supplier as valid")}</div>
        </>
      )
    } else if (taxCodeError && isTimeout) {
      return (
        <>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-chilli-regular)' color='var(--warm-stat-chilli-regular)'/>{t("Tax ID verification timed out")}</div>
          <div className="sentence"><Circle size={5} fill='var(--warm-stat-mint-mid)' color='var(--warm-stat-mint-mid)'/>{t("Confirmed by the supplier as valid")}</div>
        </>
      )
    } else {
      return (
        <div className="sentence">{t("Tax ID is registered")}</div>
      )
    }
  }

  function handleTaxValidation (name: string, data: EncryptedData, countryCode: string, taxCode: string, tax: string) {
    if (props.onValidateTax && name && data && countryCode) {
      props.onValidateTax(name, data, countryCode, taxCode, tax)
    }
  }

  function getOcredAddress (): string {
    return getOcredAddressUtil(props.data, props.data?.taxAddress)
  }

  function getOcredBusinessEntity (): string {
    return getOcredBusinessEntityUtil(props.data, props.usCompanyEntityTypeOptions, mapIDRefToOption(props.data?.usCompanyEntityType))
  }

  function getOcredTaxKeyValue(): string {
    return getOcredTaxKeyValueUtil(props.data, props.data?.tax?.encryptedTaxCode)
  }

  function getOcredLegalName(): string {
    return getOcredLegalNameUtil(props.data, props.data?.legalName)
  }

  function getAdditionalTaxFormForKey (key: string): Attachment | File | undefined {
    const taxForm = props.data?.additionalDocuments.find(item => item.taxFormKey === key)
    return taxForm?.taxForm || undefined
  }

  function findAdditionalDocIndexForPriview (item: string): number {
    const docIndex = props.data?.additionalDocuments.findIndex(doc => doc.taxFormKey === item)
    return docIndex
  }

  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
  }

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig('companyName') || t("Company Name")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.companyName, fieldName: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>       
      </div>

      <div className="sectionTitle">{t("Tax information")}</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("--jurisdictionCountry--")}</div>
          <div className="value">{props.data?.jurisdictionCountryCode ? ALPHA2CODES_DISPLAYNAMES[props.data?.jurisdictionCountryCode] : '-'}</div>
        </div> 
        {props.data?.tax?.taxKey && props.data?.taxForm?.taxForm && <div className="keyValuePair">
          <div className="label">{getTaxFormNameForKey(props.data?.taxForm?.taxFormKey, props.taxFormKeys) || t("Tax Form")}</div>
          <div className="value">
            <AttachmentReadOnly
              attachment={props.data.taxForm.taxForm as Attachment}
              onPreview={() => loadFile('taxForm.taxForm', (props.data.taxForm.taxForm as Attachment)?.mediatype, (props.data?.taxForm?.taxForm as Attachment)?.filename)}
            />
          </div>
        </div>}
        { props.data?.indirectTax?.taxKey && props.data?.indirectTaxForm?.taxForm &&
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.indirectTaxForm?.taxFormKey, props.taxFormKeys) || getFieldLabelFromConfig('indirectTax') || t("--indirectTaxForm--")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.indirectTaxForm?.taxForm as Attachment}
                onPreview={() => loadFile('indirectTaxForm.taxForm', (props.data?.indirectTaxForm?.taxForm as Attachment)?.mediatype, (props.data?.indirectTaxForm?.taxForm as Attachment)?.filename)}
              />
            </div>
          </div>}
        { props.data?.usTaxDeclarationFormKey && props.data?.usTaxDeclarationForm &&
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.usTaxDeclarationFormKey, props.taxFormKeys) || t("--usTaxDeclarationForm--")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data?.usTaxDeclarationForm as Attachment}
                onPreview={() => loadFile('usTaxDeclarationForm', (props.data?.usTaxDeclarationForm as Attachment)?.mediatype, (props.data?.usTaxDeclarationForm as Attachment)?.filename)}
              />
            </div>
          </div>}
          { props.data?.additionalDocsList && props.data?.additionalDocsList.length > 0 &&
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
        <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig('legalName') || t("Legal name")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data?.legalName, fieldName: 'legalName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
          </div>
        </div>
        {getOcredLegalName() && <div className="keyValuePair">
            <div className="label"></div>
            <div className="value">
              <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle> {t('--extractedFromTaxForm--')}: <strong>{getOcredLegalName()}</strong></div>
            </div>
          </div>}
        <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig('taxAddress') || t("Address")}</div>
          <div className="value">{convertAddressToString(props.data?.taxAddress) || '-'}</div>
        </div>
        {getOcredAddress() && <div className="keyValuePair">
            <div className="label"></div>
            <div className="value">
              <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle><div>{t('--extractedFromTaxForm--')}: <strong>{getOcredAddress()}</strong></div></div>
            </div>
          </div>}
        { props.data?.tax?.taxKey &&
        <>
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.tax?.taxKey, props.taxKeys) || t("Tax Code")}</div>
            <div className="value">
              { (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                (!isTaxCodeVisible ? props.data.tax?.encryptedTaxCode?.maskedValue || '*****' : props.data.tax?.encryptedTaxCode?.unencryptedValue)
              }
              { props.data.tax?.encryptedTaxCode?.unencryptedValue &&
                isTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(false)} />
              }
              { props.data.tax?.encryptedTaxCode?.unencryptedValue &&
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
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/> {t("Verification failed")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && !props.data?.tax?.taxCodeValidationTimeout && !props.data?.tax?.taxCodeError && (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.tax?.taxCodeError, props.data?.tax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Verified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.tax?.taxCodeValidationTimeout && (props.data.tax?.encryptedTaxCode?.maskedValue || props.data.tax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.tax?.taxCodeError, props.data?.tax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Unverified")}</div>
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
      
        { props.data?.indirectTax?.taxKey &&
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.indirectTax?.taxKey, props.taxKeys) || t("--indirectTaxCode--")}</div>
            <div className="value">
              { (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                (!isIndirectTaxCodeVisible ? props.data.indirectTax?.encryptedTaxCode?.maskedValue || '*****' : props.data.indirectTax?.encryptedTaxCode?.unencryptedValue)}
              { props.data.indirectTax?.encryptedTaxCode?.unencryptedValue &&
                isIndirectTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsIndirectTaxCodeVisible(false)} />}
              { props.data.indirectTax?.encryptedTaxCode?.unencryptedValue &&
                !isIndirectTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsIndirectTaxCodeVisible(true)} />}
              {
                !(props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div>-</div>
              }
              {
                props.isValidationSupported && !props.data?.indirectTax?.taxCodeValidationTimeout && props.data?.indirectTax?.taxCodeError && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTax?.taxCodeError, props.data?.indirectTax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/> {t("Verification failed")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && !props.data?.indirectTax?.taxCodeValidationTimeout && !props.data?.indirectTax?.taxCodeError && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTax?.taxCodeError, props.data?.indirectTax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Verified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.indirectTax?.taxCodeValidationTimeout && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTax?.taxCodeError, props.data?.indirectTax?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Unverified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.indirectTax?.taxCodeValidationTimeout && props.data?.indirectTax?.taxCodeError && (props.data.indirectTax?.encryptedTaxCode?.maskedValue || props.data.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                <div className="reverify" onClick={() => handleTaxValidation(props.data?.companyName, props.data.indirectTax?.encryptedTaxCode, props.data?.taxAddress?.alpha2CountryCode?.toLowerCase(), getTaxKeyNameForKey(props.data?.indirectTax?.taxKey, props.taxKeys) || 'Tax Code', TaxType.indirect)}>{t("Reverify")}</div>
              }
            </div>
          </div>}
      </div>

      <div className="sectionTitle"></div>
        <div className="formFields">
          {props.data?.tax1099Required && <div className="keyValuePair">
            <div className="label">{t("Are you eligible for 1099?")}</div>
            <div className="value">{props.data?.tax1099 !== undefined && props.data?.tax1099 !== null ? (props.data?.tax1099 ? t("Yes") : t("No"))  : '-'}</div>
          </div>}
          <div className="keyValuePair">
            <div className="label">{t("Any legal tax status")}</div>
            <div className="value">{props.data?.specialTaxStatus ? t("Yes") : t("No")}</div>
          </div>
          {props.data?.specialTaxStatus && <div className="keyValuePair">
            <div className="label">{t("Note")}</div>
            <div className="value">{props.data?.specialTaxNote || '-'}</div>
          </div>}
          { props.data?.specialTaxStatus && props.data?.specialTaxAttachments?.length > 0 &&
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
          { props.data?.usCompanyEntityType &&
            <div className="keyValuePair">
              <div className="label">{getFieldLabelFromConfig('usCompanyEntityType') || t("Business entity type")}</div>
              <div className="value">{props.data?.usCompanyEntityType?.name || '-'}</div>
            </div>}
            {getOcredBusinessEntity() && <div className="keyValuePair">
              <div className="label"></div>
              <div className="value">
                <div className='ocredTag'><AlertCircle size={16} color='#575F70'></AlertCircle> {t('--extractedFromTaxForm--')}: <strong>{getOcredBusinessEntity()}</strong></div>
              </div>
            </div>}
        </div>

        <div className="sectionTitle">{t('--otherInformation--')}</div>
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('address')  || t("Company Address")}</div>
            <div className="value">{convertAddressToString(props.data?.address) || '-'}</div>
          </div> 
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('website') || t("Website")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data?.website, fieldName: 'website', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
          </div>
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('email') || t("Email")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data?.email, fieldName: 'email', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
          </div>
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('phone') || t("Phone number")}</div>
            <div className="value">{mapCustomFieldValue({value: props.data?.phone, fieldName: 'phone', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
          </div>
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('fax') || t("--faxNumber--")}</div>
            <div className="value">{mapCustomFieldValue({value: props.data?.fax, fieldName: 'fax', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
          </div>
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('duns') || t("DUNS number")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data?.duns, fieldName: 'duns', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
          </div>
        </div>
      <div className="sectionTitle"></div>
      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{getFieldLabelFromConfig('instruction') || t("Instruction")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data?.instruction, fieldName: 'instruction', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>
      </div>
    </div>
  )
}


