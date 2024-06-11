/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React from "react"
import { QuantityCell, ValueCell } from "../cells/Index"
import style from './../style.module.scss'
import { isEmpty, isNullable } from "../../../Form/util"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import { getValueFromAmount } from "../../../Inputs/utils.service"

interface IProps {
  quantity: number | undefined
  oldQuantity: number | undefined
  readOnly: boolean
  locale: string
  isFieldReadOnly: boolean
  isFieldMandatory: boolean
  hasOldValue: boolean
  handleFieldChange: (fieldName: ItemDetailsFields, newValue: number) => void
  forceValidate: boolean
}
const DECIMAL_LIMIT = 5

function QtyWrapper (props: IProps) {

  return <div className={style.td} data-testid="itemDetails-quantity">
    {(props.readOnly || props.isFieldReadOnly)
      ? <ValueCell>
        <>{`${!isNullable(props.quantity) ? Number(props.quantity).toLocaleString(props.locale) : ''}`}
          {props.hasOldValue && (props.quantity !== props.oldQuantity) &&
            <div className={style.previousValue}>{Number(props.oldQuantity).toLocaleString(props.locale)}</div>}
        </>
      </ValueCell>
      : <QuantityCell
        allowNegative={false}
        locale={props.locale}
        decimalLimit={DECIMAL_LIMIT}
        value={props.quantity?.toString ? props.quantity.toString() : ''}
        fieldName={ItemDetailsFields.quantity}
        validator={(value) => (!props.isFieldReadOnly && props.isFieldMandatory && isEmpty(value))}
        forceValidate={props.forceValidate}
        readOnly={props.readOnly || props.isFieldReadOnly}
        onChange={(fieldName, value) => props.handleFieldChange(fieldName, Number(getValueFromAmount(value)))}
        formatter={(value: string) => {
          if (isEmpty(value)) {
            return value
          }
          return `${Number(value).toLocaleString(props.locale, { maximumFractionDigits: DECIMAL_LIMIT })}`
        }}
      />}
  </div>
}

export default QtyWrapper