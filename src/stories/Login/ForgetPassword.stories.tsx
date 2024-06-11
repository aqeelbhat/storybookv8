import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ForgetPassword, ForgetPasswordProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/forget password",
  component: ForgetPassword,
};

export const Empty = {
  args: {},
};

export const DefaultUser = {
  args: {
    userName: "string",
    tenantId: "string",
    errorMessage: "string",
  },
};
