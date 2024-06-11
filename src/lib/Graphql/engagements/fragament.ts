import { gql } from '@apollo/client'
import { GROUP_ID_SOURCE_FIELDS, ID_REF_SOURCE_FIELDS, PO_REF_SOURCE_FIELDS, MONEY_SOURCE_FIELDS, NORMALIZED_VENDOR_REF_SOURCE_FIELDS, USER_ID_SOURCE_FIELDS, CONTACT_SOURCE_FIELDS, FORM_GLOBAL_VALUE } from './../common/fragments'

export const PROCESS_REQUEST_META_SOURCE_FIELDS = gql`
  fragment ProcessRequestMetaSourceFields on ProcessRequestMeta {
    id
    requestId
    mainProcessId
    type
    processName
    processStarted
  }
`
export const PROCESS_TASK_SOURCE_FIELDS = gql`
  fragment ProcessTaskSourceFields on ProcessTask {
    type
    title
    taskId
    functionRole
    functionGroup
    started
    lateTime
    users {
      ...UserIdSourceFields
    }
    groupIds {
      ...GroupIdSourceFields
    }
    owner {
      ...UserIdSourceFields
    }
    assignedToCurrentUser
    taskStatus
    assignmentType
    partnerName
    workstream {
      ...IDRefSourceFields
    }
    resubmitted
    msgClosed
    infoMsgId
    lastMsgTime
    lastMsg
    lastMsgBy
    lastMsgUser
    suspended
    submissionComment
    completed
  }
  ${ID_REF_SOURCE_FIELDS}
  ${USER_ID_SOURCE_FIELDS}
  ${GROUP_ID_SOURCE_FIELDS}
`

export const MILESTONEINFO_SOURCE_FIELDS = gql`
  fragment MilestoneInfoSourceFields on MilestoneInfo {
    index
    processName
    processDisplayName
    date
    totalAisle
    endDate
  }
`

export const PROGRESS_SOURCE_FIELDS = gql`
  fragment ProgressSourceFields on Progress {
    stepsTotal
    stepsCompleted
    totalEstimateTime
    completedTime
    tasksStarted
    status
    remainingTime
    milestoneInfo {
      ...MilestoneInfoSourceFields
    }
    completed
    pending
    previousNote {
      date
      past
      upcoming
      by {
        ...UserIdSourceFields
      }
    }
    progressNote {
      date
      past
      upcoming
      by {
        ...UserIdSourceFields
      }
    }
    noUpdateDate
    milestoneOverdue
    submitByDate
    milestoneWarning
    daysToApprovalSubmiteDate
    needsUpdate
    noUpdateLastWeek
  }
  ${MILESTONEINFO_SOURCE_FIELDS}
  ${USER_ID_SOURCE_FIELDS}
`

export const RISK_SCORE_SCOURCE_FIELDS = gql`
  fragment RiskScoreSourceFields on RiskScore {
    score
    level
  }
`

export const ENCRYPTED_DATA_SCOURCE_FIELDS = gql`
  fragment EncryptedDataSourceFields on EncryptedData {
    maskedValue
  }
`

export const CALLBACK_OUTCOME_SCOURCE_FIELDS = gql`
  fragment CallbackOutcomeSourceFields on CallbackOutcome {
    index
    accountNumber {
      ...EncryptedDataSourceFields
    }
    code
    codeRef {
      ...IDRefSourceFields
    }
  }
  ${ID_REF_SOURCE_FIELDS}
  ${ENCRYPTED_DATA_SCOURCE_FIELDS}
`

export const TAX_ITEM_SOURCE_FIELDS = gql`
  fragment TaxItemSourceFields on TaxItem {
    taxCode {
      ...IDRefSourceFields
    }
    percentage
    taxableAmountObject {
      ...MoneySourceFields
    }
    amountObject {
      ...MoneySourceFields
    }
  }
  ${ID_REF_SOURCE_FIELDS}
  ${MONEY_SOURCE_FIELDS}
`

export const TAX_SOURCE_FIELDS = gql`
  fragment TaxSourceFields on Tax {
    amountObject {
      ...MoneySourceFields
    }
    items {
      ...TaxItemSourceFields
    }
  }
  ${MONEY_SOURCE_FIELDS}
  ${TAX_ITEM_SOURCE_FIELDS}
`

export const ACCUMULATOR_SOURCE_FIELDS = gql`
  fragment AccumulatorSourceFields on Accumulator {
    quantityReceived
    quantityBilled
  }
`

