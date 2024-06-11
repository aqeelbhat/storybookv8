/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import { CustomFormData, CustomFormDefinition, ItemDetailsFields } from "../../CustomFormDefinition"
import { ControlOptions, DataFetchers, Events } from "../../CustomFormDefinition/NewView/FormView.component"
import { ItemListConfig } from "../../CustomFormDefinition/types/CustomFormModel"
import { Attachment, IDRef, ItemDetails, ItemListType, Option, QuestionnaireId, Document, Money, FieldDiffs } from "../../Types"
import { ReactElement } from "react"
import { NAMESPACES_ENUM } from "../../i18n"
import { TFunction } from "i18next"
import { IValidationV2Response } from "../../CustomFormDefinition/View/validator.service"

export enum ItemDetailsSize {
  large = 'large',
  medium = 'narrow',
  small = 'slim'
}
interface ItemCommon {
  item: ItemDetails
  id: string
  parentId?: string
  index: number
  counter: number
  allowNegative: boolean
  counterPrefix: string
  readOnly?: boolean
  visibleFields: Array<ItemDetailsFields>
  mandatoryFields: Array<ItemDetailsFields>
  readonlyFields: Array<ItemDetailsFields>
  customFormDefinition?: CustomFormDefinition | null
  locale: string
  size: ItemDetailsSize
  t: TFunction<NAMESPACES_ENUM | NAMESPACES_ENUM[], undefined>
}
export interface ItemRowProps extends ItemCommon {
  showDetails?: boolean
  oldValue?: ItemDetails
  forceValidate?: boolean
  isNested: boolean
  isExpanded: boolean
  level: number
  isNewItem?: boolean
  disableDelete: boolean
  disableDuplicate: boolean
  disabledAdd: boolean
  itemConfig?: ItemListConfig
  areOptionsAvailableForMasterDataField?: { [fieldName: string]: boolean }
  options?: ControlOptions
  defaultCurrency: string
  maxLevel: number
  children?: ReactElement<ItemFormProps>
  displayFields: Array<ItemDetailsFields>
  prefix: string
  onExpandCollapse:(id:string, isExpanded:boolean)=>void
  onToggleRowDetails: (isShowingDetails: boolean, id: string) => void
  onDuplicate: (originalItem: ItemDetails, parentId?: string) => void
  onDelete: (id: string, parentId?: string) => void
  onAddItem: (id: string) => void
  onAddSection: (id: string) => void
  onFieldChange: (id: string, fieldName: ItemDetailsFields, value: string | number | Money | null) => void
}

export interface ItemFormProps extends ItemCommon {
  fieldName: string
  itemListConfig?: ItemListConfig
  isEdit: boolean
  forceValidate?: boolean
  isItemContextFieldFound?: boolean
  erpItemIdOptions: Option[]
  categoryOptions: Option[]
  departmentOptions: Option[]
  costCenterOptions: Option[]
  accountCodeOptions: Option[]
  currencyOptions?: Option[]
  defaultCurrency: string
  userSelectedCurrency?: string
  disableCurrency?: boolean
  unitPerQuantityOptions?: Option[]
  itemIdOptions?: Option[]
  lineOfBusinessOptions?: Option[]
  trackCodeOptions?: Option[]
  locationOption?: Option[]
  projectOption?: Option[]
  expenseCategoryOption?: Option[]
  purchaseItemOption?: Option[]

  defaultAccountCode?: IDRef
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  options?: ControlOptions
  events?: Events
  dataFetchers?: DataFetchers
  fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
  searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onSave: (id: string, parentId: string, item: ItemDetails, file?: File | Attachment, fileName?: string, filter?: Map<string, string[]>) => void
  onCloseForm: () => void
  getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>
  onCurrencyChange?: (currencyCode: string) => void
  onFieldTouch?: () => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}

export interface IAdditionalOptions {
  erpItemId?: Option[]
  currency?: Option[],
  country?: Option[],
  defaultCurrency?: string,
  category?: Option[],
  departments?: Option[],
  costCenters?: Option[],
  accountCode?: Option[],
  unitPerQuantity?: Option[],
  userSelectedCurrency?: string,
  itemIds?: Option[],
  lineOfBusiness?: Option[],
  defaultAccountCode?: IDRef,
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  trackCode?: Option[],
  locations?: Option[],
  projects?: Option[],
  expenseCategories?: Option[],
  purchaseItems?: Option[],
  documentType?: Option[],
  uom?: Option[],
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  finalisedDocuments?: Array<Document>
  isSingleColumnLayout?: boolean
  canShowTranslation?: boolean
}
interface IConfigDetails {
  isReadOnly?: boolean
  optional?: boolean
  disableCurrency?: boolean
  forceValidate?: boolean
  itemListConfig?: ItemListConfig,
  fieldName?: string
  areOptionsAvailableForMasterDataField?: { [fieldName: string]: boolean }
}
export interface ItemDetailsV2ControlPropsNew {
  locale: string
  value?: ItemListType,
  oldValue?: ItemListType
  name?: string,
  disabled?: boolean,
  readOnly?: boolean,
  allowNegative: boolean
  size?: ItemDetailsSize
  config: IConfigDetails
  additionalOptions: IAdditionalOptions
  dataFetchers: {
    getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>
    getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
    getDoucumentUrlById?: (docId: Document) => Promise<string>,
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    getItemDiffs?: (firstItem: CustomFormData, otherItems: CustomFormData[]) => Promise<FieldDiffs[]>
  }
  events?: Events
  validator?: (value?: { items: Array<ItemDetails> }) => IValidationV2Response
  onChange?: (value: { items: Array<ItemDetails> }, file?: Attachment | File, attachmentName?: string) => void
  onCurrencyChange?: (currencyCode: string) => void
  onItemIdFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}

export type ItemDetailsEmailProps = {
  value?: ItemListType
}
