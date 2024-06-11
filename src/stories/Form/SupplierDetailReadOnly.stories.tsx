import React from "react";
import { StoryFn } from "@storybook/react";

import {
  SupplierDetailFormReadOnly,
  SupplierDetailReadonlyProps,
} from "./../../lib";
import { ActivationStatus, Supplier } from "../../lib/Types";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Supplier Form read only",
  component: SupplierDetailFormReadOnly,
};

const mockSelectedSuppliers: Array<Supplier> = [
  {
    activationStatus: ActivationStatus.newSupplier,
    supplierName: "SEOWorks",
    proposal: {
      reference: "",
      path: "",
      note: "",
      filename: "",
      size: 0,
      name: "",
      mediatype: "",
    },
    website: "www.seoworks.co.uk",
    duns: "15-048-3782",
    address: {
      province: "South Yorkshire",
      streetNumber: "1",
      city: "Chapletown",
      unitNumber: "",
      alpha2CountryCode: "UK",
      postal: "S3 7AT",
      line3: "",
      line2: "",
      line1: "Scotland St",
    },
    contactName: "",
    contract: {
      reference: "",
      path: "",
      note: "",
      filename: "",
      size: 0,
      name: "",
      mediatype: "",
    },
    vendorId: "86501640378515456",
    nda: {
      reference: "",
      path: "attachment/75295953053024256/legalentities_sample.csv",
      note: "",
      filename: "",
      size: 2629,
      name: "",
      expiration: "2021-08-25",
      mediatype: ".zip",
    },
    selectedVendorRecord: {
      companyEntityRef: {
        name: "The SEO Works_3148839028990089",
        id: "1",
        erpId: "",
      },
      name: "The SEO Works_3148839028973644",
      additionalCompanyEntities: [
        {
          name: "The SEO Works_3148839028994784",
          id: "2",
          erpId: "",
        },
        {
          name: "The SEO Works_3148839028998107",
          id: "3",
          erpId: "",
        },
      ],
      vendorId: "V12V12V12V12V12V12V12V12V12V12V12V12V12V12V12V12V12",
      id: "73591010520727553",
      paymentTerm: {
        name: "Net 15",
        id: "1",
        erpId: "",
      },
      enabled: false,
    },
    phoneNumber: "+17020857979",
    msaInFile: false,
    ndaInFile: true,
    vendorRecords: [
      {
        companyEntityRef: {
          name: "The SEO Works_3148839028990089",
          id: "1",
          erpId: "",
        },
        name: "The SEO Works_3148839028973644",
        additionalCompanyEntities: [
          {
            name: "The SEO Works_3148839028994784",
            id: "2",
            erpId: "",
          },
          {
            name: "The SEO Works_3148839028998107",
            id: "3",
            erpId: "",
          },
        ],
        vendorId: "V12",
        id: "73591010520727553",
        paymentTerm: {
          name: "Net 15",
          id: "1",
          erpId: "",
        },
        enabled: false,
      },
    ],
    msa: {
      reference: "",
      path: "attachment/75296535415357440/a.csv",
      note: "",
      filename: "",
      size: 185,
      name: "",
      expiration: "2021-08-31",
      mediatype: "text/csv",
    },
    email: "seoworks@gmail.com",
  },
  {
    activationStatus: ActivationStatus.newSupplier,
    supplierName: "August Jackson",
    proposal: {
      reference: "",
      path: "",
      note: "",
      filename: "",
      size: 0,
      name: "",
      mediatype: "",
    },
    website: "www.augustjackson.com",
    address: {
      province: "MD",
      streetNumber: "1501",
      city: "Baltimore",
      unitNumber: "Ste 100",
      alpha2CountryCode: "US",
      postal: "21224-5730",
      line3: "",
      line2: "",
      line1: "S Clinton St",
    },
    contactName: "Rohit",
    contract: {
      reference: "",
      path: "",
      note: "",
      filename: "",
      size: 0,
      name: "",
      mediatype: "",
    },
    vendorId: "73591002803208192",
    nda: {
      reference: "",
      path: "attachment/75296606403952640/abe24cd1-e4dd-4ebe-a8ca-2a09e6640cdb (1).xlsx",
      note: "",
      filename: "",
      size: 52398,
      name: "",
      expiration: "2021-08-26",
      mediatype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    selectedVendorRecord: {
      companyEntityRef: {
        name: "The August Jackson Company_3148837270719367",
        id: "1",
        erpId: "",
      },
      name: "The August Jackson Company_3148837270703191",
      additionalCompanyEntities: [
        {
          name: "The August Jackson Company_3148837270724279",
          id: "2",
          erpId: "",
        },
        {
          name: "The August Jackson Company_3148837270728248",
          id: "3",
          erpId: "",
        },
      ],
      vendorId: "V9",
      id: "73591003142946817",
      paymentTerm: {
        name: "Net 15",
        id: "1",
        erpId: "",
      },
      enabled: false,
    },
    phoneNumber: "",
    msaInFile: false,
    ndaInFile: false,
    vendorRecords: [
      {
        companyEntityRef: {
          name: "The August Jackson Company_3148837270719367",
          id: "1",
          erpId: "",
        },
        name: "The August Jackson Company_3148837270703191",
        additionalCompanyEntities: [
          {
            name: "The August Jackson Company_3148837270724279",
            id: "2",
            erpId: "",
          },
          {
            name: "The August Jackson Company_3148837270728248",
            id: "3",
            erpId: "",
          },
        ],
        vendorId: "V9",
        id: "73591003142946817",
        paymentTerm: {
          name: "Net 15",
          id: "1",
          erpId: "",
        },
        enabled: false,
      },
    ],
    email: "ingle.rohit@gmail.com",
    contact: {
      fullName: "Rohit",
      email: "ingle.rohit@gmail.com",
      role: "Infosec",
      phone: "",
      requireBackgroundCheck: false,
      primary: false,
      emailVerified: false,
      phoneVerified: false,
      emailVerification: {
        email: "ingle.rohit@gmail.com",
        verified: true,
        isFreeDomain: true,
        emailNotDeliverable: false,
        domainNotExist: false,
      },
    },
  },
];

const mockProcessVariables = {
  businessUnit: [],
  projectAmountMoney: {
    amount: 0,
    currency: "",
  },
  categories: [
    {
      id: "20-2017",
      name: "Corporate communications",
      erpId: "",
    },
  ],
  regions: [
    {
      id: "global",
      name: "Global",
      erpId: "",
    },
  ],
  departments: [
    {
      id: "Cloud",
      name: "Cloud",
      erpId: "",
    },
  ],
  companyEntities: [
    {
      id: "EGNH-optiBV",
      name: "Optimizely BV",
      erpId: "",
    },
  ],
  companyEntityCountryCodes: ["NL"],
  projectTypes: [],
  activityName: "test",
  activityId: "test",
  activitySystem: "allocadia",
  partners: [
    {
      id: "86501640378515456",
      legalEntityId: "86084295918870919",
      legalEntityLogo: {
        metadata: [],
      },
      name: "Moving Brands Inc.",
      activationStatus: ActivationStatus.requiresActivation,
      contact: {
        fullName: "Rohit",
        email: "ingle.rohit@gmail.com",
        role: "Infosec",
        phone: "",
        requireBackgroundCheck: false,
        primary: false,
        emailVerified: false,
        phoneVerified: false,
        emailVerification: {
          email: "ingle.rohit@gmail.com",
          verified: true,
          isFreeDomain: true,
          emailNotDeliverable: false,
          domainNotExist: false,
        },
      },
      countryCode: "US",
      vendorRecordId: "86501640378515456",
    },
  ],
  summary: "test",
};

export const TemplateForm = {
  args: {
    selectedSuppliers: mockSelectedSuppliers,
    processVariables: mockProcessVariables,
  },
};
