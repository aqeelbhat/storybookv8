import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { Info, X } from 'react-feather'

import { Option } from '../Types'

import styles from './glance-option.module.scss'
import ALPHA2CODES_DISPLAYNAMES from '../util/alpha2codes-displaynames'

const MAX_OPTION_PATH_LENGTH = 3

function Popup (props: {
  option: Option
  isOpen?: boolean
  parentRect?: DOMRect
  onClose?: () => void
}) {
  const popupRef = useRef<HTMLInputElement | null>(null)
  const DEFAULT_SHIFT = 22

  useEffect(() => {
    if (popupRef?.current && props.parentRect) {
      if (props.isOpen) {
        const rect = popupRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const idealPosition = props.parentRect.top
        const spaceBelow = viewportHeight - (idealPosition + rect.height)

        if (spaceBelow < 2) {
          popupRef.current.style.transform = `translate(22px, calc(-50% + ${DEFAULT_SHIFT}px))`
        } else {
          popupRef.current.style.transform = `translate(22px, calc(50% - ${DEFAULT_SHIFT}px))`
        }
      }
    }
  }, [props.isOpen, props.parentRect])

  function togglePopup (e?) {
    if (e) e.stopPropagation()
    if (props.onClose) props.onClose()
  }

  return (
    <>
      <div className={classnames(styles.popup, {[styles.hidden]: !props.isOpen})} onClick={e => e.stopPropagation()} ref={popupRef}>
        <div className={styles.header}>
          <div className={styles.code}>
            {props.option.customData?.origCode || props.option.customData?.code || props.option.customData?.codePath || props.option.path}
          </div>
          <X size={16} className={styles.closeBtn} onClick={togglePopup} />
        </div>

        {
          ((props.option.customData?.ancestorNames && props.option.customData.ancestorNames.length > 0) || props.option.customData?.other?.countryCode || props.option.customData?.longDescription) &&
          <div className={styles.body}>
            {props.option.customData?.ancestorNames && props.option.customData.ancestorNames.length > 0 &&
              <OptionFullPath option={props.option} />}

            {props.option.customData?.other?.countryCode &&
              <div className={styles.parameter}>
                Region: <span className={styles.value}>{ALPHA2CODES_DISPLAYNAMES[props.option.customData?.other?.countryCode]}</span>
              </div>}

            {
              props.option.customData?.longDescription &&
              <div className={styles.parameter}>
                Description: <span className={styles.value}>{props.option.customData?.longDescription}</span>
              </div>
            }
          </div>
        }
      </div>

      {props.isOpen && <div className={styles.backdrop} onClick={togglePopup}></div>}
    </>
  )
}

export function GlanceOption (props: {
  option: Option
  onToggle?: (isOpen: boolean) => void
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const iconRef = useRef<HTMLInputElement | null>(null)
  const [parentRect, setParentRect] = useState<DOMRect | undefined>()
  
  useEffect(() => {
    if (isOpen && iconRef?.current) {
      const rect = iconRef.current.getBoundingClientRect()
      setParentRect(rect)
    }
  }, [isOpen])

  function togglePopup (e?) {
    if (e) e.stopPropagation()

    const _isOpen = !isOpen
    setIsOpen(_isOpen)

    if (props.onToggle) props.onToggle(_isOpen)
  }

  return (
    <div className={styles.glaceOption} ref={iconRef}>
      <Info
        size={16} className={classnames(styles.icon, {[styles.active]: isOpen})}
        onClick={togglePopup}
      />

      <Popup isOpen={isOpen} option={props.option} parentRect={parentRect} onClose={togglePopup} />
    </div>
  )
}

export function OptionFullPath (props: {option: Option, limit?: boolean}) {
  const [ancestorNames, setAncestorNames] = useState<string[]>([])

  useEffect(() => {
    let limitedAncestors = []
    if (props.option.customData?.ancestorNames && props.option.customData.ancestorNames.length > 0) {
      if (props.limit && (props.option.customData.ancestorNames.length > MAX_OPTION_PATH_LENGTH)) {
        limitedAncestors.push(props.option.customData.ancestorNames[0])
        limitedAncestors.push('...')
        limitedAncestors.push(props.option.customData.ancestorNames[props.option.customData.ancestorNames.length - 1])
      } else {
        limitedAncestors = props.option.customData.ancestorNames
      }
    }
    setAncestorNames(limitedAncestors)
  }, [props.option, props.limit])

  return (
    <span className={styles.optionFullPath}>
      {ancestorNames.map((name, i) =>
        <span key={name}>
          <span className={styles.crumb}>{name}</span>
          {(i < (ancestorNames.length - 1)) &&
            <span className={styles.separator}> / </span>}
        </span>)}
    </span>
  )
}
