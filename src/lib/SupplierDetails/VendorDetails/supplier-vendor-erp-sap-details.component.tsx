
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Info, Search, X } from "react-feather";
import { convertAddressToString } from "../../Form";
import { BankInfo, Vendor, Location, IDRef, Tax } from "../../Types";
import styles from './styles.module.scss';
import { mapAlpha2codeToDisplayName } from "../../util";
import { PortalPanelDialog } from "../../Portal/portal-panel.component";
import { BlockStatuses, VendorCompanyInfo, VendorIdentificationNumber, VendorPurchaseOrgInfo, VendorType } from "../../Types/vendor";
import { FormDefinitionReadOnlyView } from "../../CustomFormDefinition/View/FormDefinitionReadOnlyView";
import { CustomFormData } from "../../CustomFormDefinition/types/CustomFormModel";
import { CustomFormDefinition } from "../../CustomFormDefinition/types/CustomFormDefinition";
import { SupplierVendorSapDetailsProps } from "./type";
import { VendorHeaderExtensionForm } from "./supplier-vendor-erp-details.component";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { getSessionLocale } from "../../sessionStorage";
import { getBlockedERPStatuses, getDateRangeDisplayString, getIncoTermDisplayName } from "../../Form/util";
import { EnumsDataObject } from "../../Form/types";


const COMPANY_CODES = 'companyCodes'
const PURCHASING_ORGANIZATIONS = 'purchasingOrganizations'
const BANK_INFO = 'paymentDetails'
const TAX_INFO = 'taxDetails'
const IDENTIFIERS = 'identificationNumbers'


export function GetBankInfoRow (props: { account: BankInfo, bankKeys?: EnumsDataObject[], t?: (key: string) => string }): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function getI18Text (key: string) {
      return props.t('--erpDetails--.' + key)
    }

    function getBankKeyName(key: string): string {
      return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
    }

    return(
        <div className={styles.section}>
            <div onClick={() => setIsOpen(!isOpen)}>
            { !isOpen && <ChevronRight size={20} color={"var(--warm-neutral-shade-300)"}/>}
            { isOpen && <ChevronDown size={20} color={"var(--warm-neutral-shade-300)"}/>}
            </div>
            <div className={styles.content}>
                <div className={styles.row}>
                  <div>{props.account?.bankName || '--'}{props.account?.bankAddress?.alpha2CountryCode ? `, ${mapAlpha2codeToDisplayName(props.account?.bankAddress?.alpha2CountryCode)}` : ''}</div>
                  <div className={styles.accountDetail}>
                    <div className={styles.key}>{getI18Text('--account_number--')}</div>
                    <div className={styles.value}>{props.account?.accountNumber?.maskedValue || '--'}</div>
                  </div>
                </div>
                {isOpen && <div className={styles.bankDetail}>
                        <div className={styles.bankDetailRow}>
                            <div className={styles.label}>{getI18Text('--bankName--')}</div>
                            <div className={styles.value}>{props.account?.bankName || '--'}</div>
                        </div>
                        <div className={styles.bankDetailRow}>
                            <div className={styles.label}>{getI18Text('--bankCountry--')}</div>
                            <div className={styles.value}>{props.account?.bankAddress?.alpha2CountryCode ? `${mapAlpha2codeToDisplayName(props.account?.bankAddress?.alpha2CountryCode)}` : '--'}</div>
                        </div>
                        <div className={styles.bankDetailRow}>
                            <div className={styles.label}>{getI18Text('--bankKey--')}{` (${props.account?.key || '--'})`}</div>
                            <div className={styles.value}>{getBankKeyName(props.account?.key || props.account?.internationalKey) || '--'}</div>
                        </div>
                        <div className={styles.bankDetailRow1}>
                            <div className={styles.label}>{getI18Text('--accountName--')}</div>
                            <div className={styles.value}>{props.account?.accountHolder || '--'}</div>
                        </div>
                        <div className={styles.bankDetailRow}>
                            <div className={styles.label}>{getI18Text('--accountNumber--')}</div>
                            <div className={styles.num}>{props.account?.accountNumber?.maskedValue || '--'}</div>
                        </div>
                        <div className={styles.bankDetailRow}>
                            <div className={styles.label}>{getI18Text('--accountAddress--')}</div>
                            <div className={styles.value}>{convertAddressToString(props.account?.bankAddress) || '--'}</div>
                        </div>
                </div>}
            </div>
        </div>
    )
}

