import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Edit3, MoreVertical, Plus, Trash2, X } from "react-feather";
import { OroButton } from "../controls";
import { getFormFieldConfig } from ".";
import { SupplierCapabilitiesDetails } from "../SupplierDetails/CapabilitiesDetails/supplier-capabilities-details.component";
import { SupplierSegmentationComponent } from "./components/supplier-segmentation.component";
import { IDRef, Option, SupplierCapabilities } from "../Types";
import { SegmentationDetail, SupplierSegmentation } from "../Types/vendor";
import { Field, UpdateSupplierScopeFormData, UpdateSupplierScopeOfUseProps } from "./types";

import styles from "./updateSupplierScopeOfUse-form-styles.module.scss"
import { buildCapabilityScope, mapSegmentationToCapabilities, resetSelectedOption } from "./util";
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";
import EmptyScope from './assets/EmptyIcon.png'

interface CapabilitiesProps {
    item: SegmentationDetail
    index: number
    readOnly?: boolean
    showExpandedView?: boolean
    isDetailView?: boolean
    supplierUpdatePermission?: boolean
    isDeletedScope?: boolean
    supplierCapability?: SupplierCapabilities
    goodServicesOptions?: Option[]
    regionOptions?: Option[]
    siteOptions?: Option[]
    productOptions?: Option[]
    productStageOptions?: Option[]
    preferredStatusOptions?: Option[]
    restrictionOptions?: Option[]
    hasSupplierUpdatePermission?: boolean
    onEdit?: (scope: SegmentationDetail, index: number) => void
    onDelete?: (scope: SegmentationDetail, index: number) => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierCapabilities) => void
}

