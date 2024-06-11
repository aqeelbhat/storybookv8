import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { X } from 'react-feather'

import { getMaterialBoxStyle } from '../../controls/popovers/utils'
import { OroButton } from '../../controls'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { BankCountrySelector } from './BankCountrySelector'
import { AccountDetails } from './AccountDetails'
import { BankInfo, BankProofConfig, PaymentDetail, PaymentModeConfig, PaymentModeType } from '../BankInfoV3'
import { Address, BankKey, IntermediaryBankInfo, Option } from '../../Types'
import { CountryBankKey, EnumsDataObject, Field } from '../types'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { SnackbarComponent } from '../../Snackbar'
import { BankDetails, getPaymentModeOptions } from './types'
import { mapToInternalModeType, mapToServerSideModeTypes } from './utils'
import { GlobalLoader } from '../../Loaders/GlobalLoader'

import styles from './styles.module.scss'

const modalStyle = getMaterialBoxStyle({
  width: '640px',
  height: '85vh'
})

const PAYMENT_METHOD = 'PAYMENT_METHOD'
const BANK_COUNTRY = 'BANK_COUNTRY'
const ACCOUNT_DETAILS = 'ACCOUNT_DETAILS'
const STEPS = [
  PAYMENT_METHOD,
  BANK_COUNTRY,
  ACCOUNT_DETAILS
]

interface PaymentWizardProps {
  isOpen: boolean
  data?: PaymentDetail
  countryOptions?: Option[]
  companyEntityOptions: Option[]
  paymentModeConfig: PaymentModeConfig[]
  fields?: Field[]
  partnerName?: string
  partnerCurrency?: string
  bankKeys?: EnumsDataObject[]
  bankProofConfig?: BankProofConfig[]
  isNew?: boolean
  allowBankPayoutCurrencyRequest?: boolean
  getBankDetails?: (bankCode: string, bankKey: BankKey, bankCountryCode?: string) => Promise<BankDetails[]>
  getCountryBankKeys?: (bankCountry: string, currency?: string) => Promise<CountryBankKey>
  onFilterBankCountries?: (modes: PaymentModeType[], entityCountry: string) => Promise<string[]>
  validateBankInfo?: (bankInfo: BankInfo | IntermediaryBankInfo, validateInternational: boolean) => Promise<boolean>
  getCrossBorderStatuses?: (bankCountry: string, entityCountries: string[]) => Promise<{ [entityCountry: string]: boolean }>
  onPlaceSelectParseAddress: (data: google.maps.places.PlaceResult) => Promise<Address>
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
  onClose: () => void
  onSubmit: (paymentDetail: PaymentDetail) => void
  onValueChange: (fieldName: string, updatedForm: PaymentDetail, isAttachment?: boolean) => void
}

