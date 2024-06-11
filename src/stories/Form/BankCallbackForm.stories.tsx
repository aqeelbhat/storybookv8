import React from "react";
import { StoryFn } from "@storybook/react";
import { BankCallbackForm } from "../../lib";
import { BankCallbackFormProps } from "../../lib/Form/types";

const mockCallBackToOptions = [
  {
    id: "corporate",
    displayName: "Corporate",
    path: "corporate",
    selected: false,
    selectable: true,
  },
  {
    id: "bank",
    displayName: "Bank",
    path: "bank",
    selected: false,
    selectable: true,
  },
];

const mockCallbackOptions = [
  {
    id: "SOC",
    displayName: "Source of Contact",
    path: "sourceContact",
    selected: false,
    selectable: true,
  },
  {
    id: "SIM",
    displayName: "SIM / Existing Vendor Master",
    path: "vendorMaster",
    selected: false,
    selectable: true,
  },
  {
    id: "PI",
    displayName: "Past Invoices",
    path: "pastInvoice",
    selected: false,
    selectable: true,
  },
  {
    id: "COR",
    displayName: "Corporate Website",
    path: "corporateWebsite",
    selected: false,
    selectable: true,
  },
  {
    id: "BO",
    displayName: "Business Owners",
    path: "businessOwners",
    selected: false,
    selectable: true,
  },
  {
    id: "EV",
    displayName: "Email From Vendor",
    path: "emailFromVendor",
    selected: false,
    selectable: true,
  },
];

const finalOutcomeOptions = [
  {
    id: "verified",
    displayName: "Account verified",
    path: "accountVerified",
    selected: false,
    selectable: true,
  },
  {
    id: "contigencyPlanApplied",
    displayName: "Contigency Plan Applied",
    path: "contigencyPlanApplied",
    selected: false,
    selectable: true,
  },
  {
    id: "exceptionRequired",
    displayName: "Exception Required",
    path: "exceptionRequired",
    selected: false,
    selectable: true,
  },
  {
    id: "potentialFraud",
    displayName: "Possible fraud detected",
    path: "potentialFraud",
    selected: false,
    selectable: true,
  },
  {
    id: "supplierUnavailable",
    displayName: "Supplier unavailable",
    path: "supplierUnavailable",
    selected: false,
    selectable: true,
  },
  {
    id: "ignorebankaccount",
    displayName: "Ignore bank account",
    path: "ignoreBankAccount",
    selected: false,
    selectable: true,
  },
];

export default {
  title: "ORO UI Toolkit/Form/Bank Callback Form",
  component: BankCallbackForm,
};

export const TemplateForm = {
  args: {
    formData: {
      callbackTo: "corporate",
      method: null,
      contactName: "Thomas",
      title: "Account Lead",
      email: "c.mango@cmdigital.com",
      phoneNumber: "+91 893 456 7884",
      outcomes: [
        {
          index: 0,
          accountNumber: {
            data: "",
            maskedValue: "********90",
            unencryptedValue: "123456",
            version: "",
            iv: "",
          },
          code: "",
        },
        {
          index: 1,
          accountNumber: {
            data: "",
            maskedValue: "********90",
            unencryptedValue: null,
            version: "",
            iv: "",
          },
          code: "",
        },
      ],
      callbackEvents: [
        {
          callbackTo: "corporate",
          method: "email",
          email: "c.mango@cmdigital.com",
          phoneNumber: "+91 893 456 7884",
          note: "No response via email",
          contactSource: "corporateWebsite",
          contactSources: [
            { erpId: "", id: "sourceContact", name: "Source Contact" },
          ],
          callbackTime: "2022-03-16T05:45:57.754863Z",
          requester: {
            tenantId: "",
            tenantName: null,
            userName: "enduser-john@orolabs.ai",
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
            picture: null,
            ip: null,
            admin: false,
          },
        },
        {
          callbackTo: "corporate",
          method: "phone",
          email: "c.mango@cmdigital.com",
          phoneNumber: "+91 893 456 7884",
          contactSource: "internet",
          contactSources: [
            { erpId: "", id: "corporateWebsite", name: "Corporate website" },
          ],
          note: "No response via phone",
          callbackTime: "2022-03-17T05:45:57.754863Z",
          requester: {
            tenantId: "",
            tenantName: null,
            userName: "enduser-gandharva@orolabs.ai",
            name: "Lisa Smith",
            department: "",
            departmentCode: null,
            groupIds: null,
            type: null,
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: null,
            ip: null,
            admin: false,
          },
        },
        {
          callbackTo: "corporate",
          method: "email",
          email: "c.mango@cmdigital.com",
          note: "I got in touch with Steve from thier finance team. He is yet to submit past 12 months IT bank statements. But all other details are intact.",
          contactSource: "sap",
          contactSources: [
            { erpId: "", id: "pastInvoice", name: "Past Invoice" },
          ],
          callbackTime: "2022-03-18T05:45:57.754863Z",
          noteAttachments: [
            {
              date: null,
              expiration: null,
              filename: "a.csv",
              mediatype: "text/csv",
              name: null,
              note: null,
              path: "attachment/65099653170855936/a.csv",
              reference: null,
              size: 185,
            },
          ],
          requester: {
            tenantId: "",
            tenantName: null,
            userName: "enduser-john@orolabs.ai",
            name: "John Wick",
            department: "",
            departmentCode: null,
            groupIds: null,
            type: null,
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            api: false,
            picture: null,
            ip: null,
            admin: false,
          },
        },
      ],
      noteAttachments: [
        {
          filename: "BIR_2303_COR_Michael_Page_Philippines_Zuellig_Bldg.pdf",
          mediatype: "application/pdf",
          size: "0",
          path: "attachment/2024/1/17/400882136399818727/BIR_2303_COR_Michael_Page_Philippines_Zuellig_Bldg.pdf",
          sourceUrl: "",
          reference: "",
          date: null,
          expiration: null,
          name: "",
          note: "",
          eid: null,
          asyncPutUrl: null,
          asyncGetUrl: null,
          created: null,
          issueDate: null,
          createdBy: null,
          docType: null,
          contentKind: "CustomerPrivate",
        },
      ],
    },
    callBackToOptions: mockCallBackToOptions,
    callBackOptions: mockCallbackOptions,
    outcomeOptions: finalOutcomeOptions,
    submitLabel: "Submit",
  },
};