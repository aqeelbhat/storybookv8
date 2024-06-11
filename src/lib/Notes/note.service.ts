import moment from 'moment'
import { getSignedUser } from '../SigninService'
import { Engagement, MeasureTask, NormalizedVendorRef, Note, TaskStatus, User, UserId } from '../Types'
import { MeasureTaskInput } from './types'
import { SuggestionDataItem } from 'react-mentions'

export function isSignedInUserTaskOwner (issueTask: MeasureTask) {
  const owner = issueTask.owner
  if (owner != null) {
    return getSignedUser()?.userName === owner.userName
  }

  return false
}

export function isSignedInUserReplyTaskOwner (note: Note) {
  const owner = note.owner
  if (owner != null) {
    return getSignedUser()?.userName === owner.userName
  }

  return false
}

export function isSignedInUserParticipant (issueTask: MeasureTask) {
  return issueTask.users.some((user: UserId) => user.userName === getSignedUser()?.userName) ||
  isSignedInUserTaskOwner(issueTask)
}

export function isSignedInUserRequester (engagement: Engagement): boolean {
  if (getSignedUser()?.userName === engagement.requester?.userName) {
    return true
  }

  return false
}

export function isAtleastOneSupplierContactExists (engagement: Engagement): boolean {
  if (Array.isArray(engagement.variables.partners) && engagement.variables.partners.length > 0) {
    const supplier: NormalizedVendorRef = engagement.variables.partners[0]
    if (supplier.contact && supplier.contact.email) {
      return true
    }
  }
  return false
}

export function isNoIssuesVisible (issues: Array<MeasureTask>): boolean {
  // As a backened response, User will receive pending and done issues if he is participant, owner or issue isRestrcicted flag is false
  const pending = issues.filter(issue => issue.taskStatus === TaskStatus.pending)
  const done = issues.filter(issue => issue.taskStatus === TaskStatus.done)

  // notStarted issues are only visible to task owner, This is handled by client side
  // notStarted issues are always returned as backend response, as by default notStarted issues have isRestrcicted set to false by default
  const issuesCreatedBySignedUser = issues.filter(issue => issue.taskStatus === TaskStatus.notStarted && isSignedInUserTaskOwner(issue))

  if (pending.length + done.length > 0) {
    return false
  }

  if (issuesCreatedBySignedUser.length > 0) {
    return false
  }

  return true
}

export function trimMeasureTaskInput (measureTaskInput: MeasureTaskInput): MeasureTaskInput {
  const trimmedTask: MeasureTaskInput = { ...measureTaskInput }
  // trim users for graphql input
  if (measureTaskInput.users && measureTaskInput.users.length > 0) {
    const users: Array<UserId> = []
    for (let i = 0; i < measureTaskInput.users.length; i++) {
      users.push({
        tenantId: measureTaskInput.users[i].tenantId,
        userName: measureTaskInput.users[i].userName,
        name: measureTaskInput.users[i].name,
        userNameCP: measureTaskInput.users[i].userNameCP
      })
    }
    trimmedTask.users = users
  }

  // trim owner for graphql input
  if (measureTaskInput.owner) {
    const owner: UserId = {
      tenantId: measureTaskInput.owner.tenantId,
      userName: measureTaskInput.owner.userName,
      name: measureTaskInput.owner.name,
      userNameCP: measureTaskInput.owner.userNameCP
    }

    trimmedTask.owner = owner
  }

  return trimmedTask
}

export function getCreatedDateTime (date: string | Date | undefined): string {
  if(!date){
    return ''
  }

  const _date = moment(date)
  const today = moment()
  const tomorrow = today.add(1,'days')
  const yesterday = today.add(-1,'days')
  if (_date.isSame(today, 'day') || _date.isSame(tomorrow, 'day') || _date.isSame(yesterday,'day')) {
    const dayString = _date.calendar().split(' ')[0]
    return `${dayString} @ ${_date.format('h:mm a')}`
  }
  return _date.format('DD MMM, YYYY @ h:mm a')
}

export function getUsersListForPayload (selectedUsersList: User[]): Array<UserId> {
  return selectedUsersList.map((user: User) => {
    if (user.name) {
      return { ...user, name: `${user.name}` }
    } else {
      return { ...user, name: `${user.firstName} ${user.lastName}`.trim() }
    }
  })
}

export function getUserFromList (suggestion: SuggestionDataItem, usersList: Array<UserId>, selectedUsersList: Array<UserId>): UserId | null {
  const findUser = usersList.find(user => user.userName === suggestion.id)
  const findUserFromSelectedList = selectedUsersList.find(user => user.userName === suggestion.id)
  return findUser ? findUser : findUserFromSelectedList ? findUserFromSelectedList : { name: suggestion.display, userName: suggestion.id }
}

export function getUserListForNoteReply (suggestion: SuggestionDataItem): UserId | null {
  return { name: suggestion.display, userName: suggestion.id }
}

export function getOwnerName (user: User | UserId): string {
  if ((user as User).firstName || (user as User).lastName) {
    return `${(user as User).firstName} ${(user as User).lastName}`
  } else {
    return (user as UserId).name || user.userName || (user as User).email
  }
}

export function isMeasureTaskStatusCompleted(status: string) {
  return status === TaskStatus.done || status === TaskStatus.approved
}
