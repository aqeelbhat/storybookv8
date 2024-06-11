import { getSignedUser } from "../SigninService/signin.service"
import { Engagement, StandardTaskType, TaskAssignmentType, TaskStatus } from "../Types/engagement"
import { Task } from "../Types/task"

export function isApprovalTask (task: Task): boolean {
    return task.type === StandardTaskType.approval
  }
  
  export function isReviewTask (task: Task): boolean {
    return task.type === StandardTaskType.review
  }
  
  export function isDocCollectionTask (task: Task): boolean {
    return task.type === StandardTaskType.documentCollection
  }
  
  export function isManualTask (task: Task): boolean {
    return task.type === StandardTaskType.manual
  }
  
  export function isAPITask (task: Task): boolean {
    return task.type === StandardTaskType.api
  }
  
  export function isTaskStatusPending (task: Task): boolean {
    return task.taskStatus === TaskStatus.pending
  }
  
  export function isTaskStatusInReview (task: Task): boolean {
    return task.taskStatus === TaskStatus.inreview
  }
  
  export function isTaskStatusApproved (task: Task): boolean {
    return task.taskStatus === TaskStatus.approved
  }
  
  export function isTaskStatusRejected (task: Task): boolean {
    return task.taskStatus === TaskStatus.rejected
  }
  
  export function isTaskStatusDone (task: Task): boolean {
    return task?.taskStatus === TaskStatus.done || false
  }
  
  export function isTaskOwner (task: Task): boolean {
    return task?.assignedToCurrentUser || false
  }
  
  export function isTaskAssignedToPartner (task: Task): boolean {
    return task?.assignmentType === TaskAssignmentType.partner || false
  }
  
  export function isRequester (engagement: Engagement): boolean {
    return (engagement?.requester && engagement.requester?.userName === getSignedUser().userName) || false
  }
  
  export function isTaskSuspended (task: Task): boolean {
    return task?.suspended || false
  }
  
  export function isTaskUnAssignedUser (engagement: Engagement, task: Task): boolean {
    return !isRequester(engagement) && !isTaskOwner(task)
  }