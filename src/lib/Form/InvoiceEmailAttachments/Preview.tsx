import React, { memo, useEffect, useState } from 'react'
import { BlobDetails } from './types'
import { IDocument } from '@cyntler/react-doc-viewer'
import { DocViewerComponent } from '../../FilePreview/DocViewer'
import { OROSpinner } from '../../Loaders'
import { jsonFileAcceptType } from '../../Inputs'

interface IPreviewProps {
  blobDetails: BlobDetails | null
}

function convertBlobForJSONFileType (resp: BlobDetails): Blob {
  if (jsonFileAcceptType.includes(resp.type)) {
    return new Blob([JSON.stringify(resp.blob)], { type: resp.type })
  }
  else {
    return new Blob([resp.blob], { type: resp.type })
  }
}
function convertBlobToDocument (blobData: BlobDetails): IDocument {
  const data = convertBlobForJSONFileType(blobData)
  const fileURL = URL.createObjectURL(data)
  return {
    uri: fileURL,
    fileName: blobData.name,
    fileType: blobData.type
  } as IDocument
}

function Preview (props: IPreviewProps) {
  const [IDocument, setIDocument] = useState<IDocument>()

  useEffect(() => {
    if (!IDocument && props.blobDetails) {
      setIDocument(convertBlobToDocument(props.blobDetails))
    }
  }, [props.blobDetails])

  return (
    <>
      {IDocument
        ? <DocViewerComponent IDocument={IDocument}
          defaultZoom={1} verticalScroll={true} zoomJump={0.1} />
        : <OROSpinner color="lightgrey" height={20} width={20} borderWidth={1}></OROSpinner>
      }</>
  )
}

export default memo(Preview)
