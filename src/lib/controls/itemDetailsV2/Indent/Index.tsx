/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/

import React from "react"

import style from './style.module.scss'
import classNames from "classnames"
import { ChevronDown, ChevronRight } from "react-feather"

function IndentLabel (props: { isNested: boolean, prefix: string, indent: number }) {
  return <div className={classNames(
    {
      [style.index]: !props.isNested,
      [style.indexNested]: props.isNested
    })}>{`${props.prefix}${props.indent}`}</div>
}

function IndentGap (props: { level: number }) {
  const levels = Array.from(Array(props.level))
  return <>{levels.map((item, index) => {
    return <div key={index} className={style.indentation}></div>
  })}</>
}

function ExpandCollapse (props: { isExpanded: boolean, onClick?: () => void }) {
  function handleClick () {
    props.onClick && props.onClick()
  }
  return <div className={classNames(style.collapsedIcon, { [style.click]: props.onClick })} onClick={handleClick}>
    {props.onClick && (props.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
  </div>
}

export function Indentation (props: { isNested: boolean, prefix: string, indent: number, level: number, isExpanded?: boolean, onExpandCollapse?: () => void }) {

  return <>
    <IndentGap level={props.level} />
    {props.isNested && <ExpandCollapse
      isExpanded={props.isExpanded}
      onClick={props.onExpandCollapse}
    />}
    <IndentLabel isNested={props.isNested} prefix={props.prefix} indent={props.indent} />
  </>
}
