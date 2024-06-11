import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { DatePicker, ConfigProvider } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { DateRangeProps, DatePickerProps } from './types'
import { InputWrapper } from './input.component'
import { parseDateToString, genericDateFormatter, isDateBeforeLeadTime, isDateAfterDuration, DATE_DISPLAY_FORMAT, formatDayjs, DATE_PAYLOAD_FORMAT } from './utils.service'
import { getDatePickerLocale } from '../controls/services/dateLocale.service'
import { DateConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { RangePickerProps } from 'antd/es/date-picker'
import { ConfirmationDialog } from '../Modals/confirmation-dialog.component'
import { getI18Text as getI18ControlText, getI18Text } from '../i18n'

import '../BootstrapTypeahead.scss'
import styles from './styles.module.scss'
import { getSessionLocale } from '../sessionStorage'

const { RangePicker } = DatePicker

export interface DateRangeAntProps extends DateRangeProps {
  startDateOptional?: boolean
  endDateOptional?: boolean
  config?: DateConfig
  locale: string
}

export function DateRange (props: DateRangeAntProps) {
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)

  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [pickerOpen, setPickerOpen] = useState<boolean>()
  const [defaultPickerValue, setDefaultPickerValue] = useState<Dayjs | null>(null)
  const [defaultPickerValue2, setDefaultPickerValue2] = useState<Dayjs | null>(null)
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [tempDates, setTempDates] = useState<[Dayjs, Dayjs] | null>(null)

  useEffect(() => {
    if (!props.disabled) {
      if (pickerOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [pickerOpen])
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    setStartDate(props.startDate ? dayjs(genericDateFormatter(props.startDate)) : null)
  }, [props.startDate])

  useEffect(() => {
    setEndDate(props.endDate ? dayjs(genericDateFormatter(props.endDate))  : null)
  }, [props.endDate])

  useEffect(() => {
    if (props.forceValidate) {
      validate()
    }
  }, [props.forceValidate])

  useEffect(() => {
    if (props.config && (props.config.leadTime !== undefined)) {
      const leadTime =  props.config?.leadTime || 0
      setDefaultPickerValue(dayjs().startOf('day').add(leadTime, 'day'))
    } else (
      setDefaultPickerValue(null)
    )

    if (props.config && (props.config.duration !== undefined)) {
      const duration =  props.config?.duration || 0
      setDefaultPickerValue2(dayjs().endOf('day').add(duration, 'day'))
    } else (
      setDefaultPickerValue2(null)
    )
  }, [props.config?.leadTime])

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before (today + leadTime)
    const isBeforeLeadTime = !props.config?.allowBypassing && isDateBeforeLeadTime(current, props.config?.leadTime)
    // Can not select days after (today + duration)
    const isAfterDuration = !props.config?.allowBypassing && isDateAfterDuration(current, props.config?.duration)

    return isBeforeLeadTime || isAfterDuration
  }

  // Highlight the preferred dates considering leadTime and duration
  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;

    const style: React.CSSProperties = {};
    if (
      (defaultPickerValue && dayjs(current).isSame(defaultPickerValue, 'day')) ||
      (defaultPickerValue2 && dayjs(current).isSame(defaultPickerValue2, 'day'))
    ) {
      style.background = '#EFF6E7';
      style.borderRadius = '2px';
    }

    return (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );
  }

  function validate (_startDate?: Dayjs | null, _endDate?: Dayjs | null) {
    const start = _startDate !== undefined ? _startDate : startDate
    const end = _endDate !== undefined ? _endDate : endDate

    if (props.validator && props.required && !props.disabled) {
      const parsedStartDate = start ? parseDateToString(start.toDate()) : null
      const parsedEndDate = end ? parseDateToString(end.toDate()) : null

      const err = props.validator({
        startDate: parsedStartDate,
        endDate: parsedEndDate
      })
      setError(err)
    }
  }

  function onChange (dates: [Dayjs, Dayjs]) {
    let isBeforeLeadTime = false
    let isAfterDuration = false

    if (dates?.[0] && dates?.[1]) {
      isBeforeLeadTime =  isDateBeforeLeadTime(dates[0], props.config?.leadTime)
      isAfterDuration = isDateAfterDuration(dates[1], props.config?.duration)
    }

    if ((isBeforeLeadTime || isAfterDuration) && props.config.allowBypassing) {
      setTempDates(dates)
      setConfirmation(true)
    } else {
      handleChange(dates)
    }
  }

  function getDayjsToString (dates: [Dayjs, Dayjs]): string | undefined {
    const startDate = formatDayjs(dates?.[0], DATE_DISPLAY_FORMAT)
    const endDate = formatDayjs(dates?.[1], DATE_DISPLAY_FORMAT)

    if (startDate && endDate) {
      return `${startDate} - ${endDate}`
    }
  }

  function handleChange (dates: [Dayjs, Dayjs]) {
    setStartDate(dates?.[0] || null)
    setEndDate(dates?.[1] || null)
    setTempDates(null)

    validate(dates?.[0] || null, dates?.[1] || null)

    if (props.onDateRangeChange) {
      const parsedStartDate = dates?.[0] ? formatDayjs(dates[0], DATE_PAYLOAD_FORMAT) : null
      const parsedEndDate = dates?.[1] ? formatDayjs(dates[1], DATE_PAYLOAD_FORMAT) : null
      props.onDateRangeChange(parsedStartDate, parsedEndDate)
    }
  }

  function handleFocus () {
    setFocused(true)
  }

  function handleBlur () {
    setFocused(false)
    // validate()
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.daterange}
      error={error}
      inTableCell={props.inTableCell}
    >
      <ConfigProvider
        theme={{
          token: {
            borderRadius: props.inTableCell ? 0 : 4,
            fontFamily: 'Inter',
            controlHeight: 40,
            colorText: '#3E4456',
            colorTextQuaternary: '#848484',
            colorPrimary: '#82c146',
            colorPrimaryBg: '#EFF6E7',
            colorBorder: props.inTableCell ? 'transparent' : '#CACACA',
            colorPrimaryHover: error ? '#CC483B' : (focused ? '#82c146' : '#6A6A6A'),
            colorError: '#CC483B',
            colorBgContainerDisabled: '#F8F8F8',
            colorTextDisabled: '#575F70',
            controlOutlineWidth: 0,
            zIndexPopupBase: 1350
          }
        }}
      >
        <div className={classnames(styles.antDateRangeWrapper, { [styles.inTableCell]: props.inTableCell, [styles.invalid]: error })} data-test-id={props.id + 'DateRange'}>
          <RangePicker
            format={DATE_DISPLAY_FORMAT}
            locale={getDatePickerLocale(props.locale)}
            value={[startDate ? dayjs(startDate, DATE_DISPLAY_FORMAT) : null, endDate ? dayjs(endDate, DATE_DISPLAY_FORMAT) : null]}
            // defaultValue={[startDate ? dayjs(startDate, DATE_DISPLAY_FORMAT) : null , endDate ? dayjs(endDate, DATE_DISPLAY_FORMAT) : null]}
            defaultPickerValue={[defaultPickerValue || dayjs(new Date()), defaultPickerValue2 || (defaultPickerValue || dayjs(new Date())).add(1, 'month')]}
            placeholder={[getI18ControlText('--fieldTypes--.--dateRange--.--startDate--'), getI18ControlText('--fieldTypes--.--dateRange--.--endDate--')]}
            allowEmpty={[true, true]}
            status={error ? 'error' : undefined}
            cellRender={cellRender}
            disabledDate={disabledDate}
            onChange={onChange}
            onFocus={handleFocus}
            // onBlur={handleBlur}
            onOpenChange={setPickerOpen}
          />
        </div>
      </ConfigProvider>

      <ConfirmationDialog
        theme='coco'
        isOpen={confirmation}
        title={getI18Text("--selectedDateIsOutsideDefinedLimit--")}
        description={getI18Text("--recommendedToPickDateWithinLimit--")}
        confirmDate={getDayjsToString(tempDates)}
        confirmationMessage={getI18Text("--confirmDateAndProceed--")}
        actionType='warning'
        primaryButton={getI18Text("--proceed--")}
        secondaryButton={getI18Text("--cancel--")}
        width={460}
        toggleModal={() => setConfirmation(false)}
        onPrimaryButtonClick={() => {setConfirmation(false); handleChange(tempDates)}}
        onSecondaryButtonClick={() => setConfirmation(false)}
      />
    </InputWrapper>
  )
}

