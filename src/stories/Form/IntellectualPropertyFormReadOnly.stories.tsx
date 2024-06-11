import React from "react";
import { StoryFn } from "@storybook/react";

import {
  IntellectualPropertyFormReadOnly,
  IntellectualPropertyFormData,
} from "./../../lib";

const intellectualPropertyFormdata: IntellectualPropertyFormData = {
  companyRights: true,
  accessToCompanyIP: false,
  confidentiality: true,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Intellectual Property Form Read Only",
  component: IntellectualPropertyFormReadOnly,
};

export const TemplateForm = {
  args: {
    formData: intellectualPropertyFormdata,
    companyName: "Optimizely",
  },
};
