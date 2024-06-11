import React, { useEffect, useRef, useState } from "react";
import styles from './styles.module.scss'
import { ActivationStatus, IDRef, ProcessVariables, Supplier, Contact as ContactType, ContactDesignation, NormalizedVendor, Option, EncryptedData, VendorSuggestionRequest, Address, Vendor, ContactRole, mapNormalizedVendor } from "../../../Types";
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
import NoSupplierLogo from '../../../Form/assets/no-supplier-logo.svg'
import CheckCircle from '../../../Form/assets/check-circle-filled.svg'
import TaxIcon from '../../../Form/assets/taxIcon.svg'
import { checkURLContainsProtcol, mapAlpha2codeToDisplayName } from "../../../util";
import { AlertCircle, Check, ChevronDown, ChevronUp, Edit3, Info, MapPin, Star, UserPlus, X } from "react-feather";
import { changeDataIndexInArray, checkIfContactNotAvailable, filterNVWithSuppliers, filterSupplierSearchSummaryWithSuppliers, getSupplierActivationStatus, getVendorProcureToPayStatus, parseNVToSupplierV2, parseSearchSummaryToSupplierV2, parseSupplierToSupplierInputForm, parseSupplierToSupplierSearchSummary, parseVendorToSupplier } from "../util";
import { Modal } from "@mui/material";
import { Contact } from "./add-contact-component";
import { AddNewSupplier, Field, FormAction, MasterDataRoleObject, convertAddressToString } from "../..";
import { ConfigurationFieldsSupplierIdentificationV2, PartnerFunction, SupplierSearchSummary, emptySupplierInputForm, enumSupplierIdentificationFields } from "../types";
import { OroButton } from "../../../controls";
import { DuplicateSupplierModal } from "./duplicate-supplier-modal";
import { EnumsDataObject, SupplierInputForm, SupplierTaxKeyField, enumSupplierFields } from "../../types";
import { SupplierSearchResultModal } from "./supplier-search-result-modal.component";
import { OrderingAddressModal } from "./select-ordering-address-modal";
import classNames from "classnames";
import { OroTooltip } from "../../../Tooltip/tooltip.component";
import { SnackbarComponent } from "../../../Snackbar";
import { getTaxKeyNameForKey, isOmitted, isRequired } from "../../util";
import { TaxDetails } from "./tax-details.component";
import { VendorProcureToPayStatus } from "../../../Types/vendor";

interface SupplierCardProps {
    suppliers: Array<Supplier>
    processVariables?: ProcessVariables
    companyEntities?: Array<IDRef>
    vendorCurrency?: IDRef
    fields?: Field[]
    forceValidate?: boolean
    countryOption?: Option[]
    companyEntity?: Option[]
    languageOption?: Option[]
    taxKeys?: EnumsDataObject[]
    taxCodeFormatError?: boolean
    indirectTaxCodeFormatError?: boolean
    supplierRoles?: Array<MasterDataRoleObject>
    isReadonly?: boolean
    disallowFreeEmailDomain?: boolean
    supplierWithContactError?: Supplier | null
    allowParentRecordSelection?: boolean
    isInPortal?: boolean
    supplierFinalizationCheck?: boolean
    supplierSelected?: boolean
    isGPTView?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    loadPartnersForOderingAddress?: () => Promise<Array<Vendor>>
    onSupplierFinalize?: (selected: boolean, suppliers: Array<Supplier>) => void
    validateTaxFormat?: (taxKey: string, alpha2CountryCode: string, data: EncryptedData, taxCode: string) => void
    fetchNVDetailsForDuplicateSupplier?: (vendor: NormalizedVendor) => Promise<NormalizedVendor>
    updateSupplierList?: (supplier: Supplier[], action?: FormAction) => void
    onAddContact?: (supplier: Supplier, index: number) => void
    fetchExistingContactList?: (vendorId: string) => Promise<ContactType[]>
    onSupplierRemove?: (supplier: Supplier[], selected?: boolean) => void
    fetchVendorByLegalEntityId?: (supplier: Supplier) => Promise<NormalizedVendor[]>
    onAdvanceSearch?: (searchPayload: VendorSuggestionRequest) => Promise<SupplierSearchSummary[]>
    fetchVendorById?: (vendorId: string) => Promise<Vendor>
    fetchVendorsForOrderingAddress?: (vendorId: string, purchasingEntities: string[], partnerFunctionType: string) => Promise<Array<Vendor>>
}

interface SupplierCardRowProps {
    supplier: Supplier
    processVariables?: ProcessVariables
    companyEntities?: Array<IDRef>
    vendorCurrency?: IDRef
    fields?: Field[]
    disallowFreeEmailDomain?: boolean
    forceValidate?: boolean
    taxKeys?: EnumsDataObject[]
    supplierRoles?: Array<MasterDataRoleObject>
    countryOption?: Option[]
    languageOption?: Option[]
    companyEntityOption?: Option[]
    taxCodeFormatError?: boolean
    isReadonly?: boolean
    indirectTaxCodeFormatError?: boolean
    supplierWithContactError?: Supplier | null
    allowGroupSelection?: boolean
    isInPortal?: boolean
    supplierFinalizationCheck?: boolean
    supplierSelected?: boolean
    isGPTView?: boolean
    isDuplicateSupplierCheckForm?: boolean
    duplicateSupplierCheckFormConfig?: {
        matchedDuns?: string
        matchedTaxId?: string
        isOriginallySelected?: boolean
        isSelected?: boolean
    }
    duplicateSupplierCheckFormEvents?: {
        onDuplicateSupplierSelect?: () => void
        onContinueOnboarding?: () => void
    }
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    loadPartnersForOderingAddress?: () => Promise<Array<Vendor>>
    onSupplierFinalize?: (selected: boolean) => void
    validateTaxFormat?: (taxKey: string, alpha2CountryCode: string, data: EncryptedData, taxCode: string) => void
    fetchNVDetailsForDuplicateSupplier?: (vendor: NormalizedVendor) => Promise<NormalizedVendor>
    updateSupplierList?: (supplier: Supplier, action?: FormAction) => void
    onAddContact?: (supplier: Supplier) => void
    fetchExistingContactList?: (vendorId: string) => Promise<ContactType[]>
    onSupplierRemove?: () => void
    fetchVendorByLegalEntityId?: (supplier: Supplier) => Promise<NormalizedVendor[]>
    onAdvanceSearch?: (searchPayload: VendorSuggestionRequest) => Promise<SupplierSearchSummary[]>
    fetchVendorById?: (vendorId: string) => Promise<Vendor>
    fetchNVDetailsForParent?: (vendor: SupplierSearchSummary) => Promise<NormalizedVendor>
    fetchVendorsForOrderingAddress?: (vendorId: string, purchasingEntities: string[], partnerFunctionType: string) => Promise<Array<Vendor>>
}

