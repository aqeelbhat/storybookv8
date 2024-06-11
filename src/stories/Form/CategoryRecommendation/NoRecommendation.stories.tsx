import React from "react";
import { StoryFn } from "@storybook/react";
import { CategoryRecommendationForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { ICategoryRecommFormProps } from "../../../lib/Form/CategoryRecommendation/types";
import {
  mockCategory,
  mockUser,
  mockUsers,
} from "../../MultiLevelSelect/mocks";

import mockParents from "./mock";
const formData = {
  summary: "I want to buy 3D Printer for Drug research",
  summaryUpdatedBy: {
    tenantId: "foo",
    tenantName: "Foo Company",
    userName: "john@foo.com",
    userNameCP: null,
    name: "John Doe",
    department: null,
    departmentCode: null,
    departmentErpId: null,
    groupIds: null,
    type: "Tenant",
    email: "john@foo.com",
    phone: null,
    firstName: null,
    lastName: null,
    api: false,
    picture: null,
    ip: "152.58.16.171",
    impersonator: null,
    connectionName: null,
    otp: false,
    procurementAdmin: true,
    admin: true,
  },
  edited: false,
  previousVersion: null,
  recommendation: null,
  categories: null,
  reincarnationId: null,
};

export default {
  title: "ORO UI Toolkit/Form/Category Recommendation/No Recommendations",
  component: CategoryRecommendationForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    categoryOptions: mockCategory,
    fields: [
      {
        fieldName: "summary",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Invoice number",
        __typename: "FormField",
      },
      {
        fieldName: "categories",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
    ],
    formData,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    getAllUsers: () => Promise.resolve(mockUsers),
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
    onGetCodesHierarchy: (codes) => Promise.resolve(mockParents),
  },
};
