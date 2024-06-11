import React from "react";
import { StoryFn } from "@storybook/react";
import {
  mockCostCenters,
  mockCurrencyOptions,
} from "../../MultiLevelSelect/mocks";
import { getI18NInstance } from "../../../lib/i18n";
import type {
  InvoiceDetailsItemListProps,
  InvoiceDetailsItemListFormData,
} from "../../../lib/Form/InvoiceDetailsItemList/types";
import "./../../common.scss";
import { InvoiceDetailsItemListForm } from "../../../lib";
import { DEFAULT_CURRENCY } from "../../../lib/util";

const formData: InvoiceDetailsItemListFormData = {
  itemList: {
    items: [
      {
        name: "",
        description: null,
        categories: [],
        departments: [
          {
            id: "D9-D90601",
            name: "D90601-G&A-Corporate Technology",
            erpId: "D90601",
            refId: null,
            __typename: "IDRef",
          },
        ],
        type: null,
        materialId: null,
        quantity: null,
        unitForQuantity: null,
        lineNumber: null,
        priceMoney: null,
        supplierPartId: null,
        manufacturerPartId: null,
        accountCodeIdRef: {
          id: "15010",
          name: "15010-Fixed Assets - new account",
          erpId: "15010",
          refId: null,
          __typename: "IDRef",
        },
        url: null,
        erpItemId: null,
        startDate: null,
        endDate: null,
        tax: null,
        accumulator: null,
        itemIds: null,
        lineOfBusiness: null,
        trackCode: null,
        location: null,
        projectCode: null,
        expenseCategory: null,
        dataJson: "{}",
        totalPriceMoney: {
          currency: "GBP",
          amount: 885.48,
          __typename: "MoneyObject",
        },
        __typename: "Item",
      },
      {
        name: "",
        description: null,
        categories: [],
        departments: [
          {
            id: "D9-D90601",
            name: "D90601-G&A-Corporate Technology",
            erpId: "D90601",
            refId: null,
            __typename: "IDRef",
          },
        ],
        type: null,
        materialId: null,
        quantity: null,
        unitForQuantity: null,
        lineNumber: null,
        priceMoney: null,
        supplierPartId: null,
        manufacturerPartId: null,
        accountCodeIdRef: {
          id: "11200",
          name: "11200-VAT Receivable",
          erpId: "11200",
          refId: null,
          __typename: "IDRef",
        },
        url: null,
        erpItemId: null,
        startDate: null,
        endDate: null,
        tax: null,
        accumulator: null,
        itemIds: null,
        lineOfBusiness: null,
        trackCode: null,
        location: null,
        projectCode: null,
        expenseCategory: null,
        dataJson: "{}",
        totalPriceMoney: {
          currency: "GBP",
          amount: 177.1,
          __typename: "MoneyObject",
        },
        __typename: "Item",
      },
    ],
  },
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Details/GBP Test",
  component: InvoiceDetailsItemListForm,
};

getI18NInstance(true);

const Template: StoryFn<InvoiceDetailsItemListProps> = (args) => (
  <InvoiceDetailsItemListForm isReadOnly={false} {...args} />
);

export const TemplateForm = {
  render: Template,

  args: {
    subTotalMoney: { amount: 2000000, currency: DEFAULT_CURRENCY },
    fields: [
      {
        fieldName: "itemList",
        requirement: "required",
        booleanValue: true,
        stringValue: true,
        intValue: false,
        itemConfig: {
          mandatoryFields: ["costCenter"],
          visibleFields: [
            "costCenter",
            "price",
            "tax",
            "quantity",
            "departments",
            "name",
            "trackCode",
            "accountCode",
            "tax",
            "type",
            "name",
            "totalPrice",
            "quantity",
          ],
        },
        title: "Items List",
        __typename: "FormField",
      },
      {
        fieldName: "lineItemsRequired",
        requirement: "optional",
        booleanValue: false,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Line Items Required",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "allowNegative",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Line Items Required",
        questionnaireId: null,
        __typename: "FormField",
      },
    ],
    formData,
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    costCenterOptions: mockCostCenters,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
