import React from "react";
import { StoryFn } from "@storybook/react";

import { PurchaseForm, PurchaseFormProps, PurchaseFormData } from "./../../lib";
import {
  mockCurrencyOptions,
  mockOptionsDefault,
  mockOptionsDefault2,
  mockOptionsRegion,
} from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { DEFAULT_CURRENCY } from "../../lib/util";

const purchaseFormData: PurchaseFormData = {
  purchaseType: "data",
  requestType: { id: "id1", displayName: "Option 1", path: "option1" },
  products: [
    {
      id: "id1",
      product: { name: "abc" },
      quantity: "1000000",
      description:
        "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
      totalPrice: { amount: "1000", currency: DEFAULT_CURRENCY },
      billing: { id: "id2", displayName: "Option 2", path: "option2" },
    },
  ],
  orderForm: {
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
  additionalServices: [],
  contractEnd: "2021-10-30T18:30:00Z",
  contractStart: "2021-09-26T18:30:00Z",
  estimatedTotal: { currency: DEFAULT_CURRENCY, amount: "10000000" },
  currency: DEFAULT_CURRENCY,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Purchase Form",
  component: PurchaseForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        configOnly: false,
        displayType: "paymentMethod",
        fieldName: "paymentMethod",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "omitted",
        sectionTitle: null,
        title: "Payment Method",
        type: "string",
      },
    ],
    formData: purchaseFormData,
    requestTypeOptions: mockOptionsRegion,
    currencyOptions: mockCurrencyOptions,
    subsidiaryOptions: mockOptionsDefault,
    accountCodeOptions: mockOptionsDefault2,
    billingOptions: mockOptionsDefault2,
    onProductSearch: () =>
      Promise.resolve([
        {
          name: "temp",
          plans: ["Individual"],
          image:
            "https://www.cnm.edu/depts/mco/marketing/images/linkedin-logo.png",
        },
      ]),
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
