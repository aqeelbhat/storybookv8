import React from 'react'

import { ProjectFormData, TrackedAttributes } from './types'

import './oro-form-read-only.css'
import { mapCurrencyToSymbol } from '../util'
import { getLocalDateString } from './util'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { getSessionLocale } from '../sessionStorage'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface projectFormProps{
  data: ProjectFormData, 
  previousFormData?: ProjectFormData | null, 
  isSingleColumnLayout?: boolean, 
  trackedAttributes?: TrackedAttributes
}

function ProjectFormReadOnlyComponent (props: projectFormProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.PROJECTFORM)

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="formFields">
        {props.data.marketingProgram?.displayName &&
          <div className="keyValuePair">
            <div className="label">{t("--marketingProgram--")}</div>
            <div className="value">{mapCustomFieldValue({value: props.data.marketingProgram?.displayName, fieldName: 'marketingProgram', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>

          </div>}

        <div className="keyValuePair">
          <div className="label">{t("--allocadiaId--")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.allocadiaId, fieldName: 'allocadiaId', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--targetRegion--")} </div>
          <div className="value">{mapCustomFieldValue({value: props.data.region?.displayName, fieldName: 'region', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--timeline--")}</div>
          <div className="value">{`${getLocalDateString(props.data.startDate)} - ${getLocalDateString(props.data.endDate)}`}</div></div>

        <div className="keyValuePair">
          <div className="label">{t("--service--")}</div>
          <div className="value">{props.data.service?.map(service => service.displayName).join(', ') || '-'}</div>
        </div>
      </div>

      <div className="sectionTitle">{t("--budgetDetails--")}</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("--estimatedTotalCost--")} </div>
          <div className="multiValueInline">
            <div>{`${mapCurrencyToSymbol(props.data.estimatedCost?.currency)}${Number(props.data.estimatedCost?.amount).toLocaleString(getSessionLocale())}` || '-'}</div>
            { props.previousFormData && props.previousFormData.estimatedCost && props.previousFormData.estimatedCost?.amount !== props.data.estimatedCost?.amount &&
              <div className="valuePrevious">{`${mapCurrencyToSymbol(props.previousFormData.estimatedCost?.currency)}${Number(props.previousFormData.estimatedCost?.amount).toLocaleString(getSessionLocale())}` || '-'}</div>
            }
          </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--businessEntity--")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.subsidiary?.displayName, fieldName: 'subsidiary', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--accountCode--")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.accountCode?.displayName, fieldName: 'accountCode', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--user--")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.user, fieldName: 'user', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--department--")}</div>
          <div className="value">{mapCustomFieldValue({value: props.data.department?.displayName, fieldName: 'department', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}   </div>
        </div>
      </div>

      <div className="sectionTitle">{t("--briefProjectSummary--")}</div>

      <div className="summary">{mapCustomFieldValue({value: props.data.summary, fieldName: 'summary', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
    </div>
  )
}
export function ProjectFormReadOnly (props: projectFormProps){
  return <I18Suspense><ProjectFormReadOnlyComponent {...props} /></I18Suspense>
}
