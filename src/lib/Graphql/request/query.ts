import { gql } from '@apollo/client'
import { MILESTONE_SOURCE_FIELDS, PROCESS_REQUEST_SOURCE_FIELDS, REQUEST_STEPS_SOURCE_FIELDS } from './fragment'

export const GET_PROCESS_REQUEST = gql`
    query request($tenantId: String, $id: Long) {
        request(tenantId: $tenantId, id: $id){
            ...ProcessRequestSourceFields
        }
    }
    ${PROCESS_REQUEST_SOURCE_FIELDS}
`

export const GET_PROCESS_REQUEST_STEP = gql`
    query requestStep($tenantId: String, $id: Long, $step: Int) {
        requestStep(tenantId: $tenantId, id: $id, step: $step){
            ...RequestStepSourceFields
        }
    }
    ${REQUEST_STEPS_SOURCE_FIELDS}
`

export const MILESTONES = gql`
    query milestones($tenantId: String, $processName: String) {
        milestones(tenantId: $tenantId, processName: $processName){
            ...MilestonesSourceFields
        }
    }
    ${MILESTONE_SOURCE_FIELDS}
`
