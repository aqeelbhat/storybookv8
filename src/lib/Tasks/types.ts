import { MenuItem } from "../menu/types";
import { GroupId, QuestionnaireId, UserId } from "../Types";

export interface Task {
    index: number;
    id: number;
    type: string;
    displayName: string;
    tasks: Array<Task>;
    isParallel: boolean;
    numberOfDocuments: number;
    numberOfSteps: number;
    selectedForms: Array<QuestionnaireId>;
    groups: Array<GroupId>
    inputFormNames: Array<QuestionnaireId>
    action: Action
    assignment: Assignment
    checkListName: string
}

export interface Action {
    instruction: string
    title: string
}

export interface Assignment {
    type: string
    functionalGroupId?: any
    groups?: any
    users?: any
    avoidAutoMemberAssignment?: boolean
}
export function mapAssignment (assignmentData: any): Assignment {
    return {
      type: assignmentData?.type || '',
      functionalGroupId: assignmentData?.functionalGroupId || null,
      groups: assignmentData?.groups || [],
      users: assignmentData?.users || [],
      avoidAutoMemberAssignment: assignmentData?.avoidAutoMemberAssignment || false
    }
  }

export interface DragTask {
    id: string,
    displayName: string,
    icon?: string
}

export interface ProcessDefinition {
    name: string
    processType: string
    tenantId: string
    shortDescription: string
    inputForms: Array<QuestionnaireId>
    selector: Selector
    acl: ACL
}

export interface ACL {
    users: Array<UserId>
    groups: Array<GroupId>
}

export interface Selector {
    businessUnits: Array<string>
    regions: Array<string>
    categories: Array<string>
    partnerLevels: Array<string>
    projectLevels: Array<string>
    partnerRegions: Array<string>
    isNewPartner: boolean
    reusable: boolean
    requesterBased: boolean
    partnerBased: boolean
}

export interface TaskRowProps {
    task: Task
    className?: string
    isSelected?: boolean
    readOnly?: boolean
    callback?: {
        onDrop?: (id: number, taskItem: string, taskItemType: string, dropLocaton: string) => any
        onMoveNode?: (id: number, moveNodeId: number, dropLocaton: string) => any
        onTaskClick?: (task: Task) => any
        onMenuOptionClick?: (taskMenuOption: TaskMenuOption) => any
    }
}

export interface TasksProps {
    tasks: Array<Task>,
    processDefinition: ProcessDefinition,
    readOnly?: boolean,
    callback?: {
        onFirstDrop?: (taskItem: string, taskItemType: string) => any
        onStartSelected: (type: string) => any
        onTaskSelected?: (task: Task | null) => any
        onTaskNameChange?: (param: string) => void
        onDropParallel?: (id: number, taskItem: string, taskItemType: string, dropLocaton: string) => any
        onDropSerial?: (id: number, taskItem: string, taskItemType: string) => any
        onDropSerialBefore?: (id: number, taskItem: string, taskItemType: string) => any
        onMoveNode?: (id: number, moveNodeId: number, dropLocaton: string) => any
        onMoveNodeSerial?: (id: number, moveNodeId: number) => any
        onMoveNodeSerialBefore?: (id: number, moveNodeId: number) => any
        onMenuOptionClick?: (taskMenuOption: TaskMenuOption) => any
    }
}

export interface TaskMenuOption {
    option: MenuItem
    task: Task
}