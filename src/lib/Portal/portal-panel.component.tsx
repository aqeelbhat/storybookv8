import classnames from 'classnames'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { ChevronsLeft, ChevronsRight } from 'react-feather'
// import { useMediaQuery } from 'react-responsive'
import { OroTooltip } from '../Tooltip/tooltip.component'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

import styles from './portal-panel.module.scss'
const CONTAINER_CLASS = 'portalPanelContainer'
const APP_CROPPED_MAX_WIDTH = 1440
// const APP_MAX_WIDTH = 1600

interface portalPanelProps {
  children: JSX.Element | JSX.Element[]
  isOpen?: boolean
  expandable?: boolean
  isExtraExpandable?: boolean
  hideExpandableButton?: boolean
  expanded?: boolean
  width?: number
  alwaysShowOverlay?: boolean
  bannerLoaded?: boolean
  isLeftPosition?: boolean
  isExtremeRightPanel?: boolean
  onExpandToggle?: (isExpanded: boolean) => void
  onScrollToBottom?: () => void
}
export function PortalPanelDialogComponent (props: portalPanelProps) {
  // const isBigScreen = useMediaQuery({ query: '(min-width: 1600px)' })
  const portalRef = useRef(null)
  const expandBtnRef = useRef(null)
  const expandHighlightRef =useRef(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [hideTooltip, setHideTooltip] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  function getExpandClass () {
    return props.isExtraExpandable ? styles.expandedLarge : styles.expanded
  }
  function getRegularClass () {
    return props.isExtraExpandable ? styles.regularLarge : styles.regular
  }

  useEffect(() => {
    const portal = portalRef.current
    const bannerRoot = document.getElementsByClassName('appBanner')[0]
    const navRoot = document.getElementsByClassName('appNavbar')[0]
    // const headerRoot = document.getElementsByClassName('measureDetailtHeaderBar')[0]
    // const tabRoot = document.getElementsByClassName('measureDetailTabBar')[0]
    let topPosition = 0
    let rightPosition = 0
    let leftPosition = 0

    if (navRoot) {
      topPosition = navRoot.clientHeight + (bannerRoot ? bannerRoot.clientHeight : 0) // + (headerRoot ? headerRoot.clientHeight : 0) + (tabRoot.clientHeight + 1)
    }

    const currentMaxWidth = APP_CROPPED_MAX_WIDTH // isBigScreen ? APP_MAX_WIDTH : APP_CROPPED_MAX_WIDTH
    if (window.innerWidth > currentMaxWidth && !props.isLeftPosition && !props.isExtremeRightPanel) {
      rightPosition = ((window.innerWidth - currentMaxWidth) / 2) + 1
    } else {
      leftPosition = ((window.innerWidth - currentMaxWidth) / 2) + 1
    }

    portal.classList.add(CONTAINER_CLASS)
    portal.style.top = `${topPosition}px`
    portal.style.height = `calc(100vh - ${topPosition}px)`
    if (props.isLeftPosition) {
      portal.style.left = `${leftPosition}px`
      portal.style.right = `none`
    }
    if (props.isExtremeRightPanel) {
      portal.style.right =  `${rightPosition}px`
    }
    if (props.width) {
      portal.style.width = `${props.width}px`
    }

    const portalHeader = document.getElementsByClassName('portalHeader')[0]
    const expandBtnTopPosition = (navRoot ? navRoot.clientHeight : 0) + (bannerRoot ? bannerRoot.clientHeight : 0) + (portalHeader ? (portalHeader.clientHeight - 14) : 36)
    const expandBtn = expandBtnRef.current
    if (expandBtn) {
      expandBtn.style.top = `${expandBtnTopPosition}px`
    }

    const expandHighlight = expandHighlightRef.current
    if (expandHighlight) {
      expandHighlight.style.top = `${topPosition}px`
      expandHighlight.style.height = `calc(100vh - ${topPosition}px)`
    }
  }, [props.isOpen, props.bannerLoaded])

  useEffect(() => {
    if (props.isOpen) {
      portalRef.current.classList.remove(styles.portalHide)
      portalRef.current.classList.add(styles.portalShow)
      setIsExpanded(props.expanded)
    } else {
      portalRef.current.classList.remove(styles.portalShow)
      portalRef.current.classList.add(styles.portalHide)

      portalRef.current.classList.remove(getRegularClass())
      portalRef.current.classList.remove(getExpandClass())
      setIsExpanded(false)
    }
  }, [props.isOpen, props.expanded])

  useEffect(() => {
    if (isExpanded) {
      portalRef.current.classList.add(getExpandClass())

      portalRef.current.classList.remove(getRegularClass())
    } else {
      if (portalRef.current.classList.contains(styles.expanded) || portalRef.current.classList.contains(styles.expandedLarge)) {
        portalRef.current.classList.add(getRegularClass())
      }
      portalRef.current.classList.remove(getExpandClass())
    }
  }, [isExpanded])

  function toggleExpand (e) {
    e.stopPropagation()
    const newExpandState = !isExpanded
    setIsExpanded(newExpandState)

    if (props.onExpandToggle) {
      props.onExpandToggle(newExpandState)
    }

    // Momentarily disable tooltip; this is solely for user experience
    setHideTooltip(true)
    setTimeout(() => {
      setHideTooltip(false)
    }, 500)
  }

  function handleScroll (e) {
    const target = e.target;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      if (props.onScrollToBottom) {
        props.onScrollToBottom()
      }
    }
  }

  return (<>
    <div className={classnames(styles.portal)} ref={portalRef}>
      <div className={styles.portalContentWrapper} onScroll={handleScroll}>
        {props.expandable && !props.hideExpandableButton &&
          <>
            <div className={styles.expandCollapseBtnWrapper}>
              <OroTooltip title={!hideTooltip ? (isExpanded ? t('--collapse--') : t('--expand--')) : ''} placement="left">
                <div className={styles.expandCollapseBtn} onClick={toggleExpand} ref={expandBtnRef}>
                  { isExpanded
                    ? <ChevronsRight size={16} />
                    : <ChevronsLeft size={16} />}
                </div>
              </OroTooltip>
            </div>
            <div className={styles.expandHighlight} ref={expandHighlightRef} />
          </>}
        {props.children}
      </div>
    </div>
    {props.isOpen && (isExpanded || props.alwaysShowOverlay) && <div className={styles.backdrop} />}
  </>)
}
export function PortalPanelDialog (props: portalPanelProps) {
  return <I18Suspense><PortalPanelDialogComponent  {...props} /></I18Suspense>
}