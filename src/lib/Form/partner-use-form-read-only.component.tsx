import React from 'react'
import { PartnerUseFormData, TrackedAttributes } from './types'

import './oro-form-read-only.css'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface partnerUseForm {
  data: PartnerUseFormData, 
  isSingleColumnLayout?: boolean, 
  trackedAttributes?: TrackedAttributes
}

function PartnerUseFormReadOnlyComponent (props: partnerUseForm) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.PARTNERUSEFORM)

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("--title--")}</div>
          <div className="value">
            {mapCustomFieldValue({value: props.data.title, fieldName: 'title', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
            </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--regionCountryPartnerUsed--")}</div>
          <div className="value">
            {mapCustomFieldValue({value: props.data.region?.displayName, fieldName: 'region', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
          </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--servicesOfferedByPartner--")}</div>
          <div className="value">{props.data.service?.map(service => service.displayName).join(', ') || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--businessEntity--")}</div>
          <div className="value">
            {mapCustomFieldValue({value: props.data.subsidiary?.displayName, fieldName: 'subsidiary', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
            </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--additionalSubsidiaries--")}</div>
          <div className="value">{props.data.additionalSubsidiary?.map(susidiary => susidiary.displayName).join(', ') || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--user--")}</div>
          <div className="value">
            {mapCustomFieldValue({value: props.data.user, fieldName: 'user', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
            </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("--department--")}</div>
          <div className="value">
            {/* {props.data.department?.displayName || '-'} */}
            {mapCustomFieldValue({value: props.data.department?.displayName, fieldName: 'department', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
          </div>
        </div>
      </div>

      <div className="sectionTitle">{t("--commentDetails--")}</div>

      <div className="summary">
      {mapCustomFieldValue({value: props.data.comment, fieldName: 'comment', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
      </div>
    </div>
  )
}
export function PartnerUseFormReadOnly (props: partnerUseForm){
  return <I18Suspense><PartnerUseFormReadOnlyComponent {...props} /></I18Suspense>
}
