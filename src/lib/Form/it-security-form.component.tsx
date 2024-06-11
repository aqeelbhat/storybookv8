import React, { useEffect, useRef, useState } from 'react'

import styles from './compliance-form-styles.module.scss'
import { YesNoToggle } from '../Inputs'
import { ItSecurityFormData, ItSecurityFormProps } from './types'
import { OroButton } from '../controls'
import { AlertCircle } from 'react-feather'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function ItSecurityFormComponent (props: ItSecurityFormProps) {
  const [employeeLogin, setEmployeeLogin] = useState<boolean | null>(null)
  const [externalUserCheck, setExternalUserCheck] = useState<boolean | null>(null)
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
      setEmployeeLogin(props.formData.employeeLogin)
      setExternalUserCheck(props.formData.externalUserCheck)
    }
  }, [props.formData])

  function getFormData (): ItSecurityFormData {
    return {
      employeeLogin: employeeLogin,
      externalUserCheck: externalUserCheck
    }
  }

  function handleFormSubmit () {
    if ((employeeLogin === null) || (externalUserCheck === null)) {
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

  function fetchData (skipValidation?: boolean): ItSecurityFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      if ((employeeLogin === null) || (externalUserCheck === null)) {
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
    employeeLogin, externalUserCheck
  ])

  return (
    <div className={styles.complianceForm}>
      <div className={styles.complianceFormSection}>
        <label className={styles.complianceFormSectionTitle}>{t('--itSecurityUserAccess--')}</label>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && employeeLogin === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--employeeLogin--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>1.</span> */}
              <p>
                {t('--willEmployessLoginToProductOrService--',{name:props.companyName ? props.companyName : ''})}
              </p>
            </div>
            <YesNoToggle value={employeeLogin} onSelect={(value) => setEmployeeLogin(value)}/>
          </div>
          {
            isInvalid && employeeLogin === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('--responseIsRequired--')}</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && externalUserCheck === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('--externalUserCheck--')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>2.</span> */}
              <p>
                {t('--implementSetupOrConfigureThisProduct--')}
              </p>
            </div>
            <YesNoToggle value={externalUserCheck} onSelect={(value) => setExternalUserCheck(value)}/>
          </div>
          {
            isInvalid && externalUserCheck === null && 
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
export function ItSecurityForm (props: ItSecurityFormProps) {
  return <I18Suspense><ItSecurityFormComponent {...props} /></I18Suspense>
}