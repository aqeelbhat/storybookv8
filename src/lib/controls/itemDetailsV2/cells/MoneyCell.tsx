/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useEffect, useState } from "react"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import InputControl from "./MaskedInputControl"
import { DEFAULT_DECIMAL_SYMBOL, DEFAULT_THOUSAND_SEPARATOR, getCurrencyMaskConfig, getCurrencySeparators, getValueFromAmount } from "../../../Inputs/utils.service"
import { TextMaskConfig } from "../../../Inputs/types"
import { Money } from "../../../Types"
import { Cost } from "../../../Form"
import { getSessionLocale } from "../../../sessionStorage"

type FieldProps = {
  value: Cost
  fieldName: ItemDetailsFields
  validator?: (value: string) => boolean
  forceValidate?: boolean
  readOnly?: boolean
  locale: string
  defaultCurrency: string
  allowNegative: boolean
  onChange: (fieldName: ItemDetailsFields, fieldValue: Cost) => void
  formatter: (value: Cost) => string | JSX.Element | JSX.Element[]
}

export default function (props: FieldProps) {
  const [maskConfig, setMaskConfig] = useState<TextMaskConfig>(getCurrencyMaskConfig({ allowNegative: props.allowNegative }))
  const [currencyMaskSymbols, setCurrencyMaskSymbols] = useState<{ decimalSymbol?: string, thousandsSeparatorSymbol?: string }>({})
  const [price, setPrice] = useState<Cost>({ amount: undefined, currency: props.defaultCurrency })

  useEffect(() => {
    setPrice({
      amount: props.value?.amount,//?.toString ? props.value?.amount.toString() : '',
      currency: props.value?.currency || props.defaultCurrency
    })
  }, [props.value])

  useEffect(() => {
    const { decimalSymbol, thousandsSeparatorSymbol } = getCurrencySeparators(props.locale)
    setCurrencyMaskSymbols({ decimalSymbol, thousandsSeparatorSymbol })
    // update config with locale
    setMaskConfig((config) => {
      return {
        ...config,
        allowNegative: props.allowNegative,
        decimalSymbol: decimalSymbol || DEFAULT_DECIMAL_SYMBOL,
        thousandsSeparatorSymbol: thousandsSeparatorSymbol || DEFAULT_THOUSAND_SEPARATOR
      }
    })
  }, [props.locale, props.allowNegative])
  function getValue () {
    //resolve negative symbol
    if (props.allowNegative && price.amount === '-') {
      return price.amount
    }
    return (price.amount) ? Number(price.amount).toLocaleString(getSessionLocale()) : ''
  }
  // function handleCostChange (value: string) {
  //   const cleanedupValue = getValueFromAmount(value)
  //   const updatedCost = { amount: cleanedupValue, currency: estimatedCost.currency }
  //   setEstimatedCost(updatedCost)

  //   if (props.onChange) {
  //     props.onChange(updatedCost)
  //   }
  // }

  return <InputControl
    value={getValue()}
    fieldName={props.fieldName}
    validator={props.validator}
    forceValidate={props.forceValidate}
    readOnly={props.readOnly}
    onChange={(fieldName, fieldValue) => {
      const cleanedupValue = getValueFromAmount(fieldValue)
      const updatedCost = { amount: cleanedupValue, currency: price.currency }
      setPrice(updatedCost)

      if (props.onChange) {
        props.onChange(fieldName, updatedCost)
      }

      // props.onChange(fieldName, { amount: Number(fieldValue), currency: price.currency })
    }}
    formatter={(value) => {
      if (value === undefined || value == null || !price?.amount) {
        return props.formatter(undefined)
      }
      const cleanedupValue = getValueFromAmount(value)
      return props.formatter({ amount: cleanedupValue, currency: price.currency })
    }}
    placeholder={`0${currencyMaskSymbols?.decimalSymbol || '.'}00`}
    maskConfig={maskConfig}
  />
}
