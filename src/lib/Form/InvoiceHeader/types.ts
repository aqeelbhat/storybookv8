
import { DataFetchers, Events } from '../../CustomFormDefinition/NewView/FormView.component'
import { Option, Money, IDRef, Attachment } from '../../Types'
import { Field, TrackedAttributes } from '../types'

export interface InvoiceHeaderFormProps {
  defaultCurrency?: string
  formData?: InvoiceHeaderFormData
  fields?: Field[]
  currencyOptions?: Option[]
  typeOptions?: Option[]
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: (formData: InvoiceHeaderFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => InvoiceHeaderFormData) => void
  onValueChange?: (fieldName: string, updatedForm: InvoiceHeaderFormData) => void
}

export enum enumInvoiceFields {
  invoiceNumber = "invoiceNumber",
  invoiceDate = "invoiceDate",
  dueDate = "dueDate",
  subTotal = "subTotal",
  taxAmount = "taxAmount",
  totalAmount = "totalAmount",
  poRefs = "poRefs",
  currency = "currency",
  invoiceAttachment = 'invoiceAttachment',
  description = 'description',
  type = "type",
  allowNegative = "allowNegative"
}

export interface InvoiceHeaderFormData {
  [enumInvoiceFields.invoiceNumber]: string,
  [enumInvoiceFields.invoiceDate]: string
  [enumInvoiceFields.dueDate]: string,
  [enumInvoiceFields.subTotal]?: Money,
  [enumInvoiceFields.taxAmount]?: Money,
  [enumInvoiceFields.totalAmount]?: Money,
  [enumInvoiceFields.currency]?: IDRef,
  [enumInvoiceFields.invoiceAttachment]: Attachment | null,
  [enumInvoiceFields.description]: string
  [enumInvoiceFields.type]?: IDRef
}


export interface IMultiPOSelectorProps {
  poRefs: IDRef[]
  onPOChange: (newRefs: IDRef[]) => void
  departmentOptions?: Option[]
  dataFetchers?: DataFetchers,
  events?: Events
  forceValidate: boolean
}

export interface IInvoiceHeaderReadOnly {
  formData?: InvoiceHeaderFormData,
  dataFetchers?: DataFetchers,
  trackedAttributes?: TrackedAttributes,
  fields?: Field[],
  loadInvoice?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob | string>
}
