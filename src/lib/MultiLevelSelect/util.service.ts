/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: noopur landge
 ************************************************************/

 import { HIERARCHY_DELIM, Option } from './types'

 export function getOptionsBatchSize (options: Option[]): number {
    let size = 0
    if (options) {
      // count options at current level
      size = size + options.length

      // count options at each child level
      for (let i = 0; i < options.length; i++) {
        size = size + getOptionsBatchSize(options[i].children)
      }
    }

    return size
 }

 /*
  * Returns if the passed 'option' is a leaf-option in the option-hierarchy.
  */
 export function isLeafOption (option: Option): boolean {
   return !(option.children)
 }
 
 /*
  * Returns if the passed 'option' is already present in 'selectedOptions'.
  */
 export function isAlredySelected (option: Option, selectedOptions: Option[]): boolean {
  return selectedOptions.some(selectedOption => (selectedOption.id === option.id) || (selectedOption.path === option.path))
 }
 
 /*
  * Returns if the passed Option matches the searchString
  */
 export function isAMatch (option: Option, searchString: string, considerCode?: boolean): boolean {
    // Convert to lovercase, remove line-breaks (from displayName), and then compare
   const isNameMatching = option.displayName?.toLowerCase().replace(/(\r\n|\n|\r)/gm, '').includes(searchString?.toLowerCase()) || option.path?.toLowerCase().includes(searchString?.toLowerCase())

   if (considerCode) {
    let isCodeMatching: boolean = true
    const code = option.customData?.origCode || option.customData?.code || option.customData?.codePath || option.path
    isCodeMatching = code?.toLowerCase().includes(searchString?.toLowerCase())

    return isNameMatching || isCodeMatching
   }

   return isNameMatching
 }

 /*
  * Returns if the passed Option matches the countryCode
  */
 export function doesMatchCountry (option: Option, countryCode): boolean {
  return option.customData?.other?.countryCode?.toLowerCase() === countryCode?.toLowerCase()
}
 
 /*
  * Returns the count of 'selected' options among 'options'.
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
  * Returns the count of all options that
  * 1. match the 'searchString'
  * 2. are not present in 'selectedValues'
  */
 export function getMatchingOptionsCount (options: Option[] | undefined, searchString: string, selectedValues: Option[]): number {
   let count = 0
   options && options.forEach(option => {
     if (isAMatch(option, searchString)) {
       count++
     }
     count += getMatchingOptionsCount(option.children, searchString, selectedValues)
   })
   return count
 }
 
 /*
  * Returns list of 'selected' options among the 'options'
  * Also updates 'hierarchy' of each selected option
  */
 export function getDefaultSelectedOptions (options: Option[], hierarchy: string): Option[] {
   let newSelectedValues: Option[] = []
   options.forEach((option) => {
     if (option.selected) {
       newSelectedValues.push({ ...option, hierarchy: `${hierarchy}${option.displayName}` })
     }
     if (option.children) {
       newSelectedValues = newSelectedValues.concat(getDefaultSelectedOptions(option.children, `${hierarchy}${option.displayName}${HIERARCHY_DELIM}`))
     }
   })
   return newSelectedValues
 }
 
 /*
  * Updates 'hierarchy' of each selected option
  */
 export function updateHierarchyForSelectedOptions (options: Option[], selected: Option[], hierarchy: string): Option[] {
   let newSelectedValues: Option[] = []
   options.forEach((option) => {
     if (isAlredySelected(option, selected)) {
       newSelectedValues.push({ ...option, hierarchy: `${hierarchy}${option.displayName}` })
     }
     if (option.children) {
       newSelectedValues = newSelectedValues.concat(updateHierarchyForSelectedOptions(option.children, selected, `${hierarchy}${option.displayName}${HIERARCHY_DELIM}`))
     }
   })
   return newSelectedValues
 }
 
 /*
  * Removes given 'options' and their cheldren from 'selectedOptions'
  */
 export function removeAllSelected (options: Option[], selectedOptions: Option[]): Option[] {
   let updatedSelectedOptions = [...selectedOptions]
 
   options && options.forEach(option => {
     const matchedIndex = updatedSelectedOptions.findIndex(selectedOption => selectedOption.path === option.path)
     if (matchedIndex >= 0) {
       updatedSelectedOptions.splice(matchedIndex, 1)
     }
 
     updatedSelectedOptions = option.children ? removeAllSelected(option.children, updatedSelectedOptions) : [...updatedSelectedOptions]
   })
 
   return updatedSelectedOptions
 }

 export function putChildren (options: Option[], parrentPath: string, children: Option[]) {
  const matchingOption = options && options.find(option => option.path === parrentPath)
  if (matchingOption) {
    // If parent found at current level, put children
    matchingOption.children = children
  } else {
    // Else, try to find parrent in each child level
    options && options.forEach(option => putChildren(option.children, parrentPath, children))
  }

  return options
 }

export function isOnlyOneOption (options: Option[]): boolean {
  return options && (options.length === 1) &&
    (!options[0].children || (options[0].children.length < 1))
}
 