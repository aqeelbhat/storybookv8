import classnames from 'classnames'
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, MoreVertical, Plus } from 'react-feather'
import { UserIdControlNew } from '../controls'
import { getDateObject, getUserDisplayName } from '../Form/util'
import { getSignedUser, isCurrentUserAdmin } from '../SigninService'
import { DelegateUser, mapUser, mapUserId, User } from '../Types'
import { DelegateFilterByType } from '../Types/delegate'
import styles from './userDelegation.module.scss'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export interface UserDelegationDetailListProps {
  delegatedUser: Array<User>
  responsibilitiesList: Array<DelegateUser>
  delegateFilterType: DelegateFilterByType
  onChangeFilter?: (option: DelegateFilterByType) => void
  onEdit?: (user: User, delegateIndex:number) => void
  onDelete?: (user: User, delegateIndex:number) => void
  onBackClick?: () => void
  onAddNew?: () => void
}

export interface DelegationRowProps {
  index: string
  delegateUserIndex?: number
  toDelegateUser: User
  forDelegateUser: DelegateUser
  delegateType?: DelegateFilterByType
  onEdit?: (user: User, delegateIndex:number) => void
  onDelete?: (user: User, delegateIndex:number) => void
}

export interface DelegateTypeFilterProps {
  value: string
  onChange?: (option: DelegateFilterByType) => void
}

