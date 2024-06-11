/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { LoginErrorEnum } from '../SigninService'
import styles from './styles.module.scss'
import { ChangePasswordProps } from './types'

export function ConfirmSmsRequirement(props: ChangePasswordProps) {
  const [errorMessage, setErrorMessage] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [smsCode, setSmscode] = useState('')

  useEffect(() => {
    if (props.errorMessage) setErrorMessage(props.errorMessage)
    else setErrorMessage('')
  }, [props.errorMessage])

  useEffect(() => {
    setTenantId(props.tenantId || '')
  }, [props.tenantId])

  const handleCodeSubmit = (event: any) => {
    event.preventDefault()

    if (props.handleLogin && smsCode && tenantId && props.sessionId && props.userName) {
        props.handleLogin({ userName: props.userName, smsCode, sessionId: props.sessionId, tenantId, respondingTo: props.respondingTo || LoginErrorEnum.smscoderequired })
    } else if (props.handleLogin && smsCode && props.sessionId && props.userName) {
        props.handleLogin({ userName: props.userName, smsCode, sessionId: props.sessionId, respondingTo: props.respondingTo || LoginErrorEnum.smscoderequired })
    }
  }

  return (
    <form onSubmit={handleCodeSubmit} className={styles.loginForm}>
      <div className={styles.errorMessage}>{errorMessage || ''}</div>
        <div className={styles.inputsContainer}>
            {props.respondingTo === LoginErrorEnum.smscoderequired ? <label>SMS code</label> : <label>MFA code</label>}
            <input className={styles.input}
            type='text'
            autoFocus
            placeholder="Enter code.."
            value={smsCode}
            required
            onChange={(e) => { setSmscode(e.target.value); setErrorMessage('') }}
            />
        </div>
        <input className={styles.submit} type="submit" value="Submit"></input>
    </form>
  )
}
