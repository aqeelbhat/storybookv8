import { Field, Option, getFormFieldConfig } from "../..";
import { getFieldConfigValue } from "../util";
import { enumSupplierEditFields, enumSupplierEditMethods } from "./types";

export function getCustomLabelFromConfig (fieldName: string, fields: Field[]) {
  return getFormFieldConfig(fieldName, fields)?.customLabel || ''
}

export function buildSupplierEditOptions (editOption: Option[], fieldMap:{ [key: string]: Field }): Option[] {
    const _editOptions = editOption?.filter(option => {
        return ((option.path === enumSupplierEditMethods.addOrUpdatePaymentDetails && getFieldConfigValue(fieldMap, enumSupplierEditFields.allowAddOrUpdatePaymentDetails))
               || (option.path === enumSupplierEditMethods.addPaymentTerms && getFieldConfigValue(fieldMap, enumSupplierEditFields.allowAddPaymentTerms))
               || (option.path === enumSupplierEditMethods.editOtherDetails && getFieldConfigValue(fieldMap, enumSupplierEditFields.allowEditOtherDetails)))
    })

    return _editOptions
}