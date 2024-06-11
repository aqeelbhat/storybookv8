import React from "react";
import { StoryFn } from "@storybook/react";
import { InvoiceValidationForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceValidationFormProps } from "../../../lib/Form/InvoiceValidation/types";

const formData = {
  comment: null,
  rules: [],
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Validation/Empty Rules",
  component: InvoiceValidationForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "rules",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Invoice number",
        __typename: "FormField",
      },
      {
        fieldName: "comment",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
    ],
    formData,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
