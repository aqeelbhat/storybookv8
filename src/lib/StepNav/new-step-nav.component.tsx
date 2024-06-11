import React, { useEffect, useState } from "react";
import { StepNavProps } from "./types";
import styles from './styles.module.scss'
import { RequestStep } from "../Types";
import classNames from "classnames";



export function NewStepNav (props: StepNavProps) {
  const [totalSteps, setTotalSteps] = useState<Array<RequestStep>>([])
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)

  useEffect (() => {
    if (props.steps) {
        const steps = props.steps.filter((step) => {
          if ((step?.index < (props.activeStepIndex + 1) && !step.completed)) {
            return false
          }
          return true
        })
        setTotalSteps(steps)
    }
  }, [props.steps, props.activeStepIndex])

  function handleStepselect (index: number) {
    props.onStepSelect(index)
  }

  useEffect(() => {
    if (props.activeStepIndex > -1) {
      setActiveStepIndex((props.activeStepIndex + 1))
    }
  }, [props.activeStepIndex])

  function isVisitedProgressBarStep (currentStep : RequestStep) {
    return currentStep.index < activeStepIndex || currentStep.index === activeStepIndex
  }

  function isStepActive (index: number): boolean {
    return index === activeStepIndex
  }

  function getDisplayStepName (step: RequestStep) {
    let name
    if (props.stepTitlesLocalization && step) {
      name = props.stepTitlesLocalization[step.title]
    }
    return name || step.title
  }

  return (
    <div className={styles.newProgressBar}>
        <div className={styles.container} data-testid="all-tabs">
            {totalSteps?.map((step, index) => {
                return(
                    <div key={index} className={classNames(styles.step)}>
                        {isVisitedProgressBarStep(step) &&
                          <div className={classNames(styles.visitedNode, isStepActive(step.index) && index !== 0 ? styles.currentNode : styles.pastVisitedNode)}
                          onClick={() => step.visited && !isStepActive(step.index) && handleStepselect(index)}>
                            <div className={classNames(styles.lineContainer, {[styles.currentContainer]: isStepActive(step.index)})}>
                                <div className={isStepActive(step.index) ? styles.currentBullet : styles.bullet}></div>
                                <div className={classNames(styles.progressBarLine, {[styles.firstStepProgressLine]: isStepActive(step.index) && index === 0})} />
                            </div>
                            <span className={classNames(isStepActive(step.index) ? styles.currentNodeTitle : styles.title)}>{getDisplayStepName(step)}</span>
                        </div>}
                        {!isVisitedProgressBarStep(step) && 
                            <div className={styles.notVisitedProgressBarLine} />
                        }
                    </div>
                )
            }
            )}
        </div>
    </div>
  )
}