export const ITEM_DETAILS_SCOURCE_FIELDS = gql`
  fragment ItemDetailsSourceFields on Item {
    name
    description
    categories {
        ...IDRefSourceFields
    }
    departments {
      ...IDRefSourceFields
    }
    type
    materialId
    quantity
    unitForQuantity {
        ...IDRefSourceFields
    }
    lineNumber
    priceMoney {
        ...MoneySourceFields
    }
    supplierPartId
    manufacturerPartId
    accountCodeIdRef {
        ...IDRefSourceFields
    }
    url
    erpItemId {
      ...IDRefSourceFields
    }
    startDate
    endDate
    tax {
       ...TaxSourceFields
    }
    accumulator {
      ...AccumulatorSourceFields
    }
    itemIds {
      ...IDRefSourceFields
    }
    lineOfBusiness {
      ...IDRefSourceFields
    }
    trackCode {
      ...IDRefSourceFields
    }
    location {
      ...IDRefSourceFields
    }
    projectCode {
      ...IDRefSourceFields
    }
    expenseCategory {
      ...IDRefSourceFields
    }
    dataJson
    totalPriceMoney {
      ...MoneySourceFields
    }
  }
  ${ID_REF_SOURCE_FIELDS}
  ${MONEY_SOURCE_FIELDS}
  ${TAX_SOURCE_FIELDS}
  ${ACCUMULATOR_SOURCE_FIELDS}
`

export const ITEM_LIST_SCOURCE_FIELDS = gql`
  fragment ItemListSourceFields on ItemList {
    items {
      ...ItemDetailsSourceFields
    }
  }
  ${ITEM_DETAILS_SCOURCE_FIELDS}
`

export const CHANGE_PO_SCOURCE_FIELDS = gql`
  fragment ChangePOSourceFields on ChangePO {
    method
    startDate
    endDate
    reason
    originalAmountMoney {
      ...MoneySourceFields
    }
    originalLineSubtotalMoney {
      ...MoneySourceFields
    }
    additionalAmountMoney {
      ...MoneySourceFields
    }
    originalItems {
      ...ItemListSourceFields
    }
  }
  ${MONEY_SOURCE_FIELDS}
  ${ITEM_LIST_SCOURCE_FIELDS}
`

export const ASSESSMENT_RISK_FIELDS = gql`
  fragment AssessmentRiskFields on AssessmentRisk {
    riskType {
      ...IDRefSourceFields
    }
    riskScore {
      ...RiskScoreSourceFields
    }
  }
  ${ID_REF_SOURCE_FIELDS}
  ${RISK_SCORE_SCOURCE_FIELDS}
`

export const ASSESSMENT_SCOPE_SOURCE_FIELDS = gql`
  fragment AssessmentScopeSourceFields on AssessmentScope {
    assessment
    assessmentId
    assessmentNumber
    assessmentType {
      ...IDRefSourceFields
    }
    expiration
    completed
    risk {
      ...AssessmentRiskFields
    }
    assessmentAttributes {
      ...FormGlobalValue
    }
    resultAttributes {
      ...FormGlobalValue
    }
    status
  }
  ${ID_REF_SOURCE_FIELDS}
  ${ASSESSMENT_RISK_FIELDS}
  ${FORM_GLOBAL_VALUE}

`

export const PROCESS_VARIABLES_SOURCE_FIELDS = gql`
  fragment ProcessVariablesSourceFields on ProcessVariables {
    categories {
      ...IDRefSourceFields
    }
    regions {
      ...IDRefSourceFields
    }
    businessRegions {
      ...IDRefSourceFields
    }
    businessUnits {
      ...IDRefSourceFields
    }
    departments {
      ...IDRefSourceFields
    }
    companyEntities {
      ...IDRefSourceFields
    }
    sites {
      ...IDRefSourceFields
    }
    impact {
      ...IDRefSourceFields
    }
    vendorClassification {
      ...IDRefSourceFields
    }
    segment {
      ...IDRefSourceFields
    }
    segments {
      ...IDRefSourceFields
    }
    projectTypes {
      ...IDRefSourceFields
    }
    partners {
      ...NormalizedVendorRefSourceFields
    }
    projectAmountMoney {
      ...MoneySourceFields
    }
    budgetAmountMoney {
      ...MoneySourceFields
    }
    activityName
    activityId
    activitySystem
    summary
    requestId
    partnerSelected
    po {
      ...PRRefSourceFields
    }
    callbackOutcomes {
      ...CallbackOutcomeSourceFields
    }
    overallScore {
      ...RiskScoreSourceFields
    }
    priority
    priorityRank {
      ...IDRefSourceFields
    }
    contracts {
      ...IDRefSourceFields
    }
    changePO {
      ...ChangePOSourceFields
    }
    assesssmentScopes {
      ...AssessmentScopeSourceFields
    }
    financialImpactTypes {
      ...IDRefSourceFields
    }
    releaseVersion
  }
  ${ID_REF_SOURCE_FIELDS}
  ${NORMALIZED_VENDOR_REF_SOURCE_FIELDS}
  ${MONEY_SOURCE_FIELDS}
  ${PO_REF_SOURCE_FIELDS}
  ${RISK_SCORE_SCOURCE_FIELDS}
  ${CALLBACK_OUTCOME_SCOURCE_FIELDS}
  ${CHANGE_PO_SCOURCE_FIELDS}
  ${ASSESSMENT_SCOPE_SOURCE_FIELDS}
`

