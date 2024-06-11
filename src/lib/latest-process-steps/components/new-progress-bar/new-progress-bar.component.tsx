import React from 'react'
import { Calendar, Circle } from 'react-feather'
import moment from 'moment'

import { getInfoDate, isLate } from '../../new-process-steps.component'
import { Engagement, EngagementStatus, ProcessTask, StandardTaskType } from '../../../Types/engagement'
import { getEngagementCurrentStepFromPendingList } from '../../../Engagement-listing/service'

import styles from './new-progress-bar.module.scss'
import { StandardStepTypes } from '../../../ProcessStepsNew/types'

export type ProgressBarProps = {
  engagement: Engagement | null
}

export function NewProgressBar (props: ProgressBarProps) {
  function getEstimateStatement () {
    if (props.engagement) {
      switch (props.engagement?.status) {
        /* case EngagementStatus.Pending:  // As toolkit progress UI is only used for supplier development
          return 'Est. completion:' */     // and we dont need estimated time
        case EngagementStatus.Completed:
          return 'Completed on:'
        case EngagementStatus.Cancelled:
          return 'Cancelled on:'
        case EngagementStatus.Failed:
          return 'Est. completion:'
        case EngagementStatus.Invalid:
          return 'Est. completion:'
        default:
          return ''
      }
    } else {
      return ''
    }
  }

  function isEngagementLate (): boolean {
    let isEngagementLate: boolean = false
    const pendingTask: ProcessTask | null = getEngagementCurrentStepFromPendingList(props.engagement && props.engagement?.pendingTasks ? props.engagement?.pendingTasks : [])
    if (pendingTask && pendingTask.type !== StandardTaskType.taskCollection && pendingTask.lateTime) {
      isEngagementLate = isLate(pendingTask?.lateTime)
    }

    return isEngagementLate
  }

  function getEngagementStatusDotColor (): string {
    if (isEngagementLate()) {
      return 'var(--warm-stat-honey-regular)'
    } else {
      switch (props.engagement?.status) {
        case EngagementStatus.Pending:
          return 'var(--warm-stat-mint-mid)'
        case EngagementStatus.Cancelled:
          return 'var(--warm-stat-chilli-regular)'
        case EngagementStatus.Failed:
          return 'var(--warm-stat-chilli-regular)'
        case EngagementStatus.Invalid:
          return 'var(--warm-stat-chilli-regular)'
        case EngagementStatus.Completed:
          return 'var(--warm-stat-mint-mid)'
        default:
          return 'var(--warm-stat-mint-mid)'
      }
    }
  }

  function getEngagementStatus (): string {
    if (isEngagementLate()) {
      return 'Late'
    } else {
      switch (props.engagement?.status) {
        case EngagementStatus.Pending:
          return 'Active'
        case EngagementStatus.Cancelled:
          return 'Cancelled'
        case EngagementStatus.Failed:
          return 'Failed'
        case EngagementStatus.Invalid:
          return 'Denied'
        case EngagementStatus.Completed:
          return 'Completed'
        default:
          return 'Active'
      }
    }
  }

  function getEstimatedCompletion (startedDate: string, totalEstimateTime: number, completedTime = 0): string {
    if (props.engagement) {
      switch (props.engagement?.status) {
        case EngagementStatus.Pending:
          return moment(startedDate).add((totalEstimateTime - completedTime), 'days').format('MMM D, YYYY')
        case EngagementStatus.Cancelled:
          return props.engagement?.completed ? getInfoDate(props.engagement?.completed) : ''
        case EngagementStatus.Failed:
          return '--'
        case EngagementStatus.Invalid:
          return '--'
        case EngagementStatus.Completed:
          return props.engagement?.completed ? getInfoDate(props.engagement?.completed) : ''
        default:
          return moment(startedDate).add((totalEstimateTime - completedTime), 'days').format('MMM D, YYYY')
      }
    } else {
      return '--'
    }
  }

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressBarLc}>
        <div className={styles.progressBarLcStatus}>
          <span className={styles.key}>Status:</span>
          <div className={styles.progressBarLcStatusDot}>
            <Circle size={10} color={getEngagementStatusDotColor()} fill={getEngagementStatusDotColor()} />
            <span className={styles.value}>{getEngagementStatus()}</span>
          </div>
        </div>
        <div className={styles.progressBarLcStart}>
          <Calendar size={14} color='var(--warm-neutral-shade-200)'/>
          <span className={styles.key}>Request created on:</span>
          <span className={styles.value}>{props.engagement?.started ? getInfoDate(props.engagement?.started) : ''}</span>
        </div>
        {
          props.engagement && props.engagement.status !== EngagementStatus.Pending && // props.engagement.status !== EngagementStatus.Pending is only for supplier develoment
          <div className={styles.progressBarLcEnd}>
            <Calendar size={14} color='var(--warm-neutral-shade-200)'/>
            <span className={styles.key}>{getEstimateStatement()}</span>
            <span className={styles.value}>{getEstimatedCompletion(props.engagement?.started, props.engagement?.progress?.totalEstimateTime, props.engagement?.progress?.completedTime)}</span>
          </div>
        }
      </div>
    </div>
  )
}
