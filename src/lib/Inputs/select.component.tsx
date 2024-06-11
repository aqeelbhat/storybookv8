import React, { useEffect, useMemo, useRef, useState } from 'react'
import Flags, { US } from 'country-flag-icons/react/3x2'

import { DEFAULT_MASTERDATA_BATCH_SIZE, MultiLevelAsyncSelect, MultiLevelSelect, MultiLevelTreeSelector } from './../MultiLevelSelect'
import styles from './styles.module.scss'
import { TypeAheadProps, Option, MultiSelectProps, AsyncTypeAheadProps, ENTER_KEY_CODE, DOWN_ARROW_KEY_CODE, UP_ARROW_KEY_CODE, ESCAPE_KEY_CODE } from './types'

import { InputWrapper } from './input.component'
import { setOptionSelected } from './utils.service'
import classnames from 'classnames'
import { ArrowRight, X } from 'react-feather'
import { debounce } from '../util'
import { getOptionsBatchSize, isAMatch } from '../MultiLevelSelect/util.service'
import Search from '../MilestoneWidget/components/search/Search'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function TypeAhead (props: TypeAheadProps) {
  const [error, setError] = useState<string | null>()
  const [options, setOptions] = useState<Option[]>([])
  const [regionOptions, setRegionOptions] = useState<Option[]>([])

  useEffect(() => {
    // set 'props.value' selected by default
    const optionsCopy: Option[] = Array.isArray(props.options) ? JSON.parse(JSON.stringify(props.options)) : []
    setOptionSelected(optionsCopy, [props.value?.path])
    setOptions(optionsCopy)
    if (props.validator && props.value?.path) {
      const err = props.validator(props.value?.path)
      setError(err)
    }
  }, [props.options, props.value])

  useEffect(() => {
    if (props.forceValidate && props.required && props.validator) {
      const err = props.validator(props.value?.path)
      setError(err)
    }
  }, [props.forceValidate])

  useEffect(() => {
    // extract coutries as Option[]
    const countryOptions: Option[] = []
    const parsedCountryCodes = {}
    if (props.showTree && props.options && props.options.length > 0) {
      props.options.forEach(option => {
        const countryCode = option.customData?.other?.countryCode
        if (countryCode && !parsedCountryCodes[countryCode]) {
          countryOptions.push({
            id: countryCode,
            path: countryCode,
            displayName: countryCode // TODO: map to country name
          })
          parsedCountryCodes[countryCode] = true
        }
      })
    }
    setRegionOptions(countryOptions)
  }, [props.showTree, props.options])

  function handleSelection (options: Option[]) {
    if (props.required && props.validator) {
      const err = props.validator(options[0]?.path)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(options[0])
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.typeahead}
      error={error}
      inTableCell={props.inTableCell}
    >
      {(getOptionsBatchSize(options) >= DEFAULT_MASTERDATA_BATCH_SIZE)
        ? <MultiLevelAsyncSelect
            value={props.value ? [props.value] : []}
            options={options}
            config={{
              typeahead: !props.disableTypeahead,
              enableTree: props.showTree,
              disableDropdown: true,
              applyFullWidth: props.applyFullWidth,
              hideClearButton: props.hideClearButton,
              noBorder: props.noBorder,
              expandLeft: props.expandLeft,
              backgroundColor: props.backgroundColor,
              fontWeight: props.fontWeight,
              absolutePosition: props.absolutePosition
            }}
            regionOptions={regionOptions}
            placeholder={props.placeholder}
            type={props.type}
            classnames={[ styles.multilevel, error ? styles.invalid : '' ]}
            disabled={props.disabled}
            fetchChildren={props.fetchChildren}
            onSearch={props.onSearch}
            onChange={handleSelection}
          />
        : <MultiLevelSelect
            options={options}
            config={{
              typeahead: !props.disableTypeahead,
              enableTree: props.showTree,
              disableDropdown: true,
              applyFullWidth: props.applyFullWidth,
              hideClearButton: props.hideClearButton,
              noBorder: props.noBorder,
              expandLeft: props.expandLeft,
              backgroundColor: props.backgroundColor,
              fontWeight: props.fontWeight,
              absolutePosition: props.absolutePosition
            }}
            regionOptions={regionOptions}
            placeholder={props.placeholder}
            type={props.type}
            inTableCell={props.inTableCell}
            classnames={[ styles.multilevel, (!props.inTableCell && error) ? styles.invalid : (props.inTableCell && error) ? styles.inTableCellInvalid : '' ]}
            disabled={props.disabled}
            onChange={handleSelection}
          />}
    </InputWrapper>
  )
}

