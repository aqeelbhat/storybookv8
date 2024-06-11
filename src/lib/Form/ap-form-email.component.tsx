import React from 'react'
import { APFormData, VENDOR_CREATION_METHOD_MANUAL, VENDOR_CREATION_METHOD_SYSTEM } from './types'

import './email-template.css'
import { Field, getFormFieldConfig } from '.'

export function APFormEmail (props: {data: APFormData,fields?: Field[]}) {
  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields)?.customLabel || ''
  }
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">AP review outcome</h1>

      {props.data.method?.path === VENDOR_CREATION_METHOD_SYSTEM &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('CompanyEntity') || "Primary business entity"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.companyEntity?.displayName || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('additionalCompanyEntities') || "Additional business entity"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.additionalCompanyEntities?.map(entity => entity.displayName).join(', ') || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('eligible1099') || "1099 eligible"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.eligible1099 ? 'Yes' : 'No'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('syncToProcurement') || "Sync to procurify"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.syncToProcurement ? 'Yes' : 'No'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('paymentTerms') || "Payment terms "}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.paymentTerms?.displayName || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('currency') || "Primary currency"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.currency?.displayName || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('expenseAccount') || "Default expense account"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.expenseAccount?.displayName || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('classification') || "Supplier classification"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.classification?.displayName || '-'}</div></td>
            </tr>
          </tbody>
        </table>}

      {props.data.method?.path === VENDOR_CREATION_METHOD_MANUAL &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getFieldLabelFromConfig('vendorId') || "Vendor ID"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.vendorId || '-'}</div></td>
            </tr>
          </tbody>
        </table>}
    </div>
  )
}
