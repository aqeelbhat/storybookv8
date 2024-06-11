import React from "react";
import { StoryFn } from "@storybook/react";
import { InvoiceDuplicateForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceDuplicateFormProps } from "../../../lib/Form/InvoiceDuplicate/types";

const formData = {
  duplicateInvoice: null,
  comment: "Hi how are you",
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Duplicate/No Duplicate",
  component: InvoiceDuplicateForm,
};

getI18NInstance(true);

const Template: StoryFn<InvoiceDuplicateFormProps> = (args) => (
  <InvoiceDuplicateForm {...args}>
    <div>Children comes here</div>
  </InvoiceDuplicateForm>
);

export const TemplateForm = {
  render: Template,

  args: {
    fields: [
      {
        fieldName: "duplicateInvoice",
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
