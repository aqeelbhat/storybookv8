import React, { useEffect, useRef, useState } from "react";
import { SupplierDetail, SupplierSearchResultModalProps, SupplierSearchResultParentProps, SupplierSearchSummary } from "../types";
import styles from './styles.module.scss'
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "react-feather";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
import Search from "../../../MilestoneWidget/components/search/Search";
import { Image, MultiSelect, Option, OroButton, OroTooltip, checkURLContainsProtcol, mapAlpha2codeToDisplayName } from "../../..";
import { NormalizedVendor, OroMasterDataType, VendorSuggestionRequest } from "../../../Types";
import NoSupplierLogo from '../../../Form/assets/no-supplier-logo.svg'
import AddSupplierLogo from '../../../Form/assets/addNewSupplierIcon.svg'
import AddSupplierButtonIcon from '../../../Form/assets/addSupplierButton.svg'
import { findLargelogo, getBlockedERPStatuses } from "../../util";
import { Trans } from "react-i18next";
import classnames from "classnames";
import { NotSureSupplierModal } from "./not-sure-supplier-modal.component";
import { Modal } from "@mui/material";

const MAX_SUPPLIER_PER_PAGE = 15
const MAX_VENDOR_PER_PAGE = 10
const INITIAL_MAX_VENDOR_PER_PAGE = 5

