import React, { useRef, useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Check, MoreVertical, Paperclip, X, File, XCircle } from 'react-feather'

import style from './menu-action.module.scss'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from  '../../../i18n'

export interface MenuOption {
  id: string
  label: string | React.ReactElement
  disabled? : boolean
}

export interface MenuActionProps {
  options: Array<MenuOption>
  status?: string
  itemElement?: React.ReactElement
  toggleElement?: React.ReactElement
  widthBorder?: boolean
  size?: 'small' | 'medium' | 'large'
  onOptionClick?: (option: MenuOption) => void
}

export function MenuAction (props: MenuActionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function onToggle () {
    setIsOpen(!isOpen)
  }

  function onOptionClick (option: MenuOption) {
    if (props.onOptionClick && typeof props.onOptionClick === 'function') {
      props.onOptionClick(option)
    }
  }

  function getIconWrapperSizeClass (): string {
    if (props.size && props.size === 'small') {
      return style.dropdownIconWrapperSmall
    }

    if (props.size && props.size === 'medium') {
      return style.dropdownIconWrapperMedium
    }

    if (props.size && props.size === 'large') {
      return style.dropdownIconWrapperLarge
    }

    return style.dropdownIconWrapperMedium
  }
  
  function getMenuSizeClass (): string {
    if (props.size && props.size === 'small') {
      return style.dropdownMenuSmall
    }

    if (props.size && props.size === 'medium') {
      return style.dropdownMenuMedium
    }

    return style.dropdownMenuMedium
  }
  
  function getIconWithSize (): React.ReactElement {
    if (props.size && props.size === 'small') {
      return <MoreVertical size={18} color='#485460' />
    }

    if (props.size && props.size === 'medium') {
      return <MoreVertical size={22} color='#485460' />
    }

    if (props.size && props.size === 'large') {
      return <MoreVertical size={26} color='#485460' />
    }

    return <MoreVertical size={22} color='#485460' />
  }

  return <div className={style.menuActioncontainer}>
    <Dropdown toggle={onToggle} isOpen={isOpen}>
      <DropdownToggle data-toggle="dropdown" tag="button" className={`${style.dropdownToggle} ${props.widthBorder ? style.dropdownToggleWithBorder : ''}`}>
        { props.toggleElement
          ? props.toggleElement
          : <div className={`${style.dropdownIconWrapper} ${getIconWrapperSizeClass()}`}>
              { getIconWithSize() }
            </div>
        }
      </DropdownToggle>
      <DropdownMenu className={`${style.dropdownMenu} ${getMenuSizeClass()}`}>
        { props.options.map((option: MenuOption, index: number) => (
          option.id === 'divider'
          ? <DropdownItem key={index} className={style.dropdownDivider} divider/>
          : <DropdownItem
              className={props.status && props.status === option.id ? style.dropdownSelected : option.disabled ? style.dropdownDisabled : style.dropdownItem}
              key={index}
              onClick={() => onOptionClick(option)}
              disabled={option.disabled ? option.disabled : false}
            >
              {option.label} {props.status && props.status === option.id ? <Check size={18} color='#0B4D7D'/> : '' }
            </DropdownItem>
        )) }
      </DropdownMenu>
    </Dropdown>
  </div>
}

export type CommentPopupProps = {
  isOpen: boolean
  label: string
  toggle: () => void
  allowAttachment?: boolean
  onSubmit?: (comment: string, attachment?: File) => void
}

function CommentPopupComponent (props: CommentPopupProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null)
  const [comment, setComment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  function handleChange (event) {
    if (event.target.files.length) {
      setFile(event.target.files[0])
    }
  }

  function openFileInput () {
    if (attachmentInputRef.current) {
      attachmentInputRef.current.click()
      if (attachmentInputRef.current.value) {
        attachmentInputRef.current.value = ''
      }
    }
  }

  function handleRemoveFile () {
    setFile(null)
  }

  function handleSubmit () {
    if (props.onSubmit) {
      if (file) {
        props.onSubmit(comment, file)
      } else props.onSubmit(comment)
    }
    setComment('')
    setFile(null)
  }

  function setFileInputValueToNull (event) {
    event.target.value = null
  }

  return (
    <div className={style.wrapper}>
      {
        props.isOpen &&
        <div className={style.wrapperPopup}>
          <div className={style.wrapperPopupHeader}>
            {props.label} <X size={18} color='#0B4D7D' onClick={() => { props.toggle(); setComment(''); setFile(null) }} />
          </div>
          <div className={style.wrapperPopupBox}>
            <textarea
              placeholder={t('--addYourCommentHere--')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {props.allowAttachment &&
              <>
                <Paperclip size={18} cursor='pointer' strokeWidth={1} color='#0B4D7D' onClick={openFileInput} />
                <input
                  className={style.wrapperPopupBoxFile}
                  type="file"
                  ref={attachmentInputRef}
                  onClick={setFileInputValueToNull}
                  onChange={handleChange}
                />
              </>
            }
          </div>
          {
            file &&
            <div className={style.wrapperPopupBoxAttachment}>
              <span className={style.wrapperPopupBoxAttachmentItem}><File size={18} color='#0C48D0' />{file.name}<XCircle onClick={handleRemoveFile} size={14} color='#485460' cursor='pointer'/></span>
            </div>
          }
          <div className={style.wrapperPopupButtonBox}><button type="button" onClick={handleSubmit}>Submit</button></div>
        </div>
      }
    </div>
  )
}
export function CommentPopup (props: CommentPopupProps) {
  return <I18Suspense><CommentPopupComponent {...props}  /></I18Suspense>
}