export function Capabilities (props: CapabilitiesProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
    const [showEditScope, setShowEditScope] = useState<boolean>(false)
    const [selectedCapability, setSelectedCapability] = useState<SupplierCapabilities | undefined>(undefined)

    const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSCOPE)
    
    function onExpandIconClick () {
      setIsExpanded(!isExpanded)
    }
    
    function canEditDeleteCapability (detail: SegmentationDetail) {
      return (detail.segmentation === null || detail.segmentation === SupplierSegmentation.prospect) ? true : (props.supplierUpdatePermission || false)
    }
  
    function onScopeEdit (e) {
        e.stopPropagation()
        setIsPopoverOpen(false)
        setIsExpanded(false)

        const currentCapability = mapSegmentationToCapabilities(props.item, props.preferredStatusOptions)
        setSelectedCapability(currentCapability)
        setShowEditScope(true)
    }
    
    function onScopeDelete (e) {
        e.stopPropagation()
        setIsPopoverOpen(false)
        setIsExpanded(false)
        if (props.onDelete) {
          props.onDelete(props.item, props.index)
        }
    }

    function closeForm () {
        setShowEditScope(false) 
    }
  
    function ConstrainsElement (props: {label: string, contrains: Array<IDRef>, isDeletedScope?: boolean}) {
      return (
        <div className={styles.capabilitiesRowDescriptionConstrainItems}>
          <div className={`${styles.capabilitiesRowDescriptionConstrainItemsLabel} ${props.isDeletedScope ? styles.deletedScope: ''}`}>{props.label}</div>
          <div className={`${styles.capabilitiesRowDescriptionConstrainItemsText} ${props.isDeletedScope ? styles.deletedScope: ''}`}>{props.contrains.map(contrain => contrain.name).join(', ')}</div>
        </div>
      )
    }
  
    function canShowDimensions () {
      return (props.item?.dimension?.regions && props.item.dimension.regions.length > 0) || (props.item?.dimension?.sites && props.item.dimension.sites.length > 0) ||
             (props.item?.dimension?.departments && props.item.dimension.departments.length > 0) || (props.item?.dimension?.products && props.item.dimension.products.length > 0) ||
             (props.item?.dimension?.productStages && props.item.dimension.productStages.length > 0) || (props.item?.dimension?.companyEntities && props.item.dimension.companyEntities.length > 0) ||
             (props.item?.dimension?.programs && props.item.dimension.programs.length > 0)
    }

    function onPopoverToggle (e) {
        e.stopPropagation()
        setIsPopoverOpen(!isPopoverOpen)
    }
    
    function hidePopover (e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        setIsPopoverOpen(false)
    }

    function onEditCapability (scope: SupplierCapabilities) {
        const addedScopeDetails = buildCapabilityScope(scope, props.item)
        setShowEditScope(false)
        if (props.onEdit) {
          props.onEdit(addedScopeDetails, props.index)
        }
    }

    return (<>
        {!showEditScope && <div className={`${styles.capabilitiesRow} ${props.readOnly ? styles.readOnlyRow : ''}`}>
            <div className={`${styles.capabilitiesContainer}`}>
                <div className={styles.capabilitiesOfferingsContainer}>
                    <div>
                        <div className={styles.capabilitiesRowItem}>
                            {props.item?.description &&
                                <div className={`${styles.title} ${props.isDeletedScope ? styles.deletedScope : ''}`}>
                                    {props.item?.description}
                                </div>
                            }
                            {!props.item?.description && <div className={`${styles.title} ${props.isDeletedScope ? styles.deletedScope : ''}`}>
                                <div className={`${styles.details}`}>
                                    {props.item?.dimension?.categories.map((item, index) => {
                                        return (
                                        <span className={`${styles.text} ${props.isDeletedScope ? styles.deletedScope : ''}`} key={index}>{item.name}</span>
                                        )
                                    })}
                                </div>
                            </div>}
                        </div>
                        {(props.item?.description) && <div className={`${styles.capabilitiesRowItem} ${styles.capabilitiesRowDimension}`}>
                            <div className={styles.details}>
                                {props.item?.dimension?.categories.map((item, index) => {
                                return (
                                    <span className={`${styles.text} ${props.isDeletedScope ? styles.deletedScope : ''}`} key={index}>{item.name}</span>
                                )
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
                <div className={`${styles.capabilitiesRowActionBtn}`}>
                   {props.item?.segmentation && <SupplierSegmentationComponent status={props.item?.segmentation} isDeletedScope={props.isDeletedScope}/>}

                   { !props.readOnly && canEditDeleteCapability(props.item) &&
                    <div className={styles.moreDetailsAction}>
                        <MoreVertical size={18} color="var(--warm-neutral-shade-200)" cursor="pointer" onClick={onPopoverToggle} />
                        { isPopoverOpen &&
                        <div className={styles.moreDetailsActionPopoverContainer}>
                            <ul className={styles.moreDetailsActionList}>
                                <li className={styles.moreDetailsActionListItem} onClick={onScopeEdit}>
                                <Edit3 size={18} color="var(--warm-neutral-shade-200)"/>
                                <span>{t('Edit')}</span>
                                </li>
                                <li className={styles.moreDetailsActionListItem} onClick={onScopeDelete}>
                                    <Trash2 size={18} color="var(--warm-neutral-shade-200)"/>
                                    <span>{t('Delete')}</span>
                                </li>
                            </ul>
                        </div>}
                        { isPopoverOpen && <div className={`${styles.moreDetailsActionPopoverBackdrop}`} onClick={hidePopover}></div> }
                    </div>}
                </div>
            </div>
            {(canShowDimensions()) &&
                <div className={`${styles.capabilitiesRowDescription} ${!props.item?.description ? styles.mrgTop0 : ''}`}>
                <div className={`${styles.sectionTitle} ${props.isDeletedScope ? styles.deletedScope: ''}`}>Applicable only for</div>
                <div className={styles.capabilitiesRowDescriptionConstrain}>
                    {props.item?.dimension?.regions && props.item.dimension.regions.length > 0 && <ConstrainsElement label={`${t('Regions')}:`} contrains={props.item.dimension.regions} isDeletedScope={props.isDeletedScope}/>}
                    {props.item?.dimension?.sites && props.item.dimension.sites.length > 0 && <ConstrainsElement label={`${t('Sites')}:`} contrains={props.item.dimension.sites} isDeletedScope={props.isDeletedScope}/>}
                    {props.item?.dimension?.departments && props.item.dimension.departments.length > 0 && <ConstrainsElement label={`${t('Department')}:`} contrains={props.item.dimension.departments} isDeletedScope={props.isDeletedScope}/>}
                    {props.item?.dimension?.products && props.item.dimension.products.length > 0 && <ConstrainsElement label={`${t('Products')}:`} contrains={props.item.dimension.products} isDeletedScope={props.isDeletedScope}/>}
                    {props.item?.dimension?.productStages && props.item.dimension.productStages.length > 0 && <ConstrainsElement label={`${t('Products Stages')}:`} contrains={props.item.dimension.productStages} isDeletedScope={props.isDeletedScope}/>}
                    {props.item?.dimension?.companyEntities && props.item.dimension.companyEntities.length > 0 && <ConstrainsElement label={`${t('Company Entity')}:`} contrains={props.item.dimension.companyEntities} isDeletedScope={props.isDeletedScope}/>}
                    {props.item?.dimension?.programs && props.item.dimension.programs.length > 0 && <ConstrainsElement label={`${t('Program')}:`} contrains={props.item.dimension.programs} isDeletedScope={props.isDeletedScope}/>}
                </div>
                </div>}
        </div>}
        {showEditScope && <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <span className={styles.title}>{t('Edit scope of use')}</span>
                    <X size={18} color="var(--warm-neutral-shade-300)" onClick={closeForm} cursor="pointer"/>
                </div>
                <div className={styles.col4}>
                    <SupplierCapabilitiesDetails
                        supplierCapability={selectedCapability}
                        goodServicesOptions={props.goodServicesOptions}
                        regionOptions={props.regionOptions}
                        siteOptions={props.siteOptions}
                        productOptions={props.productOptions}
                        productStageOptions={props.productStageOptions}
                        preferredStatusOptions={props.preferredStatusOptions}
                        restrictionOptions={props.restrictionOptions}
                        hasSupplierUpdatePermission={props.supplierUpdatePermission}
                        onSubmitDetails={onEditCapability}
                        onCancel={closeForm}
                        onReady={props.onReady}
                    />
                </div>
            </div>
            }
    </>)
}

export function UpdateSupplierScopeOfUse (props: UpdateSupplierScopeOfUseProps) {
    const [supplierScope, setSupplierScope] = useState<SegmentationDetail[]>([])
    const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
    const [showScopeDetailForm, setShowScopeDetailsForm] = useState<boolean>(false)
    const [selectedScope, setSelectedScope] = useState<SegmentationDetail>(null)
    const [selectedCapabilityDetails, setSelectedCapabilityDetails] = useState<SupplierCapabilities | undefined>(undefined)
    const [currentIndex, setCurrentIndex] = useState<number>(-1)
    const [restrictionOption, setRestrictionOption] = useState<Option[]>([])
    const [fetchFormData, setFetchFormData] = useState<(skipValidation?: boolean) => SupplierCapabilities>()

    const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSCOPE)

    useEffect(() => {
        if (props.fields) {
          setFieldMap({
            segmentations: getFormFieldConfig('segmentations', props.fields)
          })
        }
    }, [props.fields])

    useEffect(() => {
        if (props.formData) {
           setSupplierScope(props.formData.segmentations)
        }
    }, [props.formData])

    useEffect(() => {
      props.restrictionOptions && setRestrictionOption(props.restrictionOptions)
    }, [props.restrictionOptions])

    function onDeleteScope (scope: SegmentationDetail, index: number) {
      setCurrentIndex(index)
      if (index > -1) {
        const scopeCopy = [...supplierScope]
        scopeCopy.splice(index, 1)
        setSupplierScope(scopeCopy)
      }
    }

    function onEditScope (updatedScopeDetails: SegmentationDetail, index: number) {
      setCurrentIndex(index)
      const updatedScope = supplierScope.map((scope, indexElm) => indexElm === index ? updatedScopeDetails : scope)
      setSupplierScope(updatedScope)
      setRestrictionOption(resetSelectedOption(restrictionOption))
    }

    function showFormLayout () {
      if (!showScopeDetailForm) {  
        setSelectedScope(null)
        setSelectedCapabilityDetails(undefined)
        setShowScopeDetailsForm(true)
      }
    }

    function closeForm () {
      setShowScopeDetailsForm(false)
      // reset restrictionOption
      setRestrictionOption(resetSelectedOption(restrictionOption))
    }

    function onAddCapabilityDetails (scope: SupplierCapabilities) {
        const addedScopeDetails = buildCapabilityScope(scope, selectedScope)
        setSupplierScope([...supplierScope, addedScopeDetails])
        setShowScopeDetailsForm(false)
        // reset restrictionOption
        setRestrictionOption(resetSelectedOption(restrictionOption))
    }

    function getFormData (): UpdateSupplierScopeFormData {
        return {
          segmentations: supplierScope
        }
    }

    function handleFormSubmit () {
        if (fetchFormData) {
            const formData = fetchFormData()
            if (formData && props.onSubmit) {
              props.onSubmit(getFormData())
            }
        } else if (props.onSubmit) {
            props.onSubmit(getFormData()) 
        }
    }

    function handleFormCancel () {
        if (props.onCancel) {
          props.onCancel()
        }
    }

    function fetchData (skipValidation?: boolean): UpdateSupplierScopeFormData {
        if (skipValidation) {
          return getFormData()
        } else {
          const formData = showScopeDetailForm ? fetchFormData() : true
          return formData ? getFormData() : null
        }
    }

    function handleFormReady (fetchFormFunction) {
        if (fetchFormFunction) {
            setFetchFormData(() => fetchFormFunction)
        }
    }

    useEffect(() => {
        if (props.onReady) {
          props.onReady(fetchData)
        }
    }, [supplierScope, showScopeDetailForm, fetchFormData])


    return (<>
        <div className={styles.supplierScopeForm}>
            <div className={`${styles.headerContainer}`}>
                <h3 className={styles.headerContainerTitle}>{t('Add, edit or delete scope of use')}</h3>
            </div>
            {supplierScope && supplierScope?.length > 0 &&
                <div className={styles.capabilitiesSection}>
                  <div>
                    {supplierScope.map((capability: SegmentationDetail, index: number) => {
                        return (
                        capability?.dimension
                            ? <div key={index} className={styles.capabilitiesList}>
                                <Capabilities 
                                   index={index} 
                                   item={capability}
                                   supplierUpdatePermission={props.hasSupplierUpdatePermission}
                                   goodServicesOptions={props.goodServicesOptions}
                                   regionOptions={props.regionOptions}
                                   siteOptions={props.siteOptions}
                                   productOptions={props.productOptions}
                                   productStageOptions={props.productStageOptions}
                                   preferredStatusOptions={props.preferredStatusOptions}
                                   restrictionOptions={restrictionOption}
                                   onDelete={onDeleteScope} 
                                   onEdit={onEditScope}
                                   onReady={handleFormReady}/>
                            </div>
                            : <></>
                        )})
                    }
                  </div>
                    {!showScopeDetailForm && <div className={`${styles.actionBtn} ${showScopeDetailForm ? styles.disableAdd : ''}`} onClick={() => showFormLayout()}>
                        <Plus color='var(--warm-neutral-shade-400)' size={16} /><span>{t('Add scope of use')}</span>
                    </div>}
                </div>
            }
            {showScopeDetailForm && <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <span className={styles.title}>{t('Add scope of use')}</span>
                    <X size={18} color="var(--warm-neutral-shade-300)" onClick={closeForm} cursor="pointer"/>
                </div>
                <div className={styles.col4}>
                    <SupplierCapabilitiesDetails
                        goodServicesOptions={props.goodServicesOptions}
                        regionOptions={props.regionOptions}
                        siteOptions={props.siteOptions}
                        productOptions={props.productOptions}
                        productStageOptions={props.productStageOptions}
                        preferredStatusOptions={props.preferredStatusOptions}
                        restrictionOptions={restrictionOption}
                        supplierCapability={selectedCapabilityDetails}
                        hasSupplierUpdatePermission={props.hasSupplierUpdatePermission}
                        onSubmitDetails={onAddCapabilityDetails}
                        onCancel={closeForm}
                        onReady={handleFormReady}
                    />
                </div>
            </div>
            }
            {supplierScope && supplierScope.length === 0 && !showScopeDetailForm &&
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateRow}>
                        <div className={styles.emptyStateRowDetails}>
                        <img src={EmptyScope} />
                        <div className={styles.emptyStateRowDetailsContainer}>
                            <span className={styles.line1}>There are no scope of use added to this supplier</span>
                            <div className={styles.line2}>
                              Please <div className={styles.action} onClick={() => showFormLayout()}>click here</div> to add scope of use
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            }
            <div className={styles.actionContainer}>
              {(props.submitLabel || props.cancelLabel) &&
                    <>
                    { props.cancelLabel &&
                        <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
                    { props.submitLabel &&
                        <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' onClick={handleFormSubmit} />}
                    </>
                }
            </div>
        </div>
        </>
    )

}