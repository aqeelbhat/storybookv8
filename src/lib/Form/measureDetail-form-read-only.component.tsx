/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useState } from 'react'
import './oro-form-read-only.css'
import { Field, MeasureDetailReadonlyProps, StandardPriority } from './types'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { Attachment, Option } from '../Types'
import { getFormFieldConfig, isFieldOmitted, mapIDRefToOption } from './util'
import { Linkify } from '../Linkify'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { mapCurrencyToSymbol } from '../util'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { getSessionLocale } from '../sessionStorage'

export function MeasureDetailReadonly (props: MeasureDetailReadonlyProps) {
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const { t } = useTranslationHook(NAMESPACES_ENUM.BASICINFO)

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        name: getFormFieldConfig('measureName', props.fields),
        additionalDocs: getFormFieldConfig('additionalDocs', props.fields),
        acceptDocUrls: getFormFieldConfig('acceptDocUrls', props.fields),
        locations: getFormFieldConfig('sites', props.fields),
        workstream: getFormFieldConfig('workstream', props.fields),
        type: getFormFieldConfig('processName', props.fields),
        estimate: getFormFieldConfig('estimate', props.fields),
        businessSegments: getFormFieldConfig('businessSegments', props.fields),
        owner: getFormFieldConfig('owner', props.fields),
        situation: getFormFieldConfig('situation', props.fields),
        action: getFormFieldConfig('action', props.fields),
        benefit: getFormFieldConfig('benefit', props.fields),
        other: getFormFieldConfig('other', props.fields),
        supplier: getFormFieldConfig('supplier', props.fields),
        impactCategory: getFormFieldConfig('impactCategory', props.fields),
        priority: getFormFieldConfig('priority', props.fields),
        relatedMeasures: getFormFieldConfig('relatedMeasures', props.fields),
        workArea: getFormFieldConfig('workArea', props.fields),
        businessRegion: getFormFieldConfig('businessRegion', props.fields),
        financialImpactType: getFormFieldConfig('financialImpactType', props.fields)
      })
    }
  }, [props.fields])

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function measureClick (measure: Option) {
      if (props.onMeasureClick) {
          props.onMeasureClick(measure)
      }
  }

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

          { props.formData?.businessRegion?.displayName &&
            <div className="keyValuePair">
              <div className="label">{t('--region--')}</div>
              <div className="value">
                {mapCustomFieldValue({value: props.formData?.businessRegion?.displayName, fieldName: 'businessRegion', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
            </div>}

          { props.formData?.financialImpactType?.displayName &&
            <div className="keyValuePair">
              <div className="label">{t('--ebitImpactType--', { ebit: props.formData?.ebitLabel || 'EBIT' })}</div>
              <div className="value">
                {mapCustomFieldValue({value: props.formData?.financialImpactType?.displayName, fieldName: 'financialImpactType', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
            </div>}

          { props.formData.businessSegments && props.formData.businessSegments.length > 0 &&
            <div className="keyValuePair">
              <div className="label">{t('--businessSegments--')}</div>
              <div className="value">{props.formData.businessSegments?.map(segment => segment.displayName).join(', ') || '-'}</div>
            </div>}

          { props.formData?.workArea?.displayName &&
            <div className="keyValuePair">
              <div className="label">{t('--workArea--')}</div>
              <div className="value">
                {mapCustomFieldValue({value: props.formData?.workArea?.displayName, fieldName: 'workArea', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
            </div>}

          { props.formData.locations && props.formData.locations.length > 0 &&
            <div className="keyValuePair">
              <div className="label">{t('--sites--')}</div>
              <div className="value">{props.formData.locations?.map(loc => loc.displayName).join(', ') || '-'}</div>
            </div>}

          { props.formData.impactCategory?.displayName &&
            <div className="keyValuePair">
              <div className="label">{t('--impactCategory--')}</div>
              <div className="value">
                {mapCustomFieldValue({value: props.formData.impactCategory?.displayName, fieldName: 'impactCategory', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
            </div>}

          {!props.disableSupplier && <div className="keyValuePair">
              <div className="label">{t('--supplier--')}</div>
              <div className="value">
                {mapCustomFieldValue({value: props.formData.supplier?.displayName, fieldName: 'supplier', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
          </div>}

          <div className="keyValuePair">
              <div className="label">{t('--relatedMeasures--')}</div>
              <div className="value separatedItems">
                              {props.formData.relatedMeasures && props.formData.relatedMeasures.map((measure, i) =>
                                  <div className="item" key={i}><span onClick={() => measureClick(measure)}>{measure.displayName}</span></div>)}
                              {(!props.formData.relatedMeasures || (props.formData.relatedMeasures.length === 0)) && ''}
              </div>
          </div>

          {props.linkedEngagements && props.linkedEngagements.length > 0 && <div className="keyValuePair">
              <div className="label">{t('--linkedMeasures--')}</div>
              <div className="value separatedItems">
                              {props.linkedEngagements.map((measure, i) =>
                                  <div className="item" key={i}><span onClick={() => measureClick(mapIDRefToOption(measure))}>{`${measure.refId}: ${mapIDRefToOption(measure).displayName}`}</span></div>)}
              </div>
          </div>}

          <div className="keyValuePair">
              <div className="label">{t('--businessDocuments--')}</div>
              <div className="value attachmentList">
                  {props.formData.additionalDocs && props.formData.additionalDocs.map((doc, i) =>
                      <div className="attachmentBox" key={i}>
                          <AttachmentReadOnly
                              attachment={doc as Attachment}
                              onPreviewByURL={() => loadFile(`additionalDocs[${i}]`, (doc as Attachment).mediatype, (doc as Attachment).filename)}
                          />
                      </div>)}
                  {(!props.formData.additionalDocs || (props.formData.additionalDocs.length === 0)) && ''}
                  {mapCustomFieldValue({value: props.formData.docUrls, fieldName: 'docUrls', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
          </div>
        </div>
      </div>
    </Linkify>
  )
}
