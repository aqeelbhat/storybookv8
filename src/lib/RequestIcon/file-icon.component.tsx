import React from 'react'
import { FileIcon, defaultStyles } from 'react-file-icon'
import { docFileAcceptType, xlsFileAcceptType, pdfFileAcceptType, csvFileAcceptType, imageFileAcceptType, inputFileAcceptType, emlFileAcceptTypes, msgFileAcceptTypes, audioFileAcceptTypes, videoFileAcceptTypes, ZIP_FILE_ACCEPT_TYPE } from '../Inputs'

export function OROFileIcon (props: { fileType: string }) {
  function getIconAsPerType (): React.ReactNode {
    if (props.fileType && docFileAcceptType.includes(props.fileType)) {
        return <FileIcon
            color="#2C5898"
            labelColor="#2C5898"
            labelUppercase
            type="document"
            glyphColor="rgba(255,255,255,0.4)"
            extension="docx"
        />
    }
    if (props.fileType && xlsFileAcceptType.includes(props.fileType)) {
        return <FileIcon
            color="#1A754C"
            labelColor="#1A754C"
            labelUppercase
            type="spreadsheet"
            glyphColor="rgba(255,255,255,0.4)"
            extension="xlsx"
        />
    }
    if (props.fileType && csvFileAcceptType.includes(props.fileType)) {
        return <FileIcon
            extension="csv"
            color="#FF8500"
            gradientColor="#FFB900"
            gradientOpacity={1}
            fold={false}
            labelUppercase
            radius={6}
            type="document"
            glyphColor="rgba(255,255,255,0.6)"
        />
    }
    if (props.fileType && pdfFileAcceptType.includes(props.fileType)) {
        return <FileIcon
            type="acrobat" 
            extension="pdf" 
            gradientOpacity={0} 
            radius={2} 
            labelUppercase 
            {...defaultStyles.pdf}
        />
    }
    if (props.fileType && (audioFileAcceptTypes.includes(props.fileType) || props.fileType?.includes('audio'))) {
        return <FileIcon
            type="audio" 
            extension="audio" 
            gradientOpacity={0} 
            radius={2} 
            labelUppercase 
            {...defaultStyles.mp3}
        />
    }
    if (props.fileType && (videoFileAcceptTypes.includes(props.fileType) || props.fileType?.includes('video'))) {
        return <FileIcon
            type="video" 
            extension="video" 
            gradientOpacity={0} 
            radius={2} 
            labelUppercase 
            {...defaultStyles.flv}
        />
    }
    if (props.fileType && imageFileAcceptType.includes(props.fileType)) {
        return <FileIcon
            color="lavender"
            extension="image"
            labelUppercase
            type="image"
        />
    }
    if (props.fileType && emlFileAcceptTypes.includes(props.fileType)) {
        return <FileIcon
            type="scss" 
            extension="eml" 
            gradientOpacity={0} 
            radius={2} 
            labelUppercase 
            {...defaultStyles.scss}
        />
    }
    if (props.fileType && msgFileAcceptTypes.includes(props.fileType)) {
        return <FileIcon
            type="rb" 
            extension="msg" 
            gradientOpacity={0} 
            radius={2} 
            labelUppercase 
            {...defaultStyles.rb}
        />
    }
    if (props.fileType && ZIP_FILE_ACCEPT_TYPE.includes(props.fileType)) {
        return <FileIcon
            type="compressed" 
            extension="zip"
            labelUppercase 
            {...defaultStyles.zip}
        />
    }
    return <FileIcon
        size={48}
        color="#1254F8"
        gradientColor="#00D2FF"
        gradientOpacity={1}
        fold={false}
        radius={6}
        type="presentation"
        extension="unknown"
        glyphColor="rgba(255,255,255,0.6)"
    />
  }
  return (
    <>
        {getIconAsPerType()}
    </>
  )
}
