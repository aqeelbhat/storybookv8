import React, { useEffect, useState } from 'react'
import { Clipboard, CheckCircle, Play, ChevronDown, ChevronUp, Zap, GitPullRequest, File, Bell } from 'react-feather'
import { Tooltip } from '@mui/material'

import styles from './task-row-new.module.scss'
import { StandardStepTypes } from '../../types'
import { TaskStatus } from '../../../Types/engagement'
import { ProcessStep } from '../../../ProcessStep/types'
import { TaskRowNew } from './task-row-new.component'

/* eslint-disable */
export enum InfoType {
  complete = 'complete',
  rejected = 'rejected',
  approved = 'approved',
  requestForInfo = 'requestForInfo',
  assigned = 'assigned',
  taskStarted = 'taskStarted'
}

const FUNCTION_MATRIX = 'function_matrix'

export function TaskNew (props: {
    step: ProcessStep, lastTabIndex?: number,
    isSubprocess?: boolean,
    fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
}) {
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [subProcessPreviewSteps, setSubProcessPreviewSteps] =  useState<Array<ProcessStep>>([])

  useEffect(() => {
    if(accordionOpen && props.step.type === StandardStepTypes.Subprocess && props.fetchPreviewSubprocess && props.step?.node?.subprocess?.name) {
      props.fetchPreviewSubprocess(props.step.node?.subprocess?.name)
        .then(resp => {
          setSubProcessPreviewSteps(resp)
        })
        .catch(err => console.log(err))
    }
  }, [accordionOpen])

  function toggleAccordion () {
    setAccordionOpen(!accordionOpen)
  }

  function getSubprocessPreviewStpes (subProcessName: string): Promise<Array<ProcessStep>> {
    if(props.fetchPreviewSubprocess) {
      return props.fetchPreviewSubprocess(subProcessName)
    }
  }

  function getClassName (status: string): string {
    return status === TaskStatus.stopped
      ? props.isSubprocess
        ? styles.taskRowAccordionDeclinedSub
        : styles.taskRowAccordionDeclined
      : status === TaskStatus.notApplicable
          ? props.isSubprocess
            ? styles.taskRowAccordionNotApplicableSub
            : styles.taskRowAccordionNotApplicable
          : props.isSubprocess
            ? styles.taskRowAccordionSubProcess
            : styles.taskRowAccordionName
  }

  function isAccordianOpen (): boolean {
    let isOpen = true
    if (props.step && props.step.node && props.step.node?.state) {
      if (props.step.node.state === TaskStatus.notStarted) {
        if (props.step.type === StandardStepTypes.Subprocess) {
          isOpen =  true
        } else {
          isOpen =  false
        }
      }
      if (props.step.node.state === TaskStatus.notApplicable) {
        if (props.step.node?.taskId) {
          isOpen = true
        } else if (props.step.type === StandardStepTypes.Subprocess) {
          isOpen = true
        } else {
          isOpen =  false
        }
      }
    } else {
      isOpen = true
    }

    return isOpen
  }

  function getIcon (type: string): React.ReactElement {
    if (type) {
      switch(type) {
        case StandardStepTypes.Approval:
          return <CheckCircle size={16} color='var(--warm-stat-mint-mid)'/>
        case StandardStepTypes.Review:
          return <Clipboard size={16} color='var(--warm-stat-honey-regular)' />
        case StandardStepTypes.DocumentCollection:
          return <File size={16} color='var(--dark-blue-icon-color)'/>
        case StandardStepTypes.ToDo:
          return <Zap size={16} color='var(--warm-stat-chilli-mid)'/>
        case StandardStepTypes.Api:
          return <Play size={16} color='var(--dark-blue-icon-color)'/>
        case StandardStepTypes.Subprocess:
          return <GitPullRequest size={16} color='var(--light-blue-icon-color)'/>
        case StandardStepTypes.Notification:
            return <Bell size={16} color='var(--warm-stat-chilli-mid)'/>
        default:
          return <></>
      }
    } else {
      return <></>
    }
  }

  function getTaskNameClass (status: string) {
    if (status === TaskStatus.pending) {
      return styles.taskRowAccordionCurrent
    } else if (status === TaskStatus.notApplicable) {
      return styles.taskRowAccordionSkipped
    } else {
      return styles.taskRowAccordionOther
    }
  }
  
  return (
    <div>
      <div className={props.step.node.state === TaskStatus.notApplicable ? `${styles.taskRowAccordion}` : styles.taskRowAccordion} onClick={toggleAccordion}>
        <div className={getClassName(props.step.node.state)}>
          <div className={styles.taskRowAccordionNameBox}>
            <span className={styles.taskRowAccordionIcon}>{getIcon(props.step.type)}</span>
            <span className={getTaskNameClass(props.step.node?.state)}>{props.step.node?.name || ''}</span>
            {/* {
              props.step.type === StandardStepTypes.Subprocess && props.step.node.totalSteps > 0 &&
              <span className={styles.taskRowAccordionSubTask}>
                {
                  props.step.node.totalSteps
                    ? props.step.node.totalSteps > 1 ? `${props.step.node.totalSteps} sub tasks` : `${props.step.node.totalSteps} sub task`
                    : ''
                }
              </span>
            } */}
          </div>
          {
            props.step.node.description &&
            <div className={styles.taskRowAccordionDesc}>{props.step.node.description}</div>
          }
        </div>
        <span className={props.step.node?.assignedTo?.name && props.step.node?.assignedTo?.department ? styles.taskRowAccordionAssignTo : styles.taskRowAccordionAssignToDn}>
          <span className={styles.taskRowAccordionAssignToDep}>{props.step.node?.assignedTo?.department ? props.step.node?.assignedTo?.department : ''}</span>
          {
            props.step.node?.assignedTo?.assignmentType !== FUNCTION_MATRIX &&
            <Tooltip title={props.step.node?.assignedTo?.name || ''}><span className={props.step.node.state === TaskStatus.notApplicable ? styles.taskRowAccordionAssignToSkipped : styles.taskRowAccordionAssignToName}>{props.step.node?.assignedTo?.name || ''}</span></Tooltip>
          }
        </span>
        {
          accordionOpen && isAccordianOpen()
          ? <span className={styles.taskRowAccordionArrow} >{props.step.type === StandardStepTypes.Subprocess && <ChevronUp size={18} color='#3E4456'/>}</span>
          : <span className={styles.taskRowAccordionArrow} >{props.step.type === StandardStepTypes.Subprocess && <ChevronDown size={18} color='#3E4456'/>}</span>
        }
      </div>
      {
        accordionOpen && isAccordianOpen() &&
        <div className={styles.taskRowAccordionBox}>
          {
            props.step.type === StandardStepTypes.Subprocess &&
            <div>
              {
                subProcessPreviewSteps.length > 0 &&
                subProcessPreviewSteps.map((subStep, index) => {
                  return (
                    <TaskRowNew
                      key={index}
                      step={subStep}
                      lastTabIndex={subProcessPreviewSteps.length}
                      fetchPreviewSubprocess={getSubprocessPreviewStpes}
                    />
                  )
                }
                )
              }
            </div>
          }
        </div>
      }
    </div>
  )
}

