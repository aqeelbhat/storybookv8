import React from "react";
import { StoryFn } from "@storybook/react";

import { DataPrivacyFormEmail, DataPrivacyFormData } from "./../../lib";

const dataPrivacyFormdata: DataPrivacyFormData = {
  personalIdentifiableInf: true,
  localRegulatoryEU: false,
  localRegulatoryCalifornia: true,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Data Privacy Form Email",
  component: DataPrivacyFormEmail,
};

export const TemplateForm = {
  args: {
    formData: dataPrivacyFormdata,
  },
};
