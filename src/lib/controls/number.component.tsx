import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import AlertCircle from '../Inputs/assets/alert-circle.svg'
import styles from './style.module.scss'

import { OroErrorTooltip } from '../Tooltip/error.component'
import { getI18Text as getI18ControlText } from '../i18n'
import { NumberConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface NumberProps {
  id?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  onChange?: (value: string) => void
  validator?: (value?) => string | null
}

export function NumberControl (props: NumberProps) {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && !value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }, [props.forceValidate, props.optional, value])

  function handleChange (event) {
    const inputValue = event.target.value
    setValue(inputValue)
    if (inputValue) {
      setError(null)
    } else if (!props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
    if (props.onChange) {
      props.onChange(inputValue)
    }
  }

  function parsedInputValue (event) {
    if (event.keyCode) {
      // Check if entered value is "e" or "+"
      return (event.keyCode === 69 || event.keyCode === 187) && event.preventDefault()
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.text} data-test-id={props.id}>
        <input
          type="number"
          placeholder={props.placeholder || 'Enter number'}
          value={value}
          disabled={props.disabled}
          onChange={handleChange}
          onBlur={handleChange}
          onKeyDown={parsedInputValue}
        />
      </div>
      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )
}

export interface NumberPropsNew {
  id?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    numberConfig?: NumberConfig
  }
  onChange?: (value: string) => void
  validator?: (value?) => string | null
}

function NumberControlNewComponent (props: NumberPropsNew) {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>()
  const [validate, setValidate] = useState(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    setValue(props.value || '')
  }, [props.value])

  useEffect(() => {
    if (validate && props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(value))
    }
  }, [validate])

  useEffect(() => {
     setValidate(props.config.forceValidate)
  }, [props.config.forceValidate])

  function handleChange (event) {
    const inputValue = event.target.value
    setValue(inputValue)
    if (props.onChange) {
      props.onChange(inputValue)
    }
  }

  function handleValidation (event) {
    const inputValue = event.target.value
    setValue(inputValue)
    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(inputValue))
    }
  }

  function parsedInputValue (event) {
    if (event.keyCode) {
      // Check if entered value is "e" or "+"
      return (event.keyCode === 69 || event.keyCode === 187) && event.preventDefault()
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.text, { [styles.inTableCell]: props.inTableCell })} data-test-id={props.id}>
        <input
          type="number"
          placeholder={props.placeholder || t('--enterNumber--')}
          value={value}
          disabled={props.disabled || props.config?.isReadOnly}
          onChange={handleChange}
          onBlur={handleValidation}
          onKeyDown={parsedInputValue}
          min={props.config.numberConfig?.min}
          max={props.config.numberConfig?.max}
        />
      </div>
      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
      {error && props.inTableCell &&
        <div className={styles.inTableCellAlert}>
          <OroErrorTooltip title={error}><img src={AlertCircle} /></OroErrorTooltip>
        </div>}
    </div>
  )
}
export function NumberControlNew (props: NumberPropsNew) {
  return <I18Suspense><NumberControlNewComponent {...props} /></I18Suspense>
}
