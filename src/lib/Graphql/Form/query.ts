import { gql } from '@apollo/client'
import { FORM_CONFIGURATION } from './fragments'

export const GET_OROFORM_CONFIGURATION = gql`
  query oroformConfiguration($tenantId: String, $form: String, $processType: String, $releaseVersion: Long) {
    oroformConfiguration(tenantId: $tenantId, form: $form, processType: $processType, releaseVersion: $releaseVersion) {
      ...FormConfigurationFragment
    }
  }
  ${FORM_CONFIGURATION}
`
