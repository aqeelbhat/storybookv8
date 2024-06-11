import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MultiLevelTreeSelector, MultiLevelSelectProps } from "./../../lib";
import {
  mockOptionsDefault,
  mockOptionsSelected,
  mockCountryOptions,
} from "./mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/MultiLevelTreeSelector",
  component: MultiLevelTreeSelector,
};

export const SingleSelect = {
  args: {
    options: mockOptionsDefault,
    regionOptions: mockCountryOptions,
    onChange: action("onChange"),
  },
};

export const MultiSelect = {
  args: {
    options: mockOptionsDefault,
    config: {
      selectMultiple: true,
    },
    regionOptions: mockCountryOptions,
    onChange: action("onChange"),
  },
};

export const DefaultSelected = {
  args: {
    options: mockOptionsSelected,
    regionOptions: mockCountryOptions,
    onChange: action("onChange"),
  },
};
