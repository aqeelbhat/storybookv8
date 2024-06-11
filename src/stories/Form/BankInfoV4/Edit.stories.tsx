import React from "react";
import { StoryFn } from "@storybook/react";

import { getI18NInstance } from "../../../lib/i18n";
import { SupplierPaymentDetailsForm } from "../../../lib/Form/BankInfoV4";
import {
  mockCompanyEntities,
  mockCountryOptions,
  mockCurrencyOptions,
  mockOptionsDefault,
} from "../../MultiLevelSelect/mocks";
import { bankKeys } from "../../mocks/bankKeys";
import { SupplierPaymentDetailsFormProps } from "../../../lib/Form/BankInfoV3";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import { mockAddress } from "../../mocks/file.mock";

const fields = [
  { fieldName: "businessEmail", requirement: "required" },
  { fieldName: "swiftCode", requirement: "omitted" },
  // { fieldName: "bankDocument", requirement: "omitted" },
  { fieldName: "acceptMultiplePayment", booleanValue: true },
  { fieldName: "instruction", requirement: "optional" },
  { fieldName: "allowPaymentModeSelection", booleanValue: false },
  { fieldName: "allowBankPayoutCurrencyRequest", booleanValue: true },
];
const bankProofConfig = [
  { alpha2Code: "US", documents: ["bankletter", "estatement", "letterhead"] },
  { alpha2Code: "IN", documents: ["bankletter", "estatement"] },
  { alpha2Code: "MX", documents: ["estatement", "letterhead"] },
  { alpha2Code: "SE", documents: ["estatement", "letterhead"] },
];
const paymentModeConfig = [
  { alpha2Code: "US", domestic: ["ach", "check"], international: ["wire"] },
  {
    alpha2Code: "MX",
    domestic: ["wire", "online", "check"],
    international: ["wire", "online"],
  },
  {
    alpha2Code: "SE",
    domestic: ["bankgirot", "online"],
    international: ["online"],
  },
  {
    alpha2Code: "IN",
    domestic: ["online", "check"],
    international: ["online"],
  },
  {
    alpha2Code: "IT",
    domestic: ["wire", "directDebit"],
    international: ["wire"],
  },
  { alpha2Code: "BR", domestic: ["wire", "check"], international: ["wire"] },
  { alpha2Code: "DK", domestic: ["wire", "check"], international: ["wire"] },
];

export default {
  title: "ORO UI Toolkit/Form/BankInfo V4 Form",
  component: SupplierPaymentDetailsForm,
};

getI18NInstance(true);

export const NonIban = {
  args: {
    existingPaymentDetails: [
      {
        bankInformation: {
          bankAddress: { alpha2CountryCode: "IN" },
          bankName: "CHASE",
          accountHolder: "P&G North America",
          accountHolderAddress: {
            line1: "1101 W McKinley Avenue",
            city: "Pomona",
            province: "California",
            alpha2CountryCode: "IN",
            postal: "91768",
          },
          accountType: "", // saving/checking
          accountNumber: { maskedValue: "*********1413", unencryptedValue: "" },
          paymentAddress: "", // bankgiro
          key: "aba",
          bankCode: "63563GDF23",
          bankCodeError: false,
          isIbanAvailable: true, // for iban recommended countries
          internationalKey: "iban",
          encryptedInternationalBankCode: {
            maskedValue: "*********1413",
            unencryptedValue: "",
          },
          internationalCodeError: false,
          swiftCode: "13414GR",
          swiftCodeError: false,
          checkDeliveryAddress: {
            line1: "1101 W McKinley Avenue",
            city: "Pomona",
            province: "California",
            alpha2CountryCode: "IN",
            postal: "91768",
          },
        },
        companyEntities: [],
        paymentModes: [
          // { companyEntityCountry: 'US', type: 'check', currencyCode: DEFAULT_CURRENCY }
          { companyEntityCountry: "IN", type: "online", currencyCode: "INR" },
        ],
      },
    ],
    formData: {
      companyEntities: [mockCompanyEntities[3]],
      formApplicableForExtension: true,
      businessEmail: "ar.p&g@gmai.com",
      paymentDetails: [],
      instruction: "Please involve finance team to review the data.",
    },
    fields,
    partnerName: "Microsoft",
    // partnerCurrency: 'EUR',
    countryOptions: [mockCountryOptions[0], mockCountryOptions[3]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    // companyEntities: [mockCompanyEntities[3]],
    getCrossBorderStatuses: () => Promise.resolve({ US: true, IN: false }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["ifsc"],
        domesticIbanMandatory: "notSupported",
        internationalIbanMandatory: "notSupported",
      }),
    onFilterBankCountries: () => Promise.resolve(["US", "IN"]),
    getBankDetails: () =>
      Promise.resolve([
        {
          name: "Bla Bla bank",
          accountNumber: "111111111111",
          swift: "SWIFTXXXX",
        },
      ]),
    // onPlaceSelectParseAddress: () => Promise.resolve(mockAddress)
  },
};

