import React from "react";
import { StoryFn } from "@storybook/react";

import { OROFileUpload } from "../../lib";
import {
  docFileAcceptType,
  xlsFileAcceptType,
  pdfFileAcceptType,
  imageFileAcceptType,
} from "../../lib/Inputs";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/inputs/file upload",
  component: OROFileUpload,
};

const inputFileAcceptType = `${docFileAcceptType},${xlsFileAcceptType},${pdfFileAcceptType},${imageFileAcceptType}`;

export const OROFileInputStory = {
  args: {
    title: "sow/proposal",
    inputFileAcceptTypes: inputFileAcceptType,
    onFileSelected: (e) => console.log(e),
  },
};
