import { Option, SupplierUser, User } from "../../lib/types"
import { DEFAULT_CURRENCY } from "../../lib/util"

export const mockCountryOptions = [
  {
    id: '19-21-US',
    displayName: 'United States',
    path: '19-21-US',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'in',
    displayName: 'India',
    path: 'IN',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: '19-21-CA',
    displayName: 'Canada',
    path: '19-21-CA',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'au',
    displayName: 'Australia',
    path: 'AU',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  }
]

export const mockOptionsDefault = [
  {
    id: 'id1',
    displayName: 'Test 1 looooooooooooooooong naaaaaaame',
    path: 'option1',
    customData: { erpId: "5", other: {countryCode: "IN"} },
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id2',
    displayName: 'Option 2',
    path: 'option2',
    customData: { erpId: "6" },
    icon: '',
    selected: false,
    selectable: true,
    children: [
      {
        id: 'id21',
        displayName: 'Option 2-2',
        path: 'option2/option2-1',
        customData: { erpId: "7", other: {countryCode: "IN"} },
        icon: '',
        selected: false,
        selectable: true,
        hierarchy: '',
      }
    ],
    hierarchy: '',
  },
  {
    id: 'id3',
    displayName: 'Option 3',
    path: 'option3',
    customData: { erpId: "8" },
    icon: '',
    selected: false,
    selectable: true,
    children: [
      {
        id: 'id31',
        displayName: 'Option 3-1',
        path: 'option2/option3-1',
        icon: '',
        selected: false,
        selectable: true,
        children: [
          {
            id: 'id311',
            displayName: 'Option 3-1-1',
            path: 'option2/option3-1/option3-1-1',
            icon: '',
            selected: false,
            selectable: true,
            hierarchy: '',
          },
          {
            id: 'id312',
            displayName: 'Option 3-1-2',
            path: 'option2/option3-1/option3-1-2',
            icon: '',
            selected: false,
            selectable: true,
            hierarchy: '',
          },
          {
            id: 'id3122',
            displayName: 'Option 3-1-2-2',
            path: 'option2/option3-1/option3-1-2-2',
            customData: { erpId: "7", other: {countryCode: "IN"} },
            icon: '',
            selected: false,
            selectable: true,
            hierarchy: '',
          }
        ],
        hierarchy: '',
      }
    ],
    hierarchy: '',
  },
  {
    id: 'id4',
    displayName: 'Option 4',
    path: 'option4',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id5',
    displayName: 'Option 5',
    path: 'option5',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id6',
    displayName: 'Option 6',
    path: 'option6',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id7',
    displayName: 'Team 7',
    path: 'option7',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id8',
    displayName: 'Team 8',
    path: 'option8',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id9',
    displayName: 'Last 9',
    path: 'option9',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  }
]

export const mockOptionsRegion = [
  {
    id: 'id1',
    displayName: 'Asia-Pacific',
    path: 'option1',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id2',
    displayName: 'Europe, the Middle East and Africa',
    path: 'option2',
    icon: '',
    selected: false,
    selectable: false,
    hierarchy: '',
  },{
    id: 'id4',
    displayName: 'Latin America',
    path: 'option4',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id5',
    displayName: 'North America',
    path: 'option5',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id6',
    displayName: 'Option 1',
    path: 'option6',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  }
]

export const mockOptionsDefault2 = [
  {
    id: 'id2',
    displayName: 'Option 2',
    path: 'option2',
    icon: '',
    selected: false,
    selectable: true,
    children: [
      {
        id: 'id21',
        displayName: 'Option 2-2',
        path: 'option2/option2-1',
        icon: '',
        selected: false,
        selectable: true,
        hierarchy: '',
      }
    ],
    hierarchy: '',
  }
]

export const mockOptionsSelected = [
  {
    id: 'id1',
    displayName: 'Option 1',
    path: 'option1',
    icon: '',
    selected: false,
    selectable: false,
    hierarchy: '',
  },
  {
    id: 'id2',
    displayName: 'Option 2',
    path: 'option2',
    icon: '',
    selected: true,
    selectable: false,
    children: [
      {
        id: 'id21',
        displayName: 'Option 2-2',
        path: 'option2/option2-1',
        icon: '',
        selected: true,
        selectable: false,
        hierarchy: '',
      }
    ],
    hierarchy: '',
  },
  {
    id: 'id3',
    displayName: 'Option 3',
    path: 'option3',
    icon: '',
    selected: false,
    selectable: false,
    children: [
      {
        id: 'id31',
        displayName: 'Option 3-1',
        path: 'option2/option3-1',
        icon: '',
        selected: false,
        selectable: false,
        children: [
          {
            id: 'id311',
            displayName: 'Option 3-1-1',
            path: 'option2/option3-1/option3-1-1',
            icon: '',
            selected: false,
            selectable: false,
            hierarchy: '',
          }
        ],
        hierarchy: '',
      }
    ],
    hierarchy: '',
  }
]

export const mockCurrencyOptions = [
  {
    id: 'id1',
    displayName: DEFAULT_CURRENCY,
    path: DEFAULT_CURRENCY,
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: ''
  },
  {
    id: 'id2',
    displayName: 'EUR',
    path: 'EUR',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: ''
  },
  {
    id: 'id3',
    displayName: 'INR',
    path: 'INR',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: ''
  }
]

export const mockCategory: Option[] = [
  {
    id: 'id1',
    displayName: 'Marketing',
    path: 'Marketing',
    icon: '',
    selected: false,
    selectable: false,
    hierarchy: ''
  },
  {
    id: 'id2',
    displayName: 'Hardware',
    path: 'Hardware',
    icon: '',
    selected: false,
    selectable: false,
    hierarchy: ''
  },

]

