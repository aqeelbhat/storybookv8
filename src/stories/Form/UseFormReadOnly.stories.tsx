import React from "react";
import { StoryFn } from "@storybook/react";

import { UseFormReadOnly, UseFormData } from "./../../lib";

const formData: UseFormData = {
  title: "Supplier onboarding - Marketing",
  region: { id: "", displayName: "Global", path: "" },
  service: [{ id: "", displayName: "Creative ", path: " " }],
  subsidiary: { id: "", displayName: "Former Optimizely", path: "" },
  additionalSubsidiary: [],
  user: "Jieun Jeong",
  department: { id: "", displayName: "Corporate Marketing", path: "" },
  comment:
    "In support of the Optimizely & Episerver merger, the Optimizely brand will be updated with a refreshed brand identity. Marketing team will work with Moving Brands as the agency to create all the cross-channel visual assets including new company logo, color palette, typeface, photography style.",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Use Form Read Only",
  component: UseFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
