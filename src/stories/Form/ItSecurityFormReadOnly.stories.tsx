import React from "react";
import { StoryFn } from "@storybook/react";

import { ItSecurityFormReadOnly, ItSecurityFormData } from "./../../lib";

const itSecurityFormData: ItSecurityFormData = {
  employeeLogin: true,
  externalUserCheck: false,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/It Security Form Read Only",
  component: ItSecurityFormReadOnly,
};

export const TemplateForm = {
  args: {
    formData: itSecurityFormData,
    companyName: "Optimizely",
  },
};
