import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Clock, Edit3 } from 'react-feather'
import { UserIdControlNew } from '../controls'
import { getDateObject } from '../Form/util'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { isCurrentUserAdmin } from '../SigninService'
import { mapUser, User } from '../Types'
import { DelegateFilterByType, DelegateUser } from '../Types/delegate'
import styles from './userDelegation.module.scss'

export interface DisplayUserDelegationProps {
  delegatedUsers: Array<User>
  myResponsibleList?: Array<DelegateUser>
  adminDelegateListCount?: number
  onEdit?: (user: User, delegateIndex:number) => void
  onDelete?: (user: User, delegateIndex:number) => void
  onClickShowList?: (delegateType: DelegateFilterByType) => void
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>
}

export function DisplayUserDelegation (props: DisplayUserDelegationProps) {

  const [delegatedUsers, setDelegateForUsers] = useState<Array<User>>([])
  const [newlyAddedDelegateUser, setNewlyAddedDelegateUser] = useState<User>()
  const [myResponsibilityList, setMyResponsibilityList] = useState<Array<DelegateUser>>([])
  const [newlyAddedMyResponsibility, setNewlyAddedMyResponsibility] = useState<User>()
  const newlyAddedUserIndex = 0
  const [newResponsibiltyIndex, setNewResponsibiltyIndex] = useState(0)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  function isItExpire(date: string): boolean {
    return date ? moment(getDateObject(date)).diff(new Date(), 'days') < -1 : false 
  }

  function getActiveResponsbility (): User {
    const userIndex = props.myResponsibleList && props.myResponsibleList.findIndex(record => !isItExpire(record.endDate))
    setNewResponsibiltyIndex(userIndex)
    return mapUser(props.myResponsibleList[userIndex]?.userId)
  }

  function getActiveDelegate (): User {
    const user = props.delegatedUsers && props.delegatedUsers.find(record => {
      return record.delegatedUsers.find(user => !isItExpire(user.endDate))
    })
    return mapUser(user)
  }

  useEffect(() => {
    if (props.delegatedUsers && Array.isArray(props.delegatedUsers)) {
      setDelegateForUsers(props.delegatedUsers)
      const user = getActiveDelegate()
      setNewlyAddedDelegateUser(user)
    }
  },[props.delegatedUsers])

  useEffect(() => {
    if (props.myResponsibleList && Array.isArray(props.myResponsibleList)) {
      setMyResponsibilityList(props.myResponsibleList)
      if (props.myResponsibleList.length > 0) {
        const user = getActiveResponsbility()
        setNewlyAddedMyResponsibility(user)
      }
    }
  },[props.myResponsibleList])

  function parseDate (date: string) {
    return date ? moment(getDateObject(date)).format('MMM DD YYYY') : ''
  }

  function handleEditDelegate () {
    if (props.onEdit) {
      props.onEdit(newlyAddedDelegateUser, newlyAddedUserIndex)
    }
  }

  function handleDeleteDelegate () {
    if (props.onDelete) {
      props.onDelete(newlyAddedDelegateUser, newlyAddedUserIndex)
    }
  }

  function handleViewMore (delegationListType: DelegateFilterByType) {
    if (props.onClickShowList && delegationListType) {
      props.onClickShowList(delegationListType)
    }
  }
  
  return (
    <div className={styles.delegate}>
      {(delegatedUsers && delegatedUsers.length > 0) &&
        <div className={styles.delegateUser} key={`delegatedUser}`}>
            <div className={styles.delegateUserHeader}  onClick={() => handleViewMore(DelegateFilterByType.myDelegate)}>
              <div className={styles.delegateUserHeaderTitle}>
                <span>{t('--delegateTo--')}</span>
                <span className={styles.count}>{delegatedUsers.length}</span>
              </div>
                <div className={styles.option}>
                  {/* <Edit size={14} cursor={'pointer'} color={`var(--warm-neutral-shade-300)`} onClick={() => handleEditDelegate()}/>
                  <Trash size={14} cursor={'pointer'} color={`var(--warm-neutral-shade-300)`} onClick={() => handleDeleteDelegate()}/> */}
                  <ArrowUpRight size={14} color={`var(--warm-prime-azure)`}/>
                </div>
            </div>
            {newlyAddedDelegateUser && newlyAddedDelegateUser.delegatedUsers &&
                    newlyAddedDelegateUser.delegatedUsers.length > 0 && 
              <div className={styles.delegateUserbody}>
                <div className={styles.user}>
                  <UserIdControlNew config={{
                    optional: false,
                    isReadOnly: true,
                    forceValidate: false,
                    selectMultiple: false,
                    doNotShowUserEmail: true,
                    }} dataFetchers={{
                    getUser: undefined,
                    getUserProfilePic: props.getUserProfilePic
                    }}
                    value={newlyAddedDelegateUser}         
                  />
                  <Edit3 size={14} cursor={'pointer'} color={`var(--warm-neutral-shade-300)`} onClick={() => handleEditDelegate()}/>
                 </div>
                 {/* { newlyAddedDelegateUser && newlyAddedDelegateUser.delegatedUsers &&
                    newlyAddedDelegateUser.delegatedUsers[0]?.byUserName && <div className={styles.item} >
                    <span className={styles.durationTitle}>Delegate Of</span>
                    <div className={styles.value}>{newlyAddedDelegateUser.delegatedUsers[newlyAddedUserIndex]?.byUserName}</div>
                  </div>
                 } */}
                 { newlyAddedDelegateUser && newlyAddedDelegateUser.delegatedUsers &&
                    newlyAddedDelegateUser.delegatedUsers.length > 0 && <div>
                   <div className={styles.dates}>
                     <div className={styles.icon}><Clock size={12} color={`var(--warm-neutral-shade-100)`}/></div>
                     <div className={styles.value}>
                      {`${parseDate(newlyAddedDelegateUser.delegatedUsers[newlyAddedUserIndex]?.startDate || '')} - ${parseDate(newlyAddedDelegateUser.delegatedUsers[newlyAddedUserIndex]?.endDate || '')}`}
                    </div>
                   </div>
                 </div>}
            </div>}
            {/* <div className={styles.delegateUserFooter}>
              <div className={styles.more} onClick={() => handleViewMore(DelegateFilterByType.myDelegate)}>
                <div>+{delegatedUsers.length - 1}</div>
                <span>more</span>
                <ArrowUpRight size={14}/>
              </div>
            </div> */}
        </div>
      }
      {
       myResponsibilityList && Array.isArray(myResponsibilityList) &&
       myResponsibilityList.length > 0 &&
       <div className={styles.delegateUser} key={`responsibleUser}`}>
          <div className={styles.delegateUserHeader}  onClick={() => handleViewMore(DelegateFilterByType.myResponsibilities)}>
            <div className={styles.delegateUserHeaderTitle}>
              <span>{t('--responsibleFor--')}</span>
              <span className={styles.count}>{myResponsibilityList.length}</span>
            </div>
            <div className={styles.option}>
              <ArrowUpRight size={14} color={`var(--warm-prime-azure)`}/>
            </div>
          </div>
          {newResponsibiltyIndex > -1 && 
            <div className={styles.delegateUserbody}>
              <div>
                <UserIdControlNew config={{
                  optional: false,
                  isReadOnly: true,
                  forceValidate: false,
                  selectMultiple: false,
                  doNotShowUserEmail: true,
                  }} dataFetchers={{
                  getUser: undefined,
                  getUserProfilePic: props.getUserProfilePic
                  }}
                  value={newlyAddedMyResponsibility}         
                />
                </div>
                { myResponsibilityList && <div>
                  <div className={styles.dates}>
                    <div className={styles.icon}><Clock size={12}  color={`var(--warm-neutral-shade-100)`}/></div>
                    <div className={styles.value}>
                    {`${parseDate(myResponsibilityList[newResponsibiltyIndex]?.startDate || '')} - ${parseDate(myResponsibilityList[newResponsibiltyIndex]?.endDate || '')}`}
                  </div>
                  </div>
                </div>}
          </div>}
          {/* <div className={styles.delegateUserFooter}>
            <div className={styles.more} onClick={() => handleViewMore(DelegateFilterByType.myResponsibilities)}>
              <div>+{myResponsibilityList.length - 1}</div>
              <span>more</span>
              <ArrowUpRight size={14}/>
            </div>
          </div> */}
      </div>
      }
      { isCurrentUserAdmin() &&
          <div className={classNames(styles.delegateUser, styles.admin)} key={`admin}`}>
            <div className={classNames(styles.delegateUserHeader, styles.adminHeader)} onClick={() => handleViewMore(DelegateFilterByType.admin)}>
              <div className={styles.delegateUserHeaderTitle}>
                <span>{t('--adminDelegation--')}</span>
                <span className={styles.count}>{delegatedUsers.length}</span>
              </div>
              <div className={styles.option}>
                <ArrowUpRight size={14} color={`var(--warm-prime-azure)`}/>
              </div>
            </div>
           </div>
      }
    </div>
  )
}

 