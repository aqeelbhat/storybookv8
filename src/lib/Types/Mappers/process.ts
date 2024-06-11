import { SelectorEntry } from "../../ProcessStep"
import { Branch, ProcessInfo, ProcessInstance, Node } from "../process"
import { Selection } from "../request"
import { Task } from "../task"
import { mapUserId } from "./common"
import { mapEngagement } from "./engagement"
import { mapTask } from "./task"

export function mapSelection (selection: Selection | null): Selection {
    let regions: Array<string> = []
    let categories: Array<string> = []
    let partnerLevels: Array<string> = []
    let projectLevels: Array<string> = []
    let partnerRegions: Array<string> = []
    let businessUnits: Array<string> = []
    let brands: Array<string> = []
  
    if (selection && selection.regions && selection.regions.length) {
      regions = selection.regions
    }
  
    if (selection && selection.categories && selection.categories.length) {
      categories = selection.categories
    }
  
    if (selection && selection.partnerLevels && selection.partnerLevels.length) {
      partnerLevels = selection.partnerLevels
    }
  
    if (selection && selection.projectLevels && selection.projectLevels.length) {
      projectLevels = selection.projectLevels
    }
  
    if (selection && selection.partnerRegions && selection.partnerRegions.length) {
      partnerRegions = selection.partnerRegions
    }
  
    if (selection && selection.businessUnits && selection.businessUnits.length) {
      businessUnits = selection.businessUnits
    }
  
    if (selection && selection.brands && selection.brands.length) {
      brands = selection.brands
    }
  
    const selectionObj: Selection = {
      regions,
      categories,
      partnerLevels,
      projectLevels,
      partnerRegions,
      businessUnits,
      brands,
      requester: selection ? mapUserId(selection.requester) : mapUserId(null),
      isNewPartner: selection ? selection.isNewPartner : false,
      spendBucket: selection ? selection.spendBucket : 0
    }
  
    return selectionObj
}

export function mapSelectorEntry (selectorEntry: SelectorEntry | null): SelectorEntry {
    let regions: Array<string> = []
    let categories: Array<string> = []
  
    if (selectorEntry && selectorEntry.regions && selectorEntry.regions.length) {
      regions = selectorEntry.regions
    }
  
    if (selectorEntry && selectorEntry.categories && selectorEntry.categories.length) {
      categories = selectorEntry.categories
    }
  
    const selectorEntryObj: SelectorEntry = {
      regions,
      categories
    }
  
    return selectorEntryObj
}

export function mapNode (node: Node): Node {
    const nodeObj: Node = {
      id: node ? node.id : 0,
      state: node ? node.state : '',
      started: node ? node.started : '',
      completed: node ? node.completed : '',
      name: node ? node.name : '',
      description: node ? node.description : '',
      daysCompleted: node ? node.daysCompleted : 0,
      estimateDays: node ? node.estimateDays : 0
    }
  
    return nodeObj
}

export function mapBranch (branch: Branch): Branch {
    let nodes: Array<Node> = []
  
    if (branch && branch.nodes && branch.nodes.length) {
      nodes = branch.nodes.map(node => mapNode(node))
    }
  
    const branchObj: Branch = {
      id: branch ? branch.id : 0,
      state: branch ? branch.state : '',
      started: branch ? branch.started : '',
      completed: branch ? branch.completed : '',
      name: branch ? branch.name : '',
      description: branch ? branch.description : '',
      estimateDays: branch ? branch.estimateDays : 0,
      daysCompleted: branch ? branch.daysCompleted : 0,
      nodes
    }
  
    return branchObj
}

export function mapProcessInstance (processInstance: ProcessInstance | null): ProcessInstance {
    const processInstanceObj: ProcessInstance = {
      id: processInstance ? processInstance.id : '',
      tenantId: processInstance ? processInstance.tenantId : '',
      branch: processInstance && processInstance.branch ? mapBranch(processInstance.branch) : null,
      requester: processInstance ? mapUserId(processInstance.requester) : mapUserId(null),
      vendorId: processInstance ? processInstance.vendorId : '',
      selectorEntry: processInstance ? mapSelectorEntry(processInstance.selectorEntry) : mapSelectorEntry(null),
      selection: processInstance ? mapSelection(processInstance.selection) : mapSelection(null),
      priority: processInstance ? processInstance.priority : '',
      status: processInstance ? processInstance.status : ''
    }
  
    return processInstanceObj
}

export function mapProcessInfo (processInfo: ProcessInfo): ProcessInfo {
    let tasks: Array<Task> = []
  
    if (processInfo && processInfo.tasks && processInfo.tasks.length) {
      tasks = processInfo.tasks.map(task => mapTask(task))
    }
  
    const processInfoObj: ProcessInfo = {
      processInstance: processInfo?.processInstance ? mapProcessInstance(processInfo.processInstance) : mapProcessInstance(null),
      engagement: processInfo?.engagement ? mapEngagement(processInfo.engagement) : null,
      tasks,
      actingTask: processInfo?.actingTask ? mapTask(processInfo.actingTask) : null
    }
  
    return processInfoObj
}