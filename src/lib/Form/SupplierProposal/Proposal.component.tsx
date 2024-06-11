import React, { useEffect, useRef, useState } from 'react'

import { COUNTRY, DELIVERY_DATE, DESCRIPTION, PAYMENT_TERM, PAYMENT_TERM_FILTER_BY_REGION, PAYMENT_TERM_FILTER_TAG, SUPPLIER_LEGAL_NAME, SupplierProposalData, TOTAL_AMOUNT } from './types'
import { IDRef, Option, mapMoney } from '../../Types'
import { Cost, Field } from '../types'

import styles from './styles.module.scss'
import { Grid } from '@mui/material'
import { COL1, COL2, COL3, COL4, areObjectsSame, getDateObject, getFieldConfigValue, getFieldStringValue, getFormFieldsMap, getParsedDateForSubmit, isEmpty, isFieldDisabled, isFieldRequired, mapStringToOption, validateFieldV2 } from '../util'
import { Currency, ORODatePicker, TextArea, TextBox, TypeAhead } from '../../Inputs'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import { getSessionLocale } from '../../sessionStorage'
import { getValueFromAmount } from '../../Inputs/utils.service'
import { DateValue, MoneyValue, numberValidator } from '../../CustomFormDefinition'
import { OroButton } from '../../controls'
import { Label, Title, Value } from '../../controls/atoms'
import { Edit3 } from 'react-feather'
import { getFieldMap } from './utils'
import { DEFAULT_CURRENCY } from '../../util'

