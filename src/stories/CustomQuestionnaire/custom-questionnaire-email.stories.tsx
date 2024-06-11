import React from "react";
import { StoryFn } from "@storybook/react";

import { FormDefinitionViewProps, FormDefinitionEmailView } from "../../lib";
import { mockConfig } from "./mock";
import { DEFAULT_CURRENCY } from "../../lib/util";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Custom Form Definition/Email",
  component: FormDefinitionEmailView,
};

export const TemplateForm = {
  args: {
    id: "id",
    formDefinition: mockConfig,
    formData: {
      _p_contact__p_: [
        {
          fullName: "nitesh",
          email: "nitesh@orolabs.ai",
          rate: {
            amount: "",
            currency: "USD",
          },
          requireBackgroundCheck: false,
        },
      ],
      _p_Est__budget__p_: {
        amount: 12,
        currency: "USD",
      },
      _p_Engagement_title__p_: "test",
      previousVersion: null,
      q4__p_Tell_us_your_business_need_: "ghfht",
      _p_po__p_: {
        id: "412669697266685122",
        name: "ORD123624",
        erpId: "IBM",
      },
    },
    getPO: (id) => {
      console.log(id);
      return Promise.resolve({
        poNumber: "PO123",
        normalizedVendorRef: {
          name: "Normalized Vendor",
          selectedVendorRecord: {
            name: "Vendor Record",
            vendorId: "V8114 20230906",
          },
        },
        cost: 10000,
        currencyCode: "USD",
        departmentRef: { name: "Procurement" },
        companyEntityRef: { name: "Optimizely North America Inc." },
        start: "Nov 01, 2023",
        end: "Dec 31, 2023",
        accountRef: { name: "Account Code" },
      });
    },
  },
};
