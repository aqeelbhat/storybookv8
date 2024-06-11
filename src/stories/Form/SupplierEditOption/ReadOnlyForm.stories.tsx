import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierEditOptionFormReadOnly, getI18NInstance } from "../../../lib";
import { SupplierEditOptionReadOnlyProps } from "../../../lib/Form/SupplierEditOption/types";
import { mockCsvFile } from "../../mocks/file.mock";
import { mockSupplierEditOptions } from "../../mocks/supplierEditOption";

export default {
  title: "ORO UI Toolkit/Form/Supplier Edit Option/Read Only",
  component: SupplierEditOptionFormReadOnly,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData: {
      vendorId: "89113807414099968",
      otherDetailsToUpdate: "Other Details",
      reasonForUpdate: "Testing edit flow",
      editMethods: [
        {
          id: "addOrUpdatePaymentDetails",
          path: "addOrUpdatePaymentDetails",
          displayName: "Payment details",
          customData: { description: "Add or update bank details" },
        },
        {
          id: "addPaymentTerms",
          path: "addPaymentTerms",
          displayName: "Payment terms",
          customData: { description: "Add payment terms" },
        },
      ],
      attachments: [{ filename: "File_1" }],
    },
    fields: [
      {
        fieldName: "editMethods",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Choose supplier edit options",
        __typename: "FormField",
      },
      {
        __typename: "FormField",
        fieldName: "allowAddOrUpdatePaymentDetails",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Allow add or update payment details",
        questionnaireId: null,
      },
      {
        __typename: "FormField",
        fieldName: "allowAddPaymentTerms",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Allow add payment terms",
        questionnaireId: null,
      },
      {
        __typename: "FormField",
        fieldName: "allowEditOtherDetails",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Allow editing other details",
        questionnaireId: null,
      },
    ],
    supplierEditOption: mockSupplierEditOptions,
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
