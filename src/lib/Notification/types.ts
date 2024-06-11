import { UserId } from ".."

export enum TYPE {
    AtMention = 'AtMention',
    TaskReminder = 'TaskReminder',
    RMI = 'RMI',
    Reply = 'Reply',
    MessageShare = 'MessageShare',
    RMI_REPLY = 'RMI_REPLY'
}

export interface Metadata {
    engagementId?: string
    taskId?: string
}

export interface InAppNotification {
    id: string
    type: TYPE
    title: string
    message: string
    link: string
    linkText: string
    metadata: Metadata | null
    userName: string
    read: boolean
    fromUser: UserId | null
    created?: string
}