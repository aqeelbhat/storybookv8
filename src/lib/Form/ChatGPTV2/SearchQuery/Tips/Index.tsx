/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React from 'react'
import styles from './styles.module.scss'
import { HelpCircle } from 'react-feather'
import { NAMESPACES_ENUM, useTranslationHook } from '../../../../i18n'

function Tips (props: { onClick: (tip: string) => void }) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.OROAIREQUEST)

  function getI18Text (key: string) {
    return t('--tips--.' + key)
  }
  function getTips () {
    return [getI18Text('--tip1--'), getI18Text('--tip2--'), getI18Text('--tip3--')]
  }

  return <div className={styles.suggestionBox}>
    <div className={styles.heading}>
      <HelpCircle size={16} color={'var(--warm-neutral-shade-300)'} />
      <div className={styles.text}>{getI18Text('--hereAreExamples--')}</div></div>
    <div className={styles.tips}>
      {getTips().map((tip, i) => <div onClick={() => { props.onClick(tip) }} key={i}>{tip}</div>)}
    </div>
  </div>
}

export default Tips