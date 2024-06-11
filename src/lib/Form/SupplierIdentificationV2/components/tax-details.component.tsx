import styles from './tax-details.module.scss'
import { X } from 'react-feather'
import React, { useEffect, useState } from 'react'
import { EncryptedData, EncryptedDataBox, Option, OroButton, SupplierTaxKeyField, TextBox, TypeAhead } from '../../..'
import { EnumsDataObject, emptyEcncryptedData } from '../../types'
import { enumSupplierIdentificationFields } from '../types'
import { Grid } from '@mui/material'
import { getTaxKeyNameForKey, isEmpty, validateField } from '../../util'
import { convertTaxKeyListToOptions, covertTaxKeyNameToOption } from '../util'
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from '../../../i18n'

interface TaxDetailsProps {
    title?: string
    country?: string
    jurisdictionCountryCode?: string
    tax?: SupplierTaxKeyField | null
    inDirectTax?: SupplierTaxKeyField | null
    taxKeys?: EnumsDataObject[]
    isTaxRequired?: boolean
    isIndirectTaxRequired?: boolean
    taxCodeFormatError?: boolean
    indirectTaxCodeFormatError?: boolean
    validateTaxFormat? (taxKey: string, alpha2CountryCode: string, data: EncryptedData, taxCode: string)
    onClose?: () => void
    updateTaxDetails?: (tax?: SupplierTaxKeyField, inDirectTax?: SupplierTaxKeyField) => void
}

