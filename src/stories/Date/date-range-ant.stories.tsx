import React from "react";
import { StoryFn } from "@storybook/react";

import { DateRange } from "./../../lib";
import { DateRangeProps } from "../../lib/Inputs/types";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Date range/Ant",
  component: DateRange,
};

export const TemplateForm = {
  args: {
    startDate: "2021-07-13T18:30:00.000",
    endDate: "2021-07-18T18:30:00.000",
  },
};