export function ProposalForm (props: {
  data: SupplierProposalData
  fields: Field[]
  defaultCurrency: string
  currencyOptions: Option[]
  countryOptions: Option[]
  forceValidate?: boolean
  inPopup?: boolean
  fetchRegion?: (code: string) => Promise<IDRef>
  fetchPaymentTerms?: (filterTag?: string) => Promise<Option[]>
  onValueChange?: (data: SupplierProposalData) => void
}) {
  const CURRENCY = props.defaultCurrency || DEFAULT_CURRENCY
  const DEFAULT_COST = { amount: undefined, currency: CURRENCY }
  const [supplierLegalName, setSupplierLegalName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [deliveryDate, setDeliveryDate] = useState<string>()
  const [totalAmount, setTotalAmount] = useState<Cost>(DEFAULT_COST)
  const [country, setCountry] = useState<Option>()
  const [paymentTerm, setPaymentTerm] = useState<Option>()

  const [paymentTermOptions, setPaymentTermOptions] = useState<Option[]>([])
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIER_PROPOSAL])

   // to Map field configs
   useEffect(() => {
    if (props.fields) {
      setFieldMap(getFieldMap(props.fields))
    }
  }, [props.fields])

  useEffect(() => {
    if (props.data) {
      setSupplierLegalName(props.data.supplierLegalName)
      setDescription(props.data.description)
      setDeliveryDate(props.data.deliveryDate)
      setTotalAmount({ amount: props.data.totalAmount?.amount?.toString(), currency: props.data.totalAmount?.currency || CURRENCY })
      setCountry(props.data.country ? mapStringToOption(props.data.country) : undefined)
      setPaymentTerm(props.data.paymentTerm)
    }
  }, [props.data])

  useEffect(() => {
    if (fieldMap) {
      const filterTag = getFieldStringValue(fieldMap, PAYMENT_TERM_FILTER_TAG)
      if (filterTag) {
        // payment tems should be filtered by paymentTermFilterTag
        props.fetchPaymentTerms && props.fetchPaymentTerms(filterTag)
          .then(res => setPaymentTermOptions(res))
          .catch(err => console.log('ProposalForm: could not fetch Payment Terms by paymentTermFilterTag - ', err))
      } else if (getFieldConfigValue(fieldMap, PAYMENT_TERM_FILTER_BY_REGION) && country?.path) {
        // payment tems should be filtered by country
        // resolve the countryCode to Region code
        props.fetchRegion && props.fetchRegion(country.path)
          .then(res => {
            const regionCode = res.id
            props.fetchPaymentTerms && props.fetchPaymentTerms(regionCode)
              .then(res => setPaymentTermOptions(res))
              .catch(err => console.log('ProposalForm: could not fetch Payment Terms by country - ', err))
          })
          .catch(err => console.log('ProposalForm: could not fetch Regions - ', err))
      } else {
        props.fetchPaymentTerms && props.fetchPaymentTerms()
          .then(res => setPaymentTermOptions(res))
          .catch(err => console.log('ProposalForm: could not fetch Payment Terms by paymentTermFilterTag - ', err))
      }
    }
  }, [fieldMap, country])

  function getFormData (): SupplierProposalData {
    return {
      supplierProposal: props.data?.supplierProposal,
      proposalExtract: props.data?.proposalExtract,
      supplierLegalName,
      description,
      deliveryDate: getParsedDateForSubmit(deliveryDate),
      totalAmount,
      country: country?.path,
      paymentTerm
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Cost): SupplierProposalData {
    const data = getFormData()
    switch (fieldName) {
      case SUPPLIER_LEGAL_NAME:
        data.supplierLegalName = newValue as string
        break
      case DESCRIPTION:
        data.description = newValue as string
        break
      case DELIVERY_DATE:
        data.deliveryDate = newValue as string
        break
      case TOTAL_AMOUNT:
        data.totalAmount = newValue as Cost
        break
      case COUNTRY:
        data.country = (newValue as Option)?.path
        break
      case PAYMENT_TERM:
        data.paymentTerm = newValue as Option
        break
    }

    return data
  }

  function handleFieldValueChange (
    fieldName: string,
    oldValue: string | Option | Cost,
    newValue: string | Option | Cost
  ) {
    if (props.onValueChange) {
      if (
        (typeof newValue === 'string' && oldValue !== newValue) ||
        !areObjectsSame(oldValue, newValue)
      ) {
        props.onValueChange(getFormDataWithUpdatedValue(fieldName, newValue))
      }
    }
  }

  function handleCostChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    const updatedAmount = {
      amount: cleanedupValue,
      currency: totalAmount?.currency
    }
    setTotalAmount(updatedAmount)
    handleFieldValueChange(TOTAL_AMOUNT, totalAmount, updatedAmount)
  }

  function handleCurrencyChange (value: string) {
    const updatedAmount = {
      amount: totalAmount?.amount,
      currency: value
    }
    setTotalAmount(updatedAmount)
    handleFieldValueChange(TOTAL_AMOUNT, totalAmount, updatedAmount)
  }

  return (
    <div className={styles.proposalForm}>
      <Grid container spacing={2.5} pb={4}>
        <Grid item xs={props.inPopup ? COL4 : COL3}>
          <div data-testid="supplierLegalName-field" ref={(node) => storeRef(SUPPLIER_LEGAL_NAME, node)} >
            <TextBox
              label={t('--supplierLegalName--')}
              value={supplierLegalName}
              disabled={isFieldDisabled(fieldMap, SUPPLIER_LEGAL_NAME)}
              required={isFieldRequired(fieldMap, SUPPLIER_LEGAL_NAME)}
              forceValidate={props.forceValidate}
              validator={(value: string) => validateFieldV2(fieldMap, SUPPLIER_LEGAL_NAME, t('--supplierLegalName--'), value)}
              onChange={(value: string) => { setSupplierLegalName(value); handleFieldValueChange(SUPPLIER_LEGAL_NAME, supplierLegalName, value) }}
            />
          </div>
        </Grid>{!props.inPopup && <Grid item xs={COL1}></Grid>}

        <Grid item xs={props.inPopup ? COL4 : COL3}>
          <div data-testid="description-field" ref={(node) => storeRef(DESCRIPTION, node)} >
            <TextArea
              label={t('--description--')}
              value={description}
              disabled={isFieldDisabled(fieldMap, DESCRIPTION)}
              required={isFieldRequired(fieldMap, DESCRIPTION)}
              forceValidate={props.forceValidate}
              validator={(value: string) => validateFieldV2(fieldMap, DESCRIPTION, t('--description--'), value)}
              onChange={(value: string) => { setDescription(value); handleFieldValueChange(DESCRIPTION, description, value) }}
            />
          </div>
        </Grid>{!props.inPopup && <Grid item xs={COL1}></Grid>}

        {/* Type of Purchase */}

        <Grid item xs={COL2}>
          <div data-testid="deliveryDate-field" ref={(node) => storeRef(DELIVERY_DATE, node)} >
            <ORODatePicker
              label={t('--deliveryDate--')}
              placeholder={getI18Text('--select--')}
              value={getDateObject(deliveryDate)}
              disabled={isFieldDisabled(fieldMap, DELIVERY_DATE)}
              required={isFieldRequired(fieldMap, DELIVERY_DATE)}
              forceValidate={props.forceValidate}
              validator={(date: string) => validateFieldV2(fieldMap, DELIVERY_DATE, t('--deliveryDate--'), date)}
              onChange={(date: string) => { setDeliveryDate(date); handleFieldValueChange(DELIVERY_DATE, deliveryDate, date) }}
            />
          </div>
        </Grid><Grid item xs={COL2}></Grid>

        <Grid item xs={COL2}>
          <div data-testid="totalAmount-field" ref={(node) => storeRef(TOTAL_AMOUNT, node)} >
            <Currency
              locale={getSessionLocale()}
              label={t('--totalAmount--')}
              unit={totalAmount?.currency}
              value={totalAmount?.amount}
              unitOptions={props.currencyOptions}
              disabled={isFieldDisabled(fieldMap, TOTAL_AMOUNT)}
              required={isFieldRequired(fieldMap, TOTAL_AMOUNT)}
              forceValidate={props.forceValidate}
              validator={(value: string) => validateFieldV2(fieldMap, TOTAL_AMOUNT, t('--totalAmount--'), value && getValueFromAmount(value))}
              onChange={handleCostChange}
              onUnitChange={handleCurrencyChange}
            />
          </div>
        </Grid>{<Grid item xs={COL2}></Grid>}

        <Grid item xs={COL2}>
          <div data-testid="supplierCountry-field" ref={(node) => storeRef(COUNTRY, node)} >
            <TypeAhead
              label={t('--supplierCountry--')}
              value={country}
              options={props.countryOptions}
              disabled={isFieldDisabled(fieldMap, COUNTRY)}
              required={isFieldRequired(fieldMap, COUNTRY)}
              forceValidate={props.forceValidate}
              absolutePosition={props.inPopup}
              validator={(value: string) => validateFieldV2(fieldMap, COUNTRY, t('--supplierCountry--'), value)}
              onChange={(value: Option) => { setCountry(value); handleFieldValueChange(COUNTRY, country, value) }}
            />
          </div>
        </Grid>{!props.inPopup && <Grid item xs={COL2}></Grid>}

        <Grid item xs={COL2}>
          <div data-testid="paymentTerm-field" ref={(node) => storeRef(PAYMENT_TERM, node)} >
            <TypeAhead
              label={t('--paymentTerm--')}
              value={paymentTerm}
              options={paymentTermOptions}
              disabled={isFieldDisabled(fieldMap, PAYMENT_TERM)}
              required={isFieldRequired(fieldMap, PAYMENT_TERM)}
              forceValidate={props.forceValidate}
              absolutePosition={props.inPopup}
              validator={(value: string) => validateFieldV2(fieldMap, PAYMENT_TERM, t('--paymentTerm--'), value)}
              onChange={(value: Option) => { setPaymentTerm(value); handleFieldValueChange(PAYMENT_TERM, paymentTerm, value) }}
            />
          </div>
        </Grid>{!props.inPopup && <Grid item xs={COL2}></Grid>}

        {/* Additional Attachments */}
      </Grid>
    </div>
  )
}

