/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { forwardRef } from "react"
import style from './style.module.scss'
import classNames from "classnames"

// To show anything on Value Column
export default forwardRef((props: { testId?: string, editable?: boolean, disabled?: boolean, children: JSX.Element | string | JSX.Element[] }, ref: React.ForwardedRef<HTMLDivElement>) => {
  return <div className={style.cell} ref={ref} data-testid={props.testId}>
    <div className={classNames(style.value, { [style.hover]: props.editable, [style.disabled]: props.disabled })}>
      {props.children}
    </div>
  </div>
})

