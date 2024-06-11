/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React from "react"
import styles from './styles.module.scss'

function ComingSoon (props: {
  title: string,
  message: string,
  secondaryMessage: string,
  children: React.ReactElement
}) {
  return <div className={styles.main}>
    <div className={styles.responseLabel}>
      {props.title}
    </div>
    <div className={styles.message}>
      <div >{props.message}</div>
      <div >{props.secondaryMessage}</div>
    </div>
    {props.children}
  </div>
}
export default ComingSoon