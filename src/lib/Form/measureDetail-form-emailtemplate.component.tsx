/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useState } from 'react'
import { MeasureDetailsFormData, MeasureDetailReadonlyProps, StandardPriority } from './types'
import './email-template.css'
import { getFileIcon } from '../Inputs/utils.service'
import { Attachment } from '../Types'
import { mapCurrencyToSymbol } from '../util'
import { Linkify } from '../Linkify'
import { getSessionLocale } from '../sessionStorage'

export function MeasureDetailEmailtemplate (props: MeasureDetailReadonlyProps) {
  const [measureData, setMeasureData] = useState<MeasureDetailsFormData | null>(null)

  useEffect(() => {
      if (props.formData) {
        setMeasureData(props.formData)
      }
  }, [props.formData])

  return (
    <Linkify>
        <div className="emailTemplate">
            <h2 className="emailHeading">Basic information</h2>
            <table>
                <tbody>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Name</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.name || ''}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Contains sensitive information</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.sensitive ? 'Yes' : 'No'}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">High priority measure</div></td>
                        <td align="left"><div className="emailLabelValue">{props.formData.priority === StandardPriority.high ? 'Yes' : 'No'}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Type</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.type?.displayName || ''}</div></td>
                    </tr>
                    {props.isEbitRequest &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">{ props.formData.ebitLabel || 'EBIT' } Estimate</div></td>
                            <td align="left">
                                <div className="emailLabelValue">
                                    {`${mapCurrencyToSymbol(measureData?.estimate?.currency)}${Number(measureData?.estimate?.amount).toLocaleString(getSessionLocale())}K` || ''}
                                </div>
                            </td>
                        </tr>}
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Workstream</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.workstream?.displayName || ''}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">ID</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.id || ''}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Owner</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.owner?.displayName}</div></td>
                    </tr>
                </tbody>
            </table>

            <div className="emailHeadingSubBox">Description</div>
            <div className="summaryBox"><pre>{measureData?.other || ''}</pre></div>
            <div className="emailHeadingSubBox">Business Case and Other Documents</div>
            <table>
                <tbody>
                    {measureData?.additionalDocs?.length > 0 && measureData.additionalDocs.map((doc, index) =>
                        <tr key={index}>
                            <td colSpan={2}>
                            <div className="emailQuotesAttachment">
                                <table>
                                <tbody>
                                    <tr>
                                    <td width='32px'>
                                        <div className="emailSvg">
                                            <img src={getFileIcon((doc as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="emailQuotesAttachmentName">{(doc as Attachment).name || (doc as Attachment).filename}</div>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
            <div className="summaryBox"><pre>{measureData?.docUrls || ''}</pre></div>

            <table>
                <tbody>
                    { props.formData?.businessRegion?.displayName &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">Region</div></td>
                            <td align="left"><div className="emailLabelValue">{props.formData?.businessRegion?.displayName || ''}</div></td>
                        </tr>}
                    { props.formData?.financialImpactType?.displayName &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">{ props.formData?.ebitLabel || 'EBIT'} impact type</div></td>
                            <td align="left"><div className="emailLabelValue">{props.formData?.financialImpactType?.displayName || ''}</div></td>
                        </tr>}
                    { measureData?.businessSegments && measureData?.businessSegments.length > 0 &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">Business Segment</div></td>
                            <td align="left"><div className="emailLabelValue">{measureData?.businessSegments?.map(segment => segment.displayName).join(', ') || ''}</div></td>
                        </tr>}
                    { props.formData?.workArea?.displayName &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">Work area</div></td>
                            <td align="left"><div className="emailLabelValue">{props.formData?.workArea?.displayName || ''}</div></td>
                        </tr>}
                    { measureData?.locations && measureData?.locations.length > 0 &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">Sites</div></td>
                            <td align="left"><div className="emailLabelValue">{measureData?.locations?.map(location => location.displayName).join(', ') || ''}</div></td>
                        </tr>}
                    { measureData?.impactCategory?.displayName &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">Impact Category</div></td>
                            <td align="left"><div className="emailLabelValue">{measureData?.impactCategory?.displayName || ''}</div></td>
                        </tr>}
                    {!props.disableSupplier && <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Supplier</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.supplier?.displayName || ''}</div></td>
                    </tr>}
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Related Measures</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.relatedMeasures?.map(measure => measure.displayName).join(', ') || ''}</div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Linkify>
  )
}
