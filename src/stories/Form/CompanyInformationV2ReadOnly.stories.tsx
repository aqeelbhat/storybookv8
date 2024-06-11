import React from "react";
import { StoryFn } from "@storybook/react";

import { CompanyInfoV2FormReadOnly, CompanyInfoV2FormData } from "./../../lib";
import { mockCsvFile } from "../mocks/file.mock";
import { getI18NInstance } from "./../../lib/i18n";

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
  companyName: "test",
  legalName: "test",
  useCompanyName: true,
  website: "abc.com",
  duns: "12-045-3672",
  email: "mayur@orolabs.ai",
  phone: "1234567890",
  address: {
    alpha2CountryCode: "US",
    city: "Orlando",
    language: "",
    line1: "6000 Universal Blvd, Southwest Orlando",
    line2: "",
    line3: "",
    postal: "32819",
    province: "US-FL",
    streetNumber: "6000",
    unitNumber: "",
  },
  primary: {
    fullName: "",
    email: "",
    phone: "",
    role: "",
  },
  paymentContactEmail: null,
  taxAddress: {
    alpha2CountryCode: "DE",
    city: "Schönefeld",
    language: "",
    line1: "2 Willy-Brandt-Platz",
    line2: "",
    line3: "",
    postal: "12529",
    province: "DE-BB",
    streetNumber: "2",
    unitNumber: "",
  },
  useCompanyAddress: false,
  companyEntityCountryCode: "DE",
  usCompanyEntityType: null,
  taxKey: "vies",
  encryptedTaxCode: {
    version: "07a39728-2315-493a-9b18-eaee29618e3b",
    data: "VPMQuf6iFqTE+Ps8L9TY+g==",
    iv: "4bDqMM1JWwXwhFTAojE+FA==",
    unencryptedValue: "",
    maskedValue: "********7891",
  },
  taxCodeError: true,
  taxFormKey: null,
  taxForm: null,
  foreignTaxClassification: null,
  usForeignTaxFormKey: null,
  usForeignTaxForm: null,
  specialTaxStatus: true,
  specialTaxNote: "test",
  specialTaxAttachment: {
    date: "",
    expiration: "",
    filename: "all-steps.svg",
    mediatype: "image/svg+xml",
    path: "attachment/2023/3/16/289431832032347453/all-steps.svg",
    reference: "",
    size: 744,
    note: "",
    name: "",
    sourceUrl: "",
  },
  foreignTaxKey: null,
  encryptedForeignTaxCode: null,
  foreignTaxCodeError: false,
  foreignTaxFormKey: null,
  foreignTaxForm: null,
  registryQuestion: null,
  inRegistry: false,
  taxKeysList: [
    {
      id: "vies",
      displayName: "vies",
      path: "vies",
    },
    {
      id: "gst",
      displayName: "gst",
      path: "gst",
    },
  ],
  indirectTaxKey: "vies",
  indirectTaxKeysList: [
    {
      id: "vies",
      displayName: "vies",
      path: "vies",
    },
    {
      id: "gst",
      displayName: "gst",
      path: "gst",
    },
  ],
  encryptedIndirectTaxCode: {
    version: "07a39728-2315-493a-9b18-eaee29618e3b",
    data: "VPMQuf6iFqTE+Ps8L9TY+g==",
    iv: "4bDqMM1JWwXwhFTAojE+FA==",
    unencryptedValue: "",
    maskedValue: "********7891",
  },
  taxFormKeysList: [
    {
      id: "certificateIncorporation",
      displayName: "certificateIncorporation",
      path: "certificateIncorporation",
    },
  ],
  usTaxDeclarationFormsList: [],
  usTaxDeclarationFormKey: null,
  usTaxDeclarationForm: null,
  exemptionTaxKey: "vies",
  exemptionTaxKeysList: [
    {
      id: "vies",
      displayName: "vies",
      path: "vies",
    },
    {
      id: "gst",
      displayName: "gst",
      path: "gst",
    },
  ],
  encryptedExemptionTaxCode: {
    version: "",
    data: "",
    iv: "",
    unencryptedValue: "",
    maskedValue: "",
  },
  indirectTaxCodeError: true,
  exemptionTaxCodeError: true,
  tax1099Required: true,
  tax1099: {
    id: "yes",
    displayName: "Yes",
    path: "yes",
  },
  taxCodeValidationTimeout: false,
  exemptionTaxCodeValidationTimeout: true,
  indirectTaxCodeValidationTimeout: true,
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Company info V2 Form Read Only",
  component: CompanyInfoV2FormReadOnly,
};
getI18NInstance(true);

export const TemplateForm = {
  args: {
    data: formData,
    taxKeys: taxKeys,
    taxFormKeys: taxFormKeys,
    isValidationSupported: true,
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
