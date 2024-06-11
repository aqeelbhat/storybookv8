import { gql } from '@apollo/client'
import { QUESTIONNAIREID_SOURCE_FIELDS } from '../task/fragaments'
import { PROCESS_REQUEST_SOURCE_FIELDS, REQUEST_SUBMISSION_RESPONSE_SOURCE_FIELDS } from './fragment'

export const PROCESS_REQUEST = gql`
    mutation createRequest($tenantId: String, $name: String, $startingSubprocessName: String, $timezone: String, $program: IDRefInput, $normalizedSupplier: Long, $inheritRequestId: Long, $buyingChannel: IDRefInput) {
        createRequest(tenantId: $tenantId, name: $name, startingSubprocessName: $startingSubprocessName, timezone: $timezone, program: $program, normalizedSupplier: $normalizedSupplier, inheritRequestId: $inheritRequestId, buyingChannel: $buyingChannel) {
            ...ProcessRequestSourceFields
        }
    }
    ${PROCESS_REQUEST_SOURCE_FIELDS}
`

export const CREATE_MEASURE_FROM_IDEATION = gql`
    mutation createMeasureFromIdeation($tenantId: String, $ideationId: Long, $name: String, $startingSubprocessName: String, $timezone: String) {
        createMeasureFromIdeation(tenantId: $tenantId, ideationId: $ideationId, name: $name, startingSubprocessName: $startingSubprocessName, timezone: $timezone) {
            ...ProcessRequestSourceFields
        }
    }
    ${PROCESS_REQUEST_SOURCE_FIELDS}
`

export const SUBMIT_REQUEST = gql`
    mutation submitRequest($tenantId: String, $id: Long) {
        submitRequest(tenantId: $tenantId, id: $id) {
            ...RequestSubmissionResponseSourceFields
        }
    }
    ${REQUEST_SUBMISSION_RESPONSE_SOURCE_FIELDS}
`

export const EDIT_REQUEST = gql`
    mutation editRequest($tenantId: String, $id: Long) {
        editRequest(tenantId: $tenantId, id: $id) {
            ...ProcessRequestSourceFields
        }
    }
    ${PROCESS_REQUEST_SOURCE_FIELDS}
`

export const SET_CHANGE_COMMENT = gql`
    mutation setChangeComment($tenantId: String, $id: Long, $comment: String) {
        setChangeComment(tenantId: $tenantId, id: $id, comment: $comment) {
            ...ProcessRequestSourceFields
        }
    }
    ${PROCESS_REQUEST_SOURCE_FIELDS}
`

export const REGISTER_ORBEON_QUESTIONNAIRE_FOR_REQUEST = gql`
    mutation registerOrbeonQuestionnaireForRequest(
        $tenantId: String,
        $requestId: Long,
        $qid: QuestionnaireIdInput,
        $formDocumentId: String,
        $step: Int
    ) {
        registerOrbeonQuestionnaireForRequest(
            tenantId: $tenantId,
            requestId: $requestId,
            qid: $qid,
            formDocumentId: $formDocumentId,
            step: $step
        ) {
            ...QuestionnaireIdSourceFields
        }
    }
    ${QUESTIONNAIREID_SOURCE_FIELDS}
`

export const DELETE_REQUEST = gql`
    mutation deleteRequest($tenantId: String, $id: Long) {
        deleteRequest(tenantId: $tenantId, id: $id)
    }
`
