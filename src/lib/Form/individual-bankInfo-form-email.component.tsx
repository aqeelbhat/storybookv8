import React from 'react'
import { BankKey } from '../Types'
import './email-template.css'
import { BankInfoFormData, EnumsDataObject } from './types'
import { convertAddressToString } from './util'

export function IndividualBankInfoFormEmailTemplate (props: {data: BankInfoFormData, bankKeys?: EnumsDataObject[]}) {

  function getBankKeyName (key: BankKey): string {
    return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
  }

  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Bank Information</h1>
      <div className="emailHeadingSubBox">Remittance details</div>
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Payment/Remittance currency</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.currencyCode?.displayName || '-'}</div></td>
          </tr>
        </tbody>
      </table>
      <div className="emailHeadingSubBox">Bank details</div>
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Bank name</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.bankName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Bank Address</div></td>
            <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.bankInformation?.bankAddress) || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{getBankKeyName(props.data.bankInformation?.key) || "Bank code"}</div></td>
            <td align="left"><div className="emailLabelValue">
              { (props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                (props.data.bankInformation?.encryptedBankCode?.maskedValue || '*****')}

              { props.data.bankInformation?.bankCode && !(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                (props.data.bankInformation?.bankCode || '-')}
            </div></td>
          </tr>
          { props.data.bankInformation?.internationalKey &&
            (props.data.bankInformation?.internationalCode && (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)) &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getBankKeyName(props.data.bankInformation?.internationalKey) || "International bank code"}</div></td>
              <td align="left"><div className="emailLabelValue">
                {props.data.bankInformation?.internationalCode || '-'}

                { (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                  (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || '*****')}

                { props.data.bankInformation?.internationalCode && !(props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                  (props.data.bankInformation?.internationalCode || '-')}
              </div></td>
            </tr>}
          {!props.data?.bankInformation?.omitAccountNumber && (props.data.bankInformation?.accountNumber?.maskedValue || props.data.bankInformation?.accountNumber?.unencryptedValue) &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Bank account number</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.accountNumber?.maskedValue || '*****'}</div></td>
            </tr>}
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Account Holder</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.accountHolder || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Recipient address</div></td>
            <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.bankInformation?.accountHolderAddress) || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      { props.data.intermediaryBankRequired &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Intermediary bank name</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.intermediaryBankInformation?.bankName || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Intermediary bank address</div></td>
              <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.intermediaryBankInformation?.bankAddress) || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getBankKeyName(props.data.intermediaryBankInformation?.key) || "Bank code"}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.intermediaryBankInformation?.bankCode || '-'}</div></td>
            </tr>
          </tbody>
        </table>}

      <div className="emailHeadingSubBox">Instructions</div>

      <div className="summaryBox">{props.data.instruction || '-'}</div>
    </div>
  )
}