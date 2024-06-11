import React from "react";
import { StoryFn } from "@storybook/react";

import {
  FinancialRiskForm,
  FinancialRiskFormProps,
  FinancialRiskFormData,
} from "./../../lib";

const financialRiskFormdata: FinancialRiskFormData = {
  companyLiability: null,
  supplierLiability: null,
};

function handleFormSubmit(formData: FinancialRiskFormData) {
  console.log(formData);
}

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Financial Risk Form",
  component: FinancialRiskForm,
};

export const TemplateForm = {
  args: {
    formData: financialRiskFormdata,
    onSubmit: handleFormSubmit,
    companyName: "Optimizely",
  },
};
