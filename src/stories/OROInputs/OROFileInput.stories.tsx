import React from "react";
import { StoryFn } from "@storybook/react";

import { OROFileInput } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/inputs/file",
  component: OROFileInput,
};
const csvFileAcceptType = "text/csv";

export const OROFileInputStory = {
  args: {
    inputFileAcceptTypes: csvFileAcceptType,
    onFileSelected: (e) => console.log(e),
  },
};
