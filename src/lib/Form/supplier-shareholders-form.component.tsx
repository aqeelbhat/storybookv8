import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { Attachment, Field, LocalLabels, NormalizedVendorRef, Option, mapContact } from '..'
import { ContactData, ProcessVariables } from '../Types'
import { ContactConfig, contactListValidator } from '../CustomFormDefinition'
import { ContactFields } from '../CustomFormDefinition/types/CustomFormModel'
import Actions from '../controls/actions';
import styles from './supplier-shareholders-form-styles.module.scss'
import { Separator } from '../controls/atoms';
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { getCustomLabelForField, getFormFieldsMap, isOmitted, isRequired } from './util';
import { ShareHolderTable } from './components/shareholder-table.component';

export interface SupplierShareholderFormData {
  normalizedVendorRefs: NormalizedVendorRef[]
}

export enum ContactType {
  shareHolders = 'shareHolders',
  subsidiaries = 'subsidiaries',
  contractors = 'contractors',
  boardOfDirectors = 'boardOfDirectors'
}

export enum enumShareHolderFields {
  minimumPercentageOwnership = 'minimumPercentageOwnership',
  shareHolderInformation = 'shareHolderInformation',
  keySubsidiariesAndJointVentureInformation = 'keySubsidiariesAndJointVentureInformation',
  subContractorInformation = 'subContractorInformation',
  boardOfDirectorsInformation = 'boardOfDirectorsInformation'
}

export interface SupplierShareholdersFormProps {
  formData?: SupplierShareholderFormData
  fields?: Field[]
  countryOption?: Option[]
  roleOption?: Option[]
  processVariables?: ProcessVariables
  submitLabel?: string
  cancelLabel?: string
  onValueChange?: (fieldName: string, formData: SupplierShareholderFormData) => void
  onSubmit?: (formData: SupplierShareholderFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => SupplierShareholderFormData) => void
}

function getFields (value: string[]) {
  const fieldKeys = Object.keys(ContactFields).filter(val => value.includes(ContactFields[val]))
  return fieldKeys as ContactFields[]
}

export function getColumnName (type: ContactType, t: (key: string, defaultValue: string) => string) {
  switch(type) {
    case ContactType.shareHolders:
      return [{id: 'legalName', name: t('--column--.--name--', 'Name / Legal Name')}, {id: 'ownership', name: t('--column--.--percentage--', '% Owned')}, {id:'shareHolderCountry', name: t('--column--.--country--', 'Country')}]
    case ContactType.subsidiaries:
      return [{id: 'subsidariesName', name: t('--column--.--companyName--', 'Company name')}, {id: 'subsidiariesOwnership', name: t('--column--.--percentage--', '% Owned')}, {id:'subsidiariesCountry', name: t('--column--.--country--', 'Country')}]
    case ContactType.contractors:
      return [{id: 'contractorCompany', name: t('--column--.--companyName--', 'Company name')}, {id: 'services', name: t('--column--.--serviceProvided--', 'Service provided')}, {id: 'incorporationCountry', name: t('--column--.--countryOfIncorporation--', 'Country of incorporation')}, {id: 'operationCountry', name: t('--column--.--countryOfOperation--', 'Country of operation')}]
    case ContactType.boardOfDirectors:
      return [{id: 'boardMemberName', name: t('--column--.--boardMemberName--', 'Name of the directors / Board members')}, {id:'nationality', name: t('--column--.--country--', 'Country')}]
  }
}

export function getVisibleFields (type: ContactType) {
    const visibleFields = getFields([ContactFields.fullName, ContactFields.percentageOfShare, ContactFields.country])

    switch(type) {
      case ContactType.shareHolders:
        return visibleFields
      case ContactType.subsidiaries:
        return getFields([ContactFields.fullName, ContactFields.country, ContactFields.percentageOfShare])
      case ContactType.contractors:
        return getFields([ContactFields.fullName, ContactFields.service, ContactFields.country, ContactFields.countryOfOperation])
      case ContactType.boardOfDirectors:
        return getFields([ContactFields.fullName, ContactFields.country])
      default:
        return visibleFields
    }
}

