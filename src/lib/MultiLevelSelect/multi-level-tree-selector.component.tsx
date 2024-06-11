import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { ChevronDown, X } from 'react-feather'

import { MultiLevelSelectProps, Option } from './types'
import { getDefaultSelectedOptions, isAlredySelected, removeAllSelected, updateHierarchyForSelectedOptions } from './util.service'
import { OptionTreePopup } from './option-tree-popup.component'

import styles from './styles.module.scss'

export function MultiLevelTreeSelector (props: MultiLevelSelectProps) {
  const [focus, setFocus] = useState<boolean>(false)
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false)

  const [selectedValues, setSelectedValues] = useState<Option[]>([])

  useEffect(() => {
    const defaultSelectedOptions = getDefaultSelectedOptions(props.options, '')
    setSelectedValues(defaultSelectedOptions)
  }, [props.options])

  function getLabel (selectedValue: Option) {
    return selectedValue ? selectedValue?.displayName : ''
  }

  function getSelectionDisplayText () {
    return selectedValues.length > 0
      ? `${getLabel(selectedValues[0])}${getLabel(selectedValues[1]) ? ', ' + getLabel(selectedValues[1]) : ''}${getLabel(selectedValues[2]) ? ', ...' : ''}`
      : ''
  }

  function triggerOnChange (selectedValues: Option[]) {
    if (typeof props.onChange === 'function') {
      props.onChange(updateHierarchyForSelectedOptions(props.options, selectedValues, ''))
    }
  }

  function removeFromSelected (option: Option) {
    const updatedSelection = selectedValues.filter(selectedValue => selectedValue.id !== option.id)
    setSelectedValues(updatedSelection)
    triggerOnChange(updatedSelection)
  }

  // Function to remove all selected options from multiselect typeahead
  function removeFromMultiSelected (options: Option[], selectedOptions: Option[]) {
    const updatedSelection = removeAllSelected(options, selectedOptions)
    setSelectedValues(updatedSelection)
    triggerOnChange(updatedSelection)
  }

  function handleDropdownClick () {
    if (!(props.config?.disableDropdown)) {
      setOptionsVisible(true)
    } else {
      setFocus(true)
    }
  }

  function handleSelectionChange (options: Option[]) {
    setSelectedValues(options)
    setOptionsVisible(false)
    setFocus(false)
    triggerOnChange(options)
  }

  /**
   * Handles onClick event of the dismiss button of the modal dialog
   * 
   */

  function didClickCloseButton() {
    setOptionsVisible(false)
    setFocus(false)
    triggerOnChange(selectedValues)
  }

  /**
   * Handles onClick event of the clear selection button
   *
   * @param {React.MouseEvent<HTMLDivElement>} event
   */

  function didClickClearSelectionButton(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    (props.config?.selectMultiple) ? removeFromMultiSelected(props.options, selectedValues) : removeFromSelected(selectedValues[0])
  }

  /**
   * Handles onClick event of the input container
   * 
   */
  function didClickInputContainer() {
    setOptionsVisible(true)
  }

  /**
   * Prepare conditional CSS classnames for the main container
   * 
   * @returns {string}
   */
  function prepareContainerClassNames(): string {
    return classNames(
      styles.multiLevelSelect,
      ...(props.classnames || []),
      {
        [styles.focus]: focus && !props.disabled,
        [styles.multiLevelSelectDisable]: props.disabled,
        [styles.multiLevelSelectNoBorder]: props.config?.noBorder
      }
    )
  }

  /**
   * Prepare conditional CSS classnames for the input container
   *
   * @returns {string}
   */
  function prepareInputContainerClassNames(): string {
    return classNames(
      styles.selectedOptions,
      { [styles.filterButton]: !props.disabled }
    )
  }

  return (
    <div
      data-testid={`${props.id}-multiLevelTreeContainer`}
      className={prepareContainerClassNames()}
      onClick={event => event.stopPropagation()}
    >
      <div className={styles.selectInputContainer} onClick={() => setFocus(true)}>
        <div className={prepareInputContainerClassNames()} onClick={didClickInputContainer}>
          {
            props.config?.selectMultiple
              ? <div className={styles.selectedOptions}>
                {selectedValues && (selectedValues.length > 0) && selectedValues.map((value) =>
                  <div
                    className={styles.token}
                    data-testid={`${value.id}-token-value`}
                    key={`${value.id}-token-value`}
                  >
                    <div className={styles.label}>{value.displayName}</div>
                    <div data-testid={`${value.id}-token-remove-button`} onClick={(e) => { e.stopPropagation(); removeFromSelected(value) }}>
                      <X size={16} color="var(--warm-neutral-shade-200)" />
                    </div>
                  </div>)
                }
                {
                  (!selectedValues || selectedValues.length < 1) &&
                  <span className={styles.placeholder}>
                    {props.placeholder || 'Select...'}
                  </span>
                }
              </div>
              : <>
                {
                  getSelectionDisplayText() ? getSelectionDisplayText()
                    : <span className={styles.placeholder}>
                      {props.placeholder || 'Select...'}
                    </span>
                }
              </>
          }
        </div>

        {(!props.disabled) &&
          <>
           {props.config?.typeahead && selectedValues[0]?.displayName && !props.config?.selectMultiple &&
              <div
                className={classNames(styles.clearAction, 'clearActions')}
                data-testid="clear-selection-button"
                onClick={didClickClearSelectionButton}
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

      <OptionTreePopup
        type={props.type}
        isOpen={!props.disabled && (optionsVisible || focus)}
        options={props.options}
        selectedValues={selectedValues}
        multiSelect={props.config?.selectMultiple}
        regionOptions={props.regionOptions}
        onSubmit={handleSelectionChange}
        onClose={didClickCloseButton}
      />
    </div>
  )
}
