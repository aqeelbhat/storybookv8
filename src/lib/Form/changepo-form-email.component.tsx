import React from 'react'
import { ItemListConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { ItemList } from '../Inputs/itemList.component'
import { getFileIcon } from '../Inputs/utils.service'
import { Attachment, mapMoney,Option } from '../Types'
import { mapCurrencyToSymbol } from '../util'
import { ChangePoFormReadOnlyProps } from './changepo-form-readOnly.component'
import { getTotalPriceDisplayText, PurchaseOrderBox } from './changepo-form.component'
import { getFormattedAmountValue, getLocalDateString } from './util'

import './email-template.css'

const METHOD_OPTIONS: Option[] = [
  { id: 'addItem', path: 'addItem', displayName: 'Add amount / update timelines' },
  { id: 'editItems', path: 'editItems', displayName: 'Edit PO line items' }
]
export function ChangePoFormEmail (props: ChangePoFormReadOnlyProps) {
  function getLineItemConfig (fieldName: string): ItemListConfig| undefined {
    if (Array.isArray(props.fields)) {
      const field = props.fields.find(field => field.fieldName === fieldName)
      return field?.itemConfig
    } else {
      return undefined
    }
  }

  return (
    <div className="emailTemplate">
      <h2 className="emailHeading">Change PO</h2>

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailSectionTitle">{METHOD_OPTIONS.find(option => option.path === props.data?.method)?.displayName || '-'}</div></td>
          </tr>

          { props.data?.method === 'addItem' && <>
            {(props.data?.startDate || props.data?.endDate) &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Extend Timeline</div></td>
              <td align="left">
                <div className="emailLabelValue">{`${getLocalDateString(props.data?.startDate)} - ${getLocalDateString(props.data?.endDate)}`}</div>
                { (props.data?.purchaseOrder?.itemList?.items?.[0]?.startDate || props.data?.purchaseOrder?.itemList?.items?.[0]?.endDate) &&
                  (`${getLocalDateString(props.data?.startDate)} - ${getLocalDateString(props.data?.endDate)}` !== `${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.startDate)} - ${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.endDate)}`) &&
                  <div className="valueCurrent">Current Timeline: {`${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.startDate)} - ${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.endDate)}`}</div>}
              </td>
            </tr>}

            {props.data?.additionalAmount?.amount &&
            <tr className="marginB6">
              <td align="left"><div className="emailLabelText">Additional amount</div></td>
              <td align="left">
                <div className="emailLabelValue">{getFormattedAmountValue(props.data?.additionalAmount && mapMoney(props.data?.additionalAmount))}</div>
                { (getTotalPriceDisplayText(props.data?.purchaseOrder) !== '-') &&
                  (getFormattedAmountValue(props.data?.additionalAmount && mapMoney(props.data?.additionalAmount)) !== getTotalPriceDisplayText(props.data?.purchaseOrder)) &&
                  <div className="valueCurrent">Current PO Total: {getTotalPriceDisplayText(props.data?.purchaseOrder)}</div>}
              </td>
            </tr>}
          </>}
        </tbody>
      </table>

      { props.data?.method === 'editItems' &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left">
                <div className="emailLabelValue">
                  <ItemList
                    value={props.data?.poLineItems}
                    oldValue={props.data?.purchaseOrder?.itemList}
                    fieldName={'poLineItems'}
                    config={getLineItemConfig('poLineItems')}
                    required={true}
                    disabled={true}
                    defaultCurrency={props.defaultCurrency}
                    currencyOptions={props.currencyOptions}
                    categoryOptions={props.categoryOptions}
                    accountCodeOptions={props.accountCodeOptions}
                    costCenterOptions={props.costCenterOptions}
                    unitPerQtyOptions={props.unitPerQtyOptions}
                    itemIdsOptions={props.itemIdOptions}
                    trackCodeOptions={props.trackCodeOptions}
                    lineOfBusinessOptions={props.lineOfBusinessOptions}
                    locationOptions={props.locationOptions}
                    projectOptions={props.projectOptions}
                    expenseCategoryOptions={props.expenseCategoryOptions}
                    purchaseItemOptions={props.purchaseItemOptions}
                    defaultAccountCode={props.defaultAccountCode}
                    getDoucumentByPath={props.getDoucumentByPath}
                    getDocumentByName={props.loadDocument}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>}

        { props.data?.method === 'editItems' && props.data?.expenseLineItems?.items?.length > 0 &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left">
                <div className="emailLabelValue">
                  <ItemList
                    value={props.data?.expenseLineItems}
                    oldValue={props.data?.purchaseOrder?.expenseItemList}
                    fieldName={'expenseLineItems'}
                    config={getLineItemConfig('expenseLineItems')}
                    required={true}
                    disabled={true}
                    defaultCurrency={props.defaultCurrency}
                    currencyOptions={props.currencyOptions}
                    categoryOptions={props.categoryOptions}
                    costCenterOptions={props.costCenterOptions}
                    accountCodeOptions={props.accountCodeOptions}
                    unitPerQtyOptions={props.unitPerQtyOptions}
                    itemIdsOptions={props.itemIdOptions}
                    trackCodeOptions={props.trackCodeOptions}
                    lineOfBusinessOptions={props.lineOfBusinessOptions}
                    locationOptions={props.locationOptions}
                    projectOptions={props.projectOptions}
                    expenseCategoryOptions={props.expenseCategoryOptions}
                    purchaseItemOptions={props.purchaseItemOptions}
                    defaultAccountCode={props.defaultAccountCode}
                    getDoucumentByPath={props.getDoucumentByPath}
                    getDocumentByName={props.loadDocument}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>}

      <table>
        <tbody>
          <tr className="marginB6">
            <td align="left"><div className="emailLabelText">Reason for amendment</div></td>
            <td align="left"><div className="emailLabelValue">{props.data?.reason || '-'}</div></td>
          </tr>
        </tbody>
      </table>

      {props.data?.attachments?.length > 0 &&
        <table>
            <tbody>
              <tr>
                <td align="left"><div className="emailLabelText lineItemsLabel">Attachments</div></td>
              </tr>
                {props.data?.attachments?.length > 0 && props.data.attachments.map((doc, index) =>
                  <tr key={index}>
                    <td colSpan={2}>
                      <div className="emailQuotesAttachment">
                        <table>
                          <tbody>
                            <tr>
                              <td width='32px'>
                                <div className="emailSvg">
                                  <img src={getFileIcon((doc as Attachment).mediatype)} width="20px" height="24px" alt=""/>
                                </div>
                              </td>
                              <td>
                                <div className="emailQuotesAttachmentName">{(doc as Attachment).name || (doc as Attachment).filename}</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
        </table>}

      { props.data?.method === 'addItem' &&
        <table>
          <tbody>
            <tr className="marginB6">
              <td align="left"><div className="emailSectionTitle"></div></td>
            </tr>
            <tr className="marginB6">
              <td align="left">
                <div className="emailLabelValue">
                  <PurchaseOrderBox
                    data={props.data.purchaseOrder}
                    expanded={true}
                    poLineItemConfig={getLineItemConfig('poLineItems')}
                    expenseItemConfig={getLineItemConfig('expenseLineItems')}
                    defaultCurrency={props.defaultCurrency}
                    currencyOptions={props.currencyOptions}
                    categoryOptions={props.categoryOptions}
                    accountCodeOptions={props.accountCodeOptions}
                    unitPerQtyOptions={props.unitPerQtyOptions}
                    poItemIdOptions={props.itemIdOptions}
                    expenseIdOptions={props.itemIdOptions}
                    trackCodeOptions={props.trackCodeOptions}
                    lineOfBusinessOptions={props.lineOfBusinessOptions}
                    locationOptions={props.locationOptions}
                    projectOptions={props.projectOptions}
                    expenseCategoryOptions={props.expenseCategoryOptions}
                    purchaseItemOptions={props.purchaseItemOptions}
                    defaultAccountCode={props.defaultAccountCode}
                    getDoucumentByPath={props.getDoucumentByPath}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>}
    </div>
  )
}
