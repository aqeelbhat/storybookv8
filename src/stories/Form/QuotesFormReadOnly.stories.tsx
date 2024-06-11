import React from "react";
import { StoryFn } from "@storybook/react";

import { QuotesFormReadOnly } from "./../../lib";
import { QuotesDetailReadonlyProps } from "../../lib/Form/types";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Quotes Form read only",
  component: QuotesFormReadOnly,
};

const mockProposals = [
  {
    date: null,
    expiration: "2021-07-30T13:00:00.000",
    filename: "a.csv",
    mediatype: "text/csv",
    name: "Quote",
    note: "blah",
    path: "attachment/65099653170855936/a.csv",
    reference: null,
    size: 185,
  },
];
const mockAdditionalDoc = [
  {
    date: null,
    expiration: "2021-07-30T13:00:00.000",
    filename: "abcd.csv",
    mediatype: "image/png",
    name: "additional",
    note: "blah",
    path: "attachment/65099653170855936/a.csv",
    reference: null,
    size: 185,
  },
];

export const TemplateForm = {
  args: {
    data: {
      proposals: mockProposals,
      additionalDocs: mockAdditionalDoc,
      paymentTerm: {
        id: "string",
        name: "net 30",
      },
      askForLegalReview: false,
    },
  },
};
