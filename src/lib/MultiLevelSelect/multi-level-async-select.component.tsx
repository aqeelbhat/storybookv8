/************************************************************
 * Copyright (c) 2023 Orolabs.ai to Present
 * Author: noopur landge
 ************************************************************/

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { ChevronRight, ChevronDown, X, Check, Globe, Search } from 'react-feather'
import { Label } from 'reactstrap'
import classNames from 'classnames'

import { DROPDOWN_MAX_HEIGHT, FIELD_TYPE_BOOL, MultiLevelAsyncSelectProps, Option, OptionLevelProps, SearchResultsProps } from './types'
import { getSelectedOptionsCount, isAlredySelected, isAMatch, isLeafOption, removeAllSelected, putChildren } from './util.service'
import { debounce, MAX_WIDTH_FOR_MOBILE_VIEW } from '../util'

import styles from './styles.module.scss'
import { OptionTreePopup } from './option-tree-popup.component'
import { getI18Text as getI18ControlText, useTranslationHook } from '../i18n'
import { OptionFullPath } from './glance-option.component'
import { OroButton } from '../controls'

function OptionComp (props: {data: Option}) {
  return (
    <>
      {props.data.icon && <img src={props.data.icon} />}
      <div className={styles.optionValueLabel}>
        {props.data.displayName}
      </div>
    </>
  )
}

function Badge (props: {count: number; fieldType: string}) {
  return (
    <div className={classNames(styles.badge, styles.newBadge, { [styles.checkMark]: props.fieldType === FIELD_TYPE_BOOL })}>
      {props.fieldType === FIELD_TYPE_BOOL
        ? '✓'
        : props.count}
    </div>
  )
}

