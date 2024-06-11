import React from "react";
import { StoryFn } from "@storybook/react";
import { OROIcebergChart } from "../../lib";
import {
  IcebergChartData,
  IcebergChartProps,
  IcebergTimeUnit,
} from "../../lib/Form/types";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Chart/IcebergChart",
  component: OROIcebergChart,
};

const formData: Array<IcebergChartData> = [
  {
    date: "2022-01-01",
    netAmount: -172,
    ils: [
      {
        milestone: "IL6",
        measures: "4",
        amount: 6000,
        negative: true,
      },
      {
        milestone: "IL5",
        measures: "1",
        amount: 5000,
        negative: false,
      },
      {
        milestone: "IL4",
        measures: "1",
        amount: 4000,
        negative: false,
      },
      {
        milestone: "IL3",
        measures: "1",
        amount: 3000,
        negative: false,
      },
      {
        milestone: "IL2",
        measures: "1",
        amount: 2000,
        negative: false,
      },
      {
        milestone: "IL1",
        measures: "1",
        amount: 1000,
        negative: false,
      },
    ],
  },
  {
    date: "2022-01-01",
    netAmount: 500,
    ils: [
      {
        milestone: "IL6",
        measures: "4",
        amount: 6000,
        negative: false,
      },
      {
        milestone: "IL5",
        measures: "1",
        amount: 5000,
        negative: false,
      },
      {
        milestone: "IL4",
        measures: "1",
        amount: 4000,
        negative: false,
      },
      {
        milestone: "IL3",
        measures: "1",
        amount: 3000,
        negative: false,
      },
      {
        milestone: "IL2",
        measures: "1",
        amount: 2000,
        negative: false,
      },
      {
        milestone: "IL1",
        measures: "1",
        amount: 1000,
        negative: false,
      },
    ],
  },
  {
    date: "2022-01-01",
    netAmount: -4400,
    ils: [
      {
        milestone: "IL6",
        measures: "4",
        amount: 6000,
        negative: false,
      },
      {
        milestone: "IL5",
        measures: "1",
        amount: 5000,
        negative: false,
      },
      {
        milestone: "IL4",
        measures: "1",
        amount: 4000,
        negative: false,
      },
      {
        milestone: "IL3",
        measures: "1",
        amount: 3000,
        negative: false,
      },
      {
        milestone: "IL2",
        measures: "1",
        amount: 2000,
        negative: false,
      },
      {
        milestone: "IL1",
        measures: "1",
        amount: 1000,
        negative: false,
      },
    ],
  },
  {
    date: "2022-01-01",
    netAmount: 5700,
    ils: [
      {
        milestone: "IL6",
        measures: "4",
        amount: 6000,
        negative: false,
      },
      {
        milestone: "IL5",
        measures: "1",
        amount: 5000,
        negative: false,
      },
      {
        milestone: "IL4",
        measures: "1",
        amount: 4000,
        negative: false,
      },
      {
        milestone: "IL3",
        measures: "1",
        amount: 3000,
        negative: false,
      },
      {
        milestone: "IL2",
        measures: "1",
        amount: 2000,
        negative: false,
      },
      {
        milestone: "IL1",
        measures: "1",
        amount: 1000,
        negative: false,
      },
    ],
  },
  {
    date: "Q1",
    amount: 5600,
    measures: "6",
    milestone: "",
    name: "Q1",
    negative: true,
  },
  {
    date: "Q2",
    amount: 6600,
    measures: "6",
    milestone: "",
    name: "Q2",
    negative: false,
  },
  {
    date: "Q3",
    amount: 100,
    measures: "6",
    milestone: "",
    name: "Q3",
    negative: true,
  },
  {
    date: "Q4",
    amount: 600,
    measures: "6",
    milestone: "",
    name: "Q4",
    negative: false,
  },
];

export const TemplateForm = {
  args: {
    formData,
    timeunit: IcebergTimeUnit.monthly,
    waterlineIndex: 6,
  },
};
