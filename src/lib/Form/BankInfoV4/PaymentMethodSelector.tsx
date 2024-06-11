import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { ArrowRight } from 'react-feather'

import { getPaymentModeOptions, PaymentOption } from './types'
import { PaymentModeConfig, PaymentModeType } from '../BankInfoV3'
import { Option } from './../../Types'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { mapToInternalModeType } from './utils'

import styles from './styles.module.scss'

interface PaymentMethodProps {
  value?: PaymentModeType
  companyEntityOptions: Option[]
  paymentModeConfig: PaymentModeConfig[]
  onChange: (mode: string) => void
}

export function PaymentMethodSelector (props: PaymentMethodProps) {
  const PaymentModeOptions = getPaymentModeOptions()
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const [paymentModeOptions, setPaymentModeOptions] = useState<PaymentOption[]>([])
  const [selectedCode, setSelectedCode] = useState<string>('')

  useEffect(() => {
    if (props.companyEntityOptions.length > 0 && props.paymentModeConfig) {
      // Filter modes by entity countries

      const _paymentModeConfig: { [country: string]: { domestic: PaymentModeType[], international: PaymentModeType[] } } = {}
      if (props.paymentModeConfig) {
        props.paymentModeConfig.forEach(config => {
          _paymentModeConfig[config.alpha2Code] = {
            domestic: config.domestic || [],
            international: config.international || [],
          }
        })
      }

      // Available payment types
      let modes = []
      props.companyEntityOptions.forEach(entity => {
        const entityCountry = entity.customData?.other?.countryCode

        const configForEntity = _paymentModeConfig[entityCountry] || _paymentModeConfig['default'] || { domestic: [], international: [] }
        const domesticModes = (configForEntity.domestic || []).map(mapToInternalModeType)
        const internationalModes = (configForEntity.international || []).map(mapToInternalModeType)
        modes = [...domesticModes, ...internationalModes]
      })
      const availableModes = Array.from(new Set(modes)) // extract unique

      // filter availableModes out of PaymentModeOptions
      const applicableModeOptions = PaymentModeOptions.filter(option => availableModes.some(mode => mode === option.code))
      setPaymentModeOptions(applicableModeOptions)

      if (applicableModeOptions.length === 1) {
        selectMode(applicableModeOptions[0].code)
      }
    } else {
      setPaymentModeOptions(PaymentModeOptions)
    }
  }, [props.companyEntityOptions, props.paymentModeConfig])

  useEffect(() => {
    if (props.value) {
      setSelectedCode(props.value)
    }
  }, [props.value])

  function selectMode (code: string) {
    setSelectedCode(code)
    props.onChange(code)
  }

  return (
    <div className={styles.paymentMethodSelector}>
      <div className={styles.optionList}>
        {paymentModeOptions.map((option, i) =>
          <div className={classnames(styles.option, {[styles.selected]: option.code === selectedCode})} onClick={() => selectMode(option.code)} key={i} tabIndex={0}>
            <div className={styles.logo}>
              <img src={option.logo} />
            </div>
            <div className={styles.detail}>
              <div className={styles.name}>{option.displayName}</div>
              <div className={styles.description}>{option.description}</div>
            </div>
            <ArrowRight className={styles.arrow} size={20} strokeWidth={'2px'} color='var(--warm-neutral-shade-200)'/>
          </div>)}
      </div>
    </div>
  )
}
