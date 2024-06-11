import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from './styles.module.scss'
import style from '../MultiLevelSelect/styles.module.scss'
import { InputWrapper } from './input.component'
import { Option, AsyncMultiSelectTypeAheadProps, ENTER_KEY_CODE, DOWN_ARROW_KEY_CODE, UP_ARROW_KEY_CODE, ESCAPE_KEY_CODE } from './types'
import classNames from 'classnames'
import { X } from 'react-feather'
import { debounce } from "../util"

export function AsyncMultiSelectTypeAhead (props: AsyncMultiSelectTypeAheadProps) {
    const inputRef = useRef(null)
    const [searchMode, setSearchMode] = useState<boolean>(false)
    const [searchString, setSearchString] = useState<string>('')
    const [error, setError] = useState<string | null>()
    const [state, setState] = useState<Option[]>([])
    const [options, setOptions] = useState<Option[]>([])
    const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)
    const [loading, setLoading] = useState<boolean>(false)
    const portalRef = useRef(null)
    
    useEffect(() => {
      setState(props.value)
    }, [props.value])

    useEffect(() => {
      if (searchMode) {
        setTopForDropdown()
      }
    }, [searchMode])
  
    useEffect(() => {
      if (props.forceValidate && props.validator) {
        const err = props.validator(state.map(value => value.path))
        setError(err)
      }
    }, [props.forceValidate])
  
    function handleSelection (selection?: Option) {
      let copyState = [...state, selection]
      setState(copyState)
      resetSearch()

      if(!selection){
        copyState = []
        setState([])
      }

      if (props.validator) {
        const err = props.validator(selection?.path)
        setError(err)
      }
      if (props.onChange) {
        props.onChange(copyState)
      }

    }

    function setTopForDropdown () {
      const portal = portalRef.current
      const selectedInputBox = document.getElementById('selectedState')
      if (selectedInputBox.clientHeight > 40 ) {
        const topPosition = selectedInputBox.clientHeight + 7
        portal.style.top = `${topPosition}px`
      }
    }
  
    function search (keyword, selectedOptions:Option[]) {
      if (props.onSearch) {
        setLoading(true)
        props.onSearch(keyword)
          .then((options) => {
            setLoading(false)
            const updatedOption =  options.filter(option => !selectedOptions.find(value => value.id == option.id))
            setOptions(updatedOption || [])
            setActiveOptionIndex(-1)
          })
          .catch(e => {
            setLoading(false)
            console.log(e)
          })
      }
    }
    // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
    const debouncedSearch = useMemo(() => debounce(search), [])

    function handleSearchInputChange (keyword) {
      setSearchString(keyword)
      if (props.onSearch) {
        setLoading(true)
        debouncedSearch(keyword, state)
      }
    }
  
    function resetSearch () {
      setSearchMode(false)
      setOptions([])
      setActiveOptionIndex(-1)
      setSearchString('')
      if(inputRef?.current?.blur) inputRef.current.blur()
    }
  
    function startSearchMode () {
      setSearchMode(true)
    //   selectedValues[0]?.displayName && search(selectedValues[0].displayName)
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
    function removeFromSelected (option: Option) {
        const updatedSelection = state.filter(selectedValue => selectedValue.id !== option.id)
        setState(updatedSelection)
        if (props.onChange) {
          props.onChange(updatedSelection)
        }
      }
    
    return (
      <InputWrapper
        label={props.label}
        required={props.required}
        classname={styles.asyncTypeahead}
        error={error}
      >
        <div className={classNames(styles.selectInputContainer, { [styles.focused]: searchMode })} id="selectedState">
            <div className={styles.selectedOptions}>
                { state &&
                    state.map((value) =>
                    <div
                        className={styles.token}
                        data-testid={`${value.id}-token-value`}
                        key={`${value.id}-token-value`}
                    > 
                      <div className={styles.label}>{value.displayName}</div>
                      <div data-testid={`${value.id}-token-remove-button`} onClick={() => removeFromSelected(value)}>
                        <X size={16} color="var(--warm-neutral-shade-200)" />
                      </div>
                    </div>)
                }
                <div className={classNames(styles.inputBox, { [style.selected]: state.length > 0 })}>
                    <input
                    id={props.id}
                    ref={inputRef}
                    type="text"
                    className={classNames({ [styles.invalid]: error})}
                    placeholder={props.placeholder}
                    value={searchString}
                    disabled={props.disabled}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={startSearchMode}
                    onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>

        {searchMode &&
          <div className={styles.optionsWrapper} ref={portalRef}>
            { loading
              ? <div className={`${styles.optionItem} ${styles.loading}`}>Loading...</div>
              : <>
                  {state && state.length > 0 &&
                    <div
                      className={`${styles.optionItem} ${styles.clear} ${activeOptionIndex === -1 ? styles.active : ''}`}
                      onClick={() => handleSelection()}
                    >
                      <X size={16} color={'var(--warm-prime-azure)'} /><div>Clear all selected</div>
                    </div>}
                </>}

            {!loading && options.length === 0 &&
              <div className={`${styles.optionItem} ${styles.hint}`}>
                {searchString ? 'No matching result found' : 'Type a keyword to search'}
              </div>}

            {options.map((option, i) =>
              <div
                className={`${styles.optionItem} ${state[i]?.displayName === option?.displayName ? styles.selected : ''} ${activeOptionIndex === i ? styles.active : ''}`}
                onClick={() => handleSelection(option)}
                key={i}
              >
                {option.displayName}
                {option.customData?.[props.secondaryDisplayValueKey] && <span className={styles.secondary}> ({option.customData?.[props.secondaryDisplayValueKey]})</span>}
              </div>)}
          </div>}

        {searchMode &&
          <div className={styles.backdrop} onClick={resetSearch}></div>}
      </InputWrapper>
    )
  }