import React, { useEffect, useState } from 'react'
import { Check, ChevronDown, ChevronUp } from 'react-feather'
import styles from './status-filter-selector.module.scss'

export interface FilterOption {
  label: string,
  count?: number,
  code: string
}

export function StatusSelector (props: {
  value?: string | Array<string>
  options: Array<{label: string, count?: number, code: string}>
  arrowIcon?: React.ReactNode
  hideCount?: boolean
  showClearButton?: boolean
  placeholder?: string
  multiselect?: boolean
  expandLeft?: boolean
  onChange?: (option: string | Array<string>) => void
}) {
  const [optionListOpen, setOptionListOpen] = useState<boolean>(false)
  const [selectedOptionOpen, setSelectedOptionOpen] = useState<Array<{label: string, count?: number, code: string}>>([])

  useEffect(() => {
    if (props.options.length > 0 && props.multiselect && props.value && Array.isArray(props.value)) {
      const _selectedValues: Array<{label: string, count?: number, code: string}> = []
      props.options.forEach(item => {
        if (props.value?.includes(item.code)) {
          _selectedValues.push(item)
        }
      })
      setSelectedOptionOpen(_selectedValues)
    } else if (props.options.length > 0 && props.value && !Array.isArray(props.value)) {
      props.options.forEach(item => {
        if (props.value && item.code.toLocaleLowerCase() === (props.value as string).toLocaleLowerCase()) {
          setSelectedOptionOpen([item])
        }
      })
    }
  }, [props.value, props.options])

  function checkIfOptionSelected (code: string): boolean {
    const codeFound = selectedOptionOpen?.find(item => item.code === code)
    return !!codeFound
  }

  function selectOption (option: {label: string, count?: number, code: string}) {
    if (props.multiselect) {
      let _filteredOptions: Array<string> = []
      if (checkIfOptionSelected(option.code)) {
        setSelectedOptionOpen(selectedOptionOpen.filter(item => item.code !== option.code))
        _filteredOptions = selectedOptionOpen.filter(item => item.code !== option.code).map(item => item.code)
      } else {
        setSelectedOptionOpen([...selectedOptionOpen, option])
        _filteredOptions = [...selectedOptionOpen, option].map(item => item.code)
      }
      if (props.onChange) {
        props.onChange(_filteredOptions)
      }
    } else {
      setSelectedOptionOpen([option])
      setOptionListOpen(false)

      if (props.onChange) {
        props.onChange(option.code)
      }
    }
  }

  function onOptionClear () {
    setOptionListOpen(false)
    setSelectedOptionOpen([])
    if (props.onChange && props.multiselect) {
      props.onChange([])
    } else if (props.onChange) {
      props.onChange('')
    }
  }

  function handleClose () {
    setOptionListOpen(false)
  }

  return (
    <div className={styles.workstreamSelector}>
      <div className={`${styles.selection} ${optionListOpen ? styles.selectionActive : ''}`} onClick={() => setOptionListOpen(true)}>
        <div className={styles.value}>
          {
            !props.multiselect && <>
              <span className={selectedOptionOpen[0]?.label ? styles.label : styles.placeholder}>{selectedOptionOpen[0]?.label || props.placeholder || ''}</span>
              {!props.hideCount && selectedOptionOpen.length > 0 && <span className={styles.count}>{selectedOptionOpen[0]?.count}</span>}
            </>
          }
          {
            props.multiselect && <>
              <span className={selectedOptionOpen[0]?.label ? styles.label : styles.placeholder}>{selectedOptionOpen[0]?.label || props.placeholder || ''}</span>
              {selectedOptionOpen?.length > 1 && <div className={styles.valueCount}>
                +{selectedOptionOpen?.length - 1}
              </div>}
            </>
          }
        </div>
        {props.arrowIcon
          ? <div className={optionListOpen ? styles.customArrow : ''}>{props.arrowIcon}</div>
          : <>
            {!optionListOpen && <ChevronDown size={22} strokeWidth={2} color='var(--warm-neutral-shade-300)' />}
            {optionListOpen && <ChevronUp size={22} strokeWidth={2} color='var(--warm-neutral-shade-300)' />}
          </>}
      </div>

      { optionListOpen && <div className={`${styles.optionList} ${props.expandLeft ? styles.optionListLeft : ''}`}>
          { props.options.map((option, i) =>
            <div key={i} className={`${checkIfOptionSelected(option.code) ? styles.optionActive : styles.option} ${props.multiselect ? styles.optionMulti : ''}`} onClick={() => selectOption(option)}>
              {props.multiselect && <input type='checkbox' checked={checkIfOptionSelected(option.code)} onChange={() => selectOption(option)} />}
              <span className={styles.label}>{option.label}</span>
              {!props.hideCount && !props.multiselect && <span className={styles.count}>{option.count}</span>}
              {checkIfOptionSelected(option.code) && props.hideCount && !props.multiselect && <Check size={16} color="var(--warm-neutral-shade-400)"></Check>}
            </div>)}
            {props.showClearButton && selectedOptionOpen.length > 0 && <div className={styles.option} onClick={onOptionClear}>
              <span className={styles.labelClear}>Clear filter</span>
            </div>}
        </div>}

      { optionListOpen && <div className={styles.backdrop} onClick={handleClose}></div>}
    </div>
  )
}
