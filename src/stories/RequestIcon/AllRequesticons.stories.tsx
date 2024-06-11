import React from "react";
import { StoryFn } from "@storybook/react";

import { AllRequestIcon, AllRequestIconProps } from "../../lib";

export default {
  title: "ORO UI Toolkit/AllRequestIcon",
  component: AllRequestIcon,
};

const Template: StoryFn<AllRequestIconProps> = (args) => (
  <AllRequestIcon {...args} />
);

export const ShowAllIcon = Template;
ShowAllIcon.args = {
  selectedIcon: "laptop",
  height: "100px",
  width: "100px",
};
