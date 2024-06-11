import React from "react";
import { StoryFn } from "@storybook/react";

import { OtherKpiForm, OtherKpiFormProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Other Kpi Form",
  component: OtherKpiForm,
};

export const TemplateForm = {
  args: {
    formData: {
      otherKpi: ["abc", "xyz"],
    },
    submitLabel: "Submit",
    cancelLabel: "Cancel",
    onChange: (data) => console.log(data),
    onCancel: () => console.log("cancel"),
    onSubmit: (data) => console.log(data),
  },
};
