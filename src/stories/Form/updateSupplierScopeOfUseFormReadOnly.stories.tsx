import React from "react";
import { StoryFn } from "@storybook/react";
import {
  UpdateSupplierScopeOfUseReadOnly,
  UpdateSupplierScopeOfUseReadOnlyProps,
} from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title:
    "ORO UI Toolkit/Form/UpdateSupplierProfile/Update Scope of Use Readonly",
  component: UpdateSupplierScopeOfUseReadOnly,
};

const mockScope = [
  {
    id: "266184216757707719",
    name: "testing",
    dimension: {
      programs: [],
      regions: [
        {
          id: "19",
          name: "Americas",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      categories: [
        {
          id: "30",
          name: "HR",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      sites: [],
      departments: [],
      companyEntities: [],
    },
    segmentation: "critical",
    description: "",
    latestUse: null,
  },
  {
    id: "306369029615238240",
    name: "",
    dimension: {
      programs: [],
      regions: [],
      categories: [
        {
          id: "50",
          name: "Facilities",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "70",
          name: "Field Services",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "40",
          name: "Legal & Finance",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [],
      productStages: [],
      sites: [],
      departments: [],
      companyEntities: [],
    },
    segmentation: "critical",
    description: "Sample desc",
    latestUse: null,
  },
  {
    id: "253555852963314482",
    name: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    dimension: {
      programs: [
        {
          id: "eng",
          name: "Engineering",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "marketing",
          name: "Marketing",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      regions: [
        {
          id: "2",
          name: "Africa",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "19",
          name: "Americas",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      categories: [
        {
          id: "53",
          name: "Apparel and Luggage and Personal Care Products",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "50",
          name: "Facilities",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "70",
          name: "Field Services",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "60",
          name: "General Business Services",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "40",
          name: "Legal & Finance",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "80",
          name: "Transportation & Logistics",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [
        {
          id: "2",
          name: "Dell laptop",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "1",
          name: "Hp laptop",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      sites: [
        {
          id: "Premikati_NC",
          name: "Premikati NC",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "Site_1",
          name: "Site 1",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      departments: [
        {
          id: "DMRK",
          name: "Digital Marketing",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "FAC",
          name: "Facilities",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      companyEntities: [
        {
          id: "HH",
          name: "Honeycomb Holdings Inc.",
          erpId: "3",
          refId: "",
          version: "",
        },
        {
          id: "Premikati",
          name: "Premikati",
          erpId: "Premikati",
          refId: "",
          version: "",
        },
      ],
    },
    segmentation: "singleSource",
    description:
      "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    latestUse: {
      categories: [
        {
          id: "60",
          name: "General Business Services",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      engagementReference: {
        id: "306492788883958493",
        name: "testing email control in custom forms",
        erpId: "",
        refId: "A3658",
        version: "",
      },
      engagementTime: "2023-05-02T11:51:37.333741602Z",
      requester: {
        name: "John Doe",
        userName: "john@foo.com",
        api: false,
        groupIds: [],
        selected: false,
        tenantId: "foo",
        department: "",
        picture: "",
        firstName: "",
        lastName: "",
        email: "john@foo.com",
      },
    },
  },
  {
    id: "288753296071285482",
    name: "",
    dimension: {
      programs: [],
      regions: [
        {
          id: "19",
          name: "Americas",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      categories: [
        {
          id: "50",
          name: "Facilities",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "70",
          name: "Field Services",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "60",
          name: "General Business Services",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [
        {
          id: "2",
          name: "Dell laptop",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      sites: [
        {
          id: "Premikati_NC",
          name: "Premikati NC",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      departments: [],
      companyEntities: [],
    },
    segmentation: "preferred",
    description: "",
    latestUse: {
      categories: [
        {
          id: "60",
          name: "General Business Services",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      engagementReference: {
        id: "306492788883958493",
        name: "testing email control in custom forms",
        erpId: "",
        refId: "A3658",
        version: "",
      },
      engagementTime: "2023-05-02T11:51:37.333741602Z",
      requester: {
        name: "John Doe",
        userName: "john@foo.com",
        api: false,
        groupIds: [],
        selected: false,
        tenantId: "foo",
        department: "",
        picture: "",
        firstName: "",
        lastName: "",
        email: "john@foo.com",
      },
    },
  },
  {
    id: "330424456341296973",
    dimension: {
      programs: [
        {
          id: "eng",
          name: "Engineering",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      regions: [
        {
          id: "150",
          name: "Europe",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      categories: [
        {
          id: "40",
          name: "Legal & Finance",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      products: [
        {
          id: "2",
          name: "Dell laptop",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      sites: [
        {
          id: "Site_1",
          name: "Site 1",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      departments: [],
      companyEntities: [
        {
          id: "HH",
          name: "Honeycomb Holdings Inc.",
          erpId: "3",
          refId: "",
          empty: false,
        },
      ],
    },
    name: "",
    segmentation: "prospect",
    description: "New Scope - Edited demo",
    latestUse: null,
    updatedBy: null,
  },
];

const mockAddedScope = [
  {
    id: "306369029615238240",
    name: "",
    dimension: {
      programs: [],
      regions: [],
      categories: [
        {
          id: "50",
          name: "Facilities",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "70",
          name: "Field Services",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "40",
          name: "Legal & Finance",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [],
      productStages: [],
      sites: [],
      departments: [],
      companyEntities: [],
    },
    segmentation: "critical",
    description: "Sample desc",
    latestUse: null,
  },
  {
    id: "288753296071285482",
    name: "",
    dimension: {
      programs: [],
      regions: [
        {
          id: "19",
          name: "Americas",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      categories: [
        {
          id: "50",
          name: "Facilities",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "70",
          name: "Field Services",
          erpId: "",
          refId: "",
          version: "",
        },
        {
          id: "60",
          name: "General Business Services",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [
        {
          id: "2",
          name: "Dell laptop",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      sites: [
        {
          id: "Premikati_NC",
          name: "Premikati NC",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      departments: [],
      companyEntities: [],
    },
    segmentation: "preferred",
    description: "",
    latestUse: {
      categories: [
        {
          id: "60",
          name: "General Business Services",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      engagementReference: {
        id: "306492788883958493",
        name: "testing email control in custom forms",
        erpId: "",
        refId: "A3658",
        version: "",
      },
      engagementTime: "2023-05-02T11:51:37.333741602Z",
      requester: {
        name: "John Doe",
        userName: "john@foo.com",
        api: false,
        groupIds: [],
        selected: false,
        tenantId: "foo",
        department: "",
        picture: "",
        firstName: "",
        lastName: "",
        email: "john@foo.com",
      },
    },
  },
];

const mockUpdatedScope = [
  {
    id: "330424456341296973",
    dimension: {
      programs: [
        {
          id: "eng",
          name: "Engineering",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      regions: [
        {
          id: "150",
          name: "Europe",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      categories: [
        {
          id: "40",
          name: "Legal & Finance",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      products: [
        {
          id: "2",
          name: "Dell laptop",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      sites: [
        {
          id: "Site_1",
          name: "Site 1",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      departments: [],
      companyEntities: [
        {
          id: "HH",
          name: "Honeycomb Holdings Inc.",
          erpId: "3",
          refId: "",
          empty: false,
        },
      ],
    },
    name: "",
    segmentation: "prospect",
    description: "New Scope - Edited demo",
    latestUse: null,
    updatedBy: null,
  },
];

// const mockUpdatedScope = [
//     {
//     "id": "253555852963314482",
//     "name": "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
//     "dimension": {
//         "programs": [
//             {
//                 "id": "eng",
//                 "name": "Engineering",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "marketing",
//                 "name": "Marketing",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "regions": [
//             {
//                 "id": "2",
//                 "name": "Africa",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "19",
//                 "name": "Americas",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "categories": [
//             {
//                 "id": "53",
//                 "name": "Apparel and Luggage and Personal Care Products",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "50",
//                 "name": "Facilities",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "70",
//                 "name": "Field Services",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "60",
//                 "name": "General Business Services",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "40",
//                 "name": "Legal & Finance",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "80",
//                 "name": "Transportation & Logistics",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "products": [
//             {
//                 "id": "2",
//                 "name": "Dell laptop",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "1",
//                 "name": "Hp laptop",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "productStages": [
//             {
//                 "id": "101",
//                 "name": "Product1",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "sites": [
//             {
//                 "id": "Premikati_NC",
//                 "name": "Premikati NC",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "Site_1",
//                 "name": "Site 1",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "departments": [
//             {
//                 "id": "DMRK",
//                 "name": "Digital Marketing",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "FAC",
//                 "name": "Facilities",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "companyEntities": [
//             {
//                 "id": "HH",
//                 "name": "Honeycomb Holdings Inc.",
//                 "erpId": "3",
//                 "refId": "",
//                 "version": ""
//             },
//             {
//                 "id": "Premikati",
//                 "name": "Premikati",
//                 "erpId": "Premikati",
//                 "refId": "",
//                 "version": ""
//             }
//         ]
//     },
//     "segmentation": "singleSource",
//     "description": "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
//     "latestUse": {
//         "categories": [
//             {
//                 "id": "60",
//                 "name": "General Business Services",
//                 "erpId": "",
//                 "refId": "",
//                 "version": ""
//             }
//         ],
//         "engagementReference": {
//             "id": "306492788883958493",
//             "name": "testing email control in custom forms",
//             "erpId": "",
//             "refId": "A3658",
//             "version": ""
//         },
//         "engagementTime": "2023-05-02T11:51:37.333741602Z",
//         "requester": {
//             "name": "John Doe",
//             "userName": "john@foo.com",
//             "api": false,
//             "groupIds": [],
//             "selected": false,
//             "tenantId": "foo",
//             "department": "",
//             "picture": "",
//             "firstName": "",
//             "lastName": "",
//             "email": "john@foo.com"
//         }
//     }
//     }
// ]

const mockDeletedScope = [
  {
    id: "266184216757707719",
    name: "testing",
    dimension: {
      programs: [],
      regions: [
        {
          id: "19",
          name: "Americas",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      categories: [
        {
          id: "30",
          name: "HR",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      products: [],
      productStages: [
        {
          id: "101",
          name: "Product1",
          erpId: "",
          refId: "",
          version: "",
        },
      ],
      sites: [],
      departments: [],
      companyEntities: [],
    },
    segmentation: "critical",
    description: "",
    latestUse: null,
  },
];

export const TemplateForm = {
  args: {
    formData: {
      segmentations: mockScope,
      added: mockAddedScope,
      updated: mockUpdatedScope,
      deleted: mockDeletedScope,
    },
    diffs: {
      fieldDiffs: {},
      listDiffs: {
        segmentations: {
          listDifferent: true,
          itemDiffs: [
            {
              changed: false,
              original: null,
            },
            {
              changed: true,
              original: {
                name: "",
                segmentation: "prospect",
                description: "New Scope",
                id: "330424456341296973",
                dimension: {
                  regions: [
                    {
                      name: "Europe",
                      erpId: "",
                      id: "150",
                      refId: "",
                      empty: false,
                    },
                  ],
                  sites: [
                    {
                      name: "Site 2",
                      erpId: "",
                      id: "Site_2",
                      refId: "",
                      empty: false,
                    },
                  ],
                  companyEntities: [],
                  programs: [],
                  categories: [
                    {
                      name: "Legal & Finance",
                      erpId: "",
                      id: "40",
                      refId: "",
                      empty: false,
                    },
                  ],
                  departments: [],
                  productStages: [
                    {
                      name: "Product1",
                      erpId: "",
                      id: "101",
                      refId: "",
                      empty: false,
                    },
                  ],
                  products: [
                    {
                      name: "Dell laptop",
                      erpId: "",
                      id: "2",
                      refId: "",
                      empty: false,
                    },
                  ],
                },
              },
            },
            {
              changed: true,
              original: null,
            },
          ],
        },
      },
    },
  },
};
