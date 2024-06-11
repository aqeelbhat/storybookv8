import React from "react";
import { StoryFn } from "@storybook/react";

import { ProjectFormReadOnly, ProjectFormData } from "./../../lib";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formData: ProjectFormData = {
  marketingProgram: { id: "", displayName: "Brand", path: "" },
  activityName: "",
  allocadiaId: "1081553",
  startDate: "2021-07-09T13:00:00.000",
  endDate: "2021-07-30T13:00:00.000",
  region: { id: "", displayName: "Global", path: "" },
  service: [{ id: "", displayName: "Creative ", path: " " }],
  estimatedCost: { currency: DEFAULT_CURRENCY, amount: "1000001.19" },
  subsidiary: { id: "", displayName: "Former Optimizely", path: "" },
  accountCode: { id: "", displayName: "4500 Marketing", path: "" },
  user: "Jieun Jeong",
  department: { id: "", displayName: "Corporate Marketing", path: "" },
  summary:
    "In support of the Optimizely & Episerver merger, the Optimizely brand will be updated with a refreshed brand identity. Marketing team will work with Moving Brands as the agency to create all the cross-channel visual assets including new company logo, color palette, typeface, photography style.",
};

const previousFormData: ProjectFormData = {
  marketingProgram: { id: "", displayName: "Brand", path: "" },
  activityName: "",
  allocadiaId: "1081553",
  startDate: "2021-07-09T13:00:00.000",
  endDate: "2021-07-30T13:00:00.000",
  region: { id: "", displayName: "Global", path: "" },
  service: [{ id: "", displayName: "Creative ", path: " " }],
  estimatedCost: { currency: DEFAULT_CURRENCY, amount: "9900000.19" },
  subsidiary: { id: "", displayName: "Former Optimizely", path: "" },
  accountCode: { id: "", displayName: "4500 Marketing", path: "" },
  user: "Jieun Jeong",
  department: { id: "", displayName: "Corporate Marketing", path: "" },
  summary:
    "In support of the Optimizely & Episerver merger, the Optimizely brand will be updated with a refreshed brand identity. Marketing team will work with Moving Brands as the agency to create all the cross-channel visual assets including new company logo, color palette, typeface, photography style.",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Project Form Read Only",
  component: ProjectFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: formData,
    previousFormData,
  },
};
