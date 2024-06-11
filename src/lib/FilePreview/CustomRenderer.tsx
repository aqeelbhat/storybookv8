import React, { useEffect, useState } from 'react'
import { DocRenderer, IDocument } from '@cyntler/react-doc-viewer'
import PostalMime from 'postal-mime'
import MsgReader, { FieldsData } from '@kenjiuno/msgreader'
import * as XLSX from 'xlsx'
import styles from './styles.module.scss'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import classnames from 'classnames'
import * as Papa from 'papaparse'
import ReactPlayer from 'react-player'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import ReactJson from '@microlink/react-json-view'
import * as docx from "docx-preview"
import { createCustomUUID } from '../util'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { Download, EyeOff } from 'react-feather'
import { Trans } from 'react-i18next'

interface Props {
  mainState: any
}

export const NoRendererComponent = (props: { document: IDocument, fileName: string, fileType?: string }) => {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  return (<div className={styles.noRenderer} data-testid="no-renderer">
    <div className={styles.noRendererEye}>
      <EyeOff size={50} color='var(--warm-neutral-shade-300)'></EyeOff>
    </div>
    <div className={styles.noRendererTitle}>{t("--filePreview--.--previewNotAvailable--")}</div>
    <div className={styles.noRendererTitle}>{t("--filePreview--.--downloadFileToView--")}</div>
    <a className={styles.noRendererFileLink} href={props.document?.uri} download={props.fileName}>
      <Trans t={t} i18nKey="--filePreview--.--download--">
        <Download size={16} color='var(--warm-neutral-shade-300)'></Download>
        {'Download'}
      </Trans>
    </a>
  </div>)
}

function formatAddress (address) {
  const a = document.createElement('a')
  a.classList.add('email-address')
  a.textContent = address.name || `<${address.address}>`
  a.href = `mailto:${address.address}`
  return a
}

function formatAddresses (addresses): string {
  const parts: Array<any> = []

  const processAddress = (address, partCounter) => {
    if (partCounter) {
      const sep = document.createElement('span')
      sep.classList.add('email-address-separator')
      sep.textContent = ', '
      parts.push(sep)
    }

    if (address.group) {
      const groupStart = document.createElement('span')
      groupStart.classList.add('email-address-group')
      const groupEnd = document.createElement('span')
      groupEnd.classList.add('email-address-group')

      groupStart.textContent = `${address.name}:`
      groupEnd.textContent = ';'

      parts.push(groupStart)
      address.group.forEach(processAddress)
      parts.push(groupEnd)
    } else {
      parts.push(formatAddress(address))
    }
  }

  addresses.forEach(processAddress)

  const result = document.createElement('div')
  parts.forEach(part => {
    result.append(part)
  })
  return result.innerHTML
}

const DATE_OPTIONS: any = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false
}

function JSONRendererComponent(props: {document: IDocument}) {
  const [jsonData, setJSONData] = useState<any | null>(null)
  function generateReadableFile (resp: Blob) {
    const reader = new FileReader()
    reader.addEventListener('loadend', (e) => {
      const text = e.target?.result
      setJSONData(JSON.parse(text as string))
    })
    reader.readAsText(resp)
  }
  useEffect(() => {
    fetch(props.document.uri)
      .then((response) => response.blob())
      .then((data) => generateReadableFile(data))
      .catch(err => console.error(err))
  }, [props.document])
  return <div className={styles.JSONContainer}>{jsonData && <ReactJson enableClipboard collapsed={2} src={jsonData} theme="shapeshifter:inverted" />}</div>
}

