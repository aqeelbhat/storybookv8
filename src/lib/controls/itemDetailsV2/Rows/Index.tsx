/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import { useEffect, useState } from "react"
import { ItemDetailsSize, ItemRowProps } from "../types"
import { ItemDetailsFields } from "../../../CustomFormDefinition"
import { getItemTotalAmount, isNumber, mapCurrencyToSymbol } from "../../../util"
import { lineItemValidator } from "../../../CustomFormDefinition/View/validator.service"
import classnames from "classnames"
import style from './../style.module.scss'
import React from "react"
import { AlertCircle, Maximize2, MoreVertical } from "react-feather"
import { isEmpty, isNullable } from "../../../Form/util"
import { QuantityCell, TextFieldCell, MoneyCell, ValueCell } from "../cells/Index"
import { getValueFromAmount } from "../../../Inputs/utils.service"
import { Money, TaxObject } from "../../../Types"
import { OroTooltip } from "../../../Tooltip/tooltip.component"
import { Indentation } from "../Indent/Index"
import { InlineMenu, BoxMenu } from "../Menu/Index"
import { MenuActionType } from "../Menu/types"
import TotalPriceCell from "./TotalPrice"
import TaxWrapper from "./TaxWrapper"
import PriceWrapper from "./PriceWrapper"
import QtyWrapper from "./QtyWrapper"
import QtyUnitWrapper from "./QtyUnitWrapper"
import { Cost } from "../../../Form"

function getDefaultTaxObject (currency: string) {
  const DEFAULT_COST = { amount: undefined, currency }
  return {
    amount: DEFAULT_COST,
    items: [{ taxableAmount: DEFAULT_COST }]
  }
}

