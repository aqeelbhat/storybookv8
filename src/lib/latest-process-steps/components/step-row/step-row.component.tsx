import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ChevronsDown, ChevronsUp, Maximize2 } from 'react-feather'

import { ProcessStep, TaskStatus } from '../../../ProcessStep/types'
import { StandardStepTypes } from '../../../ProcessStepsNew/types'
import { Engagement, EngagementStatus } from '../../../Types/engagement'
import { Task } from '../../../Types/task'
import { getInfoDate } from '../../new-process-steps.component'
import { ActiveCard } from './active-card.component'
import { NestedSteps } from './nested-steps.component'

import styles from '../../new-process-steps.module.scss'
import { MasterDataRoleObject } from '../../../Form/types'
import { TeamDetails, User, UserId, Option } from '../../../Types'
import { CommonLocalLabels, LocalLabels } from '../../../CustomFormDefinition'
import { StringMap, useTranslationHook } from '../../../i18n'

type StepRowProps = {
  step: ProcessStep
  engagementData: Engagement | null
  tasks?: Array<Task>
  isPending?: boolean
  isAllStepExpanded?: boolean
  isCurrentUserAdmin?: boolean
  hideActions?: boolean
  processName?: string
  parentStep?: ProcessStep
  onApprove?: (taskId: string, actionMessage: string) => void
  onDeny?: (taskId: string, actionMessage: string) => void
  onUserSearch?: (keyword: string) => Promise<Array<Option>>
  onStartTask?: (taskId: string) => void
  onContinueTask?: (taskId: string) => void
  onShareForms?: (taskId: string, comment: string, email: string) => void
  onResendEmail?: (taskId: string, comment: string, email: string) => void
  onDelegateTo?: (taskId: string, comment: string, user?: UserId) => void
  onReactivateNode?: (processId: string, nodeId: number) => void
  onAddContact?: (taskId: string, contactName: string, email: string, role: string, phone: string) => void
  fetchMasterDataSupplierRoles?: () => Promise<Array<MasterDataRoleObject>>
  getWorkstremMembers?: (code: string) => Promise<TeamDetails>
  getGroupUserList?: (groupId) => Promise<Array<User>>
  onAddApprover?: (taskId: string, comment: string, users: UserId[]) => void
  getAllUsers?: (keyword: string) => Promise<Array<User>>
  fetchPreviewSteps?: (processName: string) => Promise<Array<ProcessStep>>
  fetchProcessSteps?: (subProcessId: string) => Promise<Array<ProcessStep>>
  fetchTaskDetails?: (id: string) => Promise<Task>
  getProcessLocalLabels?: (processName: string) => Promise<LocalLabels | undefined>
  fetchTaskLockedInfo?: (id: string) => Promise<boolean>
}

export const FUNCTION_MATRIX = 'function_matrix'

export function getFormattedDate (date: string): string {
  if (date) {
    return moment(date).format('MMM DD, YYYY | h:mm a')
  } else {
    return ''
  }
}

