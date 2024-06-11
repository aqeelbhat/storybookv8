/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { forwardRef } from "react"
import style from './style.module.scss'
import classNames from "classnames"

type FieldProps = {
  testId?: string
  readOnly?: boolean
  disabled?: boolean
  children: JSX.Element | string | JSX.Element[]
}
// To show something in Label Column
export default forwardRef((props: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  return <div className={classNames(style.cell,{ [style.label]: !props.readOnly })} ref={ref} data-testid={props.testId}>
    <div className={classNames(style.value)}>
      {props.children}
    </div>
  </div>
})

