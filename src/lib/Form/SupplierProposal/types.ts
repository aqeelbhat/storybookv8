/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { Attachment, IDRef, Option } from '../../Types'
import { ContractExtractionResponse } from '../ChatGPTV2'
import { Cost, Field } from '../types'

export const SUPPLIER_PROPOSAL = 'supplierProposal'
export const SUPPLIER_LEGAL_NAME = 'supplierLegalName'
export const DESCRIPTION = 'description'
export const DELIVERY_DATE = 'deliveryDate'
export const TOTAL_AMOUNT = 'totalAmount'
export const COUNTRY = 'country'
export const PAYMENT_TERM = 'paymentTerm'
export const PAYMENT_TERM_FILTER_TAG = 'paymentTermFilterTag'
export const PAYMENT_TERM_FILTER_BY_REGION = 'paymentTermFilterByRegion'

export interface SupplierProposalData {
  supplierProposal?: Attachment
  proposalExtract?: ContractExtractionResponse

  supplierLegalName?: string
  description?: string
  // businessNeed: string
  deliveryDate?: string
  totalAmount?: Cost
  // budget: Cost
  country?: string
  paymentTerm?: Option
  // categories: Option[]
}

export interface SupplierProposalProps {
  formData?: SupplierProposalData
  fields?: Field[]
  currencyOptions?: Option[]
  countryOptions?: Option[]
  defaultCurrency?: string
  submitLabel?: string
  cancelLabel?: string
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
  fetchPaymentTerms?: (filterTag?: string) => Promise<Option[]>
  fetchRegion?: (code: string) => Promise<IDRef>
  onSubmit?: (formData: SupplierProposalData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => SupplierProposalData) => void
  onProposalChange?: (updatedForm: SupplierProposalData) => Promise<SupplierProposalData>
  onValueChange?: (fieldName: string, updatedForm: SupplierProposalData) => void
}
