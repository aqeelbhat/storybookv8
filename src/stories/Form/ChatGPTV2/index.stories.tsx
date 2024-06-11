import React from "react";
import { StoryFn } from "@storybook/react";
import {
  ChatGPTChatBotV2Form,
  ChatGPTFormData,
  CustomFormData,
  getI18NInstance,
} from "../../../lib";
import { ChatGPTFormV2Props } from "../../../lib/Form/ChatGPTV2";
import {
  mockCategory,
  mockCurrencyOptions,
  mockOptionsRegion,
  mockUser,
} from "../../MultiLevelSelect/mocks";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import ComplianceFormDefinition from "./mocks/complianceFormMock.ts";
import mockChatGPTResponse from "./mocks/gptMockResponse.ts";
import mockFields from "./mocks/mockFields.ts";
import buyingChannelMockData, {
  fallBackChannel,
} from "./mocks/BuyingChannelMock.ts";
import mockSuppliers from "./mocks/suppliersMock.ts";
import mockItemList from "./mocks/mockCatalog.ts";

export default {
  title: "ORO UI Toolkit/Form/Chat GPT V2",
  component: ChatGPTChatBotV2Form,
};
getI18NInstance(true);

const complianceFormdata = {
  q7__p_Is_this_request_GxP_relevan: "Not Applicable",
  q4__p_Is_this_contract_for_global: "Not Applicable",
  q10__p_Will_any_personally_identif: "No",
};

export const TemplateForm = {
  args: {
    fields: mockFields,
    complianceForm: {
      id: 123,
      name: null,
      formId: "Compliance_Form",
      custom: true,
      completed: false,
      formType: null,
      __typename: "RequestQuestionnaireId",
    },
    formData: null,
    categoryOptions: mockCategory,
    regionOptions: mockOptionsRegion,
    currencyOptions: mockCurrencyOptions,
    signedInUserDetails: mockUser,
    defaultCurrency: DEFAULT_CURRENCY,
    searchQuery:
      "Buy 3D Printer for research purposes, creating medicines tailored to specifications.",
    submitLabel: "Submit",
    cancelLabel: "cancel",
    isComplianceFormVisible: () => {
      return new Promise((resolve, reject) => {
        //resolve(payload)
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
    },
    getAISuggestions: (query) => {
      return Promise.resolve(mockChatGPTResponse);
    },
    getNormalizedVendors: (vendorIds, companyName) => {
      // debugger
      if (companyName == "microsoft") {
        return Promise.resolve([]);
      }

      return Promise.resolve(
        mockSuppliers.map((i) => {
          i.supplierName = companyName ? companyName : i.supplierName;
          return i;
        }),
      );
    },
    fetchCategory: (id: string) => {
      return Promise.resolve({
        id,
        displayName: "Logistic Services",
        path: "Log",
        customData: {
          description:
            "Logistics refers to the overall process of managing how resources are acquired, stored, and transported to their final destination",
          ancestorNames: ["Logistics & Marketing"],
        },
        //hierarchy: 'ALL:HELLO',
        pathDisplayName: "POGI",
      });
    },
    onSubmit: (payload: ChatGPTFormData) => {
      return new Promise((resolve, reject) => {
        resolve(payload);
        // setTimeout(() => {
        //     resolve(payload)
        // }, 5000)
      });
    },
    events: {
      fetchExtensionCustomFormDefinition: (formid) => {
        // Compliance_Form
        return Promise.resolve(ComplianceFormDefinition);
      },
    },
    dataFetchers: {
      searchOptions: (keywords, masterDataType) => {
        if (masterDataType === "BuyingChannel") {
          return new Promise((resolve, reject) => {
            //resolve(payload)
            setTimeout(() => {
              resolve([
                {
                  id: "oneMarketplace",
                  path: "oneMarketplace",
                  displayName: "One Marketplace",
                  customData: {
                    description:
                      "Your one stop shop for all your product needs where you can place an order, and get them delivered within days.",
                    limit: { amount: 25000, currency: "USD" },
                    image:
                      "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1715126400&semt=sph",
                  },
                },
              ]);
            }, 3000);
          });
        }
      },
    },
    submitComplianceForm: (
      customFormData: CustomFormData,
      formId: string,
      isNew: boolean,
      complianceId: string,
    ) => {
      return Promise.resolve({
        customFormData: customFormData,
        id: complianceId || "123",
      });
    },
    getComplianceFormData: () => {
      return Promise.resolve(complianceFormdata);
    },
    refreshExtensionCustomFormData: () => {
      return Promise.resolve(complianceFormdata);
    },
    onSearchSuppliers: (search) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (search === "microsoft") {
            resolve(
              mockSuppliers.map((item) => {
                item.supplierName = search;
                return item;
              }),
            );
          } else {
            resolve([]);
          }
        }, 3000);
      });
      //return Promise.resolve(mockSuppliers)
    },
    getFallbackBuyingChannel: () => Promise.resolve(fallBackChannel),
    getBuyingChannel: () => {
      return new Promise((resolve, reject) => {
        //resolve(payload)
        setTimeout(() => {
          resolve(buyingChannelMockData);
        }, 3000);
      });
    },
    fetchCatalog: () => {
      return new Promise((resolve, reject) => {
        //resolve(payload)
        setTimeout(() => {
          resolve(mockItemList);
        }, 3000);
      });
    },
  },
};
