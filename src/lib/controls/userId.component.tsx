import React, { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search, X } from 'react-feather'
import Tooltip from '@mui/material/Tooltip'
import classnames from 'classnames'

import { User } from './../Types'
import { UserIdProps } from '../Inputs'

import { getUserDisplayName } from '../Form/util'
import { createImageFromInitials, debounce } from '../util'
import { DOWN_ARROW_KEY_CODE, ENTER_KEY_CODE, ESCAPE_KEY_CODE, UP_ARROW_KEY_CODE } from '../Inputs/types'

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { OroButton } from './button/button.component'
import classNames from 'classnames'
import { Assignment, Keyboard } from '..'
import { DROPDOWN_MAX_HEIGHT } from '../MultiLevelSelect/types'
import { OroErrorTooltip } from '../Tooltip/error.component'
import { getI18Text as getI18ControlText } from '../i18n'

// TODO: The UserCard component should be atomized

export function UserCard (props: {
  value: User
  doNotShowUserEmail?: boolean
  allowClick?: boolean
  showDelete?: boolean
  activeOptionIndex?: number
  index?: number
  onClick?: () => void
  onDelete?: (value: User) => void
  userProfilePic?: string
}) {

  function handleDelete () {
    if (props.onDelete) {
      props.onDelete(props.value)
    }
  }

  function handleClick () {
    if (props.onClick) {
      props.onClick()
    }
  }

  function getProfilePicture(): string {
    if (props.value.picture) {
      return props.value.picture
    } else {
      if (getUserDisplayName(props.value)) {
        const nameFragment = getUserDisplayName(props.value).split(' ')
        return createImageFromInitials(nameFragment[0], nameFragment[1])
      }
    }
  }

  return (
    <div className={classnames(styles.userCard, {[styles.clickable]: props.allowClick}, {[styles.focuseditem]: props.index === props.activeOptionIndex})} onClick={handleClick}>
      <div className={styles.primary}>
          <div className={styles.profile}>
           <img src={(props.userProfilePic) ? props.userProfilePic : getProfilePicture()} />
         </div>
        <div className={styles.name}>{getUserDisplayName(props.value)}</div>
        {props.showDelete && <div className={styles.delete} onClick={() => {handleDelete()}}><X size={16} color={'var(--warm-neutral-shade-200)'} /></div>}
      </div>
      {!props.doNotShowUserEmail && <div className={styles.secondary}>
        <div className={styles.email}>
          <Tooltip title={props.value.email || '-'}>
            <span className={styles.value}>{props.value.email || '-'}</span>
          </Tooltip>
        </div>
      </div>}
    </div>
  )
}

export interface UserIdPropsNew {
  id?: string
  placeholder?: string
  value?: User | User[]
  options?: User[]
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    selectMultiple?: boolean
    doNotShowUserEmail?: boolean
    isBgColorNotRequired?: boolean
    userListingConfig?: Assignment
    absolutePosition?: boolean
  }
  dataFetchers: {
    getUser?: (keyword: string) => Promise<User[]>,
    getUserProfilePic?: (userId: string) => Promise<Map<string, string>>,
  }
  validator?: (value?: User | User[]) => string | null
  onChange?: (value: User | User[]) => void
}

