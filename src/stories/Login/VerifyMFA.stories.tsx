import React from "react";
import { StoryFn } from "@storybook/react";
import { VerifyMFA, VerifyMFAProps, LoginRequest } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/verify mfa",
  component: VerifyMFA,
};

export const Empty = {
  args: {
    secretCode: "hey",
  },
};

export const DefaultUser = {
  args: {
    userName: "string",
    sessionId: "string",
    errorMessage: "",
    secretCode: "hey",
    handleLogin: (data: LoginRequest) => console.log(data),
  },
};
