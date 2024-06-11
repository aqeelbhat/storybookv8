import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierAttributeForm, getI18NInstance } from "../../../lib";
import { SupplierAttributeFormProps } from "../../../lib/Form/SupplierAttribute/types";
import { mockClassificationOption } from "../../MultiLevelSelect/mocks";

export default {
  title: "ORO UI Toolkit/Form/Supplier Attribute/Edit",
  component: SupplierAttributeForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData: {
      normalizedVendorId: "",
      isSensitive: null,
      supplierStatus: "preferred",
      statusComment: "test",
      hasNda: true,
      hasMsa: false,
      hasCda: false,
      hasDpa: false,
      nda: null, // {filename: 'File_1'},
      msa: null,
      cda: null,
      dpa: null,
      ndaExpiration: "", // '2025-04-02',
      msaExpiration: "",
      cdaExpiration: "",
      dpaExpiration: "",
      spendDetails: null,
    },
    fields: [
      {
        fieldName: "isSensitive",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Sensitive",
        __typename: "FormField",
      },
      {
        fieldName: "segmentationDetails",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Segmentations",
        __typename: "FormField",
      },
      {
        fieldName: "hasNda",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "NDA",
        __typename: "FormField",
      },
      {
        fieldName: "hasMsa",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "MSA",
        __typename: "FormField",
      },
      {
        fieldName: "hasCda",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "CDA",
        __typename: "FormField",
      },
      {
        fieldName: "hasDpa",
        requirement: "optional",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "DPA",
        __typename: "FormField",
      },
      {
        fieldName: "spendDetails",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Spend Details",
        __typename: "FormField",
      },
    ],
    submitLabel: "Submit",
    cancelLabel: "cancel",
    classificationOption: mockClassificationOption,
    onSubmit: (data) => {
      console.log("submit data", data);
    },
  },
};
