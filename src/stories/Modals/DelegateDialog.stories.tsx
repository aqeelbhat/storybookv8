import React from "react";
import { StoryFn } from "@storybook/react";

import { DelegateDialog, DelegateModalProps } from "./../../lib";
import { mockContacts, mockUsers } from "../MultiLevelSelect/mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Modals/Delegation Dialog",
  component: DelegateDialog,
};

export const Default = {
  args: {
    isOpen: true,
    theme: "coco",
    existingUsers: mockUsers,
    onUserSearch: () => Promise.resolve(mockUsers),
    onSaveDelegates: () => Promise.resolve(true),
  },
};