export function StepRow (props: StepRowProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false)
  const [isStepsExpanded, setIsStepsExpanded] = useState<boolean>(false)
  const [activeSteps, setActiveSteps] = useState<Array<ProcessStep>>([])
  const [activeSecondarySteps, setActiveSecondarySteps] = useState<Array<ProcessStep>>([])
  const { t } = useTranslationHook()

  const activeStepsCopy: Array<ProcessStep> = []
  const activeSecondaryStepsCopy: Array<ProcessStep> = []
  
  function getI18Text (key: string, options?: StringMap): string {
    return t('--progress--.' + key, options) as string
  }

  /* Task name localization */
  const [taskName, setTaskName] = useState<string>('')

  useEffect(() => {
    if (props.getProcessLocalLabels && props.processName && props.step?.node) {
      props.getProcessLocalLabels(props.processName)
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
  }, [props.step?.node?.nodeDefId])

  useEffect(() => {
    setIsStepsExpanded(!!props.isAllStepExpanded)
  }, [props.isAllStepExpanded])

  useEffect(() => {
    if ((props.step?.node?.state === TaskStatus.stopped || props.step?.node?.state === TaskStatus.pending) && props.engagementData) {
      setIsStepsExpanded(true)
    }
  }, [props.step])

  useEffect(() => {
    if ((props.isPending || props.step?.node?.state === TaskStatus.stopped) && !props.step.parallel && !(props.step.type === StandardStepTypes.Subprocess)) {
      setIsDetailsExpanded(true)
    } else if (props.step?.node?.state === TaskStatus.done) {
      setIsDetailsExpanded(false)
    }
  }, [props.isPending])

  function searchActiveStep (steps: Array<ProcessStep>, secondary?: boolean) {
    if (secondary) {
      steps.forEach(step => {
        if (step?.node?.state === TaskStatus.pending && step?.steps?.length === 0) {
          activeSecondaryStepsCopy.push(step)
        }
        if (step?.steps?.length > 0) {
          searchActiveStep(step?.steps, true)
        }
      })
      setActiveSecondarySteps(activeSecondaryStepsCopy)
    } else {
      steps.forEach(step => {
        if (step?.node?.state === TaskStatus.pending && step?.steps?.length === 0) {
          activeStepsCopy.push(step)
        }
        if (step?.steps?.length > 0) {
          searchActiveStep(step?.steps)
        }
      })
      setActiveSteps(activeStepsCopy)
    }
  }

  function searchStoppedStep (steps: Array<ProcessStep>): boolean {
    let stoppedStepFound: boolean = false
    steps.forEach(step => {
      if (step?.node?.state === TaskStatus.stopped) {
        stoppedStepFound = true
      }
      if (step?.steps?.length > 0) {
        searchStoppedStep(step?.steps)
      }
    })

    return stoppedStepFound
  }

  useEffect(() => {
    if (props.step?.steps?.length) {
      if (searchStoppedStep(props.step.steps)) {
        setIsStepsExpanded(true)
      }
    } else if (props.step?.node?.state === TaskStatus.stopped) {
      setIsStepsExpanded(true)
    }
  }, [props.step])

  useEffect(() => {
    if ((props.step.parallel || props.step.type === StandardStepTypes.Subprocess) && props.isPending && props.step?.steps?.length > 0) {
      searchActiveStep(props.step.steps)
    }
    if (!props.step?.type && !props.step.parallel && props.step?.steps?.length > 0) {
      searchActiveStep(props.step.steps, true)
    }
  }, [props.step])

  function getEstimateSentence (status: string): string {
    if (props.engagementData && props.engagementData?.status === EngagementStatus.Invalid && status === TaskStatus.stopped) {
      return getI18Text('--deniedOn--')+':'
    } else if (props.engagementData && props.engagementData?.status === EngagementStatus.Failed && status === TaskStatus.stopped) {
      return getI18Text('--failedOn--')+':'
    } else if (props.engagementData && props.engagementData?.status === EngagementStatus.Cancelled && status === TaskStatus.stopped) {
      return ''
    } else {
      switch (status) {
        case TaskStatus.notStarted:
          return getI18Text('--estimatedDuration--')+':'
        case TaskStatus.done:
          return getI18Text('--completedOn--')+':'
        case TaskStatus.notApplicable:
          return getI18Text('--skippedOn--')+':'
        case TaskStatus.pending:
          return getI18Text('--estimatedCompletion--')+':'
        case TaskStatus.stopped:
          return getI18Text('--failedOn--')+':'
        default:
          return ''
      }
    }
  }

  function getEstimateDays (step: ProcessStep): string {
    if (step.node?.state === TaskStatus.done) {
      return `${step.node?.completed ? getInfoDate(step.node?.completed) : ''}`
    } else if (step.node?.state === TaskStatus.pending) {
      return step.node?.estimateDays ? (step.node?.estimateDays > 1 ? getI18Text('--estimatedDays--', { days: step.node.estimateDays }) : getI18Text('--oneDay--')) : ''
    } else if (step.node?.state === TaskStatus.notStarted) {
      return `${getInfoDate(step?.node?.estimateCompletionDate)}`
    } else {
      return ''
    }
  }

  function getNumberOfSteps (step: ProcessStep): string {
    if (step.parallel) {
      return `${step?.steps?.length || ''}`
    } else if (step.type === StandardStepTypes.Subprocess) {
      return `${step.node?.totalSteps || ''}`
    } else {
      return ''
    }
  }

  function getStatusWiseIndex (status: string, key: number): React.ReactElement {
    switch (status) {
      case TaskStatus.done:
        return <span key={key} className={`${styles.nestedParallelDotsIdv} ${styles.notStartedDot}`}></span>
      case TaskStatus.pending:
        return <span key={key} className={`${styles.nestedParallelDotsIdv} ${styles.pendingDot}`}></span>
      case TaskStatus.notStarted:
        return <span key={key} className={`${styles.nestedParallelDotsIdv} ${styles.notStartedDot}`}></span>
      case TaskStatus.notApplicable:
        return <span key={key} className={`${styles.nestedParallelDotsIdv} ${styles.notStartedDot}`}></span>
      case TaskStatus.rejected:
        return <span key={key} className={`${styles.nestedParallelDotsIdv} ${styles.rejectedDot}`}></span>
      default :
        return <></>
    }
  }

  function isExpandable () {
    if (props.step.parallel || props.step?.type === StandardStepTypes.Subprocess) {
      setIsStepsExpanded(!isStepsExpanded)
    } else {
      setIsDetailsExpanded(true)
    }
  }

  return (
    <>
      {
        !isDetailsExpanded
          ? <div className={styles.container} onClick={isExpandable}>
              <div className={styles.containerUc}>
                <span className={styles.containerUcName}>{taskName || (props.step?.parallel ? getI18Text('--parallelSteps--') : '')}</span>
                {
                  (!props.step?.parallel && props.step?.type !== StandardStepTypes.Subprocess)
                    ? <div className={styles.icon}><Maximize2 size={14} color='var(--warm-neutral-shade-200)'/></div>
                    : <div className={isStepsExpanded ? `${styles.open} ${styles.chevron}` : styles.chevron}>
                        <span className={isStepsExpanded ? `${styles.openChevron} ${styles.number}` : styles.number}>
                        {getNumberOfSteps(props.step)}
                        </span>
                        {
                          isStepsExpanded
                            ? <>
                                <span className={styles.gray}><ChevronsUp size={14} color={isStepsExpanded ? 'var(--coco-chalk)' : 'var(--warm-neutral-shade-200)'}/></span>
                                <span className={styles.white}><ChevronsUp size={14} color='var(--coco-chalk)'/></span>
                              </>
                            : <>
                                <span className={styles.gray}><ChevronsDown size={14} color='var(--warm-neutral-shade-200)'/></span>
                                <span className={styles.white}><ChevronsDown size={14} color='var(--coco-chalk)'/></span>
                              </>
                        }
                      </div>
                }
              </div>
              {
                isStepsExpanded && props.step?.parallel && props.step?.node?.sequenced && <div className={styles.containerParallel}>{getI18Text('--anyOneStepWillBeExecuted--')}</div>
              }
              {
                isStepsExpanded && props.step?.parallel && !props.step?.node?.sequenced && <div className={styles.containerParallel}>{getI18Text('--allStepsWillBeExecutedInParallel--')}</div>
              }
              {
                !props.step?.parallel && props.step?.type !== StandardStepTypes.Subprocess &&
                <div className={styles.containerLc}>
                  {
                    props.step?.node?.state !== TaskStatus.notApplicable &&
                    <div className={styles.containerLcAssign}>
                      <span className={styles.containerLcKey}>{getI18Text('--assignedTo--')}:</span>
                      {
                        props.step?.node?.assignedTo?.assignmentType === FUNCTION_MATRIX && props.step?.node?.state !== TaskStatus.done
                          ? <span className={styles.containerLcValue}>{props.step?.node?.assignedTo?.department || ''}</span>
                          : <span className={styles.containerLcValue}>{props.step?.node?.assignedTo?.name || ''}</span>
                      }
                    </div>
                  }
                  <div className={styles.containerLcEstimate}>
                    <span className={styles.containerLcKey}>{getEstimateSentence(props?.step.node?.state || '')}</span>
                    <span className={styles.containerLcValue}>{getEstimateDays(props?.step)}</span>
                  </div>
                </div>
              }
            </div>
          : <ActiveCard
              step={props.step}
              parentStep={props.parentStep}
              engagementData={props.engagementData}
              tasks={props.tasks}
              isCurrentUserAdmin={props.isCurrentUserAdmin}
              hideActions={props.hideActions}
              processName={props.processName}
              onApprove={props.onApprove}
              onDeny={props.onDeny}
              onDelegateTo={props.onDelegateTo}
              onUserSearch={props.onUserSearch}
              onCollapseDetails={() => setIsDetailsExpanded(false)}
              onStartTask={props.onStartTask}
              onContinueTask={props.onContinueTask}
              onShareForms={props.onShareForms}
              onResendEmail={props.onResendEmail}
              onReactivateNode={props.onReactivateNode}
              onAddContact={props.onAddContact}
              fetchMasterDataSupplierRoles={props.fetchMasterDataSupplierRoles}
              getWorkstremMembers={props.getWorkstremMembers}
              getGroupUserList={props.getGroupUserList}
              getAllUsers={props.getAllUsers}
              onAddApprover={props.onAddApprover}
              fetchTaskDetails={props.fetchTaskDetails}
              getProcessLocalLabels={props.getProcessLocalLabels}
              fetchTaskLockedInfo={props.fetchTaskLockedInfo}
            />
      }
      {
        isStepsExpanded &&
        <NestedSteps
          step={props.step}
          tasks={props.tasks}
          engagementData={props.engagementData}
          isStepsExpanded={isStepsExpanded}
          isAllStepExpanded={!!props.isAllStepExpanded}
          isCurrentUserAdmin={props.isCurrentUserAdmin}
          hideActions={props.hideActions}
          processName={props.processName}
          onApprove={props.onApprove}
          onDeny={props.onDeny}
          onDelegateTo={props.onDelegateTo}
          onUserSearch={props.onUserSearch}
          onStartTask={props.onStartTask}
          onContinueTask={props.onContinueTask}
          onShareForms={props.onShareForms}
          onResendEmail={props.onResendEmail}
          onReactivateNode={props.onReactivateNode}
          onAddContact={props.onAddContact}
          fetchMasterDataSupplierRoles={props.fetchMasterDataSupplierRoles}
          getWorkstremMembers={props.getWorkstremMembers}
          getGroupUserList={props.getGroupUserList}
          getAllUsers={props.getAllUsers}
          onAddApprover={props.onAddApprover}
          fetchPreviewSteps={props.fetchPreviewSteps}
          fetchProcessSteps={props.fetchProcessSteps}
          fetchTaskDetails={props.fetchTaskDetails}
          fetchTaskLockedInfo={props.fetchTaskLockedInfo}
        />
      }
      {
        !isStepsExpanded && (props.step.parallel || props.step.type === StandardStepTypes.Subprocess || (!props.step?.type && !props.step.parallel && props.step?.steps?.length > 0)) &&
        props.isPending && props.step?.steps?.length > 0 && (activeSteps.length > 0 || activeSecondarySteps.length > 0) &&
        <div className={`${styles.tree} ${styles.nestedParallel}`}>
          <div className={styles.nestedParallelDots}>
            {
              props.step.steps.map((step, key) => {
                return (
                  getStatusWiseIndex(step.node.state, key)
                )
              })
            }
          </div>
          {
            activeSteps.length > 0 &&
            <div className={styles.nestedParallelCnt}>
              {
                activeSteps.map((step, key) => {
                  return (
                    step?.node?.state === TaskStatus.pending &&
                    <div key={key} className={styles.nestedParallelCntWrp}>
                      <ActiveCard
                        step={step}
                        parentStep={props.parentStep}
                        engagementData={props.engagementData}
                        tasks={props.tasks}
                        isCurrentUserAdmin={props.isCurrentUserAdmin}
                        hideActions={props.hideActions}
                        processName={props.processName}
                        onApprove={props.onApprove}
                        onDeny={props.onDeny}
                        onDelegateTo={props.onDelegateTo}
                        onUserSearch={props.onUserSearch}
                        onCollapseDetails={() => setIsDetailsExpanded(false)}
                        onStartTask={props.onStartTask}
                        onContinueTask={props.onContinueTask}
                        onShareForms={props.onShareForms}
                        onResendEmail={props.onResendEmail}
                        onReactivateNode={props.onReactivateNode}
                        onAddContact={props.onAddContact}
                        fetchMasterDataSupplierRoles={props.fetchMasterDataSupplierRoles}
                        getWorkstremMembers={props.getWorkstremMembers}
                        getGroupUserList={props.getGroupUserList}
                        getAllUsers={props.getAllUsers}
                        onAddApprover={props.onAddApprover}
                        fetchTaskDetails={props.fetchTaskDetails}
                        getProcessLocalLabels={props.getProcessLocalLabels}
                        fetchTaskLockedInfo={props.fetchTaskLockedInfo}
                      />
                    </div>
                  )
                })
              }
            </div>
          }
          {
            activeSecondarySteps.length > 0 &&
            <div className={styles.nestedParallelCnt}>
              {
                activeSecondarySteps.map((step, key) => {
                  return (
                    step?.node?.state === TaskStatus.pending &&
                    <div key={key} className={styles.nestedParallelCntWrp}>
                      <ActiveCard
                        step={step}
                        parentStep={props.parentStep}
                        engagementData={props.engagementData}
                        tasks={props.tasks}
                        isCurrentUserAdmin={props.isCurrentUserAdmin}
                        hideActions={props.hideActions}
                        processName={props.processName}
                        onApprove={props.onApprove}
                        onDeny={props.onDeny}
                        onDelegateTo={props.onDelegateTo}
                        onUserSearch={props.onUserSearch}
                        onCollapseDetails={() => setIsDetailsExpanded(false)}
                        onStartTask={props.onStartTask}
                        onContinueTask={props.onContinueTask}
                        onShareForms={props.onShareForms}
                        onResendEmail={props.onResendEmail}
                        onReactivateNode={props.onReactivateNode}
                        onAddContact={props.onAddContact}
                        fetchMasterDataSupplierRoles={props.fetchMasterDataSupplierRoles}
                        getWorkstremMembers={props.getWorkstremMembers}
                        getGroupUserList={props.getGroupUserList}
                        getAllUsers={props.getAllUsers}
                        onAddApprover={props.onAddApprover}
                        fetchTaskDetails={props.fetchTaskDetails}
                        getProcessLocalLabels={props.getProcessLocalLabels}
                        fetchTaskLockedInfo={props.fetchTaskLockedInfo}
                      />
                    </div>
                  )
                })
              }
            </div>
          }
        </div>
      }
    </>
  )
}
