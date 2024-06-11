import React from "react";
import { StoryFn } from "@storybook/react";

import { ProcessStep, ReviewForm, ReviewFormProps } from "./../../lib";
import { mockSteps } from "../ProcessSteps/mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Review Form",
  component: ReviewForm,
};

function getComment(comment: string) {
  console.log(comment);
}

export const TemplateForm = {
  args: {
    steps: mockSteps,
    contact: {
      email: "John@Doe.com",
      role: "Account manager",
      firstName: "John",
      lastName: "Doe",
    },
    onCommentChange: getComment,
  },
};
