
import { Condition, ConditionValuesMap, HIERARCHY_DELIM, Option } from './types'
export const CONDITION_VALUE_KEY_DELIMITER = '::'

/*
* Returns if the passed Option is already present in selectedOptions.
*/
export function isAlredySelected (option: Option, selectedOptions: Option[]): boolean {
  return selectedOptions.some(selectedOption => selectedOption.id === option.id)
}

export function getSelectedOption (option: Option, selectedOptions: Option[]): Option | undefined {
  return selectedOptions.find(selectedOption => selectedOption.path === option.path)
}

/*
* Returns if the passed Option matches the searchString
*/
export function isAMatch (option: Option, searchString: string): boolean {
  return option.displayName?.toLowerCase().includes(searchString?.toLowerCase())
}

/*
* Returns the count of selected options out of the passed Option-list.
* It will consider all the selected options in the option-hierarchy.
*/
export function getSelectedOptionsCount (options: Option[] | undefined, selected: Option[]): number {
  let selectedCount = 0
  options && options.forEach((option) => {
    if (isAlredySelected(option, selected)) {
      selectedCount++
    }
    selectedCount = selectedCount + getSelectedOptionsCount(option.children, selected)
  })
  return selectedCount
}

/*
* Returns the count of all leaf-options that
* 1. match the searchString
* 2. are not present in selectedValues
*/
export function getMatchingOptionsCount (options: Option[] | undefined, searchString: string, selectedValues: Option[]): number {
  let count = 0
  options && options.forEach(option => {
    if (isAMatch(option, searchString) && !isAlredySelected(option, selectedValues)) {
      count++
    }
    // count children only if parent is not selected
    if (!isAlredySelected(option, selectedValues)) {
      count += getMatchingOptionsCount(option.children, searchString, selectedValues)
    }
  })
  return count
}

/*
* Returns list of default selected leaf-options out of the passed Option-list
*/
export function getDefaultSelectedOptions (options: Option[], hierarchy: string): Option[] {
  let newSelectedValues: Option[] = []
  options.forEach((option) => {
    const currentHierarchy = `${hierarchy}${option.displayName}`
    if (option.selected) {
      newSelectedValues.push({ ...option, hierarchy: currentHierarchy })
    }
    if (option.children) {
      newSelectedValues = newSelectedValues.concat(getDefaultSelectedOptions(option.children, `${currentHierarchy}${HIERARCHY_DELIM}`))
    }
  })
  return newSelectedValues
}

export function isSelected (option: Option, selectedOptions: Option[]): boolean {
  return selectedOptions.some(selectedOption => selectedOption.path === option.path)
}

/*
* Updates 'hierarchy' of each selected leaf-option
*/
export function updateHierarchyForSelectedOptions (options: Option[], selected: Option[], hierarchy: string): Option[] {
  let newSelectedValues: Option[] = []
  options.forEach((option) => {
    const currentHierarchy = `${hierarchy}${option.displayName}`

    if (isSelected(option, selected)) {
      const selectedMatchingCurrent = getSelectedOption(option, selected)
      const newOpt: Option = { ...option, value: selectedMatchingCurrent!.value }
      newSelectedValues.push({ ...newOpt, hierarchy: currentHierarchy })
    }

    if (option.children) {
      newSelectedValues = newSelectedValues.concat(updateHierarchyForSelectedOptions(option.children, selected, `${currentHierarchy}${HIERARCHY_DELIM}`))
    }
  })
  return newSelectedValues
}

/*
* Removes given Options and their cheldren from selected Options
*/
export function removeAllSelected (options: Option[], selectedOptions: Option[]): Option[] {
  let updatedSelectedOptions = [...selectedOptions]

  options && options.forEach(option => {
    const matchedIndex = updatedSelectedOptions.findIndex(selectedOption => selectedOption.id === option.id)
    if (matchedIndex >= 0) {
      updatedSelectedOptions.splice(matchedIndex, 1)
    }

    updatedSelectedOptions = option.children ? removeAllSelected(option.children, updatedSelectedOptions) : [...updatedSelectedOptions]
  })

  return updatedSelectedOptions
}

export function getHierarchySteps (option: Option): string[] {
  return option?.hierarchy?.split(HIERARCHY_DELIM) || []
}

export function getUpdatedConditions (selectedOptions: Option[], originalConditions?: Condition[]): Condition[] {
  const updatedConditions: Condition[] = []

  // for each condition,
  originalConditions && originalConditions.forEach(originalCondition => {
    // find selected options under the condition
    const selectedOptionsForCondition = selectedOptions.filter(selectedOption => getHierarchySteps(selectedOption)[0] === originalCondition.description)

      // For group, put child conditions at current level.
      // get child options
      const childOptionsForCondition: Option[] = selectedOptionsForCondition.map(matchedCondition => {
        // Remove parent key from hierarchy
        const hierarchySteps = getHierarchySteps(matchedCondition)
        hierarchySteps.splice(0, 1)
        const updatedHierarchy = hierarchySteps.join(HIERARCHY_DELIM)

        return {
          ...matchedCondition,
          hierarchy: updatedHierarchy
        }
      })

      // map child options opto child conditions
      const updatedChildrenConditions = getUpdatedConditions(childOptionsForCondition, originalCondition?.conditions)

      // put the children conditions at current level
      updatedChildrenConditions.forEach(updatedChildrenCondition => {
        updatedConditions.push(updatedChildrenCondition)
      })

  })

  return updatedConditions
}

export function getConditionValues (conditions: Option[]): ConditionValuesMap {
  const newConditionValues: ConditionValuesMap = {}
  conditions.forEach(condition => {
    const parrentValueOfSelected= condition?.hierarchy?.split(HIERARCHY_DELIM)[0] || ''

    const value = condition.displayName
    if (newConditionValues[parrentValueOfSelected] && newConditionValues[parrentValueOfSelected]) {
      newConditionValues[parrentValueOfSelected].push(value)
    } else {
      newConditionValues[parrentValueOfSelected] = [value]
    }
  })
  return newConditionValues
}

export function getHighestOrderNumberFromConditions (conditions: Option[]): number {
  let highestOrderNumber = 0

  highestOrderNumber = conditions.reduce((orderNumber, condition) => Math.max(orderNumber, condition.ordering || 0), 0)

  return highestOrderNumber
}
