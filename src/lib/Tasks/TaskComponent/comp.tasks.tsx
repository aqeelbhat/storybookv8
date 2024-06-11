import React, { useRef, useState } from 'react'
import { TasksProps, Task, TaskMenuOption } from '../types'

import TaskRowComponent, { MENU_ITEM_RENAME } from '../TaskRow/comp.task-row'
import SerialStepLineComponent from './comp.serial-step-line'
import styles from './style.comp.tasks.module.scss'
import cx from 'classnames'

export function TasksComponent (props: TasksProps) {
  const [selectedTask, updateSelectedTask] = useState<Task | null>(null)
  const startDivRef = useRef(null)

  function highlightStartDiv (isHighlight: boolean) {
    const startDiv: HTMLDivElement = startDivRef.current as unknown as HTMLDivElement

    if (isHighlight) {
      startDiv.classList.add(styles.active)
    } else {
      startDiv.classList.remove(styles.active)
    }
  }

  function onDropParallel (id: number, taskItem: string, taskItemType:string, dropLocaton: string) {
    if (props?.callback?.onDropParallel) {
      props.callback.onDropParallel(id, taskItem, taskItemType, dropLocaton)
    }
  }

  function onDropSerial (id: number, taskItem: string, taskItemType: string) {
    if (props?.callback?.onDropSerial) {
      props.callback.onDropSerial(id, taskItem, taskItemType)
    }
  }

  function onDropSerialBefore (id: number, taskItem: string, taskItemType:string) {
    if (props?.callback?.onDropSerialBefore) {
      props.callback.onDropSerialBefore(id, taskItem, taskItemType)
    }
  }

  function onMoveNode (dropTaskId: number, moveNodeId:number, dropLocaton: string) {
    if (props?.callback?.onMoveNode) {
      props.callback.onMoveNode(dropTaskId, moveNodeId, dropLocaton)
    }
  }

  function onMoveNodeSerial (dropTaskId: number, moveNodeId:number) {
    if (props?.callback?.onMoveNodeSerial) {
      props.callback.onMoveNodeSerial(dropTaskId, moveNodeId)
    }
  }

  function onMoveNodeSerialBefore (dropTaskId: number, moveNodeId:number) {
    if (props?.callback?.onMoveNodeSerialBefore) {
      props.callback.onMoveNodeSerialBefore(dropTaskId, moveNodeId)
    }
  }

  function onTaskClick (task: Task) {
    updateSelectedTask(task)
    if (!props.readOnly) highlightStartDiv(false)
    if (props?.callback?.onTaskSelected) {
      props.callback.onTaskSelected(task)
    }
  }

  function onMenuOptionClick (taskMenuOption: TaskMenuOption) {
    if (props?.callback?.onMenuOptionClick) {
      props.callback.onMenuOptionClick(taskMenuOption)

      if (taskMenuOption.option.id === MENU_ITEM_RENAME) {
        onTaskClick(taskMenuOption.task)
      }
    }
  }

  function allowDrop (event: any) {
    event.preventDefault()
  }

  function onDropZone (event: any) {
    const taskItem = event.dataTransfer.getData('task-item')
    const taskItemType = event.dataTransfer.getData('task-item-type')

    if (taskItem && props?.callback?.onFirstDrop) {
      props.callback.onFirstDrop(taskItem, taskItemType)
    }
  }

  function setPhaseName (newName: string) {
    if (typeof props.callback?.onTaskNameChange === 'function') {
      props.callback?.onTaskNameChange(newName)
    }
  }

  function getTasksElement (tasks: Array<Task>): JSX.Element[] {
    return tasks.map((task: Task, index: number) => {
      if (task.tasks.length === 0) {
        return (
          <div className={styles.tasksContainer} key={index}>
            { index === 0 &&
              <SerialStepLineComponent callback={{
                onDrop: (taskItem: string, taskItemType:string) => { onDropSerialBefore(task.id, taskItem, taskItemType) },
                onMoveNode: (moveNodeId: number) => { onMoveNodeSerialBefore(task.id, moveNodeId) }
              }}/>
            }
            <div className={styles.tasksContainerBoxSerial}>
              <span className={styles.indexCount}>{index + 1}</span>
              <TaskRowComponent
                className={styles.tasksContainer}
                isSelected={task.id === selectedTask?.id}
                callback={{ onDrop: onDropParallel, onMoveNode, onTaskClick, onMenuOptionClick }}
                task={task}
                readOnly={props.readOnly}
              />
            </div>
            <SerialStepLineComponent
              callback={{
                onDrop: (taskItem: string, taskItemType:string) => { onDropSerial(task.id, taskItem, taskItemType) },
                onMoveNode: (moveNodeId: number) => { onMoveNodeSerial(task.id, moveNodeId) }
              }}
            />
          </div>
        )
      } else {
        return (
          <div className={styles.tasksContainer} key={index}>
            { index === 0 &&
              <SerialStepLineComponent callback={{
                onDrop: (taskItem: string, taskItemType:string) => { onDropSerialBefore(task.id, taskItem, taskItemType) },
                onMoveNode: (moveNodeId: number) => { onMoveNodeSerialBefore(task.id, moveNodeId) }
              }}/>
            }
            <input
              type="text"
              className={styles.phaseName}
              placeholder={'Phase name (Optional)'}
              defaultValue={task.displayName}
              onFocus={() => onTaskClick(task)}
              onBlur={e => setPhaseName(e.target.value)}
            />
            <div className={styles.tasksContainerBoxSerial}>
              <span className={styles.indexCount}>{index + 1}</span>
              <div className={styles.tasksContainerBoxParallel}>
                {task.tasks.map((task: Task, indexInner: number) => {
                  return (
                    <TaskRowComponent
                      isSelected={task.id === selectedTask?.id}
                      callback={{ onDrop: onDropParallel, onMoveNode, onTaskClick, onMenuOptionClick }}
                      task={task}
                      readOnly={props.readOnly}
                      key={indexInner}
                    />
                  )
                })}
              </div>
            </div>
            <SerialStepLineComponent
              callback={{
                onDrop: (taskItem: string, taskItemType:string) => { onDropSerial(task.id, taskItem, taskItemType) },
                onMoveNode: (moveNodeId: number) => { onMoveNodeSerial(task.id, moveNodeId) }
              }}
            />
          </div>
        )
      }
    })
  }

  function showIntialRightPanel () {
    updateSelectedTask(null)
    highlightStartDiv(true)
    props.callback?.onStartSelected('start')
  }

  return (
        <div>
            {!props.readOnly &&
              <div className={cx(styles.sandwichBread, styles.cursorPointer)}ref={startDivRef} onClick={showIntialRightPanel}>
                  <span className={styles.sandwichBreadTxtlft}>START</span>
                  <span className={styles.sandwichBreadTxtrgt}>Input: {props.processDefinition.inputForms.length} forms</span>
              </div>}
            { props.tasks.length > 0 && getTasksElement(props.tasks)}
            { props.tasks.length === 0 && !props.readOnly &&
                <div className={styles.dropZone} onDrop={onDropZone} onDragOver={allowDrop}>
                    <span className={styles.dropZoneTitle}>Drag and drop here</span>
                    <span className={styles.dropZoneSubtitle}>to create task or sub process</span>
                    <div className={styles.dropZoneBox}>
                      <div className={styles.dropZoneCircle}></div>
                      <div className={styles.dropZoneLine}></div>
                    </div>
                </div>}
            {!props.readOnly &&
              <div className={styles.sandwichBread}>
                  <span className={styles.sandwichBreadTxtlft}>END</span>
                  <span className={styles.sandwichBreadTxtrgt}>Output</span>
              </div>}
        </div>
  )
}

export default TasksComponent
