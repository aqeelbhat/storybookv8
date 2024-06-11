import { Attachment, Contact, GroupId, Label, Money, Note, UserId } from "./common";
import { QuestionnaireId } from "./questionnaire";
import { ProcessVariables, Selection } from "./request";
import { IDRef } from './common'
import { EngagementReference, NormalizedVendorRef } from "./vendor";
import { TimeData } from "../Form/types";
import { getI18Text } from '../i18n';


/* eslint-disable */
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
  stuck = 'stuck',
  late = 'late',
  onhold = 'onhold'
}

/* eslint-disable */
export enum TaskAssignmentType {
  partner = 'partner',
  user = 'user',
  group = 'group'
}

/* eslint-disable */
export enum StandardTaskType {
  questionnaire = 'questionnaire',
  approval = 'approval',
  review = 'review',
  legalDocument = 'legalDocument',
  manual = 'manual',
  documentCollection = 'documentCollection',
  api = 'api',
  taskCollection = 'taskCollection'
}

/* eslint-disable */
export enum EngagementStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Invalid = 'Invalid',
  Failed = 'Failed'
}

export enum MeasureTaskStatusEnum {
  notStarted = 'notStarted',
  stuck = 'stuck',
  pending = 'pending',
  late = 'late',
  done = 'done',
  cancelled = 'cancelled',
  onhold = 'onhold'
}

export const MEASURETASK_DISPLAY_NAMES: { [status: string]: string } = {
  [MeasureTaskStatusEnum.notStarted]: 'Not started',
  [MeasureTaskStatusEnum.stuck]: 'Off Target ( Support Needed )',
  [MeasureTaskStatusEnum.pending]: 'On Target',
  [MeasureTaskStatusEnum.late]: 'Off Target ( Not Critical )',
  [MeasureTaskStatusEnum.done]: 'Completed',
  [MeasureTaskStatusEnum.cancelled]: 'Closed',
}

let ACTIONS_DISPLAY_NAMES : Record<string,string> | null = null
export function getActionDisplayNames (type:string ){
   if(!ACTIONS_DISPLAY_NAMES){
    ACTIONS_DISPLAY_NAMES= {
      [MeasureTaskStatusEnum.pending]: getI18Text('--actionDisplayNames--.--onGoing--'),
      [MeasureTaskStatusEnum.late]: getI18Text('--actionDisplayNames--.--late--'),
      [MeasureTaskStatusEnum.done]: getI18Text('--actionDisplayNames--.--completed--'),
      [MeasureTaskStatusEnum.cancelled]: getI18Text('--actionDisplayNames--.--cancelled--'),
      [MeasureTaskStatusEnum.onhold]: getI18Text('--actionDisplayNames--.--onHold--'),
      [MeasureTaskStatusEnum.notStarted]: getI18Text('--actionDisplayNames--.--notStarted--'),
    }
  }
  
  return ACTIONS_DISPLAY_NAMES[type] || ''

}

export interface ProcessRequestMeta {
  id: string
  requestId: string
  mainProcessId: string
  type: string
  processName: string
  processStarted: string
}

export interface EngagementContact extends Contact {
  tenantId: string
  engagementId: string
  contactId: string
  supplierUserId: string
  selection: Selection
  note: string
}

export interface ProcessTask {
  type: string
  title: string
  taskId: string
  functionRole: string
  functionGroup: string
  started: string
  lateTime: string
  users: Array<UserId>
  groupIds: Array<GroupId>
  owner: UserId
  assignedToCurrentUser: boolean
  taskStatus: TaskStatus | null
  assignmentType: string
  partnerName: string
  workstream?: IDRef
  resubmitted?: boolean
  msgClosed?: boolean
  infoMsgId?: string
  lastMsgTime?: string
  lastMsg?: string
  lastMsgBy?: string
  lastMsgUser?: string
  suspended?: boolean
  submissionComment?: string
  completed?: string
}

export enum ProgressStatus {
  ok = "ok",
  late = "late",
  stuck = "stuck",
  stopped = "stopped",
  notStarted = "notStarted",
  onhold = "onhold",
  pending = 'pending',
  draft = 'draft',
  closed = 'closed',
  completed = 'completed',
  deleted = 'deleted',
  cancelled = 'cancelled'
}

export enum ProcessType {
  onboarding = 'onboarding',
  legal = 'legal',
  risk = 'risk',
  marketingProject = 'marketingProject',
  marketingProjectAmendment = 'marketingProjectAmendment',
  softwareDataPurchase = 'softwareDataPurchase',
  softwareDataPurchaseAmendment = 'softwareDataPurchaseAmendment',
  finacialCheck = 'finacialCheck',
  development = 'development',
  milestone = 'milestone',
  milestoneEntry = 'milestoneEntry',
  supplierUpdate = 'supplierUpdate',
  procurementIntake = 'procurementIntake',
  instruction = 'instruction',
  supplierProfile = 'supplierProfile',
  invoiceIntake = 'invoiceIntake',
  serviceRequest = 'serviceRequest',
  emailIntake = 'emailIntake',
}

export interface MilestoneInfo {
  index: number
  processName: string
  processDisplayName: string
  processType: ProcessType
  date: string
  endDate: string
  totalAisle: number
}

export interface ProgressNote {
  date: string
  past: string
  upcoming: string
  by: UserId
}

export interface Progress {
  stepsTotal: number
  stepsCompleted: number

