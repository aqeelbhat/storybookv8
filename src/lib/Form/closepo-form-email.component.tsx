import React from 'react'
import { ClosePoFormReadOnlyProps } from '..'
import { PurchaseOrderBox } from './changepo-form.component'

import './email-template.css'

export function ClosePoFormEmail (props: ClosePoFormReadOnlyProps) {

  return (
    <div className="emailTemplate">

    <table>
        <tbody>
            <tr className="marginB6">
                <td align="left"><div className="emailLabelText">Reason for closing</div></td>
                <td align="left"><div className="emailLabelValue">{props.data?.reason || '-'}</div></td>
            </tr>
        </tbody>
    </table>

    {props.data?.purchaseOrder && <table>
        <tbody>
        <tr className="marginB6">
            <td align="left"><div className="emailSectionTitle"></div></td>
        </tr>
        <tr className="marginB6">
            <td align="left">
            <div className="emailLabelValue">
                <PurchaseOrderBox
                    data={props.data.purchaseOrder}
                    expanded={false}
                    minimal={true}
                />
            </div>
            </td>
        </tr>
        </tbody>
    </table>}
    </div>
  )
}
