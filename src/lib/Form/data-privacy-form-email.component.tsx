import React from 'react'

import { DataPrivacyFormData } from './types'
import './email-template.css'

export function DataPrivacyFormEmail (props: { formData: DataPrivacyFormData, isLocalizationEnabled?: boolean }) {
  
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">DATA PRIVACY</h1>

      <table className="complianceEmail">

        <tr><td>Personal Identifiable Information (PII)</td></tr>
        <tr>
          <td>
           <p>
           Does your current project or planned future use of this supplier’s product and/or services involve access to personal identifiable information(PII) that can be used to identify an individual ‘natural’ person?
              <span className="eg">(e.g. Name, Address, Email, Phone Number, any data that can identify an individual)</span>
            </p>
          </td>
          <td>
            <div className={props.formData.personalIdentifiableInf ? "yes" : "no"}>{props.formData.personalIdentifiableInf ? "Yes" : "No"}</div>
          </td>
        </tr>

        <tr><td>GDPR compliance check for EU</td></tr>
        <tr>
          <td>
            <p>
            Is there any planned or potential use of personal identifiable information (PII) data being used in this project going to / coming from the European Union?
            </p>
          </td>
          <td>
            <div className={props.formData.localRegulatoryEU ? "yes" : "no"}>{props.formData.localRegulatoryEU ? "Yes" : "No"}</div>
          </td>
        </tr>

        <tr><td>PII compliance check for California</td></tr>
        <tr>
          <td>
            <p>
            Is there any planned or potential use of personal identifiable information (PII) data being used in this project going to / coming from California?
            </p>
          </td>
          <td>
          <div className={props.formData.localRegulatoryCalifornia ? "yes" : "no"}>{props.formData.localRegulatoryCalifornia ? "Yes" : "No"}</div>
          </td>
        </tr>
      </table>

    </div>
  )
}