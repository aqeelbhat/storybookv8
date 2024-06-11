import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from '../styles.module.scss'
import classNames from "classnames";
import { ClickAwayListener } from "@mui/material";
import { DROPDOWN_MAX_HEIGHT } from "../../../MultiLevelSelect/types";
import { ArrowRight, ArrowRightCircle, Briefcase, Info, Search, X } from "react-feather";
import { OROSpinner } from "../../../Loaders";
import PrarentIcon from '../../../Form/assets/parentRecord.svg'
import { NVType, NormalizedVendor } from "../../../Types/vendor";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
import { debounce } from "../../../util";
import { IDRef, Supplier, VendorSuggestionRequest, mapNormalizedVendor } from "../../../Types";
import { filterNVWithSuppliers, getConvertedAddresForDisplay } from "../util"
import { ENTER_KEY_CODE } from "../../../Inputs/types";

interface SupplierSearchComponentProps {
    companyEntities?: IDRef[]
    selectedVendors?: Array<Supplier>
    showAddNewSupplierView?: boolean
    isSupplierNotSearched?: boolean
    searchKeyword?: string
    isGptView?: boolean
    onInputChange?: (keyword: string) => void
    onSearch?: (keyword: string) => void
    clearResults?: () => void
    onTypeaheadSelect?: (vendor: NormalizedVendor) => void
    onTypeaheadSearch?: (searchPayload: VendorSuggestionRequest) => Promise<Array<NormalizedVendor>>
}

