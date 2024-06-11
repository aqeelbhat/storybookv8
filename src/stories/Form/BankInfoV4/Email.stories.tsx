import React from "react";
import { StoryFn } from "@storybook/react";

import { getI18NInstance } from "../../../lib/i18n";
import { SupplierPaymentDetailsFormProps } from "../../../lib/Form/BankInfoV3";
import {
  mockCompanyEntities,
  mockCountryOptions,
  mockCurrencyOptions,
} from "../../MultiLevelSelect/mocks";
import { bankKeys } from "../../mocks/bankKeys";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import { SupplierPaymentDetailsEmailTemplateV4 } from "../../../lib/Form";

export default {
  title: "ORO UI Toolkit/Form/BankInfo V4 Form",
  component: SupplierPaymentDetailsEmailTemplateV4,
};

getI18NInstance(true);

export const EmailTemplate = {
  args: {
    formData: {
      businessEmail: "noopur@orolabs.ai",
      paymentDetails: [
        {
          bankInformation: {
            bankName: "SVB",
            bankAddress: { alpha2CountryCode: "US" },
          },
          companyEntities: [
            { id: "HM", displayName: "Honeycomb Mfg.", path: "HM" },
            {
              id: "HH-11",
              displayName: "Honeycomb Holdings Mexico",
              path: "11",
            },
          ],
          paymentModes: [
            {
              companyEntityCountry: "US",
              type: "check",
              currencyCode: DEFAULT_CURRENCY,
            },
            { companyEntityCountry: "MX", type: "wire", currencyCode: "MXN" },
          ],
        },
      ],
      instruction: "Please involve finance team to review the data.",
    },
    fields: [{ fieldName: "businessEmail", requirement: "required" }],
    countryOptions: mockCountryOptions,
    companyEntities: mockCompanyEntities,
    currencyOptions: mockCurrencyOptions,
    paymentModeConfig: [
      { alpha2Code: "US", domestic: ["check", "ach"], international: ["ach"] },
      {
        alpha2Code: "MX",
        domestic: ["check", "wire", "online"],
        international: ["wire", "online"],
      },
      {
        alpha2Code: "default",
        domestic: ["invoice", "online"],
        international: ["online"],
      },
    ],
    bankProofConfig: [
      {
        alpha2Code: "US",
        documents: ["bankletter", "estatement", "letterhead"],
      },
      { alpha2Code: "MX", documents: ["estatement", "letterhead"] },
    ],
    bankKeys,
  },
};
