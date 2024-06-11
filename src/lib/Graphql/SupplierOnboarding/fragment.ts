import { gql } from '@apollo/client'

export const REQUEST_DEFINITION_SOURCE_FIELDS = gql`
    fragment RequestDefintionSourceFields on RequestDefintion {
        tenantId
        name
        requestName
        type
        shortDescription
        icon
    }
`

export const PUBLISHED_REQUEST_DEFINITIONS_SOURCE_FIELDS = gql`
    fragment PublishedRequestDefintionSourceFields on PublishedRequestDefintion {
        requestDefinition {
            ...RequestDefintionSourceFields
        }
    }
    ${REQUEST_DEFINITION_SOURCE_FIELDS}
`
