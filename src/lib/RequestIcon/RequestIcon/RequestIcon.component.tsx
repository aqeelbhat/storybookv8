import React from 'react'
import { RequestIconProps } from '../types'
import { getIcon } from '../util.service'

export function RequestIcon (props: RequestIconProps) {

  return (
      <img
        src={getIcon(props.iconName)}
        style={{ height: props.height || '60px', width: props.width || '60px'}}
      />
  )
}