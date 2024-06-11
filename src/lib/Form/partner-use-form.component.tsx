import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { Field, PartnerUseFormData, PartnerUseFormProps } from './types'
import { Option, OroMasterDataType } from '../Types'
import { areOptionsSame, getFormFieldConfig, isDisabled, isEmpty, isOmitted, isRequired } from './util'
import { TextBox, TextArea, TypeAhead, MultiSelect } from '../Inputs'
import { OroButton } from '../controls'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

import styles from './project-form-styles.module.scss'
import { OptionTreeData } from '../MultiLevelSelect/types'

function PartnerUseFormComponent (props: PartnerUseFormProps) {
  const [regionOptions, setRegionOptions] = useState<Option[]>([])
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [subsidiaryOptions, setSubsidiaryOptions] = useState<Option[]>([])
  const [additionalSubsidiaryOptions, setAdditionalSubsidiaryOptions] = useState<Option[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([])
  
  const [title, setTitle] = useState<string>('')
  const [region, setRegion] = useState<Option>()
  const [service, setService] = useState<Option[]>([])
  const [subsidiary, setSubsidiary] = useState<Option>()
  const [additionalSubsidiary, setAdditionalSubsidiary] = useState<Option[]>([])
  const [user, setUser] = useState<string>('')
  const [department, setDepartment] = useState<Option>()
  const [comment, setComment] = useState<string>('')

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.PARTNERUSEFORM)

  useEffect(() => {
    if (props.formData) {
      setTitle(props.formData.title)
      setRegion(props.formData.region)
      setService(props.formData.service)
      setSubsidiary(props.formData.subsidiary)
      setAdditionalSubsidiary(props.formData.additionalSubsidiary)
      setUser(props.formData.user)
      setDepartment(props.formData.department)
      setComment(props.formData.comment)
    }
  }, [props.formData])

  useEffect(() => {
    props.regionOptions && setRegionOptions(props.regionOptions)
  }, [props.regionOptions])

  useEffect(() => {
    props.categoryOptions && setCategoryOptions(props.categoryOptions)
  }, [props.categoryOptions])

  useEffect(() => {
    props.subsidiaryOptions && setSubsidiaryOptions(props.subsidiaryOptions)
  }, [props.subsidiaryOptions])

  useEffect(() => {
    props.additionalSubsidiaryOptions && setAdditionalSubsidiaryOptions(props.additionalSubsidiaryOptions)
  }, [props.additionalSubsidiaryOptions])

  useEffect(() => {
    props.departmentOptions && setDepartmentOptions(props.departmentOptions)
  }, [props.departmentOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        title: getFormFieldConfig('title', props.fields),
        region: getFormFieldConfig('region', props.fields),
        service: getFormFieldConfig('categories', props.fields),
        subsidiary: getFormFieldConfig('companyEntity', props.fields),
        additionalSubsidiary: getFormFieldConfig('additionalCompanyEntities', props.fields),
        crmID: getFormFieldConfig('crmID', props.fields),
        department: getFormFieldConfig('department', props.fields),
        comment: getFormFieldConfig('comment', props.fields)
      })
    }
  }, [props.fields])

  function getFormData (): PartnerUseFormData {
    return {
      title,
      region,
      service,
      subsidiary,
      additionalSubsidiary,
      user,
      department,
      comment
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Option[]): PartnerUseFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as PartnerUseFormData

    switch (fieldName) {
      case 'title':
        formData.title = newValue as string
        break
      case 'region':
        formData.region = newValue as Option
        break
      case 'categories':
        formData.service = newValue as Option[]
        break
      case 'companyEntity':
        formData.subsidiary = newValue as Option
        break
      case 'additionalCompanyEntities':
        formData.additionalSubsidiary = newValue as Option[]
        break
      case 'department':
        formData.department = newValue as Option
        break
      case 'comment':
        formData.comment = newValue as string
        break
    }

    return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: string | Option | Option[], newValue: string | Option | Option[]) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function validateField (fieldName: string, label: string, value: string | string[]): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t("--isRequiredField--",{field:label}) : ''
    } else {
      return ''
    }
  }

  function isFieldDisabled (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field)
    } else {
      return false
    }
  }

  function isFieldRequired (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
    }
  }

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    const isInvalid = props.fields && props.fields.some(field => {
      if (!isOmitted(field) && isRequired(field)) {
        switch (field.fieldName) {
          case 'title':
            invalidFieldId = 'title-field'
            return !title
          case 'region':
            invalidFieldId = 'region-field'
            return !region || !region.id
          case 'categories':
            invalidFieldId = 'service-field'
            return !service || service.length === 0
          case 'companyEntity':
            invalidFieldId = 'subsidiary-field'
            return !subsidiary || !subsidiary.id
          case 'additionalCompanyEntities':
            invalidFieldId = 'additional-subsidiary-field'
            return !additionalSubsidiary || additionalSubsidiary.length === 0
          case 'department':
            invalidFieldId = 'department-field'
            return !department || !department.id
          case 'comment':
            invalidFieldId = 'comment-field'
            return !comment
        }
      }
    })

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

  function fetchData (skipValidation?: boolean): PartnerUseFormData {
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

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    title, region, service, subsidiary, additionalSubsidiary, department, comment
  ])

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

  return (
    <div className={styles.projectDetailsForm}>
      <div className={styles.section} >
        { !isFieldOmitted('title') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="title-field">
              <TextBox
                label={t("--title--")}
                value={title}
                disabled={isFieldDisabled('title')}
                required={isFieldRequired('title')}
                forceValidate={forceValidate}
                validator={(value) => validateField('title', t("--title--"), value)}
                onChange={value => { setTitle(value); handleFieldValueChange('title', title, value) }}
              />
            </div>
          </div>}

        { !isFieldOmitted('region') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="region-field">
              <TypeAhead
                label={t("--regionCountryPartnerUsed--")}
                placeholder={t("--chooseRegionCountry--")}
                value={region}
                options={regionOptions}
                disabled={isFieldDisabled('region')}
                required={isFieldRequired('region')}
                forceValidate={forceValidate}
                validator={(value) => validateField('region', t("--regionCountry--"), value)}
                onChange={value => { setRegion(value); handleFieldValueChange('region', region, value) }}
              />
            </div>
          </div>}

        { !isFieldOmitted('service') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="service-field">
              <MultiSelect
                label={t("--servicesOfferedByPartner--")}
                placeholder={t("--chooseServiceCategory--")}
                type={OptionTreeData.category}
                value={service}
                options={categoryOptions}
                showTree={true}
                disabled={isFieldDisabled('service')}
                required={isFieldRequired('service')}
                forceValidate={forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Category', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Category')}
                validator={(value) => validateField('service', t("--serviceCategory--"), value)}
                onChange={value => { setService(value); handleFieldValueChange('categories', service, value) }}
              />
            </div>
          </div>}

        { !isFieldOmitted('subsidiary') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="subsidiary-field">
              <TypeAhead
                label={t("--businessEntity--")}
                placeholder={t("--chooseCompanyEntity--")}
                type={OptionTreeData.entity}
                value={subsidiary}
                options={subsidiaryOptions}
                showTree={true}
                disabled={isFieldDisabled('subsidiary')}
                required={isFieldRequired('subsidiary')}
                forceValidate={forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                validator={(value) => validateField('subsidiary', t("--businessEntity--"), value)}
                onChange={value => { setSubsidiary(value); handleFieldValueChange('companyEntity', subsidiary, value) }}
              />
            </div>
          </div>}

        { !isFieldOmitted('additionalSubsidiary') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="additional-subsidiary-field">
              <MultiSelect
                label={t("--additionalSubsidiaries--")}
                placeholder={t("--chooseAdditionalCompanyEntities--")}
                type={OptionTreeData.entity}
                value={additionalSubsidiary}
                options={additionalSubsidiaryOptions}
                showTree={true}
                disabled={isFieldDisabled('additionalSubsidiary')}
                required={isFieldRequired('additionalSubsidiary')}
                forceValidate={forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                validator={(value) => validateField('additionalSubsidiary', t("--additionalSubsidiaries--"), value)}
                onChange={value => { setAdditionalSubsidiary(value); handleFieldValueChange('additionalCompanyEntities', subsidiary, value) }}
              />
            </div>
          </div>}

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col2)} id="user-field">
            <TextBox
              label={t("--user--")}
              disabled={true}
              required={true}
              value={user}
            />
          </div>

          { !isFieldOmitted('department') &&
            <div className={classnames(styles.item, styles.col2)} id="department-field">
              <TypeAhead
                label={t("--department--")}
                value={department}
                options={departmentOptions}
                disabled={isFieldDisabled('department')}
                required={isFieldRequired('department')}
                forceValidate={forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Department', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Department')}
                validator={(value) => validateField('department', t("--department--"), value)}
                onChange={value => { setDepartment(value); handleFieldValueChange('department', department, value) }}
              />
            </div>}
        </div>
      </div>

      <div className={styles.section} >
        { !isFieldOmitted('comment') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col4)} id="comment-field">
              <TextArea
                label={t("--commentDetails--")}
                placeholder={t("--businessNeedProjectScopeDetails--")}
                value={comment}
                disabled={isFieldDisabled('comment')}
                required={isFieldRequired('comment')}
                forceValidate={forceValidate}
                validator={(value) => validateField('comment', t("--commentDetails--"), value)}
                onChange={value => { setComment(value); handleFieldValueChange('comment', comment, value) }}
              />
            </div>
          </div>}

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col4, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>
    </div>
  )
}
export function PartnerUseForm (props: PartnerUseFormProps){
  return <I18Suspense><PartnerUseFormComponent {...props} /></I18Suspense>
}
