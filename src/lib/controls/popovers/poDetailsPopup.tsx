import React, { useEffect, useState } from 'react'
import { Box, Modal } from '@mui/material'
import { CustomFormData, CustomFormDefinition, Field, FormDefinitionReadOnlyView, ItemDetailsControlNew, LocalLabels, Option, PurchaseOrder, getFormFieldConfig } from "../.."
import { X } from 'react-feather'
import classnames from 'classnames'
import { OROFORMIDS, getDateString, getPOStatus } from '../../Form/util'
import { DataFetchers, Events, FieldOptions } from '../../CustomFormDefinition/NewView/FormView.component'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { DEFAULT_CURRENCY, getFormattedValue } from '../../util'
import styles from './poContractDetails.module.scss'

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 840,
    bgcolor: 'background.paper',
    p: 4,
    outline: 'none',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0px 4px 30px 0px rgba(6, 3, 34, 0.15)'
}

function HeaderBar (props: {po: PurchaseOrder}) {
    const [attributes, setAttributes] = useState<Array<{label: string, value: string}>>([])
    const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

    useEffect(() => {
      if (props.po) {
        const _highlights: Array<{label: string, value: string}> = []
        if (props.po.erpCreatedDate || props.po.created) {
          _highlights.push({
            label: t('--poDetail--.--date--'),
            value: props.po?.erpCreatedDate ? getDateString(props.po.erpCreatedDate) : props.po?.created ? getDateString(props.po.created) : '-'
          })
        }
        if (props.po.requestorName) {
          _highlights.push({
            label: t('--poDetail--.--requester--'),
            value: props.po?.requestorName
          })
        }
        if (props.po.cost) {
          _highlights.push({
            label: t('--poDetail--.--amount--'),
            value: getFormattedValue(props.po?.cost, props.po?.currencyCode || DEFAULT_CURRENCY, '', true)
          })
        }
        if (props.po.billedAmountMoney) {
            _highlights.push({
              label: t('--poDetail--.--billed--'),
              value: getFormattedValue(props.po?.billedAmountMoney?.amount, props.po?.billedAmountMoney?.currency, '', true)
            })
          }
        setAttributes(_highlights)
      }
    }, [props.po])

    return (
      <div className={styles.container}>
        <div className={styles.details}>
          <div className={styles.item}>{props.po?.poNumber}</div>
          <div className={styles.item}>
            {props.po?.normalizedVendorRef?.name && <div>{props.po?.normalizedVendorRef?.name || '-'}</div>}
            {(props.po?.status || props.po?.runtimeStatus) &&
            <div className={classnames(styles.status, styles[`${props.po?.runtimeStatus}`])}>
                <span className={styles.value}>{getPOStatus(props.po, t)}</span>
            </div>}
          </div>
        </div>
        <div className={styles.attributeContainer}>
          {
            attributes.map((highlight, index) =>
              <div className={styles.attribute} key={index}>
                <div className={styles.attributeLabel}>{highlight.label}:</div>
                <div className={styles.attributeValue}>{highlight.value}</div>
              </div>
            )
          }
        </div>
      </div>
    )
}

