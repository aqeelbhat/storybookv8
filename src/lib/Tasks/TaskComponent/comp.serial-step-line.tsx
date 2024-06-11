import React from 'react'
import styles from './style.serial-step-line.module.scss'

interface SerialStepLineProps {
    callback?: {
        onDrop?: (taskItem: string, taskItemType: string) => any;
        onMoveNode?: (moveNodeId: number) => any;
    }
}

const COLOR_PRIMERY_GREEN = '#82C146'
const COLOR_NONE = 'none'

function SerialStepLineComponent (props: SerialStepLineProps) {
  const serialStepLineRef = React.useRef(null)

  function allowDrop (event: any) {
    event.preventDefault();
    (serialStepLineRef.current! as HTMLElement).style.background = COLOR_PRIMERY_GREEN
  }

  function onDragLeave (event: any) {
    (serialStepLineRef.current! as HTMLElement).style.background = COLOR_NONE
  }

  function onDropSerial (event: any) {
    const taskItem = event.dataTransfer.getData('task-item')
    const taskItemType = event.dataTransfer.getData('task-item-type')
    const moveNodeId = event.dataTransfer.getData('move-node');

    (serialStepLineRef.current! as HTMLElement).style.background = COLOR_NONE

    if (taskItem && props?.callback?.onDrop) {
      props.callback.onDrop(taskItem, taskItemType)
    } else if (moveNodeId && props.callback && props.callback.onMoveNode) {
      props.callback.onMoveNode(parseInt(moveNodeId))
    }
  }

  return <div className={styles.serialStep} onDrop={onDropSerial} onDragOver={allowDrop} onDragLeave={onDragLeave}>
                <div className={styles.serialStepLine} ref={serialStepLineRef}></div>
            </div>
}

export default SerialStepLineComponent
