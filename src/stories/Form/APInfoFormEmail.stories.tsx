import React from "react";
import { StoryFn } from "@storybook/react";

import { APFormEmail, APFormData } from "./../../lib";

const formData: APFormData = {
  method: { id: "manual", path: "manual", displayName: "Create vendor" },
  companyEntity: { id: "", displayName: "Former Optimizely", path: "" },
  additionalCompanyEntities: [],
  eligible1099: true,
  syncToProcurement: false,
  paymentTerms: { id: "", displayName: "Net 45", path: "" },
  currency: { id: "", displayName: "INR", path: "" },
  expenseAccount: { id: "", displayName: "4500 Marketing", path: "" },
  vendorId: "",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/AP Review Form Email",
  component: APFormEmail,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
