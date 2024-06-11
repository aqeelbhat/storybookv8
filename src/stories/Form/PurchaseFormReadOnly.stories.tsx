import React from "react";
import { StoryFn } from "@storybook/react";

import { PurchaseFormReadOnly, PurchaseFormData } from "./../../lib";
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
    {
      id: "id2",
      product: { name: "abc" },
      quantity: "1000000",
      description:
        "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
      totalPrice: { amount: "1000", currency: DEFAULT_CURRENCY },
      billing: { id: "id2", displayName: "Option 2", path: "option2" },
    },
  ],
  additionalServices: [
    {
      id: "id1",
      product: { name: "abc" },
      totalPrice: { amount: "1000", currency: DEFAULT_CURRENCY },
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
  contractEnd: "2021-10-30T18:30:00Z",
  contractStart: "2021-09-26T18:30:00Z",
  estimatedTotal: { currency: DEFAULT_CURRENCY, amount: "10000000" },
  currency: DEFAULT_CURRENCY,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Purchase Form ReadOnly",
  component: PurchaseFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: purchaseFormData,
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
