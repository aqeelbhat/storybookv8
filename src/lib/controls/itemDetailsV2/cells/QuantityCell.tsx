/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useEffect, useState } from "react"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import InputControl from "./MaskedInputControl"
import { DEFAULT_DECIMAL_SYMBOL, DEFAULT_THOUSAND_SEPARATOR, getCurrencyMaskConfig, getCurrencySeparators, getValueFromAmount } from "../../../Inputs/utils.service"
import { TextMaskConfig } from "../../../Inputs/types"

type FieldProps = {
  value: string
  fieldName: ItemDetailsFields
  validator?: (value?) => boolean
  forceValidate?: boolean
  readOnly?: boolean
  decimalLimit: number
  allowNegative: boolean
  locale: string
  onChange: (fieldName: ItemDetailsFields, fieldValue: string) => void
  formatter: (value: string) => string | JSX.Element | JSX.Element[]
}

export default function (props: FieldProps) {
  const [currencyMaskSymbols, setCurrencyMaskSymbols] = useState<{ decimalSymbol?: string, thousandsSeparatorSymbol?: string }>({})
  const [maskConfig, setMaskConfig] = useState<TextMaskConfig>(getCurrencyMaskConfig({ allowNegative: props.allowNegative, decimalLimit: props.decimalLimit }))
  const [Quantity, setQuantity] = useState('')

  useEffect(() => {
    setQuantity(props.value)
  }, [props.value])

  useEffect(() => {
    const { decimalSymbol, thousandsSeparatorSymbol } = getCurrencySeparators(props.locale)
    setCurrencyMaskSymbols({ decimalSymbol, thousandsSeparatorSymbol })
    // update config with locale
    setMaskConfig((config) => {
      return {
        ...config,
        allowNegative: props.allowNegative,
        decimalLimit: props.decimalLimit,
        decimalSymbol: decimalSymbol || DEFAULT_DECIMAL_SYMBOL,
        thousandsSeparatorSymbol: thousandsSeparatorSymbol || DEFAULT_THOUSAND_SEPARATOR
      }
    })
  }, [props.locale, props.allowNegative, props.decimalLimit])

  return <InputControl
    value={Quantity}
    fieldName={props.fieldName}
    validator={props.validator}
    forceValidate={props.forceValidate}
    readOnly={props.readOnly}
    onChange={(fieldName, fieldValue) => {
      const cleanedupValue = getValueFromAmount(fieldValue)
      setQuantity(fieldValue)
      if (props.onChange) {
        props.onChange(fieldName, cleanedupValue)
      }
    }}
    formatter={(value) => {
      if (!value) {
        return props.formatter(undefined)
      }
      const cleanedupValue = getValueFromAmount(value)
      return props.formatter(cleanedupValue)
    }}
    placeholder={`0${currencyMaskSymbols?.decimalSymbol || '.'}00`}
    maskConfig={maskConfig}
  />
}