export function SupplierSearchComponent(props: SupplierSearchComponentProps) {
    const searchInputRef = useRef<any>(null)
    const [allTypeaheadVendors, setAllTypeaheadVendors] = useState<Array<NormalizedVendor>>([])
    const [searchInputFocused, setSearchInputFocused] = useState(false)
    const [typeAheadLoading, setTypeAheadLoading] = useState(false)
    const [minSupplierError, setMinSupplierError] = useState(false)
    const [showTypeaheadResults, setShowTypeaheadResults] = useState<boolean>(false)
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const myContainer = useRef<HTMLDivElement>(null)
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2])
    const [isPopupGoesUp, setIsPopupGoesUp] = useState(false)

    useEffect(() => {
        setSearchKeyword(props.searchKeyword || '')
    }, [props.searchKeyword])

    function onTypeaheadSearch(query: string) {
        if (props.onTypeaheadSearch) {
            setTypeAheadLoading(true)
            const filter: VendorSuggestionRequest = {
                keyword: query,
                companyEntityId: props.companyEntities && props.companyEntities?.length > 0 ? props.companyEntities[0]?.id : undefined
            }
            props.onTypeaheadSearch(filter)
                .then((resp) => {
                    const mappNormalizedVendors = resp.map(mapNormalizedVendor)
                    if (props.selectedVendors && props.selectedVendors.length > 0) {
                        setAllTypeaheadVendors(filterNVWithSuppliers(mappNormalizedVendors, props.selectedVendors))
                    } else {
                        setAllTypeaheadVendors(mappNormalizedVendors)
                    }
                    setShowTypeaheadResults(true)
                    setTypeAheadLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setTypeAheadLoading(false)
                })
        }
    }
    function onSearch() {
        if (props.onSearch) {
            setAllTypeaheadVendors([])
            setSearchKeyword('')
            props.onSearch(searchKeyword)
        }
    }
    const delayedOnTypeaheadInputChange = useCallback(debounce((query: string) => onTypeaheadSearch(query), 600), [props.companyEntities, props.selectedVendors])

    function shallDropdownGrowUp() {
        if (myContainer.current) {
            const rect = myContainer.current.getBoundingClientRect()
            const spaceAbove = rect.top
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight
            const spaceBelow = viewportHeight - (rect.top + rect.height)
            setIsPopupGoesUp((spaceBelow < DROPDOWN_MAX_HEIGHT) && (spaceAbove > spaceBelow))
        } else {
            setIsPopupGoesUp(false)
        }
    }

    function onInputBlur() {
        setSearchInputFocused(false)
        setShowTypeaheadResults(false)
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchKeyword(e.target.value)
        setMinSupplierError(false)
        setAllTypeaheadVendors([])
        setShowTypeaheadResults(true)
        if (e.target.value.trim()) {
            delayedOnTypeaheadInputChange(e.target.value)
            if (props.onInputChange) {
                props.onInputChange(e.target.value.trim())
            }
        }
    }

    function onTypeaheadSelect(vendor: NormalizedVendor) {
        if (props.onTypeaheadSelect) {
            props.onTypeaheadSelect(vendor)
            setAllTypeaheadVendors([])
            setShowTypeaheadResults(false)
        }
    }

    useEffect(() => {
        shallDropdownGrowUp()
    }, [myContainer.current])
    function clearResults() {
        setSearchKeyword('')
        setAllTypeaheadVendors([])
        setShowTypeaheadResults(false)
        if (searchInputRef && searchInputRef?.current) {
            setTimeout(() => {
                searchInputRef.current.focus()
            }, 300)
        }
    }
    function onInputFocus() {
        setSearchInputFocused(true)
        if (allTypeaheadVendors.length > 0) {
            setShowTypeaheadResults(true)
        } else if (searchKeyword) {
            onTypeaheadSearch(searchKeyword)
        }
    }
    function handleKeyDown(e) {
        if (searchKeyword && e) {
            setMinSupplierError(false)
            if (e.keyCode === ENTER_KEY_CODE) {
                onSearch()
            }
        }
    }
    function getTypeAheadInputComponent(): React.ReactNode {
        return (
            <div className={styles.searchInputContainer}>
                <Search size={18} color={'var(--warm-neutral-shade-200)'} />
                <input
                    type="text"
                    placeholder={t('--searchPlaceholder--')}
                    value={searchKeyword || ''}
                    ref={searchInputRef}
                    onFocus={onInputFocus}
                    disabled={props.isSupplierNotSearched || props.showAddNewSupplierView}
                    onKeyDown={handleKeyDown}
                    onChange={onInputChange}
                />
                <div className={styles.searchActions}>
                    <div className={styles.searchActionsClear}>
                        {typeAheadLoading && <OROSpinner height={20} width={20} borderWidth={2}></OROSpinner>}
                        {searchKeyword && !typeAheadLoading && <X size={18} color={'var(--warm-neutral-shade-200)'} onClick={clearResults} cursor={'pointer'}></X>}
                    </div>
                    {searchKeyword && <ArrowRightCircle size={18} color={'var(--warm-neutral-shade-300)'} onClick={onSearch} cursor={'pointer'} />}
                </div>
            </div>
        )
    }
    return (
        <ClickAwayListener onClickAway={onInputBlur}>
            <div className={styles.searchWrapper}>
                <div className={`${ props.isGptView ? styles.searchGptWrapperInput : styles.searchWrapperInput} ${isPopupGoesUp ? styles.searchWrapperInputGoesUp : ''}`}>
                    <div className={classNames(styles.search, { [styles.error]: minSupplierError }, { [styles.searchFocused]: searchInputFocused }, { [styles.disabled]: props.isSupplierNotSearched || props.showAddNewSupplierView })}>
                        {!isPopupGoesUp && getTypeAheadInputComponent()}
                        {showTypeaheadResults && <div className={styles.typeaheadResults} ref={myContainer}>
                            {!isPopupGoesUp && <div className={styles.typeaheadResultsDivider}><div className={styles.typeaheadResultsDividerLine}></div></div>}
                            {searchKeyword && <div className={styles.searchTerm} onClick={onSearch}>
                              <Search size={16} color={"var(--warm-neutral-shade-300)"}/>
                              <span className={styles.searchKey}>{searchKeyword}</span>
                              <div className={styles.searchText}>{t('--search--')}</div>
                            </div>}
                            {allTypeaheadVendors.map((vendor, index) => {
                                return <div className={classNames(styles.typeaheadResultsItems, { [styles.typeaheadResultsItemsMore]: allTypeaheadVendors.length > 8 })} key={index} onClick={() => onTypeaheadSelect(vendor)}>
                                    <div className={styles.typeaheadResultsItemsWrapper}>
                                        {vendor.type !== NVType.parent && <Briefcase size={16} color="var(--warm-neutral-shade-100)"></Briefcase>}
                                        {(vendor.type === NVType.parent) && <img alt="" src={PrarentIcon} />}
                                        <div className={styles.typeaheadResultsItemsContents}>
                                            <div className={styles.typeaheadResultsItemsContentsName}>{vendor?.commonName || vendor?.legalName}</div>
                                            {vendor?.address && vendor.type !== NVType.parent && <div className={styles.typeaheadResultsItemsContentsAddress}>{getConvertedAddresForDisplay(vendor.address)}</div>}
                                            {(vendor.type === NVType.parent) && <div className={styles.typeaheadResultsItemsContentsAddress}>{t('--multipleOptions--')}</div>}
                                            {vendor.type !== NVType.parent && vendor.vendorRecordRefs && vendor.vendorRecordRefs.length > 0 && vendor.vendorRecordRefs[0].vendorId && <div className={styles.typeaheadResultsItemsContentsId}>ID: {vendor.vendorRecordRefs[0].vendorId}</div>}
                                        </div>
                                    </div>
                                    {vendor.type === NVType.parent && <div className={styles.typeaheadResultsItemsViewParent}>{t('--view--')}<ArrowRight size={16} color="var(--warm-prime-azure)"></ArrowRight> </div>}
                                </div>
                            })}
                            {/* {allTypeaheadVendors.length > 0 && <div className={styles.typeaheadResultsMore}>
                                <div className={styles.typeaheadResultsMoreAction} onClick={onSearch}>{t('--seeAllResults--')}</div>
                            </div>} */}
                            {/* {allTypeaheadVendors.length === 0 && !typeAheadLoading && <div className={styles.typeaheadNoResults}>
                                <Info size={18} color="var(--warm-neutral-shade-200)"></Info>
                                <div className={styles.typeaheadNoResultsNotFound}>
                                    <div className={styles.typeaheadNoResultsText}>{t('--noResultsFound--')}</div>
                                    <div className={styles.typeaheadNoResultsName}>
                                        <div className={styles.typeaheadNoResultsNameKeyword}>{t('--clickHere--')}</div>{t('--forAdvanceSearch--')}
                                    </div>
                                </div>
                            </div>} */}
                            {isPopupGoesUp && <div className={`${styles.typeaheadResultsDivider} ${isPopupGoesUp ? styles.typeaheadResultsDividerGoesBottom : ''}`}><div className={styles.typeaheadResultsDividerLine}></div></div>}
                        </div>}
                        {isPopupGoesUp && getTypeAheadInputComponent()}
                    </div>
                </div>
            </div>
        </ClickAwayListener>
    )
}