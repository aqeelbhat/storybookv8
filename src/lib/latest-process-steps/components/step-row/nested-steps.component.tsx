import React, { useEffect, useState } from 'react'
import { Check, Minus } from 'react-feather'

import { StepRow } from './step-row.component'
import { ProcessStep, TaskStatus } from '../../../ProcessStep/types'
import { Engagement, Option } from '../../../Types'
import { Task } from '../../../Types/task'
import { TeamDetails, User, UserId } from '../../../Types/common'
import { StandardStepTypes } from '../../../ProcessStepsNew/types'

import styles from '../../new-process-steps.module.scss'
import { MasterDataRoleObject } from '../../../Form/types'
import { LocalLabels } from '../../../CustomFormDefinition'

type NetstedStepsProps = {
  step: ProcessStep
  engagementData: Engagement | null
  tasks?: Array<Task>
  isStepsExpanded: boolean
  isAllStepExpanded?: boolean
  isCurrentUserAdmin?: boolean
  hideActions?: boolean
  processName?: string
  parentStep?: ProcessStep
  onApprove?: (taskId: string, actionMessage: string) => void
  onDeny?: (taskId: string, actionMessage: string) => void
  onStartTask?: (taskId: string) => void
  onContinueTask?: (taskId: string) => void
  onShareForms?: (taskId: string, comment: string, email: string) => void
  onResendEmail?: (taskId: string, comment: string, email: string) => void
  onUserSearch?: (keyword: string) => Promise<Array<Option>>
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

export function NestedSteps (props: NetstedStepsProps) {
  const [subProcessPreviewSteps, setSubProcessPreviewSteps] = useState<Array<ProcessStep>>([])

  useEffect(() => {
    if (props.isStepsExpanded && props.step && props.step.type === StandardStepTypes.Subprocess && (props.step?.node?.state !== TaskStatus.done && props.step?.node?.state !== TaskStatus.pending)) {
      if (props.fetchPreviewSteps) {
        props.fetchPreviewSteps(props.step.node?.subprocess?.name)
          .then(resp => {
            setSubProcessPreviewSteps(resp)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }, [props.step, props.isStepsExpanded])

  useEffect(() => {
    if (props.isStepsExpanded && props.step && props.step.type === StandardStepTypes.Subprocess && props.step?.node?.state === TaskStatus.done) {
      if (props.fetchProcessSteps) {
        props.fetchProcessSteps(props.step.node.subprocessId)
          .then(resp => {
            setSubProcessPreviewSteps(resp)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }, [props.step, props.isStepsExpanded])

  function getStatusWiseIndex (status: string, step: ProcessStep): React.ReactElement {
    switch (status) {
      case TaskStatus.done:
        return <span className={`${styles.treeIndexDot} ${styles.doneDot}`}><Check size={8} strokeWidth={3} color='var(--warm-stat-mint-mid)'/></span>
      case TaskStatus.pending:
        return <span className={`${styles.treeIndexDot} ${styles.pendingDot}`}></span>
      case TaskStatus.notStarted:
        return <span className={`${styles.treeIndexDot} ${styles.notStartedDot}`}></span>
      case TaskStatus.notApplicable:
        if (step?.node?.notStarted) {
          return <span className={`${styles.treeIndexDot} ${styles.notStartedDot}`}></span>
        } else {
          return <span className={`${styles.treeIndexDot} ${styles.naDot}`}><Minus size={8} strokeWidth={3} color='var(--warm-neutral-shade-100)'/></span>
        }
      case TaskStatus.stopped:
        return <span className={`${styles.treeIndexDot} ${styles.rejectedDot}`}></span>
      case TaskStatus.rejected:
        return <span className={`${styles.treeIndexDot} ${styles.rejectedDot}`}></span>
      default :
        return <></>
    }
  }

  function getDoneTimelineClass (step: ProcessStep): string {
    if ((step?.node?.state === TaskStatus.done) || (step?.node?.state === TaskStatus.notApplicable && !step?.node?.notStarted)) {
      return styles.doneLine
    } else {
      return ''
    }
  }

  return (
    <>
      {
        props.isStepsExpanded && props.step.steps?.length > 0 &&
        <div className={styles.nestedSteps}>
          {
            <div className={styles.tree}>
              <ul>
                {
                  props.step.steps.map((step, key) => {
                    return (
                      <li key={key} className={getDoneTimelineClass(step)}>
                        {getStatusWiseIndex(step?.node?.state || '', step)}
                        <StepRow
                          step={step}
                          parentStep = {props.step}
                          tasks={props.tasks}
                          engagementData={props.engagementData}
                          isPending={step?.node?.state === TaskStatus.pending}
                          isAllStepExpanded={props.isAllStepExpanded}
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
                          getProcessLocalLabels={props.getProcessLocalLabels}
                          fetchTaskLockedInfo={props.fetchTaskLockedInfo}
                        />
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          }
        </div>
      }
      {
        props.isStepsExpanded && subProcessPreviewSteps.length > 0 && props.step.steps?.length === 0 &&
        <div className={styles.nestedSteps}>
          {
            <div className={styles.tree}>
              <ul>
                {
                  subProcessPreviewSteps.map((step, key) => {
                    return (
                      <li key={key} className={getDoneTimelineClass(step)}>
                        {getStatusWiseIndex(step?.node?.state || '', step)}
                        <StepRow
                          step={step}
                          parentStep = {props.step}
                          tasks={props.tasks}
                          engagementData={props.engagementData}
                          isPending={step?.node?.state === TaskStatus.pending}
                          isAllStepExpanded={props.isAllStepExpanded}
                          isCurrentUserAdmin={props.isCurrentUserAdmin}
                          hideActions={props.hideActions}
                          processName={props.step.node.subprocess?.name}
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
          }
        </div>
      }
    </>
  )
}
