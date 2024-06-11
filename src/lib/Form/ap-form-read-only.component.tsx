import React from 'react'
import { APFormData, TrackedAttributes, VENDOR_CREATION_METHOD_MANUAL, VENDOR_CREATION_METHOD_SYSTEM } from './types'

import './oro-form-read-only.css'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { Field, getFormFieldConfig } from '.'

interface APFormReadOnlyProps {
  data: APFormData
  isSingleColumnLayout?: boolean
  trackedAttributes?: TrackedAttributes
  fields?: Field[]
}
function APFormReadOnlyComponent (props: APFormReadOnlyProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.APFORM])
  
  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields)?.customLabel || ''
  }
  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <div className="pageTitle">{t('--apReviewOutcome--')}</div>

      {props.data.method?.path === VENDOR_CREATION_METHOD_SYSTEM &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('CompanyEntity') || t('--primaryBusinessEntity--')}</div>
            <div className="value">
              {mapCustomFieldValue({value:props.data.companyEntity?.displayName, fieldName: 'companyEntity', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('additionalCompanyEntities') || t('--additionalBusinessEntity--')}</div>
            <div className="value">{props.data.additionalCompanyEntities?.map(entity => entity.displayName).join(', ') || '-'}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('eligible1099') || t('--eligible--')}</div>
            <div className="value">{props.data.eligible1099 ? 'Yes' : 'No'}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('syncToProcurement') || t('--syncToProcurify--')}</div>
            <div className="value">{props.data.syncToProcurement ? 'Yes' : 'No'}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('paymentTerms') || t('--paymentTerms--')}</div>
            <div className="value">
              {mapCustomFieldValue({value: props.data.paymentTerms?.displayName, fieldName: 'paymentTerms', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('currency') || t('--primaryCurrency--')}</div>
            <div className="value">
              {mapCustomFieldValue({value: props.data.currency?.displayName, fieldName: 'currency', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('expenseAccount') || t('--defaultExpenseAccount--')}</div>
            <div className="value">
              {mapCustomFieldValue({value: props.data.expenseAccount?.displayName , fieldName: 'expenseAccount', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('classification') || t('--supplierClassification--')}</div>
            <div className="value">
              {mapCustomFieldValue({value:props.data.classification?.displayName, fieldName: 'classification', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>
        </div>}

      {props.data.method?.path === VENDOR_CREATION_METHOD_MANUAL &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{getFieldLabelFromConfig('vendorId') || t('--vendorID--')}</div>
            <div className="value">
              {mapCustomFieldValue({value: props.data.vendorId, fieldName: 'vendorId', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>
        </div>}
    </div>
  )
}
export function APFormReadOnly (props: APFormReadOnlyProps) {
  return <I18Suspense><APFormReadOnlyComponent {...props} /></I18Suspense>
}
