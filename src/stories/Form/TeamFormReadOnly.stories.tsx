import React from "react";
import { StoryFn } from "@storybook/react";

import { TeamFormReadOnly, TeamFormData } from "./../../lib";
import { mockUsers } from "../MultiLevelSelect/mocks";

const formData: TeamFormData = {
  users: mockUsers,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Team Form Read Only",
  component: TeamFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
