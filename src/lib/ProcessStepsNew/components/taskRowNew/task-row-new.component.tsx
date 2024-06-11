import React, { ReactElement, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import cx from 'classnames'
import 'react-circular-progressbar/dist/styles.css'

import styles from './task-row-new.module.scss'
import PhaseNameIcon from './../../assets/phase-name-icon.svg'
import DiamondIcon from './../../assets/diamond.svg'
import { TaskNew } from './task-new.component'
import { TaskStatus } from '../../../Types'
import { ProcessStep } from '../../..'
import { StandardStepTypes } from '../../types'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../../../i18n'

function GetStatusWiseIndexTab (props: {
    status: string,
    tabIndex?: number,
    progress?: number}
): JSX.Element {
  switch (props.status) {
    case TaskStatus.done:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {8}
            className = {styles.innerTextDone}
            styles={buildStyles({
              textColor: '#FFFFFF',
              pathColor: '#40b5e8',
              trailColor: '#82C146',
              textSize: '42px',
              backgroundColor: '#82C146'
            })}
          />
        </div>
      )
    case TaskStatus.inProgress:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {8}
            className = {styles.innerText}
            styles={buildStyles({
              textColor: '#000000',
              pathColor: '#40b5e8',
              trailColor: '#f0f0f0',
              textSize: '42px'
            })}
          />
        </div>
      )
    case TaskStatus.notStarted:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {8}
            className = {styles.innerText}
            styles={buildStyles({
              textColor: '#000000',
              pathColor: '#40b5e8',
              trailColor: '#E3E3E3',
              textSize: '42px'
            })}
          />
        </div>
      )
    case TaskStatus.pending:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {8}
            className = {styles.innerText}
            styles={buildStyles({
              textColor: '#000000',
              pathColor: '#40b5e8',
              trailColor: '#82C146',
              textSize: '42px'
            })}
          />
        </div>
      )
    case TaskStatus.stopped:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {8}
            className = {styles.innerTextDenied}
            styles={buildStyles({
              textColor: '#FFFFFF',
              pathColor: '#40b5e8',
              trailColor: '#CC483B',
              textSize: '42px',
              backgroundColor: '#82C146'
            })}
          />
        </div>
      )
    case TaskStatus.notApplicable:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {8}
            className = {styles.innerTextSkipped}
            styles={buildStyles({
              textColor: '#ABABAB',
              pathColor: '#40b5e8',
              trailColor: '#E3E3E3',
              textSize: '42px',
              backgroundColor: '#F5F5F5'
            })}
          />
        </div>
      )
    default:
      return (
        null
      )
  }
}
interface taskRowProps {
    step: ProcessStep,
    lastTabIndex: number,
    fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
}
function TaskRowNewComponent (props: taskRowProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  useEffect(() => {
    const bottomLine = document.getElementById('lastBottomLine')!
    const lastStepHeight = document.getElementById('lastStep')!

    if (bottomLine && lastStepHeight) {
      const actualLineHeight = lastStepHeight.offsetHeight + 16
      bottomLine.style.height = `calc(100% - ${actualLineHeight}px)`
    }
  }, [])

  function getSubprocessPreviewStpes (subProcessName: string): Promise<Array<ProcessStep>> {
    if(props.fetchPreviewSubprocess) {
      return props.fetchPreviewSubprocess(subProcessName)
    }
  }

  function getStepProgress (): number {
    if (props.step?.node && props.step?.node?.state) {
      switch (props.step.node.state) {
        case TaskStatus.done:
          return 0
        case TaskStatus.pending:
          return 0
        case TaskStatus.notStarted:
          return 0
        case TaskStatus.rejected:
          return 0
        default :
          return 0
      }
    } else {
      return 0
    }
  }

  function isParallelStepComplete (parallelSteps: ProcessStep[]): boolean {
    let completed: boolean = false
    parallelSteps.forEach(step => {
      if (step.node.state === TaskStatus.done) {
        completed = true
      } else {
        completed = false
      }
    })

    return completed
  }

  function getStateWiseBullet (state: string): ReactElement {
    switch (state) {
      case TaskStatus.notStarted:
        return <span className={styles.taskRowContainerDot}><span className={styles.taskRowContainerDotInner}></span></span>
      case TaskStatus.pending:
        return <span className={styles.taskRowContainerCircle}><span className={styles.taskRowContainerCircleInner}></span></span>
      case TaskStatus.done:
        return <span className={styles.taskRowContainerDone}></span>
      case TaskStatus.stopped:
        return <span className={styles.taskRowContainerDenied}></span>
      case TaskStatus.notApplicable:
        return <span className={styles.taskRowContainerNa}></span>
      default:
        return <></>
    }
  }

  return (
    <div className={styles.taskRow}>
      <div
        className={props.step.index === 1
          ? props.step.node?.assignedTo?.name && props.step.node?.assignedTo?.department
            ? props.step.type === StandardStepTypes.Subprocess
              ? cx(styles.tabs, styles.firstTab)
              : cx(styles.tabs, styles.firstTabDN)
            : cx(styles.tabs, styles.firstTab)
          : styles.tabs
        }
      >
        {
          props.step.index !== 1 &&
          <div className={props.step.node?.assignedTo?.name && props.step?.node?.assignedTo?.department
            ? props.step.type === StandardStepTypes.Subprocess
              ? styles.verticleTop
              : styles.verticleTopDN
            : styles.verticleTop}>
          </div>
        }
        <GetStatusWiseIndexTab
          status={
          props.step.node?.notStarted && props.step.node?.state === TaskStatus.notApplicable
            ? TaskStatus.notApplicable
            : props.step.node?.state
          }
          progress={getStepProgress()}
          tabIndex={props.step.index}
        />
        {
          props.step.index !== props.lastTabIndex &&
          <div className={props.step.node?.state === TaskStatus.done ? styles.verticleDone : styles.verticleBottom}></div>
        }
        {
          props.step.index === props.lastTabIndex && props.step.steps.length > 0 &&
          <div id='lastBottomLine' className={props.step.node?.state === TaskStatus.done ? styles.verticleDone : styles.verticleBottomLine}></div>
        }
      </div>
      <div className={styles.taskRowContainer}>
        {
          props.step.steps.length === 0 &&
          <TaskNew
            step={props.step}
            lastTabIndex={props.lastTabIndex}
            fetchPreviewSubprocess={getSubprocessPreviewStpes}
          />
        }
        {

          props.step.steps.length > 1 &&
          <>
            <div className={styles.taskRowContainerPhase}>
              <div>
                <span className={styles.taskRowContainerPhaseIcon}>
                  {
                    props.step.node?.sequenced ? <img src={DiamondIcon} alt=""/> : <img src={PhaseNameIcon} alt=""/>
                  }
                </span>
                <span className={styles.taskRowContainerPhaseName}>{props.step.node?.name || t('--parallelStep--')}</span>
              </div>
            </div>
            {
              props.step.node.sequenced && <div className={styles.taskRowContainerDash}></div>
            }
            {
              props.step.node.sequenced
                ? <div className={styles.taskRowContainerTree}>
                    <ul>
                      {
                        props.step.steps.map((parallelStep, index) => {
                          return (
                            <li key={index} >
                              <div id={props.step.steps.length === parallelStep.index && props.step.index === props.lastTabIndex ? 'lastStep' : ''}>
                                <TaskNew
                                  key={index}
                                  step={parallelStep}
                                  lastTabIndex={props.step.steps.length}
                                  fetchPreviewSubprocess={getSubprocessPreviewStpes}
                                />
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                : props.step.steps.map((parallelStep, index) => {
                    return (
                      <div key={index} className={styles.taskRowContainerCtn} id={props.step.steps.length === parallelStep.index && props.step.index === props.lastTabIndex ? 'lastStep' : ''}>
                        {
                          getStateWiseBullet(parallelStep?.node?.state || '')
                        }
                        <TaskNew
                          key={index}
                          step={parallelStep}
                          lastTabIndex={props.step.steps.length}
                          fetchPreviewSubprocess={getSubprocessPreviewStpes}
                        />
                      </div>
                    )
                  })
            }
          </>
        }
      </div>
    </div>
  )
}
export function TaskRowNew (props: taskRowProps) {
  return <I18Suspense><TaskRowNewComponent   {...props} /></I18Suspense>
}
