import { gql } from '@apollo/client'
import { PUBLISHED_REQUEST_DEFINITIONS_SOURCE_FIELDS } from './fragment'

export const PUBLISHED_REQUEST_DEFINITIONS = gql`
    query publishedRequestDefinitions($tenantId: String, $appType: AppType, $program: IDRefInput) {
        publishedRequestDefinitions(tenantId: $tenantId, appType: $appType, program: $program){
            ...PublishedRequestDefintionSourceFields
        }
    }
    ${PUBLISHED_REQUEST_DEFINITIONS_SOURCE_FIELDS}
`
