import React from "react";
import { StoryFn } from "@storybook/react";
import {
  SupplierProposalForm,
  SupplierProposalProps,
  getI18NInstance,
} from "../../../lib";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import {
  mockCountryOptions,
  mockCurrencyOptions,
  mockPaymentTerms,
} from "../../MultiLevelSelect/mocks";
import { mockCsvFile } from "../../mocks/file.mock";

const fields = [
  { fieldName: "supplierProposal", requirement: "required" },
  { fieldName: "supplierLegalName", requirement: "required" },
  { fieldName: "description", requirement: "required" },
  { fieldName: "deliveryDate", requirement: "required" },
  { fieldName: "totalAmount", requirement: "required" },
  { fieldName: "country", requirement: "required" },
  { fieldName: "paymentTerm", requirement: "required" },
  { fieldName: "paymentTermFilterTag", stringValue: null },
  { fieldName: "paymentTermFilterByRegion", booleanValue: true },
];

export default {
  title: "ORO UI Toolkit/Form/Supplier Proposal Upload",
  component: SupplierProposalForm,
};

getI18NInstance(true);

export const Edit = {
  args: {
    formData: {
      // supplierProposal: {
      //   date: null,
      //   expiration: null,
      //   filename: "a.csv",
      //   mediatype: "text/csv",
      //   name: null,
      //   note: null,
      //   path: "attachment/65099653170855936/a.csv",
      //   reference: null,
      //   size: 185
      // },
      // proposalExtract: {},
      // supplierLegalName: 'Noopur Inc.',
      // description: 'Blah Blah Blah',
      // deliveryDate: '05-23-2014',
      // totalAmount: {amount: 1000, currency: 'USD'},
      // country: 'US',
      // paymentTerm: mockPaymentTerms[0]
    },
    fields,
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    countryOptions: mockCountryOptions,
    loadDocument: () => Promise.resolve(mockCsvFile),
    fetchPaymentTerms: () => Promise.resolve(mockPaymentTerms),
    fetchRegion: () => Promise.resolve({ id: "", name: "" }),
  },
};
