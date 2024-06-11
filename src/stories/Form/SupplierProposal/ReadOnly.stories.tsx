import React from "react";
import { StoryFn } from "@storybook/react";
import {
  SupplierProposalReadOnly,
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

export default {
  title: "ORO UI Toolkit/Form/Supplier Proposal Upload",
  component: SupplierProposalReadOnly,
};

getI18NInstance(true);

export const ReadOnly = {
  args: {
    formData: {
      supplierProposal: {
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
      proposalExtract: {},
      supplierLegalName: "Noopur Inc.",
      description: "Blah Blah Blah",
      deliveryDate: "05-23-2014",
      totalAmount: { amount: 1000, currency: "USD" },
      country: "US",
      paymentTerm: mockPaymentTerms[0],
    },
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    countryOptions: mockCountryOptions,
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
