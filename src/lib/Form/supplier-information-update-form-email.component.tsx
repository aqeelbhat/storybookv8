import React from 'react'
import { mapCurrencyToSymbol } from '../util'
import './email-templateV2.css'
import { OroSupplierInformationUpdateForm } from './types'
import { convertNumberToKM } from './util'

export function SupplierInformationUpdateEmailTemplate (props: {data: OroSupplierInformationUpdateForm}) {
  return (
    <div className="emailForm">
      <h1 className="formTitle">Vendor details</h1>
      <table>
        <tbody>
          <tr>
            <td className="formQuestion">Is the request for an existing vendor?</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data?.isNewSupplier ? `No` : `Yes`}</td>
          </tr>
          <tr>
            <td className="formQuestion">Vendor Name</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data?.companyName || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Vendor Country</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data?.vendorCountry || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Annual Spend/Contract Value (whichever is higher)</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data?.spend ? `${mapCurrencyToSymbol(props.data.spend.currency)}${convertNumberToKM(props.data.spend?.amount)}` : '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Tax/Registration ID</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data?.taxRegistrationID || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Vendor website</td>
          </tr>
          <tr>
            <td className="formAnswer">{props.data.companyDomain || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}