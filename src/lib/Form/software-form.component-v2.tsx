import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { Contract, Field, Product, PurchaseType, SoftwareFormDataV2, SoftwareFormV2Props } from './types'
import { areArraysSame, areObjectsSame, getUserDisplayName, isDisabled, isEmpty, isOmitted, isRequired } from './util'
import { AttachmentBox, inputFileAcceptType, Option, Radio, TextArea } from '../Inputs'
import { YesNoRadio } from '../Inputs/toggle.component'
import { OroButton } from '../controls'
import { SoftwareSelector } from './Items/softaware-selector.component'
import { ContractSelector } from './Items/contract-selector.component'
import { Attachment } from '..'

import styles from './software-form-styles.module.scss'
import DefaultLogo from './assets/default-software-logo.svg'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ContractModal } from './Items/contract-modal.component'
import { ContractSelectorV2 } from './Items/contract-selector-v2.component'

function SimilarSoftwareCard (props: {
  data?: Product
  activeContracts?: Contract[]
  onSelect?: () => void
}) {
  return (
    <div className={styles.similarSoftwareCard}>
      <div className={styles.body}>
        <div className={styles.profile}>
          <img src={props.data?.image || DefaultLogo} />
        </div>

        <div className={styles.info}>
          <div className={styles.name}>{props.data?.name || '-'}</div>
          {props.activeContracts && props.activeContracts.length > 0 &&
            <div className={styles.property}>{props.activeContracts.length} active contract{props.activeContracts.length > 1 ? 's' : ''}</div>}
        </div>
      </div>

      <div className={styles.footer}>
        {props.data?.owner &&
          <div className={styles.property}>Owner: <span className={styles.owner}>{getUserDisplayName(props.data.owner)}</span></div>}
        <div className={styles.spread} />
        <div className={styles.action} onClick={props.onSelect}>Select</div>
      </div>
    </div>
  )
}

