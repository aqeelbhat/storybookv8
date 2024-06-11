import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { Contract, Field, Product, PurchaseType, SoftwareFormData, SoftwareFormProps } from './types'
import { areArraysSame, areObjectsSame, isDisabled, isEmpty, isOmitted, isRequired } from './util'
import { NumberBox, Option, Radio, TextArea, TextBox } from '../Inputs'
import { YesNoRadio } from '../Inputs/toggle.component'
import { OroButton } from '../controls'
import { SoftwareSelector } from './Items/softaware-selector.component'

import styles from './software-form-styles.module.scss'
import { getValueFromAmount } from '../Inputs/utils.service'
import { ContractSelector } from './Items/contract-selector.component'

export function SoftwareForm (props: SoftwareFormProps) {
  const [typeOfPurchase, setTypeOfPurchase] = useState<Option>()
  const [softwares, setSoftwares] = useState<Product[]>([])
  const [description, setDescription] = useState<string>('')
  const [existingSoftware, setExistingSoftware] = useState<Product>()
  const [additionalLicensesCount, setAdditionalLicensesCount] = useState<string>()
  const [existingContracts, setExistingContracts] = useState<Contract[]>([])

  const [replacingExisting, setReplacingExisting] = useState<boolean>()
  const [knowContract, setKnowContract] = useState<boolean>()

  const [typeOfPurchaseOptions, setTypeOfPurchaseOptions] = useState<Option[]>([])
  // const [existingContractOptions, setExistingContractOptions] = useState<Contract[]>([])

  // Field config not supported yet
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  useEffect(() => {
    if (props.formData) {
      setTypeOfPurchase(props.formData.typeOfPurchase)
      setSoftwares(props.formData.softwares)
      setDescription(props.formData.description)
      setExistingSoftware(props.formData.existingSoftware)
      setAdditionalLicensesCount(props.formData.additionalLicensesCount)
      setExistingContracts(props.formData.existingContracts)

      setReplacingExisting(props.formData.replacingExisting)
      setKnowContract(props.formData.knowContract)
    }
  }, [props.formData])

  useEffect(() => {
    props.typeOfPurchaseOptions && setTypeOfPurchaseOptions(props.typeOfPurchaseOptions)
  }, [props.typeOfPurchaseOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({})
    }
  }, [props.fields])

  function getFormData (): SoftwareFormData {
    return {
      typeOfPurchase,
      softwares: typeOfPurchase?.path === 'new' && softwares,
      description,
      replacingExisting: typeOfPurchase?.path === 'new' ? replacingExisting : undefined,
      existingSoftware: ((typeOfPurchase?.path === 'new' && replacingExisting) || typeOfPurchase?.path === 'additional' || typeOfPurchase?.path === 'renew') ? existingSoftware : undefined,
      additionalLicensesCount: typeOfPurchase?.path === 'additional' ? additionalLicensesCount : undefined,
      knowContract: typeOfPurchase?.path === 'additional' ? knowContract : undefined,
      existingContracts: ((typeOfPurchase?.path === 'new' && replacingExisting) || (typeOfPurchase?.path === 'additional' && knowContract) || typeOfPurchase?.path === 'renew') ? existingContracts : undefined
    }
  }

  function updateTypeOfPurchase (value: Option) {
    setTypeOfPurchase(value)
    setSoftwares(undefined)
    setDescription(undefined)
    setExistingSoftware(undefined)
    setAdditionalLicensesCount(undefined)
    setExistingContracts(undefined)
    setReplacingExisting(undefined)
    setKnowContract(undefined)
  }

  function updateReplacingExisting (value: boolean) {
    setReplacingExisting(value)
    if (!value) setExistingSoftware(undefined)
  }

  function updateKnowContract (value: boolean) {
    setKnowContract(value)
    if (!value) setExistingContracts(undefined)
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: boolean | string | Option | Product | Product[] | Contract[]): SoftwareFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as SoftwareFormData

    switch (fieldName) {
      case 'typeOfPurchase':
        formData.typeOfPurchase = newValue as Option
        formData.softwares = undefined
        formData.description = undefined
        formData.existingSoftware = undefined
        formData.additionalLicensesCount = undefined
        formData.existingContracts = undefined
        formData.replacingExisting = undefined
        formData.knowContract = undefined
        break
      case 'softwares':
        formData.softwares = newValue as Product[]
        break
      case 'description':
        formData.description = newValue as string
        break
      case 'replacingExisting':
        formData.replacingExisting = newValue as boolean
        if (!newValue) formData.existingSoftware = undefined
        break
      case 'existingSoftware':
        formData.existingSoftware = newValue as Product
        break
      case 'additionalLicensesCount':
        formData.additionalLicensesCount = newValue as string
        break
      case 'knowContract':
        formData.knowContract = newValue as boolean
        if (!newValue) formData.existingContracts = undefined
        break
      case 'existingContracts':
        formData.existingContracts = newValue as Contract[]
        break
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: boolean | string | Option | Product | Product[] | Contract[],
    newValue: boolean | string | Option | Product | Product[] | Contract[],
    newValueIndex?: number
  ) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areArraysSame(oldValue as any[], newValue as any[])) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          newValueIndex
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function validateField (fieldName: string, label: string, value: boolean | string | PurchaseType | Product | Product[]| Contract[]): string {
    // if (fieldMap) {
      // const field = fieldMap[fieldName]
      let isInvalid = false
      if (Array.isArray(value)) {
        isInvalid = value.length < 1
      } else if (typeof value === 'string') {
        isInvalid = isEmpty(value)
      } else if (typeof value === 'boolean') {
        isInvalid = (value === undefined)
      } else if (value === undefined) {
        isInvalid = true
      } else { // Product
        isInvalid = !value || !value.name
      }
      // return isRequired(field) && isInvalid ? `${label} is a required field.` : ''
      return isInvalid ? `${label} is a required field.` : ''
    // } else {
    //   return ''
    // }
  }

  function isFieldDisabled (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field)
    } else {
      return false
    }
  }

  function isFieldRequired (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
    }
  }

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''

    // const isInvalid = props.fields?.some(field => {
    //   if (!isOmitted(field) && isRequired(field)) {
    //     switch (field.fieldName) {
    //       case 'typeOfPurchase':
    //         invalidFieldId = 'typeOfPurchase-field'
    //         return !typeOfPurchase?.path
    //       case 'softwares':
    //         invalidFieldId = 'softwares-field'
    //         return typeOfPurchase?.path === 'new' && (!softwares || softwares.length < 1)
    //       case 'description':
    //         invalidFieldId = 'description-field'
    //         return !description
    //       case 'replacingExisting':
    //         invalidFieldId = 'replacingExisting-field'
    //         return typeOfPurchase?.path === 'new' && replacingExisting === undefined
    //       case 'existingSoftware':
    //         invalidFieldId = 'existingSoftware-field'
    //         return ((typeOfPurchase?.path === 'new' && replacingExisting) || typeOfPurchase?.path === 'additional' || typeOfPurchase?.path === 'renew') && !existingSoftware
    //       case 'additionalLicensesCount':
    //         invalidFieldId = 'additionalLicensesCount-field'
    //         return typeOfPurchase?.path === 'additional' && !additionalLicensesCount
    //       case 'knowContract':
    //         invalidFieldId = 'knowContract-field'
    //         return typeOfPurchase?.path === 'additional' && knowContract === undefined
    //       case 'existingContracts':
    //         invalidFieldId = 'existingContracts-field'
    //         return ((typeOfPurchase?.path === 'new' && replacingExisting) || (typeOfPurchase?.path === 'additional' && knowContract) || typeOfPurchase?.path === 'renew') && (!existingContracts || existingContracts.length < 1)
    //     }
    //   }
    // })

    if (!typeOfPurchase?.path) {
      invalidFieldId = 'typeOfPurchase-field'
    }
    if (typeOfPurchase?.path === 'new' && (!softwares || softwares.length < 1)) {
      invalidFieldId = 'softwares-field'
    }
    if (!description) {
      invalidFieldId = 'description-field'
    }
    if (typeOfPurchase?.path === 'new' && replacingExisting === undefined) {
      invalidFieldId = 'replacingExisting-field'
    }
    if (((typeOfPurchase?.path === 'new' && replacingExisting) || typeOfPurchase?.path === 'additional' || typeOfPurchase?.path === 'renew') && !existingSoftware) {
      invalidFieldId = 'existingSoftware-field'
    }
    if (typeOfPurchase?.path === 'additional' && !additionalLicensesCount) {
      invalidFieldId = 'additionalLicensesCount-field'
    }
    // if (typeOfPurchase?.path === 'additional' && knowContract === undefined) {
    //   invalidFieldId = 'knowContract-field'
    // }
    // if (((typeOfPurchase?.path === 'new' && replacingExisting) || (typeOfPurchase?.path === 'additional' && knowContract) || typeOfPurchase?.path === 'renew') && (!existingContracts || existingContracts.length < 1)) {
    //   invalidFieldId = 'existingContracts-field'
    // }
  
    // return isInvalid ? invalidFieldId : ''
    return invalidFieldId || ''
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
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

  function fetchData (skipValidation?: boolean): SoftwareFormData {
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

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    typeOfPurchase, softwares, description, replacingExisting, existingSoftware, additionalLicensesCount, knowContract, existingContracts
  ])

  function getExistingSoftwreSelectorLabel (): string {
    if (typeOfPurchase?.path === 'new') return 'What is the software being replaced?'
    if (typeOfPurchase?.path === 'additional') return 'Select the software'
    if (typeOfPurchase?.path === 'renew') return 'What is the software that you would like to renew?'
    return ''
  }

  function getExistingContractSelectorLabel (): string {
    if (typeOfPurchase?.path === 'new') return 'Please select the contract(s) that you wish to replace'
    if (typeOfPurchase?.path === 'additional') return 'Please select the original contract'
    if (typeOfPurchase?.path === 'renew') return 'Please select the contract(s) that you wish to renew'
    return ''
  }

  function handleLicenceCountChange (value: string) {
    // const cleanedupValue = getValueFromAmount(value)
    setAdditionalLicensesCount(value)
    handleFieldValueChange('additionalLicensesCount', additionalLicensesCount, value)
  }

  function handleExistingSoftwareChange (value?: Product[]) {
    setExistingSoftware(value?.[0])
    handleFieldValueChange('existingSoftware', existingSoftware, value?.[0])

    // setExistingContractOptions([])
    // if (props.onSearchContracts) {
    //   props.onSearchContracts(value?.[0]?.name)
    //     .then(contracts => {
    //       setExistingContractOptions(contracts || [])
    //     })
    //     .catch(err => console.log(err))
    // }
  }

  return (
    <div className={styles.softwareForm}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col4)} id="typeOfPurchase-field">
            <Radio
              name='type-of-purchase'
              label='Type of purchase'
              value={typeOfPurchase}
              options={typeOfPurchaseOptions}
              disabled={isFieldDisabled('typeOfPurchase')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('typeOfPurchase', 'Type of purchase', value)}
              onChange={value => {updateTypeOfPurchase(value); handleFieldValueChange('typeOfPurchase', typeOfPurchase, value)}}
            />
          </div>
        </div>

        { typeOfPurchase?.path === 'new' &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="softwares-field">
            <SoftwareSelector
              label="Select the software(s)"
              value={softwares}
              disabled={isFieldDisabled('typeOfPurchase')}
              required={true}
              forceValidate={forceValidate}
              onSearch={props.onSearchSoftwares}
              onSearchManufacturers={props.onSearchManufacturers}
              validator={(value) => validateField('softwares', 'Software', value)}
              onChange={value => {setSoftwares(value); handleFieldValueChange('softwares', softwares, value)}}
            />
          </div>
        </div>}

        { typeOfPurchase?.path === 'new' &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="description-field">
            <TextArea
              label="Describe the business need"
              placeholder=""
              value={description}
              disabled={isFieldDisabled('description')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('description', 'Business need', value)}
              onChange={value => { setDescription(value); handleFieldValueChange('description', description, value) }}
            />
          </div>
        </div>}

        { typeOfPurchase?.path === 'new' && softwares && softwares.length > 0 &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col4)} id="replacingExisting-field">
            <YesNoRadio
              name='replacing-existing'
              label='Are you replacing an existing software?'
              value={replacingExisting}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('replacingExisting', 'This', value)}
              onChange={value => {updateReplacingExisting(value); handleFieldValueChange('replacingExisting', replacingExisting, value)}}
            />
          </div>
        </div>}

        { ((typeOfPurchase?.path === 'new' && replacingExisting) || typeOfPurchase?.path === 'additional' || typeOfPurchase?.path === 'renew') &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="existingSoftware-field">
            <SoftwareSelector
              label={getExistingSoftwreSelectorLabel()}
              value={existingSoftware ? [existingSoftware] : []}
              singleSelect={true}
              disabled={isFieldDisabled('existingSoftware')}
              required={true}
              forceValidate={forceValidate}
              onSearch={props.onSearchSoftwares}
              onSearchManufacturers={props.onSearchManufacturers}
              validator={(value) => validateField('existingSoftware', 'Software', value?.[0])}
              onChange={handleExistingSoftwareChange}
            />
          </div>
        </div>}

        { typeOfPurchase?.path === 'additional' && existingSoftware &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="additionalLicensesCount-field">
            <TextBox
              label="Additional license quantity"
              value={additionalLicensesCount}
              placeholder=" "
              disabled={isFieldDisabled('additionalLicensesCount')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('additionalLicensesCount', 'License quantity', value)}
              onChange={handleLicenceCountChange}
            />
          </div>
        </div>}

        {/* Duplicate */}
        { typeOfPurchase?.path === 'additional' && existingSoftware &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="description-field">
            <TextArea
              label="Describe the business need"
              placeholder=""
              value={description}
              disabled={isFieldDisabled('description')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('description', 'Business need', value)}
              onChange={value => { setDescription(value); handleFieldValueChange('description', description, value) }}
            />
          </div>
        </div>}

        { typeOfPurchase?.path === 'additional' && existingSoftware &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col4)} id="knowContract-field">
            <YesNoRadio
              name='know-contract'
              label='Do you know which contract you want to add more licenses to?'
              value={knowContract}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('knowContract', 'This', value)}
              onChange={value => {updateKnowContract(value); handleFieldValueChange('knowContract', knowContract, value)}}
            />
          </div>
        </div>}

        { ((typeOfPurchase?.path === 'new' && replacingExisting) || (typeOfPurchase?.path === 'additional' && knowContract) || (typeOfPurchase?.path === 'renew' && existingSoftware)) &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="existingContracts-field">
            <ContractSelector
              label={getExistingContractSelectorLabel()}
              value={existingContracts}
              // options={existingContractOptions}
              currencyOptions={props.currencyOptions}
              disabled={isFieldDisabled('existingContracts')}
              required={true}
              forceValidate={forceValidate}
              onSearch={props.onSearchContracts}
              loadDocument={props.loadDocument}
              validator={(value) => validateField('existingContracts', 'Contract', value)}
              onChange={(value, newContractIndex) => {setExistingContracts(value); handleFieldValueChange('existingContracts', existingContracts, value, newContractIndex)}}
            />
          </div>
        </div>}

        {/* Duplicate */}
        { typeOfPurchase?.path === 'renew' && existingSoftware &&
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="description-field">
            <TextArea
              label="Describe the business need"
              placeholder=""
              value={description}
              disabled={isFieldDisabled('description')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('description', 'Business need', value)}
              onChange={value => { setDescription(value); handleFieldValueChange('description', description, value) }}
            />
          </div>
        </div>}

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>
    </div>
  )
}
