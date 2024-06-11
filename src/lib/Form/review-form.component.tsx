import React from 'react'

import styles from './review-form-styles.module.scss'
import { ReviewFormProps } from './types'
import { ProcessStepsNew } from '../ProcessStepsNew/process-steps-new.component'

export function ReviewForm (props: ReviewFormProps) {
  /* const [showMessage, setShowMessage] = useState<boolean>(false)
  const [comment, setComment] = useState('')

  function searchForDocCollection (tasks: Task[]): boolean {
    function lookIntoEachTask (task: Task) {
      if (task.tasks.length > 0) {
        return task.tasks.some(subTask => subTask.type === 'branching')
      } else {
        return task.type === 'branching'
      }
    }

    return tasks.some(lookIntoEachTask)
  }

  useEffect(() => {
    if (props.comment) {
      setComment(props.comment)
    }
  }, [props.comment])

  useEffect(() => {
    setShowMessage(searchForDocCollection(props.tasks))
  }, [props.tasks])

  function handleCommentChange (event) {
    setComment(event.target.value)
    if (props.onCommentChange) {
      props.onCommentChange(event.target.value)
    }
  } */

  return (
    <div className={styles.reviewForm}>

      {/* {
        showMessage &&
        <div className={styles.msgContainer}>
          <label>Your message</label>
          <div className={styles.msgWrapper}>
            <div className={styles.personInfo}>
              <span className={styles.logo}>
                <User size={24} color="#ffffff"/>
              </span>
              <div>
                <p>
                  {
                    props.contact && props.contact.fullName
                    ? props.contact.fullName
                    : props.contact && (props.contact.firstName || props.contact.lastName)
                      ? `${props.contact.firstName} ${props.contact.lastName}`
                      : 'Not available'
                  }
                </p>
                <span className={styles.jobProfile}>{props.contact ? props.contact.role : 'Not available'}</span>
                <span className={styles.website}>{props.contact ? props.contact.email : 'Not available'}</span>
              </div>
            </div>
            <textarea 
              className={styles.msgBox}
              value={comment}
              onChange={handleCommentChange}
              disabled={props.readOnly ? props.readOnly : false}
            />
          </div>
        </div>
      } */}

      <div className={styles.processContainer}>
        <label>Process steps that will be executed for your request</label>
        <div className={styles.processWrapper}>
          <ProcessStepsNew steps={props.steps} fetchPreviewSubprocess={props.fetchPreviewSubprocess}/>
        </div>
      </div>
    </div>
  )
}