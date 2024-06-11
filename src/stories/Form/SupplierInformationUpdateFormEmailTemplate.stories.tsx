import React from "react";
import { StoryFn } from "@storybook/react";

import {
  OroSupplierInformationUpdateForm,
  SupplierInformationUpdateEmailTemplate,
} from "./../../lib";

const formData: OroSupplierInformationUpdateForm = {
  compantyEntity: {
    erpId: "",
    id: "abc",
    name: "spider Man",
  },
  guid: "A231",
  taxRegistrationID: "123",
  companyDomain: "",
  isNewSupplier: false,
  companyName: "Super Man",
  hasSupplierEmail: false,
  spend: {
    amount: 10000,
    currency: "GBP",
  },
  vendorCountry: "USA",
  vendorId: "Bat Man",
  vendorType: {
    erpId: "",
    id: "abc",
    name: "Flash",
  },
  supplierContactEmail: "bruce@wayne.com",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Supplier Information Update Form Email Template",
  component: SupplierInformationUpdateEmailTemplate,
};

export const TemplateForm = {
  args: {
    data: formData,
  },
};
