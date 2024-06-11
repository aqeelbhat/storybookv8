/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { Option } from './../../Types'
import { Check, ChevronDown, Edit3 } from 'react-feather'
import classNames from 'classnames'
import { Grid } from '@mui/material'
import { Trans } from 'react-i18next'

import { PaymentMode, PaymentModeFormProps, PaymentModeType } from '../BankInfoV3/types'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import { mapAlpha2codeToDisplayName } from '../../util'
import { MultiSelect } from '../../Inputs'
import { COL3, isEmpty } from '../util'

import styles from '../BankInfoV3/style.module.scss'
import PaymentModeIcon from './../assets/payment-mode.svg'

function getEntityContries (entities: Option[]): Option[] {
  if (entities) {
    return entities.filter(entity => entity.customData?.other?.countryCode).map(entity => {
      const countryCode = entity.customData?.other?.countryCode
      return {
        id: countryCode,
        path: countryCode,
        displayName: mapAlpha2codeToDisplayName(countryCode),
        selectable: true
      }
    })
  }

  return []
}

export function PaymentModeList (props: PaymentModeFormProps) {
  const PaymentModeTypeDisplayNames = {
    wire: getI18Text('--wire--'),
    ach: getI18Text('--ach--'),
    check: getI18Text('--check--'),
    online: getI18Text('--online--'),
    invoice: getI18Text('--invoice--'),
    bankgorot: getI18Text('--bankgorot--'),
    directdebit: getI18Text('--directDebit--')
  }
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([])
  const [paymentModeTypeOptions, setPaymentModeTypeOptions] = useState<{ [country: string]: Option[] }>({})
  const [companyEntitiesVisible, setCompanyEntitiesVisible] = useState<boolean>(false)

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

  function handleCountryChange (options: Option[]) {
    if (props.onEntityChange) {
      const entities = []
      options.forEach(country => {
        props.companyEntityOptions.forEach(entity => {
          if (entity.customData?.other?.countryCode === country.path) {
            entities.push(entity)
          }
        })
      })
      props.onEntityChange(entities)
    }
  }

  return (
    <div className={styles.paymentModeForm}>
      <div className={`${styles.paymentMode} ${styles.title}`}>
        <div className={styles.icon}>
          <img src={PaymentModeIcon} />
        </div>
        <div className={styles.description}>{t('--paymentMethods--')}</div>
      </div>

      {(!paymentModes || paymentModes.length < 1) &&
        <div className={styles.paymentMode}>
          <div className={styles.description}>{t('--selectEntityToViewPayment--')}</div>
        </div>}

      {props.canShowEntities &&
        <div className={styles.paymentMode}>
          <div className={styles.icon}></div>
          <div className={styles.description}>
            <Grid item xs={COL3}>
              <MultiSelect
                label={t('--entityRegionsThatCanMakePayment--')}
                value={getEntityContries(props.companyEntities)}
                options={getEntityContries(props.companyEntityOptions)}
                required
                forceValidate={props.forceValidate}
                onChange={handleCountryChange}
              />
            </Grid>
          </div>
        </div>}

      {paymentModes && paymentModes.length > 0 && paymentModes.map((mode, i) =>
        <div className={styles.paymentMode} key={i}>
          <div className={styles.icon}></div>

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

      {props.canShowEntities &&
        <div className={`${styles.paymentMode} ${styles.footer}`}>
          <div className={styles.icon}></div>
          <div className={styles.description}>
            {companyEntitiesVisible
              ? <Grid item xs={COL3}>
                  <MultiSelect
                    label={t("--entitiesThatCanMakePayments--")}
                    value={props.companyEntities}
                    options={props.companyEntityOptions}
                    required={true}
                    forceValidate={props.forceValidate}
                    fetchChildren={props.fetchEntityChildren}
                    onSearch={props.onEntitySearch}
                    validator={(value) => isEmpty(value) ? getI18Text("is required field",{ label: t("--companyEntities--") }) : ''}
                    onChange={props.onEntityChange}
                  />
                </Grid>
                
              : <>
                  <span className={styles.higlight}>{t('--note--')}: </span>
                  <Trans t={t} i18nKey="--thisAllowsPaymentFrom--">
                    {'This allows payment from'}
                    <CompanyEntitiesDisplayText value={props.companyEntities} />
                  </Trans>
                  <span className={styles.link} onClick={() => setCompanyEntitiesVisible(true)}><Edit3 size={18} color='var(--warm-prime-azure)' /> {t('--change--')}</span>
                </>}
          </div>
        </div>}
    </div>
  )
}

function CompanyEntitiesDisplayText (props: {
  value?: Option[]
}) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const [entityNames, setEntityNames] = useState<string[]>([])

  useEffect(() => {
    if (props.value) {
      const _entityNames: string[] = props.value.map(entity => {
        return `${entity.displayName} (${mapAlpha2codeToDisplayName(entity.customData?.other?.countryCode)})`
      })
      setEntityNames(_entityNames)
    }
  }, [props.value])

  return (
    <span>{entityNames[0]}<span className={styles.higlight}>{(entityNames.length > 1) ? `, ${t('--plusMore--', { count: entityNames.length - 1})}` : ''}</span></span>
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
