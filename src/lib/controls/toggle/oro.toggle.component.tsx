import React, { useEffect, useState } from 'react'
import { ToggleSwitchProps } from './types'
import { InputWrapper } from '../../Inputs/input.component'
import styles from './oro.toggle.module.scss'
import classNames from 'classnames'
import { Keyboard } from '../../Types/common'

/** 
 * @component ToggleSwitch
 * @category An accessible/reusable toggle button
 * @package ORO UI Toolkit
 * @path lib/controls/toggle/oro.toggle.component
 * @param ToggleSwitchProps
 * @version 1.0
 * */

export function ToggleSwitch(props: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsChecked(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  function handleChange(event) {
    const isChecked = event.target.checked

    setIsChecked(isChecked)

    if (props.validator) {
      const err = props.validator(isChecked)
      setError(err)
    }

    if (props.onChange) {
      props.onChange(isChecked)
    }
  }

  function handleSwitchKeydown(event: React.KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    event.stopPropagation()

    if ((event.key == Keyboard.Enter) || (event.key == Keyboard.Return)) {
      event.preventDefault()
      handleChange(event)
    }
  }

  function prepareClassNames(): string {
    return classNames(
      styles.oroToggleSwitch,
      props.className ? props.className : ''
    )
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.togglebutton}
      error={error}>
      <div
        className={prepareClassNames()}
        tabIndex={0}
        onKeyDown={handleSwitchKeydown}>
        {
          props.falsyLabel &&
          <span className={styles.falsyLabel}>{props.falsyLabel}</span>
        }
        <label className={styles.switch}>
          <input className={styles.input}
            type="checkbox"
            disabled={props.disabled}
            checked={isChecked}
            onChange={handleChange} />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.truthyLabel}>{props.truthyLabel || 'ON'}</span>
      </div>
    </InputWrapper>
  )
}
