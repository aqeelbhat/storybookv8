import React from 'react'

import './../email-template.css'

import { SupplierProposalProps } from './types'
import { DateValue, MoneyValue } from '../../CustomFormDefinition'
import { mapMoney } from '../../Types'

export function SupplierProposalEmail (props: SupplierProposalProps) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Proposal Details</h1>

      <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Supplier Legal Name</div></td>
              <td align="left"><div className="emailLabelValue">{props.formData?.supplierLegalName || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Deascription</div></td>
              <td align="left"><div className="emailLabelValue">{props.formData?.description || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Delivery Date</div></td>
              <td align="left"><div className="emailLabelValue"><DateValue value={props.formData?.deliveryDate} locale={'en'} /></div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Total Amount</div></td>
              <td align="left"><div className="emailLabelValue"><MoneyValue value={mapMoney(props.formData?.totalAmount)} locale={'en'} /></div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Supplier Country</div></td>
              <td align="left"><div className="emailLabelValue">{props.formData?.country || '-'}</div></td>
            </tr>

            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Payment Term</div></td>
              <td align="left"><div className="emailLabelValue">{props.formData?.paymentTerm?.displayName || '-'}</div></td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}
