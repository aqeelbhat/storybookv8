import React, { useEffect, useState } from 'react'
import { ChevronDown, X, Circle, Check, Plus, AlertCircle, Star } from 'react-feather'
import styles from './contact.style.module.scss'
import defaultUserPic from '../../assets/default-user-pic.png'
import { ContactDesignation, ContactRole, Contact as ContactType, SupplierUser } from '../../../Types'
import { enumSupplierFields, Field, getFormFieldConfig, isRequired, MasterDataRoleObject, validateEmail } from '../..'
import { Autocomplete, TextField } from '@mui/material'
import { isOmitted, validateField, validatePhoneNumber } from '../../util'
import { createImageFromInitials } from '../../../util'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { OroButton } from '../../../controls'
import { OROEmailInput, OROPhoneInputNew, TextBox } from '../../../Inputs'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../../../i18n'

interface ContactProps {
    title: string
    fields?: Field[]
    contact?: ContactType | null
    alreadyExistingVendorContact?: Array<ContactType>
    onlyPersonalContact?: boolean
    supplierRoles?: Array<MasterDataRoleObject>
    primaryButtonLable?: string
    disallowFreeEmailDomain?: boolean
    isNewSupplier?: boolean
    onClose?: () => void
    addPersonContact?: (contactName: string, email: string, role: string, phone: string, designation?: ContactDesignation, primary?: boolean) => void
    addCompanyContact?: (companyEmail: string, companyPhone: string) => void
}

const PERSON_TAB = 'person'
// const COMPANY_TAB = 'company'

