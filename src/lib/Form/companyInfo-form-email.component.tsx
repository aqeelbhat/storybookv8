import React from 'react'
import { CompanyInfoFormData, EnumsDataObject } from './types'
import { convertAddressToString, getLocalDateString } from './util'

import './email-template.css'
import { Attachment } from '../Types'
import { getFileIcon } from '../Inputs/utils.service'

interface CompanyInfoFormEmailProps {
  data: CompanyInfoFormData
  taxKeys?: EnumsDataObject[]
  taxFormKeys?: EnumsDataObject[]
  onDownloadCLick?: (fieldName: string, type: string, fileName: string) => void
}

export function CompanyInfoFormEmail (props: CompanyInfoFormEmailProps) {
  function getTaxKeyNameForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.name || ''
  }

  function getTaxFormNameForKey (taxFormKey?: string) {
    return props.taxFormKeys?.find(key => key.code === taxFormKey)?.name || ''
  }

  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Company and Tax information</h1>

      <div className="emailHeadingSubBox">Business information</div>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Company name</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.companyName || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Legal name</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.useCompanyName ? '(same as company name)' : props.data.legalName || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Website</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.website || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Address</div></td>
            <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.address) || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      <div className="emailHeadingSubBox">Tax information</div>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Address of tax residency</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.useCompanyAddress ? '(same as company address)' : convertAddressToString(props.data.taxAddress) || '-'}</div></td>
          </tr>
        

          { props.data?.usCompanyEntityType &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Business entity type</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.usCompanyEntityType.displayName || '-'}</div></td>
            </tr>}

          { props.data?.foreignTaxClassification &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">US Federal Tax Classification</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.foreignTaxClassification.displayName || '-'}</div></td>
            </tr>}

          { props.data?.taxKey &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getTaxKeyNameForKey(props.data?.taxKey) || 'Tax Code'}</div></td>
              <td align="left">
                <div className="emailLabelValue">
                  { (props.data.encryptedTaxCode?.maskedValue || props.data.encryptedTaxCode?.unencryptedValue) &&
                    (props.data.encryptedTaxCode?.maskedValue || '*****')}
                </div>
              </td>
            </tr>}

          { props.data.foreignTaxKey &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getTaxKeyNameForKey(props.data?.foreignTaxKey) || 'Foreign Tax Code'}</div></td>
              <td align="left">
                <div className="emailLabelValue">
                  { (props.data.encryptedForeignTaxCode?.maskedValue || props.data.encryptedForeignTaxCode?.unencryptedValue) &&
                    (props.data.encryptedForeignTaxCode?.maskedValue || '*****')}
                </div>
              </td>
            </tr>}

          { props.data?.taxKey && props.data.taxForm &&
            <>
              <tr>
                <td>
                  <div className="fieldTitle">{getTaxFormNameForKey(props.data?.taxFormKey) || 'Tax Form'} :</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="emailQuotesAttachment">
                    <table>
                      <tbody>
                        <tr>
                          <td width='32px'>
                            <div className="emailSvg">
                                <img src={getFileIcon((props.data.taxForm as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                            </div>
                          </td>
                          <td>
                            <div className="emailQuotesAttachmentName">{(props.data.taxForm as Attachment).name || (props.data.taxForm as Attachment).filename}</div>
                            <div className="emailQuotesAttachmentDesc">{(props.data.taxForm as Attachment).note ? (props.data.taxForm as Attachment).note : ''}</div>
                          </td>
                          <td align="right">
                            <div className="emailQuotesAttachmentDate">
                                {(props.data.taxForm as Attachment).expiration ? getLocalDateString((props.data.taxForm as Attachment).expiration) : ''}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </>}

          { props.data?.usForeignTaxFormKey && props.data.usForeignTaxForm &&
            <>
              <tr>
                <td>
                  <div className="emailHeadingSub">{getTaxFormNameForKey(props.data?.usForeignTaxFormKey) || 'Foreign Tax Form'} :</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="emailQuotesAttachment">
                    <table>
                      <tbody>
                        <tr>
                          <td width='32px'>
                            <div className="emailSvg">
                                <img src={getFileIcon((props.data.usForeignTaxForm as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                            </div>
                          </td>
                          <td>
                            <div className="emailQuotesAttachmentName">{props.data.usForeignTaxForm.name || (props.data.usForeignTaxForm as Attachment).filename}</div>
                            <div className="emailQuotesAttachmentDesc">{(props.data.usForeignTaxForm as Attachment).note ? (props.data.usForeignTaxForm as Attachment).note : ''}</div>
                          </td>
                          <td align="right">
                            <div className="emailQuotesAttachmentDate">
                                {(props.data.usForeignTaxForm as Attachment).expiration ? getLocalDateString((props.data.usForeignTaxForm as Attachment).expiration) : ''}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </>}

          { props.data?.foreignTaxClassification &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Have any special legal tax status or exemption?</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.specialTaxStatus ? 'Yes' : 'No'}</div></td>
            </tr>}

          { props.data?.foreignTaxClassification && props.data.specialTaxStatus &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Note</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.specialTaxNote || '-'}</div></td>
            </tr>}

          { props.data?.foreignTaxClassification && props.data.specialTaxStatus && props.data.specialTaxAttachment &&
            <>
              <tr>
                <td>
                  <div className="emailHeadingSub">Attachment :</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="emailQuotesAttachment">
                    <table>
                      <tbody>
                        <tr>
                          <td width='32px'>
                            <div className="emailSvg">
                                <img src={getFileIcon((props.data.specialTaxAttachment as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                            </div>
                          </td>
                          <td>
                            <div className="emailQuotesAttachmentName">{props.data.specialTaxAttachment.name || (props.data.specialTaxAttachment as Attachment).filename}</div>
                            <div className="emailQuotesAttachmentDesc">{(props.data.specialTaxAttachment as Attachment).note ? (props.data.specialTaxAttachment as Attachment).note : ''}</div>
                          </td>
                          <td align="right">
                            <div className="emailQuotesAttachmentDate">
                                {(props.data.specialTaxAttachment as Attachment).expiration ? getLocalDateString((props.data.specialTaxAttachment as Attachment).expiration) : ''}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </>}

          { props.data.foreignTaxFormKey && props.data.foreignTaxForm &&
            <>
              <tr>
                <td>
                  <div className="emailHeadingSub">{getTaxFormNameForKey(props.data?.foreignTaxFormKey) || 'Foreign Tax Form'} :</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="emailQuotesAttachment">
                    <table>
                      <tbody>
                        <tr>
                          <td width='32px'>
                            <div className="emailSvg">
                                <img src={getFileIcon((props.data.foreignTaxForm as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                            </div>
                          </td>
                          <td>
                            <div className="emailQuotesAttachmentName">{props.data.foreignTaxForm.name || (props.data.foreignTaxForm as Attachment).filename}</div>
                            <div className="emailQuotesAttachmentDesc">{(props.data.foreignTaxForm as Attachment).note ? (props.data.foreignTaxForm as Attachment).note : ''}</div>
                          </td>
                          <td align="right">
                            <div className="emailQuotesAttachmentDate">
                                {(props.data.foreignTaxForm as Attachment).expiration ? getLocalDateString((props.data.foreignTaxForm as Attachment).expiration) : ''}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </>}

          { props.data.registryQuestion &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{props.data.registryQuestion}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.inRegistry ? 'Yes' : 'No'}</div></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}
