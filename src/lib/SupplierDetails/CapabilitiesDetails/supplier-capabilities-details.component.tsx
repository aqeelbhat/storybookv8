import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { OroButton } from "../../controls";
import { MultiSelect, TextArea, TextBox, TypeAhead } from "../../Inputs";
import { SupplierCapabilities } from "../../Types/supplier";
import { Option, OroMasterDataType } from "../../Types";
import styles from './styles.module.scss'
import { isEmpty } from "../../Form/util";
import { getConditionValues, getDefaultSelectedOptions, updateHierarchyForSelectedOptions } from "./ScopeSelector/option-utils.service";
import { ConditionValuesMap } from "./ScopeSelector/types";
import { ScopeSelector } from "./ScopeSelector/scope-selelctor.component";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { OptionTreeData } from "../../MultiLevelSelect/types";

export interface SupplierCapabilitiesDetailsProps {
    supplierCapability?: SupplierCapabilities
    goodServicesOptions: Option[]
    regionOptions: Option[]
    siteOptions: Option[]
    productOptions: Option[]
    productStageOptions: Option[]
    preferredStatusOptions: Option[]
    restrictionOptions: Option[]
    hasSupplierUpdatePermission?: boolean
    fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string) => Promise<Option[]>
    searchOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onSubmitDetails?: (supplier: SupplierCapabilities) => void
    onCancel?: () => void
    onReady?: (fetchData: (skipValidation?: boolean) => SupplierCapabilities) => void
}

