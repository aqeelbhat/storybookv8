import React, { useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { ArrowRight, FileText, Plus, X } from 'react-feather'

import { Option } from '../Types'
import { ContractDetail, IDRef, ObjectSearchVariables, ObjectValue, PurchaseOrder, Document, ContractRuntimeStatus } from '../Types/common'
import { ObjectSelectorConfig } from '../CustomFormDefinition'
import { debounce, mapCurrencyToSymbol } from '../util'
import { DOWN_ARROW_KEY_CODE, ENTER_KEY_CODE, ESCAPE_KEY_CODE, ObjectSelectorSearchResponse, UP_ARROW_KEY_CODE } from '../Inputs/types'
import { getTotalPriceDisplayText } from '../Form/changepo-form.component'

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { DEFAULT_PAGE_SIZE, PoSearchPopup } from './popovers/poSearchPopup'
import { mapObjectToIDRef } from '../CustomFormDefinition/View/mapper'
import { formatDate, getFormattedAmountValue, getLocalDateString, getPOLogoUrl } from '../Form/util'
import { ContractTypeDefinition, Field } from '..'
import { Events, FieldOptions } from '../CustomFormDefinition/NewView/FormView.component'
import { ContractDetailPopup } from './popovers/contractDetailsPopup'
import { PODetailPopup } from './popovers/poDetailsPopup'
import { DROPDOWN_MAX_HEIGHT } from '../MultiLevelSelect/types'
import { getI18Text as getI18ControlText } from '../i18n'


function POCard (props: {
  value: IDRef | PurchaseOrder
  allowClick?: boolean
  showDelete?: boolean
  showSelect?: boolean
  activeOptionIndex?: number
  index?: number
  defaultCurrency?: string
  locale: string
  poDetailsNotAvailable?: boolean
  listView?: boolean
  getPO?: (id: string) => Promise<PurchaseOrder>
  onClick?: () => void
  onDelete?: () => void
  onSelect?: () => void
  onShowDetails?: (data: PurchaseOrder) => void
  withVendorInfo?: boolean
}) {
  const [po, setPO] = useState<PurchaseOrder | undefined>()
  const [isPODetailsNotAvailable, setIsPODetailsNotAvailable] = useState<boolean>(false)

  useEffect(() => {
    if ((props.value as PurchaseOrder)?.poNumber) {
      setPO(props.value)
    } else if ((props.value as IDRef)?.id && props.getPO && !props.poDetailsNotAvailable) {
      props.getPO(props.value.id)
        .then((response: PurchaseOrder) => {
          setPO(response)
        })
        .catch(err => {
          console.log(err)
        })
    } else if (!(props.value as IDRef)?.id && (props.value as IDRef)?.refId) {
      setIsPODetailsNotAvailable(true)
    } else {
      setPO(props.value)
    }
  }, [props.value])

  useEffect(() => {
    setIsPODetailsNotAvailable(props.poDetailsNotAvailable || false)
  }, [props.poDetailsNotAvailable])

  function showDetails (_po: PurchaseOrder) {
    props.onShowDetails && props.onShowDetails(_po)
  }

  return (
    <div className={classnames(styles.objectCard, { [styles.clickable]: props.allowClick }, { [styles.focuseditem]: props.allowClick && (props.index === props.activeOptionIndex) })} onClick={props.onClick}>
      {props.showDelete &&
        <div className={styles.delete} onClick={props.onDelete}>
          <span className={styles.icon}><X size={24} color={'var(--warm-neutral-shade-200)'} /></span>
        </div>}
      {!isPODetailsNotAvailable && <div className={styles.primary}>
        <div className={!props.listView ? `${styles.prop} ${styles.link}` : styles.listProp} onClick={() => (!props.listView && !isPODetailsNotAvailable) && showDetails(po)}>{po?.poNumber || po?.id || '-'}</div>
        {!props.withVendorInfo && <div className={!props.listView ? styles.prop : styles.listProp}>{po?.normalizedVendorRef?.name || po?.normalizedVendorRef?.selectedVendorRecord?.name}</div>}
        {props.withVendorInfo && (po?.cost || po?.itemList?.items) && <div className={!props.listView ? styles.prop : styles.listProp}>{getTotalPriceDisplayText(po, props.defaultCurrency)}</div>}
      </div>}
      {!isPODetailsNotAvailable && <div className={styles.secondary}>
        {props.listView && (po?.cost || po?.itemList?.items) && <div className={!props.listView ? styles.prop : styles.listProp}>{getTotalPriceDisplayText(po, props.defaultCurrency)}</div>}
        {props.listView && po?.departmentRef?.name && <span className={styles.dotSeperator}></span>}
        {!props.listView && (po?.start && po?.end) && <div className={classnames(styles.prop, styles.attribute)}>{getLocalDateString(po.start, props.locale)} - {getLocalDateString(po.end, props.locale)}</div>}
        {po?.departmentRef?.name && <div className={!props.listView ? classnames(styles.prop, styles.attribute) : styles.listProp}>{po?.departmentRef?.name}</div>}
        {props.listView && po?.companyEntityRef?.name && <span className={styles.dotSeperator}></span>}
        {po?.companyEntityRef?.name && <div className={!props.listView ? classnames(styles.prop, styles.attribute) : styles.listProp}>{po?.companyEntityRef?.name}</div>}
        {!props.listView && po?.accountRef?.name && <div className={classnames(styles.prop, styles.attribute)}>{po?.accountRef?.name}</div>}
      </div>}
      {/* {!isPODetailsNotAvailable && !props.allowClick && <div className={styles.secondary}>
        {po?.start && po?.end && <div className={styles.prop}>{getLocalDateString(po.start, props.locale)} - {getLocalDateString(po.end, props.locale)}</div>}
        {po?.accountRef?.name && <div className={styles.prop}>{po?.accountRef?.name}</div>}
      </div>} */}

      {!isPODetailsNotAvailable && props.withVendorInfo && po?.normalizedVendorRef && <div className={styles.vendor}>
        {getPOLogoUrl(po?.normalizedVendorRef) && (
          <div className={styles.supplierLogo}>
            <img width={44} src={getPOLogoUrl(po?.normalizedVendorRef)} alt='' />
          </div>
        )}
        <div className={styles.vendorInfo}>
          <div className={styles.primary}><div className={styles.prop}><span className={styles.vendorName}>{po?.normalizedVendorRef?.name || po?.normalizedVendorRef?.selectedVendorRecord?.name}</span></div></div>
          <div className={styles.secondary}><div className={styles.prop}><span className={styles.vendorInfoKey}>{getI18ControlText('--fieldTypes--.--objectSelector--.--vendorId--')}: {po?.normalizedVendorRef?.selectedVendorRecord?.vendorId}</span></div></div>
        </div>
      </div>}

      {isPODetailsNotAvailable && <div className={styles.primary}>
        <div className={styles.prop}>{(props.value as IDRef)?.refId}</div>
      </div>}
      {isPODetailsNotAvailable && <div className={styles.secondary}>
        <div className={styles.noMatch}>{getI18ControlText('--validationMessages--.--noMatchesFound--')}</div>
      </div>}
      {props.showSelect && po?.poNumber && <div onClick={props.onSelect} className={styles.selectable}>{getI18ControlText('--fieldTypes--.--objectSelector--.--select--')}</div>}
    </div>
  )
}
function ContractCard (props: {
  value: IDRef | ContractDetail
  allowClick?: boolean
  showDelete?: boolean
  showSelect?: boolean
  activeOptionIndex?: number
  index?: number
  defaultCurrency?: string
  locale: string
  contractDetailsNotAvailable?: boolean
  listView?: boolean
  getContract?: (id: string) => Promise<ContractDetail>
  onClick?: () => void
  onDelete?: () => void
  showDocuments?: boolean
  onSelect?: () => void
  onDocumentClick?: (doc: Document) => void
  onShowDetails?: (data: ContractDetail) => void
}) {
  const [contract, setContract] = useState<ContractDetail | undefined>()
  const [isContractDetailsNotAvailable, setIsContractDetailsNotAvailable] = useState<boolean>(false)

  useEffect(() => {
    if ((props.value as ContractDetail)?.contractId) {
      setContract(props.value as ContractDetail)
    } else if ((props.value as IDRef)?.id && props.getContract && !props.contractDetailsNotAvailable) {
      props.getContract(props.value.id)
        .then((response: ContractDetail) => {
          setContract(response)
        })
        .catch(err => {
          console.log(err)
        })
    } else if (!(props.value as IDRef)?.id && (props.value as IDRef)?.refId) {
      setIsContractDetailsNotAvailable(true)
    } else {
      setContract(undefined)
    }
  }, [props.value])

  useEffect(() => {
    setIsContractDetailsNotAvailable(props.contractDetailsNotAvailable || false)
  }, [props.contractDetailsNotAvailable])

  const showDocuments = props.showDocuments && !isContractDetailsNotAvailable && contract?.documents && contract?.documents.length > 0

  function showDetails (contract: ContractDetail) {
    props.onShowDetails && props.onShowDetails(contract)
  }

  function getStatusClassName (contract: ContractDetail) {
    const status = contract?.runtimeStatus || ''

    switch (status) {
      case ContractRuntimeStatus.signed:
        return styles.active
      case ContractRuntimeStatus.renewalDue:
        return styles.renew
      case ContractRuntimeStatus.cancelled:
        return styles.closed
      case ContractRuntimeStatus.closed:
        return styles.closed
      case ContractRuntimeStatus.expired:
        return styles.closed
      default:
        return styles.active
    }
  }

  function getContractStatusDisplay (contract: ContractDetail): string {
    const status = contract.runtimeStatus

    switch (status) {
      case ContractRuntimeStatus.signed:
        return getI18ControlText('--fieldTypes--.--objectSelector--.--active--')
      case ContractRuntimeStatus.cancelled:
        return getI18ControlText('--fieldTypes--.--objectSelector--.--cancelled--')
      case ContractRuntimeStatus.closed:
        return getI18ControlText('--fieldTypes--.--objectSelector--.--expired--')
      case ContractRuntimeStatus.expired:
        return getI18ControlText('--fieldTypes--.--objectSelector--.--closed--')
      case ContractRuntimeStatus.renewalDue:
        return getI18ControlText('--fieldTypes--.--objectSelector--.--renewalDue--')
      default:
        return getI18ControlText('--fieldTypes--.--objectSelector--.--active--')
    }
  }

  return (
    <div className={classnames(styles.objectCard, { [styles.clickable]: props.allowClick }, { [styles.focuseditem]: props.allowClick && (props.index === props.activeOptionIndex) })} onClick={props.onClick}>
      {props.showDelete &&
        <div className={styles.delete} onClick={props.onDelete}>
           <span className={styles.icon}><X size={24} color={'var(--warm-neutral-shade-200)'} /></span>
        </div>}
      {!isContractDetailsNotAvailable && <div className={styles.primary}>
        <div className={!props.listView ? `${styles.prop} ${styles.link}` : styles.listProp} onClick={() => (!props.listView && !isContractDetailsNotAvailable) && showDetails(contract)}>{contract?.contractId || contract?.name }</div>
        {props.listView && contract?.normalizedVendor && <div className={styles.prop}>{contract?.normalizedVendor?.name}</div>}
        {!props.listView && <div className={styles.prop}>{contract?.contractType?.name || '-'}</div>}
        {contract && <div className={classnames(styles.status, `${getStatusClassName(contract)}`)}>
          <span className={styles.value}>{getContractStatusDisplay(contract)}</span>
        </div>}
      </div>}
      {!isContractDetailsNotAvailable && <div className={styles.secondary}>
        {props.listView && <>
          <div className={styles.listProp}>{getFormattedAmountValue(contract?.totalValue, false)}</div>
          {contract?.totalValue && contract?.recurringSpend && <span className={styles.dotSeperator}></span>}
          <div className={styles.listProp}>{getFormattedAmountValue(contract?.recurringSpend, false)}</div>
        </>}
        {!props.listView && <>
          <div className={styles.prop}>
            <span className={styles.label}>{getI18ControlText('--fieldTypes--.--objectSelector--.--tvc--')}:</span>
            <span className={styles.value}>{getFormattedAmountValue(contract?.totalValue, false)}</span>
          </div>
          <div className={styles.prop}>
            <span className={styles.label}>{getI18ControlText('--fieldTypes--.--objectSelector--.--recurring--')}:</span>
            <span className={styles.value}>{getFormattedAmountValue(contract?.recurringSpend, false)}</span>
          </div>
        </>
        }
      </div>}
      {!isContractDetailsNotAvailable && <div className={styles.secondary}>
        {(contract?.startDate || contract?.endDate) && <div className={classnames(styles.prop, { [styles.attribute]: props.listView })}>{formatDate(contract?.startDate)} {contract?.startDate && contract?.endDate ? '-' : ''} {formatDate(contract?.endDate)}</div>}
        <div className={classnames(styles.prop, { [styles.attribute]: props.listView })}>{contract?.billingCycle}</div>
        <div className={classnames(styles.prop, { [styles.attribute]: props.listView })}>{contract?.companyEntities?.[0]?.name}</div>
      </div>}
      {!isContractDetailsNotAvailable && !props.listView && contract?.normalizedVendor && <div className={styles.vendor}>
        {getPOLogoUrl(contract?.normalizedVendor) && (
          <div className={styles.supplierLogo}>
            <img width={44} src={getPOLogoUrl(contract?.normalizedVendor)} alt='' />
          </div>
        )}
        <div className={styles.vendorInfo}>
          <div className={styles.primary}><div className={styles.prop}><span className={styles.vendorName}>{contract?.normalizedVendor?.name || contract?.normalizedVendor?.selectedVendorRecord?.name}</span></div></div>
          <div className={styles.secondary}><div className={styles.prop}><span className={styles.vendorInfoKey}>{getI18ControlText('--fieldTypes--.--objectSelector--.--vendorId--')}: {contract?.normalizedVendor?.selectedVendorRecord?.vendorId || '-'}</span></div></div>
        </div>
      </div>}
      {isContractDetailsNotAvailable && <div className={styles.primary}>
        <div className={styles.prop}>{(props.value as IDRef)?.refId}</div>
      </div>}
      {isContractDetailsNotAvailable && <div className={styles.secondary}>
        <div className={styles.noMatch}>{getI18ControlText('--validationMessages--.--noMatchesFound--')}</div>
      </div>}
      {showDocuments && <div className={styles.documents}>
      {(contract?.documents || []).map((doc, index)=> (
        <div key={index} className={styles.doc} onClick={()=> {
          if (!doc.sensitive && props.onDocumentClick) {
            props.onDocumentClick(doc)
          }
        }}><FileText size={16} color="var(--warm-neutral-shade-500)"></FileText>{doc.name}</div>
      ) )}
      </div>}
      {props.showSelect && contract?.contractId && <div onClick={props.onSelect} className={styles.selectable}>{getI18ControlText('--fieldTypes--.--objectSelector--.--select--')}</div>}
    </div>
  )
}
interface ObjectSelectorProps {
  id?: string
  placeholder?: string
  value?: IDRef
  showSelect?: boolean
  disableSearch?: boolean
  config?: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    objectSelectorConfig?: ObjectSelectorConfig
    defaultCurrency?: string
    locale: string
    showDocuments?: boolean
  }
  additionalOptions?: FieldOptions
  dataFetchers?: {
    getPO?: (id: string) => Promise<PurchaseOrder>
    getContract?: (id: string) => Promise<ContractDetail>
    searchObjects?: (type: ObjectType, searchVariables: ObjectSearchVariables) => Promise<ObjectSelectorSearchResponse>
    getContractTypeDefinition?: () => Promise<ContractTypeDefinition[]>
    getFormConfig?: (formId: string) => Promise<Field[]>
  }
  staticOptions?: ObjectSelectorSearchResponse
  events?: Events
  poFormConfig?: Field[]
  validator?: (value?: IDRef) => string | null
  onChange?: (value: IDRef) => void,
  onDocumentClick?: (doc: Document) => void,
  onSelect?: (value: IDRef) => void
}

