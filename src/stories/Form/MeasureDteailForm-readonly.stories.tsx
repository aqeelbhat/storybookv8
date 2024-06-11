import React from "react";
import { StoryFn } from "@storybook/react";

import {
  MeasureDetailReadonly,
  MeasureDetailReadonlyProps,
  MeasureDetailsFormData,
  StandardPriority,
} from "./../../lib";
import { mockCsvFile } from "../mocks/file.mock";

const formData: MeasureDetailsFormData = {
  name: "",
  type: { id: "ebit", path: "ebit", displayName: "Ebit Impact" },
  estimate: null,
  businessSegments: [
    { id: "option1", path: "option1", displayName: "Option 1" },
    { id: "option2", path: "option2", displayName: "Option 2" },
  ],
  owner: null,
  sensitive: false,
  priority: StandardPriority.high,
  impactCategory: { id: "option1", path: "option1", displayName: "Option 1" },
  workstream: {
    id: "eng",
    displayName: "Engineering",
    path: "eng",
  },
  id: "E101",
  locations: [
    { id: "option1", path: "option1", displayName: "Option 1" },
    { id: "option2", path: "option2", displayName: "Option 2" },
    { id: "option3", path: "option3", displayName: "Option 3" },
  ],
  additionalDocs: [
    {
      date: undefined,
      expiration: undefined,
      filename: "11-10-2021 11-06-15.428927_Noopur_Hyundai.pdf",
      mediatype: "text/csv",
      name: undefined,
      note: undefined,
      path: "attachment/65099653170855936/a.csv",
      reference: undefined,
      size: 185,
    },
    {
      date: undefined,
      expiration: undefined,
      filename: "b.csv",
      mediatype: "text/csv",
      name: undefined,
      note: undefined,
      path: "attachment/65099653170855936/b.csv",
      reference: undefined,
      size: 185,
    },
  ],
  situation:
    "Customs broker we use for inbound shipments of 3rd party customer materials is causing delays ( demurrage at airport; can’t get a clear picture on delivery to the warehouse ). We are spending a half a day a week on this topic. For domestic shipments, via Transplace, we also need to support 3rd party logistics (e.g. Elevation). The training on Transplace seems there is functionality to get message notifications, which we would have to setup (TBC if all vehicles have trackers).",
  action:
    "Getting training on protocols inside the PO process. Want to drive tighter parameters with the broker ( customer centric vs. logicial centric). The goal is to get a better idea of when we are going to receive the material - regardless of local or internation.",
  benefit:
    "Reduce time spent having to track all of this down and avoid demurrage costs, as possible.",
  other: `Situation: Loong Loong www.google.com Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong Loong

Action: Situation: Loong Loong www.google.com Loong
  
Benefit: Situation: Loong Loong www.google.com Loong`,
  docUrls: "www.google.com,  www.google.com,  www.google.com",
  relatedMeasures: [
    { id: "option1", path: "option1", displayName: "Option 1" },
    { id: "option2", path: "option2", displayName: "Option 2" },
  ],
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/MeasureDetailReadonly Form",
  component: MeasureDetailReadonly,
};

export const TemplateForm = {
  args: {
    formData,
    loadDocument: () => Promise.resolve(mockCsvFile),
  },
};
