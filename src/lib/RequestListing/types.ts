import { UserId } from "../Types/common"

export enum ListType {
  request= 'request',
  measure = 'measure'
}

export interface SmartList {
  id?: number
  owner?: UserId
  sharedWith?: Array<UserId> | null
  name: string
  type: ListType
  config?: any
}

export interface RequestList {
  mine: Array<SmartList>
  sharedWithMe: Array<SmartList>
}
