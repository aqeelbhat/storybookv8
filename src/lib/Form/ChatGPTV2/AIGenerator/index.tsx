/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'

function AIGenerator (props: { message: string }) {
  return <div className={classNames(styles.responseLabel, styles.stage)}>{props.message}<div className={styles.dot_flashing}></div></div>
}
export default AIGenerator