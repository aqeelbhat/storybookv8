import React, { useEffect, useRef, useState, KeyboardEvent, useReducer } from 'react'
import { Box, Modal } from '@mui/material'
import { Check, ChevronDown, ChevronRight, Search, X, Info } from 'react-feather'
import classNames from 'classnames'

import { OptionTreePopupProps, Option, getOptionTreeDataName, OptionTreeData } from './types'
import { OroButton } from '../controls/button/button.component'
import { doesMatchCountry, getSelectedOptionsCount, isAMatch, isAlredySelected, isLeafOption, putChildren, removeAllSelected, updateHierarchyForSelectedOptions } from './util.service'

import styles from './option-tree-popup.module.scss'
import { getI18Text, useTranslationHook } from '../i18n'
import { GlanceOption, OptionFullPath } from './glance-option.component'
import { Keyboard } from '../Types/common'
import { OroTooltip } from '../Tooltip/tooltip.component'
import Zoom from '@mui/material/Zoom';
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 778,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  padding: '24px',
  borderRadius: '8px'
}

function isSelfOrDecendantMatching (option: Option, type?: OptionTreeData, searchString?: string, regionCode?: string): boolean {
  if (!searchString && !regionCode) {
    return false
  }

  const isSelfMatch = !searchString || isAMatch(option, searchString, type === OptionTreeData.category)
  const isSelfFiltered = !regionCode || doesMatchCountry(option, regionCode)

  let isDecendantMatch = false
  if (option.children && option.children.length > 0) {
    isDecendantMatch = option.children.some(child => {
      return isSelfOrDecendantMatching(child, type, searchString, regionCode)
    })
  }

  return (isSelfMatch && isSelfFiltered) || isDecendantMatch
}