export function ObjectSelectorControl (props: ObjectSelectorProps) {
  const [state, setState] = useState<IDRef | null>()
  const [searchString, setSearchString] = useState<string>('')
  const [options, setOptions] = useState<ObjectValue[]>([])
  const [totalOptions, setTotalOptions] = useState<number>(0)
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)
  const [advancePOSearchVisible, setAdvancePOSearchVisible] = useState<boolean>(false)
  const [isItemAlreadyAdded, setIsItemAlreadyAdded] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [isObjectNotFound, setIsObjectNotFound] = useState<boolean>(false)
  const [showStaticOptions, setShowStaticOptions] = useState<boolean>(false)
  const [selectedObject, setSelectedObject] = useState<ObjectValue>()
  const [poContractDetailsVisible, setPoContractDetailsVisible] = useState<boolean>(false)

  const myContainer = useRef(null)
  const selectInputContainer = useRef<any>(null)
  const optionsWrapper = useRef<any>(null)
  const [optionsContainerTop, setOptionsContainerTop] = useState('')
  const [optionsContainerwidth, setOptionsContainerwidth] = useState('')
  const [searchMode, setSearchMode] = useState<boolean>(false)

  useEffect(() => {
    setSearchMode((searchString && !isObjectNotFound) || showStaticOptions)
  }, [searchString, isObjectNotFound, showStaticOptions])

  function shallDropdownGrowUp (): boolean {
    if (myContainer.current) {
      const rect = myContainer.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const spaceBelow = viewportHeight - (rect.top + rect.height)

      return (spaceBelow < DROPDOWN_MAX_HEIGHT) && (spaceAbove > spaceBelow)
    }

    return false
  }

  useEffect(() => {
    if (selectInputContainer?.current) {
    const { top, bottom, width } = selectInputContainer.current.getBoundingClientRect()

      if (shallDropdownGrowUp()) {
        if (optionsWrapper?.current) {
          const { height } = optionsWrapper.current.getBoundingClientRect()
          setOptionsContainerTop((top - height) + 'px')
        }
      } else {
        if (optionsWrapper?.current) {
          setOptionsContainerTop((bottom) + 'px')
        }
      }

      setOptionsContainerwidth(width + 'px')
    }
  }, [myContainer?.current, selectInputContainer?.current, optionsWrapper?.current, shallDropdownGrowUp, searchMode])

  useEffect(() => {
    if (!props.config.isReadOnly) {
      if (searchMode) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchMode])

  function triggerValidation (_state?: IDRef) {
    if (!props.config?.optional && !props.config?.isReadOnly && props.validator) {
      setError(props.validator(_state))
    }
  }

  function clearSearch () {
    if(props.staticOptions){
      setActiveOptionIndex(-1)
      setShowStaticOptions(false)
      return
    }
    setOptions([])
    setActiveOptionIndex(-1)
    setSearchString('')
  }

  function resetSearch () {
    if(props.staticOptions){
      setActiveOptionIndex(-1)
      setShowStaticOptions(false)
      return
    }

    setOptions([])
    setActiveOptionIndex(-1)
    setSearchString('')
    triggerValidation(state)
  }

  function handleSelection (selection?: ObjectValue) {
    const _state = mapObjectToIDRef(selection, props.config?.objectSelectorConfig?.type)

    setState(_state)
    setIsObjectNotFound(false)
    setAdvancePOSearchVisible(false)
    resetSearch()

    triggerValidation(_state)

    if (props.onChange) {
      props.onChange(_state)
    }
  }

  function clearSelection () {
    if (state) {
      handleSelection(null)
    }
  }

  function search (searchVariables: ObjectSearchVariables) {
    if (props.dataFetchers?.searchObjects) {
      props.dataFetchers.searchObjects(props.config?.objectSelectorConfig?.type, searchVariables)
        .then((res: { objs: ObjectValue[], total: number }) => {
          setOptions(res.objs || [])
          setTotalOptions(res.total)
          setActiveOptionIndex(-1)
        })
        .catch(e => console.log(e))
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedSearch = useMemo(() => debounce(search), [props])

  function handleSearchInputChange (keyword) {
    if (props.staticOptions) {
      return
    }
    // setIsUserAlreadyAdded(false)
    setSearchString(keyword)
    debouncedSearch({
      filter: {
        keywords: keyword
      },
      page: 0,
      size: DEFAULT_PAGE_SIZE,
      isIncludeCompletedStatus: props.config?.objectSelectorConfig?.includeCompleted || false // used to fetch completed contract (signed, expired, closed, cancelled)
    })
  }

  function handleAdvanceSearch (searchVariables: ObjectSearchVariables) {
    setSearchString(searchVariables.filter.keywords)
    debouncedSearch(searchVariables)
  }

  function focusNextListItem (direction: number) {
    if (direction === DOWN_ARROW_KEY_CODE) {
      const currentActiveElementIsNotLastItem = activeOptionIndex < options.length - 1

      if (currentActiveElementIsNotLastItem) {
        setActiveOptionIndex(activeOptionIndex + 1)
      }
    } else if (direction === UP_ARROW_KEY_CODE) {
      const currentActiveElementIsNotFirstItem = activeOptionIndex > (state ? -1 : 0);

      if (currentActiveElementIsNotFirstItem) {
        setActiveOptionIndex(activeOptionIndex - 1)
      }
    }
  }

  function handleKeyDown (e) {
    if (searchString && options.length > 0) {
      switch (e.keyCode) {
        case ENTER_KEY_CODE:
          handleSelection(options[activeOptionIndex])
          return;

        case DOWN_ARROW_KEY_CODE:
          e.preventDefault()
          focusNextListItem(DOWN_ARROW_KEY_CODE);
          return;

        case UP_ARROW_KEY_CODE:
          e.preventDefault()
          focusNextListItem(UP_ARROW_KEY_CODE);
          return;

        case ESCAPE_KEY_CODE:
          resetSearch();
          return;

        default:
          return;
      }
    }
  }

  function showAdvancePOSearch () {
    setAdvancePOSearchVisible(true)
  }

  function continueWithEnteredPO () {
    const _state: IDRef = { id: null, name: null, erpId: null, refId: searchString }

    setState(_state)
    setIsObjectNotFound(true)
    triggerValidation(_state)

    if (props.onChange) {
      props.onChange(_state)
    }
  }

  useEffect(() => {
    setState(props.value)
    // id and refid both reflect non exist Object(contrac|PO))
    if (!(props.value?.id) && props.value?.refId) {
      setIsObjectNotFound(true)
    }
    if(props.value) {
      setError(null)
    }
  }, [props.value])

  useEffect(() => {
    if (props.config?.forceValidate) {
      triggerValidation(state)
    }
  }, [props.config])

  useEffect(() => {
    const staticList = props.staticOptions
    if(staticList) {
      setOptions(staticList.objs || [])
      setTotalOptions(staticList.total)
      setActiveOptionIndex(-1)
    }
  }, [props.staticOptions])

  function handleFocus () {
    if(props.staticOptions){
      setShowStaticOptions(true)
    }
  }
  function handleBlur (e) {
    if(props.staticOptions){
      return
    }
    if (!e.target.value) {
      triggerValidation()
    }
  }
  function handleShowDetails (data: ObjectValue) {
    if (props.config?.objectSelectorConfig?.type === ObjectType.contract) {
      setSelectedObject(data as ContractDetail)
      setPoContractDetailsVisible(true)
    } else if (props.config?.objectSelectorConfig?.type === ObjectType.po) {
      setSelectedObject(data as PurchaseOrder)
      setPoContractDetailsVisible(true)
    }
  }
  // const _listToBeShown = (searchString && !isObjectNotFound) || showStaticOptions
  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.objectSelector} data-test-id={props.id} ref={myContainer}>
        {(!props.config?.isReadOnly && !state) &&
          <div className={styles.search} ref={selectInputContainer}>
            <input
              id={props.id}
              type="text"
              disabled={props.disableSearch}
              placeholder={props.placeholder || 'Select using supplier name, number, or keyword'}
              value={searchString || ''}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {(searchString || showStaticOptions) && <X className={styles.clearBtn} size={16} color={'var(--warm-neutral-shade-400)'} onClick={clearSearch} />}
          </div>}

        <div
          className={classnames(styles.optionsWrapper, { [styles.visible]: searchMode })}
          style={{top: optionsContainerTop, width: optionsContainerwidth}}
          ref={optionsWrapper}
        >
          {props.config?.objectSelectorConfig?.type === ObjectType.po && options.map((option, i) =>
            <POCard
              key={i}
              index={i}
              activeOptionIndex={activeOptionIndex}
              value={option}
              allowClick={true}
              defaultCurrency={props.config?.defaultCurrency}
              listView={true}
              locale={props.config.locale}
              onClick={() => handleSelection(option)}
            />)}
          {props.config?.objectSelectorConfig?.type === ObjectType.contract && options.map((option, i) =>
            <ContractCard
              key={i}
              index={i}
              activeOptionIndex={activeOptionIndex}
              value={option as ContractDetail}
              allowClick={true}
              listView={true}
              defaultCurrency={props.config?.defaultCurrency}
              locale={props.config.locale}
              onClick={() => handleSelection(option)}
            />)}

          {options.length === 0 && !isObjectNotFound &&
            <div className={`${styles.optionItem} ${styles.hint}`}>
              {searchString ? getI18ControlText('--fieldTypes--.--objectSelector--.--noMatchingResultFound--') : getI18ControlText('--fieldTypes--.--objectSelector--.--typeKeywordToSearch--')}
            </div>}
          {isItemAlreadyAdded &&
            <div className={`${styles.optionItem} ${styles.alert}`}>
              {getI18ControlText('--fieldTypes--.--objectSelector--.--itemAlreadyAdded--')}
            </div>}

          {props.config?.objectSelectorConfig?.type === ObjectType.po && options.length === 0 && !isObjectNotFound &&
            <div className={`${styles.optionItem} ${styles.addPO}`} onClick={continueWithEnteredPO}>
              <Plus color='var(--warm-neutral-shade-500)' size={16} />{getI18ControlText('--fieldTypes--.--objectSelector--.--continueWith--', { searchString })}
            </div>}

          {props.config?.objectSelectorConfig?.type === ObjectType.po && options.length !== 0 &&
            <div className={`${styles.optionItem} ${styles.advSearch}`} onClick={showAdvancePOSearch}>
              {getI18ControlText('--fieldTypes--.--objectSelector--.--viewAdvancedSearchResults--')} <ArrowRight size={16} />
            </div>}
        </div>

        {searchMode &&
          <div className={styles.backdrop} onClick={resetSearch}></div>}

        {(state || isObjectNotFound) && props.config?.objectSelectorConfig?.type === ObjectType.po &&
          <div className={classnames(styles.selectedObject)}>
            <POCard
              value={state}
              showDelete={!props.config?.isReadOnly}
              defaultCurrency={props.config?.defaultCurrency}
              locale={props.config.locale}
              poDetailsNotAvailable={isObjectNotFound}
              getPO={props.dataFetchers?.getPO}
              onDelete={clearSelection}
              showSelect={props.showSelect}
              onSelect={() => props.onSelect && props.onSelect(state)}
              onShowDetails={handleShowDetails}
              withVendorInfo
            />
          </div>}
        {(state || isObjectNotFound) && props.config?.objectSelectorConfig?.type === ObjectType.contract &&
          <div className={classnames(styles.selectedObject)}>
            <ContractCard
              value={state}
              showDelete={!props.config?.isReadOnly}
              defaultCurrency={props.config?.defaultCurrency}
              locale={props.config.locale}
              contractDetailsNotAvailable={isObjectNotFound}
              getContract={props.dataFetchers?.getContract}
              onDelete={clearSelection}
              showDocuments={props.config?.showDocuments}
              onDocumentClick={props.onDocumentClick}
              showSelect={props.showSelect}
              onSelect={() => props.onSelect && props.onSelect(state)}
              onShowDetails={handleShowDetails}
            />
          </div>}

        <PoSearchPopup
          isOpen={advancePOSearchVisible}
          filter={{
            keywords: searchString
          }}
          options={options}
          totalOptions={totalOptions}
          departmentOptions={props.additionalOptions?.departments}
          defaultCurrency={props.config?.defaultCurrency}
          locale={props.config.locale}
          onFilterChange={(variables) => {
            if(advancePOSearchVisible) {
              handleAdvanceSearch(variables)
            } }}
          onClose={() => { clearSearch(); setAdvancePOSearchVisible(false) }}
          onSelect={(option) => handleSelection(option)}
        />
        {props.config?.objectSelectorConfig?.type === ObjectType.contract && <ContractDetailPopup
          isOpen={poContractDetailsVisible}
          data={selectedObject as ContractDetail}
          documentTypeOptions={props.additionalOptions?.documentType}
          dataFetchers={props.dataFetchers}
          events={props.events}
          options={props.additionalOptions}
          onClose={() => { setPoContractDetailsVisible(false) }}
        />}
        {props.config?.objectSelectorConfig?.type === ObjectType.po && <PODetailPopup
          isOpen={poContractDetailsVisible}
          data={selectedObject as PurchaseOrder}
          locale={props.config.locale}
          documentTypeOptions={props.additionalOptions?.documentType}
          dataFetchers={props.dataFetchers}
          events={props.events}
          fields={props.poFormConfig}
          options={props.additionalOptions}
          onClose={() => { setPoContractDetailsVisible(false) }}
        />}
      </div>

      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
