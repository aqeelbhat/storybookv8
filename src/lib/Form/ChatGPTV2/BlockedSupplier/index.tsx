import { AlertCircle } from "react-feather";

import styles from './style.module.scss'
import React from "react";

export default function BlockedSupplier (props: {
  description: string,
  children: React.ReactElement
}) {
  return <div className={styles.container}>
    <div className={styles.blocked}>
      <div className={styles.alert}><AlertCircle size={20} /></div>
      <div>{props.description}</div>
    </div>
    {props.children}
  </div>
}