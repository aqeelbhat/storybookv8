import { IDRef, mapMoney } from "../../Types";
import { ItemTypeOption, PaymentProviderConfirmationData, PaymentProviderConfirmationProps } from "./type";
import './../email-template.css'
import React from "react";
import { getSessionLocale } from "../../sessionStorage";
import { MoneyValue } from "../../CustomFormDefinition";
import { Option } from "../../Types"

export interface PaymentProviderConfirmationEmailProps {
  formData?: PaymentProviderConfirmationData
  partnerName?: string
  partnerEmail?: string
  categoryOptions?: Option[]
  currencyOptions?: Option[]
  defaultCurrency?: string
}

export function PaymentProviderConfirmationEmailTemplate (props:PaymentProviderConfirmationEmailProps) {
  function getCategoryText (values: Array<IDRef>) {
      const text = ''
      if (Array.isArray(values)) {
        return values.map(idRef => {
          const option = props.categoryOptions.find(option => option.path === idRef.id)
          return option?.displayName || idRef.name
        }).join(', ')
      }
      return text
    }
    
  return (
    <div className="emailTemplate">
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Purchasing through</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><h1 className="emailHeading">Candex</h1></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">{props.formData?.buyerChannelDetails?.description}</div></td>
          </tr>
        </tbody>
      </table>

      <div className="listBox"></div>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Supplier</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelValue">{props.partnerName || '-'}</div></td>
            <td align="left"><div className="emailLabelText">({props.partnerEmail})</div></td>
          </tr>
        </tbody>
      </table>

      <div className="listBox"></div>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Type of purchase</div></td>
            <td align="left"><div className="emailLabelValue">{ItemTypeOption.find(ItemType => ItemType.id === props.formData?.items?.[0]?.type)?.displayName}</div></td>
          </tr>
          <div className="listBox"></div>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Quantity</div></td>
            <td align="left"><div className="emailLabelValue">{Number(props.formData?.items?.[0]?.quantity).toLocaleString(getSessionLocale())}</div></td>
          </tr>
          <div className="listBox"></div>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Purchasing Category</div></td>
            <td align="left"><div className="emailLabelValue">{getCategoryText(props.formData?.items?.[0]?.categories)}</div></td>
          </tr>
          <div className="listBox"></div>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Description</div></td>
            <td align="left"><div className="emailLabelValue">{props.formData?.items?.[0]?.description || '-'}</div></td>
          </tr>
          <div className="listBox"></div>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Amount</div></td>
            <tr className="marginB6">
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">Supplier Gets</div></td>
                <td align="left"><div className="emailLabelValue"><MoneyValue value={mapMoney(props.formData?.originalAmount)} locale={getSessionLocale()} /></div></td>
              </tr>
              <tr className="marginB6">
                <td align="left"><div className="emailLabelText">You pay</div></td>
                <td align="left"><div className="emailLabelValue"><MoneyValue value={mapMoney(props.formData?.totalAmount)} locale={getSessionLocale()} /></div></td>
              </tr>
            </tr>
          </tr> 
        </tbody>
      </table>
    </div>
  )
}