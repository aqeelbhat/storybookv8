import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { OroErrorTooltip } from '../Tooltip/error.component'
import { getI18Text as getI18ControlText } from '../i18n'

export function PushButton (props: {
  children: JSX.Element | JSX.Element[],
  selected: boolean,
  disabled: boolean,
  position?: 'first' | 'last' | 'middle'
  onSelect: () => void
}) {
  return (
    <div
      className={classnames(
        styles.pushButton,
        {
          [styles.pushed]: props.selected,
          [styles.disabled]: props.disabled,
          [styles.first]: props.position === 'first',
          [styles.middle]: props.position === 'middle',
          [styles.last]: props.position === 'last',
        }
      )}
      onClick={props.onSelect}
    >
      {props.children}
    </div>
  )
}

interface YesNoProps {
  id?: string
  value?: boolean
  disabled?: boolean
  optional?: boolean
  isReadOnly?: boolean
  onChange?: (value: boolean) => void
  forceValidate: boolean
  validator?: (value?) => string | null
}

export function YesNoControl (props: YesNoProps) {
  const [value, setValue] = useState<boolean | undefined>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && typeof value !== 'boolean' && !value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    } else {
      setError(null)
    }
  }, [props.forceValidate, props.optional, value])

  function handleClick (value: boolean) {
    if (!props.disabled) {
      setValue(value)
      // User can not input invalid value for Yes/No
      setError(null)
      if (props.onChange) {
        props.onChange(value)
      }
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.yesNo, { [styles.disabled]: props.disabled })}>
        <PushButton
          selected={value === true}
          disabled={props.disabled}
          onSelect={() => handleClick(true)}
          position={'first'}
        >
          <>Yes</>
        </PushButton>

        <PushButton
          selected={value === false}
          disabled={props.disabled}
          onSelect={() => handleClick(false)}
          position={'last'}
        >
          <>No</>
        </PushButton>
      </div>
      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )
}

export function YesNoRadioControl (props: YesNoProps) {
  const [value, setValue] = useState<boolean | undefined>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && typeof value !== 'boolean' && !value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }, [props.forceValidate, props.optional, value])

  function handleClick (value: boolean) {
    if (!props.disabled) {
      setValue(value)
      // User can not input invalid value for Yes/No
      setError(null)
      if (props.onChange) {
        props.onChange(value)
      }
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.yesNo, { [styles.disabled]: props.disabled })}>
        <div className={styles.radioItem} data-test-id={`OroRadio_yes_${props.id}`}>
          <input
            type="radio"
            id={`OroRadio_yes_${props.id}`}
            name={`OroRadio_yes_${props.id}`}
            checked={value === true}
            disabled={props.disabled}
            onChange={() => handleClick(true)}
          />
          <label htmlFor={`OroRadio_yes_${props.id}`} className={styles.yesNoLabel}>
            <span>Yes</span>
          </label>
        </div>

        <div className={styles.radioItem} data-test-id={`OroRadio_no_${props.id}`}>
          <input
            type="radio"
            id={`OroRadio_no_${props.id}`}
            name={`OroRadio_no_${props.id}`}
            checked={value === false}
            disabled={props.disabled}
            onChange={() => handleClick(false)}
          />
          <label htmlFor={`OroRadio_no_${props.id}`} className={styles.yesNoLabel}>
            <span>No</span>
          </label>
        </div>

      </div>
      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )
}

interface YesNoPropsNew {
  id?: string
  value?: boolean
  disabled?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
  }
  inTableCell?: boolean
  onChange?: (value: boolean) => void
  validator?: (value?) => string | null
}

export function YesNoRadioControlNew (props: YesNoPropsNew) {
  const [value, setValue] = useState<boolean | undefined>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(value))
    }
  }, [props.config])

  function handleClick (value: boolean) {
    if (!props.disabled) {
      setValue(value)
      // User can not input invalid value for Yes/No
      setError(null)
      if (props.onChange) {
        props.onChange(value)
      }
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.yesNo, { [styles.inTableCell]: props.inTableCell, [styles.disabled]: props.disabled || props.config?.isReadOnly })}>
        <div className={styles.radioItem} data-test-id={`OroRadio_yes_${props.id}`}>
          <input
            type="radio"
            id={`OroRadio_yes_${props.id}`}
            name={`OroRadio_yes_${props.id}`}
            checked={value === true}
            disabled={props.disabled || props.config?.isReadOnly}
            onChange={() => handleClick(true)}
          />
          <label htmlFor={`OroRadio_yes_${props.id}`} className={styles.yesNoLabel}>
            <span>{getI18ControlText('--fieldTypes--.--bool--.--yes--')}</span>
          </label>
        </div>

        <div className={styles.radioItem} data-test-id={`OroRadio_no_${props.id}`}>
          <input
            type="radio"
            id={`OroRadio_no_${props.id}`}
            name={`OroRadio_no_${props.id}`}
            checked={value === false}
            disabled={props.disabled}
            onChange={() => handleClick(false)}
          />
          <label htmlFor={`OroRadio_no_${props.id}`} className={styles.yesNoLabel}>
            <span>{getI18ControlText('--fieldTypes--.--bool--.--no--')}</span>
          </label>
        </div>
        {error && props.inTableCell &&
          <div className={styles.inTableCellError}>
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
