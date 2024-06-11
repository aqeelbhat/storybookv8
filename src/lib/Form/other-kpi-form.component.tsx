import React, { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'react-feather'

import { OtherKpiFormData, OtherKpiFormProps, OtherKpiItemProps } from './types'
import styles from './other-kpi-form-styles.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { OroButton } from '../controls'
import { areKpiValid } from './util'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function OtherKpiItemComponent (props: OtherKpiItemProps) {
  const [kpi, setKpi] = useState('')
  const [kpiError, setkpiError] = useState<string | null>(null)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    setKpi(props.kpi)
  }, [props.kpi])

  function validateKpi () {
    setkpiError(!kpi ? t('--otherKpiForm--.--kpiRequired--') : null)
  }

  useEffect(() => {
    if (props.forceValidate) {
      validateKpi()
    }
  }, [props.forceValidate])

  function handledDeleteKpiItem () {
    if (props.onDelete) {
      props.onDelete()
    }
  }

  function handlekpiChange (event: any) {
    setKpi(event.target.value)
    setkpiError(null)
  }

  function handleOnBlurApifield () {
    if (kpi) {
      if (props.onChange) {
        props.onChange(kpi)
      }
    } else {
      validateKpi()
    }
  }

  return (
    <>
      <div className={styles.otherKpiItem}>
        <input
          type="text"
          placeholder={t('--otherKpiForm--.--enterKpi--')}
          value={kpi}
          onChange={handlekpiChange}
          onBlur={handleOnBlurApifield}
        />
        <span className={styles.otherKpiItemTrash} onClick={handledDeleteKpiItem}><Trash2 color="#bfbfbf" /></span>
      </div>
      {kpiError && <div className={styles.error}><img src={AlertCircle} /> {kpiError}</div>}
    </>
  )
}
export function OtherKpiItem (props: OtherKpiItemProps) {
  return <I18Suspense><OtherKpiItemComponent {...props} /></I18Suspense>
}

function OtherKpiFormComponent (props: OtherKpiFormProps) {
  const [kpiList, setKpiList] = useState<Array<string>>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.formData && props.formData.otherKpi && props.formData.otherKpi.length > 0 )
    {
      setKpiList(props.formData.otherKpi)
    } else {
      setKpiList([''])
    }
  }, [props.formData])

  function handleChange (kpiList: string[]) {
    if (props.onChange) {
      props.onChange(kpiList)
    }
  }

  function handleAddKpiItem () {
    const kpiListCopy = [ ...kpiList, '']
    setKpiList(kpiListCopy)
    handleChange(kpiListCopy)
  }

  function handledDeleteKpiItem (index: number) {
    const kpiListCopy = [ ...kpiList ]
    kpiListCopy.splice(index, 1)
    setKpiList(kpiListCopy)
    handleChange(kpiListCopy)
  }

  function handleOnChange (index: number, kpi: string) {
    const kpiListCopy = [ ...kpiList ]
    kpiListCopy[index] = kpi
    setKpiList(kpiListCopy)
    handleChange(kpiListCopy)
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = false

    if (!kpiList || kpiList.length < 1 || !areKpiValid(kpiList)) {
      invalidFieldId = 'kpi-field'
      isInvalid = true
    } 

    return isInvalid ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit({ otherKpi: kpiList })
    }
  }

  function getFormData (): OtherKpiFormData {
    return {
      otherKpi: kpiList
    }
  }

  function fetchData (skipValidation?: boolean): OtherKpiFormData | null{
    if (skipValidation) {
      return getFormData()
    } else if (kpiList) {
      return getFormData()  
    } else {
      return null
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [kpiList])

  return (
    <div className={styles.otherKpi}>
      { !props.skipTitle &&
        <label>{t('--otherKpiForm--.--otherKpi--')}</label>}

      <div>
        {
          kpiList.map((kpi, i) => {
            return (
              <OtherKpiItem
                key={i}
                kpi={kpi}
                forceValidate={forceValidate}
                onChange={(kpi) => handleOnChange(i, kpi)}
                onDelete={() => handledDeleteKpiItem(i)}
              />
            )
          })
        }
      </div>
      <div className={styles.otherKpiBtn} onClick={handleAddKpiItem}>
        <span><Plus size={10} color="#ABABAB" /></span><p>{t('--otherKpiForm--.--addMoreKpi--')}</p>
      </div>

      {
        (props.submitLabel || props.cancelLabel) &&
        <div className={styles.otherKpiCont}>
          <div className={styles.otherKpiContButtons}>
            {props.cancelLabel &&
              <OroButton label={props.cancelLabel} type="secondary" fontWeight="semibold" onClick={handleFormCancel} />
            }
            {props.submitLabel &&
              <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit}/>
            }
          </div>
        </div>
      }
    </div>
  )
}
export function OtherKpiForm (props: OtherKpiFormProps) {
  return <I18Suspense><OtherKpiFormComponent {...props} /></I18Suspense>
}