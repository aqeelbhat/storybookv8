import React from "react";
import { StoryFn } from "@storybook/react";
import {
  PrioritySelector,
  PrioritySelectorProps,
} from "../../lib/SupplierProfileEngagementListing/prioritySelector.component";
import { prioritySelectorMock } from "../mocks/PrioritySelectorMock";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/PrioritySelector/PrioritySelector",
  component: PrioritySelector,
};

export const PrioritySelectorTemplate = {
  args: {
    options: prioritySelectorMock,
  },
};
