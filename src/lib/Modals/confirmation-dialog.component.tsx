/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useState } from 'react'
import classnames from 'classnames'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import styles from './confirmation-dialog.module.scss'
import { ConfirmationModalProps } from './types'
import { AlertCircle, Check, X } from 'react-feather';
import classNames from 'classnames';
import { Option } from '../Inputs';
import { CheckboxNew } from '../controls/checkboxControl.component';
import AlertCirleFilled from './assets/alert-circle-filled.svg';
import HoneyAlertCircleFilled from './assets/honey-alert-circle-filled.svg';
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
 
export function ConfirmationDialogComponent (props: ConfirmationModalProps) {

  // TODO: Replace native buttons with OroButton Component

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: props.width && props.width > 400 ? props.width : 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    padding: (props.theme === 'coco' && (!props.isReviewAndTodoModal && !props.isCurrencyUpdateModal)) ? '16px' : ((props.theme === 'coco' && (props.isReviewAndTodoModal || props.isCurrencyUpdateModal)) || props.isPeopleTab) ? '24px' : '32px',
    paddingBottom: (props.theme === 'coco' && (!props.isReviewAndTodoModal && !props.isCurrencyUpdateModal)) ? '16px' : '24px',
    borderRadius: props.theme === 'coco' ? '8px' : props.radius ? props.radius : '0px'
  }
  const [input, setInput] = useState<string>('')
  const [confirmation, setConfirmation] = useState<Option[]>([])
  const [closeModalButtonTabIndex, setCloseModalButtonTabIndex] = useState<number>(-1)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  function handleChange (event) {
    setInput(event.target.value)
  }

  function toggleModal () {
    setConfirmation([])
    if (props.toggleModal) {
      props.toggleModal()
    }
  }

  function handlePrimaryClick () {
    setConfirmation([])
    if (props.onPrimaryButtonClick) {
      props.onPrimaryButtonClick(props.acceptInput ? input : undefined)
    }
  }

  function handleSecondaryClick () {
    setConfirmation([])
    if (props.onSecondaryButtonClick) {
      props.onSecondaryButtonClick()
    }
  }

  function themeClass (): string {
    return props.theme ? styles['theme' + props.theme] : styles.theme
  }

  function preparePrimaryButtonClassnames() {
    return classnames(
      styles.buttonPrimary, { [styles.danger]: (props.actionType === 'danger') && !props.isPeopleTab },
      { [styles.newDanger]: (props.actionType === 'danger') && props.isPeopleTab }
    )
  }

  function prepareFooterClassnames() {
    return classNames(
      styles.modalFooter, `${(props.isReviewAndTodoModal || props.isCurrencyUpdateModal || props.isSeperatorNeeded) ? styles.seperator : ''}`
    )
  }

  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className={classNames(styles.confirmationModal, themeClass())}>
            <div className={styles.modalHeader}>
              <div className={styles.group}>
                {props.theme === 'coco' && props.isReviewAndTodoModal && <span className={styles.icon}><Check size={17} color={'var(--warm-stat-mint-regular)'} /></span>}
                {props.theme === 'coco' && props.actionType === 'danger' && <AlertCircle color={'#f55f44'} size={22} onClick={toggleModal} />}
                {props.theme === 'coco' && props.actionType === 'warning' && <AlertCircle color={'var(--warm-stat-honey-regular)'} size={22} />}
                {props.isPeopleTab && props.actionType === 'danger' && <img width={20} height={20} src={AlertCirleFilled} />}
                {props.isPeopleTab && props.actionType === 'warning' && <img width={20} height={20} src={HoneyAlertCircleFilled} />}
                {props.isReviewAndTodoModal && <span className={styles.title}>{t('--completeTitle--',{title:props.title})}</span>}
                {!props.isReviewAndTodoModal && <span className={props.isPeopleTab ? styles.title : ''}>{props.title}</span>}
              </div>
              {
                props.theme === 'coco' && 
                <span className={styles.closeBtn} tabIndex={closeModalButtonTabIndex} onBlur={() => setCloseModalButtonTabIndex(-1)}>
                  <X color={'var(--warm-neutral-shade-300)'} size={20} onClick={toggleModal}/>
                </span>
              }
            </div>

            {
              !props.isCurrencyUpdateModal &&
              <div className={`${styles.modalBody} ${props.actionType === 'danger' ? styles.alert : ''}`}>
                {props.isReviewAndTodoModal && <span className={styles.inputArealabel}>{t('--addComment--')} <span className={styles.optional}>{t('--optional--')}</span></span>}

                {props.description && <p className={styles.description}>{props.description}</p>}

                {props.entityName ? <p><strong>{props.entityName}</strong></p> : null}

                {props.confirmDate ? <p>{t('--date--')} <strong>{props.confirmDate}</strong></p> : null}

                {props.acceptInput && <textarea value={input} onChange={handleChange} />}

                {props.confirmationMessage &&
                  <CheckboxNew
                    value={confirmation}
                    options={[{ id: props.confirmationMessage, displayName: props.confirmationMessage, path: props.confirmationMessage }]}
                    config={{}}
                    onChange={value => setConfirmation(value)}
                  />}
              </div>
            }

            {
              props.isCurrencyUpdateModal &&
              <div className={styles.modalBody}>
                {props.description ? props.description : ''}
              </div>
            }
            <div className={prepareFooterClassnames()}>
              <button className={styles.buttonCancel} onClick={handleSecondaryClick}>
                {props.secondaryButton ? props.secondaryButton : t('--cancel--')}
              </button>
              <button
                className={preparePrimaryButtonClassnames()}
                onClick={handlePrimaryClick}
                disabled={props.confirmationMessage && (confirmation.length < 1)}
                onBlur={() => setCloseModalButtonTabIndex(0)}>
                {props.primaryButton ? props.primaryButton : t('--Continue--')}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}
export function ConfirmationDialog (props: ConfirmationModalProps) {
  return <I18Suspense><ConfirmationDialogComponent {...props} /></I18Suspense>
}
 