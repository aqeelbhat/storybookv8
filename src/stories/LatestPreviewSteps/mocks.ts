export const mockSteps = [
    {
      "index": 1,
      "node": {
        "id": 2,
        "state": "notStarted",
        "subState": "notStarted",
        "started": null,
        "completed": null,
        "name": null,
        "description": null,
        "notStarted": false,
        "operation": "and",
        "documents": [],
        "daysCompleted": 0,
        "estimateDays": 1,
        "taskId": null,
        "assignedTo": null,
        "sequenced": false,
        "estimateCompletionDate": null,
        "__typename": "BranchingNode"
      },
      "steps": [
        {
          "index": 1,
          "node": {
            "id": 4,
            "state": "notStarted",
            "subState": "notStarted",
            "started": null,
            "completed": null,
            "name": "Review Task",
            "description": null,
            "notStarted": false,
            "inputs": null,
            "outputForm": "Test_Operator",
            "outputFormTitle": "Test Operator",
            "outputFormType": "custom",
            "inputFormNames": null,
            "output": null,
            "type": "review",
            "estimateCompletionDate": null,
            "taskId": null,
            "assignedTo": {
              "name": "John Doe",
              "department": null,
              "assignmentType": "user",
              "allUsers": [
                {
                  "tenantId": null,
                  "userName": "john@foo.com",
                  "name": "John Doe",
                  "department": null,
                  "firstName": null,
                  "lastName": null,
                  "__typename": "UserId"
                }
              ],
              "groups": null,
              "workstream": null,
              "assigned": null,
              "__typename": "TaskAssignment"
            },
            "__typename": "TaskNode"
          },
          "steps": null,
          "parallel": false,
          "numberOfDocuments": 0,
          "selectedForms": null,
          "type": "Review",
          "taskIds": null,
          "__typename": "NodeStep"
        },
        {
          "index": 2,
          "node": {
            "id": 6,
            "state": "notStarted",
            "subState": "notStarted",
            "started": null,
            "completed": null,
            "name": "Approval",
            "description": null,
            "notStarted": false,
            "inputs": null,
            "outputForm": null,
            "outputFormTitle": null,
            "outputFormType": "custom",
            "inputFormNames": null,
            "output": null,
            "type": "approval",
            "estimateCompletionDate": null,
            "taskId": null,
            "assignedTo": {
              "name": null,
              "department": null,
              "assignmentType": null,
              "allUsers": null,
              "groups": null,
              "workstream": null,
              "assigned": null,
              "__typename": "TaskAssignment"
            },
            "__typename": "TaskNode"
          },
          "steps": null,
          "parallel": false,
          "numberOfDocuments": 0,
          "selectedForms": null,
          "type": "Approval",
          "taskIds": null,
          "__typename": "NodeStep"
        }
      ],
      "parallel": true,
      "numberOfDocuments": 0,
      "selectedForms": null,
      "type": null,
      "taskIds": null,
      "__typename": "NodeStep"
    },
    {
      "index": 2,
      "node": {
        "id": 7,
        "state": "notStarted",
        "subState": "notStarted",
        "started": null,
        "completed": null,
        "name": null,
        "description": null,
        "notStarted": false,
        "operation": "and",
        "documents": [],
        "daysCompleted": 0,
        "estimateDays": 1,
        "taskId": null,
        "assignedTo": null,
        "sequenced": true,
        "estimateCompletionDate": null,
        "__typename": "BranchingNode"
      },
      "steps": [
        {
          "index": 1,
          "node": {
            "id": 9,
            "state": "notStarted",
            "subState": "notStarted",
            "started": null,
            "completed": null,
            "name": "Approval",
            "description": null,
            "notStarted": false,
            "inputs": null,
            "estimateDays": 4,
            "outputForm": null,
            "outputFormTitle": null,
            "outputFormType": "custom",
            "inputFormNames": null,
            "output": null,
            "type": "approval",
            "estimateCompletionDate": null,
            "taskId": null,
            "assignedTo": {
              "name": null,
              "department": null,
              "assignmentType": null,
              "allUsers": null,
              "groups": null,
              "workstream": null,
              "assigned": null,
              "__typename": "TaskAssignment"
            },
            "__typename": "TaskNode"
          },
          "steps": null,
          "parallel": false,
          "numberOfDocuments": 0,
          "selectedForms": null,
          "type": "Approval",
          "taskIds": null,
          "__typename": "NodeStep"
        },
        {
          "index": 2,
          "node": {
            "id": 11,
            "state": "notStarted",
            "subState": "notStarted",
            "started": null,
            "completed": null,
            "name": "Approval",
            "description": null,
            "notStarted": false,
            "inputs": null,
            "outputForm": null,
            "outputFormTitle": null,
            "outputFormType": "custom",
            "inputFormNames": null,
            "output": null,
            "type": "approval",
            "estimateCompletionDate": null,
            "taskId": null,
            "assignedTo": {
              "name": null,
              "department": null,
              "assignmentType": null,
              "allUsers": null,
              "groups": null,
              "workstream": null,
              "assigned": null,
              "__typename": "TaskAssignment"
            },
            "__typename": "TaskNode"
          },
          "steps": null,
          "parallel": false,
          "numberOfDocuments": 0,
          "selectedForms": null,
          "type": "Approval",
          "taskIds": null,
          "__typename": "NodeStep"
        }
      ],
      "parallel": true,
      "numberOfDocuments": 0,
      "selectedForms": null,
      "type": null,
      "taskIds": null,
      "__typename": "NodeStep"
    },
    {
      "index": 3,
      "node": {
        "id": 12,
        "state": "notStarted",
        "subState": "notStarted",
        "started": null,
        "completed": null,
        "name": "Test Parallel Steps Name",
        "description": null,
        "notStarted": false,
        "operation": "and",
        "documents": [],
        "daysCompleted": 0,
        "estimateDays": 1,
        "taskId": null,
        "assignedTo": null,
        "sequenced": false,
        "estimateCompletionDate": null,
        "__typename": "BranchingNode"
      },
      "steps": [
        {
          "index": 1,
          "node": {
            "id": 14,
            "state": "notStarted",
            "subState": "notStarted",
            "started": null,
            "completed": null,
            "name": "Approval",
            "description": null,
            "notStarted": false,
            "inputs": null,
            "outputForm": null,
            "outputFormTitle": null,
            "outputFormType": "custom",
            "inputFormNames": null,
            "output": null,
            "type": "approval",
            "estimateCompletionDate": null,
            "taskId": null,
            "assignedTo": {
              "name": null,
              "department": null,
              "assignmentType": null,
              "allUsers": null,
              "groups": null,
              "workstream": null,
              "assigned": null,
              "__typename": "TaskAssignment"
            },
            "__typename": "TaskNode"
          },
          "steps": null,
          "parallel": false,
          "numberOfDocuments": 0,
          "selectedForms": null,
          "type": "Approval",
          "taskIds": null,
          "__typename": "NodeStep"
        },
        {
          "index": 2,
          "node": {
            "id": 16,
            "state": "notStarted",
            "subState": "notStarted",
            "started": null,
            "completed": null,
            "name": "Approval",
            "description": null,
            "notStarted": false,
            "inputs": null,
            "outputForm": null,
            "outputFormTitle": null,
            "outputFormType": "custom",
            "inputFormNames": null,
            "output": null,
            "type": "approval",
            "estimateCompletionDate": null,
            "taskId": null,
            "assignedTo": {
              "name": null,
              "department": null,
              "assignmentType": null,
              "allUsers": null,
              "groups": null,
              "workstream": null,
              "assigned": null,
              "__typename": "TaskAssignment"
            },
            "__typename": "TaskNode"
          },
          "steps": null,
          "parallel": false,
          "numberOfDocuments": 0,
          "selectedForms": null,
          "type": "Approval",
          "taskIds": null,
          "__typename": "NodeStep"
        }
      ],
      "parallel": true,
      "numberOfDocuments": 0,
      "selectedForms": null,
      "type": null,
      "taskIds": null,
      "__typename": "NodeStep"
    }
]

