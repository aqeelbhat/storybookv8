/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'react-feather'
import { LoginErrorEnum } from '../SigninService'
import styles from './styles.module.scss'
import { ChangePasswordProps } from './types'

export function ChangePassword (props: ChangePasswordProps) {
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState('password')

  useEffect(() => {
    if (props.errorMessage) setErrorMessage(props.errorMessage)
    else setErrorMessage('')
  }, [props.errorMessage])

  useEffect(() => {
    setTenantId(props.tenantId || '')
  }, [props.tenantId])

  const handleNewPasswordSubmit = (event: any) => {
    event.preventDefault()

    if (props.handleLogin && password === confirmNewPassword && tenantId && props.sessionId && props.userName) {
        props.handleLogin({ userName: props.userName, password, sessionId: props.sessionId, tenantId, respondingTo: LoginErrorEnum.newpasswordrequired })
    } else if (props.handleLogin && password === confirmNewPassword && props.sessionId && props.userName) {
        props.handleLogin({ userName: props.userName, password, sessionId: props.sessionId, respondingTo: LoginErrorEnum.newpasswordrequired })
    }
  }

  function handlePasswordMatch () {
    if (password.length > 0 && confirmNewPassword.length > 0 && password !== confirmNewPassword) {
      setErrorMessage('Password does not match.')
    } else {
      setErrorMessage('')
    }
  }

  return (
    <form onSubmit={handleNewPasswordSubmit} className={styles.loginForm}>
      <div className={styles.errorMessage}>{errorMessage || ''}</div>
        <div className={styles.inputsContainer}>
            <label>New Password</label>
            <input className={styles.input}
            type={passwordInputType}
            placeholder="Enter new password.."
            value={password}
            required
            onChange={(e) => { setPassword(e.target.value); setErrorMessage('') }}
            onBlur={handlePasswordMatch}
            />
            <span className={styles.passwordShowHide} onClick={() => passwordInputType === 'password' ? setPasswordInputType('text') : setPasswordInputType('password')}>{passwordInputType === 'password' ? 'Show' : 'Hide'}</span>
            <div className={styles.hintText}>
              <AlertCircle size={15} color="#575F70"></AlertCircle>
              <span>Password must contain 8 letters - one uppercase, one lowercase, one number, one special character</span>
            </div>
        </div>
        <div className={styles.inputsContainer}>
            <label>Confirm Password</label>
            <input className={styles.input}
            type={confirmPasswordInputType}
            placeholder="Confirm new password.."
            value={confirmNewPassword}
            required
            onChange={(e) => { setConfirmNewPassword(e.target.value); setErrorMessage('') }}
            onBlur={handlePasswordMatch}
            />
            <span className={styles.passwordShowHide} onClick={() => confirmPasswordInputType === 'password' ? setConfirmPasswordInputType('text') : setConfirmPasswordInputType('password')}>{confirmPasswordInputType === 'password' ? 'Show' : 'Hide'}</span>
        </div>
        {/* <div className={styles.inputsContainer}>
          <label>Tenant id{props.ambiguous === 'true' ? '' : ' (optional)'}</label>
          <input className={styles.input}
              type="text"
              placeholder="Enter tenant id.."
              value={tenantId}
              required={props.ambiguous === 'true'}
              onChange={(e) => setTenantId(e.target.value)}
          />
        </div> */}
        <input className={styles.submit} type="submit" value="Submit"></input>
    </form>
  )
}
