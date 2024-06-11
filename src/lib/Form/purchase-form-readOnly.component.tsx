import React from 'react'
import { PurchaseFormData, TrackedAttributes} from './types'
import { getLocalDateString } from './util'

import './oro-form-read-only.css'
import classnames from 'classnames'
import { Attachment } from '../Types'
import { mapCurrencyToSymbol } from '../util'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { DateValue, mapCustomFieldValue, MoneyValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { getSessionLocale } from '../sessionStorage'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface PurchaseFormReadOnlyProps {
  data: PurchaseFormData,
  trackedAttributes?: TrackedAttributes,
  isSingleColumnLayout?: boolean,
  loadDocument?: (fieldName: string, type: string, fileName: string) => Promise<Blob>
}

export function PurchaseFormReadOnlyCompomnent (props: PurchaseFormReadOnlyProps) {
  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }
  const { t } = useTranslationHook([NAMESPACES_ENUM.PURCHASEFORM])

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t('--purchaseRequestFor--')}</div>
          <div className="value" style={{ textTransform: 'capitalize' }}>{mapCustomFieldValue({value: props.data.purchaseType, fieldName: 'purchaseType', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--requestType--')}</div>
          <div className="value" style={{ textTransform: 'capitalize' }}>{mapCustomFieldValue({value: props.data.requestType?.path, fieldName: 'requestType', fieldValue: 'path', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>
      </div>

      <div className="listTitle">{t('--productOrSubscriptionLabel--')}</div>

      { props.data.products &&
        <div className="listHeader">
          <div className="value number">{t('--serialNumber--')}</div>
          <div className="label name">{t('--productName--')}</div>
          <div className="label qty">{t('--quantity--')}</div>
          <div className="label price">{t('--totalPrice--')}</div>
          <div className="label billing">{t('--billing--')}</div>
        </div>}

      { props.data.products && props.data.products.map((productLine, i) => {
        return (
          <div className={classnames("listItem", { last: (i+1) === props.data.products.length })} key={i}>
            <div className="line">
              <div className="value number">{`${i + 1}.`}</div>
              <div className="value name">{productLine.product?.name || '-'}</div>
              <div className="value qty">{productLine.quantity || '-'}</div>
              <div className="value price">{`${mapCurrencyToSymbol(productLine.totalPrice?.currency)}${Number(productLine.totalPrice?.amount).toLocaleString(getSessionLocale())}` || '-'}</div>
              <div className="value billing">{productLine.billing?.displayName || productLine.billing?.path || '-'}</div>
            </div>
            <div className="line description">{productLine.description || '-'}</div>
          </div>
        )
      })}

      { props.data.additionalServices && props.data.additionalServices.length > 0 &&
          <div className="listTitle">{t('--additionalServices--')}</div>}

      { props.data.additionalServices && props.data.additionalServices.length > 0 &&
        <div className="listHeader">
          <div className="value number">{t('--serialNumber--')}</div>
          <div className="label name">{t('--service--')}</div>
          <div className="label price">{t('--totalPrice--')}</div>
        </div>}

      { props.data.additionalServices && props.data.additionalServices.map((service, i) => {
        return (
          <div className={classnames("listItem", { last: (i+1) === props.data.additionalServices.length })} key={i}>
            <div className="line">
              <div className="value number">{`${i + 1}.`}</div>
              <div className="value name">{service.product?.name || '-'}</div>
              <div className="value price">{`${mapCurrencyToSymbol(service.totalPrice?.currency)}${Number(service.totalPrice?.amount).toLocaleString(getSessionLocale())}` || '-'}</div>
            </div>
          </div>
        )
      })}

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t('--timeline--')}</div><div className="value">{DateValue({locale:getSessionLocale() ,value: props.data.contractStart, fieldName: 'contractStart', trackedAttributes: props.trackedAttributes, versionData: props.trackedAttributes})} - {DateValue({locale:getSessionLocale() ,value: props.data.contractEnd, fieldName: 'contractEnd', trackedAttributes: props.trackedAttributes, versionData: props.trackedAttributes})} </div></div>
      </div>

      { props.data?.orderForm &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t('--orderForm--')}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.orderForm as Attachment}
                onPreview={() => loadFile('orderForm', (props.data.orderForm as Attachment).mediatype, (props.data.orderForm as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      { props.data?.quote &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t('--quote--')}</div>
            <div className="value">
              <AttachmentReadOnly
                attachment={props.data.quote as Attachment}
                onPreview={() => loadFile('quote', (props.data.quote as Attachment).mediatype, (props.data.quote as Attachment).filename)}
              />
            </div>
          </div>
        </div>}

      <div className="sectionTitle">{t('--budgetDetails--')}</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t('--user--')}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.user, fieldName: 'user', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--department--')}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.department?.displayName, fieldName: 'department', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--businessEntity--')}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.companyEntity?.displayName, fieldName: 'companyEntity', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--accountCode--')}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.accountCode?.displayName, fieldName: 'accountCode', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--estimatedTotalAmount--')}</div>
          <div className="value">
            {`${mapCurrencyToSymbol(props.data.estimatedTotal?.currency)}${Number(props.data.estimatedTotal?.amount).toLocaleString(getSessionLocale())}` || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--paymentMethod--')}</div>
          <div className="value" style={{ textTransform: 'capitalize' }}>{mapCustomFieldValue({value: props.data.paymentMethod, fieldName: 'paymentMethod', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>
      </div>

      <div className="sectionTitle">{t('--briefBusinessNeed--')}</div>

      <div className="summary">{mapCustomFieldValue({value: props.data.summary, fieldName: 'summary', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
    </div>
  )
}
export function PurchaseFormReadOnly (props: PurchaseFormReadOnlyProps) {
  return <I18Suspense><PurchaseFormReadOnlyCompomnent {...props} /></I18Suspense>
}