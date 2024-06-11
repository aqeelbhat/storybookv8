import React from "react";
import { StoryFn } from "@storybook/react";

import type { InvoiceHeaderFormProps } from "../../../lib/Form/InvoiceHeader/types";
import { InvoiceHeaderForm } from "../../../lib";
import {
  mockCurrencyOptions,
  mockPaymentTerms,
} from "../../MultiLevelSelect/mocks";
import { mockCsvFile } from "../../mocks/file.mock";
import { getI18NInstance } from "../../../lib/i18n";
import { DEFAULT_CURRENCY } from "../../../lib/util";

const formData = {
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
  subTotal: { amount: "", currency: DEFAULT_CURRENCY },
  taxAmount: { amount: "", currency: DEFAULT_CURRENCY },
  totalAmount: { amount: "", currency: DEFAULT_CURRENCY },
  defaultCurrency: "",
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Header/Empty",
  component: InvoiceHeaderForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "invoiceNumber",
        requirement: "required",
        booleanValue: true,
        stringValue: true,
        intValue: "Invoice Number",
        itemConfig: null,
        title: "Company name",
        __typename: "FormField",
      },
      {
        fieldName: "invoiceDate",
        requirement: "required",
        booleanValue: null,
        stringValue: true,
        intValue: null,
        itemConfig: null,
        title: "Email",
        __typename: "FormField",
      },
      {
        fieldName: "dueDate",
        requirement: "required",
        booleanValue: null,
        stringValue: true,
        intValue: null,
        itemConfig: null,
        title: "Due Date",
        __typename: "FormField",
      },
      {
        fieldName: "subTotal",
        requirement: "required",
        booleanValue: null,
        stringValue: true,
        intValue: null,
        itemConfig: null,
        title: "Sub Total",
        __typename: "FormField",
      },
      {
        fieldName: "totalAmount",
        requirement: "required",
        booleanValue: null,
        stringValue: true,
        intValue: null,
        itemConfig: null,
        title: "Total",
        __typename: "FormField",
      },
      {
        fieldName: "taxAmount",
        requirement: "required",
        booleanValue: null,
        stringValue: true,
        intValue: null,
        itemConfig: null,
        title: "tax",
        __typename: "FormField",
      },
      {
        fieldName: "paymentTerms",
        requirement: "required",
        booleanValue: null,
        stringValue: null,
        intValue: true,
        itemConfig: null,
        title: "tax",
        __typename: "FormField",
      },
    ],
    formData,
    currencyOptions: mockCurrencyOptions,
    termOptions: mockPaymentTerms,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    loadDocument: () => Promise.resolve(mockCsvFile),
    onSubmit: (data) => {
      console.log(data);
    },
    onCancel: (data) => {},
  },
};