export function OptionTreePopup (props: OptionTreePopupProps) {
  const [searchString, setSearchString] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<Option>()
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
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

  const { t } = useTranslationHook()

  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1)
  const [keyboardEvent, setKeyboardEvent] = useState<Keyboard>(null)
  const [forceResetFocus, setForceResetFocus] = useState<boolean>(false)

  const [focusCloseButton, setFocusCloseButton] = useState<number>(-1)

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

  useEffect(() => {
    setSelectedValues(props.selectedValues)
  }, [props.isOpen, props.selectedValues])

  function handleSearchStringChange (event) {
    setSearchString(event.target.value)

    if (props.async && props.onSearch) {
      setSearchResultLoading(true)
      props.onSearch(event.target.value)
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

  function triggerOnChange () {
    if (typeof props.onSubmit === 'function') {
      if (props.async) {
        props.onSubmit(selectedValues)
      } else {
        props.onSubmit(updateHierarchyForSelectedOptions(props.options, selectedValues, ''))
      }
    }
    setActiveItemIndex(-1)
    setSearchString('')
    setSearchResult([])
    setRegionFilter(undefined)
  }

  function removeFromSelected (option: Option) {
    const updatedSelection = selectedValues.filter(selectedValue => selectedValue.path !== option.path)
    setSelectedValues(updatedSelection)
  }

  function toggleOptionSelection (updatedOption: Option) {
    if (props.multiSelect) {
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
      }
    } else {
      // replace
      setSelectedValues([updatedOption])
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
  }

  function deselectAllOptions () {
    setActiveItemIndex(-1)
    setSelectedValues([])
  }

  function closePopup () {
    setActiveItemIndex(-1)
    setSearchString('')
    setSearchResult([])
    setRegionFilter(undefined)
    if (props.onClose) {
      props.onClose()
      setFocusCloseButton(-1)
    }
  }

  function selectRegion (region?: Option) {
    setRegionFilter(region)
    setIsFilterOpen(false)
  }

  function triggerChildInteraction (key: Keyboard) {
    setKeyboardEvent(key)
    setTimeout(() => {
      setKeyboardEvent(null)
    }, 100)
  }

  function handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case Keyboard.Down:
        if (activeItemIndex === -1) {
          setActiveItemIndex(0)
        } else {
          triggerChildInteraction(event.key as Keyboard)
        }
        break
      default:
        if (activeItemIndex !== -1) {
          triggerChildInteraction(event.key as Keyboard)
        }
        break;
    }
  }

  function resetFocus () {
    setActiveItemIndex(-1)
    setForceResetFocus(true)
    setTimeout(() => {
      setForceResetFocus(false)
    }, 100)
  }

  function canShowHeader (): boolean {
    return (
      (props.type === OptionTreeData.category) ||
      (props.type === OptionTreeData.entity && props.regionOptions && (props.regionOptions.length > 0))
    )
  }

  return (
    <Modal open={props.isOpen} onClose={closePopup}>
      <Box sx={modalStyle}>
        <div className={styles.optionTreeModal}>
          <div className={styles.headerBar}>
            <div className={styles.title}>
              {props.type ? t("--selectType--", { type: getOptionTreeDataName(props.type)}) : t("--select--")}
            </div>
            <div className={styles.spread}></div>
            <div className={styles.closeBtn} onKeyDown={ (event) => {
              if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
                closePopup()
              }
            }
              } onClick={closePopup} tabIndex={focusCloseButton} onBlur={() => { setFocusCloseButton(-1) }}>
              <X size={16} color={'var(--warm-neutral-shade-500)'} />
            </div>
          </div>

          <div className={styles.filterBar}>
            {props.regionOptions && props.regionOptions.length > 0 &&
              <div className={styles.regionFilter}>
                <div className={classNames(styles.control, {[styles.focused]: isFilterOpen, [styles.selected]: regionFilter})} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  {regionFilter
                    ? <>
                        <div className={styles.selectedValue}>{regionFilter.displayName}</div>
                        <X size={16} color={'var(--warm-neutral-shade-300)'} onClick={(e) => {e.stopPropagation(); selectRegion()}} />
                      </>
                    : <>
                        <span className={styles.placeholder}>{t("Country")}</span>
                        <ChevronDown size={16} color={'var(--warm-neutral-shade-300)'} />
                      </>}
                </div>
                {isFilterOpen &&
                  <>
                    <div className={styles.optionsList}>
                      {props.regionOptions && props.regionOptions.map((region, i) =>
                        <div className={styles.optionsItem} key={i} onClick={() => selectRegion(region)}>{region.displayName}</div>)}
                    </div>
                    <div className={styles.backdrop} onClick={() => setIsFilterOpen(false)} />
                  </>}
              </div>}
            <div className={classNames(styles.inputBox, {[styles.focused]: searchString})}>
              <Search size={16} color={'var(--warm-neutral-shade-300)'} className={styles.filterByItemSearchIcon} />
              <input
                type="text"
                data-testid="search-input-field"
                placeholder={t("--searchUsingKeyword--")}
                value={searchString}
                onChange={handleSearchStringChange}
              />
              {searchString &&
                <X
                  size={16} color={'var(--warm-neutral-shade-300)'} className={styles.filterByItemSearchIcon}
                  onClick={(e) => {e.stopPropagation(); setSearchString(''); setSearchResult([])}}
                />}
            </div>
            <div className={styles.spread}></div>
          </div>

          <div className={styles.optionsContainer} tabIndex={0} onKeyDown={handleKeyDown} onBlur={resetFocus}>
            {canShowHeader() &&
              <div className={`${styles.optionValue} ${styles.header}`}>
                <ExpandBtn expanded={false} hidden={true} />
                <OptionComp
                  data={{
                    id: '',
                    displayName: getOptionTreeDataName(props.type) || getI18Text('--value--'),
                    path: '',
                    customData: {
                      origCode: t('--code--'),
                      other: { countryCode: props.regionOptions && props.regionOptions.length > 0 && t("Country") }}
                  }}
                  type={props.type}
                  hideAdditionalInfo={true}
                />
                {!props.multiSelect && <div className={styles.checkWraper}></div>}
              </div>}

            <OptionLevel
              options={(props.async && searchString) ? searchResult : options}
              selectedValues={selectedValues}
              type={props.type}
              searchString={searchString}
              regionCode={regionFilter?.path}
              multiSelect={props.multiSelect}
              onlyLeafSelectable={props.onlyLeafSelectable}
              searchResultLoading={searchResultLoading}
              fetchChildren={props.async ? fetchChildren : undefined}
              onOptionChange={toggleOptionSelection}
              onChildrenSelectionChange={handleChildrenSelectionChange}
              keyboardEvent={keyboardEvent}
              activeIndex={activeItemIndex}
              forceResetFocus={forceResetFocus}
              onActiveIndexChanged={setActiveItemIndex}
            />

            <div className={styles.optionsLevel}>
              {props.options.length === 0 &&
                <div className={styles.optionError} data-testid="search-error">
                  {t("--noOptionFound--")}
                </div>}
              {(props.options.length !== 0 && searchString && searchResultLoading) &&
                <div className={styles.optionError} data-testid="search-error">
                  {t("--searching--")}
                </div>}
              {(props.options.length !== 0 && searchString && props.async && !searchResultLoading && searchResult.length === 0) &&
                <div className={styles.optionError} data-testid="search-error">
                  {t("--noMatchingResultFound--")}
                </div>}
            </div>
          </div>

          <div className={styles.actionBar}>
            <div className={styles.spread}></div>
            <div className={styles.submitBtn}>
              <OroButton label='Clear' type='link' radiusCurvature={'medium'} onClick={deselectAllOptions} />
            </div>
            <div className={styles.submitBtn} onBlur={() => { setFocusCloseButton(0) }}>
              <OroButton label='Continue' type='primary' radiusCurvature={'medium'} onClick={triggerOnChange}/>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