export const INFO_REQUEST_SOURCE_FIELDS = gql`
  fragment InfoRequestSourceFields on InfoRequest {
    created
    requester {
      ...UserIdSourceFields
    }
    intendFor {
      ...UserIdSourceFields
    }
    comment
    taskId
    pending
  }
`

export const TIMEDATA_SOURCE_FIELDS = gql`
  fragment TimeDataSourceFields on TimeData {
    index
    start
    timeUnit
    approved
    approvalStatus
    moneyAmountObject {
      ...MoneySourceFields
    }
    numberAmount
    value
  }
  ${MONEY_SOURCE_FIELDS}
`

export const YEARLY_TOTAL_SOURCE_FIELDS = gql`
  fragment YearlyTotalSourceFields on YearlyTotal {
    year
    total {
      ...TimeDataSourceFields
    }
  }
  ${TIMEDATA_SOURCE_FIELDS}
`

export const ENGAGEMENTS_SOURCE_FIELDS = gql`
  fragment EngagementsSourceFields on Engagement {
    id
    engagementId
    appType
    name
    disableDefaultEngagementAttributes
    status
    lastStatusUpdate
    program {
      ...IDRefSourceFields
    }
    requester {
      ...UserIdSourceFields
    }
    started
    updated
    completed
    estimatedCompletionDate
    resubmissionTime
    estimatedEndDates {
      startDate
      endDate
    }
    processing
    currentMilestone
    projectAmountMoney {
      ...MoneySourceFields
    }
    amountDifferenceMoney {
      ...MoneySourceFields
    }
    currentRequest {
      ...ProcessRequestMetaSourceFields
    }
    pendingTasks {
      ...ProcessTaskSourceFields
    }
    nextTask {
      ...ProcessTaskSourceFields
    }
    progress {
      ...ProgressSourceFields
    }
    members {
      ...UserIdSourceFields
    }
    coOwners {
      ...UserIdSourceFields
    }
    coOwnersMembers {
      ...UserIdSourceFields
    }
    milestones {
      ...MilestoneInfoSourceFields
    }
    variables {
      ...ProcessVariablesSourceFields
    }
    infoRequests {
      ...InfoRequestSourceFields
    }
    contacts {
      ...ContactSourceFields
    }
    kpiUnit
    currencyCode
    currencySymbol
    relatedEnagements {
      ...IDRefSourceFields
    }
    watched
    alreadyMember
    workStream {
      ...IDRefSourceFields
    }
    description
    hasEbit
    enabledRequestResubmit
    disableRequestResubmitAfterDeny
    engagementAttributes {
      ...FormGlobalValue
    }
    lateMilestones
    upcomingMilestones
    yearlyActualPlusProjections {
      ...YearlyTotalSourceFields
    }
    forkedEngagements {
      ...IDRefSourceFields
    }
    forkedFromEngagement {
      ...IDRefSourceFields
    }
  }
  ${USER_ID_SOURCE_FIELDS}
  ${MILESTONEINFO_SOURCE_FIELDS}
  ${MONEY_SOURCE_FIELDS}
  ${PROCESS_REQUEST_META_SOURCE_FIELDS}
  ${PROCESS_TASK_SOURCE_FIELDS}
  ${PROGRESS_SOURCE_FIELDS}
  ${PROCESS_VARIABLES_SOURCE_FIELDS}
  ${INFO_REQUEST_SOURCE_FIELDS}
  ${CONTACT_SOURCE_FIELDS}
  ${ID_REF_SOURCE_FIELDS}
  ${FORM_GLOBAL_VALUE}
  ${YEARLY_TOTAL_SOURCE_FIELDS}
`