export function SupplierCardRow(props: SupplierCardRowProps) {
    const [address, setAddress] = useState('')
    const [website, setWebsite] = useState('')
    const [orderingAddress, setOrderingAddress] = useState('')
    const [existingUserList, setExistingUserList] = useState<Array<ContactType>>([])
    const [contactPopup, setContactPopup] = useState(false)
    const [vendorResultPopup, setVendorResultPopup] = useState(false)
    const [disallowFreeEmailDomain, setDisallowFreeEmailDomain] = useState(false)
    const [disableEmailCheck, setDisableEmailCheck] = useState(false)
    const [isOrderingAddressEnabled, setIsOrderingAddressEnabled] = useState(false)
    const [isOrderingAddressMandatory, setIsOrderingAddressMandatory] = useState(false)
    const [showOrderingAddressPopup, setShowOrderingAddressPopup] = useState(false)
    const [editSupplier, setEditSupplier] = useState(false)
    const [selectedSupplierContact, setSelectedSupplierContact] = useState<ContactType | null>(null)
    const [activationStatus, setActivationStatus] = useState<ActivationStatus>(ActivationStatus.newSupplier)
    const [vendorProcureToPay, setVendorProcureToPay] = useState<VendorProcureToPayStatus>()
    const [purchasingEnabled, setPurchasingEnabled] = useState<boolean | undefined>(undefined)
    const [invoicingEnabled, setInvoicingEnabled] = useState<boolean | undefined>(undefined)
    const [showDuplicateSupplierModal, setShowDuplicateSupplierModal] = useState<boolean>(false)
    const [supplierFormData, setSupplierFormData] = useState<SupplierInputForm>(emptySupplierInputForm)
    const [vendors, setVendors] = useState<Array<SupplierSearchSummary>>([])
    const [vendorDetail, setVendorDetail] = useState<Array<Vendor>>([])
    // const [isOrderingAddressFound, setIsOrderingAddressFound] = useState(false)
    const [taxDetailsPopup, setTaxDetailsPopup] = useState(false)
    const [orderingAddreesError, setOrderingAddressError] = useState(false)
    const [contactError, setContactError] = useState(false)
    const [cannotFinalizeNotSureSupplier, setCannotFinalizeNotSureSupplier] = useState(false)
    const [istaxDetailsNeedToBeProvided, setIstaxDetailsNeedToBeProvided] = useState(false)
    const [isIndirectTaxDetailsNeedToBeProvided, setIsIndirectTaxDetailsNeedToBeProvided] = useState(false)
    const [duplicateMatchesWith, setDuplicateMatchesWith] = useState<Array<string>>([])
    const [expandMatchesWith, setExpandMatchesqWith] = useState(false)
    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef(fieldName: string, node: HTMLDivElement) {
        fieldRefMap.current[fieldName] = node
    }

    useEffect(() => {
        if (props.duplicateSupplierCheckFormConfig) {
            const _duplicateMatchesWith: string[] = []
            if (props.duplicateSupplierCheckFormConfig.matchedTaxId) {
                _duplicateMatchesWith.push(t('--taxID--'))
            }
            if (props.duplicateSupplierCheckFormConfig.matchedDuns) {
                _duplicateMatchesWith.push(t('--DUNS--'))
            }
            setDuplicateMatchesWith(_duplicateMatchesWith)
        }
    }, [props.duplicateSupplierCheckFormConfig])

    useEffect(() => {
        if (props.supplierWithContactError) {
            if (props.supplierWithContactError.refId === props.supplier.refId) {
                setContactPopup(true)
                setSelectedSupplierContact(props.supplier.contact)
            }
        }
    }, [props.supplierWithContactError])

    useEffect(() => {
        setAddress([props.supplier?.address?.city, mapAlpha2codeToDisplayName(props.supplier?.address?.alpha2CountryCode)].filter(Boolean).join(', '))
        if (props.supplier?.website) {
            const websiteBreakdown = new URL(checkURLContainsProtcol(props.supplier.website))
            setWebsite(websiteBreakdown.hostname)
        }
        setSupplierFormData(parseSupplierToSupplierInputForm(props.supplier))
    }, [props.supplier])
    useEffect(() => {
        const _disallowFreeEmailDomain = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.disallowFreeEmailDomain)
        const _disableEmailCheck = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.disableEmailCheck)
        const _isOrderingAddressEnabled = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.orderingAddressEnabled)
        const _isOrderingAddressRequired = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.orderingAddressMandatory)
        const _contactField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.contact)
        const _emailField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.email)
        const findTaxField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.tax)
        const findIndirectTaxField = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.indirectTax)
        const _isPurchasing = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.isPurchasing)
        const _isInvoicing = props.fields?.find(field => field.fieldName === ConfigurationFieldsSupplierIdentificationV2.isInvoicing)
        const _isContactNameEnabled = !isOmitted(_contactField)
        const _isContactNameRequired = isRequired(_contactField)
        const _isEmailEnabled = !isOmitted(_emailField)
        const _isEmailRequired = isRequired(_emailField)
        if (findTaxField) {
            setIstaxDetailsNeedToBeProvided(isRequired(findTaxField))
        }
        if (findIndirectTaxField) {
            setIsIndirectTaxDetailsNeedToBeProvided(isRequired(findIndirectTaxField))
        }
        setDisallowFreeEmailDomain(_disallowFreeEmailDomain?.booleanValue)
        setDisableEmailCheck(_disableEmailCheck?.booleanValue)
        setIsOrderingAddressEnabled(_isOrderingAddressEnabled?.booleanValue)
        setIsOrderingAddressMandatory(_isOrderingAddressRequired?.booleanValue)
        setPurchasingEnabled(_isPurchasing?.booleanValue)
        setInvoicingEnabled(_isInvoicing?.booleanValue)
        if (props.forceValidate && !props.supplier?.isParent) {
            if (_isOrderingAddressEnabled?.booleanValue && _isOrderingAddressRequired?.booleanValue) {
                const _address = convertAddressToString(props.supplier.address)
                if (props.supplierFinalizationCheck) {
                    if (props.supplierSelected) {
                        setOrderingAddressError(!_address)
                    }
                } else {
                    setOrderingAddressError(!_address)
                }
            }
            if ((_isContactNameEnabled && _isContactNameRequired) || (_isEmailEnabled && _isEmailRequired)) {
                const isContactNotFound = checkIfContactNotAvailable(props.supplier.contact, _isContactNameEnabled, _isContactNameRequired, _isEmailEnabled, _isEmailRequired)
                if (props.supplierFinalizationCheck) {
                    if (props.supplierSelected) {
                        setContactError(isContactNotFound)
                    }
                } else {
                    setContactError(isContactNotFound)
                }
            }
        }
    }, [props.fields, props.forceValidate])
    useEffect(() => {
        const _activationStatus = getSupplierActivationStatus(props.supplier, props.processVariables)
        // if (_activationStatus === ActivationStatus.requiresActivation) {
        //     const partner = props.processVariables?.partners?.find(partner => partner.id === props.supplier?.vendorId || partner.refId === props.supplier?.refId)
        //     setPurchasingEnabled(partner?.purchasingEnabled)
        // }
        setActivationStatus(_activationStatus)
        const _vendorP2P = getVendorProcureToPayStatus(props.supplier, props.processVariables)
        setVendorProcureToPay(_vendorP2P)
        const _address = convertAddressToString(props.supplier.address)
        setOrderingAddress(_address)
    }, [props.supplier, props.processVariables, props.duplicateSupplierCheckFormConfig])
    function onSupplierRemove() {
        if (props.onSupplierRemove) {
            props.onSupplierRemove()
        }
    }
    function getStatusCardBgColorClassName(): string {
        if (props.supplier?.isParent) {
            return styles.supplierCardTemplateStatusCardParentRecord
        } else if (props.supplier?.supplierSelectionText) {
            return styles.supplierCardTemplateStatusCardNotSure
        } else if (activationStatus === ActivationStatus.newSupplier && (props.supplier?.potentialMatchIgnore || props.supplier.potentialMatchesSupplierSummary?.length > 0) && !props.supplier?.supplierSelectionText) {
            return styles.supplierCardTemplateStatusCardDuplicate
        } else {
            return styles.supplierCardTemplateStatusCardNew
        }
        
        // else if (activationStatus === ActivationStatus.active) {
        //     return styles.supplierCardTemplateStatusCardActive
        // } else if (activationStatus === ActivationStatus.newSupplier && (props.supplier?.potentialMatchIgnore || props.supplier.potentialMatchesSupplierSummary?.length > 0) && !props.supplier?.supplierSelectionText) {
        //     return styles.supplierCardTemplateStatusCardDuplicate
        // } else if (activationStatus === ActivationStatus.requiresActivation && purchasingEnabled) {
        //     return styles.supplierCardTemplateStatusCardBlocked
        // } else {
        //     return styles.supplierCardTemplateStatusCardNew
        // }
    }
    function addPersonContact(contactName: string, email: string, role: string, phone: string, designation?: ContactDesignation, primary?: boolean) {
        const action = disableEmailCheck ? undefined : FormAction.emailValidation
        const isEmailChanged = props.supplier?.contact?.email !== email
        const addContactToSupplier = { ...props.supplier }
        addContactToSupplier.contact = {
            ...props.supplier.contact,
            email: email,
            fullName: contactName,
            phone: phone,
            role: role,
            designation: designation,
            primary: primary || false
        }
        if (props.updateSupplierList && !props.isGPTView) {
            props.updateSupplierList(addContactToSupplier, isEmailChanged || props.supplierWithContactError ? action : undefined)
        }
        if (props.isGPTView) {
           props.onAddContact(addContactToSupplier)
        }
        setSelectedSupplierContact(null)
        setContactPopup(false)
        setExistingUserList([])
    }
    function onAddContactClick() {
        if (props.supplier?.contact) {
            setContactPopup(true)
            setSelectedSupplierContact(props.supplier.contact)
        } else if (props.supplier.vendorId && props.fetchExistingContactList) {
            props.fetchExistingContactList(props.supplier.vendorId)
                .then((resp) => {
                    setExistingUserList(resp)
                    setContactPopup(true)
                })
                .catch((err) => {
                    console.log(err)
                    setContactPopup(true)
                })
        } else {
            setContactPopup(true)
        }
    }
    function onVendorSelect(vendor: NormalizedVendor) {
        setShowDuplicateSupplierModal(false)
        setVendorResultPopup(false)
        setCannotFinalizeNotSureSupplier(false)
        if (props.updateSupplierList) {
            const convertVendorToSupplier: Supplier = parseNVToSupplierV2(vendor, [], undefined, undefined, props.processVariables)
            props.updateSupplierList(convertVendorToSupplier)
        }
    }

    function onParentVendorSelect(vendor: SupplierSearchSummary) {
        if (props.fetchNVDetailsForParent) {
            setShowDuplicateSupplierModal(false)
            setVendorResultPopup(false)
            props.fetchNVDetailsForParent(vendor)
                .then((resp) => {
                    if (props.updateSupplierList) {
                        const convertVendorToSupplier: Supplier = parseNVToSupplierV2(resp, [], undefined, undefined, props.processVariables)
                        props.updateSupplierList(convertVendorToSupplier)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    if (props.updateSupplierList) {
                        const convertVendorToSupplier: Supplier = parseSearchSummaryToSupplierV2(vendor)
                        props.updateSupplierList(convertVendorToSupplier)
                    }
                })
        }
    }
    function handleOnIgnoreMatch() {
        setShowDuplicateSupplierModal(false)
        const updateSupplier = props.supplier
        updateSupplier.potentialMatchIgnore = true
        if (props.updateSupplierList) {
            props.updateSupplierList(updateSupplier)
        }
    }

    function handleDuplicateMatchNotSure() {
        setShowDuplicateSupplierModal(false)
        const updateSupplier = props.supplier
        updateSupplier.potentialMatchIgnore = false
        if (props.updateSupplierList) {
            props.updateSupplierList(updateSupplier)
        }
    }
    function handleCloseDuplicateSupplierModal() {
        setShowDuplicateSupplierModal(false)
    }
    function triggerFetchVendor() {
        if (props.fetchVendorByLegalEntityId) {
            props.fetchVendorByLegalEntityId(props.supplier)
                .then(resp => {
                    const mappedVendors = parseSupplierToSupplierSearchSummary(props.supplier, resp || [])
                    const _vendors: SupplierSearchSummary[] = []
                    _vendors.push(mappedVendors)
                    setVendors(_vendors)
                    setVendorResultPopup(true)
                })
                .catch(err => console.log(err))
        }
    }
    function getUpdatedValuesForSupplier(updatedForm: SupplierInputForm): Supplier {
        const updateSupplier = props.supplier
        updateSupplier.jurisdictionCountryCode = updatedForm?.jurisdictionCountryCode?.path || props.supplier?.jurisdictionCountryCode
        updateSupplier.name = updatedForm?.name || props.supplier?.supplierName
        updateSupplier.website = updatedForm?.website || props.supplier?.website
        updateSupplier.contact.email = updatedForm?.email || props.supplier?.contact?.email
        updateSupplier.duns = updatedForm?.duns || props.supplier?.duns
        updateSupplier.langCode = updatedForm?.langCode?.path || props.supplier?.langCode
        updateSupplier.tax = updatedForm?.tax || props.supplier?.tax
        updateSupplier.indirectTax = updatedForm?.indirectTax || props.supplier?.indirectTax
        return updateSupplier
    }
    function onNewSupplierAddValueChange(fieldName: string, updatedForm: SupplierInputForm) {
        if (fieldName === enumSupplierFields.country && updatedForm?.jurisdictionCountryCode) {
            if (props.updateSupplierList) {
                const updateSupplier = getUpdatedValuesForSupplier(updatedForm)
                props.updateSupplierList({ ...updateSupplier, tax: null, indirectTax: null })
            }
        }
    }
    function onUpdateSupplier(updatedForm: SupplierInputForm) {
        if (props.updateSupplierList) {
            const action = disableEmailCheck ? undefined : FormAction.emailValidation
            const isEmailChanged = props.supplier?.contact?.email !== updatedForm.email
            setEditSupplier(false)
            const updateSupplier = getUpdatedValuesForSupplier(updatedForm)
            props.updateSupplierList(updateSupplier, isEmailChanged || props.supplierWithContactError ? action : undefined)
        }
    }
    function handleAdvanceSearch(payload: VendorSuggestionRequest) {
        if (props.onAdvanceSearch) {
            props.onAdvanceSearch(payload)
                .then(resp => {
                    setVendors(resp)
                })
                .catch(err => console.log(err))
        }
    }
    function handleOrderingAddressSelect(_orderingAddress: Address) {
        setShowOrderingAddressPopup(false)
        setOrderingAddressError(false)
        const _updatedSupplier = {
            ...props.supplier,
            address: _orderingAddress
        }
        if (props.updateSupplierList) {
            props.updateSupplierList(_updatedSupplier)
        }
    }
    function openOrderingAddressPopUp() {
        if (props.fetchVendorsForOrderingAddress && props.supplier?.selectedVendorRecord?.id) {
            const purchaseOrgs: string[] = props.processVariables?.purchaseOrgs?.map(data => data.id)
            props.fetchVendorsForOrderingAddress(props.supplier.selectedVendorRecord.id, purchaseOrgs, PartnerFunction.OA)
                .then(resp => {
                    setVendorDetail(resp)
                    setShowOrderingAddressPopup(true)
                })
                .catch(err => console.log('Error in fetching vendors for ordering address ', err))
        }
    }

    function onSupplierFinalize(selected: boolean) {
        if (props.supplier?.supplierSelectionText && selected) {
            setCannotFinalizeNotSureSupplier(true)
        } else {
            if (props.onSupplierFinalize) {
                props.onSupplierFinalize(selected)
            }
        }
    }
    function handleAddNewSupplierClose() {
        setEditSupplier(false)
    }
    function onRemoveContact() {
        const _updatedSupplier: Supplier = {
            ...props.supplier,
            contact: null
        }
        if (props.isGPTView && props.onAddContact) {
            props.onAddContact(_updatedSupplier)
        } else if (props.updateSupplierList) {
            props.updateSupplierList(_updatedSupplier)
        }
    }
    function onRemoveTax() {
        const _updatedSupplier: Supplier = {
            ...props.supplier,
            tax: null,
            indirectTax: null
        }
        if (props.updateSupplierList) {
            props.updateSupplierList(_updatedSupplier)
        }
    }
    function handleTaxUpdateForSupplier(tax?: SupplierTaxKeyField, indirectTax?: SupplierTaxKeyField) {
        const _updatedSupplier: Supplier = {
            ...props.supplier,
            tax: tax,
            indirectTax: indirectTax
        }
        if (props.updateSupplierList) {
            props.updateSupplierList(_updatedSupplier)
        }
    }
    function onRemoveAddress() {
        const _updatedSupplier: Supplier = {
            ...props.supplier,
            address: null
        }
        if (props.updateSupplierList) {
            props.updateSupplierList(_updatedSupplier)
        }
    }
    function onDuplicateSupplierSelect () {
        if (props.duplicateSupplierCheckFormEvents?.onDuplicateSupplierSelect && !props.duplicateSupplierCheckFormConfig?.isOriginallySelected) {
            props.duplicateSupplierCheckFormEvents.onDuplicateSupplierSelect()
        } else if (props.duplicateSupplierCheckFormEvents?.onContinueOnboarding && props.duplicateSupplierCheckFormConfig?.isOriginallySelected) {
            props.duplicateSupplierCheckFormEvents.onContinueOnboarding()
        }
    }
    function taxDetailsTooltip(): React.ReactElement {
        return <div className={styles.taxDetailTooltip}>
            {props.supplier.tax?.encryptedTaxCode?.maskedValue && <div className={styles.taxDetailTooltipTax}>
                <div className={styles.taxDetailTooltipTaxType}>{getTaxKeyNameForKey(props.supplier?.tax?.taxKey, props.taxKeys)}:</div>
                <div className={styles.taxDetailTooltipTaxValue}>{props.supplier?.tax?.encryptedTaxCode?.maskedValue}</div>
            </div>}
            {props.supplier.indirectTax?.encryptedTaxCode?.maskedValue && <div className={styles.taxDetailTooltipTax}>
                <div className={styles.taxDetailTooltipTaxType}>{getTaxKeyNameForKey(props.supplier?.indirectTax?.taxKey, props.taxKeys)}:</div>
                <div className={styles.taxDetailTooltipTaxValue}>{props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue}</div>
            </div>}
        </div>
    }
    function getStatusTooltip(text: string, entities: IDRef[]): React.ReactElement {
        return (<div className={styles.statusTooltip}>
            <div className={styles.tooltipText}>{text}</div>
            {entities?.length > 0 && entities.map((data, index) =>
              <div className={styles.tooltipList} key={index}>
                <div className={styles.tooltipListValue}>
                  &#8226; {data?.name}
                  {data?.id && ` (${data.id})`}
                </div>
              </div>
            )}
        </div>)
    }

    function getCompanyEntityTooltip(): React.ReactElement {
        return (<>
            {props.supplier?.selectedVendorRecord?.additionalCompanyEntities.map((data, index) =>
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

    function canShowActivationStatus (): boolean {
      return activationStatus === ActivationStatus.newSupplier &&
             ((!props.supplier?.potentialMatchIgnore && props.supplier?.potentialMatchesSupplierSummary?.length === 0) ||
              (props.supplier?.potentialMatchIgnore && props.supplier?.potentialMatchesSupplierSummary?.length > 0) || 
              (!props.supplier?.potentialMatchIgnore && props.supplier?.potentialMatchesSupplierSummary?.length > 0))
    }

    function canShowVendorProcureToPayStatus (): boolean {
        return vendorProcureToPay &&
               ((vendorProcureToPay.companyEntityMatchStatus === ActivationStatus.companyEntitiesMatched || vendorProcureToPay.companyEntityMatchStatus === ActivationStatus.companyEntitiesMatchedPartially) ||
                (vendorProcureToPay.purchasingEntityMatchStatus === ActivationStatus.purchasingEntitiesMatched || vendorProcureToPay.purchasingEntityMatchStatus === ActivationStatus.purchasingEntitiesMatchedPartially))
    }
    
    return (
        <div>
            {!editSupplier && <div className={styles.supplierCardTemplate}>
                {!props.isGPTView && !props.isReadonly && !props.isDuplicateSupplierCheckForm && <div className={styles.supplierCardTemplateRemove} onClick={onSupplierRemove}>
                    <X size={16} color="var(--warm-neutral-shade-300)"></X>
                </div>}
                <div className={classNames(styles.supplierCardTemplateContainer, { [styles.supplierCardTemplateContainerSelected]: props.supplierSelected })}>
                    <div className={styles.supplierCardTemplateContainerTop}>
                        <div className={classNames(styles.supplierCardTemplateContainerTopInfo, { [styles.supplierCardTemplateContainerTopParentInfo]: props.supplier.isParent })}>
                            <div className={styles.supplierCardTemplateContainerTopInfoLogo}>
                                <img className={styles.supplierCardTemplateContainerTopInfoLogoImg} src={NoSupplierLogo} alt="supplier logo" />
                            </div>
                            <div className={styles.supplierCardTemplateContainerTopInfoDetail}>
                                <div className={styles.supplierCardTemplateContainerTopInfoDetailTop}>
                                    <div className={styles.supplierCardTemplateContainerTopInfoDetailTopName}>{props.supplier.supplierName}</div>
                                    {!props.isReadonly && <div className={styles.supplierCardTemplateContainerTopInfoDetailTopRight}>
                                        {props.supplier?.newSupplier && !props.isDuplicateSupplierCheckForm && <div className={`${styles.supplierCardTemplateContainerTopInfoDetailTopEdit} ${props.supplierFinalizationCheck ? styles.supplierCardTemplateContainerTopInfoDetailTopEditDivider : ''}`} onClick={() => setEditSupplier(true)}><Edit3 size={16} color="var(--warm-prime-azure)"></Edit3> {t('--edit--')}</div>}
                                        {!props.supplierSelected && props.supplierFinalizationCheck && <>
                                            <div>{t('--select--')}</div>
                                            <div className={styles.supplierCardTemplateContainerTopInfoDetailTopCheck} onClick={() => onSupplierFinalize(true)}></div>
                                        </>}
                                        {props.supplierSelected && props.supplierFinalizationCheck && <>
                                            <div>{t('--selected--')}</div>
                                            <div className={styles.supplierCardTemplateContainerTopInfoDetailTopCheckActive} onClick={() => onSupplierFinalize(false)}>
                                                <Check size={16} color="var(--warm-prime-chalk)"></Check>
                                            </div>
                                        </>}
                                        {props.isDuplicateSupplierCheckForm && !props.duplicateSupplierCheckFormConfig.isSelected && <>
                                            <OroButton label={props.duplicateSupplierCheckFormConfig?.isOriginallySelected ? t('--onboardSupplier--') : t('--select--')} type="default" radiusCurvature="medium" fontWeight="medium" onClick={onDuplicateSupplierSelect}></OroButton>
                                        </>}
                                    </div>}
                                </div>
                                <div className={styles.supplierCardTemplateContainerTopInfoDetailBottom}>
                                    {address && <div className={styles.supplierCardTemplateContainerTopInfoDetailBottomItem}>
                                        <div className={styles.supplierCardTemplateContainerTopInfoDetailBottomItemValue}>{address}</div>
                                    </div>}
                                    {props.supplier.website && <div className={styles.supplierCardTemplateContainerTopInfoDetailBottomItem}>
                                        <a className={styles.supplierCardTemplateContainerTopInfoDetailBottomItemValue} href={checkURLContainsProtcol(props.supplier.website)} target='_blank' rel='noreferrer' title={props.supplier.website}>
                                            {website}
                                        </a>
                                    </div>}
                                    {props.supplier?.selectedVendorRecord?.vendorId && <div className={styles.supplierCardTemplateContainerTopInfoDetailBottomItem}>
                                        <div className={styles.supplierCardTemplateContainerTopInfoDetailBottomItemValue}>{t('--id--')} {props.supplier?.selectedVendorRecord?.vendorId}</div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!props.isDuplicateSupplierCheckForm && <div className={styles.supplierCardTemplateContainerBottom}>
                        {(props.supplier?.tax?.encryptedTaxCode?.maskedValue || props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue) && props.supplier.newSupplier && <div className={`${styles.supplierCardTemplateContainerBottomTax} ${props.supplier?.contact ? styles.supplierCardTemplateContainerBottomTaxExist : ''}`}>
                            <div className={styles.supplierCardTemplateContainerBottomTaxWrapper}>
                                <img src={TaxIcon} alt="supplier logo" />
                                <div className={styles.supplierCardTemplateContainerBottomTaxWrapperLabel}>{t('--taxId--')}</div>
                                {props.supplier?.tax?.encryptedTaxCode?.maskedValue && <div className={styles.supplierCardTemplateContainerBottomTaxWrapperDirect}>
                                    <div className={styles.supplierCardTemplateContainerBottomTaxWrapperValue}>{props.supplier?.tax?.encryptedTaxCode?.maskedValue}</div>
                                </div>}
                                {props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue && <div className={styles.supplierCardTemplateContainerBottomTaxWrapperIndirect}>
                                    <div className={styles.supplierCardTemplateContainerBottomTaxWrapperValue}>{props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue}</div>
                                </div>}
                                <OroTooltip title={taxDetailsTooltip()}><Info size={18} color="var(--warm-neutral-shade-200)" cursor={'pointer'}></Info></OroTooltip>
                            </div>
                            {!props.isReadonly && <div className={styles.supplierCardTemplateContainerBottomTaxActions}>
                                <Edit3 size={18} color="var(--warm-neutral-shade-200)" onClick={() => setTaxDetailsPopup(true)}></Edit3>
                                <X size={18} color="var(--warm-neutral-shade-200)" onClick={onRemoveTax}></X>
                            </div>}
                        </div>}
                        {(!props.supplier.isParent && !props.isGPTView) && <>
                            {isOrderingAddressEnabled && !props.isReadonly && <div className={`${styles.supplierCardTemplateContainerBottomAddress} ${orderingAddress ? styles.supplierCardTemplateContainerBottomAddressExist : ''}`}>
                                <div className={styles.supplierCardTemplateContainerBottomAddressWrapper}>
                                    <MapPin size={16} color="var(--warm-neutral-shade-200)"></MapPin>
                                    <div className={styles.supplierCardTemplateContainerBottomAddressTitle}>
                                        <div className={styles.supplierCardTemplateContainerBottomAddressTitleText}>
                                            {t('--orderingAddress--')}
                                        </div>
                                        {orderingAddress && <OroTooltip title={orderingAddress}><div className={styles.orderingAddressDetails}>
                                            <div className={styles.orderingAddressDetailsLocation}>{orderingAddress}</div>
                                        </div></OroTooltip>}
                                        {!orderingAddress && <div className={styles.supplierCardTemplateContainerBottomAddressTitleAdd} onClick={openOrderingAddressPopUp}>{t('--add--')}</div>}
                                    </div>
                                    {orderingAddreesError && <div className={styles.supplierCardTemplateContainerBottomAddressError}>
                                        <AlertCircle size={16} color={"var(--warm-stat-chilli-regular)"} />
                                        {t('--orderingAddressIsRequired--')}
                                    </div>}
                                </div>
                                {orderingAddress && !props.isReadonly && <div className={styles.supplierCardTemplateContainerBottomAddressActions}>
                                    <Edit3 size={18} color="var(--warm-neutral-shade-200)" onClick={openOrderingAddressPopUp}></Edit3>
                                    <X size={18} color="var(--warm-neutral-shade-200)" onClick={onRemoveAddress}></X>
                                </div>}
                            </div>}
                            {(isOrderingAddressEnabled && isOrderingAddressMandatory && props.isReadonly) && <div className={styles.supplierCardTemplateContainerBottomAddress}>
                                <div className={styles.supplierCardTemplateContainerBottomAddressWrapper}>
                                    <MapPin size={16} color="var(--warm-neutral-shade-200)"></MapPin>
                                    <div className={styles.supplierCardTemplateContainerBottomAddressTitle}>
                                        <div className={styles.supplierCardTemplateContainerBottomAddressTitleText}>
                                            {t('--orderingAddress--')}
                                        </div>
                                        {orderingAddress && <OroTooltip title={orderingAddress}>
                                            <div className={styles.orderingAddressDetails}>
                                                <div className={styles.orderingAddressDetailsLocation}>{orderingAddress}</div>
                                            </div>
                                        </OroTooltip>}
                                        {!orderingAddress && <div className={styles.orderingAddressDetails}>
                                            <div className={styles.orderingAddressDetailsLocationUnavailable}>{t('--notProvided--')}</div>
                                        </div>}
                                    </div>
                                </div>
                            </div>}
                            {(isOrderingAddressEnabled && props.isReadonly && !isOrderingAddressMandatory) && <>
                                {orderingAddress && <div className={styles.supplierCardTemplateContainerBottomAddress}>
                                    <div className={styles.supplierCardTemplateContainerBottomAddressWrapper}>
                                        <MapPin size={16} color="var(--warm-neutral-shade-200)"></MapPin>
                                        <div className={styles.supplierCardTemplateContainerBottomAddressTitle}>
                                            <div className={styles.supplierCardTemplateContainerBottomAddressTitleText}>
                                                {t('--orderingAddress--')}
                                            </div>
                                            <OroTooltip title={orderingAddress}>
                                                <div className={styles.orderingAddressDetails}>
                                                    <div className={styles.orderingAddressDetailsLocation}>{orderingAddress}</div>
                                                </div>
                                            </OroTooltip>
                                        </div>
                                    </div>
                                </div>}
                            </>}
                        </>}
                        {(!props.supplier.isParent) && <div className={`${styles.supplierCardTemplateContainerBottomContact} ${props.supplier?.contact ? styles.supplierCardTemplateContainerBottomContactExist : ''}`}>
                            <div className={styles.supplierCardTemplateContainerBottomContactWrapper}>
                                <UserPlus size={16} color="var(--warm-neutral-shade-200)"></UserPlus>
                                <div className={styles.supplierCardTemplateContainerBottomContactTitle}>
                                    {t('--contact--')}
                                    {props.supplier?.contact && <div className={styles.supplierCardTemplateContainerBottomContactTitleDetails}>
                                        {props.supplier.contact.fullName && <div className={styles.supplierCardTemplateContainerBottomContactTitleName}>
                                            {props.supplier.contact.fullName}
                                            {(props.supplier?.contact?.designation?.role === ContactRole.primary || props.supplier?.contact?.primary) && <div className={styles.primaryChip}>
                                                <Star size={12} color={'var(--warm-misc-bold-gold)'} fill={'var(--warm-misc-bold-gold)'} />
                                                <span className={styles.tag}>{t('--primary--')}</span>
                                            </div>}
                                        </div>}
                                        {props.supplier.contact.email && <div className={styles.supplierCardTemplateContainerBottomContactTitleEmail}>
                                            {props.supplier.contact.email}
                                            {!props.supplier.contact.fullName && (props.supplier?.contact?.designation?.role === ContactRole.primary || props.supplier?.contact?.primary) && <div className={styles.primaryChip}>
                                                <Star size={12} color={'var(--warm-misc-bold-gold)'} fill={'var(--warm-misc-bold-gold)'} />
                                                <span className={styles.tag}>{t('--primary--')}</span>
                                            </div>}
                                        </div>}
                                    </div>}
                                    {!props.supplier?.contact && props.isReadonly && <div className={styles.supplierCardTemplateContainerBottomContactTitleDetails}>
                                        <div className={styles.supplierCardTemplateContainerBottomContactUnavailable}>{t('--notProvided--')}</div>
                                    </div>}
                                    {!props.isReadonly && !props.supplier?.contact && <div className={styles.supplierCardTemplateContainerBottomContactTitleAdd} onClick={onAddContactClick}>{t('--add--')}</div>}
                                </div>
                                <div className={styles.supplierCardTemplateContainerBottomContactError}>
                                    {
                                        props.disallowFreeEmailDomain && props.supplier?.contact?.emailVerification?.isFreeDomain &&
                                        <div className={styles.supplierCardTemplateContainerBottomContactErrorDisallow} ref={(node) => { storeRef(enumSupplierIdentificationFields.disallowFreeEmailDomain, node) }}>
                                            <Info size={16} color="var(--warm-stat-chilli-regular)"></Info>
                                            {t('--pleaseProvideBusinessEmail--')}
                                        </div>
                                    }
                                    {
                                        !props.supplier?.contact?.emailVerification?.isFreeDomain && props.supplier?.contact?.emailVerification?.domainNotExist &&
                                        <div className={styles.supplierCardTemplateContainerBottomContactErrorDisallow} ref={(node) => { storeRef(enumSupplierIdentificationFields.disallowFreeEmailDomain, node) }}>
                                            <Info size={16} color="var(--warm-stat-chilli-regular)"></Info>
                                            {t('--domainNotExist--')}
                                        </div>
                                    }
                                    {
                                        props.supplier?.contact?.emailVerification?.emailNotDeliverable && !props.supplier?.contact?.emailVerification?.isFreeDomain &&
                                        <div className={styles.supplierCardTemplateContainerBottomContactErrorUnverified}>
                                            <AlertCircle size={16} color="var(--warm-stat-honey-regular)"></AlertCircle>
                                            {t('--emailUnverified--')}
                                        </div>
                                    }
                                    {
                                        !props.disallowFreeEmailDomain && props.supplier?.contact?.emailVerification?.isFreeDomain &&
                                        <div className={styles.supplierCardTemplateContainerBottomContactErrorUnverified}>
                                            <AlertCircle size={16} color="var(--warm-stat-honey-regular)"></AlertCircle>
                                            {t('--personalEmailProvided--')}
                                        </div>
                                    }
                                    {contactError && !(props.supplier?.contact?.fullName && props.supplier?.contact?.email) && <div className={styles.supplierCardTemplateContainerBottomContactMissingError}>
                                        <AlertCircle size={16} color={"var(--warm-stat-chilli-regular)"} />
                                        {t('--contactIsRequired--')}
                                    </div>}
                                </div>
                            </div>
                            {props.supplier?.contact && !props.isReadonly && <div className={styles.supplierCardTemplateContainerBottomContactActions}>
                                <Edit3 size={18} color="var(--warm-neutral-shade-200)" onClick={onAddContactClick}></Edit3>
                                <X size={18} color="var(--warm-neutral-shade-200)" onClick={onRemoveContact}></X>
                            </div>}

                        </div>}
                    </div>}
                    {props.isDuplicateSupplierCheckForm && <div className={styles.supplierCardTemplateContainerBottom}>
                        {!props.duplicateSupplierCheckFormConfig?.isOriginallySelected && !props.duplicateSupplierCheckFormConfig?.isSelected && <>
                            <div className={classNames(styles.supplierCardTemplateContainerBottomMatches, {[styles.supplierCardTemplateContainerBottomMatchesExpand]: expandMatchesWith})}>
                                <div className={styles.supplierCardTemplateContainerBottomMatchesHeader}>{t('--matchesWith--')}</div>
                                {!expandMatchesWith && <div className={styles.supplierCardTemplateContainerBottomMatchesWith}>
                                    {duplicateMatchesWith.join(', ')}
                                </div>}
                                {!expandMatchesWith && <ChevronDown size={20} color="var(--warm-neutral-shade-300)" cursor={'pointer'} onClick={() => setExpandMatchesqWith(true)}></ChevronDown>}
                                {expandMatchesWith && <ChevronUp size={20} color="var(--warm-neutral-shade-300)" cursor={'pointer'} onClick={() => setExpandMatchesqWith(false)}></ChevronUp>}
                            </div>
                            {expandMatchesWith && <div className={styles.supplierCardTemplateContainerBottomDedup}>
                                <div className={styles.supplierCardTemplateContainerBottomDedupItem}>
                                    <div className={styles.supplierCardTemplateContainerBottomDedupLabel}>{t('--taxId--')}</div>
                                    {props.duplicateSupplierCheckFormConfig?.matchedTaxId && <div className={styles.supplierCardTemplateContainerBottomDedupValue}>{props.duplicateSupplierCheckFormConfig?.matchedTaxId}</div>}
                                    {!props.duplicateSupplierCheckFormConfig?.matchedTaxId && props.supplier?.tax?.encryptedTaxCode?.maskedValue &&
                                        <div className={styles.supplierCardTemplateContainerBottomDedupValue}>{props.supplier?.tax?.encryptedTaxCode?.maskedValue}
                                        <OroTooltip title={taxDetailsTooltip()}><Info size={18} color="var(--warm-neutral-shade-200)" cursor={'pointer'}></Info></OroTooltip>
                                    </div>}
                                    {!props.duplicateSupplierCheckFormConfig?.matchedTaxId && !props.supplier?.tax?.encryptedTaxCode?.maskedValue && <div className={styles.supplierCardTemplateContainerBottomDedupValue}>-</div>}
                                </div>
                                <div className={styles.supplierCardTemplateContainerBottomDedupItem}>
                                    <div className={styles.supplierCardTemplateContainerBottomDedupLabel}>{t('--duns--')}</div>
                                    <div className={styles.supplierCardTemplateContainerBottomDedupValue}>{props.duplicateSupplierCheckFormConfig?.matchedDuns || props.supplier?.duns || '-'}</div>
                                </div>
                                <div className={styles.supplierCardTemplateContainerBottomDedupItem}>
                                    <div className={styles.supplierCardTemplateContainerBottomDedupLabel}>{t('--website--')}</div>
                                    <div className={styles.supplierCardTemplateContainerBottomDedupValue}>{props.supplier?.website || '-'}</div>
                                </div>
                            </div>}
                        </>}
                        {(props.duplicateSupplierCheckFormConfig?.isOriginallySelected || props.duplicateSupplierCheckFormConfig?.isSelected) && <div className={`${styles.supplierCardTemplateContainerBottomTax} ${props.supplier?.contact ? styles.supplierCardTemplateContainerBottomTaxExist : ''}`}>
                            <div className={styles.supplierCardTemplateContainerBottomTaxWrapper}>
                                <img src={TaxIcon} alt="supplier logo" />
                                <div className={styles.supplierCardTemplateContainerBottomTaxWrapperLabel}>{t('--taxId--')}</div>
                                <div className={styles.supplierCardTemplateContainerBottomTaxWrapperDirect}>
                                    <div className={styles.supplierCardTemplateContainerBottomTaxWrapperValue}>{props.supplier?.tax?.encryptedTaxCode?.maskedValue || '-'}</div>
                                </div>
                                {props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue && <div className={styles.supplierCardTemplateContainerBottomTaxWrapperIndirect}>
                                    <div className={styles.supplierCardTemplateContainerBottomTaxWrapperValue}>{props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue}</div>
                                </div>}
                                {(props.supplier?.tax?.encryptedTaxCode?.maskedValue || props.supplier?.indirectTax?.encryptedTaxCode?.maskedValue) && <OroTooltip title={taxDetailsTooltip()}><Info size={18} color="var(--warm-neutral-shade-200)" cursor={'pointer'}></Info></OroTooltip>}
                            </div>
                        </div>}
                    </div>}
                </div>
                {!props.isGPTView && <div className={styles.supplierCardTemplateStatus}>
                    <div className={`${styles.supplierCardTemplateStatusCard} ${getStatusCardBgColorClassName()}`}>
                        {!props.supplier?.supplierSelectionText && !props.supplier.isParent && <div className={styles.supplierCardTemplateStatusCardItem}>
                            {
                              canShowActivationStatus() && <>
                                {activationStatus === ActivationStatus.newSupplier && !props.supplier?.potentialMatchIgnore && props.supplier?.potentialMatchesSupplierSummary?.length === 0 && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                  {/* <Info size={16} color="var(--warm-neutral-shade-200)"></Info> */}
                                  <div className={styles.statusLabel}>{t('--status--')} {t('--newSupplier--')}</div>
                                </div>}
                                {activationStatus === ActivationStatus.newSupplier && props.supplier?.potentialMatchIgnore && props.supplier?.potentialMatchesSupplierSummary?.length > 0 && <div className={styles.supplierCardTemplateStatusCardItemLabelDuplicate}>
                                  {/* <AlertCircle size={20} color="var(--warm-stat-honey-lite)" fill="var(--warm-neutral-shade-300)"></AlertCircle> */}
                                  <div className={styles.statusLabel}>{t('--status--')} {t('--newSupplierPotentialDuplicateWereIgnored--')}</div>
                                  <OroButton type="link" theme="coco" label={t('--viewIgnoredMatches--')} fontWeight="bold" onClick={() => setShowDuplicateSupplierModal(true)}></OroButton>
                                </div>}
                                {activationStatus === ActivationStatus.newSupplier && !props.supplier?.potentialMatchIgnore && props.supplier?.potentialMatchesSupplierSummary?.length > 0 && <div className={styles.supplierCardTemplateStatusCardItemLabelDuplicate}>
                                  {/* <AlertCircle size={20} color="var(--warm-stat-honey-lite)" fill="var(--warm-neutral-shade-300)"></AlertCircle> */}
                                  <div className={styles.statusLabel}>{t('--status--')} {t('--newSupplierPotentialDuplicateWithMatchingSuppliers--')}</div>
                                  <OroButton type="link" theme="coco" label={t('--viewMatches--')} fontWeight="bold" onClick={() => setShowDuplicateSupplierModal(true)}></OroButton>
                                </div>}
                              </>
                            }
                            {
                                !canShowActivationStatus() && canShowVendorProcureToPayStatus () && <>
                                  <div className={styles.statusLabel}>{t('--status--')}</div>
                                  {vendorProcureToPay.companyEntityMatchStatus === ActivationStatus.companyEntitiesMatched && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                    <OroTooltip title={getStatusTooltip(t('--invoiceProcessingEnabledFor--'), vendorProcureToPay.matchedCompanyEntities)}>
                                      <div className={classNames(styles.statusChip, styles.matched)}>
                                        <div className={styles.icon}><img src={CheckCircle} width={16} height={16} /></div>
                                        <span>{t('--payment--')}</span>
                                      </div>
                                    </OroTooltip>
                                  </div>}
                                  {vendorProcureToPay.companyEntityMatchStatus === ActivationStatus.companyEntitiesMatchedPartially && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                    <OroTooltip title={vendorProcureToPay.blockedCompanyEntities && vendorProcureToPay.blockedCompanyEntities.length > 0 ? getStatusTooltip(t('--invoiceProcessingBlockedFor--'), vendorProcureToPay.blockedCompanyEntities) : getStatusTooltip(t('--invoiceProcessingNotEnabledFor--'), vendorProcureToPay.unmatchedCompanyEntities)}>
                                      <div className={classNames(styles.statusChip, styles.unmatched)}>
                                        <div className={styles.warning}><AlertCircle size={16} color={"var(--warm-misc-bold-orange)"}/></div>
                                        <span>{t('--payment--')}</span>
                                      </div>
                                    </OroTooltip>
                                  </div>}
                                  {vendorProcureToPay.purchasingEntityMatchStatus === ActivationStatus.purchasingEntitiesMatched && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                    <OroTooltip title={getStatusTooltip(t('--purchaseOrdersEnabledFor--'), vendorProcureToPay.matchedPurchasingEntities)}>
                                      <div className={classNames(styles.statusChip, styles.matched)}>
                                        <div className={styles.icon}><img src={CheckCircle} width={16} height={16} /></div>
                                        <span>{t('--purchase--')}</span>
                                      </div>
                                    </OroTooltip>
                                  </div>}
                                  {vendorProcureToPay.purchasingEntityMatchStatus === ActivationStatus.purchasingEntitiesMatchedPartially && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                    <OroTooltip title={vendorProcureToPay.blockedPurchasingEntities && vendorProcureToPay.blockedPurchasingEntities.length > 0 ? getStatusTooltip(t('--purchaseOrdersBlockedFor--'), vendorProcureToPay.blockedPurchasingEntities) : getStatusTooltip(t('--purchaseOrdersNotEnabledFor--'), vendorProcureToPay.unmatchedPurchasingEntities)}>
                                      <div className={classNames(styles.statusChip, styles.unmatched)}>
                                        <div className={styles.warning}><AlertCircle size={16} color={"var(--warm-misc-bold-orange)"}/></div>
                                        <span>{t('--purchase--')}</span>
                                      </div>
                                    </OroTooltip>
                                  </div>}
                                </>
                            }
                            {
                               !canShowActivationStatus() && !canShowVendorProcureToPayStatus () && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                  <div className={styles.statusLabel}>{t('--enabledFor--')}</div>
                                  <div className={styles.statusValue}>
                                    {props.supplier?.selectedVendorRecord?.companyEntityRef?.name}
                                    {props.supplier?.selectedVendorRecord?.companyEntityRef?.id && ` (${props.supplier?.selectedVendorRecord?.companyEntityRef?.id})`}
                                    {props.supplier?.selectedVendorRecord?.additionalCompanyEntities?.length > 0 && <>
                                      ,
                                      <OroTooltip title={getCompanyEntityTooltip()}>
                                        <div className={styles.more}> +{props.supplier?.selectedVendorRecord?.additionalCompanyEntities.length}</div>
                                      </OroTooltip>
                                    </>}
                                  </div>
                                </div>
                            }
                            {/* {activationStatus === ActivationStatus.active && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                <div className={styles.supplierCardTemplateStatusCardItemLabelActive}>
                                    <Check size={12} color="var(--warm-prime-chalk)"></Check>
                                </div>
                                {t('--active--')}
                            </div>} */}
                            
                            {/* {activationStatus === ActivationStatus.duplicate && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                <Info size={16} color="var(--warm-neutral-shade-200)"></Info>
                                {t('--notOnboardedFor--')}
                            </div>} */}
                            {/* {activationStatus === ActivationStatus.requiresActivation && <>
                                {purchasingEnabled && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                    <Info size={16} color="var(--warm-stat-chilli-regular)"></Info>
                                    {t('--blockedForPurchasing--')}
                                </div>}
                                {!purchasingEnabled && <div className={styles.supplierCardTemplateStatusCardItemLabel}>
                                    <Info size={16} color="var(--warm-neutral-shade-200)"></Info>
                                    {t('--requiresActivation--')}
                                </div>}
                            </>} */}
                            {/* {props.processVariables && props.processVariables.companyEntities?.length > 0 && <div className={styles.supplierCardTemplateStatusCardItemValue}>{props.processVariables.companyEntities.map(item => item.name).join(', ')}</div>} */}
                        </div>}
                        {props.supplier?.supplierSelectionText && !props.supplier.isParent && <div className={styles.supplierCardTemplateStatusCardItem}>
                            <div className={styles.supplierCardTemplateStatusCardItemNotSureSupplier}>
                                <div className={styles.info}>
                                    <AlertCircle size={20} color="var(--warm-stat-honey-lite)" fill="var(--warm-misc-bold-orange)"></AlertCircle>
                                    {t('--needsHelpInSelectingSupplier--')} -
                                    <OroButton className={styles.viewButton} type="link" theme="coco" label={t('--view--')} fontWeight="bold" onClick={triggerFetchVendor}></OroButton>
                                </div>
                                <div className={styles.comment}>&#x2018;{props.supplier?.supplierSelectionText}&#x2019;</div>
                            </div>
                        </div>}
                        {!props.supplier?.supplierSelectionText && !props.supplier.isParent && props.vendorCurrency?.name && activationStatus !== ActivationStatus.newSupplier && (activationStatus === ActivationStatus.requiresActivation && !purchasingEnabled) && <div className={styles.supplierCardTemplateStatusCardItem}>
                            <div className={styles.supplierCardTemplateStatusCardItemLabel}>{t('--currencies--')}</div>
                            <div className={styles.supplierCardTemplateStatusCardItemValue}>{props.vendorCurrency.name}</div>
                        </div>}
                        {props.supplier.isParent && <div className={styles.supplierCardTemplateStatusCardItem}>
                            <div className={styles.supplierCardTemplateStatusCardItemNotSureSupplier}>
                                <div className={styles.info}>
                                    {t('--associatedWithMultipleSuppliers--')} -
                                    <OroButton className={styles.viewButton} type="link" theme="coco" label={t('--view--')} fontWeight="bold" onClick={triggerFetchVendor}></OroButton>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>}
                {showDuplicateSupplierModal &&
                    <DuplicateSupplierModal
                        open={showDuplicateSupplierModal}
                        vendors={props.supplier.potentialMatchesSupplierSummary}
                        newSupplier={supplierFormData}
                        supplierFinalizationCheck={props.supplierFinalizationCheck}
                        allowParentRecordSelection={props.allowGroupSelection}
                        onSelect={onVendorSelect}
                        onIgnoreMatch={handleOnIgnoreMatch}
                        onClose={handleCloseDuplicateSupplierModal}
                        handleDuplicateMatchNotSure={handleDuplicateMatchNotSure}
                        onParentRecordSelect={onParentVendorSelect}
                    />}
                <Modal open={contactPopup} onClose={() => {
                    setContactPopup(false)
                    setExistingUserList([])
                    setSelectedSupplierContact(null)
                }}>
                    <div className={styles.supplierContactForm}>
                        <Contact
                            title={existingUserList?.length > 0 ? t('--selectContact--') : selectedSupplierContact ? t('--updateContact--') : t('--addContact--')}
                            supplierRoles={props.supplierRoles}
                            fields={props.fields || []}
                            disallowFreeEmailDomain={disallowFreeEmailDomain}
                            alreadyExistingVendorContact={existingUserList}
                            contact={selectedSupplierContact}
                            isNewSupplier={props.supplier.newSupplier}
                            onClose={() => { setContactPopup(false); setSelectedSupplierContact(null); setExistingUserList([]) }}
                            addPersonContact={addPersonContact}
                        />
                    </div>
                </Modal>
                <Modal open={taxDetailsPopup} onClose={() => { setTaxDetailsPopup(false) }}>
                    <div className={styles.supplierContactForm}>
                        <TaxDetails
                            country={mapAlpha2codeToDisplayName(props.supplier?.jurisdictionCountryCode)}
                            jurisdictionCountryCode={props.supplier?.jurisdictionCountryCode}
                            taxKeys={props.taxKeys}
                            isTaxRequired={istaxDetailsNeedToBeProvided}
                            isIndirectTaxRequired={isIndirectTaxDetailsNeedToBeProvided}
                            taxCodeFormatError={props.taxCodeFormatError}
                            indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                            tax={props.supplier?.tax || null}
                            inDirectTax={props.supplier?.indirectTax || null}
                            onClose={() => setTaxDetailsPopup(false)}
                            validateTaxFormat={props.validateTaxFormat}
                            updateTaxDetails={(tax, indirectDetails) => handleTaxUpdateForSupplier(tax, indirectDetails)}
                        />
                    </div>
                </Modal>
                {vendorResultPopup &&
                    <SupplierSearchResultModal
                        searchString=""
                        vendors={vendors}
                        isViewRecord={true}
                        supplierFinalizationCheck={props.supplierFinalizationCheck}
                        isInPortal={props.isInPortal}
                        allowParentRecordSelection={props.allowGroupSelection}
                        countryOption={props.countryOption}
                        companyEntity={props.companyEntityOption}
                        fetchChildren={props.fetchChildren}
                        searchOptions={props.searchOptions}
                        onAdvanceSearch={handleAdvanceSearch}
                        onSelect={onVendorSelect}
                        onClose={() => { setVendorResultPopup(false); setVendors([]); }}
                        onParentRecordSelect={onParentVendorSelect}
                    />}
                {showOrderingAddressPopup &&
                    <OrderingAddressModal
                        open={showOrderingAddressPopup}
                        vendor={vendorDetail}
                        orderingAddress={orderingAddress}
                        purchaseOrgs={props.processVariables?.purchaseOrgs || []}
                        isOrderingAddressMandatory={isOrderingAddressMandatory}
                        onOrderingAddressSelect={handleOrderingAddressSelect}
                        onClose={() => { setShowOrderingAddressPopup(false); }}
                    />}
            </div>}
            {editSupplier && <div>
                <AddNewSupplier
                    supplierFormConfigurationFields={props.fields || []}
                    formData={supplierFormData}
                    countryOptions={props.countryOption}
                    languageOptions={props.languageOption}
                    taxKeys={props.taxKeys}
                    taxCodeFormatError={props.taxCodeFormatError}
                    indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                    onValueChange={onNewSupplierAddValueChange}
                    validateTaxFormat={props.validateTaxFormat}
                    onFormSubmit={onUpdateSupplier}
                    onClose={handleAddNewSupplierClose} />
            </div>}
            {/* TODO: Check the message text with Swaroop. Added dummy for now. */}
            <SnackbarComponent message={t('--pleaseSelectVendor--')} isSmoother open={cannotFinalizeNotSureSupplier} onClose={() => setCannotFinalizeNotSureSupplier(false)} autoHideDuration={4000}></SnackbarComponent>
        </div>
    )
}

export function SupplierCardComponent(props: SupplierCardProps) {
    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)
    const [suppliers, setSuppliers] = useState<Array<Supplier>>([])
    const [supplierPerPage, setSupplierPerPage] = useState<number>()
    useEffect(() => {
        setSuppliers(props.suppliers)
        if (props.suppliers && props.supplierFinalizationCheck && props.supplierSelected) {
            setSupplierPerPage(1)
        } else {
            setSupplierPerPage(props.suppliers.length)
        }
    }, [props.suppliers, props.supplierSelected, props.supplierFinalizationCheck])

    function onSupplierRemove(index: number) {
        if (props.onSupplierRemove) {
            const allSuppliers = props.suppliers
            allSuppliers.splice(index, 1)
            if (props.supplierFinalizationCheck && index === 0) {
                props.onSupplierRemove(allSuppliers, false)
            } else {
                props.onSupplierRemove(allSuppliers)
            }
        }
    }
    function updateSupplierList(supplier: Supplier, index: number, action?: FormAction) {
        if (props.updateSupplierList) {
            const allSuppliers = props.suppliers
            allSuppliers[index] = supplier
            props.updateSupplierList(allSuppliers, action)
        }
    }
    function onSupplierFinalize(selected: boolean, oldIndex: number) {
        if (props.onSupplierFinalize) {
            const updatedSupplierList = changeDataIndexInArray(props.suppliers, oldIndex, 0)
            props.onSupplierFinalize(selected, updatedSupplierList)
        }
    }
    async function fetchVendorByLegalEntityId(supplier: Supplier): Promise<NormalizedVendor[]> {
        return props.fetchVendorByLegalEntityId(supplier)
            .then((resp) => {
                const mappNormalizedVendors = resp.map(mapNormalizedVendor)
                return filterNVWithSuppliers(mappNormalizedVendors, suppliers)
            })
            .catch(err => err)
    }
    async function onAdvanceSearch(searchPayload: VendorSuggestionRequest): Promise<SupplierSearchSummary[]> {
        return props.onAdvanceSearch(searchPayload)
            .then((resp) => {
                return filterSupplierSearchSummaryWithSuppliers(resp, suppliers)
            })
            .catch(err => err)
    }
    return (
        <div className={classNames(styles.supplierCard, { [styles.fullWidth] : props.isGPTView })}>
            <div className={styles.supplierCardTitle}>{t('--selectedSupplier--')}</div>
            <div className={styles.supplierCardList}>
                {
                    suppliers.slice(0, supplierPerPage).map((supplier, index) => {
                        return (
                            <SupplierCardRow
                                key={index}
                                fields={props.fields}
                                supplierRoles={props.supplierRoles}
                                supplier={supplier}
                                forceValidate={props.forceValidate}
                                companyEntities={props.companyEntities}
                                processVariables={props.processVariables}
                                vendorCurrency={props.vendorCurrency}
                                countryOption={props.countryOption}
                                companyEntityOption={props.companyEntity}
                                indirectTaxCodeFormatError={props.indirectTaxCodeFormatError}
                                languageOption={props.languageOption}
                                taxCodeFormatError={props.taxCodeFormatError}
                                taxKeys={props.taxKeys}
                                isReadonly={props.isReadonly}
                                isInPortal={props.isInPortal}
                                isGPTView={props.isGPTView}
                                supplierSelected={props.supplierFinalizationCheck && props.supplierSelected && index === 0}
                                supplierFinalizationCheck={props.supplierFinalizationCheck}
                                supplierWithContactError={props.supplierWithContactError}
                                fetchChildren={props.fetchChildren}
                                searchOptions={props.searchOptions}
                                validateTaxFormat={props.validateTaxFormat}
                                onSupplierFinalize={(selected) => onSupplierFinalize(selected, index)}
                                updateSupplierList={(supplier, action) => updateSupplierList(supplier, index, action)}
                                onAddContact={(supplier) => props.onAddContact(supplier, index)} // used in GPT Flow
                                onSupplierRemove={() => onSupplierRemove(index)}
                                fetchExistingContactList={props.fetchExistingContactList}
                                fetchNVDetailsForDuplicateSupplier={props.fetchNVDetailsForDuplicateSupplier}
                                fetchVendorByLegalEntityId={fetchVendorByLegalEntityId}
                                onAdvanceSearch={onAdvanceSearch}
                                fetchVendorById={props.fetchVendorById}
                                disallowFreeEmailDomain={props.disallowFreeEmailDomain}
                                fetchVendorsForOrderingAddress={props.fetchVendorsForOrderingAddress}
                            />
                        )
                    })
                }
                {props.suppliers.length > 1 && props.supplierFinalizationCheck && props.supplierSelected && <div className={styles.supplierCardListMoreOptions}>
                    <div className={styles.supplierCardListMoreOptionsBorder}></div>
                    {supplierPerPage === 1 && <div className={styles.supplierCardListMoreOptionsText} onClick={() => setSupplierPerPage(props.suppliers.length)}>{t('--viewOtherOptions--')} <ChevronDown size={18} color="var(--warm-neutral-shade-200)"></ChevronDown> </div>}
                    {supplierPerPage > 1 && <div className={styles.supplierCardListMoreOptionsText} onClick={() => setSupplierPerPage(1)}>{t('--viewLessOptions--')} <ChevronUp size={18} color="var(--warm-neutral-shade-200)"></ChevronUp> </div>}
                    <div className={styles.supplierCardListMoreOptionsBorder}></div>
                </div>}
            </div>
        </div>
    )
}

export function SupplierCard(props: SupplierCardProps) {
    return <I18Suspense><SupplierCardComponent {...props}></SupplierCardComponent></I18Suspense>
}