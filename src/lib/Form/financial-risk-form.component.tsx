import React, { useEffect, useRef, useState } from 'react'

import styles from './compliance-form-styles.module.scss'
import { YesNoToggle } from '../Inputs'
import { FinancialRiskFormData, FinancialRiskFormProps } from './types'
import { OroButton } from '../controls'
import { AlertCircle } from 'react-feather'

export function FinancialRiskForm (props: FinancialRiskFormProps) {
  const [companyLiability, setCompanyLiability] = useState<boolean>(false)
  const [supplierLiability, setSupplierLiability] = useState<boolean>(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const errorMsgRef = useRef(null)

  useEffect(() => {
    if(isInvalid && errorMsgRef?.current?.offsetTop) {
      window.scrollTo(0, errorMsgRef.current.offsetTop)
    }
  }, [isInvalid])

  useEffect(() => {
    if (props.formData) {
      setCompanyLiability(props.formData.companyLiability)
      setSupplierLiability(props.formData.supplierLiability)
    }
  }, [props.formData])

  function getFormData (): FinancialRiskFormData {
    return {
      companyLiability: companyLiability,
      supplierLiability: supplierLiability
    }
  }

  function handleFormSubmit () {
    if ((companyLiability === null) || (supplierLiability === null)) {
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

  function fetchData (skipValidation?: boolean): FinancialRiskFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      if ((companyLiability === null) || (supplierLiability === null)) {
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
    companyLiability, supplierLiability
  ])
  
  return (
    <div className={styles.complianceForm}>
      <div className={styles.complianceFormSection}>
      <label className={styles.complianceFormSectionTitle}>FINANCIAL RISK</label>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && companyLiability === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>Company liability</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>1.</span> */}
              <p>
                Does the agreement require {props.companyName ? props.companyName : ''} to have insurance?
              </p>
            </div>
            <YesNoToggle value={companyLiability} onSelect={(value) => setCompanyLiability(value)}/>
          </div>
          {
            isInvalid && companyLiability === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>Response is required.</span>
          }
        </div>

        <div className={styles.complianceFormIndiSection} ref={isInvalid && supplierLiability === null ? errorMsgRef : null}>
          <label className={styles.complianceFormIndiSectionQesTitle}>Supplier liability</label>
          <div className={styles.complianceFormSectionQues}>
            <div className={styles.complianceFormSectionQuesPara}>
              {/* <span className={styles.complianceFormSectionQuesParaNum}>2.</span> */}
              <p>
                Does the agreement require the supplier to have insurance?
              </p>
            </div>
            <YesNoToggle value={supplierLiability} onSelect={(value) => setSupplierLiability(value)}/>
          </div>
          {
            isInvalid && supplierLiability === null && 
            <span className={styles.complianceFormIndiSectionError}><AlertCircle size={24} color="#d67268"/>Response is required.</span>
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