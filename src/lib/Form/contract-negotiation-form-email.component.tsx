import React, { useEffect, useState } from 'react'
import { IDRef } from './../Types'
import { ContractFormData, ContractFormProps, ANNUAL_CONTRACT, MONTHLY_CONTRACT, ContractTypeDefinitionField, ContractTypeDefinition, ContractFields, ContractFieldSection } from './types'
import './email-templateV2.css'
import { annualRecurringIDRef } from './contract-negotiation-form-read-only.component'
import { canShowTenantCurrency, getDateRangeDisplayString, getFieldDisplayName, getFormattedAmountValue, getSectionDisplayName, isFieldExists, isSectionExists } from './util'
import { getContractFieldsBasedOnType } from './contract-finalisation-form-email.component'

export function ContractNegotiationFormEmail (props: ContractFormProps) {
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
            <td className='formTitle'>Contract negotiation</td>
        </tr>
        {contractFormData && <tr className="contractNegotiationEmail">
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
                            <td className="formQuestion">Company entity</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.companyEntity?.displayName || '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Contract type</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.contractType?.name || '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="lastContractSection">
                    {(isSectionExists(contractTypeFieldDefinition, contractFormData?.contractType?.id, ContractFieldSection.contractValues) || isSectionExists(contractTypeFieldDefinition, contractFormData?.contractType?.id, ContractFieldSection.terms))&& <tbody>
                        <tr>
                            <td className="sectionTitle">{getSectionDisplayName(contractTypeFieldDefinition, contractFormData?.contractType?.id, ContractFieldSection.contractValues)}</td>
                        </tr>
                        {contractFormData?.revisions && contractFormData?.revisions?.length > 0 && contractFormData?.revisions?.map((revision, index) =>
                            <table key={index}>
                                <tbody>
                                {<>
                                    <tr>
                                        <td className="formQuestion">Proposal {index+1}</td>
                                    </tr>
                                    {isFieldExists(ContractFields.proposalDescription, contractFields, ContractFieldSection.contractValues) && isFieldExists(ContractFields.totalValue, contractFields, ContractFieldSection.contractValues) && <tr>
                                        <td className="formAnswer">
                                            {revision?.proposalDescription || '-'} : {getFormattedAmountValue(revision?.totalValue)}
                                        </td>
                                    </tr>}
                                    {isFieldExists(ContractFields.contractPeriod, contractFields, ContractFieldSection.terms) && <tr>
                                        <td className="formAnswer pdB12">
                                        {getFieldDisplayName(ContractFields.contractPeriod, contractFields, ContractFieldSection.terms)} : {getDateRangeDisplayString(revision?.startDate, revision?.endDate)}
                                        </td>
                                    </tr>}
                                </>}
                                </tbody>
                            </table>
                        )}
                    </tbody>}
                </table>
                {/* <table className="lastContractSection">
                    <tbody>
                        <tr>
                            <td className="sectionTitle">Terms</td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Contract period</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {getDateRangeDisplayString(contractFormData?.startDate, contractFormData?.endDate)}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Auto renewal</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.autoRenew ? 'Yes' : 'No'}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Please provide the notice period (in days) to stop Auto renewal</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.autoRenewNoticePeriod}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Includes cancellation policy</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.includesCancellation ? 'Yes' : 'No'}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Billing cycle</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.billingCycle || '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="formQuestion">Payment terms</td>
                        </tr>
                        <tr>
                            <td className="formAnswer pdB12">
                                {contractFormData?.paymentTerms?.displayName || '-'}
                            </td>
                        </tr>
                    </tbody>
                </table> */}
            </td>
        </tr>}
    </tbody>
 </table>)
}