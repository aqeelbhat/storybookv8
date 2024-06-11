import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Copy, Edit2, MoreVertical,PlusCircle,Repeat,Trash2,X } from 'react-feather'
import classnames from 'classnames'

import { ItemListConfig, ItemDetailsFields, CustomFormData, CustomFieldType, CustomFormModelValue } from '../CustomFormDefinition/types/CustomFormModel'
import { Option, QuestionnaireId } from './../Types'
import { Attachment, ItemDetails, ItemType, IDRef, Money, ItemListType, Document, OroMasterDataType, TaxObject, FieldDiffs } from '../Types/common'
import { RichTextControl } from './text.component'
import { mapItemDetails } from '../Types/Mappers/common'
import { OroButton } from './button/button.component'
import { Radio, TextBox, NumberBox, TypeAhead, OROWebsiteInput } from '../Inputs'
import { MoneyControlNew } from './money.component'
import { copyObject, getDateObject, getDateString, isEmpty, isNullable, isNullableOrEmpty, mapIDRefToOption, mapOptionToIDRef, validateDateOrdering } from '../Form/util'
import { DEFAULT_CURRENCY, calculateTotalAmount, getFormattedValue, getItemTotalAmount, getLineItemsTotalPrice, mapCurrencyToSymbol } from '../util'
import { AttachmentsControlNew } from './attachment.component'
import { RichTextEditor } from '../RichTextEditor'
import { AttachmentReadOnly } from '../Form/components/attachment-read-only.component'
import { TaxControl } from './tax.component'
import { attachmentListValidator, lineItemValidator, taxValidator } from '../CustomFormDefinition/View/validator.service'
import { DateControlNew } from './date.component'
import { getValueFromAmount } from '../Inputs/utils.service'
import { OroImage } from '../FilePreview/file-preview.component'
import { Linkify } from '../Linkify'
import { LocalLabels } from '../CustomFormDefinition/types/localization'
import { changeLineItemCurrency } from './services/util.service'
import { ControlOptions, DataFetchers, Events, FormView } from '../CustomFormDefinition/NewView/FormView.component'
import { Cost, DocumentRef } from '../Form'
import { CustomFormDefinition, FormDefinitionReadOnlyView } from '../CustomFormDefinition'
import { CustomFieldView } from '../CustomFormDefinition/types/CustomFormView'
import { ItemDetailsSize, ItemDetailsV2ControlPropsNew } from './itemDetailsV2/types'
import { getI18Text as getI18ControlText, useTranslationHook } from '../i18n'

import style from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { Trans } from 'react-i18next'
import { getSessionLocale, getSessionUseItemDetailsV2 } from '../sessionStorage'
import { ItemDetailsControlV2 } from './itemDetailsV2/Index'
import { CustomFormExtension } from '../CustomFormDefinition/CustomFormExtension/Index'
import { ItemComparisonPopup } from './ItemComparisonPopup'
import { OptionTreeData } from '../MultiLevelSelect/types'

const FieldsToAvoidDuplicate = ['erpItemId', 'lineNumber', 'accumulator.quantityBilled', 'accumulator.quantityReceived']

const ItemTypeOption: Array<Option> = Object.keys(ItemType).map((key) => { return {
  id: key,
  displayName: ItemType[key], // being replaced by component for i18 Locale
  path: ItemType[key]
}})

interface ItemDetailRowProps {
  index: number,
  item: ItemDetails,
  expanded?: boolean
  isNew?: boolean
  oldValue?: ItemDetails
  fieldName?: string
  locale: string
  forceValidate?: boolean
  readOnly?: boolean,
  disableDelete?: boolean,
  disableDuplicate?: boolean,
  visibleFields: Array<ItemDetailsFields>,
  customFormDefinition?: CustomFormDefinition | null
  itemConfig?: ItemListConfig
  areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  options?: ControlOptions
  events?: Events
  dataFetchers?: DataFetchers
  onItemEdit?: (index: number) => void
  onCreateDuplicate?: () => void
  onDeleteClick?: () => void
  getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>

}

interface AddNewItemProps {
  item: ItemDetails
  currentItemIndex: number
  visibleFields: Array<ItemDetailsFields>
  mandetoryFields: Array<ItemDetailsFields>
  readonlyFields: Array<ItemDetailsFields>
  fieldName?: string
  locale: string
  erpItemIdOptions: Option[]
  categoryOptions: Option[]
  departmentOptions: Option[]
  costCenterOptions: Option[]
  accountCodeOptions: Option[]
  currencyOptions?: Option[]
  defaultCurrency?: string
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
  itemListConfig?: ItemListConfig
  isEdit: boolean
  forceValidate?: boolean
  defaultAccountCode?: IDRef
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  options?: ControlOptions
  events?: Events
  dataFetchers?: DataFetchers
  customFormDefinition?: CustomFormDefinition | null
  isItemContextFieldFound?: boolean
  fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
  searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onAddItem?: (item: ItemDetails, file?: File | Attachment, fileName?: string, filter?: Map<string, string[]>) => void
  onCloseForm?: () => void
  validator?: (value?) => string | null
  getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>
  onCurrencyChange?: (currencyCode: string) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}

export interface CustomFormExtensionProps {
  customFormData?: CustomFormData
  currentLineItem?: ItemDetails
  questionnaireId?: QuestionnaireId
  options?: ControlOptions
  customFormDefinition?: CustomFormDefinition
  dataFetchers?: DataFetchers
  events?: Events
  locale: string
  localLabels?: LocalLabels
  readOnly?: boolean
  isEdit?: boolean
  isFormDataList?: boolean
  isItemContextFieldFound?: boolean
  handleFormValueChange?: (formData: CustomFormData | CustomFormData[], file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef, index?: number, fieldName?: string) => void
  onFilterApply?: (filter: Map<string, string[]>, formData: CustomFormData) => void
  onFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number) => void
  onFormDefinitionLoad?: (formId: string, formDefinition: CustomFormDefinition) => void
}

