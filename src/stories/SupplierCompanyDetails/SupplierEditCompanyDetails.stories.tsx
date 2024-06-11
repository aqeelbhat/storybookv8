import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierCompanyDetails } from "../../lib";
import { EditCompanyDetailsProps } from "../../lib/SupplierDetails/CompanyDetails/supplier-company-details.component";
import { DEFAULT_CURRENCY } from "../../lib/util";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/SupplierDetails/SupplierCompanyDetails",
  component: SupplierCompanyDetails,
};

const mockCurrencies = [
  {
    id: "_Currency__Any__USD",
    displayName: "US Dollar (USD)",
    path: "USD",
    customData: {
      erpId: null,
      code: "USD",
    },
    icon: "",
    selected: false,
    selectable: true,
  },
  {
    id: "_Currency__Any__EUR",
    displayName: "Euro (EUR)",
    path: "EUR",
    customData: {
      erpId: null,
      code: "EUR",
    },
    icon: "",
    selected: false,
    selectable: true,
  },
];

const mockIndustryCodeOptions = [
  {
    id: "_IndustryCode__Any__10",
    path: "10",
    displayName: "Agriculture",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "10" },
  },
  {
    id: "_IndustryCode__Any__11",
    path: "11",
    displayName: "Arts",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "11" },
  },
  {
    id: "_IndustryCode__Any__15",
    path: "15",
    displayName: "Educational",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "15" },
  },
  {
    id: "_IndustryCode__Any__20",
    path: "20",
    displayName: "Manufacturing",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "20" },
  },
];

export const TemplateForm = {
  args: {
    supplier: {
      commonName: "Thermo Fisher Scientific",
      industryCode: "15",
      address: {
        line1: "Waltham, MA",
      },
      website: "www.thermofisher.com",
      description: `Thermo Fisher Scientific Inc. is the world leader in serving science, with annual revenue of approximately $40 billion. Our Mission is to enable our customers to make the world healthier, cleaner and safer. Whether our customers are accelerating life sciences research, solving complex analytical challenges, increasing productivity in their laboratories, improving patient health through diagnostics or the development and manufacture of life-changing therapies, we are here to support them. Our global team delivers an unrivaled combination of innovative technologies, purchasing convenience and pharmaceutical services through our industry-leading brands, including Thermo Scientific, Applied Biosystems, Invitrogen, Fisher Scientific, Unity Lab Services, Patheon and PPD.
            For more information, please visit www.thermofisher.com.`,
      regId: "7894631 (US-DE)",
      numEmployees: "201-500",
      annualRevenue: { currency: DEFAULT_CURRENCY, amount: "230000000" },
    },
    currencies: mockCurrencies,
    industryCodes: mockIndustryCodeOptions,
  },
};
