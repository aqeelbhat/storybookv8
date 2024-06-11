import React from "react";
import { StoryFn } from "@storybook/react";

import {
  ChangePoFormReadOnly,
  ChangePoFormData,
  ActivationStatus,
} from "./../../lib";
import { mockCurrencyOptions } from "../MultiLevelSelect/mocks";
import { mockCsvFile } from "../mocks/file.mock";
import { ChangePoFormReadOnlyProps } from "../../lib/Form/changepo-form-readOnly.component";
import { DEFAULT_CURRENCY } from "../../lib/util";

const formData: ChangePoFormData = {
  purchaseOrder: {
    activityName: "Freshdesk PO",
    poNumber: "PO-123",
    normalizedVendorRef: {
      id: "",
      vendorRecordId: "",
      name: "Freshworks, Inc.",
      countryCode: "US",
      legalEntityId: "",
      legalEntityLogo: { metadata: [] },
      contact: {
        fullName: "",
        email: "",
        role: "",
        phone: "",
      },
      activationStatus: ActivationStatus.active,
    },
    companyEntityRef: { id: "", name: "Episerver Inc.", erpId: "" },
    start: "12-19-2022",
    end: "12-19-2022",
    cost: 12000,
    currencyCode: "EUR",
    itemList: {
      items: [
        {
          name: "Item 1",
          quantity: 4,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 25, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 12400, currency: DEFAULT_CURRENCY },
          startDate: "12-19-2022",
          endDate: "12-19-2022",
          trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
        },
      ],
    },
    expenseItemList: {
      items: [
        {
          name: "Item 3",
          quantity: 3,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          unitForQuantity: { id: "each", name: "each", erpId: "each" },
          price: { amount: 15, currency: DEFAULT_CURRENCY },
          totalPrice: { amount: 105, currency: DEFAULT_CURRENCY },
          startDate: "12-19-2022",
          endDate: "12-19-2022",
        },
      ],
    },
  },
  poRef: {
    id: "325601482560307547",
    name: "ORDA4192",
    erpId: "Apple",
  },
  startDate: "12-19-2022",
  endDate: "12-19-2022",
  method: "addItem",
  //method: 'editItems',
  poLineItems: {
    items: [
      {
        name: "Item 1",
        quantity: 5,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 20, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 13400, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
        location: { id: "1", name: "Belfast", erpId: "12" },
        projectCode: { id: "101", name: "Book Club", erpId: "101" },
        trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
      },
      {
        name: "Item 2",
        quantity: 4,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 25, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 12400, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
        location: { id: "1", name: "Belfast", erpId: "12" },
        projectCode: { id: "101", name: "Book Club", erpId: "101" },
      },
    ],
  },
  expenseLineItems: {
    items: [
      {
        name: "Item 3",
        quantity: 3,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 10, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 100, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
        location: { id: "1", name: "Chicago", erpId: "1" },
        projectCode: { id: "106", name: "Spot Awards", erpId: "106" },
        expenseCategory: { id: "107", name: "Advertising", erpId: "107" },
        // nonInventoryPurchaseItem: {id:'136', name: '70910 - Advertising', erpId: '136'}
        trackCode: [{ id: "101", name: "Book Club", erpId: "101" }],
      },
      {
        name: "Item 4",
        quantity: 2,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        unitForQuantity: { id: "each", name: "each", erpId: "each" },
        price: { amount: 20, currency: DEFAULT_CURRENCY },
        totalPrice: { amount: 200, currency: DEFAULT_CURRENCY },
        startDate: "12-19-2022",
        endDate: "12-19-2022",
      },
    ],
  },
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/ChangePO Form/Read only",
  component: ChangePoFormReadOnly,
};

