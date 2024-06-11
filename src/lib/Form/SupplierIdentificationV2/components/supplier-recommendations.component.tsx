import React, { useEffect, useState } from "react";
import { Address, NormalizedVendor, SegmentationDetail, Supplier, checkURLContainsProtcol, mapAlpha2codeToDisplayName } from "../../..";
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
import styles from './styles.module.scss'
import { Check, ChevronDown, ChevronUp } from "react-feather";
import { findLargelogo } from "../../util";
import noSupplierLogo from './../../assets/no-supplier-logo.png';
import RecommendationLogo from './../../assets/supplier-recommendation-icon.svg';
import { SupplierSegmentationComponent } from "../../components/supplier-segmentation.component";
import { SupplierSegmentation } from "../../../Types/vendor";

interface SupplierRecommendationProps {
   supplierRecommendationList: Array<NormalizedVendor>
   selectedSuppliers?: Supplier[]
   onSelect?: (selectedVendor: NormalizedVendor) => void
}

function SupplierCard (props: {
    supplier: NormalizedVendor
    selectedSuppliers?: Supplier[]
    onSupplierSelect?: (vendor: NormalizedVendor) => void
}) {
  const [logo, setLogo] = useState('')
  const [website, setWebsite] = useState('')
  const [isSelected, setIsSelected] = useState(false)
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2])

  function handleSupplierSelect () {
    if (props.onSupplierSelect) {
      props.onSupplierSelect(props.supplier)
    }
  }

  function filterPreferredSegementations (data: SegmentationDetail): boolean {
    return data.segmentation === SupplierSegmentation.preferred
  }

  useEffect(() => {
    if (props.supplier?.logo && props.supplier?.logo?.metadata && props.supplier.logo?.metadata?.length > 0) {
      const logo = findLargelogo(props.supplier.logo.metadata)
      setLogo(logo)
    }
    if (props.supplier?.website) {
      const websiteBreakdown = new URL(checkURLContainsProtcol(props.supplier.website))
      setWebsite(websiteBreakdown.hostname)
    }
    if (props.selectedSuppliers && props.selectedSuppliers.length > 0) {
     setIsSelected(props.selectedSuppliers.some(supplier => supplier.vendorId === props.supplier.id))
    }
  }, [props.supplier, props.selectedSuppliers])

  return (<div className={`${styles.supplierSuggestions}`}>
        <header className={styles.supplierSuggestionsHeader}>
          <div className={styles.supplierSuggestionsHeaderInfo}>
            <img className={styles.supplierSuggestionsHeaderLogo} src={logo || noSupplierLogo} alt="" />
            <div className={styles.supplierSuggestionsHeaderDetails}>
                <div className={styles.textContainer}>
                  <span className={styles.name}>{props.supplier?.commonName}</span>
                </div>
                <div className={styles.attributeList}>
                    {props.supplier?.address && <div className={styles.attribute}>{[props.supplier?.address?.city, mapAlpha2codeToDisplayName(props.supplier?.address?.alpha2CountryCode)].filter(Boolean).join(', ')}</div> }
                    {props.supplier.website && <div className={styles.attribute}><a href={checkURLContainsProtcol(props.supplier.website)} target='_blank' rel='noreferrer' title={props.supplier.website}>
                      {website}
                    </a></div>}
                    {props.supplier?.vendorRecordRefs && props.supplier?.vendorRecordRefs.length > 0 && props.supplier?.vendorRecordRefs[0]?.vendorId && <div className={styles.attribute}>{t('--id--')} {props.supplier?.vendorRecordRefs[0]?.vendorId}</div> }
                </div>
            </div>
          </div>
          <div className={styles.supplierSelect}>
            {!isSelected && <button className={styles.supplierSelectButton} onClick={handleSupplierSelect}>{t('--select--')}</button>}
            {isSelected && <div className={styles.selected}><Check size={20} color={"var(--warm-stat-mint-regular)"}/> {t('--selected--')}</div>}
          </div>
        </header>
        {props.supplier?.description && <div className={styles.description}>{props.supplier.description}</div> }
        {props.supplier?.segmentations && props.supplier?.segmentations?.length > 0 && <div className={styles.supplierSuggestionsCapabilities}>
            <div className={styles.supplierSuggestionsCapabilitiesContainer}>
                {
                    Array.isArray(props.supplier?.segmentations) && props.supplier?.segmentations?.filter(filterPreferredSegementations).slice(0, 2).map((item, index) => {
                      return (
                        <div key={index} className={`${styles.supplierSuggestionsCapabilitiesContainerItem}`}>
                            <div className={styles.supplierSuggestionsCapabilitiesContainerItemCategories}>
                                {item?.segmentation && <SupplierSegmentationComponent status={item?.segmentation} />}
                                {item?.dimension?.categories && item?.dimension?.categories.length > 0 && 
                                  <div className={styles.categoryText} key={index}>
                                    {item?.dimension?.categories.slice(0, 2).map(item => item.name).join(', ')}
                                    {item?.dimension?.categories?.length > 2 ? ` +${item?.dimension?.categories?.length - 2} more` : ''}
                                  </div>}
                            </div>
                        </div>
                      )
                    })

                }
            </div>
        </div>}
    </div>)
}

