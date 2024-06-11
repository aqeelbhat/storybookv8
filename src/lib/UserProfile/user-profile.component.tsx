import React, { useEffect, useState } from 'react'
import { getUserDisplayName } from '../Form'
import { Group, User } from '../Types'
import style from './user-profile.module.scss'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface UserProfile {
    groups?: Array<Group>
    user: User
}

function UserProfileComponent (props: UserProfile) {
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Array<Group>>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.groups && props.groups.length > 0) {
        setGroups(props.groups)
    }
    if (props.user) {
        setUser(props.user)
    }
  }, [props.groups, props.user])

  const getGroupName = (groupId: string): string => {
    const findRole = groups.find(group => group.id === groupId)
    return findRole ? findRole.name : groupId
  }

  return <div className={style.user}>
      <div className={style.userInfo}>
        <img className={style.userInfoPic} src={user?.picture} alt="" />
        {user && <div className={style.userInfoName}>{getUserDisplayName(user)}</div>}
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--email--')}</div>
          <div className={style.userInfoItemsValue}>{user?.email || '-'}</div>
        </div>
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--username--')}</div>
          <div className={style.userInfoItemsValue}>{user?.userName || '-'}</div>
        </div>
      </div>
      <div className={style.userInfo}>
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--bussinessUnit--')}</div>
          <div className={style.userInfoItemsValue}>{user?.businessUnit || '-'}</div>
        </div>
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--costCenter--')}</div>
          <div className={style.userInfoItemsValue}>{user?.costCenter || '-'}</div>
        </div>
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--department--')}</div>
          <div className={style.userInfoItemsValue}>{user?.departmentName || '-'}</div>
        </div>
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--companyEntity--')}</div>
          <div className={style.userInfoItemsValue}>{user?.defaultCompanyEntity || '-'}</div>
        </div>
      </div>
      {user?.groupIds && user?.groupIds?.length > 0 && <div className={style.userInfo}>
        <div className={style.userInfoItems}>
          <div className={style.userInfoItemsLabel}>{t('--userProfile--.--groups--')}</div>
          <div className={style.userInfoItemsGroups}>
            {user.groupIds.map((group, index) => <div key={index} className={style.userInfoItemsGroupsName}>{getGroupName(group)}</div>)}
          </div>
        </div>
      </div>}
    </div>
}
export function UserProfile (props: UserProfile) {
  return <I18Suspense><UserProfileComponent {...props} /></I18Suspense>
}