export const TemplateForm = {
  args: {
    data: formData,
    fields: [
      {
        fieldName: "poLineItems",
        itemConfig: {
          visibleFields: [
            "quantity",
            "unitForQuantity",
            "description",
            "price",
            "totalPrice",
            "startDate",
            "endDate",
            "tax",
            "type",
            "categories",
            "location",
            "projectCode",
            "trackCode",
          ],
          mandatoryFields: [],
          readonlyFields: [],
          disableAdd: false,
          disableDelete: false,
        },
      },
      {
        fieldName: "expenseLineItems",
        itemConfig: {
          visibleFields: [
            "quantity",
            "unitForQuantity",
            "description",
            "price",
            "totalPrice",
            "startDate",
            "endDate",
            "tax",
            "type",
            "categories",
            "location",
            "projectCode",
            "expenseCategory",
            "trackCode",
          ],
          mandatoryFields: [],
          readonlyFields: [],
          disableAdd: false,
          disableDelete: false,
        },
      },
      {
        fieldName: "startDate",
        requirement: "required",
      },
      {
        fieldName: "endDate",
        requirement: "required",
      },
      {
        fieldName: "additionalAmount",
        requirement: "required",
      },
      {
        fieldName: "reason",
        requirement: "required",
      },
      {
        fieldName: "poRef",
        requirement: "required",
      },
    ],
    currencyOptions: mockCurrencyOptions,
    loadDocument: () => Promise.resolve(mockCsvFile),
    dataFetchers: {
      getPO: () =>
        Promise.resolve({
          poNumber: "ORDA4192",
          id: "325601482560307547",
          requestorName: "John Doe",
          requestorUsername: "john@foo.com",
          companyEntityRef: {
            id: "HH",
            name: "Honeycomb Holdings Inc.",
            erpId: "3",
            refId: null,
          },
          departmentRef: null,
          accountRef: {
            id: "5122",
            name: "Miscellaneous Expense",
            erpId: "83",
            refId: null,
          },
          paymentTermsRef: null,
          memo: null,
          activityName: null,
          currencyCode: "USD",
          cost: 11,
          start: null,
          end: null,
          engagementRefs: [
            {
              id: "325594717986816347",
              name: null,
              erpId: null,
              refId: "A4192",
            },
          ],
          created: "2023-06-24T05:06:34.545783246Z",
          itemList: null,
          normalizedVendorRef: {
            id: "89113807414099968",
            vendorRecordId: null,
            name: "Apple",
            countryCode: "US",
            legalEntityId: "88868992675233957",
            legalEntityLogo: {
              metadata: [
                {
                  path: "oro/images/small/88868992675233957.png",
                  height: 100,
                  width: 100,
                  __typename: "ImageMetadata",
                },
                {
                  path: "oro/images/large/88868992675233957.png",
                  height: 200,
                  width: 200,
                  __typename: "ImageMetadata",
                },
              ],
              __typename: "Image",
            },
            selectedVendorRecord: {
              id: "91277523404455936",
              vendorId: "01234",
              enabled: false,
              paymentTerm: {
                id: "",
                name: "",
                erpId: "",
                refId: "",
              },
              __typename: "VendorRef",
            },
            contact: {
              fullName: "nitesh Jadhav",
              firstName: null,
              lastName: null,
              email: "nitesh@orolabs.ai",
              phone: "",
              role: "Account Manager",
              note: null,
              imageUrl: null,
              __typename: "Contact",
            },
            activationStatus: "active",
            isIndividual: false,
            __typename: "NormalizedVendorRef",
          },
          contractType: null,
          contract: null,
          noteObjects: [
            {
              id: "85bda098-a0ae-4f38-aafb-b740629630bf",
              owner: {
                tenantId: "foo",
                userName: "customeradmin+foo@orolabs.ai",
                firstName: null,
                lastName: null,
                name: "Oro Admin",
                department: null,
                __typename: "UserId",
              },
              taskStatus: null,
              comment: "can you see this?",
              documents: null,
              created: "2023-06-27T16:57:16.395348168Z",
              updated: "2023-06-27T16:57:16.395347864Z",
              __typename: "Note",
            },
          ],
          status: null,
          erpCreatedDate: null,
          erpUpdatedDate: null,
          expenseItemList: {
            items: [
              {
                name: null,
                description: null,
                categories: [
                  {
                    id: "tax",
                    name: "Tax",
                    erpId: null,
                    refId: null,
                  },
                ],
                departments: [],
                type: "service",
                materialId: null,
                quantity: null,
                unitForQuantity: null,
                lineNumber: null,
                priceMoney: null,
                supplierPartId: null,
                manufacturerPartId: null,
                accountCodeIdRef: null,
                url: null,
                erpItemId: null,
                startDate: null,
                endDate: null,
                tax: {
                  amountObject: null,
                  items: [
                    {
                      taxCode: {
                        id: "vat",
                        name: "VAT",
                        erpId: null,
                        refId: null,
                      },
                      percentage: 18,
                      taxableAmountObject: {
                        currency: "EUR",
                        amount: 1000,
                      },
                      amountObject: {
                        currency: "EUR",
                        amount: 180,
                      },
                      __typename: "TaxItem",
                    },
                  ],
                  __typename: "Tax",
                },
                accumulator: null,
                itemIds: null,
                lineOfBusiness: null,
                trackCode: null,
                location: null,
                projectCode: null,
                expenseCategory: null,
                dataJson: null,
                __typename: "Item",
              },
            ],
            __typename: "ItemList",
          },
          __typename: "PurchaseOrder",
        }),
    },
  },
};
