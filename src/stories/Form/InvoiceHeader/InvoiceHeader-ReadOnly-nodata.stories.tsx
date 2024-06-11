import React from "react";
import { StoryFn } from "@storybook/react";

import { InvoiceHeaderReadOnlyForm } from "../../../lib";
import { getI18NInstance } from "../../../lib/i18n";
import type { InvoiceHeaderFormProps } from "../../../lib/Form/InvoiceHeader/types";

const formData = null;

export default {
  title: "ORO UI Toolkit/Form/Invoice Header/No Data Read Only",
  component: InvoiceHeaderReadOnlyForm,
};

getI18NInstance(true);

export const TemplateForm = {
  args: {
    formData,
  },
};
