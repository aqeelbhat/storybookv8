import React, { useState } from 'react'
import { CompanyInfoV2FormData, EnumsDataObject, TaxType, TrackedAttributes } from './types'
import { convertAddressToString } from './util'

import './oro-form-read-only.css'
import { Attachment, EncryptedData } from '../Types'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { Circle, Eye, EyeOff, Info } from 'react-feather'
import Tooltip from '@mui/material/Tooltip'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
 
 interface CompanyInfoV2FormReadOnlyProps {
  data: CompanyInfoV2FormData
  taxKeys?: EnumsDataObject[]
  taxFormKeys?: EnumsDataObject[]
  isSingleColumnLayout?: boolean
  isValidationSupported?: boolean
  trackedAttributes?: TrackedAttributes
  onValidateTax?: (name: string, data: EncryptedData, countryCode: string, taxCode: string, tax: string) => void
  loadDocument?: (fieldName: string, type: string, fileName: string) => Promise<Blob>
}

export function CompanyInfoV2FormReadOnly (props: CompanyInfoV2FormReadOnlyProps) {
  const [isTaxCodeVisible, setIsTaxCodeVisible] = useState<boolean>(false)
  const [isIndirectTaxCodeVisible, setIsIndirectTaxCodeVisible] = useState<boolean>(false)
  const [isExemptionTaxCodeVisible, setIsExemptionTaxCodeVisible] = useState<boolean>(false)
  const [isForeignTaxCodeVisible, setIsForeignTaxCodeVisible] = useState<boolean>(false)
  const { t }  = useTranslationHook(NAMESPACES_ENUM.COMPANYINFOFORM)
  
  function getTaxKeyNameForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.name || ''
  }

  function getTaxFormNameForKey (taxFormKey?: string) {
    return props.taxFormKeys?.find(key => key.code === taxFormKey)?.name || ''
  }

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

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="sectionTitle">{t("Business information")}</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("Company Name")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.companyName, fieldName: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Legal name")}</div>
          <div className="value">{props.data.useCompanyName ? t("same as company name") : 
           mapCustomFieldValue({value: props.data?.legalName, fieldName: 'legalName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
          </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Website")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.website, fieldName: 'website', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("DUNS number")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.duns, fieldName: 'duns', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Email")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.email, fieldName: 'email', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Phone number")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data?.phone, fieldName: 'phone', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Address")}</div>
          <div className="value">{convertAddressToString(props.data.address) || '-'}</div>
        </div>
      </div>

      <div className="sectionTitle">{t("Tax information")}</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("Address of tax residency")}</div>
          <div className="value">{props.data.useCompanyAddress ? t("same as company address") : convertAddressToString(props.data.taxAddress) || '-'}</div>
        </div>
      </div>

      { props.data?.taxKey &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.taxKey) || t("Tax Code")}</div>
            <div className="value">
              { (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                (!isTaxCodeVisible ? props.data.encryptedTaxCode?.maskedValue || '*****' : props.data.encryptedTaxCode?.unencryptedValue)}
              { props.data.encryptedTaxCode?.unencryptedValue &&
                isTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(false)} />}
              { props.data.encryptedTaxCode?.unencryptedValue &&
                !isTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(true)} />}
              {
                !(props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                <div>-</div>
              }
              {
                props.isValidationSupported && !props.data?.taxCodeValidationTimeout && props.data?.taxCodeError && (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.taxCodeError, props.data?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/> {t("Verification failed")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && !props.data?.taxCodeValidationTimeout && !props.data?.taxCodeError && (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.taxCodeError, props.data?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Verified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.taxCodeValidationTimeout && (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.taxCodeError, props.data?.taxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Unverified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.taxCodeValidationTimeout && props.data?.taxCodeError && (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                <div className="reverify" onClick={() => handleTaxValidation(props.data?.companyName, props.data.encryptedTaxCode, props.data?.taxAddress?.alpha2CountryCode?.toLowerCase(), getTaxKeyNameForKey(props.data?.taxKey) || 'Tax code', TaxType.direct)}>{t("Reverify")}</div>
              }
            </div>
          </div>
        </div>}
      
      { props.data?.indirectTaxKey &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.indirectTaxKey) || t("Tax Code")}</div>
            <div className="value">
              { (props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                (!isIndirectTaxCodeVisible ? props.data.encryptedIndirectTaxCode?.maskedValue || '*****' : props.data.encryptedIndirectTaxCode?.unencryptedValue)}
              { props.data.encryptedIndirectTaxCode?.unencryptedValue &&
                isIndirectTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsIndirectTaxCodeVisible(false)} />}
              { props.data.encryptedIndirectTaxCode?.unencryptedValue &&
                !isIndirectTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsIndirectTaxCodeVisible(true)} />}
              {
                !(props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                <div>-</div>
              }
              {
                props.isValidationSupported && !props.data?.indirectTaxCodeValidationTimeout && props.data?.indirectTaxCodeError && (props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTaxCodeError, props.data?.indirectTaxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/> {t("Verification failed")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && !props.data?.indirectTaxCodeValidationTimeout && !props.data?.indirectTaxCodeError && (props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTaxCodeError, props.data?.indirectTaxCodeValidationTimeout)} arrow placement='right'>
                    <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Verified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.indirectTaxCodeValidationTimeout && (props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.indirectTaxCodeError, props.data?.indirectTaxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Unverified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.indirectTaxCodeValidationTimeout && props.data?.indirectTaxCodeError && (props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                <div className="reverify" onClick={() => handleTaxValidation(props.data?.companyName, props.data.encryptedIndirectTaxCode, props.data?.taxAddress?.alpha2CountryCode?.toLowerCase(), getTaxKeyNameForKey(props.data?.indirectTaxKey) || 'Tax Code', TaxType.indirect)}>{t("Reverify")}</div>
              }
            </div>
          </div>
        </div>}

        { props.data?.tax1099Required &&
          <div className="formFields">
            <div className="keyValuePair">
              <div className="label">{t("Are you eligible for 1099?")}</div>
              <div className="value">{props.data?.tax1099 ? (props.data?.tax1099?.id === 'yes' ? t("Yes") : t("No"))  : '-'}</div>
            </div>
          </div>}

      { props.data?.usCompanyEntityType &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t("Business entity type")}</div>
            <div className="value">{props.data.usCompanyEntityType.displayName || '-'}</div>
          </div>
        </div>}

      { props.data?.foreignTaxClassification &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t("US Federal Tax Classification")}</div>
            <div className="value">{props.data.foreignTaxClassification.displayName || '-'}</div>
          </div>
        </div>}

      { props.data?.usTaxDeclarationFormKey && props.data?.usTaxDeclarationForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.usTaxDeclarationFormKey) || t("Tax Form")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data?.usTaxDeclarationForm as Attachment}
                onPreview={() => loadFile('usTaxDeclarationForm', (props.data?.usTaxDeclarationForm as Attachment).mediatype, (props.data?.usTaxDeclarationForm as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data?.foreignTaxKey &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.foreignTaxKey) || t("Foreign Tax Code")}</div>
            <div className="value">
              { (props.data.encryptedForeignTaxCode?.maskedValue || props.data.encryptedForeignTaxCode?.unencryptedValue) &&
                (!isForeignTaxCodeVisible ? props.data.encryptedForeignTaxCode?.maskedValue || '*****' : props.data.encryptedForeignTaxCode?.unencryptedValue)}
              { props.data.encryptedForeignTaxCode?.unencryptedValue &&
                isForeignTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsForeignTaxCodeVisible(false)} />}
              { props.data.encryptedForeignTaxCode?.unencryptedValue &&
                !isForeignTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsForeignTaxCodeVisible(true)} />}
            </div>
          </div>
        </div>}

      { props.data?.taxKey && props.data?.taxForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.taxFormKey) || t("Tax Form")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.taxForm as Attachment}
                onPreview={() => loadFile('taxForm', (props.data.taxForm as Attachment).mediatype, (props.data.taxForm as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data?.usForeignTaxFormKey && props.data?.usForeignTaxForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.usForeignTaxFormKey) || t("Foreign Tax Form")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.usForeignTaxForm as Attachment}
                onPreview={() => loadFile('usForeignTaxForm', (props.data.usForeignTaxForm as Attachment).mediatype, (props.data.usForeignTaxForm as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t("Any legal tax status")}</div>
            <div className="value">{props.data.specialTaxStatus ? t("Yes") : t("No")}</div>
          </div>
        </div>

      { props.data?.exemptionTaxKey &&
        <div className="formFields">
            <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.exemptionTaxKey) || t("Tax Code")}</div>
            <div className="value">
              { (props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
              (!isExemptionTaxCodeVisible ? props.data.encryptedExemptionTaxCode?.maskedValue || '*****' : props.data.encryptedExemptionTaxCode?.unencryptedValue)}
              { props.data.encryptedExemptionTaxCode?.unencryptedValue &&
              isExemptionTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsExemptionTaxCodeVisible(false)} />}
              { props.data.encryptedExemptionTaxCode?.unencryptedValue &&
              !isExemptionTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsExemptionTaxCodeVisible(true)} />}
              {
                !(props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
                <div>-</div>
              }
              {
                props.isValidationSupported && !props.data?.exemptionTaxCodeValidationTimeout && props.data?.exemptionTaxCodeError && (props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.exemptionTaxCodeError, props.data?.exemptionTaxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Verification failed")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && !props.data?.exemptionTaxCodeValidationTimeout && !props.data?.exemptionTaxCodeError && (props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.exemptionTaxCodeError, props.data?.exemptionTaxCodeValidationTimeout)} arrow placement='right'>
                    <div className="greenTag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Verified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.exemptionTaxCodeValidationTimeout && (props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
                <div className="validation">
                  <Tooltip title={getVerificationTitle(props.data?.exemptionTaxCodeError, props.data?.exemptionTaxCodeValidationTimeout)} arrow placement='right'>
                    <div className="tag"><Info size={16} color='var(--warm-neutral-shade-400)'/>{t("Unverified")}</div>
                  </Tooltip>
                </div>
              }
              {
                props.isValidationSupported && props.data?.exemptionTaxCodeValidationTimeout && props.data?.exemptionTaxCodeError && (props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
                <div className="reverify" onClick={() => handleTaxValidation(props.data?.companyName, props.data.encryptedIndirectTaxCode, props.data?.taxAddress?.alpha2CountryCode?.toLowerCase(), getTaxKeyNameForKey(props.data?.exemptionTaxKey) || 'Tax Code', TaxType.exemption)}>{t("Reverify")}</div>
              }
            </div>
            </div>
        </div>}

      { props.data?.specialTaxStatus &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t("Note")}</div>
            <div className="value">{props.data.specialTaxNote || '-'}</div>
          </div>
        </div>}

      { props.data?.specialTaxStatus && props.data?.specialTaxAttachment &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t("Attachment")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.specialTaxAttachment as Attachment}
                onPreview={() => loadFile('specialTaxAttachment', (props.data.specialTaxAttachment as Attachment).mediatype, (props.data.specialTaxAttachment as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data?.foreignTaxFormKey && props.data?.foreignTaxForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.foreignTaxFormKey) || t("Foreign Tax Form")}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.foreignTaxForm as Attachment}
                onPreview={() => loadFile('foreignTaxForm', (props.data.foreignTaxForm as Attachment).mediatype, (props.data.foreignTaxForm as Attachment).filename)}
              /></div>
          </div>
        </div>}

      { props.data?.registryQuestion &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{props.data.registryQuestion}</div>
            <div className="value">{props.data.inRegistry ? t("Yes") : t("No")}</div>
          </div>
        </div>}

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("Instruction")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.instruction, fieldName: 'instruction', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>
      </div>
    </div>
  )
}
