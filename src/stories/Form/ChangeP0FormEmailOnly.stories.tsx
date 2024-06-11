import React from "react";
import { StoryFn } from "@storybook/react";

import {
  ChangePoFormEmail,
  ChangePoFormData,
  ActivationStatus,
} from "./../../lib";
import { mockCurrencyOptions } from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { ChangePoFormReadOnlyProps } from "../../lib/Form/changepo-form-readOnly.component";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formData: ChangePoFormData = {
  purchaseOrder: {
    activityName: "Freshdesk PO",
    poNumber: "PO-123",
    normalizedVendorRef: {
      id: "",
      vendorRecordId: "",
      name: "Freshworks, Inc.",
      countryCode: "US",
      legalEntityId: "",
      legalEntityLogo: { metadata: [] },
      contact: {
        fullName: "",
        email: "",
        role: "",
        phone: "",
      },
      activationStatus: ActivationStatus.active,
    },
    companyEntityRef: { id: "", name: "Episerver Inc.", erpId: "" },
    start: "12-19-2022",
    end: "12-19-2022",
    cost: 12000,
    currencyCode: "EUR",
    itemList: {
      items: [
        {
          name: "Item 1",
          quantity: 4,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 25, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 12400, currency: DEFAULT_CURRENCY },
          startDate: "12-19-2022",
          endDate: "12-19-2022",
          trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
        },
      ],
    },
    expenseItemList: {
      items: [
        {
          name: "Item 1",
          quantity: 3,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 20, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 100, currency: DEFAULT_CURRENCY },
          startDate: "12-19-2022",
          endDate: "12-19-2022",
        },
      ],
    },
  },
  startDate: "12-19-2022",
  endDate: "12-19-2022",
  method: "addItem",
  // method: 'editItems',
  poLineItems: {
    items: [
      {
        name: "Item 1",
        quantity: 5,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 20, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 13000, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
        location: { id: "1", name: "Belfast", erpId: "12" },
        projectCode: { id: "101", name: "Book Club", erpId: "101" },
        trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
      },
      {
        name: "Item 2",
        quantity: 4,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 25, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 12400, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
      },
    ],
  },
  expenseLineItems: {
    items: [
      {
        name: "Item 1",
        quantity: 3,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 20, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 100, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
      },
      {
        name: "Item 2",
        quantity: 2,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 10, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 200, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
        location: { id: "1", name: "Chicago", erpId: "1" },
        projectCode: { id: "106", name: "Spot Awards", erpId: "106" },
        expenseCategory: { id: "107", name: "Advertising", erpId: "107" },
        trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
        // nonInventoryPurchaseItem: {id:'136', name: '70910 - Advertising', erpId: '136'}
      },
    ],
  },
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/ChangePO Form/Email",
  component: ChangePoFormEmail,
};

export const TemplateForm = {
  args: {
    data: formData,
    fields: [
      {
        fieldName: "poLineItems",
        itemConfig: {
          visibleFields: [
            "quantity",
            "unitForQuantity",
            "description",
            "price",
            "totalPrice",
            "startDate",
            "endDate",
            "tax",
            "type",
            "categories",
            "location",
            "projectCode",
            "trackCode",
          ],
          mandatoryFields: [],
          readonlyFields: [],
          disableAdd: false,
          disableDelete: false,
        },
      },
      {
        fieldName: "expenseLineItems",
        itemConfig: {
          visibleFields: [
            "quantity",
            "unitForQuantity",
            "description",
            "price",
            "totalPrice",
            "startDate",
            "endDate",
            "tax",
            "type",
            "categories",
            "location",
            "projectCode",
            "expenseCategory",
            "trackCode",
          ],
          mandatoryFields: [],
          readonlyFields: [],
          disableAdd: false,
          disableDelete: false,
        },
      },
      {
        fieldName: "startDate",
        requirement: "required",
      },
      {
        fieldName: "endDate",
        requirement: "required",
      },
      {
        fieldName: "additionalAmount",
        requirement: "required",
      },
      {
        fieldName: "reason",
        requirement: "required",
      },
    ],
    currencyOptions: mockCurrencyOptions,
  },
};
