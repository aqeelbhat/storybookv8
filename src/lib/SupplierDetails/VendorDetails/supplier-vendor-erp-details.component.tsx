
import React, { ReactNode, useEffect, useState } from "react";
import classnames from "classnames";
import { ChevronDown, ChevronUp, Edit3, Search } from "react-feather";
import { DocumentRef, convertAddressToString } from "../../Form";
import { Vendor, Location, IDRef, Attachment } from "../../Types";
import styles from './styles.module.scss';
import { checkURLContainsProtcol } from "../../util";
import ViewOnMap from '../../Form/assets/ViewOnMap.png'
import { GetBankInfoRow, GetTaxDetailRow } from "./supplier-vendor-erp-sap-details.component";
import { CustomFormData, CustomFormDefinition, CustomFormModelValue, FormDefinitionReadOnlyView } from "../../CustomFormDefinition";
import { BankInformationProps, PurchaseLocationDetailsProps, SupplierVendorDetailsProps, VendorExtensionProps } from "./type";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { getSessionLocale } from "../../sessionStorage";
import { OroButton } from "../../controls";
import { CustomFormExtension } from "../../CustomFormDefinition/CustomFormExtension/Index";

export function PurchaseLocationDetails (props: PurchaseLocationDetailsProps) {
    const [filteredLocations, setFilteredLocations] = useState<Array<Location>>([])

    function getI18Text (key: string) {
      return props.t('--erpDetails--.' + key)
    }

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
                {!props.showOtherLocations ? getI18Text('--purchasingDetails--') : getI18Text('--addresses--') }
            </div>
            { filteredLocations.map((location, index) => {
                return (<div key={index} className={styles.purchaseDetails}>
                    <div className={classnames(styles.card, styles.row)}>
                        <div className={styles.cardTitle}>
                            {location.billing ? getI18Text('--invoicing--') : location.shipping ? getI18Text('--ordering--') : ''}
                        </div>
                        {location.address &&
                        <div className={styles.cardTerms}>
                            <span className={styles.value}>{convertAddressToString(location.address)}</span>
                        </div>}
                    </div>
                    <div className={styles.imageContainer} onClick={() => viewLocation(location)}>
                        <img src={ViewOnMap} />
                        <span className={styles.text}>{getI18Text('--viewOnMap--')}</span>
                    </div>
                </div>)
              })
            }
        </>}
    </>)
}

// export function GetBankInfoRow (props: { account: BankInfo, t?: (key: string) => string }): JSX.Element {
//     const [isOpen, setIsOpen] = useState<boolean>(false)

//     function getI18Text (key: string) {
//       return props.t('--erpDetails--.' + key)
//     }

//     return(
//         <div className={styles.bank} onClick={() => setIsOpen(!isOpen)}>
//             <div className={styles.bankInfo}>
//                 <div className={styles.bankInfoRow}>
//                     <div className={styles.bankInfoRowName}>{props.account?.bankName || '--'}{props.account?.bankAddress?.alpha2CountryCode ? `, ${mapAlpha2codeToDisplayName(props.account?.bankAddress?.alpha2CountryCode)}` : ''}</div>
//                     <div className={styles.bankInfoRowNum}>
//                         <div className={styles.bankInfoRowNumLabel}>{getI18Text('--account_number--')}</div>
//                         <div className={styles.bankInfoRowNumValue}>{props.account?.accountNumber?.maskedValue || '--'}</div>
//                     </div>
//                 </div>
//                 {
//                     !isOpen && <div><ChevronDown size={18} color='var(--warm-neutral-shade-300)' /></div>
//                 }
//                 {
//                     isOpen && <div><ChevronUp size={18} color='var(--warm-neutral-shade-300)' /></div>
//                 }
//             </div>
//             {
//                 isOpen &&
//                 <div className={styles.bankDetail}>
//                     <div className={styles.bankDetailRow}>
//                         <div className={styles.label}>{getI18Text('--bankName--')}</div>
//                         <div className={styles.value}>{props.account?.bankName || '--'}</div>
//                     </div>
//                     <div className={styles.bankDetailRow}>
//                         <div className={styles.label}>{getI18Text('--bankCountry--')}</div>
//                         <div className={styles.value}>{props.account?.bankAddress?.alpha2CountryCode ? `${mapAlpha2codeToDisplayName(props.account?.bankAddress?.alpha2CountryCode)}` : '--'}</div>
//                     </div>
//                     <div className={styles.bankDetailRow}>
//                         <div className={styles.label}>{getI18Text('--bankKey--')}{` (${props.account?.key || '--'})`}</div>
//                         <div className={styles.value}>{props.account?.internationalKey || '--'}</div>
//                     </div>
//                     <div className={styles.bankDetailRow1}>
//                         <div className={styles.label}>{getI18Text('--accountName--')}</div>
//                         <div className={styles.value}>{props.account?.accountHolder || '--'}</div>
//                     </div>
//                     <div className={styles.bankDetailRow}>
//                         <div className={styles.label}>{getI18Text('--accountNumber--')}</div>
//                         <div className={styles.num}>{props.account?.accountNumber?.maskedValue || '--'}</div>
//                     </div>
//                     <div className={styles.bankDetailRow}>
//                         <div className={styles.label}>{getI18Text('--accountAddress--')}</div>
//                         <div className={styles.value}>{convertAddressToString(props.account?.bankAddress) || '--'}</div>
//                     </div>
//                 </div>
//             }
//         </div>
//     )
// }

