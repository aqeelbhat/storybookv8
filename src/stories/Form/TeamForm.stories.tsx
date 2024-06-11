import React from "react";
import { StoryFn } from "@storybook/react";

import { TeamForm, TeamFormProps, TeamFormData } from "./../../lib";
import { mockContacts, mockUsers } from "../MultiLevelSelect/mocks";

const mockRoleData = [
  { code: "owner", name: "Owner", description: "Owner" },
  {
    code: "account_manager",
    name: "Account Manager",
    description: "Account Manager",
  },
  {
    code: "creative_director",
    name: "Creative Director",
    description: "Creative Director",
  },
];

const formData: TeamFormData = {
  users: [
    {
      tenantId: null,
      userName: "john@foo.com",
      firstName: null,
      lastName: null,
      name: "John Doe",
      department: null,
      email: "john@foo.com",
      teamRole: "Owner",
      __typename: "UserId",
    },
    {
      tenantId: null,
      userName: "jo@foo.com",
      firstName: null,
      lastName: null,
      name: "Jo Doe",
      department: null,
      email: "jo@foo.com",
      teamRole: "CoOwner",
      __typename: "UserId",
    },
    {
      tenantId: null,
      userName: "user@foo.com",
      firstName: null,
      lastName: null,
      name: "user Doe",
      department: null,
      email: "user@foo.com",
      teamRole: "Member",
      __typename: "UserId",
    },
  ],
  supplierContacts: [],
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Team Form",
  component: TeamForm,
};

export const TemplateForm = {
  args: {
    formData,
    isSupplier: true,
    existingSupplierContacts: mockContacts,
    supplierRoleOptions: mockRoleData,
    hasEditPermission: true,
    onUserSearch: () => Promise.resolve(mockUsers),
    onCreateSupplierContact: () => Promise.resolve(true),
  },
};
