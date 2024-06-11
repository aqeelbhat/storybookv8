import React from 'react'
import { mapCurrencyToSymbol } from '../util'
import './email-template.css'
import { ProjectFormData } from './types'
import { getLocalDateString } from './util'
import { getSessionLocale } from '../sessionStorage'

export function ProjectFormEmailTemplate (props: {data: ProjectFormData, previousFormData?: ProjectFormData | null}) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Project details</h1>
      <table>
        <tbody>
          { props.data.marketingProgram?.displayName &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Marketing program</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.marketingProgram?.displayName || '-'}</div></td>
            </tr>}
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Allocadia ID</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.allocadiaId || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Target region</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.region?.displayName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Timeline</div></td>
            <td align="left"><div className="emailLabelValue">{`${getLocalDateString(props.data.startDate)} - ${getLocalDateString(props.data.endDate)}`}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Service</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.service?.map(service => service.displayName).join(', ') || '-'}</div></td>
          </tr>
        </tbody>
      </table>
      <div className="emailHeadingSubBox">Budget details</div>
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Estimated total cost</div></td>
            <td align="left">
              <div className="emailLabelValue">
              {`${mapCurrencyToSymbol(props.data.estimatedCost?.currency)}${Number(props.data.estimatedCost?.amount).toLocaleString(getSessionLocale())}` || '-'}
              { props.previousFormData && props.previousFormData.estimatedCost && props.previousFormData.estimatedCost?.amount !== props.data.estimatedCost?.amount &&
                <div className="valuePrevious">{`${mapCurrencyToSymbol(props.previousFormData.estimatedCost?.currency)}${Number(props.previousFormData.estimatedCost?.amount).toLocaleString(getSessionLocale())}` || '-'}</div>
              }
              </div>
            </td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Business entity</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.subsidiary?.displayName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Account code</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.accountCode?.displayName || '-'}</div></td>
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
      <div className="emailHeadingSubBox">Brief project summary</div>
      <div className="summaryBox">{props.data.summary || '-'}</div>
    </div>
  )
}
