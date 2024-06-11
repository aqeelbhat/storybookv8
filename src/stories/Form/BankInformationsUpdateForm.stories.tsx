import React from "react";
import { StoryFn } from "@storybook/react";
import {
  mockCountryOptions,
  mockOptionsDefault,
} from "../MultiLevelSelect/mocks";
import { bankKeys } from "../mocks/bankKeys";
import { bankSuggestions } from "../mocks/bankSuggestions";
import {
  BankInformationsUpdateFormData,
  BankInformationsUpdateFormProps,
} from "../../lib/Form/types";
import { BankInformationsUpdateForm } from "../../lib";
import { parseAddressToFIll } from "../../lib/Form/util";

const formData: BankInformationsUpdateFormData = {
  // "new": false,
  // "edited": false,
  bankInformations: [
    {
      accountHolderAddress: {
        province: "",
        streetNumber: "",
        city: "",
        unitNumber: "",
        alpha2CountryCode: "",
        language: "",
        postal: "",
        line3: "",
        line2: "",
        line1: "",
      },
      bankCode: "12345",
      encryptedBankCode: undefined,
      currencyCode: {
        name: "Swedish Krona (SEK)",
        id: "SEK",
        erpId: "SEK",
      },
      bankName: "Publ",
      bankSuggestion: {
        name: "Alden State Bk",
        address: {
          line1: "Po Box 39",
          line2: "",
          line3: "",
          streetNumber: "",
          unitNumber: "",
          city: "Alden",
          province: "MI (Michigan)",
          alpha2CountryCode: "SE",
          postal: "49612-0039",
        },
        code: "72405442",
        type: "abaRoutingNumber",
      },
      accountNumber: {
        data: "XbEGOZcK4huUW3X0AYHl9A==",
        maskedValue: "********",
        unencryptedValue: "",
        version: "07a39728-2315-493a-9b18-eaee29618e3b",
        iv: "07a39728-2315-493a-9b18-eaee29618e3b",
      },
      accountHolder: "Yuan",
      bankCodeEncrypted: false,
      bankCodeError: false,
      key: "abaRoutingNumber",
      bankAddress: {
        line1: "ABC line 1",
        alpha2CountryCode: "SE",
        city: "ABC City",
        postal: "ABC postal",
        province: "ABC proince",
        line2: "",
        line3: "",
        streetNumber: "",
        unitNumber: "",
      },
      bankCountry: "SE",
    },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/BankInfoUpdate Form",
  component: BankInformationsUpdateForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "beneficiaryAccountAddress",
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
        fieldName: "currencyCode",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "currencyCode",
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
    bankSuggestions,
    isCrossBorder: true,
    domesticKeyOptions: [
      {
        bankKey: "bankgiro",
        bankCodeEncrypted: false,
        omitAccountNumber: true,
      },
      { bankKey: "iban", bankCodeEncrypted: true, omitAccountNumber: true },
    ],
    countryCode: "US",
    onBankKeySuggest: () => Promise.resolve("abaRoutingNumber"),
    onBankKeySearch: () =>
      Promise.resolve([
        {
          name: "Temp",
          address: {
            line1: "line1",
            city: "city",
            province: "province",
            alpha2CountryCode: "SE",
            postal: "postal",
          },
          code: "12345",
        },
        {
          name: "Temp 2",
          address: {
            line1: "line1",
            city: "city xdfgdg",
            province: "province",
            alpha2CountryCode: "SE",
            postal: "postal",
          },
          code: "12345",
        },
        {
          name: "Temp 3",
          address: {
            line1: "line1",
            city: "city sfsdfds",
            province: "province",
            alpha2CountryCode: "SE",
            postal: "postal",
          },
          code: "12345",
        },
      ]),
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    parseAddressToFIll: parseAddressToFIll,
  },
};
