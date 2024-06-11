import React from "react";
import { StoryFn } from "@storybook/react";
import { InvoiceEmailAttachmentsForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import { mockCsvFile } from "../../mocks/file.mock";
import type { IEmailAttachmentFormProps } from "../../../lib/Form/InvoiceEmailAttachments/types";
const formData = {
  selectedAttachmentIndex: 0,
  attachments: [
    { filename: "pdfName", mediatype: "text/csv" },
    { filename: "pdfName", mediatype: "text/csv" },
    { filename: "pdfName", mediatype: "text/csv" },
    { filename: "pdfName", mediatype: "text/csv" },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Email Attachment/ReadOnly",
  component: InvoiceEmailAttachmentsForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    isReadOnly: true,
    fields: [
      {
        fieldName: "attachments",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Attachments",
        __typename: "FormField",
      },
      {
        fieldName: "selectedAttachmentIndex",
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
    loadInvoice: () => Promise.resolve(mockCsvFile),
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
