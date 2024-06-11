import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, PlusCircle, X } from 'react-feather'
import moment from 'moment'
import TextareaAutosize from 'react-textarea-autosize'

import styles from './milestones-widget.module.scss'
import MilestoneRow from './milestone-row.component'
import { ClickAwayListener } from '@mui/material'
import { Label, MeasureTask, Option, SuggestionRequest, TaskStatus, User } from '../Types'
import { AddTaskInputProps, EngagementSuggestion } from '../Notes/types'
import { getSignedUser } from '../SigninService'
import { getOwnerName } from '../Notes/note.service'
import { DateControlNew } from '../controls'
import AddMulipleOwnersComponent from './AddMulipleOwnersComponent'
import { Keyboard } from '../Types/common'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { Trans } from 'react-i18next'

const ENTER_KEY = 'Enter'

export type MilestoneWidgetProps = {
  milestones: Array<MeasureTask>
  owners: Array<User>
  isExpandedView?: boolean
  isAddNewmilestoneOpen?: boolean
  customTags?: Array<Label>
  actionTrackerType?: string
  selectedProgramId?: string
  loadDocumentAttachment?: (docId: string) => Promise<Blob>
  gotoMeasureDetail?: (measureId: string) => void
  measureSuggestion?: (data: SuggestionRequest) => Promise<EngagementSuggestion[]>
  getUserSuggestions?: (data: SuggestionRequest) => Promise<User[]>
  onCreateNewTag?: (categoryId: string, tagString: string) => void
  onExpand?: () => void
  onNewTask?: (taskInput: AddTaskInputProps) => void
  onStatusChange?: (status: AddTaskInputProps, comment?: string, file?: File) => void
  onTaskDelete?: (task: MeasureTask) => void
  onMeasureNoteAdded?: (task: MeasureTask, note: { noteId: string, comment: string }, file: File | undefined) => void
  onMeasureNoteUpdated?: (task: MeasureTask, note: { noteId: string, comment: string }) => void
  onClosingAddNewMilestoen?: (isClosed: boolean) => void
}
interface AddTaskProps {
  isDescriptionInfocus?: boolean
  getUserSuggestions?: (data: SuggestionRequest) => Promise<User[]>
  onNewTask?: (milestoneData: AddTaskInputProps) => void | null
}

