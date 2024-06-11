import React, { useEffect, useState } from "react"
import classnames from 'classnames'
import PhoneInput, { isPossiblePhoneNumber, parsePhoneNumber } from 'react-phone-number-input'

import styles from './styles.module.scss'
import 'react-phone-number-input/style.css'
import './oro-phone-input-style.scss'

import { OROInputProps } from "./types"
import { CountryCode } from "libphonenumber-js/types";
import { getCountryCodeFormDiallingCode } from "./utils.service";
import { getI18Text as getI18ControlText } from "../i18n";
import { InputWrapper } from "./input.component"

export type E164Number = string & {
  __tag: "E164Number";
}

export function OROPhoneInput (props: OROInputProps) {
  const [error, setError] = useState<string | null>()
  const [state, setState] = useState<string>('')
  const [countryCode, setCountryCode] = useState<CountryCode>()

  useEffect(() => {
    if (props.value) {
      const parseNumber = parsePhoneNumber(props.value)
      if (parseNumber) {
        setState(props.value)
        setCountryCode(parseNumber?.country || 'US')
      } else {
        setCountryCode(getCountryCodeFormDiallingCode(props.value))
      }
    } else {
      setState('')
    }
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate) {
      validatePhoneNumber(state)
    }
  }, [props.forceValidate])

  function handleChange (event) {
    setError('')
    setState(event)
    const parseNumber = event && parsePhoneNumber(event)
    if (props.onChange && parseNumber?.nationalNumber) {
      props.onChange(event)
    } else if (!event) {
      props.onChange('')
    }
  }

  function validatePhoneNumber (value) {
    if (value) {
      const parseNumber = parsePhoneNumber(value)
      if (parseNumber === undefined) {
        setError('')
      } else if (!parseNumber || !isPossiblePhoneNumber(value) || !parseNumber.nationalNumber) {
        setError('Enter valid phone number')
      }
    } else {
      const err = (!props.optional && !props.isReadOnly) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''
      setError(err)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.texbox}
      error={error}
    >
      <PhoneInput
        disabled={props.disabled}
        focusInputOnCountrySelection={true}
        international={true}
        country={countryCode}
        className={classnames({ ['oroPhone-invalid']: error }, 'oroPhone', props.disabled ? 'oroPhone-disabled' : '')}
        countryCallingCodeEditable={false}
        defaultCountry={countryCode || 'US'}
        placeholder="+1 ___-___-____"
        value={state as E164Number}
        onChange={handleChange}
        onBlur={(event: any) => validatePhoneNumber(event.target.value)}
      />
    </InputWrapper>
  )
}

export interface OROInputPropsNew {
  value?: string
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
  }
  validator?: (value?) => string | null
  onChange?: (value: string) => void
}

export function OROPhoneInputNew (props: OROInputPropsNew) {
  const [error, setError] = useState<string | null>()
  const [state, setState] = useState<string>('')
  const [countryCode, setCountryCode] = useState<CountryCode>()

  useEffect(() => {
    if (props.value) {
      const parseNumber = parsePhoneNumber(props.value)
      if (parseNumber) {
        setState(props.value)
        setCountryCode(parseNumber?.country || 'US')
      } else {
        setCountryCode(getCountryCodeFormDiallingCode(props.value))
      }
    } else {
      setState('')
    }
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(state))
    }
  }, [props.config])

  function handleChange (event) {
    setError('')
    setState(event)
    const parseNumber = event && parsePhoneNumber(event)
    if (props.onChange && parseNumber?.nationalNumber) {
      props.onChange(event)
    } else if (!event) {
      props.onChange('')
    }
  }

  function validatePhoneNumber (value) {
    const err = (!props.config.optional && !props.config.isReadOnly && props.validator) ? props.validator(value) : ''
    setError(err)
  }

  return (
    <InputWrapper
      required={!props.config.optional}
      classname={styles.texbox}
      error={error}
      inTableCell={props.inTableCell}>
      <PhoneInput
        focusInputOnCountrySelection={true}
        international={true}
        country={countryCode}
        className={classnames('oroPhone', { ['oroPhone-invalid']: error, ['inTableCell']: props.inTableCell })}
        countryCallingCodeEditable={false}
        defaultCountry={countryCode || 'US'}
        placeholder="+1 ___-___-____"
        value={state as E164Number}
        onChange={handleChange}
        onBlur={(event: any) => validatePhoneNumber(event.target.value)}
      />
    </InputWrapper>
  )
}
