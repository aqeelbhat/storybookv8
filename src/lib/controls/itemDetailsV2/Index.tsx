/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import React, { useState, useEffect } from 'react'
import { Plus, PlusCircle } from 'react-feather'
import { ItemDetailsFields } from '../../CustomFormDefinition/types/CustomFormModel'
import { Attachment, ItemDetails, Money } from '../../Types/common'
import { mapItemDetails } from '../../Types/Mappers/common'
import { OroButton } from '../button/button.component'
import style from './style.module.scss'
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import { changeLineItemCurrency } from '../services/util.service'
import classNames from 'classnames'
import { ItemDetailsV2ControlPropsNew, ItemDetailsSize } from './types'
import ItemDetailsRow from './Rows/Index'
import EditItem from './EditItem'
import { DEFAULT_CURRENCY, calculateTotalAmount, getLineItemsTotalPrice } from '../../util'
import { getI18Text as getI18ControlText, useTranslationHook } from '../../i18n'
import { copyObject } from '../../Form/util'
import { useAdditionalOptions, useConfigFields, useCustomForm } from './CustomHooks'
import { HeaderRow } from './HeaderRow'
import { Indentation } from './Indent/Index'
import { TotalAmount } from './TotalAmount/Index'
import { getSessionLocale } from '../../sessionStorage'
import FormAlertModal from './Modals/FormAlertModal'
import { ItemComparisonPopup } from '../ItemComparisonPopup'
const FieldsToAvoidDuplicate = ['erpItemId', 'lineNumber', 'accumulator.quantityBilled', 'accumulator.quantityReceived']

