import React from 'react'

import { ItSecurityFormData } from './types'
import './email-template.css'

export function ItSecurityFormEmail (props: { companyName: string, formData: ItSecurityFormData }) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">IT SECURITY - USER ACCESS</h1>

      <table className="complianceEmail">

        <tr><td>Employee login</td></tr>
        <tr>
          <td>
           <p>
              Will {props.companyName ? props.companyName : ''} employees login to the product or service?
            </p>
          </td>
          <td>
            <div className={props.formData.employeeLogin ? "yes" : "no"}>{props.formData.employeeLogin ? 'Yes' : 'No'}</div>
          </td>
        </tr>

        <tr><td>External user check</td></tr>
        <tr>
          <td>
            <p>
              Will non-employees such as contractors use this product or need access to other company systems to implement, setup or configure this product?
            </p>
          </td>
          <td>
            <div className={props.formData.externalUserCheck ? "yes" : "no"}>{props.formData.externalUserCheck ? 'Yes' : 'No'}</div>
          </td>
        </tr>
      </table>

    </div>
  )
}