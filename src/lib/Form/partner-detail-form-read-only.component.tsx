import React from 'react'
import { SupplierDetailReadonlyProps } from './types'

import './oro-form-read-only.css'
import { AlertOctagon, CheckCircle, Copy, Download, Globe, Mail, Phone, Power, User } from 'react-feather'
import { OroButton } from '../controls'
import { OROFileIcon } from '../RequestIcon'
import { convertAddressToString, getLocalDateString, getSupplierActivationStatus, getSupplierLogoUrl } from './util'
import { ActivationStatus } from '../Types'
import { checkURLContainsProtcol } from '../util'


export function PartnerDetailFormReadOnly (props: SupplierDetailReadonlyProps) {
  function downloadUploadedFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'Document') {
    if (props.onDownloadAttachment) {
      props.onDownloadAttachment(fieldName, type, fileName)
    }
  }
  function downloadVendorAttachment (vendorId: string | null | undefined, fileType: string, fileName: string | undefined = 'Document') {
    if (props.onDownloadInFileAttachment) {
      props.onDownloadInFileAttachment(vendorId, fileType, fileName)
    }
  }
  return (
    <div className="oroFormReadOnly">

      <div className="formFields">
        {
          props.selectedSuppliers.map((supplier, index) => {
            return (
              <div className="keyValuePair supplier" key={index}>
                <div className="supplierInfoSection">
                  <div className="supplierInfoDetails">
                    <div className="supplierInfoDetailsAll">
                      <div className="supplierInfoDetailsNameAddress">
                        <h3 className="supplierInfoName">{supplier.supplierName}</h3>
                        {
                          supplier.address && convertAddressToString(supplier.address) &&
                          <div className="supplierInfoAddress">
                            <span>{convertAddressToString(supplier.address)}</span>
                          </div>
                        }
                      </div>
                      {supplier.legalEntity && supplier.legalEntity?.logo?.metadata.length > 0 && <div className="supplierInfoLogo">
                        <img src={getSupplierLogoUrl(supplier.legalEntity)} alt="" />
                      </div>}
                    </div>
                    <div className="supplierInfoDetailsContact">
                      {supplier.website && <div className="supplierInfoDetailsContactItem">
                        <Globe size={14} color={'#575F70'} />
                        <a href={checkURLContainsProtcol(supplier.website)} target="_blank" rel="noreferrer">{supplier.website}</a>
                      </div>}
                      {supplier.phoneNumber && <div className="supplierInfoDetailsContactItem">
                        <Phone size={14} color={'#575F70'} />
                        {supplier.phoneNumber}
                      </div>}
                      {supplier.email && <div className="supplierInfoDetailsContactItem">
                        <Mail size={14} color={'#575F70'} />
                        {supplier.email}
                      </div>}
                    </div>
                  </div>
                  {
                    supplier.selectedVendorRecord && supplier.selectedVendorRecord.additionalCompanyEntities.length > 0 &&
                    <div className="supplierInfoSectionSubsidiaries">
                      <div className="supplierInfoSectionSubsidiariesText">Related companies - <span>{supplier.selectedVendorRecord.additionalCompanyEntities.length} subsidiaries </span></div>
                      <OroButton type={'default'} label={'See Details'} />
                    </div>
                  }
                  <div className="supplierInfoSectionLegalDocs">
                    <div className={(!supplier.nda && !supplier.msa) ? "supplierInfoSectionTitle" : "supplierInfoSectionTitle marginBottom12"}>Legal docs 
                      {(!supplier.nda && !supplier.msa) && <span className="formFieldsNP">Not provided</span>}
                    </div>
                    {supplier.nda && <div className="attachmentSection">
                      <div className="fileIcon">
                          <OROFileIcon fileType={supplier.nda.mediatype}></OROFileIcon>
                      </div>
                      <div className="attachmentSectionInfo">
                          <div className="attachmentSectionInfoName">
                              <h3>NDA</h3>
                          </div>
                          <div className="supplierInfoSectionLegalDocsExpiration">
                            {supplier.nda.expiration ? `Expires on ${getLocalDateString(supplier.nda.expiration)}` : ''}
                            {!supplier.ndaInFile && <Download size={16} color="#ababab" onClick={() => downloadUploadedFile(`selectedSuppliers[${index}].nda`, supplier.nda?.mediatype, supplier.nda?.filename)}></Download>}
                            {supplier.ndaInFile && <Download size={16} color="#ababab" onClick={() => downloadVendorAttachment(supplier.vendorId, 'nda', supplier.nda?.filename)}></Download>}
                          </div>
                      </div>
                    </div>}
                    {supplier.msa && <div className="attachmentSection">
                      <div className="fileIcon">
                          <OROFileIcon fileType={supplier.msa.mediatype}></OROFileIcon>
                      </div>
                      <div className="attachmentSectionInfo">
                          <div className="attachmentSectionInfoName">
                              <h3>MSA</h3>
                          </div>
                          <div className="supplierInfoSectionLegalDocsExpiration">
                              {supplier.msa.expiration ? `Expires on ${getLocalDateString(supplier.msa.expiration)}` : ''}
                              {!supplier.msaInFile && <Download size={16} color="#ababab" onClick={() => downloadUploadedFile(`selectedSuppliers[${index}].msa`, supplier.msa?.mediatype, supplier.msa?.filename)}></Download>}
                              {supplier.msaInFile && <Download size={16} color="#ababab" onClick={() => downloadVendorAttachment(supplier.vendorId, 'msa', supplier.msa?.filename)}></Download>}
                          </div>
                      </div>
                    </div>}
                  </div>
                  <div className="supplierInfoSection">
                    <div className={(!supplier.contact) ? "supplierInfoSectionTitle" : "supplierInfoSectionTitle marginBottom12"}>Contacts
                      {(!supplier.contact) && <span className="formFieldsNP">Not provided</span>}
                    </div>
                    {
                      supplier.contact && 
                      <div className="supplierInfoSectionContacts">
                        <div className="supplierInfoSectionContactsPic"><User color="#ffffff" size={32} /></div>
                        <div className="supplierInfoSectionContactsDetail">
                          <h3>{supplier.contact.fullName ? supplier.contact.fullName : `${supplier.contact.firstName} ${supplier.contact.lastName}`}</h3>
                          <div className="supplierInfoSectionContactsDetailRole">{supplier.contact.role}</div>
                          <div className="supplierInfoSectionContactsDetailPhone">
                            {supplier.contact.email && <span><Mail size={13} color={'#575F70'} />{supplier.contact.email}</span>}
                            {supplier.contact.phone && <span><Phone size={13} color={'#575F70'} />{supplier.contact.phone}</span>}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className="supplierStatusSection">
                  {getSupplierActivationStatus(supplier.vendorId || '', props.processVariables) === ActivationStatus.active &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <CheckCircle size={20} color={'#82C146'} />
                        <div>Partner status: <span className="active">Active</span></div>
                      </div>
                      <div className="supplierStatusSectionId">
                        Vendor ID: <span title={supplier.selectedVendorRecord?.vendorId}>{supplier.selectedVendorRecord?.vendorId || 'Not available'}</span>
                      </div>
                      <div className="supplierStatusSectionDesc">
                        This partner is active for purchasing &amp; payment transactions
                      </div>
                    </div>
                  }
                  {getSupplierActivationStatus(supplier.vendorId || '', props.processVariables) === ActivationStatus.duplicate &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <Copy size={20} color={'#f3b72c'} />
                        <div>Partner status: <span className="new">Duplicate records</span></div>
                      </div>
                      <div className="supplierStatusSectionDesc">
                        There are 2 Partner records, by the time the request is fully approved, 1 record needs to be selected.
                      </div>
                    </div>
                  }
                  {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.newSupplier &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <AlertOctagon size={20} color={'#F3B72C'} />
                        <div>Partner status: <span className="new">New partner</span></div>
                      </div>
                      <div className="supplierStatusSectionDesc">
                        This partner is not yet registered and activated in company system, follow the steps to onboard the supplier.
                      </div>
                    </div>
                  }
                  {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.requiresActivation &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <Power size={20} color={'#6782a0'} />
                        <div>Partner status: <span className="require">Requires activation</span></div>
                      </div>
                      {supplier?.selectedVendorRecord && <div className="supplierStatusSectionId">
                        Vendor ID: <span title={supplier.selectedVendorRecord?.vendorId}>{supplier.selectedVendorRecord?.vendorId || 'Not available'}</span>
                      </div>}
                      {supplier?.selectedVendorRecord && <div className="supplierStatusSectionDesc">
                        This will go through activation process
                      </div>}
                      {!supplier?.selectedVendorRecord && <div className="supplierStatusSectionDesc">
                        Finance team will need to activate the vendor
                      </div>}
                    </div>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
