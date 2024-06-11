import React from 'react'
import { DragTask, TaskRowProps } from './../types'

import styles from './style.task-row.module.scss'
import SubProcess from '../assets/sub-process.svg'
import { MenuItem } from '../../menu/types'
import Menu from '../../menu/Menu'
import { TASK_LIST, TASK_TYPE_BRANCHING, TASK_TYPE_PROCESS } from '../Util.service'

export const MENU_ITEM_RENAME = 'rename'
export const MENU_ITEM_MOVEUP = 'moveup'
export const MENU_ITEM_MOVEDOWN = 'movedown'
export const MENU_ITEM_DUPLICATE = 'duplicate'
export const MENU_ITEM_DELETE = 'delete'

const MENU_ACTIONS: MenuItem[][] = [
  [
    { id: MENU_ITEM_RENAME, value: 'Rename' }
  ],
  [
    { id: MENU_ITEM_MOVEUP, value: 'Move up' },
    { id: MENU_ITEM_MOVEDOWN, value: 'Move down' }
  ],
  [
    { id: MENU_ITEM_DUPLICATE, value: 'Duplicate' },
    { id: MENU_ITEM_DELETE, value: 'Delete' }
  ]
]

export const DROP_AREA_UPPER = 'upper'
export const DROP_AREA_LOWER = 'lower'

function TaskRowComponent (props: TaskRowProps) {
  function onDropParallel (event: any, id: number) {
    const taskItem = event.dataTransfer.getData('task-item')
    const taskItemType = event.dataTransfer.getData('task-item-type')
    const moveNodeId = event.dataTransfer.getData('move-node')
    const dropArea = event.target.getAttribute('data-drop-area')

    if (taskItem && props?.callback?.onDrop) {
      props.callback.onDrop(id, taskItem, taskItemType, dropArea)
    } else if (moveNodeId && props.callback && props.callback.onMoveNode) {
      props.callback.onMoveNode(id, parseInt(moveNodeId), dropArea)
    }
  }

  function allowDrop (event: any) {
    event.preventDefault()
  }

  function onDragLeave (event: any) {

  }

  function onDragStart (event: any) {
    event.dataTransfer.setData('move-node', props.task.id)
  }

  function onTaskClick () {
    if (props?.callback?.onTaskClick) {
      props.callback.onTaskClick(props.task)
    }
  }

  function onMenuOptionClick (id: string, value: string) {
    if (props?.callback?.onMenuOptionClick) {
      props.callback.onMenuOptionClick({ option: { id, value }, task: props.task })
    }
  }

  function getIcon (type: string): string | undefined {
    if (type === TASK_TYPE_PROCESS) {
      return SubProcess
    } else {
      const [task] = TASK_LIST.filter((dragTask: DragTask) => {
        return dragTask.id === type
      })

      return task ? task.icon : SubProcess
    }
  }

  return (
        <div className={styles.taskRelativeContainer}>
            <div
                className={`${styles.task} ${props.className} ${props.isSelected ? `${styles.taskSelected}` : ''}`}
                onClick={onTaskClick} draggable={!props.readOnly} onDragStart={onDragStart}>

                <img className={styles.taskIcon} src={getIcon(props.task.type)} alt=""/>
                <span className={styles.taskName}>{props.task.displayName}</span>
                { props.task.type === TASK_TYPE_BRANCHING && <span className={styles.taskDocCount}>{props.task.numberOfDocuments} DOCS</span>}
                { props.task.type === TASK_TYPE_PROCESS && props.task.numberOfSteps > 0 && <span className={styles.taskDocCount}>{props.task.numberOfSteps} {props.task.numberOfSteps === 1 ? 'STEP' : 'STEPS'}</span>}
                <div className={styles.taskUpper} onDrop={(event) => onDropParallel(event, props.task.id)} onDragOver={allowDrop} onDragLeave={onDragLeave} data-drop-area={DROP_AREA_UPPER}></div>
                <div className={styles.taskLower} onDrop={(event) => onDropParallel(event, props.task.id)} onDragOver={allowDrop} onDragLeave={onDragLeave} data-drop-area={DROP_AREA_LOWER}></div>

            </div>
            {!props.readOnly &&
              <div className={styles.taskActionMenu}>
                  <Menu menuList={MENU_ACTIONS} getAction={onMenuOptionClick}/>
              </div>}
        </div>
  )
}

export default TaskRowComponent
