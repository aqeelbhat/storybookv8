import React from "react";
import { StoryFn } from "@storybook/react";
import { ContractNegotiationFormReadOnly } from "../../lib";
import { ContractFormProps } from "../../lib/Form/types";
import {
  mockDocumentTypeOptions,
  mockMsaDocument,
  mockPaymentTerms,
  mockSlaDocumment,
} from "../MultiLevelSelect/mocks";
import {
  mockAnnualContractFields,
  mockContractTypeFieldDefinition,
} from "../mocks/contractNegotiation";
import { DEFAULT_CURRENCY } from "../../lib/util";

export default {
  title: "ORO UI Toolkit/Form/Contract Negotiation Form ReadOnly",
  component: ContractNegotiationFormReadOnly,
};

export const TemplateForm = {
  args: {
    formData: {
      supplierName: "IBM",
      savingsLink: "",
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
      duration: 1,
      quantity: "2 users",
      recurringSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
      variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
      oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
      totalValue: { amount: 3500, currency: DEFAULT_CURRENCY },
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
          proposalDescription: "Test Proposal",
          contractType: { id: "annual", name: "Annual", erpId: "" },
          duration: 12,
          fixedSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          recurringSpend: { amount: 1200, currency: "GBP" },
          tenantRecurringSpend: { amount: 1455.12, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 1000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 1000, currency: "GBP" },
          tenantTotalValue: { amount: 1212.58, currency: DEFAULT_CURRENCY },
          negotiatedSavings: { amount: 500, currency: DEFAULT_CURRENCY },
          quantity: "2 users",
          billingCycle: "Annual",
          autoRenew: true,
          autoRenewNoticePeriod: 3,
        },
        {
          proposalDescription: "Second Proposal",
          contractType: { id: "annual", name: "Annual", erpId: "" },
          duration: 18,
          fixedSpend: { amount: 1000, currency: DEFAULT_CURRENCY },
          variableSpend: { amount: 2000, currency: DEFAULT_CURRENCY },
          recurringSpend: { amount: 3000, currency: "GBP" },
          tenantRecurringSpend: { amount: 8000, currency: DEFAULT_CURRENCY },
          oneTimeCost: { amount: 2000, currency: DEFAULT_CURRENCY },
          totalValue: { amount: 2000, currency: "GBP" },
          tenantTotalValue: { amount: 5000, currency: DEFAULT_CURRENCY },
          quantity: "4 users",
          yearlySplits: [
            {
              year: 2021,
              totalValue: { amount: 10, currency: "GBP" },
              tenantTotalValue: { amount: 12.13, currency: DEFAULT_CURRENCY },
            },
            {
              year: 2022,
              totalValue: { amount: 12, currency: "GBP" },
              tenantTotalValue: { amount: 14.55, currency: DEFAULT_CURRENCY },
            },
          ],
        },
      ],
    },
    paymentTermOptions: mockPaymentTerms,
    documentTypeOptions: mockDocumentTypeOptions,
    contractFields: mockAnnualContractFields,
    contractTypeDefinition: mockContractTypeFieldDefinition,
  },
};
