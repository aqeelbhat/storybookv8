import React from "react";
import { StoryFn } from "@storybook/react";
import BuyingChannels from "../../../lib/Form/ChatGPTV2/BuyingChannels";
import { IBuyingChannelResponse } from "../../../lib/Form/ChatGPTV2/types";
import mockData from "./mocks/BuyingChannelMock";
//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Chat GPT V2/Buying Channels",
  component: BuyingChannels,
};

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<{
  buyerChannelDetails: Array<IBuyingChannelResponse>;
}> = (args) => (
  <BuyingChannels primaryButton="Get Started" title="This is title" {...args} />
);

export const TemplateForm = {
  render: Template,

  args: {
    buyerChannelDetails: mockData,
  },
};
