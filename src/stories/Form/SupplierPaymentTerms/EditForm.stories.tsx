import React from "react";
import { StoryFn } from "@storybook/react";
import { SupplierEditPaymentTermForm, getI18NInstance } from "../../../lib";
import { SupplierEditPaymentTermProps } from "../../../lib/Form/SupplierPaymentTerms/types";
import { mockPaymentTerms } from "../../MultiLevelSelect/mocks";

export default {
  title: "ORO UI Toolkit/Form/Supplier Edit Payment Term/Edit",
  component: SupplierEditPaymentTermForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData: {
      paymentTerm: {
        id: "1",
        displayName: "Net 15",
        path: "1",
        customData: { erpId: "1" },
        selected: false,
        selectable: true,
      },
      companyEntityRef: {
        id: "HH",
        name: "Honeycomb Holdings Inc.",
        erpId: "4",
        systemId: "",
        empty: false,
      },
      vendorRef: {
        id: "253118258770133825",
        vendorId: "Microsoft-2",
        name: "Microsoft",
        enabled: false,
        companyEntityRef: {
          id: "HH",
          name: "Honeycomb Holdings Inc.",
          erpId: "4",
          empty: false,
        },
        additionalCompanyEntities: [
          {
            id: "HH-5",
            name: "Honeycomb Holdings UK Ltd",
            erpId: "5",
            empty: false,
          },
        ],
        paymentTerm: {
          id: "1",
          name: "Net 15",
          erpId: "1",
          empty: false,
        },
        currencies: ["USD"],
        enabledSystems: [],
      },
    },
    fields: [
      {
        fieldName: "paymentTerm",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Payment terms",
        __typename: "FormField",
      },
    ],
    paymentTermOption: mockPaymentTerms,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onSubmit: (data) => {
      console.log("submit data", data);
    },
  },
};
