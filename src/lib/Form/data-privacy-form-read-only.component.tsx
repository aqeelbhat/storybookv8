import React, { Suspense } from 'react'

import { DataPrivacyFormData } from './types'
import './compliance-form-read-only.scss'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function DataPrivacyFormReadOnly (props: { formData: DataPrivacyFormData, isSingleColumnLayout?: boolean, isLocalizationEnabled?: boolean }) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.DATAPRIVACY)
  
  return (
    <Suspense fallback="loading">
    <div className={`complianceFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <label className="formTitle">{t('DATA PRIVACY')}</label>

      <div className="section">
        <label>{t('Personal Identifiable Information (PII)')}</label>
        <div className="ques">
            <div className="para">
              {/* <span className="num">1.</span> */}
              <p>
              {t('Does your current project or planned future use of this supplier’s product and/or services involve access to personal identifiable information(PII) that can be used to identify an individual ‘natural’ person?')}
                <span className="eg">{t('(e.g. Name, Address, Email, Phone Number, any data that can identify an individual)')}</span>
              </p>
            </div>
            <div className={props.formData.personalIdentifiableInf ? "yes" : "no"}>{props.formData.personalIdentifiableInf ? t('Yes') : t('No')}</div>
          </div>
      </div>

      <div className="section">
        <label>{t('GDPR compliance check for EU')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">2.</span> */}
            <p>
            {t('Is there any planned or potential use of personal identifiable information (PII) data being used in this project going to / coming from the European Union?')}
            </p>
          </div>
          <div className={props.formData.localRegulatoryEU ? "yes" : "no"}>{props.formData.localRegulatoryEU ? t('Yes') : t('No')}</div>
        </div>
      </div>

      <div className="section">
        <label>{t('PII compliance check for California')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">3.</span> */}
            <p>
            {t('Is there any planned or potential use of personal identifiable information (PII) data being used in this project going to / coming from California?')}
            </p>
          </div>
          <div className={props.formData.localRegulatoryCalifornia ? "yes" : "no"}>{props.formData.localRegulatoryCalifornia ? t('Yes') : t('No')}</div>
        </div>
      </div>

    </div>
    </Suspense>
  )
}