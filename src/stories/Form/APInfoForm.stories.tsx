import React from "react";
import { StoryFn } from "@storybook/react";

import { APInfoForm, APFormData, APFormProps } from "./../../lib";
import { mockOptionsDefault } from "../MultiLevelSelect/mocks";

const formData: APFormData = {
  method: undefined,
  companyEntity: undefined,
  additionalCompanyEntities: [],
  eligible1099: false,
  syncToProcurement: false,
  paymentTerms: undefined,
  currency: undefined,
  expenseAccount: undefined,
  vendorId: "",
  vendorError: "Vendor ID used.",
};

export default {
  title: "ORO UI Toolkit/Form/AP Info Form",
  component: APInfoForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        fieldName: "eligible1099",
        requirement: "required",
        stringValue: null,
        title: "1099 eligible",
      },
      {
        booleanValue: "true",
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "companyEntity",
        instruction: null,
        modifiable: true,
        order: 2,
        requirement: "required",
        sectionTitle: null,
        stringValue: null,
        title: "Primary subsidiary",
        type: "string",
        validationPath: null,
        validationSubpath: null,
      },
      {
        booleanValue: "true",
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "paymentTerms",
        instruction: null,
        modifiable: true,
        order: 6,
        requirement: "required",
        sectionTitle: null,
        stringValue: null,
        title: "Payment terms",
        type: "string",
        validationPath: null,
        validationSubpath: null,
      },
    ],
    formData,
    methodOptions: [
      {
        id: "system",
        path: "system",
        displayName: "Automatically create new vendor",
      },
      {
        id: "manual",
        path: "manual",
        displayName:
          "Do not automatically create new vendor, instead use the vendor ID for this request",
      },
    ],
    subsidiaryOptions: mockOptionsDefault,
    additionalSubsidiaryOptions: mockOptionsDefault,
    paymentTermOptions: mockOptionsDefault,
    currencyOptions: mockOptionsDefault,
    expenseAccountOptions: mockOptionsDefault,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
  },
};
