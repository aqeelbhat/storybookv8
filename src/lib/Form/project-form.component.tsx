import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { Field, Cost, ProjectFormProps, ProjectFormData } from './types'
import { Option, OroMasterDataType } from './../Types'
import { areOptionsSame, getDateObject, getFormFieldConfig, isDisabled, isEmpty, isOmitted, isRequired, validateDateOrdering } from './util'
import { TextBox, TextArea, TypeAhead, ToggleButtons, MultiSelect, DateRange, Currency} from '../Inputs'
import { OroButton } from '../controls'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import styles from './project-form-styles.module.scss'
import { getValueFromAmount } from '../Inputs/utils.service'
import { DEFAULT_CURRENCY } from '../util'
import { getSessionLocale } from '../sessionStorage'
import { OptionTreeData } from '../MultiLevelSelect/types'

function ProjectFormComponent (props: ProjectFormProps) {

  const [programOptions, setProgramOptions] = useState<Option[]>([])
  const [subsidiaryOptions, setSubsidiaryOptions] = useState<Option[]>([])
  const [accountCodeOptions, setAccountCodeOptions] = useState<Option[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([])
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [regionOptions, setRegionOptions] = useState<Option[]>([])
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])

  const [marketingProgram, setMarketingProgram] = useState<Option>()
  const [activityName, setActivityName] = useState<string>('')
  const [allocadiaId, setAllocadiaId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [region, setRegion] = useState<Option>()
  const [service, setService] = useState<Option[]>([])
  const [estimatedCost, setEstimatedCost] = useState<Cost>({currency: DEFAULT_CURRENCY, amount: ''})
  const [currency, setCurrency] = useState<string>('')
  const [currencyChanged, setCurrencyChanged] = useState<boolean>(false)
  const [subsidiary, setSubsidiary] = useState<Option>()
  const [accountCode, setAccountCode] = useState<Option>()
  const [user, setUser] = useState<string>('')
  const [department, setDepartment] = useState<Option>()
  const [summary, setSummary] = useState<string>('')

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.PROJECTFORM)

  const globalRegion: Option = {
    id: 'global',
    path: 'global',
    displayName: t("--global--")
  }

  useEffect(() => {
    if (props.formData) {
      setMarketingProgram(props.formData.marketingProgram)
      setActivityName(props.formData.activityName)
      setAllocadiaId(props.formData.allocadiaId)
      setStartDate(props.formData.startDate)
      setEndDate(props.formData.endDate)
      setRegion(props.formData.region)
      setService(props.formData.service)
      setEstimatedCost({
        currency: props.formData.estimatedCost?.currency || props.defaultCurrency || DEFAULT_CURRENCY,
        amount: props.formData.estimatedCost?.amount ? Number(props.formData.estimatedCost.amount).toLocaleString(getSessionLocale()) : ''
      })
      setCurrencyChanged(!!props.formData.currencyChanged)
      setSubsidiary(props.formData.subsidiary)
      setAccountCode(props.formData.accountCode)
      setUser(props.formData.user)
      setDepartment(props.formData.department)
      setSummary(props.formData.summary)
    }
  }, [props.formData])

  useEffect(() => {
    props.programOptions && setProgramOptions(props.programOptions)
  }, [props.programOptions])

  useEffect(() => {
    props.subsidiaryOptions && setSubsidiaryOptions(props.subsidiaryOptions)
  }, [props.subsidiaryOptions])

  useEffect(() => {
    props.departmentOptions && setDepartmentOptions(props.departmentOptions)
  }, [props.departmentOptions])

  useEffect(() => {
    props.accountCodeOptions && setAccountCodeOptions(props.accountCodeOptions)
  }, [props.accountCodeOptions])

  useEffect(() => {
    props.categoryOptions && setCategoryOptions(props.categoryOptions)
  }, [props.categoryOptions])

  useEffect(() => {
    props.regionOptions && setRegionOptions(props.regionOptions)
  }, [props.regionOptions])

  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        marketingProgram: getFormFieldConfig('marketingProgram', props.fields),
        activityName: getFormFieldConfig('activityName', props.fields),
        allocadiaId: getFormFieldConfig('activityId', props.fields),
        startDate: getFormFieldConfig('start', props.fields),
        endDate: getFormFieldConfig('end', props.fields),
        region: getFormFieldConfig('region', props.fields),
        service: getFormFieldConfig('categories', props.fields),
        estimatedCost: getFormFieldConfig('budget', props.fields),
        subsidiary: getFormFieldConfig('companyEntity', props.fields),
        accountCode: getFormFieldConfig('accountCode', props.fields),
        department: getFormFieldConfig('department', props.fields),
        summary: getFormFieldConfig('projectSummary', props.fields)
      })
    }
  }, [props.fields])

  function getFormData (): ProjectFormData {
    return {
      marketingProgram,
      activityName,
      allocadiaId,
      startDate,
      endDate,
      region,
      service,
      estimatedCost: {
        amount: getValueFromAmount(estimatedCost.amount),
        currency: estimatedCost.currency
      },
      currency,
      currencyChanged,
      subsidiary,
      accountCode,
      user,
      department,
      summary
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Option[]): ProjectFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as ProjectFormData

    switch (fieldName) {
      case 'marketingProgram':
        formData.marketingProgram = newValue as Option
        break
      case 'activityName':
        formData.activityName = newValue as string
        break
      case 'activityId':
        formData.allocadiaId = newValue as string
        break
      case 'start':
        formData.startDate = newValue as string
        break
      case 'end':
        formData.endDate = newValue as string
        break
      case 'region':
        formData.region = newValue as Option
        break
      case 'categories':
        formData.service = newValue as Option[]
        break
      case 'budget':
        formData.estimatedCost.amount = newValue as string
        break
      case 'currency':
        formData.estimatedCost.currency = newValue as string
        formData.currency = newValue as string
        formData.currencyChanged = true
        break
      case 'companyEntity':
        formData.subsidiary = newValue as Option
        break
      case 'accountCode':
        formData.accountCode = newValue as Option
        break
      case 'department':
        formData.department = newValue as Option
        break
      case 'projectSummary':
        formData.summary = newValue as string
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

  function handleDateRangeChange (start: string, end: string) {
    setStartDate(start)
    setEndDate(end)

    handleFieldValueChange('start', startDate, start)
    handleFieldValueChange('end', endDate, end)
  }

  function handleCostChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    setEstimatedCost({
      amount: cleanedupValue,
      currency: estimatedCost.currency
    })

    handleFieldValueChange('budget', estimatedCost.amount, cleanedupValue)
  }

  function handleCurrencyChange (value: string) {
    setEstimatedCost({
      amount: estimatedCost.amount,
      currency: value
    })

    setCurrency(value)
    setCurrencyChanged(true)

    handleFieldValueChange('currency', estimatedCost.currency, value)
  }

  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
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

  function validateDateRange (dateRange: {startDate: string, endDate: string}): string {
    return validateField('startDate', 'Start date', dateRange.startDate) || validateField('endDate', 'End date', dateRange.endDate) ||
      (dateRange.startDate !== null && dateRange.endDate !== null ? validateDateOrdering(dateRange.startDate, dateRange.endDate) : '')
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    const isInvalid = props.fields.some(field => {
      if (!isOmitted(field) && isRequired(field)) {
        switch (field.fieldName) {
          case 'marketingProgram':
            invalidFieldId = 'marketing-program-field'
            return !marketingProgram || !marketingProgram.id
          case 'activityName':
            invalidFieldId = 'activity-name-field'
            return !activityName
          case 'activityId':
            invalidFieldId = 'allocadia-id-field'
            return !allocadiaId
          case 'start':
            invalidFieldId = 'timeline-field'
            return !startDate
          case 'end':
            invalidFieldId = 'timeline-field'
            return !endDate || (!isOmitted(props.fields.find(field => field.fieldName === 'start')) && isRequired(props.fields.find(field => field.fieldName === 'start')) && !!validateDateOrdering(startDate, endDate))
          case 'region':
            invalidFieldId = 'region-field'
            return !region || !region.id
          case 'categories':
            invalidFieldId = 'service-field'
            return !service || service.length === 0
          case 'department':
            invalidFieldId = 'department-field'
            return !department || !department.id
          case 'companyEntity':
            invalidFieldId = 'subsidiary-field'
            return !subsidiary || !subsidiary.id
          case 'accountCode':
            invalidFieldId = 'account-code-field'
            return !accountCode || !accountCode.id
          case 'budget':
            invalidFieldId = 'estimated-cost-field'
            return !(estimatedCost?.currency) || isEmpty(estimatedCost.currency) || !(estimatedCost?.amount) || isEmpty(estimatedCost.amount)
          case 'projectSummary':
            invalidFieldId = 'summary-field'
            return !summary
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

  function fetchData (skipValidation?: boolean): ProjectFormData {
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
    marketingProgram, activityName, allocadiaId, startDate, endDate, region, service, estimatedCost, subsidiary, accountCode, department, summary
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
        { !isFieldOmitted('marketingProgram') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col2)} id="marketing-program-field">
              <TypeAhead
                label={t("--marketingProgram--")}
                placeholder={t("--chooseProgram--")}
                value={marketingProgram}
                options={programOptions}
                disabled={isFieldDisabled('marketingProgram')}
                required={isFieldRequired('marketingProgram')}
                forceValidate={forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Program', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Program')}
                validator={(value) => validateField('marketingProgram', t("--marketingProgram--"), value)}
                onChange={value => {setMarketingProgram(value); handleFieldValueChange('marketingProgram', marketingProgram, value)}}
                />
            </div>
          </div>}

        { (!isFieldOmitted('activityName') || !isFieldOmitted('allocadiaId')) &&
          <div className={styles.row} >
            { !isFieldOmitted('activityName') &&
              <div className={classnames(styles.item, styles.col3)} id="activity-name-field">
                <TextBox
                  label={t("--activityName--")}
                  value={activityName}
                  disabled={isFieldDisabled('activityName')}
                  required={isFieldRequired('activityName')}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('activityName', t("--activityName--"), value)}
                  onChange={value => { setActivityName(value); handleFieldValueChange('activityName', activityName, value) }}
                />
              </div>}
            { !isFieldOmitted('allocadiaId') &&
              <div className={classnames(styles.item, styles.col1)} id="allocadia-id-field">
                <TextBox
                  label={t("--allocadiaId--")}
                  value={allocadiaId}
                  disabled={isFieldDisabled('allocadiaId')}
                  required={isFieldRequired('allocadiaId')}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('allocadiaId', t("--allocadiaId--"), value)}
                  onChange={value => { setAllocadiaId(value); handleFieldValueChange('activityId', allocadiaId, value) }}
                />
              </div>}
          </div>}

        { (!isFieldOmitted('startDate') || !isFieldOmitted('endDate')) &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col2)} id="timeline-field">
              <DateRange
                locale={getSessionLocale()}
                label={t("--timeline--")}
                startDate={getDateObject(startDate)}
                endDate={getDateObject(endDate)}
                disabled={isFieldDisabled('startDate') && isFieldDisabled('endDate')}
                required={isFieldRequired('startDate') && isFieldRequired('endDate')}
                forceValidate={forceValidate}
                validator={validateDateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>}

        { !isFieldOmitted('region') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col4)} id="region-field">
              <ToggleButtons
                label={t("--targetRegion--")}
                value={region}
                options={regionOptions}
                defaultOption={globalRegion}
                disabled={isFieldDisabled('region')}
                required={isFieldRequired('region')}
                forceValidate={forceValidate}
                validator={(value) => validateField('region', t("--targetRegion--"), value)}
                onChange={value => { setRegion(value); handleFieldValueChange('region', region, value) }}
              />
            </div>
          </div>}

        { !isFieldOmitted('service') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col2)} id="service-field">
              <MultiSelect
                label={t("--servicesNeeded--")}
                placeholder={t("--chooseService--")}
                type={OptionTreeData.category}
                value={service}
                options={categoryOptions}
                showTree={true}
                disabled={isFieldDisabled('service')}
                required={isFieldRequired('service')}
                forceValidate={forceValidate}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Category', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Category')}
                validator={(value) => validateField('service', t("--servicesNeeded--"), value)}
                onChange={value => { setService(value); handleFieldValueChange('categories', service, value) }}
              />
            </div>
          </div>}
      </div>


      <div className={styles.section} >
        <div className={styles.title}>{t("--budgetDetails--")}</div>

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

        { (!isFieldOmitted('subsidiary') || !isFieldOmitted('accountCode')) &&
        <div className={styles.row} >
          { !isFieldOmitted('subsidiary') &&
            <div className={classnames(styles.item, styles.col2)} id="subsidiary-field">
              <TypeAhead
                label={t("--businessEntity--")}
                placeholder={t("--chooseBusinessEntity--")}
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
            </div>}

          { !isFieldOmitted('accountCode') &&
            <div className={classnames(styles.item, styles.col2)} id="account-code-field">
              <TypeAhead
                label={t("--accountCode--")}
                value={accountCode}
                options={accountCodeOptions}
                disabled={isFieldDisabled('accountCode')}
                required={isFieldRequired('accountCode')}
                forceValidate={forceValidate}
                validator={(value) => validateField('accountCode', t("--accountCode--"), value)}
                onChange={value => { setAccountCode(value); handleFieldValueChange('accountCode', accountCode, value) }}
              />
            </div>}
        </div>}

        { !isFieldOmitted('estimatedCost') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col2)} id="estimated-cost-field">
              <Currency
                locale={getSessionLocale()}
                label={t("--estimatedProjectCost--")}
                unit={estimatedCost.currency}
                value={estimatedCost.amount}
                unitOptions={currencyOptions}
                disabled={isFieldDisabled('estimatedCost')}
                required={isFieldRequired('estimatedCost')}
                forceValidate={forceValidate}
                validator={(value) => validateField('estimatedCost', t("--estimatedProjectCost--"), Number(getValueFromAmount(value)))}
                onChange={handleCostChange}
                onUnitChange={handleCurrencyChange}
              />
            </div>
          </div>}
      </div>

      <div className={styles.section} >
        { !isFieldOmitted('summary') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col4)} id="summary-field">
              <TextArea
                label={t("--briefProjectSummary--")}
                placeholder={t("--describeProjectScopeGoal--")}
                value={summary}
                disabled={isFieldDisabled('summary')}
                required={isFieldRequired('summary')}
                forceValidate={forceValidate}
                validator={(value) => validateField('summary', t("--briefProjectSummary--"), value)}
                onChange={value => { setSummary(value); handleFieldValueChange('projectSummary', summary, value) }}
              />
            </div>
          </div>}

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
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
export function ProjectForm (props: ProjectFormProps){
  return <I18Suspense><ProjectFormComponent {...props} /></I18Suspense>
}
