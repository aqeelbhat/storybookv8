import React from "react";
import { StoryFn } from "@storybook/react";

import {
  NewSupplierForm,
  SupplierFormProps,
  SupplierInputForm,
} from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/New Supplier Form",
  component: NewSupplierForm,
};

const formData: SupplierInputForm = {
  name: "string",
  website: "string",
  duns: "15-048-3782",
  address: {
    line1: "string",
    line2: "string",
    line3: "string",
    streetNumber: "string",
    unitNumber: "string",
    city: "string",
    province: "string",
    alpha2CountryCode: "string",
    postal: "string",
  },
  note: "string",
  contactName: "string",
  role: "string",
  email: "string",
  phone: "string",
  companyEmail: "string",
  companyPhone: "string",
};

const mockRoleData = [
  { code: "owner", name: "Owner", description: "Owner" },
  {
    code: "account_manager",
    name: "Account Manager",
    description: "Account Manager",
  },
  {
    code: "creative_director",
    name: "Creative Director",
    description: "Creative Director",
  },
];

export const TemplateForm = {
  args: {
    formData: formData,
    supplierRoles: mockRoleData,
    onFormSubmit: (value) => console.log(value),
  },
};

export const TemplateFormreadonly = {
  args: {
    formData: formData,
    readonly: true,
    disabled: true,
    processType: "onboarding",
    supplierRoles: mockRoleData,
  },
};
