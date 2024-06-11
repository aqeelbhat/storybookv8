import React from "react";
import { StoryFn } from "@storybook/react";

import { FormDefinitionViewProps, FormDefinitionView } from "../../lib";
import { mockConfig } from "./mock";
import {
  mockAddress,
  mockCsvFile,
  mockMasterDataOptions,
} from "../mocks/file.mock";
import {
  mockCategory,
  mockCurrencyOptions,
  mockUnitPerQuantity,
} from "../MultiLevelSelect/mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Custom Form Definition/Edit",
  component: FormDefinitionView,
};

export const TemplateForm = {
  args: {
    id: "id",
    formDefinition: mockConfig,
    formData: {
      userId: {
        firstName: "User",
        lastName: "1",
        userName: "user1",
        email: "user1@orolabs.ai",
        picture: "",
      },
    },
    loadCustomerDocument: () => Promise.resolve(mockCsvFile),
    loadMasterDataOptions: () => Promise.resolve(mockMasterDataOptions),
    onPlaceSelectParseAddress: () => Promise.resolve(mockAddress),
    onUserSearch: () =>
      Promise.resolve([
        {
          firstName: "User",
          lastName: "1",
          userName: "user1",
          email: "user1@orolabs.ai",
          picture:
            "https://assets.dev.orolabs.ai/oro%2Fimages%2Fusers%2Ffoo%2Fgandharva.jadhav%40orolabs.ai1662554835734",
        },
        {
          firstName: "User",
          lastName: "2",
          userName: "user2",
          email: "user2@orolabs.ai",
          picture:
            "https://assets.dev.orolabs.ai/oro%2Fimages%2Fusers%2Ffoo%2Fgandharva.jadhav%40orolabs.ai1662554835734",
        },
      ]),
    currencyOptions: mockCurrencyOptions,
    categoryOptions: mockCategory,
    accountCodeOptions: mockCategory,
    unitPerQuantity: mockUnitPerQuantity,
    countryOptions: [],
    submitLabel: "Trigger submit",
    attachments_details: [
      {
        date: null,
        expiration: null,
        filename: "a.csv",
        mediatype: "text/csv",
        name: null,
        note: null,
        path: "attachment/65099653170855936/a.csv",
        reference: null,
        size: 185,
      },
    ],
  },
};
