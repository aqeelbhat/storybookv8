import React from "react";
import { StoryFn } from "@storybook/react";

import {
  CompanyInfoFormV4,
  CompanyInfoV4FormData,
  CompanyInfoV4FormProps,
} from "../../lib";
import {
  mockCountryOptions,
  mockOptionsDefault,
} from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { getI18NInstance } from "../../lib/i18n";

const foreignTaxClassificationOptions = [
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

let formData: CompanyInfoV4FormData = {
  additionalDocuments: [],
  newSupplierSelected: false,
  allowSubsidiaryEntitySelection: false,
  formApplicableForExtension: true,
  indirectTax: {
    taxKeysList: ["phtin"],
    taxKey: "phtin",
    encryptedTaxCode: {
      version: "c1641cdf-0c59-4776-b43d-ee894bd487f8",
      data: "vfCwoO73DmfXukjMuOCIfg==",
      iv: "ZFiE0Y9Ztoy/s3m2Ladn0A==",
      unencryptedValue: "01042506300000",
      maskedValue: "",
    },
    taxCodeError: false,
    taxCodeValidationTimeout: false,
  },
  companyName: "Michael Page International Recruitment (Philippines) Inc.",
  multiLingualAddresses: [],
  useCompanyName: false,
  jurisdictionCountryCode: "PH",
  usCompanyEntityType: null,
  legalName: "Michael Page International Recruitment (Philippines) Inc.",
  specialTaxStatus: false,
  indirectTaxForm: {
    taxFormKeysList: [],
    taxForm: {
      filename: "Form_W-8BEN-E.svg",
      mediatype: "svg",
      size: 0,
      path: "attachment/2024/1/15/399879884067942354/Form_W-8BEN-E.svg",
      sourceUrl: "",
      reference: "",
      name: "",
      note: "",
      contentKind: "CustomerPrivate",
    },
    taxFormKey: "",
  },
  taxForm: {
    taxFormKeysList: ["certificateIncorporation"],
    taxFormKey: "certificateIncorporation",
    taxForm: {
      filename: "Form_W-8BEN-E.svg",
      mediatype: "svg",
      size: 0,
      path: "attachment/2024/1/15/399879884067942354/Form_W-8BEN-E.svg",
      sourceUrl: "",
      reference: "",
      name: "",
      note: "",
      contentKind: "CustomerPrivate",
    },
  },
  taxAddress: {
    line1: "21/F Units 4-5, Zuellig Building,",
    line2: "Makati Avenue Cnr Paseo de Roxas and Sta Potenciana Street",
    line3: "",
    streetNumber: "",
    unitNumber: "",
    city: "",
    province: "",
    alpha2CountryCode: "IN",
    postal: "1225",
    language: "",
  },
  fax: "1234654345",
  specialTaxNote: "",
  email: "accountsPH@michaelpage.com.ph",
  useCompanyAddress: false,
  tax1099: null,
  additionalDocsList: [],
  website: "",
  address: {
    line1: "Unit 4-5, 21st Floor, The Zuellig Building,",
    line2: "Makati Avenue corner Paseo de Roxas and Sta Potenciana Street",
    line3: "",
    streetNumber: "",
    unitNumber: "",
    city: "Makati",
    province: "",
    alpha2CountryCode: "PH",
    postal: "1225",
    language: "",
  },
  specialTaxAttachments: [],
  tax: {
    taxKeysList: ["tin"],
    taxKey: "tin",
    encryptedTaxCode: {
      version: "c1641cdf-0c59-4776-b43d-ee894bd487f8",
      data: "vfCwoO73DmfXukjMuOCIfg==",
      iv: "ZFiE0Y9Ztoy/s3m2Ladn0A==",
      unencryptedValue: "01042506300000",
      maskedValue: "********0000",
    },
    taxCodeError: false,
    taxCodeValidationTimeout: false,
  },
  tax1099Required: false,
  usTaxDeclarationForm: {
    filename: "Form_W-8BEN-E.pdf",
    mediatype: "application/pdf",
    size: 0,
    path: "attachment/2024/1/15/399879884067942354/Form_W-8BEN-E.pdf",
    sourceUrl: "",
    reference: "",
    name: "",
    note: "",
    contentKind: "CustomerPrivate",
  },
  foreignTaxClassification: {
    id: "foreignCompany",
    name: "Foreign company",
    erpId: "",
    refId: "",
  },
  usTaxDeclarationFormOcrInfo: null,
  companyEntityCountryCodes: ["US"],
  phone: "+63277952800",
  instruction: "N/A",
  duns: "",
  paymentContactEmail: "",
  usTaxDeclarationFormKey: "w_8bene",
  primary: {
    fullName: "Edmund Tan",
    email: "edmundtan@michaelpage.com.sg",
    role: "",
    phone: "",
    requireBackgroundCheck: false,
    emailVerified: false,
    phoneVerified: false,
  },
};
function handleValueChange(
  fieldName: string,
  newForm: CompanyInfoV4FormData,
): Promise<boolean> {
  formData = newForm;
  return Promise.resolve(true);
}
export default {
  title: "ORO UI Toolkit/Form/CompanyInfoV4 Form",
  component: CompanyInfoFormV4,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "companyName",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Company name",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "email",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Email",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "phone",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Phone",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "fax",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Fax number",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "legalName",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Legal name",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "website",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "website",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        booleanValue: true,
        customLabel: "",
        fieldName: "excludeAddressSuggestion",
        intValue: null,
        itemConfig: null,
        questionnaireId: null,
        requirement: "optional",
        stringValue: "",
        title: "Exclude address suggestion",
      },
      {
        fieldName: "address",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Address",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "duns",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "DUNS",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "primary",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Primary contact",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "paymentContactEmail",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Payment contact email",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "taxAddress",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Tax address",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "usCompanyEntityType",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Company type",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "tax",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Tax key",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "indirectTax",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Indirect Tax key",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "taxForm",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Tax form type",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "indirectTaxForm",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Indirect Tax form type",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "additionalDocsList",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Supplier additional docs domestic supplier",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "usTaxDeclarationFormKey",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "US Tax declaration form type",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "foreignTaxClassification",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Foreign company type",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "tax1099",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Tax 1099",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "specialTaxStatus",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Special tax status",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "specialTaxNote",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Special tax note",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "multiLingualAddresses",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "International Name and Address",
        questionnaireId: null,
        __typename: "FormField",
      },
      {
        fieldName: "instruction",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        customLabel: null,
        itemConfig: null,
        title: "Instruction",
        questionnaireId: null,
        __typename: "FormField",
      },
    ],

    formData,
    countryOptions: mockCountryOptions,
    usCompanyEntityTypeOptions: mockOptionsDefault,
    usForeignTaxClassificationOptions: foreignTaxClassificationOptions,
    taxKeys: taxKeys,
    onValueChange: handleValueChange,
    taxFormKeys: taxFormKeys,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
