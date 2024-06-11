/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/
import React, { useEffect, useState } from 'react'
import { Box, Modal } from '@mui/material'
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync'
import { X } from 'react-feather'
import classnames from 'classnames'

import styles from './style.module.scss'

import { Option } from '../../Types'
import { FieldDiffs, ItemDetails } from '../../Types/common'
import { Events } from '../../CustomFormDefinition/NewView/FormView.component'
import { CommonLocalLabels, CustomFieldType, CustomFieldValue, CustomFormData, CustomFormDefinition, LocalLabels } from '../../CustomFormDefinition'
import { CustomFormField } from '../../CustomFormDefinition/types/CustomFormModel'
import { Section } from '../../CustomFormDefinition/types/CustomFormView'
import { RichTextEditor } from '../../RichTextEditor'
import { getMaterialBoxStyle } from '../popovers/utils'
import { useTranslationHook } from '../../i18n'
import { OroButton } from '../button/button.component'
import { TypeAhead } from '../../Inputs'

interface RowData { label: string, title?: boolean, values: CustomFieldValue[], diffs: boolean[] }
interface ItemFielDiffs {[itemName: string]: FieldDiffs}

const modalStyle = getMaterialBoxStyle({
  width: 'calc(100vw - 200px)',
  height: 'calc(100vh - 150px)'
})

