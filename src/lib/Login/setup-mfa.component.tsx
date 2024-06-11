/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { LoginErrorEnum } from '../SigninService'
import styles from './styles.module.scss'
import { ChangePasswordProps } from './types'

export function SetupMFA (props: ChangePasswordProps) {
  const [errorMessage, setErrorMessage] = useState('')
  const [tenantId, setTenantId] = useState('')

  useEffect(() => {
    if (props.errorMessage) setErrorMessage(props.errorMessage)
    else setErrorMessage('')
  }, [props.errorMessage])

  useEffect(() => {
    setTenantId(props.tenantId || '')
  }, [props.tenantId])

  const handleCodeSubmit = (event: any) => {
    event.preventDefault()

    if (props.handleLogin && tenantId && props.sessionId && props.userName) {
        props.handleLogin({ userName: props.userName, sessionId: props.sessionId, tenantId, respondingTo: LoginErrorEnum.mfaSetup })
    } else if (props.handleLogin && props.sessionId && props.userName) {
        props.handleLogin({ userName: props.userName, sessionId: props.sessionId, respondingTo: LoginErrorEnum.mfaSetup })
    }
  }

  return (
    <div className={styles.loginForm}>
      <div className={styles.errorMessage}>{errorMessage || ''}</div>
        <div className={styles.inputsContainer}>
            <div className={styles.loginFormHeader}>MFA has to be setup. Click <strong>Continue</strong> when ready</div>
        </div>
        <input className={styles.submit} type="submit" onClick={handleCodeSubmit} value="Continue"></input>
    </div>
  )
}
