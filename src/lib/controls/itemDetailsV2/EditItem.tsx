/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import classnames from "classnames"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import style from './form.module.scss'
import { ItemDetailsSize, ItemFormProps } from "./types"
import { ItemDetails, Option } from "../../Types"
import { getDateObject, isEmpty, isNullable, isNullableOrEmpty, mapIDRefToOption, mapOptionToIDRef, validateDateOrdering } from "../../Form/util"
import { CustomFormData, CustomFormModelValue, FormDefinitionReadOnlyView, ItemDetailsFields } from "../../CustomFormDefinition"
import { Attachment, ItemType, OroMasterDataType, TaxObject } from "../../Types/common"
import { calculateTotalAmount, mapCurrencyToSymbol } from '../../util'
import { getValueFromAmount } from "../../Inputs/utils.service"
import { OroButton } from "../button/button.component"
import { attachmentListValidator, taxValidator } from "../../CustomFormDefinition/View/validator.service"
import { CustomFormExtension } from "../../CustomFormDefinition/CustomFormExtension/Index"
import { NumberBox, OROWebsiteInput, Radio, TextBox, TypeAhead } from "../../Inputs"
import { AttachmentsControlNew } from "../attachment.component"
import { DateControlNew } from "../date.component"
import { MoneyControlNew } from "../money.component"
import { RichTextControl } from "../text.component"
import { TaxRowsControl } from "./TaxRows/Index"

import { Cost, DocumentRef } from "../../Form/types"
import { Grid } from "@mui/material"
import { LabelCell, FieldCell, ValueCell } from "./cells/Index"
import classNames from "classnames"
import { ChevronDown, ChevronUp } from "react-feather"
import { OroTooltip } from "../../Tooltip/tooltip.component"
import { getSessionLocale } from "../../sessionStorage"
import { OptionTreeData } from "../../MultiLevelSelect/types"

// used for display content in i18 purpose only
// TODO once common ItemType is fixed, can remove this.
enum ItemTypeIDs {
  goods = 'goods',
  service = 'service'
}
const ItemTypeOption: Array<Option> = Object.keys(ItemTypeIDs).map((key) => {
  return {
    id: key,
    displayName: ItemTypeIDs[key], // will be replace with i18 while used in component
    path: ItemTypeIDs[key]
  }
})

