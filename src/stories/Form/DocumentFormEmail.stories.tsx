import React from "react";
import { StoryFn } from "@storybook/react";

import { DocumentFormEmail, DocumentFormData } from "./../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Document Form Email",
  component: DocumentFormEmail,
};

export const TemplateForm = {
  args: {
    data: [
      {
        type: { id: "nda", displayName: "NDA", path: "nda" },
        name: "Heraeus NDA",
        startDate: "2021-07-13T18:30:00.000",
        endDate: "2021-07-30T18:30:00.000",
        attachment: {
          date: null,
          expiration: null,
          filename: "a.csv",
          mediatype: "text/csv",
          name: null,
          note: null,
          path: "attachment/65099653170855936/a.csv",
          reference: null,
          size: 185,
        },
        owner: {
          id: "wilsongeidt",
          displayName: "Wilson Geidt",
          path: "wilsongeidt",
        },
        notes: "Some text here",
      },
    ],
  },
};
