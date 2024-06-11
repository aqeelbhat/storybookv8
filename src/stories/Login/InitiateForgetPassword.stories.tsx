import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  InitiateForgetPassword,
  InitiateForgetPasswordProps,
} from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/intiate forget password",
  component: InitiateForgetPassword,
};

export const Empty = {
  args: {
    handleInitiateForgetPassword: (e) => console.log(e),
  },
};

export const DefaultUser = {
  args: {
    ambiguous: true,
    errorMessage: "string",
    handleInitiateForgetPassword: (e) => console.log(e),
  },
};
