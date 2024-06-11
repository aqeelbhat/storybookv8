import React from "react";
import { StoryFn } from "@storybook/react";

import {
  CompanyInfoForm,
  CompanyInfoFormData,
  CompanyInfoFormProps,
} from "./../../lib";
import {
  mockCountryOptions,
  mockOptionsDefault,
} from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";

const foreighTaxClassificationOptions = [
  {
    tenantId: null,
    id: "null__null__null__foreignCompany",
    code: "foreignCompany",
    type: null,
    app: null,
    name: "Foreign company",
    displayName: "Foreign company",
    codePath: null,
    path: "foreignCompany",
    level: 1,
    active: false,
    parentCode: null,
    desc: null,
    image: null,
    preferred: false,
    children: null,
    owner: null,
    other: null,
    recommended: false,
    order: null,
    lc: null,
  },
  {
    tenantId: null,
    id: "null__null__null__foreignPartnership",
    code: "foreignPartnership",
    type: null,
    app: null,
    name: "Foreign partnership, simple trust or a grantor trust (and not claiming treaty benefits)or if your company is acting as an intermediary",
    displayName:
      "Foreign partnership, simple trust or a grantor trust (and not claiming treaty benefits)or if your company is acting as an intermediary",
    codePath: null,
    path: "foreignPartnership",
    level: 1,
    active: false,
    parentCode: null,
    desc: null,
    image: null,
    preferred: false,
    children: null,
    owner: null,
    other: null,
    recommended: false,
    order: null,
    lc: null,
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

const formData: CompanyInfoFormData = {
  companyName: "",
  legalName: "",
  useCompanyName: true,
  website: "",
  address: {
    alpha2CountryCode: "",
    city: "pune",
    line1: "",
    line2: "xyz",
    line3: "pqr",
    postal: "445215",
    province: "str",
    streetNumber: "",
    unitNumber: "",
  },
  taxAddress: {
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
  useCompanyAddress: false,
  primary: {
    fullName: "",
    email: "",
    phone: "",
    role: "",
  },
  paymentContactEmail: "",
  companyEntityCountryCode: "US",
  usCompanyEntityType: { id: "id1", displayName: "Option 1", path: "option1" },
  taxKey: "ein",
  encryptedTaxCode: {
    data: "",
    maskedValue: "*****6789",
    unencryptedValue: "123456789",
    version: "",
    iv: "",
  },
  taxCodeError: false,
  taxFormKey: "w_8bene",
  taxForm: {
    filename: "a.csv",
    mediatype: "text/csv",
    path: "attachment/65099653170855936/a.csv",
    size: 185,
  },
  foreignTaxClassification: {
    id: "null__null__null__foreignCompany",
    displayName: "Foreign company",
    path: "foreignCompany",
  },
  usForeignTaxFormKey: "w_8imy",
  usForeignTaxForm: {
    filename: "a.csv",
    mediatype: "text/csv",
    path: "attachment/65099653170855936/a.csv",
    size: 185,
  },
  specialTaxStatus: false,
  specialTaxNote: "",
  specialTaxAttachment: null,
  foreignTaxKey: "abn",
  encryptedForeignTaxCode: {
    data: "",
    maskedValue: "",
    unencryptedValue: "",
    version: "",
    iv: "",
  },
  foreignTaxCodeError: false,
  foreignTaxFormKey: "w_8bene",
  foreignTaxForm: {
    filename: "a.csv",
    mediatype: "text/csv",
    path: "attachment/65099653170855936/a.csv",
    size: 185,
  },
  registryQuestion: "Is in registry?",
  inRegistry: false,
};

export default {
  title: "ORO UI Toolkit/Form/CopanyInfo Form",
  component: CompanyInfoForm,
};

export const TemplateForm = {
  args: {
    fields: [
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "legalName",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Legal name",
        type: "string",
      },
      {
        booleanValue: true,
        configOnly: false,
        displayType: "fieldRequirement",
        fieldName: "address",
        instruction: null,
        modifiable: false,
        order: 1,
        requirement: "required",
        sectionTitle: null,
        title: "Address",
        type: "string",
      },
    ],
    formData,
    countryOptions: mockCountryOptions,
    usCompanyEntityTypeOptions: mockOptionsDefault,
    usForeignTaxClassificationOptions: foreighTaxClassificationOptions,
    taxKeys: taxKeys,
    taxFormKeys: taxFormKeys,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
