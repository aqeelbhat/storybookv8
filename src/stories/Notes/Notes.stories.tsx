import React from "react";
import { StoryFn } from "@storybook/react";
import { OROMessaging } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Messaging/Note component",
  component: OROMessaging,
};

export const TemplateForm = {
  args: {
    onCreatePrivateNote: () => Promise.resolve(true),
    isPrivateNoteEnabled: true,
    isCurrentUserAdmin: true,
    allPrivateNote: [
      {
        id: "352275608978288829",
        type: "privateNote",
        processId: "",
        actionId: "",
        engagementId: "320281202521209904",
        engagementName: "",
        requestor: "",
        collcectionId: "",
        name: "private note",
        description:
          "test public with mention edited @OptiAPEMEA Expert @OptiL2 User1 ",
        taskStatus: "notStarted",
        owner: {
          name: "Oro Admin",
          userName: "customeradmin+optimizely_qa_dev@orolabs.ai",
          api: false,
          groupIds: [],
          selected: false,
          tenantId: "optimizely_qa_dev",
          department: "",
          picture: "",
          firstName: "",
          lastName: "",
          email: "",
          isOtp: false,
        },
        users: [
          {
            name: "OptiAPNordic Expert",
            userName: "autousertest.123+optiapnordicexpert@gmail.com",
            api: false,
            groupIds: [],
            selected: false,
            tenantId: "optimizely_qa_dev",
            department: "",
            picture: "",
            firstName: "",
            lastName: "",
            email: "",
            isOtp: false,
          },
          {
            name: "OptiAPEMEA Expert",
            userName: "autousertest.123+optiemeaexpert@gmail.com",
            api: false,
            groupIds: [],
            selected: false,
            tenantId: "optimizely_qa_dev",
            department: "",
            picture: "",
            firstName: "",
            lastName: "",
            email: "",
            isOtp: false,
          },
          {
            name: "OptiL2 User1",
            userName: "autousertest.123+optil2user1@gmail.com",
            api: false,
            groupIds: [],
            selected: false,
            tenantId: "optimizely_qa_dev",
            department: "",
            picture: "",
            firstName: "",
            lastName: "",
            email: "",
            isOtp: false,
          },
        ],
        partners: [],
        groups: [],
        startDate: "",
        dueDate: "",
        updated: "2023-09-05T20:55:26.306824052Z",
        completed: "",
        position: -1,
        taskAssignment: null,
        forms: [],
        attachments: [],
        notes: [],
        isRestricted: false,
        priority: null,
        created: "2023-09-05T19:40:01.864744863Z",
        actionType: "mention",
        relatedMeasure: {
          id: "",
          name: "",
          erpId: "",
          refId: null,
          version: "",
        },
        labels: [],
        relatedMeasures: [],
        workstreams: [],
        program: {
          id: "",
          name: "",
          erpId: "",
          refId: null,
          version: "",
        },
        taskName: "",
        taskId: "",
        descriptionMeta:
          "test public with mention edited @[OptiAPEMEA Expert](autousertest.123+optiemeaexpert@gmail.com) @[OptiL2 User1](autousertest.123+optil2user1@gmail.com)",
        publicNote: true,
        messageType: null,
        stepName: "",
        formsReadOnly: false,
      },
    ],
  },
};
