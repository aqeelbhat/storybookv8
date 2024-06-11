import React from "react";
import { StoryFn } from "@storybook/react";

import { OtherKpiFormEmail, OtherKpiReadOnlyFormProps } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Other Kpi form email",
  component: OtherKpiFormEmail,
};

export const TemplateForm = {
  args: {
    formData: {
      otherKpi: [
        "Lorem ipsum dolor sit amet. Nam alias quia qui amet fugiat eos ipsum quia non debitis mollitia.",
        "Lorem ipsum dolor sit amet. Nam alias quia qui amet fugiat eos ipsum quia non debitis mollitia.",
      ],
    },
  },
};
