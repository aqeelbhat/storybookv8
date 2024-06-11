import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { Eye, EyeOff } from 'react-feather'

import { getI18Text } from '../i18n'
import styles from './styles.module.scss'
import { TextBoxProps, QuantityBoxProps, EncryptedBoxProps, Option, NumberBoxProps } from './types'

import { InputWrapper } from './input.component'
import { CurrencyMaskConfig, DEFAULT_DECIMAL_SYMBOL, DEFAULT_THOUSAND_SEPARATOR, getCurrencyMaskConfig, getCurrencySeparators, getValueFromAmount, setOptionSelected } from './utils.service'
import { emptyEcncryptedData } from '../Form/types'
import { MultiLevelSelect } from '../MultiLevelSelect'
import { EncryptedData } from '../Types'
import { getSessionLocale } from '../sessionStorage'
import { getMaskedString } from '../util'

export function TextBox (props: TextBoxProps) {
  const [isSameAs, setIsSameAs] = useState<boolean>(false)
  const [state, setState] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    setIsSameAs(props.isSameAs)
  }, [props.isSameAs])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate, props.value])

  function handleChange (event) {
    setError('')
    setState(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function handleValidation (event) {
    if (props.validator) {
      const err = props.validator(event.target.value)
      setError(err)
    }
  }

  function toggleSaveAs () {
    setIsSameAs(!isSameAs)
    props.onSameAsChange && props.onSameAsChange(!isSameAs)
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.texbox}
      error={error}
      infoText={props.infoText}
      warning={props.warning}
      inTableCell={props.inTableCell}
    >
      {props.description &&
        <div className={styles.description}>{props.description}</div>}

      {props.enableSameAs &&
        <div className={styles.sameAs} onClick={toggleSaveAs}>
          <input
            className="oro-checkbox"
            type="checkbox"
            checked={isSameAs}
            readOnly={true}
          />
          <div className={styles.label}>{getI18Text('Same as', { label: props.sameAsLabel || '' })}</div>
        </div>}

      {(!props.enableSameAs || !isSameAs) &&
        <input
          id={props.id}
          type="text"
          className={classnames({
            [styles.inTableCell]: props.inTableCell,
            [styles.inTableCellInvalid]: props.inTableCell && error && !props.warning,
            [styles.invalid]: !props.inTableCell && error && !props.warning
          })}
          placeholder={props.placeholder}
          value={state}
          disabled={props.disabled}
          onChange={handleChange}
          onBlur={handleValidation}
        />}
    </InputWrapper>
  )
}

export function QuantityBox (props: QuantityBoxProps) {
  const [state, setState] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  function handleChange (event) {
    setState(event.target.value)
    if (props.validator) {
      const err = props.validator(event.target.value)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.quantitybox}
      error={error}
    >
      <input
        type="text"
        className={classnames({ [styles.invalid]: error })}
        placeholder={props.placeholder}
        value={state}
        disabled={props.disabled}
        onChange={handleChange}
        onBlur={handleChange}
      />
      <div className={classnames(styles.unit, { [styles.invalid]: error })}>{props.unit}</div>
    </InputWrapper>
  )
}

export function Currency (props: QuantityBoxProps) {
  const [state, setState] = useState<string>('')
  const [unitOptions, setUnitOptions] = useState<Array<Option>>([])
  const [error, setError] = useState<string | null>()
  const [currencyMaskSymbols, setCurrencyMaskSymbols] = useState<{ decimalSymbol?: string, thousandsSeparatorSymbol?: string }>({})
  const [currencyMask, setCurrencyMask] = useState<any>(createNumberMask(getCurrencyMaskConfig({ allowNegative: props.allowNegative })))
  const [validate, setValidate] = useState(false)

  useEffect(() => {
    const { decimalSymbol, thousandsSeparatorSymbol } = getCurrencySeparators(props.locale)
    setCurrencyMaskSymbols({ decimalSymbol, thousandsSeparatorSymbol })
    const updatedCurrencyMask = createNumberMask(getCurrencyMaskConfig({
      allowNegative: props.allowNegative,
      decimalSymbol: decimalSymbol || DEFAULT_DECIMAL_SYMBOL,
      thousandsSeparatorSymbol: thousandsSeparatorSymbol || DEFAULT_THOUSAND_SEPARATOR
    }))
    setCurrencyMask(() => updatedCurrencyMask)
  }, [props.locale, props.allowNegative])

  useEffect(() => {
    setState(props.value || '')
  }, [props.value])

  useEffect(() => {
    if (validate && props.validator) {
      const err = props.validator(props.value?.toString())
      setError(err)
    }
  }, [validate])

  useEffect(() => {
    setValidate(props.forceValidate)
  }, [props.forceValidate])

  useEffect(() => {
    // set 'props.value' selected by default
    const optionsCopy = JSON.parse(JSON.stringify(props.unitOptions || []))
    setOptionSelected(optionsCopy, [props.unit])
    setUnitOptions(optionsCopy)
  }, [props.unitOptions, props.unit])

  function handleChange (value: string) {
    setState(value || '')

    const cleanedupValue = getValueFromAmount(value)
    if (props.validator) {
      const err = props.validator(cleanedupValue)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(value || '')
    }
  }

  function handleUnitChange (options: Option[]) {
    if (props.onUnitChange) {
      props.onUnitChange(options[0]?.path || '')
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.quantitybox}
      error={error}
      inTableCell={props.inTableCell}
    >
      <MaskedInput
        key={`${currencyMaskSymbols?.decimalSymbol}${currencyMaskSymbols?.thousandsSeparatorSymbol}`}
        mask={currencyMask}
        className={classnames({ [styles.inTableCell]: props.inTableCell, [styles.invalid]: error && !props.inTableCell, [styles.inTableCellInvalid]: error && props.inTableCell })}
        type="text"
        value={state}
        placeholder={`0${currencyMaskSymbols?.decimalSymbol || '.'}00`}
        disabled={props.disabled}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => handleChange(e.target.value)}
      />
      <MultiLevelSelect
        classnames={[styles.multilevel, styles.unit, error ? styles.invalid : '', props.inTableCell ? styles.inTableCell : '']}
        options={unitOptions}
        inTableCell={props.inTableCell}
        disabled={props.disabled || props.disableUnit}
        onChange={handleUnitChange}
        config={
          {
            hideClearButton: props.hideClearButton,
            noBorder: props.inTableCell
          }
        }
      />
    </InputWrapper>
  )
}

