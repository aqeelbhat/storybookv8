import React, { useEffect, useState } from 'react'
import { getEmptyAddress, isEmpty } from '../Form/util'
import { Address, Option } from '../Types'
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch'
import styles from './style.module.scss'
import classnames from 'classnames'
import { PlusCircle, Trash2 } from 'react-feather'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { CustomFormField, MultiConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { getI18Text as getI18ControlText } from '../i18n'

interface AddressesProps {
  value?: Address[]
  id?: string
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  countryOptions?: Option[]
  multiConfig?: MultiConfig
  field?: CustomFormField
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) => Promise<Address>
  onChange?: (value: Address[]) => void
}

interface AddressControlProps {
  id: string
  address?: Address
  placeholder?: string
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  countryOptions: Array<Option>
  dataTestIdPrefix?: string
  handleAddressesChange?: (value: Address) => void
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) => Promise<Address>
}

interface SingleAddressControlProps {
  id: string
  value?: Address
  placeholder?: string
  optional?: boolean
  isReadOnly?: boolean
  forceValidate?: boolean
  countryOptions: Array<Option>
  field?: CustomFormField
  onChange?: (value: Address) => void
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) => Promise<Address>
}

function AddressControl (props: AddressControlProps) {
  
  function handleAddressesChange(value: Address) {
    if (props.handleAddressesChange) {
      props.handleAddressesChange(value)
    }
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  return (
    <>
      <GoogleMultilinePlaceSearch
        id={props.id}
        label=""
        value={props.address}
        dataTestIdPrefix={props.dataTestIdPrefix}
        countryOptions={props.countryOptions}
        required={true}
        validator={(value) => !props.optional && isEmpty(value?.line1 || value?.city || value?.province || value?.alpha2CountryCode || value?.postal) ? 'Address is a required field.' : ''}
        forceValidate={props.forceValidate && !props.optional && !props.isReadOnly}
        onChange={(value, countryChanged) => handleAddressesChange(value)}
        parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
      />
    </>
  )
}

export function MultipleAddressControl(props: AddressesProps) {
  const [addresses, setAddresses] = useState<Array<Address>>([])
  const [countryOptions, setCountryOptions] = useState<Option[]>([])
  const [minCount, setMinCount] = useState<number>()
  const [labelPrefix, setLabelPrefix] = useState<string>('')

  useEffect(() => {
    if (props.value) {
      setAddresses(props.value)
    } else {
      setAddresses([getEmptyAddress()])
    }
  }, [props.value])

  useEffect(() => {
    if (props.multiConfig) {
      if (props.multiConfig?.minCount) {
        setMinCount(props.multiConfig.minCount)
      } else {
        setMinCount(1)
      }

      if (props.multiConfig?.labelPrefix) {
        setLabelPrefix(props.multiConfig.labelPrefix)
      } else {
        setLabelPrefix('Address')
      }
    }
  }, [props.multiConfig])

  useEffect(() => {
    props.countryOptions && setCountryOptions(props.countryOptions)
  }, [props.countryOptions])

  function handleAddressesChange(value: Address, index: number) {
    addresses[index] = value
    setAddresses([...addresses])
    let addressesCopy: Array<Address> = []
    if (addresses[index]) {
      addressesCopy = addresses
    } else {
      addressesCopy.push(value)
    }
    if (props.onChange) {
      props.onChange(addressesCopy)
    }
  }

  function handleAddNewAddress() {
    const addressesCopy = [...addresses, getEmptyAddress()]
    setAddresses(addressesCopy)
    if (props.onChange) {
      props.onChange(addressesCopy)
    }
  }

  function removeAddress(index: number) {
    const addressesCopy = [...addresses]
    addressesCopy.splice(index, 1)
    setAddresses(addressesCopy)
    if (props.onChange) {
      props.onChange(addressesCopy)
    }
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }
  return (
    <>
      {addresses?.length > 0 &&
        addresses.map((addressItem, i) => {
          return (
            <div id={"custom-form-multiline-address-field" + props.id + (i + 1)} className={classnames(styles.addressControl)} key={i}>
              <div className={styles.addressTitleContainer}>
                <span>{labelPrefix} {i + 1}</span>
                <Trash2 size={20} color="#ABABAB" onClick={() => removeAddress(i)}></Trash2>
              </div>
              <AddressControl
                id={"custom-form-multiline-address" + props.id + (i + 1)}
                placeholder="Search address"
                dataTestIdPrefix={`${props.field?.fieldName}_address_${i + 1}`}
                address={addressItem}
                optional={props.optional}
                forceValidate={props.forceValidate}
                countryOptions={countryOptions}
                handleAddressesChange={(value: Address) => handleAddressesChange(value, i)}
                onPlaceSelectParseAddress={onPlaceSelectParseAddress}
              />
            </div>
          )
        })
      }
      <div className={styles.addAddressButtonContainer} onClick={handleAddNewAddress}>
        <h3 className={styles.addAddressButtonTitle} ><PlusCircle size={20} color="#262626"></PlusCircle> Add another Address</h3>
      </div>
      {addresses.length < minCount &&
        <div className={styles.validationError}>
          <img src={AlertCircle} />Minimum of {minCount} is required
        </div>
      }
    </>
  )
}

interface AddressesPropsNew {
  id?: string
  value?: Address[]
  placeholder?: string
  disabled?: boolean
  config: {
    fieldName?: string
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    multiConfig?: MultiConfig
  }
  additionalOptions: {
    country?: Option[],
  }
  dataFetchers: {
    getParsedAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>,
  }
  onChange?: (value: Address[]) => void
}

export function MultipleAddressControlNew (props: AddressesPropsNew) {
  const [addresses, setAddresses] = useState<Array<Address>>([])
  const [countryOptions, setCountryOptions] = useState<Option[]>([])
  const [minCount, setMinCount] = useState<number>()
  const [labelPrefix, setLabelPrefix] = useState<string>('Address')

  useEffect(() => {
    if (props.value) {
      setAddresses(props.value)
    } else {
      setAddresses([getEmptyAddress()])
    }
  }, [props.value])

  useEffect(() => {
    if (props.config?.multiConfig) {
      setMinCount(isNaN(props.config.multiConfig.minCount) ? 1 : props.config.multiConfig.minCount)
      setLabelPrefix(props.config.multiConfig.labelPrefix || 'Address')
    }
  }, [props.config])

  useEffect(() => {
    props.additionalOptions.country && setCountryOptions(props.additionalOptions.country)
  }, [props.additionalOptions.country])

  function handleAddressesChange(value: Address, index: number) {
    addresses[index] = value
    setAddresses([...addresses])
    let addressesCopy: Array<Address> = []
    if (addresses[index]) {
      addressesCopy = addresses
    } else {
      addressesCopy.push(value)
    }
    if (props.onChange) {
      props.onChange(addressesCopy)
    }
  }

  function handleAddNewAddress() {
    const addressesCopy = [...addresses, getEmptyAddress()]
    setAddresses(addressesCopy)
    if (props.onChange) {
      props.onChange(addressesCopy)
    }
  }

  function removeAddress(index: number) {
    const addressesCopy = [...addresses]
    addressesCopy.splice(index, 1)
    setAddresses(addressesCopy)
    if (props.onChange) {
      props.onChange(addressesCopy)
    }
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.dataFetchers.getParsedAddress) {
      return props.dataFetchers.getParsedAddress(place)
    } else {
      return Promise.reject()
    }
  }
  return (
    <>
      {addresses?.length > 0 &&
        addresses.map((addressItem, i) => {
          return (
            <div id={"custom-form-multiline-address-field" + props.id + (i + 1)} className={classnames(styles.addressControl)} key={i}>
              <div className={styles.addressTitleContainer}>
                <span>{labelPrefix} {i + 1}</span>
                <Trash2 size={20} color="#ABABAB" onClick={() => removeAddress(i)}></Trash2>
              </div>
              <AddressControl
                id={"custom-form-multiline-address" + props.id + (i + 1)}
                placeholder="Search address"
                dataTestIdPrefix={`${props.config?.fieldName}_address_${i + 1}`}
                address={addressItem}
                optional={props.config.optional}
                forceValidate={props.config.forceValidate}
                countryOptions={countryOptions}
                handleAddressesChange={(value: Address) => handleAddressesChange(value, i)}
                onPlaceSelectParseAddress={onPlaceSelectParseAddress}
              />
            </div>
          )
        })
      }
      <div className={styles.addAddressButtonContainer} onClick={handleAddNewAddress}>
        <h3 className={styles.addAddressButtonTitle} ><PlusCircle size={20} color="#262626"></PlusCircle> {getI18ControlText('--fieldTypes--.--address--.--addAnotherAddress--')}</h3>
      </div>
      {!props.config.optional && addresses.length < minCount &&
        <div className={styles.validationError}>
          <img src={AlertCircle} />
          {getI18ControlText('--validationMessages--.--atLeastMinimumRequired--', { min: minCount })}
        </div>
      }
    </>
  )
}

