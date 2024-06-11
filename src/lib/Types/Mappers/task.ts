import { RoleForms, TaskAssignment } from "../engagement"
import { QuestionnaireId } from "../questionnaire"
import { Task } from "../task"
import { mapGroupId, mapIDRef, mapUserId } from "./common"
import { mapDatesInfo, mapRoleForms } from "./engagement"
import { mapQuestionnaireId } from "./questionnaire"

export function mapTaskAssignment (response: any): TaskAssignment {
  return {
    name: response?.name || '',
    department: response?.department || '',
    allUsers: response?.allUsers ? response.allUsers.map(mapUserId) : [],
    groups: response?.groups ? response.groups.map(mapGroupId) : [],
    assigned: response?.assigned || false,
    workstream: response.workstream ? mapIDRef(response.workstream) : null,
    assignmentType: response?.assignmentType || ''
  }
}

export function mapTask (task: any): Task {
    let inputForms: Array<QuestionnaireId> = []
    if (task && task.inputForms && task.inputForms.length) {
      inputForms = task.inputForms.map((questionnaireId: any) => mapQuestionnaireId(questionnaireId))
    }
  
    let classfiedInputforms: Array<RoleForms> = []
    if (task && task.classfiedInputforms && task.classfiedInputforms.length) {
      classfiedInputforms = task.classfiedInputforms.map(mapRoleForms)
    }
  
    const taskObj: Task = {
      id: task ? task.id : '',
      nodeDefId: task ? task.nodeDefId : '',
      started: task ? task.started : '',
      completed: task ? task.completed : '',
      handlingStarted: task ? task.handlingStarted : '',
      minutes: task ? task.minutes : 0,
      name: task ? task.name : '',
      inputForms,
      classfiedInputforms,
      processName: task?.processName || '',
      editableInputForms: task?.editableInputForms || [],
      outputFormId: task?.outputFormId ? mapQuestionnaireId(task.outputFormId) : null,
      questionnaireId: task ? task.questionnaireId : 0,
      type: task ? task.type : null,
      taskStatus: task ? task.taskStatus : null,
      suspended: task ? task.suspended : false,
      ownerId: task ? task.ownerId : '',
      ownerName: task?.ownerName || '',
      engagementId: task ? task.engagementId : '',
      assignedToCurrentUser: task ? task.assignedToCurrentUser : false,
      editableInputs: task ? task.editableInputs : false,
      assignmentType: task ? task.assignmentType : '',
      users: task?.users ? task.users.map(mapUserId) : [],
      datesInfo: task ? mapDatesInfo(task.datesInfo) : null,
      partnerName: task ? task.partnerName : '',
      processId: task ? task.processId : '',
      actionTitle: task?.actionTitle || '',
      infoMsgId: task?.infoMsgId || '',
      lastMsg: task?.lastMsg || '',
      lastMsgBy: task?.lastMsgBy || '',
      lastMsgTime: task?.lastMsgTime || '',
      lastMsgUser: task?.lastMsgUser || '',
      msgClosed: task?.msgClosed || false,
      resubmitted: task?.resubmitted || false,
      milestoneDatesRequired: task?.milestoneDatesRequired || false,
      ebitPlanRequired: task?.ebitPlanRequired || false,
      assignedTo: task?.assignedTo ? mapTaskAssignment(task?.assignedTo) : null,
      lateDate: task?.lateDate || '',
      convertToMeasure: task?.convertToMeasure || false,
      nodeId: task?.nodeId || '',
      allowDeny: task?.allowDeny || false,
    }
  
    return taskObj
}