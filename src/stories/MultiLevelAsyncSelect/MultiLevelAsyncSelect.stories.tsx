import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MultiLevelAsyncSelect, MultiLevelAsyncSelectProps } from "./../../lib";
import {
  mockCountryOptions,
  mockOptionsDefault,
  mockOptionsRegion,
  mockOptionsSelected,
} from "./mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/MultiLevelAsyncSelect",
  component: MultiLevelAsyncSelect,
};

export const SingleSelect = {
  args: {
    options: mockOptionsDefault,
    onChange: action("onChange"),
  },
};

export const MultiSelect = {
  args: {
    options: mockOptionsDefault,
    config: {
      selectMultiple: true,
    },
    onChange: action("onChange"),
  },
};

export const TypeaheadSingleSelelct = {
  args: {
    options: [
      mockOptionsDefault[0],
      mockOptionsDefault[1],
      mockOptionsDefault[2],
    ],
    config: {
      typeahead: true,
      selectMultiple: false,
      enableTree: true,
    },
    onSearch: () => Promise.resolve(mockOptionsDefault),
    onChange: action("onChange"),
    disabled: false,
  },
};

export const TypeaheadMultiSelect = {
  args: {
    options: [
      mockOptionsDefault[0],
      mockOptionsDefault[1],
      mockOptionsDefault[2],
    ],
    config: {
      selectMultiple: true,
      typeahead: true,
      enableTree: true,
    },
    type: "category", // 'entity', //
    regionOptions: mockCountryOptions,
    onSearch: () => Promise.resolve(mockOptionsDefault),
    onChange: action("onChange"),
  },
};

export const DefaultSelected = {
  args: {
    value: [mockOptionsDefault[0]],
    options: [
      mockOptionsDefault[0],
      mockOptionsDefault[1],
      mockOptionsDefault[2],
    ],
    config: {
      typeahead: true,
      selectMultiple: false,
      enableTree: true,
    },
    onSearch: () => Promise.resolve(mockOptionsDefault),
    onChange: action("onChange"),
    disabled: false,
  },
};