function AsyncTypeAheadComponent (props: AsyncTypeAheadProps) {
  const inputRef = useRef(null)
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [searchString, setSearchString] = useState<string>('')
  const [error, setError] = useState<string | null>()
  const [state, setState] = useState<Option>()
  const [options, setOptions] = useState<Option[]>([])
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(state?.path)
      setError(err)
    }
  }, [props.forceValidate])

  function handleSelection (selection?: Option) {
    setState(selection)
    resetSearch()

    if (props.validator) {
      const err = props.validator(selection?.path)
      setError(err)
    }
    if (props.onChange) {
      props.onChange(selection)
    }
  }

  function search (keyword) {
    if (props.onSearch) {
      props.onSearch(keyword)
        .then((options) => {
          setOptions(options || [])
          setActiveOptionIndex(-1)
        })
        .catch(e => console.log(e))
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedSearch = useMemo(() => debounce(search), [])

  function handleSearchInputChange (keyword) {
    setSearchString(keyword)
    debouncedSearch(keyword)
  }

  function resetSearch () {
    setSearchMode(false)
    setOptions([])
    setActiveOptionIndex(-1)
    setSearchString('')
    if(inputRef?.current?.blur) inputRef.current.blur()
  }

  function startSearchMode () {
    setSearchString(state?.displayName || '')
    setSearchMode(true)
    state?.displayName && search(state.displayName)
  }

  function focusNextListItem(direction: number) {
    if (direction === DOWN_ARROW_KEY_CODE) {
      const currentActiveElementIsNotLastItem = activeOptionIndex < options.length - 1

      if (currentActiveElementIsNotLastItem) {
        setActiveOptionIndex(activeOptionIndex + 1)
      }
    } else if (direction === UP_ARROW_KEY_CODE) {
      const currentActiveElementIsNotFirstItem = activeOptionIndex > (state ? -1 : 0);

      if (currentActiveElementIsNotFirstItem) {
        setActiveOptionIndex(activeOptionIndex - 1)
      }
    }
  }

  function handleKeyDown (e) {
    if (searchMode && options.length > 0) {
      switch (e.keyCode) {
        case ENTER_KEY_CODE:
          handleSelection(options[activeOptionIndex]);
          return;

        case DOWN_ARROW_KEY_CODE:
          e.preventDefault()
          focusNextListItem(DOWN_ARROW_KEY_CODE);
          return;

        case UP_ARROW_KEY_CODE:
          e.preventDefault()
          focusNextListItem(UP_ARROW_KEY_CODE);
          return;

        case ESCAPE_KEY_CODE:
          resetSearch();
          return;

        default:
          return;
      }
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.asyncTypeahead}
      error={error}
    >
      <input
        id={props.id}
        ref={inputRef}
        type="text"
        className={classnames({ [styles.invalid]: error})}
        placeholder={props.placeholder}
        value={searchMode ? (searchString || '') : (state?.displayName || '')}
        disabled={props.disabled}
        onChange={(e) => handleSearchInputChange(e.target.value)}
        onFocus={startSearchMode}
        onKeyDown={handleKeyDown}
      />
      {searchMode &&
         <div className={classnames(styles.optionsWrapper, {[styles.taskSearch]: props.taskPageSearch})}>
          {state &&
            <div
              className={`${styles.optionItem} ${styles.clear} ${activeOptionIndex === -1 ? styles.active : ''}`}
              onClick={() => handleSelection()}
            >
              <X size={14} color={'#0B4D7D'} /><div>{t('--clearSelectedValue--')}</div>
            </div>}
          {options.map((option, i) =>
            <div
              className={`${styles.optionItem} ${state?.displayName === option?.displayName ? styles.selected : ''} ${activeOptionIndex === i ? styles.active : ''}`}
              onClick={() => handleSelection(option)}
              key={i}
            >
              {option.displayName}
              {option.customData?.[props.secondaryDisplayValueKey] && <span className={styles.secondary}> ({option.customData?.[props.secondaryDisplayValueKey]})</span>}
            </div>)}
          {options.length === 0 &&
            <div className={`${styles.optionItem} ${styles.hint}`}>
              {searchString ? t('--noMatchingResultFound--') : t('--typeKeywordToSearch--')}
            </div>}
        </div>}
      {searchMode &&
        <div className={styles.backdrop} onClick={resetSearch}></div>}
    </InputWrapper>
  )
}
export function AsyncTypeAhead (props: AsyncTypeAheadProps) {
  return <I18Suspense><AsyncTypeAheadComponent  {...props} /></I18Suspense>
}
export function MultiSelect (props: MultiSelectProps) {
  const [error, setError] = useState<string | null>()
  const [options, setOptions] = useState<Option[]>([])
  const [regionOptions, setRegionOptions] = useState<Option[]>([])

  useEffect(() => {
    // set 'props.value' selected by default
    const optionsCopy = Array.isArray(props.options) ?  JSON.parse(JSON.stringify(props.options)) : []
    setOptionSelected(optionsCopy, props.value?.map(opt => opt.path) || [])
    setOptions(optionsCopy)
  }, [props.options, props.value])

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value.map(value => value.path))
      setError(err)
    }
  }, [props.forceValidate])

  useEffect(() => {
    // extract coutries as Option[]
    const countryOptions: Option[] = []
    const parsedCountryCodes = {}
    if (props.showTree && props.options && props.options.length > 0) {
      props.options.forEach(option => {
        const countryCode = option.customData?.other?.countryCode
        if (countryCode && !parsedCountryCodes[countryCode]) {
          countryOptions.push({
            id: countryCode,
            path: countryCode,
            displayName: countryCode // TODO: map to country name
          })
          parsedCountryCodes[countryCode] = true
        }
      })
    }
    setRegionOptions(countryOptions)
  }, [props.showTree, props.options])

  function handleSelection (options: Option[]) {
    if (props.validator) {
      const err = props.validator(options.map(option => option.path))
      setError(err)
    }
    if (props.onChange) {
      props.onChange(options)
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.typeahead}
      error={error}
    >
      {(getOptionsBatchSize(options) >= DEFAULT_MASTERDATA_BATCH_SIZE)
        ? <MultiLevelAsyncSelect
            value={props.value || []}
            options={options}
            config={{
              typeahead: props.typeahead !== undefined ? props.typeahead : true,
              enableTree: props.showTree,
              selectMultiple: true,
              isListView: props.isListView,
              showClearAllOption: props.showClearAllOption,
              applyFullWidth: props.applyFullWidth,
              expandLeft: props.expandLeft,
              showElaborateLabel: props.showElaborateLabel,
              noBorder: props.noBorder,
              absolutePosition: props.absolutePosition,
              showSearchBox: props.showSearchBox && !props.typeahead && props.isListView
            }}
            regionOptions={regionOptions}
            placeholder={props.placeholder}
            type={props.type}
            classnames={[ styles.multilevel, error ? styles.invalid : '' ]}
            disabled={props.disabled}
            fetchChildren={props.fetchChildren}
            onSearch={props.onSearch}
            onChange={handleSelection}
          />
        : <MultiLevelSelect
            options={options}
            config={{
              typeahead: props.typeahead !== undefined ? props.typeahead : true,
              enableTree: props.showTree,
              selectMultiple: true,
              isListView: props.isListView,
              showClearAllOption: props.showClearAllOption,
              applyFullWidth: props.applyFullWidth,
              expandLeft: props.expandLeft,
              showElaborateLabel: props.showElaborateLabel,
              noBorder: props.noBorder,
              absolutePosition: props.absolutePosition,
              showSearchBox: props.showSearchBox && !props.typeahead && props.isListView
            }}
            regionOptions={regionOptions}
            placeholder={props.placeholder}
            type={props.type}
            classnames={[ styles.multilevel, error ? styles.invalid : '' ]}
            disabled={props.disabled}
            onChange={handleSelection}
          />}
    </InputWrapper>
  )
}

