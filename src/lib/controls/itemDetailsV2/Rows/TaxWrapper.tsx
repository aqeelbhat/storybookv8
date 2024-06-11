/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useEffect, useState } from "react"
import { MoneyCell, ValueCell } from "../cells/Index"
import style from './../style.module.scss'
import { Money, TaxItem, TaxObject } from "../../../Types"
import { isEmpty } from "../../../Form/util"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import { mapCurrencyToSymbol } from "../../../util"
import { Cost } from "../../../Form"

interface IProps {
  readOnly: boolean
  locale: string
  isFieldReadOnly: boolean
  isFieldMandatory: Boolean
  allowNegative: boolean
  taxObject: TaxObject
  taxFormatter: (value: Money) => React.JSX.Element | ""
  costFormatter: (value: Cost) => string
  handleTaxAmountChange: (fieldName: ItemDetailsFields, newValue: Money) => void
  forceValidate: boolean
  defaultCurrency: string
  taxItems: Array<TaxItem> | undefined
}
function TaxWrapper (props: IProps) {
  const taxItem = props.taxItems?.[0] || null
  const [TaxableAmount, setTaxableAmount] = useState<Cost>({ amount: '0', currency: '' })

  useEffect(() => {
    const _item = props.taxItems?.[0]?.taxableAmount
    if (_item) {
      setTaxableAmount({
        amount: _item.amount?.toString(),
        currency: _item?.currency || props.defaultCurrency
      })
    }
  }, [props.taxItems?.[0]?.taxableAmount])

  return <div className={style.td} data-testid="itemDetails-tax">
    {(props.readOnly || props.isFieldReadOnly)
      ? <ValueCell>
        <>
          {taxItem && mapCurrencyToSymbol(taxItem.taxableAmount?.currency || props.defaultCurrency)}
          {taxItem && Number(taxItem.taxableAmount?.amount || 0).toLocaleString(props.locale)}
          {taxItem && <span className={style.taxpercent}>{' (' + Number(taxItem.percentage || 0).toLocaleString(props.locale) + '%)'}</span>}
        </>
      </ValueCell>
      : <MoneyCell
        allowNegative={props.allowNegative}
        value={TaxableAmount}
        locale={props.locale}
        defaultCurrency={props.defaultCurrency}
        fieldName={ItemDetailsFields.tax}
        validator={(value) => {
          return (!props.isFieldReadOnly && props.isFieldMandatory && isEmpty(value))
        }}
        forceValidate={props.forceValidate}
        readOnly={props.readOnly || props.isFieldReadOnly}
        onChange={(fieldName, _cost)=>{
          setTaxableAmount(_cost)
          if (_cost.amount !== '') {
            // convert to money
            const _money = {amount: _cost.amount ? Number(_cost.amount) : NaN, currency: _cost.currency}
            props.handleTaxAmountChange(fieldName, _money)
            //handleFieldValueChange(enumTaxFields.taxableAmount, value)
          }

        }}
        formatter={props.costFormatter}
      />}
  </div>
}

export default TaxWrapper