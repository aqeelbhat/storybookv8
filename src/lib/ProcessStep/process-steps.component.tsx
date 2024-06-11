import React, { useState, useEffect } from 'react'

import styles from './process-steps.module.scss'
import { TaskRow } from './components/task-row/task-row.component'
import { ProcessStep } from './types'

export type ProcessStepsProps = {
  steps: Array<ProcessStep>
  subProcessPreviewSteps?: ProcessStep[]
  fetchPreviewSubprocess?: (subprocessName: string) => void
}

export function ProcessSteps (props: ProcessStepsProps) {
  const [steps, setsteps] = useState<Array<ProcessStep>>([])

  useEffect(() => {
    if (props.steps) {
      setsteps(props.steps)
    }
  }, [props.steps])

  function getSubprocessPreviewStpes (subProcessName: string) {
    if(props.fetchPreviewSubprocess) {
      props.fetchPreviewSubprocess(subProcessName)
    }
  }

  return (
    <div className={styles.processSteps}>

      <div className={styles.processStepsTableHeader}>
        <span className={styles.processStepsTableHeaderSteps}>STEP</span>
        <span className={styles.processStepsTableHeaderProcess}>PROCESS</span>
        <span className={styles.processStepsTableHeaderAssignTo}>ASSIGNED TO</span>
      </div>

      <div className={styles.accordianBox}>
        {
          steps.map((step, index) => {
            return (
              <TaskRow
                key={index}
                step={step}
                lastTabIndex={props.steps.length}
                subProcessPreviewSteps={props.subProcessPreviewSteps}
                fetchPreviewSubprocess={getSubprocessPreviewStpes}
              />
            )
          })
        }
      </div>
    </div>
  )
}
