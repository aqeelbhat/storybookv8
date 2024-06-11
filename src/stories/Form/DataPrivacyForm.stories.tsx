import React from "react";
import { StoryFn } from "@storybook/react";

import {
  DataPrivacyForm,
  DataPrivacyFormProps,
  DataPrivacyFormData,
} from "./../../lib";

const dataPrivacyFormdata: DataPrivacyFormData = {
  personalIdentifiableInf: null,
  localRegulatoryEU: null,
  localRegulatoryCalifornia: null,
};
//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Data Privacy Form",
  component: DataPrivacyForm,
};

export const TemplateForm = {
  args: {
    formData: dataPrivacyFormdata,
  },
};
