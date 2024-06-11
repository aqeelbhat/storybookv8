/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import { useEffect, useMemo, useState } from "react"
import { CustomFieldType, CustomFormData, CustomFormDefinition, FormView, LocalLabels } from ".."
import { ICustomFormV2ExtensionProps } from "./types"
import { DocumentRef } from "../../Form/types"
import { Attachment } from "../../Types"
import React from "react"
import style from './style.module.scss'
import { debounce } from "../../util"

export function CustomFormExtension (props: ICustomFormV2ExtensionProps) {

  const [customFormData, setCustomFormData] = useState<CustomFormData | CustomFormData[] | null>(null)
  const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)
  const [localLabels, setLocalLabels] = useState<LocalLabels | null>(null)
  const isItemContextFieldFound = props.isItemContextFieldFound || false

  useEffect(() => {
    if (props.currentLineItem && props.isItemContextFieldFound) {
      // set current line item context into form data to work visibility conditions.
      setCustomFormData({ ...customFormData, _current: props.currentLineItem })
    }
  }, [props.currentLineItem, props.isItemContextFieldFound])

  function fetchCustomFormDefinition (id: string) {
    if (props.events?.fetchExtensionCustomFormDefinition) {
      props.events?.fetchExtensionCustomFormDefinition(id)
        .then(resp => {
          setCustomFormDefinition(resp)
          props.onFormDefinitionLoad && props.onFormDefinitionLoad(id, resp)
        })
        .catch(err => console.log('Item Details: Error in fetching custom form definition', err))
    }
  }

  function fetchLocalLabels (id: string) {
    if (props.events?.fetchExtensionCustomFormLocalLabels) {
      props.events?.fetchExtensionCustomFormLocalLabels(id)
        .then(resp => {
          setLocalLabels(resp)
        })
        .catch(err => console.log('Item Details: Error in fetching custom form local labels', err))
    }
  }

  function fetchCustomFormData (id: string, formData?: CustomFormData) {
    if (props.events?.fetchExtensionCustomFormData) {
      props.events?.fetchExtensionCustomFormData(id, formData)
        .then(resp => {
          if (props.isFormDataList) {
            setCustomFormData(resp ? [resp] : null)
          } else {
            setCustomFormData(resp || null)
          }
        })
        .catch(err => console.log('Item Details: Error in fetching custom form data', err))
    }
  }

  function refreshCustomFormData (id: string, formData: CustomFormData) {
    if (props.events?.refreshExtensionCustomFormData) {
      props.events?.refreshExtensionCustomFormData(id, formData)
        .then(resp => {
          if (Array.isArray(resp)) {
            setCustomFormData(resp as CustomFormData[])
          } else {
            setCustomFormData(resp || null)
          }
        })
        .catch(err => console.log('Item Details: Error in refresh custom form data', err))
    }
  }

  // #6363779122:
  // In 1st render cycle, fetchCustomFormData() was getting called, since props.customFormData was not loaded.
  // Once props.customFormData is loaded, refreshCustomFormData() was called.
  // These 2 had race condition, leading to inconsistent behaviour.
  // Debounced fetch/refresh call to fix it.
  function initData (operation: 'create' | 'refresh', formId: string, formData: CustomFormData) {
    fetchCustomFormDefinition(formId)
    fetchLocalLabels(formId)
    switch (operation) {
      case 'refresh':
        refreshCustomFormData(formId, formData)
        break
      case 'create':
        fetchCustomFormData(formId, formData)
        break
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedInitData = useMemo(() => debounce(initData), [])

  useEffect(() => {
    if (props.questionnaireId?.formId) {
      if (props.customFormData) {
        // In case of line item extension form send current line item context with form data.
        const _formData = (props.currentLineItem && isItemContextFieldFound) ? { ...props.customFormData, _current: props.currentLineItem } : props.customFormData
        debouncedInitData('refresh', props.questionnaireId?.formId, _formData)
      } else {
        // In case of line item extension form send current line item context with form data.
        const _formData = (props.currentLineItem && isItemContextFieldFound) ? { _current: props.currentLineItem } : {}
        debouncedInitData('create', props.questionnaireId?.formId, _formData)
      }
    }
  }, [props.questionnaireId, props.customFormData])

  function getUpdatedFormDataList (index: number, formData: CustomFormData[], updatedFormData: CustomFormData): CustomFormData[] {
    const formDataList = formData?.map((data, indexEle) => indexEle === index ? updatedFormData : data)
    return formDataList
  }

  function handleValueChange (fieldName: string, fieldType: CustomFieldType, formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef, index?: number) {
    let updatedFormData: CustomFormData | CustomFormData[] = { ...formData }
    if (props.isFormDataList) {
      updatedFormData = Array.isArray(customFormData) && customFormData?.length > 0 ? getUpdatedFormDataList(index, customFormData as CustomFormData[], formData) : [formData]
      setCustomFormData(updatedFormData)
    } else {
      setCustomFormData(updatedFormData)
    }
    if (props.handleFormValueChange) {
      props.handleFormValueChange(updatedFormData, file, fileName, legalDocumentRef, index, fieldName)
    }
  }

  function handleFilterApply (filter: Map<string, string[]>) {
    if (props.onFilterApply) {
      props.onFilterApply(filter, customFormData as CustomFormData)
    }
  }

  function handleFormReady (fetchFormFunction, index?: number) {
    if (fetchFormFunction) {
      props.onFormReady && props.onFormReady(fetchFormFunction, index)
    }
  }

  function getExtendedFormDocumentByName (fieldName: string, mediaType: string, fileName: string, index: number): Promise<Blob> {
    if (props.dataFetchers?.getDocumentByName) {
      return props.dataFetchers.getDocumentByName(fieldName, mediaType, fileName, index)
    }
  }

  return (<>
    {customFormDefinition && <>
      {!props.isFormDataList && <FormView
        id={props.questionnaireId?.formId || 'customform'}
        formDefinition={customFormDefinition}
        formData={customFormData as CustomFormData}
        locale={props.locale}
        localLabels={localLabels}
        options={props.options}
        dataFetchers={props.dataFetchers}
        events={props.events}
        onValueChange={handleValueChange}
        onFilterApply={handleFilterApply}
        onReady={handleFormReady}
        inTableCell={props.inTableCell}
      />}
      {props.isFormDataList && <>
        {(Array.isArray(customFormData) && customFormData?.length > 0) ?
          customFormData?.map((data, index) => {
            return (<div key={index} className={style.formDataListWrapper}>
              <FormView
                id={props.questionnaireId?.formId ? `${props.questionnaireId?.formId}_formDataList_${index}` : `formDataList_${index}`}
                formDefinition={customFormDefinition}
                formData={data as CustomFormData}
                locale={props.locale}
                localLabels={localLabels}
                options={props.options}
                dataFetchers={{ ...props.dataFetchers, getDocumentByName: (fieldName: string, mediatype: string, fileName: string) => getExtendedFormDocumentByName(fieldName, mediatype, fileName, index) }}
                events={props.events}
                onValueChange={(fieldName, fieldType, formData, file, fileName, legalDocumentRef) => handleValueChange(fieldName, fieldType, formData, file, fileName, legalDocumentRef, index)}
                onFilterApply={handleFilterApply}
                onReady={(fetchData) => handleFormReady(fetchData, index)}
                inTableCell={props.inTableCell}
              />
            </div>)
          })
          : <FormView
            id={props.questionnaireId?.formId || 'customform'}
            formDefinition={customFormDefinition}
            formData={customFormData as CustomFormData}
            locale={props.locale}
            localLabels={localLabels}
            options={props.options}
            dataFetchers={{ ...props.dataFetchers, getDocumentByName: (fieldName: string, mediatype: string, fileName: string) => getExtendedFormDocumentByName(fieldName, mediatype, fileName, 0) }}
            events={props.events}
            onValueChange={(fieldName, fieldType, formData, file, fileName, legalDocumentRef) => handleValueChange(fieldName, fieldType, formData, file, fileName, legalDocumentRef, 0)}
            onFilterApply={handleFilterApply}
            onReady={(fetchData) => handleFormReady(fetchData, 0)}
            inTableCell={props.inTableCell}
          />
        }
      </>}
    </>}
  </>)

}
