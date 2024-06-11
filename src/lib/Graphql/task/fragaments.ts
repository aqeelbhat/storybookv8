import { gql } from '@apollo/client'
import { ATTACHMENT_SOURCE_FIELDS, CONTACT_SOURCE_FIELDS, GROUP_ID_SOURCE_FIELDS, ID_REF_SOURCE_FIELDS, NORMALIZED_VENDOR_REF_SOURCE_FIELDS, USER_ID_SOURCE_FIELDS } from '../common/fragments'
import { ENGAGEMENTS_SOURCE_FIELDS } from '../engagements/fragament'

export const QUESTIONNAIREID_SOURCE_FIELDS = gql`
  fragment QuestionnaireIdSourceFields on QuestionnaireId {
    id
    name
    formId
    formDocumentId
    custom
    editMode
    completed
    formType
  }
`

export const TASK_ASSIGNMENT_SOURCE_FIELD = gql`
  fragment TaskAssignmentSourceField on TaskAssignment {
    name
      department
      assignmentType
      allUsers {
          ...UserIdSourceFields
      }
      groups {
        ...GroupIdSourceFields
      }
      workstream {
          ...IDRefSourceFields
      }
      assigned
  }
  ${USER_ID_SOURCE_FIELDS}
  ${ID_REF_SOURCE_FIELDS}
  ${GROUP_ID_SOURCE_FIELDS}
`

export const TASK_DATES_INFOS_SOURCE_FIELD = gql`
  fragment TaskDatesInfoSourceField on DateInfo {
    date
    taskAssignment {
      ...TaskAssignmentSourceField
    }
    type
    comment
    typeLabel
  }
  ${TASK_ASSIGNMENT_SOURCE_FIELD}
`

export const TASK_DATES_SOURCE_FIELD = gql`
  fragment TaskDatesSourceField on TaskDates {
    totalPendingHours
    infos {
      ...TaskDatesInfoSourceField
    }
  }
  ${TASK_DATES_INFOS_SOURCE_FIELD}
`

export const ROLE_FORMS_SOURCE_FIELDS = gql`
  fragment RoleFormsSourceFields on RoleForms {
    role
    questionnaireIds {
      ...QuestionnaireIdSourceFields
    }
    token
  }
  ${QUESTIONNAIREID_SOURCE_FIELDS}
`

export const TASK_SOURCE_FIELDS = gql`
  fragment TaskSourceFields on Task {
    id
    nodeDefId
    started
    completed
    handlingStarted
    minutes
    name
    processName
    inputForms {
      ...QuestionnaireIdSourceFields
    }
    outputFormId {
      ...QuestionnaireIdSourceFields
    }
    editableInputForms
    type
    taskStatus
    suspended
    milestoneDatesRequired
    ebitPlanRequired
    ownerId
    engagementId
    assignedToCurrentUser
    editableInputs
    assignedTo {
      ...TaskAssignmentSourceField
    }
    datesInfo {
      ...TaskDatesSourceField
    }
    assignmentType
    classfiedInputforms {
      ...RoleFormsSourceFields
    }
    users {
      ...UserIdSourceFields
    }
    assignmentType
    partnerName
    processId
    actionTitle
    resubmitted
    msgClosed
    infoMsgId
    lastMsgTime
    lastMsg
    lastMsgBy
    lastMsgUser
    lateDate
    estimateStart
    estimateCompletionDate
    ownerName
    convertToMeasure
    nodeId
    allowDeny
  }
  ${QUESTIONNAIREID_SOURCE_FIELDS}
  ${TASK_DATES_SOURCE_FIELD}
  ${ROLE_FORMS_SOURCE_FIELDS}
  ${USER_ID_SOURCE_FIELDS}
  ${ID_REF_SOURCE_FIELDS}
  ${GROUP_ID_SOURCE_FIELDS}
  ${TASK_ASSIGNMENT_SOURCE_FIELD}
`

export const TASK_CHECKLIST_VALUE_SOURCE_FIELDS = gql`
  fragment TaskCheckListValueSourceFields on TaskCheckListValue {
    id
    status
    name
    notes
  }
`

