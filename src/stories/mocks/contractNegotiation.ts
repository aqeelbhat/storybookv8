
export const mockContractTypeOptions = [{
    customData: {erpId: null, code: 'annual'},
    displayName: "Annual",
    id: "_ContractType__null__annual",
    path: "annual",
    selectable: true,
    selected: false
}, {
    customData: {erpId: null, code: 'monthly'},
    displayName: "Month-to-month",
    id: "_ContractType__null__monthly",
    path: "monthly",
    selectable: true,
    selected: false
}, {
    customData: {erpId: null, code: 'fixed'},
    displayName: "One-time",
    id: "_ContractType__null__fixed",
    path: "fixed",
    selectable: true,
    selected: false
},{
  customData: {erpId: null, code: 'annualSubscription'},
  displayName: "Annual Subscription",
  id: "_ContractType__null__annualSubscription",
  path: "annualSubscription",
  selectable: true,
  selected: false
}, {
  customData: {erpId: null, code: 'monthlySubscription'},
  displayName: "Monthly Subscription",
  id: "_ContractType__null__monthlySubscription",
  path: "monthlySubscription",
  selectable: true,
  selected: false
}]

export const mockAnnualSunscriptionContractFields = [
  {
    "id": "contractValues",
    "name": "Contract values",
    "required": false,
    "section": true,
    "children": [
      {
        "id": "proposalDescription",
        "name": "Proposal description",
        "required": true,
        "section": false,
        "visible": true,
        "order": 1
      },
      {
        "id": "duration",
        "name": "Minimum Committed Duration",
        "required": true,
        "section": false,
        "visible": true,
        "order": 2
      },
      {
        "id": "fixedSpend",
        "name": "Total Subscription Fee (committed)",
        "required": false,
        "section": false,
        "visible": true,
        "order": 3
      },
      {
        "id": "variableSpend",
        "name": "Total incremental estimated spend",
        "required": false,
        "section": false,
        "visible": true,
        "order": 6
      },
      {
        "id": "oneTimeCost",
        "name": "One-time fee (if any)",
        "required": false,
        "section": false,
        "visible": true,
        "order": 4
      },
      {
        "id": "totalValue",
        "name": "Minimum Committed spend",
        "required": true,
        "section": false,
        "visible": true,
        "order": 5,
        "formula": "formData.fixedSpend?.amount + formData?.oneTimeCost?.amount"
      },
      {
        "id": "totalEstimatedSpend",
        "name": "Total estimated spend (PO value)",
        "required": true,
        "section": false,
        "visible": true,
        "order": 7,
        "formula": "formData.totalValue?.amount + formData?.oneTimeCost?.amount",
      },
      {
        "id": "negotiatedSavings",
        "name": "Negotiated savings",
        "required": false,
        "section": false,
        "visible": true,
        "order": 8
      },
      {
        "id": "yearlySplits",
        "name": "Yearly Splits",
        "required": false,
        "section": true,
        "visible": true,
        "order": 9,
        "children": [
          {
            "id": "year",
            "name": "Year",
            "required": false,
            "section": false,
            "visible": true,
            "order": 1
          },
          {
            "id": "annualSpend",
            "name": "Total spend",
            "required": false,
            "section": false,
            "visible": true,
            "order": 2
          },
          {
            "id": "fixedSpend",
            "name": "Subscription fee",
            "required": false,
            "section": false,
            "visible": true,
            "order": 3
          },
          {
            "id": "variableSpend",
            "name": "Variable spend",
            "required": false,
            "section": false,
            "visible": true,
            "order": 4
          }
        ]
      }
    ]
  },
  {
    "id": "terms",
    "name": "Terms",
    "required": false,
    "section": true,
    "visible": true,
    "children": [
      {
        "id": "contractPeriod",
        "name": "Contract period",
        "required": false,
        "section": true,
        "visible": true,
        "children": [
          {
            "id": "startDate",
            "name": "Start date",
            "required": true,
            "section": false,
            "visible": true
          },
          {
            "id": "endDate",
            "name": "End date",
            "required": true,
            "section": false,
            "visible": true
          }
        ]
      },
      {
        "id": "paymentTerms",
        "name": "Payment terms",
        "required": false,
        "section": false,
        "visible": true
      },
      {
        "id": "renewalAnnualValue",
        "name": "Renewal annual contract value (flat renewal)",
        "required": false,
        "section": false,
        "visible": true
      },
      {
        "id": "autoRenew",
        "name": "Auto renewal",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "autoRenewNoticePeriod",
            "name": "Please provide the notice period (in days) to stop Auto renewal",
            "required": false,
            "section": false,
            "visible": true,
          }
        ]
      },
      {
        "id": "includesPriceCap",
        "name": "Renewal price increase cap",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "priceCapIncrease",
            "name": "% increase on Renewal",
            "required": false,
            "section": false,
            "visible": true
          }
        ]
      },
      {
        "id": "includesCancellation",
        "name": "Includes cancellation policy",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "cancellationDeadline",
            "name": "Cancellation deadline",
            "required": false,
            "section": false,
            "visible": true
          }
        ]
      },
      {
        "id": "includesOptOut",
        "name": "Includes an opt-out date",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "optOutDeadline",
            "name": "Opt-out date",
            "required": false,
            "section": false,
            "visible": true
          }
        ]
      },
      {
        "id": "billingCycle",
        "name": "Billing cycle",
        "required": false,
        "section": false,
        "visible": true
      }
    ]
  }
]