function AddTaskComponent (props: AddTaskProps) {
  const startDatePickerContainerRef = useRef<HTMLDivElement | null>(null)
  const dueDatePickerContainerRef = useRef<HTMLDivElement | null>(null)
  const dueDatePickerContainerRefOverflow = useRef<HTMLDivElement | null>(null)
  const textAreaInput = useRef<HTMLTextAreaElement | null>(null)

  const [description, setdescription] = useState<string>('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [isAddDescriptionActive, setIsAddDescriptionActive] = useState<boolean>(false)

  const [ownerList, setOwnerList] = useState<Array<Option>>([])
  const [clearSearchFilter, setClearSearchFilter] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  function clearData () {
    setdescription('')
    setStartDate(null)
    setDueDate(null)
  }

  useEffect(() => {
    if (props.isDescriptionInfocus) {
      setIsAddDescriptionActive(true)
      if (textAreaInput.current) textAreaInput.current.focus()
    }
  }, [props.isDescriptionInfocus])

  function getDateString (date: Date | null): string | null {
    let dateString = ''

    if (date) {
      dateString = moment(date).format('MMM DD, YYYY')
    }

    return dateString
  }

  function onStartDateClick (event) {
    if (event) { event.stopPropagation() }

    if (startDatePickerContainerRef.current) {
      const dateIconButton: HTMLButtonElement | null =  startDatePickerContainerRef.current.querySelector(".ant-picker-input")
      if (dateIconButton) {
        dateIconButton.click()
      }
    }
  }

  function onStartDateChange (dateString: string) {
    const _startDate = new Date(moment(dateString).toDate())
    setStartDate(_startDate)
  }

  function onDueDateChange (dateString: string) {
    const _dueDate = new Date(moment(dateString).toDate())
    setDueDate(_dueDate)
  }

  function onDueDateClick (event) {
    if (event) { event.stopPropagation() }

    if (dueDatePickerContainerRef.current) {
      const dateIconButton: HTMLButtonElement | null =  dueDatePickerContainerRef.current.querySelector(".ant-picker-input")
      if (dateIconButton) {
        dateIconButton.click()
      }
    } else if (dueDatePickerContainerRefOverflow.current) {
      const dateIconButton: HTMLButtonElement | null =  dueDatePickerContainerRefOverflow.current.querySelector(".ant-picker-input")
      if (dateIconButton) {
        dateIconButton.click()
      }
    }
  }

  // function onOwnerDropDownClick () {
  //   setShowOwnerDropdown(false)
  //   setTimeout(() => {
  //     if (ownerInputRef1.current) {
  //       ownerInputRef1.current.focus()
  //     }
  //     if (ownerInputRef2.current) {
  //       ownerInputRef2.current.focus()
  //     }

  //     setOwnerOptionsFilteredList(ownerOptions)
  //     setShowPopup(true)
  //   }, 200)
  // }

  // function onOwnerInputFocus (vt: React.FocusEvent<HTMLDivElement>) {
  //   setTimeout(() => {
  //     setOwnerOptionsFilteredList(ownerOptions)
  //     setShowPopup(true)
  //   }, 200)
  // }

  // function onOwnerInputBlur () {
  //   if (ownerInputValue.length === 0) {
  //     setShowOwnerDropdown(true)
  //   }
  // }

  // function onOwnerInputChange (evt: React.ChangeEvent<HTMLInputElement>) {
  //   const value = evt.target.value
  //   setOwnerInputValue(value)

  //   if (value) {
  //     setLoadingUsers(true)
  //     getUserSuggestions({
  //       keyword: value.trim(),
  //       boostCodes: USER_SEARCH_BOOST_CODES
  //       // filters: {
  //       //   departments: [getSignedUser().department]
  //       // }
  //     })
  //       .then(users => {
  //         setLoadingUsers(false)
  //         const userOptions: Array<Option> = users.map(user => ({
  //           id: user.userName,
  //           displayName: getUserDisplayName(user),
  //           path: user.userName,
  //           customData: user
  //         }))

  //         setOwnerOptionsFilteredList(userOptions)
  //         setShowPopup(true)
  //       })
  //       .catch(err => {
  //         setLoadingUsers(false)
  //         console.log(err)
  //       })
  //     } else {
  //       setOwnerOptionsFilteredList(ownerOptions)
  //       setShowPopup(true)
  //     }
  // }

  function onOwnerOptionSelected (ownerOption: Array<Option>) {
    const usersList: Array<Option> = ownerOption
    setClearSearchFilter(false)
    setOwnerList(usersList)
  }

  // function emptyOwnerOptionFilteredList () {
  //   if (!ownerInputValue) {
  //     setOwnerInputValue('')
  //     setShowOwnerDropdown(true)
  //   }

  //   setOwnerOptionsFilteredList([])
  //   setShowPopup(false)
  // }

  function handleAddMilestone () {
    if (props.onNewTask && description.trim().length > 0) {
      const users = ownerList.map(user => {
        return {tenantId: getSignedUser().tenantId, userName: user.customData.userName, name: getOwnerName(user.customData) }
      })
      setOwnerList([])
      setClearSearchFilter(true)
      props.onNewTask({
        name: description.trim(),
        isImportant: false,
        description: '',
        owner: null,
        taskStatus: TaskStatus.notStarted,
        dueDate: dueDate ? moment(dueDate).format('YYYY-MM-DD') : null,
        startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
        priority: null,
        users: users
      })
      clearData()
      if (textAreaInput.current) textAreaInput.current.blur()
    }
  }

  function addMilestone() { handleAddMilestone() }

  function handleStartDateKeydown(event: React.KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    event.stopPropagation()

    if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
      event.preventDefault()
      onStartDateClick(event)
    }

    if ((event.key === Keyboard.Escape) || (event.key === Keyboard.Esc)) {
      event.preventDefault()
      setIsAddDescriptionActive(false)
    }
  }

  function handleDueDateKeydown(event: React.KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    event.stopPropagation()

    if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
      event.preventDefault()
      onDueDateClick(event)
    }

    if ((event.key === Keyboard.Escape) || (event.key === Keyboard.Esc)) {
      event.preventDefault()
    }
  }

  function handleAddMilestoneKeydown(event: React.KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return false
    }

    event.stopPropagation()

    if ((event.key === Keyboard.Enter) || (event.key === Keyboard.Return)) {
      event.preventDefault()
      handleAddMilestone()
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setIsAddDescriptionActive(false)}>
      <div className={isAddDescriptionActive ? `${styles.active} ${styles.container}` : styles.container} onClick={() => { setIsAddDescriptionActive(true) }}>
        <div className={styles.milestonesWidgetBodyAddSection}>
          <div className={styles.milestonesWidgetBodyAddSectionDescription}>
            <TextareaAutosize className={`${styles.milestonesWidgetBodyAddSectionDescriptionInput} add`}
              placeholder={t('--milestone--.--describeYourMilestoneHere--')}
              ref={textAreaInput}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              onKeyDown={e => ((e.key === ENTER_KEY || e.key === 'NumpadEnter') && !e.shiftKey) && addMilestone()}
              onBlur={() => setIsAddDescriptionActive(false)}
            />
          </div>

          <div className={styles.milestonesWidgetBodyAddSectionOwner}>
            <AddMulipleOwnersComponent
              ownersList={ownerList}
              getUserSuggestions={props.getUserSuggestions}
              clearSearchInput={clearSearchFilter}
              onOwnersUpdate={onOwnerOptionSelected}
              isRowSelected={() => false}
            />
          </div>

          <div className={styles.milestonesWidgetBodyAddSectionStartDate} ref={ele => { startDatePickerContainerRef.current = ele }}>
            <div onClick={onStartDateClick} tabIndex={0} onKeyDown={handleStartDateKeydown}>
              {!startDate && <><span>{t('--milestone--.--startDate--')}</span><span><ChevronDown size={18} color='var(--warm-neutral-shade-500)' /></span></>}
              {startDate && getDateString(startDate)}
            </div>
            <div className={styles.milestonesWidgetBodyAddSectionStartDatePicker}>
              <DateControlNew config={{ optional: false }} placeholder={t('--milestone--.--dueBy--')} value={startDate} onChange={onStartDateChange} />
            </div>
          </div>

          <div className={styles.milestonesWidgetBodyAddSectionEndDate} ref={ele => { dueDatePickerContainerRef.current = ele }}>
            <div onClick={onDueDateClick} tabIndex={0} onKeyDown={handleDueDateKeydown}>
              {!dueDate && <><span>{t('--milestone--.--dueDate--')}</span><span><ChevronDown size={18} color='var(--warm-neutral-shade-500)' /></span></>}
              {dueDate && getDateString(dueDate)}
            </div>
            <div className={styles.milestonesWidgetBodyAddSectionEndDatePicker}>
              <DateControlNew config={{ optional: false }} placeholder={t('--milestone--.--dueBy--')} value={dueDate} onChange={onDueDateChange} />
            </div>
          </div>

          <div className={`${styles.milestonesWidgetBodyAddSectionStatus} ${styles.lessWidth}`}>
            <div className={description.trim() ? styles.milestonesWidgetBodyAddSectionStatusBtn : styles.unClickable} tabIndex={0} onKeyDown={handleAddMilestoneKeydown} onClick={handleAddMilestone}>
              <PlusCircle size="14" color={description.trim() ? '#135EF2' : '#BFBFBF'} />
              <span>{t('--milestone--.--add--')}</span>
            </div>
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
}
export function AddTask (props: AddTaskProps) {
  return <I18Suspense><AddTaskComponent {...props}  /></I18Suspense>
}