export function AddNewItem (props: AddNewItemProps) {
  const [validateField, setValidateField] = useState<boolean>(false)
  const [endDateTouched, setEndDateTouched] = useState<boolean>(false)
  const [forceValidateDateRange, setForceValidateDateRange] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const CURRENCY = props.defaultCurrency || DEFAULT_CURRENCY
  const DEFAULT_COST = { amount: undefined, currency: CURRENCY }
  const DEFAULT_TAX = {
    amount: DEFAULT_COST,
    items: [{ taxableAmount: DEFAULT_COST }]
  }

  const [name, setName] = useState<string | undefined>()
  const [categoryValue, setCategoryValue] = useState<Option | undefined>()
  const [departmentValue, setDepartmentValue] = useState<Option | undefined>()
  const [costCenter, setCostCenter] = useState<Option | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [quantity, setQuantity] = useState<number | undefined>()
  const [unitValue, setUnitValue] = useState<Option | undefined>()
  const [price, setPrice] = useState<Cost>(DEFAULT_COST)
  const [tax, setTax] = useState<TaxObject | undefined>(DEFAULT_TAX)
  const [totalPrice, setTotalPrice] = useState<Cost>(DEFAULT_COST)
  const [startDate, setStartDate] = useState<string | undefined>()
  const [endDate, setEndDate] = useState<string | undefined>()
  const [accountCodeValue, setAccountCodeValue] = useState<Option | undefined>()
  const [materialId, setMaterialId] = useState<string | undefined>()
  const [itemIdValue, setItemIdValue] = useState<Option | undefined>()
  const [locationValue, setLocationValue] = useState<Option | undefined>()
  const [supplierPartId, setSupplierPartId] = useState<string | undefined>()
  const [manufacturerPartId, setManufacturerPartId] = useState<string | undefined>()
  const [url, setUrl] = useState<string | undefined>()
  const [images, setImages] = useState<Attachment[]>([])
  const [specifications, setSpecifications] = useState<Attachment[]>([])
  const [itemType, setItemType] = useState<Option | undefined>()
  const [lineOfBusinessValue, setLineOfBusinessValue] = useState<Option | undefined>()
  const [trackCodeValue, setTrackCodeValue] = useState<Option | undefined>()
  const [projectValue, setProjectValue] = useState<Option | undefined>()
  const [expenseCategoryValue, setExpenseCategoryValue] = useState<Option | undefined>()
  const [currentLineItem, setCurrentLineItem] = useState<ItemDetails | null>(null)
  const [fetchData, setFetchData] = useState<(skipValidation?: boolean) => CustomFormModelValue>()
  const isItemContextFound = props.isItemContextFieldFound || false

  const { t } = useTranslationHook()

  useEffect(() => {
    if (props.item) {
      if (props.item.type) {
        ItemTypeOption.forEach(option => {
          if (option.id === props.item.type) {
            setItemType(option)
          }
        })
      }
      setName(props.item.name || '')
      if (Array.isArray(props.item.categories) && props.item.categories.length > 0) {
        setCategoryValue(props.item.categories.map(mapIDRefToOption)[0])
      } else {
        setCategoryValue(undefined)
      }
      setCostCenter(props.item.costCenter ? mapIDRefToOption(props.item.costCenter) : undefined)
      setDescription(props.item.description || '')
      setQuantity(props.item?.quantity)
      setUnitValue(props.item.unitForQuantity ? mapIDRefToOption(props.item.unitForQuantity) : undefined)
      setPrice({ amount: props.item.price?.amount?.toString(), currency: props.item.price?.currency || CURRENCY })
      setTax(props.item.tax || DEFAULT_TAX)
      setTotalPrice({ amount: props.item.totalPrice?.amount?.toString(), currency: props.item.totalPrice?.currency || CURRENCY })
      setStartDate(props.item.startDate || '')
      setEndDate(props.item.endDate || '')
      setMaterialId(props.item.materialId || '')
      if (Array.isArray(props.item.itemIds) && props.item.itemIds.length > 0) {
        setItemIdValue(props.item.itemIds.map(mapIDRefToOption)[0])
      } else {
        setItemIdValue(undefined)
      }
      setLineOfBusinessValue(props.item?.lineOfBusiness ? mapIDRefToOption(props.item?.lineOfBusiness) : undefined)
      setProjectValue(props.item?.projectCode ? mapIDRefToOption(props.item?.projectCode) : undefined)
      setSupplierPartId(props.item.supplierPartId || '')
      setManufacturerPartId(props.item.manufacturerPartId || '')
      setExpenseCategoryValue(props.item?.expenseCategory ? mapIDRefToOption(props.item?.expenseCategory) : undefined)
      if (Array.isArray(props.item.trackCode) && props.item.trackCode.length > 0) {
        setTrackCodeValue(props.item.trackCode.map(mapIDRefToOption)[0])
      } else {
        setTrackCodeValue(undefined)
      }
      setUrl(props.item.url || '')
      setImages(props.item.images || [])
      setSpecifications(props.item.specifications || [])

      setCurrentLineItem(props.item)
    }
  }, [props.item])

  // Setting current item context and passed to line item extension form
  function handleLineItemFieldChange (fieldName: string, value: Option | string | number | Cost | TaxObject | Attachment[]) {
    if (isItemContextFound) {
      const _updatedLineItem = currentLineItem ? {...currentLineItem} : props.item ? {...props.item} : getLineItemData()

      switch (fieldName) {
        case ItemDetailsFields.type:
          const _type = value as Option
          _updatedLineItem.type = _type?.id as ItemType || undefined
        break
        case ItemDetailsFields.name:
          _updatedLineItem.name = value as string || ''
        break
        case ItemDetailsFields.categories:
          const _category = value as Option
          _updatedLineItem.categories = _category ? [mapOptionToIDRef(_category)] : []
        break
        case ItemDetailsFields.price:
          const _price = value as Cost
          _updatedLineItem.price = { amount: Number(_price?.amount), currency: _price?.currency }
        break
        case ItemDetailsFields.totalPrice:
          const _total = value as Cost
          _updatedLineItem.totalPrice = { amount: Number(_total?.amount), currency: _total?.currency }
        break
        case ItemDetailsFields.departments:
          const _dept = value as Option
          _updatedLineItem.departments = _dept ? [mapOptionToIDRef(_dept)] : []
        break
        case ItemDetailsFields.costCenter:
          const _costCenter = value as Option
          _updatedLineItem.costCenter = _costCenter ? mapOptionToIDRef(_costCenter) : undefined
        break
        case ItemDetailsFields.unitForQuantity:
          const _unit = value as Option
          _updatedLineItem.unitForQuantity = _unit ? mapOptionToIDRef(_unit) : undefined
        break
        case ItemDetailsFields.accountCode:
          const _account = value as Option
          _updatedLineItem.accountCodeIdRef = _account ? mapOptionToIDRef(_account) : undefined
        break
        case ItemDetailsFields.lineOfBusiness:
          const _lob = value as Option
          _updatedLineItem.lineOfBusiness = _lob ? mapOptionToIDRef(_lob) : undefined
        break
        case ItemDetailsFields.location:
          const _location = value as Option
          _updatedLineItem.location = _location ? mapOptionToIDRef(_location) : undefined
        break
        case ItemDetailsFields.projectCode:
          const _project = value as Option
          _updatedLineItem.projectCode = _project ? mapOptionToIDRef(_project) : undefined
        break
        case ItemDetailsFields.expenseCategory:
          const _expenseCategory = value as Option
          _updatedLineItem.expenseCategory = _expenseCategory ? mapOptionToIDRef(_expenseCategory) : undefined
        break
        case ItemDetailsFields.itemIds:
          const _itemId = value as Option
          _updatedLineItem.departments = _itemId ? [mapOptionToIDRef(_itemId)] : []
        break
        case ItemDetailsFields.trackCode:
          const _trackCodes = value as Option
          _updatedLineItem.trackCode = _trackCodes ? [mapOptionToIDRef(_trackCodes)] : []
        break
        case ItemDetailsFields.description:
          _updatedLineItem.description = value as string
        break
        case ItemDetailsFields.quantity:
          _updatedLineItem.quantity = value as number
        break
        case ItemDetailsFields.startDate:
          _updatedLineItem.startDate = value as string || ''
        break
        case ItemDetailsFields.endDate:
          _updatedLineItem.endDate = value as string || ''
        break
        case ItemDetailsFields.materialId:
          _updatedLineItem.materialId = value as string || ''
        break
        case ItemDetailsFields.manufacturerPartId:
          _updatedLineItem.manufacturerPartId = value as string || ''
        break
        case ItemDetailsFields.supplierPartId:
          _updatedLineItem.supplierPartId = value as string || ''
        break
        case ItemDetailsFields.url:
          _updatedLineItem.url = value as string || ''
        break
        case ItemDetailsFields.images:
          _updatedLineItem.images = value as Array<Attachment>
        break
        case ItemDetailsFields.specifications:
          _updatedLineItem.specifications = value as Array<Attachment>
        break
        case ItemDetailsFields.tax:
          _updatedLineItem.tax = value as TaxObject
        break
      }
      // remove custom form data explicitly as it creates nesting levels inside _current (line item reference)
      delete _updatedLineItem['data']
      setCurrentLineItem(_updatedLineItem)
    }
  }

  function getLineItemData (): ItemDetails {
    return {
      id: props.item?.id,
      lineNumber: props.item?.lineNumber,
      erpItemId: props.item?.erpItemId,
      type: itemType?.id ? itemType.id as ItemType : undefined,
      name,
      categories: categoryValue ? [mapOptionToIDRef(categoryValue)] : [],
      departments: departmentValue ? [mapOptionToIDRef(departmentValue)] : [],
      costCenter: costCenter ? mapOptionToIDRef(costCenter) : undefined,
      description,
      accumulator: props.item?.accumulator,
      quantity,
      unitForQuantity: unitValue ? mapOptionToIDRef(unitValue) : undefined,
      price: { amount: Number(price?.amount), currency: price?.currency },
      tax,
      totalPrice: { amount: Number(totalPrice?.amount), currency: totalPrice?.currency },
      startDate,
      endDate,
      accountCodeIdRef: accountCodeValue ? mapOptionToIDRef(accountCodeValue) : undefined,
      materialId,
      itemIds: itemIdValue ? [mapOptionToIDRef(itemIdValue)] : [],
      lineOfBusiness: lineOfBusinessValue ? mapOptionToIDRef(lineOfBusinessValue) : undefined,
      location: locationValue ? mapOptionToIDRef(locationValue) : undefined,
      projectCode: projectValue ? mapOptionToIDRef(projectValue) : undefined,
      supplierPartId,
      manufacturerPartId,
      expenseCategory: expenseCategoryValue ? mapOptionToIDRef(expenseCategoryValue) : undefined,
      trackCode: trackCodeValue ? [mapOptionToIDRef(trackCodeValue)] : [],
      url,
      images,
      specifications,
      normalizedVendorRef: props.item?.normalizedVendorRef,
      data: props.itemListConfig?.questionnaireId?.formId && fetchData ? fetchData(true) : undefined,
      existing: props.item?.existing
    }
  }

  useEffect(() => {
    if (props.item?.accountCodeIdRef) {
      setAccountCodeValue(mapIDRefToOption(props.item.accountCodeIdRef))
    } else if (props.defaultAccountCode) {
      setAccountCodeValue(mapIDRefToOption(props.defaultAccountCode))
    } else {
      setAccountCodeValue(undefined)
    }
  }, [props.item, props.defaultAccountCode])

  useEffect(() => {
    if (Array.isArray(props.item?.departments) && props.item.departments.length > 0) {
      setDepartmentValue(props.item.departments.map(mapIDRefToOption)[0])
    } else if (props.defaultDepartments?.[0]) {
      setDepartmentValue(mapIDRefToOption(props.defaultDepartments?.[0]))
    } else {
      setDepartmentValue(undefined)
    }
  }, [props.item, props.defaultDepartments])

  useEffect(() => {
    if (props.item?.location) {
      setLocationValue(mapIDRefToOption(props.item.location))
    } else if (props.defaultLocations?.[0]) {
      setLocationValue(mapIDRefToOption(props.defaultLocations?.[0]))
    } else {
      setLocationValue(undefined)
    }
  }, [props.item, props.defaultLocations])

  useEffect(() => {
    // For new line item
    if (!props.item) {
      const newCurrency = props.userSelectedCurrency || props.defaultCurrency
      setPrice({ amount: price.amount, currency: newCurrency })
      setTax(tax
        ? {
            ...tax,
            amount: { amount: tax?.amount?.amount, currency: newCurrency },
            items: tax?.items?.filter(item => !!item)?.map(item => {
              return {
                ...item,
                taxableAmount: { amount: item?.taxableAmount?.amount, currency: newCurrency },
                amount: { amount: item?.amount?.amount, currency: newCurrency }
              }
            })
          }
        : undefined)
      setTotalPrice({ amount: totalPrice.amount, currency: newCurrency })
    }
  }, [props.userSelectedCurrency])

  function isFieldVisible (fieldName: ItemDetailsFields): boolean {
    return props.visibleFields.some(value => value === fieldName)
  }

  function isFieldMandetory (fieldName: ItemDetailsFields): boolean {
    return props.mandetoryFields.some(value => value === fieldName)
  }

  function isFieldReadonly (fieldName: ItemDetailsFields): boolean {
    return props.readonlyFields.some(value => value === fieldName)
  }

  function triggerDateRangeValidation () {
    setForceValidateDateRange(true)
    setTimeout(() => {
      setForceValidateDateRange(false)
    }, 500)
  }
  function validateStartDate (value: string): string {
    triggerDateRangeValidation ()
    return (!isFieldReadonly(ItemDetailsFields.startDate) && isFieldMandetory(ItemDetailsFields.startDate) && !value) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''
  }
  function validateEndDate (value: string): string {
    return (endDateTouched || validateField) && (
        ((!isFieldReadonly(ItemDetailsFields.endDate) && isFieldMandetory(ItemDetailsFields.endDate) && !value) ? getI18ControlText('--validationMessages--.--fieldRequired--') : '') ||
        (startDate && value ? validateDateOrdering(startDate, value) : '')
      )
  }

  function handleOnFormReady (fetchDataFunction) {
    if(fetchDataFunction) {
      setFetchData(() => fetchDataFunction)
    }
  }

  function handleFormValueChange (formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) {
    if (fileName && props.onAddItem) {
      const extensionFieldName = `${props.fieldName}.items[${props.currentItemIndex}].data.${fileName}`
      props.onAddItem({ ...(getLineItemData()), data: formData }, file, extensionFieldName)
    }
  }

  function handleOnFilterApply (filter: Map<string, string[]>, formData: CustomFormData) {
    if (props.onAddItem) {
      props.onAddItem(getLineItemData(), undefined, undefined, filter)
    }
  }

  function onQuantityChange (fieldValue: string) {

    if(isNullableOrEmpty(fieldValue)) {
      setQuantity(undefined)
      return
    }
    setQuantity(Number(getValueFromAmount(fieldValue)))

    // Update total price
    const updatedItem: ItemDetails = {...(getLineItemData()), quantity: Number(getValueFromAmount(fieldValue))}
    const totalPrice = { amount: calculateTotalAmount(updatedItem).toString(), currency: updatedItem?.price?.currency}
    setTotalPrice(totalPrice)
  }

  function onPriceChange (fieldValue: Cost) {
    setPrice(fieldValue)
    handleLineItemFieldChange(ItemDetailsFields.price, fieldValue)
    // Update total price
    const updatedItem: ItemDetails = {...(getLineItemData()), price: { amount: Number(fieldValue?.amount), currency: fieldValue?.currency }}
    const totalPrice = { amount: calculateTotalAmount(updatedItem).toString(), currency: updatedItem?.price?.currency}
    setTotalPrice(totalPrice)
  }

  function onTaxChange (value: TaxObject) {
    setTax(value)
    handleLineItemFieldChange(ItemDetailsFields.tax, value)
    // Update total price
    const updatedItem: ItemDetails = {...(getLineItemData()), tax: value}
    const totalPrice = { amount: calculateTotalAmount(updatedItem).toString(), currency: updatedItem?.price?.currency}
    setTotalPrice(totalPrice)
  }

  function onImagesChange (fieldValue: Array<Attachment | File>, file?: File | Attachment, fileName?: string) {
    setImages(fieldValue)
    handleLineItemFieldChange(ItemDetailsFields.images, fieldValue)
    if (props.onAddItem) {
      const updatedItem: ItemDetails = {...(getLineItemData()), images: fieldValue}
      props.onAddItem(updatedItem, file, fileName)
    }
  }

  function onSpecificationsChange (fieldValue: Array<Attachment | File>, file?: File | Attachment, fileName?: string) {
    setSpecifications(fieldValue)
    handleLineItemFieldChange(ItemDetailsFields.specifications, fieldValue)
    if (props.onAddItem) {
      const updatedItem: ItemDetails = {...(getLineItemData()), specifications: fieldValue}
      props.onAddItem(updatedItem, file, fileName)
    }
  }

  function onAccountCodeChange (fieldValue?: Option) {
    setAccountCodeValue(fieldValue)

    if (fieldValue && props.itemListConfig?.enableAccountCodeFilter) {
      const updatedItem: ItemDetails = {...(getLineItemData()), accountCodeIdRef: fieldValue ? mapOptionToIDRef(fieldValue) : undefined}
      const filterMap = new Map<string, string[]>()
      if (props.onAddItem) {
        fieldValue?.id && filterMap.set('md_AccountCode', [fieldValue?.id])
        props.onAddItem(updatedItem, undefined, undefined, filterMap)
      }
    }
  }

  function showAdditionalInfoSection (): boolean {
    return isFieldVisible(ItemDetailsFields.accountCode) ||
      isFieldVisible(ItemDetailsFields.specifications) ||
      isFieldVisible(ItemDetailsFields.images) ||
      isFieldVisible(ItemDetailsFields.materialId) ||
      isFieldVisible(ItemDetailsFields.supplierPartId) ||
      isFieldVisible(ItemDetailsFields.manufacturerPartId) ||
      isFieldVisible(ItemDetailsFields.url) ||
      isFieldVisible(ItemDetailsFields.itemIds) ||
      isFieldVisible(ItemDetailsFields.lineOfBusiness) ||
      isFieldVisible(ItemDetailsFields.trackCode) ||
      isFieldVisible(ItemDetailsFields.location) ||
      isFieldVisible(ItemDetailsFields.projectCode) ||
      isFieldVisible(ItemDetailsFields.expenseCategory) ||
      showCustomForm()
  }

  function showCustomForm (): boolean {
    return !!(props.itemListConfig?.questionnaireId && props.itemListConfig?.questionnaireId?.formId)
  }

  function getInvalidField (): string {
    let inValidFieldId: string

    // name is always considered as required
    if (!name) {
      inValidFieldId = ItemDetailsFields.name
    }

    !inValidFieldId && props.mandetoryFields.some(field => {
      // Validate only if it is visible
      if (isFieldVisible(field) && !isFieldReadonly(field)) {
        switch (field) {
          case ItemDetailsFields.description:
            if (!description) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.type:
            if (!itemType) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.unitForQuantity:
            if (!unitValue) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.url:
            if (!url) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.materialId:
            if (!materialId) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.manufacturerPartId:
            if (!manufacturerPartId) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.supplierPartId:
            if (!supplierPartId) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.startDate:
            if (!startDate) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.endDate:
            if (!endDate) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.quantity:
            if (isNullableOrEmpty(quantity) || !(!props.item?.accumulator?.quantityReceived || (quantity >= props.item?.accumulator?.quantityReceived))) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.accountCode:
            if (!accountCodeValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.departments:
            if (!departmentValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.costCenter:
            if (!costCenter?.id) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.lineOfBusiness:
            if (!lineOfBusinessValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.location:
            if (!locationValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.projectCode:
            if (!projectValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.expenseCategory:
            if (!expenseCategoryValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.categories:
            if (!categoryValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.specifications:
            if (!specifications || specifications.length < 1) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.images:
            if (!images || images.length < 1) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.itemIds:
            if (!itemIdValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.trackCode:
            if (!trackCodeValue?.path) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.price:
            if (!price?.amount || !price?.currency) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.tax:
            if (!tax?.items?.[0] || !tax?.items?.[0]?.percentage || !tax?.items?.[0]?.taxCode?.id || !tax?.items?.[0]?.taxableAmount?.amount) {
              inValidFieldId = field
            }
            break
        }
      }

      return !!inValidFieldId
    })
    if (!inValidFieldId && startDate && endDate && validateDateOrdering(startDate, endDate)) {
      inValidFieldId = ItemDetailsFields.endDate
    }
    if (!inValidFieldId && props.itemListConfig?.questionnaireId?.formId && !fetchData()) {
      inValidFieldId = `itemDetails_${props.itemListConfig?.questionnaireId?.formId}`
    }

    return inValidFieldId
  }

  function triggerValidations (invalidFieldId: string) {
    setValidateField(true)
    if (invalidFieldId){
      const input = document.getElementById(invalidFieldId)
      if (input?.scrollIntoView) {
        input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      }
    }
  }

  function handleAddItem () {
    const invalidFieldId = getInvalidField()

    if (!invalidFieldId) {
      setError('')
      setValidateField(false)
      if (props.onAddItem) {
        props.onAddItem(getLineItemData())
      }
    } else {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
      triggerValidations(invalidFieldId)
    }
  }

  function closeForm () {
    if (props.onCloseForm) {
      props.onCloseForm()
    }
  }

  function getFormTitle (): string {
    const prefix = props.itemListConfig?.listItemPrefix || getI18ControlText('--fieldTypes--.--itemList--.--item--')
    if (props.isEdit) {
      return getI18ControlText('--fieldTypes--.--itemList--.--editItem--', { prefix })
    } else {
      return getI18ControlText('--fieldTypes--.--itemList--.--addItem--', { prefix })
    }
  }

  function fetchChildren (masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
    if (props.fetchChildren) {
      return props.fetchChildren(parent, childrenLevel, masterDataType)
    } else {
      return Promise.reject('fetchChildren API not available')
    }
  }

  function searchMasterdataOptions (keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
    if (props.searchOptions) {
      return props.searchOptions(keyword, masterDataType)
    } else {
      return Promise.reject('searchOptions API not available')
    }
  }

  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }

  function onLoadExtensionFormDocument (fieldName: string, mediaType: string, fileName: string): Promise<Blob> {
    if (props.dataFetchers?.getDocumentByName) {
      const extensionFieldName = `${props.fieldName}.items[${props.currentItemIndex}].data.${fieldName}`
      return props.dataFetchers?.getDocumentByName(extensionFieldName, mediaType, fileName)
    }
  }

  return (
    <div className={classnames(style.form)}>
      <div className={style.formHeader}>
        <span className={style.formHeaderTitle}>{getFormTitle()}</span>
        <X size={18} color="var(--warm-neutral-shade-300)" onClick={closeForm} cursor="pointer"/>
      </div>

      <div className={classnames(style.formBody, style.col4)}>
        <div className={style.formBodyContainer}>
          {(props.item?.lineNumber?.toString() || props.item?.erpItemId?.name) &&
            <div className={classnames(style.formBodyContainerRow)}>
              <div className={style.formBodyContainerRowUnit}>
                {props.item?.lineNumber?.toString() &&
                  <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.number}>
                    <span className={style.formBodyContainerRowFieldName}>{getI18Text('--lineNumber--')}</span>
                    <div>
                      <TextBox
                        value={props.item?.lineNumber?.toString()}
                        disabled={true}
                      />
                    </div>
                  </div>}

                {props.item?.erpItemId?.name &&
                  <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.itemIds}>
                    <span className={style.formBodyContainerRowFieldName}>{getI18Text('--accountNumber--')}</span>
                    <div>
                      <TextBox
                        value={props.item?.erpItemId?.name}
                        disabled={true}
                      />
                    </div>
                  </div>}
              </div>
            </div>}

          {isFieldVisible(ItemDetailsFields.type) && <div className={classnames(style.formBodyContainerRow, style.col3)} id={ItemDetailsFields.type}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--type--')}</span>
            <Radio
              id='itemDetailsFieldsType'
              name={ItemDetailsFields.type}
              value={itemType}
              disabled={isFieldReadonly(ItemDetailsFields.type)}
              options={ItemTypeOption.map(option => { return { ...option, displayName: getI18Text('--itemType--.' + option.id) || option.displayName }})}
              required={!isFieldReadonly(ItemDetailsFields.type) && isFieldMandetory(ItemDetailsFields.type)}
              forceValidate={validateField && isFieldMandetory(ItemDetailsFields.type)}
              showHorizontal={true}
              validator={(value) => (!isFieldReadonly(ItemDetailsFields.type) && isFieldMandetory(ItemDetailsFields.type) && isEmpty(value))
                ? getI18ControlText('--validationMessages--.--fieldRequired--')
                : ''}
              onChange={(value) => { setItemType(value); handleLineItemFieldChange(ItemDetailsFields.type, value) }}
            />
          </div>}

          <div className={classnames(style.formBodyContainerRow, style.col3)} id={ItemDetailsFields.name} >
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--name--')}</span>
            <div>
              <TextBox
                placeholder={getI18Text('--enterName--')}
                value={name || ''}
                disabled={isFieldReadonly(ItemDetailsFields.name)}
                required={true}
                forceValidate={validateField}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.name) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--') :
                  ''}
                onChange={(value) => { setName(value); handleLineItemFieldChange(ItemDetailsFields.name, value) }}
              />
            </div>
          </div>

          {isFieldVisible(ItemDetailsFields.categories) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.categories}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--category--')}</span>
            <div>
              <TypeAhead
                placeholder={getI18Text('--selectCategory--')}
                value={categoryValue}
                type={OptionTreeData.category}
                showTree={true}
                disabled={isFieldReadonly(ItemDetailsFields.categories)}
                options={props.categoryOptions}
                required={!isFieldReadonly(ItemDetailsFields.categories) && isFieldMandetory(ItemDetailsFields.categories)}
                forceValidate={validateField && isFieldMandetory(ItemDetailsFields.categories)}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Category', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Category')}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.categories) && isFieldMandetory(ItemDetailsFields.categories) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => { setCategoryValue(value); handleLineItemFieldChange(ItemDetailsFields.categories, value) }}
              />
            </div>
          </div>}

          {isFieldVisible(ItemDetailsFields.departments) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.departments}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--department--')}</span>
            <div>
              <TypeAhead
                placeholder={getI18Text('--selectDepartment--')}
                value={departmentValue}
                disabled={isFieldReadonly(ItemDetailsFields.departments)}
                options={props.departmentOptions}
                required={!isFieldReadonly(ItemDetailsFields.departments) && isFieldMandetory(ItemDetailsFields.departments)}
                forceValidate={validateField && isFieldMandetory(ItemDetailsFields.departments)}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Department', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Department')}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.departments) && isFieldMandetory(ItemDetailsFields.departments) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => { setDepartmentValue(value); handleLineItemFieldChange(ItemDetailsFields.departments, value) }}
              />
            </div>
          </div>}

          { isFieldVisible(ItemDetailsFields.costCenter) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.costCenter}>
              <span className={style.formBodyContainerRowFieldName}>{getI18Text('--costCenter--')}</span>
              <div>
                <TypeAhead
                  placeholder={getI18Text('--selectCostCenter--')}
                  value={costCenter}
                  options={props.costCenterOptions}
                  disabled={isFieldReadonly(ItemDetailsFields.costCenter)}
                  required={!isFieldReadonly(ItemDetailsFields.costCenter) && isFieldMandetory(ItemDetailsFields.costCenter)}
                  forceValidate={validateField && isFieldMandetory(ItemDetailsFields.costCenter)}
                  validator={(value) => (!isFieldReadonly(ItemDetailsFields.costCenter) && isFieldMandetory(ItemDetailsFields.costCenter) && isEmpty(value))
                    ? getI18ControlText('--validationMessages--.--fieldRequired--')
                    : ''}
                  onChange={(value) => { setCostCenter(value); handleLineItemFieldChange(ItemDetailsFields.costCenter, value) }}
                />
              </div>
          </div> }

          {isFieldVisible(ItemDetailsFields.description) && <div className={classnames(style.formBodyContainerRow, style.col3, 'itemDetailDescription')} id={ItemDetailsFields.description}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--description--')}</span>
            <div>
              <RichTextControl
                placeholder={getI18Text('--addDescription--')}
                value={description}
                isReadOnly={isFieldReadonly(ItemDetailsFields.description)}
                optional={!isFieldMandetory(ItemDetailsFields.description)}
                forceValidate={validateField && isFieldMandetory(ItemDetailsFields.description)}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.description) && isFieldMandetory(ItemDetailsFields.description) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => { setDescription(value); handleLineItemFieldChange(ItemDetailsFields.description, value) }}
              />
            </div>
          </div>}

          {(!isNullable(props.item?.accumulator?.quantityReceived) || !isNullable(props.item?.accumulator?.quantityBilled)) &&
            <div className={classnames(style.formBodyContainerRow)}>
              <div className={style.formBodyContainerRowUnit}>
                {!isNullable(props.item?.accumulator?.quantityReceived) &&
                  <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.qtyReceived}>
                    <span className={style.formBodyContainerRowFieldName}>{getI18Text('--quantityReceived--')}</span>
                    <div>
                      <TextBox
                        value={props.item?.accumulator?.quantityReceived.toString()}
                        disabled={true}
                      />
                    </div>
                  </div>}

                {!isNullable(props.item?.accumulator?.quantityBilled) &&
                  <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.invoicedQty}>
                    <span className={style.formBodyContainerRowFieldName}>{getI18Text('--quantityInvoiced--')}</span>
                    <div>
                      <TextBox
                        value={props.item?.accumulator?.quantityBilled?.toString()}
                        disabled={true}
                      />
                    </div>
                  </div>}
              </div>
            </div>}

          {(isFieldVisible(ItemDetailsFields.quantity) || isFieldVisible(ItemDetailsFields.unitForQuantity)) && <div className={classnames(style.formBodyContainerRow)}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.quantity) && <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.quantity}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--quantity--')}</span>
                <div>
                  <NumberBox
                    value={!isNullable(quantity) ? quantity.toString() : ''}
                    placeholder={getI18Text('--enterQuantity--')}
                    id={ItemDetailsFields.quantity}
                    decimalLimit={5}
                    disabled={isFieldReadonly(ItemDetailsFields.quantity)}
                    required={!isFieldReadonly(ItemDetailsFields.quantity) && isFieldMandetory(ItemDetailsFields.quantity)}
                    forceValidate={validateField && (isFieldMandetory(ItemDetailsFields.quantity) || !(!props.item?.accumulator?.quantityReceived || (Number(quantity) >= props.item?.accumulator?.quantityReceived)))}
                    validator={(value) => {
                      const validate = (!isFieldReadonly(ItemDetailsFields.quantity) && isFieldMandetory(ItemDetailsFields.quantity) && isNullableOrEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : !(!props.item?.accumulator?.quantityReceived || (Number(getValueFromAmount(value)) >= props.item?.accumulator?.quantityReceived))
                        ? getI18ControlText('--validationMessages--.--cannotBeLessThanInvoicedQuantity--')
                        : ''
                        return validate
                    }}
                    onChange={(value) => { onQuantityChange(value); handleLineItemFieldChange(ItemDetailsFields.quantity, Number(getValueFromAmount(value))) }}
                  />
                </div>
              </div>}

              {isFieldVisible(ItemDetailsFields.unitForQuantity) && <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.unitForQuantity}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--unit--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--unitOfMeasure--')}
                    value={unitValue}
                    disabled={isFieldReadonly(ItemDetailsFields.unitForQuantity)}
                    options={props.unitPerQuantityOptions}
                    required={!isFieldReadonly(ItemDetailsFields.unitForQuantity) && isFieldMandetory(ItemDetailsFields.unitForQuantity)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.unitForQuantity)}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('UnitOfMeasure', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'UnitOfMeasure')}
                    validator={(value) =>  (!isFieldReadonly(ItemDetailsFields.unitForQuantity) && isFieldMandetory(ItemDetailsFields.unitForQuantity) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setUnitValue(value); handleLineItemFieldChange(ItemDetailsFields.unitForQuantity, value) }}
                  />
                </div>
              </div>}
            </div>
          </div>}

          {isFieldVisible(ItemDetailsFields.price) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.price}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--pricePerUnit--')}</span>
            <div>
              <MoneyControlNew
                value={price}
                config={{
                  optional: !isFieldMandetory(ItemDetailsFields.price),
                  isReadOnly: isFieldReadonly(ItemDetailsFields.price),
                  disableCurrency: props.disableCurrency,
                  forceValidate: validateField && isFieldMandetory(ItemDetailsFields.price)
                }}
                locale={props.locale}
                additionalOptions={{
                  currency: props.currencyOptions,
                  defaultCurrency: props.defaultCurrency,
                  userSelectedCurrency: props.userSelectedCurrency
                }}
                disabled={isFieldReadonly(ItemDetailsFields.price)}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.price) && isFieldMandetory(ItemDetailsFields.price) && !value?.amount)
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={onPriceChange}
                onCurrencyChange={props.onCurrencyChange}
              />
            </div>
          </div>}

          {isFieldVisible(ItemDetailsFields.tax) && <div className={classnames(style.formBodyContainerRow, style.col4)} id={ItemDetailsFields.tax}>
            <div>
              <TaxControl
                value={tax}
                currencyOptions={props.currencyOptions}
                itemListConfig ={props.itemListConfig}
                defaultCurrency={price?.currency || (props.item ? (props.defaultCurrency) : (props.userSelectedCurrency || props.defaultCurrency))}
                userSelectedCurrency={props.userSelectedCurrency}
                optional={!isFieldMandetory(ItemDetailsFields.tax)}
                isReadOnly={isFieldReadonly(ItemDetailsFields.tax)}
                disableCurrency={props.disableCurrency}
                forceValidate={validateField && isFieldMandetory(ItemDetailsFields.tax) && !isFieldReadonly(ItemDetailsFields.tax)}
                validator={(value) => taxValidator(value)
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={onTaxChange}
                onCurrencyChange={props.onCurrencyChange}
              />
            </div>
          </div>}

          {isFieldVisible(ItemDetailsFields.totalPrice) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.totalPrice}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--totalAmount--')}</span>
            <div>
              <MoneyControlNew
                value={totalPrice}
                config={{
                  optional: !isFieldMandetory(ItemDetailsFields.totalPrice),
                  isReadOnly: isFieldReadonly(ItemDetailsFields.totalPrice),
                  disableCurrency: props.disableCurrency,
                  forceValidate: validateField && isFieldMandetory(ItemDetailsFields.totalPrice)
                }}
                locale={props.locale}
                additionalOptions={{
                  currency: props.currencyOptions,
                  defaultCurrency: props.defaultCurrency,
                  userSelectedCurrency: props.userSelectedCurrency
                }}
                disabled={isFieldReadonly(ItemDetailsFields.totalPrice)}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.totalPrice) && isFieldMandetory(ItemDetailsFields.totalPrice) && !value?.amount)
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => { setTotalPrice(value); handleLineItemFieldChange(ItemDetailsFields.totalPrice, value) } }
                onCurrencyChange={props.onCurrencyChange}
              />
            </div>
          </div>}

          {(isFieldVisible(ItemDetailsFields.startDate) || isFieldVisible(ItemDetailsFields.endDate)) &&
            <div className={classnames(style.formBodyContainerRow)} id={ItemDetailsFields.startDate}>
              <div className={style.formBodyContainerRowUnit}>
                {isFieldVisible(ItemDetailsFields.startDate) &&
                  <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.startDate}>
                    <span className={style.formBodyContainerRowFieldName}>{getI18Text('--startDate--')}</span>
                    <div>
                      <DateControlNew
                        value={getDateObject(startDate)}
                        config={{
                          isReadOnly: isFieldReadonly(ItemDetailsFields.startDate),
                          optional: false,
                          forceValidate: validateField && isFieldMandetory(ItemDetailsFields.startDate)

                        }}
                        disabled={isFieldReadonly(ItemDetailsFields.startDate)}
                        validator={validateStartDate}
                        onChange={(value) => { setStartDate(value); handleLineItemFieldChange(ItemDetailsFields.startDate, value) }}
                      />
                    </div>
                  </div>}

                {isFieldVisible(ItemDetailsFields.endDate) &&
                  <div className={classnames(style.formBodyContainerRow, style.col1)} id={ItemDetailsFields.endDate}>
                    <span className={style.formBodyContainerRowFieldName}>{getI18Text('--endDate--')}</span>
                    <div>
                      <DateControlNew
                        value={getDateObject(endDate)}
                        config={{
                          isReadOnly: isFieldReadonly(ItemDetailsFields.endDate),
                          optional: false,
                          forceValidate: validateField || forceValidateDateRange
                        }}
                        disabled={isFieldReadonly(ItemDetailsFields.endDate)}
                        validator={validateEndDate}
                        onChange={(value) => {setEndDate(value); setEndDateTouched(true); handleLineItemFieldChange(ItemDetailsFields.endDate, value)}}
                      />
                    </div>
                  </div>}
              </div>
            </div>}
        </div>

        {showAdditionalInfoSection() && <div className={style.formBodyContainer}>
          <div className={style.subTitle}>{getI18Text('--additionalInfo--')}</div>

          { (isFieldVisible(ItemDetailsFields.accountCode) || isFieldVisible(ItemDetailsFields.materialId)) && <div className={classnames(style.formBodyContainerRow)} id={ItemDetailsFields.accountCode}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.accountCode) && <div className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--accountCode--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectAccountCode--')}
                    value={accountCodeValue}
                    options={props.accountCodeOptions}
                    disabled={isFieldReadonly(ItemDetailsFields.accountCode)}
                    required={!isFieldReadonly(ItemDetailsFields.accountCode) && isFieldMandetory(ItemDetailsFields.accountCode)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.accountCode)}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.accountCode) && isFieldMandetory(ItemDetailsFields.accountCode) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { onAccountCodeChange(value); handleLineItemFieldChange(ItemDetailsFields.accountCode, value) }}
                  />
                </div>
              </div>}

              {isFieldVisible(ItemDetailsFields.materialId) && <div id={ItemDetailsFields.materialId} className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--materialId--')}</span>
                <div>
                  <TextBox
                    placeholder={getI18Text('--enterMaterialId--')}
                    value={materialId}
                    disabled={isFieldReadonly(ItemDetailsFields.materialId)}
                    required={!isFieldReadonly(ItemDetailsFields.materialId) && isFieldMandetory(ItemDetailsFields.materialId)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.materialId)}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.materialId) && isFieldMandetory(ItemDetailsFields.materialId) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setMaterialId(value); handleLineItemFieldChange(ItemDetailsFields.materialId, value) }}
                    />
                </div>
              </div>}
            </div>
          </div> }

          { (isFieldVisible(ItemDetailsFields.itemIds) || isFieldVisible(ItemDetailsFields.lineOfBusiness)) && <div className={classnames(style.formBodyContainerRow)} id={ItemDetailsFields.itemIds}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.itemIds) && <div className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--itemIds--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectItemIds--')}
                    value={itemIdValue}
                    options={props.itemIdOptions}
                    disabled={isFieldReadonly(ItemDetailsFields.itemIds)}
                    required={!isFieldReadonly(ItemDetailsFields.itemIds) && isFieldMandetory(ItemDetailsFields.itemIds)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.itemIds)}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('Item', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'Item')}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.itemIds) && isFieldMandetory(ItemDetailsFields.itemIds) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setItemIdValue(value); handleLineItemFieldChange(ItemDetailsFields.itemIds, value) }}
                  />
                </div>
              </div>}

              {isFieldVisible(ItemDetailsFields.lineOfBusiness) && <div id={ItemDetailsFields.lineOfBusiness} className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--businessUnit--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectLineOfBusiness--')}
                    value={lineOfBusinessValue}
                    options={props.lineOfBusinessOptions}
                    disabled={isFieldReadonly(ItemDetailsFields.lineOfBusiness)}
                    required={!isFieldReadonly(ItemDetailsFields.lineOfBusiness) && isFieldMandetory(ItemDetailsFields.lineOfBusiness)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.lineOfBusiness)}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('BusinessUnit', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'BusinessUnit')}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.lineOfBusiness) && isFieldMandetory(ItemDetailsFields.lineOfBusiness) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setLineOfBusinessValue(value); handleLineItemFieldChange(ItemDetailsFields.lineOfBusiness, value) }}
                    />
                </div>
              </div>}

            </div>
          </div> }

          { (isFieldVisible(ItemDetailsFields.location) || isFieldVisible(ItemDetailsFields.projectCode)) && <div className={classnames(style.formBodyContainerRow)} id={ItemDetailsFields.itemIds}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.location) && <div className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--location--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectLocation--')}
                    value={locationValue}
                    options={props.locationOption}
                    disabled={isFieldReadonly(ItemDetailsFields.location)}
                    required={!isFieldReadonly(ItemDetailsFields.location) && isFieldMandetory(ItemDetailsFields.location)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.location)}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.location) && isFieldMandetory(ItemDetailsFields.location) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setLocationValue(value); handleLineItemFieldChange(ItemDetailsFields.location, value) }}
                  />
                </div>
              </div>}

              {isFieldVisible(ItemDetailsFields.projectCode) && <div id={ItemDetailsFields.projectCode} className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--project--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectProject--')}
                    value={projectValue}
                    options={props.projectOption}
                    disabled={isFieldReadonly(ItemDetailsFields.projectCode)}
                    required={!isFieldReadonly(ItemDetailsFields.projectCode) && isFieldMandetory(ItemDetailsFields.projectCode)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.projectCode)}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('Project', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'Project')}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.projectCode) && isFieldMandetory(ItemDetailsFields.projectCode) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setProjectValue(value); handleLineItemFieldChange(ItemDetailsFields.projectCode, value) }}
                    />
                </div>
              </div>}
            </div>
          </div> }

          { (isFieldVisible(ItemDetailsFields.supplierPartId) || isFieldVisible(ItemDetailsFields.manufacturerPartId)) && <div className={classnames(style.formBodyContainerRow)}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.supplierPartId) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.supplierPartId}>
                <span className={(style.formBodyContainerRowFieldName)}>{getI18Text('--supplierPartId--')}</span>
                <div>
                  <TextBox
                    placeholder={getI18Text('--enterSupplierPartId--')}
                    value={supplierPartId}
                    disabled={isFieldReadonly(ItemDetailsFields.supplierPartId)}
                    required={!isFieldReadonly(ItemDetailsFields.supplierPartId) && isFieldMandetory(ItemDetailsFields.supplierPartId)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.supplierPartId)}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.supplierPartId) && isFieldMandetory(ItemDetailsFields.supplierPartId) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setSupplierPartId(value); handleLineItemFieldChange(ItemDetailsFields.supplierPartId, value) }}
                  />
                </div>
              </div>}

              {isFieldVisible(ItemDetailsFields.manufacturerPartId) && <div id={ItemDetailsFields.manufacturerPartId} className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--manufacturerPartId--')}</span>
                <div>
                  <TextBox
                    placeholder={getI18Text('--enterManufacturerPartId--')}
                    value={manufacturerPartId}
                    disabled={isFieldReadonly(ItemDetailsFields.manufacturerPartId)}
                    required={!isFieldReadonly(ItemDetailsFields.manufacturerPartId) && isFieldMandetory(ItemDetailsFields.manufacturerPartId)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.manufacturerPartId)}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.manufacturerPartId) && isFieldMandetory(ItemDetailsFields.manufacturerPartId) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setManufacturerPartId(value); handleLineItemFieldChange(ItemDetailsFields.manufacturerPartId, value) }}
                    />
                </div>
              </div>}
            </div>
          </div> }

          { (isFieldVisible(ItemDetailsFields.trackCode) || isFieldVisible(ItemDetailsFields.expenseCategory)) && <div className={classnames(style.formBodyContainerRow)} id={ItemDetailsFields.itemIds}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.expenseCategory) && <div className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--expenseCategory--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectExpenseCategory--')}
                    value={expenseCategoryValue}
                    options={props.expenseCategoryOption}
                    disabled={isFieldReadonly(ItemDetailsFields.expenseCategory)}
                    required={!isFieldReadonly(ItemDetailsFields.expenseCategory) && isFieldMandetory(ItemDetailsFields.expenseCategory)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.expenseCategory)}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('ExpenseCategory', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'ExpenseCategory')}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.expenseCategory) && isFieldMandetory(ItemDetailsFields.expenseCategory) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setExpenseCategoryValue(value); handleLineItemFieldChange(ItemDetailsFields.expenseCategory, value) }}
                  />
                </div>
              </div>}

              {isFieldVisible(ItemDetailsFields.trackCode) && <div id={ItemDetailsFields.trackCode} className={classnames(style.formBodyContainerRow, style.col2)}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--trackCode--')}</span>
                <div>
                  <TypeAhead
                    placeholder={getI18Text('--selectTrackCode--')}
                    value={trackCodeValue}
                    options={props.trackCodeOptions}
                    disabled={isFieldReadonly(ItemDetailsFields.trackCode)}
                    required={!isFieldReadonly(ItemDetailsFields.trackCode) && isFieldMandetory(ItemDetailsFields.trackCode)}
                    forceValidate={validateField && isFieldMandetory(ItemDetailsFields.trackCode)}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('TrackCode', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'TrackCode')}
                    validator={(value) => (!isFieldReadonly(ItemDetailsFields.trackCode) && isFieldMandetory(ItemDetailsFields.trackCode) && isEmpty(value))
                      ? getI18ControlText('--validationMessages--.--fieldRequired--')
                      : ''}
                    onChange={(value) => { setTrackCodeValue(value); handleLineItemFieldChange(ItemDetailsFields.trackCode, value) }}
                    />
                </div>
              </div>}
            </div>
          </div> }

          {isFieldVisible(ItemDetailsFields.url) && <div className={classnames(style.formBodyContainerRow, style.col2)} id={ItemDetailsFields.url}>
            <span className={style.formBodyContainerRowFieldName}>{getI18Text('--url--')}</span>
            <div>
              <OROWebsiteInput
                value={url}
                placeholder={getI18Text('--addLinkForProduct--')}
                disabled= {isFieldReadonly(ItemDetailsFields.url)}
                required={!isFieldReadonly(ItemDetailsFields.url) && isFieldMandetory(ItemDetailsFields.url)}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.url) && isFieldMandetory(ItemDetailsFields.url) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => { setUrl(value); handleLineItemFieldChange(ItemDetailsFields.url, value) }}
              />
            </div>
          </div>}

          {showCustomForm() && props.customFormDefinition && <div className={classnames(style.formBodyContainer, style.customFormContainer)} id={`itemDetails_${props.itemListConfig?.questionnaireId?.formId}`}>
            <div id="lineItemCustomFormExtension">
              <CustomFormExtension
                locale={props.locale}
                customFormData={props.item?.data}
                currentLineItem={currentLineItem}
                questionnaireId={props.itemListConfig?.questionnaireId}
                options={props.options}
                customFormDefinition={props.customFormDefinition}
                dataFetchers={{...props.dataFetchers, getDocumentByName: onLoadExtensionFormDocument}}
                events={props.events}
                isEdit={props.isEdit}
                isItemContextFieldFound={props.isItemContextFieldFound}
                handleFormValueChange={handleFormValueChange}
                onFilterApply={handleOnFilterApply}
                onFormReady={handleOnFormReady}
                onFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
              />
            </div>
          </div>}

          { isFieldVisible(ItemDetailsFields.images) && <div className={classnames(style.formBodyContainerRow, style.col4)} id={ItemDetailsFields.images}>
            <div className={style.formBodyContainerRowUnit}>
              {isFieldVisible(ItemDetailsFields.images) && <div id={ItemDetailsFields.images} className={style.formBodyContainerRowItem}>
                <span className={style.formBodyContainerRowFieldName}>{getI18Text('--uploadImages--')}</span>
                  <div>
                      <AttachmentsControlNew
                        value={images}
                        config={{
                          isReadOnly: isFieldReadonly(ItemDetailsFields.images),
                          optional: !isFieldMandetory(ItemDetailsFields.images),
                          forceValidate: validateField && isFieldMandetory(ItemDetailsFields.images),
                          fieldName: `${props.fieldName}.items[${props.currentItemIndex}].images`
                        }}
                        disabled={isFieldReadonly(ItemDetailsFields.images)}
                        dataFetchers={{
                          getDocumentByName: props.getDocumentByName
                        }}
                        validator={(value) => !isFieldReadonly(ItemDetailsFields.images) && isFieldMandetory(ItemDetailsFields.images) &&
                          attachmentListValidator(value)}
                        onChange={onImagesChange}
                      />
                  </div>
                </div>}
            </div>
          </div> }

          { isFieldVisible(ItemDetailsFields.specifications) && <div className={classnames(style.formBodyContainerRow, style.col4)} id={ItemDetailsFields.specifications}>
            <div className={style.formBodyContainerRowUnit}>
            {isFieldVisible(ItemDetailsFields.specifications) && <div id={ItemDetailsFields.specifications} className={style.formBodyContainerRowItem}>
                <div className={style.formBodyContainerRowFieldName}>{getI18Text('--uploadSpecifications--')}</div>
                <div className={style.formBodyContainerRowOtherInfo}>{getI18Text('--documentsProductSpecifications--')},</div>
                <div>
                  <AttachmentsControlNew
                    value={specifications}
                    config={{
                      isReadOnly: isFieldReadonly(ItemDetailsFields.specifications),
                      optional: !isFieldMandetory(ItemDetailsFields.specifications),
                      forceValidate: validateField && isFieldMandetory(ItemDetailsFields.specifications),
                      fieldName: `${props.fieldName}.items[${props.currentItemIndex}].specifications`
                    }}
                    disabled={isFieldReadonly(ItemDetailsFields.specifications)}
                    dataFetchers={{
                      getDocumentByName: props.getDocumentByName
                    }}
                    validator={(value) => !isFieldReadonly(ItemDetailsFields.specifications) && isFieldMandetory(ItemDetailsFields.specifications) &&
                      attachmentListValidator(value)}
                    onChange={onSpecificationsChange}
                  />
                </div>
            </div>}
            </div>
          </div> }
        </div>}
      </div>

      <div>
        <OroButton label={ props.isEdit ? getI18Text('--saveChanges--') : t('Add')} type='primary' radiusCurvature={'medium'} onClick={handleAddItem}/>
      </div>
  </div>
  )
}

