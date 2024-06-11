/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useEffect, useState } from "react"
import { MoneyCell, ValueCell } from "../cells/Index"
import style from './../style.module.scss'
import { Money } from "../../../Types"
import { isEmpty } from "../../../Form/util"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import { mapCurrencyToSymbol } from "../../../util"
import { Cost } from "../../../Form"

interface IProps {
  readOnly: boolean
  locale: string
  isFieldReadOnly: boolean
  isFieldMandatory: boolean
  hasOldValue: boolean
  price: Money
  allowNegative: boolean
  oldPrice: Money
  moneyFormatter: (value: Money) => string
  costFormatter: (value: Cost) => string
  handleFieldChange: (fieldName: ItemDetailsFields, newValue: Money) => void
  forceValidate: boolean
  defaultCurrency: string
}
function PriceWrapper (props: IProps) {
  const [Amount, setAmount] = useState<Cost>({ amount: '0', currency: '' })

  useEffect(() => {
    setAmount({ amount: props.price?.amount?.toString(), currency: props.price?.currency || props.defaultCurrency })
  }, [props.price])

  return <div className={style.td} data-testid="itemDetails-price">
    {(props.readOnly || props.isFieldReadOnly)
      ? <ValueCell>
        <>{props.moneyFormatter(props.price)}
          {props.hasOldValue && (props.price?.amount !== props.oldPrice?.amount || props.price?.currency !== props.oldPrice?.currency) &&
            <div className={style.previousValue}>{props.oldPrice && mapCurrencyToSymbol(props.oldPrice.currency)} {props.oldPrice && Number(props.oldPrice.amount).toLocaleString(props.locale)}</div>}
        </>
      </ValueCell>
      : <MoneyCell
        allowNegative={props.allowNegative}
        value={Amount}
        locale={props.locale}
        defaultCurrency={props.defaultCurrency}
        fieldName={ItemDetailsFields.price}
        validator={(value) => {
          return (!props.isFieldReadOnly && props.isFieldMandatory && isEmpty(value))
        }}
        forceValidate={props.forceValidate}
        readOnly={props.readOnly || props.isFieldReadOnly}
        onChange={(fieldName, _cost) => {
          setAmount(_cost)
          if (_cost.amount !== '') {
            // convert to money
            const _money = {amount: _cost.amount ? Number(_cost.amount) : NaN, currency: _cost.currency}
            props.handleFieldChange(fieldName, _money)
            //handleFieldValueChange(enumTaxFields.taxableAmount, value)
          }
        }}
        formatter={props.costFormatter}
      />}
  </div>
}

export default PriceWrapper