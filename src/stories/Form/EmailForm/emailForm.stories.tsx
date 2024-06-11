import React from "react";
import { StoryFn } from "@storybook/react";
import { EmailFormComponent } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { EmailFormComponentProps } from "../../../lib/Form/EmailForm/types";
import { mockCsvFile } from "../../mocks/file.mock";

const formData = {
  from: "INV123",
  to: "2023-08-30",
  subject: "2023-09-09",
  body: "sadsadas",
  attachments: [
    { filename: "invoice  1", mediatype: "text/csv" },
    { filename: "invoice sdsdFile 1", mediatype: "text/csv" },
    { filename: "invoice File 1", mediatype: "text/csv" },
    { filename: "invoice File 1 fdas" },
    { filename: "invoice Filesad a 1", mediatype: "text/csv" },
    { filename: "invoice Fisdle 1", mediatype: "text/csv" },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/Email Form",
  component: EmailFormComponent,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "from",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Invoice number",
        __typename: "FormField",
      },
      {
        fieldName: "to",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "subject",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "body",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
      {
        fieldName: "attachments",
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
    loadFile: () => Promise.resolve(mockCsvFile),
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
