import React, { Suspense, useEffect, useState } from 'react'
import { Option } from '../Types'
import styles from './prioritySelector.module.scss'
import { Check, ChevronDown, Delete } from 'react-feather'
import classnames from 'classnames'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { Keyboard } from '../Types/common'
// import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from 'i18n'

function PriorityColor (props: { order?: number, color?: string }) {
  return <div className={styles.color} style={{ backgroundColor: props.color || 'var(--warm-neutral-shade-100)' }}></div>
}

export interface PrioritySelectorProps {
  value?: Option
  options: Option[]
  readOnly?: boolean
  className?: string
  onChange?: (value?: Option) => void
}

// TODO: Find a way to handle clear button selection

export function PrioritySelector(props: PrioritySelectorProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  const [selectedPriority, setSelectedPriority] = useState<Option>()
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false)
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)

  useEffect(() => {
    setSelectedPriority(props.value)
  }, [props.value])

  function handleSelection (priority?: Option) {
    setSelectedPriority(priority)
    setOptionsVisible(false)
    setActiveOptionIndex(-1)

    if (props.onChange) {
      props.onChange(priority)
    }
  }

  function handleContainerKeydown(event: React.KeyboardEvent) {
    if (event && event.target !== event.currentTarget) {
      return false
    }

    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
      event.preventDefault()
      
      if (props && props.options.length > 0 && !optionsVisible) {
        setOptionsVisible(true)
      }

      if (props && props.options.length > 0 && optionsVisible && activeOptionIndex > Number.NEGATIVE_INFINITY) {
        const activeOption = props.options[activeOptionIndex]
        handleSelection(activeOption)
      }
    }
    
    if ((event.key === Keyboard.Esc) || (event.key === Keyboard.Escape)) {
      event.preventDefault()

      if (props && props.options.length > 0) {
        setOptionsVisible(false)
        setActiveOptionIndex(-1)
      }
    }
    
    if ((event.key === Keyboard.Down) && (activeOptionIndex < props.options.length - 1)) {
      event.preventDefault()
      setActiveOptionIndex(activeOptionIndex + 1)
    } else if ((event.key === Keyboard.Down) && (activeOptionIndex < props.options.length)) {
      event.preventDefault()
      if (selectedPriority?.displayName) {
        setActiveOptionIndex(props.options.length)
      }
    }

    if ((event.key === Keyboard.Up) && (activeOptionIndex > 0)) {
      event.preventDefault()
      setActiveOptionIndex(activeOptionIndex - 1)
    }
  }

  function prepareOptionItemClassnames(index: number, option: Option) {
    return classnames({ 
      [styles.activeOption]: activeOptionIndex === index }, 
      styles.option, { 
        [styles.selected]: option.path === selectedPriority?.path 
      }
    )
  }

  function handleOptionClick(event: React.MouseEvent, option: Option) {
      event.preventDefault()
      if (event && event.stopPropagation) {
        event.stopPropagation()
      }

      handleSelection(option)
  }

  return (
    <Suspense fallback="loading">
      <div className={styles.prioritySelector} tabIndex={0} onKeyDown={handleContainerKeydown}>
        <div className={classnames(styles.selection, { [styles.focused]: optionsVisible, [styles.readOnly]: props.readOnly })} onClick={(e) => { e.preventDefault(); e.stopPropagation(); !props.readOnly && setOptionsVisible(true) }}>
          {selectedPriority?.displayName &&
            <PriorityColor
              order={props.options?.find(option => option.path === selectedPriority.path)?.customData?.order}
              color={props.options?.find(option => option.path === selectedPriority.path)?.customData?.other?.color}
            />}
          <div className={classnames(styles.value, { [styles.placeholder]: !selectedPriority?.displayName })}>{selectedPriority?.displayName || (props.readOnly ? '-' : t('--Priority--'))}</div>
          {!props.readOnly && <div className={styles.icon}><ChevronDown size={20} color='var(--warm-neutral-shade-300)' /></div>}
        </div>

        {optionsVisible &&
          <div className={styles.optionWrapper}>
            {props.options && props.options.map((option, index) =>
              <div 
                className={prepareOptionItemClassnames(index, option)}
                onClick={(event) => { handleOptionClick(event, option) }}
                key={index}>
                <PriorityColor order={option.customData?.order} color={option.customData?.other?.color} />
                <div className={styles.label}>{option.displayName}</div>
                {option.path === selectedPriority?.path && <Check size={16} color="var(--warm-neutral-shade-400)" />}
              </div>)}
            {selectedPriority?.displayName &&
              <div className={classnames(styles.option, styles.clear, {
                [styles.activeOption]: activeOptionIndex === props.options.length
              })} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSelection() }}>
                <Delete size={18} color='var(--warm-prime-azure)' /><div>{t('--clearSelection--')}</div>
              </div>}
          </div>}

        {optionsVisible &&
          <div className={styles.backdrop} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOptionsVisible(false) }} />}
      </div>
    </Suspense>
  )
}
