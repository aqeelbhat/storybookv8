import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'react-feather'
import { Checkbox, FormControlLabel } from '@mui/material'
import classnames from 'classnames'

import { ContactConfig } from '../CustomFormDefinition'
import { Address, Attachment, ContactData, ContactFields, Option, mapIDRef } from '../Types'
import { getEmptyContact, IDRef } from '../Types/common'
import { TextAreaControlNew, TextControlNew } from './text.component'
import { addressValidator, attachmentListValidator, dateValidator, costValidator, phoneValidator, stringValidator, contactValidator, emailValidator, numberValidator } from '../CustomFormDefinition/View/validator.service'
import { convertDateToString, getDateObject, isEmpty, mapAddressToIDRef, mapIDRefToAddress, mapIDRefToOption, mapOptionToIDRef, mapPhoneToString, mapStringToPhone, validateDateOrdering } from '../Form/util'
import { SingleAddressControlNew } from './address.component'
import { AttachmentsControlNew } from './attachment.component'
import { MultiSelect, NumberBox, OROPhoneInputNew, TypeAhead } from '../Inputs'
import { Cost } from '../Form/types'
import { MoneyControlNew } from './money.component'
import { DateControlNew } from './date.component'
import { DEFAULT_CURRENCY } from '../util'
import { getI18Text as getI18ControlText, useTranslationHook } from '../i18n'

import style from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { getSessionLocale } from '../sessionStorage'

interface ContactBoxProps {
  id?: string
  data?: ContactData
  index?: number
  fieldName: string
  locale: string
  config?: ContactConfig
  countryOptions?: Option[]
  locationOptions?: Option[]
  forceValidate?: boolean
  isExpanded?: boolean
  currencyOptions?: Option[]
  uomOptions?: Option[]
  roleOptions?: Option[]
  defaultCurrency?: string
  hideTitle?: boolean
  isSupplierView?: boolean
  getParsedAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
  getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  validator?: (value?) => string | null
  onChange?: (value: ContactData, file?: Attachment | File, attachmentName?: string) => void
  onDeleteClick?: () => void
  onToggleClick?: () => void
}

