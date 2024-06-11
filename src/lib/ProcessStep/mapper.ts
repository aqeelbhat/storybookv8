import { mapQuestionnaireId } from "../Types/Mappers/questionnaire"
import { mapTask, mapTaskAssignment } from "../Types/Mappers/task"
import { ProcessStep, ProcessStepInfo, Subprocess, TaskNode, TaskStep } from "./types"

export function mapAssignTo (response: any) {
  return {
    name: response?.name || '',
    department: response?.department || '',
    assignmentType: response?.assignmentType || ''
  }
}

export function mapSubprocess (response: any): Subprocess {
  return {
    name: response?.name || ''
  }
}

export function mapTaskIds (response: any): TaskStep {
  return {
    taskId: response?.taskId ? response.taskId : '',
    stepIndex: response?.stepIndex ? response.stepIndex : 0,
    paths: response?.paths ? response.paths.map(path => { return path }) : []
  }
}

export function mapTaskNode (response: any): TaskNode {
  return {
    id: response?.id || 0,
    nodeDefId: response?.nodeDefId || '',
    state: response?.state || '',
    started: response?.started || '',
    completed: response?.completed || '',
    name: response?.name || '',
    description: response?.description || '',
    notStarted: response?.notStarted || false,
    inputs: response?.inputs ? response.inputs.map(mapQuestionnaireId) : [],
    outputForm: response?.outputForm || '',
    outputFormTitle: response?.outputFormTitle || '',
    outputFormType: response?.outputFormType || '',
    inputFormNames: response?.inputFormNames ? response.inputFormNames.map(mapQuestionnaireId) : [],
    output: mapQuestionnaireId(response?.output),
    type: response?.type || '',
    taskId: response?.taskId || '',
    daysCompleted: response?.daysCompleted || 0,
    estimateDays: response?.estimateDays || 0,
    assignedTo: response?.assignedTo ? mapTaskAssignment(response.assignedTo) : null,
    subprocessId: response?.subprocessId || '',
    totalSteps: response?.totalSteps || '',
    subprocess: response?.subprocess ? mapSubprocess(response.subprocess) : { name: '' },
    sequenced: response?.sequenced || false,
    estimateCompletionDate: response?.estimateCompletionDate || '',
    subState: response?.subState || '',
  }
}

export function mapProcessSteps (response: Array<any>): Array<ProcessStep> {
  let mappedData: Array<ProcessStep> = []

  if (response) {
    mappedData = response.map((responseItem: any) => {
      return {
        index: responseItem?.index || 0,
        processId: responseItem?.processId || '',
        node: mapTaskNode(responseItem.node),
        steps: responseItem.steps ? mapProcessSteps(responseItem.steps) : [],
        parallel: responseItem.parallel || false,
        numberOfDocuments: responseItem?.numberOfDocuments || 0,
        selectedForms: responseItem?.selectedForms ? responseItem.selectedForms.map(mapQuestionnaireId) : [],
        type: responseItem?.type || '',
        taskIds: responseItem?.taskIds ? responseItem.taskIds.map(mapTaskIds) : [],
        subProcessId: responseItem?.subProcessId || '',
      }
    })
  }

  return mappedData
}

export function mapProcessStepInfo (response: any): ProcessStepInfo {
  return {
    tasks: response?.tasks ? response?.tasks.map(mapTask) : [],
    steps: response?.steps ? mapProcessSteps(response?.steps) : [],
    daysToComplete: response?.daysToComplete ? response.daysToComplete : 0
  }
}