export function ItemDetailsRow (props: ItemDetailRowProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [itemTotalPrice, setItemTotalPrice] = useState<string>()
  const [oldItemTotalPrice, setOldItemTotalPrice] = useState<string>()
  const [labelValues1, setLabelValues1] = useState<Array<{label: string, value: string}>>([])
  const [labelValues2, setLabelValues2] = useState<Array<{label: string, value: string}>>([])
  const [labelValues3, setLabelValues3] = useState<Array<{label: string, value: string}>>([])
  const [labelValues4, setLabelValues4] = useState<Array<{label: string, value: string}>>([])
  const [labelValues5, setLabelValues5] = useState<Array<{label: string, value: string}>>([])
  const [labelValues6, setLabelValues6] = useState<Array<{label: string, value: string}>>([])
  const [generatedLabelValues1, setGeneratedLabelValues1] = useState<Array<{label: string, value: string}>>([])
  const [generatedLabelValues2, setGeneratedLabelValues2] = useState<Array<{label: string, value: string}>>([])
  const [additionalLabelValues, setAdditionalLabelValues] = useState<Array<{label: string, value: string}>>([])
  const [expanded, setExpanded] = useState<boolean>(true)
  const [error, setError] = useState<string>()
  const { t } = useTranslationHook()

  useEffect(() => {
    setExpanded(!!props.expanded)
  }, [props.expanded])

  useEffect(() => {
    if (props.forceValidate) {
      const err = lineItemValidator(props.item, {
        itemListConfig: props.itemConfig,
        formDefinition: props.customFormDefinition,
        options: props.options,
        areOptionsAvailableForMasterDataField: props.areOptionsAvailableForMasterDataField
      })
      setError(err)
    }
  }, [props.forceValidate])

  function isFieldVisible (fieldName: ItemDetailsFields): boolean {
    return props.visibleFields.find(value => value === fieldName) ? true : false
  }

  function setTotalPrice () {
    setItemTotalPrice(getFormattedValue(getItemTotalAmount(props.item), props.item?.totalPrice?.currency || props.item?.price?.currency, props.locale))
    setOldItemTotalPrice(getFormattedValue(getItemTotalAmount(props.oldValue), props.oldValue?.totalPrice?.currency || props.oldValue?.price?.currency, props.locale))
  }

  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }

  useEffect(() => {
    const labelValueArray1: Array<{label: string, value: string}> = []
    const labelValueArray2: Array<{label: string, value: string}> = []
    const labelValueArray3: Array<{label: string, value: string}> = []
    const labelValueArray4: Array<{label: string, value: string}> = []
    const labelValueArray5: Array<{label: string, value: string}> = []
    const labelValueArray6: Array<{label: string, value: string}> = []
    const additionalLabelValueArray: Array<{label: string, value: string}> = []
    const generatedLabelValuesArray1: Array<{label: string, value: string}> = []
    const generatedLabelValuesArray2: Array<{label: string, value: string}> = []

    if (props.item) {
      setTotalPrice()
    }

    //Primary Label Values
    if (isFieldVisible(ItemDetailsFields.type) && props.item?.type) {
      const _findType = ItemTypeOption.find(ItemType => ItemType.id === props.item?.type)
      labelValueArray1.push({
        label: getI18Text('--type--'),
        value: _findType ? getI18Text('--itemType--.' + _findType.id) : props.item?.type
      })
    }
    if (isFieldVisible(ItemDetailsFields.categories) && getIDRefText(props.item?.categories)) {
      labelValueArray1.push({
        label: getI18Text('--category--'),
        value: getIDRefText(props.item?.categories)
      })
    }
    if (isFieldVisible(ItemDetailsFields.departments) && getIDRefText(props.item?.departments)) {
      labelValueArray1.push({
        label: getI18Text('--department--'),
        value: getIDRefText(props.item?.departments)
      })
    }

    if (isFieldVisible(ItemDetailsFields.costCenter) && props.item?.costCenter) {

      labelValueArray1.push({
        label: getI18Text('--costCenter--'),
        value: props.item?.costCenter?.name
      })
    }

    if (isFieldVisible(ItemDetailsFields.accountCode) && props.item?.accountCodeIdRef) {
      labelValueArray2.push({
        label: getI18Text('--accountCode--'),
        value: props.item?.accountCodeIdRef?.name
      })
    }
    if (isFieldVisible(ItemDetailsFields.materialId) && props.item?.materialId) {
      labelValueArray2.push({
        label: getI18Text('--materialId--'),
        value: props.item?.materialId
      })
    }

    if (isFieldVisible(ItemDetailsFields.manufacturerPartId) && props.item?.manufacturerPartId) {
      labelValueArray3.push({
        label: getI18Text('--manufacturerPartId--'),
        value: props.item?.manufacturerPartId
      })
    }
    if (isFieldVisible(ItemDetailsFields.supplierPartId) && props.item?.supplierPartId) {
      labelValueArray3.push({
        label: getI18Text('--supplierPartId--'),
        value: props.item?.supplierPartId
      })
    }
    if (isFieldVisible(ItemDetailsFields.vendor) && props.item?.normalizedVendorRef) {
      labelValueArray3.push({
        label: getI18Text('--vendorId--'),
        value: props.item?.normalizedVendorRef.id
      })
    }

    if (isFieldVisible(ItemDetailsFields.itemIds) && props.item?.itemIds) {
      labelValueArray4.push({
        label: getI18Text('--itemIds--'),
        value: getIDRefText(props.item?.itemIds)
      })
    }
    if (isFieldVisible(ItemDetailsFields.lineOfBusiness) && props.item?.lineOfBusiness) {
      labelValueArray4.push({
        label: getI18Text('--lineOfBusiness--'),
        value: props.item?.lineOfBusiness?.name
      })
    }

    if (isFieldVisible(ItemDetailsFields.location) && props.item?.location) {
      labelValueArray5.push({
        label: getI18Text('--location--'),
        value: props.item?.location?.name
      })
    }
    if (isFieldVisible(ItemDetailsFields.projectCode) && props.item?.projectCode) {
      labelValueArray5.push({
        label: getI18Text('--project--'),
        value: props.item?.projectCode?.name
      })
    }
    if (isFieldVisible(ItemDetailsFields.expenseCategory) && props.item?.expenseCategory) {
      labelValueArray6.push({
        label: getI18Text('--expenseCategory--'),
        value: props.item?.expenseCategory?.name
      })
    }
    if (isFieldVisible(ItemDetailsFields.trackCode) && props.item?.trackCode) {
      labelValueArray6.push({
        label: getI18Text('--trackCode--'),
        value: getIDRefText(props.item?.trackCode)
      })
    }
    // if (isFieldVisible(ItemDetailsFields.nonInventoryPurchaseItem) && props.item?.nonInventoryPurchaseItem) {
    //   labelValueArray5.push({
    //     label: props.localLabels?.purchaseItem || 'Purchase Item:',
    //     value: props.item?.nonInventoryPurchaseItem?.name
    //   })
    // }

    // Generated Label Values
    if (props.item?.accumulator?.quantityReceived) {
      generatedLabelValuesArray1.push({
        label: getI18Text('--quantityReceived--'),
        value: props.item?.accumulator?.quantityReceived?.toString()
      })
    }
    if (props.item?.accumulator?.quantityBilled) {
      generatedLabelValuesArray1.push({
        label: getI18Text('--quantityInvoiced--'),
        value: props.item?.accumulator?.quantityBilled?.toString()
      })
    }

    if (props.item?.lineNumber?.toString()) {
      generatedLabelValuesArray2.push({
        label: getI18Text('--lineNumber--'),
        value: props.item?.lineNumber?.toString()
      })
    }
    if (props.item?.erpItemId?.name) {
      generatedLabelValuesArray2.push({
        label: getI18Text('--erpItem--'),
        value: props.item?.erpItemId?.name
      })
    }

    //Additonal Label Values
    if (isFieldVisible(ItemDetailsFields.startDate) && props.item?.startDate) {
      additionalLabelValueArray.push({
        label: getI18Text('--startDate--'),
        value: getDateString(props.item?.startDate)
      })
    }
    if (isFieldVisible(ItemDetailsFields.endDate) && props.item?.endDate) {
      additionalLabelValueArray.push({
        label: getI18Text('--endDate--'),
        value: getDateString(props.item?.endDate)
      })
    }

    setLabelValues1(labelValueArray1)
    setLabelValues2(labelValueArray2)
    setLabelValues3(labelValueArray3)
    setLabelValues4(labelValueArray4)
    setLabelValues5(labelValueArray5)
    setLabelValues6(labelValueArray6)
    setGeneratedLabelValues1(generatedLabelValuesArray1)
    setGeneratedLabelValues2(generatedLabelValuesArray2)
    setAdditionalLabelValues(additionalLabelValueArray)
  }, [props.item, props.visibleFields])

  function onItemEditClick (e) {
    e.stopPropagation()
    setIsPopoverOpen(false)
    if (typeof props.onItemEdit === 'function') {
      props.onItemEdit(props.index)
    }
  }


  function onItemDuplicateClick (e) {
    if (props.onCreateDuplicate) {
      props.onCreateDuplicate()
    }
  }


  function onItemDeleteClick (e) {
    e.stopPropagation()
    if (props.onDeleteClick) {
      props.onDeleteClick()
    }
  }

  function onPopoverToggle (e) {
    e.stopPropagation()
    setIsPopoverOpen(!isPopoverOpen)
  }

  function hidePopover (e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setIsPopoverOpen(false)
  }

  function getIDRefText (values: Array<IDRef>) {
    const text = ''
    if (Array.isArray(values)) {
      return values.map(e => e.name).join(', ')
    }
    return text
  }

  function toggleAdditionalInfo (e, index: number) {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  function getFileForPreview (fieldName, mediaType, fileName): Promise<Blob> {
    if (props.getDocumentByName) {
      return props.getDocumentByName(fieldName, mediaType, fileName)
    } else {
      return Promise.reject()
    }
  }

  function canShowCustomForm (): boolean {
    return !!(props.itemConfig?.questionnaireId && props.itemConfig?.questionnaireId?.formId)
  }

  function onLoadDocument (fieldName: string, mediaType: string, fileName: string): Promise<Blob> {
    if (props.dataFetchers?.getDocumentByName) {
      const extensionFieldName = `${props.fieldName}.items[${props.index}].data.${fieldName}`
      return props.dataFetchers?.getDocumentByName(extensionFieldName, mediaType, fileName)
    }
  }

  return (<div className={classnames(style.itemDetailsBodyRow, {[style.invalid]: error})} key={props.index} onClick={(e) => toggleAdditionalInfo(e, props.index)}>
    <div className={style.Container}>
      <div className={style.subContainer}>
        <div className={style.briefDetails}>
          <div className={style.briefDetailsExpnd} data-testid={`line-item-${props.index}-expand-btn`}>
            {expanded
              ? <ChevronDown size={18} color={'var(--warm-neutral-shade-200)'} />
              : <ChevronRight size={18} color={'var(--warm-neutral-shade-200)'} />}
          </div>

          <div className={`${style.briefDetailsName} ${props.readOnly ? style.briefDetailsNameReadOnly : ''}`}>
            { props.item?.name &&
              <div className={style.briefDetailsNameText} data-test-id="itemDetails-name">
                {props.isNew &&
                  <span className={style.newLineTag}>{getI18Text('--new--')}</span>}{props.item?.name}
              </div>}
            { props.item?.description && isFieldVisible(ItemDetailsFields.description) &&
              <div className={style.briefDetailsNameDescriptionText} data-test-id="itemDetails-description">
                <RichTextEditor className='oro-rich-text-question-readonly' value={props.item?.description || '-'} readOnly={true} hideToolbar={true} />
              </div>}
          </div>

          <div className={style.briefDetailsOtherInfo}>
            {((isFieldVisible(ItemDetailsFields.quantity)) && isFieldVisible(ItemDetailsFields.unitForQuantity)) &&
              <div className={style.itemDetailsBodyRowCol} data-test-id="itemDetails-quantity-unit">
                {!isNullable(props.item?.quantity) ? <div>{Number(props.item?.quantity).toLocaleString(props.locale)} {props.item?.unitForQuantity?.name}</div> : <div>-</div>}
                {props.oldValue && (props.item?.quantity !== props.oldValue?.quantity || props.item?.unitForQuantity?.name !== props.oldValue?.unitForQuantity?.name) &&
                  <div className={style.previousValue}>{Number(props.oldValue?.quantity).toLocaleString(props.locale)} {props.oldValue?.unitForQuantity?.name}</div>}
              </div>}
            {((isFieldVisible(ItemDetailsFields.quantity)) && !isFieldVisible(ItemDetailsFields.unitForQuantity)) &&
              <div className={style.itemDetailsBodyRowCol} data-test-id="itemDetails-quantity">
                {!isNullable(props.item?.quantity) ? <div>{Number(props.item?.quantity).toLocaleString(props.locale)}</div> : <div>-</div>}
                {props.oldValue && (props.item?.quantity !== props.oldValue?.quantity) &&
                  <div className={style.previousValue}>{Number(props.oldValue?.quantity).toLocaleString(props.locale)}</div>}
              </div>}


            {(isFieldVisible(ItemDetailsFields.price)) &&
              <div className={style.itemDetailsBodyRowCol} data-test-id="itemDetails-price">
               {props.item?.price?.amount ? <div>{props.item?.price && mapCurrencyToSymbol(props.item.price.currency)} {props.item?.price && Number(props.item.price.amount).toLocaleString(props.locale)}</div> : <div>-</div>}
                {props.oldValue && (props.item?.price?.amount !== props.oldValue?.price?.amount || props.item?.price?.currency !== props.oldValue?.price?.currency) &&
                  <div className={style.previousValue}>{props.oldValue?.price && mapCurrencyToSymbol(props.oldValue.price.currency)} {props.oldValue?.price && Number(props.oldValue.price.amount).toLocaleString(props.locale)}</div>}
              </div>}

            {(isFieldVisible(ItemDetailsFields.tax)) &&
              <div className={style.itemDetailsBodyRowCol} data-test-id="itemDetails-tax">
                {props.item?.tax?.items?.[0] && mapCurrencyToSymbol(props.item.tax.items[0].taxableAmount?.currency || DEFAULT_CURRENCY)}
                {props.item?.tax?.items?.[0] && Number(props.item.tax.items[0]?.taxableAmount?.amount || 0).toLocaleString(props.locale)}
                {props.item?.tax?.items?.[0] && <span className={style.taxpercent}>{' ('+Number(props.item.tax.items[0].percentage || 0).toLocaleString(props.locale)+'%)'}</span>}
              </div>}

            {(isFieldVisible(ItemDetailsFields.totalPrice)) &&
              <div className={style.itemDetailsBodyRowCol} data-test-id="itemDetails-total-price">
                <div>{itemTotalPrice}</div>
                {props.oldValue && (oldItemTotalPrice !== itemTotalPrice) &&
                  <div className={style.previousValue}>{oldItemTotalPrice}</div>}
              </div>}

            { !props.readOnly &&
              <div className={ classnames(style.briefDetailsAction, {[style.noAction]: props.disableDelete && props.disableDuplicate })}>
                <Edit2 size={18} color="var(--warm-neutral-shade-200)" cursor="pointer" onClick={onItemEditClick} data-testid={`line-item-${props.index}-edit-btn`} />
                {(!props.disableDelete || !props.disableDuplicate) &&
                  <>
                    <MoreVertical size={18} color="var(--warm-neutral-shade-200)" cursor="pointer" onClick={onPopoverToggle} data-testid={`line-item-${props.index}-more-btn`} />
                    { isPopoverOpen &&
                      <div className={style.briefDetailsActionPopoverContainer}>
                          <ul className={style.briefDetailsActionList}>
                          {!props.disableDuplicate && <li className={style.briefDetailsActionListItem} onClick={(e) => { onItemDuplicateClick(e); hidePopover(e as any); }} data-testid={`line-item-${props.index}-delete-btn`}>
                              <Copy size={18} color="var(--warm-neutral-shade-200)"/>
                              <span>{getI18Text('--duplicate--')}</span>
                            </li>}

                            {!props.disableDelete && <li className={style.briefDetailsActionListItem} onClick={(e) => { onItemDeleteClick(e); hidePopover(e as any); }} data-testid={`line-item-${props.index}-delete-btn`}>
                              <Trash2 size={18} color="var(--warm-neutral-shade-200)"/>
                              <span>{getI18Text('--delete--')}</span>
                            </li>}
                          </ul>
                      </div>}
                    </>}
                { isPopoverOpen && <div className={`${style.briefDetailsActionPopoverBackdrop}`} onClick={hidePopover}></div> }
              </div>}
          </div>
        </div>

        {expanded && (
          additionalLabelValues.length > 0 ||
          labelValues1.length > 0 || labelValues2.length > 0 || labelValues3.length > 0 || labelValues4.length > 0 || labelValues5.length > 0 || labelValues6.length > 0 ||
          generatedLabelValues1.length > 0 || generatedLabelValues2.length > 0 ||
          (props.item?.url && (props.readOnly || isFieldVisible(ItemDetailsFields.url))) ||
          (props.item?.specifications && props.item?.specifications?.length > 0 && (props.readOnly || isFieldVisible(ItemDetailsFields.specifications))) ||
          (props.item?.images && props.item?.images?.length > 0 && (props.readOnly || isFieldVisible(ItemDetailsFields.images))) ||
          canShowCustomForm()
        ) &&
          <div className={style.additionalInfo}>
            { generatedLabelValues1.length > 0 &&
              <div className={classnames(style.briefDetailsNameOtherDetails)} data-test-id="itemDetails-generatedLabelValues1">
                { generatedLabelValues1.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < generatedLabelValues1.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}
            { generatedLabelValues2.length > 0 &&
              <div className={classnames(style.briefDetailsNameOtherDetails)} data-test-id="itemDetails-generatedLabelValues2">
                { generatedLabelValues2.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < generatedLabelValues2.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}

            { labelValues1.length > 0 &&
              <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-labelValues1">
                { labelValues1.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < labelValues1.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}
            { labelValues2.length > 0 &&
              <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-labelValues2">
                { labelValues2.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < labelValues2.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}
            { labelValues4.length > 0 &&
              <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-labelValues3">
                { labelValues4.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < labelValues4.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}
            { labelValues3.length > 0 &&
              <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-labelValues3">
                { labelValues3.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < labelValues3.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}

            { labelValues5.length > 0 &&
              <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-labelValues5">
                { labelValues5.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < labelValues5.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}

            { labelValues6.length > 0 &&
              <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-labelValues6">
                { labelValues6.map((labelValue: {label: string, value: string}, index: number) =>
                  <div className={style.field} key={index}>
                    <div className={style.fieldLabel}>{labelValue.label}:</div>
                    <div className={style.fieldValue}>{labelValue.value}</div>
                    { index < labelValues6.length - 1 && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                  </div>)}
              </div>}

            { additionalLabelValues.length > 0 &&
              <div className={style.additionalInfoContainer}>
                <div className={style.briefDetailsNameOtherDetails} data-test-id="itemDetails-additionalLabelValues">
                  { additionalLabelValues.map((labelValue: {label: string, value: string}, index: number) =>
                    <div className={style.field} key={index}>
                      <div className={style.fieldLabel}>{labelValue.label}:</div>
                      <div className={style.fieldValue}>{labelValue.value}</div>
                      { (index < additionalLabelValues.length - 1) && <div className={style.briefDetailsNameOtherDetailsSeprator}></div> }
                    </div>)}
                </div>
              </div>}

            {props.item?.url && (props.readOnly || isFieldVisible(ItemDetailsFields.url)) &&
              <div className={style.additionalInfoUrl} onClick={e => e.stopPropagation()}>
                <Linkify>{encodeURI(props.item?.url)}</Linkify>
              </div>}

            {(props.readOnly || isFieldVisible(ItemDetailsFields.specifications)) && props.item?.specifications && props.item?.specifications?.length > 0 &&
              <div className={style.additionalInfoSpecifications}>
                {props.item?.specifications && props.item?.specifications?.length > 0 && props.item?.specifications.map((file, index) =>
                  <AttachmentReadOnly
                    attachment={file}
                    key={`spec_${index}`}
                    onPreview={() => getFileForPreview(`${props.fieldName}.items[${props.index}].specifications[${index}]`, file.mediatype, file.filename || file.name)}
                  />
                )}
              </div>}

            {(props.readOnly || isFieldVisible(ItemDetailsFields.images)) && props.item?.images && props.item?.images?.length > 0 &&
              <div className={style.additionalInfoimages}>
                {props.item?.images && props.item?.images?.length > 0 && props.item?.images?.map((file, index) => {
                  return <div className={style.additionalInfoimagesContainer} key={`image_${index}`}>
                    <OroImage file={file} onLoad={() => getFileForPreview(`${props.fieldName}.items[${props.index}].images[${index}]`, file.mediatype, file.filename || file.name)} />
                  </div>
                })}
              </div>}

            {props.customFormDefinition &&
              <div id="lineItemCustomFormExtension" className={style.additionalInfoCustomForm}>
                <FormDefinitionReadOnlyView
                  locale={props.locale}
                  formDefinition={props.customFormDefinition}
                  formData={props.item?.data}
                  loadDocument={onLoadDocument}
                  loadCustomerDocument={props.events?.loadCustomerDocument}
                  documentType={props.options?.documentType}
                  draftDocuments={props.options?.draftDocuments}
                  signedDocuments={props.options?.signedDocuments}
                  finalisedDocuments={props.options?.finalisedDocuments}
                  getDoucumentByUrl={props.dataFetchers?.getDoucumentByUrl}
                  getDoucumentUrlById={props.dataFetchers?.getDoucumentUrlById}
                  triggerLegalDocumentFetch={props.events?.triggerLegalDocumentFetch}
                  options={props.options}
                  isSingleColumnLayout={props.options?.isSingleColumnLayout || false}
                  canShowTranslation={props.options?.canShowTranslation || undefined}
                  fetchExtensionCustomFormDefinition={props.events?.fetchExtensionCustomFormDefinition}
                  fetchExtensionCustomFormLocalLabels={props.events?.fetchExtensionCustomFormLocalLabels}
                />
              </div>}
          </div>}
      </div>
    </div>
  </div>)
}

interface ItemDetailsControlPropsNew {
  value?: ItemListType,
  oldValue?: ItemListType
  name?: string,
  disabled?: boolean,
  readOnly?: boolean,
  size?: ItemDetailsSize
  config: {
    isReadOnly?: boolean
    optional?: boolean
    disableCurrency?: boolean
    forceValidate?: boolean
    itemListConfig?: ItemListConfig,
    fieldName?: string
    areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  }
  additionalOptions: {
    erpItemId?: Option[]
    currency?: Option[],
    country?: Option[],
    defaultCurrency?: string,
    category?: Option[],
    departments?:Option[],
    costCenters?:Option[],
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
  validator?: (value?: {items: Array<ItemDetails>}) => string | null
  onChange?: (value: {items: Array<ItemDetails>}, file?: Attachment | File, attachmentName?: string) => void
  onCurrencyChange?: (currencyCode: string) => void
  onItemIdFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}

function ItemDetailsControl(props: ItemDetailsControlPropsNew) {
  const [itemList, setItemList] = useState<Array<ItemDetails>>([])
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<string>()
  const [currentEditItemIndex, setCurrentEditItemIndex] = useState<number>(-1)
  const [showItemDetailsForm, setShowItemDetailsForm] = useState(false)
  const [enableAccountCodeFilter, setEnableAccountCodeFilter] = useState(false)
  const [compare, setCompare] = useState<boolean>(false)

  const [categories, setCategories] = useState<Array<Option>>([])
  const [departments, setDepartments] = useState<Array<Option>>([])
  const [accountCode, setAccountCode] = useState<Array<Option>>([])
  const [itemIdOptions, setItemIdOption] = useState<Array<Option>>([])
  const [lineOfBusinessOption, setLineOfBusinessOption] = useState<Array<Option>>([])
  const [locationOption, setLocationOption] = useState<Array<Option>>([])
  const [projectOption, setProjectOption] = useState<Array<Option>>([])
  const [expenseCategoryOption, setExpenseCategoryOption] = useState<Array<Option>>([])
  const [purchaseItemOptions, setPurchaseItemOption] = useState<Array<Option>>([])
  const [visibleFields, setVisibleFields] = useState<Array<ItemDetailsFields>>([])
  const [readonlyFields, setReadonlyFields] = useState<Array<ItemDetailsFields>>([])
  const [mandetoryFields, setMandetoryFields] = useState<Array<ItemDetailsFields>>([])
  const [unitPerQuantityOptions, setUnitPerQuantityOptions] = useState<Array<Option>>([])
  const [trackCodeOptions, setTrackCodeOptions] = useState<Array<Option>>([])
  const [costCenters, setCostCenters] = useState<Array<Option>>([])

  const [totalOfItemsList, setTotalOfItemsList] = useState<Money>()
  const [error, setError] = useState<string>()

  const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)
  const [isItemContextFieldFound, setIsItemContextFieldFound] = useState<boolean>(false)

  const { t } = useTranslationHook()
  const prefix = props.config?.itemListConfig?.listItemPrefix || getI18ControlText('--fieldTypes--.--itemList--.--item--')

  useEffect(() => {
    if (props.config?.itemListConfig) {
      if (Array.isArray(props.config.itemListConfig?.visibleFields)) {
        setVisibleFields(props.config.itemListConfig?.visibleFields)
      }

      if (Array.isArray(props.config.itemListConfig?.mandatoryFields)) {
        setMandetoryFields(props.config.itemListConfig?.mandatoryFields)
      }

      if (Array.isArray(props.config.itemListConfig?.readonlyFields)) {
        setReadonlyFields(props.config.itemListConfig?.readonlyFields)
      }

      setEnableAccountCodeFilter(props.config.itemListConfig?.enableAccountCodeFilter || false)
    }

    if (props.config?.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator({items: itemList}))
    }
  }, [props.config])

  function isFieldHidden (field: CustomFieldView): boolean {
    return field.field.isHidden
  }

  function fetchCustomFormDefinition (id: string) {
    if (props.events?.fetchExtensionCustomFormDefinition) {
      props.events?.fetchExtensionCustomFormDefinition(id)
        .then(resp => {
          setCustomFormDefinition(resp)
          // check if hidden item field exists in form definition
          if (resp) {
            resp.view?.sections?.forEach(section => {
              section?.grids?.forEach(grid => {
                grid?.fields?.filter(isFieldHidden)?.forEach(field => {
                  if (field && field.field?.customFieldType === CustomFieldType.item) {
                    setIsItemContextFieldFound(true)
                  } else {
                    setIsItemContextFieldFound(false)
                  }
                })
              })
            })
          }
        })
        .catch(err => console.log('Item Details: Error in fetching custom form definition', err))
    }
  }

  useEffect(() => {
    if (props.config?.itemListConfig?.questionnaireId?.formId) {
      fetchCustomFormDefinition(props.config?.itemListConfig?.questionnaireId?.formId)
    }
  }, [props.config?.itemListConfig?.questionnaireId])

  function calculateTotalPrice (items: Array<ItemDetails>) {
    setTotalOfItemsList(getLineItemsTotalPrice(items))
  }

  useEffect(() => {
    if (props.value && Array.isArray(props.value.items)) {
      const items: Array<ItemDetails> = props.value.items.map(mapItemDetails)
      setItemList(items)
    }
  }, [props.value])

  useEffect(() => {
    calculateTotalPrice(itemList)
  }, [itemList])

  useEffect(() => {
    setUserSelectedCurrency(props.additionalOptions?.userSelectedCurrency)
    if (itemList && props.additionalOptions?.userSelectedCurrency) {
      setItemList(itemList.map(lineItem => changeLineItemCurrency(lineItem, props.additionalOptions?.userSelectedCurrency)))
    }
  }, [props.additionalOptions?.userSelectedCurrency])

  function onUpdatedList (updatedList: Array<ItemDetails>, file?: File | Attachment, fileName?: string, filter?: Map<string, string[]>) {
    setItemList(updatedList)

    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator({items: updatedList}))
    }

    if (!filter) {
      if (props.onChange) {
        props.onChange({items: updatedList}, file, fileName)
      }
    } else {
      props.onItemIdFilterApply && props.onItemIdFilterApply(filter)
    }
  }

  function handleAddItem (item: ItemDetails, file?: File, fileName?: string, filter?: Map<string, string[]>) {
    const updatedList =  itemList ? [...itemList, item] : [item]
    onUpdatedList(updatedList, file, fileName, filter)
    setShowItemDetailsForm(false)

    // If 'fileName' present, it means, file uploaded/deleted in new item
    // In this case, we partially submit the form
    // To offer seamless experience, immediately it open for edit
    if (fileName || (filter && filter.size > 0)) {
      setCurrentEditItemIndex(updatedList.length - 1)
    }
  }


  function handleEditItem (index: number, item: ItemDetails, file?: File | Attachment, fileName?: string, filter?: Map<string, string[]>) {
    if (!fileName && !filter) {
      setCurrentEditItemIndex(-1)
    }

    const updatedList = itemList.map((itemElm, indexElm) => indexElm === index ? item : itemElm)
    onUpdatedList(updatedList, file, fileName, filter)
  }

  function handleCurrencyChange (currencyCode: string) {
    setUserSelectedCurrency(currencyCode)

    if (props.onCurrencyChange) {
      props.onCurrencyChange(currencyCode)
    }

    setItemList(itemList.map(lineItem => changeLineItemCurrency(lineItem, currencyCode)))
  }

  useEffect(() => {
    if (props.additionalOptions?.category) {
      setCategories(props.additionalOptions.category)
    }

    if (props.additionalOptions?.departments) {
      setDepartments(props.additionalOptions.departments)
    }
    if (props.additionalOptions?.costCenters) {
      setCostCenters(props.additionalOptions.costCenters)
    }

    if (props.additionalOptions?.accountCode) {
      setAccountCode(props.additionalOptions.accountCode)
    }

    if (props.additionalOptions?.unitPerQuantity) {
      setUnitPerQuantityOptions(props.additionalOptions.unitPerQuantity)
    }

    if(props.additionalOptions?.itemIds) {
      setItemIdOption(props.additionalOptions?.itemIds)
    }

    if(props.additionalOptions?.lineOfBusiness) {
      setLineOfBusinessOption(props.additionalOptions?.lineOfBusiness)
    }

    if(props.additionalOptions?.trackCode) {
      setTrackCodeOptions(props.additionalOptions?.trackCode)
    }

    if(props.additionalOptions?.locations) {
      setLocationOption(props.additionalOptions?.locations)
    }

    if(props.additionalOptions?.projects) {
      setProjectOption(props.additionalOptions?.projects)
    }

    if(props.additionalOptions?.expenseCategories) {
      setExpenseCategoryOption(props.additionalOptions?.expenseCategories)
    }

    if(props.additionalOptions?.purchaseItems) {
      setPurchaseItemOption(props.additionalOptions?.purchaseItems)
    }
  }, [props.additionalOptions])

  function handleShowItemDetailForm () {
    setShowItemDetailsForm(true)
  }

  function onItemEdit (index: number) {
    const selectedItem = itemList[index]
    if (selectedItem?.accountCodeIdRef && selectedItem?.accountCodeIdRef?.id && props.config?.itemListConfig?.enableAccountCodeFilter) {
      const fiterMap = new Map<string, string[]>()
      fiterMap.set('md_AccountCode', [selectedItem.accountCodeIdRef?.id])
      if (props.onItemIdFilterApply) {
        props.onItemIdFilterApply(fiterMap)
      }
      setCurrentEditItemIndex(index)
    } else {
      setCurrentEditItemIndex(index)
    }
  }

  function deleteItem (index: number) {
    const itemListCopy = [...itemList]
    itemListCopy.splice(index, 1)
    setItemList(itemListCopy)

    if (props.onChange) {
      props.onChange({ items: itemListCopy })
    }

    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator({items: itemListCopy}))
    }
  }

  function isFieldVisible (fieldName: ItemDetailsFields): boolean {
    return visibleFields.find(value => value === fieldName) ? true : false
  }

  function closeAddNewItemForm () {
    setShowItemDetailsForm(false)
  }

  function onCreateDuplicate (item: ItemDetails) {
    const allItemsNames = itemList.map(item => item.name);
    let newName = item.name;
    let count = 1;
    // generate new name
    while (allItemsNames.includes(newName)) {
      newName = `${item.name}(${count})`;
      count++;
    }
    const _copy = copyObject(item, {newName, excludeKeys: FieldsToAvoidDuplicate})
    handleAddItem(_copy)
  }

  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }

  const disabledAdd = props.config?.itemListConfig?.disableAdd
  const disableDelete = props.config?.itemListConfig?.disableDelete
  const disableDuplicate = disabledAdd

  return (
    <div className={style.itemDetails}>
      {!props.readOnly && (!itemList || itemList.length < 1) && !showItemDetailsForm &&
        <div className={style.itemDetailsEmptyBody}>
          <span>
            <Trans t={t} i18nKey="--fieldTypes--.--itemList--.--noItemsAdded--" values={{ prefix: prefix, buttonName: getI18ControlText('--fieldTypes--.--itemList--.--addItem--', { prefix }) }}>
              {`No `}
              <span>{prefix}</span>
              {`s added yet. Click on `}
              <span className={style.link}>+ {getI18ControlText('--fieldTypes--.--itemList--.--addItem--', { prefix })}</span>
              {` to get started`}
            </Trans>
          </span>
        </div>}

      {itemList && itemList?.length > 0 && <>
        <div className={style.itemDetailsHeader}>
          <span className={`${style.itemDetailsHeaderCol} ${style.itemDetailsHeaderColExpnd}`}></span>
          <div className={style.itemDetailsHeaderName}>{prefix}</div>
          <div className={style.itemDetailsHeaderOtherInfo}>
            {((isFieldVisible(ItemDetailsFields.quantity) && isFieldVisible(ItemDetailsFields.unitForQuantity))) &&  <span className={style.itemDetailsHeaderCol}>{getI18Text('--qtyUnit--')}</span>}
            {((isFieldVisible(ItemDetailsFields.quantity) && !isFieldVisible(ItemDetailsFields.unitForQuantity))) && <span className={style.itemDetailsHeaderCol}>{getI18Text('--qty--')}</span>}
            {(isFieldVisible(ItemDetailsFields.price)) && <span className={style.itemDetailsHeaderCol}>{getI18Text('--price--')}</span>}
            {(isFieldVisible(ItemDetailsFields.tax)) && <span className={style.itemDetailsHeaderCol}>{getI18Text('--tax--')}</span>}
            {(isFieldVisible(ItemDetailsFields.totalPrice)) && <span className={style.itemDetailsHeaderCol}>{getI18Text('--amount--')}</span>}
            {!props.readOnly && <span className={classnames(style.itemDetailsHeaderCol, {[style.itemDetailsHeaderColAction]: !disableDelete || !disableDuplicate, [style.noAction]: disableDelete && disableDuplicate})}></span>}
            {props.readOnly && props.config?.itemListConfig?.enableComparison && (itemList.length > 1) &&
              <div className={classnames(style.itemDetailsHeaderCol, style.Col_Compare)}>
                <OroButton label={getI18Text('--compare--')} type='link' icon={<Repeat size={16} />} onClick={() => setCompare(true)} />
              </div>}
          </div>
        </div>
        <div className={style.itemDetailsBody} data-test-id="itemDetails">
          {itemList && itemList.map((value, index) =>
            <div key={value.id || index}>
              { currentEditItemIndex !== index &&
                <ItemDetailsRow
                  index={index}
                  item={value}
                  onCreateDuplicate={() => onCreateDuplicate(value)}
                  expanded={itemList.length <= 1}
                  isNew={props.oldValue && !props.oldValue?.items?.some(lineItem => value.name === lineItem.name)}
                  oldValue={props.oldValue?.items?.find(lineItem => value.name === lineItem.name)}
                  readOnly= {props.readOnly}
                  disableDelete={disableDelete}
                  disableDuplicate={disableDuplicate}
                  fieldName={props.config?.fieldName}
                  locale={getSessionLocale()}
                  forceValidate={props.config?.forceValidate}
                  loadCustomerDocument={props.dataFetchers?.getDoucumentByPath}
                  getDocumentByName={props.dataFetchers?.getDocumentByName}
                  visibleFields={visibleFields}
                  customFormDefinition={customFormDefinition}
                  itemConfig={props.config.itemListConfig}
                  options={props.additionalOptions}
                  areOptionsAvailableForMasterDataField={props.config.areOptionsAvailableForMasterDataField}
                  events={props.events}
                  dataFetchers={props.dataFetchers}
                  onItemEdit={onItemEdit}
                  onDeleteClick={() => deleteItem(index)}
                /> }
              { currentEditItemIndex === index &&
                <AddNewItem
                  item={itemList[currentEditItemIndex]}
                  currentItemIndex={currentEditItemIndex}
                  mandetoryFields={mandetoryFields}
                  readonlyFields={readonlyFields}
                  visibleFields={visibleFields}
                  fieldName={props.config?.fieldName}
                  locale={getSessionLocale()}
                  forceValidate={props.config.forceValidate}
                  erpItemIdOptions={props.additionalOptions?.erpItemId || []}
                  currencyOptions={props.additionalOptions.currency}
                  categoryOptions={categories}
                  departmentOptions={departments}
                  costCenterOptions={costCenters}
                  accountCodeOptions={accountCode}
                  itemIdOptions={itemIdOptions}
                  lineOfBusinessOptions={lineOfBusinessOption}
                  trackCodeOptions={trackCodeOptions}
                  locationOption={locationOption}
                  projectOption={projectOption}
                  expenseCategoryOption={expenseCategoryOption}
                  purchaseItemOption={purchaseItemOptions}
                  itemListConfig ={props.config.itemListConfig}
                  isEdit={true}
                  defaultCurrency={itemList?.[0]?.totalPrice?.currency || itemList?.[0]?.price?.currency || props.additionalOptions?.defaultCurrency}
                  unitPerQuantityOptions={unitPerQuantityOptions}
                  disableCurrency={props.config?.disableCurrency}
                  defaultAccountCode={props.additionalOptions?.defaultAccountCode}
                  defaultDepartments={props.additionalOptions?.defaultDepartments}
                  defaultLocations={props.additionalOptions?.defaultLocations}
                  options={props.additionalOptions}
                  events={props.events}
                  dataFetchers={props.dataFetchers}
                  customFormDefinition={customFormDefinition}
                  isItemContextFieldFound={isItemContextFieldFound}
                  fetchChildren={props.dataFetchers?.fetchChildren}
                  searchOptions={props.dataFetchers?.searchOptions}
                  onAddItem={(item, file, fileName, filter) => { handleEditItem(index, item, file, fileName, filter) }}
                  onCloseForm={() => setCurrentEditItemIndex(-1)}
                  getDocumentByName={props.dataFetchers?. getDocumentByName}
                  onCurrencyChange={handleCurrencyChange}
                  onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
                  onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
                /> }
            </div> )}
        </div>
      </>}

      {!props.readOnly && showItemDetailsForm &&
        <AddNewItem
          item={null}
          currentItemIndex={itemList?.length || 0}
          mandetoryFields={mandetoryFields}
          visibleFields={visibleFields}
          readonlyFields={readonlyFields}
          fieldName={props.config?.fieldName}
          locale={getSessionLocale()}
          forceValidate={props.config?.forceValidate}
          erpItemIdOptions={props.additionalOptions?.erpItemId || []}
          currencyOptions={props.additionalOptions?.currency}
          categoryOptions={categories}
          departmentOptions={departments}
          costCenterOptions={costCenters}
          accountCodeOptions={accountCode}
          itemIdOptions={itemIdOptions}
          lineOfBusinessOptions={lineOfBusinessOption}
          trackCodeOptions={trackCodeOptions}
          locationOption={locationOption}
          projectOption={projectOption}
          expenseCategoryOption={expenseCategoryOption}
          purchaseItemOption={purchaseItemOptions}
          itemListConfig ={props.config.itemListConfig}
          isEdit={false}
          defaultCurrency={itemList?.[0]?.totalPrice?.currency || itemList?.[0]?.price?.currency || props.additionalOptions?.defaultCurrency}
          userSelectedCurrency={userSelectedCurrency}
          disableCurrency={props.config?.disableCurrency}
          unitPerQuantityOptions={unitPerQuantityOptions}
          defaultAccountCode={props.additionalOptions?.defaultAccountCode}
          defaultDepartments={props.additionalOptions?.defaultDepartments}
          defaultLocations={props.additionalOptions?.defaultLocations}
          options={props.additionalOptions}
          events={props.events}
          dataFetchers={props.dataFetchers}
          customFormDefinition={customFormDefinition}
          isItemContextFieldFound={isItemContextFieldFound}
          fetchChildren={props.dataFetchers?.fetchChildren}
          searchOptions={props.dataFetchers?.searchOptions}
          onAddItem={handleAddItem}
          onCloseForm={closeAddNewItemForm}
          getDocumentByName={props.dataFetchers?.getDocumentByName}
          onCurrencyChange={handleCurrencyChange}
        />}

      <div className={style.itemDetailsFooter}>
        {!props.readOnly && !showItemDetailsForm && !disabledAdd &&
          <OroButton icon={<PlusCircle color={'var(--warm-prime-azure'} size={16} />} label={getI18ControlText('--fieldTypes--.--itemList--.--addItem--', { prefix })} type='link' onClick={handleShowItemDetailForm}/>}
        <div className={style.spread} />

        {itemList && itemList?.length > 0 && isFieldVisible(ItemDetailsFields.totalPrice) && totalOfItemsList &&
          <div className={classnames(style.total, { [style.readOnly]: props.readOnly })} data-test-id="itemDetails-grand-total">
            <div className={style.label}>{getI18Text('--totalAmount--')}</div>
            <div className={props.readOnly ? style.valueReadOnly : style.value}>{getFormattedValue(totalOfItemsList.amount, totalOfItemsList.currency, getSessionLocale(), true)}</div>
          </div>}
      </div>

      {error &&
        <div className={style.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}

      {props.readOnly && props.config?.itemListConfig?.enableComparison && itemList && (itemList.length > 1) &&
        <ItemComparisonPopup
          isOpen={compare}
          extensionFormId={props.config?.itemListConfig?.questionnaireId?.formId}
          items={itemList}
          events={props.events}
          prefix={prefix}
          onClose={() => setCompare(false)}
          getItemDiffs={props.dataFetchers.getItemDiffs}
        />}
    </div>
  )
}

// TODO remove once V2 is fully functional
export function ItemDetailsControlNew(props: ItemDetailsControlPropsNew | ItemDetailsV2ControlPropsNew) {
  const _propsNew = props as ItemDetailsControlPropsNew
  const _propsV2 = props as ItemDetailsV2ControlPropsNew
  const useItemListV2 = getSessionUseItemDetailsV2()

  return useItemListV2 ? <ItemDetailsControlV2 locale={getSessionLocale()} {..._propsV2} /> : <ItemDetailsControl {..._propsNew} />
}

export function ItemDetailsControlNewEmailValue(props: ItemDetailsControlPropsNew) {
  return (
    <>
      {props.value?.items.length > 0 && props.value.items.map((item, itemIndex) =>
        <div style={{maxWidth: '511px', width: '100%', marginTop: '9px'}} key={itemIndex}>
          <table className="formSection">
            <tbody>
              {item.name
                ? (<tr><td className="tableTitle typography6">Name: </td><td className='typography6' style={{color:'#283041'}}>{item.name}</td></tr>)
                : ''}
              {item.description
                ? (<tr><td className="tableTitle typography6">Description: </td><td className='typography6' style={{color:'#283041'}}>{item.description}</td></tr>)
                : ''}
              {item.quantity
                ? (<tr><td className="tableTitle typography6">Quantity: </td><td className='typography6' style={{color:'#283041'}}>{item.quantity}</td></tr>)
                : ''}
              {item.price
                ? (<tr><td className="tableTitle typography6">Price: </td><td className='typography6' style={{color:'#283041'}}>{item.price.currency} {item.price.amount}</td></tr>)
                : ''}
              {item.totalPrice
                ? (<tr><td className="tableTitle typography6">Amount: </td><td className='typography6' style={{color:'#283041'}}> {item.totalPrice.currency} {item.totalPrice.amount}</td></tr>)
                : ''}
            </tbody>
          </table>
        </div>)}
    </>
  )
}
