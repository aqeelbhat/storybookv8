import React from "react";
import { StoryFn } from "@storybook/react";

import {
  MeasureMilestone,
  MeasureMilestoneProps,
  OroMeasureMilestone,
} from "./../../lib";

const formData: OroMeasureMilestone = {
  measuerDates: [
    {
      name: "Idea",
      index: 1,
      start: "",
      displayName: "Idea 1",
    },
    {
      name: "Evaluated",
      index: 2,
      start: "",
      displayName: "Evaluated 1",
    },
    {
      name: "Approved",
      index: 3,
      start: "",
      displayName: "Approved 1",
    },
    {
      name: "Executed",
      index: 4,
      start: "",
      displayName: "Executed 1",
    },
    {
      name: "First Savings",
      index: 5,
      start: "",
      displayName: "First Savings 1",
    },
  ],
  end: "2021-12-11",
  start: "2021-11-11",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/MeasureMilestone Form",
  component: MeasureMilestone,
};

export const TemplateForm = {
  args: {
    formData,
    activeIndex: 2,
  },
};
