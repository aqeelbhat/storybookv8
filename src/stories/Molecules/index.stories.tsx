import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import ActionComp from "./../../lib/controls/actions/index";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ORO UI Toolkit/Molecules/Action",
  component: ActionComp,
} as Meta<typeof ActionComp>;

export const Actions = {
  render: (args) => (
    <ActionComp
      onCancel={() => {}}
      onSubmit={() => {}}
      submitLabel="Submit"
      cancelLabel="Cancel"
    ></ActionComp>
  ),
};

export const WithoutSeparator = {
  render: (args) => (
    <ActionComp
      onCancel={() => {}}
      onSubmit={() => {}}
      submitLabel="Submit"
      cancelLabel="Cancel"
      hideSeparate
    ></ActionComp>
  ),
};
