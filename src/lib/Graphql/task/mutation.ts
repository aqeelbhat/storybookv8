import { gql } from '@apollo/client'
import { PROCESS_STEP_INFO_SOURCE_FIELDS } from '../process/fragments'
import { PROCESS_INFO_SOURCE_FIELDS } from '../request/fragment'
import { ENGAGEMENT_TASK_FIELDS, TASK_CHECKLIST_SOURCE_FIELDS, TASK_SOURCE_FIELDS } from './fragaments'

export const APPROVE_TASK = gql`
  mutation approveTask($tenantId: String, $taskId: Long, $comment: String) {
    approveTask(tenantId: $tenantId, taskId: $taskId, comment: $comment) {
      ...ProcessInfoSourceFields
    }
  }
  ${PROCESS_INFO_SOURCE_FIELDS}
`

export const REJECT_TASK = gql`
  mutation rejectTask($tenantId: String, $taskId: Long, $comment: String, $isSendBackToRequester: Boolean) {
    rejectTask(tenantId: $tenantId, taskId: $taskId, comment: $comment, isSendBackToRequester: $isSendBackToRequester) {
      ...ProcessInfoSourceFields
    }
  }
  ${PROCESS_INFO_SOURCE_FIELDS}
`

export const SUBMIT_TASK = gql`
  mutation submitTask($tenantId: String, $taskId: Long, $checklist: TaskCheckListInput, $comment: String) {
    submitTask(tenantId: $tenantId, taskId: $taskId, checklist: $checklist, comment: $comment) {
      ...ProcessInfoSourceFields
    }
  }
  ${PROCESS_INFO_SOURCE_FIELDS}
`

export const START_TASK = gql`
  mutation startTask($tenantId: String, $taskId: Long) {
    startTask(tenantId: $tenantId, taskId: $taskId) {
      ...ProcessInfoSourceFields
    }
  }
  ${PROCESS_INFO_SOURCE_FIELDS}
`

export const TASK_ASK_FOR_INFO = gql`
  mutation taskAskForInfo($tenantId: String, $taskId: Long, $comment: String) {
    taskAskForInfo(tenantId: $tenantId, taskId: $taskId, comment: $comment) {
      ...TaskSourceFields
    }
  }
  ${TASK_SOURCE_FIELDS}
`

export const UPDATE_CHECKLIST = gql`
  mutation updateChecklist($tenantId: String, $taskId: Long, $checklist: TaskCheckListInput) {
    updateChecklist(tenantId: $tenantId, taskId: $taskId, checklist: $checklist) {
      ...TaskCheckListSourceFields
    }
  }
  ${TASK_CHECKLIST_SOURCE_FIELDS}
`

export const SHARE_FORMS = gql`
  mutation shareForms($tenantId: String, $taskId: Long, $email: String, $comment: String) {
    shareForms(tenantId: $tenantId, taskId: $taskId, email: $email, comment: $comment)
  }
`

export const REACTIVATE_NODE = gql`
  mutation reactivateNode($tenantId: String, $processId: Long, $nodeId: Long) {
    reactivateNode(tenantId: $tenantId, processId: $processId, nodeId: $nodeId) {
      ...ProcessInfoSourceFields
    }
  }
  ${PROCESS_INFO_SOURCE_FIELDS}
`
export const POST_NOTE = gql`
  mutation postNote($tenantId: String, $taskId: Long, $comment: String) {
    postNote(tenantId: $tenantId, taskId: $taskId, comment: $comment)
  }
`
export const REASSIGN_USER_QUERY = gql`
  mutation reassign($tenantId: String, $taskId: Long, $newOwner: UserIdInput, $timezone: String) {
    reassign(tenantId: $tenantId, taskId: $taskId, newOwner: $newOwner, timezone: $timezone) {
      ...EngagementTaskFields
    }
  }
  ${ENGAGEMENT_TASK_FIELDS}
`
export const ADD_APPROVER_QUERY = gql`
  mutation addApprover($tenantId: String, $taskId: Long, $owners: [UserIdInput], $comment: String, $parallel: Boolean) {
    addApprover(tenantId: $tenantId, taskId: $taskId, owners: $owners, comment: $comment, parallel: $parallel) {
      ...ProcessStepInfoSourceFields
    }
  }
  ${PROCESS_STEP_INFO_SOURCE_FIELDS}
`
