/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { X } from 'react-feather'

import { Option } from './../Types'
import { AsyncTypeAheadProps, DOWN_ARROW_KEY_CODE, ENTER_KEY_CODE, ESCAPE_KEY_CODE, UP_ARROW_KEY_CODE } from '../Inputs/types'
import { debounce } from '../util'

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { getI18Text as getI18ControlText } from '../i18n'

export function AsyncTypeAheadControl (props: AsyncTypeAheadProps) {
  const inputRef = useRef(null)
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [searchString, setSearchString] = useState<string>('')
  const [error, setError] = useState<string | null>()
  const [state, setState] = useState<Option>()
  const [options, setOptions] = useState<Option[]>([])
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)
  
  useEffect(() => {
    setState(props.value)
  }, [props.value])

  function triggerValidation (_state?: Option) {
    const err = !_state?.path ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''
    setError(err)
  }

  useEffect(() => {
    if (props.forceValidate) {
      triggerValidation(state)
    }
  }, [props.forceValidate])

  function handleSelection (selection?: Option) {
    setState(selection)
    resetSearch()

    triggerValidation(selection)
    
    if (props.onChange) {
      props.onChange(selection)
    }
  }

  function search (keyword) {
    if (props.onSearch) {
      props.onSearch(keyword)
        .then((options) => {
          setOptions(options || [])
          setActiveOptionIndex(-1)
        })
        .catch(e => console.log(e))
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedSearch = useMemo(() => debounce(search), [])

  function handleSearchInputChange (keyword) {
    setSearchString(keyword)
    debouncedSearch(keyword)
  }

  function resetSearch () {
    setSearchMode(false)
    setOptions([])
    setActiveOptionIndex(-1)
    setSearchString('')
    if(inputRef?.current?.blur) inputRef.current.blur()
    triggerValidation(state)
  }

  function startSearchMode () {
    setSearchString(state?.displayName || '')
    setSearchMode(true)
    state?.displayName && search(state.displayName)
  }

  function focusNextListItem(direction: number) {
    if (direction === DOWN_ARROW_KEY_CODE) {
      const currentActiveElementIsNotLastItem = activeOptionIndex < options.length - 1

      if (currentActiveElementIsNotLastItem) {
        setActiveOptionIndex(activeOptionIndex + 1)
      }
    } else if (direction === UP_ARROW_KEY_CODE) {
      const currentActiveElementIsNotFirstItem = activeOptionIndex > (state ? -1 : 0);
  
      if (currentActiveElementIsNotFirstItem) {
        setActiveOptionIndex(activeOptionIndex - 1)
      }
    }
  }

  function handleKeyDown (e) {
    if (searchMode && options.length > 0) {
      switch (e.keyCode) {
        case ENTER_KEY_CODE:
          handleSelection(options[activeOptionIndex]);
          return;

        case DOWN_ARROW_KEY_CODE:
          e.preventDefault()
          focusNextListItem(DOWN_ARROW_KEY_CODE);
          return;

        case UP_ARROW_KEY_CODE:
          e.preventDefault()
          focusNextListItem(UP_ARROW_KEY_CODE);
          return;

        case ESCAPE_KEY_CODE:
          resetSearch();
          return;

        default:
          return;
      }
    }
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.asyncTypeahead}>
        <input
          id={props.id}
          ref={inputRef}
          type="text"
          className={classnames({ [styles.invalid]: error})}
          placeholder={props.placeholder}
          value={searchMode ? (searchString || '') : (state?.displayName || '')}
          disabled={props.disabled}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onFocus={startSearchMode}
          onKeyDown={handleKeyDown}
        />

        {searchMode &&
          <div className={styles.optionsWrapper}>
            {state &&
              <div
                className={`${styles.optionItem} ${styles.clear} ${activeOptionIndex === -1 ? styles.active : ''}`}
                onClick={() => handleSelection()}
              >
                <X size={14} color={'#0B4D7D'} /><div>{getI18ControlText("--clearSelectedValue--")}</div>
              </div>}
            {options.map((option, i) =>
              <div
                className={`${styles.optionItem} ${state?.displayName === option?.displayName ? styles.selected : ''} ${activeOptionIndex === i ? styles.active : ''}`}
                onClick={() => handleSelection(option)}
                key={i}
              >
                {option.displayName}
              </div>)}
            {options.length === 0 &&
              <div className={`${styles.optionItem} ${styles.hint}`}>
              {searchString ? getI18ControlText('--fieldTypes--.--userId--.--noMatchingResultFound--') : getI18ControlText('--fieldTypes--.--userId--.--typeKeywordToSearch--')}
              </div>}
          </div>}
        {searchMode &&
          <div className={styles.backdrop} onClick={resetSearch}></div>}
      </div>

      {error && 
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}