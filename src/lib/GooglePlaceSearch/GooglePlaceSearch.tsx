import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { ChevronDown, ChevronUp } from "react-feather";

import { Address, Option } from './../Types'
import { checkObjectProperties, convertAddressToString, getEmptyAddress, getStateCode, getStateMasterdataId, isEmpty, isStateNeeded, parseAddressToFIll, validateField } from "../Form/util";
import { getI18Text as getI18ControlText, getI18Text } from '../i18n'
import { OROAddressInput, TextBox, TypeAhead } from "../Inputs";
import { InputWrapper } from "../Inputs/input.component";
import { GoogleMultilinePlaceSearchProps, GooglePlaceSearchProps } from '../Inputs/types'
import STATE_CODES, { StateCode } from './state-for-contries'

import styles from '../Inputs/styles.module.scss'

const GOOGLEAPIKEY = process.env.REACT_APP_GOOGLE_PLACE_API_KEY

export function GooglePlaceSearch (props: GooglePlaceSearchProps) {
  const GOOGLEPLACESCRIPTURL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEAPIKEY}&libraries=places`
  let autocomplete: google.maps.places.Autocomplete
  useEffect(() => {
    const checkGoogleApiScriptExists = document.querySelector(`script[src="${GOOGLEPLACESCRIPTURL}"]`);
    if (!checkGoogleApiScriptExists) {
        const src = GOOGLEPLACESCRIPTURL ? GOOGLEPLACESCRIPTURL : "";
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
    }
  },[GOOGLEPLACESCRIPTURL])

  function initAutocomplete() {
    // Create the autocomplete object
    if (!props.readonly) {
      autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(`autocomplete-single-line-${props.id}`) as unknown as HTMLInputElement,
        { fields: ["address_components"] }
      );

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autocomplete.addListener("place_changed", fillInAddress);
    }
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
    props.onPlaceSelect(place)
  }

  return (
    <div data-test-id={`autocomplete-single-line-address`}>
      <OROAddressInput
        onFocus={initAutocomplete}
        disabled={props.disabled}
        label={props.label}
        value={props.value}
        forceValidate={props.forceValidate}
        validator={(value) => validateField('Address', value)}
        required={props.required}
        id={`autocomplete-single-line-${props.id}`}
        name="address"
        placeholder={props.placeholder || "Address"}
      />
    </div>
  )
}

export function GoogleMultilinePlaceSearch (props: GoogleMultilinePlaceSearchProps) {
  const GOOGLEPLACESCRIPTURL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEAPIKEY}&libraries=places`
  let autocomplete: google.maps.places.Autocomplete
  const [countryOptions, setCountryOptions] = useState<Option[]>([])
  const [country, setCountry] = useState<Option>()
  const [validateCountry, setValidateCountry] = useState<boolean>(false)
  const [provinceOptions, setProvinceOptions] = useState<Option[]>([])
  const [province, setProvince] = useState<Option>()
  const [validateProvince, setValidateProvince] = useState<boolean>(false)
  const [isSameAs, setIsSameAs] = useState<boolean>(false)
  const [state, setState] = useState<Address>(getEmptyAddress())
  const [error, setError] = useState<string | null>()
  const [isEnterManully, setIsEnterManually] = useState(false)

  useEffect(() => {
    props.countryOptions && setCountryOptions(props.countryOptions)
  }, [props.countryOptions])

  useEffect(() => {
    const countryOption: Option = countryOptions.find(option => option.path === state.alpha2CountryCode)
    updateProvinceOptionsForCountry(countryOption && countryOption.path)
    countryOptions && setCountry(countryOption)
  }, [countryOptions, state])

  useEffect(() => {
    provinceOptions && setProvince(provinceOptions.find(option => option.path === getStateCode(state.province)))
  }, [provinceOptions, state])

  useEffect(() => {
    if (props.value) {
      setState(props.value)
    } else {
      setState(getEmptyAddress())
    }
  }, [props.value])

  useEffect(() => {
    setIsSameAs(props.isSameAs)
  }, [props.isSameAs])

  useEffect(() => {
    if (props.optional) {
      setError(null);
    } else if (props.forceValidate && props.validator && props.required) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  useEffect(() => {
    if (!props.excludeAddressSuggestion) {
      const checkGoogleApiScriptExists = document.querySelector(`script[src="${GOOGLEPLACESCRIPTURL}"]`);
      if (!checkGoogleApiScriptExists) {
          const src = GOOGLEPLACESCRIPTURL ? GOOGLEPLACESCRIPTURL : "";
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          document.body.appendChild(script);
      }
    }
  },[GOOGLEPLACESCRIPTURL])

  function initAutocomplete() {
    // Create the autocomplete object
    if (!props.readonly) {
      autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(`autocomplete-${props.id}`) as unknown as HTMLInputElement,
        { fields: ["address_components"] }
      );
    }
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", fillInAddress);
  }

  function fillInAddress() {
    if (props.parseAddressToFill) {
      // Converting google place to adress from backend side
      props.parseAddressToFill(autocomplete.getPlace()).then((resp: Address) => {
        setState(resp)
        touchMandatoryFields()
        props.onChange && props.onChange(resp, true)
      })
    } else {
      // Get the place details from the autocomplete object.
      const place = parseAddressToFIll(autocomplete.getPlace())
      setState(place)
      touchMandatoryFields()
      props.onChange && props.onChange(place, true)
    }
  }

  function touchMandatoryFields () {
    // Touch all the required inputs
    if (!props.excludeAddressSuggestion) {
      const googleInput =  document.getElementById(`autocomplete-${props.id}`) as unknown as HTMLInputElement
      if (googleInput) {
        googleInput.focus()
        googleInput.blur()
      }
    }
    if (isEnterManully && (!props.enableSameAs && !isSameAs)) {
      const line1 =  document.getElementById(`autocomplete-line1-${props.id}`) as unknown as HTMLInputElement
      line1.focus()
      line1.blur()

      const city = document.getElementById(`autocomplete-city-${props.id}`) as unknown as HTMLInputElement
      city.focus()
      city.blur()

      triggerProvinceValidation()
      triggerCountryValidation()
      
      const postal = document.getElementById(`autocomplete-postal-${props.id}`) as unknown as HTMLInputElement
      postal.focus()
      postal.blur()
    }
  }

  function triggerProvinceValidation () {
    setValidateProvince(true)
    setTimeout(() => {
      setValidateProvince(false)
    }, 500)
  }

  function triggerCountryValidation () {
    setValidateCountry(true)
    setTimeout(() => {
      setValidateCountry(false)
    }, 500)
  }

  function handleValidation(value: Address) {
    if (props.validator) {
      const err = props.validator(value)
      setError(err)
    }
  }

  function updateProvinceOptionsForCountry (countryCode: string) {
    const stateCodes: Array<StateCode> = STATE_CODES[countryCode] ? STATE_CODES[countryCode] : []
    const provinceOptions: Array<Option> = stateCodes.map(state => ({
      id: state.code,
      displayName: state.name,
      path: state.code,
      selectable: true
    }))

    setProvinceOptions(provinceOptions)
  }

  function handleChange (newAddress: Address, countryChanged?: boolean) {
    // Clear State/Provice value if it is not needed 
    let updatedAddress = newAddress
    if (countryChanged && !isStateNeeded(newAddress)) {
      updatedAddress = { ...newAddress, province: undefined }
    }

    setState(updatedAddress)
    props.onChange && props.onChange(updatedAddress, countryChanged) 
    handleValidation(updatedAddress)
  }

  function toggleSaveAs () {
    setIsSameAs(!isSameAs)
    props.onSameAsChange && props.onSameAsChange(!isSameAs)
  }

  function validateField (label: string, value: string | string[]): string {
    return isEmpty(value) ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''
  }

  function validateGoogleInputField (value: string | string[]): string {
    return isEmpty(value) ? getI18ControlText('--validationMessages--.--selectAddressOrEnterManually--') : ''
  }

  function checkAllAddressFields (): boolean {
    return !state.alpha2CountryCode || !state.city || !state.line1 || !state.postal || (isStateNeeded(state) && !state.province)
  }

  useEffect(() => {
    if (props.forceValidate && props.required) {
      if (checkObjectProperties(state) && checkAllAddressFields()) {
        setIsEnterManually(true)
        setTimeout(() => {
          touchMandatoryFields()
        }, 500)
      } else if (!props.excludeAddressSuggestion) {
        const googleInput =  document.getElementById(`autocomplete-${props.id}`) as unknown as HTMLInputElement
        if (!isSameAs && googleInput) {
          googleInput.focus()
          googleInput.blur()
        }
      }
    }
  }, [props.forceValidate])

  return (
    <div className={(props.optional !== undefined) ? classnames(styles.addressControl) : ''} data-test-id={`autocomplete-multiline-address`}>
      <InputWrapper
        label={props.label}
        classname={styles.googleMultilinePlaceSearch}
        required={props.required}
        error={error}
        warning={props.warning}
        infoText={props.infoText}
      >
        {props.enableSameAs &&
          <div className={styles.sameAs} onClick={toggleSaveAs}>
            <input
              className="oro-checkbox"
              type="checkbox"
              checked={isSameAs}
              readOnly={true}
            />
            <div className={styles.label}>{getI18Text('Same as', { label: props.sameAsLabel })}</div>
          </div>}

        {(!props.enableSameAs || !isSameAs) && <>
          {!props.excludeAddressSuggestion && <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_google-input' : 'multiline-address-google-input'}>
            <OROAddressInput
              onFocus={initAutocomplete}
              disabled={props.disabled}
              label={""}
              value={convertAddressToString(state, false)}
              validator={(value) => isEnterManully ? '' : validateGoogleInputField(value)}
              required={props.required}
              forceValidate={props.forceValidate}
              id={`autocomplete-${props.id}`}
              name="address"
              placeholder={getI18Text("Search address")}
            />
          </div>}
          {!props.excludeAddressSuggestion && <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_add-manual-button' : 'multiline-address-add-manual-button'}>
            <div className={styles.addressControlItemsAddManually} onClick={() => setIsEnterManually(!isEnterManully)}>{getI18Text("Add manually")}
              {!isEnterManully && <ChevronDown color="var(--warm-neutral-shade-400)" size={16}></ChevronDown>}
              {isEnterManully && <ChevronUp color="var(--warm-neutral-shade-400)" size={16}></ChevronUp>}
            </div>
          </div>}
          {(isEnterManully || props.excludeAddressSuggestion) && <>
          <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_line1' : 'multiline-address-line1'}>
            <TextBox
              disabled={props.disabled}
              label={getI18Text("Line 1")}
              value={state.line1}
              validator={(value) => validateField(getI18Text("Line 1"), value)}
              required={props.required}
              forceValidate={props.forceValidate}
              id={`autocomplete-line1-${props.id}`}
              placeholder={getI18Text("Line 1")}
              onChange={value => { handleChange({ ...state, line1: value }) }}
            />
          </div>
            <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_line2' : 'multiline-address-line2'}>
              <TextBox
                label={getI18Text("--line2--")}
                value={state.line2}
                disabled={props.disabled}
                required={false}
                onChange={value => { handleChange({ ...state, line2: value }) }}
              />
            </div>
            <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_line3' : 'multiline-address-line3'}>
              <TextBox
                label={getI18Text("--line3--")}
                value={state.line3}
                disabled={props.disabled}
                required={false}
                onChange={value => { handleChange({ ...state, line3: value }) }}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_city' : 'multiline-address-city'}>
                <TextBox
                  id={`autocomplete-city-${props.id}`}
                  label={getI18Text("City")}
                  value={state.city}
                  disabled={props.disabled}
                  required={props.required}
                  forceValidate={props.forceValidate}
                  validator={(value) => validateField(getI18Text("City"), value)}
                  onChange={value => { handleChange({ ...state, city: value }) }}
                />
              </div>
              {isStateNeeded(state) &&<div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_state' : 'multiline-address-state'}>
                <TypeAhead
                  id={`autocomplete-state-${props.id}`}
                  label={getI18Text("State / Region")}
                  placeholder={getI18Text("Choose")}
                  value={province?.path && {...province, path: getStateCode(province.path)}}
                  disabled={props.disabled}
                  options={provinceOptions}
                  required={props.required}
                  forceValidate={props.forceValidate || validateProvince}
                  absolutePosition={props.absolutePosition}
                  validator={(value) => validateField(getI18Text("State / Region"), value)}
                  onChange={value => { handleChange({ ...state, province: getStateMasterdataId(value?.path) }) }}
                />
              </div>}
            </div>

            <div className={styles.row}>
              <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_country' : 'multiline-address-country'}>
                <TypeAhead
                  id={`autocomplete-country-${props.id}`}
                  label={getI18Text("Country")}
                  placeholder={getI18Text("Choose")}
                  value={country}
                  options={countryOptions}
                  disabled={props.disabled}
                  required={props.required}
                  forceValidate={props.forceValidate || validateCountry}
                  absolutePosition={props.absolutePosition}
                  validator={(value) => validateField(getI18Text("Country"), value)}
                  onChange={value => { handleChange({ ...state, alpha2CountryCode: value && value.path }, true) }}
                />
              </div>
              <div className={styles.addressControlItems} data-test-id={props.dataTestIdPrefix ? props.dataTestIdPrefix + '_postal' : 'multiline-address-postal'}>
                <TextBox
                  id={`autocomplete-postal-${props.id}`}
                  label={getI18Text("Postal code")}
                  value={state.postal}
                  disabled={props.disabled}
                  required={props.required}
                  forceValidate={props.forceValidate}
                  validator={(value) => validateField(getI18Text("Postal code"), value)}
                  onChange={value => { handleChange({ ...state, postal: value }) }}
                />
              </div>
            </div>
          </>}
        </>} 
      </InputWrapper>
    </div>
  )
}