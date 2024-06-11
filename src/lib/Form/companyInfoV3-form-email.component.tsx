import React from 'react'
import { CompanyInfoV3FormData, EnumsDataObject, Field } from './types'
import { convertAddressToString, getLocalDateString, getTaxFormNameForKey, getTaxKeyNameForKey ,getFormFieldConfig} from './util'
import './email-template.css'
import { Attachment } from '../Types'
import { getFileIcon } from '../Inputs/utils.service'
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'

interface CompanyInfoV3FormEmailProps {
  fields?: Field[]
  data: CompanyInfoV3FormData | undefined
  taxKeys?: EnumsDataObject[]
  taxFormKeys?: EnumsDataObject[]
  onDownloadCLick?: (fieldName: string, type: string, fileName: string) => void 
}

export function CompanyInfoV3FormEmail (props: CompanyInfoV3FormEmailProps) {
  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields || [])?.customLabel || ''
  }
  return (
    <>
      {props.data && <div className="emailTemplate">
        <h1 className="emailHeading">Company and Tax information</h1>
        <div className="emailHeadingSubBox">Business information</div>
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('companyName') || "Company Name"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.companyName || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Jurisdiction country</div></td>
              <td align="left"><div className="emailLabelValue">{props.data?.jurisdictionCountryCode ? ALPHA2CODES_DISPLAYNAMES[props.data?.jurisdictionCountryCode] : '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('legalName') || "Legal Name"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.useCompanyName ? '(same as company name)' : props.data.legalName || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('website') || "Website"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.website || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('duns')  || "DUNS Number"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.duns || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('email')  || 'Email'}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data?.email || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('phone')  || "Phone number"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data?.phone || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('address')  || "Company Address"}</div></td>
              <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.address) || '-'}</div></td>
            </tr>
          </tbody>
        </table>
        <div className="emailHeadingSubBox">Tax information</div>
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('address')  || "Address"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.useCompanyAddress ? '(same as company address)' : convertAddressToString(props.data.taxAddress) || '-'}</div></td>
            </tr>
            { props.data?.tax.taxKey &&
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">{getTaxKeyNameForKey(props.data?.tax.taxKey, props.taxKeys || []) || 'Tax Code'}</div></td>
                <td align="left">
                  <div className="emailLabelValue">
                    { (props.data.tax.encryptedTaxCode?.maskedValue || props.data.tax.encryptedTaxCode?.unencryptedValue) &&
                      (props.data.tax.encryptedTaxCode?.maskedValue || '*****')}
                  </div>
                </td>
              </tr>}
          { props.data?.indirectTax?.taxKey &&
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">{getTaxKeyNameForKey(props.data?.indirectTax?.taxKey, props.taxKeys || []) || 'Tax Code'}</div></td>
                <td align="left">
                  <div className="emailLabelValue">
                    { (props.data?.indirectTax?.encryptedTaxCode?.maskedValue || props.data?.indirectTax?.encryptedTaxCode?.unencryptedValue) &&
                      (props.data?.indirectTax?.encryptedTaxCode?.maskedValue || '*****')}
                  </div>
                </td>
              </tr>}
            { props.data?.usCompanyEntityType &&
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('usCompanyEntityType') || "Business entity type"}</div></td>
                <td align="left"><div className="emailLabelValue">{props.data.usCompanyEntityType.name || '-'}</div></td>
              </tr>}
            { props.data?.foreignTaxClassification &&
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">US Federal Tax Classification</div></td>
                <td align="left"><div className="emailLabelValue">{props.data.foreignTaxClassification.name || '-'}</div></td>
              </tr>}
            { props.data?.usTaxDeclarationFormKey && props.data?.usTaxDeclarationForm &&
              <>
                <tr>
                  <td>
                    <div className="fieldTitle">{getTaxFormNameForKey(props.data?.usTaxDeclarationFormKey, props.taxFormKeys || []) || 'Tax Form'} :</div>
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
                                  <img src={getFileIcon((props.data.usTaxDeclarationForm as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                              </div>
                            </td>
                            <td>
                              <div className="emailQuotesAttachmentName">{(props.data.usTaxDeclarationForm as Attachment).name || (props.data.usTaxDeclarationForm as Attachment).filename}</div>
                              <div className="emailQuotesAttachmentDesc">{(props.data.usTaxDeclarationForm as Attachment).note ? (props.data.usTaxDeclarationForm as Attachment).note : ''}</div>
                            </td>
                            <td align="right">
                              <div className="emailQuotesAttachmentDate">
                                  {(props.data.usTaxDeclarationForm as Attachment).expiration ? getLocalDateString((props.data.usTaxDeclarationForm as Attachment).expiration) : ''}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </>}
            { props.data?.tax?.taxKey && props.data.taxForm?.taxForm &&
              <>
                <tr>
                  <td>
                    <div className="fieldTitle">{getTaxFormNameForKey(props.data?.taxForm.taxFormKey, props.taxFormKeys || []) || 'Tax Form'} :</div>
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
                                  <img src={getFileIcon((props.data.taxForm?.taxForm as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                              </div>
                            </td>
                            <td>
                              <div className="emailQuotesAttachmentName">{(props.data.taxForm?.taxForm as Attachment).name || (props.data.taxForm?.taxForm as Attachment).filename}</div>
                              <div className="emailQuotesAttachmentDesc">{(props.data.taxForm?.taxForm as Attachment).note ? (props.data.taxForm?.taxForm as Attachment).note : ''}</div>
                            </td>
                            <td align="right">
                              <div className="emailQuotesAttachmentDate">
                                  {(props.data.taxForm?.taxForm as Attachment).expiration ? getLocalDateString((props.data.taxForm?.taxForm as Attachment).expiration) : ''}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </>}
              { props.data?.indirectTax?.taxKey && props.data.indirectTaxForm?.taxForm &&
              <>
                <tr>
                  <td>
                    <div className="fieldTitle">{getTaxFormNameForKey(props.data?.indirectTaxForm.taxFormKey, props.taxFormKeys || []) || 'Tax Form'} :</div>
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
                                  <img src={getFileIcon((props.data.indirectTaxForm?.taxForm as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                              </div>
                            </td>
                            <td>
                              <div className="emailQuotesAttachmentName">{(props.data.indirectTaxForm?.taxForm as Attachment).name || (props.data.indirectTaxForm?.taxForm as Attachment).filename}</div>
                              <div className="emailQuotesAttachmentDesc">{(props.data.indirectTaxForm?.taxForm as Attachment).note ? (props.data.indirectTaxForm?.taxForm as Attachment).note : ''}</div>
                            </td>
                            <td align="right">
                              <div className="emailQuotesAttachmentDate">
                                  {(props.data.indirectTaxForm?.taxForm as Attachment).expiration ? getLocalDateString((props.data.indirectTaxForm?.taxForm as Attachment).expiration) : ''}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </>}
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">Have any special legal tax status or exemption?</div></td>
                <td align="left"><div className="emailLabelValue">{props.data.specialTaxStatus ? 'Yes' : 'No'}</div></td>
              </tr>
            { props.data.specialTaxStatus &&
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">Note</div></td>
                <td align="left"><div className="emailLabelValue">{props.data.specialTaxNote || '-'}</div></td>
              </tr>}
            { props.data.specialTaxStatus && props.data.specialTaxAttachments.length > 0 &&
              <>
                <tr>
                  <td>
                    <div className="emailHeadingSub">Attachments:</div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div className="emailQuotesAttachment">
                      <table>
                        <tbody>
                          {
                            props.data.specialTaxAttachments.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td width='32px'>
                                    <div className="emailSvg">
                                        <img src={getFileIcon((item as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="emailQuotesAttachmentName">{item.name || (item as Attachment).filename}</div>
                                    <div className="emailQuotesAttachmentDesc">{(item as Attachment).note ? (item as Attachment).note : ''}</div>
                                  </td>
                                  <td align="right">
                                    <div className="emailQuotesAttachmentDate">
                                        {(item as Attachment).expiration ? getLocalDateString((item as Attachment).expiration) : ''}
                                    </div>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </>}
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('instruction')  || "Instruction"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.instruction || '-'}</div></td>
            </tr>
          </tbody>
        </table>
      </div>}
    </>
  )
}
