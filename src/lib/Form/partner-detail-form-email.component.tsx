import React from 'react'
import { ActivationStatus, ProcessVariables, Supplier } from '../Types'
import './email-template.css'
import { convertAddressToString, EMAIL_ICON_RESOURCES_URL, getSupplierActivationStatus, getSupplierLogoUrl } from './util'

export function PrtnerDetailFormEmailTemplate (props: {selectedSuppliers?: Array<Supplier>, processVariables?: ProcessVariables | null}) { 
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
                                            <h1 className="emailHeading">Partner</h1>
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
                                                                        <div className="emailContentSolidBorder">
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
                                                                                                                {
                                                                                                                    supplier.address && convertAddressToString(supplier.address) &&
                                                                                                                    <div className="emailSupplierAddress">
                                                                                                                        <span>{convertAddressToString(supplier.address)}</span>
                                                                                                                    </div>
                                                                                                                }
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
                                                                                            <div className="emailSupplierContact">
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
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td colSpan={2}>
                                                                                            <div className="emailSupplierContent">
                                                                                                <table>
                                                                                                    <tbody>
                                                                                                        <tr>
                                                                                                            <td>
                                                                                                                <div className="emailSupplierContentLabel" style={{ marginBottom: supplier.contact ? '12px' : ''}}>
                                                                                                                    Contacts
                                                                                                                </div>
                                                                                                            </td>
                                                                                                            <td align="right">
                                                                                                                {!supplier.contact && <div className="emailSupplierNPText"  style={{ marginBottom: supplier.contact ? '12px' : ''}}>
                                                                                                                    Not provided
                                                                                                                </div>}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        {supplier.contact && <tr>
                                                                                                            <td colSpan={2}>
                                                                                                                <table>
                                                                                                                    <tbody>
                                                                                                                        <tr>
                                                                                                                            <td width="70px">
                                                                                                                                <div className="emailSupplierContentUserPic">
                                                                                                                                    <img src={`${EMAIL_ICON_RESOURCES_URL}/UserPic.png`} width="64px" height="64px" alt=""/>
                                                                                                                                </div>
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <div className="emailSupplierContentUserName">{supplier.contact.fullName ? supplier.contact.fullName : (supplier.contact.firstName || supplier.contact.lastName) ? `${supplier.contact.firstName} ${supplier.contact.lastName}` : ''}</div>
                                                                                                                                <div className="emailSupplierContentLabel">{supplier.contact.role}</div>
                                                                                                                                <div className="emailSupplierContentUserContact">
                                                                                                                                    {supplier.contact.phone && <div><img src={`${EMAIL_ICON_RESOURCES_URL}/Phone.png`} width="14px" height="14px" alt=""/>{supplier.contact.phone}</div>}
                                                                                                                                    {supplier.contact.email && <div><img src={`${EMAIL_ICON_RESOURCES_URL}/Mail.png`} width="14px" height="14px" alt=""/>{supplier.contact.email}</div>}
                                                                                                                                </div>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>}
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div className="emailSupplierStatus">
                                                                            {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.active &&
                                                                                <div className="emailSupplierStatusItems">
                                                                                    <div className="emailSupplierStatusItemsTable">
                                                                                        <table>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td width="36px">
                                                                                                        <img src={`${EMAIL_ICON_RESOURCES_URL}/CheckCircle.png`} width="22px" height="22px" alt=""/>
                                                                                                    </td>
                                                                                                    <td style={{ verticalAlign: 'baseline' }}>
                                                                                                        <span className="emailSupplierContentLabel">Partner status:</span><span className="active">Active</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div className="emailSupplierStatusItemsId">
                                                                                        Vendor ID: <span>{supplier.selectedVendorRecord?.vendorId || 'Not available'}</span>
                                                                                    </div>
                                                                                    <div className="emailSupplierStatusItemsId">
                                                                                        This partner is active for purchasing &amp; payment transactions
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.requiresActivation &&
                                                                                <div className="emailSupplierStatusItems">
                                                                                    <div className="emailSupplierStatusItemsTable">
                                                                                        <table>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td width="36px">
                                                                                                        <img src={`${EMAIL_ICON_RESOURCES_URL}/Power.png`} width="22px" height="22px" alt=""/>
                                                                                                    </td>
                                                                                                    <td style={{ verticalAlign: 'baseline' }}>
                                                                                                        <span className="emailSupplierContentLabel">Partner status:</span><span className="require">Requires activation</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    {supplier?.selectedVendorRecord && <div className="emailSupplierStatusItemsId">
                                                                                        Vendor ID: <span>{supplier.selectedVendorRecord?.vendorId || 'Not available'}</span>
                                                                                    </div>}
                                                                                    {supplier?.selectedVendorRecord && <div className="emailSupplierStatusItemsId">
                                                                                        This will go through activation process
                                                                                    </div>}
                                                                                    {!supplier?.selectedVendorRecord && <div className="emailSupplierStatusItemsId">
                                                                                        Finance team will need to activate the vendor
                                                                                    </div>}
                                                                                </div>
                                                                            }
                                                                            {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.duplicate &&
                                                                                <div className="emailSupplierStatusItems">
                                                                                    <div className="emailSupplierStatusItemsTable">
                                                                                        <table>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td width="36px">
                                                                                                        <img src={`${EMAIL_ICON_RESOURCES_URL}/Copy.png`} width="22px" height="22px" alt=""/>
                                                                                                    </td>
                                                                                                    <td style={{ verticalAlign: 'baseline' }}>
                                                                                                        <span className="emailSupplierContentLabel">Partner status:</span><span className="new">Duplicate records</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div className="emailSupplierStatusItemsId">
                                                                                        There are 2 partner records, by the time the request is fully approved, 1 record needs to be selected.
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.newSupplier &&
                                                                                <div className="emailSupplierStatusItems">
                                                                                    <div className="emailSupplierStatusItemsTable">
                                                                                        <table>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td width="36px">
                                                                                                        <img src={`${EMAIL_ICON_RESOURCES_URL}/AlertOctagon.png`} width="22px" height="22px" alt=""/>
                                                                                                    </td>
                                                                                                    <td style={{ verticalAlign: 'baseline' }}>
                                                                                                        <span className="emailSupplierContentLabel">Partner status:</span><span className="new">New supplier</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div className="emailSupplierStatusItemsId">
                                                                                        This partner is not yet registered and activated in company system, follow the steps to onboard the supplier.
                                                                                    </div>
                                                                                </div>
                                                                            }
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