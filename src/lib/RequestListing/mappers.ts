import { getUserDisplayName } from "../Form/util";
import { User, UserId, mapUserId } from "../Types";
import { ListType, RequestList, SmartList } from "./types";

export function mapSmartList (data: any) : SmartList {
    return {
        id: data?.id || 0,
        owner: mapUserId(data?.owner) || null,
        sharedWith: (data?.sharedWith !== null && data?.sharedWith.length > 0 && data?.sharedWith.map(mapUserId)) || null,
        name: data?.name || '',
        type: data?.type || ListType.request,
        config: data?.config
    }
}

export function mapSmartListArray (data: any): Array<SmartList> {
    return Array.isArray(data) && data.length > 0 ? data.map(mapSmartList) : []
}

export function mapRequestList (data: any): RequestList {
    return {
        mine: Array.isArray(data?.mine) && data?.mine?.length > 0 ? data.mine.map(mapSmartList) : [],
        sharedWithMe: Array.isArray(data?.sharedWithMe) && data?.sharedWithMe?.length > 0 ? data.sharedWithMe.map(mapSmartList) : [],
    }
}

export function mapUserToUserId (user: User): UserId {
    return {
      ...user,
      userName: user.userName || user.email || '',
      name: getUserDisplayName(user)
    }
  }
  