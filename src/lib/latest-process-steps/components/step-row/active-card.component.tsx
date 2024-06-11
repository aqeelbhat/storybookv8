import { Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AlertCircle, Bell, ChevronDown, ChevronUp, Circle, Copy, Cpu, FileText, Minimize2, Minus, MoreHorizontal, Share2, User as UserIcon, UserCheck, UserPlus } from 'react-feather'

import {
  Option, Contact as ContactType, TeamDetails, TeamMembers, User, UserId, Engagement,
  EngagementStatus, RoleForms, StandardTaskType, TaskAssignmentType, Task
} from './../../../Types'
import Contact from '../../../controls/contact.component'
import { AddApproverPopover, ApprovePopover, DelegateToPopover, DenyPopover, MoreOptionsPopover, PopoverOnPrimaryClickProps, POPOVER_OPEN_DELAY, ResendEmailPopover, ShareFormsPopover } from '../../../controls/popovers/popovers.component'
import { MasterDataRoleObject } from '../../../Form/types'
import { ProcessStep, TaskStatus } from '../../../ProcessStep/types'
import { InfoType } from '../../../ProcessStepsNew/components/taskRowNew/task-new.component'
import { StandardStepTypes } from '../../../ProcessStepsNew/types'
import { getInfoDate, isTaskLate } from '../../new-process-steps.component'
import { getFormattedDate } from './step-row.component'

import styles from '../../new-process-steps.module.scss'
import { isAPITask, isApprovalTask, isDocCollectionTask, isManualTask, isRequester, isReviewTask, isTaskAssignedToPartner, isTaskOwner, isTaskStatusInReview, isTaskStatusPending } from '../../service'
import { CommonLocalLabels, LocalLabels } from '../../../CustomFormDefinition'
import { createImageFromInitials } from '../../../util'
import { SnackbarComponent } from '../../../Snackbar'
import { StringMap, useTranslationHook } from '../../../i18n'

type ActiveCardProps = {
  step: ProcessStep
  engagementData: Engagement | null
  tasks?: Array<Task>
  isCurrentUserAdmin?: boolean
  hideActions?: boolean
  processName?: string
  parentStep?: ProcessStep
  onApprove?: (taskId: string, actionMessage: string) => void
  onDeny?: (taskId: string, actionMessage: string) => void
  onDelegateTo?: (taskId: string, comment: string, user?: UserId) => void
  onAddApprover?: (taskId: string, comment: string, users: UserId[]) => void
  onUserSearch?: (keyword: string) => Promise<Array<Option>>
  onStartTask?: (task: string) => void
  onContinueTask?: (taskId: string) => void
  onCollapseDetails?: () => void
  onShareForms?: (taskId: string, comment: string, email: string) => void
  onResendEmail?: (taskId: string, comment: string, email: string) => void
  onReactivateNode?: (processId: string, nodeId: number) => void
  onAddContact?: (taskId: string, contactName: string, email: string, role: string, phone: string) => void
  fetchMasterDataSupplierRoles?: () => Promise<Array<MasterDataRoleObject>>
  getWorkstremMembers?: (code: string) => Promise<TeamDetails>
  getGroupUserList?: (groupId) => Promise<Array<User>> 
  getAllUsers?: (keyword: string) => Promise<Array<User>>
  fetchTaskDetails?: (id: string) => Promise<Task>
  getProcessLocalLabels?: (processName: string) => Promise<LocalLabels | undefined>
  fetchTaskLockedInfo?: (id: string) => Promise<boolean>
}

export const SUBSTATE = 'failed'
export const TASKERROR = 'taskError'
export const EMAILBOUNCED = 'emailBounced'
export const TASKEMAILNOTSENT = 'taskEmailNotSent'

