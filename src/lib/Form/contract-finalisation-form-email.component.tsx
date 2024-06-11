import React, { useEffect, useState } from 'react'
import { IDRef } from './../Types'
import { ContractFields, ContractFieldSection, ContractFormData, ContractFormProps, ContractTypeDefinition, ContractTypeDefinitionField } from './types'
import './email-templateV2.css'
import { annualRecurringIDRef } from './contract-negotiation-form-read-only.component'
import { canShowTenantCurrency, getDateRangeDisplayString, getFieldDisplayName, getFormattedAmountValue, getSectionDisplayName, getUserDisplayName, isFieldExists, isSectionExists } from './util'

export function getContractFieldsBasedOnType (contractType: IDRef, typeDefinition: ContractTypeDefinition[]) {
    if (contractType && contractType?.id) {
      const fields = typeDefinition.find(fieldType => fieldType.type === contractType.id)?.fields
      return fields && fields.length > 0 ? fields : []
    }
    return typeDefinition[0]?.fields
}

export function ContractFinalisationFormEmail (props: ContractFormProps) {
    const [contractFormData, setContractFormData] = useState<ContractFormData>()
    const [contractType, setContractType] = useState<IDRef>(annualRecurringIDRef)
    const [contractFields, setContractFields] = useState<Array<ContractTypeDefinitionField>>([])
    const [contractTypeFieldDefinition, setContractTypeFieldDefinition] = useState<Array<ContractTypeDefinition>>([])

    useEffect(() => {
        if (props.formData) {
          setContractFormData(props.formData)
        }
        if (props.formData?.contractType?.id) {
          setContractType(props.formData?.contractType)
        }
    }, [props.formData])

    useEffect(() => {
        if (props.contractTypeDefinition) {
          setContractTypeFieldDefinition(props.contractTypeDefinition || [])
          setContractFields(getContractFieldsBasedOnType(props.formData?.contractType, props.contractTypeDefinition))
        }
      }, [props.contractTypeDefinition])

    return (<table className="emailForm">
    <tbody>
        <tr>
            <td className='formTitle'>Contract finalisation</td>
        </tr>
        {contractFormData && <tr className="contractFinalisationEmail">
            <td>
                <table className="formSection contractTable">
                    <tbody>
                        <tr>
                            <td className="formQuestion">Supplier</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.supplierName || '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Company Entity</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.companyEntity?.displayName || '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="formSection contractTable">
                    <tbody>
                        <tr>
                            <td className="sectionTitle">Final contract details</td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Contract type</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.contractType?.name || '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Product / Service description</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.contractDescription || '-'}
                            </td>
                        </tr>
                        {isFieldExists(ContractFields.recurringSpend, contractFields, ContractFieldSection.contractValues) && <>
                            <tr>
                                <td className="formQuestion">{getFieldDisplayName(ContractFields.recurringSpend, contractFields, ContractFieldSection.contractValues)}</td>
                            </tr>
                            <tr>
                                <td className="formAnswer pdB12">{getFormattedAmountValue(contractFormData?.recurringSpend)}</td>
                            </tr>
                        </>}
                        {isFieldExists(ContractFields.totalValue, contractFields, ContractFieldSection.contractValues) && <>
                            <tr>
                                <td className="formQuestion">{getFieldDisplayName(ContractFields.totalValue, contractFields, ContractFieldSection.contractValues)}</td>
                            </tr>
                            <tr>
                                <td className="formAnswer pdB12">{getFormattedAmountValue(contractFormData?.totalValue)}</td>
                            </tr>
                        </>}
                    </tbody>
                </table>
                <table className="lastContractSection">
                    <tbody>
                        <tr>
                            <td className="sectionTitle">{getSectionDisplayName(contractTypeFieldDefinition, contractFormData?.contractType?.id, ContractFieldSection.terms)}</td>
                        </tr>
                        {isFieldExists(ContractFields.contractPeriod, contractFields, ContractFieldSection.terms) && <><tr>
                            <td className="formQuestion">Contract period</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {getDateRangeDisplayString(contractFormData?.startDate, contractFormData?.endDate)}
                            </td>
                        </tr>
                        </>}
                        {isFieldExists(ContractFields.paymentTerms, contractFields, ContractFieldSection.terms) && <><tr>
                            <td className="formQuestion">Payment terms</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.paymentTerms?.displayName || '-'}
                            </td>
                        </tr>
                        </>}
                        {isFieldExists(ContractFields.billingCycle, contractFields, ContractFieldSection.terms) && <><tr>
                            <td className="formQuestion">Billing cycle</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.billingCycle || '-'}
                            </td>
                        </tr>
                        </>}
                    </tbody>
                </table>
            </td>
        </tr>}
    </tbody>
 </table>)
}