
/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import classNames from 'classnames'
import style from './style.module.scss'
import React from 'react'
import { getFormattedValue } from '../../../util'

type TotalAmountProps = {
  label: string
  amount: number
  currency: string
  locale: string
}
export function TotalAmount (props: TotalAmountProps) {
  const { amount, currency, label, locale } = props
  return <div className={style.total} data-test-id="itemDetails-grand-total">
    <div className={style.label}>{label}</div>
    <div className={style.value}>
      {getFormattedValue(amount, currency, locale, true)}</div>
  </div>
}
