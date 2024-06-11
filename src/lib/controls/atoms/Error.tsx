import React from 'react'

import styles from './atoms.module.scss'
import AlertCircle from '../../Inputs/assets/alert-circle.svg'

export default function Error (props: { children?: JSX.Element | string }) {
  return (
    <div className={styles.validationError}>
      <img src={AlertCircle} /> {props.children}
    </div>
  )
}