export function SupplierCapabilitiesDetails (props: SupplierCapabilitiesDetailsProps) {
   const [title, setTitle] = useState<string>('')
   const [goodServices, setGoodServices] = useState<Option[]>([])
   const [selectedCategory, setSelectedCategory] = useState<Option[]>([])
   const [selectedRegions, setSelectedRegions] = useState<Option[]>([])
   const [selectedSites, setSelectedSites] = useState<Option[]>([])
   const [selectedProducts, setSelectedProducts] = useState<Option[]>([])
   const [selectedProductStages, setSelectedProductStages] = useState<Option[]>([])
   const [restrictions, setRestrictions] = useState<Option[]>([])
   const [preferredStatus, setPreferredStatus] = useState<Option>(null)
   const [preferredStatusOptions, setPreferredStatusOptions] = useState<Option[]>([])
   const [description, setDescription] = useState<string>('')
   const [filteredRestrictions, setFilteredRestrictions] = useState<Option[]>([])
   const [restrictionValues, setRestrictionValues] = useState<ConditionValuesMap>({})
   const [forceValidate, setForceValidate] = useState<boolean>(false)
   const [showCapabilitiesModal, setShowCapabilitiesModal] = useState<boolean>(false)

   const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSCOPE)

   useEffect(() => {
    if (props.supplierCapability) {
      setTitle(props.supplierCapability.name || '')
      setDescription(props.supplierCapability.description || '')
      setPreferredStatus(props.supplierCapability.preferredStatus)
      setGoodServices(props.supplierCapability.categories)
      setSelectedCategory(props.supplierCapability.categories)
      setSelectedRegions(props.supplierCapability.regions)
      setSelectedSites(props.supplierCapability.sites)
      setSelectedProducts(props.supplierCapability.products)
      setSelectedProductStages(props.supplierCapability.productStages)
      if (props.supplierCapability.restrictions && props.supplierCapability.restrictions.length > 0) {
        setFilteredRestrictions(setSelected(props.restrictionOptions, props.supplierCapability.restrictions))
      }
    } else {
      setFilteredRestrictions(props.restrictionOptions || [])
    }
   }, [props.supplierCapability])

   useEffect(() => {
    setPreferredStatusOptions(props.preferredStatusOptions || [])
   }, [props.preferredStatusOptions])

    useEffect(() => {
      if (filteredRestrictions && filteredRestrictions.length > 0) {
        const selectedValues = getDefaultSelectedOptions(filteredRestrictions, '')
        setRestrictionValues(getConditionValues(selectedValues))
      }
    }, [filteredRestrictions])

   useEffect(() => {
    if (props.supplierCapability) {
      const selected = setSelected(props.restrictionOptions, props.supplierCapability.restrictions)
      setRestrictions(updateHierarchyForSelectedOptions(selected, props.supplierCapability.restrictions, ''))
      setFilteredRestrictions(selected)
    } else {
      setFilteredRestrictions(props.restrictionOptions || [])
    }
  }, [props.restrictionOptions])

    function getUpdateDetails (): SupplierCapabilities {
        return {
          id: props.supplierCapability ? props.supplierCapability.id: null,
          name: title ? title : '',
          categories: goodServices ? goodServices : [],
          regions: selectedRegions ? selectedRegions : [],
          sites: selectedSites ? selectedSites : [],
          products: selectedProducts ? selectedProducts : [],
          productStages: selectedProductStages ? selectedProductStages : [],
          preferredStatus: preferredStatus ? preferredStatus : null,
          restrictions: restrictions ? restrictions : [],
          description: description ? description : ''
        }
    }

    function isFormInvalid (): string {
      let invalidFieldId = ''
      let isInvalid = false
     
      isInvalid = !(goodServices && goodServices.length > 0)      
      invalidFieldId = !(goodServices && goodServices.length > 0) ? 'supplier-scope-goodservice-field' : ''
      return isInvalid ? invalidFieldId : ''

    }

    function triggerValidations (invalidFieldId: string) {
      setForceValidate(true)
      setTimeout(() => {
        setForceValidate(false)
      }, 1000)
  
      const input = document.getElementById(invalidFieldId)
      if (input?.scrollIntoView) {
        input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      }
    }

    function submitDetails() {
      const invalidFieldId = isFormInvalid()
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      } else if (props.onSubmitDetails) {
        props.onSubmitDetails(getUpdateDetails())
      }
    }

    function handleCancel () {
        if (props.onCancel) {
          props.onCancel()
        }
    }

    function setSelected (options?: Array<Option>, values?: Array<Option>) {
      const selectedRestriction = options && options.map(option => {
        option.selectable = true
        const isSelected = values && values.find(opt => opt.path === option.path)
        option.selected = isSelected ? true : false
        setSelected(option.children, values)
        return option
      })
      return selectedRestriction
    }

    function handleRestrictionSubmit (selectedOptions: Option[]) {
      setRestrictions(selectedOptions)
      setRestrictionValues(getConditionValues(selectedOptions))
      setFilteredRestrictions(setSelected(filteredRestrictions, selectedOptions))
      setShowCapabilitiesModal(false)
    }

    function getRestrictionStrings (): JSX.Element[] {
      const conditionStrings: JSX.Element[] = []
      for (const value in restrictionValues) {
        conditionStrings.push(<span><strong>{value}:</strong> {restrictionValues[value].join(', ')}</span>)
      }
      return conditionStrings
    }

    // function autoPopulateTitle (option: Option[]) {
    //   option && setTitle(option.map(opt => opt.displayName).join(', '))
    // }

    function canShowRestrictionsInline (): boolean {
      return restrictions.length > 0 || selectedRegions.length > 0 || selectedSites.length > 0 || selectedProducts.length > 0 || selectedProductStages.length > 0
    }

    function fetchData (skipValidation?: boolean): SupplierCapabilities {
      if (skipValidation) {
        return getUpdateDetails()
      } else {
        const invalidFieldId = isFormInvalid()
  
        if (invalidFieldId) {
          triggerValidations(invalidFieldId)
        }
  
        return invalidFieldId ? null : getUpdateDetails()
      }
    }

    useEffect(() => {
      if (props.onReady) {
        props.onReady(fetchData)
      }
    }, [selectedCategory, description, selectedRegions, selectedSites, selectedProducts, selectedProductStages, preferredStatus, props.supplierCapability])

    function fetchChildren (masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
      if (props.fetchChildren) {
        return props.fetchChildren(parent, childrenLevel, masterDataType)
      } else {
        return Promise.reject('fetchChildren API not available')
      }
    }

    function searchMasterdataOptions (keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
      if (props.searchOptions) {
        return props.searchOptions(keyword, masterDataType)
      } else {
        return Promise.reject('searchOptions API not available')
      }
    }

    return (<><div className={styles.supplierCapabilities}>
        <div className={styles.details}>
            <div className={styles.detailsSection}>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-scope-description-field">
                    <label className={styles.itemLabel}>{t('Define the purpose / scope of use')}</label>
                    <TextArea
                      value={description}
                      required={false}
                      placeholder={t('Enter..')}
                      forceValidate={false}
                      onChange={value => { setDescription(value); }}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-scope-goodservice-field">
                    <label className={styles.itemLabel}>{t('Select categories')}</label>
                    <MultiSelect
                      placeholder={t('Select categories')}
                      type={OptionTreeData.category}
                      value={selectedCategory}
                      options={props.goodServicesOptions}
                      showTree={true}
                      disabled={false}
                      required={true}
                      forceValidate={forceValidate}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('Category', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'Category')}
                      validator={(value) => isEmpty(value) ? t('Categories is a required field.') : ''}
                      onChange={value => { setSelectedCategory(value); setGoodServices(value || [])}}
                    />
                  </div>
                </div>
                <div className={styles.row} id="supplier-scope-restriction-field">
                  <label className={styles.itemLabel}>{t('Applicable for')}</label>
                  <div className={styles.supplierCapabilitiesDropdowns}>
                    {props.regionOptions && props.regionOptions.length > 0 && <div className={styles.supplierCapabilitiesDropdownsItem}>
                      <MultiSelect
                        label=""
                        placeholder={t('Region')}
                        required={true}
                        value={selectedRegions}
                        isListView
                        typeahead={false}
                        showElaborateLabel={false}
                        options={props.regionOptions}
                        onChange={setSelectedRegions}
                      />
                    </div>}
                    {props.siteOptions && props.siteOptions.length > 0 && <div className={styles.supplierCapabilitiesDropdownsItem}>
                      <MultiSelect
                        label=""
                        placeholder={t('Sites')}
                        required={true}
                        value={selectedSites}
                        isListView
                        typeahead={false}
                        showElaborateLabel={false}
                        options={props.siteOptions}
                        fetchChildren={(parent, childrenLevel) => fetchChildren('Site', parent, childrenLevel)}
                        onSearch={(keyword) => searchMasterdataOptions(keyword, 'Site')}
                        onChange={setSelectedSites}
                      />
                    </div>}
                    {props.productOptions && props.productOptions.length > 0 && <div className={styles.supplierCapabilitiesDropdownsItem}>
                      <MultiSelect
                        label=""
                        placeholder={t('Product')}
                        required={true}
                        value={selectedProducts}
                        isListView
                        typeahead={false}
                        showElaborateLabel={false}
                        options={props.productOptions}
                        fetchChildren={(parent, childrenLevel) => fetchChildren('Product', parent, childrenLevel)}
                        onSearch={(keyword) => searchMasterdataOptions(keyword, 'Product')}
                        onChange={setSelectedProducts}
                      />
                    </div>}
                    {props.productStageOptions && props.productStageOptions.length > 0 && <div className={styles.supplierCapabilitiesDropdownsItem}>
                      <MultiSelect
                        label=""
                        placeholder={t('Product Stage')}
                        required={true}
                        value={selectedProductStages}
                        isListView
                        typeahead={false}
                        showElaborateLabel={false}
                        options={props.productStageOptions}
                        fetchChildren={(parent, childrenLevel) => fetchChildren('ProductStage', parent, childrenLevel)}
                        onSearch={(keyword) => searchMasterdataOptions(keyword, 'ProductStage')}
                        onChange={setSelectedProductStages}
                      />
                    </div>}
                    <button className={styles.supplierCapabilitiesDropdownsOther} onClick={() => setShowCapabilitiesModal(!showCapabilitiesModal)}>Other{restrictions.length > 0 && <span className={styles.supplierCapabilitiesDropdownsOtherBadge}>{restrictions.length}</span>}</button>
                  </div>
                  {canShowRestrictionsInline() &&
                    <div className={`${styles.item} ${styles.col3} ${styles.selectedScope}`}> 
                      <ul className={styles.itemList}>
                        {
                          selectedRegions.length > 0 &&
                          <li className={styles.text}><span><strong>{t('Region')}:</strong> {selectedRegions.map(item => item.displayName).join(', ')}</span></li>
                        }
                        {
                          selectedSites.length > 0 &&
                          <li className={styles.text}><span><strong>{t('Sites')}:</strong> {selectedSites.map(item => item.displayName).join(', ')}</span></li>
                        }
                        {
                          selectedProducts.length > 0 &&
                          <li className={styles.text}><span><strong>{t('Product')}:</strong> {selectedProducts.map(item => item.displayName).join(', ')}</span></li>
                        }
                        {
                          selectedProductStages.length > 0 &&
                          <li className={styles.text}><span><strong>{t('Product Stage')}:</strong> {selectedProductStages.map(item => item.displayName).join(', ')}</span></li>
                        }
                        {
                          getRestrictionStrings().map((restriction, i) => {
                            return (
                              <li key={i} className={styles.text}>{restriction}</li>
                            )
                          })
                        }
                      </ul>
                    </div>}
                </div>
                <div className={styles.row}>
                  <div className={`${styles.item} ${styles.col3}`} id="supplier-scope-status-field">
                    <label className={styles.itemLabel}>{t('Status')}</label>
                    <TypeAhead
                      placeholder={t('Select')}
                      value={preferredStatus}
                      options={preferredStatusOptions}
                      disabled={false}
                      required={false}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('SupplierSegmentation', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'SupplierSegmentation')}
                      onChange={value => { setPreferredStatus(value) }}
                    />
                  </div>
                </div>
                {/* <div>
                  <div className={styles.titleRow}>
                    <label className={styles.titleRowLabel}>Scope details</label>
                  </div>
                  <div className={styles.row}>
                    <div className={`${styles.item} ${styles.col3}`} id="supplier-scope-title-field">
                      <label className={styles.itemLabel}>Short name</label>
                      <TextBox
                          placeholder='Enter'
                          value={title}
                          disabled={false}
                          required={true}
                          forceValidate={forceValidate}
                          validator={(value) => validateField('Name', value)}
                          onChange={value => {setTitle(value)}}
                      />
                      <span className={styles.itemHint}>A short text about the usage of selected services</span>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={`${styles.item} ${styles.col2}`} id="supplier-scope-status-field">
                      <label className={styles.itemLabel}>Status</label>
                      <TypeAhead
                          placeholder="Select"
                          value={preferredStatus}
                          options={preferredStatusOptions}
                          disabled={false}
                          required={false}
                          onChange={value => { setPreferredStatus(value) }}
                      />
                    </div>
                  </div>
                </div> */}
            </div>

            <div className={styles.detailsSection}>
                <div className={`${styles.row} ${styles.pdBt0}`}>
                    <div className={classNames(styles.item, styles.flex, styles.actionBtn)}>
                      <OroButton label={t('Cancel')}type="secondary" className={styles.cancelBtn} fontWeight="semibold" radiusCurvature="medium" onClick={handleCancel} theme="coco" />
                      <OroButton label={t('Save')} type="primary" className={styles.submitBtn} fontWeight="semibold" radiusCurvature="medium" onClick={submitDetails} theme="coco" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    { showCapabilitiesModal && 
      <ScopeSelector
        options={filteredRestrictions}
        isOpen={showCapabilitiesModal}
        toggle={() => setShowCapabilitiesModal(false)}
        onSubmit={handleRestrictionSubmit}
      />
    }
    </>
    )

}