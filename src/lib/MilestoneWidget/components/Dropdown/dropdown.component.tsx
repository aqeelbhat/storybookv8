import React, { useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical } from 'react-feather'

import style from './dropdown.module.scss'

export interface DropdownOption {
  id: string
  label: string
}

export interface DropdownProps {
  options: Array<DropdownOption>
  itemElement?: (props: { label: string }) => React.ReactElement
  toggleElement?: React.ReactElement
  widthBorder?: boolean
  size?: 'small' | 'medium' | 'large'
  onOptionClick?: (option: DropdownOption) => void
}

export function DropdownComponent (props: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function onToggle () {
    setIsOpen(!isOpen)
  }

  function onOptionClick (option: DropdownOption) {
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

    return <MoreVertical size={22} color='#485460' />
  }

  return <div className={style.container}>
    <Dropdown toggle={onToggle} isOpen={isOpen} className={style.dropdown}>
      <DropdownToggle data-toggle="dropdown" tag="button" className={`dropdownToggle ${style.dropdownToggle} ${props.widthBorder ? style.dropdownToggleWithBorder : ''}`}>
        { !props.toggleElement && <div className={`${getIconWrapperSizeClass()}`}>
          { getIconWithSize() }
        </div> }
        { props.toggleElement }
      </DropdownToggle>
      <DropdownMenu className={`dropdownMenu ${style.dropdownMenu} ${getMenuSizeClass()}`}>
        { props.options.map((option: DropdownOption, index: number) => (
          <DropdownItem className={style.dropdownItem} key={index} onClick={() => onOptionClick(option)}>
            { !props.itemElement && <>{option.label}</> }
            { props.itemElement && <props.itemElement label={option.label}/> }
          </DropdownItem>
        )) }
      </DropdownMenu>
    </Dropdown>
  </div>
}