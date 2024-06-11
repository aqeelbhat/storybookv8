import React from "react";
import { StoryFn } from "@storybook/react";
import {
  mockCurrencyOptions,
  mockUnitPerQuantity,
} from "../../MultiLevelSelect/mocks";
import { getI18NInstance } from "../../../lib/i18n";
import "./../../common.scss";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import { ItemDetailsControlV2Email } from "../../../lib/controls/itemDetailsV2/Email";
import { ItemDetailsV2ControlPropsNew } from "../../../lib/controls/itemDetailsV2/types";
import { ItemListType } from "../../../lib";

const formData: ItemListType = {
  items: [
    {
      name: "Enterprise Edition - 1 Year Subscription\n$155.25\n+NY-NY CITY",
      description:
        "Description - Enterprise Edition - 1 Year Subscription\n$155.25\n+NY-NY CITY",
      categories: [],
      departments: [
        {
          id: "FAC",
          name: "Facilities",
          erpId: "",
          refId: "",
          empty: false,
        },
      ],
      type: null,
      materialId: "",
      quantity: 12,
      unitForQuantity: {
        id: "lift",
        name: "lift",
        erpId: "",
        refId: "",
        empty: false,
      },
      lineNumber: "1",
      price: {
        amount: 1863,
        currency: "USD",
      },
      totalPrice: {
        amount: 1863,
        currency: "USD",
      },
      tenantPrice: {
        amount: 1737.2249160760912,
        currency: "EUR",
      },
      tenantTotalPrice: {
        amount: 1737.2249160760912,
        currency: "EUR",
      },
      images: [],
      supplierPartId: "",
      manufacturerPartId: "",
      accountCodeIdRef: {
        id: "",
        name: "",
        erpId: "",
        refId: "",
        empty: true,
      },
      erpItemId: null,
      url: "",
      specifications: [],
      customAttributes: null,
      tax: null,
      contacts: null,
      accounting: null,
      trackCode: [],
      itemIds: [],
      lineOfBusiness: null,
      location: null,
      projectCode: null,
      expenseCategory: {
        id: "107",
        name: "Advertising",
        erpId: "107",
        refId: "",
        empty: false,
      },
      nonInventoryPurchaseItem: null,
      accumulator: null,
      startDate: null,
      endDate: null,
      normalizedVendorRef: null,
      costCenter: null,
      data: {},
      dataJson: "{}",
    },
    {
      name: "",
      description: "",
      categories: [],
      departments: [
        {
          id: "FAC",
          name: "Facilities",
          erpId: "",
          empty: false,
        },
      ],
      type: "service",
      materialId: "",
      quantity: null,
      unitForQuantity: null,
      lineNumber: "2",
      price: null,
      totalPrice: null,
      tenantPrice: null,
      tenantTotalPrice: null,
      images: [],
      supplierPartId: "",
      manufacturerPartId: "",
      accountCodeIdRef: {
        id: "",
        name: "",
        erpId: "",
        empty: true,
      },
      erpItemId: null,
      url: "",
      specifications: [],
      customAttributes: null,
      tax: {
        items: [
          {
            percentage: 10,
            taxableAmount: {
              currency: "USD",
              amount: 202,
            },
          },
        ],
      },
      contacts: null,
      accounting: null,
      trackCode: [],
      itemIds: [],
      lineOfBusiness: null,
      location: null,
      projectCode: null,
      expenseCategory: {
        id: "110",
        name: "Building Repairs/Maintenance",
        erpId: "110",
        empty: false,
      },
      nonInventoryPurchaseItem: null,
      accumulator: null,
      startDate: null,
      endDate: null,
      normalizedVendorRef: null,
      costCenter: null,
      data: {},
      dataJson: "{}",
    },
    {
      name: "3rd",
      description: "",
      categories: [
        {
          id: "ALL-10",
          name: "Logistics",
          erpId: "10",
          empty: false,
        },
      ],
      departments: [
        {
          id: "FAC",
          name: "Facilities",
          erpId: "",
          empty: false,
        },
      ],
      type: "service",
      materialId: "",
      quantity: null,
      unitForQuantity: null,
      lineNumber: "3",
      price: null,
      totalPrice: {
        amount: 165.34,
        currency: "USD",
      },
      tenantPrice: null,
      tenantTotalPrice: {
        amount: 154.177545691906,
        currency: "EUR",
      },
      images: [],
      supplierPartId: "",
      manufacturerPartId: "",
      accountCodeIdRef: {
        id: "6180-6182",
        name: "Accounting",
        erpId: "127",
        empty: false,
      },
      erpItemId: null,
      url: "",
      specifications: [],
      customAttributes: null,
      tax: null,
      contacts: null,
      accounting: null,
      trackCode: [],
      itemIds: [],
      lineOfBusiness: null,
      location: null,
      projectCode: null,
      expenseCategory: {
        id: "252",
        name: "Audit Fees",
        erpId: "252",
        empty: false,
      },
      nonInventoryPurchaseItem: null,
      accumulator: null,
      startDate: null,
      endDate: null,
      normalizedVendorRef: null,
      costCenter: null,
      data: {},
      dataJson: "{}",
    },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/Item List Form/Email",
  component: ItemDetailsControlV2Email,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    value: formData,
    isReadOnly: false,
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    unitOptions: mockUnitPerQuantity,

    submitLabel: "Submit",
    subTotalMoney: { amount: 2000000, currency: DEFAULT_CURRENCY },
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  } as ItemDetailsV2ControlPropsNew,
};
