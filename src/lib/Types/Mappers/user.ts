import { Approval } from '../user'
import { mapIDRef, mapUserId } from './common'

export function mapApproval (data?: any): Approval {
  return {
    id: data?.id || undefined,
    type: data?.type || undefined,
    memberType: data?.memberType || undefined,
    workstream: data?.workstream ? mapIDRef(data.workstream) : undefined,
    program: data?.program ? mapIDRef(data.program) : undefined,
    requester: data?.requester ? mapUserId(data.requester) : undefined,
    approver: data?.approver ? mapUserId(data.approver) : undefined,
    approvalTime: data?.approvalTime || undefined,
    status: data?.status || undefined,
    reason: data?.reason || undefined,
    manager: data?.manager ? mapUserId(data.manager) : undefined,
    region: data?.region ? mapIDRef(data.region) : undefined,
    site: data?.site ? mapIDRef(data.site) : undefined,
    jobTitle: data?.jobTitle || undefined
  }
}
