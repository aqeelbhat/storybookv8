import React, { useEffect, useRef, useState } from "react"
import Grid from '@mui/material/Grid'
import { Checkbox, FormControlLabel } from '@mui/material'
import { Address, Attachment, Field, GoogleMultilinePlaceSearch, Location, Option, TextBox, getI18Text, isRequired } from "../.."
import { VendorHeader, enumSupplierEditERPFields } from "./types"
import { isAddressInvalid, isEmpty, isFieldOmitted, isFieldRequired, isOmitted } from "../util"
import Actions from "../../controls/actions"
import styles from './styles.module.scss'

interface VendorHeaderProps {
  data: VendorHeader
  field: { [key: string]: Field }
  countryOptions: Option[]
  forceValidate?: boolean
  t?: (key: string) => string
  onSave: (data: VendorHeader, file?: File | Attachment, fileName?: string) => void
  onCancel: () => void
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
  onReady?: (fetchData: (skipValidation?: boolean) => VendorHeader) => void
}

const LabelStyle = {
    '& .MuiCheckbox-root' : {
        color: 'var(--warm-neutral-shade-100)',
        padding: '0 8px'
    },
    '& .MuiFormControlLabel-label': {
        fontSize: '14px',
        lineHeight: '20px',
        color: 'var(--warm-neutral-shade-500)'
    },
    '& .Mui-checked': {
        'color': 'var(--warm-stat-mint-mid) !important'
    }
}

