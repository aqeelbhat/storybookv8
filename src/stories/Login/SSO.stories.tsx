import React from "react";
import { StoryFn } from "@storybook/react";

import { SSO, SSOProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Login/SSO",
  component: SSO,
};

export const Default = {
  args: {
    linkText: "Auth Login to realm BAR using Oro id",
    href: "https://ssodomain.com/ssopath",
  },
};
