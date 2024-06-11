import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { ItemListConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { getEmptyTaxItem } from '../Form/util'
import { IDRef, Money, Option } from '../Types'
import { TaxItem, TaxObject } from '../Types/common'
import { MoneyControlNew } from './money.component'
import { NumberControlNew } from './number.component'
import styles from './style.module.scss'
import { TextControlNew } from './text.component'
import { costValidator, numberValidator, stringValidator } from '../CustomFormDefinition/View/validator.service'
import { DEFAULT_CURRENCY } from '../util'
import { useTranslationHook } from '../i18n'
import { getSessionLocale } from '../sessionStorage'

interface TaxProps {
  id?: string
  value?: TaxObject
  placeholder?: string
  disabled?: boolean
  disableCurrency?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  itemListConfig?: ItemListConfig
  currencyOptions?: Option[]
  defaultCurrency?: string
  userSelectedCurrency?: string
  validator?: (value?: TaxObject) => string | null
  onChange?: (value: TaxObject) => void
  onCurrencyChange?: (currencyCode: string) => void
}

interface TaxItemProps {
  id?: string
  data?: TaxItem
  index?: number
  optional?: boolean
  isReadOnly?: boolean
  disableCurrency?: boolean
  forceValidate?: boolean
  currencyOptions?: Option[]
  defaultCurrency?: string
  userSelectedCurrency?: string
  validator?: (value?) => string | null
  onChange?: (value: TaxItem) => void
  onCurrencyChange?: (currencyCode: string) => void
}

export function TaxControl (props: TaxProps) {
  const [error, setError] = useState<string | null>()
  const [estimatedTax, setEstimatedTax] = useState<TaxObject>()
  const [taxItem, setTaxItem] = useState<Array<TaxItem>>()
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])

  useEffect(() => {
    if (props.value) {
      setEstimatedTax(props.value)
    } else {
      setEstimatedTax({
        amount: {amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY},
        items: getEmptyTaxItem(props.defaultCurrency)
      })
    }
  }, [props.value, props.defaultCurrency])


  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  useEffect(() => {
    if (props.forceValidate && !props.optional && !props.isReadOnly) {
      triggerValidation(estimatedTax)
    }
  }, [props.forceValidate, props.optional, estimatedTax])

  function triggerValidation (tax: TaxObject) {
    if (props.validator) {
      const err = props.validator(tax)
      setError(err)
    } else {
      setError('')
    }
}

  function getTaxData (): TaxObject {
    return {
      amount: estimatedTax?.amount || {amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY},
      items: estimatedTax?.items || getEmptyTaxItem(props.defaultCurrency)
    }
  }

  function getTaxDataWithUpdatedValue (fieldName: string, newValue: string | Money | number | Array<TaxItem>): TaxObject {
    const taxData = JSON.parse(JSON.stringify(getTaxData())) as TaxObject

    switch (fieldName) {
      case 'amount':
        taxData.amount = newValue as Money
        break
      case 'taxItem':
        taxData.items = newValue as Array<TaxItem>
        break
    }

    return taxData
  }

  function handleTaxItemChange (fieldName: string, index: number, value: TaxItem) {
    const taxItemCopy = [...estimatedTax.items]
    taxItemCopy[index] = value
    setTaxItem(taxItemCopy)

    if (props.onChange) {
      props.onChange(
        getTaxDataWithUpdatedValue(fieldName, taxItemCopy)
      )
    }
  }

  return (<>
    {(estimatedTax && Array.isArray(estimatedTax?.items)) && estimatedTax?.items.map((item, index) => {
      return(
      <TaxItemControl
        data={item}
        id={props.id}
        index={index}
        optional={props.optional}
        isReadOnly={props.isReadOnly}
        disableCurrency={props.disableCurrency}
        currencyOptions={currencyOptions}
        defaultCurrency={props.defaultCurrency}
        userSelectedCurrency={props.userSelectedCurrency}
        // localLabels={props.localLabels}
        forceValidate={props.forceValidate}
        onChange={(value) => handleTaxItemChange('taxItem', index, value)}
        onCurrencyChange={props.onCurrencyChange}
        key={index}
      />
      )
    })
    }
    {/* {error &&
      <div className={styles.validationError}>
        <img src={AlertCircle} /> {error}
      </div>} */}

  </>
  )
}

