import React, { useState, useEffect, useRef } from 'react'
import { Info, PlusCircle } from 'react-feather';
import classNames from 'classnames'
import { ContactFields } from "../../CustomFormDefinition/types/CustomFormModel";
import { NumberBox, Option, TextBox, TypeAhead } from "../../Inputs";
import { Address, ContactData, IDRef } from "../../Types";
import { SupplierShareholderFormData } from "../supplier-shareholders-form.component";
import style from './shareholder-table.module.scss'
import { OroButton } from '../../controls';
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import FieldCell from '../../controls/itemDetailsV2/cells/FieldCell';
import { isEmpty, isNullable, mapAddressToIDRef, mapIDRefToAddress, mapIDRefToOption, mapOptionToIDRef } from '../util';
import { numberValidator } from '../../CustomFormDefinition';
import ValueCell from '../../controls/itemDetailsV2/cells/ValueCell';
import { getI18Text as getI18ControlText } from '../../i18n';
import { OroTooltip } from '../../Tooltip/tooltip.component';

export interface ShareHolderTableProps {
  id: string
  value: ContactData[]
  columns?: Array<{id: string, name: string}>
  visibleFields: ContactFields[]
  requiredFields?: ContactFields[]
  isReadOnly?: boolean
  isRequired?: boolean
  isVisible?: boolean
  forceValidate?: boolean
  minOwnershipPercentage?: number
  formData?: SupplierShareholderFormData
  countryOption?: Option[]
  roleOption?: Option[]
  validator?: (value?) => string | null
  onChange?: (data: ContactData[]) => void
  t?: (key: string) => string
}

interface TableRowProps {
  value: ContactData
  index: number
  visibleFields: ContactFields[]
  requiredFields: ContactFields[]
  isReadOnly?: boolean
  forceValidate?: boolean
  minOwnershipPercentage?: number
  countryOption?: Option[]
  t?: (key: string) => string
  onFieldChange?: (index: number, fieldName: ContactFields, value: ContactData) => void
}

