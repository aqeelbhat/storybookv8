/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: noopur landge
 ************************************************************/

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { ChevronRight, ChevronDown, X, Check, Globe, Search } from 'react-feather'
import { Label } from 'reactstrap'
import classNames from 'classnames'

import { DROPDOWN_MAX_HEIGHT, FIELD_TYPE_BOOL, MultiLevelSelectProps, Option, OptionLevelProps, SearchResultsProps } from './types'
import {
  getMatchingOptionsCount, getDefaultSelectedOptions, getSelectedOptionsCount, updateHierarchyForSelectedOptions,
  isAlredySelected, isAMatch, isLeafOption, removeAllSelected
} from './util.service'
import { MAX_WIDTH_FOR_MOBILE_VIEW } from '../util'

import styles from './styles.module.scss'
import { OptionTreePopup } from './option-tree-popup.component'
import { getI18Text as getI18ControlText, useTranslationHook } from '../i18n'
import { OptionFullPath } from './glance-option.component'
import { Keyboard } from '../Types/common';
import { OroButton } from '../index'

function OptionComp(props: { data: Option }) {
  return (
    <>
      {props.data.icon && <img src={props.data.icon} />}
      <div className={styles.optionValueLabel}>
        {props.data.displayName}
      </div>
    </>
  )
}

function Badge(props: { count: number; fieldType: string }) {
  return (
    <div className={classNames(styles.badge, styles.newBadge, { [styles.checkMark]: props.fieldType === FIELD_TYPE_BOOL })}>
      {props.fieldType === FIELD_TYPE_BOOL
        ? '✓'
        : props.count}
    </div>
  )
}