export const NonIbanAdvance = {
  args: {
    formData: {
      companyEntities: [mockCompanyEntities[3]],
    },
    fields,
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[0], mockCountryOptions[3]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    getCrossBorderStatuses: () => Promise.resolve({ US: true, IN: false }),
    getCountryBankKeys: () =>
      Promise.resolve({
        accountTypes: ["Saving", "Current"],
        domesticList: ["ifsc", "inrn"],
        domesticIbanMandatory: "notSupported",
        internationalIbanMandatory: "notSupported",
      }),
    onFilterBankCountries: undefined,
    validateBankInfo: () => Promise.resolve(false),
  },
};

export const Iban = {
  args: {
    fields,
    formData: {
      companyEntities: [mockCompanyEntities[4]],
    },
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[0], mockCountryOptions[7]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    getCrossBorderStatuses: () => Promise.resolve({ US: true, IT: false }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["ilrn"],
        domesticIbanMandatory: "mandatory",
        internationalIbanMandatory: "mandatory",
      }),
    onFilterBankCountries: undefined,
  },
};

export const IbanOptional = {
  args: {
    fields,
    formData: {
      companyEntities: [mockCompanyEntities[5]],
    },
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[0], mockCountryOptions[8]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    getCrossBorderStatuses: () => Promise.resolve({ US: true, BR: false }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["brrn"],
        domesticIbanMandatory: "recommended",
        internationalIbanMandatory: "recommended",
      }),
    onFilterBankCountries: undefined,
  },
};

export const Sweden = {
  args: {
    formData: {
      companyEntities: [mockCompanyEntities[2]],
    },
    existingPaymentDetails: [
      {
        bankInformation: {
          bankAddress: { alpha2CountryCode: "IN" },
          accountHolder: "P&G North America",
          paymentAddress: {
            maskedValue: "*********1413",
            unencryptedValue: "",
          },
        },
        companyEntities: [mockCompanyEntities[2]],
        paymentModes: [
          { companyEntityCountry: "IN", type: "bangiro", currencyCode: "INR" },
        ],
      },
    ],
    fields,
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[0], mockCountryOptions[2]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    getCrossBorderStatuses: () => Promise.resolve({ SE: false, US: true }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["secl"],
        domesticIbanMandatory: "recommended",
        internationalIbanMandatory: "mandatory",
      }),
    onFilterBankCountries: undefined,
  },
};

export const DomesticAndInternationalNonIban = {
  args: {
    fields,
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[0]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    companyEntities: [mockCompanyEntities[0], mockCompanyEntities[3]],
    getCrossBorderStatuses: () => Promise.resolve({ US: true, IN: false }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["ifsc"],
        domesticIbanMandatory: "notSupported",
        internationalIbanMandatory: "notSupported",
      }),
    onFilterBankCountries: undefined,
  },
};

export const SwedenDomesticAndInternational = {
  args: {
    fields,
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[2]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    companyEntities: [mockCompanyEntities[0], mockCompanyEntities[2]],
    getCrossBorderStatuses: () => Promise.resolve({ SE: false, US: true }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["secl"],
        domesticIbanMandatory: "recommended",
        internationalIbanMandatory: "mandatory",
      }),
    onFilterBankCountries: undefined,
  },
};

export const DomesticIbanOptionalAndInternationalIban = {
  args: {
    fields,
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[9]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    companyEntities: [mockCompanyEntities[0], mockCompanyEntities[6]],
    getCrossBorderStatuses: () => Promise.resolve({ DK: false, US: true }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["bic"],
        domesticIbanMandatory: "recommended",
        internationalIbanMandatory: "mandatory",
      }),
    onFilterBankCountries: undefined,
  },
};

export const DomesticIbanOptionalAndInternationalIbanOptional = {
  args: {
    fields,
    partnerName: "Microsoft",
    countryOptions: [mockCountryOptions[8]],
    currencyOptions: mockCurrencyOptions,
    bankKeys,
    bankProofConfig,
    paymentModeConfig,
    companyEntities: [mockCompanyEntities[0], mockCompanyEntities[5]],
    getCrossBorderStatuses: () => Promise.resolve({ BR: false, US: true }),
    getCountryBankKeys: () =>
      Promise.resolve({
        domesticList: ["brrn"],
        domesticIbanMandatory: "recommended",
        internationalIbanMandatory: "recommended",
      }),
    onFilterBankCountries: undefined,
  },
};
