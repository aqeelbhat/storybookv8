
import React, { useEffect, useState } from 'react'

import { Option } from './../Types'
import { ItemListConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { Attachment, IDRef, ItemDetails, ItemListType, } from '../Types/common'
import { InputWrapper } from './input.component'

import styles from './styles.module.scss'
import { DataFetchers, Events, FieldOptions } from '../CustomFormDefinition/NewView/FormView.component'
import { ItemDetailsControlNew } from '../controls/itemDetailsControl.component'
import { ItemDetailsSize } from '../controls/itemDetailsV2/types'
import { CustomFormData, CustomFormDefinition } from '../CustomFormDefinition'

interface ItemListProps {
  skipValidator?: boolean
  value?: ItemListType
  oldValue?: ItemListType
  fieldName: string
  config?: ItemListConfig
  label?: string
  required?: boolean
  disabled?: boolean
  disableCurrency?: boolean
  forceValidate?: boolean
  defaultCurrency?: string
  currencyOptions?: Option[]
  categoryOptions?: Option[]
  departmentOptions?: Option[]
  accountCodeOptions?: Option[]
  unitPerQtyOptions?: Option[]
  costCenterOptions?: Option[]
  itemIdsOptions?: Option[]
  trackCodeOptions?: Option[]
  lineOfBusinessOptions?: Option[]
  locationOptions?: Option[]
  projectOptions?: Option[]
  expenseCategoryOptions?: Option[]
  purchaseItemOptions?: Option[]
  defaultAccountCode?: IDRef
  options?: FieldOptions
  events?: Events
  dataFetchers?: DataFetchers
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  useItemDetailsV2?: boolean
  size?: ItemDetailsSize
  getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>
  validator?: (value?: ItemListType) => string
  onChange?: (value?: ItemListType, file?: Attachment | File, attachmentName?: string) => void
  onItemIdFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}

export function ItemList (props: ItemListProps) {
  const [state, setState] = useState<ItemListType>({items: []})
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    if (!props.skipValidator && props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  function handleChange (value: {items: Array<ItemDetails>}, file?: Attachment | File, attachmentName?: string, filter?: Map<string, string[]>) {
    setState(value)
    if (!props.skipValidator && props.validator) {
      const err = props.validator(value)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(value, file, attachmentName)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.textarea}
      error={error}
    >
      <ItemDetailsControlNew
        value={state}
        size={props.size}
        oldValue={props.oldValue}
        readOnly={props.disabled}
        config={{
          optional: !props.required,
          disableCurrency: props.disableCurrency,
          forceValidate: props.forceValidate,
          itemListConfig: props.config,
          fieldName: props.fieldName || '',
          areOptionsAvailableForMasterDataField: props.areOptionsAvailableForMasterDataField
        }}
        additionalOptions={{
          currency: props.currencyOptions,
          country: props.options?.country,
          defaultCurrency: props.defaultCurrency,
          category: props.categoryOptions,
          departments: props.departmentOptions,
          accountCode: props.accountCodeOptions,
          costCenters: props.costCenterOptions,
          unitPerQuantity: props.unitPerQtyOptions,
          itemIds: props.itemIdsOptions,
          lineOfBusiness: props.lineOfBusinessOptions,
          trackCode: props.trackCodeOptions,
          defaultAccountCode: props.defaultAccountCode,
          defaultDepartments: props.defaultDepartments,
          defaultLocations: props.defaultLocations,
          locations: props.locationOptions,
          projects: props.projectOptions,
          expenseCategories: props.expenseCategoryOptions,
          purchaseItems: props.purchaseItemOptions,
          documentType: props.options?.documentType,
          draftDocuments: props.options?.draftDocuments,
          signedDocuments: props.options?.signedDocuments,
          finalisedDocuments: props.options?.finalisedDocuments,
          isSingleColumnLayout: props.options?.isSingleColumnLayout,
          canShowTranslation: props.options?.canShowTranslation
        }}
        dataFetchers={{
          ...props.dataFetchers,
          getDoucumentByPath: props.dataFetchers?.getDoucumentByPath,
          getDocumentByName: props.dataFetchers?.getDocumentByName,
          getDoucumentByUrl: props.dataFetchers?.getDoucumentByUrl,
          getDoucumentUrlById: props.dataFetchers?.getDoucumentUrlById
        }}
        events={props.events}
        validator={props.validator}
        onChange={handleChange}
        onItemIdFilterApply={props.onItemIdFilterApply}
        onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
        onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
      />
    </InputWrapper>
  )
}
