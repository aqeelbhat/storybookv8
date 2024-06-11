import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import React, { useEffect, useRef, useState } from "react"
import style from "./addNewList.module.scss"
import { Trash2, X } from "react-feather"
import { OroButton } from "../../controls"
import { Option, Radio } from "../../Inputs"
import classNames from "classnames"
import { ListType, RequestList, SmartList } from "../types"
import { User, UserId, mapUser } from "../../Types"
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { getProfilePic } from "../../Form/risk-data-validation-form.component"
import { mapUserToUserId } from "../mappers"
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import { use } from "i18next"


export type AddNewListProps = {
    list?: SmartList
    isOpen: boolean
    width?: number
    isEditRequest?: boolean
    searchString?: string
    requestList?: RequestList
    currentUser?: User
    toggleModal?: () => void
    onUserSearch?: (query: string) => Promise<Array<User>>
    handleCreateNewList?: (name: string, type: ListType, list: SmartList) => void
    handleUpdateList?: (id: number, list: SmartList) => void
    handleDeleteList?: (id: number) => void
}

export function AddNewList (props: AddNewListProps) {

    const [name, setName] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const asyncUserTypeaheadRef = useRef<any>(null)
    const [visibleTo, setVisibleTo] = useState<Option>()
    const [owner, setOwner] = useState<UserId>()
    const [isLoading, setIsLoading] = useState(false)
    const [userSuggestions, setUserSuggestions] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User[]>([])
    const [error, setError] = useState<boolean>(false)

    const VISIBILITY_OPTIONS: Array<Option> = [
      {
        id: 'all',
        displayName: "All",
        path: 'all'
      },
      {
        id: 'private',
        displayName: "Private",
        path: 'private'
      }
    ]

    useEffect(() => {
      setIsOpen(props.isOpen)
      if (props.isOpen && props.list === null) {
        setName('')
        setOwner(null)
        setSelectedUser([])
      }
    }, [props.isOpen])


    function checkListNameAlreadyExist (name: string) {
      let searchResult = props.requestList?.mine.find(list => list.name.toLocaleLowerCase() === name.toLocaleLowerCase())
      if (!searchResult) {
        searchResult = props.requestList?.sharedWithMe.find(list => list.name.toLocaleLowerCase() === name.toLocaleLowerCase())
      }
      return searchResult
    }

    useEffect(() => {
      if (props.searchString && !props.list?.name) {
        if (checkListNameAlreadyExist(props.searchString)) {
          setError(true)
        } else {
          setError(false)
        }
        setName(props.searchString)
      }
    }, [props.searchString])

    useEffect(() => {
      if (props.currentUser && props.list === null && props.isOpen) {
        if (!selectedUser.find(user => user.userName === props.currentUser.userName)) {
          const users = selectedUser ? [...selectedUser, props.currentUser] : [props.currentUser]
          setSelectedUser(users)
          setOwner(mapUserToUserId(props.currentUser))
        }
      }
    }, [props.currentUser, props.isOpen])

    useEffect(() => {
      if (props.list && props.isOpen) {
        let allSelectedUsers: Array<User> = selectedUser
        setName(props.list?.name || '')

        if (props.list?.config && props.list?.config?.visibility) {
          const visiblity = VISIBILITY_OPTIONS.find(item => item.id === props.list?.config?.visibility)
          setVisibleTo(visiblity)
        }

        if (props.list.owner) {
          const listOwner = mapUser(props.list.owner)
          setOwner(props.list.owner)
          if (!allSelectedUsers.find(user => user.userName === listOwner.userName)) {
            allSelectedUsers.push(listOwner)
          }
          if (selectedUser) {
            setSelectedUser([listOwner, ...selectedUser])
          } else {
            setSelectedUser([listOwner])
          }
        }

        if (props.list?.sharedWith?.length > 0) {
          const users = props.list.sharedWith.map(mapUser)
          allSelectedUsers = [...allSelectedUsers, ...users]
        }
        setSelectedUser(allSelectedUsers)
      }
    }, [props.list])

    const styles = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: props.width && props.width > 460 ? props.width : 460,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '8px',
        p: 4,
        outline: 'none',
        padding: '16px 24px'
      }

    function toggleModal () {
      if (props.toggleModal) {
        setSelectedUser([])
        props.toggleModal()
      }
    }

    function searchUsers (query: string) {
      if (props.onUserSearch) {
        setIsLoading(true)
        setUserSuggestions([])
        props.onUserSearch(query)
          .then(users => {
            setIsLoading(false)
            setUserSuggestions(users)
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
            setUserSuggestions([])
          })
      } else {
        setUserSuggestions([])
      }
    }

    function handleUserSelect (e: Array<User>) {
      setSelectedUser(e)
    }

    function handleCreateNewList () {
        const sharedWith = selectedUser.filter(user => {
          if (user.userName !== owner.userName) {
            return mapUserToUserId(user)
          }
        })
        if (!props.isEditRequest && props.handleCreateNewList && !error) {
            const list = {
              id: 0,
              owner: owner,
              sharedWith: sharedWith,
              name: name,
              type: ListType.request
            }
            props.handleCreateNewList(name, ListType.request, list)
        } else if (props.isEditRequest && props.handleUpdateList && props.list && !error) {
            const config = { ...props.list.config }
            const list = {
              id: props.list.id,
              owner: owner || props.list.owner,
              sharedWith: sharedWith,
              name: name || props.list.name,
              type: ListType.request,
              config: config
            }
            props.handleUpdateList(props.list.id, list)
        }
    }

    function handleVisibilitySelection (selectedOption: Option) {
        setVisibleTo(selectedOption)
    }

    function handleNameChange (e) {
        const name = e.target.value
        if (checkListNameAlreadyExist(name)) {
          setError(true)
        } else {
          setError(false)
        }
        setName(name)
    }

    function handleDeleteList () {
      if (props.list && props.handleDeleteList) {
        props.handleDeleteList(props.list.id)
      }
    }

    return (
        <>
          <Modal
            open={isOpen}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={styles}>
                <div className={style.addNewList}>
                    <div className={style.header}>
                      <span className={style.title}>{props.isEditRequest ? 'Edit List' : 'Create List'}</span>
                      <X size={20} color="var(--warm-neutral-shade-300)" cursor="pointer" onClick={() => toggleModal()}/>
                    </div>
                    <div className={style.body}>
                        <div className={style.formBody}>
                            <div className={style.fields}>
                                <span className={style.label}>Name</span>
                                <input type="text" onChange={handleNameChange} value={name} className={error ? style.error : ''}/>
                                {error && <div className={style.validationError}>
                                  <img src={AlertCircle} width={16} height={16} color="var(--warm-stat-chilli-regular)"/>
                                  <span className={style.info}>This name already exists. Try another name.</span>
                                </div>}
                            </div>
                            <div className={style.fields}>
                                <span className={style.label}>Visibility to</span>
                                {/* <div>
                                    <Radio
                                      options={VISIBILITY_OPTIONS}
                                      name=""
                                      showHorizontal={true}
                                      value={visibleTo}
                                      onChange={handleVisibilitySelection}
                                </div> */}
                                {
                                  <AsyncTypeahead
                                  className={'reactBootstrapSearchTypeahead'}
                                  id="teamLeads"
                                  useCache={false}
                                  isLoading={isLoading}
                                  allowNew={false}
                                  multiple={true}
                                  labelKey={(option: User) => (option.firstName && option.lastName) ? `${option.firstName} ${option.lastName}` : option.name}
                                  minLength={1}
                                  selected={selectedUser.map(mapUser)}
                                  onSearch={searchUsers}
                                  onChange={handleUserSelect}
                                  options={userSuggestions}
                                  placeholder="Search for User"
                                  ref={asyncUserTypeaheadRef}
                                  filterBy={(option, props) => {
                                    return true
                                  }}
                                  renderMenuItemChildren={(option:User) => (
                                      <div className="dropdown-item-teamFormat">
                                          <img src={option.picture || getProfilePic(option)} alt="" />
                                          <div className="dropdown-item-teamFormat-row">
                                              <div className="dropdown-item-teamFormat-teammember"><span>{`${option?.firstName} ${option?.lastName}`}</span></div>
                                              <div className="dropdown-item-teamFormat-teammemberemail"><span>{option?.email}</span></div>
                                          </div>
                                      </div>
                                  )}
                                />
                                }
                            </div>
                        </div>
                        <div className={style.formFooter}>
                          <div>
                            {props.isEditRequest && <button className={style.buttonDelete} onClick={() => handleDeleteList()}>
                              <Trash2 height={18.33} width={17} color="var(--warm-neutral-shade-400)"/>
                              <span className={style.label}>Delete</span>
                            </button>}
                          </div>
                          <div className={style.primaryBtns}>
                            <OroButton label="Cancel" type="default" className={classNames(style.btn, style.cancelBtn)} onClick={() => toggleModal()}/>
                            <OroButton label="Save" type="primary" className={style.btn} onClick={() => handleCreateNewList()}/>
                          </div>
                        </div>
                    </div>
                </div>
            </Box>
          </Modal>
        </>
    );
}