function OptionLevel(props: OptionLevelProps) {
  const optionsDivRefs = React.useRef<Array<HTMLDivElement>>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1)
  const [selectedChildrenCount, setSelectedChildrenCount] = useState({})
  const isBigScreen = useMediaQuery({ query: `(min-width: ${MAX_WIDTH_FOR_MOBILE_VIEW})` })

  const [childActiveItemIndex, setChildActiveItemIndex] = useState<number>(-1)
  const [keyboardEvent, setKeyboardEvent] = useState<Keyboard | null>(null)

  useEffect(() => {
    const newSelectedChildrenCount = {}
    props.options && props.options.forEach((option, index) => {
      newSelectedChildrenCount[option.id] = getSelectedOptionsCount(option.children, props.selectedValues)
    })
    setSelectedChildrenCount(newSelectedChildrenCount)
  }, [props.options, props.selectedValues])

  useEffect(() => {
    const activeOption = props.activeIndex + 1
    const activeElement = optionsDivRefs.current[activeOption]
    if (activeElement?.scrollIntoView) {
      activeElement?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }, [props.activeIndex])

  useEffect(() => {
    if (props.keyboardEvent) {
      props.activeIndex >= 0 ? handleKeyDown(props.keyboardEvent as Keyboard) : triggerChildInteraction(props.keyboardEvent as Keyboard)
    }
  }, [props.keyboardEvent])

  /**
   * Sets active index of a highlighted item in the list
   *
   * @param {Keyboard} key
   */

  function focusNextListItem(key: Keyboard) {
    if (key === Keyboard.Down) {
      let lastAllowedOptionIndex = props.options.length - 1
      if (props.isClearAllVisible) {
        lastAllowedOptionIndex++
      }
      if (props.isBrowseAllVisible) {
        lastAllowedOptionIndex++
      }
      const isCurrentActiveElementNotLast = props.activeIndex < lastAllowedOptionIndex

      if (isCurrentActiveElementNotLast) {
        props.onActiveIndexChanged?.(props.activeIndex + 1)
      }
    } else if (key === Keyboard.Up) {
      const isCurrentActiveElementNotFirst = props.activeIndex > 0;

      if (isCurrentActiveElementNotFirst) {
        props.onActiveIndexChanged?.(props.activeIndex - 1)
      }
    }
  }

  /**
   * Handles event event in Option Levels > 1...n
   *
   * @param {Keyboard} event
   */

  function handleKeyDown(event: Keyboard): void {
    switch (event) {
      case Keyboard.Enter:
      case Keyboard.Return:
        // INFO: Select an item in the list and close the drawer only in single select variant
        if ((props.activeIndex > -1) && (props.activeIndex < props.options.length)) {
          toggleOptionSelection(props.options[props.activeIndex])
          if (!props.multiSelect) { props.onOptionsVisible?.(false) }
        } else if (props.activeIndex === props.options.length) {
          if (props.isBrowseAllVisible && props.onBrowseAll) {
            props.onBrowseAll()
          } else if (props.isClearAllVisible && props.onDeselectAll) {
            props.onDeselectAll()
          }
        } else if ((props.activeIndex === (props.options.length + 1)) && props.onDeselectAll) {
          props.onDeselectAll()
        }
        break;
      case Keyboard.Right:
        if ((props.activeIndex >= 0) && props.options?.[props.activeIndex] && !isLeafOption(props.options?.[props.activeIndex])) {
          setSelectedOptionIndex(props.activeIndex) // should expand the sub-ui
          setChildActiveItemIndex(0)
          props.onActiveIndexChanged?.(-1)
        }
        break
      case Keyboard.Left:
        props.onLevelClose?.()
        setChildActiveItemIndex(-1)
        break
      case Keyboard.Down:
      case Keyboard.Up:
        focusNextListItem(event)
        break;
      default: return
    }
  }

  /**
   * Triggers keyboard interaction in children
   *
   * @param {Keyboard} key
   */

  function triggerChildInteraction(key: Keyboard) {
    setKeyboardEvent(key)
    setTimeout(() => {
      setKeyboardEvent(null)
    }, 100)
  }

  function toggleOption(index: number) {
    if (index === selectedOptionIndex) {
      setSelectedOptionIndex(-1)
    } else {
      setSelectedOptionIndex(index)
    }
  }

  function toggleOptionSelection(option: Option) {
    if (typeof props.onOptionChange === 'function') {
      props.onOptionChange({ ...option })
    }
  }

  function handleClickConsideringSelectability(event, option: Option) {
    if (option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable)) {
      event.stopPropagation()
      toggleOptionSelection(option)
    }
  }

  function handleChildOptionSelectionChange(option: Option) {
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

  function handleChildrenSelectionChanges(optionsToBeAdded: Option[], optionsToBeRemoved: Option[], option: Option) {
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
    const option = props.options?.[index]
    if (option && isLeafOption(option)) {
      setSelectedOptionIndex(-1)
    } else {
      setSelectedOptionIndex(index)
    }
  }

  let mouseMoveTimer
  // call displayChildNodes after mouse was stopped moving
  function handleMouseMove(index: number) {
    if (isBigScreen) {
      clearTimeout(mouseMoveTimer)
      mouseMoveTimer = setTimeout(() => displayChildNodes(index), 300)
    }
  }
  // cancel scheduled displayChildNodes if mouse leaves
  function handleMouseLeave() {
    if (isBigScreen) {
      clearTimeout(mouseMoveTimer)
    }
  }

  /**
   * @description On click event handler for an item 
   * within a list of options in the dropdown
   *
   * @param {number} index
   * @param {Option} item
   */

  function didClickOption(index: number, item: Option): void {
    if (isLeafOption(item)) {
      toggleOptionSelection(item);
      toggleOption(selectedOptionIndex)
    } else {
      toggleOption(index)
    }
  }

  /**
   * @info A method to close sub UI level
   */

  function didCloseLevel() {
      props.onActiveIndexChanged?.(selectedOptionIndex)
      setSelectedOptionIndex(-1) // should close the sub-ui
  }

  return (
    <>
      <div className={styles.optionsLevel}>
        {props.optionsHeader && <div className={styles.optionsHeader}>
          <div className={styles.optionsTitle}>{props.optionsHeader}</div>
        </div>}

        {props.options?.length === 0 &&
          <div className={classNames(styles.optionError)}>
            {getI18ControlText('--fieldTypes--.--masterdata--.--noOptionsFound--')}
          </div>}

        {props.options && props.options.map((option, index) =>
          <div key={`${option.id}-option-value`}>
            <div
              className={classNames(styles.optionValue, {
                [styles.focusedItem]: props.activeIndex === index,
                [styles.selected]: option.selected,
                [styles.expandable]: option.path === props.options?.[selectedOptionIndex]?.path
              })}
              id={`option-${index}`}
              ref={element => optionsDivRefs.current[index] = element}
              data-testid={`${option.id}-option-value`}
              onClick={() => didClickOption(index, option)}
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
                      <OptionComp data={option} />
                    </Label>
                  </div>
                  : <div className={classNames(styles.inputWrapper)} onClick={(e) => handleClickConsideringSelectability(e, option)}>
                    <OptionComp data={option} />
                    {option.selected && <Check size={16} color='var(--warm-neutral-shade-400)' />}
                  </div>
                : props.multiSelect && option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable)
                  ? <>
                    <div className={styles.inputWrapper}>
                      <Label check onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          data-testid={`${option.id}-option-checkbox`}
                          id={`${option.id}-option-checkbox`}
                          className={classNames({ [styles.partialSelected]: selectedChildrenCount[option.id] })}
                          checked={props.isParentSelected || isAlredySelected(option, props.selectedValues)}
                          onChange={(e) => handleClickConsideringSelectability(e, option)} />
                        <OptionComp data={option} />
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
                      <OptionComp data={option} />
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
          keyboardEvent={keyboardEvent}
          activeIndex={childActiveItemIndex}
          key={selectedOptionIndex}
          options={props.options[selectedOptionIndex].children}
          multiSelect={props.multiSelect}
          onlyLeafSelectable={props.onlyLeafSelectable}
          selectedValues={props.selectedValues}
          isParentSelected={props.isParentSelected || isAlredySelected(props.options[selectedOptionIndex], props.selectedValues)}
          onOptionChange={handleChildOptionSelectionChange}
          onChildrenSelectionChange={handleChildrenSelectionChanges}
          expandLeft={props.expandLeft}
          onActiveIndexChanged={setChildActiveItemIndex}
          onOptionsVisible={(isOpen) => { props.onOptionsVisible?.(isOpen) }}
          onDeselectAll={() => { props.onDeselectAll?.() }}
          onLevelClose={() => { didCloseLevel?.() }}
        />}
    </>
  );
}

