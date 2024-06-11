import React from "react";
import { StoryFn } from "@storybook/react";

import { QuotesForm } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Quotes Form",
  component: QuotesForm,
};

const mockProposals = [
  {
    date: null,
    expiration: null,
    filename: "a.csv",
    mediatype: "text/csv",
    name: null,
    note: null,
    path: "attachment/65099653170855936/a.csv",
    reference: null,
    size: 185,
  },
];
const mockAdditionalDoc = [
  {
    date: null,
    expiration: null,
    filename: "abcd.csv",
    mediatype: "text/csv",
    name: null,
    note: null,
    path: "attachment/65099653170855936/a.csv",
    reference: null,
    size: 185,
  },
];

const docFileAcceptType =
  ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const xlsFileAcceptType =
  ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const pdfFileAcceptType = "application/pdf,.pdf";
const csvFileAcceptType = "text/csv";
const inputFileAcceptType = `${docFileAcceptType},${xlsFileAcceptType},${pdfFileAcceptType},${csvFileAcceptType}`;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<{}> = (args) => (
  <QuotesForm
    proposals={mockProposals}
    additionalDocs={mockAdditionalDoc}
    {...args}
  />
);
function fileUpload(
  file: File,
  fieldName: string,
  fileName: string,
): Promise<boolean> {
  if (file) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}

export const TemplateForm = {
  render: Template,

  args: {
    inputFileAcceptType: inputFileAcceptType,
    onFileUpload: fileUpload,
    deleteFile: (e) => console.log(e),
  },
};
