import { TimeData, TimeUnit } from "../../Form/types"
import { Attachment, GroupId, IDRef, Label, Money, Note, UserId } from "../common"
import { DatesInfo, Engagement, EngagementContact, FormGlobalVal, Info, InfoRequest, MeasureTask, MilestoneInfo, ProcessRequestMeta, ProcessTask, Progress, ProgressNote, ProgressStatus, RoleForms, TaskAssignment, TaskData, YearlyTotal } from "../engagement"
import { QuestionnaireId } from "../questionnaire"
import { NormalizedVendorRef } from "../vendor"
import { mapContact, mapGroupId, mapMoney, mapUserId, mapIDRef, mapNote, mapAttachment, mapLabel } from "./common"
import { mapQuestionnaireId } from "./questionnaire"
import { mapProcessVariables, parseSelection } from "./request"
import { mapTaskAssignment } from "./task"
import { mapEngagementReference, mapNormalizedVendorRef } from "./vendor"

export function mapProcessRequestMeta (processRequestMeta: any): ProcessRequestMeta {
  const processRequestMetaObj = {
    id: processRequestMeta ? processRequestMeta.id : '',
    requestId: processRequestMeta ? processRequestMeta.requestId : '',
    mainProcessId: processRequestMeta ? processRequestMeta.mainProcessId : '',
    type: processRequestMeta ? processRequestMeta.type : '',
    processName: processRequestMeta ? processRequestMeta.processName : '',
    processStarted: processRequestMeta ? processRequestMeta.processStarted: ''
  }

  return processRequestMetaObj
}

export function mapProcessTask (processTask: any): ProcessTask {
  let users: Array<UserId> = []
  let groupIds: Array<GroupId> = []

  if (processTask && processTask.users && processTask.users.length) {
    users = processTask.users.map(mapUserId)
  }

  if (processTask && processTask.groupIds && processTask.groupIds.length) {
    groupIds = processTask.groupIds.map(mapGroupId)
  }

  const processTaskObj: ProcessTask = {
    type: processTask?.type || '',
    title: processTask?.title || '',
    taskId: processTask?.taskId || '',
    functionRole: processTask?.functionRole || '',
    functionGroup: processTask?.functionGroup || '',
    started: processTask?.started || '',
    lateTime: processTask?.lateTime || '',
    users,
    groupIds,
    owner: processTask ? mapUserId(processTask.owner) : mapUserId(null),
    assignedToCurrentUser: processTask?.assignedToCurrentUser || false,
    taskStatus: processTask?.taskStatus || null,
    assignmentType: processTask?.assignmentType || '',
    partnerName: processTask?.partnerName || '',
    workstream: mapIDRef(processTask?.workstream),
    resubmitted: processTask?.resubmitted || false,
    infoMsgId: processTask?.infoMsgId || '',
    lastMsg: processTask?.lastMsg || '',
    lastMsgBy: processTask?.lastMsgBy || '',
    lastMsgTime: processTask?.lastMsgTime || '',
    lastMsgUser: processTask?.lastMsgUser || '',
    msgClosed: processTask?.msgClosed || false,
    suspended: processTask?.suspended || false,
    submissionComment: processTask?.submissionComment || '',
    completed: processTask?.completed || ''
  }

  return processTaskObj
}

export function mapMilestoneInfo (milestoneInfo: any): MilestoneInfo {
  const  milestoneInfoObj: MilestoneInfo = {
    index: milestoneInfo?.index || 0,
    processName: milestoneInfo?.processName || '',
    processDisplayName: milestoneInfo?.processDisplayName || '',
    processType: milestoneInfo?.processType,
    date: milestoneInfo?.date || '',
    endDate: milestoneInfo?.endDate || '',
    totalAisle: milestoneInfo?.totalAisle || 6 // default is 6 for some old data
  }
  return milestoneInfoObj
}

export function mapPregressNote (data: any): ProgressNote {
  return {
    date: data?.date || '',
    past: data?.past || '',
    upcoming: data?.upcoming || '',
    by: mapUserId(data?.by)
  }
}