  // Unit for below fields is in days
  totalEstimateTime: number
  completedTime: number
  remainingTime: number
  milestoneInfo: MilestoneInfo
  status: ProgressStatus
  completed: boolean
  pending: boolean
  tasksStarted: boolean
  previousNote: ProgressNote | null
  progressNote: ProgressNote | null
  noUpdateDate: string
  noUpdateLastWeek: boolean
  needsUpdate: boolean
  milestoneOverdue: boolean
  submitByDate: string
  daysToApprovalSubmiteDate: number
  milestoneWarning: boolean
}

export interface InfoRequest {
  created: string
  requester: UserId
  intendFor: UserId
  comment: string
  taskId: string
  pending: boolean
}

export interface FormGlobalVal {
  name: string
  reportName: string
  displayValue: string
}

export enum MessageType {
  approval = 'approval',
  review = 'review',
  todo = 'todo',
  moreInfo = 'moreInfo',
  moreInfoResponse = 'moreInfoResponse',
  editRequest = 'editRequest',
  cancelRequest = 'cancelRequest',
  deny = 'deny',
  redo = 'redo',
  reassign = 'reassign',
  shareForms = 'shareForms',
  deleteRequest = 'deleteRequest',
  updateCompletionDate = 'updateCompletionDate',
  collaboration = 'collaboration',
  skipped = 'skipped',
  requestMoreInfo = 'requestmoreInfo',
}

export interface MeasureTask {
  id: string
  type: string | null
  processId: string
  actionId: string
  engagementId: string
  engagementName: string
  requestor: string | null
  collcectionId: string
  name: string
  description: string
  descriptionMeta?: string
  taskStatus: string
  owner: UserId | null
  users: Array<UserId>
  partners: Array<NormalizedVendorRef>
  groups: Array<GroupId>
  startDate: string | null
  dueDate: string | null
  updated: string | null
  completed: string | null
  position: number
  taskAssignment: TaskAssignment | null
  forms: Array<QuestionnaireId>
  attachments: Array<Attachment>
  notes: Array<Note>
  isRestricted: boolean
  priority: string | null
  created: string
  actionType: string
  relatedMeasure: IDRef | null
  relatedMeasures: Array<IDRef>
  workstreams: Array<IDRef>
  labels: Array<Label>
  program: IDRef | null
  taskName: string,
  taskId: string
  publicNote?: boolean
  messageType?: MessageType
  stepName?: string
  formsReadOnly?: boolean
  isImportant?: boolean
}

export interface YearlyTotal {
  year: number
  total: TimeData
}

export interface Engagement {
  id: string
  appType: string
  engagementId: string
  started: string
  updated: string
  completed: string
  estimatedCompletionDate: string
  resubmissionTime?: string
  estimatedEndDates?: {
    startDate
    endDate
  }
  processing: boolean
  lastStatusUpdate: string
  name: string
  status: string
  vendorId: string
  requester: UserId
  selection: Selection
  projectAmount: Money
  currentRequest: ProcessRequestMeta

  currentMilestone: string
  milestones: Array<MilestoneInfo>
  members: Array<UserId>
  coOwners: Array<UserId>
  coOwnersMembers: Array<UserId>
  segment: IDRef

  projectAmountMoney: Money
  amountDifferenceMoney: Money
  pendingTasks: Array<ProcessTask>
  nextTask: ProcessTask
  progress: Progress
  variables: ProcessVariables
  infoRequests: Array<InfoRequest>
  program?: IDRef
  contacts: Array<EngagementContact>

  kpiUnit: string
  currencyCode: string
  currencySymbol: string
  relatedEnagements: Array<IDRef>
  watched : boolean
  alreadyMember: boolean
  workStream: IDRef
  description: string
  hasEbit: boolean
  disableDefaultEngagementAttributes?: boolean
  engagementAttributes?: Array<FormGlobalVal>
  lateMilestones?: number
  upcomingMilestones?: number
  issues?: Array<MeasureTask>
  parent?: EngagementReference | null
  hasChildRequests?: boolean
  enabledRequestResubmit?: boolean
  yearlyActualPlusProjections?: Array<YearlyTotal>
  disableRequestResubmitAfterDeny?: boolean
  forkedEngagements?: Array<IDRef>
  forkedFromEngagement?: IDRef
}

export interface RoleForms {
  role: string
  questionnaireIds: Array<QuestionnaireId>
  token: string
}

export interface TaskAssignment {
  name: string
  department: string
  allUsers: Array<UserId>
  groups: Array<GroupId>
  assigned: boolean
  workstream?: IDRef | null
  assignmentType?: string
}

export interface Info {
  comment: string
    date: string
    taskAssignment: TaskAssignment | null,
    type: string
    typeLabel: string
}

export interface DatesInfo {
  infos: Info[]
  totalPendingHours: number
}

export interface TaskData {
  id: string
  type: StandardTaskType | null
  editableInputs: boolean
  started: string
  completed: string
  handlingStarted: string
  minutes: number
  name: string
  inputForms: QuestionnaireId[]
  classfiedInputforms: RoleForms[]
  outputFormId: QuestionnaireId | null
  questionnaireId: number
  taskStatus: TaskStatus | null
  suspended: boolean
  ownerId: string
  engagementId: string
  assignedToCurrentUser: boolean
  assignmentType: string
  users: UserId[]
  datesInfo: DatesInfo | null
  partnerName: string
  processId: string
  groups: Array<GroupId>
}

export enum MeasureProcessName {
  ebit = 'EBIT',
  enabler = 'Enabler'
}
export interface RequestFieldLocaleConfig {
  requestName?: string
  id?: string
  shortDescription?: string
  helpText?: string
  languageCode?: string
  stepTitles?: { [step: string]: string }
  engagementAttributes?: { [step: string]: string }
}