export function PODetailPopup (props: {
    isOpen: boolean
    data: PurchaseOrder
    fields?: Field[]
    documentTypeOptions?: Option[]
    dataFetchers?: DataFetchers
    events?: Events
    options?: FieldOptions
    locale: string
    onClose?: () => void
}) {
    const [poDetail, setPODetail] = useState<PurchaseOrder>()
    const [fields, setFields] = useState<Field[]>([])
    const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition>()
    const [localLabels, setLocalLabels] = useState<LocalLabels>()
    const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

    function fetchHeaderExtensionFormDefinition (fieldConfig: Field[]) {
      if (fieldConfig) {
        const headerFormExtension = fieldConfig?.find(currentField => currentField.fieldName === 'headerExtensionForm')
        if (headerFormExtension?.questionnaireId?.formId && props.events) {
            if (props.events.fetchExtensionCustomFormDefinition) {
                props.events.fetchExtensionCustomFormDefinition(headerFormExtension?.questionnaireId?.formId)
                  .then(response => {
                    setCustomFormDefinition(response)
                  })
                  .catch(err => console.log('PO Details: Error in fetching custom form definition', err))
            }
            if (props.events.fetchExtensionCustomFormLocalLabels) {
                props.events.fetchExtensionCustomFormLocalLabels(headerFormExtension?.questionnaireId?.formId)
                  .then(response => {
                    setLocalLabels(response)
                  })
                  .catch(err => console.log('PO Details: Error in fetching custom form locale labels', err))
            }
        }
      }
    }

    function fetchPOFormConfig () {
      if (props.dataFetchers?.getFormConfig) {
        props.dataFetchers?.getFormConfig(OROFORMIDS.OroChangeOrderForm)
          .then(res => {
            setFields(res || [])
            fetchHeaderExtensionFormDefinition(res)
          })
          .catch(err => console.log(err))
      }
    }

    useEffect(() => {
      fetchPOFormConfig()
    }, [])

    useEffect(() => {
      if (props.data) {
        setPODetail(props.data)
      }
    }, [props.data])

    useEffect(() => {
      if (props.fields) {
        setFields(props.fields)
        fetchHeaderExtensionFormDefinition(props.fields)
      }
    }, [props.fields])

    function getBasicDetails (): JSX.Element {
        return (<>
            <div className={styles.info}>
                <div className={styles.title}>{t('--poDetails--.--title--')}</div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--vendorId--')}</div>
                  <div className={styles.itemValue}>{poDetail?.normalizedVendorRef?.selectedVendorRecord?.vendorId || '-'}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--departments--')}</div>
                  <div className={styles.itemValue}>{poDetail?.departmentRef?.name || '-'}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--companyEntity--')}</div>
                  <div className={styles.itemValue}>{poDetail?.companyEntityRef?.name || '-'}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--currency--')}</div>
                  <div className={styles.itemValue}>{poDetail?.currencyCode || '-'}</div>
                </div>
                {poDetail?.contractType?.name && <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--contractType--')}</div>
                  <div className={styles.itemValue}>{poDetail?.contractType?.name}</div>
                </div>}
                {poDetail?.accumulator?.quantityReceived && <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--quantityReceived--')}</div>
                  <div className={styles.itemValue}>{poDetail?.accumulator?.quantityReceived?.toString() || '-'}</div>
                </div>}
                {poDetail?.accumulator?.quantityBilled && <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--quantityInvoiced--')}</div>
                  <div className={styles.itemValue}>{poDetail?.accumulator?.quantityBilled?.toString() || '-'}</div>
                </div>}
            </div>
            {poDetail?.paymentTermsRef && <div className={styles.info}>
                <div className={styles.subTitle}>{t('--poDetails--.--terms--')}</div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>{t('--poDetails--.--paymentTerms--')}</div>
                  <div className={styles.itemValue}>{poDetail?.paymentTermsRef?.name || '-'}</div>
                </div>
            </div>}
        </>)
    }

    function mapCustomFormData (data: any): CustomFormData {
        const formData: CustomFormData = {}
        Object.entries(data).map((keyVal) => {
          const [key, value]: Array<any> = keyVal
          formData[key] = value
          return data
        })
        return formData
    }

    return (
        <Modal open={props.isOpen} onClose={props.onClose}>
          <Box sx={modalStyle}>
            <div className={styles.detailsModal}>
              <div className={styles.headerBar}>
                <HeaderBar po={poDetail}/>
                <div className={styles.closeBtn} onClick={props.onClose}>
                  <X size={20} color={'var(--warm-neutral-shade-500)'} />
                </div>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.poContainer}>
                  {getBasicDetails()}
                  {customFormDefinition && (poDetail?.dataJson && Object.keys(JSON.parse(poDetail?.dataJson))?.length > 0) &&
                    <div className={styles.poHeaderExtensionForm}>
                        <FormDefinitionReadOnlyView
                            formDefinition={customFormDefinition}
                            formData={mapCustomFormData(JSON.parse(poDetail?.dataJson))}
                            locale={props.locale}
                            localLabels={localLabels}
                            loadCustomerDocument={props.dataFetchers?.getDoucumentByPath}
                            documentType={props.documentTypeOptions}
                            getDoucumentByUrl={props.dataFetchers?.getDoucumentByUrl}
                            getDoucumentUrlById={props.dataFetchers?.getDoucumentUrlById}
                            options={{
                                ...props.options,
                                defaultCurrency: poDetail?.currencyCode || props.options?.defaultCurrency || DEFAULT_CURRENCY,
                                defaultAccountCode: poDetail?.accountRef || props.options?.defaultAccountCode
                            }}
                        />
                    </div>}
                    {poDetail?.itemList?.items && poDetail?.itemList?.items?.length > 0 && <div className={styles.lineItem}>
                        <div className={styles.heading}>{t('--poDetails--.--items--')}</div>
                        <ItemDetailsControlNew
                            value={{ items: poDetail.itemList?.items || [] }}
                            readOnly
                            config={{
                              isReadOnly: true,
                              itemListConfig: getFormFieldConfig('poLineItems', fields as Field[])?.itemConfig
                            }}
                            additionalOptions={{
                                ...props.options,
                                defaultCurrency: poDetail?.currencyCode || props.options?.defaultCurrency || DEFAULT_CURRENCY,
                                defaultAccountCode: poDetail?.accountRef || props.options?.defaultAccountCode
                            }}
                            dataFetchers={props.dataFetchers}
                            events={props.events}
                        />
                    </div>}
                    {poDetail?.expenseItemList?.items && poDetail?.expenseItemList?.items?.length > 0 && <div className={styles.lineItem}>
                        <div className={styles.heading}>{t('--poDetails--.--expenseItems--')}</div>
                        <ItemDetailsControlNew
                            value={{ items: poDetail.expenseItemList?.items || [] }}
                            readOnly
                            config={{
                              isReadOnly: true,
                              itemListConfig: getFormFieldConfig('expenseLineItems', fields as Field[])?.itemConfig
                            }}
                            additionalOptions={{
                                ...props.options,
                                defaultCurrency: poDetail?.currencyCode || props.options?.defaultCurrency || DEFAULT_CURRENCY,
                                defaultAccountCode: poDetail?.accountRef || props.options?.defaultAccountCode
                            }}
                            dataFetchers={props.dataFetchers}
                            events={props.events}
                        />
                    </div>}
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      )
}