function TaxDetailsContent (props: TaxDetailsProps) {
  const [taxIdTypeOption, setTaxIdTypeOption] = useState<Array<Option>>([])
  const [selectedTaxType, setSelectedTaxType] = useState<Option>()
  const [tax, setTax] = useState<SupplierTaxKeyField | null>()
  const [indirectTax, setIndirectTax] = useState<SupplierTaxKeyField | null>()
  const [selectedTaxTypeValue, setSelectedTaxTypeValue] = useState<EncryptedData>(emptyEcncryptedData)
  const [indirectTaxTypeValue, setIndirectTaxTypeValue] = useState<EncryptedData>(emptyEcncryptedData)
  const [indirectTaxTypeName, setIndirectTaxTypeName] = useState<string>('')
  const [taxTypeName, setTaxTypeName] = useState<string>('')
  const [taxCodeFormatError, setTaxCodeFormatError] = useState(false)
  const [indirectTaxCodeFormatError, setIndirectTaxCodeFormatError] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

  useEffect(() => {
    setTaxCodeFormatError(!!props.taxCodeFormatError)
  }, [props.taxCodeFormatError])

  useEffect(() => {
    setIndirectTaxCodeFormatError(!!props.indirectTaxCodeFormatError)
  }, [props.indirectTaxCodeFormatError])

  useEffect(() => {
    if (props.tax) {
      setTax(props.tax)
      if (props.taxKeys && props.tax?.taxKeysList) {
        const options = convertTaxKeyListToOptions(props.taxKeys, props.tax?.taxKeysList)
        setTaxIdTypeOption(options)
      }
      if (props.taxKeys && props.tax?.taxKey) {
        setSelectedTaxType(covertTaxKeyNameToOption(props.taxKeys, props.tax?.taxKey))
      } else if (props.taxKeys && props.tax?.taxKeysList?.length > 0) {
        setSelectedTaxType(covertTaxKeyNameToOption(props.taxKeys, props.tax?.taxKeysList[0]))
      }
      if (props.tax?.encryptedTaxCode) {
        setSelectedTaxTypeValue(props.tax?.encryptedTaxCode)
      }
    }
  }, [props.tax])

  useEffect(() => {
    if (selectedTaxType) {
      setTaxTypeName(getTaxKeyNameForKey(selectedTaxType?.path, props.taxKeys))
    }
  }, [selectedTaxType])

  useEffect(() => {
    if (props.inDirectTax) {
      setIndirectTax(props.inDirectTax)
      if (props.inDirectTax?.encryptedTaxCode) {
        setIndirectTaxTypeValue(props.inDirectTax?.encryptedTaxCode)
      }

      if (props.inDirectTax?.taxKeysList) {
        setIndirectTaxTypeName(getTaxKeyNameForKey(props.inDirectTax?.taxKeysList[0], props.taxKeys))
      }
    }
  }, [props.inDirectTax])

  function closePopup () {
    if (props.onClose) {
      props.onClose()
    }
  }

  function handleOnValidateTINFormat (fieldType: string) {
    let taxCode
    let taxValue

    if (fieldType === enumSupplierIdentificationFields.tax) {
      taxCode = 'encryptedTaxCode'
      taxValue = tax
    }

    if (fieldType === enumSupplierIdentificationFields.inDirectTax) {
      taxCode = 'encryptedIndirectTaxCode'
      taxValue = indirectTaxTypeValue
    }

    if (props.validateTaxFormat && selectedTaxType && props.jurisdictionCountryCode) {
      props.validateTaxFormat(selectedTaxType?.path, props.jurisdictionCountryCode, taxValue?.encryptedTaxCode, taxCode)
    }
  }

  function handleTaxValueChange (taxValue: EncryptedData, fieldType: string) {
    if (fieldType === enumSupplierIdentificationFields.tax && tax && selectedTaxType && selectedTaxType?.path) {
      setTax({ ...tax, encryptedTaxCode: taxValue, taxKey: selectedTaxType?.path })
      setSelectedTaxTypeValue(taxValue)
    } else if (fieldType === enumSupplierIdentificationFields.inDirectTax && indirectTax && indirectTax?.taxKeysList?.length > 0) {
      setIndirectTax({ ...indirectTax, encryptedTaxCode: taxValue, taxKey: indirectTax?.taxKeysList[0] })
      setIndirectTaxTypeValue(taxValue)
    }
  }

  function handleTaxDetailsUpdate () {
    if (props.updateTaxDetails) {
      props.updateTaxDetails(tax, indirectTax)
    }
  }

  function disableAddButton () {
    return (props.isTaxRequired && (!tax?.encryptedTaxCode?.unencryptedValue || !tax?.encryptedTaxCode?.maskedValue)) || (props.isIndirectTaxRequired && (!indirectTax?.encryptedTaxCode?.unencryptedValue || !indirectTax?.encryptedTaxCode?.maskedValue))
  }

  return (
    <div className={styles.taxDetailsForm}>
      <div className={styles.taxDetailsFormHeader}>
        <span className={styles.title}>{t('--editTaxDetails--')}</span>
        <X size={20} color="var(--warm-neutral-shade-500)" onClick={closePopup} cursor="pointer"></X>
      </div>
      <div className={styles.taxDetailsFormBody}>
        <Grid container spacing={1} gap={2.5}>
            <Grid item xs={12}>
              <TextBox
                label={t('--country--')}
                disabled={true}
                value={props.country}
                required={true}
              />
            </Grid>
            <Grid item xs={12}>
                <label className={styles.roleLabel}>{t('--taxType--')}</label>
                <TypeAhead
                    // label={'Tax Type'}
                    value={selectedTaxType}
                    options={taxIdTypeOption}
                    required={props.isTaxRequired}
                    onChange={setSelectedTaxType}
                />
            </Grid>
            {selectedTaxType && <Grid item xs={12}>
                <label className={styles.roleLabel}>{taxTypeName}</label>
                <EncryptedDataBox
                    value={selectedTaxTypeValue}
                    disabled={false}
                    required={true}
                    forceValidate={taxCodeFormatError}
                    onBlur={() => handleOnValidateTINFormat(enumSupplierIdentificationFields.tax)}
                    validator={(value) => taxCodeFormatError ? t('--formatIsIncorrect--') : isEmpty(value) ? validateField(taxTypeName || '', value) : ''}
                    onChange={value => handleTaxValueChange(value, enumSupplierIdentificationFields.tax)}
                />
            </Grid>}
            {indirectTax?.taxKeysList && indirectTax?.taxKeysList?.length > 0 && <Grid item xs={12}>
                <label className={styles.roleLabel}>{indirectTaxTypeName}</label>
                <EncryptedDataBox
                    value={indirectTaxTypeValue}
                    disabled={false}
                    required={props.isIndirectTaxRequired}
                    forceValidate={indirectTaxCodeFormatError}
                    warning={taxCodeFormatError}
                    validator={(value) => indirectTaxCodeFormatError ? t('--formatIsIncorrect--') : isEmpty(value) ? validateField(indirectTaxTypeName || '', value) : ''}
                    onChange={value => handleTaxValueChange(value, enumSupplierIdentificationFields.inDirectTax)}
                />
            </Grid>}
            <Grid item xs={12}>
                <div className={styles.actionBtn}>
                    <OroButton type="default" onClick={closePopup} label={t('--cancel--')} className={styles.contactFormActionsSecondary}/>
                    <OroButton type="primary" label={t('--add--')} className={styles.contactFormActionsPrimary} onClick={handleTaxDetailsUpdate} disabled={disableAddButton()}/>
                </div>
            </Grid>
        </Grid>
      </div>
    </div>
  )
}

export function TaxDetails (props: TaxDetailsProps) {
  return (
    <I18Suspense><TaxDetailsContent {...props}></TaxDetailsContent></I18Suspense>
  )
}
