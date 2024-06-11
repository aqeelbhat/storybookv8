import { gql } from '@apollo/client'
import { QUESTIONNAIREID_SOURCE_FIELDS, TASK_ASSIGNMENT_SOURCE_FIELD, TASK_SOURCE_FIELDS } from '../task/fragaments'
import { GROUP_ID_SOURCE_FIELDS, ID_REF_SOURCE_FIELDS, USER_ID_SOURCE_FIELDS } from '../common/fragments'
import { ENGAGEMENTS_SOURCE_FIELDS } from '../engagements/fragament'

export const MILESTONE_SOURCE_FIELDS = gql`
    fragment MilestonesSourceFields on ProcessDefinitionId {
        name
        description
        type
        logo
    }
`

export const REQUEST_QUESTIONNAIREID_SOURCE_FIELDS = gql`
    fragment RequestQuestionnaireIdSourceFields on RequestQuestionnaireId {
        id
        name
        formId
        custom
    }
`

export const SELECTION_SOURCE_FIELDS = gql`
    fragment SelectionSourceFields on Selection {
        regions
        categories
    }
`

export const REQUEST_STEPS_SOURCE_FIELDS = gql`
    fragment RequestStepSourceFields on RequestStep {
        index
        title
        forms {
            ...RequestQuestionnaireIdSourceFields
        }
        hasConditions
    }
    ${REQUEST_QUESTIONNAIREID_SOURCE_FIELDS}
`

export const REQUEST_META_SOURCE_FIELDS = gql`
    fragment RequestMetaSourceFields on RequestMeta {
        steps {
            ...RequestStepSourceFields
        }
    }
    ${REQUEST_STEPS_SOURCE_FIELDS}
`

export const PROCESS_REQUEST_SOURCE_FIELDS = gql`
    fragment ProcessRequestSourceFields on ProcessRequest {
        tenantId
        id
        requestId
        isNewPartner
        processType
        definitionReference {
            processName
        }
        requestMeta {
            ...RequestMetaSourceFields
        }
        selection {
            ...SelectionSourceFields
        }
        started
        engagementId
        processing
        status
    }
    ${REQUEST_META_SOURCE_FIELDS}
    ${SELECTION_SOURCE_FIELDS}
`

export const REQUEST_STEP_ERROR_SOURCE_FIELDS = gql`
    fragment RequestStepErrorSourceFields on RequestStepError {
        step
        code
        errorFields
        questionnaireId {
            ...QuestionnaireIdSourceFields
        }
    }
    ${QUESTIONNAIREID_SOURCE_FIELDS}
`

export const SELECTOR_ENTRY_SOURCE_FIELDS = gql`
    fragment SelectorEntrySourceFields on SelectorEntry {
        regions
        categories
    }
`

export const PROCESS_DEFINITION_ID_SOURCE_FIELDS = gql`
    fragment ProcessDefinitionIdSourceFields on ProcessDefinitionId {
        name
    }
`

export const NODE_SOURCE_FIELDS = gql`
    fragment NodeSourceFields on Node {
        id
        nodeDefId
        state
        subState
        started
        completed
        name
        description
        notStarted
        ...on ProcessNode {
            subprocessId
            subprocess {
                ...ProcessDefinitionIdSourceFields
            }
            selectorEntry {
                ...SelectorEntrySourceFields
            }
            totalSteps
            estimateCompletionDate
        }
        ...on TaskNode {
            inputs {
                ...QuestionnaireIdSourceFields
            }
            outputForm
            outputFormTitle
            outputFormType
            inputFormNames {
                ...QuestionnaireIdSourceFields
            }
            output {
                ...QuestionnaireIdSourceFields
            }
            type
            estimateCompletionDate
            taskId
            assignedTo {
                ...TaskAssignmentSourceField
            }
        }
        ...on BranchingNode {
            operation
            id
            state
            started
            completed
            name
            description
            documents {
                ...QuestionnaireIdSourceFields
            }
            operation
            daysCompleted
            estimateDays
            taskId
            assignedTo {
                ...TaskAssignmentSourceField
            }
            sequenced
            estimateCompletionDate
        }
        ...on ApiNode {
            id
            state
            started
            completed
            name
            description
            daysCompleted
            estimateDays
            apiType
            taskId
            estimateCompletionDate
        }
        ...on TaskCollectionNode {
            id
            state
            started
            completed
            name
            description
            daysCompleted
            estimateDays
            taskId
            estimateCompletionDate
            assignedTo {
                ...TaskAssignmentSourceField
            }
            notStarted
        }
        estimateCompletionDate
    }
    ${SELECTOR_ENTRY_SOURCE_FIELDS}
    ${PROCESS_DEFINITION_ID_SOURCE_FIELDS}
    ${QUESTIONNAIREID_SOURCE_FIELDS}
    ${ID_REF_SOURCE_FIELDS}
    ${USER_ID_SOURCE_FIELDS}
    ${GROUP_ID_SOURCE_FIELDS}
    ${TASK_ASSIGNMENT_SOURCE_FIELD}
`

export const BRANCH_SOURCE_FIELDS = gql`
    fragment BranchSourceFields on Branch {
        id
        state
        started
        completed
        name
        description
        nodes{
            ...NodeSourceFields
        }
    }
    ${NODE_SOURCE_FIELDS}
`

export const PROCESS_INSTANCE_SOURCE_FIELDS = gql`
    fragment ProcessInstanceSourceFields on ProcessInstance {
        id
        tenantId
        branch {
            ...BranchSourceFields
        }
        requester {
            ...UserIdSourceFields
        }
        vendorId
        selectorEntry {
            ...SelectorEntrySourceFields
        }
        selection {
            ...SelectionSourceFields
        }
        priority
        status
    }
    ${SELECTOR_ENTRY_SOURCE_FIELDS}
    ${SELECTION_SOURCE_FIELDS}
    ${USER_ID_SOURCE_FIELDS}
    ${BRANCH_SOURCE_FIELDS}
`

export const PROCESS_INFO_SOURCE_FIELDS = gql`
    fragment ProcessInfoSourceFields on ProcessInfo {
        processInstance {
            ...ProcessInstanceSourceFields
        }
        engagement {
            ...EngagementsSourceFields
        }
        tasks {
            ...TaskSourceFields
        }
        actingTask {
            ...TaskSourceFields
        }
    }
    ${PROCESS_INSTANCE_SOURCE_FIELDS}
    ${ENGAGEMENTS_SOURCE_FIELDS}
    ${TASK_SOURCE_FIELDS}
`

export const REQUEST_SUBMISSION_RESPONSE_SOURCE_FIELDS = gql`
    fragment RequestSubmissionResponseSourceFields on RequestSubmissionResponse {
        success
        errors {
            ...RequestStepErrorSourceFields
        }
        processInfo {
            ...ProcessInfoSourceFields
        }
    }
    ${REQUEST_STEP_ERROR_SOURCE_FIELDS}
    ${PROCESS_INFO_SOURCE_FIELDS}
`
