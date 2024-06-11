import { UserId } from "./common";
import { DatesInfo, RoleForms, StandardTaskType, TaskAssignment, TaskStatus } from "./engagement";
import { QuestionnaireId } from "./questionnaire";

export interface Task {
    id: string
    nodeDefId: string
    started: string
    completed: string
    handlingStarted: string
    minutes: number
    name: string
    inputForms: QuestionnaireId[]
    classfiedInputforms: RoleForms[]
    editableInputForms: string[]
    outputFormId: QuestionnaireId | null
    questionnaireId: number
    type: StandardTaskType | null
    taskStatus: TaskStatus | null
    suspended: boolean
    ownerId: string
    engagementId: string
    assignedToCurrentUser: boolean
    editableInputs: boolean
    assignmentType: string
    users: UserId[]
    datesInfo: DatesInfo | null
    partnerName: string
    processId: string
    processName: string
    actionTitle?: string
    resubmitted?: boolean
    msgClosed?: boolean
    infoMsgId?: string
    lastMsgTime?: string
    lastMsg?: string
    lastMsgBy?: string
    lastMsgUser?: string
    milestoneDatesRequired?: boolean
    ebitPlanRequired?: boolean
    ownerName: string
    assignedTo: TaskAssignment | null
    lateDate: string
    convertToMeasure?: boolean,
    nodeId?: string
    allowDeny: boolean
}