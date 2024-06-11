import { gql } from '@apollo/client'
import { APPROVAL_FIELDS } from './fragments'

export const GET_IS_CURRENT_USER_ADMIN = gql`
  query isCurrentUserAdmin {
    isCurrentUserAdmin
  }
`

export const GET_PENDING_APPROVALS_FOR_USER = gql`
  query pendingApprovalsForApprover($tenantId: String) {
    pendingApprovalsForApprover(tenantId: $tenantId) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`

export const PENDING_APPROVAL_FOR_REQUESTER = gql`
  query pendingApprovalsForRequester($tenantId: String) {
    pendingApprovalsForRequester(tenantId: $tenantId) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`

export const PENDING_APPROVALS_FOR_TEAM = gql`
  query penndingApprovalsForTeam(
    $tenantId: String
    $workstream: WorkstreamInput
  ) {
    penndingApprovalsForTeam(tenantId: $tenantId, workstream: $workstream) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`
