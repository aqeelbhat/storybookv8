/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useEffect, useRef, useState } from "react"
import createNumberMask from "text-mask-addons/dist/createNumberMask"
import { getValueFromAmount } from "../../../Inputs/utils.service"
import classNames from "classnames"
import MaskedInput from 'react-text-mask'
import style from './style.module.scss'
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import { TextMaskConfig } from "../../../Inputs/types"

interface FieldProps {
  placeholder?: string
  readOnly?: boolean
  fieldName: ItemDetailsFields
  value?: string
  hideDecimal?: boolean
  decimalLimit?: number
  forceValidate?: boolean
  disabled?: boolean
  validator?: (value: string) => boolean
  onChange: (fieldName: ItemDetailsFields, fieldValue: string) => void
  formatter: (value: string) => string | JSX.Element | JSX.Element[]
  maskConfig: TextMaskConfig
}

export default function (props: FieldProps) {
  const [state, setState] = useState<string>('')
  const InputRef = useRef<MaskedInput>(null)
  const [hasError, setError] = useState<boolean>(false)
  const [isEditable, setEditable] = useState<boolean>(false)
  const [inputMask, setInputMask] = useState<() => string[]>(() => createNumberMask(props.maskConfig))

  function handleClick () {
    if (!props.readOnly && !isEditable) {
      setEditable(!isEditable)
    }
  }
  function handleFocus () {
    !props.readOnly && handleClick()
  }
  function handleChange (value: string) {
    setState(value || '')
    const cleanedupValue = getValueFromAmount(value)
    // when user start adding Negative values, don't pass value to consumer.
    if(cleanedupValue === '-') {
      return
    }
    if (props.validator) {
      const hasError = props.validator(cleanedupValue)
      setError(hasError)
    }

    if (props.onChange) {
      props.onChange(props.fieldName, cleanedupValue || '')
    }
  }
  function handleBlur (value: string) {
    setEditable(false)
    handleChange(value)
  }
  function handleKeyDown (e: React.KeyboardEvent) {
    if (['Enter', 'Esc', 'Escape'].includes(e.key)) {
      handleBlur(state)
    }
  }
  function getFormattedValue (value: string) {
    return props.formatter ? props.formatter(value) : value
  }

  useEffect(() => {
    if (props.maskConfig) {
      setInputMask(() => createNumberMask(props.maskConfig))
    }

  }, [props.maskConfig])

  useEffect(() => {
    setState(props.value || '')
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value?.toString())
      setError(err)
    }
  }, [props.forceValidate])

  useEffect(() => {
    if (isEditable) {
      InputRef?.current && InputRef?.current.inputElement && InputRef?.current?.inputElement.focus()
    }
  }, [isEditable])

  return <div className={classNames(style.cell, style.input)} tabIndex={props.readOnly ? -1 : 0} onFocus={handleFocus}>
    {!isEditable && <div className={classNames(style.value, { [style.hover]: !props.readOnly, [style.hide]: isEditable, [style.error]: hasError })}
      onClick={handleClick}>{getFormattedValue(props.value)}</div>}
    {isEditable && <MaskedInput
      mask={inputMask}
      ref={InputRef}
      className={classNames({ [style.error]: hasError })}
      type="text"
      value={state}
      placeholder={props.placeholder || (props.hideDecimal ? '0' : '0.00')}
      disabled={props.disabled}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={(e) => handleBlur(e.target.value)}
      onKeyDown={handleKeyDown}
    />
    }
  </div>
}
