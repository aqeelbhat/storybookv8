import React, { useEffect, useRef, useState } from 'react'
import { ICategoryRecommFormPropsV2, enumFields, ICategoryRecommFormDataV2, IRecommendation } from './types';
import { Field } from '../types';
import { Option, IDRef } from '../../Types'
import { getFormFieldsMap, mapOptionToIDRef, isRequired, mapIDRefToOption, areObjectsSame, recursiveDeepCopy } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import Actions from '../../controls/actions';
import { Grid } from '@mui/material';
import styles from './styles.module.scss';
import Logo from '../assets/oro-ai-v2.svg';
import { OroButton } from '../../controls';
import { AlertCircle, ChevronDown, ChevronUp, Circle, X } from 'react-feather';
import { OptionTreePopup } from '../../MultiLevelSelect/option-tree-popup.component';
import classNames from 'classnames';
import Check from './../assets/check-circle-filled.svg'
import ReadMoreText from '../../controls/ReadMore';
import { OptionTreeData } from '../../MultiLevelSelect/types';

// For Parent Hierachy display
function ParentName (props: { name: string }) {
  return props.name ? <div className={styles.parents}>{props.name}</div> : null
}

function getLastId (id: string) {
  const _id = id || ''
  const ids = _id.split('-')
  return ids.pop() || ''
}

// For Selected Category
function SelectedCategory (props: { selectedCategory: Option, parent: string, description: string, readMore: string, readLess: string, onDelete?: () => void }) {
  const { selectedCategory, onDelete, description, readMore, readLess, parent } = props
  return (<div className={classNames(styles.selectedCategory)}>
    <div className={styles.details}>
      <div className={styles.displayName}>{selectedCategory.displayName}
        <span className={styles.erpId}>{selectedCategory.customData?.erpId}</span></div>

      {onDelete && <div className={classNames(styles.grow, styles.end)}><div onClick={onDelete} className={styles.cross}><X size={16} /></div></div>}
    </div>
    <div><ParentName name={parent} /></div>
    {description && <ReadMoreText disable value={description} readLess={readMore} readMore={readLess} />}
  </div>)
}
// For Reach only View
function ReadOnlyForm (props: { selectedCategory: Option | null, label: string }) {
  const { selectedCategory, label } = props
  const id = selectedCategory?.customData?.erpId || ''
  const name = selectedCategory?.displayName || '-'
  return <Grid container spacing={2}>
    <Grid item xs={4}><span className={styles.label}>{label}</span></Grid>
    <Grid item xs={8}><span className={styles.value}>{`${name} (${id})`}</span></Grid>
  </Grid>
}

// When nothing found
function NoCategory (props: { onViewOptions: () => void, label: string, viewAllButtonLabel: string }) {
  const { onViewOptions, label, viewAllButtonLabel } = props
  return <div className={styles.noRecommendation}>
    <div className={styles.subtitle}>{label}</div>
    <div className={styles.buttons}>
      {/* <OroButton label='Retry' radiusCurvature='medium' icon={<img width={20} height={20} src={Logo} />}></OroButton> */}
      <OroButton onClick={onViewOptions} label={viewAllButtonLabel} radiusCurvature='medium'></OroButton>
    </div></div>
}

