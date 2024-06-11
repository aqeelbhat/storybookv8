import { ProcessTask, StandardTaskType, TaskAssignmentType, TaskStatus } from "../Types"

export const KEY_SUBMITTED_REQUESTS = 'recentlySubmittedRequests'

export function isLate (lateDate: string): boolean {
    return lateDate ? Date.now() > new Date(lateDate).getTime() : false
}

export function getEngagementCurrentStepFromPendingList (processTasks: Array<ProcessTask>): ProcessTask | null {
    return processTasks?.length > 0 ? processTasks[0] : null
}

export function isTaskAssignedToCurrentUser (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask!.assignedToCurrentUser
}

export function isTaskOwner (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask.assignedToCurrentUser
}

export function isApprovalTask (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask.type === StandardTaskType.approval
}

export function isManualTask (processTasks: Array<ProcessTask>): boolean {
  const processTask = getEngagementCurrentStepFromPendingList(processTasks)
  return !!processTask && processTask.type === StandardTaskType.manual
}
  
export function isReviewTask (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask.type === StandardTaskType.review
}
  
export function isTaskStatusPending (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask.taskStatus === TaskStatus.pending
}

export function isTaskStatusInreview (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask.taskStatus === TaskStatus.inreview
}

export function isTaskAssignedToPartner (processTasks: Array<ProcessTask>): boolean {
    const processTask = getEngagementCurrentStepFromPendingList(processTasks)
    return !!processTask && processTask.assignmentType === TaskAssignmentType.partner
}

export function isEngagementIdInSubmittedRequestCache (requestId: string): boolean {
    const submittedRequest: string | null = localStorage.getItem(KEY_SUBMITTED_REQUESTS)
    if (submittedRequest) {
      try {
        const submittedRequestsArray: Array<string> = JSON.parse(submittedRequest)
        if (Array.isArray(submittedRequestsArray) && submittedRequestsArray.includes(requestId)) {
          return true
        }
      } catch (err) {
        console.log('Error parsing string value', err)
        return false
      }
    }
  
    return false
  }
  
  export function unRegisterSubmittedRequestInCache (requestId: string) {
    const submittedRequest: string | null = localStorage.getItem(KEY_SUBMITTED_REQUESTS)
  
    if (submittedRequest) {
      try {
        let submittedRequestsArray: Array<string> = JSON.parse(submittedRequest)
        if (Array.isArray(submittedRequestsArray) && submittedRequestsArray.includes(requestId)) {
          submittedRequestsArray = submittedRequestsArray.filter(id => id !== requestId)
          localStorage.setItem(KEY_SUBMITTED_REQUESTS, JSON.stringify(submittedRequestsArray))
        }
      } catch (err) {
        console.log('Error parsing string value', err)
      }
    }
  }