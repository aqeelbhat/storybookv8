import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { SupplierEditOptionFormData, SupplierEditOptionReadOnlyProps, enumSupplierEditFields, enumSupplierEditMethods } from "./types";
import { Label, Value } from '../../controls/atoms';
import { AttachmentReadOnly, CustomFieldType, Field } from "../..";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { getFormFieldsMap, isFieldOmitted } from "../util";
import { mapCustomFieldValue } from "../../CustomFormDefinition/View/ReadOnlyValues";
import { getCustomLabelFromConfig } from "./util";

export function SupplierEditOptionFormReadOnly (props: SupplierEditOptionReadOnlyProps) {
    const [formData, setFormData] = useState<SupplierEditOptionFormData>()
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIEREDITOPTION])

    useEffect(() => {
        if (props.fields) {
          const fieldList = [enumSupplierEditFields.allowAddOrUpdatePaymentDetails, enumSupplierEditFields.allowAddPaymentTerms,
            enumSupplierEditFields.allowEditOtherDetails, enumSupplierEditFields.attachments, enumSupplierEditFields.otherDetailsToUpdate,
            enumSupplierEditFields.reasonForUpdate, enumSupplierEditFields.editMethods]
          setFieldMap(getFormFieldsMap(props.fields, fieldList))
        }
    }, [props.fields])

    useEffect(() => {
      props.formData && setFormData(props.formData)
    }, [props.formData])

    function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
        if (props.loadDocument && fieldName) {
          return props.loadDocument(fieldName, type, fileName)
        } else {
          return Promise.reject()
        }
    }

    function canShowOtherDetailsReason () {
      return !isFieldOmitted(fieldMap, enumSupplierEditFields.otherDetailsToUpdate) && formData?.editMethods?.some(option => option.path === enumSupplierEditMethods.editOtherDetails)
    }

    return (
      <>
        <Grid container spacing={2} mb={2}>
          {!isFieldOmitted(fieldMap, enumSupplierEditFields.editMethods) &&
            <>
              <Grid item xs={4}>
                <Label>{getCustomLabelFromConfig(enumSupplierEditFields.editMethods, props.fields) || t('--selectedOption--')}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>{mapCustomFieldValue({
                  value: formData?.editMethods?.map(option => option.displayName),
                  fieldName: enumSupplierEditFields.editMethods
                }) || '-'}</Value>
              </Grid>
            </>
          }
          {canShowOtherDetailsReason() &&
            <>
              <Grid item xs={4}>
                <Label>{getCustomLabelFromConfig(enumSupplierEditFields.otherDetailsToUpdate, props.fields) || t('--otherDetails--')}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>{mapCustomFieldValue({
                  value: formData?.otherDetailsToUpdate,
                  fieldName: enumSupplierEditFields.otherDetailsToUpdate,
                  fieldType: CustomFieldType.string 
                }) || '-'}</Value>
              </Grid>
            </>
          }
          {!isFieldOmitted(fieldMap, enumSupplierEditFields.reasonForUpdate) &&
            <>
              <Grid item xs={4}>
                <Label>{getCustomLabelFromConfig(enumSupplierEditFields.reasonForUpdate, props.fields) || t('--updateReason--')}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>{mapCustomFieldValue({
                  value: formData?.reasonForUpdate,
                  fieldName: enumSupplierEditFields.reasonForUpdate,
                  fieldType: CustomFieldType.string 
                }) || '-'}</Value>
              </Grid>
            </>
          }
          {!isFieldOmitted(fieldMap, enumSupplierEditFields.attachments) && formData?.attachments?.length > 0 &&
            <>
              <Grid item xs={4}>
                <Label>{getCustomLabelFromConfig(enumSupplierEditFields.attachments, props.fields) || t('--attachments--')}</Label>
              </Grid>
              {formData?.attachments?.map((doc, i) => 
                <Grid item xs={6} key={i}>
                  <AttachmentReadOnly
                    attachment={doc}
                    onPreviewByURL={() => loadFile(`attachments[${i}]`, doc.mediatype, doc.filename)}
                  />
                </Grid>
              )}
            </>
          }
        </Grid>
      </>
    )
}