import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Minus } from 'react-feather'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { ProcessStep } from '../ProcessStep/types'
import { StepRow } from './components/step-row.component'
import styles from './latest-review-steps.module.scss'
import { LocalLabels } from '../CustomFormDefinition'
import { TaskStatus } from '../Types'

export type LatestReviewStepsProps = {
  steps: Array<ProcessStep>
  daysToComplete?: number
  hideSteps?: boolean
  minDuration?: string
  maxDuration?: string
  hideEstimatedDuration?: boolean
  futuretaskEvaluationFlag?: boolean
  processName?: string
  onGetProcessLocalLabels?: (processName: string) => Promise<LocalLabels | undefined>
  fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
}

export function hideNotApplicableSteps (step: ProcessStep, futuretaskEvaluationFlag: boolean): boolean {
  return !(step?.node?.state === TaskStatus.notApplicable && futuretaskEvaluationFlag)
}

export function LatestReviewSteps (props: LatestReviewStepsProps) {
  const [showSteps, setShowSteps] = useState<boolean>(false)
  const [firstTwoSteps, setFirstTwoSteps] = useState<Array<ProcessStep>>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    const firstTwoStepsCopy: Array<ProcessStep> = []
    if (props.steps?.length > 0 && !!props.futuretaskEvaluationFlag) {
      props.steps?.forEach(step => {
        if (step.index <= 2 && step.node.state !== TaskStatus.notApplicable) {
          firstTwoStepsCopy.push(step)
        } 
      })
    } else {
      props.steps?.forEach((step, index) => {
        if (index <= 1) {
          firstTwoStepsCopy.push(step)
        } 
      })
    }
    setFirstTwoSteps(firstTwoStepsCopy)
  }, [props.steps, props.futuretaskEvaluationFlag])

  function toggleSteps () {
    setShowSteps(!showSteps)
  }

  function getDaysToComplete (): string {
    return props.daysToComplete === 1 ? `${props.daysToComplete} day` : `${props.daysToComplete} days`
  }

  function needToShowSteps (): boolean {
    if (props.hideSteps) {
      if (showSteps) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  function showVerticleLine (): boolean {
    if (props.hideEstimatedDuration) {
      return false
    } else if (props.hideSteps) {
      return true
    } else if (props.hideSteps && showSteps) {
      return true
    } else {
      return false 
    }
  }

  return (
    <div className={styles.reviewSteps}>
      <div className={styles.reviewStepsTitle}>{t('--processDetails--')}</div>
      {
        !props.hideEstimatedDuration &&
        <div className={styles.reviewStepsBox}>
          <div className={styles.reviewStepsBoxClock}><Clock size={28} color='var(--warm-neutral-shade-100)' /></div>
          <div className={styles.reviewStepsBoxWrap}>
            <div className={styles.reviewStepsBoxWrapEst}>{t('--estimatedDuration--')}</div>
            <div className={styles.reviewStepsBoxWrapDays}>{props.minDuration && props.maxDuration ? <>{props.minDuration}-{props.maxDuration} {t('--days--')}</> : <>{getDaysToComplete()}</> }</div>
          </div>
        </div>
      }
      {
        showVerticleLine()
          ? <span className={styles.reviewStepsVert}></span>
          : <span className={styles.reviewStepsEmpty}></span>
      }
      <div className={styles.reviewStepsTree}>
        {
          needToShowSteps() &&
          <ul className={styles.reviewStepsTreeCnt}>
          {
            !showSteps && firstTwoSteps?.map((step, key) => {
              return (
                hideNotApplicableSteps(step, !!props.futuretaskEvaluationFlag) &&
                <li className={styles.reviewStepsTreeCntItem} key={key} >
                  <span className={styles.reviewStepsTreeCntItemIndex}>{step?.node?.state === TaskStatus.notApplicable ? <Minus size={12} strokeWidth={3} color='var(--warm-neutral-shade-100)'/> : step.index}</span>
                  <StepRow
                    step={step}
                    hideEstimatedDuration={props.hideEstimatedDuration}
                     processName={props.processName}
                    futuretaskEvaluationFlag={props.futuretaskEvaluationFlag}
                    fetchPreviewSubprocess={props.fetchPreviewSubprocess}
                    onGetProcessLocalLabels={props.onGetProcessLocalLabels}
                  />
                </li>
              )
            })
          }
          {
            showSteps && props.steps?.map((step, key) => {
              return (
                hideNotApplicableSteps(step, !!props.futuretaskEvaluationFlag) &&
                <li className={styles.reviewStepsTreeCntItem} key={key} >
                  <span className={styles.reviewStepsTreeCntItemIndex}>{step?.node?.state === TaskStatus.notApplicable ? <Minus size={12} strokeWidth={3} color='var(--warm-neutral-shade-100)'/> : step.index}</span>
                  <StepRow
                    step={step}
                    hideEstimatedDuration={props.hideEstimatedDuration}
                    processName={props.processName}
                    futuretaskEvaluationFlag={props.futuretaskEvaluationFlag}
                    fetchPreviewSubprocess={props.fetchPreviewSubprocess}
                    onGetProcessLocalLabels={props.onGetProcessLocalLabels}
                  />
                </li>
              )
            }) 
          }
        </ul>
        }
        {
          showSteps
            ? <div className={styles.reviewStepsTreeShow}>
                <div className={styles.reviewStepsTreeShowArrow} onClick={toggleSteps}><ChevronUp size={18} color='var(--warm-neutral-shade-200)'/></div>
                <span className={styles.reviewStepsTreeShowLink} onClick={toggleSteps}>{t('--hideSteps--')}</span>
              </div>
            : <div className={styles.reviewStepsTreeShow}>
                <div className={styles.reviewStepsTreeShowArrow} onClick={toggleSteps}><ChevronDown size={18} color='var(--warm-neutral-shade-200)'/></div>
                <span className={styles.reviewStepsTreeShowLink} onClick={toggleSteps}>{t('--showProcessSteps--')}</span>
              </div>
        }
      </div>
    </div>
  )
}