function OptionLevel (props: {
  options: Option[] | undefined;
  selectedValues: Option[];
  type?: OptionTreeData
  searchString?: string
  regionCode?: string
  path?: string
  isParentSelected?: boolean;
  multiSelect?: boolean;
  onlyLeafSelectable?: boolean
  level?: number;
  searchResultLoading?: boolean
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onOptionChange?: (option: Option) => void;
  onChildrenSelectionChange?: (selectedValues: Option[], deselectedValues: Option[], currentParrent?: Option) => void;

  forceLastChildSelection?: boolean
  forceResetFocus?: boolean
  keyboardEvent?: Keyboard
  activeIndex?: number;
  onActiveIndexChanged?: (index: number) => void;
  onExitLevel?: (key: Keyboard) => void;
}) {
  const optionsDivRefs = React.useRef<Array<HTMLDivElement>>([])
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [forceLastChildSelection, setForceLastChildSelection] = useState<boolean>(false)

  useEffect(() => {
    let listOfFilteredItems = []
    if (props.searchString || props.regionCode) {
      // check if props are present
      // filter props.options to match the search string
      listOfFilteredItems = props.options?.filter((option) => {
        return isSelfOrDecendantMatching(option, props.type, props.searchString, props.regionCode)
      }) || []
    } else {
      listOfFilteredItems = props.options || []
    }

    setFilteredOptions(listOfFilteredItems)
  }, [props.options, props.searchString, props.regionCode])

  // scoll active item in view
  useEffect(() => {
    const activeOption = props.activeIndex
    const activeElement = optionsDivRefs.current[activeOption]
    if (activeElement?.scrollIntoView) {
      activeElement?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }, [props.activeIndex])

  const [expandedOptions, setExpandedOptions] = useState<{[index: number]: boolean}>({})
  const [childActiveItemIndex, setChildActiveItemIndex] = useState<number>(-1)
  const [parentActiveItemIndex, setParentActiveItemIndex] = useState<number>(-1)
  const [keyboardEvent, setKeyboardEvent] = useState<Keyboard | null>(null)

  useEffect(() => {
    if (props.forceResetFocus) {
      setChildActiveItemIndex(-1)
      setParentActiveItemIndex(-1)
    }
  }, [props.forceResetFocus])

  // handle keyboard events
  useEffect(() => {
    if (props.keyboardEvent) {
      props.activeIndex >= 0 ? handleKeyDown(props.keyboardEvent as Keyboard) : triggerChildInteraction(props.keyboardEvent as Keyboard)
    }
  }, [props.keyboardEvent])

  function isExpanded (index: number) {
    return expandedOptions[index] || props.searchString || props.regionCode
  }

  useEffect(() => {
    if (props.forceLastChildSelection && filteredOptions.length > 0) {
      const lastItemIndex = filteredOptions.length - 1

      // Try to select last item
      if (filteredOptions[lastItemIndex] && (isLeafOption(filteredOptions[lastItemIndex]) || !isExpanded(lastItemIndex))) {
        props.onActiveIndexChanged && props.onActiveIndexChanged(lastItemIndex)
      } else {
        // if it has children, try to select its last child
        triggerLastChildSelection()
        setParentActiveItemIndex(lastItemIndex)
        props.onActiveIndexChanged && props.onActiveIndexChanged(Number.NEGATIVE_INFINITY)
      }
    }
  }, [props.forceLastChildSelection])

  function triggerChildInteraction(key: Keyboard) {
    setKeyboardEvent(key)
    setTimeout(() => {
      setKeyboardEvent(null)
    }, 100)
  }

  function handleKeyDown(event: Keyboard): void {
    switch (event) {
      case Keyboard.Enter:
      case Keyboard.Return:
        if ((props.activeIndex > -1) && (props.activeIndex < filteredOptions.length)) {
          props.onOptionChange && props.onOptionChange(filteredOptions[props.activeIndex])
        }
        break;
      case Keyboard.Right:
        if ((props.activeIndex >= 0) && filteredOptions?.[props.activeIndex] && !isLeafOption(filteredOptions[props.activeIndex])) {
          setExpandedOptions({...expandedOptions, [props.activeIndex]: true})
        }
        break
      case Keyboard.Left:
        setExpandedOptions({...expandedOptions, [props.activeIndex]: false})
        setChildActiveItemIndex(-1)
        break
      case Keyboard.Down:
        if ((props.activeIndex >= 0) && filteredOptions?.[props.activeIndex] && !isLeafOption(filteredOptions[props.activeIndex]) && isExpanded(props.activeIndex)) {
          // if expanded, go in sub-level
          setParentActiveItemIndex(props.activeIndex)
          setChildActiveItemIndex(0)
          props.onActiveIndexChanged?.(Number.NEGATIVE_INFINITY)
        } else if (props.activeIndex === (filteredOptions.length - 1)) {
          // if last item, go in parent-level
          props.onExitLevel && props.onExitLevel(event)
          setChildActiveItemIndex(-1)
        } else {
          // cycle through list
          focusNextListItem(event)
        }
        break;
      case Keyboard.Up:
        if (props.activeIndex === 0) {
          // if first item, go in parent-level
          props.onExitLevel?.(event)
          setChildActiveItemIndex(-1)
        } else if (props.activeIndex > 0 && filteredOptions?.[props.activeIndex - 1] && !isLeafOption(filteredOptions[props.activeIndex - 1]) && isExpanded(props.activeIndex - 1)) {
          // if previous item is expanded, go in sub-level, select last
          setParentActiveItemIndex(props.activeIndex - 1)
          triggerLastChildSelection()
          props.onActiveIndexChanged?.(Number.NEGATIVE_INFINITY)
        } else {
          // cycle through list
          focusNextListItem(event)
        }
        break
      default: return
    }
  }

  function triggerLastChildSelection() {
    setForceLastChildSelection(true)
    setTimeout(() => {
      setForceLastChildSelection(false)
    }, 100)
  }

  function focusNextListItem(key: Keyboard) {
    if (key === Keyboard.Down) {
      const lastAllowedOptionIndex = filteredOptions.length - 1
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

  function didExitLevel(key: Keyboard) {
    switch(key) {
      case Keyboard.Down:
        if ((parentActiveItemIndex + 1) < filteredOptions.length) {
          props.onActiveIndexChanged?.(parentActiveItemIndex + 1)
          setChildActiveItemIndex(-1)
        } else if (props.onExitLevel) {
          props.onExitLevel(key)
          setChildActiveItemIndex(-1)
        }
        break
      case Keyboard.Up:
        props.onActiveIndexChanged?.(parentActiveItemIndex)
        setChildActiveItemIndex(-1)
        break
    }
  }

  function getIndexInFilteredList (option: Option): number {
    return filteredOptions.findIndex(filteredOption => filteredOption.path === option.path)
  }

  return (
    <>
      <div className={styles.optionsLevel}>
        {filteredOptions && filteredOptions.map((option, index) =>
          <div key={index} ref={element => optionsDivRefs.current[index] = element}>
            <OptionItem
              key={`${option.id}-option-value-${option.children?.length}`}
              option={option}
              selectedValues={props.selectedValues}
              type={props.type}
              searchString={props.searchString}
              regionCode={props.regionCode}
              path={props.path}
              isParentSelected={props.isParentSelected}
              multiSelect={props.multiSelect}
              onlyLeafSelectable={props.onlyLeafSelectable}
              level={props.level}
              searchResultLoading={props.searchResultLoading}
              fetchChildren={props.fetchChildren}
              onOptionChange={props.onOptionChange}
              onChildrenSelectionChange={props.onChildrenSelectionChange}

              isExpandedByKeyboard={expandedOptions[index]}
              forceResetFocus={props.forceResetFocus}
              forceLastChildSelection={(getIndexInFilteredList(option) === parentActiveItemIndex) ? forceLastChildSelection : false}
              focused={props.activeIndex === getIndexInFilteredList(option)}
              keyboardEvent={keyboardEvent}
              childActiveItemIndex={(getIndexInFilteredList(option) === parentActiveItemIndex) ? childActiveItemIndex : -1}
              onActiveIndexChanged={setChildActiveItemIndex}
              onExitLevel={didExitLevel}
            />
          </div>
        )}
      </div>
    </>
  )
}

function OptionItem (props: {
  option: Option;
  selectedValues: Option[];
  type?: OptionTreeData
  searchString?: string
  regionCode?: string
  path?: string
  isParentSelected?: boolean;
  multiSelect?: boolean;
  onlyLeafSelectable?: boolean
  level?: number;
  searchResultLoading?: boolean
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  onOptionChange?: (option: Option) => void;
  onChildrenSelectionChange?: (selectedValues: Option[], deselectedValues: Option[], currentParrent?: Option) => void;
  isExpandedByKeyboard?: boolean
  forceResetFocus?: boolean
  forceLastChildSelection?: boolean
  focused?: boolean
  keyboardEvent?: Keyboard
  childActiveItemIndex?: number;
  onActiveIndexChanged?: (index: number) => void
  onExitLevel?: (key: Keyboard) => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [selectedChildrenCount, setSelectedChildrenCount] = useState<number>()
  const [hovering, setHovering] = useState<boolean>(false)

  useEffect(() => {
    setIsExpanded(props.isExpandedByKeyboard)
  }, [props.isExpandedByKeyboard])

  useEffect(() => {
    setIsExpanded(false)
  }, [props.searchString])

  useEffect(() => {
    setSelectedChildrenCount(getSelectedOptionsCount(props.option.children, props.selectedValues))
  }, [props.option, props.selectedValues])

  function isSelfMatching (option: Option): boolean {
    const isSelfMatch = props.searchString && isAMatch(option, props.searchString, props.type === OptionTreeData.category)
    const isSelfFiltered = props.regionCode && doesMatchCountry(option, props.regionCode)

    return isSelfMatch || isSelfFiltered
  }

  function handleClickConsideringSelectability (event, option: Option) {
    if (option.selectable && (isLeafOption(option) || !props.onlyLeafSelectable)) {
      event.stopPropagation()
      toggleOptionSelection(option)
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
      if (props.onOptionChange) {
        props.onOptionChange(option)
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

  function toggleOption () {
    setIsExpanded(!isExpanded)
  }

  function toggleOptionSelection (option: Option) {
    if (typeof props.onOptionChange === 'function') {
      props.onOptionChange({ ...option })
    }
  }

  function handleClick () {
    if (isLeafOption(props.option)) {
      toggleOptionSelection(props.option)
      toggleOption()
    } else {
      toggleOption()
      if (props.fetchChildren) {
        props.fetchChildren(props.option?.path, props.option?.customData?.level + 1)
      }
    }
  }

  function handleMouseOver () {
    setHovering(true)
  }

  function handleMouseOut () {
    setHovering(false)
  }

  return (
    <div>
      <div
        className={classNames(styles.optionValue, {
          [styles.focused]: props.focused,
          [styles.selected]: !props.multiSelect && isAlredySelected(props.option, props.selectedValues),
          [styles.match]: isSelfMatching(props.option)
        })}
        data-testid={`${props.option.id}-option-value`}
        onClick={() => handleClick()}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      >
        <ExpandBtn expanded={isExpanded || isSelfOrDecendantMatching(props.option, props.type, props.searchString, props.regionCode)} hidden={isLeafOption(props.option)} level={props.level || 0} />
        <div className={styles.optionInput}>
          {isLeafOption(props.option)
            ? props.multiSelect
              ? <div className={styles.inputWrapper}>
                  <div className={styles.label} onClick={(e) => handleClickConsideringSelectability(e, props.option)}>
                    <input
                      type="checkbox"
                      data-testid={`${props.option.id}-option-checkbox`}
                      id={`${props.option.id}-option-checkbox`}
                      checked={props.isParentSelected || isAlredySelected(props.option, props.selectedValues)}
                      onChange={(e) => handleClickConsideringSelectability(e, props.option)}
                      tabIndex={-1}
                    />
                    <OptionComp data={props.option} type={props.type} searchString={props.searchString} regionCode={props.regionCode} hovering={hovering} />
                  </div>
                </div>
              : <div className={classNames(styles.inputWrapper)} onClick={(e) => handleClickConsideringSelectability(e, props.option)}>
                  <OptionComp data={props.option} type={props.type} searchString={props.searchString} regionCode={props.regionCode} hovering={hovering} />
                  <div className={styles.checkWraper}>
                    <Check size={16} color='var(--warm-neutral-shade-400)' className={classNames(styles.checkMark, {[styles.visible]: isAlredySelected(props.option, props.selectedValues)})} />
                  </div>
                </div>
            : props.multiSelect && props.option.selectable && (isLeafOption(props.option) || !props.onlyLeafSelectable)
              ? <>
                  <div className={styles.inputWrapper}>
                    <div className={styles.label} onClick={(e) => handleClickConsideringSelectability(e, props.option)}>
                      <input
                        type="checkbox"
                        data-testid={`${props.option.id}-option-checkbox`}
                        id={`${props.option.id}-option-checkbox`}
                        className={classNames({[styles.partialSelected]: selectedChildrenCount})}
                        checked={props.isParentSelected || isAlredySelected(props.option, props.selectedValues)}
                        onChange={(e) => handleClickConsideringSelectability(e, props.option)}
                        tabIndex={-1}
                      />
                      <OptionComp data={props.option} type={props.type} searchString={props.searchString} regionCode={props.regionCode} hovering={hovering} />
                    </div>
                  </div>
                </>
              : <>
                  <div className={styles.inputWrapper} onClick={(event) => handleClickConsideringSelectability(event, props.option)}>
                    <OptionComp data={props.option} type={props.type} searchString={props.searchString} regionCode={props.regionCode} hovering={hovering} />
                    <div className={styles.checkWraper}>
                      <Check size={16} color='var(--warm-neutral-shade-400)' className={classNames(styles.checkMark, {[styles.visible]: isAlredySelected(props.option, props.selectedValues)})} />
                    </div>
                  </div>
                </>}
        </div>
      </div>

      {Array.isArray(props.option?.children) && props.option.children.length > 0 &&
        (isExpanded || isSelfOrDecendantMatching(props.option, props.type, props.searchString, props.regionCode)) &&
        <div className={styles.optionChildLevel}>
          <OptionLevel
            options={props.option.children}
            selectedValues={props.selectedValues}
            type={props.type}
            searchString={props.searchString}
            regionCode={props.regionCode}
            multiSelect={props.multiSelect}
            onlyLeafSelectable={props.onlyLeafSelectable}
            isParentSelected={props.isParentSelected || isAlredySelected(props.option, props.selectedValues)}
            level={(props.level || 0) + 1}
            fetchChildren={props.fetchChildren}
            onOptionChange={(childOption) => handleChildOptionSelectionChange(childOption, props.option)}
            onChildrenSelectionChange={(optionsToBeAdded, optionsToBeRemoved, childOption) => handleChildrenSelectionChanges(optionsToBeAdded, optionsToBeRemoved, childOption, props.option)}

            forceResetFocus={props.forceResetFocus}
            forceLastChildSelection={props.forceLastChildSelection}
            keyboardEvent={props.keyboardEvent}
            activeIndex={props.childActiveItemIndex}
            onActiveIndexChanged={props.onActiveIndexChanged}
            onExitLevel={props.onExitLevel}
          />
        </div>}
    </div>
  )
}

function ExpandBtn (props: {expanded: boolean, hidden?: boolean, level?: number}) {
  return (
    <div className={styles.expandBtn} style={{ marginLeft: `${24 * props.level}px` }}>
      {!props.hidden && (props.expanded ? <ChevronDown size={16} color='var(--warm-neutral-shade-200)' /> : <ChevronRight size={16} color='var(--warm-neutral-shade-200)' />)}
    </div>
  )
}

function getHighlightedString (originalString?: string, searchString?: string) {
  const lcSearchString = searchString ? searchString.toLowerCase() : ''
  const lcOriginalString = originalString ? originalString.toLowerCase() : ''

  if (lcSearchString && lcOriginalString && lcOriginalString.includes(lcSearchString)) {
    const indexOfMatch = lcOriginalString.indexOf(lcSearchString)
    const originalChars = originalString.split('')
    const matchedSubstring = originalString.substring(indexOfMatch, indexOfMatch + lcSearchString.length)
    return (
      <span>
        {originalChars.slice(0, indexOfMatch)}
        <span className={styles.searchText}>{matchedSubstring}</span>
        {originalChars.slice(indexOfMatch + matchedSubstring.length)}
      </span>
    )
  } else {
    return originalString
  }
}

function OptionComp (props: {
  data: Option,
  type?: OptionTreeData
  searchString?: string,
  regionCode?: string,
  hideAdditionalInfo?: boolean,
  hovering?: boolean,
  onInfoToggle?: (isOpen: boolean) => void
}) {
  const { t } = useTranslationHook()
  const [active, setActive] = useState<boolean>(false)

  // function getDisplayName () {
    // const searchString = props.searchString ? props.searchString.toLowerCase() : ''
    // const displayName = props.data.displayName ? props.data.displayName.toLowerCase() : ''

    // if (searchString && displayName && displayName.includes(searchString)) {
    //   const indexOfMatch = displayName.indexOf(searchString)
    //   const originalString = props.data.displayName.split('')
    //   const matchedSubstring = props.data.displayName.substring(indexOfMatch, indexOfMatch + searchString.length)
    //   return (
    //     <span>
    //       {originalString.slice(0, indexOfMatch)}
    //       <span className={styles.searchText}>{matchedSubstring}</span>
    //       {originalString.slice(indexOfMatch + matchedSubstring.length)}
    //     </span>
    //   )
    // } else {
    //   return props.data.displayName
    // }

  //   return getHighlightedString(props.data.displayName, props.searchString)
  // }

  function prepareStyleForCountyCode() : string {
    return classNames(
      styles.optionValueSublevel,
      {[styles.matched]: props.regionCode && doesMatchCountry(props.data, props.regionCode)}
    )
  }

  function didCloseTooltip() {
    setActive(false)
  }

  function prepareStylesForTooltip() {
    return classNames(styles.icon, { [styles.active]: active })
  }

  function prepareToolTipFragment() {
    return (
      <React.Fragment>
        <div className={classNames(styles.popup, { [styles.hidden]: !active })} >
          {props.type !== OptionTreeData.category &&
            <div className={styles.header}>
              <div className={styles.code}>
                {props.data.customData?.origCode || props.data.customData?.code || props.data.customData?.codePath || props.data.path}
              </div>
            </div>}

          {((props.data.customData?.ancestorNames && props.data.customData.ancestorNames.length > 0) || props.data.customData?.other?.countryCode || props.data.customData?.longDescription) &&
            <div className={styles.body}>
              {props.data.customData?.ancestorNames && props.data.customData.ancestorNames.length > 0 &&
                <OptionFullPath option={props.data} />}

              {props.data.customData?.other?.countryCode &&
                <div className={styles.parameter}>
                  {t('--Region--')}: <span className={styles.value}>{ALPHA2CODES_DISPLAYNAMES[props.data.customData?.other?.countryCode]}</span>
                </div>}

              {
                props.data.customData?.longDescription &&
                <div className={styles.parameter}>
                  {t('--description--')}: <span className={styles.value}>{props.data.customData?.longDescription}</span>
                </div>
              }
            </div>}
        </div>
      </React.Fragment>
    )
  }

  function getSecondColumnValue () {
    switch (props.type) {
      case OptionTreeData.category:
        const code = props.data.customData?.origCode || props.data.customData?.code || props.data.customData?.codePath || props.data.path
        return getHighlightedString(code, props.searchString)
      case OptionTreeData.entity:
        return props.data.customData?.other?.countryCode
    }
  }

  return (
    <>
      {props.data.icon && <img src={props.data.icon} />}
      <div className={styles.optionValueLabel}>

        {/* COLUMN 1 */}
        <div className={styles.optionValueLevel}>
          <div className={styles.text}>
            {getHighlightedString(props.data.displayName, props.searchString)}
            {!props.hideAdditionalInfo && props.hovering &&
              <div className={styles.infoButton}>
                <OroTooltip
                  id={props.data.id}
                  describeChild={true}
                  title={prepareToolTipFragment()}
                  placement="right"
                  disableHoverListener={false}
                  TransitionComponent={Zoom}
                  onClose={didCloseTooltip}
                >
                  <Info
                    size={16}
                    className={prepareStylesForTooltip()}
                    onClick={(event) => { event.stopPropagation() }}
                  />
                </OroTooltip>
              </div>}
          </div>

          {props.searchString &&
            <OptionFullPath option={props.data} limit />}
        </div>

        {/* COLUMN 2 */}
        <div className={prepareStyleForCountyCode()}>
          {getSecondColumnValue()}
        </div>
      </div>
    </>
  )
}