export default function EditItem (props: ItemFormProps) {
  // const [error, setError] = useState<string>('')
  const CURRENCY = props.defaultCurrency
  const DEFAULT_COST = { amount: undefined, currency: CURRENCY }
  const DEFAULT_TAX = {
    amount: DEFAULT_COST,
    items: [{ taxableAmount: DEFAULT_COST }]
  }
  const [validateField, setValidateField] = useState<boolean>(false)
  const [endDateTouched, setEndDateTouched] = useState<boolean>(false)
  const [forceValidateDateRange, setForceValidateDateRange] = useState<boolean>(false)

  // Fields
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

  // To hide Additional + custom form
  const [hideCustomForm, setHideCustomForm] = useState(false)

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (node: HTMLDivElement, fieldName: string) {
    fieldRefMap.current[fieldName] = node
  }

  const [currentLineItem, setCurrentLineItem] = useState<ItemDetails | null>(null)
  const [fetchData, setFetchData] = useState<(skipValidation?: boolean) => CustomFormModelValue>()
  const isItemContextFound = props.isItemContextFieldFound || false
  // Setting current item context and passed to line item extension form
  function handleLineItemFieldChange (fieldName: string, value: Option | string | number | Cost | TaxObject | Attachment[]) {
    if (isItemContextFound) {
      const _updatedLineItem = props.item ? { ...props.item } : getLineItemData()
      switch (fieldName) {
        case ItemDetailsFields.type:
          const _type = value as Option
          _updatedLineItem.type = _type?.id as ItemType
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
  // get Item Modified Data from State
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

  // Field Utils
  function isFieldVisible (fieldName: ItemDetailsFields): boolean {
    return props.visibleFields.some(value => value === fieldName)
  }
  function isFieldMandatory (fieldName: ItemDetailsFields): boolean {
    return props.mandatoryFields.some(value => value === fieldName)
  }
  function isFieldReadonly (fieldName: ItemDetailsFields): boolean {
    return props.readonlyFields.some(value => value === fieldName)
  }

  // Validations
  function triggerDateRangeValidation () {
    setForceValidateDateRange(true)
    setTimeout(() => {
      setForceValidateDateRange(false)
    }, 500)
  }
  function validateStartDate (value: string): string {
    triggerDateRangeValidation()
    return (!isFieldReadonly(ItemDetailsFields.startDate) && isFieldMandatory(ItemDetailsFields.startDate) && !value) ? getI18Text('--requiredField--') : ''
  }
  function validateEndDate (value: string): string {
    return (endDateTouched || validateField) && (
      ((!isFieldReadonly(ItemDetailsFields.endDate) && isFieldMandatory(ItemDetailsFields.endDate) && !value) ? getI18Text('--requiredField--') : '') ||
      (startDate && value ? validateDateOrdering(startDate, value) : '')
    )
  }

  function getInvalidField (): string {
    // name is always considered as required
    if (!name) {
      //inValidFieldId = ItemDetailsFields.name
      return ItemDetailsFields.name
    }
    let inValidFieldId: string
    inValidFieldId = props.mandatoryFields.find(field => {
      // Validate only if it is visible
      if (isFieldVisible(field) && !isFieldReadonly(field)) {
        switch (field) {
          case ItemDetailsFields.type:
            if (!itemType) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.categories:
            if (!categoryValue?.path) {
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
          case ItemDetailsFields.description:
            if (!description) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.quantity:
            if (isNullableOrEmpty(quantity) || !(!props.item?.accumulator?.quantityReceived || (quantity >= props.item?.accumulator?.quantityReceived))) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.unitForQuantity:
            if (!unitValue) {
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
          case ItemDetailsFields.url:
            if (!url) {
              inValidFieldId = field
            }
            break
          case ItemDetailsFields.accountCode:
            if (!accountCodeValue?.path) {
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
        }
      }
      return !!inValidFieldId
    })
    // validate dates
    if (!inValidFieldId && startDate && endDate && validateDateOrdering(startDate, endDate)) {
      return ItemDetailsFields.endDate
    }
    // validate custom form
    if (!inValidFieldId && props.itemListConfig?.questionnaireId?.formId && !fetchData()) {
      return `itemDetails_${props.itemListConfig?.questionnaireId?.formId}`
    }
    return inValidFieldId || ''
  }
  function triggerValidations (invalidFieldId: string) {
    setValidateField(true)
    if (invalidFieldId) {
      const HTMLElement = fieldRefMap?.current?.[invalidFieldId] as HTMLElement
      if (HTMLElement?.scrollIntoView) {
        HTMLElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
      }
    }
    // TODO investigate why this was added
    setTimeout(() => { setValidateField(false) }, 100)
  }

  // Fields Change
  function onQuantityChange (fieldValue: string) {
    if (isNullableOrEmpty(fieldValue)) {
      setQuantity(undefined)
      return
    }
    setQuantity(Number(getValueFromAmount(fieldValue)))

    // Update total price
    const updatedItem: ItemDetails = { ...(getLineItemData()), quantity: Number(getValueFromAmount(fieldValue)) }
    const totalPrice = { amount: calculateTotalAmount(updatedItem).toString(), currency: updatedItem?.price?.currency }
    setTotalPrice(totalPrice)
  }
  function onPriceChange (fieldValue: Cost) {
    setPrice(fieldValue)
    handleLineItemFieldChange(ItemDetailsFields.price, fieldValue)

    // Update total price
    const updatedItem: ItemDetails = { ...(getLineItemData()), price: { amount: Number(fieldValue?.amount), currency: fieldValue?.currency } }
    const totalPrice = { amount: calculateTotalAmount(updatedItem).toString(), currency: updatedItem?.price?.currency }
    setTotalPrice(totalPrice)
  }
  function onTaxChange (value: TaxObject) {
    setTax(value)
    handleLineItemFieldChange(ItemDetailsFields.tax, value)

    // Update total price
    const updatedItem: ItemDetails = { ...(getLineItemData()), tax: value }
    const totalPrice = { amount: calculateTotalAmount(updatedItem).toString(), currency: updatedItem?.price?.currency }
    setTotalPrice(totalPrice)
  }
  function onImagesChange (fieldValue: Array<Attachment | File>, file?: File | Attachment, fileName?: string) {
    setImages(fieldValue)
    handleLineItemFieldChange(ItemDetailsFields.images, fieldValue)
    if (props.onSave) {
      const updatedItem: ItemDetails = { ...(getLineItemData()), images: fieldValue }
      props.onSave(props.id, props.parentId, updatedItem, file, fileName)
    }
  }
  function onSpecificationsChange (fieldValue: Array<Attachment | File>, file?: File | Attachment, fileName?: string) {
    setSpecifications(fieldValue)
    handleLineItemFieldChange(ItemDetailsFields.specifications, fieldValue)
    if (props.onSave) {
      const updatedItem: ItemDetails = { ...(getLineItemData()), specifications: fieldValue }
      props.onSave(props.id, props.parentId, updatedItem, file, fileName)
    }
  }
  function onAccountCodeChange (fieldValue?: Option) {
    setAccountCodeValue(fieldValue)

    if (fieldValue && props.itemListConfig?.enableAccountCodeFilter) {
      const updatedItem: ItemDetails = { ...(getLineItemData()), accountCodeIdRef: fieldValue ? mapOptionToIDRef(fieldValue) : undefined }
      const filterMap = new Map<string, string[]>()
      if (props.onSave) {
        fieldValue?.id && filterMap.set('md_AccountCode', [fieldValue?.id])
        props.onSave(props.id, props.parentId, updatedItem, undefined, undefined, filterMap)
      }
    }
  }
  // Custom Form Change
  function handleFormValueChange (formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef, index?: number, fieldName?: string) {
    if (fileName && props.onSave) {
      const extensionFieldName = `${props.fieldName}.items[${props.index}].data.${fileName}`
      props.onSave(props.id, props.parentId, { ...(getLineItemData()), data: formData }, file, extensionFieldName)
    }
  }

  function handleOnFormReady (fetchDataFunction) {
    if (fetchDataFunction) {
      setFetchData(() => fetchDataFunction)

      if (props.onLineItemExtensionFormReady) {
        props.onLineItemExtensionFormReady(fetchDataFunction, props.fieldName)
      }
    }
  }

  function handleOnFilterApply (filter: Map<string, string[]>, formData: CustomFormData) {
    if (props.onSave) {
      props.onSave(props.id, props.parentId, getLineItemData(), undefined, undefined, filter)
    }
  }

  // Should Render Additional Fields
  function showAdditionalFieldPart2 () {
    return isFieldVisible(ItemDetailsFields.specifications) ||
      isFieldVisible(ItemDetailsFields.images)
  }
  function showAdditionalFieldPart1 (): boolean {
    return isFieldVisible(ItemDetailsFields.accountCode) ||
      isFieldVisible(ItemDetailsFields.materialId) ||
      isFieldVisible(ItemDetailsFields.supplierPartId) ||
      isFieldVisible(ItemDetailsFields.manufacturerPartId) ||
      isFieldVisible(ItemDetailsFields.url) ||
      isFieldVisible(ItemDetailsFields.itemIds) ||
      isFieldVisible(ItemDetailsFields.lineOfBusiness) ||
      isFieldVisible(ItemDetailsFields.trackCode) ||
      isFieldVisible(ItemDetailsFields.location) ||
      isFieldVisible(ItemDetailsFields.projectCode) ||
      isFieldVisible(ItemDetailsFields.expenseCategory)
  }
  function showAdditionSection () {
    return showAdditionalFieldPart1() || showCustomForm() || showAdditionalFieldPart2()
  }
  // Should show Custom Form
  function showCustomForm (): boolean {
    return !!(props.itemListConfig?.questionnaireId && props.itemListConfig?.questionnaireId?.formId)
  }

  function handleSaveClick () {
    const invalidFieldId = getInvalidField()
    if (!invalidFieldId) {
      // setError('')
      setValidateField(false)
      if (props.onSave) {
        props.onSave(props.id, props.parentId, getLineItemData())
      }
    } else {
      // setError(getI18Text('--requiredField--'))
      triggerValidations(invalidFieldId)
    }
  }

  // TODO to plug with Close Without Save Button
  function handleCancelClick () {
    if (props.onCloseForm) {
      props.onCloseForm()
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

  function costFormatter (value: Cost) {
    if (!value || (value.amount === undefined) || (value.amount === null) || !value.currency) {
      return '-'
    }
    return `${value && mapCurrencyToSymbol(value.currency)}${value && Number(value.amount).toLocaleString(props.locale)}`
  }

  function onLoadDocument (fieldName: string, mediaType: string, fileName: string): Promise<Blob> {
    if (props.dataFetchers?.getDocumentByName) {
      const extensionFieldName = `${props.fieldName}.items[${props.index}].data.${fieldName}`
      return props.dataFetchers?.getDocumentByName(extensionFieldName, mediaType, fileName)
    }
  }
  function getI18Text (key: string) {
    return props.t('--itemList--.' + key)
  }
  function toggleCustomForm () {
    setHideCustomForm(!hideCustomForm)
  }
  function renderCustomForm () {
    return props.readOnly ?
      <div id="lineItemCustomFormExtension" data-test-id="lineItemCustomFormExtension">
        <FormDefinitionReadOnlyView
          locale={props.locale}
          inTableCell
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
      </div> :
      <div id="lineItemCustomFormExtension" data-test-id="lineItemCustomFormExtension">
        <CustomFormExtension
          locale={props.locale}
          customFormData={props.item?.data}
          currentLineItem={currentLineItem}
          questionnaireId={props.itemListConfig?.questionnaireId}
          options={props.options}
          customFormDefinition={props.customFormDefinition}
          dataFetchers={{ ...props.dataFetchers, getDocumentByName: onLoadDocument }}
          events={props.events}
          isEdit={props.isEdit}
          inTableCell={true}
          handleFormValueChange={handleFormValueChange}
          onFilterApply={handleOnFilterApply}
          onFormReady={handleOnFormReady}
          onFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
        />
      </div>
  }

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
      // setCostCenter(props.item.unitForQuantity ? mapIDRefToOption(props.item.unitForQuantity) : undefined)
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
      // do we need to forceValidate this ?
      setCurrentLineItem(props.item)
    }
  }, [props.item])

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

  useEffect(() => {
    if (props.forceValidate) {
      setValidateField(true)
    }
  }, [props.forceValidate])

  function onTouch () {
    props.onFieldTouch && props.onFieldTouch()
  }

  return (
    <div className={classnames(style.form, { [style.smallView]: props.size === ItemDetailsSize.small, [style.mediumView]: props.size === ItemDetailsSize.medium })}>
      <Grid container gap={0} className={style.table}>
        {props.item?.lineNumber?.toString() && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--lineNumber--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td}>
            <ValueCell disabled={!props.readOnly} testId={ItemDetailsFields.number}>
              {props.item?.lineNumber?.toString()}
            </ValueCell>
          </Grid>
        </>}
        {props.item?.erpItemId?.name && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--accountNumber--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td}>
            <ValueCell disabled={!props.readOnly} testId={ItemDetailsFields.erpItemId}>
              {props.item?.erpItemId?.name}
            </ValueCell>
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.type) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--type--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.type))
              ? <ValueCell>{(itemType?.displayName || '-')}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.type} ref={(node) => { storeRef(node, ItemDetailsFields.type) }}>
                <Radio
                  id='itemDetailsFieldsType'
                  name={ItemDetailsFields.type}
                  value={itemType}
                  inTableCell
                  // disabled={props.readOnly || isFieldReadonly(ItemDetailsFields.type)}
                  options={ItemTypeOption.map(option => { return { ...option, displayName: getI18Text('--itemType--.' + option.id) } })}
                  required={!isFieldReadonly(ItemDetailsFields.type) && isFieldMandatory(ItemDetailsFields.type)}
                  forceValidate={validateField && isFieldMandatory(ItemDetailsFields.type)}
                  showHorizontal={true}
                  validator={(value) => {
                    return (!isFieldReadonly(ItemDetailsFields.type) && isFieldMandatory(ItemDetailsFields.type) && !value)
                      ? getI18Text('--requiredField--')
                      : ''
                  }}
                  onChange={(value) => { setItemType(value); handleLineItemFieldChange(ItemDetailsFields.type, value) }}
                />
              </FieldCell>
            }
            {/* <ValueCell editable={(!props.readOnly && !isFieldReadonly(ItemDetailsFields.type))}
              testId={ItemDetailsFields.type} ref={(node) => { storeRef(node, ItemDetailsFields.type) }}>
              {(props.readOnly || isFieldReadonly(ItemDetailsFields.type))
                ? (itemType?.displayName || '-')
                :
            </ValueCell> */}
          </Grid>
        </>}

        <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
          <LabelCell readOnly={props.readOnly}>
            {getI18Text('--name--')}
          </LabelCell>
        </Grid>
        <Grid xs={8} item className={style.td} onClick={onTouch}>
          {(props.readOnly || isFieldReadonly(ItemDetailsFields.name))
            ? <ValueCell>{name || '-'}</ValueCell>
            : <FieldCell testId={ItemDetailsFields.name} ref={(node) => { storeRef(node, ItemDetailsFields.name) }}>
              <TextBox
                inTableCell
                placeholder={getI18Text('--enterName--')}
                value={name || ''}
                //disabled={isFieldReadonly(ItemDetailsFields.name)}
                required={true}
                forceValidate={validateField}
                validator={(value) => (!isFieldReadonly(ItemDetailsFields.name) && isEmpty(value))
                  ? getI18Text('--requiredField--') :
                  ''}
                onChange={(value) => { setName(value); handleLineItemFieldChange(ItemDetailsFields.name, value) }}
              />
            </FieldCell>}
        </Grid>

        {isFieldVisible(ItemDetailsFields.categories) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--category--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.categories))
              ? <ValueCell>{categoryValue?.displayName || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.categories} ref={(node) => { storeRef(node, ItemDetailsFields.categories) }}>
                <TypeAhead
                  inTableCell
                  placeholder={getI18Text('--selectCategory--')}
                  value={categoryValue}
                  type={OptionTreeData.category}
                  showTree={true}
                  disabled={isFieldReadonly(ItemDetailsFields.categories)}
                  options={props.categoryOptions}
                  required={!isFieldReadonly(ItemDetailsFields.categories) && isFieldMandatory(ItemDetailsFields.categories)}
                  forceValidate={validateField && isFieldMandatory(ItemDetailsFields.categories)}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('Category', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'Category')}
                  validator={(value) => {
                    const validate = (!isFieldReadonly(ItemDetailsFields.categories) && isFieldMandatory(ItemDetailsFields.categories) && isEmpty(value))
                      ? getI18Text('--requiredField--')
                      : ''
                    return validate
                  }}
                  onChange={(value) => { setCategoryValue(value); handleLineItemFieldChange(ItemDetailsFields.categories, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.departments) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--department--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.departments))
              ? <ValueCell>{departmentValue?.displayName || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.departments} ref={(node) => { storeRef(node, ItemDetailsFields.departments) }}>
                <TypeAhead
                  inTableCell
                  placeholder={getI18Text('--selectDepartment--')}
                  value={departmentValue}
                  //disabled={isFieldReadonly(ItemDetailsFields.departments)}
                  options={props.departmentOptions}
                  required={!isFieldReadonly(ItemDetailsFields.departments) && isFieldMandatory(ItemDetailsFields.departments)}
                  forceValidate={validateField && isFieldMandatory(ItemDetailsFields.departments)}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('Department', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'Department')}
                  validator={(value) => (!isFieldReadonly(ItemDetailsFields.departments) && isFieldMandatory(ItemDetailsFields.departments) && isEmpty(value))
                    ? getI18Text('--requiredField--')
                    : ''}
                  onChange={(value) => { setDepartmentValue(value); handleLineItemFieldChange(ItemDetailsFields.departments, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.costCenter) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--costCenter--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.costCenter))
              ? <ValueCell>{costCenter?.displayName || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.costCenter} ref={(node) => { storeRef(node, ItemDetailsFields.costCenter) }}>
                <TypeAhead
                  inTableCell
                  placeholder={getI18Text('--selectCostCenter--')}
                  value={costCenter}
                  options={props.costCenterOptions}
                  //disabled={isFieldReadonly(ItemDetailsFields.costCenter)}
                  required={!isFieldReadonly(ItemDetailsFields.costCenter) && isFieldMandatory(ItemDetailsFields.costCenter)}
                  forceValidate={validateField && isFieldMandatory(ItemDetailsFields.costCenter)}
                  validator={(value) => {
                    const validate = (!isFieldReadonly(ItemDetailsFields.costCenter) && isFieldMandatory(ItemDetailsFields.costCenter) && isEmpty(value))
                      ? getI18Text('--requiredField--')
                      : ''

                    return validate
                  }}
                  onChange={(value) => { setCostCenter(value); handleLineItemFieldChange(ItemDetailsFields.costCenter, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.description) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--description--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.description))
              ? <ValueCell>{description || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.description} ref={(node) => { storeRef(node, ItemDetailsFields.description) }}>
                <RichTextControl
                  inTableCell
                  placeholder={getI18Text('--addDescription--')}
                  value={description}
                  isReadOnly={isFieldReadonly(ItemDetailsFields.description)}
                  optional={!isFieldMandatory(ItemDetailsFields.description)}
                  forceValidate={validateField && isFieldMandatory(ItemDetailsFields.description)}
                  validator={(value) => {
                    const validate = (!isFieldReadonly(ItemDetailsFields.description) && isFieldMandatory(ItemDetailsFields.description) && isEmpty(value))
                      ? getI18Text('--requiredField--')
                      : ''
                    return validate;
                  }}
                  onChange={(value) => { setDescription(value); handleLineItemFieldChange(ItemDetailsFields.description, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {!isNullable(props.item?.accumulator?.quantityReceived) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--quantityReceived--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} >
            <ValueCell disabled={!props.readOnly} testId={ItemDetailsFields.qtyReceived}>
              {`${props.item?.accumulator?.quantityReceived}`}
            </ValueCell>
          </Grid>
        </>}
        {!isNullable(props.item?.accumulator?.quantityBilled) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--quantityInvoiced--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} >
            <ValueCell disabled={!props.readOnly} testId={ItemDetailsFields.invoicedQty}>
              {`${props.item?.accumulator?.quantityBilled}`}
            </ValueCell>
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.quantity) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--quantity--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.quantity))
              ? <ValueCell>{!isNullable(quantity) ? quantity + '' : '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.quantity} ref={(node) => { storeRef(node, ItemDetailsFields.quantity) }}>
                <NumberBox
                  inTableCell
                  value={!isNullable(quantity) ? quantity.toLocaleString(getSessionLocale()) : ''}
                  placeholder={getI18Text('--enterQuantity--')}
                  id={ItemDetailsFields.quantity}
                  decimalLimit={5}
                  //disabled={isFieldReadonly(ItemDetailsFields.quantity)}
                  required={!isFieldReadonly(ItemDetailsFields.quantity) && isFieldMandatory(ItemDetailsFields.quantity)}
                  forceValidate={validateField && (isFieldMandatory(ItemDetailsFields.quantity) || !(!props.item?.accumulator?.quantityReceived || (Number(quantity) >= props.item?.accumulator?.quantityReceived)))}
                  validator={(value) => {
                    const validate = (!isFieldReadonly(ItemDetailsFields.quantity) && isFieldMandatory(ItemDetailsFields.quantity) && isNullableOrEmpty(value))
                      ? getI18Text('--requiredField--')
                      : !(!props.item?.accumulator?.quantityReceived || (Number(getValueFromAmount(value)) >= props.item?.accumulator?.quantityReceived))
                        ? getI18Text('--qtyCannotLessThanInvoiced--')
                        : ''
                    return validate
                  }}
                  onChange={(value) => { onQuantityChange(value); handleLineItemFieldChange(ItemDetailsFields.quantity, Number(getValueFromAmount(value))) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.unitForQuantity) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--unit--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.unitForQuantity))
              ? <ValueCell>{unitValue?.displayName || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.unitForQuantity} ref={(node) => { storeRef(node, ItemDetailsFields.unitForQuantity) }}>
                <TypeAhead
                  inTableCell
                  placeholder={getI18Text('--unitOfMeasure--')}
                  value={unitValue}
                  //disabled={isFieldReadonly(ItemDetailsFields.unitForQuantity)}
                  options={props.unitPerQuantityOptions}
                  required={!isFieldReadonly(ItemDetailsFields.unitForQuantity) && isFieldMandatory(ItemDetailsFields.unitForQuantity)}
                  forceValidate={validateField && isFieldMandatory(ItemDetailsFields.unitForQuantity)}
                  fetchChildren={(parent, childrenLevel) => fetchChildren('UnitOfMeasure', parent, childrenLevel)}
                  onSearch={(keyword) => searchMasterdataOptions(keyword, 'UnitOfMeasure')}
                  validator={(value) => {
                    const validate = (!isFieldReadonly(ItemDetailsFields.unitForQuantity) && isFieldMandatory(ItemDetailsFields.unitForQuantity) && isEmpty(value))
                      ? getI18Text('--requiredField--')
                      : ''
                    return validate
                  }}
                  onChange={(value) => { setUnitValue(value); handleLineItemFieldChange(ItemDetailsFields.unitForQuantity, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.price) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--pricePerUnit--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.price))
              ? <ValueCell>{costFormatter(price)}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.price} ref={(node) => { storeRef(node, ItemDetailsFields.price) }}>
                <MoneyControlNew
                  allowNegative={props.allowNegative}
                  locale={props.locale}
                  value={price}
                  inTableCell
                  config={{
                    optional: !isFieldMandatory(ItemDetailsFields.price),
                    isReadOnly: isFieldReadonly(ItemDetailsFields.price),
                    disableCurrency: props.disableCurrency,
                    forceValidate: validateField && isFieldMandatory(ItemDetailsFields.price)
                  }}
                  additionalOptions={{
                    currency: props.currencyOptions,
                    defaultCurrency: props.defaultCurrency,
                    userSelectedCurrency: props.userSelectedCurrency
                  }}
                  // disabled={isFieldReadonly(ItemDetailsFields.price)}
                  validator={(value) => {
                    const validate = (!isFieldReadonly(ItemDetailsFields.price) && isFieldMandatory(ItemDetailsFields.price) && !value?.amount)
                      ? getI18Text('--requiredField--')
                      : ''
                    return validate
                  }}
                  onChange={onPriceChange}
                  onCurrencyChange={props.onCurrencyChange}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.tax) && <>
          <TaxRowsControl
            allowNegative={props.allowNegative}
            value={tax}
            currencyOptions={props.currencyOptions}
            itemListConfig={props.itemListConfig}
            defaultCurrency={price?.currency || (props.item ? (props.defaultCurrency) : (props.userSelectedCurrency || props.defaultCurrency))}
            userSelectedCurrency={props.userSelectedCurrency}
            locale={props.locale}
            getI18Text={getI18Text}
            optional={!isFieldMandatory(ItemDetailsFields.tax)}
            isReadOnly={props.readOnly}
            isFieldReadOnly={isFieldReadonly(ItemDetailsFields.tax)}
            disableCurrency={props.disableCurrency}
            forceValidate={validateField && isFieldMandatory(ItemDetailsFields.tax) && !isFieldReadonly(ItemDetailsFields.tax)}
            validator={(value) => taxValidator(value)
              ? getI18Text('--requiredField--')
              : ''}
            onChange={onTaxChange}
            onCurrencyChange={props.onCurrencyChange}
            onFieldTouch={onTouch}
          />
        </>}
        {isFieldVisible(ItemDetailsFields.totalPrice) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--totalAmount--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.totalPrice))
              ? <ValueCell>{costFormatter(totalPrice)}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.totalPrice} ref={(node) => { storeRef(node, ItemDetailsFields.totalPrice) }}>
                <MoneyControlNew
                  allowNegative={props.allowNegative}
                  locale={props.locale}
                  value={totalPrice}
                  inTableCell
                  config={{
                    optional: !isFieldMandatory(ItemDetailsFields.totalPrice),
                    isReadOnly: isFieldReadonly(ItemDetailsFields.totalPrice),
                    disableCurrency: props.disableCurrency,
                    forceValidate: validateField && isFieldMandatory(ItemDetailsFields.totalPrice)
                  }}
                  additionalOptions={{
                    currency: props.currencyOptions,
                    defaultCurrency: props.defaultCurrency,
                    userSelectedCurrency: props.userSelectedCurrency
                  }}
                  // disabled={isFieldReadonly(ItemDetailsFields.totalPrice)}
                  validator={(value) => (!isFieldReadonly(ItemDetailsFields.totalPrice) && isFieldMandatory(ItemDetailsFields.totalPrice) && !value?.amount)
                    ? getI18Text('--requiredField--')
                    : ''}
                  onChange={(value) => {
                    setTotalPrice(value);
                    handleLineItemFieldChange(ItemDetailsFields.totalPrice, value) }}
                  onCurrencyChange={props.onCurrencyChange}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.startDate) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--startDate--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.startDate))
              ? <ValueCell>{startDate || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.startDate} ref={(node) => { storeRef(node, ItemDetailsFields.startDate) }}>
                <DateControlNew
                  value={getDateObject(startDate)}
                  inTableCell
                  config={{
                    isReadOnly: isFieldReadonly(ItemDetailsFields.startDate),
                    optional: false,
                    forceValidate: validateField && isFieldMandatory(ItemDetailsFields.startDate),

                  }}
                  // disabled={isFieldReadonly(ItemDetailsFields.startDate)}
                  validator={validateStartDate}
                  onChange={(value) => { setStartDate(value); handleLineItemFieldChange(ItemDetailsFields.startDate, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
        {isFieldVisible(ItemDetailsFields.endDate) && <>
          <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
            <LabelCell readOnly={props.readOnly}>
              {getI18Text('--endDate--')}
            </LabelCell>
          </Grid>
          <Grid xs={8} item className={style.td} onClick={onTouch}>
            {(props.readOnly || isFieldReadonly(ItemDetailsFields.endDate))
              ? <ValueCell>{endDate || '-'}</ValueCell>
              : <FieldCell testId={ItemDetailsFields.endDate} ref={(node) => { storeRef(node, ItemDetailsFields.endDate) }}>
                <DateControlNew
                  value={getDateObject(endDate)}
                  inTableCell
                  config={{
                    isReadOnly: isFieldReadonly(ItemDetailsFields.endDate),
                    optional: false,
                    forceValidate: validateField || forceValidateDateRange
                  }}
                  disabled={isFieldReadonly(ItemDetailsFields.endDate)}
                  validator={validateEndDate}
                  onChange={(value) => { setEndDate(value); setEndDateTouched(true); handleLineItemFieldChange(ItemDetailsFields.endDate, value) }}
                />
              </FieldCell>}
          </Grid>
        </>}
      </Grid>

      {showAdditionSection()
        && <>
          <div className={style.subTitle}>
            {getI18Text('--additionalInfo--')}
            <div className={style.toggle}>
              <OroTooltip onClick={toggleCustomForm} title={hideCustomForm ? getI18Text("--expand--") :  getI18Text("--collapse--")}>
                {hideCustomForm ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
              </OroTooltip></div>
          </div>
          {showAdditionalFieldPart1() && <Grid container gap={0} className={classNames(style.table,{[style.hide]: hideCustomForm})}>
            {isFieldVisible(ItemDetailsFields.accountCode) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--accountCode--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.accountCode))
                  ? <ValueCell>{accountCodeValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.accountCode} ref={(node) => { storeRef(node, ItemDetailsFields.accountCode) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectAccountCode--')}
                      value={accountCodeValue}
                      options={props.accountCodeOptions}
                      //disabled={isFieldReadonly(ItemDetailsFields.accountCode)}
                      required={!isFieldReadonly(ItemDetailsFields.accountCode) && isFieldMandatory(ItemDetailsFields.accountCode)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.accountCode)}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.accountCode) && isFieldMandatory(ItemDetailsFields.accountCode) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { onAccountCodeChange(value); handleLineItemFieldChange(ItemDetailsFields.accountCode, value) }}
                    />
                  </FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.materialId) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--materialId--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.materialId))
                  ? <ValueCell>{materialId || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.materialId} ref={(node) => { storeRef(node, ItemDetailsFields.materialId) }}>
                    <TextBox
                      inTableCell
                      placeholder={getI18Text('--enterMaterialId--')}
                      value={materialId}
                      //disabled={isFieldReadonly(ItemDetailsFields.materialId)}
                      required={!isFieldReadonly(ItemDetailsFields.materialId) && isFieldMandatory(ItemDetailsFields.materialId)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.materialId)}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.materialId) && isFieldMandatory(ItemDetailsFields.materialId) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setMaterialId(value); handleLineItemFieldChange(ItemDetailsFields.materialId, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.itemIds) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--itemIds--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.itemIds))
                  ? <ValueCell>{itemIdValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.itemIds} ref={(node) => { storeRef(node, ItemDetailsFields.itemIds) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectItemIds--')}
                      value={itemIdValue}
                      options={props.itemIdOptions}
                      //disabled={isFieldReadonly(ItemDetailsFields.itemIds)}
                      required={!isFieldReadonly(ItemDetailsFields.itemIds) && isFieldMandatory(ItemDetailsFields.itemIds)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.itemIds)}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('Item', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'Item')}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.itemIds) && isFieldMandatory(ItemDetailsFields.itemIds) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setItemIdValue(value); handleLineItemFieldChange(ItemDetailsFields.itemIds, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.lineOfBusiness) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--businessUnit--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.lineOfBusiness))
                  ? <ValueCell>{lineOfBusinessValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.lineOfBusiness} ref={(node) => { storeRef(node, ItemDetailsFields.lineOfBusiness) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectLineOfBusiness--')}
                      value={lineOfBusinessValue}
                      options={props.lineOfBusinessOptions}
                      //disabled={isFieldReadonly(ItemDetailsFields.lineOfBusiness)}
                      required={!isFieldReadonly(ItemDetailsFields.lineOfBusiness) && isFieldMandatory(ItemDetailsFields.lineOfBusiness)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.lineOfBusiness)}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('BusinessUnit', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'BusinessUnit')}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.lineOfBusiness) && isFieldMandatory(ItemDetailsFields.lineOfBusiness) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setLineOfBusinessValue(value); handleLineItemFieldChange(ItemDetailsFields.lineOfBusiness, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.location) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--location--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.location))
                  ? <ValueCell>{locationValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.location} ref={(node) => { storeRef(node, ItemDetailsFields.location) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectLocation--')}
                      value={locationValue}
                      options={props.locationOption}
                      //disabled={isFieldReadonly(ItemDetailsFields.location)}
                      required={!isFieldReadonly(ItemDetailsFields.location) && isFieldMandatory(ItemDetailsFields.location)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.location)}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.location) && isFieldMandatory(ItemDetailsFields.location) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setLocationValue(value); handleLineItemFieldChange(ItemDetailsFields.location, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.projectCode) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--project--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.projectCode))
                  ? <ValueCell>{projectValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.projectCode} ref={(node) => { storeRef(node, ItemDetailsFields.projectCode) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectProject--')}
                      value={projectValue}
                      options={props.projectOption}
                      //disabled={isFieldReadonly(ItemDetailsFields.projectCode)}
                      required={!isFieldReadonly(ItemDetailsFields.projectCode) && isFieldMandatory(ItemDetailsFields.projectCode)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.projectCode)}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('Project', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'Project')}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.projectCode) && isFieldMandatory(ItemDetailsFields.projectCode) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setProjectValue(value); handleLineItemFieldChange(ItemDetailsFields.projectCode, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.supplierPartId) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--supplierPartId--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.supplierPartId))
                  ? <ValueCell>{supplierPartId || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.supplierPartId} ref={(node) => { storeRef(node, ItemDetailsFields.supplierPartId) }}>
                    <TextBox
                      inTableCell
                      placeholder={getI18Text('--enterSupplierPartId--')}
                      value={supplierPartId}
                      //disabled={isFieldReadonly(ItemDetailsFields.supplierPartId)}
                      required={!isFieldReadonly(ItemDetailsFields.supplierPartId) && isFieldMandatory(ItemDetailsFields.supplierPartId)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.supplierPartId)}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.supplierPartId) && isFieldMandatory(ItemDetailsFields.supplierPartId) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setSupplierPartId(value); handleLineItemFieldChange(ItemDetailsFields.supplierPartId, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.manufacturerPartId) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--manufacturerPartId--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.manufacturerPartId))
                  ? <ValueCell>{manufacturerPartId || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.manufacturerPartId} ref={(node) => { storeRef(node, ItemDetailsFields.manufacturerPartId) }}>
                    <TextBox
                      inTableCell
                      placeholder={getI18Text('--enterManufacturerPartId--')}
                      value={manufacturerPartId}
                      //disabled={isFieldReadonly(ItemDetailsFields.manufacturerPartId)}
                      required={!isFieldReadonly(ItemDetailsFields.manufacturerPartId) && isFieldMandatory(ItemDetailsFields.manufacturerPartId)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.manufacturerPartId)}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.manufacturerPartId) && isFieldMandatory(ItemDetailsFields.manufacturerPartId) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setManufacturerPartId(value); handleLineItemFieldChange(ItemDetailsFields.manufacturerPartId, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.expenseCategory) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--expenseCategory--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.expenseCategory))
                  ? <ValueCell>{expenseCategoryValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.expenseCategory} ref={(node) => { storeRef(node, ItemDetailsFields.expenseCategory) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectExpenseCategory--')}
                      value={expenseCategoryValue}
                      options={props.expenseCategoryOption}
                      //disabled={isFieldReadonly(ItemDetailsFields.expenseCategory)}
                      required={!isFieldReadonly(ItemDetailsFields.expenseCategory) && isFieldMandatory(ItemDetailsFields.expenseCategory)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.expenseCategory)}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('ExpenseCategory', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'ExpenseCategory')}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.expenseCategory) && isFieldMandatory(ItemDetailsFields.expenseCategory) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setExpenseCategoryValue(value); handleLineItemFieldChange(ItemDetailsFields.expenseCategory, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.trackCode) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--trackCode--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.trackCode))
                  ? <ValueCell>{trackCodeValue?.displayName || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.trackCode} ref={(node) => { storeRef(node, ItemDetailsFields.trackCode) }}>
                    <TypeAhead
                      inTableCell
                      placeholder={getI18Text('--selectTrackCode--')}
                      value={trackCodeValue}
                      options={props.trackCodeOptions}
                      //disabled={isFieldReadonly(ItemDetailsFields.trackCode)}
                      required={!isFieldReadonly(ItemDetailsFields.trackCode) && isFieldMandatory(ItemDetailsFields.trackCode)}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.trackCode)}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('TrackCode', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'TrackCode')}
                      validator={(value) => (!isFieldReadonly(ItemDetailsFields.trackCode) && isFieldMandatory(ItemDetailsFields.trackCode) && isEmpty(value))
                        ? getI18Text('--requiredField--')
                        : ''}
                      onChange={(value) => { setTrackCodeValue(value); handleLineItemFieldChange(ItemDetailsFields.trackCode, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.url) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--url--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {(props.readOnly || isFieldReadonly(ItemDetailsFields.url))
                  ? <ValueCell>{url || '-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.url} ref={(node) => { storeRef(node, ItemDetailsFields.url) }}>
                    <OROWebsiteInput
                      inTableCell
                      value={url}
                      forceValidate={validateField && isFieldMandatory(ItemDetailsFields.url)}
                      placeholder={getI18Text('--addLinkForProduct--')}
                      //disabled={isFieldReadonly(ItemDetailsFields.url)}
                      required={!isFieldReadonly(ItemDetailsFields.url) && isFieldMandatory(ItemDetailsFields.url)}
                      validator={(value) => {
                        const validate = (!isFieldReadonly(ItemDetailsFields.url) && isFieldMandatory(ItemDetailsFields.url) && isEmpty(value))
                          ? getI18Text('--requiredField--')
                          : ''
                        return validate
                      }}
                      onChange={(value) => { setUrl(value); handleLineItemFieldChange(ItemDetailsFields.url, value) }}
                    /></FieldCell>}
              </Grid>
            </>}
          </Grid>}

          {showCustomForm() && props.customFormDefinition && <Grid container gap={0} className={classNames({[style.hide]: hideCustomForm})}>
            <Grid item xs={12}>{renderCustomForm()}
            </Grid>
          </Grid>}

          {showAdditionalFieldPart2() && <Grid container gap={0} className={classNames(style.table,{[style.hide]: hideCustomForm})}>
            {isFieldVisible(ItemDetailsFields.images) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  {getI18Text('--uploadImages--')}
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {props.readOnly && images.length === 0
                  ? <ValueCell>{'-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.images} ref={(node) => { storeRef(node, ItemDetailsFields.images) }}>
                    <AttachmentsControlNew
                      value={images}
                      inTableCell
                      config={{
                        isReadOnly: props.readOnly || isFieldReadonly(ItemDetailsFields.images),
                        optional: !isFieldMandatory(ItemDetailsFields.images),
                        forceValidate: validateField && isFieldMandatory(ItemDetailsFields.images),
                        fieldName: `${props.fieldName}.items[${props.index}].images`
                      }}
                      disabled={isFieldReadonly(ItemDetailsFields.images)}
                      dataFetchers={{
                        getDocumentByName: props.getDocumentByName
                      }}
                      validator={(value) => !isFieldReadonly(ItemDetailsFields.images) && isFieldMandatory(ItemDetailsFields.images) &&
                        attachmentListValidator(value)}
                      onChange={onImagesChange}
                    />
                  </FieldCell>}
              </Grid>
            </>}
            {isFieldVisible(ItemDetailsFields.specifications) && <>
              <Grid xs={4} item className={classNames(style.td, { [style.readOnly]: props.readOnly })}>
                <LabelCell readOnly={props.readOnly}>
                  <div className={style.formBodyContainerRowFieldName}>{getI18Text('--uploadSpecifications--')}</div>
                  <div className={style.formBodyContainerRowOtherInfo}>{getI18Text('--documentsProductSpecifications--')}</div>
                </LabelCell>
              </Grid>
              <Grid xs={8} item className={style.td} >
                {props.readOnly && specifications.length === 0
                  ? <ValueCell>{'-'}</ValueCell>
                  : <FieldCell testId={ItemDetailsFields.specifications} ref={(node) => { storeRef(node, ItemDetailsFields.specifications) }}>
                    <AttachmentsControlNew
                      value={specifications}
                      inTableCell
                      config={{
                        isReadOnly: props.readOnly || isFieldReadonly(ItemDetailsFields.specifications),
                        optional: !isFieldMandatory(ItemDetailsFields.specifications),
                        forceValidate: validateField && isFieldMandatory(ItemDetailsFields.specifications),
                        fieldName: `${props.fieldName}.items[${props.index}].specifications`
                      }}
                      disabled={isFieldReadonly(ItemDetailsFields.specifications)}
                      dataFetchers={{
                        getDocumentByName: props.getDocumentByName
                      }}
                      validator={(value) => !isFieldReadonly(ItemDetailsFields.specifications) && isFieldMandatory(ItemDetailsFields.specifications) &&
                        attachmentListValidator(value)}
                      onChange={onSpecificationsChange}
                    />
                  </FieldCell>}
              </Grid>
            </>}
          </Grid>}
        </>}

      {!props.readOnly && <div className={style.actionButtons}>
        <OroButton label={getI18Text('--cancel--')}
          type='secondary'
          radiusCurvature={'medium'}
          onClick={handleCancelClick} />
        <OroButton
          label={getI18Text('--saveChanges--')}
          type='primary'
          radiusCurvature={'medium'}
          onClick={handleSaveClick} />
      </div>}
    </div >
  )
}
