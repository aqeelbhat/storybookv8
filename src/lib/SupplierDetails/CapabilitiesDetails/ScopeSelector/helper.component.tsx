
import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight } from 'react-feather'
import classnames from 'classnames'

import { ConditionValuesMap, Option, OptionsProps } from './types'
import { getConditionValues, getSelectedOptionsCount, isAlredySelected } from './option-utils.service'
import style from './scope-selector-styles.module.scss'

export function Badge (props: {count: number, active: boolean}) {
  return (
    <>
      { props.count > 0
        ? <div className={classnames(style.badge, { [style.active]: props.active })}>
            {props.count}
          </div>
        : <div className={style.badgePlaceholder}></div>}
    </>
  )
}

export function ConditionDisplayText (props: { selectedConditions: Option[]}) {
  const [conditionValues, setCondition] = useState<ConditionValuesMap>({})

  useEffect(() => {
    const conditionValues = getConditionValues(props.selectedConditions)
    setCondition(conditionValues)
  }, [props.selectedConditions])

  function getConditionStrings (): JSX.Element[] {
    const conditionStrings: JSX.Element[] = []
    for (const conditionType in conditionValues) {
      conditionStrings.push(<span className={style.limitedTo}>{conditionType}: {conditionValues[conditionType].join(', ')}</span>)
    }
    return conditionStrings
  }

  return (
    <div className={style.displayText}>
      <span className={style.displayTextLabel}>Limited to: </span>
      <ul className={style.displayTextContainer}>
        {getConditionStrings().map((conditionString, index) => {
          return <li key={index} className={style.list}>{ conditionString }</li>
        })}
      </ul>
    </div>
  )
}

export function OptionWrapper (props: OptionsProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  function handleCurrentOptionSelectionChange () {
    if (props.onOptionSelectionChange && props.data.selectable) {
      props.onOptionSelectionChange(props.data)
    }
  }

  function handleChildOptionSelectionChange (option: Option) {
    if (props.isSelected) {
      // deselect current option
      const optionToBeDeselected = props.data
      // select all children except clicked option
      const allChildrenExceptClickedOption = props.data.children!.filter(childOption => childOption.id !== option.id)
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(allChildrenExceptClickedOption, [optionToBeDeselected])
      }
    } else if (props.isParentSelected) {
      // select all children except clicked option
      const allChildrenExceptClickedOption = props.data.children!.filter(childOption => childOption.id !== option.id)
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange(allChildrenExceptClickedOption, [])
      }
    } else {
      if (props.onOptionSelectionChange) {
        props.onOptionSelectionChange(option)
      }
    }
  }

  function handleChildrenSelectionChanges (option: Option, optionsToBeAdded: Option[], optionsToBeRemoved: Option[]) {
    if (props.isSelected) {
      // deselect current option
      const optionToBeDeselected = props.data
      // select all children except clicked option
      const allChildrenExceptClickedOption = props.data.children!.filter(childOption => childOption.id !== option.id)
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange([...optionsToBeAdded, ...allChildrenExceptClickedOption], [...optionsToBeRemoved, optionToBeDeselected])
      }
    } else if (props.isParentSelected) {
      // select all children except clicked option
      const allChildrenExceptClickedOption = props.data.children!.filter(childOption => childOption.id !== option.id)
      if (props.onChildrenSelectionChange) {
        props.onChildrenSelectionChange([...optionsToBeAdded, ...allChildrenExceptClickedOption], optionsToBeRemoved)
      }
    }
  }

  return (
    <div className={style.optionWrapper}>
        <div className={style.option}>
          <div className={style.chevronBox}>
            {props.data.children &&
              (isExpanded ? <ChevronDown onClick={() => setIsExpanded(false)} /> : <ChevronRight onClick={() => setIsExpanded(true)} />)}
          </div>

          <div className={style.checkbox}>
            {props.data.selectable &&
              <input
                type="checkbox"
                className={classnames({ [style.partialSelection]: !props.isSelected && getSelectedOptionsCount(props.data.children, props.selectedValues) })}
                checked={props.isParentSelected || props.isSelected}
                onChange={handleCurrentOptionSelectionChange}
              />}
          </div>
          <div className={style.displayName} onClick={handleCurrentOptionSelectionChange}>{props.data.displayName}</div>
        </div>

      {isExpanded && props.data.children &&
        <div className={style.childOptions}>
          {props.data.children.map((childOption, index) =>
            <OptionWrapper
              data={childOption}
              isSelected={isAlredySelected(childOption, props.selectedValues)}
              isParentSelected={props.isSelected || props.isParentSelected}
              selectedValues={props.selectedValues}
              onOptionSelectionChange={handleChildOptionSelectionChange}
              onChildrenSelectionChange={(selected, deselected) => handleChildrenSelectionChanges(childOption, selected, deselected)}
              key={index}
            />)}
        </div>}
    </div>
  )
}
