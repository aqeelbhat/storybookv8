import { gql } from '@apollo/client'

export const USER_ID_SOURCE_FIELDS = gql`
  fragment UserIdSourceFields on UserId {
    tenantId
    userName
    firstName
    lastName
    name
    department
    email
  }
`

export const GROUP_ID_SOURCE_FIELDS = gql`
  fragment GroupIdSourceFields on GroupId {
    groupId
    groupName
  }
`

export const MONEY_SOURCE_FIELDS = gql`
  fragment MoneySourceFields on MoneyObject {
    currency
    amount
  }
`
export const ID_REF_SOURCE_FIELDS = gql`
  fragment IDRefSourceFields on IDRef {
    id
    name
    erpId
    refId
  }
`

export const PO_REF_SOURCE_FIELDS = gql`
  fragment PRRefSourceFields on PORef {
    id
    poNumber
    cost
    currencyCode
    syncFrom {
      ...IDRefSourceFields
    }
  }
  ${ID_REF_SOURCE_FIELDS}
`

export const ATTACHMENT_SOURCE_FIELDS = gql`
  fragment AttachmentSourceFields on Attachment {
    filename
    mediatype
    path
  }
`

export const FORM_GLOBAL_VALUE = gql`
  fragment FormGlobalValue on FormGlobalVal {
    name
    reportName
    displayValue
  }
`

export const VENDOR_REF = gql`
  fragment VendorRefSourceFields on VendorRef {
    id
    vendorId
    enabled
    paymentTerm {
      ...IDRefSourceFields
    }
  }
  ${ID_REF_SOURCE_FIELDS}
`

export const IMAGE_METADATA_SOURCE_FIELDS = gql`
  fragment ImageMetadataSourceFields on ImageMetadata {
    path
    height
    width
  }
`

export const IMAGE_SOURCE_FIELDS = gql`
  fragment ImageSourceFields on Image {
    metadata {
      ...ImageMetadataSourceFields
    }
  }
  ${IMAGE_METADATA_SOURCE_FIELDS}
`

export const ORG_ID_SOURCE_FIELDS = gql`
  fragment OrgIdSourceFields on OrgId {
    id
    orgType
    name
    countryCode
    legalEntityId
    legalEntityLogo {
      ...ImageSourceFields
    }
  }
  ${IMAGE_SOURCE_FIELDS}
`

export const CONTACT_SOURCE_FIELDS = gql`
  fragment ContactSourceFields on Contact {
    fullName 
    firstName 
    lastName 
    email 
    phone 
    role 
    note
    imageUrl
  }
`

export const NORMALIZED_VENDOR_REF_SOURCE_FIELDS = gql`
  fragment NormalizedVendorRefSourceFields on NormalizedVendorRef {
    id
    vendorRecordId
    name
    countryCode
    legalEntityId
    legalEntityLogo {
      ...ImageSourceFields
    }
    selectedVendorRecord {
      ...VendorRefSourceFields
    }
    contact {
      ...ContactSourceFields
    }
    activationStatus
    isIndividual
    members {
      ...ContactSourceFields
    }
  }
  ${IMAGE_SOURCE_FIELDS}
  ${VENDOR_REF}
  ${CONTACT_SOURCE_FIELDS}
`