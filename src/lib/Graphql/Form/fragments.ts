import { gql } from '@apollo/client'

export const FORM_FIELD = gql`
  fragment FormFieldFragment on FormField {
    fieldName
    requirement
    booleanValue
    stringValue
    intValue
    title
    customLabel
  }
`

export const FORM_CONFIGURATION = gql`
  fragment FormConfigurationFragment on FieldsConfigurator {
    name
    formName
    orderedFields {
      ...FormFieldFragment
    }
  }
  ${FORM_FIELD}
`