export function ItemComparisonPopup (props: {
  isOpen: boolean
  items?: Array<ItemDetails>
  extensionFormId: string
  events?: Events
  prefix: string
  onClose: () => void
  getItemDiffs?: (firstItem: CustomFormData, otherItems: CustomFormData[]) => Promise<FieldDiffs[]>
}) {
  const { t } = useTranslationHook()
  const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)
  const [localLabels, setLocalLabels] = useState<LocalLabels | null>(null)
  const [rows, setRows] = useState<Array<RowData>>([])

  const [selectedRefItem, setSelectedRefItem] = useState<Option>()
  const [refItemOptions, setRefItemOptions] = useState<Option[]>([])
  const [itemFeildDiffs, setItemFieldDiffs] = useState<ItemFielDiffs>({})

  function getSectionTitle (sectionDefinition: Section): string {
    return (localLabels?.[sectionDefinition?.id] as CommonLocalLabels)?.title || sectionDefinition?.title
  }

  function getFieldName (fieldDefinition: CustomFormField): string {
    return (localLabels?.[fieldDefinition?.id] as CommonLocalLabels)?.name || fieldDefinition?.name
  }

  useEffect(() => {
    if (props.isOpen && props.items) {
      const options: Option[] = props.items.map((item, i) => {
        return {
          id: item.name,
          path: item.name,
          displayName: item.name // `${props.prefix} ${i+1}`
        }
      })
      setRefItemOptions(options)
      setSelectedRefItem(options[0])
    }
  }, [props.isOpen, props.items])

  useEffect(() => {
    const _rows: RowData[] = []
    if (props.isOpen && customFormDefinition) {
      // table header
      // const prefixes = props.items ? props.items.map((item, i) => `${props.prefix} ${i+1}`) : []
      // const headerDiffs = props.items ? props.items.map(item => false) : []
      // _rows.push({ label: '', title: true, values: prefixes, diffs: headerDiffs })
      const names = props.items ? props.items.map(item => item.name) : []
      const nameDiffs = props.items ? props.items.map(item => false) : []
      _rows.push({ label: '', title: true, values: names, diffs: nameDiffs })

      // item name
      // const names = props.items ? props.items.map(item => item.name) : []
      // const nameDiffs = props.items ? props.items.map(item => false) : []
      // _rows.push({ label: t('--itemList--.--name--'), values: names, diffs: nameDiffs })

      customFormDefinition.view.sections.forEach(section => {
        // section title
        const values = props.items ? props.items.map(item => '') : []
        const sectionDiffs = props.items ? props.items.map(item => false) : []
        _rows.push({ label: getSectionTitle(section), title: true, values, diffs: sectionDiffs })

        section.grids.forEach(grid => {
          grid.fields.forEach(field => {
            // field values
            // handle only text and number
            if (field.field.customFieldType === CustomFieldType.string || field.field.customFieldType === CustomFieldType.textArea || field.field.customFieldType === CustomFieldType.number) {
              const values = props.items ? props.items.map(item => item.data?.[field.field.fieldName]) : []
              const valueDiffs = props.items ? props.items.map(item => (itemFeildDiffs[item.name]?.[field.field.fieldName]?.changed || false)) : []
              // skip rows(fields) with all empty values
              const isValuePresent = values.some(value => !!value)
              if (isValuePresent) {
                _rows.push({ label: getFieldName(field.field), values, diffs: valueDiffs })
              }
            }
          })
        })
      })
    }
    setRows(_rows)
  }, [props.isOpen, customFormDefinition, props.items, itemFeildDiffs])

  useEffect(() => {
    if (props.isOpen && selectedRefItem && props.getItemDiffs) {
      // fetch highlights
      let firstItem: ItemDetails
      const otherItems: Array<ItemDetails> = []
      props.items.forEach(item => {
        if (item.name === selectedRefItem.path) {
          firstItem = item
        } else {
          otherItems.push(item)
        }
      })
      props.getItemDiffs(firstItem.data || {}, otherItems.map(item => (item.data || {})))
        .then((res: FieldDiffs[]) => {
          const _itemFieldDiffs: ItemFielDiffs = {}
          otherItems.forEach((item, i) => {
            _itemFieldDiffs[item.name] = res[i]?.fieldDiffs || {}
          })
          setItemFieldDiffs(_itemFieldDiffs)
        })
        .catch(err => console.warn('ItemComparisonPopup: Could not fetch item diffs - ', err))
    } else {
      // clear highlights
      setItemFieldDiffs({})
    }
  }, [props.isOpen, selectedRefItem])

  function closePopup () {
    // Reset state
    setRows([])
    setRefItemOptions([])
    setSelectedRefItem(undefined)
    setItemFieldDiffs({})

    props.onClose()
  }

  function fetchCustomFormDefinition (id: string) {
    if (props.events?.fetchExtensionCustomFormDefinition) {
      props.events?.fetchExtensionCustomFormDefinition(id)
        .then(resp => {
          setCustomFormDefinition(resp)
          // props.onFormDefinitionLoad && props.onFormDefinitionLoad(id, resp)
        })
        .catch(err => console.log('ItemComparisonPopup: Error in fetching custom form definition', err))
    }
  }

  function fetchLocalLabels (id: string) {
    if (props.events?.fetchExtensionCustomFormLocalLabels) {
      props.events?.fetchExtensionCustomFormLocalLabels(id)
        .then(resp => {
          setLocalLabels(resp)
        })
        .catch(err => console.log('ItemComparisonPopup: Error in fetching custom form local labels', err))
    }
  }

  useEffect(() => {
    if (props.extensionFormId) {
      fetchCustomFormDefinition(props.extensionFormId)
      fetchLocalLabels(props.extensionFormId)
    }
  }, [props.extensionFormId])

  return (
    <Modal open={props.isOpen} onClose={closePopup}>
      <Box sx={modalStyle}>
        <div className={styles.itemComparisonModal}>
          <div className={styles.headerBar}>
            <div className={styles.title}>{t('--itemList--.--compare--')}</div>

            <div className={styles.refLabel}>{t('--itemList--.--highlightDifferencesBasedOn--')}</div>
            <div className={styles.refSelector}>
              <TypeAhead
                options={refItemOptions}
                value={selectedRefItem}
                placeholder={t('--itemList--.--select--', {itemName: props.prefix})}
                disableTypeahead
                hideClearButton
                applyFullWidth
                absolutePosition
                noBorder
                onChange={setSelectedRefItem}
              />
            </div>

            <div className={styles.spread}></div>

            <OroButton type='link' icon={<X size={20} color={'var(--warm-neutral-shade-500)'} />} className={styles.closeBtn} onClick={closePopup} />
          </div>

          <ScrollSync>
            <div>
              <div className={styles.itemTable} id="lineItemComparison">
                {rows.map((row, i) =>
                  <ScrollSyncPane key={i}>
                    <div className={classnames(styles.row, {[styles.bold]: row.title})}>
                      <div className={styles.headerCol}>
                        <RichTextEditor
                          value={row.label}
                          className={`oro-rich-text-question`}
                          readOnly={true}
                          hideToolbar={true}
                        />
                      </div>
                      {row.values.map((value, i) =>
                        <div key={i} className={classnames(styles.valueCol,
                          {
                            [styles.empty]: !value,
                            [styles.bold]: (value === selectedRefItem?.displayName),
                            [styles.highlight]: row.diffs[i]
                          })}
                        >
                        <>{value}</> 
                        {/* Added a fragment to supress the linting error */}
                        </div>)}
                    </div>
                  </ScrollSyncPane>
                )}
              </div>
              <ScrollSyncPane>
                <div className={classnames(styles.row, styles.scrollbar)}>
                  <div className={styles.headerCol} />
                  {rows[0]?.values?.map((value, i) => <div key={i} className={styles.valueCol} />)}
                </div>
              </ScrollSyncPane>
            </div>
          </ScrollSync>
        </div>
      </Box>
    </Modal>
  )
}
