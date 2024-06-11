import React, { useState } from 'react'
import { BankInfoFormData, EnumsDataObject, TrackedAttributes } from './types'

import './oro-form-read-only.css'
import { Eye, EyeOff } from 'react-feather'
import { BankKey } from '../Types'
import {AddressValue, mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { NAMESPACES_ENUM, useTranslationHook } from "../i18n";
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'

export function IndividualBankInfoFormReadOnly (props: {data: BankInfoFormData, bankKeys?: EnumsDataObject[], isSingleColumnLayout?: boolean, trackedAttributes?: TrackedAttributes}) {
  const [isAccountNumberVisible, setIsAccountNumberVisible] = useState<boolean>(false)
  const [isBankCodeVisible, setIsBankCodeVisible] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])

  function getBankKeyName (key: BankKey): string {
    return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
  }

  function getBankAccountType (type: string): string {
    if (type === 'checking') {
      return t("Checking")
    } else if (type === 'saving') {
      return t("Saving")
    }
    return '-'
  }

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="sectionTitle">{t("Remittance details")}</div>

      <div className="formFields">
      <div className="keyValuePair">
          <div className="label">{t("Payment/Remittance currency")}</div>   
          <div className="value">{mapCustomFieldValue({value:props.data.bankInformation?.currencyCode?.displayName, fieldName: 'bankInformation', fieldValue: 'currencyCodeStr', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>
      </div>

      <div className="sectionTitle">{t("Bank details")}</div>

      <div className="formFields">

        <div className="keyValuePair">
          <div className="label">{t("Bank name")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.bankInformation?.bankName, fieldName: 'bankInformation', fieldValue: 'bankName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        <div className="keyValuePair">
          <div className="label">{t("Bank address")}</div>
          <div className="value">{AddressValue({value:props.data.bankInformation?.bankAddress}) || '-'}</div>
        </div>

        {props.data.bankInformation?.key && <div className="keyValuePair">
          <div className="label">{getBankKeyName(props.data.bankInformation?.key) || t("Bank code")}</div>
          <div className="value">
            { (props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
              (!isBankCodeVisible ? props.data.bankInformation?.encryptedBankCode?.maskedValue || '*****' : props.data.bankInformation?.encryptedBankCode?.unencryptedValue)}
            { (props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
              isBankCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCodeVisible(false)} />}
            { (props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
              !isBankCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCodeVisible(true)} />}

            { props.data.bankInformation?.bankCode && !(props.data.bankInformation?.encryptedBankCode?.maskedValue || props.data.bankInformation?.encryptedBankCode?.unencryptedValue) &&
              (props.data.bankInformation?.bankCode || '-')}
          </div>
        </div>}

        {props.data.bankInformation?.internationalKey &&
          (props.data.bankInformation?.internationalCode || (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)) &&
          <div className="keyValuePair">
            <div className="label">{getBankKeyName(props.data.bankInformation?.internationalKey) || t("International Bank Code")}</div>
            <div className="value">
              { (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                (!isBankCodeVisible ? props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || '*****' : props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue)}
              { (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                isBankCodeVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCodeVisible(false)} />}
              { (props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                !isBankCodeVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsBankCodeVisible(true)} />}

              { props.data.bankInformation?.internationalCode && !(props.data.bankInformation?.encryptedInternationalBankCode?.maskedValue || props.data.bankInformation?.encryptedInternationalBankCode?.unencryptedValue) &&
                (props.data.bankInformation?.internationalCode || '-')}
            </div>
          </div>}

        {(props.data?.bankInformation?.bankCode !== "iban" as BankKey || props.data?.bankInformation?.internationalCode !== "iban" as BankKey) && (props.data?.bankInformation?.accountNumber?.maskedValue || props.data?.bankInformation?.accountNumber?.unencryptedValue) &&
          <div className="keyValuePair">
            <div className="label">{t("Bank Account Number")}</div>
            <div className="value">
              { isAccountNumberVisible
                ? props.data.bankInformation?.accountNumber?.unencryptedValue || ''
                : props.data.bankInformation?.accountNumber?.maskedValue || '*****'}
              { isAccountNumberVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsAccountNumberVisible(false)} />}
              { !isAccountNumberVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsAccountNumberVisible(true)} />}
            </div>
          </div>}

        <div className="keyValuePair">
          <div className="label">{t("Beneficiary name")}</div>
          <div className="value">{mapCustomFieldValue({value:props.data.bankInformation?.accountHolder, fieldName: 'bankInformation', fieldValue: 'accountHolder', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
        </div>

        {props.data.bankAccountTypeRequired && props.data.bankInformation?.bankAccountType && <div className="keyValuePair">
          <div className="label">{t("Bank Account Type")}</div>
          <div className="value">{getBankAccountType(props.data.bankInformation?.bankAccountType)}</div>
        </div>}

        <div className="keyValuePair">
          <div className="label">{t("Remittance address")}</div>
          <div className="value">{AddressValue({value:props.data.bankInformation?.accountHolderAddress}) || '-'}</div>
        </div>
      </div>

      {props.data.intermediaryBankRequired &&
        <div className="formFields">
          <div className="keyValuePair">
            <div className="label">{t("Intermediary Bank Name")}</div>
            <div className="value">{mapCustomFieldValue({value:props.data.intermediaryBankInformation?.bankName, fieldName: 'intermediaryBankInformation', fieldValue: 'bankName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{t("Intermediary Bank Address")}</div>
            <div className="value">{AddressValue({value:props.data.intermediaryBankInformation?.bankAddress}) || '-'}</div>
          </div>

          <div className="keyValuePair">
            <div className="label">{getBankKeyName(props.data.intermediaryBankInformation?.key) || t("Intermediary Bank Code")}</div>
            <div className="value">{props.data.intermediaryBankInformation?.bankCode || '-'}</div>
          </div>
        </div>}
        <div className="sectionTitle">{t("Instructions")}</div>
        <div className="value">{mapCustomFieldValue({value:props.data.instruction, fieldName: 'instruction', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
    </div>
  )
}
