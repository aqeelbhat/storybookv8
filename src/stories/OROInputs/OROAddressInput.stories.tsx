import React from "react";
import { StoryFn } from "@storybook/react";

import { OROAddressInput, OROAddressInputProps } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/inputs/address",
  component: OROAddressInput,
};

export const OROAddressInputStory = {
  args: {
    name: "address",
    placeholder: "address",
    label: "Address",
    onChange: (e) => console.log(e.target.value),
  },
};
