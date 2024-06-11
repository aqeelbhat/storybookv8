import React from "react";
import { StoryFn } from "@storybook/react";

import { SoftwareFormReadOnly, SoftwareFormData } from "./../../lib";
import { Option } from "./../../lib/Inputs";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formDataNew: SoftwareFormData = {
  typeOfPurchase: {
    id: "new",
    path: "new",
    displayName: "Purchase new software",
  },
  softwares: [
    {
      image: "",
      name: "Microsoft Excel",
      companyName: "Microsoft",
      categoryNames: ["Spreadsheet software"],
      isPreferred: true,
    },
    {
      image: "",
      name: "Microsoft Excel",
      categoryNames: ["Spreadsheet software"],
      isPreferred: false,
    },
    {
      image: "",
      name: "Microsoft Excel",
      companyName: "Microsoft",
      isPreferred: false,
    },
    {
      image: "",
      name: "Microsoft Excel",
      isPreferred: false,
    },
  ],
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat ipsum mattis fermentum faucibus. Mauris at dui eros. Ut sodales lacus vel dui laoreet pretium. Nullam auctor orci ultricies sem consequat fringilla sit amet ac risus. Mauris tincidunt purus ac quam dignissim tincidunt. Sed ac augue odio. Proin pellentesque sit amet leo non sollicitudin. Aliquam luctus eros ut purus efficitur, et rutrum arcu placerat. Praesent at scelerisque velit.",
  replacingExisting: true,
  existingSoftware: {
    image: "",
    name: "Microsoft Excel",
    companyName: "Microsoft",
    categoryNames: ["Spreadsheet software"],
  },
  existingContracts: [
    {
      id: "1",
      contractId: "B3458304",
      name: "Freshworks., Inc.",
      description: "12 seats",
      startDate: "2021-07-13T18:30:00.000",
      endDate: "2021-07-30T18:30:00.000",
      value: { currency: DEFAULT_CURRENCY, amount: "10000000" },
      recurringSpend: { currency: DEFAULT_CURRENCY, amount: "1000" },
      status: "signed",
      attachments: [
        {
          filename: "11-10-2021 11-06-15.428927_Noopur_Hyundai.pdf",
          mediatype: "text/csv",
          path: "attachment/65099653170855936/a.csv",
          size: 185,
        },
        {
          filename: "b.csv",
          mediatype: "text/csv",
          path: "attachment/65099653170855936/b.csv",
          size: 185,
        },
      ],
    },
    {
      id: "2",
      contractId: "B3458305",
      name: "CWD",
      description: "16 seats",
      startDate: "2021-07-13T18:30:00.000",
      endDate: "2021-07-30T18:30:00.000",
      value: { currency: DEFAULT_CURRENCY, amount: "52000" },
      status: "signed",
      attachments: [],
    },
  ],
};

const formDataAdditional: SoftwareFormData = {
  typeOfPurchase: {
    id: "additional",
    path: "additional",
    displayName: "Purchase additional licenses",
  },
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat ipsum mattis fermentum faucibus. Mauris at dui eros. Ut sodales lacus vel dui laoreet pretium. Nullam auctor orci ultricies sem consequat fringilla sit amet ac risus. Mauris tincidunt purus ac quam dignissim tincidunt. Sed ac augue odio. Proin pellentesque sit amet leo non sollicitudin. Aliquam luctus eros ut purus efficitur, et rutrum arcu placerat. Praesent at scelerisque velit.",
  existingSoftware: {
    image: "",
    name: "Microsoft Excel",
    companyName: "Microsoft",
    categoryNames: ["Spreadsheet software"],
  },
  additionalLicensesCount: "1200 seats",
  knowContract: true,
  existingContracts: [
    {
      id: "1",
      contractId: "B3458304",
      name: "Freshworks., Inc.",
      description: "12 seats",
      startDate: "2021-07-13T18:30:00.000",
      endDate: "2021-07-30T18:30:00.000",
      value: { currency: DEFAULT_CURRENCY, amount: "10000000" },
      recurringSpend: { currency: DEFAULT_CURRENCY, amount: "1000" },
      status: "signed",
      attachments: [
        {
          filename: "11-10-2021 11-06-15.428927_Noopur_Hyundai.pdf",
          mediatype: "text/csv",
          path: "attachment/65099653170855936/a.csv",
          size: 185,
        },
        {
          filename: "b.csv",
          mediatype: "text/csv",
          path: "attachment/65099653170855936/b.csv",
          size: 185,
        },
      ],
    },
    {
      id: "2",
      contractId: "B3458305",
      name: "CWD",
      description: "16 seats",
      startDate: "2021-07-13T18:30:00.000",
      endDate: "2021-07-30T18:30:00.000",
      value: { currency: DEFAULT_CURRENCY, amount: "52000" },
      recurringSpend: { currency: DEFAULT_CURRENCY, amount: "1000" },
      status: "signed",
      attachments: [],
    },
  ],
};

