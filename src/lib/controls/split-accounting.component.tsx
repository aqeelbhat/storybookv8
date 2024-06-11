import React, { useEffect, useState } from 'react'
import { Plus, X } from 'react-feather'

import { Option, mapMoney } from '../Types'
import { IDRef, Money, SplitAccounting } from '../Types/common'
import { SplitAccountingConfig, SplitType } from '../CustomFormDefinition/types/CustomFormModel'
import { DEFAULT_CURRENCY, mapCurrencyToSymbol } from '../util'
import { DropdownControlNew } from './drop-down.component'
import { mapCost, mapIDRefToOption, mapOptionToIDRef } from '../Form/util'
import { NumberControlNew } from './number.component'
import { costValidator, numberValidator, singleSelectValidator } from '../CustomFormDefinition/View/validator.service'
import { MoneyControlNew } from './money.component'
import { Cost } from '../Form'
import { Error } from './atoms'
import { getI18Text as getI18ControlText, useTranslationHook } from '../i18n'

import styles from './style.module.scss'
import { getSessionLocale } from '../sessionStorage'

interface SplitAccountingControlProps {
  id?: string
  placeholder?: string
  value?: SplitAccounting[]
  options?: Option[]
  readOnly?: boolean
  config?: {
    optional?: boolean
    forceValidate?: boolean
    splitAccountingConfig?: SplitAccountingConfig
    locale: string
  }
  additionalOptions: {
    currency?: Option[]
    defaultCurrency?: string
    userSelectedCurrency?: string
  }
  dataFetchers?: {
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  }
  validator?: (value?: SplitAccounting[]) => string | null
  onChange?: (value: SplitAccounting[]) => void
}

export function SplitAccountingControl (props: SplitAccountingControlProps) {
  const [state, setState] = useState<SplitAccounting[]>([{}])
  const [error, setError] = useState<string | null>()
  const { t } = useTranslationHook()

  useEffect(() => {
    setState((props.value && props.value.length > 0) ? props.value : [{}])
  }, [props.value])

  function triggerValidation (_state?: SplitAccounting[]) {
    if (!props.config?.optional && !props.readOnly && props.validator) {
      setError(props.validator(_state))
    }
  }

  useEffect(() => {
    if (props.config?.forceValidate) {
      triggerValidation(state)
    }
  }, [props.config?.forceValidate])

  function addSplit () {
    const updatedSplitList = [...state, {}]
    setState(updatedSplitList)

    if (!props.config?.optional && !props.readOnly) {
      setError((!updatedSplitList || updatedSplitList.length < 1) ? getI18ControlText('--validationMessages--.--fieldRequired--') : '')
    }
    if (props.onChange) {
      props.onChange(updatedSplitList)
    }
  }

  function handleSplitChange (value: SplitAccounting, index: number) {
    const stateCopy = [...state]
    stateCopy[index] = value
    setState(stateCopy)

    setError('')
    if (props.onChange) {
      props.onChange(stateCopy)
    }
  }

  function deleteSplit (index: number) {
    const stateCopy = [...state]
    stateCopy.splice(index, 1)
    setState(stateCopy)

    if (!props.config?.optional && !props.readOnly) {
      setError((!stateCopy || stateCopy.length < 1) ? getI18ControlText('--validationMessages--.--fieldRequired--') : '')
    }
    if (props.onChange) {
      props.onChange(stateCopy)
    }
  }

  function getTypeSymbol () {
    if (props.config?.splitAccountingConfig?.type !== SplitType.amount) {
      return '%'
    } else {
      return mapCurrencyToSymbol(props.additionalOptions?.defaultCurrency || state?.[0]?.amount?.currency || DEFAULT_CURRENCY)
    }
  }

  return (
    <div>
      <div className={styles.splitAccounting} data-test-id={props.id}>
        <div className={`${styles.split} ${styles.header}`}>
          <div className={`${styles.field} ${styles.type}`}>{props.config?.splitAccountingConfig?.masterdataType || ''}</div>
          <div className={`${styles.field} ${styles.value}`}>{props.config?.splitAccountingConfig?.type || ''} ({getTypeSymbol()})</div>
        </div>

        {state?.map((split, i) =>
          <Split
            key={split.id?.id || i}
            data={split}
            splitType={props.config?.splitAccountingConfig?.type}
            options={props.options}
            additionalOptions={props.additionalOptions}
            dataFetchers={props.dataFetchers}
            forceValidate={props.config?.forceValidate}
            allowDelete={state?.length > 1}
            onChange={(val) => handleSplitChange(val, i)}
            onDelete={() => deleteSplit(i)}
          />)}

        <div className={`${styles.split}`}>
          <div className={`${styles.field} ${styles.type}`}>
            <button className={`${styles.addActionBtn} ${styles.mrgLeft35}`} onClick={addSplit}>
              <Plus size={18} color="var(--warm-neutral-shade-200)" />
              <span>{t("--addAnotherSplit--")}</span>
            </button>
          </div>
          <div className={`${styles.field} ${styles.value}`}></div>
        </div>
      </div>

      {error && <Error>{error}</Error>}
    </div>
  )
}

