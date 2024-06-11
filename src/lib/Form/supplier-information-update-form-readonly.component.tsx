import React from 'react'

import { OroSupplierInformationUpdateForm } from './types'

import './oro-form-read-only.css'
import { mapCurrencyToSymbol } from '../util'
import { convertNumberToKM } from './util'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'


export function SupplierInformationUpdateFormReadOnly (props: {data: OroSupplierInformationUpdateForm, isSingleColumnLayout?: boolean, trackedAttributes?: any}) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO]) 
  function getCurrency (): string {
    if (props.data.spend.currency && mapCurrencyToSymbol(props.data.spend.currency)) {
      return `${mapCurrencyToSymbol(props.data?.spend?.currency)}${convertNumberToKM(props.data?.spend?.amount)}`
    } else {
      return `${convertNumberToKM(props.data?.spend?.amount)} ${props.data?.spend?.currency}`
    }
  }
  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <div className="sectionTitle">{t("Vendor details")}</div>
      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("GUID")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.guid, fieldName: 'guid', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>
        
        <div className="keyValuePair">
          <div className="label">{t("SAP/ERP Vendor ID")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.vendorId, fieldName: 'vendorId', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
            <div className="label">{t("Vendor Name")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data?.companyName, fieldName: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Vendor Country")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.vendorCountry, fieldName: 'vendorCountry', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Vendor Type")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.vendorType ? props.data.vendorType?.name : '', fieldName: 'vendorType', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Company Code")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.compantyEntity?.name, fieldName: 'compantyEntity', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Annual Spend/Contract Value (whichever is higher)")}</div>
          <div className="value">{props.data?.spend ? getCurrency() : '-'}</div>
        </div>

        { props.data?.companyDomain &&
          <div className="keyValuePair">
            <div className="label">{t("Company Domain")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data?.companyDomain, fieldName: 'companyDomain', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
          </div>}

        { props.data?.taxRegistrationID &&
          <div className="keyValuePair">
            <div className="label">{t("Tax/Registration ID")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data?.taxRegistrationID, fieldName: 'taxRegistrationID', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
          </div>}
      </div> 

      <div className="sectionTitle">{t("Contact Details")}</div>

      <div className="formFields">
        <div className="keyValuePair">
          <div className="label">{t("Email")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data?.supplierContactEmail, fieldName: 'supplierContactEmail', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
        </div>
      </div>
    </div>
  )
}