export function BankInformation (props: BankInformationProps) {

    /* function getCurrencyDisplay (currency: IDRef) {
        return currency ? `${currency.name} (${currency.id})` : '--'
    } */

    return (<>
        <div className={styles.detailsSectionTitle}>
          {props.t('--erpDetails--.--bankInformation--')}
        </div>
        {props.bankAccounts.map((account, index) => {
            return (
                <GetBankInfoRow key={index} account={account} bankKeys={props.bankKeys} t={props.t} />
            )
        })}
      </>)
}

export function VendorHeaderExtensionForm (props: VendorExtensionProps) {
    const [customFormData, setCustomFormData] = useState<CustomFormData | null>(null)
    const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)
    const [vendorExtensionFormFetchData, setVendorExtensionFormFetchData] = useState<(skipValidation?: boolean) => CustomFormModelValue>()
    const [isEditMode, setIsEditMode] = useState(false)

    function fetchCustomFormDefinition (id: string) {
        if (props.fetchVendorExtensionCustomFormDefinition && id) {
          props.fetchVendorExtensionCustomFormDefinition(id)
            .then(resp => {
              setCustomFormDefinition(resp)
            })
            .catch(err => console.log('Vendor Header Extension: Error in fetching custom form definition', err))
        }
    }

    function fetchCustomFormData (vendorId: string, formId?: string) {
        if (props.fetchVendorExtensionCustomFormData) {
          props.fetchVendorExtensionCustomFormData(vendorId)
            .then(resp => {
              if (resp) {
                setCustomFormData(resp.formData || null)
                if (!formId) {
                  fetchCustomFormDefinition(resp.formId)
                }
              }
            })
            .catch(err => console.log('Vendor Header Extension: Error in fetching custom form data', err))
        }
    }

    useEffect(() => {
      if (props.vendor) {
        if (props.vendor.questionnaireId) {
          fetchCustomFormDefinition(props.vendor.questionnaireId?.formId)
          fetchCustomFormData(props.vendor.id, props.vendor.questionnaireId?.formId)
        } else {
          fetchCustomFormData(props.vendor.id)
        }
      }
    }, [props.vendor])

    useEffect(() => {
      if (props.questionnaireId && props.vendorId) {
        fetchCustomFormDefinition(props.questionnaireId?.formId)
        fetchCustomFormData(props.vendorId, props.questionnaireId?.formId)
      }
    }, [props.questionnaireId, props.vendorId])

    function handleCancel () {
        setIsEditMode(false)
    }

    function handleSave () {
        if (vendorExtensionFormFetchData) {
            const data = vendorExtensionFormFetchData(false)
            if (!data) {
              const invalidFieldId = `vendorHeaderExtension_${props.questionnaireId?.formId}`
              const input = document.getElementById(invalidFieldId)
              if (input?.scrollIntoView) {
                input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
              }
            } else {
                setIsEditMode(false)
                setCustomFormData(data)
                props.onSave(data)
            }
        }
    }

    function handleExtensionFormValueChange (formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) {
        if (fileName && props.onValueChange) {
          const extensionFieldName = `data.${fileName}`
          props.onValueChange(
            formData,
            file,
            extensionFieldName
          )
        }
    }

    function handleOnFormReady (fetchDataFunction) {
        if(fetchDataFunction) {
          setVendorExtensionFormFetchData(() => fetchDataFunction)
        }
    }

    function loadDocumentByName (fieldName: string, mediaType: string, fileName: string) {
        if (props.dataFetchers?.getDocumentByName) {
          const extensionFieldName = `data.${fieldName}`
          return props.dataFetchers?.getDocumentByName(extensionFieldName, mediaType, fileName)
        }
    }

    return (<>
     {customFormDefinition && <div className={classnames(styles.extensionForm, { [styles.extensionFormEdit]: props.isERPEditView && isEditMode })}>
        <div className={styles.title}>
          <div>{props.t('--erpDetails--.--otherDetails--')}</div>
          {props.isERPEditView && !isEditMode &&
            <div className={styles.action} onClick={() => setIsEditMode(true)}>
              <Edit3 size={16} color="var(--warm-prime-azure)"/>
              <span className={styles.label}>{props.t('--edit--')}</span>
            </div>
          }
        </div>

        {!isEditMode &&
           <FormDefinitionReadOnlyView
            locale={getSessionLocale()}
            formData={customFormData}
            formDefinition={customFormDefinition}
            loadDocument={loadDocumentByName}
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
            fetchExtensionCustomFormLocalLabels={props.events?.fetchExtensionCustomFormLocalLabels}/>}

        {props.isERPEditView && isEditMode && (props.questionnaireId && props.questionnaireId?.formId) && <>
            <div id={`vendorHeaderExtension_${props.questionnaireId?.formId}`}>
              <CustomFormExtension
                locale={getSessionLocale()}
                customFormData={customFormData}
                questionnaireId={props.questionnaireId}
                options={props.options}
                dataFetchers={{...props.dataFetchers, getDocumentByName: loadDocumentByName}}
                events={props.events}
                handleFormValueChange={handleExtensionFormValueChange}
                onFormReady={handleOnFormReady}
              />
            </div>
            <div className={styles.action}>
              <OroButton label={props.t('--cancel--')} className={styles.cancelBtn} type="secondary" fontWeight="medium" radiusCurvature="medium" onClick={handleCancel} theme="coco" />
              <OroButton label={props.t('--save--')} type="primary" fontWeight="medium" radiusCurvature="medium" onClick={handleSave} theme="coco" />
            </div>
        </>}
     </div>}
    </>)
}

