import React, { useEffect, useState } from 'react'

import styles from './process-steps-new.module.scss'
import { TaskRowNew } from './components/taskRowNew/task-row-new.component'
import { ProcessStep } from '../ProcessStep/types'

type ProcessStepsProps = {
  steps: Array<ProcessStep>
  fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
}

export function ProcessStepsNew (props: ProcessStepsProps) {
  const [steps, setsteps] = useState<Array<ProcessStep>>([])

  useEffect(() => {
    if (props.steps) {
      setsteps(props.steps)
    }
  }, [props.steps])

  function getSubprocessPreviewStpes (subProcessName: string): Promise<Array<ProcessStep>> {
    if(props.fetchPreviewSubprocess) {
      return props.fetchPreviewSubprocess(subProcessName)
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
          steps.length > 0 && steps.map((step, index) => {
            return (
              <TaskRowNew
                key={index}
                step={step}
                lastTabIndex={props.steps.length}
                fetchPreviewSubprocess={getSubprocessPreviewStpes}
              />
            )
          })
        }
        <span className={styles.accordianBoxBtmBorder}></span>
      </div>
    </div>
  )
}

