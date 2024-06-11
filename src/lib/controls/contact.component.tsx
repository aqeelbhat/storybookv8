import React, { useEffect, useState } from 'react'
import { ChevronDown, X, Circle, Check, Plus } from 'react-feather'
import { Autocomplete, TextField } from '@mui/material'
import { isPossiblePhoneNumber } from 'react-phone-number-input'

import { SupplierUser, Contact as ContactType } from '../Types/common'
import { MasterDataRoleObject } from '../Form/types'
import { createImageFromInitials } from '../util'
import { validateEmail } from '../Form/util'
import { OroButton } from './button/button.component'
import { TextBox } from '../Inputs/text.component'
import { OROEmailInput } from '../Inputs/oro-email-input-component'
import { OROPhoneInput } from '../Inputs/OROPhoneInput.component'
import { getI18Text } from '../i18n'

import './../BootstrapTypeahead.scss'
import styles from './contact.style.module.scss'
import defaultUserPic from './../Form/assets/default-user-pic.png'

interface ContactProps {
    title: string
    contact?: ContactType | null
    alreadyExistingVendorContact?: Array<SupplierUser>
    onlyPersonalContact?: boolean
    supplierRoles?: Array<MasterDataRoleObject>
    primaryButtonLable?: string
    onClose?: () => void
    addPersonContact?: (contactName: string, email: string, role: string, phone: string) => void
    addCompanyContact?: (companyEmail: string, companyPhone: string) => void
}

const PERSON_TAB = 'person'
// const COMPANY_TAB = 'company'