export function SingleAddressControl(props: SingleAddressControlProps) {
  const [countryOptions, setCountryOptions] = useState<Option[]>([])

  useEffect(() => {
    props.countryOptions && setCountryOptions(props.countryOptions)
  }, [props.countryOptions])
  
  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function handleChange (newAddres: Address) {
    props.onChange && props.onChange(newAddres) 
  }

  return (
    <div id={"custom-form-single-address-field" + props.id} className={classnames(styles.addressControl)}>
      <AddressControl
        id={props.id}
        placeholder="Search address"
        dataTestIdPrefix={props.field?.fieldName}
        address={props.value}
        optional={props.optional}
        forceValidate={props.forceValidate}
        countryOptions={countryOptions}
        handleAddressesChange={handleChange}
        onPlaceSelectParseAddress={onPlaceSelectParseAddress}
      />
    </div>
  )
}

interface SingleAddressControlPropsNew {
  id: string
  value?: Address
  placeholder?: string
  config: {
    fieldName?: string
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    noPadding?: boolean
  }
  additionalOptions: {
    country?: Option[],
  }
  dataFetchers: {
    getParsedAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>,
  }
  validator?: (value?) => string | null
  onChange?: (value: Address) => void
}

export function SingleAddressControlNew (props: SingleAddressControlPropsNew) {
  const [countryOptions, setCountryOptions] = useState<Option[]>([])

  useEffect(() => {
    props.additionalOptions.country && setCountryOptions(props.additionalOptions.country)
  }, [props.additionalOptions.country])
  
  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.dataFetchers.getParsedAddress) {
      return props.dataFetchers.getParsedAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function handleChange (newAddres: Address) {
    props.onChange && props.onChange(newAddres) 
  }

  return (
    <div id={"custom-form-single-address-field" + props.id} className={classnames(styles.addressControl, {[styles.noPadding]: props.config.noPadding})}>
      <AddressControl
        id={props.id}
        // placeholder="Search address"
        dataTestIdPrefix={props.config?.fieldName}
        address={props.value}
        optional={props.config.optional}
        forceValidate={props.config.forceValidate}
        countryOptions={countryOptions}
        handleAddressesChange={handleChange}
        onPlaceSelectParseAddress={onPlaceSelectParseAddress}
      />
    </div>
  )
}
