/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useState } from 'react'

import styles from './styles.module.scss'

import { ItemTypeOption, PaymentItemListProps, PaymentItemProps } from './type'
import { Grid } from '@mui/material'
import { COL4, isEmpty, isNullable, isNullableOrEmpty, mapIDRefToOption, mapOptionToIDRef } from '../util'
import { MoneyControlNew, OroButton } from '../../controls'
import { Plus } from 'react-feather'
import { ItemDetails, Money, Option } from '../../Types'
import { DEFAULT_CURRENCY, getItemSupplierAmount, getLineItemsTotalPrice } from '../../util'
import { getSessionLocale } from '../../sessionStorage'
import { NumberBox, Radio, TextArea, TypeAhead } from '../../Inputs'
import { useTranslationHook, getI18Text as getI18ControlText, I18Suspense } from '../../i18n'
import { ItemType } from '../../Types/common'
import { ItemDetailsFields } from '../../CustomFormDefinition'
import { Cost } from '../types'
import { getValueFromAmount } from '../../Inputs/utils.service'
import { OptionTreeData } from '../../MultiLevelSelect/types'

function PaymentItemListComponent (props: PaymentItemListProps) {
  const [items, setItems] = useState<ItemDetails[]>([])
  const [draftOpen, setDraftOpen] = useState<boolean>(false)
  const [totalOfItemsList, setTotalOfItemsList] = useState<Money>()

  useEffect(() => {
    setItems(props.data)
  }, [props.data])

  function calculateTotalPrice (items: Array<ItemDetails>) {
    setTotalOfItemsList(getLineItemsTotalPrice(items))
  }

  useEffect(() => {
    calculateTotalPrice(items)
  }, [items])

  function addItem (item: ItemDetails) {
    const updatedList = [...items, item]
    setItems(updatedList)
    setDraftOpen(false)
    props.onChange(updatedList)
  }

  function getTotalAmount (): string {
    return totalOfItemsList?.amount > 0
      ? Number(totalOfItemsList.amount).toLocaleString(getSessionLocale()) + totalOfItemsList.currency
      : '-'
  }

  function handleChange (itemIndex: number, data: ItemDetails) {
    const updatedItems = [...items]
    updatedItems[itemIndex] = data
    setItems(updatedItems)

    props.onChange(updatedItems)
  }

  return (
    <div className={styles.paymentItemList}>
      <Grid container spacing={2.5} pb={4}>
        {!props.single && (items.length > 0) &&
          <Grid item xs={COL4}>
            <div className={styles.itemDetailList} data-testid="payment-item-list">
              {items.map((item, i) =>
                <PaymentItemDetails
                  data={item}
                  basisPoint={props.basisPoint}
                  categoryOptions={props.categoryOptions}
                  currencyOptions={props.currencyOptions}
                  defaultCurrency={props.defaultCurrency}
                  userSelectedCurrency={props.userSelectedCurrency}
                  forceValidate={props.forceValidate}
                  onCurrencyChange={props.onCurrencyChange}
                  fetchChildren={props.fetchChildren}
                  searchOptions={props.searchOptions}
                  key={i}
                />)}
            </div>
          </Grid>}
        {props.single &&
          <Grid item xs={COL4}>
            <div className={styles.newItem} data-testid="new-payment-item">
              <PaymentItemForm
                data={items[0]}
                basisPoint={props.basisPoint}
                categoryOptions={props.categoryOptions}
                currencyOptions={props.currencyOptions}
                defaultCurrency={props.defaultCurrency}
                userSelectedCurrency={props.userSelectedCurrency}
                forceValidate={props.forceValidate}
                onCurrencyChange={props.onCurrencyChange}
                fetchChildren={props.fetchChildren}
                searchOptions={props.searchOptions}
                onChange={(data) => handleChange(0, data)}
              />
            </div>
          </Grid>}

        {draftOpen &&
          <Grid item xs={COL4}>
            <div className={styles.newItem} data-testid="new-payment-item">
              <PaymentItemForm
                basisPoint={props.basisPoint}
                categoryOptions={props.categoryOptions}
                currencyOptions={props.currencyOptions}
                defaultCurrency={props.defaultCurrency}
                userSelectedCurrency={props.userSelectedCurrency}
                forceValidate={props.forceValidate}
                onCurrencyChange={props.onCurrencyChange}
                fetchChildren={props.fetchChildren}
                searchOptions={props.searchOptions}
                onCancel={() => setDraftOpen(false)}
                onSave={addItem}
              />
            </div>
          </Grid>}

        {!props.single && !draftOpen &&
          <Grid item xs={COL4}>
            <div className={styles.addItem} data-testid="add-item-button">
              <OroButton
                label={getI18ControlText('--itemList--.--addLineItem--')} icon={<Plus size={16} />} type='secondary' radiusCurvature='medium'
                onClick={() => setDraftOpen(true)} />
            </div>
          </Grid>}

        {!props.single &&
          <Grid item xs={COL4}>
            <div className={styles.totalAmount} data-testid="total-amount">
              <span>{getI18ControlText('--itemList--.--totalAmountToBePaid--')} </span><span className={styles.amount}>{getTotalAmount()}</span>
            </div>
          </Grid>}
      </Grid>
    </div>
  )
}
export function PaymentItemList (props: PaymentItemListProps) {
  return <I18Suspense><PaymentItemListComponent  {...props} /></I18Suspense>
}

