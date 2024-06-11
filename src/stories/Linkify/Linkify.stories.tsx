import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Linkify } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Linkify/Linkify component",
  component: Linkify,
};

export const TemplateForm = {
  args: {
    children: (
      <div>
        <span>www.google.com</span>Seems like it was removed in this commit from
        what I can tell at a quick glance 95f8607 text:http://example.com/
        asdasdasdasdasdasda asdasd asdasda asdasdasd as http://example.com/
      </div>
    ),
  },
};