function OptionLevel (props: OptionLevelProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1)
  const [selectedChildrenCount, setSelectedChildrenCount] = useState({})
  const isBigScreen = useMediaQuery({ query: `(min-width: ${MAX_WIDTH_FOR_MOBILE_VIEW})` })

  useEffect(() => {
    const newSelectedChildrenCount = {}
    props.options && props.options.forEach((option, index) => {
      newSelectedChildrenCount[option.id] = getSelectedOptionsCount(option.children, props.selectedValues)
    })
    setSelectedChildrenCount(newSelectedChildrenCount)
  }, [props.options, props.selectedValues])

  function toggleOption (index: number) {
    if (index === selectedOptionIndex) {
      setSelectedOptionIndex(-1)
    } else {
      setSelectedOptionIndex(index)
    }
  }

  function toggleOptionSelection (option: Option) {
    if (typeof props.onOptionChange === 'function') {
      props.onOptionChange({ ...option })
    }
  }

  function handleClickConsideringSelectability (event, option: Option) {
    if (option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable)) {
      event.stopPropagation()
      toggleOptionSelection(option)
    }
  }

  function handleChildOptionSelectionChange (option: Option) {
    const currentParrent = props.options[selectedOptionIndex]
    if (isAlredySelected(currentParrent, props.selectedValues)) {
      // deselect current option
      const optionToBeDeselected = currentParrent
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? allChildrenExceptClickedOption : [option]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, [optionToBeDeselected], currentParrent)
      }
    } else if (props.isParentSelected) {
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? allChildrenExceptClickedOption : [option]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, [], currentParrent)
      }
    } else {
      if (props.onOptionChange) {
        props.onOptionChange(option)
      }
    }
  }

  function handleChildrenSelectionChanges (optionsToBeAdded: Option[], optionsToBeRemoved: Option[], option: Option) {
    const currentParrent = props.options[selectedOptionIndex]
    if (isAlredySelected(currentParrent, props.selectedValues)) {
      // deselect current option
      const optionToBeDeselected = currentParrent
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? [...optionsToBeAdded, ...allChildrenExceptClickedOption] : [...optionsToBeAdded]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, [...optionsToBeRemoved, optionToBeDeselected], currentParrent)
      }
    } else if (props.isParentSelected) {
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? [...optionsToBeAdded, ...allChildrenExceptClickedOption] : [...optionsToBeAdded]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, optionsToBeRemoved, currentParrent)
      }
    } else {
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionsToBeAdded, optionsToBeRemoved, currentParrent)
      }
    }
  }

  function displayChildNodes(index: number) {
    // console.log('displayChildNodes')
    if (props.options[index] && isLeafOption(props.options[index])) {
      setSelectedOptionIndex(-1)
    } else {
      if (props.fetchChildren) {
        props.fetchChildren(props.options[index]?.path, props.options[index]?.customData?.level + 1)
          .then(res => {
            setSelectedOptionIndex(index)
          })
          .catch(err => {
            setSelectedOptionIndex(index)
          })
      } else {
        setSelectedOptionIndex(index)
      }
    }
  }

  let mouseMoveTimer
  // call displayChildNodes after mouse was stopped moving
  function handleMouseMove (index: number) {
    if (isBigScreen) { 
      clearTimeout(mouseMoveTimer)
      mouseMoveTimer = setTimeout(() => displayChildNodes(index), 300)
      // console.log('setTimeout: ', mouseMoveTimer)
    }
  }
  // cancel scheduled displayChildNodes if mouse leaves
  function handleMouseLeave () {
    if (isBigScreen) { 
      // console.log('clearTimeout: ', mouseMoveTimer)
      clearTimeout(mouseMoveTimer)
    }
  }

  return (
    <>
      <div className={styles.optionsLevel}>
        {props.optionsHeader && <div className={styles.optionsHeader}>
          <div className={styles.optionsTitle}>{props.optionsHeader}</div>
          </div>}
        
        {props.options?.length === 0 &&
          <div className={classNames(styles.optionError)}>
            {getI18ControlText('--fieldTypes--.--masterdata--.--noResultFound--')}
          </div>}
        
        {props.options && props.options.map((option, index) =>
          <div key={`${option.id}-option-value-${option.children?.length}`}>
            <div
              className={classNames(styles.optionValue, {
                [styles.selected]: option.selected,
                [styles.expandable]: option.path === props.options?.[selectedOptionIndex]?.path
              })}
              data-testid={`${option.id}-option-value`}
              onClick={(e) => { if (isLeafOption(option)) { toggleOptionSelection(option); toggleOption(selectedOptionIndex) } else { toggleOption(index) }}}
              onMouseMove={() => handleMouseMove(index)}
              onMouseLeave={handleMouseLeave}
            >
              {isLeafOption(option)
                ? props.multiSelect
                  ? <div className={styles.inputWrapper}>
                      <Label check onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          data-testid={`${option.id}-option-checkbox`}
                          id={`${option.id}-option-checkbox`}
                          checked={props.isParentSelected || isAlredySelected(option, props.selectedValues)}
                          onChange={(e) => handleClickConsideringSelectability(e, option)}
                        />
                        <OptionComp data={option}/>
                      </Label>
                    </div>
                  : <div className={classNames(styles.inputWrapper)} onClick={(e) => handleClickConsideringSelectability(e, option)}>
                      <OptionComp data={option} />
                      {option.selected && <Check size={16} color='var(--warm-neutral-shade-400)' /> }
                    </div>
                : props.multiSelect && option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable)
                  ? <>
                      <div className={styles.inputWrapper}>
                        <Label check onClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            data-testid={`${option.id}-option-checkbox`}
                            id={`${option.id}-option-checkbox`}
                            className={classNames({[styles.partialSelected]: selectedChildrenCount[option.id]})}
                            checked={props.isParentSelected || isAlredySelected(option, props.selectedValues)}
                            onChange={(e) => handleClickConsideringSelectability(e, option)}
                          />
                          <OptionComp data={option}/>
                        </Label>
                      </div>
                      <div className={styles.badgeContainer}>
                      {props.multiSelect && selectedChildrenCount[option.id] > 0 &&
                          <Badge count={selectedChildrenCount[option.id]} fieldType={(option as any).formField?.fieldType} />}
                      </div>
                      {isBigScreen && <ChevronRight size={16} color='var(--warm-neutral-shade-200)' />}
                      {!isBigScreen && <ChevronDown size={16} color='var(--warm-neutral-shade-200)' />}
                    </>
                  : <>
                      <div className={styles.inputWrapper} onClick={(event) => handleClickConsideringSelectability(event, option)}>
                        <OptionComp data={option}/>
                      </div>
                      <div className={styles.badgeContainer}>
                      {props.multiSelect && selectedChildrenCount[option.id] > 0 &&
                        <Badge count={selectedChildrenCount[option.id]} fieldType={(option as any).formField?.fieldType} />}
                      </div>
                      {isBigScreen && <ChevronRight size={16} color='var(--warm-neutral-shade-200)' />}
                      {!isBigScreen && <ChevronDown size={16} color='var(--warm-neutral-shade-200)' />}
                    </>}
            </div>
            {/* load child options vertically in mobile view  */}
            {!isBigScreen && option.path === props.options?.[selectedOptionIndex]?.path && props.options && props.options[selectedOptionIndex]?.children &&
             <div>
              <OptionLevel
                key={selectedOptionIndex}
                options={props.options[selectedOptionIndex].children}
                multiSelect={props.multiSelect}
                onlyLeafSelectable={props.onlyLeafSelectable}
                selectedValues={props.selectedValues}
                isParentSelected={props.isParentSelected || isAlredySelected(props.options[selectedOptionIndex], props.selectedValues)}
                fetchChildren={props.fetchChildren}
                onOptionChange={handleChildOptionSelectionChange}
                onChildrenSelectionChange={handleChildrenSelectionChanges}
                expandLeft={props.expandLeft}
              />
             </div>}
          </div>
        )}
      </div>
      {isBigScreen && props.options && props.options[selectedOptionIndex]?.children &&
        <OptionLevel
          key={selectedOptionIndex}
          options={props.options[selectedOptionIndex].children}
          multiSelect={props.multiSelect}
          onlyLeafSelectable={props.onlyLeafSelectable}
          selectedValues={props.selectedValues}
          isParentSelected={props.isParentSelected || isAlredySelected(props.options[selectedOptionIndex], props.selectedValues)}
          fetchChildren={props.fetchChildren}
          onOptionChange={handleChildOptionSelectionChange}
          onChildrenSelectionChange={handleChildrenSelectionChanges}
          expandLeft={props.expandLeft}
        />}
    </>
  )
}

