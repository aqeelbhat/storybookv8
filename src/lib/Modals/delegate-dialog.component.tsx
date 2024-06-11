import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from './delegate-dialog.module.scss'
import { DelegateModalProps } from './types'
import { Calendar, X } from 'react-feather';
import { UserIdControlNew } from '../controls';
import { DateRange, genericDateFormatter } from '../Inputs';
import { DelegateUser, mapUser, mapUserId, User, UserId } from '../Types';
import { getSignedUser, isCurrentUserAdmin } from '../SigninService';
import { getUserDisplayName } from '../Form';
import { validateDateOrdering } from '../Form/util';
import { getI18Text as getI18ControlText } from '../i18n';
import { getSessionLocale } from '../sessionStorage';
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function DelegateDialogComponent (props: DelegateModalProps) {
  const style = {
    position: 'absolute' as const,
    top: 'calc(50% - 275px)',
    left: `calc(50% - 230px)`,
    width: 460,
    height: 553,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
    outline: 'none',
    padding: '16px 24px'
  }

  const [reason, setReason] = useState<string>('')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [delegateToUser, setDelegateToUser] = useState<User>()
  const [delegateForUser, setDelegateForUser] = useState<User>()
  const [delegateForUserName, setDelegateForUserName] = useState<string>()
  const [delegateByUserName, setDelegateByUserName] = useState<string>()
  const [delegateByUser, setDelegateByUser] = useState<UserId>()
  const [delegateToUserName, setDelegateUserToUserName] = useState<string>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [isUserChanged, setIsUserChanged] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.isOpen && !props.isEdit) {
      const logInUser = getSignedUser()
      if (logInUser) {
        const user = {
        email: logInUser.email,
        name: getUserDisplayName(logInUser),
        firstName: logInUser.givenName,
        lastName: logInUser.familyName,
        picture: logInUser?.picture,
        userName: logInUser.userName
        }
        setDelegateForUserName(logInUser.userName)
        setDelegateByUserName(logInUser.userName)
        setDelegateByUser(mapUserId(user))
        setDelegateForUser(mapUser(user))
      }
      if (!props.isEdit) {
        setStartDate(null)
        setEndDate(null)
        setReason('')
        setDelegateToUser(undefined)
      }
    }
  }, [props.isOpen])

  useEffect(() => {
    if (props.delegateUser && props.isEdit) {
      if (props.delegateUser.delegatedUsers?.length > 0 && props.delegateUserIndex >= 0) {
        const delegateIndex = props.delegateUserIndex
        const startDate = props.delegateUser.delegatedUsers[delegateIndex].startDate
        const endDate = props.delegateUser.delegatedUsers[delegateIndex].endDate
        const reason = props.delegateUser.delegatedUsers[delegateIndex].reason
        setStartDate(startDate)
        setEndDate(endDate)
        setReason(reason)
        const delegateFor = props.delegateUser.delegatedUsers[delegateIndex].userId
        const delegateBy = props.delegateUser.delegatedUsers[delegateIndex].byUser
        setDelegateForUserName(delegateFor.userName)
        setDelegateByUserName(delegateBy.userName)
        setDelegateForUser(mapUser(delegateFor))
        setDelegateByUser(mapUserId(delegateBy))
      }
      if (props.delegateUser?.userName) {
        setDelegateToUser(mapUser(props.delegateUser))
        setDelegateUserToUserName(props.delegateUser.userName)
      }
    } else {
      setStartDate(null)
      setEndDate(null)
      setReason('')
      setDelegateToUser(undefined)
    }
  }, [props.delegateUser, props.isEdit])

  function toggleModal () {
    if (props.toggleModal) {
      props.toggleModal()
    }
  }

  function triggerValidations () {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }

  function handlePrimaryClick () {
    if (delegateForUser && startDate && endDate && delegateForUserName && delegateToUserName) {
      const delegateUser: DelegateUser = {
        userId: delegateForUser ? mapUserId(delegateForUser) : null,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
        byUserName: delegateByUserName,
        byUser: delegateByUser
      }
      if (props.onSaveDelegates) {
        setIsUserChanged(false)
        props.onSaveDelegates(delegateUser, delegateForUserName, delegateToUserName, isUserChanged)
      }
    } else {
      triggerValidations()
    }
  }

  function handleSecondaryClick () {
    if (props.onCancelClick) {
      setIsUserChanged(false)
      props.onCancelClick()
    }
  }

  function handleDateChange (startDate: string, endDate: string) {
      setStartDate(startDate)
      setEndDate(endDate)
  }

  function onhandleChange (event) {
    setReason(event.target.value)
  }

  function handleUserSelection(delegateFor: User | User[], delegateTo: User | User[], user: string) {
    const delegateToUsers: Array<string> = []
    const delegateForUsers: Array<string> = []
    setIsUserChanged(true)
    switch (user) {
      case 'delegateToUser':
        if (delegateTo) {
          if (Array.isArray(delegateTo)) {
            delegateTo.map((delegateUser) => {
              delegateToUsers.push(delegateUser.userName || '')
            })

          } else {
            setDelegateToUser(delegateTo)
            setDelegateUserToUserName(delegateTo?.userName)
          }
        } else {
          // Delete delegated user when user selection cleared
          props.onDelete(delegateToUser, 0)
        }
        break
      case 'delegateForUser':
        if (delegateFor) {
          if (Array.isArray(delegateFor)) {
            delegateFor.map((delegateUser) => {
              delegateForUsers.push(delegateUser.userName || '')
            })
          } else {
            setDelegateForUser(delegateFor)
            setDelegateForUserName(delegateFor?.userName)
          }
        } else {
          // Delete current user when user selection cleared
          props.onDelete(delegateForUser, 0)
        }
    }
  }

  function validateDateRange (dateRange: {startDate: string, endDate: string}): string {
    return (dateRange.startDate && dateRange.endDate ? validateDateOrdering(dateRange.startDate, dateRange.endDate) : getI18ControlText('--validationMessages--.--fieldRequired--'))
  }

  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles.confirmationModal}>
            <div className={styles.modalHeader}>
              <div className={styles.group}>
                  <Calendar size={16}/>
                  <span className={styles.title}>
                   {t('--delegateDialog--.--delegateTo--')}
                  </span>
              </div>
              <X  cursor={'pointer'} color={'var(--warm-neutral-shade-500)'} size={18} onClick={toggleModal} />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.info}>{t('--delegateDialog--.--bothUserAbleToSeeTasks--')}</div>
              <div className={styles.modalBodySection}>
                  <div className={styles.row}>
                    <div className={styles.item}>
                        <span className={styles.label}>{t('--delegateDialog--.--currentUser--')}</span>
                        <UserIdControlNew config={{
                          optional: false,
                          isReadOnly: !isCurrentUserAdmin(),
                          forceValidate: forceValidate,
                          selectMultiple: false
                        }}
                        dataFetchers={{
                          getUser: props.onUserSearch,
                          getUserProfilePic: props.getUserProfilePic
                        }}
                        onChange={(user) => handleUserSelection(user, null, 'delegateForUser')}
                        value={delegateForUser}
                        />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <span className={styles.label}>{t('--delegateDialog--.--delegateToLabel--')}</span>
                        <UserIdControlNew
                          config={{
                            optional: false,
                            isReadOnly: false,
                            forceValidate: forceValidate,
                            selectMultiple: false
                          }} dataFetchers={{
                            getUser: props.onUserSearch,
                            getUserProfilePic: props.getUserProfilePic
                          }}
                          onChange={(user) => handleUserSelection(null, user, 'delegateToUser')}
                          value={delegateToUser}
                        />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <div className={styles.dates}>
                       <DateRange
                          locale={getSessionLocale()}
                          label={t('--delegateDialog--.--duration--')}
                          startDate={genericDateFormatter(startDate)}
                          endDate={genericDateFormatter(endDate)}
                          disabled={false}
                          required={true}
                          forceValidate={forceValidate}
                          validator={validateDateRange}
                          onDateRangeChange={handleDateChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>
                      <span className={styles.label}>{t('--delegateDialog--.--reason--')}</span>
                      <textarea onChange={onhandleChange} value={reason}/>
                    </div>
                  </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.buttonCancel} onClick={handleSecondaryClick}>
                {t('--delegateDialog--.--cancel--')}
              </button>
              <button className={classnames(styles.buttonPrimary)} onClick={handlePrimaryClick}>
                {t('--delegateDialog--.--save--')}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}
export function DelegateDialog (props: DelegateModalProps) {
  return <I18Suspense><DelegateDialogComponent {...props} /></I18Suspense>
}


