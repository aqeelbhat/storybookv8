import React from "react";
import { StoryFn } from "@storybook/react";

import { SoftwareForm, SoftwareFormData, SoftwareFormProps } from "./../../lib";
import { mockCurrencyOptions } from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formData: SoftwareFormData = {};
const currency = DEFAULT_CURRENCY;
const fields = [];

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Software Form/Edit",
  component: SoftwareForm,
};

export const TemplateForm = {
  args: {
    fields,
    formData,
    typeOfPurchaseOptions: [
      { id: "new", path: "new", displayName: "Purchase new software" },
      { id: "renew", path: "renew", displayName: "Renew Existing Contract" },
      {
        id: "additional",
        path: "additional",
        displayName: "Purchase additional licenses",
      },
    ],
    currencyOptions: mockCurrencyOptions,
    submitLabel: "Submit",
    onSearchSoftwares: () =>
      Promise.resolve([
        {
          name: "Microsoft Excel",
          companyName: "Microsoft",
          categoryNames: ["Help desk software"],
        },
        {
          name: "Freshbooks",
          companyName: "Freshworks, Inc.",
          categoryNames: ["Accounting software"],
          owner: {
            firstName: "Travis",
            lastName: "Johnson",
            email: "travis@honeycomb.com",
          },
          isContractActive: true,
        },
        {
          name: "Microsoft Excel",
          companyName: "Microsoft",
        },
        {
          name: "Freshbooks",
          categoryNames: ["Accounting software", "Help desk software"],
          owner: {
            firstName: "Travis",
            lastName: "Johnson",
            email: "travis@honeycomb.com",
          },
          isContractActive: true,
        },
        {
          name: "Microsoft Excel",
        },
        {
          name: "Freshbooks",
          companyName: "Freshworks, Inc.",
          categoryNames: ["Accounting software"],
          owner: {
            firstName: "Travis",
            lastName: "Johnson",
            email: "travis@honeycomb.com",
          },
          isContractActive: true,
        },
      ]),
    onSearchManufacturers: () =>
      Promise.resolve([
        {
          legalEntityName: "Supplier 1",
          address: {
            address: [
              {
                city: "Great Falls",
                alpha2CountryCode: "US",
              },
            ],
          },
        },
        {
          legalEntityName: "Supplier 2",
          address: {
            address: [
              {
                city: "Great Rise",
                alpha2CountryCode: "US",
              },
            ],
          },
        },
      ]),
    onSearchContracts: () =>
      Promise.resolve([
        {
          id: "1",
          contractId: "B3458304",
          name: "Freshworks., Inc.",
          description: "16 seats",
          startDate: "2021-07-13T18:30:00.000",
          endDate: "2021-07-30T18:30:00.000",
          value: { currency, amount: "10000000" },
          recurringSpend: { currency: DEFAULT_CURRENCY, amount: "1000" },
          status: "signed",
          attachments: [],
        },
        {
          id: "2",
          contractId: "B3458305",
          name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat ipsum mattis fermentum faucibus. Mauris at dui eros. Ut sodales lacus vel dui laoreet pretium. Nullam auctor orci ultricies sem consequat fringilla sit amet ac risus. Mauris tincidunt purus ac quam dignissim tincidunt. Sed ac augue odio. Proin pellentesque sit amet leo non sollicitudin. Aliquam luctus eros ut purus efficitur, et rutrum arcu placerat. Praesent at scelerisque velit.",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat ipsum mattis fermentum faucibus. Mauris at dui eros. Ut sodales lacus vel dui laoreet pretium. Nullam auctor orci ultricies sem consequat fringilla sit amet ac risus. Mauris tincidunt purus ac quam dignissim tincidunt. Sed ac augue odio. Proin pellentesque sit amet leo non sollicitudin. Aliquam luctus eros ut purus efficitur, et rutrum arcu placerat. Praesent at scelerisque velit.",
          startDate: null,
          endDate: null,
          status: "signed",
          attachments: [],
        },
        {
          id: "3",
          contractId: "B3458306",
          name: "CDW",
          startDate: undefined,
          endDate: "2021-07-30T18:30:00.000",
          value: { currency, amount: "234000" },
          recurringSpend: { currency: DEFAULT_CURRENCY, amount: "1000" },
          status: "signed",
          attachments: [],
        },
      ]),
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
