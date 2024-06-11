import { DelegateUser } from "../delegate"
import { mapUserId } from "./common"

export function mapDelegateUser (data: any): DelegateUser {
    return {
        userId: mapUserId(data?.userId),
        startDate: data?.startDate || '',
        endDate: data?.endDate || '',
        reason: data?.reason || '',
        byUserName: data?.byUserName || '',
        byUser:  mapUserId(data?.byUser)
    }
}

export function mapDelegateUserList (data: any): Array<DelegateUser> {
    return data && Array.isArray(data) ? data.map(mapDelegateUser) : []
}