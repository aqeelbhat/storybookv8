import { AssessmentRisk } from '../..'
import { areObjectsSame } from '../../Form/util'
import { ItemDetails } from '../../Types/common'
import { AssessmentExpiration } from '../../Types/supplier'

// A equalityChecker function should accept two values, and
// return true if values are equal

export function literalEqualityChecker (value1?, value2?): boolean {
  return value1 === value2
}

export function objectEqualityChecker (value1?, value2?): boolean {
  return areObjectsSame(value1, value2)
}

export function arrayEqualityChecker (value1?, value2?): boolean {
  if (value1 && value2) {
    if (value1.length === value2.length) {
      const differentValueFound = value1.some((val, index) => {
        return !areObjectsSame(val, value2[index])
      })
      return !differentValueFound
    } else {
      return false
    }
  } else {
    return value1 === value2
  }
}

export function itemListEqualityChecker (value1?: {items: Array<ItemDetails>}, value2?: {items: Array<ItemDetails>}): boolean {
  return arrayEqualityChecker(value1?.items, value2?.items)
}

export function riskEqualityChecker (value1?: AssessmentRisk, value2?: AssessmentRisk): boolean {
  if (value1 && value2) {
    return value1.riskScore?.level === value2.riskScore?.level && value1.assessment === value2.assessment
  } else {
    return value1 === value2
  }
}

export function assessmentExpirationEqualityChecker (value1?: AssessmentExpiration, value2?: AssessmentExpiration): boolean {
  if (value1 && value2) {
    return value1.expiration === value2.expiration && value1.assessment === value2.assessment
  } else {
    return value1 === value2
  }
}