export const TASK_CHECKLIST_SECTION_SOURCE_FIELDS = gql`
  fragment TaskCheckListSectionSourceFields on TaskCheckListSection {
    id
    name
    items {
      ...TaskCheckListValueSourceFields
    }
  }
  ${TASK_CHECKLIST_VALUE_SOURCE_FIELDS}
`

export const TASK_CHECKLIST_SOURCE_FIELDS = gql`
  fragment TaskCheckListSourceFields on TaskCheckList {
    sections {
      ...TaskCheckListSectionSourceFields
    }
  }
  ${TASK_CHECKLIST_SECTION_SOURCE_FIELDS}
`

export const MEASURE_TASK_NOTE_SOURCE_FIELDS = gql`
  fragment MeasureTaskNoteSourceField on Note {
    id
    owner {
      ...UserIdSourceFields
    }
    taskStatus
    comment
    documents {
      ...IDRefSourceFields
    }
    created
    updated
    commentMeta
    users {
      ...UserIdSourceFields
    }
  }
  ${USER_ID_SOURCE_FIELDS}
  ${ID_REF_SOURCE_FIELDS}
`
export const MEASURE_TASK_SOURCE_FIELDS = gql`
  fragment MeasureTaskSourceFields on MeasureTask {
    id
    processId
    engagementId
    collectionId
    actionId
    name
    description
    descriptionMeta
    taskStatus
    owner {
      ...UserIdSourceFields
    }
    users {
      ...UserIdSourceFields
    }
    partners {
      ...NormalizedVendorRefSourceFields
    }
    groups {
      ...GroupIdSourceFields
    }
    startDate
    dueDate
    updated
    created
    completed
    position
    taskAssignment {
      ...TaskAssignmentSourceField
    }
    attachments {
      ...AttachmentSourceFields
    }
    notes {
      ...MeasureTaskNoteSourceField
    }
    priority
    type
    actionType
    isRestricted
    forms {
      ...QuestionnaireIdSourceFields
    }
    relatedMeasure {
      ...IDRefSourceFields
    }
    relatedMeasures {
      ...IDRefSourceFields
    }
    externalUsers {
      ...ContactSourceFields
    }
    workstreams {
      ...IDRefSourceFields
    }
    labels {
      id
      text
    }
    program {
      ...IDRefSourceFields
    }
    taskName
    taskId
    publicNote
    messageType
    stepName
    formsReadOnly
    isImportant
  }
  ${USER_ID_SOURCE_FIELDS}
  ${GROUP_ID_SOURCE_FIELDS}
  ${TASK_ASSIGNMENT_SOURCE_FIELD}
  ${MEASURE_TASK_NOTE_SOURCE_FIELDS}
  ${ID_REF_SOURCE_FIELDS}
  ${QUESTIONNAIREID_SOURCE_FIELDS}
  ${CONTACT_SOURCE_FIELDS}
  ${NORMALIZED_VENDOR_REF_SOURCE_FIELDS}
  ${ATTACHMENT_SOURCE_FIELDS}
`

export const ENGAGEMENT_TASK_FIELDS = gql`
  fragment EngagementTaskFields on EngagementTask {
    id
    name
    assignment {
      ...TaskAssignmentSourceField
    }
    started
    engagement {
      ...EngagementsSourceFields
    },
    status
    due
    estimateCompletionDate
    estimateStartDate
    oriEstimateStartDate
    type
    notes {
      ...MeasureTaskNoteSourceField
    }
    workstream {
      ...IDRefSourceFields
    }
    taskType
    assignedToCurrentUser
    issues {
      ...MeasureTaskSourceFields
    }
    nodeId
    nodeDefId
    processName
  }
  ${TASK_ASSIGNMENT_SOURCE_FIELD}
  ${ENGAGEMENTS_SOURCE_FIELDS}
  ${MEASURE_TASK_NOTE_SOURCE_FIELDS}
  ${ID_REF_SOURCE_FIELDS}
  ${MEASURE_TASK_SOURCE_FIELDS}
`
