import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { LoginForm, LoginFormProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/Login Form",
  component: LoginForm,
};

export const Empty = {
  args: {},
};

export const DefaultUser = {
  args: {
    defaultUsername: "john@foo.com",
    defaultPassword: "TeSt1234",
    onSubmit: action("onSubmit"),
    onForgetPasswordClick: action("onForgetPasswordClick"),
  },
};

export const ErrorMessage = {
  args: {
    errorMessage: "Something went wrong, try again.",
  },
};

export const AmbiguousUser = {
  args: {
    ambiguousUser: true,
  },
};
