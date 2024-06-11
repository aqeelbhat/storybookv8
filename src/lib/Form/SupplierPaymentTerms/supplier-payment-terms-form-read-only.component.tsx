import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { Label, Value } from '../../controls/atoms';
import { SupplierEditPaymentTermFormData, SupplierEditPaymentTermReadOnlyProps, enumSupplierEditPaymentFields } from "./types"
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { Field } from "../..";
import { getFormFieldsMap } from "../util";
import { getCustomLabelFromConfig } from "../SupplierEditOption/util";

export function SupplierEditPaymentTermFormReadOnly (props: SupplierEditPaymentTermReadOnlyProps) {
    const [formData, setFormData] = useState<SupplierEditPaymentTermFormData>()
    const [fieldMap, setFieldMap] = useState<Record<string, Field>>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERPAYMENTTERM])

    useEffect(() => {
        if (props.fields) {
          const fieldList = [enumSupplierEditPaymentFields.paymentTerm]
          setFieldMap(getFormFieldsMap(props.fields, fieldList))
        }
    }, [props.fields])

    useEffect(() => {
      props.formData && setFormData(props.formData)
    }, [props.formData])

    return (
        <Grid container spacing={2} mb={2}>
          <Grid item xs={4}>
            <Label>{getCustomLabelFromConfig(enumSupplierEditPaymentFields.paymentTerm, props.fields) || t('--paymentTerms--')}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>{formData?.paymentTerm?.displayName || '-'}</Value>
          </Grid>
        </Grid>
    )
}