export function SupplierSearchResultRow(props: { vendor: NormalizedVendor, hideLogo?: boolean, supplierFinalizationCheck?: boolean, logo?: Image, duplicateSupplierView?: boolean, onVendorSelect?: (vendor: NormalizedVendor) => void }) {
  const [logo, setLogo] = useState('')
  const [website, setWebsite] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

  const VendorMatchingFields = {
    vendorId: "Vendor ID",
    name: "Vendor Name",
    duns: "Duns",
    country: "Country",
    website: 'Website'
  }

  useEffect(() => {
    if (props.vendor?.logo && props.vendor?.logo?.metadata && props.vendor.logo?.metadata?.length > 0) {
      const logo = findLargelogo(props.vendor.logo.metadata)
      setLogo(logo)
    } else if (props.logo && props.logo?.metadata && props.logo.metadata?.length > 0) {
      const logo = findLargelogo(props.logo.metadata)
      setLogo(logo)
    }
  }, [props.logo])

  useEffect(() => {
    if (props.vendor?.website) {
      const websiteBreakdown = new URL(checkURLContainsProtcol(props.vendor.website))
      setWebsite(websiteBreakdown.hostname)
    }
  }, [props.vendor])

  function onVendorSelect() {
    if (props.onVendorSelect) {
      props.onVendorSelect(props.vendor)
    }
  }

  function getMatchingFieldName(data: Map<string, string>): string {
    const _fields: string[] = []
    for (const [key, value] of Object.entries(data)) {
      const name = VendorMatchingFields[key]
      _fields.push(name)
    }
    return _fields.join(', ')
  }

  function canShowDetailsButton(): boolean {
    return !!props.vendor?.duns || props.vendor?.taxes?.length > 0 || (props.vendor?.vendorRecordRefs && props.vendor?.vendorRecordRefs.length > 0 && (!!props.vendor?.vendorRecordRefs[0]?.companyEntityRef?.id || props.vendor?.vendorRecordRefs[0]?.currencies?.length > 0))
  }

  function getAdditionalTaxes(): React.ReactNode {
    return props.vendor?.taxes.slice(1).map((item, index) => <div key={index}>{item.encryptedTaxNumber?.maskedValue}</div>)
  }

  function getAdditionalCurrencies(): React.ReactNode {
    return props.vendor.vendorRecordRefs[0]?.currencies.slice(1).map(item => item).join(', ')
  }
  function getCompanyEntityTooltip(): React.ReactElement {
    return (<>
        {props.vendor?.vendorRecordRefs[0]?.additionalCompanyEntities.map((data, index) =>
          <div className={styles.taxDetailTooltip} key={index}>
            <div className={styles.taxDetailTooltipTax}>
              <div className={styles.taxDetailTooltipTaxValue}>
                &#8226; {data?.name}
                {data?.id && ` (${data.id})`}
              </div>
            </div>
          </div>
        )}
    </>)
  }

  return (
    <div className={classnames(styles.vendorWrapper, { [styles.vendorExpandDetails]: showDetails })}>
      <div className={classnames(styles.vendor, { [styles.vendorHideLogo]: props.hideLogo })}>
        <div className={styles.vendorDetail}>
          {!props.hideLogo && <div className={styles.vendorDetailLogo}>
            <img className={styles.vendorDetailLogoImg} src={logo || NoSupplierLogo} alt="supplier logo" />
          </div>}
          <div className={styles.vendorDetailInfo}>
            <div className={styles.vendorDetailInfoCompany}>
              <div className={styles.vendorDetailInfoCompanyName}>
                {props.vendor.commonName}
              </div>
              {
                props.vendor?.vendorAdditionalDetails?.blockStatuses && props.vendor?.vendorAdditionalDetails?.blockStatuses?.length > 0 && props.vendor?.vendorAdditionalDetails?.blockStatuses.map((_status, index) => {
                  return (
                    <div className={styles.blockedTag} key={index}>
                      <Info size={16} color="var(--warm-stat-chilli-regular)"></Info>
                      <span>{getBlockedERPStatuses(_status, t)}</span>
                    </div>
                  )
                })
              }
              {props.duplicateSupplierView && props.vendor?.highlighters && Object.entries(props.vendor?.highlighters).length > 0 && <div className={styles.vendorMatchingContainer}>
                {t('--matching--', { fields: getMatchingFieldName(props.vendor?.highlighters) })}
              </div>}
            </div>
            <div className={styles.vendorDetailInfoList}>
              <div className={styles.vendorDetailInfoListPersonal}>
                {props.vendor?.address && <div className={styles.vendorDetailInfoListPersonalItems}>
                  <div className={styles.vendorDetailInfoListPersonalItemsValue}>{[props.vendor?.address?.city, mapAlpha2codeToDisplayName(props.vendor?.address?.alpha2CountryCode)].filter(Boolean).join(', ')}</div>
                </div>}
                {props.vendor.website && <div className={styles.vendorDetailInfoListPersonalItems}>
                  <a className={styles.vendorDetailInfoListPersonalItemsValue} href={checkURLContainsProtcol(props.vendor.website)} target='_blank' rel='noreferrer' title={props.vendor.website}>
                    {website}
                  </a>
                </div>}
                {props.vendor?.vendorRecordRefs && props.vendor?.vendorRecordRefs.length > 0 && props.vendor?.vendorRecordRefs[0]?.vendorId && <div className={styles.vendorDetailInfoListPersonalItems}>
                  <div className={styles.vendorDetailInfoListPersonalItemsLabel}>{t('--id--')}</div>
                  <div className={styles.vendorDetailInfoListPersonalItemsValue}>{props.vendor?.vendorRecordRefs[0]?.vendorId}</div>
                </div>}
                {canShowDetailsButton() && <div className={styles.vendorDetailInfoListPersonalItems}>
                  <div className={styles.vendorDetailInfoListPersonalItemsValue}>
                    {
                      !showDetails ? <div className={styles.vendorDetailInfoListPersonalItemsValueText} onClick={() => setShowDetails(true)}>
                        {t('--details--')}
                        <ChevronDown size={16} color={"var(--warm-neutral-shade-300)"} />
                      </div> : <div className={styles.vendorDetailInfoListPersonalItemsValueText} onClick={() => setShowDetails(false)}>
                        {t('--hide--')}
                        <ChevronUp size={16} color={"var(--warm-neutral-shade-300)"} />
                      </div>
                    }
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.vendorSelect}>
          <button className={styles.vendorSelectButton} onClick={onVendorSelect}>{t('--select--')}</button>
        </div>
      </div>
      {showDetails && <div className={styles.otherDetails}>
        {(props.vendor?.duns || props.vendor?.taxes?.length > 0) && <div className={styles.otherDetailInfoListPersonal}>
          {props.vendor?.duns && <div className={styles.otherDetailInfoListPersonalItems}>
            <div className={styles.otherDetailInfoListPersonalItemsLabel}>{t('--duns--')}</div>
            <div className={styles.otherDetailInfoListPersonalItemsValue}>{props.vendor.duns || '-'}</div>
          </div>}
          {props.vendor?.taxes?.length > 0 && <div className={styles.otherDetailInfoListPersonalItems}>
            <div className={styles.otherDetailInfoListPersonalItemsLabel}>{t('--taxId--')}</div>
            <div className={styles.otherDetailInfoListPersonalItemsValue}>
              {props.vendor?.taxes[0]?.encryptedTaxNumber?.maskedValue}
              {props.vendor?.taxes?.length > 1 && <OroTooltip title={getAdditionalTaxes()}><div className={`${styles.otherDetailInfoListPersonalItemsValue} ${styles.otherDetailInfoListPersonalItemsValueAdditional}`}>, +{props.vendor?.taxes?.length - 1}</div></OroTooltip>}
            </div>
          </div>}
        </div>}
        {
          (props.vendor?.vendorRecordRefs?.length > 0 && (props.vendor?.vendorRecordRefs[0]?.companyEntityRef?.id || props.vendor?.vendorRecordRefs[0]?.currencies?.length > 0)) && <div className={styles.otherDetailInfoListPersonal}>
              {props.vendor?.vendorRecordRefs[0]?.companyEntityRef?.id && <div className={styles.otherDetailInfoListPersonalItems}>
                <div className={styles.otherDetailInfoListPersonalItemsLabel}>{t('--enabledFor--')}</div>
                <div className={styles.otherDetailInfoListPersonalItemsValue}>
                  {props.vendor?.vendorRecordRefs[0]?.companyEntityRef.name}
                  {props.vendor?.vendorRecordRefs[0]?.companyEntityRef?.id && ` (${props.vendor?.vendorRecordRefs[0]?.companyEntityRef?.id})`}
                  {props.vendor?.vendorRecordRefs[0]?.additionalCompanyEntities.length > 0 &&
                    <OroTooltip title={getCompanyEntityTooltip()}>
                      <div className={styles.otherDetailInfoListPersonalItemsValue}>, +{props.vendor?.vendorRecordRefs[0]?.additionalCompanyEntities.length}</div>
                    </OroTooltip>
                    }
                </div>
              </div>}
              {props.vendor?.vendorRecordRefs[0]?.currencies?.length > 0 && <div className={styles.otherDetailInfoListPersonalItems}>
              <div className={styles.otherDetailInfoListPersonalItemsLabel}>{t('--currencies--')}</div>
              <div className={styles.otherDetailInfoListPersonalItemsValue}>
                {props.vendor?.vendorRecordRefs[0]?.currencies[0]}
                {props.vendor.vendorRecordRefs[0]?.currencies.length > 1 && <OroTooltip title={getAdditionalCurrencies()}><div className={`${styles.otherDetailInfoListPersonalItemsValue} ${styles.otherDetailInfoListPersonalItemsValueAdditional}`}>, +{props.vendor.vendorRecordRefs[0]?.currencies.length - 1}</div></OroTooltip>}
              </div>
            </div>}
          </div>
        }
      </div>}
    </div>
  )
}

