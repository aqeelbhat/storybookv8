import React from "react";
import { StoryFn } from "@storybook/react";

import {
  CompanyIndividualInfoV2FormEmail,
  CompanyIndividualInfoV2FormReadOnlyProps,
} from "../../lib";
import {
  mockCountryOptions,
  mockOptionsDefault,
} from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { getI18NInstance } from "../../lib/i18n";

const foreignTaxClassificationOptions = [
  {
    id: "_USForeignTaxClassificationIndividual__Any__foreignCompany",
    displayName: "Foreign company",
    path: "foreignCompany",
    customData: {
      erpId: null,
      code: "foreignCompany",
      other: {
        currencyId: "",
        currencyCode: "",
      },
    },
    icon: "",
    selected: false,
    selectable: true,
  },
  {
    id: "_USForeignTaxClassificationIndividual__Any__foreignPartnership",
    displayName:
      "Foreign partnership, simple trust or a grantor trust (and not claiming treaty benefits)or if your company is acting as an intermediary",
    path: "foreignPartnership",
    customData: {
      erpId: null,
      code: "foreignPartnership",
      other: {
        currencyId: "",
        currencyCode: "",
      },
    },
    icon: "",
    selected: false,
    selectable: true,
  },
  {
    id: "_USForeignTaxClassificationIndividual__Any__foreignGoverment",
    displayName:
      "Certificate of foreign government or other foreign organization for United States tax withholding and reporting",
    path: "foreignGoverment",
    customData: {
      erpId: null,
      code: "foreignGoverment",
      other: {
        currencyId: "",
        currencyCode: "",
      },
    },
    icon: "",
    selected: false,
    selectable: true,
  },
];

const taxKeys = [
  {
    code: "vies",
    name: "VAT Registration Number",
    description: null,
  },
  {
    code: "tin",
    name: "Income tax id",
    description: null,
  },
  {
    code: "utr",
    name: "Unique Taxpayer Reference Number",
    description:
      "UTR Number is issued by HMRC and used for filing taxes. (10 Digits) ",
  },
  {
    code: "ecn",
    name: "Vietnam Enterprise ID or ECN Code Number",
    description: null,
  },
  {
    code: "PAN",
    name: "Permanent Account Number",
    description: null,
  },
  {
    code: "ABN",
    name: "Australian Business Number",
    description: null,
  },
  {
    code: "gst_hst",
    name: "Federal Business Number",
    description:
      "9 digit Identification number issued by Canada Revenue Agency and used for filing business taxes",
  },
  {
    code: "ein",
    name: "US Tax Identification/ EIN Number",
    description:
      "Enter the EIN number for your company’s federal tax filing with IRS",
  },
  {
    code: "uen",
    name: "Unique Entity Number",
    description:
      "Identification number issued by government agency (e.g. ACRA, ROS)",
  },
];

const taxFormKeys = [
  {
    code: "w_8bene",
    name: "VAT Registration Number",
    description:
      "Non-US business entities that have US-sourced income are required to complete a W-8BEN-E form.",
    linkText:
      "You can find the W-8BENE Tax form and the instructions on the IRS website.",
    link: "https://www.irs.gov/forms-pubs/about-form-w-8-ben-e",
  },
  {
    code: "w_8imy",
    name: "Income tax id",
    description:
      "Non-US business entities that are a foreign partnership, a foreign simple trust or a foreign grantor trust (and not claiming treaty benefits) or the payee is an individual acting as Intermediary are required to complete the W-8IMY form.",
    linkText:
      "You can find the W-8IMY Tax form and instructions on the IRS website.",
    link: "https://www.irs.gov/forms-pubs/about-form-w-8-imy",
  },
  {
    code: "w_9",
    name: "Unique Taxpayer Reference Number",
    description: null,
    linkText: "You can find the IRS W-9 Tax form here",
    link: "https://www.irs.gov/pub/irs-pdf/fw9.pdf",
  },
  {
    code: "certificateIncorporation",
    name: "Certificate of incorporation",
    description: null,
    linkText: null,
    link: null,
  },
];

const formData = {
  companyEntityCountryCode: "US",
  encryptedExemptionTaxCode: {
    version: null,
    data: null,
    iv: null,
    unencryptedValue: null,
    restrainDecryptData: false,
    unmaskSize: 4,
    maskedValue: null,
    setBy: null,
  },
  lastName: "Wick",
  indirectTaxCodeError: false,
  exemptionTaxCodeError: false,
  companyName: null,
  exemptionTaxCodeValidationTimeout: false,
  useCompanyName: true,
  taxFormKey: null,
  reincarnationId: null,
  usCompanyEntityType: null,
  encryptedIndirectTaxCode: {
    version: null,
    data: null,
    iv: null,
    unencryptedValue: null,
    restrainDecryptData: false,
    unmaskSize: 4,
    maskedValue: null,
    setBy: null,
  },
  legalName: null,
  specialTaxStatus: false,
  exemptionTaxKeysList: ["usein", "other"],
  encryptedTaxCode: {
    version: null,
    data: null,
    iv: null,
    unencryptedValue: null,
    restrainDecryptData: false,
    unmaskSize: 4,
    maskedValue: null,
    setBy: null,
  },
  taxFormKeysList: ["certificateIncorporation"],
  indirectTaxKey: null,
  taxCodeError: false,
  taxForm: null,
  taxAddress: {
    line1: "Balewadi High St, Baner",
    line2: "",
    line3: "",
    streetNumber: "",
    unitNumber: "",
    city: "Pune",
    province: "IN-MH",
    alpha2CountryCode: "IN",
    postal: "411045",
    language: "",
  },
  indirectTaxKeysList: ["ingstin"],
  specialTaxNote: null,
  email: "bharath.keshav@orolabs.ai",
  useCompanyAddress: true,
  tax1099: null,
  taxCodeValidationTimeout: false,
  website: null,
  address: {
    line1: "Balewadi High St, Baner",
    line2: "",
    line3: "",
    streetNumber: "",
    unitNumber: "",
    city: "Pune",
    province: "IN-MH",
    alpha2CountryCode: "IN",
    postal: "411045",
    language: "",
  },
  edited: false,
  specialTaxAttachment: null,
  exemptionTaxKey: null,
  tax1099Required: false,
  usTaxDeclarationForm: null,
  foreignTaxClassification: {
    id: "foreignCompany",
    name: "Foreign company",
    erpId: "",
  },
  firstName: "John",
  taxKey: null,
  taxKeysList: ["inpan", "other"],
  phone: null,
  previousVersion: null,
  indirectTaxCodeValidationTimeout: false,
  paymentContactEmail: null,
  middleName: "Doe",
  usTaxDeclarationFormKey: "w_8bene",
  primary: {
    primary: true,
    emailVerified: false,
    phoneVerified: false,
  },
};
getI18NInstance(true);

export default {
  title: "ORO UI Toolkit/Form/CompanyIndividualInfoV2 Email Template Form",
  component: CompanyIndividualInfoV2FormEmail,
};

export const TemplateForm = {
  args: {
    data: formData,
    countryOptions: mockCountryOptions,
    usCompanyEntityTypeOptions: mockOptionsDefault,
    usForeignTaxClassificationIndividualOptions:
      foreignTaxClassificationOptions,
    taxKeys: taxKeys,
    taxFormKeys: taxFormKeys,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
