import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { DatePicker, ConfigProvider } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import classNames from 'classnames';

import { DATE_DISPLAY_FORMAT, DATE_PAYLOAD_FORMAT, DATE_TIME_DISPLAY_FORMAT, formatDayjs, genericDateFormatter, isDateAfterLeadTime, isDateBeforeLeadTime } from '../Inputs/utils.service'
import { DateRangeObject } from '../Form/types';
import { getDatePickerLocale } from './services/dateLocale.service';
import { DateRange } from '../Inputs';
import { RangePickerProps } from 'antd/lib/date-picker';
import { DateConfig } from '../CustomFormDefinition/types/CustomFormModel';
import { ConfirmationDialog } from '../Modals/confirmation-dialog.component';
import { getI18Text as getI18ControlText, getI18Text } from '../i18n';
import { OroErrorTooltip } from '../Tooltip/error.component';
import { getSessionLocale } from '../sessionStorage';

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { isNumber } from '../util';

interface DatePropsNew {
  id?: string
  type?: 'week' | 'year' | 'month' | 'quarter' | 'time'
  hideBorder?: boolean
  value?: Date | null
  placeholder?: string
  disabled?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    dateConfig?: DateConfig
    maxDate?: Date | null
    minDate?: Date | null
  }
  inTableCell?: boolean
  validator?: (value?) => string | null
  onChange?: (value: string) => void
}

export function DateControlNew (props: DatePropsNew) {
  const [date, setDate] = useState<Dayjs | null>(null)

  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [pickerOpen, setPickerOpen] = useState<boolean>()
  const [defaultPickerValue, setDefaultPickerValue] = useState<Dayjs | null>(null)
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [tempDate, setTempDate] = useState<Dayjs | null>(null)

  useEffect(()=>{
    if(isNumber(props.config?.dateConfig?.leadTime)) {
      const leadTime =Number(props.config?.dateConfig?.leadTime)
      setDefaultPickerValue(dayjs().startOf('day').add(leadTime, 'day'))
    }else if(props.config?.minDate){
      setDefaultPickerValue(dayjs(props.config?.minDate).startOf('day'));
    }
  },[
    props.config?.minDate, props.config?.dateConfig?.leadTime
  ])
  
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days after (today + leadTime)
    if (props.config?.dateConfig?.issueDateLeadTime) {
      return isDateAfterLeadTime(current, props.config?.dateConfig?.issueDateLeadTime)
    }
    // Can not select days before (today + leadTime)
    return !props.config?.dateConfig?.allowBypassing && isDateBeforeLeadTime(current, props.config?.dateConfig?.leadTime)
  }

  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    const style: React.CSSProperties = {};
    if (defaultPickerValue && dayjs(current).isSame(defaultPickerValue, 'day')) {
      style.background = '#EFF6E7';
      style.borderRadius = '2px';
    }
    return (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );
  }

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
    setDate(props.value ? dayjs(genericDateFormatter(props.value)) : null)
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate) {
      validate()
    }
  }, [props.config])

  function validate (_date?: Dayjs | null) {
    const dt = _date !== undefined ? _date : date

    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      const parsedDate = dt ? dt.toDate() : null
      const err = props.validator(parsedDate)
      setError(err)
    }
  }

  function onChange (date: Dayjs) {
    const isBeforeLeadTime = isDateBeforeLeadTime(date, props.config?.dateConfig?.leadTime)

    if (isBeforeLeadTime && props.config.dateConfig.allowBypassing) {
      setTempDate(date)
      setPickerOpen(false)
      setConfirmation(true)
    } else {
      handleChange(date)
    }
  }

  function handleChange (date: Dayjs) {
    setDate(date || null)
    validate(date)
    setTempDate(null)

    if (props.onChange) {
      if (date && !isNaN(date.toDate() as unknown as number)) {
        props.onChange(formatDayjs(date, DATE_PAYLOAD_FORMAT))
      } else {
        props.onChange(null)
      }
    }
  }

  function handleFocus () {
    setFocused(true)
  }

  function handleBlur () {
    setFocused(false)
    // validate()
  }

  function getDisplayFormat () {
    switch (props.type) {
      case 'year':
        return 'YYYY'
      case 'month':
        return 'MMM YYYY'
    }

    return DATE_DISPLAY_FORMAT
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.date} data-test-id={props.id}>
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
          <div className={classNames(styles.antDateWrapper, { [styles.inTableCell]: props.inTableCell, [styles.invalid]: error })} data-test-id={props.id + 'Date'}>
            <DatePicker
              picker={props.type}
              // bordered={!props.hideBorder}
              variant={props.hideBorder ? 'borderless' : 'outlined'}
              format={getDisplayFormat()}
              locale={getDatePickerLocale(getSessionLocale())}
              value={date ? dayjs(date, DATE_DISPLAY_FORMAT) : null}
              // defaultValue={date ? dayjs(date, DATE_DISPLAY_FORMAT) : null}
              defaultPickerValue={date || defaultPickerValue || dayjs(new Date())}
              placeholder={props.placeholder || getI18ControlText('--fieldTypes--.--date--.--selectDate--')}
              status={error ? 'error' : undefined}
              // showToday={false}
              showNow={false}
              disabled={props.config?.isReadOnly}
              cellRender={cellRender}
              disabledDate={disabledDate}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onOpenChange={setPickerOpen}
              maxDate={props.config?.maxDate ? dayjs(props.config.maxDate) : undefined}
              minDate={props.config?.minDate ? dayjs(props.config.minDate) : undefined}
            />
          </div>
        </ConfigProvider>
      </div>
      {!props.inTableCell && error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
      {props.inTableCell && error &&
        <div className={styles.inTableCellAlert}>
          <OroErrorTooltip title={error}><img src={AlertCircle} /></OroErrorTooltip>
        </div>}
      <ConfirmationDialog
        theme='coco'
        isOpen={confirmation}
        title={getI18Text("--selectedDateIsOutsideDefinedLimit--")}
        description={getI18Text("--recommendedToPickDateWithinLimit--")}
        confirmDate={formatDayjs(tempDate, DATE_DISPLAY_FORMAT)}
        confirmationMessage={getI18Text("--confirmDateAndProceed--")}
        actionType='warning'
        primaryButton={getI18Text("--proceed--")}
        secondaryButton={getI18Text("--cancel--")}
        width={460}
        toggleModal={() => setConfirmation(false)}
        onPrimaryButtonClick={() => { setConfirmation(false); handleChange(tempDate) }}
        onSecondaryButtonClick={() => setConfirmation(false)}
      />
    </div>
  )
}

