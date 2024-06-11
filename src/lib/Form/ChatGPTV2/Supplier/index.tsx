import React, { useEffect, useState } from "react"
import { Supplier } from "../../.."
import styles from './style.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n"
import OroAnimator from "../../../controls/OroAnimator"
// import SupplierCard from "./SupplierCardV2"
import NewSupplierForm from "./NewSupplier"
import SearchSupplier from "./SearchSupplier"
import { SupplierSuggestionProps } from "./types"
import RecommendationFlow from "./RecommendList"
import { SupplierCard } from "../../SupplierIdentificationV2/components/supplier-card.component"

export function SupplierSuggestion (props: SupplierSuggestionProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  // for search supplier
  const [showSearchControl, setShowSearchControl] = useState(false)
  const [IsSkippedView, setIsSkippedView] = useState(false)

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  function getI18Text (key: string) {
    return t('--supplier--.' + key)
  }
  function handleSupplierSelection (supplier: Supplier) {
    setSelectedSupplier(supplier)
    setShowSearchControl(false)
    if (props.onSelect) {
      props.onSelect(supplier)
    }
  }
  function handleSkipClick () {
    setShowSearchControl(false)
    if (props.onSkipSupplier) {
      props.onSkipSupplier()
    }
  }
  function handleViewRecommendations () {
    setShowSearchControl(false)
  }
  function handleSearchClick (search: string) {
    return props.onSearchSuppliers(search)
  }

  function handleSearchEnable () {
    setShowSearchControl(true)
  }

  useEffect(() => {
    setSelectedSupplier(props.selectedSupplier)
  }, [props.selectedSupplier])

  useEffect(() => {
    if (props.reset) {
      setShowSearchControl(false)
    }
  }, [props.reset])
  useEffect(() => {
    setIsSkippedView(props.isSkipped)
  }, [props.isSkipped])

  // LOGICs
  // Note - suggestedSuppliers can come for companyName OR "PR Supplier"
  const _skippedView = IsSkippedView
  const _hasSuggestedList = (props.suggestedSuppliers || []).length > 0
  const _supplierSelected = selectedSupplier ? true : false
  const _supplierIsNew = selectedSupplier?.newSupplier || false
  const _editMode = !_skippedView && !_supplierSelected
  const _createNewSupplierFlow = _editMode && (props.companyName && !_hasSuggestedList) && !showSearchControl
  const _noDataToShow = !_hasSuggestedList && !props.companyName
  const _recommendationsFlow = !_noDataToShow && _editMode && !_createNewSupplierFlow //&& !showSearchControl
  const _showSearchFeature = _editMode && (showSearchControl || _noDataToShow) // || (!_supplierSelected && !props.companyName && !_hasSuggestedList)

  function onAddSupplierContact (supplier: Supplier) {
    setSelectedSupplier(supplier)
    if (props.onSelect) {
      props.onSelect(supplier)
    }
  }

  return <>
    {/* when supplier is skipped */}
    <OroAnimator show={_skippedView}>
      <div>
        <div className={styles.responseLabel}>{getI18Text('--supplier--')}</div>
        <div className={styles.skipped}>{getI18Text('--skippedSupplierSelection--')}</div>
      </div></OroAnimator>

    {/* Selected New Supplier Read View */}
    <OroAnimator show={_supplierSelected && _supplierIsNew}>
      <div className={styles.readView}>
        <div className={styles.responseLabel}>{getI18Text('--supplier--')}</div>
        <NewSupplierForm
          isReadView
          supplier={selectedSupplier} />
      </div></OroAnimator>

    {/* Selected Supplier Read Only View */}
    <OroAnimator show={_supplierSelected && !_supplierIsNew}>
      <div className={styles.readView}>
        <div className={styles.responseLabel}>{getI18Text('--supplier--')}</div>
        <SupplierCard
          suppliers={selectedSupplier ? [selectedSupplier] : []}
          isGPTView={true}
          allowParentRecordSelection={true}
          supplierRoles={props.supplierRoles}
          onAddContact={onAddSupplierContact}
          fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
          fetchVendorByLegalEntityId={props.fetchNVVendorByLegalEntityId}
          fetchExistingContactList={props.fetchExistingContactList}
          onAdvanceSearch={props.onAdvanceSearch}
        />
        {/*
          Old view
          <SupplierCard
            isSelectedView={true}
            supplier={selectedSupplier}
            defaultCurrency={props.defaultCurrency}
            preferredSupplier={props.preferredSuppliersDetail}
            allIndustryCodes={props.industryCodes}
            getVendorDetails={props.getVendorDetails}
          />
        */}
      </div>
    </OroAnimator>

    {/* NewSupplier Flow */}
    {/* <OroAnimator show={_createNewSupplierFlow}><NewSupplierForm
      onSearchEnable={handleSearchEnable}
      // hideButtons={enableSearch}
      supplier={selectedSupplier || {
        name: props.companyName,
        supplierName: props.companyName,
        potentialMatches: null,
        potentialMatchIgnore: null
      }}
      onSaveNew={handleSupplierSelection}
      onSkip={handleSkipClick}
    /></OroAnimator> */}
    {/* {_recommendationsFlow && RecommendationFlow()} */}
    {/* <OroAnimator show={_recommendationsFlow} withDelay>{RecommendationFlow(_showSearchFeature)}</OroAnimator> */}

    <OroAnimator show={_recommendationsFlow} withDelay>
      <RecommendationFlow
        reset={_recommendationsFlow}
        suggestedSuppliers={props.suggestedSuppliers}
        companyName={props.companyName}
        isNudging={props.isNudging}
        defaultCurrency={props.defaultCurrency}
        preferredSuppliersDetail={props.preferredSuppliersDetail}
        industryCodes={props.industryCodes}
        onSelect={handleSupplierSelection}
        onShowMore={props.onShowMore}
        onViewRecommendClick={handleViewRecommendations}
        onSearchEnable={handleSearchEnable}
        onSkipSupplier={handleSkipClick}

        isSearchON={_showSearchFeature}
      />
    </OroAnimator>

    {/* Search Control */}
    {<OroAnimator show={_showSearchFeature}><SearchSupplier
      reset={_showSearchFeature}
      onSearchSuppliers={handleSearchClick}
      defaultCurrency={props.defaultCurrency}
      preferredSupplier={props.preferredSuppliersDetail}
      allIndustryCodes={props.industryCodes}
      supplierRoles={props.supplierRoles}
      countryOption={props.countryOption}
      languageOption={props.languageOption}
      onSupplierSelect={handleSupplierSelection}
      fetchNVChildrensUsingParentID={props.fetchNVChildrensUsingParentID}
      onAdvanceSearch={props.onAdvanceSearch}
      onTypeaheadSearch={props.onTypeaheadSearch}
      onVendorSelect={props.onVendorSelect}
      onParentSelect={props.onParentSelect}
      onNotSureSupplierProceed={props.onNotSureSupplierProceed}
      fetchExistingContactList={props.fetchExistingContactList}
      fetchNVVendorByLegalEntityId={props.fetchNVVendorByLegalEntityId}
      fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
      onSkip={handleSkipClick} /></OroAnimator>}
  </>
}