import React, { useEffect, useState } from 'react'
import { DataFetchers, Events, FieldOptions } from '../CustomFormDefinition/NewView/FormView.component'
import { ItemListConfig, ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { ObjectSelector } from '../Inputs'
import { ItemList } from '../Inputs/itemList.component'
import { Attachment, IDRef, mapMoney, Option, PurchaseOrder } from '../Types'
import { mapCurrencyToSymbol } from '../util'
import { ChangePoFormData, getTotalPriceDisplayText, poObjectConfig, PurchaseOrderBox } from './changepo-form.component'
import { AttachmentReadOnly } from './components/attachment-read-only.component'

import './oro-form-read-only.css'
import { Field } from './types'
import { getFormattedAmountValue, getLocalDateString } from './util'
import { CustomFormDefinition, FormDefinitionReadOnlyView, LocalLabels, getFormFieldConfig } from '..'
import { getSessionLocale } from '../sessionStorage'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export interface ChangePoFormReadOnlyProps {
  data?: ChangePoFormData
  fields?: Field[]
  defaultCurrency?: string
  currencyOptions?: Option[]
  categoryOptions?: Option[]
  departmentOptions?: Option[]
  accountCodeOptions?: Option[]
  unitPerQtyOptions?: Option[]
  costCenterOptions?: Option[]
  itemIdOptions?: Option[]
  trackCodeOptions?: Option[]
  lineOfBusinessOptions?: Option[]
  locationOptions?: Option[]
  projectOptions?: Option[]
  expenseCategoryOptions?: Option[]
  purchaseItemOptions?: Option[]
  defaultAccountCode?: IDRef
  isSingleColumnLayout?: boolean
  options?: FieldOptions
  events?: Events
  dataFetchers?: DataFetchers
  getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  loadDocument?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob>
  getPO?: (id: string) => Promise<PurchaseOrder>
}

export function ChangePoFormReadOnlyComponent (props: ChangePoFormReadOnlyProps) {
  const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)
  const [localLabels, setLocalLabels] = useState<LocalLabels | null>(null)
  const { t } = useTranslationHook([NAMESPACES_ENUM.CHANGEPOFORM])
  const METHOD_OPTIONS: Option[] = [
    { id: 'addItem', path: 'addItem', displayName: t('--addAmountUpdateTimelines--') },
    { id: 'editItems', path: 'editItems', displayName: t('--editPoLineItems--') }
  ]

  useEffect(() => {
    if (props.fields) {
      const formConfig = getFormFieldConfig('headerExtensionForm', props.fields)
      if (formConfig && formConfig.questionnaireId) {
        fetchCustomFormDefinition(formConfig.questionnaireId?.formId)
        fetchLocalLabels(formConfig.questionnaireId?.formId)
      }
    }
  }, [props.fields])

  function getLineItemConfig (fieldName: string): ItemListConfig| undefined {
    if (Array.isArray(props.fields)) {
      const field = props.fields.find(field => field.fieldName === fieldName)
      return field?.itemConfig
    } else {
      return undefined
    }
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function fetchCustomFormDefinition (id: string) {
    if (props.events?.fetchExtensionCustomFormDefinition && id) {
      props.events?.fetchExtensionCustomFormDefinition(id)
        .then(resp => {
          setCustomFormDefinition(resp)
        })
        .catch(err => console.log('Change PO: Error in fetching custom form definition', err))
    }
  }

  function onLoadDocument (fieldName: string, mediaType: string, fileName: string): Promise<Blob> {
    if (props.dataFetchers?.getDocumentByName) {
      const extensionFieldName = `data.${fieldName}`
      return props.dataFetchers?.getDocumentByName(extensionFieldName, mediaType, fileName)
    }
  }

  function fetchLocalLabels (id: string) {
    if (props.events?.fetchExtensionCustomFormLocalLabels && id) {
      props.events?.fetchExtensionCustomFormLocalLabels(id)
        .then(resp => {
          setLocalLabels(resp)
        })
        .catch(err => console.log('Change PO: Error in fetching custom form local labels', err))
    }
  }

  return (
    <div id="changePOReadOnlyForm" className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <div className="formFields">
        <div className="sectionTitle"></div>

        <div className="keyValuePair">
          <ObjectSelector
            value={props.data?.poRef}
            type={ObjectType.po}
            objectSelectorConfig={poObjectConfig}
            poFormConfig={props.fields}
            disabled={true}
            description={props.data?.poRef?.id ? t('--purchaseOrder--'): t('--selectPurchaseOrder--')}
            departmentOptions={props.departmentOptions}
            getPO={props.dataFetchers?.getPO}
            dataFetchers={props.dataFetchers}
            events={props.events}
            options={props.options}
          />
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--reasonForAmendment--')}</div>
          <div className="value">{props.data?.reason || '-'}</div>
        </div>

        {customFormDefinition &&
          <div>
            <FormDefinitionReadOnlyView
              locale={getSessionLocale()}
              formDefinition={customFormDefinition}
              formData={props.data?.data}
              localLabels={localLabels}
              loadDocument={onLoadDocument}
              loadCustomerDocument={props.events?.loadCustomerDocument}
              documentType={props.options?.documentType}
              draftDocuments={props.options?.draftDocuments}
              signedDocuments={props.options?.signedDocuments}
              finalisedDocuments={props.options?.finalisedDocuments}
              getDoucumentByUrl={props.dataFetchers?.getDoucumentByUrl}
              getDoucumentUrlById={props.dataFetchers?.getDoucumentUrlById}
              triggerLegalDocumentFetch={props.events?.triggerLegalDocumentFetch}
              options={props.options}
              isSingleColumnLayout={props.options?.isSingleColumnLayout || false}
              canShowTranslation={props.options?.canShowTranslation || undefined}
              fetchExtensionCustomFormDefinition={props.events?.fetchExtensionCustomFormDefinition}
              fetchExtensionCustomFormLocalLabels={props.events?.fetchExtensionCustomFormLocalLabels}
            />
          </div>}

        <div className="sectionTitle">{METHOD_OPTIONS.find(option => option.path === props.data?.method)?.displayName || '-'}</div>

        { props.data?.method === 'addItem' && <>
          {(props.data?.startDate || props.data?.endDate) &&
          <div className="keyValuePair">
            <div className="label">{t('--updateTimeline--')}</div>
            <div className="value multiline">
              <div>{`${getLocalDateString(props.data?.startDate)} - ${getLocalDateString(props.data?.endDate)}`}</div>
              { (props.data?.purchaseOrder?.itemList?.items?.[0]?.startDate || props.data?.purchaseOrder?.itemList?.items?.[0]?.endDate) &&
                (`${getLocalDateString(props.data?.startDate)} - ${getLocalDateString(props.data?.endDate)}` !== `${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.startDate)} - ${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.endDate)}`) &&
                <div className="valueCurrent">{t('--currentTimeline--')} {`${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.startDate)} - ${getLocalDateString(props.data?.purchaseOrder?.itemList?.items?.[0]?.endDate)}`}</div>}
            </div>
          </div>}

          {props.data?.additionalAmount?.amount &&
          <div className="keyValuePair">
            <div className="label">{t('--additionalAmount--')}</div>
            <div className="value multiline">
              <div>{getFormattedAmountValue(props.data?.additionalAmount && mapMoney(props.data?.additionalAmount))}</div>
              { (getTotalPriceDisplayText(props.data?.purchaseOrder) !== '-') &&
                (getFormattedAmountValue(props.data?.additionalAmount && mapMoney(props.data?.additionalAmount)) !== getTotalPriceDisplayText(props.data?.purchaseOrder)) &&
                <div className="valueCurrent">{t('--currentPoTotal--')}{getTotalPriceDisplayText(props.data?.purchaseOrder)}</div>}
            </div>
          </div>}
        </>}

        { props.data?.method === 'editItems' && <>
          <div className="keyValuePair lineItems">
            <div className="value">
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
                options={props.options}
                dataFetchers={props.dataFetchers}
                events={props.events}
                getDoucumentByPath={props.getDoucumentByPath}
                getDocumentByName={props.loadDocument}
              />
            </div>
          </div>

          <div className="keyValuePair lineItems">
            <div className='value'>
              {t('--expenseItem--')}
            </div>
            <div className="value">
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
                options={props.options}
                dataFetchers={props.dataFetchers}
                events={props.events}
                getDoucumentByPath={props.getDoucumentByPath}
                getDocumentByName={props.loadDocument}
              />
            </div>
          </div>
        </>}

        {props.data?.attachments?.length > 0 &&
          <div className="keyValuePair">
            <div className="label">{t('--attachments--')}</div>
            <div className="value attachmentList">
              {props.data?.attachments && props.data.attachments.map((doc, i) =>
                <div className="attachmentBox" key={i}>
                  <AttachmentReadOnly
                    attachment={doc as Attachment}
                    onPreviewByURL={() => loadFile(`attachments[${i}]`, (doc as Attachment).mediatype, (doc as Attachment).filename)}
                  />
                </div>)}
              {(!props.data?.attachments || (props.data.attachments.length === 0)) && ''}
            </div>
          </div>}

      </div>
    </div>
  )
}
export function ChangePoFormReadOnly (props: ChangePoFormReadOnlyProps)  {
  return <I18Suspense><ChangePoFormReadOnlyComponent {...props} /></I18Suspense>
}
