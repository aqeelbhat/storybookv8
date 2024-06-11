import React from 'react'
import moment from 'moment'

import { Cost, SoftwareFormData, TrackedAttributes } from './types'
import { Option } from '../Inputs'
import { mapCurrencyToSymbol } from '../util'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { Attachment } from '../Types'

import './oro-form-read-only.css'
import DefaultLogo from './assets/default-software-logo.svg'
import { getLocalDateString } from './util'
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues'
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel'
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


export function SoftwareFormReadOnly (props: {
  formData: SoftwareFormData,
  typeOfPurchaseOptions: Option[],
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob | string>,
  isSingleColumnLayout?: boolean,
  trackedAttributes?: TrackedAttributes
}
) {
  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

      <div className="formFields">

        <div className="keyValuePair">
          <div className="label">Type of purchase</div>
          <div className="value">{props.typeOfPurchaseOptions?.find(option => option.path === props.formData?.typeOfPurchase?.path)?.displayName || '-'}</div>
        </div>

        { props.formData?.typeOfPurchase?.path === 'new' &&
          <>
            <div className="keyValuePair">
              <div className="label">New software(s)</div>
              <div className="value softwareList">
                {props.formData?.softwares && props.formData.softwares.length > 0 && props.formData.softwares.map((software, i) =>
                  <div className={'softwareCard'} key={i}>
                    <div className={'profile'}>
                      <img src={software.image || DefaultLogo} />
                    </div>

                    <div className={'info'}>
                      <div className={'row'}>
                        <div className={'name'}>{software.name} {software.isPreferred && <span className={'preferredTag'}>Selected</span>}</div>
                      </div>
                      {(software.companyName || (software.categoryNames && software.categoryNames.length > 0)) &&
                        <div className={'row'}>
                          {software.companyName && <div className={'property'}>{software.companyName}</div>}
                          {software.categoryNames && software.categoryNames.length > 0 && <div className={'property'}>{software.categoryNames.join(', ')}</div>}
                        </div>}
                      {/* {software.isContractActive &&
                        <div className={'row'}>
                          <div className={'contract'}>Contract: <img src={Check} /> <span className={status}>Valid</span></div>
                        </div>} */}
                      {/* {software.owner &&
                        <div className={`${'row'} ${'ownerRow'}`}>
                          <User size={14} color={'var(--warm-neutral-shade-200)'} />
                          <div className={owner}>{getUserDisplayName(props.data.owner)}</div>
                          <div className={email}>{props.data.owner.email}</div>
                        </div>} */}
                    </div>
                  </div>) || '-'}
              </div>
            </div>

            <div className="keyValuePair">
              <div className="label">Business need</div>
              <div className="value">{mapCustomFieldValue({value: props.formData?.description, fieldName: 'description', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
            </div>

            {/* line */}

            <div className="keyValuePair">
              <div className="label">Replacing an existing software?</div>
              <div className="value">{props.formData?.replacingExisting ? 'Yes' : 'No'}</div>
            </div>

            { props.formData?.replacingExisting &&
            <div className="keyValuePair">
              <div className="label">Software to be replaced</div>
              <div className="value">
                {props.formData?.existingSoftware
                  ? <div className={'softwareCard'}>
                      <div className={'profile'}>
                        <img src={props.formData.existingSoftware.image || DefaultLogo} />
                      </div>

                      <div className={'info'}>
                        <div className={'row'}>
                          <div className={'name'}>
                          {mapCustomFieldValue({value: props.formData.existingSoftware.name, fieldName: 'existingSoftware', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                          </div>
                        </div>
                        {(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) &&
                          <div className={'row'}>
                            {props.formData.existingSoftware.companyName && <div className={'property'}>
                            {mapCustomFieldValue({value: props.formData.existingSoftware.companyName, fieldName: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                          </div>}
                            {props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0 && <div className={'property'}>{props.formData.existingSoftware.categoryNames.join(', ')}</div>}
                          </div>}
                        {/* {software.isContractActive &&
                          <div className={'row'}>
                            <div className={'contract'}>Contract: <img src={Check} /> <span className={status}>Valid</span></div>
                          </div>} */}
                        {/* {software.owner &&
                          <div className={`${'row'} ${'ownerRow'}`}>
                            <User size={14} color={'var(--warm-neutral-shade-200)'} />
                            <div className={owner}>{getUserDisplayName(props.data.owner)}</div>
                            <div className={email}>{props.data.owner.email}</div>
                          </div>} */}
                      </div>
                    </div>
                  : '-'}
              </div>
            </div>}

            { props.formData?.replacingExisting &&
            <div className="keyValuePair">
              <div className="label">Existing contract(s) to replace</div>
              <div className="value softwareList">
                {props.formData?.existingContracts && props.formData.existingContracts.length > 0 && props.formData.existingContracts.map((contract, i) =>
                  <div className={'softwareCard contractCard'} key={i}>
                      <div className={'info'}>
                        <div className={'row'}>
                          <div className={'name'}>{contract.name}</div>
                          {contract.contractId && <div className={'contractId'}>{contract.contractId}</div>}
                        </div>
                        {contract.description &&
                          <div className={'row'}>
                            <div className={'property'}>{contract.description}</div>
                          </div>}
                        {(contract.value?.amount || contract.recurringSpend?.amount) &&
                          <div className={'row'}>
                            {contract.recurringSpend?.amount && <div className={'property'}>{getCostDisplayVal(contract.recurringSpend)} / year</div>}
                            {contract.value?.amount && <div className={'property'}>{getCostDisplayVal(contract.value, 'TCV:')}</div>}
                          </div>}
                        {(contract.startDate || contract.endDate) &&
                          <div className={'row'}>
                            <div className={'property'}>{`${getLocalDateString(contract.startDate)} - ${getLocalDateString(contract.endDate)}`}</div>
                          </div>}
                        {contract.attachments && contract.attachments.length > 0 &&
                          <div className={`row attachmentWrapper`}>
                            {contract.attachments.map((attachment, i) =>
                              <AttachmentReadOnly
                                key={i}
                                attachment={attachment as Attachment}
                                onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
                              />)}
                          </div>}
                      </div>
                    </div>) || '-'}
              </div>
            </div>}
          </>}

        { props.formData?.typeOfPurchase?.path === 'additional' &&
          <>
            <div className="keyValuePair">
              <div className="label">Software to add licenses to</div>
              <div className="value">
                {props.formData?.existingSoftware
                  ? <div className={'softwareCard'}>
                      <div className={'profile'}>
                        <img src={props.formData.existingSoftware.image || DefaultLogo} />
                      </div>

                      <div className={'info'}>
                        <div className={'row'}>
                           <div className="value">{mapCustomFieldValue({value: props.formData?.description, fieldName: 'description', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
                          <div className={'name'}>{mapCustomFieldValue({value: props.formData.existingSoftware.name, fieldName: 'existingSoftware', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string})}</div>
                        </div>
                        {(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) &&
                          <div className={'row'}>
                            {props.formData.existingSoftware.companyName && <div className={'property'}>
                            {mapCustomFieldValue({value: props.formData.existingSoftware.companyName, fieldName: 'existingSoftware', fieldValue: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string})}
                              </div>}
                            {props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0 && <div className={'property'}>
                              {props.formData.existingSoftware.categoryNames.join(', ')}
                              </div>}
                          </div>}
                        {/* {software.isContractActive &&
                          <div className={'row'}>
                            <div className={'contract'}>Contract: <img src={Check} /> <span className={status}>Valid</span></div>
                          </div>} */}
                        {/* {software.owner &&
                          <div className={`${'row'} ${'ownerRow'}`}>
                            <User size={14} color={'var(--warm-neutral-shade-200)'} />
                            <div className={owner}>{getUserDisplayName(props.data.owner)}</div>
                            <div className={email}>{props.data.owner.email}</div>
                          </div>} */}
                      </div>
                    </div>
                  : '-'}
              </div>
            </div>

            <div className="keyValuePair">
              <div className="label">Additional license quantity</div>
              <div className="value">
                {mapCustomFieldValue({value: props.formData.additionalLicensesCount, fieldName: 'additionalLicensesCount', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
              </div>
            </div>

            <div className="keyValuePair">
              <div className="label">Business need</div>{mapCustomFieldValue({value: props.formData.description, fieldName: 'description', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>

            {/* line */}

            <div className="keyValuePair">
              <div className="label">Know which contract to add more licenses to?</div>
              <div className="value">{props.formData?.knowContract ? 'Yes' : 'No'}</div>
            </div>

            { props.formData?.knowContract &&
            <div className="keyValuePair">
              <div className="label">Contract to add licenses to</div>
              <div className="value softwareList">
                {props.formData?.existingContracts && props.formData.existingContracts.length > 0 && props.formData.existingContracts.map((contract, i) =>
                  <div className={'softwareCard contractCard'} key={i}>
                      <div className={'info'}>
                        <div className={'row'}>
                          <div className={'name'}>{contract.name}</div>
                          {contract.contractId && <div className={'contractId'}>{contract.contractId}</div>}
                        </div>
                        {contract.description &&
                          <div className={'row'}>
                            <div className={'property'}>{contract.description}</div>
                          </div>}
                        {(contract.value?.amount || contract.recurringSpend?.amount) &&
                          <div className={'row'}>
                            {contract.recurringSpend?.amount && <div className={'property'}>{getCostDisplayVal(contract.recurringSpend)} / year</div>}
                            {contract.value?.amount && <div className={'property'}>{getCostDisplayVal(contract.value, 'TCV:')}</div>}
                          </div>}
                        {(contract.startDate || contract.endDate) &&
                          <div className={'row'}>
                            <div className={'property'}>{`${getLocalDateString(contract.startDate)} - ${getLocalDateString(contract.endDate)}`}</div>
                          </div>}
                        {contract.attachments && contract.attachments.length > 0 &&
                          <div className={`row attachmentWrapper`}>
                            {contract.attachments.map((attachment, i) =>
                              <AttachmentReadOnly
                                key={i}
                                attachment={attachment as Attachment}
                                onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
                              />)}
                          </div>}
                      </div>
                    </div>) || '-'}
              </div>
            </div>}
          </>}

        { props.formData?.typeOfPurchase?.path === 'renew' &&
          <>
            <div className="keyValuePair">
              <div className="label">Software to renew contracts for</div>
              <div className="value">
                {props.formData?.existingSoftware
                  ? <div className={'softwareCard'}>
                      <div className={'profile'}>
                        <img src={props.formData.existingSoftware.image || DefaultLogo} />
                      </div>

                      <div className={'info'}>
                        <div className={'row'}>
                          <div className={'name'}>{mapCustomFieldValue({value: props.formData.existingSoftware.name, fieldName: 'existingSoftware', fieldValue: 'name', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} </div>
                          {(props.formData.existingSoftware.companyName || (props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0)) &&
                          <div className={'row'}>
                            {props.formData.existingSoftware.companyName && <div className={'property'}>{mapCustomFieldValue({value: props.formData.existingSoftware.companyName, fieldName: 'existingSoftware', fieldValue: 'companyName', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>}
                            {props.formData.existingSoftware.categoryNames && props.formData.existingSoftware.categoryNames.length > 0 && <div className={'property'}>{props.formData.existingSoftware.categoryNames.join(', ')}</div>}
                          </div>}
                        {/* {software.isContractActive &&
                          <div className={'row'}>
                            <div className={'contract'}>Contract: <img src={Check} /> <span className={status}>Valid</span></div>
                          </div>} */}
                        {/* {software.owner &&
                          <div className={`${'row'} ${'ownerRow'}`}>
                            <User size={14} color={'var(--warm-neutral-shade-200)'} />
                            <div className={owner}>{getUserDisplayName(props.data.owner)}</div>
                            <div className={email}>{props.data.owner.email}</div>
                          </div>} */}
                      </div>
                    </div>
                    </div>
                  : '-'}
              </div>
            </div>

            <div className="keyValuePair">
              <div className="label">Contract(s) to be renewed</div>
              <div className="value softwareList">
                {props.formData?.existingContracts && props.formData.existingContracts.length > 0 && props.formData.existingContracts.map((contract, i) =>
                  <div className={'softwareCard contractCard'} key={i}>
                      <div className={'info'}>
                        <div className={'row'}>
                          <div className={'name'}>{contract.name}</div>
                          {contract.contractId && <div className={'contractId'}>{contract.contractId}</div>}
                        </div>
                        {contract.description &&
                          <div className={'row'}>
                            <div className={'property'}>{contract.description}</div>
                          </div>}
                        {(contract.value?.amount || contract.recurringSpend?.amount) &&
                          <div className={'row'}>
                            {contract.recurringSpend?.amount && <div className={'property'}>{getCostDisplayVal(contract.recurringSpend)} / year</div>}
                            {contract.value?.amount && <div className={'property'}>{getCostDisplayVal(contract.value, 'TCV:')}</div>}
                          </div>}
                        {(contract.startDate || contract.endDate) &&
                          <div className={'row'}>
                            <div className={'property'}>{`${getLocalDateString(contract.startDate)} - ${getLocalDateString(contract.endDate)}`}</div>
                          </div>}
                        {contract.attachments && contract.attachments.length > 0 &&
                          <div className={`row attachmentWrapper`}>
                            {contract.attachments.map((attachment, i) =>
                              <AttachmentReadOnly
                                key={i}
                                attachment={attachment as Attachment}
                                onPreviewByURL={() => loadFile(`attachments[${i}].attachment`, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
                              />)}
                          </div>}
                      </div>
                    </div>) || '-'}
              </div>
            </div>

            <div className="keyValuePair">
              <div className="label">Business need</div>
              <div className="value">{mapCustomFieldValue({value: props.formData?.description, fieldName: 'description', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}</div>
            </div>
          </>}
      </div>
    </div>
  )
}
