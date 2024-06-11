import React from "react";
import { StoryFn } from "@storybook/react";
import mockData from "./mocks/BuyingChannelMock";
import AdditionalQuestion from "../../../lib/Form/ChatGPTV2/AdditionalQuestion";

const value = {
  question: "How are you?",
  answer: "Fabulouse",
};
//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Chat GPT V2/Additional question",
  component: AdditionalQuestion,
};

//👇 We create a “template” of how args map to rendering
const Template: StoryFn = (args) => (
  <AdditionalQuestion
    show={true}
    value={value}
    userResponded={false}
    placeholder="Describe your business need..."
    onSearch={(query) => console.log(query)}
  />
);

export const TemplateForm = {
  render: Template,

  args: {
    buyerChannelDetails: mockData,
  },
};
