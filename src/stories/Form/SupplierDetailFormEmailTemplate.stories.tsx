import React from "react";
import { StoryFn } from "@storybook/react";

import { SupplierDetailFormEmailTemplate } from "./../../lib";
import { ActivationStatus, ProcessVariables, Supplier } from "../../lib/Types";
import { OROFORMIDS } from "../../lib/Form/util";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Supplier Form email template",
  component: SupplierDetailFormEmailTemplate,
};

const mockSelectedSuppliers: Array<Supplier> = [
  {
    activationStatus: ActivationStatus.newSupplier,
    supplierName: "SEOWorks",
    potentialMatches: [],
    potentialMatchIgnore: true,
    legalEntity: {
      active: false,
      supplierStatus: "",
      supplierSegmentation: "",
      description: "",
      duns: "",
      ein: "",
      forbesGlobal: false,
      fortune500: false,
      id: "",
      legalEntityName: "",
      numSubsidiaries: 0,
      parent: false,
      regAuthorityCode: "",
      regId: "",
      tin: "",
      ultimateParent: false,
      vat: "",
      logo: {
        metadata: [
          {
            path: "oro/images/small/88868992679429039.png",
            width: 100,
            height: 100,
          },
          {
            path: "oro/images/large/88868992679429039.png",
            width: 200,
            height: 200,
          },
        ],
      },
    },
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
      mediatype: "text/csv",
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
      vendorId: "V12",
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
];

const mockProcessVariables: ProcessVariables = {
  businessUnit: [],
  businessRegions: [],
  contractAmountMoney: {
    amount: 0,
    currency: "",
  },
  engagementId: "",
  impact: {
    id: "",
    erpId: "",
    name: "",
  },
  segment: {
    id: "",
    erpId: "",
    name: "",
  },
  segments: [],
  sites: [],
  vendorClassification: {
    id: "",
    erpId: "",
    name: "",
  },
  projectAmountMoney: {
    amount: 0,
    currency: "",
  },
  paymentMethod: "",
  po: {
    cost: 0,
    currencyCode: "",
    id: "",
    poNumber: "",
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
        email: "",
        fullName: "",
        phone: "",
        role: "",
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
    formId: OROFORMIDS.OroContractorDetailForm,
  },
};
