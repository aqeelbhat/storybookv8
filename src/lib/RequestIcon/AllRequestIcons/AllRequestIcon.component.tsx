import React, { useState } from 'react'
import { iconList } from '../util.service'
import { AllRequestIconProps, IconName } from '../types'
import styles from './AllRequestIcon.module.scss'
import cx from 'classnames'

export function AllRequestIcon (props: AllRequestIconProps) {
  const [selectedIconName, setSelectedIconName] = useState<IconName>(props.selectedIcon || iconList[0].name)

  return (
    <div className={styles.iconContainer}>
      {iconList.map((icon, index) => (
        <div
          className={cx(styles.iconWrapper, selectedIconName ? (selectedIconName === icon.name ? styles.selected : '') : '')}
          key={index}
          onClick={() => { setSelectedIconName(icon.name); props.onSelection(icon.name) }}
        >
          <img src={icon.icon} style={{ height: props.height || '60px', width: props.width || '60px' }}></img>
        </div>
      ))}
    </div>
  )
}