interface DateTimePropsNew {
  id?: string
  hideBorder?: boolean
  value?: string
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    dateConfig?: DateConfig
  }
  validator?: (value?) => string | null
  onChange?: (value: string) => void
}

export function DateTimeControlNew (props: DateTimePropsNew) {
  const [date, setDate] = useState<Dayjs | null>(null)

  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [pickerOpen, setPickerOpen] = useState<boolean>()
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [tempDate, setTempDate] = useState<Dayjs | null>(null)

  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    const style: React.CSSProperties = {};
    return (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );
  }

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
    setDate(props.value ? dayjs(props.value) : null)
  }, [props.value])

  useEffect(() => {
    if (props.config?.forceValidate) {
      validate()
    }
  }, [props.config])

  function validate (_date?: Dayjs | null) {
    const dt = _date !== undefined ? _date : date

    if (props.validator && !props.config.optional && !props.config.isReadOnly) {
      const parsedDate = dt ? dt.toDate().toISOString() : null
      const err = props.validator(parsedDate)
      setError(err ? err :  null)
    }
  }

  function handleChange (date: Dayjs) {
    setDate(date || null)
    validate(date)
    setTempDate(null)

    if (props.onChange) {
      if (date && !isNaN(date.toDate() as unknown as number)) {
        const isoString = date.toDate().toISOString()
        console.log('onChange: ', isoString)
        props.onChange(isoString)
      } else {
        props.onChange(null)
      }
    }
  }

  function handleFocus () {
    setFocused(true)
  }

  function handleBlur () {
    setFocused(false)
    validate()
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={styles.date} data-test-id={props.id}>
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
              colorPrimaryHover: focused ? '#82c146' : '#6A6A6A',
              colorError: '#CC483B',
              colorBgContainerDisabled: '#F8F8F8',
              colorTextDisabled: '#575F70',
              controlOutlineWidth: 0,
              zIndexPopupBase: 1350
            }
          }}
        >
          <div className={classNames(styles.antDateWrapper, { [styles.inTableCell]: props.inTableCell, [styles.invalid]: error })} data-test-id={props.id + 'Date'}>
            <DatePicker
              showTime={{ minuteStep: 5 }}
              bordered={!props.hideBorder}
              format={DATE_TIME_DISPLAY_FORMAT}
              locale={getDatePickerLocale(getSessionLocale())}
              value={date ? dayjs(date, DATE_TIME_DISPLAY_FORMAT) : null}
              defaultPickerValue={dayjs(new Date())}
              placeholder={props.placeholder || getI18ControlText('--fieldTypes--.--dateTime--.--selectDateTime--')}
              status={error ? 'error' : undefined}
              showToday={false}
              showNow={false}
              showSecond={false}
              cellRender={cellRender}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onOpenChange={setPickerOpen}
            />
          </div>
        </ConfigProvider>
      </div>
      {!props.inTableCell && error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
      {props.inTableCell && error &&
        <div className={styles.inTableCellAlert}>
          <OroErrorTooltip title={error}><img src={AlertCircle} /></OroErrorTooltip>
        </div>}
      <ConfirmationDialog
        theme='coco'
        isOpen={confirmation}
        title={getI18Text("--selectedDateIsOutsideDefinedLimit--")}
        description={getI18Text("--recommendedToPickDateWithinLimit--")}
        confirmDate={formatDayjs(tempDate, DATE_DISPLAY_FORMAT)}
        confirmationMessage={getI18Text("--confirmDateAndProceed--")}
        actionType='warning'
        primaryButton={getI18Text("--proceed--")}
        secondaryButton={getI18Text("--cancel--")}
        width={460}
        toggleModal={() => setConfirmation(false)}
        onPrimaryButtonClick={() => { setConfirmation(false); handleChange(tempDate) }}
        onSecondaryButtonClick={() => setConfirmation(false)}
      />
    </div>
  )
}

