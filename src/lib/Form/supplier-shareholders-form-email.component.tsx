import React, { useState, useEffect } from "react"
import { ContactType, SupplierShareholderFormData } from "./supplier-shareholders-form.component"
import { NormalizedVendorRef, Option, ProcessVariables, mapContact } from "../Types"
import { ContactsEmailValue } from "../CustomFormDefinition/View/ReadOnlyValues"
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n"
import { canShowSection, getSectionTitle } from "./supplier-shareholders-form-readonly.component"

export interface ShareholderFormEmailProps {
    data: SupplierShareholderFormData
    processVariables?: ProcessVariables
    roleOption?: Option[]
}

export function ShareholderFormEmail (props: ShareholderFormEmailProps) {
    const [supplierContact, setSupplierContact] = useState<NormalizedVendorRef[]>([])
    const { t } = useTranslationHook([NAMESPACES_ENUM.SHAREHOLDERFORM])

    useEffect(() => {
        if (props.data) {
          setSupplierContact(props.data.normalizedVendorRefs)
        }
    }, [props.data])

    return (<>
        {canShowSection(ContactType.shareHolders, props.data?.normalizedVendorRefs, props.processVariables) && <>
            { supplierContact.map((contact, i) => 
                <ContactsEmailValue key={i}
                    value={contact?.shareHolders?.map(mapContact)}
                    labelPrefix={getSectionTitle(ContactType.shareHolders, t)}
                    roles={props.roleOption}
                />
            )}
        </>}

        {canShowSection(ContactType.subsidiaries, props.data?.normalizedVendorRefs, props.processVariables) && <>
            { supplierContact.map((contact, i) => 
                <ContactsEmailValue key={i}
                    value={contact?.subsidiaries?.map(mapContact)}
                    labelPrefix={getSectionTitle(ContactType.subsidiaries, t)}
                    roles={props.roleOption}
                />
            )}
        </>}

        
        {canShowSection(ContactType.contractors, props.data?.normalizedVendorRefs, props.processVariables) && <>
            { supplierContact.map((contact, i) => 
                <ContactsEmailValue key={i}
                    value={contact?.subcontractors?.map(mapContact)}
                    labelPrefix={getSectionTitle(ContactType.contractors, t)}
                    roles={props.roleOption}
                />
            )}
        </>}

        {canShowSection(ContactType.boardOfDirectors, props.data?.normalizedVendorRefs, props.processVariables) && <>
            { supplierContact.map((contact, i) => 
                <ContactsEmailValue key={i}
                    value={contact?.boardOfDirectors?.map(mapContact)}
                    labelPrefix={getSectionTitle(ContactType.boardOfDirectors, t)}
                    roles={props.roleOption}
                />
            )}
        </>}
    </>)
}