import React from "react";
import { StoryFn } from "@storybook/react";
import {
  UpdateSupplierCompanyDetailsFormReadOnly,
  UpdateSupplierCompanyDetailsFormReadOnlyProps,
} from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title:
    "ORO UI Toolkit/Form/UpdateSupplierProfile/Update Company Details ReadOnly",
  component: UpdateSupplierCompanyDetailsFormReadOnly,
};

const mockIndustryCodeOptions = [
  {
    id: "_IndustryCode__Any__10",
    path: "10",
    displayName: "Agriculture",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "10" },
  },
  {
    id: "_IndustryCode__Any__11",
    path: "11",
    displayName: "Arts",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "11" },
  },
  {
    id: "_IndustryCode__Any__15",
    path: "15",
    displayName: "Educational",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "15" },
  },
  {
    id: "_IndustryCode__Any__20",
    path: "20",
    displayName: "Manufacturing",
    icon: "",
    selectable: true,
    selected: false,
    customData: { erpId: null, code: "20" },
  },
];

export const TemplateForm = {
  args: {
    formData: {
      commonName: "Thermo Fisher Scientific",
      address: {
        line1: "Waltham, MA",
      },
      website: "www.thermofisher.com",
      email: "support@thermofisher.com",
      phone: "+44123456789",
      description: `Thermo Fisher Scientific Inc. is the world leader in serving science, with annual revenue of approximately $40 billion. Our Mission is to enable our customers to make the world healthier, cleaner and safer. Whether our customers are accelerating life sciences research, solving complex analytical challenges, increasing productivity in their laboratories, improving patient health through diagnostics or the development and manufacture of life-changing therapies, we are here to support them. Our global team delivers an unrivaled combination of innovative technologies, purchasing convenience and pharmaceutical services through our industry-leading brands, including Thermo Scientific, Applied Biosystems, Invitrogen, Fisher Scientific, Unity Lab Services, Patheon and PPD. 
            For more information, please visit www.thermofisher.com.`,
      currentLogo: {
        metadata: [
          {
            path: "oro/images/large/88868992679429039.png",
            width: 200,
            height: 200,
          },
        ],
      },
      industryCode: { id: "10", name: "Agriculture" },
      parentCompany: {
        supplierName: "MD",
        proposal: {
          sourceUrl: "",
          reference: "",
          asyncGetUrl: "",
          path: "",
          note: "",
          filename: "",
          size: "0",
          name: "",
          mediatype: "",
          asyncPutUrl: "",
        },
        website: "www.orolabs.ai",
        address: {
          province: "IN-MH",
          streetNumber: "",
          city: "Pune",
          unitNumber: "",
          alpha2CountryCode: "IN",
          language: "",
          postal: "",
          line3: "",
          line2: "",
          line1: "Lake Town Housing Society, Katraj",
        },
        contactName: "",
        companyName: "",
        contract: {
          sourceUrl: "",
          reference: "",
          asyncGetUrl: "",
          path: "",
          note: "",
          filename: "",
          size: "0",
          name: "",
          mediatype: "",
          asyncPutUrl: "",
        },
        newSupplier: false,
        vendorId: "309257233461711183",
        activationStatus: "newSupplier",
        newSupplierMessage: "",
        isIndividual: false,
        potentialMatches: [],
        legalEntity: {
          commonName: {
            active: false,
          },
          parent: false,
          addresses: [],
          supplierDimensions: [],
          activeErpRecord: false,
          originalEin: "",
          industryCode: "",
          legalName: {
            active: false,
          },
          score: 0,
          revenue: {
            money: {
              amount: 0,
              currency: "USD",
            },
          },
          skipDupCheck: false,
          branchEntity: false,
          segmentationDetails: [],
          tin: "",
          logo: {
            metadata: [],
            unprocessed: true,
            expiration: "0",
            avoidOverwrite: false,
            attempt: "0",
          },
          numSubsidiaries: 0,
          parentVendorRef: {
            name: "",
            erpId: "",
            id: "",
            refId: "",
            empty: true,
          },
          ignoreNameMatch: false,
          nvScore: 0,
          ultimateParentRef: {
            name: "",
            erpId: "",
            id: "",
            refId: "",
            empty: true,
          },
          individual: false,
          vat: "",
          brandEntity: false,
          active: false,
          shortDescription: "",
          originalRegId: "",
          originalVat: "",
          parentName: "",
          otherNames: [],
          name: {
            active: false,
          },
          duns: "",
          regId: "",
          originalTin: "",
          highlighters: {
            legalName: "",
            commonName: "",
            aliases: "",
            vendorId: "",
          },
          forbesGlobal: false,
          description: "",
          ultimateParent: false,
          ein: "",
          numEmployees: {
            value: "0",
          },
          regAuthorityCode: "",
          vendorRecordRefs: [],
          subsidiaryEntity: false,
          website: "",
          address: {
            address: [],
            phone: [],
            fax: [],
            email: [],
          },
          brandOrSubsidiaryEntity: false,
          parentRef: {
            name: "",
            erpId: "",
            id: "",
            refId: "",
            empty: true,
          },
          ultimateParentName: "",
          engagementReferences: [],
          fortune500: false,
        },
        phoneNumber: "+918822114557",
        msaInFile: false,
        ndaInFile: false,
        contact: {
          firstName: "",
          lastName: "",
          emailVerified: false,
          role: "Owner",
          address: {
            province: "",
            streetNumber: "",
            city: "",
            unitNumber: "",
            alpha2CountryCode: "",
            language: "",
            postal: "",
            line3: "",
            line2: "",
            line1: "",
          },
          phone: "",
          phoneVerified: false,
          imageUrl: "",
          fullName: "Rashiklal",
          title: "",
          email: "john@foo.com",
          primary: false,
        },
        vendorRecords: [],
        duns: "15-048-3782",
        supplierStatus: "strategic",
        potentialMatchIgnore: false,
        email: "support1@md.com",
        createNewVendor: false,
      },
    },
  },
};
