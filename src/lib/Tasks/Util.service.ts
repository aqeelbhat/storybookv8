import { DragTask } from "./types"
import Approve from './assets/approve.svg'
import Review from './assets/review.svg'
import DocCollection from './assets/doc-collection.svg'
import ToDo from './assets/todo.svg'
import SysTask from './assets/sys-task.svg'
import TPartyTask from './assets/3rd-party-task.svg'

export const TASK_TYPE_APPROVAL = 'approval'
export const TASK_TYPE_REVIEW = 'review'
export const TASK_TYPE_BRANCHING = 'branching'
export const TASK_TYPE_TODO = 'manual'
export const TASK_TYPE_PROCESS = 'process'

export const TASK_LIST: Array<DragTask> = [
  { id: TASK_TYPE_APPROVAL, displayName: 'Approval', icon: Approve },
  { id: TASK_TYPE_REVIEW, displayName: 'Review', icon: Review },
  { id: TASK_TYPE_TODO, displayName: 'To Do', icon: ToDo },
  { id: TASK_TYPE_BRANCHING, displayName: 'Document collection', icon: DocCollection },
  { id: 'system_task', displayName: 'System task', icon: SysTask },
  { id: 'third_party_task', displayName: '3rd party task', icon: TPartyTask }
]
