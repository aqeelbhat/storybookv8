import { mapUserId } from "../Types";
import { InAppNotification, Metadata } from "./types";

export function mapMetadata (data: any): Metadata {
    return {
        engagementId: data?.engagementId || '',
        taskId: data?.taskId || ''
    }
}

export function mapInAppNotification (data: any): InAppNotification {
    return  {
        id: data?.id || '',
        type: data?.type,
        title: data?.title || '',
        message: data?.message || '',
        link: data?.link || '',
        linkText: data?.linkText || '',
        metadata: mapMetadata(data?.metadata) || null,
        userName: data?.userName || '',
        read: data?.read || false,
        fromUser: mapUserId(data?.fromUser) || null,
        created: data?.created
    }
}

export function mapInAppNotificationList (data: Array<any>): Array<InAppNotification> {
    return data?.map(mapInAppNotification)
}