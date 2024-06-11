/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { AlertCircle, ChevronDown, ChevronUp } from 'react-feather'

import { PaymentDetail, PaymentDetailFormProps, SupplierPaymentDetailsFormProps } from '../BankInfoV3/types'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import Label from '../../controls/atoms/Label'
import Value from '../../controls/atoms/Value'
import { AddressValue, mapCustomFieldValue } from '../../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../../CustomFormDefinition/types/CustomFormModel'
import { BankKey, Option } from './../../Types'
import { COL4, getFormFieldsMap, isFieldOmitted, mapBankAddress } from '../util'
import Title from '../../controls/atoms/Title'
import { AttachmentReadOnly } from '../components/attachment-read-only.component'
import {
  BUSSINESS_EMAIL, PAYMENT_DETAILS, INSTRUCTION, BANK_ADDRESS, BANK_NAME, ACCOUNT_HOLDER, SWIFT_CODE, ATTACHMENT,
  INTREMEDIARY_NAME, canShowBankName, canShowAccountHolderName, canShowAccountHolderAddress, canShowAccountNumber,
  canShowBankCode, canShowInternationalCode, canShowCheckAddress, canShowSwiftCode, canShowBankDocuments,
  canShowIntermediaryBank, canShowAccountType, canShowPaymentAddress, REMITTANCE_ADDR, BANK_DOUCUMENT,
  mapToInternalModeType, areAccountNamesSame, canRespectSwiftCodeConfig, INTREMEDIARY_CODE, BANK_CODE
} from './utils'

import { getAccountTypeDisplayName, getPaymentModeOptions } from './types'
import { Separator } from '../../controls/atoms'
import { OroButton } from '../../controls'
import { Field } from '../types'
import { configurableFields } from './AccountDetails'
import { EncryptedValueReadOnly } from '../../Inputs/text.component'

import ExtractionIcon from './assets/extraction_icon.svg'
import styles from './styles.module.scss'
import './../oro-form-read-only.css'
import { OroTooltip } from '../../Tooltip/tooltip.component'

export function SupplierPaymentDetailsReadOnly(props: SupplierPaymentDetailsFormProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  function loadFile(fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <Grid container spacing={2} mb={2}>
      {props.formData.businessEmail && <>
        <Grid item xs={4}>
          <Label>{t('Accounts receivable email')}</Label>
        </Grid>
        <Grid item xs={8}>
          <Value>
            {mapCustomFieldValue({
              value: props.formData.businessEmail,
              fieldName: BUSSINESS_EMAIL,
              trackedAttributes: props.trackedAttributes,
              fieldType: CustomFieldType.string
            }) || '-'}
          </Value>
        </Grid>
      </>}
      <Grid item xs={COL4}>
        <div className={styles.paymentOptionListTitle}>
          {t("--paymentOptions--")}
        </div>
      </Grid>
      {(!props.formData?.paymentDetails || props.formData?.paymentDetails?.length === 0) && (
        <Grid item xs={12}>
          <label className={styles.message}>{t('--noNewPaymentOptionsAdded--')}</label>
        </Grid>
      )}

      {props.formData?.paymentDetails && props.formData.paymentDetails.length > 0 && props.formData.paymentDetails.map((paymentOption, i) =>
        <Grid container item xs={COL4} key={i}>
          <PaymentDetailBox
            title={(props.formData.paymentDetails.length > 1) && t('--paymentOption--', { number: i + 1 })}
            index={i}
            last={i === (props.formData.paymentDetails.length - 1)}
            hideCompanyEntitySelector={props.formData.paymentDetails.length < 2}
            data={paymentOption}
            fields={props.fields}
            showExtractedFields
            countryOptions={props.countryOptions}
            trackedAttributes={props.trackedAttributes}
            partnerName={props.partnerName}
            partnerCountry={props.partnerCountry}
            bankKeys={props.bankKeys}
            showHideButton={true}
            getCountryBankKeys={props.getCountryBankKeys}
            loadDocument={(fieldName, type, fileName) => loadFile(`${PAYMENT_DETAILS}[${i}].${fieldName}`, type, fileName)}
          />
        </Grid>
      )}

      {props.formData.instruction && <>
        <Grid item xs={COL4}>
          <Separator />
        </Grid>
        <Grid item xs={4}>
          <Label>{t('--additionalComments-')}</Label>
        </Grid>
        <Grid item xs={8}>
          <Value>
            {mapCustomFieldValue({
              value: props.formData.instruction,
              fieldName: INSTRUCTION,
              trackedAttributes: props.trackedAttributes,
              fieldType: CustomFieldType.string
            }) || '-'}
          </Value>
        </Grid></>}
    </Grid>
  )
}

