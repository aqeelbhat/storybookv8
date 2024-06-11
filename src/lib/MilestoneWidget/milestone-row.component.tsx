import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, MessageCircle, Edit2, ChevronRight, X, Plus, Star} from 'react-feather'
import moment from 'moment'
import classNames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'
import { Tooltip } from '@mui/material'
import styles from './milestones-widget.module.scss'
import { Label, MeasureTask, Option, SuggestionRequest, TaskStatus, User, UserId } from '../Types'
import { AddTaskInputProps, EngagementSuggestion } from '../Notes/types'
import { mapUserIdToOption } from '../Form/util'
import { getSignedUser } from '../SigninService'
import { getOwnerName, isMeasureTaskStatusCompleted } from '../Notes/note.service'
import AddMulipleOwnersComponent from './AddMulipleOwnersComponent'
import { DateControlNew } from '../controls'
import { CommentList } from '../Comment-listing'
import { ConfirmationDialog } from '../Modals'
import TagSelectorContainer from './TagSelectorContainer'
import { CommentPopup, MenuAction, MenuOption } from './components/menu/menu-action'
import { DropdownComponent, DropdownOption } from './components/Dropdown/dropdown.component'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';


const ENTER_KEY = 'Enter'

type MileStoenRowProps = {
  milestone: MeasureTask
  owners: Array<UserId>
  customTags?: Array<Label>
  actionTrackerType?: string
  selectedProgramId?: string
  gotoMeasureDetail?: (measureId: string) => void
  measureSuggestion?: (data: SuggestionRequest) => Promise<EngagementSuggestion[]>
  onNewTask?: (milestoneData: AddTaskInputProps) => void
  getUserSuggestions?: (data: SuggestionRequest) => Promise<User[]>
  onTaskDelete?: () => void
  loadDocumentAttachment?: (docId: string) => Promise<Blob>
  onStatusChange?: (status: AddTaskInputProps, comment?: string, file?: File) => void
  onCreateNewTag?: (categoryId: string, tagString: string) => void
  onMeasureNoteAdded?: (note: { noteId: string, comment: string }, file: File | undefined) => void
  onMeasureNoteUpdated?: (note: { noteId: string, comment: string }) => void
}

