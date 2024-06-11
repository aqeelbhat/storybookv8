import React from 'react'
import { CompanyIndividualInfoV2FormData, EnumsDataObject } from './types'
import { convertAddressToString, getLocalDateString } from './util'

import { useTranslationHook, NAMESPACES_ENUM } from '../i18n';
import './email-template.css'
import { Attachment } from '../Types'
import { getFileIcon } from '../Inputs/utils.service'

interface CompanyIndividualInfoV2FormEmailProps {
  data: CompanyIndividualInfoV2FormData
  taxKeys?: EnumsDataObject[]
  taxFormKeys?: EnumsDataObject[]
  onDownloadCLick?: (fieldName: string, type: string, fileName: string) => void
}

export function CompanyIndividualInfoV2FormEmail (props: CompanyIndividualInfoV2FormEmailProps) {
  
  const { t } = useTranslationHook( NAMESPACES_ENUM.COMPANYINDINFO)

  function getTaxKeyNameForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.name || ''
  }

  function getTaxFormNameForKey (taxFormKey?: string) {
    return props.taxFormKeys?.find(key => key.code === taxFormKey)?.name || ''
  }

  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">{t("Individual tax information")}</h1>

      <div className="emailHeadingSubBox">{t("Individual Details")}</div>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Full name")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data?.firstName || ''} {props.data?.middleName || ''} {props.data?.lastName || ''}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Email")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data?.email || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Phone number")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data?.phone || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Doing business as")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data?.companyName ? t("Company DBA entity") : t("Individual")}</div></td>
          </tr>

          {
            props.data?.companyName &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{t("Company name")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data?.companyName || '-'}</div></td>
            </tr>
          }
        </tbody>
      </table>

      <div className="emailHeadingSubBox">{t("Tax information")}</div>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Address of tax residency")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data?.address ? convertAddressToString(props.data.address) : '-'}</div></td>
          </tr>

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

        { props.data?.indirectTaxKey &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getTaxKeyNameForKey(props.data?.indirectTaxKey) || t("Tax Code")}</div></td>
              <td align="left">
                <div className="emailLabelValue">
                  { (props.data.encryptedIndirectTaxCode?.maskedValue || props.data.encryptedIndirectTaxCode?.unencryptedValue) &&
                    (props.data.encryptedIndirectTaxCode?.maskedValue || '*****')}
                </div>
              </td>
            </tr>}

          { props.data?.foreignTaxClassification &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{t("US Federal Tax Classification")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.foreignTaxClassification.displayName || '-'}</div></td>
            </tr>}

          { props.data?.usTaxDeclarationFormKey && props.data?.usTaxDeclarationForm &&
            <>
              <tr>
                <td>
                  <div className="fieldTitle">{getTaxFormNameForKey(props.data?.usTaxDeclarationFormKey) || t("Tax Form")} :</div>
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

          { props.data?.taxKey && props.data.taxForm &&
            <>
              <tr>
                <td>
                  <div className="fieldTitle">{getTaxFormNameForKey(props.data?.taxFormKey) || t("Tax Form")} :</div>
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

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{t("Any special status?")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.specialTaxStatus ? t("Yes") : t("No")}</div></td>
            </tr>

          { props.data?.exemptionTaxKey &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getTaxKeyNameForKey(props.data?.exemptionTaxKey) || t("Tax Code")}</div></td>
              <td align="left">
                <div className="emailLabelValue">
                  { (props.data.encryptedExemptionTaxCode?.maskedValue || props.data.encryptedExemptionTaxCode?.unencryptedValue) &&
                    (props.data.encryptedExemptionTaxCode?.maskedValue || '*****')}
                </div>
              </td>
            </tr>}

          { props.data.specialTaxStatus &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{t("Note")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.specialTaxNote || '-'}</div></td>
            </tr>}

          { props.data.specialTaxStatus && props.data.specialTaxAttachment &&
            <>
              <tr>
                <td>
                  <div className="emailHeadingSub">{t("Attachment")} :</div>
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
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Instruction")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.instruction || '-'}</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
