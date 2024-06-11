import React from 'react'
import './email-templateV2.css'
import { UpdateSupplierCompanyDetailsFormReadOnlyProps } from './updateSupplierCompanyDetails-form-readonly.component'
import { convertAddressToString, findLargelogo } from './util'

export function UpdateSupplierCompanyDetailsFormEmailTemplate (props: UpdateSupplierCompanyDetailsFormReadOnlyProps) { 

    return (
        <div className="emailForm">
            <h1 className="formTitle">Update supplier company details</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <table className={'formSection mrgB16'}>
                                <tbody>
                                    {props.formData?.currentLogo && props.formData?.currentLogo?.metadata && props.formData?.currentLogo?.metadata?.length > 0 && <tr>
                                        <td className="formQuestion">Logo</td>
                                    </tr>}
                                    {props.formData?.currentLogo && props.formData?.currentLogo?.metadata && props.formData?.currentLogo?.metadata?.length > 0 && <tr>
                                        <td className="formAnswer pdB12">
                                            <img src={findLargelogo(props.formData.currentLogo.metadata)} alt="" height="64px" />
                                        </td>
                                    </tr>}

                                    <tr>
                                        <td className="formQuestion">Company Name</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.commonName || '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Website</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.website || '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Email</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.email || '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Phone number</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.phone || '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Address</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.address ? convertAddressToString(props.formData?.address) : '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Parent company</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.parentCompany?.supplierName || '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Description</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.description || '-'}</td>
                                    </tr>

                                    <tr>
                                        <td className="formQuestion">Nature of business</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer pdB12">{props.formData?.industryCode?.name || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ) 
}