function CountryFlag (props: { countryCode: string }) {
  const Flag = Flags[props.countryCode.toUpperCase() as keyof typeof Flags]

  return (
    <Flag />
  )
}

export function CountrySelector (props: TypeAheadProps) {
  const [searchString, setSearchString] = useState<string>('')
  const [selected, setSelected] = useState<Option>()

  useEffect(() => {
    if (props.value) {
      setSelected(props.value)
      document.getElementById(props.value.path)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [props.value])

  function selectOption (country: Option) {
    setSelected(country)
    props.onChange(country)
  }

  return (
    <div className={styles.countrySelector}>
      <Search placeholder={props.placeholder} onInputChange={setSearchString} />

      <div className={styles.countryList}>
        {props.options.filter(country => !searchString || isAMatch(country, searchString)).map((country, i) =>
          <div id={country.path} className={classnames(styles.option, {[styles.selected]: country.path === selected?.path})} onClick={() => selectOption(country)} key={i} tabIndex={0}>
            <div className={styles.flag}><CountryFlag countryCode={country.path} /></div>
            <div className={styles.name}>{country.displayName}<span className={styles.code}>{country.path}</span></div>
            <ArrowRight className={styles.arrow} size={16} strokeWidth={'2px'} color='var(--warm-neutral-shade-200)'/>
          </div>)}
      </div>
    </div>
  )
}
