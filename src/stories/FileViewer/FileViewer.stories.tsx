import React from "react";
import { StoryFn } from "@storybook/react";

import { DocViewerComponent } from "./../../lib";
import { IDocument } from "@cyntler/react-doc-viewer";

const sampleData = {
  string: "this is a test string",
  integer: 42,
  array: [1, 2, 3, "test", null],
  float: 3.14159,
  object: {
    "first-child": true,
    "second-child": false,
    "last-child": null,
  },
  string_number: "1234",
  date: "2023-01-04T06:20:23.365Z",
};

export default {
  title: "ORO UI Toolkit/File Viewer/Doc renderes",
  component: DocViewerComponent,
};

export const TemplateForm = {
  args: {
    IDocument: {
      uri: "abc.svg",
      fileName: "svg",
      fileType: "svg",
    },
  },
};
