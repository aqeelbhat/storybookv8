import { CustomFormType } from "../CustomFormDefinition";
import { Money, UserId } from "./common";
import { ProcessVariables } from "./request";

export interface Questionnaire {
  tenantId: string
  id: string
  vendorId: string
  name: string
  formId: string
  formDocumentId: string
  hasError: boolean
  captured: boolean
  completed: boolean
  custom: boolean
  attachmentPaths: string[]
  processVariables: ProcessVariables
  supplierInfoFinalized: boolean
  customFormType?: CustomFormType
  data: any
  moneyInTenantCurrency?: Money | null
  trackedAttributes: any
  updated: string
  updatedBy: UserId
}

export interface QuestionnaireId {
  id?: string
  name: string
  formId: string
  custom?: boolean
  checked?: boolean
  removable?: boolean
  formDocumentId?: string
  editMode?: boolean
  completed?: boolean
  formType?: CustomFormType
}
