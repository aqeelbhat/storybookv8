import React from "react";
import { StoryFn } from "@storybook/react";

import { CostDetailsFormEmail, CostFormReadOnlyProps } from "./../../lib";
import { DEFAULT_CURRENCY } from "../../lib/util";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Cost details form email",
  component: CostDetailsFormEmail,
};

export const TemplateForm = {
  args: {
    formData: {
      costs: [
        {
          costDetails: null,
          moneyAmount: {
            amount: null,
            currency: "EUR",
          },
          costDate: null,
        },
        {
          costDetails:
            "Lorem ipsum dolor sit amet. Nam alias quia qui amet fugiat eos ipsum quia non debitis mollitia.",
          moneyAmount: {
            amount: "200",
            currency: "EUR",
          },
          costDate: "2023",
        },
        {
          costDetails:
            "Lorem ipsum dolor sit amet. Nam alias quia qui amet fugiat eos ipsum quia non debitis mollitia.",
          moneyAmount: {
            amount: "300",
            currency: DEFAULT_CURRENCY,
          },
          costDate: "2024",
        },
      ],
    },
  },
};