export function NumberBox (props: NumberBoxProps) {

  const [state, setState] = useState<string>('')
  const [error, setError] = useState<string | null>()

  const [currencyMask] = useState<any>(() => {
    const { decimalSymbol, thousandsSeparatorSymbol } = getCurrencySeparators(getSessionLocale())
    return createNumberMask({
      ...CurrencyMaskConfig,
      decimalSymbol: decimalSymbol || DEFAULT_DECIMAL_SYMBOL,
      thousandsSeparatorSymbol: thousandsSeparatorSymbol || DEFAULT_THOUSAND_SEPARATOR,
      allowDecimal: !props.hideDecimal,
      decimalLimit: props.decimalLimit || 2, // how many digits allowed after the decimal
      allowNegative: props.allowNegative || false,
    })
  })

  useEffect(() => {
    setState(props.value || '')
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value?.toString())
      setError(err)
    }
  }, [props.forceValidate])

  function handleChange (value: string) {
    setState(value || '')

    const cleanedupValue = getValueFromAmount(value)
    if (cleanedupValue !== "-" && props.validator) {
      const err = props.validator(cleanedupValue)
      setError(err)
    }
    if (cleanedupValue !== "-" && props.onChange) {
      props.onChange(cleanedupValue)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={`${styles.quantitybox} ${styles.numberbox}`}
      error={error}
      inTableCell={props.inTableCell}
    >
      <MaskedInput
        mask={currencyMask}
        className={classnames({ [styles.inTableCell]: props.inTableCell, [styles.invalid]: error && !props.inTableCell, [styles.inTableCellInvalid]: props.inTableCell && error })}
        type="text"
        value={state}
        placeholder={props.placeholder || (props.hideDecimal ? '0' : '0.00')}
        disabled={props.disabled}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => handleChange(e.target.value)}
      />
    </InputWrapper>
  )
}

export function TextArea (props: TextBoxProps) {
  const [state, setState] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  function handleChange (event) {
    setState(event.target.value)
    if (props.validator) {
      const err = props.validator(event.target.value)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.textarea}
      error={error}
    >
      <textarea
        className={classnames({ [styles.invalid]: error })}
        placeholder={props.placeholder}
        value={state}
        disabled={props.disabled}
        onChange={handleChange}
        onBlur={handleChange}
      />
    </InputWrapper>
  )
}

export function EncryptedDataBox (props: EncryptedBoxProps) {
  const [inputType, setInputType] = useState<'text' | 'password'>('password')
  const [state, setState] = useState<EncryptedData>(emptyEcncryptedData)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value || emptyEcncryptedData)
  }, [props.value])

  useEffect(() => {
    setInputType((props.unmaskByDefault) ? 'text' : 'password')
  }, [props.unmaskByDefault])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(state.unencryptedValue || state.maskedValue || '')
      setError(err)
    }
  }, [props.forceValidate, state])

  function isValueHidden (): boolean {
    return inputType === 'password'
  }

  function handleChange (event) {
    setError('')
    const newState = { ...state, unencryptedValue: event.target.value, maskedValue: '' }
    setState(newState)
    if (props.onChange) {
      props.onChange(newState)
    }
  }

  function handleValidation (event) {
    if (props.onBlur) {
      props.onBlur(state)
    }
    if (props.validator) {
      const err = props.validator(event.target.value || state.maskedValue || '')
      setError(err)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.encryptedbox}
      description={props.description}
      error={error}
      warning={props.warning}
    >
      <input
        type={state.unencryptedValue ? inputType : 'text'}
        autoComplete="new-password"
        className={classnames(styles.darkPlaceholder, { [styles.invalid]: error && !props.warning })}
        value={state.unencryptedValue || state.maskedValue || ''}
        disabled={props.disabled}
        onChange={handleChange}
        onBlur={handleValidation}
      />
      {state.unencryptedValue &&
        <>
          {!isValueHidden() && <Eye className={styles.showHide} size={20} color={'var(--warm-neutral-shade-200)'} onClick={() => setInputType('password')} />}
          {isValueHidden() && <EyeOff className={styles.showHide} size={20} color={'var(--warm-neutral-shade-200)'} onClick={() => setInputType('text')} />}
        </>}
    </InputWrapper>
  )
}

export function EncryptedValueReadOnly (props: {
  value?: EncryptedData
}) {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <div className={styles.encryptedValue}>
      {visible
        ? props.value?.unencryptedValue || ''
        : props.value?.maskedValue || getMaskedString(props.value?.unencryptedValue) || '*****'}
      {props.value?.unencryptedValue && <>
        {visible
          ? <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setVisible(false)} />
          : <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setVisible(true)} />}
      </>}
    </div>
  )
}
