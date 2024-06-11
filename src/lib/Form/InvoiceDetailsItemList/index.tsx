import React, { useEffect, useReducer, useRef, useState } from 'react'
import { InvoiceDetailsItemListFormData, InvoiceDetailsItemListProps, enumInvoiceItemsListFields } from './types';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import { ItemListV2 } from '../../Inputs/itemListV2.component';
import { Attachment, ItemListType } from '../../Types';
import { Option } from '../../Types'
import { Field } from '../types';
import { getFormFieldsMap, getFormattedAmountValue, isFieldDisabled, isFieldRequired, isOmitted, isRequired } from '../util';
import Grid from '@mui/material/Grid';
import { IValidationV2Response, itemListValidatorV2 } from '../../CustomFormDefinition/View/validator.service';
import { CustomFormDefinition, LocalLabels } from '../../CustomFormDefinition';
import { ItemListConfig } from '../../CustomFormDefinition/types/CustomFormModel';
import Actions from '../../controls/actions';
import { Title } from '../../controls/atoms';

export function InvoiceDetailsItemListForm (props: InvoiceDetailsItemListProps) {
  const [itemList, setItemList] = useState<ItemListType>({ items: [] })
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [poItemIdOptions, setPOItemIdOptions] = useState<Option[]>([])
  const [itemListConfig, setItemListConfig] = useState<ItemListConfig | null>(null)
  const [AllowNegativeInvoice, setAllowNegativeInvoice] = useState(false)
  const [areOptionsAvailableForMasterDataField, setAreOptionsAvailableForMasterDataField] = useReducer((
    state: { [fieldName: string]: boolean },
    action: {
      fieldName?: string,
      fieldValue?: boolean
    }
  ) => {
    return {
      ...state,
      [action.fieldName]: action.fieldValue
    }
  }, {})
  const [definitionsForExtensionCustomForms, setDefinitionsForExtensionCustomForms] = useReducer((
    state: { [formId: string]: CustomFormDefinition | null },
    action: {
      formId?: string,
      definition?: CustomFormDefinition | null
    }
  ) => {
    return {
      ...state,
      [action.formId]: action.definition
    }
  }, {})
  const [labelsForExtensionCustomForms, setLabelsForExtensionCustomForms] = useReducer((
    state: { [formId: string]: LocalLabels | null },
    action: {
      formId?: string,
      labels?: LocalLabels | null
    }
  ) => {
    return {
      ...state,
      [action.formId]: action.labels
    }
  }, {})

  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): InvoiceDetailsItemListFormData {
    return { itemList }
  }
  function getFieldConfig (fieldMap: { [key: string]: Field }, fieldName: string): Field {
    return fieldMap?.[fieldName]
  }

  function validateItemList (list) {
    if (!getFieldConfig(fieldMap, enumInvoiceItemsListFields.lineItemsRequired)?.booleanValue) {
      const noError: IValidationV2Response =  {
        hasError: false,
        parentIds: []
      }
    }

    let totalMoneyConfig
    if (props.subTotalMoney) {

      totalMoneyConfig = {
        totalMoney: props.subTotalMoney,
        errorMsg: t('--amountMismatchError--', { amount: `${getFormattedAmountValue(props.subTotalMoney)}` })
      }
    }
    // TODO
    // triggerValidations('')

    return itemListValidatorV2(list, {
      itemListConfig: itemListConfig,
      formDefinition: definitionsForExtensionCustomForms?.[itemListConfig?.questionnaireId?.formId],
      fieldName: enumInvoiceItemsListFields.itemList,
      options: props.options,
      areOptionsAvailableForMasterDataField,
      localLabels: labelsForExtensionCustomForms?.[itemListConfig?.questionnaireId?.formId],
      totalMoneyConfig,
      isNested: itemListConfig?.enableAddSubItems
    })
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {

      if (!isOmitted(fieldMap[fieldName]) && isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumInvoiceItemsListFields.itemList:
            invalidFieldId = fieldName
            // TODO compare with CHange PO form...
            const result = validateItemList(itemList)
            return result.hasError
        }
      }
    })
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()

    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // To get latest form fields data
  function fetchData (skipValidation?: boolean): InvoiceDetailsItemListFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }

  // to fill field values
  useEffect(() => {
    if (props.formData?.itemList) {
      setItemList(props.formData?.itemList)
      //setDataGridRows(parseRowsForDataGrid(props.formData.itemList, currency))
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [
        enumInvoiceItemsListFields.itemList,
        enumInvoiceItemsListFields.lineItemsRequired,
        enumInvoiceItemsListFields.allowNegative]
      const fieldMap = getFormFieldsMap(props.fields, fieldList)
      setFieldMap(fieldMap)
      setItemListConfig(getFieldConfig(fieldMap, enumInvoiceItemsListFields.itemList)?.itemConfig)
      const _negativeField = getFieldConfig(fieldMap, enumInvoiceItemsListFields.allowNegative)
      setAllowNegativeInvoice(_negativeField?.booleanValue ?? false)
    }
  }, [props.fields])

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [props.fields, itemList, props.subTotalMoney, props.invoicePO, fieldMap])

  useEffect(() => {
    setPOItemIdOptions(props.itemIdOptions)
    //setExpenseItemIdOptions(props.itemIdOptions)
  }, [props.itemIdOptions])


  function loadMasterDataOptions (masterDataType: string, masterDataConfig, fieldName): Promise<Option[]> | undefined {
    if (props.dataFetchers.getMasterdata) {
      return props.dataFetchers.getMasterdata(masterDataType, masterDataConfig)
        .then((resp: Option[]) => {
          // Remember masterdata options for fieldName
          setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: resp?.length > 0 })

          return resp
        }).catch(err => {
          console.log(err)
          setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: false })
          throw err
        })
    }
    return Promise.reject()
  }
  function loadExtensionCustomFormDefinition (formId: string): Promise<CustomFormDefinition> {
    if (props.events?.fetchExtensionCustomFormDefinition) {
      return props.events.fetchExtensionCustomFormDefinition(formId)
        .then((resp: CustomFormDefinition) => {
          // Remember formDefinition for formId
          setDefinitionsForExtensionCustomForms({ formId, definition: resp })
          return resp
        })
        .catch(err => {
          console.log(err)
          setDefinitionsForExtensionCustomForms({ formId, definition: null })
          throw err
        })
    }

    return Promise.reject()
  }

  function loadExtensionCustomFormLocalLabels (formId: string): Promise<LocalLabels> {
    if (props.events?.fetchExtensionCustomFormLocalLabels) {
      return props.events.fetchExtensionCustomFormLocalLabels(formId)
        .then((resp: LocalLabels) => {
          // Remember local labels for formId
          setLabelsForExtensionCustomForms({ formId, labels: resp })
          return resp
        })
        .catch(err => {
          console.log(err)
          setLabelsForExtensionCustomForms({ formId, labels: null })
          throw err
        })
    }

    return Promise.reject()
  }
  function handleItemChange (value?: ItemListType, file?: Attachment | File, attachmentName?: string) {
    setItemList(value)
  }
  function handleItemIDFilterApply (filter: Map<string, string[]>, type: string) {
    if (props.onItemIdFilterApply) {
      props.onItemIdFilterApply(filter)
        .then(resp => {
          if (type === enumInvoiceItemsListFields.itemList) {
            setPOItemIdOptions(resp)
          }
        })
        .catch(err => console.warn('Detected error while fetching filtered masterdata', err))
    }
  }

  return (
    <div ref={(node) => { storeRef(enumInvoiceItemsListFields.itemList, node) }} >
      <Grid container data-testid="item-list-field" spacing={2} pb={6}>
        <Grid item xs={12}>
          <Title>{t('--invoiceItems--')}</Title>
        </Grid>
        <Grid item xs={12}>
          <ItemListV2
            // TODO itemList and ItemList Component both shows error, so skip one
            skipValidator
            value={itemList}
            allowNegative={AllowNegativeInvoice}
            useItemDetailsV2={props.useItemDetailsV2}
            fieldName={enumInvoiceItemsListFields.itemList}
            config={itemListConfig}
            required={props.isReadOnly ? false : isFieldRequired(fieldMap, enumInvoiceItemsListFields.itemList)}
            disabled={props.isReadOnly ? true : isFieldDisabled(fieldMap, enumInvoiceItemsListFields.itemList)}
            disableCurrency={props.disableCurrency}
            forceValidate={props.isReadOnly ? false : forceValidate}
            defaultCurrency={props.defaultCurrency}

            // to be send from runner
            currencyOptions={props.currencyOptions}
            categoryOptions={props.categoryOptions}
            departmentOptions={props.departmentOptions}
            accountCodeOptions={props.accountCodeOptions}
            unitPerQtyOptions={props.unitPerQtyOptions}
            itemIdsOptions={poItemIdOptions}
            costCenterOptions={props.costCenterOptions}

            trackCodeOptions={props.trackCodeOptions}
            lineOfBusinessOptions={props.lineOfBusinessOptions}
            locationOptions={props.locationOptions}
            projectOptions={props.projectOptions}
            expenseCategoryOptions={props.expenseCategoryOptions}
            purchaseItemOptions={props.purchaseItemOptions}
            defaultAccountCode={props.defaultAccountCode}
            defaultDepartments={props.defaultDepartments}
            defaultLocations={props.defaultLocations}
            options={props.options}
            dataFetchers={{
              ...props.dataFetchers,
              getMasterdata: loadMasterDataOptions
            }}
            events={{
              ...props.events,
              fetchExtensionCustomFormDefinition: loadExtensionCustomFormDefinition,
              fetchExtensionCustomFormLocalLabels: loadExtensionCustomFormLocalLabels
            }}

            getDoucumentByPath={props.getDoucumentByPath}
            getDocumentByName={props.loadDocument}
            validator={(value) => validateItemList(value)}
            onChange={handleItemChange}
            onItemIdFilterApply={(filter) => handleItemIDFilterApply(filter, enumInvoiceItemsListFields.itemList)}
          />
        </Grid>
      </Grid>
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </div>
  )
}
