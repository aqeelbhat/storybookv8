import React, { useState } from 'react'
import { BankInformationsUpdateFormData, EnumsDataObject } from './types'

import './oro-form-read-only.css'
import './email-templateV2.css'
import { convertAddressToString } from './util'
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'
import classnames from 'classnames';

export function BankInformationsUpdateFormEmailTemplate(props: { data: BankInformationsUpdateFormData, bankKeys?: EnumsDataObject[] }) {
  const [isAccountNumberVisible, setIsAccountNumberVisible] = useState<boolean>(false)

  return (
    <>
    <table className="emailForm" >
      <tbody>
        <tr>
          <td>
            <h1 className="formTitle">Payment information update</h1>
          </td>
        </tr>
        {props.data.bankInformations && props.data.bankInformations.length > 0 &&
          props.data.bankInformations.map((bankInformation, i) => {

            return (

              <tr className={classnames(`${(i+1) === props.data.bankInformations.length ? 'lastSection' : ''}`, `${(i===0) ? `firstSection` : ''}`)} key={i}>
                <td className='formSection'>
                  <table>
                    <tbody>
                      <tr><td className="sectionTitle">{"Bank Account " + (i + 1)}</td></tr>
                    </tbody>
                  </table>
                  <table>
                    <tbody>
                      {!bankInformation?.omitAccountNumber &&
                        <tr>
                          <td>
                          <table>
                            <tbody>
                              <tr><td><div className="formQuestion pB4">IBAN/Account Number</div></td></tr>
                              <tr><td><div className="formAnswer pdB12">{isAccountNumberVisible ? bankInformation.accountNumber?.unencryptedValue || '' : bankInformation.accountNumber?.maskedValue || '*****'}</div></td></tr>
                            </tbody>
                          </table>
                          </td>
                        </tr>
                      }
                      <tr>
                        <td>
                        <table>
                          <tbody>
                            <tr><td align="left"><div className="formQuestion pB4">Bank Code</div></td></tr>
                            <tr><td align="left"><div className="formAnswer pdB12">{bankInformation.bankCode || '-'}</div></td></tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <table>
                          <tbody>
                            <tr><td align="left"><div className="formQuestion pB4">Bank Country</div></td></tr>
                            <tr><td align="left"><div className="formAnswer pdB12">{ALPHA2CODES_DISPLAYNAMES[bankInformation.bankAddress?.alpha2CountryCode] || bankInformation.bankAddress?.alpha2CountryCode || '-'}</div></td></tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <table>
                          <tbody>
                            <tr><td align="left"><div className="formQuestion pB4">Bank Name</div></td></tr>
                            <tr><td align="left"><div className="formAnswer pdB12">{bankInformation.bankName || '-'}</div></td></tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <table>
                          <tbody>
                            <tr><td align="left"><div className="formQuestion pB4">Remittance Currency</div></td></tr>
                            <tr><td align="left"><div className="formAnswer pdB12">{bankInformation?.currencyCode?.name || '-'}</div></td></tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <table>
                          <tbody>
                            <tr><td align="left"><div className="formQuestion pB4">Beneficiary name</div></td></tr>
                            <tr><td align="left"><div className="formAnswer pdB12">{bankInformation.accountHolder || '-'}</div></td></tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        <table>
                          <tbody>
                            <tr><td align="left"><div className="formQuestion pB4">Beneficiary Account Address</div></td></tr>
                            <tr><td align="left"><div className={classnames('formAnswer', `${(i+1) === props.data.bankInformations.length ? '' : 'pdB12'}`)}>{convertAddressToString(bankInformation.accountHolderAddress) || '-'}</div></td></tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            )
          })}
      </tbody>
    </table>
  </>
  )
}