export function mapProgress (progress: any) : Progress {
  const progressObj: Progress = {
    stepsTotal: progress ? progress.stepsTotal : 0,
    stepsCompleted: progress ? progress.stepsCompleted : 0,
    totalEstimateTime: progress ? progress.totalEstimateTime : 0,
    completedTime: progress ? progress.completedTime : 0,
    completed: progress ? progress.completed : false,
    status: progress ? progress.status : ProgressStatus.notStarted,
    milestoneInfo: progress?.milestoneInfo ? mapMilestoneInfo(progress.milestoneInfo) : null,
    remainingTime: progress ? progress.remainingTime : 0,
    pending: progress ? progress.pending : false,
    tasksStarted: progress?.tasksStarted || false,
    progressNote: progress?.progressNote ? mapPregressNote(progress.progressNote) : null,
    previousNote: progress?.previousNote ? mapPregressNote(progress.previousNote) : null,
    noUpdateDate: progress?.noUpdateDate || '',
    milestoneOverdue: progress?.milestoneOverdue || false,
    needsUpdate: progress?.needsUpdate || false,
    noUpdateLastWeek: progress?.noUpdateLastWeek || false,
    submitByDate: progress?.submitByDate || '',
    daysToApprovalSubmiteDate: progress?.daysToApprovalSubmiteDate || 0,
    milestoneWarning: progress?.milestoneWarning || false
  }

  return progressObj
}

export function mapInfoRequest (infoRequest: any): InfoRequest {
  const infoRequestObj: InfoRequest = {
    created: infoRequest ? infoRequest.created : '',
    requester: infoRequest ? mapUserId(infoRequest.requester) : mapUserId(null),
    intendFor: infoRequest ? mapUserId(infoRequest.intendFor) : mapUserId(null),
    comment: infoRequest ? infoRequest.comment : '',
    taskId: infoRequest ? infoRequest.taskId : '',
    pending: infoRequest ? infoRequest.pending : false
  }

  return infoRequestObj
}

export function mapEngagementContact (data: any): EngagementContact {
  const contact = mapContact(data)
  return {
    ...contact,
    contactId: data?.contactId || '',
    engagementId: data?.engagementId || '',
    note: data?.note || '',
    supplierUserId: data?.supplierUserId || '',
    tenantId: data?.tenantId || '',
    selection: parseSelection(data?.selection)
  }
}

export function removeTagFromFieldName (name: string): string {
  const div = document.createElement('div')
  div.innerHTML = name
  const text = div.textContent || div.innerText || ''
  return text
  }

function mapEngagementAttribute (data: any): FormGlobalVal {
  return {
    displayValue: data?.displayValue || '',
    name: removeTagFromFieldName(data?.name) || '',
    reportName: data?.reportName || ''
  }
}

export function mapEngagementAttributesList (data: any): Array<FormGlobalVal> {
  return Array.isArray(data) ? data.map(mapEngagementAttribute) : []
}

export function mapMeasureTask (data: any): MeasureTask {
  let taskAssignment: TaskAssignment | null = null
  let owner: UserId | null = null
  let users: Array<UserId> = []
  let partners: Array<NormalizedVendorRef> = []
  let forms: Array<QuestionnaireId> = []
  let notes: Array<Note> = []
  let labels: Array<Label> = []
  let relatedMeasures: Array<IDRef> = []
  let workstreams: Array<IDRef> = []
  let attachments: Array<Attachment> = []

  if (data?.taskAssignment) {
    taskAssignment = mapTaskAssignment(data?.taskAssignment)
  }

  if (data?.labels) {
    labels = data?.labels.map(mapLabel)
  }

  if (data?.relatedMeasures) {
    relatedMeasures = data?.relatedMeasures.map(mapIDRef)
  }

  if (data?.workstreams) {
    workstreams = data?.workstreams.map(mapIDRef)
  }

  if (data?.owner) {
    owner = mapUserId(data?.owner)
  }

  if (data?.users && Array.isArray(data?.users)) {
    users = data?.users.map(mapUserId)
  }

  if (data?.partners && Array.isArray(data?.partners)) {
    partners = data?.partners.map(mapNormalizedVendorRef)
  }

  if (data?.forms && Array.isArray(data?.forms)) {
    forms = data?.forms.map(mapQuestionnaireId)
  }

  if (data?.notes && Array.isArray(data?.notes)) {
    notes = data?.notes.map(mapNote)
  }

  if (data?.attachments && Array.isArray(data?.attachments)) {
    attachments = data?.attachments.map(mapAttachment)
  }

  const measureTaskObject: MeasureTask = {
    id: data?.id || '',
    type: data?.type || '',
    processId: data?.processId || '',
    actionId: data?.actionId || '',
    engagementId: data?.engagementId || '',
    engagementName: data?.engagementName || '',
    requestor: '',
    collcectionId: data?.collcectionId || '',
    name: data?.name || '',
    description: data?.description || '',
    descriptionMeta: data?.descriptionMeta || '',
    taskStatus: data?.taskStatus || '',
    owner,
    users,
    partners,
    groups: [],
    startDate: data?.startDate || '',
    dueDate: data?.dueDate || '',
    updated: data?.updated || '',
    completed: data?.completed || '',
    position: data?.position || -1,
    taskAssignment,
    forms,
    attachments,
    notes,
    isRestricted: data?.isRestricted || false,
    priority: data?.priority || null,
    created: data?.created || '',
    actionType: data?.actionType || '',
    relatedMeasure: mapIDRef(data.relatedMeasure),
    labels,
    relatedMeasures,
    workstreams,
    program: mapIDRef(data.program),
    taskName: data?.taskName || '',
    taskId: data?.taskId || '',
    publicNote: data?.publicNote || false,
    messageType: data?.messageType,
    stepName: data?.stepName || '',
    formsReadOnly: data?.formsReadOnly || false,
    isImportant: data?.isImportant || false
  }

  return measureTaskObject
}

