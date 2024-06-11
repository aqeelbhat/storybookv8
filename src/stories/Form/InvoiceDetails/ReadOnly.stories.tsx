import React from "react";
import { StoryFn } from "@storybook/react";
import { mockCurrencyOptions } from "../../MultiLevelSelect/mocks";
import { InvoiceDetailsItemListForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type {
  InvoiceDetailsItemListProps,
  InvoiceDetailsItemListFormData,
} from "../../../lib/Form/InvoiceDetailsItemList/types";
import "./../../common.scss";
import { DEFAULT_CURRENCY } from "../../../lib/util";

const formData: InvoiceDetailsItemListFormData = {
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
  title: "ORO UI Toolkit/Form/Invoice Details/ReadOnly",
  component: InvoiceDetailsItemListForm,
};

getI18NInstance(true);

const Template: StoryFn<InvoiceDetailsItemListProps> = (args) => (
  <InvoiceDetailsItemListForm isReadOnly {...args} />
);

export const TemplateForm = {
  render: Template,

  args: {
    fields: [
      {
        fieldName: "itemList",
        requirement: "required",
        booleanValue: true,
        stringValue: true,
        intValue: false,
        itemConfig: {
          visibleFields: ["name", "tax", "name", "totalPrice", "quantity"],
        },
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
