import { Field } from '../types'

export enum enumInvoiceFields {
  rules = 'rules',
  comment = 'comment',
}
enum RuleType {
  invoiceDateRange = 'invoiceDateRange',
  annualVariableCost = 'annualVariableCost',
  annualServiceCost = 'annualServiceCost',
  totalContractValue = 'totalContractValue',
  totalEstimatedSpend = 'totalEstimatedSpend',
  totalContractValueConsumption = 'totalContractValueConsumption',
  totalEstimatedSpendConsumption = 'totalEstimatedSpendConsumption',
  poEndDate = 'poEndDate',
  contractEndDate = 'contractEndDate',
}
export enum RuleStatus {
  ok = 'ok',
  exception = 'exception',
  fyi = 'fyi'
}
enum RuleField {
  invoiceDate = 'invoiceDate',
  invoiceAmount = 'invoiceAmount'
}
export type InvoiceValidationRule = {
  rule: RuleType
  status: RuleStatus
  field: RuleField
  message: string
}

export interface InvoiceValidationFormData {
  [enumInvoiceFields.rules]: InvoiceValidationRule[] | null
  [enumInvoiceFields.comment]: string | null
}

export interface InvoiceValidationFormProps {
  formData?: InvoiceValidationFormData
  showVerifyScreen: boolean
  isReadOnly: boolean
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: (formData: InvoiceValidationFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => InvoiceValidationFormData) => void
  onValueChange?: (fieldName: string, updatedForm: InvoiceValidationFormData) => void
}

export interface IParsedRule {
  noExceptions: boolean,
  exceptions: number,
  rules: Record<RuleField, InvoiceValidationRule> | {}
}