function MilestoneRowComponent (props: MileStoenRowProps) {
  const startDatePickerContainerRef = useRef<HTMLDivElement | null>(null)
  const dueDatePickerContainerRef = useRef<HTMLDivElement | null>(null)
  const dueDatePickerContainerRefOverflow = useRef<HTMLDivElement | null>(null)

  const [description, setdescription] = useState<string>('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [overdue, setOverdue] = useState(false)
  const [isImportant, setIsImportant] = useState(false)

  const [ownerSelectedList, setOwnerSelectedList] = useState<Array<Option>>([])

  const [showComments, setShowComments] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [selectedOption, setselectedOption] = useState<MenuOption | null>()
  const [showDialogue, setShowDialogue] = useState(false)

  const [updatingOwner, setUpdatingOwner] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  const MILESTOEN_ROW_DROPDOWN_OPTIONS: Array<DropdownOption> = [
    { id: 'delete', label: t('--milestone--.--deleteMilestone--')}
  ]
  const measureTaskStatusOptions: Array<MenuOption> = [
    { id: 'milestoneStatus', label: t('--milestone--.--milestoneStatus--'), disabled: true},
    { id: TaskStatus.pending, label: t('--measureNames--.--onTarget--') },
    { id: TaskStatus.notStarted, label: t('--measureNames--.--notStarted--') },
    { id: TaskStatus.late, label: t('--measureNames--.--offTargetNotCritical--') },
    { id: TaskStatus.stuck, label: t('--measureNames--.--offTargetSupportNeeded--') },
    { id: TaskStatus.done, label: t('--measureNames--.--completed--') }
  ]

  function getMeasureTaskStatus (id:string):string | React.ReactElement{
    const updateStatus = measureTaskStatusOptions.find(option => option.id === id)
    return updateStatus?.label || id
  }

  useEffect(() => {
    setdescription(props.milestone.name)

    if (props.milestone.startDate) {
      const _startDate = new Date(moment(props.milestone.startDate).toDate())
      setStartDate(_startDate)
    } else {
      setStartDate(null)
    }

    if (props.milestone.dueDate) {
      const _dueDate = new Date(moment(props.milestone.dueDate).toDate())
      setDueDate(_dueDate)
    } else {
      setDueDate(null)
    }

    if (props.milestone.users && props.milestone.users?.length !== 0) {
      setOwnerSelectedList(props.milestone.users.map(mapUserIdToOption))
    } else {
      setOwnerSelectedList([])
    }
  }, [props.milestone])

  useEffect(() => {
    if (dueDate) {
      const today = new Date()
      const diff = today.getTime() - dueDate.getTime()
      if ( diff > 0) {
        setOverdue(true)
      } else {
        setOverdue(false)
      }
    }
  }, [dueDate])

  // useEffect(() => {
  //   if (props.owners && Array.isArray(props.owners)) {
  //     const ownerOptions: Array<Option> = props.owners.map(user => ({
  //       id: getOwnerName(user),
  //       displayName: getOwnerName(user),
  //       path: getOwnerName(user),
  //       customData: user
  //     }))

  //     setOwnerOptions(ownerOptions)
  //   }
  // }, [props.owners])

  function onDescriptionChange () {
    setDescriptionEditMode(false)
    if (props.onStatusChange && typeof props.onStatusChange === 'function' && props.milestone.name !== description && description.trim().length > 0) {
      if (description && props.milestone) {
        const usersList = props.milestone.users.map(user => {
          return {tenantId: user.tenantId, userName: user.userName, name: user.name }
        })
        const userId: UserId | null = props.milestone.owner
        const taskInputProps: AddTaskInputProps = {
          name: description.trim(),
          isImportant: props.milestone.isImportant,
          owner: { userName: userId ? userId.userName : '', name: userId ? userId.name : '' },
          description: props.milestone.description,
          taskStatus: props.milestone.taskStatus as TaskStatus,
          dueDate: props.milestone.dueDate ? props.milestone.dueDate : '',
          startDate: props.milestone.startDate ? props.milestone.startDate : '',
          task: props.milestone,
          priority: props.milestone.priority,
          users: usersList,
          labels: props.milestone.labels,
          relatedMeasures: props.milestone.relatedMeasures,
          workstreams: props.milestone.workstreams
        }
        props.onStatusChange(taskInputProps)
      }
    }
  }

  function getDateString (date: Date | null): string | null {
    let dateString = ''

    if (date) {
      dateString = moment(date).format('MMM DD, YYYY')
    }

    return dateString
  }

  function onStartDateClick (evt: React.MouseEvent<HTMLDivElement>) {
    if (startDatePickerContainerRef.current) {
      const dateIconButton: HTMLButtonElement | null =  startDatePickerContainerRef.current.querySelector(".ant-picker-input")
      if (dateIconButton) {
        dateIconButton.click()
      }
    }
  }

  function onStartDateChange (dateString: string) {
    const _startDate = moment(dateString).format('YYYY-MM-DD')
    if (props.onStatusChange && typeof props.onStatusChange === 'function') {
      if (dateString && props.milestone) {
        const usersList = props.milestone.users.map(user => {
          return {tenantId: user.tenantId, userName: user.userName, name: user.name }
        })
        const userId: UserId | null = props.milestone.owner
        const taskInputProps: AddTaskInputProps = {
          name: props.milestone.name,
          isImportant: props.milestone.isImportant,
          owner: { userName: userId ? userId.userName : '', name: userId ? userId.name : '' },
          description: props.milestone.description,
          taskStatus: props.milestone.taskStatus as TaskStatus,
          dueDate: props.milestone.dueDate ? props.milestone.dueDate : '',
          startDate: _startDate,
          task: props.milestone,
          priority: props.milestone.priority,
          users: usersList,
          labels: props.milestone.labels,
          relatedMeasures: props.milestone.relatedMeasures,
          workstreams: props.milestone.workstreams
        }
        props.onStatusChange(taskInputProps)
      }
    }
  }

  function onDueDateClick (evt: React.MouseEvent<HTMLDivElement>) {
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

  function onDueDateChange (dateString: string) {
    const _dueDate = moment(dateString).format('YYYY-MM-DD')
    if (props.onStatusChange && typeof props.onStatusChange === 'function') {
      if (dateString && props.milestone) {
        const usersList = props.milestone.users.map(user => {
          return {tenantId: user.tenantId, userName: user.userName, name: user.name }
        })
        const userId: UserId | null = props.milestone.owner
        const taskInputProps: AddTaskInputProps = {
          name: props.milestone.name,
          isImportant: props.milestone.isImportant,
          owner: { userName: userId ? userId.userName : '', name: userId ? userId.name : '' },
          description: props.milestone.description,
          taskStatus: props.milestone.taskStatus as TaskStatus,
          dueDate: _dueDate,
          startDate: props.milestone.startDate ? props.milestone.startDate : '',
          task: props.milestone,
          priority: props.milestone.priority,
          users: usersList,
          labels: props.milestone.labels,
          relatedMeasures: props.milestone.relatedMeasures,
          workstreams: props.milestone.workstreams
        }
        props.onStatusChange(taskInputProps)
      }
    }
  }

  function onOwnerOptionChange (value: Array<Option>) {
    if (props.milestone && props.onStatusChange && typeof props.onStatusChange === 'function') {
      const users = value.map(user => {
        return {tenantId: getSignedUser().tenantId, userName: user.customData.userName, name: getOwnerName(user.customData) }
      })
      const owner = value.length > 0 ? value[0].customData as UserId : null
        const taskInputProps: AddTaskInputProps = {
          name: props.milestone.name,
          isImportant: props.milestone.isImportant,
          owner: owner ? {userName: owner?.userName, name: getOwnerName(owner) } :  null,
          description: props.milestone.description,
          taskStatus: props.milestone.taskStatus as TaskStatus,
          dueDate: props.milestone.dueDate ? props.milestone.dueDate : '',
          startDate: props.milestone.startDate ? props.milestone.startDate : '',
          task: props.milestone,
          priority: props.milestone.priority,
          users: users,
          labels: props.milestone.labels,
          relatedMeasures: props.milestone.relatedMeasures,
          workstreams: props.milestone.workstreams
        }
        props.onStatusChange(taskInputProps)
    }
  }

  // function handleOwnerInputChange () {
  //   if (props.milestone && props.onStatusChange && typeof props.onStatusChange === 'function') {
  //       const taskInputProps: AddTaskInputProps = {
  //         name: props.milestone.name,
  //         owner: {userName: '', name: ownerInputValue},
  //         description: props.milestone.description,
  //         taskStatus: props.milestone.taskStatus as MeasureTaskTypeEnum,
  //         dueDate: props.milestone.dueDate ? props.milestone.dueDate : '',
  //         startDate: props.milestone.startDate ? props.milestone.startDate : '',
  //         task: props.milestone,
  //         priority: props.milestone.priority
  //       }
  //       props.onStatusChange(taskInputProps)
  //   }
  // }

  // function onOwnerOptionSelected (ownerOption: Option) {
  //   onOwnerOptionChange(ownerOption)
  //   setOwnerInputValue(ownerOption.displayName)
  //   setOwnerOptionsFilteredList([])
  //   setShowPopup(false)
  // }


  function getStatusBoxClass (status: string): string {
    switch (status) {
      case TaskStatus.notStarted: {
        return styles.milestonesWidgetBodyAddSectionStatusCommentBoxNotStarted
      }

      case TaskStatus.pending:
      case TaskStatus.inProgress:
      case TaskStatus.inreview: {
        return styles.milestonesWidgetBodyAddSectionStatusCommentBoxOnTarget
      }

      case TaskStatus.approved:
      case TaskStatus.done: {
        return styles.milestonesWidgetBodyAddSectionStatusCommentBoxCompleted
      }

      case TaskStatus.rejected:
      case TaskStatus.stuck: {
        return styles.milestonesWidgetBodyAddSectionStatusCommentBoxOffTarget
      }

      case TaskStatus.late: {
        return styles.milestonesWidgetBodyAddSectionStatusCommentBoxLate
      }
    }

    return styles.milestonesWidgetBodyAddSectionStatusCommentBox
  }

  function getArrowColor (status: string): string {
    switch (status) {
      case TaskStatus.notStarted: {
        return 'var(--coco-chalk)'
      }
      case TaskStatus.done: {
        return 'var(--coco-shade-400)'
      }
      case TaskStatus.stuck: {
        return 'var(--coco-chilli-burnt)'
      }
      case TaskStatus.pending: {
        return 'var(--coco-berry-burnt)'
      }
      case TaskStatus.late: {
        return 'var(--coco-honey-burnt)'
      }
      default: {
        return 'var(--coco-dark)'
      }
    }
  }

  function onStatusChange(comment: string, attachment?: File) {
    setShowComment(false)
    if (props.onStatusChange && typeof props.onStatusChange === 'function') {
      if (selectedOption && props.milestone) {
        const usersList = props.milestone.users.map(user => {
          return {tenantId: user.tenantId, userName: user.userName, name: user.name }
        })
        const userId: UserId | null = props.milestone.owner
        const taskInputProps: AddTaskInputProps = {
          name: props.milestone.name,
          isImportant: props.milestone.isImportant,
          owner: { userName: userId ? userId.userName : '', name: userId ? userId.name : '' },
          description: props.milestone.description,
          taskStatus: selectedOption.id as TaskStatus,
          dueDate: props.milestone.dueDate ? props.milestone.dueDate : '',
          startDate: props.milestone.startDate ? props.milestone.startDate : '',
          task: props.milestone,
          priority: props.milestone.priority,
          users: usersList,
          labels: props.milestone.labels,
          relatedMeasures: props.milestone.relatedMeasures,
          workstreams: props.milestone.workstreams
        }
        props.onStatusChange(taskInputProps, comment, attachment ? attachment : undefined)
      }
    }
  }

  function onShowComments () {
    setShowComments(!showComments)
  }

  function handleMenuClick(option: DropdownOption) {
    switch(option.id) {
      case 'delete': {
          setShowDialogue(true)
         break;
      }
    }
  }

  function handleDeleteMilestone () {
    if (props.onTaskDelete && typeof props.onTaskDelete === 'function') {
      props.onTaskDelete()
    }
    setShowDialogue(false)
  }

  function handleOnPreview (docId: string): Promise<Blob> {
    if (props.loadDocumentAttachment && typeof props.loadDocumentAttachment === 'function') {
      return props.loadDocumentAttachment(docId)
    }
    return Promise.reject(docId)
  }

  function getCommentLabel (): string {
    if (selectedOption) {
      return `Change status to ${selectedOption.label}`
    } else {
      return ''
    }
  }

  function handleOptionClick (option: MenuOption) {
    setselectedOption(option)
    setShowComment(true)
  }

  function handleStarClick (e) {
    setIsImportant(!isImportant)
    if (props.milestone) {
    const usersList = props.milestone.users.map(user => {
      return {tenantId: user.tenantId, userName: user.userName, name: user.name }
    })
    const userId: UserId | null = props.milestone.owner
      if (props.onStatusChange && typeof props.onStatusChange === 'function') {
      const taskInputProps: AddTaskInputProps = {
      name: description.trim(),
      isImportant: !isImportant,
      owner: { userName: userId ? userId.userName : '', name: userId ? userId.name : '' },
      description: props.milestone.description,
      taskStatus: props.milestone.taskStatus as TaskStatus,
      dueDate: props.milestone.dueDate ? props.milestone.dueDate : '',
      startDate: props.milestone.startDate ? props.milestone.startDate : '',
      task: props.milestone,
      priority: props.milestone.priority,
      users: usersList,
      labels: props.milestone.labels,
      relatedMeasures: props.milestone.relatedMeasures,
      workstreams: props.milestone.workstreams
    }
      props.onStatusChange(taskInputProps)
    }}
  }

  return (
    <div>
      <div className={styles.milestonesWidgetBodyAddSection}>
        <div className={styles.milestonesWidgetBodyAddSectionIcons}>
          <div className={styles.milestonesWidgetBodyAddSectionIconsValue} onClick={handleStarClick}><Tooltip title={props.milestone.isImportant ? t('--milestone--.--removeAsHighPriority--') : t('--milestone--.--markAsHighPriority--')}><span><Star size={18} style={props.milestone.isImportant ? { fill: 'var(--dark-yellow-font-color)', color:'var(--dark-yellow-font-color)'} : { fill: 'var(--coco-chalk)', color:'var(--dark-light-gray-font-color)'}} className={styles.starIcon}/></span></Tooltip></div>
        </div>
        <div className={classNames(styles.milestonesWidgetBodyAddSectionDescription, styles.noBorder)}>
          {
            descriptionEditMode
            ? <TextareaAutosize className={styles.milestonesWidgetBodyAddSectionDescriptionInput}
                placeholder={t('--milestone--.--describeYourMilestoneHere--')}
                value={description}
                autoFocus
                onFocus={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  e.target.value = val
                }}
                onChange={(e) => setdescription(e.target.value)}
                onBlur={onDescriptionChange}
                onKeyDown={(e) => { ((e.key === ENTER_KEY || e.key === 'NumpadEnter') && !e.shiftKey) && onDescriptionChange() }}
              />
            : <div className={styles.milestonesWidgetBodyAddSectionDescriptionValue} onClick={() => setDescriptionEditMode(true)}>
              {description} <span><Edit2 size={16} color='var(--warm-neutral-shade-400)' className={styles.editIcon}/></span>
              </div>
          }
        </div>

        <div className={classNames(`${styles.milestonesWidgetBodyAddSectionTags}`)}>
          <TagSelectorContainer
            action= {props.milestone}
            actionTrackerType={props.actionTrackerType}
            gotoMeasureDetail={props.gotoMeasureDetail}
            measureSuggestion={props.measureSuggestion}
            selectedProgramId={props.selectedProgramId}
            forMilestone
            customTags={props.customTags}
            onCreateNewTag= {props.onCreateNewTag}
            onStatusChange= {props.onStatusChange}
          />
        </div>

        <div className={classNames(`${styles.milestonesWidgetBodyAddSectionOwner} ${updatingOwner ? styles.Selected : ''}`)}>
          <AddMulipleOwnersComponent
          ownersList={ownerSelectedList}
          getUserSuggestions={props.getUserSuggestions}
          label={t('--milestone--.--addOwner--')}
          isRowSelected={setUpdatingOwner}
          onOwnersUpdate={onOwnerOptionChange}
          />
        </div>

        <div className={classNames(styles.milestonesWidgetBodyAddSectionStartDate, styles.noBorder)} ref={ele => { startDatePickerContainerRef.current = ele }}>
          <div onClick={onStartDateClick} >
            { !startDate && <><span>{t('--milestone--.--startDate--')}</span><span><ChevronDown size={18} color='var(--warm-neutral-shade-500)' /></span></> }
            { startDate && getDateString(startDate) }
          </div>
          <div className={styles.milestonesWidgetBodyAddSectionStartDatePicker}>
            <DateControlNew config={{optional: false}} placeholder={t('--milestone--.--dueBy--')} value={startDate} onChange={onStartDateChange}/>
          </div>
        </div>

        <div className={classNames(styles.milestonesWidgetBodyAddSectionEndDate, styles.noBorder)} ref={ele => { dueDatePickerContainerRef.current = ele }}>
          <div onClick={onDueDateClick} >
            { !dueDate && <><span>{t('--milestone--.--dueDate--')} </span><span><ChevronDown size={18} color='var(--warm-neutral-shade-500)' /></span></> }
            { dueDate && <span className={(overdue && !isMeasureTaskStatusCompleted(props.milestone.taskStatus)) ? styles.milestonesWidgetBodyAddSectionEndDateOverdue : ''}>{(overdue && !isMeasureTaskStatusCompleted(props.milestone.taskStatus)) ? <Tooltip title={t('--milestone--.--overdue--')}><span>{getDateString(dueDate)}</span></Tooltip> : getDateString(dueDate)}</span> }
          </div>
          <div className={styles.milestonesWidgetBodyAddSectionEndDatePicker}>
            <DateControlNew config={{optional: false}} placeholder={t('--milestone--.--dueBy--')} value={dueDate} onChange={onDueDateChange}/>
          </div>
        </div>

        <div className={styles.milestonesWidgetBodyAddSectionStatus}>
          <div className={styles.milestonesWidgetBodyAddSectionStatusComment}>
            <MenuAction
              status={props.milestone.taskStatus as TaskStatus}
              options={measureTaskStatusOptions}
              toggleElement={
                <div className={`${styles.milestonesWidgetBodyAddSectionStatusCommentBox} ${getStatusBoxClass(props.milestone.taskStatus)}`}>
                  { getMeasureTaskStatus(props.milestone.taskStatus) } <ChevronRight size={14} color={getArrowColor(props.milestone.taskStatus)}/>
                </div>
              }
              onOptionClick={handleOptionClick}
            />
            <div className={styles.milestonesWidgetBodyAddSectionStatusCommentContainer}><CommentPopup isOpen={showComment} label={getCommentLabel()} allowAttachment={true} toggle={() => setShowComment(false)} onSubmit={onStatusChange} /></div>
            <div className={styles.milestonesWidgetBodyAddSectionStatusCommentCount} onClick={onShowComments}>
              <MessageCircle strokeWidth={1.3} color={showComments ? 'var(--warm-stat-berry-mid)' : 'var(--warm-neutral-shade-400)'} size={24}/>
              <span className={showComments ? styles.milestonesWidgetBodyAddSectionStatusCommentCountClicked : styles.milestonesWidgetBodyAddSectionStatusCommentCountUnclicked }>
                { props.milestone.notes.length ? props.milestone.notes.length : <Plus size={12} color={showComments ? 'var(--warm-stat-berry-mid)' : 'var(--warm-neutral-shade-400)'}/> }
              </span>
            </div>
            <div><DropdownComponent options={MILESTOEN_ROW_DROPDOWN_OPTIONS} onOptionClick={handleMenuClick}/></div>
          </div>
        </div>
      </div>
      {
        showComments &&
        <div className={styles.containerComments}>
          <div className={`${styles.containerCommentsHeader} ${props.milestone.notes?.length > 0 ? '' : styles.containerCommentsHeaderEmpty}`}>
            <div className={styles.containerCommentsHeaderLabel}>{t('--milestone--.--comments--')}</div>
            <X size={24} color="var(--warm-neutral-shade-400)" className={styles.containerCommentsHeaderClose} onClick={() => setShowComments(false)}></X>
          </div>
          <CommentList
            comments={props.milestone.notes}
            showLatest={false}
            onAddComment={(note, file) => { props.onMeasureNoteAdded && props.onMeasureNoteAdded(note, file ? file : undefined)}}
            onUpdateComment={props.onMeasureNoteUpdated}
            onPreview={handleOnPreview}
          />
        </div>
      }
      {
        <ConfirmationDialog
          actionType="danger"
          title={t('--milestone--.--deleteMilestone--')}
          description={t('--milestone--.--deleteMilestoneConfirmation--')}
          primaryButton={<span style={{color:"var(--warm-prime-chalk)"}}>{t('--milestone--.--delete--')}</span>}
          isOpen={showDialogue}
          width = {460}
          theme="coco"
          toggleModal={() => setShowDialogue(!showDialogue)}
          onPrimaryButtonClick={handleDeleteMilestone}
          onSecondaryButtonClick={() => setShowDialogue(!showDialogue)}
        />
      }
    </div>
  )
}
function MilestoneRow (props: MileStoenRowProps) {
  return <I18Suspense><MilestoneRowComponent {...props}  /></I18Suspense>
}

export default MilestoneRow