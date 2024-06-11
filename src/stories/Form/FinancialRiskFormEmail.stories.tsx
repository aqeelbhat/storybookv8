import React from "react";
import { StoryFn } from "@storybook/react";

import { FinancialRiskFormEmail, FinancialRiskFormData } from "./../../lib";

const financialRiskFormdata: FinancialRiskFormData = {
  companyLiability: true,
  supplierLiability: false,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Financial Risk Form Email",
  component: FinancialRiskFormEmail,
};

export const TemplateForm = {
  args: {
    formData: financialRiskFormdata,
    companyName: "Optimizely",
  },
};
