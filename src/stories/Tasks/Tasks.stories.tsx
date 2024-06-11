import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { TasksComponent, TasksProps } from "./../../lib";
import { mockTasksDefault, mockProcessDefinition } from "./mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/TasksComponent",
  component: TasksComponent,
};

export const Default = {
  args: {
    tasks: mockTasksDefault,
    processDefinition: mockProcessDefinition,
    readOnly: true,
  },
};

export const DragTask = {
  args: {
    tasks: mockTasksDefault,
    processDefinition: mockProcessDefinition,
    callback: {
      onDropParallel: action("onDropParallel"),
      onStartSelected: action("onStartSelected"),
      onMoveNodeSerial: action("onMoveNodeSerial"),
      onMoveNodeSerialBefore: action("onMoveNodeSerialBefore"),
      onDropSerial: action("onDropSerial"),
      onDropSerialBefore: action("onDropSerialBefore"),
      onFirstDrop: action("onFirstDrop"),
      onMenuOptionClick: action("onMenuOptionClick"),
      onMoveNode: action("onMoveNode"),
      onTaskNameChange: action("onTaskNameChange"),
      onTaskSelected: action("onTaskSelected"),
    },
  },
};
