import React from "react";
import { StoryFn } from "@storybook/react";

import { OROPhoneInput, OROInputProps } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/inputs/phone",
  component: OROPhoneInput,
};

export const OROPhoneInputStory = {
  args: {
    placeholder: "phone",
    label: "phone",
    value: "+93",
    onChange: (e) => console.log(e),
  },
};
