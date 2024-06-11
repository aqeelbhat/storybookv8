import React, { useEffect, useState } from 'react'
import { Cost } from '../Form/types'
import { Currency } from '../Inputs'
import { getCurrencySeparators, getValueFromAmount } from '../Inputs/utils.service'
import { Option } from './../Types'
import { DEFAULT_CURRENCY } from '../util'
import { getI18Text as getI18ControlText } from '../i18n'
import { getSessionLocale } from '../sessionStorage'

interface MoneyProps {
  id?: string
  value?: Cost
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  onChange?: (value: Cost) => void
  currencyOptions?: Option[]
  defaultCurrency?: string
  validator?: (value?) => string | null
}

export function MoneyControl (props: MoneyProps) {
  const [error, setError] = useState<string | null>()
  const [estimatedCost, setEstimatedCost] = useState<Cost>({ currency: '', amount: '' })
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])

  useEffect(() => {
    setEstimatedCost({
      currency: props.value?.currency || props.defaultCurrency || DEFAULT_CURRENCY,
      amount: props.value?.amount
    })
  }, [props.value, props.defaultCurrency])


  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  useEffect(() => {
    if (props.forceValidate && (!estimatedCost.amount || !estimatedCost.currency) && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
      if (!estimatedCost.amount && estimatedCost.currency) {
        setError("Amount is required")
      }
      if (!estimatedCost.currency && estimatedCost.amount) {
        setError("Unit is required")
      }
    }
  }, [props.forceValidate, props.optional, estimatedCost])

  function validateCurrency (value: string) {
    if (value) {
      return null
    } else if (!props.optional && !props.isReadOnly) {
      return getI18ControlText('--validationMessages--.--fieldRequired--')
    }
  }

  function handleCostChange (value: string) {
    if (value) {
      setError(null)
    } else if (!props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }

    const cleanedupValue = getValueFromAmount(value)
    const updatedCost = { amount: cleanedupValue, currency: estimatedCost.currency }
    setEstimatedCost(updatedCost)

    if (props.onChange) {
      props.onChange(updatedCost)
    }
  }

  function handleCurrencyChange (value: string) {
    if (value) {
      setError(null)
    } else if (!props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }

    const updatedCost = { amount: estimatedCost.amount, currency: value }
    setEstimatedCost(updatedCost)

    if (props.onChange) {
      props.onChange(updatedCost)
    }
  }

  return (
    <Currency
      locale={getSessionLocale()}
      label=""
      unit={estimatedCost.currency}
      value={(estimatedCost.amount) ? Number(estimatedCost.amount).toLocaleString(getSessionLocale()) : ''}
      unitOptions={currencyOptions}
      onChange={handleCostChange}
      onUnitChange={handleCurrencyChange}
      required={!props.optional && !props.isReadOnly}
      forceValidate={props.forceValidate}
      validator={(value) => validateCurrency(value)}
      hideClearButton={true}
      disabled={props.isReadOnly}
    />
  )
}

interface MoneyPropsNew {
  id?: string
  value?: Cost
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  locale?: string
  allowNegative?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    disableCurrency?: boolean
    forceValidate?: boolean
    locale?: string
  }
  additionalOptions: {
    currency?: Option[]
    defaultCurrency?: string
    userSelectedCurrency?: string
  }
  validator?: (value?) => string | null
  onChange?: (value: Cost) => void
  onCurrencyChange?: (currencyCode: string) => void
}

export function MoneyControlNew (props: MoneyPropsNew) {
  const [estimatedCost, setEstimatedCost] = useState<Cost>({ currency: '', amount: '' })
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const localeToUse = getSessionLocale()
  const [forceValidate, setForceValidate] = useState(false)

  useEffect(() => {
    setEstimatedCost({
      currency: props.value?.currency || props.additionalOptions.defaultCurrency || DEFAULT_CURRENCY,
      amount: props.value?.amount || ''
    })
  }, [props.value, props.additionalOptions.defaultCurrency])

  useEffect(() => {
    if (props.additionalOptions.userSelectedCurrency && !estimatedCost.amount) {
      setEstimatedCost({
        currency: props.additionalOptions.userSelectedCurrency,
        amount: estimatedCost.amount
      })
    }
  }, [props.additionalOptions.userSelectedCurrency])

  useEffect(() => {
    props.additionalOptions.currency && setCurrencyOptions(props.additionalOptions.currency)
  }, [props.additionalOptions.currency])

  useEffect(() => {
    setForceValidate(props.config?.forceValidate)
  }, [props.config?.forceValidate])

  function handleCostChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    const updatedCost = { amount: cleanedupValue, currency: estimatedCost.currency }
    setEstimatedCost(updatedCost)

    if (props.onChange) {
      props.onChange(updatedCost)
    }
  }

  function handleCurrencyChange (value: string) {
    const updatedCost = { amount: estimatedCost.amount, currency: value }
    setEstimatedCost(updatedCost)

    if (props.onChange) {
      props.onChange(updatedCost)
    }
    if (props.onCurrencyChange) {
      props.onCurrencyChange(value)
    }
  }

  function validateCurrency (value: string): string {
    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      const cleanedupValue = getValueFromAmount(value)
      const updatedCost = { amount: cleanedupValue, currency: estimatedCost.currency }
      return props.validator(updatedCost)
    }
  }

  function getValue () {
    //resolve negative symbol
    if (props.allowNegative && estimatedCost.amount === '-') {
      return estimatedCost.amount
    }
    return (estimatedCost.amount) ? Number(estimatedCost.amount).toLocaleString(localeToUse) : ''
  }
  return (
    <Currency
      allowNegative={props.allowNegative}
      inTableCell={props.inTableCell}
      label=""
      unit={estimatedCost.currency}
      locale={localeToUse}
      value={getValue()}
      unitOptions={currencyOptions}
      required={!props.config.optional && !props.config.isReadOnly}
      disableUnit={props.config?.disableCurrency}
      forceValidate={forceValidate}
      hideClearButton={true}
      disabled={props.disabled || props.config?.isReadOnly}
      validator={validateCurrency}
      onChange={handleCostChange}
      onUnitChange={handleCurrencyChange}
    />
  )
}
