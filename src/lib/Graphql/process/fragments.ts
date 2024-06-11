import { gql } from '@apollo/client'
import { QUESTIONNAIREID_SOURCE_FIELDS, TASK_SOURCE_FIELDS } from '../task/fragaments'
import { NODE_SOURCE_FIELDS } from '../request/fragment'

export const NODE_STEP_SOURCE_FIELDS = gql`
    fragment NodeStepResponseSourceFields on NodeStep {
        index
        processId
        node {
            ...NodeSourceFields
        }
        steps {
            index
            processId
            node {
                ...NodeSourceFields
            }
            steps {
                index
                processId
                node {
                    ...NodeSourceFields
                }
                steps {
                    index
                    processId
                    node {
                        ...NodeSourceFields
                    }
                    steps {
                        index
                        processId
                        node {
                            ...NodeSourceFields
                        }
                        steps {
                            index
                            processId
                            node {
                                ...NodeSourceFields
                            }
                            parallel
                            numberOfDocuments
                            selectedForms {
                                ...QuestionnaireIdSourceFields
                            }
                            type
                            taskIds {
                                taskId
                                stepIndex
                                paths
                            }
                        }
                        parallel
                        numberOfDocuments
                        selectedForms {
                            ...QuestionnaireIdSourceFields
                        }
                        type
                        taskIds {
                            taskId
                            stepIndex
                            paths
                        }
                    }
                    parallel
                    numberOfDocuments
                    selectedForms {
                        ...QuestionnaireIdSourceFields
                    }
                    type
                    taskIds {
                        taskId
                        stepIndex
                        paths
                    }
                }
                parallel
                numberOfDocuments
                selectedForms {
                    ...QuestionnaireIdSourceFields
                }
                type
                taskIds {
                    taskId
                    stepIndex
                    paths
                }
            }
            parallel
            numberOfDocuments
            selectedForms {
                ...QuestionnaireIdSourceFields
            }
            type
            taskIds {
                taskId
                stepIndex
                paths
            }
        }
        parallel
        numberOfDocuments
        selectedForms {
            ...QuestionnaireIdSourceFields
        }
        type
        taskIds {
            taskId
            stepIndex
            paths
        }
    }
    ${NODE_SOURCE_FIELDS}
    ${QUESTIONNAIREID_SOURCE_FIELDS}
`

export const PROCESS_STEP_INFO_SOURCE_FIELDS = gql`
    fragment ProcessStepInfoSourceFields on ProcessStepInfo {
        tasks {
            ...TaskSourceFields
        }
        steps {
            ...NodeStepResponseSourceFields
        }
    }
    ${TASK_SOURCE_FIELDS}
    ${NODE_STEP_SOURCE_FIELDS}
`