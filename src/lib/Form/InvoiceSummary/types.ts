

import { Money, Supplier, User, UserId } from '../../Types'
import { Field } from '../types'

export interface InvoiceSummaryFormProps {
  isReadOnly?: boolean
  useBookingPeriod?: boolean
  defaultCurrency?: string
  formData?: InvoiceSummaryFormData
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: (formData: InvoiceSummaryFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => InvoiceSummaryFormData) => void
  getAllUsers?: (keyword: string) => Promise<Array<User>>
  onValueChange?: (fieldName: string, updatedForm: InvoiceSummaryFormData) => void
}

export enum enumInvoiceFields {
  invoiceNumber = "invoiceNumber",
  invoiceDate = "invoiceDate",
  dueDate = "dueDate",
  totalAmount = "totalAmount",
  supplier = 'supplier',
  poNumber = 'poNumber',
  details = 'details',
  bookingPeriod = 'bookingPeriod',
  poApprover = 'poApprover'
}

export interface InvoiceSummaryFormData {
  [enumInvoiceFields.invoiceNumber]: string,
  [enumInvoiceFields.invoiceDate]: string
  [enumInvoiceFields.dueDate]: string,
  [enumInvoiceFields.totalAmount]?: Money,
  [enumInvoiceFields.supplier]?: Supplier,
  [enumInvoiceFields.poNumber]?: string,
  [enumInvoiceFields.details]?: string,
  [enumInvoiceFields.bookingPeriod]?: string,
  [enumInvoiceFields.poApprover]?: UserId,
}
