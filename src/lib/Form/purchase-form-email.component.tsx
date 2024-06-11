import React from 'react'
import './email-template.css'
import { PurchaseFormData } from './types'
import { getLocalDateString } from './util'
import classnames from 'classnames'
import { Attachment } from '../Types'
import { getFileIcon } from '../Inputs/utils.service'
import { mapCurrencyToSymbol } from '../util'
import { getSessionLocale } from '../sessionStorage'

export function PurchaseFormEmailTemplate (props: {data: PurchaseFormData}) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Software and Data purchases</h1>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Purchase request for</div></td>
            <td align="left"><div className="emailLabelValue" style={{ textTransform: 'capitalize' }}>{props.data.purchaseType || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Request type</div></td>
            <td align="left"><div className="emailLabelValue" style={{ textTransform: 'capitalize' }}>{props.data.requestType?.path || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      <div className="listHeadingBox">Products or subscriptions :</div>

          <table className="listBox">
            <thead>
              <tr className="marginB6">
                <th align="left" className="number"><div className="emailLabelText">#</div></th>
                <th align="left" className="name"><div className="emailLabelText">Product name</div></th>
                <th align="left" className="qty"><div className="emailLabelText">Quantity</div></th>
                <th align="left" className="price"><div className="emailLabelText">Total price</div></th>
                <th align="left" className="billing"><div className="emailLabelText">Billing</div></th>
              </tr>
            </thead>
            <tbody>
              { props.data.products && props.data.products.map((productLine, i) => {
                return (
                  <tr className={classnames("marginB6", "listItem", { last: (i+1) === props.data.products.length })} key={i}>
                    <td colSpan={5}>
                      <table>
                        <tbody>
                          <tr className="line">
                            <td align="left" className="number"><div className="emailLabelValue">{`${i + 1}.`}</div></td>
                            <td align="left" className="name"><div className="emailLabelValue">{productLine.product?.name || '-'}</div></td>
                            <td align="left" className="qty"><div className="emailLabelValue">{productLine.quantity || '-'}</div></td>
                            <td align="left" className="price"><div className="emailLabelValue">{`${mapCurrencyToSymbol(productLine.totalPrice?.currency)}${Number(productLine.totalPrice?.amount).toLocaleString(getSessionLocale())}` || '-'}</div></td>
                            <td align="left" className="billing"><div className="emailLabelValue">{productLine.billing?.displayName || productLine.billing?.path || '-'}</div></td>
                          </tr>
                          <tr>
                            <td />
                            <td align="left" colSpan={4}><div className="emailLabelValue description">{productLine.description || '-'}</div></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

      { props.data.additionalServices && props.data.additionalServices.length > 0 &&
        <div className="listHeadingBox">Additional services :</div>}

      { props.data.additionalServices && props.data.additionalServices.length > 0 &&
        <table className="listBox">
          <thead>
            <tr className="marginB6">
              <th align="left" className="number"><div className="emailLabelText">#</div></th>
              <th align="left" className="name"><div className="emailLabelText">Service</div></th>
              <th align="left" className="price"><div className="emailLabelText">Total price</div></th>
            </tr>
          </thead>
          <tbody>
          { props.data.additionalServices && props.data.additionalServices.map((service, i) => {
            return (
              <tr className={classnames("marginB6", "listItem", { last: (i+1) === props.data.additionalServices.length })} key={i}>
                <td align="left" className="number"><div className="emailLabelValue">{`${i + 1}.`}</div></td>
                <td align="left" className="name"><div className="emailLabelValue">{service.product?.name || '-'}</div></td>
                <td align="left" className="price"><div className="emailLabelValue">{`${mapCurrencyToSymbol(service.totalPrice?.currency)}${Number(service.totalPrice?.amount).toLocaleString(getSessionLocale())}` || '-'}</div></td>
              </tr>
            )
          })}
          </tbody>
        </table>}

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Timeline</div></td>
            <td align="left"><div className="emailLabelValue">{`${getLocalDateString(props.data.contractStart)} - ${getLocalDateString(props.data.contractEnd)}` || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      { props.data?.orderForm &&
        <>
          <tr>
            <td>
              <div className="fieldTitle">Order Form :</div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="emailQuotesAttachment">
                <table>
                  <tbody>
                    <tr>
                      <td width='32px'>
                        <div className="emailSvg">
                            <img src={getFileIcon((props.data.orderForm as Attachment)?.mediatype)} width="20px" height="24px" alt=""/>
                        </div>
                      </td>
                      <td>
                        <div className="emailQuotesAttachmentName">{(props.data.orderForm as Attachment)?.name || (props.data.orderForm as Attachment)?.filename}</div>
                        <div className="emailQuotesAttachmentDesc">{(props.data.orderForm as Attachment)?.note ? (props.data.orderForm as Attachment).note : ''}</div>
                      </td>
                      <td align="right">
                        <div className="emailQuotesAttachmentDate">
                            {(props.data.orderForm as Attachment)?.expiration ? getLocalDateString((props.data.orderForm as Attachment).expiration) : ''}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </>}

      { props.data?.quote &&
        <>
          <tr>
            <td>
              <div className="fieldTitle">Quote :</div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="emailQuotesAttachment">
                <table>
                  <tbody>
                    <tr>
                      <td width='32px'>
                        <div className="emailSvg">
                            <img src={getFileIcon((props.data.quote as Attachment)?.mediatype)} width="20px" height="24px" alt=""/>
                        </div>
                      </td>
                      <td>
                        <div className="emailQuotesAttachmentName">{(props.data.quote as Attachment)?.name || (props.data.quote as Attachment)?.filename}</div>
                        <div className="emailQuotesAttachmentDesc">{(props.data.quote as Attachment)?.note ? (props.data.quote as Attachment).note : ''}</div>
                      </td>
                      <td align="right">
                        <div className="emailQuotesAttachmentDate">
                            {(props.data.quote as Attachment)?.expiration ? getLocalDateString((props.data.quote as Attachment).expiration) : ''}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </>}

      <div className="emailHeadingSubBox">Budget details</div>
      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">User</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.user || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Department</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.department?.displayName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Business entity</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.companyEntity?.displayName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Account code</div></td>
            <td align="left"><div className="emailLabelValue">{props.data.accountCode?.displayName || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Estimated total cost</div></td>
            <td align="left"><div className="emailLabelValue">{`${mapCurrencyToSymbol(props.data.estimatedTotal?.currency)}${Number(props.data.estimatedTotal?.amount).toLocaleString(getSessionLocale())}` || '-'}</div></td>
          </tr>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Payment method</div></td>
            <td align="left"><div className="emailLabelValue" style={{ textTransform: 'capitalize' }}>{props.data.paymentMethod || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      <div className="emailHeadingSubBox">Brief business need</div>

      <div className="summaryBox">{props.data.summary || '-'}</div>
    </div>
  )
}
