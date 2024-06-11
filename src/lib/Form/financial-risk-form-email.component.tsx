import React from 'react'

import { FinancialRiskFormData } from './types'
import './email-template.css'

export function FinancialRiskFormEmail (props: { companyName: string, formData: FinancialRiskFormData }) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Financial Risk</h1>

      <table className="complianceEmail">
        <tr>
          <td>1.</td>
          <td>
            <p>
              Does the agreement require {props.companyName ? props.companyName : ''} to have insurance?
            </p>
          </td>
          <td>
            <div className={props.formData.companyLiability ? "yes" : "no"}>{props.formData.companyLiability ? 'Yes' : 'No'}</div>
          </td>
        </tr>

        <tr>
          <td>2.</td>
          <td>
            <p>
              Does the agreement require the supplier to have insurance?
            </p>
          </td>
          <td>
            <div className={props.formData.supplierLiability ? "yes" : "no"}>{props.formData.supplierLiability ? 'Yes' : 'No'}</div>
          </td>
        </tr>
      </table>

    </div>
  )
}