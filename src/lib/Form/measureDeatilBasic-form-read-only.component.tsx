/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Mayur Ingle
 ************************************************************/
import React, { useEffect, useState } from 'react'
import './oro-form-read-only.css'
import { Field, MeasureDetailReadonlyProps, StandardPriority } from './types'
import { Option } from '../Types'
import { Linkify } from '../Linkify'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { mapCurrencyToSymbol } from '../util'
import { getFormFieldConfig } from '..'
import { isFieldOmitted } from './util'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { getSessionLocale } from '../sessionStorage'

export function MeasureDetailBasicReadonly (props: MeasureDetailReadonlyProps) {
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const { t } = useTranslationHook(NAMESPACES_ENUM.BASICINFO)

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        name: getFormFieldConfig('measureName', props.fields),
        workstream: getFormFieldConfig('workstream', props.fields),
        type: getFormFieldConfig('processName', props.fields),
        estimate: getFormFieldConfig('estimate', props.fields),
        owner: getFormFieldConfig('owner', props.fields),
        situation: getFormFieldConfig('situation', props.fields),
        action: getFormFieldConfig('action', props.fields),
        benefit: getFormFieldConfig('benefit', props.fields),
        other: getFormFieldConfig('other', props.fields),
        priority: getFormFieldConfig('priority', props.fields)
      })
    }
  }, [props.fields])

  function getWorkstreamDispalyName (workstream?: Option): string {
    const combinedArrayForCodeName: Array<string> = []
    if (workstream && workstream?.customData?.refId) {
      combinedArrayForCodeName.push(workstream?.customData.refId)
    }

    if (workstream && workstream.displayName) {
      combinedArrayForCodeName.push(workstream.displayName)
    }
    return combinedArrayForCodeName.join(' - ')
  }

  function getEstimateDisplayVal () {
    if (props.formData.estimate?.amount) {
      const formattedAmount = !isNaN(Number(props.formData.estimate.amount))
        ? Number(props.formData.estimate?.amount).toLocaleString(getSessionLocale())
        : '-'

      return `${formattedAmount}`
    } else {
      return '-'
    }
  }

  return (
    <Linkify>
      <div className="oroFormReadOnly">
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t('--name--')}</div>
            <div className="value">
              {mapCustomFieldValue({value: props.formData.name, fieldName: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
          </div>

          <div className="keyValuePair">
            <div className="label">{t('--containSensitiveInformation--')}</div>
            <div className="value">{props.formData.sensitive ? t('--yes--') : t('--no--')}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{t('--highPriorityMeasure--')}</div>
            <div className="value">{props.formData.priority === StandardPriority.high ? t('--yes--') : t('--no--')}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{t('--type--')}</div>
            <div className="value">
              {mapCustomFieldValue({value: props.formData.type?.displayName, fieldName: 'type', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
          </div>

          {!isFieldOmitted(fieldMap, 'estimate') && props.isEbitRequest &&
          <div className="keyValuePair">
              <div className="label">{t('--ebitEstimatedCurrency--', { ebit: props.formData?.ebitLabel || 'EBIT', code: mapCurrencyToSymbol(props.currency || 'EUR') })}</div>
              <div className="value">{getEstimateDisplayVal()}</div>
          </div>
          }

          <div className="keyValuePair">
            <div className="label">{t('--workstream--')}</div>
            <div className="value">{getWorkstreamDispalyName(props.formData.workstream) || '-'}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{t('--description--')}</div>
            <div className="value preWrapDescription">
              {mapCustomFieldValue({value: props.formData.other, fieldName: 'other', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
            </div>
          </div>
        </div>
      </div>
    </Linkify>
  )
}
