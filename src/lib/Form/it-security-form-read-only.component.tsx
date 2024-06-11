import React from 'react'

import { ItSecurityFormData } from './types'
import './compliance-form-read-only.scss'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface ItSecurityFormReadOnlyProps{
  companyName: string, 
  formData: ItSecurityFormData, 
  isSingleColumnLayout?: boolean
}

function ItSecurityFormReadOnlyComponent (props: ItSecurityFormReadOnlyProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMPLIANCEFORMS) 
  return (
    <div className={`complianceFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <label className="formTitle">{t('--itSecurityUserAccess--')}</label>

      <div className="section">
        <label>{t('--employeeLogin--')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">1.</span> */}
            <p>
            {t('--willEmployessLoginToProductOrService--',{name:props.companyName ? props.companyName : ''})}
            </p>
          </div>
          <div className={props.formData?.employeeLogin ? "yes" : "no"}>{props.formData?.employeeLogin ? t('--yes--') : t('--no--')}</div>
        </div>
      </div>
      
      <div className="section">
        <label>{t('--externalUserCheck--')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">2.</span> */}
            <p>
            {t('--implementSetupOrConfigureThisProduct--')}
            </p>
          </div>
          <div className={props.formData?.externalUserCheck ? "yes" : "no"}>{props.formData?.externalUserCheck ? t('--yes--') : t('--no--')}</div>
        </div>
      </div>

    </div>
  )
}
export function ItSecurityFormReadOnly (props: ItSecurityFormReadOnlyProps) {
  return <I18Suspense><ItSecurityFormReadOnlyComponent {...props} /></I18Suspense>
}