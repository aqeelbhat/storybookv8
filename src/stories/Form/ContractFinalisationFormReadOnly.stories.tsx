import React from "react";
import { StoryFn } from "@storybook/react";
import { ContractFinalisationFormReadOnly } from "../../lib";
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
  title: "ORO UI Toolkit/Form/Contract Finalisation Form ReadOnly",
  component: ContractFinalisationFormReadOnly,
};

export const TemplateForm = {
  args: {
    formData: {
      supplierName: "IBM",
      savingsLink: "",
      companyEntity: {
        id: "HH-HM",
        displayName: "Honeycomb Mfg.",
        path: "HH-HM",
      },
      currency: {
        id: "id1",
        displayName: DEFAULT_CURRENCY,
        path: DEFAULT_CURRENCY,
      },
      relatedContracts: [
        { id: "250714683535993182", name: "Figma", erpId: "" },
        { id: "250714683535993183", name: "Apple", erpId: "" },
      ],
      businessOwners: [
        {
          tenantId: "",
          tenantName: null,
          userName: "johndoe@foo.ai",
          name: "John Doe",
          department: "",
          departmentCode: null,
          groupIds: null,
          type: null,
          email: null,
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: null,
          admin: false,
        },
        {
          tenantId: "",
          tenantName: null,
          userName: "jane@foo.ai",
          name: "Jane Doe",
          department: "",
          departmentCode: null,
          groupIds: null,
          type: null,
          email: null,
          phone: null,
          firstName: null,
          lastName: null,
          api: false,
          picture: null,
          ip: null,
          admin: false,
        },
      ],
      contractDescription: "Purchase monday.com",
      proposalDescription: "Test Proposal",
      contractType: { id: "annual", name: "Annual", erpId: "" },
      duration: 12,
      quantity: "2 users",
      fixedSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
      recurringSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
      variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
      oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
      totalValue: { amount: 3500, currency: "GBP" },
      tenantTotalValue: { amount: 4247.76, currency: DEFAULT_CURRENCY },
      autoRenew: true,
      autoRenewNoticePeriod: 10,
      includesCancellation: false,
      cancellationNoticePeriod: 0,
      includesOptOut: true,
      optOutDeadline: "2023-01-31",
      negotiatedSavings: { amount: 700, currency: DEFAULT_CURRENCY },
      savingsCalculation: "test",
      startDate: "2022-10-28",
      endDate: "2022-11-28",
      paymentTerms: { id: "net15", name: "Net 15", path: "Net 15" },
      billingCycle: "Monthly",
      slaDocument: mockSlaDocumment,
      slaAttachment: mockSlaDocumment.attachment,
      msaDocument: mockMsaDocument,
      msaAttachment: mockMsaDocument.attachment,
      revisions: [
        {
          contractType: { id: "annual", name: "Annual", erpId: "" },
          proposalDescription: "Test Proposal",
          duration: 12,
          fixedSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          recurringSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 1000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 1000, currency: DEFAULT_CURRENCY },
          negotiatedSavings: { amount: 500, currency: DEFAULT_CURRENCY },
          quantity: "2 users",
          billingCycle: "Annual",
          autoRenew: true,
        },
        {
          contractType: { id: "annual", name: "Annual", erpId: "" },
          proposalDescription: "Second Proposal",
          duration: 18,
          fixedSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          recurringSpend: { amount: 3000, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 3500, currency: "GBP" },
          tenantTotalValue: { amount: 4247.76, currency: DEFAULT_CURRENCY },
          quantity: "4 users",
        },
        {
          contractType: { id: "contractor", name: "Contractor", erpId: "" },
          duration: 12,
          recurringSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 1500, currency: DEFAULT_CURRENCY },
        },
      ],
      yearlySplits: [
        { year: null, annualSpend: { amount: 10, currency: DEFAULT_CURRENCY } },
        { year: 2022, annualSpend: { amount: 12, currency: DEFAULT_CURRENCY } },
      ],
      selectedRevisionIndex: 0,
    },
    paymentTermOptions: mockPaymentTerms,
    documentTypeOptions: mockDocumentTypeOptions,
    contractTypeDefinition: mockContractTypeFieldDefinition,
  },
};
