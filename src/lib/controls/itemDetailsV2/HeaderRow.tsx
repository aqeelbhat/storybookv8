/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import classNames from 'classnames'
import style from './style.module.scss'
import React from 'react'
import { ItemDetailsFields } from '../../CustomFormDefinition'
import { Repeat } from 'react-feather'
import { OroButton } from '../button/button.component'
import { useTranslationHook } from '../../i18n'

interface IHeaderRowProps {
  isSmallView: boolean
  prefix: string
  isFieldVisible: (fieldName: ItemDetailsFields) => boolean
  displayFields: Array<ItemDetailsFields>
  getI18Text: (key: string) => string
  isReadOnly: boolean
  canCompare: boolean
  onCompare: () => void
}
const FieldsI18Keys = {
  ['quantityWithUnit']: '--qtyUnit--',
  [ItemDetailsFields.quantity]: '--qty--',
  [ItemDetailsFields.price]: '--price--',
  [ItemDetailsFields.tax]: '--tax--',
  [ItemDetailsFields.totalPrice]: '--amount--'
}

export function HeaderRow (props: IHeaderRowProps) {
  const { t } = useTranslationHook()
  const { prefix, isSmallView, isFieldVisible, getI18Text, isReadOnly, displayFields, canCompare, onCompare } = props

  // except Total Price, columns not visible for small view
  const mapConditionalColumnField = function (fieldName) {
    // only Visible Fields Allowed as column
    if(!isFieldVisible(fieldName)) {
      return null
    }
    let i18Key = ''
    if (fieldName === ItemDetailsFields.totalPrice) {
      i18Key = FieldsI18Keys[fieldName]
    } else if (fieldName === ItemDetailsFields.quantity && isFieldVisible(ItemDetailsFields.unitForQuantity)) {
      i18Key = isSmallView ? '' : FieldsI18Keys['quantityWithUnit']
    } else {
      i18Key = isSmallView ? '' : FieldsI18Keys[fieldName]
    }
    return !i18Key ? null : <span className={classNames(style.td)}>{getI18Text(i18Key)}</span>
  }

  return <div className={style.th}>
    <span className={classNames(style.td, style.Col_Name)}>{prefix}</span>
    {displayFields.map(mapConditionalColumnField)}
    {!isReadOnly && <span className={classNames(style.td, style.noLB, style.Col_Action)}></span>}
    {canCompare &&
      <div className={classNames(style.td, style.noLB, style.Col_Compare)}>
        <OroButton label={t('--itemList--.--compare--')} type='link' icon={<Repeat size={16} />} onClick={onCompare} />
      </div>}
  </div>
}
