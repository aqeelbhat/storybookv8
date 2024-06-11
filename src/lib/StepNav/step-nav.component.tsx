import React from 'react'
import { useEffect, useState } from 'react'
import { Check, Minus } from 'react-feather'

import { StepNavProps } from './types'
import styles from './styles.module.scss'

import cx from 'classnames'
import { RequestStep } from '..'

export function StepNav (props: StepNavProps) {
  const [lastActiveStepIndex, setLastActiveStepIndex] = useState<number>(0)

  useEffect(() => {
    let _lastActiveStepIndex = 0
    props.steps?.forEach((step, index) => {
      if (step.visited || index === props.activeStepIndex) {
        _lastActiveStepIndex = index
      }
    })

    setLastActiveStepIndex(_lastActiveStepIndex)
  }, [props.steps])

  function handleStepselect (index: number) {
    props.onStepSelect(index)
  }

  function isStepActive (index: number): boolean {
    return index === props.activeStepIndex
  }

  function stepClassName (index: number, visited: boolean): string {
    return isStepActive(index)
        ? styles.activeTabs
        : visited
          ? cx(styles.inactiveTabs, styles.checkedTabs)
          : index < props.activeStepIndex
            ? cx(styles.inactiveTabs, styles.skippedTabs)
            : styles.inactiveTabs
  }

  function getDisplayStepName (step: RequestStep) {
    let name
    if (props.stepTitlesLocalization && step) {
      name = props.stepTitlesLocalization[step.title]
    }
    return name || step.title
  }

  return (
    <div className={styles.tabSpan} data-testid="all-tabs">
      {props.steps?.map((step, index) =>
        <div className={styles.idvTab} key={index} >
          <div className={`${styles.stepNum} ${stepClassName(index, step.visited)}`}>
            <span onClick={() => step.visited && !isStepActive(index) && handleStepselect(index)}>
              { isStepActive(index)
                  ? index + 1
                  : step.completed
                    ? <Check strokeWidth={2} size={20} color={'var(--warm-stat-mint-mid)'}/>
                    : index < props.activeStepIndex
                      ? <Minus strokeWidth={2} size={20} color={'var(--warm-neutral-shade-100)'}/>
                      : index + 1}
            </span>
            <p>{getDisplayStepName(step)}</p>
          </div>

          {index !== props.steps?.length - 1 && <div className={`${styles.progressLine} ${index < lastActiveStepIndex ? styles.active : ''}`} />}
        </div>
      )}
    </div>
  )
}
