import { gql } from '@apollo/client'
import { ID_REF_SOURCE_FIELDS, USER_ID_SOURCE_FIELDS } from '..'

export const APPROVAL_FIELDS = gql`
  fragment ApprovalFields on Approval {
    id
    type
    memberType
    workstream {
      ...IDRefSourceFields
    }
    program {
      ...IDRefSourceFields
    }
    requester {
      ...UserIdSourceFields
    }
    approver {
      ...UserIdSourceFields
    }
    approvalTime
    status
    manager {
      ...UserIdSourceFields
    }
    referrer {
      ...UserIdSourceFields
    }
    region {
      ...IDRefSourceFields
    }
    site {
      ...IDRefSourceFields
    }
    reason
    jobTitle
  }
  ${ID_REF_SOURCE_FIELDS}
  ${USER_ID_SOURCE_FIELDS}
`
