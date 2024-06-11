import { gql } from '@apollo/client'
import { TASK_CHECKLIST_SOURCE_FIELDS, TASK_SOURCE_FIELDS } from './fragaments'

export const GET_TASK_QUERY = gql`
  query task($tenantId: String, $id: Long) {
    task(tenantId: $tenantId, id: $id) {
      ...TaskSourceFields
    }
  }
  ${TASK_SOURCE_FIELDS}
`
export const GET_TASK_WITH_DATE_INFO_QUERY = gql`
query taskWithDateInfo($tenantId: String, $id: Long) {
  taskWithDateInfo(tenantId: $tenantId, id: $id) {
    ...TaskSourceFields
  }
}
${TASK_SOURCE_FIELDS}
`

export const GET_CHECKLIST_QUERY = gql`
  query checklist($tenantId: String, $taskId: Long) {
    checklist(tenantId: $tenantId, taskId: $taskId) {
      ...TaskCheckListSourceFields
    }
  }
  ${TASK_CHECKLIST_SOURCE_FIELDS}
`
