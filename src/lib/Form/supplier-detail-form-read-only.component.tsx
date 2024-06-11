import React from 'react'
import { SupplierDetailReadonlyProps } from './types'

import './oro-form-read-only.css'
import { AlertOctagon, CheckCircle, Copy, Download, Globe, Mail, Phone, Power, User } from 'react-feather'
import { OroButton } from '../controls'
import { OROFileIcon } from '../RequestIcon'
import { convertAddressToString, getLocalDateString, getSupplierActivationStatus, getSupplierLogoUrl } from './util'
import { ActivationStatus } from '../Types'
import { checkURLContainsProtcol } from '../util'
import { AddressValue, mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';


export function SupplierDetailFormReadOnlyComponent (props: SupplierDetailReadonlyProps) {
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
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERFORM])
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
                          supplier.address && AddressValue({value:supplier.address}) &&
                          <div className="supplierInfoAddress">
                            <span>{AddressValue({value:supplier.address})}</span>
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
                        {mapCustomFieldValue({value:supplier.phoneNumber, fieldName: 'phoneNumber', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                      </div>}
                      {supplier.email && <div className="supplierInfoDetailsContactItem">
                        <Mail size={14} color={'#575F70'} />
                        {mapCustomFieldValue({value:supplier.email, fieldName: 'email', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                      </div>}
                      {supplier.duns && <div className="supplierInfoDetailsContactItem">
                      {mapCustomFieldValue({value:supplier.duns, fieldName: 'duns', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                      </div>}
                    </div>
                  </div>
                  {
                    supplier.selectedVendorRecord && supplier.selectedVendorRecord.additionalCompanyEntities.length > 0 &&
                    <div className="supplierInfoSectionSubsidiaries">
                      <div className="supplierInfoSectionSubsidiariesText">{t('--relatedCompanies--')} <span>{t('--subsidiaries--',{count:supplier.selectedVendorRecord.additionalCompanyEntities.length})} </span></div>
                      <OroButton type={'default'} label={t('--seeDetails--')} />
                    </div>
                  }
                  <div className="supplierInfoSectionLegalDocs">
                    <div className={(!supplier.nda && !supplier.msa) ? "supplierInfoSectionTitle" : "supplierInfoSectionTitle marginBottom12"}>{t('--legalDocs--')}
                      {(!supplier.nda && !supplier.msa) && <span className="formFieldsNP">{t('--notProvided--')}</span>}
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
                            {supplier.nda.expiration ? t('--expiresOn--',{date:getLocalDateString(supplier.nda.expiration)}) : ''}
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
                    <div className={(!supplier.contact) ? "supplierInfoSectionTitle" : "supplierInfoSectionTitle marginBottom12"}>{t('--contacts--')}
                      {(!supplier.contact) && <span className="formFieldsNP">{t('--notProvided--')}</span>}
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
                        <div>{t('--supplierStatus--')} <span className="active">{t('--active--')}</span></div>
                      </div>
                      <div className="supplierStatusSectionId">
                        {t('--vendorId--')} <span title={supplier.selectedVendorRecord?.vendorId}>{supplier.selectedVendorRecord?.vendorId || t('--notAvailable--')}</span>
                      </div>
                      <div className="supplierStatusSectionDesc">
                        {t('--purchasingAndPaymentTransaction--')}
                      </div>
                    </div>
                  }
                  {getSupplierActivationStatus(supplier.vendorId || '', props.processVariables) === ActivationStatus.duplicate &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <Copy size={20} color={'#f3b72c'} />
                        <div>{t('--supplierStatus--')} <span className="new">{t('--duplicateRecords--')}</span></div>
                      </div>
                      <div className="supplierStatusSectionDesc">
                        {t('--supplierRecords--')}
                      </div>
                    </div>
                  }
                  {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.newSupplier &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <AlertOctagon size={20} color={'#F3B72C'} />
                        <div>{t('--supplierStatus--')} <span className="new">{t('--newSupplier--')}</span></div>
                      </div>
                      <div className="supplierStatusSectionDesc">
                        {t('--supplierNotYetRegistered--')}
                      </div>
                    </div>
                  }
                  {getSupplierActivationStatus(supplier.vendorId || '', props?.processVariables) === ActivationStatus.requiresActivation &&
                    <div className="supplierStatusSectionItems">
                      <div className="supplierStatusSectionStatus">
                        <Power size={20} color={'#6782a0'} />
                        <div>{t('--supplierStatus--')} <span className="require">{t('--requiresActivation--')}</span></div>
                      </div>
                      {supplier?.selectedVendorRecord && <div className="supplierStatusSectionId">
                        {t('--vendorId--')} <span title={supplier.selectedVendorRecord?.vendorId}>{supplier.selectedVendorRecord?.vendorId ||  t('--notAvailable--')}</span>
                      </div>}
                      {supplier?.selectedVendorRecord && <div className="supplierStatusSectionDesc">
                        {t('--goThroughActivationProcess--')}
                      </div>}
                      {!supplier?.selectedVendorRecord && <div className="supplierStatusSectionDesc">
                       {t('--financeTeamNeedToActivateVendor--')}
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
export function SupplierDetailFormReadOnly (props: SupplierDetailReadonlyProps) {
  return <I18Suspense><SupplierDetailFormReadOnlyComponent {...props} /></I18Suspense>
}