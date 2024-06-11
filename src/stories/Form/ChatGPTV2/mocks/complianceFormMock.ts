export default {
    "versionNum": null,
    "created": "2023-09-09T14:35:51.657824735Z",
    "updated": "2023-09-09T14:57:39.365537959Z",
    "createdBy": {
        "tenantId": null,
        "tenantName": null,
        "userName": "customeradmin+roche_demo@orolabs.ai",
        "userNameCP": null,
        "externalId": null,
        "employeeId": null,
        "name": "Oro Admin",
        "department": null,
        "departmentCode": null,
        "departmentErpId": null,
        "groupIds": null,
        "type": "Tenant",
        "email": null,
        "phone": null,
        "firstName": null,
        "lastName": null,
        "api": false,
        "picture": null,
        "ip": null,
        "impersonator": "harikumaran.babu@orolabs.ai",
        "connectionName": null,
        "procurementAdmin": true,
        "otp": false,
        "admin": false
    },
    "updatedBy": {
        "tenantId": "foo",
        "tenantName": "Foo Company",
        "userName": "john@foo.com",
        "userNameCP": null,
        "externalId": null,
        "employeeId": null,
        "name": "John Doe",
        "department": null,
        "departmentCode": null,
        "departmentErpId": null,
        "groupIds": null,
        "type": "Tenant",
        "email": "john@foo.com",
        "phone": null,
        "firstName": null,
        "lastName": null,
        "api": false,
        "picture": null,
        "ip": "106.213.86.65",
        "impersonator": null,
        "connectionName": null,
        "procurementAdmin": true,
        "otp": false,
        "admin": true
    },
    "audit": null,
    "acl": {
        "users": [
            {
                "tenantId": null,
                "tenantName": null,
                "userName": "customeradmin+roche_demo@orolabs.ai",
                "userNameCP": null,
                "externalId": null,
                "employeeId": null,
                "name": "Oro Admin",
                "department": null,
                "departmentCode": null,
                "departmentErpId": null,
                "groupIds": null,
                "type": "Tenant",
                "email": null,
                "phone": null,
                "firstName": null,
                "lastName": null,
                "api": false,
                "picture": null,
                "ip": null,
                "impersonator": "harikumaran.babu@orolabs.ai",
                "connectionName": null,
                "procurementAdmin": true,
                "otp": false,
                "admin": false
            }
        ],
        "groups": [],
        "workstream": null,
        "programs": null,
        "departments": null,
        "open": false
    },
    "version": "2",
    "idGenerator": {
        "id": 10
    },
    "tenantId": "foo",
    "name": "Compliance_Form",
    "title": "Compliance Form",
    "description": "",
    "visibility": null,
    "customVisibilityConditions": null,
    "formType": null,
    "view": {
        "sections": [
            {
                "id": "1",
                "title": null,
                "description": null,
                "displayIndex": "1",
                "grids": [
                    {
                        "id": "2",
                        "displayIndex": "1.1",
                        "level": null,
                        "fields": [
                            {
                                "id": "3",
                                "size": 12,
                                "field": {
                                    "id": "4",
                                    "name": "<p>Is this contract for global use ?</p>",
                                    "description": null,
                                    "placeHolderText": null,
                                    "helpText": null,
                                    "fieldName": "q4__p_Is_this_contract_for_global",
                                    "stringRegex": null,
                                    "type": "string",
                                    "selection": "single",
                                    "customFieldType": "single_selection",
                                    "choices": {
                                        "defaultValue": {
                                            "value": ""
                                        },
                                        "defaultValues": [],
                                        "choices": [
                                            {
                                                "value": "Yes"
                                            },
                                            {
                                                "value": "Not Applicable"
                                            }
                                        ]
                                    },
                                    "visible": null,
                                    "editable": null,
                                    "required": null,
                                    "optional": false,
                                    "displayIndex": "1.1",
                                    "fileTypes": null,
                                    "documents": null,
                                    "masterDataType": null,
                                    "masterdataConfig": null,
                                    "numberConfig": null,
                                    "dateConfig": null,
                                    "userListingConfig": null,
                                    "formDataConfig": null,
                                    "level": null,
                                    "extracted": false,
                                    "reportName": null,
                                    "fieldGrouping": null,
                                    "fieldGroupOrder": 1000,
                                    "fieldDefaultValue": null,
                                    "defaultValue": null,
                                    "processFieldMapping": null,
                                    "formFieldMapping": null,
                                    "defaultMapping": null,
                                    "certificateConfig": null,
                                    "multiConfig": null,
                                    "itemListConfig": null,
                                    "contactConfig": null,
                                    "riskConfig": null,
                                    "assessmentSubtypeConfig": null,
                                    "assessmentExpirationConfig": null,
                                    "objectSelectorConfig": null,
                                    "splitAccountingConfig": null,
                                    "actionConfig": null,
                                    "linkButtonConfig": null,
                                    "restrictedToRole": null,
                                    "displayDocument": false,
                                    "isReadOnly": false,
                                    "isHidden": false,
                                    "hiddenForReadOnly": null,
                                    "published": true,
                                    "clearOnHide": false,
                                    "showRadioBtnControlForChoices": false,
                                    "isSetterOnly": false,
                                    "submitOnChange": false,
                                    "displayInTenantCurrency": null
                                }
                            }
                        ]
                    },
                    {
                        "id": "5",
                        "displayIndex": "1.2",
                        "level": null,
                        "fields": [
                            {
                                "id": "6",
                                "size": 12,
                                "field": {
                                    "id": "7",
                                    "name": "<p>Is this request GxP relevant ?</p>",
                                    "description": null,
                                    "placeHolderText": null,
                                    "helpText": null,
                                    "fieldName": "q7__p_Is_this_request_GxP_relevan",
                                    "stringRegex": null,
                                    "type": "string",
                                    "selection": "single",
                                    "customFieldType": "single_selection",
                                    "choices": {
                                        "defaultValue": {
                                            "value": ""
                                        },
                                        "defaultValues": [],
                                        "choices": [
                                            {
                                                "value": "Good Clinical Practice (GCP)"
                                            },
                                            {
                                                "value": "Good Laboratory Practice (GLP)"
                                            },
                                            {
                                                "value": "Good Manufacturing Practice (GMP)"
                                            },
                                            {
                                                "value": "Good Pharmacovigilance Practice (GVP)"
                                            },
                                            {
                                                "value": "Good Storage Practice (GSP)"
                                            },
                                            {
                                                "value": "Not Applicable"
                                            }
                                        ]
                                    },
                                    "visible": null,
                                    "editable": null,
                                    "required": null,
                                    "optional": false,
                                    "displayIndex": "1.2",
                                    "fileTypes": null,
                                    "documents": null,
                                    "masterDataType": null,
                                    "masterdataConfig": null,
                                    "numberConfig": null,
                                    "dateConfig": null,
                                    "userListingConfig": null,
                                    "formDataConfig": null,
                                    "level": null,
                                    "extracted": false,
                                    "reportName": null,
                                    "fieldGrouping": null,
                                    "fieldGroupOrder": 1000,
                                    "fieldDefaultValue": null,
                                    "defaultValue": null,
                                    "processFieldMapping": null,
                                    "formFieldMapping": null,
                                    "defaultMapping": null,
                                    "certificateConfig": null,
                                    "multiConfig": null,
                                    "itemListConfig": null,
                                    "contactConfig": null,
                                    "riskConfig": null,
                                    "assessmentSubtypeConfig": null,
                                    "assessmentExpirationConfig": null,
                                    "objectSelectorConfig": null,
                                    "splitAccountingConfig": null,
                                    "actionConfig": null,
                                    "linkButtonConfig": null,
                                    "restrictedToRole": null,
                                    "displayDocument": false,
                                    "isReadOnly": false,
                                    "isHidden": false,
                                    "hiddenForReadOnly": null,
                                    "published": true,
                                    "clearOnHide": false,
                                    "showRadioBtnControlForChoices": false,
                                    "isSetterOnly": false,
                                    "submitOnChange": false,
                                    "displayInTenantCurrency": null
                                }
                            }
                        ]
                    },
                    {
                        "id": "8",
                        "displayIndex": "1.3",
                        "level": null,
                        "fields": [
                            {
                                "id": "9",
                                "size": 12,
                                "field": {
                                    "id": "10",
                                    "name": "<p>Will any personally identifiable data / personal data be collected, handled, stored, destroyed or transferred ?</p>",
                                    "description": null,
                                    "placeHolderText": null,
                                    "helpText": null,
                                    "fieldName": "q10__p_Will_any_personally_identif",
                                    "stringRegex": null,
                                    "type": "string",
                                    "selection": "single",
                                    "customFieldType": "single_selection",
                                    "choices": {
                                        "defaultValue": {
                                            "value": ""
                                        },
                                        "defaultValues": [],
                                        "choices": [
                                            {
                                                "value": "Yes"
                                            },
                                            {
                                                "value": "No"
                                            }
                                        ]
                                    },
                                    "visible": null,
                                    "editable": null,
                                    "required": null,
                                    "optional": false,
                                    "displayIndex": "1.3",
                                    "fileTypes": null,
                                    "documents": null,
                                    "masterDataType": null,
                                    "masterdataConfig": null,
                                    "numberConfig": null,
                                    "dateConfig": null,
                                    "userListingConfig": null,
                                    "formDataConfig": null,
                                    "level": null,
                                    "extracted": false,
                                    "reportName": null,
                                    "fieldGrouping": null,
                                    "fieldGroupOrder": 1000,
                                    "fieldDefaultValue": null,
                                    "defaultValue": null,
                                    "processFieldMapping": null,
                                    "formFieldMapping": null,
                                    "defaultMapping": null,
                                    "certificateConfig": null,
                                    "multiConfig": null,
                                    "itemListConfig": null,
                                    "contactConfig": null,
                                    "riskConfig": null,
                                    "assessmentSubtypeConfig": null,
                                    "assessmentExpirationConfig": null,
                                    "objectSelectorConfig": null,
                                    "splitAccountingConfig": null,
                                    "actionConfig": null,
                                    "linkButtonConfig": null,
                                    "restrictedToRole": null,
                                    "displayDocument": false,
                                    "isReadOnly": false,
                                    "isHidden": false,
                                    "hiddenForReadOnly": null,
                                    "published": true,
                                    "clearOnHide": false,
                                    "showRadioBtnControlForChoices": false,
                                    "isSetterOnly": false,
                                    "submitOnChange": false,
                                    "displayInTenantCurrency": null
                                }
                            }
                        ]
                    }
                ],
                "visible": null,
                "hiddenForReadOnly": null,
                "layout": "twoColumn"
            }
        ]
    },
    "model": {
        "fields": [
            {
                "id": "4",
                "name": "<p>Is this contract for global use ?</p>",
                "description": null,
                "placeHolderText": null,
                "helpText": null,
                "fieldName": "q4__p_Is_this_contract_for_global",
                "stringRegex": null,
                "type": "string",
                "selection": "single",
                "customFieldType": "single_selection",
                "choices": {
                    "defaultValue": {
                        "value": ""
                    },
                    "defaultValues": [],
                    "choices": [
                        {
                            "value": "Yes"
                        },
                        {
                            "value": "Not Applicable"
                        }
                    ]
                },
                "visible": null,
                "editable": null,
                "required": null,
                "optional": false,
                "displayIndex": "1.1",
                "fileTypes": null,
                "documents": null,
                "masterDataType": null,
                "masterdataConfig": null,
                "numberConfig": null,
                "dateConfig": null,
                "userListingConfig": null,
                "formDataConfig": null,
                "level": null,
                "extracted": false,
                "reportName": null,
                "fieldGrouping": null,
                "fieldGroupOrder": 1000,
                "fieldDefaultValue": null,
                "defaultValue": null,
                "processFieldMapping": null,
                "formFieldMapping": null,
                "defaultMapping": null,
                "certificateConfig": null,
                "multiConfig": null,
                "itemListConfig": null,
                "contactConfig": null,
                "riskConfig": null,
                "assessmentSubtypeConfig": null,
                "assessmentExpirationConfig": null,
                "objectSelectorConfig": null,
                "splitAccountingConfig": null,
                "actionConfig": null,
                "linkButtonConfig": null,
                "restrictedToRole": null,
                "displayDocument": false,
                "isReadOnly": false,
                "isHidden": false,
                "hiddenForReadOnly": null,
                "published": true,
                "clearOnHide": false,
                "showRadioBtnControlForChoices": false,
                "isSetterOnly": false,
                "submitOnChange": false,
                "displayInTenantCurrency": null
            },
            {
                "id": "7",
                "name": "<p>Is this request GxP relevant ?</p>",
                "description": null,
                "placeHolderText": null,
                "helpText": null,
                "fieldName": "q7__p_Is_this_request_GxP_relevan",
                "stringRegex": null,
                "type": "string",
                "selection": "single",
                "customFieldType": "single_selection",
                "choices": {
                    "defaultValue": {
                        "value": ""
                    },
                    "defaultValues": [],
                    "choices": [
                        {
                            "value": "Good Clinical Practice (GCP)"
                        },
                        {
                            "value": "Good Laboratory Practice (GLP)"
                        },
                        {
                            "value": "Good Manufacturing Practice (GMP)"
                        },
                        {
                            "value": "Good Pharmacovigilance Practice (GVP)"
                        },
                        {
                            "value": "Good Storage Practice (GSP)"
                        },
                        {
                            "value": "Not Applicable"
                        }
                    ]
                },
                "visible": null,
                "editable": null,
                "required": null,
                "optional": false,
                "displayIndex": "1.2",
                "fileTypes": null,
                "documents": null,
                "masterDataType": null,
                "masterdataConfig": null,
                "numberConfig": null,
                "dateConfig": null,
                "userListingConfig": null,
                "formDataConfig": null,
                "level": null,
                "extracted": false,
                "reportName": null,
                "fieldGrouping": null,
                "fieldGroupOrder": 1000,
                "fieldDefaultValue": null,
                "defaultValue": null,
                "processFieldMapping": null,
                "formFieldMapping": null,
                "defaultMapping": null,
                "certificateConfig": null,
                "multiConfig": null,
                "itemListConfig": null,
                "contactConfig": null,
                "riskConfig": null,
                "assessmentSubtypeConfig": null,
                "assessmentExpirationConfig": null,
                "objectSelectorConfig": null,
                "splitAccountingConfig": null,
                "actionConfig": null,
                "linkButtonConfig": null,
                "restrictedToRole": null,
                "displayDocument": false,
                "isReadOnly": false,
                "isHidden": false,
                "hiddenForReadOnly": null,
                "published": true,
                "clearOnHide": false,
                "showRadioBtnControlForChoices": false,
                "isSetterOnly": false,
                "submitOnChange": false,
                "displayInTenantCurrency": null
            },
            {
                "id": "10",
                "name": "<p>Will any personally identifiable data / personal data be collected, handled, stored, destroyed or transferred ?</p>",
                "description": null,
                "placeHolderText": null,
                "helpText": null,
                "fieldName": "q10__p_Will_any_personally_identif",
                "stringRegex": null,
                "type": "string",
                "selection": "single",
                "customFieldType": "single_selection",
                "choices": {
                    "defaultValue": {
                        "value": ""
                    },
                    "defaultValues": [],
                    "choices": [
                        {
                            "value": "Yes"
                        },
                        {
                            "value": "No"
                        }
                    ]
                },
                "visible": null,
                "editable": null,
                "required": null,
                "optional": false,
                "displayIndex": "1.3",
                "fileTypes": null,
                "documents": null,
                "masterDataType": null,
                "masterdataConfig": null,
                "numberConfig": null,
                "dateConfig": null,
                "userListingConfig": null,
                "formDataConfig": null,
                "level": null,
                "extracted": false,
                "reportName": null,
                "fieldGrouping": null,
                "fieldGroupOrder": 1000,
                "fieldDefaultValue": null,
                "defaultValue": null,
                "processFieldMapping": null,
                "formFieldMapping": null,
                "defaultMapping": null,
                "certificateConfig": null,
                "multiConfig": null,
                "itemListConfig": null,
                "contactConfig": null,
                "riskConfig": null,
                "assessmentSubtypeConfig": null,
                "assessmentExpirationConfig": null,
                "objectSelectorConfig": null,
                "splitAccountingConfig": null,
                "actionConfig": null,
                "linkButtonConfig": null,
                "restrictedToRole": null,
                "displayDocument": false,
                "isReadOnly": false,
                "isHidden": false,
                "hiddenForReadOnly": null,
                "published": true,
                "clearOnHide": false,
                "showRadioBtnControlForChoices": false,
                "isSetterOnly": false,
                "submitOnChange": false,
                "displayInTenantCurrency": null
            }
        ]
    },
    "status": "published",
    "formGlobalConditions": null,
    "validationApis": null,
    "creator": {
        "tenantId": null,
        "tenantName": null,
        "userName": "customeradmin+roche_demo@orolabs.ai",
        "userNameCP": null,
        "externalId": null,
        "employeeId": null,
        "name": "Oro Admin",
        "department": null,
        "departmentCode": null,
        "departmentErpId": null,
        "groupIds": null,
        "type": "Tenant",
        "email": null,
        "phone": null,
        "firstName": null,
        "lastName": null,
        "api": false,
        "picture": null,
        "ip": null,
        "impersonator": "harikumaran.babu@orolabs.ai",
        "connectionName": null,
        "procurementAdmin": true,
        "otp": false,
        "admin": false
    },
    "lastPublished": "2024-01-03T09:45:30.192044329Z"
}