function SearchResults (props: SearchResultsProps) {
  function isSelfOrDecendantMatching (option: Option): boolean {
    if (!props.searchString) {
      return false
    }

    const isSelfMatch = !props.searchString || isAMatch(option, props.searchString)

    let isDecendantMatch = false
    if (option.children && option.children.length > 0) {
      isDecendantMatch = option.children.some(child => {
        return isSelfOrDecendantMatching(child)
      })
    }

    return (isSelfMatch) || isDecendantMatch
  }

  function handleSelection (option: Option) {
    if (option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable) && !isAlredySelected(option, props.selectedValues) && typeof props.onSelect === 'function') {
      props.onSelect({ ...option })
    }
  }

  function handleChildOptionSelectionChange (option: Option, currentParrent: Option) {
    if (isAlredySelected(currentParrent, props.selectedValues)) {
      // deselect current option
      const optionToBeDeselected = currentParrent
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? allChildrenExceptClickedOption : [option]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, [optionToBeDeselected], currentParrent)
      }
    } else if (props.isParentSelected) {
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? allChildrenExceptClickedOption : [option]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, [], currentParrent)
      }
    } else {
      if (props.onSelect) {
        props.onSelect(option)
      }
    }
  }

  function handleChildrenSelectionChanges (optionsToBeAdded: Option[], optionsToBeRemoved: Option[], option: Option, currentParrent: Option) {
    if (isAlredySelected(currentParrent, props.selectedValues)) {
      // deselect current option
      const optionToBeDeselected = currentParrent
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? [...optionsToBeAdded, ...allChildrenExceptClickedOption] : [...optionsToBeAdded]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, [...optionsToBeRemoved, optionToBeDeselected], currentParrent)
      }
    } else if (props.isParentSelected) {
      // select all children except clicked option
      const allChildrenExceptClickedOption = currentParrent.children!.filter(childOption => childOption.path !== option.path)
      const optionToBeSelected = props.multiSelect ? [...optionsToBeAdded, ...allChildrenExceptClickedOption] : [...optionsToBeAdded]
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionToBeSelected, optionsToBeRemoved, currentParrent)
      }
    } else {
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(optionsToBeAdded, optionsToBeRemoved, currentParrent)
      }
    }
  }

  return (
    <>
      {props.options && props.options.map((option, index) => {
        return (
          <div key={index}>
            {isSelfOrDecendantMatching(option) &&
              <div
                className={classNames(styles.searchValue, { [styles.nested]: !isLeafOption(option) })}
                data-testid={`${option.id}-search-value`}
                onClick={() => handleSelection(option)}
              >
                <div>
                  {isAlredySelected(option, props.selectedValues) &&
                    <span className={styles.tick}>&#x2713;</span>}
                  {option.displayName}
                </div>
                <div>
                  <OptionFullPath option={option} limit />
                </div>
              </div>}

            <div style={{ paddingLeft: '1em' }}>
              <SearchResults
                options={option.children}
                multiSelect={props.multiSelect}
                onlyLeafSelectable={props.onlyLeafSelectable}
                searchString={props.searchString}
                path={`${props.path}${option.displayName} / `}
                selectedValues={props.selectedValues}
                isParentSelected={props.isParentSelected || isAlredySelected(option, props.selectedValues)}
                onSelect={(selectedOption) => handleChildOptionSelectionChange(selectedOption, option)}
                onChildrenSelectionChange={(selected, deselected, currentParrent) => handleChildrenSelectionChanges(selected, deselected, currentParrent, option)}
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

export function MultiLevelAsyncSelect (props: MultiLevelAsyncSelectProps) {
  const [selectedValues, setSelectedValues] = useState<Option[]>([])
  const [options, setOptions] = useReducer((
    state: Option[],
    action: {
      operation: 'UPDATE_ALL' | 'PUT_CHILDREN',
      newOptions?: Option[],
      parrentPath?: string,
      children?: Option[]
    }
  ) => {
    switch (action.operation) {
      case 'UPDATE_ALL':
        return action.newOptions || []
      case 'PUT_CHILDREN':
        if (state && action.parrentPath && action.children) {
          return putChildren([...state], action.parrentPath, action.children)
        } else {
          return state
        }
      default:
        return state
    }
  }, [])
  const [searchResult, setSearchResult] = useState<Option[]>([])
  const [searchResultLoading, setSearchResultLoading] = useState<boolean>(false)

  const [searchString, setSearchString] = useState<string>('')
  const [focus, setFocus] = useState<boolean>(false)
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false)
  const [optionsTreeVisible, setOptionsTreeVisible] = useState<boolean>(false)

  const [optionsContainerTop, setOptionsContainerTop] = useState('')
  const [optionsContainerLeft, setOptionsContainertLeft] = useState('')
  const [optionsContainerRight, setOptionsContainertRight] = useState('')
  const [searchResultWrapperTop, setSearchResultWrapperTop] = useState('')
  const [searchResultWrapperLeft, setSearchResultWrapperLeft] = useState('')

  const searchResultWrapper = useRef<any>(null)
  const optionsWrapper = useRef<any>(null)
  const myContainer = useRef(null)
  const selectInputContainer = useRef<any>(null)

  const { t } = useTranslationHook()

  useEffect(() => {
    if (searchString) {
      setOptionsVisible(false)
    }
  }, [searchString])

  useEffect(() => {
    setSelectedValues(props.value || [])
  }, [props.value])

  useEffect(() => {
    setOptions({ operation: 'UPDATE_ALL', newOptions: props.options })
  }, [props.options])

  function fetchChildren (parrentPath: string, childrenLevel: number): Promise<Option[]> {
    if (props.fetchChildren) {
      return props.fetchChildren(parrentPath, childrenLevel)
        .then(res => {
          setOptions({ operation: 'PUT_CHILDREN', parrentPath, children: res })
          return res
        })
        .catch(err => {
          console.log('Error fetching masterdata level asynchronously. ', err)
          return []
        })
    } else {
      return Promise.reject('No method providd to fetch child level')
    }
  }

  function search (keyword) {
    if (props.onSearch) {
      setSearchResultLoading(true)
      props.onSearch(keyword)
        .then(res => {
          setSearchResultLoading(false)
          setSearchResult(res || [])
        })
        .catch(err => {
          setSearchResultLoading(false)
          console.log('Error searching values by keyword: ', err)
        })
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedSearch = useMemo(() => debounce(search), [])

  function handleSearchStringChange (event) {
    setSearchString(event.target.value)

    if (props.config?.typeahead && !(props.config?.selectMultiple) && selectedValues[0]?.displayName) {
      removeFromSelected(selectedValues[0])
    }

    debouncedSearch(event.target.value)
  }

  function triggerOnChange (selectedValues: Option[]) {
    if (typeof props.onChange === 'function') {
      // props.onChange(updateHierarchyForSelectedOptions(props.options, selectedValues, ''))
      props.onChange(selectedValues) // ?
    }
  }

  function removeFromSelected (option: Option) {
    const updatedSelection = selectedValues.filter(selectedValue => selectedValue.path !== option.path)
    setSelectedValues(updatedSelection)
    triggerOnChange(updatedSelection)
  }

  function toggleOptionSelection (updatedOption: Option) {
    if (props.config?.selectMultiple) {
      if (isAlredySelected(updatedOption, selectedValues)) {
        // deselect it
        removeFromSelected(updatedOption)
      } else {
        // deselect all its children, and select itself.
        // deselect all its children:
        const selectedValuesAfterRemoval = updatedOption.children
          ? removeAllSelected(updatedOption.children, selectedValues)
          : [...selectedValues]
        // select it:
        setSelectedValues([...selectedValuesAfterRemoval, updatedOption])
        triggerOnChange([...selectedValuesAfterRemoval, updatedOption])
      }
    } else {
      // replace
      setSelectedValues([updatedOption])
      triggerOnChange([updatedOption])

      setSearchString('')
      setSearchResult([])
      setOptionsVisible(false)
      setFocus(false)
    }
  }

  function handleChildrenSelectionChange (selectedOptions: Option[], deselectedOptions: Option[]) {
    // remove deselectedOptions
    const selectedValuesAfterRemoval = deselectedOptions.reduce((resultingSelectedValues, option) => {
      return resultingSelectedValues.filter(selectedValue => selectedValue.path !== option.path)
    }, [...selectedValues])

    // add selectedOptions
    const selectedValuesAfterAddition = selectedOptions.reduce((resultingSelectedValues, option) => {
      return [...resultingSelectedValues, option]
    }, selectedValuesAfterRemoval)

    setSelectedValues(selectedValuesAfterAddition)
    triggerOnChange(selectedValuesAfterAddition)

    if (!props.config?.selectMultiple) {
      setOptionsVisible(false)
      setSearchString('')
      setSearchResult([])
    } else {
      setSearchString('')
      setSearchResult([])
    }

    setFocus(false)
  }

  function deselectAllOptions () {
    setSelectedValues([])
    triggerOnChange([])
  }

  function getLabel (selectedValue: Option) {
    return selectedValue ? selectedValue?.displayName : ''
  }

  function getSelectionDisplayText () {
    return selectedValues.length > 0
      ? `${getLabel(selectedValues[0])}${getLabel(selectedValues[1]) ? ', ' + getLabel(selectedValues[1]) : ''}${getLabel(selectedValues[2]) ? ', ...' : ''}`
      : ''
  }

  function handleDropdownClick () {
    if (!(props.config?.disableDropdown)) {
      setOptionsVisible(true)
      setSearchString('')
      setSearchResult([])
    } else {
      setFocus(true)
    }
  }

  function handleKeyDown (event) {
    // TODO: Handle selections using keyboard
    if (event.keyCode === 38) {
      // Up arrow
    } else if (event.keyCode === 38) {
      // Down arrow
    }
  }

  function shallDropdownGrowUp (): boolean {
    if (myContainer.current) {
      const rect = myContainer.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const spaceBelow = viewportHeight - (rect.top + rect.height)
  
      return (spaceBelow < DROPDOWN_MAX_HEIGHT) && (spaceAbove > spaceBelow)
    }
  
    return false
  }

  useEffect(() => {
    if (selectInputContainer && selectInputContainer.current) {
      const { top, left, bottom, width } = selectInputContainer.current.getBoundingClientRect()

      if (shallDropdownGrowUp()) {
        if ((optionsWrapper && optionsWrapper.current)) {
          const { height } = optionsWrapper.current.getBoundingClientRect()
          if (props.config?.expandLeft) {
            setOptionsContainerTop((top - height - 6) + 'px') // 6 is padding
            setOptionsContainertLeft('unset')
            setOptionsContainertRight((window.innerWidth - left - width) + 'px')
          } else {
            setOptionsContainerTop((top - height - 6) + 'px')
            setOptionsContainertRight('unset')
            setOptionsContainertLeft(left + 'px')
          }
        }
        if ((searchResultWrapper && searchResultWrapper.current)) {
          const { width, height } = searchResultWrapper.current.getBoundingClientRect()
          if (props.config?.expandLeft) {
            setSearchResultWrapperTop((top - height - 6) + 'px') // 6 is padding
            setOptionsContainertLeft('unset')
            setOptionsContainertRight((window.innerWidth - left - width) + 'px')
          } else {
            setSearchResultWrapperTop((top - height - 6) + 'px')
            setOptionsContainertRight('unset')
            setSearchResultWrapperLeft(left + 'px')
          }
        }
      } else {
        if (optionsWrapper && optionsWrapper.current) {
          if (props.config?.expandLeft) {
            setOptionsContainerTop(bottom + 'px')
            setOptionsContainertLeft('unset')
            setOptionsContainertRight((window.innerWidth - left - width) + 'px')
          } else {
            setOptionsContainerTop(bottom + 'px')
            setOptionsContainertLeft(left + 'px')
            setOptionsContainertRight('unset')
          }
        }
        if (searchResultWrapper && searchResultWrapper.current) {
          const { width } = searchResultWrapper.current.getBoundingClientRect()
          if (props.config?.expandLeft) {
            setSearchResultWrapperTop(bottom + 'px')
            setOptionsContainertLeft('unset')
            setOptionsContainertRight((window.innerWidth - left - width) + 'px')
          } else {
            setSearchResultWrapperTop(bottom + 'px')
            setSearchResultWrapperLeft(left + 'px')
            setOptionsContainertRight('unset')
          }
        }
      }
    }
  }, [props.config?.expandLeft, shallDropdownGrowUp, optionsWrapper, optionsWrapper.current, searchResultWrapper, searchResultWrapper.current, focus, optionsVisible, selectInputContainer, selectInputContainer.current])

  useEffect(() => {
    if (!props.disabled) {
      if (focus || optionsVisible) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [focus, optionsVisible])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  function handleSelectionChange (options: Option[]) {
    setSelectedValues(options)
    setOptionsTreeVisible(false)

    setSearchString('')
    setSearchResult([])
    setOptionsVisible(false)
    setFocus(false)

    triggerOnChange(options)
  }

  function showOptionTree () {
    setSearchString('')
    setSearchResult([])
    setOptionsVisible(false)
    setFocus(false)
  
    setOptionsTreeVisible(true)
  }

  return (
    <div
      className={classNames(styles.multiLevelSelect, ...(props.classnames || []), { [styles.focus]: focus && !props.disabled, [styles.multiLevelSelectDisable]: props.disabled, [styles.multiLevelSelectNoBorder]: props.config?.noBorder })}
      onClick={event => event.stopPropagation()}
      ref={myContainer}
      id="multiLevelContainer"
    >
      <div className={styles.selectInputContainer} ref={selectInputContainer} onClick={() => setFocus(true)}>
        {props.config?.typeahead
          ? <div className={styles.selectedOptions}>
              {props.config?.selectMultiple && !props.config.isListView &&
                selectedValues.map((value) =>
                  <div
                    className={styles.token}
                    data-testid={`${value.id}-token-value`}
                    key={`${value.id}-token-value`}
                  >
                    <div className={styles.label}>{value.displayName}</div>
                    <div data-testid={`${value.id}-token-remove-button`} onClick={(e) => {e.stopPropagation(); removeFromSelected(value)}}>
                      <X size={16} color="var(--warm-neutral-shade-200)" />
                    </div>
                  </div>)}
              <div className={classNames(styles.inputBox, { [styles.selected]: selectedValues.length > 0 })}>
                <input
                  type="text"
                  data-testid="search-input-field"
                  ref={input => input && focus && input.focus()}
                  placeholder={(selectedValues.length === 0) ? (props.placeholder !== undefined ? props.placeholder : 'Search...') : props.config?.selectMultiple ? '' : selectedValues[0]?.displayName}
                  value={searchString}
                  disabled={props.disabled}
                  onChange={handleSearchStringChange}
                  onFocus={() => setFocus(true)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          : <div className={classNames(styles.selectedOptions, { [styles.filterButton]: !props.disabled})} onClick={() => { setOptionsVisible(true) }}>
              {props.config?.selectMultiple
                ? <>
                    {(props.config?.showElaborateLabel && getSelectionDisplayText())
                      ? getSelectionDisplayText()
                      : <span className={styles.selectMultiplePlaceholder}>
                          {props.placeholder || 'Select...'}
                        </span>}
                    {((props.config?.showElaborateLabel && selectedValues.length > 2) || (!props.config?.showElaborateLabel && selectedValues.length > 0)) &&
                      <div className={styles.badge} data-testid="total-selected-count-badge">
                        {selectedValues.length}
                      </div>}
                  </>
                : <>
                    {getSelectionDisplayText()
                      ? getSelectionDisplayText()
                      : <span className={styles.placeholder}>
                          {props.placeholder || 'Select...'}
                        </span>}
                  </>}
            </div>
        }
        {(!props.disabled) &&
          <>
           {props.config?.typeahead && selectedValues[0]?.displayName && !props.config?.selectMultiple &&
              <div
                className={classNames(styles.clearAction, 'clearActions')}
                data-testid="clear-selection-button"
                onClick={(e) => { e.stopPropagation(); removeFromSelected(selectedValues[0]); setSearchString(''); setSearchResult([]) }}
              >
                <X size={20} color='var(--warm-neutral-shade-300)' />
              </div>
            }
            {(props.config?.selectMultiple || (!(selectedValues[0]?.displayName) || ((selectedValues[0]?.displayName) && !props.config?.typeahead))) &&
              <div
                className={styles.dropdownAction}
                data-testid="dropdown-button"
                onClick={handleDropdownClick}
              >
              <span className={styles.chevronDown}><ChevronDown size={20} color='var(--warm-neutral-shade-300)' /></span>
              </div>
            }  
          </>
        }
      </div>

      {(!props.disabled) && (optionsVisible || (focus && !searchString)) &&
        <div
          ref={optionsWrapper}
          style={{left: optionsContainerLeft, right: optionsContainerRight, top: optionsContainerTop}}
          className={classNames(styles.optionsWrapper, {
            [styles.growLeft]: !!props.config?.expandLeft,
            [styles.growUp]: shallDropdownGrowUp()
          })}
        >
          {/* Search box to filter options in list view & no typeahead mode */}
          {!props.config?.typeahead && props.config?.showSearchBox && 
            <div className={classNames(styles.searchInputBox)}>
              <Search size={16} color={'var(--warm-neutral-shade-300)'} />
              <input
                type="text"
                data-testid="filter-search-result-input-field"
                ref={input => input && (focus ? input.focus() : input.blur())}
                placeholder={t("--Search--")}
                value={searchString}
                onChange={handleSearchStringChange}
              />
              {searchString &&
                <OroButton type="link" icon={<X size={16} color={'var(--warm-neutral-shade-300)'}/>} iconOrientation="right" onClick={() => setSearchString('')} />
              }
            </div>}
          <div className={styles.optionsContainer} data-testid="options-container" id="options-container">
            <OptionLevel
              options={options}
              multiSelect={props.config?.selectMultiple}
              onlyLeafSelectable={props.config?.onlyLeafSelectable}
              selectedValues={selectedValues}
              expandLeft={props.config?.expandLeft}
              optionsHeader={props.config?.optionsHeader}
              fetchChildren={fetchChildren}
              onOptionChange={toggleOptionSelection}
              onChildrenSelectionChange={handleChildrenSelectionChange}
            />
          </div>
          {props.config?.enableTree &&
            <div className={styles.browseAllBtn} onClick={showOptionTree}>
              <Globe size={16} color='var(--warm-prime-azure)' /><div>{t("--browseAll--")}</div>
            </div>}
          {(!props.config?.typeahead || props.config?.showClearAllOption) && selectedValues.length > 0 && !props.config?.hideClearButton &&
            <div
              className={styles.clearSelectionContainer}
              data-testid="clear-filter-button"
              onClick={deselectAllOptions}
            >
              {getI18ControlText('--fieldTypes--.--masterdata--.--clear--')}
            </div>}
        </div>}

      {(!props.disabled) && (focus && searchString) &&
        <div
          ref={searchResultWrapper}
          style={{left: searchResultWrapperLeft, top: searchResultWrapperTop}}
          className={classNames(styles.searchResultWrapper, {
            [styles.growLeft]: !!props.config?.expandLeft,
            [styles.growUp]: shallDropdownGrowUp()
          })}
        >
          {/* Search box to filter options in list view & no typeahead mode */}
          {!props.config?.typeahead && props.config?.showSearchBox &&
            <div className={classNames(styles.searchInputBox)}>
              <Search size={16} color={'var(--warm-neutral-shade-300)'} />
              <input
                type="text"
                data-testid="filter-search-result-input-field"
                ref={input => input && (focus ? input.focus() : input.blur())}
                placeholder={t("--Search--")}
                value={searchString}
                onChange={handleSearchStringChange}
              />
              {searchString && <OroButton type="link" icon={<X size={16} color={'var(--warm-neutral-shade-300)'} />} iconOrientation="right" onClick={() => setSearchString('')} />}
            </div>}
          <div className={styles.searchResults}>
            {props.options.length === 0 &&
              <div className={classNames(styles.searchValue, styles.searchError)} data-testid="search-error">
                {getI18ControlText('--fieldTypes--.--masterdata--.--noOptionsFound--')}
              </div>}
            {(props.options.length !== 0 && searchString && searchResultLoading) &&
              <div className={classNames(styles.searchValue, styles.searchError)} data-testid="search-error">
                {t("--searching--")}
              </div>}
            {(props.options.length !== 0 && searchString && !searchResultLoading && searchResult.length === 0) &&
              <div className={classNames(styles.searchValue, styles.searchError)} data-testid="search-error">
                {getI18ControlText('--fieldTypes--.--masterdata--.--noMatchingResultsFound--')}
              </div>}

            <SearchResults
              options={searchResult}
              multiSelect={props.config?.selectMultiple}
              onlyLeafSelectable={props.config?.onlyLeafSelectable}
              searchString={searchString}
              path={''}
              selectedValues={selectedValues}
              onSelect={toggleOptionSelection}
              onChildrenSelectionChange={handleChildrenSelectionChange}
            />
          </div>

          {props.config?.enableTree &&
            <div className={styles.browseAllBtn} onClick={showOptionTree}>
              <Globe size={16} color='var(--warm-prime-azure)' /><div>{t("--browseAll--")}</div>
            </div>}
        </div>}

      <OptionTreePopup
        type={props.type}
        isOpen={!props.disabled && optionsTreeVisible}
        options={props.options}
        selectedValues={selectedValues}
        multiSelect={props.config?.selectMultiple}
        onlyLeafSelectable={props.config?.onlyLeafSelectable}
        async
        regionOptions={props.regionOptions}
        fetchChildren={props.fetchChildren}
        onSearch={props.onSearch}
        onSubmit={handleSelectionChange}
        onClose={() => { setOptionsVisible(true); setFocus(true); setOptionsTreeVisible(false); triggerOnChange(selectedValues) }}
      />

      {(!props.disabled) && (optionsVisible || focus) &&
        <div className={styles.backdrop} onClick={() => { setOptionsVisible(false); setFocus(false); setSearchString(''); setSearchResult([]); triggerOnChange(selectedValues) }}></div>}
    </div>
  )
}

export default MultiLevelAsyncSelect
