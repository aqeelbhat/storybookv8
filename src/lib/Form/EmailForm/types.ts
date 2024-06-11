import { Attachment } from '../../Types';
import { Field } from '../types'

export enum enumEmailFields {
  from = 'from',
  subject = 'subject',
  body = 'body',
  message = 'message',
  attachments = 'attachments'
}

export interface EmailFormComponentData {
  [enumEmailFields.from]: string | null
  [enumEmailFields.subject]: string | null
  [enumEmailFields.body]: string | null
  [enumEmailFields.attachments]: Attachment[] | null
}

export interface EmailFormComponentProps {
  formData?: EmailFormComponentData
  isReadOnly: boolean
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  loadFile?: (fieldName: string, type?: string | undefined, fileName?: string | undefined) => Promise<Blob | string>
  onSubmit?: (formData: EmailFormComponentData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => EmailFormComponentData) => void
  onValueChange?: (fieldName: string, updatedForm: EmailFormComponentData) => void
}
