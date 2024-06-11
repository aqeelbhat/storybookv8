import React, { useEffect, useState } from "react"
import { Address, Option, OroButton, Supplier, VendorRef } from "../../.."

import styles from './style.module.scss'
import { getSupplierLogoUrl } from "../../util"
import noSupplierLogo from './../../assets/no-supplier-logo.png'
import { SupplierSegmentationComponent } from "../../components/supplier-segmentation.component"
import { ChevronDown, ChevronUp, X } from "react-feather"
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n"
import { PreferredSuppliers } from "../types"
import { SupplierTransactionDetails } from "./supplier-transaction.component"


interface SupplierSuggestionProps {
  selectedSupplier: Supplier
  suggestedSuppliers?: Supplier[]
  defaultCurrency?: string
  preferredSuppliersDetail?: PreferredSuppliers[]
  industryCodes?: Option[]
  onSelect?: (supplier: Supplier) => void
  onProceed?: () => void
  onSkipSupplier?: () => void
  onClose?: () => void
}

function SupplierCard (props: {
    supplier: Supplier
    preferredSupplier?: PreferredSuppliers[]
    isSelectedView?: boolean
    defaultCurrency?: string
    allIndustryCodes?: Array<Option>
    onSupplierSelect?: (supplier: Supplier) => void
    onRemoveSelected?: () => void
}) {
  const [supplierAddressString, setSupplierAddressString] = useState<string>('')
  const [supplierCompanyTypeString, setSupplierCompanyTypeString] = useState<string>('')
  const [supplierVendorId, setSupplierVendorId] = useState<string>('')
  const [isExpand, setIsExpand] = useState<boolean>(false)

  const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])

  function getSupplierAddress (address?: Address): string {
    if (address) {
      return `${address.city} ${address.alpha2CountryCode}`
    } else {
      return ''
    }
  }

  function getVendorId (vendorRefs?: Array<VendorRef>): string {
    if (vendorRefs && vendorRefs.length === 1) {
      return vendorRefs[0]?.vendorId || ''
    } else if (vendorRefs && vendorRefs.length > 1) {
      return 'Multiple'
    }
    return ''
  }

  function handleSupplierSelect () {
    if (props.onSupplierSelect && !props.isSelectedView) {
     props.onSupplierSelect(props.supplier)
    }
  }

  function getIndustryCodeDisplayName (industryCodes: Array<Option>, type: string): string {
    const findIndustryCode = industryCodes.map(option => (option.id === type || option.path === type || option?.customData?.code === type) ? option.displayName : getIndustryCodeDisplayName(option.children || [], type)).filter(names => names.length)
    return findIndustryCode?.join('') || ''
  }

  function removeSelectedSupplier () {
    props.onRemoveSelected && props.onRemoveSelected()
  }

  function canShowTransactionDetails () {
    return props.preferredSupplier?.length > 0 && props.preferredSupplier?.some(prSupplier => prSupplier.erpSupplier === props.supplier?.supplierName)
  }

  function getTransactionDetails () {
    const matchedSuppliers = props.preferredSupplier?.filter(prSupplier => prSupplier.erpSupplier === props.supplier?.supplierName)
    return matchedSuppliers?.length > 0 ? matchedSuppliers.splice(0, 2) : []
  }

  function showTransaction () {
    setIsExpand(!isExpand)
  }

  useEffect(() => {
    setSupplierAddressString(getSupplierAddress(props.supplier.address))
    setSupplierCompanyTypeString(getIndustryCodeDisplayName(props.allIndustryCodes || [], props.supplier?.legalEntity?.industryCode || ''))
    setSupplierVendorId(getVendorId(props.supplier?.vendorRecords))
  }, [props.supplier, props.allIndustryCodes])

  return (<div className={`${styles.supplierSuggestions} ${props.isSelectedView ? styles.selectedCard : ''}`}>
        <header className={styles.supplierSuggestionsHeader}>
          <div className={styles.supplierSuggestionsHeaderInfo} onClick={handleSupplierSelect}>
            <img className={styles.supplierSuggestionsHeaderLogo} src={getSupplierLogoUrl(props.supplier?.legalEntity) || noSupplierLogo} alt="" />
            <div className={styles.supplierSuggestionsHeaderDetails}>
                <div className={styles.supplierSuggestionsHeaderDetailsTextContainer}>
                    <span className={styles.supplierSuggestionsHeaderDetailsText}>{props.supplier?.supplierName}</span>
                    {props.supplier?.supplierStatus && <SupplierSegmentationComponent status={props.supplier.supplierStatus} />}
                </div>
                <div className={styles.supplierSuggestionsHeaderDetailsSubTextList}>
                    { supplierCompanyTypeString && <span className={styles.supplierSuggestionsHeaderDetailsSubText}>{supplierCompanyTypeString}</span> }
                    { supplierAddressString && <span className={styles.supplierSuggestionsHeaderDetailsSubText}>{getSupplierAddress(props.supplier.address)}</span> }
                    { supplierVendorId && <span className={styles.supplierSuggestionsHeaderDetailsSubText}>Vendor ID: {supplierVendorId}</span> }
                    { props.supplier?.duns && <span className={styles.supplierSuggestionsHeaderDetailsSubText}>DUNS: {props.supplier?.duns}</span> }
                </div>
            </div>
          </div>
          {props.isSelectedView && <div className={styles.closeBtn} onClick={() => removeSelectedSupplier()}><X size={24} color="var(--warm-neutral-shade-300)"/></div>}
        </header>
        { (props.supplier?.legalEntity?.description) && <div className={styles.supplierSuggestionsDescription}>
            { props.supplier.legalEntity.description}
        </div> }
        {props.supplier?.segmentationDetails && props.supplier?.segmentationDetails?.length > 0 && <div className={styles.supplierSuggestionsCapabilities}>
            <div className={styles.supplierSuggestionsCapabilitiesContainer}>
                {
                    Array.isArray(props.supplier?.segmentationDetails) && props.supplier?.segmentationDetails.slice(0, 1).map((item, index) => {
                      return (
                        <div key={index} className={`${styles.supplierSuggestionsCapabilitiesContainerItem}`}>
                            <div className={styles.supplierSuggestionsCapabilitiesContainerItemCategories}>
                                {item?.dimension?.categories && item?.dimension?.categories.length > 0 && <div className={styles.categoryText} key={index}>{item?.dimension?.categories.slice(0, 2).map(item => item.name).join(', ')}</div>}
                                {item?.segmentation && <SupplierSegmentationComponent status={item?.segmentation} />}
                            </div>
                        </div>
                      )
                    })

                }
            </div>
        </div>}
        { canShowTransactionDetails() && <div className={styles.supplierSuggestionsTransactions}>
            <div className={styles.titleRow} onClick={() => showTransaction()}>
              {!isExpand ? <ChevronDown size={20} color={"var(--warm-prime-azure)"} /> : <ChevronUp size={20} color={"var(--warm-prime-azure)"}/>}
              <div>{t("--recentTransaction--", "Recent Transactions")}</div>
            </div>
            {isExpand && <SupplierTransactionDetails transactions={getTransactionDetails()} defaultCurrency={props.defaultCurrency}/>}
          </div>
        }
    </div>)
}