export function TaxItemControl (props: TaxItemProps) {
  const [code, setCode] = useState<IDRef>({id:'', erpId:'',name:''})
  const [rate, setRate] = useState<number>()
  const [taxableAmount, setTaxableAmount] = useState<Money>({amount: 0, currency: ''})
  const { t } = useTranslationHook()

  useEffect(() => {
    if (props.data) {
      setCode(props.data.taxCode || {id:'', erpId:'',name:''})
      setTaxableAmount(props.data.taxableAmount || {amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY})
      setRate(props.data.percentage)
    }
  }, [props.data])

  function getTaxItemData (): TaxItem {
    return {
      amount: {amount: 0, currency: props.userSelectedCurrency || props.defaultCurrency || DEFAULT_CURRENCY},
      percentage: rate || undefined,
      taxableAmount: taxableAmount || undefined,
      taxCode: code || undefined
    }
  }

  function getTaxDataWithUpdatedValue (fieldName: string, newValue: string | number | Money | IDRef): TaxItem {
    const taxItemData = JSON.parse(JSON.stringify(getTaxItemData())) as TaxItem

    switch (fieldName) {
      case 'amount':
        taxItemData.amount = newValue as Money
        break
      case 'rate':
        taxItemData.percentage = newValue as number
        break
      case 'taxableAmount':
        taxItemData.taxableAmount = newValue as Money
        break
      case 'code':
        taxItemData.taxCode = newValue as IDRef
        break
    }

    return taxItemData
  }

  function handleFieldValueChange(
    fieldName: string,
    newValue: string | number | Money | IDRef
  ) {
    if (props.onChange) {
      props.onChange(
        getTaxDataWithUpdatedValue(fieldName, newValue)
      )
    }
  }

  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }

  return (
    <div className={styles.formBodyContainer}>
      <div key={props.index} className={styles.formBodyContainerRowUnit}>
        <div className={styles.col1}>
          <span className={styles.formBodyContainerRowFieldName}>{getI18Text('--taxCode--')}</span>
          <TextControlNew
            value={code?.name}
            config={{
              optional: props.optional,
              isReadOnly: props.isReadOnly,
              forceValidate: props.forceValidate,
            }}
            disabled={props.isReadOnly}
            onChange={(value) => {setCode({id: value, erpId: value, name: value}); handleFieldValueChange('code', {id: value, erpId: value, name: value})}}
            validator={stringValidator}
          />
        </div>
        <div className={styles.col1}>
          <span className={styles.formBodyContainerRowFieldName}>{getI18Text('--taxRate--')}</span>
          <NumberControlNew
            value={rate?.toString()}
            config={{
              optional: props.optional,
              isReadOnly: props.isReadOnly,
              forceValidate: props.forceValidate
            }}
            disabled={props.isReadOnly}
            onChange={(value) => {setRate(parseInt(value)); handleFieldValueChange('rate', parseInt(value))}}
            validator={(value) => numberValidator(parseInt(value))}
          />
        </div>
      </div>
      <div className={classNames(styles.formBodyContainerRowUnit)}>
        <div className={styles.col2}>
          <span className={styles.formBodyContainerRowFieldName}>{getI18Text('--taxAmount--')}</span>
          <div>
            <MoneyControlNew
              locale={getSessionLocale()}
              value={taxableAmount as any || { amount: 0, currency: props.defaultCurrency || DEFAULT_CURRENCY }}
              config={{
                optional: props.optional,
                isReadOnly: props.isReadOnly,
                disableCurrency: props.disableCurrency,
                forceValidate: props.forceValidate,
              }}
              additionalOptions={{
                currency: props.currencyOptions,
                defaultCurrency: props.defaultCurrency,
                userSelectedCurrency: props.userSelectedCurrency
              }}
              onChange={(value) => {setTaxableAmount({...value, amount:(value.amount)? parseInt(value.amount) : 0}); handleFieldValueChange('taxableAmount', {...value, amount:(value.amount)? parseInt(value.amount) : 0})}}
              validator={costValidator}
              onCurrencyChange={props.onCurrencyChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