function TableRow (props: TableRowProps) {
    const [name, setName] = useState<string>('')
    const [sharePercentage, setSharePercentage] = useState<number | undefined>()
    const [service, setService] = useState<string>('')
    const [address, setAddress] = useState<Address>()
    const [country, setCountry] = useState<IDRef>()
    const [operationLocation, setOperationLocation] = useState<Address>()
    const [countryOfOperation, setCountryOfOperation] = useState<IDRef>()
    const [visibleFields, setVisibleFields] = useState<string[]>([])

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (node: HTMLDivElement, fieldName: string) {
      fieldRefMap.current[fieldName] = node
    }

    useEffect(() => {
      if (props.value) {
        setName(props.value.fullName || '')
        setSharePercentage(props.value.sharePercentage)
        setAddress(props.value.address)
        setCountry(props.value.address ? mapAddressToIDRef(props.value.address) : null)
        setOperationLocation(props.value.operationLocation)
        setCountryOfOperation(props.value.operationLocation ? mapAddressToIDRef(props.value.operationLocation) : null)
        setService(props.value.service || '')
      }
    }, [props.value])

    useEffect(() => {
      setVisibleFields(props.visibleFields || [])
    }, [props.visibleFields])

    function isFieldVisible (fieldName: ContactFields): boolean {
      const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName as unknown as ContactFields)]
      return !!visibleFields?.find(e => e === field)
    }
  
    function isFieldRequired (fieldName: ContactFields): boolean {
      const field = Object.keys(ContactFields)[Object.values(ContactFields).indexOf(fieldName as unknown as ContactFields)]
      return !!props.requiredFields?.find(e => e === field)
    }

    function getContactData (): ContactData {
        return {
          fullName: name || undefined,
          email: '',
          address: address || undefined,
          sharePercentage: sharePercentage || undefined,
          operationLocation: operationLocation || undefined,
          service: service || undefined
        }
    }

    function getContactDataWithUpdatedValue (fieldName: string, newValue: string | Option | Address | IDRef | number): ContactData {
        const contactData = JSON.parse(JSON.stringify(getContactData())) as ContactData
    
        switch (fieldName) {
          case ContactFields.fullName:
            contactData.fullName = newValue as string
            break
          case ContactFields.email:
            contactData.email = ''
            break
          case ContactFields.percentageOfShare:
            contactData.sharePercentage = newValue as number
            break
          case ContactFields.country:
            contactData.address = mapIDRefToAddress(newValue as IDRef)
            break
          case ContactFields.service:
            contactData.service = newValue as string
            break
          case ContactFields.countryOfOperation:
            contactData.operationLocation = mapIDRefToAddress(newValue as IDRef)
            break
        }
    
        return contactData
      }

    function handleFieldChange (fieldName: ContactFields, newValue: string | number | IDRef | Address | null) {
      if (props.onFieldChange){
        props.onFieldChange(props.index, fieldName, getContactDataWithUpdatedValue(fieldName, newValue))
      }
    }

    function getLocalisedString (key: string) {
        return props.t(key)
    }

    return (
      <div className={style.tr}>
        <div className={classNames(style.flexRow, style.flexGrow)}>
           {isFieldVisible(ContactFields.fullName) && <div className={style.td}>
                {props.isReadOnly
                ? <ValueCell>{name || '-'}</ValueCell>
                : <FieldCell testId={ContactFields.fullName} ref={(node) => { storeRef(node, ContactFields.fullName) }}>
                    <TextBox
                        inTableCell
                        placeholder={getLocalisedString('--textPlaceholder--')}
                        value={name || ''}
                        required={isFieldRequired(ContactFields.fullName)}
                        forceValidate={props.forceValidate && isFieldRequired(ContactFields.fullName)}
                        validator={(value) => (isFieldRequired(ContactFields.fullName) && isEmpty(value))
                        ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
                        onChange={(value) => { setName(value); handleFieldChange(ContactFields.fullName, value) }}
                    />
                  </FieldCell>
                }
            </div>}
           {isFieldVisible(ContactFields.percentageOfShare) && <div className={style.td}>
                {props.isReadOnly
                ? <ValueCell>{!isNullable(sharePercentage) ? `${sharePercentage.toString()}%` : '-'}</ValueCell>
                : <FieldCell testId={ContactFields.percentageOfShare} ref={(node) => { storeRef(node, ContactFields.percentageOfShare) }}>
                    <NumberBox
                      inTableCell
                      value={!isNullable(sharePercentage) ? sharePercentage.toString() : ''}
                      placeholder={getLocalisedString('--sharePercentagePlaceholder--')}
                      id={ContactFields.percentageOfShare}
                      required={isFieldRequired(ContactFields.percentageOfShare)}
                      forceValidate={props.forceValidate && isFieldRequired(ContactFields.percentageOfShare)}
                      validator={(value) => {
                          const validate = (isFieldRequired(ContactFields.percentageOfShare) && isEmpty(value))
                          ? getI18ControlText('--validationMessages--.--fieldRequired--')
                          : value && numberValidator(value, { numberConfig: { min: props.minOwnershipPercentage, max: 0 } })
                              ? getI18ControlText('--validationMessages--.--ownershipShouldBeAboveMinimum--', { min: props.minOwnershipPercentage || 0 })
                              : ''
                          return validate
                      }}
                      onChange={(value) => { setSharePercentage(value); handleFieldChange(ContactFields.percentageOfShare, value)}}
                    />
                </FieldCell>
                }
            </div>}
           {isFieldVisible(ContactFields.service) && <div className={style.td}>
                {props.isReadOnly
                ? <ValueCell>{service || '-'}</ValueCell>
                : <FieldCell testId={ContactFields.service} ref={(node) => { storeRef(node, ContactFields.service) }}>
                    <TextBox
                        inTableCell
                        placeholder={getLocalisedString('--textPlaceholder--')}
                        value={service || ''}
                        required={isFieldRequired(ContactFields.service)}
                        forceValidate={props.forceValidate && isFieldRequired(ContactFields.service)}
                        validator={(value) => (isFieldRequired(ContactFields.service) && isEmpty(value))
                        ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
                        onChange={(value) => { setService(value); handleFieldChange(ContactFields.service, value) }}
                    />
                </FieldCell>
                }
            </div>}
            {isFieldVisible(ContactFields.country) && <div className={style.td}>
                {props.isReadOnly
                ? <ValueCell>{country?.name || '-'}</ValueCell>
                : <FieldCell testId={ContactFields.country} ref={(node) => { storeRef(node, ContactFields.country) }}>
                    <TypeAhead
                        inTableCell
                        placeholder={getLocalisedString('--select--')}
                        value={mapIDRefToOption(country)}
                        options={props.countryOption}
                        required={isFieldRequired(ContactFields.country)}
                        forceValidate={props.forceValidate && isFieldRequired(ContactFields.country)}
                        validator={(value) => (isFieldRequired(ContactFields.country) && isEmpty(value))
                            ? (getI18ControlText('--validationMessages--.--fieldRequired--'))
                            : ''}
                        onChange={(value) => {setCountry(mapOptionToIDRef(value)); handleFieldChange(ContactFields.country, mapOptionToIDRef(value))}}
                    />
                </FieldCell>
                }
            </div>}
            {isFieldVisible(ContactFields.countryOfOperation) && <div className={style.td}>
                {props.isReadOnly
                ? <ValueCell>{countryOfOperation?.name || '-'}</ValueCell>
                : <FieldCell testId={ContactFields.countryOfOperation} ref={(node) => { storeRef(node, ContactFields.countryOfOperation) }}>
                        <TypeAhead
                            inTableCell
                            placeholder={getLocalisedString('--select--')}
                            value={mapIDRefToOption(countryOfOperation)}
                            options={props.countryOption}
                            required={isFieldRequired(ContactFields.countryOfOperation)}
                            forceValidate={props.forceValidate && isFieldRequired(ContactFields.countryOfOperation)}
                            validator={(value) => (isFieldRequired(ContactFields.countryOfOperation) && isEmpty(value))
                                ? (getI18ControlText('--validationMessages--.--fieldRequired--'))
                                : ''}
                            onChange={(value) => {setCountryOfOperation(mapOptionToIDRef(value)); handleFieldChange(ContactFields.countryOfOperation, mapOptionToIDRef(value))}}
                        />
                    </FieldCell>
                }
            </div>}
        </div>
      </div>
    )
}

export function ShareHolderTable (props: ShareHolderTableProps) {
    const [contact, setContact] = useState<ContactData[]>([])
    const [error, setError] = useState<string>()

    useEffect(() => {
      if (props.value) {
        setContact(props.value.length > 0 ? props.value : [getEmptyContact()])
      }
    }, [props.value])

    function triggerValidation (contacts: ContactData[]) {
        if (props.validator) {
          const err = props.validator(contacts)
          setError(err)
        } else {
          setError('')
        }
    }

    useEffect(() => {
      if (props.forceValidate && props.isRequired) {
        triggerValidation(contact)
      }
    }, [props.forceValidate])

    function getEmptyContact (): ContactData {
        return {
          fullName: '',
          email: '',
          sharePercentage: undefined,
          service: '',
          operationLocation: undefined,
          address: undefined
        }
    }

    function handleAddNewItem () {
      const newItem = [...contact, { ...getEmptyContact() }]
      setContact(newItem)
      if (props.onChange) {
        props.onChange(newItem)
      }
    }

    function handleOnFieldChange (index: number, fieldName: ContactFields, value: ContactData) {
        const contactsCopy = [...contact]
        contactsCopy[index] = value
        setContact(contactsCopy)
    
        if (props.onChange) {
          props.onChange(contactsCopy)
        }
    }

    function getLocalisedString (key: string) {
      return props?.t(key)
    }

    function getTooltipText () {
      return (
        <div className={style.tooltipText}>
          <div>{getLocalisedString('--forIndividuals--')}</div>
          <div>{getLocalisedString('--forCountries--')}</div>
        </div>
      )
    }

    return (<>
      <div className={style.table}>
        {props.columns && props.columns.length > 0 && <div className={style.th}>
            {props.columns.map((column, index) =>
              <div key={index} className={classNames(style.td, style.colName)}>
                {column.name}
                {column.id === 'shareHolderCountry' &&
                  <OroTooltip title={getTooltipText()} arrow placement='right'>
                    <Info size={14} color="var(--warm-neutral-shade-200)" className={style.tooltip}/>
                  </OroTooltip>
                }
              </div>
            )}
        </div>}

        <div className={style.tbody} data-test-id={props.id}>
            {contact && contact.map((value, index) =>
               <div key={index}>
                  <TableRow
                    value={value}
                    index={index}
                    visibleFields={props.visibleFields}
                    requiredFields={props.requiredFields}
                    forceValidate={props.forceValidate}
                    minOwnershipPercentage={props.minOwnershipPercentage}
                    isReadOnly={props.isReadOnly}
                    countryOption={props.countryOption}
                    t={props.t}
                    onFieldChange={handleOnFieldChange}
                  />
                </div>
            )}
        </div>

        {!props.isReadOnly && <div className={classNames(style.tr, style.noBtmBorder)}>
          <div className={classNames(style.td, style.flexGrow, style.addButton)}>
            <OroButton icon={<PlusCircle color={'var(--warm-prime-azure'} size={16} />} label={getLocalisedString('--add--')} type='link' onClick={handleAddNewItem} />
          </div>
        </div>}
      </div>
      {error &&
        <div className={style.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </>)
}