import React from "react";
import { StoryFn } from "@storybook/react";

import { ConfirmationDialog, ConfirmationModalProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Modals/Confirmation Dialog",
  component: ConfirmationDialog,
};

export const Default = {
  args: {
    isOpen: true,
    title:
      "Title ttttttttttt tttttttt  We create a “template” of how args map to rendering  We create a “template” of how args map to rendering",
    theme: "coco",
    width: 450,
    isReviewAndTodoModal: true,
    acceptInput: true,
    primaryButton: "Complete",
    secondaryButton: "Continue editing",
  },
};

export const Danger = {
  args: {
    isOpen: true,
    title: "Title",
    description: "Description",
    actionType: "danger",
    theme: "coco",
  },
};

export const CustomButtons = {
  args: {
    isOpen: true,
    title: "You have unfinished request",
    description:
      "It was created on [Time] [Date], do you want to continue with that one?",
    primaryButton: "Primary",
    secondaryButton: "Secondary",
  },
};
