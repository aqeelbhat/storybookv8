import React, { useState, useEffect } from "react"
import Grid from '@mui/material/Grid';
import { Label, Value, Separator } from '../controls/atoms';
import { Option } from "../Inputs"
import { ContactType, SupplierShareholderFormData, enumShareHolderFields, getColumnName, getVisibleFields } from "./supplier-shareholders-form.component"
import './oro-form-read-only.css'
import { Contact, NormalizedVendorRef, ProcessVariables, mapContact } from "../Types"
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n"
import ALPHA2CODES_DISPLAYNAMES from "../util/alpha2codes-displaynames";
import styles from './supplier-shareholders-form-styles.module.scss'
import { getCustomLabelForField, getFormFieldsMap, isOmitted } from "./util";
import { Field } from ".";
import { ShareHolderTable } from "./components/shareholder-table.component";

export interface ShareholderFormReadOnlyProps {
    data: SupplierShareholderFormData
    fields?: Field[]
    countryOption?: Option[]
    roleOption?: Option[]
    processVariables?: ProcessVariables
    isSingleColumnLayout?: boolean
}

interface ContactDetailProps {
    value: Contact[]
    type?: ContactType
    roleOptions?: Option[]
}

export function getSectionTitle (type: ContactType, t: (key: string) => string) {
    switch (type) {
        case ContactType.shareHolders:
          return t('--shareHolderInfo--')
        case ContactType.subsidiaries:
          return t('--keySubsidiariesInfo--')
        case ContactType.contractors:
          return t('--subcontractorDetails--')
        case ContactType.boardOfDirectors:
          return t('--boardOfDirectors--')
    }
}

export function ContactDetail (props: ContactDetailProps) {
    const { t } = useTranslationHook([NAMESPACES_ENUM.SHAREHOLDERFORM])

    function getRoleDisplayName (value: string) {
        const role = props.roleOptions?.find(option => option.path === value)
        return role?.displayName || value
    }

    return (<>
       { props.value && props.value?.length > 0 && props.value?.map((contact, index) => {
         return (
            <Grid container spacing={2} key={index}>
                <Grid item xs={12}>
                    <span className={styles.subTitle}>{`${getSectionTitle(props.type, t)} ${index+1}`}</span>
                </Grid>
                <Grid item xs={4}>
                    <Label>{t('--fullName--')}</Label>
                </Grid>
                <Grid item xs={8}>
                    <Value>{contact.fullName}</Value>
                </Grid>
                <Grid item xs={4}>
                    <Label>{t('--country--')}</Label>
                </Grid>
                <Grid item xs={8}>
                    <Value>{ALPHA2CODES_DISPLAYNAMES[contact.address?.alpha2CountryCode] || contact.address?.alpha2CountryCode}</Value>
                </Grid>
                {contact.email && <>
                    <Grid item xs={4}>
                        <Label>{t('--email--')}</Label>
                    </Grid>
                    <Grid item xs={8}>
                        <Value>{contact.email}</Value>
                    </Grid>
                </>}
                {contact.role && <>
                    <Grid item xs={4}>
                        <Label>{t('--role--')}</Label>
                    </Grid>
                    <Grid item xs={8}>
                        <Value>{getRoleDisplayName(contact.role)}</Value>
                    </Grid>
                </>}
                {contact.sharePercentage && <>
                    <Grid item xs={4}>
                        <Label>{t('--sharesLabel--')}</Label>
                    </Grid>
                    <Grid item xs={8}>
                        <Value>{`${contact.sharePercentage?.toString()}%`}</Value>
                    </Grid>
                </>}
                {contact.note && <>
                    <Grid item xs={4}>
                        <Label>{t('--notes--')}</Label>
                    </Grid>
                    <Grid item xs={8}>
                        <Value>{contact.note}</Value>
                    </Grid>
                </>}
                <Grid item xs={12} >
                    <Separator />
                </Grid>
            </Grid>)
          })
       }
    </>)
}

export function canShowSection (type: ContactType, data: NormalizedVendorRef[], processVariables: ProcessVariables) {
    let isDetailsFound = false
    switch (type) {
        case ContactType.shareHolders:
          isDetailsFound = data?.some(vendor => vendor.shareHolders?.length > 0)
          return isDetailsFound && processVariables?.assessOwnership !== false
        case ContactType.subsidiaries:
          isDetailsFound = data?.some(vendor => vendor.subsidiaries?.length > 0)
          return isDetailsFound && processVariables?.assessSubsidiary !== false
        case ContactType.contractors:
          isDetailsFound = data?.some(vendor => vendor.subcontractors?.length > 0)
          return isDetailsFound && processVariables?.assessSubcontractors !== false
        case ContactType.boardOfDirectors:
          isDetailsFound = data?.some(vendor => vendor.boardOfDirectors?.length > 0)
          return isDetailsFound && processVariables?.assessBoardOfDirectors !== false
        default:
          return isDetailsFound
    }
}

