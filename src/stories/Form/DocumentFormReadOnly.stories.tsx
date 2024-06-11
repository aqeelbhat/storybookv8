import React from "react";
import { StoryFn } from "@storybook/react";

import { Document, DocumentFormReadOnly } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Document Form Read Only",
  component: DocumentFormReadOnly,
};

const options = [
  {
    id: "_DocumentType__null__nda",
    displayName: "NDA",
    path: "nda",
    customData: {
      erpId: null,
      code: "nda",
    },
    icon: "",
    selected: false,
    selectable: true,
  },
  {
    id: "_DocumentType__null__msa",
    displayName: "MSA",
    path: "msa",
    customData: {
      erpId: null,
      code: "msa",
    },
    icon: "",
    selected: false,
    selectable: true,
  },
];

export const TemplateForm = {
  args: {
    documentType: options,
    hideActions: true,
    isContractDocView: false, // true
    theme: "coco",
    docs: [
      {
        tenantId: "foo",
        id: "192908819649527808",
        normalizedVendorId: "149463783020953600",
        normalizedVendorName: "SandeepTestSupplier",
        name: "CallbackSource.csv",
        type: {
          id: "dpa",
          name: "DPA",
          erpId: "",
          refId: "",
        },
        notes: [
          {
            id: "12",
            owner: {
              name: "Nitesh Jadhav",
              userName: "nitesh@orolabs.ai",
            },
            taskStatus: "pending",
            comment: "string1",
            documents: [
              {
                id: "146680789508030464",
                name: "a.csv",
                erpId: null,
              },
            ],
            created: "2023-01-11T10:17:31.257331649",
            updated: "2023-01-11T10:17:31.257331649",
            parentId: "123",
            replies: [],
          },
          {
            id: "13",
            owner: {
              name: "Nitesh Jadhav 2",
              userName: "nitesh@orolabs.ai",
            },
            taskStatus: "pending",
            comment: "string1",
            documents: [
              {
                id: "146680789508030464",
                name: "a.csv",
                erpId: null,
              },
            ],
            created: "2023-01-11T10:17:31.257331649",
            updated: "2023-01-11T10:17:31.257331649",
            parentId: "123",
            replies: [],
          },
          {
            id: "14",
            owner: {
              name: "Nitesh Jadhav 3",
              userName: "nitesh@orolabs.ai",
            },
            taskStatus: "pending",
            comment: "string1",
            documents: [
              {
                id: "146680789508030464",
                name: "a.csv",
                erpId: null,
              },
            ],
            created: "2023-01-11T10:17:31.257331649",
            updated: "2023-01-11T10:17:31.257331649",
            parentId: "123",
            replies: [],
          },
        ],
        documentNumber: "",
        status: "Active",
        created: "2022-06-23T01:13:18.397764Z",
        updated: "2022-06-23T01:13:47.432314Z",
        attachment: {
          filename: "CallbackSource.csv",
          mediatype: "text/csv",
          size: 75,
          path: "attachment/2022/6/23/192908818810667008/CallbackSource.csv",
          reference: null,
          date: null,
          expiration: null,
          name: null,
          note: null,
          eid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          issueDate: null,
          contentKind: "CustomerPrivate",
        },
        owners: [
          {
            tenantId: "foo",
            tenantName: null,
            userName: "john@foo.com",
            name: "John Doe",
            department: "",
            departmentCode: null,
            groupIds: null,
            type: null,
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: "",
            ip: null,
            otp: false,
            admin: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 0,
        engagementOnly: false,
        audit: {
          entries: [
            {
              time: "2022-06-23T01:13:18.397773",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "130.176.20.131",
                otp: false,
                admin: true,
              },
              ip: "130.176.20.131",
            },
            {
              time: "2022-06-23T01:13:47.432603",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "15.158.25.13",
                otp: false,
                admin: true,
              },
              ip: "15.158.25.13",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          open: false,
        },
        sensitive: false,
        editableByUser: false,
      },
      {
        tenantId: "foo",
        id: "192287868012462080",
        normalizedVendorId: "149463783020953600",
        normalizedVendorName: "SandeepTestSupplier",
        name: "CallbackOutcome (1).csv",
        type: {
          id: "nda",
          name: "NDA",
          erpId: "",
          refId: "",
        },
        documentNumber: "",
        status: "Active",
        created: "2022-06-21T08:05:51.990434Z",
        updated: "2022-06-21T08:06:07.071883Z",
        attachment: {
          filename: "CallbackOutcome (1).csv",
          mediatype: "text/csv",
          size: 293,
          path: "attachment/2022/6/21/192287867161018368/CallbackOutcome (1).csv",
          reference: null,
          date: null,
          expiration: null,
          name: null,
          note: null,
          eid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          issueDate: null,
          contentKind: "CustomerPrivate",
        },
        owners: [
          {
            tenantId: "foo",
            tenantName: null,
            userName: "john@foo.com",
            name: "John Doe",
            department: "",
            departmentCode: null,
            groupIds: null,
            type: null,
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: "",
            ip: null,
            otp: false,
            admin: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 0,
        expirationDate: "2022-07-30",
        engagementOnly: false,
        audit: {
          entries: [
            {
              time: "2022-06-21T08:05:51.990442",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "64.252.177.153",
                otp: false,
                admin: true,
              },
              ip: "64.252.177.153",
            },
            {
              time: "2022-06-21T08:06:07.072031",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "64.252.177.71",
                otp: false,
                admin: true,
              },
              ip: "64.252.177.71",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          open: false,
        },
        sensitive: false,
        editableByUser: true,
      },
      {
        tenantId: "foo",
        id: "192901063110557696",
        normalizedVendorId: "149463783020953600",
        normalizedVendorName: "SandeepTestSupplier",
        name: "Get_Started_With_Smallpdf.pdf",
        type: {
          id: "contract",
          name: "Contract",
          erpId: "",
          refId: "",
        },
        documentNumber: "",
        status: "Active",
        created: "2022-06-23T00:42:29.094677Z",
        updated: "2022-06-23T00:42:46.069574Z",
        attachment: {
          filename: "Get_Started_With_Smallpdf.pdf",
          mediatype: "application/pdf",
          size: 69432,
          path: "attachment/2022/6/23/192901062103924736/Get_Started_With_Smallpdf.pdf",
          reference: null,
          date: null,
          expiration: null,
          name: null,
          note: null,
          eid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          issueDate: null,
          contentKind: "CustomerPrivate",
        },
        owners: [
          {
            tenantId: "foo",
            tenantName: null,
            userName: "john@foo.com",
            name: "John Doe",
            department: "",
            departmentCode: null,
            groupIds: null,
            type: null,
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: "",
            ip: null,
            otp: false,
            admin: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 21,
        expirationDate: "2022-06-30",
        dateSigned: "2021-07-01",
        amount: {
          amount: 2123,
          currency: "USD",
        },
        engagementOnly: false,
        audit: {
          entries: [
            {
              time: "2022-06-23T00:42:29.094688",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "64.252.177.155",
                otp: false,
                admin: true,
              },
              ip: "64.252.177.155",
            },
            {
              time: "2022-06-23T00:42:46.069836",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "64.252.177.72",
                otp: false,
                admin: true,
              },
              ip: "64.252.177.72",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          open: false,
        },
        sensitive: false,
        editableByUser: true,
      },
      {
        tenantId: "foo",
        id: "192721654722330624",
        normalizedVendorId: "149463783020953600",
        normalizedVendorName: "SandeepTestSupplier",
        name: "CallbackTo.csv",
        type: {
          id: "msa",
          name: "MSA",
          erpId: "",
          refId: "",
        },
        documentNumber: "",
        status: "Active",
        created: "2022-06-22T12:49:34.801701Z",
        updated: "2022-06-22T12:49:50.704749Z",
        attachment: {
          filename: "CallbackTo.csv",
          mediatype: "text/csv",
          size: 72,
          path: "attachment/2022/6/22/192721651614351360/CallbackTo.csv",
          reference: null,
          date: null,
          expiration: null,
          name: null,
          note: null,
          eid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          issueDate: null,
          contentKind: "CustomerPrivate",
        },
        owners: [
          {
            tenantId: "foo",
            tenantName: null,
            userName: "john@foo.com",
            name: "John Doe",
            department: "",
            departmentCode: null,
            groupIds: null,
            type: null,
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: "",
            ip: null,
            otp: false,
            admin: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 0,
        expirationDate: "2022-06-30",
        engagementOnly: false,
        audit: {
          entries: [
            {
              time: "2022-06-22T12:49:34.801742",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "15.158.25.52",
                otp: false,
                admin: true,
              },
              ip: "15.158.25.52",
            },
            {
              time: "2022-06-22T12:49:50.704994",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                name: "John Doe",
                department: null,
                departmentCode: null,
                groupIds: null,
                type: "Tenant",
                email: null,
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "15.158.25.13",
                otp: false,
                admin: true,
              },
              ip: "15.158.25.13",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          open: false,
        },
        sensitive: false,
        editableByUser: true,
      },
      {
        versionNum: "1",
        created: "2024-03-12T06:42:03.581176685Z",
        updated: "2024-03-12T06:50:34.690674861Z",
        createdBy: {
          tenantId: "foo",
          tenantName: "Foo Company",
          userName: "john@foo.com",
          userNameCP: null,
          name: "John Doe",
          department: null,
          departmentCode: null,
          departmentErpId: null,
          groupIds: null,
          type: "Tenant",
          email: "john@foo.com",
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: "182.156.21.2",
          impersonator: null,
          connectionName: null,
          procurementAdmin: true,
          admin: true,
          otp: false,
        },
        updatedBy: {
          tenantId: "foo",
          tenantName: "Foo Company",
          userName: "john@foo.com",
          userNameCP: null,
          name: "John Doe",
          department: null,
          departmentCode: null,
          departmentErpId: null,
          groupIds: null,
          type: "Tenant",
          email: "john@foo.com",
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: "182.156.21.2",
          impersonator: null,
          connectionName: null,
          procurementAdmin: true,
          admin: true,
          otp: false,
        },
        audit: {
          entries: [
            {
              time: "2024-03-12T06:50:34.690319481",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                userNameCP: null,
                name: "John Doe",
                department: null,
                departmentCode: null,
                departmentErpId: null,
                groupIds: null,
                type: "Tenant",
                email: "john@foo.com",
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "182.156.21.2",
                impersonator: null,
                connectionName: null,
                procurementAdmin: true,
                admin: true,
                otp: false,
              },
              ip: "182.156.21.2",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          departments: null,
          open: false,
        },
        tenantId: "foo",
        id: "420571132667580525",
        normalizedVendorId: "309454481025812318",
        normalizedVendorName: "RMD",
        engagementRef: {
          id: "420558448038732262",
          name: "Contract - Draft Legal Docs to Negotiation",
          refId: "121610",
          empty: false,
        },
        contractRef: {
          id: "420571869317386349",
          name: "Contract - Draft Legal Docs to Negotiation - RMD",
          refId: "C-585",
          empty: false,
        },
        name: "ContractList__3_.pdf",
        type: {
          id: "msa",
          name: "Master Service Agreement (MSA)",
          erpId: "",
          empty: false,
        },
        status: "Active",
        attachment: {
          filename: "ContractList__3_.pdf",
          mediatype: "application/pdf",
          size: 77056,
          path: "attachment/2024/3/12/420573276392350182/ContractList__3_.pdf",
          sourceUrl: null,
          reference: null,
          date: null,
          expiration: null,
          name: null,
          note: null,
          eid: null,
          qid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          created: "2024-03-12T06:50:34.690090303Z",
          issueDate: null,
          createdBy: {
            tenantId: "foo",
            tenantName: "Foo Company",
            userName: "john@foo.com",
            userNameCP: null,
            name: "John Doe",
            department: null,
            departmentCode: null,
            departmentErpId: null,
            groupIds: null,
            type: "Tenant",
            email: "john@foo.com",
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: null,
            ip: "182.156.21.2",
            impersonator: null,
            connectionName: null,
            procurementAdmin: true,
            admin: true,
            otp: false,
          },
          docType: null,
          contentKind: "CustomerPrivate",
        },
        pastVersions: [
          {
            filename: "ContractList.pdf",
            mediatype: "application/pdf",
            size: 16888,
            path: "attachment/2024/3/12/420571132646609005/ContractList.pdf",
            sourceUrl: "",
            reference: "",
            date: null,
            expiration: null,
            name: "",
            note: "",
            eid: null,
            qid: null,
            asyncPutUrl: null,
            asyncGetUrl: null,
            created: "2024-03-12T06:42:03.580844328Z",
            issueDate: null,
            createdBy: null,
            docType: null,
            contentKind: "CustomerPrivate",
          },
        ],
        owners: [
          {
            tenantId: "foo",
            tenantName: null,
            userName: "john@foo.com",
            userNameCP: "",
            name: "John Doe",
            department: "",
            departmentCode: null,
            departmentErpId: null,
            groupIds: null,
            type: null,
            email: "john@foo.com",
            phone: null,
            firstName: "",
            lastName: "",
            api: false,
            picture: "",
            ip: null,
            impersonator: null,
            connectionName: null,
            procurementAdmin: false,
            admin: false,
            otp: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 0,
        engagementOnly: false,
        sensitive: false,
        editableByUser: false,
        signatureStatus: "finalised",
        taxDocument: false,
      },
      {
        versionNum: "1",
        created: "2024-03-12T06:43:07.760139774Z",
        updated: "2024-03-12T06:45:07.328638680Z",
        createdBy: {
          tenantId: "foo",
          tenantName: "Foo Company",
          userName: "john@foo.com",
          userNameCP: null,
          name: "John Doe",
          department: null,
          departmentCode: null,
          departmentErpId: null,
          groupIds: null,
          type: "Tenant",
          email: "john@foo.com",
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: "182.156.21.2",
          impersonator: null,
          connectionName: null,
          procurementAdmin: true,
          admin: true,
          otp: false,
        },
        updatedBy: {
          tenantId: "foo",
          tenantName: "Foo Company",
          userName: "john@foo.com",
          userNameCP: null,
          name: "John Doe",
          department: null,
          departmentCode: null,
          departmentErpId: null,
          groupIds: null,
          type: "Tenant",
          email: "john@foo.com",
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: "182.156.21.2",
          impersonator: null,
          connectionName: null,
          procurementAdmin: true,
          admin: true,
          otp: false,
        },
        audit: {
          entries: [
            {
              time: "2024-03-12T06:45:07.328162279",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                userNameCP: null,
                name: "John Doe",
                department: null,
                departmentCode: null,
                departmentErpId: null,
                groupIds: null,
                type: "Tenant",
                email: "john@foo.com",
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "182.156.21.2",
                impersonator: null,
                connectionName: null,
                procurementAdmin: true,
                admin: true,
                otp: false,
              },
              ip: "182.156.21.2",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          departments: null,
          open: false,
        },
        tenantId: "foo",
        id: "420571401853034982",
        normalizedVendorId: "309454481025812318",
        normalizedVendorName: "RMD",
        engagementRef: {
          id: "420558448038732262",
          name: "Contract - Draft Legal Docs to Negotiation",
          refId: "121610",
          empty: false,
        },
        contractRef: {
          id: "420571869317386349",
          name: "Contract - Draft Legal Docs to Negotiation - RMD",
          refId: "C-585",
          empty: false,
        },
        name: "",
        type: {
          id: "nda",
          name: "Non-disclosure Agreement (NDA)",
          erpId: "",
          empty: false,
        },
        status: "Active",
        attachment: {
          filename: "PurchaseOrder.xlsx",
          mediatype:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 28450,
          path: "attachment/2024/3/12/420571401823674854/PurchaseOrder.xlsx",
          sourceUrl: "",
          reference: "",
          date: null,
          expiration: null,
          name: "",
          note: "",
          eid: null,
          qid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          created: "2024-03-12T06:43:07.759846976Z",
          issueDate: null,
          createdBy: null,
          docType: null,
          contentKind: "CustomerPrivate",
        },
        owners: [
          {
            tenantId: "foo",
            tenantName: "Foo Company",
            userName: "john@foo.com",
            userNameCP: null,
            name: "John Doe",
            department: null,
            departmentCode: null,
            departmentErpId: null,
            groupIds: null,
            type: "Tenant",
            email: "john@foo.com",
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: null,
            ip: "182.156.21.2",
            impersonator: null,
            connectionName: null,
            procurementAdmin: true,
            admin: true,
            otp: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 0,
        engagementOnly: false,
        sensitive: false,
        editableByUser: false,
        signatureStatus: "signed",
        taxDocument: false,
      },
      {
        versionNum: "1",
        created: "2024-03-12T06:41:41.775948041Z",
        updated: "2024-03-12T06:45:07.347832666Z",
        createdBy: {
          tenantId: "foo",
          tenantName: "Foo Company",
          userName: "john@foo.com",
          userNameCP: null,
          name: "John Doe",
          department: null,
          departmentCode: null,
          departmentErpId: null,
          groupIds: null,
          type: "Tenant",
          email: "john@foo.com",
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: "182.156.21.2",
          impersonator: null,
          connectionName: null,
          procurementAdmin: true,
          admin: true,
          otp: false,
        },
        updatedBy: {
          tenantId: "foo",
          tenantName: "Foo Company",
          userName: "john@foo.com",
          userNameCP: null,
          name: "John Doe",
          department: null,
          departmentCode: null,
          departmentErpId: null,
          groupIds: null,
          type: "Tenant",
          email: "john@foo.com",
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: "182.156.21.2",
          impersonator: null,
          connectionName: null,
          procurementAdmin: true,
          admin: true,
          otp: false,
        },
        audit: {
          entries: [
            {
              time: "2024-03-12T06:45:07.347279392",
              userId: {
                tenantId: "foo",
                tenantName: "Foo Company",
                userName: "john@foo.com",
                userNameCP: null,
                name: "John Doe",
                department: null,
                departmentCode: null,
                departmentErpId: null,
                groupIds: null,
                type: "Tenant",
                email: "john@foo.com",
                phone: null,
                firstName: null,
                lastName: null,
                api: false,
                picture: null,
                ip: "182.156.21.2",
                impersonator: null,
                connectionName: null,
                procurementAdmin: true,
                admin: true,
                otp: false,
              },
              ip: "182.156.21.2",
            },
          ],
        },
        acl: {
          users: null,
          groups: null,
          workstream: null,
          programs: null,
          departments: null,
          open: false,
        },
        tenantId: "foo",
        id: "420571041206587501",
        normalizedVendorId: "309454481025812318",
        normalizedVendorName: "RMD",
        engagementRef: {
          id: "420558448038732262",
          name: "Contract - Draft Legal Docs to Negotiation",
          refId: "121610",
          empty: false,
        },
        contractRef: {
          id: "420571869317386349",
          name: "Contract - Draft Legal Docs to Negotiation - RMD",
          refId: "C-585",
          empty: false,
        },
        name: "",
        type: {
          id: "orderForm",
          name: "Order form",
          erpId: "",
          empty: false,
        },
        status: "Active",
        attachment: {
          filename: "BusinessUnit.csv",
          mediatype: "text/csv",
          size: 193,
          path: "attachment/2024/3/12/420571041189810285/BusinessUnit.csv",
          sourceUrl: "",
          reference: "",
          date: null,
          expiration: null,
          name: "",
          note: "",
          eid: null,
          qid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          created: "2024-03-12T06:41:41.775792133Z",
          issueDate: null,
          createdBy: null,
          docType: null,
          contentKind: "CustomerPrivate",
        },
        owners: [
          {
            tenantId: "foo",
            tenantName: "Foo Company",
            userName: "john@foo.com",
            userNameCP: null,
            name: "John Doe",
            department: null,
            departmentCode: null,
            departmentErpId: null,
            groupIds: null,
            type: "Tenant",
            email: "john@foo.com",
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: null,
            ip: "182.156.21.2",
            impersonator: null,
            connectionName: null,
            procurementAdmin: true,
            admin: true,
            otp: false,
          },
        ],
        autoRenew: false,
        terminationNoticePeriod: 0,
        engagementOnly: false,
        sensitive: false,
        editableByUser: false,
        signatureStatus: "draft",
        taxDocument: false,
      },
    ],
  },
};