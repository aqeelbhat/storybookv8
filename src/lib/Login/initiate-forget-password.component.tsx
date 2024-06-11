/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { InitiateForgetPasswordProps } from './types'

export function InitiateForgetPassword (props: InitiateForgetPasswordProps) {
  const [userName, setUserName] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [ambiguousFlag, setAmbiguousFlag] = useState(false)

  useEffect(() => {
    setAmbiguousFlag(props.ambiguous || false)
  }, [props.ambiguous])

  useEffect(() => {
    setTenantId(props.tenantId || '')
}, [props.tenantId])

  function handleSubmit (event: any) {
    event.preventDefault()
    if (tenantId && userName && props.handleInitiateForgetPassword) {
        props.handleInitiateForgetPassword({ userName, tenantId })
    } else if (props.handleInitiateForgetPassword) {
        props.handleInitiateForgetPassword({ userName })
    }
  }

  function onUserNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmbiguousFlag(false)
    setUserName(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.errorMessage}>{props.errorMessage || ''}</div>
        <div className={styles.inputsContainer}>
            <label>Username</label>
            <input className={styles.input}
                type="text"
                required
                placeholder="Enter userName.."
                value={userName}
                onChange={onUserNameChange}
            />
        </div>
        <div className={styles.inputsContainer}>
            <label>Tenant id{ambiguousFlag ? '' : ' (optional)'}</label>
            <input className={styles.input}
                type="text"
                required={ambiguousFlag}
                value={tenantId}
                placeholder="Enter tenant id.."
                onChange={(e) => setTenantId(e.target.value)}
            />
        </div>
        <input className={styles.submit} type="submit" value="Submit"></input>
    </form>
  )
}
