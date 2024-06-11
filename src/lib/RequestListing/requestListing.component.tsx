import React, { useState, useEffect } from "react";
import style from "./requestListing-portal-panel.module.scss";
import { Check, Edit3, Plus, Search, Square } from "react-feather";
import classNames from "classnames";
import { AddNewList } from "./components/addNewList.component";
import { ListType, RequestList, SmartList } from "./types";
import { ClickAwayListener } from '@mui/material'
import { mapSmartListArray } from "./mappers";
import { AddRequestToList } from "./components/AddRequestToList.component";
import { Option } from "../Inputs";
import { Popover } from "reactstrap";
import { User, UserId } from "../Types/common";
import { ENTER_KEY_CODE } from "../Inputs/types";
import defaultUserPic from '../Form/assets/default-user-pic.png'
import { createImageFromInitials } from "../util";
import { getSignedUser } from "../SigninService";
import { getUserDisplayName } from "../Form";
import { mapUser } from "../Types";

export type RequestListingProps = {
refTarget
isRequestListOpen: boolean
isAddRequestToListOpen: boolean
selectedList: string
requestList: RequestList | null
closePopups?: boolean
onUserSearch?: (query: string) => Promise<Array<User>>
handleShowRequestList?: (isAll: boolean, list: SmartList) => void
handleCreateNewList?: (name: string, type: ListType, list: SmartList) => void
handleUpdateList?: (id: number, list: SmartList) => void
handleDeleteList?: (id: number) => void
onClosedRequestList?: () => void
onCloseAddNewReqPopup?: () => void
}

