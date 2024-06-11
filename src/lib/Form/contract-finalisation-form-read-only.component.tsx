import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { IDRef } from './../Types'
import { ContractFieldConfig, ContractFields, ContractFieldSection, ContractFormData, ContractFormProps, ContractFormView, ContractRevision, ContractTypeDefinition, ContractTypeDefinitionField, enumContractConfigFields, Field, } from './types'
import styles from './contract-negotiation-form-read-only-styles.module.scss'
import classnames from 'classnames'
import { checkURLContainsProtcol } from '../util'
import { ContractRevisionDialog } from './components/contract-revision-dialog.component'
import { OROFORMIDS, getFieldConfigValue, getFormFieldsMap, getUserDisplayName, isSectionExists } from './util'
import { displayTenantCurrency, getFieldDisplayValue, mapFieldConfigToFields } from './contract-negotiation-form-new.component'
import { useTranslationHook, NAMESPACES_ENUM } from '../i18n';
import { LegalDocumentsValueNew, mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'

export const annualRecurringIDRef: IDRef = {
    id: 'annual',
    name: 'Annual',
    erpId: ''
}  

export function ContractFinalisationFormReadOnly (props: ContractFormProps) {
    const [contractFormData, setContractFormData] = useState<ContractFormData>()
    const [revisions, setRevisions] = useState<Array<ContractRevision>>([])
    const [contractType, setContractType] = useState<IDRef>(annualRecurringIDRef)
    const [contractFields, setContractFields] = useState<Array<ContractTypeDefinitionField>>([])
    const [showRevisions, setShowRivisions] = useState<boolean>(false)
    const [isViewMore, setIsViewMore] = useState<boolean>(false)
    const [contractFieldConfig, setContractFieldConfig] = useState<ContractFieldConfig[]>([])
    const [finalRevisionIndex, setFinalRevisionIndex] = useState<number>(null)

    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const [showDecimals, setShowDecimals] = useState<boolean>(false)
    const { t } = useTranslationHook( NAMESPACES_ENUM.CONTRACTFORM)

    useEffect(() => {
        if (props.formData) {
          setContractFormData(props.formData)
          setRevisions([...props.formData.revisions])
        }

        if (props.formData?.contractType?.id) {
            setContractType(props.formData?.contractType)
        }
        setFinalRevisionIndex(props.formData.selectedRevisionIndex)
    }, [props.formData])

    useEffect(() => {
      if (props.contractTypeDefinition) {
        const fields = getContractFieldsBasedOnType(props.contractTypeDefinition)
        setContractFields(fields || [])
        setContractFieldConfig(fields && fields.length > 0 ? mapFieldConfigToFields(fields.filter(field => field.section)) : [])
      }
    }, [props.contractTypeDefinition])

    useEffect(() => {
      if (props.fields) {
        const fieldList = [enumContractConfigFields.basicInfoVisible, enumContractConfigFields.allowDecimal,
          enumContractConfigFields.documentsVisible, enumContractConfigFields.documentsRequired
        ]
        const _fieldMap = getFormFieldsMap(props.fields, fieldList)
        setFieldMap(_fieldMap)
        setShowDecimals(getFieldConfigValue(_fieldMap, enumContractConfigFields.allowDecimal))
      }
    }, [props.fields])

    function getContractFieldsBasedOnType (typeDefinition: ContractTypeDefinition[]) {
        if (props.formData && props.formData?.contractType?.id) {
          const fields = typeDefinition.find(fieldType => fieldType.code === props.formData.contractType.id)?.fields
          return fields && fields.length > 0 ? fields : []
        }
        return typeDefinition[0]?.fields
    }

    function showAllRevision () {
      setShowRivisions(true)
    }

    function getRelatedContracts () {
        const renewalContracts = contractFormData?.relatedContracts
        return renewalContracts?.length > 0 ? renewalContracts.map(contract => contract.name).join(', ') : '-'
    }

    function goToContract (id: string) {
        if (props.onViewRelatedContract && id) {
          props.onViewRelatedContract(id)
        }
    }

    function checkIfDocumentSectionVisible () {
        return props.formId === OROFORMIDS.OroContractCommercialForm ? getFieldConfigValue(fieldMap, enumContractConfigFields.documentsVisible) : true
    }

    function checkIfBasicInfoSectionVisible () {
        return fieldMap && Object.keys(fieldMap)?.length > 0 ? getFieldConfigValue(fieldMap, enumContractConfigFields.basicInfoVisible) : true
    }

    return (<>
        <div className={`${styles.contractNegotiationReadOnlyForm} ${props.isInPortal ? styles.singleColumn : ''}`}>
            {checkIfBasicInfoSectionVisible() && <div className={styles.contractNegotiationReadOnlyFormSection}>
                <div className={styles.title}>
                    {t("Basic information")}
                </div>
                {contractFormData?.supplierName && <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Supplier")}</div>
                    <div className={classnames(styles.value, styles.col4)}>
                        {mapCustomFieldValue({value: contractFormData?.supplierName, fieldName: 'supplierName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
                    </div>
                </div>}
                <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Company Entity")}</div>
                    <div className={classnames(styles.value, styles.col4)}>
                        {mapCustomFieldValue({value: contractFormData?.companyEntity?.displayName, fieldName: 'companyEntity', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
                    </div>
                </div>
                {contractFormData?.businessOwners?.length > 0 &&<div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Business Owner")}</div>
                    {contractFormData?.businessOwners?.length > 0 &&
                    <div className={classnames(styles.value, styles.col4)}>
                       {contractFormData?.businessOwners.map((user, index) => {
                         return (<div className={styles.userInfo} key={index}>
                            <span className={styles.contractReadOnlyValue}>
                              {getUserDisplayName(user)}
                              {user.userName && <span className={styles.email}>({user.userName})</span>}
                            </span>
                         </div>
                         )
                      })}
                    </div>}
                    {contractFormData?.businessOwners?.length === 0 &&
                        <div className={classnames(styles.value, styles.col4)}>-</div>
                    }
                </div>}
                {contractFormData?.currency?.displayName && <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Currency")}</div>
                    <div className={classnames(styles.value, styles.col4)}>{contractFormData?.currency?.displayName || '-'}</div>
                </div>}
                {contractFormData?.relatedContracts.length > 0 && <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Contracts for renewal")}</div>
                    <div className={classnames(styles.value, styles.col4)}>
                      <div className={styles.relatedContracts}>
                        {
                            contractFormData.relatedContracts.map((contract, index) => {
                              return (
                                <div key={index} className={styles.wrapper}>
                                  <div className={styles.link} onClick={() => goToContract(contract.id)}>{contract.name}</div>
                                  {(contractFormData.relatedContracts.length && (index < contractFormData.relatedContracts.length - 1)) && <span>, </span>}
                                </div>)
                              })
                        }
                      </div>
                    </div>
                </div>}
                {contractFormData?.savingsLink && <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Contract tracking link")}</div>
                    <div className={classnames(styles.value, styles.col4, styles.linkContainer)}>
                        {contractFormData?.savingsLink && <a href={checkURLContainsProtcol(contractFormData?.savingsLink)} target="_blank" rel="noopener noreferrer">
                            {/* {contractFormData?.savingsLink} */}
                            {mapCustomFieldValue({value: contractFormData?.savingsLink, fieldName: 'savingsLink', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
                            </a>}
                        {!contractFormData?.savingsLink && '-'}
                    </div>
                </div>}
            </div> }
            {(isSectionExists(props.contractTypeDefinition, props.formData?.contractType?.id, ContractFieldSection.contractValues) || isSectionExists(props.contractTypeDefinition, props.formData?.contractType?.id, ContractFieldSection.terms)) && <div className={styles.contractNegotiationReadOnlyFormSection}>
                <div className={classnames(styles.title, styles.titleContainer)}>
                    <span>{t("Final contract values")}</span>
                    { revisions.length > 0 && <button className={styles.linkButton} onClick={showAllRevision}>
                        <span>{t("Compare proposals")}</span>
                    </button> }
                </div>
                {contractFormData && <div className={styles.proposalSection}>
                    {!isViewMore && <>
                     {contractFormData?.contractDescription && <div className={styles.row}>
                        <div className={classnames(styles.label, styles.col2)}>{t("Product / Service description")}</div>
                        <div className={classnames(styles.value, styles.col4)}>{contractFormData?.contractDescription}</div>
                     </div> }
                    { contractFieldConfig && contractFieldConfig.length > 0 && contractFieldConfig.slice(0, 1).map((section, index) => {
                        return (<div key={index}>
                            {section.children && section.children.slice(0, 3).map((field, index) => {
                            return (<div key={index}>
                                {getFieldDisplayValue(contractFormData, field.id) !== '-' && <div className={styles.row}>
                                    <div className={classnames(styles.label, styles.col2)}>{field.name}</div>
                                    {field.type !== 'money' && <div className={classnames(styles.value, styles.col4)}>{getFieldDisplayValue(contractFormData, field.id)}</div>}
                                    {field.type === 'money' && <div className={classnames(styles.value, styles.col4)}>
                                        {getFieldDisplayValue(contractFormData, field.id)}
                                        {displayTenantCurrency(contractFormData, field.id) &&
                                        <span className={styles.tenantValue}>{displayTenantCurrency(contractFormData, field.id, true, showDecimals)}</span>}
                                    </div>}
                                </div>}
                            </div>)
                            })}
                        </div>
                        )
                    })}
                    <div className={styles.row}>
                        <button className={styles.linkButton} onClick={() => setIsViewMore(true)}>
                            <span>{t("View more")}</span>
                            <ChevronDown size={18} color="var(--warm-prime-azure)" />
                        </button>
                    </div></>}

                    {isViewMore && <>
                        {contractFormData?.contractDescription && <div className={styles.row}>
                            <div className={classnames(styles.label, styles.col2)}>{t("Product / Service description")}</div>
                            <div className={classnames(styles.value, styles.col4)}>{contractFormData?.contractDescription}</div>
                        </div>}
                        {contractFieldConfig && contractFieldConfig.length > 0 && contractFieldConfig.map((section, index) => {
                            return (<div key={index}>
                                {section.id !== ContractFieldSection.contractValues && <div className={styles.sectionTitle}>
                                    {section.name}
                                </div>}
                                {
                                    section.children && section.children.length > 0 && section.children.map((field, index) => {
                                        return (<div key={index}>
                                            {getFieldDisplayValue(contractFormData, field.id) !== '-' && field.id !== ContractFields.yearlySplits &&
                                            <div className={styles.row}>
                                                <div className={classnames(styles.label, styles.col2)}>{field.name}</div>
                                                {field.type !== 'money' && <div className={classnames(styles.value, styles.col4)}>{getFieldDisplayValue(contractFormData, field.id)}</div>}
                                                {field.type === 'money' && 
                                                <div className={classnames(styles.value, styles.col4)}>
                                                    {getFieldDisplayValue(contractFormData, field.id)}
                                                    {displayTenantCurrency(contractFormData, field.id) &&
                                                    <span className={styles.tenantValue}>{displayTenantCurrency(contractFormData, field.id, true, showDecimals)}</span>}
                                                </div>}
                                            </div>}
                                            {field.id === ContractFields.yearlySplits && contractFormData?.yearlySplits && contractFormData?.yearlySplits?.length > 0 &&
                                                <div className={styles.row}>
                                                    <div className={classnames(styles.label, styles.col2)}>{field.name}</div>
                                                </div>
                                            }
                                            {
                                               field.id !== ContractFields.contractPeriod && field.id !== ContractFields.yearlySplits && field.children && field.children.length > 0 && field.children.map((child, index) => {
                                                return (<div key={index}>
                                                    {getFieldDisplayValue(contractFormData, child.id) !== '-' &&
                                                    <div className={styles.row}>
                                                        <div className={classnames(styles.label, styles.col2)}>{child.name}</div>
                                                        <div className={classnames(styles.value, styles.col4)}>{getFieldDisplayValue(contractFormData, child.id)}</div>
                                                    </div>
                                                   }
                                                </div>
                                                )})
                                            }
                                            {
                                                field.id === ContractFields.yearlySplits && contractFormData.yearlySplits?.length > 0 && contractFormData.yearlySplits.map((splits, splitIndex) => {
                                                    return (<div key={splitIndex}>
                                                    {field.children && field.children.length > 0 && field.children.map((child, index) => {
                                                        return (<div key={index} >
                                                            <div className={styles.row}>
                                                                <div className={classnames(styles.label, styles.col2)}>{child.name}</div>
                                                                {child.id !== ContractFields.year &&
                                                                 <div className={classnames(styles.value, styles.col4)}>
                                                                    {getFieldDisplayValue(splits, child.id, field.id)}
                                                                    {displayTenantCurrency(splits, child.id) &&
                                                                    <span className={styles.tenantValue}>{displayTenantCurrency(splits, child.id, true, showDecimals)}</span>}
                                                                 </div>
                                                                }
                                                                {child.id === ContractFields.year && <div className={classnames(styles.value, styles.col4)}>
                                                                    Year {splitIndex + 1} 
                                                                    {getFieldDisplayValue(splits, child.id, field.id) !== '-' && <span className={styles.tenantValue}>{`(${getFieldDisplayValue(splits, child.id, field.id)})`}</span>}
                                                                </div>}
                                                            </div>
                                                        </div>)
                                                    })}
                                                    </div>  
                                                    )
                                                })
                                            }
                                        </div>)
                                    })
                                }
                            </div>)
                        })}
                        <div className={styles.row}>
                            <button className={styles.linkButton} onClick={() => setIsViewMore(false)}>
                                <span>{t("View less")}</span>
                                <ChevronUp size={18} color="var(--warm-prime-azure)" />
                            </button>
                        </div>
                    </>}
                </div>}
            </div>}
            {checkIfDocumentSectionVisible() && <div className={styles.contractNegotiationReadOnlyFormSection}>
                <div className={styles.title}>
                    {!props.isContractOverView ? t("Documents") : t("--executedContracts--")}
                </div>
                <LegalDocumentsValueNew
                    value={{
                      isContractFom: true,
                      isContractOverview: props.isContractOverView,
                      finalisedDocuments: props.additionalOptions?.finalisedDocuments,
                      documentType: props.additionalOptions?.documentType,
                      getDoucumentUrlById: props.dataFetchers?.getDoucumentUrlById,
                      getDoucumentByPath: props.dataFetchers?.getDoucumentByPath,
                      getDoucumentByUrl: props.dataFetchers?.getDoucumentByUrl
                    }}
                  />
            </div>}
            { contractType && <ContractRevisionDialog
                isOpen={showRevisions}
                contractType={contractType}
                revisions={revisions}
                currency={contractFormData?.currency}
                view={ContractFormView.finalProposalReadOnly}
                selectedRevisionIndex={finalRevisionIndex}
                fields={contractFields || []}
                fieldDefinition={props.contractTypeDefinition}
                showDecimals={showDecimals}
                toggleModal={() => setShowRivisions(false)}
            /> }
        </div>
    </>)
}