import React from "react";
import { StoryFn } from "@storybook/react";

import { ToggleSwitch } from "../../lib";
import { ToggleSwitchProps } from "../../lib/";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Atoms/toggle",
  component: ToggleSwitch,
};

export const Toggle = {
  args: {
    falsyLabel: "Falsy Label",
    truthyLabel: "Truthy Label",
    value: true,
    className: "classname",
  },
};