export function SupplierSearchResultParent(props: SupplierSearchResultParentProps) {
  const [logo, setLogo] = useState('')
  const [showVendors, setShowVendors] = useState(false)
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_MAX_VENDOR_PER_PAGE)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

  useEffect(() => {
    if (props.vendor?.logo && props.vendor?.logo?.metadata && props.vendor?.logo?.metadata?.length > 0) {
      const logo = findLargelogo(props.vendor.logo.metadata || [])
      setLogo(logo)
    }
    if (props.vendor?.address?.city || props.vendor?.address?.alpha2CountryCode) {
      setAddress([props.vendor?.address?.city, mapAlpha2codeToDisplayName(props.vendor?.address?.alpha2CountryCode)].filter(Boolean).join(', '))
    }
    if (props.vendor?.website) {
      const websiteBreakdown = new URL(checkURLContainsProtcol(props.vendor.website))
      setWebsite(websiteBreakdown.hostname)
    }
  }, [props.vendor])
  useEffect(() => {
    setShowVendors(props.autoExpandIfSingleVendor || false)
  }, [props.autoExpandIfSingleVendor])
  function hideVendorOption() {
    setRowsPerPage(INITIAL_MAX_VENDOR_PER_PAGE)
    setShowVendors(false)
  }
  function showVendorOptions() {
    setRowsPerPage(INITIAL_MAX_VENDOR_PER_PAGE)
    setShowVendors(true)
  }

  function showMoreVendorOptions() {
    setRowsPerPage(rowsPerPage + MAX_VENDOR_PER_PAGE)
  }
  function showLessVendorOptions() {
    setRowsPerPage(INITIAL_MAX_VENDOR_PER_PAGE)
  }
  function onParentSelect() {
    props.onParentRecordSelect(props.vendor)
  }
  return (
    <div className={`${styles.vendorParent} ${showVendors ? styles.vendorParentExpand : ''}`}>
      <div className={styles.vendorParentContainer}>
        <div className={styles.vendorParentDetail}>
          <div className={styles.vendorParentDetailLogo}>
            <img className={styles.vendorParentDetailLogoImg} src={logo || NoSupplierLogo} alt="supplier logo" />
          </div>
          <div className={styles.vendorParentDetailInfo}>
            <div className={styles.vendorParentDetailInfoCompany}>
              {/* <div className={styles.vendorParentDetailInfoCompanyLabel}>{t('--parent--')}</div> */}
              <div className={styles.vendorParentDetailInfoCompanyName}>{props.vendor?.commonName}</div>
            </div>
            <div className={styles.vendorParentDetailInfoVendors}>
              {address && <div className={styles.vendorParentDetailInfoVendorsItems}>{address}</div>}
              {website && <a className={styles.vendorParentDetailInfoVendorsItems} href={checkURLContainsProtcol(props.vendor.website)} target='_blank' rel='noreferrer' title={props.vendor.website}>
                {website}
              </a>}
              <div className={styles.vendorParentDetailInfoVendorsItems}>{t('--more--', { count: props.vendor.normalizedVendors.length })}</div>
            </div>
          </div>
        </div>
        <div className={styles.vendorParentOptions}>
          {!showVendors && <OroButton label={t('--viewOptions--')} type="link" onClick={showVendorOptions} icon={<ChevronDown size={20} color="var(--warm-prime-azure)"></ChevronDown>} iconOrientation="right" fontWeight="bold" />}
          {showVendors && <OroButton label={t('--hideOptions--')} type="link" onClick={hideVendorOption} icon={<ChevronUp size={20} color="var(--warm-prime-azure)"></ChevronUp>} iconOrientation="right" fontWeight="bold" />}
          {props.allowParentRecordSelection && <OroButton className={styles.vendorSelectParentButton} label={t('--select--')} type="secondary" onClick={onParentSelect} />}
        </div>
      </div>
      {props.vendor.normalizedVendors.length > 0 && showVendors && <div className={styles.vendorParentOptionsList}>
        <div className={styles.vendorParentOptionsListContainer}>
          {
            props.vendor.normalizedVendors && props.vendor.normalizedVendors.slice(0, rowsPerPage).map((item, childIndex) => {
              return (
                <div key={childIndex} className={styles.resultContainerListItemsChildList}>
                  <SupplierSearchResultRow supplierFinalizationCheck={props.supplierFinalizationCheck} hideLogo vendor={item} onVendorSelect={props.onVendorSelect}></SupplierSearchResultRow>
                </div>
              )
            })
          }
          {rowsPerPage < props.vendor?.normalizedVendors?.length && props.vendor.normalizedVendors.length > INITIAL_MAX_VENDOR_PER_PAGE && <div className={styles.vendorParentOptionsListMore}>
            <OroButton label={t("--moreOptions--", { count: props.vendor.normalizedVendors.length - rowsPerPage })} width="content" onClick={showMoreVendorOptions} type="link" fontWeight="bold"></OroButton>
          </div>}
          {rowsPerPage >= props.vendor.normalizedVendors.length && props.vendor.normalizedVendors.length > INITIAL_MAX_VENDOR_PER_PAGE && <div className={styles.vendorParentOptionsListMore}>
            <OroButton label={t("--lessOptions--")} width="content" onClick={showLessVendorOptions} type="link" fontWeight="bold"></OroButton>
          </div>}
        </div>
        {!props.isViewRecord && !props.duplicateSupplierView && !props.supplierFinalizationCheck && <div className={styles.vendorParentOptionsListActions}>
          <Info size={16} color="var(--warm-neutral-shade-200)"></Info>
          <div className={styles.vendorParentOptionsListActionsText}>{t('--notSureWhatToSelect--')}</div>
          <OroButton label={t('--clickHere--')} type="link" fontWeight="bold" onClick={props.notSureWhichSupplier} />
        </div>}
      </div>}
    </div>
  )
}