export function ShareHolderForm (props: SupplierShareholdersFormProps) {
    const [supplierContact, setSupplierContact] = useState<NormalizedVendorRef[]>([])
    const [countryOptions, setCountryOptions] = useState<Option[]>([])
    const [roleOptions, setRoleOptions] = useState<Option[]>([])
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [minOwnershipPercentage, setMinOwnershipPercentage] = useState<number>()
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SHAREHOLDERFORM])

    useEffect(() => {
      if (props.formData) {
        setSupplierContact(props.formData.normalizedVendorRefs)
      }
    }, [props.formData])

    useEffect(() => {
      if (props.fields) {
        const fieldList = [enumShareHolderFields.minimumPercentageOwnership, enumShareHolderFields.shareHolderInformation,
          enumShareHolderFields.keySubsidiariesAndJointVentureInformation, enumShareHolderFields.subContractorInformation,
          enumShareHolderFields.boardOfDirectorsInformation
        ]
        const _fieldMap = getFormFieldsMap(props.fields, fieldList)
        setFieldMap(_fieldMap)
        setMinOwnershipPercentage(_fieldMap[enumShareHolderFields.minimumPercentageOwnership]?.intValue)
      }
    }, [props.fields])

    useEffect(() => {
       setCountryOptions(props.countryOption)
    }, [props.countryOption])

    useEffect(() => {
        setRoleOptions(props.roleOption)
    }, [props.roleOption])

    function getMandatoryField (type: ContactType) {
      let _field: Field = null
        switch(type) {
            case ContactType.shareHolders:
              _field = fieldMap[enumShareHolderFields.shareHolderInformation]
              return isRequired(_field) ? getFields([ContactFields.fullName, ContactFields.country, ContactFields.percentageOfShare]) : []
            case ContactType.subsidiaries:
              _field = fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]
              return isRequired(_field) ? getFields([ContactFields.fullName, ContactFields.country, ContactFields.percentageOfShare]) : []
            case ContactType.contractors:
              _field = fieldMap[enumShareHolderFields.subContractorInformation]
              return isRequired(_field) ? getFields([ContactFields.fullName, ContactFields.service, ContactFields.country, ContactFields.countryOfOperation]) : []
            case ContactType.boardOfDirectors:
              _field = fieldMap[enumShareHolderFields.boardOfDirectorsInformation]
              return isRequired(_field) ? getFields([ContactFields.fullName, ContactFields.country]) : []
        }
    }

    function getPrefix (type: ContactType) {
        switch (type) {
            case ContactType.shareHolders:
              return t('--shareHolders--')
            case ContactType.subsidiaries:
              return t('--keySubsidiaries--')
            case ContactType.contractors:
              return t('--subcontractorCompanies--')
            case ContactType.boardOfDirectors:
              return t('--boardOfDirectors--')
        }
    }

    function getMinimumSize (type: ContactType) {
      let _field: Field = null
        switch(type) {
            case ContactType.shareHolders:
              _field = fieldMap[enumShareHolderFields.shareHolderInformation]
              return isRequired(_field) ? 1 : 0
            case ContactType.subsidiaries:
              _field = fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]
              return isRequired(_field) ? 1 : 0
            case ContactType.contractors:
              _field = fieldMap[enumShareHolderFields.subContractorInformation]
              return isRequired(_field) ? 1 : 0
            case ContactType.boardOfDirectors:
              _field = fieldMap[enumShareHolderFields.boardOfDirectorsInformation]
              return isRequired(_field) ? 1 : 0
        }
    }

    function getContactFieldConfig (type?: ContactType) {
        const visibleFields = getVisibleFields(type)
        const mandatoryFields = getMandatoryField(type)
        const minimumSize = getMinimumSize(type)
        const contactConfig: ContactConfig = {
            miniumSize: minimumSize,
            listItemPrefix: getPrefix(type),
            mandatoryFields: mandatoryFields,
            visibleFields: visibleFields,
            minOwnershipPercentage: minOwnershipPercentage
        }

        return contactConfig
    }

    function getFormData (): SupplierShareholderFormData {
      return {
        normalizedVendorRefs: supplierContact
      }
    }

    function getFormDataWithUpdatedValue (fieldName: string, newValue: Array<Attachment | File> | Array<NormalizedVendorRef>): SupplierShareholderFormData {
      const formData = JSON.parse(JSON.stringify(getFormData())) as SupplierShareholderFormData

      switch (fieldName) {
        case 'supplierContact':
          formData.normalizedVendorRefs = newValue as NormalizedVendorRef[]
          break
      }

      return formData
    }

    function triggerValidations (invalidFieldId: string) {
      setForceValidate(true)
      setTimeout(() => {
        setForceValidate(false)
      }, 1000)

      const input = document.getElementById(invalidFieldId)
      if (input?.scrollIntoView) {
        input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      }
    }

    function isFormInvalid (): string {
      let invalidFieldId = ''
      const invalidFound = Object.keys(ContactType).some(type => {
        let _field: Field = null
          switch (type) {
              case ContactType.shareHolders:
                _field = fieldMap[enumShareHolderFields.shareHolderInformation]
                const allContacts = supplierContact.reduce((contact, obj) => contact.concat(obj.shareHolders), []);
                invalidFieldId = 'shareHolderList'
              return isRequired(_field) && props.processVariables?.assessOwnership !== false ? contactListValidator(allContacts, {contactConfig: getContactFieldConfig(ContactType.shareHolders)}) : ''
              case ContactType.subsidiaries:
                _field = fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]
                const subsidiaries = supplierContact.reduce((contact, obj) => contact.concat(obj.subsidiaries), []);
                invalidFieldId = 'subsidiariesList'
              return isRequired(_field) && props.processVariables?.assessSubsidiary !== false ? contactListValidator(subsidiaries, {contactConfig: getContactFieldConfig(ContactType.subsidiaries)}) : ''
              case ContactType.contractors:
                _field = fieldMap[enumShareHolderFields.subContractorInformation]
                const contractors = supplierContact.reduce((contact, obj) => contact.concat(obj.subcontractors), []);
                invalidFieldId = 'contractorList'
              return isRequired(_field) && props.processVariables?.assessSubcontractors !== false ? contactListValidator(contractors, {contactConfig: getContactFieldConfig(ContactType.contractors)}) : ''
              case ContactType.boardOfDirectors:
                _field = fieldMap[enumShareHolderFields.boardOfDirectorsInformation]
                const boardMembers = supplierContact.reduce((contact, obj) => contact.concat(obj.boardOfDirectors), []);
                invalidFieldId = 'boardMembersList'
              return isRequired(_field) && props.processVariables?.assessBoardOfDirectors !== false ? contactListValidator(boardMembers, {contactConfig: getContactFieldConfig(ContactType.boardOfDirectors)}) : ''
          }
      })

      return invalidFound ? invalidFieldId : ''
    }

    function fetchData (skipValidation?: boolean): SupplierShareholderFormData {
      if (skipValidation) {
        return getFormData()
      } else {
        const invalidFieldId = isFormInvalid()
        if (invalidFieldId) {
            triggerValidations(invalidFieldId)
        }
        return invalidFieldId ? null : getFormData()
      }
    }

    useEffect(() => {
      if (props.onReady) {
        props.onReady(fetchData)
      }
    }, [props.fields, fieldMap, supplierContact])

    function handleOnChange (data: ContactData[], index: number, type: ContactType) {
      const updatedContact = supplierContact.map((contactObj, contactIndex) => {
        if (contactIndex === index) {
           if (type === ContactType.shareHolders) {
            contactObj.shareHolders = data.map(mapContact)
           }
           if (type === ContactType.subsidiaries) {
            contactObj.subsidiaries = data.map(mapContact)
           }
           if (type === ContactType.contractors) {
            contactObj.subcontractors = data.map(mapContact)
           }
           if (type === ContactType.boardOfDirectors) {
            contactObj.boardOfDirectors = data.map(mapContact)
           }
        }
        return contactObj
      })
      setSupplierContact(updatedContact)

      if (props.onValueChange) {
        props.onValueChange('supplierContact',getFormDataWithUpdatedValue('supplierContact', data))
      }
    }

    function handleFormCancel () {
        if (props.onCancel) {
          props.onCancel()
        }
    }

    function handleFormSubmit () {
        const invalidFieldId = isFormInvalid()

        if (invalidFieldId) {
          triggerValidations(invalidFieldId)
        } else if (props.onSubmit) {
          props.onSubmit(getFormData())
        }
    }

    return ( <div className={styles.shareHolderDetails}>
        {props.processVariables?.assessOwnership !== false && !isOmitted(fieldMap[enumShareHolderFields.shareHolderInformation]) && <>
          <Grid container spacing={2} pb={2}>
            <Grid item xs={12}>
               <div className={styles.title}>
                {getCustomLabelForField(fieldMap[enumShareHolderFields.shareHolderInformation]) || t('--shareHoldersTitle--')}
                {!isRequired(fieldMap[enumShareHolderFields.shareHolderInformation]) && <span className={styles.optional}>({t('--optional--')})</span>}
               </div>
               <div className={styles.subTitle}>
                {minOwnershipPercentage ? t('--shareHolderSubTitle--', {ownership: minOwnershipPercentage}) : t('--shareHolderDefaultSubTitle--')}
               </div>
            </Grid>
            <Grid item xs={12}>
            { supplierContact.map((contact, i) =>
                <ShareHolderTable key={i}
                  id={enumShareHolderFields.shareHolderInformation}
                  value={contact?.shareHolders?.map(mapContact)}
                  columns={getColumnName(ContactType.shareHolders, t)}
                  visibleFields={getVisibleFields(ContactType.shareHolders)}
                  requiredFields={getMandatoryField(ContactType.shareHolders)}
                  isRequired={isRequired(fieldMap[enumShareHolderFields.shareHolderInformation])}
                  forceValidate={forceValidate}
                  minOwnershipPercentage={minOwnershipPercentage}
                  countryOption={countryOptions}
                  roleOption={roleOptions}
                  t={t}
                  validator={(value) => isRequired(fieldMap[enumShareHolderFields.shareHolderInformation]) ? contactListValidator(value, {contactConfig: getContactFieldConfig(ContactType.shareHolders)}) : undefined}
                  onChange={(value) => handleOnChange(value, i, ContactType.shareHolders)}
                />
            )}
            </Grid>
        </Grid>
        <Separator/></>}

        {props.processVariables?.assessSubsidiary !== false && !isOmitted(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]) && <>
          <Grid container spacing={2} pb={2}>
            <Grid item xs={12}>
              <div className={styles.title}>
                {getCustomLabelForField(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]) || t('--keySubsidiaries--')}
                { !isRequired(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]) && <span className={styles.optional}>({t('--optional--')})</span>}
              </div>
              <div className={styles.subTitle}>
                {t('--keySubsidiariesSubTitle--')}
               </div>
            </Grid>
            <Grid item xs={12}>
            { supplierContact.map((contact, i) =>
              <ShareHolderTable key={i}
                id={enumShareHolderFields.keySubsidiariesAndJointVentureInformation}
                value={contact?.subsidiaries?.map(mapContact)}
                columns={getColumnName(ContactType.subsidiaries, t)}
                visibleFields={getVisibleFields(ContactType.subsidiaries)}
                requiredFields={getMandatoryField(ContactType.subsidiaries)}
                isRequired={isRequired(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation])}
                forceValidate={forceValidate}
                minOwnershipPercentage={minOwnershipPercentage}
                countryOption={countryOptions}
                roleOption={roleOptions}
                t={t}
                validator={(value) => isRequired(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]) ? contactListValidator(value, {contactConfig: getContactFieldConfig(ContactType.subsidiaries)}) : undefined}
                onChange={(value) => handleOnChange(value, i, ContactType.subsidiaries)}
              />
            )}
            </Grid>
        </Grid>
        <Separator/></>}

        {props.processVariables?.assessSubcontractors !== false && !isOmitted(fieldMap[enumShareHolderFields.subContractorInformation]) && <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={styles.title}>
                {getCustomLabelForField(fieldMap[enumShareHolderFields.subContractorInformation]) || t('--subcontractorCompanies--')}
                { !isRequired(fieldMap[enumShareHolderFields.subContractorInformation]) && <span className={styles.optional}>({t('--optional--')})</span>}
              </div>
              <div className={styles.subTitle}>
                {t('--subcontractorSubTitle--')}
               </div>
            </Grid>
            <Grid item xs={12}>
            { supplierContact.map((contact, i) =>
              <ShareHolderTable key={i}
                id={enumShareHolderFields.subContractorInformation}
                value={contact?.subcontractors?.map(mapContact)}
                columns={getColumnName(ContactType.contractors, t)}
                visibleFields={getVisibleFields(ContactType.contractors)}
                requiredFields={getMandatoryField(ContactType.contractors)}
                isRequired={isRequired(fieldMap[enumShareHolderFields.subContractorInformation])}
                forceValidate={forceValidate}
                minOwnershipPercentage={minOwnershipPercentage}
                countryOption={countryOptions}
                roleOption={roleOptions}
                t={t}
                validator={(value) => isRequired(fieldMap[enumShareHolderFields.subContractorInformation]) ? contactListValidator(value, {contactConfig: getContactFieldConfig(ContactType.contractors)}) : undefined}
                onChange={(value) => handleOnChange(value, i, ContactType.contractors)}
              />
            )}
            </Grid>
        </Grid>
        <Separator/></>}

        {props.processVariables?.assessBoardOfDirectors !== false && !isOmitted(fieldMap[enumShareHolderFields.boardOfDirectorsInformation]) && 
          <Grid container spacing={2} pb={2}>
            <Grid item xs={12}>
               <div className={styles.title}>
                {getCustomLabelForField(fieldMap[enumShareHolderFields.boardOfDirectorsInformation]) || t('--boardOfDirectors--')}
                {!isRequired(fieldMap[enumShareHolderFields.boardOfDirectorsInformation]) && <span className={styles.optional}>({t('--optional--')})</span>}
               </div>
            </Grid>
            <Grid item xs={12}>
            { supplierContact.map((contact, i) =>
                <ShareHolderTable key={i}
                  id={enumShareHolderFields.boardOfDirectorsInformation}
                  value={contact?.boardOfDirectors?.map(mapContact)}
                  columns={getColumnName(ContactType.boardOfDirectors, t)}
                  visibleFields={getVisibleFields(ContactType.boardOfDirectors)}
                  requiredFields={getMandatoryField(ContactType.boardOfDirectors)}
                  isRequired={isRequired(fieldMap[enumShareHolderFields.boardOfDirectorsInformation])}
                  forceValidate={forceValidate}
                  minOwnershipPercentage={minOwnershipPercentage}
                  countryOption={countryOptions}
                  roleOption={roleOptions}
                  t={t}
                  validator={(value) => isRequired(fieldMap[enumShareHolderFields.boardOfDirectorsInformation]) ? contactListValidator(value, {contactConfig: getContactFieldConfig(ContactType.boardOfDirectors)}) : undefined}
                  onChange={(value) => handleOnChange(value, i, ContactType.boardOfDirectors)}
                />
            )}
            </Grid>
          </Grid>
        }

        <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
            cancelLabel={props.cancelLabel}
            submitLabel={props.submitLabel}
            classNames={styles.action}
        />
    </div>)
}
