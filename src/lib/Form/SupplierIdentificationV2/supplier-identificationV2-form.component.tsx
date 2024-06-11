import React, { useEffect, useRef, useState } from "react";
import Grid from '@mui/material/Grid';
import { Checkbox, FormControlLabel } from '@mui/material'
import Actions from "../../controls/actions";
import { ConfigurationFieldsSupplierIdentificationV2, SupplierIdentificationV2FormData, SupplierIdentificationV2Props, SupplierSearchSummary, emptySupplierInputForm, enumSupplierIdentificationFields, SupplierDetail } from "./types";
import { VendorSuggestionRequest, Supplier, AddNewSupplier, SupplierInputForm, convertAddressToString, SnackbarComponent, FormAction, NormalizedVendor, isRequired } from "../..";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import SupplierSearchLogo from '../../Form/assets/supplier_search_logo.svg'
import { Title } from '../../controls/atoms';
import styles from './styles.module.scss'
import { AlertCircle, Plus, X, Info } from "react-feather";
import { SupplierSearchResultModal } from "./components/supplier-search-result-modal.component";
import { CheckboxLabelStyle } from "../SupplierEditERP/types";
import classNames from "classnames";
import { DuplicateSupplierModal } from "./components/duplicate-supplier-modal";
import { SupplierCard } from "./components/supplier-card.component";
import { checkIfContactNotAvailable, filterSupplierSearchSummaryWithSuppliers, mapSupplierSearchSummaries, parseSupplierToSupplierInputForm } from "./util";
import { isOmitted } from "../util";
import { NVType } from "../../Types/vendor";
import { SupplierRecommendationList } from "./components/supplier-recommendations.component";
import { SupplierSearchComponent } from "./components/supplier-search-box";

