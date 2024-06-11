import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { Cost, Field, getEmptyProductLine, ProductLine, PurchaseFormData, PurchaseFormProps } from './types'
import { Attachment, Option, OroMasterDataType } from './../Types'
import { ProductList } from './Items/product-list.component'
import { QuotePOList } from './Items/quote-list.component'
import { ServiceList } from './Items/service-list.component'
import { Currency, DateRange, TextArea, TextBox, ToggleButtons, ToggleSwitch, TypeAhead } from '../Inputs'
import { areObjectsSame, areProductLinesSame, areProductsValid, areServicesValid, getDateObject, getFormFieldConfig, isDisabled, isEmpty, isOmitted, isRequired, validateDateOrdering } from './util'
import { OroButton } from '../controls'

import styles from './purchase-form-styles.module.scss'
import { getValueFromAmount } from '../Inputs/utils.service'
import { DEFAULT_CURRENCY } from '../util'
import { getSessionLocale } from '../sessionStorage'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { OptionTreeData } from '../MultiLevelSelect/types'

export function PurchaseFormComponent (props: PurchaseFormProps) {
  const [requestTypeOptions, setRequestTypeOptions] = useState<Option[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([])
  const [companyEntityOptions, setCompanyEntityOptions] = useState<Option[]>([])
  const [accountCodeOptions, setAccountCodeOptions] = useState<Option[]>([])
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const [billingOptions, setBillingOptions] = useState<Option[]>([])

  const [isPurchaseTypeData, setIsPurchaseTypeData] = useState<boolean>(false)
  const [requestType, setRequestType] = useState<Option>()
  const [products, setProducts] = useState<ProductLine[]>([])
  const [additionalServices, setAdditionalServices] = useState<ProductLine[]>([])
  const [contractStart, setContractStart] = useState<string>('')
  const [contractEnd, setContractEnd] = useState<string>('')
  const [orderForm, setOrderForm] = useState<Attachment>()
  const [quote, setQuote] = useState<Attachment>()

  const [user, setUser] = useState<string>('')
  const [department, setDepartment] = useState<Option>()
  const [companyEntity, setCompanyEntity] = useState<Option>()
  const [accountCode, setAccountCode] = useState<Option>()
  const [estimatedTotal, setEstimatedTotal] = useState<Cost>({currency: DEFAULT_CURRENCY, amount: ''})
  const [currency, setCurrency] = useState<string>('')
  const [currencyChanged, setCurrencyChanged] = useState<boolean>(false)
  const [isOnlinePayment, setIsOnlinePayment] = useState<boolean>(false)
  const [summary, setSummary] = useState<string>('')

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const { t } = useTranslationHook([NAMESPACES_ENUM.PURCHASEFORM])

  useEffect(() => {
    props.requestTypeOptions && setRequestTypeOptions(props.requestTypeOptions)
  }, [props.requestTypeOptions])
  useEffect(() => {
    props.departmentOptions && setDepartmentOptions(props.departmentOptions)
  }, [props.departmentOptions])
  useEffect(() => {
    props.companyEntityOptions && setCompanyEntityOptions(props.companyEntityOptions)
  }, [props.companyEntityOptions])
  useEffect(() => {
    props.accountCodeOptions && setAccountCodeOptions(props.accountCodeOptions)
  }, [props.accountCodeOptions])
  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])
  useEffect(() => {
    props.billingOptions && setBillingOptions(props.billingOptions)
  }, [props.billingOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        paymentMethod: getFormFieldConfig('paymentMethod', props.fields),
      })
    }
  }, [props.fields])

  function localisePrices (list: ProductLine[]): ProductLine[] {
    return list.map(item => {
      return {
        ...item,
        totalPrice: {
          ...item.totalPrice,
          amount: item.totalPrice.amount ? Number(item.totalPrice.amount).toLocaleString(getSessionLocale()) : ''
        }
      }
    })
  }

  function globalisePrice (price: Cost): Cost {
    return {
      ...price,
      amount: price?.amount ? getValueFromAmount(price.amount) : ''
    }
  }

  function globalisePrices (list: ProductLine[]): ProductLine[] {
    return list.map(item => {
      return {
        ...item,
        totalPrice: globalisePrice(item.totalPrice)
      }
    })
  }

  useEffect(() => {
    if (props.formData) {
      setIsPurchaseTypeData(props.formData.purchaseType === 'data')
      setRequestType(props.formData.requestType)
      setProducts(props.formData.products.length > 0 ? localisePrices(props.formData.products) : [getEmptyProductLine()])
      setAdditionalServices(props.formData.additionalServices)
      setContractStart(props.formData.contractStart)
      setContractEnd(props.formData.contractEnd)
      setOrderForm(props.formData.orderForm)
      setQuote(props.formData.quote)
      setUser(props.formData.user)
      setDepartment(props.formData.department)
      setCompanyEntity(props.formData.companyEntity)
      setAccountCode(props.formData.accountCode)
      setEstimatedTotal({
        currency: props.formData.estimatedTotal?.currency || props.defaultCurrency || DEFAULT_CURRENCY,
        amount: props.formData.estimatedTotal?.amount ? Number(props.formData.estimatedTotal.amount).toLocaleString(getSessionLocale()) : ''
      })
      setCurrency(props.formData.currency)
      setCurrencyChanged(!!props.formData.currencyChanged)
      setIsOnlinePayment(props.formData.paymentMethod === 'onlinePayment')
      setSummary(props.formData.summary)
    }
  }, [props.formData])

  function getFormData (): PurchaseFormData {
    return {
      purchaseType: isPurchaseTypeData ? 'data' : 'software',
      requestType,
      products: globalisePrices(products),
      additionalServices: globalisePrices(additionalServices),
      contractStart,
      contractEnd,
      orderForm,
      quote,
      user,
      department,
      companyEntity,
      accountCode,
      estimatedTotal: globalisePrice(estimatedTotal),
      currency,
      currencyChanged,
      paymentMethod: isOnlinePayment ? 'onlinePayment' : 'invoice',
      summary
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | ProductLine[] | Attachment | File | boolean): PurchaseFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as PurchaseFormData

    switch (fieldName) {
      case 'isPurchaseTypeData':
        formData.purchaseType = (newValue as boolean) ? 'data' : 'software'
        break
      case 'requestType':
        formData.requestType = newValue as Option
        break
      case 'products':
        formData.products = globalisePrices(newValue as ProductLine[])
        break
      case 'additionalServices':
        formData.additionalServices = newValue as ProductLine[]
        break
      case 'contractStart':
        formData.contractStart = newValue as string
        break
      case 'contractEnd':
        formData.contractEnd = newValue as string
        break
      case 'orderForm':
        formData.orderForm = newValue as Attachment | File
        break
      case 'quote':
        formData.quote = newValue as Attachment | File
        break
      case 'department':
        formData.department = newValue as Option
        break
      case 'companyEntity':
        formData.companyEntity = newValue as Option
        break
      case 'accountCode':
        formData.accountCode = newValue as Option
        break
      case 'estimatedTotal':
        formData.estimatedTotal.amount = newValue as string
        break
      case 'isOnlinePayment':
        formData.paymentMethod = (newValue as boolean) ? 'onlinePayment' : 'invoice'
        break
      case 'currency':
        formData.estimatedTotal.currency = newValue as string
        formData.currency = newValue as string
        formData.currencyChanged = true
        break
      case 'summary':
        formData.summary = newValue as string
        break
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Option | ProductLine[] | Attachment | boolean,
    newValue: string | Option | ProductLine[] | Attachment | File | boolean
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (typeof newValue === 'boolean' && !!oldValue !== !!newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areProductLinesSame(oldValue as ProductLine[], newValue as ProductLine[])) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = false

    if (!requestType || !requestType.id) {
      invalidFieldId = 'request-type-field'
      isInvalid = true
    } else if (!products || products.length < 1 || !areProductsValid(products)) {
      invalidFieldId = 'products-field'
      isInvalid = true
    } else if (additionalServices && additionalServices.length > 0 && !areServicesValid(products)) {
      invalidFieldId = 'services-field'
      isInvalid = true
    } else if (!contractStart || !contractEnd || !!validateDateOrdering(contractStart, contractEnd)) {
      invalidFieldId = 'timeline-field'
      isInvalid = true
    } else if (!department || !department.id) {
      invalidFieldId = 'department-field'
      isInvalid = true
    } else if (!companyEntity || !companyEntity.id) {
      invalidFieldId = 'company-entity-field'
      isInvalid = true
    } else if (!accountCode || !accountCode.id) {
      invalidFieldId = 'account-code-field'
      isInvalid = true
    } else  if (!(estimatedTotal?.currency) || isEmpty(estimatedTotal.currency) || !(estimatedTotal?.amount) || isEmpty(estimatedTotal.amount)) {
      invalidFieldId = 'estimated-total-field'
      isInvalid = true
    } else if (!summary) {
      invalidFieldId = 'summary-field'
      isInvalid = true
    }

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

  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
    return isEmpty(value) ? t('--requiredField--',{field:label}) : ''
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
    return validateField('contractStart', t('--startDate--'), dateRange.startDate) || validateField('contractEnd',t('--endDate--') , dateRange.endDate) ||
      (dateRange.startDate !== null && dateRange.endDate !== null ? validateDateOrdering(dateRange.startDate, dateRange.endDate) : '')
  }

  function handleDateRangeChange (start: string, end: string) {
    setContractStart(start)
    setContractEnd(end)

    handleFieldValueChange('contractStart', contractStart, start)
    handleFieldValueChange('contractEnd', contractEnd, end)
  }

  function uploadFile (file: File, fieldName: string, fileName: string) {
    handleFieldValueChange(fieldName, null, file)
    if (props.onFileUpload) {
      props.onFileUpload(file, fieldName, fileName)
    }
  }

  function deleteFile (fieldName: string) {
    handleFieldValueChange(fieldName, 'file', null)
    if (props.onFileDelete) {
      props.onFileDelete(fieldName)
    }
  }

  function handleCostChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    setEstimatedTotal({
      amount: cleanedupValue,
      currency: estimatedTotal?.currency || currency
    })

    handleFieldValueChange('estimatedTotal', estimatedTotal?.amount || '', cleanedupValue)
  }

  function handleCurrencyChange (value: string) {
    setEstimatedTotal({
      amount: estimatedTotal?.amount || '',
      currency: value
    })

    setCurrency(value)
    setCurrencyChanged(true)

    handleFieldValueChange('currency', estimatedTotal?.currency || currency, value)
  }

  function handleProductCurrencyChange (value: string) {
    setEstimatedTotal({
      amount: estimatedTotal?.amount || '',
      currency: value
    })

    setCurrency(value)
    setCurrencyChanged(true)
  }

  function searchProduct (query: string) {
    if (props.onProductSearch) {
      return props.onProductSearch(query)
    } else {
      return Promise.resolve([])
    }
  }

  function fetchData (skipValidation?: boolean): PurchaseFormData {
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

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  useEffect(() => {
    let total = 0
    products.forEach(item => {
      if (item.totalPrice?.amount) {
        const cleanedupValue = getValueFromAmount(item.totalPrice.amount)
        const itemPrice = Number(cleanedupValue)
        total = total + (isNaN(itemPrice) ? 0 : itemPrice)
      }
    })
    additionalServices.forEach(item => {
      if (item.totalPrice?.amount) {
        const cleanedupValue = getValueFromAmount(item.totalPrice.amount)
        const itemPrice = Number(cleanedupValue)
        total = total + (isNaN(itemPrice) ? 0 : itemPrice)
      }
    })

    setEstimatedTotal({
      amount: total.toLocaleString(getSessionLocale()),
      currency: estimatedTotal?.currency || currency
    })
  }, [products, additionalServices])

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    isPurchaseTypeData, requestType, products, additionalServices, contractStart, contractEnd,
    orderForm, quote, user, estimatedTotal, accountCode, department, companyEntity, summary, currency, currencyChanged, isOnlinePayment
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
    <div className={styles.purchaseForm}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col4)} id='purchase-for-field'>
            <ToggleSwitch
              className={styles.toggleSwitch}
              label={t('--whatIsTheRequestFor--')}
              value={isPurchaseTypeData}
              required={true}
              falsyLabel={t('--software--')}
              truthyLabel={t('--data--')}
              onChange={(value) => { setIsPurchaseTypeData(value); handleFieldValueChange('isPurchaseTypeData', isPurchaseTypeData, value) }}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col5)} id="request-type-field">
            <ToggleButtons
              label={t('--requestType--')}
              value={requestType}
              options={requestTypeOptions}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('requestType', t('--requestType--'), value)}
              onChange={value => { setRequestType(value); handleFieldValueChange('requestType', requestType, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col5)} id="products-field">
            <ProductList
              label={t('--productOrSubscription--')}
              description={t('--clearlyListAllItems--')}
              currency={estimatedTotal?.currency || currency}
              billingOptions={billingOptions}
              currencyOptions={currencyOptions}
              required={true}
              value={products}
              forceValidate={forceValidate}
              onChange={(value) => { setProducts(value); handleFieldValueChange('products', products, value) }}
              onCurrencyChange={handleProductCurrencyChange}
              onProductSearch={searchProduct}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col5)} id="additional-services-field">
            <ServiceList
              label={t('--additionalServiceFromThisSupplier--')}
              currency={estimatedTotal?.currency || currency}
              currencyOptions={currencyOptions}
              required={false}
              value={additionalServices}
              forceValidate={forceValidate}
              onChange={(value) => { setAdditionalServices(value); handleFieldValueChange('additionalServices', additionalServices, value) }}
              onCurrencyChange={handleProductCurrencyChange}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col2)} id="timeline-field">
            <DateRange
              locale={getSessionLocale()}
              label={t('--contractDates--')}
              startDate={getDateObject(contractStart)}
              endDate={getDateObject(contractEnd)}
              required={true}
              forceValidate={forceValidate}
              validator={validateDateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col5)} id="quotes-field">
            <QuotePOList
              label={t('--alreadyHaveQuoteOrOrderForm--')}
              orderForm={orderForm}
              quote={quote}
              onFileUpload={uploadFile}
              deleteFile={deleteFile}
              onPreview={loadFile}
            />
          </div>
        </div>
      </div>

      <div className={styles.section} >
        <div className={styles.title}>{t('--budgetDetails--')}</div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col2)} id="user-field">
            <TextBox
              label={t('--user--')}
              disabled={true}
              required={true}
              value={user}
            />
          </div>
          <div className={classnames(styles.item, styles.col2)} id="department-field">
            <TypeAhead
              label={t('--department--')}
              value={department}
              options={departmentOptions}
              required={true}
              forceValidate={forceValidate}
              fetchChildren={(parent, childrenLevel) => fetchChildren('Department', parent, childrenLevel)}
              onSearch={(keyword) => searchMasterdataOptions(keyword, 'Department')}
              validator={(value) => validateField('department', t('--department--'), value)}
              onChange={value => { setDepartment(value); handleFieldValueChange('department', department, value) }}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col2)} id="company-entity-field">
            <TypeAhead
              label={t('--businessEntity--')}
              placeholder={t('--chooseBusinessEntity--')}
              type={OptionTreeData.entity}
              value={companyEntity}
              options={companyEntityOptions}
              showTree={true}
              required={true}
              forceValidate={forceValidate}
              fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
              onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
              validator={(value) => validateField('companyEntity', t('--businessEntity--'), value)}
              onChange={value => { setCompanyEntity(value); handleFieldValueChange('companyEntity', companyEntity, value) }}
            />
          </div>
          <div className={classnames(styles.item, styles.col2)} id="account-code-field">
            <TypeAhead
              label={t('--accountCode--')}
              value={accountCode}
              options={accountCodeOptions}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('accountCode', t('--accountCode--'), value)}
              onChange={value => { setAccountCode(value); handleFieldValueChange('accountCode', accountCode, value) }}
            />
          </div>
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col2)} id="estimated-total-field">
            <Currency
              locale={getSessionLocale()}
              label={t('--estimatedTotalAmount--')}
              unit={estimatedTotal?.currency}
              value={estimatedTotal?.amount}
              unitOptions={currencyOptions}
              required={true}
              disabled={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('estimatedTotal', t('--estimatedTotalAmount--'), value)}
              onChange={handleCostChange}
              onUnitChange={handleCurrencyChange}
            />
          </div>
        </div>

        { !isFieldOmitted('paymentMethod') &&
          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col2)} id='payment-method-field'>
              <ToggleSwitch
                label={t('--paymentMethod--')}
                value={isOnlinePayment}
                required={true}
                falsyLabel={t('--invoice--')}
                truthyLabel={t('--onlinePayment--')}
                onChange={(value) => { setIsOnlinePayment(value); handleFieldValueChange('isOnlinePayment', isOnlinePayment, value) }}
              />
            </div>
          </div>
        }
      </div>

      <div className={styles.section} >
        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col4)} id="summary-field">
            <TextArea
              label={t('--bussinessNeedForThisRequest--')}
              value={summary}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('summary', t('--bussinessNeedForThisRequest--'), value)}
              onChange={value => { setSummary(value); handleFieldValueChange('summary', summary, value) }}
            />
          </div>
        </div>

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
export function PurchaseForm (props: PurchaseFormProps) {
  return <I18Suspense><PurchaseFormComponent {...props} /></I18Suspense>
}