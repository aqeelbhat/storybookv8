import React, { useEffect, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import { Linkify, Options } from 'quill-linkify'
import * as Emoji from "quill-emoji"

import 'react-quill/dist/quill.snow.css'
import "quill-emoji/dist/quill-emoji.css"
import './styles.css'

export interface RichTextEditorProps {
  value?: string
  config?: Object
  readOnly: boolean
  hideToolbar: boolean
  disableMedia?: boolean // deprecated
  placeholder?: string
  className?:string
  onFocus?: () => void
  onBlur?: () => void
  onChange?: (value: string) => void
}

const linkifyOptions: Options = {
  /* custom (regexp or true) or (false or undefined) */
  /* eslint-disable no-useless-escape */
  url: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i, // Use custom regexp
  mail: true, // Use default regexp
  phoneNumber: false, // Disable text auto link
}
Quill.register("modules/emoji", Emoji)
Quill.register('modules/linkify', Linkify)

const Link = Quill.import('formats/link')
const builtInFunc = Link.sanitize
Link.sanitize = function customSanitizeLinkInput(linkValueInput: any) {
  let val = linkValueInput
  // do nothing, since this implies user's already using a custom protocol
  if (!/^https?:/.test(val) && !val.startsWith('/') && !val.startsWith('mailto')){
    val = "http://" + val
  }
  return builtInFunc.call(this, val); // retain the built-in logic
}
Quill.register(Link, true)

export function RichTextEditor (props: RichTextEditorProps) {
  const [editorState, setEditorState] = useState('')

  function updateEditorState (description: string | undefined) {
    let descriptionString = description

    if (description) {
      try {
        descriptionString = JSON.parse(description)
      } catch (err) {
        console.log('Handled parsing error in RichTextEditor.', JSON.stringify(err))
      }
    }

    setEditorState(descriptionString || '')
  }

  useEffect(() => {
    updateEditorState(props.value || '')
  }, [props.value])

  function onEditorFocus () {
    if (props.onFocus) {
      props.onFocus()
    }
  }

  function onEditorBlur () {
    if (props.onBlur) {
      // Added timeout coz:
      // during copy-paste opration, somehow onBlur gets called before onChange; we don't want that
      setTimeout(() => {
        props.onBlur()
      }, 100)
    }
  }

  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, false] }],
    [{ 'color': [] }, { 'background': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [ 'link' ],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['emoji'],
    ['clean']
  ]

  const modules = {
    toolbar: props.hideToolbar ? false : toolbarOptions,
    linkify: linkifyOptions,
    "emoji-toolbar": true,
    "emoji-shortname": true
  }

  // Default formats supported by Quill:
  const formats = [
    'background', 'bold', 'color', 'font', 'header',
    'code', 'italic', 'link', 'size', 'strike', 'underline',
    'script', 'blockquote', 'code-block', 'formula',
    'indent', 'list', 'align', 'direction', 'emoji', 'clean'
    // 'image', 'video'
  ]

  return (
    <div id='oro-rich-text' className={`richTextEditor ${props.className || ''}`}>
      <ReactQuill
        id='oro-rich-text-editor'
        theme="snow"
        className='quillEditor'
        readOnly={props.readOnly}
        placeholder={props.placeholder ? props.placeholder : ''}
        value={editorState}
        modules={props.config ? { ...modules, ...props.config } : modules}
        formats={formats}
        onFocus={onEditorFocus}
        onBlur={onEditorBlur}
        onChange={(val, delta, source) => {
          if (source === 'user') {
            setEditorState(val)
            if (props.onChange) {
              props.onChange(val)
            }
          }
        }}
      />
    </div>
  )
}