export function EditVendorHeader (props: VendorHeaderProps) {
    const [name, setName] = useState<string>('')
    const [isPurchasingBlocked, setIsPurchasingBlocked] = useState(false)
    const [isPaymentBlocked, setIsPaymentBlocked] = useState(false)
    const [isPostingBlocked, setIsPostingBlocked] = useState(false)
    const [location, setLocation] = useState<Location>()
    const [address, setAddress] = useState<Address>()
    const [validateField, setValidateField] = useState(false)

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (node: HTMLDivElement, fieldName: string) {
      fieldRefMap.current[fieldName] = node
    }

    useEffect(() => {
        if (props.data) {
          setName(props.data.vendorName)
          setIsPaymentBlocked(props.data.isPaymentBlocked)
          setIsPurchasingBlocked(props.data.isPurchasingBlocked)
          setIsPostingBlocked(props.data.isPostingBlocked)
          setLocation(props.data.location)
          props.data.location && setAddress(props.data.location.address)
        }
    }, [props.data])

    useEffect(() => {
      if (props.forceValidate) {
        setValidateField(true)
      }
    }, [props.forceValidate])

    useEffect(() => {
      if (props.onReady) {
        props.onReady(fetchData)
      }
    }, [name, location, isPaymentBlocked, isPostingBlocked, isPurchasingBlocked])

    function getVendorHeaderData (): VendorHeader {
        return {
            vendorName: name,
            isPaymentBlocked: isPaymentBlocked,
            isPostingBlocked: isPostingBlocked,
            isPurchasingBlocked: isPurchasingBlocked,
            location: location
        }
    }

    function getInvalidField (): string {
        if (!name) {
          return enumSupplierEditERPFields.vendorName
        }
        let inValidFieldId: string
        const isInvalidField = Object.keys(props.field).some(fieldName => {
            if (!isOmitted(props.field[fieldName]) && isRequired(props.field[fieldName])) {
                switch (fieldName) {
                  case enumSupplierEditERPFields.location:
                    if (!location || isAddressInvalid(location.address)) {
                      inValidFieldId = fieldName
                      return true
                    }
                }
            }
        })
        return isInvalidField ? inValidFieldId : ''
    }

    function triggerValidations (invalidFieldId: string) {
        setValidateField(true)
        if (invalidFieldId) {
          const HTMLElement = fieldRefMap?.current?.[invalidFieldId] as HTMLElement
          if (HTMLElement?.scrollIntoView) {
            HTMLElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
          }
        }
        setTimeout(() => { setValidateField(false) }, 100)
    }

    function fetchData (skipValidation?: boolean): VendorHeader {
      if (skipValidation) {
        return getVendorHeaderData()
      } else {
        const invalidFieldId = getInvalidField()

        if (invalidFieldId) {
          triggerValidations(invalidFieldId)
        }

        return invalidFieldId ? null : getVendorHeaderData()
      }
  }

    function handleSave () {
      const invalidFieldId = getInvalidField()
      if (!invalidFieldId) {
        setValidateField(false)
        if (props.onSave) {
          props.onSave(getVendorHeaderData())
        }
      } else {
        triggerValidations(invalidFieldId)
      }
    }

    function handleCancel () {
      props.onCancel()
    }

    function getLocalisedText (key: string) {
      return props.t(key)
    }

    function validateAddressField (label: string, value: Address): string {
        if (!value) {
          return getI18Text("is required field",{label})
        } else if (isAddressInvalid(value)) {
          return getI18Text("is invalid",{label})
        } else {
          return ''
        }
    }

    function onAddressChange (value: Address) {
        setAddress(value)
        setLocation({...location, address: value})
    }

    return (<div className={styles.vendorEditContainer}>
        <Grid item xs={12}>
          <div data-testid="vendor-header-name-field" ref={(node) => { storeRef(node, enumSupplierEditERPFields.vendorName) }} >
            <TextBox
              label={getLocalisedText('--vendorName--')}
              placeholder={getLocalisedText('--enterVendorName--')}
              value={name}
              disabled={false}
              required={true}
              forceValidate={validateField}
              validator={(value) => isEmpty(value) ? getLocalisedText('--requiredField--') : ''}
              onChange={value => { setName(value) }}
            />
          </div>
        </Grid>
        {!isFieldOmitted(props.field, enumSupplierEditERPFields.location) && <Grid item xs={12}>
          <div data-testid="vendor-header-address-field" ref={(node) => { storeRef(node, enumSupplierEditERPFields.location) }} >
            <GoogleMultilinePlaceSearch
              id="vendor-address"
              label={getLocalisedText("--address--")}
              value={address}
              countryOptions={props.countryOptions}
              required={isFieldRequired(props.field, enumSupplierEditERPFields.location)}
              forceValidate={validateField}
              parseAddressToFill={(place) => props.onPlaceSelectParseAddress(place)}
              validator={(value) => isFieldRequired(props.field, enumSupplierEditERPFields.location) ? validateAddressField(getLocalisedText("--address--"), value) : ''}
              onChange={(value, countryChanged) => { onAddressChange(value) }}
            />
          </div>
        </Grid>}
        {!isFieldOmitted(props.field, enumSupplierEditERPFields.vendorHeaderLevelPaymentBlocked) && <Grid item xs={12}>
          <div data-testid="vendor-payment-blocked-field" ref={(node) => { storeRef(node, enumSupplierEditERPFields.vendorHeaderLevelPaymentBlocked) }} >
            <FormControlLabel control={
                <Checkbox
                  disableRipple
                  checked={isPaymentBlocked}
                  onChange={e => { setIsPaymentBlocked(e.target.checked) }}
                  color="success"
                />}
                label={getLocalisedText('--paymentBlocked--')}
                sx={LabelStyle}
            />
          </div>
        </Grid>}
        {!isFieldOmitted(props.field, enumSupplierEditERPFields.vendorHeaderLevelPurchasingBlocked) && <Grid item xs={12}>
          <div data-testid="vendor-payment-blocked-field" ref={(node) => { storeRef(node, enumSupplierEditERPFields.vendorHeaderLevelPurchasingBlocked) }} >
            <FormControlLabel control={
                <Checkbox
                  disableRipple
                  checked={isPurchasingBlocked}
                  onChange={e => { setIsPurchasingBlocked(e.target.checked) }}
                  color="success"
                />}
                label={getLocalisedText('--purchasingBlocked--')}
                sx={LabelStyle}
            />
          </div>
        </Grid>}
        {!isFieldOmitted(props.field, enumSupplierEditERPFields.vendorHeaderLevelPostingBlocked) && <Grid item xs={12}>
          <div data-testid="vendor-payment-blocked-field" ref={(node) => { storeRef(node, enumSupplierEditERPFields.vendorHeaderLevelPostingBlocked) }} >
            <FormControlLabel control={
                <Checkbox
                  disableRipple
                  checked={isPostingBlocked}
                  onChange={e => { setIsPostingBlocked(e.target.checked) }}
                  color="success"
                />}
                label={getLocalisedText('--postingBlocked--')}
                sx={LabelStyle}
            />
          </div>
        </Grid>}
        <Actions onCancel={handleCancel} onSubmit={handleSave}
            cancelLabel={props.t('--cancel--')}
            submitLabel={props.t('--save--')}
        />
    </div>)
}