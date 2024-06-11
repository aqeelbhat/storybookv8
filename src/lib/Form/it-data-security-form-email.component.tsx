import React from 'react'

import { ItDataSecurityFormData } from './types'
import './email-template.css'

export function ItDataSecurityFormEmail (props: { companyName: string, formData: ItDataSecurityFormData }) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">IT SECURITY - DATA ACCESS & SYSTEM INTEGRATION</h1>

      <table className="complianceEmail">
        
      <tr><td>Company sensitive data</td></tr>
        <tr>
          <td>
            <p>
              Will the use of this supplier’s product and/or services need access to {props.companyName ? props.companyName : ''} sensitive company data?
              <span className="eg">(e.g. Customer details, Finance data or Employee data)</span>
            </p>
          </td>
          <td>
            <div className={props.formData.companySensitiveData ? "yes" : "no"}>{props.formData.companySensitiveData ? 'Yes' : 'No'}</div>
          </td>
        </tr>

        <tr><td>System integration</td></tr>
        <tr>
          <td>
            <p>
              Will this supplier’s product and/or services integrate with or access data from business-critical systems at {props.companyName ? props.companyName : ''}?
              <span className="eg">(e.g. Salesforce, Marketo, Gainsight, Netsuite, SuccessFactors)</span>
            </p>
          </td>
          <td>
          <div className={props.formData.systemAccessCheck ? "yes" : "no"}>{props.formData.systemAccessCheck ? 'Yes' : 'No'}</div>
          </td>
        </tr>
      </table>

    </div>
  )
}