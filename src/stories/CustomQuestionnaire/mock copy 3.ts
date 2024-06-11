export const mockConfig = {
	"version": "89",
	"created": "2023-01-10T13:01:12.145218208Z",
	"updated": "2023-01-11T07:12:31.199280697Z",
	"createdBy": null,
	"updatedBy": {
		"tenantId": "foo",
		"tenantName": "Foo Company",
		"userName": "john@foo.com",
		"name": "John Doe",
		"department": null,
		"departmentCode": null,
		"groupIds": null,
		"type": "Tenant",
		"email": "john@foo.com",
		"phone": null,
		"firstName": null,
		"lastName": null,
		"api": false,
		"picture": null,
		"ip": "64.252.98.153",
		"procurementAdmin": true,
		"admin": true,
		"otp": false
	},
	"idGenerator": {
		"id": 29
	},
	"tenantId": "foo",
	"name": "Noopur_test_default_values",
	"title": "Noopur test default values",
	"description": "",
	"visibility": null,
	"customVisibilityConditions": null,
	"formType": null,
	"view": {
		"sections": [{
			"id": "1",
			"title": null,
			"description": null,
			"displayIndex": null,
			"grids": [{
				"id": "2",
				"displayIndex": null,
				"fields": [{
					"id": "3",
					"size": 12,
					"field": {
						"id": "4",
						"name": "<p>q1</p>",
						"description": null,
						"helpText": null,
						"fieldName": "_p_q1__p_",
						"type": "bool",
						"selection": null,
						"customFieldType": "bool",
						"choices": null,
						"visible": null,
						"required": null,
						"optional": true,
						"displayIndex": null,
						"fileTypes": null,
						"documents": null,
						"masterDataType": null,
						"masterdataConfig": null,
						"extracted": false,
						"reportName": null,
						"fieldDefaultValue": null,
						"defaultValue": null,
						"processFieldMapping": null,
						"certificateConfig": null,
						"multiConfig": null,
						"itemListConfig": null,
						"contactConfig": null,
						"restrictedToRole": null,
						"displayDocument": false,
						"isReadOnly": false,
						"isHidden": false,
						"published": true,
						"clearOnHide": false,
						"showRadioBtnControlForChoices": false
					}
				}]
			}, {
				"id": "5",
				"displayIndex": null,
				"fields": [{
					"id": "6",
					"size": 12,
					"field": {
						"id": "7",
						"name": "<p>q2</p>",
						"description": null,
						"helpText": null,
						"fieldName": "_p_q2__p_",
						"type": "string",
						"selection": "single",
						"customFieldType": "multiple_selection",
						"choices": {
							"defaultValue": {
								"value": "opt2"
							},
							"defaultValues": [{
								"value": "opt2"
							}],
							"choices": [{
								"value": "opt1"
							}, {
								"value": "opt2"
							}]
						},
						"visible": {
							"conditionType": "response",
							"customFieldConditions": [{
								"conditionOperator": "and",
								"field": {
									"id": "4",
									"name": "<p>q1</p>",
									"fieldName": "_p_q1__p_"
								},
								"operator": "equal",
								"value": "yes",
								"isMultiple": null
							}],
							"requestConditions": null,
							"globalFormConditions": null,
							"val": null,
							"jsScript": "((form._p_q1__p_ == true))",
							"condition": {
								"@type": "and",
								"name": null,
								"conditions": [{
									"@type": "or",
									"name": null,
									"conditions": [{
										"@type": "field",
										"l": {
											"qrefs": {
												"fname": "_p_q1__p_",
												"type": "bool",
												"array": false
											}
										},
										"o": {
											"@type": "equal"
										},
										"r": {
											"c": "yes",
											"ctype": "bool"
										}
									}]
								}]
							}
						},
						"required": null,
						"optional": true,
						"displayIndex": null,
						"fileTypes": null,
						"documents": null,
						"masterDataType": null,
						"masterdataConfig": null,
						"extracted": false,
						"reportName": null,
						"fieldDefaultValue": null,
						"defaultValue": null,
						"processFieldMapping": null,
						"certificateConfig": null,
						"multiConfig": null,
						"itemListConfig": null,
						"contactConfig": null,
						"restrictedToRole": null,
						"displayDocument": false,
						"isReadOnly": false,
						"isHidden": false,
						"published": true,
						"clearOnHide": false,
						"showRadioBtnControlForChoices": false
					}
				}]
			}, {
				"id": "8",
				"displayIndex": null,
				"fields": [{
					"id": "9",
					"size": 12,
					"field": {
						"id": "10",
						"name": "<p>q3</p>",
						"description": null,
						"helpText": null,
						"fieldName": "_p_q3__p_",
						"type": "string",
						"selection": "single",
						"customFieldType": "multiple_selection",
						"choices": {
							"defaultValue": {
								"value": "optB"
							},
							"defaultValues": [{
								"value": "optB"
							}],
							"choices": [{
								"value": "optA"
							}, {
								"value": "optB"
							}]
						},
						"visible": {
							"conditionType": "response",
							"customFieldConditions": [{
								"conditionOperator": "and",
								"field": {
									"id": "4",
									"name": "<p>q1</p>",
									"fieldName": "_p_q1__p_"
								},
								"operator": "equal",
								"value": "yes",
								"isMultiple": null
							}],
							"requestConditions": null,
							"globalFormConditions": null,
							"val": null,
							"jsScript": "((form._p_q1__p_ == true))",
							"condition": {
								"@type": "and",
								"name": null,
								"conditions": [{
									"@type": "or",
									"name": null,
									"conditions": [{
										"@type": "field",
										"l": {
											"qrefs": {
												"fname": "_p_q1__p_",
												"type": "bool",
												"array": false
											}
										},
										"o": {
											"@type": "equal"
										},
										"r": {
											"c": "yes",
											"ctype": "bool"
										}
									}]
								}]
							}
						},
						"required": null,
						"optional": true,
						"displayIndex": null,
						"fileTypes": null,
						"documents": null,
						"masterDataType": null,
						"masterdataConfig": null,
						"extracted": false,
						"reportName": null,
						"fieldDefaultValue": null,
						"defaultValue": null,
						"processFieldMapping": null,
						"certificateConfig": null,
						"multiConfig": null,
						"itemListConfig": null,
						"contactConfig": null,
						"restrictedToRole": [],
						"displayDocument": false,
						"isReadOnly": false,
						"isHidden": false,
						"published": true,
						"clearOnHide": true,
						"showRadioBtnControlForChoices": false
					}
				}]
			}],
			"visible": null,
			"layout": "twoColumn"
		}, {
			"id": "14",
			"title": null,
			"description": null,
			"displayIndex": null,
			"grids": [{
				"id": "15",
				"displayIndex": null,
				"fields": [{
					"id": "16",
					"size": 12,
					"field": {
						"id": "17",
						"name": "<p>FieldA</p>",
						"description": null,
						"helpText": null,
						"fieldName": "_p_FieldA__p_",
						"type": "bool",
						"selection": null,
						"customFieldType": "bool",
						"choices": null,
						"visible": null,
						"required": null,
						"optional": true,
						"displayIndex": null,
						"fileTypes": null,
						"documents": null,
						"masterDataType": null,
						"masterdataConfig": null,
						"extracted": false,
						"reportName": null,
						"fieldDefaultValue": null,
						"defaultValue": null,
						"processFieldMapping": null,
						"certificateConfig": null,
						"multiConfig": null,
						"itemListConfig": null,
						"contactConfig": null,
						"restrictedToRole": null,
						"displayDocument": false,
						"isReadOnly": false,
						"isHidden": false,
						"published": true,
						"clearOnHide": false,
						"showRadioBtnControlForChoices": false
					}
				}]
			}, {
				"id": "24",
				"displayIndex": null,
				"fields": [{
					"id": "25",
					"size": 12,
					"field": {
						"id": "26",
						"name": "<p>FieldB</p>",
						"description": null,
						"helpText": null,
						"fieldName": "_p_FieldB__p_",
						"type": "idref",
						"selection": null,
						"customFieldType": "masterdata",
						"choices": null,
						"visible": {
							"conditionType": "response",
							"customFieldConditions": [{
								"conditionOperator": "and",
								"field": {
									"id": "17",
									"name": "<p>FieldA</p>",
									"fieldName": "_p_FieldA__p_"
								},
								"operator": "equal",
								"value": "yes",
								"isMultiple": null
							}],
							"requestConditions": null,
							"globalFormConditions": null,
							"val": null,
							"jsScript": "((form._p_FieldA__p_ == true))",
							"condition": {
								"@type": "and",
								"name": null,
								"conditions": [{
									"@type": "or",
									"name": null,
									"conditions": [{
										"@type": "field",
										"l": {
											"qrefs": {
												"fname": "_p_FieldA__p_",
												"type": "bool",
												"array": false
											}
										},
										"o": {
											"@type": "equal"
										},
										"r": {
											"c": "yes",
											"ctype": "bool"
										}
									}]
								}]
							}
						},
						"required": null,
						"optional": true,
						"displayIndex": null,
						"fileTypes": null,
						"documents": null,
						"masterDataType": "Region",
						"masterdataConfig": null,
						"extracted": false,
						"reportName": null,
						"fieldDefaultValue": {
							"booleanVal": null,
							"idRefVal": {
								"id": "19-21-CA",
								"name": "Canada",
								"erpId": ""
							}
						},
						"defaultValue": null,
						"processFieldMapping": {
							"id": "region",
							"name": "Region",
							"erpId": "ProcessFieldMapping__Any__region"
						},
						"certificateConfig": null,
						"multiConfig": null,
						"itemListConfig": null,
						"contactConfig": null,
						"restrictedToRole": null,
						"displayDocument": false,
						"isReadOnly": false,
						"isHidden": false,
						"published": true,
						"clearOnHide": false,
						"showRadioBtnControlForChoices": false
					}
				}]
			}, {
				"id": "27",
				"displayIndex": null,
				"fields": [{
					"id": "28",
					"size": 12,
					"field": {
						"id": "29",
						"name": "<p>FieldC</p>",
						"description": null,
						"helpText": null,
						"fieldName": "_p_FieldC__p_",
						"type": "idref",
						"selection": null,
						"customFieldType": "masterdata",
						"choices": null,
						"visible": {
							"conditionType": "response",
							"customFieldConditions": [{
								"conditionOperator": "and",
								"field": {
									"id": "17",
									"name": "<p>FieldA</p>",
									"fieldName": "_p_FieldA__p_"
								},
								"operator": "equal",
								"value": "no",
								"isMultiple": null
							}],
							"requestConditions": null,
							"globalFormConditions": null,
							"val": null,
							"jsScript": "((form._p_FieldA__p_ == false))",
							"condition": {
								"@type": "and",
								"name": null,
								"conditions": [{
									"@type": "or",
									"name": null,
									"conditions": [{
										"@type": "field",
										"l": {
											"qrefs": {
												"fname": "_p_FieldA__p_",
												"type": "bool",
												"array": false
											}
										},
										"o": {
											"@type": "equal"
										},
										"r": {
											"c": "no",
											"ctype": "bool"
										}
									}]
								}]
							}
						},
						"required": null,
						"optional": true,
						"displayIndex": null,
						"fileTypes": null,
						"documents": null,
						"masterDataType": "Region",
						"masterdataConfig": null,
						"extracted": false,
						"reportName": null,
						"fieldDefaultValue": {
							"booleanVal": null,
							"idRefVal": {
								"id": "19-21-US",
								"name": "United States",
								"erpId": ""
							}
						},
						"defaultValue": null,
						"processFieldMapping": {
							"id": "region",
							"name": "Region",
							"erpId": "ProcessFieldMapping__Any__region"
						},
						"certificateConfig": null,
						"multiConfig": null,
						"itemListConfig": null,
						"contactConfig": null,
						"restrictedToRole": null,
						"displayDocument": false,
						"isReadOnly": false,
						"isHidden": false,
						"published": true,
						"clearOnHide": false,
						"showRadioBtnControlForChoices": false
					}
				}]
			}],
			"visible": null,
			"layout": "twoColumn"
		}]
	},
	"model": {
		"fields": [{
			"id": "4",
			"name": "<p>q1</p>",
			"description": null,
			"helpText": null,
			"fieldName": "_p_q1__p_",
			"type": "bool",
			"selection": null,
			"customFieldType": "bool",
			"choices": null,
			"visible": null,
			"required": null,
			"optional": true,
			"displayIndex": null,
			"fileTypes": null,
			"documents": null,
			"masterDataType": null,
			"masterdataConfig": null,
			"extracted": false,
			"reportName": null,
			"fieldDefaultValue": null,
			"defaultValue": null,
			"processFieldMapping": null,
			"certificateConfig": null,
			"multiConfig": null,
			"itemListConfig": null,
			"contactConfig": null,
			"restrictedToRole": null,
			"displayDocument": false,
			"isReadOnly": false,
			"isHidden": false,
			"published": true,
			"clearOnHide": false,
			"showRadioBtnControlForChoices": false
		}, {
			"id": "7",
			"name": "<p>q2</p>",
			"description": null,
			"helpText": null,
			"fieldName": "_p_q2__p_",
			"type": "string",
			"selection": "single",
			"customFieldType": "single_selection",
			"choices": {
				"defaultValue": {
					"value": ""
				},
				"defaultValues": [],
				"choices": [{
					"value": "opt1"
				}, {
					"value": "opt2"
				}]
			},
			"visible": {
				"conditionType": "response",
				"customFieldConditions": [{
					"conditionOperator": "and",
					"field": {
						"id": "4",
						"name": "<p>q1</p>",
						"fieldName": "_p_q1__p_"
					},
					"operator": "equal",
					"value": "yes",
					"isMultiple": null
				}],
				"requestConditions": null,
				"globalFormConditions": null,
				"val": null,
				"jsScript": null,
				"condition": null
			},
			"required": null,
			"optional": true,
			"displayIndex": null,
			"fileTypes": null,
			"documents": null,
			"masterDataType": null,
			"masterdataConfig": null,
			"extracted": false,
			"reportName": null,
			"fieldDefaultValue": null,
			"defaultValue": null,
			"processFieldMapping": null,
			"certificateConfig": null,
			"multiConfig": null,
			"itemListConfig": null,
			"contactConfig": null,
			"restrictedToRole": null,
			"displayDocument": false,
			"isReadOnly": false,
			"isHidden": false,
			"published": true,
			"clearOnHide": false,
			"showRadioBtnControlForChoices": false
		}, {
			"id": "17",
			"name": "<p>FieldA</p>",
			"description": null,
			"helpText": null,
			"fieldName": "_p_FieldA__p_",
			"type": "bool",
			"selection": null,
			"customFieldType": "bool",
			"choices": null,
			"visible": null,
			"required": null,
			"optional": true,
			"displayIndex": null,
			"fileTypes": null,
			"documents": null,
			"masterDataType": null,
			"masterdataConfig": null,
			"extracted": false,
			"reportName": null,
			"fieldDefaultValue": null,
			"defaultValue": null,
			"processFieldMapping": null,
			"certificateConfig": null,
			"multiConfig": null,
			"itemListConfig": null,
			"contactConfig": null,
			"restrictedToRole": null,
			"displayDocument": false,
			"isReadOnly": false,
			"isHidden": false,
			"published": true,
			"clearOnHide": false,
			"showRadioBtnControlForChoices": false
		}, {
			"id": "10",
			"name": "<p>q3</p>",
			"description": null,
			"helpText": null,
			"fieldName": "_p_q3__p_",
			"type": "string",
			"selection": "single",
			"customFieldType": "single_selection",
			"choices": {
				"defaultValue": {
					"value": "optB"
				},
				"defaultValues": [],
				"choices": [{
					"value": "optA"
				}, {
					"value": "optB"
				}]
			},
			"visible": {
				"conditionType": "response",
				"customFieldConditions": [{
					"conditionOperator": "and",
					"field": {
						"id": "4",
						"name": "<p>q1</p>",
						"fieldName": "_p_q1__p_"
					},
					"operator": "equal",
					"value": "yes",
					"isMultiple": null
				}],
				"requestConditions": null,
				"globalFormConditions": null,
				"val": null,
				"jsScript": null,
				"condition": null
			},
			"required": null,
			"optional": true,
			"displayIndex": null,
			"fileTypes": null,
			"documents": null,
			"masterDataType": null,
			"masterdataConfig": null,
			"extracted": false,
			"reportName": null,
			"fieldDefaultValue": null,
			"defaultValue": null,
			"processFieldMapping": null,
			"certificateConfig": null,
			"multiConfig": null,
			"itemListConfig": null,
			"contactConfig": null,
			"restrictedToRole": [],
			"displayDocument": false,
			"isReadOnly": false,
			"isHidden": false,
			"published": true,
			"clearOnHide": false,
			"showRadioBtnControlForChoices": false
		}, {
			"id": "26",
			"name": "<p>FieldB</p>",
			"description": null,
			"helpText": null,
			"fieldName": "_p_FieldB__p_",
			"type": "idref",
			"selection": null,
			"customFieldType": "masterdata",
			"choices": null,
			"visible": {
				"conditionType": "response",
				"customFieldConditions": [{
					"conditionOperator": "and",
					"field": {
						"id": "17",
						"name": "<p>FieldA</p>",
						"fieldName": "_p_FieldA__p_"
					},
					"operator": "equal",
					"value": "yes",
					"isMultiple": null
				}],
				"requestConditions": null,
				"globalFormConditions": null,
				"val": null,
				"jsScript": null,
				"condition": null
			},
			"required": null,
			"optional": true,
			"displayIndex": null,
			"fileTypes": null,
			"documents": null,
			"masterDataType": "Region",
			"masterdataConfig": null,
			"extracted": false,
			"reportName": null,
			"fieldDefaultValue": {
				"booleanVal": null,
				"idRefVal": {
					"id": "19-21-CA",
					"name": "Canada",
					"erpId": ""
				}
			},
			"defaultValue": null,
			"processFieldMapping": {
				"id": "region",
				"name": "Region",
				"erpId": "ProcessFieldMapping__Any__region"
			},
			"certificateConfig": null,
			"multiConfig": null,
			"itemListConfig": null,
			"contactConfig": null,
			"restrictedToRole": null,
			"displayDocument": false,
			"isReadOnly": false,
			"isHidden": false,
			"published": true,
			"clearOnHide": false,
			"showRadioBtnControlForChoices": false
		}, {
			"id": "29",
			"name": "<p>FieldC</p>",
			"description": null,
			"helpText": null,
			"fieldName": "_p_FieldC__p_",
			"type": "idref",
			"selection": null,
			"customFieldType": "masterdata",
			"choices": null,
			"visible": {
				"conditionType": "response",
				"customFieldConditions": [{
					"conditionOperator": "and",
					"field": {
						"id": "17",
						"name": "<p>FieldA</p>",
						"fieldName": "_p_FieldA__p_"
					},
					"operator": "equal",
					"value": "no",
					"isMultiple": null
				}],
				"requestConditions": null,
				"globalFormConditions": null,
				"val": null,
				"jsScript": null,
				"condition": null
			},
			"required": null,
			"optional": true,
			"displayIndex": null,
			"fileTypes": null,
			"documents": null,
			"masterDataType": "Region",
			"masterdataConfig": null,
			"extracted": false,
			"reportName": null,
			"fieldDefaultValue": {
				"booleanVal": null,
				"idRefVal": {
					"id": "19-21-US",
					"name": "United States",
					"erpId": ""
				}
			},
			"defaultValue": null,
			"processFieldMapping": {
				"id": "region",
				"name": "Region",
				"erpId": "ProcessFieldMapping__Any__region"
			},
			"certificateConfig": null,
			"multiConfig": null,
			"itemListConfig": null,
			"contactConfig": null,
			"restrictedToRole": null,
			"displayDocument": false,
			"isReadOnly": false,
			"isHidden": false,
			"published": true,
			"clearOnHide": false,
			"showRadioBtnControlForChoices": false
		}]
	},
	"status": "published",
	"formGlobalConditions": null,
	"creator": {
		"tenantId": "foo",
		"tenantName": "Foo Company",
		"userName": "john@foo.com",
		"name": "John Doe",
		"department": null,
		"departmentCode": null,
		"groupIds": null,
		"type": "Tenant",
		"email": "john@foo.com",
		"phone": null,
		"firstName": null,
		"lastName": null,
		"api": false,
		"picture": null,
		"ip": "64.252.98.180",
		"procurementAdmin": true,
		"admin": true,
		"otp": false
	},
	"acl": {
		"users": [{
			"tenantId": "foo",
			"tenantName": "Foo Company",
			"userName": "john@foo.com",
			"name": "John Doe",
			"department": null,
			"departmentCode": null,
			"groupIds": null,
			"type": "Tenant",
			"email": "john@foo.com",
			"phone": null,
			"firstName": null,
			"lastName": null,
			"api": false,
			"picture": null,
			"ip": "64.252.98.180",
			"procurementAdmin": true,
			"admin": true,
			"otp": false
		}],
		"groups": [],
		"workstream": null,
		"programs": null,
		"departments": null,
		"open": false
	}
}