import React from "react";
import { StoryFn } from "@storybook/react";
import { ContractNegotiationFormEmail } from "../../lib";
import { ContractFormProps } from "../../lib/Form/types";
import {
  mockDocumentTypeOptions,
  mockMsaDocument,
  mockPaymentTerms,
  mockSlaDocumment,
} from "../MultiLevelSelect/mocks";
import { mockContractTypeFieldDefinition } from "../mocks/contractNegotiation";
import { DEFAULT_CURRENCY } from "../../lib/util";

export default {
  title: "ORO UI Toolkit/Form/Contract Negotiation Form Email",
  component: ContractNegotiationFormEmail,
};

export const TemplateForm = {
  args: {
    formData: {
      supplierName: "IBM",
      companyEntity: {
        id: "HH-HM",
        displayName: "Honeycomb Mfg.",
        path: "HH-HM",
      },
      contractType: { id: "annual", name: "Annual", erpId: "" },
      duration: 1,
      quantity: "2 users",
      recurringSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
      variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
      oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
      totalValue: { amount: 3500, currency: "GBP" },
      tenantTotalValue: { amount: 4247.76, currency: DEFAULT_CURRENCY },
      autoRenew: true,
      autoRenewNoticePeriod: 10,
      includesCancellation: false,
      cancellationNoticePeriod: 0,
      savings: { amount: 900, currency: DEFAULT_CURRENCY },
      savingsCalculation: "test",
      startDate: "2022-10-28",
      endDate: "2022-11-28",
      paymentTerms: { erpId: "1", id: "1", name: "Net 15" },
      billingCycle: "Monthly",
      slaDocument: mockSlaDocumment,
      slaAttachment: mockSlaDocumment.attachment,
      msaDocument: mockMsaDocument,
      msaAttachment: mockMsaDocument.attachment,
      revisions: [
        {
          proposalDescription: "P1",
          duration: 1,
          recurringSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 1000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 1000, currency: "GBP" },
          tenantTotalValue: { amount: 1212.58, currency: DEFAULT_CURRENCY },
          quantity: "2 users",
          startDate: "2022-10-28",
          endDate: "2022-11-28",
        },
        {
          proposalDescription: "P2",
          duration: 2,
          recurringSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 2000, currency: DEFAULT_CURRENCY },
          quantity: "4 users",
          startDate: "2022-10-28",
          endDate: "2022-11-28",
        },
        {
          proposalDescription: "P3",
          duration: 2,
          recurringSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 3000, currency: DEFAULT_CURRENCY },
          quantity: "4 users",
        },
      ],
    },
    paymentTermOptions: mockPaymentTerms,
    documentTypeOptions: mockDocumentTypeOptions,
    contractTypeDefinition: mockContractTypeFieldDefinition,
  },
};
