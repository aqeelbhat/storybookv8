import Slide from '@mui/material/Slide'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import React from 'react'
import { Info } from 'react-feather'
import Check from './../Form/assets/filled-check-green-circle.svg'

import style from './snackbar.module.scss'
import classNames from 'classnames'

export const SNACKBAR_PROPS: SnackbarProps = {
  className: style.materialSnackbar,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  autoHideDuration: 4000
}

function TransitionUp (props) {
  return <Slide {...props} direction="up" />
}

export function SnackbarComponent (props: {
  open: boolean,
  isSmoother?: boolean
  autoHideDuration?: number,
  hideIcon?: boolean,
  isSuccessIcon?:boolean,
  onClose?: () => void,
  message: string,
  isSnackbarAtTop?: boolean,
}) {
  return <>
    <Snackbar
      className={!props.isSnackbarAtTop ? SNACKBAR_PROPS.className : style.topSnackbar}
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={TransitionUp}
      anchorOrigin={SNACKBAR_PROPS.anchorOrigin}
      autoHideDuration={props.autoHideDuration || SNACKBAR_PROPS.autoHideDuration}>
        <div className={classNames(style.container, props.isSmoother ? style.smoother : '')}>
          {!props.hideIcon && <Info size={16} color='#D46B08'/>}
          {props.isSuccessIcon && <img src={Check} sizes='16'/>}
          <span className={style.text}>{props.message}</span>
        </div>
    </Snackbar>
  </>
}