export function UserIdControlNew(props: UserIdPropsNew) {

  // TODO: Localization

  const inputRef = useRef(null)
  const [state, setState] = useState<User | User[] | null>()
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [searchString, setSearchString] = useState<string>('')
  const [options, setOptions] = useState<User[]>([])
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(-1)
  const [error, setError] = useState<string | null>()
  const [profilePicture, setProfilePicture] = useState<Map<string, string>>()
  const [isUserAlreadyAdded, setIsUserAlreadyAdded] = useState<boolean>(false)

  const myContainer = useRef(null)
  const selectInputContainer = useRef<any>(null)

  const searchResultsWrapper = useRef<any>(null)
  const [searchResultsContainerTop, setSearchResultsContainerTop] = useState('')

  const optionsWrapper = useRef<any>(null)
  const [optionsContainerTop, setOptionsContainerTop] = useState('')

  const [optionsContainerwidth, setOptionsContainerwidth] = useState('')

  const filteredResultsContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const results = filteredResultsContainer.current && filteredResultsContainer.current.children

    if (searchMode && results.length > 0) {
      const result = results[activeOptionIndex + 1]

      if (result?.scrollIntoView) {
        result?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
      }
    }
  }, [activeOptionIndex])

  useEffect(() => {
    if (props.config.selectMultiple) {
      setState(props.value || [])
      getImage(props.value || [])
    } else {
      setState(props.value)
      getImage(props.value)
    }
  }, [props.value])

  function triggerValidation(_state?: User | User[]) {
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(_state))
    }
  }

  useEffect(() => {
    if (props.config.forceValidate) {
      triggerValidation(state)
    }
  }, [props.config.forceValidate])

  function getImage(selection: User | User[]) {
    setProfilePicture(null)
    if (selection && Array.isArray(selection)) {
      selection.forEach((item) => {
        if (item?.email && props.dataFetchers.getUserProfilePic) {
          props.dataFetchers.getUserProfilePic(item.email).then((resp) => {
            if (resp && resp[item.email]) {
              setProfilePicture(resp)
            }
          })
        }
      })
    } else {
      if (selection && !(Array.isArray(selection)) && selection?.email && props.dataFetchers.getUserProfilePic) {
        props.dataFetchers.getUserProfilePic(selection.email).then((resp) => {
          if (resp && resp[selection.email]) {
            setProfilePicture(resp)
          }
        })
      }
    }
  }

  function checkIfUserAlreadyAdded(selection: User): boolean {
    if (((state as User[]).filter(item => item.email === selection.email).length) > 0) {
      return true
    }
  }

  function handleMultipleSelection(selection?: User) {
    if (!(checkIfUserAlreadyAdded(selection))) {
      setIsUserAlreadyAdded(false)
      const selectionList: User[] = (state && Array.isArray(state) && state.length > 0) ? state : [];
      selectionList.push(selection)
      handleSelection(selectionList)
    } else {
      setIsUserAlreadyAdded(true)
      clearSearch()
    }
  }

  function handleSelection(selection?: User | User[]) {
    setState(selection)
    getImage(selection)
    resetSearch()

    triggerValidation(selection)

    if (props.onChange) {
      if (selection && !(Array.isArray(selection))) {
        if (selection?.picture) {
          delete selection.picture
        }
      } else if (selection && Array.isArray(selection)) {
        selection.forEach(element => {
          if (element?.picture) {
            delete element.picture
          }
        });
      }
      props.onChange(selection)
    }
  }

  function clearSelection(item: User) {
    const copySelection: User | User[] = state
    if (copySelection && !(Array.isArray(copySelection))) {
      handleSelection(null)
    } else if (copySelection && Array.isArray(copySelection) && copySelection.length > 0) {
      copySelection.forEach((element, index) => {
        if (element?.email === item?.email) {
          (copySelection as User[]).splice(index, 1)
        }
      });
      handleSelection(copySelection)
    }
    startSearchMode()
  }

  function search(keyword) {
    if (props.dataFetchers.getUser) {
      props.dataFetchers.getUser(keyword)
        .then((options) => {
          setOptions(options || [])
          setActiveOptionIndex(-1)
        })
        .catch(e => console.log(e))
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedSearch = useMemo(() => debounce(search), [])

  function handleSearchInputChange(keyword) {
    setIsUserAlreadyAdded(false)
    setSearchString(keyword)
    debouncedSearch(keyword)
  }

  function clearSearch() {
    setOptions([])
    setActiveOptionIndex(-1)
    setSearchString('')
  }

  function resetSearch() {
    setSearchMode(false)
    setOptions([])
    setActiveOptionIndex(-1)
    setSearchString('')
    if (inputRef?.current?.blur) inputRef.current.blur()
    triggerValidation(state)
  }

  function startSearchMode() {
    setIsUserAlreadyAdded(false)
    setSearchString('')
    setSearchMode(true)
    setTimeout(() => {
      inputRef?.current?.focus && inputRef.current.focus()
    }, 500)
  }

  function focusNextListItem(key: Keyboard) {
    if (key === Keyboard.Down) {
      const currentActiveElementIsNotLastItem = activeOptionIndex < options.length - 1

      if (currentActiveElementIsNotLastItem) {
        setActiveOptionIndex(activeOptionIndex + 1)
      }
    } else if (key === Keyboard.Up) {
      const currentActiveElementIsNotFirstItem = activeOptionIndex > (state ? -1 : 0);

      if (currentActiveElementIsNotFirstItem) {
        setActiveOptionIndex(activeOptionIndex - 1)
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    if (event && event.stopPropagation) {
      event.stopPropagation()
    }
    
    if (searchMode && options.length > 0) {
      switch (event.code) {
        case Keyboard.Enter:
        case Keyboard.Return:
          (!(props.config.selectMultiple)) ? handleSelection(options[activeOptionIndex]) : handleMultipleSelection(options[activeOptionIndex]);
          return;

        case Keyboard.Down:
          event.preventDefault()
          focusNextListItem(Keyboard.Down);
          return;

        case Keyboard.Up:
          event.preventDefault()
          focusNextListItem(Keyboard.Up);
          return;

        case Keyboard.Esc:
        case Keyboard.Escape:
          resetSearch()
          return;

        default: return;
      } 
    } else if (searchMode) { 
      // Incase, user decides to cancel the interaction prior to typing
      switch (event.code) {
        case Keyboard.Esc:
        case Keyboard.Escape:
          resetSearch()
          break
        default: break
      }
    }
  }

  function shallDropdownGrowUp (): boolean {
    if (myContainer.current) {
      const rect = myContainer.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const spaceBelow = viewportHeight - (rect.top + rect.height)

      return (spaceBelow < DROPDOWN_MAX_HEIGHT) && (spaceAbove > spaceBelow)
    }

    return false
  }

  useEffect(() => {
    if (selectInputContainer?.current) {
    const { top, bottom, width } = selectInputContainer.current.getBoundingClientRect()

      if (shallDropdownGrowUp()) {
        if (optionsWrapper?.current) {
          const { height } = optionsWrapper.current.getBoundingClientRect()
          setOptionsContainerTop((top - height) + 'px')
        }

        if (searchResultsWrapper?.current) {
          const { height } = searchResultsWrapper.current.getBoundingClientRect()
          setSearchResultsContainerTop((top - height) + 'px')
        }
      } else {
        if (optionsWrapper?.current) {
          setOptionsContainerTop((bottom) + 'px')
        }

        if (searchResultsWrapper?.current) {
          setSearchResultsContainerTop((bottom) + 'px')
        }
      }

      setOptionsContainerwidth(width + 'px')
    }
  }, [myContainer?.current, selectInputContainer?.current, optionsWrapper?.current, searchResultsWrapper?.current, shallDropdownGrowUp, searchMode])

  useEffect(() => {
    if (!props.config.isReadOnly) {
      if (searchMode) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchMode])

  function didClickUserCard(option: User) {
    return (props.config.selectMultiple) ? handleMultipleSelection(option) : handleSelection(option)
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.userId, {[styles.inTableCell]: props.inTableCell})} data-test-id={props.id} ref={myContainer}>
        {!props.config.isReadOnly &&
          <div ref={selectInputContainer}>
            {(!state || (state && !(Array.isArray(state)) && (!state.firstName && !state.lastName && !state.email && !state.userName))) &&
              <OroButton
                label={getI18ControlText('--fieldTypes--.--userId--.--selectUser--')}
                // icon={<Plus size={16} color={'#262626'} />}
                width="fillAvailable"
                radiusCurvature='low'
                className={classnames(styles.addUserBtn, { [styles.focus]: searchMode, [styles.invalid]: error })}
                onClick={startSearchMode}
              />}

            {props.config.selectMultiple && state && Array.isArray(state) &&
              <OroButton
                label={getI18ControlText('--fieldTypes--.--userId--.--selectUser--')}
                // icon={<Plus size={16} color={'#262626'} />}
                width="fillAvailable"
                radiusCurvature='low'
                className={classnames(styles.addUserBtn, { [styles.focus]: searchMode, [styles.invalid]: error })}
                onClick={startSearchMode}
              />}
          </div>}

        {/* Search users across organisation (typeahead) */}
        {!props.config.userListingConfig?.type &&
        <div
          className={classnames(styles.optionsWrapper, { [styles.visible]: searchMode, [styles.absolute]: props.config?.absolutePosition })}
          style={!props.config?.absolutePosition ? {top: searchResultsContainerTop, width: optionsContainerwidth} : {}}
          ref={searchResultsWrapper}
        >
          <div className={styles.search}>
            <Search size={16} color={'#575F70'} />
            <input
              id={props.id}
              ref={inputRef}
              type="text"
              placeholder={getI18ControlText('--fieldTypes--.--userId--.--searchByName--')}
              value={searchString || ''}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchString && <X size={16} color={'#575F70'} onClick={clearSearch} />}
          </div>

          <div ref={filteredResultsContainer}>
            {
              options.map((option, i) =>
                <UserCard
                  key={i}
                  index={i}
                  activeOptionIndex={activeOptionIndex}
                  value={option}
                  allowClick={true}
                  onClick={() => didClickUserCard(option)}
                  doNotShowUserEmail={props.config.doNotShowUserEmail}
                />
              )
            }
          </div>

          {options.length === 0 &&
            <div className={`${styles.optionItem} ${styles.hint}`}>
              {searchString ? getI18ControlText('--fieldTypes--.--userId--.--noMatchingResultFound--') : getI18ControlText('--fieldTypes--.--userId--.--typeKeywordToSearch--')}
            </div>}
          {isUserAlreadyAdded &&
            <div className={`${styles.optionItem} ${styles.alert}`}>
              {getI18ControlText('--fieldTypes--.--userId--.--userAlreadyAdded--')}
            </div>}
        </div>}

        {/* Select user from pre-fetched options */}
        {props.config.userListingConfig?.type &&
        <div
          className={classnames(styles.optionsWrapper, { [styles.visible]: searchMode, [styles.absolute]: props.config?.absolutePosition })}
          style={!props.config?.absolutePosition ? {top: optionsContainerTop, width: optionsContainerwidth} : {}}
          ref={optionsWrapper}
        >
          {props.options.map((userOption, i) =>
            <UserCard
              key={i}
              index={i}
              activeOptionIndex={activeOptionIndex}
              value={userOption}
              allowClick={true}
              onClick={() => (props.config.selectMultiple) ? handleMultipleSelection(userOption) : handleSelection(userOption)}
              doNotShowUserEmail={props.config.doNotShowUserEmail}
            />)}

          {props.options.length === 0 &&
            <div className={`${styles.optionItem} ${styles.hint}`}>
              {getI18ControlText('--fieldTypes--.--userId--.--noUserFound--')}
            </div>}
          {isUserAlreadyAdded &&
            <div className={`${styles.optionItem} ${styles.alert}`}>
              {getI18ControlText('--fieldTypes--.--userId--.--userAlreadyAdded--')}
            </div>}
        </div>}

        {searchMode &&
          <div className={styles.backdrop} onClick={resetSearch}></div>}

        {state && !(Array.isArray(state)) && (state.firstName || state.lastName || state.email || state.userName) &&
          <div className={`${props.config.isBgColorNotRequired ? '' : classNames(styles.selectedUser)}`}>
            <UserCard value={state} showDelete={!props.config.isReadOnly} onDelete={clearSelection}
              userProfilePic={profilePicture && (profilePicture[state.email] || '')}
              doNotShowUserEmail={props.config.doNotShowUserEmail}
            />
          </div>}

        {props.config.selectMultiple && state && Array.isArray(state) && state.map((item, index) => {
          return (
            <div className={classnames(`${props.config.isBgColorNotRequired ? '' : styles.selectedUser}`, styles.userCardMargin, 'userCard')} key={index}>
              <UserCard value={item} showDelete={!props.config.isReadOnly} onDelete={clearSelection} userProfilePic={profilePicture && (profilePicture[item.email] || '')}
              doNotShowUserEmail={props.config.doNotShowUserEmail}/>
            </div>
          )
        })}
        {error && props.inTableCell &&
          <div className={styles.inTableCellAlert}>
            <OroErrorTooltip title={error}><img src={AlertCircle} /></OroErrorTooltip>
          </div>}
      </div>

      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
