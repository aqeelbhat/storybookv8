/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React from "react"
import { QuantityCell, ValueCell } from "../cells/Index"
import style from './../style.module.scss'
import { IDRef } from "../../../Types"
import { isEmpty, isNullable } from "../../../Form/util"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import { getValueFromAmount } from "../../../Inputs/utils.service"
import { isNumber } from "../../../util"

interface IProps {
  quantity: number | undefined
  oldQuantity: number | undefined
  unitForQuantity: IDRef | undefined
  oldUnitForQuantity: IDRef | undefined
  readOnly: boolean
  locale: string
  isFieldReadOnly: boolean
  isFieldMandatory: boolean
  hasOldValue: boolean
  handleFieldChange: (fieldName: ItemDetailsFields, newValue: number) => void
  forceValidate: boolean
}
const DECIMAL_LIMIT = 5
function QtyUnitWrapper (props: IProps) {

  return <div className={style.td} data-testid="itemDetails-quantity-unit">
    {(props.readOnly || props.isFieldReadOnly)
      ? <ValueCell>
        <>{`${!isNullable(props.quantity) ? Number(props.quantity).toLocaleString(props.locale) : ''} ${props.unitForQuantity?.name || ''}`}
          {props.hasOldValue && (props.quantity !== props.oldQuantity || props.unitForQuantity?.name !== props.oldUnitForQuantity?.name) &&
            <div className={style.previousValue}>{Number(props.oldQuantity).toLocaleString(props.locale)} {props.oldUnitForQuantity?.name}</div>}
        </>
      </ValueCell>
      : <QuantityCell
        allowNegative={false}
        locale={props.locale}
        value={props.quantity?.toLocaleString ? props.quantity.toLocaleString(props.locale) : ''}
        fieldName={ItemDetailsFields.quantity}
        validator={(value) => (!props.isFieldReadOnly && props.isFieldMandatory && isEmpty(value))}
        forceValidate={props.forceValidate}
        readOnly={props.readOnly || props.isFieldReadOnly}
        decimalLimit={DECIMAL_LIMIT}
        onChange={(fieldName, value) => props.handleFieldChange(fieldName, Number(getValueFromAmount(value)))}
        formatter={(value: string) => {
          if (isEmpty(value) || !isNumber(value)) {
            return ''
          }
          return `${Number(value).toLocaleString(props.locale, { maximumFractionDigits: DECIMAL_LIMIT })} ${props.unitForQuantity?.name || ''}`
        }}
      />}
  </div>
}

export default QtyUnitWrapper