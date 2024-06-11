/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { getEmptyTaxItem } from '../../../Form/util'
import { IDRef, Money, Option } from '../../../Types'
import { TaxItem, TaxObject } from '../../../Types/common'
import { MoneyControlNew } from '../../money.component'
import { NumberControlNew } from '../../number.component'
import styles from '../form.module.scss'
import { TextControlNew } from '../../text.component'
import { costValidator, numberValidator, stringValidator } from '../../../CustomFormDefinition/View/validator.service'
import { mapCurrencyToSymbol } from '../../../util'
import { FieldCell, LabelCell, ValueCell } from '../cells/Index'
import { Grid } from '@mui/material'
import { TaxItemProps, TaxProps, enumTaxFields } from './types'
import { Cost } from '../../../Form/types'
import { getValueFromAmount } from '../../../Inputs/utils.service'
import { NumberBox } from '../../../Inputs'
import { getSessionLocale } from '../../../sessionStorage'

function TaxItemControl (props: TaxItemProps) {
  const [code, setCode] = useState<IDRef>({ id: '', erpId: '', name: '' })
  const [rate, setRate] = useState<number>()
  const [forceValidate, setForceValidate] = useState(false)
  const [taxableAmount, setTaxableAmount] = useState<Cost>({ amount: '0', currency: '' })

  useEffect(() => {
    if (props.data) {
      setCode(props.data.taxCode || { id: '', erpId: '', name: '' })
      setTaxableAmount({ amount: props.data.taxableAmount?.amount?.toString(), currency: props.data.taxableAmount?.currency || props.defaultCurrency })

      setRate(props.data.percentage)
    }
  }, [props.data])

  useEffect(() => {
    setForceValidate(props.forceValidate)
  }, [props.forceValidate])

  function getTaxItemData (): TaxItem {
    //const cleanedupValue = getValueFromAmount(value)
    return {
      amount: { amount: 0, currency: props.userSelectedCurrency || props.defaultCurrency },
      percentage: rate || undefined,
      taxableAmount: taxableAmount ? { amount: Number(getValueFromAmount(taxableAmount.amount)), currency: taxableAmount.currency } : undefined,
      taxCode: code || undefined
    }
  }

  function getTaxDataWithUpdatedValue (fieldName: string, newValue: Cost | string | number | Money | IDRef): TaxItem {
    const taxItemData = JSON.parse(JSON.stringify(getTaxItemData())) as TaxItem

    switch (fieldName) {
      case enumTaxFields.amount:
        taxItemData.amount = newValue as Money
        break
      case enumTaxFields.rate:
        taxItemData.percentage = newValue as number
        break
      case enumTaxFields.taxableAmount:
        const _cost = newValue as Cost
        taxItemData.taxableAmount = { amount: _cost.amount ? Number(_cost.amount) : NaN, currency: _cost.currency } //newValue //as Money
        break
      case enumTaxFields.code:
        taxItemData.taxCode = newValue as IDRef
        break
    }

    return taxItemData
  }

  function handleFieldValueChange (
    fieldName: string,
    newValue: string | number | Money | IDRef | Cost
  ) {
    if (props.onChange) {
      props.onChange(
        getTaxDataWithUpdatedValue(fieldName, newValue)
      )
    }
  }

  function isNullable (value: number) {
    return (value === undefined) || (value === null)
  }
  function moneyFormatter (value: Money) {
    if (!value || (value.amount === undefined) || (value.amount === null) || !value.currency) {
      return '-'
    }
    return `${value && mapCurrencyToSymbol(value.currency)}${value && Number(value.amount).toLocaleString(props.locale)}`
  }
  function handleTouch () {
    props.onFieldTouch && props.onFieldTouch()
  }
  function costFormatter (value: Cost) {
    if (!value || (value.amount === undefined) || (value.amount === null) || !value.currency) {
      return '-'
    }
    return `${value && mapCurrencyToSymbol(value.currency)}${value && Number(value.amount).toLocaleString(props.locale)}`
  }
  return (<>
    <Grid xs={4} item className={classNames(styles.td, { [styles.readOnly]: props.isReadOnly })}>
      <LabelCell readOnly={props.isReadOnly}>
        {props.getI18Text('--taxCode--')}
      </LabelCell>
    </Grid>
    <Grid xs={8} item className={styles.td} onClick={handleTouch} >
      {(props.isReadOnly || props.isFieldReadOnly)
        ? <ValueCell>{code?.name || '-'}</ValueCell>
        : <FieldCell>
          <TextControlNew
            value={code?.name}
            inTableCell
            placeholder={props.getI18Text('--enterTaxCode--')}
            config={{
              optional: props.optional,
              isReadOnly: props.isReadOnly,
              forceValidate: forceValidate
            }}
            disabled={props.isReadOnly}
            onChange={(value) => { setCode({ id: value, erpId: value, name: value }); handleFieldValueChange(enumTaxFields.code, { id: value, erpId: value, name: value }) }}
            validator={stringValidator}
          />
        </FieldCell>}
    </Grid>
    <Grid xs={4} item className={classNames(styles.td, { [styles.readOnly]: props.isReadOnly })}>
      <LabelCell readOnly={props.isReadOnly}>
        {props.getI18Text('--taxRate--')}
      </LabelCell>
    </Grid>
    <Grid xs={8} item className={styles.td} onClick={handleTouch}>
      {(props.isReadOnly || props.isFieldReadOnly)
        ? <ValueCell>{!isNullable(rate) ? rate + '%' : '-'}</ValueCell>
        : <FieldCell>
          <NumberBox
            inTableCell
            allowNegative
            //value={rate?.toString()}
            value={!isNullable(rate) ? rate.toLocaleString(getSessionLocale()) : ''}
            //placeholder={getI18Text('--enterQuantity--')}
            id={"rate"}
            decimalLimit={2}
            disabled={props.isReadOnly}//{isFieldReadonly(ItemDetailsFields.quantity)}
            //required={!isFieldReadonly(ItemDetailsFields.quantity) && isFieldMandatory(ItemDetailsFields.quantity)}
            forceValidate={forceValidate}
            validator={(value) => {
              return numberValidator(parseInt(value))
            }}
            onChange={(value) => {
              setRate(value);
              handleFieldValueChange(enumTaxFields.rate, Number(getValueFromAmount(value)))
            }}
          />
        </FieldCell>}
    </Grid>
    <Grid xs={4} item className={classNames(styles.td, { [styles.readOnly]: props.isReadOnly })}>
      <LabelCell readOnly={props.isReadOnly}>
        {props.getI18Text('--taxAmount--')}
      </LabelCell>
    </Grid>
    <Grid xs={8} item className={styles.td} onClick={handleTouch}>
      {(props.isReadOnly || props.isFieldReadOnly)
        ? <ValueCell>{costFormatter(taxableAmount)}</ValueCell>
        : <FieldCell>
          <MoneyControlNew
            allowNegative={props.allowNegative}
            locale={props.locale}
            inTableCell
            value={taxableAmount}
            //value={taxableAmount as any || { amount: 0, currency: props.defaultCurrency }}
            config={{
              optional: props.optional,
              isReadOnly: props.isReadOnly,
              disableCurrency: props.disableCurrency,
              forceValidate: forceValidate
            }}
            additionalOptions={{
              currency: props.currencyOptions,
              defaultCurrency: props.defaultCurrency,
              userSelectedCurrency: props.userSelectedCurrency
            }}
            onChange={(value) => {
              setTaxableAmount(value)
              if (value.amount !== '-' && value.amount !== '') {
                handleFieldValueChange(enumTaxFields.taxableAmount, value)
              }
              //setTaxableAmount(parseInt(value))
              //setTaxableAmount({ ...value, amount: parseInt(value.amount) });
              //setTaxableAmount({ ...value, amount: (value.amount) ? parseInt(value.amount) : 0 });
              //handleFieldValueChange(enumTaxFields.taxableAmount, { ...value, amount: parseInt(value.amount) }) }
            }}
            validator={costValidator}
            onCurrencyChange={props.onCurrencyChange}
          />
        </FieldCell>}
    </Grid>
  </>
  )
}
export function TaxRowsControl (props: TaxProps) {
  const [error, setError] = useState<string | null>()
  const [estimatedTax, setEstimatedTax] = useState<TaxObject>()
  const [taxItem, setTaxItem] = useState<Array<TaxItem>>()
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const [forceValidate, setForceValidate] = useState(false)

  useEffect(() => {
    setForceValidate(props.forceValidate)
  }, [props.forceValidate])

  useEffect(() => {
    if (props.value) {
      setEstimatedTax(props.value)
    } else {
      setEstimatedTax({
        amount: { amount: 0, currency: props.defaultCurrency },
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
      amount: estimatedTax?.amount || { amount: 0, currency: props.defaultCurrency },
      items: estimatedTax?.items || getEmptyTaxItem(props.defaultCurrency)
    }
  }

  function getTaxDataWithUpdatedValue (fieldName: string, newValue: string | Money | number | Array<TaxItem>): TaxObject {
    const taxData = JSON.parse(JSON.stringify(getTaxData())) as TaxObject

    switch (fieldName) {
      case enumTaxFields.amount:
        taxData.amount = newValue as Money
        break
      case enumTaxFields.taxItem:
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
      return (
        <TaxItemControl
          allowNegative={props.allowNegative}
          data={item}
          id={props.id}
          index={index}
          optional={props.optional}
          isReadOnly={props.isReadOnly}
          isFieldReadOnly={props.isFieldReadOnly}
          disableCurrency={props.disableCurrency}
          currencyOptions={currencyOptions}
          defaultCurrency={props.defaultCurrency}
          userSelectedCurrency={props.userSelectedCurrency}
          locale={props.locale}
          getI18Text={props.getI18Text}
          forceValidate={forceValidate}
          onChange={(value) => handleTaxItemChange(enumTaxFields.taxItem, index, value)}
          onCurrencyChange={props.onCurrencyChange}
          key={index}
          onFieldTouch={props.onFieldTouch}
        />
      )
    })}
  </>)
}
