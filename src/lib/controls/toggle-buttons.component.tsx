import React, { useEffect, useState } from 'react'

import { Option } from './../Types'
import { PushButton } from './yes-no.component'

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { getI18Text as getI18ControlText } from '../i18n'

interface ToggleProps {
  value?: Option | Option[]
  options: Option[]
  selectMultiple?: boolean
  optional?: boolean
  isReadOnly?: boolean
  placeholder?: string
  disabled?: boolean
  forceValidate: boolean
  onChange?: (value: Option | Option[]) => void
}

export function ToggleButtonsControl (props: ToggleProps) {
  const [state, setState] = useState<Option[]>([])
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    if (props.value) {
      setState(props.selectMultiple ? (props.value as Option[]) : [(props.value as Option)])
    }
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && !state.length && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    } else {
      setError(null)
    }
  }, [props.forceValidate, props.optional, state])

  function handleSelection (option: Option, isSelected: boolean) {
    if (!props.disabled) {
      let stateCopy = [...state]
      
      if (props.selectMultiple) {
        if (isSelected) {
          const index = stateCopy.findIndex(opt => opt.path === option.path);
          if (index > -1) {
            stateCopy.splice(index, 1);
          }
        } else {
          stateCopy.push(option)
        }
      } else {
        if (isSelected) {
          stateCopy = []
        } else {
          stateCopy = [option]
        }
      }

      setState(stateCopy)
      if (!stateCopy.length && !props.optional && !props.isReadOnly) {
        setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
      } else {
        setError(null)
      }

      if (props.onChange) {
        props.onChange(props.selectMultiple ? stateCopy : stateCopy[0])
      }
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.togglebutton}>
        {props.options && props.options.map((option, i) => {
          const isSelected = state.some(stateOption => stateOption.path === option.path)
          return (
            <PushButton
              selected={isSelected}
              disabled={props.disabled}
              onSelect={() => handleSelection(option, isSelected)}
              key={i}
            >
              <>{option.displayName}</>
            </PushButton>
          )
        })}
      </div>
      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
        }
    </div>
  )
}