import React from "react";
import { StoryFn } from "@storybook/react";
import { NewStepNav, StepNavProps } from "../../lib/StepNav";
import { mockStepList, mockStepList_2 } from "./mocks";
import { action } from "@storybook/addon-actions";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/New Step Nav",
  component: NewStepNav,
};

export const Default = {
  args: {
    steps: mockStepList,
    activeStepIndex: 5,
    onStepSelect: action("onStepSelect"),
  },
};

export const customProgressBar = {
  args: {
    steps: mockStepList_2,
    activeStepIndex: 7,
    onStepSelect: action("onStepSelect"),
  },
};

export const customProgressBar2 = {
  args: {
    steps: mockStepList_2,
    activeStepIndex: 15,
    onStepSelect: action("onStepSelect"),
  },
};

export const customProgressBar3 = {
  args: {
    steps: mockStepList_2,
    activeStepIndex: 18,
    onStepSelect: action("onStepSelect"),
  },
};
