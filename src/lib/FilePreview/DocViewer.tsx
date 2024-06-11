import React, { memo, useEffect, useState } from 'react'
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer'
import { EMLRenderer, MSDocxRenderer, MSGRenderer, MSXlsxRenderer, CSVRenderer, PPTRenderer, VideoRenderer, AudioRenderer, NoRendererComponent, JSONRenderer, MSDocRenderer } from './CustomRenderer'

export function DocViewerComponent (props: {
  IDocument: IDocument
  isUsedInInstruction?: boolean,
  defaultZoom?: number,
  zoomJump?: number,
  verticalScroll?: boolean,
  disableHeader?: boolean
}) {
  const { defaultZoom = 1,
    zoomJump = 0.1,
    verticalScroll = false,
    disableHeader = true,
    isUsedInInstruction = false } = props

  const [IDocument, setIDocument] = useState<IDocument | null>(null)
  useEffect(() => {
    if (props.IDocument) {
      setIDocument({
        uri: props.IDocument.uri,
        fileData: props.IDocument?.fileData,
        fileName: props.IDocument?.fileName,
        fileType: props.IDocument?.fileType && props.IDocument?.fileType?.startsWith('video') ? 'video' : props.IDocument?.fileType && props.IDocument?.fileType?.startsWith('audio') ? 'audio' : props.IDocument?.fileType
      })
    }
  }, [props.IDocument])

  function getStyle () {
    return !isUsedInInstruction ? { width: '100%', height: '90%' } : { width: '100%', height: '90%', alignItems: 'flex-start' }
  }

  return (
    <>
      {IDocument && <DocViewer
        key={IDocument.uri}
        documents={[IDocument]}
        pluginRenderers={[...DocViewerRenderers, PPTRenderer, EMLRenderer, MSGRenderer, JSONRenderer, MSDocRenderer, MSDocxRenderer, MSXlsxRenderer, CSVRenderer, VideoRenderer, AudioRenderer]}
        prefetchMethod="GET"
        requestHeaders={{ 'fileType': props.IDocument?.fileType }}
        config={{
          noRenderer: { overrideComponent: NoRendererComponent },
          header: {
            disableHeader: disableHeader
          },
          pdfZoom: {
            defaultZoom: defaultZoom, // 1 as default,
            zoomJump: zoomJump, // 0.1 as default,
          },
          pdfVerticalScrollByDefault: verticalScroll, // false as default
        }}
        style={getStyle()}
      />}
    </>
  )
}

export default memo(DocViewerComponent)
