import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { StepNav, StepNavProps } from "./../../lib";
import { mockStepList } from "./mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Step Nav",
  component: StepNav,
};

export const Default = {
  args: {
    steps: mockStepList,
    activeStepIndex: 1,
    onStepSelect: action("onStepSelect"),
  },
};

export const CustomActiveStep = {
  args: {
    steps: mockStepList,
    activeStepIndex: 2,
    onStepSelect: action("onStepSelect"),
  },
};
