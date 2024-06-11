import React, { useEffect, useRef, useState } from 'react'
import { InvoiceHeaderFormProps, enumInvoiceFields, InvoiceHeaderFormData } from './types';
import { Field } from '../types';
import type { Attachment, IDRef, Money, Option } from '../../Types'
import { ORODatePicker, TextBox, TypeAhead, Currency } from '../../Inputs';
import { areObjectsSame, getDateObject, getFormFieldsMap, getParsedDateForSubmit, isEmpty, isFieldDisabled, isFieldOmitted, isFieldRequired, isRequired, mapIDRefToOption, mapOptionToIDRef, mapStringToOption, recursiveDeepCopy, validateField, validateFieldV2 } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import { DEFAULT_CURRENCY } from '../../util';
import { getValueFromAmount } from '../../Inputs/utils.service';
import Grid from '@mui/material/Grid';
import Actions from '../../controls/actions';
import { InvoiceHeaderReadOnlyForm } from './readOnly'
import { Separator, Title } from '../../controls/atoms';
import { TextAreaControlNew } from '../../controls';
import styles from './styles.module.scss'
import { getSessionLocale } from '../../sessionStorage';

export function InvoiceHeaderForm (props: InvoiceHeaderFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState<string>('')
  const [invoiceDate, setInvoiceDate] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>()
  const [subTotal, setSubTotal] = useState<Money>({ amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY })
  const [taxAmount, setTaxAmount] = useState<Money>({ amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY })
  const [totalAmount, setTotalAmount] = useState<Money>({ amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY })
  const [invoiceAttachment, setInvoiceAttachment] = useState<Attachment | null>(null)
  const [description, setDescription] = useState<string>()
  const [invoiceCurrency, setInvoiceCurrency] = useState<Option | null>(mapStringToOption(props.defaultCurrency || DEFAULT_CURRENCY))
  const [invoiceType, setInvoiceType] = useState<Option | null>(null)

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})

  const [allowNegativeInvoice, setAllowNegativeInvoice] = useState(false)

  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): InvoiceHeaderFormData {
    return {
      invoiceAttachment,
      invoiceNumber,
      invoiceDate: getParsedDateForSubmit(invoiceDate),
      dueDate: getParsedDateForSubmit(dueDate),
      subTotal,
      taxAmount,
      totalAmount,
      currency: mapOptionToIDRef(invoiceCurrency),
      description,
      type: invoiceType ? mapOptionToIDRef(invoiceType) : null
    }
  }

  // For Deep Copy share with parent
  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | number | Money | IDRef | IDRef[]): InvoiceHeaderFormData {
    const formData = recursiveDeepCopy(getFormData()) as InvoiceHeaderFormData

    switch (fieldName) {
      case enumInvoiceFields.invoiceAttachment:
        formData[fieldName] = newValue as Attachment
        break
      case enumInvoiceFields.invoiceNumber:
      case enumInvoiceFields.invoiceDate:
      case enumInvoiceFields.dueDate:
        formData[fieldName] = newValue as string
        break
      case enumInvoiceFields.subTotal:
      case enumInvoiceFields.taxAmount:
      case enumInvoiceFields.totalAmount:
        formData[fieldName] = newValue as Money
        break
      case enumInvoiceFields.currency:
        formData[fieldName] = newValue as IDRef
        break
      case enumInvoiceFields.type:
        formData[fieldName] = newValue as IDRef
        break
    }
    return formData
  }

  // on Each Field Change
  function handleFieldValueChange (
    fieldName: string,
    oldValue: string | number | IDRef | Money | IDRef[],
    newValue: string | number | IDRef | Money | IDRef[]
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (typeof newValue === 'number' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function isTotalAmountValid (amount: number) {
    const subTotalAmount = subTotal.amount
    const tax = taxAmount.amount
    const totalAmount = amount
    return subTotalAmount + tax === totalAmount
  }
  function validateTotalAmount (label: string, amount: string) {
    const parseAmount = +getValueFromAmount(amount)

    const validation = validateFieldV2(fieldMap, enumInvoiceFields.totalAmount, label, amount)
    if (validation) {
      return validation;
    }
    const checkTotalAmount = !isFieldOmitted(fieldMap, enumInvoiceFields.totalAmount) &&
      !isFieldOmitted(fieldMap, enumInvoiceFields.subTotal) &&
      !isFieldOmitted(fieldMap, enumInvoiceFields.taxAmount)
    if (checkTotalAmount && !isTotalAmountValid(parseAmount)) {
      return t("--totalAmountMismatch--")
    }
    return ''
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    let invalidFound = Object.keys(fieldMap).some(fieldName => {

      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumInvoiceFields.invoiceNumber:
            invalidFieldId = fieldName
            return !invoiceNumber
          case enumInvoiceFields.invoiceDate:
            invalidFieldId = fieldName
            return !invoiceDate
          case enumInvoiceFields.dueDate:
            invalidFieldId = fieldName
            return !dueDate
          case enumInvoiceFields.currency:
            invalidFieldId = fieldName
            return !invoiceCurrency
          case enumInvoiceFields.type:
            invalidFieldId = fieldName
            return !invoiceType
          case enumInvoiceFields.description:
            invalidFieldId = fieldName
            return !description
          case enumInvoiceFields.subTotal:
            invalidFieldId = fieldName
            return isEmpty(subTotal.amount === 0 ? '0' : subTotal.amount)
          case enumInvoiceFields.taxAmount:
            invalidFieldId = fieldName
            return isEmpty(taxAmount.amount === 0 ? '0' : taxAmount.amount)
          case enumInvoiceFields.totalAmount:
            invalidFieldId = fieldName
            return isEmpty(totalAmount.amount === 0 ? '0' : totalAmount.amount)
        }
      }
    })
    // for values mismatch.
    if (!invalidFound) {
      const checkTotalAmount = !isFieldOmitted(fieldMap, enumInvoiceFields.totalAmount) &&
        !isFieldOmitted(fieldMap, enumInvoiceFields.subTotal) &&
        !isFieldOmitted(fieldMap, enumInvoiceFields.taxAmount)
      if (checkTotalAmount && !isTotalAmountValid(totalAmount.amount)) {
        invalidFound = true
        invalidFieldId = enumInvoiceFields.totalAmount
      }

    }
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()

    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // To get latest form fields data
  function fetchData (skipValidation?: boolean): InvoiceHeaderFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }

  useEffect(() => {
    const _currency = invoiceCurrency?.path
    if (_currency) {
      setSubTotal({ ...subTotal, currency: _currency })
      setTaxAmount({ ...taxAmount, currency: _currency })
      setTotalAmount({ ...totalAmount, currency: _currency })
    }
  }, [invoiceCurrency])

  function handleCurrencyChange (Setter: React.Dispatch<React.SetStateAction<Money>>, fieldName: string, OldValue: Money, newValue: Money) {
    Setter(newValue)
    handleFieldValueChange(fieldName, OldValue, newValue)
  }

  function renderBasicDetails () {
    return <Grid container spacing={2} mb={2}>
      <Grid item xs={12}>
        <Title>{t('--basicInvoiceDetails--')}</Title>
      </Grid>

      {!isFieldOmitted(fieldMap, enumInvoiceFields.invoiceNumber) &&
        <Grid item xs={12} md={!isFieldOmitted(fieldMap, enumInvoiceFields.type) ? 6 : 12}>
          <div data-testid="invoice-number-field" ref={(node) => { storeRef(enumInvoiceFields.invoiceNumber, node) }} >
            <TextBox
              label={t('--invoiceNumber--')}
              placeholder={t('--enterInvoiceNumber--')}
              value={invoiceNumber}
              disabled={isFieldDisabled(fieldMap, enumInvoiceFields.invoiceNumber)}
              required={isFieldRequired(fieldMap, enumInvoiceFields.invoiceNumber)}
              forceValidate={forceValidate}
              validator={(value) => validateFieldV2(fieldMap, enumInvoiceFields.invoiceNumber, t('--invoiceNumber--'), value)}
              onChange={value => { setInvoiceNumber(value); handleFieldValueChange(enumInvoiceFields.invoiceNumber, invoiceNumber, value); }}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumInvoiceFields.type) &&
        <Grid item xs={12} md={!isFieldOmitted(fieldMap, enumInvoiceFields.invoiceNumber) ? 6 : 12}>
          <div data-testid="invoice-type-field" ref={(node) => { storeRef(enumInvoiceFields.type, node) }} >
            <TypeAhead
              label={t('--invoiceType--')}
              placeholder={t('--selectType--')}
              value={invoiceType}
              options={props.typeOptions}
              disabled={isFieldDisabled(fieldMap, enumInvoiceFields.type)}
              required={isFieldRequired(fieldMap, enumInvoiceFields.type)}
              forceValidate={forceValidate}
              validator={(value) => validateField(t('--invoiceType--'), value)}
              onChange={(value: Option) => {
                setInvoiceType(value)
                handleFieldValueChange(enumInvoiceFields.type, mapOptionToIDRef(invoiceType), value ? mapOptionToIDRef(value) : null)
              }}
              hideClearButton={true}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumInvoiceFields.invoiceDate) &&
        <Grid item xs={12} md={6}>
          <div data-testid="invoice-date-field" ref={(node) => storeRef(enumInvoiceFields.invoiceDate, node)} >
            <ORODatePicker
              forceValidate={forceValidate}
              label={t('--invoiceDate--')}
              placeholder={t('--selectInvoiceDate--')}
              value={getDateObject(invoiceDate)}
              disabled={isFieldDisabled(fieldMap, enumInvoiceFields.invoiceDate)}
              required={isFieldRequired(fieldMap, enumInvoiceFields.invoiceDate)}
              validator={(date: string) => validateFieldV2(fieldMap, enumInvoiceFields.invoiceDate, t('--invoiceDate--'), date)}
              onChange={(date: string) => { setInvoiceDate(date); handleFieldValueChange(enumInvoiceFields.invoiceDate, invoiceDate, date); }}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumInvoiceFields.dueDate) &&
        <Grid item xs={12} md={6} >
          <div data-testid="due-date-field" ref={(node) => { storeRef(enumInvoiceFields.dueDate, node) }} >
            <ORODatePicker
              forceValidate={forceValidate}
              label={t('--invoiceDueDate--')}
              placeholder={t('--selectDueDate--')}
              value={getDateObject(dueDate)}
              disabled={isFieldDisabled(fieldMap, enumInvoiceFields.dueDate)}
              required={isFieldRequired(fieldMap, enumInvoiceFields.dueDate)}
              validator={(date: string) => validateFieldV2(fieldMap, enumInvoiceFields.dueDate, t('--invoiceDueDate--'), date)}
              onChange={(date: string) => { setDueDate(date); handleFieldValueChange(enumInvoiceFields.dueDate, dueDate, date); }}
            />
          </div>
        </Grid>}
      {!isFieldOmitted(fieldMap, enumInvoiceFields.description) &&
        <Grid item xs={12} data-testid="description-field" ref={(node) => { storeRef(enumInvoiceFields.description, node) }} >
          <div className={styles.label}  > {t('--invoiceDescription--')}</div>
          <TextAreaControlNew
            value={description || ''}
            placeholder={t('--startType--')}
            config={{
              optional: !isFieldRequired(fieldMap, enumInvoiceFields.description),
              forceValidate: forceValidate
            }}
            disabled={isFieldDisabled(fieldMap, enumInvoiceFields.description)}
            onChange={(value) => {
              setDescription(value || '')
              handleFieldValueChange(enumInvoiceFields.description, description, value)
            }}
            validator={value => validateFieldV2(fieldMap, enumInvoiceFields.description, t('--invoiceDescription--'), value)}
          ></TextAreaControlNew>
        </Grid>}
    </Grid>
  }
  function renderInvoiceCurrency () {
    return !isFieldOmitted(fieldMap, enumInvoiceFields.currency) ?
      <Grid container spacing={2} pb={2}>
        <Grid item md={6} xs={12}>
          <div data-testid="curr-field" ref={(node) => { storeRef(enumInvoiceFields.currency, node) }} >
            <TypeAhead
              label={t('--invoiceCurrency--')}
              placeholder={t('--selectCurrency--')}
              value={invoiceCurrency}
              options={props.currencyOptions}
              disabled={isFieldDisabled(fieldMap, enumInvoiceFields.currency)}
              required={isFieldRequired(fieldMap, enumInvoiceFields.currency)}
              forceValidate={forceValidate}
              validator={(value) => validateField(t('--invoiceCurrency--'), value)}
              onChange={(value: Option) => {
                setInvoiceCurrency(value)
                handleFieldValueChange(enumInvoiceFields.currency, mapOptionToIDRef(invoiceCurrency), mapOptionToIDRef(value))
              }}
              hideClearButton={true}
            />
          </div>
        </Grid>
      </Grid>
      : null
  }
  function renderAmountDetails () {
    const currencyItem = renderInvoiceCurrency()
    const showSubTotal = !isFieldOmitted(fieldMap, enumInvoiceFields.subTotal)
    const showtaxAmount = !isFieldOmitted(fieldMap, enumInvoiceFields.taxAmount)
    const showtotalAmount = !isFieldOmitted(fieldMap, enumInvoiceFields.totalAmount)
    const showSeparator = currencyItem || showSubTotal || showtaxAmount || showtotalAmount ? true : false
    return <>{showSeparator && <Grid container >
      <Grid item xs={12} >
        <Separator />
      </Grid>
    </Grid>}{currencyItem}<Grid container spacing={2} mb={2}>
        {showSubTotal &&
          <Grid item xs={12} md={6}>
            <div data-testid="subTotal-field" ref={(node) => { storeRef(enumInvoiceFields.subTotal, node) }} >
              <Currency
                allowNegative={allowNegativeInvoice}
                locale={getSessionLocale()}
                forceValidate={forceValidate}
                label={t('--subTotal--')}
                unit={subTotal.currency}
                value={subTotal.amount.toLocaleString(getSessionLocale())}
                unitOptions={props.currencyOptions}
                disableUnit
                disabled={isFieldDisabled(fieldMap, enumInvoiceFields.subTotal)}
                required={isFieldRequired(fieldMap, enumInvoiceFields.subTotal)}
                validator={(amount: string) => validateFieldV2(fieldMap, enumInvoiceFields.subTotal, t('--subTotal--'), amount)}
                onChange={(amount: string) =>
                  handleCurrencyChange(setSubTotal, enumInvoiceFields.subTotal, subTotal, { ...subTotal, amount: +getValueFromAmount(amount) })
                }
                onUnitChange={(currency: string) =>
                  handleCurrencyChange(setSubTotal, enumInvoiceFields.subTotal, subTotal, { ...subTotal, currency })
                }
              />
            </div>
          </Grid>}
        {showtaxAmount &&
          <Grid item xs={12} md={6}>
            <div data-testid="tax-amount-field" ref={(node) => { storeRef(enumInvoiceFields.taxAmount, node) }} >
              <Currency
                locale={getSessionLocale()}
                forceValidate={forceValidate}
                allowNegative={allowNegativeInvoice}
                label={t('--tax--')}
                unit={taxAmount.currency}
                value={taxAmount.amount.toLocaleString(getSessionLocale())}
                unitOptions={props.currencyOptions}
                disableUnit
                disabled={isFieldDisabled(fieldMap, enumInvoiceFields.taxAmount)}
                required={isFieldRequired(fieldMap, enumInvoiceFields.taxAmount)}
                validator={(amount: string) => validateFieldV2(fieldMap, enumInvoiceFields.taxAmount, t('--tax--'), amount)}
                onChange={(amount: string) =>
                  handleCurrencyChange(setTaxAmount, enumInvoiceFields.taxAmount, taxAmount, { ...taxAmount, amount: +getValueFromAmount(amount) })
                }
                onUnitChange={(currency: string) =>
                  handleCurrencyChange(setTaxAmount, enumInvoiceFields.taxAmount, taxAmount, { ...taxAmount, currency })
                }
              />
            </div>
          </Grid>}
        {showtotalAmount &&
          <Grid item xs={12} md={6} >
            <div data-testid="total-amount-field" ref={(node) => { storeRef(enumInvoiceFields.totalAmount, node) }} >
              <Currency
                allowNegative={allowNegativeInvoice}
                locale={getSessionLocale()}
                forceValidate={forceValidate}
                label={t('--totalAmount--')}
                unit={totalAmount.currency}
                value={totalAmount.amount.toLocaleString(getSessionLocale())}
                unitOptions={props.currencyOptions}
                disableUnit
                disabled={isFieldDisabled(fieldMap, enumInvoiceFields.totalAmount)}
                required={isFieldRequired(fieldMap, enumInvoiceFields.totalAmount)}
                validator={(amount: string) => validateTotalAmount(t('--totalAmount--'), amount)}
                onChange={(amount: string) =>
                  handleCurrencyChange(setTotalAmount, enumInvoiceFields.totalAmount, totalAmount, { ...totalAmount, amount: +getValueFromAmount(amount) })
                }
                onUnitChange={(currency: string) =>
                  handleCurrencyChange(setTotalAmount, enumInvoiceFields.totalAmount, totalAmount, { ...totalAmount, currency })
                }
              />
            </div>
          </Grid>}

      </Grid></>
  }

  // to fill field values
  useEffect(() => {
    if (props.formData) {
      setInvoiceAttachment(props.formData.invoiceAttachment)
      setInvoiceNumber(props.formData.invoiceNumber)
      setInvoiceDate(props.formData.invoiceDate)
      setDueDate(props.formData.dueDate)
      setDescription(props.formData.description || '')
      if (props.formData.subTotal) {
        setSubTotal(props.formData.subTotal)
      }
      if (props.formData.taxAmount) {
        setTaxAmount(props.formData.taxAmount)
      }
      if (props.formData.totalAmount) {
        setTotalAmount(props.formData.totalAmount)
      }
      if (props.formData.currency) {
        setInvoiceCurrency(mapIDRefToOption(props.formData.currency))
      } else {
        setInvoiceCurrency(mapStringToOption(props.defaultCurrency || DEFAULT_CURRENCY))
      }
      setInvoiceType(props.formData.type ? mapIDRefToOption(props.formData.type) : null)
    }
  }, [props.formData])

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

      // set allow negative Indicator
      const allowNegativeField = props.fields.find((field) => field.fieldName === enumInvoiceFields.allowNegative)
      setAllowNegativeInvoice(allowNegativeField?.booleanValue || false)
    }
  }, [props.fields])

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    fieldMap, invoiceNumber, invoiceDate,
    dueDate, taxAmount, totalAmount,
    subTotal, invoiceCurrency, invoiceAttachment,
    description, invoiceType
  ])

  return (
    <>
      {renderBasicDetails()}
      {renderAmountDetails()}
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}

export { InvoiceHeaderReadOnlyForm }
