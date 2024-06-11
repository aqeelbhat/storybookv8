import React from "react";
import { StoryFn } from "@storybook/react";
import {
  ActivationStatus,
  ClosePoFormData,
  ClosePoFormEmail,
  ClosePoFormReadOnlyProps,
} from "./../../lib";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formData: ClosePoFormData = {
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
          name: "Item 3",
          quantity: 3,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 15, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 105, currency: DEFAULT_CURRENCY },
          startDate: "12-19-2022",
          endDate: "12-19-2022",
        },
      ],
    },
  },
  poRef: {
    id: "325601482560307547",
    name: "ORDA4192",
    erpId: "Apple",
  },
  reason: "Not Required",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/ClosePO Form/Email",
  component: ClosePoFormEmail,
};

export const TemplateForm = {
  args: {
    data: formData,
    fields: [
      {
        fieldName: "reason",
        requirement: "required",
      },
      {
        fieldName: "poRef",
        requirement: "required",
      },
    ],
  },
};