export function DelegateTypeFilter (props: DelegateTypeFilterProps) {

  const [optionListOpen, setOptionListOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<DelegateFilterByType>(DelegateFilterByType.myDelegate)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  const DelegationByTypeToDisplayVal = {
    [DelegateFilterByType.myDelegate]: t('--delegationType--.--myDelegate--'),
    [DelegateFilterByType.myResponsibilities]: t('--delegationType--.--myResponsibilities--'),
    [DelegateFilterByType.admin]: t('--delegationType--.--admin--'),
  }

  useEffect(() => {
    if (props.value) {
      setSelectedOption(DelegateFilterByType[props.value])
    }
  }, [props.value])

  function selectOption (option: DelegateFilterByType) {
    if (option) {
      setSelectedOption(option)
      setOptionListOpen(false)

      if (props.onChange) {
        props.onChange(option)
      }
    }
  }

  return (
    <div className={styles.sortSelector}>
      <div className={`${styles.selection} ${optionListOpen ? styles.selectionActive : ''}`} onClick={() => setOptionListOpen(true)}>
        <div className={styles.label}><div className={styles.value}>{selectedOption ? DelegationByTypeToDisplayVal[selectedOption] : ''}</div></div>
        <ChevronDown size={22} strokeWidth={2} color='var(--warm-neutral-shade-300)' />
      </div>
      { optionListOpen &&
        <div className={styles.optionList}>
          <div className={classnames(styles.option, {[styles.active]: selectedOption === DelegateFilterByType.myDelegate})} onClick={() => selectOption(DelegateFilterByType.myDelegate)}>
            {DelegationByTypeToDisplayVal[DelegateFilterByType.myDelegate]}</div>
          <div className={classnames(styles.option, {[styles.active]: selectedOption === DelegateFilterByType.myResponsibilities})} onClick={() => selectOption(DelegateFilterByType.myResponsibilities)}>
            {DelegationByTypeToDisplayVal[DelegateFilterByType.myResponsibilities]}</div>
          { isCurrentUserAdmin() && <div className={classnames(styles.option, {[styles.active]: selectedOption === DelegateFilterByType.admin})} onClick={() => selectOption(DelegateFilterByType.admin)}>
            {DelegationByTypeToDisplayVal[DelegateFilterByType.admin]}</div>}
        </div>
      }
            { optionListOpen && <div className={styles.backdrop} onClick={() => setOptionListOpen(false)}></div>}
    </div>
  )
}

function DelegationRowComponent (props: DelegationRowProps) {

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [forDelegateUser, setForDelegatUser] = useState<User>()
  const [delegateUserIndex, setDelegateUserIndex] = useState<number>(0)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() =>{
    if(props.forDelegateUser){
      if(props.forDelegateUser?.userId) {
        const user = mapUser(props.forDelegateUser?.userId)
        setForDelegatUser(user)
      }
    }
  }, [props.forDelegateUser])

  useEffect(() => {
    if (props.delegateUserIndex > -1) {
      setDelegateUserIndex(props.delegateUserIndex)
    }
  }, [props.delegateUserIndex])

  function parseDate (date: string) {
    return date ? moment(getDateObject(date)).format('MMM DD, YYYY') : ''
  }

  function onPopoverToggle () {
    setIsPopoverOpen(!isPopoverOpen)
  }

  function hidePopover (e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setIsPopoverOpen(false)
  }

  function handleEditDelegate (user: User) {
    if (props.onEdit) {
      props.onEdit(user, delegateUserIndex)
    }
  }

  function handleDeleteDelegate (user: User) {
    if (props.onDelete) {
      props.onDelete(user, delegateUserIndex)
    }
  }

  return (
    <div className={styles.newDelegateTableRow} key={`${props.index}`} data-test-id={`${props.delegateType}_row_${props.index}`}>
        <div className={classNames(styles.newDelegateTableRowcol, styles.firstRow, styles.colSize)}>
          <div className={styles.userCard}>
          <UserIdControlNew
            config={{
              optional: false,
              isReadOnly: true,
              forceValidate: false,
              selectMultiple: false,
              isBgColorNotRequired: true
            }}
            dataFetchers={{
              getUser: undefined,
              getUserProfilePic: undefined
            }}
            value={forDelegateUser}         
          />
          </div>
          <div className={styles.icon}><ArrowRight size={16}/></div>
        </div>
        <div className={classNames(styles.newDelegateTableRowcol, styles.colSize)}>
          <UserIdControlNew
              config={{
                optional: false,
                isReadOnly: true,
                forceValidate: false,
                selectMultiple: false,
                isBgColorNotRequired: true
              }}
              dataFetchers={{
                getUser: undefined,
                getUserProfilePic: undefined
              }}
              value={props.toDelegateUser}         
            />
        </div>
        <div className={classNames(styles.newDelegateTableRowcol, styles.colSize)}>
          <span className={styles.value}>{props.forDelegateUser.byUserName || getUserDisplayName(mapUserId(props.forDelegateUser.byUser))}</span>
        </div>
        <div className={classNames(styles.newDelegateTableRowcol, styles.dateCol)}>
          <span className={styles.date}>{parseDate(props.forDelegateUser.startDate)}</span>
        </div>
        <div className={classNames(styles.newDelegateTableRowcol, styles.dateCol)}>
          <span className={styles.date}>{parseDate(props.forDelegateUser.endDate)}</span>
        </div>
        <div className={classNames(styles.newDelegateTableRowcol, styles.colSize)}>
          <span className={styles.reason}>{props.forDelegateUser.reason}</span>
        </div>
        {props.delegateType !== DelegateFilterByType.myResponsibilities &&
          <div className={styles.action}>
            <MoreVertical size={16} color="var(--warm-neutral-shade-300)" cursor="pointer" onClick={onPopoverToggle} />
            { isPopoverOpen && <div className={styles.actionPopoverContainer}>
                    <ul className={styles.actionList}>
                      <li className={styles.actionListItem} onClick={() => handleEditDelegate(props.toDelegateUser)}>
                        <span>{t('--delegationDetail--.--edit--')}</span>
                      </li>
                      <li className={styles.actionListItem} onClick={() => handleDeleteDelegate(props.toDelegateUser)}>
                        <span>{t('--delegationDetail--.--delete--')}</span>
                      </li>
                    </ul>
                </div> }
              { isPopoverOpen && <div className={styles.actionPopoverBackdrop} onClick={hidePopover}></div> }
          </div>}
    </div>
  )
}
export function DelegationRow (props: DelegationRowProps) {
  return <I18Suspense><DelegationRowComponent {...props} /></I18Suspense>
}

