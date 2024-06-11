import { IDRef, Label, MeasureTask, TaskStatus, UserId } from "../Types"

export enum StreamMessageType {
    private = 'private',
    public = 'public',
    issue = 'issue'
}

export enum MeasureTaskType {
    measure = 'measure',
    action = 'action',
    programAction = 'programAction',
    privateNote = 'privateNote',
    issue = 'issue'
}

export enum TAGCATEGORY {
    customTag = 'customTag',
    teams = 'teams',
    measures = 'measures'
}

export enum TaskFilterSort {
    dueDate = 'dueDate',
    dueDateAsc = 'dueDateAsc',
    startDate = 'startDate',
    startDateAsc = 'startDateAsc',
    created = 'created',
    createdDesc = 'createdDesc',
    id = 'id',
    idAsc = 'idAsc'
}

export interface NoteInput {
    noteId: string
    comment: string
    commentMeta: string
    users?: UserId[] | undefined
}

export interface MeasureTaskInput {
    id?: string
    name: string
    description: string
    descriptionMeta?: string
    taskStatus?: TaskStatus | null
    type?: MeasureTaskType | null
    owner?: UserId | null
    users?: Array<UserId>
    workstreams?: Array<IDRef>
    isRestricted?: boolean
    publicNote?: boolean
    isImportant?: boolean
    formsReadOnly?: boolean
}

export interface Workstream {
    code: string
    name: string
    engagementPrefix: string
    programRef: IDRef
    deprecated?: boolean
}

export interface ApprovalInput {
    manager?: UserId | null,
    region?: IDRef | null,
    site?: IDRef | null,
    reason?: string,
    referrer?: UserId | null,
    jobTitle?: string
  }

export interface EngagementSuggestion {
    id: string
    engagementId: string
    activityName: string
}

export interface AddTaskInputProps {
    name: string
    isImportant?: boolean | undefined
    description: string
    owner: { userName: string, name: string } | null
    taskStatus: TaskStatus
    dueDate: string | null
    startDate: string | null
    task?: MeasureTask
    priority: string | null
    type?: TaskStatus
    actionType?: MeasureTaskType | null
    relatedMeasure?: IDRef | null
    workstream?: IDRef | null
    program?: IDRef | null
    relatedMeasures?: Array<IDRef>
    workstreams?: Array<IDRef>
    labels?: Array<Label>
    users?: Array<{ userName: string, name: string }>
}

export interface Participant {
    tenantId?: string
    userName: string
    name: string
    picture?: string
    isUser: boolean
    isSupplier: boolean
    isMentionUser?: boolean
}