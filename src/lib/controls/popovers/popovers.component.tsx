import React, { useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { Popover } from 'reactstrap'
import { Box, Modal } from '@mui/material'
import { getUserDisplayName } from '../../Form'
import { AsyncTypeAhead, OROEmailInput, Option } from '../../Inputs'
import { Money, User, UserId } from '../../Types'
import { mapCurrencyToSymbol } from '../../util'
import { OroButton } from '../button/button.component'
import { UserIdControlNew } from '../userId.component'
import style from './popovers.module.scss'
import { getSessionLocale } from '../../sessionStorage'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../../i18n';

export interface PopoverOnPrimaryClickProps {
  message?: string
  email?: string
  userId?: UserId
  users?: UserId[]
}

export interface TaskActionPopoverProps {
  isOpen: boolean
  budget?: Money
  budgetLabel?: string
  children?: JSX.Element | JSX.Element[]
  className?: string;
  onUserSearch?: (keyword: string) => Promise<Array<Option>>
  onPopoverHide?: () => void
  onPrimaryActionClick?: (evt: PopoverOnPrimaryClickProps) => void
  getAllUsers?: (keyword: string) => Promise<Array<User>>
}

export const POPOVER_OPEN_DELAY = 200

function ApprovePopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function hidePopover () {
    setIsPopoverOpen(false)

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onPrimaryActionClick () {
    hidePopover()
    if (props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      props.onPrimaryActionClick({ message: actionMessage })
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--confirmApprove--')}</h3>
          { props.budget && props.budget.amount > 0 &&
            <div className={style.popoverCost}>
              <span className={style.popoverCostLabel}>{t('--popovers--.--estimatedCost--',{cost:props.budgetLabel ? `${props.budgetLabel}:` : t('--popovers--.--cost--')})}</span>
              <span className={style.popoverCostValue}>
                {mapCurrencyToSymbol(props.budget.currency)}
                {Number(props.budget.amount).toLocaleString(getSessionLocale())} {props.budget.currency}
              </span>
            </div> }
          <textarea className={style.popoverTextArea} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapper}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--confirmApproval--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function ApprovePopover (props: TaskActionPopoverProps) {
  return <I18Suspense><ApprovePopoverComponent  {...props} /></I18Suspense>
}

function SubmitReviewPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function hidePopover () {
    setIsPopoverOpen(false)

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  function onPrimaryActionClick () {
    hidePopover()
    if (props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      props.onPrimaryActionClick({ message: actionMessage })
    }
  }

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true} toggle={hidePopover}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--addClosingComment--')}</h3>
          <textarea className={style.popoverTextArea} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapper}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--confirm--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function SubmitReviewPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><SubmitReviewPopoverComponent  {...props} /></I18Suspense>
}
function DenyPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const [isValidationError, setIsValidationError] = useState<boolean>(false)
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
    setIsValidationError(false)
  }, [props.isOpen])

  function hidePopover () {
    setIsPopoverOpen(false)

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onTextAreaValueChange (e: React.ChangeEvent<HTMLTextAreaElement>) {
    setActionMessage(e.target.value)
    setIsValidationError(false)
  }

  function onPrimaryActionClick () {
    if (!actionMessage) {
      setIsValidationError(true)
    }

    if (actionMessage && props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      hidePopover()
      props.onPrimaryActionClick({ message: actionMessage })
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--reasonForDenial--')}</h3>
          <textarea className={`${style.popoverTextArea} ${isValidationError ? style.popoverTextAreaValidationError : ''}`} rows={3} onChange={onTextAreaValueChange}></textarea>
          <div className={style.popoverButtonWrapper}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--confirmDeny--')} onClick={onPrimaryActionClick} type="alert" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function DenyPopover (props: TaskActionPopoverProps)  {
  return <I18Suspense><DenyPopoverComponent  {...props} /></I18Suspense>
}

function CancelRequestPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const [isValidationError, setIsValidationError] = useState<boolean>(false)
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
    setIsValidationError(false)
  }, [props.isOpen])

  function hidePopover () {
    setIsPopoverOpen(false)

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onTextAreaValueChange (e: React.ChangeEvent<HTMLTextAreaElement>) {
    setActionMessage(e.target.value)
    setIsValidationError(false)
  }

  function onPrimaryActionClick () {
    if (!actionMessage) {
      setIsValidationError(true)
    }

    if (actionMessage && props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      hidePopover()
      props.onPrimaryActionClick({ message: actionMessage })
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--cancelRequest--')}</h3>
          <textarea className={`${style.popoverTextArea} ${isValidationError ? style.popoverTextAreaValidationError : ''}`} rows={3} onChange={onTextAreaValueChange}></textarea>
          <div className={style.popoverButtonWrapper}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} disabled={!actionMessage} label={t('--popovers--.--submit--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function CancelRequestPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><CancelRequestPopoverComponent  {...props} /></I18Suspense>
}

function RequestMoreInfoPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function hidePopover () {
    setIsPopoverOpen(false)

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onPrimaryActionClick () {
    hidePopover()

    if (props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      props.onPrimaryActionClick({ message: actionMessage })
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--requestForInfo--')}</h3>
          <textarea className={style.popoverTextArea} rows={3} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapper}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} disabled={!actionMessage} label={t('--popovers--.--send--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function RequestMoreInfoPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><RequestMoreInfoPopoverComponent  {...props} /></I18Suspense>
}

function ShareFormsPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function setEmptyPopoverContent () {
    setEmail('')
    setActionMessage('')
  }

  function hidePopover () {
    setIsPopoverOpen(false)
    setEmptyPopoverContent()

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onPrimaryActionClick () {
    hidePopover()

    if (email && props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      props.onPrimaryActionClick({ message: actionMessage, email })
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--shareWith--')}</h3>
          <OROEmailInput label="" required={true} onChange={setEmail}/>
          <label className={style.popoverLabel}>{t('--popovers--.--message--')}</label>
          <textarea className={style.popoverTextAreaShare} rows={6} cols={100} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapperShare}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--startSharing--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function ShareFormsPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><ShareFormsPopoverComponent  {...props} /></I18Suspense>
}

function ResendEmailPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function setEmptyPopoverContent () {
    setEmail('')
    setActionMessage('')
  }

  function hidePopover () {
    setIsPopoverOpen(false)
    setEmptyPopoverContent()

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onPrimaryActionClick () {
    hidePopover()

    if (email && props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      props.onPrimaryActionClick({ message: actionMessage, email })
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--resendEmail--')}</h3>
          <OROEmailInput label="" required={true} onChange={setEmail}/>
          <label className={style.popoverLabel}>{t('--popovers--.--message--')}</label>
          <textarea className={style.popoverTextAreaShare} rows={6} cols={100} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapperShare}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--send--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function ResendEmailPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><ResendEmailPopoverComponent {...props} /></I18Suspense>
}

function DelegateToPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const [user, setUser] = useState<UserId>()
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isValidationError, setIsValidationError] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function setEmptyPopoverContent () {
    setUser(undefined)
    setActionMessage('')
  }

  function hidePopover () {
    setIsPopoverOpen(false)
    setEmptyPopoverContent()

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onPrimaryActionClick () {
    if (!actionMessage || !user) {
      setIsValidationError(true)
    }

    if (user && actionMessage && props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      hidePopover()
      props.onPrimaryActionClick({ message: actionMessage, userId: user })
    }
  }

  const handleOnUserSelect = (userData: Option) => {
    if (userData) {
      const newOwner: UserId = {
        name: userData?.displayName || '',
        userName: userData?.path || '',
        userNameCP: (userData?.customData as UserId)?.userNameCP
      }
      setUser(newOwner)
    } else {
      setUser(undefined)
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--selectUser--')}</h3>
          <AsyncTypeAhead
            onSearch={props.onUserSearch}
            onChange={handleOnUserSelect}
            value={undefined}
            forceValidate={!user && isValidationError}
            placeholder={t('--popovers--.--select--')}
            validator={(value) => {
              if (!user && !value) {
                return t('--popovers--.--requiredField--')
              }
              return ''
            }}
          />
          <label className={style.popoverLabel}>{t('--popovers--.--reason--')}</label>
          <textarea className={`${style.popoverTextAreaShare} ${isValidationError && !actionMessage ? style.popoverTextAreaValidationError : ''}`} rows={3} cols={100} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverHint}>{t('--popovers--.--delegateToDifferentTeam--')}</div>
          <div className={style.popoverButtonWrapperShare}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--submit--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function DelegateToPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><DelegateToPopoverComponent {...props} /></I18Suspense>
}

export function MoreOptionsPopover (props: TaskActionPopoverProps) {
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function hidePopover () {
    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      setIsPopoverOpen(false)
      props.onPopoverHide()
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom-end" isOpen={isPopoverOpen} hideArrow={true}>
        <div className={`${style.popoverBody} ${style.popoverMore} ${props.className ? props.className : ''}`}>
          {props.children}
        </div>
      </Popover>
    }
  </div>
}

function AddNotePopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const popoverTargetRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [popoverTargetElem, setpopoverTargetElem] = useState<HTMLDivElement | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setpopoverTargetElem(popoverTargetRef.current)
  }, [popoverTargetRef.current])

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function hidePopover () {
    setIsPopoverOpen(false)

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])

  function onPrimaryActionClick () {
    hidePopover()
    if (props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      props.onPrimaryActionClick({ message: actionMessage })
    }
  }

  return <div ref={popoverTargetRef} onClick={(e) => e.stopPropagation()}>
    { popoverTargetElem && <Popover target={popoverTargetElem} placement="bottom" isOpen={isPopoverOpen} hideArrow={true} toggle={hidePopover}>
        <div className={style.popoverBody}>
          <h3 className={style.popoverTitle}>{t('--popovers--.--addUpdate--')}</h3>
          <textarea className={style.popoverTextArea} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapper}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--submit--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Popover>
    }
  </div>
}
export function AddNotePopover (props: TaskActionPopoverProps) {
  return <I18Suspense><AddNotePopoverComponent {...props} /></I18Suspense>
}

function AddApproverPopoverComponent (props: TaskActionPopoverProps) {
  const [actionMessage, setActionMessage] = useState<string>('')
  const [users, setUsers] = useState<Array<User>>([])
  const [selectedApprover, setSelectedApprover] = useState<Array<UserId>>([])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isValidationError, setIsValidationError] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  const modalStyle = {
    position: 'absolute',
    top: 'calc(50% - 152px)',
    left: 'calc(50% - 255px)',
    width: 510,
    height: 303,
    bgcolor: 'background.paper',
    boxShadow: 1,
    p: 4,
    outline: 'none',
    padding: '0px',
    borderRadius: '8px'
  }

  useEffect(() => {
    setIsPopoverOpen(props.isOpen)
  }, [props.isOpen])

  function setEmptyPopoverContent () {
    setUsers([])
    setSelectedApprover([])
    setActionMessage('')
  }

  function hidePopover () {
    setIsPopoverOpen(false)
    setEmptyPopoverContent()

    if (props.onPopoverHide && typeof props.onPopoverHide === 'function') {
      props.onPopoverHide()
    }
  }

  function onPrimaryActionClick () {
    if (!(users && users.length)) {
      setIsValidationError(true)
    }

    if (users && users.length > 0 && props.onPrimaryActionClick && typeof props.onPrimaryActionClick === 'function') {
      hidePopover()
      props.onPrimaryActionClick({ message: actionMessage || '', users: selectedApprover })
    }
  }

  const handleOnUserSelect = (selectedUser: User[]) => {
    if (selectedUser && selectedUser.length > 0) {
      setUsers(selectedUser)
      const newOwners: UserId[] = selectedUser.map(user => {
        return ({
          name: getUserDisplayName(user) || '',
          userName: user?.userName || '',
          tenantId: user?.tenantId || ''
        })
      })
      setSelectedApprover(newOwners?.length ? newOwners : [])
    } else {
      setUsers([])
      setSelectedApprover([])
    }
  }

  return (
    <Modal open={isPopoverOpen} BackdropProps={{ invisible: true }} onClose={props.onPopoverHide}>
      <Box sx={modalStyle}>
        <div className={style.popoverBody}>
          <div className={style.popoverHeader}>
            <span className={style.title}>{t('--popovers--.--addApprover--')}</span>
            <X className={style.close} color="var(--warm-neutral-shade-300)" size={20} onClick={hidePopover}/>
          </div>
          <h3 className={style.popoverTitle}>{t('--popovers--.--selectUser--')}</h3>
          <UserIdControlNew
            value={users}
            config={{selectMultiple: true, forceValidate: isValidationError}}
            dataFetchers={{getUser: props.getAllUsers}}
            onChange={(users) => handleOnUserSelect(users as User[])}
          />
          <label className={style.popoverLabel}>{t('--popovers--.--reason--')} <span className={style.optional}>{t('--popovers--.--optional--')}</span></label>
          <textarea className={`${style.popoverTextAreaShare}`} rows={3} cols={100} onChange={e => setActionMessage(e.target.value)}></textarea>
          <div className={style.popoverButtonWrapperShare}>
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--cancel--')} onClick={() => hidePopover()} radiusCurvature="low" fontWeight="semibold" />
            <OroButton className={style.popoverButtonElem} label={t('--popovers--.--submit--')} onClick={onPrimaryActionClick} type="primary" radiusCurvature="low" fontWeight="semibold" />
          </div>
        </div>
      </Box>
    </Modal>
  )
}
export function AddApproverPopover (props: TaskActionPopoverProps) {
  return <I18Suspense><AddApproverPopoverComponent {...props} /></I18Suspense>
}