export function mapTimeData (data: any): TimeData {
  return {
    index: data?.index || '',
    start: data?.start || '',
    timeUnit: data?.timeUnit || TimeUnit.day,
    approved: data?.approved || false,
    approvalStatus: data?.approvalStatus || '',
    moneyAmount: data?.moneyAmountObject ? mapMoney(data?.moneyAmountObject) : data?.moneyAmount ? mapMoney(data?.moneyAmount) : null,
    numberAmount: data?.numberAmount || 0,
    value: data?.value || ''
  }
 }

export function mapYearlyTotal (data: YearlyTotal): YearlyTotal{
  return {
    year: data?.year || 0,
    total: mapTimeData(data?.total)
  }
}

export function mapEngagement (data: any): Engagement {
  let pendingTasks: Array<ProcessTask> = []
  let infoRequests: Array<InfoRequest> = []
  let contacts: Array<EngagementContact> = []
  let milestones: Array<MilestoneInfo> = []
  let members: Array<UserId> = []
  let coOwners: Array<UserId> = []
  let coOwnersMembers: Array<UserId> = []
  let relatedEnagements: Array<IDRef> = []
  let issues: Array<MeasureTask> = []
  let yearlyActualPlusProjections: Array<YearlyTotal> = []
  let forkedEngagements: Array<IDRef> = []

  if (data && data.issues && data.issues.length) {
    issues = data.issues.map(mapMeasureTask)
  }

  if (data && data.yearlyActualPlusProjections && data.yearlyActualPlusProjections.length) {
    yearlyActualPlusProjections = data.yearlyActualPlusProjections.map(mapYearlyTotal)
  }

  if (data && data.pendingTasks && data.pendingTasks.length) {
    pendingTasks = data.pendingTasks.map(mapProcessTask)
  }

  if (data && data.infoRequests && data.infoRequests.length) {
    infoRequests = data.infoRequests.map(mapInfoRequest)
  }

  if (data && data.contacts && data.contacts.length) {
    contacts = data.contacts.map(mapEngagementContact)
  }

  if (data && data.milestones && data.milestones.length) {
    milestones = data.milestones.map(mapMilestoneInfo)
  }

  if (data && data.members && data.members.length) {
    members = data.members.map(mapUserId)
  }

  if (data && data.coOwners && data.coOwners.length) {
    coOwners = data.coOwners.map(mapUserId)
  }
  if (data && data.coOwnersMembers && data.coOwnersMembers.length) {
    coOwnersMembers = data.coOwnersMembers.map(mapUserId)
  }

  if (data && data.relatedEnagements && data.relatedEnagements.length) {
    relatedEnagements = data.relatedEnagements.map(mapIDRef)
  }

  if (data && data.forkedEngagements && data.forkedEngagements.length) {
    forkedEngagements = data.forkedEngagements.map(mapIDRef)
  }

  const projectAmount: Money = {
    amount: data?.projectAmount?.amount || 0,
    currency: data?.projectAmount?.currency || ''
  }
  const requester: UserId = mapUserId(data?.requester)

  return {
    id: data?.id || '',
    appType: data?.appType || '',
    engagementId: data?.engagementId || '',
    name: data?.name || '',
    completed: data?.completed || '',
    estimatedCompletionDate: data?.estimatedCompletionDate || '',
    estimatedEndDates: data?.estimatedEndDates,
    resubmissionTime: data?.resubmissionTime || '',
    started: data?.started || '',
    updated: data?.updated || '',
    status: data?.status || '',
    processing: data?.processing || false,
    vendorId: data?.vendorId || '',
    projectAmount,
    requester,
    selection: parseSelection(data?.selection),
    currentRequest: data ? mapProcessRequestMeta(data.currentRequest) : mapProcessRequestMeta(null),

    projectAmountMoney: data ? mapMoney(data.projectAmountMoney) : mapMoney(null),
    amountDifferenceMoney: data ? mapMoney(data.amountDifferenceMoney) : mapMoney(null),
    pendingTasks,
    nextTask: data ? mapProcessTask(data.nextTask) : mapProcessTask(null),
    progress: data ? mapProgress(data.progress) : mapProgress(null),
    variables: data ? mapProcessVariables(data.variables) : mapProcessVariables(null),
    infoRequests: infoRequests,

    contacts: contacts,

    currentMilestone: data?.currentMilestone || '',
    milestones,
    coOwners,
    coOwnersMembers,
    segment: mapIDRef(data?.segment),
    members,
    lastStatusUpdate: data?.lastStatusUpdate || '',
    kpiUnit: data?.kpiUnit || '',
    currencyCode: data?.currencyCode || '',
    currencySymbol: data?.currencySymbol || '',
    relatedEnagements,
    watched : data?.watched || false,
    alreadyMember: data?.alreadyMember || false,
    workStream: mapIDRef(data?.workStream),
    description: data?.description || '',
    hasEbit: data?.hasEbit || false,
    disableDefaultEngagementAttributes: data?.disableDefaultEngagementAttributes || false,
    engagementAttributes: data?.engagementAttributes ?  mapEngagementAttributesList(data.engagementAttributes) : null,
    lateMilestones: data?.lateMilestones || 0,
    upcomingMilestones: data?.upcomingMilestones || 0,
    issues,
    parent: data?.parent ? mapEngagementReference(data?.parent) : null,
    hasChildRequests: data?.hasChildRequests || false,
    program: mapIDRef(data?.program),
    enabledRequestResubmit: data?.enabledRequestResubmit || false,
    yearlyActualPlusProjections,
    disableRequestResubmitAfterDeny: data?.disableRequestResubmitAfterDeny || false,
    forkedEngagements,
    forkedFromEngagement: mapIDRef(data?.forkedFromEngagement)
  }
}