function ContactBox (props: ContactBoxProps) {
  const [name, setName] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [address, setAddress] = useState<Address>()
  const [attachments, setAttachments] = useState<Array<Attachment | File>>([])
  const [role, setRole] = useState<string>()
  const [level, setLevel] = useState<string>()
  const [rate, setRate] = useState<Cost>()
  const [uom, setUOM] = useState<IDRef>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [backgroundCheck, setBackgroundCheck] = useState<boolean>(false)
  const [sharePercentage, setSharePercentage] = useState<number | null>()
  const [country, setCountry] = useState<IDRef>()
  const [locations, setLocations] = useState<Array<IDRef>>([])
  const [operationLocation, setOperationLocation] = useState<Address>()
  const [countryOfOperation, setCountryOfOperation] = useState<IDRef>()
  const [service, setService] = useState<string>()

  const [forcedValidation, setForcedValidation] = useState<boolean>() // remember that forceValidate was triggered once
  const [forceValidateDateRange, setForceValidateDateRange] = useState<boolean>()
  const [endDateTouched, setEndDateTouched] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const { t } = useTranslationHook()

  useEffect(() => {
    if (props.forceValidate) {
      setForcedValidation(true)
      const err = contactValidator(props.data, {
        contactConfig: props.config
      })
      err && setIsExpanded(true)
    }
  }, [props.forceValidate])

  useEffect(() => {
    setIsExpanded(props.isExpanded)
  }, [props.isExpanded])

  useEffect(() => {
    if (props.data) {
      setName(props.data.fullName || '')
      setTitle(props.data.title || '')
      setEmail(props.data.email || '')
      setPhone(props.data.phoneObject ? mapPhoneToString(props.data.phoneObject) : '')
      setUrl(props.data.url || '')
      setNote(props.data.note || '')
      setAddress(props.data.address)
      setAttachments(props.data.attachments || [])
      setRole(props.data.role || '')
      setLevel(props.data.level || '')
      setRate(props.data.rate || {amount: '', currency: props.defaultCurrency || DEFAULT_CURRENCY})
      setStartDate(props.data.startDate || undefined)
      setEndDate(props.data.endDate || undefined)
      setBackgroundCheck(props.data.requireBackgroundCheck || false)
      setUOM(props.data.uom || undefined)
      setSharePercentage(props.data.sharePercentage)
      setCountry(props.data.address ? mapAddressToIDRef(props.data.address) : null)
      setOperationLocation(props.data.operationLocation)
      setCountryOfOperation(props.data.operationLocation ? mapAddressToIDRef(props.data.operationLocation) : null)
      setService(props.data.service || '')
      setLocations(props.data.locations || undefined)
    }
  }, [props.data])

  function getContactData (): ContactData {
    return {
      fullName: name || undefined,
      title: title || undefined,
      email: email || undefined,
      phoneObject: phone ? mapStringToPhone(phone) : undefined,
      url: url || undefined,
      note: note || undefined,
      address: address || undefined,
      attachments: (attachments && attachments.length > 0) ? attachments : undefined,
      role: role || undefined,
      level: level || undefined,
      rate: rate || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      requireBackgroundCheck: backgroundCheck || false,
      sharePercentage: sharePercentage || undefined,
      uom: uom && uom.id ? uom : undefined,
      operationLocation: operationLocation || undefined,
      service: service || undefined,
      locations: locations || undefined
    }
  }

  function isFieldVisible (fieldName: ContactFields): boolean {
    if (props.config) {
      const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName as unknown as ContactFields)]
      return !!props.config?.visibleFields?.find(e => e === field)
    }
  }

  function isFieldMandatory (fieldName: ContactFields): boolean {
    if (props.config) {
      const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName as unknown as ContactFields)]
      return !!props.config?.mandatoryFields?.find(e => e === field)
    }
  }

  function isFieldReadonly (fieldName: ContactFields): boolean {
    if (props.config) {
      const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName as unknown as ContactFields)]
      return !!props.config?.readonlyFields?.find(value => value === field)
    }
  }

  function getContactDataWithUpdatedValue (fieldName: string, newValue: string | Option | Address | Cost | Date | IDRef | boolean | Array<Attachment | File> | number | Array<IDRef>): ContactData {
    const contactData = JSON.parse(JSON.stringify(getContactData())) as ContactData

    switch (fieldName) {
      case 'name':
        contactData.fullName = newValue as string
        break
      case 'title':
        contactData.title = newValue as string
        break
      case 'email':
        contactData.email = newValue as string
        break
      case 'phone':
        contactData.phoneObject = newValue ? mapStringToPhone(newValue as string) : undefined
        break
      case 'url':
        contactData.url = newValue as string
        break
      case 'note':
        contactData.note = newValue as string
        break
      case 'address':
        contactData.address = newValue as Address
        break
      case 'attachments':
        contactData.attachments = newValue as Array<Attachment | File>
        break
      case 'role':
        contactData.role = newValue as string
        break
      case 'level':
        contactData.level = newValue as string
        break
      case 'rate':
        contactData.rate = newValue as Cost
        break
      case 'startDate':
        contactData.startDate = newValue as Date
        break
      case 'endDate':
        contactData.endDate = newValue as Date
        break
      case 'backgroundCheck':
        contactData.requireBackgroundCheck = newValue as boolean
        break
      case 'uom':
        contactData.uom = newValue as IDRef
        break
      case 'percentageOfShare':
        contactData.sharePercentage = newValue as number
        break
      case 'country':
        contactData.address = mapIDRefToAddress(newValue as IDRef)
        break
      case 'locations':
        contactData.locations = Array.isArray(newValue) ? newValue.map(mapIDRef) : []
        break
      case 'service':
        contactData.service = newValue as string
        break
      case 'operationLocation':
        contactData.operationLocation = mapIDRefToAddress(newValue as IDRef)
        break
    }

    return contactData
  }

  function handleFieldValueChange(
    fieldName: string,
    newValue: string | Option | Address | Cost | Date | IDRef | boolean | Array<Attachment | File> | number | Array<IDRef>,
    file?: Attachment | File,
    attachmentName?: string
  ) {
    if (props.onChange) {
      props.onChange(
        getContactDataWithUpdatedValue(fieldName, newValue),
        file,
        attachmentName
      )
    }
  }

  function triggerDateRangeValidation () {
    setForceValidateDateRange(true)
    setTimeout(() => {
      setForceValidateDateRange(false)
    }, 500)
  }
  function validateEndDate (endDate: Date): string {
    return (props.forceValidate || forcedValidation || endDateTouched) && (
      (isFieldMandatory(ContactFields.endDate) && dateValidator(endDate)) ||
      (startDate !== null && endDate !== null ? validateDateOrdering(convertDateToString(startDate), convertDateToString(endDate)) : '')
    )
  }

  function getSelectedOption (currentRole: string): Option {
    return props.roleOptions?.find(option => option.path === currentRole)
  }

  return (
    <div className={classnames(style.contactBox, {[style.collapsed]:!isExpanded}, {[style.expanded]:isExpanded})}>
      {!props.hideTitle && <div className={style.title}>
        <div className={style.toggleSection} onClick={props.onToggleClick}>
        <div className={style.chevron}>
          { isExpanded
            ? <ChevronDown color={'var(--warm-neutral-shade-200)'} size={20} />
            : <ChevronRight color={'var(--warm-neutral-shade-200)'} size={20} />}
        </div>
        <div className={style.text}>{`${props.config.listItemPrefix || t('--contactControlComponent--.--contact--')} ${props.index || ''}`} {!isExpanded && name && <span className={style.name}>{name}</span>}</div>
        <div className={style.space} />
        </div>
        <div className={style.delete} onClick={props.onDeleteClick}>
          <Trash2 color={'var(--warm-neutral-shade-200)'} size={18} />
        </div>
      </div>}

      { isExpanded && <>
        {(isFieldVisible(ContactFields.title) || isFieldVisible(ContactFields.level)) && <div className={style.row}>
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.title)})}>
                <div className={style.label}>
                  {t('--contactControlComponent--.--name--')}
                </div>
                <TextControlNew
                  value={name}
                  config={{
                    optional: props.isSupplierView ? !isFieldMandatory(ContactFields.fullName) : false,
                    forceValidate: props.forceValidate
                  }}
                  onChange={(value) => {setName(value); handleFieldValueChange('name', value)}}
                  validator={value => stringValidator(value)}
                />
            </div>
          {isFieldVisible(ContactFields.title) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--title--')} {!isFieldMandatory(ContactFields.title) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={title}
                config={{
                  optional: !isFieldMandatory(ContactFields.title),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setTitle(value); handleFieldValueChange('title', value)}}
                validator={value => stringValidator(value)}
              />
            </div>}
        </div>}
        {(!isFieldVisible(ContactFields.title) && !isFieldVisible(ContactFields.level)) && <div className={style.row}>
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.role)})}>
                <div className={style.label}>
                  {t('--contactControlComponent--.--name--')}
                </div>
                <TextControlNew
                  value={name}
                  config={{
                    optional: props.isSupplierView ? !isFieldMandatory(ContactFields.fullName) : false,
                    forceValidate: props.forceValidate
                  }}
                  onChange={(value) => {setName(value); handleFieldValueChange('name', value)}}
                  validator={value => stringValidator(value)}
                />
            </div>
            {isFieldVisible(ContactFields.role) && !props.isSupplierView &&
            <div className={classnames(style.col50)}>
              <div className={style.label}>
                {t('--contactControlComponent--.--role--')} {!isFieldMandatory(ContactFields.role) && <span className={style.optional}>({ t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={role}
                config={{
                  optional: !isFieldMandatory(ContactFields.role),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setRole(value); handleFieldValueChange('role', value)}}
                validator={value => stringValidator(value)}
              />
            </div>}
            {isFieldVisible(ContactFields.role) && props.isSupplierView &&
              <div className={classnames(style.col50)}>
                <div className={style.label}>
                  {t('--contactControlComponent--.--role--')} {!isFieldMandatory(ContactFields.role) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
                </div>
                <TypeAhead
                  placeholder={t('--contactControlComponent--.--select--')}
                  value={getSelectedOption(role)}
                  disabled={isFieldReadonly(ContactFields.role)}
                  options={props.roleOptions}
                  required={isFieldMandatory(ContactFields.role)}
                  forceValidate={props.forceValidate}
                  validator={(value) =>  (isFieldMandatory(ContactFields.role) && isEmpty(value))
                    ? getI18ControlText('--validationMessages--.--fieldRequired--')
                    : ''}
                  onChange={(value) => {setRole(value?.path); handleFieldValueChange('role', value?.path)}}
                />
              </div>}
        </div>}
        {(isFieldVisible(ContactFields.email) || isFieldVisible(ContactFields.phone)) && <div className={style.row}>
          {isFieldVisible(ContactFields.email) &&
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.phone)})}>
              <div className={style.label}>
                { t('--contactControlComponent--.--email--')} {!isFieldMandatory(ContactFields.email) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={email}
                config={{
                  optional: !isFieldMandatory(ContactFields.email),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setEmail(value); handleFieldValueChange('email', value)}}
                validator={value => emailValidator(value)}
              />
          </div>}
          {isFieldVisible(ContactFields.phone) &&
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.email)})}>
              <div className={style.label}>
                {t('--contactControlComponent--.--phoneNumber--')} {!isFieldMandatory(ContactFields.phone) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <OROPhoneInputNew
                value={phone}
                config={{
                  optional: !isFieldMandatory(ContactFields.phone),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setPhone(value); handleFieldValueChange('phone', value)}}
                validator={value => phoneValidator(value)}
              />
            </div>}
        </div>}

        {(isFieldVisible(ContactFields.role) || isFieldVisible(ContactFields.level)) && (isFieldVisible(ContactFields.title) || isFieldVisible(ContactFields.level)) && <div className={style.row}>
          {isFieldVisible(ContactFields.role) && !props.isSupplierView &&
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.level)})}>
              <div className={style.label}>
                {t('--contactControlComponent--.--role--')} {!isFieldMandatory(ContactFields.role) && <span className={style.optional}>({ t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={role}
                config={{
                  optional: !isFieldMandatory(ContactFields.role),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setRole(value); handleFieldValueChange('role', value)}}
                validator={value => stringValidator(value)}
              />
            </div>}
          {isFieldVisible(ContactFields.role) && props.isSupplierView &&
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.level)})}>
              <div className={style.label}>
                {t('--contactControlComponent--.--role--')} {!isFieldMandatory(ContactFields.role) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TypeAhead
                placeholder={t('--contactControlComponent--.--select--')}
                value={getSelectedOption(role)}
                disabled={isFieldReadonly(ContactFields.role)}
                options={props.roleOptions}
                required={isFieldMandatory(ContactFields.role)}
                forceValidate={props.forceValidate}
                validator={(value) =>  (isFieldMandatory(ContactFields.role) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => {setRole(value?.path); handleFieldValueChange('role', value?.path)}}
              />
            </div>}
          {isFieldVisible(ContactFields.level) &&
            <div className={classnames(style.col, {[style.col50]: isFieldVisible(ContactFields.role)})}>
              <div className={style.label}>
                {t('--contactControlComponent--.--level--')} {!isFieldMandatory(ContactFields.level) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={level}
                config={{
                  optional: !isFieldMandatory(ContactFields.level),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setLevel(value); handleFieldValueChange('level', value)}}
                validator={value => stringValidator(value)}
              />
          </div>}
        </div>}


        {(isFieldVisible(ContactFields.startDate) || isFieldVisible(ContactFields.endDate)) && <div className={style.row}>
          {isFieldVisible(ContactFields.startDate) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--startDate--')} {!isFieldMandatory(ContactFields.startDate) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <DateControlNew
                config={{
                  // optional: !isFieldMandatory(ContactFields.startDate),
                  forceValidate: props.forceValidate
                }}
                placeholder={t('--contactControlComponent--.--startDate--')}
                value={startDate}
                onChange={(value) => {setStartDate(getDateObject(value)); handleFieldValueChange('startDate', value)}}
                validator={(value) => {triggerDateRangeValidation(); return isFieldMandatory(ContactFields.startDate) && dateValidator(value)}}
              />
            </div>}
            {isFieldVisible(ContactFields.endDate) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--endDate--')} {!isFieldMandatory(ContactFields.endDate) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <DateControlNew
                config={{
                  // optional: !isFieldMandatory(ContactFields.endDate),
                  forceValidate: props.forceValidate || forceValidateDateRange
                }}
                placeholder={t('--contactControlComponent--.--endDate--')}
                value={endDate}
                onChange={(value) => {setEndDate(getDateObject(value)); handleFieldValueChange('endDate', value); setEndDateTouched(true)}}
                validator={validateEndDate}
              />
            </div>}
          </div>}

        {(isFieldVisible(ContactFields.rate) || isFieldVisible(ContactFields.uom)) &&
          <div className={style.row}>
              {isFieldVisible(ContactFields.rate) && <div className={style.col50}>
                <div className={style.label}>
                  {t('--contactControlComponent--.--rate--')} {!isFieldMandatory(ContactFields.rate) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
                </div>
                <MoneyControlNew
                  value={rate || { amount: '', currency: props.defaultCurrency || DEFAULT_CURRENCY }}
                  config={{
                    optional: !isFieldMandatory(ContactFields.rate),
                    forceValidate: props.forceValidate

                  }}
                  locale={props.locale}
                  additionalOptions={{
                    currency: props.currencyOptions,
                    defaultCurrency: props.defaultCurrency
                  }}
                  onChange={(value) => {setRate(value); handleFieldValueChange('rate', value)}}
                  validator={value => costValidator(value)}
                />
              </div>}
              {isFieldVisible(ContactFields.uom) && <div className={style.col50}>
                <div className={style.label}>
                  {t('--contactControlComponent--.--unit--')} {!isFieldMandatory(ContactFields.uom) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
                </div>
                <TypeAhead
                  placeholder={t('--contactControlComponent--.--unitOfMeasure--')}
                  value={mapIDRefToOption(uom)}
                  disabled={isFieldReadonly(ContactFields.uom)}
                  options={props.uomOptions}
                  required={isFieldMandatory(ContactFields.uom)}
                  forceValidate={props.forceValidate}
                  validator={(value) =>  (isFieldMandatory(ContactFields.uom) && isEmpty(value))
                    ? getI18ControlText('--validationMessages--.--fieldRequired--')
                    : ''}
                  onChange={(value) => {setUOM(mapOptionToIDRef(value)); handleFieldValueChange('uom', mapOptionToIDRef(value))}}
                />
              </div>}
        </div>}

        <div className={style.row}>
          {isFieldVisible(ContactFields.country) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--country--')} {!isFieldMandatory(ContactFields.country) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TypeAhead
                placeholder={t('--contactControlComponent--.--select--')}
                value={mapIDRefToOption(country)}
                disabled={isFieldReadonly(ContactFields.country)}
                options={props.countryOptions}
                required={isFieldMandatory(ContactFields.country)}
                forceValidate={props.forceValidate}
                validator={(value) =>  (isFieldMandatory(ContactFields.country) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => {setCountry(mapOptionToIDRef(value)); handleFieldValueChange('country', mapOptionToIDRef(value))}}
              />
            </div>}
          {isFieldVisible(ContactFields.locations) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--locations--')} {!isFieldMandatory(ContactFields.locations) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <MultiSelect
                placeholder={t('--contactControlComponent--.--select--')}
                value={locations?.map(mapIDRefToOption) || []}
                disabled={isFieldReadonly(ContactFields.locations)}
                options={props.locationOptions}

                required={isFieldMandatory(ContactFields.locations)}
                forceValidate={props.forceValidate}
                validator={(value) =>  (isFieldMandatory(ContactFields.locations) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => {setLocations(value.map(mapOptionToIDRef)); handleFieldValueChange('locations', value.map(mapOptionToIDRef))}}
              />
            </div>}
          {props.isSupplierView && isFieldVisible(ContactFields.service) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--serviceProvided--')} {!isFieldMandatory(ContactFields.service) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={service}
                config={{
                  optional: !isFieldMandatory(ContactFields.service),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setService(value); handleFieldValueChange('service', value)}}
                validator={value => stringValidator(value)}
              />
            </div>}
          {props.isSupplierView && isFieldVisible(ContactFields.countryOfOperation) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--countryOfOperation--')} {!isFieldMandatory(ContactFields.countryOfOperation) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TypeAhead
                placeholder={t('--contactControlComponent--.--select--')}
                value={mapIDRefToOption(countryOfOperation)}
                disabled={isFieldReadonly(ContactFields.countryOfOperation)}
                options={props.countryOptions}
                required={isFieldMandatory(ContactFields.countryOfOperation)}
                forceValidate={props.forceValidate}
                validator={(value) =>  (isFieldMandatory(ContactFields.countryOfOperation) && isEmpty(value))
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : ''}
                onChange={(value) => {setCountryOfOperation(mapOptionToIDRef(value)); handleFieldValueChange('operationLocation', mapOptionToIDRef(value))}}
              />
            </div>}
          {isFieldVisible(ContactFields.percentageOfShare) &&
            <div className={style.col50}>
              <div className={style.label}>
                {t('--contactControlComponent--.--percentageOfOwnership--')} {!isFieldMandatory(ContactFields.percentageOfShare) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <NumberBox
                placeholder={t('--contactControlComponent--.--enter--')}
                value={sharePercentage?.toString()}
                required={false}
                forceValidate={props.forceValidate}
                validator={(value) => isFieldMandatory(ContactFields.percentageOfShare) && isEmpty(value)
                  ? getI18ControlText('--validationMessages--.--fieldRequired--')
                  : value && numberValidator(value, {...props.config, numberConfig: {min: props.config?.minOwnershipPercentage, max: 0}})
                    ? getI18ControlText('--validationMessages--.--ownershipShouldBeAboveMinimum--', { min: props.config?.minOwnershipPercentage || 0 })
                    : ''}
                onChange={(value) => {setSharePercentage(Number(value)); handleFieldValueChange('percentageOfShare', Number(value))}}
              />
            </div>}
        </div>
        {isFieldVisible(ContactFields.address) &&
          <div className={style.row}>
            <div className={style.col}>
              <div className={style.label}>
                {t('--contactControlComponent--.--address--')} {!isFieldMandatory(ContactFields.address) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <SingleAddressControlNew
                id={`${props.id}-contact-${props.index}-address`}
                value={address}
                config={{
                  optional: !isFieldMandatory(ContactFields.address),
                  forceValidate: props.forceValidate,
                  noPadding: true
                }}
                additionalOptions={{
                  country: props.countryOptions
                }}
                dataFetchers={{
                  getParsedAddress: props.getParsedAddress
                }}
                onChange={(value) => {setAddress(value); handleFieldValueChange('address', value)}}
                validator={value => addressValidator(value)}
              />
            </div>
        </div>}
        {isFieldVisible(ContactFields.url) && <div className={style.row}>
            <div className={style.col}>
              <div className={style.label}>
                {t('--contactControlComponent--.--profileUrl--')} {!isFieldMandatory(ContactFields.url) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextControlNew
                value={url}
                placeholder={t('--contactControlComponent--.--addURLForAnySocialProfiles--')}
                config={{
                  optional: !isFieldMandatory(ContactFields.url),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setUrl(value); handleFieldValueChange('url', value)}}
                validator={value => stringValidator(value)}
              />
            </div>
        </div>}
        { isFieldVisible(ContactFields.backgroundCheck) &&
          <div className={style.row}>
            <div className={style.col}>
              <FormControlLabel
                control={
                <Checkbox
                  checked={backgroundCheck}
                  onChange={e => { setBackgroundCheck(e.target.checked); handleFieldValueChange('backgroundCheck', e.target.checked) }}
                  color="success"
                />}
                label={t('--contactControlComponent--.--requiresbackgroundCheck--')}
                sx={{
                  '& .MuiCheckbox-root' : {
                    color: 'var(--warm-neutral-shade-100)',
                    padding: '0px',
                    borderRadius:'0px',
                    '&:hover': {
                      background: 'var(--warm-prime-chalk)'
                    },
                    height: '15px',
                    width: '15px'
                  },
                  '&,MuiFormControlLabel-root' : {
                    marginLeft:'0px',
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: 'var(--warm-neutral-shade-500)',
                    marginLeft: '8px'
                  },
                  '& .Mui-checked': {
                    'color': 'var(--warm-stat-mint-mid) !important'
                  }
                }}
              />
            </div>
        </div>}
        {(isFieldVisible(ContactFields.note) || isFieldVisible(ContactFields.address) || isFieldVisible(ContactFields.attachments)) &&
          <div className={style.dashed}></div>}
        { isFieldVisible(ContactFields.note) &&
          <div className={style.row}>
            <div className={style.col}>
              <div className={style.label}>
                {t('--contactControlComponent--.--note--')} {!isFieldMandatory(ContactFields.note) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <TextAreaControlNew
                value={note}
                config={{
                  optional: !isFieldMandatory(ContactFields.note),
                  forceValidate: props.forceValidate
                }}
                onChange={(value) => {setNote(value); handleFieldValueChange('note', value)}}
                validator={value => stringValidator(value)}
              />
            </div>
          </div>}
        {isFieldVisible(ContactFields.attachments) &&
          <div className={style.row}>
            <div className={style.col}>
              <div className={style.label}>
                {t('--contactControlComponent--.--attachments--')} {!isFieldMandatory(ContactFields.attachments) && <span className={style.optional}>({t('--contactControlComponent--.--optional--')})</span>}
              </div>
              <AttachmentsControlNew
                value={attachments}
                config={{
                  optional: !isFieldMandatory(ContactFields.attachments),
                  forceValidate: props.forceValidate,
                  fieldName: props.fieldName + '.attachments'
                }}
                dataFetchers={{
                  getDocumentByName: props.getDocumentByName
                }}
                onChange={(value, file, attachmentName) => {setAttachments(value); handleFieldValueChange('attachments', value, file, attachmentName)}}
                validator={value => attachmentListValidator(value)}
              />
            </div>
          </div>}
        </>}
    </div>
  )
}

interface ContactControlPropsNew {
  id?: string
  value?: Array<ContactData>,
  name?: string,
  disabled?: boolean,
  readOnly?: boolean,
  config: {
    isReadOnly?: boolean
    optional?: boolean
    forceValidate?: boolean
    contactConfig?: ContactConfig,
    fieldName?: string,
    locale: string
    isSupplierView?: boolean
  }
  additionalOptions: {
    country?: Option[]
    locations?: Option[]
    currency?: Option[]
    uom?: Option[]
    defaultCurrency?: string
    roles?: Option[]
  }
  dataFetchers: {
    getParsedAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>,
    getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  }
  validator?: (value?) => string | null
  onChange?: (value: Array<ContactData>, file?: Attachment | File, attachmentName?: string) => void
}

export function ContactControl (props: ContactControlPropsNew) {
  const [contacts, setContacts] = useState<Array<ContactData>>([])
  const [expandedContacts, setExpandedContacts] = useState<{[key: string]: boolean}>({})
  const [error, setError] = useState<string>()
  const { t } = useTranslationHook()

  useEffect(() => {
    setContacts((Array.isArray(props.value) && props.value.length > 0) ? props.value : [getEmptyContact()])
    if (!(Array.isArray(props.value) && props.value.length > 0)) {
      setExpandedContacts({ 0: true })
    }
  }, [props.value])

  function triggerValidation (contacts: ContactData[]) {
      if (props.config.contactConfig.miniumSize && (!contacts || contacts.length < props.config.contactConfig.miniumSize)) {
        setError(getI18ControlText('--validationMessages--.--atLeastMinimumRequired--', { min: props.config.contactConfig.miniumSize || 0 }))
      } else if (props.validator) {
        const err = props.validator(contacts)
        setError(err)
      } else {
        setError('')
      }
  }

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly) {
      triggerValidation(contacts)
    }
  }, [props.config])

  function addNewContact () {
    const contactsCopy = [...contacts, getEmptyContact()]
    setContacts(contactsCopy)

    if (props.onChange) {
      props.onChange(contactsCopy)
    }

    setExpandedContacts({[contactsCopy.length - 1]: true})
  }

  function deleteContactAt (index: number) {
    const contactsCopy = [...contacts]
    contactsCopy.splice(index, 1)
    setContacts(contactsCopy)
    triggerValidation(contactsCopy)

    if (props.onChange) {
      props.onChange(contactsCopy)
    }
  }

  function handleContactChange (index: number, value: ContactData, file?: Attachment | File, attachmentName?: string) {
    const contactsCopy = [...contacts]
    contactsCopy[index] = value
    setContacts(contactsCopy)

    if (props.onChange) {
      props.onChange(contactsCopy, file, attachmentName)
    }
  }

  return (
    <div className={style.contactControl}>
      { contacts.map((contact, i) =>
        <ContactBox
          data={contact}
          id={props.id}
          index={i+1}
          fieldName={`${props.config.fieldName}[${i}]`}
          locale={props.config.locale}
          isExpanded={expandedContacts[i]}
          isSupplierView={props.config.isSupplierView}
          config={props.config.contactConfig}
          countryOptions={props.additionalOptions.country}
          locationOptions={props.additionalOptions.locations}
          currencyOptions={props.additionalOptions.currency}
          defaultCurrency={props.additionalOptions.defaultCurrency}
          uomOptions={props.additionalOptions.uom}
          roleOptions={props.additionalOptions.roles}
          forceValidate={props.config.forceValidate && !props.config.optional && !props.config.isReadOnly}
          getParsedAddress={props.dataFetchers.getParsedAddress}
          getDocumentByName={props.dataFetchers.getDocumentByName}
          onChange={(value, file, attachmentName) => handleContactChange(i, value, file, attachmentName)}
          onDeleteClick={() => deleteContactAt(i)}
          onToggleClick={() => setExpandedContacts({...expandedContacts, [i]: !expandedContacts[i]})}
          key={i}
        />)}

      <div className={style.addBtn} onClick={addNewContact}>
        <div className={style.label}>
          <Plus color={'var(--warm-neutral-shade-200)'} size={18} strokeWidth={'2px'} />
          <div className={style.text}>
            {getI18ControlText('--fieldTypes--.--contact--.--addContact--', { contactLabel: props.config.contactConfig.listItemPrefix || getI18ControlText('--fieldTypes--.--contact--.--contact--') })}
          </div>
        </div>
      </div>

      { error &&
        <div className={style.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}

interface SingleContactControlPropsNew {
  id?: string
  value?: ContactData,
  name?: string,
  disabled?: boolean,
  readOnly?: boolean,
  config: {
    isReadOnly?: boolean
    optional?: boolean
    forceValidate?: boolean
    contactConfig?: ContactConfig,
    fieldName?: string
  }
  additionalOptions: {
    country?: Option[]
    locations?: Option[]
    currency?: Option[]
    uom?: Option[]
    defaultCurrency?: string
  }
  dataFetchers: {
    getParsedAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>,
    getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  }
  validator?: (value?) => string | null
  onChange?: (value: ContactData, file?: Attachment | File, attachmentName?: string) => void
}

export function SingleContactControl (props: SingleContactControlPropsNew) {
  const [contact, setContact] = useState<ContactData | null>(null)
  const [error, setError] = useState<string>()

  useEffect(() => {
    setContact(props.value ? props.value : getEmptyContact())
  }, [props.value])

  function triggerValidation (contact: ContactData) {
      if (props.validator) {
        const err = props.validator(contact)
        setError(err)
      } else {
        setError('')
      }
  }

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly) {
    triggerValidation(contact)
    }
  }, [props.config])

  function handleContactChange (index: number, value: ContactData, file?: Attachment | File, attachmentName?: string) {
    setContact(value)
    triggerValidation(value)

    if (props.onChange) {
      props.onChange(value, file, attachmentName)
    }
  }

  return (
    <div className={style.contactControl}>
      { contact &&
        <ContactBox
          data={contact}
          id={props.id}
          index={1}
          fieldName={props.config.fieldName}
          locale={getSessionLocale()}
          isExpanded
          hideTitle
          config={props.config.contactConfig}
          countryOptions={props.additionalOptions.country}
          locationOptions={props.additionalOptions.locations}
          currencyOptions={props.additionalOptions.currency}
          defaultCurrency={props.additionalOptions.defaultCurrency}
          uomOptions={props.additionalOptions.uom}
          forceValidate={props.config.forceValidate && !props.config.optional && !props.config.isReadOnly}
          getParsedAddress={props.dataFetchers.getParsedAddress}
          getDocumentByName={props.dataFetchers.getDocumentByName}
          onChange={(value, file, attachmentName) => handleContactChange(0, value, file, attachmentName)}
        />}

      { error &&
        <div className={style.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
