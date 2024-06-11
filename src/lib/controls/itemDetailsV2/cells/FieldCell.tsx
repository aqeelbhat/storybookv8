/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { forwardRef } from "react"
import style from './style.module.scss'
import classNames from "classnames"

type FieldProps = {
  testId?: string
  children: JSX.Element | JSX.Element[] | string
  //hasHover?: boolean
}
// to be use for existing ORO controls in Value Column
export default forwardRef(function (props: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div className={classNames(style.cell) } data-testid={props.testId} ref={ref}>
    {props.children}
  </div>
})