export function SupplierSuggestion (props: SupplierSuggestionProps) {
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier>()
    const [supplierList, setSupplierList] = useState<Supplier[]>([])
    const [isShowMore, setIsShowMore] = useState<boolean>(false)

    const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])

    useEffect(() => {
        setSelectedSupplier(props.selectedSupplier)
    }, [props.selectedSupplier])

    useEffect(() => {
        if (props.suggestedSuppliers && props.suggestedSuppliers?.length > 3) {
          setIsShowMore(true)
          setSupplierList(props.suggestedSuppliers?.slice(0, 3))
        } else {
          setIsShowMore(false)
          setSupplierList(props.suggestedSuppliers)
        }
    }, [props.suggestedSuppliers])

    function handleSupplierSelection (supplier: Supplier) {
        setSelectedSupplier(supplier)
        if (props.onSelect) {
          props.onSelect(supplier)
        }
    }

    function handleNext () {
        if (props.onProceed) {
          props.onProceed()
        }
    }

    function onSkip () {
      if (props.onSkipSupplier) {
        props.onSkipSupplier()
      }
    }

    function handleRemoveSelection () {
      setSelectedSupplier(null)
      if (props.onSelect) {
        props.onSelect(null)
      }
    }
    
    function showAllSuggestion () {
        setIsShowMore(!isShowMore)
        if (isShowMore) {
          setSupplierList(props.suggestedSuppliers)
        } else {
          setSupplierList(props.suggestedSuppliers?.slice(0, 3))
        }
    }

    function closeTab() {
      props.onClose && props.onClose()
    }

    return (<>
        <div className={styles.categorySuggestions}>
            <div className={styles.categorySuggestionsHeaderContainer}>
              <div className={styles.categorySuggestionsTitle}>
                {t("--supplierTip--")}
              </div>
              <div className={styles.closeBtn} onClick={() => closeTab()}><X size={20} color="var(--warm-neutral-shade-300)"/></div>
            </div>
            <div className={styles.categorySuggestionsOptions}>
              <span className={styles.label}>{!selectedSupplier ? t("--selectSupplier--") : t("--selectedSupplier--")}</span>
              {!selectedSupplier && supplierList?.length > 0 && supplierList.map((supplier: Supplier, index: number) =>
                <SupplierCard 
                  key={index}
                  supplier={supplier}
                  defaultCurrency={props.defaultCurrency}
                  preferredSupplier={props.preferredSuppliersDetail}
                  allIndustryCodes={props.industryCodes}
                  onSupplierSelect={handleSupplierSelection}/>
              )}
              {
                selectedSupplier && <SupplierCard supplier={selectedSupplier} defaultCurrency={props.defaultCurrency} preferredSupplier={props.preferredSuppliersDetail} allIndustryCodes={props.industryCodes} isSelectedView={true} onSupplierSelect={handleSupplierSelection} onRemoveSelected={handleRemoveSelection}/>
              }
            </div>
            {!selectedSupplier && props.suggestedSuppliers?.length > 3 && <div className={styles.expandList} onClick={() => showAllSuggestion()}>
                {isShowMore ? t("--showMore--") : t("--showLess--")}
            </div>}
            <div className={styles.categorySuggestionsAction}>
                <OroButton label={t("--skipLater--")} type='secondary' radiusCurvature='medium' onClick={onSkip}/>
                <OroButton label={t("--next--")} radiusCurvature='medium' type='primary' onClick={handleNext}/>
            </div>
        </div>
    </>)

}