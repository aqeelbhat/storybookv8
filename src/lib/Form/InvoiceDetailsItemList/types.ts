import { DataFetchers, Events, FieldOptions } from "../../CustomFormDefinition/NewView/FormView.component"
import { IDRef, ItemListType, Money, PurchaseOrder } from "../../Types"
import { Field } from "../types"
import { Option } from './../../Types'

export enum enumInvoiceItemsListFields {
  itemList = "itemList",
  lineItemsRequired = "lineItemsRequired",
  allowNegative = "allowNegative"
}

export interface InvoiceDetailsItemListFormData {
  [enumInvoiceItemsListFields.itemList]: ItemListType
}

export interface InvoiceDetailsItemListProps {
  formData?: InvoiceDetailsItemListFormData
  fields?: Field[]
  defaultCurrency: string
  isReadOnly: boolean
  useItemDetailsV2?: boolean
  disableCurrency?: boolean

  currencyOptions?: Option[]
  categoryOptions?: Option[]
  departmentOptions?: Option[]
  accountCodeOptions?: Option[]
  costCenterOptions?: Option[]
  unitPerQtyOptions?: Option[]
  itemIdOptions?: Option[]
  trackCodeOptions?: Option[]
  lineOfBusinessOptions?: Option[]
  locationOptions?: Option[]
  projectOptions?: Option[]
  expenseCategoryOptions?: Option[]
  purchaseItemOptions?: Option[]
  defaultAccountCode?: IDRef
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  options?: FieldOptions
  events?: Events
  dataFetchers?: DataFetchers
  getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
  onItemIdFilterApply?: (filter: Map<string, string[]>) => Promise<Option[]>

  submitLabel?: string
  cancelLabel?: string
  onSubmit?: (formData: InvoiceDetailsItemListFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => InvoiceDetailsItemListFormData) => void
  onValueChange?: (fieldName: string, updatedForm: InvoiceDetailsItemListFormData) => void

  subTotalMoney?: Money
  invoicePO?: PurchaseOrder
}
