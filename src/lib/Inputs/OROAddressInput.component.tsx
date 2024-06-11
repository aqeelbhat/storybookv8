import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "react-feather";
import classnames from 'classnames'
import { InputWrapper } from "./input.component";
import styles from './styles.module.scss'
import { OROAddressInputProps } from "./types";

export function OROAddressInput (props: OROAddressInputProps) {
  const [error, setError] = useState<string | null>()
  const [state, setState] = useState<string>('')
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (inputRef && inputRef.current && props.initializeGoogleApi) {
      props.initializeGoogleApi()
    }
  }, [inputRef])

  useEffect(() => {
    props.value ? setState(props.value) : setState('')
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator && !state && props.required) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate, props.validator, state])

  function handleChange (event) {
    if (props.validator && props.required) {
      const err = props.validator(event.target.value)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function handleFocus (event) {
    if (props.onFocus) {
      props.onFocus(event)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      classname={styles.oroInput}
      required={props.required}
      error={error}
    >
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          key={`key-${state}`}
          type="text"
          id={props.id}
          className={classnames({ [styles.invalid]: error})}
          placeholder={props.placeholder}
          defaultValue={state}
          disabled={props.disabled}
          onChange={handleChange}
          onBlur={handleChange}
          onFocus={handleFocus}
        />
        <MapPin className={styles.oroInputIcon} color={'#A0A4A8'} size={18} />
      </div>
    </InputWrapper>
  )
}
