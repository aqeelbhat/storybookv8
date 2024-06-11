/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { costValidator, multipleSelectValidator, numberValidator, stringValidator } from "../../CustomFormDefinition/View/validator.service";
import { ItemDetails } from "../../Types";
import { ItemType } from "../../Types/common";
import { getI18Text } from "../../i18n";
import { mapCost, mapIDRefToOption } from "../util";

export function lineItemValidator (value: ItemDetails): string {
  if (!value) {
    return getI18Text('--validationMessages--.--fieldRequired--')
  }

  const typeError = stringValidator(value?.type)
  if (typeError) {
    return typeError
  }
  const categoryError = multipleSelectValidator(value?.categories?.map(mapIDRefToOption))
  if (categoryError) {
    return categoryError
  }
  // const descriptionError = stringValidator(value?.description)
  // if (descriptionError) {
  //   return descriptionError
  // }
  const totalPriceError = costValidator(mapCost(value?.totalPrice))
  if (totalPriceError) {
    return totalPriceError
  }
  const quantityError = numberValidator(value?.quantity)
  if ((value?.type === 'goods' as ItemType) && quantityError) {
    return quantityError
  }
}

export function itemListValidator (items: ItemDetails[]): string {
  if (!items || items.length < 1) {
    return getI18Text('--validationMessages--.--fieldRequired--')
  }
  if (items.some(item => lineItemValidator(item))) {
    return getI18Text('--validationMessages--.--fieldMissing--')
  }
}
