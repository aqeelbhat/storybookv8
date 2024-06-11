import React from "react";
import { StoryFn } from "@storybook/react";
import { SetupMFA, ChangePasswordProps, LoginRequest } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/setup mfa",
  component: SetupMFA,
};

export const Empty = {
  args: {},
};

export const DefaultUser = {
  args: {
    userName: "string",
    sessionId: "string",
    errorMessage: "",
    handleLogin: (data: LoginRequest) => console.log(data),
  },
};
