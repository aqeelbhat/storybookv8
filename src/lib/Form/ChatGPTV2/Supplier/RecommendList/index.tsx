import React, { useEffect, useState } from "react"
import OroAnimator from "../../../../controls/OroAnimator"
import { OroButton } from "../../../../controls"
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Search } from "react-feather"
import { RecommendationFlowProps } from "../types"
import { NAMESPACES_ENUM, useTranslationHook } from "../../../../i18n"
import styles from './style.module.scss'
import { Supplier } from "../../../../Types"
import SupplierCard from "../SupplierCardV2"
import classNames from "classnames"

export default function RecommendationFlow (props: RecommendationFlowProps) {
  const [showMoreSuggestions, setShowMoreSuggestions] = useState<boolean>(false)
  function showMoreToggle () {
    setShowMoreSuggestions(!showMoreSuggestions)
    props.onShowMore()
  }

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])

  function getI18Text (key: string) {
    return t('--supplier--.' + key)
  }
  useEffect(() => {
    setShowMoreSuggestions(false)
  }, [props.reset])

  // this flow works for Recommended and found suppliers(for companyname) both
  // also this works for Nudge case of Recommendation suppliers
  const supplierList = props.suggestedSuppliers || []
  const hasSupplierList = supplierList.length > 0
  const _first3 = supplierList.slice(0, 3) || []
  const _others = supplierList.length > 3 ? supplierList.slice(2) : []
  const _foundSupplierByCompany = props.companyName && hasSupplierList
  const _foundRecommendSuppliers = !props.companyName && hasSupplierList

  return <div className={styles.container}>
    <OroAnimator show={props.isNudging && !props.isSearchON}>
      <div className={styles.responseLabel}>
        <div>{getI18Text('--wouldYouConsider--')}</div>
        <div>{getI18Text('--usingThemSaveTime--')}</div>
      </div>
    </OroAnimator>
    <OroAnimator show={!props.isNudging && _foundSupplierByCompany && !props.isSearchON}>
      <div className={styles.responseLabel}>
        {t('--supplier--.--weFoundMatches--', { name: props.companyName })}
      </div>
    </OroAnimator>
    <OroAnimator show={!props.isNudging && _foundRecommendSuppliers}>
      <div className={styles.responseLabel}>
        {getI18Text('--foundSomeSuppliers--')}
      </div>
    </OroAnimator>

    {/* First 3 Recommended cards */}
    <OroAnimator show={!props.isSearchON && supplierList.length > 0} withDelay>
      <div className={styles.listContainer}>
        {_first3.map((supplier: Supplier, index: number) =>
          <SupplierCard
            key={supplier.vendorId || index}
            supplier={supplier}
            defaultCurrency={props.defaultCurrency}
            preferredSupplier={props.preferredSuppliersDetail}
            allIndustryCodes={props.industryCodes}
            onSupplierSelect={props.onSelect}
          />
        )}</div></OroAnimator>
    {/* Others recommended cards */}
    <OroAnimator show={!props.isSearchON && showMoreSuggestions && supplierList.length > 3}>
      <div className={classNames(styles.listContainer)}>
        {_others.map((supplier: Supplier, index: number) =>
          <SupplierCard
            key={supplier.vendorId || index}
            supplier={supplier}
            defaultCurrency={props.defaultCurrency}
            preferredSupplier={props.preferredSuppliersDetail}
            allIndustryCodes={props.industryCodes}
            onSupplierSelect={props.onSelect}
          />
        )}</div></OroAnimator>

    {/* Show/Less recommended */}
    <OroAnimator show={!props.isSearchON && supplierList.length > 3} withDelay>
      <div>
        <OroAnimator show={!showMoreSuggestions}>
          <div className={styles.expandList} >
            <div></div>
            <span onClick={showMoreToggle}>{getI18Text("--showMore--")} <ChevronDown size={18}/></span>
            <div></div>
          </div>
        </OroAnimator>
        <OroAnimator show={showMoreSuggestions}>
          <div className={styles.expandList} >
            <div></div>
            <span onClick={showMoreToggle}>{getI18Text("--showLess--")} <ChevronUp size={18}/></span>
            <div></div>
          </div></OroAnimator>
      </div>
    </OroAnimator>
    {/* View Recommendation Link when search is ON */}
    <OroAnimator show={props.isSearchON && _foundRecommendSuppliers && hasSupplierList} withDelay>
      <div className={styles.viewRecommendations}>
        <OroButton type="link" icon={<ChevronDown size="18" />}
          iconOrientation="right" onClick={props.onViewRecommendClick}
          label={getI18Text('--viewRecommendations--')} />
      </div></OroAnimator>
    {/* Search Link */}
    <OroAnimator show={!props.isNudging && !props.isSearchON} withDelay>
      <div className={styles.searchCard} onClick={props.onSearchEnable} >
        <div className={styles.text}>{getI18Text('--haveAnotherSupplier--')}</div>

        <OroButton type="link" label={getI18Text('--search--')}
          icon={<Search size="18" className={styles.searchButton} />} />
      </div>
    </OroAnimator>

    {/* Skip Button */}
    <OroAnimator show={!props.isSearchON} withDelay>
      <div>
        <OroButton type="secondary" radiusCurvature="medium"
          label={props.isNudging ? getI18Text('--skipSuggestions--') : getI18Text('--skipSelection--')}
          onClick={props.onSkipSupplier} />
      </div></OroAnimator>
  </div>
}