export const mockAnnualContractFields = [
  {
    "id": "contractValues",
    "name": "Contract values",
    "required": false,
    "section": true,
    "order": 1,
    "visible": true,
    "formConfigs": [
      {
        "formId": "OroContractNegotiationForm",
        "required": true,
        "visible": true
      },
      {
        "formId": "OroContractFinalisationForm",
        "required": true,
        "visible": true
      }
    ],
    "children": [
      {
        "id": "proposalDescription",
        "name": "Proposal description",
        "required": true,
        "section": false,
        "order": 1,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "duration",
        "name": "Contract duration (months)",
        "required": true,
        "section": false,
        "order": 2,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "fixedSpend",
        "name": "Fixed spend",
        "required": true,
        "section": false,
        "order": 3,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "variableSpend",
        "name": "Est. variable spend (if any)",
        "required": false,
        "section": false,
        "order": 4,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "recurringSpend",
        "name": "Total annual recurring spend",
        "required": false,
        "section": false,
        "order": 5,
        "visible": true,
        "formula": "formData.fixedSpend?.amount + formData.variableSpend?.amount",
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "oneTimeCost",
        "name": "One-time cost (if any)",
        "required": false,
        "section": false,
        "order": 6,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "totalValue",
        "name": "Total Contract Value",
        "required": true,
        "section": false,
        "order": 7,
        "visible": true,
        "formula": "formData.fixedSpend?.amount + formData.oneTimeCost?.amount",
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "negotiatedSavings",
        "name": "Negotiated savings",
        "required": false,
        "section": false,
        "order": 8,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "yearlySplits",
        "name": "Yearly Splits",
        "required": false,
        "section": true,
        "order": 9,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "year",
            "name": "Year",
            "required": true,
            "section": false,
            "order": 1,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "totalValue",
            "name": "Total spend",
            "required": true,
            "section": false,
            "order": 2,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "terms",
    "name": "Terms",
    "required": false,
    "section": true,
    "order": 2,
    "visible": true,
    "formConfigs": [
      {
        "formId": "OroContractNegotiationForm",
        "required": true,
        "visible": true
      },
      {
        "formId": "OroContractFinalisationForm",
        "required": true,
        "visible": true
      }
    ],
    "children": [
      {
        "id": "contractPeriod",
        "name": "Contract period",
        "required": true,
        "section": true,
        "order": 1,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "startDate",
            "name": "Start date",
            "required": false,
            "section": false,
            "order": 1,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "endDate",
            "name": "End date",
            "required": false,
            "section": false,
            "order": 2,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "paymentTerms",
        "name": "Payment terms",
        "required": true,
        "section": false,
        "order": 2,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      },
      {
        "id": "renewalAnnualValue",
        "name": "Renewal annual contract value (flat renewal)",
        "required": false,
        "section": false,
        "order": 3,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": false,
            "visible": true
          }
        ]
      },
      {
        "id": "autoRenew",
        "name": "Auto renewal",
        "required": true,
        "section": false,
        "order": 4,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "autoRenewNoticePeriod",
            "name": "Please provide the notice period (in days) to stop Auto renewal",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "includesPriceCap",
        "name": "Renewal price increase cap",
        "required": false,
        "section": false,
        "order": 5,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": false,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "priceCapIncrease",
            "name": "% increase on Renewal",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "includesCancellation",
        "name": "Includes cancellation policy",
        "required": true,
        "section": false,
        "order": 6,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": false,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "cancellationDeadline",
            "name": "Cancellation deadline",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "includesOptOut",
        "name": "Includes an opt-out date",
        "required": false,
        "section": false,
        "order": 7,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": false,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "optOutDeadline",
            "name": "Opt-out date",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "includesLateFees",
        "name": "Late fees",
        "required": true,
        "section": false,
        "order": 4,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "lateFeeDays",
            "name": "Please provide the late fees period (in days)",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "lateFeesPercentage",
            "name": "Late fees percentage (%)",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "terminationOfConvenience",
        "name": "Termination of convenience",
        "required": false,
        "section": false,
        "order": 4,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": false,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "terminationOfConvenienceDays",
            "name": "Please provide the termination period (in days)",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "liabilityLimitation",
        "name": "Liability Limitation",
        "required": true,
        "section": false,
        "order": 4,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "liabilityLimitationMultiplier",
            "name": "Liablitiy limitation multiplier",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "liabilityLimitationCap",
            "name": "Liablity limit",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "confidentialityClause",
        "name": "Confidentiality Clause",
        "required": false,
        "section": false,
        "order": 4,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": false,
            "visible": true
          }
        ],
        "children": []
      },
      {
        "id": "billingCycle",
        "name": "Billing cycle",
        "required": false,
        "section": false,
        "order": 8,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": false,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ]
      }
    ]
  }
]

