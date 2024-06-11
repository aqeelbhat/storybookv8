
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { ChevronDown, ChevronUp, Search } from "react-feather";
import { convertAddressToString } from "../../Form";
import { BankInfo, Vendor, Location, IDRef } from "../../Types";
import styles from './styles.module.scss';
import { getFormattedDateString } from "../../util";
import ViewOnMap from '../../Form/assets/ViewOnMap.png'

export interface SupplierVendorDetailsProps {
  vendorRecords: Array<Vendor>
  viewOnMap: (location: Location) => void
}

export interface BankInformationProps {
    bankAccounts: Array<BankInfo>
}

export interface PurchaseLocationDetailsProps {
    locations: Array<Location>
    showOtherLocations?: boolean
    viewMap?: (location: Location) => void
}

export function PurchaseLocationDetails (props: PurchaseLocationDetailsProps) {
    const [filteredLocations, setFilteredLocations] = useState<Array<Location>>([])

    useEffect(() => {
        if (props.locations && props.locations.length) {
          let locations: Location[] = []
          if (props.showOtherLocations) {
            locations = props.locations.filter((location) => {
                return !(location.billing || location.shipping)
            })
          } else {
            locations = props.locations.filter((location) => {
                return location.billing || location.shipping
            })
          }
          setFilteredLocations(locations)
        }
    }, [props.locations])

    function viewLocation (location: Location) {
        if (props.viewMap) {
         props.viewMap(location)
        }
    }

    return (<>
        {filteredLocations && filteredLocations.length > 0 && <>
            <div className={styles.detailsSectionTitle}>
                {!props.showOtherLocations ? `Purchasing details` : `Addresses`}
            </div>
            { filteredLocations.map((location, index) => {
                return (<div key={index} className={styles.purchaseDetails}>
                    <div className={classnames(styles.card, styles.row)}>
                        <div className={styles.cardTitle}>
                            {location.billing ? 'Invoicing' : location.shipping ? 'Ordering' : ''}
                        </div>
                        {location.address &&
                        <div className={styles.cardTerms}>
                            <span className={styles.value}>{convertAddressToString(location.address)}</span>
                        </div>}
                    </div>
                    <div className={styles.imageContainer} onClick={() => viewLocation(location)}>
                        <img src={ViewOnMap} />
                        <span className={styles.text}>View on map</span>
                    </div>
                </div>)
              })
            }
        </>}
    </>)
}

