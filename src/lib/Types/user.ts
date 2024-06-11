import { IDRef, UserId } from './common'

export interface Approval {
  id?: string
  type?: string
  memberType?: string
  workstream?: IDRef
  program?: IDRef
  requester?: UserId
  approver?: UserId
  approvalTime?: string
  status?: string,
  reason?: string,
  manager?: UserId,
  region?: IDRef,
  site?: IDRef
  jobTitle?: string
}
