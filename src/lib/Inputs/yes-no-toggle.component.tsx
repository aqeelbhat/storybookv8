import React from 'react'
import { useState } from 'react'
import classnames from 'classnames'

import styles from './styles.module.scss'
import { YesNoToggleProps } from './types'
import { useEffect } from 'react'
import { getI18Text as getI18ControlText } from '../i18n'

export function YesNoToggle (props: YesNoToggleProps) {
  const [value, setValue] = useState<boolean | null>(null)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  function handleValue (value: boolean) {
    setValue(value)
    if (props.onSelect) {
      props.onSelect(value)
    }
  }

  return (
    <div className={styles.yesNoToggle}>
      <div className={classnames(styles.yesNoToggleOptions, value ? styles.yesNoToggleSelected : '')}
        onClick={() => handleValue(true)}
      >
        {getI18ControlText('--fieldTypes--.--bool--.--yes--')}
      </div>
      <div className={classnames(styles.yesNoToggleOptions, value === false ? styles.yesNoToggleSelected : '')}
        onClick={() => handleValue(false)}
      >
        {getI18ControlText('--fieldTypes--.--bool--.--no--')}
      </div>
    </div>
  )
}