export function SupplierIdentificationV2(props: SupplierIdentificationV2Props) {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [notSureSupplierConfig, setNotSureSupplierConfig] = useState(true)
  const [disableNewSupplierOption, setDisableNewSupplierOption] = useState(false)
  const [isOrderingAddressEnabled, setIsOrderingAddressEnabled] = useState(false)
  const [isOrderingAddressMandatory, setIsOrderingAddressMandatory] = useState(false)
  const [isContactNameEnabled, setIsContactNameEnabled] = useState(false)
  const [isContactNameMandatory, setIsContactNameMandatory] = useState(false)
  const [isContactEmailEnabled, setIsContactEmailEnabled] = useState(false)
  const [isContactEmailMandatory, setIsContactEmailMandatory] = useState(false)
  const [isSupplierRecommendationEnabled, setIsSupplierRecommendationEnabled] = useState(false)
  const [minSupplierCount, setMinSupplierCount] = useState<number>()
  const [maxSupplierCount, setMaxSupplierCount] = useState<number>()
  const [allVendors, setAllVendors] = useState<Array<SupplierSearchSummary>>([])
  const [duplicateSuppliers, setDuplicateSuppliers] = useState<Array<SupplierSearchSummary>>([])
  const [selectedVendors, setSelectedVendors] = useState<Array<Supplier>>([])
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false)
  const [showAddNewSupplierView, setShowAddNewSupplierView] = useState<boolean>(false)
  const [showDuplicateSupplierModal, setShowDuplicateSupplierModal] = useState<boolean>(false)
  const [isSupplierNotSearched, setIsSupplierNotSearched] = useState<boolean>(false)
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false)
  const [isInvoicing, setIsInvoicing] = useState<boolean>(false)
  const [supplierFormData, setSupplierFormData] = useState<SupplierInputForm>(emptySupplierInputForm)
  const [forceValidate, setForceValidate] = useState(false)
  const [errorInform, setErrorInform] = useState(false)
  const [showAddAnotherSupplier, setShowAddAnotherSupplier] = useState(false)
  const [minSupplierError, setMinSupplierError] = useState(false)
  const [maxSupplierError, setMaxSupplierError] = useState(false)
  const [disallowFreeEmailDomain, setDisallowFreeEmailDomain] = useState(false)
  const [disableEmailCheck, setDisableEmailCheck] = useState(false)
  const [allowGroupSelection, setAllowGroupSelection] = useState(false)
  const [supplierFinalizationCheck, setSupplierFinalizationCheck] = useState(false)
  const [noSupplierSelected, setNoSupplierSelected] = useState(false)
  const [recommendedSupplierList, setRecommendedSupplierList] = useState<NormalizedVendor[]>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2])

  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef(fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  useEffect(() => {
    if (props.fields && props.fields.length > 0) {
      const _notSureSupplierConfig = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.notSureSupplierConfig)
      const _disableNewSupplierOption = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.disableNewSupplierOption)
      const _isOrderingAddressEnabled = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.orderingAddressEnabled)
      const _isOrderingAddressRequired = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.orderingAddressMandatory)
      const _minCountConfig = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.minNumberOfSuppliers)
      const _maxCountConfig = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.maxNumberOfSuppliers)
      const _disallowFreeEmailDomain = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.disallowFreeEmailDomain)
      const _disableEmailCheck = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.disableEmailCheck)
      const _allowGroupSelection = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.allowParentSupplierSelection)
      const _supplierFinalizationCheck = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.supplierFinalizationCheck)
      const _isPurchasing = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.isPurchasing)
      const _isInvoicing = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.isInvoicing)
      const _contactField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.contact)
      const _emailField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.email)
      const _supplierRecommendationField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.supplierRecommendationEnabled)
      setNotSureSupplierConfig(_notSureSupplierConfig?.booleanValue)
      setDisableNewSupplierOption(_disableNewSupplierOption?.booleanValue || false)
      setIsOrderingAddressEnabled(_isOrderingAddressEnabled?.booleanValue || false)
      setIsOrderingAddressMandatory(_isOrderingAddressRequired?.booleanValue || false)
      setMinSupplierCount(_minCountConfig?.intValue)
      setMaxSupplierCount(_maxCountConfig?.intValue)
      setDisallowFreeEmailDomain(_disallowFreeEmailDomain?.booleanValue)
      setDisableEmailCheck(_disableEmailCheck?.booleanValue)
      setAllowGroupSelection(_allowGroupSelection?.booleanValue)
      setSupplierFinalizationCheck(_supplierFinalizationCheck?.booleanValue)
      setIsPurchasing(_isPurchasing?.booleanValue)
      setIsInvoicing(_isInvoicing?.booleanValue)
      setIsContactNameEnabled(!isOmitted(_contactField))
      setIsContactNameMandatory(isRequired(_contactField))
      setIsContactEmailEnabled(!isOmitted(_emailField))
      setIsContactEmailMandatory(isRequired(_emailField))
      setIsSupplierRecommendationEnabled(_supplierRecommendationField?.booleanValue)
    }
  }, [props.fields])

  useEffect(() => {
    if (props.supplierRecommendations) {
      setRecommendedSupplierList(props.supplierRecommendations.suggestions || [])
    }
  }, [props.supplierRecommendations])

  function onSearch(keyword: string) {
    if (props.onSearch && keyword.trim().length > 0) {
      // passing companyEntity for boosting (For now it accept only one value)
      const filter: VendorSuggestionRequest = {
        keyword: keyword.trim(),
        companyEntityId: props.formData?.processVariables && props.formData?.processVariables?.companyEntities && props.formData?.processVariables?.companyEntities?.length > 0 ? props.formData.processVariables.companyEntities[0]?.id : undefined
      }
      props.onSearch(filter)
        .then((resp) => {
          setAllVendors(resp)
          setShowSearchResult(true)
          setShowAddAnotherSupplier(false)
        })
        .catch(err => console.log(err))
    }
  }

  function onModalClose() {
    setAllVendors([])
    setShowSearchResult(false)
  }

  function handleCloseDuplicateSupplierModal() {
    setShowDuplicateSupplierModal(false)
    setShowAddNewSupplierView(false)
  }

  function handleAddNewSupplierClicked() {
    setSupplierFormData({
      name: searchKeyword,
      newSupplier: true
    })
    setShowSearchResult(false)
    setShowAddNewSupplierView(true)
    setTimeout(() => {
      const input = document.getElementById('add-new-supplier')
      if (input?.scrollIntoView) {
        input?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
      }
    }, 100)
  }

  function handleAdvanceSearch(payload: VendorSuggestionRequest): Promise<SupplierSearchSummary[]> {
    if (props.onSearch && payload) {
      props.onSearch(payload)
        .then((resp) => {
          setAllVendors(resp)
          return resp
        })
        .catch(err => console.log(err))
    } else {
      return Promise.reject()
    }
  }

  function getFormData(): SupplierIdentificationV2FormData {
    return {
      selectedSuppliers: selectedVendors,
      // notSureNote,
      notSureWhichSupplierFlag: isSupplierNotSearched,
      isPurchasing,
      isInvoicing
    }
  }

  function isFormInvalid(): string {
    let invalidFieldId = ''
    let invalidFound = false
    setNoSupplierSelected(false)

    if (!isSupplierNotSearched && (minSupplierCount > 0 && selectedVendors.length === 0)) {
      invalidFound = true
      invalidFieldId = enumSupplierIdentificationFields.supplierSearch
      setMinSupplierError(true)
    } else if (isOrderingAddressEnabled && isOrderingAddressMandatory) {
      if (supplierFinalizationCheck && props.formData.supplierSelected && selectedVendors.length > 0) {
        invalidFound = !selectedVendors[0].isParent ? !convertAddressToString(selectedVendors[0]?.address) : false
        invalidFieldId = invalidFound ? enumSupplierIdentificationFields.orderingAddress : ''
      } else {
        invalidFound = selectedVendors.some(vendor => {
          const _address = !vendor.isParent ? convertAddressToString(vendor.address) : true
          return !_address
        })
        invalidFieldId = enumSupplierIdentificationFields.orderingAddress
      }
    } else if ((isContactNameEnabled && isContactNameMandatory) || (isContactEmailEnabled && isContactEmailMandatory)) {
      if (supplierFinalizationCheck && props.formData.supplierSelected && selectedVendors.length > 0) {
        invalidFound = !selectedVendors[0].isParent ? checkIfContactNotAvailable(selectedVendors[0]?.contact, isContactNameEnabled, isContactNameMandatory, isContactEmailEnabled, isContactEmailMandatory) : false
        invalidFieldId = invalidFound ? enumSupplierIdentificationFields.contact : ''
      } else {
        invalidFound = selectedVendors.some(vendor => {
          const isContactNotAvailable = !vendor.isParent ? checkIfContactNotAvailable(vendor.contact, isContactNameEnabled, isContactNameMandatory, isContactEmailEnabled, isContactEmailMandatory) : false
          return isContactNotAvailable
        })
        invalidFieldId = enumSupplierIdentificationFields.contact
      }
    }

    if (disallowFreeEmailDomain) {
      const findAnyFreeEmailDomainAdded = selectedVendors.some(vendor => {
        return vendor?.contact?.emailVerification?.isFreeDomain
      })
      if (findAnyFreeEmailDomainAdded) {
        invalidFound = true
        invalidFieldId = enumSupplierIdentificationFields.disallowFreeEmailDomain
        setErrorInform(true)
      }
    }
    const findAnyAddedDomainDoesNotExist = selectedVendors.some(vendor => {
      return vendor?.contact?.emailVerification?.domainNotExist
    })
    if (findAnyAddedDomainDoesNotExist) {
      invalidFound = true
      invalidFieldId = enumSupplierIdentificationFields.disallowFreeEmailDomain
      setErrorInform(true)
    }
    if (supplierFinalizationCheck) {
      if (!props.formData?.supplierSelected || selectedVendors.length === 0) {
        invalidFound = true
        invalidFieldId = enumSupplierIdentificationFields.noSupplierSelected
        setErrorInform(true)
        setNoSupplierSelected(true)
      }
    }

    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations(invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function handleFormSubmit() {
    const invalidFieldId = isFormInvalid()

    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      setMinSupplierError(false)
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel() {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function fetchData(skipValidation?: boolean): SupplierIdentificationV2FormData {
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
  }, [props.fields, searchKeyword, supplierFormData, selectedVendors, isSupplierNotSearched, isOrderingAddressEnabled, isOrderingAddressMandatory, isContactNameEnabled, isContactNameMandatory, isContactEmailEnabled, isContactEmailMandatory])

  useEffect(() => {
    if (props.formData) {
      setSelectedVendors(props.formData.selectedSuppliers)
      // setNotSureNote(props.formData.notSureNote)
      setIsSupplierNotSearched(props.formData.notSureWhichSupplierFlag)
    }
  }, [props.formData])

  function onVendorSelect(vendor: NormalizedVendor) {
    if (props.onVendorSelect) {
      setShowSearchResult(false)
      setShowDuplicateSupplierModal(false)
      setShowAddNewSupplierView(false)
      setShowAddAnotherSupplier(false)
      props.onVendorSelect(vendor)
    }
  }

  function onParentSelect(vendor: SupplierSearchSummary) {
    if (props.onParentSelect) {
      setShowSearchResult(false)
      setShowDuplicateSupplierModal(false)
      props.onParentSelect(vendor)
    }
  }

  function triggerAddNewSupplier(data: SupplierInputForm, ignoreMatches?: boolean, duplicateMatches?: SupplierSearchSummary[]) {
    setShowAddNewSupplierView(false)
    setShowDuplicateSupplierModal(false)
    const action = disableEmailCheck ? undefined : FormAction.emailValidation
    props.onAddNewSupplier(data, ignoreMatches, duplicateMatches, data?.email ? action : undefined)
  }

  function handleAddNewSupplier(data: SupplierInputForm) {
    setSupplierFormData(data)
    if (props.checkForDuplicateSuppliers) {
      // First check for duplicate supplier
      const filter: VendorSuggestionRequest = {
        keyword: searchKeyword,
        duplicateCheck: true,
        duns: data.duns,
        alpha2CountryCode: data.jurisdictionCountryCode.path,
        website: data.website
      }
      props.checkForDuplicateSuppliers(filter)
        .then(resp => {
          if (resp && resp.length > 0) {
            setShowDuplicateSupplierModal(true)
            setDuplicateSuppliers(mapSupplierSearchSummaries(resp))
          } else {
            props.onAddNewSupplier && triggerAddNewSupplier(data)
          }
        })
        .catch(err => {
          console.log(err)
          props.onAddNewSupplier && triggerAddNewSupplier(data)
        })
    }
  }

  function handleOnIgnoreMatch() {
    setShowAddNewSupplierView(false)
    setShowDuplicateSupplierModal(false)
    props.onAddNewSupplier && triggerAddNewSupplier({ ...supplierFormData, newSupplier: true }, true, duplicateSuppliers)
  }

  function handleDuplicateMatchNotSure() {
    setShowAddNewSupplierView(false)
    setShowDuplicateSupplierModal(false)
    props.onAddNewSupplier && triggerAddNewSupplier({ ...supplierFormData, newSupplier: true }, false, duplicateSuppliers)
  }

  function onNewSupplierAddValueChange(fieldName: string, updatedForm: SupplierInputForm) {
    if (props.onNewSupplierAddValueChange) {
      props.onNewSupplierAddValueChange(fieldName, updatedForm)
        .then(resp => {
          setSupplierFormData(parseSupplierToSupplierInputForm(resp))
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  function handleAddNewSupplierClose() {
    setShowAddNewSupplierView(false)
  }
  function handleOnProceedNotSureSupplier(data: SupplierDetail) {
    if (props.onNotSureSupplierProceed) {
      setShowSearchResult(false)
      props.onNotSureSupplierProceed(data)
    }
  }
  function handleAddMoreSupplier() {
    setSearchKeyword('')
    if (maxSupplierCount > 0 && selectedVendors.length >= maxSupplierCount) {
      setShowAddAnotherSupplier(false)
      setMaxSupplierError(true)
    } else {
      setShowAddAnotherSupplier(true)
      setMaxSupplierError(false)
    }
  }

  function onTypeaheadSelect(vendor: NormalizedVendor) {
    if (vendor.type !== NVType.parent) {
      onVendorSelect(vendor)
    } else {
      if (props.fetchNVChildrensUsingParentID) {
        props.fetchNVChildrensUsingParentID(vendor)
          .then(resp => {
            setShowAddAnotherSupplier(false)
            setAllVendors(resp)
            setShowSearchResult(true)
          })
          .catch(err => console.log(err))
      }
    }
  }

  return (<>
    {!showAddNewSupplierView && selectedVendors.length === 0 && !props.isReadonly && <><Grid container spacing={2}>
      <Grid item xs={12}>
        <Title>{t('--supplierToWorkWith--')}</Title>
      </Grid>
      <Grid item spacing={2} xs={12} md={8} data-testid="supplier-search-field" ref={(node) => { storeRef(enumSupplierIdentificationFields.supplierSearch, node) }}>
        <div className={styles.label}>{t('--searchSupplier--')}</div>
        <SupplierSearchComponent
          companyEntities={props.formData.processVariables.companyEntities}
          isSupplierNotSearched={isSupplierNotSearched}
          showAddNewSupplierView={showAddNewSupplierView}
          selectedVendors={selectedVendors}
          searchKeyword={searchKeyword}
          onInputChange={setSearchKeyword}
          onTypeaheadSelect={onTypeaheadSelect}
          clearResults={() => setAllVendors([])}
          onSearch={onSearch}
          onTypeaheadSearch={props.onTypeaheadSearch}
        />
        {minSupplierError && selectedVendors.length < minSupplierCount &&
          <div className={styles.validationError}>
            <AlertCircle size={16} color={"var(--warm-stat-chilli-regular)"} />
            {t('--minimumRequired--', { min: minSupplierCount })}
          </div>
        }
      </Grid>
      <Grid item xs={12}>
        {isSupplierRecommendationEnabled && (recommendedSupplierList && recommendedSupplierList.length > 0) &&
          <SupplierRecommendationList
            supplierRecommendationList={recommendedSupplierList}
            onSelect={onVendorSelect}
          />
        }
        <div className={styles.landingLogo}>
          <img alt="" src={SupplierSearchLogo} />
        </div>
        {notSureSupplierConfig && <div className={classNames(styles.noSupplier, { [styles.noSupplierActive]: isSupplierNotSearched })}>
          <div className={styles.container}>
            <FormControlLabel control={
              <Checkbox
                disableRipple
                checked={isSupplierNotSearched}
                onChange={e => { setIsSupplierNotSearched(e.target.checked) }}
                color="success"
              />}
              label={t('--notSureWhichSupplierToWorkWith--')}
              sx={CheckboxLabelStyle}
            />
          </div>
          {/* {isSupplierNotSearched && <div className={styles.noSupplierReason}>
              <div className={styles.noSupplierReasonTitle}>{t('--shareSupplierNeed--')}</div>
              <TextArea
                value={notSureNote}
                placeholder="Type here"
                onChange={e => setNotSureNote(e)}
              />
            </div>} */}
        </div>}
      </Grid>
    </Grid>
    </>}
    {props.isReadonly && selectedVendors.length === 0 && <div className={styles.emptyReadonly}>{t('--supplierNotSelected--')}</div>}
    {selectedVendors.length > 0 && <> 
      <div className={styles.supplierList}>
        <SupplierCard
          suppliers={selectedVendors}
          isReadonly={props.isReadonly}
          companyEntities={props.formData.companyEntities}
          processVariables={props.formData.processVariables}
          vendorCurrency={props.formData.vendorCurrency}
          fields={props.fields}
          forceValidate={forceValidate}
          countryOption={props.countryOption}
          companyEntity={props.companyEntity}
          indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
          languageOption={props.languageOption}
          taxCodeFormatError={props.taxCodeFormatError}
          taxKeys={props.taxKeys}
          supplierSelected={props.formData.supplierSelected}
          supplierFinalizationCheck={supplierFinalizationCheck}
          supplierWithContactError={props.supplierWithContactError}
          disallowFreeEmailDomain={disallowFreeEmailDomain}
          allowParentRecordSelection={allowGroupSelection}
          isInPortal={props.isInPortal}
          fetchChildren={props.fetchChildren}
          searchOptions={props.searchOptions}
          onSupplierFinalize={props.onSupplierFinalize}
          validateTaxFormat={props.validateTaxFormat}
          fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
          updateSupplierList={props.updateSupplierList}
          supplierRoles={props.supplierRoles}
          onSupplierRemove={props.onSupplierRemove}
          fetchExistingContactList={props.fetchExistingContactList}
          fetchVendorByLegalEntityId={props.fetchNVVendorByLegalEntityId}
          onAdvanceSearch={handleAdvanceSearch}
          fetchVendorById={props.fetchVendorById}
          fetchVendorsForOrderingAddress={props.fetchVendorsForOrderingAddress}
        />
        {supplierFinalizationCheck && noSupplierSelected && !props.formData?.supplierSelected && <div className={styles.supplierListError} ref={(node) => { storeRef(enumSupplierIdentificationFields.noSupplierSelected, node) }}><Info color="var(--warm-stat-chilli-regular)" size={16}></Info> {t('--selectingSupplierMandatory--')}</div>}
      </div>
      {isSupplierRecommendationEnabled && (recommendedSupplierList && recommendedSupplierList.length > 0) &&
        <SupplierRecommendationList
          supplierRecommendationList={recommendedSupplierList}
          selectedSuppliers={selectedVendors}
          onSelect={onVendorSelect}
        />
      }
    </>}
    {showAddNewSupplierView &&
      <div className={styles.addNewSupplier} id="add-new-supplier">
        <AddNewSupplier
          supplierFormConfigurationFields={props.fields || []}
          formData={supplierFormData}
          countryOptions={props.countryOption}
          languageOptions={props.languageOption}
          taxKeys={props.taxKeys}
          taxCodeFormatError={props.taxCodeFormatError}
          indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
          onValueChange={onNewSupplierAddValueChange}
          validateTaxFormat={props.validateTaxFormat}
          onFormSubmit={(e) => handleAddNewSupplier(e)}
          onClose={handleAddNewSupplierClose} />
      </div>
    }
    {showSearchResult &&
      <SupplierSearchResultModal
        searchString={searchKeyword}
        vendors={filterSupplierSearchSummaryWithSuppliers(allVendors, selectedVendors)}
        processVariables={props.formData?.processVariables}
        countryOption={props.countryOption}
        companyEntity={props.companyEntity}
        disableNewSupplierOption={disableNewSupplierOption}
        allowParentRecordSelection={allowGroupSelection}
        isInPortal={props.isInPortal}
        supplierFinalizationCheck={supplierFinalizationCheck}
        onAdvanceSearch={handleAdvanceSearch}
        onSelect={onVendorSelect}
        onClose={onModalClose}
        fetchChildren={props.fetchChildren}
        searchOptions={props.searchOptions}
        onAddNewSupplierClicked={handleAddNewSupplierClicked}
        onProceedNotSureSupplier={handleOnProceedNotSureSupplier}
        onParentRecordSelect={onParentSelect} />}
    {showDuplicateSupplierModal &&
      <DuplicateSupplierModal
        open={showDuplicateSupplierModal}
        vendors={filterSupplierSearchSummaryWithSuppliers(duplicateSuppliers, selectedVendors)}
        newSupplier={supplierFormData}
        supplierFinalizationCheck={supplierFinalizationCheck}
        allowParentRecordSelection={allowGroupSelection}
        onSelect={onVendorSelect}
        onIgnoreMatch={handleOnIgnoreMatch}
        onClose={handleCloseDuplicateSupplierModal}
        handleDuplicateMatchNotSure={handleDuplicateMatchNotSure}
        onParentRecordSelect={onParentSelect}
      />}
    <SnackbarComponent message={t('--thereAreSomeErrorsInForm--')} open={errorInform} onClose={() => setErrorInform(false)} autoHideDuration={4000}></SnackbarComponent>
    {selectedVendors.length > 0 && !showAddNewSupplierView && !props.isReadonly && <div className={styles.addAnotherSupplier}>
      {!showAddAnotherSupplier && maxSupplierCount !== 1 && <button className={styles.addAnotherSupplierButton} onClick={handleAddMoreSupplier}><Plus size={24} color="var(--warm-neutral-shade-500)"></Plus> {t('--addAnotherSupplier--')}</button>}
      {showAddAnotherSupplier && <div className={styles.addAnotherSupplierContainer}>
        <div className={styles.addAnotherSupplierContainerHeader}>
          {t('--addAnotherSupplier--')}
          <X size={24} color="var(--warm-neutral-shade-300)" cursor={'pointer'} onClick={() => { setShowAddAnotherSupplier(false); setSearchKeyword('') }}></X>
        </div>
        <div className={styles.addAnotherSupplierContainerWrapper} data-testid="supplier-search-field" ref={(node) => { storeRef(enumSupplierIdentificationFields.supplierSearch, node) }}>
          <div className={styles.label}>{t('--searchSupplier--')}</div>
          <SupplierSearchComponent
            searchKeyword={searchKeyword}
            companyEntities={props.formData.processVariables.companyEntities}
            isSupplierNotSearched={isSupplierNotSearched}
            showAddNewSupplierView={showAddNewSupplierView}
            selectedVendors={selectedVendors}
            onInputChange={setSearchKeyword}
            onTypeaheadSelect={onTypeaheadSelect}
            clearResults={() => setAllVendors([])}
            onSearch={onSearch}
            onTypeaheadSearch={props.onTypeaheadSearch}
          />
        </div>
        <div className={styles.landingLogo}>
          <img alt="" src={SupplierSearchLogo} />
        </div>
      </div>}
      {maxSupplierError && selectedVendors.length >= maxSupplierCount &&
        <div className={styles.validationError}>
          <AlertCircle size={16} color={"var(--warm-stat-chilli-regular)"} />
          {t('--maximumRequired--', { max: maxSupplierCount })}
        </div>
      }
      {minSupplierError && selectedVendors.length < minSupplierCount &&
        <div className={styles.validationError}>
          <AlertCircle size={16} color={"var(--warm-stat-chilli-regular)"} />
          {t('--minimumRequired--', { min: minSupplierCount })}
        </div>
      }
    </div>}
    {!props.isReadonly && <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
      cancelLabel={props.cancelLabel}
      submitLabel={props.submitLabel} />}
  </>)
}