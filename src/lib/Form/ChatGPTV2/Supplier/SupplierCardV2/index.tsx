import React, { useEffect, useState } from "react"
import { Address, NormalizedVendor, Option, OroButton, SegmentationDetail, Supplier, VendorRef } from "../../../.."

import styles from './style.module.scss'
import { getSupplierLogoUrl } from "../../../util"
import noSupplierLogo from './../../../assets/no-supplier-logo.png'
import { SupplierSegmentationComponent } from "../../../components/supplier-segmentation.component"
import { ChevronDown, ChevronUp, X } from "react-feather"
import { NAMESPACES_ENUM, useTranslationHook } from "../../../../i18n"
import { PreferredSuppliers } from "../../types"
import { TransactionDetails } from "./Transactions"

function getSupplierAddress (address?: Address): string {
  if (address) {
    const _address = []
    if (address.city) {
      _address.push(address.city)
    }
    if (address.alpha2CountryCode) {
      _address.push(address.alpha2CountryCode)
    }
    return _address.join(' ')
  } else {
    return ''
  }
}

function getVendorId (multipleLabel: string, vendorRefs?: Array<VendorRef>): string {
  if (vendorRefs && vendorRefs.length === 1) {
    return vendorRefs[0]?.vendorId || ''
  } else if (vendorRefs && vendorRefs.length > 1) {
    return multipleLabel
  }
  return ''
}

function getIndustryCodeDisplayName (industryCodes: Array<Option>, type: string): string {
  const findIndustryCode = industryCodes.map(option => (option.id === type || option.path === type || option?.customData?.code === type) ? option.displayName : getIndustryCodeDisplayName(option.children || [], type)).filter(names => names.length)
  return findIndustryCode?.join('') || ''
}

