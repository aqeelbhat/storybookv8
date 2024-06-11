/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useState, useEffect, useRef, forwardRef } from "react"
import style from './style.module.scss'
import classNames from "classnames"
import { ItemDetailsFields } from "../../../CustomFormDefinition"

type FieldProps = {
  placeholder?: string
  readOnly: boolean
  disabled?: boolean
  fieldName: ItemDetailsFields
  forceValidate?: boolean
  value: string
  focused?: boolean
  formatter?: (value: string) => string | JSX.Element | JSX.Element[]
  validator?: (value: string) => boolean
  onChange?: (fieldName: ItemDetailsFields, value: string | number | null) => void
  onBlur?: (fieldName: ItemDetailsFields, value: string | number | null) => void
}

function sanitize (value: string) {
  return value ? value.trim() : value
}
export default forwardRef(function (props: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const [Value, setValue] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [isEditable, setEditable] = useState<boolean>(false)
  const InputRef = useRef<HTMLInputElement | null>(null)

  function handleClick () {
    // if not already
    if (!props.readOnly && !isEditable) {
      setEditable(!isEditable)
    }
  }
  function handleChange (e) {
    const newValue = e.target.value
    setValue(newValue)
    props.onChange(props.fieldName, newValue)
  }
  function validate () {
    if (props.validator) {
      const hasError = props.validator(Value)
      setHasError(hasError)
    }
  }
  function handleBlur () {
    validate()
    setValue(sanitize(Value))
    setEditable(false)
    props.onBlur(props.fieldName, Value)
  }
  function handleFocus () {
    if (!props.readOnly) { handleClick() }
  }
  function handleKeyDown (e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }
  function getFormattedValue (value: string) {
    return props.formatter ? props.formatter(value) : value
  }

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (isEditable) {
      InputRef?.current && InputRef.current.focus()
    }
  }, [isEditable])

  useEffect(() => {
    props.forceValidate && validate()
  }, [props.forceValidate])

  useEffect(() => {
    // to auto focused. to be used by only new item
    if (props.focused) {
      handleClick()
    }
  }, [props.focused])

  return <div className={classNames(style.cell, style.input)} tabIndex={props.readOnly ? -1 : 0} onFocus={handleFocus} data-test-id={props.fieldName} ref={ref}>
    {!isEditable
      && <div className={classNames(style.value, {[style.hover]: !props.readOnly, [style.hide]: isEditable, [style.disabled]: props.disabled, [style.error]: hasError })}
        onClick={handleClick}>{getFormattedValue(Value)}</div>}
    {isEditable
      && <input
        className={classNames({ [style.hide]: !isEditable })}
        ref={InputRef}
        type="text"
        placeholder={props.placeholder}
        value={Value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />}
  </div>
})
