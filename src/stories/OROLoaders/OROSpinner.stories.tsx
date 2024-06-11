import React from "react";
import { StoryFn } from "@storybook/react";

import { OROSpinner } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/loaders/spinner",
  component: OROSpinner,
};

export const OROSpinnerStory = {
  args: {
    width: 50,
    height: 50,
    color: "red",
  },
};
