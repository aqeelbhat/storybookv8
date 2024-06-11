import React from "react";
import { StoryFn } from "@storybook/react";

import { FinancialRiskFormReadOnly, FinancialRiskFormData } from "./../../lib";

const financialRiskFormdata: FinancialRiskFormData = {
  companyLiability: true,
  supplierLiability: false,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Financial Risk Form Read Only",
  component: FinancialRiskFormReadOnly,
};

export const TemplateForm = {
  args: {
    formData: financialRiskFormdata,
    companyName: "Optimizely",
  },
};
