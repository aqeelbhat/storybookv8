/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useState } from 'react'
import styles from './measure-milestone.module.scss'
import { OroMeasureMilestone, MeasureMilestoneReadonlyProps } from './types'
import moment from 'moment'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function MeasureMilestoneReadonlyComponent (props: MeasureMilestoneReadonlyProps) {
  const [measureMilestoneData, setMeasureMilestoneData] = useState<OroMeasureMilestone | null>(null)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
      if (props.formData) {
        setMeasureMilestoneData(props.formData)
      }
  }, [props.formData])

  function getParsedDateForDisplay (date: string): string {
    return date ? moment(date).format('ddd MMM DD YYYY') : '--'
  }

  return (
    <div className={styles.mdro}>
        <div className={styles.mdroInfo}>
            <div className={styles.mdroInfoName}>
                <label htmlFor="start">{t('--measureMilestone--.--startDate--')}</label>
                <span>{getParsedDateForDisplay(measureMilestoneData?.start)}</span>
            </div>
            <div className={styles.mdroInfoName}>
                <label htmlFor="end">{t('--measureMilestone--.--endDate--')}</label>
                <span>{getParsedDateForDisplay(measureMilestoneData?.end)}</span>
            </div>
        </div>
    </div>
  )
}
export function MeasureMilestoneReadonly (props: MeasureMilestoneReadonlyProps) {
  return <I18Suspense><MeasureMilestoneReadonlyComponent {...props} /></I18Suspense>
}
