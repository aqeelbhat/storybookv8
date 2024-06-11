import React from "react";
import { StoryFn } from "@storybook/react";

import { RequestIcon, RequestIconProps } from "./../../lib";

export default {
  title: "ORO UI Toolkit/RequestIcon",
  component: RequestIcon,
};

const Template: StoryFn<RequestIconProps> = (args) => <RequestIcon {...args} />;

export const ShowIcon = Template;
ShowIcon.args = {
  iconName: "campaign",
};
