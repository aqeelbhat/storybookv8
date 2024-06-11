import React from 'react'
import { Supplier } from '../Types'
import './email-template.css'
import { convertAddressToString, EMAIL_ICON_RESOURCES_URL, getSupplierLogoUrl } from './util'

export function SupplierDetailFormDevelopmentEmailTemplate (props: {selectedSuppliers?: Array<Supplier>}) { 
    return (
        <div className="emailTemplate">
            <table cellPadding={0} cellSpacing={0}>
                <tbody>
                    <tr>
                        <td>
                            <table cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td align="left" colSpan={2}>
                                            <h1 className="emailHeading">Supplier</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            {
                                                props.selectedSuppliers.map((supplier, index) => {
                                                    return (
                                                        <table key={index}>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <div className="emailContentSolidBorderDevelopment">
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td valign="top">
                                                                                            <table>
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td valign="top">
                                                                                                            <div className="emailSupplier">
                                                                                                                <h2 className="emailSupplierName">{supplier.supplierName}</h2>
                                                                                                                {supplier.selectedVendorRecord && <div className="emailSupplierContactDevelopment">
                                                                                                                    <span className="emailSupplierContactItem">Vendor name: {supplier.selectedVendorRecord?.name}</span>
                                                                                                                    <span className="emailSupplierContactItem">Vendor ID: {supplier.selectedVendorRecord?.vendorId}</span>
                                                                                                                </div>}
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="right" valign="top">
                                                                                            {getSupplierLogoUrl(supplier.legalEntity) && <div className="emailSupplierLogo">
                                                                                                <img src={getSupplierLogoUrl(supplier.legalEntity)} alt="" height="64px" />
                                                                                            </div>}
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td colSpan={2}>
                                                                                            <div className="emailSupplierContactDevelopment">
                                                                                                {supplier.address && convertAddressToString(supplier.address) && <span className="emailSupplierContactItem">
                                                                                                    <img src={`${EMAIL_ICON_RESOURCES_URL}/Map.png`} width="14px" height="14px" alt=""/>
                                                                                                    {convertAddressToString(supplier.address)}
                                                                                                </span>}
                                                                                                {supplier.website && <span className="emailSupplierContactItem">
                                                                                                    <img src={`${EMAIL_ICON_RESOURCES_URL}/Globe.png`} width="14px" height="14px" alt=""/>
                                                                                                    {supplier.website}
                                                                                                </span>}
                                                                                                {supplier.phoneNumber && <span className="emailSupplierContactItem">
                                                                                                    <img src={`${EMAIL_ICON_RESOURCES_URL}/Phone.png`} width="14px" height="14px" alt=""/>
                                                                                                    {supplier.phoneNumber}
                                                                                                </span>}
                                                                                                {supplier.email && <span className="emailSupplierContactItem">
                                                                                                    <img src={`${EMAIL_ICON_RESOURCES_URL}/Mail.png`} width="14px" height="14px" alt=""/>
                                                                                                    {supplier.email}
                                                                                                </span>}
                                                                                                {supplier.duns && <span className="emailSupplierContactItem">
                                                                                                    {supplier.duns}
                                                                                                </span>}
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    )
                                                })
                                            }
                                        </td>
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