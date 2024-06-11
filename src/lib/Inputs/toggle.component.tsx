import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { Globe } from 'react-feather'

import styles from './styles.module.scss'
import { ToggleButtonProps, Option, RadioProps, YesNoButtonProps, YesNoRadioProps } from './types'

import { InputWrapper } from './input.component'
import { MultiConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { OptionWithJustification } from '../Form/types'
import { RichTextEditor } from '../RichTextEditor'
import { useTranslationHook } from '../i18n'
import { isRichTextEmpty } from '../util'
import classNames from 'classnames'

function PushButton (props: { children: JSX.Element | JSX.Element[], selected: boolean, disabled?: boolean, invalid?: boolean, onSelect: () => void }) {
  return (
    <div className={classnames(styles.pushButton, { [styles.pushed]: props.selected, [styles.disabled]: props.disabled, [styles.invalid]: props.invalid })} onClick={props.onSelect}>
      {props.children}
    </div>
  )
}

export function ToggleButtons (props: ToggleButtonProps) {
  const [state, setState] = useState<Option[]>([])
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value ? [props.value] : [])
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value?.path)
      setError(err)
    }
  }, [props.forceValidate])

  function handleSelection (option: Option) {
    if (!props.disabled) {
      const newState: Option[] = state[0]?.path === option.path ? [] : [option]

      setState(newState)

      if (props.validator) {
        const err = props.validator(newState[0]?.path)
        setError(err)
      }

      if (props.onChange) {
        props.onChange(newState[0])
      }
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={classNames(styles.togglebutton, { [styles.inTableCell]: props.inTableCell })}
      error={error}
    >
      {props.defaultOption &&
        <PushButton
          selected={state.some(stateOption => stateOption.path === props.defaultOption.path)}
          onSelect={() => handleSelection(props.defaultOption)}
        >
          <><Globe size="16px" /> {props.defaultOption.displayName}</>
        </PushButton>}

      <>
        {props.options && props.options.map((option, i) =>
          <PushButton
            selected={state.some(stateOption => stateOption.path === option.path)}
            onSelect={() => handleSelection(option)}
            key={i}
          >
            <>{option.displayName}</>
          </PushButton>)}
      </>
    </InputWrapper>
  )
}

export interface RadioPropsNew {
  id?: string
  name: string
  value?: Option
  options: Option[]
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    multiConfig?: MultiConfig
  }
  validator?: (value?) => string | null
  onChange?: (value: Option) => void
}

