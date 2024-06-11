import React from 'react'
import { TaxInfoFormData, TrackedAttributes } from './types'

import './oro-form-read-only.css'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface TaxInfoFormReadOnlyProps {
  data: TaxInfoFormData
  trackedAttributes?: TrackedAttributes
}

function TaxInfoFormReadOnlyComponent (props: TaxInfoFormReadOnlyProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  return (
    <div className="oroFormReadOnly">

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t('--taxInfo--.--taxId--')}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.taxId, fieldName: 'taxId', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>
      </div>
    </div>
  )
}
export function TaxInfoFormReadOnly (props: TaxInfoFormReadOnlyProps) {
  return <I18Suspense><TaxInfoFormReadOnlyComponent {...props} /></I18Suspense>
}
