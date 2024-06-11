import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { IDRef } from './../Types'
import { ANNUAL_CONTRACT, ContractFieldConfig, ContractFields, ContractFieldSection, ContractFormData, ContractFormProps, ContractRevision, ContractTypeDefinition, ContractTypeDefinitionField, ContractYearlySplit, DocumentRef, enumContractConfigFields, FIXED_CONTRACT, MONTHLY_CONTRACT, } from './types'
import styles from './contract-negotiation-form-read-only-styles.module.scss'
import classnames from 'classnames'
import { FilePreview } from '../FilePreview'
import { checkURLContainsProtcol } from '../util'
import { ContractRevisionDialog } from './components/contract-revision-dialog.component'
import { getFieldConfigValue, getFieldDisplayName, getFormFieldsMap, getUserDisplayName, isFieldExists } from './util'
import { displayTenantCurrency, getFieldDisplayValue, mapFieldConfigToFields } from './contract-negotiation-form-new.component'
import { useTranslationHook, NAMESPACES_ENUM } from '../i18n';
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'

export const annualRecurringIDRef: IDRef = {
    id: 'annual',
    name: 'Annual',
    erpId: ''
}  

function RevisionDetail (props: {revision: ContractRevision, fieldDefinition: ContractTypeDefinition[], showDecimals?: boolean}) {
  const [contractFieldConfig, setContractFieldConfig] = useState<ContractFieldConfig[]>([])
  const [showViewMore, setShowViewMore] = useState<boolean>(false)
  const { t } = useTranslationHook( NAMESPACES_ENUM.CONTRACTFORM)

  useEffect(() => {
    if (props.revision && props.fieldDefinition) {
      const fieldConfig = props.fieldDefinition.find(fieldType => fieldType.code === props.revision?.contractType?.id)?.fields
      fieldConfig && setContractFieldConfig(mapFieldConfigToFields(fieldConfig.filter(field => field.section)))
    }
  }, [props.revision, props.fieldDefinition])

  function toggleShowHide () {
    setShowViewMore(!showViewMore)
  }

  return (<>
    {!showViewMore && <>
        <div className={styles.row}>
            <div className={classnames(styles.label, styles.col2)}>{t("Contract type")}</div>
            <div className={classnames(styles.value, styles.col4)}>{props.revision?.contractType?.name || '-'}</div>
        </div>
        { contractFieldConfig && contractFieldConfig.length > 0 && contractFieldConfig.slice(0, 1).map((section, index) => {
            return (<div key={index}>
                {section.children && section.children.slice(0, 3).map((field, index) => {
                  return (<div key={index}>
                    {getFieldDisplayValue(props.revision, field.id) !== '-' && <div className={styles.row}>
                        <div className={classnames(styles.label, styles.col2)}>{field.name}</div>
                        {field.type !== 'money' && <div className={classnames(styles.value, styles.col4)}>{getFieldDisplayValue(props.revision, field.id)}</div>}
                        {field.type === 'money' && <div className={classnames(styles.value, styles.col4)}>
                            {getFieldDisplayValue(props.revision, field.id)}
                            {displayTenantCurrency(props.revision, field.id) &&
                            <span className={styles.tenantValue}>{displayTenantCurrency(props.revision, field.id, true, props.showDecimals)}</span>}
                        </div>}
                    </div>}
                  </div>)
                })}
            </div>
            )
        })}
        <div className={styles.row}>
            <button className={styles.linkButton} onClick={() => toggleShowHide()}>
                <span>{t("View more")}</span>
                <ChevronDown size={18} color="var(--warm-prime-azure)" />
            </button>
        </div>
    </>}
    {showViewMore && <>
        <div className={styles.row}>
            <div className={classnames(styles.label, styles.col2)}>{t("Contract type")}</div>
            <div className={classnames(styles.value, styles.col4)}>{props.revision?.contractType?.name || '-'}</div>
        </div>
        {contractFieldConfig && contractFieldConfig.length > 0 && contractFieldConfig.map((section, index) => {
            return (<div key={index}>
                <div className={styles.sectionTitle}>
                    {section.name}
                </div>
                {
                    section.children && section.children.length > 0 && section.children.map((field, index) => {
                        return (<div key={index}>
                            {getFieldDisplayValue(props.revision, field.id) !== '-' && field.id !== ContractFields.yearlySplits &&
                                <div className={styles.row}>
                                    <div className={classnames(styles.label, styles.col2)}>{field.name}</div>
                                    {field.type !== 'money' && 
                                    <div className={classnames(styles.value, styles.col4)}>{getFieldDisplayValue(props.revision, field.id)}</div>}
                                    {field.type === 'money' && 
                                    <div className={classnames(styles.value, styles.col4)}>
                                        {getFieldDisplayValue(props.revision, field.id)}
                                        {displayTenantCurrency(props.revision, field.id) &&
                                        <span className={styles.tenantValue}>{displayTenantCurrency(props.revision, field.id, true, props.showDecimals)}</span>}
                                    </div>}
                                </div>
                            }
                            {field.id === ContractFields.yearlySplits && props.revision?.yearlySplits && props.revision?.yearlySplits?.length > 0 &&
                                <div className={styles.row}>
                                    <div className={classnames(styles.label, styles.col2)}>{field.name}</div>
                                </div>
                            }
                            {
                               field.id !== ContractFields.contractPeriod && field.id !== ContractFields.yearlySplits && field.children && field.children.length > 0 && field.children.map((child, index) => {
                                return (<div key={index}>
                                    {getFieldDisplayValue(props.revision, child.id) !== '-' &&
                                    <div className={styles.row}>
                                        <div className={classnames(styles.label, styles.col2)}>{child.name}</div>
                                        <div className={classnames(styles.value, styles.col4)}>{getFieldDisplayValue(props.revision, child.id)}</div>
                                    </div>
                                   }
                                </div>
                                )})
                            }
                            {
                                field.id === ContractFields.yearlySplits && props.revision.yearlySplits?.length > 0 && props.revision.yearlySplits.map((splits, splitIndex) => {
                                    return (<div key={splitIndex}>
                                    {field.children && field.children.length > 0 && field.children.map((child, index) => {
                                        return (<div key={index} >
                                            {getFieldDisplayValue(splits, child.id, field.id) !== '-' && <div className={styles.row}>
                                                <div className={classnames(styles.label, styles.col2)}>{child.name}</div>
                                                {child.id !== ContractFields.year &&
                                                  <div className={classnames(styles.value, styles.col4)}>
                                                    {getFieldDisplayValue(splits, child.id, field.id)}
                                                    {displayTenantCurrency(splits, child.id) &&
                                                    <span className={styles.tenantValue}>{displayTenantCurrency(splits, child.id, true, props.showDecimals)}</span>}
                                                  </div>}
                                                {child.id === ContractFields.year && <div className={classnames(styles.value, styles.col4)}>
                                                    {t("Year")} {splitIndex + 1} 
                                                    {getFieldDisplayValue(splits, child.id, field.id) !== '-' && 
                                                    <span className={styles.tenantValue}>{`(${getFieldDisplayValue(splits, child.id, field.id)})`}</span>}
                                                </div>}
                                            </div>}
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
            <button className={styles.linkButton} onClick={() => toggleShowHide()}>
                <span>{t("View less")}</span>
                <ChevronUp size={18} color="var(--warm-prime-azure)" />
            </button>
        </div>
    </>}
  </>   
  )
}

export function ContractNegotiationFormReadOnly (props: ContractFormProps) {
    const [contractFormData, setContractFormData] = useState<ContractFormData>()
    const [fileForPreview, setFileForPreview] = useState<any | null>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
    const [docName, setDocName] = useState('')
    const [mediaType, setMediaType] = useState('')
    const [showRevisions, setShowRivisions] = useState<boolean>(false)
    const [revisions, setRevisions] = useState<Array<ContractRevision>>([])
    const [contractType, setContractType] = useState<IDRef>(annualRecurringIDRef)
    const [contractFields, setContractFields] = useState<Array<ContractTypeDefinitionField>>([])
    const [contractTypeFieldDefinition, setContractTypeFieldDefinition] = useState<Array<ContractTypeDefinition>>([])
    const [isDecimalAllowed, setIsDecimalAllowed] = useState<boolean>(false)
    const { t } = useTranslationHook( NAMESPACES_ENUM.CONTRACTFORM)

    useEffect(() => {
        if (props.fields) {
          const fieldList = [enumContractConfigFields.allowDecimal]
          const _fieldMap = getFormFieldsMap(props.fields, fieldList)
          setIsDecimalAllowed(getFieldConfigValue(_fieldMap, enumContractConfigFields.allowDecimal))
        }
    }, [props.fields])

    useEffect(() => {
        if (props.formData) {
          setContractFormData(props.formData)
          setRevisions([...props.formData.revisions])
        }

        if (props.formData?.contractType?.id) {
          setContractType(props.formData?.contractType)
        }
    }, [props.formData])

    useEffect(() => {
      if (props.contractTypeDefinition) {
        setContractTypeFieldDefinition(props.contractTypeDefinition || [])
        setContractFields(props.contractTypeDefinition[0]?.fields)
      }
    }, [props.contractTypeDefinition])

    function showAllRevision () {
      setShowRivisions(true)
    }

    function getRelatedContracts () {
        const renewalContracts = contractFormData?.relatedContracts
        return renewalContracts?.length > 0 ? renewalContracts.map(contract => contract.name).join(', ') : '-'
    }

    return (<>
        <div className={`${styles.contractNegotiationReadOnlyForm} ${props.isInPortal ? styles.singleColumn : ''}`}>
            <div className={styles.contractNegotiationReadOnlyFormSection}>
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
                {contractFormData?.businessOwners?.length > 0 && <div className={styles.row}>
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
                    <div className={classnames(styles.value, styles.col4)}>
                       {mapCustomFieldValue({value: contractFormData?.currency?.displayName, fieldName: 'currency', fieldValue: 'displayName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
                    </div>
                </div>} 
                {contractFormData?.relatedContracts.length > 0 && <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Contracts for renewal")}</div>
                    <div className={classnames(styles.value, styles.col4)}>{getRelatedContracts()}</div>
                </div>}
                {contractFormData?.savingsLink && <div className={styles.row}>
                    <div className={classnames(styles.label, styles.col2)}>{t("Contract tracking link")}</div>
                    <div className={classnames(styles.value, styles.col4, styles.linkContainer)}>
                        {contractFormData?.savingsLink && <a href={checkURLContainsProtcol(contractFormData?.savingsLink)} target="_blank" rel="noopener noreferrer">{contractFormData?.savingsLink}</a>}
                        {!contractFormData?.savingsLink && '-'}
                    </div>
                </div>}
            </div>
            <div className={styles.contractNegotiationReadOnlyFormSection}>
                <div className={classnames(styles.title, styles.titleContainer)}>
                    <span>{t("Proposals")} </span>
                    { revisions.length > 0 && <button className={styles.linkButton} onClick={showAllRevision}>
                        <span>{t("Compare proposals")}</span>
                    </button> }
                </div>

                {contractTypeFieldDefinition && contractTypeFieldDefinition.length > 0 && revisions.map((revision, index) => {
                    return (
                        <div key={index} className={styles.proposalSection}>
                            <div className={styles.sectionTitle}>{t("Proposal")} {index + 1}</div>
                            <RevisionDetail revision={revision} fieldDefinition={contractTypeFieldDefinition} showDecimals={isDecimalAllowed}/>
                        </div>
                    )
                })}
            </div>
            {
                fileForPreview && isPreviewOpen &&
                <FilePreview
                    fileBlob={fileForPreview}
                    filename={docName}
                    mediatype={mediaType}
                    onClose={(e) => {setIsPreviewOpen(false); setFileForPreview(null); e.stopPropagation()}}
                />
            }
            { contractType && <ContractRevisionDialog
                isOpen={showRevisions}
                contractType={contractType}
                revisions={revisions}
                currency={contractFormData?.currency}
                fields={contractFields || []}
                showDecimals={isDecimalAllowed}
                fieldDefinition={props.contractTypeDefinition}
                toggleModal={() => setShowRivisions(false)}
            /> }
        </div>
    </>)
}