const JSONRenderer: DocRenderer = ({
  mainState: { currentDocument }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return <JSONRendererComponent document={currentDocument} />
}

JSONRenderer.fileTypes = ['json', 'JSON', '.json', 'application/json']
JSONRenderer.weight = 10

function EMLRendererComponent (props: {document: IDocument}) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  const [emailData, setEmailData] = useState<any | null>(null)

  function renderAttachments () {
    return <>
      {emailData.attachments.map((attachment, i) => {
        return <a key={i} className={styles.attachmentsContainerContentLink} href={URL.createObjectURL(new Blob([attachment.content], { type: attachment.mimeType || "application/octet-stream" }))} download={attachment.fileName || 'attachment'}>{attachment.fileName || `attachment (${attachment.mimeType})`}</a>
      })}
    </>
  }

  function formatDate (): string {
    return new Intl.DateTimeFormat('default', DATE_OPTIONS).format(new Date(emailData.date))
  }

  function generateReadableFile (params: Blob) {
    const parser = new PostalMime()
    parser.parse(params)
      .then(email => {
        setEmailData(email)
      }).catch(err => console.error(err))
  }

  useEffect(() => {
    fetch(props.document.uri)
      .then((response) => response.blob())
      .then((data) => generateReadableFile(data))
      .catch(err => console.error(err))
  }, [props.document])

  return (
    <div className={styles.emlRenderer}>
      {emailData && <div className={styles.emailContainer}>

        <div className={styles.infoContainer}>
            {emailData?.subject && <div className={styles.subjectContent}>{emailData.subject}</div>}
            {emailData?.from && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--from--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses([emailData.from])}}></div>
            </div>}
            {emailData['to'] && emailData['to'].length > 0 && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--to--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses(emailData['to'])}}></div>
            </div>}
            {emailData['cc'] && emailData['cc'].length > 0 && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--cc--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses(emailData['cc'])}}></div>
            </div>}
            {emailData['bcc'] && emailData['bcc'].length > 0 && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--bcc--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{ __html: formatAddresses(emailData['bcc']) }}></div>
            </div>}
            {emailData?.date && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoDate}>{formatDate()}</div>
            </div>}
        </div>

        <div className={styles.htmlContainer}>
            {emailData?.html && <div className={styles.htmlContainerContent} dangerouslySetInnerHTML={{__html: emailData.html}}></div>}
            <div><small><em>{t("--filePreview--.--imagesNotShownMixedContentNotAllowed--")}</em></small></div>
        </div>

        {emailData?.text && <div className={styles.textContainer}>
            <div className={styles.textContainerContent}>{emailData.text}</div>
        </div>}

        {emailData?.attachments && emailData?.attachments.length > 0 && <div className={styles.attachmentsContainer}>
            <div className={styles.attachmentsContainerContent}>{renderAttachments()}</div>
        </div>}

      </div>}
    </div>
  )
}

const EMLRenderer: DocRenderer = ({
  mainState: { currentDocument }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return <EMLRendererComponent document={currentDocument} />
}

EMLRenderer.fileTypes = ['eml', 'message/rfc822']
EMLRenderer.weight = 10

function MSGRendererComponent (props: {document: IDocument}) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  const [emailData, setEmailData] = useState<FieldsData | null>(null)
  const [msgReader, setMsgReader] = useState<MsgReader | null>(null)
  const [to, setTo] = useState<Array<{name: string, address: string}>>([])
  const [cc, setCC] = useState<Array<{name: string, address: string}>>([])
  const [bcc, setBcc] = useState<Array<{name: string, address: string}>>([])

  function renderAttachments () {
    function getAttachmentUrl (attachment: FieldsData, index: number): string {
      const file = msgReader?.getAttachment(index)
      return file && file.content ? URL.createObjectURL(new File([file.content], attachment.fileName,
          {type: attachment.extension ? attachment.extension : "application/octet-stream"})) : ''
    }

    return <>
      {emailData.attachments.map((attachment, i) => {
        return <a key={i} className={styles.attachmentsContainerContentLink} href={getAttachmentUrl(attachment, i)} download={attachment.fileName || 'attachment'}>{attachment.fileName || `attachment (${attachment.extension})`}</a>
      })}
    </>
  }

  function formatDate (): string {
    return new Intl.DateTimeFormat('default', DATE_OPTIONS).format(new Date(emailData.messageDeliveryTime))
  }

  function generateReadableFile (resp: Blob) {
    const arrayBuffer = new Response(resp).arrayBuffer()
    arrayBuffer.then(bufferedData => {
      const msgReader = new MsgReader(bufferedData)
      const fileData = msgReader.getFileData()
      const _to: Array<{name: string, address: string}> = []
      const _cc: Array<{name: string, address: string}> = []
      const _bcc: Array<{name: string, address: string}> = []
      if (fileData.recipients && fileData.recipients.length) {
        fileData.recipients.forEach(item => {
          if (item.recipType === 'to') {
            _to.push({
              name: item.name,
              address: item.email
            })
          }
          if (item.recipType === 'cc') {
            _cc.push({
              name: item.name,
              address: item.email
            })
          }
          if (item.recipType === 'bcc') {
            _bcc.push({
              name: item.name,
              address: item.email
            })
          }
        })
        setTo(_to)
        setBcc(_bcc)
        setCC(_cc)
      }
      setEmailData(fileData)
      setMsgReader(msgReader)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetch(props.document.uri)
      .then((response) => response.blob())
      .then((data) => generateReadableFile(data))
      .catch(err => console.error(err))
  }, [props.document])

  return (
    <div className={styles.emlRenderer}>
      {emailData && <div className={styles.emailContainer}>

        <div className={styles.infoContainer}>
            {emailData?.subject && <div className={styles.subjectContent}>{emailData.subject}</div>}
            {(emailData?.senderName || emailData?.senderEmail) && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--from--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses([{ name: emailData?.senderName, address: emailData.senderEmail }])}}></div>
            </div>}

            {(to && to.length > 0) && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--to--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses(to)}}></div>
            </div>}

            {(cc && cc.length > 0) && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--cc--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses(cc)}}></div>
            </div>}

            {(bcc && bcc.length > 0) && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoLabel}>{t("--filePreview--.--bcc--")}</div>
              <div className={styles.emailInfoContent} dangerouslySetInnerHTML={{__html: formatAddresses(bcc)}}></div>
            </div>}

            {emailData?.messageDeliveryTime && <div className={styles.emailInfoRow}>
              <div className={styles.emailInfoDate}>{formatDate()}</div>
            </div>}
        </div>

        {emailData?.body && <div className={styles.textContainer}>
            <div className={styles.textContainerContent}>{emailData?.body}</div>
        </div>}

        {emailData?.bodyHtml && <div className={styles.htmlContainer}>
            <div className={styles.htmlContainerContent}>{emailData.bodyHtml}</div>
            <div><small><em>{t("--filePreview--.--imagesNotShownMixedContentNotAllowed--")}</em></small></div>
        </div>}

        {emailData?.attachments && emailData.attachments?.length > 0 && msgReader && <div className={styles.attachmentsContainer}>
            <div className={styles.attachmentsContainerContent}>{renderAttachments()}</div>
        </div>}

      </div>}
    </div>
  )
}