function PaymentItemDetailsComponent (props: PaymentItemProps) {
  return (
    <div className={styles.paymentItemDetails}>
      <Grid item xs={COL4}>
        <div>{getI18ControlText('--itemList--.--item--')}</div>
      </Grid>
    </div>
  )
}
function PaymentItemDetails (props: PaymentItemProps) {
  return <I18Suspense><PaymentItemDetailsComponent  {...props} /></I18Suspense>
}

function PaymentItemFormComponent (props: PaymentItemProps) {
  const CURRENCY = props.defaultCurrency || DEFAULT_CURRENCY
  const DEFAULT_COST = { amount: undefined, currency: CURRENCY }

  const { t } = useTranslationHook()
  const [itemType, setItemType] = useState<Option | undefined>()
  const [categoryValue, setCategoryValue] = useState<Option | undefined>()
  const [description, setDescription] = useState<string | undefined>()
  const [totalPrice, setTotalPrice] = useState<Cost>(DEFAULT_COST)
  const [supplierPayment, setSupplierPayment] = useState<Cost>(DEFAULT_COST)
  const [quantity, setQuantity] = useState<number | undefined>()

  useEffect(() => {
    if (props.data) {
      if (props.data.type) {
        ItemTypeOption.forEach(option => {
          if (option.id === props.data.type) {
            setItemType(option)
          }
        })
      }
      if (Array.isArray(props.data.categories) && props.data.categories.length > 0) {
        setCategoryValue(props.data.categories.map(mapIDRefToOption)[0])
      } else {
        setCategoryValue(undefined)
      }
      setDescription(props.data.description || '')
      setTotalPrice({ amount: (props.data.totalPrice?.amount ? props.data.totalPrice?.amount.toString() : undefined), currency: props.data.totalPrice?.currency || CURRENCY })
      if (!supplierPayment?.amount) {
        setSupplierPayment({
          amount: (props.data.totalPrice?.amount ? getItemSupplierAmount(props.data, props.basisPoint).toString() : undefined),
          currency: props.data.totalPrice?.currency || CURRENCY
        })
      }
      setQuantity(props.data.quantity)
    }
  }, [props.data])

  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }

  function getLineItemData (): ItemDetails {
    return {
      id: props.data?.id,
      type: itemType?.id ? itemType.id as ItemType : undefined,
      name: props.data?.name,
      categories: categoryValue ? [mapOptionToIDRef(categoryValue)] : [],
      description,
      totalPrice: { amount: Number(totalPrice?.amount), currency: totalPrice?.currency }
    }
  }

  // Setting current item context and passed to line item extension form
  function handleLineItemFieldChange (fieldName: string, value: Option | string | number | Cost) {
    const _updatedLineItem = getLineItemData()

    switch (fieldName) {
      case ItemDetailsFields.type:
        const _type = value as Option
        _updatedLineItem.type = _type?.id as ItemType || undefined
        break
      case ItemDetailsFields.categories:
        const _category = value as Option
        _updatedLineItem.categories = _category ? [mapOptionToIDRef(_category)] : []
        break
      case ItemDetailsFields.description:
        _updatedLineItem.description = value as string
        break
      case ItemDetailsFields.totalPrice:
        const _total = value as Cost
        _updatedLineItem.totalPrice = { amount: Number(_total?.amount), currency: _total?.currency }
        break
      case ItemDetailsFields.quantity:
        _updatedLineItem.quantity = value as number
        break
    }

    props.onChange(_updatedLineItem)
  }

  function handleCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function handleSave () {
    if (props.onSave) {
      props.onSave({
        id: 'item'
      })
    }
  }

  function handleSupplierAmount (value: Cost) {
    setSupplierPayment(value)

    const supplierAmount = value.amount ? Number(value.amount) : 0
    const totalAmount = supplierAmount * (1 + props.basisPoint)
    const _totalPrice = {
      amount: value.amount ? totalAmount.toString() : undefined,
      currency: value.currency
    }
    setTotalPrice(_totalPrice)
    handleLineItemFieldChange(ItemDetailsFields.totalPrice, _totalPrice)
  }

  return (
    <div className={styles.paymentItemForm}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <div className={styles.label}>{getI18Text('--typeOfPurchase--')}</div>
        </Grid>
        <Grid item xs={8}>
          <div>
            <Radio
              id='itemDetailsFieldsType'
              name={ItemDetailsFields.type}
              value={itemType}
              options={ItemTypeOption.map(option => { return { ...option, displayName: getI18Text('--itemType--.' + option.id) || option.displayName }})}
              required={true}
              forceValidate={props.forceValidate}
              showHorizontal={true}
              validator={(value) => isEmpty(value) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
              onChange={(value) => { setItemType(value); handleLineItemFieldChange(ItemDetailsFields.type, value) }}
            />
          </div>
        </Grid>

        <Grid item xs={4}>
          <div className={styles.label}>{getI18Text('--purchasingCategory--')}</div>
        </Grid>
        <Grid item xs={8}>
          <div>
            <TypeAhead
              placeholder={getI18Text('--selectCategory--')}
              value={categoryValue}
              type={OptionTreeData.category}
              showTree={true}
              options={props.categoryOptions || []}
              required
              forceValidate={props.forceValidate}
              fetchChildren={(parent, childrenLevel) => props.fetchChildren(parent, childrenLevel, 'Category')}
              onSearch={(keyword) => props.searchOptions(keyword, 'Category')}
              validator={(value) => (isEmpty(value)) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
              onChange={(value) => { setCategoryValue(value); handleLineItemFieldChange(ItemDetailsFields.categories, value) }}
            />
          </div>
        </Grid>

        <Grid item xs={4}>
          <div className={styles.label}>{getI18Text('--description--')}</div>
        </Grid>
        <Grid item xs={8}>
          <div>
            <TextArea
              value={description}
              required={false}
              placeholder={getI18Text('--addDescription--')}
              forceValidate={props.forceValidate}
              // validator={(value) => (isEmpty(value)) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
              onChange={value => { setDescription(value); handleLineItemFieldChange(ItemDetailsFields.description, value) }}
            />
          </div>
        </Grid>

        <Grid item xs={4}>
          <div className={styles.label}>{getI18Text('--amountLabel--')}</div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <div className={styles.label}>{getI18Text('--supplierGets--')}</div>
            <MoneyControlNew
              value={supplierPayment}
              config={{
                forceValidate: props.forceValidate
              }}
              additionalOptions={{
                currency: props.currencyOptions,
                defaultCurrency: props.defaultCurrency,
                userSelectedCurrency: props.userSelectedCurrency
              }}
              validator={(value) => (!value?.amount) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
              onChange={(value) => handleSupplierAmount(value) }
              onCurrencyChange={props.onCurrencyChange}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <div className={styles.label}>{getI18Text('--youPay--')}</div>
            <MoneyControlNew
              value={totalPrice}
              config={{
                isReadOnly: true,
                disableCurrency: true
              }}
              additionalOptions={{
                currency: props.currencyOptions,
                defaultCurrency: props.defaultCurrency,
                userSelectedCurrency: props.userSelectedCurrency
              }}
              disabled={true}
            />
          </div>
        </Grid>

        {(itemType?.path === ItemType.goods) && <>
          <Grid item xs={4}>
            <div className={styles.label}>{getI18Text('--quantity--')}</div>
          </Grid>
          <Grid item xs={8}>
            <div>
              <NumberBox
                value={!isNullable(quantity) ? quantity.toString() : ''}
                placeholder={getI18Text('--enterQuantity--')}
                id={ItemDetailsFields.quantity}
                decimalLimit={5}
                required
                forceValidate={props.forceValidate}
                validator={(value) => (isNullableOrEmpty(value)) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
                onChange={(value) => { setQuantity(Number(getValueFromAmount(value))); handleLineItemFieldChange(ItemDetailsFields.quantity, Number(getValueFromAmount(value))) }}
              />
            </div>
          </Grid>
        </>}

        {(props.onCancel || props.onSave) &&
          <Grid item xs={COL4} pt={4}>
            <div className={styles.action}>
              {props.onCancel && <OroButton label={getI18Text('--cancel--')} type='secondary' radiusCurvature='medium' onClick={handleCancel} />}
              {props.onSave && <OroButton label={getI18Text('--save--')} type='primary' radiusCurvature='medium' onClick={handleSave} />}
            </div>
          </Grid>}
      </Grid>
    </div>
  )
}
function PaymentItemForm (props: PaymentItemProps) {
  return <I18Suspense><PaymentItemFormComponent  {...props} /></I18Suspense>
}