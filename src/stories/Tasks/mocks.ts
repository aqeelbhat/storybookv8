export const mockTasksDefault = [
    {
      "index": 1,
      "id": 7,
      "type": "review",
      "displayName": "Review",
      "tasks": [
        
      ],
      "isParallel": false,
      "numberOfDocuments": 0,
      "numberOfSteps": 0,
      "selectedForms": [
        
      ],
      "groups": [
        
      ],
      "inputFormNames": [
        
      ],
      "action": {
        "instruction": "",
        "title": ""
      },
      "assignment": {
        "type": "function_matrix",
        "functionalGroupId": null,
        "groups": [
          
        ],
        "users": [
          
        ]
      },
      "checkListId": ""
    },
    {
      "index": 2,
      "id": 37,
      "type": "process",
      "displayName": "Legal Review",
      "tasks": [
        
      ],
      "isParallel": false,
      "numberOfDocuments": 0,
      "numberOfSteps": 1,
      "selectedForms": [
        
      ],
      "groups": [
        
      ],
      "inputFormNames": [
        
      ],
      "action": {
        "instruction": "",
        "title": ""
      },
      "assignment": {
        "type": "",
        "functionalGroupId": null,
        "groups": [
          
        ],
        "users": [
          
        ]
      },
      "checkListId": ""
    },
    {
      "index": 3,
      "id": 23,
      "type": "branching",
      "displayName": "",
      "tasks": [
        {
          "index": 1,
          "id": 21,
          "type": "manual",
          "displayName": "To Do",
          "tasks": [
            
          ],
          "isParallel": false,
          "numberOfDocuments": 0,
          "numberOfSteps": 0,
          "selectedForms": [
            
          ],
          "groups": [
            
          ],
          "inputFormNames": [
            
          ],
          "action": {
            "instruction": "",
            "title": ""
          },
          "assignment": {
            "type": "",
            "functionalGroupId": null,
            "groups": [
              
            ],
            "users": [
              
            ]
          },
          "checkListId": ""
        },
        {
          "index": 2,
          "id": 38,
          "type": "process",
          "displayName": "Entity Check",
          "tasks": [
            
          ],
          "isParallel": false,
          "numberOfDocuments": 0,
          "numberOfSteps": 2,
          "selectedForms": [
            
          ],
          "groups": [
            
          ],
          "inputFormNames": [
            
          ],
          "action": {
            "instruction": "",
            "title": ""
          },
          "assignment": {
            "type": "",
            "functionalGroupId": null,
            "groups": [
              
            ],
            "users": [
              
            ]
          },
          "checkListId": ""
        },
        {
          "index": 3,
          "id": 22,
          "type": "review",
          "displayName": "Review",
          "tasks": [
            
          ],
          "isParallel": false,
          "numberOfDocuments": 0,
          "numberOfSteps": 0,
          "selectedForms": [
            
          ],
          "groups": [
            
          ],
          "inputFormNames": [
            
          ],
          "action": {
            "instruction": "",
            "title": ""
          },
          "assignment": {
            "type": "",
            "functionalGroupId": null,
            "groups": [
              
            ],
            "users": [
              
            ]
          },
          "checkListId": ""
        }
      ],
      "isParallel": true,
      "numberOfDocuments": 0,
      "numberOfSteps": 0,
      "selectedForms": [
        
      ],
      "groups": [
        
      ],
      "inputFormNames": [
        
      ],
      "action": {
        "instruction": "",
        "title": ""
      },
      "assignment": {
        "type": "",
        "functionalGroupId": null,
        "groups": [
          
        ],
        "users": [
          
        ]
      },
      "checkListId": ""
    },
    {
      "index": 4,
      "id": 15,
      "type": "approval",
      "displayName": "Approval",
      "tasks": [
        
      ],
      "isParallel": false,
      "numberOfDocuments": 0,
      "numberOfSteps": 0,
      "selectedForms": [
        
      ],
      "groups": [
        
      ],
      "inputFormNames": [
        
      ],
      "action": {
        "instruction": "",
        "title": ""
      },
      "assignment": {
        "type": "",
        "functionalGroupId": null,
        "groups": [
          
        ],
        "users": [
          
        ]
      },
      "checkListId": ""
    },
    {
      "index": 5,
      "id": 16,
      "type": "branching",
      "displayName": "Collect docs from supplier",
      "tasks": [
        
      ],
      "isParallel": false,
      "numberOfDocuments": 1,
      "numberOfSteps": 0,
      "selectedForms": [
        {
          "checked": false,
          "custom": false,
          "formId": "OroSupplierDetailForm",
          "name": "Supplier Identification",
          "removable": true
        }
      ],
      "groups": [
        
      ],
      "inputFormNames": [
        {
          "name": "Supplier Identification",
          "formId": "OroSupplierDetailForm",
          "custom": false,
          "checked": false,
          "removable": true
        },
        {
          "name": "Project Detail",
          "formId": "OroProjectDetails",
          "custom": false,
          "checked": false,
          "removable": true
        },
        {
          "name": "Project Detail",
          "formId": "OroProjectDetails",
          "custom": false,
          "checked": false,
          "removable": true
        }
      ],
      "action": {
        "instruction": "",
        "title": ""
      },
      "assignment": {
        "type": "function_matrix",
        "functionalGroupId": null,
        "groups": [
          
        ],
        "users": [
          
        ]
      },
      "checkListId": ""
    }
  ]
  
  
  export const mockProcessDefinition = {
    "tenantId": "foo",
    "name": "New_Process",
    "processType": "onboarding",
    "shortDescription": "testing purpose",
    "inputForms": [
      {
        "name": "Supplier Identification",
        "formId": "OroSupplierDetailForm",
        "custom": false,
        "checked": false,
        "removable": false
      },
      {
        "name": "Project Detail",
        "formId": "OroProjectDetails",
        "custom": false,
        "checked": false,
        "removable": false
      },
      {
        "name": "Review",
        "formId": "OroFormReview",
        "custom": false,
        "checked": false,
        "removable": false
      }
    ],
    "acl": {
      "groups": [
        {
          "tenantId": "foo",
          "groupId": "admin",
          "groupName": "Admin"
        }
      ],
      "users": [
        {
          "api": false,
          "groupIds": [
            
          ],
          "name": "John Doe",
          "tenantId": "foo",
          "userName": "john@foo.com"
        }
      ]
    },
    "selector": {
      "businessUnits": [
        "all"
      ],
      "categories": [
        
      ],
      "isNewPartner": false,
      "partnerBased": true,
      "partnerLevels": [
        "all"
      ],
      "partnerRegions": [
        "all"
      ],
      "projectLevels": [
        "all"
      ],
      "regions": [
        
      ],
      "requesterBased": false,
      "reusable": true
    }
  }