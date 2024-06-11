import React, { useEffect, useState } from 'react'
import { PaymentMode, PaymentModeFormProps, PaymentModeType } from './types'
import { Option } from '../../Types'

import styles from './style.module.scss'
import PaymentModeIcon from './../assets/payment-mode.svg'
import { Check, ChevronDown } from 'react-feather'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import classNames from 'classnames'
import { mapAlpha2codeToDisplayName } from '../../util'
import { Trans } from 'react-i18next'

export function PaymentModeList (props: PaymentModeFormProps) {
  const PaymentModeTypeDisplayNames = {
    wire: getI18Text('--wire--'),
    ach: getI18Text('--ach--'),
    check: getI18Text('--check--'),
    online: getI18Text('--online--'),
    invoice: getI18Text('--invoice--')
  }
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([])
  const [paymentModeTypeOptions, setPaymentModeTypeOptions] = useState<{ [country: string]: Option[] }>({})

  useEffect(() => {
    if (props.paymentModeOptions) {
      const newPaymentModeTypeOptions = {}
      for (const [country, types] of Object.entries(props.paymentModeOptions)) {
        const options = types.map(type => {
          return { id: type, path: type, displayName: PaymentModeTypeDisplayNames[type] }
        })
        newPaymentModeTypeOptions[country] = options
      }
      setPaymentModeTypeOptions(newPaymentModeTypeOptions)
    }
  }, [props.paymentModeOptions])
  

  function handleModeChange (paymentModeIndex: number, newMode: string) {
    const paymentModeCopy = {...(paymentModes[paymentModeIndex])}
    paymentModeCopy.type = newMode as PaymentModeType

    const paymentModesCopy = [...paymentModes]
    paymentModesCopy[paymentModeIndex] = paymentModeCopy
    setPaymentModes(paymentModesCopy)

    if (props.onChange) {
      props.onChange(paymentModesCopy)
    }
  }

  function handleCurrencyChange (paymentModeIndex: number, newCurrency: string) {
    const paymentModeCopy = {...(paymentModes[paymentModeIndex])}
    paymentModeCopy.currencyCode = newCurrency

    const paymentModesCopy = [...paymentModes]
    paymentModesCopy[paymentModeIndex] = paymentModeCopy
    setPaymentModes(paymentModesCopy)

    if (props.onChange) {
      props.onChange(paymentModesCopy)
    }
  }

  useEffect(() => {
    setPaymentModes(props.data || [])
  }, [props.data])

  function getCurrencyOptions (paymentMode: PaymentMode) {
    if (props.bankCurrency && props.currencyOptions) {
      return props.currencyOptions.filter(currencyOption => {
        return (currencyOption.path === props.bankCurrency) || (currencyOption.path === paymentMode.currencyCode)
      })
    } else {
      return props.currencyOptions || []
    }
  }

  return (
    <div className={styles.paymentModeForm}>
      {(!paymentModes || paymentModes.length < 1) &&
        <div className={styles.paymentMode}>
          <div className={styles.description}>{t('--selectEntityToViewPayment--')}</div>
        </div>}

      {paymentModes && paymentModes.length > 0 && paymentModes.map((mode, i) =>
        <div className={styles.paymentMode} key={i}>
          <div className={styles.icon}>
            {i === 0 && <img src={PaymentModeIcon} />}
          </div>

          <div className={styles.description}>
            {mode.companyEntityCountry !== props.bankCountry
              ? <Trans t={t} i18nKey="--paymentModeFromWillBeThroughInWithCurrency--" values={{ country: mapAlpha2codeToDisplayName(mode.companyEntityCountry) }}>
                  {`Payment made from `}
                  <div className={styles.higlight}>
                    {mapAlpha2codeToDisplayName(mode.companyEntityCountry)}
                  </div>
                  {` will be through `}
                  <InlineDropdown
                    label={'Choose payment mode'}
                    options={paymentModeTypeOptions[mode.companyEntityCountry] || []}
                    selected={{id: mode.type, path: mode.type, displayName: PaymentModeTypeDisplayNames[mode.type]}}
                    onSelect={val => handleModeChange(i, val)}
                  />
                  {` in `}
                  <InlineDropdown
                    label={'Choose payment currency'}
                    options={getCurrencyOptions(mode)}
                    selected={{id: mode.currencyCode, path: mode.currencyCode, displayName: mode.currencyCode}}
                    onSelect={val => handleCurrencyChange(i, val)}
                  />
                </Trans>
              : <Trans t={t} i18nKey="--paymentModeFromWillBeThroughInWithoutCurrency--" values={{ country: mapAlpha2codeToDisplayName(mode.companyEntityCountry) }}>
                  {`Payment made from `}
                  <div className={styles.higlight}>
                    {mapAlpha2codeToDisplayName(mode.companyEntityCountry)}
                  </div>
                  {` will be through `}
                  <InlineDropdown
                    label={'Choose payment mode'}
                    options={paymentModeTypeOptions[mode.companyEntityCountry] || []}
                    selected={{id: mode.type, path: mode.type, displayName: PaymentModeTypeDisplayNames[mode.type]}}
                    onSelect={val => handleModeChange(i, val)}
                  />
                </Trans>}
          </div>
        </div>)}
    </div>
  )
}

function InlineDropdown (props: {
  label?: string
  options?: Option[],
  selected?: Option,
  onSelect?: (value: string) => void
}) {
  const [selected, setSelected] = useState<string>()
  const [isOpen, setIsOpen] = useState<boolean>()

  useEffect(() => {
    setSelected(props.selected?.displayName)
  }, [props.selected])

  function onSelect (event, value: string) {
    event.stopPropagation()

    setIsOpen(false)
    if (value !== selected) {
      setSelected(value)
      
      if (props.onSelect) {
        props.onSelect(value)
      }
    }
  }

  return (
    <div className={styles.inlineDropdown}>
      {(props.options && props.options.length > 1)
        ? <div className={styles.value} onClick={() => setIsOpen(true)}>
            {selected}<ChevronDown size={16} color={'var(--warm-neutral-shade-200)'} />
          </div>
        : <span className={styles.higlight}>{selected}</span>}

      {isOpen &&
        <div className={styles.optionList}>
          {props.label && <div className={classNames(styles.option, styles.label)}>{props.label}</div>}

          {props.options?.map((option, i) =>
            <div
              key={i}
              className={classNames(styles.option, {[styles.selected]: option.path === props.selected?.path})}
              onClick={(e) => onSelect(e, option.path)}
            >
              {option.displayName}
              <div className={styles.spread} />
              {option.path === props.selected?.path && <Check size={16} color={'var(--warm-neutral-shade-200)'} />}
            </div>)}
        </div>}

      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
    </div>
  )
}
