import styles from './companyInfo-form-styles.module.scss'
import React, { useEffect, useState } from 'react'
import { CompanyInfoV4FormData } from '..'
import { Option } from '../../Inputs'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { CountrySelector } from '../../Inputs/select.component'
import { PREFERRED_COUNTRIES } from '../BankInfoV4/BankCountrySelector'

interface CompanyInfoV3FormProps {
    countryOptions?: Option[]
    onReady?: (fetchData: (skipValidation?: boolean) => CompanyInfoV4FormData | null) => void
    onCountrySelect?: (country: Option) => void
    onValueChange?: (fieldName: string, updatedForm: CompanyInfoV4FormData) => Promise<boolean>
}

export function CountrySelectionCompanyInfoV4(props: CompanyInfoV3FormProps) {
    const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
    const [options, setOptions] = useState<Option[]>([])
    function onCountrySelect(value: Option) {
        props.onCountrySelect && props.onCountrySelect(value)
    }

    useEffect(() => {
        if (props.countryOptions && props.countryOptions.length === 1) {
          setOptions(props.countryOptions)
        } else {
          // show preferred contries at the top
          const _options = props.countryOptions ? [...props.countryOptions] : []
          _options?.sort((a, b) => {
            if (PREFERRED_COUNTRIES.includes(a?.path)) {
              return -1
            }
            return 0
          })
          setOptions(_options)
        }
      }, [props.countryOptions])

    return (
        <div className={styles.companyInfoFormPopupContentsCountrySelectorContents}>
            <CountrySelector
                placeholder={t('--searchACountryByNameOrCountry--')}
                options={options}
                onChange={onCountrySelect}
            />
        </div>
    )
}
