import React from "react";
import { StoryFn } from "@storybook/react";

import { BankInfoFormEmailTemplate, BankInfoFormData } from "./../../lib";

const formData: BankInfoFormData = {
  businessEmail: "",
  companyEntityCountryCode: "",
  instruction: "",
  bankInformation: {
    currencyCode: { id: "id1", displayName: "Option 1", path: "option1" },
    bankName: "",
    accountHolder: "",
    accountHolderAddress: {
      alpha2CountryCode: "india",
      city: "pune",
      line1: "abc",
      line2: "xyz",
      line3: "pqr",
      postal: "445215",
      province: "str",
      streetNumber: "14",
      unitNumber: "200",
    },
    accountNumber: {
      version: "",
      data: "",
      iv: "",
      unencryptedValue: "12345",
      maskedValue: "*****",
    },
    key: "abaRoutingNumber",
    bankCode: "",
    bankCodeError: false,
    internationalKey: "abaRoutingNumber",
    internationalCode: "",
    internationalCodeError: false,
  },
  intermediaryBankRequired: true,
  intermediaryBankInformation: {
    bankName: "",
    bankAddress: {
      alpha2CountryCode: "india",
      city: "pune",
      line1: "abc",
      line2: "xyz",
      line3: "pqr",
      postal: "445215",
      province: "str",
      streetNumber: "14",
      unitNumber: "200",
    },
    key: "abaRoutingNumber",
    bankCode: "",
    bankCodeError: false,
  },
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/BankInfo Form email template",
  component: BankInfoFormEmailTemplate,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
