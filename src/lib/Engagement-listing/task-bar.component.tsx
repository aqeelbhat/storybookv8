import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Popover } from 'reactstrap'
import { Clock, Check, MessageCircle, Play, X } from 'react-feather'
import Tooltip from '@mui/material/Tooltip'

import style from './task-bar.module.scss'

import { Engagement, EngagementStatus, InfoRequest, ProcessTask, TaskAssignmentType, TaskStatus } from '../Types'
import { getEngagementCurrentStepFromPendingList, isApprovalTask, isLate, isReviewTask, isTaskAssignedToCurrentUser, isTaskAssignedToPartner, isTaskOwner, isTaskStatusInreview, isTaskStatusPending } from './service'
import { ApprovePopover, OroButton, PopoverOnPrimaryClickProps, POPOVER_OPEN_DELAY } from '../controls'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'

export interface TaskBarProps {
  data: Engagement
  readMode?: boolean
  onApprove?: (engagementId: string, taskId: string, actionMessage: string) => void
  onStartTask?: (engagementId: string, taskId: string) => void
  onTaskContinue?: (engagementId: string, taskId: string) => void
  onTaskViewDetails?: (engagementId: string, taskId: string) => void
}

export function TaskBar (props: TaskBarProps) {
  const [isApprovePopover, setIsApprovePopover] = useState(false)
  const progressContainerRef = useRef<HTMLDivElement>(document.createElement('div'))
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const DAYS = 'days'
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [props.data])

  function getStepsProgressWidth (stepsTotal: number, stepsCompleted: number): string {
    const stepsCompletedPercentage = ((stepsCompleted / stepsTotal) * 100)
    const progressContainerWidth = progressContainerRef.current.clientWidth
    const progressValueWidth = (stepsCompletedPercentage / 100) * progressContainerWidth

    return progressValueWidth === 0 ? '8px' : `${progressValueWidth}px`
  }

  function isEngagementStatusCompleted (): boolean {
    return props.data.status === EngagementStatus.Completed
  }

  function isEngagementStatusPending (): boolean {
    return props.data.status === EngagementStatus.Pending
  }

  function isEngagementStatusInvalid (): boolean {
    return props.data.status === EngagementStatus.Invalid
  }

  function isEngagementStatusFailed (): boolean {
    return props.data.status === EngagementStatus.Failed
  }

  function getAssignedTo (processTask: ProcessTask | null): string {
    let assignedTo = ''
    if (processTask && props.data.variables.partners.length > 0 && processTask.assignmentType === TaskAssignmentType.partner) {
      assignedTo = props.data.variables.partners[0].name
    } else if (processTask) {
      const functionGroup = processTask.functionGroup
      const functionRole = processTask.functionRole
      const groupNames = processTask.groupIds.map(groupId => groupId.groupName).join(', ')
      const userNames = processTask.users.map(user => user.name).join(', ')

      if (processTask.owner.name) {
        assignedTo = processTask.owner.name
      } else if (functionGroup) {
        assignedTo = functionGroup
      } else if (functionRole) {
        assignedTo = functionRole
      } else if (groupNames) {
        assignedTo = groupNames
      } else if (userNames) {
        assignedTo = userNames
      }
    }

    return assignedTo
  }

  function formatDate (date: string): string {
    return moment(date).format('MMM D, YYYY')
  }
  function getEstimatedCompletion (startedDate: string, totalEstimateTime: number, completedTime = 0): string {
    return moment(startedDate).add((totalEstimateTime - completedTime), DAYS).format('MMM D, YYYY')
  }

  function assignedToDurationDiff (date: string): string {
    return moment(date).startOf('minutes').fromNow()
  }

  function getTaskCompletedDays (startDate: string, compltetedDate: string): string {
    let diff = moment(compltetedDate).diff(moment(startDate), DAYS)
    diff = diff === 0 ? 1 : diff
    return diff === 1 ? t('--diffDay--', {diff: diff}) : t('--diffDays--', {diff: diff})
  }

  function togglePopover (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setPopoverOpen(!popoverOpen)
  }

  function hidePopover () {
    setPopoverOpen(false)
  }

  function onApprove (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setTimeout(() => setIsApprovePopover(true), POPOVER_OPEN_DELAY)
  }

  function onApproveConfirm (evt: PopoverOnPrimaryClickProps) {
    const currentStep = getEngagementCurrentStepFromPendingList(props.data.pendingTasks)
    if (currentStep) {
      if (props.onApprove && typeof props.onApprove === 'function') {
        props.onApprove(props.data.id, currentStep.taskId, evt.message || '')
      }
    }
  }

  function onStartTask () {
    const currentStep = getEngagementCurrentStepFromPendingList(props.data.pendingTasks)
    if (currentStep) {
      if (props.onStartTask && typeof props.onStartTask === 'function') {
        props.onStartTask(props.data.id, currentStep.taskId)
      }
    }
  }

  function onViewDetails () {
    const currentStep = getEngagementCurrentStepFromPendingList(props.data.pendingTasks)
    if (currentStep) {
      if (props.onTaskViewDetails && typeof props.onTaskViewDetails === 'function') {
        props.onTaskViewDetails(props.data.id, currentStep.taskId)
      }
    }
  }

  function onTaskContinue () {
    const currentStep = getEngagementCurrentStepFromPendingList(props.data.pendingTasks)
    if (currentStep) {
      if (props.onTaskContinue && typeof props.onTaskContinue === 'function') {
        props.onTaskContinue(props.data.id, currentStep.taskId)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  function getInfoRequestForCurrentTask () : InfoRequest | null {
    let infoRequest: InfoRequest | null = null
    const currentStep = getEngagementCurrentStepFromPendingList(props.data.pendingTasks)

    props.data.infoRequests.forEach((infoRequestElem) => {
      if (currentStep?.taskId === infoRequestElem.taskId) {
        infoRequest = infoRequestElem
      }
    })

    return infoRequest
  }

  function getCurrentStepJsx (processTask: ProcessTask): React.ReactNode {
    return <div className={style.popoverTaskContainer}>
      <div className={style.rowLayout}>
        <div className={style.pendingLabel}>
          <span className={style.pendingLabelText}>{t('--currentStep--')}</span>
          { isLate(processTask.lateTime) && <span className={`${style.pendingCapsule} ${style.pendingCapsuleLate}`}>{t('--late--')}</span> }
        </div>
        <span className={`${style.pendingValue} ${style.popoverStepTitleWidth}`}>{processTask.title}</span>
      </div>
      <div className={style.rowLayout}>
        <span className={style.label}>{t('--assignedTo--')}</span>
        <span className={`${style.value} ${style.popoverAssignedToWidth}`}>{getAssignedTo(processTask)}</span>
      </div>
      <div className={style.rowLayout}>
        <span className={style.label}>{t('--assignedOn--')}</span>
        <div className={style.value}>
          <Clock className={style.icon} size={14} color='#283041' />
          <span className={`${style.value} ${style.popoverAssignedOnWidth}`}>{assignedToDurationDiff(processTask.started)}</span>
        </div>
      </div>
    </div>
  }

  function getMoreStepsPopoverJsx (processTasks: Array<ProcessTask>): React.ReactNode {
    return <>
      { popoverTargetElem && <Popover placement="bottom" isOpen={popoverOpen} target={popoverTargetElem}>
        <div className={style.popoverContainer} onClick={(evt) => evt.stopPropagation()}>
          <div className={style.popoverClose} onClick={hidePopover}>
            <X size={20} color='#262626' />
          </div>
          {getCurrentStepJsx(processTasks[0])}
          {processTasks.slice(1).map((task, index) => <div className={style.popoverTaskContainer} key={index}>
          <div className={style.rowLayout}>
            <span className={`${style.pendingValue} ${style.popoverStepTitleWidth}`}>{task.title}</span>
          </div>
          <div className={style.rowLayout}>
            <span className={`${style.value} ${style.popoverAssignedToWidth}`}>{getAssignedTo(task)}</span>
          </div>
          <div className={style.rowLayout}>
            <div className={style.value}>
              <Clock className={style.icon} size={14} color='#283041' />
              <span className={`${style.value} ${style.popoverAssignedOnWidth}`}>{assignedToDurationDiff(task.started)}</span>
            </div>
          </div>
          </div>)}
        </div>
      </Popover>}
    </>
  }

  function isTaskLate (task: ProcessTask | null): boolean {
    return task ? isLate(task.lateTime) : false
  }

  function getProgressValueStatusFromTaskStatus (): string {
    const task: ProcessTask | null = getEngagementCurrentStepFromPendingList(props.data.pendingTasks)
    if (isEngagementStatusInvalid() || isEngagementStatusFailed()) {
      return style.progressValueDeclined
    }

    if (isTaskLate(task)) {
      return style.progressValueLate
    }

    return style.progressValueGood
  }

  return <div className={`${isTaskOwner(props.data.pendingTasks) ? `${style.container} ${style.containerTaskOwner}` : style.container}`}>
    <div className={`${style.containerColumnProgress} ${props.readMode && style.containerColumnProgressReadonly}`}>
      <div className={style.progressBarContainer}>
        <div className={`${style.progressBar} ${(isEngagementStatusCompleted() || isEngagementStatusPending()) && style.progressBarAlignTop}`} ref={progressContainerRef}>
          <div
            className={`${style.progressValue} ${getProgressValueStatusFromTaskStatus()}`}
            style={{ width: getStepsProgressWidth(props.data.progress.stepsTotal, props.data.progress.stepsCompleted) }}>
          </div>
          { (isEngagementStatusCompleted()) && <div className={style.progressCompleted}>
            <Check size={20} color='#82C146' />
          </div> }
          { (isEngagementStatusInvalid() || isEngagementStatusFailed()) && <div className={style.progressDeclined}>
            <X size={20} color='#BE4236' />
          </div> }
        </div>
        { isEngagementStatusCompleted() && props.data.completed && props.data.started && <div className={style.progressDuration}>
          <Clock className={style.icon} size={14} color='#283041' />
          <span className={style.value}>{getTaskCompletedDays(props.data.started, props.data.completed)}</span>
        </div> }
        { isEngagementStatusPending() && <div className={style.progressDuration}>
          <span className={style.value}>{t('--step--')}: {props.data.progress.stepsCompleted} / {props.data.progress.stepsTotal}</span>
        </div> }
      </div>

      <div className={style.rowLayout}>
        <span className={style.label}>{t('--startedOn--')}</span>
        <span className={style.value}>{formatDate(props.data.started)}</span>
      </div>

      { isEngagementStatusPending() && <div className={style.rowLayout}>
        <span className={style.label}>{t('--estCompletion--')}</span>
        <span className={style.value}>{getEstimatedCompletion(props.data.started, props.data.progress.totalEstimateTime, props.data.progress.completedTime)}</span>
      </div> }

      { isEngagementStatusCompleted() && <div className={style.rowLayout}>
        <span className={style.label}>{t('--completedOn--')}</span>
        <span className={style.value}>{formatDate(props.data.completed)}</span>
      </div> }
    </div>

    { !props.readMode && !isEngagementStatusCompleted() && getEngagementCurrentStepFromPendingList(props.data.pendingTasks) && <div className={style.containerColumnPending}>
      <div className={style.containerColumnPendingRow1}>
        <div className={style.pendingContainer}>
          <div className={style.pendingLabel}>
            <span className={style.pendingLabelText}>{t('--currentStep--')}</span>
            {
              getEngagementCurrentStepFromPendingList(props.data.pendingTasks)?.taskStatus === TaskStatus.rejected
                ? <span className={`${style.pendingCapsule} ${style.pendingCapsuleDeclined}`}>{t('--declined--')}</span>
                : isLate(getEngagementCurrentStepFromPendingList(props.data.pendingTasks)!.lateTime) && <span className={`${style.pendingCapsule} ${style.pendingCapsuleLate}`}>{t('--late--')}</span>
            }
          </div>
          <span className={style.pendingValue}>{getEngagementCurrentStepFromPendingList(props.data.pendingTasks)!.title}</span>
          { props.data.pendingTasks.length > 1 && <>
            <div ref={popoverTargetRef} className={style.pendingMore} onClick={togglePopover}>
             {t('--tasksMore--', {tasks: props.data.pendingTasks.length - 1})}
            </div>
              { getMoreStepsPopoverJsx(props.data.pendingTasks) }
          </> }
        </div>

        <div className={`${style.rowLayout} ${style.rowLayoutFixWidth}`}>
          <span className={style.label}>{t('--assignedTo--')}</span>
          <span className={style.value}>
            <Tooltip title={getAssignedTo(getEngagementCurrentStepFromPendingList(props.data.pendingTasks))}>
              <span className={style.valueWrappedAssignedTo}>
                {getAssignedTo(getEngagementCurrentStepFromPendingList(props.data.pendingTasks))}
              </span>
            </Tooltip>
          </span>
        </div>

        <div className={`${style.rowLayout} ${style.rowLayoutFixWidth}`}>
          <span className={style.label}>{t('--assigned--')}</span>
          <div className={style.value}>
            <Clock className={style.icon} size={14} color='#283041' />
            <span className={style.value}>{assignedToDurationDiff(getEngagementCurrentStepFromPendingList(props.data.pendingTasks)!.started)}</span>
          </div>
        </div>
      </div>
      <div className={style.containerColumnPendingRow2}>
        { getInfoRequestForCurrentTask() && <div className={style.moreInfo}>
          <span className={style.moreInfoLabel}>{t('--requestedMoreInfo--')}</span>
          { getInfoRequestForCurrentTask()?.comment && <div className={style.moreInfoMessageContainer}>
            <MessageCircle className={style.icon} size={21} color='#D48806' />
            <span className={style.moreInfoMessage}>{ getInfoRequestForCurrentTask()?.comment }</span>
          </div> }
        </div> }
        { <div className={`${style.pendingButtons}`}>
            { isTaskAssignedToCurrentUser(props.data.pendingTasks) && <>

              { isApprovalTask(props.data.pendingTasks) && isTaskStatusPending(props.data.pendingTasks) && <>
                  <OroButton label={t('--approve--')} size="medium" type="primary" onClick={onApprove} radiusCurvature="low" fontWeight="semibold" />
                  <ApprovePopover isOpen={isApprovePopover} budget={props.data.variables.projectAmountMoney} onPrimaryActionClick={onApproveConfirm} onPopoverHide={() => setIsApprovePopover(false)}/>
                </>
              }

              { isReviewTask(props.data.pendingTasks) && isTaskStatusPending(props.data.pendingTasks) &&
                <OroButton label={t('--start--')} size="medium" type="primary" onClick={onStartTask} radiusCurvature="low" fontWeight="semibold" />
              }

              { isReviewTask(props.data.pendingTasks) && isTaskStatusInreview(props.data.pendingTasks) &&
                <OroButton label={t('--Continue--')} size="medium" type="primary" icon={<Play size={20} color='#FFFFFF' />} onClick={onTaskContinue} radiusCurvature="low" fontWeight="semibold" />
              }

              { isTaskOwner(props.data.pendingTasks) && !isTaskAssignedToPartner(props.data.pendingTasks) &&
                <OroButton className={style.pendingButtonsViewDetails} label={t('--viewDetails--')} size="medium" type="secondary" onClick={onViewDetails} radiusCurvature="low" fontWeight="semibold" />
              }
            </> }
        </div> }
      </div>
    </div> }

    { isEngagementStatusCompleted() && <div className={`${style.containerColumnStatusCompleted} ${props.readMode && style.containerColumnStatusCompletedReadonly}`}>
      <div className={`${style.rowLayout} ${style.rowLayoutMgLft24}`}>
        <span className={style.label}>{t('--summary--')}</span>
        <span className={style.statusCompletedValue}>{props.data.variables.summary}</span>
      </div>
    </div> }
  </div>
}