export const mockPaymentTerms = [
  {
    id: '1',
    displayName: 'Net 15',
    path: '1',
    icon: '',
    customData: { erpId: "1" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: '2',
    displayName: 'Net 21',
    path: '2',
    icon: '',
    customData: { erpId: "2" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: '3',
    displayName: '1% Net 30',
    path: '3',
    icon: '',
    customData: { erpId: "3" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'id5',
    displayName: 'Net 30',
    path: '4',
    icon: '',
    customData: { erpId: "4" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: '5',
    displayName: 'Due on receipt',
    path: '5',
    icon: '',
    customData: { erpId: "5" },
    selected: false,
    selectable: true,
    hierarchy: '',
  }
]

export const mockDocumentTypeOptions = [
  {
    id: 'orderForm',
    displayName: 'Order form',
    path: 'orderForm',
    icon: '',
    customData: { erpId: "orderForm" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'msa',
    displayName: 'Master Service Agreement (MSA)',
    path: 'msa',
    icon: '',
    customData: { erpId: "msa" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'dpa',
    displayName: 'Data Processing Agreement (DPA)',
    path: 'dpa',
    icon: '',
    customData: { erpId: "dpa" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'sla',
    displayName: 'Service Level Agreement (SLA)',
    path: 'sla',
    icon: '',
    customData: { erpId: "sla" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'sow',
    displayName: 'Statement of Work (SOW)',
    path: 'sow',
    icon: '',
    customData: { erpId: "sow" },
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'nda',
    displayName: 'Non-disclosure Agreement (NDA)',
    path: 'nda',
    icon: '',
    customData: { erpId: "nda" },
    selected: false,
    selectable: true,
    hierarchy: '',
  }
]

export const mockUnitPerQuantity = [
  { id: '05', displayName: 'lift', path: 'lift' },
  { id: '22', displayName: 'decilitre per gram', path: 'dl/g' },
  { id: '28', displayName: 'kilogram per square metre', path: 'kg/m²' }
]

export const mockUsers: User[] = [
  {
    email: 'james.lubin@basf.com',
    userName: 'james.lubin@basf.com',
    firstName: 'James',
    lastName: 'Lubin',
    userType: '',
    groupIds: [],
    roles: [],
    picture: '',
    phone: '',
    locale: '',
    lastLoginAttempt: '',
    loginFailureCount: 0,
    lastLoginSuccessful: false,
    userLockedOut: false,
    confirmedStatus: '',
    dateCreated: '',
    externalUser: false,
    name: ''
  },
  {
    email: 'emerson.aminoff@basf.com',
    userName: 'emerson.aminoff@basf.com',
    firstName: 'Emerson',
    lastName: 'Aminoff',
    userType: '',
    groupIds: [],
    roles: [],
    picture: '',
    phone: '',
    locale: '',
    lastLoginAttempt: '',
    loginFailureCount: 0,
    lastLoginSuccessful: false,
    userLockedOut: false,
    confirmedStatus: '',
    dateCreated: '',
    externalUser: false,
    name: ''
  }
]

export const mockContacts: SupplierUser[] = [
  {
    email: "steven.weigand@orolabs.ai",
    emailVerified: false,
    fullName: "Steven Weigand",
    id: "89113807820947456",
    phone: "+15599787726",
    phoneVerified: false,
    role: "Owner",
    // tenantId: "foo",
    // vendorId: "89113807414099968"
  }
]

export const mockSlaDocumment =
  {
    "id": "192908819649527808",
    "name": "sla.pdf",
    "type": {
      "id": "sla",
      "name": "Service Level Agreement",
      "erpId": "",
      "refId": ""
    },
    "attachment": {
      "filename": "sla.pdf",
      "mediatype": "application/pdf",
      "size": 75,
      "path": "attachment/2022/6/23/192908818810667008/sla.pdf",
      "reference": null,
      "date": null,
      "expiration": null,
      "name": null,
      "note": null,
      "eid": null,
      "asyncPutUrl": null,
      "asyncGetUrl": null,
      "issueDate": null,
      "contentKind": "CustomerPrivate",
      "sourceUrl": "https://drive.google.com/file/d/1634A8XkS03q9Doc6oMcxxN2xML9Q6KoA/view"
    }
  }

export const mockMsaDocument =
  {
    "id": "192287868012462080",
    "name": "MSA_contract_fw_freshdesk.pdf",
    "type": {
      "id": "msa",
      "name": "MSA",
      "erpId": "",
      "refId": ""
    },
    "attachment": {
      "filename": "MSA_contract_fw_freshdesk.pdf",
      "mediatype": "application/pdf",
      "size": 293,
      "path": "attachment/2022/6/21/192287867161018368/MSA_contract_fw_freshdesk.pdf",
      "reference": null,
      "date": null,
      "expiration": null,
      "name": null,
      "note": null,
      "eid": null,
      "asyncPutUrl": null,
      "asyncGetUrl": null,
      "issueDate": null,
      "contentKind": "CustomerPrivate"
    }
  }

export const mockClassificationOption = [
  {
    id: 'strategic',
    displayName: 'Strategic',
    path: 'strategic',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'critical',
    displayName: 'Critical',
    path: 'critical',
    icon: '',
    selected: false,
    selectable: false,
    hierarchy: '',
  },
  {
    id: 'singleSource',
    displayName: 'Single Source',
    path: 'singleSource',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'preferred',
    displayName: 'Preferred',
    path: 'preferred',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'approved',
    displayName: 'Approved',
    path: 'approved',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  },
  {
    id: 'prospect',
    displayName: 'Prospect',
    path: 'prospect',
    icon: '',
    selected: false,
    selectable: true,
    hierarchy: '',
  }
]
