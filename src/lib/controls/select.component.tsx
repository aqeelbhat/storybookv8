import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'react-feather'

import styles from './style.module.scss'
import { DROPDOWN_MAX_HEIGHT } from '../MultiLevelSelect/types'
import classNames from 'classnames'

interface SelectProps {
  value?: string
  placeholder?: string
  options: Array<string>
  disabled?: boolean
  readOnly?: boolean
  boxed?: boolean
  color?: string
  onChange?: (value: string) => void
}

export function SelectControl (props: SelectProps) {
  const [value, setValue] = useState<string>('')
  const [expanded, setExpanded] = useState<boolean>(false)
  const optionsWrapper = useRef<any>(null)
  const selectControlContainer = useRef(null)
  const [optionsContainerTop, setOptionsContainerTop] = useState('')
  const [optionsContainerLeft, setOptionsContainertLeft] = useState('')
  const [optionsContainerRight, setOptionsContainertRight] = useState('')

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  function handleChange (newValue) {
    if (!props.readOnly && newValue !== value) {
      setValue(newValue)
      if (props.onChange) {
        props.onChange(newValue)
      }
    }
    toggleOptionList()
  }

  function shallDropdownGrowUp (): boolean {
    if (selectControlContainer.current) {
      const rect = selectControlContainer.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const spaceBelow = viewportHeight - (rect.top + rect.height)
  
      return (spaceBelow < DROPDOWN_MAX_HEIGHT) && (spaceAbove > spaceBelow)
    }
  
    return false
  }

  function toggleOptionList () {
    if (!props.readOnly) {
      setExpanded(!expanded)
    }
  }

  useEffect(() => {
    if (selectControlContainer && selectControlContainer.current && expanded) {
      const { top, left, bottom, width } = selectControlContainer.current.getBoundingClientRect()

      if (shallDropdownGrowUp()) {
        if ((optionsWrapper && optionsWrapper.current)) {
          const { height } = optionsWrapper.current.getBoundingClientRect()
          setOptionsContainerTop((top - height - 6) + 'px')
          setOptionsContainertRight('unset')
          setOptionsContainertLeft(left + 'px')
        }
      } else {
        if (optionsWrapper && optionsWrapper.current) {
            setOptionsContainerTop(bottom + 'px')
            setOptionsContainertLeft(left + 'px')
            setOptionsContainertRight('unset')
        }
      }
    }
  }, [optionsWrapper, optionsWrapper.current, selectControlContainer, selectControlContainer.current, expanded])

  return (
    <div className={classnames(styles.customSelect, {[styles.readOnly]: props.readOnly, [styles.boxed]: props.boxed})} ref={selectControlContainer}>
        <div className={styles.control}>
          <div className={styles.selectedValue} onClick={toggleOptionList} style={{color: `${props.color}`}}>
            {value}
          </div>
          { !props.readOnly && <ChevronDown color={props.color ? props.color : props.boxed ? '#283041' : '#2d8db7'} size={20} onClick={toggleOptionList} />}
        </div>

        { expanded &&
        <div
          ref={optionsWrapper}
          style={{left: optionsContainerLeft, right: optionsContainerRight, top: optionsContainerTop}}
          className={classNames(styles.optionsWrapper, {
            [styles.growUp]: shallDropdownGrowUp()
          })}
        >
          <div className={styles.optionList}>
            { props.options && props.options.map((option, i) => 
              <div
                className={styles.option}
                onClick={(e) => handleChange(option)}
                key={i}
              >
                {option}
              </div>)}
          </div>
        </div>}
        { expanded &&
          <div className={styles.backdrop} onClick={toggleOptionList} />}
    </div>
  )
}
