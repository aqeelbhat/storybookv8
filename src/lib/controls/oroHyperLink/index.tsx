import React from 'react'
import { OroHyperLinkProps, targetType } from './types'
import classNames from 'classnames'
import styles from './style.module.scss'
import { ArrowUpRight } from 'react-feather'

export function OroHyperLink (props: OroHyperLinkProps) {
  const { children } = props

  return (
      <a
        id={props.id}
        className={classNames(styles.oroHyperLink, props.className)}
        href={props.href}
        tabIndex={0}
        rel={props.rel}
        target={props.target || targetType._self}
      >
        {children}{props.withIcon && <ArrowUpRight className={styles.icon} size={20} />}
    </a>
  )
}