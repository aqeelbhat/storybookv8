import React from "react";
import { StoryFn } from "@storybook/react";

import { CostDetailsReadOnlyForm, CostFormReadOnlyProps } from "./../../lib";
import { DEFAULT_CURRENCY } from "../../lib/util";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Cost details read only form",
  component: CostDetailsReadOnlyForm,
};

export const TemplateForm = {
  args: {
    formData: {
      costs: [
        {
          costDetails: "Installation cost",
          moneyAmount: {
            amount: "2001231",
            currency: "EUR",
          },
          costDate: "2023",
        },
        {
          costDetails: "Purchase cost",
          moneyAmount: {
            amount: "300",
            currency: DEFAULT_CURRENCY,
          },
          costDate: "2022-12-23",
        },
      ],
    },
  },
};
