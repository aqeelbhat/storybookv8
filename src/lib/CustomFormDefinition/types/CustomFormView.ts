import { CustomFieldCondition, CustomFormField, Layout } from './CustomFormModel'

export interface CustomFieldView {
  id: string
  // use bootstrap grid system 12
  size: number
  field: CustomFormField
}

export interface Grid {
  id: number
  displayIndex: string
  fields: Array<CustomFieldView>
}

export interface Section {
  id: string
  title: string
  description: string
  displayIndex: string
  grids: Array<Grid>
  visible: CustomFieldCondition
  layout: Layout
}

export interface CustomFormView {
  sections: Array<Section>
}
