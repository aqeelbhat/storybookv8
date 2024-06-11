import React from 'react'
import { TrackedAttributes, UseFormData } from './types'

import './oro-form-read-only.css'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function UseFormReadOnlyComponent (props: {data: UseFormData, isSingleColumnLayout?: boolean, trackedAttributes?: TrackedAttributes}) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.USEFORM])
  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t('--title--')}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.title, fieldName: 'title', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--regionCountrySupplierUsed--')}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.region?.displayName, fieldName: 'region', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--servicesOfferedBySupplier--')}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.service?.map(service => service.displayName).join(', ') || '-', fieldName: 'categories', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--primaryBusinessEntity--')}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.subsidiary?.displayName, fieldName: 'companyEntity', fieldValue: 'name',trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--additionalBusinessEntity--')}</div>
          <div className="value">{props.data.additionalSubsidiary?.map(susidiary => susidiary.displayName).join(', ') || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--user--')}</div>
          <div className="value">{mapCustomFieldValue({value: props.data?.user, fieldName: 'user', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t('--department--')}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.department?.displayName, fieldName: 'department', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>
      </div>

      <div className="sectionTitle">{t('--commentDetails--')}</div>
      <div className="value">{mapCustomFieldValue({value: props.data?.comment, fieldName: 'comment', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
    </div>
  )
}
export function UseFormReadOnly (props: {data: UseFormData, isSingleColumnLayout?: boolean, trackedAttributes?: TrackedAttributes}) {
  return <I18Suspense><UseFormReadOnlyComponent  {...props} /></I18Suspense>
}
