import React from "react";
import { StoryFn } from "@storybook/react";
import {
  UpdateSupplierCompanyDetailsFormEmailTemplate,
  UpdateSupplierCompanyDetailsFormReadOnlyProps,
} from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title:
    "ORO UI Toolkit/Form/UpdateSupplierProfile/Update Company Details Email",
  component: UpdateSupplierCompanyDetailsFormEmailTemplate,
};

export const TemplateForm = {
  args: {
    formData: {
      commonName: "Thermo Fisher Scientific",
      address: {
        line1: "Waltham, MA",
      },
      website: "www.thermofisher.com",
      email: "support@thermofisher.com",
      phone: "+44123456789",
      description: `Thermo Fisher Scientific Inc. is the world leader in serving science, with annual revenue of approximately $40 billion. Our Mission is to enable our customers to make the world healthier, cleaner and safer. Whether our customers are accelerating life sciences research, solving complex analytical challenges, increasing productivity in their laboratories, improving patient health through diagnostics or the development and manufacture of life-changing therapies, we are here to support them. Our global team delivers an unrivaled combination of innovative technologies, purchasing convenience and pharmaceutical services through our industry-leading brands, including Thermo Scientific, Applied Biosystems, Invitrogen, Fisher Scientific, Unity Lab Services, Patheon and PPD. 
            For more information, please visit www.thermofisher.com.`,
      currentLogo: {
        metadata: [
          {
            path: "oro/images/large/88868992679429039.png",
            width: 200,
            height: 200,
          },
        ],
      },
      industryCode: { id: "10", name: "Agriculture" },
      parentCompany: null,
    },
  },
};