export default function ItemDetailsRow (props: ItemRowProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null)
  const [itemTotalPrice, setItemTotalPrice] = useState<Money>({ amount: undefined, currency: props.defaultCurrency })
  const [oldItemTotalPrice, setOldItemTotalPrice] = useState<Money | null>(null)
  const [error, setError] = useState<string>()
  const [taxObject, setTaxObject] = useState<TaxObject>(getDefaultTaxObject(props.defaultCurrency))
  const isSection = !!props.item?.section
  const totalChildren = props.item?.children?.length || 0

  // utils
  function isFieldVisible (fieldName: ItemDetailsFields): boolean {
    return props.visibleFields.find(value => value === fieldName) ? true : false
  }
  function isFieldMandatory (fieldName: ItemDetailsFields): boolean {
    return !!props.mandatoryFields.find(value => value === fieldName)
  }
  function isFieldReadonly (fieldName: ItemDetailsFields): boolean {
    return !!props.readonlyFields.find(value => value === fieldName)
  }
  //handlers
  function hideMenuPopover (e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    setMenuPosition(null)
  }
  function handleToggleDetails (e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    setMenuPosition(null)
    props.onToggleRowDetails(!props.showDetails, props.id)
  }
  function handleMenuClick (action: MenuActionType, e: React.MouseEvent<HTMLElement>) {
    switch (action) {
      case MenuActionType.duplicate:
        hideMenuPopover(e)
        props.onDuplicate(props.item, props.parentId)
        break
      case MenuActionType.delete:
        hideMenuPopover(e)
        props.onDelete(props.id, props.parentId)
        break
      case MenuActionType.addItem:
        hideMenuPopover(e)
        props.onAddItem(props.id)
        break
      case MenuActionType.addSection:
        hideMenuPopover(e)
        props.onAddSection(props.id)
        break
      case MenuActionType.view:
      case MenuActionType.collapse:
        handleToggleDetails(e)
        break;
    }

  }

  function showMenuPopover (e: React.MouseEvent<SVGElement>) {
    e.stopPropagation()
    setMenuPosition({ x: e.pageX, y: e.pageY })
  }
  function handleFieldChange (fieldName: ItemDetailsFields, newValue: string | number | Money | null) {
    props.onFieldChange(props.id, fieldName, newValue)
  }
  function handleTaxAmountChange (fieldName: ItemDetailsFields, value: Money) {
    const _copyTax = JSON.parse(JSON.stringify(taxObject))
    _copyTax.items[0].taxableAmount = value
    handleFieldChange(fieldName, _copyTax)
  }

  // formatters
  function moneyFormatter (value: Money) {
    if (!value || isNaN(value.amount) || value === null) {
      return ''
    }
    return `${value && mapCurrencyToSymbol(value.currency)}${value && Number(value.amount).toLocaleString(props.locale)}`
  }
  function costFormatter (value: Cost) {
    if (!value || (value.amount === undefined) || (value.amount === null) || !value.currency || !isNumber(value.amount)) {
      return ''
    }
    return `${value && mapCurrencyToSymbol(value.currency)}${value && Number(value.amount).toLocaleString(props.locale)}`
  }
  function taxFormatter (taxableAmount: Money) {
    if (!taxableAmount || isNaN(taxableAmount.amount) || taxableAmount === null) {
      return ''
    }
    const symbol = mapCurrencyToSymbol(taxableAmount.currency || props.defaultCurrency)
    const amountText = (taxableAmount.amount).toLocaleString(props.locale)
    const percText = <span className={style.taxpercent}>{'(' + Number(taxObject.items[0].percentage || 0).toLocaleString(props.locale) + '%)'}</span>
    return <span>{symbol}{amountText} {percText}</span>
  }
  // render children React Element// editItem.tsx
  function renderChildren () {
    if (!props.children) {
      return null
    }
    return React.cloneElement(props.children, {
      forceValidate: props.forceValidate || !!error,
    });
  }
  // i18n text
  function getI18Text (key: string) {
    return props.t('--itemList--.' + key)
  }
  function getI18ItemPrefix (key: string) {
    return getI18Text('--prefix--.' + key)
  }

  useEffect(() => {
    if (props.item) {

      setTaxObject(props.item.tax || getDefaultTaxObject(props.defaultCurrency))

      const totalAmount = getItemTotalAmount(props.item)
      const currencyToUse = props.item?.totalPrice?.currency || props.item?.price?.currency || props.defaultCurrency
      setItemTotalPrice({ amount: totalAmount, currency: currencyToUse })
      // setItemTotalPrice(getFormattedValue( getItemTotalAmount(props.item) , props.item?.totalPrice?.currency || props.item?.price?.currency, props.locale))
      //setOldItemTotalPrice(getFormattedValue(getItemTotalAmount(props.oldValue), props.oldValue?.totalPrice?.currency || props.oldValue?.price?.currency, props.locale))
      setOldItemTotalPrice({ amount: getItemTotalAmount(props.oldValue), currency: props.oldValue?.totalPrice?.currency || props.oldValue?.price?.currency || props.defaultCurrency })
    }
  }, [props.item])

  useEffect(() => {
    if (props.forceValidate) {
      const err = lineItemValidator(props.item, {
        itemListConfig: props.itemConfig,
        formDefinition: props.customFormDefinition,
        options: props.options,
        areOptionsAvailableForMasterDataField: props.areOptionsAvailableForMasterDataField
        // isNested: props.isNested TODO
      })
      setError(err)
    }
  }, [props.forceValidate])

  function isSmallView () {
    return (props.size === ItemDetailsSize.small)
  }
  function handleExpandIcon () {
    props.onExpandCollapse(props.id, props.isExpanded)
  }
  function shouldShowExpandCollapse () {
    if (!props.isNested) {
      return false
    }
    if (props.item.children?.length > 0) {
      return true
    }
    // edit mode
    return (props.isNested && !props.disabledAdd && props.level < props.maxLevel)
  }
  function mapConditionalCells (fieldName: ItemDetailsFields) {
    if(!isFieldVisible(fieldName)){
      return null
    }

    if (fieldName === ItemDetailsFields.totalPrice) {
      return <TotalPriceCell
        allowNegative={props.allowNegative}
        readOnly={props.readOnly}
        isFieldReadOnly={isFieldReadonly(ItemDetailsFields.totalPrice)}
        isFieldMandatory={isFieldMandatory(ItemDetailsFields.totalPrice)}
        hasOldValue={!!props.oldValue}
        oldItemTotalPrice={oldItemTotalPrice}
        locale={props.locale}
        defaultCurrency={props.defaultCurrency}
        itemTotalPrice={itemTotalPrice}
        moneyFormatter={moneyFormatter}
        costFormatter={costFormatter}
        forceValidate={props.forceValidate}
        handleFieldChange={handleFieldChange}
      />
    }
    if(isSmallView()) {
      return null
    }
    if(fieldName === ItemDetailsFields.tax){
      return <TaxWrapper
        allowNegative={props.allowNegative}
        readOnly={props.readOnly}
        isFieldReadOnly={isFieldReadonly(ItemDetailsFields.tax)}
        isFieldMandatory={isFieldMandatory(ItemDetailsFields.tax)}
        locale={props.locale}
        defaultCurrency={props.defaultCurrency}
        taxFormatter={taxFormatter}
        costFormatter={costFormatter}
        forceValidate={props.forceValidate}
        taxObject={taxObject}
        taxItems={props.item?.tax?.items}
        handleTaxAmountChange={handleTaxAmountChange}
      />
    }
    if(fieldName === ItemDetailsFields.price){
      return <PriceWrapper
        allowNegative={props.allowNegative}
        price={props.item?.price}
        oldPrice= {props.oldValue?.price}
        readOnly={props.readOnly}
        isFieldReadOnly={isFieldReadonly(ItemDetailsFields.price)}
        isFieldMandatory={isFieldMandatory(ItemDetailsFields.price)}
        locale={props.locale}
        defaultCurrency={props.defaultCurrency}
        moneyFormatter={moneyFormatter}
        costFormatter={costFormatter}
        forceValidate={props.forceValidate}
        handleFieldChange={handleFieldChange}
        hasOldValue={!!props.oldValue}
      />
    }
    if (fieldName === ItemDetailsFields.quantity && isFieldVisible(ItemDetailsFields.unitForQuantity)) {
      return <QtyUnitWrapper
      quantity={props.item?.quantity}
      unitForQuantity={props.item?.unitForQuantity}
      oldQuantity= {props.oldValue?.quantity}
      oldUnitForQuantity={props.oldValue?.unitForQuantity}
      hasOldValue={!!props.oldValue}
      readOnly={props.readOnly}
      isFieldReadOnly={isFieldReadonly(ItemDetailsFields.quantity)}
      isFieldMandatory={isFieldMandatory(ItemDetailsFields.quantity)}
      locale={props.locale}
      forceValidate={props.forceValidate}
      handleFieldChange={handleFieldChange}
    />
    }
    if (fieldName === ItemDetailsFields.quantity) {
      return <QtyWrapper
      quantity={props.item?.quantity}
      oldQuantity= {props.oldValue?.quantity}
      hasOldValue={!!props.oldValue}
      readOnly={props.readOnly}
      isFieldReadOnly={isFieldReadonly(ItemDetailsFields.quantity)}
      isFieldMandatory={isFieldMandatory(ItemDetailsFields.quantity)}
      locale={props.locale}
      forceValidate={props.forceValidate}
      handleFieldChange={handleFieldChange}
    />
    }
  }

  function showOnlyRow () {
    return <div className={classnames(style.tr, style.highlightRow)} key={props.id}>
      {<div className={classnames(style.td, style.Col_Name)} data-testid="itemDetails-name">
        <div className={style.flexRow}>
          <Indentation
            level={props.level}
            isNested={props.isNested}
            prefix={props.counterPrefix}
            indent={props.counter}
            isExpanded={props.isExpanded}
            onExpandCollapse={shouldShowExpandCollapse() ? handleExpandIcon : undefined}
          />
          <div className={style.flexGrow}>
            <TextFieldCell
              value={props.item?.name || ''}
              fieldName={ItemDetailsFields.name}
              readOnly={props.readOnly || isFieldReadonly(ItemDetailsFields.name)}
              placeholder={getI18Text('--enterName--')}
              forceValidate={props.forceValidate}
              formatter={(value) => value}
              validator={(value) => (!isFieldReadonly(ItemDetailsFields.name) && isEmpty(value))}
              onChange={handleFieldChange}
              onBlur={handleFieldChange}
              focused={props.isNewItem}
            />
          </div>
          {props.isNested && (totalChildren > 0) && <div className={style.childrenCount}>{totalChildren}</div>}
          {!isSection && <div className={style.maximize}>
            <OroTooltip title={getI18Text('--expandDetails--')} >
              <span className={classnames(style.maxBox, { [style.rowAlert]: error })} onClick={handleToggleDetails} >
                <span className={style.maxIcon}><Maximize2 size={16} /></span>
                {error && <span className={style.alertIcon}><AlertCircle size={10} />
                </span>}
              </span>
            </OroTooltip>
          </div>}
        </div>
      </div>
      }
      {!isSection && props.displayFields.map(mapConditionalCells)}

      {
        !props.readOnly &&
        <div className={classnames(style.td, style.noLB, style.Col_Action)}>
          <div className={style.menuDotsWrap}>
            <OroTooltip title={getI18Text('--actions--')}><MoreVertical className={style.menuDots} size={16} color="var(--warm-neutral-shade-200)" onClick={showMenuPopover} data-testid={`line-item-${props.counter}-more-btn`} /></OroTooltip>
            {menuPosition &&
              <BoxMenu
                id={props.counter}
                X={menuPosition.x}
                Y={menuPosition.y}
                addSection={(props.isNested && props.level < props.maxLevel) ? props.t('--itemList--.--addSection--') : ''}
                addItem={(props.isNested && props.level < props.maxLevel) ? props.t('--itemList--.--addButton--', { name: getI18ItemPrefix(props.prefix) }) : ''}
                view={!isSection ? getI18Text('--viewDetails--') : ''}
                duplicate={!isSection && !props.disableDuplicate ? getI18Text('--duplicate--') : ''}
                delete={!props.disableDelete ? getI18Text('--delete--') : ''}
                onClick={handleMenuClick}
              />
            }</div>
          {menuPosition && <div className={style.backdrop} onClick={hideMenuPopover}></div>}
        </div>
      }
      {/* </div> */}
    </div >
  }
  function showFullDetails () {
    return <div className={classnames(style.tr)} key={props.id}>
      <div className={classnames(style.flexRow, style.flexGrow, { [style.hide]: !props.showDetails })}>
        <div className={style.formCell}>
          <div className={classnames(style.flexCol, style.itemNameWrap)}>
            <div className={classnames(style.flexGrow, style.itemName)} data-testid="itemDetails-name">
              {getI18ItemPrefix(props.prefix)} {props.counterPrefix}{props.counter}
            </div>
            <InlineMenu
              id={props.counter}
              duplicate={!props.readOnly && !props.disableDuplicate ? getI18Text('--duplicate--') : ''}
              delete={!props.readOnly && !props.disableDelete ? getI18Text('--delete--') : ''}
              collapse={getI18Text('--collapseDetails--')}
              onClick={handleMenuClick}
            />
          </div>
          {renderChildren()}
        </div>
      </div>
    </div>
  }

  return props.showDetails ? showFullDetails() : showOnlyRow()
}
