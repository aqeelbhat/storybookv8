import React from "react";
import { StoryFn } from "@storybook/react";

import {
  IntellectualPropertyForm,
  IntellectualPropertyFormProps,
  IntellectualPropertyFormData,
} from "./../../lib";

const intellectualPropertyFormdata: IntellectualPropertyFormData = {
  companyRights: null,
  accessToCompanyIP: null,
  confidentiality: null,
};

function handleFormSubmit(formData: IntellectualPropertyFormData) {
  console.log(formData);
}

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Intellectual Property Form",
  component: IntellectualPropertyForm,
};

export const TemplateForm = {
  args: {
    formData: intellectualPropertyFormdata,
    onSubmit: handleFormSubmit,
    companyName: "Optimizely",
  },
};
