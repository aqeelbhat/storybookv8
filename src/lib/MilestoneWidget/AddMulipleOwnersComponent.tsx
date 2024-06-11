import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from './ActionTrackerRow.module.scss'
import { PlusCircle, X } from "react-feather"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import classNames from "classnames"
import { Option } from "../Inputs"
import { getUserDisplayName } from "../Form"
import { debounce } from "../util"
import { OROSpinner } from "../Loaders"
import { SuggestionRequest, User } from "../Types"
import { Keyboard } from "../Types/common"
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

type AddMulipleOwnersComponentProps = {
    label?: string
    isHeader?: boolean
    ownersList?: Array<Option>
    clearSearchInput?:boolean
    getUserSuggestions?: (data: SuggestionRequest) => Promise<User[]>
    isRowSelected: (value: boolean) => void
    onOwnersUpdate?: (status: Array<Option>, isRemoved?: boolean) => void
}

function AddMulipleOwnersComponentContent (props: AddMulipleOwnersComponentProps) {
  const ownerInputRef = useRef<HTMLInputElement | null>(null)
  const [showOwnerSearchField, setShowOwnerSearchField] = useState<boolean>(false)
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(true)
  const [selectedOwnerList, setSelectedOwnerList] = useState<Array<Option>>([])
  const [ownerOptionsFilteredList, setOwnerOptionsFilteredList] = useState<Array<Option>>([])
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [searchOwnerInputKeyword, setSearchOwnerInputKeyword] = useState('')
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)


  useEffect(() => {
    if (props.clearSearchInput) {
      setSelectedOwnerList([])
      setShowOwnerDropdown(true)
      setShowOwnerSearchField(false)
    } else if (props.ownersList) {
      // console.log(props.ownersList)
      setSelectedOwnerList(props.ownersList)
    }
  }, [props.ownersList, props.clearSearchInput])


  useEffect(() => {
    if (props.clearSearchInput) {
      setSearchOwnerInputKeyword('')
    }
  }, [props.clearSearchInput])

  useEffect(() => {
    if (showOwnerSearchField !== undefined) {
      props.isRowSelected(showOwnerSearchField)
    }
  }, [showOwnerSearchField])

  function onOwnerDropDownClick () {
    setShowOwnerDropdown(false)
    setShowOwnerSearchField(true)
    // setSearchOwnerInputKeyword('')
    setTimeout(() => {
      if (ownerInputRef.current) {
        ownerInputRef.current.focus()
      }
      setOwnerOptionsFilteredList([])
      setShowPopup(true)
    }, 200)
  }

  function onOwnerOutsideClick (e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowPopup(false)
      setShowOwnerSearchField(false)
      // setSearchOwnerInputKeyword(ownerInputValue)
      setOwnerOptionsFilteredList([])
    }
  }

  function onOwnerInputFocus (vt: React.FocusEvent<HTMLInputElement>) {
    if (searchOwnerInputKeyword) {
      debouncedUserSearch(searchOwnerInputKeyword)
    }
    setTimeout(() => {
      setShowPopup(true)
    }, 200)
  }

  function onOwnerInputBlur (e) {
    setShowOwnerDropdown(true)
    setShowOwnerSearchField(false)
    // if (searchOwnerInputKeyword.length === 0) {
    //   setShowOwnerDropdown(true)
    // }
  }

  function searchUsers (value: string): Promise<Array<Option>> {
    if (value && props.getUserSuggestions) {
      setLoadingUsers(true)
      return props.getUserSuggestions({
        keyword: value.trim()
      })
        .then(users => {
          setLoadingUsers(false)
          const userOptions: Array<Option> = users.map(user => ({
            id: user.userName,
            displayName: getUserDisplayName(user),
            path: user.userName,
            customData: user
          }))
          setOwnerOptionsFilteredList(userOptions)
          setShowPopup(true)
          return userOptions
        })
        .catch(err => {
          setLoadingUsers(false)
          console.log(err)
          return []
        })
      } else {
        setOwnerOptionsFilteredList([])
        setShowPopup(true)
        return Promise.resolve([])
      }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedUserSearch = useMemo(() => debounce(searchUsers), [])

  function handleOwnerInputChange (evt) {
    setSearchOwnerInputKeyword(evt.target.value)
    debouncedUserSearch(evt.target.value)
  }

  function handleRemoveUser (deleteUser: Option) {
    const updatedUserList: Array<Option> = selectedOwnerList.filter(user => (user.path !== deleteUser.path && user.id !== deleteUser.id))
    if (props.onOwnersUpdate) {
      props.onOwnersUpdate(updatedUserList, true)
    }
  }

  function onOwnerOptionSelected (ownerOption: Option) {
    let onwerList: Array<Option> = []
    if (selectedOwnerList.length > 0) {
      if(!selectedOwnerList.find(user => user.customData.userName === ownerOption.customData.userName)){
        onwerList = [...selectedOwnerList, ownerOption]
      } else if (onwerList?.length === 0 && props.isHeader) {
        onwerList = [...selectedOwnerList]
      }
    } else {
      onwerList = [ownerOption]
    }
    // const onwerList = [...selectedOwnerList, ownerOption]
    if (props.onOwnersUpdate && onwerList.length > 0) {
      props.onOwnersUpdate(onwerList)
      setSelectedOwnerList(onwerList)
    }
    setSearchOwnerInputKeyword('')
    setShowPopup(false)

  }

  function handleAddOwnerKeydown(event: React.KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    event.stopPropagation()

    if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
      event.preventDefault()
      onOwnerDropDownClick()
    }
  }

  return(
    <div className={classNames(`${ props.isHeader ? styles.atrOwnerSectionList : styles.atrOwnerList}`)}  onBlur={(e) => onOwnerOutsideClick(e)}>
      {
        showOwnerDropdown && selectedOwnerList?.length === 0 &&
            <div className={styles.atrOwnerDropDown} tabIndex={0} onKeyDown={handleAddOwnerKeydown} onClick={() => onOwnerDropDownClick()}>
              <span><PlusCircle color='var(--warm-neutral-shade-200)' size={14}></PlusCircle>{ props.label ? props.label : t('--milestone--.--addOwner--') }</span>
            </div>
      }
      {
        (selectedOwnerList?.length > 0 || showOwnerSearchField) &&
          <div className={classNames(`${styles.atrOwnerContainer}`)} tabIndex={0} onClick={() => setShowOwnerSearchField(true)}>
            <div className={classNames(`${styles.tagContainer} ${!showOwnerSearchField ? styles.removeGap : ''}`)}>
              {selectedOwnerList?.length > 0 &&
                <div className={`${styles.tagContainerTags} ${selectedOwnerList?.length === 0 ? styles.removePadding : ''}`} id="ownerTags">
                  {selectedOwnerList?.length > 0 && selectedOwnerList.map((user, index) => {
                    return (
                      <div className={styles.tagContainerTagsItem} key={index}>
                        <div className={styles.tagContainerTagsContainer}>
                          <div className={styles.User}>
                            <span>{user.displayName}</span>
                          </div>
                          {showOwnerSearchField && <span className={styles.closeIcon}><X color="var(--warm-neutral-shade-200)" className={styles.closeIconSym} size={16} onMouseDown={() => handleRemoveUser(user)}/></span>}
                        </div>
                      </div>
                    )
                  })}
              </div>}
                <div className={styles.searchConatiner}>
                  { showOwnerSearchField &&
                  <input autoFocus placeholder={t('--milestone--.--search--')} value={searchOwnerInputKeyword} onChange={handleOwnerInputChange} onFocus={onOwnerInputFocus} ref={ele => { ownerInputRef.current = ele }} onBlur={onOwnerInputBlur}/>
                  }
                  { showPopup && searchOwnerInputKeyword &&
                    <Dropdown toggle={() => {setShowPopup(!showPopup)}} isOpen={showPopup} className={classNames(`${styles.tagContainerDrp} ${selectedOwnerList?.length === 0 ? styles.DrpOnEmptyList : ''}`)}>
                      <DropdownToggle className={styles.tagContainerDrpToggle}><></>
                      </DropdownToggle>
                      <DropdownMenu className={styles.tagContainerDrpMenu}>
                        { !loadingUsers && ownerOptionsFilteredList.length > 0 && ownerOptionsFilteredList.map((option, index) => (
                          <DropdownItem key={index} onMouseDown={() => { onOwnerOptionSelected(option) }} className={styles.tagContainerDrpMenuItem}>
                            {option.displayName}
                          </DropdownItem>
                        )) }
                        { !loadingUsers && ownerOptionsFilteredList.length === 0 && <div className={styles.emptyList}>{t('--milestone--.--noMatchingUserFound--')}</div> }
                        { loadingUsers && <div className={styles.userLoader}><OROSpinner /></div>}
                      </DropdownMenu>
                    </Dropdown>
                    }
                </div>
                </div>
          </div>
      }
    </div>
  )
}
function AddMulipleOwnersComponent (props: AddMulipleOwnersComponentProps) {
  return <I18Suspense><AddMulipleOwnersComponentContent {...props}  /></I18Suspense>
}

export default AddMulipleOwnersComponent