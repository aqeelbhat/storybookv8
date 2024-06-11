import React from "react";
import { StoryFn } from "@storybook/react";
import { InvoiceValidationForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceValidationFormProps } from "../../../lib/Form/InvoiceValidation/types";

const formData = {
  comment: null,
  rules: [
    {
      rule: "invoiceDateRange",
      status: "ok",
      field: "invoiceDate",
      message:
        "Within the acceptable invoice duration range as per the contract.",
    },
    {
      rule: "annualVariableCost",
      status: "ok",
      field: "invoiceAmount",
      message:
        "5% higher than the expected annual variable cost that totals up to USD 100.00.",
    },
    {
      rule: "annualServiceCost",
      status: "ok",
      field: "invoiceAmount",
      message:
        "110% higher than the expected annual service cost of USD 50.00.",
    },
    {
      rule: "totalContractValue",
      status: "ok",
      field: "invoiceAmount",
      message: "Invoice amount in line with TCV.",
    },
    {
      rule: "totalEstimatedSpend",
      status: "ok",
      field: "invoiceAmount",
      message: "Invoice amount in line with total estimated spend value.",
    },
    {
      rule: "totalContractValueConsumption",
      status: "ok",
      field: "invoiceAmount",
      message:
        "Invoice value of USD 105.00 results in a total spend of USD 210.00 against the contract TCV of USD 500.00.",
    },
    {
      rule: "totalEstimatedSpendConsumption",
      status: "ok",
      field: "invoiceAmount",
      message:
        "Total spend is 21% of the minimum committed spend for this supplier.",
    },
    {
      rule: "poEndDate",
      status: "ok",
      field: "invoiceDate",
      message: "Invoice date is 45 days over the PO end date.",
    },
    {
      rule: "contractEndDate",
      status: "ok",
      field: "invoiceDate",
      message: "Invoice date is 45 days over the contract end date.",
    },
  ],
};

export default {
  title: "ORO UI Toolkit/Form/Invoice Validation/ALL OK",
  component: InvoiceValidationForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    fields: [
      {
        fieldName: "rules",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Invoice number",
        __typename: "FormField",
      },
      {
        fieldName: "comment",
        requirement: "required",
        booleanValue: true,
        stringValue: null,
        intValue: null,
        itemConfig: null,
        title: "Comment",
        __typename: "FormField",
      },
    ],
    formData,
    submitLabel: "Submit",
    cancelLabel: "cancel",
    onReady: () => {},
    onSubmit: (data) => {
      console.log("submit data", data);
    },
    onCancel: (data) => {},
  },
};
