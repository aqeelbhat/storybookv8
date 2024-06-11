import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ChangePassword, ChangePasswordProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/change password",
  component: ChangePassword,
};

export const Empty = {
  args: {},
};

export const DefaultUser = {
  args: {
    userName: "string",
    sessionId: "string",
    errorMessage: "string",
  },
};
