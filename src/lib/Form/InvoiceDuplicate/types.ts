import { IDRef } from '../../Types'
import { Field } from '../types'

export interface InvoiceDuplicateFormProps {
  isReadOnly: boolean
  formData?: InvoiceDuplicateFormData
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: (formData: InvoiceDuplicateFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => InvoiceDuplicateFormData) => void
  onValueChange?: (fieldName: string, updatedForm: InvoiceDuplicateFormData) => void
  onCancelRequest?: () => void
  children: React.ReactElement
}

export enum InvoiceDuplicateFields {
  comment = "comment",
  duplicateInvoice = "duplicateInvoice"
}

export interface InvoiceDuplicateFormData {
  [InvoiceDuplicateFields.comment]: string,
  [InvoiceDuplicateFields.duplicateInvoice]?: IDRef
}
