import { gql } from '@apollo/client'
import { ENGAGEMENTS_SOURCE_FIELDS } from './fragament'
import { CONTACT_SOURCE_FIELDS, USER_ID_SOURCE_FIELDS } from './../common/fragments'
import { ENGAGEMENT_TASK_FIELDS, QUESTIONNAIREID_SOURCE_FIELDS, ROLE_FORMS_SOURCE_FIELDS } from '../task/fragaments'

export const GET_ENGAGEMENT = gql`
    query engagement($tenantId: String, $id: Long) {
        engagement(tenantId: $tenantId, id: $id) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const GET_ENGAGEMENTS = gql`
    query engagements($tenantId: String, $from: Int, $size: Int, $appType: AppType, $filter: EngagementFilter) {
        engagements(tenantId: $tenantId, from: $from, size: $size, appType: $appType, filter: $filter) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const GET_ALL_ENGAGEMENTS = gql`
    query allEngagements($tenantId: String, $from: Int, $size: Int, $appType: AppType) {
        allEngagements(tenantId: $tenantId, from: $from, size: $size, appType: $appType) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const GET_ENGAGEMENTS_BY_SUPPLIER = gql`
    query engagementsBySupplier($tenantId: String, $legalEntityid: String, $appType: AppType) {
        engagementsBySupplier(tenantId: $tenantId, legalEntityid: $legalEntityid, appType: $appType) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const GET_ENGAGEMENTS_BY_NORMALIZED_SUPPLIER = gql`
    query engagementsByNormalizedSupplier($tenantId: String, $normalizedVendorId: Long, $appType: AppType) {
        engagementsByNormalizedSupplier(tenantId: $tenantId, normalizedVendorId: $normalizedVendorId, appType: $appType) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const GET_PROCESS_FORMS = gql`
    query processForms($tenantId: String, $processId: Long) {
        processForms(tenantId: $tenantId, processId: $processId) {
            ...RoleFormsSourceFields
        }
    }
    ${ROLE_FORMS_SOURCE_FIELDS}
`


export const GET_ENGAGEMENT_FORMS = gql`
  query engagementForms($tenantId: String, $processId: Long) {
    engagementForms(tenantId: $tenantId, processId: $processId) {
        ...QuestionnaireIdSourceFields
    }
  }
  ${QUESTIONNAIREID_SOURCE_FIELDS}
`

export const GET_ENGAGEMENT_CONTACTS = gql`
    query engagementContacts($tenantId: String, $id: Long) {
        engagementContacts(tenantId: $tenantId, id: $id) {
            ...ContactSourceFields
        }
    }
    ${CONTACT_SOURCE_FIELDS}
`

export const GET_ENGAGEMENT_TASKS = gql`
    query engagementTasks($tenantId: String, $appType: AppType, $filter: TaskFilter, $showTeam: Boolean) {
        engagementTasks(tenantId: $tenantId, appType: $appType, filter: $filter, showTeam: $showTeam) {
            ...EngagementTaskFields
        }
    }
    ${ENGAGEMENT_TASK_FIELDS}
`

export const GET_ENGAGEMENT_PROGRESS_HISTORY = gql`
    query engagementProgressHistory($tenantId: String, $engagementId: Long) {
        engagementProgressHistory(tenantId: $tenantId, engagementId: $engagementId) {
            date
            past
            upcoming
            by {
                ...UserIdSourceFields
            }
        }
    }
    ${USER_ID_SOURCE_FIELDS}
`
