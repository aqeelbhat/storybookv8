/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import { Option } from '../../../Types'
import { TaxItem, TaxObject } from '../../../Types/common'
import { ItemListConfig } from '../../../CustomFormDefinition/types/CustomFormModel'

export enum enumTaxFields {
  amount = 'amount',
  taxItem = 'taxItem',
  rate = 'rate',
  code = 'code',
  taxableAmount = 'taxableAmount'
}

export interface TaxProps {
  id?: string
  value?: TaxObject
  allowNegative: boolean
  placeholder?: string
  disabled?: boolean
  disableCurrency?: boolean
  optional?: boolean
  isReadOnly?: boolean
  isFieldReadOnly?: boolean
  locale: string
  getI18Text: (key: string) => string
  forceValidate?: boolean
  itemListConfig?: ItemListConfig
  currencyOptions?: Option[]
  defaultCurrency: string
  userSelectedCurrency?: string
  validator?: (value?: TaxObject) => string | null
  onChange?: (value: TaxObject) => void
  onCurrencyChange?: (currencyCode: string) => void
  onFieldTouch?: () => void
}

export interface TaxItemProps {
  id?: string
  data?: TaxItem
  index?: number
  optional?: boolean
  isReadOnly?: boolean
  isFieldReadOnly?: boolean
  disableCurrency?: boolean
  locale: string
  allowNegative: boolean
  getI18Text: (key: string) => string
  forceValidate?: boolean
  currencyOptions?: Option[]
  defaultCurrency?: string
  userSelectedCurrency?: string
  validator?: (value?) => string | null
  onChange?: (value: TaxItem) => void
  onCurrencyChange?: (currencyCode: string) => void
  onFieldTouch?: () => void
}
