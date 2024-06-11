import React from "react";
import { StoryFn } from "@storybook/react";
import {
  UpdateSupplierCompanyDetails,
  UpdateSupplierCompanyProps,
} from "../../lib";
import { mockCountryOptions } from "../MultiLevelSelect/mocks";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/UpdateSupplierProfile/Update Company Details",
  component: UpdateSupplierCompanyDetails,
};

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
    commonName: "Thermo Fisher Scientific",
    industryCode: "15",
    address: {
      line1: "1 Microsoft Way",
      line2: "",
      line3: "",
      streetNumber: "",
      unitNumber: "",
      city: "Redmond",
      province: "US-WA",
      alpha2CountryCode: "US",
      postal: "98052",
      language: "",
    },
    website: "www.thermofisher.com",
    email: "support@thermofisher.com",
    phone: "+91 893 456 7884",
    parentCompany: null,
    description: `Thermo Fisher Scientific Inc. is the world leader in serving science, with annual revenue of approximately $40 billion. Our Mission is to enable our customers to make the world healthier, cleaner and safer. Whether our customers are accelerating life sciences research, solving complex analytical challenges, increasing productivity in their laboratories, improving patient health through diagnostics or the development and manufacture of life-changing therapies, we are here to support them. Our global team delivers an unrivaled combination of innovative technologies, purchasing convenience and pharmaceutical services through our industry-leading brands, including Thermo Scientific, Applied Biosystems, Invitrogen, Fisher Scientific, Unity Lab Services, Patheon and PPD. 
        For more information, please visit www.thermofisher.com.`,
    industryCodes: mockIndustryCodeOptions,
    countryOptions: mockCountryOptions,
    submitLabel: "Submit",
    cancelLabel: "cancel",
  },
};
