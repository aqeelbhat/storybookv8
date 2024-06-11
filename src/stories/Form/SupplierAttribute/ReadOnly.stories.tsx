import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierAttributeForm, getI18NInstance } from "../../../lib";
import { SupplierAttributeFormProps } from "../../../lib/Form/SupplierAttribute/types";
import { mockClassificationOption } from "../../MultiLevelSelect/mocks";

export default {
  title: "ORO UI Toolkit/Form/Supplier Attribute/ReadOnly",
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
      nda: { filename: "File_1" },
      msa: null,
      cda: null,
      dpa: { filename: "File_2" },
      ndaExpiration: "2025-04-02",
      msaExpiration: "",
      cdaExpiration: "",
      dpaExpiration: "2025-05-01",
      spendDetails: {
        poCount: 2,
        invoiceCount: 2,
        spendRange: "between50K_to_150K",
      },
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
    isReadOnly: true,
  },
};
