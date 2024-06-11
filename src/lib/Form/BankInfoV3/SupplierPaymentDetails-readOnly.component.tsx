import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import classNames from 'classnames'
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'react-feather'

import { PaymentDetailFormProps, SupplierPaymentDetailsFormProps } from './types'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../../i18n'
import Label from '../../controls/atoms/Label'
import Value from '../../controls/atoms/Value'
import { AddressValue, mapCustomFieldValue } from '../../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../../CustomFormDefinition/types/CustomFormModel'
import { BUSSINESS_EMAIL, INSTRUCTION, PAYMENT_DETAILS } from './SupplierPaymentDetails.component'
import { BankKey, Option } from '../../Types'
import { COL4, mapBankAddress } from '../util'
import { ACCOUNT_HOLDER, ATTACHMENT, BANK_ADDRESS, BANK_NAME, COMPANY_ENTITIES, INTREMEDIARY_NAME, SWIFT_CODE, canShowAccountDetails, canShowCheckDetails, canShowDomesticBankCode, canShowInternationalCode, canShowSwiftCode } from './paymentDetail.component'
import { PaymentModeList } from './paymentModes.component'
import Title from '../../controls/atoms/Title'
import { AttachmentReadOnly } from '../components/attachment-read-only.component'

import styles from './style.module.scss'
import './../oro-form-read-only.css'

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

      {props.formData?.paymentDetails && props.formData.paymentDetails.length > 0 && props.formData.paymentDetails.map((paymentOption, i) =>
        <Grid container item xs={COL4} key={i} className={classNames({ [styles.borderBox]: props.formData.paymentDetails.length > 1, [styles.first]: i === 0 })}>
          <PaymentDetailBox
            title={(props.formData.paymentDetails.length > 1) && t('--paymentOption--', { number: i + 1 })}
            index={i}
            hideCompanyEntitySelector={props.formData.paymentDetails.length < 2}
            data={paymentOption}
            countryOptions={props.countryOptions}
            trackedAttributes={props.trackedAttributes}
            bankKeys={props.bankKeys}
            loadDocument={(fieldName, type, fileName) => loadFile(`${PAYMENT_DETAILS}[${i}].${fieldName}`, type, fileName)}
          />
        </Grid>
      )}

      {props.formData.instruction && <>
        <Grid item xs={4}>
          <Label>{t('Instructions')}</Label>
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

function PaymentDetailBox(props: PaymentDetailFormProps) {
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

  const [expanded, setExpanded] = useState<boolean>(false)
  const [isAccountNumberVisible, setIsAccountNumberVisible] = useState<boolean>(false)
  const [isBankCodeVisible, setIsBankCodeVisible] = useState<boolean>(false)
  const [isBankCode2Visible, setIsBankCode2Visible] = useState<boolean>(false)
  const [isInternationalCodeVisible, setIsInternationalCodeVisible] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  const [bankCountry, setBankCountry] = useState<Option>()

  useEffect(() => {
    setExpanded(props.hideCompanyEntitySelector)
  }, [props.hideCompanyEntitySelector])

  useEffect(() => {
    const country = mapBankAddress(props.data?.bankInformation?.bankAddress)?.alpha2CountryCode
    const matchingEntry = props.countryOptions?.find(entry => entry.path === country)
    setBankCountry(matchingEntry)
  }, [props.data, props.countryOptions])

  function getBankKeyName(key: BankKey): string {
    return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <Grid container spacing={2} pb={2} pr={2} className={styles.paymentOption} >
      {props.title &&
        <Grid item xs={COL4}>
          <div className={styles.title}>
            {expanded
              ? <ChevronDown size={20} color={'var(--warm-neutral-shade-300)'} cursor="pointer" onClick={() => setExpanded(false)} />
              : <ChevronRight size={20} color={'var(--warm-neutral-shade-300)'} cursor="pointer" onClick={() => setExpanded(true)} />}
            {props.title}
          </div>
        </Grid>}

      {expanded &&
        <div className={styles.expanded}>
          <Grid container item spacing={2} xs={COL4}>
            <Grid item xs={4}>
              <Label>{t("Bank country")}</Label>
            </Grid>
            <Grid item xs={8}>
              <Value>
                {mapCustomFieldValue({
                  value: bankCountry?.displayName || '-',
                  fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${BANK_ADDRESS}`,
                  trackedAttributes: props.trackedAttributes,
                  fieldType: CustomFieldType.string
                }) || '-'}
              </Value>
            </Grid>

            {!props.hideCompanyEntitySelector && <>
              <Grid item xs={4}>
                <Label>{t("--entitiesThatCanMakePayments--")}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>
                  {mapCustomFieldValue({
                    value: props.data?.companyEntities?.map(entity => entity.displayName)?.join(', ') || '-',
                    fieldName: `${PAYMENT_DETAILS}[${props.index}].${COMPANY_ENTITIES}`,
                    trackedAttributes: props.trackedAttributes,
                    fieldType: CustomFieldType.string
                  }) || '-'}
                </Value>
              </Grid>
            </>}

            <Grid item xs={12}>
              <PaymentModeList
                data={props.data?.paymentModes}
                bankCountry={bankCountry?.path || props.data?.bankInformation?.bankAddress?.alpha2CountryCode}
              />
            </Grid>

            <Grid item xs={12}>
              <Title>{t('Account details')}</Title>
            </Grid>

            {canShowAccountDetails(props.data?.paymentModes) && <>
              <Grid item xs={4}>
                <Label>{t("Bank name")}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>
                  {mapCustomFieldValue({
                    value: props.data?.bankInformation?.bankName || '-',
                    fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${BANK_NAME}`,
                    trackedAttributes: props.trackedAttributes,
                    fieldType: CustomFieldType.string
                  }) || '-'}
                </Value>
              </Grid>
            </>}

            {(canShowAccountDetails(props.data?.paymentModes) || canShowCheckDetails(props.data?.paymentModes)) && <>
              <Grid item xs={4}>
                <Label>{t("Beneficiary name")}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>
                  {mapCustomFieldValue({
                    value: props.data?.bankInformation?.accountHolder || '-',
                    fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${ACCOUNT_HOLDER}`,
                    trackedAttributes: props.trackedAttributes,
                    fieldType: CustomFieldType.string
                  }) || '-'}
                </Value>
              </Grid>
            </>}

            {canShowAccountDetails(props.data?.paymentModes) && <>
              <Grid item xs={4}>
                <Label>{t("Remittance address")}</Label>
              </Grid>
              <Grid item xs={8}>
                <AddressValue
                  value={props.data?.bankInformation?.accountHolderAddress}
                />
              </Grid>
            </>}

            {canShowAccountDetails(props.data?.paymentModes) && (props.data?.bankInformation?.accountNumber?.maskedValue || props.data?.bankInformation?.accountNumber?.unencryptedValue) && <>
              <Grid item xs={4}>
                <Label>{bankCountry?.path === 'SE' ? "Bankgiro" : t("Account number")}</Label>
              </Grid>
              <Grid item xs={8}>
                <div className={styles.encryptedValue}>
                  {isAccountNumberVisible
                    ? props.data.bankInformation?.accountNumber?.unencryptedValue || ''
                    : props.data.bankInformation?.accountNumber?.maskedValue || '*****'}
                  {isAccountNumberVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsAccountNumberVisible(false)} />}
                  {!isAccountNumberVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsAccountNumberVisible(true)} />}
                </div>
              </Grid>
            </>}

            {canShowAccountDetails(props.data?.paymentModes) && canShowDomesticBankCode(props.data) && props.data.bankInformation?.key && <>
              <Grid item xs={4}>
                <Label>{getBankKeyName(props.data.bankInformation?.key) || t("Bank code")}</Label>
              </Grid>
              <Grid item xs={8}>
                <div className={styles.encryptedValue}>
                  {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                    (!isBankCodeVisible ? props.data.bankInformation?.encryptedBankCode?.maskedValue || '*****' : props.data.bankInformation?.encryptedBankCode?.unencryptedValue)}
                  {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                    isBankCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCodeVisible(false)} />}
                  {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                    !isBankCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCodeVisible(true)} />}
                </div>

                {props.data.bankInformation?.bankCode && !(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                  (props.data.bankInformation?.bankCode || '-')}
              </Grid>
            </>}

            {canShowAccountDetails(props.data?.paymentModes) && canShowDomesticBankCode(props.data) && props.data.bankInformation?.key2 && <>
              <Grid item xs={4}>
                <Label>{getBankKeyName(props.data.bankInformation?.key2) || t("Bank code")}</Label>
              </Grid>
              <Grid item xs={8}>
                <div className={styles.encryptedValue}>
                  {(props.data.bankInformation?.encryptedBankCode2?.maskedValue || props.data.bankInformation?.encryptedBankCode2?.unencryptedValue) &&
                    (!isBankCode2Visible ? props.data.bankInformation?.encryptedBankCode2?.maskedValue || '*****' : props.data.bankInformation?.encryptedBankCode2?.unencryptedValue)}
                  {(props.data.bankInformation?.encryptedBankCode2?.maskedValue || props.data.bankInformation?.encryptedBankCode2?.unencryptedValue) &&
                    isBankCode2Visible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCode2Visible(false)} />}
                  {(props.data.bankInformation?.encryptedBankCode2?.maskedValue || props.data.bankInformation?.encryptedBankCode2?.unencryptedValue) &&
                    !isBankCode2Visible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCode2Visible(true)} />}
                </div>

                {props.data.bankInformation?.bankCode2 && !(props.data.bankInformation?.encryptedBankCode2?.maskedValue || props.data.bankInformation?.encryptedBankCode2?.unencryptedValue) &&
                  (props.data.bankInformation?.bankCode2 || '-')}
              </Grid>
            </>}

            {canShowAccountDetails(props.data?.paymentModes) && canShowInternationalCode(props.data) && props.data.bankInformation?.internationalKey && <>
              <Grid item xs={4}>
                <Label>{getBankKeyName(props.data.bankInformation?.internationalKey) || t("International bank code")}</Label>
              </Grid>
              <Grid item xs={8}>
                <div className={styles.encryptedValue}>
                  {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                    (!isInternationalCodeVisible ? props.data.bankInformation?.encryptedBankCode?.maskedValue || '*****' : props.data.bankInformation?.encryptedBankCode?.unencryptedValue)}
                  {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                    isInternationalCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsInternationalCodeVisible(false)} />}
                  {(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
                    !isInternationalCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsInternationalCodeVisible(true)} />}
                </div>

                {props.data.bankInformation?.internationalCode && !(props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                  (props.data.bankInformation?.internationalCode || '-')}
              </Grid>
            </>}

            {canShowAccountDetails(props.data?.paymentModes) && canShowSwiftCode(props.data) && props.data?.bankInformation?.swiftCode && <>
              <Grid item xs={4}>
                <Label>SWIFT</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>
                  {mapCustomFieldValue({
                    value: props.data?.bankInformation?.swiftCode,
                    fieldName: `${PAYMENT_DETAILS}[${props.index}].bankInformation.${SWIFT_CODE}`,
                    trackedAttributes: props.trackedAttributes,
                    fieldType: CustomFieldType.string
                  }) || '-'}
                </Value>
              </Grid>
            </>}

            {canShowCheckDetails(props.data?.paymentModes) && <>
              <Grid item xs={4}>
                <Label>{t("--checkDeliveryAddress--")}</Label>
              </Grid>
              <Grid item xs={8}>
                <AddressValue
                  value={props.data?.bankInformation?.checkDeliveryAddress}
                />
              </Grid>
            </>}

            {props.data?.attachment && <>
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

            {props.data.intermediaryBankRequired && <>
              <Grid item xs={4}>
                <Label>{t("Intermediary bank name")}</Label>
              </Grid>
              <Grid item xs={8}>
                <Value>
                  {mapCustomFieldValue({
                    value: props.data?.intermediaryBankInformation?.bankName || '-',
                    fieldName: `${PAYMENT_DETAILS}[${props.index}].intermediaryBankInformation.${INTREMEDIARY_NAME}`,
                    trackedAttributes: props.trackedAttributes,
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
                  {props.data.intermediaryBankInformation?.bankCode || '-'}
                </Value>
              </Grid>
            </>}
          </Grid>
        </div>}

      {!expanded && <>
        <Grid item xs={COL4}>
          <div className={styles.card}>
            <div className={styles.primary}>
              {[
                props.data?.bankInformation?.bankName || props.data?.bankInformation?.accountHolder || '-',
                bankCountry?.displayName || '-'
              ].join(', ')}
            </div>
            <div className={styles.secondary}>
              <div className={styles.key}>Entities:&nbsp;</div>
              <div className={styles.values}>
                {props.data?.companyEntities?.map(entity => entity.displayName)?.join(', ') || '-'}
              </div>
            </div>
          </div>
        </Grid>
      </>}
    </Grid>
  )
}
