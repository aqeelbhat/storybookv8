/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from 'react'
import { SupplierPaymentDetailsFormProps } from '../BankInfoV3/types'

import './../email-template.css'
import { mapBankAddress } from '../util'

export function SupplierPaymentDetailsEmailTemplate (props: SupplierPaymentDetailsFormProps) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Bank Information</h1>

      {props.formData.businessEmail && <>
        <div className="emailHeadingSubBox">Remittance details</div>

        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Accounts receivable email</div></td>
              <td align="left"><div className="emailLabelValue">{props.formData.businessEmail || '-'}</div></td>
            </tr>
          </tbody>
        </table>
      </>}

      <div className="listBox"></div>

      {props.formData?.paymentDetails?.length > 0 && props.formData?.paymentDetails.map((paymentDetail, i) =>
        <table key={i}>
          <tbody>
              <tr className="marginB6">
                <td align="left">
                  <div className="emailLabelText lineItemsLabel">Payment option {(props.formData?.paymentDetails.length > 1) ? `#${i+1}` : ''}</div>
                </td>
              </tr>
              <tr className="marginB6">
                <td align="left">
                  <div className="emailLabelValue">
                    {[
                      paymentDetail?.bankInformation?.bankName || paymentDetail?.bankInformation?.accountHolder || '-',
                      props.countryOptions?.find(entry => entry.path === mapBankAddress(paymentDetail?.bankInformation?.bankAddress)?.alpha2CountryCode)?.displayName || paymentDetail?.bankInformation?.bankAddress?.alpha2CountryCode || '-'
                    ].join(', ')}
                  </div>
                </td>
              </tr>
              <tr className="marginB6">
                <td align="left">
                  <div className="emailLabelValue">
                    <span className="tableTitle typography6">Entities: </span>
                    <span className='typography6' style={{color:'#283041'}}>{paymentDetail?.companyEntities?.map(entity => entity.displayName)?.join(', ') || '-'}</span>
                  </div>
                </td>
              </tr>
          </tbody>
        </table>)}

      <div className="emailHeadingSubBox">Additional comments</div>

      <div className="summaryBox">{props.formData.instruction || '-'}</div>
    </div>
  )
}
