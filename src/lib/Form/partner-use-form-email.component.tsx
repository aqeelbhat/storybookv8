import React from 'react'
import { PartnerUseFormData } from './types'

import './email-template.css'

export function PartnerUseFormEmail (props: {data: PartnerUseFormData}) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Use</h1>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Title</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.title || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Region or country partner is used</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.region?.displayName || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Services offered by the partner</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.service?.map(service => service.displayName).join(', ') || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Business entity</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.subsidiary?.displayName || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Additional subsidary</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.additionalSubsidiary?.map(susidiary => susidiary.displayName).join(', ') || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">User</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.user || '-'}</div></td>
          </tr>

          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Department</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.department?.displayName || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      <div className="emailHeadingSubBox">Comment / Details</div>

      <div className="summaryBox">{props.data.comment || '-'}</div>
    </div>
  )
}
