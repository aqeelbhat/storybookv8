import React from "react";
import { StoryFn } from "@storybook/react";
import { getI18NInstance } from "../../../lib/i18n";
import type {
  InvoiceDetailsItemListProps,
  InvoiceDetailsItemListFormData,
} from "../../../lib/Form/InvoiceDetailsItemList/types";
import "./../../common.scss";
import { InvoiceDetailsItemListForm } from "../../../lib";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import {
  mockCategory,
  mockAccountCodes,
  mockDepartments,
  mockCostCenters,
  mockCurrencyOptions,
  mockUnitPerQuantity,
} from "../../MultiLevelSelect/mocks";
import MockCustomFormDefinition from "./mockCustomForm";
import mockCustomFormData from "./mockCustomFormData";

import mockCustomFormDataJSON from "./mockCustomFormDataJSON";
const formData: InvoiceDetailsItemListFormData = {
  itemList: {
    items: [
      {
        name: "Digital Marketing Services for 1Yr",
        data: mockCustomFormData,
        startDate: "2023-12-26",
        endDate: "2023-12-28",
        accountCodeIdRef: {
          id: "id1",
          name: "Marketing 1",
          erpId: "",
          refId: "",
        },
        materialId: "2332",
        itemIds: [
          {
            id: "id2",
            name: "HR",
            erpId: "",
            refId: "",
          },
        ],
        lineOfBusiness: {
          id: "id3",
          name: "Testing",
          erpId: "",
          refId: "",
        },
        location: {
          id: "id1",
          name: "Marketing",
          erpId: "",
          refId: "",
        },
        projectCode: {
          id: "id1",
          name: "Marketing",
          erpId: "",
          refId: "",
        },
        supplierPartId: "21321",
        manufacturerPartId: "weqw12",
        expenseCategory: {
          id: "id2",
          name: "HR",
          erpId: "107",
          refId: "",
        },
        trackCode: [
          {
            id: "id1",
            name: "Marketing",
            erpId: "",
            refId: "",
          },
        ],
        url: "www.google.com",
        images: [
          {
            date: "",
            expiration: "",
            filename: "",
            mediatype: "",
            path: "",
            reference: "",
            size: 95940,
            note: "",
            name: "Aryan_HallTicket.pdf",
            contentKind: "",
            asyncGetUrl: "",
            asyncPutUrl: "",
            sourceUrl: "",
            created: "",
          },
        ],
        specifications: [
          {
            date: "",
            expiration: "",
            filename: "",
            mediatype: "",
            path: "",
            reference: "",
            size: 2062316,
            note: "",
            name: "6323d2c0-2dea-467b-82d6-837a2b1a6c28__2_.docx",
            contentKind: "",
            asyncGetUrl: "",
            asyncPutUrl: "",
            sourceUrl: "",
            created: "",
          },
        ],
        normalizedVendorRef: null,
      },
      {
        name: "Digital Marketing Services for 1Yr",
        data: mockCustomFormData,
        dataJson: mockCustomFormDataJSON,
        description: "",
        categories: [],
        departments: [
          {
            id: "id1",
            name: "Facilities",
            erpId: "",
            empty: false,
          },
        ],
        type: null,
        materialId: "",
        quantity: null,
        unitForQuantity: null,
        lineNumber: null,
        price: null,
        totalPrice: null,
        tenantPrice: null,
        tenantTotalPrice: null,
        images: [],
        supplierPartId: "",
        manufacturerPartId: "",
        accountCodeIdRef: {
          id: "",
          name: "",
          erpId: "",
          empty: true,
        },
        erpItemId: null,
        url: "",
        specifications: [],
        customAttributes: null,
        tax: {
          items: [
            {
              percentage: 10,
              taxableAmount: {
                currency: "USD",
                amount: 202,
              },
            },
          ],
        },
        contacts: null,
        accounting: null,
        trackCode: [],
        itemIds: [],
        lineOfBusiness: null,
        location: null,
        projectCode: null,
        expenseCategory: {
          id: "110",
          name: "Building Repairs/Maintenance",
          erpId: "110",
          empty: false,
        },
        nonInventoryPurchaseItem: null,
        accumulator: null,
        startDate: null,
        endDate: null,
        normalizedVendorRef: null,
        costCenter: null,
        data: {},
        dataJson: "{}",
      },
      {
        name: "",
        data: mockCustomFormData,
        description: "",
        categories: [
          {
            id: "ALL-10",
            name: "Logistics",
            erpId: "10",
            empty: false,
          },
        ],
        departments: [
          {
            id: "id1",
            name: "Marketing",
            erpId: "id1",
            empty: false,
          },
        ],
        type: "service",
        materialId: "",
        quantity: null,
        unitForQuantity: null,
        lineNumber: "3",
        price: null,
        totalPrice: {
          amount: 165.34,
          currency: "USD",
        },
        tenantPrice: null,
        tenantTotalPrice: {
          amount: 154.177545691906,
          currency: "EUR",
        },
        images: [],
        supplierPartId: "",
        manufacturerPartId: "",
        accountCodeIdRef: {
          id: "6180-6182",
          name: "Accounting",
          erpId: "127",
          empty: false,
        },
        erpItemId: null,
        url: "",
        specifications: [],
        customAttributes: null,
        tax: null,
        contacts: null,
        accounting: null,
        trackCode: [],
        itemIds: [],
        lineOfBusiness: null,
        location: null,
        projectCode: null,
        expenseCategory: {
          id: "252",
          name: "Audit Fees",
          erpId: "252",
          empty: false,
        },
        nonInventoryPurchaseItem: null,
        accumulator: null,
        startDate: null,
        endDate: null,
        normalizedVendorRef: null,
        costCenter: null,
        data: {},
        dataJson: "{}",
      },
    ],
  },
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Details/Item Details V2",
  component: InvoiceDetailsItemListForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    useItemDetailsV2: true,
    events: {
      fetchExtensionCustomFormDefinition: (id: string) =>
        Promise.resolve(MockCustomFormDefinition),
    },
    fields: [
      {
        fieldName: "itemList",
        requirement: "required",
        booleanValue: true,
        stringValue: true,
        intValue: false,
        itemConfig: {
          visibleFields: [
            // "lineNumber",
            "type",
            "description",
            "tax",
            "quantity",
            "totalPrice",
            "price",
            "accountCode",
            "categories",
            "costCenter",
            "customAttributes",
            "departments",
            "endDate",
            "expenseCategory",
            "images",
            "itemIds",
            "lineOfBusiness",
            "location",
            "manufacturerPartId",
            "materialId",

            "projectCode",
            "quantity",
            "specifications",
            "startDate",
            "trackCode",
            "unitForQuantity",
            "url",
            "vendor",
            "supplierPartId",
          ],
          displayFields: ["name", "quantity", "price", "tax", "totalPrice"],
          mandatoryFields: [
            "supplierPartId",
            "accountCode",
            "categories",
            "costCenter",
            "customAttributes",
            "departments",
            "description",
            "endDate",
            "expenseCategory",
            "images",
            "itemIds",
            "lineNumber",
            "lineOfBusiness",
            "location",
            "manufacturerPartId",
            "materialId",
            "price",
            "projectCode",
            "quantity",
            "specifications",
            "startDate",
            "tax",
            "totalPrice",
            "trackCode",
            "type",
            "unitForQuantity",
            "url",
            "vendor",
          ],
          readonlyFields: [],
          disableAdd: false,
          disableDelete: false,
          enableAccountCodeFilter: false,
          enableAddSubItems: true,
          questionnaireId: {
            id: null,
            name: "Supplier Identification",
            formId: "OroSupplierDetailForm",
            formDocumentId: null,
            custom: false,
            editMode: false,
            completed: false,
            __typename: "QuestionnaireId",
          },
          __typename: "ItemListConfig",
        },
        title: "Items List",
        __typename: "FormField",
      },
      {
        fieldName: "lineItemsRequired",
        requirement: "required",
        booleanValue: true,
      },
      {
        fieldName: "allowNegative",
        requirement: "required",
        booleanValue: true,
      },
    ],
    formData,
    isReadOnly: false,
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    unitOptions: mockUnitPerQuantity,
    categoryOptions: mockCategory,
    costCenterOptions: mockCostCenters,
    departmentOptions: mockDepartments,
    accountCodeOptions: mockAccountCodes,
    defaultAccountCode: {
      id: mockAccountCodes[0].id,
      name: mockAccountCodes[0].displayName,
    },
    unitPerQtyOptions: mockUnitPerQuantity,
    itemIdOptions: mockDepartments,
    trackCodeOptions: mockDepartments,
    lineOfBusinessOptions: mockDepartments,
    locationOptions: mockDepartments,
    projectOptions: mockDepartments,
    expenseCategoryOptions: mockDepartments,
    purchaseItemOptions: mockDepartments,
    defaultDepartments: [{ id: "id1", name: "Marketing" }],
    defaultLocations: [{ id: "id1", name: "Marketing" }],

    submitLabel: "Submit",
    // subTotalMoney: { amount: 2000000, currency: DEFAULT_CURRENCY },
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};