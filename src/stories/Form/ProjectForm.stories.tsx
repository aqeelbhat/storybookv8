import React from "react";
import { StoryFn } from "@storybook/react";

import { ProjectForm, ProjectFormProps, ProjectFormData } from "./../../lib";
import {
  mockOptionsDefault,
  mockOptionsDefault2,
  mockOptionsRegion,
  mockCurrencyOptions,
} from "./../MultiLevelSelect/mocks";
import { DEFAULT_CURRENCY } from "../../lib/util";

const currency = DEFAULT_CURRENCY;
const formData: ProjectFormData = {
  marketingProgram: { id: "id1", displayName: "Option 1", path: "option1" },
  activityName: "",
  allocadiaId: "",
  // startDate: '2021-07-13T18:30:00.000',
  // endDate: '2021-07-30T18:30:00.000',
  region: undefined,
  service: [],
  estimatedCost: { currency, amount: "10000000" },
  subsidiary: undefined,
  accountCode: undefined,
  user: "user",
  department: undefined,
  summary: "",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Project Form",
  component: ProjectForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "marketingProgram",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Marketing program",
        type: "string",
      },
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "categories",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Marketing program",
        type: "string",
      },
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "start",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Marketing program",
        type: "string",
      },
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "end",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Marketing program",
        type: "string",
      },
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "budget",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Marketing program",
        type: "string",
      },
    ],
    programOptions: mockOptionsDefault,
    regionOptions: mockOptionsRegion,
    categoryOptions: mockOptionsDefault,
    subsidiaryOptions: mockOptionsDefault,
    accountCodeOptions: mockOptionsDefault2,
    currencyOptions: mockCurrencyOptions,
    formData,
    submitLabel: "Submit",
    onReady: () => {},
  },
};
