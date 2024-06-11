import React from "react";
import { StoryFn } from "@storybook/react";

import { BankInfoFormReadOnly, BankInfoFormData } from "./../../lib";

const formData: BankInfoFormData = {
  businessEmail: "",
  instruction: "",
  companyEntityCountryCode: "",
  bankInformation: {
    currencyCode: { id: "id1", displayName: "Option 1", path: "option1" },
    bankName: "",
    accountHolder: "",
    omitAccountNumber: false,
    encryptedBankCode: {
      version: "",
      data: "",
      iv: "",
      unencryptedValue: "12345",
      maskedValue: "*****",
    },
    bankCodeEncrypted: true,
    omitInternalAccountNUmber: false,
    encryptedInternationalBankCode: {
      version: "",
      data: "",
      iv: "",
      unencryptedValue: "12345",
      maskedValue: "*****",
    },
    internationalCodeEncrypted: false,
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
  title: "ORO UI Toolkit/Form/Bank Info Form Read Only",
  component: BankInfoFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
