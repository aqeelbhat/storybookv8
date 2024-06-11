import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierEditERPDetailsForm, getI18NInstance } from "../../../lib";
import { SupplierERPDetailsProps } from "../../../lib/Form/SupplierEditERP/types";
import {
  mockCountryOptions,
  mockPaymentTerms,
} from "../../MultiLevelSelect/mocks";
import {
  mockVendorExtensionCustomFormData,
  mockVendorExtensionFormDefinition,
} from "./mock";

export default {
  title: "ORO UI Toolkit/Form/Supplier ERP Details/Edit",
  component: SupplierEditERPDetailsForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData: {
      id: "199975663422144586",
      vendorId: "101036",
      vendorName: "Microsoft Corporation",
      vendorCompanyInfo: [
        {
          companyCode: {
            id: "1710",
            name: "Company 1710",
            erpId: "1710",
          },
          bankAccounts: [],
          taxes: [],
          currencies: [],
          paymentTerm: {
            id: "NT60",
            name: "Net 60",
            erpId: "NT60",
          },
          questionnaireId: {
            name: "Company Code Extension",
            id: "309880489030346114",
            formId: "Company_Code_Extension",
            custom: true,
          },
          alternatePayees: [
            {
              id: "3434343434343434",
              vendorId: "333444",
              currencies: ["USD"],
              paymentTerm: {
                id: "NT30",
                name: "Net 30",
                erpId: "NT30",
              },
            },
          ],
        },
        {
          companyCode: {
            id: "1712",
            name: "Company 1712",
            erpId: "1712",
          },
          bankAccounts: [],
          taxes: [],
          currencies: [],
          paymentTerm: {
            id: "NT15",
            name: "Net 15",
            erpId: "NT15",
          },
          questionnaireId: {
            name: "Company Code Extension",
            id: "309880489030346114",
            formId: "Company_Code_Extension",
            custom: true,
          },
          alternatePayees: [
            {
              id: "3434343434343434",
              vendorId: "333446",
              currencies: ["USD"],
              paymentTerm: {
                id: "NT15",
                name: "Net 15",
                erpId: "NT15",
              },
            },
          ],
        },
        {
          companyCode: {
            id: "1711",
            name: "Company 1711",
            erpId: "1711",
          },
          bankAccounts: [],
          taxes: [],
          currencies: [],
          paymentTerm: {
            id: "NT60",
            name: "Net 60",
            erpId: "NT60",
          },
          questionnaireId: {
            name: "Company Code Extension",
            id: "309880489030346114",
            formId: "Company_Code_Extension",
            custom: true,
          },
          alternatePayees: [
            {
              id: "3434343434343434",
              vendorId: "333445",
              currencies: ["USD"],
              paymentTerm: {
                id: "NT60",
                name: "Net 60",
                erpId: "NT60",
              },
            },
          ],
        },
      ],
      vendorPurchaseOrgInfo: [
        {
          purchaseOrg: {
            id: "1710",
            name: "Purchase Org 1710",
            erpId: "1710",
          },
          bankAccounts: [],
          taxes: [],
          currencies: [],
          paymentTerm: {
            id: "NT60",
            erpId: "NT60",
          },
          questionnaireId: {
            name: "Company Code Extension",
            id: "309876804564968834",
            formId: "Company_Code_Extension",
            custom: true,
          },
          partners: [
            {
              function: {
                id: "OrderingAddress",
                name: "Ordering Address",
                erpId: "OA",
              },
              ref: {
                id: "1212121212121211",
                vendorId: "1112221",
              },
            },
            {
              function: {
                id: "invoicingPartner",
                name: "Invoicing Partner (IP)",
                erpId: "IP",
              },
              ref: {
                id: "1212121212121212",
                vendorId: "1112222",
              },
            },
          ],
          incoTerms: [
            {
              id: "DAP",
              name: "Delivered at Place (DAP)",
              erpId: "DAP",
            },
          ],
        },
        {
          purchaseOrg: {
            id: "1711",
            name: "Purchase Org 1711",
            erpId: "1711",
          },
          bankAccounts: [],
          taxes: [],
          currencies: [],
          paymentTerm: {
            id: "NT30",
            erpId: "NT30",
          },
          questionnaireId: {
            name: "Company Code Extension",
            id: "309876804564968834",
            formId: "Company_Code_Extension",
            custom: true,
          },
          partners: [
            {
              function: {
                id: "OrderingAddress",
                name: "Ordering Address",
                erpId: "OA",
              },
              ref: {
                id: "1212121212121211",
                vendorId: "1112221",
              },
            },
            {
              function: {
                id: "invoicingPartner",
                name: "Invoicing Partner (IP)",
                erpId: "IP",
              },
              ref: {
                id: "1212121212121212",
                vendorId: "1112222",
              },
            },
          ],
          incoTerms: [
            {
              id: "DAP",
              name: "Delivered at Place (DAP)",
              erpId: "DAP",
            },
          ],
          blockStatuses: ["purchasingBlocked"],
        },
      ],
      vendorIdentificationNumbers: [
        {
          identificationType: {
            id: "AribaNetwork",
            name: "Ariba Network",
          },
          identificationNumber: "AN01000000123",
          description: "Ariba Network ID description goes here",
          validityStartDate: "2024-01-1",
          validityEndDate: "2050-02-15",
          country: {
            id: "US",
            name: "United States",
          },
          region: {
            id: "americas",
            name: "Americas",
          },
        },
        {
          identificationType: {
            id: "AribaNetwork",
            name: "Ariba Network",
          },
          identificationNumber: "AN01000000124",
          description: "Ariba Network Ltd",
          validityStartDate: "2024-02-15",
          validityEndDate: "2050-02-15",
          country: {
            id: "US",
            name: "United States",
          },
          region: {
            id: "americas",
            name: "Americas",
          },
        },
        {
          identificationType: {
            id: "AribaNetwork",
            name: "Ariba Network",
          },
          identificationNumber: "AN01000000125",
          description: "SAP Ariba Network",
          validityStartDate: "2024-01-1",
          validityEndDate: "2050-01-31",
          country: {
            id: "US",
            name: "United States",
          },
          region: {
            id: "americas",
            name: "Americas",
          },
        },
      ],
      location: {
        id: "199938701927645184",
        name: "Microsoft",
        billing: true,
        billingDefault: true,
        functions: {},
        address: {
          line1: "1 Microsoft Way",
          line2: "",
          line3: "",
          streetNumber: "",
          unitNumber: "",
          city: "Redmond",
          province: "US-WA",
          alpha2CountryCode: "US",
          postal: "98052",
          language: "",
        },
        banks: [],
        taxes: [],
        contacts: [],
        idString: "199938701927645184",
      },
      vendorHeaderLevelPostingBlocked: false,
      vendorHeaderLevelPurchasingBlocked: false,
      vendorHeaderLevelPaymentBlocked: false,
      vendorHeaderQuestionnaireId: {
        name: "Vendor Header Extension Form",
        id: "410808264480837855",
        formId: "Vendor_Header_Extension_Form",
        custom: true,
      },
    },
    fields: [
      {
        fieldName: "vendorHeaderLevelPurchasingBlocked",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Purchasing Blocked",
        __typename: "FormField",
      },
      {
        fieldName: "vendorHeaderLevelPaymentBlocked",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Payment Blocked",
        __typename: "FormField",
      },
      {
        fieldName: "vendorHeaderLevelPostingBlocked",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Posting Blocked",
        __typename: "FormField",
      },
      {
        fieldName: "vendorCompanyInfo",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Vendor Company Info",
        __typename: "FormField",
      },
      {
        fieldName: "vendorPurchaseOrgInfo",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Vendor Purchase Org Info",
        __typename: "FormField",
      },
      {
        fieldName: "vendorIdentificationNumbers",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Identification Numbers",
        __typename: "FormField",
      },
      {
        fieldName: "location",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Location",
        __typename: "FormField",
      },
    ],
    paymentTermOption: mockPaymentTerms,
    countryOptions: mockCountryOptions,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    fetchVendorExtensionCustomFormDefinition: () => {
      return Promise.resolve(mockVendorExtensionFormDefinition);
    },
    fetchVendorExtensionCustomFormData: () => {
      return Promise.resolve({
        formData: mockVendorExtensionCustomFormData,
        formId: "Vendor_Header_Extension_Form",
      });
    },
    onSubmit: (data) => {
      console.log("submit data", data);
    },
  },
};