export function GetTaxDetailRow (props: { taxDetail: Tax, taxKeys?: EnumsDataObject[], t?: (key: string) => string }): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function getI18Text (key: string) {
      return props.t('--erpDetails--.' + key)
    }
    function getTaxKeyName(key: string): string {
      return props.taxKeys?.find(enumVal => enumVal.code === key)?.name || key
    }

    return(
        <div className={styles.section}>
          <div onClick={() => setIsOpen(!isOpen)}>
            { !isOpen && <ChevronRight size={20} color={"var(--warm-neutral-shade-300)"}/>}
            { isOpen && <ChevronDown size={20} color={"var(--warm-neutral-shade-300)"}/>}
          </div>
          <div className={styles.content}>
            <div className={styles.row}>
              {getI18Text('--taxID--')} ({props.taxDetail?.type || '-'}): {props.taxDetail?.encryptedTaxNumber?.maskedValue || '-'}
            </div>
            {isOpen && <div className={styles.taxDetail}>
                <div className={styles.row}>
                    <div className={styles.label}>{getI18Text('--issuer--')}</div>
                    <div className={styles.value}>{mapAlpha2codeToDisplayName(props.taxDetail?.issuer) || '-'}</div>
                </div>
                <div className={styles.row}>
                    <div className={styles.label}>{getI18Text('--address--')}</div>
                    <div className={styles.value}>{convertAddressToString(props.taxDetail?.address?.address[0]) || '-'}</div>
                </div>
                <div className={styles.row}>
                    <div className={styles.label}>{getI18Text('--taxType--')}</div>
                    <div className={styles.value}>{getTaxKeyName(props.taxDetail?.type) || '-'}</div>
                </div>
            </div>}
          </div>
    </div>
    )
}

export function GetIdentityRow (props: { identity: VendorIdentificationNumber, t?: (key: string) => string }): JSX.Element {
    const [attributes, setAttributes] = useState<Array<{label: string, value: string}>>([])
    const [isExpanded, setIsExpanded] = useState(false)

    function getI18Text (key: string) {
      return props.t('--erpDetails--.' + key)
    }

    function onExpandIconClick () {
        setIsExpanded(!isExpanded)
    }

    useEffect(() => {
        if (props.identity) {
          const _highlights: Array<{label: string, value: string}> = []
          if (props.identity.validityStartDate && props.identity.validityEndDate) {
            _highlights.push({
              label: getI18Text('--validity--'),
              value: getDateRangeDisplayString(props.identity.validityStartDate, props.identity.validityEndDate)
            })
          }
          if (props.identity.country) {
            _highlights.push({
              label: getI18Text('--country--'),
              value: props.identity.country.name
            })
          }
          if (props.identity.region) {
            _highlights.push({
              label: getI18Text('--region--'),
              value: props.identity.region.name
            })
          }
          setAttributes(_highlights)
        }
      }, [props.identity])

    return(
        <div className={styles.section}>
            <div onClick={onExpandIconClick}>
              { !isExpanded && <ChevronRight size={20} color={"var(--warm-neutral-shade-300)"}/>}
              { isExpanded && <ChevronDown size={20} color={"var(--warm-neutral-shade-300)"}/>}
            </div>
            <div className={styles.content}>
                <div className={styles.row}>
                  <div>{`${getI18Text('--type--')}${props.identity?.identificationType?.name}`}</div>
                  <div className={styles.seperator}></div>
                  <div>{props.identity?.identificationNumber}</div>
                </div>
                <div className={styles.row}>
                    {
                        attributes.map((highlight, index) =>
                            <div className={styles.attribute} key={index}>
                                <div className={styles.attributeLabel}>{highlight.label}</div>
                                <div className={styles.attributeValue}>{highlight.value}</div>
                            </div>
                        )
                    }
                </div>
                {isExpanded && <div className={styles.row}>
                  <span className={styles.description}>{props.identity?.description}</span>
                </div>}
            </div>
        </div>
    )
}

