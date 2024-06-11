import React, { useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { Plus, Search, Trash2, X } from 'react-feather'
import moment from 'moment'

import { Contract, Cost } from '../types'
import { Attachment, Option } from './../../Types'
import { DEFAULT_CURRENCY, debounce, mapCurrencyToSymbol } from '../../util'
import { OroButton } from '../../controls'
import { getValueFromAmount } from '../../Inputs/utils.service'
import { getDateObject, getLocalDateString, isEmpty, validateDateOrdering } from '../util'
import { AttachmentBox, Currency, DateRange, inputFileAcceptType, TextArea, TextBox } from '../../Inputs'
import { AttachmentReadOnly } from '../components/attachment-read-only.component'

import styles from './contract-selector.module.scss'
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import { getSessionLocale } from '../../sessionStorage'

function getCostDisplayVal (cost?: Cost) {
  if (cost?.amount) {
    const formattedAmount = !isNaN(Number(cost.amount))
      ? Number(cost.amount).toLocaleString(getSessionLocale())
      : ''

    return `${mapCurrencyToSymbol(cost.currency)}${formattedAmount}`
  } else {
    return ''
  }
}

function ManualContractForm (props: {
  data?: Contract
  currencyOptions?: Option[]
  defaultCurrency?: string
  forceValidate?: boolean
  onClose?: () => void
  onSubmit?: (data: Contract) => void
}) {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [contractValue, setContractValue] = useState<Cost>({currency: DEFAULT_CURRENCY, amount: ''})
  const [recurringSpend, setRecurringSpend] = useState<Cost>({currency: DEFAULT_CURRENCY, amount: ''})
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [forceCostValidate, setForceCostValidate] = useState<boolean>(false)

  useEffect(() => {
    if (props.data) {
      setName(props.data.name || '')
      setDescription(props.data.description)
      setContractValue({
        currency: props.data.value?.currency || props.defaultCurrency || DEFAULT_CURRENCY,
        amount: props.data.value?.amount ? Number(props.data.value.amount).toLocaleString(getSessionLocale()) : ''
      })
      setRecurringSpend({
        currency: props.data.recurringSpend?.currency || props.defaultCurrency || DEFAULT_CURRENCY,
        amount: props.data.recurringSpend?.amount ? Number(props.data.recurringSpend.amount).toLocaleString(getSessionLocale()) : ''
      })
      setStartDate(props.data.startDate)
      setEndDate(props.data.endDate)
      setAttachments(props.data.attachments || [])
    }
  }, [props.data])

  useEffect(() => {
    if (props.forceValidate) {
      const invalidFieldId = isFormInvalid()
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }
    }
  }, [props.forceValidate])

  function getFormData (): Contract {
    return {
      name,
      description,
      value: {
        amount: getValueFromAmount(contractValue.amount),
        currency: contractValue.currency
      },
      recurringSpend: {
        amount: getValueFromAmount(recurringSpend.amount),
        currency: recurringSpend.currency
      },
      startDate,
      endDate,
      attachments
    }
  }

  function validateField (fieldName: string, value: string | number): string {
    const isInvalid = isEmpty(value)
    return isInvalid ? `This is a required field.` : ''
  }

  function validateCost (fieldName: string, value: number) {
    const isInvalid = isEmpty(value)
    let error: string | null = null
    switch (fieldName) {
      case 'contractValue':
        error = (!recurringSpend?.amount && isInvalid) ? "'Total contract value' OR 'Avg. annual recurring spend' is required." : null
        break
      case 'recurringSpend':
        error = (!contractValue?.amount && isInvalid) ? "'Total contract value' OR 'Avg. annual recurring spend' is required." : null
        break
    }
    return error
  }

  function validateDateRange (dateRange: {startDate: string, endDate: string}): string {
    return validateField('startDate', dateRange.startDate) || validateField('endDate', dateRange.endDate) ||
      (dateRange.startDate !== null && dateRange.endDate !== null ? validateDateOrdering(dateRange.startDate, dateRange.endDate) : '')
  }

  function handleContractValueChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    setContractValue({
      amount: cleanedupValue,
      currency: contractValue.currency
    })
    triggerCostValidations()
  }
  function handleValueCurrencyChange (value: string) {
    setContractValue({
      amount: contractValue.amount,
      currency: value
    })
    triggerCostValidations()
  }

  function handleRecurringSpendChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    setRecurringSpend({
      amount: cleanedupValue,
      currency: recurringSpend.currency
    })
    triggerCostValidations()
  }
  function handleRecurringSpendCurrencyChange (value: string) {
    setRecurringSpend({
      amount: recurringSpend.amount,
      currency: value
    })
    triggerCostValidations()
  }

  function handleDateRangeChange (start: string, end: string) {
    setStartDate(start)
    setEndDate(end)
  }

  function handleFileChange (fieldName: string, index: number, file?: File) {
    if (file && index === attachments.length) {
      setAttachments([...attachments, file])
    } else {
      const docListCopy = [...attachments]
      docListCopy.splice(index, 1)
      setAttachments(docListCopy)
    }
  }

  function loadFile (index: number): Promise<Blob | string> {
    const file = attachments[index] as File
    return file.arrayBuffer().then((arrayBuffer) => {
      const blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type })
      return blob
    })
  }

  function isFormInvalid (): string {
    if (!name) {
      return 'name-field'
    }
    if (!description) {
      return 'description-field'
    }
    if ((!(contractValue?.currency) || isEmpty(contractValue.currency) || !(contractValue?.amount) || isEmpty(contractValue.amount)) &&
      (!(recurringSpend?.currency) || isEmpty(recurringSpend.currency) || !(recurringSpend?.amount) || isEmpty(recurringSpend.amount))) {
      return 'contractValue-field'
    }
    // if (!(recurringSpend?.currency) || isEmpty(recurringSpend.currency) || !(recurringSpend?.amount) || isEmpty(recurringSpend.amount)) {
    //   return 'recurringSpend-field'
    // }
    if (!startDate) {
      return 'dataRange-field'
    }
    if (!endDate || !!validateDateOrdering(startDate, endDate)) {
      return 'dataRange-field'
    }
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

  function triggerCostValidations () {
    setForceCostValidate(true)
    setTimeout(() => {
      setForceCostValidate(false)
    }, 1000)

    const input = document.getElementById('contractValue-field')
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

  return (
    <div className={styles.manualContractForm}>
      <div className={styles.title}>Add contract <X size={16} color={'var(--warm-neutral-shade-200)'} className={styles.btn} onClick={props.onClose} /></div>

      <div className={styles.section}>
        <div id="name-field">
          <TextBox
            label="Title"
            placeholder='Add supplier name that the contract is with'
            value={name}
            required={true}
            forceValidate={forceValidate}
            validator={(value) => validateField('name', value)}
            onChange={setName}
          />
        </div>

        <div id="description-field">
          <TextArea
            label='Description'
            value={description}
            required={true}
            forceValidate={forceValidate}
            validator={(value) => validateField('description', value)}
            onChange={setDescription}
          />
        </div>

        <div id="recurringSpend-field">
          <Currency
            locale={getSessionLocale()}
            label="Avg. annual recurring spend"
            unit={recurringSpend.currency}
            value={recurringSpend.amount}
            unitOptions={props.currencyOptions}
            required={true}
            forceValidate={forceValidate || forceCostValidate}
            validator={(value) => validateCost('recurringSpend', Number(getValueFromAmount(value)))}
            onChange={handleRecurringSpendChange}
            onUnitChange={handleRecurringSpendCurrencyChange}
          />
        </div>

        <div id="contractValue-field">
          <Currency
            locale={getSessionLocale()}
            label="Total contract value"
            unit={contractValue.currency}
            value={contractValue.amount}
            unitOptions={props.currencyOptions}
            required={true}
            forceValidate={forceValidate || forceCostValidate}
            validator={(value) => validateCost('contractValue', Number(getValueFromAmount(value)))}
            onChange={handleContractValueChange}
            onUnitChange={handleValueCurrencyChange}
          />
        </div>

        <div id="dateRange-field">
          <DateRange
            locale={getSessionLocale()}
            label="Contract period"
            startDate={getDateObject(startDate)}
            endDate={getDateObject(endDate)}
            required={true}
            forceValidate={forceValidate}
            validator={validateDateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </div>

      <div className={styles.section}>
        { attachments && attachments.map((doc, i) =>
          <div className={styles.row} key={i}>
            <AttachmentBox
              value={doc}
              inputFileAcceptTypes={inputFileAcceptType}
              required={true}
              theme="coco"
              fullWidth={true}
              onChange={(file) => handleFileChange(`attachments`, i, file)}
              onPreviewByURL={() => loadFile(i)}
            />
          </div>)}
        <AttachmentBox
          controlled={true}
          required={true}
          inputFileAcceptTypes={inputFileAcceptType}
          theme="coco"
          onChange={(file) => handleFileChange(`attachments`, attachments.length, file)}
        />
      </div>

      <OroButton label='Add' type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />
    </div>
  )
}

function ContractCard (props: {
  data: Contract
  onDeleteClick: () => void
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string>
}) {
  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <div className={`${styles.contractCard}`}>
      <div className={styles.info}>
        <div className={styles.row}>
          <div className={styles.name}>
            <div>{props.data.name}</div>
          </div>
          <div className={styles.contractId}>{props.data.contractId}</div>
          {/* <div className={styles.spread}></div> */}
          {/* <div className={styles.contractValue}>{getCostDisplayVal(props.data.value)}</div> */}
          <Trash2 size={16} color={'var(--warm-neutral-shade-200)'} className={styles.btn} onClick={props.onDeleteClick} />
        </div>
        {props.data.description &&
          <div className={styles.row}>
            <div className={styles.property}>{props.data.description}</div>
          </div>}
        {(props.data.recurringSpend?.amount || props.data.value?.amount) &&
          <div className={styles.row}>
            {props.data.recurringSpend?.amount && <div className={styles.property}>{getCostDisplayVal(props.data.recurringSpend)} / year</div>}
            {props.data.value?.amount && <div className={styles.property}>TCV: {getCostDisplayVal(props.data.value)}</div>}
          </div>}
        {(props.data.startDate || props.data.endDate) &&
          <div className={styles.row}>
            <div className={styles.property}>{`${getLocalDateString(props.data.startDate)} - ${getLocalDateString(props.data.endDate)}`}</div>
          </div>}
        {props.data.attachments && props.data.attachments.length > 0 &&
          <div className={`${styles.row} ${styles.attachmentWrapper}`}>
            {props.data.attachments.map((attachment, i) =>
              <AttachmentReadOnly
                key={i}
                attachment={attachment as Attachment}
                onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
              />)}
          </div>}
      </div>
    </div>
  )
}

function ContractOption (props: {
  data: Contract
  selected?: boolean
  onSelect?: () => void
  onDelete?: () => void
}) {
  const [selected, setSelected] = useState<boolean>(false)

  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])

  function handleSelection () {
    setSelected(!selected)

    if (props.onSelect && !selected) {
      props.onSelect()
    }
    if (props.onDelete && selected) {
      props.onDelete()
    }
  }

  return (
    <div className={`${styles.contractCard} ${styles.clickable}`} onClick={handleSelection}>
      <div className={styles.action}>
        <input
          className="oro-checkbox"
          type="checkbox"
          checked={selected}
          readOnly={true}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.row}>
          <div className={styles.name}>{props.data.name}</div>
          <div className={styles.contractId}>{props.data.contractId}</div>
          {/* <div className={styles.spread}></div> */}
          {/* <div className={styles.contractValue}>{getCostDisplayVal(props.data.value)}</div> */}
        </div>
        {props.data.description &&
          <div className={styles.row}>
            <div className={`${styles.property} ${styles.description}`}><div>{props.data.description}</div></div>
          </div>}
        {(props.data.recurringSpend?.amount || props.data.value?.amount) &&
          <div className={styles.row}>
            {props.data.recurringSpend?.amount && <div className={styles.property}>{getCostDisplayVal(props.data.recurringSpend)} / year</div>}
            {props.data.value?.amount && <div className={styles.property}>TCV: {getCostDisplayVal(props.data.value)}</div>}
          </div>}
        {(props.data.startDate || props.data.endDate) &&
          <div className={styles.row}>
            <div className={styles.property}>{`${getLocalDateString(props.data.startDate)} - ${getLocalDateString(props.data.endDate)}`}</div>
          </div>}
      </div>
    </div>
  )
}