export function ShareholderFormReadOnly (props: ShareholderFormReadOnlyProps) {
    const [supplierContact, setSupplierContact] = useState<NormalizedVendorRef[]>([])
    const [minOwnershipPercentage, setMinOwnershipPercentage] = useState<number>()
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SHAREHOLDERFORM])

    useEffect(() => {
        if (props.data) {
          setSupplierContact(props.data.normalizedVendorRefs)
        }
    }, [props.data])

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

    return (<div className={styles.shareHolderDetailsReadOnly}>
        {!isOmitted(fieldMap[enumShareHolderFields.shareHolderInformation]) && canShowSection(ContactType.shareHolders, props.data?.normalizedVendorRefs, props.processVariables) && <div className={styles.section}>
            <div className={styles.title}>
                {getCustomLabelForField(fieldMap[enumShareHolderFields.shareHolderInformation]) || t('--shareHolderInfo--')}
            </div>
            <>
                {supplierContact.map((contact, i) => 
                    <ShareHolderTable key={i}
                        id={enumShareHolderFields.shareHolderInformation}
                        value={contact?.shareHolders?.map(mapContact)}
                        columns={getColumnName(ContactType.shareHolders, t)}
                        visibleFields={getVisibleFields(ContactType.shareHolders)}
                        minOwnershipPercentage={minOwnershipPercentage}
                        isReadOnly={true}
                        countryOption={props.countryOption}
                        roleOption={props.roleOption}
                        t={t}
                    />
                )}
            </>
        </div>}

        {!isOmitted(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]) && canShowSection(ContactType.subsidiaries, props.data?.normalizedVendorRefs, props.processVariables) && <div className={styles.section}>
            <div className={styles.title}>
              {getCustomLabelForField(fieldMap[enumShareHolderFields.keySubsidiariesAndJointVentureInformation]) || t('--keySubsidiariesInfo--')}
            </div>
            <>
                {supplierContact.map((contact, i) => 
                    <ShareHolderTable key={i}
                        id={enumShareHolderFields.keySubsidiariesAndJointVentureInformation}
                        value={contact?.subsidiaries?.map(mapContact)}
                        columns={getColumnName(ContactType.subsidiaries, t)}
                        visibleFields={getVisibleFields(ContactType.subsidiaries)}
                        minOwnershipPercentage={minOwnershipPercentage}
                        isReadOnly={true}
                        countryOption={props.countryOption}
                        roleOption={props.roleOption}
                        t={t}
                    />
                )}
            </>
        </div>}

        {!isOmitted(fieldMap[enumShareHolderFields.subContractorInformation]) && canShowSection(ContactType.contractors, props.data?.normalizedVendorRefs, props.processVariables) && <div className={styles.section}>
            <div className={styles.title}>
              {getCustomLabelForField(fieldMap[enumShareHolderFields.subContractorInformation]) || t('--subcontractorDetails--')}
            </div>
            <>
                {supplierContact.map((contact, i) =>
                    <ShareHolderTable key={i}
                        id={enumShareHolderFields.subContractorInformation}
                        value={contact?.subcontractors?.map(mapContact)}
                        columns={getColumnName(ContactType.contractors, t)}
                        visibleFields={getVisibleFields(ContactType.contractors)}
                        minOwnershipPercentage={minOwnershipPercentage}
                        isReadOnly={true}
                        countryOption={props.countryOption}
                        roleOption={props.roleOption}
                        t={t}
                    />
                )}
            </>
        </div>}

        {!isOmitted(fieldMap[enumShareHolderFields.boardOfDirectorsInformation]) && canShowSection(ContactType.boardOfDirectors, props.data?.normalizedVendorRefs, props.processVariables) && <div className={styles.section}>
            <div className={styles.title}>
                {getCustomLabelForField(fieldMap[enumShareHolderFields.boardOfDirectorsInformation]) || t('--boardOfDirectors--')}
            </div>
            <>
                {supplierContact.map((contact, i) => 
                    <ShareHolderTable key={i}
                        id={enumShareHolderFields.boardOfDirectorsInformation}
                        value={contact?.boardOfDirectors?.map(mapContact)}
                        columns={getColumnName(ContactType.boardOfDirectors, t)}
                        visibleFields={getVisibleFields(ContactType.boardOfDirectors)}
                        minOwnershipPercentage={minOwnershipPercentage}
                        isReadOnly={true}
                        countryOption={props.countryOption}
                        roleOption={props.roleOption}
                        t={t}
                    />
                )}
            </>
        </div>}
    </div>)
}