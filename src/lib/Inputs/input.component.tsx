import React from 'react'
import classnames from 'classnames'
import { AlertCircle, Info } from 'react-feather'
import { getI18Text } from '../i18n'
import { OroTooltip } from '../Tooltip/tooltip.component'
import { OroErrorTooltip } from '../Tooltip/error.component'

import styles from './styles.module.scss'
import AlertCircleFilled from './assets/alert-circle-filled.svg'

interface InputWrapperProps {
  label?: string
  description?: string
  children: JSX.Element | JSX.Element[]
  required?: boolean
  classname?: string
  error?: string
  warning?: boolean
  infoText?: string
  inTableCell?: boolean
}

export function InputWrapper (props: InputWrapperProps) {
  return (
    <div className={classnames(styles.inputGroup, props.classname)}>
      <div className={styles.labelInputContainer}>
        {(props.label || props.description) &&
          <div className={styles.title}>
            <div className={styles.label}>
              {!props.required ? getI18Text('is optional', { label: props.label }) : props.label}
              {props.infoText && <span className={styles.infoText}>{`(${props.infoText})`}</span>}
              {props.description &&
                <OroTooltip title={props.description} arrow placement='right'>
                  <Info size={16} color="var(--warm-neutral-shade-300)" />
                </OroTooltip>}
            </div>
          </div>}
        <div className={styles.input}>
          {props.children}
        </div>

        {(!props.inTableCell && props.error) &&
          <div className={props.warning ? styles.warning : styles.error}>
            {props.warning
              ? <img src={AlertCircleFilled} height="16px" width="16px" />
              : <AlertCircle size={16} color={'var(--warm-stat-chilli-regular)'} />}<span>{props.error}</span>
          </div>}
        {(props.inTableCell && props.error) &&
          <div className={styles.inTableCellAlert}>
            <OroErrorTooltip title={props.error}><AlertCircle size={16} color={props.warning ? 'var(--warm-misc-bold-orange)' : 'var(--warm-stat-chilli-regular)'} />
            </OroErrorTooltip>
          </div>}
      </div>
    </div>
  )
}

interface InputLabelProps {
  label: string
  required?: boolean
}

export function InputLabel (props: InputLabelProps) {
  return (
    <div className={styles.inputGroup}>
      <div className={styles.label}>{props.label}{!props.required ? ' (optional)' : ''}</div>
    </div>
  )
}