const MSGRenderer: DocRenderer = ({
  mainState: { currentDocument }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return <MSGRendererComponent document={currentDocument} />
}

MSGRenderer.fileTypes = ['msg', 'application/octet-stream', 'application/vnd.ms-outlook']
MSGRenderer.weight = 10

function MSDocxRendererComponent (props: {document: IDocument}) {
  const UUID = createCustomUUID('myDocId')
  useEffect(() => {
    if (UUID && props.document?.uri) {
      fetch(props.document.uri).then((res) => {
        const template = res.arrayBuffer()
        docx.renderAsync(template, document.getElementById(UUID))
          .catch(err => console.log("error in parsing doc file", err))
      })
    }
  }, [props.document, UUID])
  return <div id={UUID} className={styles.docxContainer}></div>
}

const MSDocxRenderer: DocRenderer = ({
  mainState: { currentDocument }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return <MSDocxRendererComponent document={currentDocument} />
}

MSDocxRenderer.fileTypes = ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
MSDocxRenderer.weight = 1

function MSDocRendererComponent (props: {document: IDocument, requestHeaders: Record<string, string>}) {
  return <>
          <NoRendererComponent document={props.document} fileType={props.requestHeaders?.fileType || ''} fileName={props.document.fileName} />
        </>
}

const MSDocRenderer: DocRenderer = ({
  mainState: { currentDocument, requestHeaders }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return (
    <MSDocRendererComponent document={currentDocument} requestHeaders={requestHeaders} />
  )
}

MSDocRenderer.fileTypes = ["doc", 'application/msword']
MSDocRenderer.weight = 1


function CSVRendererComponent (props: {document: IDocument}) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  const [csvData, setCsvData] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    setErrors([])
    Papa.parse(props.document.uri, {
      download: true,
      skipEmptyLines: true,
      complete: function(results, file) {
        if (results.errors.length < 1 && Array.isArray(results.data)) {
          setCsvData(results.data)
        } else {
          setErrors(results.errors)
        }
      }
    })
  }, [props.document])

  return (
    <div id="csv-renderer" className={styles.csvRenderer}>
      <table className={styles.csv}>
        <tbody>
          {errors.length < 1 && csvData.map((row, i) =>
            <tr className={classnames(styles.row, {[styles.header]: i === 0})} key={`row${i}`}>
              {row.map((value, j) =>
                <td className={styles.value} key={`value${j}`}>{value}</td>)}
            </tr>)}
          </tbody>
      </table>

      {errors.length > 0 &&
        <div className="error">{t("--filePreview--.--errorReadingFileContent--")}</div>}
    </div>
  )
}

