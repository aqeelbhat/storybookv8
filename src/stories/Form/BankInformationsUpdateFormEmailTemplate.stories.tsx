import React from "react";
import { StoryFn } from "@storybook/react";

import { BankInformationsUpdateFormEmailTemplate } from "../../lib";
import { BankInformationsUpdateFormData } from "../../lib/Form/types";

const formData: BankInformationsUpdateFormData = {
  bankInformations: [
    {
      bankName: "Publ",
      currencyCode: null,
      accountHolder: "Yuan",
      omitAccountNumber: false,
      encryptedBankCode: {
        version: "",
        data: "",
        iv: "",
        unencryptedValue: "12345",
        maskedValue: "*****",
      },
      bankCodeEncrypted: true,
      bankAddress: {
        alpha2CountryCode: "IN",
        city: "pune",
        line1: "abc",
        line2: "xyz",
        line3: "pqr",
        postal: "445215",
        province: "str",
        streetNumber: "14",
        unitNumber: "200",
      },
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
      bankCode: "12345",
      bankCodeError: false,
      bankCountry: "SW",
    },
    {
      bankName: "Publ",
      currencyCode: null,
      accountHolder: "Yuan",
      omitAccountNumber: false,
      encryptedBankCode: {
        version: "",
        data: "",
        iv: "",
        unencryptedValue: "12345",
        maskedValue: "*****",
      },
      bankCodeEncrypted: true,
      bankAddress: {
        alpha2CountryCode: "SE",
        city: "pune",
        line1: "abc",
        line2: "xyz",
        line3: "pqr",
        postal: "445215",
        province: "str",
        streetNumber: "14",
        unitNumber: "200",
      },
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
      bankCode: "12345",
      bankCodeError: false,
      bankCountry: "SW",
    },
  ],
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Bank Info Update Form Email Template",
  component: BankInformationsUpdateFormEmailTemplate,
};

export const TemplateForm = {
  args: {
    data: formData,

    countryOptions: [
      {
        displayName: "Sweden",
        // "erpId": "",
        id: "SE",
        path: "SE",
        selectable: true,
      },
      {
        displayName: "India",
        // "erpId": "",
        id: "IN",
        path: "IN",
        selectable: true,
      },
    ],
  },
};
