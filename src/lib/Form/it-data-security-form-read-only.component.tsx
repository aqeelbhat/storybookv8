import React from 'react'

import { ItDataSecurityFormData } from './types'
import './compliance-form-read-only.scss'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface ItDataSecurityFormReadOnlyProps{
  companyName: string, 
  formData: ItDataSecurityFormData, 
  isSingleColumnLayout?: boolean
}

function ItDataSecurityFormReadOnlyComponent (props: ItDataSecurityFormReadOnlyProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMPLIANCEFORMS) 
  return (
    <div className={`complianceFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <label className="formTitle">{t('--itSecurityDataAccessSystemIntegration--')}</label>

      <div className="section">
        <label>{t('--companySensitiveData--')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">1.</span> */}
            <p>
            {t('--needAccessToCompanySensitiveDate--',{name:props.companyName ? props.companyName : ''})}
              <span className="eg">{t('--customerDetailsFinanceDataEmployeeData--')}</span>
            </p>
          </div>
          <div className={props.formData?.companySensitiveData ? "yes" : "no"}>{props.formData?.companySensitiveData ? t('--yes--') : t('--no--')}</div>
        </div>
      </div>

      <div className="section">
        <label>{t('--systemIntegration--')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">2.</span> */}
            <p>
            {t('--integrateWithAccessData--',{name:props.companyName ? props.companyName : ''})}
              <span className="eg">{t('--salesforceMarketoGainsightNetsuiteSuccessFactors--')}</span>
            </p>
          </div>
          <div className={props.formData?.systemAccessCheck ? "yes" : "no"}>{props.formData?.systemAccessCheck ? t('--yes--') : t('--no--')}</div>
        </div>
      </div>
        
    </div>
  )
}
export function ItDataSecurityFormReadOnly (props: ItDataSecurityFormReadOnlyProps) {
  return <I18Suspense><ItDataSecurityFormReadOnlyComponent {...props} /></I18Suspense>
}