import React, { useEffect, useRef, useState } from 'react'
import { ICategoryRecommFormProps, enumFields, ICategoryRecommFormData, IRecommendation } from './types';
import { Field } from '../types';
import { UserId, Option, IDRef } from '../../Types'
import { getFormFieldsMap, mapOptionToIDRef, isRequired, mapIDRefToOption, recursiveDeepCopy, validateFieldV2 } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import Actions from '../../controls/actions';
import { Grid } from '@mui/material';
import styles from './styles.module.scss'
import Quote from '../assets/quote.svg'

import defaultUserPic from '../assets/default-user-pic.png'
import OroAILogo from '../assets/oroAI.svg'
import { OroButton } from '../../controls';
import { ArrowUpRight, ChevronDown, X } from 'react-feather';
import { createImageFromInitials } from '../../util';
import { OptionTreePopup } from '../../MultiLevelSelect/option-tree-popup.component';
import classNames from 'classnames';
import { OptionTreeData } from '../../MultiLevelSelect/types';

export function CategoryRecommendationForm (props: ICategoryRecommFormProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [categories, setCategories] = useState<Option[]>([])
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(null)
  const [summaryUpdatedBy, setSummaryUpdatedBy] = useState<UserId | null>(null)
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [optionsTreeVisible, setOptionsTreeVisible] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [recommendedParents, setRecommendedParents] = useState<Array<string[]>>([])
  const { t } = useTranslationHook([NAMESPACES_ENUM.CATEGORYRECOMM])
  const [isLeafOnlySelectable, setIsLeafOnlySelectable] = useState<boolean>(false)

  const SelectedCategory: Option | null = categories?.[0] || null
  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): ICategoryRecommFormData {
    const newData = {
      summary: summary,
      categories: categories.length > 0 ? categories.map(mapOptionToIDRef) : null,
      summaryUpdatedBy: summaryUpdatedBy,
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
            return categories.length === 0
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
  function fetchData (skipValidation?: boolean): ICategoryRecommFormData {
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
  function handleSelectionChange (options: Option[]) {
    setCategories(options)
    setOptionsTreeVisible(false)
  }
  function generateParentHierarchy (ids: string[], options: Option[]): string[] {
    const _find = options.find((option) => ids.includes(option.customData?.erpId))
    if (!_find) {
      return []
    }
    const _name = _find.displayName
    if (!_find.children || _find.children.length === 0) {
      return [_name]
    }
    return [_name, ...generateParentHierarchy(ids, _find.children)]
  }
  function getRecommendedCodesParents (codes: IDRef[]) {
    if (codes.length > 0 && props.onGetCodesHierarchy) {
      // fetch parents details
      const parentIds: Array<string[]> = []
      const flatten: Array<string> = []
      codes.forEach((option) => {
        const _ids = (option.id || '').split('-').filter((id) => id !== option.erpId)
        parentIds.push(_ids)
        flatten.push(..._ids)
      })
      const uniqueIds = flatten.filter((v, i, self) => i == self.indexOf(v))
      props.onGetCodesHierarchy(uniqueIds).then((options: Option[]) => {
        // get parents names to render
        const parentsHierarchy = parentIds.map((ids) => {
          return generateParentHierarchy(ids, options)
        })
        setRecommendedParents(parentsHierarchy)
      })
    }
  }

  useEffect(() => {
    if (forceValidate) {
      // validate form
      setHasError(categories.length === 0)
    }
  }, [forceValidate])

  // to fill field values
  useEffect(() => {
    const data = props.formData

    if (data) {
      setSummary(data.summary || '')
      setCategories((data.categories || []).map(mapIDRefToOption))
      setSummaryUpdatedBy(data.summaryUpdatedBy)
      setRecommendation(data.recommendation || null)
      const codes = data.recommendation?.categoryRecommendation?.codes || []
      if (codes.length > 0) {
        getRecommendedCodesParents(codes)
      }
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [
        enumFields.summary,
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

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    fieldMap,
    summary,
    categories
  ])
  function renderReadOnlyForm () {
    const id = SelectedCategory?.customData?.erpId || SelectedCategory?.id || ''
    const name = SelectedCategory?.displayName || '-'
    return <Grid container spacing={2}>
      <Grid item xs={4}><span className={styles.label}>{t('--category--')}</span></Grid>
      <Grid item xs={8}><span className={styles.value}>{`${name} (${id})`}</span></Grid>
      <Grid item xs={4}><span className={styles.label}>{t('--requestSummary--')}</span></Grid>
      <Grid item xs={8}><span className={styles.value}>{props.formData?.summary || '-'}</span></Grid>
    </Grid>
  }
  function getProfilePic (owner: UserId | null | undefined): string {
    const [firstName, lastName] = owner?.name ? owner.name.split(' ') : ['', '']
    return owner ? owner?.picture || createImageFromInitials(firstName, lastName) : defaultUserPic
  }
  function renderParent (codeIndex: number) {
    const hierarchy = recommendedParents[codeIndex] || []
    let label = ''
    if (hierarchy.length > 2) {
      label = `${hierarchy[0]} / ... / ${hierarchy[hierarchy.length - 1]}`
    } else {
      label = hierarchy.join(' / ')
    }
    return label ? <div className={styles.parents}>{label}</div> : null
  }

  function renderRecommendationItems () {
    const codes = recommendation?.categoryRecommendation?.codes || []
    const options = codes.map(mapIDRefToOption)
    const _selectedId = SelectedCategory?.id
    return <div className={styles.categoryList} data-testid="category-field" ref={(node) => { storeRef(enumFields.categories, node) }}>
      {options.map((code, index) => {
        return <div key={code.id || index}
          className={classNames(styles.category, { [styles.selected]: code.id === _selectedId })}
          onClick={() => handleSelectionChange([code])}>
          <div className={styles.flexRow}>
            <div className={styles.name}>{code.displayName}</div>
            <div className={styles.id}>{code.customData?.erpId}</div>
          </div>
          {renderParent(index)}
        </div>
      })}
    </div>
  }
  function renderUserQuery () {
    return <div className={styles.userBox}>
      <div className={styles.userDetails}>
        <div className={styles.userPic}>
          <img width={32} height={32} src={getProfilePic(summaryUpdatedBy)} alt="" />
        </div>
        <div className={styles.grow}>
          <div className={styles.userName}>{props.formData?.summaryUpdatedBy?.name || ''}</div>
          {/* <div className={styles.date}>Feb 17, 2024</div> */}
        </div>
        <div><img src={Quote} /></div>
      </div>
      <div className={styles.query}>{summary}</div>
    </div>
  }
  function shouldShowRecommendation () {
    const codes = recommendation?.categoryRecommendation?.codes || []
    const _selectedId = SelectedCategory?.id
    if (!_selectedId && codes.length > 0) {
      return true
    }
    if (_selectedId && codes.some((code) => code.id === _selectedId)) {
      return true
    }
  }
  function handleCancelSelected () {
    setCategories([])
  }

  function renderSelectedCategory () {
    return <>
      {SelectedCategory && <div className={classNames(styles.selectedCategory)}>
        <div className={styles.displayName}>{SelectedCategory.displayName}</div>
        <div className={styles.erpId}>{SelectedCategory.customData?.erpId || SelectedCategory.id}</div>
        <div className={styles.grow}><div onClick={handleCancelSelected} className={styles.cross}><X size={16} /></div></div>

      </div>

      }</>
  }
  function renderNoCategory () {

    return <div onClick={handleSelectCategory} className={styles.fakeInput}>
      <span>{t('--categoryPlaceholder--')}</span>
      <ChevronDown size={18} />
    </div>

  }
  function renderRecommendations () {
    return <div className={styles.recommendBox}>
      <div className={styles.recommend}>
        <div className={styles.logo}><img width={42} height={42} src={OroAILogo} /></div>
        <div className={styles.grow}>
          <div className={styles.recomendTitle}>{t('--hereAreSomeRecommendations--')}</div>
          <div className={styles.selectText}>{t('--youCanSelectOptionOrManually--')}</div>
        </div>
      </div>
      {renderRecommendationItems()}

      <div>
        <OroButton iconOrientation="right" label={t('--searchManually--')}
          onClick={handleSelectCategory}
          type="link" icon={<ArrowUpRight size={16} />} />
      </div>
    </div>
  }

  function renderContent () {
    // if selected category is  part of recommendations
    const _showRecommendation = shouldShowRecommendation()
    if (_showRecommendation) {
      return renderRecommendations()
    }
    if (SelectedCategory) {
      return renderSelectedCategory()
    }
    return renderNoCategory()
  }

  function renderForm () {
    return <div>
      <Grid container item xs={props.isInPortal ? 12 : 10} spacing={2}>
        <Grid item xs={12}>
          <div className={styles.title} >{t('--selectCategory--')}</div>
        </Grid>
        <Grid item xs={12}>
          {renderUserQuery()}
        </Grid>
        <Grid item xs={12}>
          {renderContent()}
        </Grid>
        <Grid item xs={12}>
          {hasError && <div className={styles.error}>{t('--pleaseSelectCategory--')}</div>}
          <OptionTreePopup
            type={OptionTreeData.category}
            isOpen={optionsTreeVisible}
            options={props.categoryOptions}
            selectedValues={categories}
            multiSelect={false}
            async
            fetchChildren={props.fetchChildren}
            onSearch={props.onSearch}
            onSubmit={handleSelectionChange}
            onClose={CloseOptionsTree}
            onlyLeafSelectable={isLeafOnlySelectable}
          />
        </Grid>
      </Grid>
    </div>
  }

  return (
    <>
      {props.isReadOnly ? renderReadOnlyForm() : renderForm()}
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}

