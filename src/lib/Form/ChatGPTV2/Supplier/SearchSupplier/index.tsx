import React, { useEffect, useState } from "react";
import OroAnimator from "../../../../controls/OroAnimator";
import SearchBox from "../SearchBox";
import { Supplier, Option, VendorSuggestionRequest, NormalizedVendor, Contact } from "../../../../Types";

import styles from './style.module.scss'
import classNames from "classnames";
// import SupplierCard from "../SupplierCardV2";
import { PreferredSuppliers } from "../../types";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../../i18n";
import NewSupplierForm from "../NewSupplier";
import { OroButton } from "../../../../controls";
import { SupplierSearchComponent } from "../../../SupplierIdentificationV2/components/supplier-search-box";
import { SupplierDetail, SupplierSearchSummary, parseNVToSupplierV2 } from "../../../SupplierIdentificationV2";
import { NVType } from "../../../../Types/vendor";
import { SupplierSearchResultModal } from "../../../SupplierIdentificationV2/components/supplier-search-result-modal.component";
import { filterSupplierSearchSummaryWithSuppliers } from "../../../SupplierIdentificationV2/util";
import { SupplierCard } from "../../../SupplierIdentificationV2/components/supplier-card.component";
import { MasterDataRoleObject } from "../../..";

type Props = {
  hideSkip?: boolean
  defaultCurrency?: string
  allIndustryCodes?: Array<Option>
  preferredSupplier?: PreferredSuppliers[]
  supplierRoles?: MasterDataRoleObject[]
  countryOption?: Option[]
  languageOption?: Option[]
  onSupplierSelect?: (supplier: Supplier) => void
  onSearchSuppliers?: (search: string) => Promise<Supplier[]>
  onSkip?: () => void
  onAdvanceSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<SupplierSearchSummary>>
  onTypeaheadSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<NormalizedVendor>>
  fetchNVChildrensUsingParentID?: (selectedVendor: NormalizedVendor) => Promise<Array<SupplierSearchSummary>>
  onVendorSelect?: (selectedVendor: NormalizedVendor) => Promise<Supplier | undefined>
  onParentSelect?: (vendor: SupplierSearchSummary) => Promise<Supplier | undefined>
  onNotSureSupplierProceed?: (data: SupplierDetail) => Promise<Supplier | undefined>
  fetchNVDetailsForDuplicateSupplier?: (vendor: NormalizedVendor) => Promise<NormalizedVendor>
  fetchExistingContactList?: (vendorId: string) => Promise<Contact[]>
  fetchNVVendorByLegalEntityId?: (supplier: Supplier) => Promise<NormalizedVendor[]>
  reset: boolean
}

