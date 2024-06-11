import React from "react";
import { StoryFn } from "@storybook/react";
import { InvoiceSummaryForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceSummaryFormProps } from "../../../lib/Form/InvoiceSummary/types";
import { mockUser, mockUsers } from "../../MultiLevelSelect/mocks";

const formData = {
  bookingPeriod: "",
  invoiceNumber: "INV123",
  invoiceDate: "2023-08-30",
  dueDate: "2023-09-09",
  poApprover: mockUser,
  totalAmount: {
    amount: 1e2,
    currency: "EUR",
  },
  supplier: {
    refId: "351722676630096650",
    id: "351722674180623114",
    supplierName: "Invoice Supplier",
    countryCode: "US",
    selected: false,
    msaInPlace: false,
    ndaInPlace: false,
    ndaAttached: false,
    msaAttached: false,
    address: {
      line1: "Invoice",
      city: "Intake",
      province: "Test",
      alpha2CountryCode: "US",
    },
    langCode: "en-US",
    activationStatus: "newSupplier",
    newSupplier: true,
    selectedVendorRecord: {
      vendorId: "V1234 Invoice",
      name: "Vendor Invoice",
      enabled: false,
      additionalCompanyEntities: [],
    },
    vendorRecords: [],
    createNewVendor: false,
    newCountryEnable: false,
    potentialMatchIgnore: false,
    individual: false,
    legalEntity: {
      logo: {
        metadata: [
          {
            height: 100,
            path: "oro/images/small/88868992679429039.png",
            width: 100,
          },
          {
            height: 200,
            path: "oro/images/large/88868992679429039.png",
            width: 200,
          },
        ],
      },
    },
  },
  poNumber: "PO12345",
  details: null,
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Summary/With Booking Amount",
  component: InvoiceSummaryForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "invoiceNumber",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Invoice number",
        __typename: "FormField",
      },
      {
        fieldName: "invoiceDate",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "dueDate",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "totalAmount",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "supplier",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "poNumber",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "details",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      ,
      {
        fieldName: "bookingPeriod",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
    ],
    useBookingPeriod: true,
    formData,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    getAllUsers: () => Promise.resolve(mockUsers),
    onCancel: (data) => {},
  },
};
