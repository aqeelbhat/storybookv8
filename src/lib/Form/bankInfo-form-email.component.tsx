import React from 'react'
import { BankKey } from '../Types'
import './email-template.css'
import { BankInfoFormData, EnumsDataObject } from './types'
import { convertAddressToString } from './util'
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";

export function BankInfoFormEmailTemplate (props: {data: BankInfoFormData, bankKeys?: EnumsDataObject[]}) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  function getBankKeyName (key: BankKey): string {
    return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
  }

  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">{t("Bank Information")}</h1>
      <div className="emailHeadingSubBox">{t("Remittance details")}</div>
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Accounts receivable email")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.businessEmail || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Payment/Remittance currency")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.currencyCode?.displayName || '-'}</div></td>
          </tr>
        </tbody>
      </table>
      <div className="emailHeadingSubBox">{t("Bank details")}</div>
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Bank name")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.bankName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Bank address")}</div></td>
            <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.bankInformation?.bankAddress) || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{getBankKeyName(props.data.bankInformation?.key) || t("Bank code")}</div></td>
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
              <td align="left"><div className="emailLabelText">{getBankKeyName(props.data.bankInformation?.internationalKey) || t("International Bank Code")}</div></td>
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
              <td align="left"><div className="emailLabelText">{t("Account number")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.accountNumber?.maskedValue || '*****'}</div></td>
            </tr>}
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Beneficiary name")}</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.bankInformation?.accountHolder || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{t("Remittance address")}</div></td>
            <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.bankInformation?.accountHolderAddress) || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      { props.data.intermediaryBankRequired &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{t("Intermediary bank name")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.intermediaryBankInformation?.bankName || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{t("Intermediary bank address")}</div></td>
              <td align="left"><div className="emailLabelValue">{convertAddressToString(props.data.intermediaryBankInformation?.bankAddress) || '-'}</div></td>
            </tr>
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">{getBankKeyName(props.data.intermediaryBankInformation?.key) || t("Intermediary bank code")}</div></td>
              <td align="left"><div className="emailLabelValue">{props.data.intermediaryBankInformation?.bankCode || '-'}</div></td>
            </tr>
          </tbody>
        </table>}

      <div className="emailHeadingSubBox">{t("Instructions")}</div>

      <div className="summaryBox">{props.data.instruction || '-'}</div>
    </div>
  )
}