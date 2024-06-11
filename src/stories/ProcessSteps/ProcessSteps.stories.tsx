import React from "react";
import { StoryFn } from "@storybook/react";

import {
  LatestReviewSteps,
  LatestReviewStepsProps,
  ProcessStep,
  ProcessSteps,
} from "./../../lib";
import { mockSteps, mockSubProcessSteps } from "./mocks";

function getSubprocessPreviewStpes(subProcessName: string) {
  console.log(subProcessName);
}

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/ProcessSteps/Process Steps",
  component: LatestReviewSteps,
};

export const TemplateForm = {
  args: {
    steps: mockSteps,
    subProcessPreviewSteps: mockSubProcessSteps,
    daysToComplete: 50,
    futuretaskEvaluationFlag: false,
    fetchPreviewSubprocess: getSubprocessPreviewStpes,
  },
};
