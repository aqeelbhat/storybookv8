import React, { useEffect, useState } from 'react'

import { Option } from '../../Types'
import { PaymentModeType } from '../BankInfoV3'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { CountrySelector } from '../../Inputs/select.component'

import styles from './styles.module.scss'

// TODO: make this configurable:
export const PREFERRED_COUNTRIES = ['US', 'GB', 'DE', 'CH']

interface BankCountrySelectorProps {
  forMode: PaymentModeType
  value?: Option
  options?: Option[]
  onChange: (country: Option) => void
}

export function BankCountrySelector (props: BankCountrySelectorProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const [selected, setSelected] = useState<Option>()
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    if (props.value) {
      setSelected(props.value)
    }
  }, [props.value])

  useEffect(() => {
    if (props.options && props.options.length === 1) {
      selectOption(props.options[0])
      setOptions(props.options)
    } else {
      // show preferred contries at the top
      const _options = props.options ? [...props.options] : []
      _options?.sort((a, b) => {
        if (PREFERRED_COUNTRIES.includes(a?.path)) {
          return -1
        }
        return 0
      })
      setOptions(_options)
    }
  }, [props.options])

  function selectOption (country: Option) {
    setSelected(country)
    props.onChange(country)
  }

  return (
    <div className={styles.bankCountrySelector}>
      <div className={styles.title}>{t('--selectYourBankCountry--')}</div>

      <div className={styles.optionList}>
        <CountrySelector
          placeholder={t('--searchACountryByNameOrCountry--')}
          options={options}
          value={selected}
          onChange={selectOption}
        />
      </div>
    </div>
  )
}
