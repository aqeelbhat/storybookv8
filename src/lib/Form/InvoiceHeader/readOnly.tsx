import React, { useEffect, useState } from 'react'

import { IInvoiceHeaderReadOnly, InvoiceHeaderFormData, enumInvoiceFields } from './types';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import { mapCurrencyToSymbol } from '../../util';
import Grid from '@mui/material/Grid';
import { Label, Value, Title, Separator } from '../../controls/atoms';
import { CustomFieldType } from '../../CustomFormDefinition/types/CustomFormModel'
import { mapCustomFieldValue } from '../../CustomFormDefinition/View/ReadOnlyValues';
import { AttachmentReadOnly } from '../components/attachment-read-only.component';
import { Field } from '../types';
import { getFormFieldsMap, isFieldOmitted } from '../util';

export function InvoiceHeaderReadOnlyForm (props: IInvoiceHeaderReadOnly) {
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])

  const formData = props.formData || {} as InvoiceHeaderFormData;
  const invoice = props.formData?.invoiceAttachment || {}
  const invoiceName = invoice.filename || invoice.name || '-'

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadInvoice && fieldName) {
      return props.loadInvoice(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumInvoiceFields.invoiceNumber,
      enumInvoiceFields.invoiceDate,
      enumInvoiceFields.dueDate,
      enumInvoiceFields.subTotal,
      enumInvoiceFields.taxAmount,
      enumInvoiceFields.totalAmount,
      enumInvoiceFields.invoiceAttachment,
      enumInvoiceFields.currency,
      enumInvoiceFields.type
      ]
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
    }
  }, [props.fields])

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <Title>{t('--invoiceAttach--')}</Title>
        </Grid>
        <Grid item xs={6}>
          <AttachmentReadOnly
            attachment={invoice}
            onPreviewByURL={() => loadFile('invoiceAttachment', invoice.mediatype, invoiceName)}
          />
        </Grid>
        <Grid item xs={12}><Separator></Separator>
        </Grid>
        <Grid item xs={12}>
          <Title>{t('--basicInvoiceDetails--')}</Title>
        </Grid>
        {!isFieldOmitted(fieldMap, enumInvoiceFields.invoiceNumber) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--invoiceNumber--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>{mapCustomFieldValue({
                value: formData.invoiceNumber,
                fieldName: enumInvoiceFields.invoiceNumber,
                trackedAttributes: props.trackedAttributes,
                fieldType: CustomFieldType.string
              }) || '-'}</Value>
            </Grid>
          </>
        }
        {!isFieldOmitted(fieldMap, enumInvoiceFields.type) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--invoiceType--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>{!formData.type ? '-' : mapCustomFieldValue({
                value: formData.type.name || formData.type.id,
                fieldName: enumInvoiceFields.type,
                fieldValue: 'name',
                trackedAttributes: props.trackedAttributes,
                fieldType: CustomFieldType.string
              }) || '-'}</Value>
            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.invoiceDate) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--invoiceDate--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>{!formData.invoiceDate ? '-' : mapCustomFieldValue({
                value: formData.invoiceDate,
                fieldName: enumInvoiceFields.invoiceDate,
                trackedAttributes: props.trackedAttributes,
                fieldType: CustomFieldType.date
              }) || '-'}</Value>
            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.dueDate) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--invoiceDueDate--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>{!formData.dueDate ? '-' : mapCustomFieldValue({
                value: formData.dueDate,
                fieldName: enumInvoiceFields.dueDate,
                trackedAttributes: props.trackedAttributes,
                fieldType: CustomFieldType.date
              }) || '-'}</Value>
            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.description) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--invoiceDescription--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>{mapCustomFieldValue({
                value: formData.description,
                fieldName: enumInvoiceFields.description,
                trackedAttributes: props.trackedAttributes,
                fieldType: CustomFieldType.string
              })}</Value>
            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.currency) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--invoiceCurrency--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>{!formData.currency ? '-' : mapCustomFieldValue({
                value: formData.currency.name || formData.currency.id,
                fieldName: enumInvoiceFields.currency,
                fieldValue: 'name',
                trackedAttributes: props.trackedAttributes,
                fieldType: CustomFieldType.string
              }) || '-'}</Value>
            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.subTotal) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--subTotal--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value><>{!formData.subTotal ? '-' :
                mapCurrencyToSymbol(formData.subTotal.currency)}
                {!formData.subTotal ? '' : mapCustomFieldValue({
                  value: `${formData.subTotal?.amount}`,
                  fieldName: enumInvoiceFields.subTotal,
                  fieldValue: 'amount',
                  trackedAttributes: props.trackedAttributes,
                  fieldType: CustomFieldType.number
                }) || ''}</></Value>

            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.taxAmount) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--tax--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value><>
                {!formData.taxAmount ? '-'
                  : mapCurrencyToSymbol(formData.taxAmount.currency)}
                {!formData.taxAmount ? ''
                  : mapCustomFieldValue({
                    value: `${formData.taxAmount?.amount}`,
                    fieldValue: 'amount',
                    fieldName: enumInvoiceFields.taxAmount,
                    trackedAttributes: props.trackedAttributes,
                    fieldType: CustomFieldType.number
                  }) || ''}</></Value>

            </Grid>
          </>}
        {!isFieldOmitted(fieldMap, enumInvoiceFields.totalAmount) &&
          <>
            <Grid item xs={4}>
              <Label>{t('--totalAmount--')}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value><>
                {!formData.totalAmount ? '-'
                  : mapCurrencyToSymbol(formData.totalAmount.currency)}
                {!formData.totalAmount ? ''
                  : mapCustomFieldValue({
                    value: `${formData.totalAmount?.amount}`,
                    fieldName: enumInvoiceFields.totalAmount,
                    fieldValue: 'amount',
                    trackedAttributes: props.trackedAttributes,
                    fieldType: CustomFieldType.number
                  }) || ''}</></Value>
            </Grid>
          </>}
      </Grid>
    </>
  )
}