export function SupplierVendorDetails (props: SupplierVendorDetailsProps) {
    const [vendors, setVendors] = useState<Array<Vendor>>([])
    const [filteredVendors, setFilteredVendors] = useState<Array<Vendor>>([])
    const [searchKeyWord, setSearchKeyWord] = useState<string>('')
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

    function viewLocationOnMap (location: Location) {
        if (props.viewOnMap) {
            props.viewOnMap(location)
        }
    }

    function getCurrencies (currencies: IDRef[]) {
        return currencies && currencies.length > 0 ? currencies.map(currency => `${currency.name} (${currency.id})`).join(', ') : '-'
    }

    function handleKeywordSearch (e) {
        setSearchKeyWord(e.target.value)
        setFilteredVendors(vendors.filter(vendor => { return !e.target.value || vendor?.vendorId?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase()) || vendor?.name?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase()) }))
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
            <div key={index} className={styles.detailsList}>
                <div className={styles.detailsContainer} onClick={() => toggleRow(vendor)}>
                    <div>
                        <div className={styles.detailsContainerRow}>
                            <div className={vendor.isExpanded ? styles.detailsContainerRowExpandedItemTitle : styles.title}>
                                {t('--erpDetails--.--vendorID--')} {vendor?.vendorId || '--'}
                            </div>
                            {vendor.isExpanded &&
                               <div className={styles.erpDetailsWrapper}>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--vendorName--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.name || '-'}</div>
                                    </div>
                                    {/* {vendor?.name2 && <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--alternateName--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.name2}</div>
                                    </div>} */}
                                    {(vendor.locations && vendor.locations?.length > 0) && <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--address--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{convertAddressToString(vendor.locations[0]?.address) || '-'}</div>
                                    </div>}
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--website--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>
                                          {vendor?.website ?
                                            <a href={checkURLContainsProtcol(vendor.website)} target="_blank" rel="noreferrer">{vendor.website}</a>
                                            : '-'}
                                        </div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('Email')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.email || '-'}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--phone--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.phone || '-'}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--fax--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.fax || '-'}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--apAccount--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.payableAccount?.name || '-'}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--expenseAccount--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor?.expenseAccount?.name || '-'}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--currencies--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{getCurrencies(vendor?.currencyRefs)}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--erpDetails--.--1099Applicable--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor.tax1099 ? t('Yes') : t('No')}</div>
                                    </div>
                                    <div className={styles.erpDetailsWrapperRow}>
                                        <div className={styles.erpDetailsWrapperRowKey}>{t('--note--')}</div>
                                        <div className={styles.erpDetailsWrapperRowValue}>{vendor.note || '-'}</div>
                                    </div>
                               </div>
                            }
                        </div>
                        {!vendor.isExpanded &&
                            <>
                                <div className={styles.detailsContainerRowItem}>
                                    <div className={styles.highlights}>
                                        {vendor.companyEntityRef && <span className={styles.highlightsEntities}>{t('--erpDetails--.--vendor_name--')} <span className={styles.text}>{vendor?.name || '--'}</span></span>}
                                    </div>
                                </div>
                                <div className={styles.detailsContainerRowItem}>
                                    <div className={styles.highlights}>
                                        {vendor.companyEntityRef && <span className={styles.highlightsEntities}>{t('--erpDetails--.--company_entity--')} <span className={styles.text}>{vendor.companyEntityRef?.name || '--'}</span></span>}
                                        {vendor.additionalCompanyEntities && vendor.additionalCompanyEntities.length > 0 && <span className={styles.highlightsEntities}>{t('--erpDetails--.--other_entities--')} <span className={styles.text}>{getOtherEntities(vendor.additionalCompanyEntities)}</span></span>}
                                    </div>
                                </div>
                            </>
                        }
                        {vendor.isExpanded &&
                            <div className={styles.detailsContainerRowExpandedItem}>
                                <div className={styles.highlights}>
                                    {vendor.companyEntityRef && <div className={styles.highlightsItem}>
                                        <span className={styles.label}>{t('--erpDetails--.--companyEntity--')}</span><span className={styles.text}>{vendor.companyEntityRef?.name || '--'}</span>
                                    </div>}
                                    <div className={styles.highlightsItem}>
                                        <span className={classnames(styles.label, styles.mrgLft)}>{t('--erpDetails--.--otherEntities--')}</span>
                                        <span className={classnames(styles.text, styles.mrgLft)}>{getOtherEntities(vendor.additionalCompanyEntities)}</span>
                                    </div>
                                </div>
                                {/* <div className={classnames(styles.highlights, styles.currency)}>
                                    <div className={classnames(styles.highlightsItem, styles.currencyItem)}>
                                        <span className={styles.label}>Currencies</span><span className={styles.text}>{getCurrencies(vendor.currencyRefs)}</span>
                                    </div>
                                </div> */}
                        </div>}
                        {vendor.isExpanded && vendor.enabledSystems && vendor.enabledSystems.length > 0 &&
                        <div className={styles.detailsContainerRowExpandedItem}>
                            <div className={styles.highlights}>
                                <div className={styles.highlightsContent}>
                                    <span className={styles.label}>{t('--erpDetails--.--enableFor--')}</span><span className={styles.text}>{getOtherEntities(vendor.enabledSystems)}</span>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className={styles.detailsContainerRowActionBtn}>
                        { !vendor.isExpanded && <ChevronDown size={20} strokeWidth={2} color='var(--coco-shade-200)' /> }
                        { vendor.isExpanded && <ChevronUp size={20} strokeWidth={2} color='var(--coco-shade-200)' /> }
                    </div>
                </div>
                {vendor.isExpanded &&
                    <div className={styles.detailsSection}>
                        { vendor.bankAccounts && vendor.bankAccounts.length > 0 &&
                           <BankInformation bankAccounts={vendor.bankAccounts} t={t}/>
                        }
                        {
                            vendor?.taxes && vendor?.taxes?.length > 0 &&
                            <div className={styles.taxDetails}>
                                <div className={styles.detailsSectionTitle}>{t('--erpDetails--.--taxDetails--')}</div>
                                {
                                    vendor?.taxes?.map((tax, key) => {
                                        return <GetTaxDetailRow key={key} taxDetail={tax} taxKeys={props.taxKeys} t={t}/>
                                    })
                                }
                            </div>
                        }
                        { vendor.additionalCompanyEntities && vendor.additionalCompanyEntities.length > 0 &&
                           <>
                            <div className={styles.detailsSectionTitle}>
                               {t('--erpDetails--.--companyEntities--')}
                            </div>

                            { vendor.additionalCompanyEntities.map((entity, index) => {
                                return (
                                    <div key={index} className={styles.card}>
                                       <div className={styles.cardTitle}>
                                         {entity.name}
                                       </div>
                                       {vendor.terms && vendor.terms.paymentTermRef &&
                                       <div className={styles.cardTerms}>
                                         <span className={styles.label}>{t('--erpDetails--.--payment_terms--')}</span>
                                         <span className={styles.value}>{vendor.terms.paymentTermRef.name || '--'}</span>
                                       </div>}
                                    </div>
                                )
                            }) }
                           </>
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

                        { vendor.locations && vendor.locations.length > 0 &&
                            <PurchaseLocationDetails locations={vendor.locations} viewMap={viewLocationOnMap} t={t}/>
                        }
                        { vendor.locations && vendor.locations.length > 0 &&
                            <PurchaseLocationDetails locations={vendor.locations} viewMap={viewLocationOnMap} showOtherLocations={true} t={t}/>
                        }
                    </div>
                }
            </div>)
        })}
    </>)
}
