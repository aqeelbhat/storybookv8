import React from 'react'
import classNames from 'classnames'

import style from './button.module.scss'
import { checkURLContainsProtcol } from '../../util'

export type OroButtonType = 'primary' | 'secondary' | 'alert' | 'link' | 'default'

export interface OroButtonProps {
  innerHtml?: string
  // Below props are ignored if 'innerHtml' is available: ----------------
  label?: string
  icon?: React.ReactNode
  iconOrientation?: 'left' | 'right' | 'center'
  // ---------------------------------------------------------------------
  type?: OroButtonType
  size?: 'small' | 'medium'
  disabled?: boolean
  width?: 'fillAvailable' | 'content'
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  radiusCurvature?: 'none' | 'low' | 'medium' | 'high'
  className?: string
  theme?: 'coco'
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function OroButton (props: OroButtonProps) {
  function btnClass (): string {
    return props.type ? style[props.type] : style.default
  }

  function sizeClass (): string {
    return props.size ? style['orobtn' + props.size] : style.orobtnmedium
  }

  function widthClass (): string {
    return props.width ? style['width' + props.width] : style.widthcontent
  }

  function fontClass () : string {
    return props.fontWeight ? style['font' + props.fontWeight] : style.fontnormal
  }

  function radiusCurvatureClass (): string {
    return props.radiusCurvature ? style['radius' + props.radiusCurvature] : style.radiusnone
  }

  function iconOrientation (): string {
    return props.iconOrientation ? props.iconOrientation : 'left'
  }

  function themeClass (): string {
    return props.theme ? style['theme' + props.theme] : style.theme
  }

  function onClick (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (props.onClick && typeof props.onClick === 'function') {
      props.onClick(event)
    }
  }

  return <>
    {props.innerHtml
      ? <button
          dangerouslySetInnerHTML={{ __html: props.innerHtml }}
          className={`oroBtn ${props.className} ${style.oroBtn} ${btnClass()} ${sizeClass()} ${widthClass()} ${fontClass()} ${radiusCurvatureClass()} ${themeClass()}`}
          disabled={props.disabled}
          onClick={(evt) => onClick(evt)}
          tabIndex={0}
        />
      : <button
          className={`oroBtn ${props.className} ${style.oroBtn} ${btnClass()} ${sizeClass()} ${widthClass()} ${fontClass()} ${radiusCurvatureClass()} ${themeClass()}`}
          disabled={props.disabled}
          onClick={(evt) => onClick(evt)}
          tabIndex={0}
        >
          { props.icon && iconOrientation() === 'left' && <span className={`oroBtnIcon ${style.iconLeft}`}>{ props.icon }</span> }
          { props.icon && iconOrientation() === 'center' && <span className={`oroBtnIcon ${style.iconLeft}`}>{ props.icon }</span> }
          { props.label }
          { props.icon && iconOrientation() === 'right' && <span className={`oroBtnIcon ${style.iconLeft}`}>{ props.icon }</span> }
        </button>}
  </>
}

export function LinkButton (props: {
  label: string
  href: string
  isPrimary?: boolean
}) {
  return (
    <a
      href={checkURLContainsProtcol(props.href)}
      key={props.href}
      className={classNames(style.linkButton, { [style.primary]: props.isPrimary })}
      dangerouslySetInnerHTML={{ __html: props.label }}
    />
  )
}