// For Recommend Item
function RecommendItem (props: { isRadioView: boolean, selectLabel: string, code: Option, description: string, readMore: string, readLess: string, isSelected: boolean, parentName: string, onClick?: () => void }) {
  const { code, parentName, isSelected, description } = props
  function handleClick () {
    if (props.isRadioView && props.onClick) {
      props.onClick()
    }
  }
  function handleSelectClick () {
    if (props.onClick) {
      props.onClick()
    }
  }
  return <div key={code.id}
    onClick={handleClick}
    className={classNames(styles.category, { [styles.noCursor]: !props.isRadioView, [styles.greenHover]: !props.isRadioView, [styles.selected]: isSelected })}>
    <div className={styles.detailsWrap}>
      <div className={styles.name}>{code.displayName}
        <span className={styles.id}>{code.customData?.erpId}</span>
      </div>
      <ParentName name={parentName} />
      {description && <ReadMoreText disable value={description} readLess={props.readLess} readMore={props.readMore} />}
    </div>
    <div>
      {!props.isRadioView && !isSelected && <div className={styles.secondarySelect}><OroButton radiusCurvature='medium' type="secondary" label={props.selectLabel}></OroButton></div>}
      {!props.isRadioView && !isSelected && <div className={styles.primarySelect}><OroButton radiusCurvature='medium' onClick={handleSelectClick} type="primary" label={props.selectLabel}></OroButton></div>}
      {props.isRadioView && <span className={styles.circle}><Circle size={16} /></span>}
      {props.isRadioView && <span className={styles.checked}><img src={Check} width={18} height={18} /></span>}
    </div>
  </div>
}
function CategoryRecommendationFormV2 (props: ICategoryRecommFormPropsV2) {
  // fields
  const [summary, setSummary] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Option>(null)
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(null)
  // helpers
  const [isLeafOnlySelectable, setIsLeafOnlySelectable] = useState<boolean>(false)
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [optionsTreeVisible, setOptionsTreeVisible] = useState<boolean>(false)
  const listRef = useRef<HTMLDivElement>(null)
  const [heightToExpand, setHeightToExpand] = useState<string>('1000px')
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [categoryMap, setCategoryMap] = useState<Record<string, Option>>({})
  // field map
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})

  const { t } = useTranslationHook([NAMESPACES_ENUM.CATEGORYRECOMMV2])

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): ICategoryRecommFormDataV2 {
    const newData = {
      summary: summary,
      categories: selectedCategory ? [selectedCategory].map(mapOptionToIDRef) : null,
      recommendation: recommendation || null
    }
    return newData;
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {
      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumFields.categories:
            invalidFieldId = fieldName
            return !selectedCategory
        }
      }
    })
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()

    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // To get latest form fields data
  function fetchData (skipValidation?: boolean): ICategoryRecommFormDataV2 {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }
  function handleSelectCategory () {
    setOptionsTreeVisible(true)
  }
  function CloseOptionsTree () {
    setOptionsTreeVisible(false)
  }

  // on Category Select in Popup Tree
  function handleOptionTreeSubmit (options: Option[]) {
    const _category = options?.[0] || null
    setOptionsTreeVisible(false)
    if (_category) {
      setSelectedCategory(_category)
      setHeightToExpand('')
      const _searchId = _category.customData?.erpId || _category.customData?.code || getLastId(_category.id)
      loadCategory(_searchId, _category.id)
      handleFieldValueChange(enumFields.categories, selectedCategory, _category)
    }
  }
  function getHeight () {
    const height = listRef?.current?.offsetHeight
    return height ? height + 'px' : ''
  }
  function handleSelectionChange (options: Option[]) {
    handleOptionTreeSubmit(options)
    setIsExpanded(false)
    setHeightToExpand(getHeight())
  }

  function getCategoryRecommendations () {
    return recommendation?.categoryRecommendation?.codes || []
  }
  function isPartOfRecommendations (id: string, recommendations: IDRef[]) {
    return (id && recommendations.some((recommendation) => recommendation.id === id))
  }
  function getParentRecommendations () {
    return recommendation?.categoryRecommendation?.parents || []
  }
  function handleExpand () {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setHeightToExpand(getHeight())
    }
  }
  function getDescription (id: string) {
    const _categoryDetails = categoryMap[id]
    return _categoryDetails?.customData?.longDescription || _categoryDetails?.customData?.description || ''
  }
  function getAncestor (id: string): string[] {
    const _categoryDetails = categoryMap[id]
    return _categoryDetails?.customData?.ancestorNames || ['']
  }

  function renderRecommendationItems () {
    // Map to Options to render
    // Map to Options to render
    const codes = getCategoryRecommendations()
    const parents = getParentRecommendations()
    const options = codes.map(mapIDRefToOption)

    // Maintain Parent mapping, required for below shuffling
    let OptionsToRender: Option[] = []
    const _parentMapping: Record<string, IDRef | null> = {}
    options.forEach((option, index) => {
      // Note - recommended Parents is async
      _parentMapping[option.id] = parents[index] || null
    })

    // Move the selected recommendation at top.
    const _selectedId = selectedCategory?.id
    const foundSelected = options.find((code) => code.id === _selectedId)
    if (foundSelected) {
      const others = options.filter((code) => code.id !== _selectedId)
      OptionsToRender.push(...others)
    } else {
      OptionsToRender = options
    }
    const hasOptionsToRender = OptionsToRender.length > 0
    return <div className={styles.categoryList} data-testid="category-field" ref={(node) => { storeRef(enumFields.categories, node) }}>
      {foundSelected && <RecommendItem
        isRadioView={!props.hideRecommendBox}
        selectLabel={t('--select--')}
        code={foundSelected}
        description={getDescription(foundSelected.id)}
        isSelected={true}
        parentName={_parentMapping[foundSelected.id]?.name || getAncestor(foundSelected.id)?.[0] || ''}
        readLess={t('--readLess--')}
        readMore={t('--readMore--')} />}

      <div ref={listRef} style={(isExpanded && hasOptionsToRender) ? { maxHeight: heightToExpand } : {}} className={classNames(styles.categoryList, { [styles.categoryAnimator]: foundSelected && hasOptionsToRender, [styles.expanded]: foundSelected && isExpanded && hasOptionsToRender })}>
        {OptionsToRender.map((code, index) => {
          return <RecommendItem
            isRadioView={!props.hideRecommendBox}
            selectLabel={t('--select--')}
            key={code.id || index}
            onClick={() => handleSelectionChange([code])}
            code={code} description={getDescription(code.id)}
            isSelected={code.id === _selectedId}
            parentName={_parentMapping[code.id]?.name || getAncestor(code.id)?.[0] || ''}
            readLess={t('--readLess--')}
            readMore={t('--readMore--')} />
        })}
        {!props.hideRecommendBox && <div className={styles.banner}>
          <AlertCircle size={16} />
          <span>{t('--notTheResultYouLooking--')}</span>
          <OroButton iconOrientation="right" label={t('--viewAllOptions--')}
            onClick={handleSelectCategory}
            type="link" />
        </div>}
        {props.hideRecommendBox && <div className={styles.optionsButton}><OroButton iconOrientation="right" label={t('--viewAllOptions--')}
          onClick={handleSelectCategory}
          type="link" /></div>}
      </div>

      {foundSelected && hasOptionsToRender && <div className={styles.expandar}>
        <div className={styles.expandarLine}></div>
        <div className={styles.expandarClick} onClick={handleExpand}>
          <span>{isExpanded ? t('--hideRecommendations--') : t('--viewAllRecommendations--')}</span>
          {isExpanded && <ChevronUp size={16} />}
          {!isExpanded && <ChevronDown size={16} />}
        </div>
        <div className={styles.expandarLine}></div>
      </div>}
    </div>
  }

  function handleCancelSelected () {
    setSelectedCategory(null)
    handleFieldValueChange(enumFields.categories, selectedCategory, null)
  }

  function renderContent () {
    const _recommendationCodes = getCategoryRecommendations()
    if (selectedCategory && !isPartOfRecommendations(selectedCategory?.id, _recommendationCodes)) {

      const parents = selectedCategory.hierarchy ? selectedCategory.hierarchy.split(":") : getAncestor(selectedCategory.id)

      return <SelectedCategory
        parent={parents[0] || ''}
        description={getDescription(selectedCategory.id)}
        onDelete={props.hideDelete ? undefined : handleCancelSelected}
        selectedCategory={selectedCategory}
        readLess={t('--readLess--')}
        readMore={t('--readMore--')} />
    }

    if (_recommendationCodes.length > 0) {
      return <>
        {!props.hideRecommendBox && <div className={styles.recommendBox}>
          <div className={styles.recommend}>
            <div className={styles.logo}><img width={20} height={20} src={Logo} /></div>
            <div className={styles.grow}>
              <div className={styles.recomendTitle}>{t('--recommendedOptions--')}</div>
            </div>
          </div>
          {renderRecommendationItems()}
        </div>}
        {props.hideRecommendBox && renderRecommendationItems()}

      </>
    }
    if(summary && _recommendationCodes.length === 0){
      return <NoCategory viewAllButtonLabel={t('--viewAllOptions--')} label={t('--failedToGenerateRecommendations--')} onViewOptions={handleSelectCategory} />
    }
    return null
  }
  function loadCategory (searchId: string, categoryId: string) {
    const alreadyNotLoaded = !categoryMap[categoryId]
    if (props.fetchCategory && searchId && alreadyNotLoaded) {
      props.fetchCategory(searchId).then((category: Option | null) => {
        category && setCategoryMap((previousState) => {
          return { ...previousState, [categoryId]: category }
        })
      })
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: Option | null): ICategoryRecommFormDataV2 {
    const formData = recursiveDeepCopy(getFormData()) as ICategoryRecommFormDataV2

    switch (fieldName) {
      case enumFields.categories:
        formData[fieldName] = newValue ? [newValue].map(mapOptionToIDRef) : null
        break
    }
    return formData
  }
  // on Each Field Change
  function handleFieldValueChange (
    fieldName: enumFields,
    oldValue: Option | null,
    newValue: Option | null
  ) {
    if (props.onValueChange && !areObjectsSame(oldValue, newValue)) {
      props.onValueChange(
        fieldName,
        getFormDataWithUpdatedValue(fieldName, newValue)
      )
    }
  }


  useEffect(() => {
    if (forceValidate) {
      // validate form
      setHasError(!selectedCategory)
    }
  }, [forceValidate])

  // to fill field values
  useEffect(() => {
    const data = props.formData

    if (data) {
      setSummary(data.summary || '')
      const foundRecommendation = data.recommendation || null
      setRecommendation(foundRecommendation)

      const recommendationCodes = foundRecommendation?.categoryRecommendation?.codes || []
      const firstCategory = (data.categories || []).map(mapIDRefToOption)[0] || null
      setSelectedCategory(firstCategory)
      // fetch category info if not loaded yet
      if (firstCategory && (selectedCategory?.id !== firstCategory?.id)) {
        const erpid = firstCategory.customData?.erpId || firstCategory.customData?.code || getLastId(firstCategory.id)
        loadCategory(erpid, firstCategory.id)
      }
      if (recommendationCodes.toString() !== (recommendation?.categoryRecommendation?.codes || []).toString()) {
        // get category info for all recommendations if not loaded yet
        recommendationCodes.forEach((code) => {
          loadCategory(code.erpId || getLastId(code.id), code.id)
        })
      }
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [
        enumFields.categories
      ]
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
      // check leaf only configuration
      const _hasLeafOnly = props.fields
        .find((field) => field.fieldName === enumFields.categoryLeafOnly)?.booleanValue || false
      if (_hasLeafOnly) {
        setIsLeafOnlySelectable(true)
      }
    }
  }, [props.fields])

  useEffect(() => {
    if (props.onlyLeafSelectable) {
      setIsLeafOnlySelectable(true)
    }
  }, [props.onlyLeafSelectable])

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    fieldMap,
    summary,
    selectedCategory,
    recommendation
  ])

  return (
    <>
      {props.isReadOnly &&
        <ReadOnlyForm label={t('--category--')} selectedCategory={selectedCategory} />}
      {!props.isReadOnly && <div>
        <Grid container item xs={props.isInPortal ? 12 : 10} gap={1} mb={!props.hideRecommendBox ? 3 : 0}>
          {!props.hideTitle && <Grid item xs={12}>
            <div className={styles.title} >{t('--pleaseSelectBestCategory--')}</div>
          </Grid>}
          <Grid item xs={12}>
            {renderContent()}
          </Grid>
          <Grid item xs={12}>
            {hasError && <div className={styles.error}><AlertCircle size={16} color='var(--warm-stat-chilli-regular)' /> <span>{t('--requiredField--')}</span></div>}
            <OptionTreePopup
              type={OptionTreeData.category}
              isOpen={optionsTreeVisible}
              options={props.categoryOptions}
              selectedValues={selectedCategory ? [selectedCategory] : []}
              multiSelect={false}
              async
              fetchChildren={props.fetchChildren}
              onSearch={props.onSearch}
              onSubmit={handleOptionTreeSubmit}
              onClose={CloseOptionsTree}
              onlyLeafSelectable={isLeafOnlySelectable}
            />
          </Grid>
        </Grid>
      </div>}
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}

export default CategoryRecommendationFormV2