import React from "react";
import { StoryFn } from "@storybook/react";

import { IDRef, InvoiceHeaderForm } from "../../../lib";
import {
  mockCurrencyOptions,
  mockPaymentTerms,
} from "../../MultiLevelSelect/mocks";
import { mockCsvFile } from "../../mocks/file.mock";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceHeaderFormProps } from "../../../lib/Form/InvoiceHeader/types";

getI18NInstance(true);

const formData = {
  currency: {
    id: "GBP",
    name: "GBP",
    erpId: "GBP",
    refId: undefined,
    version: undefined,
  } as IDRef,

  invoiceNumber: "1234-temp",
  invoiceDate: "2022-01-01",
  dueDate: "2022-02-01",
  subTotal: { amount: 12300, currency: "EUR" },
  taxAmount: { amount: 200, currency: "EUR" },
  totalAmount: { amount: 12200, currency: "EUR" },
  paymentTerms: {
    id: "id5",
    name: "Net 30",
    erpId: "4",
    icon: "",
  },
  suggestedPos: [
    {
      id: "269445510513754038",
      poNumber: "ORDA2646",
      companyEntityRef: {
        id: "HH",
        name: "Honeycomb Holdings Inc.",
        erpId: "4",
        empty: false,
      },
      cost: 159933,
      currencyCode: "USD",
      syncFrom: {
        id: "netsuite",
        name: "NetSuite",
        empty: false,
      },
    },
  ],
  poRefs: [
    {
      id: "269445510513754038",
      poNumber: "ORDA2646",
      companyEntityRef: {
        id: "HH",
        name: "Honeycomb Holdings Inc.",
        erpId: "4",
        empty: false,
      },
      cost: 159933,
      currencyCode: "USD",
      syncFrom: {
        id: "netsuite",
        name: "NetSuite",
        empty: false,
      },
    },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Header",
  component: InvoiceHeaderForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "invoiceNumber",
        requirement: "required", // omitted// optional
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
        title: "Invoice date",
        __typename: "FormField",
      },
      {
        fieldName: "dueDate",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Due date",
        __typename: "FormField",
      },
      {
        fieldName: "description",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Description",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "subTotal",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Sub total",
        __typename: "FormField",
      },
      {
        fieldName: "currency",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Currency",
        __typename: "FormField",
      },
      {
        fieldName: "taxAmount",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Tax",
        __typename: "FormField",
      },
      {
        fieldName: "totalAmount",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Total amount",
        __typename: "FormField",
      },
      {
        fieldName: "paymentTerms",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Payment terms",
        __typename: "FormField",
      },
      {
        fieldName: "poRefs",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Purchase orders",
        __typename: "FormField",
      },
      {
        fieldName: "contractRefs",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Contracts",
        __typename: "FormField",
      },
      {
        fieldName: "type",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Type",
        __typename: "FormField",
      },
      {
        fieldName: "allowNegative",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Type",
        __typename: "FormField",
      },
    ],
    formData,
    defaultCurrency: "INR",
    currencyOptions: mockCurrencyOptions,
    typeOptions: mockCurrencyOptions,
    termOptions: mockPaymentTerms,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    loadDocument: () => Promise.resolve(mockCsvFile),
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
