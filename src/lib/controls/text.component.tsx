import React, { useEffect, useState } from 'react'

import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { RichTextEditor } from '../RichTextEditor'

import styles from './style.module.scss'
import { LinkButtonConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { LinkButton } from './button/button.component'
import { checkURLContainsProtcol } from '../util'
import classnames from 'classnames'
import { OroErrorTooltip } from '../Tooltip/error.component'
import { getI18Text as getI18ControlText } from '../i18n'

interface TextProps {
  id?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  inTableCell?: boolean
  onChange?: (value: string) => void
  validator?: (value?) => string | null
}

export function TextControl (props: TextProps) {
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
    setValue(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function handleKeyUp (event) {
    const inputValue = event.target.value
    setValue(inputValue)
    if (inputValue) {
      setError(null)
    } else if (!props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.text} data-test-id={props.id}>
        <input
          type="text"
          placeholder={props.placeholder || 'Enter text'}
          value={value}
          disabled={props.disabled}
          onChange={handleChange}
          onBlur={handleChange}
          onKeyUp={handleKeyUp}
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

export interface TextPropsNew {
  id?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  config: {
    label?: string
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    linkButtonConfig?: LinkButtonConfig
  }
  onChange?: (value: string) => void
  validator?: (value?) => string | null
}

export function TextControlNew (props: TextPropsNew) {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>()
  const [validate, setValidate] = useState(false)

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
  },[props.config.forceValidate])

  function handleChange (event) {
    setValue(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function handleValidation (event) {
    const inputValue = event.target.value
    setValue(inputValue)
    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(inputValue))
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.text, { [styles.inTableCell]: props.inTableCell })} data-test-id={props.id}>
        {props.config?.isReadOnly && props.config?.linkButtonConfig?.isButton
          ? <LinkButton
            href={checkURLContainsProtcol(value)}
            label={props.config?.label}
            isPrimary={props.config?.linkButtonConfig?.isPrimary}
          />
          : <input
            type="text"
            placeholder={props.placeholder || getI18ControlText('--fieldTypes--.--string--.--enterText--')}
            value={value}
            disabled={props.disabled || props.config?.isReadOnly}
            onChange={handleChange}
            onBlur={handleValidation}
          />}
      </div>
      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
      {error && props.inTableCell &&
        <div className={styles.inTableCellAlert}>
          <OroErrorTooltip title={error}><img src={AlertCircle} /></OroErrorTooltip>
        </div>}
    </div>
  )
}

export function TextAreaControl (props: TextProps) {
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
    setValue(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function handleKeyUp (event) {
    setValue(event.target.value)
    if (value) {
      setError(null)
    } else if (!props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.text} data-test-id={props.id}>
        <textarea
          placeholder={props.placeholder}
          value={value}
          disabled={props.disabled}
          onChange={handleChange}
          // onBlur={handleChange}
          onKeyUp={handleKeyUp}
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


export function TextAreaControlNew (props: TextPropsNew) {
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
    setValue(event.target.value)
    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(value))
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.text, styles.textArea, { [styles.inTableCell]: props.inTableCell })} data-test-id={props.id}>
        <textarea
          placeholder={props.placeholder || getI18ControlText('--fieldTypes--.--string--.--enterText--')}
          value={value}
          disabled={props.disabled || props.config?.isReadOnly}
          onChange={handleChange}
          onBlur={handleValidation}
        />
        {error && props.inTableCell &&
          <div className={styles.inTableCellAlert}>
            <OroErrorTooltip title={error}><img src={AlertCircle} />
            </OroErrorTooltip>
          </div>
        }
      </div>
      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )
}

export function RichTextControl (props: TextProps) {

  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && !value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    } else {
      setError('')
    }
  }, [props.forceValidate, props.optional, value])

  function handleChange (value: string) {
    setValue(value)
    if (value) {
      setError(null)
    }
    if (props.onChange) {
      props.onChange(value)
    }
  }

  function onEditBlur () {
    if (!value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    } else {
      setError(null)
    }
  }

  return (
    <div>
      <div className={styles.text} data-test-id={props.id}>
        <RichTextEditor
          className={`oro-rich-text-answer ${error ? 'error' : ''} ${props.inTableCell ? 'inTableCell' : ''}`}
          placeholder={props.placeholder}
          value={value}
          readOnly={props.isReadOnly}
          hideToolbar={false}
          onChange={handleChange}
          onBlur={onEditBlur}
        />
      </div>
      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
      {error && props.inTableCell &&
        <div className={styles.inTableCellAlert}>
          <OroErrorTooltip title={error}><img src={AlertCircle} /></OroErrorTooltip>
        </div>}
    </div>
  )

}

export function RichTextControlNew (props: TextPropsNew) {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value || '')
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(value))
    }
  }, [props.config])

  function handleChange (value: string) {
    setValue(value)
    if (props.onChange) {
      props.onChange(value)
    }
  }

  function onEditBlur () {
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(value))
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.text, styles.rtf)} data-test-id={props.id}>
        <RichTextEditor
          className={`oro-rich-text-answer ${props.inTableCell ? 'inTableCell' : ''}`}
          placeholder={props.placeholder}
          value={value}
          readOnly={props.config?.isReadOnly}
          hideToolbar={props.config?.isReadOnly}
          onChange={handleChange}
          onBlur={onEditBlur}
        />
        {error && props.inTableCell &&
          <div className={styles.inTableCellAlert}>
            <OroErrorTooltip title={error}><img src={AlertCircle} />
            </OroErrorTooltip>
          </div>
        }
      </div>
      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )

}
