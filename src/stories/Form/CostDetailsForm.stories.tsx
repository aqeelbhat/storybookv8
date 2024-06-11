import React from "react";
import { StoryFn } from "@storybook/react";

import { CostDetailsForm } from "./../../lib";
import { CostDetailsFormProps } from "../../lib/Form/types";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Cost Details Form",
  component: CostDetailsForm,
};

export const TemplateForm = {
  args: {
    formData: {
      costs: [
        {
          costDetails: "abc",
          moneyAmount: {
            amount: "100",
            currency: "EUR",
          },
          costDate: "2022-11-30",
        },
      ],
    },
    submitLabel: "Submit",
    cancelLabel: "Cancel",
    onChange: (data) => console.log(data),
    onCancel: () => console.log("cancel"),
    onSubmit: (data) => console.log(data),
  },
};
