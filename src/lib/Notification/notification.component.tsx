import React, { useEffect, useState } from "react";
import { PortalPanelDialog } from "../Portal";
import styles from './notification.module.scss';
import { UserId } from "../Types";
import classnames from "classnames";
import { getUserDisplayName } from "../Form";
import { createImageFromInitials } from "../util";
import { X } from "react-feather";
import { Grid } from "@mui/material";
import Ellipse from "./assets/Ellipse.svg"
import { InAppNotification, TYPE } from "./types";
import moment from "moment";
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";

export interface NotificationProps {
    isOpen?: boolean
    notificationList?: Array<InAppNotification>
    bannerText?: string
    newNotificationCount?: number
    onNotificationClick?: (notification: InAppNotification) => void
    fetchNotifications?: () => void
    onClose?: () => void
}

export function Notification (props: NotificationProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [bannerText, setBannerText] = useState<string>('')
  const [notificationList, setNotificationList] = useState<Array<InAppNotification>>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON]) 
  const [newNotificationCount, setNewNotificationCount] = useState<number>(0)

  const NotificationByTypeDisplayval = {
    [TYPE.AtMention]: t('--notificationType--.--mentionedYou--'),
    [TYPE.Reply]: t('--notificationType--.--reply--'),
    [TYPE.MessageShare]: t('--notificationType--.--messsageShare--'),
    [TYPE.RMI]: t('--notificationType--.--rmi--'),
    [TYPE.RMI_REPLY]: t('--notificationType--.--rmiReply--'),
  }

  useEffect(() => {
    if (props.bannerText) {
        setBannerText(props.bannerText)
    }
  }, [props.bannerText])

  useEffect(() => {
    setNotificationsOpen(props.isOpen)
  }, [props.isOpen])

  useEffect(() => {
    if (props.newNotificationCount > -1) {
      setNewNotificationCount(props.newNotificationCount)
    }
  }, [props.newNotificationCount])

  useEffect(() => {
    if (props.notificationList) {
        setNotificationList(props.notificationList)
    }
  }, [props.notificationList])

  function getProfilePicture(user: UserId): string {
    if (user.picture) {
      return user.picture
    } 
    if (getUserDisplayName(user)) {
      const nameFragment = getUserDisplayName(user).split(' ')
      return createImageFromInitials(nameFragment[0], nameFragment[1])
    }
    return ''
  }

  function getDays (addedNotificationDate: string): string {
    const diff = moment(new Date).diff(moment(addedNotificationDate), t('--days--'))
    return diff === 0 ? t('--today--') : diff === 1 ? `${t('--yesterday--')}` : `${diff} ${t('--days--')}`
  }

  function toggle () {
    if (props.onClose) {
        props.onClose()
    }
  }

  function handleOnClickNotification (notification: InAppNotification) {
    if (props.onNotificationClick) {
        props.onNotificationClick(notification)
    }
  }

  function handleOnScrollToBottom () {
    if (props.fetchNotifications) {
        props.fetchNotifications()
    }
  }

  function checkIsItNewNotification (index: number) : boolean {
    if (newNotificationCount && index < newNotificationCount) {
        return true
    }
    return false
  }

  function getNotificationTitle (notification: InAppNotification) {
    let userName = notification.fromUser.userName
    if (notification.fromUser.firstName || notification.fromUser.lastName) {
      userName = `${notification.fromUser.firstName} ${notification.fromUser.lastName}`;
    }
    return ` ${userName} ${NotificationByTypeDisplayval[notification.type]}`
  }

  return (
    <>
      <PortalPanelDialog isOpen={notificationsOpen} bannerLoaded={!!bannerText} isExtremeRightPanel={true} onScrollToBottom={handleOnScrollToBottom}>
        <div className={styles.notificationPanel}>
          <div className={styles.header}>
            <div className={styles.title}>{t('--notifications--')}</div>
              {/* <div className={styles.clearBtn}>Clear notifications</div> */}
              <div className={styles.moreAction}>
                {/* <div className={styles.allReadBtn}>
                    <Check size={16} color="var(--warm-neutral-shade-300)"/>
                    <span>{t('--markAllAsRead--')}</span>
                </div> */}
                <X size={16} color="var(--warm-neutral-shade-300)" onClick={toggle} />
              </div> 
            </div>

                <div className={styles.approvalList}>
                    <Grid container spacing={1}>
                    {notificationList && notificationList.length > 0 && notificationList.map((notification, i) =>
                    <Grid item xs={12} className={classnames(styles.approvalItem, {[styles.unRead]: !notification?.read}, {[styles.newNotifications] : checkIsItNewNotification(i)})} key={i} onClick={() => handleOnClickNotification(notification)}>
                      <div className={styles.profile}>
                        {notification.fromUser && <img src={getProfilePicture(notification.fromUser)} alt="NOtification" />}
                      </div>
                      <div className={styles.messageBody}>
                        <div>
                          {
                            <div className={styles.messageText}>
                            {/* <span className={styles.requestor}>{notification.fromUser && getUserDisplayName(notification.fromUser)} requested access</span> to join */}
                            {getNotificationTitle(notification)}
                          </div>}
                            {/* 
                            {notification.type === TYPE.RMI &&
                            <div className={styles.messageText}>
                              <span className={styles.requestor}>{notification.fromUser && getUserDisplayName(notification.fromUser)}</span> requested more info in 
                            </div>} */}
                        </div>
                        <div>
                          <span className={styles.comment}>{notification.message}</span>
                        </div>
                        <div className={styles.info}>
                          <span className={styles.id}>{notification?.linkText}</span>
                          <img src={Ellipse} /> 
                          <span className={styles.messageTimestamp}>{getDays(notification.created)}</span>
                        </div>
                      </div>
                      {!notification.read && <div className={styles.unreadTag}></div>}
                    </Grid>
                    )}
                    </Grid>
                </div>
              </div>
            </PortalPanelDialog>
    </>
  )
}
