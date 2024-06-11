/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { ReactElement } from 'react'
import styles from './styles.module.scss'
import oroAILogo from '../../assets/oro-ai-v2.svg'
import userDefaultPic from '../../assets/default-user-pic.png'
import { NAMESPACES_ENUM, useTranslationHook } from '../../../i18n'
import { getSignedUser, getUserProfilePicture } from '../../../SigninService/signin.service'
import { getUserDisplayName } from '../../util'
import OroAnimator from '../../../controls/OroAnimator'
import { Edit3 } from 'react-feather'
import { OroButton } from '../../../controls'

type AIResponseProps = { onEdit?: () => void, userResponded: boolean, children: ReactElement }
function AIResponse (props: AIResponseProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.OROAIREQUEST)

  function getProfilePic () {
    return getUserProfilePicture() || getSignedUser()?.picture || userDefaultPic
  }
  function handleEdit () {
    props.onEdit && props.onEdit()
  }
  const _user = getSignedUser()

  return <div className={styles.main}>
    <div className={styles.head}>
      <div>
        <OroAnimator show={props.userResponded}><img width={24} height={24} src={getProfilePic()} alt="" /></OroAnimator>
        <OroAnimator show={!props.userResponded}><img width={24} height={24} src={oroAILogo} alt="" /></OroAnimator>
      </div>
      <div className={styles.grow}>
        <OroAnimator show={props.userResponded}><div>{(_user ? getUserDisplayName(_user) : '-')} </div></OroAnimator>
        <OroAnimator show={!props.userResponded}><div>{t('--oroAI--')}</div></OroAnimator>
      </div>
      <OroAnimator show={props.onEdit ? true : false} withDelay><OroButton onClick={handleEdit} type="link" icon={<Edit3 size={16} color={'var(--warm-neutral-shade-400)'} />}></OroButton></OroAnimator>
    </div>
    <div className={styles.body}>
      {props.children}
    </div>
  </div>
}

export default AIResponse
