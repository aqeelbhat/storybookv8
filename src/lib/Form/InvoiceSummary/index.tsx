import React, { useEffect, useRef, useState } from 'react'
import { InvoiceSummaryFormProps, enumInvoiceFields, InvoiceSummaryFormData } from './types';
import { Field } from '../types';
import { IDRef, Money, Supplier, User, UserId, mapUser, mapUserId } from '../../Types'
import { areObjectsSame, getDateObject, getFormFieldsMap, getLocalDateString, getParsedDateForSubmit, getSupplierLogoUrl, isFieldDisabled, isFieldOmitted, isFieldRequired, isRequired, recursiveDeepCopy, validateFieldV2 } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import { DEFAULT_CURRENCY, getFormattedValue } from '../../util';
import Grid from '@mui/material/Grid';
import Actions from '../../controls/actions';
import { Separator, Value } from '../../controls/atoms';
import styles from './styles.module.scss'
import { DateControlNew, TextAreaControlNew, UserIdControlNew } from '../../controls';

export function InvoiceSummaryForm (props: InvoiceSummaryFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState<string>('')
  const [invoiceDate, setInvoiceDate] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>()
  const [totalAmount, setTotalAmount] = useState<Money>({ amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY })
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [poNumber, setPoNumber] = useState<string>('')
  const [details, setDetails] = useState<string>('')
  const [bookingPeriod, setBookingPeriod] = useState<string>('')
  const [poApprover, setPoApprover] = useState<User>(null)

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})

  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])

  const logoURL = getSupplierLogoUrl(supplier?.legalEntity)
  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): InvoiceSummaryFormData {
    const newData = {
      invoiceNumber,
      invoiceDate: getParsedDateForSubmit(invoiceDate),
      dueDate: getParsedDateForSubmit(dueDate),
      totalAmount,
      supplier,
      poNumber,
      details,
      poApprover: poApprover ? mapUserId(poApprover) : undefined
    }
    if (props.useBookingPeriod) {
      newData[enumInvoiceFields.bookingPeriod] = bookingPeriod
    }
    return newData;
  }

  // For Deep Copy share with parent
  function getFormDataWithUpdatedValue (fieldName: string, newValue: Date | string | number | Money | Supplier | IDRef[] | User): InvoiceSummaryFormData {
    const formData = recursiveDeepCopy(getFormData()) as InvoiceSummaryFormData

    switch (fieldName) {
      case enumInvoiceFields.invoiceNumber:
      case enumInvoiceFields.invoiceDate:
      case enumInvoiceFields.dueDate:
      case enumInvoiceFields.details:
      case enumInvoiceFields.poNumber:
      case enumInvoiceFields.bookingPeriod:
        formData[fieldName] = newValue as string
        break
      case enumInvoiceFields.totalAmount:
        formData[fieldName] = newValue as Money
        break;
      case enumInvoiceFields.supplier:
        formData[fieldName] = newValue as Supplier
        break
      case enumInvoiceFields.poApprover:
        formData[fieldName] = newValue ? mapUserId(newValue as User) : undefined
        break
    }
    return formData
  }

  // on Each Field Change
  function handleFieldValueChange (
    fieldName: string,
    oldValue: string | number | Supplier | Money,
    newValue: string | number | Supplier | Money
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

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {
      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumInvoiceFields.details:
            invalidFieldId = fieldName
            return !details
          case enumInvoiceFields.bookingPeriod:
            invalidFieldId = fieldName
            return !bookingPeriod
          case enumInvoiceFields.poApprover:
            invalidFieldId = fieldName
            return !poApprover
        }
      }
    })
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
  function fetchData (skipValidation?: boolean): InvoiceSummaryFormData {
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

  // to fill field values
  useEffect(() => {
    const data = props.formData

    if (data) {
      setInvoiceNumber(data.invoiceNumber)
      setInvoiceDate(data.invoiceDate)
      setDueDate(data.dueDate)
      setTotalAmount(data.totalAmount)
      setDetails(data.details)
      setSupplier(data.supplier)
      setPoNumber(data.poNumber)
      setPoApprover(data.poApprover ? mapUser(data.poApprover) : null)
      setBookingPeriod(data.bookingPeriod || '')
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [
        enumInvoiceFields.invoiceNumber,
        enumInvoiceFields.invoiceDate,
        enumInvoiceFields.dueDate,
        enumInvoiceFields.totalAmount,
        enumInvoiceFields.supplier,
        enumInvoiceFields.poNumber,
        enumInvoiceFields.details,
        enumInvoiceFields.poApprover
      ]
      if (props.useBookingPeriod) {
        fieldList.push(enumInvoiceFields.bookingPeriod)
      }
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
    }
  }, [props.fields, props.useBookingPeriod])

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    fieldMap,
    invoiceNumber, invoiceDate, dueDate, totalAmount, supplier, poNumber, details, bookingPeriod, poApprover
  ])

  function renderBookingPeriod () {
    if (props.isReadOnly) {
      return <Grid item xs={6} pb={2} data-testid="booking-field" ref={(node) => { storeRef(enumInvoiceFields.bookingPeriod, node) }}>
        <div className={styles.key} >
          {t('--bookingPeriod--')}: </div>
        <Value>{bookingPeriod ? getLocalDateString(bookingPeriod.toString()) : '-'}</Value>
      </Grid>
    }
    return <Grid item xs={6} pb={2} data-testid="booking-field" ref={(node) => { storeRef(enumInvoiceFields.bookingPeriod, node) }}>
      <div className={styles.detailKey} >
        {t('--bookingPeriod--')}</div>
      <DateControlNew
        value={getDateObject(bookingPeriod)}
        placeholder={t('--bookingPeriodHolder--')}
        config={{
          isReadOnly: false,
          optional: !isFieldRequired(fieldMap, enumInvoiceFields.bookingPeriod),
          forceValidate: forceValidate
        }}
        disabled={false}
        validator={(value) => validateFieldV2(fieldMap, enumInvoiceFields.bookingPeriod, t('--bookingPeriod--'), value)
        }
        onChange={(value: string) => {
          setBookingPeriod(value)
          handleFieldValueChange(enumInvoiceFields.bookingPeriod, bookingPeriod, value)
        }}
      />
    </Grid>
  }

  function renderDetailsField () {
    return props.isReadOnly
      ? <Grid item xs={12} data-testid="details-field" ref={(node) => { storeRef(enumInvoiceFields.details, node) }}>
        <div className={styles.key} >
          {t('--goodsDetails--')}</div>
        <Value>{details || '-'}</Value>
      </Grid>
      : <Grid item xs={12} data-testid="details-field" ref={(node) => { storeRef(enumInvoiceFields.details, node) }}>
        <div className={styles.detailKey} >
          {t('--goodsDetails--')}</div>
        <TextAreaControlNew
          value={details || ''}
          placeholder={t('--startType--')}
          config={{
            optional: !isFieldRequired(fieldMap, enumInvoiceFields.details),
            forceValidate: forceValidate
          }}
          disabled={isFieldDisabled(fieldMap, enumInvoiceFields.details)}
          onChange={(value) => {
            setDetails(value)
            handleFieldValueChange(enumInvoiceFields.details, details, value)
          }}
          validator={value => validateFieldV2(fieldMap, enumInvoiceFields.details, t('--detailsLabel--'), value)}
        ></TextAreaControlNew>
      </Grid>
  }

  function renderUpperDetails () {
    return <><Grid item xs={12} >
      <div className={styles.bgArea}>
        <div>
          <span className={styles.invoiceKey}>{t('--invoiceNumberLabel--')}</span>
          <span className={styles.invoiceValue}>{invoiceNumber || '-'}</span>
        </div>
        <Separator></Separator>
        <div>
          <span className={styles.key}>{t('--invoiceDateLabel--')}</span>
          <span className={styles.value}>{invoiceDate ? getLocalDateString(invoiceDate.toString()) : '-'}</span>

          <span className={styles.key}>{t('--dueDateLabel--')}</span>
          <span className={styles.value}>{dueDate ? getLocalDateString(dueDate.toString()) : '-'}</span>
        </div>
        <div>
          <span className={styles.key}>{t('--tAmountLabel--')}</span>
          <span className={styles.value}>{totalAmount ? getFormattedValue(totalAmount.amount, totalAmount.currency, null, false) : '-'}</span>
        </div>
        <Separator></Separator>
        <Grid container direction='row'>
          <Grid item flexGrow={1}>
            <span className={styles.key}>{t('--supplierLabel--')}</span>
            <span className={styles.value}>{supplier?.supplierName || '-'}</span>
            <div>
              <span className={styles.key}>{t('--ventorIDLabel--')}</span>
              <span className={styles.vandorValue}>{supplier?.selectedVendorRecord?.vendorId || '-'}</span>
            </div>
          </Grid>
          <Grid item>
            {logoURL && <div>
              <img src={logoURL} alt={supplier?.supplierName || '-'} height="46px" />
            </div>}
          </Grid>

        </Grid>

        <Separator></Separator>
        <div>
          <span className={styles.key}>{t('--poLabel--')}</span>
          <span className={styles.value}>{poNumber || '-'}</span>
        </div>
      </div>
    </Grid>

    </>
  }

  function renderPoApprover () {
    if (props.isReadOnly) {
      return <Grid item xs={6} pb={2} data-testid="approver-field" ref={(node) => { storeRef(enumInvoiceFields.poApprover, node) }}>
        <div className={styles.key} >
          {t('--poApprover--')}: </div>
        {!poApprover ? <Value>-</Value> :
          <UserIdControlNew
            value={poApprover}
            config={{
              selectMultiple: false,
              isReadOnly: true
            }}
            dataFetchers={{
              getUser: props.getAllUsers
            }}
          />}
      </Grid>
    }
    return <Grid item xs={6} pb={2} data-testid="approver-field" ref={(node) => { storeRef(enumInvoiceFields.poApprover, node) }}>
      <div className={styles.detailKey} >
        {t('--poApprover--')}</div>
      <UserIdControlNew
        value={poApprover}
        config={{
          selectMultiple: false,
          optional: !isFieldRequired(fieldMap, enumInvoiceFields.poApprover),
          forceValidate: forceValidate,
          isReadOnly: props.isReadOnly || isFieldDisabled(fieldMap, enumInvoiceFields.poApprover)
        }}
        dataFetchers={{
          getUser: props.getAllUsers
        }}
        onChange={(user) => setPoApprover(user as User)}
      />
    </Grid>

  }

  const showBookingPeriod = props.useBookingPeriod && !isFieldOmitted(fieldMap, enumInvoiceFields.bookingPeriod)
  const showDetails = !isFieldOmitted(fieldMap, enumInvoiceFields.details)
  const showPoApprover = !isFieldOmitted(fieldMap, enumInvoiceFields.poApprover)

  return (
    <>
      <Grid container spacing={2} mb={2}>
        {renderUpperDetails()}
        {(showBookingPeriod || showDetails || showPoApprover) && <Grid item xs={12}>
          <Separator></Separator>
        </Grid>}
        {showPoApprover && renderPoApprover()}
        {showBookingPeriod && renderBookingPeriod()}
        {showDetails && renderDetailsField()}
      </Grid>
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}
