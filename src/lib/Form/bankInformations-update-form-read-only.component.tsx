import React, { useState } from 'react'
import { BankInformationsUpdateFormData, EnumsDataObject, TrackedAttributes } from './types'

import './oro-form-read-only.css'
import { convertAddressToString } from './util'
import { Eye, EyeOff } from 'react-feather'
import { BankKey, Option } from '../Types'
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'
import { AddressValue, mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'

export function BankInformationsUpdateFormReadOnly (props: {data: BankInformationsUpdateFormData, bankKeys?: EnumsDataObject[], isSingleColumnLayout?: boolean, trackedAttributes?: TrackedAttributes}) {
  const [isAccountNumberVisible, setIsAccountNumberVisible] = useState<boolean>(false)
  const trackedValue = props.trackedAttributes?.diffs?.listDiffs?.bankInformations

  function getBankKeyName (key: BankKey): string {
    return props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key
  }

  return (
    <div id="bankInfoUpdateReadOnlyForm">
      {props.data.bankInformations && props.data.bankInformations.length > 0 &&
        props.data.bankInformations.map((bankInformation, i) => {
        
          return (
            
              <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`} key={i}>
                <div className="sectionTitle">{"Bank Account " + (i + 1)}</div>
                <div className="formFields">
                {!bankInformation?.omitAccountNumber &&
                    <div className="keyValuePair">
                      <div className="label">IBAN/Account Number</div>
                      <div className="value">
                        {isAccountNumberVisible
                          ? bankInformation.accountNumber?.unencryptedValue || ''
                          : bankInformation.accountNumber?.maskedValue || '*****'}
                        {isAccountNumberVisible && <Eye className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsAccountNumberVisible(false)} />}
                        {!isAccountNumberVisible && <EyeOff className="showHide" size={20} color={'#ABABAB'} onClick={() => setIsAccountNumberVisible(true)} />}
                      </div>
                  </div>}

                  <div className="keyValuePair">
                    <div className="label">Bank Code</div>
                    <div className="value">{mapCustomFieldValue({value:bankInformation.bankCode, trackedAttributes: {val: trackedValue?.itemDiffs[i]?.original?.bankCode}, fieldType: CustomFieldType.string}) || '-'}</div></div>
                  <div className="keyValuePair">
                    <div className="label">Bank Country</div>
                    <div className="value">{ALPHA2CODES_DISPLAYNAMES[bankInformation.bankAddress?.alpha2CountryCode] || bankInformation.bankAddress?.alpha2CountryCode || '-'}</div>
                  </div>
                  <div className="keyValuePair">
                    <div className="label">Bank Name</div>
                    <div className="value">{mapCustomFieldValue({value:bankInformation.bankName, trackedAttributes: {val: trackedValue?.itemDiffs[i]?.original?.bankName}, fieldType: CustomFieldType.string}) || '-'}</div>
                  </div>
                  <div className="keyValuePair">
                    <div className="label">Remittance Currency</div>
                    <div className="value">{mapCustomFieldValue({value:bankInformation?.currencyCode?.name || '-', trackedAttributes: {val: trackedValue?.itemDiffs[i]?.original?.currencyCode?.name}, fieldType: CustomFieldType.string})}</div>
                  </div>
                  <div className="keyValuePair">
                    <div className="label">Beneficiary name</div>
                    <div className="value">{mapCustomFieldValue({value:bankInformation.accountHolder, trackedAttributes: {val: trackedValue?.itemDiffs[i]?.original?.accountHolder}, fieldType: CustomFieldType.string}) || '-'}</div>
                  </div>
                  <div className="keyValuePair">
                    <div className="label">Beneficiary Account Address</div>
                    <div className="value">{AddressValue({value:bankInformation.accountHolderAddress}) || '-'}</div>
                  </div>
                </div>
              </div>)
      })}
      {/* )} */}
    </div>
  )
}
