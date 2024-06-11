import React from "react";
import { StoryFn } from "@storybook/react";

import { TaxInfoForm, TaxInfoFormData, TaxInfoFormProps } from "./../../lib";

const formData: TaxInfoFormData = {
  taxId: "",
};

export default {
  title: "ORO UI Toolkit/Form/Tax Form",
  component: TaxInfoForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "taxId",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Tax Id",
        type: "string",
      },
    ],
    formData,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
  },
};
