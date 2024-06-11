import React from "react";
import { StoryFn } from "@storybook/react";

import { getI18NInstance } from "../../../lib/i18n";
import {
  SupplierPaymentDetailsForm,
  SupplierPaymentDetailsFormProps,
} from "../../../lib/Form/BankInfoV3";
import {
  mockCompanyEntities,
  mockCountryOptions,
  mockCurrencyOptions,
  mockOptionsDefault,
} from "../../MultiLevelSelect/mocks";
import { bankKeys } from "../../mocks/bankKeys";

export default {
  title: "ORO UI Toolkit/Form/BankInfo V3 Form",
  component: SupplierPaymentDetailsForm,
};

getI18NInstance(true);

export const EditableForm = {
  args: {
    // formData: {
    //   paymentDetails: [
    //     {
    //       bankInformation: {
    //         bankName: "CITI Bank",
    //         accountHolder: "Procter & Gamble",
    //         accountHolderAddress: {
    //           alpha2CountryCode: 'US',
    //           city: 'pune',
    //           line1: 'abc',
    //           line2: 'xyz',
    //           line3: 'pqr',
    //           postal: '445215',
    //           province: 'str',
    //           streetNumber: '14',
    //           unitNumber: '200'
    //         },
    //         bankAddress: {
    //           alpha2CountryCode: 'US',
    //           city: 'pune',
    //           line1: 'abc',
    //           line2: 'xyz',
    //           line3: 'pqr',
    //           postal: '445215',
    //           province: 'str',
    //           streetNumber: '14',
    //           unitNumber: '200'
    //         },
    //         accountNumber: {
    //           maskedValue: "****1455"
    //         },
    //         key: 'abaRoutingNumber',
    //         bankCode: 123456789,
    //         internationalKey: "iban",
    //         internationalCode: "12345abcd",
    //         checkDeliveryAddress: {
    //           alpha2CountryCode: 'US',
    //           city: 'pune',
    //           line1: 'abc',
    //           line2: 'xyz',
    //           line3: 'pqr',
    //           postal: '445215',
    //           province: 'str',
    //           streetNumber: '14',
    //           unitNumber: '200'
    //         }
    //       },
    //       companyEntities: mockCompanyEntities,
    //       paymentModes: [{
    //         companyEntityCountry: "US",
    //         currencyCode: "USD",
    //         type: "check"
    //       }, {
    //         companyEntityCountry: "MX",
    //         currencyCode: "MXN",
    //         type: "online"
    //       }],
    //       selectedExistingBankInfo: true
    //     }
    //   ]
    // },
    // existingPaymentDetails: [
    //   {
    //     bankInformation: {
    //       bankName: "CITI Bank",
    //       accountHolder: "Procter & Gamble",
    //       accountHolderAddress: {
    //         alpha2CountryCode: 'US',
    //         city: 'pune',
    //         line1: 'abc',
    //         line2: 'xyz',
    //         line3: 'pqr',
    //         postal: '445215',
    //         province: 'str',
    //         streetNumber: '14',
    //         unitNumber: '200'
    //       },
    //       bankAddress: {
    //         alpha2CountryCode: 'US',
    //         city: 'pune',
    //         line1: 'abc',
    //         line2: 'xyz',
    //         line3: 'pqr',
    //         postal: '445215',
    //         province: 'str',
    //         streetNumber: '14',
    //         unitNumber: '200'
    //       },
    //       accountNumber: {
    //         maskedValue: "****1455"
    //       },
    //       key: 'abaRoutingNumber',
    //       bankCode: 123456789,
    //       checkDeliveryAddress: {
    //         alpha2CountryCode: 'US',
    //         city: 'pune',
    //         line1: 'abc',
    //         line2: 'xyz',
    //         line3: 'pqr',
    //         postal: '445215',
    //         province: 'str',
    //         streetNumber: '14',
    //         unitNumber: '200'
    //       }
    //     },
    //     companyEntities: [mockCompanyEntities[0], mockCompanyEntities[1]],
    //     paymentModes: [{
    //       companyEntityCountry: "US",
    //       currencyCode: "USD",
    //       type: "check"
    //     }, {
    //       companyEntityCountry: "MX",
    //       currencyCode: "MXN",
    //       type: "online"
    //     }]
    //   }
    // ],
    fields: [
      { fieldName: "businessEmail", requirement: "required" },
      { fieldName: "swiftCode", requirement: "omitted" },
      { fieldName: "bankDocument", requirement: "optional" },
      { fieldName: "acceptMultiplePayment", booleanValue: true },
      { fieldName: "instruction", requirement: "required" },
    ],
    partnerName: "Microsoft",
    countryOptions: mockCountryOptions,
    companyEntities: mockCompanyEntities, // [mockCompanyEntities[2]], // mockCompanyEntities,
    currencyOptions: mockCurrencyOptions,
    paymentModeConfig: [
      { alpha2Code: "US", domestic: ["ach", "check"], international: ["ach"] },
      {
        alpha2Code: "MX",
        domestic: ["wire", "online", "check"],
        international: ["wire", "online"],
      },
      {
        alpha2Code: "SE",
        domestic: ["invoice", "online"],
        international: ["directDebit"],
      },
    ],
    bankProofConfig: [
      {
        alpha2Code: "US",
        documents: ["bankletter", "estatement", "letterhead"],
      },
      { alpha2Code: "MX", documents: ["estatement", "letterhead"] },
      { alpha2Code: "SE", documents: ["estatement", "letterhead"] },
    ],
    bankKeys,
    getCountryBankKeys: () =>
      Promise.resolve({
        accountTypes: ["saving", "current"],
        domesticList: ["abaRoutingNumber"],
        domesticIbanMandatory: "mandatory",
        internationalIbanMandatory: "notSupported",
      }),
    // getCrossBorderStatuses: () => Promise.resolve({'US': true})
  },
};
