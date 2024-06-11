import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { emailValidator } from '../CustomFormDefinition/View/validator.service'
import AlertCircle from '../Inputs/assets/alert-circle.svg'

import styles from './style.module.scss'
import { OroErrorTooltip } from '../Tooltip/error.component'
import { getI18Text as getI18ControlText } from '../i18n'

export interface EmailProps {
  id?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
  }
  onChange?: (value: string) => void
  validator?: (value?) => string | null
}

export function EmailControl (props: EmailProps) {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value || '')
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(value))
    }
  }, [props.config])

  function handleChange (event) {
    setValue(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function handleValidation (event) {
    const inputValue = event.target.value
    const validationResult = emailValidator(inputValue)
    setValue(inputValue)
    if (!inputValue && !props.config.optional && !props.config.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    } else if (validationResult.length > 0) {
      setError(validationResult)
    } else {
      setError(null)
    }
  }

  return (
    <div className={classNames( error ? styles.error : '')}>
      <div className={classNames(styles.text, styles.emailText, {[styles.inTableCell]:props.inTableCell})} data-test-id={props.id}>
        <input
          type="email"
          placeholder={props.placeholder || 'Enter email'}
          value={value}
          disabled={props.disabled || props.config?.isReadOnly}
          onChange={handleChange}
          onBlur={handleValidation}
        />
        {props.inTableCell && error &&
          <div className={styles.inTableCellAlert}>
          <OroErrorTooltip title={error}><img src={AlertCircle} />
          </OroErrorTooltip>
        </div>}
      </div>
      {!props.inTableCell && error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )
}
