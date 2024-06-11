import React from "react";
import { StoryFn } from "@storybook/react";

import { OROEmailInput, OROInputProps } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/inputs/email",
  component: OROEmailInput,
};

function validateEmail(label: string, value: string): string {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!value) {
    return `${label} is a required field.`;
  } else if (value) {
    return value.match(regex) ? "" : "Enter a valid email address";
  } else {
    return "";
  }
}

export const OROPhoneInputStory = {
  args: {
    placeholder: "phone",
    label: "Email",
    validator: (e) => validateEmail("mail", e),
    onChange: (e) => console.log(e),
  },
};

export const OROPhoneInputStoryWithDefaultValidator = {
  args: {
    placeholder: "phone",
    label: "Email",
    onChange: (e) => console.log(e),
  },
};
