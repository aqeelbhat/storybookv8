import React, { useEffect, useState } from 'react'
import { ChevronDown, X } from 'react-feather'
import { OROSpinner } from '../Loaders'
import { isAMatch } from '../MultiLevelSelect/util.service'
import { Typography} from '@mui/material';
import { Option } from '../Types'
import style from './style.module.scss'
import { TextControl } from './text.component'

interface SearchPopupProps {
  value?: Option
  searchPlaceholder?: string
  placeholderIcon?
  placeholderText?: string
  options?: Option[]
  isTypeahead?: boolean
  disabled?: boolean
  onSearchKeywordChange?: (value?: string) => void
  onChange?: (value?: Option) => void
}

const customStyleText: any = {
  paddingTop: '3px',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '22px',
  color: '#3E4456',
  cursor: 'pointer'
}

export function SearchPopup (props: SearchPopupProps) {
  const [value, setValue] = useState<Option>()
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [showOptionPopup, setShowOptionPopup] = useState<boolean>(false)

  useEffect(() => {
    setOptions(props.options)
  }, [props.options])

  useEffect(() => {
    if (props.value && props.value.displayName) {
      setValue(props.value)
    }
  }, [props.value])

  function toggleOptionPopup (event?) {
    event && event.stopPropagation()
    setShowOptionPopup(!showOptionPopup)
  }

  function setSearchKeyword (keyword: string) {
    setSearchQuery(keyword)
    if (props.isTypeahead) {
      setOptions([])
      if (props.onSearchKeywordChange) {
        setLoading(true)
        props.onSearchKeywordChange(keyword)
        setLoading(false)
      }
    } else {
      const filteredOptions = props.options.filter((option) => isAMatch(option, keyword))
      setOptions(filteredOptions)
    }
  }

  function selectOption (value?: Option) {
    setValue(value)

    if (props.onChange) {
      props.onChange(value)
    }

    setTimeout(() => {
      toggleOptionPopup()
    }, 100)
  }

  return (
    <div className={`${style.searchPopup} ${props.disabled ? style.searchPopupDisabled : ''}`}>
      <Typography noWrap={true} className={style.selectedValue} sx={customStyleText} onClick={toggleOptionPopup} variant="body1" title={value ? value.displayName : ''}>
      { value
          ? value.displayName
          : <span className={style.selectedValuePlaceholder}>{props.placeholderIcon || ''} {props.placeholderText || ''}</span>}
      </Typography>
      <ChevronDown  onClick={toggleOptionPopup} color={'#ABABAB'} size={16} />

      { showOptionPopup &&
        <div className={style.optionsPoupup}>
          <div className={style.optionContainer}>
            <div className={style.searchBox}>
              <TextControl
                placeholder={props.searchPlaceholder || 'Search'}
                value={searchQuery}
                onChange={setSearchKeyword}
              />
            </div>

            <div className={style.optionList}>
              { loading && <OROSpinner />}

              { !loading && options && options.length > 0 && options.map((option, i) =>
                <div
                  key={i}
                  className={style.optionListItem}
                  onClick={() => selectOption(option)}
                >
                  {option.displayName}
                </div>)}

              { !loading && (!options || options.length === 0) &&
                <span className={style.hint}>No options found</span>}
            </div>
          </div>
        </div>}

        { showOptionPopup && <div className={style.backdrop} onClick={toggleOptionPopup} />}
    </div>
  )
}
