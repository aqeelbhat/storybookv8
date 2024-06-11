import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Check, X } from 'react-feather'
import styles from './task-row.module.scss'
import { Tooltip } from '@mui/material'
import classNames from 'classnames'
import { ProcessStep, TaskStatus } from '../../types'

export enum InfoType {
  complete = 'complete',
  rejected = 'rejected',
  approved = 'approved',
  requestForInfo = 'requestForInfo',
  assigned = 'assigned',
  taskStarted = 'taskStarted'
}

export const TYPE_SUBPROCESS = 'Subprocess'

export function Task (props: {step: ProcessStep, subProcessPreviewSteps?: ProcessStep[],  lastTabIndex?: number, isSubprocess?: boolean, fetchPreviewSubprocess?: (subprocessName: string) => void}) {
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [subProcessPreviewSteps, setSubProcessPreviewSteps] =  useState<Array<ProcessStep>>([])

  useEffect(() => {
    if(props.subProcessPreviewSteps) {
      setSubProcessPreviewSteps(props.subProcessPreviewSteps)
    }
  }, [props.subProcessPreviewSteps])

  useEffect(() => {
    if(accordionOpen && props.step.type === TYPE_SUBPROCESS && props.fetchPreviewSubprocess && props.step?.node?.subprocess?.name) {
      props.fetchPreviewSubprocess(props.step.node.subprocess.name)
    }
  }, [accordionOpen])


  function toggleAccordion () {
    setAccordionOpen(!accordionOpen)
  }

  function isAccordianOpen (): boolean {
    let isOpen = true
    if (props.step && props.step.node && props.step.node.state) {
      if (props.step.node.state === TaskStatus.notStarted) {
        if (props.step.type === TYPE_SUBPROCESS) {
          isOpen =  true
        } else {
          isOpen =  false
        }
      }
      if (props.step.node.state === TaskStatus.notApplicable) {
        if (props.step.node.taskId) {
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

  function getClassName (status: string): string {
    return status === TaskStatus.notApplicable
          ? props.isSubprocess
            ? styles.taskRowAccordionNotApplicableSub
            : styles.taskRowAccordionNotApplicable
          : props.isSubprocess
            ? styles.taskRowAccordionSubProcess
            : styles.taskRowAccordionName
  }
  
  return (
    <div className={(props.step.index !== props.lastTabIndex) ? styles.btmBorder : styles.noBorder}>
        <div className={styles.taskRowAccordion}>
        {
          accordionOpen && isAccordianOpen()
            ? <span className={props.step.type === TYPE_SUBPROCESS ? classNames(styles.taskRowAccordionArrow, styles.taskRowAccordionSubArrow) : styles.taskRowAccordionArrow} onClick={toggleAccordion}><ChevronDown size={24} color='#7d97b5'/></span>
            : <span className={props.step.type === TYPE_SUBPROCESS ? classNames(styles.taskRowAccordionArrow, styles.taskRowAccordionSubArrow) : styles.taskRowAccordionArrow} onClick={toggleAccordion}><ChevronRight size={24} color='#7d97b5'/></span>
        }
        <span className={getClassName(props.step.node.state)}>
          {props.step.node.name}
          <div className={styles.taskRowAccordionSubTask}>
            {
              props.step.type === TYPE_SUBPROCESS && props.step.node.totalSteps
                ? props.step.node.totalSteps > 1 ? `${props.step.node.totalSteps} sub tasks` : `${props.step.node.totalSteps} sub task`
                : ''
            }
          </div>
        </span>
        <span className={props.step.node.assignedTo.name && props.step.node.assignedTo.department ? styles.taskRowAccordionAssignTo : styles.taskRowAccordionAssignToDn}>
          <span className={styles.taskRowAccordionAssignToDep}>{props.step.node.assignedTo.department ? props.step.node.assignedTo.department : ''}</span>
          <Tooltip title={props.step.node.assignedTo.name}><span className={styles.taskRowAccordionAssignToName}>{props.step.node.assignedTo.name}</span></Tooltip>
        </span>
        </div>
        {
          accordionOpen && isAccordianOpen() &&
          <div className={styles.taskRowAccordionBox}>
            {
              props.step.type === TYPE_SUBPROCESS &&
              <div className={styles.topBorder}>
                {
                  subProcessPreviewSteps &&
                  subProcessPreviewSteps.map((subStep, index) => {
                    return (
                      <Task key={index} step={subStep} lastTabIndex={subProcessPreviewSteps.length} isSubprocess={true} />
                    )
                  })
                }
              </div>
            }
          </div>
        }
      </div>
  )
}
