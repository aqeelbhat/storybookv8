import { IDRef, Option } from '../../Types'
import { Field } from '../types'

export interface ICategoryRecommFormPropsV2 {
  onlyLeafSelectable?: boolean
  isReadOnly: boolean
  isInPortal: boolean
  formData?: ICategoryRecommFormDataV2
  fields?: Field[]
  submitLabel?: string
  cancelLabel?: string
  categoryOptions?: Option[]
  hideDelete?: boolean
  hideTitle?: boolean
  hideRecommendBox?: boolean
  onSubmit?: (formData: ICategoryRecommFormDataV2) => void
  onCancel?: () => void
  onSearch?: (keyword?: string) => Promise<Option[]>
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  fetchCategory?: (categoryId: string) => Promise<Option | null>
  onReady?: (fetchData: (skipValidation?: boolean) => ICategoryRecommFormDataV2) => void
  onValueChange?: (fieldName: string, updatedForm: ICategoryRecommFormDataV2) => void
}

export enum enumFields {
  summary = "summary",
  categories = "categories",
  recommendation = "recommendation",
  categoryLeafOnly = 'categoryLeafOnly'
}
export interface ICategoryRecommendationV2 {
  codes: IDRef[]
  parents: IDRef[]
}
export interface IRecommendation {
  categoryRecommendation: ICategoryRecommendationV2
}

export interface ICategoryRecommFormDataV2 {
  [enumFields.summary]: string | null
  [enumFields.categories]: IDRef[] | null
  [enumFields.recommendation]: IRecommendation | null
}
