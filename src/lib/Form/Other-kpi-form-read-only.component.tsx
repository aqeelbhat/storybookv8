import React, { useEffect, useState } from 'react'
import styles from './other-kpi-form-styles.module.scss'
import { OtherKpiReadOnlyFormProps } from './types'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function OtherKpiReadOnlyFormComponent (props: OtherKpiReadOnlyFormProps) {
  const [kpiList, setKpiList] = useState<Array<string>>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
      if (props.formData && props.formData.otherKpi && props.formData.otherKpi.length > 0 )
      {
        setKpiList(props.formData.otherKpi)
      } else {
        setKpiList([''])
      }
    }, [props.formData])

  return (
    <div className={styles.readOnly}>
      <label>{t('--otherKpiForm--.--otherKpi--')}</label>
      <ul>
        {
          kpiList.map((kpi, i) => {
            return (
              <li key={i}>{kpi}</li>
            )
          })
        }
      </ul>
    </div>
  )
}
export function OtherKpiReadOnlyForm (props: OtherKpiReadOnlyFormProps) {
  return <I18Suspense><OtherKpiReadOnlyFormComponent {...props} /></I18Suspense>
}