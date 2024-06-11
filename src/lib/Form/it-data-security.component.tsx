import React, { useEffect, useRef, useState } from 'react'

import styles from './compliance-form-styles.module.scss'
import { YesNoToggle } from '../Inputs'
import { ItDataSecurityFormData, ItDataSecurityFormProps } from './types'
import { OroButton } from '../controls'
import { AlertCircle } from 'react-feather'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function ItDataSecurityFormComponent (props: ItDataSecurityFormProps) {
  const [companySensitiveData, setCompanySensitiveData] = useState<boolean>(false)
  const [systemAccessCheck, setSystemAccessCheck] = useState<boolean>(false)
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
      setCompanySensitiveData(props.formData.companySensitiveData)
      setSystemAccessCheck(props.formData.systemAccessCheck)
    }
  }, [props.formData])

  function getFormData (): ItDataSecurityFormData {
    return {
      companySensitiveData: companySensitiveData,
      systemAccessCheck: systemAccessCheck
    }
  }

  function handleFormSubmit () {
    if ((companySensitiveData === null) || (systemAccessCheck === null)) {
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

  function fetchData (skipValidation?: boolean): ItDataSecurityFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      if ((companySensitiveData === null) || (systemAccessCheck === null)) {
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
    companySensitiveData, systemAccessCheck
  ])

  return (
    <div className={styles.complianceForm}>
      <div className={styles.complianceFormSection}>
        <label className={styles.complianceFormSectionTitle}>{t('--itSecurityDataAccessSystemIntegration--')}</label>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && companySensitiveData === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--companySensitiveData--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>1.</span> */}
              <p>
                {t('--needAccessToCompanySensitiveDate--',{name:props.companyName ? props.companyName : ''})}
                <span className={styles.eg}>{t('--customerDetailsFinanceDataEmployeeData--')}</span>
              </p>
            </div>
            <YesNoToggle value={companySensitiveData} onSelect={(value) => setCompanySensitiveData(value)}/>
          </div>
          {
            isInvalid && companySensitiveData === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('--responseIsRequired--')}</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && systemAccessCheck === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--systemIntegration--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>2.</span> */}
              <p>
                {t('--integrateWithAccessData--',{name:props.companyName ? props.companyName : ''})}
                <span className={styles.eg}>{t('--salesforceMarketoGainsightNetsuiteSuccessFactors--')}</span>
              </p>
            </div>
            <YesNoToggle value={systemAccessCheck} onSelect={(value) => setSystemAccessCheck(value)}/>
          </div>
          {
            isInvalid && systemAccessCheck === null && 
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
export function ItDataSecurityForm (props: ItDataSecurityFormProps) {
  return <I18Suspense><ItDataSecurityFormComponent {...props} /></I18Suspense>
}