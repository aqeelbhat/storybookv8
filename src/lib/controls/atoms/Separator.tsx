import React from "react";
import styles from './atoms.module.scss'
import classNames from 'classnames'

export default function Separator (props: { secondary?: boolean }) {
  return <div className={classNames(styles.separator, { [styles.dotted]: props.secondary })}></div>
}
