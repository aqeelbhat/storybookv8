import React, { useEffect, useState } from 'react'
import { ChevronsDown, ChevronsUp } from 'react-feather'
import { ProcessStep } from '../../ProcessStep/types'
import { StandardStepTypes } from '../../ProcessStepsNew/types'
import { hideNotApplicableSteps } from '../latest-review-steps.component'
import styles from './step-row.module.scss'
import { LocalLabels } from '../../CustomFormDefinition'
import { CommonLocalLabels } from '../../CustomFormDefinition/types/localization'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../../i18n';

export type StepRowProps = {
  step: ProcessStep
  hideEstimatedDuration?: boolean
  futuretaskEvaluationFlag?: boolean
  processName?: string
  onGetProcessLocalLabels?: (processName: string) => Promise<LocalLabels | undefined>
  fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
}

function StepRowComponent (props: StepRowProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [subProcessPreviewSteps, setSubProcessPreviewSteps] =  useState<Array<ProcessStep>>([])

  const [taskName, setTaskName] = useState<string>('')
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    if (props.step?.node && props.onGetProcessLocalLabels) {
      props.onGetProcessLocalLabels(props.processName)
        .then((localLabels?: LocalLabels) => {
          const nodeLocalLabels: CommonLocalLabels = (props.step?.node.nodeDefId && localLabels?.[props.step?.node.nodeDefId]) ? (localLabels?.[props.step?.node.nodeDefId] as CommonLocalLabels) : {}
          setTaskName(nodeLocalLabels.name || props.step?.node.name)
        })
        .catch(err => {
          console.log(err)
          setTaskName(props.step?.node.name || '')
        })
    } else {
      setTaskName(props.step?.node?.name || '')
    }
  }, [props.step?.node])

  function toggleAccordinan () {
    setIsExpanded(!isExpanded)
  }

  function getDaysToComplete (estimateDays: number): string {
    return estimateDays === 1 ? t('--estimateDay--',{day:estimateDays}) : t('--estimateDays--',{day:estimateDays})
  }

  useEffect(() => {
    if(isExpanded && props.step.type === StandardStepTypes.Subprocess && props.fetchPreviewSubprocess && props.step?.node?.subprocess?.name) {
      props.fetchPreviewSubprocess(props.step.node?.subprocess?.name)
        .then(resp => {
          setSubProcessPreviewSteps(resp)
        })
        .catch(err => console.log(err))
    }
  }, [isExpanded])

  function getStepName (step: ProcessStep): string {
    let name: string = ''
    if (taskName) {
      name = taskName
    } else if (step?.parallel && taskName) {
      name = taskName
    } else if (step?.parallel && step?.node?.sequenced && !taskName) {
      name = t('--conditionalStep--')
    } else {
      name = t('--parallelStep--')
    }

    return name
  }

  function needToShowAssignedinfo (): boolean {
    if (props.step?.parallel) {
      return false
    } else if (props.step?.type === StandardStepTypes.Subprocess) {
      return false
    } else {
      return true
    }
  }

  return (
    <div className={styles.stepRow}>
      <div className={styles.stepRowUc}>
        <span className={styles.stepRowUcName}>{getStepName(props.step)}</span>
        {
          (props.step?.parallel || props.step?.type === StandardStepTypes.Subprocess) &&
          <>
            { isExpanded && <div className={styles.stepRowUcOpen} onClick={toggleAccordinan}><span className={styles.stepRowUcOpenNum}>{props.step?.node?.totalSteps || props.step?.steps?.length || ''}</span><ChevronsUp color='var(--warm-neutral-light-200)'/></div> }
            { !isExpanded && <div className={styles.stepRowUcClosed} onClick={toggleAccordinan}><span className={styles.stepRowUcClosedNum}>{props.step?.node?.totalSteps || props.step?.steps?.length || ''}</span><ChevronsDown color='var(--warm-neutral-shade-200)'/></div> }
          </>
        }
      </div>
      <div className={styles.stepRowLc}>
        {
          props.step?.parallel &&
          <>
          {
            props.step?.node?.sequenced
              ? <span className={styles.stepRowLcDesc}>{t('--stepsWillBeExecuted--')}</span>
              : <span className={styles.stepRowLcDesc}>{t('--allStepsWillBeExecuted--')}</span>
          }
          </>
        }
        {
          needToShowAssignedinfo() &&
          <>
            <div className={!props.hideEstimatedDuration ? styles.stepRowLcPairs : styles.stepRowLcPair}>
              <span className={styles.stepRowLcPairKey}>{t('--assignedToLabel--')}</span>
              <span className={styles.stepRowLcPairValue}>{props.step?.node?.assignedTo?.name || props.step?.node?.assignedTo?.department || ''}</span>
            </div>
            {
              !props.hideEstimatedDuration &&
              <div className={!props.hideEstimatedDuration ? styles.stepRowLcPairs : styles.stepRowLcPair}>
                <span className={styles.stepRowLcPairKey}>{t('--estDuration--')} </span>
                <span className={styles.stepRowLcPairValue}>{getDaysToComplete(props.step?.node?.estimateDays || 0)}</span>
              </div>
            }
          </>
        }
      </div>
      {
        isExpanded && props.step?.parallel && props.step?.steps?.length > 0 &&
        <div className={styles.stepRowTree}>
          <ul>
            {
              props.step?.steps?.map((step, key) => {
                return (
                  hideNotApplicableSteps(step, !!props.futuretaskEvaluationFlag) &&
                  <li key={key} >
                    <span className={styles.stepRowTreeIndex}></span>
                    <StepRow
                      step={step}
                      hideEstimatedDuration={props.hideEstimatedDuration}
                      futuretaskEvaluationFlag={props.futuretaskEvaluationFlag}
                      processName={props.processName}
                      fetchPreviewSubprocess={props.fetchPreviewSubprocess}
                      onGetProcessLocalLabels={props.onGetProcessLocalLabels}
                    />
                  </li>
                )
              })
            }
          </ul>
        </div>
      }
      {
        isExpanded && props.step?.type === StandardStepTypes.Subprocess && subProcessPreviewSteps?.length > 0 &&
        <div className={styles.stepRowTree}>
          <ul>
            {
              subProcessPreviewSteps.map((step, key) => {
                return (
                  hideNotApplicableSteps(step, !!props.futuretaskEvaluationFlag) &&
                  <li key={key} >
                    <span className={styles.stepRowTreeIndex}></span>
                    <StepRow
                      step={step}
                      hideEstimatedDuration={props.hideEstimatedDuration}
                      processName={props.step.node.subprocess.name}
                      futuretaskEvaluationFlag={props.futuretaskEvaluationFlag}
                      fetchPreviewSubprocess={props.fetchPreviewSubprocess}
                      onGetProcessLocalLabels={props.onGetProcessLocalLabels}
                    />
                  </li>
                )
              })
            }
          </ul>
        </div>
      }
    </div>
  )
  }
export function StepRow (props: StepRowProps) {
  return <I18Suspense><StepRowComponent   {...props} /></I18Suspense>
}