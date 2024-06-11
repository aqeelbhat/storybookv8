

import { IDRef, UserId, Option } from '../../Types'
import { Field } from '../types'

export interface ICategoryRecommFormProps {
  isReadOnly: boolean
  isInPortal: boolean
  formData?: ICategoryRecommFormData
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  categoryOptions?: Option[]
  onSubmit?: (formData: ICategoryRecommFormData) => void
  onCancel?: () => void
  onSearch?: (keyword?: string) => Promise<Option[]>
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onReady?: (fetchData: (skipValidation?: boolean) => ICategoryRecommFormData) => void
  onValueChange?: (fieldName: string, updatedForm: ICategoryRecommFormData) => void
  onGetCodesHierarchy?: (codes:string[]) => Promise<Option[]>
}

export enum enumFields {
  categories = "categories",
  summary = "summary",
  summaryUpdatedBy = "summaryUpdatedBy",
  recommendation = "recommendation",
  categoryLeafOnly = "categoryLeafOnly"
}
export interface ICategoryRecommendation {
  codes: IDRef[]
  parents: IDRef[]
}
export interface IRecommendation {
  categoryRecommendation: ICategoryRecommendation
}

export interface ICategoryRecommFormData {
  [enumFields.categories]: IDRef[] | null
  [enumFields.summary]: string | null
  [enumFields.summaryUpdatedBy]: UserId | null
  [enumFields.recommendation]: IRecommendation | null
}
