import React from "react";
import { StoryFn } from "@storybook/react";
import { mockCurrencyOptions } from "../../MultiLevelSelect/mocks";
import { InvoiceDetailsForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type {
  InvoiceDetailsFormProps,
  InvoiceDetailsFormData,
} from "../../../lib/Form/InvoiceDetails/types";
import "./../../common.scss";
import { DEFAULT_CURRENCY } from "../../../lib/util";

const formData: InvoiceDetailsFormData = {
  itemList: {
    items: [
      {
        description: "Items Description",
        quantity: 4,
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 1000000, currency: DEFAULT_CURRENCY },
        tax: {
          amount: { amount: 1000000, currency: DEFAULT_CURRENCY },
          items: [
            {
              taxCode: {
                id: "1",
                name: "taxname",
                erpId: "erpid",
                refId: "refId",
                version: "version",
              },
              percentage: 20,
              taxableAmount: { amount: 1000000, currency: DEFAULT_CURRENCY },
              amount: { amount: 1000000, currency: DEFAULT_CURRENCY },
            },
          ],
        },
        totalPrice: { amount: 50000000, currency: DEFAULT_CURRENCY },
      },
      {
        name: "Enterprise Edition - 1 Year Subscription\n$155.25\n+NY-NY CITY",
        quantity: 4,
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 1000000, currency: DEFAULT_CURRENCY },
        tax: {
          amount: { amount: 1000000, currency: DEFAULT_CURRENCY },
          items: [
            {
              taxCode: {
                id: "1",
                name: "taxname",
                erpId: "erpid",
                refId: "refId",
                version: "version",
              },
              percentage: 20,
              taxableAmount: { amount: 1000000, currency: DEFAULT_CURRENCY },
              amount: { amount: 1000000, currency: DEFAULT_CURRENCY },
            },
          ],
        },
        totalPrice: { amount: 50000000, currency: DEFAULT_CURRENCY },
      },
    ],
  },
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Details/RnD",
  component: InvoiceDetailsForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "itemList",
        requirement: "required",
        booleanValue: true,
        stringValue: true,
        intValue: false,
        itemConfig: null,
        title: "Items List",
        __typename: "FormField",
      },
    ],
    formData,
    readonly: false,
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
