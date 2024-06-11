import React from "react";
import { StoryFn } from "@storybook/react";

import {
  MeasureDetail,
  MeasureDetailProps,
  MeasureDetailsFormData,
  Option,
  StandardPriority,
  getI18NInstance,
} from "./../../lib";
import {
  mockOptionsDefault,
  mockOptionsRegion,
} from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formData: MeasureDetailsFormData = {
  name: "",
  type: { id: "ebit", path: "ebit", displayName: "EBIT Impact" },
  estimate: { currency: "EUR", amount: "1000" },
  businessSegments: [],
  owner: null,
  sensitive: false,
  priority: StandardPriority.medium,
  workstream: {
    id: "eng",
    displayName: "Engineering",
    path: "eng",
  },
  id: "E123",
  locations: [],
  other: `Situation:

Action:

Benefit:`,
  additionalDocs: [
    {
      date: "",
      expiration: "",
      filename: "a.csv",
      mediatype: "text/csv",
      name: "",
      note: "",
      path: "attachment/65099653170855936/a.csv",
      reference: "",
      size: 185,
    },
  ],
  docUrls: "www.google.com,  www.google.com,  www.google.com",
  relatedMeasures: [
    { id: "id1", path: "option1", displayName: "Test 1" },
    { id: "id2", path: "option2", displayName: "Option 2" },
  ],
  financialImpactType: {
    id: "id1",
    displayName: "Test 1",
    path: "option1",
  },
};

const workstreamOptionsData: Option[] = [
  {
    id: "eng",
    displayName: "Engineering",
    path: "eng",
    customData: { erpId: "5" },
    icon: "",
    selected: false,
    selectable: true,
    hierarchy: "",
  },
  {
    id: "proc",
    displayName: "Procurement",
    path: "proc",
    customData: { erpId: "5" },
    icon: "",
    selected: false,
    selectable: true,
    hierarchy: "",
  },
];

const worksAreaOptionsData: Option[] = [
  {
    id: "factory1",
    displayName: "Factory 1",
    path: "factory1",
    customData: { erpId: "5" },
    icon: "",
    selected: false,
    selectable: true,
    hierarchy: "",
  },
  {
    id: "factory2",
    displayName: "Factory 2",
    path: "factory2",
    customData: { erpId: "5" },
    icon: "",
    selected: false,
    selectable: true,
    hierarchy: "",
  },
];

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/MeasureDetail Form",
  component: MeasureDetail,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData,
    fields: [
      {
        fieldName: "businessSegments",
        requirement: "required",
      },
      {
        fieldName: "acceptDocUrls",
        booleanValue: true,
      },
      {
        fieldName: "acceptSingleBusinessSegment",
        booleanValue: true,
      },
      {
        fieldName: "estimate",
        requirement: "optional", // required / optional
      },
    ],
    isEbitRequest: true,
    currency: DEFAULT_CURRENCY,
    locationOptions: mockOptionsRegion,
    workstreamOptions: workstreamOptionsData,
    businessSegmentOptions: mockOptionsDefault,
    impactCategoryOptions: mockOptionsDefault,
    priorityOptions: mockOptionsDefault,
    workAreas: worksAreaOptionsData,
    businessRegionOptions: mockOptionsRegion,
    financialImpactTypeOptions: mockOptionsDefault,
    canMakeSensitive: true,
    canSetFinancialImpact: false,
    onUserSearch: () =>
      Promise.resolve([
        { id: "user1", path: "user1", displayName: "User 1" },
        { id: "user2", path: "user2", displayName: "User 2" },
      ]),
    onSupplierSearch: () =>
      Promise.resolve([
        { id: "supplier1", path: "supplier1", displayName: "Supplier 1" },
        { id: "supplier2", path: "supplier2", displayName: "Supplier 2" },
      ]),
    onMeasuresSearch: () => {
      const searchQuery = new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockOptionsDefault);
        }, 1000);
      });

      return searchQuery;
    },
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
