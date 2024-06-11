import classNames from "classnames"
import { useLayoutEffect, useRef, useState } from "react"
import styles from './styles.module.scss';
import React from "react";

export interface ReadMoreTextProps {
  value: string
  readMore: string
  readLess: string
  disable?: boolean
}

// For category description
function ReadMoreText (props: ReadMoreTextProps) {
  const _ref = useRef<HTMLDivElement>(null)
  const [showReadMore, setShowReadMore] = useState(false)
  const [expanded, setExpanded] = useState(false)

  function toggleReadMore (e: React.MouseEvent) {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  useLayoutEffect(() => {
    if (!props.disable && _ref?.current) {
      const offsetHeight = _ref.current.offsetHeight
      const scrollHeight = _ref.current.scrollHeight
      setShowReadMore(scrollHeight > offsetHeight)
    }
  })

  return <div className={styles.wrapper}>
    <div ref={_ref} className={classNames(styles.value, { [styles.clamp]: !expanded && !props.disable })}>
      {props.value}&nbsp;{expanded && <span onClick={toggleReadMore} className={styles.readMore}>{props.readLess}</span>}
    </div>
    {showReadMore && <span onClick={toggleReadMore} className={styles.readMore}>{props.readMore}</span>}
  </div>
}
export default ReadMoreText