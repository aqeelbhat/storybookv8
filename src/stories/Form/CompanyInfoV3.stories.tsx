import React from "react";
import { StoryFn } from "@storybook/react";

import { CompanyInfoFormV3, CompanyInfoV3FormProps } from "../../lib";
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

const formData = {
  additionalDocuments: null,
  indirectTax: {
    taxKeysList: ["phtin"],
    taxKey: "phtin",
    encryptedTaxCode: {
      version: "",
      data: "",
      iv: "",
      unencryptedValue: null,
      restrainDecryptData: false,
      unmaskSize: 4,
      maskedValue: "",
      unmaskedSubstring: null,
      setBy: null,
    },
    taxCodeError: false,
    taxCodeValidationTimeout: false,
  },
  companyName: "Michael Page International Recruitment (Philippines) Inc.",
  multiLingualAddresses: [],
  useCompanyName: false,
  jurisdictionCountryCode: "PH",
  reincarnationId: null,
  usCompanyEntityType: null,
  legalName: "Michael Page International Recruitment (Philippines) Inc.",
  specialTaxStatus: false,
  indirectTaxForm: {
    taxFormKeysList: [],
  },
  taxForm: {
    taxFormKeysList: ["certificateIncorporation"],
    taxFormKey: "certificateIncorporation",
    taxForm: {
      filename: "BIR_2303_COR_Michael_Page_Philippines_Zuellig_Bldg.pdf",
      mediatype: "application/pdf",
      size: "0",
      path: "attachment/2024/1/17/400882136399818727/BIR_2303_COR_Michael_Page_Philippines_Zuellig_Bldg.pdf",
      sourceUrl: "",
      reference: "",
      date: null,
      expiration: null,
      name: "",
      note: "",
      eid: null,
      asyncPutUrl: null,
      asyncGetUrl: null,
      created: null,
      issueDate: null,
      createdBy: null,
      docType: null,
      contentKind: "CustomerPrivate",
    },
  },
  taxAddress: {
    line1: "21/F Units 4-5, Zuellig Building,",
    line2: "Makati Avenue Cnr Paseo de Roxas and Sta Potenciana Street",
    line3: "",
    streetNumber: "",
    unitNumber: "",
    city: "Makati",
    province: "",
    alpha2CountryCode: "PH",
    postal: "1225",
    language: "",
  },
  fax: "",
  specialTaxNote: "",
  email: "accountsPH@michaelpage.com.ph",
  useCompanyAddress: false,
  tax1099: null,
  additionalDocsList: null,
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
  edited: false,
  specialTaxAttachments: [],
  tax: {
    taxKeysList: ["tin"],
    taxKey: "tin",
    encryptedTaxCode: {
      version: "c1641cdf-0c59-4776-b43d-ee894bd487f8",
      data: "vfCwoO73DmfXukjMuOCIfg==",
      iv: "ZFiE0Y9Ztoy/s3m2Ladn0A==",
      unencryptedValue: "01042506300000",
      restrainDecryptData: false,
      unmaskSize: 4,
      maskedValue: "********0000",
      unmaskedSubstring: "0000",
      setBy: {
        tenantId: "apex_fintech",
        tenantName: "Apex Fintech",
        userName: "customeradmin+apex_fintech@orolabs.ai",
        name: "Oro Admin",
        department: null,
        departmentCode: null,
        departmentErpId: null,
        groupIds: ["__admin", "__report_admin"],
        type: "Tenant",
        email: "customeradmin+apex_fintech@orolabs.ai",
        phone: null,
        firstName: null,
        lastName: null,
        api: false,
        picture: null,
        ip: "104.173.194.251",
        impersonator: "madan.kumar@orolabs.ai",
        connectionName: null,
        procurementAdmin: true,
        admin: true,
        otp: false,
      },
    },
    taxCodeError: false,
    taxCodeValidationTimeout: false,
  },
  tax1099Required: false,
  usTaxDeclarationForm: {
    filename: "Form_W-8BEN-E.pdf",
    mediatype: "application/pdf",
    size: "0",
    path: "attachment/2024/1/15/399879884067942354/Form_W-8BEN-E.pdf",
    sourceUrl: "",
    reference: "",
    date: null,
    expiration: null,
    name: "",
    note: "",
    eid: null,
    asyncPutUrl: null,
    asyncGetUrl: null,
    created: null,
    issueDate: null,
    createdBy: null,
    docType: null,
    contentKind: "CustomerPrivate",
  },
  foreignTaxClassification: {
    id: "foreignCompany",
    name: "Foreign company",
    erpId: "",
    refId: "",
    empty: false,
  },
  usTaxDeclarationFormOcrInfo: null,
  companyEntityCountryCodes: ["US"],
  phone: "+63277952800",
  previousVersion: null,
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
    primary: false,
    emailVerified: false,
    phoneVerified: false,
  },
};
export default {
  title: "ORO UI Toolkit/Form/CompanyInfoV3 Form",
  component: CompanyInfoFormV3,
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
        requirement: "optional",
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
    taxFormKeys: taxFormKeys,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
