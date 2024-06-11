import React from "react";
import { StoryFn } from "@storybook/react";

import {
  ItDataSecurityForm,
  ItDataSecurityFormData,
  ItDataSecurityFormProps,
} from "./../../lib";

const itDataSecurityFormdata: ItDataSecurityFormData = {
  companySensitiveData: null,
  systemAccessCheck: null,
};

function handleFormSubmit(formData: ItDataSecurityFormData) {
  console.log(formData);
}

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/It Data Security Form",
  component: ItDataSecurityForm,
};

export const TemplateForm = {
  args: {
    formData: itDataSecurityFormdata,
    onSubmit: handleFormSubmit,
    companyName: "Optimizely",
  },
};