export function SupplierVendorSapDetails (props: SupplierVendorSapDetailsProps) {
    const [vendors, setVendors] = useState<Array<Vendor>>([])
    const [filteredVendors, setFilteredVendors] = useState<Array<Vendor>>([])
    const [searchKeyWord, setSearchKeyWord] = useState<string>('')
    const [isRightPanelOpen, setIsRightPanelOpen] = useState<{isOpen: boolean, id: string, label: string }>({isOpen: false, id: '', label:'' })
    const [companyCode, setCompanyCode] = useState<VendorCompanyInfo>(null)
    const [purchasingOrganization, setPurchasingOrganization] = useState<VendorPurchaseOrgInfo>(null)
    const [formData, setFormData] = useState<CustomFormData | null>(null)
    const [formDefinition, setFormDefinition] = useState<CustomFormDefinition | null>(null)
    const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

    useEffect(() => {
      if (props.vendorRecords && props.vendorRecords.length) {
        const allVendors = props.vendorRecords.map(vendor => {
          return {...vendor, isExpanded: props.vendorRecords.length === 1 ? true : false}
        })
        setVendors(allVendors)
        setFilteredVendors(allVendors)
      }
    }, [props.vendorRecords])

    useEffect(() => {
        setFormData(props.formData)
    }, [props.formData])

    useEffect(() => {
        setFormDefinition(props.formDefinition)
    }, [props.formDefinition])

    function toggleRow (currentRow: Vendor) {
      const vendorCopy = filteredVendors.filter(vendor => {
        vendor.id === currentRow.id ? vendor.isExpanded = !vendor.isExpanded : vendor.isExpanded = false
        return vendor
      })
      setFilteredVendors(vendorCopy)
    }

    function getOtherEntities (entities: IDRef[]) {
        return entities && entities.length > 0 ? entities.map(entity => entity.name).join(', ') : '--'
    }

    function getClassificationRef (data: IDRef) {
      return data.id && data.name ? `${data.id} - ${data.name}` : data.id || data.name
    }

    function viewLocationOnMap (location: Location) {
        if (props.viewOnMap) {
            props.viewOnMap(location)
        }
    }

    function getCurrencies (currencies: IDRef[]) {
        return currencies && currencies.length > 0 ? currencies.map(currency => `${currency.name} (${currency.id})`).join(', ') : '--'
    }

    function handleKeywordSearch (e) {
        setSearchKeyWord(e.target.value)
        setFilteredVendors(vendors.filter(vendor => { return !e.target.value || vendor?.vendorId?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase()) || vendor?.name?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase()) }))
    }

    function handleComapnyCodeClick (companyCode: VendorCompanyInfo, id: string) {
        setCompanyCode(companyCode)
        if (props.fetchForm && id && companyCode?.companyCode?.id && companyCode?.questionnaireId?.formId) {
            props.fetchForm(id, companyCode?.companyCode?.id, '')
        }
    }

    function onCompanyCodeBackClick () {
        setCompanyCode(null)
        setIsRightPanelOpen({ isOpen: true, id: COMPANY_CODES, label: t('--erpDetails--.--companyCodes--') })
        setFormData(null)
        setFormDefinition(null)
    }

    function handlePurchasingOrgClick (purchasingOrg: VendorPurchaseOrgInfo, id: string) {
        setPurchasingOrganization(purchasingOrg)
        if (props.fetchForm && id && purchasingOrg?.purchaseOrg?.id && purchasingOrg?.questionnaireId?.formId) {
            props.fetchForm(id, '', purchasingOrg?.purchaseOrg?.id)
        }
    }

    function onPurchaseOrgBackClick () {
        setPurchasingOrganization(null)
        setIsRightPanelOpen({ isOpen: true, id: PURCHASING_ORGANIZATIONS, label: t('--erpDetails--.--purchasingOrganizations--') })
        setFormData(null)
        setFormDefinition(null)
    }

    function onRightPanelClose () {
        setIsRightPanelOpen({ isOpen: false, label: '', id: '' })
        setCompanyCode(null)
        setPurchasingOrganization(null)
        setFormData(null)
        setFormDefinition(null)
    }

    function getCompanyCodes (vendorCompanyInfos: Array<VendorCompanyInfo>): Array<string> {
        const companyCodes: Array<string> = []

        vendorCompanyInfos?.slice(0, 2)?.forEach((companyCode, index) => {
            companyCodes.push(`${companyCode?.companyCode?.id}${vendorCompanyInfos?.length !== index + 1 ? ',' : ''} `)
        })

        return companyCodes
    }

    function getVendorType (type: string) : string {
        if (VendorType.supplier == type) {
            return t('--erpDetails--.--supplier--')
        } else if (VendorType.partner == type) {
            return t('--erpDetails--.--partner--')
        } else {
            return type
        }
    }

    function getDisplayName (name: string, code: string) {
        if (name && code) {
          return `${name} (${code})`
        } else {
          return name || code
        }
    }

    return ( <>
        {
            vendors && vendors.length > 10 &&
            <div className={styles.detailsSearch}>
                <Search size={18} color='var(--warm-neutral-shade-400)'/>
                <input
                    placeholder={t('--erpDetails--.--vendorSearchPlaceholder--')}
                    value={searchKeyWord}
                    onChange={(e) => handleKeywordSearch(e)}
                />
            </div>
        }
        {filteredVendors && filteredVendors.length > 0 && filteredVendors.map((vendor, index) => {
            return (
                <>
                    {
                        !vendor.isExpanded &&
                        <div key={index} className={styles.sap} onClick={() => toggleRow(vendor)}>
                            <div className={styles.sapCnt}>
                                <div className={styles.sapCntLabel}>
                                    <div>{t('--erpDetails--.--vendorID--')} {vendor?.vendorId || '-'}</div>
                                    <div className={styles.sapCntLabelArrow}><ChevronDown size={18} color='var(--warm-neutral-shade-200)' /></div>
                                </div>
                                <div className={styles.sapCntAtr}>
                                    <div className={styles.sapCntAtrKey}>{t('--erpDetails--.--vendor_name--')}</div>
                                    <div className={styles.sapCntAtrValue}>{vendor?.name || '-'}</div>
                                </div>
                                <div className={styles.sapCntAtr}>
                                    <div className={styles.sapCntAtrKey}>{t('--erpDetails--.--company_code--')}</div>
                                    <div className={styles.sapCntAtrValue}>{getCompanyCodes(vendor?.vendorCompanyInfos)} {vendor?.vendorCompanyInfos?.length > 2 ? `+${vendor?.vendorCompanyInfos?.length - 2}more` : ''}</div>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        vendor.isExpanded &&
                        <div key={index} className={styles.sap}>
                            <div className={styles.sapCnt}>
                                <div className={styles.sapCntLabel} onClick={() => toggleRow(vendor)}>
                                    <div>{t('--erpDetails--.--vendorID--')} {vendor?.vendorId || '-'}</div>
                                    <div className={styles.sapCntLabelArrow}><ChevronUp size={18} color='var(--warm-neutral-shade-200)' /></div>
                                </div>

                                <div className={styles.sapCntBlock1}>
                                    <div className={styles.sapCntBlock1Row}>
                                        <div className={styles.sapCntBlock1RowKey}>{t('--erpDetails--.--vendorName--')}</div>
                                        <div className={styles.sapCntBlock1RowValue}>{vendor?.name || '-'}</div>
                                    </div>
                                    <div className={styles.sapCntBlock1Row}>
                                        <div className={styles.sapCntBlock1RowKey}>{t('--erpDetails--.--vendorType--')}</div>
                                        <div className={styles.sapCntBlock1RowValue}>{getVendorType(vendor?.vendorType) || '-'}</div>
                                    </div>
                                    <div className={styles.sapCntBlock1Row}>
                                        <div className={styles.sapCntBlock1RowKey}>{t('--erpDetails--.--businessPartner--')}</div>
                                        <div className={styles.sapCntBlock1RowValue}>{vendor?.vendorId || '-'}</div>
                                    </div>
                                    {(vendor.locations && vendor.locations?.length > 0) && <div className={styles.sapCntBlock1Row}>
                                        <div className={styles.sapCntBlock1RowKey}>{t('--erpDetails--.--address--')}</div>
                                        <div className={styles.sapCntBlock1RowValue}>{convertAddressToString(vendor.locations[0]?.address) || '-'}</div>
                                    </div>}
                                    {vendor.classificationRef && <div className={styles.sapCntBlock1Row}>
                                        <div className={styles.sapCntBlock1RowKey}>{t('--erpDetails--.--industryCodes--')}</div>
                                        <div className={styles.sapCntBlock1RowValue}>{getClassificationRef(vendor.classificationRef)}</div>
                                    </div>}
                                    {vendor.enabledSystems && vendor.enabledSystems.length > 0 && <div className={styles.sapCntBlock1Row}>
                                        <div className={styles.sapCntBlock1RowKey}>{t('--erpDetails--.--enableFor--')}</div>
                                        <div className={styles.sapCntBlock1RowValue}>{getOtherEntities(vendor.enabledSystems)}</div>
                                    </div>}
                                </div>

                                {
                                    vendor?.vendorCompanyInfos?.length > 0 &&
                                    <div className={styles.sapCntBlock2}>
                                        {/* <div className={styles.sapCntBlock2Label}>{t('--erpDetails--.--companyCodes--')}</div> */}
                                        <div className={styles.headerContainer}>
                                           {t('--erpDetails--.--companyCodes--')}
                                           <div className={styles.badge}>{vendor?.vendorCompanyInfos?.length}</div>
                                           {
                                            vendor?.vendorCompanyInfos?.length > 2 &&
                                              <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, id: COMPANY_CODES, label: t('--erpDetails--.--companyCodes--') })}>
                                                {t('--viewAll--')} <ChevronRight size={16} color={"var(--warm-prime-azure)"}/>
                                              </div>
                                            }
                                        </div>
                                        {
                                            vendor?.vendorCompanyInfos?.slice(0, 2).map((item, index) => {
                                                return <div key={index} className={styles.sapCntBlock2Wrp} onClick={() => { handleComapnyCodeClick(item, vendor?.id); setIsRightPanelOpen({ isOpen: true, id: COMPANY_CODES, label: t('--erpDetails--.--companyCodes--') }) }}>
                                                    <div className={styles.sapCntBlock2WrpRow}>
                                                        <div className={styles.sapCntBlock2WrpRowLabel}>{getDisplayName(item?.companyCode?.name, item?.companyCode?.erpId || item?.companyCode?.id)}</div>
                                                        {
                                                            item?.blockStatuses && item.blockStatuses?.length > 0 && item.blockStatuses.map((_status, index) => {
                                                                return (
                                                                  <div className={styles.sapCntBlock2WrpRowTag} key={index}>
                                                                    <span>{getBlockedERPStatuses(_status, t)}</span>
                                                                  </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className={styles.sapCntBlock2WrpRow}>
                                                        {item?.accountCode?.id && <div className={styles.sapCntBlock2WrpRowPair}>
                                                            <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--reconciliation_account--')}</div>
                                                            <div className={styles.sapCntBlock2WrpRowPairValue}>{item?.accountCode?.id}</div>
                                                        </div>}
                                                        <div className={styles.sapCntBlock2WrpRowPair}>
                                                            <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--payment_terms--')}</div>
                                                            <div className={styles.sapCntBlock2WrpRowPairValue}>{getDisplayName(item?.paymentTerm?.name, item?.paymentTerm?.id || item?.paymentTerm?.erpId)}</div>
                                                        </div>
                                                        {item?.alternatePayees && item.alternatePayees.length > 0 && <div className={styles.sapCntBlock2WrpRowPair}>
                                                            <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--alternatePayee--')}</div>
                                                            <div className={styles.sapCntBlock2WrpRowPairValue}>{item?.alternatePayees[0].vendorId || '-'}</div>
                                                        </div>}
                                                    </div>
                                                    <div></div>
                                                </div>
                                            })
                                        }
                                        {/* {
                                            vendor?.vendorCompanyInfos?.length > 2 &&
                                            <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, label: COMPANY_CODES })}>+{vendor?.vendorCompanyInfos.length - 2} {t('--more--')}</div>
                                        } */}
                                    </div>
                                }

                                {
                                    vendor?.vendorPurchaseOrgInfo?.length > 0 &&
                                    <div className={styles.sapCntBlock2}>
                                        {/* <div className={styles.sapCntBlock2Label}>{t('--erpDetails--.--purchasingOrganizations--')}</div> */}
                                        <div className={styles.headerContainer}>
                                           {t('--erpDetails--.--purchasingOrganizations--')}
                                           <div className={styles.badge}>{vendor?.vendorPurchaseOrgInfo?.length}</div>
                                           {
                                            vendor?.vendorPurchaseOrgInfo.length > 2 &&
                                                <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, id: PURCHASING_ORGANIZATIONS, label: t('--erpDetails--.--purchasingOrganizations--') })}>
                                                 {t('--viewAll--')} <ChevronRight size={16} color={"var(--warm-prime-azure)"}/>
                                                </div>
                                            }
                                        </div>
                                        {
                                            vendor?.vendorPurchaseOrgInfo?.slice(0, 2).map((item, index) => {
                                                return <div key={index} className={styles.sapCntBlock2Wrp} onClick={() => { handlePurchasingOrgClick(item, vendor?.id); setIsRightPanelOpen({ isOpen: true, id: PURCHASING_ORGANIZATIONS, label: t('--erpDetails--.--purchasingOrganizations--') }) }}>
                                                    <div className={styles.sapCntBlock2WrpRow}>
                                                        <div className={styles.sapCntBlock2WrpRowLabel}>{getDisplayName(item?.purchaseOrg?.name, item?.purchaseOrg?.erpId || item?.purchaseOrg?.id)}</div>
                                                        {
                                                            item?.blockStatuses && item.blockStatuses?.length > 0 && item.blockStatuses.map((_status, index) => {
                                                                return (
                                                                  <div className={styles.sapCntBlock2WrpRowTag} key={index}>
                                                                    <span>{getBlockedERPStatuses(_status, t)}</span>
                                                                  </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className={styles.sapCntBlock2WrpRow}>
                                                        {item?.incoTerms?.length > 0 && <div className={styles.sapCntBlock2WrpRowPair}>
                                                            <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--incoTerms--')}</div>
                                                            <div className={styles.sapCntBlock2WrpRowPairValue}>{getIncoTermDisplayName(item.incoTerms, props.incoTermOption)}</div>
                                                        </div>}
                                                        <div className={styles.sapCntBlock2WrpRowPair}>
                                                            <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--order_currency--')}</div>
                                                            <div className={styles.sapCntBlock2WrpRowPairValue}>{item?.currencies?.length > 0 ? item?.currencies[0] : '-'}</div>
                                                        </div>
                                                        <div className={styles.sapCntBlock2WrpRowPair}>
                                                            <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--payment_terms--')}</div>
                                                            <div className={styles.sapCntBlock2WrpRowPairValue}>{getDisplayName(item?.paymentTerm?.name, item?.paymentTerm?.id || item?.paymentTerm?.erpId)}</div>
                                                        </div>
                                                    </div>
                                                    <div></div>
                                                </div>
                                            })
                                        }
                                        {/* {
                                            vendor?.vendorPurchaseOrgInfo.length > 2 &&
                                            <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, label: PURCHASING_ORGANIZATIONS })}>+{vendor?.vendorPurchaseOrgInfo.length - 2} {t('more')}</div>
                                        } */}
                                    </div>
                                }

                                {
                                    vendor?.bankAccounts && vendor?.bankAccounts?.length > 0 &&
                                    <div className={styles.sapCntBlock3}>
                                        {/* <div className={styles.sapCntBlock2Label}>{t('--erpDetails--.--paymentDetails--')}</div> */}
                                        <div className={styles.headerContainer}>
                                           {t('--erpDetails--.--paymentDetails--')}
                                           <div className={styles.badge}>{vendor?.bankAccounts?.length}</div>
                                           {
                                              vendor?.bankAccounts.length > 2 &&
                                                <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, id: BANK_INFO, label: t('--erpDetails--.--paymentDetails--') })}>
                                                  {t('--viewAll--')} <ChevronRight size={16} color={"var(--warm-prime-azure)"}/>
                                                </div>
                                            }
                                        </div>
                                        {
                                            vendor.bankAccounts.slice(0, 2).map((account, index) => {
                                                return <GetBankInfoRow key={index} account={account} bankKeys={props.bankKeys} t={t}/>
                                            })
                                        }
                                    </div>
                                }

                                {
                                    vendor?.taxes && vendor?.taxes?.length > 0 &&
                                    <div className={styles.sapCntBlock3}>
                                        {/* <div className={styles.sapCntBlock2Label}>{t('--erpDetails--.--taxDetails--')}</div> */}
                                        <div className={styles.headerContainer}>
                                           {t('--erpDetails--.--taxDetails--')}
                                           <div className={styles.badge}>{vendor?.taxes?.length}</div>
                                           {
                                              vendor?.taxes.length > 2 &&
                                                <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, id: TAX_INFO, label: t('--erpDetails--.--taxDetails--') })}>
                                                 {t('--viewAll--')} <ChevronRight size={16} color={"var(--warm-prime-azure)"}/>
                                                </div>
                                            }
                                        </div>
                                        {
                                            vendor?.taxes?.slice(0, 2).map((tax, key) => {
                                                return <GetTaxDetailRow key={key} taxDetail={tax} taxKeys={props.taxKeys} t={t}/>
                                            })
                                        }
                                    </div>
                                }

                                {
                                    vendor?.vendorIdentificationNumbers && vendor?.vendorIdentificationNumbers?.length > 0 &&
                                    <div className={styles.sapCntBlock3}>
                                        {/* <div className={styles.sapCntBlock2Label}>{t('--erpDetails--.--identificationNumbers--')}</div> */}
                                        <div className={styles.headerContainer}>
                                           {t('--erpDetails--.--identificationNumbers--')}
                                           <div className={styles.badge}>{vendor?.vendorIdentificationNumbers?.length}</div>
                                           {
                                              vendor?.vendorIdentificationNumbers.length > 2 &&
                                                <div className={styles.sapCntBlock2Link} onClick={() => setIsRightPanelOpen({ isOpen: true, id: IDENTIFIERS, label: t('--erpDetails--.--identificationNumbers--') })}>
                                                 {t('--viewAll--')} <ChevronRight size={16} color={"var(--warm-prime-azure)"}/>
                                                </div>
                                            }
                                        </div>
                                        {
                                            vendor?.vendorIdentificationNumbers?.slice(0, 2).map((identity, key) => {
                                                return <GetIdentityRow key={key} identity={identity} t={t}/>
                                            })
                                        }
                                    </div>
                                }

                                <VendorHeaderExtensionForm
                                  vendor={vendor}
                                  options={props.options}
                                  events={props.events}
                                  dataFetchers={props.dataFetchers}
                                  fetchVendorExtensionCustomFormDefinition={props.fetchVendorExtensionCustomFormDefinition}
                                  fetchVendorExtensionCustomFormData={props.fetchVendorExtensionCustomFormData}
                                  t={t}
                                />
                            </div>

                            <PortalPanelDialog isOpen={isRightPanelOpen.isOpen} alwaysShowOverlay={true} expanded={true}>
                                <div className={styles.sapRpan}>
                                    {
                                        (!companyCode && !purchasingOrganization) &&
                                        <div className={styles.sapRpanHeader}>
                                            <div className={styles.sapRpanHeaderLabel}><span>{isRightPanelOpen.label}</span></div>
                                            <div className={styles.sapRpanHeaderX} onClick={onRightPanelClose}><X size={16} color='var(--warm-neutral-shade-200)' cursor='pointer'/></div>
                                        </div>
                                    }

                                    {
                                        isRightPanelOpen.id === COMPANY_CODES && !companyCode &&
                                        <div className={styles.sapRpanCodes}>
                                            {
                                                vendor?.vendorCompanyInfos.map((item, index) => {
                                                    return <div key={index} className={styles.sapRpanCodesWrp} onClick={() => handleComapnyCodeClick(item, vendor?.id)}>
                                                        <div className={styles.sapRpanCodesWrpRow}>
                                                            <div className={styles.sapRpanCodesWrpRowLabel}>{getDisplayName(item?.companyCode?.name, item?.companyCode?.erpId || item?.companyCode?.id)}</div>
                                                            {
                                                                item?.blockStatuses && item.blockStatuses?.length > 0 && item.blockStatuses.map((_status, index) => {
                                                                    return (
                                                                    <div className={styles.sapRpanCodesWrpRowTag} key={index}>
                                                                        <span>{getBlockedERPStatuses(_status, t)}</span>
                                                                    </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div className={styles.sapRpanCodesWrpRow}>
                                                            {item?.accountCode?.id && <div className={styles.sapRpanCodesWrpRowPair}>
                                                                <div className={styles.sapRpanCodesWrpRowPairKey}>{t('--erpDetails--.--reconciliation_account--')}</div>
                                                                <div className={styles.sapRpanCodesWrpRowPairValue}>{item?.accountCode?.id}</div>
                                                            </div>}
                                                            <div className={styles.sapRpanCodesWrpRowPair}>
                                                                <div className={styles.sapRpanCodesWrpRowPairKey}>{t('--erpDetails--.--payment_terms--')}</div>
                                                                <div className={styles.sapRpanCodesWrpRowPairValue}>{getDisplayName(item?.paymentTerm?.name, item?.paymentTerm?.id || item?.paymentTerm?.erpId)}</div>
                                                            </div>
                                                            {item?.alternatePayees && item.alternatePayees.length > 0 && <div className={styles.sapCntBlock2WrpRowPair}>
                                                              <div className={styles.sapCntBlock2WrpRowPairKey}>{t('--erpDetails--.--alternatePayee--')}</div>
                                                              <div className={styles.sapCntBlock2WrpRowPairValue}>{item?.alternatePayees[0].vendorId || '-'}</div>
                                                        </div>}
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }

                                    {
                                        companyCode &&
                                        <>
                                            <div className={styles.sapRpanHeader}>
                                                <div className={styles.sapRpanHeaderLabel}>
                                                    <ChevronLeft size={16} color='var(--warm-neutral-shade-200)' cursor='pointer' onClick={onCompanyCodeBackClick}/>
                                                    <span>{getDisplayName(companyCode?.companyCode?.name, companyCode?.companyCode?.erpId || companyCode?.companyCode?.id)}</span>
                                                    {
                                                        companyCode?.blockStatuses && companyCode.blockStatuses?.length > 0 && companyCode.blockStatuses.map((_status, index) => {
                                                            return (
                                                            <div className={styles.tag} key={index}>
                                                                <span>{getBlockedERPStatuses(_status, t)}</span>
                                                            </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className={styles.sapRpanHeaderX} onClick={onRightPanelClose}><X size={16} color='var(--warm-neutral-shade-200)' cursor='pointer'/></div>
                                            </div>
                                            {
                                                formData && formDefinition &&
                                                <div className={styles.sapRpanBody}>
                                                    <FormDefinitionReadOnlyView
                                                      locale={getSessionLocale()}
                                                      formData={formData}
                                                      formDefinition={formDefinition}
                                                      loadDocument={props.dataFetchers?.getDocumentByName}
                                                      loadCustomerDocument={props.events?.loadCustomerDocument}
                                                      documentType={props.options?.documentType}
                                                      draftDocuments={props.options?.draftDocuments}
                                                      signedDocuments={props.options?.signedDocuments}
                                                      finalisedDocuments={props.options?.finalisedDocuments}
                                                      getDoucumentByUrl={props.dataFetchers?.getDoucumentByUrl}
                                                      getDoucumentUrlById={props.dataFetchers?.getDoucumentUrlById}
                                                      triggerLegalDocumentFetch={props.events?.triggerLegalDocumentFetch}
                                                      options={props.options}
                                                      isSingleColumnLayout={props.options?.isSingleColumnLayout || false}
                                                      canShowTranslation={props.options?.canShowTranslation || undefined}
                                                      fetchExtensionCustomFormDefinition={props.events?.fetchExtensionCustomFormDefinition}
                                                      fetchExtensionCustomFormLocalLabels={props.events?.fetchExtensionCustomFormLocalLabels}/>
                                                </div>
                                            }
                                        </>
                                    }

                                    {
                                        isRightPanelOpen.id === PURCHASING_ORGANIZATIONS && !purchasingOrganization &&
                                        <div className={styles.sapRpanCodes}>
                                            {
                                                vendor?.vendorPurchaseOrgInfo.map((item, index) => {
                                                    return <div key={index} className={styles.sapRpanCodesWrp} onClick={() => handlePurchasingOrgClick(item, vendor?.id)}>
                                                        <div className={styles.sapRpanCodesWrpRow}>
                                                            <div className={styles.sapRpanCodesWrpRowLabel}>{getDisplayName(item?.purchaseOrg?.name, item?.purchaseOrg?.erpId || item?.purchaseOrg?.id)}</div>
                                                            {
                                                                item?.blockStatuses && item.blockStatuses?.length > 0 && item.blockStatuses.map((_status, index) => {
                                                                    return (
                                                                      <div className={styles.sapRpanCodesWrpRowTag} key={index}>
                                                                        <span>{getBlockedERPStatuses(_status, t)}</span>
                                                                      </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div className={styles.sapRpanCodesWrpRow}>
                                                            {item?.incoTerms?.length > 0 && <div className={styles.sapRpanCodesWrpRowPair}>
                                                                <div className={styles.sapRpanCodesWrpRowPairKey}>{t('--erpDetails--.--incoTerms--')}</div>
                                                                <div className={styles.sapRpanCodesWrpRowPairValue}>{getIncoTermDisplayName(item.incoTerms, props.incoTermOption)}</div>
                                                            </div>}
                                                            <div className={styles.sapRpanCodesWrpRowPair}>
                                                                <div className={styles.sapRpanCodesWrpRowPairKey}>{t('--erpDetails--.--order_currency--')}</div>
                                                                <div className={styles.sapRpanCodesWrpRowPairValue}>{item?.currencies?.length > 0 ? item?.currencies?.[0] : '-'}</div>
                                                            </div>
                                                            <div className={styles.sapRpanCodesWrpRowPair}>
                                                                <div className={styles.sapRpanCodesWrpRowPairKey}>{t('--erpDetails--.--payment_terms--')}</div>
                                                                <div className={styles.sapRpanCodesWrpRowPairValue}>{getDisplayName(item?.paymentTerm?.name, item?.paymentTerm?.id || item?.paymentTerm?.erpId)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }

                                    {
                                        purchasingOrganization &&
                                        <>
                                            <div className={styles.sapRpanHeader}>
                                                <div className={styles.sapRpanHeaderLabel}>
                                                    <ChevronLeft size={16} color='var(--warm-neutral-shade-200)' cursor='pointer' onClick={onPurchaseOrgBackClick}/>
                                                    <span>{getDisplayName(purchasingOrganization?.purchaseOrg?.name, purchasingOrganization?.purchaseOrg?.erpId || purchasingOrganization?.purchaseOrg?.id)}</span>
                                                    {
                                                        purchasingOrganization?.blockStatuses && purchasingOrganization.blockStatuses?.length > 0 && purchasingOrganization.blockStatuses.map((_status, index) => {
                                                            return (
                                                              <div className={styles.tag} key={index}>
                                                                <span>{getBlockedERPStatuses(_status, t)}</span>
                                                              </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className={styles.sapRpanHeaderX} onClick={onRightPanelClose}><X size={16} color='var(--warm-neutral-shade-200)' cursor='pointer'/></div>
                                            </div>

                                            {
                                                purchasingOrganization.partners && purchasingOrganization.partners.length > 0 &&
                                                <div className={styles.rightPanelSection}>
                                                    <div className={styles.title}>{t('--erpDetails--.--partnerFunctions--')}</div>
                                                    {
                                                        purchasingOrganization.partners.map((partner, index) => {
                                                            return (
                                                                <div className={styles.sapRpanBodyContainer} key={index}>
                                                                  <div className={styles.function}>{partner.function?.name}</div>
                                                                  {(partner.function?.name && partner.ref?.vendorId) && <div className={styles.seperator}></div>}
                                                                  <div className={styles.value}>{partner.ref?.vendorId}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }

                                            {
                                                formData && formDefinition &&
                                                <div className={styles.sapRpanBody}>
                                                    <FormDefinitionReadOnlyView 
                                                      locale={getSessionLocale()}
                                                      formData={formData}
                                                      formDefinition={formDefinition}
                                                      loadCustomerDocument={props.events?.loadCustomerDocument}
                                                      documentType={props.options?.documentType}
                                                      draftDocuments={props.options?.draftDocuments}
                                                      signedDocuments={props.options?.signedDocuments}
                                                      finalisedDocuments={props.options?.finalisedDocuments}
                                                      getDoucumentByUrl={props.dataFetchers?.getDoucumentByUrl}
                                                      getDoucumentUrlById={props.dataFetchers?.getDoucumentUrlById}
                                                      triggerLegalDocumentFetch={props.events?.triggerLegalDocumentFetch}
                                                      options={props.options}
                                                      isSingleColumnLayout={props.options?.isSingleColumnLayout || false}
                                                      canShowTranslation={props.options?.canShowTranslation || undefined}
                                                      fetchExtensionCustomFormDefinition={props.events?.fetchExtensionCustomFormDefinition}
                                                      fetchExtensionCustomFormLocalLabels={props.events?.fetchExtensionCustomFormLocalLabels}/>
                                                </div>
                                            }
                                        </>
                                    }

                                    {
                                       isRightPanelOpen.id === BANK_INFO && <div className={styles.sapRpanCodes}>
                                         {
                                            vendor?.bankAccounts.map((item, index) => {
                                                return (
                                                    <GetBankInfoRow key={index} account={item} bankKeys={props.bankKeys} t={t}/>
                                                )
                                            })
                                         }
                                       </div>
                                    }

                                    {
                                       isRightPanelOpen.id === TAX_INFO && <div className={styles.sapRpanCodes}>
                                         {
                                            vendor?.taxes.map((item, index) => {
                                                return (
                                                  <GetTaxDetailRow key={index} taxDetail={item} taxKeys={props.taxKeys} t={t}/>
                                                )
                                            })
                                         }
                                       </div>
                                    }

                                    {
                                       isRightPanelOpen.id === IDENTIFIERS && <div className={styles.sapRpanCodes}>
                                         {
                                            vendor?.vendorIdentificationNumbers.map((item, index) => {
                                                return (
                                                  <GetIdentityRow key={index} identity={item} t={t}/>
                                                )
                                            })
                                         }
                                       </div>
                                    }
                                </div>
                            </PortalPanelDialog>
                        </div>
                    }
                </>
            )
        })}
    </>)
}