export function SoftwareFormV2 (props: SoftwareFormV2Props) {
  const [softwareSelection, setSoftwareSelection] = useState<Option>()
  const [selectedSoftwares, setSelectedSoftwares] = useState<Product[]>([])
  const [replacingExisting, setReplacingExisting] = useState<boolean>()
  const [existingSoftware, setExistingSoftware] = useState<Product>()
  const [typeOfPurchase, setTypeOfPurchase] = useState<Option>()
  const [existingContract, setExistingContract] = useState<Contract>()
  const [businessNeed, setBusinessNeed] = useState<string>('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const [softwareSelectionOptions, setSoftwareSelectionOptions] = useState<Option[]>([])
  const [typeOfPurchaseOptions, setTypeOfPurchaseOptions] = useState<Option[]>([])

  // Field config not supported yet
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [forceValidateAttachments, setForceValidateAttachments] = useState<boolean>(false)
  
  const [activeContracts, setActiveContracts] = useState<{[software: string]: Contract[]}>({})
  const [similarInUse, setSimilarInUse] = useState<{[software: string]: Product[]}>({})
  const [similarSoftwaresExpanded, setSimilarSoftwaresExpanded] = useState<boolean>(true)

  useEffect(() => {
    if (props.formData) {
      setSoftwareSelection(props.formData.softwareSelection)
      setSelectedSoftwares(props.formData.selectedSoftwares)
      setReplacingExisting(props.formData.replacingExisting)
      setExistingSoftware(props.formData.existingSoftware)
      setTypeOfPurchase(props.formData.typeOfPurchase)
      setExistingContract(props.formData.existingContract)
      setBusinessNeed(props.formData.businessNeed)
      setAttachments(props.formData.attachments)
    }
  }, [props.formData])

  useEffect(() => {
    props.softwareSelectionOptions && setSoftwareSelectionOptions(props.softwareSelectionOptions)
  }, [props.softwareSelectionOptions])
  useEffect(() => {
    props.typeOfPurchaseOptions && setTypeOfPurchaseOptions(props.typeOfPurchaseOptions)
  }, [props.typeOfPurchaseOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({})
    }
  }, [props.fields])

  function fetchContracts (softwareName: string) {
    if (props.onSearchContracts) {
      props.onSearchContracts(softwareName)
        .then(contracts => {
          setActiveContracts({
            ...activeContracts,
            [softwareName]: contracts || []
          })
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    if (softwareSelection?.path === 'single' && selectedSoftwares?.[0]) {
      // find active contracts
      if (hasActiveContract(selectedSoftwares[0])) {
        if (!activeContracts[selectedSoftwares[0].name]) {
          fetchContracts(selectedSoftwares[0].name)
        }
      } else {
        setActiveContracts({
          ...activeContracts,
          [selectedSoftwares[0].name]: []
        })
      }

      // find similar softwares in use
      if (!hasActiveContract(selectedSoftwares[0]) && hasSimilarInUse(selectedSoftwares[0])) {
        if (!similarInUse[selectedSoftwares[0].name]) {
          if (props.onSearchSimilarSoftwares) {
            props.onSearchSimilarSoftwares(selectedSoftwares[0].name)
              .then(softwares => {
                setSimilarInUse({
                  ...similarInUse,
                  [selectedSoftwares[0].name]: softwares || []
                })
              })
              .catch(err => console.log(err))
          }
        }
      } else {
        setSimilarInUse({
          ...similarInUse,
          [selectedSoftwares[0].name]: []
        })
      }
    }
  }, [selectedSoftwares])

  function getFormData (): SoftwareFormDataV2 {
    return {
      softwareSelection,
      selectedSoftwares,
      replacingExisting,
      existingSoftware,
      typeOfPurchase,
      existingContract,
      businessNeed,
      attachments
    }
  }

  function updateSoftwareSelection (value: Option) {
    setSoftwareSelection(value)

    setSelectedSoftwares([])
    setReplacingExisting(undefined)
    setExistingSoftware(undefined)
    setTypeOfPurchase(undefined)
    setExistingContract(undefined)
  }

  function updateSelectedSoftwares (value?: Product[]) {
    setSelectedSoftwares(value)

    setReplacingExisting(undefined)
  }

  function updateTypeOfPurchase (value: Option) {
    setTypeOfPurchase(value)

    setReplacingExisting(undefined)
    setExistingContract(undefined)
  }

  function updateReplacingExisting (value: boolean) {
    setReplacingExisting(value)

    setExistingSoftware(undefined)
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: boolean | string | Option | Product | Product[] | Contract | Attachment[]): SoftwareFormDataV2 {
    const formData = JSON.parse(JSON.stringify(getFormData())) as SoftwareFormDataV2

    switch (fieldName) {
      case 'softwareSelection':
        formData.softwareSelection = newValue as Option
        formData.selectedSoftwares = []
        formData.replacingExisting = undefined
        formData.existingSoftware = undefined
        formData.typeOfPurchase = undefined
        formData.existingContract = undefined
        break
      case 'selectedSoftwares':
        formData.selectedSoftwares = newValue as Product[]
        break
      case 'replacingExisting':
        formData.replacingExisting = newValue as boolean
        formData.existingSoftware = undefined
        break
      case 'existingSoftware':
        formData.existingSoftware = newValue as Product
        break
      case 'typeOfPurchase':
        formData.typeOfPurchase = newValue as Option
        formData.replacingExisting = undefined
        formData.existingContract = undefined
        break
      case 'existingContract':
        formData.existingContract = newValue as Contract
        break
      case 'businessNeed':
        formData.businessNeed = newValue as string
        break
      case 'attachments':
        formData.attachments = newValue as Attachment[]
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: boolean | string | Option | Product | Product[] | Contract[] | Attachment[],
    newValue: boolean | string | Option | Product | Product[] | Contract[] | Attachment[],
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

  function handleFileChange (fieldName: string, index: number, file?: File) {
    if (file && index === attachments.length) {
      setAttachments([...attachments, file])
      handleFieldValueChange(fieldName, attachments, [...attachments, file], index)
    } else {
      const docListCopy = [...attachments]
      docListCopy.splice(index, 1)
      setAttachments(docListCopy)
      handleFieldValueChange(fieldName, attachments, docListCopy, index)
    }
    setForceValidateAttachments(true)
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
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

  function hasSimilarInUse (software: Product): boolean {
    return software?.hasSimilar
  }

  function hasActiveContract (software: Product): boolean {
    return software?.isContractActive
  }

  function getActiveContracts (software: Product, forceFetch?: boolean): Contract[] {
    if (software?.name) {
      if (activeContracts[software.name]) {
        return activeContracts[software.name]
      } else if (forceFetch) {
        fetchContracts(software.name)
      }
    }

    return []
  }

  function getSimilarSoftwaresInUse (software: Product): Product[] {
    if (software?.name) {
      return similarInUse[software.name] || []
    }

    return []
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

    if (!softwareSelection?.path) {
      invalidFieldId = 'softwareSelection-field'
    }
    if (!selectedSoftwares || selectedSoftwares.length < 1) {
      invalidFieldId = 'selectedSoftwares-field'
    }
    if (softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && hasActiveContract(selectedSoftwares[0]) &&!typeOfPurchase?.path) {
      invalidFieldId = 'typeOfPurchase-field'
    }
    if (softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && ((hasSimilarInUse(selectedSoftwares[0]) && !hasActiveContract(selectedSoftwares[0])) || typeOfPurchase?.path === 'new') && replacingExisting === undefined) {
      invalidFieldId = 'replacingExisting-field'
    }
    if (replacingExisting && !existingSoftware) {
      invalidFieldId = 'existingSoftware-field'
    }
    if (softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && (hasActiveContract(selectedSoftwares[0]) && typeOfPurchase?.path === 'renew') && !existingContract) {
      invalidFieldId = 'existingContract-field'
    }
    if (!businessNeed) {
      invalidFieldId = 'businessNeed-field'
    }
    if (!attachments || attachments.length < 1) {
      invalidFieldId = 'attachments-field'
    }
    
  
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

  function fetchData (skipValidation?: boolean): SoftwareFormDataV2 {
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
    softwareSelection, selectedSoftwares, replacingExisting, existingSoftware, typeOfPurchase, existingContract, businessNeed, attachments
  ])

  function handleExistingSoftwareChange (value?: Product[]) {
    setExistingSoftware(value?.[0])
    handleFieldValueChange('existingSoftware', existingSoftware, value?.[0])
  }

  return (
    <div className={styles.softwareForm}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col4)} id="softwareSelection-field">
            <Radio
              id='software-selection'
              name='software-selection'
              label='Software selection'
              value={softwareSelection}
              options={softwareSelectionOptions}
              showHorizontal={true}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('softwareSelection', 'Software selection', value)}
              onChange={value => {updateSoftwareSelection(value); handleFieldValueChange('softwareSelection', softwareSelection, value)}}
            />
          </div>
        </div>

        {softwareSelection?.path &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="selectedSoftwares-field">
              <SoftwareSelector
                label={softwareSelection?.path === 'single' ? 'Select software' : 'Provide software options'}
                description={softwareSelection?.path !== 'single' ? '(Company policy recommends evaluation of 3 products)' : ''}
                singleSelect={softwareSelection?.path === 'single'}
                value={selectedSoftwares}
                hasFooter={softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && (hasActiveContract(selectedSoftwares[0]) || hasSimilarInUse(selectedSoftwares[0]))}
                activeContracts={hasActiveContract(selectedSoftwares[0]) ? getActiveContracts(selectedSoftwares[0]) : []}
                required={true}
                forceValidate={forceValidate}
                onSearch={props.onSearchSoftwares}
                onSearchManufacturers={props.onSearchManufacturers}
                validator={(value) => validateField('selectedSoftwares', 'Software', value)}
                onChange={value => {updateSelectedSoftwares(value); handleFieldValueChange('selectedSoftwares', selectedSoftwares, value)}}
              />
              { getSimilarSoftwaresInUse(selectedSoftwares[0]).length > 0 &&
                <div className={styles.similarSoftwareBox}>
                  <div className={styles.label}>
                    <div>Similar softwares already in use ({getSimilarSoftwaresInUse(selectedSoftwares[0]).length})</div>
                    <div className={styles.spread} />
                    { similarSoftwaresExpanded
                      ? <ChevronUp size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => setSimilarSoftwaresExpanded(false)} />
                      : <ChevronDown size={20} color={'var(--warm-neutral-shade-300)'} onClick={() => setSimilarSoftwaresExpanded(true)} />}
                  </div>
                  {similarSoftwaresExpanded &&
                    <div className={styles.list}>
                      {getSimilarSoftwaresInUse(selectedSoftwares[0]).map((software, i) =>
                        <SimilarSoftwareCard
                          key={i}
                          data={software}
                          activeContracts={getActiveContracts(software, true)}
                          onSelect={() => {updateSelectedSoftwares([software]); handleFieldValueChange('selectedSoftwares', selectedSoftwares, [software])}}
                        />)}
                    </div>}
                </div>}
              { softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && hasActiveContract(selectedSoftwares[0]) &&
                <div className={styles.typeOfPurchaseBox} id="typeOfPurchase-field">
                  <Radio
                    id='type-of-purchase'
                    name='type-of-purchase'
                    label='Type of purchase'
                    value={typeOfPurchase}
                    options={typeOfPurchaseOptions}
                    showHorizontal={true}
                    required={true}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('typeOfPurchase', 'Type of purchase', value)}
                    onChange={value => {updateTypeOfPurchase(value); handleFieldValueChange('typeOfPurchase', typeOfPurchase, value)}}
                  />
                </div>}
            </div>
          </div>}

        { softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && ((hasSimilarInUse(selectedSoftwares[0]) && !hasActiveContract(selectedSoftwares[0])) || typeOfPurchase?.path === 'new') &&
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

        { replacingExisting &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="existingSoftware-field">
              <SoftwareSelector
                label="Software to be replaced"
                value={existingSoftware ? [existingSoftware] : []}
                singleSelect={true}
                required={true}
                forceValidate={forceValidate}
                onSearch={props.onSearchSoftwares}
                validator={(value) => validateField('existingSoftware', 'Existing software', value?.[0])}
                onChange={handleExistingSoftwareChange}
              />
            </div>
          </div>}

        { softwareSelection?.path === 'single' && selectedSoftwares && selectedSoftwares.length === 1 && (hasActiveContract(selectedSoftwares[0]) && typeOfPurchase?.path === 'renew') &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="existingContract-field">
              <ContractSelectorV2
                label="Contract for renewal"
                value={existingContract ? [existingContract] : []}
                options={getActiveContracts(selectedSoftwares[0])}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => validateField('existingContract', 'Contract', value?.[0])}
                onChange={(value, newContractIndex) => {setExistingContract(value?.[0]); handleFieldValueChange('existingContract', existingContract ? [existingContract] : [], value?.[0], newContractIndex)}}
              />
            </div>
          </div>}

        { selectedSoftwares && selectedSoftwares.length > 0 &&
          (
            softwareSelection?.path === 'multi' ||
            (
              (
                (
                  hasSimilarInUse(selectedSoftwares[0]) &&
                  !hasActiveContract(selectedSoftwares[0]) &&
                  replacingExisting !== undefined
                ) ||
                (
                  hasActiveContract(selectedSoftwares[0]) &&
                  (
                    (typeOfPurchase?.path === 'new' && replacingExisting !== undefined) ||
                    (typeOfPurchase?.path === 'renew' && existingContract) ||
                    typeOfPurchase?.path === 'additional'
                  )
                )
              )
            )
          ) &&
          <>
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col3)} id="businessNeed-field">
                <TextArea
                  label="Describe the business need"
                  placeholder=""
                  value={businessNeed}
                  required={true}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('businessNeed', 'Business need', value)}
                  onChange={value => { setBusinessNeed(value); handleFieldValueChange('businessNeed', businessNeed, value) }}
                />
              </div>
            </div>

            <div className={styles.fieldLabel} id="attachments-field">Attach relevant documents</div>
            { attachments && attachments.map((doc, i) =>
              <div className={styles.row} key={i}>
                <div className={classnames(styles.item, styles.col2)}>
                  <AttachmentBox
                    value={doc}
                    inputFileAcceptTypes={inputFileAcceptType}
                    theme="coco"
                    onChange={(file) => handleFileChange(`attachments`, i, file)}
                    onPreviewByURL={() => loadFile(`attachments[${i}]`, doc.mediatype, doc.filename)}
                  />
                </div>
              </div>)}
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col4)} id="attachments-field">
                <AttachmentBox
                  controlled={true}
                  inputFileAcceptTypes={inputFileAcceptType}
                  theme="coco"
                  onChange={(file) => handleFileChange(`attachments`, attachments.length, file)}
                />
              </div>
            </div>
          </>}

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
