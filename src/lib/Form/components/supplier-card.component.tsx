import React, { useEffect, useState } from "react"
import Modal from '@mui/material/Modal'
import { AlertCircle, Edit, Globe, UserPlus, UserX, X } from "react-feather"
import { convertAddressToString, MasterDataRoleObject } from ".."
import { Contact as ContactType, Supplier, SupplierUser } from "../../Types"
import { checkURLContainsProtcol, createImageFromInitials, mapAlpha2codeToDisplayName } from "../../util"
import { getSupplierLogoUrl } from "../util"

import styles from './supplier-card.module.scss'
import { Contact } from '../../controls'
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n"

interface SupplierCardProps {
   selectedSuppliers: Array<Supplier>
   supplierRoles?: Array<MasterDataRoleObject>
   isReadonly?: boolean
   isInPortal?: boolean
   showNoContactSelectedErrorMessage?: boolean
   removeSelectedSupplier?: (index: number) => void
   getVendorUsers?: (id: string) => Promise<SupplierUser[]>
   updateSupplier?: (updatedSupplier: Supplier) => void
}
  
  export function SupplierCard (props: SupplierCardProps) {

    const [selectedSuppliers, setSelectedSuppliers] = useState<Array<Supplier>>([])
    const [supplierNameForContact, setSupplierNameForContact] = useState('')
    const [selectedSupplierContact, setSelectedSupplierContact] = useState<ContactType | null>()
    const [showContactPopup, setShowContactPopup] = useState<boolean>(false)
    const [existingUserList, setExistingUserList] = useState<Array<SupplierUser>>([])
    const [supplierRoles, setSupplierRoles] = useState<Array<MasterDataRoleObject>>([])

    const { t } = useTranslationHook([NAMESPACES_ENUM.UPDATESUPPLIERCOMPANY])

    useEffect(() => {
        setSelectedSuppliers(props.selectedSuppliers || [])
    }, [props.selectedSuppliers])

    useEffect(() => {
        setSupplierRoles(props.supplierRoles || [])
    }, [props.supplierRoles])

    function getContactNamePic (fullName: string, lastName: string, firstName: string): string {
      const splitFullName: Array<string> = fullName ? fullName.split(' ') : []
      const _firstName = firstName || splitFullName.length > 0 ? splitFullName[0] : ''
      const _lastName = lastName || splitFullName.length > 1 ? splitFullName[1] : ''

      return _firstName || _lastName ? createImageFromInitials(_firstName, _lastName) : ''
    }

    function removeSelectedSupplier (index: number) {
        if (props.removeSelectedSupplier) {
          props.removeSelectedSupplier(index)
        }
    }

    function handleShowContactPopup (supplier: Supplier) {
        setSupplierNameForContact(supplier.supplierName)
        setSelectedSupplierContact(supplier.contact)
        if (supplier.vendorId && props.getVendorUsers) {
            props.getVendorUsers(supplier.vendorId)
            .then((resp) => {
              setExistingUserList(resp)
              setShowContactPopup(true)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
            setShowContactPopup(true)
        }
    }

    function getSupplierFromSupplierName (selectedSuppliers: Array<Supplier>, supplierName: string): Supplier | null {
        const supplierFound = selectedSuppliers.find(supplier => supplier.supplierName === supplierName)
        return supplierFound || null
    }

    function removeContact (supplierName: string) {
        const addContactToSupplier = getSupplierFromSupplierName(selectedSuppliers, supplierName)
        if (addContactToSupplier) {
          addContactToSupplier.contact = null
        }
        if (addContactToSupplier) {
          if (props.updateSupplier) {
            props.updateSupplier(addContactToSupplier)
          }
          setSelectedSupplierContact(null)
        }
      }

    function handleAddPersonContact (contactName: string, email: string, role: string, phone: string) {
        const addContactToSupplier = getSupplierFromSupplierName(selectedSuppliers, supplierNameForContact)
        if (addContactToSupplier) {
          addContactToSupplier.contact = {
            email: email,
            fullName: contactName,
            phone: phone,
            role: role
          }
        }
        if (addContactToSupplier) {
          if (props.updateSupplier) {
            props.updateSupplier(addContactToSupplier)
          }
          setSelectedSupplierContact(null)
        }
    }
  
    return (
        <>
        {props.selectedSuppliers.length > 0 &&
            <div className={`${styles.supplierVendors} ${props.isInPortal ? styles.supplierVendorsSingleIsInPortal : ''}`}>
            {props.selectedSuppliers.map((supplier, index) => {
                return (
                <div className={`${styles.supplierCard} ${supplier.potentialMatchIgnore ? styles.ignoredDuplicates : ''}`} key={index}>
                    <div className={`${styles.supplierVendorsItem} ${props.isInPortal ? styles.supplierVendorsItemInPortal : ''}`}>
                        {!props.isReadonly && <div className={styles.supplierVendorsItemDelete} onClick={() => removeSelectedSupplier(index)}>
                        <span className={styles.supplierVendorsItemDeleteIcon}><X size={16} color={'var(--warm-neutral-shade-200)'} /></span>
                        </div>}
                        <div className={`${styles.supplierVendorsItemInfo}`}>
                        <div className={styles.supplierVendorsItemInfoBox}>
                            <div className={styles.supplierVendorsItemInfoBoxDetail}>
                            <h3 className={styles.supplierVendorsItemInfoName}>{supplier.supplierName}</h3>
                            {((supplier?.address && convertAddressToString(supplier.address)) || supplier?.website || supplier?.duns) && <div className={styles.supplierVendorsItemInfoLocation}>
                                {supplier.address && convertAddressToString(supplier.address) && <div className={styles.supplierVendorsItemInfoLocationAddress}>
                                <span>{[supplier?.address?.city || '', mapAlpha2codeToDisplayName(supplier?.address?.alpha2CountryCode) || ''].filter(Boolean).join(', ')}</span>
                                </div>}
                                {supplier.website && <div className={styles.supplierVendorsItemInfoLocationAddress}>
                                <a href={checkURLContainsProtcol(supplier.website)} target='_blank' rel='noreferrer' title={supplier.website}>
                                    <Globe size={16} color={'var(--warm-neutral-shade-200)'} />
                                    {t('Website')}
                                </a>
                                </div>}
                                {supplier.duns && <div className={styles.supplierVendorsItemInfoLocationAddress}>
                                <span>{supplier.duns}</span>
                                </div>}
                            </div>}
                            {(supplier?.legalEntity?.parentRef?.name || supplier?.legalEntity?.ultimateParentRef?.name) && <div className={styles.supplierVendorsItemInfoParents}>
                                {supplier?.legalEntity?.parentRef?.name && <div className={styles.supplierVendorsItemInfoParentsItem}>
                                <div className={styles.supplierVendorsItemInfoParentsItemLabel}>{t('Parent')}:</div>
                                <div className={styles.supplierVendorsItemInfoParentsItemText}>{supplier?.legalEntity?.parentRef.name}</div>
                                </div>}
                                {supplier?.legalEntity?.ultimateParentRef?.name && <div className={styles.supplierVendorsItemInfoParentsItem}>
                                <div className={styles.supplierVendorsItemInfoParentsItemLabel}>{t('Ultimate parent')}:</div>
                                <div className={styles.supplierVendorsItemInfoParentsItemText}>{supplier?.legalEntity?.ultimateParentRef?.name}</div>
                                </div>}
                            </div>}
                        </div>
                        {supplier.legalEntity && getSupplierLogoUrl(supplier.legalEntity) && (
                            <div className={styles.supplierVendorsItemInfoLogo}>
                            <img src={getSupplierLogoUrl(supplier.legalEntity)} alt='' />
                            </div>
                        )}
                        </div>
                        <div className={styles.supplierVendorsPersonContact}>
                            <div className={styles.supplierVendorsPersonContactAdd}>
                            {!supplier.contact && !props.isReadonly &&
                                <div className={styles.supplierVendorsPersonContactAddAction} onClick={() => { !props.isReadonly && handleShowContactPopup(supplier) }}>
                                    <UserPlus size={20} color='var(--warm-neutral-shade-400)' />{t('Add contact')}
                                    <span>({t('Required')})</span>
                                </div>
                            }
                            {props.showNoContactSelectedErrorMessage && !props.isReadonly && <div className={styles.supplierErrorMessage}><AlertCircle size={16} color="var(--warm-stat-chilli-regular)"></AlertCircle>{t('Contact is required')}</div>}
                            {supplier.contact && <div className={styles.supplierVendorsPersonContactAddTitle}>{t('Contact')}<span>({t('Required')})</span></div>}
                            {!supplier.contact && props.isReadonly &&
                                <div className={styles.supplierVendorsPersonContactAddNotAvailable}>
                                <UserX size={16} color='var(--warm-neutral-shade-300)' />{t('Contact not provided')}
                                </div>
                            }
                            </div>
                            {supplier.contact &&
                            <div className={styles.supplierVendorsPersonContactExist}>
                                <div className={styles.supplierVendorsPersonContactExistInfo}>
                                <div className={styles.supplierVendorsPersonContactExistInfoPic}>
                                    <img src={getContactNamePic(supplier.contact.fullName || '', supplier.contact.lastName || '', supplier.contact.firstName || '')} alt="" />
                                </div>
                                <div className={styles.supplierVendorsPersonContactExistInfoDetail}>
                                    <h3>{supplier.contact.fullName ? supplier.contact.fullName : `${supplier.contact.firstName} ${supplier.contact.lastName}`}</h3>
                                    <div className={styles.supplierVendorsPersonContactExistInfoDetailRole}>
                                    {supplier.contact?.role || ''}
                                    </div>
                                    <div className={styles.supplierVendorsPersonContactExistInfoDetailConnect}>
                                    {supplier.contact?.email && <span>{supplier.contact?.email}</span>}
                                    {supplier.contact?.phone && <span>{supplier.contact?.phone}</span>}
                                    </div>
                                </div>
                                </div>
                                {!props.isReadonly && <div className={styles.supplierVendorsPersonContactExistAction}>
                                <Edit color='var(--warm-neutral-shade-200)' size={16} onClick={() => handleShowContactPopup(supplier)}/>
                                <X color='var(--warm-neutral-shade-200)' size={16} onClick={() => removeContact(supplier.supplierName)}/>
                                </div>}
                            </div>
                            }
                        </div>
                    </div>
                    </div>
                </div>
                )
            })}
            </div>}
        <Modal open={showContactPopup} onClose={() => {
            setShowContactPopup(false)
            setSelectedSupplierContact(null)
            setExistingUserList([])
            }}>
            <div className={styles.supplierContactForm}>
               <Contact
                  title={!selectedSupplierContact && existingUserList?.length > 0 ? t('Select a contact') : t('Add a contact')}
                  supplierRoles={supplierRoles}
                  alreadyExistingVendorContact={existingUserList}
                  contact={selectedSupplierContact}
                  onClose={() => { setShowContactPopup(false); setSelectedSupplierContact(null); setExistingUserList([]) }}
                  addPersonContact={handleAddPersonContact}
                />
            </div>
        </Modal>
        </>
    )
  }