function Split (props: {
  data: SplitAccounting
  splitType: SplitType
  options?: Option[]
  forceValidate?: boolean
  allowDelete?: boolean
  additionalOptions: {
    currency?: Option[]
    defaultCurrency?: string
    userSelectedCurrency?: string
  }
  dataFetchers?: {
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    searchOptions?: (keyword?: string) => Promise<Option[]>
  }
  onChange?: (value: SplitAccounting) => void
  onDelete?: () => void
}) {
  const [id, setId] = useState<IDRef | null>()
  const [percentage, setPercentage] = useState<number | null>()
  const [amount, setAmount] = useState<Money | null>()

  useEffect(() => {
    if (props.data) {
      setId(props.data?.id)
      switch (props.splitType) {
        case SplitType.amount:
          setAmount(props.data.amount || { amount: 0, currency: props.additionalOptions?.defaultCurrency || DEFAULT_CURRENCY })
          break
        default:
          setPercentage(props.data.percentage)
      }
    }
  }, [props.data])

  function getSplitData (): SplitAccounting {
    return {
      id,
      percentage: props.splitType === SplitType.percentage ? percentage : undefined,
      amount: props.splitType === SplitType.amount ? amount : undefined
    }
  }

  function handleIdChange (value: Option) {
    const updatedId = mapOptionToIDRef(value)
    setId(updatedId)
    if (props.onChange) {
      props.onChange({ ...getSplitData(), id: updatedId })
    }
  }

  function handlePercentageChange (value: string) {
    const updatedPercentage = value && Number(value)
    setPercentage(updatedPercentage)
    if (props.onChange) {
      props.onChange({ ...getSplitData(), percentage: updatedPercentage })
    }
  }

  function handleAmountChange (value: Cost) {
    const updatedAmount = value && mapMoney(value)
    setAmount(updatedAmount)
    if (props.onChange) {
      props.onChange({ ...getSplitData(), amount: updatedAmount })
    }
  }

  return (
    <div className={styles.split}>
      <div className={`${styles.field} ${styles.type}`}>
        <DropdownControlNew
          value={id && mapIDRefToOption(id)}
          options={props.options}
          config={{
            forceValidate: props.forceValidate
          }}
          dataFetchers={props.dataFetchers}
          validator={singleSelectValidator}
          onChange={handleIdChange}
        />
      </div>

      <div className={`${styles.field} ${styles.value}`}>
        {props.splitType === SplitType.amount
          ? <MoneyControlNew
            locale={getSessionLocale()}
            value={id && mapCost(amount)}
            config={{
              forceValidate: props.forceValidate,
              disableCurrency: true
            }}
            additionalOptions={props.additionalOptions}
            validator={costValidator}
            onChange={handleAmountChange}
          />
          : <NumberControlNew
            value={percentage?.toString()}
            config={{
              forceValidate: props.forceValidate
            }}
            validator={numberValidator}
            onChange={handlePercentageChange}
          />}
      </div>

      {props.allowDelete &&
        <X size={20} color="var(--warm-neutral-shade-300)" cursor="pointer" height={40} className={styles.action} onClick={props.onDelete} />}
    </div>
  )
}