export default function SupplierCard (props: {
  supplier: Supplier
  preferredSupplier?: PreferredSuppliers[]
  isSelectedView?: boolean
  defaultCurrency?: string
  allIndustryCodes?: Array<Option>
  getVendorDetails?: (vendorId: string) => Promise<NormalizedVendor>
  onSupplierSelect?: (supplier: Supplier) => void
  onRemoveSelected?: () => void
}) {
  const [Supplier, setSupplier] = useState<Supplier | null>(null)
  const [isExpand, setIsExpand] = useState<boolean>(false)

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  function getI18 (key: string) {
    return t('--supplier--.' + key)
  }

  function handleSupplierSelect () {
    if (props.onSupplierSelect && !props.isSelectedView) {
      props.onSupplierSelect(props.supplier)
    }
  }

  function canShowTransactionDetails () {
    return props.preferredSupplier?.length > 0 && props.preferredSupplier?.some(prSupplier => prSupplier.erpSupplier === _supplier.supplierName)
  }

  function getTransactionDetails () {
    const matchedSuppliers = props.preferredSupplier?.filter(prSupplier => prSupplier.erpSupplier === _supplier.supplierName)
    return matchedSuppliers?.length > 0 ? matchedSuppliers.splice(0, 2) : []
  }

  function showTransaction () {
    setIsExpand(!isExpand)
  }

  useEffect(() => {
    if (props.supplier?.vendorId && props.supplier?.vendorId !== Supplier?.vendorId) {
      setSupplier(props.supplier)
    }
  }, [props.supplier])

  useEffect(() => {
    // fetch vendor details
    const _vendorID = props.supplier?.vendorId
    // const isAlreadyFetched = (_vendorID === AsyncSupplierDetails?.vendorId)
    if (props.getVendorDetails && props.isSelectedView && _vendorID) {
      props.getVendorDetails(_vendorID)
        .then((res) => {
          // if same is fetched
          if (res && (props.supplier?.vendorId === res.id)) {
            // override the required details..TODO replace with mapper
            if (Supplier) {
              Supplier.segmentationDetails = res.segmentations || Supplier.segmentationDetails
              Supplier.description = res.description || Supplier.description
              Supplier.address = res.address || Supplier.address
              if (Supplier.legalEntity) {
                Supplier.legalEntity.industryCode = res.industryCode || Supplier.legalEntity.industryCode
              }
              Supplier.vendorRecords = res.vendorRecordRefs || Supplier.vendorRecords
              Supplier.supplierStatus = res.supplierStatus || Supplier.supplierStatus
              Supplier.duns = res.duns || Supplier.duns
            }
          }
        })
    }
  }, [props.isSelectedView, props.supplier?.vendorId])

  const _supplier = (Supplier || {}) as Supplier
  const _description = _supplier.legalEntity?.description || _supplier.description
  const supplierAddressString = getSupplierAddress(_supplier?.address)
  const supplierCompanyTypeString = (getIndustryCodeDisplayName(props.allIndustryCodes || [], _supplier?.legalEntity?.industryCode || ''))
  const supplierVendorId = getVendorId(getI18('--multiple--'), _supplier?.vendorRecords)

  return (<div className={`${styles.supplierSuggestions} ${props.isSelectedView ? styles.selectedCard : ''}`}>
    <header className={styles.header}>
      <div className={styles.headerInfo} >
        <img className={styles.headerLogo} src={getSupplierLogoUrl(_supplier.legalEntity) || noSupplierLogo} alt="" />
        <div className={styles.headerDetails}>
          <div className={styles.headerDetailsTextContainer}>
            <span className={styles.headerDetailsText}>{_supplier.supplierName}</span>
            {_supplier.supplierStatus && <SupplierSegmentationComponent status={_supplier.supplierStatus} />}
          </div>
          <div className={styles.headerDetailsSubTextList}>
            {supplierCompanyTypeString && <span className={styles.headerDetailsSubText}>{supplierCompanyTypeString}</span>}
            {supplierAddressString && <span className={styles.headerDetailsSubText}>{getSupplierAddress(_supplier.address)}</span>}
            {supplierVendorId && <span className={styles.headerDetailsSubText}>{getI18('--vendorId--')} {supplierVendorId}</span>}
            {_supplier.duns && <span className={styles.headerDetailsSubText}>{getI18('--duns--')} {_supplier.duns}</span>}
          </div>
        </div>
      </div>
      {!props.isSelectedView && <div className={styles.selectButton}>
        <div className={styles.secondaryButton}><OroButton type="secondary" radiusCurvature="medium" label={getI18('--select--')} onClick={handleSupplierSelect} /></div>
        <div className={styles.primaryButton}><OroButton type="primary" radiusCurvature="medium" label={getI18('--select--')} onClick={handleSupplierSelect} /></div>
      </div>}
    </header>
    {(_description) && <div className={styles.supplierSuggestionsDescription}>
      {_description}
    </div>}
    {_supplier.segmentationDetails && _supplier.segmentationDetails?.length > 0 && <div className={styles.supplierSuggestionsCapabilities}>
      <div className={styles.supplierSuggestionsCapabilitiesContainer}>
        {
          Array.isArray(_supplier.segmentationDetails) && _supplier.segmentationDetails.slice(0, 3).map((item, index) => {
            return (
              <div key={index} className={`${styles.supplierSuggestionsCapabilitiesContainerItem}`}>
                <div className={styles.supplierSuggestionsCapabilitiesContainerItemCategories}>
                  {item?.segmentation && <SupplierSegmentationComponent status={item?.segmentation} />}
                  {item?.segmentation && <div className={styles.seperator}></div>}
                  {item?.description && <div className={styles.categoryText}>{item?.description}</div>}
                  {!item?.description && item?.dimension?.categories && item?.dimension?.categories.length > 0 && <div className={styles.categoryText}>{item?.dimension?.categories.slice(0, 2).map(item => item.name).join(', ')}</div>}
                </div>
              </div>
            )
          })

        }
      </div>
    </div>}
    {canShowTransactionDetails() && <div className={styles.supplierSuggestionsTransactions}>
      <div className={styles.titleRow} onClick={() => showTransaction()}>
        <OroButton type="link"
          label={getI18("--recentTransaction--")}
          icon={!isExpand ? <ChevronDown size={20} color={"var(--warm-prime-azure)"} /> : <ChevronUp size={20} color={"var(--warm-prime-azure)"} />}
          iconOrientation="right"
        />
      </div>
      {isExpand && <TransactionDetails transactions={getTransactionDetails()} defaultCurrency={props.defaultCurrency} />}
    </div>
    }
  </div>)
}
