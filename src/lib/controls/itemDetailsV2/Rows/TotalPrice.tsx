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
import { Cost } from "../../../Form"

interface IProps {
  readOnly: boolean
  locale: string
  isFieldReadOnly: boolean
  isFieldMandatory: boolean
  hasOldValue: boolean
  allowNegative: boolean
  itemTotalPrice: Money
  oldItemTotalPrice: Money
  moneyFormatter: (value: Money) => string
  costFormatter: (value: Cost) => string
  handleFieldChange: (fieldName: ItemDetailsFields, newValue: Money) => void
  forceValidate: boolean
  defaultCurrency: string
}
function TotalPriceCell (props: IProps) {
  const [Amount, setAmount] = useState<Cost>({ amount: '0', currency: '' })

  useEffect(() => {
    if (props.itemTotalPrice) {
      setAmount({ amount: props.itemTotalPrice?.amount?.toString(), currency: props.itemTotalPrice?.currency || props.defaultCurrency })
    }

  }, [props.itemTotalPrice])

  return <div className={style.td} data-testid="itemDetails-total-price">
    {(props.readOnly || props.isFieldReadOnly)
      ? <ValueCell>
        <>
          <div>{props.moneyFormatter(props.itemTotalPrice)}</div>
          {props.hasOldValue && (props.oldItemTotalPrice.amount !== props.itemTotalPrice.amount || (props.oldItemTotalPrice.currency !== props.itemTotalPrice.currency)) &&
            <div className={style.previousValue}>{props.moneyFormatter(props.oldItemTotalPrice)}</div>}
        </>
      </ValueCell>
      : <MoneyCell
        allowNegative={props.allowNegative}
        value={Amount}
        locale={props.locale}
        defaultCurrency={props.defaultCurrency}
        fieldName={ItemDetailsFields.totalPrice}
        validator={(value) => (!props.isFieldReadOnly && props.isFieldMandatory && isEmpty(value))}
        forceValidate={props.forceValidate}
        readOnly={props.readOnly || props.isFieldReadOnly}
        onChange={(fieldName, _cost) => {
          setAmount(_cost)
          if (_cost.amount !== '') {
            // convert to money
            const _money = {amount: _cost.amount ? Number(_cost.amount) : NaN, currency: _cost.currency}
            props.handleFieldChange(fieldName, _money)
          }
        }}
        formatter={props.costFormatter}
      />}
  </div>
}

export default TotalPriceCell