function SupplierRecommendationListContents (props: SupplierRecommendationProps) {
    const [showRecommendation, setShowRecommendation] = useState(false)
    const [supplierRecommendations, setSupplierRecommendations] = useState<NormalizedVendor[]>([])
    const [isShowMore, setIsShowMore] = useState(false)
    const [isExpand, setIsExpand] = useState(false)
    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

    function toggleRecommendations () {
      setShowRecommendation(!showRecommendation) 
    }

    function handleSupplierSelection (selectedSupplier: NormalizedVendor) {
        if (props.onSelect) {
          setShowRecommendation(false)
          props.onSelect(selectedSupplier)
        }
    }

    function showAllRecommendations (isExpanded?: boolean) {
      if (isExpanded) {
        setSupplierRecommendations(props.supplierRecommendationList)
        setIsExpand(true)
      } else {
        setSupplierRecommendations(props.supplierRecommendationList?.slice(0, 3))
        setIsExpand(false)
      }
    }

    useEffect(() => {
      if (props.supplierRecommendationList && props.supplierRecommendationList.length > 3) {
        setSupplierRecommendations(props.supplierRecommendationList.slice(0, 3))
        setIsShowMore(true)
      } else {
        setSupplierRecommendations(props.supplierRecommendationList || [])
        setIsShowMore(false)
      }
    }, [props.supplierRecommendationList])

    return (
      <div className={styles.supplierRecommendation}>
        <div className={styles.supplierRecommendationContainer}>
            <div className={styles.title}>
              <div className={styles.logo}><img width={20} height={20} src={RecommendationLogo} /></div>
              {t('--weIdentifiedFewPreferredSupplierToConsider--')}
            </div>
            <div className={styles.showHideRecommendations} onClick={toggleRecommendations}>
                {!showRecommendation ? 
                  <>
                    {t('--viewRecommendations--')}
                    <ChevronDown size={20} color={"var(--warm-prime-azure)"} />
                  </>
                  : <>
                    {t('--hide--')}
                    <ChevronUp size={20} color={"var(--warm-prime-azure)"} />
                  </>}
            </div>
        </div>
        {
            showRecommendation && <div className={styles.supplierRecommendationList}>
                {supplierRecommendations.length > 0 && supplierRecommendations.map((supplier: NormalizedVendor, index: number) =>
                    <SupplierCard 
                      key={index}
                      supplier={supplier}
                      selectedSuppliers={props.selectedSuppliers}
                      onSupplierSelect={handleSupplierSelection}/>
                )}
                {isShowMore && !isExpand && <div className={styles.expandCollapse} onClick={() => showAllRecommendations(true)}>
                  <div>{t('--viewMore--')}</div> <ChevronDown size={20} color={"var(--warm-prime-azure)"} />
                </div>}
                {isExpand && <div className={styles.expandCollapse} onClick={() => showAllRecommendations(false)}>
                  {t('--viewLess--')} <ChevronUp size={20} color={"var(--warm-prime-azure)"} />
                </div>}
            </div>
        }
      </div>
    )
}

export function SupplierRecommendationList (props: SupplierRecommendationProps) {
    return (
        <I18Suspense><SupplierRecommendationListContents {...props}></SupplierRecommendationListContents></I18Suspense>
    )
}