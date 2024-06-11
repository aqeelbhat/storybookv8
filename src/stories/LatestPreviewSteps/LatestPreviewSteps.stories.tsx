import React from "react";
import { StoryFn } from "@storybook/react";

import { LatestReviewSteps, LatestReviewStepsProps } from "./../../lib";
import { mockSteps } from "./mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/LatestReviewSteps/Latest Review Steps",
  component: LatestReviewSteps,
};

export const TemplateForm = {
  args: {
    steps: mockSteps,
    daysToComplete: 18,
    hideSteps: true,
  },
};
