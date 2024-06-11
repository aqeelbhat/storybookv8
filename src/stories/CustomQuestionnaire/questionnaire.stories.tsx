import React from "react";
import { StoryFn } from "@storybook/react";

import { QuestionnaireView } from "../../lib";
import { mockConfig } from "./mock copy 7";
import {
  mockAddress,
  mockCsvFile,
  mockMasterDataOptions,
} from "../mocks/file.mock";
import {
  mockCategory,
  mockCountryOptions,
  mockCurrencyOptions,
  mockDocumentTypeOptions,
  mockOptionsDefault,
  mockUnitPerQuantity,
} from "../MultiLevelSelect/mocks";
import { FormViewProps } from "../../lib/CustomFormDefinition/NewView/QuestionnaireView.component";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Questionnaire/Edit",
  component: QuestionnaireView,
};

export const TemplateForm = {
  args: {
    id: "id",
    formDefinition: mockConfig,
    formData: {
      // _p_FieldB__p_: {id: "19-21-US", name: "United States", erpId: ""},
      // _p_FieldC__p_: {id: "19-21-US", name: "United States", erpId: ""}
    },
    options: {
      currency: mockCurrencyOptions,
      category: mockCategory,
      accountCode: mockCategory,
      unitPerQuantity: mockUnitPerQuantity,
      country: mockCountryOptions,
      documentType: mockDocumentTypeOptions,
      role: mockOptionsDefault,
    },
    dataFetchers: {
      getDoucumentByPath: () => Promise.resolve(mockCsvFile),
      getDocumentByName: () => Promise.resolve(mockCsvFile),
      getMasterdata: () => Promise.resolve(mockCountryOptions),
      getParsedAddress: () => Promise.resolve(mockAddress),
      getUser: () =>
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
    },
    submitLabel: undefined,
    cancelLabel: undefined,
  },
};