export function SupplierSearchResultModal(props: SupplierSearchResultModalProps) {
  const [searchString, setSearchString] = useState<string>('')
  const searchFilterRef = useRef<HTMLDivElement>(null)
  const [selelctedCountries, setSelelctedCountries] = useState<Option[]>([])
  const [selectedEntities, setSelectedEntities] = useState<Option[]>([])
  const [showNotSureSupplierModal, setShowNotSureSupplierModal] = useState(false)
  const [vendorSummary, setVendorSummary] = useState<SupplierSearchSummary[]>([])
  const [parentVendorRecord, setParentVendorRecord] = useState<SupplierSearchSummary>()
  const [vendorRecordLogo, setVendorRecordLogo] = useState('')
  const [vendorWebsite, setVendorWebsite] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(MAX_SUPPLIER_PER_PAGE)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)
  useEffect(() => {
    setSearchString(props.searchString)
  }, [props.searchString])

  useEffect(() => {
    if (props.isViewRecord && props.vendors && props.vendors.length > 0) {
      setParentVendorRecord(props.vendors[0])
      const logo = findLargelogo(props.vendors[0]?.logo?.metadata || [])
      setVendorRecordLogo(logo)
      if (props.vendors[0]?.website) {
        const websiteBreakdown = new URL(checkURLContainsProtcol(props.vendors[0]?.website))
        setVendorWebsite(websiteBreakdown.hostname)
      }
    }
    setVendorSummary(props.vendors || [])
  }, [props.vendors, props.isViewRecord])

  function onSearch(query: string) {
    if (!props.isViewRecord) {
      const payload: VendorSuggestionRequest = {
        keyword: query,
        companyEntityId: props.processVariables && props.processVariables?.companyEntities && props.processVariables?.companyEntities?.length > 0 ? props.processVariables.companyEntities[0]?.id : undefined,
        filters: {
          companyEntities: selectedEntities.map(item => item.path),
          country: selelctedCountries.map(item => item.path)
        }
      }
      props.onAdvanceSearch && props.onAdvanceSearch(payload)
    } else {
      let filteredVendor: NormalizedVendor[] = []
      if (query.length > 0) {
        filteredVendor = parentVendorRecord.normalizedVendors?.filter(vendor => {
          return (vendor.commonName.toLowerCase().includes(query.toLowerCase()))
        })
        setVendorSummary([{ ...parentVendorRecord, normalizedVendors: filteredVendor }])
      } else {
        setVendorSummary([parentVendorRecord])
      }
    }
  }

  function onCountryFilterChange(country: Array<Option>) {
    setSelelctedCountries(country)
    if (props.onAdvanceSearch) {
      const payload: VendorSuggestionRequest = {
        keyword: searchString,
        companyEntityId: props.processVariables && props.processVariables?.companyEntities && props.processVariables?.companyEntities?.length > 0 ? props.processVariables.companyEntities[0]?.id : undefined,
        filters: {
          companyEntities: selectedEntities.map(item => item.path),
          country: country.map(item => item.path)
        }
      }
      props.onAdvanceSearch(payload)
    }
  }

  function onEntityFilterChange(entity: Array<Option>) {
    setSelectedEntities(entity)
    if (props.onAdvanceSearch) {
      const payload: VendorSuggestionRequest = {
        keyword: searchString,
        companyEntityId: props.processVariables && props.processVariables?.companyEntities && props.processVariables?.companyEntities?.length > 0 ? props.processVariables.companyEntities[0]?.id : undefined,
        filters: {
          companyEntities: entity.map(item => item.path),
          country: selelctedCountries.map(item => item.path)
        }
      }
      props.onAdvanceSearch(payload)
    }
  }

  function toggleModal() {
    props.onClose && props.onClose()
  }

  function addNewSupplier() {
    props.onAddNewSupplierClicked && props.onAddNewSupplierClicked()
  }

  function handleNotSureWhichSupplier(_vendor: SupplierSearchSummary) {
    setParentVendorRecord(_vendor)
    setShowNotSureSupplierModal(true)
  }

  function handleOnClose() {
    setShowNotSureSupplierModal(false)
    setParentVendorRecord(null)
  }

  function handleOnProceed(details: SupplierDetail) {
    if (props.onProceedNotSureSupplier) {
      setShowNotSureSupplierModal(false)
      props.onProceedNotSureSupplier(details)
    }
  }

  function calculateSearchFilterTop() {
    if (searchFilterRef && searchFilterRef.current) {
      const rect = searchFilterRef.current.getBoundingClientRect()
      const offset = rect.top
      if (offset <= 0) {
        searchFilterRef.current.classList.add(styles.searchFilterRowFixed)
      } else {
        searchFilterRef.current.classList.remove(styles.searchFilterRowFixed)
      }
    }
  }

  function fetchChildren (masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
    if (props.fetchChildren) {
      return props.fetchChildren(parent, childrenLevel, masterDataType)
    } else {
      return Promise.reject('fetchChildren API not available')
    }
  }

  function searchMasterdataOptions (keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
    if (props.searchOptions) {
      return props.searchOptions(keyword, masterDataType)
    } else {
      return Promise.reject('searchOptions API not available')
    }
  }

  return (
    <Modal open>
      <div className={styles.supplierSearchResult} onScroll={calculateSearchFilterTop}>
        <div className={styles.supplierSearchResultFixedPopup}>
          <div className={styles.supplierSearchResultPopup}>
            <div className={styles.modalBody}>
              <div className={styles.back} onClick={toggleModal}>
                <ArrowLeft size={20} color="var(--warm-prime-azure)" />
                <div>{t('--back--')}</div>
              </div>
              <div className={styles.title}>
                {!props.isViewRecord ? t('--supplierToWorkWith--') : t('--viewSupplierRecord--')}
              </div>
              {props.isViewRecord && <div className={styles.viewVendorRecord}>
                <div className={styles.vendorLogo}>
                  <img className={styles.vendorLogoImg} src={vendorRecordLogo || NoSupplierLogo} alt="supplier logo" />
                </div>
                <div className={styles.vendorDetail}>
                  <div className={styles.name}>{parentVendorRecord?.commonName}</div>
                  <div className={styles.info}>
                    {parentVendorRecord?.address && <div className={styles.items}>
                      <div className={styles.itemsValue}>{[parentVendorRecord?.address?.city, mapAlpha2codeToDisplayName(parentVendorRecord?.address?.alpha2CountryCode)].filter(Boolean).join(', ')}</div>
                    </div>}
                    {vendorWebsite && <div className={styles.items}>
                      <a className={styles.itemsValue} href={checkURLContainsProtcol(vendorWebsite)} target='_blank' rel='noreferrer' title={vendorWebsite}>
                        {vendorWebsite}
                      </a>
                    </div>}
                  </div>
                </div>
              </div>}
              <div className={styles.searchFilterRow} ref={searchFilterRef}>
                <div className={styles.searchBox}>
                  <Search autoFocus={!props.searchString} placeholder={t('--searchPlaceholder--')} keyword={searchString} onInputChange={setSearchString} onSubmit={onSearch}></Search>
                </div>
                {props.searchString && !props.isViewRecord && <div className={styles.filters}>
                  {props.countryOption && props.countryOption.length > 0 && <div className={styles.filtersItem}>
                    <MultiSelect
                      label=""
                      placeholder={t('--country--')}
                      required={true}
                      isListView
                      typeahead={false}
                      expandLeft
                      noBorder
                      showSearchBox
                      showElaborateLabel={false}
                      value={selelctedCountries}
                      options={props.countryOption}
                      onChange={value => { onCountryFilterChange(value) }}
                    />
                  </div>}
                  {props.companyEntity && props.companyEntity.length > 0 && <div className={styles.filtersItem}>
                    <MultiSelect
                      label=""
                      placeholder={t('--entity--')}
                      required={true}
                      isListView
                      typeahead={false}
                      expandLeft
                      showTree
                      noBorder
                      fetchChildren={(parent, childrenLevel) =>
                        fetchChildren("CompanyEntity", parent, childrenLevel)
                      }
                      onSearch={(keyword) =>
                        searchMasterdataOptions(keyword, "CompanyEntity")
                      }
                      showSearchBox
                      showElaborateLabel={false}
                      value={selectedEntities}
                      options={props.companyEntity}
                      onChange={value => { onEntityFilterChange(value) }}
                    />
                  </div>}
                </div>}
              </div>
              {vendorSummary.length > 0 && <div className={styles.resultContainer}>
                <div className={styles.resultContainerList}>
                  {
                    vendorSummary.slice(0, rowsPerPage).map((vendor, index) => {
                      return (
                        <div key={index} className={styles.resultContainerListItems}>
                          {vendor.normalizedVendors && vendor.normalizedVendors.length > 1 && !props.isViewRecord &&
                            <div className={styles.resultContainerListItemsParent}>
                              <SupplierSearchResultParent
                                vendor={vendor}
                                autoExpandIfSingleVendor={vendorSummary.length === 1}
                                supplierFinalizationCheck={props.supplierFinalizationCheck}
                                onVendorSelect={props.onSelect}
                                isViewRecord={props.isViewRecord}
                                allowParentRecordSelection={props.allowParentRecordSelection}
                                notSureWhichSupplier={() => handleNotSureWhichSupplier(vendor)}
                                onParentRecordSelect={props.onParentRecordSelect}></SupplierSearchResultParent>
                            </div>
                          }
                          {((vendor.normalizedVendors && vendor.normalizedVendors.length === 1) || props.isViewRecord) &&
                            <div className={styles.resultContainerListItemsChild}>
                              {
                                vendor.normalizedVendors && vendor.normalizedVendors.map((item, childIndex) => {
                                  return (
                                    <div key={childIndex} className={styles.resultContainerListItemsChildList}>
                                      <SupplierSearchResultRow logo={vendor.logo} supplierFinalizationCheck={props.supplierFinalizationCheck} vendor={item} onVendorSelect={props.onSelect}></SupplierSearchResultRow>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          }
                        </div>
                      )
                    })
                  }
                  {rowsPerPage < props.vendors.length && props.vendors.length > MAX_SUPPLIER_PER_PAGE && <div className={styles.resultContainerListViewMore}>
                    <OroButton label={t("--viewMoreMatches--")} onClick={() => setRowsPerPage(rowsPerPage + MAX_SUPPLIER_PER_PAGE)} type="link" fontWeight="bold" icon={<ChevronDown size={20} color="var(--warm-prime-azure)"></ChevronDown>} iconOrientation="right"></OroButton>
                  </div>}
                  {rowsPerPage >= props.vendors.length && props.vendors.length > MAX_SUPPLIER_PER_PAGE && <div className={styles.resultContainerListViewMore}>
                    <OroButton label={t("--viewLessMatches--")} onClick={() => setRowsPerPage(MAX_SUPPLIER_PER_PAGE)} type="link" fontWeight="bold" icon={<ChevronUp size={20} color="var(--warm-prime-azure)"></ChevronUp>} iconOrientation="right"></OroButton>
                  </div>}
                </div>
              </div>}
              <div className={styles.addSupplierSection}>
                <div className={styles.info}>
                  <span>{t('--notTheResultYouLooking--')}</span>
                  <span className={styles.text}>{t('--tryDifferentKeyword--')} {!props.disableNewSupplierOption && !props.isViewRecord ? t('--addNewSupplierBelow--') : ''}</span>
                </div>
                {!props.disableNewSupplierOption && !props.isViewRecord && <div className={styles.addSupplierContainer} onClick={addNewSupplier}>
                  <div className={styles.newSupplier}>
                    <div>
                      <img src={AddSupplierLogo} />
                    </div>
                    <div>
                    <Trans t={t} i18nKey="--addAsANewSupplier--" values={{ supplier: searchString }}>
                        {'Add '}
                      <span className={styles.highlight}>{ searchString }</span>
                        {' as a new supplier'}
                      </Trans>
                    </div>
                  </div>
                  <div onClick={addNewSupplier}>
                    <img src={AddSupplierButtonIcon} />
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
        {showNotSureSupplierModal &&
          <NotSureSupplierModal
            isOpen={showNotSureSupplierModal}
            searchRecord={parentVendorRecord}
            onProceed={handleOnProceed}
            onClose={handleOnClose} />}
      </div>
    </Modal>
  )
}