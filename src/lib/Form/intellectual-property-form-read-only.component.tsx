import React from 'react'

import { IntellectualPropertyFormData } from './types'
import './compliance-form-read-only.scss'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function IntellectualPropertyFormReadOnly (props: { companyName: string, formData: IntellectualPropertyFormData, isSingleColumnLayout?: boolean }) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMPLIANCEFORMS) 
  return (
    <div className={`complianceFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <label className="formTitle">{t('--intellectualProperty--')}</label>

      <div className="section">
        <label>{t('--companyRights--')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">1.</span> */}
            <p>
            {t('--willSupplierCreateIntellectualProperty--',{name:props.companyName ? props.companyName : ''})}
              <span className="eg">{t('--contentDesignGraphicArtSoftwareSurveyResearchReport--')}</span>
            </p>
          </div>
          <div className={props.formData.companyRights ? "yes" : "no"}>{props.formData.companyRights ? t('--yes--') : t('--no--')}</div>
        </div>
      </div>
      
      <div className="section">
        <label>{t('--accessToCompanyIpProsprietaryData--')}</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">2.</span> */}
            <p>
            {t('--accessToIntellectualProperty--',{name:props.companyName ? props.companyName : ''})}
            </p>
          </div>
          <div className={props.formData.accessToCompanyIP ? "yes" : "no"}>{props.formData.accessToCompanyIP ? t('--yes--') : t('--no--')}</div>
        </div>
      </div>
        
      <div className="section">
        <label>{t('--confidentiality--')}</label>
        <div className="ques">
            <div className="para">
              {/* <span className="num">3.</span> */}
              <p>
              {t('--AreYouOkWithsupplierRefrencing--',{name:props.companyName ? props.companyName : ''})}
              </p>
            </div>
            <div className={props.formData.confidentiality ? "yes"  : "no"}>{props.formData.confidentiality ? t('--yes--') : t('--no--')}</div>
          </div>
      </div>
    </div>
  )
}