function AlreadyExistingContacts (props:{ contactList: Array<ContactType>, onContactChecked?:(contact: ContactType) => void }) {
  const [value, setValue] = useState<ContactType | null>(null)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

  const handleChange = (contact: ContactType) => {
    setValue(contact)
    if (props.onContactChecked) {
      props.onContactChecked(contact)
    }
  }
  function createImage (contact: ContactType): string {
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
                    <div className={styles.existingContactsListItemInfoDetailName}>
                      {contact.fullName ? contact.fullName : contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName || contact.lastName || contact.email}
                    </div>
                    {(contact?.designation?.role === ContactRole.primary || contact?.primary) && <div className={styles.primaryChip}>
                      <Star size={12} color={'var(--warm-misc-bold-gold)'} fill={'var(--warm-misc-bold-gold)'} />
                      <span className={styles.tag}>{t('--primary--')}</span>
                    </div>}
                  </div>
                  <div className={styles.existingContactsListItemInfoDetailRole}>{contact.role}</div>
                  <div className={`${styles.existingContactsListItemInfoDetailrow} ${styles.contactContainer}`}>
                    <div className={styles.existingContactsListItemInfoDetailEmail}>{contact.email}</div>
                    {contact.phone && <div className={styles.existingContactsListItemInfoDetailPhone}>{contact.phone}</div> }
                  </div>
                </div>
                <div className={styles.existingContactsListItemInfoCheckbox}>
                  {value !== contact && <Circle color="var(--warm-neutral-shade-100)" />}
                  {value === contact && <span className={styles.existingContactsListItemInfoCheckboxIcon}><Check color="var(--warm-prime-chalk)" /></span>}
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

function ContactContent (props: ContactProps) {
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [contactDesignation, setContactDesignation] = useState<ContactDesignation>()
  const [isPrimary, setIsPrimary] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState(PERSON_TAB)
  const [isContactsAlreadyExists, setIsContactsAlreadyExists] = useState(false)
  const [supplierRoles, setSupplierRoles] = useState<Array<MasterDataRoleObject>>([])
  const [forceValidate, setForceValidate] = useState(false)
  const [showRoleError, setShowRoleError] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

  function isFieldRequired (fieldName: string): boolean {
    if (props.fields) {
      const field = getFormFieldConfig(fieldName, props.fields)
      return isRequired(field)
    }
    return false
  }

  useEffect(() => {
    if (props.contact) {
      setContactName(props.contact.fullName ? props.contact.fullName : props.contact.firstName && props.contact.lastName ? `${props.contact.firstName} ${props.contact.lastName}` : props.contact.firstName || props.contact.lastName || '')
      setEmail(props.contact.email)
      setPhone(props.contact.phone)
      setRole(props.contact.role)
      setContactDesignation(props.contact.designation || undefined)
      setIsPrimary(props.contact.primary || false)
    } else {
      setRole('')
    }
    setActiveTab(PERSON_TAB)
  }, [props.contact])

  useEffect(() => {
    if (props.isNewSupplier) {
      setContactDesignation({ role: ContactRole.primary })
    }
  }, [props.isNewSupplier])

  function isFieldOmitted (fields: Array<Field>, fieldName: string): boolean {
    if (fields) {
      const field = getFormFieldConfig(fieldName, fields)
      return isOmitted(field)
    }
    return false
  }

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
      props.addPersonContact(contactName, email, role, phone, contactDesignation, isPrimary)
    }
  }

  function handleRoleValidation (value: string) {
    if (!value && isFieldRequired(enumSupplierFields.role)) {
      setShowRoleError(true)
    } else {
      setShowRoleError(false)
    }
  }

  function checkAllFields (): boolean {
    return (
      (!phone && isFieldRequired(enumSupplierFields.phoneNumber)) || (!isPossiblePhoneNumber(phone || '') && !!phone) || (!props.fields && !email) ||
      (props.fields && !email && isFieldRequired(enumSupplierFields.email)) || (validateEmail(enumSupplierFields.email, email) && !!email) ||
      (props.fields && !contactName && isFieldRequired(enumSupplierFields.contact)) || (!props.fields && !contactName) ||
      (!role && isFieldRequired(enumSupplierFields.role))
    )
  }

  function triggerValidations () {
    handleRoleValidation(role)
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }

  function checkAllFieldsValidated () {
    if (checkAllFields()) {
      triggerValidations()
    } else {
      submitContact()
    }
  }

  function disableConfirmButton (): boolean {
    return !(contactName || email || role || phone)
  }

  function disableAddButton (): boolean {
    return checkAllFields()
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }

  function setContactDetails (contact: SupplierUser) {
    setContactName(contact.fullName ? contact.fullName : contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName || contact.lastName || '')
    setEmail(contact.email)
    setPhone(contact.phone)
    setRole(contact.role)
    setContactDesignation(contact.designation as ContactDesignation)
    setIsPrimary(contact.primary || false)
  }

  function resetContact () {
    setContactName('')
    setEmail('')
    setPhone('')
    setRole('')
    setContactDesignation(undefined)
  }

  return (
    <div className={styles.contactForm}>
        <div className={`${styles.contactFormHeading} ${props.onlyPersonalContact || isContactsAlreadyExists ? styles.contactFormHeadingBorder : ''}`}>
            <h3>{props.title ? props.title : isContactsAlreadyExists ? t('--selectContact--') : t('--addContact--')}</h3>
            <X className={styles.contactFormClose} size={20} color="var(--warm-neutral-shade-500)" onClick={closePopup}></X>
        </div>
        {
          isContactsAlreadyExists && props.alreadyExistingVendorContact && props.alreadyExistingVendorContact.length > 0 && <div className={styles.contactFormExistingContactList}>
            <AlreadyExistingContacts onContactChecked={setContactDetails} contactList={props.alreadyExistingVendorContact}></AlreadyExistingContacts>
            <div className={styles.actionRow}>
              <OroButton onClick={() => { resetContact(); setIsContactsAlreadyExists(false) }} className={styles.contactFormActionsSecondary} type="secondary" icon={<Plus size={14} color="var(--warm-neutral-shade-400)"></Plus>} label={t('--addNewContact--')} />
            </div>
          </div>
        }
        {!isContactsAlreadyExists && <div className={styles.contactFormInputs}>
          {activeTab === PERSON_TAB && <div>
            {((props.fields && !isFieldOmitted(props.fields, enumSupplierFields.contact)) || !props.fields) && <div className={styles.contactFormInputsItem}>
                <TextBox
                  label={getFormFieldConfig(enumSupplierFields.contact, props.fields || [])?.customLabel || t('--contactName--')}
                  placeholder={t('--enterName--')}
                  forceValidate={forceValidate}
                  validator={(value) => validateField(getFormFieldConfig(enumSupplierFields.contact, props.fields || [])?.customLabel || t('--contactName--'), value)}
                  value={contactName}
                  required={props.fields !== undefined ? isFieldRequired(enumSupplierFields.contact) : true}
                  onChange={(value) => setContactName(value)}
                />
            </div>}
            {((props.fields && !isFieldOmitted(props.fields, enumSupplierFields.role)) || !props.fields) && <div className={styles.contactFormInputsItem} id="materialUIAutocomplete">
                <label className={styles.contactFormInputsItemLabel}>{getFormFieldConfig(enumSupplierFields.role, props.fields || [])?.customLabel || t('--role--')}  {!isFieldRequired(enumSupplierFields.role) ? '(optional)' : ''}</label>
                <Autocomplete
                  id={styles.freeSolo}
                  freeSolo
                  popupIcon={<ChevronDown size={16} color="var(--warm-neutral-shade-300)"></ChevronDown>}
                  forcePopupIcon
                  disableClearable={false}
                  value={role}
                  options={supplierRoles}
                  onSelect={handleChange}
                  clearOnEscape={true}
                  clearIcon={<X color="var(--warm-neutral-shade-300)" size={16} className="clearText"></X>}
                  getOptionLabel={option => (option as MasterDataRoleObject)?.name || role}
                  renderInput={(params) => (
                    <TextField
                      className="oro-text-input widget-level"
                      placeholder={t('--enterSelectRole--')}
                      {...params}
                      onChange={handleChange}
                      onBlur={(e) => {
                        handleRoleValidation(e.target.value)
                        handleChange(e)
                      }}
                    />
                  )}
                />
                {(showRoleError) && <div className={styles.error}><AlertCircle size={16} color='var(--warm-stat-chilli-regular)'/> {validateField(getFormFieldConfig(enumSupplierFields.role, props.fields || [])?.customLabel || t('--role--'), role)}</div>}
            </div>}
            {((props.fields && !isFieldOmitted(props.fields, enumSupplierFields.email)) || !props.fields) && <div className={styles.contactFormInputsItem}>
                <OROEmailInput
                  label={`${getFormFieldConfig(enumSupplierFields.email, props.fields || [])?.customLabel || t('--email--')}`}
                  placeholder={t('--email--')}
                  required={props.fields !== undefined ? isFieldRequired(enumSupplierFields.email) : true}
                  value={email}
                  forceValidate={forceValidate}
                  validator={(value) => validateEmail(getFormFieldConfig(enumSupplierFields.email, props.fields || [])?.customLabel || t('--email--'), value, !isFieldRequired(enumSupplierFields.email))}
                  onChange={(value) => setEmail(value)}
                />
                {props.contact?.emailVerification?.domainNotExist && <div className={styles.contactFormInputsItemEVF}><AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle> {t('--domainNotExist--')} <br /> {t('--pleaseProvideAlternateEmailToProceed--')}</div>}
                {props.contact?.emailVerification?.isFreeDomain && props.disallowFreeEmailDomain && <div className={styles.contactFormInputsItemEVF}><AlertCircle size={16} color='var(--warm-stat-chilli-regular)'></AlertCircle> {t('--contactUsesPersonalEmail--')} <br />{t('--pleaseProvideBusinessEmailToProceed--')}</div>}
            </div>}
            {((props.fields && !isFieldOmitted(props.fields, enumSupplierFields.phoneNumber)) || !props.fields) && <div className={styles.contactFormInputsItem}>
                <label className={styles.contactFormInputsItemLabel}>{`${getFormFieldConfig(enumSupplierFields.phoneNumber, props.fields || [])?.customLabel || t('--phoneNumber--')} ${!isFieldRequired(enumSupplierFields.phoneNumber) ? `(${t("--optional--")})` : ''}`}</label>
                <OROPhoneInputNew
                  value={phone}
                  config={{
                    optional: !isFieldRequired(enumSupplierFields.phoneNumber),
                    forceValidate: forceValidate
                  }}
                  validator={(value) => validatePhoneNumber(value, getFormFieldConfig(enumSupplierFields.phoneNumber, props.fields || [])?.customLabel || t('--phoneNumber--'), !isFieldRequired(enumSupplierFields.phoneNumber))}
                  onChange={setPhone}
                />
            </div>}
          </div>}
        </div>}
        <div className={styles.contactFormActions}>
          {!isContactsAlreadyExists && <>
            <OroButton type="default" onClick={closePopup} label={t('--cancel--')} className={styles.contactFormActionsSecondary}/>
            <OroButton type="primary" disabled={disableAddButton()} label={props.primaryButtonLable ? props.primaryButtonLable : t('--add--') } className={styles.contactFormActionsPrimary} onClick={checkAllFieldsValidated}></OroButton>
          </>
          }
          {isContactsAlreadyExists &&
            <OroButton type="primary" disabled={disableConfirmButton()} label={t('--confirm--')} className={styles.contactFormActionsPrimary} onClick={submitContact}></OroButton>
          }
        </div>
    </div>
  )
}

export function Contact (props: ContactProps) {
  return <I18Suspense><ContactContent {...props}></ContactContent></I18Suspense>
}
