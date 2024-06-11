import React, { useState } from 'react'
import { CompanyInfoFormData, EnumsDataObject, TrackedAttributes } from './types'
import { convertAddressToString } from './util'

import './oro-form-read-only.css'
import { Attachment } from '../Types'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { Eye, EyeOff } from 'react-feather'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'

interface CompanyInfoFormReadOnlyProps {
  data: CompanyInfoFormData
  trackedAttributes?: TrackedAttributes
  taxKeys?: EnumsDataObject[]
  taxFormKeys?: EnumsDataObject[]
  isSingleColumnLayout?: boolean
  loadDocument?: (fieldName: string, type: string, fileName: string) => Promise<Blob>
}

export function CompanyInfoFormReadOnly (props: CompanyInfoFormReadOnlyProps) {
  const [isTaxCodeVisible, setIsTaxCodeVisible] = useState<boolean>(false)
  const [isForeignTaxCodeVisible, setIsForeignTaxCodeVisible] = useState<boolean>(false)
  
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

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="sectionTitle">Business information</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">Company name</div>
          <div className="value">
            {mapCustomFieldValue({value: props.data.companyName, fieldName: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}                  
          </div>
        </div>

        <div className="keyValuePair">
          <div className="label">Legal name</div>
          <div className="value">{props.data.useCompanyName ? '(same as company name)' : 
           mapCustomFieldValue({value: props.data?.legalName, fieldName: 'legalName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
          </div>
        </div>

        <div className="keyValuePair">
          <div className="label">Website</div>
          <div className="value">
            {/* {props.data.website || '-'} */}
            {mapCustomFieldValue({value: props.data.website, fieldName: 'website', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
          </div>
        </div>

        <div className="keyValuePair">
          <div className="label">Address</div>
          <div className="value">{convertAddressToString(props.data.address) || '-'}</div>
        </div>
      </div>

      <div className="sectionTitle">Tax information</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">Address of tax residency</div>
          <div className="value">{props.data.useCompanyAddress ? '(same as company address)' : convertAddressToString(props.data.taxAddress) || '-'}</div>
        </div>
      </div>

      { props.data?.usCompanyEntityType &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">Business entity type</div>
            <div className="value">
              {mapCustomFieldValue({value: props.data.usCompanyEntityType.displayName , fieldName: 'usCompanyEntityType', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>
        </div>}

      { props.data?.foreignTaxClassification &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">US Federal Tax Classification</div>
            <div className="value">
            {mapCustomFieldValue({value: props.data.foreignTaxClassification.displayName, fieldName: 'foreignTaxClassification', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>
        </div>}

      { props.data?.taxKey &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.taxKey) || 'Tax Code'}</div>
            <div className="value">
              { (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                (!isTaxCodeVisible ? props.data.encryptedTaxCode?.maskedValue || '*****' : props.data.encryptedTaxCode?.unencryptedValue)}
              { props.data.encryptedTaxCode?.unencryptedValue &&
                isTaxCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(false)} />}
              { props.data.encryptedTaxCode?.unencryptedValue &&
                !isTaxCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsTaxCodeVisible(true)} />}
            </div>
          </div>
        </div>}

      { props.data.foreignTaxKey &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxKeyNameForKey(props.data?.foreignTaxKey) || 'Foreign Tax Code'}</div>
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

      { props.data?.taxKey && props.data.taxForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.taxFormKey) || 'Tax Form'}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.taxForm as Attachment}
                onPreview={() => loadFile('taxForm', (props.data.taxForm as Attachment).mediatype, (props.data.taxForm as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data?.usForeignTaxFormKey && props.data.usForeignTaxForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.usForeignTaxFormKey) || 'Foreign Tax Form'}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.usForeignTaxForm as Attachment}
                onPreview={() => loadFile('usForeignTaxForm', (props.data.usForeignTaxForm as Attachment).mediatype, (props.data.usForeignTaxForm as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data?.foreignTaxClassification &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">Have any special legal tax status or exemption?</div>
            <div className="value">{props.data.specialTaxStatus ? 'Yes' : 'No'}</div>
          </div>
        </div>}

      { props.data?.foreignTaxClassification && props.data.specialTaxStatus &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">Note</div>
            <div className="value">
              {mapCustomFieldValue({value: props.data.specialTaxNote, fieldName: 'specialTaxNote', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
          </div>
        </div>}

      { props.data?.foreignTaxClassification && props.data.specialTaxStatus && props.data.specialTaxAttachment &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">Attachment</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.specialTaxAttachment as Attachment}
                onPreview={() => loadFile('specialTaxAttachment', (props.data.specialTaxAttachment as Attachment).mediatype, (props.data.specialTaxAttachment as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data.foreignTaxFormKey && props.data.foreignTaxForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getTaxFormNameForKey(props.data?.foreignTaxFormKey) || 'Foreign Tax Form'}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.foreignTaxForm as Attachment}
                onPreview={() => loadFile('foreignTaxForm', (props.data.foreignTaxForm as Attachment).mediatype, (props.data.foreignTaxForm as Attachment).filename)}
              /></div>
          </div>
        </div>}

      { props.data.registryQuestion &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">
              {mapCustomFieldValue({value: props.data.registryQuestion, fieldName: 'registryQuestion', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
            <div className="value">{props.data.inRegistry ? 'Yes' : 'No'}</div>
          </div>
        </div>}
    </div>
  )
}
