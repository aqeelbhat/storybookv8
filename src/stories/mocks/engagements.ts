
export const marketingProject = {
  "id": "189304713953411072",
  "engagementId": "A663",
  "name": "Marketing Project Test",
  "status": "Pending",
  "requester": {
    "tenantId": "foo",
    "userName": "john@foo.com",
    "name": "John Doe",
    "department": null,
    "__typename": "UserId"
  },
  "started": "2022-06-13T02:31:52.653160Z",
  "updated": "2022-06-13T02:34:27.642378Z",
  "completed": null,
  "processing": false,
  "projectAmountMoney": null,
  "currentRequest": {
    "id": "189304713680781312",
    "requestId": "ORO4638",
    "mainProcessId": "189305362002739200",
    "type": "marketingProject",
    "processName": "Marketing Project Test",
    "processStarted": "2022-06-13T02:34:27.145948Z",
    "__typename": "ProcessRequestMeta"
  },
  "pendingTasks": [
    {
      "type": "documentCollection",
      "title": "Document collection",
      "taskId": "189305362266980352",
      "functionRole": null,
      "functionGroup": null,
      "workstream": null,
      "started": "2022-06-13T02:34:27Z",
      "lateTime": "2022-06-15T02:34:27Z",
      "users": null,
      "groupIds": [
        {
          "groupId": "admin",
          "groupName": "admin",
          "__typename": "GroupId"
        }
      ],
      "owner": null,
      "assignedToCurrentUser": true,
      "taskStatus": "pending",
      "assignmentType": "group",
      "partnerName": null,
      "resubmitted": false,
      "__typename": "ProcessTask"
    }
  ],
  "nextTask": {
    "type": null,
    "title": "Review",
    "taskId": null,
    "functionRole": null,
    "functionGroup": null,
    "workstream": null,
    "started": null,
    "lateTime": null,
    "users": null,
    "groupIds": [
      {
        "groupId": "admin",
        "groupName": "admin",
        "__typename": "GroupId"
      }
    ],
    "owner": null,
    "assignedToCurrentUser": false,
    "taskStatus": null,
    "assignmentType": "group",
    "partnerName": null,
    "resubmitted": null,
    "__typename": "ProcessTask"
  },
  "progress": {
    "stepsTotal": 2,
    "stepsCompleted": 0,
    "totalEstimateTime": 2,
    "completedTime": 0,
    "__typename": "Progress"
  },
  "variables": {
    "categories": [
      {
        "id": "20-2024",
        "name": "Content",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      },
      {
        "id": "20-2010",
        "name": "Creative services",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      },
      {
        "id": "20-2023",
        "name": "Design",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      },
      {
        "id": "20-2025",
        "name": "Digital/Interactive",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      },
      {
        "id": "20-2028",
        "name": "E-commerce",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "regions": [
      {
        "id": "global",
        "name": "Global",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "businessUnits": null,
    "departments": [
      {
        "id": "MARK",
        "name": "Marketing",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "companyEntities": [
      {
        "id": "HH",
        "name": "Honeycomb Holdings Inc.",
        "erpId": "4",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "projectTypes": [
      {
        "id": "marketing-marketing_corporate_marketing-marketing_corporate_marketing_digital",
        "name": "Digital",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "vendorClassification": null,
    "partners": [
      {
        "id": "181404531765018624",
        "vendorRecordId": null,
        "name": "IBM Deutschland GmbH",
        "countryCode": "DE",
        "legalEntityId": "164075039667462442",
        "legalEntityLogo": {
          "metadata": [
            {
              "path": "oro/images/large/164075039667462442.png",
              "height": 200,
              "width": 200,
              "__typename": "ImageMetadata"
            },
            {
              "path": "oro/images/small/164075039667462442.png",
              "height": 100,
              "width": 100,
              "__typename": "ImageMetadata"
            }
          ],
          "__typename": "Image"
        },
        "selectedVendorRecord": {
          "id": "181404532482244608",
          "vendorId": "",
          "enabled": true,
          "paymentTerm": {
            "id": "1",
            "name": "Net 15",
            "erpId": "1",
            "refId": null,
            "__typename": "IDRef"
          },
          "__typename": "VendorRef"
        },
        "__typename": "NormalizedVendorRef"
      }
    ],
    "projectAmountMoney": {
      "currency": "USD",
      "amount": 1000,
      "__typename": "MoneyObject"
    },
    "activityName": "Brand Promotion",
    "activityId": null,
    "activitySystem": "allocadia",
    "summary": "Test",
    "po": null,
    "requestId": null,
    "callbackOutcomes": null,
    "overallScore": null,
    "__typename": "ProcessVariables"
  },
  "infoRequests": null,
  "contacts": [
    {
      "fullName": "YT",
      "firstName": null,
      "lastName": null,
      "email": "support@orolabs.ai",
      "phone": "",
      "role": "Creative Director",
      "note": null,
      "imageUrl": null,
      "__typename": "Contact"
    }
  ],
  "parent": {
    "categories": [
      {
        "id": "50",
        "name": "Facilities",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      },
      {
        "id": "30",
        "name": "HR",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "engagementReference": {
      "id": "335591408815288021",
      "name": "Test Request Forking",
      "erpId": null,
      "refId": "1231220",
      "__typename": "IDRef"
    },
    "engagementTime": "2023-07-21T18:42:58.583206210Z",
    "requester": {
      "tenantId": "foo",
      "userName": "john@foo.com",
      "firstName": null,
      "lastName": null,
      "name": "John Doe",
      "department": null,
      "__typename": "UserId"
    },
    "processId": "335591531172475385",
    "engagementStatus": null,
    "__typename": "EngagementReference"
  },
  "__typename": "Engagement"
}

export const supplierUpdate = {
  "id": "182634080494419968",
  "engagementId": "ORO-282",
  "name": "Bank callback",
  "status": "Completed",
  "requester": {
    "tenantId": "novartis_dev",
    "userName": "customeradmin+novartis_dev@orolabs.ai",
    "name": "Oro Admin",
    "department": null,
    "__typename": "UserId"
  },
  "started": "2022-05-25T16:45:09.771233Z",
  "updated": "2022-05-30T05:44:03.204602Z",
  "completed": "2022-05-30T05:44:03.180416Z",
  "processing": false,
  "projectAmountMoney": null,
  "currentRequest": {
    "id": "182634080146292736",
    "requestId": "ORO0282",
    "mainProcessId": "182634363773517824",
    "type": "supplierUpdate",
    "processName": "Bank callback",
    "processStarted": "2022-05-25T16:46:17.254696Z",
    "__typename": "ProcessRequestMeta"
  },
  "pendingTasks": [],
  "nextTask": null,
  "progress": {
    "stepsTotal": 11,
    "stepsCompleted": 11,
    "totalEstimateTime": 11,
    "completedTime": 11,
    "__typename": "Progress"
  },
  "variables": {
    "categories": null,
    "regions": [
      {
        "id": "150-155-AT",
        "name": "Austria",
        "erpId": null,
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "businessUnits": null,
    "departments": null,
    "companyEntities": [
      {
        "id": "SIM-AT19",
        "name": "AT19",
        "erpId": "AT19",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "projectTypes": null,
    "vendorClassification": {
      "id": "PATE",
      "name": "Patients/Patient Experts",
      "erpId": "",
      "refId": null,
      "__typename": "IDRef"
    },
    "partners": [
      {
        "id": null,
        "vendorRecordId": "afdsafdsfasdfsdf",
        "name": "YUab",
        "countryCode": "AU",
        "legalEntityId": null,
        "legalEntityLogo": null,
        "selectedVendorRecord": null,
        "__typename": "NormalizedVendorRef"
      }
    ],
    "projectAmountMoney": null,
    "activityName": "YUab, Australia",
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "po": null,
    "requestId": "FRA122344",
    "callbackOutcomes": [
      {
        "index": 0,
        "accountNumber": {
          "maskedValue": "********fd",
          "__typename": "EncryptedData"
        },
        "code": "verified",
        "codeRef": {
          "id": "verified",
          "name": "Account verified",
          "erpId": "",
          "refId": null,
          "__typename": "IDRef"
        },
        "__typename": "CallbackOutcome"
      },
      {
        "index": 1,
        "accountNumber": {
          "maskedValue": "********dd",
          "__typename": "EncryptedData"
        },
        "code": "verified",
        "codeRef": {
          "id": "verified",
          "name": "Account verified",
          "erpId": "",
          "refId": null,
          "__typename": "IDRef"
        },
        "__typename": "CallbackOutcome"
      }
    ],
    "overallScore": {
      "score": 0,
      "level": "high",
      "__typename": "RiskScore"
    },
    "__typename": "ProcessVariables"
  },
  "infoRequests": null,
  "contacts": [
    {
      "fullName": null,
      "firstName": null,
      "lastName": null,
      "email": null,
      "phone": null,
      "role": null,
      "note": null,
      "imageUrl": null,
      "__typename": "Contact"
    }
  ],
  "__typename": "Engagement"
}

export const onboarding = {
  "id": "413123080333822597",
  "appType": "",
  "engagementId": "121303",
  "name": "Test Escalation",
  "completed": "",
  "estimatedCompletionDate": "2024-02-28T10:30:26.446256518Z",
  "estimatedEndDates": null,
  "resubmissionTime": "",
  "started": "2024-02-20T17:26:09.542820556Z",
  "updated": "2024-02-26T17:26:03.128761435Z",
  "status": "Pending",
  "processing": false,
  "vendorId": "",
  "projectAmount": {
    "amount": 0,
    "currency": ""
  },
  "requester": {
    "name": "John Doe",
    "userName": "john@foo.com",
    "api": false,
    "groupIds": [],
    "selected": false,
    "tenantId": "foo",
    "department": "",
    "picture": "",
    "firstName": "",
    "lastName": "",
    "email": "john@foo.com",
    "isOtp": false,
    "userNameCP": ""
  },
  "selection": {
    "brands": [],
    "businessUnits": [],
    "categories": [],
    "isNewPartner": false,
    "partnerLevels": [],
    "partnerRegions": [],
    "projectLevels": [],
    "regions": [],
    "requester": {
      "name": "",
      "userName": "",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": "",
      "email": "",
      "isOtp": false,
      "userNameCP": ""
    },
    "spendBucket": 0
  },
  "currentRequest": {
    "id": "413123079713065607",
    "requestId": "ORO16589",
    "mainProcessId": "413123203142908010",
    "type": "onboarding",
    "processName": "Test Escalation",
    "processStarted": "2024-02-20T17:26:38.808115178Z"
  },
  "projectAmountMoney": {
    "amount": 0,
    "currency": ""
  },
  "amountDifferenceMoney": {
    "amount": 0,
    "currency": ""
  },
  "pendingTasks": [
    {
      "type": "manual",
      "title": "To do",
      "taskId": "415297380102053345",
      "functionRole": "",
      "functionGroup": "",
      "started": "2024-02-26T17:26:02.985494Z",
      "lateTime": "2024-02-28T17:26:02.985494Z",
      "users": [],
      "groupIds": [],
      "owner": {
        "name": "",
        "userName": "",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "isOtp": false,
        "userNameCP": ""
      },
      "assignedToCurrentUser": true,
      "taskStatus": "pending",
      "assignmentType": "",
      "partnerName": "",
      "workstream": {
        "id": "",
        "name": "",
        "erpId": "",
        "refId": null,
        "version": ""
      },
      "resubmitted": false,
      "infoMsgId": "",
      "lastMsg": "",
      "lastMsgBy": "",
      "lastMsgTime": "",
      "lastMsgUser": "",
      "msgClosed": false,
      "suspended": false,
      "submissionComment": "",
      "completed": ""
    }
  ],
  "nextTask": {
    "type": "",
    "title": "",
    "taskId": "",
    "functionRole": "",
    "functionGroup": "",
    "started": "",
    "lateTime": "",
    "users": [],
    "groupIds": [],
    "owner": {
      "name": "",
      "userName": "",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": "",
      "email": "",
      "isOtp": false,
      "userNameCP": ""
    },
    "assignedToCurrentUser": false,
    "taskStatus": null,
    "assignmentType": "",
    "partnerName": "",
    "workstream": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "resubmitted": false,
    "infoMsgId": "",
    "lastMsg": "",
    "lastMsgBy": "",
    "lastMsgTime": "",
    "lastMsgUser": "",
    "msgClosed": false,
    "suspended": false,
    "submissionComment": "",
    "completed": ""
  },
  "progress": {
    "stepsTotal": 3,
    "stepsCompleted": 2,
    "totalEstimateTime": 3,
    "completedTime": 2,
    "milestoneInfo": null,
    "tasksStarted": false,
    "progressNote": null,
    "previousNote": null,
    "noUpdateDate": "",
    "milestoneOverdue": false,
    "needsUpdate": false,
    "noUpdateLastWeek": false,
    "submitByDate": "",
    "daysToApprovalSubmiteDate": 0,
    "milestoneWarning": false
  },
  "variables": {
    "categories": [
      {
        "id": "ALL",
        "name": "All",
        "erpId": "ALL",
        "refId": null,
        "version": ""
      }
    ],
    "sites": [],
    "regions": [
      {
        "id": "19-21-US",
        "name": "United States",
        "erpId": "",
        "refId": null,
        "version": ""
      }
    ],
    "businessRegions": [],
    "businessUnit": [],
    "departments": [],
    "companyEntities": [
      {
        "id": "HH",
        "name": "Honeycomb Holdings Inc.",
        "erpId": "4",
        "refId": null,
        "version": ""
      }
    ],
    "projectTypes": [],
    "partners": [
      {
        "id": "400361055638238101",
        "vendorRecordId": null,
        "name": "Supp",
        "countryCode": "",
        "legalEntityId": null,
        "legalEntityLogo": {
          "metadata": [],
          "backgroundColor": ""
        },
        "contact": {
          "address": {
            "alpha2CountryCode": "",
            "city": "",
            "language": "",
            "line1": "",
            "line2": "",
            "line3": "",
            "postal": "",
            "province": "",
            "streetNumber": "",
            "unitNumber": ""
          },
          "email": "saqlain.shaikh@orolabs.ai",
          "firstName": "",
          "id": "",
          "lastName": "",
          "phone": "+917385961231",
          "role": "Owner",
          "title": "",
          "fullName": "Saqlain Shaikh",
          "imageUrl": "",
          "emailVerified": false,
          "phoneVerified": false,
          "note": "",
          "requireBackgroundCheck": false,
          "operationLocation": {
            "alpha2CountryCode": "",
            "city": "",
            "language": "",
            "line1": "",
            "line2": "",
            "line3": "",
            "postal": "",
            "province": "",
            "streetNumber": "",
            "unitNumber": ""
          },
          "service": "",
          "sanctionList": []
        },
        "activationStatus": "newSupplier",
        "vendorRecords": [],
        "isIndividual": false,
        "shareHolders": [],
        "subsidiaries": [],
        "subcontractors": [],
        "sanctionList": [],
        "members": [],
        "ein": "",
        "tin": "",
        "vat": "",
        "tinCountryCode": "",
        "vatCountryCode": ""
      }
    ],
    "partnerSelected": false,
    "impact": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "segment": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "segments": [],
    "vendorClassification": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "processName": "",
    "startingSubprocessName": "",
    "projectAmountMoney": {
      "amount": 0,
      "currency": ""
    },
    "projectAmountMoneyInTenantCurrency": {
      "amount": 0,
      "currency": ""
    },
    "contractAmountMoney": {
      "amount": 0,
      "currency": ""
    },
    "activityName": "Supplier onboarding",
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "companyEntityCountryCodes": [],
    "po": {
      "id": null,
      "poNumber": "",
      "cost": 0,
      "currencyCode": ""
    },
    "paymentMethod": "",
    "engagementId": "",
    "requestId": "",
    "callbackOutcomes": [],
    "overallScore": null,
    "priority": "",
    "priorityRank": null,
    "contracts": [],
    "assesssmentScopes": [],
    "companyEntityCurrencyCode": "",
    "accountCode": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "requestType": "",
    "budgetAmountMoney": {
      "amount": 0,
      "currency": ""
    },
    "defaultVendorCountry": null,
    "invoices": [],
    "financialImpactTypes": [],
    "locations": [],
    "additionalCompanyEntities": [],
    "emailTo": null,
    "emailFrom": null,
    "releaseVersion": ""
  },
  "infoRequests": [],
  "contacts": [
    {
      "address": {
        "alpha2CountryCode": "",
        "city": "",
        "language": "",
        "line1": "",
        "line2": "",
        "line3": "",
        "postal": "",
        "province": "",
        "streetNumber": "",
        "unitNumber": ""
      },
      "email": "saqlain.shaikh@orolabs.ai",
      "firstName": "",
      "id": "",
      "lastName": "",
      "phone": "+917385961231",
      "role": "Owner",
      "title": "",
      "fullName": "Saqlain Shaikh",
      "imageUrl": "",
      "emailVerified": false,
      "phoneVerified": false,
      "note": "",
      "requireBackgroundCheck": false,
      "operationLocation": {
        "alpha2CountryCode": "",
        "city": "",
        "language": "",
        "line1": "",
        "line2": "",
        "line3": "",
        "postal": "",
        "province": "",
        "streetNumber": "",
        "unitNumber": ""
      },
      "service": "",
      "sanctionList": [],
      "contactId": "",
      "engagementId": "",
      "supplierUserId": "",
      "tenantId": "",
      "selection": {
        "brands": [],
        "businessUnits": [],
        "categories": [],
        "isNewPartner": false,
        "partnerLevels": [],
        "partnerRegions": [],
        "projectLevels": [],
        "regions": [],
        "requester": {
          "name": "",
          "userName": "",
          "api": false,
          "groupIds": [],
          "selected": false,
          "tenantId": "",
          "department": "",
          "picture": "",
          "firstName": "",
          "lastName": "",
          "email": "",
          "isOtp": false,
          "userNameCP": ""
        },
        "spendBucket": 0
      }
    }
  ],
  "currentMilestone": "",
  "milestones": [],
  "coOwners": [],
  "coOwnersMembers": [],
  "segment": {
    "id": "",
    "name": "",
    "erpId": "",
    "refId": null,
    "version": ""
  },
  "members": [],
  "lastStatusUpdate": "",
  "kpiUnit": "",
  "currencyCode": "",
  "currencySymbol": "",
  "relatedEnagements": [],
  "watched": false,
  "alreadyMember": false,
  "workStream": {
    "id": "",
    "name": "",
    "erpId": "",
    "refId": null,
    "version": ""
  },
  "description": "",
  "hasEbit": false,
  "disableDefaultEngagementAttributes": false,
  "engagementAttributes": null,
  "lateMilestones": 0,
  "upcomingMilestones": 0,
  "issues": [],
  "parent": null,
  "hasChildRequests": false,
  "program": {
    "id": "eng",
    "name": "Engineering",
    "erpId": "",
    "refId": null,
    "version": ""
  },
  "enabledRequestResubmit": false,
  "yearlyActualPlusProjections": [],
  "disableRequestResubmitAfterDeny": false,
  "forkedEngagements": [],
  "forkedFromEngagement": {
    "id": "",
    "name": "",
    "erpId": "",
    "refId": null,
    "version": ""
  }
}
export const softwarePurchase = {
  "id": "189303236329472000",
  "engagementId": "A662",
  "name": "Software Data Purchase",
  "status": "Pending",
  "requester": {
    "tenantId": "foo",
    "userName": "john@foo.com",
    "name": "John Doe",
    "department": null,
    "__typename": "UserId"
  },
  "started": "2022-06-13T02:26:00.357163Z",
  "updated": "2022-06-13T02:28:07.460400Z",
  "completed": null,
  "processing": false,
  "projectAmountMoney": null,
  "currentRequest": {
    "id": "189303235989733376",
    "requestId": "ORO4637",
    "mainProcessId": "189303763444432896",
    "type": "softwareDataPurchase",
    "processName": "Sudhir Tech Purchase",
    "processStarted": "2022-06-13T02:28:06.020102Z",
    "__typename": "ProcessRequestMeta"
  },
  "pendingTasks": [
    {
      "type": "review",
      "title": "Review",
      "taskId": "189303763608010752",
      "functionRole": null,
      "functionGroup": null,
      "workstream": null,
      "started": "2022-06-13T02:28:06Z",
      "lateTime": "2022-06-15T02:28:06Z",
      "users": [
        {
          "tenantId": null,
          "userName": "john@foo.com",
          "name": "John Doe",
          "department": null,
          "__typename": "UserId"
        }
      ],
      "groupIds": null,
      "owner": {
        "tenantId": "foo",
        "userName": "john@foo.com",
        "name": "John Doe",
        "department": null,
        "__typename": "UserId"
      },
      "assignedToCurrentUser": true,
      "taskStatus": "pending",
      "assignmentType": "request_owners",
      "partnerName": null,
      "resubmitted": false,
      "__typename": "ProcessTask"
    }
  ],
  "nextTask": null,
  "progress": {
    "stepsTotal": 1,
    "stepsCompleted": 0,
    "totalEstimateTime": 1,
    "completedTime": 0,
    "__typename": "Progress"
  },
  "variables": {
    "categories": null,
    "regions": null,
    "businessUnits": null,
    "departments": [
      {
        "id": "IT",
        "name": "IT",
        "erpId": "",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "companyEntities": [
      {
        "id": "HH-6",
        "name": "Honeycomb Holding GmbH",
        "erpId": "6",
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "projectTypes": null,
    "vendorClassification": null,
    "spendType": "New Purchase",
    "partners": [
      {
        "id": null,
        "vendorRecordId": null,
        "name": "Microsoft",
        "countryCode": "US",
        "legalEntityId": "164075039671656908",
        "legalEntityLogo": {
          "metadata": [
            {
              "path": "oro/images/large/164075039671656908.png",
              "height": 0,
              "width": 0,
              "__typename": "ImageMetadata"
            }
          ],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "__typename": "NormalizedVendorRef"
      }
    ],
    "projectAmountMoney": {
      "currency": "EUR",
      "amount": 500,
      "__typename": "MoneyObject"
    },
    "activityName": "Software - Printer",
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "po": null,
    "requestId": null,
    "callbackOutcomes": null,
    "overallScore": {
      "score": 0,
      "level": "medium",
      "__typename": "RiskScore"
    },
    "__typename": "ProcessVariables"
  },
  "infoRequests": null,
  "contacts": [],
  "__typename": "Engagement"
}

export const draftEngagement = {
  "id": "415284720849942990",
  "appType": "",
  "engagementId": "121369",
  "name": "Yuan - cache",
  "completed": "",
  "estimatedCompletionDate": "",
  "estimatedEndDates": null,
  "resubmissionTime": "",
  "started": "2024-02-26T16:35:44.811746220Z",
  "updated": "2024-02-26T16:36:08.566815196Z",
  "status": "Draft",
  "processing": false,
  "vendorId": "",
  "projectAmount": {
    "amount": 0,
    "currency": ""
  },
  "requester": {
    "name": "John Doe",
    "userName": "john@foo.com",
    "api": false,
    "groupIds": [],
    "selected": false,
    "tenantId": "foo",
    "department": "",
    "picture": "",
    "firstName": "",
    "lastName": "",
    "email": "john@foo.com",
    "isOtp": false,
    "userNameCP": ""
  },
  "selection": {
    "brands": [],
    "businessUnits": [],
    "categories": [],
    "isNewPartner": false,
    "partnerLevels": [],
    "partnerRegions": [],
    "projectLevels": [],
    "regions": [],
    "requester": {
      "name": "",
      "userName": "",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": "",
      "email": "",
      "isOtp": false,
      "userNameCP": ""
    },
    "spendBucket": 0
  },
  "currentRequest": {
    "id": "415284720170465742",
    "requestId": "ORO16694",
    "mainProcessId": null,
    "type": "onboarding",
    "processName": "Yuan - cache-V2",
    "processStarted": null
  },
  "projectAmountMoney": {
    "amount": 0,
    "currency": ""
  },
  "amountDifferenceMoney": {
    "amount": 0,
    "currency": ""
  },
  "pendingTasks": [],
  "nextTask": {
    "type": "",
    "title": "",
    "taskId": "",
    "functionRole": "",
    "functionGroup": "",
    "started": "",
    "lateTime": "",
    "users": [],
    "groupIds": [],
    "owner": {
      "name": "",
      "userName": "",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": "",
      "email": "",
      "isOtp": false,
      "userNameCP": ""
    },
    "assignedToCurrentUser": false,
    "taskStatus": null,
    "assignmentType": "",
    "partnerName": "",
    "workstream": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "resubmitted": false,
    "infoMsgId": "",
    "lastMsg": "",
    "lastMsgBy": "",
    "lastMsgTime": "",
    "lastMsgUser": "",
    "msgClosed": false,
    "suspended": false,
    "submissionComment": "",
    "completed": ""
  },
  "progress": {
    "stepsTotal": 15,
    "stepsCompleted": 0,
    "totalEstimateTime": 18,
    "completedTime": 0,
    "milestoneInfo": null,
    "tasksStarted": false,
    "progressNote": null,
    "previousNote": null,
    "noUpdateDate": "",
    "milestoneOverdue": false,
    "needsUpdate": false,
    "noUpdateLastWeek": false,
    "submitByDate": "",
    "daysToApprovalSubmiteDate": 0,
    "milestoneWarning": false
  },
  "variables": {
    "categories": [],
    "sites": [],
    "regions": [],
    "businessRegions": [],
    "businessUnit": [],
    "departments": [],
    "companyEntities": [],
    "projectTypes": [],
    "partners": [
      {
        "id": "180288362328883200",
        "vendorRecordId": null,
        "name": "IBMS SYSTEMS LLC",
        "countryCode": "IN",
        "legalEntityId": "164076168733487325",
        "legalEntityLogo": {
          "metadata": [],
          "backgroundColor": ""
        },
        "contact": {
          "address": {
            "alpha2CountryCode": "",
            "city": "",
            "language": "",
            "line1": "",
            "line2": "",
            "line3": "",
            "postal": "",
            "province": "",
            "streetNumber": "",
            "unitNumber": ""
          },
          "email": "yuan.tung@orolabs.ai",
          "firstName": "",
          "id": "",
          "lastName": "",
          "phone": "",
          "role": "Account Manager",
          "title": "",
          "fullName": "Yuan",
          "imageUrl": "",
          "emailVerified": false,
          "phoneVerified": false,
          "note": "",
          "requireBackgroundCheck": false,
          "operationLocation": {
            "alpha2CountryCode": "",
            "city": "",
            "language": "",
            "line1": "",
            "line2": "",
            "line3": "",
            "postal": "",
            "province": "",
            "streetNumber": "",
            "unitNumber": ""
          },
          "service": "",
          "sanctionList": []
        },
        "activationStatus": "duplicate",
        "vendorRecords": [],
        "isIndividual": false,
        "shareHolders": [],
        "subsidiaries": [],
        "subcontractors": [],
        "sanctionList": [],
        "members": [],
        "ein": "",
        "tin": "",
        "vat": "",
        "tinCountryCode": "",
        "vatCountryCode": ""
      }
    ],
    "partnerSelected": false,
    "impact": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "segment": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "segments": [],
    "vendorClassification": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "processName": "",
    "startingSubprocessName": "",
    "projectAmountMoney": {
      "amount": 1000,
      "currency": "USD"
    },
    "projectAmountMoneyInTenantCurrency": {
      "amount": 921.489126428308,
      "currency": "EUR"
    },
    "contractAmountMoney": {
      "amount": 0,
      "currency": ""
    },
    "activityName": null,
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "companyEntityCountryCodes": [],
    "po": {
      "id": null,
      "poNumber": "",
      "cost": 0,
      "currencyCode": ""
    },
    "paymentMethod": "",
    "engagementId": "",
    "requestId": "",
    "callbackOutcomes": [],
    "overallScore": null,
    "priority": "",
    "priorityRank": null,
    "contracts": [],
    "assesssmentScopes": [],
    "companyEntityCurrencyCode": "",
    "accountCode": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": null,
      "version": ""
    },
    "requestType": "",
    "budgetAmountMoney": {
      "amount": 0,
      "currency": ""
    },
    "defaultVendorCountry": null,
    "invoices": [],
    "financialImpactTypes": [],
    "locations": [],
    "additionalCompanyEntities": [],
    "emailTo": null,
    "emailFrom": null,
    "releaseVersion": ""
  },
  "infoRequests": [],
  "contacts": [
    {
      "address": {
        "alpha2CountryCode": "",
        "city": "",
        "language": "",
        "line1": "",
        "line2": "",
        "line3": "",
        "postal": "",
        "province": "",
        "streetNumber": "",
        "unitNumber": ""
      },
      "email": "yuan.tung@orolabs.ai",
      "firstName": "",
      "id": "",
      "lastName": "",
      "phone": "",
      "role": "Account Manager",
      "title": "",
      "fullName": "Yuan",
      "imageUrl": "",
      "emailVerified": false,
      "phoneVerified": false,
      "note": "",
      "requireBackgroundCheck": false,
      "operationLocation": {
        "alpha2CountryCode": "",
        "city": "",
        "language": "",
        "line1": "",
        "line2": "",
        "line3": "",
        "postal": "",
        "province": "",
        "streetNumber": "",
        "unitNumber": ""
      },
      "service": "",
      "sanctionList": [],
      "contactId": "",
      "engagementId": "",
      "supplierUserId": "",
      "tenantId": "",
      "selection": {
        "brands": [],
        "businessUnits": [],
        "categories": [],
        "isNewPartner": false,
        "partnerLevels": [],
        "partnerRegions": [],
        "projectLevels": [],
        "regions": [],
        "requester": {
          "name": "",
          "userName": "",
          "api": false,
          "groupIds": [],
          "selected": false,
          "tenantId": "",
          "department": "",
          "picture": "",
          "firstName": "",
          "lastName": "",
          "email": "",
          "isOtp": false,
          "userNameCP": ""
        },
        "spendBucket": 0
      }
    }
  ],
  "currentMilestone": "",
  "milestones": [],
  "coOwners": [],
  "coOwnersMembers": [],
  "segment": {
    "id": "",
    "name": "",
    "erpId": "",
    "refId": null,
    "version": ""
  },
  "members": [],
  "lastStatusUpdate": "",
  "kpiUnit": "",
  "currencyCode": "",
  "currencySymbol": "",
  "relatedEnagements": [],
  "watched": false,
  "alreadyMember": false,
  "workStream": {
    "id": "",
    "name": "",
    "erpId": "",
    "refId": null,
    "version": ""
  },
  "description": "",
  "hasEbit": false,
  "disableDefaultEngagementAttributes": true,
  "engagementAttributes": [
    {
      "displayValue": "",
      "name": "_p_engagement_title1__p_",
      "reportName": "Title"
    },
    {
      "displayValue": "",
      "name": "_p_Biz_Unit__p_",
      "reportName": "Biz Unit"
    },
    {
      "displayValue": "",
      "name": "_p_Stop_request__p_",
      "reportName": ""
    },
    {
      "displayValue": "",
      "name": "_p_multi_choice_synced__p_",
      "reportName": ""
    },
    {
      "displayValue": "",
      "name": "_p_Some_text_field__p_",
      "reportName": "Some field report"
    }
  ],
  "lateMilestones": 0,
  "upcomingMilestones": 0,
  "issues": [],
  "parent": null,
  "hasChildRequests": false,
  "program": {
    "id": "eng",
    "name": "Engineering",
    "erpId": "",
    "refId": null,
    "version": ""
  },
  "enabledRequestResubmit": false,
  "yearlyActualPlusProjections": [],
  "disableRequestResubmitAfterDeny": false,
  "forkedEngagements": [],
  "forkedFromEngagement": {
    "id": "",
    "name": "",
    "erpId": "",
    "refId": null,
    "version": ""
  }
}

export const EBIT = {
  "id": "165898309255299072",
  "engagementId": "A5",
  "appType": "development",
  "name": "EBIT Measure",
  "status": "Pending",
  "lastStatusUpdate": "2022-04-09T12:46:40.807356Z",
  "requester": {
    "tenantId": "basf_dev",
    "userName": "zukowsal",
    "name": "Aleksandra Zukowska",
    "department": null,
    "__typename": "UserId"
  },
  "started": "2022-04-09T12:23:10.900894Z",
  "updated": "2022-06-15T11:31:16.874416Z",
  "completed": null,
  "processing": false,
  "currentMilestone": "Evaluated",
  "projectAmountMoney": {
    "currency": "EUR",
    "amount": 1480,
    "__typename": "MoneyObject"
  },
  "amountDifferenceMoney": {
    "currency": "EUR",
    "amount": 80,
    "__typename": "MoneyObject"
  },
  "currentRequest": {
    "id": "165898309024612352",
    "requestId": "ORO0858",
    "mainProcessId": "165904003924754432",
    "type": "development",
    "processName": "EBIT",
    "processStarted": "2022-04-09T12:45:48.636712Z",
    "__typename": "ProcessRequestMeta"
  },
  "pendingTasks": [
    {
      "type": "approval",
      "title": "PMO Approval",
      "taskId": "190163019920048128",
      "functionRole": null,
      "functionGroup": null,
      "started": "2022-06-15T11:22:28.725585Z",
      "lateTime": "2022-06-17T11:22:28.725585Z",
      "users": [
        {
          "tenantId": null,
          "userName": "sudhir@orolabs.ai",
          "name": "Sudhir Bhojwani",
          "department": null,
          "__typename": "UserId"
        },
        {
          "tenantId": null,
          "userName": "sudhir@orolabs.ai",
          "name": "Sudhir Bhojwani",
          "department": null,
          "__typename": "UserId"
        },
        {
          "tenantId": null,
          "userName": "sudhir@orolabs.ai",
          "name": "Sudhir Bhojwani",
          "department": null,
          "__typename": "UserId"
        }
      ],
      "groupIds": null,
      "owner": {
        "tenantId": "basf_dev",
        "userName": "zukowsal",
        "name": "Aleksandra Zukowska",
        "department": null,
        "__typename": "UserId"
      },
      "assignedToCurrentUser": false,
      "taskStatus": "pending",
      "assignmentType": "user",
      "partnerName": null,
      "workstream": null,
      "__typename": "ProcessTask"
    }
  ],
  "nextTask": {
    "type": null,
    "title": "Exec Approval",
    "taskId": null,
    "functionRole": null,
    "functionGroup": null,
    "started": null,
    "lateTime": null,
    "users": [
      {
        "tenantId": null,
        "userName": "sudhir@orolabs.ai",
        "name": "Sudhir Bhojwani",
        "department": null,
        "__typename": "UserId"
      }
    ],
    "groupIds": null,
    "owner": null,
    "assignedToCurrentUser": false,
    "taskStatus": null,
    "assignmentType": "user",
    "partnerName": null,
    "workstream": null,
    "__typename": "ProcessTask"
  },
  "progress": {
    "stepsTotal": 6,
    "stepsCompleted": 1,
    "totalEstimateTime": 12,
    "completedTime": 3,
    "tasksStarted": true,
    "status": "onhold",
    "remainingTime": 9,
    "milestoneInfo": {
      "index": 2,
      "processName": "Evaluated",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    },
    "completed": false,
    "pending": true,
    "previousNote": {
      "date": "2022-04-09",
      "past": "adding last week's status",
      "upcoming": "",
      "by": {
        "tenantId": "basf_dev",
        "userName": "zukowsal",
        "name": "Aleksandra Zukowska",
        "department": null,
        "__typename": "UserId"
      },
      "__typename": "ProgressNote"
    },
    "progressNote": {
      "date": "2022-04-09",
      "past": "adding last week's status",
      "upcoming": "next week's status",
      "by": {
        "tenantId": "basf_dev",
        "userName": "zukowsal",
        "name": "Aleksandra Zukowska",
        "department": null,
        "__typename": "UserId"
      },
      "__typename": "ProgressNote"
    },
    "noUpdateDate": null,
    "milestoneOverdue": false,
    "submitByDate": null,
    "milestoneWarning": false,
    "daysToApprovalSubmiteDate": null,
    "needsUpdate": null,
    "noUpdateLastWeek": null,
    "__typename": "Progress"
  },
  "members": null,
  "coOwners": [
    {
      "tenantId": "basf_dev",
      "userName": "zukowsal",
      "name": "Aleksandra Zukowska",
      "department": null,
      "__typename": "UserId"
    }
  ],
  "milestones": [
    {
      "index": 1,
      "processName": "Idea",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    },
    {
      "index": 2,
      "processName": "Evaluated",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    },
    {
      "index": 3,
      "processName": "Approved New",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    },
    {
      "index": 4,
      "processName": "Executed",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    },
    {
      "index": 5,
      "processName": "First Savings",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    },
    {
      "index": 6,
      "processName": "P&L Effective",
      "date": null,
      "totalAisle": 6,
      "endDate": null,
      "__typename": "MilestoneInfo"
    }
  ],
  "variables": {
    "categories": null,
    "regions": null,
    "businessUnits": null,
    "departments": null,
    "companyEntities": null,
    "sites": [
      {
        "id": "Converse",
        "name": "Converse",
        "erpId": "",
        "refId": "",
        "__typename": "IDRef"
      },
      {
        "id": "Rome",
        "name": "Rome",
        "erpId": "",
        "refId": "",
        "__typename": "IDRef"
      },
      {
        "id": "Seneca",
        "name": "Seneca",
        "erpId": "",
        "refId": "",
        "__typename": "IDRef"
      }
    ],
    "impact": {
      "id": "FCS",
      "name": "Fixed Cost Savings",
      "erpId": "",
      "refId": "",
      "__typename": "IDRef"
    },
    "vendorClassification": null,
    "segment": null,
    "priority": "high",
    "projectTypes": null,
    "partners": [
      {
        "id": "156210937169182720",
        "vendorRecordId": null,
        "name": "Hereaus",
        "countryCode": null,
        "legalEntityId": "156166631120863233",
        "legalEntityLogo": {
          "metadata": [],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "__typename": "NormalizedVendorRef"
      }
    ],
    "projectAmountMoney": {
      "currency": "EUR",
      "amount": 1234,
      "__typename": "MoneyObject"
    },
    "activityName": "Abhi EBIT test - 9th April",
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "requestId": null,
    "po": null,
    "callbackOutcomes": null,
    "overallScore": null,
    "__typename": "ProcessVariables"
  },
  "infoRequests": null,
  "contacts": [],
  "kpiUnit": "K",
  "currencyCode": "EUR",
  "currencySymbol": "€",
  "relatedEnagements": [
    {
      "id": "D20",
      "name": "D20: test work stream approval with quite a long character length for the measure name",
      "erpId": "",
      "refId": "D20",
      "__typename": "IDRef"
    },
    {
      "id": "H1",
      "name": "H1: Workforce Planning",
      "erpId": "",
      "refId": "H1",
      "__typename": "IDRef"
    }
  ],
  "watched": false,
  "alreadyMember": false,
  "workStream": {
    "id": "A",
    "name": "A - Supply Chain",
    "erpId": "",
    "refId": "",
    "__typename": "IDRef"
  },
  "description": "Situation: adding a situation\n\nAction:\n\nBenefit:",
  "__typename": "Engagement"
}

export const ENABLER = {
  "id": "157027947100766208",
  "engagementId": "A65",
  "appType": "development",
  "name": "2022 Inventory Improvements",
  "status": "Pending",
  "lastStatusUpdate": "2022-04-25T17:06:33.761888Z",
  "requester": {
    "tenantId": "basf_dev",
    "userName": "simmonh",
    "name": "Harriet Simmons",
    "department": null,
    "__typename": "UserId"
  },
  "started": "2022-03-16T00:55:31.790142Z",
  "updated": "2022-06-07T13:27:46.877247Z",
  "completed": null,
  "processing": false,
  "currentMilestone": "Approved New",
  "projectAmountMoney": null,
  "amountDifferenceMoney": null,
  "currentRequest": {
    "id": "157027946547118080",
    "requestId": "ORO0624",
    "mainProcessId": "157027951068577792",
    "type": "development",
    "processName": "Enabler",
    "processStarted": "2022-03-16T00:55:32.934675Z",
    "__typename": "ProcessRequestMeta"
  },
  "pendingTasks": [
    {
      "type": "taskCollection",
      "title": null,
      "taskId": "157027954474352640",
      "functionRole": null,
      "functionGroup": null,
      "started": "2022-03-16T00:55:33.381627Z",
      "lateTime": "2022-03-18T00:55:33.381627Z",
      "users": [
        {
          "tenantId": null,
          "userName": "simmonh",
          "name": "Harriet Simmons",
          "department": null,
          "__typename": "UserId"
        }
      ],
      "groupIds": null,
      "owner": {
        "tenantId": "basf_dev",
        "userName": "simmonh",
        "name": "Harriet Simmons",
        "department": null,
        "__typename": "UserId"
      },
      "assignedToCurrentUser": false,
      "taskStatus": "pending",
      "assignmentType": "request_owners",
      "partnerName": null,
      "workstream": null,
      "__typename": "ProcessTask"
    }
  ],
  "nextTask": {
    "type": null,
    "title": "Exec Approval",
    "taskId": null,
    "functionRole": null,
    "functionGroup": null,
    "started": null,
    "lateTime": null,
    "users": [
      {
        "tenantId": null,
        "userName": "wagles",
        "name": "Sonia Wagle",
        "department": null,
        "__typename": "UserId"
      }
    ],
    "groupIds": null,
    "owner": null,
    "assignedToCurrentUser": false,
    "taskStatus": null,
    "assignmentType": "user",
    "partnerName": null,
    "workstream": null,
    "__typename": "ProcessTask"
  },
  "progress": {
    "stepsTotal": 0,
    "stepsCompleted": 0,
    "totalEstimateTime": 0,
    "completedTime": 0,
    "tasksStarted": false,
    "status": "ok",
    "remainingTime": 0,
    "milestoneInfo": {
      "index": 3,
      "processName": "Approved New",
      "date": "2021-11-15",
      "totalAisle": 4,
      "endDate": "2022-04-01",
      "__typename": "MilestoneInfo"
    },
    "completed": false,
    "pending": false,
    "previousNote": {
      "date": "2022-03-08",
      "past": "All actions completed.                                                                         Continue normal inventory preperation/organization",
      "upcoming": "Follow Master Count Plan for all locations",
      "by": {
        "tenantId": "basf_dev",
        "userName": "simmonh",
        "name": "Harriet Simmons",
        "department": null,
        "__typename": "UserId"
      },
      "__typename": "ProgressNote"
    },
    "progressNote": {
      "date": "2022-04-25",
      "past": "All actions completed.                                                                           Continue normal inventory preperation/organization",
      "upcoming": "Follow Master Count Plan for all locations",
      "by": {
        "tenantId": "basf_dev",
        "userName": "zukowsal",
        "name": "Aleksandra Zukowska",
        "department": null,
        "__typename": "UserId"
      },
      "__typename": "ProgressNote"
    },
    "noUpdateDate": null,
    "milestoneOverdue": false,
    "submitByDate": null,
    "milestoneWarning": false,
    "daysToApprovalSubmiteDate": null,
    "needsUpdate": null,
    "noUpdateLastWeek": null,
    "__typename": "Progress"
  },
  "members": null,
  "coOwners": [
    {
      "tenantId": "basf_dev",
      "userName": "simmonh",
      "name": "Harriet Simmons",
      "department": null,
      "__typename": "UserId"
    }
  ],
  "milestones": [
    {
      "index": 1,
      "processName": "Idea",
      "date": "2021-08-01",
      "totalAisle": 4,
      "endDate": "2021-08-01",
      "__typename": "MilestoneInfo"
    },
    {
      "index": 2,
      "processName": "Evaluated",
      "date": "2021-08-01",
      "totalAisle": 4,
      "endDate": "2021-11-15",
      "__typename": "MilestoneInfo"
    },
    {
      "index": 3,
      "processName": "Approved New",
      "date": "2021-11-15",
      "totalAisle": 4,
      "endDate": "2022-04-01",
      "__typename": "MilestoneInfo"
    },
    {
      "index": 4,
      "processName": "Executed",
      "date": "2022-04-01",
      "totalAisle": 4,
      "endDate": null,
      "__typename": "MilestoneInfo"
    }
  ],
  "variables": {
    "categories": null,
    "regions": null,
    "businessUnits": null,
    "departments": null,
    "companyEntities": null,
    "sites": [
      {
        "id": "Bach",
        "name": "Bach",
        "erpId": "",
        "refId": "",
        "__typename": "IDRef"
      },
      {
        "id": "Cinderford",
        "name": "Cinderford",
        "erpId": "",
        "refId": "",
        "__typename": "IDRef"
      }
    ],
    "impact": {
      "id": "NOI",
      "name": "NOI",
      "erpId": "",
      "refId": "",
      "__typename": "IDRef"
    },
    "vendorClassification": null,
    "segment": null,
    "projectTypes": null,
    "partners": [
      {
        "id": "156210937169182720",
        "vendorRecordId": null,
        "name": "Hereaus",
        "countryCode": null,
        "legalEntityId": "156166631120863233",
        "legalEntityLogo": {
          "metadata": [],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "__typename": "NormalizedVendorRef"
      }
    ],
    "projectAmountMoney": null,
    "activityName": "2022 Inventory Improvements",
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "requestId": null,
    "po": null,
    "callbackOutcomes": null,
    "overallScore": null,
    "__typename": "ProcessVariables"
  },
  "infoRequests": null,
  "contacts": [],
  "kpiUnit": "K",
  "currencyCode": "EUR",
  "currencySymbol": "€",
  "relatedEnagements": [
    {
      "id": "170572195121070080",
      "name": "H3: Trialing this as a QA check",
      "erpId": "",
      "refId": "H3",
      "__typename": "IDRef"
    }
  ],
  "watched": false,
  "alreadyMember": false,
  "workStream": {
    "id": "A",
    "name": "Supply Chain",
    "erpId": "",
    "refId": "",
    "__typename": "IDRef"
  },
  "description": null,
  "__typename": "Engagement"
}

export const PROCUREMENT_INTAKE = {
  "id": "204692125726539776",
  "engagementId": "M27",
  "name": "Procurement request",
  "status": "Pending",
  "requester": {
    "tenantId": "49ers",
    "userName": "customeradmin+49ers@orolabs.ai",
    "name": "Oro Admin",
    "department": null,
    "__typename": "UserId"
  },
  "started": "2022-07-25T13:35:57.503739Z",
  "updated": "2022-07-25T13:39:48.908962Z",
  "completed": null,
  "processing": false,
  "projectAmountMoney": null,
  "currentRequest": {
    "id": "204692125370023936",
    "requestId": "ORO0070",
    "mainProcessId": "204693063270924288",
    "type": "procurementIntake",
    "processName": "Procurement Intake Process",
    "processStarted": "2022-07-25T13:39:41.017605Z",
    "__typename": "ProcessRequestMeta"
  },
  "pendingTasks": [
    {
      "type": "review",
      "title": "Review",
      "taskId": "204693063493222400",
      "functionRole": null,
      "functionGroup": null,
      "workstream": null,
      "started": "2022-07-25T13:39:41Z",
      "lateTime": "2022-07-27T13:39:41Z",
      "users": [
        {
          "tenantId": null,
          "userName": "customeradmin+49ers@orolabs.ai",
          "name": "Oro Admin",
          "department": null,
          "__typename": "UserId"
        }
      ],
      "groupIds": null,
      "owner": {
        "tenantId": "49ers",
        "userName": "customeradmin+49ers@orolabs.ai",
        "name": "Oro Admin",
        "department": null,
        "__typename": "UserId"
      },
      "assignedToCurrentUser": true,
      "taskStatus": "inreview",
      "assignmentType": "request_owners",
      "partnerName": null,
      "resubmitted": false,
      "msgClosed": null,
      "infoMsgId": null,
      "lastMsgTime": null,
      "lastMsg": null,
      "lastMsgBy": null,
      "lastMsgUser": null,
      "suspended": false,
      "__typename": "ProcessTask"
    }
  ],
  "nextTask": null,
  "progress": {
    "stepsTotal": 1,
    "stepsCompleted": 0,
    "totalEstimateTime": 1,
    "completedTime": 0,
    "__typename": "Progress"
  },
  "variables": {
    "categories": [
      {
        "id": "6",
        "name": "Public Projects",
        "erpId": "",
        "refId": "",
        "__typename": "IDRef"
      }
    ],
    "regions": [
      {
        "id": "19-21-US",
        "name": "United States",
        "erpId": null,
        "refId": null,
        "__typename": "IDRef"
      }
    ],
    "businessUnits": null,
    "departments": null,
    "companyEntities": [
      {
        "id": "60",
        "name": "ManCo",
        "erpId": "60",
        "refId": "",
        "__typename": "IDRef"
      }
    ],
    "projectTypes": null,
    "vendorClassification": null,
    "partnerSelected": false,
    "partners": [
      {
        "id": null,
        "vendorRecordId": null,
        "name": "CONSTRUCTION GROUP, LLC",
        "countryCode": "US",
        "legalEntityId": "164076168733487321",
        "legalEntityLogo": {
          "metadata": [],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "__typename": "NormalizedVendorRef"
      },
      {
        "id": "89113807414099968",
        "vendorRecordId": null,
        "name": "Apple",
        "countryCode": "IN",
        "legalEntityId": "88868992675233957",
        "legalEntityLogo": {
          "metadata": [
            {
              "path": "oro/images/small/88868992675233957.png",
              "height": 100,
              "width": 100,
              "__typename": "ImageMetadata"
            },
            {
              "path": "oro/images/large/88868992675233957.png",
              "height": 200,
              "width": 200,
              "__typename": "ImageMetadata"
            }
          ],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "contact": {
          "fullName": "nitesh Jadhav",
          "firstName": "",
          "lastName": "",
          "email": "nitesh@orolabs.ai",
          "phone": "",
          "role": "Account Manager",
          "note": null,
          "imageUrl": "",
          "__typename": "Contact"
        },
        "activationStatus": "duplicate",
        "isIndividual": false,
        "members": null,
        "__typename": "NormalizedVendorRef"
      },
      {
        "id": "202885259988041728",
        "vendorRecordId": null,
        "name": "Apple Inc",
        "countryCode": "US",
        "legalEntityId": "197472170988429316",
        "legalEntityLogo": {
          "metadata": [
            {
              "path": "oro/images/large/197472170988429316.png",
              "height": 200,
              "width": 200,
              "__typename": "ImageMetadata"
            },
            {
              "path": "oro/images/small/197472170988429316.png",
              "height": 100,
              "width": 100,
              "__typename": "ImageMetadata"
            }
          ],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "contact": {
          "fullName": "Anil",
          "firstName": "",
          "lastName": "",
          "email": "anil.mandava+supplier@orolabs.ai",
          "phone": "+14089811048",
          "role": "Account Manager",
          "note": null,
          "imageUrl": "",
          "__typename": "Contact"
        },
        "activationStatus": "newSupplier",
        "isIndividual": false,
        "members": null,
        "__typename": "NormalizedVendorRef"
      },
      {
        "id": "180288362328883200",
        "vendorRecordId": null,
        "name": "IBMS SYSTEMS LLC",
        "countryCode": "IN",
        "legalEntityId": "164076168733487325",
        "legalEntityLogo": {
          "metadata": [],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "contact": {
          "fullName": "Rohit",
          "firstName": null,
          "lastName": null,
          "email": "rohit@orolabs.ai",
          "phone": "",
          "role": "It Lead",
          "note": null,
          "imageUrl": null,
          "__typename": "Contact"
        },
        "activationStatus": "duplicate",
        "isIndividual": false,
        "members": null,
        "__typename": "NormalizedVendorRef"
      },
      {
        "id": "375574517570931952",
        "vendorRecordId": null,
        "name": "REMOTE TECHNOLOGY, INC.",
        "countryCode": "US",
        "legalEntityId": "101317271510655545",
        "legalEntityLogo": {
          "metadata": [
            {
              "path": "oro/images/large/101317271510655545.png",
              "height": 200,
              "width": 200,
              "__typename": "ImageMetadata"
            },
            {
              "path": "oro/images/small/101317271510655545.png",
              "height": 100,
              "width": 100,
              "__typename": "ImageMetadata"
            }
          ],
          "__typename": "Image"
        },
        "selectedVendorRecord": null,
        "contact": {
          "fullName": "Contact",
          "firstName": null,
          "lastName": null,
          "email": "rohit@orolabs.ai",
          "phone": "",
          "role": "Account Manager",
          "note": null,
          "imageUrl": null,
          "__typename": "Contact"
        },
        "activationStatus": "newSupplier",
        "isIndividual": false,
        "members": null,
        "__typename": "NormalizedVendorRef"
      }
    ],
    "projectAmountMoney": null,
    "activityName": "Stadium Rennovation",
    "activityId": null,
    "activitySystem": null,
    "summary": null,
    "po": null,
    "requestId": null,
    "callbackOutcomes": null,
    "overallScore": null,
    "__typename": "ProcessVariables"
  },
  "infoRequests": null,
  "contacts": [
    {
      "fullName": "Harry Kuma",
      "firstName": null,
      "lastName": null,
      "email": "hkb@orolabs.ai",
      "phone": "",
      "role": "Owner",
      "note": null,
      "imageUrl": null,
      "__typename": "Contact"
    }
  ],
  "__typename": "Engagement"
}
