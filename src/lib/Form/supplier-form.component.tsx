import React, { useEffect, useState } from 'react'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { MasterDataRoleObject, SupplierFormProps, SupplierInputForm } from './types'
import { getFormFieldConfig, validateDUNSNumber, validateEmail, validateField, validateWebsite } from './util'

import { OROWebsiteInput, TextBox, OROPhoneInput, OROEmailInput } from '../Inputs'
import { OROInput } from '../OROInput/OROInput'
import { Autocomplete, TextField } from '@mui/material'
import styles from './supplier-form-styles.module.scss'
import { ChevronDown, X } from 'react-feather'
import './custom-material-UI.scss'
import { ContactRole } from '../Types/common'
import classNames from 'classnames'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

const ONBOARDING_PROCESS = 'onboarding'

export function SupplierFormComponent (props: SupplierFormProps) {
  const [showHideNameRole, setShowHideNameRole] = useState(false)
  const [isOnboardingProcess, setIsOnboardingProcess] = useState(false)
  const [name, setName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [duns, setDuns] = useState('')
  const [roles, setRoles] = useState<Array<MasterDataRoleObject>>([])
  const [website, setWebsite] = useState('')
  const [role, setRole] = useState('')
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERFORM])

  useEffect(() => {
    if (props.formData && props.formData?.name) {
      setName(props.formData.name)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.supplierRoles && props.supplierRoles.length > 0) {
      setRoles(props.supplierRoles)
    }
  }, [props.supplierRoles])

  // useEffect(() => {
  //   if (props.processType && props.processType === ONBOARDING_PROCESS) {
  //     setShowHideNameRole(true)
  //     setIsOnboardingProcess(true)
  //   }
  // }, [props.processType])

  function submitForm () {
    if (props.onFormSubmit && !props.readonly && showHideNameRole) {
      setForceValidate(false)
      props.onFormSubmit({ name, website, contactName, email, phone, role, duns, designation: { role: ContactRole.primary } })
    } else if (props.onFormSubmit && !props.readonly && !showHideNameRole) {
      setForceValidate(false)
      props.onFormSubmit({ name, website, duns })
    }
  }

  function checkAllFileds (): boolean {
    return !(name &&
      !(!!validateWebsite('website', website) && !!website) &&
      !(!isPossiblePhoneNumber(phone || '') && !!phone) &&
      !(!!validateDUNSNumber('DUNS', duns) && !!duns) &&
      (showHideNameRole ? !validateEmail('email', email) : !(validateEmail('email', email) && !!email)) &&
      (showHideNameRole ? !!contactName : true)
    )
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }

  function handleEmailValidation (value: string): string {
    if (!value) {
      return ''
    } else {
      return validateWebsite('Website', value)
    }
  }
  function handleDUNSNumberValidation (value: string): string {
    if (!value) {
      return ''
    } else {
      return validateDUNSNumber('DUNS', value)
    }
  }
  function getFormData (): SupplierInputForm {
    return { name, website, contactName, email, phone, role, duns }
  }
  function triggerValidations () {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }
  function fetchData (skipValidation?: boolean): SupplierInputForm | null {
    if (checkAllFileds()) {
      triggerValidations()
    }

    return checkAllFileds() ? null : getFormData()
  }

  function checkAllFieldsValidated () {
    if (checkAllFileds()) {
      triggerValidations()
    } else {
      submitForm()
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [name, email, phone, contactName, role, website, showHideNameRole, duns, props.processType])

  return (
    <div className={styles.supplierIdForm}>
      <h2 className={styles.supplierIdFormHeading}>{t('--newSupplierInformation--')}</h2>
      <div className={styles.supplierDetailContainer}>
        <div className={styles.supplierInfo}>
          <div className={classNames(styles.supplierInfoFlexbox, styles.supplierInfoFlexboxWidth)}>
            <div className={styles.fwrapper}>
              <TextBox
                label={getFormFieldConfig('supplierName', props.supplierFormConfigurationFields)?.customLabel || t('--companyName--')}
                disabled={props.disabled}
                validator={(value) => validateField('Supplier company', value)}
                required={true}
                placeholder={t('--enterName--')}
                value={name}
                onChange={value => setName(value)}
              />
            </div>
            <div className={styles.fwrapper}>
              <OROWebsiteInput
                label={getFormFieldConfig('website', props.supplierFormConfigurationFields)?.customLabel || t('--website--')}
                disabled={props.disabled}
                validator={(value) => handleEmailValidation(value)}
                required={false}
                placeholder={t('--http--')}
                value={website}
                onChange={value => setWebsite(value)}
              />
            </div>
            <div className={styles.fwrapper}>
              <TextBox
                label={t('--dunsNumber--')}
                disabled={props.disabled}
                validator={(value) => handleDUNSNumberValidation(value)}
                required={false}
                placeholder={t('--enterDuns--')}
                value={duns}
                onChange={value => setDuns(value)}
              />
            </div>
          </div>
        </div>
        <div className={styles.supplierContact}>
           <div className={styles.fwrapper}>
            {!isOnboardingProcess && <label className={styles.label}>{t('--bestWayToReach--')}</label>}
            {isOnboardingProcess && <label className={styles.labelOnboarding}>{t('--contactDetails--')}</label>}
            {!isOnboardingProcess && <div className={styles.supplierInfoRadioFlexbox}>
              <div className={styles.radioSelector}>
                <OROInput className={styles.radio} name="conatct" onChange={(e) => setShowHideNameRole(true)} type="radio" /><span className={styles.radioLabel}>{t('--iHaveContactPerson--')}</span>
              </div>
              <div className={styles.radioSelector}>
                <OROInput className={styles.radio} name="conatct" onChange={(e) => setShowHideNameRole(false)} type="radio" /><span className={styles.radioLabel}>{t('--iDontHaveContactPerson--')}</span>
              </div>
            </div>}
          </div>
          {showHideNameRole && <div className={styles.supplierInfo}>
            <div className={classNames(styles.supplierInfoFlexbox, styles.supplierInfoFlexboxWidth)}>
              <div className={styles.fwrapper}>
                <TextBox
                  disabled={props.disabled}
                  label={getFormFieldConfig('contact', props.supplierFormConfigurationFields)?.customLabel || t('--contactName--')}
                  placeholder={t('--fullName--')}
                  validator={(value) => validateField('Contact Name', value)}
                  forceValidate={showHideNameRole ? forceValidate : false}
                  required={showHideNameRole}
                  value={contactName}
                  onChange={value => setContactName(value)}
                />
              </div>
              <div className={styles.fwrapper}>
                <OROEmailInput
                  disabled={props.disabled}
                  label={getFormFieldConfig('email', props.supplierFormConfigurationFields)?.customLabel || t('--email--')}
                  validator={(value) => validateEmail('Email', value)}
                  forceValidate={showHideNameRole ? forceValidate : false}
                  required={showHideNameRole}
                  placeholder={t('--enterEmail--')}
                  value={email}
                  onChange={value => setEmail(value)}
                />
              </div>
            </div>
            <div className={classNames(styles.supplierInfoFlexbox, styles.supplierInfoFlexboxWidth)}>
              <div className={styles.fwrapper}>
                <OROPhoneInput
                  disabled={props.disabled}
                  label={getFormFieldConfig('phoneNumber', props.supplierFormConfigurationFields)?.customLabel || t('--phoneNumber--')}
                  placeholder={t('--number--')}
                  value={phone}
                  required={false}
                  onChange={value => setPhone(value)}
                />
              </div>
              <div className={styles.fwrapper} id="materialUIAutocomplete">
                <label className={styles.label}>{getFormFieldConfig('role', props.supplierFormConfigurationFields)?.customLabel || t('--role--')} {t('--optional--')}</label>
                <Autocomplete
                  id={styles.freeSolo}
                  freeSolo
                  popupIcon={<ChevronDown size={16} color="var(--warm-neutral-shade-300)"></ChevronDown>}
                  forcePopupIcon
                  disabled={props.disabled}
                  disableClearable={false}
                  value={role}
                  options={roles}
                  clearOnEscape={true}
                  clearIcon={<X color="var(--warm-neutral-shade-300)" size={16} className="clearText"></X>}
                  getOptionLabel={option => (option as MasterDataRoleObject).name || role}
                  renderInput={(params) => (
                    <TextField
                      className="oro-text-input widget-level"
                      placeholder={t('--enterOrSelectRole--')}
                      disabled={props.disabled}
                      {...params}
                      onChange={handleChange}
                      onBlur={handleChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>}
          <div className={styles.action}>
            <button onClick={checkAllFieldsValidated} className={styles.addSupplier}>{t('--addSupplier--')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export function SupplierForm (props: SupplierFormProps) {
  return <I18Suspense><SupplierFormComponent {...props} /></I18Suspense>
}