import { gql } from '@apollo/client'
import { NODE_STEP_SOURCE_FIELDS, PROCESS_STEP_INFO_SOURCE_FIELDS } from './fragments'

// TODO: will have to pass partner as a param
// since we do not have partner, we are sending null value

export const PREVIEW_PROCESS = gql`
    query previewProcess($tenantId: String, $processDefinition: String, $selection: SelectionInput, $processId: Long, $requestId: Long) {
        previewProcess(tenantId:$tenantId, processDefinition:$processDefinition, vendorId:null, selection:$selection, processId:$processId, requestId:$requestId) {
            ...NodeStepResponseSourceFields
        }
    }
    ${NODE_STEP_SOURCE_FIELDS}
`

export const GET_PROCESS_STEPS = gql`
    query processSteps($tenantId: String, $id: Long) {
        processSteps(tenantId: $tenantId, id: $id) {
            ...NodeStepResponseSourceFields
        }
    }
    ${NODE_STEP_SOURCE_FIELDS}
`
export const GET_PROCESS_STEPS2 = gql`
    query processSteps2($tenantId: String, $id: Long) {
        processSteps2(tenantId: $tenantId, id: $id) {
            ...ProcessStepInfoSourceFields
        }
    }
    ${PROCESS_STEP_INFO_SOURCE_FIELDS}
`

export const IS_TASK_LOCKED = gql`
    query isTaskLocked($tenantId: String!, $id: Long!) {
        isTaskLocked(tenantId: $tenantId, id: $id)
    }
`