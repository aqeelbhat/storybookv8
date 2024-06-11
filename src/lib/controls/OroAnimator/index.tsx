/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { ReactElement } from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
function OroAnimator (props: { show?: boolean, withDelay?: boolean, children: ReactElement }) {
  const _showWithDelay = props.show && props.withDelay
  return <div className={classNames(styles.trans, { [styles.show]: !_showWithDelay,[styles.showWithDelay]: _showWithDelay, [styles.hide]: !props.show })}><div>{props.children}</div></div>
}
export default OroAnimator
