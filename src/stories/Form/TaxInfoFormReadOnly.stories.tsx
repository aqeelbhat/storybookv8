import React from "react";
import { StoryFn } from "@storybook/react";

import { TaxInfoFormReadOnly, TaxInfoFormData } from "./../../lib";

const formData: TaxInfoFormData = {
  taxId: "1234",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Tax Info Form Read Only",
  component: TaxInfoFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