function AlreadyExistingContacts (props:{ contactList: Array<SupplierUser>, onContactChecked?:(contact: SupplierUser) => void }) {
  const [value, setValue] = useState<SupplierUser | null>(null)

  const handleChange = (contact: SupplierUser) => {
    setValue(contact)
    if (props.onContactChecked) {
      props.onContactChecked(contact)
    }
  }
  function createImage (contact: SupplierUser): string {
    if (contact.firstName || contact.lastName) {
      return createImageFromInitials(contact.firstName || '', contact.lastName || '')
    } else if (contact.fullName) {
      const initial = contact.fullName.split(' ')
      return createImageFromInitials(initial[0], initial[1])
    } else {
      return defaultUserPic
    }
  }
  return (
    <div className={styles.existingContacts}>
      <div className={styles.existingContactsList}>
        {props.contactList.map((contact, index) => {
          return (
            <div key={index} className={`${styles.existingContactsListItem} ${value === contact ? styles.active : ''}`} onClick={() => handleChange(contact)}>
              <div className={styles.existingContactsListItemInfo}>
                <div className={styles.existingContactsListItemInfoDetail}>
                  <div className={styles.existingContactsListItemInfoDetailrow}>
                    <img src={createImage(contact)} alt=""/>
                    <div className={styles.existingContactsListItemInfoDetailName}>{contact.fullName ? contact.fullName : `${contact.firstName} ${contact.lastName}`}</div>
                  </div>
                  <div className={styles.existingContactsListItemInfoDetailRole}>{contact.role}</div>
                  <div className={styles.existingContactsListItemInfoDetailEmail}>{contact.email}</div>
                </div>
                <div className={styles.existingContactsListItemInfoCheckbox}>
                  {value !== contact && <Circle color="var(--warm-neutral-shade-100)" />}
                  {value === contact && <span className={styles.existingContactsListItemInfoCheckboxIcon}><Check color="#ffffff" /></span>}
                  <input type="radio" name="contact" onChange={() => handleChange(contact)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Contact (props: ContactProps) {
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  // const [companyPhone, setCompanyPhone] = useState('')
  // const [companyEmail, setCompanyEmail] = useState('')
  const [activeTab, setActiveTab] = useState(PERSON_TAB)
  const [isContactsAlreadyExists, setIsContactsAlreadyExists] = useState(false)
  const [supplierRoles, setSupplierRoles] = useState<Array<MasterDataRoleObject>>([])

  useEffect(() => {
    if (props.contact) {
      setContactName(props.contact.fullName ? props.contact.fullName : `${props.contact.firstName} ${props.contact.lastName}`)
      setEmail(props.contact.email)
      setPhone(props.contact.phone)
      setRole(props.contact.role)
    } else {
      setRole('')
    }
    setActiveTab(PERSON_TAB)
  }, [props.contact])

  useEffect(() => {
    if (props.supplierRoles && props.supplierRoles.length > 0) {
      setSupplierRoles(props.supplierRoles)
    }
  }, [props.supplierRoles])

  useEffect(() => {
    if (props.contact) {
      setIsContactsAlreadyExists(false)
    } else if (props.alreadyExistingVendorContact && props.alreadyExistingVendorContact.length > 0 && !props.contact) {
      setIsContactsAlreadyExists(true)
    }
  }, [props.alreadyExistingVendorContact, props.contact])

  function closePopup () {
    if (props.onClose) {
      setIsContactsAlreadyExists(false)
      props.onClose()
    }
  }

  function submitContact () {
    if (props.addPersonContact && activeTab === PERSON_TAB) {
      props.addPersonContact(contactName, email, role, phone)
      closePopup()
    }
  }

  function disableConfirmButton (): boolean {
    return !(contactName || email || role || phone)
  }

  function disableAddButton (): boolean {
    return !(contactName && !validateEmail('email', email) && !(!isPossiblePhoneNumber(phone || '') && !!phone))
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }

  function setContactDetails (contact: SupplierUser) {
    setContactName(contact.fullName ? contact.fullName : `${contact.firstName} ${contact.lastName}`)
    setEmail(contact.email)
    setPhone(contact.phone)
    setRole(contact.role)
  }

  return (
    <div className={styles.contactForm}>
        <div className={`${styles.contactFormHeading} ${props.onlyPersonalContact || isContactsAlreadyExists ? styles.contactFormHeadingBorder : ''}`}>
            <h3>{props.title ? props.title : isContactsAlreadyExists ? 'Select a contact' : 'Add a contact'}</h3>
            <X className={styles.contactFormClose} size={20} color="var(--warm-neutral-shade-500)" onClick={closePopup}></X>
        </div>
        {
          isContactsAlreadyExists && props.alreadyExistingVendorContact && props.alreadyExistingVendorContact.length > 0 && <div className={styles.contactFormExistingContactList}>
            <AlreadyExistingContacts onContactChecked={setContactDetails} contactList={props.alreadyExistingVendorContact}></AlreadyExistingContacts>
            <div className={styles.actionRow}>
              <OroButton onClick={() => setIsContactsAlreadyExists(false)} className={styles.contactFormActionsSecondary} type="secondary" icon={<Plus size={14} color="var(--warm-neutral-shade-400)"></Plus>} label="Add new contact" />
            </div>
          </div>
        }
        {/* {!props.onlyPersonalContact && !isContactsAlreadyExists && <div className={styles.contactFormTabs}>
          <div className={styles.contactFormTabsItems}>
            <span className={activeTab === PERSON_TAB ? styles.contactFormTabsItemsActive : ''} onClick={() => setActiveTab(PERSON_TAB)}>Person</span>
            <span className={activeTab === COMPANY_TAB ? styles.contactFormTabsItemsActive : ''} onClick={() => setActiveTab(COMPANY_TAB)}>Company</span>
          </div>
        </div>} */}
        {!isContactsAlreadyExists && <div className={styles.contactFormInputs}>
          {activeTab === PERSON_TAB && <div>
            <div className={styles.contactFormInputsItem}>
                <TextBox
                  label={getI18Text("Contact name")}
                  placeholder={getI18Text("Enter name")}
                  validator={(value) => value ? '' : getI18Text("Contact name is required")}
                  value={contactName}
                  required={true}
                  onChange={(value) => setContactName(value)}
                />
            </div>
            <div className={styles.contactFormInputsItem} id="materialUIAutocomplete">
                <label className={styles.contactFormInputsItemLabel}>{getI18Text("Role")}</label>
                <Autocomplete
                  id={styles.freeSolo}
                  freeSolo
                  popupIcon={<ChevronDown size={16} color="#6A6A6A"></ChevronDown>}
                  forcePopupIcon
                  disableClearable={false}
                  value={role}
                  options={supplierRoles}
                  onSelect={handleChange}
                  clearOnEscape={true}
                  clearIcon={<X color="#6A6A6A" size={16} className="clearText"></X>}
                  getOptionLabel={option => (option as MasterDataRoleObject).name || role}
                  renderInput={(params) => (
                    <TextField
                      className="oro-text-input widget-level"
                      placeholder={getI18Text("Enter / select role")}
                      {...params}
                      onChange={handleChange}
                      onBlur={handleChange}
                    />
                  )}
                />
            </div>
            <div className={styles.contactFormInputsItem}>
                <OROEmailInput
                  label={getI18Text("Email")}
                  placeholder={getI18Text("Enter email")}
                  required={true}
                  value={email}
                  onChange={(value) => setEmail(value)}
                />
            </div>
            <div className={styles.contactFormInputsItem}>
                <OROPhoneInput
                  label={getI18Text("Phone number")}
                  placeholder="+1 ___-___-____"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                />
            </div>
          </div>}
          {/* {activeTab === COMPANY_TAB && <div>
            <div className={styles.contactFormInputsItem}>
              <OROEmailInput
                label="Enter company email"
                placeholder="Enter company email"
                required={true}
                value={companyEmail}
                onChange={(value) => setCompanyEmail(value)}
              />
            </div>
            <div className={styles.contactFormInputsItem}>
              <OROPhoneInput
                label="Company phone number"
                placeholder="+1 ___-___-____"
                value={companyPhone}
                onChange={(value) => setCompanyPhone(value)}
              />
            </div>
          </div>} */}
        </div>}
        <div className={styles.contactFormActions}>
          {!isContactsAlreadyExists && <>
            <OroButton type="default" onClick={closePopup} label="Cancel" className={styles.contactFormActionsSecondary}/>
            <OroButton type="primary" disabled={disableAddButton()} label={props.primaryButtonLable ? props.primaryButtonLable : getI18Text('Add') } className={styles.contactFormActionsPrimary} onClick={submitContact}></OroButton>
          </>
          }
          {isContactsAlreadyExists &&
            <OroButton type="primary" disabled={disableConfirmButton()} label={getI18Text('Confirm')} className={styles.contactFormActionsPrimary} onClick={submitContact}></OroButton>
          }
        </div>
    </div>
  )
}

export default Contact