export function RequestListing (props: RequestListingProps) {
  const [openAddNewListForm, setOpenAddNewListForm] = useState<boolean>(false)
  const [isEditRequest, setIsEditRequest] = useState<boolean>(false)
  const [openRequestList, setOpenRequestList] = useState<boolean>(false)
  const [listAddedByMe, setListAddedByMe] = useState<Array<SmartList>>([])
  const [listSharedWithMe, setListSharedWithMe] = useState<Array<SmartList>>([])
  const [selectedEditList, setSelectedEditList] = useState<SmartList>()
  const [selectedShowList, setSelectedShowList] = useState<string>()

  /** search list Operation */
  const [smartListOptions, setSmartListOptions] = useState<Array<Option>>([])
  const [searchString, setSearchString] = useState<string>('')
  const [selectedSearchResult, setSelectedSearchResult] = useState<Array<SmartList>>([])

  const [openAddNewReqToListForm, setOpenAddNewReqToListForm] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User>()

  useEffect(() => {
    const logInUser = getSignedUser()
    if (logInUser) {
      const user = {
      email: logInUser.email,
      name: getUserDisplayName(logInUser),
      firstName: logInUser.givenName,
      lastName: logInUser.familyName,
      picture: logInUser?.picture,
      userName: logInUser.userName
      }
      setCurrentUser(mapUser(user))
    }
  }, [])

  useEffect(() => {
    let smartlists = []
    if (props.requestList?.mine) {
      setListAddedByMe(mapSmartListArray(props.requestList?.mine))
      const listNames = props.requestList?.mine.map(list => {
        return {
          id: list.id,
          path: list.id,
          displayName: list.name,
          selectable: true
        }
      })
      smartlists = [...listNames, ...smartlists]
    }
    if (props.requestList?.sharedWithMe) {
      setListSharedWithMe(mapSmartListArray(props.requestList?.sharedWithMe))
      const listNames = props.requestList?.sharedWithMe.map(list => {
        return {
          id: list.id,
          path: list.id,
          displayName: list.name,
          selectable: true
        }
      })
      smartlists = [...listNames, ...smartlists]
    }
    setSmartListOptions(smartlists)
    setSearchString('')
    setSelectedSearchResult([])
  }, [props.requestList])

  useEffect(() => {
    if (props.closePopups) {
      setOpenAddNewListForm(false)
      setOpenAddNewReqToListForm(false)
    }
  }, [props.closePopups])

  useEffect(() => {
    setSelectedShowList(props.selectedList)
  }, [props.selectedList])

  useEffect(() => {
    setOpenRequestList(props.isRequestListOpen)
  }, [props.isRequestListOpen])

  useEffect(() => {
    setOpenRequestList(props.isAddRequestToListOpen)
    setOpenAddNewReqToListForm(props.isAddRequestToListOpen)
  }, [props.isAddRequestToListOpen])

  function handleRequestListClose () {
      setOpenRequestList(false)
      if (props.onClosedRequestList) {
        props.onClosedRequestList()
      }
  }

  function handleUpdateList (id: number, item: SmartList) {
    if (props.handleUpdateList) {
      setIsEditRequest(false)
      props.handleUpdateList(id, item)
    }
  }

  function handleDeleteList (id: number) {
    if (props.handleDeleteList) {
      setIsEditRequest(false)
      props.handleDeleteList(id)
    }
  }

  function handleCreateNewRequestList () {
    setOpenAddNewReqToListForm(false)
    setOpenRequestList(true)
    setOpenAddNewListForm(true)
    setSelectedEditList(null)
  }

  useEffect(() => {
    if (props.selectedList) {
      setSelectedShowList(props.selectedList)
    }
  }, [props.selectedList])

  function handleCloseAddNewReqPopup () {
    if (props.onCloseAddNewReqPopup) {
      props.onCloseAddNewReqPopup()
    }
  }

  function handleShowRequestList (isAll: boolean, list: SmartList | null) {
    if (list) {
      setSelectedShowList(list?.id.toString())
    } else {
      setSelectedShowList('all')
    }
    if (!openAddNewReqToListForm && props.handleShowRequestList) {
      props.handleShowRequestList(isAll, list)
    } else if (openAddNewReqToListForm && props.handleUpdateList) {
      handleUpdateList(list?.id, list)
    }
  }

  function handleSearchResult (keyword: string) {
    const searchResult = props.requestList?.mine.filter(list => list.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
    const shareListResult = props.requestList?.sharedWithMe.filter(list => list.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
    if (searchResult?.length > 0 && shareListResult?.length > 0) {
      setSelectedSearchResult([...searchResult, ...shareListResult])
    } else if (searchResult?.length > 0) {
      setSelectedSearchResult(searchResult)
    } else if (shareListResult?.length > 0) {
      setSelectedSearchResult(shareListResult)
    } else {
      setSelectedSearchResult([])
    }
  }

  function handleSearchChange (result) {
    if (result.target.value) {
      setSearchString(result.target.value)
      handleSearchResult(result.target.value)
    } else {
      setSelectedSearchResult([])
      setSearchString('')
    }
  }

  function getProfilePic (user: UserId) {
    const [firstName, lastName] = user?.name ? user.name.split(' ') : ['', '']
    return user?.picture || createImageFromInitials(firstName, lastName)
  }

  function handleKeyDown (e) {
    if (searchString) {
      switch (e.keyCode) {
        case ENTER_KEY_CODE:
          handleSearchResult(searchString)
          return

        default:
          return
      }
    }
  }

  return (
    <div>
      {openRequestList && <ClickAwayListener onClickAway={handleRequestListClose}>
        <div id="requestListing">
          <Popover flip={false} target={props.refTarget} placement="bottom" isOpen={openRequestList} toggle={handleRequestListClose} hideArrow={true} className={style.listingPopover} positionLeft={200} positionTop={-36}>
            <div className={style.requestListing}>
              <div className={style.requestListingContainer}>
                {/* <div className={style.header}>
                    <div className={style.titleContainer}>
                      <img src={ListIcon} width={17} height={17} />
                      <span className={style.title}>List</span>
                    </div>
                    <Plus size={20} color="var(--warm-neutral-shade-200)" cursor="pointer" onClick={() => {setOpenAddNewListForm(true); setSelectedEditList(null)}}/>
                </div> */}
                <div className={classNames(style.body, openAddNewReqToListForm ? style.margin : '')}>
                  <div className={style.searchContainer} id='requestListingSearch'>
                    <Search size={16} color="var(--warm-neutral-shade-100)"/>
                    <input
                      type="text"
                      placeholder="Type here"
                      value={searchString || ''}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className={style.margin}>
                    <div className={classNames(style.requestList, style.listContainer,  selectedShowList === 'all' ? style.selectedList : '')}>
                      <div className={style.requestListContainer} onClick={() => handleShowRequestList(true, null)}>
                        <span className={style.name}>Request List (default)</span>
                        {/* <span className={style.count}>228</span> */}
                      </div>
                      <Check size={16} cursor="pointer" className={style.icon}/>
                    </div>
                  </div>
                  <div className={style.container}>
                    {!searchString && listAddedByMe.length > 0 && <div className={classNames(style.listContainer, style.margin)}>
                      {listAddedByMe.length > 0 && listAddedByMe.map((item, index) => {
                        return (
                          <div className={classNames(style.requestList,  selectedShowList === item?.id.toString() ? style.selectedList : '')} key={`mylist_${index}`} onClick={() => handleShowRequestList(false, item)}>
                            <div className={style.requestListContainer}>
                              <span className={style.name}>{item.name}</span>
                              <span className={style.count}>{item.config?.requests && item.config?.requests.length || 0}</span>
                            </div>
                            <div className={style.moreOption}>
                              {item.sharedWith?.length > 0 && <div className={style.users}>
                                <img className={style.usersPic} src={getProfilePic(item.sharedWith[0]) || defaultUserPic} alt="User profile" />
                                {item.sharedWith?.length > 1 && <span className={classNames(style.usersPic, style.usersCount)}>{`+${item.sharedWith?.length}`}</span>}
                              </div>}
                              {!openAddNewReqToListForm && selectedShowList === item?.id.toString() && <Edit3 size={16} cursor="pointer" onClick={() => { setSelectedEditList(item); setIsEditRequest(true); setOpenAddNewListForm(true)}} className={style.icon}/>}
                            </div>
                          </div>
                        )
                      })}
                    </div>}
                    {!searchString && listSharedWithMe.length > 0 && <div className={classNames(style.listContainer, style.margin)}>
                    {listSharedWithMe.length > 0 && listSharedWithMe.map((item, index) => {
                        return (
                          <div className={classNames(style.requestList,  selectedShowList === item?.id.toString() ? style.selectedList : '')} key={`sharedList_${index}`} onClick={() => handleShowRequestList(false, item)}>
                            <div className={style.requestListContainer}>
                              <span className={style.name}>{item.name}</span>
                              <span className={style.count}>{item.config?.requests && item.config?.requests.length || 0}</span>
                            </div>
                            <div className={style.moreOption}>
                              {item.sharedWith?.length > 0 && <div className={style.users}>
                                <img className={style.usersPic} src={getProfilePic(item.sharedWith[0]) || defaultUserPic} alt="User profile" />
                                {item.sharedWith?.length > 1 && <span className={classNames(style.usersPic, style.usersCount)}>{`+${item.sharedWith?.length}`}</span>}
                              </div>}
                              {!openAddNewReqToListForm && selectedShowList === item?.id.toString() && <Edit3 size={16} cursor="pointer" onClick={() => { setSelectedEditList(item); setIsEditRequest(true); setOpenAddNewListForm(true)}} className={style.icon}/>}
                            </div>
                          </div>
                        )
                      })}
                    </div>}

                    {selectedSearchResult && selectedSearchResult.map((item,index) => {
                      return(<div key={index} className={classNames(style.listContainer)}>
                        <div className={classNames(style.requestList,  selectedShowList === item?.id.toString() ? style.selectedList : '')} key={`search_result`} onClick={() => handleShowRequestList(false, item)}>
                          <div className={style.requestListContainer}>
                            <span className={style.name}>{item.name}</span>
                            <span className={style.count}>{item.config?.requests && item.config?.requests.length || 0}</span>
                          </div>
                          <div className={style.moreOption}>
                              { item?.owner?.userName !== currentUser?.userName && item.sharedWith?.length > 0 && <div className={style.users}>
                                <img className={style.usersPic} src={getProfilePic(item.sharedWith[0]) || defaultUserPic} alt="User profile" />
                                {item.sharedWith?.length > 1 && <span className={classNames(style.usersPic, style.usersCount)}>{`+${item.sharedWith?.length}`}</span>}
                              </div>}
                              {!openAddNewReqToListForm && selectedShowList === item?.id.toString() && <Edit3 size={16} cursor="pointer" onClick={() => { setSelectedEditList(item); setIsEditRequest(true); setOpenAddNewListForm(true)}} className={style.icon}/>}
                          </div>
                          {/* <Edit3 size={16} cursor="pointer" onClick={() => { setSelectedEditList(item); setIsEditRequest(true); setOpenAddNewListForm(true)}} className={style.icon}/> */}
                      </div>
                    </div>)
                    })}
                    {
                      searchString && selectedSearchResult.length === 0 && <div className={style.emptySearchResult}>
                        <div className={style.info}>List not found</div>
                        {!openAddNewReqToListForm && <div className={style.info}>Create a new list by selecting request from the table.</div>}
                      </div>
                    }
                    { openAddNewReqToListForm && !searchString && listAddedByMe.length === 0 && listSharedWithMe.length === 0 && <div className={style.emptySearchResult}>
                      <div className={style.info}>Start by creating new list</div>
                    </div>}
                  </div>
                </div>
                {openAddNewReqToListForm && <div className={style.footer}>
                  <div className={style.emptySearchResult}>
                          <div className={style.createBtn} onClick={() => {setOpenAddNewListForm(true); setSelectedEditList(null)}}>
                            <Plus size={16} color="var(--warm-neutral-shade-300)"/>
                            <span className={style.title}>Create list</span>
                          </div>
                        </div>
                  </div>}
              </div>
            </div>
          </Popover>
          <AddNewList
            isOpen={openAddNewListForm}
            list={selectedEditList}
            currentUser={currentUser}
            requestList={props.requestList}
            searchString={searchString}
            toggleModal={() => {setOpenAddNewListForm(!openAddNewListForm); setIsEditRequest(false)}}
            isEditRequest={isEditRequest}
            onUserSearch={props.onUserSearch}
            handleCreateNewList ={props.handleCreateNewList}
            handleUpdateList={handleUpdateList}
            handleDeleteList={handleDeleteList}
          />
        </div>
      </ClickAwayListener>}
      {/* <AddRequestToList
        isOpen={openAddNewReqToListForm}
        requestList={props.requestList}
        searchOptions={smartListOptions}
        handleCreateNewRequestList={handleCreateNewRequestList}
        handleUpdateList={handleUpdateList}
        toggleModal={handleCloseAddNewReqPopup}
      /> */}
    </div>
  )
}
