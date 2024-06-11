import { DatesInfo, QuestionnaireId, RoleForms, StandardTaskType, TaskStatus, UserId } from "..";

export enum StandardStepTypes {
    Approval = 'Approval',
    Review = 'Review',
    DocumentCollection = 'DocumentCollection',
    Api = 'Api',
    ToDo = 'ToDo',
    Subprocess = 'Subprocess',
    Notification = 'Notification',
    TaskCollection = 'TaskCollection'
}