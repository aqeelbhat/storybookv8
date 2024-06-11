import React from "react";
import { StoryFn } from "@storybook/react";
import { getI18NInstance } from "../../../lib";
import { ChatGPTFormV2Props } from "../../../lib/Form/ChatGPTV2";
import ProposalDetails from "../../../lib/Form/ChatGPTV2/ProposalDetails/index.tsx";

export default {
  title: "ORO UI Toolkit/Form/Chat GPT V2/Proposal",
  component: ProposalDetails,
};
getI18NInstance(true);

export const TemplateForm = {
  args: {
    title: "Title here",
    isExtractionSkipped: false,
    details: {
      fileid: "file id",
      auto_renewal: true,
      cancellation: true,
      agreement_type: "Contract",
      auto_renewal_max: "auto_renewal_max",
      auto_renewal_notify: "auto_renewal_notify",
      auto_renewal_period: "auto_renewal_period",
      commercial: "commercial",
      duration_term: "duration_term",
      duration_type: "duration_type",
      expiry_date: "expiry_date",
      government: "government",
      incoterm: "incoterm",
      incoterm_location: "incoterm_location",
      sca: "sca",
      signer: "signer",
      summary_paragraph: "summary_paragraph",
      summary_sentence: "summary_sentence",
      top: "top",
      currency: "USD",
      end_date: "end_date",
      payment: "payment",
      start_date: "start_date",
      supplier: "supplier",
      value: 232131231,
    },
  },
};
