
/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/

import { CustomFormData, CustomFormDefinition, LocalLabels } from ".."
import { ControlOptions, DataFetchers, Events } from "../NewView/FormView.component"
import { Attachment, ItemDetails, QuestionnaireId } from "../../Types"
import { DocumentRef } from "../../Form"

export interface ICustomFormV2ExtensionProps {
  customFormData?: CustomFormData
  questionnaireId?: QuestionnaireId
  options?: ControlOptions
  customFormDefinition?: CustomFormDefinition
  dataFetchers?: DataFetchers
  events?: Events
  locale: string
  localLabels?: LocalLabels
  readOnly?: boolean
  isEdit?: boolean
  isFormDataList?: boolean
  isItemContextFieldFound?: boolean
  currentLineItem?: ItemDetails
  inTableCell?: boolean
  handleFormValueChange?: (formData: CustomFormData | CustomFormData[], file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef, index?: number, fieldName?: string) => void
  onFilterApply?: (filter: Map<string, string[]>, formData: CustomFormData) => void
  onFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number) => void
  onFormDefinitionLoad?: (formId: string, formDefinition: CustomFormDefinition) => void
}