export const mockSubProcessSteps = [
  {
    "index": 1,
    "node": {
      "id": 2,
      "state": "notApplicable",
      "started": "2021-09-16T06:57:09.057016Z",
      "completed": "2021-09-16T07:00:41.434579Z",
      "name": "AP Review",
      "description": null,
      "inputs": null,
      "outputForm": "OroAPReview",
      "outputFormTitle": "Review Task",
      "outputFormType": "oro",
      "inputFormNames": [
        {
          "id": null,
          "name": "Supplier Identification",
          "formId": "OroSupplierDetailForm",
          "formDocumentId": null,
          "custom": false,
          "editMode": false,
          "completed": false,
          "__typename": "QuestionnaireId"
        }
      ],
      "output": null,
      "type": "review",
      "taskId": "91526749153656832",
      "assignedTo": {
        "name": "John Doe",
        "department": "",
        "__typename": "TaskAssignment"
      },
      "__typename": "TaskNode"
    },
    "steps": [],
    "parallel": false,
    "numberOfDocuments": 0,
    "selectedForms": null,
    "type": "Review",
    "__typename": "NodeStep"
  },
  {
    "index": 2,
    "node": {
      "id": 2,
      "state": "notStarted",
      "started": "2021-09-16T06:57:09.057016Z",
      "completed": "2021-09-16T07:00:41.434579Z",
      "name": "Doc Collection",
      "description": null,
      "inputs": null,
      "outputForm": "OroAPReview",
      "outputFormTitle": "AP review",
      "outputFormType": "oro",
      "inputFormNames": [
        {
          "id": null,
          "name": "Supplier Identification",
          "formId": "OroSupplierDetailForm",
          "formDocumentId": null,
          "custom": false,
          "editMode": false,
          "completed": false,
          "__typename": "QuestionnaireId"
        }
      ],
      "output": null,
      "type": "review",
      "taskId": "91526749153656832",
      "assignedTo": {
        "name": "John Doe",
        "department": "",
        "__typename": "TaskAssignment"
      },
      "__typename": "TaskNode"
    },
    "steps": [],
    "parallel": false,
    "numberOfDocuments": 0,
    "selectedForms": null,
    "type": "Review",
    "__typename": "NodeStep"
  }
]