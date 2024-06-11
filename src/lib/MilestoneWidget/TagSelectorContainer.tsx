import React, { useEffect, useMemo, useState } from "react"
import styles from './ActionTrackerRow.module.scss'
import { PlusCircle } from "react-feather"
import { AddTaskInputProps, EngagementSuggestion, MeasureTaskType, TAGCATEGORY, Workstream } from "../Notes/types"
import { IDRef, Label, MeasureTask, SuggestionRequest, TaskStatus, UserId } from "../Types"
import { Tag, TagCategory, TagSelector } from "./tag-selector.component"
import { debounce } from "../util"

type TagSelectorContainerProps = {
    action: MeasureTask
    teams?: Array<Workstream>
    customTags?: Array<Label>
    forMilestone?: boolean
    actionTrackerType?: string
    selectedProgramId?: string
    gotoMeasureDetail?: (measureId: string) => void
    measureSuggestion?: (data: SuggestionRequest) => Promise<EngagementSuggestion[]>
    onStatusChange?: (status: AddTaskInputProps, comment?: string, file?: File) => void
    onCreateNewTag?: (categoryId: string, tagString: string) => void
}

function TagSelectorContainer (props: TagSelectorContainerProps) {
  const [allTags, setAllTags] = useState<Array<TagCategory>>([])
  const [teamTagList, setTeamTagList] = useState<Array<Workstream>>([])
  const [customTagList, setCustomTagList] = useState<Array<Label>>([])
  const [measureTagList, setMeasureTagList] = useState<Array<EngagementSuggestion>>([])
  const [measureSearchString, setMeasureSearchString] = useState<string>('')
  const [selectedTeamTagList, setSelectedTeamTagList] = useState<Array<IDRef>>([])
  const [selectedCustomTagList, setSelectedCustomTagList] = useState<Array<Label>>([])
  const [selectedMeasureTagList, setSelectedMeasureTagList] = useState<Array<IDRef>>([])
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState<boolean>(false)

  function isSelected (tags: any, selectedTags: any[], tagsField: string, selectedTagField: string): boolean {
    const isTagIsSelected = selectedTags?.find(item => item[selectedTagField] === tags[tagsField])
    return !!isTagIsSelected
  }

  useEffect(() => {
    if (props.customTags) {
      setCustomTagList(props.customTags)
    }
  }, [props.customTags])

  useEffect(() => {
    setMeasureSearchString('')
    if (props.action?.relatedMeasures) {
      setSelectedMeasureTagList(props.action.relatedMeasures)
    }
    if (props.action?.labels) {
      setSelectedCustomTagList(props.action.labels)
    }
    if (props.action?.workstreams) {
      setSelectedTeamTagList(props.action.workstreams)
    }
  }, [props.action])

  useEffect(() => {
    if (props.teams) {
      setTeamTagList(props.teams)
    }
  }, [props.teams])

  function getMeasureTagList (): Array<Tag> {
    let tags: Array<Tag> = []
    if (measureSearchString) {
      tags =  measureTagList.map((item: EngagementSuggestion) => ({
        id: item.id,
        label: `${item.engagementId}: ${item.activityName}`,
        isSelected: isSelected(item, props.action.relatedMeasures, 'id', 'id'),
        data: item
      }))
    } else {
      tags = props.action.relatedMeasures.map((item: IDRef) => ({
        id: item.id,
        label: `${item.refId}: ${item.name}`,
        isSelected: true,
        data: item
      }))
    }
    
    return tags
  }

  const teamTagConfig = {
    id: TAGCATEGORY.teams,
    label: 'Teams',
    tags: teamTagList.map(item => {
      return {
        id: item.code,
        label: item.name,
        isSelected: isSelected(item, props.action.workstreams, 'code', 'id'),
        data: item
      }
    }),
  }

  const measureTagConfig = {
    id: TAGCATEGORY.measures,
    label: 'Measures',
    tags: getMeasureTagList(),
  }

  const customTagConfig = {
    id: TAGCATEGORY.customTag,
    label: 'Custom tags',
    tags: customTagList.map(item => {
    return {
      id: item.id,
      label: item.text,
      isSelected: isSelected(item, props.action.labels, 'id', 'id'),
      data: item
      }
    }),
    hasCreateNewTagOption: true
  }

  useEffect(() => {
    if (props.action) {
      setMeasureSearchString('')
      if (props.actionTrackerType === 'master') {
        setAllTags([teamTagConfig, measureTagConfig, customTagConfig])
      } else if (props.forMilestone) {
        setAllTags([customTagConfig])
      } else {
        setAllTags([measureTagConfig, customTagConfig])
      }

    }
  }, [customTagList, teamTagList, measureTagList, props.action])

  function getTagsCountDom (): React.ReactElement {
    let totalCount = 0
    if (props.action.labels.length > 0) {
      totalCount += props.action.labels.length - 1
    }
    if (props.action.relatedMeasures.length > 0) {
      totalCount += props.action.relatedMeasures.length - 1
    }
    if (props.action.workstreams.length > 0) {
      totalCount += props.action.workstreams.length - 1
    }
    return totalCount ? <span className={styles.atrTagsCount}>+{totalCount}</span> : <></>
  }

  function getMeasuresDisplayName (relatedMeasures: Array<IDRef>): string {
    // we need to show only one id in UI rest will be in popup that index 0
    // add we have checked the length in dom before call this function
    const {refId, name} = relatedMeasures[0]
    if (refId && name.startsWith(refId)) {
      return name
    } else {
        if (refId) {
          return `${refId}: ${name}`
        } else {
          return name
        }
    }
  }

  function getUpdatedRelatedMeasures (categoryId: string, tag: Tag): Array<IDRef> {
    const _relatedMeasures = selectedMeasureTagList.map(relatedMeasureElem => relatedMeasureElem)

    if (categoryId === TAGCATEGORY.measures && tag.isSelected) {
      _relatedMeasures.push({
        id: tag.id,
        name: tag.data?.name || tag.data?.activityName || tag.label,
        erpId: tag.data?.programRef?.erpId || tag.data?.erpId,
        refId: tag.data?.refId || tag.data?.engagementId
      })
    }

    if (categoryId === TAGCATEGORY.measures && !tag.isSelected) {
      const relatedMeasureIndex = _relatedMeasures.findIndex(relatedMeasureElem => relatedMeasureElem.id === tag.id)
      if (relatedMeasureIndex !== -1) {
        _relatedMeasures.splice(relatedMeasureIndex, 1)
      }
    }
    setSelectedMeasureTagList(_relatedMeasures)
    return _relatedMeasures
  }

  function getUpdatedWorkstreams (categoryId: string, tag: Tag): Array<IDRef> {
    const _workstreams = selectedTeamTagList.map(workstreamElem => workstreamElem)

    if (categoryId === TAGCATEGORY.teams && tag.isSelected) {
      _workstreams.push({
        id: tag.id,
        name: tag.label,
        erpId: '',
        refId: ''
      })
    }

    if (categoryId === TAGCATEGORY.teams && !tag.isSelected) {
      const workstreamIndex = _workstreams.findIndex(workstreamElem => workstreamElem.id === tag.id)
      if (workstreamIndex !== -1) {
        _workstreams.splice(workstreamIndex, 1)
      }
    }
    setSelectedTeamTagList(_workstreams)
    return _workstreams
  }

  function getUpdatedLabels (categoryId: string, tag: Tag): Array<Label> {
    const _labels = selectedCustomTagList.map(labelElem => labelElem)

    if (categoryId === TAGCATEGORY.customTag && tag.isSelected) {
      _labels.push({ id: tag.id, text: tag.label })
    }

    if (categoryId === TAGCATEGORY.customTag && !tag.isSelected) {
      const labelIndex = _labels.findIndex(labelElem => labelElem.id === tag.id)
      if (labelIndex !== -1) {
        _labels.splice(labelIndex, 1)
      }
    }
    setSelectedCustomTagList(_labels)
    return _labels
  }

  // const debouncedOnTagClick = useMemo(() => debounce(props.onStatusChange, 1000), [props.customTags, props.teams, measureTagList, props.action])

  function onSearchCustomTags (searchText: string) {
    if (props.customTags) {
      const filteredResult = props.customTags?.filter((data) => {
        return data.text.toLowerCase().trim().indexOf(searchText.toLowerCase().trim()) !== -1
      })
      setCustomTagList(filteredResult)
    }
  }

  function onSearchTeamTags (searchText: string) {
    if (props.teams) {
      const filteredResult = props.teams?.filter((data) => {
        return data.name.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1
      })
      setTeamTagList(filteredResult)
    }
  }

  function onSearchMeasureTags (searchText: string) {
    setMeasureSearchString(searchText)
    if (props.measureSuggestion) {
      props.measureSuggestion({ keyword: searchText.trim(), programCode: props.selectedProgramId || undefined })
        .then((engagementSuggestion: Array<EngagementSuggestion>) => {
          setMeasureTagList(engagementSuggestion)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  function onTagSearch (categoryId: string, searchText: string) {
    if (categoryId === TAGCATEGORY.customTag) {
      onSearchCustomTags(searchText)
    }

    if (categoryId === TAGCATEGORY.teams) {
      onSearchTeamTags(searchText)
    }

    if (categoryId === TAGCATEGORY.measures && searchText) {
      onSearchMeasureTags(searchText)
    }
  }

  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedOnTagSearch = useMemo(() => debounce(onTagSearch),  [props.customTags, props.teams])

  function gotoMeasureDetail (event, relatedMeasures: Array<IDRef>) {
    if (relatedMeasures && relatedMeasures.length > 0 && relatedMeasures[0].id && props.gotoMeasureDetail) {
      event.stopPropagation()
      event.preventDefault()
      props.gotoMeasureDetail(relatedMeasures[0].id)
    }
  }

  function getTagSelectorElement (): React.ReactElement {
    return (
      <div className={`${styles.atrTags} ${isTagSelectorOpen ? styles.atrTagsSelected : ''}`}>
        {props.action?.workstreams?.length > 0 && <div className={styles.atrTagsItem}>
          <div className={styles.atrTagsTeam}>{props.action.workstreams[0].name}</div>
          {props.action?.relatedMeasures?.length === 0 && props.action?.labels?.length === 0 && getTagsCountDom()}
        </div>}
        {props.action?.relatedMeasures?.length > 0 && <div className={styles.atrTagsItem}>
          <div className={styles.atrTagsMeasure} onClick={(e) => gotoMeasureDetail(e, props.action.relatedMeasures)} title={getMeasuresDisplayName(props.action.relatedMeasures)}>{getMeasuresDisplayName(props.action.relatedMeasures)}</div>
          {props.action?.labels?.length === 0 && getTagsCountDom()}
        </div>}
        {props.action?.labels?.length > 0 && <div className={styles.atrTagsItem}>
          <div className={styles.atrTagsCustom}>{props.action.labels[0].text}</div>
          {getTagsCountDom()}
        </div>}
        {
          props.action?.labels?.length === 0 && props.action?.workstreams?.length === 0 && props.action?.relatedMeasures?.length === 0 &&
          <span className={styles.atrTagsDefaultText}><PlusCircle color='var(--warm-neutral-shade-200)' size={14}></PlusCircle> Add tags</span>
        }
      </div>
    )
  }

  function onTagClick (categoryId: string, tag: Tag) {
    if (props.action && props.onStatusChange && typeof props.onStatusChange === 'function') {
        const usersList = props.action.users.map(user => {
          return {tenantId: user.tenantId, userName: user.userName, name: user.name }
        })
        const userId: UserId | null = props.action.owner

        const taskInputProps: AddTaskInputProps = {
          name: props.action.name,
          owner: userId ? { userName: userId ? userId.userName : '', name: userId ? userId.name : '' } : null,
          description: props.action.description,
          taskStatus: props.action.taskStatus as TaskStatus,
          dueDate: props.action.dueDate ? props.action.dueDate : '',
          startDate: props.action.startDate ? props.action.startDate : '',
          task: props.action,
          priority: props.action.priority,
          actionType: props.action.actionType as MeasureTaskType,
          relatedMeasure: props.action.relatedMeasure,
          relatedMeasures: getUpdatedRelatedMeasures(categoryId, tag),
          workstreams: getUpdatedWorkstreams(categoryId, tag),
          labels: getUpdatedLabels(categoryId, tag),
          users: usersList
        }

        props.onStatusChange(taskInputProps)
    }
  }

  return(
    <>
      <TagSelector
        onToggleElementClick={setIsTagSelectorOpen}
        dropDownClassName={styles.atrIDDropDown}
        dropDownToggleClassName={styles.atrIDDropDownToggle}
        toggleElement={getTagSelectorElement()}
        tagCategories={allTags}
        onTagClick={onTagClick}
        onTagSearch={debouncedOnTagSearch}
        onCreateNewTag={props.onCreateNewTag}
      />
    </>
  )
}

export default TagSelectorContainer