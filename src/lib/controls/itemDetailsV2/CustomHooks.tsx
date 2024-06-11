/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import { useEffect, useState } from "react"
import { CustomFormDefinition, ItemDetailsFields } from "../../CustomFormDefinition"
import { ItemListConfig } from "../../CustomFormDefinition/types/CustomFormModel"
import { Option } from '../../Types'
import { IAdditionalOptions } from "./types"

const defaultColumns = [
  ItemDetailsFields.name,
  ItemDetailsFields.price,
  ItemDetailsFields.quantity,
  ItemDetailsFields.tax,
  ItemDetailsFields.totalPrice
]
// For Fields Visibility Config
export function useConfigFields (itemListConfig?: ItemListConfig) {
  const [visibleFields, setVisibleFields] = useState<Array<ItemDetailsFields>>([])
  const [readonlyFields, setReadonlyFields] = useState<Array<ItemDetailsFields>>([])
  const [mandatoryFields, setMandatoryFields] = useState<Array<ItemDetailsFields>>([])
  const [displayFields, setDisplayFields] = useState<Array<ItemDetailsFields>>(defaultColumns)

  useEffect(() => {
    if (itemListConfig) {
      if (Array.isArray(itemListConfig.visibleFields)) {
        setVisibleFields(itemListConfig.visibleFields)
      }

      if (Array.isArray(itemListConfig.mandatoryFields)) {
        setMandatoryFields(itemListConfig.mandatoryFields)
      }

      if (Array.isArray(itemListConfig.readonlyFields)) {
        setReadonlyFields(itemListConfig.readonlyFields)
      }

      if (Array.isArray(itemListConfig.displayFields)) {
        setDisplayFields(itemListConfig.displayFields)
      }
    }
  }, [itemListConfig])

  return [visibleFields, readonlyFields, mandatoryFields, displayFields]
}

// For additional Fields
export function useAdditionalOptions (additionalOptions: IAdditionalOptions) {
  const [categories, setCategories] = useState<Array<Option>>([])
  const [departments, setDepartments] = useState<Array<Option>>([])
  const [accountCode, setAccountCode] = useState<Array<Option>>([])
  const [itemIdOptions, setItemIdOption] = useState<Array<Option>>([])
  const [lineOfBusinessOption, setLineOfBusinessOption] = useState<Array<Option>>([])
  const [locationOption, setLocationOption] = useState<Array<Option>>([])
  const [projectOption, setProjectOption] = useState<Array<Option>>([])
  const [expenseCategoryOption, setExpenseCategoryOption] = useState<Array<Option>>([])
  const [purchaseItemOptions, setPurchaseItemOption] = useState<Array<Option>>([])
  const [unitPerQuantityOptions, setUnitPerQuantityOptions] = useState<Array<Option>>([])
  const [trackCodeOptions, setTrackCodeOptions] = useState<Array<Option>>([])
  const [costCenters, setCostCenters] = useState<Array<Option>>([])

  useEffect(() => {
    if (additionalOptions?.category) {
      setCategories(additionalOptions.category)
    }

    if (additionalOptions?.departments) {
      setDepartments(additionalOptions.departments)
    }
    if (additionalOptions?.costCenters) {
      setCostCenters(additionalOptions.costCenters)
    }

    if (additionalOptions?.accountCode) {
      setAccountCode(additionalOptions.accountCode)
    }

    if (additionalOptions?.unitPerQuantity) {
      setUnitPerQuantityOptions(additionalOptions.unitPerQuantity)
    }

    if (additionalOptions?.itemIds) {
      setItemIdOption(additionalOptions?.itemIds)
    }

    if (additionalOptions?.lineOfBusiness) {
      setLineOfBusinessOption(additionalOptions?.lineOfBusiness)
    }

    if (additionalOptions?.trackCode) {
      setTrackCodeOptions(additionalOptions?.trackCode)
    }

    if (additionalOptions?.locations) {
      setLocationOption(additionalOptions?.locations)
    }

    if (additionalOptions?.projects) {
      setProjectOption(additionalOptions?.projects)
    }

    if (additionalOptions?.expenseCategories) {
      setExpenseCategoryOption(additionalOptions?.expenseCategories)
    }

    if (additionalOptions?.purchaseItems) {
      setPurchaseItemOption(additionalOptions?.purchaseItems)
    }
  }, [additionalOptions])

  return [categories, departments, accountCode, itemIdOptions, lineOfBusinessOption, locationOption, projectOption, expenseCategoryOption, purchaseItemOptions, unitPerQuantityOptions, trackCodeOptions, costCenters]
}

// For Custom Form configuration fetch
export function useCustomForm (questionnaireId, fetchExtensionCustomFormDefinition) {
  const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)

  function fetchCustomFormDefinition (id: string) {
    if (fetchExtensionCustomFormDefinition) {
      fetchExtensionCustomFormDefinition(id)
        .then(resp => {
          setCustomFormDefinition(resp)
        })
        .catch(err => console.log('Item Details: Error in fetching custom form definition', err))
    }
  }
  useEffect(() => {
    if (questionnaireId?.formId) {
      fetchCustomFormDefinition(questionnaireId?.formId)
    }
  }, [questionnaireId])

  return [customFormDefinition]
}