export function ProposalCard (props: {
  data: SupplierProposalData
  countryOptions?: Option[]
  onEditClick?: () => void
}) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIER_PROPOSAL])
  const countryDisplayName = (props.countryOptions && props.data?.country) && props.countryOptions.find(option => option.path === props.data.country)?.displayName

  return (
    <div className={styles.ProposalCard}>
      <div className={styles.header}>
        <div className={styles.title}><Title>{t('--proposalDetails--')}</Title></div>
        <OroButton label={t('--edit--')} icon={<Edit3 size={16} color='var(--warm-neutral-shade-300)' />} type='secondary' radiusCurvature='medium' onClick={props.onEditClick} />
      </div>

      <div className={styles.details}>
        <div className={styles.data}>
          <div className={styles.field}>
            <div className={styles.label}>{t('--supplierLegalName--')}</div>
            <div className={styles.value}>{props.data?.supplierLegalName}</div>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>{t('--description--')}</div>
            <div className={styles.value}>{props.data?.description}</div>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>{t('--deliveryDate--')}</div>
            <div className={styles.value}><DateValue value={props.data?.deliveryDate} locale={getSessionLocale()} /></div>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>{t('--totalAmount--')}</div>
            <div className={styles.value}><MoneyValue value={mapMoney(props.data?.totalAmount)} locale={getSessionLocale()} /></div>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>{t('--supplierCountry--')}</div>
            <div className={styles.value}>{countryDisplayName || props.data?.country}</div>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>{t('--paymentTerm--')}</div>
            <div className={styles.value}>{props.data?.paymentTerm?.displayName}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

