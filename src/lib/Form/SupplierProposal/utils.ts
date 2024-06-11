import { Attachment } from "../../Types"
import { Field } from "../types"
import { getFormFieldsMap, isFieldOmitted, isFieldRequired } from "../util"
import { COUNTRY, DELIVERY_DATE, DESCRIPTION, PAYMENT_TERM, PAYMENT_TERM_FILTER_BY_REGION, PAYMENT_TERM_FILTER_TAG, SUPPLIER_LEGAL_NAME, SUPPLIER_PROPOSAL, SupplierProposalData, TOTAL_AMOUNT } from "./types"

const fieldList = [
  SUPPLIER_PROPOSAL,
  SUPPLIER_LEGAL_NAME,
  DESCRIPTION,
  DELIVERY_DATE,
  TOTAL_AMOUNT,
  COUNTRY,
  PAYMENT_TERM
]

export function getFieldMap (fields: Field[]): { [key: string]: Field } {
  return getFormFieldsMap(fields, fieldList)
}

export function getInvalidFormFieldId (fields: Field[], data?: SupplierProposalData): string {
  const fieldMap = getFieldMap(fields)
  let invalidFieldId = ''

  // validate fields based on config
  const isInvalid = Object.keys(fieldMap).some(fieldName => {
    if (!isFieldOmitted(fieldMap, fieldName) && isFieldRequired(fieldMap, fieldName)) {
      switch (fieldName) {
        // case SUPPLIER_PROPOSAL:
        //   invalidFieldId = fieldName
        //   return !(supplierProposal as Attachment)?.filename && !(supplierProposal as File)?.name
        case SUPPLIER_LEGAL_NAME:
          invalidFieldId = fieldName
          return !data?.supplierLegalName
        case DESCRIPTION:
          invalidFieldId = fieldName
          return !data?.description
        case DELIVERY_DATE:
          invalidFieldId = fieldName
          return !data?.deliveryDate
        case TOTAL_AMOUNT:
          invalidFieldId = fieldName
          return !data?.totalAmount?.amount || !data?.totalAmount?.currency
        case COUNTRY:
          invalidFieldId = fieldName
          return !data?.country
        case PAYMENT_TERM:
          invalidFieldId = fieldName
          return !data?.paymentTerm?.path
      }
    }
    return false
  })

  return isInvalid ? invalidFieldId : ''
}