function SearchResults(props: SearchResultsProps) {
  const [keyboardEvent, setKeyboardEvent] = useState<Keyboard | null>(null)
  const [childActiveItemIndex, setChildActiveItemIndex] = useState<number>(-1)
  const [parentActiveItemIndex, setParentActiveItemIndex] = useState<number>(-1)

  const [filteredItems, setFilteredItems] = useState<Option[]>([])
  const [forceLastChildSelection, setForceLastChildSelection] = useState<boolean>(false)
  const optionsDivRefs = React.useRef<Array<HTMLDivElement>>([]);

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

  useEffect(() => {
    // check if props are present
    // filter props.options to match the search string
    const listOfFilteredItems = props.options?.filter((item) => {
      return isSelfOrDecendantMatching(item)
    }) || []

    setFilteredItems(listOfFilteredItems)
  }, [props.options, props.searchString])

  useEffect(() => {
    const activeOption = props.activeIndex
    const activeElement = optionsDivRefs.current[activeOption]
    if (activeElement?.scrollIntoView) {
      activeElement?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }, [props.activeIndex])

  useEffect(() => {
    if (props.keyboardEvent) {
      props.activeIndex >= 0 ? handleKeyDown(props.keyboardEvent as Keyboard) : triggerChildInteraction(props.keyboardEvent as Keyboard)
    }
  }, [props.keyboardEvent])

  useEffect(() => {
    if (props.forceLastChildSelection && filteredItems.length > 0) {
      const lastItemIndex = filteredItems.length - 1

      // Try to select last item
      if (filteredItems[lastItemIndex] && isLeafOption(filteredItems[lastItemIndex])) {
        props.onActiveIndexChanged && props.onActiveIndexChanged(lastItemIndex, filteredItems.length)
      } else {
        // if it has children, try to select its last child
        triggerLastChildSelection()
        setParentActiveItemIndex(lastItemIndex)
        props.onActiveIndexChanged && props.onActiveIndexChanged(Number.NEGATIVE_INFINITY, filteredItems.length)
      }
    }
  }, [props.forceLastChildSelection])

  function triggerLastChildSelection() {
    setForceLastChildSelection(true)
    setTimeout(() => {
      setForceLastChildSelection(false)
    }, 100)
  }

  /**
   * Sets active index of a highlighted item in the list
   *
   * @param {Keyboard} key
   */

  function focusNextListItem(key: Keyboard) {
    if (key === Keyboard.Down) {
      let lastAllowedOptionIndex = filteredItems.length - 1
      if (props.isBrowseAllVisible) {
        lastAllowedOptionIndex++
      }
      const isCurrentActiveElementNotLast = props.activeIndex < lastAllowedOptionIndex

      if (isCurrentActiveElementNotLast) {
        props.onActiveIndexChanged?.(props.activeIndex + 1, filteredItems.length)
      } else {
        props.onExitLevel?.(key)
        setChildActiveItemIndex(-1)
      }

    } else if (key === Keyboard.Up) {
      const isCurrentActiveElementNotFirst = props.activeIndex > 0;

      if (isCurrentActiveElementNotFirst) {
        props.onActiveIndexChanged?.(props.activeIndex - 1, filteredItems.length)
      }
    }
  }

  /**
   * Handles event event in Option Levels > 1...n
   *
   * @param {Keyboard} event
   */

  function handleKeyDown(event: Keyboard): void {
    switch (event) {
      case Keyboard.Enter:
      case Keyboard.Return:
        // Select an item in the list
        if ((props.activeIndex > -1) && (props.activeIndex < filteredItems.length)) {
          handleSelection(filteredItems[props.activeIndex])
        } else if (props.activeIndex === filteredItems.length) {
          if (props.isBrowseAllVisible && props.onBrowseAll) {
            props.onBrowseAll()
          }
        }
        break
      case Keyboard.Down:
        if ((props.activeIndex >= 0) && filteredItems?.[props.activeIndex] && !isLeafOption(filteredItems?.[props.activeIndex])) {
          setParentActiveItemIndex(props.activeIndex)
          setChildActiveItemIndex(0)
          props.onActiveIndexChanged?.(Number.NEGATIVE_INFINITY, filteredItems.length)
        } else {
          focusNextListItem(event)
        }
        break
      case Keyboard.Up:
        if (props.activeIndex === 0) {
          props.onExitLevel?.(event)
          setChildActiveItemIndex(-1)
        } else if (props.activeIndex > 0 && filteredItems[props.activeIndex - 1] && !isLeafOption(filteredItems[props.activeIndex - 1])) {
          setParentActiveItemIndex(props.activeIndex - 1)
          triggerLastChildSelection()
          props.onActiveIndexChanged?.(Number.NEGATIVE_INFINITY, filteredItems.length)
        } else {
          focusNextListItem(event)
        }
        break
      default: return
    }
  }

  function triggerChildInteraction(key: Keyboard) {
    setKeyboardEvent(key)
    setTimeout(() => {
      setKeyboardEvent(null)
    }, 100)
  }

  function handleSelection(option: Option) {
    if (option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable) && !isAlredySelected(option, props.selectedValues) && typeof props.onSelect === 'function') {
      props.onSelect({ ...option })
    }
  }

  function handleChildOptionSelectionChange(option: Option, currentParrent: Option) {
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

  function handleChildrenSelectionChanges(optionsToBeAdded: Option[], optionsToBeRemoved: Option[], option: Option, currentParrent: Option) {
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

  function didExitLevel(key: Keyboard) {
    switch(key) {
      case Keyboard.Down:
        if ((parentActiveItemIndex + 1) < filteredItems.length) {
          props.onActiveIndexChanged?.(parentActiveItemIndex + 1, filteredItems.length)
          setChildActiveItemIndex(-1)
        } else if (props.onExitLevel) {
          props.onExitLevel(key)
          setChildActiveItemIndex(-1)
        }
        break
      case Keyboard.Up:
        props.onActiveIndexChanged?.(parentActiveItemIndex, filteredItems.length)
        setChildActiveItemIndex(-1)
        break
    }
  }

  function getIndexInFilteredList (option: Option): number {
    return filteredItems.findIndex(filteredItem => filteredItem.path === option.path)
  }

  return (
    <>
      {props.options && props.options.map((option, index) => {
        return (
          <div key={index}>
            {isSelfOrDecendantMatching(option) &&
              <div
                className={classNames(styles.searchValue, {
                  [styles.nested]: !isLeafOption(option), [styles.focusedItem]: props.activeIndex === getIndexInFilteredList(option)
                })}
                data-testid={`${option.id}-search-value`}
                onClick={() => handleSelection(option)}
                ref={element => optionsDivRefs.current[index] = element}
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
                keyboardEvent={keyboardEvent}
                activeIndex={(getIndexInFilteredList(option) === parentActiveItemIndex) ? childActiveItemIndex : -1}
                onExitLevel={didExitLevel}
                onActiveIndexChanged={setChildActiveItemIndex}
                forceLastChildSelection={getIndexInFilteredList(option) === parentActiveItemIndex ? forceLastChildSelection : false}
              />
            </div>
          </div>
        )
      })}
    </>
  );
}

export function MultiLevelSelect(props: MultiLevelSelectProps) {
  const [searchString, setSearchString] = useState<string>('')
  const [focus, setFocus] = useState<boolean>(false)
  const [matchingOptionsCount, setMatchingOptionsCount] = useState<number>(0)
  const [selectedValues, setSelectedValues] = useState<Option[]>([])
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

  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1)
  const [filteredItemsLength, setFilteredItemsLength] = useState<number | null>(null)
  const [keyboardEventOnOptionLevel, setKeyboardEventOnOptionLevel] = useState<Keyboard>(null)
  const [keyboardEventOnSearchResult, setKeyboardEventOnSearchResult] = useState<Keyboard>(null)

  useEffect(() => {
    if (searchString) {
      setOptionsVisible(false)
    }
  }, [searchString])

  useEffect(() => {
    if (focus) {
      setMatchingOptionsCount(getMatchingOptionsCount(props.options, searchString, selectedValues))
    }
  }, [focus, props.options, searchString, selectedValues])

  useEffect(() => {
    const defaultSelectedOptions = getDefaultSelectedOptions(props.options, '')
    setSelectedValues(defaultSelectedOptions)
  }, [props.options])

  useEffect(() => {
    if (!optionsVisible) {
      setActiveItemIndex(-1)
      setFilteredItemsLength(null)
    }
  }, [optionsVisible])

  function handleSearchStringChange(event) {
    setSearchString(event.target.value)
    if (props.config?.typeahead && !(props.config?.selectMultiple) && selectedValues[0]?.displayName) {
      removeFromSelected(selectedValues[0])
    }
  }

  function triggerOnChange(selectedValues: Option[]) {
    if (typeof props.onChange === 'function') {
      props.onChange(updateHierarchyForSelectedOptions(props.options, selectedValues, ''))
    }
  }

  function removeFromSelected(option: Option) {
    const updatedSelection = selectedValues.filter(selectedValue => selectedValue.path !== option.path)
    setSelectedValues(updatedSelection)
    triggerOnChange(updatedSelection)
  }

  // Function to remove all selected options from multiselect typeahead
  function removeFromMultiSelected(options: Option[], selectedOptions: Option[]) {
    const updatedSelection = removeAllSelected(options, selectedOptions)
    setSelectedValues(updatedSelection)
    triggerOnChange(updatedSelection)
  }

  function toggleOptionSelection(updatedOption: Option) {
    if (props.config?.selectMultiple) {
      if (isAlredySelected(updatedOption, selectedValues)) {
        // remove
        removeFromSelected(updatedOption)
      } else {
        // remove all selected children
        const selectedValuesAfterRemoval = updatedOption.children
          ? removeAllSelected(updatedOption.children, selectedValues)
          : [...selectedValues]
        // add
        setSelectedValues([...selectedValuesAfterRemoval, updatedOption])
        triggerOnChange([...selectedValuesAfterRemoval, updatedOption])
      }

      setSearchString('')
    } else {
      // replace
      setSelectedValues([updatedOption])
      triggerOnChange([updatedOption])
      setOptionsVisible(false)
      setSearchString('')
      setFocus(false)
    }
    // setFocus(false)
  }

  function handleChildrenSelectionChange(selectedOptions: Option[], deselectedOptions: Option[]) {
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
    } else {
      setSearchString('')
    }

    setFocus(false)
  }

  function deselectAllOptions() {
    // After the clear button is pressed, decrement the 
    // index by 1 to auto select the last item in the list
    setActiveItemIndex(activeItemIndex - 1) 

    setSelectedValues([])
    triggerOnChange([])
  }

  function getLabel(selectedValue: Option) {
    return selectedValue ? selectedValue?.displayName : ''
  }

  function getSelectionDisplayText() {
    return selectedValues.length > 0
      ? `${getLabel(selectedValues[0])}${getLabel(selectedValues[1]) ? ', ' + getLabel(selectedValues[1]) : ''}${getLabel(selectedValues[2]) ? ', ...' : ''}`
      : ''
  }

  function handleDropdownClick() {
    if (!(props.config?.disableDropdown)) {
      setOptionsVisible(true)
      setSearchString('')
    } else {
      setFocus(true)
    }
  }

  /**
   * Triggers keyboard event in child
   *
   * @param {Keyboard} key
   */
  function triggerChildInteraction (key: Keyboard) {
    if (optionsVisible || (focus && !searchString)) {
      triggerChildInteractionOnOptionLevel(key)
    } else if (focus && searchString) {
      triggerChildInteractionOnSearchResult(key)
    }
  }
  function triggerChildInteractionOnOptionLevel(key: Keyboard) {
    setKeyboardEventOnOptionLevel(key)
    setTimeout(() => {
      setKeyboardEventOnOptionLevel(null)
    }, 100)
  }
  function triggerChildInteractionOnSearchResult(key: Keyboard) {
    setKeyboardEventOnSearchResult(key)
    setTimeout(() => {
      setKeyboardEventOnSearchResult(null)
    }, 100)
  }

  /**
   * @description Event handler for keyboard interaction
   * @param React.KeyboardEvent Synthetic Keyboard Event
   */

  function handleKeyDown(event: React.KeyboardEvent) {
    event.stopPropagation()
    
    switch (event.key) {
      case Keyboard.Down:
        if (!searchString) {
          if (!optionsVisible) {
            setOptionsVisible(true)
            setActiveItemIndex(0)
          } else {
            triggerChildInteraction(event.key as Keyboard)
          }
        } else {
          if (activeItemIndex === -1) {
            setActiveItemIndex(0)
          } else {
            triggerChildInteraction(event.key as Keyboard)
          }
        }
        break
      case Keyboard.Enter:
        /**
         * @info Select an item if search string is empty & if options tray is visible 
         * & if active option index is at least zero and above
         * in this case, select an item
        */

        if (props.config && props.config.typeahead) {
          event.preventDefault()
          setFocus(true)
        }

        if (!searchString && !optionsVisible) {
          setOptionsVisible(true)
          setActiveItemIndex(0)
        } else if (!searchString && optionsVisible) {
          triggerChildInteraction(event.key as Keyboard)
        }
        break
      case Keyboard.Esc:
      case Keyboard.Escape:
        setOptionsVisible(false)
        setSearchString('')
        setFocus(false)
        break
      case Keyboard.Tab: break
      case Keyboard.Meta: return
      case Keyboard.Space: return
      case Keyboard.Spacebar: return
      default:
        if (!searchString) {
          if (optionsVisible) {
            triggerChildInteraction(event.key as Keyboard)
          } else { setOptionsVisible(true) }
        } else {
          if (activeItemIndex !== -1) {
            triggerChildInteraction(event.key as Keyboard)
          }
        }
        break
    }
  }

  function shallDropdownGrowUp(): boolean {
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
      const { 
        top, 
        left, 
        bottom, 
        width 
      } = selectInputContainer.current.getBoundingClientRect()

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
  }, [
    props.config?.expandLeft, 
    shallDropdownGrowUp, 
    optionsWrapper, 
    optionsWrapper.current, 
    searchResultWrapper, 
    searchResultWrapper.current, 
    focus, 
    optionsVisible, 
    selectInputContainer, 
    selectInputContainer.current
  ])

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

  function handleSelectionChange(options: Option[]) {
    setSelectedValues(options)
    setOptionsTreeVisible(false)

    setActiveItemIndex(-1)
    setFilteredItemsLength(null)
    setSearchString('')
    setOptionsVisible(false)
    setFocus(false)

    triggerOnChange(options)
  }

  function showOptionTree() {
    setActiveItemIndex(-1)
    setFilteredItemsLength(null)
    setSearchString('')
    setOptionsVisible(false)
    setFocus(false)
    setOptionsTreeVisible(true)
  }

  function canShowClearAllOption (): boolean {
    return (!props.config?.typeahead || props.config?.showClearAllOption) && selectedValues.length > 0 && !props.config?.hideClearButton
  }

  function didCloseOptionsPopup() {
    setOptionsVisible(true); 
    setFocus(true); 
    setOptionsTreeVisible(false); 
    triggerOnChange(selectedValues);
  }

  function didClickBackdrop() {
    setOptionsVisible(false); 
    setFocus(false); 
    setSearchString(''); 
    triggerOnChange(selectedValues);
  }

  function prepareContainerClassnames() : string {
    return classNames(
      styles.multiLevelSelect,
      ...(props.classnames || []),
      {
        [styles.focus]: focus && !props.disabled,
        [styles.multiLevelSelectDisable]: props.disabled,
        [styles.multiLevelSelectNoBorder]: props.config?.noBorder,
        [styles.inTableCell]: props.inTableCell
      }
    )
  }

  function prepareStylesForContainer() {
    return props.config && props.config?.backgroundColor && { 
      backgroundColor: props.config.backgroundColor, 
      fontWeight: props.config.fontWeight 
    }
  }

  function handleClearActionsClick(event) {
    (props.config?.selectMultiple) ? removeFromMultiSelected(props.options, selectedValues) : removeFromSelected(selectedValues[0])
    setSearchString('')
    event.stopPropagation()
  }

  function handleClearActionsKeydown(event: React.KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    event.stopPropagation()

    if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
      event.preventDefault()
      handleClearActionsClick(event)
    }
  }

  function preparePlaceholder() {
    return( (selectedValues.length === 0) ? 
      (props.placeholder !== undefined ? props.placeholder : 'Search...') : 
      props.config?.selectMultiple ? '' : selectedValues[0]?.displayName
    );
  }

  return (
    <div
      className={prepareContainerClassnames()}
      style={prepareStylesForContainer()}
      onClick={event => event.stopPropagation()}
      ref={myContainer}
      id="multiLevelContainer">

      <div
        className={styles.selectInputContainer}
        ref={selectInputContainer}
        onClick={() => setFocus(true)}
        tabIndex={0}
        onKeyDown={handleKeyDown} >

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
                  <div data-testid={`${value.id}-token-remove-button`} onClick={(e) => { e.stopPropagation(); removeFromSelected(value) }}>
                    <X size={16} color="var(--warm-neutral-shade-200)" />
                  </div>
                </div>)}
            <div className={classNames(styles.inputBox, { [styles.selected]: selectedValues.length > 0 })}>
              <input
                type="text"
                data-testid="search-input-field"
                ref={input => input && (focus ? input.focus() : input.blur())}
                placeholder={preparePlaceholder()}
                value={searchString}
                disabled={props.disabled}
                onChange={handleSearchStringChange}
                tabIndex={-1}
              />
            </div>
          </div>
          : <div className={classNames(styles.selectedOptions, { [styles.filterButton]: !props.disabled })} onClick={() => { setOptionsVisible(true) }}>
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
                tabIndex={0}
                onKeyDown={handleClearActionsKeydown}
                onClick={handleClearActionsClick}
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
          style={!props.config?.absolutePosition ? { left: optionsContainerLeft, right: optionsContainerRight, top: optionsContainerTop } : {}}
          className={classNames(styles.optionsWrapper, {
            [styles.absolute]: props.config?.absolutePosition,
            [styles.growLeft]: !!props.config?.expandLeft,
            [styles.fullWidth]: props.config?.applyFullWidth,
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
              options={props.options}
              multiSelect={props.config?.selectMultiple}
              onlyLeafSelectable={props.config?.onlyLeafSelectable}
              selectedValues={selectedValues}
              expandLeft={props.config?.expandLeft}
              optionsHeader={props.config?.optionsHeader}
              keyboardEvent={keyboardEventOnOptionLevel}
              activeIndex={activeItemIndex}
              isClearAllVisible={canShowClearAllOption()}
              isBrowseAllVisible={props.config?.enableTree}
              onOptionChange={toggleOptionSelection}
              onChildrenSelectionChange={handleChildrenSelectionChange}
              onActiveIndexChanged={setActiveItemIndex}
              onOptionsVisible={setOptionsVisible}
              onBrowseAll={showOptionTree}
              onDeselectAll={deselectAllOptions}
            />
          </div>
          {props.config?.enableTree &&
            <div className={classNames(styles.browseAllBtn, {
              [styles.focusedItem]: props.config?.enableTree && (activeItemIndex === props.options.length)
            })} onClick={showOptionTree}>
              <Globe size={16} color='var(--warm-prime-azure)' /><div>{t("--browseAll--")}</div>
            </div>}
          {canShowClearAllOption() &&
            <div
              className={classNames(styles.clearSelectionContainer, {
                [styles.focusedItem]: props.config?.enableTree ? activeItemIndex === (props.options.length + 1) : activeItemIndex === props.options.length
              })}
              data-testid="clear-filter-button"
              onClick={deselectAllOptions}
            >
              {getI18ControlText('--fieldTypes--.--masterdata--.--clear--')}
            </div>}
        </div>
      }

      {(!props.disabled) && (focus && searchString) &&
        <div
          ref={searchResultWrapper}
          style={!props.config?.absolutePosition ? { left: searchResultWrapperLeft, top: searchResultWrapperTop } : {}}
          className={classNames(styles.searchResultWrapper, {
            [styles.absolute]: props.config?.absolutePosition,
            [styles.growLeft]: !!props.config?.expandLeft,
            [styles.fullWidth]: props.config?.applyFullWidth,
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
            {(props.options.length !== 0 && searchString && matchingOptionsCount === 0) &&
              <div className={classNames(styles.searchValue, styles.searchError)} data-testid="search-error">
                {getI18ControlText('--fieldTypes--.--masterdata--.--noMatchingResultsFound--')}
              </div>}
            <SearchResults
              options={props.options}
              multiSelect={props.config?.selectMultiple}
              onlyLeafSelectable={props.config?.onlyLeafSelectable}
              searchString={searchString}
              path={''}
              selectedValues={selectedValues}
              keyboardEvent={keyboardEventOnSearchResult}
              activeIndex={activeItemIndex}
              onSelect={toggleOptionSelection}
              onChildrenSelectionChange={handleChildrenSelectionChange}
              onActiveIndexChanged={(activeIndex, filteredItems) => {
                setActiveItemIndex(activeIndex)
                setFilteredItemsLength(filteredItems)
              }}
              isBrowseAllVisible={props.config?.enableTree}
              onBrowseAll={showOptionTree}
            />
          </div>

          {props.config?.enableTree &&
            <div className={classNames(styles.browseAllBtn, {
              [styles.focusedItem]: props.config?.enableTree && (activeItemIndex === filteredItemsLength)
            })} onClick={showOptionTree}>
              <Globe size={16} color='var(--warm-prime-azure)' /><div>{t("--browseAll--")}</div>
            </div>}
        </div>
      }

      {
        (!props.disabled) && (optionsVisible || focus) &&
        <div className={styles.backdrop} onClick={didClickBackdrop}></div>
      }

      <OptionTreePopup
        type={props.type}
        isOpen={!props.disabled && optionsTreeVisible}
        options={props.options}
        selectedValues={selectedValues}
        multiSelect={props.config?.selectMultiple}
        onlyLeafSelectable={props.config?.onlyLeafSelectable}
        regionOptions={props.regionOptions}
        onSubmit={handleSelectionChange}
        onClose={didCloseOptionsPopup}
      />
    </div>
  );
}

export default MultiLevelSelect

