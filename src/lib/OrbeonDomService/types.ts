export interface Control {
  id: string
  type: string
  label: string
  value: string
}

export interface TR {
  td: Array<Control>
}

export interface Grid {
  tr: Array<TR>
}

export interface Section {
  title: string
  grids: Array<Grid>
}

export interface Form {
  title: string
  sections: Array<Section>
}

export interface CheckControlValue {
  label: string,
  isSelected: boolean
}

export interface RadioControlWithOtherValue {
  radioValues: Array<CheckControlValue>
  otherValue: string
}

export interface FormAttachment {
  name: string
  size: string
  path: string
}
