import React from "react";
import { StoryFn } from "@storybook/react";

import { IDRef, InvoiceHeaderReadOnlyForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceHeaderFormProps } from "../../../lib/Form/InvoiceHeader/types";
import { mockPos } from "../../mocks/POs";
import { mockCsvFile } from "../../mocks/file.mock";
const formData = {
  description:
    "sadasdadasda\nasdsdsa\nasdsdsa\nasdsdsa\nasdsdsa\nasdsdsa\nasdsdsa\nasdsdsa\nasdsdsa",
  invoiceAttachment: { filename: "invoice File 1" },
  currency: {
    id: "EUR",
    name: "EUR",
    erpId: "EUR",
    refId: undefined,
    version: undefined,
  } as IDRef,
  type: {
    id: "Invoice",
    name: "Invoice",
    erpId: "EUR",
    refId: undefined,
    version: undefined,
  } as IDRef,
  invoiceNumber: "1234-temp",
  invoiceDate: "2022-01-01",
  dueDate: "2022-02-01",
  subTotal: {
    amount: 0,
    currency: "USD",
  },
  taxAmount: {
    amount: 0,
    currency: "USD",
  },
  totalAmount: {
    amount: 1000000,
    currency: "USD",
  },
  paymentTerms: {
    id: "2",
    name: "Net 21",
    erpId: "2",
    icon: "",
    customData: {
      erpId: "2",
    },
    selected: false,
    selectable: true,
    hierarchy: "Net 21",
  },
  poRefs: [
    {
      id: "325601482560307547",
      name: "ORDA4192",
      erpId: "Apple",
    },
    {
      id: "325601482560307547",
      name: "ORDA4192",
      erpId: "Apple",
    },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Header/Read Only",
  component: InvoiceHeaderReadOnlyForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData,
    loadInvoice: () => Promise.resolve(mockCsvFile),
    dataFetchers: {
      getPO: () => Promise.resolve(mockPos),
    },
  },
};
