import React, { Suspense, useRef } from 'react'
import { AlertCircle } from 'react-feather'

import styles from './compliance-form-styles.module.scss'
import { YesNoToggle } from './../Inputs'
import { DataPrivacyFormData, DataPrivacyFormProps } from './types'
import { useState } from 'react'
import { useEffect } from 'react'
import { OroButton } from '../controls'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function DataPrivacyForm (props: DataPrivacyFormProps) {
  const [personalIdentifiableInf, setPersonalIdentifiableInf] = useState<boolean | null>(null)
  const [localRegulatoryEU, setLocalRegulatoryEU] = useState<boolean | null>(null)
  const [localRegulatoryCalifornia, setLocalRegulatoryCalifornia] = useState<boolean | null>(null)
  const [isInvalid, setIsInvalid] = useState(false)
  const errorMsgRef = useRef(null)
  const { t } = useTranslationHook(NAMESPACES_ENUM.DATAPRIVACY)

  useEffect(() => {
    if(isInvalid && errorMsgRef?.current?.offsetTop) {
      window.scrollTo(0, errorMsgRef.current.offsetTop)
    }
  }, [isInvalid])

  useEffect(() => {
    if (props.formData) {
      setPersonalIdentifiableInf(props.formData.personalIdentifiableInf)
      setLocalRegulatoryEU(props.formData.localRegulatoryEU)
      setLocalRegulatoryCalifornia(props.formData.localRegulatoryCalifornia)
    }
  }, [props.formData])

  function getFormData (): DataPrivacyFormData {
    return {
      personalIdentifiableInf: personalIdentifiableInf,
      localRegulatoryEU: localRegulatoryEU,
      localRegulatoryCalifornia: localRegulatoryCalifornia
    }
  }

  function handleFormSubmit () {
    if ((personalIdentifiableInf === null) || (localRegulatoryEU === null) || (localRegulatoryCalifornia === null)) {
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

  function fetchData (skipValidation?: boolean): DataPrivacyFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      if ((personalIdentifiableInf === null) || (localRegulatoryEU === null) || (localRegulatoryCalifornia === null)) {
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
    personalIdentifiableInf, localRegulatoryEU, localRegulatoryCalifornia
  ])

  return (
    <Suspense fallback="loading">
    <div className={styles.complianceForm}>
      <div className={styles.complianceFormSection}>
        <label className={styles.complianceFormSectionTitle}>{t('DATA PRIVACY')}</label>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && personalIdentifiableInf === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('Personal Identifiable Information (PII)')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>1.</span> */}
              {/* 
                // if we get multiple questions in future we will add numbers
                // right now we have single questions only
              */} 
              <p>
                {t('Does your current project or planned future use of this supplier’s product and/or services involve access to personal identifiable information(PII) that can be used to identify an individual ‘natural’ person?')}
                <span className={styles.eg}> {t('(e.g. Name, Address, Email, Phone Number, any data that can identify an individual)')}</span>
              </p>
            </div>
            <YesNoToggle value={personalIdentifiableInf} onSelect={(value) => setPersonalIdentifiableInf(value)} />
          </div>
          {
            isInvalid && personalIdentifiableInf === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('Response is required.')}</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && localRegulatoryEU === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('GDPR compliance check for EU')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>2.</span> */}
              <p>
                {t('Is there any planned or potential use of personal identifiable information (PII) data being used in this project going to / coming from the European Union?')}
              </p>
            </div>
            <YesNoToggle value={localRegulatoryEU} onSelect={(value) => setLocalRegulatoryEU(value)}/>
          </div>
          {
            isInvalid && localRegulatoryEU === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('Response is required.')}</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && localRegulatoryCalifornia === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>{t('PII compliance check for California')}</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>3.</span> */}
              <p>
                {t('Is there any planned or potential use of personal identifiable information (PII) data being used in this project going to / coming from California?')}
              </p>
            </div>
            <YesNoToggle value={localRegulatoryCalifornia} onSelect={(value) => setLocalRegulatoryCalifornia(value)}/>
          </div>
          {
            isInvalid && localRegulatoryCalifornia === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>{t('Response is required.')}</span>
          }  
        </div>
      </div>

      {
        (props.submitLabel || props.cancelLabel) &&
        <div className={styles.complianceFormBtn}>
          { props.cancelLabel &&
            <OroButton label={t(props.cancelLabel)} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
          { props.submitLabel &&
            <OroButton label={t(props.submitLabel)} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
        </div>
      }

    </div>
    </Suspense>
  )
}