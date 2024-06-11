import React from 'react'

import { IntellectualPropertyFormData } from './types'
import './email-template.css'

export function IntellectualPropertyFormEmail (props: { companyName: string, formData: IntellectualPropertyFormData }) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Intellectual Property</h1>

      <table className="complianceEmail">

        <tr><td>Company rights</td></tr>
        <tr>
          <td>
            <p>
              Will the supplier create intellectual property and by-products for this project which {props.companyName ? props.companyName : ''} needs to own?
              <span className="eg">(e.g Content, design, graphic, art work, infographic, software, survey or research reports)</span>
            </p>
          </td>
          <td>
            <div className={props.formData.companyRights ? "yes" : "no"}>{props.formData.companyRights ? 'Yes' : 'No'}</div>
          </td>
        </tr>

        <tr><td>Access to company IP & proprietary data</td></tr>
        <tr>
          <td>
            <p>
              Will this supplier be given access to {props.companyName ? `${props.companyName}'s` : ''} intellectual property, or proprietary data to deliver this project?
            </p>
          </td>
          <td>
          <div className={props.formData.accessToCompanyIP ? "yes" : "no"}>{props.formData.accessToCompanyIP ? 'Yes' : 'No'}</div>
          </td>
        </tr>

        <tr><td>Confidentiality</td></tr>
        <tr>
          <td>
            <p>
              Are you OK with the supplier referencing {props.companyName ? props.companyName : ''} by name as a client, using the {props.companyName ? props.companyName : ''} logo in customer references, websites or events?
            </p>
          </td>
          <td>
            <div className={props.formData.confidentiality ? "yes" : "no"}>{props.formData.confidentiality ? 'Yes' : 'No'}</div>
          </td>
        </tr>
      </table>

    </div>
  )
}