/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { ForgetPasswordProps } from './types'
import styles from './styles.module.scss'
import { AlertCircle } from 'react-feather'

export function ForgetPassword (props: ForgetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState('password')

  useEffect(() => {
    if (props.errorMessage) setErrorMessage(props.errorMessage)
    else setErrorMessage('')
  }, [props.errorMessage])

  const handleNewPasswordSubmit = (event: any) => {
    event.preventDefault()

    if (props.handleChangePassword && password === confirmNewPassword && props.userName && props.tenantId && verificationCode) {
      props.handleChangePassword({ userName: props.userName, password, tenantId: props.tenantId, verificationCode })
    } else if (props.handleChangePassword && password === confirmNewPassword && props.userName && verificationCode) {
      props.handleChangePassword({ userName: props.userName, password, verificationCode })
    }
  }

  function checkPasswordMatch () {
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
              required
              placeholder="Enter new password.."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={checkPasswordMatch}
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
              required
              placeholder="Confirm new password.."
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              onBlur={checkPasswordMatch}
          />
          <span className={styles.passwordShowHide} onClick={() => confirmPasswordInputType === 'password' ? setConfirmPasswordInputType('text') : setConfirmPasswordInputType('password')}>{confirmPasswordInputType === 'password' ? 'Show' : 'Hide'}</span>
      </div>
      <div className={styles.inputsContainer}>
          <label>Verification code</label>
          <input className={styles.input}
              type="text"
              required
              placeholder="Enter verification code.."
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
          />
      </div>
      <input className={styles.submit} type="submit" value="Submit"></input>
  </form>
  )
}
