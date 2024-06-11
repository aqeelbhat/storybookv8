/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { ItemDetails, Supplier, Option } from "../../Types"
import { ItemType } from "../../Types/common"
import { IBuyingChannelResponse } from "../ChatGPTV2/types"
import { Cost, Field } from "../types"

export const ORIGINAL_AMOUNT  = 'originalAmount'
export const TOTAL_AMOUNT = 'totalAmount'
export const ITEMS = 'items'

export const ItemTypeOption: Array<Option> = Object.keys(ItemType).map((key) => {
  return {
    id: key,
    displayName: ItemType[key], // will be replace with i18 while used in component
    path: ItemType[key]
  }
})

export interface PaymentItemProps {
  data?: ItemDetails
  basisPoint: number
  categoryOptions: Option[]
  currencyOptions: Option[]
  defaultCurrency: string
  userSelectedCurrency: string
  forceValidate: boolean
  onCurrencyChange: (currencyCode: string) => void
  fetchChildren: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
  searchOptions: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onChange?: (data: ItemDetails) => void
  onCancel?: () => void
  onSave?: (data: ItemDetails) => void
}

export interface PaymentItemListProps {
  data?: ItemDetails[]
  basisPoint: number
  single?: boolean
  categoryOptions: Option[]
  currencyOptions: Option[]
  defaultCurrency: string
  userSelectedCurrency: string
  forceValidate: boolean
  onCurrencyChange: (currencyCode: string) => void
  fetchChildren: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
  searchOptions: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onChange: (data?: ItemDetails[]) => void
}

export interface PaymentProviderConfirmationData {
  chargeToSupplier: boolean
  originalAmount: Cost
  paymentChargeAmount: Cost
  totalAmount: Cost
  items: ItemDetails[]
  buyerChannelDetails: IBuyingChannelResponse
}

export interface PaymentProviderConfirmationProps {
  formData?: PaymentProviderConfirmationData
  fields?: Field[]
  partnerName: string
  partnerEmail: string
  categoryOptions: Option[]
  currencyOptions: Option[]
  defaultCurrency: string
  submitLabel?: string
  cancelLabel?: string
  fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
  searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onSubmit?: (formData: PaymentProviderConfirmationData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => PaymentProviderConfirmationData) => void
  onValueChange?: (fieldName: string, fieldPath: string, updatedForm: PaymentProviderConfirmationData) => void
}
