import React, { useEffect, useRef, useState } from 'react'

import styles from './compliance-form-styles.module.scss'
import { YesNoToggle } from '../Inputs'
import { IntellectualPropertyFormData, IntellectualPropertyFormProps } from './types'
import { OroButton } from '../controls'
import { AlertCircle } from 'react-feather'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function IntellectualPropertyFormComponent (props: IntellectualPropertyFormProps) {
  const [companyRights, setCompanyRights] = useState<boolean>(false)
  const [accessToCompanyIP, setAccessToCompanyIP] = useState<boolean>(false)
  const [confidentiality, setConfidentiality] = useState<boolean>(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const errorMsgRef = useRef(null)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMPLIANCEFORMS) 

  useEffect(() => {
    if(isInvalid && errorMsgRef?.current?.offsetTop) {
      window.scrollTo(0, errorMsgRef.current.offsetTop)
    }
  }, [isInvalid])

  useEffect(() => {
    if (props.formData) {
      setCompanyRights(props.formData.companyRights)
      setAccessToCompanyIP(props.formData.accessToCompanyIP)
      setConfidentiality(props.formData.confidentiality)
    }
  }, [props.formData])

  function getFormData (): IntellectualPropertyFormData {
    return {
      companyRights: companyRights,
      accessToCompanyIP: accessToCompanyIP,
      confidentiality: confidentiality
    }
  }

  function handleFormSubmit () {
    if ((companyRights === null) || (accessToCompanyIP === null) || (confidentiality === null)) {
      setIsInvalid(true)
      return null
    } else {
      if (props.onSubmit) {
        props.onSubmit(getFormData())
      }
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function fetchData (skipValidation?: boolean): IntellectualPropertyFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      if ((companyRights === null) || (accessToCompanyIP === null) || (confidentiality === null)) {
        setIsInvalid(true)
        return null
      } else {
        return getFormData()
      }
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.formData,
    companyRights, accessToCompanyIP, confidentiality
  ])
  
  return (
    <div className={styles.complianceForm}>
      <div className={styles.complianceFormSection}>
        <label className={styles.complianceFormSectionTitle}>{t('--intellectualProperty--')}</label>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && companyRights === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--companyRights--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>1.</span> */}
              <p>
                {t('--willSupplierCreateIntellectualProperty--',{name:props.companyName ? props.companyName : ''})}
                <span className={styles.eg}>{t('--contentDesignGraphicArtSoftwareSurveyResearchReport--')}</span>
              </p>
            </div>
            <YesNoToggle value={companyRights} onSelect={(value) => setCompanyRights(value)}/>
          </div>
          {
            isInvalid && companyRights === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('--responseIsRequired--')}</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && accessToCompanyIP === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--accessToCompanyIpProsprietaryData--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>2.</span> */}
              <p>
                 {t('--accessToIntellectualProperty--',{name:props.companyName ? props.companyName : ''})}
              </p>
            </div>
            <YesNoToggle value={accessToCompanyIP} onSelect={(value) => setAccessToCompanyIP(value)}/>
          </div>
          {
            isInvalid && accessToCompanyIP === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('--responseIsRequired--')}</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && confidentiality === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--confidentiality--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>3.</span> */}
              <p>
                 {t('--AreYouOkWithsupplierRefrencing--',{name:props.companyName ? props.companyName : ''})}
              </p>
            </div>
            <YesNoToggle value={confidentiality} onSelect={(value) => setConfidentiality(value)}/>
          </div>
          {
            isInvalid && confidentiality === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('--responseIsRequired--')}</span>
          }
        </div>
      </div>

      {
        (props.submitLabel || props.cancelLabel) &&
        <div className={styles.complianceFormBtn}>
          { props.cancelLabel &&
            <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
          { props.submitLabel &&
            <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
        </div>
      }

    </div>
  )
}
export function IntellectualPropertyForm (props: IntellectualPropertyFormProps) {
  return <I18Suspense><IntellectualPropertyFormComponent {...props} /></I18Suspense>
}
