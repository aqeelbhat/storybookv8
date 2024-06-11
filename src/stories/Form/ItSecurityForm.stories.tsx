import React from "react";
import { StoryFn } from "@storybook/react";

import {
  ItSecurityForm,
  ItSecurityFormProps,
  ItSecurityFormData,
} from "./../../lib";

const itSecurityFormData: ItSecurityFormData = {
  employeeLogin: null,
  externalUserCheck: null,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/It Security Form",
  component: ItSecurityForm,
};

export const TemplateForm = {
  args: {
    formData: itSecurityFormData,
    companyName: "Optimizely",
  },
};
