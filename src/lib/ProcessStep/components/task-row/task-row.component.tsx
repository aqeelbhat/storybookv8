import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import cx from 'classnames'
import styles from './task-row.module.scss'
import { TYPE_SUBPROCESS } from './task.component'
import { Task } from './task.component'
import { SkipForward } from 'react-feather'
import React from 'react'
import { ProcessStep, TaskStatus } from '../../types'

function GetStatusWiseIndexTab (props: {status: string, tabIndex?: number, progress?: number}): JSX.Element {
  switch (props.status) {
    case TaskStatus.done:
      return (
        <div className={styles.completedTab}>✓</div>
      )
    case TaskStatus.inProgress:
      return (
        <div className={styles.cirularTabProgress}>
          <CircularProgressbar
            value={props.progress ? props.progress : 0}
            text={props.tabIndex ? `${props.tabIndex}` : ''}
            strokeWidth = {14}
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
            strokeWidth = {14}
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
    case TaskStatus.pending:
      return (
        <div className={styles.requestInfoTab}>?</div>
      )
    case TaskStatus.stopped:
      return (
        <div className={styles.declinedTab}>X</div>
      )
    case TaskStatus.notApplicable:
      return (
        <div className={styles.notApplicableTab}><SkipForward color='#FFFFFF' size={18}/></div>
      )
    default:
      return (
        <div></div>
      )
  }
}

export function TaskRow (props: {step: ProcessStep, subProcessPreviewSteps?: ProcessStep[], lastTabIndex: number, fetchPreviewSubprocess?: (subprocessName: string) => void}) {

  function getSubprocessPreviewStpes (subProcessName: string) {
    if(props.fetchPreviewSubprocess) {
      props.fetchPreviewSubprocess(subProcessName)
    }
  }

  return (
    <div className={styles.taskRow}>
      <div
        className={props.step.index === 1
          ? props.step.node.assignedTo.name && props.step.node.assignedTo.department
            ? props.step.type === TYPE_SUBPROCESS
              ? cx(styles.tabs, styles.firstTab)
              : cx(styles.tabs, styles.firstTabDN)
            : cx(styles.tabs, styles.firstTab)
          : styles.tabs
        }
      >
        {
          props.step.index !== 1 &&
          <div className={props.step.node.assignedTo.name && props.step.node.assignedTo.department
            ? props.step.type === TYPE_SUBPROCESS
              ? styles.verticleTop
              : styles.verticleTopDN
            : styles.verticleTop}>
          </div>
        }
        <GetStatusWiseIndexTab status={TaskStatus.notStarted} tabIndex={props.step.index} />
        {
          props.step.index !== props.lastTabIndex &&
          <div className={styles.verticleBottom}></div>
        }
      </div>
      <div className={styles.taskRowContainer}>
        {
          props.step.steps.length === 0 &&
          <Task step={props.step} subProcessPreviewSteps={props.subProcessPreviewSteps} lastTabIndex={props.lastTabIndex} fetchPreviewSubprocess={getSubprocessPreviewStpes}/>
        }
        {
          props.step.steps.length > 1 &&
          props.step.steps.map((parallelStep, index) => {
            return (
              <Task key={index} step={parallelStep} subProcessPreviewSteps={props.subProcessPreviewSteps} lastTabIndex={props.step.steps.length} fetchPreviewSubprocess={getSubprocessPreviewStpes}/>
            )
          })
        }
      </div>
    </div>
  )
}
