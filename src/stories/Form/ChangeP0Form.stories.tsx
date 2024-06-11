import React from "react";
import { StoryFn } from "@storybook/react";

import { ActivationStatus, ChangePoForm, ChangePoFormData } from "./../../lib";
import { mockCurrencyOptions } from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { ChangePoFormProps } from "../../lib/Form/changepo-form.component";
import { ItemType } from "../../lib/Types/common";
import { mockPos } from "../mocks/POs";
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
          id: "1",
          lineNumber: 231,
          erpItemId: { id: "1", name: "name", erpId: "1" },
          name: "Item 1",
          quantity: 4,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 1000000, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 50000000, currency: DEFAULT_CURRENCY },
          startDate: "12-11-2023",
          endDate: "12-13-2023",
          type: ItemType.goods,
          accountCodeIdRef: { id: "1", name: "name", erpId: "1" },
          trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
        },
      ],
    },
    expenseItemList: {
      items: [
        {
          id: "1",
          lineNumber: 313,
          erpItemId: { id: "1", name: "name", erpId: "1" },
          name: "Item 3",
          quantity: 3,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 250, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 750, currency: DEFAULT_CURRENCY },
          startDate: "12-11-2023",
          endDate: "12-13-2023",
          type: ItemType.goods,
          accountCodeIdRef: { id: "1", name: "name", erpId: "1" },
          trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
        },
      ],
    },
  },
  poRef: {
    // id: "325601482560307547",
    // name: "ORDA4192",
    // erpId: "Apple",
    refId: "XAD",
    empty: false,
  },
  // method: 'editItems',
  poLineItems: {
    items: [
      {
        id: "1",
        name: "Item 2",
        lineNumber: 231,
        erpItemId: { id: "1", name: "name", erpId: "1" },
        quantity: 4,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 25000000, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 12400, currency: DEFAULT_CURRENCY },
        startDate: "01-11-2023",
        endDate: "01-13-2023",
        tax: {
          amount: { amount: 25000000, currency: DEFAULT_CURRENCY },
          items: [
            {
              taxCode: { id: "each", name: "each", erpId: "each" },
              percentage: 20,
              taxableAmount: { amount: 25, currency: DEFAULT_CURRENCY },
              amount: { amount: 25, currency: DEFAULT_CURRENCY },
            },
          ],
        },
        accountCodeIdRef: { id: "1", name: "name", erpId: "1" },
        categories: [
          { id: "1", name: "name", erpId: "1" },
          { id: "2", name: "name2", erpId: "2" },
        ],
        url: "http://google.com",
        materialId: "materialId",
        accumulator: { quantityReceived: 2, quantityBilled: 4 },
        type: ItemType.service,
        departments: [
          { id: "1", name: "Department name 1", erpId: "1" },
          { id: "2", name: "Department name 2", erpId: "2" },
        ],
        location: { id: "1", name: "Belfast", erpId: "12" },
        projectCode: { id: "101", name: "Book Club", erpId: "101" },
        trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
      },
    ],
  },
  expenseLineItems: {
    items: [
      {
        id: "1",
        name: "Item 3",
        lineNumber: 313,
        erpItemId: { id: "1", name: "name", erpId: "1" },
        quantity: 3,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 250, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 750, currency: DEFAULT_CURRENCY },
        startDate: "01-11-2023",
        endDate: "01-13-2023",
        tax: {
          amount: { amount: 250, currency: DEFAULT_CURRENCY },
          items: [
            {
              taxCode: { id: "each", name: "each", erpId: "each" },
              percentage: 10,
              taxableAmount: { amount: 20, currency: DEFAULT_CURRENCY },
              amount: { amount: 20, currency: DEFAULT_CURRENCY },
            },
          ],
        },
        accountCodeIdRef: { id: "1", name: "name", erpId: "1" },
        categories: [
          { id: "1", name: "name", erpId: "1" },
          { id: "2", name: "name2", erpId: "2" },
        ],
        url: "http://orolabs.ai",
        materialId: "materialId",
        accumulator: { quantityReceived: 2, quantityBilled: 4 },
        type: ItemType.service,
        departments: [
          { id: "1", name: "Department name 1", erpId: "1" },
          { id: "2", name: "Department name 2", erpId: "2" },
        ],
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
  title: "ORO UI Toolkit/Form/ChangePO Form/Edit",
  component: ChangePoForm,
};

export const TemplateForm = {
  args: {
    formData,
    fields: [
      {
        fieldName: "editLineItem",
        booleanValue: true,
      },
      {
        fieldName: "method",
        requirement: "required",
      },
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
            "specifications",
            "images",
            "departments",
            "url",
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
            "departments",
            "url",
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
      {
        fieldName: "attachments",
        requirement: "optional",
      },
      {
        fieldName: "poRef",
        requirement: "required",
      },
    ],
    currencyOptions: mockCurrencyOptions,
    loadDocument: () => Promise.resolve(mockCsvFile),
    dataFetchers: {
      getPO: () => Promise.resolve(mockPos),
      searchObjects: () => Promise.resolve({}),
    },
    onSubmit: (data) => {
      console.log("manoj", data);
    },
  },
};