export const mockMonthlyContractFields = [
  {
    "id": "contractValues",
    "name": "Contract values",
    "required": false,
    "section": true,
    "visible": true,
    "children": [
      {
        "id": "proposalDescription",
        "name": "Proposal description",
        "required": true,
        "visible": true,
        "section": false
      },
      {
        "id": "duration",
        "name": "Contract duration (months)",
        "required": true,
        "visible": true,
        "section": false
      },
      {
        "id": "fixedSpend",
        "name": "Fixed spend",
        "required": false,
        "visible": true,
        "section": false
      },
      {
        "id": "variableSpend",
        "name": "Est. variable spend (if any)",
        "required": false,
        "visible": true,
        "section": false
      },
      {
        "id": "recurringSpend",
        "name": "Total monthly recurring spend",
        "required": false,
        "section": false,
        "visible": true,
        "formula": "formData.fixedSpend?.amount + formData.variableSpend?.amount"
      },
      {
        "id": "oneTimeCost",
        "name": "One-time cost (if any)",
        "required": false,
        "visible": true,
        "section": false
      },
      {
        "id": "totalValue",
        "name": "Total Contract Value",
        "required": true,
        "visible": true,
        "section": false
      },
      {
        "id": "negotiatedSavings",
        "name": "Negotiated savings",
        "required": false,
        "visible": true,
        "section": false
      },
      {
        "id": "yearlySplits",
        "name": "Yearly Splits",
        "required": false,
        "section": true,
        "visible": true,
        "children": [
          {
            "id": "year",
            "name": "Year",
            "required": false,
            "visible": true,
            "section": false
          },
          {
            "id": "totalSpend",
            "name": "Total spend",
            "required": false,
            "visible": true,
            "section": false
          }
        ]
      }
    ]
  },
  {
    "id": "terms",
    "name": "Terms",
    "required": false,
    "section": true,
    "visible": true,
    "children": [
      {
        "id": "contractPeriod",
        "name": "Contract period",
        "required": false,
        "section": true,
        "visible": true,
        "children": [
          {
            "id": "startDate",
            "name": "Start date",
            "required": true,
            "visible": true,
            "section": false
          },
          {
            "id": "endDate",
            "name": "End date",
            "required": true,
            "visible": true,
            "section": false
          }
        ]
      },
      {
        "id": "paymentTerms",
        "name": "Payment terms",
        "required": false,
        "visible": true,
        "section": false
      },
      {
        "id": "renewalAnnualValue",
        "name": "Renewal annual contract value (flat renewal)",
        "required": false,
        "visible": true,
        "section": false
      },
      {
        "id": "autoRenew",
        "name": "Auto renewal",
        "required": false,
        "visible": true,
        "section": false,
        "children": [
          {
            "id": "autoRenewNoticePeriod",
            "name": "Please provide the notice period (in days) to stop Auto renewal",
            "required": false,
            "visible": true,
            "section": false
          }
        ]
      },
      {
        "id": "includesPriceCap",
        "name": "Renewal price increase cap",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "priceCapIncrease",
            "name": "% increase on Renewal",
            "required": false,
            "visible": true,
            "section": false
          }
        ]
      },
      {
        "id": "includesCancellation",
        "name": "Includes cancellation policy",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "cancellationDeadline",
            "name": "Cancellation deadline",
            "required": false,
            "visible": true,
            "section": false
          }
        ]
      },
      {
        "id": "includesOptOut",
        "name": "Includes an opt-out date",
        "required": false,
        "section": false,
        "visible": true,
        "children": [
          {
            "id": "optOutDeadline",
            "name": "Opt-out date",
            "required": false,
            "visible": true,
            "section": false
          }
        ]
      },
      {
        "id": "billingCycle",
        "name": "Billing cycle",
        "required": false,
        "visible": true,
        "section": false
      }
    ]
  }
]

export const mockFixedContractFields = [
  {
    "id": "contractValues",
    "name": "Contract values",
    "required": false,
    "section": true,
    "children": [
      {
        "id": "proposalDescription",
        "name": "Proposal description",
        "required": true,
        "section": false
      },
      {
        "id": "duration",
        "name": "Contract duration (months)",
        "required": true,
        "section": false
      },
      {
        "id": "variableSpend",
        "name": "Variable spend (if any)",
        "required": false,
        "section": false
      },
      {
        "id": "fixedSpend",
        "name": "Fixed fee",
        "required": false,
        "section": false
      },
      {
        "id": "totalValue",
        "name": "Total Contract Value",
        "required": true,
        "section": false
      },
      {
        "id": "negotiatedSavings",
        "name": "Negotiated savings",
        "required": false,
        "section": false
      },
      {
        "id": "yearlySplits",
        "name": "Yearly Splits",
        "required": false,
        "section": true,
        "children": [
          {
            "id": "year",
            "name": "Year",
            "required": false,
            "section": false
          },
          {
            "id": "totalSpend",
            "name": "Total spend",
            "required": false,
            "section": false
          }
        ]
      }
    ]
  },
  {
    "id": "terms",
    "name": "Terms",
    "required": false,
    "section": true,
    "children": [
      {
        "id": "contractPeriod",
        "name": "Contract period",
        "required": false,
        "section": true,
        "children": [
          {
            "id": "startDate",
            "name": "Start date",
            "required": true,
            "section": false
          },
          {
            "id": "endDate",
            "name": "End date",
            "required": true,
            "section": false
          }
        ]
      },
      {
        "id": "paymentTerms",
        "name": "Payment terms",
        "required": false,
        "section": false
      },
      {
        "id": "includesCancellation",
        "name": "Includes cancellation policy",
        "required": false,
        "section": false
      },
      {
        "id": "cancellationDeadline",
        "name": "Cancellation deadline",
        "required": false,
        "section": false
      },
      {
        "id": "includesOptOut",
        "name": "Includes an opt-out date",
        "required": false,
        "section": false
      },
      {
        "id": "optOutDeadline",
        "name": "Opt-out date",
        "required": false,
        "section": false
      },
      {
        "id": "billingCycle",
        "name": "Billing cycle",
        "required": false,
        "section": false
      }
    ]
  }
]