interface PaymentDetailBoxProps extends PaymentDetailFormProps {
  showExtractedFields?: boolean
}

export function PaymentDetailBox (props: PaymentDetailBoxProps) {
  const PaymentModeOptions = getPaymentModeOptions()
  const BankProofDisplayNames = {
    bankletter: getI18Text('--bankletter--'),
    estatement: getI18Text('--estatement--'),
    letterhead: getI18Text('--letterhead--'),
    invoicewithbank: getI18Text('--invoicewithbank--'),
    voidcheck: getI18Text('--voidcheck--'),
    quotation: getI18Text('--quotation--'),
    contract: getI18Text('--contract--'),
    proformainvoice: getI18Text('--proformainvoice--'),
    blankinvoice: getI18Text('--blankinvoice--'),
    debitform: getI18Text('--debitform--'),
    banklettermex: getI18Text('--banklettermex--'),
    estatementmex: getI18Text('--estatementmex--'),
    iban: getI18Text('--iban--'),
    rib: getI18Text('--rib--'),
    bankpermitchina: getI18Text('--bankpermitchina--'),
    supplierbankletterchina: getI18Text('--supplierbankletterchina--'),
    bankconfirmation: getI18Text('--bankconfirmation--'),
    bankpassbook: getI18Text('--bankpassbook--')
  }

  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [expanded, setExpanded] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  const [bankCountry, setBankCountry] = useState<Option>()
  const [bankTrackedCountry, setBankTrackedCountry] = useState<Option>()
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail>()
  const trackedValue = props.trackedAttributes?.diffs?.listDiffs?.paymentDetails

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, configurableFields))
    }
  }, [props.fields])

  useEffect(() => {
    setExpanded(props.hideCompanyEntitySelector)
  }, [props.hideCompanyEntitySelector])

  useEffect(() => {
    const country = mapBankAddress(props.data?.bankInformation?.bankAddress)?.alpha2CountryCode
    const matchingEntry = props.countryOptions?.find(entry => entry.path === country)
    setBankCountry(matchingEntry)
    const trackedCountry = trackedValue?.itemDiffs[0]?.original?.bankInformation?.bankAddress?.alpha2CountryCode
    const matchingTrackedEntry = props.countryOptions?.find(entry => entry.path === trackedCountry)
    setBankTrackedCountry(matchingTrackedEntry)
  }, [props.data, props.countryOptions])

  useEffect(() => {
    if (props.data && bankCountry?.path && props.getCountryBankKeys) {
      props.getCountryBankKeys(bankCountry?.path)
        .then(res => {
          setPaymentDetail({ ...props.data, bankKeys: res })
        })
        .catch(err => {
          console.warn('Error fetching bank keys. ', err)
        })
    }
  }, [props.data, bankCountry])

  function getBankKeyName(key: BankKey): string {
    return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
  }

  function getAccountTypeName(type: string): string {
    return getAccountTypeDisplayName(type)
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function getPayoutCurrencies (): string {
    const entityCurrencies = paymentDetail?.paymentModes?.map(mode => mode.currencyCode) || []
    const currencies = paymentDetail?.paymentModes?.[0]?.additionalCurrencyRequested
      ? [...entityCurrencies, paymentDetail?.paymentModes?.[0]?.additionalCurrencyRequested]
      : entityCurrencies
    const uniqueCurrencies = Array.from(new Set(currencies)) // extract unique
    return uniqueCurrencies?.join(', ') || '-'
  }

  function getPrimaryKeyName (): string | undefined {
    if (canShowInternationalCode(paymentDetail)) {
      return getBankKeyName(props.data.bankInformation?.internationalKey) || t("International bank code")
    } else if (canShowBankCode(paymentDetail)) {
      return getBankKeyName(props.data.bankInformation?.key) || t("Bank code")
    }
  }

  return (<>
    <Grid container spacing={2} pb={2} pr={2} className={styles.paymentOption} >
      <Grid item xs={COL4}>
        <div className={styles.title}>
          {props.title && <div className={styles.optionNumber}>{props.title}</div>}
          <div className={styles.modeWrapper}>{PaymentModeOptions.find(option => option.code === mapToInternalModeType(paymentDetail?.paymentModes[0]?.type))?.displayName}</div>
        </div>
      </Grid>

      <Grid item xs={4}>
        <Label>{t("Bank country")}</Label>
      </Grid>
      <Grid item xs={8}>
        <div className={styles.row}>
          <Value>
            {mapCustomFieldValue({
              value: bankCountry?.displayName || '-',
              fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${BANK_ADDRESS}`,
              trackedAttributes: {val: bankCountry?.displayName !== bankTrackedCountry?.displayName ? bankTrackedCountry?.displayName : ''},
              fieldType: CustomFieldType.string
            }) || '-'}
          </Value>
          {bankCountry?.path && props.partnerCountry && (bankCountry.path !== props.partnerCountry) && 
            <Mismatched />}
        </div>
      </Grid>

      <Grid item xs={4}>
        <Label>{t("--payoutCurrency--")}</Label>
      </Grid>
      <Grid item xs={8}>
        <div className={styles.row}>
          <Value>
            {mapCustomFieldValue({
              value: getPayoutCurrencies(),
              fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${BANK_ADDRESS}`,
              trackedAttributes: {val: getPayoutCurrencies() !== trackedValue?.itemDiffs[0]?.original?.paymentModes[0].paymentCurrencyCode ? trackedValue?.itemDiffs[0]?.original?.paymentModes[0].paymentCurrencyCode : ''},
              fieldType: CustomFieldType.string
            }) || '-'}
          </Value>
          {paymentDetail?.paymentModes?.[0]?.additionalCurrencyRequested && 
            <CurrencyRequested currency={paymentDetail?.paymentModes?.[0]?.additionalCurrencyRequested} />}
        </div>
      </Grid>

      {expanded && paymentDetail && (paymentDetail.paymentModes?.[0]?.type !== 'directDebit') && <>
        <Grid item xs={COL4}>
          <Separator secondary />
        </Grid>

        <Grid item xs={12}>
          <Title>{t('Account details')}</Title>
        </Grid>

        {canShowPaymentAddress(paymentDetail) && <>
          <Grid item xs={4}>
            <Label>Bankgiro</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>
              <EncryptedValueReadOnly value={props.data.bankInformation?.paymentAddress} />
            </Value>
          </Grid>
        </>}

        {canShowInternationalCode(paymentDetail) && <>
          <Grid item xs={4}>
            <Label>{getBankKeyName(props.data.bankInformation?.internationalKey) || t("International bank code")}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>
              {(props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)
                ? <EncryptedValueReadOnly value={props.data.bankInformation?.encryptedInternationalBankCode} />
                : (props.data.bankInformation?.internationalCode || '-')}
            </Value>
          </Grid>
        </>}

        {(props.showExtractedFields || canShowBankCode(paymentDetail)) && <>
          <Grid item xs={4}>
            <Label>{getBankKeyName(props.data.bankInformation?.key) || t("Bank code")}</Label>
          </Grid>
          <Grid item xs={8}>
          <div className={styles.row}>
              <Value>
                {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue)
                  ? <EncryptedValueReadOnly value={props.data.bankInformation?.encryptedBankCode} />
                  : <>{mapCustomFieldValue({
                    value: props.data.bankInformation?.bankCode || '-',
                    fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${BANK_CODE}`,
                    trackedAttributes: {val: props.data.bankInformation?.bankCode !== trackedValue?.itemDiffs[0]?.original?.bankInformation?.bankCode ? trackedValue?.itemDiffs[0]?.original?.bankInformation?.bankCode : ''},
                    fieldType: CustomFieldType.string
                  }) || '-'}</>
                  }
              </Value>
              {props.data?.bankInformation?.bankCodeAutoGenerated && 
                  <Extracted bankCode={getPrimaryKeyName()} />}
            </div>
          </Grid>
        </>}

        {canShowAccountType(paymentDetail) && <>
          <Grid item xs={4}>
            <Label>{t("--accountType--")}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>
              {getAccountTypeName(props.data?.bankInformation?.accountType) || '-'}
            </Value>
          </Grid>
        </>}

        {(props.showExtractedFields || canShowAccountNumber(paymentDetail)) && <>
          <Grid item xs={4}>
            <Label>{t("Account number")}</Label>
          </Grid>
          <Grid item xs={8}>
            <div className={styles.row}>
              <Value>
                <EncryptedValueReadOnly value={props.data.bankInformation?.accountNumber} />
              </Value>
              {props.data?.bankInformation?.accountNumberAutoGenerated && 
                <Extracted bankCode={getPrimaryKeyName()} />}
            </div>
          </Grid>
        </>}

        {canShowAccountHolderName(paymentDetail) && <>
          <Grid item xs={4}>
            <Label>{t("--nameOnTheAccount--")}</Label>
          </Grid>
          <Grid item xs={8}>
            <div className={styles.row}>
              <Value>
                {mapCustomFieldValue({
                  value: props.data?.bankInformation?.accountHolder || '-',
                  fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${ACCOUNT_HOLDER}`,
                  trackedAttributes: {val: props.data?.bankInformation?.accountHolder !== trackedValue?.itemDiffs[0]?.original?.bankInformation?.accountHolder ? trackedValue?.itemDiffs[0]?.original?.bankInformation?.accountHolder : ''},
                  fieldType: CustomFieldType.string
                }) || '-'}
              </Value>
              {props.data?.bankInformation?.accountHolder && props.partnerName && !areAccountNamesSame(props.data.bankInformation.accountHolder, props.partnerName) && 
                <Mismatched />}
            </div>
          </Grid>
        </>}

        {!isFieldOmitted(fieldMap, REMITTANCE_ADDR) && canShowAccountHolderAddress(paymentDetail) && props.data?.bankInformation?.accountHolderAddress?.alpha2CountryCode && <>
          <Grid item xs={4}>
            <Label>{t("--addressOnAccount--")}</Label>
          </Grid>
          <Grid item xs={8}>
            <AddressValue
              value={props.data?.bankInformation?.accountHolderAddress}
            />
          </Grid>
        </>}

        {(props.showExtractedFields || canShowBankName(paymentDetail)) && <>
          <Grid item xs={4}>
            <Label>{t("Bank name")}</Label>
          </Grid>
          <Grid item xs={8}>
            <div className={styles.row}>
              <Value>
                {mapCustomFieldValue({
                  value: props.data?.bankInformation?.bankName || '-',
                  fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${BANK_NAME}`,
                  trackedAttributes: {val: props.data?.bankInformation?.bankName !== trackedValue?.itemDiffs[0]?.original?.bankInformation?.bankName ? trackedValue?.itemDiffs[0]?.original?.bankInformation?.bankName : ''},
                  fieldType: CustomFieldType.string
                }) || '-'}
              </Value>
              {props.data?.bankInformation?.bankNameAutoGenerated && 
                <Extracted bankCode={getPrimaryKeyName()} />}
            </div>
          </Grid>
        </>}

        {(props.showExtractedFields || (canShowSwiftCode(paymentDetail) || (canRespectSwiftCodeConfig(paymentDetail) && !isFieldOmitted(fieldMap, SWIFT_CODE)))) && <>
          <Grid item xs={4}>
            <Label>SWIFT</Label>
          </Grid>
          <Grid item xs={8}>
            <div className={styles.row}>
              <Value>
                {mapCustomFieldValue({
                  value: props.data?.bankInformation?.swiftCode,
                  fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${SWIFT_CODE}`,
                  trackedAttributes: {val: props.data?.bankInformation?.swiftCode !== trackedValue?.itemDiffs[0]?.original?.bankInformation?.swiftCode ? trackedValue?.itemDiffs[0]?.original?.bankInformation?.swiftCode : ''},
                  fieldType: CustomFieldType.string
                }) || '-'}
              </Value>
              {props.data?.bankInformation?.swiftCodeAutoGenerated && 
                <Extracted bankCode={getPrimaryKeyName()} />}
            </div>
          </Grid>
        </>}

        {canShowCheckAddress(paymentDetail) && <>
          <Grid item xs={4}>
            <Label>{t("--checkDeliveryAddress--")}</Label>
          </Grid>
          <Grid item xs={8}>
            <AddressValue
              value={props.data?.bankInformation?.checkDeliveryAddress}
            />
          </Grid>
        </>}

        {((!isFieldOmitted(fieldMap, BANK_DOUCUMENT) && canShowBankDocuments(paymentDetail) && props.data?.attachment) || (canShowIntermediaryBank(paymentDetail) && props.data.intermediaryBankRequired)) &&
          <Grid item xs={COL4}>
            <Separator secondary />
          </Grid>}

        {!isFieldOmitted(fieldMap, BANK_DOUCUMENT) && canShowBankDocuments(paymentDetail) && props.data?.attachment && <>
          <Grid item xs={4}>
            <Label>{BankProofDisplayNames[props.data?.documentType] || t("--selectProofOfDucumentForBank--")}</Label>
          </Grid>
          <Grid item xs={8}>
            <AttachmentReadOnly
              attachment={props.data?.attachment}
              onPreview={() => loadFile(ATTACHMENT, props.data?.attachment?.mediatype, props.data?.attachment?.filename)}
            />
          </Grid>
        </>}

        {canShowIntermediaryBank(paymentDetail) && props.data.intermediaryBankRequired && <>
          <Grid item xs={4}>
            <Label>{t("Intermediary bank name")}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>
              {mapCustomFieldValue({
                value: props.data?.intermediaryBankInformation?.bankName || '-',
                fieldName: `${PAYMENT_DETAILS}[${props.index}].intermediaryBankInformation.${INTREMEDIARY_NAME}`,
                trackedAttributes: {val: props.data?.intermediaryBankInformation?.bankName !== trackedValue?.itemDiffs[0]?.original?.intermediaryBankInformation.intermediaryBankName ? trackedValue?.itemDiffs[0]?.original?.intermediaryBankInformation.intermediaryBankName : ''},
                fieldType: CustomFieldType.string
              }) || '-'}
            </Value>
          </Grid>

          <Grid item xs={4}>
            <Label>{t("Intermediary bank address")}</Label>
          </Grid>
          <Grid item xs={8}>
            <AddressValue
              value={props.data?.intermediaryBankInformation?.bankAddress}
            />
          </Grid>

          <Grid item xs={4}>
            <Label>{getBankKeyName(props.data.intermediaryBankInformation?.key) || t("Intermediary bank code")}</Label>
          </Grid>
          <Grid item xs={8}>
            <Value>
              {mapCustomFieldValue({
                  value: props.data.intermediaryBankInformation?.bankCode || '-',
                  fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${INTREMEDIARY_CODE}`,
                  trackedAttributes: {val: props.data.intermediaryBankInformation?.bankCode !== trackedValue?.itemDiffs[0]?.original?.intermediaryBankInformation?.bankCode ? trackedValue?.itemDiffs[0]?.original?.intermediaryBankInformation?.bankCode : ''},
                  fieldType: CustomFieldType.string
                }) || '-'}
            </Value>
          </Grid>
        </>}
      </>}

      {props.showHideButton && (paymentDetail?.paymentModes?.[0]?.type !== 'directDebit') &&
        <OroButton
          type='link'
          label={expanded ? t('--hideDetails--') : t('--viewAllDetails--')}
          icon={expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          iconOrientation='right'
          fontWeight={'semibold'}
          onClick={() => setExpanded(!expanded)}
        />}
    </Grid>

    {!props.last &&
      <Grid item xs={COL4}>
        <Separator />
      </Grid>}
  </>)
}

function Extracted (props: { bankCode?: string }) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  return (
    <Value>
      <div className={styles.extracted}>
        <OroTooltip title={t('--extractedFrom--', { bankCode: props.bankCode || 'bank details' })} placement="right">
          <img src={ExtractionIcon} />
        </OroTooltip>
      </div>
    </Value>
  )
}

function Mismatched () {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  return (
    <Value>
      <div className={styles.mismatched}>
        <AlertCircle color='var(--warm-misc-bold-cherry)' size={16} />
        <div className={styles.msg}>{t('--doesNotMatchCompanyInfo--')}</div>
      </div>
    </Value>
  )
}

function CurrencyRequested (props: { currency: string }) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  return (
    <Value>
      <div className={styles.currencyRequested}>
        <AlertCircle color='var(--warm-neutral-shade-300)' size={16} />
        <div className={styles.msg}>{t('--requestedPaypoutIn--', { currency: props.currency })}</div>
      </div>
    </Value>
  )
}
