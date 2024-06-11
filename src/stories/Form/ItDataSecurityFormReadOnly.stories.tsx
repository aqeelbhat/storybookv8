import React from "react";
import { StoryFn } from "@storybook/react";

import {
  ItDataSecurityFormReadOnly,
  ItDataSecurityFormData,
} from "./../../lib";

const itDataSecurityFormdata: ItDataSecurityFormData = {
  companySensitiveData: true,
  systemAccessCheck: false,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/It Data Security Form Read Only",
  component: ItDataSecurityFormReadOnly,
};

export const TemplateForm = {
  args: {
    formData: itDataSecurityFormdata,
    companyName: "Optimizely",
  },
};