export const mockExistingContracts = [
  {
    "id": "250714683535993182",
    "contractId": "C-278",
    "name": "Figma",
    "description": "",
    "title": "",
    "requester": {
      "name": "John  Doe",
      "userName": "john@foo.com",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "foo",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": ""
    },
    "businessOwners": [
      {
        "name": "John  Doe",
        "userName": "john@foo.com",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "negotiators": [
      {
        "name": "John Doe",
        "userName": "john@foo.com",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "status": "inApproval",
    "runtimeStatus": "inApproval",
    "contractType": {
      "id": "fixed",
      "name": "One-time",
      "erpId": "",
      "refId": null
    },
    "quantity": "",
    "parentContract": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "normalizedVendor": {
      "id": "89113807414099968",
      "vendorRecordId": null,
      "name": "Apple",
      "countryCode": "US",
      "legalEntityId": "88868992675233957",
      "legalEntityLogo": {
        "metadata": [
          {
            "path": "oro/images/small/88868992675233957.png",
            "height": 100,
            "width": 100
          },
          {
            "path": "oro/images/large/88868992675233957.png",
            "height": 200,
            "width": 200
          }
        ]
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
        "email": "",
        "firstName": "",
        "id": "",
        "lastName": "",
        "phone": "",
        "role": "",
        "title": "",
        "fullName": "",
        "imageUrl": "",
        "emailVerified": false,
        "phoneVerified": false
      },
      "selectedVendorRecord": {
        "id": "250714493063924425",
        "vendorId": null,
        "enabled": false,
        "paymentTerm": {
          "id": "4",
          "name": "Due on receipt",
          "erpId": "4"
        }
      }
    },
    "vendor": {
      "id": "250714493063924425",
      "vendorId": null,
      "enabled": false,
      "paymentTerm": {
        "id": "4",
        "name": "Due on receipt",
        "erpId": "4"
      }
    },
    "selectedProduct": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "products": [],
    "engagement": {
      "id": "250713793327510104",
      "name": "Test Contract Form",
      "erpId": null,
      "refId": "A2024"
    },
    "spendCategory": {
      "id": "50",
      "name": "Facilities",
      "erpId": "",
      "refId": null
    },
    "startDate": "2022-11-01",
    "endDate": "2023-10-31",
    "duration": 12,
    "negotiationStarted": "2022-11-29T13:33:10.318806098Z",
    "negotiationCompleted": "2022-11-29T13:55:50.440835890Z",
    "approved": "",
    "signed": "",
    "currency": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "recurringSpendMoney": {
      "amount": 1000,
      "currency": "USD"
    },
    "fixedSpendMoney": {
      "amount": 500,
      "currency": "USD"
    },
    "variableSpendMoney": {
      "amount": 500,
      "currency": "USD"
    },
    "oneTimeCostMoney": {
      "amount": 0,
      "currency": ""
    },
    "totalValueMoney": {
      "amount": 1200,
      "currency": "USD"
    },
    "negotiatedSavingsMoney": {
      "amount": 800,
      "currency": "USD"
    },
    "savingsLink": "",
    "yearlySplits": [],
    "revisions": [
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1500,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 400,
          "currency": "USD"
        },
        "yearlySplits": []
      },
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1500,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 500,
          "currency": "USD"
        },
        "yearlySplits": []
      },
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1200,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 800,
          "currency": "USD"
        },
        "yearlySplits": []
      }
    ],
    "sensitive": false,
    "autoRenew": true,
    "autoRenewNoticePeriod": 3,
    "autoRenewDate": "2023-10-28",
    "includesCancellation": true,
    "cancellationDeadline": "2022-12-31",
    "paymentTerms": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "departments": [
      {
        "id": "IT",
        "name": "IT",
        "erpId": "",
        "refId": null
      }
    ],
    "companyEntities": [
      {
        "id": "HH",
        "name": "Honeycomb Holdings Inc.",
        "erpId": "3",
        "refId": null
      }
    ],
    "notes": [],
    "created": "2022-11-29T13:33:10.384291315Z",
    "updated": "2022-11-29T13:55:50.440963088Z",
    "signatories": [
      {
        "name": "MKT-user LR",
        "userName": "MKT-user-test@orolabs.ai",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      },
      {
        "name": "Yuan Tung",
        "userName": "yuan.tung@orolabs.ai",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "billingCycle": "On delivery"
  },
  {
    "id": "250714683535993183",
    "contractId": "C-279",
    "name": "Apple",
    "description": "",
    "title": "",
    "requester": {
      "name": "John wick",
      "userName": "john@foo.com",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "foo",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": ""
    },
    "businessOwners": [
      {
        "name": "John Wick",
        "userName": "john@foo.com",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "negotiators": [
      {
        "name": "Bane",
        "userName": "john@foo.com",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "status": "inApproval",
    "runtimeStatus": "inApproval",
    "contractType": {
      "id": "annual",
      "name": "Annual",
      "erpId": "",
      "refId": null
    },
    "quantity": "",
    "parentContract": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "normalizedVendor": {
      "id": "89113807414099968",
      "vendorRecordId": null,
      "name": "Apple",
      "countryCode": "US",
      "legalEntityId": "88868992675233957",
      "legalEntityLogo": {
        "metadata": [
          {
            "path": "oro/images/small/88868992675233957.png",
            "height": 100,
            "width": 100
          },
          {
            "path": "oro/images/large/88868992675233957.png",
            "height": 200,
            "width": 200
          }
        ]
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
        "email": "",
        "firstName": "",
        "id": "",
        "lastName": "",
        "phone": "",
        "role": "",
        "title": "",
        "fullName": "",
        "imageUrl": "",
        "emailVerified": false,
        "phoneVerified": false
      },
      "selectedVendorRecord": {
        "id": "250714493063924425",
        "vendorId": null,
        "enabled": false,
        "paymentTerm": {
          "id": "4",
          "name": "Due on receipt",
          "erpId": "4"
        }
      }
    },
    "vendor": {
      "id": "250714493063924425",
      "vendorId": null,
      "enabled": false,
      "paymentTerm": {
        "id": "4",
        "name": "Due on receipt",
        "erpId": "4"
      }
    },
    "selectedProduct": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "products": [],
    "engagement": {
      "id": "250713793327510104",
      "name": "Test Contract Form",
      "erpId": null,
      "refId": "A2024"
    },
    "spendCategory": {
      "id": "50",
      "name": "Facilities",
      "erpId": "",
      "refId": null
    },
    "startDate": "2022-11-01",
    "endDate": "2023-10-31",
    "duration": 12,
    "negotiationStarted": "2022-11-29T13:33:10.318806098Z",
    "negotiationCompleted": "2022-11-29T13:55:50.440835890Z",
    "approved": "",
    "signed": "",
    "currency": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "recurringSpendMoney": {
      "amount": 1000,
      "currency": "USD"
    },
    "fixedSpendMoney": {
      "amount": 500,
      "currency": "USD"
    },
    "variableSpendMoney": {
      "amount": 500,
      "currency": "USD"
    },
    "oneTimeCostMoney": {
      "amount": 0,
      "currency": ""
    },
    "totalValueMoney": {
      "amount": 2500,
      "currency": "USD"
    },
    "negotiatedSavingsMoney": {
      "amount": 800,
      "currency": "USD"
    },
    "savingsLink": "",
    "yearlySplits": [],
    "revisions": [
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1500,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 400,
          "currency": "USD"
        },
        "yearlySplits": []
      },
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1500,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 500,
          "currency": "USD"
        },
        "yearlySplits": []
      },
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1200,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 800,
          "currency": "USD"
        },
        "yearlySplits": []
      }
    ],
    "sensitive": false,
    "autoRenew": true,
    "autoRenewNoticePeriod": 3,
    "autoRenewDate": "2023-10-02",
    "includesCancellation": true,
    "cancellationDeadline": "2022-12-31",
    "paymentTerms": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "departments": [
      {
        "id": "IT",
        "name": "IT",
        "erpId": "",
        "refId": null
      }
    ],
    "companyEntities": [
      {
        "id": "HH",
        "name": "Honeycomb Holdings Inc.",
        "erpId": "3",
        "refId": null
      }
    ],
    "notes": [],
    "created": "2022-11-29T13:33:10.384291315Z",
    "updated": "2022-11-29T13:55:50.440963088Z",
    "signatories": [
      {
        "name": "MKT-user LR",
        "userName": "MKT-user-test@orolabs.ai",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      },
      {
        "name": "Yuan Tung",
        "userName": "yuan.tung@orolabs.ai",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "billingCycle": "On delivery"
  },
  {
    "id": "250714683535993182",
    "contractId": "C-280",
    "name": "Microsoft",
    "description": "",
    "title": "",
    "requester": {
      "name": "John  Doe",
      "userName": "john@foo.com",
      "api": false,
      "groupIds": [],
      "selected": false,
      "tenantId": "foo",
      "department": "",
      "picture": "",
      "firstName": "",
      "lastName": ""
    },
    "businessOwners": [
      {
        "name": "John  Doe",
        "userName": "john@foo.com",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "negotiators": [
      {
        "name": "John Doe",
        "userName": "john@foo.com",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "status": "inApproval",
    "runtimeStatus": "inApproval",
    "contractType": {
      "id": "fixed",
      "name": "One-time",
      "erpId": "",
      "refId": null
    },
    "quantity": "",
    "parentContract": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "normalizedVendor": {
      "id": "89113807414099968",
      "vendorRecordId": null,
      "name": "Apple",
      "countryCode": "US",
      "legalEntityId": "88868992675233957",
      "legalEntityLogo": {
        "metadata": [
          {
            "path": "oro/images/small/88868992675233957.png",
            "height": 100,
            "width": 100
          },
          {
            "path": "oro/images/large/88868992675233957.png",
            "height": 200,
            "width": 200
          }
        ]
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
        "email": "",
        "firstName": "",
        "id": "",
        "lastName": "",
        "phone": "",
        "role": "",
        "title": "",
        "fullName": "",
        "imageUrl": "",
        "emailVerified": false,
        "phoneVerified": false
      },
      "selectedVendorRecord": {
        "id": "250714493063924425",
        "vendorId": null,
        "enabled": false,
        "paymentTerm": {
          "id": "4",
          "name": "Due on receipt",
          "erpId": "4"
        }
      }
    },
    "vendor": {
      "id": "250714493063924425",
      "vendorId": null,
      "enabled": false,
      "paymentTerm": {
        "id": "4",
        "name": "Due on receipt",
        "erpId": "4"
      }
    },
    "selectedProduct": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "products": [],
    "engagement": {
      "id": "250713793327510104",
      "name": "Test Contract Form",
      "erpId": null,
      "refId": "A2024"
    },
    "spendCategory": {
      "id": "50",
      "name": "Facilities",
      "erpId": "",
      "refId": null
    },
    "startDate": "2022-11-01",
    "endDate": "2023-10-31",
    "duration": 12,
    "negotiationStarted": "2022-11-29T13:33:10.318806098Z",
    "negotiationCompleted": "2022-11-29T13:55:50.440835890Z",
    "approved": "",
    "signed": "",
    "currency": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "recurringSpendMoney": {
      "amount": 1000,
      "currency": "USD"
    },
    "fixedSpendMoney": {
      "amount": 500,
      "currency": "USD"
    },
    "variableSpendMoney": {
      "amount": 500,
      "currency": "USD"
    },
    "oneTimeCostMoney": {
      "amount": 0,
      "currency": ""
    },
    "totalValueMoney": {
      "amount": 1200,
      "currency": "USD"
    },
    "negotiatedSavingsMoney": {
      "amount": 800,
      "currency": "USD"
    },
    "savingsLink": "",
    "yearlySplits": [],
    "revisions": [
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1500,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 400,
          "currency": "USD"
        },
        "yearlySplits": []
      },
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1500,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 500,
          "currency": "USD"
        },
        "yearlySplits": []
      },
      {
        "proposalDescription": "",
        "duration": 12,
        "fixedSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "variableSpend": {
          "amount": 500,
          "currency": "USD"
        },
        "recurringSpend": {
          "amount": 1000,
          "currency": "USD"
        },
        "oneTimeCost": null,
        "totalValue": {
          "amount": 1200,
          "currency": "USD"
        },
        "negotiatedSavings": {
          "amount": 800,
          "currency": "USD"
        },
        "yearlySplits": []
      }
    ],
    "sensitive": false,
    "autoRenew": true,
    "autoRenewNoticePeriod": 3,
    "autoRenewDate": "2023-10-28",
    "includesCancellation": true,
    "cancellationDeadline": "2022-12-31",
    "paymentTerms": {
      "id": "",
      "name": "",
      "erpId": "",
      "refId": ""
    },
    "departments": [
      {
        "id": "IT",
        "name": "IT",
        "erpId": "",
        "refId": null
      }
    ],
    "companyEntities": [
      {
        "id": "HH",
        "name": "Honeycomb Holdings Inc.",
        "erpId": "3",
        "refId": null
      }
    ],
    "notes": [],
    "created": "2022-11-29T13:33:10.384291315Z",
    "updated": "2022-11-29T13:55:50.440963088Z",
    "signatories": [
      {
        "name": "MKT-user LR",
        "userName": "MKT-user-test@orolabs.ai",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      },
      {
        "name": "Yuan Tung",
        "userName": "yuan.tung@orolabs.ai",
        "api": false,
        "groupIds": [],
        "selected": false,
        "tenantId": "foo",
        "department": "",
        "picture": "",
        "firstName": "",
        "lastName": ""
      }
    ],
    "billingCycle": "On delivery"
  }
]

