import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { MultiLevelSelect, MultiLevelSelectProps } from "./../../lib";
import { mockOptionsDefault, mockOptionsSelected } from "./mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/MultiLevelSelect",
  component: MultiLevelSelect,
};

const style = {
  padding: 10,
};

//👇 We create a “template” of how args map to rendering
const SiblingTemplate: StoryFn<MultiLevelSelectProps> = (args) => (
  <>
    <h1>Typeahead MultiLevel Single Select</h1>
    <section style={style}>
      <MultiLevelSelect {...args} />
      <MultiLevelSelect {...args} />
      <MultiLevelSelect {...args} />
      <MultiLevelSelect {...args} />
    </section>
    <section style={style}>
      <MultiLevelSelect {...args} />
      <MultiLevelSelect {...args} />
      <MultiLevelSelect {...args} />
      <MultiLevelSelect {...args} />
    </section>
  </>
);

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
    options: mockOptionsDefault,
    config: {
      typeahead: true,
      selectMultiple: false,
      enableTree: true,
    },
    onChange: action("onChange"),
    disabled: false,
  },
};

export const TypeaheadSingleSelectSibling = {
  render: SiblingTemplate,

  args: {
    options: mockOptionsDefault,
    config: {
      typeahead: true,
      selectMultiple: false,
      enableTree: true,
      absolutePosition: true,
    },
    onChange: action("onChange"),
    disabled: false,
  },
};

export const TypeaheadMultiSelect = {
  args: {
    options: mockOptionsDefault,
    config: {
      selectMultiple: true,
      typeahead: true,
      enableTree: true,
    },
    onChange: action("onChange"),
  },
};

export const MultiSelectWithSearch = {
  args: {
    options: mockOptionsDefault,
    config: {
      selectMultiple: true,
      typeahead: false,
      enableTree: false,
      noBorder: true,
      isListView: false,
      showSearchBox: true,
    },
    onChange: action("onChange"),
  },
};

export const DefaultSelected = {
  args: {
    options: mockOptionsSelected,
    onChange: action("onChange"),
  },
};
