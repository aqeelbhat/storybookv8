import { SelectorEntry } from "../ProcessStep";
import { UserId } from "./common";
import { Engagement } from "./engagement";
import { Selection } from "./request";
import { Task } from "./task";

export interface Node {
    id: number
    state: string
    started: string
    completed: string
    name: string
    description: string
    daysCompleted: number
    estimateDays: number
}

export interface Branch extends Node {
    id: number
    state: string
    started: string
    completed: string
    name: string
    description: string
    nodes: Node[]
}

export interface ProcessInstance {
    id: string
    tenantId: string
    branch: Branch | null
    requester: UserId
    vendorId: string
    selectorEntry: SelectorEntry
    selection: Selection
    priority: string
    status: string
}

export interface ProcessInfo {
    processInstance: ProcessInstance
    engagement: Engagement | null
    tasks: Array<Task>
    actingTask: Task | null
}