import React from "react";
import { StoryFn } from "@storybook/react";
import {
  Approval,
  InAppNotification,
  Notification,
  NotificationProps,
  TYPE,
} from "../../../lib";

const approvals: Array<InAppNotification> = [
  {
    id: "391717340623581370",
    type: "AtMention" as TYPE,
    fromUser: {
      name: "test user f f",
      userName: "testuserf@orolabs.ai",
      api: false,
      groupIds: [],
      selected: false,
      tenantId: "foo",
      department: "",
      picture: "",
      firstName: "",
      lastName: "",
      email: "testuserf@orolabs.ai",
      isOtp: false,
    },
    message: "Loren ipsum lorem ipsum",
    title: "Data Scientist",
    link: "",
    linkText: "",
    metadata: {
      engagementId: "AP-321",
      taskId: "",
    },
    userName: "",
    read: true,
    created: "2024-01-01T06:54:57.317700562Z",
  },
  {
    id: "391716677361308356",
    type: "AtMention" as TYPE,
    fromUser: {
      name: "test user f f",
      userName: "testuserf@orolabs.ai",
      api: false,
      groupIds: [],
      selected: false,
      tenantId: "foo",
      department: "",
      picture: "",
      firstName: "",
      lastName: "",
      email: "testuserf@orolabs.ai",
      isOtp: false,
    },
    message: "Need access to system",
    title: "Senior Analyst",
    link: "",
    linkText: "",
    metadata: {
      engagementId: "AP-321",
      taskId: "",
    },
    userName: "",
    read: false,
    created: "2023-12-21T07:56:00.927518062Z",
  },
  {
    id: "391634200433438906",
    type: "AtMention" as TYPE,
    fromUser: {
      name: "saqlain shaikh",
      userName: "saqlain42252@gmail.com",
      api: false,
      groupIds: [],
      selected: false,
      tenantId: "foo",
      department: "",
      picture: "",
      firstName: "",
      lastName: "",
      email: "saqlain42252@gmail.com",
      isOtp: false,
    },
    message: "access",
    title: "Developer",
    link: "",
    linkText: "",
    metadata: {
      engagementId: "AP-321",
      taskId: "",
    },
    userName: "",
    read: false,
    created: "2024-01-15T07:56:00.927518062Z",
  },
  {
    id: "391621666200531130",
    type: "AtMention" as TYPE,
    fromUser: {
      name: "AK Test",
      userName: "ak@gmail.com",
      api: false,
      groupIds: [],
      selected: false,
      tenantId: "foo",
      department: "",
      picture: "",
      firstName: "",
      lastName: "",
      email: "ak@gmail.com",
      isOtp: false,
    },
    message: "t",
    title: "Developer",
    link: "",
    linkText: "",
    metadata: {
      engagementId: "AP-321",
      taskId: "",
    },
    userName: "",
    read: false,
    created: "2024-01-16T07:56:00.927518062Z",
  },
  {
    id: "391292107864443415",
    type: "AtMention" as TYPE,
    fromUser: {
      name: "Catherine Jones",
      userName: "catherine@efficientoffice.com",
      api: false,
      groupIds: [],
      selected: false,
      tenantId: "foo",
      department: "",
      picture: "",
      firstName: "",
      lastName: "",
      email: "catherine@efficientoffice.com",
      isOtp: false,
    },
    message: "To do tasks",
    title: "Developer",
    link: "",
    linkText: "",
    metadata: {
      engagementId: "AP-321",
      taskId: "",
    },
    userName: "",
    read: true,
    created: "2024-01-06T07:56:00.927518062Z",
  },
  {
    id: "391274400442680752",
    type: "AtMention" as TYPE,
    fromUser: {
      name: "Catherine Jones",
      userName: "catherine@efficientoffice.com",
      api: false,
      groupIds: [],
      selected: false,
      tenantId: "foo",
      department: "",
      picture: "",
      firstName: "",
      lastName: "",
      email: "catherine@efficientoffice.com",
      isOtp: false,
    },
    message: "To do tasks",
    title: "Developer",
    link: "",
    linkText: "",
    metadata: {
      engagementId: "AP-321",
      taskId: "",
    },
    userName: "",
    read: false,
    created: "2024-01-14T07:56:00.927518062Z",
  },
];

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Notification/Notification",
  component: Notification,
};

export const TemplateForm = {
  args: {
    isOpen: true,
    newNotificationCount: 3,
    notificationList: approvals,
  },
};