export const mockContractTypeFieldDefinition = [
  {
    "code": "annual",
    "type": "annual",
    "name": "Annual",
    "fields": [
      {
        "id": "contractValues",
        "name": "Contract values",
        "required": false,
        "section": true,
        "order": 1,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "proposalDescription",
            "name": "Proposal description",
            "required": true,
            "section": false,
            "order": 1,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "duration",
            "name": "Contract duration (months)",
            "required": true,
            "section": false,
            "order": 2,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "fixedSpend",
            "name": "Fixed spend",
            "required": true,
            "section": false,
            "order": 3,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "variableSpend",
            "name": "Est. variable spend (if any)",
            "required": false,
            "section": false,
            "order": 4,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "recurringSpend",
            "name": "Total annual recurring spend",
            "required": false,
            "section": false,
            "order": 5,
            "visible": true,
            "formula": "formData.fixedSpend?.amount + formData.variableSpend?.amount",
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "oneTimeCost",
            "name": "One-time cost (if any)",
            "required": false,
            "section": false,
            "order": 6,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "totalValue",
            "name": "Total Contract Value",
            "required": true,
            "section": false,
            "order": 7,
            "visible": true,
            "formula": "formData.fixedSpend?.amount + formData.oneTimeCost?.amount",
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "negotiatedSavings",
            "name": "Negotiated savings",
            "required": false,
            "section": false,
            "order": 8,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "yearlySplits",
            "name": "Yearly Splits",
            "required": false,
            "section": true,
            "order": 9,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "year",
                "name": "Year",
                "required": true,
                "section": false,
                "order": 1,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "totalValue",
                "name": "Total spend",
                "required": true,
                "section": false,
                "order": 2,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "terms",
        "name": "Terms",
        "required": true,
        "section": true,
        "order": 2,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "contractPeriod",
            "name": "Contract period",
            "required": true,
            "section": true,
            "order": 1,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "startDate",
                "name": "Start date",
                "required": false,
                "section": false,
                "order": 1,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "endDate",
                "name": "End date",
                "required": false,
                "section": false,
                "order": 2,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "paymentTerms",
            "name": "Payment terms",
            "required": true,
            "section": false,
            "order": 2,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "renewalAnnualValue",
            "name": "Renewal annual contract value (flat renewal)",
            "required": false,
            "section": false,
            "order": 3,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "autoRenew",
            "name": "Auto renewal",
            "required": true,
            "section": false,
            "order": 4,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "autoRenewNoticePeriod",
                "name": "Please provide the notice period (in days) to stop Auto renewal",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesPriceCap",
            "name": "Renewal price increase cap",
            "required": false,
            "section": false,
            "order": 5,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "priceCapIncrease",
                "name": "% increase on Renewal",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesCancellation",
            "name": "Includes cancellation policy",
            "required": true,
            "section": false,
            "order": 6,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "cancellationDeadline",
                "name": "Cancellation deadline",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesOptOut",
            "name": "Includes an opt-out date",
            "required": false,
            "section": false,
            "order": 7,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "optOutDeadline",
                "name": "Opt-out date",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesLateFees",
            "name": "Late fees",
            "required": true,
            "section": false,
            "order": 4,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "lateFeeDays",
                "name": "Please provide the late fees period (in days)",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "lateFeesPercentage",
                "name": "Late fees percentage (%)",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "terminationOfConvenience",
            "name": "Termination of convenience",
            "required": false,
            "section": false,
            "order": 4,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "terminationOfConvenienceDays",
                "name": "Please provide the termination period (in days)",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "liabilityLimitation",
            "name": "Liability Limitation",
            "required": true,
            "section": false,
            "order": 4,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "liabilityLimitationMultiplier",
                "name": "Liablitiy limitation multiplier",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "liabilityLimitationCap",
                "name": "Liablity limit",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "confidentialityClause",
            "name": "Confidentiality Clause",
            "required": false,
            "section": false,
            "order": 4,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": []
          },
          {
            "id": "billingCycle",
            "name": "Billing cycle",
            "required": false,
            "section": false,
            "order": 8,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "monthly",
    "type": "monthly",
    "name": "Month-to-month",
    "fields": [
      {
        "id": "contractValues",
        "name": "Contract values",
        "required": false,
        "section": true,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "proposalDescription",
            "name": "Proposal description",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "duration",
            "name": "Contract duration (months)",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "fixedSpend",
            "name": "Fixed spend",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "variableSpend",
            "name": "Est. variable spend (if any)",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "recurringSpend",
            "name": "Total monthly recurring spend",
            "required": false,
            "section": false,
            "visible": true,
            "formula": "formData.fixedSpend?.amount + formData.variableSpend?.amount",
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "oneTimeCost",
            "name": "One-time cost (if any)",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "totalValue",
            "name": "Total Contract Value",
            "required": true,
            "section": false,
            "visible": true,
            "formula": "formData.duration * (formData.recurringSpend?.amount + formData.oneTimeCost?.amount)",
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "negotiatedSavings",
            "name": "Negotiated savings",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "savingsLink",
            "name": "Link to calculations",
            "required": false,
            "section": false
          },
          {
            "id": "yearlySplits",
            "name": "Yearly Splits",
            "required": true,
            "section": true,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "year",
                "name": "Year",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "totalSpend",
                "name": "Total spend",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "terms",
        "name": "Terms",
        "required": false,
        "section": true,
        "children": [
          {
            "id": "contractPeriod",
            "name": "Contract period",
            "required": false,
            "section": true,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "startDate",
                "name": "Start date",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "endDate",
                "name": "End date",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "paymentTerms",
            "name": "Payment terms",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "renewalAnnualValue",
            "name": "Renewal annual contract value (flat renewal)",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": false
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "autoRenew",
            "name": "Auto renewal",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "autoRenewNoticePeriod",
                "name": "Please provide the notice period (in days) to stop Auto renewal",
                "required": false,
                "section": false,
                "visible": false,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesPriceCap",
            "name": "Renewal price increase cap",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "priceCapIncrease",
                "name": "% increase on Renewal",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": false
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesCancellation",
            "name": "Includes cancellation policy",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "cancellationDeadline",
                "name": "Cancellation deadline",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "includesOptOut",
            "name": "Includes an opt-out date",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "optOutDeadline",
                "name": "Opt-out date",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "billingCycle",
            "name": "Billing cycle",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "fixed",
    "type": "fixed",
    "name": "One-time",
    "fields": [
      {
        "id": "contractValues",
        "name": "Contract values",
        "required": false,
        "section": true,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "proposalDescription",
            "name": "Proposal description",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "duration",
            "name": "Contract duration (months)",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "variableSpend",
            "name": "Variable spend (if any)",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "fixedSpend",
            "name": "Fixed spend",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "totalValue",
            "name": "Total Contract Value",
            "required": true,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "negotiatedSavings",
            "name": "Negotiated savings",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "yearlySplits",
            "name": "Yearly Splits",
            "required": false,
            "section": true,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "year",
                "name": "Year",
                "required": false,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              },
              {
                "id": "totalSpend",
                "name": "Total spend",
                "required": false,
                "section": false
              }
            ]
          }
        ]
      },
      {
        "id": "terms",
        "name": "Terms",
        "required": false,
        "section": true,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "contractPeriod",
            "name": "Contract period",
            "required": false,
            "section": true,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "startDate",
                "name": "Start date",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              },
              {
                "id": "endDate",
                "name": "End date",
                "required": true,
                "section": false,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": false,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "paymentTerms",
            "name": "Payment terms",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "includesCancellation",
            "name": "Includes cancellation policy",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "cancellationDeadline",
            "name": "Cancellation deadline",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "includesOptOut",
            "name": "Includes an opt-out date",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "optOutDeadline",
            "name": "Opt-out date",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          },
          {
            "id": "billingCycle",
            "name": "Billing cycle",
            "required": false,
            "section": false,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": false,
                "visible": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "contractor",
    "type": "monthly",
    "name": "Contractor",
    "fields": [
      {
        "id": "contractValues",
        "name": "Contract Values",
        "required": false,
        "section": true,
        "order": 1,
        "visible": true,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "recurringSpend",
            "name": "Est. cost per month",
            "required": false,
            "section": false,
            "order": 1,
            "visible": true,
            "formula": "formData.fixedSpend?.amount + formData.variableSpend?.amount",
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "duration",
            "name": "Duration (months)",
            "required": true,
            "section": false,
            "order": 2,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "totalValue",
            "name": "Total contract value",
            "required": false,
            "section": false,
            "order": 3,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      },
      {
        "id": "terms",
        "name": "Terms",
        "required": false,
        "section": true,
        "order": 2,
        "children": [
          {
            "id": "contractPeriod",
            "name": "Contract Period",
            "required": false,
            "section": false,
            "order": 1,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "startDate",
                "name": "Start Date",
                "required": true,
                "section": false,
                "order": 1,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "endDate",
                "name": "End Date",
                "required": true,
                "section": false,
                "order": 2,
                "visible": true,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": false,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "paymentTerms",
            "name": "Payment Terms",
            "required": false,
            "section": false,
            "order": 2,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": false,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "billingCycle",
            "name": "Billing Cycle",
            "required": false,
            "section": false,
            "order": 3,
            "visible": true,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "msaslaetal",
    "type": "monthly",
    "name": "Non Commercial (MSA, SLA etc)",
    "recurring": false,
    "fields": [
      {
        "id": "terms",
        "name": "Terms",
        "required": false,
        "visible": true,
        "section": true,
        "order": 4,
        "formConfigs": [
          {
            "formId": "OroContractNegotiationForm",
            "required": true,
            "visible": true
          },
          {
            "formId": "OroContractFinalisationForm",
            "required": true,
            "visible": true
          }
        ],
        "children": [
          {
            "id": "contractPeriod",
            "name": "Contract Period",
            "required": false,
            "visible": true,
            "section": false,
            "order": 1,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ],
            "children": [
              {
                "id": "startDate",
                "name": "Contract Start Date",
                "required": false,
                "visible": true,
                "section": false,
                "order": 1,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              },
              {
                "id": "endDate",
                "name": "Contract End Date",
                "required": false,
                "visible": true,
                "section": false,
                "order": 2,
                "formConfigs": [
                  {
                    "formId": "OroContractNegotiationForm",
                    "required": true,
                    "visible": true
                  },
                  {
                    "formId": "OroContractFinalisationForm",
                    "required": true,
                    "visible": true
                  }
                ]
              }
            ]
          },
          {
            "id": "paymentTerms",
            "name": "Payment Terms",
            "required": false,
            "visible": true,
            "section": false,
            "order": 2,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          },
          {
            "id": "billingCycle",
            "name": "Billing Cycle",
            "required": false,
            "visible": true,
            "section": false,
            "order": 3,
            "formConfigs": [
              {
                "formId": "OroContractNegotiationForm",
                "required": true,
                "visible": true
              },
              {
                "formId": "OroContractFinalisationForm",
                "required": true,
                "visible": true
              }
            ]
          }
        ]
      }
    ]
  }
]

export const mockFixedFields = [
    {
      "id": "contractValues",
      "name": "Contract values",
      "required": false,
      "section": true,
      "order": 1,
      "children": [
        {
          "id": "proposalDescription",
          "name": "Proposal description",
          "required": true,
          "section": false,
          "order": 1
        },
        {
          "id": "variableSpend",
          "name": "Variable spend (if any)",
          "required": false,
          "section": false,
          "order": 2
        },
        {
          "id": "fixedSpend",
          "name": "Fixed fee",
          "required": false,
          "section": false,
          "order": 3
        },
        {
          "id": "totalValue",
          "name": "Total Contract Value",
          "required": true,
          "section": false,
          "order": 4
        },
        {
          "id": "negotiatedSavings",
          "name": "Negotiated savings",
          "required": false,
          "section": false,
          "order": 5
        }
      ]
    },
    {
      "id": "terms",
      "name": "Terms",
      "required": false,
      "section": true,
      "order": 1,
      "children": [
        {
          "id": "contractPeriod",
          "name": "Contract period",
          "required": false,
          "section": true,
          "order": 1,
          "children": [
            {
              "id": "startDate",
              "name": "Start date",
              "required": true,
              "section": false,
              "order": 1
            },
            {
              "id": "endDate",
              "name": "End date",
              "required": true,
              "section": false,
              "order": 2
            }
          ]
        },
        {
          "id": "paymentTerms",
          "name": "Payment terms",
          "required": false,
          "section": false,
          "order": 1
        },
        {
          "id": "includesCancellation",
          "name": "Includes cancellation policy",
          "required": false,
          "section": false,
          "order": 2,
          "children": [{
            "id": "cancellationDeadline",
            "name": "Cancellation deadline",
            "required": false,
            "section": false,
            "order": 1
          }]
        }
      ]
    }
]
