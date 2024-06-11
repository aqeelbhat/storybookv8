import { QuestionnaireId, Task, TaskAssignment } from "../Types";

export enum TaskStatus {
    approved = 'approved',
    rejected = 'rejected',
    pending = 'pending',
    inreview = 'inreview',
    cancelled = 'cancelled',
    done = 'done',
    notStarted = 'notStarted',
    inProgress = 'inProgress',
    stopped = 'stopped',
    notApplicable = 'notApplicable',
    deleted = 'deleted'
}

export interface Node {
    id: number
    nodeDefId: string
    state: string
    started: string
    completed: string
    name: string
    description: string
    daysCompleted: number
    estimateDays: number
}

export interface SelectorEntry {
    regions: string[]
    categories: string[]
}

export interface ProcessDefinitionId {
    name: string
}

export interface ProcessNode extends Node {
    id: number
    state: string
    started: string
    completed: string
    name: string
    description: string

    subprocessId: number
    subprocess: ProcessDefinitionId
    selectorEntry: SelectorEntry
}

export interface Subprocess {
    name: string
}

export interface TaskNode extends Node {
    id: number
    state: string
    subState: string
    started: string
    completed: string
    name: string
    description: string
    notStarted: boolean

    inputs: [QuestionnaireId]
    outputForm: string
    outputFormTitle: string
    outputFormType: string
    inputFormNames: [QuestionnaireId]
    output: QuestionnaireId
    type: string
    taskId: string
    daysCompleted: number
    estimateDays: number
    assignedTo: TaskAssignment
    subprocessId: string
    totalSteps: number
    subprocess: Subprocess
    sequenced: boolean
    estimateCompletionDate: string
}

export interface TaskStep {
    taskId: string
    stepIndex: number
    paths: string[]
}

export interface ProcessStep {
    index: number
    processId: string
    node: TaskNode
    steps: ProcessStep[]
    parallel: Boolean
    numberOfDocuments: number
    selectedForms: QuestionnaireId[]
    type: string
    taskIds: TaskStep[]
    subProcessId: string
}

export interface ProcessStepInfo {
    tasks: Task[]
    steps: ProcessStep[]
    daysToComplete: number
}

export interface ProcessDurationResult {
    min: string;
    max: string;
    configs: object
}