function MSXlsxRendererComponent (props: {document: IDocument}) {
  const [sheetNames, setSheetNames] = useState<Array<string>>([])
  const [sheets, setSheets] = useState<Array<string>>([])
  const [currentSheet, setCurrentSheet] = useState(0)

  function generateReadableFile (resp: Blob) {
    const arrayBuffer = new Response(resp).arrayBuffer()
    arrayBuffer.then(bufferedData => {
      const dataArr = new Uint8Array(bufferedData)
      const arr: Array<any> = []
      for (let i = 0; i !== dataArr.length; i += 1) {
        arr.push(String.fromCharCode(dataArr[i]))
      }
      const workbook = XLSX.read(arr.join(''), { type: 'binary' });
      const names = Object.keys(workbook.Sheets)
      setSheetNames(names)
      const _sheets = names.map(name => (
        XLSX.utils.sheet_to_csv(workbook.Sheets[name])
      ))
      setSheets(_sheets)
      setCurrentSheet(0)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetch(props.document.uri)
      .then((response) => response.blob())
      .then((data) => generateReadableFile(data))
      .catch(err => console.error(err))
  }, [props.document])

  function RenderSheetNames(props: {names: Array<string>}): ReactJSXElement {
    return (
      <div className={styles.sheetNames}>
        {props.names.map((name, index) => (
          <span
            key={name}
            className={index === currentSheet ? `${styles.sheetNamesItems} ${styles.sheetNamesActive}` : `${styles.sheetNamesItems}`}
            onClick={() => setCurrentSheet(index)}
          >{name}</span>
        ))}
      </div>
    );
  }

  function RenderSheetData(props: {sheet: string}): ReactJSXElement {
    const [fileUrl, setFileUrl] = useState('')
    useEffect(() => {
      if (props.sheet) {
        const blob = new Blob([props.sheet], { type: 'text/csv' })
        const _fileURL = URL.createObjectURL(blob)
        setFileUrl(_fileURL)
      }
    }, [props.sheet])

    return (
      <>
        {fileUrl && <CSVRendererComponent document={{ uri: fileUrl, fileType: 'text/csv'}}></CSVRendererComponent>}
      </>
    );
  }

  return <div className={styles.spreadsheetViewer}>
    {sheetNames.length > 0 && <RenderSheetNames names={sheetNames}></RenderSheetNames>}
    {sheets.length > 0 && <RenderSheetData sheet={sheets[currentSheet || 0]} />}
  </div>
}


const MSXlsxRenderer: DocRenderer = ({
  mainState: { currentDocument }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return (
    <MSXlsxRendererComponent document={currentDocument} />
  )
}

MSXlsxRenderer.fileTypes = ['xls', 'xlsx', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.oasis.opendocument.spreadsheet']
MSXlsxRenderer.weight = 1

const CSVRenderer: DocRenderer = ({
  mainState: { currentDocument }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return (
    <CSVRendererComponent document={currentDocument} />
  )
}

CSVRenderer.fileTypes = ["csv", "text/csv"]
CSVRenderer.weight = 1

function VideoRendererComponent (props: {document: IDocument, requestHeaders: Record<string, string>}) {
  const [error, setError] = useState(false)
  return <>
          {!error && <ReactPlayer
            className='react-player'
            controls
            height='100%'
            onError={() => setError(true)}
            url={props.document.uri}
            width='100%'
          />}
          {error && <NoRendererComponent document={props.document} fileType={props.requestHeaders?.fileType || ''} fileName={props.document.fileName} />}
        </>
}

const VideoRenderer: DocRenderer = ({
  mainState: { currentDocument, requestHeaders }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return (
    <VideoRendererComponent document={currentDocument} requestHeaders={requestHeaders} />
  )
}

VideoRenderer.fileTypes = ['video/mp4', 'application/x-shockwave-flash', 'video/x-flv', '.mkv', 'video']
VideoRenderer.weight = 1

function AudioRendererComponent (props: {document: IDocument, requestHeaders: Record<string, string>}) {
  const [error, setError] = useState(false)
  return <>
          {!error &&
          <AudioPlayer
            autoPlay
            src={props.document.uri}
            onPlayError={(err: Error) => setError(true)}
          />}
          {error && <NoRendererComponent document={props.document} fileType={props.requestHeaders?.fileType || ''} fileName={props.document.fileName} />}
        </>
}

const AudioRenderer: DocRenderer = ({
  mainState: { currentDocument, requestHeaders }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return (
    <AudioRendererComponent document={currentDocument} requestHeaders={requestHeaders} />
  )
}

AudioRenderer.fileTypes = ['audio/*', '.m4p', 'audio']
AudioRenderer.weight = 1

function PPTRendererComponent (props: {document: IDocument, requestHeaders: Record<string, string>}) {
  return <>
          <NoRendererComponent document={props.document} fileType={props.requestHeaders?.fileType || ''} fileName={props.document.fileName} />
        </>
}

const PPTRenderer: DocRenderer = ({
  mainState: { currentDocument, requestHeaders }
}: Props) => {
  if (!currentDocument) {
    return null
  }

  return (
    <PPTRendererComponent document={currentDocument} requestHeaders={requestHeaders} />
  )
}

PPTRenderer.fileTypes = ["pptx", "ppt", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
PPTRenderer.weight = 1

export { EMLRenderer, PPTRenderer, MSGRenderer, MSDocxRenderer, MSXlsxRenderer, MSDocRenderer, CSVRenderer, VideoRenderer, AudioRenderer, JSONRenderer }
