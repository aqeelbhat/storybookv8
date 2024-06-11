import React from 'react'
import { getLocalDateString, getUserDisplayName } from './util'

import './email-template.css'
import { getFileIcon } from '../Inputs/utils.service'
import { Attachment, Document } from '../Types'

export function DocumentFormEmail (props: {data: Document[]}) {
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Documents</h1>

      <table>
        <tbody>
          { Array.isArray(props.data) && props.data.map((document, i) =>
            <tr key={i}>
              <td colSpan={2}>
                <div className="emailQuotesAttachment">
                  <table>
                    <tbody>
                      <tr>
                        <td width='32px'>
                          <div className="documentType">{document.type?.name || '-'}</div>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="documentName">{document.name || '-'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="emailSvg">
                              <img src={getFileIcon((document.attachment as Attachment)?.mediatype)} width="20px" height="24px" alt=""/>
                          </div>
                        </td>
                        <td>
                          <div className="emailQuotesAttachmentName">{document.attachment?.name || (document.attachment as Attachment)?.filename}</div>
                          <div className="emailQuotesAttachmentDesc">{(document.attachment as Attachment)?.note || ''}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="emailQuotesAttachmentDate">
                              Start date: {document.startDate ? getLocalDateString(document.startDate) : ''} &nbsp;&nbsp;|&nbsp;&nbsp; End on: {document.endDate ? getLocalDateString(document.endDate) : ''}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="documentOwner">Owner: {document?.owners?.length > 0 ? getUserDisplayName(document?.owners[0]) : ''}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}
