/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { LoginErrorEnum } from '../SigninService'
import styles from './styles.module.scss'
import { VerifyMFAProps } from './types'
import { QRCode } from 'antd'
import { OroTooltip } from '../Tooltip/tooltip.component'

export function VerifyMFA (props: VerifyMFAProps) {
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
          props.handleLogin({ userName: props.userName, smsCode, sessionId: props.sessionId, tenantId, respondingTo: LoginErrorEnum.mfaSetupVerify })
      } else if (props.handleLogin && smsCode && props.sessionId && props.userName) {
          props.handleLogin({ userName: props.userName, smsCode, sessionId: props.sessionId, respondingTo: LoginErrorEnum.mfaSetupVerify })
      }
    }
  
    return (
      <form onSubmit={handleCodeSubmit} className={`${styles.loginForm} ${styles.loginFormExtended}`}>
        <div className={styles.errorMessage}>{errorMessage || ''}</div>
          <div className={styles.loginFormQRCode}>
            <QRCode
                size={256}
                style={{ height: "256px", maxWidth: "256px", width: "256px", flexShrink: 0 }}
                value={`otpauth://totp/Oro:${props.userName}?issuer=Oro&secret=${props.secretCode}`}
                type='canvas'
                bgColor='#fff'
            />
            <div className={styles.loginFormQRCodeText}>
                Open your authenticator app, then use the app to scan the code. Alternatively, you can type a secret key.
                <OroTooltip title={props.secretCode}><strong onClick={() => navigator.clipboard.writeText(props.secretCode)}>Show secret key</strong></OroTooltip>
            </div>
          </div>
          <div className={styles.inputsContainer}>
              <label>MFA code</label>
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
