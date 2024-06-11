import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierEditOptionForm, getI18NInstance } from "../../../lib";
import { SupplierEditOptionProps } from "../../../lib/Form/SupplierEditOption/types";
import { mockSupplierEditOptions } from "../../mocks/supplierEditOption";

export default {
  title: "ORO UI Toolkit/Form/Supplier Edit Option/Edit",
  component: SupplierEditOptionForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData: {
      vendorId: "89113807414099968",
      otherDetailsToUpdate: "",
      reasonForUpdate: "",
      editMethods: [],
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
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onSubmit: (data) => {
      console.log("submit data", data);
    },
  },
};