export function ActiveCard (props: ActiveCardProps) {
  const [isActivitiesOpen, setIsActivitesOpen] = useState<boolean>(false)
  const [currentTaskdDetails, setCurrentTaskDetails] = useState<Task | null>(null)
  const [taskDetails, setTaskDetails] = useState<Task | null>(null)
  const [isShareFormsPopover, setIsShareFormsPopover] = useState(false)
  const [isResendPopover, setIsResendPopover] = useState(false)
  const [isDelegateToPopover, setIsDelegateToPopover] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [supplierRoles, setSupplierRoles] = useState<Array<MasterDataRoleObject>>([])
  const [isMoreOptionsMenuPopover, setIsMoreOptionsMenuPopover] = useState(false)
  const [workstream, setWorkstream] = useState<TeamDetails | null>(null)
  const [groupUserList, setGroupUserList] = useState<Array<User>>([])
  const [supplierContact, setSupplierContact] = useState<ContactType | null>(null)
  const [isApprovePopover, setIsApprovePopover] = useState(false)
  const [isDenyPopover, setIsDenyPopover] = useState(false)
  const [isAddApproverPopover, setIsAddApproverPopover] = useState(false)
  const [taskLocked, setTaskLocked] = useState<boolean | null>(null)
  const [taskLockLoading, setTaskLockLoading] = useState<boolean>(false)
  const { t } = useTranslationHook()

  function getI18Text (key: string, options?: StringMap): string {
    return t('--progress--.' + key, options) as string
  }

  /* Task name localization */
  const [taskName, setTaskName] = useState<string>('')

  useEffect(() => {
    if (props.getProcessLocalLabels && props.processName && props.step?.node) {
      props.getProcessLocalLabels(props.processName)
        .then((localLabels?: LocalLabels) => {
          const nodeLocalLabels: CommonLocalLabels = (props.step?.node.nodeDefId && 
            localLabels?.[props.step?.node.nodeDefId]) ? 
            (localLabels?.[props.step?.node.nodeDefId] as CommonLocalLabels) : {}
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
    if (props.fetchMasterDataSupplierRoles) {
      props.fetchMasterDataSupplierRoles()
        .then(resp => {
          setSupplierRoles(resp)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [])

  function getWorkstreamMember (code: string) {
    if (props.getWorkstremMembers) {
      props.getWorkstremMembers(code)
        .then(resp => {
          setWorkstream(resp)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  function getGroupUserList (groupId: string) {
    if (props.getGroupUserList) {
      props.getGroupUserList(groupId)
        .then(resp => {
          setGroupUserList(resp)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    if (currentTaskdDetails?.assignedTo?.groups?.length && currentTaskdDetails?.assignedTo?.groups[0]?.groupId) {
      getGroupUserList(currentTaskdDetails?.assignedTo?.groups[0]?.groupId)
    }
  }, [currentTaskdDetails])

  useEffect(() => {
    if (currentTaskdDetails?.assignedTo?.workstream?.id) {
      getWorkstreamMember(currentTaskdDetails?.assignedTo?.workstream?.id)
    } else {
      setWorkstream(null)
    }
  }, [currentTaskdDetails])

  useEffect(() => {
    let taskCopy: Task | null = null
    if (props.tasks && props.tasks?.length > 0) {
      props.tasks?.forEach(task => {
        if (task?.id === props.step?.node?.taskId) {
          taskCopy = task
        }
      })
    }

    setCurrentTaskDetails(taskCopy)
  }, [props.tasks])

  useEffect(() => {
    if (props.step && props.step.node.state !== TaskStatus.notStarted && props.step?.node?.taskId && isActivitiesOpen) {
      if (props.fetchTaskDetails) {
        props.fetchTaskDetails(props.step?.node?.taskId)
          .then(resp => {
            setTaskDetails(resp)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

    if (props.step && props.step?.type === StandardStepTypes.Api && props.step.node.taskId && isActivitiesOpen) {
      if (props.fetchTaskLockedInfo) {
        setTaskLockLoading(true)
        props.fetchTaskLockedInfo(props.step.node.taskId)
          .then(resp => {
            setTaskLocked(resp)
          })
          .catch(err => {
            setTaskLockLoading(false)
            console.log(err)
          })
      }
    } else if (props.step && props.step.node.state !== TaskStatus.notStarted && props.step.node.taskId && isActivitiesOpen) {
      if (props.fetchTaskLockedInfo) {
        setTaskLockLoading(true)
        props.fetchTaskLockedInfo(props.step.node.taskId)
          .then(resp => {
            setTaskLocked(resp)
          })
          .catch(err => {
            setTaskLockLoading(false)
            console.log(err)
          })
      }
    }
  }, [props.step, isActivitiesOpen])

  function isSupplierContactAvailable (): boolean {
    if (props.engagementData?.variables?.partners && props.engagementData?.variables?.partners?.length > 0 && props.engagementData?.variables?.partners[0]?.contact?.email) {
      return true
    } else {
      return false
    }
  }

  function hasEmailBounced (): boolean {
    if (props.step?.node?.subState === SUBSTATE && isSupplierContactAvailable()) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (isSupplierContactAvailable()) {
      setSupplierContact(props.engagementData?.variables?.partners[0]?.contact || null)
    }
  }, [props.engagementData])

  function getStatusBlock (status: string): React.ReactElement {
    if (status === SUBSTATE) {
      return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcStopped}`}><span>{getI18Text('--failed--')}</span></div>
    } else if (isTaskLate(props.step, props.tasks || [])) {
      return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcLate}`}><span>{getI18Text('--overdue--')}</span></div>
    } else if (props.engagementData && props.engagementData?.status === EngagementStatus.Invalid && status === TaskStatus.stopped) {
      return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcStopped}`}><span>{getI18Text('--denied--')}</span></div>
    } else if (props.engagementData && props.engagementData?.status === EngagementStatus.Failed && status === TaskStatus.stopped) {
      return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcStopped}`}><span>{getI18Text('--failed--')}</span></div>
    } else if (props.engagementData && props.engagementData?.status === EngagementStatus.Cancelled && status === TaskStatus.stopped) {
      return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcSkipped}`}><span>{getI18Text('--cancelled--')}</span></div>
    } else {
      switch (status) {
        case TaskStatus.notStarted:
          return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcNotStarted}`}><span>{getI18Text('--upcoming--')}</span></div>
        case TaskStatus.pending:
          return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcPending}`}><span>{getI18Text('--inProgress--')}</span></div>
        case TaskStatus.done:
          return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcDone}`}><span>{getI18Text('--completed--')}</span></div>
        case TaskStatus.notApplicable:
          return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcSkipped}`}><span>{getI18Text('--skipped--')}</span></div>
        case TaskStatus.stopped:
          return <div className={`${styles.expandedWrpUcStatus} ${styles.expandedWrpUcStopped}`}><span>{getI18Text('--failed--')}</span></div>
        default:
          return <></>
      }
    }
  }

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
      return step?.node?.estimateCompletionDate
        ? `${getInfoDate(step?.node?.estimateCompletionDate)}`
        : step.node?.estimateDays
          ? (step.node?.estimateDays > 1
              ? getI18Text('--estimatedDays--', { days: step.node.estimateDays })
              : getI18Text('--oneDay--'))
          : ''
    } else if (step.node?.state === TaskStatus.notStarted) {
      return `${getInfoDate(step?.node?.estimateCompletionDate)}`
    } else {
      return ''
    }
  }

  function hasToShowUpdate (): boolean {
    if (currentTaskdDetails?.datesInfo?.infos && currentTaskdDetails?.datesInfo?.infos?.length > 0) {
      return true
    } else if (isActivitiesOpen && taskDetails?.datesInfo && taskDetails?.datesInfo?.infos?.length > 0) {
      return true
    } else {
      return false
    }
  }

  function toggleActivities () {
    setIsActivitesOpen(!isActivitiesOpen)
  }

  function onCollapseDetails () {
    if (props.onCollapseDetails) {
      props.onCollapseDetails()
    }
  }

  function handleStartClick () {
    if (props.onStartTask && currentTaskdDetails) {
      props.onStartTask(currentTaskdDetails?.id)
    }
  }

  function handleContinueClick () {
    if (props.onContinueTask && currentTaskdDetails) {
      props.onContinueTask(currentTaskdDetails?.id)
    }
  }

  function onShareForms (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMoreOptionsMenuPopover(false)
    setTimeout(() => setIsShareFormsPopover(true), POPOVER_OPEN_DELAY)
  }

  function onResendEmail (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMoreOptionsMenuPopover(false)
    setTimeout(() => setIsResendPopover(true), POPOVER_OPEN_DELAY)
  }

  function onDelegateTo (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMoreOptionsMenuPopover(false)
    setTimeout(() => setIsDelegateToPopover(true), POPOVER_OPEN_DELAY)
  }

  function onAddApprover (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMoreOptionsMenuPopover(false)
    setTimeout(() => setIsAddApproverPopover(true), POPOVER_OPEN_DELAY)
  }

  function onShareFormsConfirm (evt: PopoverOnPrimaryClickProps) {
    if (currentTaskdDetails && props.onShareForms && typeof props.onShareForms === 'function') {
      props.onShareForms(currentTaskdDetails.id, evt.message || '', evt.email || '')
    }
  }

  function onResendConfirm (evt: PopoverOnPrimaryClickProps) {
    if (currentTaskdDetails && props.onResendEmail && typeof props.onResendEmail === 'function') {
      props.onResendEmail(currentTaskdDetails.id, evt.message || '', evt.email || '')
    }
  }

  function onDelegateToConfirm (evt: PopoverOnPrimaryClickProps) {
    if (currentTaskdDetails && props.onDelegateTo && typeof props.onDelegateTo === 'function') {
      props.onDelegateTo(currentTaskdDetails.id, evt.message || '', evt.userId || undefined)
    }
  }

  function onAddApproverConfirm (evt: PopoverOnPrimaryClickProps) {
    if (currentTaskdDetails && props.onAddApprover && typeof props.onAddApprover === 'function') {
      props.onAddApprover(currentTaskdDetails.id, evt.message || '', evt.users && evt.users.length > 0 ? evt.users : [])
    }
  }

  function getTaskOwnerName (): string {
    if (currentTaskdDetails && currentTaskdDetails?.type === StandardTaskType.documentCollection && currentTaskdDetails.assignmentType === TaskAssignmentType.partner) {
      return currentTaskdDetails.partnerName
    } else if (currentTaskdDetails && currentTaskdDetails?.ownerName) {
      return currentTaskdDetails?.ownerName
    } else if (props?.step.node?.assignedTo?.name) {
      return props?.step.node?.assignedTo?.name
    } else {
      return ''
    }
  }

  function getOwnersCount (): number {
    let count: number = 0
    if (currentTaskdDetails) {
      if (currentTaskdDetails?.type === StandardTaskType.documentCollection && currentTaskdDetails.assignmentType === TaskAssignmentType.partner) {
        count = 1
      } else if (currentTaskdDetails?.assignedTo?.allUsers?.length) {
        count = currentTaskdDetails?.assignedTo?.allUsers?.length
      }
    }
    return count
  }

  function getOwnerList (): Array<{name: string, email: string}> {
    const ownerList: Array<{name: string, email: string}> = []
    if (currentTaskdDetails && currentTaskdDetails?.type === StandardTaskType.documentCollection && currentTaskdDetails.assignmentType === TaskAssignmentType.partner) {
      if (props.engagementData?.variables?.partners && props.engagementData?.variables?.partners?.length > 0 && props.engagementData?.variables?.partners[0]?.name && props.engagementData?.variables?.partners[0]?.contact?.email) {
        ownerList.push({ name: `${props.engagementData?.variables?.partners[0]?.contact?.fullName} (${props.engagementData?.variables?.partners[0]?.name})`, email: props.engagementData?.variables?.partners[0]?.contact?.email })
      }
    } else if (currentTaskdDetails?.assignmentType === TaskAssignmentType.user && currentTaskdDetails?.assignedTo?.allUsers?.length) {
      currentTaskdDetails?.assignedTo?.allUsers?.forEach(user => {
        ownerList.push({ name: user.name, email: user.userName })
      })
    } else if (props.step?.node?.assignedTo?.allUsers) {
      props.step?.node?.assignedTo?.allUsers.forEach(user => {
        ownerList.push({ name: user.name, email: user.userName })
      })
    }

    return ownerList
  }

  function getTeamLeads (): Array<TeamMembers> {
    const teamLeads: Array<TeamMembers> = []
    if (workstream && workstream?.teamMembers?.length > 0) {
      workstream?.teamMembers.forEach(member => {
        if (member.role === 'owner') {
          teamLeads.push(member)
        }
      })
    }

    return teamLeads
  }

  function getUserImage (userName: string): string {
    const [firstName, lastName] = userName.split(' ')
    return createImageFromInitials(firstName, lastName)
  }

  function copyEmailToClipboard (email: string) {
    navigator.clipboard.writeText(email)
    setCopiedToClipboard(true)
  }

  function handleRetryClick () {
    let _processId
    if (props.step?.subProcessId) {
      _processId = props.step?.subProcessId
    } else if (props.step.type === StandardStepTypes.Subprocess) {
      _processId = props.step.node.subprocessId
    } else if (props.parentStep?.type === StandardStepTypes.Subprocess) {
      _processId = props.parentStep?.node.subprocessId
    } else {
      _processId = props.engagementData?.currentRequest.mainProcessId
    }
    if (props.onReactivateNode) {
      props.onReactivateNode(_processId, props.step.node.id)
    }
  }

  function handleAddPersonContact (contactName: string, email: string, role: string, phone: string) {
    if (props.onAddContact) {
      props.onAddContact(props.step?.node?.taskId, contactName, email, role, phone)
    }
  }

  function showMenuItems (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setTimeout(() => setIsMoreOptionsMenuPopover(true), POPOVER_OPEN_DELAY)
  }

  function getMoreMenuOptions (): JSX.Element {
    return (
      <div className={styles.expandedWrpLcButtonsDocTaskActionMore}>
        {
          !isSupplierContactAvailable() && <div onClick={onShareForms}><Share2 size={16} color='var(--warm-neutral-shade-300)'/>{getI18Text('--share--')}</div>
        }
        {
          hasEmailBounced() && <div onClick={onShareForms}><Share2 size={16} color='var(--warm-neutral-shade-300)'/>{getI18Text('--share--')}</div>
        }
        <div onClick={onResendEmail}><Bell size={16} color='var(--warm-neutral-shade-300)'/>{getI18Text('--sendReminder--')}</div>
      </div>
    )
  }

  function getMoreOptions (): JSX.Element {
    return (
      <div className={styles.expandedWrpLcButtonsDocTaskActionMore}>
        {
          currentTaskdDetails &&
          <div onClick={onDelegateTo}><UserCheck size={16} color='var(--warm-neutral-shade-300)'/>{getI18Text('--delegateTo--')}</div>
        }
        {
          currentTaskdDetails && (isApprovalTask(currentTaskdDetails) || isReviewTask(currentTaskdDetails) || isManualTask(currentTaskdDetails)) &&
          <div onClick={onAddApprover}><UserPlus size={16} color='var(--warm-neutral-shade-300)'/>{getI18Text('--addApprover--')}</div>
        }
      </div>
    )
  }

  function needToShowAlert (): boolean {
    if (props.step?.node?.subState === SUBSTATE && !isSupplierContactAvailable()) {
      return true
    } else {
      return false
    }
  }

  function needToShowShareOption (): boolean {
    if (isSupplierContactAvailable() && currentTaskdDetails?.assignmentType === TaskAssignmentType.user) {
      return true
    } else if (!isSupplierContactAvailable() && currentTaskdDetails?.assignmentType === TaskAssignmentType.user) {
      return true
    } else if (hasEmailBounced()) {
      return false
    } else if (!isSupplierContactAvailable() && currentTaskdDetails?.assignmentType === TaskAssignmentType.partner) {
      return false
    } else if (isSupplierContactAvailable() && currentTaskdDetails?.assignmentType === TaskAssignmentType.partner) {
      return true
    } else {
      return false
    }
  }

  function hasError (type: string): boolean {
    switch (type) {
      case TASKERROR:
        return true
      case EMAILBOUNCED:
        return true
      case TASKEMAILNOTSENT:
        return true
      default:
        return false
    }
  }

  function onApprove (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMoreOptionsMenuPopover(false)
    setIsDenyPopover(false)
    setTimeout(() => setIsApprovePopover(true), POPOVER_OPEN_DELAY)
  }

  function onDeny (event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMoreOptionsMenuPopover(false)
    setIsApprovePopover(false)
    setTimeout(() => setIsDenyPopover(true), POPOVER_OPEN_DELAY)
  }

  function onApproveConfirm (evt: PopoverOnPrimaryClickProps) {
    if (currentTaskdDetails && props.onApprove && typeof props.onApprove === 'function') {
      props.onApprove(currentTaskdDetails.id, evt.message || '')
    }
  }

  function onDenyConfirm (evt: PopoverOnPrimaryClickProps) {
    if (currentTaskdDetails && props.onDeny && typeof props.onDeny === 'function') {
      props.onDeny(currentTaskdDetails.id, evt.message || '')
    }
  }

  

  /**
   * @description This has been defined but not used
   * @todo Talk to the author and understand why this is here
   * @returns {boolean}
   */

  function isFormsAvailable (): boolean {
    let formFound: boolean = false
    if (currentTaskdDetails) {
      const taskRoleForms: RoleForms[] = currentTaskdDetails?.classfiedInputforms || []

      const inputFormFound: boolean = taskRoleForms.some(taskRoleForm => taskRoleForm?.questionnaireIds?.length > 0)
      formFound = inputFormFound || !!(currentTaskdDetails?.outputFormId)
    }

    return formFound
  }

  return (
    <div className={styles.expanded}>
      <div className={`${styles.expandedWrp} ${currentTaskdDetails ? styles.expandedWrpActive : styles.expandedWrpNotActive}`}>
        {
          currentTaskdDetails && isTaskOwner(currentTaskdDetails) && (isTaskStatusPending(currentTaskdDetails) || isTaskStatusInReview(currentTaskdDetails)) && !isAPITask(currentTaskdDetails) &&
          <div className={styles.expandedWrpTaskOwner}><FileText size={16} color='var(--warm-neutral-shade-200)' /><span className={styles.expandedWrpTaskOwnerTitle}>{getI18Text('--taskAssignedToYou--')}</span></div>
        }
        <div className={styles.expandedWrpUc}>
          <span className={styles.expandedWrpUcName}>{taskName || ''}</span>
          {getStatusBlock(props.step?.node?.subState && props.step?.node?.subState === SUBSTATE ? props.step?.node?.subState : props.step?.node?.state || '')}
        </div>
        {
          props.step?.node?.description &&
          <div className={styles.expandedWrpDesc}>{props.step?.node?.description}</div>
        }
        <div className={props.step?.node?.state !== TaskStatus.notStarted ? `${styles.expandedWrpLc} ${styles.expandedWrpLcBrd}` : styles.expandedWrpLc}>
          <div className={styles.expandedWrpLcAssign}>
            {
              props.step?.type !== StandardStepTypes.Api &&
              <div className={styles.expandedWrpLcAssignTo}>
              {
                <>
                  <span className={styles.iconGray}><UserIcon size={13} color={needToShowAlert() ? 'var(--warm-stat-chilli-regular)' : 'var(--warm-neutral-shade-500)'}/></span>
                  <span className={styles.iconBlue} onClick={() => currentTaskdDetails && setIsDetailsOpen(true)}><UserIcon size={13} color={needToShowAlert() ? 'var(--warm-stat-chilli-regular)' : 'var(--warm-prime-azure)'}/></span>
                  {
                    currentTaskdDetails?.assignedTo?.workstream?.name
                      ? <span className={styles.NameValue} onClick={() => currentTaskdDetails && setIsDetailsOpen(true)}>
                          {
                            currentTaskdDetails?.assignedTo?.name ? currentTaskdDetails?.assignedTo?.name : currentTaskdDetails?.assignedTo?.workstream?.name
                          }
                        </span>
                      : <>
                          {
                            currentTaskdDetails && currentTaskdDetails?.type === StandardTaskType.documentCollection && currentTaskdDetails.assignmentType === TaskAssignmentType.partner && !isSupplierContactAvailable()
                              ? <span className={styles.alert} onClick={() => currentTaskdDetails && setIsDetailsOpen(true)}>{getI18Text('--contactMissing--')}</span>
                              : <>
                                  <span className={styles.NameValue} onClick={() => currentTaskdDetails && setIsDetailsOpen(true)}>
                                    {currentTaskdDetails && getOwnerList().length > 0 ? getOwnerList()[0].name : getTaskOwnerName()}
                                    {getOwnersCount() > 1 && ','}
                                  </span>
                                  {
                                    getOwnersCount() > 1 && <span className={styles.NameValue} onClick={() => setIsDetailsOpen(true)}>+{getOwnersCount() - 1}</span>
                                  }
                                </>
                          }
                        </>
                  }
                  {
                    hasEmailBounced() && <span className={styles.NameValue} onClick={() => currentTaskdDetails && setIsDetailsOpen(true)}><AlertCircle size={13} color='var(--warm-stat-chilli-regular)'/></span>
                  }
                  {
                    isDetailsOpen && (getOwnerList().length > 0 || getTeamLeads().length > 0 || groupUserList.length > 0) &&
                    <>
                      <div className={styles.popUp}>
                        {
                          !currentTaskdDetails?.assignedTo?.workstream?.name && getOwnerList().length > 0 &&
                          getOwnerList().map((owner, key) => {
                            return <div className={styles.popUpItem} key={key}>
                            <img className={styles.popUpItemImg} src={getUserImage(owner.name)} alt=""/>
                              <div className={styles.popUpItemDetails}>
                                <div className={styles.popUpItemDetailsName}>{owner.name}</div>
                                {
                                  owner.email &&
                                  <div className={styles.popUpItemDetailsEmail}>
                                    <div className={ hasEmailBounced() ? styles.popUpItemDetailsAlert : styles.popUpItemDetailsEmailValue}>{owner.email}</div>
                                    <div className={styles.popUpItemDetailsEmailIcon}><Copy size={14} color="var(--warm-neutral-shade-300)" onClick={() => copyEmailToClipboard(owner.email)}></Copy></div>
                                  </div>
                                }
                              </div>
                            </div>
                          })
                        }
                        {
                          currentTaskdDetails?.assignedTo?.workstream?.name &&
                          <>
                            <div className={styles.popUpTeam}>
                              <span className={styles.popUpTeamKey}>{getI18Text('--team--')}:</span>
                              <span className={styles.popUpTeamValue}>{currentTaskdDetails?.assignedTo?.workstream?.name}</span>
                            </div>
                            {
                              getOwnerList().map((owner, key) => {
                                return <div className={`${styles.popUpItem} ${getOwnerList().length === key + 1 ? styles.popUpTeamNoBrd : ''}`} key={key}>
                                <img className={styles.popUpItemImg} src={getUserImage(owner.name)} alt=""/>
                                  <div className={styles.popUpItemDetails}>
                                    <div className={styles.popUpItemDetailsName}>{owner.name}</div>
                                    {
                                      owner.email &&
                                      <div className={styles.popUpItemDetailsEmail}>
                                        <div className={styles.popUpItemDetailsEmailValue}>{owner.email}</div>
                                        <div className={styles.popUpItemDetailsEmailIcon}><Copy size={14} color="var(--warm-neutral-shade-300)" onClick={() => copyEmailToClipboard(owner.email)}></Copy></div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              })
                            }
                            <div className={styles.popUpLeads}>
                              <span>{getTeamLeads().length}</span>
                              <span>{getTeamLeads().length > 1 ? getI18Text('--teamLeads--') : getI18Text('--teamLead--')}</span>
                            </div>
                            {
                              getTeamLeads().map((lead, key) => {
                                return <div className={styles.popUpItem} key={key}>
                                <img className={styles.popUpItemImg} src={getUserImage(`${lead?.user?.firstName || ''} ${lead?.user?.lastName || ''}`)} alt=""/>
                                  <div className={styles.popUpItemDetails}>
                                    <div className={styles.popUpItemDetailsName}>{`${lead?.user?.firstName || ''} ${lead?.user?.lastName || ''}`}</div>
                                    <div className={styles.popUpItemDetailsEmail}>
                                      <div className={styles.popUpItemDetailsEmailValue}>{lead?.user?.email || ''}</div>
                                      <div className={styles.popUpItemDetailsEmailIcon}><Copy size={14} color="var(--warm-neutral-shade-300)" onClick={() => copyEmailToClipboard(lead?.user?.email || '')}></Copy></div>
                                    </div>
                                  </div>
                                </div>
                              })
                            }
                          </>
                        }
                        {
                          currentTaskdDetails?.assignmentType === TaskAssignmentType.group && !currentTaskdDetails?.handlingStarted &&
                          <>
                            <div className={styles.popUpTeam}>
                              <span className={styles.popUpTeamKey}>{getI18Text('--userGroup--')}:</span>
                              <span className={styles.popUpTeamValue}>{currentTaskdDetails?.assignedTo?.groups?.length ? currentTaskdDetails?.assignedTo?.groups[0]?.groupName : ''}</span>
                            </div>
                            <div className={styles.popUpLeads}>
                              <span>{groupUserList.length}</span>
                              <span>{groupUserList.length > 1 ? getI18Text('--members--') : getI18Text('--member--')}</span>
                            </div>
                            {
                              groupUserList.map((user, key) => {
                                return <div className={styles.popUpItem} key={key}>
                                <img className={styles.popUpItemImg} src={getUserImage(`${user?.firstName || ''} ${user?.lastName || ''}`)} alt=""/>
                                  <div className={styles.popUpItemDetails}>
                                    <div className={styles.popUpItemDetailsName}>{`${user?.firstName || ''} ${user?.lastName || ''}`}</div>
                                    <div className={styles.popUpItemDetailsEmail}>
                                      <div className={styles.popUpItemDetailsEmailValue}>{user?.email || ''}</div>
                                      <div className={styles.popUpItemDetailsEmailIcon}><Copy size={14} color="var(--warm-neutral-shade-300)" onClick={() => copyEmailToClipboard(user?.email || '')}></Copy></div>
                                    </div>
                                  </div>
                                </div>
                              })
                            }
                          </>
                        }
                        {
                          currentTaskdDetails?.assignmentType === TaskAssignmentType.group && (currentTaskdDetails?.ownerName || currentTaskdDetails?.ownerId) &&
                          <div className={styles.popUpItem}>
                            <img className={styles.popUpItemImg} src={getUserImage(currentTaskdDetails?.ownerName)} alt=""/>
                            <div className={styles.popUpItemDetails}>
                              <div className={styles.popUpItemDetailsName}>{currentTaskdDetails?.ownerName}</div>
                              <div className={styles.popUpItemDetailsEmail}>
                                <div className={styles.popUpItemDetailsEmailValue}>{currentTaskdDetails?.ownerId || ''}</div>
                                <div className={styles.popUpItemDetailsEmailIcon}><Copy size={14} color="var(--warm-neutral-shade-300)" onClick={() => copyEmailToClipboard(currentTaskdDetails?.ownerId || '')}></Copy></div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div className={styles.backdrop} onClick={() => setIsDetailsOpen(false)}></div>
                    </>
                  }
                </>
              }
              {
                props?.step.node?.assignedTo?.department && !currentTaskdDetails?.assignedTo?.workstream?.name &&
                <>
                  <Circle size={4} color='var(--warm-neutral-shade-100)' fill='var(--warm-neutral-shade-100)'/>
                  <span className={styles.expandedWrpLcKey}>{props?.step.node?.assignedTo?.department || ''}</span>
                </>
              }
              </div>
            }
            {
              props.step?.type === StandardStepTypes.Api &&
              <div className={styles.expandedWrpLcAssignTo}>
                <span className={styles.iconGray}><Cpu size={13} color='var(--warm-neutral-shade-500)'/></span>
                <span className={styles.iconBlue}><Cpu size={13} color='var(--warm-prime-azure)'/></span>
                <span className={styles.NameValue}>{getI18Text('--system--')}</span>
              </div>
            }
            {
              props.step?.node?.started &&
              <div className={styles.expandedWrpLcAssignOn}>
                <span className={styles.expandedWrpLcKey}>{getI18Text('--assignedOn--')}:</span>
                <span className={styles.expandedWrpLcValue}>{getInfoDate(props.step?.node?.started)}</span>
              </div>
            }
          </div>
          {
            props.step?.type !== StandardStepTypes.TaskCollection &&
            <div className={styles.expandedWrpLcEstimate}>
              <span className={styles.expandedWrpLcKey}>{getEstimateSentence(props.step?.node?.state || '')}</span>
              <span className={styles.expandedWrpLcValue}>{getEstimateDays(props.step)}</span>
            </div>
          }
        </div>
        {
          !props.hideActions &&
          <>
            {
              currentTaskdDetails && isDocCollectionTask(currentTaskdDetails) &&
              <div className={styles.expandedWrpLcButtons}>
                <div className={styles.expandedWrpLcButtonsDoc}>
                  {
                    (props.isCurrentUserAdmin || (props.engagementData && isRequester(props.engagementData))) && !isSupplierContactAvailable() && currentTaskdDetails?.assignmentType === TaskAssignmentType.partner &&
                    <>
                      <span className={styles.expandedWrpLcButtonsApprove} onClick={() => setIsContactPopupOpen(true)}>{getI18Text('--addContact--')}</span>
                    </>
                  }
                  {
                    hasEmailBounced() && <span className={styles.expandedWrpLcButtonsApprove} onClick={() => setIsContactPopupOpen(true)}>{getI18Text('--editContact--')}</span>
                  }
                  {
                    isTaskOwner(currentTaskdDetails) && !isTaskAssignedToPartner(currentTaskdDetails) &&
                    <span className={styles.expandedWrpLcButtonsApprove} onClick={handleContinueClick}>{getI18Text('--start--')}</span>
                  }
                  {
                    (props.isCurrentUserAdmin || (props.engagementData && isRequester(props.engagementData))) &&
                    <>
                      {
                        needToShowShareOption() &&
                        <>
                          <div className={isTaskAssignedToPartner(currentTaskdDetails) ? styles.expandedWrpLcButtonsApprove : styles.expandedWrpLcButtonsSecondary} onClick={onShareForms}>{getI18Text('--shareForms--')}</div>
                        </>
                      }
                      {
                        currentTaskdDetails.assignmentType === TaskAssignmentType.partner &&
                        <>
                          <div className={styles.expandedWrpLcButtonsDocMenu} onClick={showMenuItems}><MoreHorizontal size={16} color='var(--warm-neutral-shade-200)' /></div>
                          <div className={styles.expandedWrpLcButtonsDocPopup}><MoreOptionsPopover children={getMoreMenuOptions()} isOpen={isMoreOptionsMenuPopover} onPopoverHide={() => setIsMoreOptionsMenuPopover(false)}/></div>
                          <ResendEmailPopover isOpen={isResendPopover} onPrimaryActionClick={onResendConfirm} onPopoverHide={() => setIsResendPopover(false)}/>
                        </>
                      }
                      <ShareFormsPopover isOpen={isShareFormsPopover} onPrimaryActionClick={onShareFormsConfirm} onPopoverHide={() => setIsShareFormsPopover(false)}/>
                    </>
                  }
                </div>
              </div>
            }
            {
              currentTaskdDetails && isTaskOwner(currentTaskdDetails) && !isDocCollectionTask(currentTaskdDetails) &&
              <div className={styles.expandedWrpLcButtons}>
                {
                  isApprovalTask(currentTaskdDetails) && isTaskStatusPending(currentTaskdDetails) &&
                  <div className={styles.expandedWrpLcButtonsApproval}>
                    <span className={styles.expandedWrpLcButtonsApprove} onClick={onApprove}>{getI18Text('--approve--')}</span>
                    <div className={styles.expandedWrpLcButtonsApprovalApprovePop}><ApprovePopover isOpen={isApprovePopover} budget={props.engagementData?.variables.projectAmountMoney} budgetLabel='ebit' onPrimaryActionClick={onApproveConfirm} onPopoverHide={() => setIsApprovePopover(false)}/></div>
                    <span className={styles.expandedWrpLcButtonsDeny} onClick={onDeny}>{getI18Text('--deny--')}</span>
                    <div className={styles.expandedWrpLcButtonsApprovalDenyPop}><DenyPopover isOpen={isDenyPopover} onPrimaryActionClick={onDenyConfirm} onPopoverHide={() => setIsDenyPopover(false)}/></div>
                    <div className={styles.expandedWrpLcButtonsApprovalDelegate}>
                      <div className={styles.expandedWrpLcButtonsMore} onClick={showMenuItems}>{getI18Text('--more--')}<ChevronDown size={18} color='var(--warm-neutral-shade-500)'/></div>
                      <MoreOptionsPopover children={getMoreOptions()} isOpen={isMoreOptionsMenuPopover} onPopoverHide={() => setIsMoreOptionsMenuPopover(false)}/>
                      <DelegateToPopover isOpen={isDelegateToPopover} onUserSearch={props.onUserSearch} onPrimaryActionClick={onDelegateToConfirm} onPopoverHide={() => setIsDelegateToPopover(false)}/>
                      <AddApproverPopover isOpen={isAddApproverPopover} getAllUsers={props.getAllUsers} onPrimaryActionClick={onAddApproverConfirm} onPopoverHide={() => setIsAddApproverPopover(false)}/>
                    </div>
                  </div>
                }
                {
                  (isReviewTask(currentTaskdDetails) || isManualTask(currentTaskdDetails)) &&
                  <div className={styles.expandedWrpLcButtonsApproval}>
                    {
                      isTaskStatusPending(currentTaskdDetails) &&
                      <span className={styles.expandedWrpLcButtonsApprove} onClick={handleStartClick}>{getI18Text('--start--')}</span>
                    }
                    {
                      isTaskStatusInReview(currentTaskdDetails) &&
                      <span className={styles.expandedWrpLcButtonsApprove} onClick={handleContinueClick}>{getI18Text('--continue--')}</span>
                    }
                    <div className={styles.expandedWrpLcButtonsApprovalDelegate}>
                      <div className={styles.expandedWrpLcButtonsMore} onClick={showMenuItems}>{getI18Text('--more--')}<ChevronDown size={18} color='var(--warm-neutral-shade-500)'/></div>
                      <MoreOptionsPopover children={getMoreOptions()} isOpen={isMoreOptionsMenuPopover} onPopoverHide={() => setIsMoreOptionsMenuPopover(false)}/>
                      <DelegateToPopover isOpen={isDelegateToPopover} onUserSearch={props.onUserSearch} onPrimaryActionClick={onDelegateToConfirm} onPopoverHide={() => setIsDelegateToPopover(false)}/>
                      <AddApproverPopover isOpen={isAddApproverPopover} getAllUsers={props.getAllUsers} onPrimaryActionClick={onAddApproverConfirm} onPopoverHide={() => setIsAddApproverPopover(false)}/>
                    </div>
                  </div>
                }
                {
                  isAPITask(currentTaskdDetails) && props.step?.node?.state === TaskStatus.stopped && props.engagementData?.status !== EngagementStatus.Cancelled && !(taskLocked === true) && !taskLockLoading &&
                  <span className={styles.expandedWrpLcButtonsApprove} onClick={handleRetryClick}>{getI18Text('--retry--')}</span>
                }
                {
                  isAPITask(currentTaskdDetails) && props.step?.node?.state === TaskStatus.stopped && props.engagementData?.status !== EngagementStatus.Cancelled && taskLocked === true && !taskLockLoading &&
                  <span className={styles.expandedWrpLcButtonsSec}>{getI18Text('--taskOnHold--')}</span>
                }
              </div>
            }
          </>
        }
        {
          props.step?.node?.state !== TaskStatus.notStarted &&
          <div>
            <div className={(isActivitiesOpen && taskDetails?.datesInfo) || (currentTaskdDetails && currentTaskdDetails?.datesInfo?.infos && currentTaskdDetails?.datesInfo?.infos?.length > 0) ? `${styles.expandedWrpUpdates} ${styles.expandedWrpLoaded}` : styles.expandedWrpUpdates }>
              {
                props.step?.node?.state !== TaskStatus.notApplicable &&
                <>
                  {
                    hasToShowUpdate()
                      ? <span className={styles.expandedWrpUpdatesUpdate}>{getI18Text('--updates--')}</span>
                      : <span className={styles.expandedWrpUpdatesUpdate}></span>
                  }
                  <div className={styles.expandedWrpUpdatesActivity} onClick={toggleActivities}>
                    <span className={styles.expandedWrpUpdatesUpdate}>{isActivitiesOpen ? getI18Text('--hideActivities--') : getI18Text('--viewActivities--')}</span>
                    {
                      isActivitiesOpen
                        ? <ChevronUp size={14} color='var(--warm-neutral-shade-300)'/>
                        : <ChevronDown size={14} color='var(--warm-neutral-shade-300)'/>
                    }
                  </div>
                </>
              }
              {
                props.step?.node?.state === TaskStatus.notApplicable &&
                <div className={styles.expandedWrpUpdatesNa}>
                  <span className={styles.expandedWrpUpdatesNaKey}>{getI18Text('--systemSkippedTheTaskAsItWasNotApplicable--')}</span>
                  <span className={styles.expandedWrpUpdatesNaDate}>{getFormattedDate(props.step?.node?.completed)}</span>
                </div>
              }
            </div>
            {
              !isActivitiesOpen && currentTaskdDetails && currentTaskdDetails?.datesInfo?.infos && currentTaskdDetails?.datesInfo?.infos?.length > 0 &&
              <div className={styles.comments}>
                {
                  currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.type === InfoType.taskStarted &&
                  <div className={styles.expandedWrpLmc} >
                    <div className={styles.expandedWrpLmcWords}>
                      <span className={styles.expandedWrpLmcCntDot}></span>
                      <span className={styles.expandedWrpLmcCntName}>{getI18Text('--taskIsAssigned--')}</span>
                    </div>
                    <div className={styles.expandedWrpLmcDate}><Minus size={10} color='var(--warm-neutral-shade-200)'/> {getFormattedDate(currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.date)}</div>
                  </div>
                }
                {
                  currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.type !== InfoType.taskStarted &&
                  <div className={styles.expandedWrpLmc} >
                    <div className={styles.expandedWrpLmcCnt}>
                      <div className={styles.expandedWrpLmcWords}>
                        <span className={styles.expandedWrpLmcCntDot}></span>
                        <span className={`${styles.expandedWrpLmcCntName} ${hasError(currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.type) ? styles.error : ''}`}>{currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.taskAssignment?.name || ''}</span>
                        <span className={`${styles.expandedWrpLmcCntKey} ${hasError(currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.type) ? styles.error : ''}`}>{currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.typeLabel}</span>
                        {
                          currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.comment &&
                            <span className={styles.expandedWrpLmcCntKey}>{getI18Text('--withComment--')}:</span>
                        }
                      </div>
                      {
                        currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.comment &&
                        <div><span className={styles.expandedWrpLmcCntValue}>{`"${currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.comment}"`}</span></div>
                      }
                    </div>
                    <div className={styles.expandedWrpLmcDate}><Minus size={10} color='var(--warm-neutral-shade-200)'/> {getFormattedDate(currentTaskdDetails?.datesInfo?.infos[currentTaskdDetails?.datesInfo?.infos?.length - 1]?.date)}</div>
                  </div>
                }
              </div>
            }
            {
              isActivitiesOpen && taskDetails?.datesInfo && taskDetails?.datesInfo?.infos?.length > 0 &&
              taskDetails?.datesInfo?.infos.map((info, index) => {
                return (
                  <div key={index} className={styles.comments}>
                    {
                      info.type === InfoType.taskStarted &&
                      <div className={styles.expandedWrpLmc} >
                        <div className={styles.expandedWrpLmcWords}>
                          <span className={styles.expandedWrpLmcCntDot}></span>
                          <span className={styles.expandedWrpLmcCntName}>{getI18Text('--taskIsAssigned--')}</span>
                        </div>
                        <div className={styles.expandedWrpLmcDate}><Minus size={10} color='var(--warm-neutral-shade-200)'/> {getFormattedDate(info.date)}</div>
                      </div>
                    }
                    {
                      info.type !== InfoType.taskStarted &&
                      <div className={styles.expandedWrpLmc} >
                        <div className={styles.expandedWrpLmcCnt}>
                          <div className={styles.expandedWrpLmcWords}>
                            <span className={styles.expandedWrpLmcCntDot}></span>
                            <span className={`${styles.expandedWrpLmcCntName} ${hasError(info?.type) ? styles.error : ''}`}>{info?.taskAssignment?.name || ''}</span>
                            <span className={`${styles.expandedWrpLmcCntKey} ${hasError(info?.type) ? styles.error : ''}`}>{info.typeLabel}</span>
                            {
                              info.comment &&
                                <span className={styles.expandedWrpLmcCntKey}>{getI18Text('--withComment--')}: </span>
                            }
                          </div>
                          {
                            info.comment &&
                            <div><span className={styles.expandedWrpLmcCntValue}>{`"${info.comment}"`}</span></div>
                          }
                        </div>
                        <div className={styles.expandedWrpLmcDate}><Minus size={10} color='var(--warm-neutral-shade-200)'/> {getFormattedDate(info.date)}</div>
                      </div>
                    }
                  </div>
                )
              })
            }
          </div>
        }
      </div>
      {
        props.step?.node?.state !== TaskStatus.pending && props.step?.node?.state !== TaskStatus.stopped &&
        <div className={styles.expandedMinIcon} onClick={onCollapseDetails}><Minimize2 size={14} color='var(--warm-neutral-shade-200)'/></div>
      }
      <Modal open={isContactPopupOpen}>
        <div className={styles.expandedContact}>
          <Contact
            title={hasEmailBounced() ? getI18Text('--editSupplierContact--') : getI18Text('--addContact--')}
            contact={supplierContact}
            supplierRoles={supplierRoles}
            primaryButtonLable={hasEmailBounced() ? getI18Text('--saveAndSendMail--') : getI18Text('--addContact--')}
            onClose={() => setIsContactPopupOpen(false)}
            addPersonContact= {handleAddPersonContact}
          />
        </div>
      </Modal>
      <SnackbarComponent open={copiedToClipboard} hideIcon autoHideDuration={1000} onClose={() => setCopiedToClipboard(false)} message={getI18Text('--copiedToClipboard--')} />
    </div>
  );
}
