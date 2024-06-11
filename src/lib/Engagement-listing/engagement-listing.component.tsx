/**
 * @deprecated Use {@link SupplierEngagementListing} instead.
 */

import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'underscore'

import style from './engagement-listing.module.scss'

import { TaskBar } from './task-bar.component'
import { Engagement } from '..'
import { EngagementStatus } from '../Types'
import { isTaskAssignedToCurrentUser } from './service'
import { HeaderBar } from './header-bar.component'

/**
 * @deprecated Use {@link SupplierEngagementListing} instead.
 */
export interface EngagementComponentProps {
  data: Array<Engagement>
  readMode?: boolean
  onApprove?: (engagementId: string, taskId: string, actionMessage: string) => void
  onStartTask?: (engagementId: string, taskId: string) => void
  onTaskContinue?: (engagementId: string, taskId: string) => void
  onTaskViewDetails?: (engagementId: string, taskId: string) => void
  onContinuePressed?: (engagement: Engagement) => void
  onBarPressed?: (engagement: Engagement) => void
  onDelete?: (engagementId: string) => void
}

/**
 * @deprecated Use {@link SupplierEngagementListing} instead.
 */
export interface EngagementListItemtProps {
  engagement: Engagement
  scrollTime: number
  isAlwaysInViewport?: boolean
  readMode?: boolean
  onApprove?: (engagementId: string, taskId: string, actionMessage: string) => void
  onStartTask?: (engagementId: string, taskId: string) => void
  onTaskContinue?: (engagementId: string, taskId: string) => void
  onTaskViewDetails?: (engagementId: string, taskId: string) => void
  onContinuePressed?: (engagement: Engagement) => void
  onBarPressed?: (engagement: Engagement) => void
  onDelete?: (engagementId: string) => void
}

const isInViewport = (elem: any, boundMargin = 0) => {
  const bounding = elem.getBoundingClientRect()

  return (bounding.top + boundMargin >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom - boundMargin <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth))
}

const VIEWPORT_BOUND_MARGIN = 600

/**
 * @deprecated Use {@link SupplierEngagementListing} instead.
 */

function EngagementListItem (props: EngagementListItemtProps) {
  const listItemRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [isItemInViewport, setIsItemInViewport] = useState(false || props.isAlwaysInViewport)

  function setComponentViewport () {
    if (!isItemInViewport && isInViewport(listItemRef.current, VIEWPORT_BOUND_MARGIN)) {
      setIsItemInViewport(true)
    }
  }

  useEffect(() => {
    setComponentViewport()
  }, [])

  useEffect(() => {
    setComponentViewport()
  }, [props.scrollTime])

  function getClassNameWithTaskbar (): string {
    if (isTaskAssignedToCurrentUser(props.engagement.pendingTasks)) {
      return style.shimmerPlaceholderWithActionbarAndButton
    } else {
      return style.shimmerPlaceholderWithActionbar
    }
  }

  return <div ref={listItemRef}>
    { !isItemInViewport && <div
      className={`
        ${style.shimmerPlaceholder} 
        ${props.engagement.status !== EngagementStatus.Draft ? getClassNameWithTaskbar() : style.shimmerPlaceholderHeaderOnly}
      `}>
      </div> }
    { isItemInViewport && <>
      <HeaderBar data={props.engagement} readMode={props.readMode} onBarPressed={props.onBarPressed} onContinuePressed={props.onContinuePressed} onDelete={props.onDelete}/>
      { props.engagement.status !== EngagementStatus.Draft &&
        <TaskBar
          data={props.engagement}
          readMode={props.readMode}
          onApprove={props.onApprove}
          onStartTask={props.onStartTask}
          onTaskContinue={props.onTaskContinue}
          onTaskViewDetails={props.onTaskViewDetails}
        /> }
      </> }
  </div>
}

/**
 * @deprecated Use {@link SupplierEngagementListing} instead.
 */

function EngagementListingComponent (props: EngagementComponentProps) {
  const [scrollTime, setScrollTime] = useState<number>(0)

  const handleScroll = throttle(() => {
    setScrollTime(Date.now())
  }, 60)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={style.engagements}>
      { props.data.map((engagement, index) => <div className={style.engagementsItem} key={index}>
          <EngagementListItem
            engagement={engagement}
            scrollTime={scrollTime}
            isAlwaysInViewport={index < 4} // Display only top 4 requests on viewport by default
            readMode={props.readMode}
            onBarPressed={props.onBarPressed}
            onContinuePressed={props.onContinuePressed}
            onDelete={props.onDelete}
            onApprove={props.onApprove}
            onStartTask={props.onStartTask}
            onTaskContinue={props.onTaskContinue}
            onTaskViewDetails={props.onTaskViewDetails}
          />
    </div>) }
    </div>
  )
}

export default EngagementListingComponent