export function PaymentWizard(props: PaymentWizardProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [mode, setMode] = useState<PaymentModeType>()
  const [applicableCountries, setApplicableCountries] = useState<Option[]>([])
  const [bankCountry, setBankCountry] = useState<Option>()
  const [fetchData, setFetchData] = useState<(skipValidation?: boolean) => PaymentDetail>()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const PaymentModeOptions = getPaymentModeOptions()

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [props.isOpen])

  function reset() {
    setCurrentStep(0)
    setMode(undefined)
    setApplicableCountries([])
    setBankCountry(undefined)
    setError('')
  }

  useEffect(() => {
    if (props.data?.paymentModes?.[0]?.type) {
      setMode(mapToInternalModeType(props.data.paymentModes[0].type))
    }
    if (props.data?.bankInformation?.bankAddress?.alpha2CountryCode) {
      const countryCode = props.data.bankInformation.bankAddress.alpha2CountryCode
      const countryOption = props.countryOptions.find(option => option.path === countryCode) || {
        id: countryCode,
        path: countryCode,
        displayName: countryCode
      }
      setBankCountry(countryOption)
    }

    if (props.data?.paymentModes?.[0]?.type && props.data?.bankInformation?.bankAddress?.alpha2CountryCode) {
      setCurrentStep(2)
    } else if (props.data?.paymentModes?.[0]?.type) {
      setCurrentStep(1)
    } else {
      setCurrentStep(0)
    }
  }, [props.data])

  useEffect(() => {
    if (!props.isOpen) {
      reset()
    }
  }, [props.isOpen])

  useEffect(() => {
    if (props.countryOptions && props.countryOptions.length > 0) {
      // Filter countries by mode
      if (props.onFilterBankCountries && mode && props.companyEntityOptions?.length > 0) {
        setLoading(true)
        const bankCountryPromises = props.companyEntityOptions.map(entity => props.onFilterBankCountries(
          mapToServerSideModeTypes(mode),
          entity.customData?.other?.countryCode
        ))

        Promise.all(bankCountryPromises)
          .then((results: Array<Array<string>>) => {
            let allCountries = []
            results.forEach((countries: string[]) => {
              allCountries = allCountries.concat(countries)
            })
            const uniqueCountries = Array.from(new Set(allCountries))
            const filteredCountries = props.countryOptions.filter(option => uniqueCountries.includes(option.path))
            setApplicableCountries(filteredCountries)

            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            console.warn('PaymentWizard - error filtering bank country options: ', err)
            setApplicableCountries(props.countryOptions)
          })
      } else {
        setApplicableCountries(props.countryOptions)
      }
    } else {
      setApplicableCountries([])
    }
  }, [props.countryOptions, mode])

  function handleFormReady(fetchFormFunction) {
    if (fetchFormFunction) {
      setFetchData(() => fetchFormFunction)
    }
  }

  function addPayment() {
    const data = fetchData()
    if (data) {
      props.onSubmit(data)
    }
  }

  function goBack() {
    setCurrentStep(currentStep - 1)
  }
  function goNext() {
    if (currentStep === (STEPS.length - 1)) {
      addPayment()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }
  function gotoStep(stepName: string) {
    const index = STEPS.findIndex(step => step === stepName)
    if ((index > -1) && (index < STEPS.length)) {
      setCurrentStep(index)
    } else {
      console.error(`Payment v4 wizard: could not go to ${stepName}`)
    }
  }

  function selectPaymentMode(mode: PaymentModeType) {
    setMode(mode)
    goNext()
  }

  function selectBankCountry(country: Option) {
    if (country && country?.path !== bankCountry?.path) {
      setBankCountry(country)
    } else if (!country) {
      setBankCountry(null)
    }
    goNext()
  }

  function getPaymentModeLogo (mode: PaymentModeType): string {
    const currentModeOption = PaymentModeOptions.find(option => option.code === mode)
    return currentModeOption?.logo
  }

  function getTitle () {
    switch(STEPS[currentStep]) {
      case PAYMENT_METHOD:
        return t('--getPaidThrough--')
      default:
        return (
          <>
            <div className={styles.logo}>
              <img src={getPaymentModeLogo(mode)} />
            </div>
            <span>{PaymentModeOptions.find(option => option.code === mode)?.displayName || mode}</span>
          </>
        )
    }
  }
  function handleCountryChange () {
    gotoStep(BANK_COUNTRY)
    setBankCountry(null)
  }

  return (
    <Modal open={props.isOpen} sx={{ zIndex: 1000 }}>
      <Box sx={modalStyle}>
        <div className={styles.paymentWizard}>
          <div className={styles.headerBar}>
            <div className={styles.title}>{getTitle()}</div>
            <X className={styles.close} size={20} color={'var(--warm-neutral-shade-500)'} onClick={props.onClose} tabIndex={0} />
          </div>

          <div className={styles.body}>
            {STEPS[currentStep] === PAYMENT_METHOD &&
              <PaymentMethodSelector
                value={mode}
                companyEntityOptions={props.companyEntityOptions}
                paymentModeConfig={props.paymentModeConfig}
                onChange={selectPaymentMode}
              />}

            {STEPS[currentStep] === BANK_COUNTRY &&
              <BankCountrySelector
                forMode={mode}
                value={bankCountry}
                options={applicableCountries}
                onChange={selectBankCountry}
              />}

            {STEPS[currentStep] === ACCOUNT_DETAILS &&
              <AccountDetails
                mode={mode}
                paymentModeConfig={props.paymentModeConfig}
                bankCountry={bankCountry}
                data={props.data}
                countryOptions={props.countryOptions}
                fields={props.fields}
                partnerName={props.partnerName}
                partnerCurrency={props.partnerCurrency}
                companyEntityOptions={props.companyEntityOptions}
                bankKeys={props.bankKeys}
                allowBankPayoutCurrencyRequest={props.allowBankPayoutCurrencyRequest}
                bankCountryOptions={applicableCountries}
                bankProofConfig={props.bankProofConfig}
                getBankDetails={props.getBankDetails}
                getCountryBankKeys={props.getCountryBankKeys}
                onValueChange={props.onValueChange}
                validateBankInfo={props.validateBankInfo}
                onReady={handleFormReady}
                onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                loadDocument={props.loadDocument}
                onCountryChange={handleCountryChange}
              />}
          </div>

          <SnackbarComponent message={error} onClose={() => setError('')} open={!!error} autoHideDuration={20000} />

          {STEPS[currentStep] === ACCOUNT_DETAILS &&
            <div className={styles.actionBar}>
              <OroButton type='primary' label={props.isNew ? t('--addPayment--') : t('--save--')} onClick={goNext} radiusCurvature='medium' />
            </div>}

          <GlobalLoader isActive={loading}/>
        </div>
      </Box>
    </Modal>
  )
}