const formDataRenewal: SoftwareFormData = {
  typeOfPurchase: {
    id: "renew",
    path: "renew",
    displayName: "Renew Existing Contract",
  },
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat ipsum mattis fermentum faucibus. Mauris at dui eros. Ut sodales lacus vel dui laoreet pretium. Nullam auctor orci ultricies sem consequat fringilla sit amet ac risus. Mauris tincidunt purus ac quam dignissim tincidunt. Sed ac augue odio. Proin pellentesque sit amet leo non sollicitudin. Aliquam luctus eros ut purus efficitur, et rutrum arcu placerat. Praesent at scelerisque velit.",
  existingSoftware: {
    image: "",
    name: "Microsoft Excel",
    companyName: "Microsoft",
    categoryNames: ["Spreadsheet software"],
  },
  existingContracts: [
    {
      id: "1",
      contractId: "B3458304",
      name: "Freshworks., Inc.",
      description: "12 seats",
      startDate: "2021-07-13T18:30:00.000",
      endDate: "2021-07-30T18:30:00.000",
      value: { currency: DEFAULT_CURRENCY, amount: "10000000" },
      status: "signed",
      attachments: [
        {
          filename: "11-10-2021 11-06-15.428927_Noopur_Hyundai.pdf",
          mediatype: "text/csv",
          path: "attachment/65099653170855936/a.csv",
          size: 185,
        },
        {
          filename: "b.csv",
          mediatype: "text/csv",
          path: "attachment/65099653170855936/b.csv",
          size: 185,
        },
      ],
    },
    {
      id: "2",
      contractId: "B3458305",
      name: "CWD",
      description: "16 seats",
      startDate: "2021-07-13T18:30:00.000",
      endDate: "2021-07-30T18:30:00.000",
      value: { currency: DEFAULT_CURRENCY, amount: "52000" },
      status: "signed",
      attachments: [],
    },
  ],
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Software Form/Read Only",
  component: SoftwareFormReadOnly,
};

export const NewPurchase = {
  args: {
    formData: formDataNew,
    typeOfPurchaseOptions: [
      { id: "new", path: "new", displayName: "Purchase new software" },
      { id: "renew", path: "renew", displayName: "Renew Existing Contract" },
      {
        id: "additional",
        path: "additional",
        displayName: "Purchase additional licenses",
      },
    ],
  },
};

export const AdditionalLicenses = {
  args: {
    formData: formDataAdditional,
    typeOfPurchaseOptions: [
      { id: "new", path: "new", displayName: "Purchase new software" },
      { id: "renew", path: "renew", displayName: "Renew Existing Contract" },
      {
        id: "additional",
        path: "additional",
        displayName: "Purchase additional licenses",
      },
    ],
  },
};

export const Renewal = {
  args: {
    formData: formDataRenewal,
    typeOfPurchaseOptions: [
      { id: "new", path: "new", displayName: "Purchase new software" },
      { id: "renew", path: "renew", displayName: "Renew Existing Contract" },
      {
        id: "additional",
        path: "additional",
        displayName: "Purchase additional licenses",
      },
    ],
  },
};
