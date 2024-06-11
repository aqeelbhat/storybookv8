import React from 'react'
import { SSOProps, LoginFormProps } from './types'
import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import { Keyboard } from '../Types/common'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../i18n";

export function SSO (props: SSOProps) {
  return (
    <p className={styles.ssoContainer}>
      <a data-testid="login-link-sso" href={props.href}>{props.linkText}</a>
    </p>
  )
}

export function LoginForm (props: LoginFormProps) {
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [tenantId, setTenantId] = useState<string>('')
  const [ambiguousFlag, setAmbiguousFlag] = useState(false)

  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    setAmbiguousFlag(props.ambiguousUser || false)
}, [props.ambiguousUser])

  useEffect(() => {
    setUserName(props.defaultUsername || '')
  }, [props.defaultUsername])

  useEffect(() => {
    setPassword(props.defaultPassword || '')
  }, [props.defaultPassword])

  useEffect(() => {
    setTenantId(props.tenantId || '')
  }, [props.tenantId])

  function handleSubmit (event) {
    event.preventDefault()
    if (props.onSubmit && userName && password && tenantId) {
      props.onSubmit({
        userName,
        password,
        tenantId
      })
    } else if (props.onSubmit) {
      props.onSubmit({
        userName,
        password
      })
    }
  }

  function handleForgetPasswordClick (event) {
    event.preventDefault()
    if (props.onForgetPasswordClick) {
      props.onForgetPasswordClick()
    }
  }

  function onPasswordChange (e: React.ChangeEvent<HTMLInputElement>) {
    setAmbiguousFlag(false)
    setPassword(e.target.value)
  }

  function onUserNameChange (e: React.ChangeEvent<HTMLInputElement>) {
    setAmbiguousFlag(false)
    setUserName(e.target.value)
  }

  function onTenantIdChange (e: React.ChangeEvent<HTMLInputElement>) {
    setAmbiguousFlag(false)
    setTenantId(e.target.value)
  }

  function handlePasswordToggle() {
    passwordInputType === 'password' ? setPasswordInputType('text') : setPasswordInputType('password')
  }

  function handleTogglePasswordKeydown(key: Keyboard) {
    if ((key === Keyboard.Enter) || (key === Keyboard.Return)) {
      handlePasswordToggle()
    }
  }

  function handleForgotPasswordKeydown(key: Keyboard) {
    if ((key === Keyboard.Enter) || (key === Keyboard.Return)) {
      if (props.onForgetPasswordClick) {
        props.onForgetPasswordClick()
      }
    }
  }

  return (
    <I18Suspense>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.errorMessage}>{props.errorMessage || ''}</div>

        <div className={styles.inputsContainer}>
          <label>{t('--userName--')}</label>
          <input className={styles.input}
            data-testid="login-input-username"
            placeholder={t('--enterUsername--')}
            value={userName}
            required
            onChange={onUserNameChange}
          />
        </div>

        <div className={styles.inputsContainer}>
          <label>{t('--password--')}</label>
          <input className={styles.input}
            data-testid="login-input-password"
            type={passwordInputType}
            placeholder={t('--enterPassword--')}
            value={password}
            required
            onChange={onPasswordChange}
          />
          <span
            className={styles.passwordShowHide}
            tabIndex={0}
            onClick={handlePasswordToggle}
            onKeyDown={(event) => { handleTogglePasswordKeydown(event.key as Keyboard) }}
          >
            {passwordInputType === 'password' ? t('--show--') : t('--hide--') }
          </span>
        </div>
          <div className={styles.inputsContainer}>
            <label>Tenant id{ambiguousFlag ? '' : ' (optional)'}</label>
            <input className={styles.input}
              type="text"
              value={tenantId}
              placeholder={ t('--Enter tenant id--') }
              required={ambiguousFlag}
              onChange={onTenantIdChange}
            />
          </div>

        <input className={styles.submit} data-testid="login-input-submit" type="submit" value={t('--signIn--')}></input>

        <div 
          tabIndex={0}
          onKeyDown={(event) => { handleForgotPasswordKeydown(event.key as Keyboard) }}
          className={styles.forgotPassword} 
          onClick={handleForgetPasswordClick}>
          {t('--forgotPassword--')}
        </div>
      </form>
    </I18Suspense>
  )
}