function MilestonesWidgetComponent (props: MilestoneWidgetProps) {
  const [milestones, setMilestones] = useState<Array<MeasureTask>>([])
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  useEffect(() => {
    setMilestones(props.milestones)
  },[props.milestones])

  function onexpandClick () {
    if (props.onExpand) {
      props.onExpand()
    }
  }

  function handleAddmilestone (milestoneData: AddTaskInputProps) {
    if (props.onNewTask) {
      props.onNewTask(milestoneData)
    }
  }

  function handelCloseNewMilestone () {
    if (props.onClosingAddNewMilestoen) {
      props.onClosingAddNewMilestoen(false)
    }
  }

  function handleOpenNewMilestone () {
    if (props.onClosingAddNewMilestoen) {
      props.onClosingAddNewMilestoen(true)
    }
  }

  return (
    <div className={styles.milestonesWidget}>
      {
        props.isAddNewmilestoneOpen &&
        <div className={styles.milestonesWidgetBody}>
          <div className={styles.milestonesWidgetBodyTop}>
            <div>{t('--milestone--.--addNewMilestone--')}</div>
            <div onClick={handelCloseNewMilestone}><X size={16} cursor='pointer' color='var(--warm-neutral-shade-300)'/></div>
          </div>
          <AddTask getUserSuggestions={props.getUserSuggestions} isDescriptionInfocus={props.isAddNewmilestoneOpen} onNewTask={handleAddmilestone}/>
        </div>
      }
      {
        milestones.length > 0 &&
        <div className={styles.milestonesWidgetContainer}>
          <div className={ milestones.length ? styles.milestonesWidgetBodyHeader : `${styles.milestonesWidgetBodyHeader} ${styles.milestonesWidgetBodyHeaderNoBordr}`}>
            <div className={styles.milestonesWidgetBodyHeaderIcon}></div>
            <div className={styles.milestonesWidgetBodyHeaderDescription}>{t('--milestone--.--description--')}</div>
            <div className={styles.milestonesWidgetBodyHeaderTags}>{t('--milestone--.--tags--')}</div>
            <div className={styles.milestonesWidgetBodyHeaderOwner}>{t('--milestone--.--owner--')}</div>
            <div className={styles.milestonesWidgetBodyHeaderStartDate}>{t('--milestone--.--startDateLabel--')}</div>
            <div className={styles.milestonesWidgetBodyHeaderEndDate}>{t('--milestone--.--endDate--')}</div>
            <div className={styles.milestonesWidgetBodyHeaderStatus}>{t('--milestone--.--status--')}</div>
          </div>
          {
            milestones.map((milestone) => {
              return (
                <div key={milestone.id} className={styles.milestonesWidgetContainerRow}>
                  <MilestoneRow
                    milestone={milestone}
                    owners={[]}
                    actionTrackerType={props.actionTrackerType}
                    getUserSuggestions={props.getUserSuggestions}
                    gotoMeasureDetail={props.gotoMeasureDetail}
                    loadDocumentAttachment={props.loadDocumentAttachment}
                    measureSuggestion={props.measureSuggestion}
                    selectedProgramId={props.selectedProgramId}
                    customTags={props.customTags}
                    onStatusChange={props.onStatusChange}
                    onCreateNewTag={props.onCreateNewTag}
                    onTaskDelete={() => props.onTaskDelete && props.onTaskDelete(milestone)}
                    onMeasureNoteAdded={(note, file) => props.onMeasureNoteAdded && props.onMeasureNoteAdded(milestone, note, file)}
                    onMeasureNoteUpdated={(note) => props.onMeasureNoteUpdated && props.onMeasureNoteUpdated(milestone, note)}
                  />
                </div>
              )
            })
          }
        </div>
      }
      {
        milestones.length === 0 &&
        <div className={styles.milestonesWidgetEmpty}>
          <div className={styles.milestonesWidgetEmptyNo}>{t('--milestone--.--noMilestoneAdded--')}</div>
          <div className={styles.milestonesWidgetEmptyWrp}>
          <Trans t={t} i18nKey="--milestone--.--newMilestoneToStart--">
            <span className={styles.milestonesWidgetEmptyWrpUse}>{'Use'}</span>
            <span className={styles.milestonesWidgetEmptyWrpMilestone}>{'+ New milestone'}</span>
            <span className={styles.milestonesWidgetEmptyWrpUse}>{'to start'}</span>
          </Trans>
          </div>
        </div>
      }
    </div>
  )
}
function MilestonesWidget (props: MilestoneWidgetProps) {
  return <I18Suspense><MilestonesWidgetComponent {...props}  /></I18Suspense>
}

export default MilestonesWidget