import React from "react";
import { StoryFn } from "@storybook/react";

import {
  EngagementListingComponent,
  Engagement,
  EngagementComponentProps,
  ActivationStatus,
} from "./../../lib";

const data: Array<Engagement> = [
  {
    projectAmount: {
      amount: 1000,
      currency: "usd",
    },
    vendorId: "",
    selection: {
      regions: [],
      categories: [],
      partnerLevels: [],
      projectLevels: [],
      partnerRegions: [],
      businessUnits: [],
      isNewPartner: false,
      brands: [],
      requester: {
        name: "",
        userName: "",
      },
      spendBucket: 0,
    },
    id: "114027108136648704",
    engagementId: "ORO-2221",
    name: "new milestone process nitesh",
    status: "Draft",
    requester: {
      tenantId: "foo",
      userName: "john@foo.com",
      name: "John Doe",
      department: null,
    },
    started: "2021-11-17T09:05:32.894919547Z",
    updated: "2021-11-17T09:17:14.281344700Z",
    completed: null,
    projectAmountMoney: null,
    currentRequest: {
      id: "114027106341486592",
      requestId: "ORO2776",
      mainProcessId: null,
      type: "development",
      processName: "new milestone process nitesh",
    },
    pendingTasks: null,
    nextTask: null,
    progress: {
      stepsTotal: 5,
      stepsCompleted: 0,
      totalEstimateTime: 5,
      completedTime: 0,
    },
    variables: {
      businessUnit: [],
      companyEntityCountryCodes: [],
      categories: null,
      regions: [],
      departments: null,
      companyEntities: null,
      projectTypes: null,
      partners: [
        {
          id: null,
          activationStatus: ActivationStatus.active,
          contact: {
            email: "nitesh@orolabs.ai",
            fullName: "nitesh",
            phone: "123456789",
            role: "admin",
          },
          vendorRecordId: null,
          name: "Microsoft Corporation",
          countryCode: "US",
          legalEntityId: "88868992679429039",
          legalEntityLogo: {
            metadata: [
              {
                path: "oro/images/small/88868992679429039.png",
                height: 100,
                width: 100,
              },
              {
                path: "oro/images/large/88868992679429039.png",
                height: 200,
                width: 200,
              },
            ],
          },
          selectedVendorRecord: null,
        },
      ],
      projectAmountMoney: null,
      activityName: "measure nitesh",
      activityId: null,
      activitySystem: null,
      summary: null,
      po: null,
    },
    infoRequests: null,
    contacts: [],
  },
];

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Engagement/Engagement Listing Component",
  component: EngagementListingComponent,
};

export const TemplateForm = {
  args: {
    data: data,
  },
};