interface ContractSelectorProps {
  label?: string
  value?: Contract[]
  options?: Contract[]
  currencyOptions?: Option[]
  defaultCurrency?: string
  disabled?: boolean
  required?: boolean
  forceValidate?: boolean
  onSearch?: (keyword?: string) => Promise<Contract[]>
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string>
  validator?: (value?: Contract[]) => string
  onChange?: (value?: Contract[], newContractIndex?: number) => void
}

export function ContractSelector (props: ContractSelectorProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const inputRef = useRef(null)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [options, setOptions] = useState<Contract[]>([])
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [manualContractMode, setManualContractMode] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setContracts(props.value || [])
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(contracts)
      setError(manualContractMode ? 'Contract not added' : err)
    }
  }, [props.forceValidate])

  function searchContracts (keyword: string) {
    if (props.onSearch && keyword) {
      props.onSearch(keyword)
        .then((options) => {
          setOptions(options || [])
        })
        .catch(e => console.log(e))
    } else {
      setOptions([])
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedSoftwareSearch = useMemo(() => debounce(searchContracts), [])

  function handleSearchInputChange (keyword) {
    setSearchKeyword(keyword)
    debouncedSoftwareSearch(keyword)
  }

  function removeContract (index: number) {
    const contractsCopy = [...contracts]
    contractsCopy.splice(index, 1)
    setContracts(contractsCopy)

    if (props.onChange) {
      props.onChange(contractsCopy)
    }

    if (props.validator) {
      const err = props.validator(contractsCopy)
      setError(err)
    }
  }

  function handleSelection (selection?: Contract) {
    const contractsCopy = [...contracts, selection]
    setContracts(contractsCopy)

    if (props.onChange) {
      props.onChange(contractsCopy, (contractsCopy.length - 1))
    }

    if (props.validator) {
      const err = props.validator(contractsCopy)
      setError(err)
    }

    setManualContractMode(false)
  }

  function handleDeletion (contractToDelete: Contract) {
    const indexToDelete = contracts.findIndex(contract => contract.contractId === contractToDelete.contractId)
    if (indexToDelete !== -1) {
      removeContract(indexToDelete)
    }
  }

  function addContractManualy () {
    closeSearch()
    setManualContractMode(true)
  }

  function startSearchMode () {
    setOptions([])
    setSearchKeyword('')
    setSearchMode(true)
    if(inputRef?.current?.focus) setTimeout(() => inputRef.current.focus(), 500)
  }

  function clearSearch () {
    setOptions([])
    setSearchKeyword('')
  }

  function closeSearch () {
    setSearchMode(false)
    setOptions([])
    setSearchKeyword('')
    if(inputRef?.current?.blur) inputRef.current.blur()
  }

  function resetSearch () {
    closeSearch()

    if (props.validator) {
      const err = props.validator(contracts)
      setError(err)
    }
  }

  function loadDocument (contractIndex: number, fieldName: string, type?: string, fileName?: string): Promise<Blob | string> {
    if (props.loadDocument) {
      return props.loadDocument(`originalContracts[${contractIndex}].${fieldName}`, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <div className={styles.contractSelector}>
      <div className={styles.label}>{props.label}</div>

      <div className={classnames(styles.search, {[styles.visible]: !manualContractMode, [styles.focus]: searchMode, [styles.error]: error })}>
        {/* <div className={styles.searchDropdown} onClick={startSearchMode}>
          Select <ChevronDown size={16} color={'var(--warm-neutral-shade-400)'} />
        </div> */}
        <Search size={16} color={'var(--warm-neutral-shade-400)'} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search using name"
          value={searchKeyword || ''}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onFocus={() => setSearchMode(true)}
          // onKeyDown={handleKeyDown}
        />
        {searchKeyword && <X size={16} color={'var(--warm-neutral-shade-400)'} onClick={clearSearch} />}

        {searchMode &&
          <div className={classnames(styles.optionsWrapper, {[styles.visible]: searchMode})}>
            {options.map((option , i) =>
              <ContractOption
                key={i}
                data={option}
                selected={contracts.some(contract => option.contractId === contract.contractId)}
                onSelect={() => handleSelection(option)}
                onDelete={() => handleDeletion(option)}
              />)}

            {options.length === 0 &&
              <div className={`${styles.optionItem} ${styles.hint}`}>
                {searchKeyword ? 'No matching result found' : 'Type a keyword to search'}
              </div>}

            <div className={`${styles.optionItem} ${styles.addManualBtn}`} onClick={addContractManualy}>
              <div className={styles.btn}>
                <Plus size={16} color={'var(--warm-neutral-shade-400)'} strokeWidth={'2px'} /> Add a contract manually
              </div>
            </div>
          </div>}
      </div>

      {contracts && contracts.length > 0 && contracts.map((contract, i) =>
        <ContractCard
          key={i}
          data={contract}
          onDeleteClick={() => removeContract(i)}
          loadDocument={(...args) => loadDocument(i, ...args)}
        />)}

      {/* {(!props.options || props.options.length < 1) && !manualContractMode &&
        <div
          className={classnames(styles.addContractBtn, {[styles.invalid]: error})}
          onClick={addContractManualy}
        >
          <Plus size={16} color={'var(--warm-neutral-shade-200)'} strokeWidth={'3px'} />Add contract manually
        </div>} */}

      {manualContractMode &&
        <ManualContractForm
          currencyOptions={props.currencyOptions}
          defaultCurrency={props.defaultCurrency}
          forceValidate={props.forceValidate}
          onClose={() => setManualContractMode(false)}
          onSubmit={handleSelection}
        />}

      {searchMode &&
        <div className={styles.backdrop} onClick={resetSearch}></div>}

      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