function UserDelegationDetailListComponent (props: UserDelegationDetailListProps) {

  const [responsiblityToUser, setResponsiblityToUser] = useState<User>()
  const [delegateUsersList, setDelegateUsersList] = useState<Array<User>>([])
  const [delegateFilter, setDelegateFilter] = useState<DelegateFilterByType>(DelegateFilterByType.myDelegate)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.delegatedUser) {
      setDelegateUsersList(props.delegatedUser)
    }
  }, [props.delegatedUser])

  useEffect(() => {
    if (props.delegateFilterType) {
      setDelegateFilter(props.delegateFilterType)
    }
    if (props.delegateFilterType === DelegateFilterByType.myResponsibilities) {
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
        setResponsiblityToUser(mapUser(user))
      }
    }
  }, [props.delegateFilterType])

  function handleFilterChange (selectedType: DelegateFilterByType) {
    if (props.onChangeFilter) {
      props.onChangeFilter(selectedType)
    }
  }

  function handleAddNewDelegation () {
    if (props.onAddNew) {
      props.onAddNew()
    }
  }
  
  return (
    <div className={styles.newDelegate}>
        <div className={styles.headerCard}>
            <div className={styles.title}>
                <ArrowLeft size={16} color={`var(--warm-neutral-shade-400)`} cursor="pointer" onClick={props.onBackClick}/>
                <span>{t('--delegationDetail--.--delegateList--')}</span>
            </div>
            <div className={styles.filters}>
                <div className={styles.type}>
                  <DelegateTypeFilter onChange={handleFilterChange} value={delegateFilter}/>
                </div>
                <div className={styles.addNewButton} onClick={handleAddNewDelegation}>
                  <Plus size={14} color={`var(--warm-neutral-shade-400)`} />
                  <span className={styles.buttonLabel}>{t('--delegationDetail--.--delegateTo--')}</span>
                </div>
            </div>
        </div>
        <div>
            <div className={styles.newDelegateTable}>
                <div className={styles.header}>
                    <div className={classNames(styles.headerCol)}>{t('--delegationDetail--.--from--')}</div>
                    <div className={classNames(styles.headerCol)}>{t('--delegationDetail--.--delegateToLabel--')}</div>
                    <div className={classNames(styles.headerCol)}>{t('--delegationDetail--.--assignedBy--')}</div>
                    <div className={classNames(styles.newDelegateTableRowcol, styles.dateCol)}>{t('--delegationDetail--.--startDate--')}</div>
                    <div className={classNames(styles.newDelegateTableRowcol, styles.dateCol)}>{t('--delegationDetail--.--endDate--')}</div>
                    <div className={classNames(styles.headerCol, styles.reasonCol)}>{t('--delegationDetail--.--reason--')}</div>
                    <div className={styles.action}> </div>
                </div>
                <div>
                  {delegateFilter !== DelegateFilterByType.myResponsibilities && delegateUsersList && Array.isArray(delegateUsersList) &&
                    delegateUsersList.map((toUser, index) => {
                      return (toUser && toUser.delegatedUsers && toUser.delegatedUsers.map((delegateUser, delegateIndex) => {
                        return (
                        <DelegationRow
                          key={`User_${index}_${delegateIndex}`}
                          index={`User_${index}_${delegateIndex}`}
                          delegateUserIndex={delegateIndex}
                          toDelegateUser={toUser}
                          forDelegateUser={delegateUser}
                          delegateType={delegateFilter}
                          onEdit={props.onEdit}
                          onDelete={props.onDelete}
                        />)
                      }))
                    })
                  }
                  {delegateFilter === DelegateFilterByType.myResponsibilities && props.responsibilitiesList && Array.isArray(props.responsibilitiesList) &&
                    props.responsibilitiesList.map((toUser, index) => {
                      return (
                        <DelegationRow
                          key={`Responsiblitiy_${index}`}
                          index={`User_${index}`}
                          delegateUserIndex={index}
                          toDelegateUser={responsiblityToUser}
                          forDelegateUser={toUser}
                          delegateType={delegateFilter}
                        />)
                    })
                  }
                </div>
            </div>
        </div>
    </div>
  )
}
export function UserDelegationDetailList (props: UserDelegationDetailListProps) {
  return <I18Suspense><UserDelegationDetailListComponent {...props} /></I18Suspense>
}

 