export const mockSteps = [
  {
    "index": 1,
    "node": {
      "id": 2,
      "state": "notStarted",
      "started": "2021-09-16T06:57:09.057016Z",
      "completed": "2021-09-16T07:00:41.434579Z",
      "name": "Approval Task",
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
        "department": "Procurment",
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
    "index": 0,
    "node": {
      "id": 2,
      "state": "notApplicable",
      "started": "2021-09-16T06:57:09.057016Z",
      "completed": "2021-09-16T07:00:41.434579Z",
      "name": "Sub Process",
      "description": null,
      "inputs": null,
      "subprocess": {
        "name": "Sub Process"
      },
      "totalSteps": 2,
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
        "name": "",
        "department": "",
        "__typename": "TaskAssignment"
      },
      "__typename": "TaskNode"
    },
    "steps": [],
    "parallel": false,
    "numberOfDocuments": 0,
    "selectedForms": null,
    "type": "Subprocess",
    "__typename": "NodeStep"
  },
  {
    "index": 2,
    "node": {
      "id": 2,
      "state": "notStarted",
      "started": "2021-09-16T06:57:09.057016Z",
      "completed": "2021-09-16T07:00:41.434579Z",
      "name": "Approval Task",
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
        "department": "Procurment",
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
    "index": 3,
    "node": {
      "id": 2,
      "state": "notStarted",
      "started": "2021-09-16T06:57:09.057016Z",
      "completed": "2021-09-16T07:00:41.434579Z",
      "name": "Approval Task",
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
        "department": "Procurment",
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