const MAX_LEVEL = 4
// TO be used with Suspense
type AlertInfo = {
  isOpen: boolean
  isShowingDetails: boolean
  id: string
  type: 'openDetails'
}
export function ItemDetailsControlV2 (props: ItemDetailsV2ControlPropsNew) {
  const [itemList, setItemList] = useState<Array<ItemDetails>>([])
  const [newItemId, setNewItemId] = useState<string | null>(null)
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<string>()
  const [compare, setCompare] = useState<boolean>(false)

  // for Current Edit Item Row
  const [currentEditItemId, setCurrentEditItemId] = useState<string>(null)
  const [formTouched, setFormTouched] = useState(false)
  const [alertModalInfo, setAlertModalInfo] = useState<AlertInfo>({ isOpen: false, isShowingDetails: false, id: '', type: 'openDetails' })

  const [totalOfItemsList, setTotalOfItemsList] = useState<Money>()
  const [error, setError] = useState<string>()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({}) // e.g. { [id]: true, [id2]: false}

  // Additional Options
  const [categories, departments, accountCode, itemIdOptions, lineOfBusinessOption,
    locationOption, projectOption, expenseCategoryOption, purchaseItemOptions,
    unitPerQuantityOptions, trackCodeOptions, costCenters] = useAdditionalOptions(props.additionalOptions)
  // Filtered List
  const [visibleFields, readonlyFields, mandatoryFields, displayFields] = useConfigFields(props.config?.itemListConfig)

  //Custom Form
  const [customFormDefinition] = useCustomForm(props.config?.itemListConfig?.questionnaireId, props.events?.fetchExtensionCustomFormDefinition)
  // default values
  const CurrencyToUse = itemList?.[0]?.totalPrice?.currency || itemList?.[0]?.price?.currency || props.additionalOptions?.defaultCurrency || DEFAULT_CURRENCY
  const LocaleToUse = props.locale || getSessionLocale()
  const prefixToUse = props.config?.itemListConfig?.listItemPrefix || 'item'
  const disableDelete = props.config?.itemListConfig?.disableDelete
  const disabledAdd = props.config?.itemListConfig?.disableAdd
  const disableDuplicate = disabledAdd
  const isNested = props.config?.itemListConfig?.enableAddSubItems
  const allowNegative = props.allowNegative ?? false

  const { t } = useTranslationHook()

  // Utils
  function findItem (id: string, list: ItemDetails[]): ItemDetails | null {
    // find id at nested level
    let _find
    for (let i = 0; i < list.length; i++) {
      const _item = list[i]
      if (_item.id === id) {
        _find = _item
      } else if (_item.children) {
        _find = findItem(id, _item.children)
      }
      if (_find) {
        break;
      }
    }
    return _find
  }
  function isItemExpanded (id: string) {
    return !!expandedItems[id]
  }
  function copyState () {
    // Copy current state
    return JSON.parse(JSON.stringify(itemList)) as ItemDetails[]
  }
  function isFieldVisible (fieldName: ItemDetailsFields): boolean {
    return visibleFields.find(value => value === fieldName) ? true : false
  }
  function findExpandedChildsIds (parent: ItemDetails) {
    const expandedIds = []
    function recursive (children: ItemDetails[]) {
      children.forEach((item) => {
        if (expandedItems[item.id]) {
          expandedIds.push(item.id)
          recursive(item.children)
        }
      })
    }
    recursive(parent.children)
    return expandedIds
  }
  // State Proxy
  function saveCurrentEditItemId (value: string | null) {
    setCurrentEditItemId(value)
    if (value === null) {
      setFormTouched(false)
    }
  }

  // Actions
  function onUpdatedList (updatedList: Array<ItemDetails>, file?: File | Attachment, fileName?: string, filter?: Map<string, string[]>) {
    setItemList(updatedList)

    if (!filter) {
      if (props.onChange) {
        props.onChange({ items: updatedList }, file, fileName)
      }
    } else {
      props.onItemIdFilterApply && props.onItemIdFilterApply(filter)
    }
  }
  function handleSaveItem (id: string, parentId: string, itemToSave: ItemDetails, file?: File | Attachment, fileName?: string, filter?: Map<string, string[]>) {
    if (!fileName && !filter) {
      saveCurrentEditItemId(null)
    }

    const _copyState = copyState()

    const mapSaveItem = (item) => item.id === id ? { ...itemToSave, children: item.children } : item

    if (parentId) {
      // Save nested child
      const _parent = findItem(parentId, _copyState)
      _parent.children = _parent.children.map(mapSaveItem)
      onUpdatedList(_copyState, file, fileName, filter)
      return
    }
    // Save root child
    const _newCopy = _copyState.map(mapSaveItem)
    onUpdatedList(_newCopy, file, fileName, filter)
  }
  function handleCurrencyChange (currencyCode: string) {
    setUserSelectedCurrency(currencyCode)

    if (props.onCurrencyChange) {
      props.onCurrencyChange(currencyCode)
    }

    setItemList(itemList.map(lineItem => changeLineItemCurrency(lineItem, currencyCode)))
  }

  function handleAddNewItemClick (parentId: string, isSection: boolean = false) {
    const newId = `${Math.random()}`
    const newItem = { id: newId, section: isSection }
    const _copy = copyState()

    if (parentId) {
      const _parent = findItem(parentId, _copy)
      if (!_parent.children) {
        _parent.children = []
      }
      _parent.children.push(newItem)
      toggleExpandCollapse(parentId, false)
    } else {
      _copy.push(newItem)
    }
    setItemList(_copy)
    // set flag for new item
    setNewItemId(newId)

    if (props.onChange) {
      props.onChange({ items: _copy })
    }
  }
  function handleToggleRowDetails (isShowingDetails: boolean, id: string, skipAlertCheck?: boolean) {
    if (!skipAlertCheck && itemAlreadyOpenChecker(isShowingDetails, id)) {
      return
    }
    const selectedItem = isShowingDetails ? findItem(id, itemList) : null

    if (selectedItem && selectedItem?.accountCodeIdRef && selectedItem?.accountCodeIdRef?.id && props.config?.itemListConfig?.enableAccountCodeFilter) {
      const fiterMap = new Map<string, string[]>()
      fiterMap.set('md_AccountCode', [selectedItem.accountCodeIdRef?.id])
      if (props.onItemIdFilterApply) {
        props.onItemIdFilterApply(fiterMap)
      }
    }
    saveCurrentEditItemId(isShowingDetails ? id : null)
  }
  function itemAlreadyOpenChecker (isShowingDetails: boolean, selectedRowid: string) {
    // if action clicked other than selected row
    const _clickedOtherRow = currentEditItemId && selectedRowid && (currentEditItemId !== selectedRowid)
    if (_clickedOtherRow && formTouched) {
      setAlertModalInfo((value: AlertInfo) : AlertInfo => {
        return { ...value, isOpen: true, id: selectedRowid, isShowingDetails: isShowingDetails }
      })
      return true
    }
    return false
  }
  function handleDeleteItem (id: string, parentId?: string) {
    // Copy current state
    let _copy = copyState()
    if (parentId) {
      const _parent = findItem(parentId, _copy)
      _parent.children = _parent.children.filter((i) => i.id !== id)
    } else {
      _copy = _copy.filter((i) => i.id !== id)
    }

    setItemList(_copy)

    if (_copy.length === 0) {
      setError('')
    }

    if (props.onChange) {
      props.onChange({ items: _copy })
    }
    // if self deleted
    if (id === currentEditItemId) {
      saveCurrentEditItemId(null)
    }
    // TODO WHY BELOW CODE? why to validate again?
    // if (props.validator && !props.config.optional && !props.config.isReadOnly) {
    //   setError(props.validator({ items: itemListCopy }))
    // }
  }
  function handleFieldChange (id: string, fieldName: ItemDetailsFields, fieldValue: string | number | Money | null) {
    // Copy current state
    const _copy = copyState()

    // update the item
    const itemToUpdate = findItem(id, _copy)
    if (itemToUpdate) {
      itemToUpdate[fieldName] = fieldValue
      // update total price for Quantity
      if ([ItemDetailsFields.quantity, ItemDetailsFields.price, ItemDetailsFields.tax].includes(fieldName)) {
        const totalPrice = {
          amount: calculateTotalAmount(itemToUpdate),
          currency: itemToUpdate.totalPrice?.currency || CurrencyToUse
        }
        itemToUpdate.totalPrice = totalPrice
      }
    }
    setItemList(_copy)
    setNewItemId(null)
    if (props.onChange) {
      props.onChange({ items: _copy })
    }
    // TODO
    // setError(props.validator({ items: itemList }))
  }
  function handleDuplicate (originalItem: ItemDetails, parentId?: string) {
    const allItemsNames = itemList.map(_item => _item.name);
    let newName = originalItem.name;
    let count = 0;
    while (allItemsNames.includes(newName)) {
      count++;
      newName = `${originalItem.name}(${count})`;
    }
    const _duplicateItem = copyObject(originalItem, { newName, excludeKeys: FieldsToAvoidDuplicate })
    const _copyState = copyState()
    // where to place
    if (parentId) {
      const _parent = findItem(parentId, _copyState)
      _parent.children.push(_duplicateItem)
    } else {
      _copyState.push(_duplicateItem)
    }
    // const newList = [...itemList, _duplicateItem]
    setItemList(_copyState)

    if (props.onChange) {
      props.onChange({ items: _copyState })
    }
  }
  function handleCloseForm () {
    saveCurrentEditItemId(null)
  }

  function toggleExpandCollapse (id: string, isExpanded: boolean) {
    const _copy = { ...expandedItems, [id]: !isExpanded }

    // collapse all childs too..get child list
    isExpanded && findExpandedChildsIds(findItem(id, itemList))
      .forEach((id) => {
        _copy[id] = false
      })

    setExpandedItems(_copy)
  }
  function handleExpandCollapse (id: string, isExpanded: boolean) {
    toggleExpandCollapse(id, isExpanded)
  }

  // i18 Helpers
  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }
  function getI18ItemPrefix (key: string) {
    return getI18Text('--prefix--.' + key)
  }

  function isSmallView () {
    return (props.size === ItemDetailsSize.small)
  }
  function isMediumView () {
    return (props.size === ItemDetailsSize.medium)
  }
  // Handlers for discard Popup
  function handleAlertCancelClick () {
    setAlertModalInfo((value) => {
      return { ...value, isOpen: false }
    })
  }
  function handleAlertContinueClick () {
    //manoj
    const { id, isShowingDetails } = alertModalInfo
    handleToggleRowDetails(isShowingDetails, id, true)
    setAlertModalInfo((value) => {
      return { ...value, isOpen: false }
    })
  }
  function handleFormTouched () {
    setFormTouched(true)
  }

  function validate (sourceList: ItemDetails[]) {
    if (props.validator) {
      const result = props.validator({ items: sourceList })

      if (result.hasError && result.parentIds.length > 0) {
        // Exapnd Parents.. else item cant open
        const _expandedItems = {}
        result.parentIds.forEach((id) => {
          _expandedItems[id] = true
        })
        setExpandedItems(_expandedItems)
      }
      if (result.hasError && result.itemId) {
        // Open item
        saveCurrentEditItemId(result.itemId)
      }
      // show generic message
      setError(result.hasError ? result.errorMessage : '')
    }
  }

  useEffect(() => {
    if (props.config?.forceValidate && !props.config.optional && !props.config.isReadOnly) {
      validate(itemList)
    }
  }, [props.config])

  useEffect(() => {
    if (props.value && Array.isArray(props.value.items)) {
      const items: Array<ItemDetails> = props.value.items.map(mapItemDetails)
      setItemList(items)
    }
  }, [props.value])

  // Calculate Total Price when ItemList state is updated(add/edit/delete).
  useEffect(() => {
    setTotalOfItemsList(getLineItemsTotalPrice(itemList, isNested))
  }, [itemList])

  useEffect(() => {
    setUserSelectedCurrency(props.additionalOptions?.userSelectedCurrency)
    if (itemList && props.additionalOptions?.userSelectedCurrency) {
      setItemList(itemList.map(lineItem => changeLineItemCurrency(lineItem, props.additionalOptions?.userSelectedCurrency)))
    }
  }, [props.additionalOptions?.userSelectedCurrency])

  function renderRows (itemRows: ItemDetails[], parentId?: string, counterPrefix: string = '', nestedLevel: number = 0) {
    return <> {itemRows.length > 0 && <div className={style.tbody} data-test-id="itemDetailsRows">
      {itemRows.map((value, index) => {
        return <React.Fragment key={value.id}>
          <ItemDetailsRow
            key={value.id}
            id={value.id}
            parentId={parentId}
            index={index}
            counter={index + 1}
            level={nestedLevel}
            counterPrefix={counterPrefix}
            item={value}
            isNested={isNested}
            allowNegative={allowNegative}
            isExpanded={isItemExpanded(value.id)}
            isNewItem={value.id === newItemId}
            showDetails={value.id === currentEditItemId}
            size={props.size || ItemDetailsSize.large}
            prefix={prefixToUse}
            oldValue={props.oldValue?.items?.find(lineItem => value.name === lineItem.name)}
            readOnly={props.readOnly}
            disableDelete={disableDelete}
            disableDuplicate={disableDuplicate}
            disabledAdd={disabledAdd}
            locale={LocaleToUse}
            forceValidate={props.config?.forceValidate}
            visibleFields={visibleFields}
            mandatoryFields={mandatoryFields}
            readonlyFields={readonlyFields}
            displayFields={displayFields}
            customFormDefinition={customFormDefinition}
            itemConfig={props.config.itemListConfig}
            options={props.additionalOptions}
            areOptionsAvailableForMasterDataField={props.config.areOptionsAvailableForMasterDataField}
            defaultCurrency={CurrencyToUse}
            t={t}
            maxLevel={MAX_LEVEL}
            onExpandCollapse={handleExpandCollapse}

            onToggleRowDetails={handleToggleRowDetails}
            onDuplicate={handleDuplicate}
            onDelete={handleDeleteItem}
            onAddItem={handleAddNewItemClick}
            onAddSection={(id: string) => handleAddNewItemClick(id, true)}
            onFieldChange={handleFieldChange}
          >{currentEditItemId === value.id &&
            <EditItem
              item={value}
              id={value.id}
              counter={index + 1}
              index={index}
              parentId={parentId}
              allowNegative={allowNegative}
              counterPrefix={counterPrefix}
              mandatoryFields={mandatoryFields}
              readonlyFields={readonlyFields}
              visibleFields={visibleFields}
              fieldName={props.config?.fieldName}
              locale={LocaleToUse}
              size={props.size || ItemDetailsSize.large}
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
              itemListConfig={props.config.itemListConfig}
              isEdit={true}
              readOnly={props.readOnly}
              defaultCurrency={CurrencyToUse}
              userSelectedCurrency={userSelectedCurrency}
              unitPerQuantityOptions={unitPerQuantityOptions}
              disableCurrency={props.config?.disableCurrency}
              defaultAccountCode={props.additionalOptions?.defaultAccountCode}
              defaultDepartments={props.additionalOptions?.defaultDepartments}
              defaultLocations={props.additionalOptions?.defaultLocations}
              options={props.additionalOptions}
              events={props.events}
              dataFetchers={props.dataFetchers}
              customFormDefinition={customFormDefinition}
              fetchChildren={props.dataFetchers?.fetchChildren}
              searchOptions={props.dataFetchers?.searchOptions}
              t={t}
              onSave={handleSaveItem}
              onCloseForm={handleCloseForm}
              getDocumentByName={props.dataFetchers?.getDocumentByName}
              onCurrencyChange={handleCurrencyChange}
              onFieldTouch={handleFormTouched}
              onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
              onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
            />}
          </ItemDetailsRow>
          {isNested && isItemExpanded(value.id) && renderRows(value.children || [], value.id, `${counterPrefix}${index + 1}.`, nestedLevel + 1)}
        </React.Fragment>
      })
      }
    </div>}

      {!props.readOnly && !disabledAdd &&
        <div className={style.tr}>
          <div className={classNames(style.td, style.flexGrow, style.addItemRow, { [style.zeroItems]: (itemList && itemList.length === 0) })}>
            <Indentation
              level={nestedLevel}
              isNested={isNested}
              prefix={counterPrefix}
              indent={itemRows.length + 1}
            />
            <OroButton icon={<Plus size={18} />} label={t('--itemList--.--addButton--', { name: getI18ItemPrefix(prefixToUse) })} type='link' onClick={() => handleAddNewItemClick(parentId)} />
            {(isNested && nestedLevel < MAX_LEVEL) && <><span className={style.divide}></span><OroButton icon={<Plus size={18} />} label={t('--itemList--.--addSection--')} type='link' onClick={() => handleAddNewItemClick(parentId, true)} /></>}
          </div>
        </div>}
    </>
  }

  function renderTotal () {
    return <div className={classNames(style.tr, style.noBtmBorder)}>
      <div className={classNames(style.td, style.flexGrow, style.footer, { [style.readOnly]: props.readOnly })}>
        <TotalAmount
          label={getI18Text('--totalAmount--')}
          amount={totalOfItemsList.amount}
          currency={totalOfItemsList.currency}
          locale={LocaleToUse}
        />
      </div>
    </div>
  }

  return (
    <>
      <div className={classNames(style.scrollbar, { [style.mediumView]: isMediumView(), [style.smallView]: isSmallView() })}>
        <div className={style.table}>
          <HeaderRow
            isReadOnly={props.readOnly}
            canCompare={props.readOnly && props.config?.itemListConfig?.enableComparison && itemList && (itemList?.length > 1)}
            prefix={getI18ItemPrefix(prefixToUse)}
            isSmallView={isSmallView()}
            isFieldVisible={isFieldVisible}
            displayFields={displayFields}
            getI18Text={getI18Text}
            onCompare={() => setCompare(true)}
          />
          {renderRows(itemList)}
          {itemList && itemList?.length > 0 && isFieldVisible(ItemDetailsFields.totalPrice) && totalOfItemsList && renderTotal()}
        </div>
      </div>

      {props.readOnly && props.config?.itemListConfig?.enableComparison && itemList && (itemList?.length > 1) &&
        <ItemComparisonPopup
          isOpen={compare}
          extensionFormId={props.config?.itemListConfig?.questionnaireId?.formId}
          items={itemList}
          events={props.events}
          prefix={getI18ItemPrefix(prefixToUse)}
          onClose={() => setCompare(false)}
          getItemDiffs={props.dataFetchers.getItemDiffs}
        />}

      {error &&
        <div className={style.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}

      {alertModalInfo.isOpen && <FormAlertModal
        title={getI18Text('--unsavedChanges--')}
        message={getI18Text('--changesMayLost--')}
        isOpen
        primary={getI18Text('--continue--')}
        secondary={getI18Text('--cancel--')}
        onPrimary={handleAlertContinueClick}
        onSecondary={handleAlertCancelClick}
        onClose={handleAlertCancelClick} />}
    </>
  )
}
