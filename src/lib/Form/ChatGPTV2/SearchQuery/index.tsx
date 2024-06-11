/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Manoj Kumar
 ************************************************************/
import styles from './styles.module.scss'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { OroButton } from '../../../controls'
import { ArrowRightCircle, Paperclip, Trash2, File } from 'react-feather'
import Tips from './Tips/Index'
import OroAnimator from '../../../controls/OroAnimator'
import AIResponse from '../AIResponse'
import { inputFileAcceptType } from '../../../Inputs/types'
import { Attachment, Keyboard } from '../../../Types/common'
import { AttachmentReadOnly } from '../../components/attachment-read-only.component'
import { enumChapGPTRequestBotFields } from '../types'

import oroAILogo from '../../assets/oro-ai-v2.svg'
type IProps = {
  title: string
  attachLabel: string
  placeholder: string
  attachment?: Attachment | null
  search: string
  onEdit?: () => void
  onSearch: (input: string) => void
  onFileUpload?: (file: File | null) => void
  loadDocument?: (fieldName: string, type: string, fileName: string) => Promise<Blob>
}

export default function SearchQuery (props: IProps) {
  const [value, setValue] = useState('')
  const [startClicked, setStartClicked] = useState(false)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const [attachment, setAttachment] = useState<Attachment | null>(null)

  useEffect(() => {
    areaRef.current && areaRef.current.focus()
  }, [areaRef])

  useEffect(() => {
    setValue(props.search || '')
  }, [props.search])

  useEffect(() => {
    setAttachment(props.attachment)
  }, [props.attachment])

  function handleKeyUp (e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === Keyboard.Enter) {
      areaRef.current && areaRef.current.blur()
      handleButtonClick()
    }
  }
  function handleChange (event) {
    const element = areaRef.current
    if (element) {
      element.style.height = 'auto';
      element.style.height = (element.scrollHeight) + "px";
    }

    setValue(event.target.value)
  }
  function handleButtonClick () {
    if (value) {
      setStartClicked(true)
      props.onSearch(value)
    }
  }
  function handleEditClick () {
    setStartClicked(false)
    areaRef.current && areaRef.current.focus()
    props.onEdit && props.onEdit()
  }
  function handleTipClick (tip: string) {
    setValue(tip)
    areaRef.current && areaRef.current.focus()
  }

  const handleFileSelection = (event) => {
    event.preventDefault()
    setAttachment(event?.target?.files[0] || null)
    if (props.onFileUpload) {
      props.onFileUpload(event?.target?.files[0] || null)
    }
  }

  function deleteAttachment () {
    setAttachment(null)
    if (props.onFileUpload) {
      props.onFileUpload(null)
    }
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return <div className={classNames(styles.mainBox, { [styles.pushUp]: startClicked })}>

    <OroAnimator show={!startClicked}>
      <div className={classNames(styles.editMode)}>
        <div className={styles.heading}>
          <img width={28} height={28} src={oroAILogo} alt="" />
          <span>{props.title}</span>
          </div>
        <div className={classNames(styles.queryBox)}>
          <div className={styles.area}>
            <textarea autoComplete="off" ref={areaRef} value={value} onKeyUp={handleKeyUp} className={styles.input} onChange={handleChange} placeholder={props.placeholder} />
          </div>
          <div className={classNames(styles.bottomRow)}>
            <div className={styles.uploadCell}>
              {
                !attachment &&
                <div className={styles.uploadContract}>
                  <Paperclip size="16" /> <span>{props.attachLabel}</span>
                  <input
                    type="file"
                    name="file"
                    title={'Upload contract'}
                    onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
                    accept={inputFileAcceptType}
                    onChange={(e) => handleFileSelection(e)}
                  />
                </div>
              }
              {
                attachment &&
                <div className={styles.selected}>
                  <div><File size={16} color='var(--warm-prime-azure)' /></div>
                  <div className={styles.link}>{attachment?.filename || attachment?.name || ''}</div>
                  <div><Trash2 size={16} color='var(--warm-neutral-shade-400)' cursor='pointer' onClick={deleteAttachment}/></div>
                </div>
              }
            </div>
            <div className={classNames(styles.enterCell)}>
              <OroButton onClick={handleButtonClick} type="link" icon={<div className={classNames(styles.enterIcon)}><ArrowRightCircle width={40} height={40} /></div>} />
            </div>
          </div>

        </div>
        <Tips onClick={handleTipClick} />
      </div>
    </OroAnimator>
    <OroAnimator show={startClicked} withDelay>
      <AIResponse userResponded onEdit={props.onEdit ? handleEditClick : undefined}>
        <div className={styles.readOnly}>
          <div className={styles.response}>{value}</div>
          {
            attachment &&
            <div className={styles.selected}>
              <div className={styles.selectedIcon}><File size={16} color='var(--warm-prime-azure)' /></div>
              <AttachmentReadOnly
                attachment={attachment as Attachment}
                hideFileicon={true}
                onPreview={() => loadFile(enumChapGPTRequestBotFields.proposal, (attachment as Attachment).mediatype, (attachment as Attachment).filename)}
              />
            </div>
          }
        </div>
      </AIResponse>
    </OroAnimator>
  </div>
}