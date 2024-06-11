import classnames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Globe, Plus, Search, Trash2, User, X, XCircle } from 'react-feather'

import { Contract, Product } from '../types'
import { getSupplierLogoUrl, getUserDisplayName, isEmpty } from '../util'

import styles from './software-selector.module.scss'
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import DefaultLogo from './../assets/default-software-logo.svg'
import DefaultProviderLogo from './../assets/default-supplier-logo.svg'
import Check from './../assets/check-circle-filled.svg'
import { ContractModal } from './contract-modal.component'
import { LegalEntity } from '../../Types'
import { OROWebsiteInput, TextBox } from '../../Inputs'
import { OroButton } from '../../controls'
import { debounce } from '../../util'

function ManualSoftwareForm (props: {
  data?: Product
  forceValidate?: boolean
  onSearch?: (keyword?: string) => Promise<LegalEntity[]>
  onClose?: () => void
  onSubmit?: (data: Product) => void
}) {
  const [name, setName] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [website, setWebsite] = useState<string>('')

  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [options, setOptions] = useState<LegalEntity[]>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  const [error, setError] = useState<string | null>()

  useEffect(() => {
    if (props.data) {
      !name && setName(props.data.name || '')
      !companyName && setCompanyName(props.data.companyName || '')
      !website && setWebsite(props.data.website || '')
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

  useEffect(() => {
    if (forceValidate) {
      setError(!companyName && 'Software provider is a required field.')
    }
  }, [forceValidate])

  function getFormData (): Product {
    return {
      name,
      companyName,
      website
    }
  }

  function validateField (fieldName: string, value: string): string {
    const isInvalid = isEmpty(value)
    return isInvalid ? `This is a required field.` : ''
  }

  function isFormInvalid (): string {
    if (!name) {
      return 'name-field'
    }
    if (!companyName) {
      return 'manufacturer-field'
    }
    // if (!website) {
    //   return 'website-field'
    // }
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

  function searchSoftwares (keyword: string) {
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
  const debouncedSoftwareSearch = useMemo(() => debounce(searchSoftwares), [])

  function handleSearchInputChange (keyword) {
    setSearchKeyword(keyword)
    debouncedSoftwareSearch(keyword)
  }

  function clearSearch () {
    setOptions([])
    setSearchKeyword('')
  }

  function closeSearch () {
    setSearchMode(false)
    setOptions([])
    setSearchKeyword('')
  }

  function resetSearch () {
    if (searchKeyword) {
      handleSelection(searchKeyword)
    } else {
      closeSearch()
    }
  }

  function handleSelection (selection?: string) {
    setCompanyName(selection)
    setError(!selection && 'Software provider is a required field.')
    closeSearch()
  }

  return (
    <div className={styles.manualSoftwareForm}>
      <div className={styles.title}>Add new software <X size={16} color={'var(--warm-neutral-shade-200)'} className={styles.btn} onClick={props.onClose} /></div>

      <div className={styles.section}>
        <div id="name-field">
          <TextBox
            label="Product name"
            placeholder='Type here'
            value={name}
            required={true}
            forceValidate={forceValidate}
            validator={(value) => validateField('name', value)}
            onChange={setName}
          />
        </div>

      <div className={styles.manufacturerField} id="manufacturer-field">
        <div className={styles.label}>Parent company name</div>
        {companyName &&
          <div className={styles.selectedValue}>
            {companyName}<Trash2 size={16} color={'var(--warm-neutral-shade-200)'} className={styles.btn} onClick={() => setCompanyName('')} />
          </div>}

        {!companyName &&
          <div className={classnames(styles.search, {[styles.visible]: searchMode || !companyName, [styles.error]: error})}>
            <Search size={16} color={'var(--warm-neutral-shade-400)'} />
            <input
              type="text"
              placeholder="Type here"
              value={searchKeyword || ''}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => setSearchMode(true)}
            />
            {searchKeyword && <X size={16} color={'var(--warm-neutral-shade-400)'} onClick={clearSearch} />}

            {searchMode &&
              <div className={classnames(styles.optionsWrapper, {[styles.visible]: searchMode})}>
                {options.map((option , i) =>
                  <div className={`${styles.softwareCard} ${styles.clickable}`} onClick={() => handleSelection(option.legalEntityName)} key={i}>
                    <div className={styles.profile}>
                      <img src={getSupplierLogoUrl(option) || DefaultProviderLogo} />
                    </div>
              
                    <div className={styles.info}>
                      <div className={styles.row}>
                        <div className={styles.name}>{option.legalEntityName}</div>
                      </div>
                      {option.address?.address && option.address.address.length > 0 &&
                        <div className={styles.row}>
                          <div className={`${styles.property} ${styles.category}`}>
                            {[option.address.address[0].city || '', option.address.address[0].alpha2CountryCode || ''].filter(Boolean).join(', ')}
                          </div>
                        </div>}
                    </div>
                  </div>)}

                {options.length === 0 &&
                  <div className={`${styles.optionItem} ${styles.hint}`}>
                    {searchKeyword ? 'No matching result found' : 'Type a keyword to search'}
                  </div>}
              </div>}
          </div>}

        {searchMode &&
          <div className={styles.backdrop} onClick={resetSearch}></div>}

        {error && 
          <div className={styles.validationError}>
            <img src={AlertCircle} /> {error}
          </div>}
      </div>

        <div id="website-field">
          <OROWebsiteInput
            label="Product website"
            placeholder="Enter url"
            value={website}
            onChange={setWebsite}
          />
        </div>
      </div>

      <OroButton label='Save' type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />
    </div>
  )
}

function SoftwareCard (props: {
  data: Product
  activeContracts?: Contract[]
  disablePreference?: boolean
  hasFooter?: boolean
  onDeleteClick: () => void
  onCardClick: () => void
}) {
  const [contractsExpanded, setContractsExpanded] = useState<boolean>(false)

  function handleDeleteClick (e) {
    e.stopPropagation()
    props.onDeleteClick()
  }

  function handleContractSummaryClick (e) {
    e.stopPropagation()
    setContractsExpanded(!contractsExpanded)
  }

  return (
    <div
      className={classnames(styles.softwareCard, {[styles.preferredSettable]: !props.disablePreference, [styles.preferred]: !props.disablePreference && props.data.isPreferred, [styles.hasFooter]: props.hasFooter})}
      onClick={props.onCardClick}
    >
      <div className={styles.actions}>
        <XCircle size={24} strokeWidth={'1px'} color={'var(--warm-neutral-shade-200)'} className={styles.btn} onClick={handleDeleteClick} />
      </div>

      <div className={styles.profile}>
        <img src={props.data.image || DefaultLogo} />
      </div>

      <div className={styles.info}>
        <div className={styles.row}>
          <div className={styles.name}>{props.data.name}</div>
          <div className={styles.spread} />
          {props.data.isContractActive && 
            <div className={styles.inUse}>
              <img src={Check} /> In Use
            </div>}
        </div>
        {(props.data.companyName || (props.data.categoryNames && props.data.categoryNames.length > 0)) &&
          <div className={styles.row}>
            {props.data.companyName && <div className={`${styles.property} ${styles.manufacturer}`}>{props.data.companyName}</div>}
            {props.data.website && <div className={`${styles.property} ${styles.website}`}><Globe size={16} color={'var(--warm-neutral-shade-200)'} />{props.data.website}</div>}
          </div>}
        {((props.data.categoryNames && props.data.categoryNames.length > 0)) &&
          <div className={styles.row}>
            {props.data.categoryNames && props.data.categoryNames.length > 0 && props.data.categoryNames.map((category, i) =>
              <div className={`${styles.property} ${styles.category}`} key={i}>{category}</div>)}
          </div>}
        {props.data.owner &&
          <div className={styles.row}>
            <div className={`${styles.property}`}>Owner: <span className={styles.owner}>{getUserDisplayName(props.data.owner)}</span></div>
          </div>}

        {props.activeContracts && props.activeContracts.length > 0 &&
          <div className={styles.contractsWrapper}>
            <div className={styles.summary} onClick={handleContractSummaryClick}>{props.activeContracts.length} active contract{props.activeContracts.length > 1 ? 's' : ''} <ChevronRight size={16} /></div>
          </div>}
      </div>

      <ContractModal
        isOpen={contractsExpanded}
        contracts={props.activeContracts}
        readOnly={true}
        onClose={() => setContractsExpanded(false)}
      />
    </div>
  )
}

function SoftwareOption (props: {
  data: Product
  onSelect: () => void
}) {
  return (
    <div className={`${styles.softwareCard} ${styles.clickable}`} onClick={props.onSelect}>
      <div className={styles.profile}>
        <img src={props.data.image || DefaultLogo} />
      </div>

      <div className={styles.info}>
        <div className={styles.row}>
          <div className={styles.name}>{props.data.name}</div>
          <div className={styles.spread} />
          {props.data.isContractActive &&
            <div className={styles.inUse}>
              <img src={Check} /> In Use
            </div>}
        </div>
        {props.data.companyName &&
          <div className={styles.row}>
            {props.data.companyName && <div className={`${styles.property} ${styles.manufacturer}`}>{props.data.companyName}</div>}
          </div>}
      </div>
    </div>
  )
}

interface SoftwareSelectorProps {
  label?: string
  description?: string
  value?: Product[]
  activeContracts?: Contract[]
  singleSelect?: boolean
  hasFooter?: boolean
  disabled?: boolean
  required?: boolean
  forceValidate?: boolean
  onSearch?: (keyword?: string) => Promise<Product[]>
  onSearchManufacturers?: (keyword?: string) => Promise<LegalEntity[]>
  validator?: (value?: Product[]) => string
  onChange?: (value?: Product[]) => void
}

export function SoftwareSelector (props: SoftwareSelectorProps) {
  const inputRef = useRef(null)
  const [softwares, setSoftwares] = useState<Product[]>([])
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [options, setOptions] = useState<Product[]>([])
  const [manualSoftwareMode, setManualSoftwareMode] = useState<boolean>(false)
  const [manualSoftwareName, setManualSoftwareName] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setSoftwares(props.value || [])
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(softwares)
      setError(manualSoftwareMode ? 'Software not added' : err)
    }
  }, [props.forceValidate])

  function searchSoftwares (keyword: string) {
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
  const debouncedSoftwareSearch = useMemo(() => debounce(searchSoftwares), [])

  function handleSearchInputChange (keyword) {
    setSearchKeyword(keyword)
    debouncedSoftwareSearch(keyword)
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
      const err = props.validator(softwares)
      setError(err)
    }
  }

  function removeSoftware (index: number) {
    const softwaresCopy = [...softwares]
    softwaresCopy.splice(index, 1)
    setSoftwares(softwaresCopy)

    if (props.onChange) {
      props.onChange(softwaresCopy)
    }

    if (props.validator) {
      const err = props.validator(softwaresCopy)
      setError(err)
    }
  }

  function toggleSelection (index: number) {
    const softwaresCopy = softwares.map((software, i) => {
      return {
        ...software,
        isPreferred: i === index && !software.isPreferred
      }
    })
    setSoftwares(softwaresCopy)

    if (props.onChange) {
      props.onChange(softwaresCopy)
    }

    if (props.validator) {
      const err = props.validator(softwaresCopy)
      setError(err)
    }
  }

  function handleSelection (selection?: Product) {
    const softwaresCopy = [...softwares, selection]
    setSoftwares(softwaresCopy)
    resetSearch()

    if (props.onChange) {
      props.onChange(softwaresCopy)
    }

    if (props.validator) {
      const err = props.validator(softwaresCopy)
      setError(err)
    }

    setManualSoftwareName('')
    setManualSoftwareMode(false)
  }

  function addSoftwareManualy (name: string) {
    closeSearch()
    setManualSoftwareName(name)
    setManualSoftwareMode(true)
    setError(null)
  }

  return (
    <div className={styles.softwareSelector}>
      <div className={styles.label}>{props.label}</div>

      {softwares && softwares.length > 0 && softwares.map((software, i) =>
        <SoftwareCard
          key={i}
          data={software}
          activeContracts={props.activeContracts}
          disablePreference={true}
          hasFooter={props.hasFooter}
          onDeleteClick={() => removeSoftware(i)}
          onCardClick={() => toggleSelection(i)}
        />)}

      {manualSoftwareMode &&
        <ManualSoftwareForm
          data={{ name: manualSoftwareName }}
          forceValidate={props.forceValidate}
          onSearch={props.onSearchManufacturers}
          onClose={() => setManualSoftwareMode(false)}
          onSubmit={handleSelection}
        />}

      {!props.singleSelect && softwares && softwares.length > 0 && !searchMode && !manualSoftwareMode &&
        <div
          className={classnames(styles.addSoftwareBtn, {[styles.focus]: searchMode, [styles.invalid]: error})}
          onClick={startSearchMode}
        >
          <Plus size={16} color={'var(--warm-neutral-shade-200)'} strokeWidth={'3px'} />Add another choice
        </div>}

      <div className={classnames(styles.search, {[styles.visible]: (!softwares || softwares.length < 1 || searchMode) && !manualSoftwareMode, [styles.error]: error })}>
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
              <SoftwareOption
                key={i}
                data={option}
                onSelect={() => handleSelection(option)}
              />)}

            {options.length === 0 &&
              <div className={`${styles.optionItem} ${styles.hint}`}>
                {searchKeyword ? 'No matching result found' : 'Type a keyword to search'}
              </div>}

            {searchKeyword &&
              <div className={`${styles.optionItem} ${styles.addManualBtn}`} onClick={() => addSoftwareManualy(searchKeyword)}>
                <div className={styles.btn}>
                  <Plus size={16} color={'var(--warm-neutral-shade-400)'} strokeWidth={'2px'} /> Add '{searchKeyword}'
                </div>
              </div>}
          </div>}
      </div>

      {searchMode &&
        <div className={styles.backdrop} onClick={resetSearch}></div>}

      {error && 
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
