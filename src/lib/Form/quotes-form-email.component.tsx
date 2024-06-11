import React from 'react'
import { QuotesDetailReadonlyProps } from './types'
import './email-template.css'
import { getLocalDateString } from './util'
import { getFileIcon } from '../Inputs/utils.service'

export function QuotesFormEmailTemplate (props: {data?: QuotesDetailReadonlyProps}) { 
    return (
        <div className="emailTemplate">
            <table cellPadding={0} cellSpacing={0}>
                <tbody>
                    <tr>
                        <td>
                            <table cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td align="left" colSpan={2}>
                                            <h1 className="emailHeading">Quotes</h1>
                                        </td>
                                    </tr>
                                    <tr className="marginB6">
                                        <td align="left" width="70%">
                                            <div className="emailLabelText">Ask for legal review</div>
                                        </td>
                                        <td align="right" width="30%">
                                            <div className="emailLabelValue">{props.data.askForLegalReview ? 'Yes' : 'No'}</div>
                                        </td>
                                    </tr>
                                    <tr className="marginB6">
                                        <td align="left" width="70%">
                                            <div className="emailLabelText">Supplier payment term</div>
                                        </td>
                                        <td align="right" width="30%">
                                            <div className="emailLabelValue">{props.data?.paymentTerm && props.data?.paymentTerm?.name ? props.data.paymentTerm.name : '--'}</div>
                                        </td>
                                    </tr>
                                    {props.data?.proposals?.length > 0 && <tr>
                                        <td>
                                            <div className="emailHeadingSub">Supplier Doc</div>
                                        </td>
                                    </tr>}
                                    <tr>
                                        <td colSpan={2}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <tbody>
                                                                    {
                                                                        props.data.proposals.map((proposal, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <div className="emailQuotesAttachment">
                                                                                            <table>
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width='32px'>
                                                                                                            <div className="emailSvg">
                                                                                                                <img src={getFileIcon(proposal.mediatype)} width="20px" height="24px" alt=""/>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="emailQuotesAttachmentName">{proposal.filename || proposal.name}</div>
                                                                                                            <div className="emailQuotesAttachmentDesc">{proposal.note}</div>
                                                                                                        </td>
                                                                                                        <td align="right"><div className="emailQuotesAttachmentDate">{proposal.expiration ? getLocalDateString(proposal.expiration) : ''}</div></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    {props.data?.additionalDocs?.length > 0 && <tr>
                                        <td>
                                            <div className="emailHeadingSub">Additional Doc</div>
                                        </td>
                                    </tr>}
                                    <tr>
                                        <td colSpan={2}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table>
                                                                <tbody>
                                                                    {
                                                                        props.data.additionalDocs.map((additional, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <div className="emailQuotesAttachment">
                                                                                            <table>
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td width='32px'>
                                                                                                            <div className="emailSvg">
                                                                                                                <img src={getFileIcon(additional.mediatype)} width="20px" height="24px" alt=""/>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="emailQuotesAttachmentName">{additional.filename || additional.name}</div>
                                                                                                            <div className="emailQuotesAttachmentDesc">{additional.note}</div>
                                                                                                        </td>
                                                                                                        <td align="right"><div className="emailQuotesAttachmentDate">{additional.expiration ? getLocalDateString(additional.expiration) : ''}</div></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ) 
}