import React from "react";
import { StoryFn } from "@storybook/react";

import { ORODatePicker } from "./../../lib";
import { DatePickerProps } from "../../lib/Inputs/types";
import moment from "moment";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Date/single picker",
  component: ORODatePicker,
};

const PERF_START_DATE_RANGE = {
  startDate: null,
  endDate: new Date(moment().subtract(100, "days").toDate()),
};
const PERF_END_DATE_RANGE = {
  startDate: new Date(moment().subtract(200, "days").toDate()),
  endDate: new Date(moment().subtract(100, "days").toDate()),
};

export const TemplateForm = {
  args: {
    value: new Date(moment().subtract(10, "days").toDate()),
    disableDateBeforeAfter: PERF_START_DATE_RANGE,
  },
};

export const DateConfigForm = {
  args: {
    value: "",
    datePickerConfig: ["year", "month"],
    disableDateBeforeAfter: PERF_END_DATE_RANGE,
  },
};
