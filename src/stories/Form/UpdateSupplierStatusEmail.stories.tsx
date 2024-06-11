import React from "react";
import { StoryFn } from "@storybook/react";

import {
  getI18NInstance,
  UpdateSupplierStatusFormData,
  UpdateSupplierStatusFormReadOnlyProps,
  UpdateSupplierStatusFormEmailTemplate,
} from "./../../lib";
import { SupplierSegmentation } from "../../lib/Types/vendor";
import { mockClassificationOption } from "../MultiLevelSelect/mocks";

const formData: UpdateSupplierStatusFormData = {
  supplierStatus: SupplierSegmentation.strategic,
  statusComment:
    "Comment provided by the user on how Thermo Fisher is classified as strategic. Comment provided by the user on how Thermo Fisher is classified as strategic. Comment provided by the user on how Thermo Fisher is classified as strategic",
};
//👇 This default export determines where your story goes in the story list
export default {
  title:
    "ORO UI Toolkit/Form/UpdateSupplierProfile/Update Supplier Status Email Template",
  component: UpdateSupplierStatusFormEmailTemplate,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData,
    classificationOption: mockClassificationOption,
  },
};
