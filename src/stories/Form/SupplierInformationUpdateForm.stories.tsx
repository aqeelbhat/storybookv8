import React from "react";
import { StoryFn } from "@storybook/react";

import {
  SupplierInformationUpdateForm,
  OroSupplierInformationUpdateFormProps,
  OroSupplierInformationUpdateForm,
} from "./../../lib";
import { DEFAULT_CURRENCY } from "../../lib/util";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Supplier Information Update Form",
  component: SupplierInformationUpdateForm,
};

const formData: OroSupplierInformationUpdateForm = {
  compantyEntity: {
    erpId: "",
    id: "abc",
    name: "abc",
  },
  companyName: "company Name",
  hasSupplierEmail: false,
  spend: {
    amount: 1000,
    currency: DEFAULT_CURRENCY,
  },
  supplierContactEmail: "",
  vendorCountry: "USA",
  vendorId: "vendor id",
  vendorType: {
    erpId: "",
    id: "vendorId",
    name: "vendor Name",
  },
  isNewSupplier: false,
  taxRegistrationID: "",
  companyDomain: "",
};

const currencies = [
  {
    id: "_Currency__Any__USD",
    displayName: "US Dollar (USD)",
    path: "USD",
    customData: {
      erpId: null,
      code: "USD",
    },
    icon: "",
    selected: false,
    selectable: true,
  },
  {
    id: "_Currency__Any__EUR",
    displayName: "Euro (EUR)",
    path: "EUR",
    customData: {
      erpId: null,
      code: "EUR",
    },
    icon: "",
    selected: false,
    selectable: true,
  },
];

export const TemplateForm = {
  args: {
    data: formData,
    fields: [
      {
        fieldName: "companyName",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "vendorId",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
      },
      {
        fieldName: "vendorType",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "vendorCountry",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "compantyEntity",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "spend",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
      },
      {
        fieldName: "hasSupplierEmail",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "supplierContactEmail",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "isNewSupplier",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "companyDomain",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
      },
      {
        fieldName: "taxRegistrationID",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
      },
    ],
    companyEntities: [],
    vendorTypes: [],
    currencies: currencies,
  },
};
