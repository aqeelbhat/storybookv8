import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Check, Minus } from 'react-feather'

import { MasterDataRoleObject } from '../Form/types'
import { mapProcessStepInfo } from '../ProcessStep/mapper'
import { ProcessStep, ProcessStepInfo, TaskStatus } from '../ProcessStep/types'
import { TeamDetails, User, UserId } from '../Types/common'
import { Engagement, EngagementStatus } from '../Types/engagement'
import { Task, Option } from '../Types'
import { StepRow } from './components/step-row/step-row.component'

import styles from './new-process-steps.module.scss'
import { LocalLabels } from '../CustomFormDefinition'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'

export type NewProcessStepsProps = {
  engagementData: Engagement | null
  isCurrentUserAdmin: boolean
  processStepInfoData: ProcessStepInfo | null
  hideActions?: boolean
  onApprove?: (taskId: string, actionMessage: string) => void
  onDeny?: (taskId: string, actionMessage: string) => void
  onStartTask?: (taskId: string) => void
  onContinueTask?: (taskId: string) => void
  onShareForms?: (taskId: string, comment: string, email: string) => void
  onResendEmail?: (taskId: string, comment: string, email: string) => void
  onDelegateTo?: (taskId: string, comment: string, user?: UserId) => void
  onUserSearch?: (keyword: string) => Promise<Array<Option>>
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

export function getInfoDate (date: string): string {
  if (date) {
    return moment(date).format('MMM DD, yyyy')
  } else {
    return ''
  }
}

export function isLate (lateDate: string): boolean {
  return lateDate ? Date.now() > new Date(lateDate).getTime() : false
}

export function isTaskLate (step: ProcessStep | null, tasks: Task[]): boolean {
  let isTaskLate = false
  if (tasks?.length > 0) {
    tasks.forEach((task: Task) => {
      if (task.id === step?.node?.taskId) {
        isTaskLate = isLate(task.lateDate)
      }
    })
  }

  return isTaskLate
}

export function NewProcessSteps (props: NewProcessStepsProps) {
  const [processStepInfo, setProcessStepInfo] = useState<ProcessStepInfo | null>(null)
  const [isPreviousStepsVisible, setIsPreviousStepsVisible] = useState<boolean>(false)
  const { t } = useTranslationHook()

  function getI18Text (key: string): string {
    return t('--progress--.' + key)
  }

  useEffect(() => {
    if (props.processStepInfoData) {
      setProcessStepInfo(mapProcessStepInfo(props.processStepInfoData))
    }
  }, [props.processStepInfoData])

  useEffect(() => {
    if (processStepInfo?.steps && processStepInfo?.steps?.length > 0) {
      setIsPreviousStepsVisible(processStepInfo.steps.some((step) => step.node.state === TaskStatus.done))
    }
  }, [processStepInfo])

  function getStatusWiseIndex (status: string, step: ProcessStep): React.ReactElement {
    if (isTaskLate(step, processStepInfo && processStepInfo.tasks ? processStepInfo.tasks : [])) {
      return <span className={`${styles.treeIndex} ${styles.late}`}>{step.index}</span>
    } else {
      switch (status) {
        case TaskStatus.done:
          return <span className={`${styles.treeIndex} ${styles.done}`}><Check size={12} strokeWidth={3} color='var(--warm-stat-mint-mid)'/></span>
        case TaskStatus.pending:
          return <span className={`${styles.treeIndex} ${styles.pending}`}>{step.index}</span>
        case TaskStatus.notStarted:
          return <span className={`${styles.treeIndex} ${styles.notStarted}`}>{step.index}</span>
        case TaskStatus.notApplicable:
          if (step?.node?.notStarted) {
            return <span className={`${styles.treeIndex} ${styles.notStarted}`}>{step.index}</span>
          } else {
            return <span className={`${styles.treeIndex} ${styles.na}`}><Minus size={12} strokeWidth={3} color='var(--warm-neutral-shade-100)'/></span>
          }
        case TaskStatus.rejected:
          return <span className={`${styles.treeIndex} ${styles.rejected}`}>{step.index}</span>
        case TaskStatus.stopped:
          return <span className={`${styles.treeIndex} ${styles.rejected}`}>{step.index}</span>
        default :
          return <></>
      }
    }
  }

  function getDoneTimelineClass (step: ProcessStep): string {
    if ((step?.node?.state === TaskStatus.done) || (step?.node?.state === TaskStatus.notApplicable && !step?.node?.notStarted)) {
      return styles.doneLine
    } else {
      return ''
    }
  }

  function needToHideSteps (step: ProcessStep): boolean {
    if (props.engagementData?.status === EngagementStatus.Completed) {
      return true
    } else if (step?.node?.state === TaskStatus.notApplicable && !step?.node?.notStarted) {
      return false
    } else if (step.node.state !== TaskStatus.done) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={`${styles.newProcess} formContainer`}>
      <div className={styles.tree}>
        {
          isPreviousStepsVisible && processStepInfo && processStepInfo?.steps?.length > 0 && props.engagementData?.status !== EngagementStatus.Completed &&
          <div>
            <span className={styles.hiddenSteps} onClick={() => setIsPreviousStepsVisible(false)}>{getI18Text('--viewPreviousSteps--')}</span>
            <span className={styles.vertLine}></span>
          </div>
        }
        <ul>
          {
            processStepInfo?.steps.map((step, key) => {
              return (
                isPreviousStepsVisible
                  ? needToHideSteps(step) &&
                    <li key={key} className={getDoneTimelineClass(step)}>
                      {getStatusWiseIndex(step?.node?.state || '', step)}
                      <StepRow
                        step={step}
                        tasks={processStepInfo?.tasks || []}
                        engagementData={props.engagementData}
                        isPending={step?.node?.state === TaskStatus.pending}
                        isCurrentUserAdmin={props.isCurrentUserAdmin}
                        hideActions={props.hideActions}
                        processName={props.engagementData?.currentRequest?.processName || ''}
                        onApprove={props.onApprove}
                        onDeny={props.onDeny}
                        onUserSearch={props.onUserSearch}
                        onDelegateTo={props.onDelegateTo}
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
                        getProcessLocalLabels={props.getProcessLocalLabels}
                        fetchTaskLockedInfo={props.fetchTaskLockedInfo}
                      />
                    </li>
                  : <li key={key} className={getDoneTimelineClass(step)}>
                      {getStatusWiseIndex(step?.node?.state || '', step)}
                      <StepRow
                        step={step}
                        tasks={processStepInfo?.tasks || []}
                        engagementData={props.engagementData}
                        isPending={step?.node?.state === TaskStatus.pending}
                        isCurrentUserAdmin={props.isCurrentUserAdmin}
                        hideActions={props.hideActions}
                        processName={props.engagementData?.currentRequest?.processName || ''}
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
                        getProcessLocalLabels={props.getProcessLocalLabels}
                        fetchTaskLockedInfo={props.fetchTaskLockedInfo}
                      />
                    </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}
