import React from "react";
import { StoryFn } from "@storybook/react";

import { SnackbarComponent } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Snackbar",
  component: SnackbarComponent,
};

//👇 We create a “template” of how args map to rendering
const SnackbarTemplate: StoryFn<{}> = (args) => (
  <SnackbarComponent message="" open={false} {...args} />
);

export const SnackbarComponentControl = {
  render: SnackbarTemplate,

  args: {
    open: true,
    autoHideDuration: 2000,
    message: "There are some errors in form. Please check",
  },
};