export function RadioNew (props: RadioPropsNew) {
  const [state, setState] = useState<Option | null>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly) {
      const err = props.validator(state)
      setError(err)
    }
  }, [props.config])

  function handleChange (value: string) {
    const selectedOption = props.options.find(option => option.path === value)
    setState(selectedOption)

    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      const err = props.validator(selectedOption)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(selectedOption)
    }
  }

  function getClass () {
    if (props.config?.multiConfig?.isButton) {
      return styles.oroPushButtonGroup
    } else {
      return styles.oroRadioGroup
    }
  }

  return (
    <InputWrapper
      required={!props.config.optional}
      classname={styles.togglebutton}
      error={error}
      inTableCell={props.inTableCell}
    >
      <div className={classnames(getClass(), { [styles.disabled]: props.config?.isReadOnly, [styles.inTableCell]: props.inTableCell, [styles.inTableCellError]: error })} data-test-id={props.id}>
        {props.options && props.options.map((option, i) =>
          <div key={i}>
            {props.config?.multiConfig?.isButton
              ? <PushButton
                  selected={state?.path === option.path}
                  onSelect={() => handleChange(option.path)}
                  disabled={props.config?.isReadOnly}
                  key={i}
                >
                  <>{option.displayName}</>
                </PushButton>
              : <div className={styles.radioItem}>
                  <input
                    type="radio"
                    id={`OroRadio${props.id}${i}`}
                    name={`OroRadio${props.id}${i}`}
                    value={option.path}
                    checked={state?.path === option.path}
                    disabled={props.config?.isReadOnly}
                    onChange={() => handleChange(option.path)}
                  />
                  <label htmlFor={`OroRadio${props.id}${i}`}>
                    <span className={styles.text}>{option.displayName}</span>
                  </label>
                </div>}
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

export interface RadioWithJustificationProps {
  id?: string
  name: string
  value?: OptionWithJustification
  options: Option[]
  placeholder?: string
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    multiConfig?: MultiConfig
  }
  validator?: (value?: OptionWithJustification) => string | null
  onChange?: (value: OptionWithJustification) => void
}

export function RadioWithJustification (props: RadioWithJustificationProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>()
  const [justification, setJustification] = useState<string>()

  const [optionTouched, setOptionTouched] = useState<boolean>(false)
  const [justificationTouched, setJustificationTouched] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [justificationError, setJustificationError] = useState<boolean>(false)
  const { t } = useTranslationHook()

  useEffect(() => {
    setSelectedOption(props.value?.option)
    setJustification(props.value?.justification)
  }, [props.value?.option, props.value?.justification])

  function validate (value?: OptionWithJustification) {
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      const err = props.validator(value)
      setError(err)
      setJustificationError(isRichTextEmpty(value.justification))
    } else {
      setError('')
      setJustificationError(false)
    }
  }

  useEffect(() => {
    if (props.config.forceValidate) {
      validate({
        option: selectedOption,
        justification
      })
    }
  }, [props.config])

  function handleChange (value: string) {
    setOptionTouched(true)
    const _selectedOption = props.options.find(option => option.path === value)
    setSelectedOption(_selectedOption)

    if (justificationTouched) {
      validate({
        option: _selectedOption,
        justification
      })
    }

    if (props.onChange) {
      props.onChange({
        option: _selectedOption,
        justification
      })
    }
  }

  function handleJustificationChange (value: string) {
    setJustificationTouched(true)
    setJustification(value)

    if (optionTouched) {
      validate({
        option: selectedOption,
        justification: value
      })
    }

    if (props.onChange) {
      props.onChange({
        option: selectedOption,
        justification: value
      })
    }
  }

  function onJustificationBlur () {
    validate({
      option: selectedOption,
      justification
    })

    if (props.onChange) {
      props.onChange({
        option: selectedOption,
        justification
      })
    }
  }

  function getClass () {
    if (props.config?.multiConfig?.isButton) {
      return styles.oroPushButtonGroup
    } else {
      return styles.oroRadioGroup
    }
  }

  return (<>
    <InputWrapper
      required={!props.config.optional}
      classname={styles.togglebutton}
      error={error}
      inTableCell={props.inTableCell}
    >
      <div className={classnames(styles.justifyWithRadio, { [styles.inTableCell]: props.inTableCell, [styles.inTableCellError]: error })}>
        <div className={classnames(getClass(), {[styles.disabled]: props.config?.isReadOnly})} data-test-id={props.id}>
          {props.options && props.options.map((option, i) =>
            <div key={i}>
              {props.config?.multiConfig?.isButton
                ? <PushButton
                    selected={selectedOption?.path === option.path}
                    invalid={!!error && !selectedOption?.path}
                    onSelect={() => handleChange(option.path)}
                    key={i}
                  >
                    <>{option.displayName}</>
                  </PushButton>
                : <div className={styles.radioItem}>
                    <input
                      type="radio"
                      id={`OroRadio${props.id}${i}`}
                      name={`OroRadio${props.id}${i}`}
                      value={option.path}
                      checked={selectedOption?.path === option.path}
                      onChange={() => handleChange(option.path)}
                    />
                    <label htmlFor={`OroRadio${props.id}${i}`}>
                      <span className={styles.text}>{option.displayName}</span>
                    </label>
                  </div>}
            </div>
          )}
        </div>

        <div className={styles.subGroup}>
          <RichTextEditor
            value={t("--justifyYourAnswer--")}
            className={`oro-rich-text-question `}
            readOnly={true}
            hideToolbar={true}
          />
          <RichTextEditor
            className={`oro-rich-text-answer ${justificationError ? 'error' : ''}`}
            placeholder={props.placeholder}
            value={justification}
            readOnly={false}
            hideToolbar={false}
            onChange={handleJustificationChange}
            onBlur={onJustificationBlur}
          />
        </div>
      </div>
    </InputWrapper>
  </>)
}

export function Radio (props: RadioProps) {
  const [state, setState] = useState<Option>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.validator && props.forceValidate && !props.optional && props.required && !props.isReadOnly) {
      const err = props.validator(props.value?.path)
      setError(err)
    }
  }, [props.forceValidate, props.optional])

  function handleChange (event) {
    const selectedOption = props.options.find(option => option.path === event.target.value)
    setState(selectedOption)

    if (props.required && !props.optional && !props.isReadOnly && props.validator) {
      const err = props.validator(selectedOption.path)
      setError(err)
    } else {
      setError(null)
    }

    if (props.onChange) {
      props.onChange(selectedOption)
    }
  }

  function getClass () {
    return props.showHorizontal ? styles['oroRadioGroupHorizontal'] : styles['oroRadioGroup']
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={classNames(styles.togglebutton, { [styles.inTableCell]: props.inTableCell, [styles.inTableCellError]: error && props.inTableCell })}
      error={error}
      inTableCell={props.inTableCell}
    >
      <div className={getClass()} data-test-id={props.id}>
        {props.options && props.options.map((option, i) =>
          <div className={styles.radioItem} key={i}>
            <input
              type="radio"
              id={`OroRadio${props.id}${i}`}
              name={`OroRadio${props.name}${i}`}
              value={option.path}
              checked={state?.path === option.path}
              disabled={props.disabled}
              onChange={handleChange}
            />
            {!props.showPathString && <label htmlFor={`OroRadio${props.id}${i}`}>
              <span className={styles.text}>{option.displayName}</span>
            </label>}
            {props.showPathString && <div className={styles.labelContainer}>
              <label htmlFor={`OroRadio${props.id}${i}`}>
                <span className={styles.text}>{option.displayName}</span>
              </label>
              <span className={styles.path}>in {option.pathDisplayName}</span>
            </div>}
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

export function YesNoRadio (props: YesNoRadioProps) {
  const [value, setValue] = useState<boolean | undefined>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      setError(props.validator(value))
    }
  }, [props.forceValidate])

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
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.togglebutton}
      error={error}
    >
      <div className={styles.oroRadioGroupHorizontal} data-test-id={props.id}>
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
    </InputWrapper>
  )
}

export function YesNoButtons (props: YesNoButtonProps) {
  const [value, setValue] = useState<boolean | undefined>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  function handleClick (value: boolean) {
    if (!props.disabled) {
      setValue(value)

      if (props.validator) {
        const err = props.validator(value)
        setError(err)
      }

      if (props.onChange) {
        props.onChange(value)
      }
    }
  }

  return (
    <InputWrapper
      label={props.label}
      description={props.description}
      required={props.required}
      classname={styles.yesnobutton}
      error={error}
    >
      <div className={classnames(styles.yesNo, { [styles.disabled]: props.disabled })}>
        <PushButton
          selected={value === true}
          disabled={props.disabled}
          onSelect={() => handleClick(true)}
        >
          <>Yes</>
        </PushButton>

        <PushButton
          selected={value === false}
          disabled={props.disabled}
          onSelect={() => handleClick(false)}
        >
          <>No</>
        </PushButton>
      </div>
    </InputWrapper>
  )
}
