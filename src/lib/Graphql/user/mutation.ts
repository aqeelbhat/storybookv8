import { gql } from "@apollo/client";
import { APPROVAL_FIELDS } from "./fragments";

export const APPROVE_TEAM_REQUEST = gql`
  mutation approveTeamRequest($tenantId: String, $approvalId: Long) {
    approveTeamRequest(tenantId: $tenantId, approvalId: $approvalId) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`

export const UPDATE_APPROVAL_WORKSTREAM = gql`
  mutation updateApprovalWorkstream($tenantId: String, $approvalId: Long, $workstream: IDRefInput) {
    updateApprovalWorkstream(tenantId: $tenantId, approvalId: $approvalId, workstream: $workstream) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`

export const DENY_TEAM_REQUEST = gql`
  mutation denyTeamRequest($tenantId: String, $approvalId: Long, $reason: String) {
    denyTeamRequest(tenantId: $tenantId, approvalId: $approvalId, reason: $reason) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`

export const REQUEST_FOR_TEAM = gql`
  mutation requestForTeam($tenantId: String, $teams: [WorkstreamInput], $appType: AppType, $approval: ApprovalInput, $jobTitle: String) {
    requestForTeam(tenantId: $tenantId, teams: $teams, appType: $appType, approval: $approval, jobTitle: $jobTitle) {
      ...ApprovalFields
    }
  }
  ${APPROVAL_FIELDS}
`
