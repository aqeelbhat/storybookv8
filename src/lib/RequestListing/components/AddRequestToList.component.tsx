import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import React, { useEffect, useState } from "react"
import style from "./addNewList.module.scss"
import { Plus, Search, X } from "react-feather"
import { OroButton } from "../../controls"
import classNames from "classnames"
import { RequestList, SmartList } from "../types"
import { Option } from "../../Inputs"
import { ENTER_KEY_CODE } from "../../Inputs/types"


export type AddRequestToListProps = {
    requestList?: RequestList
    isOpen: boolean
    width?: number
    isEditRequest?: boolean
    searchOptions?: Array<Option>
    toggleModal?: () => void
    handleCreateNewRequestList?: () => void
    handleAddedNewRequestList?: (list: SmartList) => void
    handleUpdateList?: (id: number, list: SmartList) => void
}

export function AddRequestToList (props: AddRequestToListProps) {

    const [selectedList, setSelectedList] = useState<SmartList>()
    const [listNames, setListName] = useState<Array<SmartList>>([])
    // const [smartListOptions, setSmartListOptions] = useState<Array<Option>>([])
    const [searchString, setSearchString] = useState<string>('')

    function getSmartList (): Array<SmartList> {
      let list: Array<SmartList> = []
      if (props.requestList?.mine) {
        list = props.requestList?.mine
      }
      if (props.requestList?.sharedWithMe) {
        list = [...list, ...props.requestList.sharedWithMe]
      }
      return list
    }

    useEffect(() => {
        if (props.requestList) {
          const list = getSmartList()
          setListName(list)
        }
      }, [props.requestList])

      // useEffect(() => {
      //   if (props.searchOptions) {
      //     setSmartListOptions(props.searchOptions)
      //   }
      // }, [props.searchOptions])

    function handleSearchResult (keyword: string) {
      let searchResult = props.requestList?.mine.filter(list => list.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
      if (!searchResult) {
        searchResult = props.requestList?.sharedWithMe.filter(list => list.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
      }
      setListName(searchResult)
    }

    function handleSearchChange (result) {
      if (result.target.value) {
        setSearchString(result.target.value)
        handleSearchResult(result.target.value)
      } else {
        const list = getSmartList()
        setListName(list)
        setSearchString('')
      }
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
        padding: '24px',
        maxHeight: '400px'
      }

    function toggleModal () {
      if (props.toggleModal) {
        props.toggleModal()
      }
    }

    function handleUpdateList () {
        if (props.handleUpdateList) {
            props.handleUpdateList(selectedList.id, selectedList)
        }
    }

    function handleCreateNewList () {
      if (props.handleCreateNewRequestList) {
        props.handleCreateNewRequestList()
      }
    }

    function handleSelectList (item: SmartList) {
        setSelectedList(item)
    }

    return (
        <>
          <Modal
            open={props.isOpen}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styles}>
                <div className={style.addNewList}>
                    <div className={style.header}>
                      <span className={style.title}>{'Add to List'}</span>
                      <X size={20} color="var(--warm-neutral-shade-300)" cursor="pointer" onClick={() => toggleModal()}/>
                    </div>
                    <div className={style.body}>
                        <div className={style.formBody}>
                          <div className={style.searchContainer} id="addRequestToListSearch">
                            <Search size={16} color="var(--warm-neutral-shade-100)"/>
                            <input
                              type="text"
                              placeholder="Search By Keyword"
                              value={searchString || ''}
                              onChange={handleSearchChange}
                              onKeyDown={handleKeyDown}
                            />
                           </div>
                           <div className={style.container}>
                            {listNames && listNames.map((item, index) => {
                                return (
                                  <div className={style.row} key={`list_${index}`}>
                                    <input type="checkbox" onClick={() => handleSelectList(item)} checked={selectedList?.name === item?.name} className={classNames('oro-checkbox', style.checkboxStyle)}/>
                                    <span className={style.label}>{item.name}</span>
                                  </div>
                                )
                              })}
                            {searchString && listNames.length === 0 && <div className={style.emptySearchResult} onClick={() => handleCreateNewList()}>
                              <div className={style.info}>List not found</div>
                              <div className={style.createBtn}>
                                <Plus size={16} color="var(--warm-neutral-shade-300)"/>
                                <span className={style.title}>Create list</span>
                              </div>
                            </div>}
                           </div>
                        </div>
                        {listNames.length !== 0 && <div className={classNames(style.formFooter, style.addNewReqFooter)}>
                          <div className={style.primaryBtns}>
                            <OroButton label="Cancel" type="default" className={classNames(style.btn, style.cancelBtn)} onClick={() => toggleModal()}/>
                            <OroButton label="Save" type="primary" className={style.btn} onClick={() => handleUpdateList()}/>
                          </div>
                        </div>}
                    </div>
                </div>
            </Box>
          </Modal>
        </>
    )
}