export function ORODatePicker (props: DatePickerProps) {
  const [date, setDate] = useState<Dayjs | null>(null)
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [pickerOpen, setPickerOpen] = useState<boolean>()

  useEffect(() => {
    if (!props.disabled) {
      if (pickerOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [pickerOpen])
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!(dayjs(props.value).isSame(date))) {
      setDate(props.value ? dayjs(genericDateFormatter(props.value, DATE_DISPLAY_FORMAT)) : null)
    }
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate) {
      validate()
    }
  }, [props.forceValidate])

  function validate (_date?: Dayjs | null) {
    const dt = _date !== undefined ? _date : date

    if (props.validator && props.required && !props.disabled) {
      const parsedDate = dt ? parseDateToString(dt.toDate()) : null
      const err = props.validator(parsedDate)
      setError(err)
    }
  }

  function handleChange (date: Dayjs) {
    setDate(date || null)
    validate(date)

    if (props.onChange) {
      const parsedDate = date ? parseDateToString(date.toDate()) : null
      props.onChange(parsedDate)
    }
  }

  function handleFocus () {
    setFocused(true)
  }

  function handleBlur () {
    setFocused(false)
    // TODO. as per antd 5.16.5, onBlur work best with RangePicker.
    // for Date Picker its being called twice with onChange. e.g. 'onBlur' -> 'onChange' -> 'onBlur' which trigger error message.
    // hence commenting until being resolved in new antd version
    // validate()
  }

  function disableDateIfOutsideRange (date: Dayjs): boolean {
    if (props.disableDateBeforeAfter?.startDate || props.disableDateBeforeAfter?.endDate) {
      const startDate = dayjs(props.disableDateBeforeAfter?.startDate)
      const endDate = dayjs(props.disableDateBeforeAfter?.endDate)
      return date.isBefore(startDate) || date.isAfter(endDate)
    } else {
      return false
    }
  }

  function getDefaultDatePickerValue (): Dayjs | null {
    if (props.disableDateBeforeAfter?.startDate) {
      return dayjs(props.disableDateBeforeAfter?.startDate)
    } else if (props.disableDateBeforeAfter?.endDate) {
      return dayjs(props.disableDateBeforeAfter?.endDate)
    } else {
      return undefined
    }
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.datesingle}
      error={error}
    >
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 4,
            fontFamily: 'Inter',
            controlHeight: 40,
            colorText: '#3E4456',
            colorTextQuaternary: '#848484',
            colorPrimary: '#82c146',
            colorPrimaryBg: '#EFF6E7',
            colorBorder: '#CACACA',
            colorPrimaryHover: error ? '#CC483B' : (focused ? '#82c146' : '#6A6A6A'),
            colorError: '#CC483B',
            controlOutlineWidth: 0,
            zIndexPopupBase: 1350
          }
        }}
      >
        <div className={styles.antDateWrapper} data-test-id={props.id + 'Date'}>
          <DatePicker
            format={DATE_DISPLAY_FORMAT}
            locale={getDatePickerLocale(getSessionLocale())}
            // value={date ? dayjs(date, DATE_DISPLAY_FORMAT) : null}
            value={date || null}
            // defaultValue={date ? dayjs(date, DATE_DISPLAY_FORMAT) : null}
            placeholder={props.placeholder}
            defaultPickerValue={getDefaultDatePickerValue()}
            status={error ? 'error' : undefined}
            showNow={false}
            allowClear={props.allowClear}
            disabledDate={disableDateIfOutsideRange}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onOpenChange={setPickerOpen}
          />
        </div>
      </ConfigProvider>
    </InputWrapper>
  )
}
