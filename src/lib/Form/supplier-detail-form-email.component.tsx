import React from 'react'
import { ActivationStatus, ProcessVariables, Supplier } from '../Types'
import './email-templateV2.css'
import { convertAddressToString, getSupplierActivationStatus, OROFORMIDS } from './util'

export function SupplierDetailFormEmailTemplate (props: {formId: string, crmId?: string, selectedSuppliers?: Array<Supplier>, processVariables?: ProcessVariables | null}) { 
    function getDisplayNameOfActivationStatus (status: ActivationStatus): string {
        switch (status) {
            case ActivationStatus.active:
                if (props.formId === OROFORMIDS.OroContractorDetailForm || props.formId === OROFORMIDS.OroContractorFinalizationForm) {
                    return 'Active'
                }
                return 'Active ' + getLabel().toLowerCase()

            case ActivationStatus.duplicate:
                if (props.formId === OROFORMIDS.OroContractorDetailForm || props.formId === OROFORMIDS.OroContractorFinalizationForm) {
                    return 'Existing'
                }
                return 'Existing ' + getLabel().toLowerCase()

            case ActivationStatus.requiresActivation:
                if (props.formId === OROFORMIDS.OroContractorDetailForm || props.formId === OROFORMIDS.OroContractorFinalizationForm) {
                    return 'Existing (Requires activation)'
                }
                return 'Existing ' + getLabel().toLowerCase() + '(Requires activation)'

            case ActivationStatus.newSupplier:
                if (props.formId === OROFORMIDS.OroContractorDetailForm || props.formId === OROFORMIDS.OroContractorFinalizationForm) {
                    return 'New'
                }
                return 'New ' + getLabel().toLowerCase()
        }
    }
    function getTitle (): string {
        if (props.formId === OROFORMIDS.OroPartnerDetailForm) {
            return props.selectedSuppliers.length === 1 ? 'Partner' : 'Partners'
        }
        if (props.formId === OROFORMIDS.OroContractorDetailForm || props.formId === OROFORMIDS.OroContractorFinalizationForm) {
            return props.selectedSuppliers.length === 1 ? 'Person' : 'Persons'
        }
        return props.selectedSuppliers.length === 1 ? 'Supplier' : 'Suppliers'
    }
    function getLabel (): string {
        if (props.formId === OROFORMIDS.OroPartnerDetailForm) {
            return 'Partner'
        }
        if (props.formId === OROFORMIDS.OroContractorDetailForm || props.formId === OROFORMIDS.OroContractorFinalizationForm) {
            return 'Person'
        }
        return 'Supplier'
    }
    return (
        <div className="emailForm">
            <h1 className="formTitle">{getTitle()}</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                        {
                            props.selectedSuppliers.map((supplier, index) => {
                                return (
                                    <table key={index} className={index < props.selectedSuppliers?.length - 1 ? 'formSection mrgB16' : ''}>
                                        <tbody>
                                        <tr>
                                            <td className="formQuestion">{getLabel()} name</td>
                                        </tr>
                                        <tr>
                                            <td className="formAnswer pdB12">{supplier.supplierName || '-'}</td>
                                        </tr>

                                        {supplier?.address && <tr>
                                            <td className="formQuestion">Address</td>
                                        </tr>}
                                        {supplier?.address && <tr>
                                            <td className="formAnswer pdB12">{supplier.address ? convertAddressToString(supplier.address) : '-'}</td>
                                        </tr>}

                                        <tr>
                                            <td className="formQuestion">Supplier status</td>
                                        </tr>
                                        <tr>
                                            <td className="formAnswer pdB12">{getDisplayNameOfActivationStatus(getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables))}</td>
                                        </tr>

                                        {supplier?.selectedVendorRecord?.vendorId && <tr>
                                            <td className="formQuestion">Vendor ID</td>
                                        </tr>}
                                        {supplier?.selectedVendorRecord?.vendorId && <tr>
                                            <td className="formAnswer pdB12">{supplier.selectedVendorRecord?.vendorId || '-'}</td>
                                        </tr>}
                                        {supplier?.duns && <tr>
                                            <td className="formQuestion">DUNS Number</td>
                                        </tr>}
                                        {supplier?.duns && <tr>
                                            <td className="formAnswer pdB12">{supplier.duns || '-'}</td>
                                        </tr>}
                                        {props.formId === OROFORMIDS.OroPartnerDetailForm && <tr>
                                            <td className="formQuestion">Saleforce ID</td>
                                        </tr>}
                                        {props.formId === OROFORMIDS.OroPartnerDetailForm && <tr>
                                            <td className="formAnswer pdB12">{props.crmId || '-'}</td>
                                        </tr>}
                                        </tbody>
                                    </table>
                                )
                            })
                        }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ) 
}