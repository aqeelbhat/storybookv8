import { Attachment } from "../../Types"
import { Field } from "../types"

export interface IEmailAttachmentFormProps {
  isReadOnly?: boolean
  useBookingPeriod?: boolean
  defaultCurrency?: string
  formData?: InvoiceEmailAttachmentsFormData
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  loadInvoice?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob>
  onSubmit?: (formData: InvoiceEmailAttachmentsFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => InvoiceEmailAttachmentsFormData | null) => void
  onValueChange?: (fieldName: string, updatedForm: InvoiceEmailAttachmentsFormData) => void
}

/* eslint-disable */
export enum enumFields {
  selectedAttachmentIndex = 'selectedAttachmentIndex',
  attachments = 'attachments'
}

export interface InvoiceEmailAttachmentsFormData {
  [enumFields.selectedAttachmentIndex]: number
  [enumFields.attachments]: Attachment[]
}

export type BlobDetails = {
  blob: Blob
  name: string
  type: string
}
