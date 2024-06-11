import React, { useEffect, useState } from "react"
import { NAMESPACES_ENUM, useTranslationHook } from "../../../../i18n";
import recentLOGO from './recent.svg'
import shieldLogo from './shield.svg'
import { Address, SegmentationDetail, Supplier, Option } from "../../../../Types";
import { SupplierSegmentation, VendorRef } from "../../../../Types/vendor";
import styles from './styles.module.scss'
import { PreferredSuppliers } from "../../types";
import classNames from "classnames";
import { SupplierSegmentationComponent } from "../../../components/supplier-segmentation.component";
import { getSupplierLogoUrl } from "../../../util";
import noSupplierLogo from './../../../assets/no-supplier-logo.png'
import { OroButton } from "../../../../controls";

export function RecentTransaction (props: { transactions: PreferredSuppliers[] }) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  const _transation = props.transactions && props.transactions.length > 0 ? props.transactions[0] : null
  return (<>
    {_transation && <div className={styles.transaction}>
      <span className={styles.recent}><img src={recentLOGO} width={16} height={16} />{t('--supplier--.--recentlyUsedFor--')}</span>
      {t('--supplier--.--productUsedBy--', { product: _transation.title, user: _transation.userId, department: _transation.companyCode })}
    </div>}
  </>)
}

export function PreferredCategories (props: { segmentations: SegmentationDetail[] }) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  const { segmentations } = props

  if (segmentations && segmentations.length > 0) {
    const _preferred = segmentations.find((item) => item.segmentation === SupplierSegmentation.preferred)
    if (_preferred) {
      // get first two categories
      const categories = _preferred.dimension?.categories && _preferred.dimension.categories.length > 0 ? _preferred.dimension.categories.slice(0, 2) : []
      return <div className={styles.preferred}>
        <span className={styles.for}><img src={shieldLogo} width={16} height={16} />{t('--supplier--.--preferredFor--')}</span>
        {categories.map(item => item.name).join(', ')}
      </div>
    }
  }
  return null
}

function SupplierCard (props: {
  supplier: Supplier
  preferredSupplier?: PreferredSuppliers[]
  isSelectedView?: boolean
  defaultCurrency?: string
  allIndustryCodes?: Array<Option>
  onSupplierSelect?: (supplier: Supplier) => void
}) {
  const [supplierAddressString, setSupplierAddressString] = useState<string>('')
  const [supplierCompanyTypeString, setSupplierCompanyTypeString] = useState<string>('')
  const [supplierVendorId, setSupplierVendorId] = useState<string>('')

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  function getI18Text (key: string) {
    return t('--supplier--.' + key)
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

  function canShowTransactionDetails () {
    return props.preferredSupplier?.length > 0 && props.preferredSupplier?.some(prSupplier => prSupplier.erpSupplier === props.supplier?.supplierName)
  }

  function getTransactionDetails () {
    const matchedSuppliers = props.preferredSupplier?.filter(prSupplier => prSupplier.erpSupplier === props.supplier?.supplierName)
    return matchedSuppliers?.length > 0 ? matchedSuppliers.splice(0, 2) : []
  }

  function getVendorId (vendorRefs?: Array<VendorRef>): string {
    if (vendorRefs && vendorRefs.length === 1) {
      return vendorRefs[0]?.vendorId || ''
    } else if (vendorRefs && vendorRefs.length > 1) {
      return getI18Text('--multiple--')
    }
    return ''
  }

  function getSupplierAddress (address?: Address): string {
    if (address) {
      return `${address.city} ${address.alpha2CountryCode}`
    } else {
      return ''
    }
  }
  function canShowPreferred () {
    const _seg = props.supplier?.segmentationDetails || []
    return _seg.length > 0
  }

  useEffect(() => {
    setSupplierAddressString(getSupplierAddress(props.supplier?.address))
    setSupplierCompanyTypeString(getIndustryCodeDisplayName(props.allIndustryCodes || [], props.supplier?.legalEntity?.industryCode || ''))
    setSupplierVendorId(getVendorId(props.supplier?.vendorRecords))
  }, [props.supplier, props.allIndustryCodes])

  const _canShowPreferred = canShowPreferred()
  const _canShowTransactionDetails = canShowTransactionDetails()
  return (<div className={classNames(styles.supplierCard, { [styles.selectedCard]: props.isSelectedView })}>
    <header className={styles.supplierCardHeader}>
      <div className={classNames(styles.supplierCardHeaderInfo)} >
        <img className={styles.supplierCardHeaderLogo} src={getSupplierLogoUrl(props.supplier?.legalEntity) || noSupplierLogo} alt="" />
        <div className={styles.supplierCardHeaderDetails}>
          <div className={styles.supplierCardHeaderDetailsTextContainer}>
            <span className={styles.supplierCardHeaderDetailsText}>{props.supplier?.supplierName}</span>
            {props.supplier?.supplierStatus && <SupplierSegmentationComponent status={props.supplier?.supplierStatus} />}
          </div>
          <div className={styles.supplierCardHeaderDetailsSubTextList}>
            {supplierCompanyTypeString && <span className={styles.supplierCardHeaderDetailsSubText}>{supplierCompanyTypeString}</span>}
            {supplierAddressString && <span className={styles.supplierCardHeaderDetailsSubText}>{getSupplierAddress(props.supplier?.address)}</span>}
            {supplierVendorId && <span className={styles.supplierCardHeaderDetailsSubText}>{getI18Text('--vendorId--')} {supplierVendorId}</span>}
            {/* {props.supplier?.duns && <span className={styles.supplierCardHeaderDetailsSubText}>{getI18Text('--duns--')} {props.supplier?.duns}</span>} */}
          </div>
        </div>
      </div>

      {!props.isSelectedView && <div className={styles.secondarySelect}><OroButton type="secondary" label={getI18Text('--select--')}></OroButton></div>}
      {!props.isSelectedView && <div className={styles.primarySelect}><OroButton onClick={handleSupplierSelect} type="primary" label={getI18Text('--select--')}></OroButton></div>}

    </header>
    {(_canShowPreferred || _canShowTransactionDetails) && <div className={styles.seperator}></div>}
    {_canShowPreferred && <PreferredCategories segmentations={props.supplier?.segmentationDetails} ></PreferredCategories>}
    {_canShowTransactionDetails && <RecentTransaction transactions={getTransactionDetails()} />}
  </div>)
}
export default SupplierCard