interface DateRangePropsNew {
  id?: string
  value: DateRangeObject
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    dateConfig?: DateConfig
  }
  validator?: (value?) => string | null
  onChange?: (value: DateRangeObject) => void
}

export function DateRangeControlNew (props: DateRangePropsNew) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    if (props.value && props.value.startDate) {
      setStartDate(props.value.startDate ? genericDateFormatter(props.value.startDate) : null)
    }

    if (props.value && props.value.endDate) {
      setEndDate(props.value.endDate ? genericDateFormatter(props.value.endDate) : null)
    }
  }, [props.value])

  function handleSelectionChange (startDate: string, endDate: string) {
    const parsedDateRange: DateRangeObject = { startDate: startDate ? moment(startDate).format(DATE_PAYLOAD_FORMAT) : '', endDate: endDate ? moment(endDate).format(DATE_PAYLOAD_FORMAT) : '' }
    if (props.onChange) {
      props.onChange(parsedDateRange)
    }
  }

  function handleDateRangeChange (start: string, end: string) {
    setStartDate(start ? genericDateFormatter(start) : null)
    setEndDate(end ? genericDateFormatter(end) : null)

    handleSelectionChange(start, end)
  }

  return (
    <div className={styles.date}>
      <DateRange
        label=""
        startDate={startDate}
        endDate={endDate}
        config={props.config?.dateConfig}
        locale={getSessionLocale()}
        onDateRangeChange={handleDateRangeChange}
        validator={props.validator}
        forceValidate={props.config?.forceValidate}
        required={!props.config.optional}
        disabled={props.config.isReadOnly}
        id={props.id}
        inTableCell={props.inTableCell}
      />
    </div>
  )
}
