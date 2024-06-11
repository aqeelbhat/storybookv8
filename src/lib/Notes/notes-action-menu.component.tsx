/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useRef, useState } from 'react'
import { Check, Edit, Eye, MoreHorizontal, Trash2 } from 'react-feather'
import style from './note.module.scss'
import lock from './assets/lock_filled.svg'
import { Popover } from 'reactstrap'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../i18n'

interface NoteActionMenuProps {
  hideEditAction?: boolean
  isPrivateNoteEnabled?: boolean
  isStreamMessage?: boolean
  isNoteVisible?: boolean
  hideDeleteAction?: boolean
  isReplyAction?: boolean
  onDelete?: (e?: React.BaseSyntheticEvent) => void
  onChangingVisibility?: (visibility: boolean) => void
  onEdit?: (e?: React.BaseSyntheticEvent) => void

}

export const NoteActionMenuComponent = (props: NoteActionMenuProps) => {
  const { t } = useTranslationHook(NAMESPACES_ENUM.NOTES)
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const popoverTargetElem = useRef<HTMLDivElement>(document.createElement('div'))
  function onDelete (e: React.BaseSyntheticEvent) {
    if (props.onDelete) {
      setIsPopoverOpen(false)
      props.onDelete(e)
    }
  }
  function onEdit (e: React.BaseSyntheticEvent) {
    if (props.onEdit) {
      setIsPopoverOpen(false)
      props.onEdit(e)
    }
  }
  function updatePrivateNote (params: boolean) {
    if (props.onChangingVisibility) {
      setIsPopoverOpen(false)
      props.onChangingVisibility(params)
    }
  }
  function onPopoverToggle () {
    setIsPopoverOpen(!isPopoverOpen)
  }

  function hidePopover () {
    setIsPopoverOpen(false)
  }
  useEffect(() => {
    window.addEventListener('click', hidePopover)

    return () => {
      window.removeEventListener('click', hidePopover)
    }
  }, [])
  return (
    <div className={style.actionMenu}>
        <div ref={popoverTargetElem} onClick={onPopoverToggle}>
          <MoreHorizontal className={style.actionMenuMoreIcon} size={18} color={isPopoverOpen ? 'var(--warm-neutral-shade-600)' : 'var(--warm-neutral-shade-200)'} cursor={'pointer'}></MoreHorizontal>
        </div>
        <Popover flip target={popoverTargetElem} popperClassName={style.actionMenuPopover} placement="auto" isOpen={isPopoverOpen} toggle={onPopoverToggle} hideArrow={true}>
          <div className={style.actionMenuOption}>
            {!props.isReplyAction && props.isPrivateNoteEnabled && !props.isStreamMessage && <div className={`${style.actionMenuOptionVisibility} ${(!props.hideEditAction || !props.hideDeleteAction) ? style.actionMenuOptionVisibilityBorder : ''}`}>
              <div className={`${style.actionMenuOptionItem} ${props.isNoteVisible ? style.actionMenuOptionItemActive : ''}`} onClick={() => updatePrivateNote(false)}>
                <Eye size={16} color='var(--warm-neutral-shade-200)'></Eye>
                <div className={style.actionMenuOptionItemDetails}>
                  <div className={style.actionMenuOptionItemDetailsText}>{t('--public--')} {props.isNoteVisible && <Check size={16} color='var(--warm-neutral-shade-400)'></Check>}</div>
                  <div className={style.actionMenuOptionItemDetailsInfo}>{t('--visibleToEveryone--')}</div>
                </div>
              </div>
              <div className={`${style.actionMenuOptionItem} ${!props.isNoteVisible ? style.actionMenuOptionItemActive : ''}`} onClick={() => updatePrivateNote(true)}>
                <img src={lock} alt='' />
                <div className={style.actionMenuOptionItemDetails}>
                  <div className={style.actionMenuOptionItemDetailsText}>{t('--private--')} {!props.isNoteVisible && <Check size={16} color='var(--warm-neutral-shade-400)'></Check>}</div>
                  <div className={style.actionMenuOptionItemDetailsInfo}>{t('--visibleOnlyToParticipantsAndAdmins--')}</div>
                </div>
              </div>
            </div>}
            {(!props.hideEditAction || !props.hideDeleteAction) && <>
              {!props.hideEditAction && <div className={style.actionMenuOptionItem} onClick={onEdit}>
                <Edit size={16} color='var(--warm-neutral-shade-200)'></Edit>
                <div className={style.actionMenuOptionItemDetails}>
                  <div className={style.actionMenuOptionItemDetailsText}>{t('--editMessage--')}</div>
                </div>
              </div>}
              {!props.hideDeleteAction && <div className={style.actionMenuOptionItem} onClick={onDelete}>
                <Trash2 size={16} color='var(--warm-neutral-shade-200)'></Trash2>
                <div className={style.actionMenuOptionItemDetails}>
                  <div className={style.actionMenuOptionItemDetailsText}>{t('--deleteMessage--')}</div>
                </div>
              </div>}
            </>}
        </div>
        </Popover>
    </div>
  )
}

export function NoteActionMenu (props: NoteActionMenuProps) {
  return <I18Suspense><NoteActionMenuComponent {...props}></NoteActionMenuComponent></I18Suspense>
}
