import React from "react";
import { StoryFn } from "@storybook/react";

import {
  IndividualBankInfoForm,
  BankInfoFormData,
  BankInfoFormProps,
} from "./../../lib";
import {
  mockCountryOptions,
  mockOptionsDefault,
} from "../MultiLevelSelect/mocks";
import { bankKeys } from "../mocks/bankKeys";

const formData: BankInfoFormData = {
  businessEmail: "yuan.tung@orolabs.ai",
  instruction: "Instruction testing",
  companyEntityCountryCode: "DE",
  intermediaryBankInformation: null,
  // "new": false,
  // "edited": false,
  bankInformation: {
    accountHolderAddress: {
      province: "SE-Stockholms län",
      streetNumber: "12",
      city: "Stockholm",
      unitNumber: "Skeppsbron",
      alpha2CountryCode: "SE",
      language: "",
      postal: "111 30",
      line3: "",
      line2: "Södermalm",
      line1: "",
    },
    // "accountHolderAddress": {
    //   "province": "",
    //   "streetNumber": "",
    //   "city": "",
    //   "unitNumber": "",
    //   "alpha2CountryCode": "SE",
    //   "language": "",
    //   "postal": "",
    //   "line3": "",
    //   "line2": "",
    //   "line1": ""
    // },
    bankCode: "1234567",
    encryptedBankCode: undefined,
    omitInternalAccountNUmber: false,
    // "currencyCodeStr": "SEK",
    bankName: "Publ",
    accountNumber: {
      data: "",
      maskedValue: "",
      unencryptedValue: "",
      version: "",
      iv: "",
    },
    encryptedInternationalBankCode: undefined,
    internationalCodeEncrypted: false,
    accountHolder: "Yuan ",
    bankCodeEncrypted: false,
    internationalKey: "swift",
    internationalCode: "",
    internationalCodeError: false,
    omitAccountNumber: true,
    bankCodeError: false,
    currencyCode: {
      displayName: "Swedish Krona (SEK)",
      // "erpId": "",
      id: "SEK",
      path: "SEK",
    },
    key: "bankgiro",
  },
  intermediaryBankRequired: false,
};

export default {
  title: "ORO UI Toolkit/Form/Individual BankInfo Form",
  component: IndividualBankInfoForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "account",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Account",
        type: "string",
      },
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "abaRoutingNumber",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Aba Routing Number",
        type: "string",
      },
    ],
    formData,
    countryOptions: [
      {
        displayName: "Sweden",
        // "erpId": "",
        id: "SE",
        path: "SE",
        selectable: true,
      },
    ],
    currencyOptions: [
      {
        displayName: "Swedish Krona (SEK)",
        // "erpId": "",
        id: "SEK",
        path: "SEK",
        selectable: true,
      },
    ],
    bankKeys,
    isCrossBorder: false,
    domesticKeyOptions: [
      {
        bankKey: "bankgiro",
        bankCodeEncrypted: false,
        omitAccountNumber: true,
      },
      { bankKey: "iban", bankCodeEncrypted: true, omitAccountNumber: true },
    ],
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
  },
};