export function mapRoleForms (roleForms: any): RoleForms {
  let questionnaireIds: Array<QuestionnaireId> = []

  if (roleForms?.questionnaireIds && roleForms.questionnaireIds.length) {
    questionnaireIds = roleForms.questionnaireIds.map(mapQuestionnaireId)
  }

  return {
    role: roleForms?.role,
    questionnaireIds,
    token: roleForms?.token
  }
}

export function mapInfos (data: any): Info {
  const info: Info = {
    comment: data?.comment ? data?.comment : '',
    date: data?.date ? data.date : '',
    taskAssignment: data?.taskAssignment ? mapTaskAssignment(data.taskAssignment) : null,
    type: data?.type ? data.type : '',
    typeLabel: data?.typeLabel ? data.typeLabel : ''
  }

  return info
}

export function mapDatesInfo (data: any): DatesInfo {
  const datesInfo: DatesInfo = {
    infos: data ? data.infos.map(mapInfos) : [],
    totalPendingHours: data ? data.totalPendingHours : 0
  }

  return datesInfo
}

export function mapTaskData (task: any): TaskData {
  let inputForms: Array<QuestionnaireId> = []
  if (task && task.inputForms && task.inputForms.length) {
    inputForms = task.inputForms.map(questionnaireId => mapQuestionnaireId(questionnaireId))
  }

  let classfiedInputforms: Array<RoleForms> = []
  if (task && task.classfiedInputforms && task.classfiedInputforms.length) {
    classfiedInputforms = task.classfiedInputforms.map(mapRoleForms)
  }

  const taskObj: TaskData = {
    id: task ? task.id : '',
    started: task ? task.started : '',
    completed: task ? task.completed : '',
    handlingStarted: task ? task.handlingStarted : '',
    minutes: task ? task.minutes : 0,
    name: task ? task.name : '',
    inputForms,
    classfiedInputforms,
    outputFormId: task?.outputFormId ? mapQuestionnaireId(task.outputFormId) : null,
    questionnaireId: task ? task.questionnaireId : 0,
    type: task ? task.type : null,
    taskStatus: task ? task.taskStatus : null,
    suspended: task ? task.suspended : false,
    ownerId: task ? task.ownerId : '',
    engagementId: task ? task.engagementId : '',
    assignedToCurrentUser: task ? task.assignedToCurrentUser : false,
    editableInputs: task ? task.editableInputs : false,
    assignmentType: task ? task.assignmentType : '',
    users: task?.users ? task.users.map(mapUserId) : [],
    datesInfo: task ? mapDatesInfo(task.datesInfo) : null,
    partnerName: task ? task.partnerName : '',
    processId: task ? task.processId : '',
    groups: task?.groups ? task.groups.map(mapGroupId) : [],
  }

  return taskObj
}
