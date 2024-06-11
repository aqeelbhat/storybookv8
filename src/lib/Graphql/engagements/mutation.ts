import { gql } from '@apollo/client'
import { ENGAGEMENTS_SOURCE_FIELDS } from './fragament'

export const UPDATE_ENGAGEMENT_CONTACT = gql`
    mutation updateEngagementContact($tenantId: String, $taskId: Long, $engagementContact: ContactInput) {
        updateEngagementContact(tenantId: $tenantId, taskId: $taskId, engagementContact: $engagementContact) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const UPDATE_ENGAGEMENT_PROGRESS_NOTE = gql`
    mutation updateEngagementProgressNotes($tenantId: String, $engagementId: Long, $pastComment: String, $upcomingComment: String, $date: LocalDate, $isEdit: Boolean) {
        updateEngagementProgressNotes(tenantId: $tenantId, engagementId: $engagementId, pastComment: $pastComment, upcomingComment: $upcomingComment, date: $date, isEdit: $isEdit) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const UPDATE_ENGAGEMENT_DESCRIPTION = gql`
mutation updateEngagementDescription($tenantId: String, $engagementId: Long, $description: String) {
    updateEngagementDescription(tenantId: $tenantId, engagementId: $engagementId, description: $description) {
        ...EngagementsSourceFields
    }
}
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const UPDATE_ENGAGEMENT_PROGRESS_NO_UPDATE = gql`
    mutation updateEngagementProgressNoUpdate($tenantId: String, $engagementId: Long, $date: LocalDate) {
        updateEngagementProgressNoUpdate(tenantId: $tenantId, engagementId: $engagementId, date: $date) {
            ...EngagementsSourceFields
        }
    }
    ${ENGAGEMENTS_SOURCE_FIELDS}
`

export const SEND_ENGAGEMENT_PROGRESS_COMMENT = gql`
    mutation sendEnagagementProgressComment($tenantId: String, $engagementId: Long, $comment: String) {
        sendEnagagementProgressComment(tenantId: $tenantId, engagementId: $engagementId, comment: $comment)
    }
`