export function BankInformation (props: BankInformationProps) {

    function getCurrencyDisplay (currency: IDRef) {
        return currency ? `${currency.name} (${currency.id})` : '--'
    }

    return (<>
        <div className={styles.detailsSectionTitle}>
          Bank information
        </div>
        {props.bankAccounts.map((account, index) => {
            return (
                <div key={index} className={styles.card}>
                    <div className={styles.cardRow}>
                        <div className={styles.item}>
                           <span className={styles.label}>Account name</span>
                           <span className={styles.bankName}>{account.accountHolder || '--'}</span>
                        </div>
                        {account.created &&
                        <div className={styles.label}>
                           Created on - {getFormattedDateString(account.created)}
                        </div>}
                    </div>
                    <div className={styles.bankDetailsContainer}>
                        <div className={styles.cardBankDetails}>
                            <div className={styles.rowContainer}>
                                <div className={styles.item}>
                                    <span className={styles.label}>Account number</span>
                                    <span className={styles.value}>{account.accountNumber?.maskedValue || '--'}</span>
                                </div>
                                <div className={styles.item}>
                                    <span className={styles.label}>Currency</span>
                                    <span className={styles.value}>{getCurrencyDisplay(account?.currencyCode)}</span>
                                </div>
                            </div>
                            <div className={styles.item}>
                               <span className={styles.label}>Company address</span>
                               <span className={styles.value}>{convertAddressToString(account.accountHolderAddress) || '--'}</span>
                            </div>
                        </div>
                        <div className={styles.cardRightContainer}>
                            <div className={classnames(styles.cardBankDetails,styles.row)}>
                                <div className={classnames(styles.item)}>
                                    <span className={styles.label}>Bank</span>
                                    <span className={styles.value}>{account.bankName || '--'}</span>
                                </div>
                                {account.key === 'swift' &&
                                <div className={styles.item}>
                                    <span className={styles.label}>Swift code</span>
                                    <span className={styles.value}>{account.bankCode || '--'}</span>
                                </div>}
                            </div>
                            <div className={styles.mrgLft}>
                                <div className={styles.item}>
                                    <span className={styles.label}>Bank address</span>
                                    <span className={styles.value}>{convertAddressToString(account.bankAddress) || '--'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
      </>)
}

export function SupplierVendorDetailsNew (props: SupplierVendorDetailsProps) {
    const [vendors, setVendors] = useState<Array<Vendor>>([])
    const [filteredVendors, setFilteredVendors] = useState<Array<Vendor>>([])
    const [selectedVendor, setSelectedVendor] = useState<Vendor>(null)
    const [searchInput, setSearchInput] = useState<string>('')

    useEffect(() => {
      if (props.vendorRecords && props.vendorRecords.length) {
        const allVendors = props.vendorRecords.map(vendor => {
          return {...vendor, isExpanded: props.vendorRecords.length === 1 ? true : false}
        })
        allVendors?.length > 0 && setSelectedVendor(allVendors[0])
        setVendors(allVendors)
        setFilteredVendors(allVendors)
      }
    }, [props.vendorRecords])

    function getOtherEntities (entities: IDRef[]) {
        return entities && entities.length > 0 ? entities.map(entity => entity.name).join(', ') : '--'
    }

    function viewLocationOnMap (location: Location) {
        if (props.viewOnMap) {
            props.viewOnMap(location)
        }
    }

    function getCurrencies (currencies: IDRef[]) {
        return currencies && currencies.length > 0 ? currencies.map(currency => `${currency.name} (${currency.id})`).join(', ') : '--'
    }

    function handleSearch (e) {
        setSearchInput(e.target.value)
        setFilteredVendors(vendors.filter(vendor => { return !e.target.value || vendor?.vendorId?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase()) }))
    }

    return ( <>
        <div className={styles.detailsNew}>
            <div className={styles.detailsNewList}>
                <div className={styles.detailsNewListLabel}>Vendor IDs</div>
                <div className={styles.detailsNewListSearch}>
                    <Search size={16} color="var(--warm-neutral-shade-100)"/>
                    <input
                        placeholder='Search by ID'
                        value={searchInput}
                        onChange={handleSearch}
                    />
                </div>
                <div className={styles.detailsNewListIds}>
                    {
                        filteredVendors && filteredVendors.length > 0 && filteredVendors.map((vendor, index) => {
                            return (
                                <div key={index} className={selectedVendor?.id === vendor?.id ? `${styles.detailsNewListIdsId} ${styles.detailsNewListIdsSelected}` : styles.detailsNewListIdsId} onClick={() => setSelectedVendor(vendor)}>
                                    <div className={styles.detailsNewListIdsIdNum}>{index + 1}.</div>
                                    <div className={styles.detailsNewListIdsIdDetails}>
                                        <div className={styles.detailsNewListIdsIdDetailsId}>{vendor?.vendorId || '--'}</div>
                                        <div className={styles.detailsNewListIdsIdDetailsHighlights}>
                                            {vendor.companyEntityRef && <span className={styles.detailsNewListIdsIdDetailsHighlightsEntities}>Company entity: <span className={styles.text}>{vendor.companyEntityRef?.name || '--'}</span></span>}
                                            {vendor.additionalCompanyEntities && vendor.additionalCompanyEntities.length > 0 && <span className={styles.detailsNewListIdsIdDetailsHighlightsEntities}>Other entities: <span className={styles.text}>{getOtherEntities(vendor.additionalCompanyEntities)}</span></span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
            {
                selectedVendor &&
                <div className={styles.detailsNewDetails}>
                    <div className={styles.detailsList}>
                    <div className={styles.detailsContainer}>
                        <div>
                            <div className={styles.detailsContainerRow}>
                                <div className={styles.detailsContainerRowExpandedItemTitle}>
                                    Vendor ID: {selectedVendor?.vendorId || '--'}
                                </div>
                                <div className={styles.name}>Vendor name: {selectedVendor?.name || '--'}</div>
                            </div>

                            <div className={styles.detailsContainerRowExpandedItem}>
                                <div className={styles.highlights}>
                                    {selectedVendor.companyEntityRef && <div className={styles.highlightsItem}>
                                        <span className={styles.label}>Company entity</span><span className={styles.text}>{selectedVendor.companyEntityRef?.name || '--'}</span>
                                    </div>}
                                    <div className={styles.highlightsItem}>
                                        <span className={classnames(styles.label, styles.mrgLft)}>Other entities</span>
                                        <span className={classnames(styles.text, styles.mrgLft)}>{getOtherEntities(selectedVendor.additionalCompanyEntities)}</span>
                                    </div>
                                </div>
                                <div className={classnames(styles.highlights, styles.currency)}>
                                    <div className={classnames(styles.highlightsItem, styles.currencyItem)}>
                                        <span className={styles.label}>Currencies</span><span className={styles.text}>{getCurrencies(selectedVendor.currencyRefs)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.detailsSection}>
                        { selectedVendor.bankAccounts && selectedVendor.bankAccounts.length > 0 &&
                        <BankInformation bankAccounts={selectedVendor.bankAccounts}/>
                        }
                        { selectedVendor.additionalCompanyEntities && selectedVendor.additionalCompanyEntities.length > 0 &&
                        <>
                            <div className={styles.detailsSectionTitle}>
                            Company entities
                            </div>

                            { selectedVendor.additionalCompanyEntities.map((entity, index) => {
                                return (
                                    <div key={index} className={styles.card}>
                                    <div className={styles.cardTitle}>
                                        {entity.name}
                                    </div>
                                    {selectedVendor.terms && selectedVendor.terms.paymentTermRef &&
                                    <div className={styles.cardTerms}>
                                        <span className={styles.label}>Payment terms:</span>
                                        <span className={styles.value}>{selectedVendor.terms.paymentTermRef.name || '--'}</span>
                                    </div>}
                                    </div>
                                )
                            }) }
                        </>
                        }
                        { selectedVendor.locations && selectedVendor.locations.length > 0 &&
                            <PurchaseLocationDetails locations={selectedVendor.locations} viewMap={viewLocationOnMap}/>
                        }
                        { selectedVendor.locations && selectedVendor.locations.length > 0 &&
                            <PurchaseLocationDetails locations={selectedVendor.locations} viewMap={viewLocationOnMap} showOtherLocations={true}/>
                        }
                    </div>
                    </div>
                </div>
            }
        </div>
    </>)
}
