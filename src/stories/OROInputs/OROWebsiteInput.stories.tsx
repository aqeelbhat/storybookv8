import React from "react";
import { StoryFn } from "@storybook/react";

import { OROWebsiteInput, OROInputProps } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/inputs/website",
  component: OROWebsiteInput,
};

export const OROWebsiteInputStory = {
  args: {
    name: "website",
    label: "Website",
    placeholder: "website",
    onChange: (e) => console.log(e.target.value),
  },
};
