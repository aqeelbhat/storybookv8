import React from 'react'
import moment from 'moment'

import { Cost, SoftwareFormData } from './types'
import { Option } from '../Inputs'
import { mapCurrencyToSymbol } from '../util'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { Attachment } from '../Types'

import './email-templateV2.css'
import DefaultLogo from './assets/default-software-logo.svg'
import { getSessionLocale } from '../sessionStorage'

function getCostDisplayVal (cost?: Cost, prefix?: string) {
  if (cost?.amount) {
    const formattedAmount = !isNaN(Number(cost.amount))
      ? Number(cost.amount).toLocaleString(getSessionLocale())
      : ''

    return `${prefix || ''} ${mapCurrencyToSymbol(cost.currency)}${formattedAmount}`
  } else {
    return ''
  }
}

function getLocalDateString (utcDate?: string): string {
  const date = new Date(utcDate)
  return moment(date).isValid() ? moment(date).format('MMM DD, YYYY') : ''
}


export function SoftwareFormEmail (props: { formData: SoftwareFormData, typeOfPurchaseOptions: Option[], loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string> }) {
  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <table className="emailForm">
      <tbody>
        <tr>
          <td className='formTitle'>Software Request</td>
        </tr>

        <tr>
          <td>
            <table>
              <tbody>
                <tr><td><div className="formQuestion pdB4">Type of purchase</div></td></tr>
                <tr><td><div className="formAnswer pdB12">{props.typeOfPurchaseOptions?.find(option => option.path === props.formData?.typeOfPurchase?.path)?.displayName || '-'}</div></td></tr>
              </tbody>
            </table>
          </td>
        </tr>

        { props.formData?.typeOfPurchase?.path === 'new' &&
          <>
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">New software(s)</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.softwares && props.formData.softwares.length > 0 && props.formData.softwares.map((software, i) =>
                        <table key={i} className="softwareCardEmail">
                          <tbody>
                            <tr>
                              <td rowSpan={(software.companyName || (software.categoryNames && software.categoryNames.length > 0)) ? 2 : 1} className={'profile'}>
                                <img src={software.image || DefaultLogo} />
                              </td>
                              <td>
                                <span className={'name'}>{software.name}</span>
                                {software.isPreferred && <span className={'preferredTag'}>Selected</span>}
                              </td>
                            </tr>
                            {(software.companyName || (software.categoryNames && software.categoryNames.length > 0)) &&
                              <tr>
                                <td>
                                  {software.companyName && <span className={'property'}>{software.companyName}</span>}
                                  {software.categoryNames && software.categoryNames.length > 0 && <span className={'property'}>{software.categoryNames.join(', ')}</span>}
                                </td>
                              </tr>}
                          </tbody>
                        </table>) || '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Business need</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">{props.formData?.description || '-'}</div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Replacing an existing software?</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">{props.formData?.replacingExisting ? 'Yes' : 'No'}</div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            { props.formData?.replacingExisting &&
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Software to be replaced</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.existingSoftware
                        ? <table className="softwareCardEmail">
                            <tbody>
                              <tr>
                                <td rowSpan={(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) ? 2 : 1} className={'profile'}>
                                  <div className={'profile'}>
                                    <img src={props.formData.existingSoftware.image || DefaultLogo} />
                                  </div>
                                </td>
                                <td>
                                  <span className={'name'}>{props.formData.existingSoftware.name}</span>
                                </td>
                              </tr>
                              {(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) &&
                                <tr>
                                  <td>
                                    {props.formData.existingSoftware.companyName && <span className={'property'}>{props.formData.existingSoftware.companyName}</span>}
                                    {props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0 && <span className={'property'}>{props.formData.existingSoftware.categoryNames.join(', ')}</span>}
                                  </td>
                                </tr>}
                            </tbody>
                          </table>
                        : '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>}

            { props.formData?.replacingExisting &&
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Existing contract(s) to replace</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.existingContracts && props.formData.existingContracts.length > 0 && props.formData.existingContracts.map((contract, i) =>
                        <table className="softwareCardEmail contractCard" key={i}>
                          <tbody>
                            <tr>
                              <td>
                                <span className={'name'}>{contract.name}</span>
                                {contract.contractId && <span className={'contractId'}>{contract.contractId}</span>}
                              </td>
                            </tr>
                            {contract.description &&
                              <tr>
                                <td>
                                  <div className={'property'}>{contract.description}</div>
                                </td>
                              </tr>}
                            {(contract.value?.amount || contract.recurringSpend?.amount) &&
                              <tr>
                                <td>
                                  {contract.recurringSpend?.amount && <span className={'property'}>{getCostDisplayVal(contract.recurringSpend)} / year</span>}
                                  {contract.value?.amount && <span className={'property'}>{getCostDisplayVal(contract.value, 'TCV:')}</span>}
                                </td>
                              </tr>}
                            {(contract.startDate || contract.endDate) &&
                              <tr>
                                <td>
                                  <span className={'property'}>{`${getLocalDateString(contract.startDate)} - ${getLocalDateString(contract.endDate)}`}</span>
                                </td>
                              </tr>}
                            {contract.attachments && contract.attachments.length > 0 &&
                              <tr>
                                <td>
                                  {contract.attachments.map((attachment, i) =>
                                    <div className={'attachment'} key={i}>
                                      <AttachmentReadOnly
                                        attachment={attachment as Attachment}
                                        onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
                                      />
                                    </div>)}
                                </td>
                              </tr>}
                          </tbody>
                        </table>) || '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>}
          </>}

          { props.formData?.typeOfPurchase?.path === 'additional' &&
          <>
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Software to add licenses to</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.existingSoftware
                        ? <table className="softwareCardEmail">
                            <tbody>
                              <tr>
                                <td rowSpan={(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) ? 2 : 1} className={'profile'}>
                                  <div className={'profile'}>
                                    <img src={props.formData.existingSoftware.image || DefaultLogo} />
                                  </div>
                                </td>
                                <td>
                                  <span className={'name'}>{props.formData.existingSoftware.name}</span>
                                </td>
                              </tr>
                              {(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) &&
                                <tr>
                                  <td>
                                    {props.formData.existingSoftware.companyName && <span className={'property'}>{props.formData.existingSoftware.companyName}</span>}
                                    {props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0 && <span className={'property'}>{props.formData.existingSoftware.categoryNames.join(', ')}</span>}
                                  </td>
                                </tr>}
                            </tbody>
                          </table>
                        : '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Additional license quantity</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData.additionalLicensesCount || '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Business need</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">{props.formData?.description || '-'}</div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Know which contract to add more licenses to?</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">{props.formData?.knowContract ? 'Yes' : 'No'}</div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            { props.formData?.knowContract &&
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Contract to add licenses to</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.existingContracts && props.formData.existingContracts.length > 0 && props.formData.existingContracts.map((contract, i) =>
                        <table className="softwareCardEmail contractCard" key={i}>
                          <tbody>
                            <tr>
                              <td>
                                <span className={'name'}>{contract.name}</span>
                                {contract.contractId && <span className={'contractId'}>{contract.contractId}</span>}
                              </td>
                            </tr>
                            {contract.description &&
                              <tr>
                                <td>
                                  <div className={'property'}>{contract.description}</div>
                                </td>
                              </tr>}
                            {(contract.value?.amount || contract.recurringSpend?.amount) &&
                              <tr>
                                <td>
                                  {contract.recurringSpend?.amount && <span className={'property'}>{getCostDisplayVal(contract.recurringSpend)} / year</span>}
                                  {contract.value?.amount && <span className={'property'}>{getCostDisplayVal(contract.value, 'TCV:')}</span>}
                                </td>
                              </tr>}
                            {(contract.startDate || contract.endDate) &&
                              <tr>
                                <td>
                                  <span className={'property'}>{`${getLocalDateString(contract.startDate)} - ${getLocalDateString(contract.endDate)}`}</span>
                                </td>
                              </tr>}
                            {contract.attachments && contract.attachments.length > 0 &&
                              <tr>
                                <td>
                                  {contract.attachments.map((attachment, i) =>
                                    <div className={'attachment'} key={i}>
                                      <AttachmentReadOnly
                                        attachment={attachment as Attachment}
                                        onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
                                      />
                                    </div>)}
                                </td>
                              </tr>}
                          </tbody>
                        </table>) || '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>}
          </>}

          { props.formData?.typeOfPurchase?.path === 'renew' &&
          <>
            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Software to renew contracts for</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.existingSoftware
                        ? <table className="softwareCardEmail">
                            <tbody>
                              <tr>
                                <td rowSpan={(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) ? 2 : 1} className={'profile'}>
                                  <div className={'profile'}>
                                    <img src={props.formData.existingSoftware.image || DefaultLogo} />
                                  </div>
                                </td>
                                <td>
                                  <span className={'name'}>{props.formData.existingSoftware.name}</span>
                                </td>
                              </tr>
                              {(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) &&
                                <tr>
                                  <td>
                                    {props.formData.existingSoftware.companyName && <span className={'property'}>{props.formData.existingSoftware.companyName}</span>}
                                    {props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0 && <span className={'property'}>{props.formData.existingSoftware.categoryNames.join(', ')}</span>}
                                  </td>
                                </tr>}
                            </tbody>
                          </table>
                        : '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Contract(s) to be renewed</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">
                      {props.formData?.existingContracts && props.formData.existingContracts.length > 0 && props.formData.existingContracts.map((contract, i) =>
                        <table className="softwareCardEmail contractCard" key={i}>
                          <tbody>
                            <tr>
                              <td>
                                <span className={'name'}>{contract.name}</span>
                                {contract.contractId && <span className={'contractId'}>{contract.contractId}</span>}
                              </td>
                            </tr>
                            {contract.description &&
                              <tr>
                                <td>
                                  <div className={'property'}>{contract.description}</div>
                                </td>
                              </tr>}
                            {(contract.value?.amount || contract.recurringSpend?.amount) &&
                              <tr>
                                <td>
                                  {contract.recurringSpend?.amount && <span className={'property'}>{getCostDisplayVal(contract.recurringSpend)} / year</span>}
                                  {contract.value?.amount && <span className={'property'}>{getCostDisplayVal(contract.value, 'TCV:')}</span>}
                                </td>
                              </tr>}
                            {(contract.startDate || contract.endDate) &&
                              <tr>
                                <td>
                                  <span className={'property'}>{`${getLocalDateString(contract.startDate)} - ${getLocalDateString(contract.endDate)}`}</span>
                                </td>
                              </tr>}
                            {contract.attachments && contract.attachments.length > 0 &&
                              <tr>
                                <td>
                                  {contract.attachments.map((attachment, i) =>
                                    <div className={'attachment'} key={i}>
                                      <AttachmentReadOnly
                                        attachment={attachment as Attachment}
                                        onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
                                      />
                                    </div>)}
                                </td>
                              </tr>}
                          </tbody>
                        </table>) || '-'}
                    </div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table>
                  <tbody>
                    <tr><td><div className="formQuestion pdB4">Business need</div></td></tr>
                    <tr><td><div className="formAnswer pdB12">{props.formData?.description || '-'}</div></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </>}

      </tbody>
    </table>
  )
}
