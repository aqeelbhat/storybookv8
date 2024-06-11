/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { MutableRefObject, useEffect, useReducer, useRef, useState } from 'react'
import moment from 'moment'

import { OroMeasureMilestone, MeasureMilestoneProps } from './types'
import { ORODatePicker } from '../Inputs'
import { getDateObject} from './util'
import styles from './measure-milestone.module.scss'
import Tooltip from '@mui/material/Tooltip'
import { MeasureDate } from '.'
import { ChevronLeft, ChevronRight, XCircle } from 'react-feather'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { LocalLabels } from '../CustomFormDefinition'

function ActiveDot () {
  return (
    <div className={styles.outerCircle}>
      <div className={styles.outerCircleInnerCircle}>
        <div className={styles.outerCircleInnerCircleBlue}></div>
      </div>
    </div>
  )
}

function Dot () {
  return (
    <div className={styles.deactiveDot}>
      <div className={styles.deactiveDotInner}></div>
    </div>
  )
}

function CompletedDot () {
  return (
    <div className={styles.CmpltDot}>
      <div className={styles.CmpltDotInner}></div>
    </div>
  )
}

function MeasureMilestoneComponent (props: MeasureMilestoneProps) {
  const timelineSliderRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [measureMilestoneData, setMeasureMilestoneData] = useState<OroMeasureMilestone | null>(null)
  const [hasListGrownOutOfView, setHasListGrownOutOfView] = useState(false)
  const [localizedProcessNames, setLocalizedProcessNames] = useReducer((
    state: {[processName: string]: string},
    action: {
      processName: string,
      localizedName: string
    }
  ) => {
    return {
      ...state,
      [action.processName]: action.localizedName
    }
  }, {})
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)

  // this function show the arrow if scroll width is greater than offsetwidth
  // otherwise we dont need the arrow to be displayed is there is no scroll
  function isSliderGoesOutOfScreen (ref: MutableRefObject<any>, setter: Function) {
    setTimeout(() => {
      const requestSliderDiv: HTMLDivElement = ref?.current as unknown as HTMLDivElement
      setter(requestSliderDiv ? requestSliderDiv.scrollWidth > requestSliderDiv.offsetWidth + 100 : false)
    }, 100)
  }

  useEffect(() => {
    isSliderGoesOutOfScreen(timelineSliderRef, setHasListGrownOutOfView)
  }, [props.formData])

  function fetchData (skipValidation?: boolean): OroMeasureMilestone {
    if ((skipValidation || measureMilestoneData)) {
      return measureMilestoneData
    } else {
      return null
    }
  }

  function handleFieldValueChange (newValue: OroMeasureMilestone) {
    if (props.onValueChange) {
        props.onValueChange(newValue)
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [measureMilestoneData])

  function getParsedDateForSubmit (date: string): string {
    return date ? moment(date).format('YYYY-MM-DD') : ''
  }

  function getParsedDateForDisplay (date: string): string {
    return date ? moment(date).format('MMM DD, YYYY') : ''
  }

  useEffect(() => {
      if (props.formData) {
        setMeasureMilestoneData((props.formData as OroMeasureMilestone))
      }
  }, [props.formData])

  useEffect(() => {
    // fetch localized process names
    if (measureMilestoneData && measureMilestoneData.measuerDates && props.getLocalProcessLabels) {
      const processLocalLabelPromises = measureMilestoneData.measuerDates.map(il =>
        il.displayName ? props.getLocalProcessLabels(il.displayName) : Promise.reject('No process name')
      )
      Promise.allSettled(processLocalLabelPromises)
        .then(results => {
          results.forEach((result, i) => {
            const processName = measureMilestoneData.measuerDates?.[i]?.displayName

            if (processName && (result.status === 'fulfilled')) {
              const labels = result.value as LocalLabels
              const localizedName = labels?.process?.name || processName
              setLocalizedProcessNames({ processName, localizedName })
            }
          })
        })
    }
  }, [measureMilestoneData])

  function handleMeasureDateChange (date: string, index: number) {
    if (measureMilestoneData && date) {
        const measureDateCopy = measureMilestoneData?.measuerDates?.map(measure => {
            if (measure.index === index) {
                measure.start = getParsedDateForSubmit(date)
            }
            return measure
        })
        setMeasureMilestoneData({...measureMilestoneData, measuerDates : measureDateCopy})
        handleFieldValueChange({...measureMilestoneData, measuerDates : measureDateCopy})
    } else {
      handleClearmeasureDate(index)
    }
  }

  function handleClearmeasureDate (index: number) {
    if (measureMilestoneData) {
      const measureDateCopy = measureMilestoneData?.measuerDates?.map(measure => {
          if (measure.index === index) {
              measure.start = null
          }
          return measure
      })
      setMeasureMilestoneData({...measureMilestoneData, measuerDates : measureDateCopy})
      handleFieldValueChange({...measureMilestoneData, measuerDates : measureDateCopy})
    }
  }

  /* function handleDateRangeChange (start: string, end: string) {
    setMeasureMilestoneData({...measureMilestoneData, end : getParsedDateForSubmit(end), start: getParsedDateForSubmit(start)})
    handleFieldValueChange({...measureMilestoneData, end : getParsedDateForSubmit(end), start: getParsedDateForSubmit(start)})
  } */

  function allDates (index: number): {startDate: Date, endDate: Date} {
    let disableDateStart: Date | null = null
    let disableDateEnd: Date | null = null
    measureMilestoneData.measuerDates.forEach((innerDate, innerIndex) => {
      if (innerDate.start && index < innerIndex && !disableDateStart) {
        disableDateStart = getDateObject(innerDate.start)
      } else if (innerDate.start && index > innerIndex) {
        disableDateEnd = getDateObject(innerDate.start)
      }
    })
    return {startDate: disableDateStart, endDate: disableDateEnd}
  }

  function isDatePassedOrSame (measureDate: MeasureDate): boolean {
    let isPassed = false
    if(measureMilestoneData?.measuerDates && measureMilestoneData?.measuerDates.length && measureDate.start) {
      const slicedList = measureMilestoneData?.measuerDates.slice(0, measureDate.index - 1) // sliced measure date list till the selected measure date
      if(slicedList.length) {
        slicedList.forEach(measureILdate => {
          if (measureILdate.start) {
            if (!moment(measureDate.start).isSameOrAfter(measureILdate.start)) {
              isPassed = true
            } else {
              isPassed = false
            }
          }
        })
      }
    }
    return isPassed
  }

  function showHideArrows () {
    const requestSliderDiv: HTMLDivElement = timelineSliderRef.current as unknown as HTMLDivElement
    const maxScrollLeft = requestSliderDiv.scrollWidth - requestSliderDiv.clientWidth - 20
    if (requestSliderDiv.scrollLeft > 0) {
      setShowLeftArrow(true)
    } else {
      setShowLeftArrow(false)
    }
    if (requestSliderDiv.scrollLeft < maxScrollLeft) {
      setShowRightArrow(true)
    } else {
      setShowRightArrow(false)
    }
  }

  function changeSlide (ref: MutableRefObject<any>, delta: number) {
    const requestSliderDiv: HTMLDivElement = ref?.current as unknown as HTMLDivElement
    if (requestSliderDiv) {
      const width = requestSliderDiv.offsetWidth
      requestSliderDiv.scrollTo({ left: requestSliderDiv.scrollLeft + width * delta, top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={styles.md}>
        {measureMilestoneData?.measuerDates?.length > 0 && <div className={styles.mdMileStone}>
            { !props.skipTitle && <h2 className={styles.mdHeading}>{t('--measureMilestone--.--ilStartDates--')}</h2> }
            {
              hasListGrownOutOfView && showLeftArrow && props.isHorizontal &&
              <div className={styles.mdMileStoneContentLeftArrow} onClick={() => changeSlide(timelineSliderRef, -1)}>
                  <ChevronLeft size={16} color='var(--warm-prime-chalk)' />
              </div>
            }
            <div className={props.isHorizontal ? styles.mdMileStoneContent : styles.mdMileStoneContentVertical} ref={timelineSliderRef} onMouseOver={showHideArrows} onScroll={showHideArrows}>
              { measureMilestoneData?.measuerDates && measureMilestoneData?.measuerDates?.map((measuerDate, index) => {
                  return (
                    <div className={`${styles.mdContainer} ${props.isHorizontal ? styles.mdContainerOverflow : ''}`} key={index}>
                      <div className={`${props.isHorizontal ? styles.wrapperHorizontal : styles.wrapper}`}>
                        <div className={`${styles.mdContainerInfo} ${props.isHorizontal ? styles.mdContainerInfoHorizontal : ''}`}>
                          {props.isHorizontal && <div className={styles.mdContainerInfoBox}>
                            <div className={props.activeIndex && props.activeIndex === measuerDate.index ? styles.mdContainerInfoBoxAct  : styles.mdContainerInfoBoxIl}>IL{measuerDate.index}</div>
                            {!props.hideILName && <div className={styles.mdContainerInfoBoxName}>
                              <Tooltip title={localizedProcessNames[measuerDate?.displayName] || measuerDate?.displayName || measuerDate?.name}>
                                <span>{localizedProcessNames[measuerDate?.displayName] || measuerDate?.displayName || measuerDate?.name}</span>
                              </Tooltip>
                            </div>}
                          </div>}
                          {
                            props.activeIndex && props.activeIndex === measuerDate.index
                              ? <ActiveDot />
                              : props.activeIndex && props.activeIndex > measuerDate.index
                                ? <CompletedDot />
                                : <Dot />
                          }
                          {
                            measuerDate.index !== measureMilestoneData?.measuerDates.length && <span className={`${props.isHorizontal ? styles.mdContainerLineBtmHorizontal : styles.mdContainerLineBtm}`}></span>
                          }
                          {!props.isHorizontal && <div className={styles.mdContainerInfoBox}>
                            <div className={props.activeIndex && props.activeIndex === measuerDate.index ? styles.mdContainerInfoBoxAct  : styles.mdContainerInfoBoxIl}>IL{measuerDate.index}</div>
                            {!props.hideILName && <div className={styles.mdContainerInfoBoxName}>
                              <Tooltip title={localizedProcessNames[measuerDate?.displayName] || measuerDate?.displayName || measuerDate?.name}>
                                <span>{localizedProcessNames[measuerDate?.displayName] || measuerDate?.displayName || measuerDate?.name}</span>
                              </Tooltip>
                            </div>}
                          </div>}
                        </div>
                        <div className={styles.mdContainerDates}>
                          <div className={styles.mdContainerDatesValues}>
                            {!measuerDate.start && <div className={styles.mdContainerDatesValuesEmpty}>{t('--measureMilestone--.--date--')}</div>}
                            {measuerDate.start && !isDatePassedOrSame(measuerDate) && <div className={styles.mdContainerDatesValuesDate}>{getParsedDateForDisplay(measuerDate.start)}</div>}
                            {measuerDate.start && isDatePassedOrSame(measuerDate) && <div className={styles.mdContainerDatesValuesDateError}>{getParsedDateForDisplay(measuerDate.start)}</div>}
                            { measuerDate.start && !props.readonly &&
                              <div className={`${styles.mdContainerDatesValuesDateClear} ${isDatePassedOrSame(measuerDate) ? styles.mdContainerDatesValuesDateClearError : ''}`}>
                                <XCircle color='var(--warm-neutral-shade-200)' size={16} cursor='pointer' onClick={() => handleClearmeasureDate(measuerDate.index)}/>
                              </div>
                            }
                          </div>
                          {!props.readonly && <div className={styles.mdContainerDatesPicker}>
                            <ORODatePicker key={index}
                              label=""
                              required
                              allowClear={false}
                              value={getDateObject(measuerDate.start)}
                              onChange={(e) => handleMeasureDateChange(e, measuerDate.index)}
                            />
                          </div>}
                          {
                            props.isLoading && <div className={styles.loading}></div>
                          }
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            {
              hasListGrownOutOfView && showRightArrow && props.isHorizontal &&
              <div className={styles.mdMileStoneContentRightArrow} onClick={() => changeSlide(timelineSliderRef, 1)}>
                  <ChevronRight size={16} color='var(--warm-prime-chalk)' />
              </div>
            }
        </div>}
    </div>
  )
}
export function MeasureMilestone (props: MeasureMilestoneProps) {
  return <I18Suspense><MeasureMilestoneComponent  {...props} /></I18Suspense>
}