export default function SearchSupplier (props: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [newSupplier, setNewSupplier] = useState('')
  const [searchedSuppliers, setSearchedSuppliers] = useState<Supplier[]>([])
  const [supplierSearchText, setSupplierSearchText] = useState('')
  const [allVendors, setAllVendors] = useState<Array<SupplierSearchSummary>>([])
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false)
  const [showAddNewSupplier, setShowAddNewSupplier] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])

  function handleSearchClick (search: string) {
    setIsLoading(true)
    // setHideRecommendations(true)
    setSupplierSearchText(search)
    props.onSearchSuppliers(search)
      .then((res) => {
        setIsLoading(false)
        if (!res || res.length === 0) {
          setNewSupplier(search)
        } else {
          setSearchedSuppliers(res)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }
  function clearSearchResults () {
    setNewSupplier('')
    setSearchedSuppliers([])
    setIsLoading(false)
  }
  function handleSearchDelete () {
    clearSearchResults()
  }
  function getI18Text (key: string) {
    return t('--supplier--.' + key)
  }
  function handleSkipClick () {
    handleSearchDelete()
    setShowAddNewSupplier(false)
    props.onSkip()
  }
  useEffect(()=>{
    if(props.reset){
      clearSearchResults()
    }
  },[props.reset])

  function onAdvanceSearch(keyword: string) {
    if (props.onAdvanceSearch && keyword.trim().length > 0) {
      // passing companyEntity for boosting (For now it accept only one value)
      const filter: VendorSuggestionRequest = {
        keyword: keyword.trim()
      }
      props.onAdvanceSearch(filter)
        .then((resp) => {
          setAllVendors(resp)
          setShowSearchResult(true)
        })
        .catch(err => console.log(err))
    }
  }

  function onTypeaheadSelect(vendor: NormalizedVendor) {
    if (vendor.type !== NVType.parent && props.onSupplierSelect) {
      props.onSupplierSelect(parseNVToSupplierV2(vendor))
    } else {
      if (props.fetchNVChildrensUsingParentID) {
        props.fetchNVChildrensUsingParentID(vendor)
          .then(resp => {
            setAllVendors(resp)
            setShowSearchResult(true)
          })
          .catch(err => console.log(err))
      }
    }
  }

  function handleAdvanceSearch(payload: VendorSuggestionRequest): Promise<SupplierSearchSummary[]> {
    if (props.onAdvanceSearch && payload) {
      props.onAdvanceSearch(payload)
        .then((resp) => {
          setAllVendors(resp)
          return resp
        })
        .catch(err => console.log(err))
    } else {
      return Promise.reject()
    }
  }

  function onVendorSelect(vendor: NormalizedVendor) {
    if (props.onVendorSelect) {
      setShowSearchResult(false)
      props.onVendorSelect(vendor)
       .then(resp => {
         if (resp) {
           const _allSuppliers = [...searchedSuppliers]
           _allSuppliers.push(resp)
           setSearchedSuppliers(_allSuppliers)

          if (props.onSupplierSelect) {
            props.onSupplierSelect(resp)
          }
         }
       })
       .catch(err => console.warn('Error in selecting vendor record', err))
    }
  }

  function onParentSelect(vendor: SupplierSearchSummary) {
    if (props.onParentSelect) {
      setShowSearchResult(false)
      props.onParentSelect(vendor)
        .then(resp => {
          if (resp) {
            const _allSuppliers = [...searchedSuppliers]
            _allSuppliers.push(resp)
            setSearchedSuppliers(_allSuppliers)

            if (props.onSupplierSelect) {
              props.onSupplierSelect(resp)
            }
          }
        })
        .catch(err => console.warn('Error in selecting parent vendor record', err))
    }
  }

  function handleOnProceedNotSureSupplier(data: SupplierDetail) {
    if (props.onNotSureSupplierProceed) {
      setShowSearchResult(false)
      props.onNotSureSupplierProceed(data)
        .then(resp => {
          if (resp) {
            const _allSuppliers = [...searchedSuppliers]
            _allSuppliers.push(resp)
            setSearchedSuppliers(_allSuppliers)

            if (props.onSupplierSelect) {
              props.onSupplierSelect(resp)
            }
          }
        })
        .catch(err => console.warn('Error while proceed with not sure supplier', err))
    }
  }

  function onSupplierSelect (selected: boolean, suppliers: Supplier[]) {
    if (props.onSupplierSelect && selected) {
      props.onSupplierSelect(suppliers[0])
    }
  }

  function onAddSupplierContact (supplier: Supplier, index: number) {
    const _allSuppliers = searchedSuppliers.map(item => item.vendorId === supplier.vendorId ? supplier : item)
    setSearchedSuppliers(_allSuppliers)
  }

  function handleAddNewSupplierClicked () {
    setShowSearchResult(false)
    setShowAddNewSupplier(true)
  }

  function onNewsupplierFormClose () {
    setShowSearchResult(false)
    setShowAddNewSupplier(false)
  }

  function onModalClose () {
    setShowSearchResult(false)
  }

  const _foundSearchSuppliers = searchedSuppliers?.length > 0
  const _showNewSupplierForm = !!newSupplier

  return <div>
    {/* Search Supplier */}
    <div className={styles.searchBoxWrapper}>
    <div className={styles.searchMessage}>{t('--selectSupplier--')}</div>

      {/* Old Supplier search
        <SearchBox
          onSearch={handleSearchClick}
          onDelete={handleSearchDelete}
          showDelete={!isLoading && (_foundSearchSuppliers || !!newSupplier)}
          showLoading={isLoading}
          reset={props.reset}
          title={getI18Text('--searchSupplier--')}
          placeholder={getI18Text('--enterSupplierName--')}>
        />
      */}

      <SupplierSearchComponent
        searchKeyword={searchKeyword}
        isGptView={true}
        onInputChange={setSearchKeyword}
        onTypeaheadSelect={onTypeaheadSelect}
        clearResults={() => setAllVendors([])}
        onSearch={onAdvanceSearch}
        onTypeaheadSearch={props.onTypeaheadSearch}
      />
    </div>

    { showSearchResult &&
      <SupplierSearchResultModal
        searchString={searchKeyword}
        vendors={allVendors}
        allowParentRecordSelection
        onAdvanceSearch={handleAdvanceSearch}
        onSelect={onVendorSelect}
        onClose={onModalClose}
        onAddNewSupplierClicked={handleAddNewSupplierClicked}
        onProceedNotSureSupplier={handleOnProceedNotSureSupplier}
        onParentRecordSelect={onParentSelect}
      />
    }

    {/* Searched cards */}
    {/* <OroAnimator show={!newSupplier && _foundSearchSuppliers}>
      <>
         <div className={styles.searchMessage}>{t('--supplier--.--weFoundMatches--', { name: supplierSearchText })}</div> */}
        {/* <div className={classNames(styles.cardsWrapper, styles.mt16, styles.mb16)}>{searchedSuppliers.map((supplier: Supplier, index: number) =>
          <SupplierCard
            key={supplier.vendorId || index}
            supplier={supplier}
            defaultCurrency={props.defaultCurrency}
            preferredSupplier={props.preferredSupplier}
            allIndustryCodes={props.allIndustryCodes}
            onSupplierSelect={props.onSupplierSelect}
          />
        )}</div> */}
        {/* <div className={classNames(styles.cardsWrapper, styles.mt16, styles.mb16)}>
        <SupplierCard
            suppliers={searchedSuppliers}
            isGPTView={true}
            // isReadonly={props.isReadonly}
            // companyEntities={props.formData.companyEntities}
            // processVariables={props.formData.processVariables}
            // fields={props.fields}
            // forceValidate={forceValidate}
            // countryOption={props.countryOption}
            // companyEntity={props.companyEntity}
            supplierSelected={false}
            supplierFinalizationCheck={true}
            // supplierWithContactError={props.supplierWithContactError}
            // disallowFreeEmailDomain={disallowFreeEmailDomain}
            allowParentRecordSelection={true}
            onSupplierFinalize={onSupplierSelect}
            fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
            supplierRoles={props.supplierRoles}
            onAddContact={onAddSupplierContact}
            // onSupplierRemove={props.onSupplierRemove}
            fetchExistingContactList={props.fetchExistingContactList}
            fetchVendorByLegalEntityId={props.fetchNVVendorByLegalEntityId}
            onAdvanceSearch={handleAdvanceSearch}
          />
        </div>
      </></OroAnimator> */}
    {/* New Supplier */}
    {/* {newSupplier && <div>Supplier '{supplierSearchText}' not found.</div>} */}

    <OroAnimator show={_showNewSupplierForm || showAddNewSupplier}>
      <NewSupplierForm
        supplier={{ name: searchKeyword } as Supplier}
        countryOption={props.countryOption}
        languageOption={props.languageOption}
        onSaveNew={props.onSupplierSelect}
        onSkip={handleSkipClick}
        onClose={onNewsupplierFormClose}
      />
    </OroAnimator>

    <OroAnimator show={!props.hideSkip && !_showNewSupplierForm}>
      <div>
        <OroButton label={getI18Text('--skipSelection--')} radiusCurvature="medium" type='secondary' onClick={handleSkipClick} />
      </div>
    </OroAnimator>
  </div>
}